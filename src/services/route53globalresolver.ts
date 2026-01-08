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
import type { Region as Rgn } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "Route53GlobalResolver",
  serviceShapeName: "EC2DNSGlobalResolverCustomerAPI",
});
const auth = T.AwsAuthSigv4({ name: "route53globalresolver" });
const ver = T.ServiceVersion("2022-09-27");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { UseFIPS = false, Endpoint, Region } = p;
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
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true) {
          return e(
            `https://route53globalresolver-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        return e(
          `https://route53globalresolver.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type HostedZoneId = string;
export type ResourceArn = string;
export type TagKey = string;
export type Cidr = string;
export type ClientToken = string;
export type ResourceNameShort = string;
export type ResourceId = string;
export type ResourceName = string;
export type ResourceDescription = string;
export type Domain = string;
export type BlockOverrideTtl = number;
export type FirewallRulePriority = number;
export type DnsQueryType = string;
export type Region = string;
export type TagValue = string;
export type HostedZoneName = string;
export type AccessTokenValue = string | Redacted.Redacted<string>;
export type Sni = string;
export type IPv4Address = string;

//# Schemas
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export type Domains = string[];
export const Domains = S.Array(S.String);
export type Regions = string[];
export const Regions = S.Array(S.String);
export interface DisassociateHostedZoneInput {
  hostedZoneId: string;
  resourceArn: string;
}
export const DisassociateHostedZoneInput = S.suspend(() =>
  S.Struct({
    hostedZoneId: S.String.pipe(T.HttpLabel("hostedZoneId")),
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/hosted-zone-associations/hosted-zone/{hostedZoneId}/resource-arn/{resourceArn+}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateHostedZoneInput",
}) as any as S.Schema<DisassociateHostedZoneInput>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/get-all-tags" }),
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
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: TagKeys;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tagKeys: TagKeys }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/untag-resource" }),
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
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface CreateAccessSourceInput {
  cidr: string;
  clientToken?: string;
  ipAddressType?: string;
  name?: string;
  dnsViewId: string;
  protocol: string;
  tags?: Tags;
}
export const CreateAccessSourceInput = S.suspend(() =>
  S.Struct({
    cidr: S.String,
    clientToken: S.optional(S.String),
    ipAddressType: S.optional(S.String),
    name: S.optional(S.String),
    dnsViewId: S.String,
    protocol: S.String,
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/access-sources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAccessSourceInput",
}) as any as S.Schema<CreateAccessSourceInput>;
export interface GetAccessSourceInput {
  accessSourceId: string;
}
export const GetAccessSourceInput = S.suspend(() =>
  S.Struct({
    accessSourceId: S.String.pipe(T.HttpLabel("accessSourceId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/access-sources/{accessSourceId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAccessSourceInput",
}) as any as S.Schema<GetAccessSourceInput>;
export interface UpdateAccessSourceInput {
  accessSourceId: string;
  cidr?: string;
  ipAddressType?: string;
  name?: string;
  protocol?: string;
}
export const UpdateAccessSourceInput = S.suspend(() =>
  S.Struct({
    accessSourceId: S.String.pipe(T.HttpLabel("accessSourceId")),
    cidr: S.optional(S.String),
    ipAddressType: S.optional(S.String),
    name: S.optional(S.String),
    protocol: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/access-sources/{accessSourceId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAccessSourceInput",
}) as any as S.Schema<UpdateAccessSourceInput>;
export interface DeleteAccessSourceInput {
  accessSourceId: string;
}
export const DeleteAccessSourceInput = S.suspend(() =>
  S.Struct({
    accessSourceId: S.String.pipe(T.HttpLabel("accessSourceId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/access-sources/{accessSourceId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAccessSourceInput",
}) as any as S.Schema<DeleteAccessSourceInput>;
export interface CreateAccessTokenInput {
  clientToken?: string;
  dnsViewId: string;
  expiresAt?: Date;
  name?: string;
  tags?: Tags;
}
export const CreateAccessTokenInput = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String),
    dnsViewId: S.String.pipe(T.HttpLabel("dnsViewId")),
    expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    name: S.optional(S.String),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tokens/{dnsViewId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAccessTokenInput",
}) as any as S.Schema<CreateAccessTokenInput>;
export interface GetAccessTokenInput {
  accessTokenId: string;
}
export const GetAccessTokenInput = S.suspend(() =>
  S.Struct({ accessTokenId: S.String.pipe(T.HttpLabel("accessTokenId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tokens/{accessTokenId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAccessTokenInput",
}) as any as S.Schema<GetAccessTokenInput>;
export interface UpdateAccessTokenInput {
  accessTokenId: string;
  name: string;
}
export const UpdateAccessTokenInput = S.suspend(() =>
  S.Struct({
    accessTokenId: S.String.pipe(T.HttpLabel("accessTokenId")),
    name: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/tokens/{accessTokenId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAccessTokenInput",
}) as any as S.Schema<UpdateAccessTokenInput>;
export interface DeleteAccessTokenInput {
  accessTokenId: string;
}
export const DeleteAccessTokenInput = S.suspend(() =>
  S.Struct({ accessTokenId: S.String.pipe(T.HttpLabel("accessTokenId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tokens/{accessTokenId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAccessTokenInput",
}) as any as S.Schema<DeleteAccessTokenInput>;
export type Strings = string[];
export const Strings = S.Array(S.String);
export type Filters = { [key: string]: Strings };
export const Filters = S.Record({ key: S.String, value: Strings });
export interface ListAccessTokensInput {
  maxResults?: number;
  nextToken?: string;
  dnsViewId: string;
  filters?: Filters;
}
export const ListAccessTokensInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
    dnsViewId: S.String.pipe(T.HttpLabel("dnsViewId")),
    filters: S.optional(Filters).pipe(T.HttpQueryParams()),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tokens/dns-view/{dnsViewId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAccessTokensInput",
}) as any as S.Schema<ListAccessTokensInput>;
export interface CreateDNSViewInput {
  globalResolverId: string;
  clientToken?: string;
  name: string;
  dnssecValidation?: string;
  ednsClientSubnet?: string;
  firewallRulesFailOpen?: string;
  description?: string;
  tags?: Tags;
}
export const CreateDNSViewInput = S.suspend(() =>
  S.Struct({
    globalResolverId: S.String.pipe(T.HttpLabel("globalResolverId")),
    clientToken: S.optional(S.String),
    name: S.String,
    dnssecValidation: S.optional(S.String),
    ednsClientSubnet: S.optional(S.String),
    firewallRulesFailOpen: S.optional(S.String),
    description: S.optional(S.String),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/dns-views/{globalResolverId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDNSViewInput",
}) as any as S.Schema<CreateDNSViewInput>;
export interface GetDNSViewInput {
  dnsViewId: string;
}
export const GetDNSViewInput = S.suspend(() =>
  S.Struct({ dnsViewId: S.String.pipe(T.HttpLabel("dnsViewId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/dns-views/{dnsViewId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDNSViewInput",
}) as any as S.Schema<GetDNSViewInput>;
export interface UpdateDNSViewInput {
  dnsViewId: string;
  name?: string;
  description?: string;
  dnssecValidation?: string;
  ednsClientSubnet?: string;
  firewallRulesFailOpen?: string;
}
export const UpdateDNSViewInput = S.suspend(() =>
  S.Struct({
    dnsViewId: S.String.pipe(T.HttpLabel("dnsViewId")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    dnssecValidation: S.optional(S.String),
    ednsClientSubnet: S.optional(S.String),
    firewallRulesFailOpen: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/dns-views/{dnsViewId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDNSViewInput",
}) as any as S.Schema<UpdateDNSViewInput>;
export interface DeleteDNSViewInput {
  dnsViewId: string;
}
export const DeleteDNSViewInput = S.suspend(() =>
  S.Struct({ dnsViewId: S.String.pipe(T.HttpLabel("dnsViewId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/dns-views/{dnsViewId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDNSViewInput",
}) as any as S.Schema<DeleteDNSViewInput>;
export interface ListDNSViewsInput {
  maxResults?: number;
  nextToken?: string;
  globalResolverId: string;
}
export const ListDNSViewsInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
    globalResolverId: S.String.pipe(T.HttpLabel("globalResolverId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/dns-views/resolver/{globalResolverId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDNSViewsInput",
}) as any as S.Schema<ListDNSViewsInput>;
export interface DisableDNSViewInput {
  dnsViewId: string;
}
export const DisableDNSViewInput = S.suspend(() =>
  S.Struct({ dnsViewId: S.String.pipe(T.HttpLabel("dnsViewId")) }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/dns-views/{dnsViewId}/disable" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisableDNSViewInput",
}) as any as S.Schema<DisableDNSViewInput>;
export interface EnableDNSViewInput {
  dnsViewId: string;
}
export const EnableDNSViewInput = S.suspend(() =>
  S.Struct({ dnsViewId: S.String.pipe(T.HttpLabel("dnsViewId")) }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/dns-views/{dnsViewId}/enable" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EnableDNSViewInput",
}) as any as S.Schema<EnableDNSViewInput>;
export interface CreateFirewallDomainListInput {
  clientToken?: string;
  globalResolverId: string;
  description?: string;
  name: string;
  tags?: Tags;
}
export const CreateFirewallDomainListInput = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String),
    globalResolverId: S.String.pipe(T.HttpLabel("globalResolverId")),
    description: S.optional(S.String),
    name: S.String,
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/firewall-domain-lists/{globalResolverId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFirewallDomainListInput",
}) as any as S.Schema<CreateFirewallDomainListInput>;
export interface GetFirewallDomainListInput {
  firewallDomainListId: string;
}
export const GetFirewallDomainListInput = S.suspend(() =>
  S.Struct({
    firewallDomainListId: S.String.pipe(T.HttpLabel("firewallDomainListId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/firewall-domain-lists/{firewallDomainListId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFirewallDomainListInput",
}) as any as S.Schema<GetFirewallDomainListInput>;
export interface DeleteFirewallDomainListInput {
  firewallDomainListId: string;
}
export const DeleteFirewallDomainListInput = S.suspend(() =>
  S.Struct({
    firewallDomainListId: S.String.pipe(T.HttpLabel("firewallDomainListId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/firewall-domain-lists/{firewallDomainListId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFirewallDomainListInput",
}) as any as S.Schema<DeleteFirewallDomainListInput>;
export interface ListFirewallDomainListsInput {
  maxResults?: number;
  nextToken?: string;
  globalResolverId?: string;
}
export const ListFirewallDomainListsInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
    globalResolverId: S.optional(S.String).pipe(
      T.HttpQuery("global_resolver_id"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/firewall-domain-lists" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFirewallDomainListsInput",
}) as any as S.Schema<ListFirewallDomainListsInput>;
export interface ImportFirewallDomainsInput {
  domainFileUrl: string;
  firewallDomainListId: string;
  operation: string;
}
export const ImportFirewallDomainsInput = S.suspend(() =>
  S.Struct({
    domainFileUrl: S.String,
    firewallDomainListId: S.String.pipe(T.HttpLabel("firewallDomainListId")),
    operation: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/firewall-domain-lists/{firewallDomainListId}/domains/s3_file_url",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ImportFirewallDomainsInput",
}) as any as S.Schema<ImportFirewallDomainsInput>;
export interface ListFirewallDomainsInput {
  maxResults?: number;
  nextToken?: string;
  firewallDomainListId: string;
}
export const ListFirewallDomainsInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
    firewallDomainListId: S.String.pipe(T.HttpLabel("firewallDomainListId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/firewall-domain-lists/{firewallDomainListId}/domains",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFirewallDomainsInput",
}) as any as S.Schema<ListFirewallDomainsInput>;
export interface UpdateFirewallDomainsInput {
  domains: Domains;
  firewallDomainListId: string;
  operation: string;
}
export const UpdateFirewallDomainsInput = S.suspend(() =>
  S.Struct({
    domains: Domains,
    firewallDomainListId: S.String.pipe(T.HttpLabel("firewallDomainListId")),
    operation: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/firewall-domain-lists/{firewallDomainListId}/domains",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFirewallDomainsInput",
}) as any as S.Schema<UpdateFirewallDomainsInput>;
export interface CreateFirewallRuleInput {
  action: string;
  blockOverrideDnsType?: string;
  blockOverrideDomain?: string;
  blockOverrideTtl?: number;
  blockResponse?: string;
  clientToken?: string;
  confidenceThreshold?: string;
  description?: string;
  dnsAdvancedProtection?: string;
  firewallDomainListId?: string;
  name: string;
  priority?: number;
  dnsViewId: string;
  qType?: string;
}
export const CreateFirewallRuleInput = S.suspend(() =>
  S.Struct({
    action: S.String,
    blockOverrideDnsType: S.optional(S.String),
    blockOverrideDomain: S.optional(S.String),
    blockOverrideTtl: S.optional(S.Number),
    blockResponse: S.optional(S.String),
    clientToken: S.optional(S.String),
    confidenceThreshold: S.optional(S.String),
    description: S.optional(S.String),
    dnsAdvancedProtection: S.optional(S.String),
    firewallDomainListId: S.optional(S.String),
    name: S.String,
    priority: S.optional(S.Number),
    dnsViewId: S.String,
    qType: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/firewall-rules" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFirewallRuleInput",
}) as any as S.Schema<CreateFirewallRuleInput>;
export interface GetFirewallRuleInput {
  firewallRuleId: string;
}
export const GetFirewallRuleInput = S.suspend(() =>
  S.Struct({
    firewallRuleId: S.String.pipe(T.HttpLabel("firewallRuleId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/firewall-rules/{firewallRuleId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFirewallRuleInput",
}) as any as S.Schema<GetFirewallRuleInput>;
export interface UpdateFirewallRuleInput {
  action?: string;
  blockOverrideDnsType?: string;
  blockOverrideDomain?: string;
  blockOverrideTtl?: number;
  blockResponse?: string;
  clientToken: string;
  confidenceThreshold?: string;
  description?: string;
  dnsAdvancedProtection?: string;
  firewallRuleId: string;
  name?: string;
  priority?: number;
}
export const UpdateFirewallRuleInput = S.suspend(() =>
  S.Struct({
    action: S.optional(S.String),
    blockOverrideDnsType: S.optional(S.String),
    blockOverrideDomain: S.optional(S.String),
    blockOverrideTtl: S.optional(S.Number),
    blockResponse: S.optional(S.String),
    clientToken: S.String,
    confidenceThreshold: S.optional(S.String),
    description: S.optional(S.String),
    dnsAdvancedProtection: S.optional(S.String),
    firewallRuleId: S.String.pipe(T.HttpLabel("firewallRuleId")),
    name: S.optional(S.String),
    priority: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/firewall-rules/{firewallRuleId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFirewallRuleInput",
}) as any as S.Schema<UpdateFirewallRuleInput>;
export interface DeleteFirewallRuleInput {
  firewallRuleId: string;
}
export const DeleteFirewallRuleInput = S.suspend(() =>
  S.Struct({
    firewallRuleId: S.String.pipe(T.HttpLabel("firewallRuleId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/firewall-rules/{firewallRuleId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFirewallRuleInput",
}) as any as S.Schema<DeleteFirewallRuleInput>;
export interface ListFirewallRulesInput {
  maxResults?: number;
  nextToken?: string;
  dnsViewId: string;
  filters?: Filters;
}
export const ListFirewallRulesInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
    dnsViewId: S.String.pipe(T.HttpQuery("dnsview_id")),
    filters: S.optional(Filters).pipe(T.HttpQueryParams()),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/firewall-rules" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFirewallRulesInput",
}) as any as S.Schema<ListFirewallRulesInput>;
export interface CreateGlobalResolverInput {
  clientToken?: string;
  description?: string;
  name: string;
  observabilityRegion?: string;
  regions: Regions;
  tags?: Tags;
}
export const CreateGlobalResolverInput = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String),
    description: S.optional(S.String),
    name: S.String,
    observabilityRegion: S.optional(S.String),
    regions: Regions,
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/global-resolver" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateGlobalResolverInput",
}) as any as S.Schema<CreateGlobalResolverInput>;
export interface GetGlobalResolverInput {
  globalResolverId: string;
}
export const GetGlobalResolverInput = S.suspend(() =>
  S.Struct({
    globalResolverId: S.String.pipe(T.HttpLabel("globalResolverId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/global-resolver/{globalResolverId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetGlobalResolverInput",
}) as any as S.Schema<GetGlobalResolverInput>;
export interface UpdateGlobalResolverInput {
  globalResolverId: string;
  name?: string;
  observabilityRegion?: string;
  description?: string;
}
export const UpdateGlobalResolverInput = S.suspend(() =>
  S.Struct({
    globalResolverId: S.String.pipe(T.HttpLabel("globalResolverId")),
    name: S.optional(S.String),
    observabilityRegion: S.optional(S.String),
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/global-resolver/{globalResolverId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateGlobalResolverInput",
}) as any as S.Schema<UpdateGlobalResolverInput>;
export interface DeleteGlobalResolverInput {
  globalResolverId: string;
}
export const DeleteGlobalResolverInput = S.suspend(() =>
  S.Struct({
    globalResolverId: S.String.pipe(T.HttpLabel("globalResolverId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/global-resolver/{globalResolverId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteGlobalResolverInput",
}) as any as S.Schema<DeleteGlobalResolverInput>;
export interface ListGlobalResolversInput {
  maxResults?: number;
  nextToken?: string;
}
export const ListGlobalResolversInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/global-resolver" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListGlobalResolversInput",
}) as any as S.Schema<ListGlobalResolversInput>;
export interface AssociateHostedZoneInput {
  hostedZoneId: string;
  resourceArn: string;
  name: string;
}
export const AssociateHostedZoneInput = S.suspend(() =>
  S.Struct({
    hostedZoneId: S.String.pipe(T.HttpLabel("hostedZoneId")),
    resourceArn: S.String,
    name: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/hosted-zone-associations/{hostedZoneId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateHostedZoneInput",
}) as any as S.Schema<AssociateHostedZoneInput>;
export interface GetHostedZoneAssociationInput {
  hostedZoneAssociationId: string;
}
export const GetHostedZoneAssociationInput = S.suspend(() =>
  S.Struct({
    hostedZoneAssociationId: S.String.pipe(
      T.HttpLabel("hostedZoneAssociationId"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/hosted-zone-associations/{hostedZoneAssociationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetHostedZoneAssociationInput",
}) as any as S.Schema<GetHostedZoneAssociationInput>;
export interface UpdateHostedZoneAssociationInput {
  hostedZoneAssociationId: string;
  name?: string;
}
export const UpdateHostedZoneAssociationInput = S.suspend(() =>
  S.Struct({
    hostedZoneAssociationId: S.String.pipe(
      T.HttpLabel("hostedZoneAssociationId"),
    ),
    name: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/hosted-zone-associations/{hostedZoneAssociationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateHostedZoneAssociationInput",
}) as any as S.Schema<UpdateHostedZoneAssociationInput>;
export interface ListHostedZoneAssociationsInput {
  maxResults?: number;
  nextToken?: string;
  resourceArn: string;
}
export const ListHostedZoneAssociationsInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/hosted-zone-associations/resource-arn/{resourceArn+}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListHostedZoneAssociationsInput",
}) as any as S.Schema<ListHostedZoneAssociationsInput>;
export interface GetManagedFirewallDomainListInput {
  managedFirewallDomainListId: string;
}
export const GetManagedFirewallDomainListInput = S.suspend(() =>
  S.Struct({
    managedFirewallDomainListId: S.String.pipe(
      T.HttpLabel("managedFirewallDomainListId"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/managed-firewall-domain-lists/{managedFirewallDomainListId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetManagedFirewallDomainListInput",
}) as any as S.Schema<GetManagedFirewallDomainListInput>;
export interface ListManagedFirewallDomainListsInput {
  maxResults?: number;
  nextToken?: string;
  managedFirewallDomainListType: string;
}
export const ListManagedFirewallDomainListsInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
    managedFirewallDomainListType: S.String.pipe(
      T.HttpLabel("managedFirewallDomainListType"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/list-managed-firewall-domain-lists/{managedFirewallDomainListType}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListManagedFirewallDomainListsInput",
}) as any as S.Schema<ListManagedFirewallDomainListsInput>;
export interface BatchCreateFirewallRuleInputItem {
  action: string;
  blockOverrideDnsType?: string;
  blockOverrideDomain?: string;
  blockOverrideTtl?: number;
  blockResponse?: string;
  clientToken: string;
  confidenceThreshold?: string;
  description?: string;
  dnsAdvancedProtection?: string;
  firewallDomainListId?: string;
  name: string;
  priority?: number;
  dnsViewId: string;
  qType?: string;
}
export const BatchCreateFirewallRuleInputItem = S.suspend(() =>
  S.Struct({
    action: S.String,
    blockOverrideDnsType: S.optional(S.String),
    blockOverrideDomain: S.optional(S.String),
    blockOverrideTtl: S.optional(S.Number),
    blockResponse: S.optional(S.String),
    clientToken: S.String,
    confidenceThreshold: S.optional(S.String),
    description: S.optional(S.String),
    dnsAdvancedProtection: S.optional(S.String),
    firewallDomainListId: S.optional(S.String),
    name: S.String,
    priority: S.optional(S.Number),
    dnsViewId: S.String,
    qType: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchCreateFirewallRuleInputItem",
}) as any as S.Schema<BatchCreateFirewallRuleInputItem>;
export type BatchCreateFirewallRuleInputItems =
  BatchCreateFirewallRuleInputItem[];
export const BatchCreateFirewallRuleInputItems = S.Array(
  BatchCreateFirewallRuleInputItem,
);
export interface BatchDeleteFirewallRuleInputItem {
  firewallRuleId: string;
}
export const BatchDeleteFirewallRuleInputItem = S.suspend(() =>
  S.Struct({ firewallRuleId: S.String }),
).annotations({
  identifier: "BatchDeleteFirewallRuleInputItem",
}) as any as S.Schema<BatchDeleteFirewallRuleInputItem>;
export type BatchDeleteFirewallRuleInputItems =
  BatchDeleteFirewallRuleInputItem[];
export const BatchDeleteFirewallRuleInputItems = S.Array(
  BatchDeleteFirewallRuleInputItem,
);
export interface BatchUpdateFirewallRuleInputItem {
  action?: string;
  blockOverrideDnsType?: string;
  blockOverrideDomain?: string;
  blockOverrideTtl?: number;
  blockResponse?: string;
  confidenceThreshold?: string;
  description?: string;
  dnsAdvancedProtection?: string;
  firewallRuleId: string;
  name?: string;
  priority?: number;
}
export const BatchUpdateFirewallRuleInputItem = S.suspend(() =>
  S.Struct({
    action: S.optional(S.String),
    blockOverrideDnsType: S.optional(S.String),
    blockOverrideDomain: S.optional(S.String),
    blockOverrideTtl: S.optional(S.Number),
    blockResponse: S.optional(S.String),
    confidenceThreshold: S.optional(S.String),
    description: S.optional(S.String),
    dnsAdvancedProtection: S.optional(S.String),
    firewallRuleId: S.String,
    name: S.optional(S.String),
    priority: S.optional(S.Number),
  }),
).annotations({
  identifier: "BatchUpdateFirewallRuleInputItem",
}) as any as S.Schema<BatchUpdateFirewallRuleInputItem>;
export type BatchUpdateFirewallRuleInputItems =
  BatchUpdateFirewallRuleInputItem[];
export const BatchUpdateFirewallRuleInputItems = S.Array(
  BatchUpdateFirewallRuleInputItem,
);
export type IPv4Addresses = string[];
export const IPv4Addresses = S.Array(S.String);
export interface DisassociateHostedZoneOutput {
  id: string;
  resourceArn: string;
  hostedZoneId: string;
  hostedZoneName: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}
export const DisassociateHostedZoneOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    resourceArn: S.String,
    hostedZoneId: S.String,
    hostedZoneName: S.String,
    name: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
  }),
).annotations({
  identifier: "DisassociateHostedZoneOutput",
}) as any as S.Schema<DisassociateHostedZoneOutput>;
export interface ListTagsForResourceResponse {
  tags?: Tags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tags: Tags }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tag-resource" }),
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
export interface CreateAccessSourceOutput {
  arn: string;
  cidr: string;
  createdAt: Date;
  id: string;
  ipAddressType: string;
  name?: string;
  dnsViewId: string;
  protocol: string;
  status: string;
  updatedAt: Date;
}
export const CreateAccessSourceOutput = S.suspend(() =>
  S.Struct({
    arn: S.String,
    cidr: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    id: S.String,
    ipAddressType: S.String,
    name: S.optional(S.String),
    dnsViewId: S.String,
    protocol: S.String,
    status: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CreateAccessSourceOutput",
}) as any as S.Schema<CreateAccessSourceOutput>;
export interface GetAccessSourceOutput {
  arn: string;
  cidr: string;
  createdAt: Date;
  id: string;
  ipAddressType: string;
  name?: string;
  dnsViewId: string;
  protocol: string;
  status: string;
  updatedAt: Date;
}
export const GetAccessSourceOutput = S.suspend(() =>
  S.Struct({
    arn: S.String,
    cidr: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    id: S.String,
    ipAddressType: S.String,
    name: S.optional(S.String),
    dnsViewId: S.String,
    protocol: S.String,
    status: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "GetAccessSourceOutput",
}) as any as S.Schema<GetAccessSourceOutput>;
export interface UpdateAccessSourceOutput {
  arn: string;
  cidr: string;
  createdAt: Date;
  id: string;
  ipAddressType: string;
  name?: string;
  dnsViewId: string;
  protocol: string;
  status: string;
  updatedAt: Date;
}
export const UpdateAccessSourceOutput = S.suspend(() =>
  S.Struct({
    arn: S.String,
    cidr: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    id: S.String,
    ipAddressType: S.String,
    name: S.optional(S.String),
    dnsViewId: S.String,
    protocol: S.String,
    status: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "UpdateAccessSourceOutput",
}) as any as S.Schema<UpdateAccessSourceOutput>;
export interface DeleteAccessSourceOutput {
  arn: string;
  cidr: string;
  createdAt: Date;
  id: string;
  ipAddressType: string;
  name?: string;
  dnsViewId: string;
  protocol: string;
  status: string;
  updatedAt: Date;
}
export const DeleteAccessSourceOutput = S.suspend(() =>
  S.Struct({
    arn: S.String,
    cidr: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    id: S.String,
    ipAddressType: S.String,
    name: S.optional(S.String),
    dnsViewId: S.String,
    protocol: S.String,
    status: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "DeleteAccessSourceOutput",
}) as any as S.Schema<DeleteAccessSourceOutput>;
export interface ListAccessSourcesInput {
  maxResults?: number;
  nextToken?: string;
  filters?: Filters;
}
export const ListAccessSourcesInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
    filters: S.optional(Filters).pipe(T.HttpQueryParams()),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/access-sources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAccessSourcesInput",
}) as any as S.Schema<ListAccessSourcesInput>;
export interface CreateAccessTokenOutput {
  id: string;
  arn: string;
  clientToken?: string;
  createdAt: Date;
  dnsViewId: string;
  expiresAt: Date;
  name?: string;
  status: string;
  value: string | Redacted.Redacted<string>;
}
export const CreateAccessTokenOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    clientToken: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    dnsViewId: S.String,
    expiresAt: S.Date.pipe(T.TimestampFormat("date-time")),
    name: S.optional(S.String),
    status: S.String,
    value: SensitiveString,
  }),
).annotations({
  identifier: "CreateAccessTokenOutput",
}) as any as S.Schema<CreateAccessTokenOutput>;
export interface GetAccessTokenOutput {
  id: string;
  arn: string;
  clientToken?: string;
  createdAt: Date;
  dnsViewId: string;
  expiresAt: Date;
  globalResolverId: string;
  name?: string;
  status: string;
  updatedAt: Date;
  value: string | Redacted.Redacted<string>;
}
export const GetAccessTokenOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    clientToken: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    dnsViewId: S.String,
    expiresAt: S.Date.pipe(T.TimestampFormat("date-time")),
    globalResolverId: S.String,
    name: S.optional(S.String),
    status: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    value: SensitiveString,
  }),
).annotations({
  identifier: "GetAccessTokenOutput",
}) as any as S.Schema<GetAccessTokenOutput>;
export interface UpdateAccessTokenOutput {
  id: string;
  name: string;
}
export const UpdateAccessTokenOutput = S.suspend(() =>
  S.Struct({ id: S.String, name: S.String }),
).annotations({
  identifier: "UpdateAccessTokenOutput",
}) as any as S.Schema<UpdateAccessTokenOutput>;
export interface DeleteAccessTokenOutput {
  id: string;
  status: string;
  deletedAt: Date;
}
export const DeleteAccessTokenOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    status: S.String,
    deletedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "DeleteAccessTokenOutput",
}) as any as S.Schema<DeleteAccessTokenOutput>;
export interface CreateDNSViewOutput {
  id: string;
  arn: string;
  clientToken?: string;
  dnssecValidation: string;
  ednsClientSubnet: string;
  firewallRulesFailOpen: string;
  name: string;
  description?: string;
  globalResolverId: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}
export const CreateDNSViewOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    clientToken: S.optional(S.String),
    dnssecValidation: S.String,
    ednsClientSubnet: S.String,
    firewallRulesFailOpen: S.String,
    name: S.String,
    description: S.optional(S.String),
    globalResolverId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
  }),
).annotations({
  identifier: "CreateDNSViewOutput",
}) as any as S.Schema<CreateDNSViewOutput>;
export interface GetDNSViewOutput {
  id: string;
  arn: string;
  clientToken?: string;
  dnssecValidation: string;
  ednsClientSubnet: string;
  firewallRulesFailOpen: string;
  name: string;
  description?: string;
  globalResolverId: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}
export const GetDNSViewOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    clientToken: S.optional(S.String),
    dnssecValidation: S.String,
    ednsClientSubnet: S.String,
    firewallRulesFailOpen: S.String,
    name: S.String,
    description: S.optional(S.String),
    globalResolverId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
  }),
).annotations({
  identifier: "GetDNSViewOutput",
}) as any as S.Schema<GetDNSViewOutput>;
export interface UpdateDNSViewOutput {
  id: string;
  arn: string;
  clientToken?: string;
  dnssecValidation: string;
  ednsClientSubnet: string;
  firewallRulesFailOpen: string;
  name: string;
  description?: string;
  globalResolverId: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}
export const UpdateDNSViewOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    clientToken: S.optional(S.String),
    dnssecValidation: S.String,
    ednsClientSubnet: S.String,
    firewallRulesFailOpen: S.String,
    name: S.String,
    description: S.optional(S.String),
    globalResolverId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
  }),
).annotations({
  identifier: "UpdateDNSViewOutput",
}) as any as S.Schema<UpdateDNSViewOutput>;
export interface DeleteDNSViewOutput {
  id: string;
  arn: string;
  clientToken?: string;
  dnssecValidation: string;
  ednsClientSubnet: string;
  firewallRulesFailOpen: string;
  name: string;
  description?: string;
  globalResolverId: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}
export const DeleteDNSViewOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    clientToken: S.optional(S.String),
    dnssecValidation: S.String,
    ednsClientSubnet: S.String,
    firewallRulesFailOpen: S.String,
    name: S.String,
    description: S.optional(S.String),
    globalResolverId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
  }),
).annotations({
  identifier: "DeleteDNSViewOutput",
}) as any as S.Schema<DeleteDNSViewOutput>;
export interface DisableDNSViewOutput {
  id: string;
  arn: string;
  clientToken?: string;
  dnssecValidation: string;
  ednsClientSubnet: string;
  firewallRulesFailOpen: string;
  name: string;
  description?: string;
  globalResolverId: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}
export const DisableDNSViewOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    clientToken: S.optional(S.String),
    dnssecValidation: S.String,
    ednsClientSubnet: S.String,
    firewallRulesFailOpen: S.String,
    name: S.String,
    description: S.optional(S.String),
    globalResolverId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
  }),
).annotations({
  identifier: "DisableDNSViewOutput",
}) as any as S.Schema<DisableDNSViewOutput>;
export interface EnableDNSViewOutput {
  id: string;
  arn: string;
  clientToken?: string;
  dnssecValidation: string;
  ednsClientSubnet: string;
  firewallRulesFailOpen: string;
  name: string;
  description?: string;
  globalResolverId: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}
export const EnableDNSViewOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    clientToken: S.optional(S.String),
    dnssecValidation: S.String,
    ednsClientSubnet: S.String,
    firewallRulesFailOpen: S.String,
    name: S.String,
    description: S.optional(S.String),
    globalResolverId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
  }),
).annotations({
  identifier: "EnableDNSViewOutput",
}) as any as S.Schema<EnableDNSViewOutput>;
export interface CreateFirewallDomainListOutput {
  arn: string;
  globalResolverId: string;
  createdAt: Date;
  description?: string;
  domainCount: number;
  id: string;
  name: string;
  status: string;
  updatedAt: Date;
}
export const CreateFirewallDomainListOutput = S.suspend(() =>
  S.Struct({
    arn: S.String,
    globalResolverId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    description: S.optional(S.String),
    domainCount: S.Number,
    id: S.String,
    name: S.String,
    status: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CreateFirewallDomainListOutput",
}) as any as S.Schema<CreateFirewallDomainListOutput>;
export interface GetFirewallDomainListOutput {
  arn: string;
  globalResolverId: string;
  clientToken?: string;
  createdAt: Date;
  description?: string;
  domainCount: number;
  id: string;
  name: string;
  status: string;
  statusMessage?: string;
  updatedAt: Date;
}
export const GetFirewallDomainListOutput = S.suspend(() =>
  S.Struct({
    arn: S.String,
    globalResolverId: S.String,
    clientToken: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    description: S.optional(S.String),
    domainCount: S.Number,
    id: S.String,
    name: S.String,
    status: S.String,
    statusMessage: S.optional(S.String),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "GetFirewallDomainListOutput",
}) as any as S.Schema<GetFirewallDomainListOutput>;
export interface DeleteFirewallDomainListOutput {
  arn: string;
  id: string;
  name: string;
  status: string;
}
export const DeleteFirewallDomainListOutput = S.suspend(() =>
  S.Struct({ arn: S.String, id: S.String, name: S.String, status: S.String }),
).annotations({
  identifier: "DeleteFirewallDomainListOutput",
}) as any as S.Schema<DeleteFirewallDomainListOutput>;
export interface ImportFirewallDomainsOutput {
  id: string;
  name: string;
  status: string;
}
export const ImportFirewallDomainsOutput = S.suspend(() =>
  S.Struct({ id: S.String, name: S.String, status: S.String }),
).annotations({
  identifier: "ImportFirewallDomainsOutput",
}) as any as S.Schema<ImportFirewallDomainsOutput>;
export interface ListFirewallDomainsOutput {
  nextToken?: string;
  domains: Domains;
}
export const ListFirewallDomainsOutput = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), domains: Domains }),
).annotations({
  identifier: "ListFirewallDomainsOutput",
}) as any as S.Schema<ListFirewallDomainsOutput>;
export interface UpdateFirewallDomainsOutput {
  id: string;
  name: string;
  status: string;
}
export const UpdateFirewallDomainsOutput = S.suspend(() =>
  S.Struct({ id: S.String, name: S.String, status: S.String }),
).annotations({
  identifier: "UpdateFirewallDomainsOutput",
}) as any as S.Schema<UpdateFirewallDomainsOutput>;
export interface CreateFirewallRuleOutput {
  action: string;
  blockOverrideDnsType?: string;
  blockOverrideDomain?: string;
  blockOverrideTtl?: number;
  blockResponse?: string;
  confidenceThreshold?: string;
  createdAt: Date;
  description?: string;
  dnsAdvancedProtection?: string;
  firewallDomainListId?: string;
  id: string;
  name: string;
  priority: number;
  dnsViewId: string;
  queryType?: string;
  status: string;
  updatedAt: Date;
}
export const CreateFirewallRuleOutput = S.suspend(() =>
  S.Struct({
    action: S.String,
    blockOverrideDnsType: S.optional(S.String),
    blockOverrideDomain: S.optional(S.String),
    blockOverrideTtl: S.optional(S.Number),
    blockResponse: S.optional(S.String),
    confidenceThreshold: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    description: S.optional(S.String),
    dnsAdvancedProtection: S.optional(S.String),
    firewallDomainListId: S.optional(S.String),
    id: S.String,
    name: S.String,
    priority: S.Number,
    dnsViewId: S.String,
    queryType: S.optional(S.String),
    status: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CreateFirewallRuleOutput",
}) as any as S.Schema<CreateFirewallRuleOutput>;
export interface GetFirewallRuleOutput {
  action: string;
  blockOverrideDnsType?: string;
  blockOverrideDomain?: string;
  blockOverrideTtl?: number;
  blockResponse?: string;
  confidenceThreshold?: string;
  createdAt: Date;
  description?: string;
  dnsAdvancedProtection?: string;
  firewallDomainListId?: string;
  id: string;
  name: string;
  priority: number;
  dnsViewId: string;
  queryType?: string;
  status: string;
  updatedAt: Date;
}
export const GetFirewallRuleOutput = S.suspend(() =>
  S.Struct({
    action: S.String,
    blockOverrideDnsType: S.optional(S.String),
    blockOverrideDomain: S.optional(S.String),
    blockOverrideTtl: S.optional(S.Number),
    blockResponse: S.optional(S.String),
    confidenceThreshold: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    description: S.optional(S.String),
    dnsAdvancedProtection: S.optional(S.String),
    firewallDomainListId: S.optional(S.String),
    id: S.String,
    name: S.String,
    priority: S.Number,
    dnsViewId: S.String,
    queryType: S.optional(S.String),
    status: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "GetFirewallRuleOutput",
}) as any as S.Schema<GetFirewallRuleOutput>;
export interface UpdateFirewallRuleOutput {
  action: string;
  blockOverrideDnsType?: string;
  blockOverrideDomain?: string;
  blockOverrideTtl?: number;
  blockResponse?: string;
  confidenceThreshold?: string;
  createdAt: Date;
  description?: string;
  dnsAdvancedProtection?: string;
  firewallDomainListId?: string;
  id: string;
  name: string;
  priority: number;
  dnsViewId: string;
  queryType?: string;
  status: string;
  updatedAt: Date;
}
export const UpdateFirewallRuleOutput = S.suspend(() =>
  S.Struct({
    action: S.String,
    blockOverrideDnsType: S.optional(S.String),
    blockOverrideDomain: S.optional(S.String),
    blockOverrideTtl: S.optional(S.Number),
    blockResponse: S.optional(S.String),
    confidenceThreshold: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    description: S.optional(S.String),
    dnsAdvancedProtection: S.optional(S.String),
    firewallDomainListId: S.optional(S.String),
    id: S.String,
    name: S.String,
    priority: S.Number,
    dnsViewId: S.String,
    queryType: S.optional(S.String),
    status: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "UpdateFirewallRuleOutput",
}) as any as S.Schema<UpdateFirewallRuleOutput>;
export interface DeleteFirewallRuleOutput {
  action: string;
  blockOverrideDnsType?: string;
  blockOverrideDomain?: string;
  blockOverrideTtl?: number;
  blockResponse?: string;
  confidenceThreshold?: string;
  createdAt: Date;
  description?: string;
  dnsAdvancedProtection?: string;
  firewallDomainListId?: string;
  id: string;
  name: string;
  priority: number;
  dnsViewId: string;
  queryType?: string;
  status: string;
  updatedAt: Date;
}
export const DeleteFirewallRuleOutput = S.suspend(() =>
  S.Struct({
    action: S.String,
    blockOverrideDnsType: S.optional(S.String),
    blockOverrideDomain: S.optional(S.String),
    blockOverrideTtl: S.optional(S.Number),
    blockResponse: S.optional(S.String),
    confidenceThreshold: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    description: S.optional(S.String),
    dnsAdvancedProtection: S.optional(S.String),
    firewallDomainListId: S.optional(S.String),
    id: S.String,
    name: S.String,
    priority: S.Number,
    dnsViewId: S.String,
    queryType: S.optional(S.String),
    status: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "DeleteFirewallRuleOutput",
}) as any as S.Schema<DeleteFirewallRuleOutput>;
export interface BatchCreateFirewallRuleInput {
  firewallRules: BatchCreateFirewallRuleInputItems;
}
export const BatchCreateFirewallRuleInput = S.suspend(() =>
  S.Struct({ firewallRules: BatchCreateFirewallRuleInputItems }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/firewall-rules/batch-create" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchCreateFirewallRuleInput",
}) as any as S.Schema<BatchCreateFirewallRuleInput>;
export interface BatchDeleteFirewallRuleInput {
  firewallRules: BatchDeleteFirewallRuleInputItems;
}
export const BatchDeleteFirewallRuleInput = S.suspend(() =>
  S.Struct({ firewallRules: BatchDeleteFirewallRuleInputItems }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/firewall-rules/batch-delete" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDeleteFirewallRuleInput",
}) as any as S.Schema<BatchDeleteFirewallRuleInput>;
export interface BatchUpdateFirewallRuleInput {
  firewallRules: BatchUpdateFirewallRuleInputItems;
}
export const BatchUpdateFirewallRuleInput = S.suspend(() =>
  S.Struct({ firewallRules: BatchUpdateFirewallRuleInputItems }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/firewall-rules/batch-update" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchUpdateFirewallRuleInput",
}) as any as S.Schema<BatchUpdateFirewallRuleInput>;
export interface CreateGlobalResolverOutput {
  id: string;
  arn: string;
  clientToken: string;
  createdAt: Date;
  description?: string;
  dnsName: string;
  ipv4Addresses: IPv4Addresses;
  name: string;
  observabilityRegion?: string;
  regions: Regions;
  status: string;
  updatedAt: Date;
}
export const CreateGlobalResolverOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    clientToken: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    description: S.optional(S.String),
    dnsName: S.String,
    ipv4Addresses: IPv4Addresses,
    name: S.String,
    observabilityRegion: S.optional(S.String),
    regions: Regions,
    status: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CreateGlobalResolverOutput",
}) as any as S.Schema<CreateGlobalResolverOutput>;
export interface GetGlobalResolverOutput {
  id: string;
  arn: string;
  clientToken: string;
  dnsName: string;
  observabilityRegion?: string;
  name: string;
  description?: string;
  regions: Regions;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  ipv4Addresses: IPv4Addresses;
}
export const GetGlobalResolverOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    clientToken: S.String,
    dnsName: S.String,
    observabilityRegion: S.optional(S.String),
    name: S.String,
    description: S.optional(S.String),
    regions: Regions,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
    ipv4Addresses: IPv4Addresses,
  }),
).annotations({
  identifier: "GetGlobalResolverOutput",
}) as any as S.Schema<GetGlobalResolverOutput>;
export interface UpdateGlobalResolverOutput {
  id: string;
  arn: string;
  clientToken: string;
  dnsName: string;
  observabilityRegion?: string;
  name: string;
  description?: string;
  regions: Regions;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  ipv4Addresses: IPv4Addresses;
}
export const UpdateGlobalResolverOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    clientToken: S.String,
    dnsName: S.String,
    observabilityRegion: S.optional(S.String),
    name: S.String,
    description: S.optional(S.String),
    regions: Regions,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
    ipv4Addresses: IPv4Addresses,
  }),
).annotations({
  identifier: "UpdateGlobalResolverOutput",
}) as any as S.Schema<UpdateGlobalResolverOutput>;
export interface DeleteGlobalResolverOutput {
  id: string;
  arn: string;
  clientToken: string;
  dnsName: string;
  observabilityRegion?: string;
  name: string;
  description?: string;
  regions: Regions;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  ipv4Addresses: IPv4Addresses;
}
export const DeleteGlobalResolverOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    clientToken: S.String,
    dnsName: S.String,
    observabilityRegion: S.optional(S.String),
    name: S.String,
    description: S.optional(S.String),
    regions: Regions,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
    ipv4Addresses: IPv4Addresses,
  }),
).annotations({
  identifier: "DeleteGlobalResolverOutput",
}) as any as S.Schema<DeleteGlobalResolverOutput>;
export interface AssociateHostedZoneOutput {
  id: string;
  resourceArn: string;
  hostedZoneId: string;
  hostedZoneName: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}
export const AssociateHostedZoneOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    resourceArn: S.String,
    hostedZoneId: S.String,
    hostedZoneName: S.String,
    name: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
  }),
).annotations({
  identifier: "AssociateHostedZoneOutput",
}) as any as S.Schema<AssociateHostedZoneOutput>;
export interface GetHostedZoneAssociationOutput {
  id: string;
  resourceArn: string;
  hostedZoneId: string;
  hostedZoneName: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}
export const GetHostedZoneAssociationOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    resourceArn: S.String,
    hostedZoneId: S.String,
    hostedZoneName: S.String,
    name: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
  }),
).annotations({
  identifier: "GetHostedZoneAssociationOutput",
}) as any as S.Schema<GetHostedZoneAssociationOutput>;
export interface UpdateHostedZoneAssociationOutput {
  id: string;
  resourceArn: string;
  hostedZoneId: string;
  hostedZoneName: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}
export const UpdateHostedZoneAssociationOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    resourceArn: S.String,
    hostedZoneId: S.String,
    hostedZoneName: S.String,
    name: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
  }),
).annotations({
  identifier: "UpdateHostedZoneAssociationOutput",
}) as any as S.Schema<UpdateHostedZoneAssociationOutput>;
export interface GetManagedFirewallDomainListOutput {
  description?: string;
  id: string;
  name: string;
  managedListType: string;
}
export const GetManagedFirewallDomainListOutput = S.suspend(() =>
  S.Struct({
    description: S.optional(S.String),
    id: S.String,
    name: S.String,
    managedListType: S.String,
  }),
).annotations({
  identifier: "GetManagedFirewallDomainListOutput",
}) as any as S.Schema<GetManagedFirewallDomainListOutput>;
export interface AccessTokenItem {
  id: string;
  arn: string;
  createdAt: Date;
  dnsViewId: string;
  expiresAt: Date;
  globalResolverId: string;
  name?: string;
  status: string;
  updatedAt: Date;
}
export const AccessTokenItem = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    dnsViewId: S.String,
    expiresAt: S.Date.pipe(T.TimestampFormat("date-time")),
    globalResolverId: S.String,
    name: S.optional(S.String),
    status: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "AccessTokenItem",
}) as any as S.Schema<AccessTokenItem>;
export type AccessTokens = AccessTokenItem[];
export const AccessTokens = S.Array(AccessTokenItem);
export interface DNSViewSummary {
  id: string;
  arn: string;
  clientToken: string;
  dnssecValidation: string;
  ednsClientSubnet: string;
  firewallRulesFailOpen: string;
  name: string;
  description?: string;
  globalResolverId: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}
export const DNSViewSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    clientToken: S.String,
    dnssecValidation: S.String,
    ednsClientSubnet: S.String,
    firewallRulesFailOpen: S.String,
    name: S.String,
    description: S.optional(S.String),
    globalResolverId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
  }),
).annotations({
  identifier: "DNSViewSummary",
}) as any as S.Schema<DNSViewSummary>;
export type DNSViews = DNSViewSummary[];
export const DNSViews = S.Array(DNSViewSummary);
export interface FirewallDomainListsItem {
  arn: string;
  globalResolverId: string;
  createdAt: Date;
  description?: string;
  id: string;
  name: string;
  status: string;
  updatedAt: Date;
}
export const FirewallDomainListsItem = S.suspend(() =>
  S.Struct({
    arn: S.String,
    globalResolverId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    description: S.optional(S.String),
    id: S.String,
    name: S.String,
    status: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "FirewallDomainListsItem",
}) as any as S.Schema<FirewallDomainListsItem>;
export type FirewallDomainLists = FirewallDomainListsItem[];
export const FirewallDomainLists = S.Array(FirewallDomainListsItem);
export interface FirewallRulesItem {
  action: string;
  blockOverrideDnsType?: string;
  blockOverrideDomain?: string;
  blockOverrideTtl?: number;
  blockResponse?: string;
  confidenceThreshold?: string;
  createdAt: Date;
  description?: string;
  dnsAdvancedProtection?: string;
  firewallDomainListId?: string;
  id: string;
  name: string;
  priority: number;
  dnsViewId: string;
  queryType?: string;
  status: string;
  updatedAt: Date;
}
export const FirewallRulesItem = S.suspend(() =>
  S.Struct({
    action: S.String,
    blockOverrideDnsType: S.optional(S.String),
    blockOverrideDomain: S.optional(S.String),
    blockOverrideTtl: S.optional(S.Number),
    blockResponse: S.optional(S.String),
    confidenceThreshold: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    description: S.optional(S.String),
    dnsAdvancedProtection: S.optional(S.String),
    firewallDomainListId: S.optional(S.String),
    id: S.String,
    name: S.String,
    priority: S.Number,
    dnsViewId: S.String,
    queryType: S.optional(S.String),
    status: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "FirewallRulesItem",
}) as any as S.Schema<FirewallRulesItem>;
export type FirewallRules = FirewallRulesItem[];
export const FirewallRules = S.Array(FirewallRulesItem);
export interface GlobalResolversItem {
  id: string;
  arn: string;
  clientToken: string;
  dnsName: string;
  observabilityRegion?: string;
  name: string;
  description?: string;
  regions: Regions;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  ipv4Addresses: IPv4Addresses;
}
export const GlobalResolversItem = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    clientToken: S.String,
    dnsName: S.String,
    observabilityRegion: S.optional(S.String),
    name: S.String,
    description: S.optional(S.String),
    regions: Regions,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
    ipv4Addresses: IPv4Addresses,
  }),
).annotations({
  identifier: "GlobalResolversItem",
}) as any as S.Schema<GlobalResolversItem>;
export type GlobalResolvers = GlobalResolversItem[];
export const GlobalResolvers = S.Array(GlobalResolversItem);
export interface HostedZoneAssociationSummary {
  id: string;
  resourceArn: string;
  hostedZoneId: string;
  hostedZoneName: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}
export const HostedZoneAssociationSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    resourceArn: S.String,
    hostedZoneId: S.String,
    hostedZoneName: S.String,
    name: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
  }),
).annotations({
  identifier: "HostedZoneAssociationSummary",
}) as any as S.Schema<HostedZoneAssociationSummary>;
export type HostedZoneAssociations = HostedZoneAssociationSummary[];
export const HostedZoneAssociations = S.Array(HostedZoneAssociationSummary);
export interface ManagedFirewallDomainListsItem {
  description?: string;
  id: string;
  name: string;
  managedListType: string;
}
export const ManagedFirewallDomainListsItem = S.suspend(() =>
  S.Struct({
    description: S.optional(S.String),
    id: S.String,
    name: S.String,
    managedListType: S.String,
  }),
).annotations({
  identifier: "ManagedFirewallDomainListsItem",
}) as any as S.Schema<ManagedFirewallDomainListsItem>;
export type ManagedFirewallDomainLists = ManagedFirewallDomainListsItem[];
export const ManagedFirewallDomainLists = S.Array(
  ManagedFirewallDomainListsItem,
);
export interface ListAccessTokensOutput {
  nextToken?: string;
  accessTokens?: AccessTokens;
}
export const ListAccessTokensOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    accessTokens: S.optional(AccessTokens),
  }),
).annotations({
  identifier: "ListAccessTokensOutput",
}) as any as S.Schema<ListAccessTokensOutput>;
export interface ListDNSViewsOutput {
  nextToken?: string;
  dnsViews: DNSViews;
}
export const ListDNSViewsOutput = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), dnsViews: DNSViews }),
).annotations({
  identifier: "ListDNSViewsOutput",
}) as any as S.Schema<ListDNSViewsOutput>;
export interface ListFirewallDomainListsOutput {
  nextToken?: string;
  firewallDomainLists: FirewallDomainLists;
}
export const ListFirewallDomainListsOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    firewallDomainLists: FirewallDomainLists,
  }),
).annotations({
  identifier: "ListFirewallDomainListsOutput",
}) as any as S.Schema<ListFirewallDomainListsOutput>;
export interface ListFirewallRulesOutput {
  nextToken?: string;
  firewallRules: FirewallRules;
}
export const ListFirewallRulesOutput = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), firewallRules: FirewallRules }),
).annotations({
  identifier: "ListFirewallRulesOutput",
}) as any as S.Schema<ListFirewallRulesOutput>;
export interface ListGlobalResolversOutput {
  nextToken?: string;
  globalResolvers: GlobalResolvers;
}
export const ListGlobalResolversOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    globalResolvers: GlobalResolvers,
  }),
).annotations({
  identifier: "ListGlobalResolversOutput",
}) as any as S.Schema<ListGlobalResolversOutput>;
export interface ListHostedZoneAssociationsOutput {
  nextToken?: string;
  hostedZoneAssociations: HostedZoneAssociations;
}
export const ListHostedZoneAssociationsOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    hostedZoneAssociations: HostedZoneAssociations,
  }),
).annotations({
  identifier: "ListHostedZoneAssociationsOutput",
}) as any as S.Schema<ListHostedZoneAssociationsOutput>;
export interface ListManagedFirewallDomainListsOutput {
  nextToken?: string;
  managedFirewallDomainLists: ManagedFirewallDomainLists;
}
export const ListManagedFirewallDomainListsOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    managedFirewallDomainLists: ManagedFirewallDomainLists,
  }),
).annotations({
  identifier: "ListManagedFirewallDomainListsOutput",
}) as any as S.Schema<ListManagedFirewallDomainListsOutput>;
export interface ValidationExceptionField {
  name: string;
  message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export interface AccessSourcesItem {
  arn: string;
  cidr: string;
  createdAt: Date;
  id: string;
  ipAddressType: string;
  name?: string;
  dnsViewId: string;
  protocol: string;
  status: string;
  updatedAt: Date;
}
export const AccessSourcesItem = S.suspend(() =>
  S.Struct({
    arn: S.String,
    cidr: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    id: S.String,
    ipAddressType: S.String,
    name: S.optional(S.String),
    dnsViewId: S.String,
    protocol: S.String,
    status: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "AccessSourcesItem",
}) as any as S.Schema<AccessSourcesItem>;
export type AccessSources = AccessSourcesItem[];
export const AccessSources = S.Array(AccessSourcesItem);
export interface ListAccessSourcesOutput {
  nextToken?: string;
  accessSources: AccessSources;
}
export const ListAccessSourcesOutput = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), accessSources: AccessSources }),
).annotations({
  identifier: "ListAccessSourcesOutput",
}) as any as S.Schema<ListAccessSourcesOutput>;
export interface BatchCreateFirewallRuleResult {
  action: string;
  blockOverrideDnsType?: string;
  blockOverrideDomain?: string;
  blockOverrideTtl?: number;
  blockResponse?: string;
  clientToken: string;
  confidenceThreshold?: string;
  createdAt?: Date;
  description?: string;
  dnsAdvancedProtection?: string;
  firewallDomainListId?: string;
  id?: string;
  managedDomainListName?: string;
  name: string;
  priority?: number;
  dnsViewId: string;
  queryType?: string;
  status?: string;
  updatedAt?: Date;
}
export const BatchCreateFirewallRuleResult = S.suspend(() =>
  S.Struct({
    action: S.String,
    blockOverrideDnsType: S.optional(S.String),
    blockOverrideDomain: S.optional(S.String),
    blockOverrideTtl: S.optional(S.Number),
    blockResponse: S.optional(S.String),
    clientToken: S.String,
    confidenceThreshold: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    description: S.optional(S.String),
    dnsAdvancedProtection: S.optional(S.String),
    firewallDomainListId: S.optional(S.String),
    id: S.optional(S.String),
    managedDomainListName: S.optional(S.String),
    name: S.String,
    priority: S.optional(S.Number),
    dnsViewId: S.String,
    queryType: S.optional(S.String),
    status: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "BatchCreateFirewallRuleResult",
}) as any as S.Schema<BatchCreateFirewallRuleResult>;
export interface BatchDeleteFirewallRuleResult {
  clientToken?: string;
  id: string;
  name?: string;
  status?: string;
}
export const BatchDeleteFirewallRuleResult = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String),
    id: S.String,
    name: S.optional(S.String),
    status: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchDeleteFirewallRuleResult",
}) as any as S.Schema<BatchDeleteFirewallRuleResult>;
export interface BatchUpdateFirewallRuleResult {
  action?: string;
  blockOverrideDnsType?: string;
  blockOverrideDomain?: string;
  blockOverrideTtl?: number;
  blockResponse?: string;
  clientToken?: string;
  confidenceThreshold?: string;
  createdAt?: Date;
  description?: string;
  dnsAdvancedProtection?: string;
  firewallDomainListId?: string;
  id: string;
  name?: string;
  priority?: number;
  dnsViewId?: string;
  queryType?: string;
  status?: string;
  updatedAt?: Date;
}
export const BatchUpdateFirewallRuleResult = S.suspend(() =>
  S.Struct({
    action: S.optional(S.String),
    blockOverrideDnsType: S.optional(S.String),
    blockOverrideDomain: S.optional(S.String),
    blockOverrideTtl: S.optional(S.Number),
    blockResponse: S.optional(S.String),
    clientToken: S.optional(S.String),
    confidenceThreshold: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    description: S.optional(S.String),
    dnsAdvancedProtection: S.optional(S.String),
    firewallDomainListId: S.optional(S.String),
    id: S.String,
    name: S.optional(S.String),
    priority: S.optional(S.Number),
    dnsViewId: S.optional(S.String),
    queryType: S.optional(S.String),
    status: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "BatchUpdateFirewallRuleResult",
}) as any as S.Schema<BatchUpdateFirewallRuleResult>;
export interface BatchCreateFirewallRuleOutputItem {
  firewallRule: BatchCreateFirewallRuleResult;
  code: number;
  message?: string;
}
export const BatchCreateFirewallRuleOutputItem = S.suspend(() =>
  S.Struct({
    firewallRule: BatchCreateFirewallRuleResult,
    code: S.Number,
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchCreateFirewallRuleOutputItem",
}) as any as S.Schema<BatchCreateFirewallRuleOutputItem>;
export type BatchCreateFirewallRuleOutputItems =
  BatchCreateFirewallRuleOutputItem[];
export const BatchCreateFirewallRuleOutputItems = S.Array(
  BatchCreateFirewallRuleOutputItem,
);
export interface BatchDeleteFirewallRuleOutputItem {
  firewallRule: BatchDeleteFirewallRuleResult;
  code: number;
  message?: string;
}
export const BatchDeleteFirewallRuleOutputItem = S.suspend(() =>
  S.Struct({
    firewallRule: BatchDeleteFirewallRuleResult,
    code: S.Number,
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchDeleteFirewallRuleOutputItem",
}) as any as S.Schema<BatchDeleteFirewallRuleOutputItem>;
export type BatchDeleteFirewallRuleOutputItems =
  BatchDeleteFirewallRuleOutputItem[];
export const BatchDeleteFirewallRuleOutputItems = S.Array(
  BatchDeleteFirewallRuleOutputItem,
);
export interface BatchUpdateFirewallRuleOutputItem {
  firewallRule: BatchUpdateFirewallRuleResult;
  code: number;
  message?: string;
}
export const BatchUpdateFirewallRuleOutputItem = S.suspend(() =>
  S.Struct({
    firewallRule: BatchUpdateFirewallRuleResult,
    code: S.Number,
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchUpdateFirewallRuleOutputItem",
}) as any as S.Schema<BatchUpdateFirewallRuleOutputItem>;
export type BatchUpdateFirewallRuleOutputItems =
  BatchUpdateFirewallRuleOutputItem[];
export const BatchUpdateFirewallRuleOutputItems = S.Array(
  BatchUpdateFirewallRuleOutputItem,
);
export interface BatchCreateFirewallRuleOutput {
  failures: BatchCreateFirewallRuleOutputItems;
  successes: BatchCreateFirewallRuleOutputItems;
}
export const BatchCreateFirewallRuleOutput = S.suspend(() =>
  S.Struct({
    failures: BatchCreateFirewallRuleOutputItems,
    successes: BatchCreateFirewallRuleOutputItems,
  }),
).annotations({
  identifier: "BatchCreateFirewallRuleOutput",
}) as any as S.Schema<BatchCreateFirewallRuleOutput>;
export interface BatchDeleteFirewallRuleOutput {
  failures: BatchDeleteFirewallRuleOutputItems;
  successes: BatchDeleteFirewallRuleOutputItems;
}
export const BatchDeleteFirewallRuleOutput = S.suspend(() =>
  S.Struct({
    failures: BatchDeleteFirewallRuleOutputItems,
    successes: BatchDeleteFirewallRuleOutputItems,
  }),
).annotations({
  identifier: "BatchDeleteFirewallRuleOutput",
}) as any as S.Schema<BatchDeleteFirewallRuleOutput>;
export interface BatchUpdateFirewallRuleOutput {
  failures: BatchUpdateFirewallRuleOutputItems;
  successes: BatchUpdateFirewallRuleOutputItems;
}
export const BatchUpdateFirewallRuleOutput = S.suspend(() =>
  S.Struct({
    failures: BatchUpdateFirewallRuleOutputItems,
    successes: BatchUpdateFirewallRuleOutputItems,
  }),
).annotations({
  identifier: "BatchUpdateFirewallRuleOutput",
}) as any as S.Schema<BatchUpdateFirewallRuleOutput>;

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.String,
  },
).pipe(C.withBadRequestError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
).pipe(C.withQuotaError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.String,
  },
).pipe(C.withConflictError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}

//# Operations
/**
 * Lists the tags associated with a Route 53 Global Resolver resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Removes tags from a Route 53 Global Resolver resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Adds or updates tags for a Route 53 Global Resolver resource. Tags are key-value pairs that help you organize and identify your resources.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Lists all access tokens for a DNS view with pagination support.
 */
export const listAccessTokens: {
  (
    input: ListAccessTokensInput,
  ): Effect.Effect<
    ListAccessTokensOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccessTokensInput,
  ) => Stream.Stream<
    ListAccessTokensOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListAccessTokensInput,
  ) => Stream.Stream<
    AccessTokenItem,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccessTokensInput,
  output: ListAccessTokensOutput,
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
    items: "accessTokens",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates multiple DNS firewall rules in a single operation. This is more efficient than creating rules individually when you need to set up multiple rules at once.
 */
