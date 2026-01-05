import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Route53Resolver",
  serviceShapeName: "Route53Resolver",
});
const auth = T.AwsAuthSigv4({ name: "route53resolver" });
const ver = T.ServiceVersion("2018-04-01");
const proto = T.AwsProtocolsAwsJson1_1();
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
                        url: "https://route53resolver-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                          argv: [{ ref: "Region" }, "us-gov-east-1"],
                        },
                      ],
                      endpoint: {
                        url: "https://route53resolver.us-gov-east-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "Region" }, "us-gov-west-1"],
                        },
                      ],
                      endpoint: {
                        url: "https://route53resolver.us-gov-west-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://route53resolver-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://route53resolver.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://route53resolver.{Region}.{PartitionResult#dnsSuffix}",
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
export const SecurityGroupIds = S.Array(S.String);
export const ProtocolList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export const FirewallDomains = S.Array(S.String);
export class AssociateResolverQueryLogConfigRequest extends S.Class<AssociateResolverQueryLogConfigRequest>(
  "AssociateResolverQueryLogConfigRequest",
)(
  { ResolverQueryLogConfigId: S.String, ResourceId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateResolverRuleRequest extends S.Class<AssociateResolverRuleRequest>(
  "AssociateResolverRuleRequest",
)(
  { ResolverRuleId: S.String, Name: S.optional(S.String), VPCId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateFirewallDomainListRequest extends S.Class<CreateFirewallDomainListRequest>(
  "CreateFirewallDomainListRequest",
)(
  { CreatorRequestId: S.String, Name: S.String, Tags: S.optional(TagList) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateFirewallRuleRequest extends S.Class<CreateFirewallRuleRequest>(
  "CreateFirewallRuleRequest",
)(
  {
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
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateFirewallRuleGroupRequest extends S.Class<CreateFirewallRuleGroupRequest>(
  "CreateFirewallRuleGroupRequest",
)(
  { CreatorRequestId: S.String, Name: S.String, Tags: S.optional(TagList) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateOutpostResolverRequest extends S.Class<CreateOutpostResolverRequest>(
  "CreateOutpostResolverRequest",
)(
  {
    CreatorRequestId: S.String,
    Name: S.String,
    InstanceCount: S.optional(S.Number),
    PreferredInstanceType: S.String,
    OutpostArn: S.String,
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateResolverQueryLogConfigRequest extends S.Class<CreateResolverQueryLogConfigRequest>(
  "CreateResolverQueryLogConfigRequest",
)(
  {
    Name: S.String,
    DestinationArn: S.String,
    CreatorRequestId: S.String,
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteFirewallDomainListRequest extends S.Class<DeleteFirewallDomainListRequest>(
  "DeleteFirewallDomainListRequest",
)(
  { FirewallDomainListId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteFirewallRuleRequest extends S.Class<DeleteFirewallRuleRequest>(
  "DeleteFirewallRuleRequest",
)(
  {
    FirewallRuleGroupId: S.String,
    FirewallDomainListId: S.optional(S.String),
    FirewallThreatProtectionId: S.optional(S.String),
    Qtype: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteFirewallRuleGroupRequest extends S.Class<DeleteFirewallRuleGroupRequest>(
  "DeleteFirewallRuleGroupRequest",
)(
  { FirewallRuleGroupId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteOutpostResolverRequest extends S.Class<DeleteOutpostResolverRequest>(
  "DeleteOutpostResolverRequest",
)(
  { Id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteResolverEndpointRequest extends S.Class<DeleteResolverEndpointRequest>(
  "DeleteResolverEndpointRequest",
)(
  { ResolverEndpointId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteResolverQueryLogConfigRequest extends S.Class<DeleteResolverQueryLogConfigRequest>(
  "DeleteResolverQueryLogConfigRequest",
)(
  { ResolverQueryLogConfigId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteResolverRuleRequest extends S.Class<DeleteResolverRuleRequest>(
  "DeleteResolverRuleRequest",
)(
  { ResolverRuleId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateFirewallRuleGroupRequest extends S.Class<DisassociateFirewallRuleGroupRequest>(
  "DisassociateFirewallRuleGroupRequest",
)(
  { FirewallRuleGroupAssociationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class IpAddressUpdate extends S.Class<IpAddressUpdate>(
  "IpAddressUpdate",
)({
  IpId: S.optional(S.String),
  SubnetId: S.optional(S.String),
  Ip: S.optional(S.String),
  Ipv6: S.optional(S.String),
}) {}
export class DisassociateResolverEndpointIpAddressRequest extends S.Class<DisassociateResolverEndpointIpAddressRequest>(
  "DisassociateResolverEndpointIpAddressRequest",
)(
  { ResolverEndpointId: S.String, IpAddress: IpAddressUpdate },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateResolverQueryLogConfigRequest extends S.Class<DisassociateResolverQueryLogConfigRequest>(
  "DisassociateResolverQueryLogConfigRequest",
)(
  { ResolverQueryLogConfigId: S.String, ResourceId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateResolverRuleRequest extends S.Class<DisassociateResolverRuleRequest>(
  "DisassociateResolverRuleRequest",
)(
  { VPCId: S.String, ResolverRuleId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetFirewallConfigRequest extends S.Class<GetFirewallConfigRequest>(
  "GetFirewallConfigRequest",
)(
  { ResourceId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetFirewallDomainListRequest extends S.Class<GetFirewallDomainListRequest>(
  "GetFirewallDomainListRequest",
)(
  { FirewallDomainListId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetFirewallRuleGroupRequest extends S.Class<GetFirewallRuleGroupRequest>(
  "GetFirewallRuleGroupRequest",
)(
  { FirewallRuleGroupId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetFirewallRuleGroupAssociationRequest extends S.Class<GetFirewallRuleGroupAssociationRequest>(
  "GetFirewallRuleGroupAssociationRequest",
)(
  { FirewallRuleGroupAssociationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetFirewallRuleGroupPolicyRequest extends S.Class<GetFirewallRuleGroupPolicyRequest>(
  "GetFirewallRuleGroupPolicyRequest",
)(
  { Arn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetOutpostResolverRequest extends S.Class<GetOutpostResolverRequest>(
  "GetOutpostResolverRequest",
)(
  { Id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResolverConfigRequest extends S.Class<GetResolverConfigRequest>(
  "GetResolverConfigRequest",
)(
  { ResourceId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResolverDnssecConfigRequest extends S.Class<GetResolverDnssecConfigRequest>(
  "GetResolverDnssecConfigRequest",
)(
  { ResourceId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResolverEndpointRequest extends S.Class<GetResolverEndpointRequest>(
  "GetResolverEndpointRequest",
)(
  { ResolverEndpointId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResolverQueryLogConfigRequest extends S.Class<GetResolverQueryLogConfigRequest>(
  "GetResolverQueryLogConfigRequest",
)(
  { ResolverQueryLogConfigId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResolverQueryLogConfigAssociationRequest extends S.Class<GetResolverQueryLogConfigAssociationRequest>(
  "GetResolverQueryLogConfigAssociationRequest",
)(
  { ResolverQueryLogConfigAssociationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResolverQueryLogConfigPolicyRequest extends S.Class<GetResolverQueryLogConfigPolicyRequest>(
  "GetResolverQueryLogConfigPolicyRequest",
)(
  { Arn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResolverRuleRequest extends S.Class<GetResolverRuleRequest>(
  "GetResolverRuleRequest",
)(
  { ResolverRuleId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResolverRuleAssociationRequest extends S.Class<GetResolverRuleAssociationRequest>(
  "GetResolverRuleAssociationRequest",
)(
  { ResolverRuleAssociationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResolverRulePolicyRequest extends S.Class<GetResolverRulePolicyRequest>(
  "GetResolverRulePolicyRequest",
)(
  { Arn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ImportFirewallDomainsRequest extends S.Class<ImportFirewallDomainsRequest>(
  "ImportFirewallDomainsRequest",
)(
  {
    FirewallDomainListId: S.String,
    Operation: S.String,
    DomainFileUrl: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFirewallConfigsRequest extends S.Class<ListFirewallConfigsRequest>(
  "ListFirewallConfigsRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFirewallDomainListsRequest extends S.Class<ListFirewallDomainListsRequest>(
  "ListFirewallDomainListsRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFirewallDomainsRequest extends S.Class<ListFirewallDomainsRequest>(
  "ListFirewallDomainsRequest",
)(
  {
    FirewallDomainListId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFirewallRuleGroupAssociationsRequest extends S.Class<ListFirewallRuleGroupAssociationsRequest>(
  "ListFirewallRuleGroupAssociationsRequest",
)(
  {
    FirewallRuleGroupId: S.optional(S.String),
    VpcId: S.optional(S.String),
    Priority: S.optional(S.Number),
    Status: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFirewallRuleGroupsRequest extends S.Class<ListFirewallRuleGroupsRequest>(
  "ListFirewallRuleGroupsRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFirewallRulesRequest extends S.Class<ListFirewallRulesRequest>(
  "ListFirewallRulesRequest",
)(
  {
    FirewallRuleGroupId: S.String,
    Priority: S.optional(S.Number),
    Action: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListOutpostResolversRequest extends S.Class<ListOutpostResolversRequest>(
  "ListOutpostResolversRequest",
)(
  {
    OutpostArn: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListResolverConfigsRequest extends S.Class<ListResolverConfigsRequest>(
  "ListResolverConfigsRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListResolverEndpointIpAddressesRequest extends S.Class<ListResolverEndpointIpAddressesRequest>(
  "ListResolverEndpointIpAddressesRequest",
)(
  {
    ResolverEndpointId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const FilterValues = S.Array(S.String);
export class Filter extends S.Class<Filter>("Filter")({
  Name: S.optional(S.String),
  Values: S.optional(FilterValues),
}) {}
export const Filters = S.Array(Filter);
export class ListResolverEndpointsRequest extends S.Class<ListResolverEndpointsRequest>(
  "ListResolverEndpointsRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(Filters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListResolverQueryLogConfigAssociationsRequest extends S.Class<ListResolverQueryLogConfigAssociationsRequest>(
  "ListResolverQueryLogConfigAssociationsRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(Filters),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListResolverQueryLogConfigsRequest extends S.Class<ListResolverQueryLogConfigsRequest>(
  "ListResolverQueryLogConfigsRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(Filters),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListResolverRuleAssociationsRequest extends S.Class<ListResolverRuleAssociationsRequest>(
  "ListResolverRuleAssociationsRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(Filters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListResolverRulesRequest extends S.Class<ListResolverRulesRequest>(
  "ListResolverRulesRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(Filters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  {
    ResourceArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutFirewallRuleGroupPolicyRequest extends S.Class<PutFirewallRuleGroupPolicyRequest>(
  "PutFirewallRuleGroupPolicyRequest",
)(
  { Arn: S.String, FirewallRuleGroupPolicy: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutResolverQueryLogConfigPolicyRequest extends S.Class<PutResolverQueryLogConfigPolicyRequest>(
  "PutResolverQueryLogConfigPolicyRequest",
)(
  { Arn: S.String, ResolverQueryLogConfigPolicy: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutResolverRulePolicyRequest extends S.Class<PutResolverRulePolicyRequest>(
  "PutResolverRulePolicyRequest",
)(
  { Arn: S.String, ResolverRulePolicy: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String, Tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceArn: S.String, TagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class UpdateFirewallConfigRequest extends S.Class<UpdateFirewallConfigRequest>(
  "UpdateFirewallConfigRequest",
)(
  { ResourceId: S.String, FirewallFailOpen: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateFirewallDomainsRequest extends S.Class<UpdateFirewallDomainsRequest>(
  "UpdateFirewallDomainsRequest",
)(
  {
    FirewallDomainListId: S.String,
    Operation: S.String,
    Domains: FirewallDomains,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateFirewallRuleRequest extends S.Class<UpdateFirewallRuleRequest>(
  "UpdateFirewallRuleRequest",
)(
  {
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
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateFirewallRuleGroupAssociationRequest extends S.Class<UpdateFirewallRuleGroupAssociationRequest>(
  "UpdateFirewallRuleGroupAssociationRequest",
)(
  {
    FirewallRuleGroupAssociationId: S.String,
    Priority: S.optional(S.Number),
    MutationProtection: S.optional(S.String),
    Name: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateOutpostResolverRequest extends S.Class<UpdateOutpostResolverRequest>(
  "UpdateOutpostResolverRequest",
)(
  {
    Id: S.String,
    Name: S.optional(S.String),
    InstanceCount: S.optional(S.Number),
    PreferredInstanceType: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateResolverConfigRequest extends S.Class<UpdateResolverConfigRequest>(
  "UpdateResolverConfigRequest",
)(
  { ResourceId: S.String, AutodefinedReverseFlag: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateResolverDnssecConfigRequest extends S.Class<UpdateResolverDnssecConfigRequest>(
  "UpdateResolverDnssecConfigRequest",
)(
  { ResourceId: S.String, Validation: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class IpAddressRequest extends S.Class<IpAddressRequest>(
  "IpAddressRequest",
)({
  SubnetId: S.String,
  Ip: S.optional(S.String),
  Ipv6: S.optional(S.String),
}) {}
export const IpAddressesRequest = S.Array(IpAddressRequest);
export class TargetAddress extends S.Class<TargetAddress>("TargetAddress")({
  Ip: S.optional(S.String),
  Port: S.optional(S.Number),
  Ipv6: S.optional(S.String),
  Protocol: S.optional(S.String),
  ServerNameIndication: S.optional(S.String),
}) {}
export const TargetList = S.Array(TargetAddress);
export class FirewallConfig extends S.Class<FirewallConfig>("FirewallConfig")({
  Id: S.optional(S.String),
  ResourceId: S.optional(S.String),
  OwnerId: S.optional(S.String),
  FirewallFailOpen: S.optional(S.String),
}) {}
export const FirewallConfigList = S.Array(FirewallConfig);
export class FirewallRuleGroupAssociation extends S.Class<FirewallRuleGroupAssociation>(
  "FirewallRuleGroupAssociation",
)({
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
}) {}
export const FirewallRuleGroupAssociations = S.Array(
  FirewallRuleGroupAssociation,
);
export class FirewallRule extends S.Class<FirewallRule>("FirewallRule")({
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
}) {}
export const FirewallRules = S.Array(FirewallRule);
export class OutpostResolver extends S.Class<OutpostResolver>(
  "OutpostResolver",
)({
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
}) {}
export const OutpostResolverList = S.Array(OutpostResolver);
export class ResolverConfig extends S.Class<ResolverConfig>("ResolverConfig")({
  Id: S.optional(S.String),
  ResourceId: S.optional(S.String),
  OwnerId: S.optional(S.String),
  AutodefinedReverse: S.optional(S.String),
}) {}
export const ResolverConfigList = S.Array(ResolverConfig);
export class ResolverEndpoint extends S.Class<ResolverEndpoint>(
  "ResolverEndpoint",
)({
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
}) {}
export const ResolverEndpoints = S.Array(ResolverEndpoint);
export class ResolverQueryLogConfigAssociation extends S.Class<ResolverQueryLogConfigAssociation>(
  "ResolverQueryLogConfigAssociation",
)({
  Id: S.optional(S.String),
  ResolverQueryLogConfigId: S.optional(S.String),
  ResourceId: S.optional(S.String),
  Status: S.optional(S.String),
  Error: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  CreationTime: S.optional(S.String),
}) {}
export const ResolverQueryLogConfigAssociationList = S.Array(
  ResolverQueryLogConfigAssociation,
);
export class ResolverQueryLogConfig extends S.Class<ResolverQueryLogConfig>(
  "ResolverQueryLogConfig",
)({
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
}) {}
export const ResolverQueryLogConfigList = S.Array(ResolverQueryLogConfig);
export class ResolverRuleAssociation extends S.Class<ResolverRuleAssociation>(
  "ResolverRuleAssociation",
)({
  Id: S.optional(S.String),
  ResolverRuleId: S.optional(S.String),
  Name: S.optional(S.String),
  VPCId: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
}) {}
export const ResolverRuleAssociations = S.Array(ResolverRuleAssociation);
export class ResolverRule extends S.Class<ResolverRule>("ResolverRule")({
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
}) {}
export const ResolverRules = S.Array(ResolverRule);
export class UpdateIpAddress extends S.Class<UpdateIpAddress>(
  "UpdateIpAddress",
)({ IpId: S.String, Ipv6: S.String }) {}
export const UpdateIpAddresses = S.Array(UpdateIpAddress);
export class ResolverRuleConfig extends S.Class<ResolverRuleConfig>(
  "ResolverRuleConfig",
)({
  Name: S.optional(S.String),
  TargetIps: S.optional(TargetList),
  ResolverEndpointId: S.optional(S.String),
}) {}
export class AssociateFirewallRuleGroupRequest extends S.Class<AssociateFirewallRuleGroupRequest>(
  "AssociateFirewallRuleGroupRequest",
)(
  {
    CreatorRequestId: S.String,
    FirewallRuleGroupId: S.String,
    VpcId: S.String,
    Priority: S.Number,
    Name: S.String,
    MutationProtection: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateResolverEndpointIpAddressRequest extends S.Class<AssociateResolverEndpointIpAddressRequest>(
  "AssociateResolverEndpointIpAddressRequest",
)(
  { ResolverEndpointId: S.String, IpAddress: IpAddressUpdate },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateResolverEndpointRequest extends S.Class<CreateResolverEndpointRequest>(
  "CreateResolverEndpointRequest",
)(
  {
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
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateResolverRuleRequest extends S.Class<CreateResolverRuleRequest>(
  "CreateResolverRuleRequest",
)(
  {
    CreatorRequestId: S.String,
    Name: S.optional(S.String),
    RuleType: S.String,
    DomainName: S.optional(S.String),
    TargetIps: S.optional(TargetList),
    ResolverEndpointId: S.optional(S.String),
    Tags: S.optional(TagList),
    DelegationRecord: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class FirewallDomainList extends S.Class<FirewallDomainList>(
  "FirewallDomainList",
)({
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
}) {}
export class DeleteFirewallDomainListResponse extends S.Class<DeleteFirewallDomainListResponse>(
  "DeleteFirewallDomainListResponse",
)({ FirewallDomainList: S.optional(FirewallDomainList) }) {}
export class DeleteFirewallRuleResponse extends S.Class<DeleteFirewallRuleResponse>(
  "DeleteFirewallRuleResponse",
)({ FirewallRule: S.optional(FirewallRule) }) {}
export class FirewallRuleGroup extends S.Class<FirewallRuleGroup>(
  "FirewallRuleGroup",
)({
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
}) {}
export class DeleteFirewallRuleGroupResponse extends S.Class<DeleteFirewallRuleGroupResponse>(
  "DeleteFirewallRuleGroupResponse",
)({ FirewallRuleGroup: S.optional(FirewallRuleGroup) }) {}
export class DeleteOutpostResolverResponse extends S.Class<DeleteOutpostResolverResponse>(
  "DeleteOutpostResolverResponse",
)({ OutpostResolver: S.optional(OutpostResolver) }) {}
export class DeleteResolverQueryLogConfigResponse extends S.Class<DeleteResolverQueryLogConfigResponse>(
  "DeleteResolverQueryLogConfigResponse",
)({ ResolverQueryLogConfig: S.optional(ResolverQueryLogConfig) }) {}
export class DisassociateResolverEndpointIpAddressResponse extends S.Class<DisassociateResolverEndpointIpAddressResponse>(
  "DisassociateResolverEndpointIpAddressResponse",
)({ ResolverEndpoint: S.optional(ResolverEndpoint) }) {}
export class DisassociateResolverQueryLogConfigResponse extends S.Class<DisassociateResolverQueryLogConfigResponse>(
  "DisassociateResolverQueryLogConfigResponse",
)({
  ResolverQueryLogConfigAssociation: S.optional(
    ResolverQueryLogConfigAssociation,
  ),
}) {}
export class DisassociateResolverRuleResponse extends S.Class<DisassociateResolverRuleResponse>(
  "DisassociateResolverRuleResponse",
)({ ResolverRuleAssociation: S.optional(ResolverRuleAssociation) }) {}
export class GetFirewallDomainListResponse extends S.Class<GetFirewallDomainListResponse>(
  "GetFirewallDomainListResponse",
)({ FirewallDomainList: S.optional(FirewallDomainList) }) {}
export class GetFirewallRuleGroupResponse extends S.Class<GetFirewallRuleGroupResponse>(
  "GetFirewallRuleGroupResponse",
)({ FirewallRuleGroup: S.optional(FirewallRuleGroup) }) {}
export class GetFirewallRuleGroupAssociationResponse extends S.Class<GetFirewallRuleGroupAssociationResponse>(
  "GetFirewallRuleGroupAssociationResponse",
)({ FirewallRuleGroupAssociation: S.optional(FirewallRuleGroupAssociation) }) {}
export class GetFirewallRuleGroupPolicyResponse extends S.Class<GetFirewallRuleGroupPolicyResponse>(
  "GetFirewallRuleGroupPolicyResponse",
)({ FirewallRuleGroupPolicy: S.optional(S.String) }) {}
export class GetOutpostResolverResponse extends S.Class<GetOutpostResolverResponse>(
  "GetOutpostResolverResponse",
)({ OutpostResolver: S.optional(OutpostResolver) }) {}
export class GetResolverEndpointResponse extends S.Class<GetResolverEndpointResponse>(
  "GetResolverEndpointResponse",
)({ ResolverEndpoint: S.optional(ResolverEndpoint) }) {}
export class GetResolverQueryLogConfigResponse extends S.Class<GetResolverQueryLogConfigResponse>(
  "GetResolverQueryLogConfigResponse",
)({ ResolverQueryLogConfig: S.optional(ResolverQueryLogConfig) }) {}
export class GetResolverQueryLogConfigAssociationResponse extends S.Class<GetResolverQueryLogConfigAssociationResponse>(
  "GetResolverQueryLogConfigAssociationResponse",
)({
  ResolverQueryLogConfigAssociation: S.optional(
    ResolverQueryLogConfigAssociation,
  ),
}) {}
export class GetResolverQueryLogConfigPolicyResponse extends S.Class<GetResolverQueryLogConfigPolicyResponse>(
  "GetResolverQueryLogConfigPolicyResponse",
)({ ResolverQueryLogConfigPolicy: S.optional(S.String) }) {}
export class GetResolverRuleResponse extends S.Class<GetResolverRuleResponse>(
  "GetResolverRuleResponse",
)({ ResolverRule: S.optional(ResolverRule) }) {}
export class GetResolverRuleAssociationResponse extends S.Class<GetResolverRuleAssociationResponse>(
  "GetResolverRuleAssociationResponse",
)({ ResolverRuleAssociation: S.optional(ResolverRuleAssociation) }) {}
export class GetResolverRulePolicyResponse extends S.Class<GetResolverRulePolicyResponse>(
  "GetResolverRulePolicyResponse",
)({ ResolverRulePolicy: S.optional(S.String) }) {}
export class ImportFirewallDomainsResponse extends S.Class<ImportFirewallDomainsResponse>(
  "ImportFirewallDomainsResponse",
)({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
}) {}
export class ListFirewallConfigsResponse extends S.Class<ListFirewallConfigsResponse>(
  "ListFirewallConfigsResponse",
)({
  NextToken: S.optional(S.String),
  FirewallConfigs: S.optional(FirewallConfigList),
}) {}
export class ListFirewallDomainsResponse extends S.Class<ListFirewallDomainsResponse>(
  "ListFirewallDomainsResponse",
)({ NextToken: S.optional(S.String), Domains: S.optional(FirewallDomains) }) {}
export class ListFirewallRuleGroupAssociationsResponse extends S.Class<ListFirewallRuleGroupAssociationsResponse>(
  "ListFirewallRuleGroupAssociationsResponse",
)({
  NextToken: S.optional(S.String),
  FirewallRuleGroupAssociations: S.optional(FirewallRuleGroupAssociations),
}) {}
export class ListFirewallRulesResponse extends S.Class<ListFirewallRulesResponse>(
  "ListFirewallRulesResponse",
)({
  NextToken: S.optional(S.String),
  FirewallRules: S.optional(FirewallRules),
}) {}
export class ListOutpostResolversResponse extends S.Class<ListOutpostResolversResponse>(
  "ListOutpostResolversResponse",
)({
  OutpostResolvers: S.optional(OutpostResolverList),
  NextToken: S.optional(S.String),
}) {}
export class ListResolverConfigsResponse extends S.Class<ListResolverConfigsResponse>(
  "ListResolverConfigsResponse",
)({
  NextToken: S.optional(S.String),
  ResolverConfigs: S.optional(ResolverConfigList),
}) {}
export class ListResolverDnssecConfigsRequest extends S.Class<ListResolverDnssecConfigsRequest>(
  "ListResolverDnssecConfigsRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(Filters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListResolverEndpointsResponse extends S.Class<ListResolverEndpointsResponse>(
  "ListResolverEndpointsResponse",
)({
  NextToken: S.optional(S.String),
  MaxResults: S.optional(S.Number),
  ResolverEndpoints: S.optional(ResolverEndpoints),
}) {}
export class ListResolverQueryLogConfigAssociationsResponse extends S.Class<ListResolverQueryLogConfigAssociationsResponse>(
  "ListResolverQueryLogConfigAssociationsResponse",
)({
  NextToken: S.optional(S.String),
  TotalCount: S.optional(S.Number),
  TotalFilteredCount: S.optional(S.Number),
  ResolverQueryLogConfigAssociations: S.optional(
    ResolverQueryLogConfigAssociationList,
  ),
}) {}
export class ListResolverQueryLogConfigsResponse extends S.Class<ListResolverQueryLogConfigsResponse>(
  "ListResolverQueryLogConfigsResponse",
)({
  NextToken: S.optional(S.String),
  TotalCount: S.optional(S.Number),
  TotalFilteredCount: S.optional(S.Number),
  ResolverQueryLogConfigs: S.optional(ResolverQueryLogConfigList),
}) {}
export class ListResolverRuleAssociationsResponse extends S.Class<ListResolverRuleAssociationsResponse>(
  "ListResolverRuleAssociationsResponse",
)({
  NextToken: S.optional(S.String),
  MaxResults: S.optional(S.Number),
  ResolverRuleAssociations: S.optional(ResolverRuleAssociations),
}) {}
export class ListResolverRulesResponse extends S.Class<ListResolverRulesResponse>(
  "ListResolverRulesResponse",
)({
  NextToken: S.optional(S.String),
  MaxResults: S.optional(S.Number),
  ResolverRules: S.optional(ResolverRules),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList), NextToken: S.optional(S.String) }) {}
export class PutFirewallRuleGroupPolicyResponse extends S.Class<PutFirewallRuleGroupPolicyResponse>(
  "PutFirewallRuleGroupPolicyResponse",
)({ ReturnValue: S.optional(S.Boolean) }) {}
export class PutResolverQueryLogConfigPolicyResponse extends S.Class<PutResolverQueryLogConfigPolicyResponse>(
  "PutResolverQueryLogConfigPolicyResponse",
)({ ReturnValue: S.optional(S.Boolean) }) {}
export class PutResolverRulePolicyResponse extends S.Class<PutResolverRulePolicyResponse>(
  "PutResolverRulePolicyResponse",
)({ ReturnValue: S.optional(S.Boolean) }) {}
export class UpdateFirewallConfigResponse extends S.Class<UpdateFirewallConfigResponse>(
  "UpdateFirewallConfigResponse",
)({ FirewallConfig: S.optional(FirewallConfig) }) {}
export class UpdateFirewallDomainsResponse extends S.Class<UpdateFirewallDomainsResponse>(
  "UpdateFirewallDomainsResponse",
)({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
}) {}
export class UpdateFirewallRuleResponse extends S.Class<UpdateFirewallRuleResponse>(
  "UpdateFirewallRuleResponse",
)({ FirewallRule: S.optional(FirewallRule) }) {}
export class UpdateFirewallRuleGroupAssociationResponse extends S.Class<UpdateFirewallRuleGroupAssociationResponse>(
  "UpdateFirewallRuleGroupAssociationResponse",
)({ FirewallRuleGroupAssociation: S.optional(FirewallRuleGroupAssociation) }) {}
export class UpdateOutpostResolverResponse extends S.Class<UpdateOutpostResolverResponse>(
  "UpdateOutpostResolverResponse",
)({ OutpostResolver: S.optional(OutpostResolver) }) {}
export class UpdateResolverConfigResponse extends S.Class<UpdateResolverConfigResponse>(
  "UpdateResolverConfigResponse",
)({ ResolverConfig: S.optional(ResolverConfig) }) {}
export class ResolverDnssecConfig extends S.Class<ResolverDnssecConfig>(
  "ResolverDnssecConfig",
)({
  Id: S.optional(S.String),
  OwnerId: S.optional(S.String),
  ResourceId: S.optional(S.String),
  ValidationStatus: S.optional(S.String),
}) {}
export class UpdateResolverDnssecConfigResponse extends S.Class<UpdateResolverDnssecConfigResponse>(
  "UpdateResolverDnssecConfigResponse",
)({ ResolverDNSSECConfig: S.optional(ResolverDnssecConfig) }) {}
export class UpdateResolverEndpointRequest extends S.Class<UpdateResolverEndpointRequest>(
  "UpdateResolverEndpointRequest",
)(
  {
    ResolverEndpointId: S.String,
    Name: S.optional(S.String),
    ResolverEndpointType: S.optional(S.String),
    UpdateIpAddresses: S.optional(UpdateIpAddresses),
    Protocols: S.optional(ProtocolList),
    RniEnhancedMetricsEnabled: S.optional(S.Boolean),
    TargetNameServerMetricsEnabled: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateResolverRuleRequest extends S.Class<UpdateResolverRuleRequest>(
  "UpdateResolverRuleRequest",
)(
  { ResolverRuleId: S.String, Config: ResolverRuleConfig },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class FirewallDomainListMetadata extends S.Class<FirewallDomainListMetadata>(
  "FirewallDomainListMetadata",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  CreatorRequestId: S.optional(S.String),
  ManagedOwnerName: S.optional(S.String),
}) {}
export const FirewallDomainListMetadataList = S.Array(
  FirewallDomainListMetadata,
);
export class FirewallRuleGroupMetadata extends S.Class<FirewallRuleGroupMetadata>(
  "FirewallRuleGroupMetadata",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  OwnerId: S.optional(S.String),
  CreatorRequestId: S.optional(S.String),
  ShareStatus: S.optional(S.String),
}) {}
export const FirewallRuleGroupMetadataList = S.Array(FirewallRuleGroupMetadata);
export const ResolverDnssecConfigList = S.Array(ResolverDnssecConfig);
export class IpAddressResponse extends S.Class<IpAddressResponse>(
  "IpAddressResponse",
)({
  IpId: S.optional(S.String),
  SubnetId: S.optional(S.String),
  Ip: S.optional(S.String),
  Ipv6: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  CreationTime: S.optional(S.String),
  ModificationTime: S.optional(S.String),
}) {}
export const IpAddressesResponse = S.Array(IpAddressResponse);
export class AssociateFirewallRuleGroupResponse extends S.Class<AssociateFirewallRuleGroupResponse>(
  "AssociateFirewallRuleGroupResponse",
)({ FirewallRuleGroupAssociation: S.optional(FirewallRuleGroupAssociation) }) {}
export class AssociateResolverEndpointIpAddressResponse extends S.Class<AssociateResolverEndpointIpAddressResponse>(
  "AssociateResolverEndpointIpAddressResponse",
)({ ResolverEndpoint: S.optional(ResolverEndpoint) }) {}
export class AssociateResolverQueryLogConfigResponse extends S.Class<AssociateResolverQueryLogConfigResponse>(
  "AssociateResolverQueryLogConfigResponse",
)({
  ResolverQueryLogConfigAssociation: S.optional(
    ResolverQueryLogConfigAssociation,
  ),
}) {}
export class AssociateResolverRuleResponse extends S.Class<AssociateResolverRuleResponse>(
  "AssociateResolverRuleResponse",
)({ ResolverRuleAssociation: S.optional(ResolverRuleAssociation) }) {}
export class CreateFirewallDomainListResponse extends S.Class<CreateFirewallDomainListResponse>(
  "CreateFirewallDomainListResponse",
)({ FirewallDomainList: S.optional(FirewallDomainList) }) {}
export class CreateFirewallRuleResponse extends S.Class<CreateFirewallRuleResponse>(
  "CreateFirewallRuleResponse",
)({ FirewallRule: S.optional(FirewallRule) }) {}
export class CreateFirewallRuleGroupResponse extends S.Class<CreateFirewallRuleGroupResponse>(
  "CreateFirewallRuleGroupResponse",
)({ FirewallRuleGroup: S.optional(FirewallRuleGroup) }) {}
export class CreateOutpostResolverResponse extends S.Class<CreateOutpostResolverResponse>(
  "CreateOutpostResolverResponse",
)({ OutpostResolver: S.optional(OutpostResolver) }) {}
export class CreateResolverEndpointResponse extends S.Class<CreateResolverEndpointResponse>(
  "CreateResolverEndpointResponse",
)({ ResolverEndpoint: S.optional(ResolverEndpoint) }) {}
export class CreateResolverQueryLogConfigResponse extends S.Class<CreateResolverQueryLogConfigResponse>(
  "CreateResolverQueryLogConfigResponse",
)({ ResolverQueryLogConfig: S.optional(ResolverQueryLogConfig) }) {}
export class CreateResolverRuleResponse extends S.Class<CreateResolverRuleResponse>(
  "CreateResolverRuleResponse",
)({ ResolverRule: S.optional(ResolverRule) }) {}
export class DeleteResolverEndpointResponse extends S.Class<DeleteResolverEndpointResponse>(
  "DeleteResolverEndpointResponse",
)({ ResolverEndpoint: S.optional(ResolverEndpoint) }) {}
export class DeleteResolverRuleResponse extends S.Class<DeleteResolverRuleResponse>(
  "DeleteResolverRuleResponse",
)({ ResolverRule: S.optional(ResolverRule) }) {}
export class DisassociateFirewallRuleGroupResponse extends S.Class<DisassociateFirewallRuleGroupResponse>(
  "DisassociateFirewallRuleGroupResponse",
)({ FirewallRuleGroupAssociation: S.optional(FirewallRuleGroupAssociation) }) {}
export class GetFirewallConfigResponse extends S.Class<GetFirewallConfigResponse>(
  "GetFirewallConfigResponse",
)({ FirewallConfig: S.optional(FirewallConfig) }) {}
export class GetResolverConfigResponse extends S.Class<GetResolverConfigResponse>(
  "GetResolverConfigResponse",
)({ ResolverConfig: S.optional(ResolverConfig) }) {}
export class GetResolverDnssecConfigResponse extends S.Class<GetResolverDnssecConfigResponse>(
  "GetResolverDnssecConfigResponse",
)({ ResolverDNSSECConfig: S.optional(ResolverDnssecConfig) }) {}
export class ListFirewallDomainListsResponse extends S.Class<ListFirewallDomainListsResponse>(
  "ListFirewallDomainListsResponse",
)({
  NextToken: S.optional(S.String),
  FirewallDomainLists: S.optional(FirewallDomainListMetadataList),
}) {}
export class ListFirewallRuleGroupsResponse extends S.Class<ListFirewallRuleGroupsResponse>(
  "ListFirewallRuleGroupsResponse",
)({
  NextToken: S.optional(S.String),
  FirewallRuleGroups: S.optional(FirewallRuleGroupMetadataList),
}) {}
export class ListResolverDnssecConfigsResponse extends S.Class<ListResolverDnssecConfigsResponse>(
  "ListResolverDnssecConfigsResponse",
)({
  NextToken: S.optional(S.String),
  ResolverDnssecConfigs: S.optional(ResolverDnssecConfigList),
}) {}
export class ListResolverEndpointIpAddressesResponse extends S.Class<ListResolverEndpointIpAddressesResponse>(
  "ListResolverEndpointIpAddressesResponse",
)({
  NextToken: S.optional(S.String),
  MaxResults: S.optional(S.Number),
  IpAddresses: S.optional(IpAddressesResponse),
}) {}
export class UpdateResolverEndpointResponse extends S.Class<UpdateResolverEndpointResponse>(
  "UpdateResolverEndpointResponse",
)({ ResolverEndpoint: S.optional(ResolverEndpoint) }) {}
export class UpdateResolverRuleResponse extends S.Class<UpdateResolverRuleResponse>(
  "UpdateResolverRuleResponse",
)({ ResolverRule: S.optional(ResolverRule) }) {}

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
export const getResolverRulePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetResolverRulePolicyRequest,
    output: GetResolverRulePolicyResponse,
    errors: [
      AccessDeniedException,
      InternalServiceErrorException,
      InvalidParameterException,
      UnknownResourceException,
    ],
  }),
);
/**
 * Specifies an Amazon Web Services account that you want to share a query logging configuration with, the query logging configuration that you want to share,
 * and the operations that you want the account to be able to perform on the configuration.
 */
export const putResolverQueryLogConfigPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getFirewallDomainList = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetFirewallDomainListRequest,
    output: GetFirewallDomainListResponse,
    errors: [
      AccessDeniedException,
      InternalServiceErrorException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Retrieves the specified firewall rule group.
 */
export const getFirewallRuleGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetFirewallRuleGroupRequest,
    output: GetFirewallRuleGroupResponse,
    errors: [
      AccessDeniedException,
      InternalServiceErrorException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Retrieves a firewall rule group association, which enables DNS filtering for a VPC with one rule group. A VPC can have more than one firewall rule group association, and a rule group can be associated with more than one VPC.
 */
export const getFirewallRuleGroupAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateResolverRule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateResolverRuleRequest,
    output: DisassociateResolverRuleResponse,
    errors: [
      InternalServiceErrorException,
      InvalidParameterException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Gets information about a specified Resolver endpoint, such as whether it's an inbound or an outbound Resolver endpoint, and the
 * current status of the endpoint.
 */
export const getResolverEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getResolverRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getResolverRuleAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetResolverRuleAssociationRequest,
    output: GetResolverRuleAssociationResponse,
    errors: [
      InternalServiceErrorException,
      InvalidParameterException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Gets the IP addresses for a specified Resolver endpoint.
 */
export const listResolverEndpointIpAddresses =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const deleteFirewallDomainList = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteFirewallDomainListRequest,
    output: DeleteFirewallDomainListResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServiceErrorException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes a Resolver rule. Before you can delete a Resolver rule, you must disassociate it from all the VPCs that you
 * associated the Resolver rule with. For more information, see
 * DisassociateResolverRule.
 */
export const deleteResolverRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateResolverEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const deleteResolverQueryLogConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateResolverQueryLogConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getResolverQueryLogConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Gets information about a specified association between a Resolver query logging configuration and an Amazon VPC. When you associate a VPC
 * with a query logging configuration, Resolver logs DNS queries that originate in that VPC.
 */
export const getResolverQueryLogConfigAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getResolverQueryLogConfigPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listResolverQueryLogConfigAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const updateResolverDnssecConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Lists all the Resolver endpoints that were created using the current Amazon Web Services account.
 */
export const listResolverEndpoints =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteResolverEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResolverEndpointRequest,
    output: DeleteResolverEndpointResponse,
    errors: [
      InternalServiceErrorException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Gets DNSSEC validation information for a specified resource.
 */
export const getResolverDnssecConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Lists the associations that were created between Resolver rules and VPCs using the current Amazon Web Services account.
 */
export const listResolverRuleAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listResolverRules = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Lists the tags that you associated with the specified resource.
 */
export const listTagsForResource =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listResolverDnssecConfigs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listResolverQueryLogConfigs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const putResolverRulePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutResolverRulePolicyRequest,
    output: PutResolverRulePolicyResponse,
    errors: [
      AccessDeniedException,
      InternalServiceErrorException,
      InvalidParameterException,
      InvalidPolicyDocument,
      UnknownResourceException,
    ],
  }),
);
/**
 * Retrieves the firewall domain lists that you have defined. For each firewall domain list, you can retrieve the domains that are defined for a list by calling ListFirewallDomains.
 *
 * A single call to this list operation might return only a partial list of the domain lists. For information, see `MaxResults`.
 */
export const listFirewallDomainLists =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateOutpostResolver = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates an empty firewall domain list for use in DNS Firewall rules. You can populate the domains for the new list with a file, using ImportFirewallDomains, or with domain strings, using UpdateFirewallDomains.
 */
export const createFirewallDomainList = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateFirewallDomainListRequest,
    output: CreateFirewallDomainListResponse,
    errors: [
      AccessDeniedException,
      InternalServiceErrorException,
      LimitExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Disassociates a FirewallRuleGroup from a VPC, to remove DNS filtering from the VPC.
 */
export const disassociateFirewallRuleGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteFirewallRuleGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Deletes a Resolver on the Outpost.
 */
export const deleteOutpostResolver = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const importFirewallDomains = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates the firewall domain list from an array of domain specifications.
 */
export const updateFirewallDomains = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates the specified firewall rule.
 */
export const updateFirewallRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateFirewallRuleGroupAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateFirewallRuleGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Deletes the specified firewall rule.
 */
export const deleteFirewallRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getFirewallRuleGroupPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetFirewallRuleGroupPolicyRequest,
    output: GetFirewallRuleGroupPolicyResponse,
    errors: [
      AccessDeniedException,
      InternalServiceErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets information about a specified Resolver on the Outpost, such as its instance count and
 * type, name, and the current status of the Resolver.
 */
export const getOutpostResolver = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listFirewallDomains =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listFirewallRules = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Lists all the Resolvers on Outposts that were created using the current Amazon Web Services account.
 */
export const listOutpostResolvers =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const putFirewallRuleGroupPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutFirewallRuleGroupPolicyRequest,
    output: PutFirewallRuleGroupPolicyResponse,
    errors: [
      AccessDeniedException,
      InternalServiceErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the configuration of the firewall behavior provided by DNS Firewall for a single
 * VPC from Amazon Virtual Private Cloud (Amazon VPC).
 */
export const updateFirewallConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateFirewallConfigRequest,
    output: UpdateFirewallConfigResponse,
    errors: [
      AccessDeniedException,
      InternalServiceErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves the behavior configuration of Route 53 Resolver behavior for a single VPC from
 * Amazon Virtual Private Cloud.
 */
export const getResolverConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listFirewallRuleGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listFirewallConfigs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listFirewallRuleGroupAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getFirewallConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listResolverConfigs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createFirewallRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createFirewallRuleGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateFirewallRuleGroupRequest,
    output: CreateFirewallRuleGroupResponse,
    errors: [
      AccessDeniedException,
      InternalServiceErrorException,
      LimitExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates settings for a specified Resolver rule. `ResolverRuleId` is required, and all other parameters are optional.
 * If you don't specify a parameter, it retains its current value.
 */
export const updateResolverRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateResolverQueryLogConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createOutpostResolver = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates the behavior configuration of Route 53 Resolver behavior for a single VPC from
 * Amazon Virtual Private Cloud.
 */
export const updateResolverConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates a Resolver endpoint. There are two types of Resolver endpoints, inbound and outbound:
 *
 * - An *inbound Resolver endpoint* forwards DNS queries to the DNS service for a VPC
 * from your network.
 *
 * - An *outbound Resolver endpoint* forwards DNS queries from the DNS service for a VPC
 * to your network.
 */
export const createResolverEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const createResolverQueryLogConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createResolverRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateResolverEndpointIpAddress =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateResolverEndpointIpAddress =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateResolverRule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
