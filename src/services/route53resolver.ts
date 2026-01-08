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
  sdkId: "Route53Resolver",
  serviceShapeName: "Route53Resolver",
});
const auth = T.AwsAuthSigv4({ name: "route53resolver" });
const ver = T.ServiceVersion("2018-04-01");
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
              `https://route53resolver-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (Region === "us-gov-east-1") {
              return e("https://route53resolver.us-gov-east-1.amazonaws.com");
            }
            if (Region === "us-gov-west-1") {
              return e("https://route53resolver.us-gov-west-1.amazonaws.com");
            }
            return e(
              `https://route53resolver-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://route53resolver.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://route53resolver.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type CreatorRequestId = string;
export type ResourceId = string;
export type Priority = number;
export type Name = string;
export type BlockOverrideDomain = string;
export type BlockOverrideTtl = number;
export type Qtype = string;
export type OutpostResolverName = string;
export type InstanceCount = number;
export type OutpostInstanceType = string;
export type OutpostArn = string;
export type ResolverQueryLogConfigName = string;
export type DestinationArn = string;
export type DomainName = string;
export type DelegationRecord = string;
export type Arn = string;
export type DomainListFileUrl = string;
export type ListFirewallConfigsMaxResult = number;
export type NextToken = string;
export type MaxResults = number;
export type ListDomainMaxResults = number;
export type ListResolverConfigsMaxResult = number;
export type SortByKey = string;
export type FirewallRuleGroupPolicy = string;
export type ResolverQueryLogConfigPolicy = string;
export type ResolverRulePolicy = string;
export type TagKey = string;
export type FirewallDomainName = string;
export type TagValue = string;
export type SubnetId = string;
export type Ip = string;
export type Ipv6 = string;
export type Port = number;
export type ServerNameIndication = string;
export type FilterName = string;
export type FilterValue = string;
export type StatusMessage = string;
export type Count = number;
export type ExceptionMessage = string;
export type ResolverQueryLogConfigAssociationErrorMessage = string;
export type Rfc3339TimeString = string;
export type Unsigned = number;
export type ServicePrinciple = string;
export type AccountId = string;
export type OutpostResolverStatusMessage = string;
export type IpAddressCount = number;