export const batchCreateFirewallRule: (
  input: BatchCreateFirewallRuleInput,
) => Effect.Effect<
  BatchCreateFirewallRuleOutput,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchCreateFirewallRuleInput,
  output: BatchCreateFirewallRuleOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes multiple DNS firewall rules in a single operation. This is more efficient than deleting rules individually.
 */
export const batchDeleteFirewallRule: (
  input: BatchDeleteFirewallRuleInput,
) => Effect.Effect<
  BatchDeleteFirewallRuleOutput,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteFirewallRuleInput,
  output: BatchDeleteFirewallRuleOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates multiple DNS firewall rules in a single operation. This is more efficient than updating rules individually.
 */
export const batchUpdateFirewallRule: (
  input: BatchUpdateFirewallRuleInput,
) => Effect.Effect<
  BatchUpdateFirewallRuleOutput,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchUpdateFirewallRuleInput,
  output: BatchUpdateFirewallRuleOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an access source for a DNS view. Access sources define IP addresses or CIDR ranges that are allowed to send DNS queries to the Route 53 Global Resolver, along with the permitted DNS protocols.
 */
export const createAccessSource: (
  input: CreateAccessSourceInput,
) => Effect.Effect<
  CreateAccessSourceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccessSourceInput,
  output: CreateAccessSourceOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration of an access source.
 */
