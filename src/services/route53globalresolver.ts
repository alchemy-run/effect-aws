import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Route53GlobalResolver",
  serviceShapeName: "EC2DNSGlobalResolverCustomerAPI",
});
const auth = T.AwsAuthSigv4({ name: "route53globalresolver" });
const ver = T.ServiceVersion("2022-09-27");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
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
          conditions: [],
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
          type: "endpoint",
        },
      ],
      type: "tree",
    },
    {
      conditions: [],
      rules: [
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
                  ],
                  endpoint: {
                    url: "https://route53globalresolver-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [],
                  endpoint: {
                    url: "https://route53globalresolver.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
      type: "tree",
    },
  ],
});

//# Schemas
export const TagKeys = S.Array(S.String);
export const Domains = S.Array(S.String);
export const Regions = S.Array(S.String);
export class DisassociateHostedZoneInput extends S.Class<DisassociateHostedZoneInput>(
  "DisassociateHostedZoneInput",
)(
  {
    hostedZoneId: S.String.pipe(T.HttpLabel("hostedZoneId")),
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
  },
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
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/get-all-tags" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { resourceArn: S.String, tagKeys: TagKeys },
  T.all(
    T.Http({ method: "POST", uri: "/untag-resource" }),
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
export const Tags = S.Record({ key: S.String, value: S.String });
export class CreateAccessSourceInput extends S.Class<CreateAccessSourceInput>(
  "CreateAccessSourceInput",
)(
  {
    cidr: S.String,
    clientToken: S.optional(S.String),
    ipAddressType: S.optional(S.String),
    name: S.optional(S.String),
    dnsViewId: S.String,
    protocol: S.String,
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/access-sources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAccessSourceInput extends S.Class<GetAccessSourceInput>(
  "GetAccessSourceInput",
)(
  { accessSourceId: S.String.pipe(T.HttpLabel("accessSourceId")) },
  T.all(
    T.Http({ method: "GET", uri: "/access-sources/{accessSourceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAccessSourceInput extends S.Class<UpdateAccessSourceInput>(
  "UpdateAccessSourceInput",
)(
  {
    accessSourceId: S.String.pipe(T.HttpLabel("accessSourceId")),
    cidr: S.optional(S.String),
    ipAddressType: S.optional(S.String),
    name: S.optional(S.String),
    protocol: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/access-sources/{accessSourceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAccessSourceInput extends S.Class<DeleteAccessSourceInput>(
  "DeleteAccessSourceInput",
)(
  { accessSourceId: S.String.pipe(T.HttpLabel("accessSourceId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/access-sources/{accessSourceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAccessTokenInput extends S.Class<CreateAccessTokenInput>(
  "CreateAccessTokenInput",
)(
  {
    clientToken: S.optional(S.String),
    dnsViewId: S.String.pipe(T.HttpLabel("dnsViewId")),
    expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    name: S.optional(S.String),
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/tokens/{dnsViewId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAccessTokenInput extends S.Class<GetAccessTokenInput>(
  "GetAccessTokenInput",
)(
  { accessTokenId: S.String.pipe(T.HttpLabel("accessTokenId")) },
  T.all(
    T.Http({ method: "GET", uri: "/tokens/{accessTokenId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAccessTokenInput extends S.Class<UpdateAccessTokenInput>(
  "UpdateAccessTokenInput",
)(
  {
    accessTokenId: S.String.pipe(T.HttpLabel("accessTokenId")),
    name: S.String,
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/tokens/{accessTokenId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAccessTokenInput extends S.Class<DeleteAccessTokenInput>(
  "DeleteAccessTokenInput",
)(
  { accessTokenId: S.String.pipe(T.HttpLabel("accessTokenId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/tokens/{accessTokenId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const Strings = S.Array(S.String);
export const Filters = S.Record({ key: S.String, value: Strings });
export class ListAccessTokensInput extends S.Class<ListAccessTokensInput>(
  "ListAccessTokensInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
    dnsViewId: S.String.pipe(T.HttpLabel("dnsViewId")),
    filters: S.optional(Filters).pipe(T.HttpQueryParams()),
  },
  T.all(
    T.Http({ method: "GET", uri: "/tokens/dns-view/{dnsViewId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDNSViewInput extends S.Class<CreateDNSViewInput>(
  "CreateDNSViewInput",
)(
  {
    globalResolverId: S.String.pipe(T.HttpLabel("globalResolverId")),
    clientToken: S.optional(S.String),
    name: S.String,
    dnssecValidation: S.optional(S.String),
    ednsClientSubnet: S.optional(S.String),
    firewallRulesFailOpen: S.optional(S.String),
    description: S.optional(S.String),
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/dns-views/{globalResolverId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDNSViewInput extends S.Class<GetDNSViewInput>(
  "GetDNSViewInput",
)(
  { dnsViewId: S.String.pipe(T.HttpLabel("dnsViewId")) },
  T.all(
    T.Http({ method: "GET", uri: "/dns-views/{dnsViewId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDNSViewInput extends S.Class<UpdateDNSViewInput>(
  "UpdateDNSViewInput",
)(
  {
    dnsViewId: S.String.pipe(T.HttpLabel("dnsViewId")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    dnssecValidation: S.optional(S.String),
    ednsClientSubnet: S.optional(S.String),
    firewallRulesFailOpen: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/dns-views/{dnsViewId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDNSViewInput extends S.Class<DeleteDNSViewInput>(
  "DeleteDNSViewInput",
)(
  { dnsViewId: S.String.pipe(T.HttpLabel("dnsViewId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/dns-views/{dnsViewId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDNSViewsInput extends S.Class<ListDNSViewsInput>(
  "ListDNSViewsInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
    globalResolverId: S.String.pipe(T.HttpLabel("globalResolverId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/dns-views/resolver/{globalResolverId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisableDNSViewInput extends S.Class<DisableDNSViewInput>(
  "DisableDNSViewInput",
)(
  { dnsViewId: S.String.pipe(T.HttpLabel("dnsViewId")) },
  T.all(
    T.Http({ method: "PATCH", uri: "/dns-views/{dnsViewId}/disable" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EnableDNSViewInput extends S.Class<EnableDNSViewInput>(
  "EnableDNSViewInput",
)(
  { dnsViewId: S.String.pipe(T.HttpLabel("dnsViewId")) },
  T.all(
    T.Http({ method: "PATCH", uri: "/dns-views/{dnsViewId}/enable" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFirewallDomainListInput extends S.Class<CreateFirewallDomainListInput>(
  "CreateFirewallDomainListInput",
)(
  {
    clientToken: S.optional(S.String),
    globalResolverId: S.String.pipe(T.HttpLabel("globalResolverId")),
    description: S.optional(S.String),
    name: S.String,
    tags: S.optional(Tags),
  },
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
) {}
export class GetFirewallDomainListInput extends S.Class<GetFirewallDomainListInput>(
  "GetFirewallDomainListInput",
)(
  { firewallDomainListId: S.String.pipe(T.HttpLabel("firewallDomainListId")) },
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
) {}
export class DeleteFirewallDomainListInput extends S.Class<DeleteFirewallDomainListInput>(
  "DeleteFirewallDomainListInput",
)(
  { firewallDomainListId: S.String.pipe(T.HttpLabel("firewallDomainListId")) },
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
) {}
export class ListFirewallDomainListsInput extends S.Class<ListFirewallDomainListsInput>(
  "ListFirewallDomainListsInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
    globalResolverId: S.optional(S.String).pipe(
      T.HttpQuery("global_resolver_id"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/firewall-domain-lists" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ImportFirewallDomainsInput extends S.Class<ImportFirewallDomainsInput>(
  "ImportFirewallDomainsInput",
)(
  {
    domainFileUrl: S.String,
    firewallDomainListId: S.String.pipe(T.HttpLabel("firewallDomainListId")),
    operation: S.String,
  },
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
) {}
export class ListFirewallDomainsInput extends S.Class<ListFirewallDomainsInput>(
  "ListFirewallDomainsInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
    firewallDomainListId: S.String.pipe(T.HttpLabel("firewallDomainListId")),
  },
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
) {}
export class UpdateFirewallDomainsInput extends S.Class<UpdateFirewallDomainsInput>(
  "UpdateFirewallDomainsInput",
)(
  {
    domains: Domains,
    firewallDomainListId: S.String.pipe(T.HttpLabel("firewallDomainListId")),
    operation: S.String,
  },
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
) {}
export class CreateFirewallRuleInput extends S.Class<CreateFirewallRuleInput>(
  "CreateFirewallRuleInput",
)(
  {
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
  },
  T.all(
    T.Http({ method: "POST", uri: "/firewall-rules" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFirewallRuleInput extends S.Class<GetFirewallRuleInput>(
  "GetFirewallRuleInput",
)(
  { firewallRuleId: S.String.pipe(T.HttpLabel("firewallRuleId")) },
  T.all(
    T.Http({ method: "GET", uri: "/firewall-rules/{firewallRuleId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateFirewallRuleInput extends S.Class<UpdateFirewallRuleInput>(
  "UpdateFirewallRuleInput",
)(
  {
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
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/firewall-rules/{firewallRuleId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFirewallRuleInput extends S.Class<DeleteFirewallRuleInput>(
  "DeleteFirewallRuleInput",
)(
  { firewallRuleId: S.String.pipe(T.HttpLabel("firewallRuleId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/firewall-rules/{firewallRuleId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFirewallRulesInput extends S.Class<ListFirewallRulesInput>(
  "ListFirewallRulesInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
    dnsViewId: S.String.pipe(T.HttpQuery("dnsview_id")),
    filters: S.optional(Filters).pipe(T.HttpQueryParams()),
  },
  T.all(
    T.Http({ method: "GET", uri: "/firewall-rules" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateGlobalResolverInput extends S.Class<CreateGlobalResolverInput>(
  "CreateGlobalResolverInput",
)(
  {
    clientToken: S.optional(S.String),
    description: S.optional(S.String),
    name: S.String,
    observabilityRegion: S.optional(S.String),
    regions: Regions,
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/global-resolver" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetGlobalResolverInput extends S.Class<GetGlobalResolverInput>(
  "GetGlobalResolverInput",
)(
  { globalResolverId: S.String.pipe(T.HttpLabel("globalResolverId")) },
  T.all(
    T.Http({ method: "GET", uri: "/global-resolver/{globalResolverId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateGlobalResolverInput extends S.Class<UpdateGlobalResolverInput>(
  "UpdateGlobalResolverInput",
)(
  {
    globalResolverId: S.String.pipe(T.HttpLabel("globalResolverId")),
    name: S.optional(S.String),
    observabilityRegion: S.optional(S.String),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/global-resolver/{globalResolverId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGlobalResolverInput extends S.Class<DeleteGlobalResolverInput>(
  "DeleteGlobalResolverInput",
)(
  { globalResolverId: S.String.pipe(T.HttpLabel("globalResolverId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/global-resolver/{globalResolverId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGlobalResolversInput extends S.Class<ListGlobalResolversInput>(
  "ListGlobalResolversInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/global-resolver" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateHostedZoneInput extends S.Class<AssociateHostedZoneInput>(
  "AssociateHostedZoneInput",
)(
  {
    hostedZoneId: S.String.pipe(T.HttpLabel("hostedZoneId")),
    resourceArn: S.String,
    name: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/hosted-zone-associations/{hostedZoneId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetHostedZoneAssociationInput extends S.Class<GetHostedZoneAssociationInput>(
  "GetHostedZoneAssociationInput",
)(
  {
    hostedZoneAssociationId: S.String.pipe(
      T.HttpLabel("hostedZoneAssociationId"),
    ),
  },
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
) {}
export class UpdateHostedZoneAssociationInput extends S.Class<UpdateHostedZoneAssociationInput>(
  "UpdateHostedZoneAssociationInput",
)(
  {
    hostedZoneAssociationId: S.String.pipe(
      T.HttpLabel("hostedZoneAssociationId"),
    ),
    name: S.optional(S.String),
  },
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
) {}
export class ListHostedZoneAssociationsInput extends S.Class<ListHostedZoneAssociationsInput>(
  "ListHostedZoneAssociationsInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
  },
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
) {}
export class GetManagedFirewallDomainListInput extends S.Class<GetManagedFirewallDomainListInput>(
  "GetManagedFirewallDomainListInput",
)(
  {
    managedFirewallDomainListId: S.String.pipe(
      T.HttpLabel("managedFirewallDomainListId"),
    ),
  },
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
) {}
export class ListManagedFirewallDomainListsInput extends S.Class<ListManagedFirewallDomainListsInput>(
  "ListManagedFirewallDomainListsInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
    managedFirewallDomainListType: S.String.pipe(
      T.HttpLabel("managedFirewallDomainListType"),
    ),
  },
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
) {}
export class BatchCreateFirewallRuleInputItem extends S.Class<BatchCreateFirewallRuleInputItem>(
  "BatchCreateFirewallRuleInputItem",
)({
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
}) {}
export const BatchCreateFirewallRuleInputItems = S.Array(
  BatchCreateFirewallRuleInputItem,
);
export class BatchDeleteFirewallRuleInputItem extends S.Class<BatchDeleteFirewallRuleInputItem>(
  "BatchDeleteFirewallRuleInputItem",
)({ firewallRuleId: S.String }) {}
export const BatchDeleteFirewallRuleInputItems = S.Array(
  BatchDeleteFirewallRuleInputItem,
);
export class BatchUpdateFirewallRuleInputItem extends S.Class<BatchUpdateFirewallRuleInputItem>(
  "BatchUpdateFirewallRuleInputItem",
)({
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
}) {}
export const BatchUpdateFirewallRuleInputItems = S.Array(
  BatchUpdateFirewallRuleInputItem,
);
export const IPv4Addresses = S.Array(S.String);
export class DisassociateHostedZoneOutput extends S.Class<DisassociateHostedZoneOutput>(
  "DisassociateHostedZoneOutput",
)({
  id: S.String,
  resourceArn: S.String,
  hostedZoneId: S.String,
  hostedZoneName: S.String,
  name: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(Tags) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String, tags: Tags },
  T.all(
    T.Http({ method: "POST", uri: "/tag-resource" }),
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
export class CreateAccessSourceOutput extends S.Class<CreateAccessSourceOutput>(
  "CreateAccessSourceOutput",
)({
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
}) {}
export class GetAccessSourceOutput extends S.Class<GetAccessSourceOutput>(
  "GetAccessSourceOutput",
)({
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
}) {}
export class UpdateAccessSourceOutput extends S.Class<UpdateAccessSourceOutput>(
  "UpdateAccessSourceOutput",
)({
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
}) {}
export class DeleteAccessSourceOutput extends S.Class<DeleteAccessSourceOutput>(
  "DeleteAccessSourceOutput",
)({
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
}) {}
export class ListAccessSourcesInput extends S.Class<ListAccessSourcesInput>(
  "ListAccessSourcesInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
    filters: S.optional(Filters).pipe(T.HttpQueryParams()),
  },
  T.all(
    T.Http({ method: "GET", uri: "/access-sources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAccessTokenOutput extends S.Class<CreateAccessTokenOutput>(
  "CreateAccessTokenOutput",
)({
  id: S.String,
  arn: S.String,
  clientToken: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  dnsViewId: S.String,
  expiresAt: S.Date.pipe(T.TimestampFormat("date-time")),
  name: S.optional(S.String),
  status: S.String,
  value: S.String,
}) {}
export class GetAccessTokenOutput extends S.Class<GetAccessTokenOutput>(
  "GetAccessTokenOutput",
)({
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
  value: S.String,
}) {}
export class UpdateAccessTokenOutput extends S.Class<UpdateAccessTokenOutput>(
  "UpdateAccessTokenOutput",
)({ id: S.String, name: S.String }) {}
export class DeleteAccessTokenOutput extends S.Class<DeleteAccessTokenOutput>(
  "DeleteAccessTokenOutput",
)({
  id: S.String,
  status: S.String,
  deletedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class CreateDNSViewOutput extends S.Class<CreateDNSViewOutput>(
  "CreateDNSViewOutput",
)({
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
}) {}
export class GetDNSViewOutput extends S.Class<GetDNSViewOutput>(
  "GetDNSViewOutput",
)({
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
}) {}
export class UpdateDNSViewOutput extends S.Class<UpdateDNSViewOutput>(
  "UpdateDNSViewOutput",
)({
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
}) {}
export class DeleteDNSViewOutput extends S.Class<DeleteDNSViewOutput>(
  "DeleteDNSViewOutput",
)({
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
}) {}
export class DisableDNSViewOutput extends S.Class<DisableDNSViewOutput>(
  "DisableDNSViewOutput",
)({
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
}) {}
export class EnableDNSViewOutput extends S.Class<EnableDNSViewOutput>(
  "EnableDNSViewOutput",
)({
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
}) {}
export class CreateFirewallDomainListOutput extends S.Class<CreateFirewallDomainListOutput>(
  "CreateFirewallDomainListOutput",
)({
  arn: S.String,
  globalResolverId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  description: S.optional(S.String),
  domainCount: S.Number,
  id: S.String,
  name: S.String,
  status: S.String,
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class GetFirewallDomainListOutput extends S.Class<GetFirewallDomainListOutput>(
  "GetFirewallDomainListOutput",
)({
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
}) {}
export class DeleteFirewallDomainListOutput extends S.Class<DeleteFirewallDomainListOutput>(
  "DeleteFirewallDomainListOutput",
)({ arn: S.String, id: S.String, name: S.String, status: S.String }) {}
export class ImportFirewallDomainsOutput extends S.Class<ImportFirewallDomainsOutput>(
  "ImportFirewallDomainsOutput",
)({ id: S.String, name: S.String, status: S.String }) {}
export class ListFirewallDomainsOutput extends S.Class<ListFirewallDomainsOutput>(
  "ListFirewallDomainsOutput",
)({ nextToken: S.optional(S.String), domains: Domains }) {}
export class UpdateFirewallDomainsOutput extends S.Class<UpdateFirewallDomainsOutput>(
  "UpdateFirewallDomainsOutput",
)({ id: S.String, name: S.String, status: S.String }) {}
export class CreateFirewallRuleOutput extends S.Class<CreateFirewallRuleOutput>(
  "CreateFirewallRuleOutput",
)({
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
}) {}
export class GetFirewallRuleOutput extends S.Class<GetFirewallRuleOutput>(
  "GetFirewallRuleOutput",
)({
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
}) {}
export class UpdateFirewallRuleOutput extends S.Class<UpdateFirewallRuleOutput>(
  "UpdateFirewallRuleOutput",
)({
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
}) {}
export class DeleteFirewallRuleOutput extends S.Class<DeleteFirewallRuleOutput>(
  "DeleteFirewallRuleOutput",
)({
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
}) {}
export class BatchCreateFirewallRuleInput extends S.Class<BatchCreateFirewallRuleInput>(
  "BatchCreateFirewallRuleInput",
)(
  { firewallRules: BatchCreateFirewallRuleInputItems },
  T.all(
    T.Http({ method: "POST", uri: "/firewall-rules/batch-create" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchDeleteFirewallRuleInput extends S.Class<BatchDeleteFirewallRuleInput>(
  "BatchDeleteFirewallRuleInput",
)(
  { firewallRules: BatchDeleteFirewallRuleInputItems },
  T.all(
    T.Http({ method: "POST", uri: "/firewall-rules/batch-delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchUpdateFirewallRuleInput extends S.Class<BatchUpdateFirewallRuleInput>(
  "BatchUpdateFirewallRuleInput",
)(
  { firewallRules: BatchUpdateFirewallRuleInputItems },
  T.all(
    T.Http({ method: "POST", uri: "/firewall-rules/batch-update" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateGlobalResolverOutput extends S.Class<CreateGlobalResolverOutput>(
  "CreateGlobalResolverOutput",
)({
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
}) {}
export class GetGlobalResolverOutput extends S.Class<GetGlobalResolverOutput>(
  "GetGlobalResolverOutput",
)({
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
}) {}
export class UpdateGlobalResolverOutput extends S.Class<UpdateGlobalResolverOutput>(
  "UpdateGlobalResolverOutput",
)({
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
}) {}
export class DeleteGlobalResolverOutput extends S.Class<DeleteGlobalResolverOutput>(
  "DeleteGlobalResolverOutput",
)({
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
}) {}
export class AssociateHostedZoneOutput extends S.Class<AssociateHostedZoneOutput>(
  "AssociateHostedZoneOutput",
)({
  id: S.String,
  resourceArn: S.String,
  hostedZoneId: S.String,
  hostedZoneName: S.String,
  name: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
}) {}
export class GetHostedZoneAssociationOutput extends S.Class<GetHostedZoneAssociationOutput>(
  "GetHostedZoneAssociationOutput",
)({
  id: S.String,
  resourceArn: S.String,
  hostedZoneId: S.String,
  hostedZoneName: S.String,
  name: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
}) {}
export class UpdateHostedZoneAssociationOutput extends S.Class<UpdateHostedZoneAssociationOutput>(
  "UpdateHostedZoneAssociationOutput",
)({
  id: S.String,
  resourceArn: S.String,
  hostedZoneId: S.String,
  hostedZoneName: S.String,
  name: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
}) {}
export class GetManagedFirewallDomainListOutput extends S.Class<GetManagedFirewallDomainListOutput>(
  "GetManagedFirewallDomainListOutput",
)({
  description: S.optional(S.String),
  id: S.String,
  name: S.String,
  managedListType: S.String,
}) {}
export class AccessTokenItem extends S.Class<AccessTokenItem>(
  "AccessTokenItem",
)({
  id: S.String,
  arn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  dnsViewId: S.String,
  expiresAt: S.Date.pipe(T.TimestampFormat("date-time")),
  globalResolverId: S.String,
  name: S.optional(S.String),
  status: S.String,
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const AccessTokens = S.Array(AccessTokenItem);
export class DNSViewSummary extends S.Class<DNSViewSummary>("DNSViewSummary")({
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
}) {}
export const DNSViews = S.Array(DNSViewSummary);
export class FirewallDomainListsItem extends S.Class<FirewallDomainListsItem>(
  "FirewallDomainListsItem",
)({
  arn: S.String,
  globalResolverId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  description: S.optional(S.String),
  id: S.String,
  name: S.String,
  status: S.String,
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const FirewallDomainLists = S.Array(FirewallDomainListsItem);
export class FirewallRulesItem extends S.Class<FirewallRulesItem>(
  "FirewallRulesItem",
)({
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
}) {}
export const FirewallRules = S.Array(FirewallRulesItem);
export class GlobalResolversItem extends S.Class<GlobalResolversItem>(
  "GlobalResolversItem",
)({
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
}) {}
export const GlobalResolvers = S.Array(GlobalResolversItem);
export class HostedZoneAssociationSummary extends S.Class<HostedZoneAssociationSummary>(
  "HostedZoneAssociationSummary",
)({
  id: S.String,
  resourceArn: S.String,
  hostedZoneId: S.String,
  hostedZoneName: S.String,
  name: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
}) {}
export const HostedZoneAssociations = S.Array(HostedZoneAssociationSummary);
export class ManagedFirewallDomainListsItem extends S.Class<ManagedFirewallDomainListsItem>(
  "ManagedFirewallDomainListsItem",
)({
  description: S.optional(S.String),
  id: S.String,
  name: S.String,
  managedListType: S.String,
}) {}
export const ManagedFirewallDomainLists = S.Array(
  ManagedFirewallDomainListsItem,
);
export class ListAccessTokensOutput extends S.Class<ListAccessTokensOutput>(
  "ListAccessTokensOutput",
)({
  nextToken: S.optional(S.String),
  accessTokens: S.optional(AccessTokens),
}) {}
export class ListDNSViewsOutput extends S.Class<ListDNSViewsOutput>(
  "ListDNSViewsOutput",
)({ nextToken: S.optional(S.String), dnsViews: DNSViews }) {}
export class ListFirewallDomainListsOutput extends S.Class<ListFirewallDomainListsOutput>(
  "ListFirewallDomainListsOutput",
)({
  nextToken: S.optional(S.String),
  firewallDomainLists: FirewallDomainLists,
}) {}
export class ListFirewallRulesOutput extends S.Class<ListFirewallRulesOutput>(
  "ListFirewallRulesOutput",
)({ nextToken: S.optional(S.String), firewallRules: FirewallRules }) {}
export class ListGlobalResolversOutput extends S.Class<ListGlobalResolversOutput>(
  "ListGlobalResolversOutput",
)({ nextToken: S.optional(S.String), globalResolvers: GlobalResolvers }) {}
export class ListHostedZoneAssociationsOutput extends S.Class<ListHostedZoneAssociationsOutput>(
  "ListHostedZoneAssociationsOutput",
)({
  nextToken: S.optional(S.String),
  hostedZoneAssociations: HostedZoneAssociations,
}) {}
export class ListManagedFirewallDomainListsOutput extends S.Class<ListManagedFirewallDomainListsOutput>(
  "ListManagedFirewallDomainListsOutput",
)({
  nextToken: S.optional(S.String),
  managedFirewallDomainLists: ManagedFirewallDomainLists,
}) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class AccessSourcesItem extends S.Class<AccessSourcesItem>(
  "AccessSourcesItem",
)({
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
}) {}
export const AccessSources = S.Array(AccessSourcesItem);
export class ListAccessSourcesOutput extends S.Class<ListAccessSourcesOutput>(
  "ListAccessSourcesOutput",
)({ nextToken: S.optional(S.String), accessSources: AccessSources }) {}
export class BatchCreateFirewallRuleResult extends S.Class<BatchCreateFirewallRuleResult>(
  "BatchCreateFirewallRuleResult",
)({
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
}) {}
export class BatchDeleteFirewallRuleResult extends S.Class<BatchDeleteFirewallRuleResult>(
  "BatchDeleteFirewallRuleResult",
)({
  clientToken: S.optional(S.String),
  id: S.String,
  name: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export class BatchUpdateFirewallRuleResult extends S.Class<BatchUpdateFirewallRuleResult>(
  "BatchUpdateFirewallRuleResult",
)({
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
}) {}
export class BatchCreateFirewallRuleOutputItem extends S.Class<BatchCreateFirewallRuleOutputItem>(
  "BatchCreateFirewallRuleOutputItem",
)({
  firewallRule: BatchCreateFirewallRuleResult,
  code: S.Number,
  message: S.optional(S.String),
}) {}
export const BatchCreateFirewallRuleOutputItems = S.Array(
  BatchCreateFirewallRuleOutputItem,
);
export class BatchDeleteFirewallRuleOutputItem extends S.Class<BatchDeleteFirewallRuleOutputItem>(
  "BatchDeleteFirewallRuleOutputItem",
)({
  firewallRule: BatchDeleteFirewallRuleResult,
  code: S.Number,
  message: S.optional(S.String),
}) {}
export const BatchDeleteFirewallRuleOutputItems = S.Array(
  BatchDeleteFirewallRuleOutputItem,
);
export class BatchUpdateFirewallRuleOutputItem extends S.Class<BatchUpdateFirewallRuleOutputItem>(
  "BatchUpdateFirewallRuleOutputItem",
)({
  firewallRule: BatchUpdateFirewallRuleResult,
  code: S.Number,
  message: S.optional(S.String),
}) {}
export const BatchUpdateFirewallRuleOutputItems = S.Array(
  BatchUpdateFirewallRuleOutputItem,
);
export class BatchCreateFirewallRuleOutput extends S.Class<BatchCreateFirewallRuleOutput>(
  "BatchCreateFirewallRuleOutput",
)({
  failures: BatchCreateFirewallRuleOutputItems,
  successes: BatchCreateFirewallRuleOutputItems,
}) {}
export class BatchDeleteFirewallRuleOutput extends S.Class<BatchDeleteFirewallRuleOutput>(
  "BatchDeleteFirewallRuleOutput",
)({
  failures: BatchDeleteFirewallRuleOutputItems,
  successes: BatchDeleteFirewallRuleOutputItems,
}) {}
export class BatchUpdateFirewallRuleOutput extends S.Class<BatchUpdateFirewallRuleOutput>(
  "BatchUpdateFirewallRuleOutput",
)({
  failures: BatchUpdateFirewallRuleOutputItems,
  successes: BatchUpdateFirewallRuleOutputItems,
}) {}

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.String,
  },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.String,
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}

//# Operations
/**
 * Lists the tags associated with a Route 53 Global Resolver resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Removes tags from a Route 53 Global Resolver resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Adds or updates tags for a Route 53 Global Resolver resource. Tags are key-value pairs that help you organize and identify your resources.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAccessTokens = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Creates multiple DNS firewall rules in a single operation. This is more efficient than creating rules individually when you need to set up multiple rules at once.
 */
export const batchCreateFirewallRule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchCreateFirewallRuleInput,
    output: BatchCreateFirewallRuleOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes multiple DNS firewall rules in a single operation. This is more efficient than deleting rules individually.
 */
export const batchDeleteFirewallRule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchDeleteFirewallRuleInput,
    output: BatchDeleteFirewallRuleOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates multiple DNS firewall rules in a single operation. This is more efficient than updating rules individually.
 */
export const batchUpdateFirewallRule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchUpdateFirewallRuleInput,
    output: BatchUpdateFirewallRuleOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates an access source for a DNS view. Access sources define IP addresses or CIDR ranges that are allowed to send DNS queries to the Route 53 Global Resolver, along with the permitted DNS protocols.
 */
export const createAccessSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateAccessSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteAccessSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createAccessToken = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateAccessToken = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDNSView = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateDNSView = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteDNSView = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disableDNSView = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const enableDNSView = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createFirewallDomainList = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Deletes a firewall domain list. This operation cannot be undone.
 */
export const deleteFirewallDomainList = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Imports a list of domains from an Amazon S3 file into a firewall domain list. The file should contain one domain per line.
 */
export const importFirewallDomains = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates a DNS Firewall domain list from an array of specified domains.
 */
export const updateFirewallDomains = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates a DNS firewall rule. Firewall rules define actions (ALLOW, BLOCK, or ALERT) to take on DNS queries that match specified domain lists, managed domain lists, or advanced threat protections.
 */
export const createFirewallRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateFirewallRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteFirewallRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createGlobalResolver = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates the configuration of a Route 53 Global Resolver instance. You can modify the name, description, and observability region.
 */
export const updateGlobalResolver = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Deletes a Route 53 Global Resolver instance. This operation cannot be undone. All associated DNS views, access sources, tokens, and firewall rules are also deleted.
 */
export const deleteGlobalResolver = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Associates a Route 53 private hosted zone with a Route 53 Global Resolver resource. This allows the resolver to resolve DNS queries for the private hosted zone from anywhere globally.
 */
export const associateHostedZone = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateHostedZoneAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Lists all DNS views for a Route 53 Global Resolver with pagination support.
 */
export const listDNSViews = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Lists all firewall domain lists for a Route 53 Global Resolver with pagination support.
 */
export const listFirewallDomainLists =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listFirewallRules = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Lists all Route 53 Global Resolver instances in your account with pagination support.
 */
export const listGlobalResolvers =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listHostedZoneAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listManagedFirewallDomainLists =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getAccessSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getAccessToken = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteAccessToken = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDNSView = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getFirewallDomainList = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetFirewallDomainListInput,
    output: GetFirewallDomainListOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists all the domains in DNS Firewall domain list you have created.
 */
export const listFirewallDomains =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getFirewallRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getGlobalResolver = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getHostedZoneAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetHostedZoneAssociationInput,
    output: GetHostedZoneAssociationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves information about an AWS-managed firewall domain list. Managed domain lists contain domains associated with malicious activity, content categories, or specific threats.
 */
export const getManagedFirewallDomainList =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateHostedZone = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Lists all access sources with pagination support.
 */
export const listAccessSources = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