//# Schemas
export type SecurityGroupIds = string[];
export const SecurityGroupIds = S.Array(S.String);
export type ProtocolList = string[];
export const ProtocolList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type FirewallDomains = string[];
export const FirewallDomains = S.Array(S.String);
export interface AssociateResolverQueryLogConfigRequest {
  ResolverQueryLogConfigId: string;
  ResourceId: string;
}
export const AssociateResolverQueryLogConfigRequest = S.suspend(() =>
  S.Struct({ ResolverQueryLogConfigId: S.String, ResourceId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateResolverQueryLogConfigRequest",
}) as any as S.Schema<AssociateResolverQueryLogConfigRequest>;
export interface AssociateResolverRuleRequest {
  ResolverRuleId: string;
  Name?: string;
  VPCId: string;
}
export const AssociateResolverRuleRequest = S.suspend(() =>
  S.Struct({
    ResolverRuleId: S.String,
    Name: S.optional(S.String),
    VPCId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateResolverRuleRequest",
}) as any as S.Schema<AssociateResolverRuleRequest>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateFirewallDomainListRequest {
  CreatorRequestId: string;
  Name: string;
  Tags?: TagList;
}
export const CreateFirewallDomainListRequest = S.suspend(() =>
  S.Struct({
    CreatorRequestId: S.String,
    Name: S.String,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateFirewallDomainListRequest",
}) as any as S.Schema<CreateFirewallDomainListRequest>;
export interface CreateFirewallRuleRequest {
  CreatorRequestId: string;
  FirewallRuleGroupId: string;
  FirewallDomainListId?: string;
  Priority: number;
  Action: string;
  BlockResponse?: string;
  BlockOverrideDomain?: string;
  BlockOverrideDnsType?: string;
  BlockOverrideTtl?: number;
  Name: string;
  FirewallDomainRedirectionAction?: string;
  Qtype?: string;
  DnsThreatProtection?: string;
  ConfidenceThreshold?: string;
}
export const CreateFirewallRuleRequest = S.suspend(() =>
  S.Struct({
    CreatorRequestId: S.String,
    FirewallRuleGroupId: S.String,
    FirewallDomainListId: S.optional(S.String),
    Priority: S.Number,
    Action: S.String,
    BlockResponse: S.optional(S.String),
    BlockOverrideDomain: S.optional(S.String),
    BlockOverrideDnsType: S.optional(S.String),
    BlockOverrideTtl: S.optional(S.Number),
    Name: S.String,
    FirewallDomainRedirectionAction: S.optional(S.String),
    Qtype: S.optional(S.String),
    DnsThreatProtection: S.optional(S.String),
    ConfidenceThreshold: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateFirewallRuleRequest",
}) as any as S.Schema<CreateFirewallRuleRequest>;
export interface CreateFirewallRuleGroupRequest {
  CreatorRequestId: string;
  Name: string;
  Tags?: TagList;
}
export const CreateFirewallRuleGroupRequest = S.suspend(() =>
  S.Struct({
    CreatorRequestId: S.String,
    Name: S.String,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateFirewallRuleGroupRequest",
}) as any as S.Schema<CreateFirewallRuleGroupRequest>;
export interface CreateOutpostResolverRequest {
  CreatorRequestId: string;
  Name: string;
  InstanceCount?: number;
  PreferredInstanceType: string;
  OutpostArn: string;
  Tags?: TagList;
}
export const CreateOutpostResolverRequest = S.suspend(() =>
  S.Struct({
    CreatorRequestId: S.String,
    Name: S.String,
    InstanceCount: S.optional(S.Number),
    PreferredInstanceType: S.String,
    OutpostArn: S.String,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateOutpostResolverRequest",
}) as any as S.Schema<CreateOutpostResolverRequest>;
export interface CreateResolverQueryLogConfigRequest {
  Name: string;
  DestinationArn: string;
  CreatorRequestId: string;
  Tags?: TagList;
}
export const CreateResolverQueryLogConfigRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    DestinationArn: S.String,
    CreatorRequestId: S.String,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateResolverQueryLogConfigRequest",
}) as any as S.Schema<CreateResolverQueryLogConfigRequest>;
export interface DeleteFirewallDomainListRequest {
  FirewallDomainListId: string;
}
export const DeleteFirewallDomainListRequest = S.suspend(() =>
  S.Struct({ FirewallDomainListId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteFirewallDomainListRequest",
}) as any as S.Schema<DeleteFirewallDomainListRequest>;
export interface DeleteFirewallRuleRequest {
  FirewallRuleGroupId: string;
  FirewallDomainListId?: string;
  FirewallThreatProtectionId?: string;
  Qtype?: string;
}
export const DeleteFirewallRuleRequest = S.suspend(() =>
  S.Struct({
    FirewallRuleGroupId: S.String,
    FirewallDomainListId: S.optional(S.String),
    FirewallThreatProtectionId: S.optional(S.String),
    Qtype: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteFirewallRuleRequest",
}) as any as S.Schema<DeleteFirewallRuleRequest>;
export interface DeleteFirewallRuleGroupRequest {
  FirewallRuleGroupId: string;
}
export const DeleteFirewallRuleGroupRequest = S.suspend(() =>
  S.Struct({ FirewallRuleGroupId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteFirewallRuleGroupRequest",
}) as any as S.Schema<DeleteFirewallRuleGroupRequest>;
export interface DeleteOutpostResolverRequest {
  Id: string;
}
export const DeleteOutpostResolverRequest = S.suspend(() =>
  S.Struct({ Id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteOutpostResolverRequest",
}) as any as S.Schema<DeleteOutpostResolverRequest>;
export interface DeleteResolverEndpointRequest {
  ResolverEndpointId: string;
}
export const DeleteResolverEndpointRequest = S.suspend(() =>
  S.Struct({ ResolverEndpointId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteResolverEndpointRequest",
}) as any as S.Schema<DeleteResolverEndpointRequest>;
export interface DeleteResolverQueryLogConfigRequest {
  ResolverQueryLogConfigId: string;
}
export const DeleteResolverQueryLogConfigRequest = S.suspend(() =>
  S.Struct({ ResolverQueryLogConfigId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteResolverQueryLogConfigRequest",
}) as any as S.Schema<DeleteResolverQueryLogConfigRequest>;
export interface DeleteResolverRuleRequest {
  ResolverRuleId: string;
}
export const DeleteResolverRuleRequest = S.suspend(() =>
  S.Struct({ ResolverRuleId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteResolverRuleRequest",
}) as any as S.Schema<DeleteResolverRuleRequest>;
export interface DisassociateFirewallRuleGroupRequest {
  FirewallRuleGroupAssociationId: string;
}
export const DisassociateFirewallRuleGroupRequest = S.suspend(() =>
  S.Struct({ FirewallRuleGroupAssociationId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateFirewallRuleGroupRequest",
}) as any as S.Schema<DisassociateFirewallRuleGroupRequest>;
export interface IpAddressUpdate {
  IpId?: string;
  SubnetId?: string;
  Ip?: string;
  Ipv6?: string;
}
export const IpAddressUpdate = S.suspend(() =>
  S.Struct({
    IpId: S.optional(S.String),
    SubnetId: S.optional(S.String),
    Ip: S.optional(S.String),
    Ipv6: S.optional(S.String),
  }),
).annotations({
  identifier: "IpAddressUpdate",
}) as any as S.Schema<IpAddressUpdate>;
export interface DisassociateResolverEndpointIpAddressRequest {
  ResolverEndpointId: string;
  IpAddress: IpAddressUpdate;
}
export const DisassociateResolverEndpointIpAddressRequest = S.suspend(() =>
  S.Struct({ ResolverEndpointId: S.String, IpAddress: IpAddressUpdate }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateResolverEndpointIpAddressRequest",
}) as any as S.Schema<DisassociateResolverEndpointIpAddressRequest>;
export interface DisassociateResolverQueryLogConfigRequest {
  ResolverQueryLogConfigId: string;
  ResourceId: string;
}
export const DisassociateResolverQueryLogConfigRequest = S.suspend(() =>
  S.Struct({ ResolverQueryLogConfigId: S.String, ResourceId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateResolverQueryLogConfigRequest",
}) as any as S.Schema<DisassociateResolverQueryLogConfigRequest>;
export interface DisassociateResolverRuleRequest {
  VPCId: string;
  ResolverRuleId: string;
}
export const DisassociateResolverRuleRequest = S.suspend(() =>
  S.Struct({ VPCId: S.String, ResolverRuleId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateResolverRuleRequest",
}) as any as S.Schema<DisassociateResolverRuleRequest>;
export interface GetFirewallConfigRequest {
  ResourceId: string;
}
export const GetFirewallConfigRequest = S.suspend(() =>
  S.Struct({ ResourceId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetFirewallConfigRequest",
}) as any as S.Schema<GetFirewallConfigRequest>;
export interface GetFirewallDomainListRequest {
  FirewallDomainListId: string;
}
export const GetFirewallDomainListRequest = S.suspend(() =>
  S.Struct({ FirewallDomainListId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetFirewallDomainListRequest",
}) as any as S.Schema<GetFirewallDomainListRequest>;
export interface GetFirewallRuleGroupRequest {
  FirewallRuleGroupId: string;
}
export const GetFirewallRuleGroupRequest = S.suspend(() =>
  S.Struct({ FirewallRuleGroupId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetFirewallRuleGroupRequest",
}) as any as S.Schema<GetFirewallRuleGroupRequest>;
export interface GetFirewallRuleGroupAssociationRequest {
  FirewallRuleGroupAssociationId: string;
}
export const GetFirewallRuleGroupAssociationRequest = S.suspend(() =>
  S.Struct({ FirewallRuleGroupAssociationId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetFirewallRuleGroupAssociationRequest",
}) as any as S.Schema<GetFirewallRuleGroupAssociationRequest>;
export interface GetFirewallRuleGroupPolicyRequest {
  Arn: string;
}
export const GetFirewallRuleGroupPolicyRequest = S.suspend(() =>
  S.Struct({ Arn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetFirewallRuleGroupPolicyRequest",
}) as any as S.Schema<GetFirewallRuleGroupPolicyRequest>;
export interface GetOutpostResolverRequest {
  Id: string;
}
export const GetOutpostResolverRequest = S.suspend(() =>
  S.Struct({ Id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetOutpostResolverRequest",
}) as any as S.Schema<GetOutpostResolverRequest>;
export interface GetResolverConfigRequest {
  ResourceId: string;
}
export const GetResolverConfigRequest = S.suspend(() =>
  S.Struct({ ResourceId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetResolverConfigRequest",
}) as any as S.Schema<GetResolverConfigRequest>;
export interface GetResolverDnssecConfigRequest {
  ResourceId: string;
}
export const GetResolverDnssecConfigRequest = S.suspend(() =>
  S.Struct({ ResourceId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetResolverDnssecConfigRequest",
}) as any as S.Schema<GetResolverDnssecConfigRequest>;
export interface GetResolverEndpointRequest {
  ResolverEndpointId: string;
}
export const GetResolverEndpointRequest = S.suspend(() =>
  S.Struct({ ResolverEndpointId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetResolverEndpointRequest",
}) as any as S.Schema<GetResolverEndpointRequest>;
export interface GetResolverQueryLogConfigRequest {
  ResolverQueryLogConfigId: string;
}
export const GetResolverQueryLogConfigRequest = S.suspend(() =>
  S.Struct({ ResolverQueryLogConfigId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetResolverQueryLogConfigRequest",
}) as any as S.Schema<GetResolverQueryLogConfigRequest>;
export interface GetResolverQueryLogConfigAssociationRequest {
  ResolverQueryLogConfigAssociationId: string;
}
export const GetResolverQueryLogConfigAssociationRequest = S.suspend(() =>
  S.Struct({ ResolverQueryLogConfigAssociationId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetResolverQueryLogConfigAssociationRequest",
}) as any as S.Schema<GetResolverQueryLogConfigAssociationRequest>;
export interface GetResolverQueryLogConfigPolicyRequest {
  Arn: string;
}
export const GetResolverQueryLogConfigPolicyRequest = S.suspend(() =>
  S.Struct({ Arn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetResolverQueryLogConfigPolicyRequest",
}) as any as S.Schema<GetResolverQueryLogConfigPolicyRequest>;
export interface GetResolverRuleRequest {
  ResolverRuleId: string;
}
export const GetResolverRuleRequest = S.suspend(() =>
  S.Struct({ ResolverRuleId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetResolverRuleRequest",
}) as any as S.Schema<GetResolverRuleRequest>;
export interface GetResolverRuleAssociationRequest {
  ResolverRuleAssociationId: string;
}
export const GetResolverRuleAssociationRequest = S.suspend(() =>
  S.Struct({ ResolverRuleAssociationId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetResolverRuleAssociationRequest",
}) as any as S.Schema<GetResolverRuleAssociationRequest>;
export interface GetResolverRulePolicyRequest {
  Arn: string;
}
export const GetResolverRulePolicyRequest = S.suspend(() =>
  S.Struct({ Arn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetResolverRulePolicyRequest",
}) as any as S.Schema<GetResolverRulePolicyRequest>;
export interface ImportFirewallDomainsRequest {
  FirewallDomainListId: string;
  Operation: string;
  DomainFileUrl: string;
}
export const ImportFirewallDomainsRequest = S.suspend(() =>
  S.Struct({
    FirewallDomainListId: S.String,
    Operation: S.String,
    DomainFileUrl: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ImportFirewallDomainsRequest",
}) as any as S.Schema<ImportFirewallDomainsRequest>;
export interface ListFirewallConfigsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListFirewallConfigsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListFirewallConfigsRequest",
}) as any as S.Schema<ListFirewallConfigsRequest>;
export interface ListFirewallDomainListsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListFirewallDomainListsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListFirewallDomainListsRequest",
}) as any as S.Schema<ListFirewallDomainListsRequest>;
export interface ListFirewallDomainsRequest {
  FirewallDomainListId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListFirewallDomainsRequest = S.suspend(() =>
  S.Struct({
    FirewallDomainListId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListFirewallDomainsRequest",
}) as any as S.Schema<ListFirewallDomainsRequest>;
export interface ListFirewallRuleGroupAssociationsRequest {
  FirewallRuleGroupId?: string;
  VpcId?: string;
  Priority?: number;
  Status?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListFirewallRuleGroupAssociationsRequest = S.suspend(() =>
  S.Struct({
    FirewallRuleGroupId: S.optional(S.String),
    VpcId: S.optional(S.String),
    Priority: S.optional(S.Number),
    Status: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListFirewallRuleGroupAssociationsRequest",
}) as any as S.Schema<ListFirewallRuleGroupAssociationsRequest>;
export interface ListFirewallRuleGroupsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListFirewallRuleGroupsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListFirewallRuleGroupsRequest",
}) as any as S.Schema<ListFirewallRuleGroupsRequest>;
export interface ListFirewallRulesRequest {
  FirewallRuleGroupId: string;
  Priority?: number;
  Action?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListFirewallRulesRequest = S.suspend(() =>
  S.Struct({
    FirewallRuleGroupId: S.String,
    Priority: S.optional(S.Number),
    Action: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListFirewallRulesRequest",
}) as any as S.Schema<ListFirewallRulesRequest>;
export interface ListOutpostResolversRequest {
  OutpostArn?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListOutpostResolversRequest = S.suspend(() =>
  S.Struct({
    OutpostArn: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListOutpostResolversRequest",
}) as any as S.Schema<ListOutpostResolversRequest>;
export interface ListResolverConfigsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListResolverConfigsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListResolverConfigsRequest",
}) as any as S.Schema<ListResolverConfigsRequest>;
export interface ListResolverEndpointIpAddressesRequest {
  ResolverEndpointId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListResolverEndpointIpAddressesRequest = S.suspend(() =>
  S.Struct({
    ResolverEndpointId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListResolverEndpointIpAddressesRequest",
}) as any as S.Schema<ListResolverEndpointIpAddressesRequest>;
export type FilterValues = string[];
export const FilterValues = S.Array(S.String);
export interface Filter {
  Name?: string;
  Values?: FilterValues;
}
export const Filter = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Values: S.optional(FilterValues) }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type Filters = Filter[];
export const Filters = S.Array(Filter);
export interface ListResolverEndpointsRequest {
  MaxResults?: number;
  NextToken?: string;
  Filters?: Filters;
}
export const ListResolverEndpointsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(Filters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListResolverEndpointsRequest",
}) as any as S.Schema<ListResolverEndpointsRequest>;
export interface ListResolverQueryLogConfigAssociationsRequest {
  MaxResults?: number;
  NextToken?: string;
  Filters?: Filters;
  SortBy?: string;
  SortOrder?: string;
}
export const ListResolverQueryLogConfigAssociationsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(Filters),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListResolverQueryLogConfigAssociationsRequest",
}) as any as S.Schema<ListResolverQueryLogConfigAssociationsRequest>;
export interface ListResolverQueryLogConfigsRequest {
  MaxResults?: number;
  NextToken?: string;
  Filters?: Filters;
  SortBy?: string;
  SortOrder?: string;
}
export const ListResolverQueryLogConfigsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(Filters),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListResolverQueryLogConfigsRequest",
}) as any as S.Schema<ListResolverQueryLogConfigsRequest>;
export interface ListResolverRuleAssociationsRequest {
  MaxResults?: number;
  NextToken?: string;
  Filters?: Filters;
}
export const ListResolverRuleAssociationsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(Filters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListResolverRuleAssociationsRequest",
}) as any as S.Schema<ListResolverRuleAssociationsRequest>;
export interface ListResolverRulesRequest {
  MaxResults?: number;
  NextToken?: string;
  Filters?: Filters;
}
export const ListResolverRulesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(Filters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListResolverRulesRequest",
}) as any as S.Schema<ListResolverRulesRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface PutFirewallRuleGroupPolicyRequest {
  Arn: string;
  FirewallRuleGroupPolicy: string;
}
export const PutFirewallRuleGroupPolicyRequest = S.suspend(() =>
  S.Struct({ Arn: S.String, FirewallRuleGroupPolicy: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutFirewallRuleGroupPolicyRequest",
}) as any as S.Schema<PutFirewallRuleGroupPolicyRequest>;
export interface PutResolverQueryLogConfigPolicyRequest {
  Arn: string;
  ResolverQueryLogConfigPolicy: string;
}
export const PutResolverQueryLogConfigPolicyRequest = S.suspend(() =>
  S.Struct({ Arn: S.String, ResolverQueryLogConfigPolicy: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutResolverQueryLogConfigPolicyRequest",
}) as any as S.Schema<PutResolverQueryLogConfigPolicyRequest>;
export interface PutResolverRulePolicyRequest {
  Arn: string;
  ResolverRulePolicy: string;
}
export const PutResolverRulePolicyRequest = S.suspend(() =>
  S.Struct({ Arn: S.String, ResolverRulePolicy: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutResolverRulePolicyRequest",
}) as any as S.Schema<PutResolverRulePolicyRequest>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: TagList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: TagList }).pipe(
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
export interface UpdateFirewallConfigRequest {
  ResourceId: string;
  FirewallFailOpen: string;
}
export const UpdateFirewallConfigRequest = S.suspend(() =>
  S.Struct({ ResourceId: S.String, FirewallFailOpen: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateFirewallConfigRequest",
}) as any as S.Schema<UpdateFirewallConfigRequest>;
export interface UpdateFirewallDomainsRequest {
  FirewallDomainListId: string;
  Operation: string;
  Domains: FirewallDomains;
}
export const UpdateFirewallDomainsRequest = S.suspend(() =>
  S.Struct({
    FirewallDomainListId: S.String,
    Operation: S.String,
    Domains: FirewallDomains,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateFirewallDomainsRequest",
}) as any as S.Schema<UpdateFirewallDomainsRequest>;
export interface UpdateFirewallRuleRequest {
  FirewallRuleGroupId: string;
  FirewallDomainListId?: string;
  FirewallThreatProtectionId?: string;
  Priority?: number;
  Action?: string;
  BlockResponse?: string;
  BlockOverrideDomain?: string;
  BlockOverrideDnsType?: string;
  BlockOverrideTtl?: number;
  Name?: string;
  FirewallDomainRedirectionAction?: string;
  Qtype?: string;
  DnsThreatProtection?: string;
  ConfidenceThreshold?: string;
}
export const UpdateFirewallRuleRequest = S.suspend(() =>
  S.Struct({
    FirewallRuleGroupId: S.String,
    FirewallDomainListId: S.optional(S.String),
    FirewallThreatProtectionId: S.optional(S.String),
    Priority: S.optional(S.Number),
    Action: S.optional(S.String),
    BlockResponse: S.optional(S.String),
    BlockOverrideDomain: S.optional(S.String),
    BlockOverrideDnsType: S.optional(S.String),
    BlockOverrideTtl: S.optional(S.Number),
    Name: S.optional(S.String),
    FirewallDomainRedirectionAction: S.optional(S.String),
    Qtype: S.optional(S.String),
    DnsThreatProtection: S.optional(S.String),
    ConfidenceThreshold: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateFirewallRuleRequest",
}) as any as S.Schema<UpdateFirewallRuleRequest>;
export interface UpdateFirewallRuleGroupAssociationRequest {
  FirewallRuleGroupAssociationId: string;
  Priority?: number;
  MutationProtection?: string;
  Name?: string;
}
export const UpdateFirewallRuleGroupAssociationRequest = S.suspend(() =>
  S.Struct({
    FirewallRuleGroupAssociationId: S.String,
    Priority: S.optional(S.Number),
    MutationProtection: S.optional(S.String),
    Name: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateFirewallRuleGroupAssociationRequest",
}) as any as S.Schema<UpdateFirewallRuleGroupAssociationRequest>;
export interface UpdateOutpostResolverRequest {
  Id: string;
  Name?: string;
  InstanceCount?: number;
  PreferredInstanceType?: string;
}
export const UpdateOutpostResolverRequest = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Name: S.optional(S.String),
    InstanceCount: S.optional(S.Number),
    PreferredInstanceType: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateOutpostResolverRequest",
}) as any as S.Schema<UpdateOutpostResolverRequest>;
export interface UpdateResolverConfigRequest {
  ResourceId: string;
  AutodefinedReverseFlag: string;
}
export const UpdateResolverConfigRequest = S.suspend(() =>
  S.Struct({ ResourceId: S.String, AutodefinedReverseFlag: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateResolverConfigRequest",
}) as any as S.Schema<UpdateResolverConfigRequest>;
export interface UpdateResolverDnssecConfigRequest {
  ResourceId: string;
  Validation: string;
}
export const UpdateResolverDnssecConfigRequest = S.suspend(() =>
  S.Struct({ ResourceId: S.String, Validation: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateResolverDnssecConfigRequest",
}) as any as S.Schema<UpdateResolverDnssecConfigRequest>;
export interface IpAddressRequest {
  SubnetId: string;
  Ip?: string;
  Ipv6?: string;
}
export const IpAddressRequest = S.suspend(() =>
  S.Struct({
    SubnetId: S.String,
    Ip: S.optional(S.String),
    Ipv6: S.optional(S.String),
  }),
).annotations({
  identifier: "IpAddressRequest",
}) as any as S.Schema<IpAddressRequest>;
export type IpAddressesRequest = IpAddressRequest[];
export const IpAddressesRequest = S.Array(IpAddressRequest);
export interface TargetAddress {
  Ip?: string;
  Port?: number;
  Ipv6?: string;
  Protocol?: string;
  ServerNameIndication?: string;
}
export const TargetAddress = S.suspend(() =>
  S.Struct({
    Ip: S.optional(S.String),
    Port: S.optional(S.Number),
    Ipv6: S.optional(S.String),
    Protocol: S.optional(S.String),
    ServerNameIndication: S.optional(S.String),
  }),
).annotations({
  identifier: "TargetAddress",
}) as any as S.Schema<TargetAddress>;
export type TargetList = TargetAddress[];
export const TargetList = S.Array(TargetAddress);
export interface FirewallConfig {
  Id?: string;
  ResourceId?: string;
  OwnerId?: string;
  FirewallFailOpen?: string;
}
export const FirewallConfig = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    ResourceId: S.optional(S.String),
    OwnerId: S.optional(S.String),
    FirewallFailOpen: S.optional(S.String),
  }),
).annotations({
  identifier: "FirewallConfig",
}) as any as S.Schema<FirewallConfig>;
export type FirewallConfigList = FirewallConfig[];
export const FirewallConfigList = S.Array(FirewallConfig);
export interface FirewallRuleGroupAssociation {
  Id?: string;
  Arn?: string;
  FirewallRuleGroupId?: string;
  VpcId?: string;
  Name?: string;
  Priority?: number;
  MutationProtection?: string;
  ManagedOwnerName?: string;
  Status?: string;
  StatusMessage?: string;
  CreatorRequestId?: string;
  CreationTime?: string;
  ModificationTime?: string;
}
export const FirewallRuleGroupAssociation = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    FirewallRuleGroupId: S.optional(S.String),
    VpcId: S.optional(S.String),
    Name: S.optional(S.String),
    Priority: S.optional(S.Number),
    MutationProtection: S.optional(S.String),
    ManagedOwnerName: S.optional(S.String),
    Status: S.optional(S.String),
    StatusMessage: S.optional(S.String),
    CreatorRequestId: S.optional(S.String),
    CreationTime: S.optional(S.String),
    ModificationTime: S.optional(S.String),
  }),
).annotations({
  identifier: "FirewallRuleGroupAssociation",
}) as any as S.Schema<FirewallRuleGroupAssociation>;
export type FirewallRuleGroupAssociations = FirewallRuleGroupAssociation[];
export const FirewallRuleGroupAssociations = S.Array(
  FirewallRuleGroupAssociation,
);
export interface FirewallRule {
  FirewallRuleGroupId?: string;
  FirewallDomainListId?: string;
  FirewallThreatProtectionId?: string;
  Name?: string;
  Priority?: number;
  Action?: string;
  BlockResponse?: string;
  BlockOverrideDomain?: string;
  BlockOverrideDnsType?: string;
  BlockOverrideTtl?: number;
  CreatorRequestId?: string;
  CreationTime?: string;
  ModificationTime?: string;
  FirewallDomainRedirectionAction?: string;
  Qtype?: string;
  DnsThreatProtection?: string;
  ConfidenceThreshold?: string;
}
export const FirewallRule = S.suspend(() =>
  S.Struct({
    FirewallRuleGroupId: S.optional(S.String),
    FirewallDomainListId: S.optional(S.String),
    FirewallThreatProtectionId: S.optional(S.String),
    Name: S.optional(S.String),
    Priority: S.optional(S.Number),
    Action: S.optional(S.String),
    BlockResponse: S.optional(S.String),
    BlockOverrideDomain: S.optional(S.String),
    BlockOverrideDnsType: S.optional(S.String),
    BlockOverrideTtl: S.optional(S.Number),
    CreatorRequestId: S.optional(S.String),
    CreationTime: S.optional(S.String),
    ModificationTime: S.optional(S.String),
    FirewallDomainRedirectionAction: S.optional(S.String),
    Qtype: S.optional(S.String),
    DnsThreatProtection: S.optional(S.String),
    ConfidenceThreshold: S.optional(S.String),
  }),
).annotations({ identifier: "FirewallRule" }) as any as S.Schema<FirewallRule>;
export type FirewallRules = FirewallRule[];
export const FirewallRules = S.Array(FirewallRule);
export interface OutpostResolver {
  Arn?: string;
  CreationTime?: string;
  ModificationTime?: string;
  CreatorRequestId?: string;
  Id?: string;
  InstanceCount?: number;
  PreferredInstanceType?: string;
  Name?: string;
  Status?: string;
  StatusMessage?: string;
  OutpostArn?: string;
}
export const OutpostResolver = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    CreationTime: S.optional(S.String),
    ModificationTime: S.optional(S.String),
    CreatorRequestId: S.optional(S.String),
    Id: S.optional(S.String),
    InstanceCount: S.optional(S.Number),
    PreferredInstanceType: S.optional(S.String),
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    StatusMessage: S.optional(S.String),
    OutpostArn: S.optional(S.String),
  }),
).annotations({
  identifier: "OutpostResolver",
}) as any as S.Schema<OutpostResolver>;
export type OutpostResolverList = OutpostResolver[];
export const OutpostResolverList = S.Array(OutpostResolver);
export interface ResolverConfig {
  Id?: string;
  ResourceId?: string;
  OwnerId?: string;
  AutodefinedReverse?: string;
}
export const ResolverConfig = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    ResourceId: S.optional(S.String),
    OwnerId: S.optional(S.String),
    AutodefinedReverse: S.optional(S.String),
  }),
).annotations({
  identifier: "ResolverConfig",
}) as any as S.Schema<ResolverConfig>;
export type ResolverConfigList = ResolverConfig[];
export const ResolverConfigList = S.Array(ResolverConfig);
export interface ResolverEndpoint {
  Id?: string;
  CreatorRequestId?: string;
  Arn?: string;
  Name?: string;
  SecurityGroupIds?: SecurityGroupIds;
  Direction?: string;
  IpAddressCount?: number;
  HostVPCId?: string;
  Status?: string;
  StatusMessage?: string;
  CreationTime?: string;
  ModificationTime?: string;
  OutpostArn?: string;
  PreferredInstanceType?: string;
  ResolverEndpointType?: string;
  Protocols?: ProtocolList;
  RniEnhancedMetricsEnabled?: boolean;
  TargetNameServerMetricsEnabled?: boolean;
}
export const ResolverEndpoint = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    CreatorRequestId: S.optional(S.String),
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    SecurityGroupIds: S.optional(SecurityGroupIds),
    Direction: S.optional(S.String),
    IpAddressCount: S.optional(S.Number),
    HostVPCId: S.optional(S.String),
    Status: S.optional(S.String),
    StatusMessage: S.optional(S.String),
    CreationTime: S.optional(S.String),
    ModificationTime: S.optional(S.String),
    OutpostArn: S.optional(S.String),
    PreferredInstanceType: S.optional(S.String),
    ResolverEndpointType: S.optional(S.String),
    Protocols: S.optional(ProtocolList),
    RniEnhancedMetricsEnabled: S.optional(S.Boolean),
    TargetNameServerMetricsEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ResolverEndpoint",
}) as any as S.Schema<ResolverEndpoint>;
export type ResolverEndpoints = ResolverEndpoint[];
export const ResolverEndpoints = S.Array(ResolverEndpoint);
export interface ResolverQueryLogConfigAssociation {
  Id?: string;
  ResolverQueryLogConfigId?: string;
  ResourceId?: string;
  Status?: string;
  Error?: string;
  ErrorMessage?: string;
  CreationTime?: string;
}
export const ResolverQueryLogConfigAssociation = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    ResolverQueryLogConfigId: S.optional(S.String),
    ResourceId: S.optional(S.String),
    Status: S.optional(S.String),
    Error: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
    CreationTime: S.optional(S.String),
  }),
).annotations({
  identifier: "ResolverQueryLogConfigAssociation",
}) as any as S.Schema<ResolverQueryLogConfigAssociation>;
export type ResolverQueryLogConfigAssociationList =
  ResolverQueryLogConfigAssociation[];
export const ResolverQueryLogConfigAssociationList = S.Array(
  ResolverQueryLogConfigAssociation,
);
export interface ResolverQueryLogConfig {
  Id?: string;
  OwnerId?: string;
  Status?: string;
  ShareStatus?: string;
  AssociationCount?: number;
  Arn?: string;
  Name?: string;
  DestinationArn?: string;
  CreatorRequestId?: string;
  CreationTime?: string;
}
export const ResolverQueryLogConfig = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    OwnerId: S.optional(S.String),
    Status: S.optional(S.String),
    ShareStatus: S.optional(S.String),
    AssociationCount: S.optional(S.Number),
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    DestinationArn: S.optional(S.String),
    CreatorRequestId: S.optional(S.String),
    CreationTime: S.optional(S.String),
  }),
).annotations({
  identifier: "ResolverQueryLogConfig",
}) as any as S.Schema<ResolverQueryLogConfig>;
export type ResolverQueryLogConfigList = ResolverQueryLogConfig[];
export const ResolverQueryLogConfigList = S.Array(ResolverQueryLogConfig);
export interface ResolverRuleAssociation {
  Id?: string;
  ResolverRuleId?: string;
  Name?: string;
  VPCId?: string;
  Status?: string;
  StatusMessage?: string;
}
export const ResolverRuleAssociation = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    ResolverRuleId: S.optional(S.String),
    Name: S.optional(S.String),
    VPCId: S.optional(S.String),
    Status: S.optional(S.String),
    StatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "ResolverRuleAssociation",
}) as any as S.Schema<ResolverRuleAssociation>;
export type ResolverRuleAssociations = ResolverRuleAssociation[];
export const ResolverRuleAssociations = S.Array(ResolverRuleAssociation);
export interface ResolverRule {
  Id?: string;
  CreatorRequestId?: string;
  Arn?: string;
  DomainName?: string;
  Status?: string;
  StatusMessage?: string;
  RuleType?: string;
  Name?: string;
  TargetIps?: TargetList;
  ResolverEndpointId?: string;
  OwnerId?: string;
  ShareStatus?: string;
  CreationTime?: string;
  ModificationTime?: string;
  DelegationRecord?: string;
}
export const ResolverRule = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    CreatorRequestId: S.optional(S.String),
    Arn: S.optional(S.String),
    DomainName: S.optional(S.String),
    Status: S.optional(S.String),
    StatusMessage: S.optional(S.String),
    RuleType: S.optional(S.String),
    Name: S.optional(S.String),
    TargetIps: S.optional(TargetList),
    ResolverEndpointId: S.optional(S.String),
    OwnerId: S.optional(S.String),
    ShareStatus: S.optional(S.String),
    CreationTime: S.optional(S.String),
    ModificationTime: S.optional(S.String),
    DelegationRecord: S.optional(S.String),
  }),
).annotations({ identifier: "ResolverRule" }) as any as S.Schema<ResolverRule>;
export type ResolverRules = ResolverRule[];
export const ResolverRules = S.Array(ResolverRule);
export interface UpdateIpAddress {
  IpId: string;
  Ipv6: string;
}
export const UpdateIpAddress = S.suspend(() =>
  S.Struct({ IpId: S.String, Ipv6: S.String }),
).annotations({
  identifier: "UpdateIpAddress",
}) as any as S.Schema<UpdateIpAddress>;
export type UpdateIpAddresses = UpdateIpAddress[];
export const UpdateIpAddresses = S.Array(UpdateIpAddress);
export interface ResolverRuleConfig {
  Name?: string;
  TargetIps?: TargetList;
  ResolverEndpointId?: string;
}
export const ResolverRuleConfig = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    TargetIps: S.optional(TargetList),
    ResolverEndpointId: S.optional(S.String),
  }),
).annotations({
  identifier: "ResolverRuleConfig",
}) as any as S.Schema<ResolverRuleConfig>;
export interface AssociateFirewallRuleGroupRequest {
  CreatorRequestId: string;
  FirewallRuleGroupId: string;
  VpcId: string;
  Priority: number;
  Name: string;
  MutationProtection?: string;
  Tags?: TagList;
}
export const AssociateFirewallRuleGroupRequest = S.suspend(() =>
  S.Struct({
    CreatorRequestId: S.String,
    FirewallRuleGroupId: S.String,
    VpcId: S.String,
    Priority: S.Number,
    Name: S.String,
    MutationProtection: S.optional(S.String),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateFirewallRuleGroupRequest",
}) as any as S.Schema<AssociateFirewallRuleGroupRequest>;
export interface AssociateResolverEndpointIpAddressRequest {
  ResolverEndpointId: string;
  IpAddress: IpAddressUpdate;
}
export const AssociateResolverEndpointIpAddressRequest = S.suspend(() =>
  S.Struct({ ResolverEndpointId: S.String, IpAddress: IpAddressUpdate }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateResolverEndpointIpAddressRequest",
}) as any as S.Schema<AssociateResolverEndpointIpAddressRequest>;
export interface CreateResolverEndpointRequest {
  CreatorRequestId: string;
  Name?: string;
  SecurityGroupIds: SecurityGroupIds;
  Direction: string;
  IpAddresses: IpAddressesRequest;
  OutpostArn?: string;
  PreferredInstanceType?: string;
  Tags?: TagList;
  ResolverEndpointType?: string;
  Protocols?: ProtocolList;
  RniEnhancedMetricsEnabled?: boolean;
  TargetNameServerMetricsEnabled?: boolean;
}
export const CreateResolverEndpointRequest = S.suspend(() =>
  S.Struct({
    CreatorRequestId: S.String,
    Name: S.optional(S.String),
    SecurityGroupIds: SecurityGroupIds,
    Direction: S.String,
    IpAddresses: IpAddressesRequest,
    OutpostArn: S.optional(S.String),
    PreferredInstanceType: S.optional(S.String),
    Tags: S.optional(TagList),
    ResolverEndpointType: S.optional(S.String),
    Protocols: S.optional(ProtocolList),
    RniEnhancedMetricsEnabled: S.optional(S.Boolean),
    TargetNameServerMetricsEnabled: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateResolverEndpointRequest",
}) as any as S.Schema<CreateResolverEndpointRequest>;
export interface CreateResolverRuleRequest {
  CreatorRequestId: string;
  Name?: string;
  RuleType: string;
  DomainName?: string;
  TargetIps?: TargetList;
  ResolverEndpointId?: string;
  Tags?: TagList;
  DelegationRecord?: string;
}
export const CreateResolverRuleRequest = S.suspend(() =>
  S.Struct({
    CreatorRequestId: S.String,
    Name: S.optional(S.String),
    RuleType: S.String,
    DomainName: S.optional(S.String),
    TargetIps: S.optional(TargetList),
    ResolverEndpointId: S.optional(S.String),
    Tags: S.optional(TagList),
    DelegationRecord: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateResolverRuleRequest",
}) as any as S.Schema<CreateResolverRuleRequest>;
export interface FirewallDomainList {
  Id?: string;
  Arn?: string;
  Name?: string;
  DomainCount?: number;
  Status?: string;
  StatusMessage?: string;
  ManagedOwnerName?: string;
  CreatorRequestId?: string;
  CreationTime?: string;
  ModificationTime?: string;
}
export const FirewallDomainList = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    DomainCount: S.optional(S.Number),
    Status: S.optional(S.String),
    StatusMessage: S.optional(S.String),
    ManagedOwnerName: S.optional(S.String),
    CreatorRequestId: S.optional(S.String),
    CreationTime: S.optional(S.String),
    ModificationTime: S.optional(S.String),
  }),
).annotations({
  identifier: "FirewallDomainList",
}) as any as S.Schema<FirewallDomainList>;
export interface DeleteFirewallDomainListResponse {
  FirewallDomainList?: FirewallDomainList;
}
export const DeleteFirewallDomainListResponse = S.suspend(() =>
  S.Struct({ FirewallDomainList: S.optional(FirewallDomainList) }),
).annotations({
  identifier: "DeleteFirewallDomainListResponse",
}) as any as S.Schema<DeleteFirewallDomainListResponse>;
export interface DeleteFirewallRuleResponse {
  FirewallRule?: FirewallRule;
}
export const DeleteFirewallRuleResponse = S.suspend(() =>
  S.Struct({ FirewallRule: S.optional(FirewallRule) }),
).annotations({
  identifier: "DeleteFirewallRuleResponse",
}) as any as S.Schema<DeleteFirewallRuleResponse>;
export interface FirewallRuleGroup {
  Id?: string;
  Arn?: string;
  Name?: string;
  RuleCount?: number;
  Status?: string;
  StatusMessage?: string;
  OwnerId?: string;
  CreatorRequestId?: string;
  ShareStatus?: string;
  CreationTime?: string;
  ModificationTime?: string;
}
export const FirewallRuleGroup = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    RuleCount: S.optional(S.Number),
    Status: S.optional(S.String),
    StatusMessage: S.optional(S.String),
    OwnerId: S.optional(S.String),
    CreatorRequestId: S.optional(S.String),
    ShareStatus: S.optional(S.String),
    CreationTime: S.optional(S.String),
    ModificationTime: S.optional(S.String),
  }),
).annotations({
  identifier: "FirewallRuleGroup",
}) as any as S.Schema<FirewallRuleGroup>;
export interface DeleteFirewallRuleGroupResponse {
  FirewallRuleGroup?: FirewallRuleGroup;
}
export const DeleteFirewallRuleGroupResponse = S.suspend(() =>
  S.Struct({ FirewallRuleGroup: S.optional(FirewallRuleGroup) }),
).annotations({
  identifier: "DeleteFirewallRuleGroupResponse",
}) as any as S.Schema<DeleteFirewallRuleGroupResponse>;
export interface DeleteOutpostResolverResponse {
  OutpostResolver?: OutpostResolver;
}
export const DeleteOutpostResolverResponse = S.suspend(() =>
  S.Struct({ OutpostResolver: S.optional(OutpostResolver) }),
).annotations({
  identifier: "DeleteOutpostResolverResponse",
}) as any as S.Schema<DeleteOutpostResolverResponse>;
export interface DeleteResolverQueryLogConfigResponse {
  ResolverQueryLogConfig?: ResolverQueryLogConfig;
}
export const DeleteResolverQueryLogConfigResponse = S.suspend(() =>
  S.Struct({ ResolverQueryLogConfig: S.optional(ResolverQueryLogConfig) }),
).annotations({
  identifier: "DeleteResolverQueryLogConfigResponse",
}) as any as S.Schema<DeleteResolverQueryLogConfigResponse>;
export interface DisassociateResolverEndpointIpAddressResponse {
  ResolverEndpoint?: ResolverEndpoint;
}
export const DisassociateResolverEndpointIpAddressResponse = S.suspend(() =>
  S.Struct({ ResolverEndpoint: S.optional(ResolverEndpoint) }),
).annotations({
  identifier: "DisassociateResolverEndpointIpAddressResponse",
}) as any as S.Schema<DisassociateResolverEndpointIpAddressResponse>;
export interface DisassociateResolverQueryLogConfigResponse {
  ResolverQueryLogConfigAssociation?: ResolverQueryLogConfigAssociation;
}
export const DisassociateResolverQueryLogConfigResponse = S.suspend(() =>
  S.Struct({
    ResolverQueryLogConfigAssociation: S.optional(
      ResolverQueryLogConfigAssociation,
    ),
  }),
).annotations({
  identifier: "DisassociateResolverQueryLogConfigResponse",
}) as any as S.Schema<DisassociateResolverQueryLogConfigResponse>;
export interface DisassociateResolverRuleResponse {
  ResolverRuleAssociation?: ResolverRuleAssociation;
}
export const DisassociateResolverRuleResponse = S.suspend(() =>
  S.Struct({ ResolverRuleAssociation: S.optional(ResolverRuleAssociation) }),
).annotations({
  identifier: "DisassociateResolverRuleResponse",
}) as any as S.Schema<DisassociateResolverRuleResponse>;
export interface GetFirewallDomainListResponse {
  FirewallDomainList?: FirewallDomainList;
}
export const GetFirewallDomainListResponse = S.suspend(() =>
  S.Struct({ FirewallDomainList: S.optional(FirewallDomainList) }),
).annotations({
  identifier: "GetFirewallDomainListResponse",
}) as any as S.Schema<GetFirewallDomainListResponse>;
export interface GetFirewallRuleGroupResponse {
  FirewallRuleGroup?: FirewallRuleGroup;
}
export const GetFirewallRuleGroupResponse = S.suspend(() =>
  S.Struct({ FirewallRuleGroup: S.optional(FirewallRuleGroup) }),
).annotations({
  identifier: "GetFirewallRuleGroupResponse",
}) as any as S.Schema<GetFirewallRuleGroupResponse>;
export interface GetFirewallRuleGroupAssociationResponse {
  FirewallRuleGroupAssociation?: FirewallRuleGroupAssociation;
}
export const GetFirewallRuleGroupAssociationResponse = S.suspend(() =>
  S.Struct({
    FirewallRuleGroupAssociation: S.optional(FirewallRuleGroupAssociation),
  }),
).annotations({
  identifier: "GetFirewallRuleGroupAssociationResponse",
}) as any as S.Schema<GetFirewallRuleGroupAssociationResponse>;
export interface GetFirewallRuleGroupPolicyResponse {
  FirewallRuleGroupPolicy?: string;
}
export const GetFirewallRuleGroupPolicyResponse = S.suspend(() =>
  S.Struct({ FirewallRuleGroupPolicy: S.optional(S.String) }),
).annotations({
  identifier: "GetFirewallRuleGroupPolicyResponse",
}) as any as S.Schema<GetFirewallRuleGroupPolicyResponse>;
export interface GetOutpostResolverResponse {
  OutpostResolver?: OutpostResolver;
}
export const GetOutpostResolverResponse = S.suspend(() =>
  S.Struct({ OutpostResolver: S.optional(OutpostResolver) }),
).annotations({
  identifier: "GetOutpostResolverResponse",
}) as any as S.Schema<GetOutpostResolverResponse>;
export interface GetResolverEndpointResponse {
  ResolverEndpoint?: ResolverEndpoint;
}
export const GetResolverEndpointResponse = S.suspend(() =>
  S.Struct({ ResolverEndpoint: S.optional(ResolverEndpoint) }),
).annotations({
  identifier: "GetResolverEndpointResponse",
}) as any as S.Schema<GetResolverEndpointResponse>;
export interface GetResolverQueryLogConfigResponse {
  ResolverQueryLogConfig?: ResolverQueryLogConfig;
}
export const GetResolverQueryLogConfigResponse = S.suspend(() =>
  S.Struct({ ResolverQueryLogConfig: S.optional(ResolverQueryLogConfig) }),
).annotations({
  identifier: "GetResolverQueryLogConfigResponse",
}) as any as S.Schema<GetResolverQueryLogConfigResponse>;
export interface GetResolverQueryLogConfigAssociationResponse {
  ResolverQueryLogConfigAssociation?: ResolverQueryLogConfigAssociation;
}
export const GetResolverQueryLogConfigAssociationResponse = S.suspend(() =>
  S.Struct({
    ResolverQueryLogConfigAssociation: S.optional(
      ResolverQueryLogConfigAssociation,
    ),
  }),
).annotations({
  identifier: "GetResolverQueryLogConfigAssociationResponse",
}) as any as S.Schema<GetResolverQueryLogConfigAssociationResponse>;
export interface GetResolverQueryLogConfigPolicyResponse {
  ResolverQueryLogConfigPolicy?: string;
}
export const GetResolverQueryLogConfigPolicyResponse = S.suspend(() =>
  S.Struct({ ResolverQueryLogConfigPolicy: S.optional(S.String) }),
).annotations({
  identifier: "GetResolverQueryLogConfigPolicyResponse",
}) as any as S.Schema<GetResolverQueryLogConfigPolicyResponse>;
export interface GetResolverRuleResponse {
  ResolverRule?: ResolverRule;
}
export const GetResolverRuleResponse = S.suspend(() =>
  S.Struct({ ResolverRule: S.optional(ResolverRule) }),
).annotations({
  identifier: "GetResolverRuleResponse",
}) as any as S.Schema<GetResolverRuleResponse>;
export interface GetResolverRuleAssociationResponse {
  ResolverRuleAssociation?: ResolverRuleAssociation;
}
export const GetResolverRuleAssociationResponse = S.suspend(() =>
  S.Struct({ ResolverRuleAssociation: S.optional(ResolverRuleAssociation) }),
).annotations({
  identifier: "GetResolverRuleAssociationResponse",
}) as any as S.Schema<GetResolverRuleAssociationResponse>;
export interface GetResolverRulePolicyResponse {
  ResolverRulePolicy?: string;
}
export const GetResolverRulePolicyResponse = S.suspend(() =>
  S.Struct({ ResolverRulePolicy: S.optional(S.String) }),
).annotations({
  identifier: "GetResolverRulePolicyResponse",
}) as any as S.Schema<GetResolverRulePolicyResponse>;
export interface ImportFirewallDomainsResponse {
  Id?: string;
  Name?: string;
  Status?: string;
  StatusMessage?: string;
}
export const ImportFirewallDomainsResponse = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    StatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "ImportFirewallDomainsResponse",
}) as any as S.Schema<ImportFirewallDomainsResponse>;
export interface ListFirewallConfigsResponse {
  NextToken?: string;
  FirewallConfigs?: FirewallConfigList;
}
export const ListFirewallConfigsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    FirewallConfigs: S.optional(FirewallConfigList),
  }),
).annotations({
  identifier: "ListFirewallConfigsResponse",
}) as any as S.Schema<ListFirewallConfigsResponse>;
export interface ListFirewallDomainsResponse {
  NextToken?: string;
  Domains?: FirewallDomains;
}
export const ListFirewallDomainsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Domains: S.optional(FirewallDomains),
  }),
).annotations({
  identifier: "ListFirewallDomainsResponse",
}) as any as S.Schema<ListFirewallDomainsResponse>;
export interface ListFirewallRuleGroupAssociationsResponse {
  NextToken?: string;
  FirewallRuleGroupAssociations?: FirewallRuleGroupAssociations;
}
export const ListFirewallRuleGroupAssociationsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    FirewallRuleGroupAssociations: S.optional(FirewallRuleGroupAssociations),
  }),
).annotations({
  identifier: "ListFirewallRuleGroupAssociationsResponse",
}) as any as S.Schema<ListFirewallRuleGroupAssociationsResponse>;
export interface ListFirewallRulesResponse {
  NextToken?: string;
  FirewallRules?: FirewallRules;
}
export const ListFirewallRulesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    FirewallRules: S.optional(FirewallRules),
  }),
).annotations({
  identifier: "ListFirewallRulesResponse",
}) as any as S.Schema<ListFirewallRulesResponse>;
export interface ListOutpostResolversResponse {
  OutpostResolvers?: OutpostResolverList;
  NextToken?: string;
}
export const ListOutpostResolversResponse = S.suspend(() =>
  S.Struct({
    OutpostResolvers: S.optional(OutpostResolverList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListOutpostResolversResponse",
}) as any as S.Schema<ListOutpostResolversResponse>;
export interface ListResolverConfigsResponse {
  NextToken?: string;
  ResolverConfigs?: ResolverConfigList;
}
export const ListResolverConfigsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ResolverConfigs: S.optional(ResolverConfigList),
  }),
).annotations({
  identifier: "ListResolverConfigsResponse",
}) as any as S.Schema<ListResolverConfigsResponse>;
export interface ListResolverDnssecConfigsRequest {
  MaxResults?: number;
  NextToken?: string;
  Filters?: Filters;
}
export const ListResolverDnssecConfigsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(Filters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListResolverDnssecConfigsRequest",
}) as any as S.Schema<ListResolverDnssecConfigsRequest>;
export interface ListResolverEndpointsResponse {
  NextToken?: string;
  MaxResults?: number;
  ResolverEndpoints?: ResolverEndpoints;
}
export const ListResolverEndpointsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ResolverEndpoints: S.optional(ResolverEndpoints),
  }),
).annotations({
  identifier: "ListResolverEndpointsResponse",
}) as any as S.Schema<ListResolverEndpointsResponse>;
export interface ListResolverQueryLogConfigAssociationsResponse {
  NextToken?: string;
  TotalCount?: number;
  TotalFilteredCount?: number;
  ResolverQueryLogConfigAssociations?: ResolverQueryLogConfigAssociationList;
}
export const ListResolverQueryLogConfigAssociationsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    TotalCount: S.optional(S.Number),
    TotalFilteredCount: S.optional(S.Number),
    ResolverQueryLogConfigAssociations: S.optional(
      ResolverQueryLogConfigAssociationList,
    ),
  }),
).annotations({
  identifier: "ListResolverQueryLogConfigAssociationsResponse",
}) as any as S.Schema<ListResolverQueryLogConfigAssociationsResponse>;
export interface ListResolverQueryLogConfigsResponse {
  NextToken?: string;
  TotalCount?: number;
  TotalFilteredCount?: number;
  ResolverQueryLogConfigs?: ResolverQueryLogConfigList;
}
export const ListResolverQueryLogConfigsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    TotalCount: S.optional(S.Number),
    TotalFilteredCount: S.optional(S.Number),
    ResolverQueryLogConfigs: S.optional(ResolverQueryLogConfigList),
  }),
).annotations({
  identifier: "ListResolverQueryLogConfigsResponse",
}) as any as S.Schema<ListResolverQueryLogConfigsResponse>;
export interface ListResolverRuleAssociationsResponse {
  NextToken?: string;
  MaxResults?: number;
  ResolverRuleAssociations?: ResolverRuleAssociations;
}
export const ListResolverRuleAssociationsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ResolverRuleAssociations: S.optional(ResolverRuleAssociations),
  }),
).annotations({
  identifier: "ListResolverRuleAssociationsResponse",
}) as any as S.Schema<ListResolverRuleAssociationsResponse>;
export interface ListResolverRulesResponse {
  NextToken?: string;
  MaxResults?: number;
  ResolverRules?: ResolverRules;
}
export const ListResolverRulesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ResolverRules: S.optional(ResolverRules),
  }),
).annotations({
  identifier: "ListResolverRulesResponse",
}) as any as S.Schema<ListResolverRulesResponse>;
export interface ListTagsForResourceResponse {
  Tags?: TagList;
  NextToken?: string;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutFirewallRuleGroupPolicyResponse {
  ReturnValue?: boolean;
}
export const PutFirewallRuleGroupPolicyResponse = S.suspend(() =>
  S.Struct({ ReturnValue: S.optional(S.Boolean) }),
).annotations({
  identifier: "PutFirewallRuleGroupPolicyResponse",
}) as any as S.Schema<PutFirewallRuleGroupPolicyResponse>;
export interface PutResolverQueryLogConfigPolicyResponse {
  ReturnValue?: boolean;
}
export const PutResolverQueryLogConfigPolicyResponse = S.suspend(() =>
  S.Struct({ ReturnValue: S.optional(S.Boolean) }),
).annotations({
  identifier: "PutResolverQueryLogConfigPolicyResponse",
}) as any as S.Schema<PutResolverQueryLogConfigPolicyResponse>;
export interface PutResolverRulePolicyResponse {
  ReturnValue?: boolean;
}
export const PutResolverRulePolicyResponse = S.suspend(() =>
  S.Struct({ ReturnValue: S.optional(S.Boolean) }),
).annotations({
  identifier: "PutResolverRulePolicyResponse",
}) as any as S.Schema<PutResolverRulePolicyResponse>;
export interface UpdateFirewallConfigResponse {
  FirewallConfig?: FirewallConfig;
}
export const UpdateFirewallConfigResponse = S.suspend(() =>
  S.Struct({ FirewallConfig: S.optional(FirewallConfig) }),
).annotations({
  identifier: "UpdateFirewallConfigResponse",
}) as any as S.Schema<UpdateFirewallConfigResponse>;
export interface UpdateFirewallDomainsResponse {
  Id?: string;
  Name?: string;
  Status?: string;
  StatusMessage?: string;
}
export const UpdateFirewallDomainsResponse = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    StatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateFirewallDomainsResponse",
}) as any as S.Schema<UpdateFirewallDomainsResponse>;
export interface UpdateFirewallRuleResponse {
  FirewallRule?: FirewallRule;
}
export const UpdateFirewallRuleResponse = S.suspend(() =>
  S.Struct({ FirewallRule: S.optional(FirewallRule) }),
).annotations({
  identifier: "UpdateFirewallRuleResponse",
}) as any as S.Schema<UpdateFirewallRuleResponse>;
export interface UpdateFirewallRuleGroupAssociationResponse {
  FirewallRuleGroupAssociation?: FirewallRuleGroupAssociation;
}
export const UpdateFirewallRuleGroupAssociationResponse = S.suspend(() =>
  S.Struct({
    FirewallRuleGroupAssociation: S.optional(FirewallRuleGroupAssociation),
  }),
).annotations({
  identifier: "UpdateFirewallRuleGroupAssociationResponse",
}) as any as S.Schema<UpdateFirewallRuleGroupAssociationResponse>;
export interface UpdateOutpostResolverResponse {
  OutpostResolver?: OutpostResolver;
}
export const UpdateOutpostResolverResponse = S.suspend(() =>
  S.Struct({ OutpostResolver: S.optional(OutpostResolver) }),
).annotations({
  identifier: "UpdateOutpostResolverResponse",
}) as any as S.Schema<UpdateOutpostResolverResponse>;
export interface UpdateResolverConfigResponse {
  ResolverConfig?: ResolverConfig;
}
export const UpdateResolverConfigResponse = S.suspend(() =>
  S.Struct({ ResolverConfig: S.optional(ResolverConfig) }),
).annotations({
  identifier: "UpdateResolverConfigResponse",
}) as any as S.Schema<UpdateResolverConfigResponse>;
export interface ResolverDnssecConfig {
  Id?: string;
  OwnerId?: string;
  ResourceId?: string;
  ValidationStatus?: string;
}
export const ResolverDnssecConfig = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    OwnerId: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ValidationStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "ResolverDnssecConfig",
}) as any as S.Schema<ResolverDnssecConfig>;
export interface UpdateResolverDnssecConfigResponse {
  ResolverDNSSECConfig?: ResolverDnssecConfig;
}
export const UpdateResolverDnssecConfigResponse = S.suspend(() =>
  S.Struct({ ResolverDNSSECConfig: S.optional(ResolverDnssecConfig) }),
).annotations({
  identifier: "UpdateResolverDnssecConfigResponse",
}) as any as S.Schema<UpdateResolverDnssecConfigResponse>;
export interface UpdateResolverEndpointRequest {
  ResolverEndpointId: string;
  Name?: string;
  ResolverEndpointType?: string;
  UpdateIpAddresses?: UpdateIpAddresses;
  Protocols?: ProtocolList;
  RniEnhancedMetricsEnabled?: boolean;
  TargetNameServerMetricsEnabled?: boolean;
}
export const UpdateResolverEndpointRequest = S.suspend(() =>
  S.Struct({
    ResolverEndpointId: S.String,
    Name: S.optional(S.String),
    ResolverEndpointType: S.optional(S.String),
    UpdateIpAddresses: S.optional(UpdateIpAddresses),
    Protocols: S.optional(ProtocolList),
    RniEnhancedMetricsEnabled: S.optional(S.Boolean),
    TargetNameServerMetricsEnabled: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateResolverEndpointRequest",
}) as any as S.Schema<UpdateResolverEndpointRequest>;
export interface UpdateResolverRuleRequest {
  ResolverRuleId: string;
  Config: ResolverRuleConfig;
}
export const UpdateResolverRuleRequest = S.suspend(() =>
  S.Struct({ ResolverRuleId: S.String, Config: ResolverRuleConfig }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateResolverRuleRequest",
}) as any as S.Schema<UpdateResolverRuleRequest>;
export interface FirewallDomainListMetadata {
  Id?: string;
  Arn?: string;
  Name?: string;
  CreatorRequestId?: string;
  ManagedOwnerName?: string;
}
export const FirewallDomainListMetadata = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    CreatorRequestId: S.optional(S.String),
    ManagedOwnerName: S.optional(S.String),
  }),
).annotations({
  identifier: "FirewallDomainListMetadata",
}) as any as S.Schema<FirewallDomainListMetadata>;
export type FirewallDomainListMetadataList = FirewallDomainListMetadata[];
export const FirewallDomainListMetadataList = S.Array(
  FirewallDomainListMetadata,
);
export interface FirewallRuleGroupMetadata {
  Id?: string;
  Arn?: string;
  Name?: string;
  OwnerId?: string;
  CreatorRequestId?: string;
  ShareStatus?: string;
}
export const FirewallRuleGroupMetadata = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    OwnerId: S.optional(S.String),
    CreatorRequestId: S.optional(S.String),
    ShareStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "FirewallRuleGroupMetadata",
}) as any as S.Schema<FirewallRuleGroupMetadata>;
export type FirewallRuleGroupMetadataList = FirewallRuleGroupMetadata[];
export const FirewallRuleGroupMetadataList = S.Array(FirewallRuleGroupMetadata);
export type ResolverDnssecConfigList = ResolverDnssecConfig[];
export const ResolverDnssecConfigList = S.Array(ResolverDnssecConfig);
export interface IpAddressResponse {
  IpId?: string;
  SubnetId?: string;
  Ip?: string;
  Ipv6?: string;
  Status?: string;
  StatusMessage?: string;
  CreationTime?: string;
  ModificationTime?: string;
}
export const IpAddressResponse = S.suspend(() =>
  S.Struct({
    IpId: S.optional(S.String),
    SubnetId: S.optional(S.String),
    Ip: S.optional(S.String),
    Ipv6: S.optional(S.String),
    Status: S.optional(S.String),
    StatusMessage: S.optional(S.String),
    CreationTime: S.optional(S.String),
    ModificationTime: S.optional(S.String),
  }),
).annotations({
  identifier: "IpAddressResponse",
}) as any as S.Schema<IpAddressResponse>;
export type IpAddressesResponse = IpAddressResponse[];
export const IpAddressesResponse = S.Array(IpAddressResponse);
export interface AssociateFirewallRuleGroupResponse {
  FirewallRuleGroupAssociation?: FirewallRuleGroupAssociation;
}
export const AssociateFirewallRuleGroupResponse = S.suspend(() =>
  S.Struct({
    FirewallRuleGroupAssociation: S.optional(FirewallRuleGroupAssociation),
  }),
).annotations({
  identifier: "AssociateFirewallRuleGroupResponse",
}) as any as S.Schema<AssociateFirewallRuleGroupResponse>;
export interface AssociateResolverEndpointIpAddressResponse {
  ResolverEndpoint?: ResolverEndpoint;
}
export const AssociateResolverEndpointIpAddressResponse = S.suspend(() =>
  S.Struct({ ResolverEndpoint: S.optional(ResolverEndpoint) }),
).annotations({
  identifier: "AssociateResolverEndpointIpAddressResponse",
}) as any as S.Schema<AssociateResolverEndpointIpAddressResponse>;
export interface AssociateResolverQueryLogConfigResponse {
  ResolverQueryLogConfigAssociation?: ResolverQueryLogConfigAssociation;
}
export const AssociateResolverQueryLogConfigResponse = S.suspend(() =>
  S.Struct({
    ResolverQueryLogConfigAssociation: S.optional(
      ResolverQueryLogConfigAssociation,
    ),
  }),
).annotations({
  identifier: "AssociateResolverQueryLogConfigResponse",
}) as any as S.Schema<AssociateResolverQueryLogConfigResponse>;
export interface AssociateResolverRuleResponse {
  ResolverRuleAssociation?: ResolverRuleAssociation;
}
export const AssociateResolverRuleResponse = S.suspend(() =>
  S.Struct({ ResolverRuleAssociation: S.optional(ResolverRuleAssociation) }),
).annotations({
  identifier: "AssociateResolverRuleResponse",
}) as any as S.Schema<AssociateResolverRuleResponse>;
export interface CreateFirewallDomainListResponse {
  FirewallDomainList?: FirewallDomainList;
}
export const CreateFirewallDomainListResponse = S.suspend(() =>
  S.Struct({ FirewallDomainList: S.optional(FirewallDomainList) }),
).annotations({
  identifier: "CreateFirewallDomainListResponse",
}) as any as S.Schema<CreateFirewallDomainListResponse>;
export interface CreateFirewallRuleResponse {
  FirewallRule?: FirewallRule;
}
export const CreateFirewallRuleResponse = S.suspend(() =>
  S.Struct({ FirewallRule: S.optional(FirewallRule) }),
).annotations({
  identifier: "CreateFirewallRuleResponse",
}) as any as S.Schema<CreateFirewallRuleResponse>;
export interface CreateFirewallRuleGroupResponse {
  FirewallRuleGroup?: FirewallRuleGroup;
}
export const CreateFirewallRuleGroupResponse = S.suspend(() =>
  S.Struct({ FirewallRuleGroup: S.optional(FirewallRuleGroup) }),
).annotations({
  identifier: "CreateFirewallRuleGroupResponse",
}) as any as S.Schema<CreateFirewallRuleGroupResponse>;
export interface CreateOutpostResolverResponse {
  OutpostResolver?: OutpostResolver;
}
export const CreateOutpostResolverResponse = S.suspend(() =>
  S.Struct({ OutpostResolver: S.optional(OutpostResolver) }),
).annotations({
  identifier: "CreateOutpostResolverResponse",
}) as any as S.Schema<CreateOutpostResolverResponse>;
export interface CreateResolverEndpointResponse {
  ResolverEndpoint?: ResolverEndpoint;
}
export const CreateResolverEndpointResponse = S.suspend(() =>
  S.Struct({ ResolverEndpoint: S.optional(ResolverEndpoint) }),
).annotations({
  identifier: "CreateResolverEndpointResponse",
}) as any as S.Schema<CreateResolverEndpointResponse>;
export interface CreateResolverQueryLogConfigResponse {
  ResolverQueryLogConfig?: ResolverQueryLogConfig;
}
export const CreateResolverQueryLogConfigResponse = S.suspend(() =>
  S.Struct({ ResolverQueryLogConfig: S.optional(ResolverQueryLogConfig) }),
).annotations({
  identifier: "CreateResolverQueryLogConfigResponse",
}) as any as S.Schema<CreateResolverQueryLogConfigResponse>;
export interface CreateResolverRuleResponse {
  ResolverRule?: ResolverRule;
}
export const CreateResolverRuleResponse = S.suspend(() =>
  S.Struct({ ResolverRule: S.optional(ResolverRule) }),
).annotations({
  identifier: "CreateResolverRuleResponse",
}) as any as S.Schema<CreateResolverRuleResponse>;
export interface DeleteResolverEndpointResponse {
  ResolverEndpoint?: ResolverEndpoint;
}
export const DeleteResolverEndpointResponse = S.suspend(() =>
  S.Struct({ ResolverEndpoint: S.optional(ResolverEndpoint) }),
).annotations({
  identifier: "DeleteResolverEndpointResponse",
}) as any as S.Schema<DeleteResolverEndpointResponse>;
export interface DeleteResolverRuleResponse {
  ResolverRule?: ResolverRule;
}
export const DeleteResolverRuleResponse = S.suspend(() =>
  S.Struct({ ResolverRule: S.optional(ResolverRule) }),
).annotations({
  identifier: "DeleteResolverRuleResponse",
}) as any as S.Schema<DeleteResolverRuleResponse>;
export interface DisassociateFirewallRuleGroupResponse {
  FirewallRuleGroupAssociation?: FirewallRuleGroupAssociation;
}
export const DisassociateFirewallRuleGroupResponse = S.suspend(() =>
  S.Struct({
    FirewallRuleGroupAssociation: S.optional(FirewallRuleGroupAssociation),
  }),
).annotations({
  identifier: "DisassociateFirewallRuleGroupResponse",
}) as any as S.Schema<DisassociateFirewallRuleGroupResponse>;
export interface GetFirewallConfigResponse {
  FirewallConfig?: FirewallConfig;
}
export const GetFirewallConfigResponse = S.suspend(() =>
  S.Struct({ FirewallConfig: S.optional(FirewallConfig) }),
).annotations({
  identifier: "GetFirewallConfigResponse",
}) as any as S.Schema<GetFirewallConfigResponse>;
export interface GetResolverConfigResponse {
  ResolverConfig?: ResolverConfig;
}
export const GetResolverConfigResponse = S.suspend(() =>
  S.Struct({ ResolverConfig: S.optional(ResolverConfig) }),
).annotations({
  identifier: "GetResolverConfigResponse",
}) as any as S.Schema<GetResolverConfigResponse>;
export interface GetResolverDnssecConfigResponse {
  ResolverDNSSECConfig?: ResolverDnssecConfig;
}
export const GetResolverDnssecConfigResponse = S.suspend(() =>
  S.Struct({ ResolverDNSSECConfig: S.optional(ResolverDnssecConfig) }),
).annotations({
  identifier: "GetResolverDnssecConfigResponse",
}) as any as S.Schema<GetResolverDnssecConfigResponse>;
export interface ListFirewallDomainListsResponse {
  NextToken?: string;
  FirewallDomainLists?: FirewallDomainListMetadataList;
}
export const ListFirewallDomainListsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    FirewallDomainLists: S.optional(FirewallDomainListMetadataList),
  }),
).annotations({
  identifier: "ListFirewallDomainListsResponse",
}) as any as S.Schema<ListFirewallDomainListsResponse>;
export interface ListFirewallRuleGroupsResponse {
  NextToken?: string;
  FirewallRuleGroups?: FirewallRuleGroupMetadataList;
}
export const ListFirewallRuleGroupsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    FirewallRuleGroups: S.optional(FirewallRuleGroupMetadataList),
  }),
).annotations({
  identifier: "ListFirewallRuleGroupsResponse",
}) as any as S.Schema<ListFirewallRuleGroupsResponse>;
export interface ListResolverDnssecConfigsResponse {
  NextToken?: string;
  ResolverDnssecConfigs?: ResolverDnssecConfigList;
}
export const ListResolverDnssecConfigsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ResolverDnssecConfigs: S.optional(ResolverDnssecConfigList),
  }),
).annotations({
  identifier: "ListResolverDnssecConfigsResponse",
}) as any as S.Schema<ListResolverDnssecConfigsResponse>;
export interface ListResolverEndpointIpAddressesResponse {
  NextToken?: string;
  MaxResults?: number;
  IpAddresses?: IpAddressesResponse;
}
export const ListResolverEndpointIpAddressesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    IpAddresses: S.optional(IpAddressesResponse),
  }),
).annotations({
  identifier: "ListResolverEndpointIpAddressesResponse",
}) as any as S.Schema<ListResolverEndpointIpAddressesResponse>;
export interface UpdateResolverEndpointResponse {
  ResolverEndpoint?: ResolverEndpoint;
}
export const UpdateResolverEndpointResponse = S.suspend(() =>
  S.Struct({ ResolverEndpoint: S.optional(ResolverEndpoint) }),
).annotations({
  identifier: "UpdateResolverEndpointResponse",
}) as any as S.Schema<UpdateResolverEndpointResponse>;
export interface UpdateResolverRuleResponse {
  ResolverRule?: ResolverRule;
}
export const UpdateResolverRuleResponse = S.suspend(() =>
  S.Struct({ ResolverRule: S.optional(ResolverRule) }),
).annotations({
  identifier: "UpdateResolverRuleResponse",
}) as any as S.Schema<UpdateResolverRuleResponse>;