export const updateAccessSource: (
  input: UpdateAccessSourceInput,
) => Effect.Effect<
  UpdateAccessSourceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccessSourceInput,
  output: UpdateAccessSourceOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an access source. This operation cannot be undone.
 */
export const deleteAccessSource: (
  input: DeleteAccessSourceInput,
) => Effect.Effect<
  DeleteAccessSourceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessSourceInput,
  output: DeleteAccessSourceOutput,
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
 * Creates an access token for a DNS view. Access tokens provide token-based authentication for DNS-over-HTTPS (DoH) and DNS-over-TLS (DoT) connections to the Route 53 Global Resolver.
 */
export const createAccessToken: (
  input: CreateAccessTokenInput,
) => Effect.Effect<
  CreateAccessTokenOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccessTokenInput,
  output: CreateAccessTokenOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration of an access token.
 */
export const updateAccessToken: (
  input: UpdateAccessTokenInput,
) => Effect.Effect<
  UpdateAccessTokenOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccessTokenInput,
  output: UpdateAccessTokenOutput,
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
 * Creates a DNS view within a Route 53 Global Resolver. A DNS view models end users, user groups, networks, and devices, and serves as a parent resource that holds configurations controlling access, authorization, DNS firewall rules, and forwarding rules.
 */
export const createDNSView: (
  input: CreateDNSViewInput,
) => Effect.Effect<
  CreateDNSViewOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDNSViewInput,
  output: CreateDNSViewOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration of a DNS view.
 */
