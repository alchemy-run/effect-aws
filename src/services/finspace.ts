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
const svc = T.AwsApiService({
  sdkId: "finspace",
  serviceShapeName: "AWSHabaneroManagementService",
});
const auth = T.AwsAuthSigv4({ name: "finspace" });
const ver = T.ServiceVersion("2021-03-12");
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
              `https://finspace-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://finspace-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://finspace.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://finspace.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type EnvironmentName = string;
export type Description = string;
export type KmsKeyId = string;
export type DataBundleArn = string;
export type EnvironmentId = string;
export type DatabaseName = string;
export type ClientTokenString = string;
export type ClientToken = string;
export type KxEnvironmentId = string;
export type KxClusterName = string;
export type KxClusterDescription = string;
export type ReleaseLabel = string;
export type InitializationScriptFilePath = string;
export type ExecutionRoleArn = string;
export type AvailabilityZoneId = string;
export type KxDataviewName = string;
export type ChangesetId = string;
export type KxEnvironmentName = string;
export type KmsKeyARN = string;
export type KxScalingGroupName = string;
export type KxHostType = string;
export type IdType = string;
export type KxUserNameString = string;
export type RoleArn = string;
export type KxVolumeName = string;
export type KxClusterNodeIdString = string;
export type KxUserArn = string;
export type PaginationToken = string;
export type ResultLimit = number;
export type MaxResults = number;
export type BoxedInteger = number;
export type FinSpaceTaggableArn = string;
export type TagKey = string;
export type TagValue = string;
export type SamlMetadataDocument = string;
export type Url = string;
export type Urn = string;
export type FederationProviderName = string;
export type EmailId = string | redacted.Redacted<string>;
export type NameString = string;
export type S3Path = string;
export type DbPath = string;
export type VolumeName = string;
export type KxCacheStorageType = string;
export type KxCacheStorageSize = number;
export type NodeCount = number;
export type AutoScalingMetricTarget = number;
export type CooldownTime = number;
export type NodeType = string;
export type VpcIdString = string;
export type SecurityGroupIdString = string;
export type SubnetIdString = string;
export type KxCommandLineArgumentKey = string;
export type KxCommandLineArgumentValue = string;
export type S3Bucket = string;
export type S3Key = string;
export type S3ObjectVersion = string;
export type KxSavedownStorageSize = number;
export type MemoryMib = number;
export type ClusterNodeCount = number;
export type CpuCount = number;
export type KxNAS1Size = number;
export type TransitGatewayID = string;
export type ValidCIDRSpace = string;
export type ValidHostname = string;
export type ValidIPAddress = string;
export type DatabaseArn = string;
export type EnvironmentArn = string;
export type ErrorMessage2 = string;
export type KxClusterStatusReason = string;
export type SignedKxConnectionString = string | redacted.Redacted<string>;
export type NumBytes = number;
export type NumChangesets = number;
export type NumFiles = number;
export type KxDataviewStatusReason = string;
export type EnvironmentErrorMessage = string;
export type StringValueLength1to255 = string;
export type Arn = string;
export type KxVolumeArn = string;
export type KxVolumeStatusReason = string;
export type FederationAttributeKey = string;
export type FederationAttributeValue = string;
export type VersionId = string;
export type RuleNumber = number;
export type Protocol = string;
export type ValidCIDRBlock = string;
export type SmsDomainUrl = string;
export type ErrorMessage = string;
export type Port = number;
export type IcmpTypeOrCode = number;

//# Schemas
export type FederationMode = "FEDERATED" | "LOCAL";
export const FederationMode = S.Literal("FEDERATED", "LOCAL");
export type DataBundleArns = string[];
export const DataBundleArns = S.Array(S.String);
export type KxClusterType = "HDB" | "RDB" | "GATEWAY" | "GP" | "TICKERPLANT";
export const KxClusterType = S.Literal(
  "HDB",
  "RDB",
  "GATEWAY",
  "GP",
  "TICKERPLANT",
);
export type KxAzMode = "SINGLE" | "MULTI";
export const KxAzMode = S.Literal("SINGLE", "MULTI");
export type KxVolumeType = "NAS_1";
export const KxVolumeType = S.Literal("NAS_1");
export type AvailabilityZoneIds = string[];
export const AvailabilityZoneIds = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface CreateKxDatabaseRequest {
  environmentId: string;
  databaseName: string;
  description?: string;
  tags?: { [key: string]: string };
  clientToken: string;
}
export const CreateKxDatabaseRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    databaseName: S.String,
    description: S.optional(S.String),
    tags: S.optional(TagMap),
    clientToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/kx/environments/{environmentId}/databases",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateKxDatabaseRequest",
}) as any as S.Schema<CreateKxDatabaseRequest>;
export interface CreateKxEnvironmentRequest {
  name: string;
  description?: string;
  kmsKeyId: string;
  tags?: { [key: string]: string };
  clientToken?: string;
}
export const CreateKxEnvironmentRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    kmsKeyId: S.String,
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/kx/environments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateKxEnvironmentRequest",
}) as any as S.Schema<CreateKxEnvironmentRequest>;
export interface CreateKxScalingGroupRequest {
  clientToken: string;
  environmentId: string;
  scalingGroupName: string;
  hostType: string;
  availabilityZoneId: string;
  tags?: { [key: string]: string };
}
export const CreateKxScalingGroupRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.String.pipe(T.IdempotencyToken()),
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    scalingGroupName: S.String,
    hostType: S.String,
    availabilityZoneId: S.String,
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/kx/environments/{environmentId}/scalingGroups",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateKxScalingGroupRequest",
}) as any as S.Schema<CreateKxScalingGroupRequest>;
export interface CreateKxUserRequest {
  environmentId: string;
  userName: string;
  iamRole: string;
  tags?: { [key: string]: string };
  clientToken?: string;
}
export const CreateKxUserRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    userName: S.String,
    iamRole: S.String,
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/kx/environments/{environmentId}/users" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateKxUserRequest",
}) as any as S.Schema<CreateKxUserRequest>;
export interface DeleteEnvironmentRequest {
  environmentId: string;
}
export const DeleteEnvironmentRequest = S.suspend(() =>
  S.Struct({ environmentId: S.String.pipe(T.HttpLabel("environmentId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/environment/{environmentId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEnvironmentRequest",
}) as any as S.Schema<DeleteEnvironmentRequest>;
export interface DeleteEnvironmentResponse {}
export const DeleteEnvironmentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEnvironmentResponse",
}) as any as S.Schema<DeleteEnvironmentResponse>;
export interface DeleteKxClusterRequest {
  environmentId: string;
  clusterName: string;
  clientToken?: string;
}
export const DeleteKxClusterRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/kx/environments/{environmentId}/clusters/{clusterName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteKxClusterRequest",
}) as any as S.Schema<DeleteKxClusterRequest>;
export interface DeleteKxClusterResponse {}
export const DeleteKxClusterResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteKxClusterResponse",
}) as any as S.Schema<DeleteKxClusterResponse>;
export interface DeleteKxClusterNodeRequest {
  environmentId: string;
  clusterName: string;
  nodeId: string;
}
export const DeleteKxClusterNodeRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    nodeId: S.String.pipe(T.HttpLabel("nodeId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/kx/environments/{environmentId}/clusters/{clusterName}/nodes/{nodeId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteKxClusterNodeRequest",
}) as any as S.Schema<DeleteKxClusterNodeRequest>;
export interface DeleteKxClusterNodeResponse {}
export const DeleteKxClusterNodeResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteKxClusterNodeResponse",
}) as any as S.Schema<DeleteKxClusterNodeResponse>;
export interface DeleteKxDatabaseRequest {
  environmentId: string;
  databaseName: string;
  clientToken: string;
}
export const DeleteKxDatabaseRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    databaseName: S.String.pipe(T.HttpLabel("databaseName")),
    clientToken: S.String.pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/kx/environments/{environmentId}/databases/{databaseName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteKxDatabaseRequest",
}) as any as S.Schema<DeleteKxDatabaseRequest>;
export interface DeleteKxDatabaseResponse {}
export const DeleteKxDatabaseResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteKxDatabaseResponse",
}) as any as S.Schema<DeleteKxDatabaseResponse>;
export interface DeleteKxDataviewRequest {
  environmentId: string;
  databaseName: string;
  dataviewName: string;
  clientToken: string;
}
export const DeleteKxDataviewRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    databaseName: S.String.pipe(T.HttpLabel("databaseName")),
    dataviewName: S.String.pipe(T.HttpLabel("dataviewName")),
    clientToken: S.String.pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/kx/environments/{environmentId}/databases/{databaseName}/dataviews/{dataviewName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteKxDataviewRequest",
}) as any as S.Schema<DeleteKxDataviewRequest>;
export interface DeleteKxDataviewResponse {}
export const DeleteKxDataviewResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteKxDataviewResponse",
}) as any as S.Schema<DeleteKxDataviewResponse>;
export interface DeleteKxEnvironmentRequest {
  environmentId: string;
  clientToken?: string;
}
export const DeleteKxEnvironmentRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/kx/environments/{environmentId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteKxEnvironmentRequest",
}) as any as S.Schema<DeleteKxEnvironmentRequest>;
export interface DeleteKxEnvironmentResponse {}
export const DeleteKxEnvironmentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteKxEnvironmentResponse",
}) as any as S.Schema<DeleteKxEnvironmentResponse>;
export interface DeleteKxScalingGroupRequest {
  environmentId: string;
  scalingGroupName: string;
  clientToken?: string;
}
export const DeleteKxScalingGroupRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    scalingGroupName: S.String.pipe(T.HttpLabel("scalingGroupName")),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/kx/environments/{environmentId}/scalingGroups/{scalingGroupName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteKxScalingGroupRequest",
}) as any as S.Schema<DeleteKxScalingGroupRequest>;
export interface DeleteKxScalingGroupResponse {}
export const DeleteKxScalingGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteKxScalingGroupResponse",
}) as any as S.Schema<DeleteKxScalingGroupResponse>;
export interface DeleteKxUserRequest {
  userName: string;
  environmentId: string;
  clientToken?: string;
}
export const DeleteKxUserRequest = S.suspend(() =>
  S.Struct({
    userName: S.String.pipe(T.HttpLabel("userName")),
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/kx/environments/{environmentId}/users/{userName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteKxUserRequest",
}) as any as S.Schema<DeleteKxUserRequest>;
export interface DeleteKxUserResponse {}
export const DeleteKxUserResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteKxUserResponse",
}) as any as S.Schema<DeleteKxUserResponse>;
export interface DeleteKxVolumeRequest {
  environmentId: string;
  volumeName: string;
  clientToken?: string;
}
export const DeleteKxVolumeRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    volumeName: S.String.pipe(T.HttpLabel("volumeName")),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/kx/environments/{environmentId}/kxvolumes/{volumeName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteKxVolumeRequest",
}) as any as S.Schema<DeleteKxVolumeRequest>;
export interface DeleteKxVolumeResponse {}
export const DeleteKxVolumeResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteKxVolumeResponse" },
) as any as S.Schema<DeleteKxVolumeResponse>;
export interface GetEnvironmentRequest {
  environmentId: string;
}
export const GetEnvironmentRequest = S.suspend(() =>
  S.Struct({ environmentId: S.String.pipe(T.HttpLabel("environmentId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/environment/{environmentId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEnvironmentRequest",
}) as any as S.Schema<GetEnvironmentRequest>;
export interface GetKxChangesetRequest {
  environmentId: string;
  databaseName: string;
  changesetId: string;
}
export const GetKxChangesetRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    databaseName: S.String.pipe(T.HttpLabel("databaseName")),
    changesetId: S.String.pipe(T.HttpLabel("changesetId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/kx/environments/{environmentId}/databases/{databaseName}/changesets/{changesetId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetKxChangesetRequest",
}) as any as S.Schema<GetKxChangesetRequest>;
export interface GetKxClusterRequest {
  environmentId: string;
  clusterName: string;
}
export const GetKxClusterRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/kx/environments/{environmentId}/clusters/{clusterName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetKxClusterRequest",
}) as any as S.Schema<GetKxClusterRequest>;
export interface GetKxConnectionStringRequest {
  userArn: string;
  environmentId: string;
  clusterName: string;
}
export const GetKxConnectionStringRequest = S.suspend(() =>
  S.Struct({
    userArn: S.String.pipe(T.HttpQuery("userArn")),
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    clusterName: S.String.pipe(T.HttpQuery("clusterName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/kx/environments/{environmentId}/connectionString",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetKxConnectionStringRequest",
}) as any as S.Schema<GetKxConnectionStringRequest>;
export interface GetKxDatabaseRequest {
  environmentId: string;
  databaseName: string;
}
export const GetKxDatabaseRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    databaseName: S.String.pipe(T.HttpLabel("databaseName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/kx/environments/{environmentId}/databases/{databaseName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetKxDatabaseRequest",
}) as any as S.Schema<GetKxDatabaseRequest>;
export interface GetKxDataviewRequest {
  environmentId: string;
  databaseName: string;
  dataviewName: string;
}
export const GetKxDataviewRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    databaseName: S.String.pipe(T.HttpLabel("databaseName")),
    dataviewName: S.String.pipe(T.HttpLabel("dataviewName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/kx/environments/{environmentId}/databases/{databaseName}/dataviews/{dataviewName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetKxDataviewRequest",
}) as any as S.Schema<GetKxDataviewRequest>;
export interface GetKxEnvironmentRequest {
  environmentId: string;
}
export const GetKxEnvironmentRequest = S.suspend(() =>
  S.Struct({ environmentId: S.String.pipe(T.HttpLabel("environmentId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/kx/environments/{environmentId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetKxEnvironmentRequest",
}) as any as S.Schema<GetKxEnvironmentRequest>;
export interface GetKxScalingGroupRequest {
  environmentId: string;
  scalingGroupName: string;
}
export const GetKxScalingGroupRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    scalingGroupName: S.String.pipe(T.HttpLabel("scalingGroupName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/kx/environments/{environmentId}/scalingGroups/{scalingGroupName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetKxScalingGroupRequest",
}) as any as S.Schema<GetKxScalingGroupRequest>;
export interface GetKxUserRequest {
  userName: string;
  environmentId: string;
}
export const GetKxUserRequest = S.suspend(() =>
  S.Struct({
    userName: S.String.pipe(T.HttpLabel("userName")),
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/kx/environments/{environmentId}/users/{userName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetKxUserRequest",
}) as any as S.Schema<GetKxUserRequest>;
export interface GetKxVolumeRequest {
  environmentId: string;
  volumeName: string;
}
export const GetKxVolumeRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    volumeName: S.String.pipe(T.HttpLabel("volumeName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/kx/environments/{environmentId}/kxvolumes/{volumeName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetKxVolumeRequest",
}) as any as S.Schema<GetKxVolumeRequest>;
export interface ListEnvironmentsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListEnvironmentsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/environment" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEnvironmentsRequest",
}) as any as S.Schema<ListEnvironmentsRequest>;
export interface ListKxChangesetsRequest {
  environmentId: string;
  databaseName: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListKxChangesetsRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    databaseName: S.String.pipe(T.HttpLabel("databaseName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/kx/environments/{environmentId}/databases/{databaseName}/changesets",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListKxChangesetsRequest",
}) as any as S.Schema<ListKxChangesetsRequest>;
export interface ListKxClusterNodesRequest {
  environmentId: string;
  clusterName: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListKxClusterNodesRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/kx/environments/{environmentId}/clusters/{clusterName}/nodes",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListKxClusterNodesRequest",
}) as any as S.Schema<ListKxClusterNodesRequest>;
export interface ListKxClustersRequest {
  environmentId: string;
  clusterType?: KxClusterType;
  maxResults?: number;
  nextToken?: string;
}
export const ListKxClustersRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    clusterType: S.optional(KxClusterType).pipe(T.HttpQuery("clusterType")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/kx/environments/{environmentId}/clusters",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListKxClustersRequest",
}) as any as S.Schema<ListKxClustersRequest>;
export interface ListKxDatabasesRequest {
  environmentId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListKxDatabasesRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/kx/environments/{environmentId}/databases",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListKxDatabasesRequest",
}) as any as S.Schema<ListKxDatabasesRequest>;
export interface ListKxDataviewsRequest {
  environmentId: string;
  databaseName: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListKxDataviewsRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    databaseName: S.String.pipe(T.HttpLabel("databaseName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/kx/environments/{environmentId}/databases/{databaseName}/dataviews",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListKxDataviewsRequest",
}) as any as S.Schema<ListKxDataviewsRequest>;
export interface ListKxEnvironmentsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListKxEnvironmentsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/kx/environments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListKxEnvironmentsRequest",
}) as any as S.Schema<ListKxEnvironmentsRequest>;
export interface ListKxScalingGroupsRequest {
  environmentId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListKxScalingGroupsRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/kx/environments/{environmentId}/scalingGroups",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListKxScalingGroupsRequest",
}) as any as S.Schema<ListKxScalingGroupsRequest>;
export interface ListKxUsersRequest {
  environmentId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListKxUsersRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/kx/environments/{environmentId}/users" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListKxUsersRequest",
}) as any as S.Schema<ListKxUsersRequest>;
export interface ListKxVolumesRequest {
  environmentId: string;
  maxResults?: number;
  nextToken?: string;
  volumeType?: KxVolumeType;
}
export const ListKxVolumesRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    volumeType: S.optional(KxVolumeType).pipe(T.HttpQuery("volumeType")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/kx/environments/{environmentId}/kxvolumes",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListKxVolumesRequest",
}) as any as S.Schema<ListKxVolumesRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
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
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string };
}
export const TagResourceRequest = S.suspend(() =>
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
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
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
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type AttributeMap = { [key: string]: string };
export const AttributeMap = S.Record({ key: S.String, value: S.String });
export interface FederationParameters {
  samlMetadataDocument?: string;
  samlMetadataURL?: string;
  applicationCallBackURL?: string;
  federationURN?: string;
  federationProviderName?: string;
  attributeMap?: { [key: string]: string };
}
export const FederationParameters = S.suspend(() =>
  S.Struct({
    samlMetadataDocument: S.optional(S.String),
    samlMetadataURL: S.optional(S.String),
    applicationCallBackURL: S.optional(S.String),
    federationURN: S.optional(S.String),
    federationProviderName: S.optional(S.String),
    attributeMap: S.optional(AttributeMap),
  }),
).annotations({
  identifier: "FederationParameters",
}) as any as S.Schema<FederationParameters>;
export interface UpdateEnvironmentRequest {
  environmentId: string;
  name?: string;
  description?: string;
  federationMode?: FederationMode;
  federationParameters?: FederationParameters;
}
export const UpdateEnvironmentRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    federationMode: S.optional(FederationMode),
    federationParameters: S.optional(FederationParameters),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/environment/{environmentId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEnvironmentRequest",
}) as any as S.Schema<UpdateEnvironmentRequest>;
export interface UpdateKxDatabaseRequest {
  environmentId: string;
  databaseName: string;
  description?: string;
  clientToken: string;
}
export const UpdateKxDatabaseRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    databaseName: S.String.pipe(T.HttpLabel("databaseName")),
    description: S.optional(S.String),
    clientToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/kx/environments/{environmentId}/databases/{databaseName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateKxDatabaseRequest",
}) as any as S.Schema<UpdateKxDatabaseRequest>;
export type SegmentConfigurationDbPathList = string[];
export const SegmentConfigurationDbPathList = S.Array(S.String);
export interface KxDataviewSegmentConfiguration {
  dbPaths: string[];
  volumeName: string;
  onDemand?: boolean;
}
export const KxDataviewSegmentConfiguration = S.suspend(() =>
  S.Struct({
    dbPaths: SegmentConfigurationDbPathList,
    volumeName: S.String,
    onDemand: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "KxDataviewSegmentConfiguration",
}) as any as S.Schema<KxDataviewSegmentConfiguration>;
export type KxDataviewSegmentConfigurationList =
  KxDataviewSegmentConfiguration[];
export const KxDataviewSegmentConfigurationList = S.Array(
  KxDataviewSegmentConfiguration,
);
export interface UpdateKxDataviewRequest {
  environmentId: string;
  databaseName: string;
  dataviewName: string;
  description?: string;
  changesetId?: string;
  segmentConfigurations?: KxDataviewSegmentConfiguration[];
  clientToken: string;
}
export const UpdateKxDataviewRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    databaseName: S.String.pipe(T.HttpLabel("databaseName")),
    dataviewName: S.String.pipe(T.HttpLabel("dataviewName")),
    description: S.optional(S.String),
    changesetId: S.optional(S.String),
    segmentConfigurations: S.optional(KxDataviewSegmentConfigurationList),
    clientToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/kx/environments/{environmentId}/databases/{databaseName}/dataviews/{dataviewName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateKxDataviewRequest",
}) as any as S.Schema<UpdateKxDataviewRequest>;
export interface UpdateKxEnvironmentRequest {
  environmentId: string;
  name?: string;
  description?: string;
  clientToken?: string;
}
export const UpdateKxEnvironmentRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/kx/environments/{environmentId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateKxEnvironmentRequest",
}) as any as S.Schema<UpdateKxEnvironmentRequest>;
export interface UpdateKxUserRequest {
  environmentId: string;
  userName: string;
  iamRole: string;
  clientToken?: string;
}
export const UpdateKxUserRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    userName: S.String.pipe(T.HttpLabel("userName")),
    iamRole: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/kx/environments/{environmentId}/users/{userName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateKxUserRequest",
}) as any as S.Schema<UpdateKxUserRequest>;
export type KxNAS1Type = "SSD_1000" | "SSD_250" | "HDD_12";
export const KxNAS1Type = S.Literal("SSD_1000", "SSD_250", "HDD_12");
export interface KxNAS1Configuration {
  type?: KxNAS1Type;
  size?: number;
}
export const KxNAS1Configuration = S.suspend(() =>
  S.Struct({ type: S.optional(KxNAS1Type), size: S.optional(S.Number) }),
).annotations({
  identifier: "KxNAS1Configuration",
}) as any as S.Schema<KxNAS1Configuration>;
export interface UpdateKxVolumeRequest {
  environmentId: string;
  volumeName: string;
  description?: string;
  clientToken?: string;
  nas1Configuration?: KxNAS1Configuration;
}
export const UpdateKxVolumeRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    volumeName: S.String.pipe(T.HttpLabel("volumeName")),
    description: S.optional(S.String),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    nas1Configuration: S.optional(KxNAS1Configuration),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/kx/environments/{environmentId}/kxvolumes/{volumeName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateKxVolumeRequest",
}) as any as S.Schema<UpdateKxVolumeRequest>;
export type ChangeType = "PUT" | "DELETE";
export const ChangeType = S.Literal("PUT", "DELETE");
export type TickerplantLogVolumes = string[];
export const TickerplantLogVolumes = S.Array(S.String);
export type AutoScalingMetric = "CPU_UTILIZATION_PERCENTAGE";
export const AutoScalingMetric = S.Literal("CPU_UTILIZATION_PERCENTAGE");
export type SecurityGroupIdList = string[];
export const SecurityGroupIdList = S.Array(S.String);
export type SubnetIdList = string[];
export const SubnetIdList = S.Array(S.String);
export type IPAddressType = "IP_V4";
export const IPAddressType = S.Literal("IP_V4");
export type KxSavedownStorageType = "SDS01";
export const KxSavedownStorageType = S.Literal("SDS01");
export type KxClusterCodeDeploymentStrategy =
  | "NO_RESTART"
  | "ROLLING"
  | "FORCE";
export const KxClusterCodeDeploymentStrategy = S.Literal(
  "NO_RESTART",
  "ROLLING",
  "FORCE",
);
export type KxDeploymentStrategy = "NO_RESTART" | "ROLLING";
export const KxDeploymentStrategy = S.Literal("NO_RESTART", "ROLLING");
export interface SuperuserParameters {
  emailAddress: string | redacted.Redacted<string>;
  firstName: string;
  lastName: string;
}
export const SuperuserParameters = S.suspend(() =>
  S.Struct({
    emailAddress: SensitiveString,
    firstName: S.String,
    lastName: S.String,
  }),
).annotations({
  identifier: "SuperuserParameters",
}) as any as S.Schema<SuperuserParameters>;
export interface ChangeRequest {
  changeType: ChangeType;
  s3Path?: string;
  dbPath: string;
}
export const ChangeRequest = S.suspend(() =>
  S.Struct({
    changeType: ChangeType,
    s3Path: S.optional(S.String),
    dbPath: S.String,
  }),
).annotations({
  identifier: "ChangeRequest",
}) as any as S.Schema<ChangeRequest>;
export type ChangeRequests = ChangeRequest[];
export const ChangeRequests = S.Array(ChangeRequest);
export interface TickerplantLogConfiguration {
  tickerplantLogVolumes?: string[];
}
export const TickerplantLogConfiguration = S.suspend(() =>
  S.Struct({ tickerplantLogVolumes: S.optional(TickerplantLogVolumes) }),
).annotations({
  identifier: "TickerplantLogConfiguration",
}) as any as S.Schema<TickerplantLogConfiguration>;
export interface KxCacheStorageConfiguration {
  type: string;
  size: number;
}
export const KxCacheStorageConfiguration = S.suspend(() =>
  S.Struct({ type: S.String, size: S.Number }),
).annotations({
  identifier: "KxCacheStorageConfiguration",
}) as any as S.Schema<KxCacheStorageConfiguration>;
export type KxCacheStorageConfigurations = KxCacheStorageConfiguration[];
export const KxCacheStorageConfigurations = S.Array(
  KxCacheStorageConfiguration,
);
export interface AutoScalingConfiguration {
  minNodeCount?: number;
  maxNodeCount?: number;
  autoScalingMetric?: AutoScalingMetric;
  metricTarget?: number;
  scaleInCooldownSeconds?: number;
  scaleOutCooldownSeconds?: number;
}
export const AutoScalingConfiguration = S.suspend(() =>
  S.Struct({
    minNodeCount: S.optional(S.Number),
    maxNodeCount: S.optional(S.Number),
    autoScalingMetric: S.optional(AutoScalingMetric),
    metricTarget: S.optional(S.Number),
    scaleInCooldownSeconds: S.optional(S.Number),
    scaleOutCooldownSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "AutoScalingConfiguration",
}) as any as S.Schema<AutoScalingConfiguration>;
export interface CapacityConfiguration {
  nodeType?: string;
  nodeCount?: number;
}
export const CapacityConfiguration = S.suspend(() =>
  S.Struct({ nodeType: S.optional(S.String), nodeCount: S.optional(S.Number) }),
).annotations({
  identifier: "CapacityConfiguration",
}) as any as S.Schema<CapacityConfiguration>;
export interface VpcConfiguration {
  vpcId?: string;
  securityGroupIds?: string[];
  subnetIds?: string[];
  ipAddressType?: IPAddressType;
}
export const VpcConfiguration = S.suspend(() =>
  S.Struct({
    vpcId: S.optional(S.String),
    securityGroupIds: S.optional(SecurityGroupIdList),
    subnetIds: S.optional(SubnetIdList),
    ipAddressType: S.optional(IPAddressType),
  }),
).annotations({
  identifier: "VpcConfiguration",
}) as any as S.Schema<VpcConfiguration>;
export interface KxCommandLineArgument {
  key?: string;
  value?: string;
}
export const KxCommandLineArgument = S.suspend(() =>
  S.Struct({ key: S.optional(S.String), value: S.optional(S.String) }),
).annotations({
  identifier: "KxCommandLineArgument",
}) as any as S.Schema<KxCommandLineArgument>;
export type KxCommandLineArguments = KxCommandLineArgument[];
export const KxCommandLineArguments = S.Array(KxCommandLineArgument);
export interface CodeConfiguration {
  s3Bucket?: string;
  s3Key?: string;
  s3ObjectVersion?: string;
}
export const CodeConfiguration = S.suspend(() =>
  S.Struct({
    s3Bucket: S.optional(S.String),
    s3Key: S.optional(S.String),
    s3ObjectVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "CodeConfiguration",
}) as any as S.Schema<CodeConfiguration>;
export interface KxSavedownStorageConfiguration {
  type?: KxSavedownStorageType;
  size?: number;
  volumeName?: string;
}
export const KxSavedownStorageConfiguration = S.suspend(() =>
  S.Struct({
    type: S.optional(KxSavedownStorageType),
    size: S.optional(S.Number),
    volumeName: S.optional(S.String),
  }),
).annotations({
  identifier: "KxSavedownStorageConfiguration",
}) as any as S.Schema<KxSavedownStorageConfiguration>;
export interface KxScalingGroupConfiguration {
  scalingGroupName: string;
  memoryLimit?: number;
  memoryReservation: number;
  nodeCount: number;
  cpu?: number;
}
export const KxScalingGroupConfiguration = S.suspend(() =>
  S.Struct({
    scalingGroupName: S.String,
    memoryLimit: S.optional(S.Number),
    memoryReservation: S.Number,
    nodeCount: S.Number,
    cpu: S.optional(S.Number),
  }),
).annotations({
  identifier: "KxScalingGroupConfiguration",
}) as any as S.Schema<KxScalingGroupConfiguration>;
export type EnvironmentStatus =
  | "CREATE_REQUESTED"
  | "CREATING"
  | "CREATED"
  | "DELETE_REQUESTED"
  | "DELETING"
  | "DELETED"
  | "FAILED_CREATION"
  | "RETRY_DELETION"
  | "FAILED_DELETION"
  | "UPDATE_NETWORK_REQUESTED"
  | "UPDATING_NETWORK"
  | "FAILED_UPDATING_NETWORK"
  | "SUSPENDED";
export const EnvironmentStatus = S.Literal(
  "CREATE_REQUESTED",
  "CREATING",
  "CREATED",
  "DELETE_REQUESTED",
  "DELETING",
  "DELETED",
  "FAILED_CREATION",
  "RETRY_DELETION",
  "FAILED_DELETION",
  "UPDATE_NETWORK_REQUESTED",
  "UPDATING_NETWORK",
  "FAILED_UPDATING_NETWORK",
  "SUSPENDED",
);
export type KxScalingGroupStatus =
  | "CREATING"
  | "CREATE_FAILED"
  | "ACTIVE"
  | "DELETING"
  | "DELETED"
  | "DELETE_FAILED";
export const KxScalingGroupStatus = S.Literal(
  "CREATING",
  "CREATE_FAILED",
  "ACTIVE",
  "DELETING",
  "DELETED",
  "DELETE_FAILED",
);
export type ChangesetStatus = "PENDING" | "PROCESSING" | "FAILED" | "COMPLETED";
export const ChangesetStatus = S.Literal(
  "PENDING",
  "PROCESSING",
  "FAILED",
  "COMPLETED",
);
export type KxClusterStatus =
  | "PENDING"
  | "CREATING"
  | "CREATE_FAILED"
  | "RUNNING"
  | "UPDATING"
  | "DELETING"
  | "DELETED"
  | "DELETE_FAILED";
export const KxClusterStatus = S.Literal(
  "PENDING",
  "CREATING",
  "CREATE_FAILED",
  "RUNNING",
  "UPDATING",
  "DELETING",
  "DELETED",
  "DELETE_FAILED",
);
export type KxDataviewStatus =
  | "CREATING"
  | "ACTIVE"
  | "UPDATING"
  | "FAILED"
  | "DELETING";
export const KxDataviewStatus = S.Literal(
  "CREATING",
  "ACTIVE",
  "UPDATING",
  "FAILED",
  "DELETING",
);
export type TgwStatus =
  | "NONE"
  | "UPDATE_REQUESTED"
  | "UPDATING"
  | "FAILED_UPDATE"
  | "SUCCESSFULLY_UPDATED";
export const TgwStatus = S.Literal(
  "NONE",
  "UPDATE_REQUESTED",
  "UPDATING",
  "FAILED_UPDATE",
  "SUCCESSFULLY_UPDATED",
);
export type DnsStatus =
  | "NONE"
  | "UPDATE_REQUESTED"
  | "UPDATING"
  | "FAILED_UPDATE"
  | "SUCCESSFULLY_UPDATED";
export const DnsStatus = S.Literal(
  "NONE",
  "UPDATE_REQUESTED",
  "UPDATING",
  "FAILED_UPDATE",
  "SUCCESSFULLY_UPDATED",
);
export type KxClusterNameList = string[];
export const KxClusterNameList = S.Array(S.String);
export type KxVolumeStatus =
  | "CREATING"
  | "CREATE_FAILED"
  | "ACTIVE"
  | "UPDATING"
  | "UPDATED"
  | "UPDATE_FAILED"
  | "DELETING"
  | "DELETED"
  | "DELETE_FAILED";
export const KxVolumeStatus = S.Literal(
  "CREATING",
  "CREATE_FAILED",
  "ACTIVE",
  "UPDATING",
  "UPDATED",
  "UPDATE_FAILED",
  "DELETING",
  "DELETED",
  "DELETE_FAILED",
);
export interface Environment {
  name?: string;
  environmentId?: string;
  awsAccountId?: string;
  status?: EnvironmentStatus;
  environmentUrl?: string;
  description?: string;
  environmentArn?: string;
  sageMakerStudioDomainUrl?: string;
  kmsKeyId?: string;
  dedicatedServiceAccountId?: string;
  federationMode?: FederationMode;
  federationParameters?: FederationParameters;
}
export const Environment = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    environmentId: S.optional(S.String),
    awsAccountId: S.optional(S.String),
    status: S.optional(EnvironmentStatus),
    environmentUrl: S.optional(S.String),
    description: S.optional(S.String),
    environmentArn: S.optional(S.String),
    sageMakerStudioDomainUrl: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    dedicatedServiceAccountId: S.optional(S.String),
    federationMode: S.optional(FederationMode),
    federationParameters: S.optional(FederationParameters),
  }),
).annotations({ identifier: "Environment" }) as any as S.Schema<Environment>;
export type EnvironmentList = Environment[];
export const EnvironmentList = S.Array(Environment);
export interface KxClusterCodeDeploymentConfiguration {
  deploymentStrategy: KxClusterCodeDeploymentStrategy;
}
export const KxClusterCodeDeploymentConfiguration = S.suspend(() =>
  S.Struct({ deploymentStrategy: KxClusterCodeDeploymentStrategy }),
).annotations({
  identifier: "KxClusterCodeDeploymentConfiguration",
}) as any as S.Schema<KxClusterCodeDeploymentConfiguration>;
export interface KxDeploymentConfiguration {
  deploymentStrategy: KxDeploymentStrategy;
}
export const KxDeploymentConfiguration = S.suspend(() =>
  S.Struct({ deploymentStrategy: KxDeploymentStrategy }),
).annotations({
  identifier: "KxDeploymentConfiguration",
}) as any as S.Schema<KxDeploymentConfiguration>;
export interface CustomDNSServer {
  customDNSServerName: string;
  customDNSServerIP: string;
}
export const CustomDNSServer = S.suspend(() =>
  S.Struct({ customDNSServerName: S.String, customDNSServerIP: S.String }),
).annotations({
  identifier: "CustomDNSServer",
}) as any as S.Schema<CustomDNSServer>;
export type CustomDNSConfiguration = CustomDNSServer[];
export const CustomDNSConfiguration = S.Array(CustomDNSServer);
export type DbPaths = string[];
export const DbPaths = S.Array(S.String);
export type RuleAction = "allow" | "deny";
export const RuleAction = S.Literal("allow", "deny");
export interface CreateKxChangesetRequest {
  environmentId: string;
  databaseName: string;
  changeRequests: ChangeRequest[];
  clientToken: string;
}
export const CreateKxChangesetRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    databaseName: S.String.pipe(T.HttpLabel("databaseName")),
    changeRequests: ChangeRequests,
    clientToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/kx/environments/{environmentId}/databases/{databaseName}/changesets",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateKxChangesetRequest",
}) as any as S.Schema<CreateKxChangesetRequest>;
export interface CreateKxDatabaseResponse {
  databaseName?: string;
  databaseArn?: string;
  environmentId?: string;
  description?: string;
  createdTimestamp?: Date;
  lastModifiedTimestamp?: Date;
}
export const CreateKxDatabaseResponse = S.suspend(() =>
  S.Struct({
    databaseName: S.optional(S.String),
    databaseArn: S.optional(S.String),
    environmentId: S.optional(S.String),
    description: S.optional(S.String),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "CreateKxDatabaseResponse",
}) as any as S.Schema<CreateKxDatabaseResponse>;
export interface CreateKxDataviewRequest {
  environmentId: string;
  databaseName: string;
  dataviewName: string;
  azMode: KxAzMode;
  availabilityZoneId?: string;
  changesetId?: string;
  segmentConfigurations?: KxDataviewSegmentConfiguration[];
  autoUpdate?: boolean;
  readWrite?: boolean;
  description?: string;
  tags?: { [key: string]: string };
  clientToken: string;
}
export const CreateKxDataviewRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    databaseName: S.String.pipe(T.HttpLabel("databaseName")),
    dataviewName: S.String,
    azMode: KxAzMode,
    availabilityZoneId: S.optional(S.String),
    changesetId: S.optional(S.String),
    segmentConfigurations: S.optional(KxDataviewSegmentConfigurationList),
    autoUpdate: S.optional(S.Boolean),
    readWrite: S.optional(S.Boolean),
    description: S.optional(S.String),
    tags: S.optional(TagMap),
    clientToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/kx/environments/{environmentId}/databases/{databaseName}/dataviews",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateKxDataviewRequest",
}) as any as S.Schema<CreateKxDataviewRequest>;
export interface CreateKxEnvironmentResponse {
  name?: string;
  status?: EnvironmentStatus;
  environmentId?: string;
  description?: string;
  environmentArn?: string;
  kmsKeyId?: string;
  creationTimestamp?: Date;
}
export const CreateKxEnvironmentResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    status: S.optional(EnvironmentStatus),
    environmentId: S.optional(S.String),
    description: S.optional(S.String),
    environmentArn: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    creationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "CreateKxEnvironmentResponse",
}) as any as S.Schema<CreateKxEnvironmentResponse>;
export interface CreateKxScalingGroupResponse {
  environmentId?: string;
  scalingGroupName?: string;
  hostType?: string;
  availabilityZoneId?: string;
  status?: KxScalingGroupStatus;
  lastModifiedTimestamp?: Date;
  createdTimestamp?: Date;
}
export const CreateKxScalingGroupResponse = S.suspend(() =>
  S.Struct({
    environmentId: S.optional(S.String),
    scalingGroupName: S.optional(S.String),
    hostType: S.optional(S.String),
    availabilityZoneId: S.optional(S.String),
    status: S.optional(KxScalingGroupStatus),
    lastModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "CreateKxScalingGroupResponse",
}) as any as S.Schema<CreateKxScalingGroupResponse>;
export interface CreateKxUserResponse {
  userName?: string;
  userArn?: string;
  environmentId?: string;
  iamRole?: string;
}
export const CreateKxUserResponse = S.suspend(() =>
  S.Struct({
    userName: S.optional(S.String),
    userArn: S.optional(S.String),
    environmentId: S.optional(S.String),
    iamRole: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateKxUserResponse",
}) as any as S.Schema<CreateKxUserResponse>;
export interface CreateKxVolumeRequest {
  clientToken?: string;
  environmentId: string;
  volumeType: KxVolumeType;
  volumeName: string;
  description?: string;
  nas1Configuration?: KxNAS1Configuration;
  azMode: KxAzMode;
  availabilityZoneIds: string[];
  tags?: { [key: string]: string };
}
export const CreateKxVolumeRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    volumeType: KxVolumeType,
    volumeName: S.String,
    description: S.optional(S.String),
    nas1Configuration: S.optional(KxNAS1Configuration),
    azMode: KxAzMode,
    availabilityZoneIds: AvailabilityZoneIds,
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/kx/environments/{environmentId}/kxvolumes",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateKxVolumeRequest",
}) as any as S.Schema<CreateKxVolumeRequest>;
export interface GetKxConnectionStringResponse {
  signedConnectionString?: string | redacted.Redacted<string>;
}
export const GetKxConnectionStringResponse = S.suspend(() =>
  S.Struct({ signedConnectionString: S.optional(SensitiveString) }),
).annotations({
  identifier: "GetKxConnectionStringResponse",
}) as any as S.Schema<GetKxConnectionStringResponse>;
export interface GetKxDatabaseResponse {
  databaseName?: string;
  databaseArn?: string;
  environmentId?: string;
  description?: string;
  createdTimestamp?: Date;
  lastModifiedTimestamp?: Date;
  lastCompletedChangesetId?: string;
  numBytes?: number;
  numChangesets?: number;
  numFiles?: number;
}
export const GetKxDatabaseResponse = S.suspend(() =>
  S.Struct({
    databaseName: S.optional(S.String),
    databaseArn: S.optional(S.String),
    environmentId: S.optional(S.String),
    description: S.optional(S.String),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastCompletedChangesetId: S.optional(S.String),
    numBytes: S.optional(S.Number),
    numChangesets: S.optional(S.Number),
    numFiles: S.optional(S.Number),
  }),
).annotations({
  identifier: "GetKxDatabaseResponse",
}) as any as S.Schema<GetKxDatabaseResponse>;
export interface PortRange {
  from: number;
  to: number;
}
export const PortRange = S.suspend(() =>
  S.Struct({ from: S.Number, to: S.Number }),
).annotations({ identifier: "PortRange" }) as any as S.Schema<PortRange>;
export interface IcmpTypeCode {
  type: number;
  code: number;
}
export const IcmpTypeCode = S.suspend(() =>
  S.Struct({ type: S.Number, code: S.Number }),
).annotations({ identifier: "IcmpTypeCode" }) as any as S.Schema<IcmpTypeCode>;
export interface NetworkACLEntry {
  ruleNumber: number;
  protocol: string;
  ruleAction: RuleAction;
  portRange?: PortRange;
  icmpTypeCode?: IcmpTypeCode;
  cidrBlock: string;
}
export const NetworkACLEntry = S.suspend(() =>
  S.Struct({
    ruleNumber: S.Number,
    protocol: S.String,
    ruleAction: RuleAction,
    portRange: S.optional(PortRange),
    icmpTypeCode: S.optional(IcmpTypeCode),
    cidrBlock: S.String,
  }),
).annotations({
  identifier: "NetworkACLEntry",
}) as any as S.Schema<NetworkACLEntry>;
export type NetworkACLConfiguration = NetworkACLEntry[];
export const NetworkACLConfiguration = S.Array(NetworkACLEntry);
export interface TransitGatewayConfiguration {
  transitGatewayID: string;
  routableCIDRSpace: string;
  attachmentNetworkAclConfiguration?: NetworkACLEntry[];
}
export const TransitGatewayConfiguration = S.suspend(() =>
  S.Struct({
    transitGatewayID: S.String,
    routableCIDRSpace: S.String,
    attachmentNetworkAclConfiguration: S.optional(NetworkACLConfiguration),
  }),
).annotations({
  identifier: "TransitGatewayConfiguration",
}) as any as S.Schema<TransitGatewayConfiguration>;
export interface GetKxEnvironmentResponse {
  name?: string;
  environmentId?: string;
  awsAccountId?: string;
  status?: EnvironmentStatus;
  tgwStatus?: TgwStatus;
  dnsStatus?: DnsStatus;
  errorMessage?: string;
  description?: string;
  environmentArn?: string;
  kmsKeyId?: string;
  dedicatedServiceAccountId?: string;
  transitGatewayConfiguration?: TransitGatewayConfiguration;
  customDNSConfiguration?: CustomDNSServer[];
  creationTimestamp?: Date;
  updateTimestamp?: Date;
  availabilityZoneIds?: string[];
  certificateAuthorityArn?: string;
}
export const GetKxEnvironmentResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    environmentId: S.optional(S.String),
    awsAccountId: S.optional(S.String),
    status: S.optional(EnvironmentStatus),
    tgwStatus: S.optional(TgwStatus),
    dnsStatus: S.optional(DnsStatus),
    errorMessage: S.optional(S.String),
    description: S.optional(S.String),
    environmentArn: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    dedicatedServiceAccountId: S.optional(S.String),
    transitGatewayConfiguration: S.optional(TransitGatewayConfiguration),
    customDNSConfiguration: S.optional(CustomDNSConfiguration),
    creationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    updateTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    availabilityZoneIds: S.optional(AvailabilityZoneIds),
    certificateAuthorityArn: S.optional(S.String),
  }),
).annotations({
  identifier: "GetKxEnvironmentResponse",
}) as any as S.Schema<GetKxEnvironmentResponse>;
export interface GetKxScalingGroupResponse {
  scalingGroupName?: string;
  scalingGroupArn?: string;
  hostType?: string;
  clusters?: string[];
  availabilityZoneId?: string;
  status?: KxScalingGroupStatus;
  statusReason?: string;
  lastModifiedTimestamp?: Date;
  createdTimestamp?: Date;
}
export const GetKxScalingGroupResponse = S.suspend(() =>
  S.Struct({
    scalingGroupName: S.optional(S.String),
    scalingGroupArn: S.optional(S.String),
    hostType: S.optional(S.String),
    clusters: S.optional(KxClusterNameList),
    availabilityZoneId: S.optional(S.String),
    status: S.optional(KxScalingGroupStatus),
    statusReason: S.optional(S.String),
    lastModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "GetKxScalingGroupResponse",
}) as any as S.Schema<GetKxScalingGroupResponse>;
export interface GetKxUserResponse {
  userName?: string;
  userArn?: string;
  environmentId?: string;
  iamRole?: string;
}
export const GetKxUserResponse = S.suspend(() =>
  S.Struct({
    userName: S.optional(S.String),
    userArn: S.optional(S.String),
    environmentId: S.optional(S.String),
    iamRole: S.optional(S.String),
  }),
).annotations({
  identifier: "GetKxUserResponse",
}) as any as S.Schema<GetKxUserResponse>;
export interface ListEnvironmentsResponse {
  environments?: Environment[];
  nextToken?: string;
}
export const ListEnvironmentsResponse = S.suspend(() =>
  S.Struct({
    environments: S.optional(EnvironmentList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEnvironmentsResponse",
}) as any as S.Schema<ListEnvironmentsResponse>;
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface UpdateEnvironmentResponse {
  environment?: Environment;
}
export const UpdateEnvironmentResponse = S.suspend(() =>
  S.Struct({ environment: S.optional(Environment) }),
).annotations({
  identifier: "UpdateEnvironmentResponse",
}) as any as S.Schema<UpdateEnvironmentResponse>;
export interface UpdateKxClusterCodeConfigurationRequest {
  environmentId: string;
  clusterName: string;
  clientToken?: string;
  code: CodeConfiguration;
  initializationScript?: string;
  commandLineArguments?: KxCommandLineArgument[];
  deploymentConfiguration?: KxClusterCodeDeploymentConfiguration;
}
export const UpdateKxClusterCodeConfigurationRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    code: CodeConfiguration,
    initializationScript: S.optional(S.String),
    commandLineArguments: S.optional(KxCommandLineArguments),
    deploymentConfiguration: S.optional(KxClusterCodeDeploymentConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/kx/environments/{environmentId}/clusters/{clusterName}/configuration/code",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateKxClusterCodeConfigurationRequest",
}) as any as S.Schema<UpdateKxClusterCodeConfigurationRequest>;
export interface UpdateKxClusterCodeConfigurationResponse {}
export const UpdateKxClusterCodeConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateKxClusterCodeConfigurationResponse",
}) as any as S.Schema<UpdateKxClusterCodeConfigurationResponse>;
export interface KxDatabaseCacheConfiguration {
  cacheType: string;
  dbPaths: string[];
  dataviewName?: string;
}
export const KxDatabaseCacheConfiguration = S.suspend(() =>
  S.Struct({
    cacheType: S.String,
    dbPaths: DbPaths,
    dataviewName: S.optional(S.String),
  }),
).annotations({
  identifier: "KxDatabaseCacheConfiguration",
}) as any as S.Schema<KxDatabaseCacheConfiguration>;
export type KxDatabaseCacheConfigurations = KxDatabaseCacheConfiguration[];
export const KxDatabaseCacheConfigurations = S.Array(
  KxDatabaseCacheConfiguration,
);
export interface KxDataviewConfiguration {
  dataviewName?: string;
  dataviewVersionId?: string;
  changesetId?: string;
  segmentConfigurations?: KxDataviewSegmentConfiguration[];
}
export const KxDataviewConfiguration = S.suspend(() =>
  S.Struct({
    dataviewName: S.optional(S.String),
    dataviewVersionId: S.optional(S.String),
    changesetId: S.optional(S.String),
    segmentConfigurations: S.optional(KxDataviewSegmentConfigurationList),
  }),
).annotations({
  identifier: "KxDataviewConfiguration",
}) as any as S.Schema<KxDataviewConfiguration>;
export interface KxDatabaseConfiguration {
  databaseName: string;
  cacheConfigurations?: KxDatabaseCacheConfiguration[];
  changesetId?: string;
  dataviewName?: string;
  dataviewConfiguration?: KxDataviewConfiguration;
}
export const KxDatabaseConfiguration = S.suspend(() =>
  S.Struct({
    databaseName: S.String,
    cacheConfigurations: S.optional(KxDatabaseCacheConfigurations),
    changesetId: S.optional(S.String),
    dataviewName: S.optional(S.String),
    dataviewConfiguration: S.optional(KxDataviewConfiguration),
  }),
).annotations({
  identifier: "KxDatabaseConfiguration",
}) as any as S.Schema<KxDatabaseConfiguration>;
export type KxDatabaseConfigurations = KxDatabaseConfiguration[];
export const KxDatabaseConfigurations = S.Array(KxDatabaseConfiguration);
export interface UpdateKxClusterDatabasesRequest {
  environmentId: string;
  clusterName: string;
  clientToken?: string;
  databases: KxDatabaseConfiguration[];
  deploymentConfiguration?: KxDeploymentConfiguration;
}
export const UpdateKxClusterDatabasesRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    databases: KxDatabaseConfigurations,
    deploymentConfiguration: S.optional(KxDeploymentConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/kx/environments/{environmentId}/clusters/{clusterName}/configuration/databases",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateKxClusterDatabasesRequest",
}) as any as S.Schema<UpdateKxClusterDatabasesRequest>;
export interface UpdateKxClusterDatabasesResponse {}
export const UpdateKxClusterDatabasesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateKxClusterDatabasesResponse",
}) as any as S.Schema<UpdateKxClusterDatabasesResponse>;
export interface UpdateKxDatabaseResponse {
  databaseName?: string;
  environmentId?: string;
  description?: string;
  lastModifiedTimestamp?: Date;
}
export const UpdateKxDatabaseResponse = S.suspend(() =>
  S.Struct({
    databaseName: S.optional(S.String),
    environmentId: S.optional(S.String),
    description: S.optional(S.String),
    lastModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "UpdateKxDatabaseResponse",
}) as any as S.Schema<UpdateKxDatabaseResponse>;
export type AttachedClusterList = string[];
export const AttachedClusterList = S.Array(S.String);
export interface KxDataviewActiveVersion {
  changesetId?: string;
  segmentConfigurations?: KxDataviewSegmentConfiguration[];
  attachedClusters?: string[];
  createdTimestamp?: Date;
  versionId?: string;
}
export const KxDataviewActiveVersion = S.suspend(() =>
  S.Struct({
    changesetId: S.optional(S.String),
    segmentConfigurations: S.optional(KxDataviewSegmentConfigurationList),
    attachedClusters: S.optional(AttachedClusterList),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    versionId: S.optional(S.String),
  }),
).annotations({
  identifier: "KxDataviewActiveVersion",
}) as any as S.Schema<KxDataviewActiveVersion>;
export type KxDataviewActiveVersionList = KxDataviewActiveVersion[];
export const KxDataviewActiveVersionList = S.Array(KxDataviewActiveVersion);
export interface UpdateKxDataviewResponse {
  environmentId?: string;
  databaseName?: string;
  dataviewName?: string;
  azMode?: KxAzMode;
  availabilityZoneId?: string;
  changesetId?: string;
  segmentConfigurations?: KxDataviewSegmentConfiguration[];
  activeVersions?: KxDataviewActiveVersion[];
  status?: KxDataviewStatus;
  autoUpdate?: boolean;
  readWrite?: boolean;
  description?: string;
  createdTimestamp?: Date;
  lastModifiedTimestamp?: Date;
}
export const UpdateKxDataviewResponse = S.suspend(() =>
  S.Struct({
    environmentId: S.optional(S.String),
    databaseName: S.optional(S.String),
    dataviewName: S.optional(S.String),
    azMode: S.optional(KxAzMode),
    availabilityZoneId: S.optional(S.String),
    changesetId: S.optional(S.String),
    segmentConfigurations: S.optional(KxDataviewSegmentConfigurationList),
    activeVersions: S.optional(KxDataviewActiveVersionList),
    status: S.optional(KxDataviewStatus),
    autoUpdate: S.optional(S.Boolean),
    readWrite: S.optional(S.Boolean),
    description: S.optional(S.String),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "UpdateKxDataviewResponse",
}) as any as S.Schema<UpdateKxDataviewResponse>;
export interface UpdateKxEnvironmentResponse {
  name?: string;
  environmentId?: string;
  awsAccountId?: string;
  status?: EnvironmentStatus;
  tgwStatus?: TgwStatus;
  dnsStatus?: DnsStatus;
  errorMessage?: string;
  description?: string;
  environmentArn?: string;
  kmsKeyId?: string;
  dedicatedServiceAccountId?: string;
  transitGatewayConfiguration?: TransitGatewayConfiguration;
  customDNSConfiguration?: CustomDNSServer[];
  creationTimestamp?: Date;
  updateTimestamp?: Date;
  availabilityZoneIds?: string[];
}
export const UpdateKxEnvironmentResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    environmentId: S.optional(S.String),
    awsAccountId: S.optional(S.String),
    status: S.optional(EnvironmentStatus),
    tgwStatus: S.optional(TgwStatus),
    dnsStatus: S.optional(DnsStatus),
    errorMessage: S.optional(S.String),
    description: S.optional(S.String),
    environmentArn: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    dedicatedServiceAccountId: S.optional(S.String),
    transitGatewayConfiguration: S.optional(TransitGatewayConfiguration),
    customDNSConfiguration: S.optional(CustomDNSConfiguration),
    creationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    updateTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    availabilityZoneIds: S.optional(AvailabilityZoneIds),
  }),
).annotations({
  identifier: "UpdateKxEnvironmentResponse",
}) as any as S.Schema<UpdateKxEnvironmentResponse>;
export interface UpdateKxUserResponse {
  userName?: string;
  userArn?: string;
  environmentId?: string;
  iamRole?: string;
}
export const UpdateKxUserResponse = S.suspend(() =>
  S.Struct({
    userName: S.optional(S.String),
    userArn: S.optional(S.String),
    environmentId: S.optional(S.String),
    iamRole: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateKxUserResponse",
}) as any as S.Schema<UpdateKxUserResponse>;
export interface KxAttachedCluster {
  clusterName?: string;
  clusterType?: KxClusterType;
  clusterStatus?: KxClusterStatus;
}
export const KxAttachedCluster = S.suspend(() =>
  S.Struct({
    clusterName: S.optional(S.String),
    clusterType: S.optional(KxClusterType),
    clusterStatus: S.optional(KxClusterStatus),
  }),
).annotations({
  identifier: "KxAttachedCluster",
}) as any as S.Schema<KxAttachedCluster>;
export type KxAttachedClusters = KxAttachedCluster[];
export const KxAttachedClusters = S.Array(KxAttachedCluster);
export interface UpdateKxVolumeResponse {
  environmentId?: string;
  volumeName?: string;
  volumeType?: KxVolumeType;
  volumeArn?: string;
  nas1Configuration?: KxNAS1Configuration;
  status?: KxVolumeStatus;
  description?: string;
  statusReason?: string;
  createdTimestamp?: Date;
  azMode?: KxAzMode;
  availabilityZoneIds?: string[];
  lastModifiedTimestamp?: Date;
  attachedClusters?: KxAttachedCluster[];
}
export const UpdateKxVolumeResponse = S.suspend(() =>
  S.Struct({
    environmentId: S.optional(S.String),
    volumeName: S.optional(S.String),
    volumeType: S.optional(KxVolumeType),
    volumeArn: S.optional(S.String),
    nas1Configuration: S.optional(KxNAS1Configuration),
    status: S.optional(KxVolumeStatus),
    description: S.optional(S.String),
    statusReason: S.optional(S.String),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    azMode: S.optional(KxAzMode),
    availabilityZoneIds: S.optional(AvailabilityZoneIds),
    lastModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    attachedClusters: S.optional(KxAttachedClusters),
  }),
).annotations({
  identifier: "UpdateKxVolumeResponse",
}) as any as S.Schema<UpdateKxVolumeResponse>;
export type ErrorDetails =
  | "The inputs to this request are invalid."
  | "Service limits have been exceeded."
  | "Missing required permission to perform this request."
  | "One or more inputs to this request were not found."
  | "The system temporarily lacks sufficient resources to process the request."
  | "An internal error has occurred."
  | "Cancelled"
  | "A user recoverable error has occurred";
export const ErrorDetails = S.Literal(
  "The inputs to this request are invalid.",
  "Service limits have been exceeded.",
  "Missing required permission to perform this request.",
  "One or more inputs to this request were not found.",
  "The system temporarily lacks sufficient resources to process the request.",
  "An internal error has occurred.",
  "Cancelled",
  "A user recoverable error has occurred",
);
export type VolumeType = "NAS_1";
export const VolumeType = S.Literal("NAS_1");
export type KxNodeStatus = "RUNNING" | "PROVISIONING";
export const KxNodeStatus = S.Literal("RUNNING", "PROVISIONING");
export interface ErrorInfo {
  errorMessage?: string;
  errorType?: ErrorDetails;
}
export const ErrorInfo = S.suspend(() =>
  S.Struct({
    errorMessage: S.optional(S.String),
    errorType: S.optional(ErrorDetails),
  }),
).annotations({ identifier: "ErrorInfo" }) as any as S.Schema<ErrorInfo>;
export interface Volume {
  volumeName?: string;
  volumeType?: VolumeType;
}
export const Volume = S.suspend(() =>
  S.Struct({
    volumeName: S.optional(S.String),
    volumeType: S.optional(VolumeType),
  }),
).annotations({ identifier: "Volume" }) as any as S.Schema<Volume>;
export type Volumes = Volume[];
export const Volumes = S.Array(Volume);
export interface KxChangesetListEntry {
  changesetId?: string;
  createdTimestamp?: Date;
  activeFromTimestamp?: Date;
  lastModifiedTimestamp?: Date;
  status?: ChangesetStatus;
}
export const KxChangesetListEntry = S.suspend(() =>
  S.Struct({
    changesetId: S.optional(S.String),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    activeFromTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    status: S.optional(ChangesetStatus),
  }),
).annotations({
  identifier: "KxChangesetListEntry",
}) as any as S.Schema<KxChangesetListEntry>;
export type KxChangesets = KxChangesetListEntry[];
export const KxChangesets = S.Array(KxChangesetListEntry);
export interface KxNode {
  nodeId?: string;
  availabilityZoneId?: string;
  launchTime?: Date;
  status?: KxNodeStatus;
}
export const KxNode = S.suspend(() =>
  S.Struct({
    nodeId: S.optional(S.String),
    availabilityZoneId: S.optional(S.String),
    launchTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(KxNodeStatus),
  }),
).annotations({ identifier: "KxNode" }) as any as S.Schema<KxNode>;
export type KxNodeSummaries = KxNode[];
export const KxNodeSummaries = S.Array(KxNode);
export interface KxCluster {
  status?: KxClusterStatus;
  statusReason?: string;
  clusterName?: string;
  clusterType?: KxClusterType;
  clusterDescription?: string;
  releaseLabel?: string;
  volumes?: Volume[];
  initializationScript?: string;
  executionRole?: string;
  azMode?: KxAzMode;
  availabilityZoneId?: string;
  lastModifiedTimestamp?: Date;
  createdTimestamp?: Date;
}
export const KxCluster = S.suspend(() =>
  S.Struct({
    status: S.optional(KxClusterStatus),
    statusReason: S.optional(S.String),
    clusterName: S.optional(S.String),
    clusterType: S.optional(KxClusterType),
    clusterDescription: S.optional(S.String),
    releaseLabel: S.optional(S.String),
    volumes: S.optional(Volumes),
    initializationScript: S.optional(S.String),
    executionRole: S.optional(S.String),
    azMode: S.optional(KxAzMode),
    availabilityZoneId: S.optional(S.String),
    lastModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "KxCluster" }) as any as S.Schema<KxCluster>;
export type KxClusters = KxCluster[];
export const KxClusters = S.Array(KxCluster);
export interface KxDatabaseListEntry {
  databaseName?: string;
  createdTimestamp?: Date;
  lastModifiedTimestamp?: Date;
}
export const KxDatabaseListEntry = S.suspend(() =>
  S.Struct({
    databaseName: S.optional(S.String),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "KxDatabaseListEntry",
}) as any as S.Schema<KxDatabaseListEntry>;
export type KxDatabases = KxDatabaseListEntry[];
export const KxDatabases = S.Array(KxDatabaseListEntry);
export interface KxDataviewListEntry {
  environmentId?: string;
  databaseName?: string;
  dataviewName?: string;
  azMode?: KxAzMode;
  availabilityZoneId?: string;
  changesetId?: string;
  segmentConfigurations?: KxDataviewSegmentConfiguration[];
  activeVersions?: KxDataviewActiveVersion[];
  status?: KxDataviewStatus;
  description?: string;
  autoUpdate?: boolean;
  readWrite?: boolean;
  createdTimestamp?: Date;
  lastModifiedTimestamp?: Date;
  statusReason?: string;
}
export const KxDataviewListEntry = S.suspend(() =>
  S.Struct({
    environmentId: S.optional(S.String),
    databaseName: S.optional(S.String),
    dataviewName: S.optional(S.String),
    azMode: S.optional(KxAzMode),
    availabilityZoneId: S.optional(S.String),
    changesetId: S.optional(S.String),
    segmentConfigurations: S.optional(KxDataviewSegmentConfigurationList),
    activeVersions: S.optional(KxDataviewActiveVersionList),
    status: S.optional(KxDataviewStatus),
    description: S.optional(S.String),
    autoUpdate: S.optional(S.Boolean),
    readWrite: S.optional(S.Boolean),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    statusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "KxDataviewListEntry",
}) as any as S.Schema<KxDataviewListEntry>;
export type KxDataviews = KxDataviewListEntry[];
export const KxDataviews = S.Array(KxDataviewListEntry);
export interface KxEnvironment {
  name?: string;
  environmentId?: string;
  awsAccountId?: string;
  status?: EnvironmentStatus;
  tgwStatus?: TgwStatus;
  dnsStatus?: DnsStatus;
  errorMessage?: string;
  description?: string;
  environmentArn?: string;
  kmsKeyId?: string;
  dedicatedServiceAccountId?: string;
  transitGatewayConfiguration?: TransitGatewayConfiguration;
  customDNSConfiguration?: CustomDNSServer[];
  creationTimestamp?: Date;
  updateTimestamp?: Date;
  availabilityZoneIds?: string[];
  certificateAuthorityArn?: string;
}
export const KxEnvironment = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    environmentId: S.optional(S.String),
    awsAccountId: S.optional(S.String),
    status: S.optional(EnvironmentStatus),
    tgwStatus: S.optional(TgwStatus),
    dnsStatus: S.optional(DnsStatus),
    errorMessage: S.optional(S.String),
    description: S.optional(S.String),
    environmentArn: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    dedicatedServiceAccountId: S.optional(S.String),
    transitGatewayConfiguration: S.optional(TransitGatewayConfiguration),
    customDNSConfiguration: S.optional(CustomDNSConfiguration),
    creationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    updateTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    availabilityZoneIds: S.optional(AvailabilityZoneIds),
    certificateAuthorityArn: S.optional(S.String),
  }),
).annotations({
  identifier: "KxEnvironment",
}) as any as S.Schema<KxEnvironment>;
export type KxEnvironmentList = KxEnvironment[];
export const KxEnvironmentList = S.Array(KxEnvironment);
export interface KxScalingGroup {
  scalingGroupName?: string;
  hostType?: string;
  clusters?: string[];
  availabilityZoneId?: string;
  status?: KxScalingGroupStatus;
  statusReason?: string;
  lastModifiedTimestamp?: Date;
  createdTimestamp?: Date;
}
export const KxScalingGroup = S.suspend(() =>
  S.Struct({
    scalingGroupName: S.optional(S.String),
    hostType: S.optional(S.String),
    clusters: S.optional(KxClusterNameList),
    availabilityZoneId: S.optional(S.String),
    status: S.optional(KxScalingGroupStatus),
    statusReason: S.optional(S.String),
    lastModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "KxScalingGroup",
}) as any as S.Schema<KxScalingGroup>;
export type KxScalingGroupList = KxScalingGroup[];
export const KxScalingGroupList = S.Array(KxScalingGroup);
export interface KxUser {
  userArn?: string;
  userName?: string;
  iamRole?: string;
  createTimestamp?: Date;
  updateTimestamp?: Date;
}
export const KxUser = S.suspend(() =>
  S.Struct({
    userArn: S.optional(S.String),
    userName: S.optional(S.String),
    iamRole: S.optional(S.String),
    createTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    updateTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "KxUser" }) as any as S.Schema<KxUser>;
export type KxUserList = KxUser[];
export const KxUserList = S.Array(KxUser);
export interface KxVolume {
  volumeName?: string;
  volumeType?: KxVolumeType;
  status?: KxVolumeStatus;
  description?: string;
  statusReason?: string;
  azMode?: KxAzMode;
  availabilityZoneIds?: string[];
  createdTimestamp?: Date;
  lastModifiedTimestamp?: Date;
}
export const KxVolume = S.suspend(() =>
  S.Struct({
    volumeName: S.optional(S.String),
    volumeType: S.optional(KxVolumeType),
    status: S.optional(KxVolumeStatus),
    description: S.optional(S.String),
    statusReason: S.optional(S.String),
    azMode: S.optional(KxAzMode),
    availabilityZoneIds: S.optional(AvailabilityZoneIds),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "KxVolume" }) as any as S.Schema<KxVolume>;
export type KxVolumes = KxVolume[];
export const KxVolumes = S.Array(KxVolume);
export interface CreateEnvironmentRequest {
  name: string;
  description?: string;
  kmsKeyId?: string;
  tags?: { [key: string]: string };
  federationMode?: FederationMode;
  federationParameters?: FederationParameters;
  superuserParameters?: SuperuserParameters;
  dataBundles?: string[];
}
export const CreateEnvironmentRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    tags: S.optional(TagMap),
    federationMode: S.optional(FederationMode),
    federationParameters: S.optional(FederationParameters),
    superuserParameters: S.optional(SuperuserParameters),
    dataBundles: S.optional(DataBundleArns),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/environment" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEnvironmentRequest",
}) as any as S.Schema<CreateEnvironmentRequest>;
export interface CreateKxChangesetResponse {
  changesetId?: string;
  databaseName?: string;
  environmentId?: string;
  changeRequests?: ChangeRequest[];
  createdTimestamp?: Date;
  lastModifiedTimestamp?: Date;
  status?: ChangesetStatus;
  errorInfo?: ErrorInfo;
}
export const CreateKxChangesetResponse = S.suspend(() =>
  S.Struct({
    changesetId: S.optional(S.String),
    databaseName: S.optional(S.String),
    environmentId: S.optional(S.String),
    changeRequests: S.optional(ChangeRequests),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    status: S.optional(ChangesetStatus),
    errorInfo: S.optional(ErrorInfo),
  }),
).annotations({
  identifier: "CreateKxChangesetResponse",
}) as any as S.Schema<CreateKxChangesetResponse>;
export interface CreateKxClusterRequest {
  clientToken?: string;
  environmentId: string;
  clusterName: string;
  clusterType: KxClusterType;
  tickerplantLogConfiguration?: TickerplantLogConfiguration;
  databases?: KxDatabaseConfiguration[];
  cacheStorageConfigurations?: KxCacheStorageConfiguration[];
  autoScalingConfiguration?: AutoScalingConfiguration;
  clusterDescription?: string;
  capacityConfiguration?: CapacityConfiguration;
  releaseLabel: string;
  vpcConfiguration: VpcConfiguration;
  initializationScript?: string;
  commandLineArguments?: KxCommandLineArgument[];
  code?: CodeConfiguration;
  executionRole?: string;
  savedownStorageConfiguration?: KxSavedownStorageConfiguration;
  azMode: KxAzMode;
  availabilityZoneId?: string;
  tags?: { [key: string]: string };
  scalingGroupConfiguration?: KxScalingGroupConfiguration;
}
export const CreateKxClusterRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    clusterName: S.String,
    clusterType: KxClusterType,
    tickerplantLogConfiguration: S.optional(TickerplantLogConfiguration),
    databases: S.optional(KxDatabaseConfigurations),
    cacheStorageConfigurations: S.optional(KxCacheStorageConfigurations),
    autoScalingConfiguration: S.optional(AutoScalingConfiguration),
    clusterDescription: S.optional(S.String),
    capacityConfiguration: S.optional(CapacityConfiguration),
    releaseLabel: S.String,
    vpcConfiguration: VpcConfiguration,
    initializationScript: S.optional(S.String),
    commandLineArguments: S.optional(KxCommandLineArguments),
    code: S.optional(CodeConfiguration),
    executionRole: S.optional(S.String),
    savedownStorageConfiguration: S.optional(KxSavedownStorageConfiguration),
    azMode: KxAzMode,
    availabilityZoneId: S.optional(S.String),
    tags: S.optional(TagMap),
    scalingGroupConfiguration: S.optional(KxScalingGroupConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/kx/environments/{environmentId}/clusters",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateKxClusterRequest",
}) as any as S.Schema<CreateKxClusterRequest>;
export interface CreateKxDataviewResponse {
  dataviewName?: string;
  databaseName?: string;
  environmentId?: string;
  azMode?: KxAzMode;
  availabilityZoneId?: string;
  changesetId?: string;
  segmentConfigurations?: KxDataviewSegmentConfiguration[];
  description?: string;
  autoUpdate?: boolean;
  readWrite?: boolean;
  createdTimestamp?: Date;
  lastModifiedTimestamp?: Date;
  status?: KxDataviewStatus;
}
export const CreateKxDataviewResponse = S.suspend(() =>
  S.Struct({
    dataviewName: S.optional(S.String),
    databaseName: S.optional(S.String),
    environmentId: S.optional(S.String),
    azMode: S.optional(KxAzMode),
    availabilityZoneId: S.optional(S.String),
    changesetId: S.optional(S.String),
    segmentConfigurations: S.optional(KxDataviewSegmentConfigurationList),
    description: S.optional(S.String),
    autoUpdate: S.optional(S.Boolean),
    readWrite: S.optional(S.Boolean),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    status: S.optional(KxDataviewStatus),
  }),
).annotations({
  identifier: "CreateKxDataviewResponse",
}) as any as S.Schema<CreateKxDataviewResponse>;
export interface CreateKxVolumeResponse {
  environmentId?: string;
  volumeName?: string;
  volumeType?: KxVolumeType;
  volumeArn?: string;
  nas1Configuration?: KxNAS1Configuration;
  status?: KxVolumeStatus;
  statusReason?: string;
  azMode?: KxAzMode;
  description?: string;
  availabilityZoneIds?: string[];
  createdTimestamp?: Date;
}
export const CreateKxVolumeResponse = S.suspend(() =>
  S.Struct({
    environmentId: S.optional(S.String),
    volumeName: S.optional(S.String),
    volumeType: S.optional(KxVolumeType),
    volumeArn: S.optional(S.String),
    nas1Configuration: S.optional(KxNAS1Configuration),
    status: S.optional(KxVolumeStatus),
    statusReason: S.optional(S.String),
    azMode: S.optional(KxAzMode),
    description: S.optional(S.String),
    availabilityZoneIds: S.optional(AvailabilityZoneIds),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "CreateKxVolumeResponse",
}) as any as S.Schema<CreateKxVolumeResponse>;
export interface GetEnvironmentResponse {
  environment?: Environment;
}
export const GetEnvironmentResponse = S.suspend(() =>
  S.Struct({ environment: S.optional(Environment) }),
).annotations({
  identifier: "GetEnvironmentResponse",
}) as any as S.Schema<GetEnvironmentResponse>;
export interface GetKxChangesetResponse {
  changesetId?: string;
  databaseName?: string;
  environmentId?: string;
  changeRequests?: ChangeRequest[];
  createdTimestamp?: Date;
  activeFromTimestamp?: Date;
  lastModifiedTimestamp?: Date;
  status?: ChangesetStatus;
  errorInfo?: ErrorInfo;
}
export const GetKxChangesetResponse = S.suspend(() =>
  S.Struct({
    changesetId: S.optional(S.String),
    databaseName: S.optional(S.String),
    environmentId: S.optional(S.String),
    changeRequests: S.optional(ChangeRequests),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    activeFromTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    status: S.optional(ChangesetStatus),
    errorInfo: S.optional(ErrorInfo),
  }),
).annotations({
  identifier: "GetKxChangesetResponse",
}) as any as S.Schema<GetKxChangesetResponse>;
export interface GetKxClusterResponse {
  status?: KxClusterStatus;
  statusReason?: string;
  clusterName?: string;
  clusterType?: KxClusterType;
  tickerplantLogConfiguration?: TickerplantLogConfiguration;
  volumes?: Volume[];
  databases?: KxDatabaseConfiguration[];
  cacheStorageConfigurations?: KxCacheStorageConfiguration[];
  autoScalingConfiguration?: AutoScalingConfiguration;
  clusterDescription?: string;
  capacityConfiguration?: CapacityConfiguration;
  releaseLabel?: string;
  vpcConfiguration?: VpcConfiguration;
  initializationScript?: string;
  commandLineArguments?: KxCommandLineArgument[];
  code?: CodeConfiguration;
  executionRole?: string;
  lastModifiedTimestamp?: Date;
  savedownStorageConfiguration?: KxSavedownStorageConfiguration;
  azMode?: KxAzMode;
  availabilityZoneId?: string;
  createdTimestamp?: Date;
  scalingGroupConfiguration?: KxScalingGroupConfiguration;
}
export const GetKxClusterResponse = S.suspend(() =>
  S.Struct({
    status: S.optional(KxClusterStatus),
    statusReason: S.optional(S.String),
    clusterName: S.optional(S.String),
    clusterType: S.optional(KxClusterType),
    tickerplantLogConfiguration: S.optional(TickerplantLogConfiguration),
    volumes: S.optional(Volumes),
    databases: S.optional(KxDatabaseConfigurations),
    cacheStorageConfigurations: S.optional(KxCacheStorageConfigurations),
    autoScalingConfiguration: S.optional(AutoScalingConfiguration),
    clusterDescription: S.optional(S.String),
    capacityConfiguration: S.optional(CapacityConfiguration),
    releaseLabel: S.optional(S.String),
    vpcConfiguration: S.optional(VpcConfiguration),
    initializationScript: S.optional(S.String),
    commandLineArguments: S.optional(KxCommandLineArguments),
    code: S.optional(CodeConfiguration),
    executionRole: S.optional(S.String),
    lastModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    savedownStorageConfiguration: S.optional(KxSavedownStorageConfiguration),
    azMode: S.optional(KxAzMode),
    availabilityZoneId: S.optional(S.String),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    scalingGroupConfiguration: S.optional(KxScalingGroupConfiguration),
  }),
).annotations({
  identifier: "GetKxClusterResponse",
}) as any as S.Schema<GetKxClusterResponse>;
export interface GetKxDataviewResponse {
  databaseName?: string;
  dataviewName?: string;
  azMode?: KxAzMode;
  availabilityZoneId?: string;
  changesetId?: string;
  segmentConfigurations?: KxDataviewSegmentConfiguration[];
  activeVersions?: KxDataviewActiveVersion[];
  description?: string;
  autoUpdate?: boolean;
  readWrite?: boolean;
  environmentId?: string;
  createdTimestamp?: Date;
  lastModifiedTimestamp?: Date;
  status?: KxDataviewStatus;
  statusReason?: string;
}
export const GetKxDataviewResponse = S.suspend(() =>
  S.Struct({
    databaseName: S.optional(S.String),
    dataviewName: S.optional(S.String),
    azMode: S.optional(KxAzMode),
    availabilityZoneId: S.optional(S.String),
    changesetId: S.optional(S.String),
    segmentConfigurations: S.optional(KxDataviewSegmentConfigurationList),
    activeVersions: S.optional(KxDataviewActiveVersionList),
    description: S.optional(S.String),
    autoUpdate: S.optional(S.Boolean),
    readWrite: S.optional(S.Boolean),
    environmentId: S.optional(S.String),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    status: S.optional(KxDataviewStatus),
    statusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "GetKxDataviewResponse",
}) as any as S.Schema<GetKxDataviewResponse>;
export interface GetKxVolumeResponse {
  environmentId?: string;
  volumeName?: string;
  volumeType?: KxVolumeType;
  volumeArn?: string;
  nas1Configuration?: KxNAS1Configuration;
  status?: KxVolumeStatus;
  statusReason?: string;
  createdTimestamp?: Date;
  description?: string;
  azMode?: KxAzMode;
  availabilityZoneIds?: string[];
  lastModifiedTimestamp?: Date;
  attachedClusters?: KxAttachedCluster[];
}
export const GetKxVolumeResponse = S.suspend(() =>
  S.Struct({
    environmentId: S.optional(S.String),
    volumeName: S.optional(S.String),
    volumeType: S.optional(KxVolumeType),
    volumeArn: S.optional(S.String),
    nas1Configuration: S.optional(KxNAS1Configuration),
    status: S.optional(KxVolumeStatus),
    statusReason: S.optional(S.String),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    description: S.optional(S.String),
    azMode: S.optional(KxAzMode),
    availabilityZoneIds: S.optional(AvailabilityZoneIds),
    lastModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    attachedClusters: S.optional(KxAttachedClusters),
  }),
).annotations({
  identifier: "GetKxVolumeResponse",
}) as any as S.Schema<GetKxVolumeResponse>;
export interface ListKxChangesetsResponse {
  kxChangesets?: KxChangesetListEntry[];
  nextToken?: string;
}
export const ListKxChangesetsResponse = S.suspend(() =>
  S.Struct({
    kxChangesets: S.optional(KxChangesets),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListKxChangesetsResponse",
}) as any as S.Schema<ListKxChangesetsResponse>;
export interface ListKxClusterNodesResponse {
  nodes?: KxNode[];
  nextToken?: string;
}
export const ListKxClusterNodesResponse = S.suspend(() =>
  S.Struct({
    nodes: S.optional(KxNodeSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListKxClusterNodesResponse",
}) as any as S.Schema<ListKxClusterNodesResponse>;
export interface ListKxClustersResponse {
  kxClusterSummaries?: KxCluster[];
  nextToken?: string;
}
export const ListKxClustersResponse = S.suspend(() =>
  S.Struct({
    kxClusterSummaries: S.optional(KxClusters),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListKxClustersResponse",
}) as any as S.Schema<ListKxClustersResponse>;
export interface ListKxDatabasesResponse {
  kxDatabases?: KxDatabaseListEntry[];
  nextToken?: string;
}
export const ListKxDatabasesResponse = S.suspend(() =>
  S.Struct({
    kxDatabases: S.optional(KxDatabases),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListKxDatabasesResponse",
}) as any as S.Schema<ListKxDatabasesResponse>;
export interface ListKxDataviewsResponse {
  kxDataviews?: KxDataviewListEntry[];
  nextToken?: string;
}
export const ListKxDataviewsResponse = S.suspend(() =>
  S.Struct({
    kxDataviews: S.optional(KxDataviews),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListKxDataviewsResponse",
}) as any as S.Schema<ListKxDataviewsResponse>;
export interface ListKxEnvironmentsResponse {
  environments?: KxEnvironment[];
  nextToken?: string;
}
export const ListKxEnvironmentsResponse = S.suspend(() =>
  S.Struct({
    environments: S.optional(KxEnvironmentList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListKxEnvironmentsResponse",
}) as any as S.Schema<ListKxEnvironmentsResponse>;
export interface ListKxScalingGroupsResponse {
  scalingGroups?: KxScalingGroup[];
  nextToken?: string;
}
export const ListKxScalingGroupsResponse = S.suspend(() =>
  S.Struct({
    scalingGroups: S.optional(KxScalingGroupList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListKxScalingGroupsResponse",
}) as any as S.Schema<ListKxScalingGroupsResponse>;
export interface ListKxUsersResponse {
  users?: KxUser[];
  nextToken?: string;
}
export const ListKxUsersResponse = S.suspend(() =>
  S.Struct({ users: S.optional(KxUserList), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListKxUsersResponse",
}) as any as S.Schema<ListKxUsersResponse>;
export interface ListKxVolumesResponse {
  kxVolumeSummaries?: KxVolume[];
  nextToken?: string;
}
export const ListKxVolumesResponse = S.suspend(() =>
  S.Struct({
    kxVolumeSummaries: S.optional(KxVolumes),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListKxVolumesResponse",
}) as any as S.Schema<ListKxVolumesResponse>;
export interface CreateEnvironmentResponse {
  environmentId?: string;
  environmentArn?: string;
  environmentUrl?: string;
}
export const CreateEnvironmentResponse = S.suspend(() =>
  S.Struct({
    environmentId: S.optional(S.String),
    environmentArn: S.optional(S.String),
    environmentUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateEnvironmentResponse",
}) as any as S.Schema<CreateEnvironmentResponse>;
export interface CreateKxClusterResponse {
  environmentId?: string;
  status?: KxClusterStatus;
  statusReason?: string;
  clusterName?: string;
  clusterType?: KxClusterType;
  tickerplantLogConfiguration?: TickerplantLogConfiguration;
  volumes?: Volume[];
  databases?: KxDatabaseConfiguration[];
  cacheStorageConfigurations?: KxCacheStorageConfiguration[];
  autoScalingConfiguration?: AutoScalingConfiguration;
  clusterDescription?: string;
  capacityConfiguration?: CapacityConfiguration;
  releaseLabel?: string;
  vpcConfiguration?: VpcConfiguration;
  initializationScript?: string;
  commandLineArguments?: KxCommandLineArgument[];
  code?: CodeConfiguration;
  executionRole?: string;
  lastModifiedTimestamp?: Date;
  savedownStorageConfiguration?: KxSavedownStorageConfiguration;
  azMode?: KxAzMode;
  availabilityZoneId?: string;
  createdTimestamp?: Date;
  scalingGroupConfiguration?: KxScalingGroupConfiguration;
}
export const CreateKxClusterResponse = S.suspend(() =>
  S.Struct({
    environmentId: S.optional(S.String),
    status: S.optional(KxClusterStatus),
    statusReason: S.optional(S.String),
    clusterName: S.optional(S.String),
    clusterType: S.optional(KxClusterType),
    tickerplantLogConfiguration: S.optional(TickerplantLogConfiguration),
    volumes: S.optional(Volumes),
    databases: S.optional(KxDatabaseConfigurations),
    cacheStorageConfigurations: S.optional(KxCacheStorageConfigurations),
    autoScalingConfiguration: S.optional(AutoScalingConfiguration),
    clusterDescription: S.optional(S.String),
    capacityConfiguration: S.optional(CapacityConfiguration),
    releaseLabel: S.optional(S.String),
    vpcConfiguration: S.optional(VpcConfiguration),
    initializationScript: S.optional(S.String),
    commandLineArguments: S.optional(KxCommandLineArguments),
    code: S.optional(CodeConfiguration),
    executionRole: S.optional(S.String),
    lastModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    savedownStorageConfiguration: S.optional(KxSavedownStorageConfiguration),
    azMode: S.optional(KxAzMode),
    availabilityZoneId: S.optional(S.String),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    scalingGroupConfiguration: S.optional(KxScalingGroupConfiguration),
  }),
).annotations({
  identifier: "CreateKxClusterResponse",
}) as any as S.Schema<CreateKxClusterResponse>;
export interface UpdateKxEnvironmentNetworkRequest {
  environmentId: string;
  transitGatewayConfiguration?: TransitGatewayConfiguration;
  customDNSConfiguration?: CustomDNSServer[];
  clientToken?: string;
}
export const UpdateKxEnvironmentNetworkRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    transitGatewayConfiguration: S.optional(TransitGatewayConfiguration),
    customDNSConfiguration: S.optional(CustomDNSConfiguration),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/kx/environments/{environmentId}/network",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateKxEnvironmentNetworkRequest",
}) as any as S.Schema<UpdateKxEnvironmentNetworkRequest>;
export interface UpdateKxEnvironmentNetworkResponse {
  name?: string;
  environmentId?: string;
  awsAccountId?: string;
  status?: EnvironmentStatus;
  tgwStatus?: TgwStatus;
  dnsStatus?: DnsStatus;
  errorMessage?: string;
  description?: string;
  environmentArn?: string;
  kmsKeyId?: string;
  dedicatedServiceAccountId?: string;
  transitGatewayConfiguration?: TransitGatewayConfiguration;
  customDNSConfiguration?: CustomDNSServer[];
  creationTimestamp?: Date;
  updateTimestamp?: Date;
  availabilityZoneIds?: string[];
}
export const UpdateKxEnvironmentNetworkResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    environmentId: S.optional(S.String),
    awsAccountId: S.optional(S.String),
    status: S.optional(EnvironmentStatus),
    tgwStatus: S.optional(TgwStatus),
    dnsStatus: S.optional(DnsStatus),
    errorMessage: S.optional(S.String),
    description: S.optional(S.String),
    environmentArn: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    dedicatedServiceAccountId: S.optional(S.String),
    transitGatewayConfiguration: S.optional(TransitGatewayConfiguration),
    customDNSConfiguration: S.optional(CustomDNSConfiguration),
    creationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    updateTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    availabilityZoneIds: S.optional(AvailabilityZoneIds),
  }),
).annotations({
  identifier: "UpdateKxEnvironmentNetworkResponse",
}) as any as S.Schema<UpdateKxEnvironmentNetworkResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String), reason: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * A list of all of your FinSpace environments.
 */
export const listEnvironments: (
  input: ListEnvironmentsRequest,
) => effect.Effect<
  ListEnvironmentsResponse,
  | AccessDeniedException
  | InternalServerException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEnvironmentsRequest,
  output: ListEnvironmentsResponse,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
}));
/**
 * Removes metadata tags from a FinSpace resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * A list of all tags for a resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns the FinSpace environment object.
 */
export const getEnvironment: (
  input: GetEnvironmentRequest,
) => effect.Effect<
  GetEnvironmentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnvironmentRequest,
  output: GetEnvironmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Retrieves all the information for the specified kdb environment.
 */
export const getKxEnvironment: (
  input: GetKxEnvironmentRequest,
) => effect.Effect<
  GetKxEnvironmentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKxEnvironmentRequest,
  output: GetKxEnvironmentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Adds metadata tags to a FinSpace resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a list of kdb environments created in an account.
 */
export const listKxEnvironments: {
  (
    input: ListKxEnvironmentsRequest,
  ): effect.Effect<
    ListKxEnvironmentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListKxEnvironmentsRequest,
  ) => stream.Stream<
    ListKxEnvironmentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListKxEnvironmentsRequest,
  ) => stream.Stream<
    KxEnvironment,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListKxEnvironmentsRequest,
  output: ListKxEnvironmentsResponse,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "environments",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Update your FinSpace environment.
 */
export const updateEnvironment: (
  input: UpdateEnvironmentRequest,
) => effect.Effect<
  UpdateEnvironmentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEnvironmentRequest,
  output: UpdateEnvironmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the specified dataview. The dataviews get automatically updated when any new changesets are ingested. Each update of the dataview creates a new version, including changeset details and cache configurations
 */
export const updateKxDataview: (
  input: UpdateKxDataviewRequest,
) => effect.Effect<
  UpdateKxDataviewResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateKxDataviewRequest,
  output: UpdateKxDataviewResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all the nodes in a kdb cluster.
 */
export const listKxClusterNodes: {
  (
    input: ListKxClusterNodesRequest,
  ): effect.Effect<
    ListKxClusterNodesResponse,
    | AccessDeniedException
    | InternalServerException
    | LimitExceededException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListKxClusterNodesRequest,
  ) => stream.Stream<
    ListKxClusterNodesResponse,
    | AccessDeniedException
    | InternalServerException
    | LimitExceededException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListKxClusterNodesRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | LimitExceededException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListKxClusterNodesRequest,
  output: ListKxClusterNodesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of clusters.
 */
export const listKxClusters: (
  input: ListKxClustersRequest,
) => effect.Effect<
  ListKxClustersResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListKxClustersRequest,
  output: ListKxClustersResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of scaling groups in a kdb environment.
 */
export const listKxScalingGroups: {
  (
    input: ListKxScalingGroupsRequest,
  ): effect.Effect<
    ListKxScalingGroupsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | LimitExceededException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListKxScalingGroupsRequest,
  ) => stream.Stream<
    ListKxScalingGroupsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | LimitExceededException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListKxScalingGroupsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | LimitExceededException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListKxScalingGroupsRequest,
  output: ListKxScalingGroupsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all the volumes in a kdb environment.
 */
export const listKxVolumes: (
  input: ListKxVolumesRequest,
) => effect.Effect<
  ListKxVolumesResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListKxVolumesRequest,
  output: ListKxVolumesResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves details of a scaling group.
 */
export const getKxScalingGroup: (
  input: GetKxScalingGroupRequest,
) => effect.Effect<
  GetKxScalingGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKxScalingGroupRequest,
  output: GetKxScalingGroupResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Allows you to update code configuration on a running cluster. By using this API you can update the code, the initialization script path, and the command line arguments for a specific cluster.
 * The configuration that you want to update will override any existing configurations on the cluster.
 */
export const updateKxClusterCodeConfiguration: (
  input: UpdateKxClusterCodeConfigurationRequest,
) => effect.Effect<
  UpdateKxClusterCodeConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateKxClusterCodeConfigurationRequest,
  output: UpdateKxClusterCodeConfigurationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the databases mounted on a kdb cluster, which includes the `changesetId` and all the dbPaths to be cached. This API does not allow you to change a database name or add a database if you created a cluster without one.
 *
 * Using this API you can point a cluster to a different changeset and modify a list of partitions being cached.
 */
export const updateKxClusterDatabases: (
  input: UpdateKxClusterDatabasesRequest,
) => effect.Effect<
  UpdateKxClusterDatabasesResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateKxClusterDatabasesRequest,
  output: UpdateKxClusterDatabasesResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the user details. You can only update the IAM role associated with a user.
 */
export const updateKxUser: (
  input: UpdateKxUserRequest,
) => effect.Effect<
  UpdateKxUserResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateKxUserRequest,
  output: UpdateKxUserResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the throughput or capacity of a volume. During the update process, the filesystem
 * might be unavailable for a few minutes. You can retry any operations after the update is complete.
 */
export const updateKxVolume: (
  input: UpdateKxVolumeRequest,
) => effect.Effect<
  UpdateKxVolumeResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateKxVolumeRequest,
  output: UpdateKxVolumeResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a kdb cluster.
 */
export const deleteKxCluster: (
  input: DeleteKxClusterRequest,
) => effect.Effect<
  DeleteKxClusterResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKxClusterRequest,
  output: DeleteKxClusterResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified scaling group. This action is irreversible. You cannot delete a scaling group until all the clusters running on it have been deleted.
 */
export const deleteKxScalingGroup: (
  input: DeleteKxScalingGroupRequest,
) => effect.Effect<
  DeleteKxScalingGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKxScalingGroupRequest,
  output: DeleteKxScalingGroupResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a volume. You can only delete a volume if it's not attached to a cluster or a dataview. When a volume is deleted, any data on the volume is lost. This action is irreversible.
 */
export const deleteKxVolume: (
  input: DeleteKxVolumeRequest,
) => effect.Effect<
  DeleteKxVolumeResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKxVolumeRequest,
  output: DeleteKxVolumeResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new kdb database in the environment.
 */
export const createKxDatabase: (
  input: CreateKxDatabaseRequest,
) => effect.Effect<
  CreateKxDatabaseResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKxDatabaseRequest,
  output: CreateKxDatabaseResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new scaling group.
 */
export const createKxScalingGroup: (
  input: CreateKxScalingGroupRequest,
) => effect.Effect<
  CreateKxScalingGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKxScalingGroupRequest,
  output: CreateKxScalingGroupResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a user in FinSpace kdb environment with an associated IAM role.
 */
export const createKxUser: (
  input: CreateKxUserRequest,
) => effect.Effect<
  CreateKxUserResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKxUserRequest,
  output: CreateKxUserResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a changeset for a kdb database. A changeset allows you to add and delete existing files by using an ordered list of change requests.
 */
export const createKxChangeset: (
  input: CreateKxChangesetRequest,
) => effect.Effect<
  CreateKxChangesetResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKxChangesetRequest,
  output: CreateKxChangesetResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a snapshot of kdb database with tiered storage capabilities and a pre-warmed cache, ready for mounting on kdb clusters. Dataviews are only available for clusters running on a scaling group. They are not supported on dedicated clusters.
 */
export const createKxDataview: (
  input: CreateKxDataviewRequest,
) => effect.Effect<
  CreateKxDataviewResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKxDataviewRequest,
  output: CreateKxDataviewResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new volume with a specific amount of throughput and storage capacity.
 */
export const createKxVolume: (
  input: CreateKxVolumeRequest,
) => effect.Effect<
  CreateKxVolumeResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKxVolumeRequest,
  output: CreateKxVolumeResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a kdb cluster.
 */
export const getKxCluster: (
  input: GetKxClusterRequest,
) => effect.Effect<
  GetKxClusterResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKxClusterRequest,
  output: GetKxClusterResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new kdb cluster.
 */
export const createKxCluster: (
  input: CreateKxClusterRequest,
) => effect.Effect<
  CreateKxClusterResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKxClusterRequest,
  output: CreateKxClusterResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates information for the given kdb database.
 */
export const updateKxDatabase: (
  input: UpdateKxDatabaseRequest,
) => effect.Effect<
  UpdateKxDatabaseResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateKxDatabaseRequest,
  output: UpdateKxDatabaseResponse,
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
 * Updates information for the given kdb environment.
 */
export const updateKxEnvironment: (
  input: UpdateKxEnvironmentRequest,
) => effect.Effect<
  UpdateKxEnvironmentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateKxEnvironmentRequest,
  output: UpdateKxEnvironmentResponse,
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
 * Deletes the specified database and all of its associated data. This action is irreversible. You must copy any data out of the database before deleting it if the data is to be retained.
 */
export const deleteKxDatabase: (
  input: DeleteKxDatabaseRequest,
) => effect.Effect<
  DeleteKxDatabaseResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKxDatabaseRequest,
  output: DeleteKxDatabaseResponse,
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
 * Deletes the specified dataview. Before deleting a dataview, make sure that it is not in use by any cluster.
 */
export const deleteKxDataview: (
  input: DeleteKxDataviewRequest,
) => effect.Effect<
  DeleteKxDataviewResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKxDataviewRequest,
  output: DeleteKxDataviewResponse,
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
 * Deletes the kdb environment. This action is irreversible. Deleting a kdb environment will remove all the associated data and any services running in it.
 */
export const deleteKxEnvironment: (
  input: DeleteKxEnvironmentRequest,
) => effect.Effect<
  DeleteKxEnvironmentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKxEnvironmentRequest,
  output: DeleteKxEnvironmentResponse,
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
 * Deletes a user in the specified kdb environment.
 */
export const deleteKxUser: (
  input: DeleteKxUserRequest,
) => effect.Effect<
  DeleteKxUserResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKxUserRequest,
  output: DeleteKxUserResponse,
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
 * Deletes the specified nodes from a cluster.
 */
export const deleteKxClusterNode: (
  input: DeleteKxClusterNodeRequest,
) => effect.Effect<
  DeleteKxClusterNodeResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKxClusterNodeRequest,
  output: DeleteKxClusterNodeResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Delete an FinSpace environment.
 */
export const deleteEnvironment: (
  input: DeleteEnvironmentRequest,
) => effect.Effect<
  DeleteEnvironmentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentRequest,
  output: DeleteEnvironmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a connection string for a user to connect to a kdb cluster. You must call this API using the same role that you have defined while creating a user.
 */
export const getKxConnectionString: (
  input: GetKxConnectionStringRequest,
) => effect.Effect<
  GetKxConnectionStringResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKxConnectionStringRequest,
  output: GetKxConnectionStringResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns database information for the specified environment ID.
 */
export const getKxDatabase: (
  input: GetKxDatabaseRequest,
) => effect.Effect<
  GetKxDatabaseResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKxDatabaseRequest,
  output: GetKxDatabaseResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about the specified kdb user.
 */
export const getKxUser: (
  input: GetKxUserRequest,
) => effect.Effect<
  GetKxUserResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKxUserRequest,
  output: GetKxUserResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about a kdb changeset.
 */
export const getKxChangeset: (
  input: GetKxChangesetRequest,
) => effect.Effect<
  GetKxChangesetResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKxChangesetRequest,
  output: GetKxChangesetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves details of the dataview.
 */
export const getKxDataview: (
  input: GetKxDataviewRequest,
) => effect.Effect<
  GetKxDataviewResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKxDataviewRequest,
  output: GetKxDataviewResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of all the changesets for a database.
 */
export const listKxChangesets: {
  (
    input: ListKxChangesetsRequest,
  ): effect.Effect<
    ListKxChangesetsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListKxChangesetsRequest,
  ) => stream.Stream<
    ListKxChangesetsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListKxChangesetsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListKxChangesetsRequest,
  output: ListKxChangesetsResponse,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of all the databases in the kdb environment.
 */
export const listKxDatabases: {
  (
    input: ListKxDatabasesRequest,
  ): effect.Effect<
    ListKxDatabasesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListKxDatabasesRequest,
  ) => stream.Stream<
    ListKxDatabasesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListKxDatabasesRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListKxDatabasesRequest,
  output: ListKxDatabasesResponse,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of all the dataviews in the database.
 */
export const listKxDataviews: {
  (
    input: ListKxDataviewsRequest,
  ): effect.Effect<
    ListKxDataviewsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListKxDataviewsRequest,
  ) => stream.Stream<
    ListKxDataviewsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListKxDataviewsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListKxDataviewsRequest,
  output: ListKxDataviewsResponse,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all the users in a kdb environment.
 */
export const listKxUsers: (
  input: ListKxUsersRequest,
) => effect.Effect<
  ListKxUsersResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListKxUsersRequest,
  output: ListKxUsersResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the information about the volume.
 */
export const getKxVolume: (
  input: GetKxVolumeRequest,
) => effect.Effect<
  GetKxVolumeResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKxVolumeRequest,
  output: GetKxVolumeResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates environment network to connect to your internal network by using a transit gateway. This API supports request to create a transit gateway attachment from FinSpace VPC to your transit gateway ID and create a custom Route-53 outbound resolvers.
 *
 * Once you send a request to update a network, you cannot change it again. Network update might require termination of any clusters that are running in the existing network.
 */
export const updateKxEnvironmentNetwork: (
  input: UpdateKxEnvironmentNetworkRequest,
) => effect.Effect<
  UpdateKxEnvironmentNetworkResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateKxEnvironmentNetworkRequest,
  output: UpdateKxEnvironmentNetworkResponse,
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
 * Creates a managed kdb environment for the account.
 */
export const createKxEnvironment: (
  input: CreateKxEnvironmentRequest,
) => effect.Effect<
  CreateKxEnvironmentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKxEnvironmentRequest,
  output: CreateKxEnvironmentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Create a new FinSpace environment.
 */
export const createEnvironment: (
  input: CreateEnvironmentRequest,
) => effect.Effect<
  CreateEnvironmentResponse,
  | AccessDeniedException
  | InternalServerException
  | LimitExceededException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEnvironmentRequest,
  output: CreateEnvironmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    LimitExceededException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