//# Errors
export class InternalServiceErrorException extends S.TaggedError<InternalServiceErrorException>()(
  "InternalServiceErrorException",
  { Message: S.optional(S.String) },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { Message: S.String, FieldName: S.optional(S.String) },
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String), ResourceType: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { Message: S.optional(S.String) },
) {}
export class UnknownResourceException extends S.TaggedError<UnknownResourceException>()(
  "UnknownResourceException",
  { Message: S.optional(S.String) },
) {}
export class InvalidPolicyDocument extends S.TaggedError<InvalidPolicyDocument>()(
  "InvalidPolicyDocument",
  { Message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String), ResourceType: S.optional(S.String) },
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { Message: S.optional(S.String), ResourceType: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
) {}
export class InvalidTagException extends S.TaggedError<InvalidTagException>()(
  "InvalidTagException",
  { Message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
) {}
export class ResourceUnavailableException extends S.TaggedError<ResourceUnavailableException>()(
  "ResourceUnavailableException",
  { Message: S.optional(S.String), ResourceType: S.optional(S.String) },
) {}
export class ResourceExistsException extends S.TaggedError<ResourceExistsException>()(
  "ResourceExistsException",
  { Message: S.optional(S.String), ResourceType: S.optional(S.String) },
) {}

//# Operations
/**
 * Gets information about the Resolver rule policy for a specified rule. A Resolver rule policy includes the rule that you want to share
 * with another account, the account that you want to share the rule with, and the Resolver operations that you want to allow the account to use.
 */
export const getResolverRulePolicy: (
  input: GetResolverRulePolicyRequest,
) => Effect.Effect<
  GetResolverRulePolicyResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidParameterException
  | UnknownResourceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResolverRulePolicyRequest,
  output: GetResolverRulePolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidParameterException,
    UnknownResourceException,
  ],
}));
/**
 * Specifies an Amazon Web Services account that you want to share a query logging configuration with, the query logging configuration that you want to share,
 * and the operations that you want the account to be able to perform on the configuration.
 */
