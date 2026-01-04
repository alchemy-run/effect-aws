import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({ sdkId: "Kafka", serviceShapeName: "Kafka" });
const auth = T.AwsAuthSigv4({ name: "kafka" });
const ver = T.ServiceVersion("2018-11-14");
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
                        url: "https://kafka-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://kafka.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://kafka-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://kafka.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://kafka.{Region}.{PartitionResult#dnsSuffix}",
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
export const __listOf__string = S.Array(S.String);
export class BatchAssociateScramSecretRequest extends S.Class<BatchAssociateScramSecretRequest>(
  "BatchAssociateScramSecretRequest",
)(
  {
    ClusterArn: S.String.pipe(T.HttpLabel()),
    SecretArnList: __listOf__string.pipe(T.JsonName("secretArnList")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/clusters/{ClusterArn}/scram-secrets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchDisassociateScramSecretRequest extends S.Class<BatchDisassociateScramSecretRequest>(
  "BatchDisassociateScramSecretRequest",
)(
  {
    ClusterArn: S.String.pipe(T.HttpLabel()),
    SecretArnList: __listOf__string.pipe(T.JsonName("secretArnList")),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/v1/clusters/{ClusterArn}/scram-secrets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateConfigurationRequest extends S.Class<CreateConfigurationRequest>(
  "CreateConfigurationRequest",
)(
  {
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    KafkaVersions: S.optional(__listOf__string).pipe(
      T.JsonName("kafkaVersions"),
    ),
    Name: S.String.pipe(T.JsonName("name")),
    ServerProperties: T.Blob.pipe(T.JsonName("serverProperties")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const __mapOf__string = S.Record({ key: S.String, value: S.String });
export class CreateVpcConnectionRequest extends S.Class<CreateVpcConnectionRequest>(
  "CreateVpcConnectionRequest",
)(
  {
    TargetClusterArn: S.String.pipe(T.JsonName("targetClusterArn")),
    Authentication: S.String.pipe(T.JsonName("authentication")),
    VpcId: S.String.pipe(T.JsonName("vpcId")),
    ClientSubnets: __listOf__string.pipe(T.JsonName("clientSubnets")),
    SecurityGroups: __listOf__string.pipe(T.JsonName("securityGroups")),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/vpc-connection" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteClusterRequest extends S.Class<DeleteClusterRequest>(
  "DeleteClusterRequest",
)(
  {
    ClusterArn: S.String.pipe(T.HttpLabel()),
    CurrentVersion: S.optional(S.String).pipe(T.HttpQuery("currentVersion")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/clusters/{ClusterArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteClusterPolicyRequest extends S.Class<DeleteClusterPolicyRequest>(
  "DeleteClusterPolicyRequest",
)(
  { ClusterArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/clusters/{ClusterArn}/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteClusterPolicyResponse extends S.Class<DeleteClusterPolicyResponse>(
  "DeleteClusterPolicyResponse",
)({}) {}
export class DeleteConfigurationRequest extends S.Class<DeleteConfigurationRequest>(
  "DeleteConfigurationRequest",
)(
  { Arn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/configurations/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteReplicatorRequest extends S.Class<DeleteReplicatorRequest>(
  "DeleteReplicatorRequest",
)(
  {
    CurrentVersion: S.optional(S.String).pipe(T.HttpQuery("currentVersion")),
    ReplicatorArn: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/replication/v1/replicators/{ReplicatorArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVpcConnectionRequest extends S.Class<DeleteVpcConnectionRequest>(
  "DeleteVpcConnectionRequest",
)(
  { Arn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/vpc-connection/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeClusterRequest extends S.Class<DescribeClusterRequest>(
  "DescribeClusterRequest",
)(
  { ClusterArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/clusters/{ClusterArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeClusterOperationRequest extends S.Class<DescribeClusterOperationRequest>(
  "DescribeClusterOperationRequest",
)(
  { ClusterOperationArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/operations/{ClusterOperationArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeClusterOperationV2Request extends S.Class<DescribeClusterOperationV2Request>(
  "DescribeClusterOperationV2Request",
)(
  { ClusterOperationArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/api/v2/operations/{ClusterOperationArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeClusterV2Request extends S.Class<DescribeClusterV2Request>(
  "DescribeClusterV2Request",
)(
  { ClusterArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/api/v2/clusters/{ClusterArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeConfigurationRequest extends S.Class<DescribeConfigurationRequest>(
  "DescribeConfigurationRequest",
)(
  { Arn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/configurations/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeConfigurationRevisionRequest extends S.Class<DescribeConfigurationRevisionRequest>(
  "DescribeConfigurationRevisionRequest",
)(
  { Arn: S.String.pipe(T.HttpLabel()), Revision: S.Number.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/configurations/{Arn}/revisions/{Revision}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeReplicatorRequest extends S.Class<DescribeReplicatorRequest>(
  "DescribeReplicatorRequest",
)(
  { ReplicatorArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/replication/v1/replicators/{ReplicatorArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeTopicRequest extends S.Class<DescribeTopicRequest>(
  "DescribeTopicRequest",
)(
  {
    ClusterArn: S.String.pipe(T.HttpLabel()),
    TopicName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/clusters/{ClusterArn}/topics/{TopicName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeTopicPartitionsRequest extends S.Class<DescribeTopicPartitionsRequest>(
  "DescribeTopicPartitionsRequest",
)(
  {
    ClusterArn: S.String.pipe(T.HttpLabel()),
    TopicName: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/clusters/{ClusterArn}/topics/{TopicName}/partitions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeVpcConnectionRequest extends S.Class<DescribeVpcConnectionRequest>(
  "DescribeVpcConnectionRequest",
)(
  { Arn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/vpc-connection/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBootstrapBrokersRequest extends S.Class<GetBootstrapBrokersRequest>(
  "GetBootstrapBrokersRequest",
)(
  { ClusterArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/clusters/{ClusterArn}/bootstrap-brokers",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetClusterPolicyRequest extends S.Class<GetClusterPolicyRequest>(
  "GetClusterPolicyRequest",
)(
  { ClusterArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/clusters/{ClusterArn}/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCompatibleKafkaVersionsRequest extends S.Class<GetCompatibleKafkaVersionsRequest>(
  "GetCompatibleKafkaVersionsRequest",
)(
  { ClusterArn: S.optional(S.String).pipe(T.HttpQuery("clusterArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/compatible-kafka-versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListClientVpcConnectionsRequest extends S.Class<ListClientVpcConnectionsRequest>(
  "ListClientVpcConnectionsRequest",
)(
  {
    ClusterArn: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/clusters/{ClusterArn}/client-vpc-connections",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListClusterOperationsRequest extends S.Class<ListClusterOperationsRequest>(
  "ListClusterOperationsRequest",
)(
  {
    ClusterArn: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/clusters/{ClusterArn}/operations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListClusterOperationsV2Request extends S.Class<ListClusterOperationsV2Request>(
  "ListClusterOperationsV2Request",
)(
  {
    ClusterArn: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/api/v2/clusters/{ClusterArn}/operations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListClustersRequest extends S.Class<ListClustersRequest>(
  "ListClustersRequest",
)(
  {
    ClusterNameFilter: S.optional(S.String).pipe(
      T.HttpQuery("clusterNameFilter"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/clusters" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListClustersV2Request extends S.Class<ListClustersV2Request>(
  "ListClustersV2Request",
)(
  {
    ClusterNameFilter: S.optional(S.String).pipe(
      T.HttpQuery("clusterNameFilter"),
    ),
    ClusterTypeFilter: S.optional(S.String).pipe(
      T.HttpQuery("clusterTypeFilter"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/api/v2/clusters" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListConfigurationRevisionsRequest extends S.Class<ListConfigurationRevisionsRequest>(
  "ListConfigurationRevisionsRequest",
)(
  {
    Arn: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/configurations/{Arn}/revisions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListConfigurationsRequest extends S.Class<ListConfigurationsRequest>(
  "ListConfigurationsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListKafkaVersionsRequest extends S.Class<ListKafkaVersionsRequest>(
  "ListKafkaVersionsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/kafka-versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListNodesRequest extends S.Class<ListNodesRequest>(
  "ListNodesRequest",
)(
  {
    ClusterArn: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/clusters/{ClusterArn}/nodes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListReplicatorsRequest extends S.Class<ListReplicatorsRequest>(
  "ListReplicatorsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    ReplicatorNameFilter: S.optional(S.String).pipe(
      T.HttpQuery("replicatorNameFilter"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/replication/v1/replicators" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListScramSecretsRequest extends S.Class<ListScramSecretsRequest>(
  "ListScramSecretsRequest",
)(
  {
    ClusterArn: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/clusters/{ClusterArn}/scram-secrets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTopicsRequest extends S.Class<ListTopicsRequest>(
  "ListTopicsRequest",
)(
  {
    ClusterArn: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    TopicNameFilter: S.optional(S.String).pipe(T.HttpQuery("topicNameFilter")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/clusters/{ClusterArn}/topics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVpcConnectionsRequest extends S.Class<ListVpcConnectionsRequest>(
  "ListVpcConnectionsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/vpc-connections" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutClusterPolicyRequest extends S.Class<PutClusterPolicyRequest>(
  "PutClusterPolicyRequest",
)(
  {
    ClusterArn: S.String.pipe(T.HttpLabel()),
    CurrentVersion: S.optional(S.String).pipe(T.JsonName("currentVersion")),
    Policy: S.String.pipe(T.JsonName("policy")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/clusters/{ClusterArn}/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RebootBrokerRequest extends S.Class<RebootBrokerRequest>(
  "RebootBrokerRequest",
)(
  {
    BrokerIds: __listOf__string.pipe(T.JsonName("brokerIds")),
    ClusterArn: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/clusters/{ClusterArn}/reboot-broker" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RejectClientVpcConnectionRequest extends S.Class<RejectClientVpcConnectionRequest>(
  "RejectClientVpcConnectionRequest",
)(
  {
    ClusterArn: S.String.pipe(T.HttpLabel()),
    VpcConnectionArn: S.String.pipe(T.JsonName("vpcConnectionArn")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/clusters/{ClusterArn}/client-vpc-connection",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RejectClientVpcConnectionResponse extends S.Class<RejectClientVpcConnectionResponse>(
  "RejectClientVpcConnectionResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel()),
    Tags: __mapOf__string.pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/tags/{ResourceArn}" }),
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
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel()),
    TagKeys: __listOf__string.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/tags/{ResourceArn}" }),
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
export class UpdateBrokerCountRequest extends S.Class<UpdateBrokerCountRequest>(
  "UpdateBrokerCountRequest",
)(
  {
    ClusterArn: S.String.pipe(T.HttpLabel()),
    CurrentVersion: S.String.pipe(T.JsonName("currentVersion")),
    TargetNumberOfBrokerNodes: S.Number.pipe(
      T.JsonName("targetNumberOfBrokerNodes"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/clusters/{ClusterArn}/nodes/count" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateBrokerTypeRequest extends S.Class<UpdateBrokerTypeRequest>(
  "UpdateBrokerTypeRequest",
)(
  {
    ClusterArn: S.String.pipe(T.HttpLabel()),
    CurrentVersion: S.String.pipe(T.JsonName("currentVersion")),
    TargetInstanceType: S.String.pipe(T.JsonName("targetInstanceType")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/clusters/{ClusterArn}/nodes/type" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ConfigurationInfo extends S.Class<ConfigurationInfo>(
  "ConfigurationInfo",
)({
  Arn: S.String.pipe(T.JsonName("arn")),
  Revision: S.Number.pipe(T.JsonName("revision")),
}) {}
export class UpdateClusterConfigurationRequest extends S.Class<UpdateClusterConfigurationRequest>(
  "UpdateClusterConfigurationRequest",
)(
  {
    ClusterArn: S.String.pipe(T.HttpLabel()),
    ConfigurationInfo: ConfigurationInfo.pipe(T.JsonName("configurationInfo")),
    CurrentVersion: S.String.pipe(T.JsonName("currentVersion")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/clusters/{ClusterArn}/configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateClusterKafkaVersionRequest extends S.Class<UpdateClusterKafkaVersionRequest>(
  "UpdateClusterKafkaVersionRequest",
)(
  {
    ClusterArn: S.String.pipe(T.HttpLabel()),
    ConfigurationInfo: S.optional(ConfigurationInfo).pipe(
      T.JsonName("configurationInfo"),
    ),
    CurrentVersion: S.String.pipe(T.JsonName("currentVersion")),
    TargetKafkaVersion: S.String.pipe(T.JsonName("targetKafkaVersion")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/clusters/{ClusterArn}/version" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateConfigurationRequest extends S.Class<UpdateConfigurationRequest>(
  "UpdateConfigurationRequest",
)(
  {
    Arn: S.String.pipe(T.HttpLabel()),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    ServerProperties: T.Blob.pipe(T.JsonName("serverProperties")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/configurations/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class JmxExporterInfo extends S.Class<JmxExporterInfo>(
  "JmxExporterInfo",
)({ EnabledInBroker: S.Boolean.pipe(T.JsonName("enabledInBroker")) }) {}
export class NodeExporterInfo extends S.Class<NodeExporterInfo>(
  "NodeExporterInfo",
)({ EnabledInBroker: S.Boolean.pipe(T.JsonName("enabledInBroker")) }) {}
export class PrometheusInfo extends S.Class<PrometheusInfo>("PrometheusInfo")({
  JmxExporter: S.optional(JmxExporterInfo).pipe(T.JsonName("jmxExporter")),
  NodeExporter: S.optional(NodeExporterInfo).pipe(T.JsonName("nodeExporter")),
}) {}
export class OpenMonitoringInfo extends S.Class<OpenMonitoringInfo>(
  "OpenMonitoringInfo",
)({ Prometheus: PrometheusInfo.pipe(T.JsonName("prometheus")) }) {}
export class CloudWatchLogs extends S.Class<CloudWatchLogs>("CloudWatchLogs")({
  Enabled: S.Boolean.pipe(T.JsonName("enabled")),
  LogGroup: S.optional(S.String).pipe(T.JsonName("logGroup")),
}) {}
export class Firehose extends S.Class<Firehose>("Firehose")({
  DeliveryStream: S.optional(S.String).pipe(T.JsonName("deliveryStream")),
  Enabled: S.Boolean.pipe(T.JsonName("enabled")),
}) {}
export class S3 extends S.Class<S3>("S3")({
  Bucket: S.optional(S.String).pipe(T.JsonName("bucket")),
  Enabled: S.Boolean.pipe(T.JsonName("enabled")),
  Prefix: S.optional(S.String).pipe(T.JsonName("prefix")),
}) {}
export class BrokerLogs extends S.Class<BrokerLogs>("BrokerLogs")({
  CloudWatchLogs: S.optional(CloudWatchLogs).pipe(T.JsonName("cloudWatchLogs")),
  Firehose: S.optional(Firehose).pipe(T.JsonName("firehose")),
  S3: S.optional(S3).pipe(T.JsonName("s3")),
}) {}
export class LoggingInfo extends S.Class<LoggingInfo>("LoggingInfo")({
  BrokerLogs: BrokerLogs.pipe(T.JsonName("brokerLogs")),
}) {}
export class UpdateMonitoringRequest extends S.Class<UpdateMonitoringRequest>(
  "UpdateMonitoringRequest",
)(
  {
    ClusterArn: S.String.pipe(T.HttpLabel()),
    CurrentVersion: S.String.pipe(T.JsonName("currentVersion")),
    EnhancedMonitoring: S.optional(S.String).pipe(
      T.JsonName("enhancedMonitoring"),
    ),
    OpenMonitoring: S.optional(OpenMonitoringInfo).pipe(
      T.JsonName("openMonitoring"),
    ),
    LoggingInfo: S.optional(LoggingInfo).pipe(T.JsonName("loggingInfo")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/clusters/{ClusterArn}/monitoring" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Rebalancing extends S.Class<Rebalancing>("Rebalancing")({
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class UpdateRebalancingRequest extends S.Class<UpdateRebalancingRequest>(
  "UpdateRebalancingRequest",
)(
  {
    ClusterArn: S.String.pipe(T.HttpLabel()),
    CurrentVersion: S.String.pipe(T.JsonName("currentVersion")),
    Rebalancing: Rebalancing.pipe(T.JsonName("rebalancing")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/clusters/{ClusterArn}/rebalancing" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Scram extends S.Class<Scram>("Scram")({
  Enabled: S.optional(S.Boolean).pipe(T.JsonName("enabled")),
}) {}
export class Iam extends S.Class<Iam>("Iam")({
  Enabled: S.optional(S.Boolean).pipe(T.JsonName("enabled")),
}) {}
export class Sasl extends S.Class<Sasl>("Sasl")({
  Scram: S.optional(Scram).pipe(T.JsonName("scram")),
  Iam: S.optional(Iam).pipe(T.JsonName("iam")),
}) {}
export class Tls extends S.Class<Tls>("Tls")({
  CertificateAuthorityArnList: S.optional(__listOf__string).pipe(
    T.JsonName("certificateAuthorityArnList"),
  ),
  Enabled: S.optional(S.Boolean).pipe(T.JsonName("enabled")),
}) {}
export class Unauthenticated extends S.Class<Unauthenticated>(
  "Unauthenticated",
)({ Enabled: S.optional(S.Boolean).pipe(T.JsonName("enabled")) }) {}
export class ClientAuthentication extends S.Class<ClientAuthentication>(
  "ClientAuthentication",
)({
  Sasl: S.optional(Sasl).pipe(T.JsonName("sasl")),
  Tls: S.optional(Tls).pipe(T.JsonName("tls")),
  Unauthenticated: S.optional(Unauthenticated).pipe(
    T.JsonName("unauthenticated"),
  ),
}) {}
export class EncryptionAtRest extends S.Class<EncryptionAtRest>(
  "EncryptionAtRest",
)({ DataVolumeKMSKeyId: S.String.pipe(T.JsonName("dataVolumeKMSKeyId")) }) {}
export class EncryptionInTransit extends S.Class<EncryptionInTransit>(
  "EncryptionInTransit",
)({
  ClientBroker: S.optional(S.String).pipe(T.JsonName("clientBroker")),
  InCluster: S.optional(S.Boolean).pipe(T.JsonName("inCluster")),
}) {}
export class EncryptionInfo extends S.Class<EncryptionInfo>("EncryptionInfo")({
  EncryptionAtRest: S.optional(EncryptionAtRest).pipe(
    T.JsonName("encryptionAtRest"),
  ),
  EncryptionInTransit: S.optional(EncryptionInTransit).pipe(
    T.JsonName("encryptionInTransit"),
  ),
}) {}
export class UpdateSecurityRequest extends S.Class<UpdateSecurityRequest>(
  "UpdateSecurityRequest",
)(
  {
    ClientAuthentication: S.optional(ClientAuthentication).pipe(
      T.JsonName("clientAuthentication"),
    ),
    ClusterArn: S.String.pipe(T.HttpLabel()),
    CurrentVersion: S.String.pipe(T.JsonName("currentVersion")),
    EncryptionInfo: S.optional(EncryptionInfo).pipe(
      T.JsonName("encryptionInfo"),
    ),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/v1/clusters/{ClusterArn}/security" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const __listOf__stringMax256 = S.Array(S.String);
export const __listOf__stringMax249 = S.Array(S.String);
export class ProvisionedThroughput extends S.Class<ProvisionedThroughput>(
  "ProvisionedThroughput",
)({
  Enabled: S.optional(S.Boolean).pipe(T.JsonName("enabled")),
  VolumeThroughput: S.optional(S.Number).pipe(T.JsonName("volumeThroughput")),
}) {}
export class EBSStorageInfo extends S.Class<EBSStorageInfo>("EBSStorageInfo")({
  ProvisionedThroughput: S.optional(ProvisionedThroughput).pipe(
    T.JsonName("provisionedThroughput"),
  ),
  VolumeSize: S.optional(S.Number).pipe(T.JsonName("volumeSize")),
}) {}
export class StorageInfo extends S.Class<StorageInfo>("StorageInfo")({
  EbsStorageInfo: S.optional(EBSStorageInfo).pipe(T.JsonName("ebsStorageInfo")),
}) {}
export class PublicAccess extends S.Class<PublicAccess>("PublicAccess")({
  Type: S.optional(S.String).pipe(T.JsonName("type")),
}) {}
export class VpcConnectivityScram extends S.Class<VpcConnectivityScram>(
  "VpcConnectivityScram",
)({ Enabled: S.optional(S.Boolean).pipe(T.JsonName("enabled")) }) {}
export class VpcConnectivityIam extends S.Class<VpcConnectivityIam>(
  "VpcConnectivityIam",
)({ Enabled: S.optional(S.Boolean).pipe(T.JsonName("enabled")) }) {}
export class VpcConnectivitySasl extends S.Class<VpcConnectivitySasl>(
  "VpcConnectivitySasl",
)({
  Scram: S.optional(VpcConnectivityScram).pipe(T.JsonName("scram")),
  Iam: S.optional(VpcConnectivityIam).pipe(T.JsonName("iam")),
}) {}
export class VpcConnectivityTls extends S.Class<VpcConnectivityTls>(
  "VpcConnectivityTls",
)({ Enabled: S.optional(S.Boolean).pipe(T.JsonName("enabled")) }) {}
export class VpcConnectivityClientAuthentication extends S.Class<VpcConnectivityClientAuthentication>(
  "VpcConnectivityClientAuthentication",
)({
  Sasl: S.optional(VpcConnectivitySasl).pipe(T.JsonName("sasl")),
  Tls: S.optional(VpcConnectivityTls).pipe(T.JsonName("tls")),
}) {}
export class VpcConnectivity extends S.Class<VpcConnectivity>(
  "VpcConnectivity",
)({
  ClientAuthentication: S.optional(VpcConnectivityClientAuthentication).pipe(
    T.JsonName("clientAuthentication"),
  ),
}) {}
export class ConnectivityInfo extends S.Class<ConnectivityInfo>(
  "ConnectivityInfo",
)({
  PublicAccess: S.optional(PublicAccess).pipe(T.JsonName("publicAccess")),
  VpcConnectivity: S.optional(VpcConnectivity).pipe(
    T.JsonName("vpcConnectivity"),
  ),
}) {}
export class BrokerNodeGroupInfo extends S.Class<BrokerNodeGroupInfo>(
  "BrokerNodeGroupInfo",
)({
  BrokerAZDistribution: S.optional(S.String).pipe(
    T.JsonName("brokerAZDistribution"),
  ),
  ClientSubnets: __listOf__string.pipe(T.JsonName("clientSubnets")),
  InstanceType: S.String.pipe(T.JsonName("instanceType")),
  SecurityGroups: S.optional(__listOf__string).pipe(
    T.JsonName("securityGroups"),
  ),
  StorageInfo: S.optional(StorageInfo).pipe(T.JsonName("storageInfo")),
  ConnectivityInfo: S.optional(ConnectivityInfo).pipe(
    T.JsonName("connectivityInfo"),
  ),
  ZoneIds: S.optional(__listOf__string).pipe(T.JsonName("zoneIds")),
}) {}
export class ProvisionedRequest extends S.Class<ProvisionedRequest>(
  "ProvisionedRequest",
)({
  BrokerNodeGroupInfo: BrokerNodeGroupInfo.pipe(
    T.JsonName("brokerNodeGroupInfo"),
  ),
  Rebalancing: S.optional(Rebalancing).pipe(T.JsonName("rebalancing")),
  ClientAuthentication: S.optional(ClientAuthentication).pipe(
    T.JsonName("clientAuthentication"),
  ),
  ConfigurationInfo: S.optional(ConfigurationInfo).pipe(
    T.JsonName("configurationInfo"),
  ),
  EncryptionInfo: S.optional(EncryptionInfo).pipe(T.JsonName("encryptionInfo")),
  EnhancedMonitoring: S.optional(S.String).pipe(
    T.JsonName("enhancedMonitoring"),
  ),
  OpenMonitoring: S.optional(OpenMonitoringInfo).pipe(
    T.JsonName("openMonitoring"),
  ),
  KafkaVersion: S.String.pipe(T.JsonName("kafkaVersion")),
  LoggingInfo: S.optional(LoggingInfo).pipe(T.JsonName("loggingInfo")),
  NumberOfBrokerNodes: S.Number.pipe(T.JsonName("numberOfBrokerNodes")),
  StorageMode: S.optional(S.String).pipe(T.JsonName("storageMode")),
}) {}
export class ErrorInfo extends S.Class<ErrorInfo>("ErrorInfo")({
  ErrorCode: S.optional(S.String).pipe(T.JsonName("errorCode")),
  ErrorString: S.optional(S.String).pipe(T.JsonName("errorString")),
}) {}
export class ClusterOperationStepInfo extends S.Class<ClusterOperationStepInfo>(
  "ClusterOperationStepInfo",
)({ StepStatus: S.optional(S.String).pipe(T.JsonName("stepStatus")) }) {}
export class ClusterOperationStep extends S.Class<ClusterOperationStep>(
  "ClusterOperationStep",
)({
  StepInfo: S.optional(ClusterOperationStepInfo).pipe(T.JsonName("stepInfo")),
  StepName: S.optional(S.String).pipe(T.JsonName("stepName")),
}) {}
export const __listOfClusterOperationStep = S.Array(ClusterOperationStep);
export class BrokerEBSVolumeInfo extends S.Class<BrokerEBSVolumeInfo>(
  "BrokerEBSVolumeInfo",
)({
  KafkaBrokerNodeId: S.String.pipe(T.JsonName("kafkaBrokerNodeId")),
  ProvisionedThroughput: S.optional(ProvisionedThroughput).pipe(
    T.JsonName("provisionedThroughput"),
  ),
  VolumeSizeGB: S.optional(S.Number).pipe(T.JsonName("volumeSizeGB")),
}) {}
export const __listOfBrokerEBSVolumeInfo = S.Array(BrokerEBSVolumeInfo);
export class JmxExporter extends S.Class<JmxExporter>("JmxExporter")({
  EnabledInBroker: S.Boolean.pipe(T.JsonName("enabledInBroker")),
}) {}
export class NodeExporter extends S.Class<NodeExporter>("NodeExporter")({
  EnabledInBroker: S.Boolean.pipe(T.JsonName("enabledInBroker")),
}) {}
export class Prometheus extends S.Class<Prometheus>("Prometheus")({
  JmxExporter: S.optional(JmxExporter).pipe(T.JsonName("jmxExporter")),
  NodeExporter: S.optional(NodeExporter).pipe(T.JsonName("nodeExporter")),
}) {}
export class OpenMonitoring extends S.Class<OpenMonitoring>("OpenMonitoring")({
  Prometheus: Prometheus.pipe(T.JsonName("prometheus")),
}) {}
export const __listOf__double = S.Array(S.Number);
export class BrokerCountUpdateInfo extends S.Class<BrokerCountUpdateInfo>(
  "BrokerCountUpdateInfo",
)({
  CreatedBrokerIds: S.optional(__listOf__double).pipe(
    T.JsonName("createdBrokerIds"),
  ),
  DeletedBrokerIds: S.optional(__listOf__double).pipe(
    T.JsonName("deletedBrokerIds"),
  ),
}) {}
export class MutableClusterInfo extends S.Class<MutableClusterInfo>(
  "MutableClusterInfo",
)({
  BrokerEBSVolumeInfo: S.optional(__listOfBrokerEBSVolumeInfo).pipe(
    T.JsonName("brokerEBSVolumeInfo"),
  ),
  ConfigurationInfo: S.optional(ConfigurationInfo).pipe(
    T.JsonName("configurationInfo"),
  ),
  NumberOfBrokerNodes: S.optional(S.Number).pipe(
    T.JsonName("numberOfBrokerNodes"),
  ),
  EnhancedMonitoring: S.optional(S.String).pipe(
    T.JsonName("enhancedMonitoring"),
  ),
  OpenMonitoring: S.optional(OpenMonitoring).pipe(T.JsonName("openMonitoring")),
  KafkaVersion: S.optional(S.String).pipe(T.JsonName("kafkaVersion")),
  LoggingInfo: S.optional(LoggingInfo).pipe(T.JsonName("loggingInfo")),
  InstanceType: S.optional(S.String).pipe(T.JsonName("instanceType")),
  ClientAuthentication: S.optional(ClientAuthentication).pipe(
    T.JsonName("clientAuthentication"),
  ),
  EncryptionInfo: S.optional(EncryptionInfo).pipe(T.JsonName("encryptionInfo")),
  ConnectivityInfo: S.optional(ConnectivityInfo).pipe(
    T.JsonName("connectivityInfo"),
  ),
  StorageMode: S.optional(S.String).pipe(T.JsonName("storageMode")),
  BrokerCountUpdateInfo: S.optional(BrokerCountUpdateInfo).pipe(
    T.JsonName("brokerCountUpdateInfo"),
  ),
  Rebalancing: S.optional(Rebalancing).pipe(T.JsonName("rebalancing")),
}) {}
export class UserIdentity extends S.Class<UserIdentity>("UserIdentity")({
  Type: S.optional(S.String).pipe(T.JsonName("type")),
  PrincipalId: S.optional(S.String).pipe(T.JsonName("principalId")),
}) {}
export class VpcConnectionInfo extends S.Class<VpcConnectionInfo>(
  "VpcConnectionInfo",
)({
  VpcConnectionArn: S.optional(S.String).pipe(T.JsonName("vpcConnectionArn")),
  Owner: S.optional(S.String).pipe(T.JsonName("owner")),
  UserIdentity: S.optional(UserIdentity).pipe(T.JsonName("userIdentity")),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("creationTime"),
  ),
}) {}
export class ClusterOperationInfo extends S.Class<ClusterOperationInfo>(
  "ClusterOperationInfo",
)({
  ClientRequestId: S.optional(S.String).pipe(T.JsonName("clientRequestId")),
  ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("creationTime"),
  ),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("endTime"),
  ),
  ErrorInfo: S.optional(ErrorInfo).pipe(T.JsonName("errorInfo")),
  OperationArn: S.optional(S.String).pipe(T.JsonName("operationArn")),
  OperationState: S.optional(S.String).pipe(T.JsonName("operationState")),
  OperationSteps: S.optional(__listOfClusterOperationStep).pipe(
    T.JsonName("operationSteps"),
  ),
  OperationType: S.optional(S.String).pipe(T.JsonName("operationType")),
  SourceClusterInfo: S.optional(MutableClusterInfo).pipe(
    T.JsonName("sourceClusterInfo"),
  ),
  TargetClusterInfo: S.optional(MutableClusterInfo).pipe(
    T.JsonName("targetClusterInfo"),
  ),
  VpcConnectionInfo: S.optional(VpcConnectionInfo).pipe(
    T.JsonName("vpcConnectionInfo"),
  ),
}) {}
export const __listOfClusterOperationInfo = S.Array(ClusterOperationInfo);
export class BrokerSoftwareInfo extends S.Class<BrokerSoftwareInfo>(
  "BrokerSoftwareInfo",
)({
  ConfigurationArn: S.optional(S.String).pipe(T.JsonName("configurationArn")),
  ConfigurationRevision: S.optional(S.Number).pipe(
    T.JsonName("configurationRevision"),
  ),
  KafkaVersion: S.optional(S.String).pipe(T.JsonName("kafkaVersion")),
}) {}
export class StateInfo extends S.Class<StateInfo>("StateInfo")({
  Code: S.optional(S.String).pipe(T.JsonName("code")),
  Message: S.optional(S.String).pipe(T.JsonName("message")),
}) {}
export class ClusterInfo extends S.Class<ClusterInfo>("ClusterInfo")({
  ActiveOperationArn: S.optional(S.String).pipe(
    T.JsonName("activeOperationArn"),
  ),
  BrokerNodeGroupInfo: S.optional(BrokerNodeGroupInfo).pipe(
    T.JsonName("brokerNodeGroupInfo"),
  ),
  Rebalancing: S.optional(Rebalancing).pipe(T.JsonName("rebalancing")),
  ClientAuthentication: S.optional(ClientAuthentication).pipe(
    T.JsonName("clientAuthentication"),
  ),
  ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
  ClusterName: S.optional(S.String).pipe(T.JsonName("clusterName")),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("creationTime"),
  ),
  CurrentBrokerSoftwareInfo: S.optional(BrokerSoftwareInfo).pipe(
    T.JsonName("currentBrokerSoftwareInfo"),
  ),
  CurrentVersion: S.optional(S.String).pipe(T.JsonName("currentVersion")),
  EncryptionInfo: S.optional(EncryptionInfo).pipe(T.JsonName("encryptionInfo")),
  EnhancedMonitoring: S.optional(S.String).pipe(
    T.JsonName("enhancedMonitoring"),
  ),
  OpenMonitoring: S.optional(OpenMonitoring).pipe(T.JsonName("openMonitoring")),
  LoggingInfo: S.optional(LoggingInfo).pipe(T.JsonName("loggingInfo")),
  NumberOfBrokerNodes: S.optional(S.Number).pipe(
    T.JsonName("numberOfBrokerNodes"),
  ),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  StateInfo: S.optional(StateInfo).pipe(T.JsonName("stateInfo")),
  Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  ZookeeperConnectString: S.optional(S.String).pipe(
    T.JsonName("zookeeperConnectString"),
  ),
  ZookeeperConnectStringTls: S.optional(S.String).pipe(
    T.JsonName("zookeeperConnectStringTls"),
  ),
  StorageMode: S.optional(S.String).pipe(T.JsonName("storageMode")),
  CustomerActionStatus: S.optional(S.String).pipe(
    T.JsonName("customerActionStatus"),
  ),
}) {}
export const __listOfClusterInfo = S.Array(ClusterInfo);
export class Provisioned extends S.Class<Provisioned>("Provisioned")({
  BrokerNodeGroupInfo: BrokerNodeGroupInfo.pipe(
    T.JsonName("brokerNodeGroupInfo"),
  ),
  Rebalancing: S.optional(Rebalancing).pipe(T.JsonName("rebalancing")),
  CurrentBrokerSoftwareInfo: S.optional(BrokerSoftwareInfo).pipe(
    T.JsonName("currentBrokerSoftwareInfo"),
  ),
  ClientAuthentication: S.optional(ClientAuthentication).pipe(
    T.JsonName("clientAuthentication"),
  ),
  EncryptionInfo: S.optional(EncryptionInfo).pipe(T.JsonName("encryptionInfo")),
  EnhancedMonitoring: S.optional(S.String).pipe(
    T.JsonName("enhancedMonitoring"),
  ),
  OpenMonitoring: S.optional(OpenMonitoringInfo).pipe(
    T.JsonName("openMonitoring"),
  ),
  LoggingInfo: S.optional(LoggingInfo).pipe(T.JsonName("loggingInfo")),
  NumberOfBrokerNodes: S.Number.pipe(T.JsonName("numberOfBrokerNodes")),
  ZookeeperConnectString: S.optional(S.String).pipe(
    T.JsonName("zookeeperConnectString"),
  ),
  ZookeeperConnectStringTls: S.optional(S.String).pipe(
    T.JsonName("zookeeperConnectStringTls"),
  ),
  StorageMode: S.optional(S.String).pipe(T.JsonName("storageMode")),
  CustomerActionStatus: S.optional(S.String).pipe(
    T.JsonName("customerActionStatus"),
  ),
}) {}
export class VpcConfig extends S.Class<VpcConfig>("VpcConfig")({
  SubnetIds: __listOf__string.pipe(T.JsonName("subnetIds")),
  SecurityGroupIds: S.optional(__listOf__string).pipe(
    T.JsonName("securityGroupIds"),
  ),
}) {}
export const __listOfVpcConfig = S.Array(VpcConfig);
export class ServerlessSasl extends S.Class<ServerlessSasl>("ServerlessSasl")({
  Iam: S.optional(Iam).pipe(T.JsonName("iam")),
}) {}
export class ServerlessClientAuthentication extends S.Class<ServerlessClientAuthentication>(
  "ServerlessClientAuthentication",
)({ Sasl: S.optional(ServerlessSasl).pipe(T.JsonName("sasl")) }) {}
export class Serverless extends S.Class<Serverless>("Serverless")({
  VpcConfigs: __listOfVpcConfig.pipe(T.JsonName("vpcConfigs")),
  ClientAuthentication: S.optional(ServerlessClientAuthentication).pipe(
    T.JsonName("clientAuthentication"),
  ),
}) {}
export class Cluster extends S.Class<Cluster>("Cluster")({
  ActiveOperationArn: S.optional(S.String).pipe(
    T.JsonName("activeOperationArn"),
  ),
  ClusterType: S.optional(S.String).pipe(T.JsonName("clusterType")),
  ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
  ClusterName: S.optional(S.String).pipe(T.JsonName("clusterName")),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("creationTime"),
  ),
  CurrentVersion: S.optional(S.String).pipe(T.JsonName("currentVersion")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  StateInfo: S.optional(StateInfo).pipe(T.JsonName("stateInfo")),
  Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  Provisioned: S.optional(Provisioned).pipe(T.JsonName("provisioned")),
  Serverless: S.optional(Serverless).pipe(T.JsonName("serverless")),
}) {}
export const __listOfCluster = S.Array(Cluster);
export class ConfigurationRevision extends S.Class<ConfigurationRevision>(
  "ConfigurationRevision",
)({
  CreationTime: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
    T.JsonName("creationTime"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  Revision: S.Number.pipe(T.JsonName("revision")),
}) {}
export const __listOfConfigurationRevision = S.Array(ConfigurationRevision);
export class ConsumerGroupReplicationUpdate extends S.Class<ConsumerGroupReplicationUpdate>(
  "ConsumerGroupReplicationUpdate",
)({
  ConsumerGroupsToExclude: __listOf__stringMax256.pipe(
    T.JsonName("consumerGroupsToExclude"),
  ),
  ConsumerGroupsToReplicate: __listOf__stringMax256.pipe(
    T.JsonName("consumerGroupsToReplicate"),
  ),
  DetectAndCopyNewConsumerGroups: S.Boolean.pipe(
    T.JsonName("detectAndCopyNewConsumerGroups"),
  ),
  SynchroniseConsumerGroupOffsets: S.Boolean.pipe(
    T.JsonName("synchroniseConsumerGroupOffsets"),
  ),
}) {}
export class TopicReplicationUpdate extends S.Class<TopicReplicationUpdate>(
  "TopicReplicationUpdate",
)({
  CopyAccessControlListsForTopics: S.Boolean.pipe(
    T.JsonName("copyAccessControlListsForTopics"),
  ),
  CopyTopicConfigurations: S.Boolean.pipe(
    T.JsonName("copyTopicConfigurations"),
  ),
  DetectAndCopyNewTopics: S.Boolean.pipe(T.JsonName("detectAndCopyNewTopics")),
  TopicsToExclude: __listOf__stringMax249.pipe(T.JsonName("topicsToExclude")),
  TopicsToReplicate: __listOf__stringMax249.pipe(
    T.JsonName("topicsToReplicate"),
  ),
}) {}
export class UnprocessedScramSecret extends S.Class<UnprocessedScramSecret>(
  "UnprocessedScramSecret",
)({
  ErrorCode: S.optional(S.String).pipe(T.JsonName("errorCode")),
  ErrorMessage: S.optional(S.String).pipe(T.JsonName("errorMessage")),
  SecretArn: S.optional(S.String).pipe(T.JsonName("secretArn")),
}) {}
export const __listOfUnprocessedScramSecret = S.Array(UnprocessedScramSecret);
export class BatchDisassociateScramSecretResponse extends S.Class<BatchDisassociateScramSecretResponse>(
  "BatchDisassociateScramSecretResponse",
)({
  ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
  UnprocessedScramSecrets: S.optional(__listOfUnprocessedScramSecret).pipe(
    T.JsonName("unprocessedScramSecrets"),
  ),
}) {}
export class CreateVpcConnectionResponse extends S.Class<CreateVpcConnectionResponse>(
  "CreateVpcConnectionResponse",
)({
  VpcConnectionArn: S.optional(S.String).pipe(T.JsonName("vpcConnectionArn")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  Authentication: S.optional(S.String).pipe(T.JsonName("authentication")),
  VpcId: S.optional(S.String).pipe(T.JsonName("vpcId")),
  ClientSubnets: S.optional(__listOf__string).pipe(T.JsonName("clientSubnets")),
  SecurityGroups: S.optional(__listOf__string).pipe(
    T.JsonName("securityGroups"),
  ),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("creationTime"),
  ),
  Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
}) {}
export class DeleteClusterResponse extends S.Class<DeleteClusterResponse>(
  "DeleteClusterResponse",
)({
  ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export class DeleteConfigurationResponse extends S.Class<DeleteConfigurationResponse>(
  "DeleteConfigurationResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export class DeleteReplicatorResponse extends S.Class<DeleteReplicatorResponse>(
  "DeleteReplicatorResponse",
)({
  ReplicatorArn: S.optional(S.String).pipe(T.JsonName("replicatorArn")),
  ReplicatorState: S.optional(S.String).pipe(T.JsonName("replicatorState")),
}) {}
export class DeleteVpcConnectionResponse extends S.Class<DeleteVpcConnectionResponse>(
  "DeleteVpcConnectionResponse",
)({
  VpcConnectionArn: S.optional(S.String).pipe(T.JsonName("vpcConnectionArn")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export class DescribeConfigurationResponse extends S.Class<DescribeConfigurationResponse>(
  "DescribeConfigurationResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("creationTime"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  KafkaVersions: S.optional(__listOf__string).pipe(T.JsonName("kafkaVersions")),
  LatestRevision: S.optional(ConfigurationRevision).pipe(
    T.JsonName("latestRevision"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export class DescribeConfigurationRevisionResponse extends S.Class<DescribeConfigurationRevisionResponse>(
  "DescribeConfigurationRevisionResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("creationTime"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  Revision: S.optional(S.Number).pipe(T.JsonName("revision")),
  ServerProperties: S.optional(T.Blob).pipe(T.JsonName("serverProperties")),
}) {}
export class DescribeTopicResponse extends S.Class<DescribeTopicResponse>(
  "DescribeTopicResponse",
)({
  TopicArn: S.optional(S.String).pipe(T.JsonName("topicArn")),
  TopicName: S.optional(S.String).pipe(T.JsonName("topicName")),
  ReplicationFactor: S.optional(S.Number).pipe(T.JsonName("replicationFactor")),
  PartitionCount: S.optional(S.Number).pipe(T.JsonName("partitionCount")),
  Configs: S.optional(S.String).pipe(T.JsonName("configs")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class DescribeVpcConnectionResponse extends S.Class<DescribeVpcConnectionResponse>(
  "DescribeVpcConnectionResponse",
)({
  VpcConnectionArn: S.optional(S.String).pipe(T.JsonName("vpcConnectionArn")),
  TargetClusterArn: S.optional(S.String).pipe(T.JsonName("targetClusterArn")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  Authentication: S.optional(S.String).pipe(T.JsonName("authentication")),
  VpcId: S.optional(S.String).pipe(T.JsonName("vpcId")),
  Subnets: S.optional(__listOf__string).pipe(T.JsonName("subnets")),
  SecurityGroups: S.optional(__listOf__string).pipe(
    T.JsonName("securityGroups"),
  ),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("creationTime"),
  ),
  Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
}) {}
export class GetBootstrapBrokersResponse extends S.Class<GetBootstrapBrokersResponse>(
  "GetBootstrapBrokersResponse",
)({
  BootstrapBrokerString: S.optional(S.String).pipe(
    T.JsonName("bootstrapBrokerString"),
  ),
  BootstrapBrokerStringTls: S.optional(S.String).pipe(
    T.JsonName("bootstrapBrokerStringTls"),
  ),
  BootstrapBrokerStringSaslScram: S.optional(S.String).pipe(
    T.JsonName("bootstrapBrokerStringSaslScram"),
  ),
  BootstrapBrokerStringSaslIam: S.optional(S.String).pipe(
    T.JsonName("bootstrapBrokerStringSaslIam"),
  ),
  BootstrapBrokerStringPublicTls: S.optional(S.String).pipe(
    T.JsonName("bootstrapBrokerStringPublicTls"),
  ),
  BootstrapBrokerStringPublicSaslScram: S.optional(S.String).pipe(
    T.JsonName("bootstrapBrokerStringPublicSaslScram"),
  ),
  BootstrapBrokerStringPublicSaslIam: S.optional(S.String).pipe(
    T.JsonName("bootstrapBrokerStringPublicSaslIam"),
  ),
  BootstrapBrokerStringVpcConnectivityTls: S.optional(S.String).pipe(
    T.JsonName("bootstrapBrokerStringVpcConnectivityTls"),
  ),
  BootstrapBrokerStringVpcConnectivitySaslScram: S.optional(S.String).pipe(
    T.JsonName("bootstrapBrokerStringVpcConnectivitySaslScram"),
  ),
  BootstrapBrokerStringVpcConnectivitySaslIam: S.optional(S.String).pipe(
    T.JsonName("bootstrapBrokerStringVpcConnectivitySaslIam"),
  ),
}) {}
export class GetClusterPolicyResponse extends S.Class<GetClusterPolicyResponse>(
  "GetClusterPolicyResponse",
)({
  CurrentVersion: S.optional(S.String).pipe(T.JsonName("currentVersion")),
  Policy: S.optional(S.String).pipe(T.JsonName("policy")),
}) {}
export class ListClusterOperationsResponse extends S.Class<ListClusterOperationsResponse>(
  "ListClusterOperationsResponse",
)({
  ClusterOperationInfoList: S.optional(__listOfClusterOperationInfo).pipe(
    T.JsonName("clusterOperationInfoList"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListClustersResponse extends S.Class<ListClustersResponse>(
  "ListClustersResponse",
)({
  ClusterInfoList: S.optional(__listOfClusterInfo).pipe(
    T.JsonName("clusterInfoList"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListClustersV2Response extends S.Class<ListClustersV2Response>(
  "ListClustersV2Response",
)({
  ClusterInfoList: S.optional(__listOfCluster).pipe(
    T.JsonName("clusterInfoList"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListConfigurationRevisionsResponse extends S.Class<ListConfigurationRevisionsResponse>(
  "ListConfigurationRevisionsResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  Revisions: S.optional(__listOfConfigurationRevision).pipe(
    T.JsonName("revisions"),
  ),
}) {}
export class ListScramSecretsResponse extends S.Class<ListScramSecretsResponse>(
  "ListScramSecretsResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  SecretArnList: S.optional(__listOf__string).pipe(T.JsonName("secretArnList")),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")) }) {}
export class PutClusterPolicyResponse extends S.Class<PutClusterPolicyResponse>(
  "PutClusterPolicyResponse",
)({
  CurrentVersion: S.optional(S.String).pipe(T.JsonName("currentVersion")),
}) {}
export class RebootBrokerResponse extends S.Class<RebootBrokerResponse>(
  "RebootBrokerResponse",
)({
  ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
  ClusterOperationArn: S.optional(S.String).pipe(
    T.JsonName("clusterOperationArn"),
  ),
}) {}
export class UpdateBrokerCountResponse extends S.Class<UpdateBrokerCountResponse>(
  "UpdateBrokerCountResponse",
)({
  ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
  ClusterOperationArn: S.optional(S.String).pipe(
    T.JsonName("clusterOperationArn"),
  ),
}) {}
export class UpdateBrokerStorageRequest extends S.Class<UpdateBrokerStorageRequest>(
  "UpdateBrokerStorageRequest",
)(
  {
    ClusterArn: S.String.pipe(T.HttpLabel()),
    CurrentVersion: S.String.pipe(T.JsonName("currentVersion")),
    TargetBrokerEBSVolumeInfo: __listOfBrokerEBSVolumeInfo.pipe(
      T.JsonName("targetBrokerEBSVolumeInfo"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/clusters/{ClusterArn}/nodes/storage" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateBrokerTypeResponse extends S.Class<UpdateBrokerTypeResponse>(
  "UpdateBrokerTypeResponse",
)({
  ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
  ClusterOperationArn: S.optional(S.String).pipe(
    T.JsonName("clusterOperationArn"),
  ),
}) {}
export class UpdateClusterConfigurationResponse extends S.Class<UpdateClusterConfigurationResponse>(
  "UpdateClusterConfigurationResponse",
)({
  ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
  ClusterOperationArn: S.optional(S.String).pipe(
    T.JsonName("clusterOperationArn"),
  ),
}) {}
export class UpdateClusterKafkaVersionResponse extends S.Class<UpdateClusterKafkaVersionResponse>(
  "UpdateClusterKafkaVersionResponse",
)({
  ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
  ClusterOperationArn: S.optional(S.String).pipe(
    T.JsonName("clusterOperationArn"),
  ),
}) {}
export class UpdateConfigurationResponse extends S.Class<UpdateConfigurationResponse>(
  "UpdateConfigurationResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  LatestRevision: S.optional(ConfigurationRevision).pipe(
    T.JsonName("latestRevision"),
  ),
}) {}
export class UpdateMonitoringResponse extends S.Class<UpdateMonitoringResponse>(
  "UpdateMonitoringResponse",
)({
  ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
  ClusterOperationArn: S.optional(S.String).pipe(
    T.JsonName("clusterOperationArn"),
  ),
}) {}
export class UpdateRebalancingResponse extends S.Class<UpdateRebalancingResponse>(
  "UpdateRebalancingResponse",
)({
  ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
  ClusterOperationArn: S.optional(S.String).pipe(
    T.JsonName("clusterOperationArn"),
  ),
}) {}
export class UpdateReplicationInfoRequest extends S.Class<UpdateReplicationInfoRequest>(
  "UpdateReplicationInfoRequest",
)(
  {
    ConsumerGroupReplication: S.optional(ConsumerGroupReplicationUpdate).pipe(
      T.JsonName("consumerGroupReplication"),
    ),
    CurrentVersion: S.String.pipe(T.JsonName("currentVersion")),
    ReplicatorArn: S.String.pipe(T.HttpLabel()),
    SourceKafkaClusterArn: S.String.pipe(T.JsonName("sourceKafkaClusterArn")),
    TargetKafkaClusterArn: S.String.pipe(T.JsonName("targetKafkaClusterArn")),
    TopicReplication: S.optional(TopicReplicationUpdate).pipe(
      T.JsonName("topicReplication"),
    ),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/replication/v1/replicators/{ReplicatorArn}/replication-info",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSecurityResponse extends S.Class<UpdateSecurityResponse>(
  "UpdateSecurityResponse",
)({
  ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
  ClusterOperationArn: S.optional(S.String).pipe(
    T.JsonName("clusterOperationArn"),
  ),
}) {}
export class UpdateStorageRequest extends S.Class<UpdateStorageRequest>(
  "UpdateStorageRequest",
)(
  {
    ClusterArn: S.String.pipe(T.HttpLabel()),
    CurrentVersion: S.String.pipe(T.JsonName("currentVersion")),
    ProvisionedThroughput: S.optional(ProvisionedThroughput).pipe(
      T.JsonName("provisionedThroughput"),
    ),
    StorageMode: S.optional(S.String).pipe(T.JsonName("storageMode")),
    VolumeSizeGB: S.optional(S.Number).pipe(T.JsonName("volumeSizeGB")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/clusters/{ClusterArn}/storage" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AmazonMskCluster extends S.Class<AmazonMskCluster>(
  "AmazonMskCluster",
)({ MskClusterArn: S.String.pipe(T.JsonName("mskClusterArn")) }) {}
export class KafkaClusterClientVpcConfig extends S.Class<KafkaClusterClientVpcConfig>(
  "KafkaClusterClientVpcConfig",
)({
  SecurityGroupIds: S.optional(__listOf__string).pipe(
    T.JsonName("securityGroupIds"),
  ),
  SubnetIds: __listOf__string.pipe(T.JsonName("subnetIds")),
}) {}
export class ConsumerGroupReplication extends S.Class<ConsumerGroupReplication>(
  "ConsumerGroupReplication",
)({
  ConsumerGroupsToExclude: S.optional(__listOf__stringMax256).pipe(
    T.JsonName("consumerGroupsToExclude"),
  ),
  ConsumerGroupsToReplicate: __listOf__stringMax256.pipe(
    T.JsonName("consumerGroupsToReplicate"),
  ),
  DetectAndCopyNewConsumerGroups: S.optional(S.Boolean).pipe(
    T.JsonName("detectAndCopyNewConsumerGroups"),
  ),
  SynchroniseConsumerGroupOffsets: S.optional(S.Boolean).pipe(
    T.JsonName("synchroniseConsumerGroupOffsets"),
  ),
}) {}
export const __listOf__integer = S.Array(S.Number);
export class KafkaCluster extends S.Class<KafkaCluster>("KafkaCluster")({
  AmazonMskCluster: AmazonMskCluster.pipe(T.JsonName("amazonMskCluster")),
  VpcConfig: KafkaClusterClientVpcConfig.pipe(T.JsonName("vpcConfig")),
}) {}
export const __listOfKafkaCluster = S.Array(KafkaCluster);
export class KafkaClusterDescription extends S.Class<KafkaClusterDescription>(
  "KafkaClusterDescription",
)({
  AmazonMskCluster: S.optional(AmazonMskCluster).pipe(
    T.JsonName("amazonMskCluster"),
  ),
  KafkaClusterAlias: S.optional(S.String).pipe(T.JsonName("kafkaClusterAlias")),
  VpcConfig: S.optional(KafkaClusterClientVpcConfig).pipe(
    T.JsonName("vpcConfig"),
  ),
}) {}
export const __listOfKafkaClusterDescription = S.Array(KafkaClusterDescription);
export class ReplicationStartingPosition extends S.Class<ReplicationStartingPosition>(
  "ReplicationStartingPosition",
)({ Type: S.optional(S.String).pipe(T.JsonName("type")) }) {}
export class ReplicationTopicNameConfiguration extends S.Class<ReplicationTopicNameConfiguration>(
  "ReplicationTopicNameConfiguration",
)({ Type: S.optional(S.String).pipe(T.JsonName("type")) }) {}
export class TopicReplication extends S.Class<TopicReplication>(
  "TopicReplication",
)({
  CopyAccessControlListsForTopics: S.optional(S.Boolean).pipe(
    T.JsonName("copyAccessControlListsForTopics"),
  ),
  CopyTopicConfigurations: S.optional(S.Boolean).pipe(
    T.JsonName("copyTopicConfigurations"),
  ),
  DetectAndCopyNewTopics: S.optional(S.Boolean).pipe(
    T.JsonName("detectAndCopyNewTopics"),
  ),
  StartingPosition: S.optional(ReplicationStartingPosition).pipe(
    T.JsonName("startingPosition"),
  ),
  TopicNameConfiguration: S.optional(ReplicationTopicNameConfiguration).pipe(
    T.JsonName("topicNameConfiguration"),
  ),
  TopicsToExclude: S.optional(__listOf__stringMax249).pipe(
    T.JsonName("topicsToExclude"),
  ),
  TopicsToReplicate: __listOf__stringMax249.pipe(
    T.JsonName("topicsToReplicate"),
  ),
}) {}
export class ReplicationInfoDescription extends S.Class<ReplicationInfoDescription>(
  "ReplicationInfoDescription",
)({
  ConsumerGroupReplication: S.optional(ConsumerGroupReplication).pipe(
    T.JsonName("consumerGroupReplication"),
  ),
  SourceKafkaClusterAlias: S.optional(S.String).pipe(
    T.JsonName("sourceKafkaClusterAlias"),
  ),
  TargetCompressionType: S.optional(S.String).pipe(
    T.JsonName("targetCompressionType"),
  ),
  TargetKafkaClusterAlias: S.optional(S.String).pipe(
    T.JsonName("targetKafkaClusterAlias"),
  ),
  TopicReplication: S.optional(TopicReplication).pipe(
    T.JsonName("topicReplication"),
  ),
}) {}
export const __listOfReplicationInfoDescription = S.Array(
  ReplicationInfoDescription,
);
export class ReplicationStateInfo extends S.Class<ReplicationStateInfo>(
  "ReplicationStateInfo",
)({
  Code: S.optional(S.String).pipe(T.JsonName("code")),
  Message: S.optional(S.String).pipe(T.JsonName("message")),
}) {}
export class TopicPartitionInfo extends S.Class<TopicPartitionInfo>(
  "TopicPartitionInfo",
)({
  Partition: S.optional(S.Number).pipe(T.JsonName("partition")),
  Leader: S.optional(S.Number).pipe(T.JsonName("leader")),
  Replicas: S.optional(__listOf__integer).pipe(T.JsonName("replicas")),
  Isr: S.optional(__listOf__integer).pipe(T.JsonName("isr")),
}) {}
export const __listOfTopicPartitionInfo = S.Array(TopicPartitionInfo);
export class CompatibleKafkaVersion extends S.Class<CompatibleKafkaVersion>(
  "CompatibleKafkaVersion",
)({
  SourceVersion: S.optional(S.String).pipe(T.JsonName("sourceVersion")),
  TargetVersions: S.optional(__listOf__string).pipe(
    T.JsonName("targetVersions"),
  ),
}) {}
export const __listOfCompatibleKafkaVersion = S.Array(CompatibleKafkaVersion);
export class ClientVpcConnection extends S.Class<ClientVpcConnection>(
  "ClientVpcConnection",
)({
  Authentication: S.optional(S.String).pipe(T.JsonName("authentication")),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("creationTime"),
  ),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  VpcConnectionArn: S.String.pipe(T.JsonName("vpcConnectionArn")),
  Owner: S.optional(S.String).pipe(T.JsonName("owner")),
}) {}
export const __listOfClientVpcConnection = S.Array(ClientVpcConnection);
export class ClusterOperationV2Summary extends S.Class<ClusterOperationV2Summary>(
  "ClusterOperationV2Summary",
)({
  ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
  ClusterType: S.optional(S.String).pipe(T.JsonName("clusterType")),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("startTime"),
  ),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("endTime"),
  ),
  OperationArn: S.optional(S.String).pipe(T.JsonName("operationArn")),
  OperationState: S.optional(S.String).pipe(T.JsonName("operationState")),
  OperationType: S.optional(S.String).pipe(T.JsonName("operationType")),
}) {}
export const __listOfClusterOperationV2Summary = S.Array(
  ClusterOperationV2Summary,
);
export class Configuration extends S.Class<Configuration>("Configuration")({
  Arn: S.String.pipe(T.JsonName("arn")),
  CreationTime: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
    T.JsonName("creationTime"),
  ),
  Description: S.String.pipe(T.JsonName("description")),
  KafkaVersions: __listOf__string.pipe(T.JsonName("kafkaVersions")),
  LatestRevision: ConfigurationRevision.pipe(T.JsonName("latestRevision")),
  Name: S.String.pipe(T.JsonName("name")),
  State: S.String.pipe(T.JsonName("state")),
}) {}
export const __listOfConfiguration = S.Array(Configuration);
export class KafkaVersion extends S.Class<KafkaVersion>("KafkaVersion")({
  Version: S.optional(S.String).pipe(T.JsonName("version")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export const __listOfKafkaVersion = S.Array(KafkaVersion);
export class TopicInfo extends S.Class<TopicInfo>("TopicInfo")({
  TopicArn: S.optional(S.String).pipe(T.JsonName("topicArn")),
  TopicName: S.optional(S.String).pipe(T.JsonName("topicName")),
  ReplicationFactor: S.optional(S.Number).pipe(T.JsonName("replicationFactor")),
  PartitionCount: S.optional(S.Number).pipe(T.JsonName("partitionCount")),
  OutOfSyncReplicaCount: S.optional(S.Number).pipe(
    T.JsonName("outOfSyncReplicaCount"),
  ),
}) {}
export const __listOfTopicInfo = S.Array(TopicInfo);
export class VpcConnection extends S.Class<VpcConnection>("VpcConnection")({
  VpcConnectionArn: S.String.pipe(T.JsonName("vpcConnectionArn")),
  TargetClusterArn: S.String.pipe(T.JsonName("targetClusterArn")),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("creationTime"),
  ),
  Authentication: S.optional(S.String).pipe(T.JsonName("authentication")),
  VpcId: S.optional(S.String).pipe(T.JsonName("vpcId")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export const __listOfVpcConnection = S.Array(VpcConnection);
export class BatchAssociateScramSecretResponse extends S.Class<BatchAssociateScramSecretResponse>(
  "BatchAssociateScramSecretResponse",
)({
  ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
  UnprocessedScramSecrets: S.optional(__listOfUnprocessedScramSecret).pipe(
    T.JsonName("unprocessedScramSecrets"),
  ),
}) {}
export class CreateConfigurationResponse extends S.Class<CreateConfigurationResponse>(
  "CreateConfigurationResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("creationTime"),
  ),
  LatestRevision: S.optional(ConfigurationRevision).pipe(
    T.JsonName("latestRevision"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export class DescribeReplicatorResponse extends S.Class<DescribeReplicatorResponse>(
  "DescribeReplicatorResponse",
)({
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("creationTime"),
  ),
  CurrentVersion: S.optional(S.String).pipe(T.JsonName("currentVersion")),
  IsReplicatorReference: S.optional(S.Boolean).pipe(
    T.JsonName("isReplicatorReference"),
  ),
  KafkaClusters: S.optional(__listOfKafkaClusterDescription).pipe(
    T.JsonName("kafkaClusters"),
  ),
  ReplicationInfoList: S.optional(__listOfReplicationInfoDescription).pipe(
    T.JsonName("replicationInfoList"),
  ),
  ReplicatorArn: S.optional(S.String).pipe(T.JsonName("replicatorArn")),
  ReplicatorDescription: S.optional(S.String).pipe(
    T.JsonName("replicatorDescription"),
  ),
  ReplicatorName: S.optional(S.String).pipe(T.JsonName("replicatorName")),
  ReplicatorResourceArn: S.optional(S.String).pipe(
    T.JsonName("replicatorResourceArn"),
  ),
  ReplicatorState: S.optional(S.String).pipe(T.JsonName("replicatorState")),
  ServiceExecutionRoleArn: S.optional(S.String).pipe(
    T.JsonName("serviceExecutionRoleArn"),
  ),
  StateInfo: S.optional(ReplicationStateInfo).pipe(T.JsonName("stateInfo")),
  Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
}) {}
export class DescribeTopicPartitionsResponse extends S.Class<DescribeTopicPartitionsResponse>(
  "DescribeTopicPartitionsResponse",
)({
  Partitions: S.optional(__listOfTopicPartitionInfo).pipe(
    T.JsonName("partitions"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class GetCompatibleKafkaVersionsResponse extends S.Class<GetCompatibleKafkaVersionsResponse>(
  "GetCompatibleKafkaVersionsResponse",
)({
  CompatibleKafkaVersions: S.optional(__listOfCompatibleKafkaVersion).pipe(
    T.JsonName("compatibleKafkaVersions"),
  ),
}) {}
export class ListClientVpcConnectionsResponse extends S.Class<ListClientVpcConnectionsResponse>(
  "ListClientVpcConnectionsResponse",
)({
  ClientVpcConnections: S.optional(__listOfClientVpcConnection).pipe(
    T.JsonName("clientVpcConnections"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListClusterOperationsV2Response extends S.Class<ListClusterOperationsV2Response>(
  "ListClusterOperationsV2Response",
)({
  ClusterOperationInfoList: S.optional(__listOfClusterOperationV2Summary).pipe(
    T.JsonName("clusterOperationInfoList"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListConfigurationsResponse extends S.Class<ListConfigurationsResponse>(
  "ListConfigurationsResponse",
)({
  Configurations: S.optional(__listOfConfiguration).pipe(
    T.JsonName("configurations"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListKafkaVersionsResponse extends S.Class<ListKafkaVersionsResponse>(
  "ListKafkaVersionsResponse",
)({
  KafkaVersions: S.optional(__listOfKafkaVersion).pipe(
    T.JsonName("kafkaVersions"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListTopicsResponse extends S.Class<ListTopicsResponse>(
  "ListTopicsResponse",
)({
  Topics: S.optional(__listOfTopicInfo).pipe(T.JsonName("topics")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListVpcConnectionsResponse extends S.Class<ListVpcConnectionsResponse>(
  "ListVpcConnectionsResponse",
)({
  VpcConnections: S.optional(__listOfVpcConnection).pipe(
    T.JsonName("vpcConnections"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class UpdateBrokerStorageResponse extends S.Class<UpdateBrokerStorageResponse>(
  "UpdateBrokerStorageResponse",
)({
  ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
  ClusterOperationArn: S.optional(S.String).pipe(
    T.JsonName("clusterOperationArn"),
  ),
}) {}
export class UpdateReplicationInfoResponse extends S.Class<UpdateReplicationInfoResponse>(
  "UpdateReplicationInfoResponse",
)({
  ReplicatorArn: S.optional(S.String).pipe(T.JsonName("replicatorArn")),
  ReplicatorState: S.optional(S.String).pipe(T.JsonName("replicatorState")),
}) {}
export class UpdateStorageResponse extends S.Class<UpdateStorageResponse>(
  "UpdateStorageResponse",
)({
  ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
  ClusterOperationArn: S.optional(S.String).pipe(
    T.JsonName("clusterOperationArn"),
  ),
}) {}
export class ClusterOperationV2Provisioned extends S.Class<ClusterOperationV2Provisioned>(
  "ClusterOperationV2Provisioned",
)({
  OperationSteps: S.optional(__listOfClusterOperationStep).pipe(
    T.JsonName("operationSteps"),
  ),
  SourceClusterInfo: S.optional(MutableClusterInfo).pipe(
    T.JsonName("sourceClusterInfo"),
  ),
  TargetClusterInfo: S.optional(MutableClusterInfo).pipe(
    T.JsonName("targetClusterInfo"),
  ),
  VpcConnectionInfo: S.optional(VpcConnectionInfo).pipe(
    T.JsonName("vpcConnectionInfo"),
  ),
}) {}
export class BrokerNodeInfo extends S.Class<BrokerNodeInfo>("BrokerNodeInfo")({
  AttachedENIId: S.optional(S.String).pipe(T.JsonName("attachedENIId")),
  BrokerId: S.optional(S.Number).pipe(T.JsonName("brokerId")),
  ClientSubnet: S.optional(S.String).pipe(T.JsonName("clientSubnet")),
  ClientVpcIpAddress: S.optional(S.String).pipe(
    T.JsonName("clientVpcIpAddress"),
  ),
  CurrentBrokerSoftwareInfo: S.optional(BrokerSoftwareInfo).pipe(
    T.JsonName("currentBrokerSoftwareInfo"),
  ),
  Endpoints: S.optional(__listOf__string).pipe(T.JsonName("endpoints")),
}) {}
export class ControllerNodeInfo extends S.Class<ControllerNodeInfo>(
  "ControllerNodeInfo",
)({ Endpoints: S.optional(__listOf__string).pipe(T.JsonName("endpoints")) }) {}
export class ZookeeperNodeInfo extends S.Class<ZookeeperNodeInfo>(
  "ZookeeperNodeInfo",
)({
  AttachedENIId: S.optional(S.String).pipe(T.JsonName("attachedENIId")),
  ClientVpcIpAddress: S.optional(S.String).pipe(
    T.JsonName("clientVpcIpAddress"),
  ),
  Endpoints: S.optional(__listOf__string).pipe(T.JsonName("endpoints")),
  ZookeeperId: S.optional(S.Number).pipe(T.JsonName("zookeeperId")),
  ZookeeperVersion: S.optional(S.String).pipe(T.JsonName("zookeeperVersion")),
}) {}
export class KafkaClusterSummary extends S.Class<KafkaClusterSummary>(
  "KafkaClusterSummary",
)({
  AmazonMskCluster: S.optional(AmazonMskCluster).pipe(
    T.JsonName("amazonMskCluster"),
  ),
  KafkaClusterAlias: S.optional(S.String).pipe(T.JsonName("kafkaClusterAlias")),
}) {}
export const __listOfKafkaClusterSummary = S.Array(KafkaClusterSummary);
export class ReplicationInfoSummary extends S.Class<ReplicationInfoSummary>(
  "ReplicationInfoSummary",
)({
  SourceKafkaClusterAlias: S.optional(S.String).pipe(
    T.JsonName("sourceKafkaClusterAlias"),
  ),
  TargetKafkaClusterAlias: S.optional(S.String).pipe(
    T.JsonName("targetKafkaClusterAlias"),
  ),
}) {}
export const __listOfReplicationInfoSummary = S.Array(ReplicationInfoSummary);
export class ServerlessRequest extends S.Class<ServerlessRequest>(
  "ServerlessRequest",
)({
  VpcConfigs: __listOfVpcConfig.pipe(T.JsonName("vpcConfigs")),
  ClientAuthentication: S.optional(ServerlessClientAuthentication).pipe(
    T.JsonName("clientAuthentication"),
  ),
}) {}
export class ReplicationInfo extends S.Class<ReplicationInfo>(
  "ReplicationInfo",
)({
  ConsumerGroupReplication: ConsumerGroupReplication.pipe(
    T.JsonName("consumerGroupReplication"),
  ),
  SourceKafkaClusterArn: S.String.pipe(T.JsonName("sourceKafkaClusterArn")),
  TargetCompressionType: S.String.pipe(T.JsonName("targetCompressionType")),
  TargetKafkaClusterArn: S.String.pipe(T.JsonName("targetKafkaClusterArn")),
  TopicReplication: TopicReplication.pipe(T.JsonName("topicReplication")),
}) {}
export const __listOfReplicationInfo = S.Array(ReplicationInfo);
export class NodeInfo extends S.Class<NodeInfo>("NodeInfo")({
  AddedToClusterTime: S.optional(S.String).pipe(
    T.JsonName("addedToClusterTime"),
  ),
  BrokerNodeInfo: S.optional(BrokerNodeInfo).pipe(T.JsonName("brokerNodeInfo")),
  ControllerNodeInfo: S.optional(ControllerNodeInfo).pipe(
    T.JsonName("controllerNodeInfo"),
  ),
  InstanceType: S.optional(S.String).pipe(T.JsonName("instanceType")),
  NodeARN: S.optional(S.String).pipe(T.JsonName("nodeARN")),
  NodeType: S.optional(S.String).pipe(T.JsonName("nodeType")),
  ZookeeperNodeInfo: S.optional(ZookeeperNodeInfo).pipe(
    T.JsonName("zookeeperNodeInfo"),
  ),
}) {}
export const __listOfNodeInfo = S.Array(NodeInfo);
export class ReplicatorSummary extends S.Class<ReplicatorSummary>(
  "ReplicatorSummary",
)({
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("creationTime"),
  ),
  CurrentVersion: S.optional(S.String).pipe(T.JsonName("currentVersion")),
  IsReplicatorReference: S.optional(S.Boolean).pipe(
    T.JsonName("isReplicatorReference"),
  ),
  KafkaClustersSummary: S.optional(__listOfKafkaClusterSummary).pipe(
    T.JsonName("kafkaClustersSummary"),
  ),
  ReplicationInfoSummaryList: S.optional(__listOfReplicationInfoSummary).pipe(
    T.JsonName("replicationInfoSummaryList"),
  ),
  ReplicatorArn: S.optional(S.String).pipe(T.JsonName("replicatorArn")),
  ReplicatorName: S.optional(S.String).pipe(T.JsonName("replicatorName")),
  ReplicatorResourceArn: S.optional(S.String).pipe(
    T.JsonName("replicatorResourceArn"),
  ),
  ReplicatorState: S.optional(S.String).pipe(T.JsonName("replicatorState")),
}) {}
export const __listOfReplicatorSummary = S.Array(ReplicatorSummary);
export class VpcConnectionInfoServerless extends S.Class<VpcConnectionInfoServerless>(
  "VpcConnectionInfoServerless",
)({
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("creationTime"),
  ),
  Owner: S.optional(S.String).pipe(T.JsonName("owner")),
  UserIdentity: S.optional(UserIdentity).pipe(T.JsonName("userIdentity")),
  VpcConnectionArn: S.optional(S.String).pipe(T.JsonName("vpcConnectionArn")),
}) {}
export class CreateClusterRequest extends S.Class<CreateClusterRequest>(
  "CreateClusterRequest",
)(
  {
    BrokerNodeGroupInfo: BrokerNodeGroupInfo.pipe(
      T.JsonName("brokerNodeGroupInfo"),
    ),
    Rebalancing: S.optional(Rebalancing).pipe(T.JsonName("rebalancing")),
    ClientAuthentication: S.optional(ClientAuthentication).pipe(
      T.JsonName("clientAuthentication"),
    ),
    ClusterName: S.String.pipe(T.JsonName("clusterName")),
    ConfigurationInfo: S.optional(ConfigurationInfo).pipe(
      T.JsonName("configurationInfo"),
    ),
    EncryptionInfo: S.optional(EncryptionInfo).pipe(
      T.JsonName("encryptionInfo"),
    ),
    EnhancedMonitoring: S.optional(S.String).pipe(
      T.JsonName("enhancedMonitoring"),
    ),
    OpenMonitoring: S.optional(OpenMonitoringInfo).pipe(
      T.JsonName("openMonitoring"),
    ),
    KafkaVersion: S.String.pipe(T.JsonName("kafkaVersion")),
    LoggingInfo: S.optional(LoggingInfo).pipe(T.JsonName("loggingInfo")),
    NumberOfBrokerNodes: S.Number.pipe(T.JsonName("numberOfBrokerNodes")),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    StorageMode: S.optional(S.String).pipe(T.JsonName("storageMode")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/clusters" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateClusterV2Request extends S.Class<CreateClusterV2Request>(
  "CreateClusterV2Request",
)(
  {
    ClusterName: S.String.pipe(T.JsonName("clusterName")),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    Provisioned: S.optional(ProvisionedRequest).pipe(T.JsonName("provisioned")),
    Serverless: S.optional(ServerlessRequest).pipe(T.JsonName("serverless")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/api/v2/clusters" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateReplicatorRequest extends S.Class<CreateReplicatorRequest>(
  "CreateReplicatorRequest",
)(
  {
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    KafkaClusters: __listOfKafkaCluster.pipe(T.JsonName("kafkaClusters")),
    ReplicationInfoList: __listOfReplicationInfo.pipe(
      T.JsonName("replicationInfoList"),
    ),
    ReplicatorName: S.String.pipe(T.JsonName("replicatorName")),
    ServiceExecutionRoleArn: S.String.pipe(
      T.JsonName("serviceExecutionRoleArn"),
    ),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/replication/v1/replicators" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeClusterV2Response extends S.Class<DescribeClusterV2Response>(
  "DescribeClusterV2Response",
)({ ClusterInfo: S.optional(Cluster).pipe(T.JsonName("clusterInfo")) }) {}
export class ListNodesResponse extends S.Class<ListNodesResponse>(
  "ListNodesResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  NodeInfoList: S.optional(__listOfNodeInfo).pipe(T.JsonName("nodeInfoList")),
}) {}
export class ListReplicatorsResponse extends S.Class<ListReplicatorsResponse>(
  "ListReplicatorsResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  Replicators: S.optional(__listOfReplicatorSummary).pipe(
    T.JsonName("replicators"),
  ),
}) {}
export class ClusterOperationV2Serverless extends S.Class<ClusterOperationV2Serverless>(
  "ClusterOperationV2Serverless",
)({
  VpcConnectionInfo: S.optional(VpcConnectionInfoServerless).pipe(
    T.JsonName("vpcConnectionInfo"),
  ),
}) {}
export class ClusterOperationV2 extends S.Class<ClusterOperationV2>(
  "ClusterOperationV2",
)({
  ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
  ClusterType: S.optional(S.String).pipe(T.JsonName("clusterType")),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("startTime"),
  ),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("endTime"),
  ),
  ErrorInfo: S.optional(ErrorInfo).pipe(T.JsonName("errorInfo")),
  OperationArn: S.optional(S.String).pipe(T.JsonName("operationArn")),
  OperationState: S.optional(S.String).pipe(T.JsonName("operationState")),
  OperationType: S.optional(S.String).pipe(T.JsonName("operationType")),
  Provisioned: S.optional(ClusterOperationV2Provisioned).pipe(
    T.JsonName("provisioned"),
  ),
  Serverless: S.optional(ClusterOperationV2Serverless).pipe(
    T.JsonName("serverless"),
  ),
}) {}
export class CreateClusterResponse extends S.Class<CreateClusterResponse>(
  "CreateClusterResponse",
)({
  ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
  ClusterName: S.optional(S.String).pipe(T.JsonName("clusterName")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export class CreateClusterV2Response extends S.Class<CreateClusterV2Response>(
  "CreateClusterV2Response",
)({
  ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
  ClusterName: S.optional(S.String).pipe(T.JsonName("clusterName")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  ClusterType: S.optional(S.String).pipe(T.JsonName("clusterType")),
}) {}
export class CreateReplicatorResponse extends S.Class<CreateReplicatorResponse>(
  "CreateReplicatorResponse",
)({
  ReplicatorArn: S.optional(S.String).pipe(T.JsonName("replicatorArn")),
  ReplicatorName: S.optional(S.String).pipe(T.JsonName("replicatorName")),
  ReplicatorState: S.optional(S.String).pipe(T.JsonName("replicatorState")),
}) {}
export class DescribeClusterOperationResponse extends S.Class<DescribeClusterOperationResponse>(
  "DescribeClusterOperationResponse",
)({
  ClusterOperationInfo: S.optional(ClusterOperationInfo).pipe(
    T.JsonName("clusterOperationInfo"),
  ),
}) {}
export class DescribeClusterOperationV2Response extends S.Class<DescribeClusterOperationV2Response>(
  "DescribeClusterOperationV2Response",
)({
  ClusterOperationInfo: S.optional(ClusterOperationV2).pipe(
    T.JsonName("clusterOperationInfo"),
  ),
}) {}
export class DescribeClusterResponse extends S.Class<DescribeClusterResponse>(
  "DescribeClusterResponse",
)({ ClusterInfo: S.optional(ClusterInfo).pipe(T.JsonName("clusterInfo")) }) {}
export class UpdateConnectivityRequest extends S.Class<UpdateConnectivityRequest>(
  "UpdateConnectivityRequest",
)(
  {
    ClusterArn: S.String.pipe(T.HttpLabel()),
    ConnectivityInfo: ConnectivityInfo.pipe(T.JsonName("connectivityInfo")),
    CurrentVersion: S.String.pipe(T.JsonName("currentVersion")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/clusters/{ClusterArn}/connectivity" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateConnectivityResponse extends S.Class<UpdateConnectivityResponse>(
  "UpdateConnectivityResponse",
)({
  ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
  ClusterOperationArn: S.optional(S.String).pipe(
    T.JsonName("clusterOperationArn"),
  ),
}) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {},
) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  {},
) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  {},
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {},
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  {},
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {},
) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}

//# Operations
/**
 * Deletes the MSK cluster specified by the Amazon Resource Name (ARN) in the request.
 */
export const deleteCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterRequest,
  output: DeleteClusterResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Deletes the MSK cluster policy specified by the Amazon Resource Name (ARN) in the request.
 */
export const deleteClusterPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterPolicyRequest,
  output: DeleteClusterPolicyResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Deletes an MSK Configuration.
 */
export const deleteConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfigurationRequest,
  output: DeleteConfigurationResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Deletes a MSK VPC connection.
 */
export const deleteVpcConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVpcConnectionRequest,
  output: DeleteVpcConnectionResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Returns a description of this MSK configuration.
 */
export const describeConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeConfigurationRequest,
    output: DescribeConfigurationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      ServiceUnavailableException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Returns a description of this revision of the configuration.
 */
export const describeConfigurationRevision =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeConfigurationRevisionRequest,
    output: DescribeConfigurationRevisionResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      ServiceUnavailableException,
      UnauthorizedException,
    ],
  }));
/**
 * Returns topic details of this topic on a MSK cluster.
 */
export const describeTopic = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTopicRequest,
  output: DescribeTopicResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Returns a description of this MSK VPC connection.
 */
export const describeVpcConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeVpcConnectionRequest,
    output: DescribeVpcConnectionResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      ServiceUnavailableException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Get the MSK cluster policy specified by the Amazon Resource Name (ARN) in the request.
 */
export const getClusterPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetClusterPolicyRequest,
  output: GetClusterPolicyResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Returns a list of all the operations that have been performed on the specified MSK cluster.
 */
export const listClusterOperations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListClusterOperationsRequest,
    output: ListClusterOperationsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Returns a list of all the MSK clusters in the current Region.
 */
export const listClusters = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListClustersRequest,
  output: ListClustersResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    UnauthorizedException,
  ],
}));
/**
 * Returns a list of all the MSK clusters in the current Region.
 */
export const listClustersV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListClustersV2Request,
  output: ListClustersV2Response,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    UnauthorizedException,
  ],
}));
/**
 * Returns a list of all the MSK configurations in this Region.
 */
export const listConfigurationRevisions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListConfigurationRevisionsRequest,
    output: ListConfigurationRevisionsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      ServiceUnavailableException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Returns a list of the Scram Secrets associated with an Amazon MSK cluster.
 */
export const listScramSecrets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListScramSecretsRequest,
  output: ListScramSecretsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Returns a list of the tags associated with the specified resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Creates or updates the MSK cluster policy specified by the cluster Amazon Resource Name (ARN) in the request.
 */
export const putClusterPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutClusterPolicyRequest,
  output: PutClusterPolicyResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
  ],
}));
/**
 * Reboots brokers.
 */
export const rebootBroker = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootBrokerRequest,
  output: RebootBrokerResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Returns empty response.
 */
export const rejectClientVpcConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RejectClientVpcConnectionRequest,
    output: RejectClientVpcConnectionResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      ServiceUnavailableException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Adds tags to the specified MSK resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Removes the tags associated with the keys that are provided in the query.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Updates the number of broker nodes in the cluster.
 */
export const updateBrokerCount = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBrokerCountRequest,
  output: UpdateBrokerCountResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Updates EC2 instance type.
 */
export const updateBrokerType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBrokerTypeRequest,
  output: UpdateBrokerTypeResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Updates the cluster with the configuration that is specified in the request body.
 */
export const updateClusterConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateClusterConfigurationRequest,
    output: UpdateClusterConfigurationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      ServiceUnavailableException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Updates the Apache Kafka version for the cluster.
 */
export const updateClusterKafkaVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateClusterKafkaVersionRequest,
    output: UpdateClusterKafkaVersionResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      ServiceUnavailableException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Updates an MSK configuration.
 */
export const updateConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConfigurationRequest,
  output: UpdateConfigurationResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Updates the monitoring settings for the cluster. You can use this operation to specify which Apache Kafka metrics you want Amazon MSK to send to Amazon CloudWatch. You can also specify settings for open monitoring with Prometheus.
 */
export const updateMonitoring = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMonitoringRequest,
  output: UpdateMonitoringResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Use this resource to update the intelligent rebalancing status of an Amazon MSK Provisioned cluster with Express brokers.
 */
export const updateRebalancing = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRebalancingRequest,
  output: UpdateRebalancingResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Updates the security settings for the cluster. You can use this operation to specify encryption and authentication on existing clusters.
 */
export const updateSecurity = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSecurityRequest,
  output: UpdateSecurityResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Associates one or more Scram Secrets with an Amazon MSK cluster.
 */
export const batchAssociateScramSecret = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchAssociateScramSecretRequest,
    output: BatchAssociateScramSecretResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      ServiceUnavailableException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Disassociates one or more Scram Secrets from an Amazon MSK cluster.
 */
export const batchDisassociateScramSecret =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchDisassociateScramSecretRequest,
    output: BatchDisassociateScramSecretResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      ServiceUnavailableException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
  }));
/**
 * Creates a new MSK configuration.
 */
export const createConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConfigurationRequest,
  output: CreateConfigurationResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a new MSK VPC connection.
 */
export const createVpcConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVpcConnectionRequest,
  output: CreateVpcConnectionResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a replicator.
 */
export const deleteReplicator = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteReplicatorRequest,
  output: DeleteReplicatorResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Describes a replicator.
 */
export const describeReplicator = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeReplicatorRequest,
  output: DescribeReplicatorResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Returns partition details of this topic on a MSK cluster.
 */
export const describeTopicPartitions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeTopicPartitionsRequest,
    output: DescribeTopicPartitionsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * A list of brokers that a client application can use to bootstrap. This list doesn't necessarily include all of the brokers in the cluster. The following Python 3.6 example shows how you can use the Amazon Resource Name (ARN) of a cluster to get its bootstrap brokers. If you don't know the ARN of your cluster, you can use the `ListClusters` operation to get the ARNs of all the clusters in this account and Region.
 */
export const getBootstrapBrokers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBootstrapBrokersRequest,
  output: GetBootstrapBrokersResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    UnauthorizedException,
  ],
}));
/**
 * Gets the Apache Kafka versions to which you can update the MSK cluster.
 */
export const getCompatibleKafkaVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCompatibleKafkaVersionsRequest,
    output: GetCompatibleKafkaVersionsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      ServiceUnavailableException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Returns a list of all the VPC connections in this Region.
 */
export const listClientVpcConnections = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListClientVpcConnectionsRequest,
    output: ListClientVpcConnectionsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      ServiceUnavailableException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Returns a list of all the operations that have been performed on the specified MSK cluster.
 */
export const listClusterOperationsV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListClusterOperationsV2Request,
    output: ListClusterOperationsV2Response,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      ServiceUnavailableException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Returns a list of all the MSK configurations in this Region.
 */
export const listConfigurations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListConfigurationsRequest,
  output: ListConfigurationsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Returns a list of Apache Kafka versions.
 */
export const listKafkaVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListKafkaVersionsRequest,
  output: ListKafkaVersionsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    UnauthorizedException,
  ],
}));
/**
 * List topics in a MSK cluster.
 */
export const listTopics = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTopicsRequest,
  output: ListTopicsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Returns a list of all the VPC connections in this Region.
 */
export const listVpcConnections = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListVpcConnectionsRequest,
  output: ListVpcConnectionsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Updates the EBS storage associated with MSK brokers.
 */
export const updateBrokerStorage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBrokerStorageRequest,
  output: UpdateBrokerStorageResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Updates replication info of a replicator.
 */
export const updateReplicationInfo = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateReplicationInfoRequest,
    output: UpdateReplicationInfoResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      ServiceUnavailableException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Updates cluster broker volume size (or) sets cluster storage mode to TIERED.
 */
export const updateStorage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStorageRequest,
  output: UpdateStorageResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Returns a description of the MSK cluster whose Amazon Resource Name (ARN) is specified in the request.
 */
export const describeClusterV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeClusterV2Request,
  output: DescribeClusterV2Response,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Returns a list of the broker nodes in the cluster.
 */
export const listNodes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListNodesRequest,
  output: ListNodesResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Lists the replicators.
 */
export const listReplicators = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListReplicatorsRequest,
  output: ListReplicatorsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a new MSK cluster.
 */
export const createCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClusterRequest,
  output: CreateClusterResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a new MSK cluster.
 */
export const createClusterV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClusterV2Request,
  output: CreateClusterV2Response,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Creates the replicator.
 */
export const createReplicator = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateReplicatorRequest,
  output: CreateReplicatorResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Returns a description of the cluster operation specified by the ARN.
 */
export const describeClusterOperation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeClusterOperationRequest,
    output: DescribeClusterOperationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Returns a description of the cluster operation specified by the ARN.
 */
export const describeClusterOperationV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeClusterOperationV2Request,
    output: DescribeClusterOperationV2Response,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      ServiceUnavailableException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Returns a description of the MSK cluster whose Amazon Resource Name (ARN) is specified in the request.
 */
export const describeCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeClusterRequest,
  output: DescribeClusterResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Updates the cluster's connectivity configuration.
 */
export const updateConnectivity = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConnectivityRequest,
  output: UpdateConnectivityResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