export const updateDNSView: (
  input: UpdateDNSViewInput,
) => Effect.Effect<
  UpdateDNSViewOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDNSViewInput,
  output: UpdateDNSViewOutput,
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
 * Deletes a DNS view. This operation cannot be undone.
 */
export const deleteDNSView: (
  input: DeleteDNSViewInput,
) => Effect.Effect<
  DeleteDNSViewOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDNSViewInput,
  output: DeleteDNSViewOutput,
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
 * Disables a DNS view, preventing it from serving DNS queries.
 */
export const disableDNSView: (
  input: DisableDNSViewInput,
) => Effect.Effect<
  DisableDNSViewOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableDNSViewInput,
  output: DisableDNSViewOutput,
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
 * Enables a disabled DNS view, allowing it to serve DNS queries again.
 */
export const enableDNSView: (
  input: EnableDNSViewInput,
) => Effect.Effect<
  EnableDNSViewOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableDNSViewInput,
  output: EnableDNSViewOutput,
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
 * Creates a firewall domain list. Domain lists are reusable sets of domain specifications that you use in DNS firewall rules to allow, block, or alert on DNS queries to specific domains.
 */
export const createFirewallDomainList: (
  input: CreateFirewallDomainListInput,
) => Effect.Effect<
  CreateFirewallDomainListOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFirewallDomainListInput,
  output: CreateFirewallDomainListOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a firewall domain list. This operation cannot be undone.
 */