export const putResolverQueryLogConfigPolicy: (
  input: PutResolverQueryLogConfigPolicyRequest,
) => Effect.Effect<
  PutResolverQueryLogConfigPolicyResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidParameterException
  | InvalidPolicyDocument
  | InvalidRequestException
  | UnknownResourceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResolverQueryLogConfigPolicyRequest,
  output: PutResolverQueryLogConfigPolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidParameterException,
    InvalidPolicyDocument,
    InvalidRequestException,
    UnknownResourceException,
  ],
}));
/**
 * Retrieves the specified firewall domain list.
 */
export const getFirewallDomainList: (
  input: GetFirewallDomainListRequest,
) => Effect.Effect<
  GetFirewallDomainListResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFirewallDomainListRequest,
  output: GetFirewallDomainListResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves the specified firewall rule group.
 */
export const getFirewallRuleGroup: (
  input: GetFirewallRuleGroupRequest,
) => Effect.Effect<
  GetFirewallRuleGroupResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFirewallRuleGroupRequest,
  output: GetFirewallRuleGroupResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a firewall rule group association, which enables DNS filtering for a VPC with one rule group. A VPC can have more than one firewall rule group association, and a rule group can be associated with more than one VPC.
 */
export const getFirewallRuleGroupAssociation: (
  input: GetFirewallRuleGroupAssociationRequest,
) => Effect.Effect<
  GetFirewallRuleGroupAssociationResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFirewallRuleGroupAssociationRequest,
  output: GetFirewallRuleGroupAssociationResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Removes the association between a specified Resolver rule and a specified VPC.
 *
 * If you disassociate a Resolver rule from a VPC, Resolver stops forwarding DNS queries for the
 * domain name that you specified in the Resolver rule.
 */
