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
const ns = T.XmlNamespace("http://dax.amazonaws.com/doc/2017-04-19/");
const svc = T.AwsApiService({ sdkId: "DAX", serviceShapeName: "AmazonDAXV3" });
const auth = T.AwsAuthSigv4({ name: "dax" });
const ver = T.ServiceVersion("2017-04-19");
const proto = T.AwsProtocolsAwsJson1_1();
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
              `https://dax-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://dax-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://dax.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://dax.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Integer = number;
export type IntegerOptional = number;
export type ExceptionMessage = string;
export type AwsQueryErrorMessage = string;

//# Schemas
export type AvailabilityZoneList = string[];
export const AvailabilityZoneList = S.Array(S.String);
export type SecurityGroupIdentifierList = string[];
export const SecurityGroupIdentifierList = S.Array(S.String);
export type SubnetIdentifierList = string[];
export const SubnetIdentifierList = S.Array(S.String);
export type NodeIdentifierList = string[];
export const NodeIdentifierList = S.Array(S.String);
export type ClusterNameList = string[];
export const ClusterNameList = S.Array(S.String);
export type ParameterGroupNameList = string[];
export const ParameterGroupNameList = S.Array(S.String);
export type SubnetGroupNameList = string[];
export const SubnetGroupNameList = S.Array(S.String);
export type KeyList = string[];
export const KeyList = S.Array(S.String);
export interface CreateParameterGroupRequest {
  ParameterGroupName: string;
  Description?: string;
}
export const CreateParameterGroupRequest = S.suspend(() =>
  S.Struct({
    ParameterGroupName: S.String,
    Description: S.optional(S.String),
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
  identifier: "CreateParameterGroupRequest",
}) as any as S.Schema<CreateParameterGroupRequest>;
export interface CreateSubnetGroupRequest {
  SubnetGroupName: string;
  Description?: string;
  SubnetIds: SubnetIdentifierList;
}
export const CreateSubnetGroupRequest = S.suspend(() =>
  S.Struct({
    SubnetGroupName: S.String,
    Description: S.optional(S.String),
    SubnetIds: SubnetIdentifierList,
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
  identifier: "CreateSubnetGroupRequest",
}) as any as S.Schema<CreateSubnetGroupRequest>;
export interface DecreaseReplicationFactorRequest {
  ClusterName: string;
  NewReplicationFactor: number;
  AvailabilityZones?: AvailabilityZoneList;
  NodeIdsToRemove?: NodeIdentifierList;
}
export const DecreaseReplicationFactorRequest = S.suspend(() =>
  S.Struct({
    ClusterName: S.String,
    NewReplicationFactor: S.Number,
    AvailabilityZones: S.optional(AvailabilityZoneList),
    NodeIdsToRemove: S.optional(NodeIdentifierList),
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
  identifier: "DecreaseReplicationFactorRequest",
}) as any as S.Schema<DecreaseReplicationFactorRequest>;
export interface DeleteClusterRequest {
  ClusterName: string;
}
export const DeleteClusterRequest = S.suspend(() =>
  S.Struct({ ClusterName: S.String }).pipe(
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
  identifier: "DeleteClusterRequest",
}) as any as S.Schema<DeleteClusterRequest>;
export interface DeleteParameterGroupRequest {
  ParameterGroupName: string;
}
export const DeleteParameterGroupRequest = S.suspend(() =>
  S.Struct({ ParameterGroupName: S.String }).pipe(
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
  identifier: "DeleteParameterGroupRequest",
}) as any as S.Schema<DeleteParameterGroupRequest>;
export interface DeleteSubnetGroupRequest {
  SubnetGroupName: string;
}
export const DeleteSubnetGroupRequest = S.suspend(() =>
  S.Struct({ SubnetGroupName: S.String }).pipe(
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
  identifier: "DeleteSubnetGroupRequest",
}) as any as S.Schema<DeleteSubnetGroupRequest>;
export interface DescribeClustersRequest {
  ClusterNames?: ClusterNameList;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeClustersRequest = S.suspend(() =>
  S.Struct({
    ClusterNames: S.optional(ClusterNameList),
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
  identifier: "DescribeClustersRequest",
}) as any as S.Schema<DescribeClustersRequest>;
export interface DescribeDefaultParametersRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeDefaultParametersRequest = S.suspend(() =>
  S.Struct({
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
  identifier: "DescribeDefaultParametersRequest",
}) as any as S.Schema<DescribeDefaultParametersRequest>;
export interface DescribeEventsRequest {
  SourceName?: string;
  SourceType?: string;
  StartTime?: Date;
  EndTime?: Date;
  Duration?: number;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeEventsRequest = S.suspend(() =>
  S.Struct({
    SourceName: S.optional(S.String),
    SourceType: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Duration: S.optional(S.Number),
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
  identifier: "DescribeEventsRequest",
}) as any as S.Schema<DescribeEventsRequest>;
export interface DescribeParameterGroupsRequest {
  ParameterGroupNames?: ParameterGroupNameList;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeParameterGroupsRequest = S.suspend(() =>
  S.Struct({
    ParameterGroupNames: S.optional(ParameterGroupNameList),
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
  identifier: "DescribeParameterGroupsRequest",
}) as any as S.Schema<DescribeParameterGroupsRequest>;
export interface DescribeParametersRequest {
  ParameterGroupName: string;
  Source?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeParametersRequest = S.suspend(() =>
  S.Struct({
    ParameterGroupName: S.String,
    Source: S.optional(S.String),
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
  identifier: "DescribeParametersRequest",
}) as any as S.Schema<DescribeParametersRequest>;
export interface DescribeSubnetGroupsRequest {
  SubnetGroupNames?: SubnetGroupNameList;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeSubnetGroupsRequest = S.suspend(() =>
  S.Struct({
    SubnetGroupNames: S.optional(SubnetGroupNameList),
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
  identifier: "DescribeSubnetGroupsRequest",
}) as any as S.Schema<DescribeSubnetGroupsRequest>;
export interface IncreaseReplicationFactorRequest {
  ClusterName: string;
  NewReplicationFactor: number;
  AvailabilityZones?: AvailabilityZoneList;
}
export const IncreaseReplicationFactorRequest = S.suspend(() =>
  S.Struct({
    ClusterName: S.String,
    NewReplicationFactor: S.Number,
    AvailabilityZones: S.optional(AvailabilityZoneList),
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
  identifier: "IncreaseReplicationFactorRequest",
}) as any as S.Schema<IncreaseReplicationFactorRequest>;
export interface ListTagsRequest {
  ResourceName: string;
  NextToken?: string;
}
export const ListTagsRequest = S.suspend(() =>
  S.Struct({ ResourceName: S.String, NextToken: S.optional(S.String) }).pipe(
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
  identifier: "ListTagsRequest",
}) as any as S.Schema<ListTagsRequest>;
export interface RebootNodeRequest {
  ClusterName: string;
  NodeId: string;
}
export const RebootNodeRequest = S.suspend(() =>
  S.Struct({ ClusterName: S.String, NodeId: S.String }).pipe(
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
  identifier: "RebootNodeRequest",
}) as any as S.Schema<RebootNodeRequest>;
export interface Tag {
  Key?: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface TagResourceRequest {
  ResourceName: string;
  Tags: TagList;
}
export const TagResourceRequest = S.suspend(() =>
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
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface UntagResourceRequest {
  ResourceName: string;
  TagKeys: KeyList;
}
export const UntagResourceRequest = S.suspend(() =>
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
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UpdateClusterRequest {
  ClusterName: string;
  Description?: string;
  PreferredMaintenanceWindow?: string;
  NotificationTopicArn?: string;
  NotificationTopicStatus?: string;
  ParameterGroupName?: string;
  SecurityGroupIds?: SecurityGroupIdentifierList;
}
export const UpdateClusterRequest = S.suspend(() =>
  S.Struct({
    ClusterName: S.String,
    Description: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    NotificationTopicArn: S.optional(S.String),
    NotificationTopicStatus: S.optional(S.String),
    ParameterGroupName: S.optional(S.String),
    SecurityGroupIds: S.optional(SecurityGroupIdentifierList),
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
  identifier: "UpdateClusterRequest",
}) as any as S.Schema<UpdateClusterRequest>;
export interface UpdateSubnetGroupRequest {
  SubnetGroupName: string;
  Description?: string;
  SubnetIds?: SubnetIdentifierList;
}
export const UpdateSubnetGroupRequest = S.suspend(() =>
  S.Struct({
    SubnetGroupName: S.String,
    Description: S.optional(S.String),
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
  identifier: "UpdateSubnetGroupRequest",
}) as any as S.Schema<UpdateSubnetGroupRequest>;
export interface SSESpecification {
  Enabled: boolean;
}
export const SSESpecification = S.suspend(() =>
  S.Struct({ Enabled: S.Boolean }),
).annotations({
  identifier: "SSESpecification",
}) as any as S.Schema<SSESpecification>;
export interface Endpoint {
  Address?: string;
  Port?: number;
  URL?: string;
}
export const Endpoint = S.suspend(() =>
  S.Struct({
    Address: S.optional(S.String),
    Port: S.optional(S.Number),
    URL: S.optional(S.String),
  }),
).annotations({ identifier: "Endpoint" }) as any as S.Schema<Endpoint>;
export interface Node {
  NodeId?: string;
  Endpoint?: Endpoint;
  NodeCreateTime?: Date;
  AvailabilityZone?: string;
  NodeStatus?: string;
  ParameterGroupStatus?: string;
}
export const Node = S.suspend(() =>
  S.Struct({
    NodeId: S.optional(S.String),
    Endpoint: S.optional(Endpoint),
    NodeCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    AvailabilityZone: S.optional(S.String),
    NodeStatus: S.optional(S.String),
    ParameterGroupStatus: S.optional(S.String),
  }),
).annotations({ identifier: "Node" }) as any as S.Schema<Node>;
export type NodeList = Node[];
export const NodeList = S.Array(Node);
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
export interface SecurityGroupMembership {
  SecurityGroupIdentifier?: string;
  Status?: string;
}
export const SecurityGroupMembership = S.suspend(() =>
  S.Struct({
    SecurityGroupIdentifier: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "SecurityGroupMembership",
}) as any as S.Schema<SecurityGroupMembership>;
export type SecurityGroupMembershipList = SecurityGroupMembership[];
export const SecurityGroupMembershipList = S.Array(SecurityGroupMembership);
export interface ParameterGroupStatus {
  ParameterGroupName?: string;
  ParameterApplyStatus?: string;
  NodeIdsToReboot?: NodeIdentifierList;
}
export const ParameterGroupStatus = S.suspend(() =>
  S.Struct({
    ParameterGroupName: S.optional(S.String),
    ParameterApplyStatus: S.optional(S.String),
    NodeIdsToReboot: S.optional(NodeIdentifierList),
  }),
).annotations({
  identifier: "ParameterGroupStatus",
}) as any as S.Schema<ParameterGroupStatus>;
export interface SSEDescription {
  Status?: string;
}
export const SSEDescription = S.suspend(() =>
  S.Struct({ Status: S.optional(S.String) }),
).annotations({
  identifier: "SSEDescription",
}) as any as S.Schema<SSEDescription>;
export interface Cluster {
  ClusterName?: string;
  Description?: string;
  ClusterArn?: string;
  TotalNodes?: number;
  ActiveNodes?: number;
  NodeType?: string;
  Status?: string;
  ClusterDiscoveryEndpoint?: Endpoint;
  NodeIdsToRemove?: NodeIdentifierList;
  Nodes?: NodeList;
  PreferredMaintenanceWindow?: string;
  NotificationConfiguration?: NotificationConfiguration;
  SubnetGroup?: string;
  SecurityGroups?: SecurityGroupMembershipList;
  IamRoleArn?: string;
  ParameterGroup?: ParameterGroupStatus;
  SSEDescription?: SSEDescription;
  ClusterEndpointEncryptionType?: string;
  NetworkType?: string;
}
export const Cluster = S.suspend(() =>
  S.Struct({
    ClusterName: S.optional(S.String),
    Description: S.optional(S.String),
    ClusterArn: S.optional(S.String),
    TotalNodes: S.optional(S.Number),
    ActiveNodes: S.optional(S.Number),
    NodeType: S.optional(S.String),
    Status: S.optional(S.String),
    ClusterDiscoveryEndpoint: S.optional(Endpoint),
    NodeIdsToRemove: S.optional(NodeIdentifierList),
    Nodes: S.optional(NodeList),
    PreferredMaintenanceWindow: S.optional(S.String),
    NotificationConfiguration: S.optional(NotificationConfiguration),
    SubnetGroup: S.optional(S.String),
    SecurityGroups: S.optional(SecurityGroupMembershipList),
    IamRoleArn: S.optional(S.String),
    ParameterGroup: S.optional(ParameterGroupStatus),
    SSEDescription: S.optional(SSEDescription),
    ClusterEndpointEncryptionType: S.optional(S.String),
    NetworkType: S.optional(S.String),
  }),
).annotations({ identifier: "Cluster" }) as any as S.Schema<Cluster>;
export type ClusterList = Cluster[];
export const ClusterList = S.Array(Cluster);
export interface ParameterGroup {
  ParameterGroupName?: string;
  Description?: string;
}
export const ParameterGroup = S.suspend(() =>
  S.Struct({
    ParameterGroupName: S.optional(S.String),
    Description: S.optional(S.String),
  }),
).annotations({
  identifier: "ParameterGroup",
}) as any as S.Schema<ParameterGroup>;
export type ParameterGroupList = ParameterGroup[];
export const ParameterGroupList = S.Array(ParameterGroup);
export type NetworkTypeList = string[];
export const NetworkTypeList = S.Array(S.String);
export interface Subnet {
  SubnetIdentifier?: string;
  SubnetAvailabilityZone?: string;
  SupportedNetworkTypes?: NetworkTypeList;
}
export const Subnet = S.suspend(() =>
  S.Struct({
    SubnetIdentifier: S.optional(S.String),
    SubnetAvailabilityZone: S.optional(S.String),
    SupportedNetworkTypes: S.optional(NetworkTypeList),
  }),
).annotations({ identifier: "Subnet" }) as any as S.Schema<Subnet>;
export type SubnetList = Subnet[];
export const SubnetList = S.Array(Subnet);
export interface SubnetGroup {
  SubnetGroupName?: string;
  Description?: string;
  VpcId?: string;
  Subnets?: SubnetList;
  SupportedNetworkTypes?: NetworkTypeList;
}
export const SubnetGroup = S.suspend(() =>
  S.Struct({
    SubnetGroupName: S.optional(S.String),
    Description: S.optional(S.String),
    VpcId: S.optional(S.String),
    Subnets: S.optional(SubnetList),
    SupportedNetworkTypes: S.optional(NetworkTypeList),
  }),
).annotations({ identifier: "SubnetGroup" }) as any as S.Schema<SubnetGroup>;
export type SubnetGroupList = SubnetGroup[];
export const SubnetGroupList = S.Array(SubnetGroup);
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
export const ParameterNameValueList = S.Array(ParameterNameValue);
export interface CreateClusterRequest {
  ClusterName: string;
  NodeType: string;
  Description?: string;
  ReplicationFactor: number;
  AvailabilityZones?: AvailabilityZoneList;
  SubnetGroupName?: string;
  SecurityGroupIds?: SecurityGroupIdentifierList;
  PreferredMaintenanceWindow?: string;
  NotificationTopicArn?: string;
  IamRoleArn: string;
  ParameterGroupName?: string;
  Tags?: TagList;
  SSESpecification?: SSESpecification;
  ClusterEndpointEncryptionType?: string;
  NetworkType?: string;
}
export const CreateClusterRequest = S.suspend(() =>
  S.Struct({
    ClusterName: S.String,
    NodeType: S.String,
    Description: S.optional(S.String),
    ReplicationFactor: S.Number,
    AvailabilityZones: S.optional(AvailabilityZoneList),
    SubnetGroupName: S.optional(S.String),
    SecurityGroupIds: S.optional(SecurityGroupIdentifierList),
    PreferredMaintenanceWindow: S.optional(S.String),
    NotificationTopicArn: S.optional(S.String),
    IamRoleArn: S.String,
    ParameterGroupName: S.optional(S.String),
    Tags: S.optional(TagList),
    SSESpecification: S.optional(SSESpecification),
    ClusterEndpointEncryptionType: S.optional(S.String),
    NetworkType: S.optional(S.String),
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
  identifier: "CreateClusterRequest",
}) as any as S.Schema<CreateClusterRequest>;
export interface DeleteClusterResponse {
  Cluster?: Cluster;
}
export const DeleteClusterResponse = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "DeleteClusterResponse",
}) as any as S.Schema<DeleteClusterResponse>;
export interface DeleteParameterGroupResponse {
  DeletionMessage?: string;
}
export const DeleteParameterGroupResponse = S.suspend(() =>
  S.Struct({ DeletionMessage: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteParameterGroupResponse",
}) as any as S.Schema<DeleteParameterGroupResponse>;
export interface DeleteSubnetGroupResponse {
  DeletionMessage?: string;
}
export const DeleteSubnetGroupResponse = S.suspend(() =>
  S.Struct({ DeletionMessage: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteSubnetGroupResponse",
}) as any as S.Schema<DeleteSubnetGroupResponse>;
export interface DescribeClustersResponse {
  NextToken?: string;
  Clusters?: ClusterList;
}
export const DescribeClustersResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Clusters: S.optional(ClusterList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeClustersResponse",
}) as any as S.Schema<DescribeClustersResponse>;
export interface DescribeParameterGroupsResponse {
  NextToken?: string;
  ParameterGroups?: ParameterGroupList;
}
export const DescribeParameterGroupsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ParameterGroups: S.optional(ParameterGroupList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeParameterGroupsResponse",
}) as any as S.Schema<DescribeParameterGroupsResponse>;
export interface NodeTypeSpecificValue {
  NodeType?: string;
  Value?: string;
}
export const NodeTypeSpecificValue = S.suspend(() =>
  S.Struct({ NodeType: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "NodeTypeSpecificValue",
}) as any as S.Schema<NodeTypeSpecificValue>;
export type NodeTypeSpecificValueList = NodeTypeSpecificValue[];
export const NodeTypeSpecificValueList = S.Array(NodeTypeSpecificValue);
export interface Parameter {
  ParameterName?: string;
  ParameterType?: string;
  ParameterValue?: string;
  NodeTypeSpecificValues?: NodeTypeSpecificValueList;
  Description?: string;
  Source?: string;
  DataType?: string;
  AllowedValues?: string;
  IsModifiable?: string;
  ChangeType?: string;
}
export const Parameter = S.suspend(() =>
  S.Struct({
    ParameterName: S.optional(S.String),
    ParameterType: S.optional(S.String),
    ParameterValue: S.optional(S.String),
    NodeTypeSpecificValues: S.optional(NodeTypeSpecificValueList),
    Description: S.optional(S.String),
    Source: S.optional(S.String),
    DataType: S.optional(S.String),
    AllowedValues: S.optional(S.String),
    IsModifiable: S.optional(S.String),
    ChangeType: S.optional(S.String),
  }),
).annotations({ identifier: "Parameter" }) as any as S.Schema<Parameter>;
export type ParameterList = Parameter[];
export const ParameterList = S.Array(Parameter);
export interface DescribeParametersResponse {
  NextToken?: string;
  Parameters?: ParameterList;
}
export const DescribeParametersResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Parameters: S.optional(ParameterList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeParametersResponse",
}) as any as S.Schema<DescribeParametersResponse>;
export interface DescribeSubnetGroupsResponse {
  NextToken?: string;
  SubnetGroups?: SubnetGroupList;
}
export const DescribeSubnetGroupsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    SubnetGroups: S.optional(SubnetGroupList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeSubnetGroupsResponse",
}) as any as S.Schema<DescribeSubnetGroupsResponse>;
export interface IncreaseReplicationFactorResponse {
  Cluster?: Cluster;
}
export const IncreaseReplicationFactorResponse = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "IncreaseReplicationFactorResponse",
}) as any as S.Schema<IncreaseReplicationFactorResponse>;
export interface ListTagsResponse {
  Tags?: TagList;
  NextToken?: string;
}
export const ListTagsResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList), NextToken: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "ListTagsResponse",
}) as any as S.Schema<ListTagsResponse>;
export interface RebootNodeResponse {
  Cluster?: Cluster;
}
export const RebootNodeResponse = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "RebootNodeResponse",
}) as any as S.Schema<RebootNodeResponse>;
export interface TagResourceResponse {
  Tags?: TagList;
}
export const TagResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceResponse {
  Tags?: TagList;
}
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateClusterResponse {
  Cluster?: Cluster;
}
export const UpdateClusterResponse = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "UpdateClusterResponse",
}) as any as S.Schema<UpdateClusterResponse>;
export interface UpdateParameterGroupRequest {
  ParameterGroupName: string;
  ParameterNameValues: ParameterNameValueList;
}
export const UpdateParameterGroupRequest = S.suspend(() =>
  S.Struct({
    ParameterGroupName: S.String,
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
  identifier: "UpdateParameterGroupRequest",
}) as any as S.Schema<UpdateParameterGroupRequest>;
export interface UpdateSubnetGroupResponse {
  SubnetGroup?: SubnetGroup;
}
export const UpdateSubnetGroupResponse = S.suspend(() =>
  S.Struct({ SubnetGroup: S.optional(SubnetGroup) }).pipe(ns),
).annotations({
  identifier: "UpdateSubnetGroupResponse",
}) as any as S.Schema<UpdateSubnetGroupResponse>;
export interface Event {
  SourceName?: string;
  SourceType?: string;
  Message?: string;
  Date?: Date;
}
export const Event = S.suspend(() =>
  S.Struct({
    SourceName: S.optional(S.String),
    SourceType: S.optional(S.String),
    Message: S.optional(S.String),
    Date: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Event" }) as any as S.Schema<Event>;
export type EventList = Event[];
export const EventList = S.Array(Event);
export interface CreateClusterResponse {
  Cluster?: Cluster;
}
export const CreateClusterResponse = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "CreateClusterResponse",
}) as any as S.Schema<CreateClusterResponse>;
export interface CreateParameterGroupResponse {
  ParameterGroup?: ParameterGroup;
}
export const CreateParameterGroupResponse = S.suspend(() =>
  S.Struct({ ParameterGroup: S.optional(ParameterGroup) }).pipe(ns),
).annotations({
  identifier: "CreateParameterGroupResponse",
}) as any as S.Schema<CreateParameterGroupResponse>;
export interface DescribeEventsResponse {
  NextToken?: string;
  Events?: EventList;
}
export const DescribeEventsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Events: S.optional(EventList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeEventsResponse",
}) as any as S.Schema<DescribeEventsResponse>;
export interface UpdateParameterGroupResponse {
  ParameterGroup?: ParameterGroup;
}
export const UpdateParameterGroupResponse = S.suspend(() =>
  S.Struct({ ParameterGroup: S.optional(ParameterGroup) }).pipe(ns),
).annotations({
  identifier: "UpdateParameterGroupResponse",
}) as any as S.Schema<UpdateParameterGroupResponse>;
export interface CreateSubnetGroupResponse {
  SubnetGroup?: SubnetGroup;
}
export const CreateSubnetGroupResponse = S.suspend(() =>
  S.Struct({ SubnetGroup: S.optional(SubnetGroup) }).pipe(ns),
).annotations({
  identifier: "CreateSubnetGroupResponse",
}) as any as S.Schema<CreateSubnetGroupResponse>;
export interface DecreaseReplicationFactorResponse {
  Cluster?: Cluster;
}
export const DecreaseReplicationFactorResponse = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "DecreaseReplicationFactorResponse",
}) as any as S.Schema<DecreaseReplicationFactorResponse>;
export interface DescribeDefaultParametersResponse {
  NextToken?: string;
  Parameters?: ParameterList;
}
export const DescribeDefaultParametersResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Parameters: S.optional(ParameterList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDefaultParametersResponse",
}) as any as S.Schema<DescribeDefaultParametersResponse>;

//# Errors
export class ClusterNotFoundFault extends S.TaggedError<ClusterNotFoundFault>()(
  "ClusterNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ClusterNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidParameterCombinationException extends S.TaggedError<InvalidParameterCombinationException>()(
  "InvalidParameterCombinationException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidParameterCombination",
    httpResponseCode: 400,
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
export class InvalidSubnet extends S.TaggedError<InvalidSubnet>()(
  "InvalidSubnet",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSubnet", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ClusterAlreadyExistsFault extends S.TaggedError<ClusterAlreadyExistsFault>()(
  "ClusterAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ClusterAlreadyExists", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidClusterStateFault extends S.TaggedError<InvalidClusterStateFault>()(
  "InvalidClusterStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidClusterState", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidParameterGroupStateFault extends S.TaggedError<InvalidParameterGroupStateFault>()(
  "InvalidParameterGroupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidParameterGroupState",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SubnetGroupInUseFault extends S.TaggedError<SubnetGroupInUseFault>()(
  "SubnetGroupInUseFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetGroupInUse", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidParameterValue", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class SubnetGroupNotFoundFault extends S.TaggedError<SubnetGroupNotFoundFault>()(
  "SubnetGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetGroupNotFoundFault", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InsufficientClusterCapacityFault extends S.TaggedError<InsufficientClusterCapacityFault>()(
  "InsufficientClusterCapacityFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientClusterCapacity",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidARNFault extends S.TaggedError<InvalidARNFault>()(
  "InvalidARNFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidARN", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ClusterQuotaForCustomerExceededFault extends S.TaggedError<ClusterQuotaForCustomerExceededFault>()(
  "ClusterQuotaForCustomerExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClusterQuotaForCustomerExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SubnetGroupAlreadyExistsFault extends S.TaggedError<SubnetGroupAlreadyExistsFault>()(
  "SubnetGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetGroupAlreadyExists", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class SubnetInUse extends S.TaggedError<SubnetInUse>()(
  "SubnetInUse",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetInUse", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidVPCNetworkStateFault extends S.TaggedError<InvalidVPCNetworkStateFault>()(
  "InvalidVPCNetworkStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidVPCNetworkStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class NodeNotFoundFault extends S.TaggedError<NodeNotFoundFault>()(
  "NodeNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "NodeNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ParameterGroupNotFoundFault extends S.TaggedError<ParameterGroupNotFoundFault>()(
  "ParameterGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ParameterGroupNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ParameterGroupAlreadyExistsFault extends S.TaggedError<ParameterGroupAlreadyExistsFault>()(
  "ParameterGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ParameterGroupAlreadyExists",
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
export class TagNotFoundFault extends S.TaggedError<TagNotFoundFault>()(
  "TagNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "TagNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class SubnetGroupQuotaExceededFault extends S.TaggedError<SubnetGroupQuotaExceededFault>()(
  "SubnetGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetGroupQuotaExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class SubnetNotAllowedFault extends S.TaggedError<SubnetNotAllowedFault>()(
  "SubnetNotAllowedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetNotAllowedFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class NodeQuotaForClusterExceededFault extends S.TaggedError<NodeQuotaForClusterExceededFault>()(
  "NodeQuotaForClusterExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "NodeQuotaForClusterExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ParameterGroupQuotaExceededFault extends S.TaggedError<ParameterGroupQuotaExceededFault>()(
  "ParameterGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ParameterGroupQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SubnetQuotaExceededFault extends S.TaggedError<SubnetQuotaExceededFault>()(
  "SubnetQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetQuotaExceededFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class NodeQuotaForCustomerExceededFault extends S.TaggedError<NodeQuotaForCustomerExceededFault>()(
  "NodeQuotaForCustomerExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "NodeQuotaForCustomerExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
  T.AwsQueryError({ code: "ServiceQuotaExceeded", httpResponseCode: 402 }),
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Returns events related to DAX clusters and parameter groups. You can
 * obtain events specific to a particular DAX cluster or parameter group by
 * providing the name as a parameter.
 *
 * By default, only the events occurring within the last 24 hours are returned;
 * however, you can retrieve up to 14 days' worth of events if necessary.
 */
export const describeEvents: (
  input: DescribeEventsRequest,
) => Effect.Effect<
  DescribeEventsResponse,
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | ServiceLinkedRoleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEventsRequest,
  output: DescribeEventsResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
/**
 * List all of the tags for a DAX cluster. You can call
 * `ListTags` up to 10 times per second, per account.
 */
export const listTags: (
  input: ListTagsRequest,
) => Effect.Effect<
  ListTagsResponse,
  | ClusterNotFoundFault
  | InvalidARNFault
  | InvalidClusterStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | ServiceLinkedRoleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsRequest,
  output: ListTagsResponse,
  errors: [
    ClusterNotFoundFault,
    InvalidARNFault,
    InvalidClusterStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
/**
 * Returns information about all provisioned DAX clusters if no cluster identifier is
 * specified, or about a specific DAX cluster if a cluster identifier is
 * supplied.
 *
 * If the cluster is in the CREATING state, only cluster level information will be
 * displayed until all of the nodes are successfully provisioned.
 *
 * If the cluster is in the DELETING state, only cluster level information will be
 * displayed.
 *
 * If nodes are currently being added to the DAX cluster, node endpoint information
 * and creation time for the additional nodes will not be displayed until they are
 * completely provisioned. When the DAX cluster state is
 * *available*, the cluster is ready for use.
 *
 * If nodes are currently being removed from the DAX cluster, no
 * endpoint information for the removed nodes is displayed.
 */
export const describeClusters: (
  input: DescribeClustersRequest,
) => Effect.Effect<
  DescribeClustersResponse,
  | ClusterNotFoundFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | ServiceLinkedRoleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeClustersRequest,
  output: DescribeClustersResponse,
  errors: [
    ClusterNotFoundFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
/**
 * Deletes a previously provisioned DAX cluster.
 * *DeleteCluster* deletes all associated nodes, node endpoints and
 * the DAX cluster itself. When you receive a successful response from this
 * action, DAX immediately begins deleting the cluster; you cannot cancel or
 * revert this action.
 */
export const deleteCluster: (
  input: DeleteClusterRequest,
) => Effect.Effect<
  DeleteClusterResponse,
  | ClusterNotFoundFault
  | InvalidClusterStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | ServiceLinkedRoleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterRequest,
  output: DeleteClusterResponse,
  errors: [
    ClusterNotFoundFault,
    InvalidClusterStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
/**
 * Returns the default system parameter information for the DAX caching
 * software.
 */
export const describeDefaultParameters: (
  input: DescribeDefaultParametersRequest,
) => Effect.Effect<
  DescribeDefaultParametersResponse,
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | ServiceLinkedRoleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDefaultParametersRequest,
  output: DescribeDefaultParametersResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
/**
 * Returns a list of subnet group descriptions. If a subnet group name is specified,
 * the list will contain only the description of that group.
 */
export const describeSubnetGroups: (
  input: DescribeSubnetGroupsRequest,
) => Effect.Effect<
  DescribeSubnetGroupsResponse,
  ServiceLinkedRoleNotFoundFault | SubnetGroupNotFoundFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSubnetGroupsRequest,
  output: DescribeSubnetGroupsResponse,
  errors: [ServiceLinkedRoleNotFoundFault, SubnetGroupNotFoundFault],
}));
/**
 * Deletes a subnet group.
 *
 * You cannot delete a subnet group if it is associated with any DAX
 * clusters.
 */
export const deleteSubnetGroup: (
  input: DeleteSubnetGroupRequest,
) => Effect.Effect<
  DeleteSubnetGroupResponse,
  | ServiceLinkedRoleNotFoundFault
  | SubnetGroupInUseFault
  | SubnetGroupNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSubnetGroupRequest,
  output: DeleteSubnetGroupResponse,
  errors: [
    ServiceLinkedRoleNotFoundFault,
    SubnetGroupInUseFault,
    SubnetGroupNotFoundFault,
  ],
}));
/**
 * Reboots a single node of a DAX cluster. The reboot action takes
 * place as soon as possible. During the reboot, the node status is set to
 * REBOOTING.
 *
 * `RebootNode` restarts the DAX engine process and does not remove the
 * contents of the cache.
 */
export const rebootNode: (
  input: RebootNodeRequest,
) => Effect.Effect<
  RebootNodeResponse,
  | ClusterNotFoundFault
  | InvalidClusterStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | NodeNotFoundFault
  | ServiceLinkedRoleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootNodeRequest,
  output: RebootNodeResponse,
  errors: [
    ClusterNotFoundFault,
    InvalidClusterStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    NodeNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
/**
 * Modifies the settings for a DAX cluster. You can use this action to
 * change one or more cluster configuration parameters by specifying the parameters and the
 * new values.
 */
export const updateCluster: (
  input: UpdateClusterRequest,
) => Effect.Effect<
  UpdateClusterResponse,
  | ClusterNotFoundFault
  | InvalidClusterStateFault
  | InvalidParameterCombinationException
  | InvalidParameterGroupStateFault
  | InvalidParameterValueException
  | ParameterGroupNotFoundFault
  | ServiceLinkedRoleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateClusterRequest,
  output: UpdateClusterResponse,
  errors: [
    ClusterNotFoundFault,
    InvalidClusterStateFault,
    InvalidParameterCombinationException,
    InvalidParameterGroupStateFault,
    InvalidParameterValueException,
    ParameterGroupNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
/**
 * Associates a set of tags with a DAX resource.
 * You can call `TagResource` up to
 * 5 times per second, per account.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | ClusterNotFoundFault
  | InvalidARNFault
  | InvalidClusterStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | ServiceLinkedRoleNotFoundFault
  | TagQuotaPerResourceExceeded
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ClusterNotFoundFault,
    InvalidARNFault,
    InvalidClusterStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ServiceLinkedRoleNotFoundFault,
    TagQuotaPerResourceExceeded,
  ],
}));
/**
 * Removes the association of tags from a DAX resource. You can call
 * `UntagResource` up to 5 times per second, per account.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | ClusterNotFoundFault
  | InvalidARNFault
  | InvalidClusterStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | ServiceLinkedRoleNotFoundFault
  | TagNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    ClusterNotFoundFault,
    InvalidARNFault,
    InvalidClusterStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ServiceLinkedRoleNotFoundFault,
    TagNotFoundFault,
  ],
}));
/**
 * Removes one or more nodes from a DAX cluster.
 *
 * You cannot use `DecreaseReplicationFactor` to remove the last node
 * in a DAX cluster. If you need to do this, use
 * `DeleteCluster` instead.
 */
export const decreaseReplicationFactor: (
  input: DecreaseReplicationFactorRequest,
) => Effect.Effect<
  DecreaseReplicationFactorResponse,
  | ClusterNotFoundFault
  | InvalidClusterStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | NodeNotFoundFault
  | ServiceLinkedRoleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DecreaseReplicationFactorRequest,
  output: DecreaseReplicationFactorResponse,
  errors: [
    ClusterNotFoundFault,
    InvalidClusterStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    NodeNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
/**
 * Modifies the parameters of a parameter group. You can modify up to 20 parameters in
 * a single request by submitting a list parameter name and value pairs.
 */
export const updateParameterGroup: (
  input: UpdateParameterGroupRequest,
) => Effect.Effect<
  UpdateParameterGroupResponse,
  | InvalidParameterCombinationException
  | InvalidParameterGroupStateFault
  | InvalidParameterValueException
  | ParameterGroupNotFoundFault
  | ServiceLinkedRoleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateParameterGroupRequest,
  output: UpdateParameterGroupResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterGroupStateFault,
    InvalidParameterValueException,
    ParameterGroupNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
/**
 * Returns a list of parameter group descriptions. If a parameter group name is
 * specified, the list will contain only the descriptions for that group.
 */
export const describeParameterGroups: (
  input: DescribeParameterGroupsRequest,
) => Effect.Effect<
  DescribeParameterGroupsResponse,
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | ParameterGroupNotFoundFault
  | ServiceLinkedRoleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeParameterGroupsRequest,
  output: DescribeParameterGroupsResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ParameterGroupNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
/**
 * Returns the detailed parameter list for a particular parameter group.
 */
export const describeParameters: (
  input: DescribeParametersRequest,
) => Effect.Effect<
  DescribeParametersResponse,
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | ParameterGroupNotFoundFault
  | ServiceLinkedRoleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeParametersRequest,
  output: DescribeParametersResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ParameterGroupNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
/**
 * Deletes the specified parameter group. You cannot delete a parameter group if it is
 * associated with any DAX clusters.
 */
export const deleteParameterGroup: (
  input: DeleteParameterGroupRequest,
) => Effect.Effect<
  DeleteParameterGroupResponse,
  | InvalidParameterCombinationException
  | InvalidParameterGroupStateFault
  | InvalidParameterValueException
  | ParameterGroupNotFoundFault
  | ServiceLinkedRoleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteParameterGroupRequest,
  output: DeleteParameterGroupResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterGroupStateFault,
    InvalidParameterValueException,
    ParameterGroupNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
/**
 * Creates a new parameter group. A parameter group is a collection of parameters that
 * you apply to all of the nodes in a DAX cluster.
 */
export const createParameterGroup: (
  input: CreateParameterGroupRequest,
) => Effect.Effect<
  CreateParameterGroupResponse,
  | InvalidParameterCombinationException
  | InvalidParameterGroupStateFault
  | InvalidParameterValueException
  | ParameterGroupAlreadyExistsFault
  | ParameterGroupQuotaExceededFault
  | ServiceLinkedRoleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateParameterGroupRequest,
  output: CreateParameterGroupResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterGroupStateFault,
    InvalidParameterValueException,
    ParameterGroupAlreadyExistsFault,
    ParameterGroupQuotaExceededFault,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
/**
 * Modifies an existing subnet group.
 */
export const updateSubnetGroup: (
  input: UpdateSubnetGroupRequest,
) => Effect.Effect<
  UpdateSubnetGroupResponse,
  | InvalidSubnet
  | ServiceLinkedRoleNotFoundFault
  | SubnetGroupNotFoundFault
  | SubnetInUse
  | SubnetNotAllowedFault
  | SubnetQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSubnetGroupRequest,
  output: UpdateSubnetGroupResponse,
  errors: [
    InvalidSubnet,
    ServiceLinkedRoleNotFoundFault,
    SubnetGroupNotFoundFault,
    SubnetInUse,
    SubnetNotAllowedFault,
    SubnetQuotaExceededFault,
  ],
}));
/**
 * Adds one or more nodes to a DAX cluster.
 */
export const increaseReplicationFactor: (
  input: IncreaseReplicationFactorRequest,
) => Effect.Effect<
  IncreaseReplicationFactorResponse,
  | ClusterNotFoundFault
  | InsufficientClusterCapacityFault
  | InvalidClusterStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | InvalidVPCNetworkStateFault
  | NodeQuotaForClusterExceededFault
  | NodeQuotaForCustomerExceededFault
  | ServiceLinkedRoleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: IncreaseReplicationFactorRequest,
  output: IncreaseReplicationFactorResponse,
  errors: [
    ClusterNotFoundFault,
    InsufficientClusterCapacityFault,
    InvalidClusterStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    InvalidVPCNetworkStateFault,
    NodeQuotaForClusterExceededFault,
    NodeQuotaForCustomerExceededFault,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
/**
 * Creates a new subnet group.
 */
export const createSubnetGroup: (
  input: CreateSubnetGroupRequest,
) => Effect.Effect<
  CreateSubnetGroupResponse,
  | InvalidSubnet
  | ServiceLinkedRoleNotFoundFault
  | SubnetGroupAlreadyExistsFault
  | SubnetGroupQuotaExceededFault
  | SubnetNotAllowedFault
  | SubnetQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSubnetGroupRequest,
  output: CreateSubnetGroupResponse,
  errors: [
    InvalidSubnet,
    ServiceLinkedRoleNotFoundFault,
    SubnetGroupAlreadyExistsFault,
    SubnetGroupQuotaExceededFault,
    SubnetNotAllowedFault,
    SubnetQuotaExceededFault,
  ],
}));
/**
 * Creates a DAX cluster. All nodes in the cluster run the same DAX caching software.
 */
export const createCluster: (
  input: CreateClusterRequest,
) => Effect.Effect<
  CreateClusterResponse,
  | ClusterAlreadyExistsFault
  | ClusterQuotaForCustomerExceededFault
  | InsufficientClusterCapacityFault
  | InvalidClusterStateFault
  | InvalidParameterCombinationException
  | InvalidParameterGroupStateFault
  | InvalidParameterValueException
  | InvalidVPCNetworkStateFault
  | NodeQuotaForClusterExceededFault
  | NodeQuotaForCustomerExceededFault
  | ParameterGroupNotFoundFault
  | ServiceLinkedRoleNotFoundFault
  | ServiceQuotaExceededException
  | SubnetGroupNotFoundFault
  | TagQuotaPerResourceExceeded
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClusterRequest,
  output: CreateClusterResponse,
  errors: [
    ClusterAlreadyExistsFault,
    ClusterQuotaForCustomerExceededFault,
    InsufficientClusterCapacityFault,
    InvalidClusterStateFault,
    InvalidParameterCombinationException,
    InvalidParameterGroupStateFault,
    InvalidParameterValueException,
    InvalidVPCNetworkStateFault,
    NodeQuotaForClusterExceededFault,
    NodeQuotaForCustomerExceededFault,
    ParameterGroupNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
    ServiceQuotaExceededException,
    SubnetGroupNotFoundFault,
    TagQuotaPerResourceExceeded,
  ],
}));