export const deleteFirewallDomainList: (
  input: DeleteFirewallDomainListInput,
) => Effect.Effect<
  DeleteFirewallDomainListOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFirewallDomainListInput,
  output: DeleteFirewallDomainListOutput,
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
 * Imports a list of domains from an Amazon S3 file into a firewall domain list. The file should contain one domain per line.
 */
export const importFirewallDomains: (
  input: ImportFirewallDomainsInput,
) => Effect.Effect<
  ImportFirewallDomainsOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportFirewallDomainsInput,
  output: ImportFirewallDomainsOutput,
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
 * Updates a DNS Firewall domain list from an array of specified domains.
 */
export const updateFirewallDomains: (
  input: UpdateFirewallDomainsInput,
) => Effect.Effect<
  UpdateFirewallDomainsOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFirewallDomainsInput,
  output: UpdateFirewallDomainsOutput,
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
 * Creates a DNS firewall rule. Firewall rules define actions (ALLOW, BLOCK, or ALERT) to take on DNS queries that match specified domain lists, managed domain lists, or advanced threat protections.
 */
export const createFirewallRule: (
  input: CreateFirewallRuleInput,
) => Effect.Effect<
  CreateFirewallRuleOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFirewallRuleInput,
  output: CreateFirewallRuleOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration of a DNS firewall rule.
 */
