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
  sdkId: "Network Firewall",
  serviceShapeName: "NetworkFirewall_20201112",
});
const auth = T.AwsAuthSigv4({ name: "network-firewall" });
const ver = T.ServiceVersion("2020-11-12");
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
              `https://network-firewall-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://network-firewall-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://network-firewall.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://network-firewall.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type TransitGatewayAttachmentId = string;
export type UpdateToken = string;
export type ResourceArn = string;
export type ResourceName = string;
export type VpcId = string;
export type Description = string;
export type TransitGatewayId = string;
export type NatGatewayId = string;
export type RulesString = string;
export type RuleCapacity = number;
export type AvailabilityZone = string;
export type VpcEndpointId = string;
export type FlowOperationId = string;
export type AzSubnet = string;
export type AnalysisReportId = string;
export type AnalysisReportNextToken = string;
export type PaginationMaxResults = number;
export type PaginationToken = string;
export type TagsPaginationMaxResults = number;
export type PolicyString = string;
export type Age = number;
export type TagKey = string;
export type EnableMonitoringDashboard = boolean;
export type AvailabilityZoneMappingString = string;
export type CollectionMember_String = string;
export type InsertPosition = number;
export type TagValue = string;
export type KeyId = string;
export type EnableTLSSessionHolding = boolean;
export type NatGatewayPort = number;
export type Port = string;
export type ProtocolString = string;
export type ConditionOperator = string;
export type ConditionKey = string;
export type ProxyConditionValue = string;
export type ErrorMessage = string;
export type StatusReason = string;
export type FlowRequestTimestamp = Date;
export type LastUpdateTime = Date;
export type VendorName = string;
export type ProductId = string;
export type ListingName = string;
export type Status = string;
export type StartTime = Date;
export type EndTime = Date;
export type ReportTime = Date;
export type Priority = number;
export type ActionName = string;
export type DeepThreatInspection = boolean;
export type AddressDefinition = string;
export type ResourceId = string;
export type NumberOfAssociations = number;
export type AWSAccountId = string;
export type CreateTime = Date;
export type DeleteTime = Date;
export type VpcEndpointServiceName = string;
export type PrivateDNSName = string;
export type UpdateTime = Date;
export type FailureCode = string;
export type FailureMessage = string;
export type FirstAccessed = Date;
export type LastAccessed = Date;
export type Domain = string;
export type PacketCount = number;
export type ByteCount = number;
export type TcpIdleTimeoutRangeBound = number;
export type RuleVariableName = string;
export type IPSetReferenceName = string;
export type ProtocolNumber = number;
export type HashMapKey = string;
export type HashMapValue = string;
export type AttachmentId = string;
export type TransitGatewayAttachmentSyncStateMessage = string;
export type ProxyConfigRuleGroupType = string;
export type ProxyConfigRuleGroupPriority = number;
export type Count = number;
export type VariableDefinition = string;
export type Source = string;
export type Destination = string;
export type Keyword = string;
export type Setting = string;
export type PortRangeBound = number;
export type ProxyRuleGroupPriorityResultPriority = number;
export type CIDRCount = number;
export type DimensionValue = string;
export type EndpointId = string;
export type StatusMessage = string;
export type IPSetArn = string;

//# Schemas
export type EnabledAnalysisType = "TLS_SNI" | "HTTP_HOST" | (string & {});
export const EnabledAnalysisType = S.String;
export type EnabledAnalysisTypes = EnabledAnalysisType[];
export const EnabledAnalysisTypes = S.Array(EnabledAnalysisType);
export type ResourceNameList = string[];
export const ResourceNameList = S.Array(S.String);
export type ResourceArnList = string[];
export const ResourceArnList = S.Array(S.String);
export type RuleGroupType = "STATELESS" | "STATEFUL" | (string & {});
export const RuleGroupType = S.String;
export type AzSubnets = string[];
export const AzSubnets = S.Array(S.String);
export type VpcIds = string[];
export const VpcIds = S.Array(S.String);
export type FlowOperationType = "FLOW_FLUSH" | "FLOW_CAPTURE" | (string & {});
export const FlowOperationType = S.String;
export type ResourceManagedStatus = "MANAGED" | "ACCOUNT" | (string & {});
export const ResourceManagedStatus = S.String;
export type ResourceManagedType =
  | "AWS_MANAGED_THREAT_SIGNATURES"
  | "AWS_MANAGED_DOMAIN_LISTS"
  | "ACTIVE_THREAT_DEFENSE"
  | "PARTNER_MANAGED"
  | (string & {});
export const ResourceManagedType = S.String;
export type SubscriptionStatus =
  | "NOT_SUBSCRIBED"
  | "SUBSCRIBED"
  | (string & {});
export const SubscriptionStatus = S.String;
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type ProxyRulePhaseAction = "ALLOW" | "DENY" | "ALERT" | (string & {});
export const ProxyRulePhaseAction = S.String;
export type RuleGroupRequestPhase =
  | "PRE_DNS"
  | "PRE_REQ"
  | "POST_RES"
  | (string & {});
export const RuleGroupRequestPhase = S.String;
export interface AcceptNetworkFirewallTransitGatewayAttachmentRequest {
  TransitGatewayAttachmentId: string;
}
export const AcceptNetworkFirewallTransitGatewayAttachmentRequest = S.suspend(
  () =>
    S.Struct({ TransitGatewayAttachmentId: S.String }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
).annotations({
  identifier: "AcceptNetworkFirewallTransitGatewayAttachmentRequest",
}) as any as S.Schema<AcceptNetworkFirewallTransitGatewayAttachmentRequest>;
export interface AssociateFirewallPolicyRequest {
  UpdateToken?: string;
  FirewallArn?: string;
  FirewallName?: string;
  FirewallPolicyArn: string;
}
export const AssociateFirewallPolicyRequest = S.suspend(() =>
  S.Struct({
    UpdateToken: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    FirewallPolicyArn: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateFirewallPolicyRequest",
}) as any as S.Schema<AssociateFirewallPolicyRequest>;
export type IPAddressType = "DUALSTACK" | "IPV4" | "IPV6" | (string & {});
export const IPAddressType = S.String;
export interface SubnetMapping {
  SubnetId: string;
  IPAddressType?: IPAddressType;
}
export const SubnetMapping = S.suspend(() =>
  S.Struct({ SubnetId: S.String, IPAddressType: S.optional(IPAddressType) }),
).annotations({
  identifier: "SubnetMapping",
}) as any as S.Schema<SubnetMapping>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateVpcEndpointAssociationRequest {
  FirewallArn: string;
  VpcId: string;
  SubnetMapping: SubnetMapping;
  Description?: string;
  Tags?: Tag[];
}
export const CreateVpcEndpointAssociationRequest = S.suspend(() =>
  S.Struct({
    FirewallArn: S.String,
    VpcId: S.String,
    SubnetMapping: SubnetMapping,
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateVpcEndpointAssociationRequest",
}) as any as S.Schema<CreateVpcEndpointAssociationRequest>;
export interface DeleteFirewallRequest {
  FirewallName?: string;
  FirewallArn?: string;
}
export const DeleteFirewallRequest = S.suspend(() =>
  S.Struct({
    FirewallName: S.optional(S.String),
    FirewallArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteFirewallRequest",
}) as any as S.Schema<DeleteFirewallRequest>;
export interface DeleteFirewallPolicyRequest {
  FirewallPolicyName?: string;
  FirewallPolicyArn?: string;
}
export const DeleteFirewallPolicyRequest = S.suspend(() =>
  S.Struct({
    FirewallPolicyName: S.optional(S.String),
    FirewallPolicyArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteFirewallPolicyRequest",
}) as any as S.Schema<DeleteFirewallPolicyRequest>;
export interface DeleteNetworkFirewallTransitGatewayAttachmentRequest {
  TransitGatewayAttachmentId: string;
}
export const DeleteNetworkFirewallTransitGatewayAttachmentRequest = S.suspend(
  () =>
    S.Struct({ TransitGatewayAttachmentId: S.String }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
).annotations({
  identifier: "DeleteNetworkFirewallTransitGatewayAttachmentRequest",
}) as any as S.Schema<DeleteNetworkFirewallTransitGatewayAttachmentRequest>;
export interface DeleteProxyRequest {
  NatGatewayId: string;
  ProxyName?: string;
  ProxyArn?: string;
}
export const DeleteProxyRequest = S.suspend(() =>
  S.Struct({
    NatGatewayId: S.String,
    ProxyName: S.optional(S.String),
    ProxyArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteProxyRequest",
}) as any as S.Schema<DeleteProxyRequest>;
export interface DeleteProxyConfigurationRequest {
  ProxyConfigurationName?: string;
  ProxyConfigurationArn?: string;
}
export const DeleteProxyConfigurationRequest = S.suspend(() =>
  S.Struct({
    ProxyConfigurationName: S.optional(S.String),
    ProxyConfigurationArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteProxyConfigurationRequest",
}) as any as S.Schema<DeleteProxyConfigurationRequest>;
export interface DeleteProxyRuleGroupRequest {
  ProxyRuleGroupName?: string;
  ProxyRuleGroupArn?: string;
}
export const DeleteProxyRuleGroupRequest = S.suspend(() =>
  S.Struct({
    ProxyRuleGroupName: S.optional(S.String),
    ProxyRuleGroupArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteProxyRuleGroupRequest",
}) as any as S.Schema<DeleteProxyRuleGroupRequest>;
export interface DeleteProxyRulesRequest {
  ProxyRuleGroupArn?: string;
  ProxyRuleGroupName?: string;
  Rules: string[];
}
export const DeleteProxyRulesRequest = S.suspend(() =>
  S.Struct({
    ProxyRuleGroupArn: S.optional(S.String),
    ProxyRuleGroupName: S.optional(S.String),
    Rules: ResourceNameList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteProxyRulesRequest",
}) as any as S.Schema<DeleteProxyRulesRequest>;
export interface DeleteResourcePolicyRequest {
  ResourceArn: string;
}
export const DeleteResourcePolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteResourcePolicyRequest",
}) as any as S.Schema<DeleteResourcePolicyRequest>;
export interface DeleteResourcePolicyResponse {}
export const DeleteResourcePolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteResourcePolicyResponse",
}) as any as S.Schema<DeleteResourcePolicyResponse>;
export interface DeleteRuleGroupRequest {
  RuleGroupName?: string;
  RuleGroupArn?: string;
  Type?: RuleGroupType;
}
export const DeleteRuleGroupRequest = S.suspend(() =>
  S.Struct({
    RuleGroupName: S.optional(S.String),
    RuleGroupArn: S.optional(S.String),
    Type: S.optional(RuleGroupType),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteRuleGroupRequest",
}) as any as S.Schema<DeleteRuleGroupRequest>;
export interface DeleteTLSInspectionConfigurationRequest {
  TLSInspectionConfigurationArn?: string;
  TLSInspectionConfigurationName?: string;
}
export const DeleteTLSInspectionConfigurationRequest = S.suspend(() =>
  S.Struct({
    TLSInspectionConfigurationArn: S.optional(S.String),
    TLSInspectionConfigurationName: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteTLSInspectionConfigurationRequest",
}) as any as S.Schema<DeleteTLSInspectionConfigurationRequest>;
export interface DeleteVpcEndpointAssociationRequest {
  VpcEndpointAssociationArn: string;
}
export const DeleteVpcEndpointAssociationRequest = S.suspend(() =>
  S.Struct({ VpcEndpointAssociationArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteVpcEndpointAssociationRequest",
}) as any as S.Schema<DeleteVpcEndpointAssociationRequest>;
export interface DescribeFirewallRequest {
  FirewallName?: string;
  FirewallArn?: string;
}
export const DescribeFirewallRequest = S.suspend(() =>
  S.Struct({
    FirewallName: S.optional(S.String),
    FirewallArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeFirewallRequest",
}) as any as S.Schema<DescribeFirewallRequest>;
export interface DescribeFirewallMetadataRequest {
  FirewallArn?: string;
}
export const DescribeFirewallMetadataRequest = S.suspend(() =>
  S.Struct({ FirewallArn: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeFirewallMetadataRequest",
}) as any as S.Schema<DescribeFirewallMetadataRequest>;
export interface DescribeFirewallPolicyRequest {
  FirewallPolicyName?: string;
  FirewallPolicyArn?: string;
}
export const DescribeFirewallPolicyRequest = S.suspend(() =>
  S.Struct({
    FirewallPolicyName: S.optional(S.String),
    FirewallPolicyArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeFirewallPolicyRequest",
}) as any as S.Schema<DescribeFirewallPolicyRequest>;
export interface DescribeFlowOperationRequest {
  FirewallArn: string;
  AvailabilityZone?: string;
  VpcEndpointAssociationArn?: string;
  VpcEndpointId?: string;
  FlowOperationId: string;
}
export const DescribeFlowOperationRequest = S.suspend(() =>
  S.Struct({
    FirewallArn: S.String,
    AvailabilityZone: S.optional(S.String),
    VpcEndpointAssociationArn: S.optional(S.String),
    VpcEndpointId: S.optional(S.String),
    FlowOperationId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeFlowOperationRequest",
}) as any as S.Schema<DescribeFlowOperationRequest>;
export interface DescribeLoggingConfigurationRequest {
  FirewallArn?: string;
  FirewallName?: string;
}
export const DescribeLoggingConfigurationRequest = S.suspend(() =>
  S.Struct({
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeLoggingConfigurationRequest",
}) as any as S.Schema<DescribeLoggingConfigurationRequest>;
export interface DescribeProxyRequest {
  ProxyName?: string;
  ProxyArn?: string;
}
export const DescribeProxyRequest = S.suspend(() =>
  S.Struct({
    ProxyName: S.optional(S.String),
    ProxyArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeProxyRequest",
}) as any as S.Schema<DescribeProxyRequest>;
export interface DescribeProxyConfigurationRequest {
  ProxyConfigurationName?: string;
  ProxyConfigurationArn?: string;
}
export const DescribeProxyConfigurationRequest = S.suspend(() =>
  S.Struct({
    ProxyConfigurationName: S.optional(S.String),
    ProxyConfigurationArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeProxyConfigurationRequest",
}) as any as S.Schema<DescribeProxyConfigurationRequest>;
export interface DescribeProxyRuleRequest {
  ProxyRuleName: string;
  ProxyRuleGroupName?: string;
  ProxyRuleGroupArn?: string;
}
export const DescribeProxyRuleRequest = S.suspend(() =>
  S.Struct({
    ProxyRuleName: S.String,
    ProxyRuleGroupName: S.optional(S.String),
    ProxyRuleGroupArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeProxyRuleRequest",
}) as any as S.Schema<DescribeProxyRuleRequest>;
export interface DescribeProxyRuleGroupRequest {
  ProxyRuleGroupName?: string;
  ProxyRuleGroupArn?: string;
}
export const DescribeProxyRuleGroupRequest = S.suspend(() =>
  S.Struct({
    ProxyRuleGroupName: S.optional(S.String),
    ProxyRuleGroupArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeProxyRuleGroupRequest",
}) as any as S.Schema<DescribeProxyRuleGroupRequest>;
export interface DescribeResourcePolicyRequest {
  ResourceArn: string;
}
export const DescribeResourcePolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeResourcePolicyRequest",
}) as any as S.Schema<DescribeResourcePolicyRequest>;
export interface DescribeRuleGroupRequest {
  RuleGroupName?: string;
  RuleGroupArn?: string;
  Type?: RuleGroupType;
  AnalyzeRuleGroup?: boolean;
}
export const DescribeRuleGroupRequest = S.suspend(() =>
  S.Struct({
    RuleGroupName: S.optional(S.String),
    RuleGroupArn: S.optional(S.String),
    Type: S.optional(RuleGroupType),
    AnalyzeRuleGroup: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeRuleGroupRequest",
}) as any as S.Schema<DescribeRuleGroupRequest>;
export interface DescribeRuleGroupMetadataRequest {
  RuleGroupName?: string;
  RuleGroupArn?: string;
  Type?: RuleGroupType;
}
export const DescribeRuleGroupMetadataRequest = S.suspend(() =>
  S.Struct({
    RuleGroupName: S.optional(S.String),
    RuleGroupArn: S.optional(S.String),
    Type: S.optional(RuleGroupType),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeRuleGroupMetadataRequest",
}) as any as S.Schema<DescribeRuleGroupMetadataRequest>;
export interface DescribeRuleGroupSummaryRequest {
  RuleGroupName?: string;
  RuleGroupArn?: string;
  Type?: RuleGroupType;
}
export const DescribeRuleGroupSummaryRequest = S.suspend(() =>
  S.Struct({
    RuleGroupName: S.optional(S.String),
    RuleGroupArn: S.optional(S.String),
    Type: S.optional(RuleGroupType),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeRuleGroupSummaryRequest",
}) as any as S.Schema<DescribeRuleGroupSummaryRequest>;
export interface DescribeTLSInspectionConfigurationRequest {
  TLSInspectionConfigurationArn?: string;
  TLSInspectionConfigurationName?: string;
}
export const DescribeTLSInspectionConfigurationRequest = S.suspend(() =>
  S.Struct({
    TLSInspectionConfigurationArn: S.optional(S.String),
    TLSInspectionConfigurationName: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeTLSInspectionConfigurationRequest",
}) as any as S.Schema<DescribeTLSInspectionConfigurationRequest>;
export interface DescribeVpcEndpointAssociationRequest {
  VpcEndpointAssociationArn: string;
}
export const DescribeVpcEndpointAssociationRequest = S.suspend(() =>
  S.Struct({ VpcEndpointAssociationArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeVpcEndpointAssociationRequest",
}) as any as S.Schema<DescribeVpcEndpointAssociationRequest>;
export interface DetachRuleGroupsFromProxyConfigurationRequest {
  ProxyConfigurationName?: string;
  ProxyConfigurationArn?: string;
  RuleGroupNames?: string[];
  RuleGroupArns?: string[];
  UpdateToken: string;
}
export const DetachRuleGroupsFromProxyConfigurationRequest = S.suspend(() =>
  S.Struct({
    ProxyConfigurationName: S.optional(S.String),
    ProxyConfigurationArn: S.optional(S.String),
    RuleGroupNames: S.optional(ResourceNameList),
    RuleGroupArns: S.optional(ResourceArnList),
    UpdateToken: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DetachRuleGroupsFromProxyConfigurationRequest",
}) as any as S.Schema<DetachRuleGroupsFromProxyConfigurationRequest>;
export interface AvailabilityZoneMapping {
  AvailabilityZone: string;
}
export const AvailabilityZoneMapping = S.suspend(() =>
  S.Struct({ AvailabilityZone: S.String }),
).annotations({
  identifier: "AvailabilityZoneMapping",
}) as any as S.Schema<AvailabilityZoneMapping>;
export type AvailabilityZoneMappings = AvailabilityZoneMapping[];
export const AvailabilityZoneMappings = S.Array(AvailabilityZoneMapping);
export interface DisassociateAvailabilityZonesRequest {
  UpdateToken?: string;
  FirewallArn?: string;
  FirewallName?: string;
  AvailabilityZoneMappings: AvailabilityZoneMapping[];
}
export const DisassociateAvailabilityZonesRequest = S.suspend(() =>
  S.Struct({
    UpdateToken: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    AvailabilityZoneMappings: AvailabilityZoneMappings,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateAvailabilityZonesRequest",
}) as any as S.Schema<DisassociateAvailabilityZonesRequest>;
export interface DisassociateSubnetsRequest {
  UpdateToken?: string;
  FirewallArn?: string;
  FirewallName?: string;
  SubnetIds: string[];
}
export const DisassociateSubnetsRequest = S.suspend(() =>
  S.Struct({
    UpdateToken: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    SubnetIds: AzSubnets,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateSubnetsRequest",
}) as any as S.Schema<DisassociateSubnetsRequest>;
export interface GetAnalysisReportResultsRequest {
  FirewallName?: string;
  AnalysisReportId: string;
  FirewallArn?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const GetAnalysisReportResultsRequest = S.suspend(() =>
  S.Struct({
    FirewallName: S.optional(S.String),
    AnalysisReportId: S.String,
    FirewallArn: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAnalysisReportResultsRequest",
}) as any as S.Schema<GetAnalysisReportResultsRequest>;
export interface ListAnalysisReportsRequest {
  FirewallName?: string;
  FirewallArn?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListAnalysisReportsRequest = S.suspend(() =>
  S.Struct({
    FirewallName: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAnalysisReportsRequest",
}) as any as S.Schema<ListAnalysisReportsRequest>;
export interface ListFirewallPoliciesRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListFirewallPoliciesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListFirewallPoliciesRequest",
}) as any as S.Schema<ListFirewallPoliciesRequest>;
export interface ListFirewallsRequest {
  NextToken?: string;
  VpcIds?: string[];
  MaxResults?: number;
}
export const ListFirewallsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    VpcIds: S.optional(VpcIds),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListFirewallsRequest",
}) as any as S.Schema<ListFirewallsRequest>;
export interface ListFlowOperationResultsRequest {
  FirewallArn: string;
  FlowOperationId: string;
  NextToken?: string;
  MaxResults?: number;
  AvailabilityZone?: string;
  VpcEndpointId?: string;
  VpcEndpointAssociationArn?: string;
}
export const ListFlowOperationResultsRequest = S.suspend(() =>
  S.Struct({
    FirewallArn: S.String,
    FlowOperationId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    AvailabilityZone: S.optional(S.String),
    VpcEndpointId: S.optional(S.String),
    VpcEndpointAssociationArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListFlowOperationResultsRequest",
}) as any as S.Schema<ListFlowOperationResultsRequest>;
export interface ListFlowOperationsRequest {
  FirewallArn: string;
  AvailabilityZone?: string;
  VpcEndpointAssociationArn?: string;
  VpcEndpointId?: string;
  FlowOperationType?: FlowOperationType;
  NextToken?: string;
  MaxResults?: number;
}
export const ListFlowOperationsRequest = S.suspend(() =>
  S.Struct({
    FirewallArn: S.String,
    AvailabilityZone: S.optional(S.String),
    VpcEndpointAssociationArn: S.optional(S.String),
    VpcEndpointId: S.optional(S.String),
    FlowOperationType: S.optional(FlowOperationType),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListFlowOperationsRequest",
}) as any as S.Schema<ListFlowOperationsRequest>;
export interface ListProxiesRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListProxiesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListProxiesRequest",
}) as any as S.Schema<ListProxiesRequest>;
export interface ListProxyConfigurationsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListProxyConfigurationsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListProxyConfigurationsRequest",
}) as any as S.Schema<ListProxyConfigurationsRequest>;
export interface ListProxyRuleGroupsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListProxyRuleGroupsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListProxyRuleGroupsRequest",
}) as any as S.Schema<ListProxyRuleGroupsRequest>;
export interface ListRuleGroupsRequest {
  NextToken?: string;
  MaxResults?: number;
  Scope?: ResourceManagedStatus;
  ManagedType?: ResourceManagedType;
  SubscriptionStatus?: SubscriptionStatus;
  Type?: RuleGroupType;
}
export const ListRuleGroupsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Scope: S.optional(ResourceManagedStatus),
    ManagedType: S.optional(ResourceManagedType),
    SubscriptionStatus: S.optional(SubscriptionStatus),
    Type: S.optional(RuleGroupType),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRuleGroupsRequest",
}) as any as S.Schema<ListRuleGroupsRequest>;
export interface ListTagsForResourceRequest {
  NextToken?: string;
  MaxResults?: number;
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ResourceArn: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ListTLSInspectionConfigurationsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListTLSInspectionConfigurationsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTLSInspectionConfigurationsRequest",
}) as any as S.Schema<ListTLSInspectionConfigurationsRequest>;
export interface ListVpcEndpointAssociationsRequest {
  NextToken?: string;
  MaxResults?: number;
  FirewallArn?: string;
}
export const ListVpcEndpointAssociationsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    FirewallArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListVpcEndpointAssociationsRequest",
}) as any as S.Schema<ListVpcEndpointAssociationsRequest>;
export interface PutResourcePolicyRequest {
  ResourceArn: string;
  Policy: string;
}
export const PutResourcePolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Policy: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutResourcePolicyRequest",
}) as any as S.Schema<PutResourcePolicyRequest>;
export interface PutResourcePolicyResponse {}
export const PutResourcePolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutResourcePolicyResponse",
}) as any as S.Schema<PutResourcePolicyResponse>;
export interface RejectNetworkFirewallTransitGatewayAttachmentRequest {
  TransitGatewayAttachmentId: string;
}
export const RejectNetworkFirewallTransitGatewayAttachmentRequest = S.suspend(
  () =>
    S.Struct({ TransitGatewayAttachmentId: S.String }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
).annotations({
  identifier: "RejectNetworkFirewallTransitGatewayAttachmentRequest",
}) as any as S.Schema<RejectNetworkFirewallTransitGatewayAttachmentRequest>;
export interface StartAnalysisReportRequest {
  FirewallName?: string;
  FirewallArn?: string;
  AnalysisType: EnabledAnalysisType;
}
export const StartAnalysisReportRequest = S.suspend(() =>
  S.Struct({
    FirewallName: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    AnalysisType: EnabledAnalysisType,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartAnalysisReportRequest",
}) as any as S.Schema<StartAnalysisReportRequest>;
export interface Address {
  AddressDefinition: string;
}
export const Address = S.suspend(() =>
  S.Struct({ AddressDefinition: S.String }),
).annotations({ identifier: "Address" }) as any as S.Schema<Address>;
export type ProtocolStrings = string[];
export const ProtocolStrings = S.Array(S.String);
export interface FlowFilter {
  SourceAddress?: Address;
  DestinationAddress?: Address;
  SourcePort?: string;
  DestinationPort?: string;
  Protocols?: string[];
}
export const FlowFilter = S.suspend(() =>
  S.Struct({
    SourceAddress: S.optional(Address),
    DestinationAddress: S.optional(Address),
    SourcePort: S.optional(S.String),
    DestinationPort: S.optional(S.String),
    Protocols: S.optional(ProtocolStrings),
  }),
).annotations({ identifier: "FlowFilter" }) as any as S.Schema<FlowFilter>;
export type FlowFilters = FlowFilter[];
export const FlowFilters = S.Array(FlowFilter);
export interface StartFlowFlushRequest {
  FirewallArn: string;
  AvailabilityZone?: string;
  VpcEndpointAssociationArn?: string;
  VpcEndpointId?: string;
  MinimumFlowAgeInSeconds?: number;
  FlowFilters: FlowFilter[];
}
export const StartFlowFlushRequest = S.suspend(() =>
  S.Struct({
    FirewallArn: S.String,
    AvailabilityZone: S.optional(S.String),
    VpcEndpointAssociationArn: S.optional(S.String),
    VpcEndpointId: S.optional(S.String),
    MinimumFlowAgeInSeconds: S.optional(S.Number),
    FlowFilters: FlowFilters,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartFlowFlushRequest",
}) as any as S.Schema<StartFlowFlushRequest>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: Tag[];
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
  TagKeys: string[];
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
export interface UpdateAvailabilityZoneChangeProtectionRequest {
  UpdateToken?: string;
  FirewallArn?: string;
  FirewallName?: string;
  AvailabilityZoneChangeProtection: boolean;
}
export const UpdateAvailabilityZoneChangeProtectionRequest = S.suspend(() =>
  S.Struct({
    UpdateToken: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    AvailabilityZoneChangeProtection: S.Boolean,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateAvailabilityZoneChangeProtectionRequest",
}) as any as S.Schema<UpdateAvailabilityZoneChangeProtectionRequest>;
export interface UpdateFirewallAnalysisSettingsRequest {
  EnabledAnalysisTypes?: EnabledAnalysisType[];
  FirewallArn?: string;
  FirewallName?: string;
  UpdateToken?: string;
}
export const UpdateFirewallAnalysisSettingsRequest = S.suspend(() =>
  S.Struct({
    EnabledAnalysisTypes: S.optional(EnabledAnalysisTypes),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    UpdateToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateFirewallAnalysisSettingsRequest",
}) as any as S.Schema<UpdateFirewallAnalysisSettingsRequest>;
export interface UpdateFirewallDeleteProtectionRequest {
  UpdateToken?: string;
  FirewallArn?: string;
  FirewallName?: string;
  DeleteProtection: boolean;
}
export const UpdateFirewallDeleteProtectionRequest = S.suspend(() =>
  S.Struct({
    UpdateToken: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    DeleteProtection: S.Boolean,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateFirewallDeleteProtectionRequest",
}) as any as S.Schema<UpdateFirewallDeleteProtectionRequest>;
export interface UpdateFirewallDescriptionRequest {
  UpdateToken?: string;
  FirewallArn?: string;
  FirewallName?: string;
  Description?: string;
}
export const UpdateFirewallDescriptionRequest = S.suspend(() =>
  S.Struct({
    UpdateToken: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    Description: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateFirewallDescriptionRequest",
}) as any as S.Schema<UpdateFirewallDescriptionRequest>;
export type EncryptionType =
  | "CUSTOMER_KMS"
  | "AWS_OWNED_KMS_KEY"
  | (string & {});
export const EncryptionType = S.String;
export interface EncryptionConfiguration {
  KeyId?: string;
  Type: EncryptionType;
}
export const EncryptionConfiguration = S.suspend(() =>
  S.Struct({ KeyId: S.optional(S.String), Type: EncryptionType }),
).annotations({
  identifier: "EncryptionConfiguration",
}) as any as S.Schema<EncryptionConfiguration>;
export interface UpdateFirewallEncryptionConfigurationRequest {
  UpdateToken?: string;
  FirewallArn?: string;
  FirewallName?: string;
  EncryptionConfiguration?: EncryptionConfiguration;
}
export const UpdateFirewallEncryptionConfigurationRequest = S.suspend(() =>
  S.Struct({
    UpdateToken: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateFirewallEncryptionConfigurationRequest",
}) as any as S.Schema<UpdateFirewallEncryptionConfigurationRequest>;
export interface StatelessRuleGroupReference {
  ResourceArn: string;
  Priority: number;
}
export const StatelessRuleGroupReference = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Priority: S.Number }),
).annotations({
  identifier: "StatelessRuleGroupReference",
}) as any as S.Schema<StatelessRuleGroupReference>;
export type StatelessRuleGroupReferences = StatelessRuleGroupReference[];
export const StatelessRuleGroupReferences = S.Array(
  StatelessRuleGroupReference,
);
export type StatelessActions = string[];
export const StatelessActions = S.Array(S.String);
export interface Dimension {
  Value: string;
}
export const Dimension = S.suspend(() =>
  S.Struct({ Value: S.String }),
).annotations({ identifier: "Dimension" }) as any as S.Schema<Dimension>;
export type Dimensions = Dimension[];
export const Dimensions = S.Array(Dimension);
export interface PublishMetricAction {
  Dimensions: Dimension[];
}
export const PublishMetricAction = S.suspend(() =>
  S.Struct({ Dimensions: Dimensions }),
).annotations({
  identifier: "PublishMetricAction",
}) as any as S.Schema<PublishMetricAction>;
export interface ActionDefinition {
  PublishMetricAction?: PublishMetricAction;
}
export const ActionDefinition = S.suspend(() =>
  S.Struct({ PublishMetricAction: S.optional(PublishMetricAction) }),
).annotations({
  identifier: "ActionDefinition",
}) as any as S.Schema<ActionDefinition>;
export interface CustomAction {
  ActionName: string;
  ActionDefinition: ActionDefinition;
}
export const CustomAction = S.suspend(() =>
  S.Struct({ ActionName: S.String, ActionDefinition: ActionDefinition }),
).annotations({ identifier: "CustomAction" }) as any as S.Schema<CustomAction>;
export type CustomActions = CustomAction[];
export const CustomActions = S.Array(CustomAction);
export type OverrideAction = "DROP_TO_ALERT" | (string & {});
export const OverrideAction = S.String;
export interface StatefulRuleGroupOverride {
  Action?: OverrideAction;
}
export const StatefulRuleGroupOverride = S.suspend(() =>
  S.Struct({ Action: S.optional(OverrideAction) }),
).annotations({
  identifier: "StatefulRuleGroupOverride",
}) as any as S.Schema<StatefulRuleGroupOverride>;
export interface StatefulRuleGroupReference {
  ResourceArn: string;
  Priority?: number;
  Override?: StatefulRuleGroupOverride;
  DeepThreatInspection?: boolean;
}
export const StatefulRuleGroupReference = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    Priority: S.optional(S.Number),
    Override: S.optional(StatefulRuleGroupOverride),
    DeepThreatInspection: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "StatefulRuleGroupReference",
}) as any as S.Schema<StatefulRuleGroupReference>;
export type StatefulRuleGroupReferences = StatefulRuleGroupReference[];
export const StatefulRuleGroupReferences = S.Array(StatefulRuleGroupReference);
export type StatefulActions = string[];
export const StatefulActions = S.Array(S.String);
export type RuleOrder = "DEFAULT_ACTION_ORDER" | "STRICT_ORDER" | (string & {});
export const RuleOrder = S.String;
export type StreamExceptionPolicy =
  | "DROP"
  | "CONTINUE"
  | "REJECT"
  | (string & {});
export const StreamExceptionPolicy = S.String;
export interface FlowTimeouts {
  TcpIdleTimeoutSeconds?: number;
}
export const FlowTimeouts = S.suspend(() =>
  S.Struct({ TcpIdleTimeoutSeconds: S.optional(S.Number) }),
).annotations({ identifier: "FlowTimeouts" }) as any as S.Schema<FlowTimeouts>;
export interface StatefulEngineOptions {
  RuleOrder?: RuleOrder;
  StreamExceptionPolicy?: StreamExceptionPolicy;
  FlowTimeouts?: FlowTimeouts;
}
export const StatefulEngineOptions = S.suspend(() =>
  S.Struct({
    RuleOrder: S.optional(RuleOrder),
    StreamExceptionPolicy: S.optional(StreamExceptionPolicy),
    FlowTimeouts: S.optional(FlowTimeouts),
  }),
).annotations({
  identifier: "StatefulEngineOptions",
}) as any as S.Schema<StatefulEngineOptions>;
export type VariableDefinitionList = string[];
export const VariableDefinitionList = S.Array(S.String);
export interface IPSet {
  Definition: string[];
}
export const IPSet = S.suspend(() =>
  S.Struct({ Definition: VariableDefinitionList }),
).annotations({ identifier: "IPSet" }) as any as S.Schema<IPSet>;
export type IPSets = { [key: string]: IPSet | undefined };
export const IPSets = S.Record({ key: S.String, value: S.UndefinedOr(IPSet) });
export interface PolicyVariables {
  RuleVariables?: { [key: string]: IPSet | undefined };
}
export const PolicyVariables = S.suspend(() =>
  S.Struct({ RuleVariables: S.optional(IPSets) }),
).annotations({
  identifier: "PolicyVariables",
}) as any as S.Schema<PolicyVariables>;
export interface FirewallPolicy {
  StatelessRuleGroupReferences?: StatelessRuleGroupReference[];
  StatelessDefaultActions: string[];
  StatelessFragmentDefaultActions: string[];
  StatelessCustomActions?: CustomAction[];
  StatefulRuleGroupReferences?: StatefulRuleGroupReference[];
  StatefulDefaultActions?: string[];
  StatefulEngineOptions?: StatefulEngineOptions;
  TLSInspectionConfigurationArn?: string;
  PolicyVariables?: PolicyVariables;
  EnableTLSSessionHolding?: boolean;
}
export const FirewallPolicy = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "FirewallPolicy",
}) as any as S.Schema<FirewallPolicy>;
export interface UpdateFirewallPolicyRequest {
  UpdateToken: string;
  FirewallPolicyArn?: string;
  FirewallPolicyName?: string;
  FirewallPolicy: FirewallPolicy;
  Description?: string;
  DryRun?: boolean;
  EncryptionConfiguration?: EncryptionConfiguration;
}
export const UpdateFirewallPolicyRequest = S.suspend(() =>
  S.Struct({
    UpdateToken: S.String,
    FirewallPolicyArn: S.optional(S.String),
    FirewallPolicyName: S.optional(S.String),
    FirewallPolicy: FirewallPolicy,
    Description: S.optional(S.String),
    DryRun: S.optional(S.Boolean),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateFirewallPolicyRequest",
}) as any as S.Schema<UpdateFirewallPolicyRequest>;
export interface UpdateFirewallPolicyChangeProtectionRequest {
  UpdateToken?: string;
  FirewallArn?: string;
  FirewallName?: string;
  FirewallPolicyChangeProtection: boolean;
}
export const UpdateFirewallPolicyChangeProtectionRequest = S.suspend(() =>
  S.Struct({
    UpdateToken: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    FirewallPolicyChangeProtection: S.Boolean,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateFirewallPolicyChangeProtectionRequest",
}) as any as S.Schema<UpdateFirewallPolicyChangeProtectionRequest>;
export type ListenerPropertyType = "HTTP" | "HTTPS" | (string & {});
export const ListenerPropertyType = S.String;
export interface ListenerPropertyRequest {
  Port: number;
  Type: ListenerPropertyType;
}
export const ListenerPropertyRequest = S.suspend(() =>
  S.Struct({ Port: S.Number, Type: ListenerPropertyType }),
).annotations({
  identifier: "ListenerPropertyRequest",
}) as any as S.Schema<ListenerPropertyRequest>;
export type ListenerPropertiesRequest = ListenerPropertyRequest[];
export const ListenerPropertiesRequest = S.Array(ListenerPropertyRequest);
export type TlsInterceptMode = "ENABLED" | "DISABLED" | (string & {});
export const TlsInterceptMode = S.String;
export interface TlsInterceptPropertiesRequest {
  PcaArn?: string;
  TlsInterceptMode?: TlsInterceptMode;
}
export const TlsInterceptPropertiesRequest = S.suspend(() =>
  S.Struct({
    PcaArn: S.optional(S.String),
    TlsInterceptMode: S.optional(TlsInterceptMode),
  }),
).annotations({
  identifier: "TlsInterceptPropertiesRequest",
}) as any as S.Schema<TlsInterceptPropertiesRequest>;
export interface UpdateProxyRequest {
  NatGatewayId: string;
  ProxyName?: string;
  ProxyArn?: string;
  ListenerPropertiesToAdd?: ListenerPropertyRequest[];
  ListenerPropertiesToRemove?: ListenerPropertyRequest[];
  TlsInterceptProperties?: TlsInterceptPropertiesRequest;
  UpdateToken: string;
}
export const UpdateProxyRequest = S.suspend(() =>
  S.Struct({
    NatGatewayId: S.String,
    ProxyName: S.optional(S.String),
    ProxyArn: S.optional(S.String),
    ListenerPropertiesToAdd: S.optional(ListenerPropertiesRequest),
    ListenerPropertiesToRemove: S.optional(ListenerPropertiesRequest),
    TlsInterceptProperties: S.optional(TlsInterceptPropertiesRequest),
    UpdateToken: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateProxyRequest",
}) as any as S.Schema<UpdateProxyRequest>;
export interface ProxyConfigDefaultRulePhaseActionsRequest {
  PreDNS?: ProxyRulePhaseAction;
  PreREQUEST?: ProxyRulePhaseAction;
  PostRESPONSE?: ProxyRulePhaseAction;
}
export const ProxyConfigDefaultRulePhaseActionsRequest = S.suspend(() =>
  S.Struct({
    PreDNS: S.optional(ProxyRulePhaseAction),
    PreREQUEST: S.optional(ProxyRulePhaseAction),
    PostRESPONSE: S.optional(ProxyRulePhaseAction),
  }),
).annotations({
  identifier: "ProxyConfigDefaultRulePhaseActionsRequest",
}) as any as S.Schema<ProxyConfigDefaultRulePhaseActionsRequest>;
export interface UpdateProxyConfigurationRequest {
  ProxyConfigurationName?: string;
  ProxyConfigurationArn?: string;
  DefaultRulePhaseActions: ProxyConfigDefaultRulePhaseActionsRequest;
  UpdateToken: string;
}
export const UpdateProxyConfigurationRequest = S.suspend(() =>
  S.Struct({
    ProxyConfigurationName: S.optional(S.String),
    ProxyConfigurationArn: S.optional(S.String),
    DefaultRulePhaseActions: ProxyConfigDefaultRulePhaseActionsRequest,
    UpdateToken: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateProxyConfigurationRequest",
}) as any as S.Schema<UpdateProxyConfigurationRequest>;
export interface PortSet {
  Definition?: string[];
}
export const PortSet = S.suspend(() =>
  S.Struct({ Definition: S.optional(VariableDefinitionList) }),
).annotations({ identifier: "PortSet" }) as any as S.Schema<PortSet>;
export type PortSets = { [key: string]: PortSet | undefined };
export const PortSets = S.Record({
  key: S.String,
  value: S.UndefinedOr(PortSet),
});
export interface RuleVariables {
  IPSets?: { [key: string]: IPSet | undefined };
  PortSets?: { [key: string]: PortSet | undefined };
}
export const RuleVariables = S.suspend(() =>
  S.Struct({ IPSets: S.optional(IPSets), PortSets: S.optional(PortSets) }),
).annotations({
  identifier: "RuleVariables",
}) as any as S.Schema<RuleVariables>;
export interface IPSetReference {
  ReferenceArn?: string;
}
export const IPSetReference = S.suspend(() =>
  S.Struct({ ReferenceArn: S.optional(S.String) }),
).annotations({
  identifier: "IPSetReference",
}) as any as S.Schema<IPSetReference>;
export type IPSetReferenceMap = { [key: string]: IPSetReference | undefined };
export const IPSetReferenceMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(IPSetReference),
});
export interface ReferenceSets {
  IPSetReferences?: { [key: string]: IPSetReference | undefined };
}
export const ReferenceSets = S.suspend(() =>
  S.Struct({ IPSetReferences: S.optional(IPSetReferenceMap) }),
).annotations({
  identifier: "ReferenceSets",
}) as any as S.Schema<ReferenceSets>;
export type RuleTargets = string[];
export const RuleTargets = S.Array(S.String);
export type TargetType = "TLS_SNI" | "HTTP_HOST" | (string & {});
export const TargetType = S.String;
export type TargetTypes = TargetType[];
export const TargetTypes = S.Array(TargetType);
export type GeneratedRulesType =
  | "ALLOWLIST"
  | "DENYLIST"
  | "REJECTLIST"
  | "ALERTLIST"
  | (string & {});
export const GeneratedRulesType = S.String;
export interface RulesSourceList {
  Targets: string[];
  TargetTypes: TargetType[];
  GeneratedRulesType: GeneratedRulesType;
}
export const RulesSourceList = S.suspend(() =>
  S.Struct({
    Targets: RuleTargets,
    TargetTypes: TargetTypes,
    GeneratedRulesType: GeneratedRulesType,
  }),
).annotations({
  identifier: "RulesSourceList",
}) as any as S.Schema<RulesSourceList>;
export type StatefulAction =
  | "PASS"
  | "DROP"
  | "ALERT"
  | "REJECT"
  | (string & {});
export const StatefulAction = S.String;
export type StatefulRuleProtocol =
  | "IP"
  | "TCP"
  | "UDP"
  | "ICMP"
  | "HTTP"
  | "FTP"
  | "TLS"
  | "SMB"
  | "DNS"
  | "DCERPC"
  | "SSH"
  | "SMTP"
  | "IMAP"
  | "MSN"
  | "KRB5"
  | "IKEV2"
  | "TFTP"
  | "NTP"
  | "DHCP"
  | "HTTP2"
  | "QUIC"
  | (string & {});
export const StatefulRuleProtocol = S.String;
export type StatefulRuleDirection = "FORWARD" | "ANY" | (string & {});
export const StatefulRuleDirection = S.String;
export interface Header {
  Protocol: StatefulRuleProtocol;
  Source: string;
  SourcePort: string;
  Direction: StatefulRuleDirection;
  Destination: string;
  DestinationPort: string;
}
export const Header = S.suspend(() =>
  S.Struct({
    Protocol: StatefulRuleProtocol,
    Source: S.String,
    SourcePort: S.String,
    Direction: StatefulRuleDirection,
    Destination: S.String,
    DestinationPort: S.String,
  }),
).annotations({ identifier: "Header" }) as any as S.Schema<Header>;
export type Settings = string[];
export const Settings = S.Array(S.String);
export interface RuleOption {
  Keyword: string;
  Settings?: string[];
}
export const RuleOption = S.suspend(() =>
  S.Struct({ Keyword: S.String, Settings: S.optional(Settings) }),
).annotations({ identifier: "RuleOption" }) as any as S.Schema<RuleOption>;
export type RuleOptions = RuleOption[];
export const RuleOptions = S.Array(RuleOption);
export interface StatefulRule {
  Action: StatefulAction;
  Header: Header;
  RuleOptions: RuleOption[];
}
export const StatefulRule = S.suspend(() =>
  S.Struct({
    Action: StatefulAction,
    Header: Header,
    RuleOptions: RuleOptions,
  }),
).annotations({ identifier: "StatefulRule" }) as any as S.Schema<StatefulRule>;
export type StatefulRules = StatefulRule[];
export const StatefulRules = S.Array(StatefulRule);
export type Addresses = Address[];
export const Addresses = S.Array(Address);
export interface PortRange {
  FromPort: number;
  ToPort: number;
}
export const PortRange = S.suspend(() =>
  S.Struct({ FromPort: S.Number, ToPort: S.Number }),
).annotations({ identifier: "PortRange" }) as any as S.Schema<PortRange>;
export type PortRanges = PortRange[];
export const PortRanges = S.Array(PortRange);
export type ProtocolNumbers = number[];
export const ProtocolNumbers = S.Array(S.Number);
export type TCPFlag =
  | "FIN"
  | "SYN"
  | "RST"
  | "PSH"
  | "ACK"
  | "URG"
  | "ECE"
  | "CWR"
  | (string & {});
export const TCPFlag = S.String;
export type Flags = TCPFlag[];
export const Flags = S.Array(TCPFlag);
export interface TCPFlagField {
  Flags: TCPFlag[];
  Masks?: TCPFlag[];
}
export const TCPFlagField = S.suspend(() =>
  S.Struct({ Flags: Flags, Masks: S.optional(Flags) }),
).annotations({ identifier: "TCPFlagField" }) as any as S.Schema<TCPFlagField>;
export type TCPFlags = TCPFlagField[];
export const TCPFlags = S.Array(TCPFlagField);
export interface MatchAttributes {
  Sources?: Address[];
  Destinations?: Address[];
  SourcePorts?: PortRange[];
  DestinationPorts?: PortRange[];
  Protocols?: number[];
  TCPFlags?: TCPFlagField[];
}
export const MatchAttributes = S.suspend(() =>
  S.Struct({
    Sources: S.optional(Addresses),
    Destinations: S.optional(Addresses),
    SourcePorts: S.optional(PortRanges),
    DestinationPorts: S.optional(PortRanges),
    Protocols: S.optional(ProtocolNumbers),
    TCPFlags: S.optional(TCPFlags),
  }),
).annotations({
  identifier: "MatchAttributes",
}) as any as S.Schema<MatchAttributes>;
export interface RuleDefinition {
  MatchAttributes: MatchAttributes;
  Actions: string[];
}
export const RuleDefinition = S.suspend(() =>
  S.Struct({ MatchAttributes: MatchAttributes, Actions: StatelessActions }),
).annotations({
  identifier: "RuleDefinition",
}) as any as S.Schema<RuleDefinition>;
export interface StatelessRule {
  RuleDefinition: RuleDefinition;
  Priority: number;
}
export const StatelessRule = S.suspend(() =>
  S.Struct({ RuleDefinition: RuleDefinition, Priority: S.Number }),
).annotations({
  identifier: "StatelessRule",
}) as any as S.Schema<StatelessRule>;
export type StatelessRules = StatelessRule[];
export const StatelessRules = S.Array(StatelessRule);
export interface StatelessRulesAndCustomActions {
  StatelessRules: StatelessRule[];
  CustomActions?: CustomAction[];
}
export const StatelessRulesAndCustomActions = S.suspend(() =>
  S.Struct({
    StatelessRules: StatelessRules,
    CustomActions: S.optional(CustomActions),
  }),
).annotations({
  identifier: "StatelessRulesAndCustomActions",
}) as any as S.Schema<StatelessRulesAndCustomActions>;
export interface RulesSource {
  RulesString?: string;
  RulesSourceList?: RulesSourceList;
  StatefulRules?: StatefulRule[];
  StatelessRulesAndCustomActions?: StatelessRulesAndCustomActions;
}
export const RulesSource = S.suspend(() =>
  S.Struct({
    RulesString: S.optional(S.String),
    RulesSourceList: S.optional(RulesSourceList),
    StatefulRules: S.optional(StatefulRules),
    StatelessRulesAndCustomActions: S.optional(StatelessRulesAndCustomActions),
  }),
).annotations({ identifier: "RulesSource" }) as any as S.Schema<RulesSource>;
export interface StatefulRuleOptions {
  RuleOrder?: RuleOrder;
}
export const StatefulRuleOptions = S.suspend(() =>
  S.Struct({ RuleOrder: S.optional(RuleOrder) }),
).annotations({
  identifier: "StatefulRuleOptions",
}) as any as S.Schema<StatefulRuleOptions>;
export interface RuleGroup {
  RuleVariables?: RuleVariables;
  ReferenceSets?: ReferenceSets;
  RulesSource: RulesSource;
  StatefulRuleOptions?: StatefulRuleOptions;
}
export const RuleGroup = S.suspend(() =>
  S.Struct({
    RuleVariables: S.optional(RuleVariables),
    ReferenceSets: S.optional(ReferenceSets),
    RulesSource: RulesSource,
    StatefulRuleOptions: S.optional(StatefulRuleOptions),
  }),
).annotations({ identifier: "RuleGroup" }) as any as S.Schema<RuleGroup>;
export interface SourceMetadata {
  SourceArn?: string;
  SourceUpdateToken?: string;
}
export const SourceMetadata = S.suspend(() =>
  S.Struct({
    SourceArn: S.optional(S.String),
    SourceUpdateToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SourceMetadata",
}) as any as S.Schema<SourceMetadata>;
export type SummaryRuleOption = "SID" | "MSG" | "METADATA" | (string & {});
export const SummaryRuleOption = S.String;
export type SummaryRuleOptions = SummaryRuleOption[];
export const SummaryRuleOptions = S.Array(SummaryRuleOption);
export interface SummaryConfiguration {
  RuleOptions?: SummaryRuleOption[];
}
export const SummaryConfiguration = S.suspend(() =>
  S.Struct({ RuleOptions: S.optional(SummaryRuleOptions) }),
).annotations({
  identifier: "SummaryConfiguration",
}) as any as S.Schema<SummaryConfiguration>;
export interface UpdateRuleGroupRequest {
  UpdateToken: string;
  RuleGroupArn?: string;
  RuleGroupName?: string;
  RuleGroup?: RuleGroup;
  Rules?: string;
  Type?: RuleGroupType;
  Description?: string;
  DryRun?: boolean;
  EncryptionConfiguration?: EncryptionConfiguration;
  SourceMetadata?: SourceMetadata;
  AnalyzeRuleGroup?: boolean;
  SummaryConfiguration?: SummaryConfiguration;
}
export const UpdateRuleGroupRequest = S.suspend(() =>
  S.Struct({
    UpdateToken: S.String,
    RuleGroupArn: S.optional(S.String),
    RuleGroupName: S.optional(S.String),
    RuleGroup: S.optional(RuleGroup),
    Rules: S.optional(S.String),
    Type: S.optional(RuleGroupType),
    Description: S.optional(S.String),
    DryRun: S.optional(S.Boolean),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
    SourceMetadata: S.optional(SourceMetadata),
    AnalyzeRuleGroup: S.optional(S.Boolean),
    SummaryConfiguration: S.optional(SummaryConfiguration),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateRuleGroupRequest",
}) as any as S.Schema<UpdateRuleGroupRequest>;
export interface UpdateSubnetChangeProtectionRequest {
  UpdateToken?: string;
  FirewallArn?: string;
  FirewallName?: string;
  SubnetChangeProtection: boolean;
}
export const UpdateSubnetChangeProtectionRequest = S.suspend(() =>
  S.Struct({
    UpdateToken: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    SubnetChangeProtection: S.Boolean,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateSubnetChangeProtectionRequest",
}) as any as S.Schema<UpdateSubnetChangeProtectionRequest>;
export interface ServerCertificate {
  ResourceArn?: string;
}
export const ServerCertificate = S.suspend(() =>
  S.Struct({ ResourceArn: S.optional(S.String) }),
).annotations({
  identifier: "ServerCertificate",
}) as any as S.Schema<ServerCertificate>;
export type ServerCertificates = ServerCertificate[];
export const ServerCertificates = S.Array(ServerCertificate);
export interface ServerCertificateScope {
  Sources?: Address[];
  Destinations?: Address[];
  SourcePorts?: PortRange[];
  DestinationPorts?: PortRange[];
  Protocols?: number[];
}
export const ServerCertificateScope = S.suspend(() =>
  S.Struct({
    Sources: S.optional(Addresses),
    Destinations: S.optional(Addresses),
    SourcePorts: S.optional(PortRanges),
    DestinationPorts: S.optional(PortRanges),
    Protocols: S.optional(ProtocolNumbers),
  }),
).annotations({
  identifier: "ServerCertificateScope",
}) as any as S.Schema<ServerCertificateScope>;
export type ServerCertificateScopes = ServerCertificateScope[];
export const ServerCertificateScopes = S.Array(ServerCertificateScope);
export type RevocationCheckAction = "PASS" | "DROP" | "REJECT" | (string & {});
export const RevocationCheckAction = S.String;
export interface CheckCertificateRevocationStatusActions {
  RevokedStatusAction?: RevocationCheckAction;
  UnknownStatusAction?: RevocationCheckAction;
}
export const CheckCertificateRevocationStatusActions = S.suspend(() =>
  S.Struct({
    RevokedStatusAction: S.optional(RevocationCheckAction),
    UnknownStatusAction: S.optional(RevocationCheckAction),
  }),
).annotations({
  identifier: "CheckCertificateRevocationStatusActions",
}) as any as S.Schema<CheckCertificateRevocationStatusActions>;
export interface ServerCertificateConfiguration {
  ServerCertificates?: ServerCertificate[];
  Scopes?: ServerCertificateScope[];
  CertificateAuthorityArn?: string;
  CheckCertificateRevocationStatus?: CheckCertificateRevocationStatusActions;
}
export const ServerCertificateConfiguration = S.suspend(() =>
  S.Struct({
    ServerCertificates: S.optional(ServerCertificates),
    Scopes: S.optional(ServerCertificateScopes),
    CertificateAuthorityArn: S.optional(S.String),
    CheckCertificateRevocationStatus: S.optional(
      CheckCertificateRevocationStatusActions,
    ),
  }),
).annotations({
  identifier: "ServerCertificateConfiguration",
}) as any as S.Schema<ServerCertificateConfiguration>;
export type ServerCertificateConfigurations = ServerCertificateConfiguration[];
export const ServerCertificateConfigurations = S.Array(
  ServerCertificateConfiguration,
);
export interface TLSInspectionConfiguration {
  ServerCertificateConfigurations?: ServerCertificateConfiguration[];
}
export const TLSInspectionConfiguration = S.suspend(() =>
  S.Struct({
    ServerCertificateConfigurations: S.optional(
      ServerCertificateConfigurations,
    ),
  }),
).annotations({
  identifier: "TLSInspectionConfiguration",
}) as any as S.Schema<TLSInspectionConfiguration>;
export interface UpdateTLSInspectionConfigurationRequest {
  TLSInspectionConfigurationArn?: string;
  TLSInspectionConfigurationName?: string;
  TLSInspectionConfiguration: TLSInspectionConfiguration;
  Description?: string;
  EncryptionConfiguration?: EncryptionConfiguration;
  UpdateToken: string;
}
export const UpdateTLSInspectionConfigurationRequest = S.suspend(() =>
  S.Struct({
    TLSInspectionConfigurationArn: S.optional(S.String),
    TLSInspectionConfigurationName: S.optional(S.String),
    TLSInspectionConfiguration: TLSInspectionConfiguration,
    Description: S.optional(S.String),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
    UpdateToken: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateTLSInspectionConfigurationRequest",
}) as any as S.Schema<UpdateTLSInspectionConfigurationRequest>;
export type ProxyConditionValueList = string[];
export const ProxyConditionValueList = S.Array(S.String);
export type TransitGatewayAttachmentStatus =
  | "CREATING"
  | "DELETING"
  | "DELETED"
  | "FAILED"
  | "ERROR"
  | "READY"
  | "PENDING_ACCEPTANCE"
  | "REJECTING"
  | "REJECTED"
  | (string & {});
export const TransitGatewayAttachmentStatus = S.String;
export type SubnetMappings = SubnetMapping[];
export const SubnetMappings = S.Array(SubnetMapping);
export interface ProxyRuleGroupAttachment {
  ProxyRuleGroupName?: string;
  InsertPosition?: number;
}
export const ProxyRuleGroupAttachment = S.suspend(() =>
  S.Struct({
    ProxyRuleGroupName: S.optional(S.String),
    InsertPosition: S.optional(S.Number),
  }),
).annotations({
  identifier: "ProxyRuleGroupAttachment",
}) as any as S.Schema<ProxyRuleGroupAttachment>;
export type ProxyRuleGroupAttachmentList = ProxyRuleGroupAttachment[];
export const ProxyRuleGroupAttachmentList = S.Array(ProxyRuleGroupAttachment);
export type FirewallStatusValue =
  | "PROVISIONING"
  | "DELETING"
  | "READY"
  | (string & {});
export const FirewallStatusValue = S.String;
export type FlowOperationStatus =
  | "COMPLETED"
  | "IN_PROGRESS"
  | "FAILED"
  | "COMPLETED_WITH_ERRORS"
  | (string & {});
export const FlowOperationStatus = S.String;
export interface ProxyRuleCondition {
  ConditionOperator?: string;
  ConditionKey?: string;
  ConditionValues?: string[];
}
export const ProxyRuleCondition = S.suspend(() =>
  S.Struct({
    ConditionOperator: S.optional(S.String),
    ConditionKey: S.optional(S.String),
    ConditionValues: S.optional(ProxyConditionValueList),
  }),
).annotations({
  identifier: "ProxyRuleCondition",
}) as any as S.Schema<ProxyRuleCondition>;
export type ProxyRuleConditionList = ProxyRuleCondition[];
export const ProxyRuleConditionList = S.Array(ProxyRuleCondition);
export interface ProxyRuleGroupPriority {
  ProxyRuleGroupName?: string;
  NewPosition?: number;
}
export const ProxyRuleGroupPriority = S.suspend(() =>
  S.Struct({
    ProxyRuleGroupName: S.optional(S.String),
    NewPosition: S.optional(S.Number),
  }),
).annotations({
  identifier: "ProxyRuleGroupPriority",
}) as any as S.Schema<ProxyRuleGroupPriority>;
export type ProxyRuleGroupPriorityList = ProxyRuleGroupPriority[];
export const ProxyRuleGroupPriorityList = S.Array(ProxyRuleGroupPriority);
export interface ProxyRulePriority {
  ProxyRuleName?: string;
  NewPosition?: number;
}
export const ProxyRulePriority = S.suspend(() =>
  S.Struct({
    ProxyRuleName: S.optional(S.String),
    NewPosition: S.optional(S.Number),
  }),
).annotations({
  identifier: "ProxyRulePriority",
}) as any as S.Schema<ProxyRulePriority>;
export type ProxyRulePriorityList = ProxyRulePriority[];
export const ProxyRulePriorityList = S.Array(ProxyRulePriority);
export type LogType = "ALERT" | "FLOW" | "TLS" | (string & {});
export const LogType = S.String;
export type LogDestinationType =
  | "S3"
  | "CloudWatchLogs"
  | "KinesisDataFirehose"
  | (string & {});
export const LogDestinationType = S.String;
export interface AcceptNetworkFirewallTransitGatewayAttachmentResponse {
  TransitGatewayAttachmentId: string;
  TransitGatewayAttachmentStatus: TransitGatewayAttachmentStatus;
}
export const AcceptNetworkFirewallTransitGatewayAttachmentResponse = S.suspend(
  () =>
    S.Struct({
      TransitGatewayAttachmentId: S.String,
      TransitGatewayAttachmentStatus: TransitGatewayAttachmentStatus,
    }),
).annotations({
  identifier: "AcceptNetworkFirewallTransitGatewayAttachmentResponse",
}) as any as S.Schema<AcceptNetworkFirewallTransitGatewayAttachmentResponse>;
export interface AssociateAvailabilityZonesRequest {
  UpdateToken?: string;
  FirewallArn?: string;
  FirewallName?: string;
  AvailabilityZoneMappings: AvailabilityZoneMapping[];
}
export const AssociateAvailabilityZonesRequest = S.suspend(() =>
  S.Struct({
    UpdateToken: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    AvailabilityZoneMappings: AvailabilityZoneMappings,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateAvailabilityZonesRequest",
}) as any as S.Schema<AssociateAvailabilityZonesRequest>;
export interface AssociateFirewallPolicyResponse {
  FirewallArn?: string;
  FirewallName?: string;
  FirewallPolicyArn?: string;
  UpdateToken?: string;
}
export const AssociateFirewallPolicyResponse = S.suspend(() =>
  S.Struct({
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    FirewallPolicyArn: S.optional(S.String),
    UpdateToken: S.optional(S.String),
  }),
).annotations({
  identifier: "AssociateFirewallPolicyResponse",
}) as any as S.Schema<AssociateFirewallPolicyResponse>;
export interface AssociateSubnetsRequest {
  UpdateToken?: string;
  FirewallArn?: string;
  FirewallName?: string;
  SubnetMappings: SubnetMapping[];
}
export const AssociateSubnetsRequest = S.suspend(() =>
  S.Struct({
    UpdateToken: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    SubnetMappings: SubnetMappings,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateSubnetsRequest",
}) as any as S.Schema<AssociateSubnetsRequest>;
export interface AttachRuleGroupsToProxyConfigurationRequest {
  ProxyConfigurationName?: string;
  ProxyConfigurationArn?: string;
  RuleGroups: ProxyRuleGroupAttachment[];
  UpdateToken: string;
}
export const AttachRuleGroupsToProxyConfigurationRequest = S.suspend(() =>
  S.Struct({
    ProxyConfigurationName: S.optional(S.String),
    ProxyConfigurationArn: S.optional(S.String),
    RuleGroups: ProxyRuleGroupAttachmentList,
    UpdateToken: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AttachRuleGroupsToProxyConfigurationRequest",
}) as any as S.Schema<AttachRuleGroupsToProxyConfigurationRequest>;
export interface CreateFirewallRequest {
  FirewallName: string;
  FirewallPolicyArn: string;
  VpcId?: string;
  SubnetMappings?: SubnetMapping[];
  DeleteProtection?: boolean;
  SubnetChangeProtection?: boolean;
  FirewallPolicyChangeProtection?: boolean;
  Description?: string;
  Tags?: Tag[];
  EncryptionConfiguration?: EncryptionConfiguration;
  EnabledAnalysisTypes?: EnabledAnalysisType[];
  TransitGatewayId?: string;
  AvailabilityZoneMappings?: AvailabilityZoneMapping[];
  AvailabilityZoneChangeProtection?: boolean;
}
export const CreateFirewallRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateFirewallRequest",
}) as any as S.Schema<CreateFirewallRequest>;
export interface CreateProxyRequest {
  ProxyName: string;
  NatGatewayId: string;
  ProxyConfigurationName?: string;
  ProxyConfigurationArn?: string;
  ListenerProperties?: ListenerPropertyRequest[];
  TlsInterceptProperties: TlsInterceptPropertiesRequest;
  Tags?: Tag[];
}
export const CreateProxyRequest = S.suspend(() =>
  S.Struct({
    ProxyName: S.String,
    NatGatewayId: S.String,
    ProxyConfigurationName: S.optional(S.String),
    ProxyConfigurationArn: S.optional(S.String),
    ListenerProperties: S.optional(ListenerPropertiesRequest),
    TlsInterceptProperties: TlsInterceptPropertiesRequest,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateProxyRequest",
}) as any as S.Schema<CreateProxyRequest>;
export interface CreateProxyConfigurationRequest {
  ProxyConfigurationName: string;
  Description?: string;
  RuleGroupNames?: string[];
  RuleGroupArns?: string[];
  DefaultRulePhaseActions: ProxyConfigDefaultRulePhaseActionsRequest;
  Tags?: Tag[];
}
export const CreateProxyConfigurationRequest = S.suspend(() =>
  S.Struct({
    ProxyConfigurationName: S.String,
    Description: S.optional(S.String),
    RuleGroupNames: S.optional(ResourceNameList),
    RuleGroupArns: S.optional(ResourceArnList),
    DefaultRulePhaseActions: ProxyConfigDefaultRulePhaseActionsRequest,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateProxyConfigurationRequest",
}) as any as S.Schema<CreateProxyConfigurationRequest>;
export interface DeleteNetworkFirewallTransitGatewayAttachmentResponse {
  TransitGatewayAttachmentId: string;
  TransitGatewayAttachmentStatus: TransitGatewayAttachmentStatus;
}
export const DeleteNetworkFirewallTransitGatewayAttachmentResponse = S.suspend(
  () =>
    S.Struct({
      TransitGatewayAttachmentId: S.String,
      TransitGatewayAttachmentStatus: TransitGatewayAttachmentStatus,
    }),
).annotations({
  identifier: "DeleteNetworkFirewallTransitGatewayAttachmentResponse",
}) as any as S.Schema<DeleteNetworkFirewallTransitGatewayAttachmentResponse>;
export interface DeleteProxyResponse {
  NatGatewayId?: string;
  ProxyName?: string;
  ProxyArn?: string;
}
export const DeleteProxyResponse = S.suspend(() =>
  S.Struct({
    NatGatewayId: S.optional(S.String),
    ProxyName: S.optional(S.String),
    ProxyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteProxyResponse",
}) as any as S.Schema<DeleteProxyResponse>;
export interface DeleteProxyConfigurationResponse {
  ProxyConfigurationName?: string;
  ProxyConfigurationArn?: string;
}
export const DeleteProxyConfigurationResponse = S.suspend(() =>
  S.Struct({
    ProxyConfigurationName: S.optional(S.String),
    ProxyConfigurationArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteProxyConfigurationResponse",
}) as any as S.Schema<DeleteProxyConfigurationResponse>;
export interface DeleteProxyRuleGroupResponse {
  ProxyRuleGroupName?: string;
  ProxyRuleGroupArn?: string;
}
export const DeleteProxyRuleGroupResponse = S.suspend(() =>
  S.Struct({
    ProxyRuleGroupName: S.optional(S.String),
    ProxyRuleGroupArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteProxyRuleGroupResponse",
}) as any as S.Schema<DeleteProxyRuleGroupResponse>;
export interface VpcEndpointAssociation {
  VpcEndpointAssociationId?: string;
  VpcEndpointAssociationArn: string;
  FirewallArn: string;
  VpcId: string;
  SubnetMapping: SubnetMapping;
  Description?: string;
  Tags?: Tag[];
}
export const VpcEndpointAssociation = S.suspend(() =>
  S.Struct({
    VpcEndpointAssociationId: S.optional(S.String),
    VpcEndpointAssociationArn: S.String,
    FirewallArn: S.String,
    VpcId: S.String,
    SubnetMapping: SubnetMapping,
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
  }),
).annotations({
  identifier: "VpcEndpointAssociation",
}) as any as S.Schema<VpcEndpointAssociation>;
export type AttachmentStatus =
  | "CREATING"
  | "DELETING"
  | "FAILED"
  | "ERROR"
  | "SCALING"
  | "READY"
  | (string & {});
export const AttachmentStatus = S.String;
export interface Attachment {
  SubnetId?: string;
  EndpointId?: string;
  Status?: AttachmentStatus;
  StatusMessage?: string;
}
export const Attachment = S.suspend(() =>
  S.Struct({
    SubnetId: S.optional(S.String),
    EndpointId: S.optional(S.String),
    Status: S.optional(AttachmentStatus),
    StatusMessage: S.optional(S.String),
  }),
).annotations({ identifier: "Attachment" }) as any as S.Schema<Attachment>;
export interface AZSyncState {
  Attachment?: Attachment;
}
export const AZSyncState = S.suspend(() =>
  S.Struct({ Attachment: S.optional(Attachment) }),
).annotations({ identifier: "AZSyncState" }) as any as S.Schema<AZSyncState>;
export type AssociationSyncState = { [key: string]: AZSyncState | undefined };
export const AssociationSyncState = S.Record({
  key: S.String,
  value: S.UndefinedOr(AZSyncState),
});
export interface VpcEndpointAssociationStatus {
  Status: FirewallStatusValue;
  AssociationSyncState?: { [key: string]: AZSyncState | undefined };
}
export const VpcEndpointAssociationStatus = S.suspend(() =>
  S.Struct({
    Status: FirewallStatusValue,
    AssociationSyncState: S.optional(AssociationSyncState),
  }),
).annotations({
  identifier: "VpcEndpointAssociationStatus",
}) as any as S.Schema<VpcEndpointAssociationStatus>;
export interface DeleteVpcEndpointAssociationResponse {
  VpcEndpointAssociation?: VpcEndpointAssociation;
  VpcEndpointAssociationStatus?: VpcEndpointAssociationStatus;
}
export const DeleteVpcEndpointAssociationResponse = S.suspend(() =>
  S.Struct({
    VpcEndpointAssociation: S.optional(VpcEndpointAssociation),
    VpcEndpointAssociationStatus: S.optional(VpcEndpointAssociationStatus),
  }),
).annotations({
  identifier: "DeleteVpcEndpointAssociationResponse",
}) as any as S.Schema<DeleteVpcEndpointAssociationResponse>;
export interface Firewall {
  FirewallName?: string;
  FirewallArn?: string;
  FirewallPolicyArn: string;
  VpcId: string;
  SubnetMappings: SubnetMapping[];
  DeleteProtection?: boolean;
  SubnetChangeProtection?: boolean;
  FirewallPolicyChangeProtection?: boolean;
  Description?: string;
  FirewallId: string;
  Tags?: Tag[];
  EncryptionConfiguration?: EncryptionConfiguration;
  NumberOfAssociations?: number;
  EnabledAnalysisTypes?: EnabledAnalysisType[];
  TransitGatewayId?: string;
  TransitGatewayOwnerAccountId?: string;
  AvailabilityZoneMappings?: AvailabilityZoneMapping[];
  AvailabilityZoneChangeProtection?: boolean;
}
export const Firewall = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Firewall" }) as any as S.Schema<Firewall>;
export type ConfigurationSyncState =
  | "PENDING"
  | "IN_SYNC"
  | "CAPACITY_CONSTRAINED"
  | (string & {});
export const ConfigurationSyncState = S.String;
export type PerObjectSyncStatus =
  | "PENDING"
  | "IN_SYNC"
  | "CAPACITY_CONSTRAINED"
  | "NOT_SUBSCRIBED"
  | "DEPRECATED"
  | (string & {});
export const PerObjectSyncStatus = S.String;
export interface PerObjectStatus {
  SyncStatus?: PerObjectSyncStatus;
  UpdateToken?: string;
}
export const PerObjectStatus = S.suspend(() =>
  S.Struct({
    SyncStatus: S.optional(PerObjectSyncStatus),
    UpdateToken: S.optional(S.String),
  }),
).annotations({
  identifier: "PerObjectStatus",
}) as any as S.Schema<PerObjectStatus>;
export type SyncStateConfig = { [key: string]: PerObjectStatus | undefined };
export const SyncStateConfig = S.Record({
  key: S.String,
  value: S.UndefinedOr(PerObjectStatus),
});
export interface SyncState {
  Attachment?: Attachment;
  Config?: { [key: string]: PerObjectStatus | undefined };
}
export const SyncState = S.suspend(() =>
  S.Struct({
    Attachment: S.optional(Attachment),
    Config: S.optional(SyncStateConfig),
  }),
).annotations({ identifier: "SyncState" }) as any as S.Schema<SyncState>;
export type SyncStates = { [key: string]: SyncState | undefined };
export const SyncStates = S.Record({
  key: S.String,
  value: S.UndefinedOr(SyncState),
});
export interface IPSetMetadata {
  ResolvedCIDRCount?: number;
}
export const IPSetMetadata = S.suspend(() =>
  S.Struct({ ResolvedCIDRCount: S.optional(S.Number) }),
).annotations({
  identifier: "IPSetMetadata",
}) as any as S.Schema<IPSetMetadata>;
export type IPSetMetadataMap = { [key: string]: IPSetMetadata | undefined };
export const IPSetMetadataMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(IPSetMetadata),
});
export interface CIDRSummary {
  AvailableCIDRCount?: number;
  UtilizedCIDRCount?: number;
  IPSetReferences?: { [key: string]: IPSetMetadata | undefined };
}
export const CIDRSummary = S.suspend(() =>
  S.Struct({
    AvailableCIDRCount: S.optional(S.Number),
    UtilizedCIDRCount: S.optional(S.Number),
    IPSetReferences: S.optional(IPSetMetadataMap),
  }),
).annotations({ identifier: "CIDRSummary" }) as any as S.Schema<CIDRSummary>;
export interface CapacityUsageSummary {
  CIDRs?: CIDRSummary;
}
export const CapacityUsageSummary = S.suspend(() =>
  S.Struct({ CIDRs: S.optional(CIDRSummary) }),
).annotations({
  identifier: "CapacityUsageSummary",
}) as any as S.Schema<CapacityUsageSummary>;
export interface TransitGatewayAttachmentSyncState {
  AttachmentId?: string;
  TransitGatewayAttachmentStatus?: TransitGatewayAttachmentStatus;
  StatusMessage?: string;
}
export const TransitGatewayAttachmentSyncState = S.suspend(() =>
  S.Struct({
    AttachmentId: S.optional(S.String),
    TransitGatewayAttachmentStatus: S.optional(TransitGatewayAttachmentStatus),
    StatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "TransitGatewayAttachmentSyncState",
}) as any as S.Schema<TransitGatewayAttachmentSyncState>;
export interface FirewallStatus {
  Status: FirewallStatusValue;
  ConfigurationSyncStateSummary: ConfigurationSyncState;
  SyncStates?: { [key: string]: SyncState | undefined };
  CapacityUsageSummary?: CapacityUsageSummary;
  TransitGatewayAttachmentSyncState?: TransitGatewayAttachmentSyncState;
}
export const FirewallStatus = S.suspend(() =>
  S.Struct({
    Status: FirewallStatusValue,
    ConfigurationSyncStateSummary: ConfigurationSyncState,
    SyncStates: S.optional(SyncStates),
    CapacityUsageSummary: S.optional(CapacityUsageSummary),
    TransitGatewayAttachmentSyncState: S.optional(
      TransitGatewayAttachmentSyncState,
    ),
  }),
).annotations({
  identifier: "FirewallStatus",
}) as any as S.Schema<FirewallStatus>;
export interface DescribeFirewallResponse {
  UpdateToken?: string;
  Firewall?: Firewall;
  FirewallStatus?: FirewallStatus;
}
export const DescribeFirewallResponse = S.suspend(() =>
  S.Struct({
    UpdateToken: S.optional(S.String),
    Firewall: S.optional(Firewall),
    FirewallStatus: S.optional(FirewallStatus),
  }),
).annotations({
  identifier: "DescribeFirewallResponse",
}) as any as S.Schema<DescribeFirewallResponse>;
export type ResourceStatus = "ACTIVE" | "DELETING" | "ERROR" | (string & {});
export const ResourceStatus = S.String;
export interface FirewallPolicyResponse {
  FirewallPolicyName: string;
  FirewallPolicyArn: string;
  FirewallPolicyId: string;
  Description?: string;
  FirewallPolicyStatus?: ResourceStatus;
  Tags?: Tag[];
  ConsumedStatelessRuleCapacity?: number;
  ConsumedStatefulRuleCapacity?: number;
  NumberOfAssociations?: number;
  EncryptionConfiguration?: EncryptionConfiguration;
  LastModifiedTime?: Date;
}
export const FirewallPolicyResponse = S.suspend(() =>
  S.Struct({
    FirewallPolicyName: S.String,
    FirewallPolicyArn: S.String,
    FirewallPolicyId: S.String,
    Description: S.optional(S.String),
    FirewallPolicyStatus: S.optional(ResourceStatus),
    Tags: S.optional(TagList),
    ConsumedStatelessRuleCapacity: S.optional(S.Number),
    ConsumedStatefulRuleCapacity: S.optional(S.Number),
    NumberOfAssociations: S.optional(S.Number),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "FirewallPolicyResponse",
}) as any as S.Schema<FirewallPolicyResponse>;
export interface DescribeFirewallPolicyResponse {
  UpdateToken: string;
  FirewallPolicyResponse: FirewallPolicyResponse;
  FirewallPolicy?: FirewallPolicy;
}
export const DescribeFirewallPolicyResponse = S.suspend(() =>
  S.Struct({
    UpdateToken: S.String,
    FirewallPolicyResponse: FirewallPolicyResponse,
    FirewallPolicy: S.optional(FirewallPolicy),
  }),
).annotations({
  identifier: "DescribeFirewallPolicyResponse",
}) as any as S.Schema<DescribeFirewallPolicyResponse>;
export type LogDestinationMap = { [key: string]: string | undefined };
export const LogDestinationMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface LogDestinationConfig {
  LogType: LogType;
  LogDestinationType: LogDestinationType;
  LogDestination: { [key: string]: string | undefined };
}
export const LogDestinationConfig = S.suspend(() =>
  S.Struct({
    LogType: LogType,
    LogDestinationType: LogDestinationType,
    LogDestination: LogDestinationMap,
  }),
).annotations({
  identifier: "LogDestinationConfig",
}) as any as S.Schema<LogDestinationConfig>;
export type LogDestinationConfigs = LogDestinationConfig[];
export const LogDestinationConfigs = S.Array(LogDestinationConfig);
export interface LoggingConfiguration {
  LogDestinationConfigs: LogDestinationConfig[];
}
export const LoggingConfiguration = S.suspend(() =>
  S.Struct({ LogDestinationConfigs: LogDestinationConfigs }),
).annotations({
  identifier: "LoggingConfiguration",
}) as any as S.Schema<LoggingConfiguration>;
export interface DescribeLoggingConfigurationResponse {
  FirewallArn?: string;
  LoggingConfiguration?: LoggingConfiguration;
  EnableMonitoringDashboard?: boolean;
}
export const DescribeLoggingConfigurationResponse = S.suspend(() =>
  S.Struct({
    FirewallArn: S.optional(S.String),
    LoggingConfiguration: S.optional(LoggingConfiguration),
    EnableMonitoringDashboard: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DescribeLoggingConfigurationResponse",
}) as any as S.Schema<DescribeLoggingConfigurationResponse>;
export interface ProxyRule {
  ProxyRuleName?: string;
  Description?: string;
  Action?: ProxyRulePhaseAction;
  Conditions?: ProxyRuleCondition[];
}
export const ProxyRule = S.suspend(() =>
  S.Struct({
    ProxyRuleName: S.optional(S.String),
    Description: S.optional(S.String),
    Action: S.optional(ProxyRulePhaseAction),
    Conditions: S.optional(ProxyRuleConditionList),
  }),
).annotations({ identifier: "ProxyRule" }) as any as S.Schema<ProxyRule>;
export interface DescribeProxyRuleResponse {
  ProxyRule?: ProxyRule;
  UpdateToken?: string;
}
export const DescribeProxyRuleResponse = S.suspend(() =>
  S.Struct({
    ProxyRule: S.optional(ProxyRule),
    UpdateToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeProxyRuleResponse",
}) as any as S.Schema<DescribeProxyRuleResponse>;
export type ProxyRuleList = ProxyRule[];
export const ProxyRuleList = S.Array(ProxyRule);
export interface ProxyRulesByRequestPhase {
  PreDNS?: ProxyRule[];
  PreREQUEST?: ProxyRule[];
  PostRESPONSE?: ProxyRule[];
}
export const ProxyRulesByRequestPhase = S.suspend(() =>
  S.Struct({
    PreDNS: S.optional(ProxyRuleList),
    PreREQUEST: S.optional(ProxyRuleList),
    PostRESPONSE: S.optional(ProxyRuleList),
  }),
).annotations({
  identifier: "ProxyRulesByRequestPhase",
}) as any as S.Schema<ProxyRulesByRequestPhase>;
export interface ProxyRuleGroup {
  ProxyRuleGroupName?: string;
  ProxyRuleGroupArn?: string;
  CreateTime?: Date;
  DeleteTime?: Date;
  Rules?: ProxyRulesByRequestPhase;
  Description?: string;
  Tags?: Tag[];
}
export const ProxyRuleGroup = S.suspend(() =>
  S.Struct({
    ProxyRuleGroupName: S.optional(S.String),
    ProxyRuleGroupArn: S.optional(S.String),
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DeleteTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Rules: S.optional(ProxyRulesByRequestPhase),
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
  }),
).annotations({
  identifier: "ProxyRuleGroup",
}) as any as S.Schema<ProxyRuleGroup>;
export interface DescribeProxyRuleGroupResponse {
  ProxyRuleGroup?: ProxyRuleGroup;
  UpdateToken?: string;
}
export const DescribeProxyRuleGroupResponse = S.suspend(() =>
  S.Struct({
    ProxyRuleGroup: S.optional(ProxyRuleGroup),
    UpdateToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeProxyRuleGroupResponse",
}) as any as S.Schema<DescribeProxyRuleGroupResponse>;
export interface DescribeResourcePolicyResponse {
  Policy?: string;
}
export const DescribeResourcePolicyResponse = S.suspend(() =>
  S.Struct({ Policy: S.optional(S.String) }),
).annotations({
  identifier: "DescribeResourcePolicyResponse",
}) as any as S.Schema<DescribeResourcePolicyResponse>;
export type RuleIdList = string[];
export const RuleIdList = S.Array(S.String);
export type IdentifiedType =
  | "STATELESS_RULE_FORWARDING_ASYMMETRICALLY"
  | "STATELESS_RULE_CONTAINS_TCP_FLAGS"
  | (string & {});
export const IdentifiedType = S.String;
export interface AnalysisResult {
  IdentifiedRuleIds?: string[];
  IdentifiedType?: IdentifiedType;
  AnalysisDetail?: string;
}
export const AnalysisResult = S.suspend(() =>
  S.Struct({
    IdentifiedRuleIds: S.optional(RuleIdList),
    IdentifiedType: S.optional(IdentifiedType),
    AnalysisDetail: S.optional(S.String),
  }),
).annotations({
  identifier: "AnalysisResult",
}) as any as S.Schema<AnalysisResult>;
export type AnalysisResultList = AnalysisResult[];
export const AnalysisResultList = S.Array(AnalysisResult);
export interface RuleGroupResponse {
  RuleGroupArn: string;
  RuleGroupName: string;
  RuleGroupId: string;
  Description?: string;
  Type?: RuleGroupType;
  Capacity?: number;
  RuleGroupStatus?: ResourceStatus;
  Tags?: Tag[];
  ConsumedCapacity?: number;
  NumberOfAssociations?: number;
  EncryptionConfiguration?: EncryptionConfiguration;
  SourceMetadata?: SourceMetadata;
  SnsTopic?: string;
  LastModifiedTime?: Date;
  AnalysisResults?: AnalysisResult[];
  SummaryConfiguration?: SummaryConfiguration;
}
export const RuleGroupResponse = S.suspend(() =>
  S.Struct({
    RuleGroupArn: S.String,
    RuleGroupName: S.String,
    RuleGroupId: S.String,
    Description: S.optional(S.String),
    Type: S.optional(RuleGroupType),
    Capacity: S.optional(S.Number),
    RuleGroupStatus: S.optional(ResourceStatus),
    Tags: S.optional(TagList),
    ConsumedCapacity: S.optional(S.Number),
    NumberOfAssociations: S.optional(S.Number),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
    SourceMetadata: S.optional(SourceMetadata),
    SnsTopic: S.optional(S.String),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AnalysisResults: S.optional(AnalysisResultList),
    SummaryConfiguration: S.optional(SummaryConfiguration),
  }),
).annotations({
  identifier: "RuleGroupResponse",
}) as any as S.Schema<RuleGroupResponse>;
export interface DescribeRuleGroupResponse {
  UpdateToken: string;
  RuleGroup?: RuleGroup;
  RuleGroupResponse: RuleGroupResponse;
}
export const DescribeRuleGroupResponse = S.suspend(() =>
  S.Struct({
    UpdateToken: S.String,
    RuleGroup: S.optional(RuleGroup),
    RuleGroupResponse: RuleGroupResponse,
  }),
).annotations({
  identifier: "DescribeRuleGroupResponse",
}) as any as S.Schema<DescribeRuleGroupResponse>;
export interface DescribeRuleGroupMetadataResponse {
  RuleGroupArn: string;
  RuleGroupName: string;
  Description?: string;
  Type?: RuleGroupType;
  Capacity?: number;
  StatefulRuleOptions?: StatefulRuleOptions;
  LastModifiedTime?: Date;
  VendorName?: string;
  ProductId?: string;
  ListingName?: string;
}
export const DescribeRuleGroupMetadataResponse = S.suspend(() =>
  S.Struct({
    RuleGroupArn: S.String,
    RuleGroupName: S.String,
    Description: S.optional(S.String),
    Type: S.optional(RuleGroupType),
    Capacity: S.optional(S.Number),
    StatefulRuleOptions: S.optional(StatefulRuleOptions),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    VendorName: S.optional(S.String),
    ProductId: S.optional(S.String),
    ListingName: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeRuleGroupMetadataResponse",
}) as any as S.Schema<DescribeRuleGroupMetadataResponse>;
export interface TlsCertificateData {
  CertificateArn?: string;
  CertificateSerial?: string;
  Status?: string;
  StatusMessage?: string;
}
export const TlsCertificateData = S.suspend(() =>
  S.Struct({
    CertificateArn: S.optional(S.String),
    CertificateSerial: S.optional(S.String),
    Status: S.optional(S.String),
    StatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "TlsCertificateData",
}) as any as S.Schema<TlsCertificateData>;
export type Certificates = TlsCertificateData[];
export const Certificates = S.Array(TlsCertificateData);
export interface TLSInspectionConfigurationResponse {
  TLSInspectionConfigurationArn: string;
  TLSInspectionConfigurationName: string;
  TLSInspectionConfigurationId: string;
  TLSInspectionConfigurationStatus?: ResourceStatus;
  Description?: string;
  Tags?: Tag[];
  LastModifiedTime?: Date;
  NumberOfAssociations?: number;
  EncryptionConfiguration?: EncryptionConfiguration;
  Certificates?: TlsCertificateData[];
  CertificateAuthority?: TlsCertificateData;
}
export const TLSInspectionConfigurationResponse = S.suspend(() =>
  S.Struct({
    TLSInspectionConfigurationArn: S.String,
    TLSInspectionConfigurationName: S.String,
    TLSInspectionConfigurationId: S.String,
    TLSInspectionConfigurationStatus: S.optional(ResourceStatus),
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    NumberOfAssociations: S.optional(S.Number),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
    Certificates: S.optional(Certificates),
    CertificateAuthority: S.optional(TlsCertificateData),
  }),
).annotations({
  identifier: "TLSInspectionConfigurationResponse",
}) as any as S.Schema<TLSInspectionConfigurationResponse>;
export interface DescribeTLSInspectionConfigurationResponse {
  UpdateToken: string;
  TLSInspectionConfiguration?: TLSInspectionConfiguration;
  TLSInspectionConfigurationResponse: TLSInspectionConfigurationResponse;
}
export const DescribeTLSInspectionConfigurationResponse = S.suspend(() =>
  S.Struct({
    UpdateToken: S.String,
    TLSInspectionConfiguration: S.optional(TLSInspectionConfiguration),
    TLSInspectionConfigurationResponse: TLSInspectionConfigurationResponse,
  }),
).annotations({
  identifier: "DescribeTLSInspectionConfigurationResponse",
}) as any as S.Schema<DescribeTLSInspectionConfigurationResponse>;
export interface DescribeVpcEndpointAssociationResponse {
  VpcEndpointAssociation?: VpcEndpointAssociation;
  VpcEndpointAssociationStatus?: VpcEndpointAssociationStatus;
}
export const DescribeVpcEndpointAssociationResponse = S.suspend(() =>
  S.Struct({
    VpcEndpointAssociation: S.optional(VpcEndpointAssociation),
    VpcEndpointAssociationStatus: S.optional(VpcEndpointAssociationStatus),
  }),
).annotations({
  identifier: "DescribeVpcEndpointAssociationResponse",
}) as any as S.Schema<DescribeVpcEndpointAssociationResponse>;
export interface ProxyConfigRuleGroup {
  ProxyRuleGroupName?: string;
  ProxyRuleGroupArn?: string;
  Type?: string;
  Priority?: number;
}
export const ProxyConfigRuleGroup = S.suspend(() =>
  S.Struct({
    ProxyRuleGroupName: S.optional(S.String),
    ProxyRuleGroupArn: S.optional(S.String),
    Type: S.optional(S.String),
    Priority: S.optional(S.Number),
  }),
).annotations({
  identifier: "ProxyConfigRuleGroup",
}) as any as S.Schema<ProxyConfigRuleGroup>;
export type ProxyConfigRuleGroupSet = ProxyConfigRuleGroup[];
export const ProxyConfigRuleGroupSet = S.Array(ProxyConfigRuleGroup);
export interface ProxyConfiguration {
  ProxyConfigurationName?: string;
  ProxyConfigurationArn?: string;
  Description?: string;
  CreateTime?: Date;
  DeleteTime?: Date;
  RuleGroups?: ProxyConfigRuleGroup[];
  DefaultRulePhaseActions?: ProxyConfigDefaultRulePhaseActionsRequest;
  Tags?: Tag[];
}
export const ProxyConfiguration = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ProxyConfiguration",
}) as any as S.Schema<ProxyConfiguration>;
export interface DetachRuleGroupsFromProxyConfigurationResponse {
  ProxyConfiguration?: ProxyConfiguration;
  UpdateToken?: string;
}
export const DetachRuleGroupsFromProxyConfigurationResponse = S.suspend(() =>
  S.Struct({
    ProxyConfiguration: S.optional(ProxyConfiguration),
    UpdateToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DetachRuleGroupsFromProxyConfigurationResponse",
}) as any as S.Schema<DetachRuleGroupsFromProxyConfigurationResponse>;
export interface DisassociateAvailabilityZonesResponse {
  FirewallArn?: string;
  FirewallName?: string;
  AvailabilityZoneMappings?: AvailabilityZoneMapping[];
  UpdateToken?: string;
}
export const DisassociateAvailabilityZonesResponse = S.suspend(() =>
  S.Struct({
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    AvailabilityZoneMappings: S.optional(AvailabilityZoneMappings),
    UpdateToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DisassociateAvailabilityZonesResponse",
}) as any as S.Schema<DisassociateAvailabilityZonesResponse>;
export interface DisassociateSubnetsResponse {
  FirewallArn?: string;
  FirewallName?: string;
  SubnetMappings?: SubnetMapping[];
  UpdateToken?: string;
}
export const DisassociateSubnetsResponse = S.suspend(() =>
  S.Struct({
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    SubnetMappings: S.optional(SubnetMappings),
    UpdateToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DisassociateSubnetsResponse",
}) as any as S.Schema<DisassociateSubnetsResponse>;
export interface ListTagsForResourceResponse {
  NextToken?: string;
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String), Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface RejectNetworkFirewallTransitGatewayAttachmentResponse {
  TransitGatewayAttachmentId: string;
  TransitGatewayAttachmentStatus: TransitGatewayAttachmentStatus;
}
export const RejectNetworkFirewallTransitGatewayAttachmentResponse = S.suspend(
  () =>
    S.Struct({
      TransitGatewayAttachmentId: S.String,
      TransitGatewayAttachmentStatus: TransitGatewayAttachmentStatus,
    }),
).annotations({
  identifier: "RejectNetworkFirewallTransitGatewayAttachmentResponse",
}) as any as S.Schema<RejectNetworkFirewallTransitGatewayAttachmentResponse>;
export interface StartAnalysisReportResponse {
  AnalysisReportId: string;
}
export const StartAnalysisReportResponse = S.suspend(() =>
  S.Struct({ AnalysisReportId: S.String }),
).annotations({
  identifier: "StartAnalysisReportResponse",
}) as any as S.Schema<StartAnalysisReportResponse>;
export interface StartFlowFlushResponse {
  FirewallArn?: string;
  FlowOperationId?: string;
  FlowOperationStatus?: FlowOperationStatus;
}
export const StartFlowFlushResponse = S.suspend(() =>
  S.Struct({
    FirewallArn: S.optional(S.String),
    FlowOperationId: S.optional(S.String),
    FlowOperationStatus: S.optional(FlowOperationStatus),
  }),
).annotations({
  identifier: "StartFlowFlushResponse",
}) as any as S.Schema<StartFlowFlushResponse>;
export interface UpdateAvailabilityZoneChangeProtectionResponse {
  UpdateToken?: string;
  FirewallArn?: string;
  FirewallName?: string;
  AvailabilityZoneChangeProtection?: boolean;
}
export const UpdateAvailabilityZoneChangeProtectionResponse = S.suspend(() =>
  S.Struct({
    UpdateToken: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    AvailabilityZoneChangeProtection: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "UpdateAvailabilityZoneChangeProtectionResponse",
}) as any as S.Schema<UpdateAvailabilityZoneChangeProtectionResponse>;
export interface UpdateFirewallAnalysisSettingsResponse {
  EnabledAnalysisTypes?: EnabledAnalysisType[];
  FirewallArn?: string;
  FirewallName?: string;
  UpdateToken?: string;
}
export const UpdateFirewallAnalysisSettingsResponse = S.suspend(() =>
  S.Struct({
    EnabledAnalysisTypes: S.optional(EnabledAnalysisTypes),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    UpdateToken: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateFirewallAnalysisSettingsResponse",
}) as any as S.Schema<UpdateFirewallAnalysisSettingsResponse>;
export interface UpdateFirewallDeleteProtectionResponse {
  FirewallArn?: string;
  FirewallName?: string;
  DeleteProtection?: boolean;
  UpdateToken?: string;
}
export const UpdateFirewallDeleteProtectionResponse = S.suspend(() =>
  S.Struct({
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    DeleteProtection: S.optional(S.Boolean),
    UpdateToken: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateFirewallDeleteProtectionResponse",
}) as any as S.Schema<UpdateFirewallDeleteProtectionResponse>;
export interface UpdateFirewallDescriptionResponse {
  FirewallArn?: string;
  FirewallName?: string;
  Description?: string;
  UpdateToken?: string;
}
export const UpdateFirewallDescriptionResponse = S.suspend(() =>
  S.Struct({
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    Description: S.optional(S.String),
    UpdateToken: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateFirewallDescriptionResponse",
}) as any as S.Schema<UpdateFirewallDescriptionResponse>;
export interface UpdateFirewallEncryptionConfigurationResponse {
  FirewallArn?: string;
  FirewallName?: string;
  UpdateToken?: string;
  EncryptionConfiguration?: EncryptionConfiguration;
}
export const UpdateFirewallEncryptionConfigurationResponse = S.suspend(() =>
  S.Struct({
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    UpdateToken: S.optional(S.String),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
  }),
).annotations({
  identifier: "UpdateFirewallEncryptionConfigurationResponse",
}) as any as S.Schema<UpdateFirewallEncryptionConfigurationResponse>;
export interface UpdateFirewallPolicyResponse {
  UpdateToken: string;
  FirewallPolicyResponse: FirewallPolicyResponse;
}
export const UpdateFirewallPolicyResponse = S.suspend(() =>
  S.Struct({
    UpdateToken: S.String,
    FirewallPolicyResponse: FirewallPolicyResponse,
  }),
).annotations({
  identifier: "UpdateFirewallPolicyResponse",
}) as any as S.Schema<UpdateFirewallPolicyResponse>;
export interface UpdateFirewallPolicyChangeProtectionResponse {
  UpdateToken?: string;
  FirewallArn?: string;
  FirewallName?: string;
  FirewallPolicyChangeProtection?: boolean;
}
export const UpdateFirewallPolicyChangeProtectionResponse = S.suspend(() =>
  S.Struct({
    UpdateToken: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    FirewallPolicyChangeProtection: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "UpdateFirewallPolicyChangeProtectionResponse",
}) as any as S.Schema<UpdateFirewallPolicyChangeProtectionResponse>;
export interface UpdateProxyConfigurationResponse {
  ProxyConfiguration?: ProxyConfiguration;
  UpdateToken?: string;
}
export const UpdateProxyConfigurationResponse = S.suspend(() =>
  S.Struct({
    ProxyConfiguration: S.optional(ProxyConfiguration),
    UpdateToken: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateProxyConfigurationResponse",
}) as any as S.Schema<UpdateProxyConfigurationResponse>;
export interface UpdateProxyRuleRequest {
  ProxyRuleGroupName?: string;
  ProxyRuleGroupArn?: string;
  ProxyRuleName: string;
  Description?: string;
  Action?: ProxyRulePhaseAction;
  AddConditions?: ProxyRuleCondition[];
  RemoveConditions?: ProxyRuleCondition[];
  UpdateToken: string;
}
export const UpdateProxyRuleRequest = S.suspend(() =>
  S.Struct({
    ProxyRuleGroupName: S.optional(S.String),
    ProxyRuleGroupArn: S.optional(S.String),
    ProxyRuleName: S.String,
    Description: S.optional(S.String),
    Action: S.optional(ProxyRulePhaseAction),
    AddConditions: S.optional(ProxyRuleConditionList),
    RemoveConditions: S.optional(ProxyRuleConditionList),
    UpdateToken: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateProxyRuleRequest",
}) as any as S.Schema<UpdateProxyRuleRequest>;
export interface UpdateProxyRuleGroupPrioritiesRequest {
  ProxyConfigurationName?: string;
  ProxyConfigurationArn?: string;
  RuleGroups: ProxyRuleGroupPriority[];
  UpdateToken: string;
}
export const UpdateProxyRuleGroupPrioritiesRequest = S.suspend(() =>
  S.Struct({
    ProxyConfigurationName: S.optional(S.String),
    ProxyConfigurationArn: S.optional(S.String),
    RuleGroups: ProxyRuleGroupPriorityList,
    UpdateToken: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateProxyRuleGroupPrioritiesRequest",
}) as any as S.Schema<UpdateProxyRuleGroupPrioritiesRequest>;
export interface UpdateProxyRulePrioritiesRequest {
  ProxyRuleGroupName?: string;
  ProxyRuleGroupArn?: string;
  RuleGroupRequestPhase: RuleGroupRequestPhase;
  Rules: ProxyRulePriority[];
  UpdateToken: string;
}
export const UpdateProxyRulePrioritiesRequest = S.suspend(() =>
  S.Struct({
    ProxyRuleGroupName: S.optional(S.String),
    ProxyRuleGroupArn: S.optional(S.String),
    RuleGroupRequestPhase: RuleGroupRequestPhase,
    Rules: ProxyRulePriorityList,
    UpdateToken: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateProxyRulePrioritiesRequest",
}) as any as S.Schema<UpdateProxyRulePrioritiesRequest>;
export interface UpdateRuleGroupResponse {
  UpdateToken: string;
  RuleGroupResponse: RuleGroupResponse;
}
export const UpdateRuleGroupResponse = S.suspend(() =>
  S.Struct({ UpdateToken: S.String, RuleGroupResponse: RuleGroupResponse }),
).annotations({
  identifier: "UpdateRuleGroupResponse",
}) as any as S.Schema<UpdateRuleGroupResponse>;
export interface UpdateSubnetChangeProtectionResponse {
  UpdateToken?: string;
  FirewallArn?: string;
  FirewallName?: string;
  SubnetChangeProtection?: boolean;
}
export const UpdateSubnetChangeProtectionResponse = S.suspend(() =>
  S.Struct({
    UpdateToken: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    SubnetChangeProtection: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "UpdateSubnetChangeProtectionResponse",
}) as any as S.Schema<UpdateSubnetChangeProtectionResponse>;
export interface UpdateTLSInspectionConfigurationResponse {
  UpdateToken: string;
  TLSInspectionConfigurationResponse: TLSInspectionConfigurationResponse;
}
export const UpdateTLSInspectionConfigurationResponse = S.suspend(() =>
  S.Struct({
    UpdateToken: S.String,
    TLSInspectionConfigurationResponse: TLSInspectionConfigurationResponse,
  }),
).annotations({
  identifier: "UpdateTLSInspectionConfigurationResponse",
}) as any as S.Schema<UpdateTLSInspectionConfigurationResponse>;
export interface CreateProxyRule {
  ProxyRuleName?: string;
  Description?: string;
  Action?: ProxyRulePhaseAction;
  Conditions?: ProxyRuleCondition[];
  InsertPosition?: number;
}
export const CreateProxyRule = S.suspend(() =>
  S.Struct({
    ProxyRuleName: S.optional(S.String),
    Description: S.optional(S.String),
    Action: S.optional(ProxyRulePhaseAction),
    Conditions: S.optional(ProxyRuleConditionList),
    InsertPosition: S.optional(S.Number),
  }),
).annotations({
  identifier: "CreateProxyRule",
}) as any as S.Schema<CreateProxyRule>;
export type CreateProxyRuleList = CreateProxyRule[];
export const CreateProxyRuleList = S.Array(CreateProxyRule);
export type ProxyState =
  | "ATTACHING"
  | "ATTACHED"
  | "DETACHING"
  | "DETACHED"
  | "ATTACH_FAILED"
  | "DETACH_FAILED"
  | (string & {});
export const ProxyState = S.String;
export type ProxyModifyState =
  | "MODIFYING"
  | "COMPLETED"
  | "FAILED"
  | (string & {});
export const ProxyModifyState = S.String;
export interface CreateProxyRulesByRequestPhase {
  PreDNS?: CreateProxyRule[];
  PreREQUEST?: CreateProxyRule[];
  PostRESPONSE?: CreateProxyRule[];
}
export const CreateProxyRulesByRequestPhase = S.suspend(() =>
  S.Struct({
    PreDNS: S.optional(CreateProxyRuleList),
    PreREQUEST: S.optional(CreateProxyRuleList),
    PostRESPONSE: S.optional(CreateProxyRuleList),
  }),
).annotations({
  identifier: "CreateProxyRulesByRequestPhase",
}) as any as S.Schema<CreateProxyRulesByRequestPhase>;
export interface FlowOperation {
  MinimumFlowAgeInSeconds?: number;
  FlowFilters?: FlowFilter[];
}
export const FlowOperation = S.suspend(() =>
  S.Struct({
    MinimumFlowAgeInSeconds: S.optional(S.Number),
    FlowFilters: S.optional(FlowFilters),
  }),
).annotations({
  identifier: "FlowOperation",
}) as any as S.Schema<FlowOperation>;
export interface AnalysisReport {
  AnalysisReportId?: string;
  AnalysisType?: EnabledAnalysisType;
  ReportTime?: Date;
  Status?: string;
}
export const AnalysisReport = S.suspend(() =>
  S.Struct({
    AnalysisReportId: S.optional(S.String),
    AnalysisType: S.optional(EnabledAnalysisType),
    ReportTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "AnalysisReport",
}) as any as S.Schema<AnalysisReport>;
export type AnalysisReports = AnalysisReport[];
export const AnalysisReports = S.Array(AnalysisReport);
export interface FirewallPolicyMetadata {
  Name?: string;
  Arn?: string;
}
export const FirewallPolicyMetadata = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Arn: S.optional(S.String) }),
).annotations({
  identifier: "FirewallPolicyMetadata",
}) as any as S.Schema<FirewallPolicyMetadata>;
export type FirewallPolicies = FirewallPolicyMetadata[];
export const FirewallPolicies = S.Array(FirewallPolicyMetadata);
export interface FirewallMetadata {
  FirewallName?: string;
  FirewallArn?: string;
  TransitGatewayAttachmentId?: string;
}
export const FirewallMetadata = S.suspend(() =>
  S.Struct({
    FirewallName: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    TransitGatewayAttachmentId: S.optional(S.String),
  }),
).annotations({
  identifier: "FirewallMetadata",
}) as any as S.Schema<FirewallMetadata>;
export type Firewalls = FirewallMetadata[];
export const Firewalls = S.Array(FirewallMetadata);
export interface Flow {
  SourceAddress?: Address;
  DestinationAddress?: Address;
  SourcePort?: string;
  DestinationPort?: string;
  Protocol?: string;
  Age?: number;
  PacketCount?: number;
  ByteCount?: number;
}
export const Flow = S.suspend(() =>
  S.Struct({
    SourceAddress: S.optional(Address),
    DestinationAddress: S.optional(Address),
    SourcePort: S.optional(S.String),
    DestinationPort: S.optional(S.String),
    Protocol: S.optional(S.String),
    Age: S.optional(S.Number),
    PacketCount: S.optional(S.Number),
    ByteCount: S.optional(S.Number),
  }),
).annotations({ identifier: "Flow" }) as any as S.Schema<Flow>;
export type Flows = Flow[];
export const Flows = S.Array(Flow);
export interface FlowOperationMetadata {
  FlowOperationId?: string;
  FlowOperationType?: FlowOperationType;
  FlowRequestTimestamp?: Date;
  FlowOperationStatus?: FlowOperationStatus;
}
export const FlowOperationMetadata = S.suspend(() =>
  S.Struct({
    FlowOperationId: S.optional(S.String),
    FlowOperationType: S.optional(FlowOperationType),
    FlowRequestTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    FlowOperationStatus: S.optional(FlowOperationStatus),
  }),
).annotations({
  identifier: "FlowOperationMetadata",
}) as any as S.Schema<FlowOperationMetadata>;
export type FlowOperations = FlowOperationMetadata[];
export const FlowOperations = S.Array(FlowOperationMetadata);
export interface ProxyMetadata {
  Name?: string;
  Arn?: string;
}
export const ProxyMetadata = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Arn: S.optional(S.String) }),
).annotations({
  identifier: "ProxyMetadata",
}) as any as S.Schema<ProxyMetadata>;
export type Proxies = ProxyMetadata[];
export const Proxies = S.Array(ProxyMetadata);
export interface ProxyConfigurationMetadata {
  Name?: string;
  Arn?: string;
}
export const ProxyConfigurationMetadata = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Arn: S.optional(S.String) }),
).annotations({
  identifier: "ProxyConfigurationMetadata",
}) as any as S.Schema<ProxyConfigurationMetadata>;
export type ProxyConfigurations = ProxyConfigurationMetadata[];
export const ProxyConfigurations = S.Array(ProxyConfigurationMetadata);
export interface ProxyRuleGroupMetadata {
  Name?: string;
  Arn?: string;
}
export const ProxyRuleGroupMetadata = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Arn: S.optional(S.String) }),
).annotations({
  identifier: "ProxyRuleGroupMetadata",
}) as any as S.Schema<ProxyRuleGroupMetadata>;
export type ProxyRuleGroups = ProxyRuleGroupMetadata[];
export const ProxyRuleGroups = S.Array(ProxyRuleGroupMetadata);
export interface RuleGroupMetadata {
  Name?: string;
  Arn?: string;
  VendorName?: string;
}
export const RuleGroupMetadata = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    VendorName: S.optional(S.String),
  }),
).annotations({
  identifier: "RuleGroupMetadata",
}) as any as S.Schema<RuleGroupMetadata>;
export type RuleGroups = RuleGroupMetadata[];
export const RuleGroups = S.Array(RuleGroupMetadata);
export interface TLSInspectionConfigurationMetadata {
  Name?: string;
  Arn?: string;
}
export const TLSInspectionConfigurationMetadata = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Arn: S.optional(S.String) }),
).annotations({
  identifier: "TLSInspectionConfigurationMetadata",
}) as any as S.Schema<TLSInspectionConfigurationMetadata>;
export type TLSInspectionConfigurations = TLSInspectionConfigurationMetadata[];
export const TLSInspectionConfigurations = S.Array(
  TLSInspectionConfigurationMetadata,
);
export interface VpcEndpointAssociationMetadata {
  VpcEndpointAssociationArn?: string;
}
export const VpcEndpointAssociationMetadata = S.suspend(() =>
  S.Struct({ VpcEndpointAssociationArn: S.optional(S.String) }),
).annotations({
  identifier: "VpcEndpointAssociationMetadata",
}) as any as S.Schema<VpcEndpointAssociationMetadata>;
export type VpcEndpointAssociations = VpcEndpointAssociationMetadata[];
export const VpcEndpointAssociations = S.Array(VpcEndpointAssociationMetadata);
export interface ListenerProperty {
  Port?: number;
  Type?: ListenerPropertyType;
}
export const ListenerProperty = S.suspend(() =>
  S.Struct({
    Port: S.optional(S.Number),
    Type: S.optional(ListenerPropertyType),
  }),
).annotations({
  identifier: "ListenerProperty",
}) as any as S.Schema<ListenerProperty>;
export type ListenerProperties = ListenerProperty[];
export const ListenerProperties = S.Array(ListenerProperty);
export interface TlsInterceptProperties {
  PcaArn?: string;
  TlsInterceptMode?: TlsInterceptMode;
}
export const TlsInterceptProperties = S.suspend(() =>
  S.Struct({
    PcaArn: S.optional(S.String),
    TlsInterceptMode: S.optional(TlsInterceptMode),
  }),
).annotations({
  identifier: "TlsInterceptProperties",
}) as any as S.Schema<TlsInterceptProperties>;
export interface Proxy {
  CreateTime?: Date;
  DeleteTime?: Date;
  UpdateTime?: Date;
  FailureCode?: string;
  FailureMessage?: string;
  ProxyState?: ProxyState;
  ProxyModifyState?: ProxyModifyState;
  NatGatewayId?: string;
  ProxyConfigurationName?: string;
  ProxyConfigurationArn?: string;
  ProxyName?: string;
  ProxyArn?: string;
  ListenerProperties?: ListenerProperty[];
  TlsInterceptProperties?: TlsInterceptProperties;
  Tags?: Tag[];
}
export const Proxy = S.suspend(() =>
  S.Struct({
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DeleteTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FailureCode: S.optional(S.String),
    FailureMessage: S.optional(S.String),
    ProxyState: S.optional(ProxyState),
    ProxyModifyState: S.optional(ProxyModifyState),
    NatGatewayId: S.optional(S.String),
    ProxyConfigurationName: S.optional(S.String),
    ProxyConfigurationArn: S.optional(S.String),
    ProxyName: S.optional(S.String),
    ProxyArn: S.optional(S.String),
    ListenerProperties: S.optional(ListenerProperties),
    TlsInterceptProperties: S.optional(TlsInterceptProperties),
    Tags: S.optional(TagList),
  }),
).annotations({ identifier: "Proxy" }) as any as S.Schema<Proxy>;
export interface AssociateAvailabilityZonesResponse {
  FirewallArn?: string;
  FirewallName?: string;
  AvailabilityZoneMappings?: AvailabilityZoneMapping[];
  UpdateToken?: string;
}
export const AssociateAvailabilityZonesResponse = S.suspend(() =>
  S.Struct({
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    AvailabilityZoneMappings: S.optional(AvailabilityZoneMappings),
    UpdateToken: S.optional(S.String),
  }),
).annotations({
  identifier: "AssociateAvailabilityZonesResponse",
}) as any as S.Schema<AssociateAvailabilityZonesResponse>;
export interface AssociateSubnetsResponse {
  FirewallArn?: string;
  FirewallName?: string;
  SubnetMappings?: SubnetMapping[];
  UpdateToken?: string;
}
export const AssociateSubnetsResponse = S.suspend(() =>
  S.Struct({
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    SubnetMappings: S.optional(SubnetMappings),
    UpdateToken: S.optional(S.String),
  }),
).annotations({
  identifier: "AssociateSubnetsResponse",
}) as any as S.Schema<AssociateSubnetsResponse>;
export interface AttachRuleGroupsToProxyConfigurationResponse {
  ProxyConfiguration?: ProxyConfiguration;
  UpdateToken?: string;
}
export const AttachRuleGroupsToProxyConfigurationResponse = S.suspend(() =>
  S.Struct({
    ProxyConfiguration: S.optional(ProxyConfiguration),
    UpdateToken: S.optional(S.String),
  }),
).annotations({
  identifier: "AttachRuleGroupsToProxyConfigurationResponse",
}) as any as S.Schema<AttachRuleGroupsToProxyConfigurationResponse>;
export interface CreateFirewallResponse {
  Firewall?: Firewall;
  FirewallStatus?: FirewallStatus;
}
export const CreateFirewallResponse = S.suspend(() =>
  S.Struct({
    Firewall: S.optional(Firewall),
    FirewallStatus: S.optional(FirewallStatus),
  }),
).annotations({
  identifier: "CreateFirewallResponse",
}) as any as S.Schema<CreateFirewallResponse>;
export interface CreateProxyResponse {
  Proxy?: Proxy;
  UpdateToken?: string;
}
export const CreateProxyResponse = S.suspend(() =>
  S.Struct({ Proxy: S.optional(Proxy), UpdateToken: S.optional(S.String) }),
).annotations({
  identifier: "CreateProxyResponse",
}) as any as S.Schema<CreateProxyResponse>;
export interface CreateProxyConfigurationResponse {
  ProxyConfiguration?: ProxyConfiguration;
  UpdateToken?: string;
}
export const CreateProxyConfigurationResponse = S.suspend(() =>
  S.Struct({
    ProxyConfiguration: S.optional(ProxyConfiguration),
    UpdateToken: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateProxyConfigurationResponse",
}) as any as S.Schema<CreateProxyConfigurationResponse>;
export interface CreateProxyRuleGroupRequest {
  ProxyRuleGroupName: string;
  Description?: string;
  Rules?: ProxyRulesByRequestPhase;
  Tags?: Tag[];
}
export const CreateProxyRuleGroupRequest = S.suspend(() =>
  S.Struct({
    ProxyRuleGroupName: S.String,
    Description: S.optional(S.String),
    Rules: S.optional(ProxyRulesByRequestPhase),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateProxyRuleGroupRequest",
}) as any as S.Schema<CreateProxyRuleGroupRequest>;
export interface CreateProxyRulesRequest {
  ProxyRuleGroupArn?: string;
  ProxyRuleGroupName?: string;
  Rules: CreateProxyRulesByRequestPhase;
}
export const CreateProxyRulesRequest = S.suspend(() =>
  S.Struct({
    ProxyRuleGroupArn: S.optional(S.String),
    ProxyRuleGroupName: S.optional(S.String),
    Rules: CreateProxyRulesByRequestPhase,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateProxyRulesRequest",
}) as any as S.Schema<CreateProxyRulesRequest>;
export interface DeleteFirewallPolicyResponse {
  FirewallPolicyResponse: FirewallPolicyResponse;
}
export const DeleteFirewallPolicyResponse = S.suspend(() =>
  S.Struct({ FirewallPolicyResponse: FirewallPolicyResponse }),
).annotations({
  identifier: "DeleteFirewallPolicyResponse",
}) as any as S.Schema<DeleteFirewallPolicyResponse>;
export interface DeleteProxyRulesResponse {
  ProxyRuleGroup?: ProxyRuleGroup;
}
export const DeleteProxyRulesResponse = S.suspend(() =>
  S.Struct({ ProxyRuleGroup: S.optional(ProxyRuleGroup) }),
).annotations({
  identifier: "DeleteProxyRulesResponse",
}) as any as S.Schema<DeleteProxyRulesResponse>;
export interface DescribeFlowOperationResponse {
  FirewallArn?: string;
  AvailabilityZone?: string;
  VpcEndpointAssociationArn?: string;
  VpcEndpointId?: string;
  FlowOperationId?: string;
  FlowOperationType?: FlowOperationType;
  FlowOperationStatus?: FlowOperationStatus;
  StatusMessage?: string;
  FlowRequestTimestamp?: Date;
  FlowOperation?: FlowOperation;
}
export const DescribeFlowOperationResponse = S.suspend(() =>
  S.Struct({
    FirewallArn: S.optional(S.String),
    AvailabilityZone: S.optional(S.String),
    VpcEndpointAssociationArn: S.optional(S.String),
    VpcEndpointId: S.optional(S.String),
    FlowOperationId: S.optional(S.String),
    FlowOperationType: S.optional(FlowOperationType),
    FlowOperationStatus: S.optional(FlowOperationStatus),
    StatusMessage: S.optional(S.String),
    FlowRequestTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    FlowOperation: S.optional(FlowOperation),
  }),
).annotations({
  identifier: "DescribeFlowOperationResponse",
}) as any as S.Schema<DescribeFlowOperationResponse>;
export interface ListAnalysisReportsResponse {
  AnalysisReports?: AnalysisReport[];
  NextToken?: string;
}
export const ListAnalysisReportsResponse = S.suspend(() =>
  S.Struct({
    AnalysisReports: S.optional(AnalysisReports),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAnalysisReportsResponse",
}) as any as S.Schema<ListAnalysisReportsResponse>;
export interface ListFirewallPoliciesResponse {
  NextToken?: string;
  FirewallPolicies?: FirewallPolicyMetadata[];
}
export const ListFirewallPoliciesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    FirewallPolicies: S.optional(FirewallPolicies),
  }),
).annotations({
  identifier: "ListFirewallPoliciesResponse",
}) as any as S.Schema<ListFirewallPoliciesResponse>;
export interface ListFirewallsResponse {
  NextToken?: string;
  Firewalls?: FirewallMetadata[];
}
export const ListFirewallsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Firewalls: S.optional(Firewalls),
  }),
).annotations({
  identifier: "ListFirewallsResponse",
}) as any as S.Schema<ListFirewallsResponse>;
export interface ListFlowOperationResultsResponse {
  FirewallArn?: string;
  AvailabilityZone?: string;
  VpcEndpointAssociationArn?: string;
  VpcEndpointId?: string;
  FlowOperationId?: string;
  FlowOperationStatus?: FlowOperationStatus;
  StatusMessage?: string;
  FlowRequestTimestamp?: Date;
  Flows?: Flow[];
  NextToken?: string;
}
export const ListFlowOperationResultsResponse = S.suspend(() =>
  S.Struct({
    FirewallArn: S.optional(S.String),
    AvailabilityZone: S.optional(S.String),
    VpcEndpointAssociationArn: S.optional(S.String),
    VpcEndpointId: S.optional(S.String),
    FlowOperationId: S.optional(S.String),
    FlowOperationStatus: S.optional(FlowOperationStatus),
    StatusMessage: S.optional(S.String),
    FlowRequestTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Flows: S.optional(Flows),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListFlowOperationResultsResponse",
}) as any as S.Schema<ListFlowOperationResultsResponse>;
export interface ListFlowOperationsResponse {
  FlowOperations?: FlowOperationMetadata[];
  NextToken?: string;
}
export const ListFlowOperationsResponse = S.suspend(() =>
  S.Struct({
    FlowOperations: S.optional(FlowOperations),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListFlowOperationsResponse",
}) as any as S.Schema<ListFlowOperationsResponse>;
export interface ListProxiesResponse {
  Proxies?: ProxyMetadata[];
  NextToken?: string;
}
export const ListProxiesResponse = S.suspend(() =>
  S.Struct({ Proxies: S.optional(Proxies), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListProxiesResponse",
}) as any as S.Schema<ListProxiesResponse>;
export interface ListProxyConfigurationsResponse {
  ProxyConfigurations?: ProxyConfigurationMetadata[];
  NextToken?: string;
}
export const ListProxyConfigurationsResponse = S.suspend(() =>
  S.Struct({
    ProxyConfigurations: S.optional(ProxyConfigurations),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProxyConfigurationsResponse",
}) as any as S.Schema<ListProxyConfigurationsResponse>;
export interface ListProxyRuleGroupsResponse {
  ProxyRuleGroups?: ProxyRuleGroupMetadata[];
  NextToken?: string;
}
export const ListProxyRuleGroupsResponse = S.suspend(() =>
  S.Struct({
    ProxyRuleGroups: S.optional(ProxyRuleGroups),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProxyRuleGroupsResponse",
}) as any as S.Schema<ListProxyRuleGroupsResponse>;
export interface ListRuleGroupsResponse {
  NextToken?: string;
  RuleGroups?: RuleGroupMetadata[];
}
export const ListRuleGroupsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    RuleGroups: S.optional(RuleGroups),
  }),
).annotations({
  identifier: "ListRuleGroupsResponse",
}) as any as S.Schema<ListRuleGroupsResponse>;
export interface ListTLSInspectionConfigurationsResponse {
  NextToken?: string;
  TLSInspectionConfigurations?: TLSInspectionConfigurationMetadata[];
}
export const ListTLSInspectionConfigurationsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    TLSInspectionConfigurations: S.optional(TLSInspectionConfigurations),
  }),
).annotations({
  identifier: "ListTLSInspectionConfigurationsResponse",
}) as any as S.Schema<ListTLSInspectionConfigurationsResponse>;
export interface ListVpcEndpointAssociationsResponse {
  NextToken?: string;
  VpcEndpointAssociations?: VpcEndpointAssociationMetadata[];
}
export const ListVpcEndpointAssociationsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    VpcEndpointAssociations: S.optional(VpcEndpointAssociations),
  }),
).annotations({
  identifier: "ListVpcEndpointAssociationsResponse",
}) as any as S.Schema<ListVpcEndpointAssociationsResponse>;
export interface StartFlowCaptureRequest {
  FirewallArn: string;
  AvailabilityZone?: string;
  VpcEndpointAssociationArn?: string;
  VpcEndpointId?: string;
  MinimumFlowAgeInSeconds?: number;
  FlowFilters: FlowFilter[];
}
export const StartFlowCaptureRequest = S.suspend(() =>
  S.Struct({
    FirewallArn: S.String,
    AvailabilityZone: S.optional(S.String),
    VpcEndpointAssociationArn: S.optional(S.String),
    VpcEndpointId: S.optional(S.String),
    MinimumFlowAgeInSeconds: S.optional(S.Number),
    FlowFilters: FlowFilters,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartFlowCaptureRequest",
}) as any as S.Schema<StartFlowCaptureRequest>;
export interface UpdateProxyResponse {
  Proxy?: Proxy;
  UpdateToken?: string;
}
export const UpdateProxyResponse = S.suspend(() =>
  S.Struct({ Proxy: S.optional(Proxy), UpdateToken: S.optional(S.String) }),
).annotations({
  identifier: "UpdateProxyResponse",
}) as any as S.Schema<UpdateProxyResponse>;
export interface UpdateProxyRuleResponse {
  ProxyRule?: ProxyRule;
  RemovedConditions?: ProxyRuleCondition[];
  UpdateToken?: string;
}
export const UpdateProxyRuleResponse = S.suspend(() =>
  S.Struct({
    ProxyRule: S.optional(ProxyRule),
    RemovedConditions: S.optional(ProxyRuleConditionList),
    UpdateToken: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateProxyRuleResponse",
}) as any as S.Schema<UpdateProxyRuleResponse>;
export interface UpdateProxyRulePrioritiesResponse {
  ProxyRuleGroupName?: string;
  ProxyRuleGroupArn?: string;
  RuleGroupRequestPhase?: RuleGroupRequestPhase;
  Rules?: ProxyRulePriority[];
  UpdateToken?: string;
}
export const UpdateProxyRulePrioritiesResponse = S.suspend(() =>
  S.Struct({
    ProxyRuleGroupName: S.optional(S.String),
    ProxyRuleGroupArn: S.optional(S.String),
    RuleGroupRequestPhase: S.optional(RuleGroupRequestPhase),
    Rules: S.optional(ProxyRulePriorityList),
    UpdateToken: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateProxyRulePrioritiesResponse",
}) as any as S.Schema<UpdateProxyRulePrioritiesResponse>;
export interface AvailabilityZoneMetadata {
  IPAddressType?: IPAddressType;
}
export const AvailabilityZoneMetadata = S.suspend(() =>
  S.Struct({ IPAddressType: S.optional(IPAddressType) }),
).annotations({
  identifier: "AvailabilityZoneMetadata",
}) as any as S.Schema<AvailabilityZoneMetadata>;
export interface RuleSummary {
  SID?: string;
  Msg?: string;
  Metadata?: string;
}
export const RuleSummary = S.suspend(() =>
  S.Struct({
    SID: S.optional(S.String),
    Msg: S.optional(S.String),
    Metadata: S.optional(S.String),
  }),
).annotations({ identifier: "RuleSummary" }) as any as S.Schema<RuleSummary>;
export type RuleSummaries = RuleSummary[];
export const RuleSummaries = S.Array(RuleSummary);
export interface Hits {
  Count?: number;
}
export const Hits = S.suspend(() =>
  S.Struct({ Count: S.optional(S.Number) }),
).annotations({ identifier: "Hits" }) as any as S.Schema<Hits>;
export interface UniqueSources {
  Count?: number;
}
export const UniqueSources = S.suspend(() =>
  S.Struct({ Count: S.optional(S.Number) }),
).annotations({
  identifier: "UniqueSources",
}) as any as S.Schema<UniqueSources>;
export type SupportedAvailabilityZones = {
  [key: string]: AvailabilityZoneMetadata | undefined;
};
export const SupportedAvailabilityZones = S.Record({
  key: S.String,
  value: S.UndefinedOr(AvailabilityZoneMetadata),
});
export interface DescribeProxyResource {
  ProxyName?: string;
  ProxyArn?: string;
  ProxyConfigurationName?: string;
  ProxyConfigurationArn?: string;
  NatGatewayId?: string;
  ProxyState?: ProxyState;
  ProxyModifyState?: ProxyModifyState;
  ListenerProperties?: ListenerProperty[];
  TlsInterceptProperties?: TlsInterceptProperties;
  VpcEndpointServiceName?: string;
  PrivateDNSName?: string;
  CreateTime?: Date;
  DeleteTime?: Date;
  UpdateTime?: Date;
  FailureCode?: string;
  FailureMessage?: string;
  Tags?: Tag[];
}
export const DescribeProxyResource = S.suspend(() =>
  S.Struct({
    ProxyName: S.optional(S.String),
    ProxyArn: S.optional(S.String),
    ProxyConfigurationName: S.optional(S.String),
    ProxyConfigurationArn: S.optional(S.String),
    NatGatewayId: S.optional(S.String),
    ProxyState: S.optional(ProxyState),
    ProxyModifyState: S.optional(ProxyModifyState),
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
  }),
).annotations({
  identifier: "DescribeProxyResource",
}) as any as S.Schema<DescribeProxyResource>;
export interface Summary {
  RuleSummaries?: RuleSummary[];
}
export const Summary = S.suspend(() =>
  S.Struct({ RuleSummaries: S.optional(RuleSummaries) }),
).annotations({ identifier: "Summary" }) as any as S.Schema<Summary>;
export interface AnalysisTypeReportResult {
  Protocol?: string;
  FirstAccessed?: Date;
  LastAccessed?: Date;
  Domain?: string;
  Hits?: Hits;
  UniqueSources?: UniqueSources;
}
export const AnalysisTypeReportResult = S.suspend(() =>
  S.Struct({
    Protocol: S.optional(S.String),
    FirstAccessed: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastAccessed: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Domain: S.optional(S.String),
    Hits: S.optional(Hits),
    UniqueSources: S.optional(UniqueSources),
  }),
).annotations({
  identifier: "AnalysisTypeReportResult",
}) as any as S.Schema<AnalysisTypeReportResult>;
export type AnalysisReportResults = AnalysisTypeReportResult[];
export const AnalysisReportResults = S.Array(AnalysisTypeReportResult);
export interface ProxyRuleGroupPriorityResult {
  ProxyRuleGroupName?: string;
  Priority?: number;
}
export const ProxyRuleGroupPriorityResult = S.suspend(() =>
  S.Struct({
    ProxyRuleGroupName: S.optional(S.String),
    Priority: S.optional(S.Number),
  }),
).annotations({
  identifier: "ProxyRuleGroupPriorityResult",
}) as any as S.Schema<ProxyRuleGroupPriorityResult>;
export type ProxyRuleGroupPriorityResultList = ProxyRuleGroupPriorityResult[];
export const ProxyRuleGroupPriorityResultList = S.Array(
  ProxyRuleGroupPriorityResult,
);
export interface CreateProxyRuleGroupResponse {
  ProxyRuleGroup?: ProxyRuleGroup;
  UpdateToken?: string;
}
export const CreateProxyRuleGroupResponse = S.suspend(() =>
  S.Struct({
    ProxyRuleGroup: S.optional(ProxyRuleGroup),
    UpdateToken: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateProxyRuleGroupResponse",
}) as any as S.Schema<CreateProxyRuleGroupResponse>;
export interface CreateProxyRulesResponse {
  ProxyRuleGroup?: ProxyRuleGroup;
  UpdateToken?: string;
}
export const CreateProxyRulesResponse = S.suspend(() =>
  S.Struct({
    ProxyRuleGroup: S.optional(ProxyRuleGroup),
    UpdateToken: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateProxyRulesResponse",
}) as any as S.Schema<CreateProxyRulesResponse>;
export interface DeleteRuleGroupResponse {
  RuleGroupResponse: RuleGroupResponse;
}
export const DeleteRuleGroupResponse = S.suspend(() =>
  S.Struct({ RuleGroupResponse: RuleGroupResponse }),
).annotations({
  identifier: "DeleteRuleGroupResponse",
}) as any as S.Schema<DeleteRuleGroupResponse>;
export interface DeleteTLSInspectionConfigurationResponse {
  TLSInspectionConfigurationResponse: TLSInspectionConfigurationResponse;
}
export const DeleteTLSInspectionConfigurationResponse = S.suspend(() =>
  S.Struct({
    TLSInspectionConfigurationResponse: TLSInspectionConfigurationResponse,
  }),
).annotations({
  identifier: "DeleteTLSInspectionConfigurationResponse",
}) as any as S.Schema<DeleteTLSInspectionConfigurationResponse>;
export interface DescribeFirewallMetadataResponse {
  FirewallArn?: string;
  FirewallPolicyArn?: string;
  Description?: string;
  Status?: FirewallStatusValue;
  SupportedAvailabilityZones?: {
    [key: string]: AvailabilityZoneMetadata | undefined;
  };
  TransitGatewayAttachmentId?: string;
}
export const DescribeFirewallMetadataResponse = S.suspend(() =>
  S.Struct({
    FirewallArn: S.optional(S.String),
    FirewallPolicyArn: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(FirewallStatusValue),
    SupportedAvailabilityZones: S.optional(SupportedAvailabilityZones),
    TransitGatewayAttachmentId: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeFirewallMetadataResponse",
}) as any as S.Schema<DescribeFirewallMetadataResponse>;
export interface DescribeProxyResponse {
  Proxy?: DescribeProxyResource;
  UpdateToken?: string;
}
export const DescribeProxyResponse = S.suspend(() =>
  S.Struct({
    Proxy: S.optional(DescribeProxyResource),
    UpdateToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeProxyResponse",
}) as any as S.Schema<DescribeProxyResponse>;
export interface DescribeProxyConfigurationResponse {
  ProxyConfiguration?: ProxyConfiguration;
  UpdateToken?: string;
}
export const DescribeProxyConfigurationResponse = S.suspend(() =>
  S.Struct({
    ProxyConfiguration: S.optional(ProxyConfiguration),
    UpdateToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeProxyConfigurationResponse",
}) as any as S.Schema<DescribeProxyConfigurationResponse>;
export interface DescribeRuleGroupSummaryResponse {
  RuleGroupName: string;
  Description?: string;
  Summary?: Summary;
}
export const DescribeRuleGroupSummaryResponse = S.suspend(() =>
  S.Struct({
    RuleGroupName: S.String,
    Description: S.optional(S.String),
    Summary: S.optional(Summary),
  }),
).annotations({
  identifier: "DescribeRuleGroupSummaryResponse",
}) as any as S.Schema<DescribeRuleGroupSummaryResponse>;
export interface GetAnalysisReportResultsResponse {
  Status?: string;
  StartTime?: Date;
  EndTime?: Date;
  ReportTime?: Date;
  AnalysisType?: EnabledAnalysisType;
  NextToken?: string;
  AnalysisReportResults?: AnalysisTypeReportResult[];
}
export const GetAnalysisReportResultsResponse = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ReportTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    AnalysisType: S.optional(EnabledAnalysisType),
    NextToken: S.optional(S.String),
    AnalysisReportResults: S.optional(AnalysisReportResults),
  }),
).annotations({
  identifier: "GetAnalysisReportResultsResponse",
}) as any as S.Schema<GetAnalysisReportResultsResponse>;
export interface StartFlowCaptureResponse {
  FirewallArn?: string;
  FlowOperationId?: string;
  FlowOperationStatus?: FlowOperationStatus;
}
export const StartFlowCaptureResponse = S.suspend(() =>
  S.Struct({
    FirewallArn: S.optional(S.String),
    FlowOperationId: S.optional(S.String),
    FlowOperationStatus: S.optional(FlowOperationStatus),
  }),
).annotations({
  identifier: "StartFlowCaptureResponse",
}) as any as S.Schema<StartFlowCaptureResponse>;
export interface UpdateLoggingConfigurationRequest {
  FirewallArn?: string;
  FirewallName?: string;
  LoggingConfiguration?: LoggingConfiguration;
  EnableMonitoringDashboard?: boolean;
}
export const UpdateLoggingConfigurationRequest = S.suspend(() =>
  S.Struct({
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    LoggingConfiguration: S.optional(LoggingConfiguration),
    EnableMonitoringDashboard: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateLoggingConfigurationRequest",
}) as any as S.Schema<UpdateLoggingConfigurationRequest>;
export interface UpdateProxyRuleGroupPrioritiesResponse {
  ProxyRuleGroups?: ProxyRuleGroupPriorityResult[];
  UpdateToken?: string;
}
export const UpdateProxyRuleGroupPrioritiesResponse = S.suspend(() =>
  S.Struct({
    ProxyRuleGroups: S.optional(ProxyRuleGroupPriorityResultList),
    UpdateToken: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateProxyRuleGroupPrioritiesResponse",
}) as any as S.Schema<UpdateProxyRuleGroupPrioritiesResponse>;
export interface CreateTLSInspectionConfigurationRequest {
  TLSInspectionConfigurationName: string;
  TLSInspectionConfiguration: TLSInspectionConfiguration;
  Description?: string;
  Tags?: Tag[];
  EncryptionConfiguration?: EncryptionConfiguration;
}
export const CreateTLSInspectionConfigurationRequest = S.suspend(() =>
  S.Struct({
    TLSInspectionConfigurationName: S.String,
    TLSInspectionConfiguration: TLSInspectionConfiguration,
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateTLSInspectionConfigurationRequest",
}) as any as S.Schema<CreateTLSInspectionConfigurationRequest>;
export interface UpdateLoggingConfigurationResponse {
  FirewallArn?: string;
  FirewallName?: string;
  LoggingConfiguration?: LoggingConfiguration;
  EnableMonitoringDashboard?: boolean;
}
export const UpdateLoggingConfigurationResponse = S.suspend(() =>
  S.Struct({
    FirewallArn: S.optional(S.String),
    FirewallName: S.optional(S.String),
    LoggingConfiguration: S.optional(LoggingConfiguration),
    EnableMonitoringDashboard: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "UpdateLoggingConfigurationResponse",
}) as any as S.Schema<UpdateLoggingConfigurationResponse>;
export interface CreateFirewallPolicyRequest {
  FirewallPolicyName: string;
  FirewallPolicy: FirewallPolicy;
  Description?: string;
  Tags?: Tag[];
  DryRun?: boolean;
  EncryptionConfiguration?: EncryptionConfiguration;
}
export const CreateFirewallPolicyRequest = S.suspend(() =>
  S.Struct({
    FirewallPolicyName: S.String,
    FirewallPolicy: FirewallPolicy,
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
    DryRun: S.optional(S.Boolean),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateFirewallPolicyRequest",
}) as any as S.Schema<CreateFirewallPolicyRequest>;
export interface CreateTLSInspectionConfigurationResponse {
  UpdateToken: string;
  TLSInspectionConfigurationResponse: TLSInspectionConfigurationResponse;
}
export const CreateTLSInspectionConfigurationResponse = S.suspend(() =>
  S.Struct({
    UpdateToken: S.String,
    TLSInspectionConfigurationResponse: TLSInspectionConfigurationResponse,
  }),
).annotations({
  identifier: "CreateTLSInspectionConfigurationResponse",
}) as any as S.Schema<CreateTLSInspectionConfigurationResponse>;
export interface CreateVpcEndpointAssociationResponse {
  VpcEndpointAssociation?: VpcEndpointAssociation;
  VpcEndpointAssociationStatus?: VpcEndpointAssociationStatus;
}
export const CreateVpcEndpointAssociationResponse = S.suspend(() =>
  S.Struct({
    VpcEndpointAssociation: S.optional(VpcEndpointAssociation),
    VpcEndpointAssociationStatus: S.optional(VpcEndpointAssociationStatus),
  }),
).annotations({
  identifier: "CreateVpcEndpointAssociationResponse",
}) as any as S.Schema<CreateVpcEndpointAssociationResponse>;
export interface CreateFirewallPolicyResponse {
  UpdateToken: string;
  FirewallPolicyResponse: FirewallPolicyResponse;
}
export const CreateFirewallPolicyResponse = S.suspend(() =>
  S.Struct({
    UpdateToken: S.String,
    FirewallPolicyResponse: FirewallPolicyResponse,
  }),
).annotations({
  identifier: "CreateFirewallPolicyResponse",
}) as any as S.Schema<CreateFirewallPolicyResponse>;
export interface DeleteFirewallResponse {
  Firewall?: Firewall;
  FirewallStatus?: FirewallStatus;
}
export const DeleteFirewallResponse = S.suspend(() =>
  S.Struct({
    Firewall: S.optional(Firewall),
    FirewallStatus: S.optional(FirewallStatus),
  }),
).annotations({
  identifier: "DeleteFirewallResponse",
}) as any as S.Schema<DeleteFirewallResponse>;
export interface CreateRuleGroupRequest {
  RuleGroupName: string;
  RuleGroup?: RuleGroup;
  Rules?: string;
  Type: RuleGroupType;
  Description?: string;
  Capacity: number;
  Tags?: Tag[];
  DryRun?: boolean;
  EncryptionConfiguration?: EncryptionConfiguration;
  SourceMetadata?: SourceMetadata;
  AnalyzeRuleGroup?: boolean;
  SummaryConfiguration?: SummaryConfiguration;
}
export const CreateRuleGroupRequest = S.suspend(() =>
  S.Struct({
    RuleGroupName: S.String,
    RuleGroup: S.optional(RuleGroup),
    Rules: S.optional(S.String),
    Type: RuleGroupType,
    Description: S.optional(S.String),
    Capacity: S.Number,
    Tags: S.optional(TagList),
    DryRun: S.optional(S.Boolean),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
    SourceMetadata: S.optional(SourceMetadata),
    AnalyzeRuleGroup: S.optional(S.Boolean),
    SummaryConfiguration: S.optional(SummaryConfiguration),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateRuleGroupRequest",
}) as any as S.Schema<CreateRuleGroupRequest>;
export interface CreateRuleGroupResponse {
  UpdateToken: string;
  RuleGroupResponse: RuleGroupResponse;
}
export const CreateRuleGroupResponse = S.suspend(() =>
  S.Struct({ UpdateToken: S.String, RuleGroupResponse: RuleGroupResponse }),
).annotations({
  identifier: "CreateRuleGroupResponse",
}) as any as S.Schema<CreateRuleGroupResponse>;

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
export const listFirewallPolicies: {
  (
    input: ListFirewallPoliciesRequest,
  ): effect.Effect<
    ListFirewallPoliciesResponse,
    | InternalServerError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFirewallPoliciesRequest,
  ) => stream.Stream<
    ListFirewallPoliciesResponse,
    | InternalServerError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFirewallPoliciesRequest,
  ) => stream.Stream<
    FirewallPolicyMetadata,
    | InternalServerError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const startFlowCapture: (
  input: StartFlowCaptureRequest,
) => effect.Effect<
  StartFlowCaptureResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateProxyRuleGroupPriorities: (
  input: UpdateProxyRuleGroupPrioritiesRequest,
) => effect.Effect<
  UpdateProxyRuleGroupPrioritiesResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putResourcePolicy: (
  input: PutResourcePolicyRequest,
) => effect.Effect<
  PutResourcePolicyResponse,
  | InternalServerError
  | InvalidRequestException
  | InvalidResourcePolicyException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeFlowOperation: (
  input: DescribeFlowOperationRequest,
) => effect.Effect<
  DescribeFlowOperationResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFlowOperationRequest,
  output: DescribeFlowOperationResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns a list of all traffic analysis reports generated within the last 30 days.
 */
export const listAnalysisReports: {
  (
    input: ListAnalysisReportsRequest,
  ): effect.Effect<
    ListAnalysisReportsResponse,
    | InternalServerError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAnalysisReportsRequest,
  ) => stream.Stream<
    ListAnalysisReportsResponse,
    | InternalServerError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAnalysisReportsRequest,
  ) => stream.Stream<
    AnalysisReport,
    | InternalServerError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listFlowOperationResults: {
  (
    input: ListFlowOperationResultsRequest,
  ): effect.Effect<
    ListFlowOperationResultsResponse,
    | InternalServerError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFlowOperationResultsRequest,
  ) => stream.Stream<
    ListFlowOperationResultsResponse,
    | InternalServerError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFlowOperationResultsRequest,
  ) => stream.Stream<
    Flow,
    | InternalServerError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listFlowOperations: {
  (
    input: ListFlowOperationsRequest,
  ): effect.Effect<
    ListFlowOperationsResponse,
    | InternalServerError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFlowOperationsRequest,
  ) => stream.Stream<
    ListFlowOperationsResponse,
    | InternalServerError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFlowOperationsRequest,
  ) => stream.Stream<
    FlowOperationMetadata,
    | InternalServerError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Retrieves the metadata for the proxy configuration that you have defined. Depending on
 * your setting for max results and the number of proxy configurations, a single call might not
 * return the full list.
 */
export const listProxyConfigurations: {
  (
    input: ListProxyConfigurationsRequest,
  ): effect.Effect<
    ListProxyConfigurationsResponse,
    | InternalServerError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProxyConfigurationsRequest,
  ) => stream.Stream<
    ListProxyConfigurationsResponse,
    | InternalServerError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProxyConfigurationsRequest,
  ) => stream.Stream<
    ProxyConfigurationMetadata,
    | InternalServerError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listProxyRuleGroups: {
  (
    input: ListProxyRuleGroupsRequest,
  ): effect.Effect<
    ListProxyRuleGroupsResponse,
    | InternalServerError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProxyRuleGroupsRequest,
  ) => stream.Stream<
    ListProxyRuleGroupsResponse,
    | InternalServerError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProxyRuleGroupsRequest,
  ) => stream.Stream<
    ProxyRuleGroupMetadata,
    | InternalServerError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const updateProxyRule: (
  input: UpdateProxyRuleRequest,
) => effect.Effect<
  UpdateProxyRuleResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateProxyRulePriorities: (
  input: UpdateProxyRulePrioritiesRequest,
) => effect.Effect<
  UpdateProxyRulePrioritiesResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProxyRulePrioritiesRequest,
  output: UpdateProxyRulePrioritiesResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns the data objects for the specified firewall.
 */
export const describeFirewall: (
  input: DescribeFirewallRequest,
) => effect.Effect<
  DescribeFirewallResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeFirewallPolicy: (
  input: DescribeFirewallPolicyRequest,
) => effect.Effect<
  DescribeFirewallPolicyResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFirewallPolicyRequest,
  output: DescribeFirewallPolicyResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns the logging configuration for the specified firewall.
 */
export const describeLoggingConfiguration: (
  input: DescribeLoggingConfigurationRequest,
) => effect.Effect<
  DescribeLoggingConfigurationResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeProxyRule: (
  input: DescribeProxyRuleRequest,
) => effect.Effect<
  DescribeProxyRuleResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeProxyRuleGroup: (
  input: DescribeProxyRuleGroupRequest,
) => effect.Effect<
  DescribeProxyRuleGroupResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProxyRuleGroupRequest,
  output: DescribeProxyRuleGroupResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a resource policy that you created in a PutResourcePolicy request.
 */
export const describeResourcePolicy: (
  input: DescribeResourcePolicyRequest,
) => effect.Effect<
  DescribeResourcePolicyResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeResourcePolicyRequest,
  output: DescribeResourcePolicyResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns the data objects for the specified rule group.
 */
export const describeRuleGroup: (
  input: DescribeRuleGroupRequest,
) => effect.Effect<
  DescribeRuleGroupResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeRuleGroupMetadata: (
  input: DescribeRuleGroupMetadataRequest,
) => effect.Effect<
  DescribeRuleGroupMetadataResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRuleGroupMetadataRequest,
  output: DescribeRuleGroupMetadataResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns the data objects for the specified TLS inspection configuration.
 */
export const describeTLSInspectionConfiguration: (
  input: DescribeTLSInspectionConfigurationRequest,
) => effect.Effect<
  DescribeTLSInspectionConfigurationResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeVpcEndpointAssociation: (
  input: DescribeVpcEndpointAssociationRequest,
) => effect.Effect<
  DescribeVpcEndpointAssociationResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const detachRuleGroupsFromProxyConfiguration: (
  input: DetachRuleGroupsFromProxyConfigurationRequest,
) => effect.Effect<
  DetachRuleGroupsFromProxyConfigurationResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: {
  (
    input: ListTagsForResourceRequest,
  ): effect.Effect<
    ListTagsForResourceResponse,
    | InternalServerError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTagsForResourceRequest,
  ) => stream.Stream<
    ListTagsForResourceResponse,
    | InternalServerError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTagsForResourceRequest,
  ) => stream.Stream<
    Tag,
    | InternalServerError
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
export const rejectNetworkFirewallTransitGatewayAttachment: (
  input: RejectNetworkFirewallTransitGatewayAttachmentRequest,
) => effect.Effect<
  RejectNetworkFirewallTransitGatewayAttachmentResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startAnalysisReport: (
  input: StartAnalysisReportRequest,
) => effect.Effect<
  StartAnalysisReportResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startFlowFlush: (
  input: StartFlowFlushRequest,
) => effect.Effect<
  StartFlowFlushResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateProxyConfiguration: (
  input: UpdateProxyConfigurationRequest,
) => effect.Effect<
  UpdateProxyConfigurationResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProxyConfigurationRequest,
  output: UpdateProxyConfigurationResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Adds the specified tags to the specified resource. Tags are key:value pairs that you can
 * use to categorize and manage your resources, for purposes like billing. For example, you
 * might set the tag key to "customer" and the value to the customer name or ID. You can
 * specify one or more tags to add to each Amazon Web Services resource, up to 50 tags for a resource.
 *
 * You can tag the Amazon Web Services resources that you manage through Network Firewall: firewalls, firewall
 * policies, and rule groups.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const acceptNetworkFirewallTransitGatewayAttachment: (
  input: AcceptNetworkFirewallTransitGatewayAttachmentRequest,
) => effect.Effect<
  AcceptNetworkFirewallTransitGatewayAttachmentResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteNetworkFirewallTransitGatewayAttachment: (
  input: DeleteNetworkFirewallTransitGatewayAttachmentRequest,
) => effect.Effect<
  DeleteNetworkFirewallTransitGatewayAttachmentResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteProxyConfiguration: (
  input: DeleteProxyConfigurationRequest,
) => effect.Effect<
  DeleteProxyConfigurationResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProxyConfigurationRequest,
  output: DeleteProxyConfigurationResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the specified ProxyRuleGroup.
 */
export const deleteProxyRuleGroup: (
  input: DeleteProxyRuleGroupRequest,
) => effect.Effect<
  DeleteProxyRuleGroupResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProxyRuleGroupRequest,
  output: DeleteProxyRuleGroupResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Attaches ProxyRuleGroup resources to a ProxyConfiguration
 *
 * A Proxy Configuration defines the monitoring and protection behavior for a Proxy. The details of the behavior are defined in the rule groups that you add to your configuration.
 */
export const attachRuleGroupsToProxyConfiguration: (
  input: AttachRuleGroupsToProxyConfigurationRequest,
) => effect.Effect<
  AttachRuleGroupsToProxyConfigurationResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteProxyRules: (
  input: DeleteProxyRulesRequest,
) => effect.Effect<
  DeleteProxyRulesResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteResourcePolicy: (
  input: DeleteResourcePolicyRequest,
) => effect.Effect<
  DeleteResourcePolicyResponse,
  | InternalServerError
  | InvalidRequestException
  | InvalidResourcePolicyException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourcePolicyRequest,
  output: DeleteResourcePolicyResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    InvalidResourcePolicyException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the specified TLSInspectionConfiguration.
 */
export const deleteTLSInspectionConfiguration: (
  input: DeleteTLSInspectionConfigurationRequest,
) => effect.Effect<
  DeleteTLSInspectionConfigurationResponse,
  | InternalServerError
  | InvalidOperationException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listFirewalls: {
  (
    input: ListFirewallsRequest,
  ): effect.Effect<
    ListFirewallsResponse,
    | InternalServerError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFirewallsRequest,
  ) => stream.Stream<
    ListFirewallsResponse,
    | InternalServerError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFirewallsRequest,
  ) => stream.Stream<
    FirewallMetadata,
    | InternalServerError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFirewallsRequest,
  output: ListFirewallsResponse,
  errors: [InternalServerError, InvalidRequestException, ThrottlingException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Firewalls",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the metadata for the proxies that you have defined. Depending on
 * your setting for max results and the number of proxies, a single call might not
 * return the full list.
 */
export const listProxies: {
  (
    input: ListProxiesRequest,
  ): effect.Effect<
    ListProxiesResponse,
    | InternalServerError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProxiesRequest,
  ) => stream.Stream<
    ListProxiesResponse,
    | InternalServerError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProxiesRequest,
  ) => stream.Stream<
    ProxyMetadata,
    | InternalServerError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProxiesRequest,
  output: ListProxiesResponse,
  errors: [InternalServerError, InvalidRequestException, ThrottlingException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Proxies",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the metadata for the rule groups that you have defined. Depending on your
 * setting for max results and the number of rule groups, a single call might not return the
 * full list.
 */
export const listRuleGroups: {
  (
    input: ListRuleGroupsRequest,
  ): effect.Effect<
    ListRuleGroupsResponse,
    | InternalServerError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRuleGroupsRequest,
  ) => stream.Stream<
    ListRuleGroupsResponse,
    | InternalServerError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRuleGroupsRequest,
  ) => stream.Stream<
    RuleGroupMetadata,
    | InternalServerError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRuleGroupsRequest,
  output: ListRuleGroupsResponse,
  errors: [InternalServerError, InvalidRequestException, ThrottlingException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RuleGroups",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the metadata for the TLS inspection configurations that you have defined. Depending on your setting for max results and the number of TLS inspection configurations, a single call might not return the full list.
 */
export const listTLSInspectionConfigurations: {
  (
    input: ListTLSInspectionConfigurationsRequest,
  ): effect.Effect<
    ListTLSInspectionConfigurationsResponse,
    | InternalServerError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTLSInspectionConfigurationsRequest,
  ) => stream.Stream<
    ListTLSInspectionConfigurationsResponse,
    | InternalServerError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTLSInspectionConfigurationsRequest,
  ) => stream.Stream<
    TLSInspectionConfigurationMetadata,
    | InternalServerError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listVpcEndpointAssociations: {
  (
    input: ListVpcEndpointAssociationsRequest,
  ): effect.Effect<
    ListVpcEndpointAssociationsResponse,
    | InternalServerError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListVpcEndpointAssociationsRequest,
  ) => stream.Stream<
    ListVpcEndpointAssociationsResponse,
    | InternalServerError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListVpcEndpointAssociationsRequest,
  ) => stream.Stream<
    VpcEndpointAssociationMetadata,
    | InternalServerError
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createProxyRules: (
  input: CreateProxyRulesRequest,
) => effect.Effect<
  CreateProxyRulesResponse,
  | InternalServerError
  | InvalidRequestException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteVpcEndpointAssociation: (
  input: DeleteVpcEndpointAssociationRequest,
) => effect.Effect<
  DeleteVpcEndpointAssociationResponse,
  | InternalServerError
  | InvalidOperationException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeFirewallMetadata: (
  input: DescribeFirewallMetadataRequest,
) => effect.Effect<
  DescribeFirewallMetadataResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFirewallMetadataRequest,
  output: DescribeFirewallMetadataResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns the data objects for the specified proxy.
 */
export const describeProxy: (
  input: DescribeProxyRequest,
) => effect.Effect<
  DescribeProxyResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeProxyConfiguration: (
  input: DescribeProxyConfigurationRequest,
) => effect.Effect<
  DescribeProxyConfigurationResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProxyConfigurationRequest,
  output: DescribeProxyConfigurationResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns detailed information for a stateful rule group.
 *
 * For active threat defense Amazon Web Services managed rule groups, this operation provides insight into the protections enabled by the rule group, based on Suricata rule metadata fields. Summaries are available for rule groups you manage and for active threat defense Amazon Web Services managed rule groups.
 *
 * To modify how threat information appears in summaries, use the `SummaryConfiguration` parameter in UpdateRuleGroup.
 */
export const describeRuleGroupSummary: (
  input: DescribeRuleGroupSummaryRequest,
) => effect.Effect<
  DescribeRuleGroupSummaryResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRuleGroupSummaryRequest,
  output: DescribeRuleGroupSummaryResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * The results of a `COMPLETED` analysis report generated with StartAnalysisReport.
 *
 * For more information, see AnalysisTypeReportResult.
 */
export const getAnalysisReportResults: {
  (
    input: GetAnalysisReportResultsRequest,
  ): effect.Effect<
    GetAnalysisReportResultsResponse,
    | InternalServerError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetAnalysisReportResultsRequest,
  ) => stream.Stream<
    GetAnalysisReportResultsResponse,
    | InternalServerError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetAnalysisReportResultsRequest,
  ) => stream.Stream<
    AnalysisTypeReportResult,
    | InternalServerError
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const updateFirewallAnalysisSettings: (
  input: UpdateFirewallAnalysisSettingsRequest,
) => effect.Effect<
  UpdateFirewallAnalysisSettingsResponse,
  | InternalServerError
  | InvalidRequestException
  | InvalidTokenException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateFirewallDescription: (
  input: UpdateFirewallDescriptionRequest,
) => effect.Effect<
  UpdateFirewallDescriptionResponse,
  | InternalServerError
  | InvalidRequestException
  | InvalidTokenException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFirewallDescriptionRequest,
  output: UpdateFirewallDescriptionResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    InvalidTokenException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the properties of the specified firewall policy.
 */
export const updateFirewallPolicy: (
  input: UpdateFirewallPolicyRequest,
) => effect.Effect<
  UpdateFirewallPolicyResponse,
  | InternalServerError
  | InvalidRequestException
  | InvalidTokenException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFirewallPolicyRequest,
  output: UpdateFirewallPolicyResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    InvalidTokenException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the rule settings for the specified rule group. You use a rule group by
 * reference in one or more firewall policies. When you modify a rule group, you modify all
 * firewall policies that use the rule group.
 *
 * To update a rule group, first call DescribeRuleGroup to retrieve the
 * current RuleGroup object, update the object as needed, and then provide
 * the updated object to this call.
 */
export const updateRuleGroup: (
  input: UpdateRuleGroupRequest,
) => effect.Effect<
  UpdateRuleGroupResponse,
  | InternalServerError
  | InvalidRequestException
  | InvalidTokenException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateTLSInspectionConfiguration: (
  input: UpdateTLSInspectionConfigurationRequest,
) => effect.Effect<
  UpdateTLSInspectionConfigurationResponse,
  | InternalServerError
  | InvalidRequestException
  | InvalidTokenException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateAvailabilityZones: (
  input: DisassociateAvailabilityZonesRequest,
) => effect.Effect<
  DisassociateAvailabilityZonesResponse,
  | InternalServerError
  | InvalidOperationException
  | InvalidRequestException
  | InvalidTokenException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateSubnets: (
  input: DisassociateSubnetsRequest,
) => effect.Effect<
  DisassociateSubnetsResponse,
  | InternalServerError
  | InvalidOperationException
  | InvalidRequestException
  | InvalidTokenException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateFirewallPolicy: (
  input: AssociateFirewallPolicyRequest,
) => effect.Effect<
  AssociateFirewallPolicyResponse,
  | InternalServerError
  | InvalidOperationException
  | InvalidRequestException
  | InvalidTokenException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Associates the specified Availability Zones with a transit gateway-attached firewall. For each Availability Zone, Network Firewall creates a firewall endpoint to process traffic. You can specify one or more Availability Zones where you want to deploy the firewall.
 *
 * After adding Availability Zones, you must update your transit gateway route tables to direct traffic through the new firewall endpoints. Use DescribeFirewall to monitor the status of the new endpoints.
 */
export const associateAvailabilityZones: (
  input: AssociateAvailabilityZonesRequest,
) => effect.Effect<
  AssociateAvailabilityZonesResponse,
  | InsufficientCapacityException
  | InternalServerError
  | InvalidOperationException
  | InvalidRequestException
  | InvalidTokenException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Associates the specified subnets in the Amazon VPC to the firewall. You can specify one
 * subnet for each of the Availability Zones that the VPC spans.
 *
 * This request creates an Network Firewall firewall endpoint in each of the subnets. To
 * enable the firewall's protections, you must also modify the VPC's route tables for each
 * subnet's Availability Zone, to redirect the traffic that's coming into and going out of the
 * zone through the firewall endpoint.
 */
export const associateSubnets: (
  input: AssociateSubnetsRequest,
) => effect.Effect<
  AssociateSubnetsResponse,
  | InsufficientCapacityException
  | InternalServerError
  | InvalidOperationException
  | InvalidRequestException
  | InvalidTokenException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createProxyConfiguration: (
  input: CreateProxyConfigurationRequest,
) => effect.Effect<
  CreateProxyConfigurationResponse,
  | InternalServerError
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProxyConfigurationRequest,
  output: CreateProxyConfigurationResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
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
export const createProxyRuleGroup: (
  input: CreateProxyRuleGroupRequest,
) => effect.Effect<
  CreateProxyRuleGroupResponse,
  | InternalServerError
  | InvalidRequestException
  | LimitExceededException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProxyRuleGroupRequest,
  output: CreateProxyRuleGroupResponse,
  errors: [
    InternalServerError,
    InvalidRequestException,
    LimitExceededException,
    ThrottlingException,
  ],
}));
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
export const createFirewall: (
  input: CreateFirewallRequest,
) => effect.Effect<
  CreateFirewallResponse,
  | InsufficientCapacityException
  | InternalServerError
  | InvalidOperationException
  | InvalidRequestException
  | LimitExceededException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateAvailabilityZoneChangeProtection: (
  input: UpdateAvailabilityZoneChangeProtectionRequest,
) => effect.Effect<
  UpdateAvailabilityZoneChangeProtectionResponse,
  | InternalServerError
  | InvalidRequestException
  | InvalidTokenException
  | ResourceNotFoundException
  | ResourceOwnerCheckException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createProxy: (
  input: CreateProxyRequest,
) => effect.Effect<
  CreateProxyResponse,
  | InternalServerError
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateFirewallDeleteProtection: (
  input: UpdateFirewallDeleteProtectionRequest,
) => effect.Effect<
  UpdateFirewallDeleteProtectionResponse,
  | InternalServerError
  | InvalidRequestException
  | InvalidTokenException
  | ResourceNotFoundException
  | ResourceOwnerCheckException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateFirewallEncryptionConfiguration: (
  input: UpdateFirewallEncryptionConfigurationRequest,
) => effect.Effect<
  UpdateFirewallEncryptionConfigurationResponse,
  | InternalServerError
  | InvalidRequestException
  | InvalidTokenException
  | ResourceNotFoundException
  | ResourceOwnerCheckException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateFirewallPolicyChangeProtection: (
  input: UpdateFirewallPolicyChangeProtectionRequest,
) => effect.Effect<
  UpdateFirewallPolicyChangeProtectionResponse,
  | InternalServerError
  | InvalidRequestException
  | InvalidTokenException
  | ResourceNotFoundException
  | ResourceOwnerCheckException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateSubnetChangeProtection: (
  input: UpdateSubnetChangeProtectionRequest,
) => effect.Effect<
  UpdateSubnetChangeProtectionResponse,
  | InternalServerError
  | InvalidRequestException
  | InvalidTokenException
  | ResourceNotFoundException
  | ResourceOwnerCheckException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateProxy: (
  input: UpdateProxyRequest,
) => effect.Effect<
  UpdateProxyResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteProxy: (
  input: DeleteProxyRequest,
) => effect.Effect<
  DeleteProxyResponse,
  | InternalServerError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteFirewallPolicy: (
  input: DeleteFirewallPolicyRequest,
) => effect.Effect<
  DeleteFirewallPolicyResponse,
  | InternalServerError
  | InvalidOperationException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes the specified RuleGroup.
 */
export const deleteRuleGroup: (
  input: DeleteRuleGroupRequest,
) => effect.Effect<
  DeleteRuleGroupResponse,
  | InternalServerError
  | InvalidOperationException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createTLSInspectionConfiguration: (
  input: CreateTLSInspectionConfigurationRequest,
) => effect.Effect<
  CreateTLSInspectionConfigurationResponse,
  | InsufficientCapacityException
  | InternalServerError
  | InvalidRequestException
  | LimitExceededException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createVpcEndpointAssociation: (
  input: CreateVpcEndpointAssociationRequest,
) => effect.Effect<
  CreateVpcEndpointAssociationResponse,
  | InsufficientCapacityException
  | InternalServerError
  | InvalidOperationException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateLoggingConfiguration: (
  input: UpdateLoggingConfigurationRequest,
) => effect.Effect<
  UpdateLoggingConfigurationResponse,
  | InternalServerError
  | InvalidRequestException
  | InvalidTokenException
  | LogDestinationPermissionException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates the firewall policy for the firewall according to the specifications.
 *
 * An Network Firewall firewall policy defines the behavior of a firewall, in a collection of
 * stateless and stateful rule groups and other settings. You can use one firewall policy for
 * multiple firewalls.
 */
export const createFirewallPolicy: (
  input: CreateFirewallPolicyRequest,
) => effect.Effect<
  CreateFirewallPolicyResponse,
  | InsufficientCapacityException
  | InternalServerError
  | InvalidRequestException
  | LimitExceededException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFirewallPolicyRequest,
  output: CreateFirewallPolicyResponse,
  errors: [
    InsufficientCapacityException,
    InternalServerError,
    InvalidRequestException,
    LimitExceededException,
    ThrottlingException,
  ],
}));
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
export const deleteFirewall: (
  input: DeleteFirewallRequest,
) => effect.Effect<
  DeleteFirewallResponse,
  | InternalServerError
  | InvalidOperationException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createRuleGroup: (
  input: CreateRuleGroupRequest,
) => effect.Effect<
  CreateRuleGroupResponse,
  | InsufficientCapacityException
  | InternalServerError
  | InvalidRequestException
  | LimitExceededException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
