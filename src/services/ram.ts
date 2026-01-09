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
  sdkId: "RAM",
  serviceShapeName: "AmazonResourceSharing",
});
const auth = T.AwsAuthSigv4({ name: "ram" });
const ver = T.ServiceVersion("2018-01-04");
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
              `https://ram-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://ram.${Region}.amazonaws.com`);
            }
            return e(
              `https://ram-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://ram.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://ram.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type PermissionName = string;
export type Policy = string;
export type MaxResults = number;
export type TagKey = string;
export type TagValue = string;

//# Schemas
export interface EnableSharingWithAwsOrganizationRequest {}
export const EnableSharingWithAwsOrganizationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/enablesharingwithawsorganization" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EnableSharingWithAwsOrganizationRequest",
}) as any as S.Schema<EnableSharingWithAwsOrganizationRequest>;
export type ResourceArnList = string[];
export const ResourceArnList = S.Array(S.String.pipe(T.XmlName("item")));
export type PrincipalArnOrIdList = string[];
export const PrincipalArnOrIdList = S.Array(S.String.pipe(T.XmlName("item")));
export type SourceArnOrAccountList = string[];
export const SourceArnOrAccountList = S.Array(S.String.pipe(T.XmlName("item")));
export type PermissionArnList = string[];
export const PermissionArnList = S.Array(S.String.pipe(T.XmlName("item")));
export type ResourceShareAssociationType =
  | "PRINCIPAL"
  | "RESOURCE"
  | (string & {});
export const ResourceShareAssociationType = S.String;
export type ResourceShareArnList = string[];
export const ResourceShareArnList = S.Array(S.String.pipe(T.XmlName("item")));
export type ResourceShareAssociationStatus =
  | "ASSOCIATING"
  | "ASSOCIATED"
  | "FAILED"
  | "DISASSOCIATING"
  | "DISASSOCIATED"
  | (string & {});
export const ResourceShareAssociationStatus = S.String;
export type ResourceShareInvitationArnList = string[];
export const ResourceShareInvitationArnList = S.Array(
  S.String.pipe(T.XmlName("item")),
);
export type ResourceShareStatus =
  | "PENDING"
  | "ACTIVE"
  | "FAILED"
  | "DELETING"
  | "DELETED"
  | (string & {});
export const ResourceShareStatus = S.String;
export type ResourceOwner = "SELF" | "OTHER-ACCOUNTS" | (string & {});
export const ResourceOwner = S.String;
export type ResourceRegionScopeFilter =
  | "ALL"
  | "REGIONAL"
  | "GLOBAL"
  | (string & {});
export const ResourceRegionScopeFilter = S.String;
export type PermissionFeatureSet =
  | "CREATED_FROM_POLICY"
  | "PROMOTING_TO_STANDARD"
  | "STANDARD"
  | (string & {});
export const PermissionFeatureSet = S.String;
export type PermissionTypeFilter =
  | "ALL"
  | "AWS_MANAGED"
  | "CUSTOMER_MANAGED"
  | (string & {});
export const PermissionTypeFilter = S.String;
export type ReplacePermissionAssociationsWorkIdList = string[];
export const ReplacePermissionAssociationsWorkIdList = S.Array(
  S.String.pipe(T.XmlName("item")),
);
export type ReplacePermissionAssociationsWorkStatus =
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED"
  | (string & {});
export const ReplacePermissionAssociationsWorkStatus = S.String;
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AcceptResourceShareInvitationRequest {
  resourceShareInvitationArn: string;
  clientToken?: string;
}
export const AcceptResourceShareInvitationRequest = S.suspend(() =>
  S.Struct({
    resourceShareInvitationArn: S.String,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/acceptresourceshareinvitation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AcceptResourceShareInvitationRequest",
}) as any as S.Schema<AcceptResourceShareInvitationRequest>;
export interface AssociateResourceShareRequest {
  resourceShareArn: string;
  resourceArns?: string[];
  principals?: string[];
  clientToken?: string;
  sources?: string[];
}
export const AssociateResourceShareRequest = S.suspend(() =>
  S.Struct({
    resourceShareArn: S.String,
    resourceArns: S.optional(ResourceArnList),
    principals: S.optional(PrincipalArnOrIdList),
    clientToken: S.optional(S.String),
    sources: S.optional(SourceArnOrAccountList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/associateresourceshare" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateResourceShareRequest",
}) as any as S.Schema<AssociateResourceShareRequest>;
export interface AssociateResourceSharePermissionRequest {
  resourceShareArn: string;
  permissionArn: string;
  replace?: boolean;
  clientToken?: string;
  permissionVersion?: number;
}
export const AssociateResourceSharePermissionRequest = S.suspend(() =>
  S.Struct({
    resourceShareArn: S.String,
    permissionArn: S.String,
    replace: S.optional(S.Boolean),
    clientToken: S.optional(S.String),
    permissionVersion: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/associateresourcesharepermission" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateResourceSharePermissionRequest",
}) as any as S.Schema<AssociateResourceSharePermissionRequest>;
export interface CreatePermissionVersionRequest {
  permissionArn: string;
  policyTemplate: string;
  clientToken?: string;
}
export const CreatePermissionVersionRequest = S.suspend(() =>
  S.Struct({
    permissionArn: S.String,
    policyTemplate: S.String,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/createpermissionversion" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePermissionVersionRequest",
}) as any as S.Schema<CreatePermissionVersionRequest>;
export interface Tag {
  key?: string;
  value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.optional(S.String), value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateResourceShareRequest {
  name: string;
  resourceArns?: string[];
  principals?: string[];
  tags?: Tag[];
  allowExternalPrincipals?: boolean;
  clientToken?: string;
  permissionArns?: string[];
  sources?: string[];
}
export const CreateResourceShareRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    resourceArns: S.optional(ResourceArnList),
    principals: S.optional(PrincipalArnOrIdList),
    tags: S.optional(TagList),
    allowExternalPrincipals: S.optional(S.Boolean),
    clientToken: S.optional(S.String),
    permissionArns: S.optional(PermissionArnList),
    sources: S.optional(SourceArnOrAccountList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/createresourceshare" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateResourceShareRequest",
}) as any as S.Schema<CreateResourceShareRequest>;
export interface DeletePermissionRequest {
  permissionArn: string;
  clientToken?: string;
}
export const DeletePermissionRequest = S.suspend(() =>
  S.Struct({
    permissionArn: S.String.pipe(T.HttpQuery("permissionArn")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/deletepermission" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePermissionRequest",
}) as any as S.Schema<DeletePermissionRequest>;
export interface DeletePermissionVersionRequest {
  permissionArn: string;
  permissionVersion: number;
  clientToken?: string;
}
export const DeletePermissionVersionRequest = S.suspend(() =>
  S.Struct({
    permissionArn: S.String.pipe(T.HttpQuery("permissionArn")),
    permissionVersion: S.Number.pipe(T.HttpQuery("permissionVersion")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/deletepermissionversion" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePermissionVersionRequest",
}) as any as S.Schema<DeletePermissionVersionRequest>;
export interface DeleteResourceShareRequest {
  resourceShareArn: string;
  clientToken?: string;
}
export const DeleteResourceShareRequest = S.suspend(() =>
  S.Struct({
    resourceShareArn: S.String.pipe(T.HttpQuery("resourceShareArn")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/deleteresourceshare" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteResourceShareRequest",
}) as any as S.Schema<DeleteResourceShareRequest>;
export interface DisassociateResourceShareRequest {
  resourceShareArn: string;
  resourceArns?: string[];
  principals?: string[];
  clientToken?: string;
  sources?: string[];
}
export const DisassociateResourceShareRequest = S.suspend(() =>
  S.Struct({
    resourceShareArn: S.String,
    resourceArns: S.optional(ResourceArnList),
    principals: S.optional(PrincipalArnOrIdList),
    clientToken: S.optional(S.String),
    sources: S.optional(SourceArnOrAccountList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/disassociateresourceshare" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateResourceShareRequest",
}) as any as S.Schema<DisassociateResourceShareRequest>;
export interface DisassociateResourceSharePermissionRequest {
  resourceShareArn: string;
  permissionArn: string;
  clientToken?: string;
}
export const DisassociateResourceSharePermissionRequest = S.suspend(() =>
  S.Struct({
    resourceShareArn: S.String,
    permissionArn: S.String,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/disassociateresourcesharepermission" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateResourceSharePermissionRequest",
}) as any as S.Schema<DisassociateResourceSharePermissionRequest>;
export interface EnableSharingWithAwsOrganizationResponse {
  returnValue?: boolean;
}
export const EnableSharingWithAwsOrganizationResponse = S.suspend(() =>
  S.Struct({ returnValue: S.optional(S.Boolean).pipe(T.XmlName("return")) }),
).annotations({
  identifier: "EnableSharingWithAwsOrganizationResponse",
}) as any as S.Schema<EnableSharingWithAwsOrganizationResponse>;
export interface GetPermissionRequest {
  permissionArn: string;
  permissionVersion?: number;
}
export const GetPermissionRequest = S.suspend(() =>
  S.Struct({
    permissionArn: S.String,
    permissionVersion: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/getpermission" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPermissionRequest",
}) as any as S.Schema<GetPermissionRequest>;
export interface GetResourcePoliciesRequest {
  resourceArns: string[];
  principal?: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetResourcePoliciesRequest = S.suspend(() =>
  S.Struct({
    resourceArns: ResourceArnList,
    principal: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/getresourcepolicies" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourcePoliciesRequest",
}) as any as S.Schema<GetResourcePoliciesRequest>;
export interface GetResourceShareAssociationsRequest {
  associationType: ResourceShareAssociationType;
  resourceShareArns?: string[];
  resourceArn?: string;
  principal?: string;
  associationStatus?: ResourceShareAssociationStatus;
  nextToken?: string;
  maxResults?: number;
}
export const GetResourceShareAssociationsRequest = S.suspend(() =>
  S.Struct({
    associationType: ResourceShareAssociationType,
    resourceShareArns: S.optional(ResourceShareArnList),
    resourceArn: S.optional(S.String),
    principal: S.optional(S.String),
    associationStatus: S.optional(ResourceShareAssociationStatus),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/getresourceshareassociations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourceShareAssociationsRequest",
}) as any as S.Schema<GetResourceShareAssociationsRequest>;
export interface GetResourceShareInvitationsRequest {
  resourceShareInvitationArns?: string[];
  resourceShareArns?: string[];
  nextToken?: string;
  maxResults?: number;
}
export const GetResourceShareInvitationsRequest = S.suspend(() =>
  S.Struct({
    resourceShareInvitationArns: S.optional(ResourceShareInvitationArnList),
    resourceShareArns: S.optional(ResourceShareArnList),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/getresourceshareinvitations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourceShareInvitationsRequest",
}) as any as S.Schema<GetResourceShareInvitationsRequest>;
export interface ListPendingInvitationResourcesRequest {
  resourceShareInvitationArn: string;
  nextToken?: string;
  maxResults?: number;
  resourceRegionScope?: ResourceRegionScopeFilter;
}
export const ListPendingInvitationResourcesRequest = S.suspend(() =>
  S.Struct({
    resourceShareInvitationArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    resourceRegionScope: S.optional(ResourceRegionScopeFilter),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listpendinginvitationresources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPendingInvitationResourcesRequest",
}) as any as S.Schema<ListPendingInvitationResourcesRequest>;
export interface ListPermissionAssociationsRequest {
  permissionArn?: string;
  permissionVersion?: number;
  associationStatus?: ResourceShareAssociationStatus;
  resourceType?: string;
  featureSet?: PermissionFeatureSet;
  defaultVersion?: boolean;
  nextToken?: string;
  maxResults?: number;
}
export const ListPermissionAssociationsRequest = S.suspend(() =>
  S.Struct({
    permissionArn: S.optional(S.String),
    permissionVersion: S.optional(S.Number),
    associationStatus: S.optional(ResourceShareAssociationStatus),
    resourceType: S.optional(S.String),
    featureSet: S.optional(PermissionFeatureSet),
    defaultVersion: S.optional(S.Boolean),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listpermissionassociations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPermissionAssociationsRequest",
}) as any as S.Schema<ListPermissionAssociationsRequest>;
export interface ListPermissionsRequest {
  resourceType?: string;
  nextToken?: string;
  maxResults?: number;
  permissionType?: PermissionTypeFilter;
}
export const ListPermissionsRequest = S.suspend(() =>
  S.Struct({
    resourceType: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    permissionType: S.optional(PermissionTypeFilter),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listpermissions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPermissionsRequest",
}) as any as S.Schema<ListPermissionsRequest>;
export interface ListPermissionVersionsRequest {
  permissionArn: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListPermissionVersionsRequest = S.suspend(() =>
  S.Struct({
    permissionArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listpermissionversions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPermissionVersionsRequest",
}) as any as S.Schema<ListPermissionVersionsRequest>;
export interface ListPrincipalsRequest {
  resourceOwner: ResourceOwner;
  resourceArn?: string;
  principals?: string[];
  resourceType?: string;
  resourceShareArns?: string[];
  nextToken?: string;
  maxResults?: number;
}
export const ListPrincipalsRequest = S.suspend(() =>
  S.Struct({
    resourceOwner: ResourceOwner,
    resourceArn: S.optional(S.String),
    principals: S.optional(PrincipalArnOrIdList),
    resourceType: S.optional(S.String),
    resourceShareArns: S.optional(ResourceShareArnList),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listprincipals" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPrincipalsRequest",
}) as any as S.Schema<ListPrincipalsRequest>;
export interface ListReplacePermissionAssociationsWorkRequest {
  workIds?: string[];
  status?: ReplacePermissionAssociationsWorkStatus;
  nextToken?: string;
  maxResults?: number;
}
export const ListReplacePermissionAssociationsWorkRequest = S.suspend(() =>
  S.Struct({
    workIds: S.optional(ReplacePermissionAssociationsWorkIdList),
    status: S.optional(ReplacePermissionAssociationsWorkStatus),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listreplacepermissionassociationswork" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListReplacePermissionAssociationsWorkRequest",
}) as any as S.Schema<ListReplacePermissionAssociationsWorkRequest>;
export interface ListResourcesRequest {
  resourceOwner: ResourceOwner;
  principal?: string;
  resourceType?: string;
  resourceArns?: string[];
  resourceShareArns?: string[];
  nextToken?: string;
  maxResults?: number;
  resourceRegionScope?: ResourceRegionScopeFilter;
}
export const ListResourcesRequest = S.suspend(() =>
  S.Struct({
    resourceOwner: ResourceOwner,
    principal: S.optional(S.String),
    resourceType: S.optional(S.String),
    resourceArns: S.optional(ResourceArnList),
    resourceShareArns: S.optional(ResourceShareArnList),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    resourceRegionScope: S.optional(ResourceRegionScopeFilter),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listresources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourcesRequest",
}) as any as S.Schema<ListResourcesRequest>;
export interface ListResourceSharePermissionsRequest {
  resourceShareArn: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListResourceSharePermissionsRequest = S.suspend(() =>
  S.Struct({
    resourceShareArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listresourcesharepermissions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourceSharePermissionsRequest",
}) as any as S.Schema<ListResourceSharePermissionsRequest>;
export interface ListResourceTypesRequest {
  nextToken?: string;
  maxResults?: number;
  resourceRegionScope?: ResourceRegionScopeFilter;
}
export const ListResourceTypesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    resourceRegionScope: S.optional(ResourceRegionScopeFilter),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listresourcetypes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourceTypesRequest",
}) as any as S.Schema<ListResourceTypesRequest>;
export interface PromotePermissionCreatedFromPolicyRequest {
  permissionArn: string;
  name: string;
  clientToken?: string;
}
export const PromotePermissionCreatedFromPolicyRequest = S.suspend(() =>
  S.Struct({
    permissionArn: S.String,
    name: S.String,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/promotepermissioncreatedfrompolicy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PromotePermissionCreatedFromPolicyRequest",
}) as any as S.Schema<PromotePermissionCreatedFromPolicyRequest>;
export interface PromoteResourceShareCreatedFromPolicyRequest {
  resourceShareArn: string;
}
export const PromoteResourceShareCreatedFromPolicyRequest = S.suspend(() =>
  S.Struct({
    resourceShareArn: S.String.pipe(T.HttpQuery("resourceShareArn")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/promoteresourcesharecreatedfrompolicy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PromoteResourceShareCreatedFromPolicyRequest",
}) as any as S.Schema<PromoteResourceShareCreatedFromPolicyRequest>;
export interface RejectResourceShareInvitationRequest {
  resourceShareInvitationArn: string;
  clientToken?: string;
}
export const RejectResourceShareInvitationRequest = S.suspend(() =>
  S.Struct({
    resourceShareInvitationArn: S.String,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/rejectresourceshareinvitation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RejectResourceShareInvitationRequest",
}) as any as S.Schema<RejectResourceShareInvitationRequest>;
export interface ReplacePermissionAssociationsRequest {
  fromPermissionArn: string;
  fromPermissionVersion?: number;
  toPermissionArn: string;
  clientToken?: string;
}
export const ReplacePermissionAssociationsRequest = S.suspend(() =>
  S.Struct({
    fromPermissionArn: S.String,
    fromPermissionVersion: S.optional(S.Number),
    toPermissionArn: S.String,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/replacepermissionassociations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ReplacePermissionAssociationsRequest",
}) as any as S.Schema<ReplacePermissionAssociationsRequest>;
export interface SetDefaultPermissionVersionRequest {
  permissionArn: string;
  permissionVersion: number;
  clientToken?: string;
}
export const SetDefaultPermissionVersionRequest = S.suspend(() =>
  S.Struct({
    permissionArn: S.String,
    permissionVersion: S.Number,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/setdefaultpermissionversion" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetDefaultPermissionVersionRequest",
}) as any as S.Schema<SetDefaultPermissionVersionRequest>;
export interface TagResourceRequest {
  resourceShareArn?: string;
  tags: Tag[];
  resourceArn?: string;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceShareArn: S.optional(S.String),
    tags: TagList,
    resourceArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tagresource" }),
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
  resourceShareArn?: string;
  tagKeys: string[];
  resourceArn?: string;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceShareArn: S.optional(S.String),
    tagKeys: TagKeyList,
    resourceArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/untagresource" }),
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
export interface UpdateResourceShareRequest {
  resourceShareArn: string;
  name?: string;
  allowExternalPrincipals?: boolean;
  clientToken?: string;
}
export const UpdateResourceShareRequest = S.suspend(() =>
  S.Struct({
    resourceShareArn: S.String,
    name: S.optional(S.String),
    allowExternalPrincipals: S.optional(S.Boolean),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/updateresourceshare" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateResourceShareRequest",
}) as any as S.Schema<UpdateResourceShareRequest>;
export type TagValueList = string[];
export const TagValueList = S.Array(S.String);
export type PermissionStatus =
  | "ATTACHABLE"
  | "UNATTACHABLE"
  | "DELETING"
  | "DELETED"
  | (string & {});
export const PermissionStatus = S.String;
export type PolicyList = string[];
export const PolicyList = S.Array(S.String.pipe(T.XmlName("item")));
export type ResourceShareInvitationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED"
  | (string & {});
export const ResourceShareInvitationStatus = S.String;
export interface ResourceShareAssociation {
  resourceShareArn?: string;
  resourceShareName?: string;
  associatedEntity?: string;
  associationType?: ResourceShareAssociationType;
  status?: ResourceShareAssociationStatus;
  statusMessage?: string;
  creationTime?: Date;
  lastUpdatedTime?: Date;
  external?: boolean;
}
export const ResourceShareAssociation = S.suspend(() =>
  S.Struct({
    resourceShareArn: S.optional(S.String),
    resourceShareName: S.optional(S.String),
    associatedEntity: S.optional(S.String),
    associationType: S.optional(ResourceShareAssociationType),
    status: S.optional(ResourceShareAssociationStatus),
    statusMessage: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    external: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ResourceShareAssociation",
}) as any as S.Schema<ResourceShareAssociation>;
export type ResourceShareAssociationList = ResourceShareAssociation[];
export const ResourceShareAssociationList = S.Array(
  ResourceShareAssociation.pipe(T.XmlName("item")).annotations({
    identifier: "ResourceShareAssociation",
  }),
);
export interface ResourceShareInvitation {
  resourceShareInvitationArn?: string;
  resourceShareName?: string;
  resourceShareArn?: string;
  senderAccountId?: string;
  receiverAccountId?: string;
  invitationTimestamp?: Date;
  status?: ResourceShareInvitationStatus;
  resourceShareAssociations?: ResourceShareAssociation[];
  receiverArn?: string;
}
export const ResourceShareInvitation = S.suspend(() =>
  S.Struct({
    resourceShareInvitationArn: S.optional(S.String),
    resourceShareName: S.optional(S.String),
    resourceShareArn: S.optional(S.String),
    senderAccountId: S.optional(S.String),
    receiverAccountId: S.optional(S.String),
    invitationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    status: S.optional(ResourceShareInvitationStatus),
    resourceShareAssociations: S.optional(ResourceShareAssociationList),
    receiverArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourceShareInvitation",
}) as any as S.Schema<ResourceShareInvitation>;
export type ResourceShareInvitationList = ResourceShareInvitation[];
export const ResourceShareInvitationList = S.Array(
  ResourceShareInvitation.pipe(T.XmlName("item")).annotations({
    identifier: "ResourceShareInvitation",
  }),
);
export interface TagFilter {
  tagKey?: string;
  tagValues?: string[];
}
export const TagFilter = S.suspend(() =>
  S.Struct({
    tagKey: S.optional(S.String),
    tagValues: S.optional(TagValueList),
  }),
).annotations({ identifier: "TagFilter" }) as any as S.Schema<TagFilter>;
export type TagFilters = TagFilter[];
export const TagFilters = S.Array(TagFilter);
export interface AssociateResourceSharePermissionResponse {
  returnValue?: boolean;
  clientToken?: string;
}
export const AssociateResourceSharePermissionResponse = S.suspend(() =>
  S.Struct({
    returnValue: S.optional(S.Boolean),
    clientToken: S.optional(S.String),
  }),
).annotations({
  identifier: "AssociateResourceSharePermissionResponse",
}) as any as S.Schema<AssociateResourceSharePermissionResponse>;
export interface CreatePermissionRequest {
  name: string;
  resourceType: string;
  policyTemplate: string;
  clientToken?: string;
  tags?: Tag[];
}
export const CreatePermissionRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    resourceType: S.String,
    policyTemplate: S.String,
    clientToken: S.optional(S.String),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/createpermission" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePermissionRequest",
}) as any as S.Schema<CreatePermissionRequest>;
export interface DeletePermissionResponse {
  returnValue?: boolean;
  clientToken?: string;
  permissionStatus?: PermissionStatus;
}
export const DeletePermissionResponse = S.suspend(() =>
  S.Struct({
    returnValue: S.optional(S.Boolean).pipe(T.XmlName("return")),
    clientToken: S.optional(S.String),
    permissionStatus: S.optional(PermissionStatus),
  }),
).annotations({
  identifier: "DeletePermissionResponse",
}) as any as S.Schema<DeletePermissionResponse>;
export interface DeletePermissionVersionResponse {
  returnValue?: boolean;
  clientToken?: string;
  permissionStatus?: PermissionStatus;
}
export const DeletePermissionVersionResponse = S.suspend(() =>
  S.Struct({
    returnValue: S.optional(S.Boolean).pipe(T.XmlName("return")),
    clientToken: S.optional(S.String),
    permissionStatus: S.optional(PermissionStatus),
  }),
).annotations({
  identifier: "DeletePermissionVersionResponse",
}) as any as S.Schema<DeletePermissionVersionResponse>;
export interface DeleteResourceShareResponse {
  returnValue?: boolean;
  clientToken?: string;
}
export const DeleteResourceShareResponse = S.suspend(() =>
  S.Struct({
    returnValue: S.optional(S.Boolean).pipe(T.XmlName("return")),
    clientToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteResourceShareResponse",
}) as any as S.Schema<DeleteResourceShareResponse>;
export interface DisassociateResourceShareResponse {
  resourceShareAssociations?: ResourceShareAssociation[];
  clientToken?: string;
}
export const DisassociateResourceShareResponse = S.suspend(() =>
  S.Struct({
    resourceShareAssociations: S.optional(ResourceShareAssociationList),
    clientToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DisassociateResourceShareResponse",
}) as any as S.Schema<DisassociateResourceShareResponse>;
export interface DisassociateResourceSharePermissionResponse {
  returnValue?: boolean;
  clientToken?: string;
}
export const DisassociateResourceSharePermissionResponse = S.suspend(() =>
  S.Struct({
    returnValue: S.optional(S.Boolean),
    clientToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DisassociateResourceSharePermissionResponse",
}) as any as S.Schema<DisassociateResourceSharePermissionResponse>;
export type PermissionType = "CUSTOMER_MANAGED" | "AWS_MANAGED" | (string & {});
export const PermissionType = S.String;
export interface ResourceSharePermissionDetail {
  arn?: string;
  version?: string;
  defaultVersion?: boolean;
  name?: string;
  resourceType?: string;
  permission?: string;
  creationTime?: Date;
  lastUpdatedTime?: Date;
  isResourceTypeDefault?: boolean;
  permissionType?: PermissionType;
  featureSet?: PermissionFeatureSet;
  status?: PermissionStatus;
  tags?: Tag[];
}
export const ResourceSharePermissionDetail = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    version: S.optional(S.String),
    defaultVersion: S.optional(S.Boolean),
    name: S.optional(S.String),
    resourceType: S.optional(S.String),
    permission: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    isResourceTypeDefault: S.optional(S.Boolean),
    permissionType: S.optional(PermissionType),
    featureSet: S.optional(PermissionFeatureSet),
    status: S.optional(PermissionStatus),
    tags: S.optional(TagList),
  }),
).annotations({
  identifier: "ResourceSharePermissionDetail",
}) as any as S.Schema<ResourceSharePermissionDetail>;
export interface GetPermissionResponse {
  permission?: ResourceSharePermissionDetail;
}
export const GetPermissionResponse = S.suspend(() =>
  S.Struct({ permission: S.optional(ResourceSharePermissionDetail) }),
).annotations({
  identifier: "GetPermissionResponse",
}) as any as S.Schema<GetPermissionResponse>;
export interface GetResourcePoliciesResponse {
  policies?: string[];
  nextToken?: string;
}
export const GetResourcePoliciesResponse = S.suspend(() =>
  S.Struct({
    policies: S.optional(PolicyList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetResourcePoliciesResponse",
}) as any as S.Schema<GetResourcePoliciesResponse>;
export interface GetResourceShareAssociationsResponse {
  resourceShareAssociations?: ResourceShareAssociation[];
  nextToken?: string;
}
export const GetResourceShareAssociationsResponse = S.suspend(() =>
  S.Struct({
    resourceShareAssociations: S.optional(ResourceShareAssociationList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetResourceShareAssociationsResponse",
}) as any as S.Schema<GetResourceShareAssociationsResponse>;
export interface GetResourceShareInvitationsResponse {
  resourceShareInvitations?: ResourceShareInvitation[];
  nextToken?: string;
}
export const GetResourceShareInvitationsResponse = S.suspend(() =>
  S.Struct({
    resourceShareInvitations: S.optional(ResourceShareInvitationList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetResourceShareInvitationsResponse",
}) as any as S.Schema<GetResourceShareInvitationsResponse>;
export interface GetResourceSharesRequest {
  resourceShareArns?: string[];
  resourceShareStatus?: ResourceShareStatus;
  resourceOwner: ResourceOwner;
  name?: string;
  tagFilters?: TagFilter[];
  nextToken?: string;
  maxResults?: number;
  permissionArn?: string;
  permissionVersion?: number;
}
export const GetResourceSharesRequest = S.suspend(() =>
  S.Struct({
    resourceShareArns: S.optional(ResourceShareArnList),
    resourceShareStatus: S.optional(ResourceShareStatus),
    resourceOwner: ResourceOwner,
    name: S.optional(S.String),
    tagFilters: S.optional(TagFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    permissionArn: S.optional(S.String),
    permissionVersion: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/getresourceshares" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourceSharesRequest",
}) as any as S.Schema<GetResourceSharesRequest>;
export interface ResourceSharePermissionSummary {
  arn?: string;
  version?: string;
  defaultVersion?: boolean;
  name?: string;
  resourceType?: string;
  status?: string;
  creationTime?: Date;
  lastUpdatedTime?: Date;
  isResourceTypeDefault?: boolean;
  permissionType?: PermissionType;
  featureSet?: PermissionFeatureSet;
  tags?: Tag[];
}
export const ResourceSharePermissionSummary = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    version: S.optional(S.String),
    defaultVersion: S.optional(S.Boolean),
    name: S.optional(S.String),
    resourceType: S.optional(S.String),
    status: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    isResourceTypeDefault: S.optional(S.Boolean),
    permissionType: S.optional(PermissionType),
    featureSet: S.optional(PermissionFeatureSet),
    tags: S.optional(TagList),
  }),
).annotations({
  identifier: "ResourceSharePermissionSummary",
}) as any as S.Schema<ResourceSharePermissionSummary>;
export type ResourceSharePermissionList = ResourceSharePermissionSummary[];
export const ResourceSharePermissionList = S.Array(
  ResourceSharePermissionSummary.pipe(T.XmlName("item")).annotations({
    identifier: "ResourceSharePermissionSummary",
  }),
);
export interface ListPermissionVersionsResponse {
  permissions?: ResourceSharePermissionSummary[];
  nextToken?: string;
}
export const ListPermissionVersionsResponse = S.suspend(() =>
  S.Struct({
    permissions: S.optional(ResourceSharePermissionList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPermissionVersionsResponse",
}) as any as S.Schema<ListPermissionVersionsResponse>;
export type ResourceStatus =
  | "AVAILABLE"
  | "ZONAL_RESOURCE_INACCESSIBLE"
  | "LIMIT_EXCEEDED"
  | "UNAVAILABLE"
  | "PENDING"
  | (string & {});
export const ResourceStatus = S.String;
export type ResourceRegionScope = "REGIONAL" | "GLOBAL" | (string & {});
export const ResourceRegionScope = S.String;
export interface Resource {
  arn?: string;
  type?: string;
  resourceShareArn?: string;
  resourceGroupArn?: string;
  status?: ResourceStatus;
  statusMessage?: string;
  creationTime?: Date;
  lastUpdatedTime?: Date;
  resourceRegionScope?: ResourceRegionScope;
}
export const Resource = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    type: S.optional(S.String),
    resourceShareArn: S.optional(S.String),
    resourceGroupArn: S.optional(S.String),
    status: S.optional(ResourceStatus),
    statusMessage: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    resourceRegionScope: S.optional(ResourceRegionScope),
  }),
).annotations({ identifier: "Resource" }) as any as S.Schema<Resource>;
export type ResourceList = Resource[];
export const ResourceList = S.Array(
  Resource.pipe(T.XmlName("item")).annotations({ identifier: "Resource" }),
);
export interface ListResourcesResponse {
  resources?: Resource[];
  nextToken?: string;
}
export const ListResourcesResponse = S.suspend(() =>
  S.Struct({
    resources: S.optional(ResourceList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListResourcesResponse",
}) as any as S.Schema<ListResourcesResponse>;
export interface ListResourceSharePermissionsResponse {
  permissions?: ResourceSharePermissionSummary[];
  nextToken?: string;
}
export const ListResourceSharePermissionsResponse = S.suspend(() =>
  S.Struct({
    permissions: S.optional(ResourceSharePermissionList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListResourceSharePermissionsResponse",
}) as any as S.Schema<ListResourceSharePermissionsResponse>;
export interface PromotePermissionCreatedFromPolicyResponse {
  permission?: ResourceSharePermissionSummary;
  clientToken?: string;
}
export const PromotePermissionCreatedFromPolicyResponse = S.suspend(() =>
  S.Struct({
    permission: S.optional(ResourceSharePermissionSummary),
    clientToken: S.optional(S.String),
  }),
).annotations({
  identifier: "PromotePermissionCreatedFromPolicyResponse",
}) as any as S.Schema<PromotePermissionCreatedFromPolicyResponse>;
export interface PromoteResourceShareCreatedFromPolicyResponse {
  returnValue?: boolean;
}
export const PromoteResourceShareCreatedFromPolicyResponse = S.suspend(() =>
  S.Struct({ returnValue: S.optional(S.Boolean).pipe(T.XmlName("return")) }),
).annotations({
  identifier: "PromoteResourceShareCreatedFromPolicyResponse",
}) as any as S.Schema<PromoteResourceShareCreatedFromPolicyResponse>;
export interface RejectResourceShareInvitationResponse {
  resourceShareInvitation?: ResourceShareInvitation;
  clientToken?: string;
}
export const RejectResourceShareInvitationResponse = S.suspend(() =>
  S.Struct({
    resourceShareInvitation: S.optional(ResourceShareInvitation),
    clientToken: S.optional(S.String),
  }),
).annotations({
  identifier: "RejectResourceShareInvitationResponse",
}) as any as S.Schema<RejectResourceShareInvitationResponse>;
export interface ReplacePermissionAssociationsWork {
  id?: string;
  fromPermissionArn?: string;
  fromPermissionVersion?: string;
  toPermissionArn?: string;
  toPermissionVersion?: string;
  status?: ReplacePermissionAssociationsWorkStatus;
  statusMessage?: string;
  creationTime?: Date;
  lastUpdatedTime?: Date;
}
export const ReplacePermissionAssociationsWork = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    fromPermissionArn: S.optional(S.String),
    fromPermissionVersion: S.optional(S.String),
    toPermissionArn: S.optional(S.String),
    toPermissionVersion: S.optional(S.String),
    status: S.optional(ReplacePermissionAssociationsWorkStatus),
    statusMessage: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ReplacePermissionAssociationsWork",
}) as any as S.Schema<ReplacePermissionAssociationsWork>;
export interface ReplacePermissionAssociationsResponse {
  replacePermissionAssociationsWork?: ReplacePermissionAssociationsWork;
  clientToken?: string;
}
export const ReplacePermissionAssociationsResponse = S.suspend(() =>
  S.Struct({
    replacePermissionAssociationsWork: S.optional(
      ReplacePermissionAssociationsWork,
    ),
    clientToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ReplacePermissionAssociationsResponse",
}) as any as S.Schema<ReplacePermissionAssociationsResponse>;
export interface SetDefaultPermissionVersionResponse {
  returnValue?: boolean;
  clientToken?: string;
}
export const SetDefaultPermissionVersionResponse = S.suspend(() =>
  S.Struct({
    returnValue: S.optional(S.Boolean).pipe(T.XmlName("return")),
    clientToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SetDefaultPermissionVersionResponse",
}) as any as S.Schema<SetDefaultPermissionVersionResponse>;
export type ResourceShareFeatureSet =
  | "CREATED_FROM_POLICY"
  | "PROMOTING_TO_STANDARD"
  | "STANDARD"
  | (string & {});
export const ResourceShareFeatureSet = S.String;
export interface ResourceShare {
  resourceShareArn?: string;
  name?: string;
  owningAccountId?: string;
  allowExternalPrincipals?: boolean;
  status?: ResourceShareStatus;
  statusMessage?: string;
  tags?: Tag[];
  creationTime?: Date;
  lastUpdatedTime?: Date;
  featureSet?: ResourceShareFeatureSet;
}
export const ResourceShare = S.suspend(() =>
  S.Struct({
    resourceShareArn: S.optional(S.String),
    name: S.optional(S.String),
    owningAccountId: S.optional(S.String),
    allowExternalPrincipals: S.optional(S.Boolean),
    status: S.optional(ResourceShareStatus),
    statusMessage: S.optional(S.String),
    tags: S.optional(TagList),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    featureSet: S.optional(ResourceShareFeatureSet),
  }),
).annotations({
  identifier: "ResourceShare",
}) as any as S.Schema<ResourceShare>;
export interface UpdateResourceShareResponse {
  resourceShare?: ResourceShare;
  clientToken?: string;
}
export const UpdateResourceShareResponse = S.suspend(() =>
  S.Struct({
    resourceShare: S.optional(ResourceShare),
    clientToken: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateResourceShareResponse",
}) as any as S.Schema<UpdateResourceShareResponse>;
export type ResourceShareList = ResourceShare[];
export const ResourceShareList = S.Array(
  ResourceShare.pipe(T.XmlName("item")).annotations({
    identifier: "ResourceShare",
  }),
);
export interface AssociatedPermission {
  arn?: string;
  permissionVersion?: string;
  defaultVersion?: boolean;
  resourceType?: string;
  status?: string;
  featureSet?: PermissionFeatureSet;
  lastUpdatedTime?: Date;
  resourceShareArn?: string;
}
export const AssociatedPermission = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    permissionVersion: S.optional(S.String),
    defaultVersion: S.optional(S.Boolean),
    resourceType: S.optional(S.String),
    status: S.optional(S.String),
    featureSet: S.optional(PermissionFeatureSet),
    lastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    resourceShareArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AssociatedPermission",
}) as any as S.Schema<AssociatedPermission>;
export type AssociatedPermissionList = AssociatedPermission[];
export const AssociatedPermissionList = S.Array(
  AssociatedPermission.pipe(T.XmlName("item")).annotations({
    identifier: "AssociatedPermission",
  }),
);
export interface Principal {
  id?: string;
  resourceShareArn?: string;
  creationTime?: Date;
  lastUpdatedTime?: Date;
  external?: boolean;
}
export const Principal = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    resourceShareArn: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    external: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Principal" }) as any as S.Schema<Principal>;
export type PrincipalList = Principal[];
export const PrincipalList = S.Array(
  Principal.pipe(T.XmlName("item")).annotations({ identifier: "Principal" }),
);
export type ReplacePermissionAssociationsWorkList =
  ReplacePermissionAssociationsWork[];
export const ReplacePermissionAssociationsWorkList = S.Array(
  ReplacePermissionAssociationsWork.pipe(T.XmlName("item")).annotations({
    identifier: "ReplacePermissionAssociationsWork",
  }),
);
export interface ServiceNameAndResourceType {
  resourceType?: string;
  serviceName?: string;
  resourceRegionScope?: ResourceRegionScope;
}
export const ServiceNameAndResourceType = S.suspend(() =>
  S.Struct({
    resourceType: S.optional(S.String),
    serviceName: S.optional(S.String),
    resourceRegionScope: S.optional(ResourceRegionScope),
  }),
).annotations({
  identifier: "ServiceNameAndResourceType",
}) as any as S.Schema<ServiceNameAndResourceType>;
export type ServiceNameAndResourceTypeList = ServiceNameAndResourceType[];
export const ServiceNameAndResourceTypeList = S.Array(
  ServiceNameAndResourceType.pipe(T.XmlName("item")).annotations({
    identifier: "ServiceNameAndResourceType",
  }),
);
export interface AcceptResourceShareInvitationResponse {
  resourceShareInvitation?: ResourceShareInvitation;
  clientToken?: string;
}
export const AcceptResourceShareInvitationResponse = S.suspend(() =>
  S.Struct({
    resourceShareInvitation: S.optional(ResourceShareInvitation),
    clientToken: S.optional(S.String),
  }),
).annotations({
  identifier: "AcceptResourceShareInvitationResponse",
}) as any as S.Schema<AcceptResourceShareInvitationResponse>;
export interface AssociateResourceShareResponse {
  resourceShareAssociations?: ResourceShareAssociation[];
  clientToken?: string;
}
export const AssociateResourceShareResponse = S.suspend(() =>
  S.Struct({
    resourceShareAssociations: S.optional(ResourceShareAssociationList),
    clientToken: S.optional(S.String),
  }),
).annotations({
  identifier: "AssociateResourceShareResponse",
}) as any as S.Schema<AssociateResourceShareResponse>;
export interface CreatePermissionResponse {
  permission?: ResourceSharePermissionSummary;
  clientToken?: string;
}
export const CreatePermissionResponse = S.suspend(() =>
  S.Struct({
    permission: S.optional(ResourceSharePermissionSummary),
    clientToken: S.optional(S.String),
  }),
).annotations({
  identifier: "CreatePermissionResponse",
}) as any as S.Schema<CreatePermissionResponse>;
export interface CreatePermissionVersionResponse {
  permission?: ResourceSharePermissionDetail;
  clientToken?: string;
}
export const CreatePermissionVersionResponse = S.suspend(() =>
  S.Struct({
    permission: S.optional(ResourceSharePermissionDetail),
    clientToken: S.optional(S.String),
  }),
).annotations({
  identifier: "CreatePermissionVersionResponse",
}) as any as S.Schema<CreatePermissionVersionResponse>;
export interface CreateResourceShareResponse {
  resourceShare?: ResourceShare;
  clientToken?: string;
}
export const CreateResourceShareResponse = S.suspend(() =>
  S.Struct({
    resourceShare: S.optional(ResourceShare),
    clientToken: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateResourceShareResponse",
}) as any as S.Schema<CreateResourceShareResponse>;
export interface GetResourceSharesResponse {
  resourceShares?: ResourceShare[];
  nextToken?: string;
}
export const GetResourceSharesResponse = S.suspend(() =>
  S.Struct({
    resourceShares: S.optional(ResourceShareList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetResourceSharesResponse",
}) as any as S.Schema<GetResourceSharesResponse>;
export interface ListPendingInvitationResourcesResponse {
  resources?: Resource[];
  nextToken?: string;
}
export const ListPendingInvitationResourcesResponse = S.suspend(() =>
  S.Struct({
    resources: S.optional(ResourceList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPendingInvitationResourcesResponse",
}) as any as S.Schema<ListPendingInvitationResourcesResponse>;
export interface ListPermissionAssociationsResponse {
  permissions?: AssociatedPermission[];
  nextToken?: string;
}
export const ListPermissionAssociationsResponse = S.suspend(() =>
  S.Struct({
    permissions: S.optional(AssociatedPermissionList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPermissionAssociationsResponse",
}) as any as S.Schema<ListPermissionAssociationsResponse>;
export interface ListPermissionsResponse {
  permissions?: ResourceSharePermissionSummary[];
  nextToken?: string;
}
export const ListPermissionsResponse = S.suspend(() =>
  S.Struct({
    permissions: S.optional(ResourceSharePermissionList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPermissionsResponse",
}) as any as S.Schema<ListPermissionsResponse>;
export interface ListPrincipalsResponse {
  principals?: Principal[];
  nextToken?: string;
}
export const ListPrincipalsResponse = S.suspend(() =>
  S.Struct({
    principals: S.optional(PrincipalList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPrincipalsResponse",
}) as any as S.Schema<ListPrincipalsResponse>;
export interface ListReplacePermissionAssociationsWorkResponse {
  replacePermissionAssociationsWorks?: ReplacePermissionAssociationsWork[];
  nextToken?: string;
}
export const ListReplacePermissionAssociationsWorkResponse = S.suspend(() =>
  S.Struct({
    replacePermissionAssociationsWorks: S.optional(
      ReplacePermissionAssociationsWorkList,
    ),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListReplacePermissionAssociationsWorkResponse",
}) as any as S.Schema<ListReplacePermissionAssociationsWorkResponse>;
export interface ListResourceTypesResponse {
  resourceTypes?: ServiceNameAndResourceType[];
  nextToken?: string;
}
export const ListResourceTypesResponse = S.suspend(() =>
  S.Struct({
    resourceTypes: S.optional(ServiceNameAndResourceTypeList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListResourceTypesResponse",
}) as any as S.Schema<ListResourceTypesResponse>;

//# Errors
export class OperationNotPermittedException extends S.TaggedError<OperationNotPermittedException>()(
  "OperationNotPermittedException",
  { message: S.String },
  T.AwsQueryError({ code: "OperationNotPermitted", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { message: S.String },
  T.AwsQueryError({ code: "InvalidParameter", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidClientTokenException extends S.TaggedError<InvalidClientTokenException>()(
  "InvalidClientTokenException",
  { message: S.String },
  T.AwsQueryError({ code: "InvalidClientToken", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class IdempotentParameterMismatchException extends S.TaggedError<IdempotentParameterMismatchException>()(
  "IdempotentParameterMismatchException",
  { message: S.String },
  T.AwsQueryError({
    code: "IdempotentParameterMismatch",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ServerInternalException extends S.TaggedError<ServerInternalException>()(
  "ServerInternalException",
  { message: S.String },
  T.AwsQueryError({ code: "InternalError", httpResponseCode: 500 }),
).pipe(C.withServerError) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { message: S.String },
  T.AwsQueryError({ code: "InvalidNextToken", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidMaxResultsException extends S.TaggedError<InvalidMaxResultsException>()(
  "InvalidMaxResultsException",
  { message: S.String },
  T.AwsQueryError({ code: "InvalidMaxResults", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class MalformedArnException extends S.TaggedError<MalformedArnException>()(
  "MalformedArnException",
  { message: S.String },
  T.AwsQueryError({ code: "InvalidArn.Malformed", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidStateTransitionException extends S.TaggedError<InvalidStateTransitionException>()(
  "InvalidStateTransitionException",
  { message: S.String },
  T.AwsQueryError({
    code: "InvalidStateTransitionException.Unknown",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.String },
  T.AwsQueryError({ code: "Unavailable", httpResponseCode: 503 }),
).pipe(C.withServerError) {}
export class ResourceArnNotFoundException extends S.TaggedError<ResourceArnNotFoundException>()(
  "ResourceArnNotFoundException",
  { message: S.String },
  T.AwsQueryError({
    code: "InvalidResourceArn.NotFound",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ResourceShareInvitationAlreadyAcceptedException extends S.TaggedError<ResourceShareInvitationAlreadyAcceptedException>()(
  "ResourceShareInvitationAlreadyAcceptedException",
  { message: S.String },
  T.AwsQueryError({
    code: "InvalidResourceShareInvitationArn.AlreadyAccepted",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class MissingRequiredParameterException extends S.TaggedError<MissingRequiredParameterException>()(
  "MissingRequiredParameterException",
  { message: S.String },
  T.AwsQueryError({ code: "MissingRequiredParameter", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidPolicyException extends S.TaggedError<InvalidPolicyException>()(
  "InvalidPolicyException",
  { message: S.String },
  T.AwsQueryError({ code: "InvalidPolicy", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidResourceTypeException extends S.TaggedError<InvalidResourceTypeException>()(
  "InvalidResourceTypeException",
  { message: S.String },
  T.AwsQueryError({
    code: "InvalidResourceType.Unknown",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ResourceShareInvitationArnNotFoundException extends S.TaggedError<ResourceShareInvitationArnNotFoundException>()(
  "ResourceShareInvitationArnNotFoundException",
  { message: S.String },
  T.AwsQueryError({
    code: "InvalidResourceShareInvitationArn.NotFound",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ResourceShareLimitExceededException extends S.TaggedError<ResourceShareLimitExceededException>()(
  "ResourceShareLimitExceededException",
  { message: S.String },
  T.AwsQueryError({
    code: "ResourceShareLimitExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class TagLimitExceededException extends S.TaggedError<TagLimitExceededException>()(
  "TagLimitExceededException",
  { message: S.String },
  T.AwsQueryError({ code: "TagLimitExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ResourceShareInvitationAlreadyRejectedException extends S.TaggedError<ResourceShareInvitationAlreadyRejectedException>()(
  "ResourceShareInvitationAlreadyRejectedException",
  { message: S.String },
  T.AwsQueryError({
    code: "InvalidResourceShareInvitationArn.AlreadyRejected",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class UnknownResourceException extends S.TaggedError<UnknownResourceException>()(
  "UnknownResourceException",
  { message: S.String },
  T.AwsQueryError({
    code: "InvalidResourceShareArn.NotFound",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class MalformedPolicyTemplateException extends S.TaggedError<MalformedPolicyTemplateException>()(
  "MalformedPolicyTemplateException",
  { message: S.String },
  T.AwsQueryError({
    code: "MalformedPolicyTemplateException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
  T.AwsQueryError({ code: "ThrottlingException", httpResponseCode: 429 }),
).pipe(C.withThrottlingError) {}
export class TagPolicyViolationException extends S.TaggedError<TagPolicyViolationException>()(
  "TagPolicyViolationException",
  { message: S.String },
  T.AwsQueryError({ code: "TagPolicyViolation", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ResourceShareInvitationExpiredException extends S.TaggedError<ResourceShareInvitationExpiredException>()(
  "ResourceShareInvitationExpiredException",
  { message: S.String },
  T.AwsQueryError({
    code: "InvalidResourceShareInvitationArn.Expired",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class PermissionAlreadyExistsException extends S.TaggedError<PermissionAlreadyExistsException>()(
  "PermissionAlreadyExistsException",
  { message: S.String },
  T.AwsQueryError({
    code: "PermissionAlreadyExistsException",
    httpResponseCode: 409,
  }),
).pipe(C.withConflictError) {}
export class UnmatchedPolicyPermissionException extends S.TaggedError<UnmatchedPolicyPermissionException>()(
  "UnmatchedPolicyPermissionException",
  { message: S.String },
  T.AwsQueryError({
    code: "UnmatchedPolicyPermissionException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class PermissionVersionsLimitExceededException extends S.TaggedError<PermissionVersionsLimitExceededException>()(
  "PermissionVersionsLimitExceededException",
  { message: S.String },
  T.AwsQueryError({
    code: "PermissionVersionsLimitExceededException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class PermissionLimitExceededException extends S.TaggedError<PermissionLimitExceededException>()(
  "PermissionLimitExceededException",
  { message: S.String },
  T.AwsQueryError({
    code: "PermissionLimitExceededException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Enables resource sharing within your organization in Organizations. This operation creates
 * a service-linked role called `AWSServiceRoleForResourceAccessManager` that has the IAM managed policy
 * named AWSResourceAccessManagerServiceRolePolicy attached. This role permits RAM to retrieve information about
 * the organization and its structure. This lets you share resources with all of the
 * accounts in the calling account's organization by specifying the organization ID, or all
 * of the accounts in an organizational unit (OU) by specifying the OU ID. Until you enable
 * sharing within the organization, you can specify only individual Amazon Web Services accounts, or for
 * supported resource types, IAM roles and users.
 *
 * You must call this operation from an IAM role or user in the organization's
 * management account.
 */
export const enableSharingWithAwsOrganization: (
  input: EnableSharingWithAwsOrganizationRequest,
) => effect.Effect<
  EnableSharingWithAwsOrganizationResponse,
  | OperationNotPermittedException
  | ServerInternalException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableSharingWithAwsOrganizationRequest,
  output: EnableSharingWithAwsOrganizationResponse,
  errors: [
    OperationNotPermittedException,
    ServerInternalException,
    ServiceUnavailableException,
  ],
}));
/**
 * Retrieves a list of available RAM permissions that you can use for the supported
 * resource types.
 */
export const listPermissions: {
  (
    input: ListPermissionsRequest,
  ): effect.Effect<
    ListPermissionsResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | OperationNotPermittedException
    | ServerInternalException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPermissionsRequest,
  ) => stream.Stream<
    ListPermissionsResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | OperationNotPermittedException
    | ServerInternalException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPermissionsRequest,
  ) => stream.Stream<
    unknown,
    | InvalidNextTokenException
    | InvalidParameterException
    | OperationNotPermittedException
    | ServerInternalException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPermissionsRequest,
  output: ListPermissionsResponse,
  errors: [
    InvalidNextTokenException,
    InvalidParameterException,
    OperationNotPermittedException,
    ServerInternalException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves the current status of the asynchronous tasks performed by RAM when you
 * perform the ReplacePermissionAssociationsWork operation.
 */
export const listReplacePermissionAssociationsWork: {
  (
    input: ListReplacePermissionAssociationsWorkRequest,
  ): effect.Effect<
    ListReplacePermissionAssociationsWorkResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | ServerInternalException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListReplacePermissionAssociationsWorkRequest,
  ) => stream.Stream<
    ListReplacePermissionAssociationsWorkResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | ServerInternalException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListReplacePermissionAssociationsWorkRequest,
  ) => stream.Stream<
    unknown,
    | InvalidNextTokenException
    | InvalidParameterException
    | ServerInternalException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListReplacePermissionAssociationsWorkRequest,
  output: ListReplacePermissionAssociationsWorkResponse,
  errors: [
    InvalidNextTokenException,
    InvalidParameterException,
    ServerInternalException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the resource types that can be shared by RAM.
 */
export const listResourceTypes: {
  (
    input: ListResourceTypesRequest,
  ): effect.Effect<
    ListResourceTypesResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | ServerInternalException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceTypesRequest,
  ) => stream.Stream<
    ListResourceTypesResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | ServerInternalException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceTypesRequest,
  ) => stream.Stream<
    unknown,
    | InvalidNextTokenException
    | InvalidParameterException
    | ServerInternalException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourceTypesRequest,
  output: ListResourceTypesResponse,
  errors: [
    InvalidNextTokenException,
    InvalidParameterException,
    ServerInternalException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists information about the managed permission and its associations to any resource shares that use
 * this managed permission. This lets you see which resource shares use which versions of the specified
 * managed permission.
 */
export const listPermissionAssociations: {
  (
    input: ListPermissionAssociationsRequest,
  ): effect.Effect<
    ListPermissionAssociationsResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | ServerInternalException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPermissionAssociationsRequest,
  ) => stream.Stream<
    ListPermissionAssociationsResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | ServerInternalException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPermissionAssociationsRequest,
  ) => stream.Stream<
    unknown,
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | ServerInternalException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPermissionAssociationsRequest,
  output: ListPermissionAssociationsResponse,
  errors: [
    InvalidNextTokenException,
    InvalidParameterException,
    MalformedArnException,
    ServerInternalException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves the resource policies for the specified resources that you own and have
 * shared.
 */
export const getResourcePolicies: {
  (
    input: GetResourcePoliciesRequest,
  ): effect.Effect<
    GetResourcePoliciesResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | ResourceArnNotFoundException
    | ServerInternalException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetResourcePoliciesRequest,
  ) => stream.Stream<
    GetResourcePoliciesResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | ResourceArnNotFoundException
    | ServerInternalException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetResourcePoliciesRequest,
  ) => stream.Stream<
    unknown,
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | ResourceArnNotFoundException
    | ServerInternalException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetResourcePoliciesRequest,
  output: GetResourcePoliciesResponse,
  errors: [
    InvalidNextTokenException,
    InvalidParameterException,
    MalformedArnException,
    ResourceArnNotFoundException,
    ServerInternalException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Modifies some of the properties of the specified resource share.
 */
export const updateResourceShare: (
  input: UpdateResourceShareRequest,
) => effect.Effect<
  UpdateResourceShareResponse,
  | IdempotentParameterMismatchException
  | InvalidClientTokenException
  | InvalidParameterException
  | MalformedArnException
  | MissingRequiredParameterException
  | OperationNotPermittedException
  | ServerInternalException
  | ServiceUnavailableException
  | UnknownResourceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResourceShareRequest,
  output: UpdateResourceShareResponse,
  errors: [
    IdempotentParameterMismatchException,
    InvalidClientTokenException,
    InvalidParameterException,
    MalformedArnException,
    MissingRequiredParameterException,
    OperationNotPermittedException,
    ServerInternalException,
    ServiceUnavailableException,
    UnknownResourceException,
  ],
}));
/**
 * Deletes one version of a customer managed permission. The version you specify must not be attached to any
 * resource share and must not be the default version for the permission.
 *
 * If a customer managed permission has the maximum of 5 versions, then you must delete at
 * least one version before you can create another.
 */
export const deletePermissionVersion: (
  input: DeletePermissionVersionRequest,
) => effect.Effect<
  DeletePermissionVersionResponse,
  | IdempotentParameterMismatchException
  | InvalidClientTokenException
  | InvalidParameterException
  | MalformedArnException
  | OperationNotPermittedException
  | ServerInternalException
  | ServiceUnavailableException
  | UnknownResourceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePermissionVersionRequest,
  output: DeletePermissionVersionResponse,
  errors: [
    IdempotentParameterMismatchException,
    InvalidClientTokenException,
    InvalidParameterException,
    MalformedArnException,
    OperationNotPermittedException,
    ServerInternalException,
    ServiceUnavailableException,
    UnknownResourceException,
  ],
}));
/**
 * Updates all resource shares that use a managed permission to a different managed
 * permission. This operation always applies the default version of the target managed
 * permission. You can optionally specify that the update applies to only resource shares that
 * currently use a specified version. This enables you to update to the latest version,
 * without changing the which managed permission is used.
 *
 * You can use this operation to update all of your resource shares to use the current
 * default version of the permission by specifying the same value for the
 * `fromPermissionArn` and `toPermissionArn` parameters.
 *
 * You can use the optional `fromPermissionVersion` parameter to update only
 * those resources that use a specified version of the managed permission to the new managed
 * permission.
 *
 * To successfully perform this operation, you must have permission to update the
 * resource-based policy on all affected resource types.
 */
export const replacePermissionAssociations: (
  input: ReplacePermissionAssociationsRequest,
) => effect.Effect<
  ReplacePermissionAssociationsResponse,
  | IdempotentParameterMismatchException
  | InvalidClientTokenException
  | InvalidParameterException
  | MalformedArnException
  | OperationNotPermittedException
  | ServerInternalException
  | ServiceUnavailableException
  | UnknownResourceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReplacePermissionAssociationsRequest,
  output: ReplacePermissionAssociationsResponse,
  errors: [
    IdempotentParameterMismatchException,
    InvalidClientTokenException,
    InvalidParameterException,
    MalformedArnException,
    OperationNotPermittedException,
    ServerInternalException,
    ServiceUnavailableException,
    UnknownResourceException,
  ],
}));
/**
 * Designates the specified version number as the default version for the specified
 * customer managed permission. New resource shares automatically use this new default permission. Existing
 * resource shares continue to use their original permission version, but you can use ReplacePermissionAssociations to update them.
 */
export const setDefaultPermissionVersion: (
  input: SetDefaultPermissionVersionRequest,
) => effect.Effect<
  SetDefaultPermissionVersionResponse,
  | IdempotentParameterMismatchException
  | InvalidClientTokenException
  | InvalidParameterException
  | MalformedArnException
  | ServerInternalException
  | ServiceUnavailableException
  | UnknownResourceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetDefaultPermissionVersionRequest,
  output: SetDefaultPermissionVersionResponse,
  errors: [
    IdempotentParameterMismatchException,
    InvalidClientTokenException,
    InvalidParameterException,
    MalformedArnException,
    ServerInternalException,
    ServiceUnavailableException,
    UnknownResourceException,
  ],
}));
/**
 * Retrieves the lists of resources and principals that associated for resource shares that you
 * own.
 */
export const getResourceShareAssociations: {
  (
    input: GetResourceShareAssociationsRequest,
  ): effect.Effect<
    GetResourceShareAssociationsResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | OperationNotPermittedException
    | ServerInternalException
    | ServiceUnavailableException
    | UnknownResourceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetResourceShareAssociationsRequest,
  ) => stream.Stream<
    GetResourceShareAssociationsResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | OperationNotPermittedException
    | ServerInternalException
    | ServiceUnavailableException
    | UnknownResourceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetResourceShareAssociationsRequest,
  ) => stream.Stream<
    unknown,
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | OperationNotPermittedException
    | ServerInternalException
    | ServiceUnavailableException
    | UnknownResourceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetResourceShareAssociationsRequest,
  output: GetResourceShareAssociationsResponse,
  errors: [
    InvalidNextTokenException,
    InvalidParameterException,
    MalformedArnException,
    OperationNotPermittedException,
    ServerInternalException,
    ServiceUnavailableException,
    UnknownResourceException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the available versions of the specified RAM permission.
 */
export const listPermissionVersions: {
  (
    input: ListPermissionVersionsRequest,
  ): effect.Effect<
    ListPermissionVersionsResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | OperationNotPermittedException
    | ServerInternalException
    | ServiceUnavailableException
    | UnknownResourceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPermissionVersionsRequest,
  ) => stream.Stream<
    ListPermissionVersionsResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | OperationNotPermittedException
    | ServerInternalException
    | ServiceUnavailableException
    | UnknownResourceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPermissionVersionsRequest,
  ) => stream.Stream<
    unknown,
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | OperationNotPermittedException
    | ServerInternalException
    | ServiceUnavailableException
    | UnknownResourceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPermissionVersionsRequest,
  output: ListPermissionVersionsResponse,
  errors: [
    InvalidNextTokenException,
    InvalidParameterException,
    MalformedArnException,
    OperationNotPermittedException,
    ServerInternalException,
    ServiceUnavailableException,
    UnknownResourceException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the RAM permissions that are associated with a resource share.
 */
export const listResourceSharePermissions: {
  (
    input: ListResourceSharePermissionsRequest,
  ): effect.Effect<
    ListResourceSharePermissionsResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | OperationNotPermittedException
    | ServerInternalException
    | ServiceUnavailableException
    | UnknownResourceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceSharePermissionsRequest,
  ) => stream.Stream<
    ListResourceSharePermissionsResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | OperationNotPermittedException
    | ServerInternalException
    | ServiceUnavailableException
    | UnknownResourceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceSharePermissionsRequest,
  ) => stream.Stream<
    unknown,
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | OperationNotPermittedException
    | ServerInternalException
    | ServiceUnavailableException
    | UnknownResourceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourceSharePermissionsRequest,
  output: ListResourceSharePermissionsResponse,
  errors: [
    InvalidNextTokenException,
    InvalidParameterException,
    MalformedArnException,
    OperationNotPermittedException,
    ServerInternalException,
    ServiceUnavailableException,
    UnknownResourceException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Removes the specified tag key and value pairs from the specified resource share or managed permission.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InvalidParameterException
  | MalformedArnException
  | ServerInternalException
  | ServiceUnavailableException
  | UnknownResourceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InvalidParameterException,
    MalformedArnException,
    ServerInternalException,
    ServiceUnavailableException,
    UnknownResourceException,
  ],
}));
/**
 * Retrieves the contents of a managed permission in JSON format.
 */
export const getPermission: (
  input: GetPermissionRequest,
) => effect.Effect<
  GetPermissionResponse,
  | InvalidParameterException
  | MalformedArnException
  | OperationNotPermittedException
  | ServerInternalException
  | ServiceUnavailableException
  | UnknownResourceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPermissionRequest,
  output: GetPermissionResponse,
  errors: [
    InvalidParameterException,
    MalformedArnException,
    OperationNotPermittedException,
    ServerInternalException,
    ServiceUnavailableException,
    UnknownResourceException,
  ],
}));
/**
 * Adds or replaces the RAM permission for a resource type included in a resource share. You can
 * have exactly one permission associated with each resource type in the resource share. You can add
 * a new RAM permission only if there are currently no resources of that resource type
 * currently in the resource share.
 */
export const associateResourceSharePermission: (
  input: AssociateResourceSharePermissionRequest,
) => effect.Effect<
  AssociateResourceSharePermissionResponse,
  | InvalidClientTokenException
  | InvalidParameterException
  | MalformedArnException
  | OperationNotPermittedException
  | ServerInternalException
  | ServiceUnavailableException
  | UnknownResourceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateResourceSharePermissionRequest,
  output: AssociateResourceSharePermissionResponse,
  errors: [
    InvalidClientTokenException,
    InvalidParameterException,
    MalformedArnException,
    OperationNotPermittedException,
    ServerInternalException,
    ServiceUnavailableException,
    UnknownResourceException,
  ],
}));
/**
 * Deletes the specified customer managed permission in the Amazon Web Services Region in which you call this operation. You
 * can delete a customer managed permission only if it isn't attached to any resource share. The operation deletes all
 * versions associated with the customer managed permission.
 */
export const deletePermission: (
  input: DeletePermissionRequest,
) => effect.Effect<
  DeletePermissionResponse,
  | IdempotentParameterMismatchException
  | InvalidClientTokenException
  | MalformedArnException
  | OperationNotPermittedException
  | ServerInternalException
  | ServiceUnavailableException
  | UnknownResourceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePermissionRequest,
  output: DeletePermissionResponse,
  errors: [
    IdempotentParameterMismatchException,
    InvalidClientTokenException,
    MalformedArnException,
    OperationNotPermittedException,
    ServerInternalException,
    ServiceUnavailableException,
    UnknownResourceException,
  ],
}));
/**
 * Retrieves details about the resource shares that you own or that are shared with you.
 */
export const getResourceShares: {
  (
    input: GetResourceSharesRequest,
  ): effect.Effect<
    GetResourceSharesResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | ServerInternalException
    | ServiceUnavailableException
    | UnknownResourceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetResourceSharesRequest,
  ) => stream.Stream<
    GetResourceSharesResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | ServerInternalException
    | ServiceUnavailableException
    | UnknownResourceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetResourceSharesRequest,
  ) => stream.Stream<
    unknown,
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | ServerInternalException
    | ServiceUnavailableException
    | UnknownResourceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetResourceSharesRequest,
  output: GetResourceSharesResponse,
  errors: [
    InvalidNextTokenException,
    InvalidParameterException,
    MalformedArnException,
    ServerInternalException,
    ServiceUnavailableException,
    UnknownResourceException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the principals that you are sharing resources with or that are sharing resources
 * with you.
 */
export const listPrincipals: {
  (
    input: ListPrincipalsRequest,
  ): effect.Effect<
    ListPrincipalsResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | ServerInternalException
    | ServiceUnavailableException
    | UnknownResourceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPrincipalsRequest,
  ) => stream.Stream<
    ListPrincipalsResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | ServerInternalException
    | ServiceUnavailableException
    | UnknownResourceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPrincipalsRequest,
  ) => stream.Stream<
    unknown,
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | ServerInternalException
    | ServiceUnavailableException
    | UnknownResourceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPrincipalsRequest,
  output: ListPrincipalsResponse,
  errors: [
    InvalidNextTokenException,
    InvalidParameterException,
    MalformedArnException,
    ServerInternalException,
    ServiceUnavailableException,
    UnknownResourceException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Removes a managed permission from a resource share. Permission changes take effect immediately. You can
 * remove a managed permission from a resource share only if there are currently no resources of the relevant
 * resource type currently attached to the resource share.
 */
export const disassociateResourceSharePermission: (
  input: DisassociateResourceSharePermissionRequest,
) => effect.Effect<
  DisassociateResourceSharePermissionResponse,
  | InvalidClientTokenException
  | InvalidParameterException
  | InvalidStateTransitionException
  | MalformedArnException
  | OperationNotPermittedException
  | ServerInternalException
  | ServiceUnavailableException
  | UnknownResourceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateResourceSharePermissionRequest,
  output: DisassociateResourceSharePermissionResponse,
  errors: [
    InvalidClientTokenException,
    InvalidParameterException,
    InvalidStateTransitionException,
    MalformedArnException,
    OperationNotPermittedException,
    ServerInternalException,
    ServiceUnavailableException,
    UnknownResourceException,
  ],
}));
/**
 * Deletes the specified resource share.
 *
 * This doesn't delete any of the resources that were associated with the resource share; it
 * only stops the sharing of those resources through this resource share.
 */
export const deleteResourceShare: (
  input: DeleteResourceShareRequest,
) => effect.Effect<
  DeleteResourceShareResponse,
  | IdempotentParameterMismatchException
  | InvalidClientTokenException
  | InvalidParameterException
  | InvalidStateTransitionException
  | MalformedArnException
  | OperationNotPermittedException
  | ServerInternalException
  | ServiceUnavailableException
  | UnknownResourceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourceShareRequest,
  output: DeleteResourceShareResponse,
  errors: [
    IdempotentParameterMismatchException,
    InvalidClientTokenException,
    InvalidParameterException,
    InvalidStateTransitionException,
    MalformedArnException,
    OperationNotPermittedException,
    ServerInternalException,
    ServiceUnavailableException,
    UnknownResourceException,
  ],
}));
/**
 * Lists the resources that you added to a resource share or the resources that are shared with
 * you.
 */
export const listResources: {
  (
    input: ListResourcesRequest,
  ): effect.Effect<
    ListResourcesResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidResourceTypeException
    | MalformedArnException
    | ServerInternalException
    | ServiceUnavailableException
    | UnknownResourceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourcesRequest,
  ) => stream.Stream<
    ListResourcesResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidResourceTypeException
    | MalformedArnException
    | ServerInternalException
    | ServiceUnavailableException
    | UnknownResourceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResourcesRequest,
  ) => stream.Stream<
    unknown,
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidResourceTypeException
    | MalformedArnException
    | ServerInternalException
    | ServiceUnavailableException
    | UnknownResourceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourcesRequest,
  output: ListResourcesResponse,
  errors: [
    InvalidNextTokenException,
    InvalidParameterException,
    InvalidResourceTypeException,
    MalformedArnException,
    ServerInternalException,
    ServiceUnavailableException,
    UnknownResourceException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves details about invitations that you have received for resource shares.
 */
export const getResourceShareInvitations: {
  (
    input: GetResourceShareInvitationsRequest,
  ): effect.Effect<
    GetResourceShareInvitationsResponse,
    | InvalidMaxResultsException
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | ResourceShareInvitationArnNotFoundException
    | ServerInternalException
    | ServiceUnavailableException
    | UnknownResourceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetResourceShareInvitationsRequest,
  ) => stream.Stream<
    GetResourceShareInvitationsResponse,
    | InvalidMaxResultsException
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | ResourceShareInvitationArnNotFoundException
    | ServerInternalException
    | ServiceUnavailableException
    | UnknownResourceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetResourceShareInvitationsRequest,
  ) => stream.Stream<
    unknown,
    | InvalidMaxResultsException
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | ResourceShareInvitationArnNotFoundException
    | ServerInternalException
    | ServiceUnavailableException
    | UnknownResourceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetResourceShareInvitationsRequest,
  output: GetResourceShareInvitationsResponse,
  errors: [
    InvalidMaxResultsException,
    InvalidNextTokenException,
    InvalidParameterException,
    MalformedArnException,
    ResourceShareInvitationArnNotFoundException,
    ServerInternalException,
    ServiceUnavailableException,
    UnknownResourceException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * When you attach a resource-based policy to a resource, RAM automatically creates
 * a resource share of `featureSet`=`CREATED_FROM_POLICY` with a managed permission that
 * has the same IAM permissions as the original resource-based policy. However, this type
 * of managed permission is visible to only the resource share owner, and the associated resource share can't be modified by
 * using RAM.
 *
 * This operation creates a separate, fully manageable customer managed permission that has the same IAM
 * permissions as the original resource-based policy. You can associate this customer managed permission to any
 * resource shares.
 *
 * Before you use PromoteResourceShareCreatedFromPolicy, you should
 * first run this operation to ensure that you have an appropriate customer managed permission that can be
 * associated with the promoted resource share.
 *
 * - The original `CREATED_FROM_POLICY` policy isn't deleted, and
 * resource shares using that original policy aren't automatically
 * updated.
 *
 * - You can't modify a `CREATED_FROM_POLICY` resource share so you can't
 * associate the new customer managed permission by using
 * `ReplacePermsissionAssociations`. However, if you use PromoteResourceShareCreatedFromPolicy, that operation
 * automatically associates the fully manageable customer managed permission to the newly promoted
 * `STANDARD` resource share.
 *
 * - After you promote a resource share, if the original `CREATED_FROM_POLICY`
 * managed permission has no other associations to A resource share, then RAM automatically deletes
 * it.
 */
export const promotePermissionCreatedFromPolicy: (
  input: PromotePermissionCreatedFromPolicyRequest,
) => effect.Effect<
  PromotePermissionCreatedFromPolicyResponse,
  | InvalidParameterException
  | MalformedArnException
  | MissingRequiredParameterException
  | OperationNotPermittedException
  | ServerInternalException
  | ServiceUnavailableException
  | UnknownResourceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PromotePermissionCreatedFromPolicyRequest,
  output: PromotePermissionCreatedFromPolicyResponse,
  errors: [
    InvalidParameterException,
    MalformedArnException,
    MissingRequiredParameterException,
    OperationNotPermittedException,
    ServerInternalException,
    ServiceUnavailableException,
    UnknownResourceException,
  ],
}));
/**
 * Removes the specified principals or resources from participating in the specified
 * resource share.
 */
export const disassociateResourceShare: (
  input: DisassociateResourceShareRequest,
) => effect.Effect<
  DisassociateResourceShareResponse,
  | IdempotentParameterMismatchException
  | InvalidClientTokenException
  | InvalidParameterException
  | InvalidStateTransitionException
  | MalformedArnException
  | OperationNotPermittedException
  | ResourceShareLimitExceededException
  | ServerInternalException
  | ServiceUnavailableException
  | UnknownResourceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateResourceShareRequest,
  output: DisassociateResourceShareResponse,
  errors: [
    IdempotentParameterMismatchException,
    InvalidClientTokenException,
    InvalidParameterException,
    InvalidStateTransitionException,
    MalformedArnException,
    OperationNotPermittedException,
    ResourceShareLimitExceededException,
    ServerInternalException,
    ServiceUnavailableException,
    UnknownResourceException,
  ],
}));
/**
 * Adds the specified list of principals and list of resources to a resource share. Principals that
 * already have access to this resource share immediately receive access to the added resources.
 * Newly added principals immediately receive access to the resources shared in this resource share.
 */
export const associateResourceShare: (
  input: AssociateResourceShareRequest,
) => effect.Effect<
  AssociateResourceShareResponse,
  | IdempotentParameterMismatchException
  | InvalidClientTokenException
  | InvalidParameterException
  | InvalidStateTransitionException
  | MalformedArnException
  | OperationNotPermittedException
  | ResourceShareLimitExceededException
  | ServerInternalException
  | ServiceUnavailableException
  | ThrottlingException
  | UnknownResourceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateResourceShareRequest,
  output: AssociateResourceShareResponse,
  errors: [
    IdempotentParameterMismatchException,
    InvalidClientTokenException,
    InvalidParameterException,
    InvalidStateTransitionException,
    MalformedArnException,
    OperationNotPermittedException,
    ResourceShareLimitExceededException,
    ServerInternalException,
    ServiceUnavailableException,
    ThrottlingException,
    UnknownResourceException,
  ],
}));
/**
 * Adds the specified tag keys and values to a resource share or managed permission. If you choose a resource share, the
 * tags are attached to only the resource share, not to the resources that are in the resource share.
 *
 * The tags on a managed permission are the same for all versions of the managed permission.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InvalidParameterException
  | MalformedArnException
  | ResourceArnNotFoundException
  | ServerInternalException
  | ServiceUnavailableException
  | TagLimitExceededException
  | TagPolicyViolationException
  | UnknownResourceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InvalidParameterException,
    MalformedArnException,
    ResourceArnNotFoundException,
    ServerInternalException,
    ServiceUnavailableException,
    TagLimitExceededException,
    TagPolicyViolationException,
    UnknownResourceException,
  ],
}));
/**
 * Rejects an invitation to a resource share from another Amazon Web Services account.
 */
export const rejectResourceShareInvitation: (
  input: RejectResourceShareInvitationRequest,
) => effect.Effect<
  RejectResourceShareInvitationResponse,
  | IdempotentParameterMismatchException
  | InvalidClientTokenException
  | MalformedArnException
  | OperationNotPermittedException
  | ResourceShareInvitationAlreadyAcceptedException
  | ResourceShareInvitationAlreadyRejectedException
  | ResourceShareInvitationArnNotFoundException
  | ResourceShareInvitationExpiredException
  | ServerInternalException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectResourceShareInvitationRequest,
  output: RejectResourceShareInvitationResponse,
  errors: [
    IdempotentParameterMismatchException,
    InvalidClientTokenException,
    MalformedArnException,
    OperationNotPermittedException,
    ResourceShareInvitationAlreadyAcceptedException,
    ResourceShareInvitationAlreadyRejectedException,
    ResourceShareInvitationArnNotFoundException,
    ResourceShareInvitationExpiredException,
    ServerInternalException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates a resource share. You can provide a list of the Amazon Resource Names (ARNs) for the resources that you
 * want to share, a list of principals you want to share the resources with, and the
 * permissions to grant those principals.
 *
 * Sharing a resource makes it available for use by principals outside of the
 * Amazon Web Services account that created the resource. Sharing doesn't change any permissions or
 * quotas that apply to the resource in the account that created it.
 */
export const createResourceShare: (
  input: CreateResourceShareRequest,
) => effect.Effect<
  CreateResourceShareResponse,
  | IdempotentParameterMismatchException
  | InvalidClientTokenException
  | InvalidParameterException
  | InvalidStateTransitionException
  | MalformedArnException
  | OperationNotPermittedException
  | ResourceShareLimitExceededException
  | ServerInternalException
  | ServiceUnavailableException
  | TagLimitExceededException
  | TagPolicyViolationException
  | UnknownResourceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateResourceShareRequest,
  output: CreateResourceShareResponse,
  errors: [
    IdempotentParameterMismatchException,
    InvalidClientTokenException,
    InvalidParameterException,
    InvalidStateTransitionException,
    MalformedArnException,
    OperationNotPermittedException,
    ResourceShareLimitExceededException,
    ServerInternalException,
    ServiceUnavailableException,
    TagLimitExceededException,
    TagPolicyViolationException,
    UnknownResourceException,
  ],
}));
/**
 * Accepts an invitation to a resource share from another Amazon Web Services account. After you accept the
 * invitation, the resources included in the resource share are available to interact with in the
 * relevant Amazon Web Services Management Consoles and tools.
 */
export const acceptResourceShareInvitation: (
  input: AcceptResourceShareInvitationRequest,
) => effect.Effect<
  AcceptResourceShareInvitationResponse,
  | IdempotentParameterMismatchException
  | InvalidClientTokenException
  | MalformedArnException
  | OperationNotPermittedException
  | ResourceShareInvitationAlreadyAcceptedException
  | ResourceShareInvitationAlreadyRejectedException
  | ResourceShareInvitationArnNotFoundException
  | ResourceShareInvitationExpiredException
  | ServerInternalException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptResourceShareInvitationRequest,
  output: AcceptResourceShareInvitationResponse,
  errors: [
    IdempotentParameterMismatchException,
    InvalidClientTokenException,
    MalformedArnException,
    OperationNotPermittedException,
    ResourceShareInvitationAlreadyAcceptedException,
    ResourceShareInvitationAlreadyRejectedException,
    ResourceShareInvitationArnNotFoundException,
    ResourceShareInvitationExpiredException,
    ServerInternalException,
    ServiceUnavailableException,
  ],
}));
/**
 * Lists the resources in a resource share that is shared with you but for which the invitation is
 * still `PENDING`. That means that you haven't accepted or rejected the
 * invitation and the invitation hasn't expired.
 */
export const listPendingInvitationResources: {
  (
    input: ListPendingInvitationResourcesRequest,
  ): effect.Effect<
    ListPendingInvitationResourcesResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | MissingRequiredParameterException
    | ResourceShareInvitationAlreadyRejectedException
    | ResourceShareInvitationArnNotFoundException
    | ResourceShareInvitationExpiredException
    | ServerInternalException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPendingInvitationResourcesRequest,
  ) => stream.Stream<
    ListPendingInvitationResourcesResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | MissingRequiredParameterException
    | ResourceShareInvitationAlreadyRejectedException
    | ResourceShareInvitationArnNotFoundException
    | ResourceShareInvitationExpiredException
    | ServerInternalException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPendingInvitationResourcesRequest,
  ) => stream.Stream<
    unknown,
    | InvalidNextTokenException
    | InvalidParameterException
    | MalformedArnException
    | MissingRequiredParameterException
    | ResourceShareInvitationAlreadyRejectedException
    | ResourceShareInvitationArnNotFoundException
    | ResourceShareInvitationExpiredException
    | ServerInternalException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPendingInvitationResourcesRequest,
  output: ListPendingInvitationResourcesResponse,
  errors: [
    InvalidNextTokenException,
    InvalidParameterException,
    MalformedArnException,
    MissingRequiredParameterException,
    ResourceShareInvitationAlreadyRejectedException,
    ResourceShareInvitationArnNotFoundException,
    ResourceShareInvitationExpiredException,
    ServerInternalException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * When you attach a resource-based policy to a resource, RAM automatically creates
 * a resource share of `featureSet`=`CREATED_FROM_POLICY` with a managed permission that
 * has the same IAM permissions as the original resource-based policy. However, this type
 * of managed permission is visible to only the resource share owner, and the associated resource share can't be modified by
 * using RAM.
 *
 * This operation promotes the resource share to a `STANDARD` resource share that is fully
 * manageable in RAM. When you promote a resource share, you can then manage the resource share in RAM and
 * it becomes visible to all of the principals you shared it with.
 *
 * Before you perform this operation, you should first run PromotePermissionCreatedFromPolicyto ensure that you have an
 * appropriate customer managed permission that can be associated with this resource share after its is promoted. If
 * this operation can't find a managed permission that exactly matches the existing
 * `CREATED_FROM_POLICY` permission, then this operation fails.
 */
export const promoteResourceShareCreatedFromPolicy: (
  input: PromoteResourceShareCreatedFromPolicyRequest,
) => effect.Effect<
  PromoteResourceShareCreatedFromPolicyResponse,
  | InvalidParameterException
  | InvalidStateTransitionException
  | MalformedArnException
  | MissingRequiredParameterException
  | OperationNotPermittedException
  | ResourceShareLimitExceededException
  | ServerInternalException
  | ServiceUnavailableException
  | UnknownResourceException
  | UnmatchedPolicyPermissionException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PromoteResourceShareCreatedFromPolicyRequest,
  output: PromoteResourceShareCreatedFromPolicyResponse,
  errors: [
    InvalidParameterException,
    InvalidStateTransitionException,
    MalformedArnException,
    MissingRequiredParameterException,
    OperationNotPermittedException,
    ResourceShareLimitExceededException,
    ServerInternalException,
    ServiceUnavailableException,
    UnknownResourceException,
    UnmatchedPolicyPermissionException,
  ],
}));
/**
 * Creates a new version of the specified customer managed permission. The new version is automatically set as
 * the default version of the customer managed permission. New resource shares automatically use the default
 * permission. Existing resource shares continue to use their original permission versions,
 * but you can use ReplacePermissionAssociations to update them.
 *
 * If the specified customer managed permission already has the maximum of 5 versions, then
 * you must delete one of the existing versions before you can create a new one.
 */
export const createPermissionVersion: (
  input: CreatePermissionVersionRequest,
) => effect.Effect<
  CreatePermissionVersionResponse,
  | IdempotentParameterMismatchException
  | InvalidClientTokenException
  | InvalidParameterException
  | InvalidPolicyException
  | MalformedArnException
  | MalformedPolicyTemplateException
  | PermissionVersionsLimitExceededException
  | ServerInternalException
  | ServiceUnavailableException
  | UnknownResourceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePermissionVersionRequest,
  output: CreatePermissionVersionResponse,
  errors: [
    IdempotentParameterMismatchException,
    InvalidClientTokenException,
    InvalidParameterException,
    InvalidPolicyException,
    MalformedArnException,
    MalformedPolicyTemplateException,
    PermissionVersionsLimitExceededException,
    ServerInternalException,
    ServiceUnavailableException,
    UnknownResourceException,
  ],
}));
/**
 * Creates a customer managed permission for a specified resource type that you can attach to resource shares.
 * It is created in the Amazon Web Services Region in which you call the operation.
 */
export const createPermission: (
  input: CreatePermissionRequest,
) => effect.Effect<
  CreatePermissionResponse,
  | IdempotentParameterMismatchException
  | InvalidClientTokenException
  | InvalidParameterException
  | InvalidPolicyException
  | MalformedPolicyTemplateException
  | OperationNotPermittedException
  | PermissionAlreadyExistsException
  | PermissionLimitExceededException
  | ServerInternalException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePermissionRequest,
  output: CreatePermissionResponse,
  errors: [
    IdempotentParameterMismatchException,
    InvalidClientTokenException,
    InvalidParameterException,
    InvalidPolicyException,
    MalformedPolicyTemplateException,
    OperationNotPermittedException,
    PermissionAlreadyExistsException,
    PermissionLimitExceededException,
    ServerInternalException,
    ServiceUnavailableException,
  ],
}));