export const updateFirewallRule: (
  input: UpdateFirewallRuleInput,
) => Effect.Effect<
  UpdateFirewallRuleOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFirewallRuleInput,
  output: UpdateFirewallRuleOutput,
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
 * Deletes a DNS firewall rule. This operation cannot be undone.
 */
export const deleteFirewallRule: (
  input: DeleteFirewallRuleInput,
) => Effect.Effect<
  DeleteFirewallRuleOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFirewallRuleInput,
  output: DeleteFirewallRuleOutput,
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
 * Creates a new Route 53 Global Resolver instance. A Route 53 Global Resolver is a global, internet-accessible DNS resolver that provides secure DNS resolution for both public and private domains through global anycast IP addresses.
 */
export const createGlobalResolver: (
  input: CreateGlobalResolverInput,
) => Effect.Effect<
  CreateGlobalResolverOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGlobalResolverInput,
  output: CreateGlobalResolverOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration of a Route 53 Global Resolver instance. You can modify the name, description, and observability region.
 */
export const updateGlobalResolver: (
  input: UpdateGlobalResolverInput,
) => Effect.Effect<
  UpdateGlobalResolverOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGlobalResolverInput,
  output: UpdateGlobalResolverOutput,
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
 * Deletes a Route 53 Global Resolver instance. This operation cannot be undone. All associated DNS views, access sources, tokens, and firewall rules are also deleted.
 */
