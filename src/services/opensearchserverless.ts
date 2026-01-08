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
  sdkId: "OpenSearchServerless",
  serviceShapeName: "OpenSearchServerless",
});
const auth = T.AwsAuthSigv4({ name: "aoss" });
const ver = T.ServiceVersion("2021-11-01");
const proto = T.AwsProtocolsAwsJson1_0();
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
              `https://aoss-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://aoss-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://aoss.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://aoss.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type CollectionId = string;
export type CollectionName = string;
export type VpcEndpointId = string;
export type LifecyclePolicyType = string;
export type PolicyName = string;
export type PolicyDescription = string;
export type PolicyDocument = string;
export type ClientToken = string;
export type SecurityPolicyType = string;
export type Arn = string;
export type TagKey = string;
export type SubnetId = string;
export type SecurityGroupId = string;
export type AccessPolicyType = string;
export type PolicyVersion = string;
export type Resource = string;
export type CollectionType = string;
export type StandbyReplicas = string;
export type IndexName = string;
export type IndexSchema = unknown;
export type LifecycleResource = string;
export type SecurityConfigType = string;
export type ConfigName = string;
export type ConfigDescription = string;
export type SecurityConfigId = string;
export type VpcEndpointName = string;
export type VpcId = string;
export type ResourceName = string;
export type TagValue = string;
export type IndexingCapacityValue = number;
export type SearchCapacityValue = number;
export type ServerlessVectorAccelerationStatus = string;
export type CollectionStatus = string;
export type samlMetadata = string;
export type samlUserAttribute = string;
export type samlGroupAttribute = string;
export type openSearchServerlessEntityId = string;
export type IamIdentityCenterInstanceArn = string;
export type IamIdentityCenterUserAttribute = string;
export type IamIdentityCenterGroupAttribute = string;
export type iamFederationGroupAttribute = string;
export type iamFederationUserAttribute = string;
export type VpcEndpointStatus = string;
export type IamIdentityCenterApplicationArn = string;
export type ResourceType = string;

//# Schemas
export interface GetAccountSettingsRequest {}
export const GetAccountSettingsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAccountSettingsRequest",
}) as any as S.Schema<GetAccountSettingsRequest>;
export interface GetPoliciesStatsRequest {}
export const GetPoliciesStatsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetPoliciesStatsRequest",
}) as any as S.Schema<GetPoliciesStatsRequest>;
export type CollectionIds = string[];
export const CollectionIds = S.Array(S.String);
export type CollectionNames = string[];
export const CollectionNames = S.Array(S.String);
export type VpcEndpointIds = string[];
export const VpcEndpointIds = S.Array(S.String);
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export type SubnetIds = string[];
export const SubnetIds = S.Array(S.String);
export type SecurityGroupIds = string[];
export const SecurityGroupIds = S.Array(S.String);
export type ResourceFilter = string[];
export const ResourceFilter = S.Array(S.String);
export type LifecycleResourceFilter = string[];
export const LifecycleResourceFilter = S.Array(S.String);
export interface BatchGetCollectionRequest {
  ids?: string[];
  names?: string[];
}
export const BatchGetCollectionRequest = S.suspend(() =>
  S.Struct({
    ids: S.optional(CollectionIds),
    names: S.optional(CollectionNames),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetCollectionRequest",
}) as any as S.Schema<BatchGetCollectionRequest>;
export interface BatchGetVpcEndpointRequest {
  ids: string[];
}
export const BatchGetVpcEndpointRequest = S.suspend(() =>
  S.Struct({ ids: VpcEndpointIds }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetVpcEndpointRequest",
}) as any as S.Schema<BatchGetVpcEndpointRequest>;
export interface CreateLifecyclePolicyRequest {
  type: string;
  name: string;
  description?: string;
  policy: string;
  clientToken?: string;
}
export const CreateLifecyclePolicyRequest = S.suspend(() =>
  S.Struct({
    type: S.String,
    name: S.String,
    description: S.optional(S.String),
    policy: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateLifecyclePolicyRequest",
}) as any as S.Schema<CreateLifecyclePolicyRequest>;
export interface CreateSecurityPolicyRequest {
  type: string;
  name: string;
  description?: string;
  policy: string;
  clientToken?: string;
}
export const CreateSecurityPolicyRequest = S.suspend(() =>
  S.Struct({
    type: S.String,
    name: S.String,
    description: S.optional(S.String),
    policy: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateSecurityPolicyRequest",
}) as any as S.Schema<CreateSecurityPolicyRequest>;
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
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tagKeys: TagKeys }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateVpcEndpointRequest {
  id: string;
  addSubnetIds?: string[];
  removeSubnetIds?: string[];
  addSecurityGroupIds?: string[];
  removeSecurityGroupIds?: string[];
  clientToken?: string;
}
export const UpdateVpcEndpointRequest = S.suspend(() =>
  S.Struct({
    id: S.String,
    addSubnetIds: S.optional(SubnetIds),
    removeSubnetIds: S.optional(SubnetIds),
    addSecurityGroupIds: S.optional(SecurityGroupIds),
    removeSecurityGroupIds: S.optional(SecurityGroupIds),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateVpcEndpointRequest",
}) as any as S.Schema<UpdateVpcEndpointRequest>;
export interface CreateAccessPolicyRequest {
  type: string;
  name: string;
  description?: string;
  policy: string;
  clientToken?: string;
}
export const CreateAccessPolicyRequest = S.suspend(() =>
  S.Struct({
    type: S.String,
    name: S.String,
    description: S.optional(S.String),
    policy: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateAccessPolicyRequest",
}) as any as S.Schema<CreateAccessPolicyRequest>;
export interface GetAccessPolicyRequest {
  type: string;
  name: string;
}
export const GetAccessPolicyRequest = S.suspend(() =>
  S.Struct({ type: S.String, name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAccessPolicyRequest",
}) as any as S.Schema<GetAccessPolicyRequest>;
export interface UpdateAccessPolicyRequest {
  type: string;
  name: string;
  policyVersion: string;
  description?: string;
  policy?: string;
  clientToken?: string;
}
export const UpdateAccessPolicyRequest = S.suspend(() =>
  S.Struct({
    type: S.String,
    name: S.String,
    policyVersion: S.String,
    description: S.optional(S.String),
    policy: S.optional(S.String),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateAccessPolicyRequest",
}) as any as S.Schema<UpdateAccessPolicyRequest>;
export interface DeleteAccessPolicyRequest {
  type: string;
  name: string;
  clientToken?: string;
}
export const DeleteAccessPolicyRequest = S.suspend(() =>
  S.Struct({
    type: S.String,
    name: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteAccessPolicyRequest",
}) as any as S.Schema<DeleteAccessPolicyRequest>;
export interface DeleteAccessPolicyResponse {}
export const DeleteAccessPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAccessPolicyResponse",
}) as any as S.Schema<DeleteAccessPolicyResponse>;
export interface ListAccessPoliciesRequest {
  type: string;
  resource?: string[];
  nextToken?: string;
  maxResults?: number;
}
export const ListAccessPoliciesRequest = S.suspend(() =>
  S.Struct({
    type: S.String,
    resource: S.optional(ResourceFilter),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAccessPoliciesRequest",
}) as any as S.Schema<ListAccessPoliciesRequest>;
export interface UpdateCollectionRequest {
  id: string;
  description?: string;
  clientToken?: string;
}
export const UpdateCollectionRequest = S.suspend(() =>
  S.Struct({
    id: S.String,
    description: S.optional(S.String),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateCollectionRequest",
}) as any as S.Schema<UpdateCollectionRequest>;
export interface DeleteCollectionRequest {
  id: string;
  clientToken?: string;
}
export const DeleteCollectionRequest = S.suspend(() =>
  S.Struct({
    id: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteCollectionRequest",
}) as any as S.Schema<DeleteCollectionRequest>;
export interface CreateIndexRequest {
  id: string;
  indexName: string;
  indexSchema?: any;
}
export const CreateIndexRequest = S.suspend(() =>
  S.Struct({
    id: S.String,
    indexName: S.String,
    indexSchema: S.optional(S.Any),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateIndexRequest",
}) as any as S.Schema<CreateIndexRequest>;
export interface CreateIndexResponse {}
export const CreateIndexResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "CreateIndexResponse",
}) as any as S.Schema<CreateIndexResponse>;
export interface GetIndexRequest {
  id: string;
  indexName: string;
}
export const GetIndexRequest = S.suspend(() =>
  S.Struct({ id: S.String, indexName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetIndexRequest",
}) as any as S.Schema<GetIndexRequest>;
export interface UpdateIndexRequest {
  id: string;
  indexName: string;
  indexSchema?: any;
}
export const UpdateIndexRequest = S.suspend(() =>
  S.Struct({
    id: S.String,
    indexName: S.String,
    indexSchema: S.optional(S.Any),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateIndexRequest",
}) as any as S.Schema<UpdateIndexRequest>;
export interface UpdateIndexResponse {}
export const UpdateIndexResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateIndexResponse",
}) as any as S.Schema<UpdateIndexResponse>;
export interface DeleteIndexRequest {
  id: string;
  indexName: string;
}
export const DeleteIndexRequest = S.suspend(() =>
  S.Struct({ id: S.String, indexName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteIndexRequest",
}) as any as S.Schema<DeleteIndexRequest>;
export interface DeleteIndexResponse {}
export const DeleteIndexResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteIndexResponse",
}) as any as S.Schema<DeleteIndexResponse>;
export interface UpdateLifecyclePolicyRequest {
  type: string;
  name: string;
  policyVersion: string;
  description?: string;
  policy?: string;
  clientToken?: string;
}
export const UpdateLifecyclePolicyRequest = S.suspend(() =>
  S.Struct({
    type: S.String,
    name: S.String,
    policyVersion: S.String,
    description: S.optional(S.String),
    policy: S.optional(S.String),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateLifecyclePolicyRequest",
}) as any as S.Schema<UpdateLifecyclePolicyRequest>;
export interface DeleteLifecyclePolicyRequest {
  type: string;
  name: string;
  clientToken?: string;
}
export const DeleteLifecyclePolicyRequest = S.suspend(() =>
  S.Struct({
    type: S.String,
    name: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteLifecyclePolicyRequest",
}) as any as S.Schema<DeleteLifecyclePolicyRequest>;
export interface DeleteLifecyclePolicyResponse {}
export const DeleteLifecyclePolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteLifecyclePolicyResponse",
}) as any as S.Schema<DeleteLifecyclePolicyResponse>;
export interface ListLifecyclePoliciesRequest {
  type: string;
  resources?: string[];
  nextToken?: string;
  maxResults?: number;
}
export const ListLifecyclePoliciesRequest = S.suspend(() =>
  S.Struct({
    type: S.String,
    resources: S.optional(LifecycleResourceFilter),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListLifecyclePoliciesRequest",
}) as any as S.Schema<ListLifecyclePoliciesRequest>;
export interface GetSecurityConfigRequest {
  id: string;
}
export const GetSecurityConfigRequest = S.suspend(() =>
  S.Struct({ id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSecurityConfigRequest",
}) as any as S.Schema<GetSecurityConfigRequest>;
export interface DeleteSecurityConfigRequest {
  id: string;
  clientToken?: string;
}
export const DeleteSecurityConfigRequest = S.suspend(() =>
  S.Struct({
    id: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteSecurityConfigRequest",
}) as any as S.Schema<DeleteSecurityConfigRequest>;
export interface DeleteSecurityConfigResponse {}
export const DeleteSecurityConfigResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSecurityConfigResponse",
}) as any as S.Schema<DeleteSecurityConfigResponse>;
export interface ListSecurityConfigsRequest {
  type: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListSecurityConfigsRequest = S.suspend(() =>
  S.Struct({
    type: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSecurityConfigsRequest",
}) as any as S.Schema<ListSecurityConfigsRequest>;
export interface GetSecurityPolicyRequest {
  type: string;
  name: string;
}
export const GetSecurityPolicyRequest = S.suspend(() =>
  S.Struct({ type: S.String, name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSecurityPolicyRequest",
}) as any as S.Schema<GetSecurityPolicyRequest>;
export interface UpdateSecurityPolicyRequest {
  type: string;
  name: string;
  policyVersion: string;
  description?: string;
  policy?: string;
  clientToken?: string;
}
export const UpdateSecurityPolicyRequest = S.suspend(() =>
  S.Struct({
    type: S.String,
    name: S.String,
    policyVersion: S.String,
    description: S.optional(S.String),
    policy: S.optional(S.String),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateSecurityPolicyRequest",
}) as any as S.Schema<UpdateSecurityPolicyRequest>;
export interface DeleteSecurityPolicyRequest {
  type: string;
  name: string;
  clientToken?: string;
}
export const DeleteSecurityPolicyRequest = S.suspend(() =>
  S.Struct({
    type: S.String,
    name: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteSecurityPolicyRequest",
}) as any as S.Schema<DeleteSecurityPolicyRequest>;
export interface DeleteSecurityPolicyResponse {}
export const DeleteSecurityPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSecurityPolicyResponse",
}) as any as S.Schema<DeleteSecurityPolicyResponse>;
export interface ListSecurityPoliciesRequest {
  type: string;
  resource?: string[];
  nextToken?: string;
  maxResults?: number;
}
export const ListSecurityPoliciesRequest = S.suspend(() =>
  S.Struct({
    type: S.String,
    resource: S.optional(ResourceFilter),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSecurityPoliciesRequest",
}) as any as S.Schema<ListSecurityPoliciesRequest>;
export interface CreateVpcEndpointRequest {
  name: string;
  vpcId: string;
  subnetIds: string[];
  securityGroupIds?: string[];
  clientToken?: string;
}
export const CreateVpcEndpointRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    vpcId: S.String,
    subnetIds: SubnetIds,
    securityGroupIds: S.optional(SecurityGroupIds),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateVpcEndpointRequest",
}) as any as S.Schema<CreateVpcEndpointRequest>;
export interface DeleteVpcEndpointRequest {
  id: string;
  clientToken?: string;
}
export const DeleteVpcEndpointRequest = S.suspend(() =>
  S.Struct({
    id: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteVpcEndpointRequest",
}) as any as S.Schema<DeleteVpcEndpointRequest>;
export interface LifecyclePolicyResourceIdentifier {
  type: string;
  resource: string;
}
export const LifecyclePolicyResourceIdentifier = S.suspend(() =>
  S.Struct({ type: S.String, resource: S.String }),
).annotations({
  identifier: "LifecyclePolicyResourceIdentifier",
}) as any as S.Schema<LifecyclePolicyResourceIdentifier>;
export type LifecyclePolicyResourceIdentifiers =
  LifecyclePolicyResourceIdentifier[];
export const LifecyclePolicyResourceIdentifiers = S.Array(
  LifecyclePolicyResourceIdentifier,
);
export interface LifecyclePolicyIdentifier {
  type: string;
  name: string;
}
export const LifecyclePolicyIdentifier = S.suspend(() =>
  S.Struct({ type: S.String, name: S.String }),
).annotations({
  identifier: "LifecyclePolicyIdentifier",
}) as any as S.Schema<LifecyclePolicyIdentifier>;
export type LifecyclePolicyIdentifiers = LifecyclePolicyIdentifier[];
export const LifecyclePolicyIdentifiers = S.Array(LifecyclePolicyIdentifier);
export interface CapacityLimits {
  maxIndexingCapacityInOCU?: number;
  maxSearchCapacityInOCU?: number;
}
export const CapacityLimits = S.suspend(() =>
  S.Struct({
    maxIndexingCapacityInOCU: S.optional(S.Number),
    maxSearchCapacityInOCU: S.optional(S.Number),
  }),
).annotations({
  identifier: "CapacityLimits",
}) as any as S.Schema<CapacityLimits>;
export interface AccountSettingsDetail {
  capacityLimits?: CapacityLimits;
}
export const AccountSettingsDetail = S.suspend(() =>
  S.Struct({ capacityLimits: S.optional(CapacityLimits) }),
).annotations({
  identifier: "AccountSettingsDetail",
}) as any as S.Schema<AccountSettingsDetail>;
export interface AccessPolicyStats {
  DataPolicyCount?: number;
}
export const AccessPolicyStats = S.suspend(() =>
  S.Struct({ DataPolicyCount: S.optional(S.Number) }),
).annotations({
  identifier: "AccessPolicyStats",
}) as any as S.Schema<AccessPolicyStats>;
export interface SecurityPolicyStats {
  EncryptionPolicyCount?: number;
  NetworkPolicyCount?: number;
}
export const SecurityPolicyStats = S.suspend(() =>
  S.Struct({
    EncryptionPolicyCount: S.optional(S.Number),
    NetworkPolicyCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "SecurityPolicyStats",
}) as any as S.Schema<SecurityPolicyStats>;
export interface SecurityConfigStats {
  SamlConfigCount?: number;
}
export const SecurityConfigStats = S.suspend(() =>
  S.Struct({ SamlConfigCount: S.optional(S.Number) }),
).annotations({
  identifier: "SecurityConfigStats",
}) as any as S.Schema<SecurityConfigStats>;
export interface LifecyclePolicyStats {
  RetentionPolicyCount?: number;
}
export const LifecyclePolicyStats = S.suspend(() =>
  S.Struct({ RetentionPolicyCount: S.optional(S.Number) }),
).annotations({
  identifier: "LifecyclePolicyStats",
}) as any as S.Schema<LifecyclePolicyStats>;
export interface Tag {
  key: string;
  value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export interface VectorOptions {
  ServerlessVectorAcceleration: string;
}
export const VectorOptions = S.suspend(() =>
  S.Struct({ ServerlessVectorAcceleration: S.String }),
).annotations({
  identifier: "VectorOptions",
}) as any as S.Schema<VectorOptions>;
export interface CollectionFilters {
  name?: string;
  status?: string;
}
export const CollectionFilters = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), status: S.optional(S.String) }),
).annotations({
  identifier: "CollectionFilters",
}) as any as S.Schema<CollectionFilters>;
export interface SamlConfigOptions {
  metadata: string;
  userAttribute?: string;
  groupAttribute?: string;
  openSearchServerlessEntityId?: string;
  sessionTimeout?: number;
}
export const SamlConfigOptions = S.suspend(() =>
  S.Struct({
    metadata: S.String,
    userAttribute: S.optional(S.String),
    groupAttribute: S.optional(S.String),
    openSearchServerlessEntityId: S.optional(S.String),
    sessionTimeout: S.optional(S.Number),
  }),
).annotations({
  identifier: "SamlConfigOptions",
}) as any as S.Schema<SamlConfigOptions>;
export interface CreateIamIdentityCenterConfigOptions {
  instanceArn: string;
  userAttribute?: string;
  groupAttribute?: string;
}
export const CreateIamIdentityCenterConfigOptions = S.suspend(() =>
  S.Struct({
    instanceArn: S.String,
    userAttribute: S.optional(S.String),
    groupAttribute: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateIamIdentityCenterConfigOptions",
}) as any as S.Schema<CreateIamIdentityCenterConfigOptions>;
export interface IamFederationConfigOptions {
  groupAttribute?: string;
  userAttribute?: string;
}
export const IamFederationConfigOptions = S.suspend(() =>
  S.Struct({
    groupAttribute: S.optional(S.String),
    userAttribute: S.optional(S.String),
  }),
).annotations({
  identifier: "IamFederationConfigOptions",
}) as any as S.Schema<IamFederationConfigOptions>;
export interface UpdateIamIdentityCenterConfigOptions {
  userAttribute?: string;
  groupAttribute?: string;
}
export const UpdateIamIdentityCenterConfigOptions = S.suspend(() =>
  S.Struct({
    userAttribute: S.optional(S.String),
    groupAttribute: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateIamIdentityCenterConfigOptions",
}) as any as S.Schema<UpdateIamIdentityCenterConfigOptions>;
export interface VpcEndpointFilters {
  status?: string;
}
export const VpcEndpointFilters = S.suspend(() =>
  S.Struct({ status: S.optional(S.String) }),
).annotations({
  identifier: "VpcEndpointFilters",
}) as any as S.Schema<VpcEndpointFilters>;
export interface BatchGetEffectiveLifecyclePolicyRequest {
  resourceIdentifiers: LifecyclePolicyResourceIdentifier[];
}
export const BatchGetEffectiveLifecyclePolicyRequest = S.suspend(() =>
  S.Struct({ resourceIdentifiers: LifecyclePolicyResourceIdentifiers }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetEffectiveLifecyclePolicyRequest",
}) as any as S.Schema<BatchGetEffectiveLifecyclePolicyRequest>;
export interface BatchGetLifecyclePolicyRequest {
  identifiers: LifecyclePolicyIdentifier[];
}
export const BatchGetLifecyclePolicyRequest = S.suspend(() =>
  S.Struct({ identifiers: LifecyclePolicyIdentifiers }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetLifecyclePolicyRequest",
}) as any as S.Schema<BatchGetLifecyclePolicyRequest>;
export interface GetAccountSettingsResponse {
  accountSettingsDetail?: AccountSettingsDetail;
}
export const GetAccountSettingsResponse = S.suspend(() =>
  S.Struct({ accountSettingsDetail: S.optional(AccountSettingsDetail) }),
).annotations({
  identifier: "GetAccountSettingsResponse",
}) as any as S.Schema<GetAccountSettingsResponse>;
export interface GetPoliciesStatsResponse {
  AccessPolicyStats?: AccessPolicyStats;
  SecurityPolicyStats?: SecurityPolicyStats;
  SecurityConfigStats?: SecurityConfigStats;
  LifecyclePolicyStats?: LifecyclePolicyStats;
  TotalPolicyCount?: number;
}
export const GetPoliciesStatsResponse = S.suspend(() =>
  S.Struct({
    AccessPolicyStats: S.optional(AccessPolicyStats),
    SecurityPolicyStats: S.optional(SecurityPolicyStats),
    SecurityConfigStats: S.optional(SecurityConfigStats),
    LifecyclePolicyStats: S.optional(LifecyclePolicyStats),
    TotalPolicyCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "GetPoliciesStatsResponse",
}) as any as S.Schema<GetPoliciesStatsResponse>;
export interface ListTagsForResourceResponse {
  tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tags: Tags }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UpdateAccountSettingsRequest {
  capacityLimits?: CapacityLimits;
}
export const UpdateAccountSettingsRequest = S.suspend(() =>
  S.Struct({ capacityLimits: S.optional(CapacityLimits) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateAccountSettingsRequest",
}) as any as S.Schema<UpdateAccountSettingsRequest>;
export interface AccessPolicyDetail {
  type?: string;
  name?: string;
  policyVersion?: string;
  description?: string;
  policy?: any;
  createdDate?: number;
  lastModifiedDate?: number;
}
export const AccessPolicyDetail = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    name: S.optional(S.String),
    policyVersion: S.optional(S.String),
    description: S.optional(S.String),
    policy: S.optional(S.Any),
    createdDate: S.optional(S.Number),
    lastModifiedDate: S.optional(S.Number),
  }),
).annotations({
  identifier: "AccessPolicyDetail",
}) as any as S.Schema<AccessPolicyDetail>;
export interface GetAccessPolicyResponse {
  accessPolicyDetail?: AccessPolicyDetail;
}
export const GetAccessPolicyResponse = S.suspend(() =>
  S.Struct({ accessPolicyDetail: S.optional(AccessPolicyDetail) }),
).annotations({
  identifier: "GetAccessPolicyResponse",
}) as any as S.Schema<GetAccessPolicyResponse>;
export interface UpdateAccessPolicyResponse {
  accessPolicyDetail?: AccessPolicyDetail;
}
export const UpdateAccessPolicyResponse = S.suspend(() =>
  S.Struct({ accessPolicyDetail: S.optional(AccessPolicyDetail) }),
).annotations({
  identifier: "UpdateAccessPolicyResponse",
}) as any as S.Schema<UpdateAccessPolicyResponse>;
export interface CreateCollectionRequest {
  name: string;
  type?: string;
  description?: string;
  tags?: Tag[];
  standbyReplicas?: string;
  vectorOptions?: VectorOptions;
  clientToken?: string;
}
export const CreateCollectionRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    type: S.optional(S.String),
    description: S.optional(S.String),
    tags: S.optional(Tags),
    standbyReplicas: S.optional(S.String),
    vectorOptions: S.optional(VectorOptions),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateCollectionRequest",
}) as any as S.Schema<CreateCollectionRequest>;
export interface ListCollectionsRequest {
  collectionFilters?: CollectionFilters;
  nextToken?: string;
  maxResults?: number;
}
export const ListCollectionsRequest = S.suspend(() =>
  S.Struct({
    collectionFilters: S.optional(CollectionFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCollectionsRequest",
}) as any as S.Schema<ListCollectionsRequest>;
export interface GetIndexResponse {
  indexSchema?: any;
}
export const GetIndexResponse = S.suspend(() =>
  S.Struct({ indexSchema: S.optional(S.Any) }),
).annotations({
  identifier: "GetIndexResponse",
}) as any as S.Schema<GetIndexResponse>;
export interface LifecyclePolicyDetail {
  type?: string;
  name?: string;
  policyVersion?: string;
  description?: string;
  policy?: any;
  createdDate?: number;
  lastModifiedDate?: number;
}
export const LifecyclePolicyDetail = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    name: S.optional(S.String),
    policyVersion: S.optional(S.String),
    description: S.optional(S.String),
    policy: S.optional(S.Any),
    createdDate: S.optional(S.Number),
    lastModifiedDate: S.optional(S.Number),
  }),
).annotations({
  identifier: "LifecyclePolicyDetail",
}) as any as S.Schema<LifecyclePolicyDetail>;
export interface UpdateLifecyclePolicyResponse {
  lifecyclePolicyDetail?: LifecyclePolicyDetail;
}
export const UpdateLifecyclePolicyResponse = S.suspend(() =>
  S.Struct({ lifecyclePolicyDetail: S.optional(LifecyclePolicyDetail) }),
).annotations({
  identifier: "UpdateLifecyclePolicyResponse",
}) as any as S.Schema<UpdateLifecyclePolicyResponse>;
export interface CreateSecurityConfigRequest {
  type: string;
  name: string;
  description?: string;
  samlOptions?: SamlConfigOptions;
  iamIdentityCenterOptions?: CreateIamIdentityCenterConfigOptions;
  iamFederationOptions?: IamFederationConfigOptions;
  clientToken?: string;
}
export const CreateSecurityConfigRequest = S.suspend(() =>
  S.Struct({
    type: S.String,
    name: S.String,
    description: S.optional(S.String),
    samlOptions: S.optional(SamlConfigOptions),
    iamIdentityCenterOptions: S.optional(CreateIamIdentityCenterConfigOptions),
    iamFederationOptions: S.optional(IamFederationConfigOptions),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateSecurityConfigRequest",
}) as any as S.Schema<CreateSecurityConfigRequest>;
export interface UpdateSecurityConfigRequest {
  id: string;
  configVersion: string;
  description?: string;
  samlOptions?: SamlConfigOptions;
  iamIdentityCenterOptionsUpdates?: UpdateIamIdentityCenterConfigOptions;
  iamFederationOptions?: IamFederationConfigOptions;
  clientToken?: string;
}
export const UpdateSecurityConfigRequest = S.suspend(() =>
  S.Struct({
    id: S.String,
    configVersion: S.String,
    description: S.optional(S.String),
    samlOptions: S.optional(SamlConfigOptions),
    iamIdentityCenterOptionsUpdates: S.optional(
      UpdateIamIdentityCenterConfigOptions,
    ),
    iamFederationOptions: S.optional(IamFederationConfigOptions),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateSecurityConfigRequest",
}) as any as S.Schema<UpdateSecurityConfigRequest>;
export interface SecurityPolicyDetail {
  type?: string;
  name?: string;
  policyVersion?: string;
  description?: string;
  policy?: any;
  createdDate?: number;
  lastModifiedDate?: number;
}
export const SecurityPolicyDetail = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    name: S.optional(S.String),
    policyVersion: S.optional(S.String),
    description: S.optional(S.String),
    policy: S.optional(S.Any),
    createdDate: S.optional(S.Number),
    lastModifiedDate: S.optional(S.Number),
  }),
).annotations({
  identifier: "SecurityPolicyDetail",
}) as any as S.Schema<SecurityPolicyDetail>;
export interface GetSecurityPolicyResponse {
  securityPolicyDetail?: SecurityPolicyDetail;
}
export const GetSecurityPolicyResponse = S.suspend(() =>
  S.Struct({ securityPolicyDetail: S.optional(SecurityPolicyDetail) }),
).annotations({
  identifier: "GetSecurityPolicyResponse",
}) as any as S.Schema<GetSecurityPolicyResponse>;
export interface UpdateSecurityPolicyResponse {
  securityPolicyDetail?: SecurityPolicyDetail;
}
export const UpdateSecurityPolicyResponse = S.suspend(() =>
  S.Struct({ securityPolicyDetail: S.optional(SecurityPolicyDetail) }),
).annotations({
  identifier: "UpdateSecurityPolicyResponse",
}) as any as S.Schema<UpdateSecurityPolicyResponse>;
export interface ListVpcEndpointsRequest {
  vpcEndpointFilters?: VpcEndpointFilters;
  nextToken?: string;
  maxResults?: number;
}
export const ListVpcEndpointsRequest = S.suspend(() =>
  S.Struct({
    vpcEndpointFilters: S.optional(VpcEndpointFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListVpcEndpointsRequest",
}) as any as S.Schema<ListVpcEndpointsRequest>;
export interface CollectionErrorDetail {
  id?: string;
  name?: string;
  errorMessage?: string;
  errorCode?: string;
}
export const CollectionErrorDetail = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    errorMessage: S.optional(S.String),
    errorCode: S.optional(S.String),
  }),
).annotations({
  identifier: "CollectionErrorDetail",
}) as any as S.Schema<CollectionErrorDetail>;
export type CollectionErrorDetails = CollectionErrorDetail[];
export const CollectionErrorDetails = S.Array(CollectionErrorDetail);
export type LifecyclePolicyDetails = LifecyclePolicyDetail[];
export const LifecyclePolicyDetails = S.Array(LifecyclePolicyDetail);
export interface VpcEndpointDetail {
  id?: string;
  name?: string;
  vpcId?: string;
  subnetIds?: string[];
  securityGroupIds?: string[];
  status?: string;
  createdDate?: number;
  failureCode?: string;
  failureMessage?: string;
}
export const VpcEndpointDetail = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    vpcId: S.optional(S.String),
    subnetIds: S.optional(SubnetIds),
    securityGroupIds: S.optional(SecurityGroupIds),
    status: S.optional(S.String),
    createdDate: S.optional(S.Number),
    failureCode: S.optional(S.String),
    failureMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "VpcEndpointDetail",
}) as any as S.Schema<VpcEndpointDetail>;
export type VpcEndpointDetails = VpcEndpointDetail[];
export const VpcEndpointDetails = S.Array(VpcEndpointDetail);
export interface VpcEndpointErrorDetail {
  id?: string;
  errorMessage?: string;
  errorCode?: string;
}
export const VpcEndpointErrorDetail = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    errorMessage: S.optional(S.String),
    errorCode: S.optional(S.String),
  }),
).annotations({
  identifier: "VpcEndpointErrorDetail",
}) as any as S.Schema<VpcEndpointErrorDetail>;
export type VpcEndpointErrorDetails = VpcEndpointErrorDetail[];
export const VpcEndpointErrorDetails = S.Array(VpcEndpointErrorDetail);
export interface UpdateVpcEndpointDetail {
  id?: string;
  name?: string;
  status?: string;
  subnetIds?: string[];
  securityGroupIds?: string[];
  lastModifiedDate?: number;
}
export const UpdateVpcEndpointDetail = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    status: S.optional(S.String),
    subnetIds: S.optional(SubnetIds),
    securityGroupIds: S.optional(SecurityGroupIds),
    lastModifiedDate: S.optional(S.Number),
  }),
).annotations({
  identifier: "UpdateVpcEndpointDetail",
}) as any as S.Schema<UpdateVpcEndpointDetail>;
export interface AccessPolicySummary {
  type?: string;
  name?: string;
  policyVersion?: string;
  description?: string;
  createdDate?: number;
  lastModifiedDate?: number;
}
export const AccessPolicySummary = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    name: S.optional(S.String),
    policyVersion: S.optional(S.String),
    description: S.optional(S.String),
    createdDate: S.optional(S.Number),
    lastModifiedDate: S.optional(S.Number),
  }),
).annotations({
  identifier: "AccessPolicySummary",
}) as any as S.Schema<AccessPolicySummary>;
export type AccessPolicySummaries = AccessPolicySummary[];
export const AccessPolicySummaries = S.Array(AccessPolicySummary);
export interface UpdateCollectionDetail {
  id?: string;
  name?: string;
  status?: string;
  type?: string;
  description?: string;
  arn?: string;
  createdDate?: number;
  lastModifiedDate?: number;
}
export const UpdateCollectionDetail = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    status: S.optional(S.String),
    type: S.optional(S.String),
    description: S.optional(S.String),
    arn: S.optional(S.String),
    createdDate: S.optional(S.Number),
    lastModifiedDate: S.optional(S.Number),
  }),
).annotations({
  identifier: "UpdateCollectionDetail",
}) as any as S.Schema<UpdateCollectionDetail>;
export interface DeleteCollectionDetail {
  id?: string;
  name?: string;
  status?: string;
}
export const DeleteCollectionDetail = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    status: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteCollectionDetail",
}) as any as S.Schema<DeleteCollectionDetail>;
export interface LifecyclePolicySummary {
  type?: string;
  name?: string;
  policyVersion?: string;
  description?: string;
  createdDate?: number;
  lastModifiedDate?: number;
}
export const LifecyclePolicySummary = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    name: S.optional(S.String),
    policyVersion: S.optional(S.String),
    description: S.optional(S.String),
    createdDate: S.optional(S.Number),
    lastModifiedDate: S.optional(S.Number),
  }),
).annotations({
  identifier: "LifecyclePolicySummary",
}) as any as S.Schema<LifecyclePolicySummary>;
export type LifecyclePolicySummaries = LifecyclePolicySummary[];
export const LifecyclePolicySummaries = S.Array(LifecyclePolicySummary);
export interface SecurityConfigSummary {
  id?: string;
  type?: string;
  configVersion?: string;
  description?: string;
  createdDate?: number;
  lastModifiedDate?: number;
}
export const SecurityConfigSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    type: S.optional(S.String),
    configVersion: S.optional(S.String),
    description: S.optional(S.String),
    createdDate: S.optional(S.Number),
    lastModifiedDate: S.optional(S.Number),
  }),
).annotations({
  identifier: "SecurityConfigSummary",
}) as any as S.Schema<SecurityConfigSummary>;
export type SecurityConfigSummaries = SecurityConfigSummary[];
export const SecurityConfigSummaries = S.Array(SecurityConfigSummary);
export interface SecurityPolicySummary {
  type?: string;
  name?: string;
  policyVersion?: string;
  description?: string;
  createdDate?: number;
  lastModifiedDate?: number;
}
export const SecurityPolicySummary = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    name: S.optional(S.String),
    policyVersion: S.optional(S.String),
    description: S.optional(S.String),
    createdDate: S.optional(S.Number),
    lastModifiedDate: S.optional(S.Number),
  }),
).annotations({
  identifier: "SecurityPolicySummary",
}) as any as S.Schema<SecurityPolicySummary>;
export type SecurityPolicySummaries = SecurityPolicySummary[];
export const SecurityPolicySummaries = S.Array(SecurityPolicySummary);
export interface CreateVpcEndpointDetail {
  id?: string;
  name?: string;
  status?: string;
}
export const CreateVpcEndpointDetail = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    status: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateVpcEndpointDetail",
}) as any as S.Schema<CreateVpcEndpointDetail>;
export interface DeleteVpcEndpointDetail {
  id?: string;
  name?: string;
  status?: string;
}
export const DeleteVpcEndpointDetail = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    status: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteVpcEndpointDetail",
}) as any as S.Schema<DeleteVpcEndpointDetail>;
export interface BatchGetVpcEndpointResponse {
  vpcEndpointDetails?: VpcEndpointDetail[];
  vpcEndpointErrorDetails?: VpcEndpointErrorDetail[];
}
export const BatchGetVpcEndpointResponse = S.suspend(() =>
  S.Struct({
    vpcEndpointDetails: S.optional(VpcEndpointDetails),
    vpcEndpointErrorDetails: S.optional(VpcEndpointErrorDetails),
  }),
).annotations({
  identifier: "BatchGetVpcEndpointResponse",
}) as any as S.Schema<BatchGetVpcEndpointResponse>;
export interface CreateLifecyclePolicyResponse {
  lifecyclePolicyDetail?: LifecyclePolicyDetail;
}
export const CreateLifecyclePolicyResponse = S.suspend(() =>
  S.Struct({ lifecyclePolicyDetail: S.optional(LifecyclePolicyDetail) }),
).annotations({
  identifier: "CreateLifecyclePolicyResponse",
}) as any as S.Schema<CreateLifecyclePolicyResponse>;
export interface CreateSecurityPolicyResponse {
  securityPolicyDetail?: SecurityPolicyDetail;
}
export const CreateSecurityPolicyResponse = S.suspend(() =>
  S.Struct({ securityPolicyDetail: S.optional(SecurityPolicyDetail) }),
).annotations({
  identifier: "CreateSecurityPolicyResponse",
}) as any as S.Schema<CreateSecurityPolicyResponse>;
export interface UpdateAccountSettingsResponse {
  accountSettingsDetail?: AccountSettingsDetail;
}
export const UpdateAccountSettingsResponse = S.suspend(() =>
  S.Struct({ accountSettingsDetail: S.optional(AccountSettingsDetail) }),
).annotations({
  identifier: "UpdateAccountSettingsResponse",
}) as any as S.Schema<UpdateAccountSettingsResponse>;
export interface UpdateVpcEndpointResponse {
  UpdateVpcEndpointDetail?: UpdateVpcEndpointDetail;
}
export const UpdateVpcEndpointResponse = S.suspend(() =>
  S.Struct({ UpdateVpcEndpointDetail: S.optional(UpdateVpcEndpointDetail) }),
).annotations({
  identifier: "UpdateVpcEndpointResponse",
}) as any as S.Schema<UpdateVpcEndpointResponse>;
export interface CreateAccessPolicyResponse {
  accessPolicyDetail?: AccessPolicyDetail;
}
export const CreateAccessPolicyResponse = S.suspend(() =>
  S.Struct({ accessPolicyDetail: S.optional(AccessPolicyDetail) }),
).annotations({
  identifier: "CreateAccessPolicyResponse",
}) as any as S.Schema<CreateAccessPolicyResponse>;
export interface ListAccessPoliciesResponse {
  accessPolicySummaries?: AccessPolicySummary[];
  nextToken?: string;
}
export const ListAccessPoliciesResponse = S.suspend(() =>
  S.Struct({
    accessPolicySummaries: S.optional(AccessPolicySummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAccessPoliciesResponse",
}) as any as S.Schema<ListAccessPoliciesResponse>;
export interface UpdateCollectionResponse {
  updateCollectionDetail?: UpdateCollectionDetail;
}
export const UpdateCollectionResponse = S.suspend(() =>
  S.Struct({ updateCollectionDetail: S.optional(UpdateCollectionDetail) }),
).annotations({
  identifier: "UpdateCollectionResponse",
}) as any as S.Schema<UpdateCollectionResponse>;
export interface DeleteCollectionResponse {
  deleteCollectionDetail?: DeleteCollectionDetail;
}
export const DeleteCollectionResponse = S.suspend(() =>
  S.Struct({ deleteCollectionDetail: S.optional(DeleteCollectionDetail) }),
).annotations({
  identifier: "DeleteCollectionResponse",
}) as any as S.Schema<DeleteCollectionResponse>;
export interface ListLifecyclePoliciesResponse {
  lifecyclePolicySummaries?: LifecyclePolicySummary[];
  nextToken?: string;
}
export const ListLifecyclePoliciesResponse = S.suspend(() =>
  S.Struct({
    lifecyclePolicySummaries: S.optional(LifecyclePolicySummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLifecyclePoliciesResponse",
}) as any as S.Schema<ListLifecyclePoliciesResponse>;
export interface IamIdentityCenterConfigOptions {
  instanceArn?: string;
  applicationArn?: string;
  applicationName?: string;
  applicationDescription?: string;
  userAttribute?: string;
  groupAttribute?: string;
}
export const IamIdentityCenterConfigOptions = S.suspend(() =>
  S.Struct({
    instanceArn: S.optional(S.String),
    applicationArn: S.optional(S.String),
    applicationName: S.optional(S.String),
    applicationDescription: S.optional(S.String),
    userAttribute: S.optional(S.String),
    groupAttribute: S.optional(S.String),
  }),
).annotations({
  identifier: "IamIdentityCenterConfigOptions",
}) as any as S.Schema<IamIdentityCenterConfigOptions>;
export interface SecurityConfigDetail {
  id?: string;
  type?: string;
  configVersion?: string;
  description?: string;
  samlOptions?: SamlConfigOptions;
  iamIdentityCenterOptions?: IamIdentityCenterConfigOptions;
  iamFederationOptions?: IamFederationConfigOptions;
  createdDate?: number;
  lastModifiedDate?: number;
}
export const SecurityConfigDetail = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    type: S.optional(S.String),
    configVersion: S.optional(S.String),
    description: S.optional(S.String),
    samlOptions: S.optional(SamlConfigOptions),
    iamIdentityCenterOptions: S.optional(IamIdentityCenterConfigOptions),
    iamFederationOptions: S.optional(IamFederationConfigOptions),
    createdDate: S.optional(S.Number),
    lastModifiedDate: S.optional(S.Number),
  }),
).annotations({
  identifier: "SecurityConfigDetail",
}) as any as S.Schema<SecurityConfigDetail>;
export interface CreateSecurityConfigResponse {
  securityConfigDetail?: SecurityConfigDetail;
}
export const CreateSecurityConfigResponse = S.suspend(() =>
  S.Struct({ securityConfigDetail: S.optional(SecurityConfigDetail) }),
).annotations({
  identifier: "CreateSecurityConfigResponse",
}) as any as S.Schema<CreateSecurityConfigResponse>;
export interface UpdateSecurityConfigResponse {
  securityConfigDetail?: SecurityConfigDetail;
}
export const UpdateSecurityConfigResponse = S.suspend(() =>
  S.Struct({ securityConfigDetail: S.optional(SecurityConfigDetail) }),
).annotations({
  identifier: "UpdateSecurityConfigResponse",
}) as any as S.Schema<UpdateSecurityConfigResponse>;
export interface ListSecurityConfigsResponse {
  securityConfigSummaries?: SecurityConfigSummary[];
  nextToken?: string;
}
export const ListSecurityConfigsResponse = S.suspend(() =>
  S.Struct({
    securityConfigSummaries: S.optional(SecurityConfigSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSecurityConfigsResponse",
}) as any as S.Schema<ListSecurityConfigsResponse>;
export interface ListSecurityPoliciesResponse {
  securityPolicySummaries?: SecurityPolicySummary[];
  nextToken?: string;
}
export const ListSecurityPoliciesResponse = S.suspend(() =>
  S.Struct({
    securityPolicySummaries: S.optional(SecurityPolicySummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSecurityPoliciesResponse",
}) as any as S.Schema<ListSecurityPoliciesResponse>;
export interface CreateVpcEndpointResponse {
  createVpcEndpointDetail?: CreateVpcEndpointDetail;
}
export const CreateVpcEndpointResponse = S.suspend(() =>
  S.Struct({ createVpcEndpointDetail: S.optional(CreateVpcEndpointDetail) }),
).annotations({
  identifier: "CreateVpcEndpointResponse",
}) as any as S.Schema<CreateVpcEndpointResponse>;
export interface DeleteVpcEndpointResponse {
  deleteVpcEndpointDetail?: DeleteVpcEndpointDetail;
}
export const DeleteVpcEndpointResponse = S.suspend(() =>
  S.Struct({ deleteVpcEndpointDetail: S.optional(DeleteVpcEndpointDetail) }),
).annotations({
  identifier: "DeleteVpcEndpointResponse",
}) as any as S.Schema<DeleteVpcEndpointResponse>;
export interface FipsEndpoints {
  collectionEndpoint?: string;
  dashboardEndpoint?: string;
}
export const FipsEndpoints = S.suspend(() =>
  S.Struct({
    collectionEndpoint: S.optional(S.String),
    dashboardEndpoint: S.optional(S.String),
  }),
).annotations({
  identifier: "FipsEndpoints",
}) as any as S.Schema<FipsEndpoints>;
export interface CollectionDetail {
  id?: string;
  name?: string;
  status?: string;
  type?: string;
  description?: string;
  arn?: string;
  kmsKeyArn?: string;
  standbyReplicas?: string;
  vectorOptions?: VectorOptions;
  createdDate?: number;
  lastModifiedDate?: number;
  collectionEndpoint?: string;
  dashboardEndpoint?: string;
  fipsEndpoints?: FipsEndpoints;
  failureCode?: string;
  failureMessage?: string;
}
export const CollectionDetail = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    status: S.optional(S.String),
    type: S.optional(S.String),
    description: S.optional(S.String),
    arn: S.optional(S.String),
    kmsKeyArn: S.optional(S.String),
    standbyReplicas: S.optional(S.String),
    vectorOptions: S.optional(VectorOptions),
    createdDate: S.optional(S.Number),
    lastModifiedDate: S.optional(S.Number),
    collectionEndpoint: S.optional(S.String),
    dashboardEndpoint: S.optional(S.String),
    fipsEndpoints: S.optional(FipsEndpoints),
    failureCode: S.optional(S.String),
    failureMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "CollectionDetail",
}) as any as S.Schema<CollectionDetail>;
export type CollectionDetails = CollectionDetail[];
export const CollectionDetails = S.Array(CollectionDetail);
export interface EffectiveLifecyclePolicyDetail {
  type?: string;
  resource?: string;
  policyName?: string;
  resourceType?: string;
  retentionPeriod?: string;
  noMinRetentionPeriod?: boolean;
}
export const EffectiveLifecyclePolicyDetail = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    resource: S.optional(S.String),
    policyName: S.optional(S.String),
    resourceType: S.optional(S.String),
    retentionPeriod: S.optional(S.String),
    noMinRetentionPeriod: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "EffectiveLifecyclePolicyDetail",
}) as any as S.Schema<EffectiveLifecyclePolicyDetail>;
export type EffectiveLifecyclePolicyDetails = EffectiveLifecyclePolicyDetail[];
export const EffectiveLifecyclePolicyDetails = S.Array(
  EffectiveLifecyclePolicyDetail,
);
export interface EffectiveLifecyclePolicyErrorDetail {
  type?: string;
  resource?: string;
  errorMessage?: string;
  errorCode?: string;
}
export const EffectiveLifecyclePolicyErrorDetail = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    resource: S.optional(S.String),
    errorMessage: S.optional(S.String),
    errorCode: S.optional(S.String),
  }),
).annotations({
  identifier: "EffectiveLifecyclePolicyErrorDetail",
}) as any as S.Schema<EffectiveLifecyclePolicyErrorDetail>;
export type EffectiveLifecyclePolicyErrorDetails =
  EffectiveLifecyclePolicyErrorDetail[];
export const EffectiveLifecyclePolicyErrorDetails = S.Array(
  EffectiveLifecyclePolicyErrorDetail,
);
export interface LifecyclePolicyErrorDetail {
  type?: string;
  name?: string;
  errorMessage?: string;
  errorCode?: string;
}
export const LifecyclePolicyErrorDetail = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    name: S.optional(S.String),
    errorMessage: S.optional(S.String),
    errorCode: S.optional(S.String),
  }),
).annotations({
  identifier: "LifecyclePolicyErrorDetail",
}) as any as S.Schema<LifecyclePolicyErrorDetail>;
export type LifecyclePolicyErrorDetails = LifecyclePolicyErrorDetail[];
export const LifecyclePolicyErrorDetails = S.Array(LifecyclePolicyErrorDetail);
export interface CreateCollectionDetail {
  id?: string;
  name?: string;
  status?: string;
  type?: string;
  description?: string;
  arn?: string;
  kmsKeyArn?: string;
  standbyReplicas?: string;
  vectorOptions?: VectorOptions;
  createdDate?: number;
  lastModifiedDate?: number;
}
export const CreateCollectionDetail = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    status: S.optional(S.String),
    type: S.optional(S.String),
    description: S.optional(S.String),
    arn: S.optional(S.String),
    kmsKeyArn: S.optional(S.String),
    standbyReplicas: S.optional(S.String),
    vectorOptions: S.optional(VectorOptions),
    createdDate: S.optional(S.Number),
    lastModifiedDate: S.optional(S.Number),
  }),
).annotations({
  identifier: "CreateCollectionDetail",
}) as any as S.Schema<CreateCollectionDetail>;
export interface CollectionSummary {
  id?: string;
  name?: string;
  status?: string;
  arn?: string;
}
export const CollectionSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    status: S.optional(S.String),
    arn: S.optional(S.String),
  }),
).annotations({
  identifier: "CollectionSummary",
}) as any as S.Schema<CollectionSummary>;
export type CollectionSummaries = CollectionSummary[];
export const CollectionSummaries = S.Array(CollectionSummary);
export interface VpcEndpointSummary {
  id?: string;
  name?: string;
  status?: string;
}
export const VpcEndpointSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    status: S.optional(S.String),
  }),
).annotations({
  identifier: "VpcEndpointSummary",
}) as any as S.Schema<VpcEndpointSummary>;
export type VpcEndpointSummaries = VpcEndpointSummary[];
export const VpcEndpointSummaries = S.Array(VpcEndpointSummary);
export interface BatchGetCollectionResponse {
  collectionDetails?: CollectionDetail[];
  collectionErrorDetails?: CollectionErrorDetail[];
}
export const BatchGetCollectionResponse = S.suspend(() =>
  S.Struct({
    collectionDetails: S.optional(CollectionDetails),
    collectionErrorDetails: S.optional(CollectionErrorDetails),
  }),
).annotations({
  identifier: "BatchGetCollectionResponse",
}) as any as S.Schema<BatchGetCollectionResponse>;
export interface BatchGetEffectiveLifecyclePolicyResponse {
  effectiveLifecyclePolicyDetails?: EffectiveLifecyclePolicyDetail[];
  effectiveLifecyclePolicyErrorDetails?: EffectiveLifecyclePolicyErrorDetail[];
}
export const BatchGetEffectiveLifecyclePolicyResponse = S.suspend(() =>
  S.Struct({
    effectiveLifecyclePolicyDetails: S.optional(
      EffectiveLifecyclePolicyDetails,
    ),
    effectiveLifecyclePolicyErrorDetails: S.optional(
      EffectiveLifecyclePolicyErrorDetails,
    ),
  }),
).annotations({
  identifier: "BatchGetEffectiveLifecyclePolicyResponse",
}) as any as S.Schema<BatchGetEffectiveLifecyclePolicyResponse>;
export interface BatchGetLifecyclePolicyResponse {
  lifecyclePolicyDetails?: LifecyclePolicyDetail[];
  lifecyclePolicyErrorDetails?: LifecyclePolicyErrorDetail[];
}
export const BatchGetLifecyclePolicyResponse = S.suspend(() =>
  S.Struct({
    lifecyclePolicyDetails: S.optional(LifecyclePolicyDetails),
    lifecyclePolicyErrorDetails: S.optional(LifecyclePolicyErrorDetails),
  }),
).annotations({
  identifier: "BatchGetLifecyclePolicyResponse",
}) as any as S.Schema<BatchGetLifecyclePolicyResponse>;
export interface CreateCollectionResponse {
  createCollectionDetail?: CreateCollectionDetail;
}
export const CreateCollectionResponse = S.suspend(() =>
  S.Struct({ createCollectionDetail: S.optional(CreateCollectionDetail) }),
).annotations({
  identifier: "CreateCollectionResponse",
}) as any as S.Schema<CreateCollectionResponse>;
export interface ListCollectionsResponse {
  collectionSummaries?: CollectionSummary[];
  nextToken?: string;
}
export const ListCollectionsResponse = S.suspend(() =>
  S.Struct({
    collectionSummaries: S.optional(CollectionSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCollectionsResponse",
}) as any as S.Schema<ListCollectionsResponse>;
export interface GetSecurityConfigResponse {
  securityConfigDetail?: SecurityConfigDetail;
}
export const GetSecurityConfigResponse = S.suspend(() =>
  S.Struct({ securityConfigDetail: S.optional(SecurityConfigDetail) }),
).annotations({
  identifier: "GetSecurityConfigResponse",
}) as any as S.Schema<GetSecurityConfigResponse>;
export interface ListVpcEndpointsResponse {
  vpcEndpointSummaries?: VpcEndpointSummary[];
  nextToken?: string;
}
export const ListVpcEndpointsResponse = S.suspend(() =>
  S.Struct({
    vpcEndpointSummaries: S.optional(VpcEndpointSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListVpcEndpointsResponse",
}) as any as S.Schema<ListVpcEndpointsResponse>;

//# Errors
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
    serviceCode: S.String,
    quotaCode: S.optional(S.String),
  },
).pipe(C.withQuotaError) {}
export class OcuLimitExceededException extends S.TaggedError<OcuLimitExceededException>()(
  "OcuLimitExceededException",
  { message: S.String },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Returns statistical information about your OpenSearch Serverless access policies, security configurations, and security policies.
 */
export const getPoliciesStats: (
  input: GetPoliciesStatsRequest,
) => effect.Effect<
  GetPoliciesStatsResponse,
  InternalServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPoliciesStatsRequest,
  output: GetPoliciesStatsResponse,
  errors: [InternalServerException],
}));
/**
 * Returns account-level settings related to OpenSearch Serverless.
 */
export const getAccountSettings: (
  input: GetAccountSettingsRequest,
) => effect.Effect<
  GetAccountSettingsResponse,
  InternalServerException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountSettingsRequest,
  output: GetAccountSettingsResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Returns information about a configured OpenSearch Serverless security policy. For more information, see Network access for Amazon OpenSearch Serverless and Encryption at rest for Amazon OpenSearch Serverless.
 */
export const getSecurityPolicy: (
  input: GetSecurityPolicyRequest,
) => effect.Effect<
  GetSecurityPolicyResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSecurityPolicyRequest,
  output: GetSecurityPolicyResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes an OpenSearch Serverless access policy. For more information, see Data access control for Amazon OpenSearch Serverless.
 */
export const deleteAccessPolicy: (
  input: DeleteAccessPolicyRequest,
) => effect.Effect<
  DeleteAccessPolicyResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessPolicyRequest,
  output: DeleteAccessPolicyResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates an index within an OpenSearch Serverless collection. Unlike other OpenSearch indexes, indexes created by this API are automatically configured to conduct automatic semantic enrichment ingestion and search. For more information, see About automatic semantic enrichment in the *OpenSearch User Guide*.
 */
export const createIndex: (
  input: CreateIndexRequest,
) => effect.Effect<
  CreateIndexResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIndexRequest,
  output: CreateIndexResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes an OpenSearch Serverless lifecycle policy. For more information, see Deleting data lifecycle policies.
 */
export const deleteLifecyclePolicy: (
  input: DeleteLifecyclePolicyRequest,
) => effect.Effect<
  DeleteLifecyclePolicyResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLifecyclePolicyRequest,
  output: DeleteLifecyclePolicyResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a security configuration for OpenSearch Serverless. For more information, see SAML authentication for Amazon OpenSearch Serverless.
 */
export const deleteSecurityConfig: (
  input: DeleteSecurityConfigRequest,
) => effect.Effect<
  DeleteSecurityConfigResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSecurityConfigRequest,
  output: DeleteSecurityConfigResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes an OpenSearch Serverless security policy.
 */
export const deleteSecurityPolicy: (
  input: DeleteSecurityPolicyRequest,
) => effect.Effect<
  DeleteSecurityPolicyResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSecurityPolicyRequest,
  output: DeleteSecurityPolicyResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes an index from an OpenSearch Serverless collection. Be aware that the index might be configured to conduct automatic semantic enrichment ingestion and search. For more information, see About automatic semantic enrichment.
 */
export const deleteIndex: (
  input: DeleteIndexRequest,
) => effect.Effect<
  DeleteIndexResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIndexRequest,
  output: DeleteIndexResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns the tags for an OpenSearch Serverless resource. For more information, see Tagging Amazon OpenSearch Serverless collections.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes a tag or set of tags from an OpenSearch Serverless resource. For more information, see Tagging Amazon OpenSearch Serverless collections.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns an OpenSearch Serverless access policy. For more information, see Data access control for Amazon OpenSearch Serverless.
 */
export const getAccessPolicy: (
  input: GetAccessPolicyRequest,
) => effect.Effect<
  GetAccessPolicyResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccessPolicyRequest,
  output: GetAccessPolicyResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates an OpenSearch Serverless access policy. For more information, see Data access control for Amazon OpenSearch Serverless.
 */
export const updateAccessPolicy: (
  input: UpdateAccessPolicyRequest,
) => effect.Effect<
  UpdateAccessPolicyResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccessPolicyRequest,
  output: UpdateAccessPolicyResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about an index in an OpenSearch Serverless collection, including its schema definition. The index might be configured to conduct automatic semantic enrichment ingestion and search. For more information, see About automatic semantic enrichment.
 */
export const getIndex: (
  input: GetIndexRequest,
) => effect.Effect<
  GetIndexResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIndexRequest,
  output: GetIndexResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes an OpenSearch Serverless collection. For more information, see Creating and managing Amazon OpenSearch Serverless collections.
 */
export const deleteCollection: (
  input: DeleteCollectionRequest,
) => effect.Effect<
  DeleteCollectionResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCollectionRequest,
  output: DeleteCollectionResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns attributes for one or more VPC endpoints associated with the current account. For more information, see Access Amazon OpenSearch Serverless using an interface endpoint.
 */
export const batchGetVpcEndpoint: (
  input: BatchGetVpcEndpointRequest,
) => effect.Effect<
  BatchGetVpcEndpointResponse,
  InternalServerException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetVpcEndpointRequest,
  output: BatchGetVpcEndpointResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Updates an OpenSearch Serverless-managed interface endpoint. For more information, see Access Amazon OpenSearch Serverless using an interface endpoint.
 */
export const updateVpcEndpoint: (
  input: UpdateVpcEndpointRequest,
) => effect.Effect<
  UpdateVpcEndpointResponse,
  | ConflictException
  | InternalServerException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVpcEndpointRequest,
  output: UpdateVpcEndpointResponse,
  errors: [ConflictException, InternalServerException, ValidationException],
}));
/**
 * Returns information about a list of OpenSearch Serverless access policies.
 */
export const listAccessPolicies: {
  (
    input: ListAccessPoliciesRequest,
  ): effect.Effect<
    ListAccessPoliciesResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccessPoliciesRequest,
  ) => stream.Stream<
    ListAccessPoliciesResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAccessPoliciesRequest,
  ) => stream.Stream<
    unknown,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccessPoliciesRequest,
  output: ListAccessPoliciesResponse,
  errors: [InternalServerException, ValidationException],
  pagination: { inputToken: "nextToken", outputToken: "nextToken" } as const,
}));
/**
 * Updates an OpenSearch Serverless collection.
 */
export const updateCollection: (
  input: UpdateCollectionRequest,
) => effect.Effect<
  UpdateCollectionResponse,
  | ConflictException
  | InternalServerException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCollectionRequest,
  output: UpdateCollectionResponse,
  errors: [ConflictException, InternalServerException, ValidationException],
}));
/**
 * Updates an existing index in an OpenSearch Serverless collection. This operation allows you to modify the index schema, including adding new fields or changing field mappings. You can also enable automatic semantic enrichment ingestion and search. For more information, see About automatic semantic enrichment.
 */
export const updateIndex: (
  input: UpdateIndexRequest,
) => effect.Effect<
  UpdateIndexResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIndexRequest,
  output: UpdateIndexResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a list of OpenSearch Serverless lifecycle policies. For more information, see Viewing data lifecycle policies.
 */
export const listLifecyclePolicies: {
  (
    input: ListLifecyclePoliciesRequest,
  ): effect.Effect<
    ListLifecyclePoliciesResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLifecyclePoliciesRequest,
  ) => stream.Stream<
    ListLifecyclePoliciesResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLifecyclePoliciesRequest,
  ) => stream.Stream<
    unknown,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLifecyclePoliciesRequest,
  output: ListLifecyclePoliciesResponse,
  errors: [InternalServerException, ValidationException],
  pagination: { inputToken: "nextToken", outputToken: "nextToken" } as const,
}));
/**
 * Updates a security configuration for OpenSearch Serverless. For more information, see SAML authentication for Amazon OpenSearch Serverless.
 */
export const updateSecurityConfig: (
  input: UpdateSecurityConfigRequest,
) => effect.Effect<
  UpdateSecurityConfigResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSecurityConfigRequest,
  output: UpdateSecurityConfigResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information about configured OpenSearch Serverless security configurations. For more information, see SAML authentication for Amazon OpenSearch Serverless.
 */
export const listSecurityConfigs: {
  (
    input: ListSecurityConfigsRequest,
  ): effect.Effect<
    ListSecurityConfigsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSecurityConfigsRequest,
  ) => stream.Stream<
    ListSecurityConfigsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSecurityConfigsRequest,
  ) => stream.Stream<
    unknown,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSecurityConfigsRequest,
  output: ListSecurityConfigsResponse,
  errors: [InternalServerException, ValidationException],
  pagination: { inputToken: "nextToken", outputToken: "nextToken" } as const,
}));
/**
 * Returns information about configured OpenSearch Serverless security policies.
 */
export const listSecurityPolicies: {
  (
    input: ListSecurityPoliciesRequest,
  ): effect.Effect<
    ListSecurityPoliciesResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSecurityPoliciesRequest,
  ) => stream.Stream<
    ListSecurityPoliciesResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSecurityPoliciesRequest,
  ) => stream.Stream<
    unknown,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSecurityPoliciesRequest,
  output: ListSecurityPoliciesResponse,
  errors: [InternalServerException, ValidationException],
  pagination: { inputToken: "nextToken", outputToken: "nextToken" } as const,
}));
/**
 * Deletes an OpenSearch Serverless-managed interface endpoint. For more information, see Access Amazon OpenSearch Serverless using an interface endpoint.
 */
export const deleteVpcEndpoint: (
  input: DeleteVpcEndpointRequest,
) => effect.Effect<
  DeleteVpcEndpointResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVpcEndpointRequest,
  output: DeleteVpcEndpointResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns attributes for one or more collections, including the collection endpoint, the OpenSearch Dashboards endpoint, and FIPS-compliant endpoints. For more information, see Creating and managing Amazon OpenSearch Serverless collections.
 */
export const batchGetCollection: (
  input: BatchGetCollectionRequest,
) => effect.Effect<
  BatchGetCollectionResponse,
  InternalServerException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetCollectionRequest,
  output: BatchGetCollectionResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Returns a list of successful and failed retrievals for the OpenSearch Serverless indexes. For more information, see Viewing data lifecycle policies.
 */
export const batchGetEffectiveLifecyclePolicy: (
  input: BatchGetEffectiveLifecyclePolicyRequest,
) => effect.Effect<
  BatchGetEffectiveLifecyclePolicyResponse,
  InternalServerException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetEffectiveLifecyclePolicyRequest,
  output: BatchGetEffectiveLifecyclePolicyResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Returns one or more configured OpenSearch Serverless lifecycle policies. For more information, see Viewing data lifecycle policies.
 */
export const batchGetLifecyclePolicy: (
  input: BatchGetLifecyclePolicyRequest,
) => effect.Effect<
  BatchGetLifecyclePolicyResponse,
  InternalServerException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetLifecyclePolicyRequest,
  output: BatchGetLifecyclePolicyResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Creates a lifecyle policy to be applied to OpenSearch Serverless indexes. Lifecycle policies define the number of days or hours to retain the data on an OpenSearch Serverless index. For more information, see Creating data lifecycle policies.
 */
export const createLifecyclePolicy: (
  input: CreateLifecyclePolicyRequest,
) => effect.Effect<
  CreateLifecyclePolicyResponse,
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLifecyclePolicyRequest,
  output: CreateLifecyclePolicyResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Lists all OpenSearch Serverless collections. For more information, see Creating and managing Amazon OpenSearch Serverless collections.
 *
 * Make sure to include an empty request body {} if you don't include any collection filters in the request.
 */
export const listCollections: {
  (
    input: ListCollectionsRequest,
  ): effect.Effect<
    ListCollectionsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCollectionsRequest,
  ) => stream.Stream<
    ListCollectionsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCollectionsRequest,
  ) => stream.Stream<
    unknown,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCollectionsRequest,
  output: ListCollectionsResponse,
  errors: [InternalServerException, ValidationException],
  pagination: { inputToken: "nextToken", outputToken: "nextToken" } as const,
}));
/**
 * Returns information about an OpenSearch Serverless security configuration. For more information, see SAML authentication for Amazon OpenSearch Serverless.
 */
export const getSecurityConfig: (
  input: GetSecurityConfigRequest,
) => effect.Effect<
  GetSecurityConfigResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSecurityConfigRequest,
  output: GetSecurityConfigResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns the OpenSearch Serverless-managed interface VPC endpoints associated with the current account. For more information, see Access Amazon OpenSearch Serverless using an interface endpoint.
 */
export const listVpcEndpoints: {
  (
    input: ListVpcEndpointsRequest,
  ): effect.Effect<
    ListVpcEndpointsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListVpcEndpointsRequest,
  ) => stream.Stream<
    ListVpcEndpointsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListVpcEndpointsRequest,
  ) => stream.Stream<
    unknown,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListVpcEndpointsRequest,
  output: ListVpcEndpointsResponse,
  errors: [InternalServerException, ValidationException],
  pagination: { inputToken: "nextToken", outputToken: "nextToken" } as const,
}));
/**
 * Creates a security policy to be used by one or more OpenSearch Serverless collections. Security policies provide access to a collection and its OpenSearch Dashboards endpoint from public networks or specific VPC endpoints. They also allow you to secure a collection with a KMS encryption key. For more information, see Network access for Amazon OpenSearch Serverless and Encryption at rest for Amazon OpenSearch Serverless.
 */
export const createSecurityPolicy: (
  input: CreateSecurityPolicyRequest,
) => effect.Effect<
  CreateSecurityPolicyResponse,
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSecurityPolicyRequest,
  output: CreateSecurityPolicyResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Update the OpenSearch Serverless settings for the current Amazon Web Services account. For more information, see Managing capacity limits for Amazon OpenSearch Serverless.
 */
export const updateAccountSettings: (
  input: UpdateAccountSettingsRequest,
) => effect.Effect<
  UpdateAccountSettingsResponse,
  | InternalServerException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccountSettingsRequest,
  output: UpdateAccountSettingsResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a data access policy for OpenSearch Serverless. Access policies limit access to collections and the resources within them, and allow a user to access that data irrespective of the access mechanism or network source. For more information, see Data access control for Amazon OpenSearch Serverless.
 */
export const createAccessPolicy: (
  input: CreateAccessPolicyRequest,
) => effect.Effect<
  CreateAccessPolicyResponse,
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccessPolicyRequest,
  output: CreateAccessPolicyResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Specifies a security configuration for OpenSearch Serverless. For more information, see SAML authentication for Amazon OpenSearch Serverless.
 */
export const createSecurityConfig: (
  input: CreateSecurityConfigRequest,
) => effect.Effect<
  CreateSecurityConfigResponse,
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSecurityConfigRequest,
  output: CreateSecurityConfigResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates an OpenSearch Serverless-managed interface VPC endpoint. For more information, see Access Amazon OpenSearch Serverless using an interface endpoint.
 */
export const createVpcEndpoint: (
  input: CreateVpcEndpointRequest,
) => effect.Effect<
  CreateVpcEndpointResponse,
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVpcEndpointRequest,
  output: CreateVpcEndpointResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Updates an OpenSearch Serverless access policy. For more information, see Updating data lifecycle policies.
 */
export const updateLifecyclePolicy: (
  input: UpdateLifecyclePolicyRequest,
) => effect.Effect<
  UpdateLifecyclePolicyResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLifecyclePolicyRequest,
  output: UpdateLifecyclePolicyResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Updates an OpenSearch Serverless security policy. For more information, see Network access for Amazon OpenSearch Serverless and Encryption at rest for Amazon OpenSearch Serverless.
 */
export const updateSecurityPolicy: (
  input: UpdateSecurityPolicyRequest,
) => effect.Effect<
  UpdateSecurityPolicyResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSecurityPolicyRequest,
  output: UpdateSecurityPolicyResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Associates tags with an OpenSearch Serverless resource. For more information, see Tagging Amazon OpenSearch Serverless collections.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a new OpenSearch Serverless collection. For more information, see Creating and managing Amazon OpenSearch Serverless collections.
 */
export const createCollection: (
  input: CreateCollectionRequest,
) => effect.Effect<
  CreateCollectionResponse,
  | ConflictException
  | InternalServerException
  | OcuLimitExceededException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCollectionRequest,
  output: CreateCollectionResponse,
  errors: [
    ConflictException,
    InternalServerException,
    OcuLimitExceededException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