export const disassociateResolverRule: (
  input: DisassociateResolverRuleRequest,
) => Effect.Effect<
  DisassociateResolverRuleResponse,
  | InternalServiceErrorException
  | InvalidParameterException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateResolverRuleRequest,
  output: DisassociateResolverRuleResponse,
  errors: [
    InternalServiceErrorException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets information about a specified Resolver endpoint, such as whether it's an inbound or an outbound Resolver endpoint, and the
 * current status of the endpoint.
 */
export const getResolverEndpoint: (
  input: GetResolverEndpointRequest,
) => Effect.Effect<
  GetResolverEndpointResponse,
  | InternalServiceErrorException
  | InvalidParameterException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResolverEndpointRequest,
  output: GetResolverEndpointResponse,
  errors: [
    InternalServiceErrorException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets information about a specified Resolver rule, such as the domain name that the rule forwards DNS queries for and the ID of the
 * outbound Resolver endpoint that the rule is associated with.
 */
export const getResolverRule: (
  input: GetResolverRuleRequest,
) => Effect.Effect<
  GetResolverRuleResponse,
  | InternalServiceErrorException
  | InvalidParameterException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResolverRuleRequest,
  output: GetResolverRuleResponse,
  errors: [
    InternalServiceErrorException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets information about an association between a specified Resolver rule and a VPC. You associate a Resolver rule and a VPC using
 * AssociateResolverRule.
 */
export const getResolverRuleAssociation: (
  input: GetResolverRuleAssociationRequest,
) => Effect.Effect<
  GetResolverRuleAssociationResponse,
  | InternalServiceErrorException
  | InvalidParameterException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResolverRuleAssociationRequest,
  output: GetResolverRuleAssociationResponse,
  errors: [
    InternalServiceErrorException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets the IP addresses for a specified Resolver endpoint.
 */
export const listResolverEndpointIpAddresses: {
  (
    input: ListResolverEndpointIpAddressesRequest,
  ): Effect.Effect<
    ListResolverEndpointIpAddressesResponse,
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResolverEndpointIpAddressesRequest,
  ) => Stream.Stream<
    ListResolverEndpointIpAddressesResponse,
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResolverEndpointIpAddressesRequest,
  ) => Stream.Stream<
    IpAddressResponse,
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResolverEndpointIpAddressesRequest,
  output: ListResolverEndpointIpAddressesResponse,
  errors: [
    InternalServiceErrorException,
    InvalidNextTokenException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "IpAddresses",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Deletes the specified domain list.
 */
export const deleteFirewallDomainList: (
  input: DeleteFirewallDomainListRequest,
) => Effect.Effect<
  DeleteFirewallDomainListResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFirewallDomainListRequest,
  output: DeleteFirewallDomainListResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a Resolver rule. Before you can delete a Resolver rule, you must disassociate it from all the VPCs that you
 * associated the Resolver rule with. For more information, see
 * DisassociateResolverRule.
 */
export const deleteResolverRule: (
  input: DeleteResolverRuleRequest,
) => Effect.Effect<
  DeleteResolverRuleResponse,
  | InternalServiceErrorException
  | InvalidParameterException
  | ResourceInUseException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResolverRuleRequest,
  output: DeleteResolverRuleResponse,
  errors: [
    InternalServiceErrorException,
    InvalidParameterException,
    ResourceInUseException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the name, or endpoint type for an inbound or an outbound Resolver endpoint.
 * You can only update between IPV4 and DUALSTACK, IPV6 endpoint type can't be updated to other type.
 */
export const updateResolverEndpoint: (
  input: UpdateResolverEndpointRequest,
) => Effect.Effect<
  UpdateResolverEndpointResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResolverEndpointRequest,
  output: UpdateResolverEndpointResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a query logging configuration. When you delete a configuration, Resolver stops logging DNS queries for all of the Amazon VPCs that are
 * associated with the configuration. This also applies if the query logging configuration is shared with other Amazon Web Services accounts, and
 * the other accounts have associated VPCs with the shared configuration.
 *
 * Before you can delete a query logging configuration, you must first disassociate all VPCs from the configuration. See
 * DisassociateResolverQueryLogConfig.
 *
 * If you used Resource Access Manager (RAM) to share a query logging configuration with other accounts, you must stop sharing
 * the configuration before you can delete a configuration. The accounts that you shared the configuration with can first disassociate VPCs
 * that they associated with the configuration, but that's not necessary. If you stop sharing the configuration, those VPCs are automatically
 * disassociated from the configuration.
 */
export const deleteResolverQueryLogConfig: (
  input: DeleteResolverQueryLogConfigRequest,
) => Effect.Effect<
  DeleteResolverQueryLogConfigResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResolverQueryLogConfigRequest,
  output: DeleteResolverQueryLogConfigResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Disassociates a VPC from a query logging configuration.
 *
 * Before you can delete a query logging configuration, you must first disassociate all VPCs
 * from the configuration. If you used Resource Access Manager (RAM) to share a
 * query logging configuration with other accounts, VPCs can be disassociated from the
 * configuration in the following ways:
 *
 * - The accounts that you shared the configuration with can disassociate VPCs from the configuration.
 *
 * - You can stop sharing the configuration.
 */
export const disassociateResolverQueryLogConfig: (
  input: DisassociateResolverQueryLogConfigRequest,
) => Effect.Effect<
  DisassociateResolverQueryLogConfigResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateResolverQueryLogConfigRequest,
  output: DisassociateResolverQueryLogConfigResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets information about a specified Resolver query logging configuration, such as the number of VPCs that the configuration
 * is logging queries for and the location that logs are sent to.
 */
export const getResolverQueryLogConfig: (
  input: GetResolverQueryLogConfigRequest,
) => Effect.Effect<
  GetResolverQueryLogConfigResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResolverQueryLogConfigRequest,
  output: GetResolverQueryLogConfigResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets information about a specified association between a Resolver query logging configuration and an Amazon VPC. When you associate a VPC
 * with a query logging configuration, Resolver logs DNS queries that originate in that VPC.
 */
export const getResolverQueryLogConfigAssociation: (
  input: GetResolverQueryLogConfigAssociationRequest,
) => Effect.Effect<
  GetResolverQueryLogConfigAssociationResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResolverQueryLogConfigAssociationRequest,
  output: GetResolverQueryLogConfigAssociationResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets information about a query logging policy. A query logging policy specifies the Resolver query logging
 * operations and resources that you want to allow another Amazon Web Services account to be able to use.
 */
export const getResolverQueryLogConfigPolicy: (
  input: GetResolverQueryLogConfigPolicyRequest,
) => Effect.Effect<
  GetResolverQueryLogConfigPolicyResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidParameterException
  | InvalidRequestException
  | UnknownResourceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResolverQueryLogConfigPolicyRequest,
  output: GetResolverQueryLogConfigPolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidParameterException,
    InvalidRequestException,
    UnknownResourceException,
  ],
}));
/**
 * Lists information about associations between Amazon VPCs and query logging configurations.
 */
export const listResolverQueryLogConfigAssociations: {
  (
    input: ListResolverQueryLogConfigAssociationsRequest,
  ): Effect.Effect<
    ListResolverQueryLogConfigAssociationsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidParameterException
    | InvalidRequestException
    | LimitExceededException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResolverQueryLogConfigAssociationsRequest,
  ) => Stream.Stream<
    ListResolverQueryLogConfigAssociationsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidParameterException
    | InvalidRequestException
    | LimitExceededException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResolverQueryLogConfigAssociationsRequest,
  ) => Stream.Stream<
    ResolverQueryLogConfigAssociation,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidParameterException
    | InvalidRequestException
    | LimitExceededException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResolverQueryLogConfigAssociationsRequest,
  output: ListResolverQueryLogConfigAssociationsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ResolverQueryLogConfigAssociations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Updates an existing DNSSEC validation configuration. If there is no existing DNSSEC validation configuration, one is created.
 */