export const deleteGlobalResolver: (
  input: DeleteGlobalResolverInput,
) => Effect.Effect<
  DeleteGlobalResolverOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGlobalResolverInput,
  output: DeleteGlobalResolverOutput,
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
 * Associates a Route 53 private hosted zone with a Route 53 Global Resolver resource. This allows the resolver to resolve DNS queries for the private hosted zone from anywhere globally.
 */
export const associateHostedZone: (
  input: AssociateHostedZoneInput,
) => Effect.Effect<
  AssociateHostedZoneOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateHostedZoneInput,
  output: AssociateHostedZoneOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration of a hosted zone association.
 */
export const updateHostedZoneAssociation: (
  input: UpdateHostedZoneAssociationInput,
) => Effect.Effect<
  UpdateHostedZoneAssociationOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateHostedZoneAssociationInput,
  output: UpdateHostedZoneAssociationOutput,
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
 * Lists all DNS views for a Route 53 Global Resolver with pagination support.
 */
export const listDNSViews: {
  (
    input: ListDNSViewsInput,
  ): Effect.Effect<
    ListDNSViewsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListDNSViewsInput,
  ) => Stream.Stream<
    ListDNSViewsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListDNSViewsInput,
  ) => Stream.Stream<
    DNSViewSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDNSViewsInput,
  output: ListDNSViewsOutput,
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
    items: "dnsViews",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all firewall domain lists for a Route 53 Global Resolver with pagination support.
 */
