import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Network Firewall",
  serviceShapeName: "NetworkFirewall_20201112",
});
const auth = T.AwsAuthSigv4({ name: "network-firewall" });
const ver = T.ServiceVersion("2020-11-12");
const proto = T.AwsProtocolsAwsJson1_0();
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
                        url: "https://network-firewall-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [],
                      endpoint: {
                        url: "https://network-firewall-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://network-firewall.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://network-firewall.{Region}.{PartitionResult#dnsSuffix}",
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
export const EnabledAnalysisTypes = S.Array(S.String);
export const ResourceNameList = S.Array(S.String);
export const ResourceArnList = S.Array(S.String);
export const AzSubnets = S.Array(S.String);
export const VpcIds = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class AcceptNetworkFirewallTransitGatewayAttachmentRequest extends S.Class<AcceptNetworkFirewallTransitGatewayAttachmentRequest>(
  "AcceptNetworkFirewallTransitGatewayAttachmentRequest",
)(
  { TransitGatewayAttachmentId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateFirewallPolicyRequest extends S.Class<AssociateFirewallPolicyRequest>(
  "AssociateFirewallPolicyRequest",
)(
  {
    UpdateToken: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    FirewallPolicyArn: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SubnetMapping extends S.Class<SubnetMapping>("SubnetMapping")({
  SubnetId: S.String,
  IPAddressType: S.optional(S.String),
}) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateVpcEndpointAssociationRequest extends S.Class<CreateVpcEndpointAssociationRequest>(
  "CreateVpcEndpointAssociationRequest",
)(
  {
    FirewallArn: S.String,
    VpcId: S.String,
    SubnetMapping: SubnetMapping,
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteFirewallRequest extends S.Class<DeleteFirewallRequest>(
  "DeleteFirewallRequest",
)(
  { FirewallName: S.optional(S.String), FirewallArn: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteFirewallPolicyRequest extends S.Class<DeleteFirewallPolicyRequest>(
  "DeleteFirewallPolicyRequest",
)(
  {
    FirewallPolicyName: S.optional(S.String),
    FirewallPolicyArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteNetworkFirewallTransitGatewayAttachmentRequest extends S.Class<DeleteNetworkFirewallTransitGatewayAttachmentRequest>(
  "DeleteNetworkFirewallTransitGatewayAttachmentRequest",
)(
  { TransitGatewayAttachmentId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteProxyRequest extends S.Class<DeleteProxyRequest>(
  "DeleteProxyRequest",
)(
  {
    NatGatewayId: S.String,
    ProxyName: S.optional(S.String),
    ProxyArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteProxyConfigurationRequest extends S.Class<DeleteProxyConfigurationRequest>(
  "DeleteProxyConfigurationRequest",
)(
  {
    ProxyConfigurationName: S.optional(S.String),
    ProxyConfigurationArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteProxyRuleGroupRequest extends S.Class<DeleteProxyRuleGroupRequest>(
  "DeleteProxyRuleGroupRequest",
)(
  {
    ProxyRuleGroupName: S.optional(S.String),
    ProxyRuleGroupArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteProxyRulesRequest extends S.Class<DeleteProxyRulesRequest>(
  "DeleteProxyRulesRequest",
)(
  {
    ProxyRuleGroupArn: S.optional(S.String),
    ProxyRuleGroupName: S.optional(S.String),
    Rules: ResourceNameList,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteResourcePolicyRequest extends S.Class<DeleteResourcePolicyRequest>(
  "DeleteResourcePolicyRequest",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteResourcePolicyResponse extends S.Class<DeleteResourcePolicyResponse>(
  "DeleteResourcePolicyResponse",
)({}) {}
export class DeleteRuleGroupRequest extends S.Class<DeleteRuleGroupRequest>(
  "DeleteRuleGroupRequest",
)(
  {
    RuleGroupName: S.optional(S.String),
    RuleGroupArn: S.optional(S.String),
    Type: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTLSInspectionConfigurationRequest extends S.Class<DeleteTLSInspectionConfigurationRequest>(
  "DeleteTLSInspectionConfigurationRequest",
)(
  {
    TLSInspectionConfigurationArn: S.optional(S.String),
    TLSInspectionConfigurationName: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteVpcEndpointAssociationRequest extends S.Class<DeleteVpcEndpointAssociationRequest>(
  "DeleteVpcEndpointAssociationRequest",
)(
  { VpcEndpointAssociationArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFirewallRequest extends S.Class<DescribeFirewallRequest>(
  "DescribeFirewallRequest",
)(
  { FirewallName: S.optional(S.String), FirewallArn: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFirewallMetadataRequest extends S.Class<DescribeFirewallMetadataRequest>(
  "DescribeFirewallMetadataRequest",
)(
  { FirewallArn: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFirewallPolicyRequest extends S.Class<DescribeFirewallPolicyRequest>(
  "DescribeFirewallPolicyRequest",
)(
  {
    FirewallPolicyName: S.optional(S.String),
    FirewallPolicyArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFlowOperationRequest extends S.Class<DescribeFlowOperationRequest>(
  "DescribeFlowOperationRequest",
)(
  {
    FirewallArn: S.String,
    AvailabilityZone: S.optional(S.String),
    VpcEndpointAssociationArn: S.optional(S.String),
    VpcEndpointId: S.optional(S.String),
    FlowOperationId: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLoggingConfigurationRequest extends S.Class<DescribeLoggingConfigurationRequest>(
  "DescribeLoggingConfigurationRequest",
)(
  { FirewallArn: S.optional(S.String), FirewallName: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeProxyRequest extends S.Class<DescribeProxyRequest>(
  "DescribeProxyRequest",
)(
  { ProxyName: S.optional(S.String), ProxyArn: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeProxyConfigurationRequest extends S.Class<DescribeProxyConfigurationRequest>(
  "DescribeProxyConfigurationRequest",
)(
  {
    ProxyConfigurationName: S.optional(S.String),
    ProxyConfigurationArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeProxyRuleRequest extends S.Class<DescribeProxyRuleRequest>(
  "DescribeProxyRuleRequest",
)(
  {
    ProxyRuleName: S.String,
    ProxyRuleGroupName: S.optional(S.String),
    ProxyRuleGroupArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeProxyRuleGroupRequest extends S.Class<DescribeProxyRuleGroupRequest>(
  "DescribeProxyRuleGroupRequest",
)(
  {
    ProxyRuleGroupName: S.optional(S.String),
    ProxyRuleGroupArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeResourcePolicyRequest extends S.Class<DescribeResourcePolicyRequest>(
  "DescribeResourcePolicyRequest",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRuleGroupRequest extends S.Class<DescribeRuleGroupRequest>(
  "DescribeRuleGroupRequest",
)(
  {
    RuleGroupName: S.optional(S.String),
    RuleGroupArn: S.optional(S.String),
    Type: S.optional(S.String),
    AnalyzeRuleGroup: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRuleGroupMetadataRequest extends S.Class<DescribeRuleGroupMetadataRequest>(
  "DescribeRuleGroupMetadataRequest",
)(
  {
    RuleGroupName: S.optional(S.String),
    RuleGroupArn: S.optional(S.String),
    Type: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRuleGroupSummaryRequest extends S.Class<DescribeRuleGroupSummaryRequest>(
  "DescribeRuleGroupSummaryRequest",
)(
  {
    RuleGroupName: S.optional(S.String),
    RuleGroupArn: S.optional(S.String),
    Type: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTLSInspectionConfigurationRequest extends S.Class<DescribeTLSInspectionConfigurationRequest>(
  "DescribeTLSInspectionConfigurationRequest",
)(
  {
    TLSInspectionConfigurationArn: S.optional(S.String),
    TLSInspectionConfigurationName: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeVpcEndpointAssociationRequest extends S.Class<DescribeVpcEndpointAssociationRequest>(
  "DescribeVpcEndpointAssociationRequest",
)(
  { VpcEndpointAssociationArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetachRuleGroupsFromProxyConfigurationRequest extends S.Class<DetachRuleGroupsFromProxyConfigurationRequest>(
  "DetachRuleGroupsFromProxyConfigurationRequest",
)(
  {
    ProxyConfigurationName: S.optional(S.String),
    ProxyConfigurationArn: S.optional(S.String),
    RuleGroupNames: S.optional(ResourceNameList),
    RuleGroupArns: S.optional(ResourceArnList),
    UpdateToken: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AvailabilityZoneMapping extends S.Class<AvailabilityZoneMapping>(
  "AvailabilityZoneMapping",
)({ AvailabilityZone: S.String }) {}
export const AvailabilityZoneMappings = S.Array(AvailabilityZoneMapping);
export class DisassociateAvailabilityZonesRequest extends S.Class<DisassociateAvailabilityZonesRequest>(
  "DisassociateAvailabilityZonesRequest",
)(
  {
    UpdateToken: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    AvailabilityZoneMappings: AvailabilityZoneMappings,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateSubnetsRequest extends S.Class<DisassociateSubnetsRequest>(
  "DisassociateSubnetsRequest",
)(
  {
    UpdateToken: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    SubnetIds: AzSubnets,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAnalysisReportResultsRequest extends S.Class<GetAnalysisReportResultsRequest>(
  "GetAnalysisReportResultsRequest",
)(
  {
    FirewallName: S.optional(S.String),
    AnalysisReportId: S.String,
    FirewallArn: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAnalysisReportsRequest extends S.Class<ListAnalysisReportsRequest>(
  "ListAnalysisReportsRequest",
)(
  {
    FirewallName: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFirewallPoliciesRequest extends S.Class<ListFirewallPoliciesRequest>(
  "ListFirewallPoliciesRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFirewallsRequest extends S.Class<ListFirewallsRequest>(
  "ListFirewallsRequest",
)(
  {
    NextToken: S.optional(S.String),
    VpcIds: S.optional(VpcIds),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFlowOperationResultsRequest extends S.Class<ListFlowOperationResultsRequest>(
  "ListFlowOperationResultsRequest",
)(
  {
    FirewallArn: S.String,
    FlowOperationId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    AvailabilityZone: S.optional(S.String),
    VpcEndpointId: S.optional(S.String),
    VpcEndpointAssociationArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFlowOperationsRequest extends S.Class<ListFlowOperationsRequest>(
  "ListFlowOperationsRequest",
)(
  {
    FirewallArn: S.String,
    AvailabilityZone: S.optional(S.String),
    VpcEndpointAssociationArn: S.optional(S.String),
    VpcEndpointId: S.optional(S.String),
    FlowOperationType: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListProxiesRequest extends S.Class<ListProxiesRequest>(
  "ListProxiesRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListProxyConfigurationsRequest extends S.Class<ListProxyConfigurationsRequest>(
  "ListProxyConfigurationsRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListProxyRuleGroupsRequest extends S.Class<ListProxyRuleGroupsRequest>(
  "ListProxyRuleGroupsRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRuleGroupsRequest extends S.Class<ListRuleGroupsRequest>(
  "ListRuleGroupsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Scope: S.optional(S.String),
    ManagedType: S.optional(S.String),
    SubscriptionStatus: S.optional(S.String),
    Type: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ResourceArn: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTLSInspectionConfigurationsRequest extends S.Class<ListTLSInspectionConfigurationsRequest>(
  "ListTLSInspectionConfigurationsRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListVpcEndpointAssociationsRequest extends S.Class<ListVpcEndpointAssociationsRequest>(
  "ListVpcEndpointAssociationsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    FirewallArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutResourcePolicyRequest extends S.Class<PutResourcePolicyRequest>(
  "PutResourcePolicyRequest",
)(
  { ResourceArn: S.String, Policy: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutResourcePolicyResponse extends S.Class<PutResourcePolicyResponse>(
  "PutResourcePolicyResponse",
)({}) {}
export class RejectNetworkFirewallTransitGatewayAttachmentRequest extends S.Class<RejectNetworkFirewallTransitGatewayAttachmentRequest>(
  "RejectNetworkFirewallTransitGatewayAttachmentRequest",
)(
  { TransitGatewayAttachmentId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartAnalysisReportRequest extends S.Class<StartAnalysisReportRequest>(
  "StartAnalysisReportRequest",
)(
  {
    FirewallName: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    AnalysisType: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Address extends S.Class<Address>("Address")({
  AddressDefinition: S.String,
}) {}
export const ProtocolStrings = S.Array(S.String);
export class FlowFilter extends S.Class<FlowFilter>("FlowFilter")({
  SourceAddress: S.optional(Address),
  DestinationAddress: S.optional(Address),
  SourcePort: S.optional(S.String),
  DestinationPort: S.optional(S.String),
  Protocols: S.optional(ProtocolStrings),
}) {}
export const FlowFilters = S.Array(FlowFilter);
export class StartFlowFlushRequest extends S.Class<StartFlowFlushRequest>(
  "StartFlowFlushRequest",
)(
  {
    FirewallArn: S.String,
    AvailabilityZone: S.optional(S.String),
    VpcEndpointAssociationArn: S.optional(S.String),
    VpcEndpointId: S.optional(S.String),
    MinimumFlowAgeInSeconds: S.optional(S.Number),
    FlowFilters: FlowFilters,
  },
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
export class UpdateAvailabilityZoneChangeProtectionRequest extends S.Class<UpdateAvailabilityZoneChangeProtectionRequest>(
  "UpdateAvailabilityZoneChangeProtectionRequest",
)(
  {
    UpdateToken: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    AvailabilityZoneChangeProtection: S.Boolean,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateFirewallAnalysisSettingsRequest extends S.Class<UpdateFirewallAnalysisSettingsRequest>(
  "UpdateFirewallAnalysisSettingsRequest",
)(
  {
    EnabledAnalysisTypes: S.optional(EnabledAnalysisTypes),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    UpdateToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateFirewallDeleteProtectionRequest extends S.Class<UpdateFirewallDeleteProtectionRequest>(
  "UpdateFirewallDeleteProtectionRequest",
)(
  {
    UpdateToken: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    DeleteProtection: S.Boolean,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateFirewallDescriptionRequest extends S.Class<UpdateFirewallDescriptionRequest>(
  "UpdateFirewallDescriptionRequest",
)(
  {
    UpdateToken: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    Description: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EncryptionConfiguration extends S.Class<EncryptionConfiguration>(
  "EncryptionConfiguration",
)({ KeyId: S.optional(S.String), Type: S.String }) {}
export class UpdateFirewallEncryptionConfigurationRequest extends S.Class<UpdateFirewallEncryptionConfigurationRequest>(
  "UpdateFirewallEncryptionConfigurationRequest",
)(
  {
    UpdateToken: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StatelessRuleGroupReference extends S.Class<StatelessRuleGroupReference>(
  "StatelessRuleGroupReference",
)({ ResourceArn: S.String, Priority: S.Number }) {}
export const StatelessRuleGroupReferences = S.Array(
  StatelessRuleGroupReference,
);
export const StatelessActions = S.Array(S.String);
export class Dimension extends S.Class<Dimension>("Dimension")({
  Value: S.String,
}) {}
export const Dimensions = S.Array(Dimension);
export class PublishMetricAction extends S.Class<PublishMetricAction>(
  "PublishMetricAction",
)({ Dimensions: Dimensions }) {}
export class ActionDefinition extends S.Class<ActionDefinition>(
  "ActionDefinition",
)({ PublishMetricAction: S.optional(PublishMetricAction) }) {}
export class CustomAction extends S.Class<CustomAction>("CustomAction")({
  ActionName: S.String,
  ActionDefinition: ActionDefinition,
}) {}
export const CustomActions = S.Array(CustomAction);
export class StatefulRuleGroupOverride extends S.Class<StatefulRuleGroupOverride>(
  "StatefulRuleGroupOverride",
)({ Action: S.optional(S.String) }) {}
export class StatefulRuleGroupReference extends S.Class<StatefulRuleGroupReference>(
  "StatefulRuleGroupReference",
)({
  ResourceArn: S.String,
  Priority: S.optional(S.Number),
  Override: S.optional(StatefulRuleGroupOverride),
  DeepThreatInspection: S.optional(S.Boolean),
}) {}
export const StatefulRuleGroupReferences = S.Array(StatefulRuleGroupReference);
export const StatefulActions = S.Array(S.String);
export class FlowTimeouts extends S.Class<FlowTimeouts>("FlowTimeouts")({
  TcpIdleTimeoutSeconds: S.optional(S.Number),
}) {}
export class StatefulEngineOptions extends S.Class<StatefulEngineOptions>(
  "StatefulEngineOptions",
)({
  RuleOrder: S.optional(S.String),
  StreamExceptionPolicy: S.optional(S.String),
  FlowTimeouts: S.optional(FlowTimeouts),
}) {}
export const VariableDefinitionList = S.Array(S.String);
export class IPSet extends S.Class<IPSet>("IPSet")({
  Definition: VariableDefinitionList,
}) {}
export const IPSets = S.Record({ key: S.String, value: IPSet });
export class PolicyVariables extends S.Class<PolicyVariables>(
  "PolicyVariables",
)({ RuleVariables: S.optional(IPSets) }) {}
export class FirewallPolicy extends S.Class<FirewallPolicy>("FirewallPolicy")({
  StatelessRuleGroupReferences: S.optional(StatelessRuleGroupReferences),
  StatelessDefaultActions: StatelessActions,
  StatelessFragmentDefaultActions: StatelessActions,
  StatelessCustomActions: S.optional(CustomActions),
  StatefulRuleGroupReferences: S.optional(StatefulRuleGroupReferences),
  StatefulDefaultActions: S.optional(StatefulActions),
  StatefulEngineOptions: S.optional(StatefulEngineOptions),
  TLSInspectionConfigurationArn: S.optional(S.String),
  PolicyVariables: S.optional(PolicyVariables),
  EnableTLSSessionHolding: S.optional(S.Boolean),
}) {}
export class UpdateFirewallPolicyRequest extends S.Class<UpdateFirewallPolicyRequest>(
  "UpdateFirewallPolicyRequest",
)(
  {
    UpdateToken: S.String,
    FirewallPolicyArn: S.optional(S.String),
    FirewallPolicyName: S.optional(S.String),
    FirewallPolicy: FirewallPolicy,
    Description: S.optional(S.String),
    DryRun: S.optional(S.Boolean),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateFirewallPolicyChangeProtectionRequest extends S.Class<UpdateFirewallPolicyChangeProtectionRequest>(
  "UpdateFirewallPolicyChangeProtectionRequest",
)(
  {
    UpdateToken: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    FirewallPolicyChangeProtection: S.Boolean,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListenerPropertyRequest extends S.Class<ListenerPropertyRequest>(
  "ListenerPropertyRequest",
)({ Port: S.Number, Type: S.String }) {}
export const ListenerPropertiesRequest = S.Array(ListenerPropertyRequest);
export class TlsInterceptPropertiesRequest extends S.Class<TlsInterceptPropertiesRequest>(
  "TlsInterceptPropertiesRequest",
)({ PcaArn: S.optional(S.String), TlsInterceptMode: S.optional(S.String) }) {}
export class UpdateProxyRequest extends S.Class<UpdateProxyRequest>(
  "UpdateProxyRequest",
)(
  {
    NatGatewayId: S.String,
    ProxyName: S.optional(S.String),
    ProxyArn: S.optional(S.String),
    ListenerPropertiesToAdd: S.optional(ListenerPropertiesRequest),
    ListenerPropertiesToRemove: S.optional(ListenerPropertiesRequest),
    TlsInterceptProperties: S.optional(TlsInterceptPropertiesRequest),
    UpdateToken: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ProxyConfigDefaultRulePhaseActionsRequest extends S.Class<ProxyConfigDefaultRulePhaseActionsRequest>(
  "ProxyConfigDefaultRulePhaseActionsRequest",
)({
  PreDNS: S.optional(S.String),
  PreREQUEST: S.optional(S.String),
  PostRESPONSE: S.optional(S.String),
}) {}
export class UpdateProxyConfigurationRequest extends S.Class<UpdateProxyConfigurationRequest>(
  "UpdateProxyConfigurationRequest",
)(
  {
    ProxyConfigurationName: S.optional(S.String),
    ProxyConfigurationArn: S.optional(S.String),
    DefaultRulePhaseActions: ProxyConfigDefaultRulePhaseActionsRequest,
    UpdateToken: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PortSet extends S.Class<PortSet>("PortSet")({
  Definition: S.optional(VariableDefinitionList),
}) {}
export const PortSets = S.Record({ key: S.String, value: PortSet });
export class RuleVariables extends S.Class<RuleVariables>("RuleVariables")({
  IPSets: S.optional(IPSets),
  PortSets: S.optional(PortSets),
}) {}
export class IPSetReference extends S.Class<IPSetReference>("IPSetReference")({
  ReferenceArn: S.optional(S.String),
}) {}
export const IPSetReferenceMap = S.Record({
  key: S.String,
  value: IPSetReference,
});
export class ReferenceSets extends S.Class<ReferenceSets>("ReferenceSets")({
  IPSetReferences: S.optional(IPSetReferenceMap),
}) {}
export const RuleTargets = S.Array(S.String);
export const TargetTypes = S.Array(S.String);
export class RulesSourceList extends S.Class<RulesSourceList>(
  "RulesSourceList",
)({
  Targets: RuleTargets,
  TargetTypes: TargetTypes,
  GeneratedRulesType: S.String,
}) {}
export class Header extends S.Class<Header>("Header")({
  Protocol: S.String,
  Source: S.String,
  SourcePort: S.String,
  Direction: S.String,
  Destination: S.String,
  DestinationPort: S.String,
}) {}
export const Settings = S.Array(S.String);
export class RuleOption extends S.Class<RuleOption>("RuleOption")({
  Keyword: S.String,
  Settings: S.optional(Settings),
}) {}
export const RuleOptions = S.Array(RuleOption);
export class StatefulRule extends S.Class<StatefulRule>("StatefulRule")({
  Action: S.String,
  Header: Header,
  RuleOptions: RuleOptions,
}) {}
export const StatefulRules = S.Array(StatefulRule);
export const Addresses = S.Array(Address);
export class PortRange extends S.Class<PortRange>("PortRange")({
  FromPort: S.Number,
  ToPort: S.Number,
}) {}
export const PortRanges = S.Array(PortRange);
export const ProtocolNumbers = S.Array(S.Number);
export const Flags = S.Array(S.String);
export class TCPFlagField extends S.Class<TCPFlagField>("TCPFlagField")({
  Flags: Flags,
  Masks: S.optional(Flags),
}) {}
export const TCPFlags = S.Array(TCPFlagField);
export class MatchAttributes extends S.Class<MatchAttributes>(
  "MatchAttributes",
)({
  Sources: S.optional(Addresses),
  Destinations: S.optional(Addresses),
  SourcePorts: S.optional(PortRanges),
  DestinationPorts: S.optional(PortRanges),
  Protocols: S.optional(ProtocolNumbers),
  TCPFlags: S.optional(TCPFlags),
}) {}
export class RuleDefinition extends S.Class<RuleDefinition>("RuleDefinition")({
  MatchAttributes: MatchAttributes,
  Actions: StatelessActions,
}) {}
export class StatelessRule extends S.Class<StatelessRule>("StatelessRule")({
  RuleDefinition: RuleDefinition,
  Priority: S.Number,
}) {}
export const StatelessRules = S.Array(StatelessRule);
export class StatelessRulesAndCustomActions extends S.Class<StatelessRulesAndCustomActions>(
  "StatelessRulesAndCustomActions",
)({
  StatelessRules: StatelessRules,
  CustomActions: S.optional(CustomActions),
}) {}
export class RulesSource extends S.Class<RulesSource>("RulesSource")({
  RulesString: S.optional(S.String),
  RulesSourceList: S.optional(RulesSourceList),
  StatefulRules: S.optional(StatefulRules),
  StatelessRulesAndCustomActions: S.optional(StatelessRulesAndCustomActions),
}) {}
export class StatefulRuleOptions extends S.Class<StatefulRuleOptions>(
  "StatefulRuleOptions",
)({ RuleOrder: S.optional(S.String) }) {}
export class RuleGroup extends S.Class<RuleGroup>("RuleGroup")({
  RuleVariables: S.optional(RuleVariables),
  ReferenceSets: S.optional(ReferenceSets),
  RulesSource: RulesSource,
  StatefulRuleOptions: S.optional(StatefulRuleOptions),
}) {}
export class SourceMetadata extends S.Class<SourceMetadata>("SourceMetadata")({
  SourceArn: S.optional(S.String),
  SourceUpdateToken: S.optional(S.String),
}) {}
export const SummaryRuleOptions = S.Array(S.String);
export class SummaryConfiguration extends S.Class<SummaryConfiguration>(
  "SummaryConfiguration",
)({ RuleOptions: S.optional(SummaryRuleOptions) }) {}
export class UpdateRuleGroupRequest extends S.Class<UpdateRuleGroupRequest>(
  "UpdateRuleGroupRequest",
)(
  {
    UpdateToken: S.String,
    RuleGroupArn: S.optional(S.String),
    RuleGroupName: S.optional(S.String),
    RuleGroup: S.optional(RuleGroup),
    Rules: S.optional(S.String),
    Type: S.optional(S.String),
    Description: S.optional(S.String),
    DryRun: S.optional(S.Boolean),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
    SourceMetadata: S.optional(SourceMetadata),
    AnalyzeRuleGroup: S.optional(S.Boolean),
    SummaryConfiguration: S.optional(SummaryConfiguration),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSubnetChangeProtectionRequest extends S.Class<UpdateSubnetChangeProtectionRequest>(
  "UpdateSubnetChangeProtectionRequest",
)(
  {
    UpdateToken: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    SubnetChangeProtection: S.Boolean,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ServerCertificate extends S.Class<ServerCertificate>(
  "ServerCertificate",
)({ ResourceArn: S.optional(S.String) }) {}
export const ServerCertificates = S.Array(ServerCertificate);
export class ServerCertificateScope extends S.Class<ServerCertificateScope>(
  "ServerCertificateScope",
)({
  Sources: S.optional(Addresses),
  Destinations: S.optional(Addresses),
  SourcePorts: S.optional(PortRanges),
  DestinationPorts: S.optional(PortRanges),
  Protocols: S.optional(ProtocolNumbers),
}) {}
export const ServerCertificateScopes = S.Array(ServerCertificateScope);
export class CheckCertificateRevocationStatusActions extends S.Class<CheckCertificateRevocationStatusActions>(
  "CheckCertificateRevocationStatusActions",
)({
  RevokedStatusAction: S.optional(S.String),
  UnknownStatusAction: S.optional(S.String),
}) {}
export class ServerCertificateConfiguration extends S.Class<ServerCertificateConfiguration>(
  "ServerCertificateConfiguration",
)({
  ServerCertificates: S.optional(ServerCertificates),
  Scopes: S.optional(ServerCertificateScopes),
  CertificateAuthorityArn: S.optional(S.String),
  CheckCertificateRevocationStatus: S.optional(
    CheckCertificateRevocationStatusActions,
  ),
}) {}
export const ServerCertificateConfigurations = S.Array(
  ServerCertificateConfiguration,
);
export class TLSInspectionConfiguration extends S.Class<TLSInspectionConfiguration>(
  "TLSInspectionConfiguration",
)({
  ServerCertificateConfigurations: S.optional(ServerCertificateConfigurations),
}) {}
export class UpdateTLSInspectionConfigurationRequest extends S.Class<UpdateTLSInspectionConfigurationRequest>(
  "UpdateTLSInspectionConfigurationRequest",
)(
  {
    TLSInspectionConfigurationArn: S.optional(S.String),
    TLSInspectionConfigurationName: S.optional(S.String),
    TLSInspectionConfiguration: TLSInspectionConfiguration,
    Description: S.optional(S.String),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
    UpdateToken: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ProxyConditionValueList = S.Array(S.String);
export const SubnetMappings = S.Array(SubnetMapping);
export class ProxyRuleGroupAttachment extends S.Class<ProxyRuleGroupAttachment>(
  "ProxyRuleGroupAttachment",
)({
  ProxyRuleGroupName: S.optional(S.String),
  InsertPosition: S.optional(S.Number),
}) {}
export const ProxyRuleGroupAttachmentList = S.Array(ProxyRuleGroupAttachment);
export class ProxyRuleCondition extends S.Class<ProxyRuleCondition>(
  "ProxyRuleCondition",
)({
  ConditionOperator: S.optional(S.String),
  ConditionKey: S.optional(S.String),
  ConditionValues: S.optional(ProxyConditionValueList),
}) {}
export const ProxyRuleConditionList = S.Array(ProxyRuleCondition);
export class ProxyRuleGroupPriority extends S.Class<ProxyRuleGroupPriority>(
  "ProxyRuleGroupPriority",
)({
  ProxyRuleGroupName: S.optional(S.String),
  NewPosition: S.optional(S.Number),
}) {}
export const ProxyRuleGroupPriorityList = S.Array(ProxyRuleGroupPriority);
export class ProxyRulePriority extends S.Class<ProxyRulePriority>(
  "ProxyRulePriority",
)({ ProxyRuleName: S.optional(S.String), NewPosition: S.optional(S.Number) }) {}
export const ProxyRulePriorityList = S.Array(ProxyRulePriority);
export class AcceptNetworkFirewallTransitGatewayAttachmentResponse extends S.Class<AcceptNetworkFirewallTransitGatewayAttachmentResponse>(
  "AcceptNetworkFirewallTransitGatewayAttachmentResponse",
)({
  TransitGatewayAttachmentId: S.String,
  TransitGatewayAttachmentStatus: S.String,
}) {}
export class AssociateAvailabilityZonesRequest extends S.Class<AssociateAvailabilityZonesRequest>(
  "AssociateAvailabilityZonesRequest",
)(
  {
    UpdateToken: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    AvailabilityZoneMappings: AvailabilityZoneMappings,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateFirewallPolicyResponse extends S.Class<AssociateFirewallPolicyResponse>(
  "AssociateFirewallPolicyResponse",
)({
  FirewallArn: S.optional(S.String),
  FirewallName: S.optional(S.String),
  FirewallPolicyArn: S.optional(S.String),
  UpdateToken: S.optional(S.String),
}) {}
export class AssociateSubnetsRequest extends S.Class<AssociateSubnetsRequest>(
  "AssociateSubnetsRequest",
)(
  {
    UpdateToken: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    SubnetMappings: SubnetMappings,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AttachRuleGroupsToProxyConfigurationRequest extends S.Class<AttachRuleGroupsToProxyConfigurationRequest>(
  "AttachRuleGroupsToProxyConfigurationRequest",
)(
  {
    ProxyConfigurationName: S.optional(S.String),
    ProxyConfigurationArn: S.optional(S.String),
    RuleGroups: ProxyRuleGroupAttachmentList,
    UpdateToken: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateFirewallRequest extends S.Class<CreateFirewallRequest>(
  "CreateFirewallRequest",
)(
  {
    FirewallName: S.String,
    FirewallPolicyArn: S.String,
    VpcId: S.optional(S.String),
    SubnetMappings: S.optional(SubnetMappings),
    DeleteProtection: S.optional(S.Boolean),
    SubnetChangeProtection: S.optional(S.Boolean),
    FirewallPolicyChangeProtection: S.optional(S.Boolean),
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
    EnabledAnalysisTypes: S.optional(EnabledAnalysisTypes),
    TransitGatewayId: S.optional(S.String),
    AvailabilityZoneMappings: S.optional(AvailabilityZoneMappings),
    AvailabilityZoneChangeProtection: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateProxyRequest extends S.Class<CreateProxyRequest>(
  "CreateProxyRequest",
)(
  {
    ProxyName: S.String,
    NatGatewayId: S.String,
    ProxyConfigurationName: S.optional(S.String),
    ProxyConfigurationArn: S.optional(S.String),
    ListenerProperties: S.optional(ListenerPropertiesRequest),
    TlsInterceptProperties: TlsInterceptPropertiesRequest,
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateProxyConfigurationRequest extends S.Class<CreateProxyConfigurationRequest>(
  "CreateProxyConfigurationRequest",
)(
  {
    ProxyConfigurationName: S.String,
    Description: S.optional(S.String),
    RuleGroupNames: S.optional(ResourceNameList),
    RuleGroupArns: S.optional(ResourceArnList),
    DefaultRulePhaseActions: ProxyConfigDefaultRulePhaseActionsRequest,
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteNetworkFirewallTransitGatewayAttachmentResponse extends S.Class<DeleteNetworkFirewallTransitGatewayAttachmentResponse>(
  "DeleteNetworkFirewallTransitGatewayAttachmentResponse",
)({
  TransitGatewayAttachmentId: S.String,
  TransitGatewayAttachmentStatus: S.String,
}) {}
export class DeleteProxyResponse extends S.Class<DeleteProxyResponse>(
  "DeleteProxyResponse",
)({
  NatGatewayId: S.optional(S.String),
  ProxyName: S.optional(S.String),
  ProxyArn: S.optional(S.String),
}) {}
export class DeleteProxyConfigurationResponse extends S.Class<DeleteProxyConfigurationResponse>(
  "DeleteProxyConfigurationResponse",
)({
  ProxyConfigurationName: S.optional(S.String),
  ProxyConfigurationArn: S.optional(S.String),
}) {}
export class DeleteProxyRuleGroupResponse extends S.Class<DeleteProxyRuleGroupResponse>(
  "DeleteProxyRuleGroupResponse",
)({
  ProxyRuleGroupName: S.optional(S.String),
  ProxyRuleGroupArn: S.optional(S.String),
}) {}
export class VpcEndpointAssociation extends S.Class<VpcEndpointAssociation>(
  "VpcEndpointAssociation",
)({
  VpcEndpointAssociationId: S.optional(S.String),
  VpcEndpointAssociationArn: S.String,
  FirewallArn: S.String,
  VpcId: S.String,
  SubnetMapping: SubnetMapping,
  Description: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export class Attachment extends S.Class<Attachment>("Attachment")({
  SubnetId: S.optional(S.String),
  EndpointId: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
}) {}
export class AZSyncState extends S.Class<AZSyncState>("AZSyncState")({
  Attachment: S.optional(Attachment),
}) {}
export const AssociationSyncState = S.Record({
  key: S.String,
  value: AZSyncState,
});
export class VpcEndpointAssociationStatus extends S.Class<VpcEndpointAssociationStatus>(
  "VpcEndpointAssociationStatus",
)({
  Status: S.String,
  AssociationSyncState: S.optional(AssociationSyncState),
}) {}
export class DeleteVpcEndpointAssociationResponse extends S.Class<DeleteVpcEndpointAssociationResponse>(
  "DeleteVpcEndpointAssociationResponse",
)({
  VpcEndpointAssociation: S.optional(VpcEndpointAssociation),
  VpcEndpointAssociationStatus: S.optional(VpcEndpointAssociationStatus),
}) {}
export class Firewall extends S.Class<Firewall>("Firewall")({
  FirewallName: S.optional(S.String),
  FirewallArn: S.optional(S.String),
  FirewallPolicyArn: S.String,
  VpcId: S.String,
  SubnetMappings: SubnetMappings,
  DeleteProtection: S.optional(S.Boolean),
  SubnetChangeProtection: S.optional(S.Boolean),
  FirewallPolicyChangeProtection: S.optional(S.Boolean),
  Description: S.optional(S.String),
  FirewallId: S.String,
  Tags: S.optional(TagList),
  EncryptionConfiguration: S.optional(EncryptionConfiguration),
  NumberOfAssociations: S.optional(S.Number),
  EnabledAnalysisTypes: S.optional(EnabledAnalysisTypes),
  TransitGatewayId: S.optional(S.String),
  TransitGatewayOwnerAccountId: S.optional(S.String),
  AvailabilityZoneMappings: S.optional(AvailabilityZoneMappings),
  AvailabilityZoneChangeProtection: S.optional(S.Boolean),
}) {}
export class PerObjectStatus extends S.Class<PerObjectStatus>(
  "PerObjectStatus",
)({ SyncStatus: S.optional(S.String), UpdateToken: S.optional(S.String) }) {}
export const SyncStateConfig = S.Record({
  key: S.String,
  value: PerObjectStatus,
});
export class SyncState extends S.Class<SyncState>("SyncState")({
  Attachment: S.optional(Attachment),
  Config: S.optional(SyncStateConfig),
}) {}
export const SyncStates = S.Record({ key: S.String, value: SyncState });
export class IPSetMetadata extends S.Class<IPSetMetadata>("IPSetMetadata")({
  ResolvedCIDRCount: S.optional(S.Number),
}) {}
export const IPSetMetadataMap = S.Record({
  key: S.String,
  value: IPSetMetadata,
});
export class CIDRSummary extends S.Class<CIDRSummary>("CIDRSummary")({
  AvailableCIDRCount: S.optional(S.Number),
  UtilizedCIDRCount: S.optional(S.Number),
  IPSetReferences: S.optional(IPSetMetadataMap),
}) {}
export class CapacityUsageSummary extends S.Class<CapacityUsageSummary>(
  "CapacityUsageSummary",
)({ CIDRs: S.optional(CIDRSummary) }) {}
export class TransitGatewayAttachmentSyncState extends S.Class<TransitGatewayAttachmentSyncState>(
  "TransitGatewayAttachmentSyncState",
)({
  AttachmentId: S.optional(S.String),
  TransitGatewayAttachmentStatus: S.optional(S.String),
  StatusMessage: S.optional(S.String),
}) {}
export class FirewallStatus extends S.Class<FirewallStatus>("FirewallStatus")({
  Status: S.String,
  ConfigurationSyncStateSummary: S.String,
  SyncStates: S.optional(SyncStates),
  CapacityUsageSummary: S.optional(CapacityUsageSummary),
  TransitGatewayAttachmentSyncState: S.optional(
    TransitGatewayAttachmentSyncState,
  ),
}) {}
export class DescribeFirewallResponse extends S.Class<DescribeFirewallResponse>(
  "DescribeFirewallResponse",
)({
  UpdateToken: S.optional(S.String),
  Firewall: S.optional(Firewall),
  FirewallStatus: S.optional(FirewallStatus),
}) {}
export class FirewallPolicyResponse extends S.Class<FirewallPolicyResponse>(
  "FirewallPolicyResponse",
)({
  FirewallPolicyName: S.String,
  FirewallPolicyArn: S.String,
  FirewallPolicyId: S.String,
  Description: S.optional(S.String),
  FirewallPolicyStatus: S.optional(S.String),
  Tags: S.optional(TagList),
  ConsumedStatelessRuleCapacity: S.optional(S.Number),
  ConsumedStatefulRuleCapacity: S.optional(S.Number),
  NumberOfAssociations: S.optional(S.Number),
  EncryptionConfiguration: S.optional(EncryptionConfiguration),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DescribeFirewallPolicyResponse extends S.Class<DescribeFirewallPolicyResponse>(
  "DescribeFirewallPolicyResponse",
)({
  UpdateToken: S.String,
  FirewallPolicyResponse: FirewallPolicyResponse,
  FirewallPolicy: S.optional(FirewallPolicy),
}) {}
export const LogDestinationMap = S.Record({ key: S.String, value: S.String });
export class LogDestinationConfig extends S.Class<LogDestinationConfig>(
  "LogDestinationConfig",
)({
  LogType: S.String,
  LogDestinationType: S.String,
  LogDestination: LogDestinationMap,
}) {}
export const LogDestinationConfigs = S.Array(LogDestinationConfig);
export class LoggingConfiguration extends S.Class<LoggingConfiguration>(
  "LoggingConfiguration",
)({ LogDestinationConfigs: LogDestinationConfigs }) {}
export class DescribeLoggingConfigurationResponse extends S.Class<DescribeLoggingConfigurationResponse>(
  "DescribeLoggingConfigurationResponse",
)({
  FirewallArn: S.optional(S.String),
  LoggingConfiguration: S.optional(LoggingConfiguration),
  EnableMonitoringDashboard: S.optional(S.Boolean),
}) {}
export class ProxyRule extends S.Class<ProxyRule>("ProxyRule")({
  ProxyRuleName: S.optional(S.String),
  Description: S.optional(S.String),
  Action: S.optional(S.String),
  Conditions: S.optional(ProxyRuleConditionList),
}) {}
export class DescribeProxyRuleResponse extends S.Class<DescribeProxyRuleResponse>(
  "DescribeProxyRuleResponse",
)({ ProxyRule: S.optional(ProxyRule), UpdateToken: S.optional(S.String) }) {}
export const ProxyRuleList = S.Array(ProxyRule);
export class ProxyRulesByRequestPhase extends S.Class<ProxyRulesByRequestPhase>(
  "ProxyRulesByRequestPhase",
)({
  PreDNS: S.optional(ProxyRuleList),
  PreREQUEST: S.optional(ProxyRuleList),
  PostRESPONSE: S.optional(ProxyRuleList),
}) {}
export class ProxyRuleGroup extends S.Class<ProxyRuleGroup>("ProxyRuleGroup")({
  ProxyRuleGroupName: S.optional(S.String),
  ProxyRuleGroupArn: S.optional(S.String),
  CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DeleteTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Rules: S.optional(ProxyRulesByRequestPhase),
  Description: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export class DescribeProxyRuleGroupResponse extends S.Class<DescribeProxyRuleGroupResponse>(
  "DescribeProxyRuleGroupResponse",
)({
  ProxyRuleGroup: S.optional(ProxyRuleGroup),
  UpdateToken: S.optional(S.String),
}) {}
export class DescribeResourcePolicyResponse extends S.Class<DescribeResourcePolicyResponse>(
  "DescribeResourcePolicyResponse",
)({ Policy: S.optional(S.String) }) {}
export const RuleIdList = S.Array(S.String);
export class AnalysisResult extends S.Class<AnalysisResult>("AnalysisResult")({
  IdentifiedRuleIds: S.optional(RuleIdList),
  IdentifiedType: S.optional(S.String),
  AnalysisDetail: S.optional(S.String),
}) {}
export const AnalysisResultList = S.Array(AnalysisResult);
export class RuleGroupResponse extends S.Class<RuleGroupResponse>(
  "RuleGroupResponse",
)({
  RuleGroupArn: S.String,
  RuleGroupName: S.String,
  RuleGroupId: S.String,
  Description: S.optional(S.String),
  Type: S.optional(S.String),
  Capacity: S.optional(S.Number),
  RuleGroupStatus: S.optional(S.String),
  Tags: S.optional(TagList),
  ConsumedCapacity: S.optional(S.Number),
  NumberOfAssociations: S.optional(S.Number),
  EncryptionConfiguration: S.optional(EncryptionConfiguration),
  SourceMetadata: S.optional(SourceMetadata),
  SnsTopic: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AnalysisResults: S.optional(AnalysisResultList),
  SummaryConfiguration: S.optional(SummaryConfiguration),
}) {}
export class DescribeRuleGroupResponse extends S.Class<DescribeRuleGroupResponse>(
  "DescribeRuleGroupResponse",
)({
  UpdateToken: S.String,
  RuleGroup: S.optional(RuleGroup),
  RuleGroupResponse: RuleGroupResponse,
}) {}
export class DescribeRuleGroupMetadataResponse extends S.Class<DescribeRuleGroupMetadataResponse>(
  "DescribeRuleGroupMetadataResponse",
)({
  RuleGroupArn: S.String,
  RuleGroupName: S.String,
  Description: S.optional(S.String),
  Type: S.optional(S.String),
  Capacity: S.optional(S.Number),
  StatefulRuleOptions: S.optional(StatefulRuleOptions),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  VendorName: S.optional(S.String),
  ProductId: S.optional(S.String),
  ListingName: S.optional(S.String),
}) {}
export class TlsCertificateData extends S.Class<TlsCertificateData>(
  "TlsCertificateData",
)({
  CertificateArn: S.optional(S.String),
  CertificateSerial: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
}) {}
export const Certificates = S.Array(TlsCertificateData);
export class TLSInspectionConfigurationResponse extends S.Class<TLSInspectionConfigurationResponse>(
  "TLSInspectionConfigurationResponse",
)({
  TLSInspectionConfigurationArn: S.String,
  TLSInspectionConfigurationName: S.String,
  TLSInspectionConfigurationId: S.String,
  TLSInspectionConfigurationStatus: S.optional(S.String),
  Description: S.optional(S.String),
  Tags: S.optional(TagList),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  NumberOfAssociations: S.optional(S.Number),
  EncryptionConfiguration: S.optional(EncryptionConfiguration),
  Certificates: S.optional(Certificates),
  CertificateAuthority: S.optional(TlsCertificateData),
}) {}
export class DescribeTLSInspectionConfigurationResponse extends S.Class<DescribeTLSInspectionConfigurationResponse>(
  "DescribeTLSInspectionConfigurationResponse",
)({
  UpdateToken: S.String,
  TLSInspectionConfiguration: S.optional(TLSInspectionConfiguration),
  TLSInspectionConfigurationResponse: TLSInspectionConfigurationResponse,
}) {}
export class DescribeVpcEndpointAssociationResponse extends S.Class<DescribeVpcEndpointAssociationResponse>(
  "DescribeVpcEndpointAssociationResponse",
)({
  VpcEndpointAssociation: S.optional(VpcEndpointAssociation),
  VpcEndpointAssociationStatus: S.optional(VpcEndpointAssociationStatus),
}) {}
export class ProxyConfigRuleGroup extends S.Class<ProxyConfigRuleGroup>(
  "ProxyConfigRuleGroup",
)({
  ProxyRuleGroupName: S.optional(S.String),
  ProxyRuleGroupArn: S.optional(S.String),
  Type: S.optional(S.String),
  Priority: S.optional(S.Number),
}) {}
export const ProxyConfigRuleGroupSet = S.Array(ProxyConfigRuleGroup);
export class ProxyConfiguration extends S.Class<ProxyConfiguration>(
  "ProxyConfiguration",
)({
  ProxyConfigurationName: S.optional(S.String),
  ProxyConfigurationArn: S.optional(S.String),
  Description: S.optional(S.String),
  CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DeleteTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RuleGroups: S.optional(ProxyConfigRuleGroupSet),
  DefaultRulePhaseActions: S.optional(
    ProxyConfigDefaultRulePhaseActionsRequest,
  ),
  Tags: S.optional(TagList),
}) {}
export class DetachRuleGroupsFromProxyConfigurationResponse extends S.Class<DetachRuleGroupsFromProxyConfigurationResponse>(
  "DetachRuleGroupsFromProxyConfigurationResponse",
)({
  ProxyConfiguration: S.optional(ProxyConfiguration),
  UpdateToken: S.optional(S.String),
}) {}
export class DisassociateAvailabilityZonesResponse extends S.Class<DisassociateAvailabilityZonesResponse>(
  "DisassociateAvailabilityZonesResponse",
)({
  FirewallArn: S.optional(S.String),
  FirewallName: S.optional(S.String),
  AvailabilityZoneMappings: S.optional(AvailabilityZoneMappings),
  UpdateToken: S.optional(S.String),
}) {}
export class DisassociateSubnetsResponse extends S.Class<DisassociateSubnetsResponse>(
  "DisassociateSubnetsResponse",
)({
  FirewallArn: S.optional(S.String),
  FirewallName: S.optional(S.String),
  SubnetMappings: S.optional(SubnetMappings),
  UpdateToken: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ NextToken: S.optional(S.String), Tags: S.optional(TagList) }) {}
export class RejectNetworkFirewallTransitGatewayAttachmentResponse extends S.Class<RejectNetworkFirewallTransitGatewayAttachmentResponse>(
  "RejectNetworkFirewallTransitGatewayAttachmentResponse",
)({
  TransitGatewayAttachmentId: S.String,
  TransitGatewayAttachmentStatus: S.String,
}) {}
export class StartAnalysisReportResponse extends S.Class<StartAnalysisReportResponse>(
  "StartAnalysisReportResponse",
)({ AnalysisReportId: S.String }) {}
export class StartFlowFlushResponse extends S.Class<StartFlowFlushResponse>(
  "StartFlowFlushResponse",
)({
  FirewallArn: S.optional(S.String),
  FlowOperationId: S.optional(S.String),
  FlowOperationStatus: S.optional(S.String),
}) {}
export class UpdateAvailabilityZoneChangeProtectionResponse extends S.Class<UpdateAvailabilityZoneChangeProtectionResponse>(
  "UpdateAvailabilityZoneChangeProtectionResponse",
)({
  UpdateToken: S.optional(S.String),
  FirewallArn: S.optional(S.String),
  FirewallName: S.optional(S.String),
  AvailabilityZoneChangeProtection: S.optional(S.Boolean),
}) {}
export class UpdateFirewallAnalysisSettingsResponse extends S.Class<UpdateFirewallAnalysisSettingsResponse>(
  "UpdateFirewallAnalysisSettingsResponse",
)({
  EnabledAnalysisTypes: S.optional(EnabledAnalysisTypes),
  FirewallArn: S.optional(S.String),
  FirewallName: S.optional(S.String),
  UpdateToken: S.optional(S.String),
}) {}
export class UpdateFirewallDeleteProtectionResponse extends S.Class<UpdateFirewallDeleteProtectionResponse>(
  "UpdateFirewallDeleteProtectionResponse",
)({
  FirewallArn: S.optional(S.String),
  FirewallName: S.optional(S.String),
  DeleteProtection: S.optional(S.Boolean),
  UpdateToken: S.optional(S.String),
}) {}
export class UpdateFirewallDescriptionResponse extends S.Class<UpdateFirewallDescriptionResponse>(
  "UpdateFirewallDescriptionResponse",
)({
  FirewallArn: S.optional(S.String),
  FirewallName: S.optional(S.String),
  Description: S.optional(S.String),
  UpdateToken: S.optional(S.String),
}) {}
export class UpdateFirewallEncryptionConfigurationResponse extends S.Class<UpdateFirewallEncryptionConfigurationResponse>(
  "UpdateFirewallEncryptionConfigurationResponse",
)({
  FirewallArn: S.optional(S.String),
  FirewallName: S.optional(S.String),
  UpdateToken: S.optional(S.String),
  EncryptionConfiguration: S.optional(EncryptionConfiguration),
}) {}
export class UpdateFirewallPolicyResponse extends S.Class<UpdateFirewallPolicyResponse>(
  "UpdateFirewallPolicyResponse",
)({ UpdateToken: S.String, FirewallPolicyResponse: FirewallPolicyResponse }) {}
export class UpdateFirewallPolicyChangeProtectionResponse extends S.Class<UpdateFirewallPolicyChangeProtectionResponse>(
  "UpdateFirewallPolicyChangeProtectionResponse",
)({
  UpdateToken: S.optional(S.String),
  FirewallArn: S.optional(S.String),
  FirewallName: S.optional(S.String),
  FirewallPolicyChangeProtection: S.optional(S.Boolean),
}) {}
export class UpdateProxyConfigurationResponse extends S.Class<UpdateProxyConfigurationResponse>(
  "UpdateProxyConfigurationResponse",
)({
  ProxyConfiguration: S.optional(ProxyConfiguration),
  UpdateToken: S.optional(S.String),
}) {}
export class UpdateProxyRuleRequest extends S.Class<UpdateProxyRuleRequest>(
  "UpdateProxyRuleRequest",
)(
  {
    ProxyRuleGroupName: S.optional(S.String),
    ProxyRuleGroupArn: S.optional(S.String),
    ProxyRuleName: S.String,
    Description: S.optional(S.String),
    Action: S.optional(S.String),
    AddConditions: S.optional(ProxyRuleConditionList),
    RemoveConditions: S.optional(ProxyRuleConditionList),
    UpdateToken: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateProxyRuleGroupPrioritiesRequest extends S.Class<UpdateProxyRuleGroupPrioritiesRequest>(
  "UpdateProxyRuleGroupPrioritiesRequest",
)(
  {
    ProxyConfigurationName: S.optional(S.String),
    ProxyConfigurationArn: S.optional(S.String),
    RuleGroups: ProxyRuleGroupPriorityList,
    UpdateToken: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateProxyRulePrioritiesRequest extends S.Class<UpdateProxyRulePrioritiesRequest>(
  "UpdateProxyRulePrioritiesRequest",
)(
  {
    ProxyRuleGroupName: S.optional(S.String),
    ProxyRuleGroupArn: S.optional(S.String),
    RuleGroupRequestPhase: S.String,
    Rules: ProxyRulePriorityList,
    UpdateToken: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateRuleGroupResponse extends S.Class<UpdateRuleGroupResponse>(
  "UpdateRuleGroupResponse",
)({ UpdateToken: S.String, RuleGroupResponse: RuleGroupResponse }) {}
export class UpdateSubnetChangeProtectionResponse extends S.Class<UpdateSubnetChangeProtectionResponse>(
  "UpdateSubnetChangeProtectionResponse",
)({
  UpdateToken: S.optional(S.String),
  FirewallArn: S.optional(S.String),
  FirewallName: S.optional(S.String),
  SubnetChangeProtection: S.optional(S.Boolean),
}) {}
export class UpdateTLSInspectionConfigurationResponse extends S.Class<UpdateTLSInspectionConfigurationResponse>(
  "UpdateTLSInspectionConfigurationResponse",
)({
  UpdateToken: S.String,
  TLSInspectionConfigurationResponse: TLSInspectionConfigurationResponse,
}) {}
export class CreateProxyRule extends S.Class<CreateProxyRule>(
  "CreateProxyRule",
)({
  ProxyRuleName: S.optional(S.String),
  Description: S.optional(S.String),
  Action: S.optional(S.String),
  Conditions: S.optional(ProxyRuleConditionList),
  InsertPosition: S.optional(S.Number),
}) {}
export const CreateProxyRuleList = S.Array(CreateProxyRule);
export class CreateProxyRulesByRequestPhase extends S.Class<CreateProxyRulesByRequestPhase>(
  "CreateProxyRulesByRequestPhase",
)({
  PreDNS: S.optional(CreateProxyRuleList),
  PreREQUEST: S.optional(CreateProxyRuleList),
  PostRESPONSE: S.optional(CreateProxyRuleList),
}) {}
export class FlowOperation extends S.Class<FlowOperation>("FlowOperation")({
  MinimumFlowAgeInSeconds: S.optional(S.Number),
  FlowFilters: S.optional(FlowFilters),
}) {}
export class AnalysisReport extends S.Class<AnalysisReport>("AnalysisReport")({
  AnalysisReportId: S.optional(S.String),
  AnalysisType: S.optional(S.String),
  ReportTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
}) {}
export const AnalysisReports = S.Array(AnalysisReport);
export class FirewallPolicyMetadata extends S.Class<FirewallPolicyMetadata>(
  "FirewallPolicyMetadata",
)({ Name: S.optional(S.String), Arn: S.optional(S.String) }) {}
export const FirewallPolicies = S.Array(FirewallPolicyMetadata);
export class FirewallMetadata extends S.Class<FirewallMetadata>(
  "FirewallMetadata",
)({
  FirewallName: S.optional(S.String),
  FirewallArn: S.optional(S.String),
  TransitGatewayAttachmentId: S.optional(S.String),
}) {}
export const Firewalls = S.Array(FirewallMetadata);
export class Flow extends S.Class<Flow>("Flow")({
  SourceAddress: S.optional(Address),
  DestinationAddress: S.optional(Address),
  SourcePort: S.optional(S.String),
  DestinationPort: S.optional(S.String),
  Protocol: S.optional(S.String),
  Age: S.optional(S.Number),
  PacketCount: S.optional(S.Number),
  ByteCount: S.optional(S.Number),
}) {}
export const Flows = S.Array(Flow);
export class FlowOperationMetadata extends S.Class<FlowOperationMetadata>(
  "FlowOperationMetadata",
)({
  FlowOperationId: S.optional(S.String),
  FlowOperationType: S.optional(S.String),
  FlowRequestTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  FlowOperationStatus: S.optional(S.String),
}) {}
export const FlowOperations = S.Array(FlowOperationMetadata);
export class ProxyMetadata extends S.Class<ProxyMetadata>("ProxyMetadata")({
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
}) {}
export const Proxies = S.Array(ProxyMetadata);
export class ProxyConfigurationMetadata extends S.Class<ProxyConfigurationMetadata>(
  "ProxyConfigurationMetadata",
)({ Name: S.optional(S.String), Arn: S.optional(S.String) }) {}
export const ProxyConfigurations = S.Array(ProxyConfigurationMetadata);
export class ProxyRuleGroupMetadata extends S.Class<ProxyRuleGroupMetadata>(
  "ProxyRuleGroupMetadata",
)({ Name: S.optional(S.String), Arn: S.optional(S.String) }) {}
export const ProxyRuleGroups = S.Array(ProxyRuleGroupMetadata);
export class RuleGroupMetadata extends S.Class<RuleGroupMetadata>(
  "RuleGroupMetadata",
)({
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
  VendorName: S.optional(S.String),
}) {}
export const RuleGroups = S.Array(RuleGroupMetadata);
export class TLSInspectionConfigurationMetadata extends S.Class<TLSInspectionConfigurationMetadata>(
  "TLSInspectionConfigurationMetadata",
)({ Name: S.optional(S.String), Arn: S.optional(S.String) }) {}
export const TLSInspectionConfigurations = S.Array(
  TLSInspectionConfigurationMetadata,
);
export class VpcEndpointAssociationMetadata extends S.Class<VpcEndpointAssociationMetadata>(
  "VpcEndpointAssociationMetadata",
)({ VpcEndpointAssociationArn: S.optional(S.String) }) {}
export const VpcEndpointAssociations = S.Array(VpcEndpointAssociationMetadata);
export class ListenerProperty extends S.Class<ListenerProperty>(
  "ListenerProperty",
)({ Port: S.optional(S.Number), Type: S.optional(S.String) }) {}
export const ListenerProperties = S.Array(ListenerProperty);
export class TlsInterceptProperties extends S.Class<TlsInterceptProperties>(
  "TlsInterceptProperties",
)({ PcaArn: S.optional(S.String), TlsInterceptMode: S.optional(S.String) }) {}
export class Proxy extends S.Class<Proxy>("Proxy")({
  CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DeleteTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FailureCode: S.optional(S.String),
  FailureMessage: S.optional(S.String),
  ProxyState: S.optional(S.String),
  ProxyModifyState: S.optional(S.String),
  NatGatewayId: S.optional(S.String),
  ProxyConfigurationName: S.optional(S.String),
  ProxyConfigurationArn: S.optional(S.String),
  ProxyName: S.optional(S.String),
  ProxyArn: S.optional(S.String),
  ListenerProperties: S.optional(ListenerProperties),
  TlsInterceptProperties: S.optional(TlsInterceptProperties),
  Tags: S.optional(TagList),
}) {}
export class AssociateAvailabilityZonesResponse extends S.Class<AssociateAvailabilityZonesResponse>(
  "AssociateAvailabilityZonesResponse",
)({
  FirewallArn: S.optional(S.String),
  FirewallName: S.optional(S.String),
  AvailabilityZoneMappings: S.optional(AvailabilityZoneMappings),
  UpdateToken: S.optional(S.String),
}) {}
export class AssociateSubnetsResponse extends S.Class<AssociateSubnetsResponse>(
  "AssociateSubnetsResponse",
)({
  FirewallArn: S.optional(S.String),
  FirewallName: S.optional(S.String),
  SubnetMappings: S.optional(SubnetMappings),
  UpdateToken: S.optional(S.String),
}) {}
export class AttachRuleGroupsToProxyConfigurationResponse extends S.Class<AttachRuleGroupsToProxyConfigurationResponse>(
  "AttachRuleGroupsToProxyConfigurationResponse",
)({
  ProxyConfiguration: S.optional(ProxyConfiguration),
  UpdateToken: S.optional(S.String),
}) {}
export class CreateFirewallResponse extends S.Class<CreateFirewallResponse>(
  "CreateFirewallResponse",
)({
  Firewall: S.optional(Firewall),
  FirewallStatus: S.optional(FirewallStatus),
}) {}
export class CreateProxyResponse extends S.Class<CreateProxyResponse>(
  "CreateProxyResponse",
)({ Proxy: S.optional(Proxy), UpdateToken: S.optional(S.String) }) {}
export class CreateProxyConfigurationResponse extends S.Class<CreateProxyConfigurationResponse>(
  "CreateProxyConfigurationResponse",
)({
  ProxyConfiguration: S.optional(ProxyConfiguration),
  UpdateToken: S.optional(S.String),
}) {}
export class CreateProxyRuleGroupRequest extends S.Class<CreateProxyRuleGroupRequest>(
  "CreateProxyRuleGroupRequest",
)(
  {
    ProxyRuleGroupName: S.String,
    Description: S.optional(S.String),
    Rules: S.optional(ProxyRulesByRequestPhase),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateProxyRulesRequest extends S.Class<CreateProxyRulesRequest>(
  "CreateProxyRulesRequest",
)(
  {
    ProxyRuleGroupArn: S.optional(S.String),
    ProxyRuleGroupName: S.optional(S.String),
    Rules: CreateProxyRulesByRequestPhase,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteFirewallPolicyResponse extends S.Class<DeleteFirewallPolicyResponse>(
  "DeleteFirewallPolicyResponse",
)({ FirewallPolicyResponse: FirewallPolicyResponse }) {}
export class DeleteProxyRulesResponse extends S.Class<DeleteProxyRulesResponse>(
  "DeleteProxyRulesResponse",
)({ ProxyRuleGroup: S.optional(ProxyRuleGroup) }) {}
export class DescribeFlowOperationResponse extends S.Class<DescribeFlowOperationResponse>(
  "DescribeFlowOperationResponse",
)({
  FirewallArn: S.optional(S.String),
  AvailabilityZone: S.optional(S.String),
  VpcEndpointAssociationArn: S.optional(S.String),
  VpcEndpointId: S.optional(S.String),
  FlowOperationId: S.optional(S.String),
  FlowOperationType: S.optional(S.String),
  FlowOperationStatus: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  FlowRequestTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  FlowOperation: S.optional(FlowOperation),
}) {}
export class ListAnalysisReportsResponse extends S.Class<ListAnalysisReportsResponse>(
  "ListAnalysisReportsResponse",
)({
  AnalysisReports: S.optional(AnalysisReports),
  NextToken: S.optional(S.String),
}) {}
export class ListFirewallPoliciesResponse extends S.Class<ListFirewallPoliciesResponse>(
  "ListFirewallPoliciesResponse",
)({
  NextToken: S.optional(S.String),
  FirewallPolicies: S.optional(FirewallPolicies),
}) {}
export class ListFirewallsResponse extends S.Class<ListFirewallsResponse>(
  "ListFirewallsResponse",
)({ NextToken: S.optional(S.String), Firewalls: S.optional(Firewalls) }) {}
export class ListFlowOperationResultsResponse extends S.Class<ListFlowOperationResultsResponse>(
  "ListFlowOperationResultsResponse",
)({
  FirewallArn: S.optional(S.String),
  AvailabilityZone: S.optional(S.String),
  VpcEndpointAssociationArn: S.optional(S.String),
  VpcEndpointId: S.optional(S.String),
  FlowOperationId: S.optional(S.String),
  FlowOperationStatus: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  FlowRequestTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Flows: S.optional(Flows),
  NextToken: S.optional(S.String),
}) {}
export class ListFlowOperationsResponse extends S.Class<ListFlowOperationsResponse>(
  "ListFlowOperationsResponse",
)({
  FlowOperations: S.optional(FlowOperations),
  NextToken: S.optional(S.String),
}) {}
export class ListProxiesResponse extends S.Class<ListProxiesResponse>(
  "ListProxiesResponse",
)({ Proxies: S.optional(Proxies), NextToken: S.optional(S.String) }) {}
export class ListProxyConfigurationsResponse extends S.Class<ListProxyConfigurationsResponse>(
  "ListProxyConfigurationsResponse",
)({
  ProxyConfigurations: S.optional(ProxyConfigurations),
  NextToken: S.optional(S.String),
}) {}
export class ListProxyRuleGroupsResponse extends S.Class<ListProxyRuleGroupsResponse>(
  "ListProxyRuleGroupsResponse",
)({
  ProxyRuleGroups: S.optional(ProxyRuleGroups),
  NextToken: S.optional(S.String),
}) {}
export class ListRuleGroupsResponse extends S.Class<ListRuleGroupsResponse>(
  "ListRuleGroupsResponse",
)({ NextToken: S.optional(S.String), RuleGroups: S.optional(RuleGroups) }) {}
export class ListTLSInspectionConfigurationsResponse extends S.Class<ListTLSInspectionConfigurationsResponse>(
  "ListTLSInspectionConfigurationsResponse",
)({
  NextToken: S.optional(S.String),
  TLSInspectionConfigurations: S.optional(TLSInspectionConfigurations),
}) {}
export class ListVpcEndpointAssociationsResponse extends S.Class<ListVpcEndpointAssociationsResponse>(
  "ListVpcEndpointAssociationsResponse",
)({
  NextToken: S.optional(S.String),
  VpcEndpointAssociations: S.optional(VpcEndpointAssociations),
}) {}
export class StartFlowCaptureRequest extends S.Class<StartFlowCaptureRequest>(
  "StartFlowCaptureRequest",
)(
  {
    FirewallArn: S.String,
    AvailabilityZone: S.optional(S.String),
    VpcEndpointAssociationArn: S.optional(S.String),
    VpcEndpointId: S.optional(S.String),
    MinimumFlowAgeInSeconds: S.optional(S.Number),
    FlowFilters: FlowFilters,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateProxyResponse extends S.Class<UpdateProxyResponse>(
  "UpdateProxyResponse",
)({ Proxy: S.optional(Proxy), UpdateToken: S.optional(S.String) }) {}
export class UpdateProxyRuleResponse extends S.Class<UpdateProxyRuleResponse>(
  "UpdateProxyRuleResponse",
)({
  ProxyRule: S.optional(ProxyRule),
  RemovedConditions: S.optional(ProxyRuleConditionList),
  UpdateToken: S.optional(S.String),
}) {}
export class UpdateProxyRulePrioritiesResponse extends S.Class<UpdateProxyRulePrioritiesResponse>(
  "UpdateProxyRulePrioritiesResponse",
)({
  ProxyRuleGroupName: S.optional(S.String),
  ProxyRuleGroupArn: S.optional(S.String),
  RuleGroupRequestPhase: S.optional(S.String),
  Rules: S.optional(ProxyRulePriorityList),
  UpdateToken: S.optional(S.String),
}) {}
export class AvailabilityZoneMetadata extends S.Class<AvailabilityZoneMetadata>(
  "AvailabilityZoneMetadata",
)({ IPAddressType: S.optional(S.String) }) {}
export class RuleSummary extends S.Class<RuleSummary>("RuleSummary")({
  SID: S.optional(S.String),
  Msg: S.optional(S.String),
  Metadata: S.optional(S.String),
}) {}
export const RuleSummaries = S.Array(RuleSummary);
export class Hits extends S.Class<Hits>("Hits")({
  Count: S.optional(S.Number),
}) {}
export class UniqueSources extends S.Class<UniqueSources>("UniqueSources")({
  Count: S.optional(S.Number),
}) {}
export const SupportedAvailabilityZones = S.Record({
  key: S.String,
  value: AvailabilityZoneMetadata,
});
export class DescribeProxyResource extends S.Class<DescribeProxyResource>(
  "DescribeProxyResource",
)({
  ProxyName: S.optional(S.String),
  ProxyArn: S.optional(S.String),
  ProxyConfigurationName: S.optional(S.String),
  ProxyConfigurationArn: S.optional(S.String),
  NatGatewayId: S.optional(S.String),
  ProxyState: S.optional(S.String),
  ProxyModifyState: S.optional(S.String),
  ListenerProperties: S.optional(ListenerProperties),
  TlsInterceptProperties: S.optional(TlsInterceptProperties),
  VpcEndpointServiceName: S.optional(S.String),
  PrivateDNSName: S.optional(S.String),
  CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DeleteTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FailureCode: S.optional(S.String),
  FailureMessage: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export class Summary extends S.Class<Summary>("Summary")({
  RuleSummaries: S.optional(RuleSummaries),
}) {}
export class AnalysisTypeReportResult extends S.Class<AnalysisTypeReportResult>(
  "AnalysisTypeReportResult",
)({
  Protocol: S.optional(S.String),
  FirstAccessed: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastAccessed: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Domain: S.optional(S.String),
  Hits: S.optional(Hits),
  UniqueSources: S.optional(UniqueSources),
}) {}
export const AnalysisReportResults = S.Array(AnalysisTypeReportResult);
export class ProxyRuleGroupPriorityResult extends S.Class<ProxyRuleGroupPriorityResult>(
  "ProxyRuleGroupPriorityResult",
)({
  ProxyRuleGroupName: S.optional(S.String),
  Priority: S.optional(S.Number),
}) {}
export const ProxyRuleGroupPriorityResultList = S.Array(
  ProxyRuleGroupPriorityResult,
);
export class CreateProxyRuleGroupResponse extends S.Class<CreateProxyRuleGroupResponse>(
  "CreateProxyRuleGroupResponse",
)({
  ProxyRuleGroup: S.optional(ProxyRuleGroup),
  UpdateToken: S.optional(S.String),
}) {}
export class CreateProxyRulesResponse extends S.Class<CreateProxyRulesResponse>(
  "CreateProxyRulesResponse",
)({
  ProxyRuleGroup: S.optional(ProxyRuleGroup),
  UpdateToken: S.optional(S.String),
}) {}
export class DeleteRuleGroupResponse extends S.Class<DeleteRuleGroupResponse>(
  "DeleteRuleGroupResponse",
)({ RuleGroupResponse: RuleGroupResponse }) {}
export class DeleteTLSInspectionConfigurationResponse extends S.Class<DeleteTLSInspectionConfigurationResponse>(
  "DeleteTLSInspectionConfigurationResponse",
)({ TLSInspectionConfigurationResponse: TLSInspectionConfigurationResponse }) {}
export class DescribeFirewallMetadataResponse extends S.Class<DescribeFirewallMetadataResponse>(
  "DescribeFirewallMetadataResponse",
)({
  FirewallArn: S.optional(S.String),
  FirewallPolicyArn: S.optional(S.String),
  Description: S.optional(S.String),
  Status: S.optional(S.String),
  SupportedAvailabilityZones: S.optional(SupportedAvailabilityZones),
  TransitGatewayAttachmentId: S.optional(S.String),
}) {}
export class DescribeProxyResponse extends S.Class<DescribeProxyResponse>(
  "DescribeProxyResponse",
)({
  Proxy: S.optional(DescribeProxyResource),
  UpdateToken: S.optional(S.String),
}) {}
export class DescribeProxyConfigurationResponse extends S.Class<DescribeProxyConfigurationResponse>(
  "DescribeProxyConfigurationResponse",
)({
  ProxyConfiguration: S.optional(ProxyConfiguration),
  UpdateToken: S.optional(S.String),
}) {}
export class DescribeRuleGroupSummaryResponse extends S.Class<DescribeRuleGroupSummaryResponse>(
  "DescribeRuleGroupSummaryResponse",
)({
  RuleGroupName: S.String,
  Description: S.optional(S.String),
  Summary: S.optional(Summary),
}) {}
export class GetAnalysisReportResultsResponse extends S.Class<GetAnalysisReportResultsResponse>(
  "GetAnalysisReportResultsResponse",
)({
  Status: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ReportTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AnalysisType: S.optional(S.String),
  NextToken: S.optional(S.String),
  AnalysisReportResults: S.optional(AnalysisReportResults),
}) {}
export class StartFlowCaptureResponse extends S.Class<StartFlowCaptureResponse>(
  "StartFlowCaptureResponse",
)({
  FirewallArn: S.optional(S.String),
  FlowOperationId: S.optional(S.String),
  FlowOperationStatus: S.optional(S.String),
}) {}
export class UpdateLoggingConfigurationRequest extends S.Class<UpdateLoggingConfigurationRequest>(
  "UpdateLoggingConfigurationRequest",
)(
  {
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    LoggingConfiguration: S.optional(LoggingConfiguration),
    EnableMonitoringDashboard: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateProxyRuleGroupPrioritiesResponse extends S.Class<UpdateProxyRuleGroupPrioritiesResponse>(
  "UpdateProxyRuleGroupPrioritiesResponse",
)({
  ProxyRuleGroups: S.optional(ProxyRuleGroupPriorityResultList),
  UpdateToken: S.optional(S.String),
}) {}
export class CreateTLSInspectionConfigurationRequest extends S.Class<CreateTLSInspectionConfigurationRequest>(
  "CreateTLSInspectionConfigurationRequest",
)(
  {
    TLSInspectionConfigurationName: S.String,
    TLSInspectionConfiguration: TLSInspectionConfiguration,
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateLoggingConfigurationResponse extends S.Class<UpdateLoggingConfigurationResponse>(
  "UpdateLoggingConfigurationResponse",
)({
  FirewallArn: S.optional(S.String),
  FirewallName: S.optional(S.String),
  LoggingConfiguration: S.optional(LoggingConfiguration),
  EnableMonitoringDashboard: S.optional(S.Boolean),
}) {}
export class CreateFirewallPolicyRequest extends S.Class<CreateFirewallPolicyRequest>(
  "CreateFirewallPolicyRequest",
)(
  {
    FirewallPolicyName: S.String,
    FirewallPolicy: FirewallPolicy,
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
    DryRun: S.optional(S.Boolean),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTLSInspectionConfigurationResponse extends S.Class<CreateTLSInspectionConfigurationResponse>(
  "CreateTLSInspectionConfigurationResponse",
)({
  UpdateToken: S.String,
  TLSInspectionConfigurationResponse: TLSInspectionConfigurationResponse,
}) {}
export class CreateVpcEndpointAssociationResponse extends S.Class<CreateVpcEndpointAssociationResponse>(
  "CreateVpcEndpointAssociationResponse",
)({
  VpcEndpointAssociation: S.optional(VpcEndpointAssociation),
  VpcEndpointAssociationStatus: S.optional(VpcEndpointAssociationStatus),
}) {}
export class CreateFirewallPolicyResponse extends S.Class<CreateFirewallPolicyResponse>(
  "CreateFirewallPolicyResponse",
)({ UpdateToken: S.String, FirewallPolicyResponse: FirewallPolicyResponse }) {}
export class DeleteFirewallResponse extends S.Class<DeleteFirewallResponse>(
  "DeleteFirewallResponse",
)({
  Firewall: S.optional(Firewall),
  FirewallStatus: S.optional(FirewallStatus),
}) {}
export class CreateRuleGroupRequest extends S.Class<CreateRuleGroupRequest>(
  "CreateRuleGroupRequest",
)(
  {
    RuleGroupName: S.String,
    RuleGroup: S.optional(RuleGroup),
    Rules: S.optional(S.String),
    Type: S.String,
    Description: S.optional(S.String),
    Capacity: S.Number,
    Tags: S.optional(TagList),
    DryRun: S.optional(S.Boolean),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
    SourceMetadata: S.optional(SourceMetadata),
    AnalyzeRuleGroup: S.optional(S.Boolean),
    SummaryConfiguration: S.optional(SummaryConfiguration),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateRuleGroupResponse extends S.Class<CreateRuleGroupResponse>(
  "CreateRuleGroupResponse",
)({ UpdateToken: S.String, RuleGroupResponse: RuleGroupResponse }) {}

//# Errors
export class InternalServerError extends S.TaggedError<InternalServerError>()(
  "InternalServerError",
  { Message: S.optional(S.String) },
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { Message: S.optional(S.String) },
) {}
export class InvalidOperationException extends S.TaggedError<InvalidOperationException>()(
  "InvalidOperationException",
  { Message: S.optional(S.String) },
) {}
export class InsufficientCapacityException extends S.TaggedError<InsufficientCapacityException>()(
  "InsufficientCapacityException",
  { Message: S.optional(S.String) },
) {}
export class InvalidResourcePolicyException extends S.TaggedError<InvalidResourcePolicyException>()(
  "InvalidResourcePolicyException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
) {}
export class InvalidTokenException extends S.TaggedError<InvalidTokenException>()(
  "InvalidTokenException",
  { Message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class ResourceOwnerCheckException extends S.TaggedError<ResourceOwnerCheckException>()(
  "ResourceOwnerCheckException",
  { Message: S.optional(S.String) },
) {}
export class UnsupportedOperationException extends S.TaggedError<UnsupportedOperationException>()(
  "UnsupportedOperationException",
  { Message: S.optional(S.String) },
) {}
export class LogDestinationPermissionException extends S.TaggedError<LogDestinationPermissionException>()(
  "LogDestinationPermissionException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Retrieves the metadata for the firewall policies that you have defined. Depending on
 * your setting for max results and the number of firewall policies, a single call might not
 * return the full list.
 */
export const listFirewallPolicies =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListFirewallPoliciesRequest,
    output: ListFirewallPoliciesResponse,
    errors: [InternalServerError, InvalidRequestException, ThrottlingException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "FirewallPolicies",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Begins capturing the flows in a firewall, according to the filters you define.
 * Captures are similar, but not identical to snapshots. Capture operations provide visibility into flows that are not closed and are tracked by a firewall's flow table.
 * Unlike snapshots, captures are a time-boxed view.
 *
 * A flow is network traffic that is monitored by a firewall, either by stateful or stateless rules.
 * For traffic to be considered part of a flow, it must share Destination, DestinationPort, Direction, Protocol, Source, and SourcePort.
 *
 * To avoid encountering operation limits, you should avoid starting captures with broad filters, like wide IP ranges.
 * Instead, we recommend you define more specific criteria with `FlowFilters`, like narrow IP ranges, ports, or protocols.
 */
export const startFlowCapture = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartFlowCaptureRequest,
  output: StartFlowCaptureResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates proxy rule group priorities within a proxy configuration.
 */
export const updateProxyRuleGroupPriorities =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateProxyRuleGroupPrioritiesRequest,
    output: UpdateProxyRuleGroupPrioritiesResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Creates or updates an IAM policy for your rule group, firewall policy, or firewall. Use this to share these resources between accounts. This operation works in conjunction with the Amazon Web Services Resource Access Manager (RAM) service to manage resource sharing for Network Firewall.
 *
 * For information about using sharing with Network Firewall resources, see
 * Sharing Network Firewall resources in the *Network Firewall Developer Guide*.
 *
 * Use this operation to create or update a resource policy for your Network Firewall rule group, firewall policy, or firewall. In the resource policy, you specify the accounts that you want to share the Network Firewall resource with and the operations that you want the accounts to be able to perform.
 *
 * When you add an account in the resource policy, you then run the following Resource Access Manager (RAM) operations to access and accept the shared resource.
 *
 * - GetResourceShareInvitations - Returns the Amazon Resource Names (ARNs) of the resource share invitations.
 *
 * - AcceptResourceShareInvitation - Accepts the share invitation for a specified resource share.
 *
 * For additional information about resource sharing using RAM, see Resource Access Manager User Guide.
 */
export const putResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    InvalidResourcePolicyException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns key information about a specific flow operation.
 */
export const describeFlowOperation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeFlowOperationRequest,
    output: DescribeFlowOperationResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Returns a list of all traffic analysis reports generated within the last 30 days.
 */
export const listAnalysisReports =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAnalysisReportsRequest,
    output: ListAnalysisReportsResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "AnalysisReports",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns the results of a specific flow operation.
 *
 * Flow operations let you manage the flows tracked in the flow table, also known as the firewall table.
 *
 * A flow is network traffic that is monitored by a firewall, either by stateful or stateless rules.
 * For traffic to be considered part of a flow, it must share Destination, DestinationPort, Direction, Protocol, Source, and SourcePort.
 */
export const listFlowOperationResults =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListFlowOperationResultsRequest,
    output: ListFlowOperationResultsResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Flows",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns a list of all flow operations ran in a specific firewall.
 * You can optionally narrow the request scope by specifying the operation type or Availability Zone associated with a firewall's flow operations.
 *
 * Flow operations let you manage the flows tracked in the flow table, also known as the firewall table.
 *
 * A flow is network traffic that is monitored by a firewall, either by stateful or stateless rules.
 * For traffic to be considered part of a flow, it must share Destination, DestinationPort, Direction, Protocol, Source, and SourcePort.
 */
export const listFlowOperations = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListFlowOperationsRequest,
    output: ListFlowOperationsResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "FlowOperations",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Retrieves the metadata for the proxy configuration that you have defined. Depending on
 * your setting for max results and the number of proxy configurations, a single call might not
 * return the full list.
 */
export const listProxyConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListProxyConfigurationsRequest,
    output: ListProxyConfigurationsResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ProxyConfigurations",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Retrieves the metadata for the proxy rule groups that you have defined. Depending on
 * your setting for max results and the number of proxy rule groups, a single call might not
 * return the full list.
 */
export const listProxyRuleGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListProxyRuleGroupsRequest,
    output: ListProxyRuleGroupsResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ProxyRuleGroups",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Updates the properties of the specified proxy rule.
 */
export const updateProxyRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProxyRuleRequest,
  output: UpdateProxyRuleResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates proxy rule priorities within a proxy rule group.
 */
export const updateProxyRulePriorities = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateProxyRulePrioritiesRequest,
    output: UpdateProxyRulePrioritiesResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Returns the data objects for the specified firewall.
 */
export const describeFirewall = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFirewallRequest,
  output: DescribeFirewallResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns the data objects for the specified firewall policy.
 */
export const describeFirewallPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeFirewallPolicyRequest,
    output: DescribeFirewallPolicyResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Returns the logging configuration for the specified firewall.
 */
export const describeLoggingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeLoggingConfigurationRequest,
    output: DescribeLoggingConfigurationResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Returns the data objects for the specified proxy configuration for the specified proxy rule group.
 */
export const describeProxyRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProxyRuleRequest,
  output: DescribeProxyRuleResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns the data objects for the specified proxy rule group.
 */
export const describeProxyRuleGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeProxyRuleGroupRequest,
    output: DescribeProxyRuleGroupResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Retrieves a resource policy that you created in a PutResourcePolicy request.
 */
export const describeResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeResourcePolicyRequest,
    output: DescribeResourcePolicyResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Returns the data objects for the specified rule group.
 */
export const describeRuleGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRuleGroupRequest,
  output: DescribeRuleGroupResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * High-level information about a rule group, returned by operations like create and describe.
 * You can use the information provided in the metadata to retrieve and manage a rule group.
 * You can retrieve all objects for a rule group by calling DescribeRuleGroup.
 */
export const describeRuleGroupMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeRuleGroupMetadataRequest,
    output: DescribeRuleGroupMetadataResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Returns the data objects for the specified TLS inspection configuration.
 */
export const describeTLSInspectionConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeTLSInspectionConfigurationRequest,
    output: DescribeTLSInspectionConfigurationResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Returns the data object for the specified VPC endpoint association.
 */
export const describeVpcEndpointAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeVpcEndpointAssociationRequest,
    output: DescribeVpcEndpointAssociationResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Detaches ProxyRuleGroup resources from a ProxyConfiguration
 *
 * A Proxy Configuration defines the monitoring and protection behavior for a Proxy. The details of the behavior are defined in the rule groups that you add to your configuration.
 */
export const detachRuleGroupsFromProxyConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DetachRuleGroupsFromProxyConfigurationRequest,
    output: DetachRuleGroupsFromProxyConfigurationResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Retrieves the tags associated with the specified resource. Tags are key:value pairs that
 * you can use to categorize and manage your resources, for purposes like billing. For
 * example, you might set the tag key to "customer" and the value to the customer name or ID.
 * You can specify one or more tags to add to each Amazon Web Services resource, up to 50 tags for a
 * resource.
 *
 * You can tag the Amazon Web Services resources that you manage through Network Firewall: firewalls, firewall
 * policies, and rule groups.
 */
export const listTagsForResource =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTagsForResourceRequest,
    output: ListTagsForResourceResponse,
    errors: [
      InternalServerError,
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
 * Rejects a transit gateway attachment request for Network Firewall. When you reject the attachment request, Network Firewall cancels the creation of routing components between the transit gateway and firewall endpoints.
 *
 * Only the transit gateway owner can reject the attachment. After rejection, no traffic will flow through the firewall endpoints for this attachment.
 *
 * Use DescribeFirewall to monitor the rejection status. To accept the attachment instead of rejecting it, use AcceptNetworkFirewallTransitGatewayAttachment.
 *
 * Once rejected, you cannot reverse this action. To establish connectivity, you must create a new transit gateway-attached firewall.
 */
export const rejectNetworkFirewallTransitGatewayAttachment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RejectNetworkFirewallTransitGatewayAttachmentRequest,
    output: RejectNetworkFirewallTransitGatewayAttachmentResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Generates a traffic analysis report for the timeframe and traffic type you specify.
 *
 * For information on the contents of a traffic analysis report, see AnalysisReport.
 */
export const startAnalysisReport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartAnalysisReportRequest,
  output: StartAnalysisReportResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Begins the flushing of traffic from the firewall, according to the filters you define.
 * When the operation starts, impacted flows are temporarily marked as timed out before the Suricata engine prunes,
 * or flushes, the flows from the firewall table.
 *
 * While the flush completes, impacted flows are processed as midstream traffic. This may result in a
 * temporary increase in midstream traffic metrics. We recommend that you double check your stream exception policy
 * before you perform a flush operation.
 */
export const startFlowFlush = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartFlowFlushRequest,
  output: StartFlowFlushResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the properties of the specified proxy configuration.
 */
export const updateProxyConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateProxyConfigurationRequest,
    output: UpdateProxyConfigurationResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Adds the specified tags to the specified resource. Tags are key:value pairs that you can
 * use to categorize and manage your resources, for purposes like billing. For example, you
 * might set the tag key to "customer" and the value to the customer name or ID. You can
 * specify one or more tags to add to each Amazon Web Services resource, up to 50 tags for a resource.
 *
 * You can tag the Amazon Web Services resources that you manage through Network Firewall: firewalls, firewall
 * policies, and rule groups.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Removes the tags with the specified keys from the specified resource. Tags are key:value
 * pairs that you can use to categorize and manage your resources, for purposes like billing.
 * For example, you might set the tag key to "customer" and the value to the customer name or
 * ID. You can specify one or more tags to add to each Amazon Web Services resource, up to 50 tags for a
 * resource.
 *
 * You can manage tags for the Amazon Web Services resources that you manage through Network Firewall:
 * firewalls, firewall policies, and rule groups.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Accepts a transit gateway attachment request for Network Firewall. When you accept the attachment request, Network Firewall creates the necessary routing components to enable traffic flow between the transit gateway and firewall endpoints.
 *
 * You must accept a transit gateway attachment to complete the creation of a transit gateway-attached firewall, unless auto-accept is enabled on the transit gateway. After acceptance, use DescribeFirewall to verify the firewall status.
 *
 * To reject an attachment instead of accepting it, use RejectNetworkFirewallTransitGatewayAttachment.
 *
 * It can take several minutes for the attachment acceptance to complete and the firewall to become available.
 */
export const acceptNetworkFirewallTransitGatewayAttachment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AcceptNetworkFirewallTransitGatewayAttachmentRequest,
    output: AcceptNetworkFirewallTransitGatewayAttachmentResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Deletes a transit gateway attachment from a Network Firewall. Either the firewall owner or the transit gateway owner can delete the attachment.
 *
 * After you delete a transit gateway attachment, traffic will no longer flow through the firewall endpoints.
 *
 * After you initiate the delete operation, use DescribeFirewall to monitor the deletion status.
 */
export const deleteNetworkFirewallTransitGatewayAttachment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteNetworkFirewallTransitGatewayAttachmentRequest,
    output: DeleteNetworkFirewallTransitGatewayAttachmentResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Deletes the specified ProxyConfiguration.
 */
export const deleteProxyConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteProxyConfigurationRequest,
    output: DeleteProxyConfigurationResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes the specified ProxyRuleGroup.
 */
export const deleteProxyRuleGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteProxyRuleGroupRequest,
    output: DeleteProxyRuleGroupResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Attaches ProxyRuleGroup resources to a ProxyConfiguration
 *
 * A Proxy Configuration defines the monitoring and protection behavior for a Proxy. The details of the behavior are defined in the rule groups that you add to your configuration.
 */
export const attachRuleGroupsToProxyConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AttachRuleGroupsToProxyConfigurationRequest,
    output: AttachRuleGroupsToProxyConfigurationResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Deletes the specified ProxyRule(s). currently attached to a ProxyRuleGroup
 */
export const deleteProxyRules = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProxyRulesRequest,
  output: DeleteProxyRulesResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a resource policy that you created in a PutResourcePolicy request.
 */
export const deleteResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourcePolicyRequest,
    output: DeleteResourcePolicyResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      InvalidResourcePolicyException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes the specified TLSInspectionConfiguration.
 */
export const deleteTLSInspectionConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteTLSInspectionConfigurationRequest,
    output: DeleteTLSInspectionConfigurationResponse,
    errors: [
      InternalServerError,
      InvalidOperationException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Retrieves the metadata for the firewalls that you have defined. If you provide VPC
 * identifiers in your request, this returns only the firewalls for those VPCs.
 *
 * Depending on your setting for max results and the number of firewalls, a single call
 * might not return the full list.
 */
export const listFirewalls = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListFirewallsRequest,
    output: ListFirewallsResponse,
    errors: [InternalServerError, InvalidRequestException, ThrottlingException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Firewalls",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Retrieves the metadata for the proxies that you have defined. Depending on
 * your setting for max results and the number of proxies, a single call might not
 * return the full list.
 */
export const listProxies = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListProxiesRequest,
    output: ListProxiesResponse,
    errors: [InternalServerError, InvalidRequestException, ThrottlingException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Proxies",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Retrieves the metadata for the rule groups that you have defined. Depending on your
 * setting for max results and the number of rule groups, a single call might not return the
 * full list.
 */
export const listRuleGroups = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListRuleGroupsRequest,
    output: ListRuleGroupsResponse,
    errors: [InternalServerError, InvalidRequestException, ThrottlingException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "RuleGroups",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Retrieves the metadata for the TLS inspection configurations that you have defined. Depending on your setting for max results and the number of TLS inspection configurations, a single call might not return the full list.
 */
export const listTLSInspectionConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTLSInspectionConfigurationsRequest,
    output: ListTLSInspectionConfigurationsResponse,
    errors: [InternalServerError, InvalidRequestException, ThrottlingException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "TLSInspectionConfigurations",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Retrieves the metadata for the VPC endpoint associations that you have defined. If you specify a fireawll,
 * this returns only the endpoint associations for that firewall.
 *
 * Depending on your setting for max results and the number of associations, a single call
 * might not return the full list.
 */
export const listVpcEndpointAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListVpcEndpointAssociationsRequest,
    output: ListVpcEndpointAssociationsResponse,
    errors: [InternalServerError, InvalidRequestException, ThrottlingException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "VpcEndpointAssociations",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Creates Network Firewall ProxyRule resources.
 *
 * Attaches new proxy rule(s) to an existing proxy rule group.
 *
 * To retrieve information about individual proxy rules, use DescribeProxyRuleGroup and DescribeProxyRule.
 */
export const createProxyRules = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProxyRulesRequest,
  output: CreateProxyRulesResponse,
  errors: [InternalServerError, InvalidRequestException, ThrottlingException],
}));
/**
 * Deletes the specified VpcEndpointAssociation.
 *
 * You can check whether an endpoint association is
 * in use by reviewing the route tables for the Availability Zones where you have the endpoint subnet mapping.
 * You can retrieve the subnet mapping by calling DescribeVpcEndpointAssociation.
 * You define and update the route tables through Amazon VPC. As needed, update the route tables for the
 * Availability Zone to remove the firewall endpoint for the association. When the route tables no longer use the firewall endpoint,
 * you can remove the endpoint association safely.
 */
export const deleteVpcEndpointAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteVpcEndpointAssociationRequest,
    output: DeleteVpcEndpointAssociationResponse,
    errors: [
      InternalServerError,
      InvalidOperationException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Returns the high-level information about a firewall, including the Availability Zones where the Firewall is
 * currently in use.
 */
export const describeFirewallMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeFirewallMetadataRequest,
    output: DescribeFirewallMetadataResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Returns the data objects for the specified proxy.
 */
export const describeProxy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProxyRequest,
  output: DescribeProxyResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns the data objects for the specified proxy configuration.
 */
export const describeProxyConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeProxyConfigurationRequest,
    output: DescribeProxyConfigurationResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Returns detailed information for a stateful rule group.
 *
 * For active threat defense Amazon Web Services managed rule groups, this operation provides insight into the protections enabled by the rule group, based on Suricata rule metadata fields. Summaries are available for rule groups you manage and for active threat defense Amazon Web Services managed rule groups.
 *
 * To modify how threat information appears in summaries, use the `SummaryConfiguration` parameter in UpdateRuleGroup.
 */
export const describeRuleGroupSummary = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeRuleGroupSummaryRequest,
    output: DescribeRuleGroupSummaryResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * The results of a `COMPLETED` analysis report generated with StartAnalysisReport.
 *
 * For more information, see AnalysisTypeReportResult.
 */
export const getAnalysisReportResults =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetAnalysisReportResultsRequest,
    output: GetAnalysisReportResultsResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "AnalysisReportResults",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Enables specific types of firewall analysis on a specific firewall you define.
 */
export const updateFirewallAnalysisSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateFirewallAnalysisSettingsRequest,
    output: UpdateFirewallAnalysisSettingsResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      InvalidTokenException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Modifies the description for the specified firewall. Use the description to help you
 * identify the firewall when you're working with it.
 */
export const updateFirewallDescription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateFirewallDescriptionRequest,
    output: UpdateFirewallDescriptionResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      InvalidTokenException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates the properties of the specified firewall policy.
 */
export const updateFirewallPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateFirewallPolicyRequest,
    output: UpdateFirewallPolicyResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      InvalidTokenException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates the rule settings for the specified rule group. You use a rule group by
 * reference in one or more firewall policies. When you modify a rule group, you modify all
 * firewall policies that use the rule group.
 *
 * To update a rule group, first call DescribeRuleGroup to retrieve the
 * current RuleGroup object, update the object as needed, and then provide
 * the updated object to this call.
 */
export const updateRuleGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRuleGroupRequest,
  output: UpdateRuleGroupResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    InvalidTokenException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the TLS inspection configuration settings for the specified TLS inspection configuration. You use a TLS inspection configuration by
 * referencing it in one or more firewall policies. When you modify a TLS inspection configuration, you modify all
 * firewall policies that use the TLS inspection configuration.
 *
 * To update a TLS inspection configuration, first call DescribeTLSInspectionConfiguration to retrieve the
 * current TLSInspectionConfiguration object, update the object as needed, and then provide
 * the updated object to this call.
 */
export const updateTLSInspectionConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateTLSInspectionConfigurationRequest,
    output: UpdateTLSInspectionConfigurationResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      InvalidTokenException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Removes the specified Availability Zone associations from a transit gateway-attached firewall. This removes the firewall endpoints from these Availability Zones and stops traffic filtering in those zones. Before removing an Availability Zone, ensure you've updated your transit gateway route tables to redirect traffic appropriately.
 *
 * If `AvailabilityZoneChangeProtection` is enabled, you must first disable it using UpdateAvailabilityZoneChangeProtection.
 *
 * To verify the status of your Availability Zone changes, use DescribeFirewall.
 */
export const disassociateAvailabilityZones =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateAvailabilityZonesRequest,
    output: DisassociateAvailabilityZonesResponse,
    errors: [
      InternalServerError,
      InvalidOperationException,
      InvalidRequestException,
      InvalidTokenException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Removes the specified subnet associations from the firewall. This removes the
 * firewall endpoints from the subnets and removes any network filtering protections that the endpoints
 * were providing.
 */
export const disassociateSubnets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateSubnetsRequest,
  output: DisassociateSubnetsResponse,
  errors: [
    InternalServerError,
    InvalidOperationException,
    InvalidRequestException,
    InvalidTokenException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Associates a FirewallPolicy to a Firewall.
 *
 * A firewall policy defines how to monitor and manage your VPC network traffic, using a
 * collection of inspection rule groups and other settings. Each firewall requires one
 * firewall policy association, and you can use the same firewall policy for multiple
 * firewalls.
 */
export const associateFirewallPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateFirewallPolicyRequest,
    output: AssociateFirewallPolicyResponse,
    errors: [
      InternalServerError,
      InvalidOperationException,
      InvalidRequestException,
      InvalidTokenException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Associates the specified Availability Zones with a transit gateway-attached firewall. For each Availability Zone, Network Firewall creates a firewall endpoint to process traffic. You can specify one or more Availability Zones where you want to deploy the firewall.
 *
 * After adding Availability Zones, you must update your transit gateway route tables to direct traffic through the new firewall endpoints. Use DescribeFirewall to monitor the status of the new endpoints.
 */
export const associateAvailabilityZones = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateAvailabilityZonesRequest,
    output: AssociateAvailabilityZonesResponse,
    errors: [
      InsufficientCapacityException,
      InternalServerError,
      InvalidOperationException,
      InvalidRequestException,
      InvalidTokenException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Associates the specified subnets in the Amazon VPC to the firewall. You can specify one
 * subnet for each of the Availability Zones that the VPC spans.
 *
 * This request creates an Network Firewall firewall endpoint in each of the subnets. To
 * enable the firewall's protections, you must also modify the VPC's route tables for each
 * subnet's Availability Zone, to redirect the traffic that's coming into and going out of the
 * zone through the firewall endpoint.
 */
export const associateSubnets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateSubnetsRequest,
  output: AssociateSubnetsResponse,
  errors: [
    InsufficientCapacityException,
    InternalServerError,
    InvalidOperationException,
    InvalidRequestException,
    InvalidTokenException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates an Network Firewall ProxyConfiguration
 *
 * A Proxy Configuration defines the monitoring and protection behavior for a Proxy. The details of the behavior are defined in the rule groups that you add to your configuration.
 *
 * To manage a proxy configuration's tags, use the standard Amazon Web Services resource tagging operations, ListTagsForResource, TagResource, and UntagResource.
 *
 * To retrieve information about proxies, use ListProxyConfigurations and DescribeProxyConfiguration.
 */
export const createProxyConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateProxyConfigurationRequest,
    output: CreateProxyConfigurationResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates an Network Firewall ProxyRuleGroup
 *
 * Collections of related proxy filtering rules. Rule groups help you manage and reuse sets of rules across multiple proxy configurations.
 *
 * To manage a proxy rule group's tags, use the standard Amazon Web Services resource tagging operations, ListTagsForResource, TagResource, and UntagResource.
 *
 * To retrieve information about proxy rule groups, use ListProxyRuleGroups and DescribeProxyRuleGroup.
 *
 * To retrieve information about individual proxy rules, use DescribeProxyRuleGroup and DescribeProxyRule.
 */
export const createProxyRuleGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateProxyRuleGroupRequest,
    output: CreateProxyRuleGroupResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      LimitExceededException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates an Network Firewall Firewall and accompanying FirewallStatus for a VPC.
 *
 * The firewall defines the configuration settings for an Network Firewall firewall. The settings that you can define at creation include the firewall policy, the subnets in your VPC to use for the firewall endpoints, and any tags that are attached to the firewall Amazon Web Services resource.
 *
 * After you create a firewall, you can provide additional settings, like the logging configuration.
 *
 * To update the settings for a firewall, you use the operations that apply to the settings
 * themselves, for example UpdateLoggingConfiguration, AssociateSubnets, and UpdateFirewallDeleteProtection.
 *
 * To manage a firewall's tags, use the standard Amazon Web Services resource tagging operations, ListTagsForResource, TagResource, and UntagResource.
 *
 * To retrieve information about firewalls, use ListFirewalls and DescribeFirewall.
 *
 * To generate a report on the last 30 days of traffic monitored by a firewall, use StartAnalysisReport.
 */
export const createFirewall = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFirewallRequest,
  output: CreateFirewallResponse,
  errors: [
    InsufficientCapacityException,
    InternalServerError,
    InvalidOperationException,
    InvalidRequestException,
    LimitExceededException,
    ThrottlingException,
  ],
}));
/**
 * Modifies the `AvailabilityZoneChangeProtection` setting for a transit gateway-attached firewall. When enabled, this setting prevents accidental changes to the firewall's Availability Zone configuration. This helps protect against disrupting traffic flow in production environments.
 *
 * When enabled, you must disable this protection before using AssociateAvailabilityZones or DisassociateAvailabilityZones to modify the firewall's Availability Zone configuration.
 */
export const updateAvailabilityZoneChangeProtection =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateAvailabilityZoneChangeProtectionRequest,
    output: UpdateAvailabilityZoneChangeProtectionResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      InvalidTokenException,
      ResourceNotFoundException,
      ResourceOwnerCheckException,
      ThrottlingException,
    ],
  }));
/**
 * Creates an Network Firewall Proxy
 *
 * Attaches a Proxy configuration to a NAT Gateway.
 *
 * To manage a proxy's tags, use the standard Amazon Web Services resource tagging operations, ListTagsForResource, TagResource, and UntagResource.
 *
 * To retrieve information about proxies, use ListProxies and DescribeProxy.
 */
export const createProxy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProxyRequest,
  output: CreateProxyResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedOperationException,
  ],
}));
/**
 * Modifies the flag, `DeleteProtection`, which indicates whether it is possible
 * to delete the firewall. If the flag is set to `TRUE`, the firewall is protected
 * against deletion. This setting helps protect against accidentally deleting a firewall
 * that's in use.
 */
export const updateFirewallDeleteProtection =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateFirewallDeleteProtectionRequest,
    output: UpdateFirewallDeleteProtectionResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      InvalidTokenException,
      ResourceNotFoundException,
      ResourceOwnerCheckException,
      ThrottlingException,
    ],
  }));
/**
 * A complex type that contains settings for encryption of your firewall resources.
 */
export const updateFirewallEncryptionConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateFirewallEncryptionConfigurationRequest,
    output: UpdateFirewallEncryptionConfigurationResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      InvalidTokenException,
      ResourceNotFoundException,
      ResourceOwnerCheckException,
      ThrottlingException,
    ],
  }));
/**
 * Modifies the flag, `ChangeProtection`, which indicates whether it
 * is possible to change the firewall. If the flag is set to `TRUE`, the firewall is protected
 * from changes. This setting helps protect against accidentally changing a firewall that's in use.
 */
export const updateFirewallPolicyChangeProtection =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateFirewallPolicyChangeProtectionRequest,
    output: UpdateFirewallPolicyChangeProtectionResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      InvalidTokenException,
      ResourceNotFoundException,
      ResourceOwnerCheckException,
      ThrottlingException,
    ],
  }));
/**
 *
 */
export const updateSubnetChangeProtection =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateSubnetChangeProtectionRequest,
    output: UpdateSubnetChangeProtectionResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      InvalidTokenException,
      ResourceNotFoundException,
      ResourceOwnerCheckException,
      ThrottlingException,
    ],
  }));
/**
 * Updates the properties of the specified proxy.
 */
export const updateProxy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProxyRequest,
  output: UpdateProxyResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedOperationException,
  ],
}));
/**
 * Deletes the specified Proxy.
 *
 * Detaches a Proxy configuration from a NAT Gateway.
 */
export const deleteProxy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProxyRequest,
  output: DeleteProxyResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedOperationException,
  ],
}));
/**
 * Deletes the specified FirewallPolicy.
 */
export const deleteFirewallPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteFirewallPolicyRequest,
    output: DeleteFirewallPolicyResponse,
    errors: [
      InternalServerError,
      InvalidOperationException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Deletes the specified RuleGroup.
 */
export const deleteRuleGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRuleGroupRequest,
  output: DeleteRuleGroupResponse,
  errors: [
    InternalServerError,
    InvalidOperationException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedOperationException,
  ],
}));
/**
 * Creates an Network Firewall TLS inspection configuration. Network Firewall uses TLS inspection configurations to decrypt your firewall's inbound and outbound SSL/TLS traffic. After decryption, Network Firewall inspects the traffic according to your firewall policy's stateful rules, and then re-encrypts it before sending it to its destination. You can enable inspection of your firewall's inbound traffic, outbound traffic, or both. To use TLS inspection with your firewall, you must first import or provision certificates using ACM, create a TLS inspection configuration, add that configuration to a new firewall policy, and then associate that policy with your firewall.
 *
 * To update the settings for a TLS inspection configuration, use UpdateTLSInspectionConfiguration.
 *
 * To manage a TLS inspection configuration's tags, use the standard Amazon Web Services resource tagging operations, ListTagsForResource, TagResource, and UntagResource.
 *
 * To retrieve information about TLS inspection configurations, use ListTLSInspectionConfigurations and DescribeTLSInspectionConfiguration.
 *
 * For more information about TLS inspection configurations, see Inspecting SSL/TLS traffic with TLS
 * inspection configurations in the *Network Firewall Developer Guide*.
 */
export const createTLSInspectionConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateTLSInspectionConfigurationRequest,
    output: CreateTLSInspectionConfigurationResponse,
    errors: [
      InsufficientCapacityException,
      InternalServerError,
      InvalidRequestException,
      LimitExceededException,
      ThrottlingException,
    ],
  }));
/**
 * Creates a firewall endpoint for an Network Firewall firewall. This type of firewall endpoint is independent of the firewall endpoints that you specify in the `Firewall` itself, and you define it in addition to those endpoints after the firewall has been created. You can define a VPC endpoint association using a different VPC than the one you used in the firewall specifications.
 */
export const createVpcEndpointAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateVpcEndpointAssociationRequest,
    output: CreateVpcEndpointAssociationResponse,
    errors: [
      InsufficientCapacityException,
      InternalServerError,
      InvalidOperationException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Sets the logging configuration for the specified firewall.
 *
 * To change the logging configuration, retrieve the LoggingConfiguration by calling DescribeLoggingConfiguration, then change it and provide
 * the modified object to this update call. You must change the logging configuration one
 * LogDestinationConfig at a time inside the retrieved LoggingConfiguration object.
 *
 * You can perform only one of the following actions in any call to
 * `UpdateLoggingConfiguration`:
 *
 * - Create a new log destination object by adding a single
 * `LogDestinationConfig` array element to
 * `LogDestinationConfigs`.
 *
 * - Delete a log destination object by removing a single
 * `LogDestinationConfig` array element from
 * `LogDestinationConfigs`.
 *
 * - Change the `LogDestination` setting in a single
 * `LogDestinationConfig` array element.
 *
 * You can't change the `LogDestinationType` or `LogType` in a
 * `LogDestinationConfig`. To change these settings, delete the existing
 * `LogDestinationConfig` object and create a new one, using two separate calls
 * to this update operation.
 */
export const updateLoggingConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateLoggingConfigurationRequest,
    output: UpdateLoggingConfigurationResponse,
    errors: [
      InternalServerError,
      InvalidRequestException,
      InvalidTokenException,
      LogDestinationPermissionException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates the firewall policy for the firewall according to the specifications.
 *
 * An Network Firewall firewall policy defines the behavior of a firewall, in a collection of
 * stateless and stateful rule groups and other settings. You can use one firewall policy for
 * multiple firewalls.
 */
export const createFirewallPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateFirewallPolicyRequest,
    output: CreateFirewallPolicyResponse,
    errors: [
      InsufficientCapacityException,
      InternalServerError,
      InvalidRequestException,
      LimitExceededException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes the specified Firewall and its FirewallStatus.
 * This operation requires the firewall's `DeleteProtection` flag to be
 * `FALSE`. You can't revert this operation.
 *
 * You can check whether a firewall is
 * in use by reviewing the route tables for the Availability Zones where you have
 * firewall subnet mappings. Retrieve the subnet mappings by calling DescribeFirewall.
 * You define and update the route tables through Amazon VPC. As needed, update the route tables for the
 * zones to remove the firewall endpoints. When the route tables no longer use the firewall endpoints,
 * you can remove the firewall safely.
 *
 * To delete a firewall, remove the delete protection if you need to using UpdateFirewallDeleteProtection,
 * then delete the firewall by calling DeleteFirewall.
 */
export const deleteFirewall = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFirewallRequest,
  output: DeleteFirewallResponse,
  errors: [
    InternalServerError,
    InvalidOperationException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedOperationException,
  ],
}));
/**
 * Creates the specified stateless or stateful rule group, which includes the rules for
 * network traffic inspection, a capacity setting, and tags.
 *
 * You provide your rule group specification in your request using either
 * `RuleGroup` or `Rules`.
 */
export const createRuleGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRuleGroupRequest,
  output: CreateRuleGroupResponse,
  errors: [
    InsufficientCapacityException,
    InternalServerError,
    InvalidRequestException,
    LimitExceededException,
    ThrottlingException,
  ],
}));