export const updateResolverDnssecConfig: (
  input: UpdateResolverDnssecConfigRequest,
) => Effect.Effect<
  UpdateResolverDnssecConfigResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResolverDnssecConfigRequest,
  output: UpdateResolverDnssecConfigResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists all the Resolver endpoints that were created using the current Amazon Web Services account.
 */
export const listResolverEndpoints: {
  (
    input: ListResolverEndpointsRequest,
  ): Effect.Effect<
    ListResolverEndpointsResponse,
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResolverEndpointsRequest,
  ) => Stream.Stream<
    ListResolverEndpointsResponse,
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResolverEndpointsRequest,
  ) => Stream.Stream<
    ResolverEndpoint,
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResolverEndpointsRequest,
  output: ListResolverEndpointsResponse,
  errors: [
    InternalServiceErrorException,
    InvalidNextTokenException,
    InvalidParameterException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ResolverEndpoints",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Removes one or more tags from a specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | InternalServiceErrorException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServiceErrorException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a Resolver endpoint. The effect of deleting a Resolver endpoint depends on whether it's an inbound or an outbound
 * Resolver endpoint:
 *
 * - **Inbound**: DNS queries from your network are no longer routed
 * to the DNS service for the specified VPC.
 *
 * - **Outbound**: DNS queries from a VPC are no longer routed to your network.
 */
export const deleteResolverEndpoint: (
  input: DeleteResolverEndpointRequest,
) => Effect.Effect<
  DeleteResolverEndpointResponse,
  | InternalServiceErrorException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResolverEndpointRequest,
  output: DeleteResolverEndpointResponse,
  errors: [
    InternalServiceErrorException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets DNSSEC validation information for a specified resource.
 */
export const getResolverDnssecConfig: (
  input: GetResolverDnssecConfigRequest,
) => Effect.Effect<
  GetResolverDnssecConfigResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResolverDnssecConfigRequest,
  output: GetResolverDnssecConfigResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists the associations that were created between Resolver rules and VPCs using the current Amazon Web Services account.
 */
export const listResolverRuleAssociations: {
  (
    input: ListResolverRuleAssociationsRequest,
  ): Effect.Effect<
    ListResolverRuleAssociationsResponse,
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResolverRuleAssociationsRequest,
  ) => Stream.Stream<
    ListResolverRuleAssociationsResponse,
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResolverRuleAssociationsRequest,
  ) => Stream.Stream<
    ResolverRuleAssociation,
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResolverRuleAssociationsRequest,
  output: ListResolverRuleAssociationsResponse,
  errors: [
    InternalServiceErrorException,
    InvalidNextTokenException,
    InvalidParameterException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ResolverRuleAssociations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the Resolver rules that were created using the current Amazon Web Services account.
 */
export const listResolverRules: {
  (
    input: ListResolverRulesRequest,
  ): Effect.Effect<
    ListResolverRulesResponse,
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResolverRulesRequest,
  ) => Stream.Stream<
    ListResolverRulesResponse,
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResolverRulesRequest,
  ) => Stream.Stream<
    ResolverRule,
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResolverRulesRequest,
  output: ListResolverRulesResponse,
  errors: [
    InternalServiceErrorException,
    InvalidNextTokenException,
    InvalidParameterException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ResolverRules",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the tags that you associated with the specified resource.
 */
export const listTagsForResource: {
  (
    input: ListTagsForResourceRequest,
  ): Effect.Effect<
    ListTagsForResourceResponse,
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTagsForResourceRequest,
  ) => Stream.Stream<
    ListTagsForResourceResponse,
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTagsForResourceRequest,
  ) => Stream.Stream<
    Tag,
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServiceErrorException,
    InvalidNextTokenException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Tags",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the configurations for DNSSEC validation that are associated with the current Amazon Web Services account.
 */
export const listResolverDnssecConfigs: {
  (
    input: ListResolverDnssecConfigsRequest,
  ): Effect.Effect<
    ListResolverDnssecConfigsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResolverDnssecConfigsRequest,
  ) => Stream.Stream<
    ListResolverDnssecConfigsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResolverDnssecConfigsRequest,
  ) => Stream.Stream<
    ResolverDnssecConfig,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResolverDnssecConfigsRequest,
  output: ListResolverDnssecConfigsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidNextTokenException,
    InvalidParameterException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ResolverDnssecConfigs",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists information about the specified query logging configurations. Each configuration defines where you want Resolver to save
 * DNS query logs and specifies the VPCs that you want to log queries for.
 */