export const listFirewallDomainLists: {
  (
    input: ListFirewallDomainListsInput,
  ): Effect.Effect<
    ListFirewallDomainListsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListFirewallDomainListsInput,
  ) => Stream.Stream<
    ListFirewallDomainListsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListFirewallDomainListsInput,
  ) => Stream.Stream<
    FirewallDomainListsItem,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFirewallDomainListsInput,
  output: ListFirewallDomainListsOutput,
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
    items: "firewallDomainLists",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all DNS firewall rules for a DNS view with pagination support.
 */
export const listFirewallRules: {
  (
    input: ListFirewallRulesInput,
  ): Effect.Effect<
    ListFirewallRulesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListFirewallRulesInput,
  ) => Stream.Stream<
    ListFirewallRulesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListFirewallRulesInput,
  ) => Stream.Stream<
    FirewallRulesItem,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFirewallRulesInput,
  output: ListFirewallRulesOutput,
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
    items: "firewallRules",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all Route 53 Global Resolver instances in your account with pagination support.
 */
export const listGlobalResolvers: {
  (
    input: ListGlobalResolversInput,
  ): Effect.Effect<
    ListGlobalResolversOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListGlobalResolversInput,
  ) => Stream.Stream<
    ListGlobalResolversOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListGlobalResolversInput,
  ) => Stream.Stream<
    GlobalResolversItem,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGlobalResolversInput,
  output: ListGlobalResolversOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "globalResolvers",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all hosted zone associations for a Route 53 Global Resolver resource with pagination support.
 */
export const listHostedZoneAssociations: {
  (
    input: ListHostedZoneAssociationsInput,
  ): Effect.Effect<
    ListHostedZoneAssociationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListHostedZoneAssociationsInput,
  ) => Stream.Stream<
    ListHostedZoneAssociationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListHostedZoneAssociationsInput,
  ) => Stream.Stream<
    HostedZoneAssociationSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListHostedZoneAssociationsInput,
  output: ListHostedZoneAssociationsOutput,
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
    items: "hostedZoneAssociations",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a paginated list of the AWS Managed DNS Lists and the categories for DNS Firewall. The categories are either `THREAT` or `CONTENT`.
 */
export const listManagedFirewallDomainLists: {
  (
    input: ListManagedFirewallDomainListsInput,
  ): Effect.Effect<
    ListManagedFirewallDomainListsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListManagedFirewallDomainListsInput,
  ) => Stream.Stream<
    ListManagedFirewallDomainListsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListManagedFirewallDomainListsInput,
  ) => Stream.Stream<
    ManagedFirewallDomainListsItem,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListManagedFirewallDomainListsInput,
  output: ListManagedFirewallDomainListsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "managedFirewallDomainLists",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves information about an access source.
 */
export const getAccessSource: (
  input: GetAccessSourceInput,
) => Effect.Effect<
  GetAccessSourceOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccessSourceInput,
  output: GetAccessSourceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about an access token.
 */
export const getAccessToken: (
  input: GetAccessTokenInput,
) => Effect.Effect<
  GetAccessTokenOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccessTokenInput,
  output: GetAccessTokenOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an access token. This operation cannot be undone.
 */
export const deleteAccessToken: (
  input: DeleteAccessTokenInput,
) => Effect.Effect<
  DeleteAccessTokenOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessTokenInput,
  output: DeleteAccessTokenOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a DNS view.
 */
export const getDNSView: (
  input: GetDNSViewInput,
) => Effect.Effect<
  GetDNSViewOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDNSViewInput,
  output: GetDNSViewOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a firewall domain list.
 */
export const getFirewallDomainList: (
  input: GetFirewallDomainListInput,
) => Effect.Effect<
  GetFirewallDomainListOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFirewallDomainListInput,
  output: GetFirewallDomainListOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all the domains in DNS Firewall domain list you have created.
 */
export const listFirewallDomains: {
  (
    input: ListFirewallDomainsInput,
  ): Effect.Effect<
    ListFirewallDomainsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListFirewallDomainsInput,
  ) => Stream.Stream<
    ListFirewallDomainsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListFirewallDomainsInput,
  ) => Stream.Stream<
    Domain,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFirewallDomainsInput,
  output: ListFirewallDomainsOutput,
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
    items: "domains",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves information about a DNS firewall rule.
 */
export const getFirewallRule: (
  input: GetFirewallRuleInput,
) => Effect.Effect<
  GetFirewallRuleOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFirewallRuleInput,
  output: GetFirewallRuleOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a Route 53 Global Resolver instance.
 */
export const getGlobalResolver: (
  input: GetGlobalResolverInput,
) => Effect.Effect<
  GetGlobalResolverOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGlobalResolverInput,
  output: GetGlobalResolverOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a hosted zone association.
 */
export const getHostedZoneAssociation: (
  input: GetHostedZoneAssociationInput,
) => Effect.Effect<
  GetHostedZoneAssociationOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetHostedZoneAssociationInput,
  output: GetHostedZoneAssociationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about an AWS-managed firewall domain list. Managed domain lists contain domains associated with malicious activity, content categories, or specific threats.
 */
export const getManagedFirewallDomainList: (
  input: GetManagedFirewallDomainListInput,
) => Effect.Effect<
  GetManagedFirewallDomainListOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetManagedFirewallDomainListInput,
  output: GetManagedFirewallDomainListOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Disassociates a Route 53 private hosted zone from a Route 53 Global Resolver resource.
 */
export const disassociateHostedZone: (
  input: DisassociateHostedZoneInput,
) => Effect.Effect<
  DisassociateHostedZoneOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateHostedZoneInput,
  output: DisassociateHostedZoneOutput,
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
 * Lists all access sources with pagination support.
 */
export const listAccessSources: {
  (
    input: ListAccessSourcesInput,
  ): Effect.Effect<
    ListAccessSourcesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccessSourcesInput,
  ) => Stream.Stream<
    ListAccessSourcesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListAccessSourcesInput,
  ) => Stream.Stream<
    AccessSourcesItem,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccessSourcesInput,
  output: ListAccessSourcesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "accessSources",
    pageSize: "maxResults",
  } as const,
}));
