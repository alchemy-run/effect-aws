import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({ sdkId: "Kafka", serviceShapeName: "Kafka" });
const auth = T.AwsAuthSigv4({ name: "kafka" });
const ver = T.ServiceVersion("2018-11-14");
const proto = T.AwsProtocolsRestJson1();
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
              `https://kafka-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://kafka.${Region}.amazonaws.com`);
            }
            return e(
              `https://kafka-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://kafka.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://kafka.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type __stringMin1Max64 = string;
export type __stringMin1Max128 = string;
export type __integerMin1Max15 = number;
export type __blob = Uint8Array;
export type __stringMax1024 = string;
export type __stringMin1Max128Pattern09AZaZ09AZaZ0 = string;
export type MaxResults = number;
export type __stringMin5Max32 = string;
export type __stringMax256 = string;
export type __stringMax249 = string;
export type __timestampIso8601 = Date;
export type __integerMin1Max16384 = number;

//# Schemas
export type __listOf__string = string[];
export const __listOf__string = S.Array(S.String);
export type EnhancedMonitoring =
  | "DEFAULT"
  | "PER_BROKER"
  | "PER_TOPIC_PER_BROKER"
  | "PER_TOPIC_PER_PARTITION";
export const EnhancedMonitoring = S.Literal(
  "DEFAULT",
  "PER_BROKER",
  "PER_TOPIC_PER_BROKER",
  "PER_TOPIC_PER_PARTITION",
);
export type StorageMode = "LOCAL" | "TIERED";
export const StorageMode = S.Literal("LOCAL", "TIERED");
export interface BatchAssociateScramSecretRequest {
  ClusterArn: string;
  SecretArnList?: string[];
}
export const BatchAssociateScramSecretRequest = S.suspend(() =>
  S.Struct({
    ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")),
    SecretArnList: S.optional(__listOf__string).pipe(
      T.JsonName("secretArnList"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v1/clusters/{ClusterArn}/scram-secrets",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchAssociateScramSecretRequest",
}) as any as S.Schema<BatchAssociateScramSecretRequest>;
export interface BatchDisassociateScramSecretRequest {
  ClusterArn: string;
  SecretArnList?: string[];
}
export const BatchDisassociateScramSecretRequest = S.suspend(() =>
  S.Struct({
    ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")),
    SecretArnList: S.optional(__listOf__string).pipe(
      T.JsonName("secretArnList"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/v1/clusters/{ClusterArn}/scram-secrets",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDisassociateScramSecretRequest",
}) as any as S.Schema<BatchDisassociateScramSecretRequest>;
export interface CreateConfigurationRequest {
  Description?: string;
  KafkaVersions?: string[];
  Name?: string;
  ServerProperties?: Uint8Array;
}
export const CreateConfigurationRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    KafkaVersions: S.optional(__listOf__string).pipe(
      T.JsonName("kafkaVersions"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    ServerProperties: S.optional(T.Blob).pipe(T.JsonName("serverProperties")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/configurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConfigurationRequest",
}) as any as S.Schema<CreateConfigurationRequest>;
export type __mapOf__string = { [key: string]: string };
export const __mapOf__string = S.Record({ key: S.String, value: S.String });
export interface CreateVpcConnectionRequest {
  TargetClusterArn?: string;
  Authentication?: string;
  VpcId?: string;
  ClientSubnets?: string[];
  SecurityGroups?: string[];
  Tags?: { [key: string]: string };
}
export const CreateVpcConnectionRequest = S.suspend(() =>
  S.Struct({
    TargetClusterArn: S.optional(S.String).pipe(T.JsonName("targetClusterArn")),
    Authentication: S.optional(S.String).pipe(T.JsonName("authentication")),
    VpcId: S.optional(S.String).pipe(T.JsonName("vpcId")),
    ClientSubnets: S.optional(__listOf__string).pipe(
      T.JsonName("clientSubnets"),
    ),
    SecurityGroups: S.optional(__listOf__string).pipe(
      T.JsonName("securityGroups"),
    ),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/vpc-connection" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateVpcConnectionRequest",
}) as any as S.Schema<CreateVpcConnectionRequest>;
export interface DeleteClusterRequest {
  ClusterArn: string;
  CurrentVersion?: string;
}
export const DeleteClusterRequest = S.suspend(() =>
  S.Struct({
    ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")),
    CurrentVersion: S.optional(S.String).pipe(T.HttpQuery("currentVersion")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/clusters/{ClusterArn}" }),
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
export interface DeleteClusterPolicyRequest {
  ClusterArn: string;
}
export const DeleteClusterPolicyRequest = S.suspend(() =>
  S.Struct({ ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/clusters/{ClusterArn}/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteClusterPolicyRequest",
}) as any as S.Schema<DeleteClusterPolicyRequest>;
export interface DeleteClusterPolicyResponse {}
export const DeleteClusterPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteClusterPolicyResponse",
}) as any as S.Schema<DeleteClusterPolicyResponse>;
export interface DeleteConfigurationRequest {
  Arn: string;
}
export const DeleteConfigurationRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/configurations/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConfigurationRequest",
}) as any as S.Schema<DeleteConfigurationRequest>;
export interface DeleteReplicatorRequest {
  CurrentVersion?: string;
  ReplicatorArn: string;
}
export const DeleteReplicatorRequest = S.suspend(() =>
  S.Struct({
    CurrentVersion: S.optional(S.String).pipe(T.HttpQuery("currentVersion")),
    ReplicatorArn: S.String.pipe(T.HttpLabel("ReplicatorArn")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteReplicatorRequest",
}) as any as S.Schema<DeleteReplicatorRequest>;
export interface DeleteVpcConnectionRequest {
  Arn: string;
}
export const DeleteVpcConnectionRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/vpc-connection/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteVpcConnectionRequest",
}) as any as S.Schema<DeleteVpcConnectionRequest>;
export interface DescribeClusterRequest {
  ClusterArn: string;
}
export const DescribeClusterRequest = S.suspend(() =>
  S.Struct({ ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/clusters/{ClusterArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeClusterRequest",
}) as any as S.Schema<DescribeClusterRequest>;
export interface DescribeClusterOperationRequest {
  ClusterOperationArn: string;
}
export const DescribeClusterOperationRequest = S.suspend(() =>
  S.Struct({
    ClusterOperationArn: S.String.pipe(T.HttpLabel("ClusterOperationArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/operations/{ClusterOperationArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeClusterOperationRequest",
}) as any as S.Schema<DescribeClusterOperationRequest>;
export interface DescribeClusterOperationV2Request {
  ClusterOperationArn: string;
}
export const DescribeClusterOperationV2Request = S.suspend(() =>
  S.Struct({
    ClusterOperationArn: S.String.pipe(T.HttpLabel("ClusterOperationArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/api/v2/operations/{ClusterOperationArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeClusterOperationV2Request",
}) as any as S.Schema<DescribeClusterOperationV2Request>;
export interface DescribeClusterV2Request {
  ClusterArn: string;
}
export const DescribeClusterV2Request = S.suspend(() =>
  S.Struct({ ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/api/v2/clusters/{ClusterArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeClusterV2Request",
}) as any as S.Schema<DescribeClusterV2Request>;
export interface DescribeConfigurationRequest {
  Arn: string;
}
export const DescribeConfigurationRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/configurations/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConfigurationRequest",
}) as any as S.Schema<DescribeConfigurationRequest>;
export interface DescribeConfigurationRevisionRequest {
  Arn: string;
  Revision: number;
}
export const DescribeConfigurationRevisionRequest = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.HttpLabel("Arn")),
    Revision: S.Number.pipe(T.HttpLabel("Revision")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DescribeConfigurationRevisionRequest",
}) as any as S.Schema<DescribeConfigurationRevisionRequest>;
export interface DescribeReplicatorRequest {
  ReplicatorArn: string;
}
export const DescribeReplicatorRequest = S.suspend(() =>
  S.Struct({ ReplicatorArn: S.String.pipe(T.HttpLabel("ReplicatorArn")) }).pipe(
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
  ),
).annotations({
  identifier: "DescribeReplicatorRequest",
}) as any as S.Schema<DescribeReplicatorRequest>;
export interface DescribeTopicRequest {
  ClusterArn: string;
  TopicName: string;
}
export const DescribeTopicRequest = S.suspend(() =>
  S.Struct({
    ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")),
    TopicName: S.String.pipe(T.HttpLabel("TopicName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DescribeTopicRequest",
}) as any as S.Schema<DescribeTopicRequest>;
export interface DescribeTopicPartitionsRequest {
  ClusterArn: string;
  TopicName: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeTopicPartitionsRequest = S.suspend(() =>
  S.Struct({
    ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")),
    TopicName: S.String.pipe(T.HttpLabel("TopicName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DescribeTopicPartitionsRequest",
}) as any as S.Schema<DescribeTopicPartitionsRequest>;
export interface DescribeVpcConnectionRequest {
  Arn: string;
}
export const DescribeVpcConnectionRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/vpc-connection/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeVpcConnectionRequest",
}) as any as S.Schema<DescribeVpcConnectionRequest>;
export interface GetBootstrapBrokersRequest {
  ClusterArn: string;
}
export const GetBootstrapBrokersRequest = S.suspend(() =>
  S.Struct({ ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")) }).pipe(
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
  ),
).annotations({
  identifier: "GetBootstrapBrokersRequest",
}) as any as S.Schema<GetBootstrapBrokersRequest>;
export interface GetClusterPolicyRequest {
  ClusterArn: string;
}
export const GetClusterPolicyRequest = S.suspend(() =>
  S.Struct({ ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/clusters/{ClusterArn}/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetClusterPolicyRequest",
}) as any as S.Schema<GetClusterPolicyRequest>;
export interface GetCompatibleKafkaVersionsRequest {
  ClusterArn?: string;
}
export const GetCompatibleKafkaVersionsRequest = S.suspend(() =>
  S.Struct({
    ClusterArn: S.optional(S.String).pipe(T.HttpQuery("clusterArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/compatible-kafka-versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCompatibleKafkaVersionsRequest",
}) as any as S.Schema<GetCompatibleKafkaVersionsRequest>;
export interface ListClientVpcConnectionsRequest {
  ClusterArn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListClientVpcConnectionsRequest = S.suspend(() =>
  S.Struct({
    ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListClientVpcConnectionsRequest",
}) as any as S.Schema<ListClientVpcConnectionsRequest>;
export interface ListClusterOperationsRequest {
  ClusterArn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListClusterOperationsRequest = S.suspend(() =>
  S.Struct({
    ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/clusters/{ClusterArn}/operations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListClusterOperationsRequest",
}) as any as S.Schema<ListClusterOperationsRequest>;
export interface ListClusterOperationsV2Request {
  ClusterArn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListClusterOperationsV2Request = S.suspend(() =>
  S.Struct({
    ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/api/v2/clusters/{ClusterArn}/operations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListClusterOperationsV2Request",
}) as any as S.Schema<ListClusterOperationsV2Request>;
export interface ListClustersRequest {
  ClusterNameFilter?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListClustersRequest = S.suspend(() =>
  S.Struct({
    ClusterNameFilter: S.optional(S.String).pipe(
      T.HttpQuery("clusterNameFilter"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/clusters" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListClustersRequest",
}) as any as S.Schema<ListClustersRequest>;
export interface ListClustersV2Request {
  ClusterNameFilter?: string;
  ClusterTypeFilter?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListClustersV2Request = S.suspend(() =>
  S.Struct({
    ClusterNameFilter: S.optional(S.String).pipe(
      T.HttpQuery("clusterNameFilter"),
    ),
    ClusterTypeFilter: S.optional(S.String).pipe(
      T.HttpQuery("clusterTypeFilter"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/api/v2/clusters" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListClustersV2Request",
}) as any as S.Schema<ListClustersV2Request>;
export interface ListConfigurationRevisionsRequest {
  Arn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListConfigurationRevisionsRequest = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.HttpLabel("Arn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/configurations/{Arn}/revisions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConfigurationRevisionsRequest",
}) as any as S.Schema<ListConfigurationRevisionsRequest>;
export interface ListConfigurationsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListConfigurationsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/configurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConfigurationsRequest",
}) as any as S.Schema<ListConfigurationsRequest>;
export interface ListKafkaVersionsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListKafkaVersionsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/kafka-versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListKafkaVersionsRequest",
}) as any as S.Schema<ListKafkaVersionsRequest>;
export interface ListNodesRequest {
  ClusterArn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListNodesRequest = S.suspend(() =>
  S.Struct({
    ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/clusters/{ClusterArn}/nodes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListNodesRequest",
}) as any as S.Schema<ListNodesRequest>;
export interface ListReplicatorsRequest {
  MaxResults?: number;
  NextToken?: string;
  ReplicatorNameFilter?: string;
}
export const ListReplicatorsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    ReplicatorNameFilter: S.optional(S.String).pipe(
      T.HttpQuery("replicatorNameFilter"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/replication/v1/replicators" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListReplicatorsRequest",
}) as any as S.Schema<ListReplicatorsRequest>;
export interface ListScramSecretsRequest {
  ClusterArn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListScramSecretsRequest = S.suspend(() =>
  S.Struct({
    ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/clusters/{ClusterArn}/scram-secrets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListScramSecretsRequest",
}) as any as S.Schema<ListScramSecretsRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/tags/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ListTopicsRequest {
  ClusterArn: string;
  MaxResults?: number;
  NextToken?: string;
  TopicNameFilter?: string;
}
export const ListTopicsRequest = S.suspend(() =>
  S.Struct({
    ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    TopicNameFilter: S.optional(S.String).pipe(T.HttpQuery("topicNameFilter")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/clusters/{ClusterArn}/topics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTopicsRequest",
}) as any as S.Schema<ListTopicsRequest>;
export interface ListVpcConnectionsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListVpcConnectionsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/vpc-connections" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVpcConnectionsRequest",
}) as any as S.Schema<ListVpcConnectionsRequest>;
export interface PutClusterPolicyRequest {
  ClusterArn: string;
  CurrentVersion?: string;
  Policy?: string;
}
export const PutClusterPolicyRequest = S.suspend(() =>
  S.Struct({
    ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")),
    CurrentVersion: S.optional(S.String).pipe(T.JsonName("currentVersion")),
    Policy: S.optional(S.String).pipe(T.JsonName("policy")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/clusters/{ClusterArn}/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutClusterPolicyRequest",
}) as any as S.Schema<PutClusterPolicyRequest>;
export interface RebootBrokerRequest {
  BrokerIds?: string[];
  ClusterArn: string;
}
export const RebootBrokerRequest = S.suspend(() =>
  S.Struct({
    BrokerIds: S.optional(__listOf__string).pipe(T.JsonName("brokerIds")),
    ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/clusters/{ClusterArn}/reboot-broker" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RebootBrokerRequest",
}) as any as S.Schema<RebootBrokerRequest>;
export interface RejectClientVpcConnectionRequest {
  ClusterArn: string;
  VpcConnectionArn?: string;
}
export const RejectClientVpcConnectionRequest = S.suspend(() =>
  S.Struct({
    ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")),
    VpcConnectionArn: S.optional(S.String).pipe(T.JsonName("vpcConnectionArn")),
  }).pipe(
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
  ),
).annotations({
  identifier: "RejectClientVpcConnectionRequest",
}) as any as S.Schema<RejectClientVpcConnectionRequest>;
export interface RejectClientVpcConnectionResponse {}
export const RejectClientVpcConnectionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RejectClientVpcConnectionResponse",
}) as any as S.Schema<RejectClientVpcConnectionResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags?: { [key: string]: string };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/tags/{ResourceArn}" }),
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
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys?: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: S.optional(__listOf__string).pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/tags/{ResourceArn}" }),
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
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateBrokerCountRequest {
  ClusterArn: string;
  CurrentVersion?: string;
  TargetNumberOfBrokerNodes?: number;
}
export const UpdateBrokerCountRequest = S.suspend(() =>
  S.Struct({
    ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")),
    CurrentVersion: S.optional(S.String).pipe(T.JsonName("currentVersion")),
    TargetNumberOfBrokerNodes: S.optional(S.Number).pipe(
      T.JsonName("targetNumberOfBrokerNodes"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/clusters/{ClusterArn}/nodes/count" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBrokerCountRequest",
}) as any as S.Schema<UpdateBrokerCountRequest>;
export interface UpdateBrokerTypeRequest {
  ClusterArn: string;
  CurrentVersion?: string;
  TargetInstanceType?: string;
}
export const UpdateBrokerTypeRequest = S.suspend(() =>
  S.Struct({
    ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")),
    CurrentVersion: S.optional(S.String).pipe(T.JsonName("currentVersion")),
    TargetInstanceType: S.optional(S.String).pipe(
      T.JsonName("targetInstanceType"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/clusters/{ClusterArn}/nodes/type" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBrokerTypeRequest",
}) as any as S.Schema<UpdateBrokerTypeRequest>;
export interface ConfigurationInfo {
  Arn?: string;
  Revision?: number;
}
export const ConfigurationInfo = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Revision: S.optional(S.Number).pipe(T.JsonName("revision")),
  }),
).annotations({
  identifier: "ConfigurationInfo",
}) as any as S.Schema<ConfigurationInfo>;
export interface UpdateClusterConfigurationRequest {
  ClusterArn: string;
  ConfigurationInfo?: ConfigurationInfo;
  CurrentVersion?: string;
}
export const UpdateClusterConfigurationRequest = S.suspend(() =>
  S.Struct({
    ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")),
    ConfigurationInfo: S.optional(ConfigurationInfo)
      .pipe(T.JsonName("configurationInfo"))
      .annotations({ identifier: "ConfigurationInfo" }),
    CurrentVersion: S.optional(S.String).pipe(T.JsonName("currentVersion")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/clusters/{ClusterArn}/configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateClusterConfigurationRequest",
}) as any as S.Schema<UpdateClusterConfigurationRequest>;
export interface UpdateClusterKafkaVersionRequest {
  ClusterArn: string;
  ConfigurationInfo?: ConfigurationInfo;
  CurrentVersion?: string;
  TargetKafkaVersion?: string;
}
export const UpdateClusterKafkaVersionRequest = S.suspend(() =>
  S.Struct({
    ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")),
    ConfigurationInfo: S.optional(ConfigurationInfo)
      .pipe(T.JsonName("configurationInfo"))
      .annotations({ identifier: "ConfigurationInfo" }),
    CurrentVersion: S.optional(S.String).pipe(T.JsonName("currentVersion")),
    TargetKafkaVersion: S.optional(S.String).pipe(
      T.JsonName("targetKafkaVersion"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/clusters/{ClusterArn}/version" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateClusterKafkaVersionRequest",
}) as any as S.Schema<UpdateClusterKafkaVersionRequest>;
export interface UpdateConfigurationRequest {
  Arn: string;
  Description?: string;
  ServerProperties?: Uint8Array;
}
export const UpdateConfigurationRequest = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.HttpLabel("Arn")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    ServerProperties: S.optional(T.Blob).pipe(T.JsonName("serverProperties")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/configurations/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConfigurationRequest",
}) as any as S.Schema<UpdateConfigurationRequest>;
export interface JmxExporterInfo {
  EnabledInBroker?: boolean;
}
export const JmxExporterInfo = S.suspend(() =>
  S.Struct({
    EnabledInBroker: S.optional(S.Boolean).pipe(T.JsonName("enabledInBroker")),
  }),
).annotations({
  identifier: "JmxExporterInfo",
}) as any as S.Schema<JmxExporterInfo>;
export interface NodeExporterInfo {
  EnabledInBroker?: boolean;
}
export const NodeExporterInfo = S.suspend(() =>
  S.Struct({
    EnabledInBroker: S.optional(S.Boolean).pipe(T.JsonName("enabledInBroker")),
  }),
).annotations({
  identifier: "NodeExporterInfo",
}) as any as S.Schema<NodeExporterInfo>;
export interface PrometheusInfo {
  JmxExporter?: JmxExporterInfo;
  NodeExporter?: NodeExporterInfo;
}
export const PrometheusInfo = S.suspend(() =>
  S.Struct({
    JmxExporter: S.optional(JmxExporterInfo)
      .pipe(T.JsonName("jmxExporter"))
      .annotations({ identifier: "JmxExporterInfo" }),
    NodeExporter: S.optional(NodeExporterInfo)
      .pipe(T.JsonName("nodeExporter"))
      .annotations({ identifier: "NodeExporterInfo" }),
  }),
).annotations({
  identifier: "PrometheusInfo",
}) as any as S.Schema<PrometheusInfo>;
export interface OpenMonitoringInfo {
  Prometheus?: PrometheusInfo;
}
export const OpenMonitoringInfo = S.suspend(() =>
  S.Struct({
    Prometheus: S.optional(PrometheusInfo)
      .pipe(T.JsonName("prometheus"))
      .annotations({ identifier: "PrometheusInfo" }),
  }),
).annotations({
  identifier: "OpenMonitoringInfo",
}) as any as S.Schema<OpenMonitoringInfo>;
export interface CloudWatchLogs {
  Enabled?: boolean;
  LogGroup?: string;
}
export const CloudWatchLogs = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean).pipe(T.JsonName("enabled")),
    LogGroup: S.optional(S.String).pipe(T.JsonName("logGroup")),
  }),
).annotations({
  identifier: "CloudWatchLogs",
}) as any as S.Schema<CloudWatchLogs>;
export interface Firehose {
  DeliveryStream?: string;
  Enabled?: boolean;
}
export const Firehose = S.suspend(() =>
  S.Struct({
    DeliveryStream: S.optional(S.String).pipe(T.JsonName("deliveryStream")),
    Enabled: S.optional(S.Boolean).pipe(T.JsonName("enabled")),
  }),
).annotations({ identifier: "Firehose" }) as any as S.Schema<Firehose>;
export interface S3 {
  Bucket?: string;
  Enabled?: boolean;
  Prefix?: string;
}
export const S3 = S.suspend(() =>
  S.Struct({
    Bucket: S.optional(S.String).pipe(T.JsonName("bucket")),
    Enabled: S.optional(S.Boolean).pipe(T.JsonName("enabled")),
    Prefix: S.optional(S.String).pipe(T.JsonName("prefix")),
  }),
).annotations({ identifier: "S3" }) as any as S.Schema<S3>;
export interface BrokerLogs {
  CloudWatchLogs?: CloudWatchLogs;
  Firehose?: Firehose;
  S3?: S3;
}
export const BrokerLogs = S.suspend(() =>
  S.Struct({
    CloudWatchLogs: S.optional(CloudWatchLogs)
      .pipe(T.JsonName("cloudWatchLogs"))
      .annotations({ identifier: "CloudWatchLogs" }),
    Firehose: S.optional(Firehose)
      .pipe(T.JsonName("firehose"))
      .annotations({ identifier: "Firehose" }),
    S3: S.optional(S3).pipe(T.JsonName("s3")).annotations({ identifier: "S3" }),
  }),
).annotations({ identifier: "BrokerLogs" }) as any as S.Schema<BrokerLogs>;
export interface LoggingInfo {
  BrokerLogs?: BrokerLogs;
}
export const LoggingInfo = S.suspend(() =>
  S.Struct({
    BrokerLogs: S.optional(BrokerLogs)
      .pipe(T.JsonName("brokerLogs"))
      .annotations({ identifier: "BrokerLogs" }),
  }),
).annotations({ identifier: "LoggingInfo" }) as any as S.Schema<LoggingInfo>;
export interface UpdateMonitoringRequest {
  ClusterArn: string;
  CurrentVersion?: string;
  EnhancedMonitoring?: EnhancedMonitoring;
  OpenMonitoring?: OpenMonitoringInfo;
  LoggingInfo?: LoggingInfo;
}
export const UpdateMonitoringRequest = S.suspend(() =>
  S.Struct({
    ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")),
    CurrentVersion: S.optional(S.String).pipe(T.JsonName("currentVersion")),
    EnhancedMonitoring: S.optional(EnhancedMonitoring).pipe(
      T.JsonName("enhancedMonitoring"),
    ),
    OpenMonitoring: S.optional(OpenMonitoringInfo)
      .pipe(T.JsonName("openMonitoring"))
      .annotations({ identifier: "OpenMonitoringInfo" }),
    LoggingInfo: S.optional(LoggingInfo)
      .pipe(T.JsonName("loggingInfo"))
      .annotations({ identifier: "LoggingInfo" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/clusters/{ClusterArn}/monitoring" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMonitoringRequest",
}) as any as S.Schema<UpdateMonitoringRequest>;
export type RebalancingStatus = "PAUSED" | "ACTIVE";
export const RebalancingStatus = S.Literal("PAUSED", "ACTIVE");
export interface Rebalancing {
  Status?: RebalancingStatus;
}
export const Rebalancing = S.suspend(() =>
  S.Struct({
    Status: S.optional(RebalancingStatus).pipe(T.JsonName("status")),
  }),
).annotations({ identifier: "Rebalancing" }) as any as S.Schema<Rebalancing>;
export interface UpdateRebalancingRequest {
  ClusterArn: string;
  CurrentVersion?: string;
  Rebalancing?: Rebalancing;
}
export const UpdateRebalancingRequest = S.suspend(() =>
  S.Struct({
    ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")),
    CurrentVersion: S.optional(S.String).pipe(T.JsonName("currentVersion")),
    Rebalancing: S.optional(Rebalancing)
      .pipe(T.JsonName("rebalancing"))
      .annotations({ identifier: "Rebalancing" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/clusters/{ClusterArn}/rebalancing" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRebalancingRequest",
}) as any as S.Schema<UpdateRebalancingRequest>;
export interface Scram {
  Enabled?: boolean;
}
export const Scram = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean).pipe(T.JsonName("enabled")) }),
).annotations({ identifier: "Scram" }) as any as S.Schema<Scram>;
export interface Iam {
  Enabled?: boolean;
}
export const Iam = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean).pipe(T.JsonName("enabled")) }),
).annotations({ identifier: "Iam" }) as any as S.Schema<Iam>;
export interface Sasl {
  Scram?: Scram;
  Iam?: Iam;
}
export const Sasl = S.suspend(() =>
  S.Struct({
    Scram: S.optional(Scram)
      .pipe(T.JsonName("scram"))
      .annotations({ identifier: "Scram" }),
    Iam: S.optional(Iam)
      .pipe(T.JsonName("iam"))
      .annotations({ identifier: "Iam" }),
  }),
).annotations({ identifier: "Sasl" }) as any as S.Schema<Sasl>;
export interface Tls {
  CertificateAuthorityArnList?: string[];
  Enabled?: boolean;
}
export const Tls = S.suspend(() =>
  S.Struct({
    CertificateAuthorityArnList: S.optional(__listOf__string).pipe(
      T.JsonName("certificateAuthorityArnList"),
    ),
    Enabled: S.optional(S.Boolean).pipe(T.JsonName("enabled")),
  }),
).annotations({ identifier: "Tls" }) as any as S.Schema<Tls>;
export interface Unauthenticated {
  Enabled?: boolean;
}
export const Unauthenticated = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean).pipe(T.JsonName("enabled")) }),
).annotations({
  identifier: "Unauthenticated",
}) as any as S.Schema<Unauthenticated>;
export interface ClientAuthentication {
  Sasl?: Sasl;
  Tls?: Tls;
  Unauthenticated?: Unauthenticated;
}
export const ClientAuthentication = S.suspend(() =>
  S.Struct({
    Sasl: S.optional(Sasl)
      .pipe(T.JsonName("sasl"))
      .annotations({ identifier: "Sasl" }),
    Tls: S.optional(Tls)
      .pipe(T.JsonName("tls"))
      .annotations({ identifier: "Tls" }),
    Unauthenticated: S.optional(Unauthenticated)
      .pipe(T.JsonName("unauthenticated"))
      .annotations({ identifier: "Unauthenticated" }),
  }),
).annotations({
  identifier: "ClientAuthentication",
}) as any as S.Schema<ClientAuthentication>;
export interface EncryptionAtRest {
  DataVolumeKMSKeyId?: string;
}
export const EncryptionAtRest = S.suspend(() =>
  S.Struct({
    DataVolumeKMSKeyId: S.optional(S.String).pipe(
      T.JsonName("dataVolumeKMSKeyId"),
    ),
  }),
).annotations({
  identifier: "EncryptionAtRest",
}) as any as S.Schema<EncryptionAtRest>;
export type ClientBroker = "TLS" | "TLS_PLAINTEXT" | "PLAINTEXT";
export const ClientBroker = S.Literal("TLS", "TLS_PLAINTEXT", "PLAINTEXT");
export interface EncryptionInTransit {
  ClientBroker?: ClientBroker;
  InCluster?: boolean;
}
export const EncryptionInTransit = S.suspend(() =>
  S.Struct({
    ClientBroker: S.optional(ClientBroker).pipe(T.JsonName("clientBroker")),
    InCluster: S.optional(S.Boolean).pipe(T.JsonName("inCluster")),
  }),
).annotations({
  identifier: "EncryptionInTransit",
}) as any as S.Schema<EncryptionInTransit>;
export interface EncryptionInfo {
  EncryptionAtRest?: EncryptionAtRest;
  EncryptionInTransit?: EncryptionInTransit;
}
export const EncryptionInfo = S.suspend(() =>
  S.Struct({
    EncryptionAtRest: S.optional(EncryptionAtRest)
      .pipe(T.JsonName("encryptionAtRest"))
      .annotations({ identifier: "EncryptionAtRest" }),
    EncryptionInTransit: S.optional(EncryptionInTransit)
      .pipe(T.JsonName("encryptionInTransit"))
      .annotations({ identifier: "EncryptionInTransit" }),
  }),
).annotations({
  identifier: "EncryptionInfo",
}) as any as S.Schema<EncryptionInfo>;
export interface UpdateSecurityRequest {
  ClientAuthentication?: ClientAuthentication;
  ClusterArn: string;
  CurrentVersion?: string;
  EncryptionInfo?: EncryptionInfo;
}
export const UpdateSecurityRequest = S.suspend(() =>
  S.Struct({
    ClientAuthentication: S.optional(ClientAuthentication)
      .pipe(T.JsonName("clientAuthentication"))
      .annotations({ identifier: "ClientAuthentication" }),
    ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")),
    CurrentVersion: S.optional(S.String).pipe(T.JsonName("currentVersion")),
    EncryptionInfo: S.optional(EncryptionInfo)
      .pipe(T.JsonName("encryptionInfo"))
      .annotations({ identifier: "EncryptionInfo" }),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/v1/clusters/{ClusterArn}/security" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSecurityRequest",
}) as any as S.Schema<UpdateSecurityRequest>;
export type BrokerAZDistribution = "DEFAULT";
export const BrokerAZDistribution = S.Literal("DEFAULT");
export type TargetCompressionType = "NONE" | "GZIP" | "SNAPPY" | "LZ4" | "ZSTD";
export const TargetCompressionType = S.Literal(
  "NONE",
  "GZIP",
  "SNAPPY",
  "LZ4",
  "ZSTD",
);
export type __listOf__stringMax256 = string[];
export const __listOf__stringMax256 = S.Array(S.String);
export type __listOf__stringMax249 = string[];
export const __listOf__stringMax249 = S.Array(S.String);
export interface ProvisionedThroughput {
  Enabled?: boolean;
  VolumeThroughput?: number;
}
export const ProvisionedThroughput = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean).pipe(T.JsonName("enabled")),
    VolumeThroughput: S.optional(S.Number).pipe(T.JsonName("volumeThroughput")),
  }),
).annotations({
  identifier: "ProvisionedThroughput",
}) as any as S.Schema<ProvisionedThroughput>;
export interface EBSStorageInfo {
  ProvisionedThroughput?: ProvisionedThroughput;
  VolumeSize?: number;
}
export const EBSStorageInfo = S.suspend(() =>
  S.Struct({
    ProvisionedThroughput: S.optional(ProvisionedThroughput)
      .pipe(T.JsonName("provisionedThroughput"))
      .annotations({ identifier: "ProvisionedThroughput" }),
    VolumeSize: S.optional(S.Number).pipe(T.JsonName("volumeSize")),
  }),
).annotations({
  identifier: "EBSStorageInfo",
}) as any as S.Schema<EBSStorageInfo>;
export interface StorageInfo {
  EbsStorageInfo?: EBSStorageInfo;
}
export const StorageInfo = S.suspend(() =>
  S.Struct({
    EbsStorageInfo: S.optional(EBSStorageInfo)
      .pipe(T.JsonName("ebsStorageInfo"))
      .annotations({ identifier: "EBSStorageInfo" }),
  }),
).annotations({ identifier: "StorageInfo" }) as any as S.Schema<StorageInfo>;
export interface PublicAccess {
  Type?: string;
}
export const PublicAccess = S.suspend(() =>
  S.Struct({ Type: S.optional(S.String).pipe(T.JsonName("type")) }),
).annotations({ identifier: "PublicAccess" }) as any as S.Schema<PublicAccess>;
export interface VpcConnectivityScram {
  Enabled?: boolean;
}
export const VpcConnectivityScram = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean).pipe(T.JsonName("enabled")) }),
).annotations({
  identifier: "VpcConnectivityScram",
}) as any as S.Schema<VpcConnectivityScram>;
export interface VpcConnectivityIam {
  Enabled?: boolean;
}
export const VpcConnectivityIam = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean).pipe(T.JsonName("enabled")) }),
).annotations({
  identifier: "VpcConnectivityIam",
}) as any as S.Schema<VpcConnectivityIam>;
export interface VpcConnectivitySasl {
  Scram?: VpcConnectivityScram;
  Iam?: VpcConnectivityIam;
}
export const VpcConnectivitySasl = S.suspend(() =>
  S.Struct({
    Scram: S.optional(VpcConnectivityScram)
      .pipe(T.JsonName("scram"))
      .annotations({ identifier: "VpcConnectivityScram" }),
    Iam: S.optional(VpcConnectivityIam)
      .pipe(T.JsonName("iam"))
      .annotations({ identifier: "VpcConnectivityIam" }),
  }),
).annotations({
  identifier: "VpcConnectivitySasl",
}) as any as S.Schema<VpcConnectivitySasl>;
export interface VpcConnectivityTls {
  Enabled?: boolean;
}
export const VpcConnectivityTls = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean).pipe(T.JsonName("enabled")) }),
).annotations({
  identifier: "VpcConnectivityTls",
}) as any as S.Schema<VpcConnectivityTls>;
export interface VpcConnectivityClientAuthentication {
  Sasl?: VpcConnectivitySasl;
  Tls?: VpcConnectivityTls;
}
export const VpcConnectivityClientAuthentication = S.suspend(() =>
  S.Struct({
    Sasl: S.optional(VpcConnectivitySasl)
      .pipe(T.JsonName("sasl"))
      .annotations({ identifier: "VpcConnectivitySasl" }),
    Tls: S.optional(VpcConnectivityTls)
      .pipe(T.JsonName("tls"))
      .annotations({ identifier: "VpcConnectivityTls" }),
  }),
).annotations({
  identifier: "VpcConnectivityClientAuthentication",
}) as any as S.Schema<VpcConnectivityClientAuthentication>;
export interface VpcConnectivity {
  ClientAuthentication?: VpcConnectivityClientAuthentication;
}
export const VpcConnectivity = S.suspend(() =>
  S.Struct({
    ClientAuthentication: S.optional(VpcConnectivityClientAuthentication)
      .pipe(T.JsonName("clientAuthentication"))
      .annotations({ identifier: "VpcConnectivityClientAuthentication" }),
  }),
).annotations({
  identifier: "VpcConnectivity",
}) as any as S.Schema<VpcConnectivity>;
export interface ConnectivityInfo {
  PublicAccess?: PublicAccess;
  VpcConnectivity?: VpcConnectivity;
}
export const ConnectivityInfo = S.suspend(() =>
  S.Struct({
    PublicAccess: S.optional(PublicAccess)
      .pipe(T.JsonName("publicAccess"))
      .annotations({ identifier: "PublicAccess" }),
    VpcConnectivity: S.optional(VpcConnectivity)
      .pipe(T.JsonName("vpcConnectivity"))
      .annotations({ identifier: "VpcConnectivity" }),
  }),
).annotations({
  identifier: "ConnectivityInfo",
}) as any as S.Schema<ConnectivityInfo>;
export interface BrokerNodeGroupInfo {
  BrokerAZDistribution?: BrokerAZDistribution;
  ClientSubnets?: string[];
  InstanceType?: string;
  SecurityGroups?: string[];
  StorageInfo?: StorageInfo;
  ConnectivityInfo?: ConnectivityInfo;
  ZoneIds?: string[];
}
export const BrokerNodeGroupInfo = S.suspend(() =>
  S.Struct({
    BrokerAZDistribution: S.optional(BrokerAZDistribution).pipe(
      T.JsonName("brokerAZDistribution"),
    ),
    ClientSubnets: S.optional(__listOf__string).pipe(
      T.JsonName("clientSubnets"),
    ),
    InstanceType: S.optional(S.String).pipe(T.JsonName("instanceType")),
    SecurityGroups: S.optional(__listOf__string).pipe(
      T.JsonName("securityGroups"),
    ),
    StorageInfo: S.optional(StorageInfo)
      .pipe(T.JsonName("storageInfo"))
      .annotations({ identifier: "StorageInfo" }),
    ConnectivityInfo: S.optional(ConnectivityInfo)
      .pipe(T.JsonName("connectivityInfo"))
      .annotations({ identifier: "ConnectivityInfo" }),
    ZoneIds: S.optional(__listOf__string).pipe(T.JsonName("zoneIds")),
  }),
).annotations({
  identifier: "BrokerNodeGroupInfo",
}) as any as S.Schema<BrokerNodeGroupInfo>;
export interface ProvisionedRequest {
  BrokerNodeGroupInfo?: BrokerNodeGroupInfo;
  Rebalancing?: Rebalancing;
  ClientAuthentication?: ClientAuthentication;
  ConfigurationInfo?: ConfigurationInfo;
  EncryptionInfo?: EncryptionInfo;
  EnhancedMonitoring?: EnhancedMonitoring;
  OpenMonitoring?: OpenMonitoringInfo;
  KafkaVersion?: string;
  LoggingInfo?: LoggingInfo;
  NumberOfBrokerNodes?: number;
  StorageMode?: StorageMode;
}
export const ProvisionedRequest = S.suspend(() =>
  S.Struct({
    BrokerNodeGroupInfo: S.optional(BrokerNodeGroupInfo)
      .pipe(T.JsonName("brokerNodeGroupInfo"))
      .annotations({ identifier: "BrokerNodeGroupInfo" }),
    Rebalancing: S.optional(Rebalancing)
      .pipe(T.JsonName("rebalancing"))
      .annotations({ identifier: "Rebalancing" }),
    ClientAuthentication: S.optional(ClientAuthentication)
      .pipe(T.JsonName("clientAuthentication"))
      .annotations({ identifier: "ClientAuthentication" }),
    ConfigurationInfo: S.optional(ConfigurationInfo)
      .pipe(T.JsonName("configurationInfo"))
      .annotations({ identifier: "ConfigurationInfo" }),
    EncryptionInfo: S.optional(EncryptionInfo)
      .pipe(T.JsonName("encryptionInfo"))
      .annotations({ identifier: "EncryptionInfo" }),
    EnhancedMonitoring: S.optional(EnhancedMonitoring).pipe(
      T.JsonName("enhancedMonitoring"),
    ),
    OpenMonitoring: S.optional(OpenMonitoringInfo)
      .pipe(T.JsonName("openMonitoring"))
      .annotations({ identifier: "OpenMonitoringInfo" }),
    KafkaVersion: S.optional(S.String).pipe(T.JsonName("kafkaVersion")),
    LoggingInfo: S.optional(LoggingInfo)
      .pipe(T.JsonName("loggingInfo"))
      .annotations({ identifier: "LoggingInfo" }),
    NumberOfBrokerNodes: S.optional(S.Number).pipe(
      T.JsonName("numberOfBrokerNodes"),
    ),
    StorageMode: S.optional(StorageMode).pipe(T.JsonName("storageMode")),
  }),
).annotations({
  identifier: "ProvisionedRequest",
}) as any as S.Schema<ProvisionedRequest>;
export type ConfigurationState = "ACTIVE" | "DELETING" | "DELETE_FAILED";
export const ConfigurationState = S.Literal(
  "ACTIVE",
  "DELETING",
  "DELETE_FAILED",
);
export type VpcConnectionState =
  | "CREATING"
  | "AVAILABLE"
  | "INACTIVE"
  | "DEACTIVATING"
  | "DELETING"
  | "FAILED"
  | "REJECTED"
  | "REJECTING";
export const VpcConnectionState = S.Literal(
  "CREATING",
  "AVAILABLE",
  "INACTIVE",
  "DEACTIVATING",
  "DELETING",
  "FAILED",
  "REJECTED",
  "REJECTING",
);
export type ClusterState =
  | "ACTIVE"
  | "CREATING"
  | "DELETING"
  | "FAILED"
  | "HEALING"
  | "MAINTENANCE"
  | "REBOOTING_BROKER"
  | "UPDATING";
export const ClusterState = S.Literal(
  "ACTIVE",
  "CREATING",
  "DELETING",
  "FAILED",
  "HEALING",
  "MAINTENANCE",
  "REBOOTING_BROKER",
  "UPDATING",
);
export type ReplicatorState =
  | "RUNNING"
  | "CREATING"
  | "UPDATING"
  | "DELETING"
  | "FAILED";
export const ReplicatorState = S.Literal(
  "RUNNING",
  "CREATING",
  "UPDATING",
  "DELETING",
  "FAILED",
);
export type TopicState = "CREATING" | "UPDATING" | "DELETING" | "ACTIVE";
export const TopicState = S.Literal(
  "CREATING",
  "UPDATING",
  "DELETING",
  "ACTIVE",
);
export interface ErrorInfo {
  ErrorCode?: string;
  ErrorString?: string;
}
export const ErrorInfo = S.suspend(() =>
  S.Struct({
    ErrorCode: S.optional(S.String).pipe(T.JsonName("errorCode")),
    ErrorString: S.optional(S.String).pipe(T.JsonName("errorString")),
  }),
).annotations({ identifier: "ErrorInfo" }) as any as S.Schema<ErrorInfo>;
export interface ClusterOperationStepInfo {
  StepStatus?: string;
}
export const ClusterOperationStepInfo = S.suspend(() =>
  S.Struct({ StepStatus: S.optional(S.String).pipe(T.JsonName("stepStatus")) }),
).annotations({
  identifier: "ClusterOperationStepInfo",
}) as any as S.Schema<ClusterOperationStepInfo>;
export interface ClusterOperationStep {
  StepInfo?: ClusterOperationStepInfo;
  StepName?: string;
}
export const ClusterOperationStep = S.suspend(() =>
  S.Struct({
    StepInfo: S.optional(ClusterOperationStepInfo)
      .pipe(T.JsonName("stepInfo"))
      .annotations({ identifier: "ClusterOperationStepInfo" }),
    StepName: S.optional(S.String).pipe(T.JsonName("stepName")),
  }),
).annotations({
  identifier: "ClusterOperationStep",
}) as any as S.Schema<ClusterOperationStep>;
export type __listOfClusterOperationStep = ClusterOperationStep[];
export const __listOfClusterOperationStep = S.Array(ClusterOperationStep);
export interface BrokerEBSVolumeInfo {
  KafkaBrokerNodeId?: string;
  ProvisionedThroughput?: ProvisionedThroughput;
  VolumeSizeGB?: number;
}
export const BrokerEBSVolumeInfo = S.suspend(() =>
  S.Struct({
    KafkaBrokerNodeId: S.optional(S.String).pipe(
      T.JsonName("kafkaBrokerNodeId"),
    ),
    ProvisionedThroughput: S.optional(ProvisionedThroughput)
      .pipe(T.JsonName("provisionedThroughput"))
      .annotations({ identifier: "ProvisionedThroughput" }),
    VolumeSizeGB: S.optional(S.Number).pipe(T.JsonName("volumeSizeGB")),
  }),
).annotations({
  identifier: "BrokerEBSVolumeInfo",
}) as any as S.Schema<BrokerEBSVolumeInfo>;
export type __listOfBrokerEBSVolumeInfo = BrokerEBSVolumeInfo[];
export const __listOfBrokerEBSVolumeInfo = S.Array(BrokerEBSVolumeInfo);
export interface JmxExporter {
  EnabledInBroker?: boolean;
}
export const JmxExporter = S.suspend(() =>
  S.Struct({
    EnabledInBroker: S.optional(S.Boolean).pipe(T.JsonName("enabledInBroker")),
  }),
).annotations({ identifier: "JmxExporter" }) as any as S.Schema<JmxExporter>;
export interface NodeExporter {
  EnabledInBroker?: boolean;
}
export const NodeExporter = S.suspend(() =>
  S.Struct({
    EnabledInBroker: S.optional(S.Boolean).pipe(T.JsonName("enabledInBroker")),
  }),
).annotations({ identifier: "NodeExporter" }) as any as S.Schema<NodeExporter>;
export interface Prometheus {
  JmxExporter?: JmxExporter;
  NodeExporter?: NodeExporter;
}
export const Prometheus = S.suspend(() =>
  S.Struct({
    JmxExporter: S.optional(JmxExporter)
      .pipe(T.JsonName("jmxExporter"))
      .annotations({ identifier: "JmxExporter" }),
    NodeExporter: S.optional(NodeExporter)
      .pipe(T.JsonName("nodeExporter"))
      .annotations({ identifier: "NodeExporter" }),
  }),
).annotations({ identifier: "Prometheus" }) as any as S.Schema<Prometheus>;
export interface OpenMonitoring {
  Prometheus?: Prometheus;
}
export const OpenMonitoring = S.suspend(() =>
  S.Struct({
    Prometheus: S.optional(Prometheus)
      .pipe(T.JsonName("prometheus"))
      .annotations({ identifier: "Prometheus" }),
  }),
).annotations({
  identifier: "OpenMonitoring",
}) as any as S.Schema<OpenMonitoring>;
export type __listOf__double = number[];
export const __listOf__double = S.Array(S.Number);
export interface BrokerCountUpdateInfo {
  CreatedBrokerIds?: number[];
  DeletedBrokerIds?: number[];
}
export const BrokerCountUpdateInfo = S.suspend(() =>
  S.Struct({
    CreatedBrokerIds: S.optional(__listOf__double).pipe(
      T.JsonName("createdBrokerIds"),
    ),
    DeletedBrokerIds: S.optional(__listOf__double).pipe(
      T.JsonName("deletedBrokerIds"),
    ),
  }),
).annotations({
  identifier: "BrokerCountUpdateInfo",
}) as any as S.Schema<BrokerCountUpdateInfo>;
export interface MutableClusterInfo {
  BrokerEBSVolumeInfo?: BrokerEBSVolumeInfo[];
  ConfigurationInfo?: ConfigurationInfo;
  NumberOfBrokerNodes?: number;
  EnhancedMonitoring?: EnhancedMonitoring;
  OpenMonitoring?: OpenMonitoring;
  KafkaVersion?: string;
  LoggingInfo?: LoggingInfo;
  InstanceType?: string;
  ClientAuthentication?: ClientAuthentication;
  EncryptionInfo?: EncryptionInfo;
  ConnectivityInfo?: ConnectivityInfo;
  StorageMode?: StorageMode;
  BrokerCountUpdateInfo?: BrokerCountUpdateInfo;
  Rebalancing?: Rebalancing;
}
export const MutableClusterInfo = S.suspend(() =>
  S.Struct({
    BrokerEBSVolumeInfo: S.optional(__listOfBrokerEBSVolumeInfo).pipe(
      T.JsonName("brokerEBSVolumeInfo"),
    ),
    ConfigurationInfo: S.optional(ConfigurationInfo)
      .pipe(T.JsonName("configurationInfo"))
      .annotations({ identifier: "ConfigurationInfo" }),
    NumberOfBrokerNodes: S.optional(S.Number).pipe(
      T.JsonName("numberOfBrokerNodes"),
    ),
    EnhancedMonitoring: S.optional(EnhancedMonitoring).pipe(
      T.JsonName("enhancedMonitoring"),
    ),
    OpenMonitoring: S.optional(OpenMonitoring)
      .pipe(T.JsonName("openMonitoring"))
      .annotations({ identifier: "OpenMonitoring" }),
    KafkaVersion: S.optional(S.String).pipe(T.JsonName("kafkaVersion")),
    LoggingInfo: S.optional(LoggingInfo)
      .pipe(T.JsonName("loggingInfo"))
      .annotations({ identifier: "LoggingInfo" }),
    InstanceType: S.optional(S.String).pipe(T.JsonName("instanceType")),
    ClientAuthentication: S.optional(ClientAuthentication)
      .pipe(T.JsonName("clientAuthentication"))
      .annotations({ identifier: "ClientAuthentication" }),
    EncryptionInfo: S.optional(EncryptionInfo)
      .pipe(T.JsonName("encryptionInfo"))
      .annotations({ identifier: "EncryptionInfo" }),
    ConnectivityInfo: S.optional(ConnectivityInfo)
      .pipe(T.JsonName("connectivityInfo"))
      .annotations({ identifier: "ConnectivityInfo" }),
    StorageMode: S.optional(StorageMode).pipe(T.JsonName("storageMode")),
    BrokerCountUpdateInfo: S.optional(BrokerCountUpdateInfo)
      .pipe(T.JsonName("brokerCountUpdateInfo"))
      .annotations({ identifier: "BrokerCountUpdateInfo" }),
    Rebalancing: S.optional(Rebalancing)
      .pipe(T.JsonName("rebalancing"))
      .annotations({ identifier: "Rebalancing" }),
  }),
).annotations({
  identifier: "MutableClusterInfo",
}) as any as S.Schema<MutableClusterInfo>;
export type UserIdentityType = "AWSACCOUNT" | "AWSSERVICE";
export const UserIdentityType = S.Literal("AWSACCOUNT", "AWSSERVICE");
export interface UserIdentity {
  Type?: UserIdentityType;
  PrincipalId?: string;
}
export const UserIdentity = S.suspend(() =>
  S.Struct({
    Type: S.optional(UserIdentityType).pipe(T.JsonName("type")),
    PrincipalId: S.optional(S.String).pipe(T.JsonName("principalId")),
  }),
).annotations({ identifier: "UserIdentity" }) as any as S.Schema<UserIdentity>;
export interface VpcConnectionInfo {
  VpcConnectionArn?: string;
  Owner?: string;
  UserIdentity?: UserIdentity;
  CreationTime?: Date;
}
export const VpcConnectionInfo = S.suspend(() =>
  S.Struct({
    VpcConnectionArn: S.optional(S.String).pipe(T.JsonName("vpcConnectionArn")),
    Owner: S.optional(S.String).pipe(T.JsonName("owner")),
    UserIdentity: S.optional(UserIdentity)
      .pipe(T.JsonName("userIdentity"))
      .annotations({ identifier: "UserIdentity" }),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("creationTime"),
    ),
  }),
).annotations({
  identifier: "VpcConnectionInfo",
}) as any as S.Schema<VpcConnectionInfo>;
export interface ClusterOperationInfo {
  ClientRequestId?: string;
  ClusterArn?: string;
  CreationTime?: Date;
  EndTime?: Date;
  ErrorInfo?: ErrorInfo;
  OperationArn?: string;
  OperationState?: string;
  OperationSteps?: ClusterOperationStep[];
  OperationType?: string;
  SourceClusterInfo?: MutableClusterInfo;
  TargetClusterInfo?: MutableClusterInfo;
  VpcConnectionInfo?: VpcConnectionInfo;
}
export const ClusterOperationInfo = S.suspend(() =>
  S.Struct({
    ClientRequestId: S.optional(S.String).pipe(T.JsonName("clientRequestId")),
    ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("creationTime"),
    ),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("endTime"),
    ),
    ErrorInfo: S.optional(ErrorInfo)
      .pipe(T.JsonName("errorInfo"))
      .annotations({ identifier: "ErrorInfo" }),
    OperationArn: S.optional(S.String).pipe(T.JsonName("operationArn")),
    OperationState: S.optional(S.String).pipe(T.JsonName("operationState")),
    OperationSteps: S.optional(__listOfClusterOperationStep).pipe(
      T.JsonName("operationSteps"),
    ),
    OperationType: S.optional(S.String).pipe(T.JsonName("operationType")),
    SourceClusterInfo: S.optional(MutableClusterInfo)
      .pipe(T.JsonName("sourceClusterInfo"))
      .annotations({ identifier: "MutableClusterInfo" }),
    TargetClusterInfo: S.optional(MutableClusterInfo)
      .pipe(T.JsonName("targetClusterInfo"))
      .annotations({ identifier: "MutableClusterInfo" }),
    VpcConnectionInfo: S.optional(VpcConnectionInfo)
      .pipe(T.JsonName("vpcConnectionInfo"))
      .annotations({ identifier: "VpcConnectionInfo" }),
  }),
).annotations({
  identifier: "ClusterOperationInfo",
}) as any as S.Schema<ClusterOperationInfo>;
export type __listOfClusterOperationInfo = ClusterOperationInfo[];
export const __listOfClusterOperationInfo = S.Array(ClusterOperationInfo);
export interface BrokerSoftwareInfo {
  ConfigurationArn?: string;
  ConfigurationRevision?: number;
  KafkaVersion?: string;
}
export const BrokerSoftwareInfo = S.suspend(() =>
  S.Struct({
    ConfigurationArn: S.optional(S.String).pipe(T.JsonName("configurationArn")),
    ConfigurationRevision: S.optional(S.Number).pipe(
      T.JsonName("configurationRevision"),
    ),
    KafkaVersion: S.optional(S.String).pipe(T.JsonName("kafkaVersion")),
  }),
).annotations({
  identifier: "BrokerSoftwareInfo",
}) as any as S.Schema<BrokerSoftwareInfo>;
export interface StateInfo {
  Code?: string;
  Message?: string;
}
export const StateInfo = S.suspend(() =>
  S.Struct({
    Code: S.optional(S.String).pipe(T.JsonName("code")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  }),
).annotations({ identifier: "StateInfo" }) as any as S.Schema<StateInfo>;
export type CustomerActionStatus =
  | "CRITICAL_ACTION_REQUIRED"
  | "ACTION_RECOMMENDED"
  | "NONE";
export const CustomerActionStatus = S.Literal(
  "CRITICAL_ACTION_REQUIRED",
  "ACTION_RECOMMENDED",
  "NONE",
);
export interface ClusterInfo {
  ActiveOperationArn?: string;
  BrokerNodeGroupInfo?: BrokerNodeGroupInfo;
  Rebalancing?: Rebalancing;
  ClientAuthentication?: ClientAuthentication;
  ClusterArn?: string;
  ClusterName?: string;
  CreationTime?: Date;
  CurrentBrokerSoftwareInfo?: BrokerSoftwareInfo;
  CurrentVersion?: string;
  EncryptionInfo?: EncryptionInfo;
  EnhancedMonitoring?: EnhancedMonitoring;
  OpenMonitoring?: OpenMonitoring;
  LoggingInfo?: LoggingInfo;
  NumberOfBrokerNodes?: number;
  State?: ClusterState;
  StateInfo?: StateInfo;
  Tags?: { [key: string]: string };
  ZookeeperConnectString?: string;
  ZookeeperConnectStringTls?: string;
  StorageMode?: StorageMode;
  CustomerActionStatus?: CustomerActionStatus;
}
export const ClusterInfo = S.suspend(() =>
  S.Struct({
    ActiveOperationArn: S.optional(S.String).pipe(
      T.JsonName("activeOperationArn"),
    ),
    BrokerNodeGroupInfo: S.optional(BrokerNodeGroupInfo)
      .pipe(T.JsonName("brokerNodeGroupInfo"))
      .annotations({ identifier: "BrokerNodeGroupInfo" }),
    Rebalancing: S.optional(Rebalancing)
      .pipe(T.JsonName("rebalancing"))
      .annotations({ identifier: "Rebalancing" }),
    ClientAuthentication: S.optional(ClientAuthentication)
      .pipe(T.JsonName("clientAuthentication"))
      .annotations({ identifier: "ClientAuthentication" }),
    ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
    ClusterName: S.optional(S.String).pipe(T.JsonName("clusterName")),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("creationTime"),
    ),
    CurrentBrokerSoftwareInfo: S.optional(BrokerSoftwareInfo)
      .pipe(T.JsonName("currentBrokerSoftwareInfo"))
      .annotations({ identifier: "BrokerSoftwareInfo" }),
    CurrentVersion: S.optional(S.String).pipe(T.JsonName("currentVersion")),
    EncryptionInfo: S.optional(EncryptionInfo)
      .pipe(T.JsonName("encryptionInfo"))
      .annotations({ identifier: "EncryptionInfo" }),
    EnhancedMonitoring: S.optional(EnhancedMonitoring).pipe(
      T.JsonName("enhancedMonitoring"),
    ),
    OpenMonitoring: S.optional(OpenMonitoring)
      .pipe(T.JsonName("openMonitoring"))
      .annotations({ identifier: "OpenMonitoring" }),
    LoggingInfo: S.optional(LoggingInfo)
      .pipe(T.JsonName("loggingInfo"))
      .annotations({ identifier: "LoggingInfo" }),
    NumberOfBrokerNodes: S.optional(S.Number).pipe(
      T.JsonName("numberOfBrokerNodes"),
    ),
    State: S.optional(ClusterState).pipe(T.JsonName("state")),
    StateInfo: S.optional(StateInfo)
      .pipe(T.JsonName("stateInfo"))
      .annotations({ identifier: "StateInfo" }),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    ZookeeperConnectString: S.optional(S.String).pipe(
      T.JsonName("zookeeperConnectString"),
    ),
    ZookeeperConnectStringTls: S.optional(S.String).pipe(
      T.JsonName("zookeeperConnectStringTls"),
    ),
    StorageMode: S.optional(StorageMode).pipe(T.JsonName("storageMode")),
    CustomerActionStatus: S.optional(CustomerActionStatus).pipe(
      T.JsonName("customerActionStatus"),
    ),
  }),
).annotations({ identifier: "ClusterInfo" }) as any as S.Schema<ClusterInfo>;
export type __listOfClusterInfo = ClusterInfo[];
export const __listOfClusterInfo = S.Array(ClusterInfo);
export type ClusterType = "PROVISIONED" | "SERVERLESS";
export const ClusterType = S.Literal("PROVISIONED", "SERVERLESS");
export interface Provisioned {
  BrokerNodeGroupInfo?: BrokerNodeGroupInfo;
  Rebalancing?: Rebalancing;
  CurrentBrokerSoftwareInfo?: BrokerSoftwareInfo;
  ClientAuthentication?: ClientAuthentication;
  EncryptionInfo?: EncryptionInfo;
  EnhancedMonitoring?: EnhancedMonitoring;
  OpenMonitoring?: OpenMonitoringInfo;
  LoggingInfo?: LoggingInfo;
  NumberOfBrokerNodes?: number;
  ZookeeperConnectString?: string;
  ZookeeperConnectStringTls?: string;
  StorageMode?: StorageMode;
  CustomerActionStatus?: CustomerActionStatus;
}
export const Provisioned = S.suspend(() =>
  S.Struct({
    BrokerNodeGroupInfo: S.optional(BrokerNodeGroupInfo)
      .pipe(T.JsonName("brokerNodeGroupInfo"))
      .annotations({ identifier: "BrokerNodeGroupInfo" }),
    Rebalancing: S.optional(Rebalancing)
      .pipe(T.JsonName("rebalancing"))
      .annotations({ identifier: "Rebalancing" }),
    CurrentBrokerSoftwareInfo: S.optional(BrokerSoftwareInfo)
      .pipe(T.JsonName("currentBrokerSoftwareInfo"))
      .annotations({ identifier: "BrokerSoftwareInfo" }),
    ClientAuthentication: S.optional(ClientAuthentication)
      .pipe(T.JsonName("clientAuthentication"))
      .annotations({ identifier: "ClientAuthentication" }),
    EncryptionInfo: S.optional(EncryptionInfo)
      .pipe(T.JsonName("encryptionInfo"))
      .annotations({ identifier: "EncryptionInfo" }),
    EnhancedMonitoring: S.optional(EnhancedMonitoring).pipe(
      T.JsonName("enhancedMonitoring"),
    ),
    OpenMonitoring: S.optional(OpenMonitoringInfo)
      .pipe(T.JsonName("openMonitoring"))
      .annotations({ identifier: "OpenMonitoringInfo" }),
    LoggingInfo: S.optional(LoggingInfo)
      .pipe(T.JsonName("loggingInfo"))
      .annotations({ identifier: "LoggingInfo" }),
    NumberOfBrokerNodes: S.optional(S.Number).pipe(
      T.JsonName("numberOfBrokerNodes"),
    ),
    ZookeeperConnectString: S.optional(S.String).pipe(
      T.JsonName("zookeeperConnectString"),
    ),
    ZookeeperConnectStringTls: S.optional(S.String).pipe(
      T.JsonName("zookeeperConnectStringTls"),
    ),
    StorageMode: S.optional(StorageMode).pipe(T.JsonName("storageMode")),
    CustomerActionStatus: S.optional(CustomerActionStatus).pipe(
      T.JsonName("customerActionStatus"),
    ),
  }),
).annotations({ identifier: "Provisioned" }) as any as S.Schema<Provisioned>;
export interface VpcConfig {
  SubnetIds?: string[];
  SecurityGroupIds?: string[];
}
export const VpcConfig = S.suspend(() =>
  S.Struct({
    SubnetIds: S.optional(__listOf__string).pipe(T.JsonName("subnetIds")),
    SecurityGroupIds: S.optional(__listOf__string).pipe(
      T.JsonName("securityGroupIds"),
    ),
  }),
).annotations({ identifier: "VpcConfig" }) as any as S.Schema<VpcConfig>;
export type __listOfVpcConfig = VpcConfig[];
export const __listOfVpcConfig = S.Array(VpcConfig);
export interface ServerlessSasl {
  Iam?: Iam;
}
export const ServerlessSasl = S.suspend(() =>
  S.Struct({
    Iam: S.optional(Iam)
      .pipe(T.JsonName("iam"))
      .annotations({ identifier: "Iam" }),
  }),
).annotations({
  identifier: "ServerlessSasl",
}) as any as S.Schema<ServerlessSasl>;
export interface ServerlessClientAuthentication {
  Sasl?: ServerlessSasl;
}
export const ServerlessClientAuthentication = S.suspend(() =>
  S.Struct({
    Sasl: S.optional(ServerlessSasl)
      .pipe(T.JsonName("sasl"))
      .annotations({ identifier: "ServerlessSasl" }),
  }),
).annotations({
  identifier: "ServerlessClientAuthentication",
}) as any as S.Schema<ServerlessClientAuthentication>;
export interface Serverless {
  VpcConfigs?: VpcConfig[];
  ClientAuthentication?: ServerlessClientAuthentication;
}
export const Serverless = S.suspend(() =>
  S.Struct({
    VpcConfigs: S.optional(__listOfVpcConfig).pipe(T.JsonName("vpcConfigs")),
    ClientAuthentication: S.optional(ServerlessClientAuthentication)
      .pipe(T.JsonName("clientAuthentication"))
      .annotations({ identifier: "ServerlessClientAuthentication" }),
  }),
).annotations({ identifier: "Serverless" }) as any as S.Schema<Serverless>;
export interface Cluster {
  ActiveOperationArn?: string;
  ClusterType?: ClusterType;
  ClusterArn?: string;
  ClusterName?: string;
  CreationTime?: Date;
  CurrentVersion?: string;
  State?: ClusterState;
  StateInfo?: StateInfo;
  Tags?: { [key: string]: string };
  Provisioned?: Provisioned;
  Serverless?: Serverless;
}
export const Cluster = S.suspend(() =>
  S.Struct({
    ActiveOperationArn: S.optional(S.String).pipe(
      T.JsonName("activeOperationArn"),
    ),
    ClusterType: S.optional(ClusterType).pipe(T.JsonName("clusterType")),
    ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
    ClusterName: S.optional(S.String).pipe(T.JsonName("clusterName")),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("creationTime"),
    ),
    CurrentVersion: S.optional(S.String).pipe(T.JsonName("currentVersion")),
    State: S.optional(ClusterState).pipe(T.JsonName("state")),
    StateInfo: S.optional(StateInfo)
      .pipe(T.JsonName("stateInfo"))
      .annotations({ identifier: "StateInfo" }),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    Provisioned: S.optional(Provisioned)
      .pipe(T.JsonName("provisioned"))
      .annotations({ identifier: "Provisioned" }),
    Serverless: S.optional(Serverless)
      .pipe(T.JsonName("serverless"))
      .annotations({ identifier: "Serverless" }),
  }),
).annotations({ identifier: "Cluster" }) as any as S.Schema<Cluster>;
export type __listOfCluster = Cluster[];
export const __listOfCluster = S.Array(Cluster);
export interface ConfigurationRevision {
  CreationTime?: Date;
  Description?: string;
  Revision?: number;
}
export const ConfigurationRevision = S.suspend(() =>
  S.Struct({
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("creationTime"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Revision: S.optional(S.Number).pipe(T.JsonName("revision")),
  }),
).annotations({
  identifier: "ConfigurationRevision",
}) as any as S.Schema<ConfigurationRevision>;
export type __listOfConfigurationRevision = ConfigurationRevision[];
export const __listOfConfigurationRevision = S.Array(ConfigurationRevision);
export interface ConsumerGroupReplicationUpdate {
  ConsumerGroupsToExclude?: string[];
  ConsumerGroupsToReplicate?: string[];
  DetectAndCopyNewConsumerGroups?: boolean;
  SynchroniseConsumerGroupOffsets?: boolean;
}
export const ConsumerGroupReplicationUpdate = S.suspend(() =>
  S.Struct({
    ConsumerGroupsToExclude: S.optional(__listOf__stringMax256).pipe(
      T.JsonName("consumerGroupsToExclude"),
    ),
    ConsumerGroupsToReplicate: S.optional(__listOf__stringMax256).pipe(
      T.JsonName("consumerGroupsToReplicate"),
    ),
    DetectAndCopyNewConsumerGroups: S.optional(S.Boolean).pipe(
      T.JsonName("detectAndCopyNewConsumerGroups"),
    ),
    SynchroniseConsumerGroupOffsets: S.optional(S.Boolean).pipe(
      T.JsonName("synchroniseConsumerGroupOffsets"),
    ),
  }),
).annotations({
  identifier: "ConsumerGroupReplicationUpdate",
}) as any as S.Schema<ConsumerGroupReplicationUpdate>;
export interface TopicReplicationUpdate {
  CopyAccessControlListsForTopics?: boolean;
  CopyTopicConfigurations?: boolean;
  DetectAndCopyNewTopics?: boolean;
  TopicsToExclude?: string[];
  TopicsToReplicate?: string[];
}
export const TopicReplicationUpdate = S.suspend(() =>
  S.Struct({
    CopyAccessControlListsForTopics: S.optional(S.Boolean).pipe(
      T.JsonName("copyAccessControlListsForTopics"),
    ),
    CopyTopicConfigurations: S.optional(S.Boolean).pipe(
      T.JsonName("copyTopicConfigurations"),
    ),
    DetectAndCopyNewTopics: S.optional(S.Boolean).pipe(
      T.JsonName("detectAndCopyNewTopics"),
    ),
    TopicsToExclude: S.optional(__listOf__stringMax249).pipe(
      T.JsonName("topicsToExclude"),
    ),
    TopicsToReplicate: S.optional(__listOf__stringMax249).pipe(
      T.JsonName("topicsToReplicate"),
    ),
  }),
).annotations({
  identifier: "TopicReplicationUpdate",
}) as any as S.Schema<TopicReplicationUpdate>;
export interface UnprocessedScramSecret {
  ErrorCode?: string;
  ErrorMessage?: string;
  SecretArn?: string;
}
export const UnprocessedScramSecret = S.suspend(() =>
  S.Struct({
    ErrorCode: S.optional(S.String).pipe(T.JsonName("errorCode")),
    ErrorMessage: S.optional(S.String).pipe(T.JsonName("errorMessage")),
    SecretArn: S.optional(S.String).pipe(T.JsonName("secretArn")),
  }),
).annotations({
  identifier: "UnprocessedScramSecret",
}) as any as S.Schema<UnprocessedScramSecret>;
export type __listOfUnprocessedScramSecret = UnprocessedScramSecret[];
export const __listOfUnprocessedScramSecret = S.Array(UnprocessedScramSecret);
export interface BatchDisassociateScramSecretResponse {
  ClusterArn?: string;
  UnprocessedScramSecrets?: UnprocessedScramSecret[];
}
export const BatchDisassociateScramSecretResponse = S.suspend(() =>
  S.Struct({
    ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
    UnprocessedScramSecrets: S.optional(__listOfUnprocessedScramSecret).pipe(
      T.JsonName("unprocessedScramSecrets"),
    ),
  }),
).annotations({
  identifier: "BatchDisassociateScramSecretResponse",
}) as any as S.Schema<BatchDisassociateScramSecretResponse>;
export interface CreateVpcConnectionResponse {
  VpcConnectionArn?: string;
  State?: VpcConnectionState;
  Authentication?: string;
  VpcId?: string;
  ClientSubnets?: string[];
  SecurityGroups?: string[];
  CreationTime?: Date;
  Tags?: { [key: string]: string };
}
export const CreateVpcConnectionResponse = S.suspend(() =>
  S.Struct({
    VpcConnectionArn: S.optional(S.String).pipe(T.JsonName("vpcConnectionArn")),
    State: S.optional(VpcConnectionState).pipe(T.JsonName("state")),
    Authentication: S.optional(S.String).pipe(T.JsonName("authentication")),
    VpcId: S.optional(S.String).pipe(T.JsonName("vpcId")),
    ClientSubnets: S.optional(__listOf__string).pipe(
      T.JsonName("clientSubnets"),
    ),
    SecurityGroups: S.optional(__listOf__string).pipe(
      T.JsonName("securityGroups"),
    ),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("creationTime"),
    ),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "CreateVpcConnectionResponse",
}) as any as S.Schema<CreateVpcConnectionResponse>;
export interface DeleteClusterResponse {
  ClusterArn?: string;
  State?: ClusterState;
}
export const DeleteClusterResponse = S.suspend(() =>
  S.Struct({
    ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
    State: S.optional(ClusterState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "DeleteClusterResponse",
}) as any as S.Schema<DeleteClusterResponse>;
export interface DeleteConfigurationResponse {
  Arn?: string;
  State?: ConfigurationState;
}
export const DeleteConfigurationResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    State: S.optional(ConfigurationState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "DeleteConfigurationResponse",
}) as any as S.Schema<DeleteConfigurationResponse>;
export interface DeleteReplicatorResponse {
  ReplicatorArn?: string;
  ReplicatorState?: ReplicatorState;
}
export const DeleteReplicatorResponse = S.suspend(() =>
  S.Struct({
    ReplicatorArn: S.optional(S.String).pipe(T.JsonName("replicatorArn")),
    ReplicatorState: S.optional(ReplicatorState).pipe(
      T.JsonName("replicatorState"),
    ),
  }),
).annotations({
  identifier: "DeleteReplicatorResponse",
}) as any as S.Schema<DeleteReplicatorResponse>;
export interface DeleteVpcConnectionResponse {
  VpcConnectionArn?: string;
  State?: VpcConnectionState;
}
export const DeleteVpcConnectionResponse = S.suspend(() =>
  S.Struct({
    VpcConnectionArn: S.optional(S.String).pipe(T.JsonName("vpcConnectionArn")),
    State: S.optional(VpcConnectionState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "DeleteVpcConnectionResponse",
}) as any as S.Schema<DeleteVpcConnectionResponse>;
export interface DescribeConfigurationResponse {
  Arn?: string;
  CreationTime?: Date;
  Description?: string;
  KafkaVersions?: string[];
  LatestRevision?: ConfigurationRevision & {
    CreationTime: __timestampIso8601;
    Revision: number;
  };
  Name?: string;
  State?: ConfigurationState;
}
export const DescribeConfigurationResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("creationTime"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    KafkaVersions: S.optional(__listOf__string).pipe(
      T.JsonName("kafkaVersions"),
    ),
    LatestRevision: S.optional(ConfigurationRevision)
      .pipe(T.JsonName("latestRevision"))
      .annotations({ identifier: "ConfigurationRevision" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    State: S.optional(ConfigurationState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "DescribeConfigurationResponse",
}) as any as S.Schema<DescribeConfigurationResponse>;
export interface DescribeConfigurationRevisionResponse {
  Arn?: string;
  CreationTime?: Date;
  Description?: string;
  Revision?: number;
  ServerProperties?: Uint8Array;
}
export const DescribeConfigurationRevisionResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("creationTime"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Revision: S.optional(S.Number).pipe(T.JsonName("revision")),
    ServerProperties: S.optional(T.Blob).pipe(T.JsonName("serverProperties")),
  }),
).annotations({
  identifier: "DescribeConfigurationRevisionResponse",
}) as any as S.Schema<DescribeConfigurationRevisionResponse>;
export interface DescribeTopicResponse {
  TopicArn?: string;
  TopicName?: string;
  ReplicationFactor?: number;
  PartitionCount?: number;
  Configs?: string;
  Status?: TopicState;
}
export const DescribeTopicResponse = S.suspend(() =>
  S.Struct({
    TopicArn: S.optional(S.String).pipe(T.JsonName("topicArn")),
    TopicName: S.optional(S.String).pipe(T.JsonName("topicName")),
    ReplicationFactor: S.optional(S.Number).pipe(
      T.JsonName("replicationFactor"),
    ),
    PartitionCount: S.optional(S.Number).pipe(T.JsonName("partitionCount")),
    Configs: S.optional(S.String).pipe(T.JsonName("configs")),
    Status: S.optional(TopicState).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "DescribeTopicResponse",
}) as any as S.Schema<DescribeTopicResponse>;
export interface DescribeVpcConnectionResponse {
  VpcConnectionArn?: string;
  TargetClusterArn?: string;
  State?: VpcConnectionState;
  Authentication?: string;
  VpcId?: string;
  Subnets?: string[];
  SecurityGroups?: string[];
  CreationTime?: Date;
  Tags?: { [key: string]: string };
}
export const DescribeVpcConnectionResponse = S.suspend(() =>
  S.Struct({
    VpcConnectionArn: S.optional(S.String).pipe(T.JsonName("vpcConnectionArn")),
    TargetClusterArn: S.optional(S.String).pipe(T.JsonName("targetClusterArn")),
    State: S.optional(VpcConnectionState).pipe(T.JsonName("state")),
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
  }),
).annotations({
  identifier: "DescribeVpcConnectionResponse",
}) as any as S.Schema<DescribeVpcConnectionResponse>;
export interface GetBootstrapBrokersResponse {
  BootstrapBrokerString?: string;
  BootstrapBrokerStringTls?: string;
  BootstrapBrokerStringSaslScram?: string;
  BootstrapBrokerStringSaslIam?: string;
  BootstrapBrokerStringPublicTls?: string;
  BootstrapBrokerStringPublicSaslScram?: string;
  BootstrapBrokerStringPublicSaslIam?: string;
  BootstrapBrokerStringVpcConnectivityTls?: string;
  BootstrapBrokerStringVpcConnectivitySaslScram?: string;
  BootstrapBrokerStringVpcConnectivitySaslIam?: string;
}
export const GetBootstrapBrokersResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetBootstrapBrokersResponse",
}) as any as S.Schema<GetBootstrapBrokersResponse>;
export interface GetClusterPolicyResponse {
  CurrentVersion?: string;
  Policy?: string;
}
export const GetClusterPolicyResponse = S.suspend(() =>
  S.Struct({
    CurrentVersion: S.optional(S.String).pipe(T.JsonName("currentVersion")),
    Policy: S.optional(S.String).pipe(T.JsonName("policy")),
  }),
).annotations({
  identifier: "GetClusterPolicyResponse",
}) as any as S.Schema<GetClusterPolicyResponse>;
export interface ListClusterOperationsResponse {
  ClusterOperationInfoList?: (ClusterOperationInfo & {
    SourceClusterInfo: MutableClusterInfo & {
      BrokerEBSVolumeInfo: (BrokerEBSVolumeInfo & {
        KafkaBrokerNodeId: string;
      })[];
      ConfigurationInfo: ConfigurationInfo & { Arn: string; Revision: number };
      OpenMonitoring: OpenMonitoring & {
        Prometheus: Prometheus & {
          JmxExporter: JmxExporter & { EnabledInBroker: boolean };
          NodeExporter: NodeExporter & { EnabledInBroker: boolean };
        };
      };
      LoggingInfo: LoggingInfo & {
        BrokerLogs: BrokerLogs & {
          CloudWatchLogs: CloudWatchLogs & { Enabled: boolean };
          Firehose: Firehose & { Enabled: boolean };
          S3: S3 & { Enabled: boolean };
        };
      };
      EncryptionInfo: EncryptionInfo & {
        EncryptionAtRest: EncryptionAtRest & { DataVolumeKMSKeyId: string };
      };
    };
    TargetClusterInfo: MutableClusterInfo & {
      BrokerEBSVolumeInfo: (BrokerEBSVolumeInfo & {
        KafkaBrokerNodeId: string;
      })[];
      ConfigurationInfo: ConfigurationInfo & { Arn: string; Revision: number };
      OpenMonitoring: OpenMonitoring & {
        Prometheus: Prometheus & {
          JmxExporter: JmxExporter & { EnabledInBroker: boolean };
          NodeExporter: NodeExporter & { EnabledInBroker: boolean };
        };
      };
      LoggingInfo: LoggingInfo & {
        BrokerLogs: BrokerLogs & {
          CloudWatchLogs: CloudWatchLogs & { Enabled: boolean };
          Firehose: Firehose & { Enabled: boolean };
          S3: S3 & { Enabled: boolean };
        };
      };
      EncryptionInfo: EncryptionInfo & {
        EncryptionAtRest: EncryptionAtRest & { DataVolumeKMSKeyId: string };
      };
    };
  })[];
  NextToken?: string;
}
export const ListClusterOperationsResponse = S.suspend(() =>
  S.Struct({
    ClusterOperationInfoList: S.optional(__listOfClusterOperationInfo).pipe(
      T.JsonName("clusterOperationInfoList"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListClusterOperationsResponse",
}) as any as S.Schema<ListClusterOperationsResponse>;
export interface ListClustersResponse {
  ClusterInfoList?: (ClusterInfo & {
    BrokerNodeGroupInfo: BrokerNodeGroupInfo & {
      ClientSubnets: __listOf__string;
      InstanceType: __stringMin5Max32;
    };
    EncryptionInfo: EncryptionInfo & {
      EncryptionAtRest: EncryptionAtRest & { DataVolumeKMSKeyId: string };
    };
    OpenMonitoring: OpenMonitoring & {
      Prometheus: Prometheus & {
        JmxExporter: JmxExporter & { EnabledInBroker: boolean };
        NodeExporter: NodeExporter & { EnabledInBroker: boolean };
      };
    };
    LoggingInfo: LoggingInfo & {
      BrokerLogs: BrokerLogs & {
        CloudWatchLogs: CloudWatchLogs & { Enabled: boolean };
        Firehose: Firehose & { Enabled: boolean };
        S3: S3 & { Enabled: boolean };
      };
    };
  })[];
  NextToken?: string;
}
export const ListClustersResponse = S.suspend(() =>
  S.Struct({
    ClusterInfoList: S.optional(__listOfClusterInfo).pipe(
      T.JsonName("clusterInfoList"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListClustersResponse",
}) as any as S.Schema<ListClustersResponse>;
export interface ListClustersV2Response {
  ClusterInfoList?: (Cluster & {
    Provisioned: Provisioned & {
      BrokerNodeGroupInfo: BrokerNodeGroupInfo & {
        ClientSubnets: __listOf__string;
        InstanceType: __stringMin5Max32;
      };
      NumberOfBrokerNodes: __integerMin1Max15;
      EncryptionInfo: EncryptionInfo & {
        EncryptionAtRest: EncryptionAtRest & { DataVolumeKMSKeyId: string };
      };
      OpenMonitoring: OpenMonitoringInfo & {
        Prometheus: PrometheusInfo & {
          JmxExporter: JmxExporterInfo & { EnabledInBroker: boolean };
          NodeExporter: NodeExporterInfo & { EnabledInBroker: boolean };
        };
      };
      LoggingInfo: LoggingInfo & {
        BrokerLogs: BrokerLogs & {
          CloudWatchLogs: CloudWatchLogs & { Enabled: boolean };
          Firehose: Firehose & { Enabled: boolean };
          S3: S3 & { Enabled: boolean };
        };
      };
    };
    Serverless: Serverless & {
      VpcConfigs: (VpcConfig & { SubnetIds: __listOf__string })[];
    };
  })[];
  NextToken?: string;
}
export const ListClustersV2Response = S.suspend(() =>
  S.Struct({
    ClusterInfoList: S.optional(__listOfCluster).pipe(
      T.JsonName("clusterInfoList"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListClustersV2Response",
}) as any as S.Schema<ListClustersV2Response>;
export interface ListConfigurationRevisionsResponse {
  NextToken?: string;
  Revisions?: (ConfigurationRevision & {
    CreationTime: __timestampIso8601;
    Revision: number;
  })[];
}
export const ListConfigurationRevisionsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    Revisions: S.optional(__listOfConfigurationRevision).pipe(
      T.JsonName("revisions"),
    ),
  }),
).annotations({
  identifier: "ListConfigurationRevisionsResponse",
}) as any as S.Schema<ListConfigurationRevisionsResponse>;
export interface ListScramSecretsResponse {
  NextToken?: string;
  SecretArnList?: string[];
}
export const ListScramSecretsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    SecretArnList: S.optional(__listOf__string).pipe(
      T.JsonName("secretArnList"),
    ),
  }),
).annotations({
  identifier: "ListScramSecretsResponse",
}) as any as S.Schema<ListScramSecretsResponse>;
export interface ListTagsForResourceResponse {
  Tags?: { [key: string]: string };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutClusterPolicyResponse {
  CurrentVersion?: string;
}
export const PutClusterPolicyResponse = S.suspend(() =>
  S.Struct({
    CurrentVersion: S.optional(S.String).pipe(T.JsonName("currentVersion")),
  }),
).annotations({
  identifier: "PutClusterPolicyResponse",
}) as any as S.Schema<PutClusterPolicyResponse>;
export interface RebootBrokerResponse {
  ClusterArn?: string;
  ClusterOperationArn?: string;
}
export const RebootBrokerResponse = S.suspend(() =>
  S.Struct({
    ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
    ClusterOperationArn: S.optional(S.String).pipe(
      T.JsonName("clusterOperationArn"),
    ),
  }),
).annotations({
  identifier: "RebootBrokerResponse",
}) as any as S.Schema<RebootBrokerResponse>;
export interface UpdateBrokerCountResponse {
  ClusterArn?: string;
  ClusterOperationArn?: string;
}
export const UpdateBrokerCountResponse = S.suspend(() =>
  S.Struct({
    ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
    ClusterOperationArn: S.optional(S.String).pipe(
      T.JsonName("clusterOperationArn"),
    ),
  }),
).annotations({
  identifier: "UpdateBrokerCountResponse",
}) as any as S.Schema<UpdateBrokerCountResponse>;
export interface UpdateBrokerStorageRequest {
  ClusterArn: string;
  CurrentVersion?: string;
  TargetBrokerEBSVolumeInfo?: BrokerEBSVolumeInfo[];
}
export const UpdateBrokerStorageRequest = S.suspend(() =>
  S.Struct({
    ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")),
    CurrentVersion: S.optional(S.String).pipe(T.JsonName("currentVersion")),
    TargetBrokerEBSVolumeInfo: S.optional(__listOfBrokerEBSVolumeInfo).pipe(
      T.JsonName("targetBrokerEBSVolumeInfo"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/clusters/{ClusterArn}/nodes/storage" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBrokerStorageRequest",
}) as any as S.Schema<UpdateBrokerStorageRequest>;
export interface UpdateBrokerTypeResponse {
  ClusterArn?: string;
  ClusterOperationArn?: string;
}
export const UpdateBrokerTypeResponse = S.suspend(() =>
  S.Struct({
    ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
    ClusterOperationArn: S.optional(S.String).pipe(
      T.JsonName("clusterOperationArn"),
    ),
  }),
).annotations({
  identifier: "UpdateBrokerTypeResponse",
}) as any as S.Schema<UpdateBrokerTypeResponse>;
export interface UpdateClusterConfigurationResponse {
  ClusterArn?: string;
  ClusterOperationArn?: string;
}
export const UpdateClusterConfigurationResponse = S.suspend(() =>
  S.Struct({
    ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
    ClusterOperationArn: S.optional(S.String).pipe(
      T.JsonName("clusterOperationArn"),
    ),
  }),
).annotations({
  identifier: "UpdateClusterConfigurationResponse",
}) as any as S.Schema<UpdateClusterConfigurationResponse>;
export interface UpdateClusterKafkaVersionResponse {
  ClusterArn?: string;
  ClusterOperationArn?: string;
}
export const UpdateClusterKafkaVersionResponse = S.suspend(() =>
  S.Struct({
    ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
    ClusterOperationArn: S.optional(S.String).pipe(
      T.JsonName("clusterOperationArn"),
    ),
  }),
).annotations({
  identifier: "UpdateClusterKafkaVersionResponse",
}) as any as S.Schema<UpdateClusterKafkaVersionResponse>;
export interface UpdateConfigurationResponse {
  Arn?: string;
  LatestRevision?: ConfigurationRevision & {
    CreationTime: __timestampIso8601;
    Revision: number;
  };
}
export const UpdateConfigurationResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    LatestRevision: S.optional(ConfigurationRevision)
      .pipe(T.JsonName("latestRevision"))
      .annotations({ identifier: "ConfigurationRevision" }),
  }),
).annotations({
  identifier: "UpdateConfigurationResponse",
}) as any as S.Schema<UpdateConfigurationResponse>;
export interface UpdateMonitoringResponse {
  ClusterArn?: string;
  ClusterOperationArn?: string;
}
export const UpdateMonitoringResponse = S.suspend(() =>
  S.Struct({
    ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
    ClusterOperationArn: S.optional(S.String).pipe(
      T.JsonName("clusterOperationArn"),
    ),
  }),
).annotations({
  identifier: "UpdateMonitoringResponse",
}) as any as S.Schema<UpdateMonitoringResponse>;
export interface UpdateRebalancingResponse {
  ClusterArn?: string;
  ClusterOperationArn?: string;
}
export const UpdateRebalancingResponse = S.suspend(() =>
  S.Struct({
    ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
    ClusterOperationArn: S.optional(S.String).pipe(
      T.JsonName("clusterOperationArn"),
    ),
  }),
).annotations({
  identifier: "UpdateRebalancingResponse",
}) as any as S.Schema<UpdateRebalancingResponse>;
export interface UpdateReplicationInfoRequest {
  ConsumerGroupReplication?: ConsumerGroupReplicationUpdate;
  CurrentVersion?: string;
  ReplicatorArn: string;
  SourceKafkaClusterArn?: string;
  TargetKafkaClusterArn?: string;
  TopicReplication?: TopicReplicationUpdate;
}
export const UpdateReplicationInfoRequest = S.suspend(() =>
  S.Struct({
    ConsumerGroupReplication: S.optional(ConsumerGroupReplicationUpdate)
      .pipe(T.JsonName("consumerGroupReplication"))
      .annotations({ identifier: "ConsumerGroupReplicationUpdate" }),
    CurrentVersion: S.optional(S.String).pipe(T.JsonName("currentVersion")),
    ReplicatorArn: S.String.pipe(T.HttpLabel("ReplicatorArn")),
    SourceKafkaClusterArn: S.optional(S.String).pipe(
      T.JsonName("sourceKafkaClusterArn"),
    ),
    TargetKafkaClusterArn: S.optional(S.String).pipe(
      T.JsonName("targetKafkaClusterArn"),
    ),
    TopicReplication: S.optional(TopicReplicationUpdate)
      .pipe(T.JsonName("topicReplication"))
      .annotations({ identifier: "TopicReplicationUpdate" }),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateReplicationInfoRequest",
}) as any as S.Schema<UpdateReplicationInfoRequest>;
export interface UpdateSecurityResponse {
  ClusterArn?: string;
  ClusterOperationArn?: string;
}
export const UpdateSecurityResponse = S.suspend(() =>
  S.Struct({
    ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
    ClusterOperationArn: S.optional(S.String).pipe(
      T.JsonName("clusterOperationArn"),
    ),
  }),
).annotations({
  identifier: "UpdateSecurityResponse",
}) as any as S.Schema<UpdateSecurityResponse>;
export interface UpdateStorageRequest {
  ClusterArn: string;
  CurrentVersion?: string;
  ProvisionedThroughput?: ProvisionedThroughput;
  StorageMode?: StorageMode;
  VolumeSizeGB?: number;
}
export const UpdateStorageRequest = S.suspend(() =>
  S.Struct({
    ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")),
    CurrentVersion: S.optional(S.String).pipe(T.JsonName("currentVersion")),
    ProvisionedThroughput: S.optional(ProvisionedThroughput)
      .pipe(T.JsonName("provisionedThroughput"))
      .annotations({ identifier: "ProvisionedThroughput" }),
    StorageMode: S.optional(StorageMode).pipe(T.JsonName("storageMode")),
    VolumeSizeGB: S.optional(S.Number).pipe(T.JsonName("volumeSizeGB")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/clusters/{ClusterArn}/storage" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateStorageRequest",
}) as any as S.Schema<UpdateStorageRequest>;
export interface AmazonMskCluster {
  MskClusterArn?: string;
}
export const AmazonMskCluster = S.suspend(() =>
  S.Struct({
    MskClusterArn: S.optional(S.String).pipe(T.JsonName("mskClusterArn")),
  }),
).annotations({
  identifier: "AmazonMskCluster",
}) as any as S.Schema<AmazonMskCluster>;
export interface KafkaClusterClientVpcConfig {
  SecurityGroupIds?: string[];
  SubnetIds?: string[];
}
export const KafkaClusterClientVpcConfig = S.suspend(() =>
  S.Struct({
    SecurityGroupIds: S.optional(__listOf__string).pipe(
      T.JsonName("securityGroupIds"),
    ),
    SubnetIds: S.optional(__listOf__string).pipe(T.JsonName("subnetIds")),
  }),
).annotations({
  identifier: "KafkaClusterClientVpcConfig",
}) as any as S.Schema<KafkaClusterClientVpcConfig>;
export interface ConsumerGroupReplication {
  ConsumerGroupsToExclude?: string[];
  ConsumerGroupsToReplicate?: string[];
  DetectAndCopyNewConsumerGroups?: boolean;
  SynchroniseConsumerGroupOffsets?: boolean;
}
export const ConsumerGroupReplication = S.suspend(() =>
  S.Struct({
    ConsumerGroupsToExclude: S.optional(__listOf__stringMax256).pipe(
      T.JsonName("consumerGroupsToExclude"),
    ),
    ConsumerGroupsToReplicate: S.optional(__listOf__stringMax256).pipe(
      T.JsonName("consumerGroupsToReplicate"),
    ),
    DetectAndCopyNewConsumerGroups: S.optional(S.Boolean).pipe(
      T.JsonName("detectAndCopyNewConsumerGroups"),
    ),
    SynchroniseConsumerGroupOffsets: S.optional(S.Boolean).pipe(
      T.JsonName("synchroniseConsumerGroupOffsets"),
    ),
  }),
).annotations({
  identifier: "ConsumerGroupReplication",
}) as any as S.Schema<ConsumerGroupReplication>;
export type __listOf__integer = number[];
export const __listOf__integer = S.Array(S.Number);
export type KafkaVersionStatus = "ACTIVE" | "DEPRECATED";
export const KafkaVersionStatus = S.Literal("ACTIVE", "DEPRECATED");
export type NodeType = "BROKER";
export const NodeType = S.Literal("BROKER");
export type ReplicationStartingPositionType = "LATEST" | "EARLIEST";
export const ReplicationStartingPositionType = S.Literal("LATEST", "EARLIEST");
export type ReplicationTopicNameConfigurationType =
  | "PREFIXED_WITH_SOURCE_CLUSTER_ALIAS"
  | "IDENTICAL";
export const ReplicationTopicNameConfigurationType = S.Literal(
  "PREFIXED_WITH_SOURCE_CLUSTER_ALIAS",
  "IDENTICAL",
);
export interface KafkaCluster {
  AmazonMskCluster?: AmazonMskCluster;
  VpcConfig?: KafkaClusterClientVpcConfig;
}
export const KafkaCluster = S.suspend(() =>
  S.Struct({
    AmazonMskCluster: S.optional(AmazonMskCluster)
      .pipe(T.JsonName("amazonMskCluster"))
      .annotations({ identifier: "AmazonMskCluster" }),
    VpcConfig: S.optional(KafkaClusterClientVpcConfig)
      .pipe(T.JsonName("vpcConfig"))
      .annotations({ identifier: "KafkaClusterClientVpcConfig" }),
  }),
).annotations({ identifier: "KafkaCluster" }) as any as S.Schema<KafkaCluster>;
export type __listOfKafkaCluster = KafkaCluster[];
export const __listOfKafkaCluster = S.Array(KafkaCluster);
export interface KafkaClusterDescription {
  AmazonMskCluster?: AmazonMskCluster;
  KafkaClusterAlias?: string;
  VpcConfig?: KafkaClusterClientVpcConfig;
}
export const KafkaClusterDescription = S.suspend(() =>
  S.Struct({
    AmazonMskCluster: S.optional(AmazonMskCluster)
      .pipe(T.JsonName("amazonMskCluster"))
      .annotations({ identifier: "AmazonMskCluster" }),
    KafkaClusterAlias: S.optional(S.String).pipe(
      T.JsonName("kafkaClusterAlias"),
    ),
    VpcConfig: S.optional(KafkaClusterClientVpcConfig)
      .pipe(T.JsonName("vpcConfig"))
      .annotations({ identifier: "KafkaClusterClientVpcConfig" }),
  }),
).annotations({
  identifier: "KafkaClusterDescription",
}) as any as S.Schema<KafkaClusterDescription>;
export type __listOfKafkaClusterDescription = KafkaClusterDescription[];
export const __listOfKafkaClusterDescription = S.Array(KafkaClusterDescription);
export interface ReplicationStartingPosition {
  Type?: ReplicationStartingPositionType;
}
export const ReplicationStartingPosition = S.suspend(() =>
  S.Struct({
    Type: S.optional(ReplicationStartingPositionType).pipe(T.JsonName("type")),
  }),
).annotations({
  identifier: "ReplicationStartingPosition",
}) as any as S.Schema<ReplicationStartingPosition>;
export interface ReplicationTopicNameConfiguration {
  Type?: ReplicationTopicNameConfigurationType;
}
export const ReplicationTopicNameConfiguration = S.suspend(() =>
  S.Struct({
    Type: S.optional(ReplicationTopicNameConfigurationType).pipe(
      T.JsonName("type"),
    ),
  }),
).annotations({
  identifier: "ReplicationTopicNameConfiguration",
}) as any as S.Schema<ReplicationTopicNameConfiguration>;
export interface TopicReplication {
  CopyAccessControlListsForTopics?: boolean;
  CopyTopicConfigurations?: boolean;
  DetectAndCopyNewTopics?: boolean;
  StartingPosition?: ReplicationStartingPosition;
  TopicNameConfiguration?: ReplicationTopicNameConfiguration;
  TopicsToExclude?: string[];
  TopicsToReplicate?: string[];
}
export const TopicReplication = S.suspend(() =>
  S.Struct({
    CopyAccessControlListsForTopics: S.optional(S.Boolean).pipe(
      T.JsonName("copyAccessControlListsForTopics"),
    ),
    CopyTopicConfigurations: S.optional(S.Boolean).pipe(
      T.JsonName("copyTopicConfigurations"),
    ),
    DetectAndCopyNewTopics: S.optional(S.Boolean).pipe(
      T.JsonName("detectAndCopyNewTopics"),
    ),
    StartingPosition: S.optional(ReplicationStartingPosition)
      .pipe(T.JsonName("startingPosition"))
      .annotations({ identifier: "ReplicationStartingPosition" }),
    TopicNameConfiguration: S.optional(ReplicationTopicNameConfiguration)
      .pipe(T.JsonName("topicNameConfiguration"))
      .annotations({ identifier: "ReplicationTopicNameConfiguration" }),
    TopicsToExclude: S.optional(__listOf__stringMax249).pipe(
      T.JsonName("topicsToExclude"),
    ),
    TopicsToReplicate: S.optional(__listOf__stringMax249).pipe(
      T.JsonName("topicsToReplicate"),
    ),
  }),
).annotations({
  identifier: "TopicReplication",
}) as any as S.Schema<TopicReplication>;
export interface ReplicationInfoDescription {
  ConsumerGroupReplication?: ConsumerGroupReplication;
  SourceKafkaClusterAlias?: string;
  TargetCompressionType?: TargetCompressionType;
  TargetKafkaClusterAlias?: string;
  TopicReplication?: TopicReplication;
}
export const ReplicationInfoDescription = S.suspend(() =>
  S.Struct({
    ConsumerGroupReplication: S.optional(ConsumerGroupReplication)
      .pipe(T.JsonName("consumerGroupReplication"))
      .annotations({ identifier: "ConsumerGroupReplication" }),
    SourceKafkaClusterAlias: S.optional(S.String).pipe(
      T.JsonName("sourceKafkaClusterAlias"),
    ),
    TargetCompressionType: S.optional(TargetCompressionType).pipe(
      T.JsonName("targetCompressionType"),
    ),
    TargetKafkaClusterAlias: S.optional(S.String).pipe(
      T.JsonName("targetKafkaClusterAlias"),
    ),
    TopicReplication: S.optional(TopicReplication)
      .pipe(T.JsonName("topicReplication"))
      .annotations({ identifier: "TopicReplication" }),
  }),
).annotations({
  identifier: "ReplicationInfoDescription",
}) as any as S.Schema<ReplicationInfoDescription>;
export type __listOfReplicationInfoDescription = ReplicationInfoDescription[];
export const __listOfReplicationInfoDescription = S.Array(
  ReplicationInfoDescription,
);
export interface ReplicationStateInfo {
  Code?: string;
  Message?: string;
}
export const ReplicationStateInfo = S.suspend(() =>
  S.Struct({
    Code: S.optional(S.String).pipe(T.JsonName("code")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  }),
).annotations({
  identifier: "ReplicationStateInfo",
}) as any as S.Schema<ReplicationStateInfo>;
export interface TopicPartitionInfo {
  Partition?: number;
  Leader?: number;
  Replicas?: number[];
  Isr?: number[];
}
export const TopicPartitionInfo = S.suspend(() =>
  S.Struct({
    Partition: S.optional(S.Number).pipe(T.JsonName("partition")),
    Leader: S.optional(S.Number).pipe(T.JsonName("leader")),
    Replicas: S.optional(__listOf__integer).pipe(T.JsonName("replicas")),
    Isr: S.optional(__listOf__integer).pipe(T.JsonName("isr")),
  }),
).annotations({
  identifier: "TopicPartitionInfo",
}) as any as S.Schema<TopicPartitionInfo>;
export type __listOfTopicPartitionInfo = TopicPartitionInfo[];
export const __listOfTopicPartitionInfo = S.Array(TopicPartitionInfo);
export interface CompatibleKafkaVersion {
  SourceVersion?: string;
  TargetVersions?: string[];
}
export const CompatibleKafkaVersion = S.suspend(() =>
  S.Struct({
    SourceVersion: S.optional(S.String).pipe(T.JsonName("sourceVersion")),
    TargetVersions: S.optional(__listOf__string).pipe(
      T.JsonName("targetVersions"),
    ),
  }),
).annotations({
  identifier: "CompatibleKafkaVersion",
}) as any as S.Schema<CompatibleKafkaVersion>;
export type __listOfCompatibleKafkaVersion = CompatibleKafkaVersion[];
export const __listOfCompatibleKafkaVersion = S.Array(CompatibleKafkaVersion);
export interface ClientVpcConnection {
  Authentication?: string;
  CreationTime?: Date;
  State?: VpcConnectionState;
  VpcConnectionArn?: string;
  Owner?: string;
}
export const ClientVpcConnection = S.suspend(() =>
  S.Struct({
    Authentication: S.optional(S.String).pipe(T.JsonName("authentication")),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("creationTime"),
    ),
    State: S.optional(VpcConnectionState).pipe(T.JsonName("state")),
    VpcConnectionArn: S.optional(S.String).pipe(T.JsonName("vpcConnectionArn")),
    Owner: S.optional(S.String).pipe(T.JsonName("owner")),
  }),
).annotations({
  identifier: "ClientVpcConnection",
}) as any as S.Schema<ClientVpcConnection>;
export type __listOfClientVpcConnection = ClientVpcConnection[];
export const __listOfClientVpcConnection = S.Array(ClientVpcConnection);
export interface ClusterOperationV2Summary {
  ClusterArn?: string;
  ClusterType?: ClusterType;
  StartTime?: Date;
  EndTime?: Date;
  OperationArn?: string;
  OperationState?: string;
  OperationType?: string;
}
export const ClusterOperationV2Summary = S.suspend(() =>
  S.Struct({
    ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
    ClusterType: S.optional(ClusterType).pipe(T.JsonName("clusterType")),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("startTime"),
    ),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("endTime"),
    ),
    OperationArn: S.optional(S.String).pipe(T.JsonName("operationArn")),
    OperationState: S.optional(S.String).pipe(T.JsonName("operationState")),
    OperationType: S.optional(S.String).pipe(T.JsonName("operationType")),
  }),
).annotations({
  identifier: "ClusterOperationV2Summary",
}) as any as S.Schema<ClusterOperationV2Summary>;
export type __listOfClusterOperationV2Summary = ClusterOperationV2Summary[];
export const __listOfClusterOperationV2Summary = S.Array(
  ClusterOperationV2Summary,
);
export interface Configuration {
  Arn?: string;
  CreationTime?: Date;
  Description?: string;
  KafkaVersions?: string[];
  LatestRevision?: ConfigurationRevision;
  Name?: string;
  State?: ConfigurationState;
}
export const Configuration = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("creationTime"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    KafkaVersions: S.optional(__listOf__string).pipe(
      T.JsonName("kafkaVersions"),
    ),
    LatestRevision: S.optional(ConfigurationRevision)
      .pipe(T.JsonName("latestRevision"))
      .annotations({ identifier: "ConfigurationRevision" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    State: S.optional(ConfigurationState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "Configuration",
}) as any as S.Schema<Configuration>;
export type __listOfConfiguration = Configuration[];
export const __listOfConfiguration = S.Array(Configuration);
export interface KafkaVersion {
  Version?: string;
  Status?: KafkaVersionStatus;
}
export const KafkaVersion = S.suspend(() =>
  S.Struct({
    Version: S.optional(S.String).pipe(T.JsonName("version")),
    Status: S.optional(KafkaVersionStatus).pipe(T.JsonName("status")),
  }),
).annotations({ identifier: "KafkaVersion" }) as any as S.Schema<KafkaVersion>;
export type __listOfKafkaVersion = KafkaVersion[];
export const __listOfKafkaVersion = S.Array(KafkaVersion);
export interface TopicInfo {
  TopicArn?: string;
  TopicName?: string;
  ReplicationFactor?: number;
  PartitionCount?: number;
  OutOfSyncReplicaCount?: number;
}
export const TopicInfo = S.suspend(() =>
  S.Struct({
    TopicArn: S.optional(S.String).pipe(T.JsonName("topicArn")),
    TopicName: S.optional(S.String).pipe(T.JsonName("topicName")),
    ReplicationFactor: S.optional(S.Number).pipe(
      T.JsonName("replicationFactor"),
    ),
    PartitionCount: S.optional(S.Number).pipe(T.JsonName("partitionCount")),
    OutOfSyncReplicaCount: S.optional(S.Number).pipe(
      T.JsonName("outOfSyncReplicaCount"),
    ),
  }),
).annotations({ identifier: "TopicInfo" }) as any as S.Schema<TopicInfo>;
export type __listOfTopicInfo = TopicInfo[];
export const __listOfTopicInfo = S.Array(TopicInfo);
export interface VpcConnection {
  VpcConnectionArn?: string;
  TargetClusterArn?: string;
  CreationTime?: Date;
  Authentication?: string;
  VpcId?: string;
  State?: VpcConnectionState;
}
export const VpcConnection = S.suspend(() =>
  S.Struct({
    VpcConnectionArn: S.optional(S.String).pipe(T.JsonName("vpcConnectionArn")),
    TargetClusterArn: S.optional(S.String).pipe(T.JsonName("targetClusterArn")),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("creationTime"),
    ),
    Authentication: S.optional(S.String).pipe(T.JsonName("authentication")),
    VpcId: S.optional(S.String).pipe(T.JsonName("vpcId")),
    State: S.optional(VpcConnectionState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "VpcConnection",
}) as any as S.Schema<VpcConnection>;
export type __listOfVpcConnection = VpcConnection[];
export const __listOfVpcConnection = S.Array(VpcConnection);
export interface BatchAssociateScramSecretResponse {
  ClusterArn?: string;
  UnprocessedScramSecrets?: UnprocessedScramSecret[];
}
export const BatchAssociateScramSecretResponse = S.suspend(() =>
  S.Struct({
    ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
    UnprocessedScramSecrets: S.optional(__listOfUnprocessedScramSecret).pipe(
      T.JsonName("unprocessedScramSecrets"),
    ),
  }),
).annotations({
  identifier: "BatchAssociateScramSecretResponse",
}) as any as S.Schema<BatchAssociateScramSecretResponse>;
export interface CreateConfigurationResponse {
  Arn?: string;
  CreationTime?: Date;
  LatestRevision?: ConfigurationRevision & {
    CreationTime: __timestampIso8601;
    Revision: number;
  };
  Name?: string;
  State?: ConfigurationState;
}
export const CreateConfigurationResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("creationTime"),
    ),
    LatestRevision: S.optional(ConfigurationRevision)
      .pipe(T.JsonName("latestRevision"))
      .annotations({ identifier: "ConfigurationRevision" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    State: S.optional(ConfigurationState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "CreateConfigurationResponse",
}) as any as S.Schema<CreateConfigurationResponse>;
export interface DescribeReplicatorResponse {
  CreationTime?: Date;
  CurrentVersion?: string;
  IsReplicatorReference?: boolean;
  KafkaClusters?: (KafkaClusterDescription & {
    AmazonMskCluster: AmazonMskCluster & { MskClusterArn: string };
    VpcConfig: KafkaClusterClientVpcConfig & { SubnetIds: __listOf__string };
  })[];
  ReplicationInfoList?: (ReplicationInfoDescription & {
    ConsumerGroupReplication: ConsumerGroupReplication & {
      ConsumerGroupsToReplicate: __listOf__stringMax256;
    };
    TopicReplication: TopicReplication & {
      TopicsToReplicate: __listOf__stringMax249;
    };
  })[];
  ReplicatorArn?: string;
  ReplicatorDescription?: string;
  ReplicatorName?: string;
  ReplicatorResourceArn?: string;
  ReplicatorState?: ReplicatorState;
  ServiceExecutionRoleArn?: string;
  StateInfo?: ReplicationStateInfo;
  Tags?: { [key: string]: string };
}
export const DescribeReplicatorResponse = S.suspend(() =>
  S.Struct({
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
    ReplicatorState: S.optional(ReplicatorState).pipe(
      T.JsonName("replicatorState"),
    ),
    ServiceExecutionRoleArn: S.optional(S.String).pipe(
      T.JsonName("serviceExecutionRoleArn"),
    ),
    StateInfo: S.optional(ReplicationStateInfo)
      .pipe(T.JsonName("stateInfo"))
      .annotations({ identifier: "ReplicationStateInfo" }),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "DescribeReplicatorResponse",
}) as any as S.Schema<DescribeReplicatorResponse>;
export interface DescribeTopicPartitionsResponse {
  Partitions?: TopicPartitionInfo[];
  NextToken?: string;
}
export const DescribeTopicPartitionsResponse = S.suspend(() =>
  S.Struct({
    Partitions: S.optional(__listOfTopicPartitionInfo).pipe(
      T.JsonName("partitions"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "DescribeTopicPartitionsResponse",
}) as any as S.Schema<DescribeTopicPartitionsResponse>;
export interface GetCompatibleKafkaVersionsResponse {
  CompatibleKafkaVersions?: CompatibleKafkaVersion[];
}
export const GetCompatibleKafkaVersionsResponse = S.suspend(() =>
  S.Struct({
    CompatibleKafkaVersions: S.optional(__listOfCompatibleKafkaVersion).pipe(
      T.JsonName("compatibleKafkaVersions"),
    ),
  }),
).annotations({
  identifier: "GetCompatibleKafkaVersionsResponse",
}) as any as S.Schema<GetCompatibleKafkaVersionsResponse>;
export interface ListClientVpcConnectionsResponse {
  ClientVpcConnections?: (ClientVpcConnection & { VpcConnectionArn: string })[];
  NextToken?: string;
}
export const ListClientVpcConnectionsResponse = S.suspend(() =>
  S.Struct({
    ClientVpcConnections: S.optional(__listOfClientVpcConnection).pipe(
      T.JsonName("clientVpcConnections"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListClientVpcConnectionsResponse",
}) as any as S.Schema<ListClientVpcConnectionsResponse>;
export interface ListClusterOperationsV2Response {
  ClusterOperationInfoList?: ClusterOperationV2Summary[];
  NextToken?: string;
}
export const ListClusterOperationsV2Response = S.suspend(() =>
  S.Struct({
    ClusterOperationInfoList: S.optional(
      __listOfClusterOperationV2Summary,
    ).pipe(T.JsonName("clusterOperationInfoList")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListClusterOperationsV2Response",
}) as any as S.Schema<ListClusterOperationsV2Response>;
export interface ListConfigurationsResponse {
  Configurations?: (Configuration & {
    Arn: string;
    CreationTime: __timestampIso8601;
    Description: string;
    KafkaVersions: __listOf__string;
    LatestRevision: ConfigurationRevision & {
      CreationTime: __timestampIso8601;
      Revision: number;
    };
    Name: string;
    State: ConfigurationState;
  })[];
  NextToken?: string;
}
export const ListConfigurationsResponse = S.suspend(() =>
  S.Struct({
    Configurations: S.optional(__listOfConfiguration).pipe(
      T.JsonName("configurations"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListConfigurationsResponse",
}) as any as S.Schema<ListConfigurationsResponse>;
export interface ListKafkaVersionsResponse {
  KafkaVersions?: KafkaVersion[];
  NextToken?: string;
}
export const ListKafkaVersionsResponse = S.suspend(() =>
  S.Struct({
    KafkaVersions: S.optional(__listOfKafkaVersion).pipe(
      T.JsonName("kafkaVersions"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListKafkaVersionsResponse",
}) as any as S.Schema<ListKafkaVersionsResponse>;
export interface ListTopicsResponse {
  Topics?: TopicInfo[];
  NextToken?: string;
}
export const ListTopicsResponse = S.suspend(() =>
  S.Struct({
    Topics: S.optional(__listOfTopicInfo).pipe(T.JsonName("topics")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListTopicsResponse",
}) as any as S.Schema<ListTopicsResponse>;
export interface ListVpcConnectionsResponse {
  VpcConnections?: (VpcConnection & {
    VpcConnectionArn: string;
    TargetClusterArn: string;
  })[];
  NextToken?: string;
}
export const ListVpcConnectionsResponse = S.suspend(() =>
  S.Struct({
    VpcConnections: S.optional(__listOfVpcConnection).pipe(
      T.JsonName("vpcConnections"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListVpcConnectionsResponse",
}) as any as S.Schema<ListVpcConnectionsResponse>;
export interface UpdateBrokerStorageResponse {
  ClusterArn?: string;
  ClusterOperationArn?: string;
}
export const UpdateBrokerStorageResponse = S.suspend(() =>
  S.Struct({
    ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
    ClusterOperationArn: S.optional(S.String).pipe(
      T.JsonName("clusterOperationArn"),
    ),
  }),
).annotations({
  identifier: "UpdateBrokerStorageResponse",
}) as any as S.Schema<UpdateBrokerStorageResponse>;
export interface UpdateReplicationInfoResponse {
  ReplicatorArn?: string;
  ReplicatorState?: ReplicatorState;
}
export const UpdateReplicationInfoResponse = S.suspend(() =>
  S.Struct({
    ReplicatorArn: S.optional(S.String).pipe(T.JsonName("replicatorArn")),
    ReplicatorState: S.optional(ReplicatorState).pipe(
      T.JsonName("replicatorState"),
    ),
  }),
).annotations({
  identifier: "UpdateReplicationInfoResponse",
}) as any as S.Schema<UpdateReplicationInfoResponse>;
export interface UpdateStorageResponse {
  ClusterArn?: string;
  ClusterOperationArn?: string;
}
export const UpdateStorageResponse = S.suspend(() =>
  S.Struct({
    ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
    ClusterOperationArn: S.optional(S.String).pipe(
      T.JsonName("clusterOperationArn"),
    ),
  }),
).annotations({
  identifier: "UpdateStorageResponse",
}) as any as S.Schema<UpdateStorageResponse>;
export interface ClusterOperationV2Provisioned {
  OperationSteps?: ClusterOperationStep[];
  SourceClusterInfo?: MutableClusterInfo;
  TargetClusterInfo?: MutableClusterInfo;
  VpcConnectionInfo?: VpcConnectionInfo;
}
export const ClusterOperationV2Provisioned = S.suspend(() =>
  S.Struct({
    OperationSteps: S.optional(__listOfClusterOperationStep).pipe(
      T.JsonName("operationSteps"),
    ),
    SourceClusterInfo: S.optional(MutableClusterInfo)
      .pipe(T.JsonName("sourceClusterInfo"))
      .annotations({ identifier: "MutableClusterInfo" }),
    TargetClusterInfo: S.optional(MutableClusterInfo)
      .pipe(T.JsonName("targetClusterInfo"))
      .annotations({ identifier: "MutableClusterInfo" }),
    VpcConnectionInfo: S.optional(VpcConnectionInfo)
      .pipe(T.JsonName("vpcConnectionInfo"))
      .annotations({ identifier: "VpcConnectionInfo" }),
  }),
).annotations({
  identifier: "ClusterOperationV2Provisioned",
}) as any as S.Schema<ClusterOperationV2Provisioned>;
export interface BrokerNodeInfo {
  AttachedENIId?: string;
  BrokerId?: number;
  ClientSubnet?: string;
  ClientVpcIpAddress?: string;
  CurrentBrokerSoftwareInfo?: BrokerSoftwareInfo;
  Endpoints?: string[];
}
export const BrokerNodeInfo = S.suspend(() =>
  S.Struct({
    AttachedENIId: S.optional(S.String).pipe(T.JsonName("attachedENIId")),
    BrokerId: S.optional(S.Number).pipe(T.JsonName("brokerId")),
    ClientSubnet: S.optional(S.String).pipe(T.JsonName("clientSubnet")),
    ClientVpcIpAddress: S.optional(S.String).pipe(
      T.JsonName("clientVpcIpAddress"),
    ),
    CurrentBrokerSoftwareInfo: S.optional(BrokerSoftwareInfo)
      .pipe(T.JsonName("currentBrokerSoftwareInfo"))
      .annotations({ identifier: "BrokerSoftwareInfo" }),
    Endpoints: S.optional(__listOf__string).pipe(T.JsonName("endpoints")),
  }),
).annotations({
  identifier: "BrokerNodeInfo",
}) as any as S.Schema<BrokerNodeInfo>;
export interface ControllerNodeInfo {
  Endpoints?: string[];
}
export const ControllerNodeInfo = S.suspend(() =>
  S.Struct({
    Endpoints: S.optional(__listOf__string).pipe(T.JsonName("endpoints")),
  }),
).annotations({
  identifier: "ControllerNodeInfo",
}) as any as S.Schema<ControllerNodeInfo>;
export interface ZookeeperNodeInfo {
  AttachedENIId?: string;
  ClientVpcIpAddress?: string;
  Endpoints?: string[];
  ZookeeperId?: number;
  ZookeeperVersion?: string;
}
export const ZookeeperNodeInfo = S.suspend(() =>
  S.Struct({
    AttachedENIId: S.optional(S.String).pipe(T.JsonName("attachedENIId")),
    ClientVpcIpAddress: S.optional(S.String).pipe(
      T.JsonName("clientVpcIpAddress"),
    ),
    Endpoints: S.optional(__listOf__string).pipe(T.JsonName("endpoints")),
    ZookeeperId: S.optional(S.Number).pipe(T.JsonName("zookeeperId")),
    ZookeeperVersion: S.optional(S.String).pipe(T.JsonName("zookeeperVersion")),
  }),
).annotations({
  identifier: "ZookeeperNodeInfo",
}) as any as S.Schema<ZookeeperNodeInfo>;
export interface KafkaClusterSummary {
  AmazonMskCluster?: AmazonMskCluster;
  KafkaClusterAlias?: string;
}
export const KafkaClusterSummary = S.suspend(() =>
  S.Struct({
    AmazonMskCluster: S.optional(AmazonMskCluster)
      .pipe(T.JsonName("amazonMskCluster"))
      .annotations({ identifier: "AmazonMskCluster" }),
    KafkaClusterAlias: S.optional(S.String).pipe(
      T.JsonName("kafkaClusterAlias"),
    ),
  }),
).annotations({
  identifier: "KafkaClusterSummary",
}) as any as S.Schema<KafkaClusterSummary>;
export type __listOfKafkaClusterSummary = KafkaClusterSummary[];
export const __listOfKafkaClusterSummary = S.Array(KafkaClusterSummary);
export interface ReplicationInfoSummary {
  SourceKafkaClusterAlias?: string;
  TargetKafkaClusterAlias?: string;
}
export const ReplicationInfoSummary = S.suspend(() =>
  S.Struct({
    SourceKafkaClusterAlias: S.optional(S.String).pipe(
      T.JsonName("sourceKafkaClusterAlias"),
    ),
    TargetKafkaClusterAlias: S.optional(S.String).pipe(
      T.JsonName("targetKafkaClusterAlias"),
    ),
  }),
).annotations({
  identifier: "ReplicationInfoSummary",
}) as any as S.Schema<ReplicationInfoSummary>;
export type __listOfReplicationInfoSummary = ReplicationInfoSummary[];
export const __listOfReplicationInfoSummary = S.Array(ReplicationInfoSummary);
export interface ServerlessRequest {
  VpcConfigs?: VpcConfig[];
  ClientAuthentication?: ServerlessClientAuthentication;
}
export const ServerlessRequest = S.suspend(() =>
  S.Struct({
    VpcConfigs: S.optional(__listOfVpcConfig).pipe(T.JsonName("vpcConfigs")),
    ClientAuthentication: S.optional(ServerlessClientAuthentication)
      .pipe(T.JsonName("clientAuthentication"))
      .annotations({ identifier: "ServerlessClientAuthentication" }),
  }),
).annotations({
  identifier: "ServerlessRequest",
}) as any as S.Schema<ServerlessRequest>;
export interface ReplicationInfo {
  ConsumerGroupReplication?: ConsumerGroupReplication;
  SourceKafkaClusterArn?: string;
  TargetCompressionType?: TargetCompressionType;
  TargetKafkaClusterArn?: string;
  TopicReplication?: TopicReplication;
}
export const ReplicationInfo = S.suspend(() =>
  S.Struct({
    ConsumerGroupReplication: S.optional(ConsumerGroupReplication)
      .pipe(T.JsonName("consumerGroupReplication"))
      .annotations({ identifier: "ConsumerGroupReplication" }),
    SourceKafkaClusterArn: S.optional(S.String).pipe(
      T.JsonName("sourceKafkaClusterArn"),
    ),
    TargetCompressionType: S.optional(TargetCompressionType).pipe(
      T.JsonName("targetCompressionType"),
    ),
    TargetKafkaClusterArn: S.optional(S.String).pipe(
      T.JsonName("targetKafkaClusterArn"),
    ),
    TopicReplication: S.optional(TopicReplication)
      .pipe(T.JsonName("topicReplication"))
      .annotations({ identifier: "TopicReplication" }),
  }),
).annotations({
  identifier: "ReplicationInfo",
}) as any as S.Schema<ReplicationInfo>;
export type __listOfReplicationInfo = ReplicationInfo[];
export const __listOfReplicationInfo = S.Array(ReplicationInfo);
export interface NodeInfo {
  AddedToClusterTime?: string;
  BrokerNodeInfo?: BrokerNodeInfo;
  ControllerNodeInfo?: ControllerNodeInfo;
  InstanceType?: string;
  NodeARN?: string;
  NodeType?: NodeType;
  ZookeeperNodeInfo?: ZookeeperNodeInfo;
}
export const NodeInfo = S.suspend(() =>
  S.Struct({
    AddedToClusterTime: S.optional(S.String).pipe(
      T.JsonName("addedToClusterTime"),
    ),
    BrokerNodeInfo: S.optional(BrokerNodeInfo)
      .pipe(T.JsonName("brokerNodeInfo"))
      .annotations({ identifier: "BrokerNodeInfo" }),
    ControllerNodeInfo: S.optional(ControllerNodeInfo)
      .pipe(T.JsonName("controllerNodeInfo"))
      .annotations({ identifier: "ControllerNodeInfo" }),
    InstanceType: S.optional(S.String).pipe(T.JsonName("instanceType")),
    NodeARN: S.optional(S.String).pipe(T.JsonName("nodeARN")),
    NodeType: S.optional(NodeType).pipe(T.JsonName("nodeType")),
    ZookeeperNodeInfo: S.optional(ZookeeperNodeInfo)
      .pipe(T.JsonName("zookeeperNodeInfo"))
      .annotations({ identifier: "ZookeeperNodeInfo" }),
  }),
).annotations({ identifier: "NodeInfo" }) as any as S.Schema<NodeInfo>;
export type __listOfNodeInfo = NodeInfo[];
export const __listOfNodeInfo = S.Array(NodeInfo);
export interface ReplicatorSummary {
  CreationTime?: Date;
  CurrentVersion?: string;
  IsReplicatorReference?: boolean;
  KafkaClustersSummary?: KafkaClusterSummary[];
  ReplicationInfoSummaryList?: ReplicationInfoSummary[];
  ReplicatorArn?: string;
  ReplicatorName?: string;
  ReplicatorResourceArn?: string;
  ReplicatorState?: ReplicatorState;
}
export const ReplicatorSummary = S.suspend(() =>
  S.Struct({
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
    ReplicatorState: S.optional(ReplicatorState).pipe(
      T.JsonName("replicatorState"),
    ),
  }),
).annotations({
  identifier: "ReplicatorSummary",
}) as any as S.Schema<ReplicatorSummary>;
export type __listOfReplicatorSummary = ReplicatorSummary[];
export const __listOfReplicatorSummary = S.Array(ReplicatorSummary);
export interface VpcConnectionInfoServerless {
  CreationTime?: Date;
  Owner?: string;
  UserIdentity?: UserIdentity;
  VpcConnectionArn?: string;
}
export const VpcConnectionInfoServerless = S.suspend(() =>
  S.Struct({
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("creationTime"),
    ),
    Owner: S.optional(S.String).pipe(T.JsonName("owner")),
    UserIdentity: S.optional(UserIdentity)
      .pipe(T.JsonName("userIdentity"))
      .annotations({ identifier: "UserIdentity" }),
    VpcConnectionArn: S.optional(S.String).pipe(T.JsonName("vpcConnectionArn")),
  }),
).annotations({
  identifier: "VpcConnectionInfoServerless",
}) as any as S.Schema<VpcConnectionInfoServerless>;
export interface CreateClusterRequest {
  BrokerNodeGroupInfo?: BrokerNodeGroupInfo;
  Rebalancing?: Rebalancing;
  ClientAuthentication?: ClientAuthentication;
  ClusterName?: string;
  ConfigurationInfo?: ConfigurationInfo;
  EncryptionInfo?: EncryptionInfo;
  EnhancedMonitoring?: EnhancedMonitoring;
  OpenMonitoring?: OpenMonitoringInfo;
  KafkaVersion?: string;
  LoggingInfo?: LoggingInfo;
  NumberOfBrokerNodes?: number;
  Tags?: { [key: string]: string };
  StorageMode?: StorageMode;
}
export const CreateClusterRequest = S.suspend(() =>
  S.Struct({
    BrokerNodeGroupInfo: S.optional(BrokerNodeGroupInfo)
      .pipe(T.JsonName("brokerNodeGroupInfo"))
      .annotations({ identifier: "BrokerNodeGroupInfo" }),
    Rebalancing: S.optional(Rebalancing)
      .pipe(T.JsonName("rebalancing"))
      .annotations({ identifier: "Rebalancing" }),
    ClientAuthentication: S.optional(ClientAuthentication)
      .pipe(T.JsonName("clientAuthentication"))
      .annotations({ identifier: "ClientAuthentication" }),
    ClusterName: S.optional(S.String).pipe(T.JsonName("clusterName")),
    ConfigurationInfo: S.optional(ConfigurationInfo)
      .pipe(T.JsonName("configurationInfo"))
      .annotations({ identifier: "ConfigurationInfo" }),
    EncryptionInfo: S.optional(EncryptionInfo)
      .pipe(T.JsonName("encryptionInfo"))
      .annotations({ identifier: "EncryptionInfo" }),
    EnhancedMonitoring: S.optional(EnhancedMonitoring).pipe(
      T.JsonName("enhancedMonitoring"),
    ),
    OpenMonitoring: S.optional(OpenMonitoringInfo)
      .pipe(T.JsonName("openMonitoring"))
      .annotations({ identifier: "OpenMonitoringInfo" }),
    KafkaVersion: S.optional(S.String).pipe(T.JsonName("kafkaVersion")),
    LoggingInfo: S.optional(LoggingInfo)
      .pipe(T.JsonName("loggingInfo"))
      .annotations({ identifier: "LoggingInfo" }),
    NumberOfBrokerNodes: S.optional(S.Number).pipe(
      T.JsonName("numberOfBrokerNodes"),
    ),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    StorageMode: S.optional(StorageMode).pipe(T.JsonName("storageMode")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/clusters" }),
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
export interface CreateClusterV2Request {
  ClusterName?: string;
  Tags?: { [key: string]: string };
  Provisioned?: ProvisionedRequest;
  Serverless?: ServerlessRequest;
}
export const CreateClusterV2Request = S.suspend(() =>
  S.Struct({
    ClusterName: S.optional(S.String).pipe(T.JsonName("clusterName")),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    Provisioned: S.optional(ProvisionedRequest)
      .pipe(T.JsonName("provisioned"))
      .annotations({ identifier: "ProvisionedRequest" }),
    Serverless: S.optional(ServerlessRequest)
      .pipe(T.JsonName("serverless"))
      .annotations({ identifier: "ServerlessRequest" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/api/v2/clusters" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateClusterV2Request",
}) as any as S.Schema<CreateClusterV2Request>;
export interface CreateReplicatorRequest {
  Description?: string;
  KafkaClusters?: KafkaCluster[];
  ReplicationInfoList?: ReplicationInfo[];
  ReplicatorName?: string;
  ServiceExecutionRoleArn?: string;
  Tags?: { [key: string]: string };
}
export const CreateReplicatorRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    KafkaClusters: S.optional(__listOfKafkaCluster).pipe(
      T.JsonName("kafkaClusters"),
    ),
    ReplicationInfoList: S.optional(__listOfReplicationInfo).pipe(
      T.JsonName("replicationInfoList"),
    ),
    ReplicatorName: S.optional(S.String).pipe(T.JsonName("replicatorName")),
    ServiceExecutionRoleArn: S.optional(S.String).pipe(
      T.JsonName("serviceExecutionRoleArn"),
    ),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/replication/v1/replicators" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateReplicatorRequest",
}) as any as S.Schema<CreateReplicatorRequest>;
export interface DescribeClusterV2Response {
  ClusterInfo?: Cluster & {
    Provisioned: Provisioned & {
      BrokerNodeGroupInfo: BrokerNodeGroupInfo & {
        ClientSubnets: __listOf__string;
        InstanceType: __stringMin5Max32;
      };
      NumberOfBrokerNodes: __integerMin1Max15;
      EncryptionInfo: EncryptionInfo & {
        EncryptionAtRest: EncryptionAtRest & { DataVolumeKMSKeyId: string };
      };
      OpenMonitoring: OpenMonitoringInfo & {
        Prometheus: PrometheusInfo & {
          JmxExporter: JmxExporterInfo & { EnabledInBroker: boolean };
          NodeExporter: NodeExporterInfo & { EnabledInBroker: boolean };
        };
      };
      LoggingInfo: LoggingInfo & {
        BrokerLogs: BrokerLogs & {
          CloudWatchLogs: CloudWatchLogs & { Enabled: boolean };
          Firehose: Firehose & { Enabled: boolean };
          S3: S3 & { Enabled: boolean };
        };
      };
    };
    Serverless: Serverless & {
      VpcConfigs: (VpcConfig & { SubnetIds: __listOf__string })[];
    };
  };
}
export const DescribeClusterV2Response = S.suspend(() =>
  S.Struct({
    ClusterInfo: S.optional(Cluster)
      .pipe(T.JsonName("clusterInfo"))
      .annotations({ identifier: "Cluster" }),
  }),
).annotations({
  identifier: "DescribeClusterV2Response",
}) as any as S.Schema<DescribeClusterV2Response>;
export interface ListNodesResponse {
  NextToken?: string;
  NodeInfoList?: NodeInfo[];
}
export const ListNodesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    NodeInfoList: S.optional(__listOfNodeInfo).pipe(T.JsonName("nodeInfoList")),
  }),
).annotations({
  identifier: "ListNodesResponse",
}) as any as S.Schema<ListNodesResponse>;
export interface ListReplicatorsResponse {
  NextToken?: string;
  Replicators?: (ReplicatorSummary & {
    KafkaClustersSummary: (KafkaClusterSummary & {
      AmazonMskCluster: AmazonMskCluster & { MskClusterArn: string };
    })[];
  })[];
}
export const ListReplicatorsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    Replicators: S.optional(__listOfReplicatorSummary).pipe(
      T.JsonName("replicators"),
    ),
  }),
).annotations({
  identifier: "ListReplicatorsResponse",
}) as any as S.Schema<ListReplicatorsResponse>;
export interface ClusterOperationV2Serverless {
  VpcConnectionInfo?: VpcConnectionInfoServerless;
}
export const ClusterOperationV2Serverless = S.suspend(() =>
  S.Struct({
    VpcConnectionInfo: S.optional(VpcConnectionInfoServerless)
      .pipe(T.JsonName("vpcConnectionInfo"))
      .annotations({ identifier: "VpcConnectionInfoServerless" }),
  }),
).annotations({
  identifier: "ClusterOperationV2Serverless",
}) as any as S.Schema<ClusterOperationV2Serverless>;
export interface ClusterOperationV2 {
  ClusterArn?: string;
  ClusterType?: ClusterType;
  StartTime?: Date;
  EndTime?: Date;
  ErrorInfo?: ErrorInfo;
  OperationArn?: string;
  OperationState?: string;
  OperationType?: string;
  Provisioned?: ClusterOperationV2Provisioned;
  Serverless?: ClusterOperationV2Serverless;
}
export const ClusterOperationV2 = S.suspend(() =>
  S.Struct({
    ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
    ClusterType: S.optional(ClusterType).pipe(T.JsonName("clusterType")),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("startTime"),
    ),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("endTime"),
    ),
    ErrorInfo: S.optional(ErrorInfo)
      .pipe(T.JsonName("errorInfo"))
      .annotations({ identifier: "ErrorInfo" }),
    OperationArn: S.optional(S.String).pipe(T.JsonName("operationArn")),
    OperationState: S.optional(S.String).pipe(T.JsonName("operationState")),
    OperationType: S.optional(S.String).pipe(T.JsonName("operationType")),
    Provisioned: S.optional(ClusterOperationV2Provisioned)
      .pipe(T.JsonName("provisioned"))
      .annotations({ identifier: "ClusterOperationV2Provisioned" }),
    Serverless: S.optional(ClusterOperationV2Serverless)
      .pipe(T.JsonName("serverless"))
      .annotations({ identifier: "ClusterOperationV2Serverless" }),
  }),
).annotations({
  identifier: "ClusterOperationV2",
}) as any as S.Schema<ClusterOperationV2>;
export interface CreateClusterResponse {
  ClusterArn?: string;
  ClusterName?: string;
  State?: ClusterState;
}
export const CreateClusterResponse = S.suspend(() =>
  S.Struct({
    ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
    ClusterName: S.optional(S.String).pipe(T.JsonName("clusterName")),
    State: S.optional(ClusterState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "CreateClusterResponse",
}) as any as S.Schema<CreateClusterResponse>;
export interface CreateClusterV2Response {
  ClusterArn?: string;
  ClusterName?: string;
  State?: ClusterState;
  ClusterType?: ClusterType;
}
export const CreateClusterV2Response = S.suspend(() =>
  S.Struct({
    ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
    ClusterName: S.optional(S.String).pipe(T.JsonName("clusterName")),
    State: S.optional(ClusterState).pipe(T.JsonName("state")),
    ClusterType: S.optional(ClusterType).pipe(T.JsonName("clusterType")),
  }),
).annotations({
  identifier: "CreateClusterV2Response",
}) as any as S.Schema<CreateClusterV2Response>;
export interface CreateReplicatorResponse {
  ReplicatorArn?: string;
  ReplicatorName?: string;
  ReplicatorState?: ReplicatorState;
}
export const CreateReplicatorResponse = S.suspend(() =>
  S.Struct({
    ReplicatorArn: S.optional(S.String).pipe(T.JsonName("replicatorArn")),
    ReplicatorName: S.optional(S.String).pipe(T.JsonName("replicatorName")),
    ReplicatorState: S.optional(ReplicatorState).pipe(
      T.JsonName("replicatorState"),
    ),
  }),
).annotations({
  identifier: "CreateReplicatorResponse",
}) as any as S.Schema<CreateReplicatorResponse>;
export interface DescribeClusterOperationResponse {
  ClusterOperationInfo?: ClusterOperationInfo & {
    SourceClusterInfo: MutableClusterInfo & {
      BrokerEBSVolumeInfo: (BrokerEBSVolumeInfo & {
        KafkaBrokerNodeId: string;
      })[];
      ConfigurationInfo: ConfigurationInfo & { Arn: string; Revision: number };
      OpenMonitoring: OpenMonitoring & {
        Prometheus: Prometheus & {
          JmxExporter: JmxExporter & { EnabledInBroker: boolean };
          NodeExporter: NodeExporter & { EnabledInBroker: boolean };
        };
      };
      LoggingInfo: LoggingInfo & {
        BrokerLogs: BrokerLogs & {
          CloudWatchLogs: CloudWatchLogs & { Enabled: boolean };
          Firehose: Firehose & { Enabled: boolean };
          S3: S3 & { Enabled: boolean };
        };
      };
      EncryptionInfo: EncryptionInfo & {
        EncryptionAtRest: EncryptionAtRest & { DataVolumeKMSKeyId: string };
      };
    };
    TargetClusterInfo: MutableClusterInfo & {
      BrokerEBSVolumeInfo: (BrokerEBSVolumeInfo & {
        KafkaBrokerNodeId: string;
      })[];
      ConfigurationInfo: ConfigurationInfo & { Arn: string; Revision: number };
      OpenMonitoring: OpenMonitoring & {
        Prometheus: Prometheus & {
          JmxExporter: JmxExporter & { EnabledInBroker: boolean };
          NodeExporter: NodeExporter & { EnabledInBroker: boolean };
        };
      };
      LoggingInfo: LoggingInfo & {
        BrokerLogs: BrokerLogs & {
          CloudWatchLogs: CloudWatchLogs & { Enabled: boolean };
          Firehose: Firehose & { Enabled: boolean };
          S3: S3 & { Enabled: boolean };
        };
      };
      EncryptionInfo: EncryptionInfo & {
        EncryptionAtRest: EncryptionAtRest & { DataVolumeKMSKeyId: string };
      };
    };
  };
}
export const DescribeClusterOperationResponse = S.suspend(() =>
  S.Struct({
    ClusterOperationInfo: S.optional(ClusterOperationInfo)
      .pipe(T.JsonName("clusterOperationInfo"))
      .annotations({ identifier: "ClusterOperationInfo" }),
  }),
).annotations({
  identifier: "DescribeClusterOperationResponse",
}) as any as S.Schema<DescribeClusterOperationResponse>;
export interface DescribeClusterOperationV2Response {
  ClusterOperationInfo?: ClusterOperationV2 & {
    Provisioned: ClusterOperationV2Provisioned & {
      SourceClusterInfo: MutableClusterInfo & {
        BrokerEBSVolumeInfo: (BrokerEBSVolumeInfo & {
          KafkaBrokerNodeId: string;
        })[];
        ConfigurationInfo: ConfigurationInfo & {
          Arn: string;
          Revision: number;
        };
        OpenMonitoring: OpenMonitoring & {
          Prometheus: Prometheus & {
            JmxExporter: JmxExporter & { EnabledInBroker: boolean };
            NodeExporter: NodeExporter & { EnabledInBroker: boolean };
          };
        };
        LoggingInfo: LoggingInfo & {
          BrokerLogs: BrokerLogs & {
            CloudWatchLogs: CloudWatchLogs & { Enabled: boolean };
            Firehose: Firehose & { Enabled: boolean };
            S3: S3 & { Enabled: boolean };
          };
        };
        EncryptionInfo: EncryptionInfo & {
          EncryptionAtRest: EncryptionAtRest & { DataVolumeKMSKeyId: string };
        };
      };
      TargetClusterInfo: MutableClusterInfo & {
        BrokerEBSVolumeInfo: (BrokerEBSVolumeInfo & {
          KafkaBrokerNodeId: string;
        })[];
        ConfigurationInfo: ConfigurationInfo & {
          Arn: string;
          Revision: number;
        };
        OpenMonitoring: OpenMonitoring & {
          Prometheus: Prometheus & {
            JmxExporter: JmxExporter & { EnabledInBroker: boolean };
            NodeExporter: NodeExporter & { EnabledInBroker: boolean };
          };
        };
        LoggingInfo: LoggingInfo & {
          BrokerLogs: BrokerLogs & {
            CloudWatchLogs: CloudWatchLogs & { Enabled: boolean };
            Firehose: Firehose & { Enabled: boolean };
            S3: S3 & { Enabled: boolean };
          };
        };
        EncryptionInfo: EncryptionInfo & {
          EncryptionAtRest: EncryptionAtRest & { DataVolumeKMSKeyId: string };
        };
      };
    };
  };
}
export const DescribeClusterOperationV2Response = S.suspend(() =>
  S.Struct({
    ClusterOperationInfo: S.optional(ClusterOperationV2)
      .pipe(T.JsonName("clusterOperationInfo"))
      .annotations({ identifier: "ClusterOperationV2" }),
  }),
).annotations({
  identifier: "DescribeClusterOperationV2Response",
}) as any as S.Schema<DescribeClusterOperationV2Response>;
export interface DescribeClusterResponse {
  ClusterInfo?: ClusterInfo & {
    BrokerNodeGroupInfo: BrokerNodeGroupInfo & {
      ClientSubnets: __listOf__string;
      InstanceType: __stringMin5Max32;
    };
    EncryptionInfo: EncryptionInfo & {
      EncryptionAtRest: EncryptionAtRest & { DataVolumeKMSKeyId: string };
    };
    OpenMonitoring: OpenMonitoring & {
      Prometheus: Prometheus & {
        JmxExporter: JmxExporter & { EnabledInBroker: boolean };
        NodeExporter: NodeExporter & { EnabledInBroker: boolean };
      };
    };
    LoggingInfo: LoggingInfo & {
      BrokerLogs: BrokerLogs & {
        CloudWatchLogs: CloudWatchLogs & { Enabled: boolean };
        Firehose: Firehose & { Enabled: boolean };
        S3: S3 & { Enabled: boolean };
      };
    };
  };
}
export const DescribeClusterResponse = S.suspend(() =>
  S.Struct({
    ClusterInfo: S.optional(ClusterInfo)
      .pipe(T.JsonName("clusterInfo"))
      .annotations({ identifier: "ClusterInfo" }),
  }),
).annotations({
  identifier: "DescribeClusterResponse",
}) as any as S.Schema<DescribeClusterResponse>;
export interface UpdateConnectivityRequest {
  ClusterArn: string;
  ConnectivityInfo?: ConnectivityInfo;
  CurrentVersion?: string;
}
export const UpdateConnectivityRequest = S.suspend(() =>
  S.Struct({
    ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")),
    ConnectivityInfo: S.optional(ConnectivityInfo)
      .pipe(T.JsonName("connectivityInfo"))
      .annotations({ identifier: "ConnectivityInfo" }),
    CurrentVersion: S.optional(S.String).pipe(T.JsonName("currentVersion")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/clusters/{ClusterArn}/connectivity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConnectivityRequest",
}) as any as S.Schema<UpdateConnectivityRequest>;
export interface UpdateConnectivityResponse {
  ClusterArn?: string;
  ClusterOperationArn?: string;
}
export const UpdateConnectivityResponse = S.suspend(() =>
  S.Struct({
    ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
    ClusterOperationArn: S.optional(S.String).pipe(
      T.JsonName("clusterOperationArn"),
    ),
  }),
).annotations({
  identifier: "UpdateConnectivityResponse",
}) as any as S.Schema<UpdateConnectivityResponse>;

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {
    InvalidParameter: S.optional(S.String).pipe(T.JsonName("invalidParameter")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  },
).pipe(C.withBadRequestError) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  {
    InvalidParameter: S.optional(S.String).pipe(T.JsonName("invalidParameter")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    InvalidParameter: S.optional(S.String).pipe(T.JsonName("invalidParameter")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  },
).pipe(C.withConflictError) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  {
    InvalidParameter: S.optional(S.String).pipe(T.JsonName("invalidParameter")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  },
).pipe(C.withServerError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {
    InvalidParameter: S.optional(S.String).pipe(T.JsonName("invalidParameter")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  },
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  {
    InvalidParameter: S.optional(S.String).pipe(T.JsonName("invalidParameter")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  },
).pipe(C.withServerError) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  {
    InvalidParameter: S.optional(S.String).pipe(T.JsonName("invalidParameter")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  },
).pipe(C.withAuthError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {
    InvalidParameter: S.optional(S.String).pipe(T.JsonName("invalidParameter")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  },
).pipe(C.withThrottlingError) {}

//# Operations
/**
 * Creates or updates the MSK cluster policy specified by the cluster Amazon Resource Name (ARN) in the request.
 */
export const putClusterPolicy: (
  input: PutClusterPolicyRequest,
) => effect.Effect<
  PutClusterPolicyResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutClusterPolicyRequest,
  output: PutClusterPolicyResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
  ],
}));
/**
 * Returns a list of the tags associated with the specified resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | BadRequestException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Returns a list of all the operations that have been performed on the specified MSK cluster.
 */
export const listClusterOperations: {
  (
    input: ListClusterOperationsRequest,
  ): effect.Effect<
    ListClusterOperationsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListClusterOperationsRequest,
  ) => stream.Stream<
    ListClusterOperationsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListClusterOperationsRequest,
  ) => stream.Stream<
    ClusterOperationInfo,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListClusterOperationsRequest,
  output: ListClusterOperationsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ClusterOperationInfoList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Deletes an MSK Configuration.
 */
export const deleteConfiguration: (
  input: DeleteConfigurationRequest,
) => effect.Effect<
  DeleteConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteVpcConnection: (
  input: DeleteVpcConnectionRequest,
) => effect.Effect<
  DeleteVpcConnectionResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeConfiguration: (
  input: DescribeConfigurationRequest,
) => effect.Effect<
  DescribeConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Returns a description of this revision of the configuration.
 */
export const describeConfigurationRevision: (
  input: DescribeConfigurationRevisionRequest,
) => effect.Effect<
  DescribeConfigurationRevisionResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeTopic: (
  input: DescribeTopicRequest,
) => effect.Effect<
  DescribeTopicResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeVpcConnection: (
  input: DescribeVpcConnectionRequest,
) => effect.Effect<
  DescribeVpcConnectionResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Get the MSK cluster policy specified by the Amazon Resource Name (ARN) in the request.
 */
export const getClusterPolicy: (
  input: GetClusterPolicyRequest,
) => effect.Effect<
  GetClusterPolicyResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns a list of all the MSK configurations in this Region.
 */
export const listConfigurationRevisions: {
  (
    input: ListConfigurationRevisionsRequest,
  ): effect.Effect<
    ListConfigurationRevisionsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConfigurationRevisionsRequest,
  ) => stream.Stream<
    ListConfigurationRevisionsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConfigurationRevisionsRequest,
  ) => stream.Stream<
    ConfigurationRevision,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Revisions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Updates the cluster with the configuration that is specified in the request body.
 */
export const updateClusterConfiguration: (
  input: UpdateClusterConfigurationRequest,
) => effect.Effect<
  UpdateClusterConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates an MSK configuration.
 */
export const updateConfiguration: (
  input: UpdateConfigurationRequest,
) => effect.Effect<
  UpdateConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes the MSK cluster specified by the Amazon Resource Name (ARN) in the request.
 */
export const deleteCluster: (
  input: DeleteClusterRequest,
) => effect.Effect<
  DeleteClusterResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Adds tags to the specified MSK resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | BadRequestException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | BadRequestException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Deletes the MSK cluster policy specified by the Amazon Resource Name (ARN) in the request.
 */
export const deleteClusterPolicy: (
  input: DeleteClusterPolicyRequest,
) => effect.Effect<
  DeleteClusterPolicyResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns partition details of this topic on a MSK cluster.
 */
export const describeTopicPartitions: {
  (
    input: DescribeTopicPartitionsRequest,
  ): effect.Effect<
    DescribeTopicPartitionsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeTopicPartitionsRequest,
  ) => stream.Stream<
    DescribeTopicPartitionsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeTopicPartitionsRequest,
  ) => stream.Stream<
    TopicPartitionInfo,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeTopicPartitionsRequest,
  output: DescribeTopicPartitionsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Partitions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a description of the MSK cluster whose Amazon Resource Name (ARN) is specified in the request.
 */
export const describeClusterV2: (
  input: DescribeClusterV2Request,
) => effect.Effect<
  DescribeClusterV2Response,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listNodes: {
  (
    input: ListNodesRequest,
  ): effect.Effect<
    ListNodesResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListNodesRequest,
  ) => stream.Stream<
    ListNodesResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListNodesRequest,
  ) => stream.Stream<
    NodeInfo,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListNodesRequest,
  output: ListNodesResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "NodeInfoList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of all the VPC connections in this Region.
 */
export const listVpcConnections: {
  (
    input: ListVpcConnectionsRequest,
  ): effect.Effect<
    ListVpcConnectionsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListVpcConnectionsRequest,
  ) => stream.Stream<
    ListVpcConnectionsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListVpcConnectionsRequest,
  ) => stream.Stream<
    VpcConnection,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListVpcConnectionsRequest,
  output: ListVpcConnectionsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "VpcConnections",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Updates the EBS storage associated with MSK brokers.
 */
export const updateBrokerStorage: (
  input: UpdateBrokerStorageRequest,
) => effect.Effect<
  UpdateBrokerStorageResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates the number of broker nodes in the cluster.
 */
export const updateBrokerCount: (
  input: UpdateBrokerCountRequest,
) => effect.Effect<
  UpdateBrokerCountResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates the monitoring settings for the cluster. You can use this operation to specify which Apache Kafka metrics you want Amazon MSK to send to Amazon CloudWatch. You can also specify settings for open monitoring with Prometheus.
 */
export const updateMonitoring: (
  input: UpdateMonitoringRequest,
) => effect.Effect<
  UpdateMonitoringResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns empty response.
 */
export const rejectClientVpcConnection: (
  input: RejectClientVpcConnectionRequest,
) => effect.Effect<
  RejectClientVpcConnectionResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectClientVpcConnectionRequest,
  output: RejectClientVpcConnectionResponse,
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
export const listClientVpcConnections: {
  (
    input: ListClientVpcConnectionsRequest,
  ): effect.Effect<
    ListClientVpcConnectionsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListClientVpcConnectionsRequest,
  ) => stream.Stream<
    ListClientVpcConnectionsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListClientVpcConnectionsRequest,
  ) => stream.Stream<
    ClientVpcConnection,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListClientVpcConnectionsRequest,
  output: ListClientVpcConnectionsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ClientVpcConnections",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of all the MSK configurations in this Region.
 */
export const listConfigurations: {
  (
    input: ListConfigurationsRequest,
  ): effect.Effect<
    ListConfigurationsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConfigurationsRequest,
  ) => stream.Stream<
    ListConfigurationsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConfigurationsRequest,
  ) => stream.Stream<
    Configuration,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConfigurationsRequest,
  output: ListConfigurationsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Configurations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of all the MSK clusters in the current Region.
 */
export const listClusters: {
  (
    input: ListClustersRequest,
  ): effect.Effect<
    ListClustersResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListClustersRequest,
  ) => stream.Stream<
    ListClustersResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListClustersRequest,
  ) => stream.Stream<
    ClusterInfo,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListClustersRequest,
  output: ListClustersResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ClusterInfoList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of all the MSK clusters in the current Region.
 */
export const listClustersV2: {
  (
    input: ListClustersV2Request,
  ): effect.Effect<
    ListClustersV2Response,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListClustersV2Request,
  ) => stream.Stream<
    ListClustersV2Response,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListClustersV2Request,
  ) => stream.Stream<
    Cluster,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListClustersV2Request,
  output: ListClustersV2Response,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ClusterInfoList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * A list of brokers that a client application can use to bootstrap. This list doesn't necessarily include all of the brokers in the cluster. The following Python 3.6 example shows how you can use the Amazon Resource Name (ARN) of a cluster to get its bootstrap brokers. If you don't know the ARN of your cluster, you can use the `ListClusters` operation to get the ARNs of all the clusters in this account and Region.
 */
export const getBootstrapBrokers: (
  input: GetBootstrapBrokersRequest,
) => effect.Effect<
  GetBootstrapBrokersResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns a list of Apache Kafka versions.
 */
export const listKafkaVersions: {
  (
    input: ListKafkaVersionsRequest,
  ): effect.Effect<
    ListKafkaVersionsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListKafkaVersionsRequest,
  ) => stream.Stream<
    ListKafkaVersionsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListKafkaVersionsRequest,
  ) => stream.Stream<
    KafkaVersion,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListKafkaVersionsRequest,
  output: ListKafkaVersionsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "KafkaVersions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List topics in a MSK cluster.
 */
export const listTopics: {
  (
    input: ListTopicsRequest,
  ): effect.Effect<
    ListTopicsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTopicsRequest,
  ) => stream.Stream<
    ListTopicsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTopicsRequest,
  ) => stream.Stream<
    TopicInfo,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTopicsRequest,
  output: ListTopicsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Topics",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a description of the cluster operation specified by the ARN.
 */
export const describeClusterOperation: (
  input: DescribeClusterOperationRequest,
) => effect.Effect<
  DescribeClusterOperationResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeClusterOperationRequest,
  output: DescribeClusterOperationResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Updates replication info of a replicator.
 */
export const updateReplicationInfo: (
  input: UpdateReplicationInfoRequest,
) => effect.Effect<
  UpdateReplicationInfoResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates cluster broker volume size (or) sets cluster storage mode to TIERED.
 */
export const updateStorage: (
  input: UpdateStorageRequest,
) => effect.Effect<
  UpdateStorageResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a replicator.
 */
export const deleteReplicator: (
  input: DeleteReplicatorRequest,
) => effect.Effect<
  DeleteReplicatorResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns a list of the Scram Secrets associated with an Amazon MSK cluster.
 */
export const listScramSecrets: {
  (
    input: ListScramSecretsRequest,
  ): effect.Effect<
    ListScramSecretsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListScramSecretsRequest,
  ) => stream.Stream<
    ListScramSecretsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListScramSecretsRequest,
  ) => stream.Stream<
    string,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "SecretArnList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Reboots brokers.
 */
export const rebootBroker: (
  input: RebootBrokerRequest,
) => effect.Effect<
  RebootBrokerResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates EC2 instance type.
 */
export const updateBrokerType: (
  input: UpdateBrokerTypeRequest,
) => effect.Effect<
  UpdateBrokerTypeResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates the Apache Kafka version for the cluster.
 */
export const updateClusterKafkaVersion: (
  input: UpdateClusterKafkaVersionRequest,
) => effect.Effect<
  UpdateClusterKafkaVersionResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Use this resource to update the intelligent rebalancing status of an Amazon MSK Provisioned cluster with Express brokers.
 */
export const updateRebalancing: (
  input: UpdateRebalancingRequest,
) => effect.Effect<
  UpdateRebalancingResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateSecurity: (
  input: UpdateSecurityRequest,
) => effect.Effect<
  UpdateSecurityResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Disassociates one or more Scram Secrets from an Amazon MSK cluster.
 */
export const batchDisassociateScramSecret: (
  input: BatchDisassociateScramSecretRequest,
) => effect.Effect<
  BatchDisassociateScramSecretResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Associates one or more Scram Secrets with an Amazon MSK cluster.
 */
export const batchAssociateScramSecret: (
  input: BatchAssociateScramSecretRequest,
) => effect.Effect<
  BatchAssociateScramSecretResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Describes a replicator.
 */
export const describeReplicator: (
  input: DescribeReplicatorRequest,
) => effect.Effect<
  DescribeReplicatorResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Gets the Apache Kafka versions to which you can update the MSK cluster.
 */
export const getCompatibleKafkaVersions: (
  input: GetCompatibleKafkaVersionsRequest,
) => effect.Effect<
  GetCompatibleKafkaVersionsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Returns a list of all the operations that have been performed on the specified MSK cluster.
 */
export const listClusterOperationsV2: {
  (
    input: ListClusterOperationsV2Request,
  ): effect.Effect<
    ListClusterOperationsV2Response,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListClusterOperationsV2Request,
  ) => stream.Stream<
    ListClusterOperationsV2Response,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListClusterOperationsV2Request,
  ) => stream.Stream<
    ClusterOperationV2Summary,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ClusterOperationInfoList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the replicators.
 */
export const listReplicators: {
  (
    input: ListReplicatorsRequest,
  ): effect.Effect<
    ListReplicatorsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListReplicatorsRequest,
  ) => stream.Stream<
    ListReplicatorsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListReplicatorsRequest,
  ) => stream.Stream<
    ReplicatorSummary,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Replicators",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates a new MSK VPC connection.
 */
export const createVpcConnection: (
  input: CreateVpcConnectionRequest,
) => effect.Effect<
  CreateVpcConnectionResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new MSK configuration.
 */
export const createConfiguration: (
  input: CreateConfigurationRequest,
) => effect.Effect<
  CreateConfigurationResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new MSK cluster.
 */
export const createCluster: (
  input: CreateClusterRequest,
) => effect.Effect<
  CreateClusterResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createClusterV2: (
  input: CreateClusterV2Request,
) => effect.Effect<
  CreateClusterV2Response,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createReplicator: (
  input: CreateReplicatorRequest,
) => effect.Effect<
  CreateReplicatorResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeClusterOperationV2: (
  input: DescribeClusterOperationV2Request,
) => effect.Effect<
  DescribeClusterOperationV2Response,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Returns a description of the MSK cluster whose Amazon Resource Name (ARN) is specified in the request.
 */
export const describeCluster: (
  input: DescribeClusterRequest,
) => effect.Effect<
  DescribeClusterResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateConnectivity: (
  input: UpdateConnectivityRequest,
) => effect.Effect<
  UpdateConnectivityResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