export const listResolverQueryLogConfigs: {
  (
    input: ListResolverQueryLogConfigsRequest,
  ): Effect.Effect<
    ListResolverQueryLogConfigsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResolverQueryLogConfigsRequest,
  ) => Stream.Stream<
    ListResolverQueryLogConfigsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResolverQueryLogConfigsRequest,
  ) => Stream.Stream<
    ResolverQueryLogConfig,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResolverQueryLogConfigsRequest,
  output: ListResolverQueryLogConfigsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidNextTokenException,
    InvalidParameterException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ResolverQueryLogConfigs",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Specifies an Amazon Web Services rule that you want to share with another account, the account that you want to share the rule with,
 * and the operations that you want the account to be able to perform on the rule.
 */
export const putResolverRulePolicy: (
  input: PutResolverRulePolicyRequest,
) => Effect.Effect<
  PutResolverRulePolicyResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidParameterException
  | InvalidPolicyDocument
  | UnknownResourceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResolverRulePolicyRequest,
  output: PutResolverRulePolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidParameterException,
    InvalidPolicyDocument,
    UnknownResourceException,
  ],
}));
/**
 * Retrieves the firewall domain lists that you have defined. For each firewall domain list, you can retrieve the domains that are defined for a list by calling ListFirewallDomains.
 *
 * A single call to this list operation might return only a partial list of the domain lists. For information, see `MaxResults`.
 */
export const listFirewallDomainLists: {
  (
    input: ListFirewallDomainListsRequest,
  ): Effect.Effect<
    ListFirewallDomainListsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFirewallDomainListsRequest,
  ) => Stream.Stream<
    ListFirewallDomainListsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFirewallDomainListsRequest,
  ) => Stream.Stream<
    FirewallDomainListMetadata,
    | AccessDeniedException
    | InternalServiceErrorException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFirewallDomainListsRequest,
  output: ListFirewallDomainListsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "FirewallDomainLists",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Adds one or more tags to a specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | InternalServiceErrorException
  | InvalidParameterException
  | InvalidRequestException
  | InvalidTagException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServiceErrorException,
    InvalidParameterException,
    InvalidRequestException,
    InvalidTagException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * You can use `UpdateOutpostResolver` to update the instance count, type, or name of a Resolver on an Outpost.
 */
export const updateOutpostResolver: (
  input: UpdateOutpostResolverRequest,
) => Effect.Effect<
  UpdateOutpostResolverResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateOutpostResolverRequest,
  output: UpdateOutpostResolverResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an empty firewall domain list for use in DNS Firewall rules. You can populate the domains for the new list with a file, using ImportFirewallDomains, or with domain strings, using UpdateFirewallDomains.
 */
export const createFirewallDomainList: (
  input: CreateFirewallDomainListRequest,
) => Effect.Effect<
  CreateFirewallDomainListResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | LimitExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFirewallDomainListRequest,
  output: CreateFirewallDomainListResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    LimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Disassociates a FirewallRuleGroup from a VPC, to remove DNS filtering from the VPC.
 */
export const disassociateFirewallRuleGroup: (
  input: DisassociateFirewallRuleGroupRequest,
) => Effect.Effect<
  DisassociateFirewallRuleGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateFirewallRuleGroupRequest,
  output: DisassociateFirewallRuleGroupResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified firewall rule group.
 */
export const deleteFirewallRuleGroup: (
  input: DeleteFirewallRuleGroupRequest,
) => Effect.Effect<
  DeleteFirewallRuleGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFirewallRuleGroupRequest,
  output: DeleteFirewallRuleGroupResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a Resolver on the Outpost.
 */
export const deleteOutpostResolver: (
  input: DeleteOutpostResolverRequest,
) => Effect.Effect<
  DeleteOutpostResolverResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOutpostResolverRequest,
  output: DeleteOutpostResolverResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Imports domain names from a file into a domain list, for use in a DNS firewall rule group.
 *
 * Each domain specification in your domain list must satisfy the following
 * requirements:
 *
 * - It can optionally start with `*` (asterisk).
 *
 * - With the exception of the optional starting asterisk, it must only contain
 * the following characters: `A-Z`, `a-z`,
 * `0-9`, `-` (hyphen).
 *
 * - It must be from 1-255 characters in length.
 */
export const importFirewallDomains: (
  input: ImportFirewallDomainsRequest,
) => Effect.Effect<
  ImportFirewallDomainsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServiceErrorException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportFirewallDomainsRequest,
  output: ImportFirewallDomainsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServiceErrorException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the firewall domain list from an array of domain specifications.
 */
export const updateFirewallDomains: (
  input: UpdateFirewallDomainsRequest,
) => Effect.Effect<
  UpdateFirewallDomainsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServiceErrorException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFirewallDomainsRequest,
  output: UpdateFirewallDomainsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServiceErrorException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the specified firewall rule.
 */
export const updateFirewallRule: (
  input: UpdateFirewallRuleRequest,
) => Effect.Effect<
  UpdateFirewallRuleResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFirewallRuleRequest,
  output: UpdateFirewallRuleResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Changes the association of a FirewallRuleGroup with a VPC. The association enables DNS filtering for the VPC.
 */
export const updateFirewallRuleGroupAssociation: (
  input: UpdateFirewallRuleGroupAssociationRequest,
) => Effect.Effect<
  UpdateFirewallRuleGroupAssociationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFirewallRuleGroupAssociationRequest,
  output: UpdateFirewallRuleGroupAssociationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Associates a FirewallRuleGroup with a VPC, to provide DNS filtering for the VPC.
 */
export const associateFirewallRuleGroup: (
  input: AssociateFirewallRuleGroupRequest,
) => Effect.Effect<
  AssociateFirewallRuleGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServiceErrorException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateFirewallRuleGroupRequest,
  output: AssociateFirewallRuleGroupResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServiceErrorException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified firewall rule.
 */
export const deleteFirewallRule: (
  input: DeleteFirewallRuleRequest,
) => Effect.Effect<
  DeleteFirewallRuleResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFirewallRuleRequest,
  output: DeleteFirewallRuleResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the Identity and Access Management (Amazon Web Services IAM) policy for sharing the
 * specified rule group. You can use the policy to share the rule group using Resource Access Manager (RAM).
 */
