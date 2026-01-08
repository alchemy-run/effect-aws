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
  sdkId: "FMS",
  serviceShapeName: "AWSFMS_20180101",
});
const auth = T.AwsAuthSigv4({ name: "fms" });
const ver = T.ServiceVersion("2018-01-01");
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
              `https://fms-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://fms-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://fms.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://fms.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type AWSAccountId = string;
export type Identifier = string;
export type ListId = string;
export type ErrorMessage = string;
export type PolicyId = string;
export type Base62Id = string;
export type ResourceArn = string;
export type PaginationToken = string;
export type PaginationMaxResults = number;
export type ResourceId = string;
export type ResourceType = string;
export type TagKey = string;
export type ResourceName = string;
export type UpdateToken = string;
export type TagValue = string;
export type PolicyUpdateToken = string;
export type ResourceDescription = string;
export type Protocol = string;
export type Name = string;
export type Description = string;
export type ProtectionData = string;
export type OrganizationalUnitId = string;
export type AWSRegion = string;
export type IPPortNumber = number;
export type PreviousListVersion = string;
export type ManagedServiceData = string;
export type ResourceTagKey = string;
export type ResourceTagValue = string;
export type CustomerPolicyScopeId = string;
export type LengthBoundedString = string;
export type FirewallPolicyId = string;
export type FirewallPolicyName = string;
export type DetailedInfo = string;
export type ResourceCount = number;
export type ViolationTarget = string;
export type TargetViolationReason = string;
export type DnsRuleGroupPriority = number;
export type BasicInteger = number;
export type ReferenceRule = string;
export type RemediationActionDescription = string;
export type NetworkFirewallAction = string;
export type CIDR = string;
export type LengthBoundedNonEmptyString = string;
export type NetworkFirewallResourceName = string;
export type StatelessRuleGroupPriority = number;
export type PriorityNumber = number;
export type IntegerObjectMinimum0 = number;
export type IntegerObject = number;
export type IPPortNumberInteger = number;

//# Schemas
export interface DeleteNotificationChannelRequest {}
export const DeleteNotificationChannelRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteNotificationChannelRequest",
}) as any as S.Schema<DeleteNotificationChannelRequest>;
export interface DeleteNotificationChannelResponse {}
export const DeleteNotificationChannelResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteNotificationChannelResponse",
}) as any as S.Schema<DeleteNotificationChannelResponse>;
export interface DisassociateAdminAccountRequest {}
export const DisassociateAdminAccountRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateAdminAccountRequest",
}) as any as S.Schema<DisassociateAdminAccountRequest>;
export interface DisassociateAdminAccountResponse {}
export const DisassociateAdminAccountResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateAdminAccountResponse",
}) as any as S.Schema<DisassociateAdminAccountResponse>;
export interface GetAdminAccountRequest {}
export const GetAdminAccountRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAdminAccountRequest",
}) as any as S.Schema<GetAdminAccountRequest>;
export interface GetNotificationChannelRequest {}
export const GetNotificationChannelRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetNotificationChannelRequest",
}) as any as S.Schema<GetNotificationChannelRequest>;
export type IdentifierList = string[];
export const IdentifierList = S.Array(S.String);
export type AWSAccountIdList = string[];
export const AWSAccountIdList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AssociateAdminAccountRequest {
  AdminAccount: string;
}
export const AssociateAdminAccountRequest = S.suspend(() =>
  S.Struct({ AdminAccount: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateAdminAccountRequest",
}) as any as S.Schema<AssociateAdminAccountRequest>;
export interface AssociateAdminAccountResponse {}
export const AssociateAdminAccountResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateAdminAccountResponse",
}) as any as S.Schema<AssociateAdminAccountResponse>;
export interface AssociateThirdPartyFirewallRequest {
  ThirdPartyFirewall: string;
}
export const AssociateThirdPartyFirewallRequest = S.suspend(() =>
  S.Struct({ ThirdPartyFirewall: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateThirdPartyFirewallRequest",
}) as any as S.Schema<AssociateThirdPartyFirewallRequest>;
export interface BatchAssociateResourceRequest {
  ResourceSetIdentifier: string;
  Items: IdentifierList;
}
export const BatchAssociateResourceRequest = S.suspend(() =>
  S.Struct({ ResourceSetIdentifier: S.String, Items: IdentifierList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchAssociateResourceRequest",
}) as any as S.Schema<BatchAssociateResourceRequest>;
export interface BatchDisassociateResourceRequest {
  ResourceSetIdentifier: string;
  Items: IdentifierList;
}
export const BatchDisassociateResourceRequest = S.suspend(() =>
  S.Struct({ ResourceSetIdentifier: S.String, Items: IdentifierList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchDisassociateResourceRequest",
}) as any as S.Schema<BatchDisassociateResourceRequest>;
export interface DeleteAppsListRequest {
  ListId: string;
}
export const DeleteAppsListRequest = S.suspend(() =>
  S.Struct({ ListId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteAppsListRequest",
}) as any as S.Schema<DeleteAppsListRequest>;
export interface DeleteAppsListResponse {}
export const DeleteAppsListResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteAppsListResponse" },
) as any as S.Schema<DeleteAppsListResponse>;
export interface DeletePolicyRequest {
  PolicyId: string;
  DeleteAllPolicyResources?: boolean;
}
export const DeletePolicyRequest = S.suspend(() =>
  S.Struct({
    PolicyId: S.String,
    DeleteAllPolicyResources: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeletePolicyRequest",
}) as any as S.Schema<DeletePolicyRequest>;
export interface DeletePolicyResponse {}
export const DeletePolicyResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeletePolicyResponse",
}) as any as S.Schema<DeletePolicyResponse>;
export interface DeleteProtocolsListRequest {
  ListId: string;
}
export const DeleteProtocolsListRequest = S.suspend(() =>
  S.Struct({ ListId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteProtocolsListRequest",
}) as any as S.Schema<DeleteProtocolsListRequest>;
export interface DeleteProtocolsListResponse {}
export const DeleteProtocolsListResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteProtocolsListResponse",
}) as any as S.Schema<DeleteProtocolsListResponse>;
export interface DeleteResourceSetRequest {
  Identifier: string;
}
export const DeleteResourceSetRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteResourceSetRequest",
}) as any as S.Schema<DeleteResourceSetRequest>;
export interface DeleteResourceSetResponse {}
export const DeleteResourceSetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteResourceSetResponse",
}) as any as S.Schema<DeleteResourceSetResponse>;
export interface DisassociateThirdPartyFirewallRequest {
  ThirdPartyFirewall: string;
}
export const DisassociateThirdPartyFirewallRequest = S.suspend(() =>
  S.Struct({ ThirdPartyFirewall: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateThirdPartyFirewallRequest",
}) as any as S.Schema<DisassociateThirdPartyFirewallRequest>;
export interface GetAdminAccountResponse {
  AdminAccount?: string;
  RoleStatus?: string;
}
export const GetAdminAccountResponse = S.suspend(() =>
  S.Struct({
    AdminAccount: S.optional(S.String),
    RoleStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "GetAdminAccountResponse",
}) as any as S.Schema<GetAdminAccountResponse>;
export interface GetAdminScopeRequest {
  AdminAccount: string;
}
export const GetAdminScopeRequest = S.suspend(() =>
  S.Struct({ AdminAccount: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAdminScopeRequest",
}) as any as S.Schema<GetAdminScopeRequest>;
export interface GetAppsListRequest {
  ListId: string;
  DefaultList?: boolean;
}
export const GetAppsListRequest = S.suspend(() =>
  S.Struct({ ListId: S.String, DefaultList: S.optional(S.Boolean) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAppsListRequest",
}) as any as S.Schema<GetAppsListRequest>;
export interface GetComplianceDetailRequest {
  PolicyId: string;
  MemberAccount: string;
}
export const GetComplianceDetailRequest = S.suspend(() =>
  S.Struct({ PolicyId: S.String, MemberAccount: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetComplianceDetailRequest",
}) as any as S.Schema<GetComplianceDetailRequest>;
export interface GetNotificationChannelResponse {
  SnsTopicArn?: string;
  SnsRoleName?: string;
}
export const GetNotificationChannelResponse = S.suspend(() =>
  S.Struct({
    SnsTopicArn: S.optional(S.String),
    SnsRoleName: S.optional(S.String),
  }),
).annotations({
  identifier: "GetNotificationChannelResponse",
}) as any as S.Schema<GetNotificationChannelResponse>;
export interface GetPolicyRequest {
  PolicyId: string;
}
export const GetPolicyRequest = S.suspend(() =>
  S.Struct({ PolicyId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetPolicyRequest",
}) as any as S.Schema<GetPolicyRequest>;
export interface GetProtectionStatusRequest {
  PolicyId: string;
  MemberAccountId?: string;
  StartTime?: Date;
  EndTime?: Date;
  NextToken?: string;
  MaxResults?: number;
}
export const GetProtectionStatusRequest = S.suspend(() =>
  S.Struct({
    PolicyId: S.String,
    MemberAccountId: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetProtectionStatusRequest",
}) as any as S.Schema<GetProtectionStatusRequest>;
export interface GetProtocolsListRequest {
  ListId: string;
  DefaultList?: boolean;
}
export const GetProtocolsListRequest = S.suspend(() =>
  S.Struct({ ListId: S.String, DefaultList: S.optional(S.Boolean) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetProtocolsListRequest",
}) as any as S.Schema<GetProtocolsListRequest>;
export interface GetResourceSetRequest {
  Identifier: string;
}
export const GetResourceSetRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetResourceSetRequest",
}) as any as S.Schema<GetResourceSetRequest>;
export interface GetThirdPartyFirewallAssociationStatusRequest {
  ThirdPartyFirewall: string;
}
export const GetThirdPartyFirewallAssociationStatusRequest = S.suspend(() =>
  S.Struct({ ThirdPartyFirewall: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetThirdPartyFirewallAssociationStatusRequest",
}) as any as S.Schema<GetThirdPartyFirewallAssociationStatusRequest>;
export interface GetViolationDetailsRequest {
  PolicyId: string;
  MemberAccount: string;
  ResourceId: string;
  ResourceType: string;
}
export const GetViolationDetailsRequest = S.suspend(() =>
  S.Struct({
    PolicyId: S.String,
    MemberAccount: S.String,
    ResourceId: S.String,
    ResourceType: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetViolationDetailsRequest",
}) as any as S.Schema<GetViolationDetailsRequest>;
export interface ListAdminAccountsForOrganizationRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListAdminAccountsForOrganizationRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAdminAccountsForOrganizationRequest",
}) as any as S.Schema<ListAdminAccountsForOrganizationRequest>;
export interface ListAdminsManagingAccountRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListAdminsManagingAccountRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAdminsManagingAccountRequest",
}) as any as S.Schema<ListAdminsManagingAccountRequest>;
export interface ListAppsListsRequest {
  DefaultLists?: boolean;
  NextToken?: string;
  MaxResults: number;
}
export const ListAppsListsRequest = S.suspend(() =>
  S.Struct({
    DefaultLists: S.optional(S.Boolean),
    NextToken: S.optional(S.String),
    MaxResults: S.Number,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAppsListsRequest",
}) as any as S.Schema<ListAppsListsRequest>;
export interface ListComplianceStatusRequest {
  PolicyId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListComplianceStatusRequest = S.suspend(() =>
  S.Struct({
    PolicyId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListComplianceStatusRequest",
}) as any as S.Schema<ListComplianceStatusRequest>;
export interface ListDiscoveredResourcesRequest {
  MemberAccountIds: AWSAccountIdList;
  ResourceType: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListDiscoveredResourcesRequest = S.suspend(() =>
  S.Struct({
    MemberAccountIds: AWSAccountIdList,
    ResourceType: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDiscoveredResourcesRequest",
}) as any as S.Schema<ListDiscoveredResourcesRequest>;
export interface ListMemberAccountsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListMemberAccountsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListMemberAccountsRequest",
}) as any as S.Schema<ListMemberAccountsRequest>;
export interface ListPoliciesRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListPoliciesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPoliciesRequest",
}) as any as S.Schema<ListPoliciesRequest>;
export interface ListProtocolsListsRequest {
  DefaultLists?: boolean;
  NextToken?: string;
  MaxResults: number;
}
export const ListProtocolsListsRequest = S.suspend(() =>
  S.Struct({
    DefaultLists: S.optional(S.Boolean),
    NextToken: S.optional(S.String),
    MaxResults: S.Number,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListProtocolsListsRequest",
}) as any as S.Schema<ListProtocolsListsRequest>;
export interface ListResourceSetResourcesRequest {
  Identifier: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListResourceSetResourcesRequest = S.suspend(() =>
  S.Struct({
    Identifier: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListResourceSetResourcesRequest",
}) as any as S.Schema<ListResourceSetResourcesRequest>;
export interface ListResourceSetsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListResourceSetsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListResourceSetsRequest",
}) as any as S.Schema<ListResourceSetsRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ListThirdPartyFirewallFirewallPoliciesRequest {
  ThirdPartyFirewall: string;
  NextToken?: string;
  MaxResults: number;
}
export const ListThirdPartyFirewallFirewallPoliciesRequest = S.suspend(() =>
  S.Struct({
    ThirdPartyFirewall: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.Number,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListThirdPartyFirewallFirewallPoliciesRequest",
}) as any as S.Schema<ListThirdPartyFirewallFirewallPoliciesRequest>;
export interface PutNotificationChannelRequest {
  SnsTopicArn: string;
  SnsRoleName: string;
}
export const PutNotificationChannelRequest = S.suspend(() =>
  S.Struct({ SnsTopicArn: S.String, SnsRoleName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutNotificationChannelRequest",
}) as any as S.Schema<PutNotificationChannelRequest>;
export interface PutNotificationChannelResponse {}
export const PutNotificationChannelResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutNotificationChannelResponse",
}) as any as S.Schema<PutNotificationChannelResponse>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface TagResourceRequest {
  ResourceArn: string;
  TagList: TagList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagList: TagList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
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
  TagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagKeys: TagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type ResourceTypeList = string[];
export const ResourceTypeList = S.Array(S.String);
export type ResourceSetIds = string[];
export const ResourceSetIds = S.Array(S.String);
export type ProtocolsList = string[];
export const ProtocolsList = S.Array(S.String);
export type AccountIdList = string[];
export const AccountIdList = S.Array(S.String);
export type MemberAccounts = string[];
export const MemberAccounts = S.Array(S.String);
export interface ResourceSet {
  Id?: string;
  Name: string;
  Description?: string;
  UpdateToken?: string;
  ResourceTypeList: ResourceTypeList;
  LastUpdateTime?: Date;
  ResourceSetStatus?: string;
}
export const ResourceSet = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.String,
    Description: S.optional(S.String),
    UpdateToken: S.optional(S.String),
    ResourceTypeList: ResourceTypeList,
    LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ResourceSetStatus: S.optional(S.String),
  }),
).annotations({ identifier: "ResourceSet" }) as any as S.Schema<ResourceSet>;
export type OrganizationalUnitIdList = string[];
export const OrganizationalUnitIdList = S.Array(S.String);
export type AWSRegionList = string[];
export const AWSRegionList = S.Array(S.String);
export type SecurityServiceTypeList = string[];
export const SecurityServiceTypeList = S.Array(S.String);
export type CustomerPolicyScopeIdList = string[];
export const CustomerPolicyScopeIdList = S.Array(S.String);
export interface AssociateThirdPartyFirewallResponse {
  ThirdPartyFirewallStatus?: string;
}
export const AssociateThirdPartyFirewallResponse = S.suspend(() =>
  S.Struct({ ThirdPartyFirewallStatus: S.optional(S.String) }),
).annotations({
  identifier: "AssociateThirdPartyFirewallResponse",
}) as any as S.Schema<AssociateThirdPartyFirewallResponse>;
export interface FailedItem {
  URI?: string;
  Reason?: string;
}
export const FailedItem = S.suspend(() =>
  S.Struct({ URI: S.optional(S.String), Reason: S.optional(S.String) }),
).annotations({ identifier: "FailedItem" }) as any as S.Schema<FailedItem>;
export type FailedItemList = FailedItem[];
export const FailedItemList = S.Array(FailedItem);
export interface BatchDisassociateResourceResponse {
  ResourceSetIdentifier: string;
  FailedItems: FailedItemList;
}
export const BatchDisassociateResourceResponse = S.suspend(() =>
  S.Struct({ ResourceSetIdentifier: S.String, FailedItems: FailedItemList }),
).annotations({
  identifier: "BatchDisassociateResourceResponse",
}) as any as S.Schema<BatchDisassociateResourceResponse>;
export interface DisassociateThirdPartyFirewallResponse {
  ThirdPartyFirewallStatus?: string;
}
export const DisassociateThirdPartyFirewallResponse = S.suspend(() =>
  S.Struct({ ThirdPartyFirewallStatus: S.optional(S.String) }),
).annotations({
  identifier: "DisassociateThirdPartyFirewallResponse",
}) as any as S.Schema<DisassociateThirdPartyFirewallResponse>;
export interface AccountScope {
  Accounts?: AccountIdList;
  AllAccountsEnabled?: boolean;
  ExcludeSpecifiedAccounts?: boolean;
}
export const AccountScope = S.suspend(() =>
  S.Struct({
    Accounts: S.optional(AccountIdList),
    AllAccountsEnabled: S.optional(S.Boolean),
    ExcludeSpecifiedAccounts: S.optional(S.Boolean),
  }),
).annotations({ identifier: "AccountScope" }) as any as S.Schema<AccountScope>;
export interface OrganizationalUnitScope {
  OrganizationalUnits?: OrganizationalUnitIdList;
  AllOrganizationalUnitsEnabled?: boolean;
  ExcludeSpecifiedOrganizationalUnits?: boolean;
}
export const OrganizationalUnitScope = S.suspend(() =>
  S.Struct({
    OrganizationalUnits: S.optional(OrganizationalUnitIdList),
    AllOrganizationalUnitsEnabled: S.optional(S.Boolean),
    ExcludeSpecifiedOrganizationalUnits: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "OrganizationalUnitScope",
}) as any as S.Schema<OrganizationalUnitScope>;
export interface RegionScope {
  Regions?: AWSRegionList;
  AllRegionsEnabled?: boolean;
}
export const RegionScope = S.suspend(() =>
  S.Struct({
    Regions: S.optional(AWSRegionList),
    AllRegionsEnabled: S.optional(S.Boolean),
  }),
).annotations({ identifier: "RegionScope" }) as any as S.Schema<RegionScope>;
export interface PolicyTypeScope {
  PolicyTypes?: SecurityServiceTypeList;
  AllPolicyTypesEnabled?: boolean;
}
export const PolicyTypeScope = S.suspend(() =>
  S.Struct({
    PolicyTypes: S.optional(SecurityServiceTypeList),
    AllPolicyTypesEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "PolicyTypeScope",
}) as any as S.Schema<PolicyTypeScope>;
export interface AdminScope {
  AccountScope?: AccountScope;
  OrganizationalUnitScope?: OrganizationalUnitScope;
  RegionScope?: RegionScope;
  PolicyTypeScope?: PolicyTypeScope;
}
export const AdminScope = S.suspend(() =>
  S.Struct({
    AccountScope: S.optional(AccountScope),
    OrganizationalUnitScope: S.optional(OrganizationalUnitScope),
    RegionScope: S.optional(RegionScope),
    PolicyTypeScope: S.optional(PolicyTypeScope),
  }),
).annotations({ identifier: "AdminScope" }) as any as S.Schema<AdminScope>;
export interface GetAdminScopeResponse {
  AdminScope?: AdminScope;
  Status?: string;
}
export const GetAdminScopeResponse = S.suspend(() =>
  S.Struct({
    AdminScope: S.optional(AdminScope),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "GetAdminScopeResponse",
}) as any as S.Schema<GetAdminScopeResponse>;
export interface App {
  AppName: string;
  Protocol: string;
  Port: number;
}
export const App = S.suspend(() =>
  S.Struct({ AppName: S.String, Protocol: S.String, Port: S.Number }),
).annotations({ identifier: "App" }) as any as S.Schema<App>;
export type AppsList = App[];
export const AppsList = S.Array(App);
export type PreviousAppsList = { [key: string]: AppsList };
export const PreviousAppsList = S.Record({ key: S.String, value: AppsList });
export interface AppsListData {
  ListId?: string;
  ListName: string;
  ListUpdateToken?: string;
  CreateTime?: Date;
  LastUpdateTime?: Date;
  AppsList: AppsList;
  PreviousAppsList?: PreviousAppsList;
}
export const AppsListData = S.suspend(() =>
  S.Struct({
    ListId: S.optional(S.String),
    ListName: S.String,
    ListUpdateToken: S.optional(S.String),
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    AppsList: AppsList,
    PreviousAppsList: S.optional(PreviousAppsList),
  }),
).annotations({ identifier: "AppsListData" }) as any as S.Schema<AppsListData>;
export interface GetAppsListResponse {
  AppsList?: AppsListData;
  AppsListArn?: string;
}
export const GetAppsListResponse = S.suspend(() =>
  S.Struct({
    AppsList: S.optional(AppsListData),
    AppsListArn: S.optional(S.String),
  }),
).annotations({
  identifier: "GetAppsListResponse",
}) as any as S.Schema<GetAppsListResponse>;
export interface NetworkFirewallPolicy {
  FirewallDeploymentModel?: string;
}
export const NetworkFirewallPolicy = S.suspend(() =>
  S.Struct({ FirewallDeploymentModel: S.optional(S.String) }),
).annotations({
  identifier: "NetworkFirewallPolicy",
}) as any as S.Schema<NetworkFirewallPolicy>;
export interface ThirdPartyFirewallPolicy {
  FirewallDeploymentModel?: string;
}
export const ThirdPartyFirewallPolicy = S.suspend(() =>
  S.Struct({ FirewallDeploymentModel: S.optional(S.String) }),
).annotations({
  identifier: "ThirdPartyFirewallPolicy",
}) as any as S.Schema<ThirdPartyFirewallPolicy>;
export interface NetworkAclIcmpTypeCode {
  Code?: number;
  Type?: number;
}
export const NetworkAclIcmpTypeCode = S.suspend(() =>
  S.Struct({ Code: S.optional(S.Number), Type: S.optional(S.Number) }),
).annotations({
  identifier: "NetworkAclIcmpTypeCode",
}) as any as S.Schema<NetworkAclIcmpTypeCode>;
export interface NetworkAclPortRange {
  From?: number;
  To?: number;
}
export const NetworkAclPortRange = S.suspend(() =>
  S.Struct({ From: S.optional(S.Number), To: S.optional(S.Number) }),
).annotations({
  identifier: "NetworkAclPortRange",
}) as any as S.Schema<NetworkAclPortRange>;
export interface NetworkAclEntry {
  IcmpTypeCode?: NetworkAclIcmpTypeCode;
  Protocol: string;
  PortRange?: NetworkAclPortRange;
  CidrBlock?: string;
  Ipv6CidrBlock?: string;
  RuleAction: string;
  Egress: boolean;
}
export const NetworkAclEntry = S.suspend(() =>
  S.Struct({
    IcmpTypeCode: S.optional(NetworkAclIcmpTypeCode),
    Protocol: S.String,
    PortRange: S.optional(NetworkAclPortRange),
    CidrBlock: S.optional(S.String),
    Ipv6CidrBlock: S.optional(S.String),
    RuleAction: S.String,
    Egress: S.Boolean,
  }),
).annotations({
  identifier: "NetworkAclEntry",
}) as any as S.Schema<NetworkAclEntry>;
export type NetworkAclEntries = NetworkAclEntry[];
export const NetworkAclEntries = S.Array(NetworkAclEntry);
export interface NetworkAclEntrySet {
  FirstEntries?: NetworkAclEntries;
  ForceRemediateForFirstEntries: boolean;
  LastEntries?: NetworkAclEntries;
  ForceRemediateForLastEntries: boolean;
}
export const NetworkAclEntrySet = S.suspend(() =>
  S.Struct({
    FirstEntries: S.optional(NetworkAclEntries),
    ForceRemediateForFirstEntries: S.Boolean,
    LastEntries: S.optional(NetworkAclEntries),
    ForceRemediateForLastEntries: S.Boolean,
  }),
).annotations({
  identifier: "NetworkAclEntrySet",
}) as any as S.Schema<NetworkAclEntrySet>;
export interface NetworkAclCommonPolicy {
  NetworkAclEntrySet: NetworkAclEntrySet;
}
export const NetworkAclCommonPolicy = S.suspend(() =>
  S.Struct({ NetworkAclEntrySet: NetworkAclEntrySet }),
).annotations({
  identifier: "NetworkAclCommonPolicy",
}) as any as S.Schema<NetworkAclCommonPolicy>;
export interface PolicyOption {
  NetworkFirewallPolicy?: NetworkFirewallPolicy;
  ThirdPartyFirewallPolicy?: ThirdPartyFirewallPolicy;
  NetworkAclCommonPolicy?: NetworkAclCommonPolicy;
}
export const PolicyOption = S.suspend(() =>
  S.Struct({
    NetworkFirewallPolicy: S.optional(NetworkFirewallPolicy),
    ThirdPartyFirewallPolicy: S.optional(ThirdPartyFirewallPolicy),
    NetworkAclCommonPolicy: S.optional(NetworkAclCommonPolicy),
  }),
).annotations({ identifier: "PolicyOption" }) as any as S.Schema<PolicyOption>;
export interface SecurityServicePolicyData {
  Type: string;
  ManagedServiceData?: string;
  PolicyOption?: PolicyOption;
}
export const SecurityServicePolicyData = S.suspend(() =>
  S.Struct({
    Type: S.String,
    ManagedServiceData: S.optional(S.String),
    PolicyOption: S.optional(PolicyOption),
  }),
).annotations({
  identifier: "SecurityServicePolicyData",
}) as any as S.Schema<SecurityServicePolicyData>;
export interface ResourceTag {
  Key: string;
  Value?: string;
}
export const ResourceTag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.optional(S.String) }),
).annotations({ identifier: "ResourceTag" }) as any as S.Schema<ResourceTag>;
export type ResourceTags = ResourceTag[];
export const ResourceTags = S.Array(ResourceTag);
export type CustomerPolicyScopeMap = {
  [key: string]: CustomerPolicyScopeIdList;
};
export const CustomerPolicyScopeMap = S.Record({
  key: S.String,
  value: CustomerPolicyScopeIdList,
});
export interface Policy {
  PolicyId?: string;
  PolicyName: string;
  PolicyUpdateToken?: string;
  SecurityServicePolicyData: SecurityServicePolicyData;
  ResourceType: string;
  ResourceTypeList?: ResourceTypeList;
  ResourceTags?: ResourceTags;
  ExcludeResourceTags: boolean;
  RemediationEnabled: boolean;
  DeleteUnusedFMManagedResources?: boolean;
  IncludeMap?: CustomerPolicyScopeMap;
  ExcludeMap?: CustomerPolicyScopeMap;
  ResourceSetIds?: ResourceSetIds;
  PolicyDescription?: string;
  PolicyStatus?: string;
  ResourceTagLogicalOperator?: string;
}
export const Policy = S.suspend(() =>
  S.Struct({
    PolicyId: S.optional(S.String),
    PolicyName: S.String,
    PolicyUpdateToken: S.optional(S.String),
    SecurityServicePolicyData: SecurityServicePolicyData,
    ResourceType: S.String,
    ResourceTypeList: S.optional(ResourceTypeList),
    ResourceTags: S.optional(ResourceTags),
    ExcludeResourceTags: S.Boolean,
    RemediationEnabled: S.Boolean,
    DeleteUnusedFMManagedResources: S.optional(S.Boolean),
    IncludeMap: S.optional(CustomerPolicyScopeMap),
    ExcludeMap: S.optional(CustomerPolicyScopeMap),
    ResourceSetIds: S.optional(ResourceSetIds),
    PolicyDescription: S.optional(S.String),
    PolicyStatus: S.optional(S.String),
    ResourceTagLogicalOperator: S.optional(S.String),
  }),
).annotations({ identifier: "Policy" }) as any as S.Schema<Policy>;
export interface GetPolicyResponse {
  Policy?: Policy;
  PolicyArn?: string;
}
export const GetPolicyResponse = S.suspend(() =>
  S.Struct({ Policy: S.optional(Policy), PolicyArn: S.optional(S.String) }),
).annotations({
  identifier: "GetPolicyResponse",
}) as any as S.Schema<GetPolicyResponse>;
export interface GetProtectionStatusResponse {
  AdminAccountId?: string;
  ServiceType?: string;
  Data?: string;
  NextToken?: string;
}
export const GetProtectionStatusResponse = S.suspend(() =>
  S.Struct({
    AdminAccountId: S.optional(S.String),
    ServiceType: S.optional(S.String),
    Data: S.optional(S.String),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetProtectionStatusResponse",
}) as any as S.Schema<GetProtectionStatusResponse>;
export type PreviousProtocolsList = { [key: string]: ProtocolsList };
export const PreviousProtocolsList = S.Record({
  key: S.String,
  value: ProtocolsList,
});
export interface ProtocolsListData {
  ListId?: string;
  ListName: string;
  ListUpdateToken?: string;
  CreateTime?: Date;
  LastUpdateTime?: Date;
  ProtocolsList: ProtocolsList;
  PreviousProtocolsList?: PreviousProtocolsList;
}
export const ProtocolsListData = S.suspend(() =>
  S.Struct({
    ListId: S.optional(S.String),
    ListName: S.String,
    ListUpdateToken: S.optional(S.String),
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ProtocolsList: ProtocolsList,
    PreviousProtocolsList: S.optional(PreviousProtocolsList),
  }),
).annotations({
  identifier: "ProtocolsListData",
}) as any as S.Schema<ProtocolsListData>;
export interface GetProtocolsListResponse {
  ProtocolsList?: ProtocolsListData;
  ProtocolsListArn?: string;
}
export const GetProtocolsListResponse = S.suspend(() =>
  S.Struct({
    ProtocolsList: S.optional(ProtocolsListData),
    ProtocolsListArn: S.optional(S.String),
  }),
).annotations({
  identifier: "GetProtocolsListResponse",
}) as any as S.Schema<GetProtocolsListResponse>;
export interface GetResourceSetResponse {
  ResourceSet: ResourceSet;
  ResourceSetArn: string;
}
export const GetResourceSetResponse = S.suspend(() =>
  S.Struct({ ResourceSet: ResourceSet, ResourceSetArn: S.String }),
).annotations({
  identifier: "GetResourceSetResponse",
}) as any as S.Schema<GetResourceSetResponse>;
export interface GetThirdPartyFirewallAssociationStatusResponse {
  ThirdPartyFirewallStatus?: string;
  MarketplaceOnboardingStatus?: string;
}
export const GetThirdPartyFirewallAssociationStatusResponse = S.suspend(() =>
  S.Struct({
    ThirdPartyFirewallStatus: S.optional(S.String),
    MarketplaceOnboardingStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "GetThirdPartyFirewallAssociationStatusResponse",
}) as any as S.Schema<GetThirdPartyFirewallAssociationStatusResponse>;
export interface ListAdminsManagingAccountResponse {
  AdminAccounts?: AccountIdList;
  NextToken?: string;
}
export const ListAdminsManagingAccountResponse = S.suspend(() =>
  S.Struct({
    AdminAccounts: S.optional(AccountIdList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAdminsManagingAccountResponse",
}) as any as S.Schema<ListAdminsManagingAccountResponse>;
export interface ListMemberAccountsResponse {
  MemberAccounts?: MemberAccounts;
  NextToken?: string;
}
export const ListMemberAccountsResponse = S.suspend(() =>
  S.Struct({
    MemberAccounts: S.optional(MemberAccounts),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListMemberAccountsResponse",
}) as any as S.Schema<ListMemberAccountsResponse>;
export interface ListTagsForResourceResponse {
  TagList?: TagList;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ TagList: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutResourceSetRequest {
  ResourceSet: ResourceSet;
  TagList?: TagList;
}
export const PutResourceSetRequest = S.suspend(() =>
  S.Struct({ ResourceSet: ResourceSet, TagList: S.optional(TagList) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutResourceSetRequest",
}) as any as S.Schema<PutResourceSetRequest>;
export interface AdminAccountSummary {
  AdminAccount?: string;
  DefaultAdmin?: boolean;
  Status?: string;
}
export const AdminAccountSummary = S.suspend(() =>
  S.Struct({
    AdminAccount: S.optional(S.String),
    DefaultAdmin: S.optional(S.Boolean),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "AdminAccountSummary",
}) as any as S.Schema<AdminAccountSummary>;
export type AdminAccountSummaryList = AdminAccountSummary[];
export const AdminAccountSummaryList = S.Array(AdminAccountSummary);
export interface AppsListDataSummary {
  ListArn?: string;
  ListId?: string;
  ListName?: string;
  AppsList?: AppsList;
}
export const AppsListDataSummary = S.suspend(() =>
  S.Struct({
    ListArn: S.optional(S.String),
    ListId: S.optional(S.String),
    ListName: S.optional(S.String),
    AppsList: S.optional(AppsList),
  }),
).annotations({
  identifier: "AppsListDataSummary",
}) as any as S.Schema<AppsListDataSummary>;
export type AppsListsData = AppsListDataSummary[];
export const AppsListsData = S.Array(AppsListDataSummary);
export interface DiscoveredResource {
  URI?: string;
  AccountId?: string;
  Type?: string;
  Name?: string;
}
export const DiscoveredResource = S.suspend(() =>
  S.Struct({
    URI: S.optional(S.String),
    AccountId: S.optional(S.String),
    Type: S.optional(S.String),
    Name: S.optional(S.String),
  }),
).annotations({
  identifier: "DiscoveredResource",
}) as any as S.Schema<DiscoveredResource>;
export type DiscoveredResourceList = DiscoveredResource[];
export const DiscoveredResourceList = S.Array(DiscoveredResource);
export interface PolicySummary {
  PolicyArn?: string;
  PolicyId?: string;
  PolicyName?: string;
  ResourceType?: string;
  SecurityServiceType?: string;
  RemediationEnabled?: boolean;
  DeleteUnusedFMManagedResources?: boolean;
  PolicyStatus?: string;
}
export const PolicySummary = S.suspend(() =>
  S.Struct({
    PolicyArn: S.optional(S.String),
    PolicyId: S.optional(S.String),
    PolicyName: S.optional(S.String),
    ResourceType: S.optional(S.String),
    SecurityServiceType: S.optional(S.String),
    RemediationEnabled: S.optional(S.Boolean),
    DeleteUnusedFMManagedResources: S.optional(S.Boolean),
    PolicyStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "PolicySummary",
}) as any as S.Schema<PolicySummary>;
export type PolicySummaryList = PolicySummary[];
export const PolicySummaryList = S.Array(PolicySummary);
export interface ProtocolsListDataSummary {
  ListArn?: string;
  ListId?: string;
  ListName?: string;
  ProtocolsList?: ProtocolsList;
}
export const ProtocolsListDataSummary = S.suspend(() =>
  S.Struct({
    ListArn: S.optional(S.String),
    ListId: S.optional(S.String),
    ListName: S.optional(S.String),
    ProtocolsList: S.optional(ProtocolsList),
  }),
).annotations({
  identifier: "ProtocolsListDataSummary",
}) as any as S.Schema<ProtocolsListDataSummary>;
export type ProtocolsListsData = ProtocolsListDataSummary[];
export const ProtocolsListsData = S.Array(ProtocolsListDataSummary);
export interface Resource {
  URI: string;
  AccountId?: string;
}
export const Resource = S.suspend(() =>
  S.Struct({ URI: S.String, AccountId: S.optional(S.String) }),
).annotations({ identifier: "Resource" }) as any as S.Schema<Resource>;
export type ResourceList = Resource[];
export const ResourceList = S.Array(Resource);
export interface ResourceSetSummary {
  Id?: string;
  Name?: string;
  Description?: string;
  LastUpdateTime?: Date;
  ResourceSetStatus?: string;
}
export const ResourceSetSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ResourceSetStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourceSetSummary",
}) as any as S.Schema<ResourceSetSummary>;
export type ResourceSetSummaryList = ResourceSetSummary[];
export const ResourceSetSummaryList = S.Array(ResourceSetSummary);
export interface ThirdPartyFirewallFirewallPolicy {
  FirewallPolicyId?: string;
  FirewallPolicyName?: string;
}
export const ThirdPartyFirewallFirewallPolicy = S.suspend(() =>
  S.Struct({
    FirewallPolicyId: S.optional(S.String),
    FirewallPolicyName: S.optional(S.String),
  }),
).annotations({
  identifier: "ThirdPartyFirewallFirewallPolicy",
}) as any as S.Schema<ThirdPartyFirewallFirewallPolicy>;
export type ThirdPartyFirewallFirewallPolicies =
  ThirdPartyFirewallFirewallPolicy[];
export const ThirdPartyFirewallFirewallPolicies = S.Array(
  ThirdPartyFirewallFirewallPolicy,
);
export interface BatchAssociateResourceResponse {
  ResourceSetIdentifier: string;
  FailedItems: FailedItemList;
}
export const BatchAssociateResourceResponse = S.suspend(() =>
  S.Struct({ ResourceSetIdentifier: S.String, FailedItems: FailedItemList }),
).annotations({
  identifier: "BatchAssociateResourceResponse",
}) as any as S.Schema<BatchAssociateResourceResponse>;
export interface ListAdminAccountsForOrganizationResponse {
  AdminAccounts?: AdminAccountSummaryList;
  NextToken?: string;
}
export const ListAdminAccountsForOrganizationResponse = S.suspend(() =>
  S.Struct({
    AdminAccounts: S.optional(AdminAccountSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAdminAccountsForOrganizationResponse",
}) as any as S.Schema<ListAdminAccountsForOrganizationResponse>;
export interface ListAppsListsResponse {
  AppsLists?: AppsListsData;
  NextToken?: string;
}
export const ListAppsListsResponse = S.suspend(() =>
  S.Struct({
    AppsLists: S.optional(AppsListsData),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAppsListsResponse",
}) as any as S.Schema<ListAppsListsResponse>;
export interface ListDiscoveredResourcesResponse {
  Items?: DiscoveredResourceList;
  NextToken?: string;
}
export const ListDiscoveredResourcesResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(DiscoveredResourceList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDiscoveredResourcesResponse",
}) as any as S.Schema<ListDiscoveredResourcesResponse>;
export interface ListPoliciesResponse {
  PolicyList?: PolicySummaryList;
  NextToken?: string;
}
export const ListPoliciesResponse = S.suspend(() =>
  S.Struct({
    PolicyList: S.optional(PolicySummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPoliciesResponse",
}) as any as S.Schema<ListPoliciesResponse>;
export interface ListProtocolsListsResponse {
  ProtocolsLists?: ProtocolsListsData;
  NextToken?: string;
}
export const ListProtocolsListsResponse = S.suspend(() =>
  S.Struct({
    ProtocolsLists: S.optional(ProtocolsListsData),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProtocolsListsResponse",
}) as any as S.Schema<ListProtocolsListsResponse>;
export interface ListResourceSetResourcesResponse {
  Items: ResourceList;
  NextToken?: string;
}
export const ListResourceSetResourcesResponse = S.suspend(() =>
  S.Struct({ Items: ResourceList, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListResourceSetResourcesResponse",
}) as any as S.Schema<ListResourceSetResourcesResponse>;
export interface ListResourceSetsResponse {
  ResourceSets?: ResourceSetSummaryList;
  NextToken?: string;
}
export const ListResourceSetsResponse = S.suspend(() =>
  S.Struct({
    ResourceSets: S.optional(ResourceSetSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListResourceSetsResponse",
}) as any as S.Schema<ListResourceSetsResponse>;
export interface ListThirdPartyFirewallFirewallPoliciesResponse {
  ThirdPartyFirewallFirewallPolicies?: ThirdPartyFirewallFirewallPolicies;
  NextToken?: string;
}
export const ListThirdPartyFirewallFirewallPoliciesResponse = S.suspend(() =>
  S.Struct({
    ThirdPartyFirewallFirewallPolicies: S.optional(
      ThirdPartyFirewallFirewallPolicies,
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListThirdPartyFirewallFirewallPoliciesResponse",
}) as any as S.Schema<ListThirdPartyFirewallFirewallPoliciesResponse>;
export interface PutAdminAccountRequest {
  AdminAccount: string;
  AdminScope?: AdminScope;
}
export const PutAdminAccountRequest = S.suspend(() =>
  S.Struct({ AdminAccount: S.String, AdminScope: S.optional(AdminScope) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutAdminAccountRequest",
}) as any as S.Schema<PutAdminAccountRequest>;
export interface PutAdminAccountResponse {}
export const PutAdminAccountResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutAdminAccountResponse",
}) as any as S.Schema<PutAdminAccountResponse>;
export interface PutAppsListRequest {
  AppsList: AppsListData;
  TagList?: TagList;
}
export const PutAppsListRequest = S.suspend(() =>
  S.Struct({ AppsList: AppsListData, TagList: S.optional(TagList) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutAppsListRequest",
}) as any as S.Schema<PutAppsListRequest>;
export interface PutProtocolsListRequest {
  ProtocolsList: ProtocolsListData;
  TagList?: TagList;
}
export const PutProtocolsListRequest = S.suspend(() =>
  S.Struct({
    ProtocolsList: ProtocolsListData,
    TagList: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutProtocolsListRequest",
}) as any as S.Schema<PutProtocolsListRequest>;
export interface PutResourceSetResponse {
  ResourceSet: ResourceSet;
  ResourceSetArn: string;
}
export const PutResourceSetResponse = S.suspend(() =>
  S.Struct({ ResourceSet: ResourceSet, ResourceSetArn: S.String }),
).annotations({
  identifier: "PutResourceSetResponse",
}) as any as S.Schema<PutResourceSetResponse>;
export type IssueInfoMap = { [key: string]: string };
export const IssueInfoMap = S.Record({ key: S.String, value: S.String });
export interface EvaluationResult {
  ComplianceStatus?: string;
  ViolatorCount?: number;
  EvaluationLimitExceeded?: boolean;
}
export const EvaluationResult = S.suspend(() =>
  S.Struct({
    ComplianceStatus: S.optional(S.String),
    ViolatorCount: S.optional(S.Number),
    EvaluationLimitExceeded: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "EvaluationResult",
}) as any as S.Schema<EvaluationResult>;
export type EvaluationResults = EvaluationResult[];
export const EvaluationResults = S.Array(EvaluationResult);
export type ResourceIdList = string[];
export const ResourceIdList = S.Array(S.String);
export interface AwsEc2NetworkInterfaceViolation {
  ViolationTarget?: string;
  ViolatingSecurityGroups?: ResourceIdList;
}
export const AwsEc2NetworkInterfaceViolation = S.suspend(() =>
  S.Struct({
    ViolationTarget: S.optional(S.String),
    ViolatingSecurityGroups: S.optional(ResourceIdList),
  }),
).annotations({
  identifier: "AwsEc2NetworkInterfaceViolation",
}) as any as S.Schema<AwsEc2NetworkInterfaceViolation>;
export type AwsEc2NetworkInterfaceViolations =
  AwsEc2NetworkInterfaceViolation[];
export const AwsEc2NetworkInterfaceViolations = S.Array(
  AwsEc2NetworkInterfaceViolation,
);
export type DnsRuleGroupPriorities = number[];
export const DnsRuleGroupPriorities = S.Array(S.Number);
export type ResourceArnList = string[];
export const ResourceArnList = S.Array(S.String);
export interface PolicyComplianceStatus {
  PolicyOwner?: string;
  PolicyId?: string;
  PolicyName?: string;
  MemberAccount?: string;
  EvaluationResults?: EvaluationResults;
  LastUpdated?: Date;
  IssueInfoMap?: IssueInfoMap;
}
export const PolicyComplianceStatus = S.suspend(() =>
  S.Struct({
    PolicyOwner: S.optional(S.String),
    PolicyId: S.optional(S.String),
    PolicyName: S.optional(S.String),
    MemberAccount: S.optional(S.String),
    EvaluationResults: S.optional(EvaluationResults),
    LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    IssueInfoMap: S.optional(IssueInfoMap),
  }),
).annotations({
  identifier: "PolicyComplianceStatus",
}) as any as S.Schema<PolicyComplianceStatus>;
export type PolicyComplianceStatusList = PolicyComplianceStatus[];
export const PolicyComplianceStatusList = S.Array(PolicyComplianceStatus);
export type ComplianceViolatorMetadata = { [key: string]: string };
export const ComplianceViolatorMetadata = S.Record({
  key: S.String,
  value: S.String,
});
export interface AwsEc2InstanceViolation {
  ViolationTarget?: string;
  AwsEc2NetworkInterfaceViolations?: AwsEc2NetworkInterfaceViolations;
}
export const AwsEc2InstanceViolation = S.suspend(() =>
  S.Struct({
    ViolationTarget: S.optional(S.String),
    AwsEc2NetworkInterfaceViolations: S.optional(
      AwsEc2NetworkInterfaceViolations,
    ),
  }),
).annotations({
  identifier: "AwsEc2InstanceViolation",
}) as any as S.Schema<AwsEc2InstanceViolation>;
export interface NetworkFirewallMissingFirewallViolation {
  ViolationTarget?: string;
  VPC?: string;
  AvailabilityZone?: string;
  TargetViolationReason?: string;
}
export const NetworkFirewallMissingFirewallViolation = S.suspend(() =>
  S.Struct({
    ViolationTarget: S.optional(S.String),
    VPC: S.optional(S.String),
    AvailabilityZone: S.optional(S.String),
    TargetViolationReason: S.optional(S.String),
  }),
).annotations({
  identifier: "NetworkFirewallMissingFirewallViolation",
}) as any as S.Schema<NetworkFirewallMissingFirewallViolation>;
export interface NetworkFirewallMissingSubnetViolation {
  ViolationTarget?: string;
  VPC?: string;
  AvailabilityZone?: string;
  TargetViolationReason?: string;
}
export const NetworkFirewallMissingSubnetViolation = S.suspend(() =>
  S.Struct({
    ViolationTarget: S.optional(S.String),
    VPC: S.optional(S.String),
    AvailabilityZone: S.optional(S.String),
    TargetViolationReason: S.optional(S.String),
  }),
).annotations({
  identifier: "NetworkFirewallMissingSubnetViolation",
}) as any as S.Schema<NetworkFirewallMissingSubnetViolation>;
export interface NetworkFirewallMissingExpectedRTViolation {
  ViolationTarget?: string;
  VPC?: string;
  AvailabilityZone?: string;
  CurrentRouteTable?: string;
  ExpectedRouteTable?: string;
}
export const NetworkFirewallMissingExpectedRTViolation = S.suspend(() =>
  S.Struct({
    ViolationTarget: S.optional(S.String),
    VPC: S.optional(S.String),
    AvailabilityZone: S.optional(S.String),
    CurrentRouteTable: S.optional(S.String),
    ExpectedRouteTable: S.optional(S.String),
  }),
).annotations({
  identifier: "NetworkFirewallMissingExpectedRTViolation",
}) as any as S.Schema<NetworkFirewallMissingExpectedRTViolation>;
export interface Route {
  DestinationType?: string;
  TargetType?: string;
  Destination?: string;
  Target?: string;
}
export const Route = S.suspend(() =>
  S.Struct({
    DestinationType: S.optional(S.String),
    TargetType: S.optional(S.String),
    Destination: S.optional(S.String),
    Target: S.optional(S.String),
  }),
).annotations({ identifier: "Route" }) as any as S.Schema<Route>;
export type LengthBoundedStringList = string[];
export const LengthBoundedStringList = S.Array(S.String);
export interface ExpectedRoute {
  IpV4Cidr?: string;
  PrefixListId?: string;
  IpV6Cidr?: string;
  ContributingSubnets?: ResourceIdList;
  AllowedTargets?: LengthBoundedStringList;
  RouteTableId?: string;
}
export const ExpectedRoute = S.suspend(() =>
  S.Struct({
    IpV4Cidr: S.optional(S.String),
    PrefixListId: S.optional(S.String),
    IpV6Cidr: S.optional(S.String),
    ContributingSubnets: S.optional(ResourceIdList),
    AllowedTargets: S.optional(LengthBoundedStringList),
    RouteTableId: S.optional(S.String),
  }),
).annotations({
  identifier: "ExpectedRoute",
}) as any as S.Schema<ExpectedRoute>;
export type ExpectedRoutes = ExpectedRoute[];
export const ExpectedRoutes = S.Array(ExpectedRoute);
export type Routes = Route[];
export const Routes = S.Array(Route);
export interface NetworkFirewallInvalidRouteConfigurationViolation {
  AffectedSubnets?: ResourceIdList;
  RouteTableId?: string;
  IsRouteTableUsedInDifferentAZ?: boolean;
  ViolatingRoute?: Route;
  CurrentFirewallSubnetRouteTable?: string;
  ExpectedFirewallEndpoint?: string;
  ActualFirewallEndpoint?: string;
  ExpectedFirewallSubnetId?: string;
  ActualFirewallSubnetId?: string;
  ExpectedFirewallSubnetRoutes?: ExpectedRoutes;
  ActualFirewallSubnetRoutes?: Routes;
  InternetGatewayId?: string;
  CurrentInternetGatewayRouteTable?: string;
  ExpectedInternetGatewayRoutes?: ExpectedRoutes;
  ActualInternetGatewayRoutes?: Routes;
  VpcId?: string;
}
export const NetworkFirewallInvalidRouteConfigurationViolation = S.suspend(() =>
  S.Struct({
    AffectedSubnets: S.optional(ResourceIdList),
    RouteTableId: S.optional(S.String),
    IsRouteTableUsedInDifferentAZ: S.optional(S.Boolean),
    ViolatingRoute: S.optional(Route),
    CurrentFirewallSubnetRouteTable: S.optional(S.String),
    ExpectedFirewallEndpoint: S.optional(S.String),
    ActualFirewallEndpoint: S.optional(S.String),
    ExpectedFirewallSubnetId: S.optional(S.String),
    ActualFirewallSubnetId: S.optional(S.String),
    ExpectedFirewallSubnetRoutes: S.optional(ExpectedRoutes),
    ActualFirewallSubnetRoutes: S.optional(Routes),
    InternetGatewayId: S.optional(S.String),
    CurrentInternetGatewayRouteTable: S.optional(S.String),
    ExpectedInternetGatewayRoutes: S.optional(ExpectedRoutes),
    ActualInternetGatewayRoutes: S.optional(Routes),
    VpcId: S.optional(S.String),
  }),
).annotations({
  identifier: "NetworkFirewallInvalidRouteConfigurationViolation",
}) as any as S.Schema<NetworkFirewallInvalidRouteConfigurationViolation>;
export interface NetworkFirewallBlackHoleRouteDetectedViolation {
  ViolationTarget?: string;
  RouteTableId?: string;
  VpcId?: string;
  ViolatingRoutes?: Routes;
}
export const NetworkFirewallBlackHoleRouteDetectedViolation = S.suspend(() =>
  S.Struct({
    ViolationTarget: S.optional(S.String),
    RouteTableId: S.optional(S.String),
    VpcId: S.optional(S.String),
    ViolatingRoutes: S.optional(Routes),
  }),
).annotations({
  identifier: "NetworkFirewallBlackHoleRouteDetectedViolation",
}) as any as S.Schema<NetworkFirewallBlackHoleRouteDetectedViolation>;
export interface NetworkFirewallUnexpectedFirewallRoutesViolation {
  FirewallSubnetId?: string;
  ViolatingRoutes?: Routes;
  RouteTableId?: string;
  FirewallEndpoint?: string;
  VpcId?: string;
}
export const NetworkFirewallUnexpectedFirewallRoutesViolation = S.suspend(() =>
  S.Struct({
    FirewallSubnetId: S.optional(S.String),
    ViolatingRoutes: S.optional(Routes),
    RouteTableId: S.optional(S.String),
    FirewallEndpoint: S.optional(S.String),
    VpcId: S.optional(S.String),
  }),
).annotations({
  identifier: "NetworkFirewallUnexpectedFirewallRoutesViolation",
}) as any as S.Schema<NetworkFirewallUnexpectedFirewallRoutesViolation>;
export interface NetworkFirewallUnexpectedGatewayRoutesViolation {
  GatewayId?: string;
  ViolatingRoutes?: Routes;
  RouteTableId?: string;
  VpcId?: string;
}
export const NetworkFirewallUnexpectedGatewayRoutesViolation = S.suspend(() =>
  S.Struct({
    GatewayId: S.optional(S.String),
    ViolatingRoutes: S.optional(Routes),
    RouteTableId: S.optional(S.String),
    VpcId: S.optional(S.String),
  }),
).annotations({
  identifier: "NetworkFirewallUnexpectedGatewayRoutesViolation",
}) as any as S.Schema<NetworkFirewallUnexpectedGatewayRoutesViolation>;
export interface NetworkFirewallMissingExpectedRoutesViolation {
  ViolationTarget?: string;
  ExpectedRoutes?: ExpectedRoutes;
  VpcId?: string;
}
export const NetworkFirewallMissingExpectedRoutesViolation = S.suspend(() =>
  S.Struct({
    ViolationTarget: S.optional(S.String),
    ExpectedRoutes: S.optional(ExpectedRoutes),
    VpcId: S.optional(S.String),
  }),
).annotations({
  identifier: "NetworkFirewallMissingExpectedRoutesViolation",
}) as any as S.Schema<NetworkFirewallMissingExpectedRoutesViolation>;
export interface DnsRuleGroupPriorityConflictViolation {
  ViolationTarget?: string;
  ViolationTargetDescription?: string;
  ConflictingPriority?: number;
  ConflictingPolicyId?: string;
  UnavailablePriorities?: DnsRuleGroupPriorities;
}
export const DnsRuleGroupPriorityConflictViolation = S.suspend(() =>
  S.Struct({
    ViolationTarget: S.optional(S.String),
    ViolationTargetDescription: S.optional(S.String),
    ConflictingPriority: S.optional(S.Number),
    ConflictingPolicyId: S.optional(S.String),
    UnavailablePriorities: S.optional(DnsRuleGroupPriorities),
  }),
).annotations({
  identifier: "DnsRuleGroupPriorityConflictViolation",
}) as any as S.Schema<DnsRuleGroupPriorityConflictViolation>;
export interface DnsDuplicateRuleGroupViolation {
  ViolationTarget?: string;
  ViolationTargetDescription?: string;
}
export const DnsDuplicateRuleGroupViolation = S.suspend(() =>
  S.Struct({
    ViolationTarget: S.optional(S.String),
    ViolationTargetDescription: S.optional(S.String),
  }),
).annotations({
  identifier: "DnsDuplicateRuleGroupViolation",
}) as any as S.Schema<DnsDuplicateRuleGroupViolation>;
export interface DnsRuleGroupLimitExceededViolation {
  ViolationTarget?: string;
  ViolationTargetDescription?: string;
  NumberOfRuleGroupsAlreadyAssociated?: number;
}
export const DnsRuleGroupLimitExceededViolation = S.suspend(() =>
  S.Struct({
    ViolationTarget: S.optional(S.String),
    ViolationTargetDescription: S.optional(S.String),
    NumberOfRuleGroupsAlreadyAssociated: S.optional(S.Number),
  }),
).annotations({
  identifier: "DnsRuleGroupLimitExceededViolation",
}) as any as S.Schema<DnsRuleGroupLimitExceededViolation>;
export interface FirewallSubnetIsOutOfScopeViolation {
  FirewallSubnetId?: string;
  VpcId?: string;
  SubnetAvailabilityZone?: string;
  SubnetAvailabilityZoneId?: string;
  VpcEndpointId?: string;
}
export const FirewallSubnetIsOutOfScopeViolation = S.suspend(() =>
  S.Struct({
    FirewallSubnetId: S.optional(S.String),
    VpcId: S.optional(S.String),
    SubnetAvailabilityZone: S.optional(S.String),
    SubnetAvailabilityZoneId: S.optional(S.String),
    VpcEndpointId: S.optional(S.String),
  }),
).annotations({
  identifier: "FirewallSubnetIsOutOfScopeViolation",
}) as any as S.Schema<FirewallSubnetIsOutOfScopeViolation>;
export interface RouteHasOutOfScopeEndpointViolation {
  SubnetId?: string;
  VpcId?: string;
  RouteTableId?: string;
  ViolatingRoutes?: Routes;
  SubnetAvailabilityZone?: string;
  SubnetAvailabilityZoneId?: string;
  CurrentFirewallSubnetRouteTable?: string;
  FirewallSubnetId?: string;
  FirewallSubnetRoutes?: Routes;
  InternetGatewayId?: string;
  CurrentInternetGatewayRouteTable?: string;
  InternetGatewayRoutes?: Routes;
}
export const RouteHasOutOfScopeEndpointViolation = S.suspend(() =>
  S.Struct({
    SubnetId: S.optional(S.String),
    VpcId: S.optional(S.String),
    RouteTableId: S.optional(S.String),
    ViolatingRoutes: S.optional(Routes),
    SubnetAvailabilityZone: S.optional(S.String),
    SubnetAvailabilityZoneId: S.optional(S.String),
    CurrentFirewallSubnetRouteTable: S.optional(S.String),
    FirewallSubnetId: S.optional(S.String),
    FirewallSubnetRoutes: S.optional(Routes),
    InternetGatewayId: S.optional(S.String),
    CurrentInternetGatewayRouteTable: S.optional(S.String),
    InternetGatewayRoutes: S.optional(Routes),
  }),
).annotations({
  identifier: "RouteHasOutOfScopeEndpointViolation",
}) as any as S.Schema<RouteHasOutOfScopeEndpointViolation>;
export interface ThirdPartyFirewallMissingFirewallViolation {
  ViolationTarget?: string;
  VPC?: string;
  AvailabilityZone?: string;
  TargetViolationReason?: string;
}
export const ThirdPartyFirewallMissingFirewallViolation = S.suspend(() =>
  S.Struct({
    ViolationTarget: S.optional(S.String),
    VPC: S.optional(S.String),
    AvailabilityZone: S.optional(S.String),
    TargetViolationReason: S.optional(S.String),
  }),
).annotations({
  identifier: "ThirdPartyFirewallMissingFirewallViolation",
}) as any as S.Schema<ThirdPartyFirewallMissingFirewallViolation>;
export interface ThirdPartyFirewallMissingSubnetViolation {
  ViolationTarget?: string;
  VPC?: string;
  AvailabilityZone?: string;
  TargetViolationReason?: string;
}
export const ThirdPartyFirewallMissingSubnetViolation = S.suspend(() =>
  S.Struct({
    ViolationTarget: S.optional(S.String),
    VPC: S.optional(S.String),
    AvailabilityZone: S.optional(S.String),
    TargetViolationReason: S.optional(S.String),
  }),
).annotations({
  identifier: "ThirdPartyFirewallMissingSubnetViolation",
}) as any as S.Schema<ThirdPartyFirewallMissingSubnetViolation>;
export interface ThirdPartyFirewallMissingExpectedRouteTableViolation {
  ViolationTarget?: string;
  VPC?: string;
  AvailabilityZone?: string;
  CurrentRouteTable?: string;
  ExpectedRouteTable?: string;
}
export const ThirdPartyFirewallMissingExpectedRouteTableViolation = S.suspend(
  () =>
    S.Struct({
      ViolationTarget: S.optional(S.String),
      VPC: S.optional(S.String),
      AvailabilityZone: S.optional(S.String),
      CurrentRouteTable: S.optional(S.String),
      ExpectedRouteTable: S.optional(S.String),
    }),
).annotations({
  identifier: "ThirdPartyFirewallMissingExpectedRouteTableViolation",
}) as any as S.Schema<ThirdPartyFirewallMissingExpectedRouteTableViolation>;
export interface FirewallSubnetMissingVPCEndpointViolation {
  FirewallSubnetId?: string;
  VpcId?: string;
  SubnetAvailabilityZone?: string;
  SubnetAvailabilityZoneId?: string;
}
export const FirewallSubnetMissingVPCEndpointViolation = S.suspend(() =>
  S.Struct({
    FirewallSubnetId: S.optional(S.String),
    VpcId: S.optional(S.String),
    SubnetAvailabilityZone: S.optional(S.String),
    SubnetAvailabilityZoneId: S.optional(S.String),
  }),
).annotations({
  identifier: "FirewallSubnetMissingVPCEndpointViolation",
}) as any as S.Schema<FirewallSubnetMissingVPCEndpointViolation>;
export interface WebACLHasIncompatibleConfigurationViolation {
  WebACLArn?: string;
  Description?: string;
}
export const WebACLHasIncompatibleConfigurationViolation = S.suspend(() =>
  S.Struct({
    WebACLArn: S.optional(S.String),
    Description: S.optional(S.String),
  }),
).annotations({
  identifier: "WebACLHasIncompatibleConfigurationViolation",
}) as any as S.Schema<WebACLHasIncompatibleConfigurationViolation>;
export interface WebACLHasOutOfScopeResourcesViolation {
  WebACLArn?: string;
  OutOfScopeResourceList?: ResourceArnList;
}
export const WebACLHasOutOfScopeResourcesViolation = S.suspend(() =>
  S.Struct({
    WebACLArn: S.optional(S.String),
    OutOfScopeResourceList: S.optional(ResourceArnList),
  }),
).annotations({
  identifier: "WebACLHasOutOfScopeResourcesViolation",
}) as any as S.Schema<WebACLHasOutOfScopeResourcesViolation>;
export type TargetViolationReasons = string[];
export const TargetViolationReasons = S.Array(S.String);
export type NetworkFirewallActionList = string[];
export const NetworkFirewallActionList = S.Array(S.String);
export interface EntryDescription {
  EntryDetail?: NetworkAclEntry;
  EntryRuleNumber?: number;
  EntryType?: string;
}
export const EntryDescription = S.suspend(() =>
  S.Struct({
    EntryDetail: S.optional(NetworkAclEntry),
    EntryRuleNumber: S.optional(S.Number),
    EntryType: S.optional(S.String),
  }),
).annotations({
  identifier: "EntryDescription",
}) as any as S.Schema<EntryDescription>;
export type EntriesWithConflicts = EntryDescription[];
export const EntriesWithConflicts = S.Array(EntryDescription);
export type EntryViolationReasons = string[];
export const EntryViolationReasons = S.Array(S.String);
export interface ListComplianceStatusResponse {
  PolicyComplianceStatusList?: PolicyComplianceStatusList;
  NextToken?: string;
}
export const ListComplianceStatusResponse = S.suspend(() =>
  S.Struct({
    PolicyComplianceStatusList: S.optional(PolicyComplianceStatusList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListComplianceStatusResponse",
}) as any as S.Schema<ListComplianceStatusResponse>;
export interface PutAppsListResponse {
  AppsList?: AppsListData;
  AppsListArn?: string;
}
export const PutAppsListResponse = S.suspend(() =>
  S.Struct({
    AppsList: S.optional(AppsListData),
    AppsListArn: S.optional(S.String),
  }),
).annotations({
  identifier: "PutAppsListResponse",
}) as any as S.Schema<PutAppsListResponse>;
export interface PutProtocolsListResponse {
  ProtocolsList?: ProtocolsListData;
  ProtocolsListArn?: string;
}
export const PutProtocolsListResponse = S.suspend(() =>
  S.Struct({
    ProtocolsList: S.optional(ProtocolsListData),
    ProtocolsListArn: S.optional(S.String),
  }),
).annotations({
  identifier: "PutProtocolsListResponse",
}) as any as S.Schema<PutProtocolsListResponse>;
export interface ComplianceViolator {
  ResourceId?: string;
  ViolationReason?: string;
  ResourceType?: string;
  Metadata?: ComplianceViolatorMetadata;
}
export const ComplianceViolator = S.suspend(() =>
  S.Struct({
    ResourceId: S.optional(S.String),
    ViolationReason: S.optional(S.String),
    ResourceType: S.optional(S.String),
    Metadata: S.optional(ComplianceViolatorMetadata),
  }),
).annotations({
  identifier: "ComplianceViolator",
}) as any as S.Schema<ComplianceViolator>;
export type ComplianceViolators = ComplianceViolator[];
export const ComplianceViolators = S.Array(ComplianceViolator);
export interface PartialMatch {
  Reference?: string;
  TargetViolationReasons?: TargetViolationReasons;
}
export const PartialMatch = S.suspend(() =>
  S.Struct({
    Reference: S.optional(S.String),
    TargetViolationReasons: S.optional(TargetViolationReasons),
  }),
).annotations({ identifier: "PartialMatch" }) as any as S.Schema<PartialMatch>;
export type PartialMatches = PartialMatch[];
export const PartialMatches = S.Array(PartialMatch);
export interface PolicyComplianceDetail {
  PolicyOwner?: string;
  PolicyId?: string;
  MemberAccount?: string;
  Violators?: ComplianceViolators;
  EvaluationLimitExceeded?: boolean;
  ExpiredAt?: Date;
  IssueInfoMap?: IssueInfoMap;
}
export const PolicyComplianceDetail = S.suspend(() =>
  S.Struct({
    PolicyOwner: S.optional(S.String),
    PolicyId: S.optional(S.String),
    MemberAccount: S.optional(S.String),
    Violators: S.optional(ComplianceViolators),
    EvaluationLimitExceeded: S.optional(S.Boolean),
    ExpiredAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    IssueInfoMap: S.optional(IssueInfoMap),
  }),
).annotations({
  identifier: "PolicyComplianceDetail",
}) as any as S.Schema<PolicyComplianceDetail>;
export interface NetworkFirewallInternetTrafficNotInspectedViolation {
  SubnetId?: string;
  SubnetAvailabilityZone?: string;
  RouteTableId?: string;
  ViolatingRoutes?: Routes;
  IsRouteTableUsedInDifferentAZ?: boolean;
  CurrentFirewallSubnetRouteTable?: string;
  ExpectedFirewallEndpoint?: string;
  FirewallSubnetId?: string;
  ExpectedFirewallSubnetRoutes?: ExpectedRoutes;
  ActualFirewallSubnetRoutes?: Routes;
  InternetGatewayId?: string;
  CurrentInternetGatewayRouteTable?: string;
  ExpectedInternetGatewayRoutes?: ExpectedRoutes;
  ActualInternetGatewayRoutes?: Routes;
  VpcId?: string;
}
export const NetworkFirewallInternetTrafficNotInspectedViolation = S.suspend(
  () =>
    S.Struct({
      SubnetId: S.optional(S.String),
      SubnetAvailabilityZone: S.optional(S.String),
      RouteTableId: S.optional(S.String),
      ViolatingRoutes: S.optional(Routes),
      IsRouteTableUsedInDifferentAZ: S.optional(S.Boolean),
      CurrentFirewallSubnetRouteTable: S.optional(S.String),
      ExpectedFirewallEndpoint: S.optional(S.String),
      FirewallSubnetId: S.optional(S.String),
      ExpectedFirewallSubnetRoutes: S.optional(ExpectedRoutes),
      ActualFirewallSubnetRoutes: S.optional(Routes),
      InternetGatewayId: S.optional(S.String),
      CurrentInternetGatewayRouteTable: S.optional(S.String),
      ExpectedInternetGatewayRoutes: S.optional(ExpectedRoutes),
      ActualInternetGatewayRoutes: S.optional(Routes),
      VpcId: S.optional(S.String),
    }),
).annotations({
  identifier: "NetworkFirewallInternetTrafficNotInspectedViolation",
}) as any as S.Schema<NetworkFirewallInternetTrafficNotInspectedViolation>;
export interface GetComplianceDetailResponse {
  PolicyComplianceDetail?: PolicyComplianceDetail;
}
export const GetComplianceDetailResponse = S.suspend(() =>
  S.Struct({ PolicyComplianceDetail: S.optional(PolicyComplianceDetail) }),
).annotations({
  identifier: "GetComplianceDetailResponse",
}) as any as S.Schema<GetComplianceDetailResponse>;
export interface SecurityGroupRuleDescription {
  IPV4Range?: string;
  IPV6Range?: string;
  PrefixListId?: string;
  Protocol?: string;
  FromPort?: number;
  ToPort?: number;
}
export const SecurityGroupRuleDescription = S.suspend(() =>
  S.Struct({
    IPV4Range: S.optional(S.String),
    IPV6Range: S.optional(S.String),
    PrefixListId: S.optional(S.String),
    Protocol: S.optional(S.String),
    FromPort: S.optional(S.Number),
    ToPort: S.optional(S.Number),
  }),
).annotations({
  identifier: "SecurityGroupRuleDescription",
}) as any as S.Schema<SecurityGroupRuleDescription>;
export interface StatelessRuleGroup {
  RuleGroupName?: string;
  ResourceId?: string;
  Priority?: number;
}
export const StatelessRuleGroup = S.suspend(() =>
  S.Struct({
    RuleGroupName: S.optional(S.String),
    ResourceId: S.optional(S.String),
    Priority: S.optional(S.Number),
  }),
).annotations({
  identifier: "StatelessRuleGroup",
}) as any as S.Schema<StatelessRuleGroup>;
export type StatelessRuleGroupList = StatelessRuleGroup[];
export const StatelessRuleGroupList = S.Array(StatelessRuleGroup);
export interface StatefulEngineOptions {
  RuleOrder?: string;
  StreamExceptionPolicy?: string;
}
export const StatefulEngineOptions = S.suspend(() =>
  S.Struct({
    RuleOrder: S.optional(S.String),
    StreamExceptionPolicy: S.optional(S.String),
  }),
).annotations({
  identifier: "StatefulEngineOptions",
}) as any as S.Schema<StatefulEngineOptions>;
export interface SecurityGroupRemediationAction {
  RemediationActionType?: string;
  Description?: string;
  RemediationResult?: SecurityGroupRuleDescription;
  IsDefaultAction?: boolean;
}
export const SecurityGroupRemediationAction = S.suspend(() =>
  S.Struct({
    RemediationActionType: S.optional(S.String),
    Description: S.optional(S.String),
    RemediationResult: S.optional(SecurityGroupRuleDescription),
    IsDefaultAction: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SecurityGroupRemediationAction",
}) as any as S.Schema<SecurityGroupRemediationAction>;
export type SecurityGroupRemediationActions = SecurityGroupRemediationAction[];
export const SecurityGroupRemediationActions = S.Array(
  SecurityGroupRemediationAction,
);
export interface EntryViolation {
  ExpectedEntry?: EntryDescription;
  ExpectedEvaluationOrder?: string;
  ActualEvaluationOrder?: string;
  EntryAtExpectedEvaluationOrder?: EntryDescription;
  EntriesWithConflicts?: EntriesWithConflicts;
  EntryViolationReasons?: EntryViolationReasons;
}
export const EntryViolation = S.suspend(() =>
  S.Struct({
    ExpectedEntry: S.optional(EntryDescription),
    ExpectedEvaluationOrder: S.optional(S.String),
    ActualEvaluationOrder: S.optional(S.String),
    EntryAtExpectedEvaluationOrder: S.optional(EntryDescription),
    EntriesWithConflicts: S.optional(EntriesWithConflicts),
    EntryViolationReasons: S.optional(EntryViolationReasons),
  }),
).annotations({
  identifier: "EntryViolation",
}) as any as S.Schema<EntryViolation>;
export type EntryViolations = EntryViolation[];
export const EntryViolations = S.Array(EntryViolation);
export interface NetworkFirewallStatefulRuleGroupOverride {
  Action?: string;
}
export const NetworkFirewallStatefulRuleGroupOverride = S.suspend(() =>
  S.Struct({ Action: S.optional(S.String) }),
).annotations({
  identifier: "NetworkFirewallStatefulRuleGroupOverride",
}) as any as S.Schema<NetworkFirewallStatefulRuleGroupOverride>;
export interface AwsVPCSecurityGroupViolation {
  ViolationTarget?: string;
  ViolationTargetDescription?: string;
  PartialMatches?: PartialMatches;
  PossibleSecurityGroupRemediationActions?: SecurityGroupRemediationActions;
}
export const AwsVPCSecurityGroupViolation = S.suspend(() =>
  S.Struct({
    ViolationTarget: S.optional(S.String),
    ViolationTargetDescription: S.optional(S.String),
    PartialMatches: S.optional(PartialMatches),
    PossibleSecurityGroupRemediationActions: S.optional(
      SecurityGroupRemediationActions,
    ),
  }),
).annotations({
  identifier: "AwsVPCSecurityGroupViolation",
}) as any as S.Schema<AwsVPCSecurityGroupViolation>;
export interface InvalidNetworkAclEntriesViolation {
  Vpc?: string;
  Subnet?: string;
  SubnetAvailabilityZone?: string;
  CurrentAssociatedNetworkAcl?: string;
  EntryViolations?: EntryViolations;
}
export const InvalidNetworkAclEntriesViolation = S.suspend(() =>
  S.Struct({
    Vpc: S.optional(S.String),
    Subnet: S.optional(S.String),
    SubnetAvailabilityZone: S.optional(S.String),
    CurrentAssociatedNetworkAcl: S.optional(S.String),
    EntryViolations: S.optional(EntryViolations),
  }),
).annotations({
  identifier: "InvalidNetworkAclEntriesViolation",
}) as any as S.Schema<InvalidNetworkAclEntriesViolation>;
export type EntriesDescription = EntryDescription[];
export const EntriesDescription = S.Array(EntryDescription);
export interface StatefulRuleGroup {
  RuleGroupName?: string;
  ResourceId?: string;
  Priority?: number;
  Override?: NetworkFirewallStatefulRuleGroupOverride;
}
export const StatefulRuleGroup = S.suspend(() =>
  S.Struct({
    RuleGroupName: S.optional(S.String),
    ResourceId: S.optional(S.String),
    Priority: S.optional(S.Number),
    Override: S.optional(NetworkFirewallStatefulRuleGroupOverride),
  }),
).annotations({
  identifier: "StatefulRuleGroup",
}) as any as S.Schema<StatefulRuleGroup>;
export type StatefulRuleGroupList = StatefulRuleGroup[];
export const StatefulRuleGroupList = S.Array(StatefulRuleGroup);
export interface ActionTarget {
  ResourceId?: string;
  Description?: string;
}
export const ActionTarget = S.suspend(() =>
  S.Struct({
    ResourceId: S.optional(S.String),
    Description: S.optional(S.String),
  }),
).annotations({ identifier: "ActionTarget" }) as any as S.Schema<ActionTarget>;
export interface EC2ReplaceRouteAction {
  Description?: string;
  DestinationCidrBlock?: string;
  DestinationPrefixListId?: string;
  DestinationIpv6CidrBlock?: string;
  GatewayId?: ActionTarget;
  RouteTableId: ActionTarget;
}
export const EC2ReplaceRouteAction = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    DestinationCidrBlock: S.optional(S.String),
    DestinationPrefixListId: S.optional(S.String),
    DestinationIpv6CidrBlock: S.optional(S.String),
    GatewayId: S.optional(ActionTarget),
    RouteTableId: ActionTarget,
  }),
).annotations({
  identifier: "EC2ReplaceRouteAction",
}) as any as S.Schema<EC2ReplaceRouteAction>;
export interface EC2DeleteRouteAction {
  Description?: string;
  DestinationCidrBlock?: string;
  DestinationPrefixListId?: string;
  DestinationIpv6CidrBlock?: string;
  RouteTableId: ActionTarget;
}
export const EC2DeleteRouteAction = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    DestinationCidrBlock: S.optional(S.String),
    DestinationPrefixListId: S.optional(S.String),
    DestinationIpv6CidrBlock: S.optional(S.String),
    RouteTableId: ActionTarget,
  }),
).annotations({
  identifier: "EC2DeleteRouteAction",
}) as any as S.Schema<EC2DeleteRouteAction>;
export interface EC2CopyRouteTableAction {
  Description?: string;
  VpcId: ActionTarget;
  RouteTableId: ActionTarget;
}
export const EC2CopyRouteTableAction = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    VpcId: ActionTarget,
    RouteTableId: ActionTarget,
  }),
).annotations({
  identifier: "EC2CopyRouteTableAction",
}) as any as S.Schema<EC2CopyRouteTableAction>;
export interface EC2ReplaceRouteTableAssociationAction {
  Description?: string;
  AssociationId: ActionTarget;
  RouteTableId: ActionTarget;
}
export const EC2ReplaceRouteTableAssociationAction = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    AssociationId: ActionTarget,
    RouteTableId: ActionTarget,
  }),
).annotations({
  identifier: "EC2ReplaceRouteTableAssociationAction",
}) as any as S.Schema<EC2ReplaceRouteTableAssociationAction>;
export interface EC2AssociateRouteTableAction {
  Description?: string;
  RouteTableId: ActionTarget;
  SubnetId?: ActionTarget;
  GatewayId?: ActionTarget;
}
export const EC2AssociateRouteTableAction = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    RouteTableId: ActionTarget,
    SubnetId: S.optional(ActionTarget),
    GatewayId: S.optional(ActionTarget),
  }),
).annotations({
  identifier: "EC2AssociateRouteTableAction",
}) as any as S.Schema<EC2AssociateRouteTableAction>;
export interface EC2CreateRouteTableAction {
  Description?: string;
  VpcId: ActionTarget;
}
export const EC2CreateRouteTableAction = S.suspend(() =>
  S.Struct({ Description: S.optional(S.String), VpcId: ActionTarget }),
).annotations({
  identifier: "EC2CreateRouteTableAction",
}) as any as S.Schema<EC2CreateRouteTableAction>;
export interface FMSPolicyUpdateFirewallCreationConfigAction {
  Description?: string;
  FirewallCreationConfig?: string;
}
export const FMSPolicyUpdateFirewallCreationConfigAction = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    FirewallCreationConfig: S.optional(S.String),
  }),
).annotations({
  identifier: "FMSPolicyUpdateFirewallCreationConfigAction",
}) as any as S.Schema<FMSPolicyUpdateFirewallCreationConfigAction>;
export interface CreateNetworkAclAction {
  Description?: string;
  Vpc?: ActionTarget;
  FMSCanRemediate?: boolean;
}
export const CreateNetworkAclAction = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    Vpc: S.optional(ActionTarget),
    FMSCanRemediate: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CreateNetworkAclAction",
}) as any as S.Schema<CreateNetworkAclAction>;
export interface ReplaceNetworkAclAssociationAction {
  Description?: string;
  AssociationId?: ActionTarget;
  NetworkAclId?: ActionTarget;
  FMSCanRemediate?: boolean;
}
export const ReplaceNetworkAclAssociationAction = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    AssociationId: S.optional(ActionTarget),
    NetworkAclId: S.optional(ActionTarget),
    FMSCanRemediate: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ReplaceNetworkAclAssociationAction",
}) as any as S.Schema<ReplaceNetworkAclAssociationAction>;
export interface CreateNetworkAclEntriesAction {
  Description?: string;
  NetworkAclId?: ActionTarget;
  NetworkAclEntriesToBeCreated?: EntriesDescription;
  FMSCanRemediate?: boolean;
}
export const CreateNetworkAclEntriesAction = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    NetworkAclId: S.optional(ActionTarget),
    NetworkAclEntriesToBeCreated: S.optional(EntriesDescription),
    FMSCanRemediate: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CreateNetworkAclEntriesAction",
}) as any as S.Schema<CreateNetworkAclEntriesAction>;
export interface DeleteNetworkAclEntriesAction {
  Description?: string;
  NetworkAclId?: ActionTarget;
  NetworkAclEntriesToBeDeleted?: EntriesDescription;
  FMSCanRemediate?: boolean;
}
export const DeleteNetworkAclEntriesAction = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    NetworkAclId: S.optional(ActionTarget),
    NetworkAclEntriesToBeDeleted: S.optional(EntriesDescription),
    FMSCanRemediate: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DeleteNetworkAclEntriesAction",
}) as any as S.Schema<DeleteNetworkAclEntriesAction>;
export interface NetworkFirewallPolicyDescription {
  StatelessRuleGroups?: StatelessRuleGroupList;
  StatelessDefaultActions?: NetworkFirewallActionList;
  StatelessFragmentDefaultActions?: NetworkFirewallActionList;
  StatelessCustomActions?: NetworkFirewallActionList;
  StatefulRuleGroups?: StatefulRuleGroupList;
  StatefulDefaultActions?: NetworkFirewallActionList;
  StatefulEngineOptions?: StatefulEngineOptions;
}
export const NetworkFirewallPolicyDescription = S.suspend(() =>
  S.Struct({
    StatelessRuleGroups: S.optional(StatelessRuleGroupList),
    StatelessDefaultActions: S.optional(NetworkFirewallActionList),
    StatelessFragmentDefaultActions: S.optional(NetworkFirewallActionList),
    StatelessCustomActions: S.optional(NetworkFirewallActionList),
    StatefulRuleGroups: S.optional(StatefulRuleGroupList),
    StatefulDefaultActions: S.optional(NetworkFirewallActionList),
    StatefulEngineOptions: S.optional(StatefulEngineOptions),
  }),
).annotations({
  identifier: "NetworkFirewallPolicyDescription",
}) as any as S.Schema<NetworkFirewallPolicyDescription>;
export interface NetworkFirewallPolicyModifiedViolation {
  ViolationTarget?: string;
  CurrentPolicyDescription?: NetworkFirewallPolicyDescription;
  ExpectedPolicyDescription?: NetworkFirewallPolicyDescription;
}
export const NetworkFirewallPolicyModifiedViolation = S.suspend(() =>
  S.Struct({
    ViolationTarget: S.optional(S.String),
    CurrentPolicyDescription: S.optional(NetworkFirewallPolicyDescription),
    ExpectedPolicyDescription: S.optional(NetworkFirewallPolicyDescription),
  }),
).annotations({
  identifier: "NetworkFirewallPolicyModifiedViolation",
}) as any as S.Schema<NetworkFirewallPolicyModifiedViolation>;
export interface EC2CreateRouteAction {
  Description?: string;
  DestinationCidrBlock?: string;
  DestinationPrefixListId?: string;
  DestinationIpv6CidrBlock?: string;
  VpcEndpointId?: ActionTarget;
  GatewayId?: ActionTarget;
  RouteTableId: ActionTarget;
}
export const EC2CreateRouteAction = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    DestinationCidrBlock: S.optional(S.String),
    DestinationPrefixListId: S.optional(S.String),
    DestinationIpv6CidrBlock: S.optional(S.String),
    VpcEndpointId: S.optional(ActionTarget),
    GatewayId: S.optional(ActionTarget),
    RouteTableId: ActionTarget,
  }),
).annotations({
  identifier: "EC2CreateRouteAction",
}) as any as S.Schema<EC2CreateRouteAction>;
export interface RemediationAction {
  Description?: string;
  EC2CreateRouteAction?: EC2CreateRouteAction;
  EC2ReplaceRouteAction?: EC2ReplaceRouteAction;
  EC2DeleteRouteAction?: EC2DeleteRouteAction;
  EC2CopyRouteTableAction?: EC2CopyRouteTableAction;
  EC2ReplaceRouteTableAssociationAction?: EC2ReplaceRouteTableAssociationAction;
  EC2AssociateRouteTableAction?: EC2AssociateRouteTableAction;
  EC2CreateRouteTableAction?: EC2CreateRouteTableAction;
  FMSPolicyUpdateFirewallCreationConfigAction?: FMSPolicyUpdateFirewallCreationConfigAction;
  CreateNetworkAclAction?: CreateNetworkAclAction;
  ReplaceNetworkAclAssociationAction?: ReplaceNetworkAclAssociationAction;
  CreateNetworkAclEntriesAction?: CreateNetworkAclEntriesAction;
  DeleteNetworkAclEntriesAction?: DeleteNetworkAclEntriesAction;
}
export const RemediationAction = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    EC2CreateRouteAction: S.optional(EC2CreateRouteAction),
    EC2ReplaceRouteAction: S.optional(EC2ReplaceRouteAction),
    EC2DeleteRouteAction: S.optional(EC2DeleteRouteAction),
    EC2CopyRouteTableAction: S.optional(EC2CopyRouteTableAction),
    EC2ReplaceRouteTableAssociationAction: S.optional(
      EC2ReplaceRouteTableAssociationAction,
    ),
    EC2AssociateRouteTableAction: S.optional(EC2AssociateRouteTableAction),
    EC2CreateRouteTableAction: S.optional(EC2CreateRouteTableAction),
    FMSPolicyUpdateFirewallCreationConfigAction: S.optional(
      FMSPolicyUpdateFirewallCreationConfigAction,
    ),
    CreateNetworkAclAction: S.optional(CreateNetworkAclAction),
    ReplaceNetworkAclAssociationAction: S.optional(
      ReplaceNetworkAclAssociationAction,
    ),
    CreateNetworkAclEntriesAction: S.optional(CreateNetworkAclEntriesAction),
    DeleteNetworkAclEntriesAction: S.optional(DeleteNetworkAclEntriesAction),
  }),
).annotations({
  identifier: "RemediationAction",
}) as any as S.Schema<RemediationAction>;
export interface RemediationActionWithOrder {
  RemediationAction?: RemediationAction;
  Order?: number;
}
export const RemediationActionWithOrder = S.suspend(() =>
  S.Struct({
    RemediationAction: S.optional(RemediationAction),
    Order: S.optional(S.Number),
  }),
).annotations({
  identifier: "RemediationActionWithOrder",
}) as any as S.Schema<RemediationActionWithOrder>;
export type OrderedRemediationActions = RemediationActionWithOrder[];
export const OrderedRemediationActions = S.Array(RemediationActionWithOrder);
export interface PutPolicyRequest {
  Policy: Policy;
  TagList?: TagList;
}
export const PutPolicyRequest = S.suspend(() =>
  S.Struct({ Policy: Policy, TagList: S.optional(TagList) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutPolicyRequest",
}) as any as S.Schema<PutPolicyRequest>;
export interface PossibleRemediationAction {
  Description?: string;
  OrderedRemediationActions: OrderedRemediationActions;
  IsDefaultAction?: boolean;
}
export const PossibleRemediationAction = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    OrderedRemediationActions: OrderedRemediationActions,
    IsDefaultAction: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "PossibleRemediationAction",
}) as any as S.Schema<PossibleRemediationAction>;
export type PossibleRemediationActionList = PossibleRemediationAction[];
export const PossibleRemediationActionList = S.Array(PossibleRemediationAction);
export interface PossibleRemediationActions {
  Description?: string;
  Actions?: PossibleRemediationActionList;
}
export const PossibleRemediationActions = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    Actions: S.optional(PossibleRemediationActionList),
  }),
).annotations({
  identifier: "PossibleRemediationActions",
}) as any as S.Schema<PossibleRemediationActions>;
export interface PutPolicyResponse {
  Policy?: Policy;
  PolicyArn?: string;
}
export const PutPolicyResponse = S.suspend(() =>
  S.Struct({ Policy: S.optional(Policy), PolicyArn: S.optional(S.String) }),
).annotations({
  identifier: "PutPolicyResponse",
}) as any as S.Schema<PutPolicyResponse>;
export interface ResourceViolation {
  AwsVPCSecurityGroupViolation?: AwsVPCSecurityGroupViolation;
  AwsEc2NetworkInterfaceViolation?: AwsEc2NetworkInterfaceViolation;
  AwsEc2InstanceViolation?: AwsEc2InstanceViolation;
  NetworkFirewallMissingFirewallViolation?: NetworkFirewallMissingFirewallViolation;
  NetworkFirewallMissingSubnetViolation?: NetworkFirewallMissingSubnetViolation;
  NetworkFirewallMissingExpectedRTViolation?: NetworkFirewallMissingExpectedRTViolation;
  NetworkFirewallPolicyModifiedViolation?: NetworkFirewallPolicyModifiedViolation;
  NetworkFirewallInternetTrafficNotInspectedViolation?: NetworkFirewallInternetTrafficNotInspectedViolation;
  NetworkFirewallInvalidRouteConfigurationViolation?: NetworkFirewallInvalidRouteConfigurationViolation;
  NetworkFirewallBlackHoleRouteDetectedViolation?: NetworkFirewallBlackHoleRouteDetectedViolation;
  NetworkFirewallUnexpectedFirewallRoutesViolation?: NetworkFirewallUnexpectedFirewallRoutesViolation;
  NetworkFirewallUnexpectedGatewayRoutesViolation?: NetworkFirewallUnexpectedGatewayRoutesViolation;
  NetworkFirewallMissingExpectedRoutesViolation?: NetworkFirewallMissingExpectedRoutesViolation;
  DnsRuleGroupPriorityConflictViolation?: DnsRuleGroupPriorityConflictViolation;
  DnsDuplicateRuleGroupViolation?: DnsDuplicateRuleGroupViolation;
  DnsRuleGroupLimitExceededViolation?: DnsRuleGroupLimitExceededViolation;
  FirewallSubnetIsOutOfScopeViolation?: FirewallSubnetIsOutOfScopeViolation;
  RouteHasOutOfScopeEndpointViolation?: RouteHasOutOfScopeEndpointViolation;
  ThirdPartyFirewallMissingFirewallViolation?: ThirdPartyFirewallMissingFirewallViolation;
  ThirdPartyFirewallMissingSubnetViolation?: ThirdPartyFirewallMissingSubnetViolation;
  ThirdPartyFirewallMissingExpectedRouteTableViolation?: ThirdPartyFirewallMissingExpectedRouteTableViolation;
  FirewallSubnetMissingVPCEndpointViolation?: FirewallSubnetMissingVPCEndpointViolation;
  InvalidNetworkAclEntriesViolation?: InvalidNetworkAclEntriesViolation;
  PossibleRemediationActions?: PossibleRemediationActions;
  WebACLHasIncompatibleConfigurationViolation?: WebACLHasIncompatibleConfigurationViolation;
  WebACLHasOutOfScopeResourcesViolation?: WebACLHasOutOfScopeResourcesViolation;
}
export const ResourceViolation = S.suspend(() =>
  S.Struct({
    AwsVPCSecurityGroupViolation: S.optional(AwsVPCSecurityGroupViolation),
    AwsEc2NetworkInterfaceViolation: S.optional(
      AwsEc2NetworkInterfaceViolation,
    ),
    AwsEc2InstanceViolation: S.optional(AwsEc2InstanceViolation),
    NetworkFirewallMissingFirewallViolation: S.optional(
      NetworkFirewallMissingFirewallViolation,
    ),
    NetworkFirewallMissingSubnetViolation: S.optional(
      NetworkFirewallMissingSubnetViolation,
    ),
    NetworkFirewallMissingExpectedRTViolation: S.optional(
      NetworkFirewallMissingExpectedRTViolation,
    ),
    NetworkFirewallPolicyModifiedViolation: S.optional(
      NetworkFirewallPolicyModifiedViolation,
    ),
    NetworkFirewallInternetTrafficNotInspectedViolation: S.optional(
      NetworkFirewallInternetTrafficNotInspectedViolation,
    ),
    NetworkFirewallInvalidRouteConfigurationViolation: S.optional(
      NetworkFirewallInvalidRouteConfigurationViolation,
    ),
    NetworkFirewallBlackHoleRouteDetectedViolation: S.optional(
      NetworkFirewallBlackHoleRouteDetectedViolation,
    ),
    NetworkFirewallUnexpectedFirewallRoutesViolation: S.optional(
      NetworkFirewallUnexpectedFirewallRoutesViolation,
    ),
    NetworkFirewallUnexpectedGatewayRoutesViolation: S.optional(
      NetworkFirewallUnexpectedGatewayRoutesViolation,
    ),
    NetworkFirewallMissingExpectedRoutesViolation: S.optional(
      NetworkFirewallMissingExpectedRoutesViolation,
    ),
    DnsRuleGroupPriorityConflictViolation: S.optional(
      DnsRuleGroupPriorityConflictViolation,
    ),
    DnsDuplicateRuleGroupViolation: S.optional(DnsDuplicateRuleGroupViolation),
    DnsRuleGroupLimitExceededViolation: S.optional(
      DnsRuleGroupLimitExceededViolation,
    ),
    FirewallSubnetIsOutOfScopeViolation: S.optional(
      FirewallSubnetIsOutOfScopeViolation,
    ),
    RouteHasOutOfScopeEndpointViolation: S.optional(
      RouteHasOutOfScopeEndpointViolation,
    ),
    ThirdPartyFirewallMissingFirewallViolation: S.optional(
      ThirdPartyFirewallMissingFirewallViolation,
    ),
    ThirdPartyFirewallMissingSubnetViolation: S.optional(
      ThirdPartyFirewallMissingSubnetViolation,
    ),
    ThirdPartyFirewallMissingExpectedRouteTableViolation: S.optional(
      ThirdPartyFirewallMissingExpectedRouteTableViolation,
    ),
    FirewallSubnetMissingVPCEndpointViolation: S.optional(
      FirewallSubnetMissingVPCEndpointViolation,
    ),
    InvalidNetworkAclEntriesViolation: S.optional(
      InvalidNetworkAclEntriesViolation,
    ),
    PossibleRemediationActions: S.optional(PossibleRemediationActions),
    WebACLHasIncompatibleConfigurationViolation: S.optional(
      WebACLHasIncompatibleConfigurationViolation,
    ),
    WebACLHasOutOfScopeResourcesViolation: S.optional(
      WebACLHasOutOfScopeResourcesViolation,
    ),
  }),
).annotations({
  identifier: "ResourceViolation",
}) as any as S.Schema<ResourceViolation>;
export type ResourceViolations = ResourceViolation[];
export const ResourceViolations = S.Array(ResourceViolation);
export interface ViolationDetail {
  PolicyId: string;
  MemberAccount: string;
  ResourceId: string;
  ResourceType: string;
  ResourceViolations: ResourceViolations;
  ResourceTags?: TagList;
  ResourceDescription?: string;
}
export const ViolationDetail = S.suspend(() =>
  S.Struct({
    PolicyId: S.String,
    MemberAccount: S.String,
    ResourceId: S.String,
    ResourceType: S.String,
    ResourceViolations: ResourceViolations,
    ResourceTags: S.optional(TagList),
    ResourceDescription: S.optional(S.String),
  }),
).annotations({
  identifier: "ViolationDetail",
}) as any as S.Schema<ViolationDetail>;
export interface GetViolationDetailsResponse {
  ViolationDetail?: ViolationDetail;
}
export const GetViolationDetailsResponse = S.suspend(() =>
  S.Struct({ ViolationDetail: S.optional(ViolationDetail) }),
).annotations({
  identifier: "GetViolationDetailsResponse",
}) as any as S.Schema<GetViolationDetailsResponse>;

//# Errors
export class InternalErrorException extends S.TaggedError<InternalErrorException>()(
  "InternalErrorException",
  { Message: S.optional(S.String) },
) {}
export class InvalidOperationException extends S.TaggedError<InvalidOperationException>()(
  "InvalidOperationException",
  { Message: S.optional(S.String) },
) {}
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class InvalidTypeException extends S.TaggedError<InvalidTypeException>()(
  "InvalidTypeException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes an Firewall Manager association with the IAM role and the Amazon Simple
 * Notification Service (SNS) topic that is used to record Firewall Manager SNS logs.
 */
export const deleteNotificationChannel: (
  input: DeleteNotificationChannelRequest,
) => Effect.Effect<
  DeleteNotificationChannelResponse,
  | InternalErrorException
  | InvalidOperationException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNotificationChannelRequest,
  output: DeleteNotificationChannelResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Permanently deletes an Firewall Manager policy.
 */
export const deletePolicy: (
  input: DeletePolicyRequest,
) => Effect.Effect<
  DeletePolicyResponse,
  | InternalErrorException
  | InvalidInputException
  | InvalidOperationException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePolicyRequest,
  output: DeletePolicyResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns information about the specified Firewall Manager policy.
 */
export const getPolicy: (
  input: GetPolicyRequest,
) => Effect.Effect<
  GetPolicyResponse,
  | InternalErrorException
  | InvalidOperationException
  | InvalidTypeException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyRequest,
  output: GetPolicyResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    InvalidTypeException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a `AdminAccounts` object that lists the Firewall Manager administrators within the organization that are onboarded to Firewall Manager by AssociateAdminAccount.
 *
 * This operation can be called only from the organization's management account.
 */
export const listAdminAccountsForOrganization: {
  (
    input: ListAdminAccountsForOrganizationRequest,
  ): Effect.Effect<
    ListAdminAccountsForOrganizationResponse,
    | InternalErrorException
    | InvalidOperationException
    | LimitExceededException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAdminAccountsForOrganizationRequest,
  ) => Stream.Stream<
    ListAdminAccountsForOrganizationResponse,
    | InternalErrorException
    | InvalidOperationException
    | LimitExceededException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAdminAccountsForOrganizationRequest,
  ) => Stream.Stream<
    AdminAccountSummary,
    | InternalErrorException
    | InvalidOperationException
    | LimitExceededException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAdminAccountsForOrganizationRequest,
  output: ListAdminAccountsForOrganizationResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AdminAccounts",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns an array of `AppsListDataSummary` objects.
 */
export const listAppsLists: {
  (
    input: ListAppsListsRequest,
  ): Effect.Effect<
    ListAppsListsResponse,
    | InternalErrorException
    | InvalidOperationException
    | LimitExceededException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAppsListsRequest,
  ) => Stream.Stream<
    ListAppsListsResponse,
    | InternalErrorException
    | InvalidOperationException
    | LimitExceededException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAppsListsRequest,
  ) => Stream.Stream<
    AppsListDataSummary,
    | InternalErrorException
    | InvalidOperationException
    | LimitExceededException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAppsListsRequest,
  output: ListAppsListsResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AppsLists",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns an array of resources in the organization's accounts that are available to be associated with a resource set.
 */
export const listDiscoveredResources: (
  input: ListDiscoveredResourcesRequest,
) => Effect.Effect<
  ListDiscoveredResourcesResponse,
  | InternalErrorException
  | InvalidInputException
  | InvalidOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDiscoveredResourcesRequest,
  output: ListDiscoveredResourcesResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
  ],
}));
/**
 * Returns an array of `PolicySummary` objects.
 */
export const listPolicies: {
  (
    input: ListPoliciesRequest,
  ): Effect.Effect<
    ListPoliciesResponse,
    | InternalErrorException
    | InvalidOperationException
    | LimitExceededException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPoliciesRequest,
  ) => Stream.Stream<
    ListPoliciesResponse,
    | InternalErrorException
    | InvalidOperationException
    | LimitExceededException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPoliciesRequest,
  ) => Stream.Stream<
    PolicySummary,
    | InternalErrorException
    | InvalidOperationException
    | LimitExceededException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPoliciesRequest,
  output: ListPoliciesResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "PolicyList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns an array of `ProtocolsListDataSummary` objects.
 */
export const listProtocolsLists: {
  (
    input: ListProtocolsListsRequest,
  ): Effect.Effect<
    ListProtocolsListsResponse,
    | InternalErrorException
    | InvalidOperationException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProtocolsListsRequest,
  ) => Stream.Stream<
    ListProtocolsListsResponse,
    | InternalErrorException
    | InvalidOperationException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProtocolsListsRequest,
  ) => Stream.Stream<
    ProtocolsListDataSummary,
    | InternalErrorException
    | InvalidOperationException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProtocolsListsRequest,
  output: ListProtocolsListsResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ProtocolsLists",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns an array of resources that are currently associated to a resource set.
 */
export const listResourceSetResources: (
  input: ListResourceSetResourcesRequest,
) => Effect.Effect<
  ListResourceSetResourcesResponse,
  | InternalErrorException
  | InvalidInputException
  | InvalidOperationException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListResourceSetResourcesRequest,
  output: ListResourceSetResourcesResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns an array of `ResourceSetSummary` objects.
 */
export const listResourceSets: (
  input: ListResourceSetsRequest,
) => Effect.Effect<
  ListResourceSetsResponse,
  | InternalErrorException
  | InvalidInputException
  | InvalidOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListResourceSetsRequest,
  output: ListResourceSetsResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
  ],
}));
/**
 * Retrieves a list of all of the third-party firewall policies that are associated with the third-party firewall administrator's account.
 */
export const listThirdPartyFirewallFirewallPolicies: {
  (
    input: ListThirdPartyFirewallFirewallPoliciesRequest,
  ): Effect.Effect<
    ListThirdPartyFirewallFirewallPoliciesResponse,
    | InternalErrorException
    | InvalidInputException
    | InvalidOperationException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListThirdPartyFirewallFirewallPoliciesRequest,
  ) => Stream.Stream<
    ListThirdPartyFirewallFirewallPoliciesResponse,
    | InternalErrorException
    | InvalidInputException
    | InvalidOperationException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListThirdPartyFirewallFirewallPoliciesRequest,
  ) => Stream.Stream<
    ThirdPartyFirewallFirewallPolicy,
    | InternalErrorException
    | InvalidInputException
    | InvalidOperationException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListThirdPartyFirewallFirewallPoliciesRequest,
  output: ListThirdPartyFirewallFirewallPoliciesResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ThirdPartyFirewallFirewallPolicies",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates or updates an Firewall Manager administrator account. The account must be a member of the organization that was onboarded to Firewall Manager by AssociateAdminAccount. Only the organization's management account can create an Firewall Manager administrator account. When you create an Firewall Manager administrator account, the service checks to see if the account is already a delegated administrator within Organizations. If the account isn't a delegated administrator, Firewall Manager calls Organizations to delegate the account within Organizations. For more information about administrator accounts within Organizations, see
 * Managing the Amazon Web Services Accounts in Your Organization.
 */
export const putAdminAccount: (
  input: PutAdminAccountRequest,
) => Effect.Effect<
  PutAdminAccountResponse,
  | InternalErrorException
  | InvalidInputException
  | InvalidOperationException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAdminAccountRequest,
  output: PutAdminAccountResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    LimitExceededException,
  ],
}));
/**
 * Creates the resource set.
 *
 * An Firewall Manager resource set defines the resources to import into an Firewall Manager policy from another Amazon Web Services service.
 */
export const putResourceSet: (
  input: PutResourceSetRequest,
) => Effect.Effect<
  PutResourceSetResponse,
  | InternalErrorException
  | InvalidInputException
  | InvalidOperationException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourceSetRequest,
  output: PutResourceSetResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    LimitExceededException,
  ],
}));
/**
 * Disassociates a Firewall Manager policy administrator from a third-party firewall tenant. When you call `DisassociateThirdPartyFirewall`, the third-party firewall vendor deletes all of the firewalls that are associated with the account.
 */
export const disassociateThirdPartyFirewall: (
  input: DisassociateThirdPartyFirewallRequest,
) => Effect.Effect<
  DisassociateThirdPartyFirewallResponse,
  | InternalErrorException
  | InvalidInputException
  | InvalidOperationException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateThirdPartyFirewallRequest,
  output: DisassociateThirdPartyFirewallResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns information about the specified Firewall Manager applications list.
 */
export const getAppsList: (
  input: GetAppsListRequest,
) => Effect.Effect<
  GetAppsListResponse,
  | InternalErrorException
  | InvalidOperationException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAppsListRequest,
  output: GetAppsListResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * If you created a Shield Advanced policy, returns policy-level attack summary information
 * in the event of a potential DDoS attack. Other policy types are currently unsupported.
 */
export const getProtectionStatus: (
  input: GetProtectionStatusRequest,
) => Effect.Effect<
  GetProtectionStatusResponse,
  | InternalErrorException
  | InvalidInputException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProtectionStatusRequest,
  output: GetProtectionStatusResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns information about the specified Firewall Manager protocols list.
 */
export const getProtocolsList: (
  input: GetProtocolsListRequest,
) => Effect.Effect<
  GetProtocolsListResponse,
  | InternalErrorException
  | InvalidOperationException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProtocolsListRequest,
  output: GetProtocolsListResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Gets information about a specific resource set.
 */
export const getResourceSet: (
  input: GetResourceSetRequest,
) => Effect.Effect<
  GetResourceSetResponse,
  | InternalErrorException
  | InvalidInputException
  | InvalidOperationException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourceSetRequest,
  output: GetResourceSetResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * The onboarding status of a Firewall Manager admin account to third-party firewall vendor tenant.
 */
export const getThirdPartyFirewallAssociationStatus: (
  input: GetThirdPartyFirewallAssociationStatusRequest,
) => Effect.Effect<
  GetThirdPartyFirewallAssociationStatusResponse,
  | InternalErrorException
  | InvalidInputException
  | InvalidOperationException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetThirdPartyFirewallAssociationStatusRequest,
  output: GetThirdPartyFirewallAssociationStatusResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists the accounts that are managing the specified Organizations member account. This is useful for any member account so that they can view the accounts who are managing their account. This operation only returns the managing administrators that have the requested account within their AdminScope.
 */
export const listAdminsManagingAccount: {
  (
    input: ListAdminsManagingAccountRequest,
  ): Effect.Effect<
    ListAdminsManagingAccountResponse,
    | InternalErrorException
    | InvalidInputException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAdminsManagingAccountRequest,
  ) => Stream.Stream<
    ListAdminsManagingAccountResponse,
    | InternalErrorException
    | InvalidInputException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAdminsManagingAccountRequest,
  ) => Stream.Stream<
    AWSAccountId,
    | InternalErrorException
    | InvalidInputException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAdminsManagingAccountRequest,
  output: ListAdminsManagingAccountResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AdminAccounts",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a `MemberAccounts` object that lists the member accounts in the
 * administrator's Amazon Web Services organization.
 *
 * Either an Firewall Manager administrator or the organization's management account can make this request.
 */
export const listMemberAccounts: {
  (
    input: ListMemberAccountsRequest,
  ): Effect.Effect<
    ListMemberAccountsResponse,
    InternalErrorException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMemberAccountsRequest,
  ) => Stream.Stream<
    ListMemberAccountsResponse,
    InternalErrorException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMemberAccountsRequest,
  ) => Stream.Stream<
    AWSAccountId,
    InternalErrorException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMemberAccountsRequest,
  output: ListMemberAccountsResponse,
  errors: [InternalErrorException, ResourceNotFoundException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "MemberAccounts",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the list of tags for the specified Amazon Web Services resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | InternalErrorException
  | InvalidInputException
  | InvalidOperationException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Permanently deletes an Firewall Manager protocols list.
 */
export const deleteProtocolsList: (
  input: DeleteProtocolsListRequest,
) => Effect.Effect<
  DeleteProtocolsListResponse,
  | InternalErrorException
  | InvalidOperationException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProtocolsListRequest,
  output: DeleteProtocolsListResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns the Organizations account that is associated with Firewall Manager
 * as the Firewall Manager default administrator.
 */
export const getAdminAccount: (
  input: GetAdminAccountRequest,
) => Effect.Effect<
  GetAdminAccountResponse,
  | InternalErrorException
  | InvalidOperationException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAdminAccountRequest,
  output: GetAdminAccountResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Information
 * about the Amazon Simple Notification Service (SNS) topic that is used to
 * record Firewall Manager SNS logs.
 */
export const getNotificationChannel: (
  input: GetNotificationChannelRequest,
) => Effect.Effect<
  GetNotificationChannelResponse,
  | InternalErrorException
  | InvalidOperationException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetNotificationChannelRequest,
  output: GetNotificationChannelResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Designates the IAM role and Amazon Simple Notification Service (SNS) topic that
 * Firewall Manager uses to record SNS logs.
 *
 * To perform this action outside of the console, you must first configure the SNS topic's access policy to allow the `SnsRoleName` to publish SNS logs. If the `SnsRoleName` provided is a role other than the `AWSServiceRoleForFMS` service-linked role, this role must have a trust relationship configured to allow the Firewall Manager service principal `fms.amazonaws.com` to assume this role. For information about configuring an SNS access policy, see
 * Service roles for Firewall Manager in the *Firewall Manager Developer Guide*.
 */
export const putNotificationChannel: (
  input: PutNotificationChannelRequest,
) => Effect.Effect<
  PutNotificationChannelResponse,
  | InternalErrorException
  | InvalidOperationException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutNotificationChannelRequest,
  output: PutNotificationChannelResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Disassociates an Firewall Manager administrator account. To set a different account as an Firewall Manager administrator, submit a PutAdminAccount request. To set an account as a default administrator account, you must submit an AssociateAdminAccount request.
 *
 * Disassociation of the default administrator account follows the first in, last out principle. If you are the default administrator, all Firewall Manager administrators within the organization must first disassociate their accounts before you can disassociate your account.
 */
export const disassociateAdminAccount: (
  input: DisassociateAdminAccountRequest,
) => Effect.Effect<
  DisassociateAdminAccountResponse,
  | InternalErrorException
  | InvalidOperationException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateAdminAccountRequest,
  output: DisassociateAdminAccountResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Permanently deletes an Firewall Manager applications list.
 */
export const deleteAppsList: (
  input: DeleteAppsListRequest,
) => Effect.Effect<
  DeleteAppsListResponse,
  | InternalErrorException
  | InvalidOperationException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAppsListRequest,
  output: DeleteAppsListResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes the specified ResourceSet.
 */
export const deleteResourceSet: (
  input: DeleteResourceSetRequest,
) => Effect.Effect<
  DeleteResourceSetResponse,
  | InternalErrorException
  | InvalidInputException
  | InvalidOperationException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourceSetRequest,
  output: DeleteResourceSetResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Removes one or more tags from an Amazon Web Services resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | InternalErrorException
  | InvalidInputException
  | InvalidOperationException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Sets the Firewall Manager policy administrator as a tenant administrator of a third-party firewall service. A tenant is an instance of the third-party firewall service that's associated with your Amazon Web Services customer account.
 */
export const associateThirdPartyFirewall: (
  input: AssociateThirdPartyFirewallRequest,
) => Effect.Effect<
  AssociateThirdPartyFirewallResponse,
  | InternalErrorException
  | InvalidInputException
  | InvalidOperationException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateThirdPartyFirewallRequest,
  output: AssociateThirdPartyFirewallResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Disassociates resources from a Firewall Manager resource set.
 */
export const batchDisassociateResource: (
  input: BatchDisassociateResourceRequest,
) => Effect.Effect<
  BatchDisassociateResourceResponse,
  | InternalErrorException
  | InvalidInputException
  | InvalidOperationException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDisassociateResourceRequest,
  output: BatchDisassociateResourceResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns information about the specified account's administrative scope. The administrative scope defines the resources that an Firewall Manager administrator can manage.
 */
export const getAdminScope: (
  input: GetAdminScopeRequest,
) => Effect.Effect<
  GetAdminScopeResponse,
  | InternalErrorException
  | InvalidInputException
  | InvalidOperationException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAdminScopeRequest,
  output: GetAdminScopeResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Adds one or more tags to an Amazon Web Services resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | InternalErrorException
  | InvalidInputException
  | InvalidOperationException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Sets a Firewall Manager default administrator account. The Firewall Manager default administrator account can manage third-party firewalls and has full administrative scope that allows administration of all policy types, accounts, organizational units, and Regions. This account must be a member account of the organization in Organizations whose resources you want to protect.
 *
 * For information about working with Firewall Manager administrator accounts, see Managing Firewall Manager administrators in the *Firewall Manager Developer Guide*.
 */
export const associateAdminAccount: (
  input: AssociateAdminAccountRequest,
) => Effect.Effect<
  AssociateAdminAccountResponse,
  | InternalErrorException
  | InvalidInputException
  | InvalidOperationException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateAdminAccountRequest,
  output: AssociateAdminAccountResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Associate resources to a Firewall Manager resource set.
 */
export const batchAssociateResource: (
  input: BatchAssociateResourceRequest,
) => Effect.Effect<
  BatchAssociateResourceResponse,
  | InternalErrorException
  | InvalidInputException
  | InvalidOperationException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchAssociateResourceRequest,
  output: BatchAssociateResourceResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns an array of `PolicyComplianceStatus` objects. Use
 * `PolicyComplianceStatus` to get a summary of which member accounts are protected
 * by the specified policy.
 */
export const listComplianceStatus: {
  (
    input: ListComplianceStatusRequest,
  ): Effect.Effect<
    ListComplianceStatusResponse,
    InternalErrorException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListComplianceStatusRequest,
  ) => Stream.Stream<
    ListComplianceStatusResponse,
    InternalErrorException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListComplianceStatusRequest,
  ) => Stream.Stream<
    PolicyComplianceStatus,
    InternalErrorException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListComplianceStatusRequest,
  output: ListComplianceStatusResponse,
  errors: [InternalErrorException, ResourceNotFoundException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "PolicyComplianceStatusList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates an Firewall Manager applications list.
 */
export const putAppsList: (
  input: PutAppsListRequest,
) => Effect.Effect<
  PutAppsListResponse,
  | InternalErrorException
  | InvalidInputException
  | InvalidOperationException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAppsListRequest,
  output: PutAppsListResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates an Firewall Manager protocols list.
 */
export const putProtocolsList: (
  input: PutProtocolsListRequest,
) => Effect.Effect<
  PutProtocolsListResponse,
  | InternalErrorException
  | InvalidInputException
  | InvalidOperationException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutProtocolsListRequest,
  output: PutProtocolsListResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns detailed compliance information about the specified member account. Details
 * include resources that are in and out of compliance with the specified policy.
 *
 * The reasons for resources being considered compliant depend on the Firewall Manager policy type.
 */
export const getComplianceDetail: (
  input: GetComplianceDetailRequest,
) => Effect.Effect<
  GetComplianceDetailResponse,
  | InternalErrorException
  | InvalidInputException
  | InvalidOperationException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetComplianceDetailRequest,
  output: GetComplianceDetailResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates an Firewall Manager policy.
 *
 * A Firewall Manager policy is specific to the individual policy type. If you want to enforce multiple
 * policy types across accounts, you can create multiple policies. You can create more than one
 * policy for each type.
 *
 * If you add a new account to an organization that you created with Organizations, Firewall Manager
 * automatically applies the policy to the resources in that account that are within scope of
 * the policy.
 *
 * Firewall Manager provides the following types of policies:
 *
 * - **WAF policy** - This policy applies WAF web ACL
 * protections to specified accounts and resources.
 *
 * - **Shield Advanced policy** - This policy applies Shield Advanced
 * protection to specified accounts and resources.
 *
 * - **Security Groups policy** - This type of policy gives you
 * control over security groups that are in use throughout your organization in
 * Organizations and lets you enforce a baseline set of rules across your organization.
 *
 * - **Network ACL policy** - This type of policy gives you
 * control over the network ACLs that are in use throughout your organization in
 * Organizations and lets you enforce a baseline set of first and last network ACL rules across your organization.
 *
 * - **Network Firewall policy** - This policy applies
 * Network Firewall protection to your organization's VPCs.
 *
 * - **DNS Firewall policy** - This policy applies
 * Amazon Route 53 Resolver DNS Firewall protections to your organization's VPCs.
 *
 * - **Third-party firewall policy** - This policy applies third-party firewall protections. Third-party firewalls are available by subscription through the Amazon Web Services Marketplace console at Amazon Web Services Marketplace.
 *
 * - **Palo Alto Networks Cloud NGFW policy** - This policy applies Palo Alto Networks Cloud Next Generation Firewall (NGFW) protections and Palo Alto Networks Cloud NGFW rulestacks to your organization's VPCs.
 *
 * - **Fortigate CNF policy** - This policy applies
 * Fortigate Cloud Native Firewall (CNF) protections. Fortigate CNF is a cloud-centered solution that blocks Zero-Day threats and secures cloud infrastructures with industry-leading advanced threat prevention, smart web application firewalls (WAF), and API protection.
 */
export const putPolicy: (
  input: PutPolicyRequest,
) => Effect.Effect<
  PutPolicyResponse,
  | InternalErrorException
  | InvalidInputException
  | InvalidOperationException
  | InvalidTypeException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutPolicyRequest,
  output: PutPolicyResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    InvalidTypeException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves violations for a resource based on the specified Firewall Manager policy and Amazon Web Services account.
 */
export const getViolationDetails: (
  input: GetViolationDetailsRequest,
) => Effect.Effect<
  GetViolationDetailsResponse,
  | InternalErrorException
  | InvalidInputException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetViolationDetailsRequest,
  output: GetViolationDetailsResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
