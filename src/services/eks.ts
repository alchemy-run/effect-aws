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
  sdkId: "EKS",
  serviceShapeName: "AWSWesleyFrontend",
});
const auth = T.AwsAuthSigv4({ name: "eks" });
const ver = T.ServiceVersion("2017-11-01");
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
              `https://eks-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws") {
              return e(`https://fips.eks.${Region}.amazonaws.com`);
            }
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://eks.${Region}.amazonaws.com`);
            }
            return e(
              `https://eks-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://eks.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://eks.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ClusterName = string;
export type RoleArn = string;
export type EksAnywhereSubscriptionName = string;
export type Integer = number;
export type BoxedInteger = number;
export type DescribeAddonVersionsRequestMaxResults = number;
export type DescribeClusterVersionMaxResults = number;
export type ListAccessEntriesRequestMaxResults = number;
export type ListAccessPoliciesRequestMaxResults = number;
export type ListAddonsRequestMaxResults = number;
export type ListAssociatedAccessPoliciesRequestMaxResults = number;
export type ListCapabilitiesRequestMaxResults = number;
export type ListClustersRequestMaxResults = number;
export type ListEksAnywhereSubscriptionsRequestMaxResults = number;
export type FargateProfilesRequestMaxResults = number;
export type ListIdentityProviderConfigsRequestMaxResults = number;
export type ListInsightsMaxResults = number;
export type ListNodegroupsRequestMaxResults = number;
export type ListPodIdentityAssociationsMaxResults = number;
export type ListUpdatesRequestMaxResults = number;
export type TagKey = string;
export type TagValue = string;
export type namespace = string;
export type ZeroCapacity = number;
export type Capacity = number;
export type labelKey = string;
export type labelValue = string;
export type taintKey = string;
export type taintValue = string;
export type NonZeroInteger = number;
export type PercentCapacity = number;
export type requiredClaimsKey = string;
export type requiredClaimsValue = string;

//# Schemas
export type StringList = string[];
export const StringList = S.Array(S.String);
export type IncludeClustersList = string[];
export const IncludeClustersList = S.Array(S.String);
export type EksAnywhereSubscriptionStatusValues = string[];
export const EksAnywhereSubscriptionStatusValues = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface CreateAccessEntryRequest {
  clusterName: string;
  principalArn: string;
  kubernetesGroups?: StringList;
  tags?: TagMap;
  clientRequestToken?: string;
  username?: string;
  type?: string;
}
export const CreateAccessEntryRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    principalArn: S.String,
    kubernetesGroups: S.optional(StringList),
    tags: S.optional(TagMap),
    clientRequestToken: S.optional(S.String),
    username: S.optional(S.String),
    type: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/clusters/{clusterName}/access-entries" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAccessEntryRequest",
}) as any as S.Schema<CreateAccessEntryRequest>;
export interface CreatePodIdentityAssociationRequest {
  clusterName: string;
  namespace: string;
  serviceAccount: string;
  roleArn: string;
  clientRequestToken?: string;
  tags?: TagMap;
  disableSessionTags?: boolean;
  targetRoleArn?: string;
}
export const CreatePodIdentityAssociationRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    namespace: S.String,
    serviceAccount: S.String,
    roleArn: S.String,
    clientRequestToken: S.optional(S.String),
    tags: S.optional(TagMap),
    disableSessionTags: S.optional(S.Boolean),
    targetRoleArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/clusters/{clusterName}/pod-identity-associations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePodIdentityAssociationRequest",
}) as any as S.Schema<CreatePodIdentityAssociationRequest>;
export interface DeleteAccessEntryRequest {
  clusterName: string;
  principalArn: string;
}
export const DeleteAccessEntryRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    principalArn: S.String.pipe(T.HttpLabel("principalArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/clusters/{clusterName}/access-entries/{principalArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAccessEntryRequest",
}) as any as S.Schema<DeleteAccessEntryRequest>;
export interface DeleteAccessEntryResponse {}
export const DeleteAccessEntryResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAccessEntryResponse",
}) as any as S.Schema<DeleteAccessEntryResponse>;
export interface DeleteAddonRequest {
  clusterName: string;
  addonName: string;
  preserve?: boolean;
}
export const DeleteAddonRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    addonName: S.String.pipe(T.HttpLabel("addonName")),
    preserve: S.optional(S.Boolean).pipe(T.HttpQuery("preserve")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/clusters/{clusterName}/addons/{addonName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAddonRequest",
}) as any as S.Schema<DeleteAddonRequest>;
export interface DeleteCapabilityRequest {
  clusterName: string;
  capabilityName: string;
}
export const DeleteCapabilityRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    capabilityName: S.String.pipe(T.HttpLabel("capabilityName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/clusters/{clusterName}/capabilities/{capabilityName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCapabilityRequest",
}) as any as S.Schema<DeleteCapabilityRequest>;
export interface DeleteClusterRequest {
  name: string;
}
export const DeleteClusterRequest = S.suspend(() =>
  S.Struct({ name: S.String.pipe(T.HttpLabel("name")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/clusters/{name}" }),
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
export interface DeleteEksAnywhereSubscriptionRequest {
  id: string;
}
export const DeleteEksAnywhereSubscriptionRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/eks-anywhere-subscriptions/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEksAnywhereSubscriptionRequest",
}) as any as S.Schema<DeleteEksAnywhereSubscriptionRequest>;
export interface DeleteFargateProfileRequest {
  clusterName: string;
  fargateProfileName: string;
}
export const DeleteFargateProfileRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    fargateProfileName: S.String.pipe(T.HttpLabel("fargateProfileName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/clusters/{clusterName}/fargate-profiles/{fargateProfileName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFargateProfileRequest",
}) as any as S.Schema<DeleteFargateProfileRequest>;
export interface DeleteNodegroupRequest {
  clusterName: string;
  nodegroupName: string;
}
export const DeleteNodegroupRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    nodegroupName: S.String.pipe(T.HttpLabel("nodegroupName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/clusters/{clusterName}/node-groups/{nodegroupName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteNodegroupRequest",
}) as any as S.Schema<DeleteNodegroupRequest>;
export interface DeletePodIdentityAssociationRequest {
  clusterName: string;
  associationId: string;
}
export const DeletePodIdentityAssociationRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    associationId: S.String.pipe(T.HttpLabel("associationId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/clusters/{clusterName}/pod-identity-associations/{associationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePodIdentityAssociationRequest",
}) as any as S.Schema<DeletePodIdentityAssociationRequest>;
export interface DeregisterClusterRequest {
  name: string;
}
export const DeregisterClusterRequest = S.suspend(() =>
  S.Struct({ name: S.String.pipe(T.HttpLabel("name")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/cluster-registrations/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeregisterClusterRequest",
}) as any as S.Schema<DeregisterClusterRequest>;
export interface DescribeAccessEntryRequest {
  clusterName: string;
  principalArn: string;
}
export const DescribeAccessEntryRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    principalArn: S.String.pipe(T.HttpLabel("principalArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/clusters/{clusterName}/access-entries/{principalArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAccessEntryRequest",
}) as any as S.Schema<DescribeAccessEntryRequest>;
export interface DescribeAddonRequest {
  clusterName: string;
  addonName: string;
}
export const DescribeAddonRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    addonName: S.String.pipe(T.HttpLabel("addonName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/clusters/{clusterName}/addons/{addonName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAddonRequest",
}) as any as S.Schema<DescribeAddonRequest>;
export interface DescribeAddonConfigurationRequest {
  addonName: string;
  addonVersion: string;
}
export const DescribeAddonConfigurationRequest = S.suspend(() =>
  S.Struct({
    addonName: S.String.pipe(T.HttpQuery("addonName")),
    addonVersion: S.String.pipe(T.HttpQuery("addonVersion")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/addons/configuration-schemas" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAddonConfigurationRequest",
}) as any as S.Schema<DescribeAddonConfigurationRequest>;
export interface DescribeAddonVersionsRequest {
  kubernetesVersion?: string;
  maxResults?: number;
  nextToken?: string;
  addonName?: string;
  types?: StringList;
  publishers?: StringList;
  owners?: StringList;
}
export const DescribeAddonVersionsRequest = S.suspend(() =>
  S.Struct({
    kubernetesVersion: S.optional(S.String).pipe(
      T.HttpQuery("kubernetesVersion"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    addonName: S.optional(S.String).pipe(T.HttpQuery("addonName")),
    types: S.optional(StringList).pipe(T.HttpQuery("types")),
    publishers: S.optional(StringList).pipe(T.HttpQuery("publishers")),
    owners: S.optional(StringList).pipe(T.HttpQuery("owners")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/addons/supported-versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAddonVersionsRequest",
}) as any as S.Schema<DescribeAddonVersionsRequest>;
export interface DescribeCapabilityRequest {
  clusterName: string;
  capabilityName: string;
}
export const DescribeCapabilityRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    capabilityName: S.String.pipe(T.HttpLabel("capabilityName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/clusters/{clusterName}/capabilities/{capabilityName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeCapabilityRequest",
}) as any as S.Schema<DescribeCapabilityRequest>;
export interface DescribeClusterRequest {
  name: string;
}
export const DescribeClusterRequest = S.suspend(() =>
  S.Struct({ name: S.String.pipe(T.HttpLabel("name")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/clusters/{name}" }),
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
export interface DescribeClusterVersionsRequest {
  clusterType?: string;
  maxResults?: number;
  nextToken?: string;
  defaultOnly?: boolean;
  includeAll?: boolean;
  clusterVersions?: StringList;
  status?: string;
  versionStatus?: string;
}
export const DescribeClusterVersionsRequest = S.suspend(() =>
  S.Struct({
    clusterType: S.optional(S.String).pipe(T.HttpQuery("clusterType")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    defaultOnly: S.optional(S.Boolean).pipe(T.HttpQuery("defaultOnly")),
    includeAll: S.optional(S.Boolean).pipe(T.HttpQuery("includeAll")),
    clusterVersions: S.optional(StringList).pipe(
      T.HttpQuery("clusterVersions"),
    ),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    versionStatus: S.optional(S.String).pipe(T.HttpQuery("versionStatus")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/cluster-versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeClusterVersionsRequest",
}) as any as S.Schema<DescribeClusterVersionsRequest>;
export interface DescribeEksAnywhereSubscriptionRequest {
  id: string;
}
export const DescribeEksAnywhereSubscriptionRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/eks-anywhere-subscriptions/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeEksAnywhereSubscriptionRequest",
}) as any as S.Schema<DescribeEksAnywhereSubscriptionRequest>;
export interface DescribeFargateProfileRequest {
  clusterName: string;
  fargateProfileName: string;
}
export const DescribeFargateProfileRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    fargateProfileName: S.String.pipe(T.HttpLabel("fargateProfileName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/clusters/{clusterName}/fargate-profiles/{fargateProfileName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeFargateProfileRequest",
}) as any as S.Schema<DescribeFargateProfileRequest>;
export interface DescribeInsightRequest {
  clusterName: string;
  id: string;
}
export const DescribeInsightRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    id: S.String.pipe(T.HttpLabel("id")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/clusters/{clusterName}/insights/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeInsightRequest",
}) as any as S.Schema<DescribeInsightRequest>;
export interface DescribeInsightsRefreshRequest {
  clusterName: string;
}
export const DescribeInsightsRefreshRequest = S.suspend(() =>
  S.Struct({ clusterName: S.String.pipe(T.HttpLabel("clusterName")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/clusters/{clusterName}/insights-refresh",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeInsightsRefreshRequest",
}) as any as S.Schema<DescribeInsightsRefreshRequest>;
export interface DescribeNodegroupRequest {
  clusterName: string;
  nodegroupName: string;
}
export const DescribeNodegroupRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    nodegroupName: S.String.pipe(T.HttpLabel("nodegroupName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/clusters/{clusterName}/node-groups/{nodegroupName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeNodegroupRequest",
}) as any as S.Schema<DescribeNodegroupRequest>;
export interface DescribePodIdentityAssociationRequest {
  clusterName: string;
  associationId: string;
}
export const DescribePodIdentityAssociationRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    associationId: S.String.pipe(T.HttpLabel("associationId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/clusters/{clusterName}/pod-identity-associations/{associationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePodIdentityAssociationRequest",
}) as any as S.Schema<DescribePodIdentityAssociationRequest>;
export interface DescribeUpdateRequest {
  name: string;
  updateId: string;
  nodegroupName?: string;
  addonName?: string;
  capabilityName?: string;
}
export const DescribeUpdateRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    updateId: S.String.pipe(T.HttpLabel("updateId")),
    nodegroupName: S.optional(S.String).pipe(T.HttpQuery("nodegroupName")),
    addonName: S.optional(S.String).pipe(T.HttpQuery("addonName")),
    capabilityName: S.optional(S.String).pipe(T.HttpQuery("capabilityName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/clusters/{name}/updates/{updateId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeUpdateRequest",
}) as any as S.Schema<DescribeUpdateRequest>;
export interface DisassociateAccessPolicyRequest {
  clusterName: string;
  principalArn: string;
  policyArn: string;
}
export const DisassociateAccessPolicyRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    principalArn: S.String.pipe(T.HttpLabel("principalArn")),
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/clusters/{clusterName}/access-entries/{principalArn}/access-policies/{policyArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateAccessPolicyRequest",
}) as any as S.Schema<DisassociateAccessPolicyRequest>;
export interface DisassociateAccessPolicyResponse {}
export const DisassociateAccessPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateAccessPolicyResponse",
}) as any as S.Schema<DisassociateAccessPolicyResponse>;
export interface IdentityProviderConfig {
  type: string;
  name: string;
}
export const IdentityProviderConfig = S.suspend(() =>
  S.Struct({ type: S.String, name: S.String }),
).annotations({
  identifier: "IdentityProviderConfig",
}) as any as S.Schema<IdentityProviderConfig>;
export interface DisassociateIdentityProviderConfigRequest {
  clusterName: string;
  identityProviderConfig: IdentityProviderConfig;
  clientRequestToken?: string;
}
export const DisassociateIdentityProviderConfigRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    identityProviderConfig: IdentityProviderConfig,
    clientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/clusters/{clusterName}/identity-provider-configs/disassociate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateIdentityProviderConfigRequest",
}) as any as S.Schema<DisassociateIdentityProviderConfigRequest>;
export interface ListAccessEntriesRequest {
  clusterName: string;
  associatedPolicyArn?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListAccessEntriesRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    associatedPolicyArn: S.optional(S.String).pipe(
      T.HttpQuery("associatedPolicyArn"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/clusters/{clusterName}/access-entries" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAccessEntriesRequest",
}) as any as S.Schema<ListAccessEntriesRequest>;
export interface ListAccessPoliciesRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListAccessPoliciesRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/access-policies" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAccessPoliciesRequest",
}) as any as S.Schema<ListAccessPoliciesRequest>;
export interface ListAddonsRequest {
  clusterName: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListAddonsRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/clusters/{clusterName}/addons" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAddonsRequest",
}) as any as S.Schema<ListAddonsRequest>;
export interface ListAssociatedAccessPoliciesRequest {
  clusterName: string;
  principalArn: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListAssociatedAccessPoliciesRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    principalArn: S.String.pipe(T.HttpLabel("principalArn")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/clusters/{clusterName}/access-entries/{principalArn}/access-policies",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssociatedAccessPoliciesRequest",
}) as any as S.Schema<ListAssociatedAccessPoliciesRequest>;
export interface ListCapabilitiesRequest {
  clusterName: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListCapabilitiesRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/clusters/{clusterName}/capabilities" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCapabilitiesRequest",
}) as any as S.Schema<ListCapabilitiesRequest>;
export interface ListClustersRequest {
  maxResults?: number;
  nextToken?: string;
  include?: IncludeClustersList;
}
export const ListClustersRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    include: S.optional(IncludeClustersList).pipe(T.HttpQuery("include")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/clusters" }),
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
export interface ListEksAnywhereSubscriptionsRequest {
  maxResults?: number;
  nextToken?: string;
  includeStatus?: EksAnywhereSubscriptionStatusValues;
}
export const ListEksAnywhereSubscriptionsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    includeStatus: S.optional(EksAnywhereSubscriptionStatusValues).pipe(
      T.HttpQuery("includeStatus"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/eks-anywhere-subscriptions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEksAnywhereSubscriptionsRequest",
}) as any as S.Schema<ListEksAnywhereSubscriptionsRequest>;
export interface ListFargateProfilesRequest {
  clusterName: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListFargateProfilesRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/clusters/{clusterName}/fargate-profiles",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFargateProfilesRequest",
}) as any as S.Schema<ListFargateProfilesRequest>;
export interface ListIdentityProviderConfigsRequest {
  clusterName: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListIdentityProviderConfigsRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/clusters/{clusterName}/identity-provider-configs",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIdentityProviderConfigsRequest",
}) as any as S.Schema<ListIdentityProviderConfigsRequest>;
export interface ListNodegroupsRequest {
  clusterName: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListNodegroupsRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/clusters/{clusterName}/node-groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListNodegroupsRequest",
}) as any as S.Schema<ListNodegroupsRequest>;
export interface ListPodIdentityAssociationsRequest {
  clusterName: string;
  namespace?: string;
  serviceAccount?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListPodIdentityAssociationsRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    serviceAccount: S.optional(S.String).pipe(T.HttpQuery("serviceAccount")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/clusters/{clusterName}/pod-identity-associations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPodIdentityAssociationsRequest",
}) as any as S.Schema<ListPodIdentityAssociationsRequest>;
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
export interface ListUpdatesRequest {
  name: string;
  nodegroupName?: string;
  addonName?: string;
  capabilityName?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListUpdatesRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    nodegroupName: S.optional(S.String).pipe(T.HttpQuery("nodegroupName")),
    addonName: S.optional(S.String).pipe(T.HttpQuery("addonName")),
    capabilityName: S.optional(S.String).pipe(T.HttpQuery("capabilityName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/clusters/{name}/updates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListUpdatesRequest",
}) as any as S.Schema<ListUpdatesRequest>;
export interface StartInsightsRefreshRequest {
  clusterName: string;
}
export const StartInsightsRefreshRequest = S.suspend(() =>
  S.Struct({ clusterName: S.String.pipe(T.HttpLabel("clusterName")) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/clusters/{clusterName}/insights-refresh",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartInsightsRefreshRequest",
}) as any as S.Schema<StartInsightsRefreshRequest>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: TagMap;
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
  tagKeys: TagKeyList;
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
export interface UpdateAccessEntryRequest {
  clusterName: string;
  principalArn: string;
  kubernetesGroups?: StringList;
  clientRequestToken?: string;
  username?: string;
}
export const UpdateAccessEntryRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    principalArn: S.String.pipe(T.HttpLabel("principalArn")),
    kubernetesGroups: S.optional(StringList),
    clientRequestToken: S.optional(S.String),
    username: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/clusters/{clusterName}/access-entries/{principalArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAccessEntryRequest",
}) as any as S.Schema<UpdateAccessEntryRequest>;
export interface AddonPodIdentityAssociations {
  serviceAccount: string;
  roleArn: string;
}
export const AddonPodIdentityAssociations = S.suspend(() =>
  S.Struct({ serviceAccount: S.String, roleArn: S.String }),
).annotations({
  identifier: "AddonPodIdentityAssociations",
}) as any as S.Schema<AddonPodIdentityAssociations>;
export type AddonPodIdentityAssociationsList = AddonPodIdentityAssociations[];
export const AddonPodIdentityAssociationsList = S.Array(
  AddonPodIdentityAssociations,
);
export interface UpdateAddonRequest {
  clusterName: string;
  addonName: string;
  addonVersion?: string;
  serviceAccountRoleArn?: string;
  resolveConflicts?: string;
  clientRequestToken?: string;
  configurationValues?: string;
  podIdentityAssociations?: AddonPodIdentityAssociationsList;
}
export const UpdateAddonRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    addonName: S.String.pipe(T.HttpLabel("addonName")),
    addonVersion: S.optional(S.String),
    serviceAccountRoleArn: S.optional(S.String),
    resolveConflicts: S.optional(S.String),
    clientRequestToken: S.optional(S.String),
    configurationValues: S.optional(S.String),
    podIdentityAssociations: S.optional(AddonPodIdentityAssociationsList),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/clusters/{clusterName}/addons/{addonName}/update",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAddonRequest",
}) as any as S.Schema<UpdateAddonRequest>;
export interface UpdateClusterVersionRequest {
  name: string;
  version: string;
  clientRequestToken?: string;
  force?: boolean;
}
export const UpdateClusterVersionRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    version: S.String,
    clientRequestToken: S.optional(S.String),
    force: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/clusters/{name}/updates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateClusterVersionRequest",
}) as any as S.Schema<UpdateClusterVersionRequest>;
export interface UpdateEksAnywhereSubscriptionRequest {
  id: string;
  autoRenew: boolean;
  clientRequestToken?: string;
}
export const UpdateEksAnywhereSubscriptionRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    autoRenew: S.Boolean,
    clientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/eks-anywhere-subscriptions/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEksAnywhereSubscriptionRequest",
}) as any as S.Schema<UpdateEksAnywhereSubscriptionRequest>;
export interface LaunchTemplateSpecification {
  name?: string;
  version?: string;
  id?: string;
}
export const LaunchTemplateSpecification = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    version: S.optional(S.String),
    id: S.optional(S.String),
  }),
).annotations({
  identifier: "LaunchTemplateSpecification",
}) as any as S.Schema<LaunchTemplateSpecification>;
export interface UpdateNodegroupVersionRequest {
  clusterName: string;
  nodegroupName: string;
  version?: string;
  releaseVersion?: string;
  launchTemplate?: LaunchTemplateSpecification;
  force?: boolean;
  clientRequestToken?: string;
}
export const UpdateNodegroupVersionRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    nodegroupName: S.String.pipe(T.HttpLabel("nodegroupName")),
    version: S.optional(S.String),
    releaseVersion: S.optional(S.String),
    launchTemplate: S.optional(LaunchTemplateSpecification),
    force: S.optional(S.Boolean),
    clientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/clusters/{clusterName}/node-groups/{nodegroupName}/update-version",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateNodegroupVersionRequest",
}) as any as S.Schema<UpdateNodegroupVersionRequest>;
export interface UpdatePodIdentityAssociationRequest {
  clusterName: string;
  associationId: string;
  roleArn?: string;
  clientRequestToken?: string;
  disableSessionTags?: boolean;
  targetRoleArn?: string;
}
export const UpdatePodIdentityAssociationRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    associationId: S.String.pipe(T.HttpLabel("associationId")),
    roleArn: S.optional(S.String),
    clientRequestToken: S.optional(S.String),
    disableSessionTags: S.optional(S.Boolean),
    targetRoleArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/clusters/{clusterName}/pod-identity-associations/{associationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePodIdentityAssociationRequest",
}) as any as S.Schema<UpdatePodIdentityAssociationRequest>;
export type CategoryList = string[];
export const CategoryList = S.Array(S.String);
export type InsightStatusValueList = string[];
export const InsightStatusValueList = S.Array(S.String);
export type labelsKeyList = string[];
export const labelsKeyList = S.Array(S.String);
export interface AccessScope {
  type?: string;
  namespaces?: StringList;
}
export const AccessScope = S.suspend(() =>
  S.Struct({ type: S.optional(S.String), namespaces: S.optional(StringList) }),
).annotations({ identifier: "AccessScope" }) as any as S.Schema<AccessScope>;
export interface AddonNamespaceConfigRequest {
  namespace?: string;
}
export const AddonNamespaceConfigRequest = S.suspend(() =>
  S.Struct({ namespace: S.optional(S.String) }),
).annotations({
  identifier: "AddonNamespaceConfigRequest",
}) as any as S.Schema<AddonNamespaceConfigRequest>;
export interface VpcConfigRequest {
  subnetIds?: StringList;
  securityGroupIds?: StringList;
  endpointPublicAccess?: boolean;
  endpointPrivateAccess?: boolean;
  publicAccessCidrs?: StringList;
}
export const VpcConfigRequest = S.suspend(() =>
  S.Struct({
    subnetIds: S.optional(StringList),
    securityGroupIds: S.optional(StringList),
    endpointPublicAccess: S.optional(S.Boolean),
    endpointPrivateAccess: S.optional(S.Boolean),
    publicAccessCidrs: S.optional(StringList),
  }),
).annotations({
  identifier: "VpcConfigRequest",
}) as any as S.Schema<VpcConfigRequest>;
export interface CreateAccessConfigRequest {
  bootstrapClusterCreatorAdminPermissions?: boolean;
  authenticationMode?: string;
}
export const CreateAccessConfigRequest = S.suspend(() =>
  S.Struct({
    bootstrapClusterCreatorAdminPermissions: S.optional(S.Boolean),
    authenticationMode: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateAccessConfigRequest",
}) as any as S.Schema<CreateAccessConfigRequest>;
export interface UpgradePolicyRequest {
  supportType?: string;
}
export const UpgradePolicyRequest = S.suspend(() =>
  S.Struct({ supportType: S.optional(S.String) }),
).annotations({
  identifier: "UpgradePolicyRequest",
}) as any as S.Schema<UpgradePolicyRequest>;
export interface ZonalShiftConfigRequest {
  enabled?: boolean;
}
export const ZonalShiftConfigRequest = S.suspend(() =>
  S.Struct({ enabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "ZonalShiftConfigRequest",
}) as any as S.Schema<ZonalShiftConfigRequest>;
export interface ComputeConfigRequest {
  enabled?: boolean;
  nodePools?: StringList;
  nodeRoleArn?: string;
}
export const ComputeConfigRequest = S.suspend(() =>
  S.Struct({
    enabled: S.optional(S.Boolean),
    nodePools: S.optional(StringList),
    nodeRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ComputeConfigRequest",
}) as any as S.Schema<ComputeConfigRequest>;
export interface ControlPlaneScalingConfig {
  tier?: string;
}
export const ControlPlaneScalingConfig = S.suspend(() =>
  S.Struct({ tier: S.optional(S.String) }),
).annotations({
  identifier: "ControlPlaneScalingConfig",
}) as any as S.Schema<ControlPlaneScalingConfig>;
export interface EksAnywhereSubscriptionTerm {
  duration?: number;
  unit?: string;
}
export const EksAnywhereSubscriptionTerm = S.suspend(() =>
  S.Struct({ duration: S.optional(S.Number), unit: S.optional(S.String) }),
).annotations({
  identifier: "EksAnywhereSubscriptionTerm",
}) as any as S.Schema<EksAnywhereSubscriptionTerm>;
export interface NodegroupScalingConfig {
  minSize?: number;
  maxSize?: number;
  desiredSize?: number;
}
export const NodegroupScalingConfig = S.suspend(() =>
  S.Struct({
    minSize: S.optional(S.Number),
    maxSize: S.optional(S.Number),
    desiredSize: S.optional(S.Number),
  }),
).annotations({
  identifier: "NodegroupScalingConfig",
}) as any as S.Schema<NodegroupScalingConfig>;
export interface RemoteAccessConfig {
  ec2SshKey?: string;
  sourceSecurityGroups?: StringList;
}
export const RemoteAccessConfig = S.suspend(() =>
  S.Struct({
    ec2SshKey: S.optional(S.String),
    sourceSecurityGroups: S.optional(StringList),
  }),
).annotations({
  identifier: "RemoteAccessConfig",
}) as any as S.Schema<RemoteAccessConfig>;
export type labelsMap = { [key: string]: string };
export const labelsMap = S.Record({ key: S.String, value: S.String });
export interface Taint {
  key?: string;
  value?: string;
  effect?: string;
}
export const Taint = S.suspend(() =>
  S.Struct({
    key: S.optional(S.String),
    value: S.optional(S.String),
    effect: S.optional(S.String),
  }),
).annotations({ identifier: "Taint" }) as any as S.Schema<Taint>;
export type taintsList = Taint[];
export const taintsList = S.Array(Taint);
export interface NodegroupUpdateConfig {
  maxUnavailable?: number;
  maxUnavailablePercentage?: number;
  updateStrategy?: string;
}
export const NodegroupUpdateConfig = S.suspend(() =>
  S.Struct({
    maxUnavailable: S.optional(S.Number),
    maxUnavailablePercentage: S.optional(S.Number),
    updateStrategy: S.optional(S.String),
  }),
).annotations({
  identifier: "NodegroupUpdateConfig",
}) as any as S.Schema<NodegroupUpdateConfig>;
export interface License {
  id?: string;
  token?: string;
}
export const License = S.suspend(() =>
  S.Struct({ id: S.optional(S.String), token: S.optional(S.String) }),
).annotations({ identifier: "License" }) as any as S.Schema<License>;
export type LicenseList = License[];
export const LicenseList = S.Array(License);
export interface EksAnywhereSubscription {
  id?: string;
  arn?: string;
  createdAt?: Date;
  effectiveDate?: Date;
  expirationDate?: Date;
  licenseQuantity?: number;
  licenseType?: string;
  term?: EksAnywhereSubscriptionTerm;
  status?: string;
  autoRenew?: boolean;
  licenseArns?: StringList;
  licenses?: LicenseList;
  tags?: TagMap;
}
export const EksAnywhereSubscription = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    effectiveDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    expirationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    licenseQuantity: S.optional(S.Number),
    licenseType: S.optional(S.String),
    term: S.optional(EksAnywhereSubscriptionTerm),
    status: S.optional(S.String),
    autoRenew: S.optional(S.Boolean),
    licenseArns: S.optional(StringList),
    licenses: S.optional(LicenseList),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "EksAnywhereSubscription",
}) as any as S.Schema<EksAnywhereSubscription>;
export type EksAnywhereSubscriptionList = EksAnywhereSubscription[];
export const EksAnywhereSubscriptionList = S.Array(EksAnywhereSubscription);
export type IdentityProviderConfigs = IdentityProviderConfig[];
export const IdentityProviderConfigs = S.Array(IdentityProviderConfig);
export interface InsightsFilter {
  categories?: CategoryList;
  kubernetesVersions?: StringList;
  statuses?: InsightStatusValueList;
}
export const InsightsFilter = S.suspend(() =>
  S.Struct({
    categories: S.optional(CategoryList),
    kubernetesVersions: S.optional(StringList),
    statuses: S.optional(InsightStatusValueList),
  }),
).annotations({
  identifier: "InsightsFilter",
}) as any as S.Schema<InsightsFilter>;
export interface ConnectorConfigRequest {
  roleArn: string;
  provider: string;
}
export const ConnectorConfigRequest = S.suspend(() =>
  S.Struct({ roleArn: S.String, provider: S.String }),
).annotations({
  identifier: "ConnectorConfigRequest",
}) as any as S.Schema<ConnectorConfigRequest>;
export interface UpdateAccessConfigRequest {
  authenticationMode?: string;
}
export const UpdateAccessConfigRequest = S.suspend(() =>
  S.Struct({ authenticationMode: S.optional(S.String) }),
).annotations({
  identifier: "UpdateAccessConfigRequest",
}) as any as S.Schema<UpdateAccessConfigRequest>;
export interface UpdateLabelsPayload {
  addOrUpdateLabels?: labelsMap;
  removeLabels?: labelsKeyList;
}
export const UpdateLabelsPayload = S.suspend(() =>
  S.Struct({
    addOrUpdateLabels: S.optional(labelsMap),
    removeLabels: S.optional(labelsKeyList),
  }),
).annotations({
  identifier: "UpdateLabelsPayload",
}) as any as S.Schema<UpdateLabelsPayload>;
export interface UpdateTaintsPayload {
  addOrUpdateTaints?: taintsList;
  removeTaints?: taintsList;
}
export const UpdateTaintsPayload = S.suspend(() =>
  S.Struct({
    addOrUpdateTaints: S.optional(taintsList),
    removeTaints: S.optional(taintsList),
  }),
).annotations({
  identifier: "UpdateTaintsPayload",
}) as any as S.Schema<UpdateTaintsPayload>;
export type LogTypes = string[];
export const LogTypes = S.Array(S.String);
export interface AssociateAccessPolicyRequest {
  clusterName: string;
  principalArn: string;
  policyArn: string;
  accessScope: AccessScope;
}
export const AssociateAccessPolicyRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    principalArn: S.String.pipe(T.HttpLabel("principalArn")),
    policyArn: S.String,
    accessScope: AccessScope,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/clusters/{clusterName}/access-entries/{principalArn}/access-policies",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateAccessPolicyRequest",
}) as any as S.Schema<AssociateAccessPolicyRequest>;
export interface CreateAddonRequest {
  clusterName: string;
  addonName: string;
  addonVersion?: string;
  serviceAccountRoleArn?: string;
  resolveConflicts?: string;
  clientRequestToken?: string;
  tags?: TagMap;
  configurationValues?: string;
  podIdentityAssociations?: AddonPodIdentityAssociationsList;
  namespaceConfig?: AddonNamespaceConfigRequest;
}
export const CreateAddonRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    addonName: S.String,
    addonVersion: S.optional(S.String),
    serviceAccountRoleArn: S.optional(S.String),
    resolveConflicts: S.optional(S.String),
    clientRequestToken: S.optional(S.String),
    tags: S.optional(TagMap),
    configurationValues: S.optional(S.String),
    podIdentityAssociations: S.optional(AddonPodIdentityAssociationsList),
    namespaceConfig: S.optional(AddonNamespaceConfigRequest),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/clusters/{clusterName}/addons" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAddonRequest",
}) as any as S.Schema<CreateAddonRequest>;
export interface CreateEksAnywhereSubscriptionRequest {
  name: string;
  term: EksAnywhereSubscriptionTerm;
  licenseQuantity?: number;
  licenseType?: string;
  autoRenew?: boolean;
  clientRequestToken?: string;
  tags?: TagMap;
}
export const CreateEksAnywhereSubscriptionRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    term: EksAnywhereSubscriptionTerm,
    licenseQuantity: S.optional(S.Number),
    licenseType: S.optional(S.String),
    autoRenew: S.optional(S.Boolean),
    clientRequestToken: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/eks-anywhere-subscriptions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEksAnywhereSubscriptionRequest",
}) as any as S.Schema<CreateEksAnywhereSubscriptionRequest>;
export interface PodIdentityAssociation {
  clusterName?: string;
  namespace?: string;
  serviceAccount?: string;
  roleArn?: string;
  associationArn?: string;
  associationId?: string;
  tags?: TagMap;
  createdAt?: Date;
  modifiedAt?: Date;
  ownerArn?: string;
  disableSessionTags?: boolean;
  targetRoleArn?: string;
  externalId?: string;
}
export const PodIdentityAssociation = S.suspend(() =>
  S.Struct({
    clusterName: S.optional(S.String),
    namespace: S.optional(S.String),
    serviceAccount: S.optional(S.String),
    roleArn: S.optional(S.String),
    associationArn: S.optional(S.String),
    associationId: S.optional(S.String),
    tags: S.optional(TagMap),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ownerArn: S.optional(S.String),
    disableSessionTags: S.optional(S.Boolean),
    targetRoleArn: S.optional(S.String),
    externalId: S.optional(S.String),
  }),
).annotations({
  identifier: "PodIdentityAssociation",
}) as any as S.Schema<PodIdentityAssociation>;
export interface DeletePodIdentityAssociationResponse {
  association?: PodIdentityAssociation;
}
export const DeletePodIdentityAssociationResponse = S.suspend(() =>
  S.Struct({ association: S.optional(PodIdentityAssociation) }),
).annotations({
  identifier: "DeletePodIdentityAssociationResponse",
}) as any as S.Schema<DeletePodIdentityAssociationResponse>;
export interface VpcConfigResponse {
  subnetIds?: StringList;
  securityGroupIds?: StringList;
  clusterSecurityGroupId?: string;
  vpcId?: string;
  endpointPublicAccess?: boolean;
  endpointPrivateAccess?: boolean;
  publicAccessCidrs?: StringList;
}
export const VpcConfigResponse = S.suspend(() =>
  S.Struct({
    subnetIds: S.optional(StringList),
    securityGroupIds: S.optional(StringList),
    clusterSecurityGroupId: S.optional(S.String),
    vpcId: S.optional(S.String),
    endpointPublicAccess: S.optional(S.Boolean),
    endpointPrivateAccess: S.optional(S.Boolean),
    publicAccessCidrs: S.optional(StringList),
  }),
).annotations({
  identifier: "VpcConfigResponse",
}) as any as S.Schema<VpcConfigResponse>;
export interface ElasticLoadBalancing {
  enabled?: boolean;
}
export const ElasticLoadBalancing = S.suspend(() =>
  S.Struct({ enabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "ElasticLoadBalancing",
}) as any as S.Schema<ElasticLoadBalancing>;
export interface KubernetesNetworkConfigResponse {
  serviceIpv4Cidr?: string;
  serviceIpv6Cidr?: string;
  ipFamily?: string;
  elasticLoadBalancing?: ElasticLoadBalancing;
}
export const KubernetesNetworkConfigResponse = S.suspend(() =>
  S.Struct({
    serviceIpv4Cidr: S.optional(S.String),
    serviceIpv6Cidr: S.optional(S.String),
    ipFamily: S.optional(S.String),
    elasticLoadBalancing: S.optional(ElasticLoadBalancing),
  }),
).annotations({
  identifier: "KubernetesNetworkConfigResponse",
}) as any as S.Schema<KubernetesNetworkConfigResponse>;
export interface LogSetup {
  types?: LogTypes;
  enabled?: boolean;
}
export const LogSetup = S.suspend(() =>
  S.Struct({ types: S.optional(LogTypes), enabled: S.optional(S.Boolean) }),
).annotations({ identifier: "LogSetup" }) as any as S.Schema<LogSetup>;
export type LogSetups = LogSetup[];
export const LogSetups = S.Array(LogSetup);
export interface Logging {
  clusterLogging?: LogSetups;
}
export const Logging = S.suspend(() =>
  S.Struct({ clusterLogging: S.optional(LogSetups) }),
).annotations({ identifier: "Logging" }) as any as S.Schema<Logging>;
export interface OIDC {
  issuer?: string;
}
export const OIDC = S.suspend(() =>
  S.Struct({ issuer: S.optional(S.String) }),
).annotations({ identifier: "OIDC" }) as any as S.Schema<OIDC>;
export interface Identity {
  oidc?: OIDC;
}
export const Identity = S.suspend(() =>
  S.Struct({ oidc: S.optional(OIDC) }),
).annotations({ identifier: "Identity" }) as any as S.Schema<Identity>;
export interface Certificate {
  data?: string;
}
export const Certificate = S.suspend(() =>
  S.Struct({ data: S.optional(S.String) }),
).annotations({ identifier: "Certificate" }) as any as S.Schema<Certificate>;
export interface Provider {
  keyArn?: string;
}
export const Provider = S.suspend(() =>
  S.Struct({ keyArn: S.optional(S.String) }),
).annotations({ identifier: "Provider" }) as any as S.Schema<Provider>;
export interface EncryptionConfig {
  resources?: StringList;
  provider?: Provider;
}
export const EncryptionConfig = S.suspend(() =>
  S.Struct({
    resources: S.optional(StringList),
    provider: S.optional(Provider),
  }),
).annotations({
  identifier: "EncryptionConfig",
}) as any as S.Schema<EncryptionConfig>;
export type EncryptionConfigList = EncryptionConfig[];
export const EncryptionConfigList = S.Array(EncryptionConfig);
export interface ConnectorConfigResponse {
  activationId?: string;
  activationCode?: string;
  activationExpiry?: Date;
  provider?: string;
  roleArn?: string;
}
export const ConnectorConfigResponse = S.suspend(() =>
  S.Struct({
    activationId: S.optional(S.String),
    activationCode: S.optional(S.String),
    activationExpiry: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    provider: S.optional(S.String),
    roleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ConnectorConfigResponse",
}) as any as S.Schema<ConnectorConfigResponse>;
export interface ClusterIssue {
  code?: string;
  message?: string;
  resourceIds?: StringList;
}
export const ClusterIssue = S.suspend(() =>
  S.Struct({
    code: S.optional(S.String),
    message: S.optional(S.String),
    resourceIds: S.optional(StringList),
  }),
).annotations({ identifier: "ClusterIssue" }) as any as S.Schema<ClusterIssue>;
export type ClusterIssueList = ClusterIssue[];
export const ClusterIssueList = S.Array(ClusterIssue);
export interface ClusterHealth {
  issues?: ClusterIssueList;
}
export const ClusterHealth = S.suspend(() =>
  S.Struct({ issues: S.optional(ClusterIssueList) }),
).annotations({
  identifier: "ClusterHealth",
}) as any as S.Schema<ClusterHealth>;
export interface ControlPlanePlacementResponse {
  groupName?: string;
}
export const ControlPlanePlacementResponse = S.suspend(() =>
  S.Struct({ groupName: S.optional(S.String) }),
).annotations({
  identifier: "ControlPlanePlacementResponse",
}) as any as S.Schema<ControlPlanePlacementResponse>;
export interface OutpostConfigResponse {
  outpostArns: StringList;
  controlPlaneInstanceType: string;
  controlPlanePlacement?: ControlPlanePlacementResponse;
}
export const OutpostConfigResponse = S.suspend(() =>
  S.Struct({
    outpostArns: StringList,
    controlPlaneInstanceType: S.String,
    controlPlanePlacement: S.optional(ControlPlanePlacementResponse),
  }),
).annotations({
  identifier: "OutpostConfigResponse",
}) as any as S.Schema<OutpostConfigResponse>;
export interface AccessConfigResponse {
  bootstrapClusterCreatorAdminPermissions?: boolean;
  authenticationMode?: string;
}
export const AccessConfigResponse = S.suspend(() =>
  S.Struct({
    bootstrapClusterCreatorAdminPermissions: S.optional(S.Boolean),
    authenticationMode: S.optional(S.String),
  }),
).annotations({
  identifier: "AccessConfigResponse",
}) as any as S.Schema<AccessConfigResponse>;
export interface UpgradePolicyResponse {
  supportType?: string;
}
export const UpgradePolicyResponse = S.suspend(() =>
  S.Struct({ supportType: S.optional(S.String) }),
).annotations({
  identifier: "UpgradePolicyResponse",
}) as any as S.Schema<UpgradePolicyResponse>;
export interface ZonalShiftConfigResponse {
  enabled?: boolean;
}
export const ZonalShiftConfigResponse = S.suspend(() =>
  S.Struct({ enabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "ZonalShiftConfigResponse",
}) as any as S.Schema<ZonalShiftConfigResponse>;
export interface RemoteNodeNetwork {
  cidrs?: StringList;
}
export const RemoteNodeNetwork = S.suspend(() =>
  S.Struct({ cidrs: S.optional(StringList) }),
).annotations({
  identifier: "RemoteNodeNetwork",
}) as any as S.Schema<RemoteNodeNetwork>;
export type RemoteNodeNetworkList = RemoteNodeNetwork[];
export const RemoteNodeNetworkList = S.Array(RemoteNodeNetwork);
export interface RemotePodNetwork {
  cidrs?: StringList;
}
export const RemotePodNetwork = S.suspend(() =>
  S.Struct({ cidrs: S.optional(StringList) }),
).annotations({
  identifier: "RemotePodNetwork",
}) as any as S.Schema<RemotePodNetwork>;
export type RemotePodNetworkList = RemotePodNetwork[];
export const RemotePodNetworkList = S.Array(RemotePodNetwork);
export interface RemoteNetworkConfigResponse {
  remoteNodeNetworks?: RemoteNodeNetworkList;
  remotePodNetworks?: RemotePodNetworkList;
}
export const RemoteNetworkConfigResponse = S.suspend(() =>
  S.Struct({
    remoteNodeNetworks: S.optional(RemoteNodeNetworkList),
    remotePodNetworks: S.optional(RemotePodNetworkList),
  }),
).annotations({
  identifier: "RemoteNetworkConfigResponse",
}) as any as S.Schema<RemoteNetworkConfigResponse>;
export interface ComputeConfigResponse {
  enabled?: boolean;
  nodePools?: StringList;
  nodeRoleArn?: string;
}
export const ComputeConfigResponse = S.suspend(() =>
  S.Struct({
    enabled: S.optional(S.Boolean),
    nodePools: S.optional(StringList),
    nodeRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ComputeConfigResponse",
}) as any as S.Schema<ComputeConfigResponse>;
export interface BlockStorage {
  enabled?: boolean;
}
export const BlockStorage = S.suspend(() =>
  S.Struct({ enabled: S.optional(S.Boolean) }),
).annotations({ identifier: "BlockStorage" }) as any as S.Schema<BlockStorage>;
export interface StorageConfigResponse {
  blockStorage?: BlockStorage;
}
export const StorageConfigResponse = S.suspend(() =>
  S.Struct({ blockStorage: S.optional(BlockStorage) }),
).annotations({
  identifier: "StorageConfigResponse",
}) as any as S.Schema<StorageConfigResponse>;
export interface Cluster {
  name?: string;
  arn?: string;
  createdAt?: Date;
  version?: string;
  endpoint?: string;
  roleArn?: string;
  resourcesVpcConfig?: VpcConfigResponse;
  kubernetesNetworkConfig?: KubernetesNetworkConfigResponse;
  logging?: Logging;
  identity?: Identity;
  status?: string;
  certificateAuthority?: Certificate;
  clientRequestToken?: string;
  platformVersion?: string;
  tags?: TagMap;
  encryptionConfig?: EncryptionConfigList;
  connectorConfig?: ConnectorConfigResponse;
  id?: string;
  health?: ClusterHealth;
  outpostConfig?: OutpostConfigResponse;
  accessConfig?: AccessConfigResponse;
  upgradePolicy?: UpgradePolicyResponse;
  zonalShiftConfig?: ZonalShiftConfigResponse;
  remoteNetworkConfig?: RemoteNetworkConfigResponse;
  computeConfig?: ComputeConfigResponse;
  storageConfig?: StorageConfigResponse;
  deletionProtection?: boolean;
  controlPlaneScalingConfig?: ControlPlaneScalingConfig;
}
export const Cluster = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    version: S.optional(S.String),
    endpoint: S.optional(S.String),
    roleArn: S.optional(S.String),
    resourcesVpcConfig: S.optional(VpcConfigResponse),
    kubernetesNetworkConfig: S.optional(KubernetesNetworkConfigResponse),
    logging: S.optional(Logging),
    identity: S.optional(Identity),
    status: S.optional(S.String),
    certificateAuthority: S.optional(Certificate),
    clientRequestToken: S.optional(S.String),
    platformVersion: S.optional(S.String),
    tags: S.optional(TagMap),
    encryptionConfig: S.optional(EncryptionConfigList),
    connectorConfig: S.optional(ConnectorConfigResponse),
    id: S.optional(S.String),
    health: S.optional(ClusterHealth),
    outpostConfig: S.optional(OutpostConfigResponse),
    accessConfig: S.optional(AccessConfigResponse),
    upgradePolicy: S.optional(UpgradePolicyResponse),
    zonalShiftConfig: S.optional(ZonalShiftConfigResponse),
    remoteNetworkConfig: S.optional(RemoteNetworkConfigResponse),
    computeConfig: S.optional(ComputeConfigResponse),
    storageConfig: S.optional(StorageConfigResponse),
    deletionProtection: S.optional(S.Boolean),
    controlPlaneScalingConfig: S.optional(ControlPlaneScalingConfig),
  }),
).annotations({ identifier: "Cluster" }) as any as S.Schema<Cluster>;
export interface DeregisterClusterResponse {
  cluster?: Cluster;
}
export const DeregisterClusterResponse = S.suspend(() =>
  S.Struct({ cluster: S.optional(Cluster) }),
).annotations({
  identifier: "DeregisterClusterResponse",
}) as any as S.Schema<DeregisterClusterResponse>;
export interface AccessEntry {
  clusterName?: string;
  principalArn?: string;
  kubernetesGroups?: StringList;
  accessEntryArn?: string;
  createdAt?: Date;
  modifiedAt?: Date;
  tags?: TagMap;
  username?: string;
  type?: string;
}
export const AccessEntry = S.suspend(() =>
  S.Struct({
    clusterName: S.optional(S.String),
    principalArn: S.optional(S.String),
    kubernetesGroups: S.optional(StringList),
    accessEntryArn: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    tags: S.optional(TagMap),
    username: S.optional(S.String),
    type: S.optional(S.String),
  }),
).annotations({ identifier: "AccessEntry" }) as any as S.Schema<AccessEntry>;
export interface DescribeAccessEntryResponse {
  accessEntry?: AccessEntry;
}
export const DescribeAccessEntryResponse = S.suspend(() =>
  S.Struct({ accessEntry: S.optional(AccessEntry) }),
).annotations({
  identifier: "DescribeAccessEntryResponse",
}) as any as S.Schema<DescribeAccessEntryResponse>;
export interface AddonIssue {
  code?: string;
  message?: string;
  resourceIds?: StringList;
}
export const AddonIssue = S.suspend(() =>
  S.Struct({
    code: S.optional(S.String),
    message: S.optional(S.String),
    resourceIds: S.optional(StringList),
  }),
).annotations({ identifier: "AddonIssue" }) as any as S.Schema<AddonIssue>;
export type AddonIssueList = AddonIssue[];
export const AddonIssueList = S.Array(AddonIssue);
export interface AddonHealth {
  issues?: AddonIssueList;
}
export const AddonHealth = S.suspend(() =>
  S.Struct({ issues: S.optional(AddonIssueList) }),
).annotations({ identifier: "AddonHealth" }) as any as S.Schema<AddonHealth>;
export interface MarketplaceInformation {
  productId?: string;
  productUrl?: string;
}
export const MarketplaceInformation = S.suspend(() =>
  S.Struct({
    productId: S.optional(S.String),
    productUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "MarketplaceInformation",
}) as any as S.Schema<MarketplaceInformation>;
export interface AddonNamespaceConfigResponse {
  namespace?: string;
}
export const AddonNamespaceConfigResponse = S.suspend(() =>
  S.Struct({ namespace: S.optional(S.String) }),
).annotations({
  identifier: "AddonNamespaceConfigResponse",
}) as any as S.Schema<AddonNamespaceConfigResponse>;
export interface Addon {
  addonName?: string;
  clusterName?: string;
  status?: string;
  addonVersion?: string;
  health?: AddonHealth;
  addonArn?: string;
  createdAt?: Date;
  modifiedAt?: Date;
  serviceAccountRoleArn?: string;
  tags?: TagMap;
  publisher?: string;
  owner?: string;
  marketplaceInformation?: MarketplaceInformation;
  configurationValues?: string;
  podIdentityAssociations?: StringList;
  namespaceConfig?: AddonNamespaceConfigResponse;
}
export const Addon = S.suspend(() =>
  S.Struct({
    addonName: S.optional(S.String),
    clusterName: S.optional(S.String),
    status: S.optional(S.String),
    addonVersion: S.optional(S.String),
    health: S.optional(AddonHealth),
    addonArn: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    serviceAccountRoleArn: S.optional(S.String),
    tags: S.optional(TagMap),
    publisher: S.optional(S.String),
    owner: S.optional(S.String),
    marketplaceInformation: S.optional(MarketplaceInformation),
    configurationValues: S.optional(S.String),
    podIdentityAssociations: S.optional(StringList),
    namespaceConfig: S.optional(AddonNamespaceConfigResponse),
  }),
).annotations({ identifier: "Addon" }) as any as S.Schema<Addon>;
export interface DescribeAddonResponse {
  addon?: Addon;
}
export const DescribeAddonResponse = S.suspend(() =>
  S.Struct({ addon: S.optional(Addon) }),
).annotations({
  identifier: "DescribeAddonResponse",
}) as any as S.Schema<DescribeAddonResponse>;
export interface ArgoCdAwsIdcConfigResponse {
  idcInstanceArn?: string;
  idcRegion?: string;
  idcManagedApplicationArn?: string;
}
export const ArgoCdAwsIdcConfigResponse = S.suspend(() =>
  S.Struct({
    idcInstanceArn: S.optional(S.String),
    idcRegion: S.optional(S.String),
    idcManagedApplicationArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ArgoCdAwsIdcConfigResponse",
}) as any as S.Schema<ArgoCdAwsIdcConfigResponse>;
export interface SsoIdentity {
  id: string;
  type: string;
}
export const SsoIdentity = S.suspend(() =>
  S.Struct({ id: S.String, type: S.String }),
).annotations({ identifier: "SsoIdentity" }) as any as S.Schema<SsoIdentity>;
export type SsoIdentityList = SsoIdentity[];
export const SsoIdentityList = S.Array(SsoIdentity);
export interface ArgoCdRoleMapping {
  role: string;
  identities: SsoIdentityList;
}
export const ArgoCdRoleMapping = S.suspend(() =>
  S.Struct({ role: S.String, identities: SsoIdentityList }),
).annotations({
  identifier: "ArgoCdRoleMapping",
}) as any as S.Schema<ArgoCdRoleMapping>;
export type ArgoCdRoleMappingList = ArgoCdRoleMapping[];
export const ArgoCdRoleMappingList = S.Array(ArgoCdRoleMapping);
export interface ArgoCdNetworkAccessConfigResponse {
  vpceIds?: StringList;
}
export const ArgoCdNetworkAccessConfigResponse = S.suspend(() =>
  S.Struct({ vpceIds: S.optional(StringList) }),
).annotations({
  identifier: "ArgoCdNetworkAccessConfigResponse",
}) as any as S.Schema<ArgoCdNetworkAccessConfigResponse>;
export interface ArgoCdConfigResponse {
  namespace?: string;
  awsIdc?: ArgoCdAwsIdcConfigResponse;
  rbacRoleMappings?: ArgoCdRoleMappingList;
  networkAccess?: ArgoCdNetworkAccessConfigResponse;
  serverUrl?: string;
}
export const ArgoCdConfigResponse = S.suspend(() =>
  S.Struct({
    namespace: S.optional(S.String),
    awsIdc: S.optional(ArgoCdAwsIdcConfigResponse),
    rbacRoleMappings: S.optional(ArgoCdRoleMappingList),
    networkAccess: S.optional(ArgoCdNetworkAccessConfigResponse),
    serverUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "ArgoCdConfigResponse",
}) as any as S.Schema<ArgoCdConfigResponse>;
export interface CapabilityConfigurationResponse {
  argoCd?: ArgoCdConfigResponse;
}
export const CapabilityConfigurationResponse = S.suspend(() =>
  S.Struct({ argoCd: S.optional(ArgoCdConfigResponse) }),
).annotations({
  identifier: "CapabilityConfigurationResponse",
}) as any as S.Schema<CapabilityConfigurationResponse>;
export interface CapabilityIssue {
  code?: string;
  message?: string;
}
export const CapabilityIssue = S.suspend(() =>
  S.Struct({ code: S.optional(S.String), message: S.optional(S.String) }),
).annotations({
  identifier: "CapabilityIssue",
}) as any as S.Schema<CapabilityIssue>;
export type CapabilityIssueList = CapabilityIssue[];
export const CapabilityIssueList = S.Array(CapabilityIssue);
export interface CapabilityHealth {
  issues?: CapabilityIssueList;
}
export const CapabilityHealth = S.suspend(() =>
  S.Struct({ issues: S.optional(CapabilityIssueList) }),
).annotations({
  identifier: "CapabilityHealth",
}) as any as S.Schema<CapabilityHealth>;
export interface Capability {
  capabilityName?: string;
  arn?: string;
  clusterName?: string;
  type?: string;
  roleArn?: string;
  status?: string;
  version?: string;
  configuration?: CapabilityConfigurationResponse;
  tags?: TagMap;
  health?: CapabilityHealth;
  createdAt?: Date;
  modifiedAt?: Date;
  deletePropagationPolicy?: string;
}
export const Capability = S.suspend(() =>
  S.Struct({
    capabilityName: S.optional(S.String),
    arn: S.optional(S.String),
    clusterName: S.optional(S.String),
    type: S.optional(S.String),
    roleArn: S.optional(S.String),
    status: S.optional(S.String),
    version: S.optional(S.String),
    configuration: S.optional(CapabilityConfigurationResponse),
    tags: S.optional(TagMap),
    health: S.optional(CapabilityHealth),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    deletePropagationPolicy: S.optional(S.String),
  }),
).annotations({ identifier: "Capability" }) as any as S.Schema<Capability>;
export interface DescribeCapabilityResponse {
  capability?: Capability;
}
export const DescribeCapabilityResponse = S.suspend(() =>
  S.Struct({ capability: S.optional(Capability) }),
).annotations({
  identifier: "DescribeCapabilityResponse",
}) as any as S.Schema<DescribeCapabilityResponse>;
export interface DescribeClusterResponse {
  cluster?: Cluster;
}
export const DescribeClusterResponse = S.suspend(() =>
  S.Struct({ cluster: S.optional(Cluster) }),
).annotations({
  identifier: "DescribeClusterResponse",
}) as any as S.Schema<DescribeClusterResponse>;
export interface DescribeEksAnywhereSubscriptionResponse {
  subscription?: EksAnywhereSubscription;
}
export const DescribeEksAnywhereSubscriptionResponse = S.suspend(() =>
  S.Struct({ subscription: S.optional(EksAnywhereSubscription) }),
).annotations({
  identifier: "DescribeEksAnywhereSubscriptionResponse",
}) as any as S.Schema<DescribeEksAnywhereSubscriptionResponse>;
export type FargateProfileLabel = { [key: string]: string };
export const FargateProfileLabel = S.Record({ key: S.String, value: S.String });
export interface FargateProfileSelector {
  namespace?: string;
  labels?: FargateProfileLabel;
}
export const FargateProfileSelector = S.suspend(() =>
  S.Struct({
    namespace: S.optional(S.String),
    labels: S.optional(FargateProfileLabel),
  }),
).annotations({
  identifier: "FargateProfileSelector",
}) as any as S.Schema<FargateProfileSelector>;
export type FargateProfileSelectors = FargateProfileSelector[];
export const FargateProfileSelectors = S.Array(FargateProfileSelector);
export interface FargateProfileIssue {
  code?: string;
  message?: string;
  resourceIds?: StringList;
}
export const FargateProfileIssue = S.suspend(() =>
  S.Struct({
    code: S.optional(S.String),
    message: S.optional(S.String),
    resourceIds: S.optional(StringList),
  }),
).annotations({
  identifier: "FargateProfileIssue",
}) as any as S.Schema<FargateProfileIssue>;
export type FargateProfileIssueList = FargateProfileIssue[];
export const FargateProfileIssueList = S.Array(FargateProfileIssue);
export interface FargateProfileHealth {
  issues?: FargateProfileIssueList;
}
export const FargateProfileHealth = S.suspend(() =>
  S.Struct({ issues: S.optional(FargateProfileIssueList) }),
).annotations({
  identifier: "FargateProfileHealth",
}) as any as S.Schema<FargateProfileHealth>;
export interface FargateProfile {
  fargateProfileName?: string;
  fargateProfileArn?: string;
  clusterName?: string;
  createdAt?: Date;
  podExecutionRoleArn?: string;
  subnets?: StringList;
  selectors?: FargateProfileSelectors;
  status?: string;
  tags?: TagMap;
  health?: FargateProfileHealth;
}
export const FargateProfile = S.suspend(() =>
  S.Struct({
    fargateProfileName: S.optional(S.String),
    fargateProfileArn: S.optional(S.String),
    clusterName: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    podExecutionRoleArn: S.optional(S.String),
    subnets: S.optional(StringList),
    selectors: S.optional(FargateProfileSelectors),
    status: S.optional(S.String),
    tags: S.optional(TagMap),
    health: S.optional(FargateProfileHealth),
  }),
).annotations({
  identifier: "FargateProfile",
}) as any as S.Schema<FargateProfile>;
export interface DescribeFargateProfileResponse {
  fargateProfile?: FargateProfile;
}
export const DescribeFargateProfileResponse = S.suspend(() =>
  S.Struct({ fargateProfile: S.optional(FargateProfile) }),
).annotations({
  identifier: "DescribeFargateProfileResponse",
}) as any as S.Schema<DescribeFargateProfileResponse>;
export interface DescribeIdentityProviderConfigRequest {
  clusterName: string;
  identityProviderConfig: IdentityProviderConfig;
}
export const DescribeIdentityProviderConfigRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    identityProviderConfig: IdentityProviderConfig,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/clusters/{clusterName}/identity-provider-configs/describe",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeIdentityProviderConfigRequest",
}) as any as S.Schema<DescribeIdentityProviderConfigRequest>;
export interface DescribeInsightsRefreshResponse {
  message?: string;
  status?: string;
  startedAt?: Date;
  endedAt?: Date;
}
export const DescribeInsightsRefreshResponse = S.suspend(() =>
  S.Struct({
    message: S.optional(S.String),
    status: S.optional(S.String),
    startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DescribeInsightsRefreshResponse",
}) as any as S.Schema<DescribeInsightsRefreshResponse>;
export interface AutoScalingGroup {
  name?: string;
}
export const AutoScalingGroup = S.suspend(() =>
  S.Struct({ name: S.optional(S.String) }),
).annotations({
  identifier: "AutoScalingGroup",
}) as any as S.Schema<AutoScalingGroup>;
export type AutoScalingGroupList = AutoScalingGroup[];
export const AutoScalingGroupList = S.Array(AutoScalingGroup);
export interface NodegroupResources {
  autoScalingGroups?: AutoScalingGroupList;
  remoteAccessSecurityGroup?: string;
}
export const NodegroupResources = S.suspend(() =>
  S.Struct({
    autoScalingGroups: S.optional(AutoScalingGroupList),
    remoteAccessSecurityGroup: S.optional(S.String),
  }),
).annotations({
  identifier: "NodegroupResources",
}) as any as S.Schema<NodegroupResources>;
export interface Issue {
  code?: string;
  message?: string;
  resourceIds?: StringList;
}
export const Issue = S.suspend(() =>
  S.Struct({
    code: S.optional(S.String),
    message: S.optional(S.String),
    resourceIds: S.optional(StringList),
  }),
).annotations({ identifier: "Issue" }) as any as S.Schema<Issue>;
export type IssueList = Issue[];
export const IssueList = S.Array(Issue);
export interface NodegroupHealth {
  issues?: IssueList;
}
export const NodegroupHealth = S.suspend(() =>
  S.Struct({ issues: S.optional(IssueList) }),
).annotations({
  identifier: "NodegroupHealth",
}) as any as S.Schema<NodegroupHealth>;
export interface NodeRepairConfigOverrides {
  nodeMonitoringCondition?: string;
  nodeUnhealthyReason?: string;
  minRepairWaitTimeMins?: number;
  repairAction?: string;
}
export const NodeRepairConfigOverrides = S.suspend(() =>
  S.Struct({
    nodeMonitoringCondition: S.optional(S.String),
    nodeUnhealthyReason: S.optional(S.String),
    minRepairWaitTimeMins: S.optional(S.Number),
    repairAction: S.optional(S.String),
  }),
).annotations({
  identifier: "NodeRepairConfigOverrides",
}) as any as S.Schema<NodeRepairConfigOverrides>;
export type NodeRepairConfigOverridesList = NodeRepairConfigOverrides[];
export const NodeRepairConfigOverridesList = S.Array(NodeRepairConfigOverrides);
export interface NodeRepairConfig {
  enabled?: boolean;
  maxUnhealthyNodeThresholdCount?: number;
  maxUnhealthyNodeThresholdPercentage?: number;
  maxParallelNodesRepairedCount?: number;
  maxParallelNodesRepairedPercentage?: number;
  nodeRepairConfigOverrides?: NodeRepairConfigOverridesList;
}
export const NodeRepairConfig = S.suspend(() =>
  S.Struct({
    enabled: S.optional(S.Boolean),
    maxUnhealthyNodeThresholdCount: S.optional(S.Number),
    maxUnhealthyNodeThresholdPercentage: S.optional(S.Number),
    maxParallelNodesRepairedCount: S.optional(S.Number),
    maxParallelNodesRepairedPercentage: S.optional(S.Number),
    nodeRepairConfigOverrides: S.optional(NodeRepairConfigOverridesList),
  }),
).annotations({
  identifier: "NodeRepairConfig",
}) as any as S.Schema<NodeRepairConfig>;
export interface Nodegroup {
  nodegroupName?: string;
  nodegroupArn?: string;
  clusterName?: string;
  version?: string;
  releaseVersion?: string;
  createdAt?: Date;
  modifiedAt?: Date;
  status?: string;
  capacityType?: string;
  scalingConfig?: NodegroupScalingConfig;
  instanceTypes?: StringList;
  subnets?: StringList;
  remoteAccess?: RemoteAccessConfig;
  amiType?: string;
  nodeRole?: string;
  labels?: labelsMap;
  taints?: taintsList;
  resources?: NodegroupResources;
  diskSize?: number;
  health?: NodegroupHealth;
  updateConfig?: NodegroupUpdateConfig;
  nodeRepairConfig?: NodeRepairConfig;
  launchTemplate?: LaunchTemplateSpecification;
  tags?: TagMap;
}
export const Nodegroup = S.suspend(() =>
  S.Struct({
    nodegroupName: S.optional(S.String),
    nodegroupArn: S.optional(S.String),
    clusterName: S.optional(S.String),
    version: S.optional(S.String),
    releaseVersion: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(S.String),
    capacityType: S.optional(S.String),
    scalingConfig: S.optional(NodegroupScalingConfig),
    instanceTypes: S.optional(StringList),
    subnets: S.optional(StringList),
    remoteAccess: S.optional(RemoteAccessConfig),
    amiType: S.optional(S.String),
    nodeRole: S.optional(S.String),
    labels: S.optional(labelsMap),
    taints: S.optional(taintsList),
    resources: S.optional(NodegroupResources),
    diskSize: S.optional(S.Number),
    health: S.optional(NodegroupHealth),
    updateConfig: S.optional(NodegroupUpdateConfig),
    nodeRepairConfig: S.optional(NodeRepairConfig),
    launchTemplate: S.optional(LaunchTemplateSpecification),
    tags: S.optional(TagMap),
  }),
).annotations({ identifier: "Nodegroup" }) as any as S.Schema<Nodegroup>;
export interface DescribeNodegroupResponse {
  nodegroup?: Nodegroup;
}
export const DescribeNodegroupResponse = S.suspend(() =>
  S.Struct({ nodegroup: S.optional(Nodegroup) }),
).annotations({
  identifier: "DescribeNodegroupResponse",
}) as any as S.Schema<DescribeNodegroupResponse>;
export interface DescribePodIdentityAssociationResponse {
  association?: PodIdentityAssociation;
}
export const DescribePodIdentityAssociationResponse = S.suspend(() =>
  S.Struct({ association: S.optional(PodIdentityAssociation) }),
).annotations({
  identifier: "DescribePodIdentityAssociationResponse",
}) as any as S.Schema<DescribePodIdentityAssociationResponse>;
export interface UpdateParam {
  type?: string;
  value?: string;
}
export const UpdateParam = S.suspend(() =>
  S.Struct({ type: S.optional(S.String), value: S.optional(S.String) }),
).annotations({ identifier: "UpdateParam" }) as any as S.Schema<UpdateParam>;
export type UpdateParams = UpdateParam[];
export const UpdateParams = S.Array(UpdateParam);
export interface ErrorDetail {
  errorCode?: string;
  errorMessage?: string;
  resourceIds?: StringList;
}
export const ErrorDetail = S.suspend(() =>
  S.Struct({
    errorCode: S.optional(S.String),
    errorMessage: S.optional(S.String),
    resourceIds: S.optional(StringList),
  }),
).annotations({ identifier: "ErrorDetail" }) as any as S.Schema<ErrorDetail>;
export type ErrorDetails = ErrorDetail[];
export const ErrorDetails = S.Array(ErrorDetail);
export interface Update {
  id?: string;
  status?: string;
  type?: string;
  params?: UpdateParams;
  createdAt?: Date;
  errors?: ErrorDetails;
}
export const Update = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    status: S.optional(S.String),
    type: S.optional(S.String),
    params: S.optional(UpdateParams),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    errors: S.optional(ErrorDetails),
  }),
).annotations({ identifier: "Update" }) as any as S.Schema<Update>;
export interface DisassociateIdentityProviderConfigResponse {
  update?: Update;
}
export const DisassociateIdentityProviderConfigResponse = S.suspend(() =>
  S.Struct({ update: S.optional(Update) }),
).annotations({
  identifier: "DisassociateIdentityProviderConfigResponse",
}) as any as S.Schema<DisassociateIdentityProviderConfigResponse>;
export interface ListAccessEntriesResponse {
  accessEntries?: StringList;
  nextToken?: string;
}
export const ListAccessEntriesResponse = S.suspend(() =>
  S.Struct({
    accessEntries: S.optional(StringList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAccessEntriesResponse",
}) as any as S.Schema<ListAccessEntriesResponse>;
export interface ListAddonsResponse {
  addons?: StringList;
  nextToken?: string;
}
export const ListAddonsResponse = S.suspend(() =>
  S.Struct({ addons: S.optional(StringList), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListAddonsResponse",
}) as any as S.Schema<ListAddonsResponse>;
export interface ListClustersResponse {
  clusters?: StringList;
  nextToken?: string;
}
export const ListClustersResponse = S.suspend(() =>
  S.Struct({
    clusters: S.optional(StringList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListClustersResponse",
}) as any as S.Schema<ListClustersResponse>;
export interface ListEksAnywhereSubscriptionsResponse {
  subscriptions?: EksAnywhereSubscriptionList;
  nextToken?: string;
}
export const ListEksAnywhereSubscriptionsResponse = S.suspend(() =>
  S.Struct({
    subscriptions: S.optional(EksAnywhereSubscriptionList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEksAnywhereSubscriptionsResponse",
}) as any as S.Schema<ListEksAnywhereSubscriptionsResponse>;
export interface ListFargateProfilesResponse {
  fargateProfileNames?: StringList;
  nextToken?: string;
}
export const ListFargateProfilesResponse = S.suspend(() =>
  S.Struct({
    fargateProfileNames: S.optional(StringList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListFargateProfilesResponse",
}) as any as S.Schema<ListFargateProfilesResponse>;
export interface ListIdentityProviderConfigsResponse {
  identityProviderConfigs?: IdentityProviderConfigs;
  nextToken?: string;
}
export const ListIdentityProviderConfigsResponse = S.suspend(() =>
  S.Struct({
    identityProviderConfigs: S.optional(IdentityProviderConfigs),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListIdentityProviderConfigsResponse",
}) as any as S.Schema<ListIdentityProviderConfigsResponse>;
export interface ListInsightsRequest {
  clusterName: string;
  filter?: InsightsFilter;
  maxResults?: number;
  nextToken?: string;
}
export const ListInsightsRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    filter: S.optional(InsightsFilter),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/clusters/{clusterName}/insights" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListInsightsRequest",
}) as any as S.Schema<ListInsightsRequest>;
export interface ListNodegroupsResponse {
  nodegroups?: StringList;
  nextToken?: string;
}
export const ListNodegroupsResponse = S.suspend(() =>
  S.Struct({
    nodegroups: S.optional(StringList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListNodegroupsResponse",
}) as any as S.Schema<ListNodegroupsResponse>;
export interface ListTagsForResourceResponse {
  tags?: TagMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ListUpdatesResponse {
  updateIds?: StringList;
  nextToken?: string;
}
export const ListUpdatesResponse = S.suspend(() =>
  S.Struct({
    updateIds: S.optional(StringList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListUpdatesResponse",
}) as any as S.Schema<ListUpdatesResponse>;
export interface RegisterClusterRequest {
  name: string;
  connectorConfig: ConnectorConfigRequest;
  clientRequestToken?: string;
  tags?: TagMap;
}
export const RegisterClusterRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    connectorConfig: ConnectorConfigRequest,
    clientRequestToken: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/cluster-registrations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterClusterRequest",
}) as any as S.Schema<RegisterClusterRequest>;
export interface StartInsightsRefreshResponse {
  message?: string;
  status?: string;
}
export const StartInsightsRefreshResponse = S.suspend(() =>
  S.Struct({ message: S.optional(S.String), status: S.optional(S.String) }),
).annotations({
  identifier: "StartInsightsRefreshResponse",
}) as any as S.Schema<StartInsightsRefreshResponse>;
export interface UpdateAccessEntryResponse {
  accessEntry?: AccessEntry;
}
export const UpdateAccessEntryResponse = S.suspend(() =>
  S.Struct({ accessEntry: S.optional(AccessEntry) }),
).annotations({
  identifier: "UpdateAccessEntryResponse",
}) as any as S.Schema<UpdateAccessEntryResponse>;
export interface UpdateAddonResponse {
  update?: Update;
}
export const UpdateAddonResponse = S.suspend(() =>
  S.Struct({ update: S.optional(Update) }),
).annotations({
  identifier: "UpdateAddonResponse",
}) as any as S.Schema<UpdateAddonResponse>;
export interface KubernetesNetworkConfigRequest {
  serviceIpv4Cidr?: string;
  ipFamily?: string;
  elasticLoadBalancing?: ElasticLoadBalancing;
}
export const KubernetesNetworkConfigRequest = S.suspend(() =>
  S.Struct({
    serviceIpv4Cidr: S.optional(S.String),
    ipFamily: S.optional(S.String),
    elasticLoadBalancing: S.optional(ElasticLoadBalancing),
  }),
).annotations({
  identifier: "KubernetesNetworkConfigRequest",
}) as any as S.Schema<KubernetesNetworkConfigRequest>;
export interface StorageConfigRequest {
  blockStorage?: BlockStorage;
}
export const StorageConfigRequest = S.suspend(() =>
  S.Struct({ blockStorage: S.optional(BlockStorage) }),
).annotations({
  identifier: "StorageConfigRequest",
}) as any as S.Schema<StorageConfigRequest>;
export interface RemoteNetworkConfigRequest {
  remoteNodeNetworks?: RemoteNodeNetworkList;
  remotePodNetworks?: RemotePodNetworkList;
}
export const RemoteNetworkConfigRequest = S.suspend(() =>
  S.Struct({
    remoteNodeNetworks: S.optional(RemoteNodeNetworkList),
    remotePodNetworks: S.optional(RemotePodNetworkList),
  }),
).annotations({
  identifier: "RemoteNetworkConfigRequest",
}) as any as S.Schema<RemoteNetworkConfigRequest>;
export interface UpdateClusterConfigRequest {
  name: string;
  resourcesVpcConfig?: VpcConfigRequest;
  logging?: Logging;
  clientRequestToken?: string;
  accessConfig?: UpdateAccessConfigRequest;
  upgradePolicy?: UpgradePolicyRequest;
  zonalShiftConfig?: ZonalShiftConfigRequest;
  computeConfig?: ComputeConfigRequest;
  kubernetesNetworkConfig?: KubernetesNetworkConfigRequest;
  storageConfig?: StorageConfigRequest;
  remoteNetworkConfig?: RemoteNetworkConfigRequest;
  deletionProtection?: boolean;
  controlPlaneScalingConfig?: ControlPlaneScalingConfig;
}
export const UpdateClusterConfigRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    resourcesVpcConfig: S.optional(VpcConfigRequest),
    logging: S.optional(Logging),
    clientRequestToken: S.optional(S.String),
    accessConfig: S.optional(UpdateAccessConfigRequest),
    upgradePolicy: S.optional(UpgradePolicyRequest),
    zonalShiftConfig: S.optional(ZonalShiftConfigRequest),
    computeConfig: S.optional(ComputeConfigRequest),
    kubernetesNetworkConfig: S.optional(KubernetesNetworkConfigRequest),
    storageConfig: S.optional(StorageConfigRequest),
    remoteNetworkConfig: S.optional(RemoteNetworkConfigRequest),
    deletionProtection: S.optional(S.Boolean),
    controlPlaneScalingConfig: S.optional(ControlPlaneScalingConfig),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/clusters/{name}/update-config" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateClusterConfigRequest",
}) as any as S.Schema<UpdateClusterConfigRequest>;
export interface UpdateClusterVersionResponse {
  update?: Update;
}
export const UpdateClusterVersionResponse = S.suspend(() =>
  S.Struct({ update: S.optional(Update) }),
).annotations({
  identifier: "UpdateClusterVersionResponse",
}) as any as S.Schema<UpdateClusterVersionResponse>;
export interface UpdateEksAnywhereSubscriptionResponse {
  subscription?: EksAnywhereSubscription;
}
export const UpdateEksAnywhereSubscriptionResponse = S.suspend(() =>
  S.Struct({ subscription: S.optional(EksAnywhereSubscription) }),
).annotations({
  identifier: "UpdateEksAnywhereSubscriptionResponse",
}) as any as S.Schema<UpdateEksAnywhereSubscriptionResponse>;
export interface UpdateNodegroupConfigRequest {
  clusterName: string;
  nodegroupName: string;
  labels?: UpdateLabelsPayload;
  taints?: UpdateTaintsPayload;
  scalingConfig?: NodegroupScalingConfig;
  updateConfig?: NodegroupUpdateConfig;
  nodeRepairConfig?: NodeRepairConfig;
  clientRequestToken?: string;
}
export const UpdateNodegroupConfigRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    nodegroupName: S.String.pipe(T.HttpLabel("nodegroupName")),
    labels: S.optional(UpdateLabelsPayload),
    taints: S.optional(UpdateTaintsPayload),
    scalingConfig: S.optional(NodegroupScalingConfig),
    updateConfig: S.optional(NodegroupUpdateConfig),
    nodeRepairConfig: S.optional(NodeRepairConfig),
    clientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/clusters/{clusterName}/node-groups/{nodegroupName}/update-config",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateNodegroupConfigRequest",
}) as any as S.Schema<UpdateNodegroupConfigRequest>;
export interface UpdateNodegroupVersionResponse {
  update?: Update;
}
export const UpdateNodegroupVersionResponse = S.suspend(() =>
  S.Struct({ update: S.optional(Update) }),
).annotations({
  identifier: "UpdateNodegroupVersionResponse",
}) as any as S.Schema<UpdateNodegroupVersionResponse>;
export interface UpdatePodIdentityAssociationResponse {
  association?: PodIdentityAssociation;
}
export const UpdatePodIdentityAssociationResponse = S.suspend(() =>
  S.Struct({ association: S.optional(PodIdentityAssociation) }),
).annotations({
  identifier: "UpdatePodIdentityAssociationResponse",
}) as any as S.Schema<UpdatePodIdentityAssociationResponse>;
export type requiredClaimsMap = { [key: string]: string };
export const requiredClaimsMap = S.Record({ key: S.String, value: S.String });
export interface ControlPlanePlacementRequest {
  groupName?: string;
}
export const ControlPlanePlacementRequest = S.suspend(() =>
  S.Struct({ groupName: S.optional(S.String) }),
).annotations({
  identifier: "ControlPlanePlacementRequest",
}) as any as S.Schema<ControlPlanePlacementRequest>;
export interface OidcIdentityProviderConfigRequest {
  identityProviderConfigName: string;
  issuerUrl: string;
  clientId: string;
  usernameClaim?: string;
  usernamePrefix?: string;
  groupsClaim?: string;
  groupsPrefix?: string;
  requiredClaims?: requiredClaimsMap;
}
export const OidcIdentityProviderConfigRequest = S.suspend(() =>
  S.Struct({
    identityProviderConfigName: S.String,
    issuerUrl: S.String,
    clientId: S.String,
    usernameClaim: S.optional(S.String),
    usernamePrefix: S.optional(S.String),
    groupsClaim: S.optional(S.String),
    groupsPrefix: S.optional(S.String),
    requiredClaims: S.optional(requiredClaimsMap),
  }),
).annotations({
  identifier: "OidcIdentityProviderConfigRequest",
}) as any as S.Schema<OidcIdentityProviderConfigRequest>;
export interface OutpostConfigRequest {
  outpostArns: StringList;
  controlPlaneInstanceType: string;
  controlPlanePlacement?: ControlPlanePlacementRequest;
}
export const OutpostConfigRequest = S.suspend(() =>
  S.Struct({
    outpostArns: StringList,
    controlPlaneInstanceType: S.String,
    controlPlanePlacement: S.optional(ControlPlanePlacementRequest),
  }),
).annotations({
  identifier: "OutpostConfigRequest",
}) as any as S.Schema<OutpostConfigRequest>;
export interface AddonPodIdentityConfiguration {
  serviceAccount?: string;
  recommendedManagedPolicies?: StringList;
}
export const AddonPodIdentityConfiguration = S.suspend(() =>
  S.Struct({
    serviceAccount: S.optional(S.String),
    recommendedManagedPolicies: S.optional(StringList),
  }),
).annotations({
  identifier: "AddonPodIdentityConfiguration",
}) as any as S.Schema<AddonPodIdentityConfiguration>;
export type AddonPodIdentityConfigurationList = AddonPodIdentityConfiguration[];
export const AddonPodIdentityConfigurationList = S.Array(
  AddonPodIdentityConfiguration,
);
export interface ClusterVersionInformation {
  clusterVersion?: string;
  clusterType?: string;
  defaultPlatformVersion?: string;
  defaultVersion?: boolean;
  releaseDate?: Date;
  endOfStandardSupportDate?: Date;
  endOfExtendedSupportDate?: Date;
  status?: string;
  versionStatus?: string;
  kubernetesPatchVersion?: string;
}
export const ClusterVersionInformation = S.suspend(() =>
  S.Struct({
    clusterVersion: S.optional(S.String),
    clusterType: S.optional(S.String),
    defaultPlatformVersion: S.optional(S.String),
    defaultVersion: S.optional(S.Boolean),
    releaseDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endOfStandardSupportDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    endOfExtendedSupportDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    status: S.optional(S.String),
    versionStatus: S.optional(S.String),
    kubernetesPatchVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "ClusterVersionInformation",
}) as any as S.Schema<ClusterVersionInformation>;
export type ClusterVersionList = ClusterVersionInformation[];
export const ClusterVersionList = S.Array(ClusterVersionInformation);
export interface AccessPolicy {
  name?: string;
  arn?: string;
}
export const AccessPolicy = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), arn: S.optional(S.String) }),
).annotations({ identifier: "AccessPolicy" }) as any as S.Schema<AccessPolicy>;
export type AccessPoliciesList = AccessPolicy[];
export const AccessPoliciesList = S.Array(AccessPolicy);
export interface AssociatedAccessPolicy {
  policyArn?: string;
  accessScope?: AccessScope;
  associatedAt?: Date;
  modifiedAt?: Date;
}
export const AssociatedAccessPolicy = S.suspend(() =>
  S.Struct({
    policyArn: S.optional(S.String),
    accessScope: S.optional(AccessScope),
    associatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "AssociatedAccessPolicy",
}) as any as S.Schema<AssociatedAccessPolicy>;
export type AssociatedAccessPoliciesList = AssociatedAccessPolicy[];
export const AssociatedAccessPoliciesList = S.Array(AssociatedAccessPolicy);
export interface CapabilitySummary {
  capabilityName?: string;
  arn?: string;
  type?: string;
  status?: string;
  version?: string;
  createdAt?: Date;
  modifiedAt?: Date;
}
export const CapabilitySummary = S.suspend(() =>
  S.Struct({
    capabilityName: S.optional(S.String),
    arn: S.optional(S.String),
    type: S.optional(S.String),
    status: S.optional(S.String),
    version: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "CapabilitySummary",
}) as any as S.Schema<CapabilitySummary>;
export type CapabilitySummaryList = CapabilitySummary[];
export const CapabilitySummaryList = S.Array(CapabilitySummary);
export interface PodIdentityAssociationSummary {
  clusterName?: string;
  namespace?: string;
  serviceAccount?: string;
  associationArn?: string;
  associationId?: string;
  ownerArn?: string;
}
export const PodIdentityAssociationSummary = S.suspend(() =>
  S.Struct({
    clusterName: S.optional(S.String),
    namespace: S.optional(S.String),
    serviceAccount: S.optional(S.String),
    associationArn: S.optional(S.String),
    associationId: S.optional(S.String),
    ownerArn: S.optional(S.String),
  }),
).annotations({
  identifier: "PodIdentityAssociationSummary",
}) as any as S.Schema<PodIdentityAssociationSummary>;
export type PodIdentityAssociationSummaries = PodIdentityAssociationSummary[];
export const PodIdentityAssociationSummaries = S.Array(
  PodIdentityAssociationSummary,
);
export interface ArgoCdAwsIdcConfigRequest {
  idcInstanceArn: string;
  idcRegion?: string;
}
export const ArgoCdAwsIdcConfigRequest = S.suspend(() =>
  S.Struct({ idcInstanceArn: S.String, idcRegion: S.optional(S.String) }),
).annotations({
  identifier: "ArgoCdAwsIdcConfigRequest",
}) as any as S.Schema<ArgoCdAwsIdcConfigRequest>;
export interface ArgoCdNetworkAccessConfigRequest {
  vpceIds?: StringList;
}
export const ArgoCdNetworkAccessConfigRequest = S.suspend(() =>
  S.Struct({ vpceIds: S.optional(StringList) }),
).annotations({
  identifier: "ArgoCdNetworkAccessConfigRequest",
}) as any as S.Schema<ArgoCdNetworkAccessConfigRequest>;
export interface UpdateRoleMappings {
  addOrUpdateRoleMappings?: ArgoCdRoleMappingList;
  removeRoleMappings?: ArgoCdRoleMappingList;
}
export const UpdateRoleMappings = S.suspend(() =>
  S.Struct({
    addOrUpdateRoleMappings: S.optional(ArgoCdRoleMappingList),
    removeRoleMappings: S.optional(ArgoCdRoleMappingList),
  }),
).annotations({
  identifier: "UpdateRoleMappings",
}) as any as S.Schema<UpdateRoleMappings>;
export interface AssociateAccessPolicyResponse {
  clusterName?: string;
  principalArn?: string;
  associatedAccessPolicy?: AssociatedAccessPolicy;
}
export const AssociateAccessPolicyResponse = S.suspend(() =>
  S.Struct({
    clusterName: S.optional(S.String),
    principalArn: S.optional(S.String),
    associatedAccessPolicy: S.optional(AssociatedAccessPolicy),
  }),
).annotations({
  identifier: "AssociateAccessPolicyResponse",
}) as any as S.Schema<AssociateAccessPolicyResponse>;
export interface AssociateEncryptionConfigRequest {
  clusterName: string;
  encryptionConfig: EncryptionConfigList;
  clientRequestToken?: string;
}
export const AssociateEncryptionConfigRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    encryptionConfig: EncryptionConfigList,
    clientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/clusters/{clusterName}/encryption-config/associate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateEncryptionConfigRequest",
}) as any as S.Schema<AssociateEncryptionConfigRequest>;
export interface AssociateIdentityProviderConfigRequest {
  clusterName: string;
  oidc: OidcIdentityProviderConfigRequest;
  tags?: TagMap;
  clientRequestToken?: string;
}
export const AssociateIdentityProviderConfigRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    oidc: OidcIdentityProviderConfigRequest,
    tags: S.optional(TagMap),
    clientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/clusters/{clusterName}/identity-provider-configs/associate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateIdentityProviderConfigRequest",
}) as any as S.Schema<AssociateIdentityProviderConfigRequest>;
export interface CreateAccessEntryResponse {
  accessEntry?: AccessEntry;
}
export const CreateAccessEntryResponse = S.suspend(() =>
  S.Struct({ accessEntry: S.optional(AccessEntry) }),
).annotations({
  identifier: "CreateAccessEntryResponse",
}) as any as S.Schema<CreateAccessEntryResponse>;
export interface CreateAddonResponse {
  addon?: Addon;
}
export const CreateAddonResponse = S.suspend(() =>
  S.Struct({ addon: S.optional(Addon) }),
).annotations({
  identifier: "CreateAddonResponse",
}) as any as S.Schema<CreateAddonResponse>;
export interface CreateClusterRequest {
  name: string;
  version?: string;
  roleArn: string;
  resourcesVpcConfig: VpcConfigRequest;
  kubernetesNetworkConfig?: KubernetesNetworkConfigRequest;
  logging?: Logging;
  clientRequestToken?: string;
  tags?: TagMap;
  encryptionConfig?: EncryptionConfigList;
  outpostConfig?: OutpostConfigRequest;
  accessConfig?: CreateAccessConfigRequest;
  bootstrapSelfManagedAddons?: boolean;
  upgradePolicy?: UpgradePolicyRequest;
  zonalShiftConfig?: ZonalShiftConfigRequest;
  remoteNetworkConfig?: RemoteNetworkConfigRequest;
  computeConfig?: ComputeConfigRequest;
  storageConfig?: StorageConfigRequest;
  deletionProtection?: boolean;
  controlPlaneScalingConfig?: ControlPlaneScalingConfig;
}
export const CreateClusterRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    version: S.optional(S.String),
    roleArn: S.String,
    resourcesVpcConfig: VpcConfigRequest,
    kubernetesNetworkConfig: S.optional(KubernetesNetworkConfigRequest),
    logging: S.optional(Logging),
    clientRequestToken: S.optional(S.String),
    tags: S.optional(TagMap),
    encryptionConfig: S.optional(EncryptionConfigList),
    outpostConfig: S.optional(OutpostConfigRequest),
    accessConfig: S.optional(CreateAccessConfigRequest),
    bootstrapSelfManagedAddons: S.optional(S.Boolean),
    upgradePolicy: S.optional(UpgradePolicyRequest),
    zonalShiftConfig: S.optional(ZonalShiftConfigRequest),
    remoteNetworkConfig: S.optional(RemoteNetworkConfigRequest),
    computeConfig: S.optional(ComputeConfigRequest),
    storageConfig: S.optional(StorageConfigRequest),
    deletionProtection: S.optional(S.Boolean),
    controlPlaneScalingConfig: S.optional(ControlPlaneScalingConfig),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/clusters" }),
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
export interface CreateEksAnywhereSubscriptionResponse {
  subscription?: EksAnywhereSubscription;
}
export const CreateEksAnywhereSubscriptionResponse = S.suspend(() =>
  S.Struct({ subscription: S.optional(EksAnywhereSubscription) }),
).annotations({
  identifier: "CreateEksAnywhereSubscriptionResponse",
}) as any as S.Schema<CreateEksAnywhereSubscriptionResponse>;
export interface CreateFargateProfileRequest {
  fargateProfileName: string;
  clusterName: string;
  podExecutionRoleArn: string;
  subnets?: StringList;
  selectors?: FargateProfileSelectors;
  clientRequestToken?: string;
  tags?: TagMap;
}
export const CreateFargateProfileRequest = S.suspend(() =>
  S.Struct({
    fargateProfileName: S.String,
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    podExecutionRoleArn: S.String,
    subnets: S.optional(StringList),
    selectors: S.optional(FargateProfileSelectors),
    clientRequestToken: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/clusters/{clusterName}/fargate-profiles",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFargateProfileRequest",
}) as any as S.Schema<CreateFargateProfileRequest>;
export interface CreateNodegroupRequest {
  clusterName: string;
  nodegroupName: string;
  scalingConfig?: NodegroupScalingConfig;
  diskSize?: number;
  subnets: StringList;
  instanceTypes?: StringList;
  amiType?: string;
  remoteAccess?: RemoteAccessConfig;
  nodeRole: string;
  labels?: labelsMap;
  taints?: taintsList;
  tags?: TagMap;
  clientRequestToken?: string;
  launchTemplate?: LaunchTemplateSpecification;
  updateConfig?: NodegroupUpdateConfig;
  nodeRepairConfig?: NodeRepairConfig;
  capacityType?: string;
  version?: string;
  releaseVersion?: string;
}
export const CreateNodegroupRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    nodegroupName: S.String,
    scalingConfig: S.optional(NodegroupScalingConfig),
    diskSize: S.optional(S.Number),
    subnets: StringList,
    instanceTypes: S.optional(StringList),
    amiType: S.optional(S.String),
    remoteAccess: S.optional(RemoteAccessConfig),
    nodeRole: S.String,
    labels: S.optional(labelsMap),
    taints: S.optional(taintsList),
    tags: S.optional(TagMap),
    clientRequestToken: S.optional(S.String),
    launchTemplate: S.optional(LaunchTemplateSpecification),
    updateConfig: S.optional(NodegroupUpdateConfig),
    nodeRepairConfig: S.optional(NodeRepairConfig),
    capacityType: S.optional(S.String),
    version: S.optional(S.String),
    releaseVersion: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/clusters/{clusterName}/node-groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateNodegroupRequest",
}) as any as S.Schema<CreateNodegroupRequest>;
export interface CreatePodIdentityAssociationResponse {
  association?: PodIdentityAssociation;
}
export const CreatePodIdentityAssociationResponse = S.suspend(() =>
  S.Struct({ association: S.optional(PodIdentityAssociation) }),
).annotations({
  identifier: "CreatePodIdentityAssociationResponse",
}) as any as S.Schema<CreatePodIdentityAssociationResponse>;
export interface DescribeAddonConfigurationResponse {
  addonName?: string;
  addonVersion?: string;
  configurationSchema?: string;
  podIdentityConfiguration?: AddonPodIdentityConfigurationList;
}
export const DescribeAddonConfigurationResponse = S.suspend(() =>
  S.Struct({
    addonName: S.optional(S.String),
    addonVersion: S.optional(S.String),
    configurationSchema: S.optional(S.String),
    podIdentityConfiguration: S.optional(AddonPodIdentityConfigurationList),
  }),
).annotations({
  identifier: "DescribeAddonConfigurationResponse",
}) as any as S.Schema<DescribeAddonConfigurationResponse>;
export interface DescribeClusterVersionsResponse {
  nextToken?: string;
  clusterVersions?: ClusterVersionList;
}
export const DescribeClusterVersionsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    clusterVersions: S.optional(ClusterVersionList),
  }),
).annotations({
  identifier: "DescribeClusterVersionsResponse",
}) as any as S.Schema<DescribeClusterVersionsResponse>;
export interface ListAccessPoliciesResponse {
  accessPolicies?: AccessPoliciesList;
  nextToken?: string;
}
export const ListAccessPoliciesResponse = S.suspend(() =>
  S.Struct({
    accessPolicies: S.optional(AccessPoliciesList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAccessPoliciesResponse",
}) as any as S.Schema<ListAccessPoliciesResponse>;
export interface ListAssociatedAccessPoliciesResponse {
  clusterName?: string;
  principalArn?: string;
  nextToken?: string;
  associatedAccessPolicies?: AssociatedAccessPoliciesList;
}
export const ListAssociatedAccessPoliciesResponse = S.suspend(() =>
  S.Struct({
    clusterName: S.optional(S.String),
    principalArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    associatedAccessPolicies: S.optional(AssociatedAccessPoliciesList),
  }),
).annotations({
  identifier: "ListAssociatedAccessPoliciesResponse",
}) as any as S.Schema<ListAssociatedAccessPoliciesResponse>;
export interface ListCapabilitiesResponse {
  capabilities?: CapabilitySummaryList;
  nextToken?: string;
}
export const ListCapabilitiesResponse = S.suspend(() =>
  S.Struct({
    capabilities: S.optional(CapabilitySummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCapabilitiesResponse",
}) as any as S.Schema<ListCapabilitiesResponse>;
export interface ListPodIdentityAssociationsResponse {
  associations?: PodIdentityAssociationSummaries;
  nextToken?: string;
}
export const ListPodIdentityAssociationsResponse = S.suspend(() =>
  S.Struct({
    associations: S.optional(PodIdentityAssociationSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPodIdentityAssociationsResponse",
}) as any as S.Schema<ListPodIdentityAssociationsResponse>;
export interface RegisterClusterResponse {
  cluster?: Cluster;
}
export const RegisterClusterResponse = S.suspend(() =>
  S.Struct({ cluster: S.optional(Cluster) }),
).annotations({
  identifier: "RegisterClusterResponse",
}) as any as S.Schema<RegisterClusterResponse>;
export interface UpdateClusterConfigResponse {
  update?: Update;
}
export const UpdateClusterConfigResponse = S.suspend(() =>
  S.Struct({ update: S.optional(Update) }),
).annotations({
  identifier: "UpdateClusterConfigResponse",
}) as any as S.Schema<UpdateClusterConfigResponse>;
export interface UpdateNodegroupConfigResponse {
  update?: Update;
}
export const UpdateNodegroupConfigResponse = S.suspend(() =>
  S.Struct({ update: S.optional(Update) }),
).annotations({
  identifier: "UpdateNodegroupConfigResponse",
}) as any as S.Schema<UpdateNodegroupConfigResponse>;
export interface InsightStatus {
  status?: string;
  reason?: string;
}
export const InsightStatus = S.suspend(() =>
  S.Struct({ status: S.optional(S.String), reason: S.optional(S.String) }),
).annotations({
  identifier: "InsightStatus",
}) as any as S.Schema<InsightStatus>;
export type AdditionalInfoMap = { [key: string]: string };
export const AdditionalInfoMap = S.Record({ key: S.String, value: S.String });
export interface InsightResourceDetail {
  insightStatus?: InsightStatus;
  kubernetesResourceUri?: string;
  arn?: string;
}
export const InsightResourceDetail = S.suspend(() =>
  S.Struct({
    insightStatus: S.optional(InsightStatus),
    kubernetesResourceUri: S.optional(S.String),
    arn: S.optional(S.String),
  }),
).annotations({
  identifier: "InsightResourceDetail",
}) as any as S.Schema<InsightResourceDetail>;
export type InsightResourceDetails = InsightResourceDetail[];
export const InsightResourceDetails = S.Array(InsightResourceDetail);
export interface UpdateArgoCdConfig {
  rbacRoleMappings?: UpdateRoleMappings;
  networkAccess?: ArgoCdNetworkAccessConfigRequest;
}
export const UpdateArgoCdConfig = S.suspend(() =>
  S.Struct({
    rbacRoleMappings: S.optional(UpdateRoleMappings),
    networkAccess: S.optional(ArgoCdNetworkAccessConfigRequest),
  }),
).annotations({
  identifier: "UpdateArgoCdConfig",
}) as any as S.Schema<UpdateArgoCdConfig>;
export interface InsightSummary {
  id?: string;
  name?: string;
  category?: string;
  kubernetesVersion?: string;
  lastRefreshTime?: Date;
  lastTransitionTime?: Date;
  description?: string;
  insightStatus?: InsightStatus;
}
export const InsightSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    category: S.optional(S.String),
    kubernetesVersion: S.optional(S.String),
    lastRefreshTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastTransitionTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    description: S.optional(S.String),
    insightStatus: S.optional(InsightStatus),
  }),
).annotations({
  identifier: "InsightSummary",
}) as any as S.Schema<InsightSummary>;
export type InsightSummaries = InsightSummary[];
export const InsightSummaries = S.Array(InsightSummary);
export interface UpdateCapabilityConfiguration {
  argoCd?: UpdateArgoCdConfig;
}
export const UpdateCapabilityConfiguration = S.suspend(() =>
  S.Struct({ argoCd: S.optional(UpdateArgoCdConfig) }),
).annotations({
  identifier: "UpdateCapabilityConfiguration",
}) as any as S.Schema<UpdateCapabilityConfiguration>;
export interface Compatibility {
  clusterVersion?: string;
  platformVersions?: StringList;
  defaultVersion?: boolean;
}
export const Compatibility = S.suspend(() =>
  S.Struct({
    clusterVersion: S.optional(S.String),
    platformVersions: S.optional(StringList),
    defaultVersion: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "Compatibility",
}) as any as S.Schema<Compatibility>;
export type Compatibilities = Compatibility[];
export const Compatibilities = S.Array(Compatibility);
export interface AddonCompatibilityDetail {
  name?: string;
  compatibleVersions?: StringList;
}
export const AddonCompatibilityDetail = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    compatibleVersions: S.optional(StringList),
  }),
).annotations({
  identifier: "AddonCompatibilityDetail",
}) as any as S.Schema<AddonCompatibilityDetail>;
export type AddonCompatibilityDetails = AddonCompatibilityDetail[];
export const AddonCompatibilityDetails = S.Array(AddonCompatibilityDetail);
export interface AssociateEncryptionConfigResponse {
  update?: Update;
}
export const AssociateEncryptionConfigResponse = S.suspend(() =>
  S.Struct({ update: S.optional(Update) }),
).annotations({
  identifier: "AssociateEncryptionConfigResponse",
}) as any as S.Schema<AssociateEncryptionConfigResponse>;
export interface AssociateIdentityProviderConfigResponse {
  update?: Update;
  tags?: TagMap;
}
export const AssociateIdentityProviderConfigResponse = S.suspend(() =>
  S.Struct({ update: S.optional(Update), tags: S.optional(TagMap) }),
).annotations({
  identifier: "AssociateIdentityProviderConfigResponse",
}) as any as S.Schema<AssociateIdentityProviderConfigResponse>;
export interface CreateClusterResponse {
  cluster?: Cluster;
}
export const CreateClusterResponse = S.suspend(() =>
  S.Struct({ cluster: S.optional(Cluster) }),
).annotations({
  identifier: "CreateClusterResponse",
}) as any as S.Schema<CreateClusterResponse>;
export interface CreateFargateProfileResponse {
  fargateProfile?: FargateProfile;
}
export const CreateFargateProfileResponse = S.suspend(() =>
  S.Struct({ fargateProfile: S.optional(FargateProfile) }),
).annotations({
  identifier: "CreateFargateProfileResponse",
}) as any as S.Schema<CreateFargateProfileResponse>;
export interface CreateNodegroupResponse {
  nodegroup?: Nodegroup;
}
export const CreateNodegroupResponse = S.suspend(() =>
  S.Struct({ nodegroup: S.optional(Nodegroup) }),
).annotations({
  identifier: "CreateNodegroupResponse",
}) as any as S.Schema<CreateNodegroupResponse>;
export interface DeleteEksAnywhereSubscriptionResponse {
  subscription?: EksAnywhereSubscription;
}
export const DeleteEksAnywhereSubscriptionResponse = S.suspend(() =>
  S.Struct({ subscription: S.optional(EksAnywhereSubscription) }),
).annotations({
  identifier: "DeleteEksAnywhereSubscriptionResponse",
}) as any as S.Schema<DeleteEksAnywhereSubscriptionResponse>;
export interface DescribeUpdateResponse {
  update?: Update;
}
export const DescribeUpdateResponse = S.suspend(() =>
  S.Struct({ update: S.optional(Update) }),
).annotations({
  identifier: "DescribeUpdateResponse",
}) as any as S.Schema<DescribeUpdateResponse>;
export interface ListInsightsResponse {
  insights?: InsightSummaries;
  nextToken?: string;
}
export const ListInsightsResponse = S.suspend(() =>
  S.Struct({
    insights: S.optional(InsightSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListInsightsResponse",
}) as any as S.Schema<ListInsightsResponse>;
export interface UpdateCapabilityRequest {
  clusterName: string;
  capabilityName: string;
  roleArn?: string;
  configuration?: UpdateCapabilityConfiguration;
  clientRequestToken?: string;
  deletePropagationPolicy?: string;
}
export const UpdateCapabilityRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    capabilityName: S.String.pipe(T.HttpLabel("capabilityName")),
    roleArn: S.optional(S.String),
    configuration: S.optional(UpdateCapabilityConfiguration),
    clientRequestToken: S.optional(S.String),
    deletePropagationPolicy: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/clusters/{clusterName}/capabilities/{capabilityName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCapabilityRequest",
}) as any as S.Schema<UpdateCapabilityRequest>;
export interface ArgoCdConfigRequest {
  namespace?: string;
  awsIdc: ArgoCdAwsIdcConfigRequest;
  rbacRoleMappings?: ArgoCdRoleMappingList;
  networkAccess?: ArgoCdNetworkAccessConfigRequest;
}
export const ArgoCdConfigRequest = S.suspend(() =>
  S.Struct({
    namespace: S.optional(S.String),
    awsIdc: ArgoCdAwsIdcConfigRequest,
    rbacRoleMappings: S.optional(ArgoCdRoleMappingList),
    networkAccess: S.optional(ArgoCdNetworkAccessConfigRequest),
  }),
).annotations({
  identifier: "ArgoCdConfigRequest",
}) as any as S.Schema<ArgoCdConfigRequest>;
export interface AddonVersionInfo {
  addonVersion?: string;
  architecture?: StringList;
  computeTypes?: StringList;
  compatibilities?: Compatibilities;
  requiresConfiguration?: boolean;
  requiresIamPermissions?: boolean;
}
export const AddonVersionInfo = S.suspend(() =>
  S.Struct({
    addonVersion: S.optional(S.String),
    architecture: S.optional(StringList),
    computeTypes: S.optional(StringList),
    compatibilities: S.optional(Compatibilities),
    requiresConfiguration: S.optional(S.Boolean),
    requiresIamPermissions: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AddonVersionInfo",
}) as any as S.Schema<AddonVersionInfo>;
export type AddonVersionInfoList = AddonVersionInfo[];
export const AddonVersionInfoList = S.Array(AddonVersionInfo);
export interface OidcIdentityProviderConfig {
  identityProviderConfigName?: string;
  identityProviderConfigArn?: string;
  clusterName?: string;
  issuerUrl?: string;
  clientId?: string;
  usernameClaim?: string;
  usernamePrefix?: string;
  groupsClaim?: string;
  groupsPrefix?: string;
  requiredClaims?: requiredClaimsMap;
  tags?: TagMap;
  status?: string;
}
export const OidcIdentityProviderConfig = S.suspend(() =>
  S.Struct({
    identityProviderConfigName: S.optional(S.String),
    identityProviderConfigArn: S.optional(S.String),
    clusterName: S.optional(S.String),
    issuerUrl: S.optional(S.String),
    clientId: S.optional(S.String),
    usernameClaim: S.optional(S.String),
    usernamePrefix: S.optional(S.String),
    groupsClaim: S.optional(S.String),
    groupsPrefix: S.optional(S.String),
    requiredClaims: S.optional(requiredClaimsMap),
    tags: S.optional(TagMap),
    status: S.optional(S.String),
  }),
).annotations({
  identifier: "OidcIdentityProviderConfig",
}) as any as S.Schema<OidcIdentityProviderConfig>;
export interface ClientStat {
  userAgent?: string;
  numberOfRequestsLast30Days?: number;
  lastRequestTime?: Date;
}
export const ClientStat = S.suspend(() =>
  S.Struct({
    userAgent: S.optional(S.String),
    numberOfRequestsLast30Days: S.optional(S.Number),
    lastRequestTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "ClientStat" }) as any as S.Schema<ClientStat>;
export type ClientStats = ClientStat[];
export const ClientStats = S.Array(ClientStat);
export interface CapabilityConfigurationRequest {
  argoCd?: ArgoCdConfigRequest;
}
export const CapabilityConfigurationRequest = S.suspend(() =>
  S.Struct({ argoCd: S.optional(ArgoCdConfigRequest) }),
).annotations({
  identifier: "CapabilityConfigurationRequest",
}) as any as S.Schema<CapabilityConfigurationRequest>;
export interface AddonInfo {
  addonName?: string;
  type?: string;
  addonVersions?: AddonVersionInfoList;
  publisher?: string;
  owner?: string;
  marketplaceInformation?: MarketplaceInformation;
  defaultNamespace?: string;
}
export const AddonInfo = S.suspend(() =>
  S.Struct({
    addonName: S.optional(S.String),
    type: S.optional(S.String),
    addonVersions: S.optional(AddonVersionInfoList),
    publisher: S.optional(S.String),
    owner: S.optional(S.String),
    marketplaceInformation: S.optional(MarketplaceInformation),
    defaultNamespace: S.optional(S.String),
  }),
).annotations({ identifier: "AddonInfo" }) as any as S.Schema<AddonInfo>;
export type Addons = AddonInfo[];
export const Addons = S.Array(AddonInfo);
export interface IdentityProviderConfigResponse {
  oidc?: OidcIdentityProviderConfig;
}
export const IdentityProviderConfigResponse = S.suspend(() =>
  S.Struct({ oidc: S.optional(OidcIdentityProviderConfig) }),
).annotations({
  identifier: "IdentityProviderConfigResponse",
}) as any as S.Schema<IdentityProviderConfigResponse>;
export interface DeprecationDetail {
  usage?: string;
  replacedWith?: string;
  stopServingVersion?: string;
  startServingReplacementVersion?: string;
  clientStats?: ClientStats;
}
export const DeprecationDetail = S.suspend(() =>
  S.Struct({
    usage: S.optional(S.String),
    replacedWith: S.optional(S.String),
    stopServingVersion: S.optional(S.String),
    startServingReplacementVersion: S.optional(S.String),
    clientStats: S.optional(ClientStats),
  }),
).annotations({
  identifier: "DeprecationDetail",
}) as any as S.Schema<DeprecationDetail>;
export type DeprecationDetails = DeprecationDetail[];
export const DeprecationDetails = S.Array(DeprecationDetail);
export interface CreateCapabilityRequest {
  capabilityName: string;
  clusterName: string;
  clientRequestToken?: string;
  type: string;
  roleArn: string;
  configuration?: CapabilityConfigurationRequest;
  tags?: TagMap;
  deletePropagationPolicy: string;
}
export const CreateCapabilityRequest = S.suspend(() =>
  S.Struct({
    capabilityName: S.String,
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    clientRequestToken: S.optional(S.String),
    type: S.String,
    roleArn: S.String,
    configuration: S.optional(CapabilityConfigurationRequest),
    tags: S.optional(TagMap),
    deletePropagationPolicy: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/clusters/{clusterName}/capabilities" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCapabilityRequest",
}) as any as S.Schema<CreateCapabilityRequest>;
export interface DeleteAddonResponse {
  addon?: Addon;
}
export const DeleteAddonResponse = S.suspend(() =>
  S.Struct({ addon: S.optional(Addon) }),
).annotations({
  identifier: "DeleteAddonResponse",
}) as any as S.Schema<DeleteAddonResponse>;
export interface DeleteClusterResponse {
  cluster?: Cluster;
}
export const DeleteClusterResponse = S.suspend(() =>
  S.Struct({ cluster: S.optional(Cluster) }),
).annotations({
  identifier: "DeleteClusterResponse",
}) as any as S.Schema<DeleteClusterResponse>;
export interface DeleteFargateProfileResponse {
  fargateProfile?: FargateProfile;
}
export const DeleteFargateProfileResponse = S.suspend(() =>
  S.Struct({ fargateProfile: S.optional(FargateProfile) }),
).annotations({
  identifier: "DeleteFargateProfileResponse",
}) as any as S.Schema<DeleteFargateProfileResponse>;
export interface DeleteNodegroupResponse {
  nodegroup?: Nodegroup;
}
export const DeleteNodegroupResponse = S.suspend(() =>
  S.Struct({ nodegroup: S.optional(Nodegroup) }),
).annotations({
  identifier: "DeleteNodegroupResponse",
}) as any as S.Schema<DeleteNodegroupResponse>;
export interface DescribeAddonVersionsResponse {
  addons?: Addons;
  nextToken?: string;
}
export const DescribeAddonVersionsResponse = S.suspend(() =>
  S.Struct({ addons: S.optional(Addons), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "DescribeAddonVersionsResponse",
}) as any as S.Schema<DescribeAddonVersionsResponse>;
export interface DescribeIdentityProviderConfigResponse {
  identityProviderConfig?: IdentityProviderConfigResponse;
}
export const DescribeIdentityProviderConfigResponse = S.suspend(() =>
  S.Struct({
    identityProviderConfig: S.optional(IdentityProviderConfigResponse),
  }),
).annotations({
  identifier: "DescribeIdentityProviderConfigResponse",
}) as any as S.Schema<DescribeIdentityProviderConfigResponse>;
export interface UpdateCapabilityResponse {
  update?: Update;
}
export const UpdateCapabilityResponse = S.suspend(() =>
  S.Struct({ update: S.optional(Update) }),
).annotations({
  identifier: "UpdateCapabilityResponse",
}) as any as S.Schema<UpdateCapabilityResponse>;
export interface InsightCategorySpecificSummary {
  deprecationDetails?: DeprecationDetails;
  addonCompatibilityDetails?: AddonCompatibilityDetails;
}
export const InsightCategorySpecificSummary = S.suspend(() =>
  S.Struct({
    deprecationDetails: S.optional(DeprecationDetails),
    addonCompatibilityDetails: S.optional(AddonCompatibilityDetails),
  }),
).annotations({
  identifier: "InsightCategorySpecificSummary",
}) as any as S.Schema<InsightCategorySpecificSummary>;
export interface Insight {
  id?: string;
  name?: string;
  category?: string;
  kubernetesVersion?: string;
  lastRefreshTime?: Date;
  lastTransitionTime?: Date;
  description?: string;
  insightStatus?: InsightStatus;
  recommendation?: string;
  additionalInfo?: AdditionalInfoMap;
  resources?: InsightResourceDetails;
  categorySpecificSummary?: InsightCategorySpecificSummary;
}
export const Insight = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    category: S.optional(S.String),
    kubernetesVersion: S.optional(S.String),
    lastRefreshTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastTransitionTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    description: S.optional(S.String),
    insightStatus: S.optional(InsightStatus),
    recommendation: S.optional(S.String),
    additionalInfo: S.optional(AdditionalInfoMap),
    resources: S.optional(InsightResourceDetails),
    categorySpecificSummary: S.optional(InsightCategorySpecificSummary),
  }),
).annotations({ identifier: "Insight" }) as any as S.Schema<Insight>;
export interface CreateCapabilityResponse {
  capability?: Capability;
}
export const CreateCapabilityResponse = S.suspend(() =>
  S.Struct({ capability: S.optional(Capability) }),
).annotations({
  identifier: "CreateCapabilityResponse",
}) as any as S.Schema<CreateCapabilityResponse>;
export interface DeleteCapabilityResponse {
  capability?: Capability;
}
export const DeleteCapabilityResponse = S.suspend(() =>
  S.Struct({ capability: S.optional(Capability) }),
).annotations({
  identifier: "DeleteCapabilityResponse",
}) as any as S.Schema<DeleteCapabilityResponse>;
export interface DescribeInsightResponse {
  insight?: Insight;
}
export const DescribeInsightResponse = S.suspend(() =>
  S.Struct({ insight: S.optional(Insight) }),
).annotations({
  identifier: "DescribeInsightResponse",
}) as any as S.Schema<DescribeInsightResponse>;

//# Errors
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  {
    clusterName: S.optional(S.String),
    nodegroupName: S.optional(S.String),
    addonName: S.optional(S.String),
    subscriptionId: S.optional(S.String),
    message: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    clusterName: S.optional(S.String),
    nodegroupName: S.optional(S.String),
    fargateProfileName: S.optional(S.String),
    addonName: S.optional(S.String),
    subscriptionId: S.optional(S.String),
    message: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  {
    clusterName: S.optional(S.String),
    nodegroupName: S.optional(S.String),
    fargateProfileName: S.optional(S.String),
    addonName: S.optional(S.String),
    subscriptionId: S.optional(S.String),
    message: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ClientException extends S.TaggedError<ClientException>()(
  "ClientException",
  {
    clusterName: S.optional(S.String),
    nodegroupName: S.optional(S.String),
    addonName: S.optional(S.String),
    subscriptionId: S.optional(S.String),
    message: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServerException extends S.TaggedError<ServerException>()(
  "ServerException",
  {
    clusterName: S.optional(S.String),
    nodegroupName: S.optional(S.String),
    addonName: S.optional(S.String),
    subscriptionId: S.optional(S.String),
    message: S.optional(S.String),
  },
).pipe(C.withServerError) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  {
    clusterName: S.optional(S.String),
    nodegroupName: S.optional(S.String),
    addonName: S.optional(S.String),
    message: S.optional(S.String),
  },
).pipe(C.withConflictError) {}
export class InvalidStateException extends S.TaggedError<InvalidStateException>()(
  "InvalidStateException",
  { clusterName: S.optional(S.String), message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceLimitExceededException extends S.TaggedError<ResourceLimitExceededException>()(
  "ResourceLimitExceededException",
  {
    clusterName: S.optional(S.String),
    nodegroupName: S.optional(S.String),
    subscriptionId: S.optional(S.String),
    message: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { clusterName: S.optional(S.String), message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class UnsupportedAvailabilityZoneException extends S.TaggedError<UnsupportedAvailabilityZoneException>()(
  "UnsupportedAvailabilityZoneException",
  {
    message: S.optional(S.String),
    clusterName: S.optional(S.String),
    nodegroupName: S.optional(S.String),
    validZones: S.optional(StringList),
  },
).pipe(C.withBadRequestError) {}
export class ResourcePropagationDelayException extends S.TaggedError<ResourcePropagationDelayException>()(
  "ResourcePropagationDelayException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Associates the specified tags to an Amazon EKS resource with the specified
 * `resourceArn`. If existing tags on a resource are not specified in the
 * request parameters, they aren't changed. When a resource is deleted, the tags associated
 * with that resource are also deleted. Tags that you create for Amazon EKS resources don't
 * propagate to any other resources associated with the cluster. For example, if you tag a
 * cluster with this operation, that tag doesn't automatically propagate to the subnets and
 * nodes associated with the cluster.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  BadRequestException | NotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [BadRequestException, NotFoundException],
}));
/**
 * Deletes specified tags from an Amazon EKS resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  BadRequestException | NotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [BadRequestException, NotFoundException],
}));
/**
 * List the tags for an Amazon EKS resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  BadRequestException | NotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [BadRequestException, NotFoundException],
}));
/**
 * Deletes an access entry.
 *
 * Deleting an access entry of a type other than `Standard` can cause your
 * cluster to function improperly. If you delete an access entry in error, you can recreate
 * it.
 */
export const deleteAccessEntry: (
  input: DeleteAccessEntryRequest,
) => Effect.Effect<
  DeleteAccessEntryResponse,
  | InvalidRequestException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessEntryRequest,
  output: DeleteAccessEntryResponse,
  errors: [InvalidRequestException, ResourceNotFoundException, ServerException],
}));
/**
 * Deletes an expired or inactive subscription. Deleting inactive subscriptions removes
 * them from the Amazon Web Services Management Console view and from list/describe API responses. Subscriptions can
 * only be cancelled within 7 days of creation and are cancelled by creating a ticket in
 * the Amazon Web Services Support Center.
 */
export const deleteEksAnywhereSubscription: (
  input: DeleteEksAnywhereSubscriptionRequest,
) => Effect.Effect<
  DeleteEksAnywhereSubscriptionResponse,
  | ClientException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEksAnywhereSubscriptionRequest,
  output: DeleteEksAnywhereSubscriptionResponse,
  errors: [
    ClientException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Describes an update to an Amazon EKS resource.
 *
 * When the status of the update is `Successful`, the update is complete. If
 * an update fails, the status is `Failed`, and an error detail explains the
 * reason for the failure.
 */
export const describeUpdate: (
  input: DescribeUpdateRequest,
) => Effect.Effect<
  DescribeUpdateResponse,
  | ClientException
  | InvalidParameterException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeUpdateRequest,
  output: DescribeUpdateResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Returns a list of all insights checked for against the specified cluster. You can
 * filter which insights are returned by category, associated Kubernetes version, and
 * status. The default filter lists all categories and every status.
 *
 * The following lists the available categories:
 *
 * - `UPGRADE_READINESS`: Amazon EKS identifies issues that could impact your
 * ability to upgrade to new versions of Kubernetes. These are called upgrade insights.
 *
 * - `MISCONFIGURATION`: Amazon EKS identifies misconfiguration in your EKS
 * Hybrid Nodes setup that could impair functionality of your cluster or
 * workloads. These are called configuration insights.
 */
export const listInsights: {
  (
    input: ListInsightsRequest,
  ): Effect.Effect<
    ListInsightsResponse,
    | InvalidParameterException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInsightsRequest,
  ) => Stream.Stream<
    ListInsightsResponse,
    | InvalidParameterException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInsightsRequest,
  ) => Stream.Stream<
    InsightSummary,
    | InvalidParameterException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInsightsRequest,
  output: ListInsightsResponse,
  errors: [
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServerException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "insights",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Deletes a EKS Pod Identity association.
 *
 * The temporary Amazon Web Services credentials from the previous IAM role session might still be valid until the session expiry. If you need to immediately revoke the temporary session credentials, then go to the role in the IAM console.
 */
export const deletePodIdentityAssociation: (
  input: DeletePodIdentityAssociationRequest,
) => Effect.Effect<
  DeletePodIdentityAssociationResponse,
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePodIdentityAssociationRequest,
  output: DeletePodIdentityAssociationResponse,
  errors: [
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Describes an Amazon EKS add-on.
 */
export const describeAddon: (
  input: DescribeAddonRequest,
) => Effect.Effect<
  DescribeAddonResponse,
  | ClientException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAddonRequest,
  output: DescribeAddonResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Returns configuration options.
 */
export const describeAddonConfiguration: (
  input: DescribeAddonConfigurationRequest,
) => Effect.Effect<
  DescribeAddonConfigurationResponse,
  | InvalidParameterException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAddonConfigurationRequest,
  output: DescribeAddonConfigurationResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Lists available Kubernetes versions for Amazon EKS clusters.
 */
export const describeClusterVersions: {
  (
    input: DescribeClusterVersionsRequest,
  ): Effect.Effect<
    DescribeClusterVersionsResponse,
    | InvalidParameterException
    | InvalidRequestException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeClusterVersionsRequest,
  ) => Stream.Stream<
    DescribeClusterVersionsResponse,
    | InvalidParameterException
    | InvalidRequestException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeClusterVersionsRequest,
  ) => Stream.Stream<
    ClusterVersionInformation,
    | InvalidParameterException
    | InvalidRequestException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeClusterVersionsRequest,
  output: DescribeClusterVersionsResponse,
  errors: [InvalidParameterException, InvalidRequestException, ServerException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "clusterVersions",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the available access policies.
 */
export const listAccessPolicies: {
  (
    input: ListAccessPoliciesRequest,
  ): Effect.Effect<
    ListAccessPoliciesResponse,
    ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccessPoliciesRequest,
  ) => Stream.Stream<
    ListAccessPoliciesResponse,
    ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAccessPoliciesRequest,
  ) => Stream.Stream<
    AccessPolicy,
    ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccessPoliciesRequest,
  output: ListAccessPoliciesResponse,
  errors: [ServerException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "accessPolicies",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the access policies associated with an access entry.
 */
export const listAssociatedAccessPolicies: {
  (
    input: ListAssociatedAccessPoliciesRequest,
  ): Effect.Effect<
    ListAssociatedAccessPoliciesResponse,
    | InvalidRequestException
    | ResourceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssociatedAccessPoliciesRequest,
  ) => Stream.Stream<
    ListAssociatedAccessPoliciesResponse,
    | InvalidRequestException
    | ResourceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAssociatedAccessPoliciesRequest,
  ) => Stream.Stream<
    AssociatedAccessPolicy,
    | InvalidRequestException
    | ResourceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssociatedAccessPoliciesRequest,
  output: ListAssociatedAccessPoliciesResponse,
  errors: [InvalidRequestException, ResourceNotFoundException, ServerException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "associatedAccessPolicies",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all managed capabilities in your Amazon EKS cluster. You can use this operation to get an overview of all capabilities and their current status.
 */
export const listCapabilities: {
  (
    input: ListCapabilitiesRequest,
  ): Effect.Effect<
    ListCapabilitiesResponse,
    InvalidParameterException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCapabilitiesRequest,
  ) => Stream.Stream<
    ListCapabilitiesResponse,
    InvalidParameterException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCapabilitiesRequest,
  ) => Stream.Stream<
    CapabilitySummary,
    InvalidParameterException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCapabilitiesRequest,
  output: ListCapabilitiesResponse,
  errors: [InvalidParameterException, ServerException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "capabilities",
    pageSize: "maxResults",
  } as const,
}));
/**
 * List the EKS Pod Identity associations in a cluster. You can filter the list by the namespace that the
 * association is in or the service account that the association uses.
 */
export const listPodIdentityAssociations: {
  (
    input: ListPodIdentityAssociationsRequest,
  ): Effect.Effect<
    ListPodIdentityAssociationsResponse,
    | InvalidParameterException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPodIdentityAssociationsRequest,
  ) => Stream.Stream<
    ListPodIdentityAssociationsResponse,
    | InvalidParameterException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPodIdentityAssociationsRequest,
  ) => Stream.Stream<
    PodIdentityAssociationSummary,
    | InvalidParameterException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPodIdentityAssociationsRequest,
  output: ListPodIdentityAssociationsResponse,
  errors: [
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServerException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "associations",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Describes an access entry.
 */
export const describeAccessEntry: (
  input: DescribeAccessEntryRequest,
) => Effect.Effect<
  DescribeAccessEntryResponse,
  | InvalidRequestException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAccessEntryRequest,
  output: DescribeAccessEntryResponse,
  errors: [InvalidRequestException, ResourceNotFoundException, ServerException],
}));
/**
 * Disassociates an access policy from an access entry.
 */
export const disassociateAccessPolicy: (
  input: DisassociateAccessPolicyRequest,
) => Effect.Effect<
  DisassociateAccessPolicyResponse,
  | InvalidRequestException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateAccessPolicyRequest,
  output: DisassociateAccessPolicyResponse,
  errors: [InvalidRequestException, ResourceNotFoundException, ServerException],
}));
/**
 * Returns the status of the latest on-demand cluster insights refresh operation.
 */
export const describeInsightsRefresh: (
  input: DescribeInsightsRefreshRequest,
) => Effect.Effect<
  DescribeInsightsRefreshResponse,
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeInsightsRefreshRequest,
  output: DescribeInsightsRefreshResponse,
  errors: [
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Returns descriptive information about an EKS Pod Identity association.
 *
 * This action requires the ID of the association. You can get the ID from the response to
 * the `CreatePodIdentityAssocation` for newly created associations. Or, you can
 * list the IDs for associations with `ListPodIdentityAssociations` and filter the
 * list by namespace or service account.
 */
export const describePodIdentityAssociation: (
  input: DescribePodIdentityAssociationRequest,
) => Effect.Effect<
  DescribePodIdentityAssociationResponse,
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePodIdentityAssociationRequest,
  output: DescribePodIdentityAssociationResponse,
  errors: [
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Lists the access entries for your cluster.
 */
export const listAccessEntries: {
  (
    input: ListAccessEntriesRequest,
  ): Effect.Effect<
    ListAccessEntriesResponse,
    | InvalidParameterException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccessEntriesRequest,
  ) => Stream.Stream<
    ListAccessEntriesResponse,
    | InvalidParameterException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAccessEntriesRequest,
  ) => Stream.Stream<
    String,
    | InvalidParameterException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccessEntriesRequest,
  output: ListAccessEntriesResponse,
  errors: [
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServerException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "accessEntries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Initiates an on-demand refresh operation for cluster insights, getting the latest analysis outside of the standard refresh schedule.
 */
export const startInsightsRefresh: (
  input: StartInsightsRefreshRequest,
) => Effect.Effect<
  StartInsightsRefreshResponse,
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartInsightsRefreshRequest,
  output: StartInsightsRefreshResponse,
  errors: [
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Updates an access entry.
 */
export const updateAccessEntry: (
  input: UpdateAccessEntryRequest,
) => Effect.Effect<
  UpdateAccessEntryResponse,
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccessEntryRequest,
  output: UpdateAccessEntryResponse,
  errors: [
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Updates a EKS Pod Identity association. In an update, you can change the IAM role, the target IAM role, or `disableSessionTags`.
 * You must change at least one of these in an update. An association can't be moved
 * between clusters, namespaces, or service accounts. If you need to edit the namespace
 * or service account, you need to delete the association and then create a new
 * association with your desired settings.
 *
 * Similar to Amazon Web Services IAM behavior, EKS Pod Identity associations are eventually consistent,
 * and may take several seconds to be effective after the initial API call returns
 * successfully. You must design your applications to account for these potential delays.
 * We recommend that you don’t include association create/updates in the
 * critical, high-availability code paths of your application. Instead, make changes in a
 * separate initialization or setup routine that you run less frequently.
 *
 * You can set a *target IAM role* in the same or a different
 * account for advanced scenarios. With a target role, EKS Pod Identity automatically performs two
 * role assumptions in sequence: first assuming the role in the association that is in this
 * account, then using those credentials to assume the target IAM role. This process
 * provides your Pod with temporary credentials that have the permissions defined in the
 * target role, allowing secure access to resources in another Amazon Web Services account.
 */
export const updatePodIdentityAssociation: (
  input: UpdatePodIdentityAssociationRequest,
) => Effect.Effect<
  UpdatePodIdentityAssociationResponse,
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePodIdentityAssociationRequest,
  output: UpdatePodIdentityAssociationResponse,
  errors: [
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Associates an access policy and its scope to an access entry. For more information
 * about associating access policies, see Associating and disassociating
 * access policies to and from access entries in the *Amazon EKS User Guide*.
 */
export const associateAccessPolicy: (
  input: AssociateAccessPolicyRequest,
) => Effect.Effect<
  AssociateAccessPolicyResponse,
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateAccessPolicyRequest,
  output: AssociateAccessPolicyResponse,
  errors: [
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Returns detailed information about a specific managed capability in your Amazon EKS cluster, including its current status, configuration, health information, and any issues that may be affecting its operation.
 */
export const describeCapability: (
  input: DescribeCapabilityRequest,
) => Effect.Effect<
  DescribeCapabilityResponse,
  | AccessDeniedException
  | InvalidParameterException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCapabilityRequest,
  output: DescribeCapabilityResponse,
  errors: [
    AccessDeniedException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Describes an Fargate profile.
 */
export const describeFargateProfile: (
  input: DescribeFargateProfileRequest,
) => Effect.Effect<
  DescribeFargateProfileResponse,
  | ClientException
  | InvalidParameterException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFargateProfileRequest,
  output: DescribeFargateProfileResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Lists the installed add-ons.
 */
export const listAddons: {
  (
    input: ListAddonsRequest,
  ): Effect.Effect<
    ListAddonsResponse,
    | ClientException
    | InvalidParameterException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAddonsRequest,
  ) => Stream.Stream<
    ListAddonsResponse,
    | ClientException
    | InvalidParameterException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAddonsRequest,
  ) => Stream.Stream<
    String,
    | ClientException
    | InvalidParameterException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAddonsRequest,
  output: ListAddonsResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServerException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "addons",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the Fargate profiles associated with the specified cluster in your Amazon Web Services
 * account in the specified Amazon Web Services Region.
 */
export const listFargateProfiles: {
  (
    input: ListFargateProfilesRequest,
  ): Effect.Effect<
    ListFargateProfilesResponse,
    | ClientException
    | InvalidParameterException
    | ResourceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFargateProfilesRequest,
  ) => Stream.Stream<
    ListFargateProfilesResponse,
    | ClientException
    | InvalidParameterException
    | ResourceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFargateProfilesRequest,
  ) => Stream.Stream<
    String,
    | ClientException
    | InvalidParameterException
    | ResourceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFargateProfilesRequest,
  output: ListFargateProfilesResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "fargateProfileNames",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the updates associated with an Amazon EKS resource in your Amazon Web Services account, in the
 * specified Amazon Web Services Region.
 */
export const listUpdates: {
  (
    input: ListUpdatesRequest,
  ): Effect.Effect<
    ListUpdatesResponse,
    | ClientException
    | InvalidParameterException
    | ResourceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListUpdatesRequest,
  ) => Stream.Stream<
    ListUpdatesResponse,
    | ClientException
    | InvalidParameterException
    | ResourceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListUpdatesRequest,
  ) => Stream.Stream<
    String,
    | ClientException
    | InvalidParameterException
    | ResourceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListUpdatesRequest,
  output: ListUpdatesResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "updateIds",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Update an EKS Anywhere Subscription. Only auto renewal and tags can be updated after
 * subscription creation.
 */
export const updateEksAnywhereSubscription: (
  input: UpdateEksAnywhereSubscriptionRequest,
) => Effect.Effect<
  UpdateEksAnywhereSubscriptionResponse,
  | ClientException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEksAnywhereSubscriptionRequest,
  output: UpdateEksAnywhereSubscriptionResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Updates an Amazon EKS managed node group configuration. Your node group continues to
 * function during the update. The response output includes an update ID that you can use
 * to track the status of your node group update with the
 * `DescribeUpdate`
 * API operation. You can update the Kubernetes labels
 * and taints for a node group and the scaling and version update configuration.
 */
export const updateNodegroupConfig: (
  input: UpdateNodegroupConfigRequest,
) => Effect.Effect<
  UpdateNodegroupConfigResponse,
  | ClientException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateNodegroupConfigRequest,
  output: UpdateNodegroupConfigResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Creates an access entry.
 *
 * An access entry allows an IAM principal to access your cluster. Access
 * entries can replace the need to maintain entries in the `aws-auth`
 * `ConfigMap` for authentication. You have the following options for
 * authorizing an IAM principal to access Kubernetes objects on your cluster: Kubernetes
 * role-based access control (RBAC), Amazon EKS, or both. Kubernetes RBAC authorization requires you
 * to create and manage Kubernetes `Role`, `ClusterRole`,
 * `RoleBinding`, and `ClusterRoleBinding` objects, in addition
 * to managing access entries. If you use Amazon EKS authorization exclusively, you don't need
 * to create and manage Kubernetes `Role`, `ClusterRole`,
 * `RoleBinding`, and `ClusterRoleBinding` objects.
 *
 * For more information about access entries, see Access entries in the
 * *Amazon EKS User Guide*.
 */
export const createAccessEntry: (
  input: CreateAccessEntryRequest,
) => Effect.Effect<
  CreateAccessEntryResponse,
  | InvalidParameterException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceLimitExceededException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccessEntryRequest,
  output: CreateAccessEntryResponse,
  errors: [
    InvalidParameterException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceLimitExceededException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Creates an EKS Pod Identity association between a service account in an Amazon EKS cluster and an IAM role
 * with *EKS Pod Identity*. Use EKS Pod Identity to give temporary IAM credentials to
 * Pods and the credentials are rotated automatically.
 *
 * Amazon EKS Pod Identity associations provide the ability to manage credentials for your applications, similar to the way that Amazon EC2 instance profiles provide credentials to Amazon EC2 instances.
 *
 * If a Pod uses a service account that has an association, Amazon EKS sets environment variables
 * in the containers of the Pod. The environment variables configure the Amazon Web Services SDKs,
 * including the Command Line Interface, to use the EKS Pod Identity credentials.
 *
 * EKS Pod Identity is a simpler method than IAM roles for service
 * accounts, as this method doesn't use OIDC identity providers.
 * Additionally, you can configure a role for EKS Pod Identity once, and reuse it across
 * clusters.
 *
 * Similar to Amazon Web Services IAM behavior, EKS Pod Identity associations are eventually consistent,
 * and may take several seconds to be effective after the initial API call returns
 * successfully. You must design your applications to account for these potential delays.
 * We recommend that you don’t include association create/updates in the
 * critical, high-availability code paths of your application. Instead, make changes in a
 * separate initialization or setup routine that you run less frequently.
 *
 * You can set a *target IAM role* in the same or a different
 * account for advanced scenarios. With a target role, EKS Pod Identity automatically performs two
 * role assumptions in sequence: first assuming the role in the association that is in this
 * account, then using those credentials to assume the target IAM role. This process
 * provides your Pod with temporary credentials that have the permissions defined in the
 * target role, allowing secure access to resources in another Amazon Web Services account.
 */
export const createPodIdentityAssociation: (
  input: CreatePodIdentityAssociationRequest,
) => Effect.Effect<
  CreatePodIdentityAssociationResponse,
  | InvalidParameterException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceLimitExceededException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePodIdentityAssociationRequest,
  output: CreatePodIdentityAssociationResponse,
  errors: [
    InvalidParameterException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceLimitExceededException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Updates an Amazon EKS add-on.
 */
export const updateAddon: (
  input: UpdateAddonRequest,
) => Effect.Effect<
  UpdateAddonResponse,
  | ClientException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAddonRequest,
  output: UpdateAddonResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Updates the Kubernetes version or AMI version of an Amazon EKS managed node group.
 *
 * You can update a node group using a launch template only if the node group was
 * originally deployed with a launch template. Additionally, the launch template ID or name
 * must match what was used when the node group was created. You can update the launch
 * template version with necessary changes.
 *
 * If you need to update a custom AMI in a node group that was deployed with a launch
 * template, then update your custom AMI, specify the new ID in a new version of the launch
 * template, and then update the node group to the new version of the launch
 * template.
 *
 * If you update without a launch template, then you can update to the latest available
 * AMI version of a node group's current Kubernetes version by not specifying a Kubernetes version in
 * the request. You can update to the latest AMI version of your cluster's current Kubernetes
 * version by specifying your cluster's Kubernetes version in the request. For information about
 * Linux versions, see Amazon EKS optimized Amazon Linux AMI versions in the
 * *Amazon EKS User Guide*. For information about Windows versions, see Amazon EKS
 * optimized Windows AMI versions in the *Amazon EKS User Guide*.
 *
 * You cannot roll back a node group to an earlier Kubernetes version or AMI version.
 *
 * When a node in a managed node group is terminated due to a scaling action or update,
 * every `Pod` on that node is drained first. Amazon EKS attempts to drain the nodes
 * gracefully and will fail if it is unable to do so. You can `force` the update
 * if Amazon EKS is unable to drain the nodes as a result of a `Pod` disruption
 * budget issue.
 */
export const updateNodegroupVersion: (
  input: UpdateNodegroupVersionRequest,
) => Effect.Effect<
  UpdateNodegroupVersionResponse,
  | ClientException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateNodegroupVersionRequest,
  output: UpdateNodegroupVersionResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Creates an Amazon EKS add-on.
 *
 * Amazon EKS add-ons help to automate the provisioning and lifecycle management of common
 * operational software for Amazon EKS clusters. For more information, see Amazon EKS
 * add-ons in the *Amazon EKS User Guide*.
 */
export const createAddon: (
  input: CreateAddonRequest,
) => Effect.Effect<
  CreateAddonResponse,
  | ClientException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAddonRequest,
  output: CreateAddonResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Deletes an Amazon EKS add-on.
 *
 * When you remove an add-on, it's deleted from the cluster. You can always manually
 * start an add-on on the cluster using the Kubernetes API.
 */
export const deleteAddon: (
  input: DeleteAddonRequest,
) => Effect.Effect<
  DeleteAddonResponse,
  | ClientException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAddonRequest,
  output: DeleteAddonResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Deletes an Fargate profile.
 *
 * When you delete a Fargate profile, any `Pod` running on Fargate that
 * was created with the profile is deleted. If the `Pod` matches another
 * Fargate profile, then it is scheduled on Fargate with that profile. If it no longer
 * matches any Fargate profiles, then it's not scheduled on Fargate and may remain in a
 * pending state.
 *
 * Only one Fargate profile in a cluster can be in the `DELETING` status at
 * a time. You must wait for a Fargate profile to finish deleting before you can delete
 * any other profiles in that cluster.
 */
export const deleteFargateProfile: (
  input: DeleteFargateProfileRequest,
) => Effect.Effect<
  DeleteFargateProfileResponse,
  | ClientException
  | InvalidParameterException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFargateProfileRequest,
  output: DeleteFargateProfileResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Describes the versions for an add-on.
 *
 * Information such as the Kubernetes versions that you can use the add-on with, the
 * `owner`, `publisher`, and the `type` of the add-on
 * are returned.
 */
export const describeAddonVersions: {
  (
    input: DescribeAddonVersionsRequest,
  ): Effect.Effect<
    DescribeAddonVersionsResponse,
    | InvalidParameterException
    | ResourceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeAddonVersionsRequest,
  ) => Stream.Stream<
    DescribeAddonVersionsResponse,
    | InvalidParameterException
    | ResourceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeAddonVersionsRequest,
  ) => Stream.Stream<
    AddonInfo,
    | InvalidParameterException
    | ResourceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeAddonVersionsRequest,
  output: DescribeAddonVersionsResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "addons",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates the configuration of a managed capability in your Amazon EKS cluster. You can update the IAM role, configuration settings, and delete propagation policy for a capability.
 *
 * When you update a capability, Amazon EKS applies the changes and may restart capability components as needed. The capability remains available during the update process, but some operations may be temporarily unavailable.
 */
export const updateCapability: (
  input: UpdateCapabilityRequest,
) => Effect.Effect<
  UpdateCapabilityResponse,
  | AccessDeniedException
  | InvalidParameterException
  | ResourceInUseException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCapabilityRequest,
  output: UpdateCapabilityResponse,
  errors: [
    AccessDeniedException,
    InvalidParameterException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Describes an Amazon EKS cluster.
 *
 * The API server endpoint and certificate authority data returned by this operation are
 * required for `kubelet` and `kubectl` to communicate with your
 * Kubernetes API server. For more information, see Creating or
 * updating a `kubeconfig` file for an Amazon EKS cluster.
 *
 * The API server endpoint and certificate authority data aren't available until the
 * cluster reaches the `ACTIVE` state.
 */
export const describeCluster: (
  input: DescribeClusterRequest,
) => Effect.Effect<
  DescribeClusterResponse,
  | ClientException
  | ResourceNotFoundException
  | ServerException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeClusterRequest,
  output: DescribeClusterResponse,
  errors: [
    ClientException,
    ResourceNotFoundException,
    ServerException,
    ServiceUnavailableException,
  ],
}));
/**
 * Updates an Amazon EKS cluster to the specified Kubernetes version. Your cluster continues to
 * function during the update. The response output includes an update ID that you can use
 * to track the status of your cluster update with the
 * `DescribeUpdate`
 * API operation.
 *
 * Cluster updates are asynchronous, and they should finish within a few minutes. During
 * an update, the cluster status moves to `UPDATING` (this status transition is
 * eventually consistent). When the update is complete (either `Failed` or
 * `Successful`), the cluster status moves to `Active`.
 *
 * If your cluster has managed node groups attached to it, all of your node groups' Kubernetes
 * versions must match the cluster's Kubernetes version in order to update the cluster to a new
 * Kubernetes version.
 */
export const updateClusterVersion: (
  input: UpdateClusterVersionRequest,
) => Effect.Effect<
  UpdateClusterVersionResponse,
  | ClientException
  | InvalidParameterException
  | InvalidRequestException
  | InvalidStateException
  | ResourceInUseException
  | ResourceNotFoundException
  | ServerException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateClusterVersionRequest,
  output: UpdateClusterVersionResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    InvalidRequestException,
    InvalidStateException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServerException,
    ThrottlingException,
  ],
}));
/**
 * Returns descriptive information about a subscription.
 */
export const describeEksAnywhereSubscription: (
  input: DescribeEksAnywhereSubscriptionRequest,
) => Effect.Effect<
  DescribeEksAnywhereSubscriptionResponse,
  | ClientException
  | ResourceNotFoundException
  | ServerException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEksAnywhereSubscriptionRequest,
  output: DescribeEksAnywhereSubscriptionResponse,
  errors: [
    ClientException,
    ResourceNotFoundException,
    ServerException,
    ServiceUnavailableException,
  ],
}));
/**
 * Describes a managed node group.
 */
export const describeNodegroup: (
  input: DescribeNodegroupRequest,
) => Effect.Effect<
  DescribeNodegroupResponse,
  | ClientException
  | InvalidParameterException
  | ResourceNotFoundException
  | ServerException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeNodegroupRequest,
  output: DescribeNodegroupResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
    ServiceUnavailableException,
  ],
}));
/**
 * Lists the Amazon EKS clusters in your Amazon Web Services account in the specified Amazon Web Services Region.
 */
export const listClusters: {
  (
    input: ListClustersRequest,
  ): Effect.Effect<
    ListClustersResponse,
    | ClientException
    | InvalidParameterException
    | ServerException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListClustersRequest,
  ) => Stream.Stream<
    ListClustersResponse,
    | ClientException
    | InvalidParameterException
    | ServerException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListClustersRequest,
  ) => Stream.Stream<
    String,
    | ClientException
    | InvalidParameterException
    | ServerException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListClustersRequest,
  output: ListClustersResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    ServerException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "clusters",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Displays the full description of the subscription.
 */
export const listEksAnywhereSubscriptions: {
  (
    input: ListEksAnywhereSubscriptionsRequest,
  ): Effect.Effect<
    ListEksAnywhereSubscriptionsResponse,
    | ClientException
    | InvalidParameterException
    | ServerException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEksAnywhereSubscriptionsRequest,
  ) => Stream.Stream<
    ListEksAnywhereSubscriptionsResponse,
    | ClientException
    | InvalidParameterException
    | ServerException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEksAnywhereSubscriptionsRequest,
  ) => Stream.Stream<
    EksAnywhereSubscription,
    | ClientException
    | InvalidParameterException
    | ServerException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEksAnywhereSubscriptionsRequest,
  output: ListEksAnywhereSubscriptionsResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    ServerException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "subscriptions",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the identity provider configurations for your cluster.
 */
export const listIdentityProviderConfigs: {
  (
    input: ListIdentityProviderConfigsRequest,
  ): Effect.Effect<
    ListIdentityProviderConfigsResponse,
    | ClientException
    | InvalidParameterException
    | ResourceNotFoundException
    | ServerException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIdentityProviderConfigsRequest,
  ) => Stream.Stream<
    ListIdentityProviderConfigsResponse,
    | ClientException
    | InvalidParameterException
    | ResourceNotFoundException
    | ServerException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIdentityProviderConfigsRequest,
  ) => Stream.Stream<
    IdentityProviderConfig,
    | ClientException
    | InvalidParameterException
    | ResourceNotFoundException
    | ServerException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIdentityProviderConfigsRequest,
  output: ListIdentityProviderConfigsResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "identityProviderConfigs",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the managed node groups associated with the specified cluster in your Amazon Web Services
 * account in the specified Amazon Web Services Region. Self-managed node groups aren't listed.
 */
export const listNodegroups: {
  (
    input: ListNodegroupsRequest,
  ): Effect.Effect<
    ListNodegroupsResponse,
    | ClientException
    | InvalidParameterException
    | ResourceNotFoundException
    | ServerException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListNodegroupsRequest,
  ) => Stream.Stream<
    ListNodegroupsResponse,
    | ClientException
    | InvalidParameterException
    | ResourceNotFoundException
    | ServerException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListNodegroupsRequest,
  ) => Stream.Stream<
    String,
    | ClientException
    | InvalidParameterException
    | ResourceNotFoundException
    | ServerException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListNodegroupsRequest,
  output: ListNodegroupsResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "nodegroups",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates an EKS Anywhere subscription. When a subscription is created, it is a contract
 * agreement for the length of the term specified in the request. Licenses that are used to
 * validate support are provisioned in Amazon Web Services License Manager and the caller account is
 * granted access to EKS Anywhere Curated Packages.
 */
export const createEksAnywhereSubscription: (
  input: CreateEksAnywhereSubscriptionRequest,
) => Effect.Effect<
  CreateEksAnywhereSubscriptionResponse,
  | ClientException
  | InvalidParameterException
  | ResourceLimitExceededException
  | ServerException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEksAnywhereSubscriptionRequest,
  output: CreateEksAnywhereSubscriptionResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    ResourceLimitExceededException,
    ServerException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deregisters a connected cluster to remove it from the Amazon EKS control plane.
 *
 * A connected cluster is a Kubernetes cluster that you've connected to your control plane
 * using the Amazon EKS Connector.
 */
export const deregisterCluster: (
  input: DeregisterClusterRequest,
) => Effect.Effect<
  DeregisterClusterResponse,
  | AccessDeniedException
  | ClientException
  | ResourceInUseException
  | ResourceNotFoundException
  | ServerException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterClusterRequest,
  output: DeregisterClusterResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServerException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates a managed node group for an Amazon EKS cluster.
 *
 * You can only create a node group for your cluster that is equal to the current Kubernetes
 * version for the cluster. All node groups are created with the latest AMI release version
 * for the respective minor Kubernetes version of the cluster, unless you deploy a custom AMI
 * using a launch template.
 *
 * For later updates, you will only be able to update a node group using a launch
 * template only if it was originally deployed with a launch template. Additionally, the
 * launch template ID or name must match what was used when the node group was created. You
 * can update the launch template version with necessary changes. For more information
 * about using launch templates, see Customizing managed nodes with
 * launch templates.
 *
 * An Amazon EKS managed node group is an Amazon EC2 Amazon EC2 Auto Scaling group and associated Amazon EC2 instances that
 * are managed by Amazon Web Services for an Amazon EKS cluster. For more information, see Managed
 * node groups in the *Amazon EKS User Guide*.
 *
 * Windows AMI types are only supported for commercial Amazon Web Services Regions that support
 * Windows on Amazon EKS.
 */
export const createNodegroup: (
  input: CreateNodegroupRequest,
) => Effect.Effect<
  CreateNodegroupResponse,
  | ClientException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceLimitExceededException
  | ServerException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateNodegroupRequest,
  output: CreateNodegroupResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceLimitExceededException,
    ServerException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes an Amazon EKS cluster control plane.
 *
 * If you have active services in your cluster that are associated with a load balancer,
 * you must delete those services before deleting the cluster so that the load balancers
 * are deleted properly. Otherwise, you can have orphaned resources in your VPC that
 * prevent you from being able to delete the VPC. For more information, see Deleting a
 * cluster in the *Amazon EKS User Guide*.
 *
 * If you have managed node groups or Fargate profiles attached to the cluster, you
 * must delete them first. For more information, see `DeleteNodgroup` and
 * `DeleteFargateProfile`.
 */
export const deleteCluster: (
  input: DeleteClusterRequest,
) => Effect.Effect<
  DeleteClusterResponse,
  | ClientException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | ServerException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterRequest,
  output: DeleteClusterResponse,
  errors: [
    ClientException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServerException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes a managed node group.
 */
export const deleteNodegroup: (
  input: DeleteNodegroupRequest,
) => Effect.Effect<
  DeleteNodegroupResponse,
  | ClientException
  | InvalidParameterException
  | ResourceInUseException
  | ResourceNotFoundException
  | ServerException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNodegroupRequest,
  output: DeleteNodegroupResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServerException,
    ServiceUnavailableException,
  ],
}));
/**
 * Describes an identity provider configuration.
 */
export const describeIdentityProviderConfig: (
  input: DescribeIdentityProviderConfigRequest,
) => Effect.Effect<
  DescribeIdentityProviderConfigResponse,
  | ClientException
  | InvalidParameterException
  | ResourceNotFoundException
  | ServerException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeIdentityProviderConfigRequest,
  output: DescribeIdentityProviderConfigResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
    ServiceUnavailableException,
  ],
}));
/**
 * Updates an Amazon EKS cluster configuration. Your cluster continues to function during the
 * update. The response output includes an update ID that you can use to track the status
 * of your cluster update with `DescribeUpdate`.
 *
 * You can use this operation to do the following actions:
 *
 * - You can use this API operation to enable or disable exporting the Kubernetes
 * control plane logs for your cluster to CloudWatch Logs. By default, cluster control plane
 * logs aren't exported to CloudWatch Logs. For more information, see Amazon EKS Cluster control plane logs in the
 *
 * *Amazon EKS User Guide*
 * .
 *
 * CloudWatch Logs ingestion, archive storage, and data scanning rates apply to
 * exported control plane logs. For more information, see CloudWatch Pricing.
 *
 * - You can also use this API operation to enable or disable public and private
 * access to your cluster's Kubernetes API server endpoint. By default, public access is
 * enabled, and private access is disabled. For more information, see
 * Cluster API server endpoint in the
 *
 * *Amazon EKS User Guide*
 * .
 *
 * - You can also use this API operation to choose different subnets and security
 * groups for the cluster. You must specify at least two subnets that are in
 * different Availability Zones. You can't change which VPC the subnets are from, the subnets
 * must be in the same VPC as the subnets that the cluster was created with. For
 * more information about the VPC requirements, see https://docs.aws.amazon.com/eks/latest/userguide/network_reqs.html in the
 *
 * *Amazon EKS User Guide*
 * .
 *
 * - You can also use this API operation to enable or disable ARC zonal shift. If
 * zonal shift is enabled, Amazon Web Services configures zonal autoshift for the cluster.
 *
 * - You can also use this API operation to add, change, or remove the
 * configuration in the cluster for EKS Hybrid Nodes. To remove the configuration,
 * use the `remoteNetworkConfig` key with an object containing both
 * subkeys with empty arrays for each. Here is an inline example:
 * "remoteNetworkConfig": { "remoteNodeNetworks": [],
 * "remotePodNetworks": [] }.
 *
 * Cluster updates are asynchronous, and they should finish within a few minutes. During
 * an update, the cluster status moves to `UPDATING` (this status transition is
 * eventually consistent). When the update is complete (either `Failed` or
 * `Successful`), the cluster status moves to `Active`.
 */
export const updateClusterConfig: (
  input: UpdateClusterConfigRequest,
) => Effect.Effect<
  UpdateClusterConfigResponse,
  | ClientException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | ServerException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateClusterConfigRequest,
  output: UpdateClusterConfigResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServerException,
    ThrottlingException,
  ],
}));
/**
 * Disassociates an identity provider configuration from a cluster.
 *
 * If you disassociate an identity provider from your cluster, users included in the
 * provider can no longer access the cluster. However, you can still access the cluster
 * with IAM principals.
 */
export const disassociateIdentityProviderConfig: (
  input: DisassociateIdentityProviderConfigRequest,
) => Effect.Effect<
  DisassociateIdentityProviderConfigResponse,
  | ClientException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | ServerException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateIdentityProviderConfigRequest,
  output: DisassociateIdentityProviderConfigResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServerException,
    ThrottlingException,
  ],
}));
/**
 * Associates an encryption configuration to an existing cluster.
 *
 * Use this API to enable encryption on existing clusters that don't already have
 * encryption enabled. This allows you to implement a defense-in-depth security strategy
 * without migrating applications to new Amazon EKS clusters.
 */
export const associateEncryptionConfig: (
  input: AssociateEncryptionConfigRequest,
) => Effect.Effect<
  AssociateEncryptionConfigResponse,
  | ClientException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | ServerException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateEncryptionConfigRequest,
  output: AssociateEncryptionConfigResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServerException,
    ThrottlingException,
  ],
}));
/**
 * Associates an identity provider configuration to a cluster.
 *
 * If you want to authenticate identities using an identity provider, you can create an
 * identity provider configuration and associate it to your cluster. After configuring
 * authentication to your cluster you can create Kubernetes `Role` and
 * `ClusterRole` objects, assign permissions to them, and then bind them to
 * the identities using Kubernetes `RoleBinding` and `ClusterRoleBinding`
 * objects. For more information see Using RBAC
 * Authorization in the Kubernetes documentation.
 */
export const associateIdentityProviderConfig: (
  input: AssociateIdentityProviderConfigRequest,
) => Effect.Effect<
  AssociateIdentityProviderConfigResponse,
  | ClientException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | ServerException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateIdentityProviderConfigRequest,
  output: AssociateIdentityProviderConfigResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServerException,
    ThrottlingException,
  ],
}));
/**
 * Creates an Fargate profile for your Amazon EKS cluster. You must have at least one
 * Fargate profile in a cluster to be able to run pods on Fargate.
 *
 * The Fargate profile allows an administrator to declare which pods run on Fargate
 * and specify which pods run on which Fargate profile. This declaration is done through
 * the profile's selectors. Each profile can have up to five selectors that contain a
 * namespace and labels. A namespace is required for every selector. The label field
 * consists of multiple optional key-value pairs. Pods that match the selectors are
 * scheduled on Fargate. If a to-be-scheduled pod matches any of the selectors in the
 * Fargate profile, then that pod is run on Fargate.
 *
 * When you create a Fargate profile, you must specify a pod execution role to use with
 * the pods that are scheduled with the profile. This role is added to the cluster's Kubernetes
 * Role
 * Based Access Control (RBAC) for authorization so that the
 * `kubelet` that is running on the Fargate infrastructure can register
 * with your Amazon EKS cluster so that it can appear in your cluster as a node. The pod
 * execution role also provides IAM permissions to the Fargate infrastructure to allow
 * read access to Amazon ECR image repositories. For more information, see Pod
 * Execution Role in the *Amazon EKS User Guide*.
 *
 * Fargate profiles are immutable. However, you can create a new updated profile to
 * replace an existing profile and then delete the original after the updated profile has
 * finished creating.
 *
 * If any Fargate profiles in a cluster are in the `DELETING` status, you
 * must wait for that Fargate profile to finish deleting before you can create any other
 * profiles in that cluster.
 *
 * For more information, see Fargate profile in the *Amazon EKS User Guide*.
 */
export const createFargateProfile: (
  input: CreateFargateProfileRequest,
) => Effect.Effect<
  CreateFargateProfileResponse,
  | ClientException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceLimitExceededException
  | ServerException
  | UnsupportedAvailabilityZoneException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFargateProfileRequest,
  output: CreateFargateProfileResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceLimitExceededException,
    ServerException,
    UnsupportedAvailabilityZoneException,
  ],
}));
/**
 * Connects a Kubernetes cluster to the Amazon EKS control plane.
 *
 * Any Kubernetes cluster can be connected to the Amazon EKS control plane to view current
 * information about the cluster and its nodes.
 *
 * Cluster connection requires two steps. First, send a
 * `RegisterClusterRequest`
 * to add it to the Amazon EKS control
 * plane.
 *
 * Second, a Manifest containing the `activationID` and
 * `activationCode` must be applied to the Kubernetes cluster through it's native
 * provider to provide visibility.
 *
 * After the manifest is updated and applied, the connected cluster is visible to the
 * Amazon EKS control plane. If the manifest isn't applied within three days, the connected
 * cluster will no longer be visible and must be deregistered using
 * `DeregisterCluster`.
 */
export const registerCluster: (
  input: RegisterClusterRequest,
) => Effect.Effect<
  RegisterClusterResponse,
  | AccessDeniedException
  | ClientException
  | InvalidParameterException
  | ResourceInUseException
  | ResourceLimitExceededException
  | ResourcePropagationDelayException
  | ServerException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterClusterRequest,
  output: RegisterClusterResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    InvalidParameterException,
    ResourceInUseException,
    ResourceLimitExceededException,
    ResourcePropagationDelayException,
    ServerException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates an Amazon EKS control plane.
 *
 * The Amazon EKS control plane consists of control plane instances that run the Kubernetes
 * software, such as `etcd` and the API server. The control plane runs in an
 * account managed by Amazon Web Services, and the Kubernetes API is exposed by the Amazon EKS API server endpoint.
 * Each Amazon EKS cluster control plane is single tenant and unique. It runs on its own set of
 * Amazon EC2 instances.
 *
 * The cluster control plane is provisioned across multiple Availability Zones and fronted by an ELB
 * Network Load Balancer. Amazon EKS also provisions elastic network interfaces in your VPC subnets to provide
 * connectivity from the control plane instances to the nodes (for example, to support
 * `kubectl exec`, `logs`, and `proxy` data
 * flows).
 *
 * Amazon EKS nodes run in your Amazon Web Services account and connect to your cluster's control plane over
 * the Kubernetes API server endpoint and a certificate file that is created for your
 * cluster.
 *
 * You can use the `endpointPublicAccess` and
 * `endpointPrivateAccess` parameters to enable or disable public and
 * private access to your cluster's Kubernetes API server endpoint. By default, public access is
 * enabled, and private access is disabled. The
 * endpoint domain name and IP address family depends on the value of the
 * `ipFamily` for the cluster. For more information, see Amazon EKS Cluster
 * Endpoint Access Control in the
 * *Amazon EKS User Guide*
 * .
 *
 * You can use the `logging` parameter to enable or disable exporting the
 * Kubernetes control plane logs for your cluster to CloudWatch Logs. By default, cluster control plane
 * logs aren't exported to CloudWatch Logs. For more information, see Amazon EKS
 * Cluster Control Plane Logs in the
 *
 * *Amazon EKS User Guide*
 * .
 *
 * CloudWatch Logs ingestion, archive storage, and data scanning rates apply to exported
 * control plane logs. For more information, see CloudWatch Pricing.
 *
 * In most cases, it takes several minutes to create a cluster. After you create an Amazon EKS
 * cluster, you must configure your Kubernetes tooling to communicate with the API server and
 * launch nodes into your cluster. For more information, see Allowing users to
 * access your cluster and Launching Amazon EKS
 * nodes in the *Amazon EKS User Guide*.
 */
export const createCluster: (
  input: CreateClusterRequest,
) => Effect.Effect<
  CreateClusterResponse,
  | ClientException
  | InvalidParameterException
  | ResourceInUseException
  | ResourceLimitExceededException
  | ServerException
  | ServiceUnavailableException
  | UnsupportedAvailabilityZoneException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClusterRequest,
  output: CreateClusterResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    ResourceInUseException,
    ResourceLimitExceededException,
    ServerException,
    ServiceUnavailableException,
    UnsupportedAvailabilityZoneException,
  ],
}));
/**
 * Creates a managed capability resource for an Amazon EKS cluster.
 *
 * Capabilities provide fully managed capabilities to build and scale with Kubernetes. When you create a capability, Amazon EKSprovisions and manages the infrastructure required to run the capability outside of your cluster. This approach reduces operational overhead and preserves cluster resources.
 *
 * You can only create one Capability of each type on a given Amazon EKS cluster. Valid types are Argo CD for declarative GitOps deployment, Amazon Web Services Controllers for Kubernetes (ACK) for resource management, and Kube Resource Orchestrator (KRO) for Kubernetes custom resource orchestration.
 *
 * For more information, see EKS Capabilities in the *Amazon EKS User Guide*.
 */
export const createCapability: (
  input: CreateCapabilityRequest,
) => Effect.Effect<
  CreateCapabilityResponse,
  | AccessDeniedException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceLimitExceededException
  | ServerException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCapabilityRequest,
  output: CreateCapabilityResponse,
  errors: [
    AccessDeniedException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceLimitExceededException,
    ServerException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a managed capability from your Amazon EKS cluster. When you delete a capability, Amazon EKS removes the capability infrastructure but retains all resources that were managed by the capability.
 *
 * Before deleting a capability, you should delete all Kubernetes resources that were created by the capability. After the capability is deleted, these resources become difficult to manage because the controller that managed them is no longer available. To delete resources before removing the capability, use `kubectl delete` or remove them through your GitOps workflow.
 */
export const deleteCapability: (
  input: DeleteCapabilityRequest,
) => Effect.Effect<
  DeleteCapabilityResponse,
  | AccessDeniedException
  | InvalidParameterException
  | ResourceInUseException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCapabilityRequest,
  output: DeleteCapabilityResponse,
  errors: [
    AccessDeniedException,
    InvalidParameterException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Returns details about an insight that you specify using its ID.
 */
export const describeInsight: (
  input: DescribeInsightRequest,
) => Effect.Effect<
  DescribeInsightResponse,
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeInsightRequest,
  output: DescribeInsightResponse,
  errors: [
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