export const getFirewallRuleGroupPolicy: (
  input: GetFirewallRuleGroupPolicyRequest,
) => Effect.Effect<
  GetFirewallRuleGroupPolicyResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFirewallRuleGroupPolicyRequest,
  output: GetFirewallRuleGroupPolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a specified Resolver on the Outpost, such as its instance count and
 * type, name, and the current status of the Resolver.
 */
export const getOutpostResolver: (
  input: GetOutpostResolverRequest,
) => Effect.Effect<
  GetOutpostResolverResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOutpostResolverRequest,
  output: GetOutpostResolverResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the domains that you have defined for the specified firewall domain list.
 *
 * A single call might return only a partial list of the domains. For information, see `MaxResults`.
 */
export const listFirewallDomains: {
  (
    input: ListFirewallDomainsRequest,
  ): Effect.Effect<
    ListFirewallDomainsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFirewallDomainsRequest,
  ) => Stream.Stream<
    ListFirewallDomainsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFirewallDomainsRequest,
  ) => Stream.Stream<
    FirewallDomainName,
    | AccessDeniedException
    | InternalServiceErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFirewallDomainsRequest,
  output: ListFirewallDomainsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Domains",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the firewall rules that you have defined for the specified firewall rule group. DNS Firewall uses the rules in a rule group to filter DNS network traffic for a VPC.
 *
 * A single call might return only a partial list of the rules. For information, see `MaxResults`.
 */
export const listFirewallRules: {
  (
    input: ListFirewallRulesRequest,
  ): Effect.Effect<
    ListFirewallRulesResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFirewallRulesRequest,
  ) => Stream.Stream<
    ListFirewallRulesResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFirewallRulesRequest,
  ) => Stream.Stream<
    FirewallRule,
    | AccessDeniedException
    | InternalServiceErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFirewallRulesRequest,
  output: ListFirewallRulesResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "FirewallRules",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all the Resolvers on Outposts that were created using the current Amazon Web Services account.
 */
export const listOutpostResolvers: {
  (
    input: ListOutpostResolversRequest,
  ): Effect.Effect<
    ListOutpostResolversResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOutpostResolversRequest,
  ) => Stream.Stream<
    ListOutpostResolversResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOutpostResolversRequest,
  ) => Stream.Stream<
    OutpostResolver,
    | AccessDeniedException
    | InternalServiceErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOutpostResolversRequest,
  output: ListOutpostResolversResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "OutpostResolvers",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Attaches an Identity and Access Management (Amazon Web Services IAM) policy for sharing the rule
 * group. You can use the policy to share the rule group using Resource Access Manager
 * (RAM).
 */
export const putFirewallRuleGroupPolicy: (
  input: PutFirewallRuleGroupPolicyRequest,
) => Effect.Effect<
  PutFirewallRuleGroupPolicyResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutFirewallRuleGroupPolicyRequest,
  output: PutFirewallRuleGroupPolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration of the firewall behavior provided by DNS Firewall for a single
 * VPC from Amazon Virtual Private Cloud (Amazon VPC).
 */
export const updateFirewallConfig: (
  input: UpdateFirewallConfigRequest,
) => Effect.Effect<
  UpdateFirewallConfigResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFirewallConfigRequest,
  output: UpdateFirewallConfigResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the behavior configuration of Route 53 Resolver behavior for a single VPC from
 * Amazon Virtual Private Cloud.
 */
export const getResolverConfig: (
  input: GetResolverConfigRequest,
) => Effect.Effect<
  GetResolverConfigResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidParameterException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResolverConfigRequest,
  output: GetResolverConfigResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the minimal high-level information for the rule groups that you have defined.
 *
 * A single call might return only a partial list of the rule groups. For information, see `MaxResults`.
 */
export const listFirewallRuleGroups: {
  (
    input: ListFirewallRuleGroupsRequest,
  ): Effect.Effect<
    ListFirewallRuleGroupsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFirewallRuleGroupsRequest,
  ) => Stream.Stream<
    ListFirewallRuleGroupsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFirewallRuleGroupsRequest,
  ) => Stream.Stream<
    FirewallRuleGroupMetadata,
    | AccessDeniedException
    | InternalServiceErrorException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFirewallRuleGroupsRequest,
  output: ListFirewallRuleGroupsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "FirewallRuleGroups",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the firewall configurations that you have defined. DNS Firewall uses the configurations to manage firewall behavior for your VPCs.
 *
 * A single call might return only a partial list of the configurations. For information, see `MaxResults`.
 */
export const listFirewallConfigs: {
  (
    input: ListFirewallConfigsRequest,
  ): Effect.Effect<
    ListFirewallConfigsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFirewallConfigsRequest,
  ) => Stream.Stream<
    ListFirewallConfigsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFirewallConfigsRequest,
  ) => Stream.Stream<
    FirewallConfig,
    | AccessDeniedException
    | InternalServiceErrorException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFirewallConfigsRequest,
  output: ListFirewallConfigsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "FirewallConfigs",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the firewall rule group associations that you have defined. Each association enables DNS filtering for a VPC with one rule group.
 *
 * A single call might return only a partial list of the associations. For information, see `MaxResults`.
 */
export const listFirewallRuleGroupAssociations: {
  (
    input: ListFirewallRuleGroupAssociationsRequest,
  ): Effect.Effect<
    ListFirewallRuleGroupAssociationsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFirewallRuleGroupAssociationsRequest,
  ) => Stream.Stream<
    ListFirewallRuleGroupAssociationsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFirewallRuleGroupAssociationsRequest,
  ) => Stream.Stream<
    FirewallRuleGroupAssociation,
    | AccessDeniedException
    | InternalServiceErrorException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFirewallRuleGroupAssociationsRequest,
  output: ListFirewallRuleGroupAssociationsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "FirewallRuleGroupAssociations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the configuration of the firewall behavior provided by DNS Firewall for a
 * single VPC from Amazon Virtual Private Cloud (Amazon VPC).
 */
export const getFirewallConfig: (
  input: GetFirewallConfigRequest,
) => Effect.Effect<
  GetFirewallConfigResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFirewallConfigRequest,
  output: GetFirewallConfigResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the Resolver configurations that you have defined.
 * Route 53 Resolver uses the configurations to manage DNS resolution behavior for your VPCs.
 */
export const listResolverConfigs: {
  (
    input: ListResolverConfigsRequest,
  ): Effect.Effect<
    ListResolverConfigsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResolverConfigsRequest,
  ) => Stream.Stream<
    ListResolverConfigsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResolverConfigsRequest,
  ) => Stream.Stream<
    ResolverConfig,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResolverConfigsRequest,
  output: ListResolverConfigsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidNextTokenException,
    InvalidParameterException,
    InvalidRequestException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ResolverConfigs",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates a single DNS Firewall rule in the specified rule group, using the specified domain list.
 */
export const createFirewallRule: (
  input: CreateFirewallRuleRequest,
) => Effect.Effect<
  CreateFirewallRuleResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFirewallRuleRequest,
  output: CreateFirewallRuleResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an empty DNS Firewall rule group for filtering DNS network traffic in a VPC. You can add rules to the new rule group
 * by calling CreateFirewallRule.
 */
export const createFirewallRuleGroup: (
  input: CreateFirewallRuleGroupRequest,
) => Effect.Effect<
  CreateFirewallRuleGroupResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | LimitExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFirewallRuleGroupRequest,
  output: CreateFirewallRuleGroupResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    LimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates settings for a specified Resolver rule. `ResolverRuleId` is required, and all other parameters are optional.
 * If you don't specify a parameter, it retains its current value.
 */
export const updateResolverRule: (
  input: UpdateResolverRuleRequest,
) => Effect.Effect<
  UpdateResolverRuleResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidParameterException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ResourceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResolverRuleRequest,
  output: UpdateResolverRuleResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Associates an Amazon VPC with a specified query logging configuration. Route 53 Resolver logs DNS queries that originate in all of the Amazon VPCs
 * that are associated with a specified query logging configuration. To associate more than one VPC with a configuration, submit one `AssociateResolverQueryLogConfig`
 * request for each VPC.
 *
 * The VPCs that you associate with a query logging configuration must be in the same Region as the configuration.
 *
 * To remove a VPC from a query logging configuration, see
 * DisassociateResolverQueryLogConfig.
 */
export const associateResolverQueryLogConfig: (
  input: AssociateResolverQueryLogConfigRequest,
) => Effect.Effect<
  AssociateResolverQueryLogConfigResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidParameterException
  | InvalidRequestException
  | LimitExceededException
  | ResourceExistsException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateResolverQueryLogConfigRequest,
  output: AssociateResolverQueryLogConfigResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a Route 53 Resolver on an Outpost.
 */
export const createOutpostResolver: (
  input: CreateOutpostResolverRequest,
) => Effect.Effect<
  CreateOutpostResolverResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOutpostResolverRequest,
  output: CreateOutpostResolverResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the behavior configuration of Route 53 Resolver behavior for a single VPC from
 * Amazon Virtual Private Cloud.
 */
export const updateResolverConfig: (
  input: UpdateResolverConfigRequest,
) => Effect.Effect<
  UpdateResolverConfigResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidParameterException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ResourceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResolverConfigRequest,
  output: UpdateResolverConfigResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a Resolver endpoint. There are two types of Resolver endpoints, inbound and outbound:
 *
 * - An *inbound Resolver endpoint* forwards DNS queries to the DNS service for a VPC
 * from your network.
 *
 * - An *outbound Resolver endpoint* forwards DNS queries from the DNS service for a VPC
 * to your network.
 */
export const createResolverEndpoint: (
  input: CreateResolverEndpointRequest,
) => Effect.Effect<
  CreateResolverEndpointResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidParameterException
  | InvalidRequestException
  | LimitExceededException
  | ResourceExistsException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateResolverEndpointRequest,
  output: CreateResolverEndpointResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a Resolver query logging configuration, which defines where you want Resolver to save DNS query logs that originate in your VPCs.
 * Resolver can log queries only for VPCs that are in the same Region as the query logging configuration.
 *
 * To specify which VPCs you want to log queries for, you use `AssociateResolverQueryLogConfig`. For more information, see
 * AssociateResolverQueryLogConfig.
 *
 * You can optionally use Resource Access Manager (RAM) to share a query logging configuration with other Amazon Web Services accounts. The other accounts
 * can then associate VPCs with the configuration. The query logs that Resolver creates for a configuration include all DNS queries that originate in all
 * VPCs that are associated with the configuration.
 */
export const createResolverQueryLogConfig: (
  input: CreateResolverQueryLogConfigRequest,
) => Effect.Effect<
  CreateResolverQueryLogConfigResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidParameterException
  | InvalidRequestException
  | LimitExceededException
  | ResourceExistsException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateResolverQueryLogConfigRequest,
  output: CreateResolverQueryLogConfigResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * For DNS queries that originate in your VPCs, specifies which Resolver endpoint the queries pass through,
 * one domain name that you want to forward to your network, and the IP addresses of the DNS resolvers in your network.
 */
export const createResolverRule: (
  input: CreateResolverRuleRequest,
) => Effect.Effect<
  CreateResolverRuleResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidParameterException
  | InvalidRequestException
  | LimitExceededException
  | ResourceExistsException
  | ResourceNotFoundException
  | ResourceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateResolverRuleRequest,
  output: CreateResolverRuleResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
    ResourceExistsException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Removes IP addresses from an inbound or an outbound Resolver endpoint. If you want to remove more than one IP address,
 * submit one `DisassociateResolverEndpointIpAddress` request for each IP address.
 *
 * To add an IP address to an endpoint, see
 * AssociateResolverEndpointIpAddress.
 */
export const disassociateResolverEndpointIpAddress: (
  input: DisassociateResolverEndpointIpAddressRequest,
) => Effect.Effect<
  DisassociateResolverEndpointIpAddressResponse,
  | InternalServiceErrorException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceExistsException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateResolverEndpointIpAddressRequest,
  output: DisassociateResolverEndpointIpAddressResponse,
  errors: [
    InternalServiceErrorException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Adds IP addresses to an inbound or an outbound Resolver endpoint. If you want to add more than one IP address,
 * submit one `AssociateResolverEndpointIpAddress` request for each IP address.
 *
 * To remove an IP address from an endpoint, see
 * DisassociateResolverEndpointIpAddress.
 */
export const associateResolverEndpointIpAddress: (
  input: AssociateResolverEndpointIpAddressRequest,
) => Effect.Effect<
  AssociateResolverEndpointIpAddressResponse,
  | InternalServiceErrorException
  | InvalidParameterException
  | InvalidRequestException
  | LimitExceededException
  | ResourceExistsException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateResolverEndpointIpAddressRequest,
  output: AssociateResolverEndpointIpAddressResponse,
  errors: [
    InternalServiceErrorException,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Associates a Resolver rule with a VPC. When you associate a rule with a VPC, Resolver forwards all DNS queries
 * for the domain name that is specified in the rule and that originate in the VPC. The queries are forwarded to the
 * IP addresses for the DNS resolvers that are specified in the rule. For more information about rules, see
 * CreateResolverRule.
 */
export const associateResolverRule: (
  input: AssociateResolverRuleRequest,
) => Effect.Effect<
  AssociateResolverRuleResponse,
  | InternalServiceErrorException
  | InvalidParameterException
  | InvalidRequestException
  | LimitExceededException
  | ResourceExistsException
  | ResourceNotFoundException
  | ResourceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateResolverRuleRequest,
  output: AssociateResolverRuleResponse,
  errors: [
    InternalServiceErrorException,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
    ResourceExistsException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
  ],
}));
