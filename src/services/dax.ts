import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("http://dax.amazonaws.com/doc/2017-04-19/");
const svc = T.AwsApiService({ sdkId: "DAX", serviceShapeName: "AmazonDAXV3" });
const auth = T.AwsAuthSigv4({ name: "dax" });
const ver = T.ServiceVersion("2017-04-19");
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
                        url: "https://dax-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://dax-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://dax.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://dax.{Region}.{PartitionResult#dnsSuffix}",
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
export const AvailabilityZoneList = S.Array(S.String);
export const SecurityGroupIdentifierList = S.Array(S.String);
export const SubnetIdentifierList = S.Array(S.String);
export const NodeIdentifierList = S.Array(S.String);
export const ClusterNameList = S.Array(S.String);
export const ParameterGroupNameList = S.Array(S.String);
export const SubnetGroupNameList = S.Array(S.String);
export const KeyList = S.Array(S.String);
export class CreateParameterGroupRequest extends S.Class<CreateParameterGroupRequest>(
  "CreateParameterGroupRequest",
)(
  { ParameterGroupName: S.String, Description: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSubnetGroupRequest extends S.Class<CreateSubnetGroupRequest>(
  "CreateSubnetGroupRequest",
)(
  {
    SubnetGroupName: S.String,
    Description: S.optional(S.String),
    SubnetIds: SubnetIdentifierList,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DecreaseReplicationFactorRequest extends S.Class<DecreaseReplicationFactorRequest>(
  "DecreaseReplicationFactorRequest",
)(
  {
    ClusterName: S.String,
    NewReplicationFactor: S.Number,
    AvailabilityZones: S.optional(AvailabilityZoneList),
    NodeIdsToRemove: S.optional(NodeIdentifierList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteClusterRequest extends S.Class<DeleteClusterRequest>(
  "DeleteClusterRequest",
)(
  { ClusterName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteParameterGroupRequest extends S.Class<DeleteParameterGroupRequest>(
  "DeleteParameterGroupRequest",
)(
  { ParameterGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSubnetGroupRequest extends S.Class<DeleteSubnetGroupRequest>(
  "DeleteSubnetGroupRequest",
)(
  { SubnetGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeClustersRequest extends S.Class<DescribeClustersRequest>(
  "DescribeClustersRequest",
)(
  {
    ClusterNames: S.optional(ClusterNameList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDefaultParametersRequest extends S.Class<DescribeDefaultParametersRequest>(
  "DescribeDefaultParametersRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEventsRequest extends S.Class<DescribeEventsRequest>(
  "DescribeEventsRequest",
)(
  {
    SourceName: S.optional(S.String),
    SourceType: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Duration: S.optional(S.Number),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeParameterGroupsRequest extends S.Class<DescribeParameterGroupsRequest>(
  "DescribeParameterGroupsRequest",
)(
  {
    ParameterGroupNames: S.optional(ParameterGroupNameList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeParametersRequest extends S.Class<DescribeParametersRequest>(
  "DescribeParametersRequest",
)(
  {
    ParameterGroupName: S.String,
    Source: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSubnetGroupsRequest extends S.Class<DescribeSubnetGroupsRequest>(
  "DescribeSubnetGroupsRequest",
)(
  {
    SubnetGroupNames: S.optional(SubnetGroupNameList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class IncreaseReplicationFactorRequest extends S.Class<IncreaseReplicationFactorRequest>(
  "IncreaseReplicationFactorRequest",
)(
  {
    ClusterName: S.String,
    NewReplicationFactor: S.Number,
    AvailabilityZones: S.optional(AvailabilityZoneList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsRequest extends S.Class<ListTagsRequest>(
  "ListTagsRequest",
)(
  { ResourceName: S.String, NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RebootNodeRequest extends S.Class<RebootNodeRequest>(
  "RebootNodeRequest",
)(
  { ClusterName: S.String, NodeId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceName: S.String, Tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceName: S.String, TagKeys: KeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateClusterRequest extends S.Class<UpdateClusterRequest>(
  "UpdateClusterRequest",
)(
  {
    ClusterName: S.String,
    Description: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    NotificationTopicArn: S.optional(S.String),
    NotificationTopicStatus: S.optional(S.String),
    ParameterGroupName: S.optional(S.String),
    SecurityGroupIds: S.optional(SecurityGroupIdentifierList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSubnetGroupRequest extends S.Class<UpdateSubnetGroupRequest>(
  "UpdateSubnetGroupRequest",
)(
  {
    SubnetGroupName: S.String,
    Description: S.optional(S.String),
    SubnetIds: S.optional(SubnetIdentifierList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SSESpecification extends S.Class<SSESpecification>(
  "SSESpecification",
)({ Enabled: S.Boolean }) {}
export class Endpoint extends S.Class<Endpoint>("Endpoint")({
  Address: S.optional(S.String),
  Port: S.optional(S.Number),
  URL: S.optional(S.String),
}) {}
export class Node extends S.Class<Node>("Node")({
  NodeId: S.optional(S.String),
  Endpoint: S.optional(Endpoint),
  NodeCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AvailabilityZone: S.optional(S.String),
  NodeStatus: S.optional(S.String),
  ParameterGroupStatus: S.optional(S.String),
}) {}
export const NodeList = S.Array(Node);
export class NotificationConfiguration extends S.Class<NotificationConfiguration>(
  "NotificationConfiguration",
)({ TopicArn: S.optional(S.String), TopicStatus: S.optional(S.String) }) {}
export class SecurityGroupMembership extends S.Class<SecurityGroupMembership>(
  "SecurityGroupMembership",
)({
  SecurityGroupIdentifier: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const SecurityGroupMembershipList = S.Array(SecurityGroupMembership);
export class ParameterGroupStatus extends S.Class<ParameterGroupStatus>(
  "ParameterGroupStatus",
)({
  ParameterGroupName: S.optional(S.String),
  ParameterApplyStatus: S.optional(S.String),
  NodeIdsToReboot: S.optional(NodeIdentifierList),
}) {}
export class SSEDescription extends S.Class<SSEDescription>("SSEDescription")({
  Status: S.optional(S.String),
}) {}
export class Cluster extends S.Class<Cluster>("Cluster")({
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
}) {}
export const ClusterList = S.Array(Cluster);
export class ParameterGroup extends S.Class<ParameterGroup>("ParameterGroup")({
  ParameterGroupName: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export const ParameterGroupList = S.Array(ParameterGroup);
export const NetworkTypeList = S.Array(S.String);
export class Subnet extends S.Class<Subnet>("Subnet")({
  SubnetIdentifier: S.optional(S.String),
  SubnetAvailabilityZone: S.optional(S.String),
  SupportedNetworkTypes: S.optional(NetworkTypeList),
}) {}
export const SubnetList = S.Array(Subnet);
export class SubnetGroup extends S.Class<SubnetGroup>("SubnetGroup")({
  SubnetGroupName: S.optional(S.String),
  Description: S.optional(S.String),
  VpcId: S.optional(S.String),
  Subnets: S.optional(SubnetList),
  SupportedNetworkTypes: S.optional(NetworkTypeList),
}) {}
export const SubnetGroupList = S.Array(SubnetGroup);
export class ParameterNameValue extends S.Class<ParameterNameValue>(
  "ParameterNameValue",
)({
  ParameterName: S.optional(S.String),
  ParameterValue: S.optional(S.String),
}) {}
export const ParameterNameValueList = S.Array(ParameterNameValue);
export class CreateClusterRequest extends S.Class<CreateClusterRequest>(
  "CreateClusterRequest",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteClusterResponse extends S.Class<DeleteClusterResponse>(
  "DeleteClusterResponse",
)({ Cluster: S.optional(Cluster) }, ns) {}
export class DeleteParameterGroupResponse extends S.Class<DeleteParameterGroupResponse>(
  "DeleteParameterGroupResponse",
)({ DeletionMessage: S.optional(S.String) }, ns) {}
export class DeleteSubnetGroupResponse extends S.Class<DeleteSubnetGroupResponse>(
  "DeleteSubnetGroupResponse",
)({ DeletionMessage: S.optional(S.String) }, ns) {}
export class DescribeClustersResponse extends S.Class<DescribeClustersResponse>(
  "DescribeClustersResponse",
)({ NextToken: S.optional(S.String), Clusters: S.optional(ClusterList) }, ns) {}
export class DescribeParameterGroupsResponse extends S.Class<DescribeParameterGroupsResponse>(
  "DescribeParameterGroupsResponse",
)(
  {
    NextToken: S.optional(S.String),
    ParameterGroups: S.optional(ParameterGroupList),
  },
  ns,
) {}
export class NodeTypeSpecificValue extends S.Class<NodeTypeSpecificValue>(
  "NodeTypeSpecificValue",
)({ NodeType: S.optional(S.String), Value: S.optional(S.String) }) {}
export const NodeTypeSpecificValueList = S.Array(NodeTypeSpecificValue);
export class Parameter extends S.Class<Parameter>("Parameter")({
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
}) {}
export const ParameterList = S.Array(Parameter);
export class DescribeParametersResponse extends S.Class<DescribeParametersResponse>(
  "DescribeParametersResponse",
)(
  { NextToken: S.optional(S.String), Parameters: S.optional(ParameterList) },
  ns,
) {}
export class DescribeSubnetGroupsResponse extends S.Class<DescribeSubnetGroupsResponse>(
  "DescribeSubnetGroupsResponse",
)(
  {
    NextToken: S.optional(S.String),
    SubnetGroups: S.optional(SubnetGroupList),
  },
  ns,
) {}
export class IncreaseReplicationFactorResponse extends S.Class<IncreaseReplicationFactorResponse>(
  "IncreaseReplicationFactorResponse",
)({ Cluster: S.optional(Cluster) }, ns) {}
export class ListTagsResponse extends S.Class<ListTagsResponse>(
  "ListTagsResponse",
)({ Tags: S.optional(TagList), NextToken: S.optional(S.String) }, ns) {}
export class RebootNodeResponse extends S.Class<RebootNodeResponse>(
  "RebootNodeResponse",
)({ Cluster: S.optional(Cluster) }, ns) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({ Tags: S.optional(TagList) }, ns) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({ Tags: S.optional(TagList) }, ns) {}
export class UpdateClusterResponse extends S.Class<UpdateClusterResponse>(
  "UpdateClusterResponse",
)({ Cluster: S.optional(Cluster) }, ns) {}
export class UpdateParameterGroupRequest extends S.Class<UpdateParameterGroupRequest>(
  "UpdateParameterGroupRequest",
)(
  { ParameterGroupName: S.String, ParameterNameValues: ParameterNameValueList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSubnetGroupResponse extends S.Class<UpdateSubnetGroupResponse>(
  "UpdateSubnetGroupResponse",
)({ SubnetGroup: S.optional(SubnetGroup) }, ns) {}
export class Event extends S.Class<Event>("Event")({
  SourceName: S.optional(S.String),
  SourceType: S.optional(S.String),
  Message: S.optional(S.String),
  Date: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const EventList = S.Array(Event);
export class CreateClusterResponse extends S.Class<CreateClusterResponse>(
  "CreateClusterResponse",
)({ Cluster: S.optional(Cluster) }, ns) {}
export class CreateParameterGroupResponse extends S.Class<CreateParameterGroupResponse>(
  "CreateParameterGroupResponse",
)({ ParameterGroup: S.optional(ParameterGroup) }, ns) {}
export class DescribeEventsResponse extends S.Class<DescribeEventsResponse>(
  "DescribeEventsResponse",
)({ NextToken: S.optional(S.String), Events: S.optional(EventList) }, ns) {}
export class UpdateParameterGroupResponse extends S.Class<UpdateParameterGroupResponse>(
  "UpdateParameterGroupResponse",
)({ ParameterGroup: S.optional(ParameterGroup) }, ns) {}
export class CreateSubnetGroupResponse extends S.Class<CreateSubnetGroupResponse>(
  "CreateSubnetGroupResponse",
)({ SubnetGroup: S.optional(SubnetGroup) }, ns) {}
export class DecreaseReplicationFactorResponse extends S.Class<DecreaseReplicationFactorResponse>(
  "DecreaseReplicationFactorResponse",
)({ Cluster: S.optional(Cluster) }, ns) {}
export class DescribeDefaultParametersResponse extends S.Class<DescribeDefaultParametersResponse>(
  "DescribeDefaultParametersResponse",
)(
  { NextToken: S.optional(S.String), Parameters: S.optional(ParameterList) },
  ns,
) {}

//# Errors
export class ClusterNotFoundFault extends S.TaggedError<ClusterNotFoundFault>()(
  "ClusterNotFoundFault",
  {},
  T.AwsQueryError({ code: "ClusterNotFound", httpResponseCode: 404 }),
) {}
export class InvalidParameterCombinationException extends S.TaggedError<InvalidParameterCombinationException>()(
  "InvalidParameterCombinationException",
  {},
  T.AwsQueryError({
    code: "InvalidParameterCombination",
    httpResponseCode: 400,
  }),
) {}
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  {},
  T.AwsQueryError({ code: "InvalidParameterValue", httpResponseCode: 400 }),
) {}
export class ParameterGroupNotFoundFault extends S.TaggedError<ParameterGroupNotFoundFault>()(
  "ParameterGroupNotFoundFault",
  {},
  T.AwsQueryError({ code: "ParameterGroupNotFound", httpResponseCode: 404 }),
) {}
export class ServiceLinkedRoleNotFoundFault extends S.TaggedError<ServiceLinkedRoleNotFoundFault>()(
  "ServiceLinkedRoleNotFoundFault",
  {},
  T.AwsQueryError({
    code: "ServiceLinkedRoleNotFoundFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidARNFault extends S.TaggedError<InvalidARNFault>()(
  "InvalidARNFault",
  {},
  T.AwsQueryError({ code: "InvalidARN", httpResponseCode: 400 }),
) {}
export class InvalidClusterStateFault extends S.TaggedError<InvalidClusterStateFault>()(
  "InvalidClusterStateFault",
  {},
  T.AwsQueryError({ code: "InvalidClusterState", httpResponseCode: 400 }),
) {}
export class InvalidParameterGroupStateFault extends S.TaggedError<InvalidParameterGroupStateFault>()(
  "InvalidParameterGroupStateFault",
  {},
  T.AwsQueryError({
    code: "InvalidParameterGroupState",
    httpResponseCode: 400,
  }),
) {}
export class SubnetGroupNotFoundFault extends S.TaggedError<SubnetGroupNotFoundFault>()(
  "SubnetGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetGroupNotFoundFault", httpResponseCode: 404 }),
) {}
export class InsufficientClusterCapacityFault extends S.TaggedError<InsufficientClusterCapacityFault>()(
  "InsufficientClusterCapacityFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientClusterCapacity",
    httpResponseCode: 400,
  }),
) {}
export class TagQuotaPerResourceExceeded extends S.TaggedError<TagQuotaPerResourceExceeded>()(
  "TagQuotaPerResourceExceeded",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TagQuotaPerResourceExceeded",
    httpResponseCode: 400,
  }),
) {}
export class TagNotFoundFault extends S.TaggedError<TagNotFoundFault>()(
  "TagNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "TagNotFound", httpResponseCode: 404 }),
) {}
export class InvalidSubnet extends S.TaggedError<InvalidSubnet>()(
  "InvalidSubnet",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSubnet", httpResponseCode: 400 }),
) {}
export class ClusterAlreadyExistsFault extends S.TaggedError<ClusterAlreadyExistsFault>()(
  "ClusterAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ClusterAlreadyExists", httpResponseCode: 400 }),
) {}
export class ParameterGroupAlreadyExistsFault extends S.TaggedError<ParameterGroupAlreadyExistsFault>()(
  "ParameterGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ParameterGroupAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class NodeNotFoundFault extends S.TaggedError<NodeNotFoundFault>()(
  "NodeNotFoundFault",
  {},
  T.AwsQueryError({ code: "NodeNotFound", httpResponseCode: 404 }),
) {}
export class SubnetGroupInUseFault extends S.TaggedError<SubnetGroupInUseFault>()(
  "SubnetGroupInUseFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetGroupInUse", httpResponseCode: 400 }),
) {}
export class InvalidVPCNetworkStateFault extends S.TaggedError<InvalidVPCNetworkStateFault>()(
  "InvalidVPCNetworkStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidVPCNetworkStateFault",
    httpResponseCode: 400,
  }),
) {}
export class SubnetInUse extends S.TaggedError<SubnetInUse>()(
  "SubnetInUse",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetInUse", httpResponseCode: 400 }),
) {}
export class ClusterQuotaForCustomerExceededFault extends S.TaggedError<ClusterQuotaForCustomerExceededFault>()(
  "ClusterQuotaForCustomerExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClusterQuotaForCustomerExceeded",
    httpResponseCode: 400,
  }),
) {}
export class NodeQuotaForClusterExceededFault extends S.TaggedError<NodeQuotaForClusterExceededFault>()(
  "NodeQuotaForClusterExceededFault",
  {},
  T.AwsQueryError({
    code: "NodeQuotaForClusterExceeded",
    httpResponseCode: 400,
  }),
) {}
export class ParameterGroupQuotaExceededFault extends S.TaggedError<ParameterGroupQuotaExceededFault>()(
  "ParameterGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ParameterGroupQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class SubnetGroupAlreadyExistsFault extends S.TaggedError<SubnetGroupAlreadyExistsFault>()(
  "SubnetGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetGroupAlreadyExists", httpResponseCode: 400 }),
) {}
export class NodeQuotaForCustomerExceededFault extends S.TaggedError<NodeQuotaForCustomerExceededFault>()(
  "NodeQuotaForCustomerExceededFault",
  {},
  T.AwsQueryError({
    code: "NodeQuotaForCustomerExceeded",
    httpResponseCode: 400,
  }),
) {}
export class SubnetNotAllowedFault extends S.TaggedError<SubnetNotAllowedFault>()(
  "SubnetNotAllowedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetNotAllowedFault", httpResponseCode: 400 }),
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
  T.AwsQueryError({ code: "ServiceQuotaExceeded", httpResponseCode: 402 }),
) {}
export class SubnetGroupQuotaExceededFault extends S.TaggedError<SubnetGroupQuotaExceededFault>()(
  "SubnetGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetGroupQuotaExceeded", httpResponseCode: 400 }),
) {}
export class SubnetQuotaExceededFault extends S.TaggedError<SubnetQuotaExceededFault>()(
  "SubnetQuotaExceededFault",
  {},
  T.AwsQueryError({ code: "SubnetQuotaExceededFault", httpResponseCode: 400 }),
) {}

//# Operations
/**
 * Returns the detailed parameter list for a particular parameter group.
 */
export const describeParameters = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a previously provisioned DAX cluster.
 * *DeleteCluster* deletes all associated nodes, node endpoints and
 * the DAX cluster itself. When you receive a successful response from this
 * action, DAX immediately begins deleting the cluster; you cannot cancel or
 * revert this action.
 */
export const deleteCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes the specified parameter group. You cannot delete a parameter group if it is
 * associated with any DAX clusters.
 */
export const deleteParameterGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteParameterGroupRequest,
    output: DeleteParameterGroupResponse,
    errors: [
      InvalidParameterCombinationException,
      InvalidParameterGroupStateFault,
      InvalidParameterValueException,
      ParameterGroupNotFoundFault,
      ServiceLinkedRoleNotFoundFault,
    ],
  }),
);
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
export const describeClusters = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns events related to DAX clusters and parameter groups. You can
 * obtain events specific to a particular DAX cluster or parameter group by
 * providing the name as a parameter.
 *
 * By default, only the events occurring within the last 24 hours are returned;
 * however, you can retrieve up to 14 days' worth of events if necessary.
 */
export const describeEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEventsRequest,
  output: DescribeEventsResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
/**
 * Returns a list of parameter group descriptions. If a parameter group name is
 * specified, the list will contain only the descriptions for that group.
 */
export const describeParameterGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeParameterGroupsRequest,
    output: DescribeParameterGroupsResponse,
    errors: [
      InvalidParameterCombinationException,
      InvalidParameterValueException,
      ParameterGroupNotFoundFault,
      ServiceLinkedRoleNotFoundFault,
    ],
  }),
);
/**
 * Returns a list of subnet group descriptions. If a subnet group name is specified,
 * the list will contain only the description of that group.
 */
export const describeSubnetGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeSubnetGroupsRequest,
    output: DescribeSubnetGroupsResponse,
    errors: [ServiceLinkedRoleNotFoundFault, SubnetGroupNotFoundFault],
  }),
);
/**
 * List all of the tags for a DAX cluster. You can call
 * `ListTags` up to 10 times per second, per account.
 */
export const listTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Associates a set of tags with a DAX resource.
 * You can call `TagResource` up to
 * 5 times per second, per account.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Modifies the settings for a DAX cluster. You can use this action to
 * change one or more cluster configuration parameters by specifying the parameters and the
 * new values.
 */
export const updateCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Modifies the parameters of a parameter group. You can modify up to 20 parameters in
 * a single request by submitting a list parameter name and value pairs.
 */
export const updateParameterGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateParameterGroupRequest,
    output: UpdateParameterGroupResponse,
    errors: [
      InvalidParameterCombinationException,
      InvalidParameterGroupStateFault,
      InvalidParameterValueException,
      ParameterGroupNotFoundFault,
      ServiceLinkedRoleNotFoundFault,
    ],
  }),
);
/**
 * Removes one or more nodes from a DAX cluster.
 *
 * You cannot use `DecreaseReplicationFactor` to remove the last node
 * in a DAX cluster. If you need to do this, use
 * `DeleteCluster` instead.
 */
export const decreaseReplicationFactor = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Deletes a subnet group.
 *
 * You cannot delete a subnet group if it is associated with any DAX
 * clusters.
 */
export const deleteSubnetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSubnetGroupRequest,
  output: DeleteSubnetGroupResponse,
  errors: [
    ServiceLinkedRoleNotFoundFault,
    SubnetGroupInUseFault,
    SubnetGroupNotFoundFault,
  ],
}));
/**
 * Returns the default system parameter information for the DAX caching
 * software.
 */
export const describeDefaultParameters = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDefaultParametersRequest,
    output: DescribeDefaultParametersResponse,
    errors: [
      InvalidParameterCombinationException,
      InvalidParameterValueException,
      ServiceLinkedRoleNotFoundFault,
    ],
  }),
);
/**
 * Reboots a single node of a DAX cluster. The reboot action takes
 * place as soon as possible. During the reboot, the node status is set to
 * REBOOTING.
 *
 * `RebootNode` restarts the DAX engine process and does not remove the
 * contents of the cache.
 */
export const rebootNode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new parameter group. A parameter group is a collection of parameters that
 * you apply to all of the nodes in a DAX cluster.
 */
export const createParameterGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Adds one or more nodes to a DAX cluster.
 */
export const increaseReplicationFactor = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates a DAX cluster. All nodes in the cluster run the same DAX caching software.
 */
export const createCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
/**
 * Creates a new subnet group.
 */
export const createSubnetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Modifies an existing subnet group.
 */
export const updateSubnetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
