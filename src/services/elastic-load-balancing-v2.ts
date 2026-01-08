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
const ns = T.XmlNamespace(
  "http://elasticloadbalancing.amazonaws.com/doc/2015-12-01/",
);
const svc = T.AwsApiService({
  sdkId: "Elastic Load Balancing v2",
  serviceShapeName: "ElasticLoadBalancing_v10",
});
const auth = T.AwsAuthSigv4({ name: "elasticloadbalancing" });
const ver = T.ServiceVersion("2015-12-01");
const proto = T.AwsProtocolsAwsQuery();
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
              `https://elasticloadbalancing-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://elasticloadbalancing.${Region}.amazonaws.com`);
            }
            return e(
              `https://elasticloadbalancing-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://elasticloadbalancing.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://elasticloadbalancing.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ListenerArn = string;
export type ResourceArn = string;
export type TrustStoreArn = string;
export type LoadBalancerArn = string;
export type Port = number;
export type SslPolicyName = string;
export type AlpnPolicyValue = string;
export type LoadBalancerName = string;
export type SubnetId = string;
export type SecurityGroupId = string;
export type CustomerOwnedIpv4Pool = string;
export type RulePriority = number;
export type TargetGroupName = string;
export type ProtocolVersion = string;
export type VpcId = string;
export type HealthCheckPort = string;
export type HealthCheckEnabled = boolean;
export type Path = string;
export type HealthCheckIntervalSeconds = number;
export type HealthCheckTimeoutSeconds = number;
export type HealthCheckThresholdCount = number;
export type TargetControlPort = number;
export type TrustStoreName = string;
export type S3Bucket = string;
export type S3Key = string;
export type S3ObjectVersion = string;
export type RuleArn = string;
export type TargetGroupArn = string;
export type Marker = string;
export type PageSize = number;
export type RevocationId = number;
export type ResetCapacityReservation = boolean;
export type ResetTransforms = boolean;
export type TagKey = string;
export type CertificateArn = string;
export type Default = boolean;
export type TagValue = string;
export type ActionOrder = number;
export type Mode = string;
export type IgnoreClientCertificateExpiry = boolean;
export type AllocationId = string;
export type PrivateIPv4Address = string;
export type IPv6Address = string;
export type SourceNatIpv6Prefix = string;
export type IpamPoolId = string;
export type ConditionFieldName = string;
export type StringValue = string;
export type HttpCode = string;
export type GrpcCode = string;
export type TargetId = string;
export type ZoneName = string;
export type QuicServerId = string;
export type CapacityUnits = number;
export type ListenerAttributeKey = string;
export type ListenerAttributeValue = string;
export type LoadBalancerAttributeKey = string;
export type LoadBalancerAttributeValue = string;
export type TargetGroupAttributeKey = string;
export type TargetGroupAttributeValue = string;
export type ErrorDescription = string;
export type LastModifiedTime = Date;
export type DecreaseRequestsRemaining = number;
export type Policy = string;
export type Location = string;
export type AuthenticateOidcActionIssuer = string;
export type AuthenticateOidcActionAuthorizationEndpoint = string;
export type AuthenticateOidcActionTokenEndpoint = string;
export type AuthenticateOidcActionUserInfoEndpoint = string;
export type AuthenticateOidcActionClientId = string;
export type AuthenticateOidcActionClientSecret = string;
export type AuthenticateOidcActionSessionCookieName = string;
export type AuthenticateOidcActionScope = string;
export type AuthenticateOidcActionSessionTimeout = number;
export type AuthenticateOidcActionUseExistingClientSecret = boolean;
export type AuthenticateCognitoActionUserPoolArn = string;
export type AuthenticateCognitoActionUserPoolClientId = string;
export type AuthenticateCognitoActionUserPoolDomain = string;
export type AuthenticateCognitoActionSessionCookieName = string;
export type AuthenticateCognitoActionScope = string;
export type AuthenticateCognitoActionSessionTimeout = number;
export type RedirectActionProtocol = string;
export type RedirectActionPort = string;
export type RedirectActionHost = string;
export type RedirectActionPath = string;
export type RedirectActionQuery = string;
export type FixedResponseActionMessage = string;
export type FixedResponseActionStatusCode = string;
export type FixedResponseActionContentType = string;
export type JwtValidationActionJwksEndpoint = string;
export type JwtValidationActionIssuer = string;
export type HttpHeaderConditionName = string;
export type NumberOfCaCertificates = number;
export type TotalRevokedEntries = number;
export type Name = string;
export type Max = string;
export type CapacityUnitsDouble = number;
export type DNSName = string;
export type CanonicalHostedZoneId = string;
export type CreatedTime = Date;
export type EnforceSecurityGroupInboundRulesOnPrivateLinkTraffic = string;
export type IsDefault = boolean;
export type SslProtocol = string;
export type TrustStoreAssociationResourceArn = string;
export type NumberOfRevokedEntries = number;
export type OutpostId = string;
export type AuthenticateOidcActionAuthenticationRequestParamName = string;
export type AuthenticateOidcActionAuthenticationRequestParamValue = string;
export type AuthenticateCognitoActionAuthenticationRequestParamName = string;
export type AuthenticateCognitoActionAuthenticationRequestParamValue = string;
export type TargetGroupWeight = number;
export type TargetGroupStickinessEnabled = boolean;
export type TargetGroupStickinessDurationSeconds = number;
export type JwtValidationActionAdditionalClaimName = string;
export type JwtValidationActionAdditionalClaimValue = string;
export type StateReason = string;
export type CipherName = string;
export type CipherPriority = number;
export type Description = string;
export type IpAddress = string;

//# Schemas
export type ResourceArns = string[];
export const ResourceArns = S.Array(S.String);
export type ProtocolEnum =
  | "HTTP"
  | "HTTPS"
  | "TCP"
  | "TLS"
  | "UDP"
  | "TCP_UDP"
  | "GENEVE"
  | "QUIC"
  | "TCP_QUIC";
export const ProtocolEnum = S.Literal(
  "HTTP",
  "HTTPS",
  "TCP",
  "TLS",
  "UDP",
  "TCP_UDP",
  "GENEVE",
  "QUIC",
  "TCP_QUIC",
);
export type AlpnPolicyName = string[];
export const AlpnPolicyName = S.Array(S.String);
export type Subnets = string[];
export const Subnets = S.Array(S.String);
export type SecurityGroups = string[];
export const SecurityGroups = S.Array(S.String);
export type LoadBalancerSchemeEnum = "internet-facing" | "internal";
export const LoadBalancerSchemeEnum = S.Literal("internet-facing", "internal");
export type LoadBalancerTypeEnum = "application" | "network" | "gateway";
export const LoadBalancerTypeEnum = S.Literal(
  "application",
  "network",
  "gateway",
);
export type IpAddressType =
  | "ipv4"
  | "dualstack"
  | "dualstack-without-public-ipv4";
export const IpAddressType = S.Literal(
  "ipv4",
  "dualstack",
  "dualstack-without-public-ipv4",
);
export type EnablePrefixForIpv6SourceNatEnum = "on" | "off";
export const EnablePrefixForIpv6SourceNatEnum = S.Literal("on", "off");
export type TargetTypeEnum = "instance" | "ip" | "lambda" | "alb";
export const TargetTypeEnum = S.Literal("instance", "ip", "lambda", "alb");
export type TargetGroupIpAddressTypeEnum = "ipv4" | "ipv6";
export const TargetGroupIpAddressTypeEnum = S.Literal("ipv4", "ipv6");
export type ListenerArns = string[];
export const ListenerArns = S.Array(S.String);
export type LoadBalancerArns = string[];
export const LoadBalancerArns = S.Array(S.String);
export type LoadBalancerNames = string[];
export const LoadBalancerNames = S.Array(S.String);
export type RuleArns = string[];
export const RuleArns = S.Array(S.String);
export type SslPolicyNames = string[];
export const SslPolicyNames = S.Array(S.String);
export type TargetGroupArns = string[];
export const TargetGroupArns = S.Array(S.String);
export type TargetGroupNames = string[];
export const TargetGroupNames = S.Array(S.String);
export type DescribeTargetHealthInputIncludeEnum = "AnomalyDetection" | "All";
export const DescribeTargetHealthInputIncludeEnum = S.Literal(
  "AnomalyDetection",
  "All",
);
export type ListOfDescribeTargetHealthIncludeOptions =
  DescribeTargetHealthInputIncludeEnum[];
export const ListOfDescribeTargetHealthIncludeOptions = S.Array(
  DescribeTargetHealthInputIncludeEnum,
);
export type RevocationIds = number[];
export const RevocationIds = S.Array(S.Number);
export type TrustStoreArns = string[];
export const TrustStoreArns = S.Array(S.String);
export type TrustStoreNames = string[];
export const TrustStoreNames = S.Array(S.String);
export type RemoveIpamPoolEnum = "ipv4";
export const RemoveIpamPoolEnum = S.Literal("ipv4");
export type RemoveIpamPools = RemoveIpamPoolEnum[];
export const RemoveIpamPools = S.Array(RemoveIpamPoolEnum);
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export type EnforceSecurityGroupInboundRulesOnPrivateLinkTrafficEnum =
  | "on"
  | "off";
export const EnforceSecurityGroupInboundRulesOnPrivateLinkTrafficEnum =
  S.Literal("on", "off");
export interface Tag {
  Key?: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateTrustStoreInput {
  Name?: string;
  CaCertificatesBundleS3Bucket?: string;
  CaCertificatesBundleS3Key?: string;
  CaCertificatesBundleS3ObjectVersion?: string;
  Tags?: Tag[];
}
export const CreateTrustStoreInput = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    CaCertificatesBundleS3Bucket: S.optional(S.String),
    CaCertificatesBundleS3Key: S.optional(S.String),
    CaCertificatesBundleS3ObjectVersion: S.optional(S.String),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTrustStoreInput",
}) as any as S.Schema<CreateTrustStoreInput>;
export interface DeleteListenerInput {
  ListenerArn?: string;
}
export const DeleteListenerInput = S.suspend(() =>
  S.Struct({ ListenerArn: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteListenerInput",
}) as any as S.Schema<DeleteListenerInput>;
export interface DeleteListenerOutput {}
export const DeleteListenerOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteListenerOutput",
}) as any as S.Schema<DeleteListenerOutput>;
export interface DeleteLoadBalancerInput {
  LoadBalancerArn?: string;
}
export const DeleteLoadBalancerInput = S.suspend(() =>
  S.Struct({ LoadBalancerArn: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLoadBalancerInput",
}) as any as S.Schema<DeleteLoadBalancerInput>;
export interface DeleteLoadBalancerOutput {}
export const DeleteLoadBalancerOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteLoadBalancerOutput",
}) as any as S.Schema<DeleteLoadBalancerOutput>;
export interface DeleteRuleInput {
  RuleArn?: string;
}
export const DeleteRuleInput = S.suspend(() =>
  S.Struct({ RuleArn: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRuleInput",
}) as any as S.Schema<DeleteRuleInput>;
export interface DeleteRuleOutput {}
export const DeleteRuleOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteRuleOutput",
}) as any as S.Schema<DeleteRuleOutput>;
export interface DeleteSharedTrustStoreAssociationInput {
  TrustStoreArn?: string;
  ResourceArn?: string;
}
export const DeleteSharedTrustStoreAssociationInput = S.suspend(() =>
  S.Struct({
    TrustStoreArn: S.optional(S.String),
    ResourceArn: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSharedTrustStoreAssociationInput",
}) as any as S.Schema<DeleteSharedTrustStoreAssociationInput>;
export interface DeleteSharedTrustStoreAssociationOutput {}
export const DeleteSharedTrustStoreAssociationOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteSharedTrustStoreAssociationOutput",
}) as any as S.Schema<DeleteSharedTrustStoreAssociationOutput>;
export interface DeleteTargetGroupInput {
  TargetGroupArn?: string;
}
export const DeleteTargetGroupInput = S.suspend(() =>
  S.Struct({ TargetGroupArn: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTargetGroupInput",
}) as any as S.Schema<DeleteTargetGroupInput>;
export interface DeleteTargetGroupOutput {}
export const DeleteTargetGroupOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteTargetGroupOutput",
}) as any as S.Schema<DeleteTargetGroupOutput>;
export interface DeleteTrustStoreInput {
  TrustStoreArn?: string;
}
export const DeleteTrustStoreInput = S.suspend(() =>
  S.Struct({ TrustStoreArn: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTrustStoreInput",
}) as any as S.Schema<DeleteTrustStoreInput>;
export interface DeleteTrustStoreOutput {}
export const DeleteTrustStoreOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteTrustStoreOutput",
}) as any as S.Schema<DeleteTrustStoreOutput>;
export interface DescribeAccountLimitsInput {
  Marker?: string;
  PageSize?: number;
}
export const DescribeAccountLimitsInput = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAccountLimitsInput",
}) as any as S.Schema<DescribeAccountLimitsInput>;
export interface DescribeCapacityReservationInput {
  LoadBalancerArn?: string;
}
export const DescribeCapacityReservationInput = S.suspend(() =>
  S.Struct({ LoadBalancerArn: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeCapacityReservationInput",
}) as any as S.Schema<DescribeCapacityReservationInput>;
export interface DescribeListenerAttributesInput {
  ListenerArn?: string;
}
export const DescribeListenerAttributesInput = S.suspend(() =>
  S.Struct({ ListenerArn: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeListenerAttributesInput",
}) as any as S.Schema<DescribeListenerAttributesInput>;
export interface DescribeListenerCertificatesInput {
  ListenerArn?: string;
  Marker?: string;
  PageSize?: number;
}
export const DescribeListenerCertificatesInput = S.suspend(() =>
  S.Struct({
    ListenerArn: S.optional(S.String),
    Marker: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeListenerCertificatesInput",
}) as any as S.Schema<DescribeListenerCertificatesInput>;
export interface DescribeListenersInput {
  LoadBalancerArn?: string;
  ListenerArns?: string[];
  Marker?: string;
  PageSize?: number;
}
export const DescribeListenersInput = S.suspend(() =>
  S.Struct({
    LoadBalancerArn: S.optional(S.String),
    ListenerArns: S.optional(ListenerArns),
    Marker: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeListenersInput",
}) as any as S.Schema<DescribeListenersInput>;
export interface DescribeLoadBalancerAttributesInput {
  LoadBalancerArn?: string;
}
export const DescribeLoadBalancerAttributesInput = S.suspend(() =>
  S.Struct({ LoadBalancerArn: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeLoadBalancerAttributesInput",
}) as any as S.Schema<DescribeLoadBalancerAttributesInput>;
export interface DescribeLoadBalancersInput {
  LoadBalancerArns?: string[];
  Names?: string[];
  Marker?: string;
  PageSize?: number;
}
export const DescribeLoadBalancersInput = S.suspend(() =>
  S.Struct({
    LoadBalancerArns: S.optional(LoadBalancerArns),
    Names: S.optional(LoadBalancerNames),
    Marker: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeLoadBalancersInput",
}) as any as S.Schema<DescribeLoadBalancersInput>;
export interface DescribeRulesInput {
  ListenerArn?: string;
  RuleArns?: string[];
  Marker?: string;
  PageSize?: number;
}
export const DescribeRulesInput = S.suspend(() =>
  S.Struct({
    ListenerArn: S.optional(S.String),
    RuleArns: S.optional(RuleArns),
    Marker: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeRulesInput",
}) as any as S.Schema<DescribeRulesInput>;
export interface DescribeSSLPoliciesInput {
  Names?: string[];
  Marker?: string;
  PageSize?: number;
  LoadBalancerType?: LoadBalancerTypeEnum;
}
export const DescribeSSLPoliciesInput = S.suspend(() =>
  S.Struct({
    Names: S.optional(SslPolicyNames),
    Marker: S.optional(S.String),
    PageSize: S.optional(S.Number),
    LoadBalancerType: S.optional(LoadBalancerTypeEnum),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSSLPoliciesInput",
}) as any as S.Schema<DescribeSSLPoliciesInput>;
export interface DescribeTagsInput {
  ResourceArns?: string[];
}
export const DescribeTagsInput = S.suspend(() =>
  S.Struct({ ResourceArns: S.optional(ResourceArns) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeTagsInput",
}) as any as S.Schema<DescribeTagsInput>;
export interface DescribeTargetGroupAttributesInput {
  TargetGroupArn?: string;
}
export const DescribeTargetGroupAttributesInput = S.suspend(() =>
  S.Struct({ TargetGroupArn: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeTargetGroupAttributesInput",
}) as any as S.Schema<DescribeTargetGroupAttributesInput>;
export interface DescribeTargetGroupsInput {
  LoadBalancerArn?: string;
  TargetGroupArns?: string[];
  Names?: string[];
  Marker?: string;
  PageSize?: number;
}
export const DescribeTargetGroupsInput = S.suspend(() =>
  S.Struct({
    LoadBalancerArn: S.optional(S.String),
    TargetGroupArns: S.optional(TargetGroupArns),
    Names: S.optional(TargetGroupNames),
    Marker: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeTargetGroupsInput",
}) as any as S.Schema<DescribeTargetGroupsInput>;
export interface TargetDescription {
  Id?: string;
  Port?: number;
  AvailabilityZone?: string;
  QuicServerId?: string;
}
export const TargetDescription = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Port: S.optional(S.Number),
    AvailabilityZone: S.optional(S.String),
    QuicServerId: S.optional(S.String),
  }),
).annotations({
  identifier: "TargetDescription",
}) as any as S.Schema<TargetDescription>;
export type TargetDescriptions = TargetDescription[];
export const TargetDescriptions = S.Array(TargetDescription);
export interface DescribeTargetHealthInput {
  TargetGroupArn?: string;
  Targets?: TargetDescription[];
  Include?: DescribeTargetHealthInputIncludeEnum[];
}
export const DescribeTargetHealthInput = S.suspend(() =>
  S.Struct({
    TargetGroupArn: S.optional(S.String),
    Targets: S.optional(TargetDescriptions),
    Include: S.optional(ListOfDescribeTargetHealthIncludeOptions),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeTargetHealthInput",
}) as any as S.Schema<DescribeTargetHealthInput>;
export interface DescribeTrustStoreAssociationsInput {
  TrustStoreArn?: string;
  Marker?: string;
  PageSize?: number;
}
export const DescribeTrustStoreAssociationsInput = S.suspend(() =>
  S.Struct({
    TrustStoreArn: S.optional(S.String),
    Marker: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeTrustStoreAssociationsInput",
}) as any as S.Schema<DescribeTrustStoreAssociationsInput>;
export interface DescribeTrustStoreRevocationsInput {
  TrustStoreArn?: string;
  RevocationIds?: number[];
  Marker?: string;
  PageSize?: number;
}
export const DescribeTrustStoreRevocationsInput = S.suspend(() =>
  S.Struct({
    TrustStoreArn: S.optional(S.String),
    RevocationIds: S.optional(RevocationIds),
    Marker: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeTrustStoreRevocationsInput",
}) as any as S.Schema<DescribeTrustStoreRevocationsInput>;
export interface DescribeTrustStoresInput {
  TrustStoreArns?: string[];
  Names?: string[];
  Marker?: string;
  PageSize?: number;
}
export const DescribeTrustStoresInput = S.suspend(() =>
  S.Struct({
    TrustStoreArns: S.optional(TrustStoreArns),
    Names: S.optional(TrustStoreNames),
    Marker: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeTrustStoresInput",
}) as any as S.Schema<DescribeTrustStoresInput>;
export interface GetResourcePolicyInput {
  ResourceArn?: string;
}
export const GetResourcePolicyInput = S.suspend(() =>
  S.Struct({ ResourceArn: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourcePolicyInput",
}) as any as S.Schema<GetResourcePolicyInput>;
export interface GetTrustStoreCaCertificatesBundleInput {
  TrustStoreArn?: string;
}
export const GetTrustStoreCaCertificatesBundleInput = S.suspend(() =>
  S.Struct({ TrustStoreArn: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTrustStoreCaCertificatesBundleInput",
}) as any as S.Schema<GetTrustStoreCaCertificatesBundleInput>;
export interface GetTrustStoreRevocationContentInput {
  TrustStoreArn?: string;
  RevocationId?: number;
}
export const GetTrustStoreRevocationContentInput = S.suspend(() =>
  S.Struct({
    TrustStoreArn: S.optional(S.String),
    RevocationId: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTrustStoreRevocationContentInput",
}) as any as S.Schema<GetTrustStoreRevocationContentInput>;
export interface IpamPools {
  Ipv4IpamPoolId?: string;
}
export const IpamPools = S.suspend(() =>
  S.Struct({ Ipv4IpamPoolId: S.optional(S.String) }),
).annotations({ identifier: "IpamPools" }) as any as S.Schema<IpamPools>;
export interface ModifyIpPoolsInput {
  LoadBalancerArn?: string;
  IpamPools?: IpamPools;
  RemoveIpamPools?: RemoveIpamPoolEnum[];
}
export const ModifyIpPoolsInput = S.suspend(() =>
  S.Struct({
    LoadBalancerArn: S.optional(S.String),
    IpamPools: S.optional(IpamPools),
    RemoveIpamPools: S.optional(RemoveIpamPools),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyIpPoolsInput",
}) as any as S.Schema<ModifyIpPoolsInput>;
export interface Certificate {
  CertificateArn?: string;
  IsDefault?: boolean;
}
export const Certificate = S.suspend(() =>
  S.Struct({
    CertificateArn: S.optional(S.String),
    IsDefault: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Certificate" }) as any as S.Schema<Certificate>;
export type CertificateList = Certificate[];
export const CertificateList = S.Array(Certificate);
export type ActionTypeEnum =
  | "forward"
  | "authenticate-oidc"
  | "authenticate-cognito"
  | "redirect"
  | "fixed-response"
  | "jwt-validation";
export const ActionTypeEnum = S.Literal(
  "forward",
  "authenticate-oidc",
  "authenticate-cognito",
  "redirect",
  "fixed-response",
  "jwt-validation",
);
export type AuthenticateOidcActionAuthenticationRequestExtraParams = {
  [key: string]: string;
};
export const AuthenticateOidcActionAuthenticationRequestExtraParams = S.Record({
  key: S.String,
  value: S.String,
});
export type AuthenticateOidcActionConditionalBehaviorEnum =
  | "deny"
  | "allow"
  | "authenticate";
export const AuthenticateOidcActionConditionalBehaviorEnum = S.Literal(
  "deny",
  "allow",
  "authenticate",
);
export interface AuthenticateOidcActionConfig {
  Issuer?: string;
  AuthorizationEndpoint?: string;
  TokenEndpoint?: string;
  UserInfoEndpoint?: string;
  ClientId?: string;
  ClientSecret?: string;
  SessionCookieName?: string;
  Scope?: string;
  SessionTimeout?: number;
  AuthenticationRequestExtraParams?: { [key: string]: string };
  OnUnauthenticatedRequest?: AuthenticateOidcActionConditionalBehaviorEnum;
  UseExistingClientSecret?: boolean;
}
export const AuthenticateOidcActionConfig = S.suspend(() =>
  S.Struct({
    Issuer: S.optional(S.String),
    AuthorizationEndpoint: S.optional(S.String),
    TokenEndpoint: S.optional(S.String),
    UserInfoEndpoint: S.optional(S.String),
    ClientId: S.optional(S.String),
    ClientSecret: S.optional(S.String),
    SessionCookieName: S.optional(S.String),
    Scope: S.optional(S.String),
    SessionTimeout: S.optional(S.Number),
    AuthenticationRequestExtraParams: S.optional(
      AuthenticateOidcActionAuthenticationRequestExtraParams,
    ),
    OnUnauthenticatedRequest: S.optional(
      AuthenticateOidcActionConditionalBehaviorEnum,
    ),
    UseExistingClientSecret: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AuthenticateOidcActionConfig",
}) as any as S.Schema<AuthenticateOidcActionConfig>;
export type AuthenticateCognitoActionAuthenticationRequestExtraParams = {
  [key: string]: string;
};
export const AuthenticateCognitoActionAuthenticationRequestExtraParams =
  S.Record({ key: S.String, value: S.String });
export type AuthenticateCognitoActionConditionalBehaviorEnum =
  | "deny"
  | "allow"
  | "authenticate";
export const AuthenticateCognitoActionConditionalBehaviorEnum = S.Literal(
  "deny",
  "allow",
  "authenticate",
);
export interface AuthenticateCognitoActionConfig {
  UserPoolArn?: string;
  UserPoolClientId?: string;
  UserPoolDomain?: string;
  SessionCookieName?: string;
  Scope?: string;
  SessionTimeout?: number;
  AuthenticationRequestExtraParams?: { [key: string]: string };
  OnUnauthenticatedRequest?: AuthenticateCognitoActionConditionalBehaviorEnum;
}
export const AuthenticateCognitoActionConfig = S.suspend(() =>
  S.Struct({
    UserPoolArn: S.optional(S.String),
    UserPoolClientId: S.optional(S.String),
    UserPoolDomain: S.optional(S.String),
    SessionCookieName: S.optional(S.String),
    Scope: S.optional(S.String),
    SessionTimeout: S.optional(S.Number),
    AuthenticationRequestExtraParams: S.optional(
      AuthenticateCognitoActionAuthenticationRequestExtraParams,
    ),
    OnUnauthenticatedRequest: S.optional(
      AuthenticateCognitoActionConditionalBehaviorEnum,
    ),
  }),
).annotations({
  identifier: "AuthenticateCognitoActionConfig",
}) as any as S.Schema<AuthenticateCognitoActionConfig>;
export type RedirectActionStatusCodeEnum = "HTTP_301" | "HTTP_302";
export const RedirectActionStatusCodeEnum = S.Literal("HTTP_301", "HTTP_302");
export interface RedirectActionConfig {
  Protocol?: string;
  Port?: string;
  Host?: string;
  Path?: string;
  Query?: string;
  StatusCode?: RedirectActionStatusCodeEnum;
}
export const RedirectActionConfig = S.suspend(() =>
  S.Struct({
    Protocol: S.optional(S.String),
    Port: S.optional(S.String),
    Host: S.optional(S.String),
    Path: S.optional(S.String),
    Query: S.optional(S.String),
    StatusCode: S.optional(RedirectActionStatusCodeEnum),
  }),
).annotations({
  identifier: "RedirectActionConfig",
}) as any as S.Schema<RedirectActionConfig>;
export interface FixedResponseActionConfig {
  MessageBody?: string;
  StatusCode?: string;
  ContentType?: string;
}
export const FixedResponseActionConfig = S.suspend(() =>
  S.Struct({
    MessageBody: S.optional(S.String),
    StatusCode: S.optional(S.String),
    ContentType: S.optional(S.String),
  }),
).annotations({
  identifier: "FixedResponseActionConfig",
}) as any as S.Schema<FixedResponseActionConfig>;
export interface TargetGroupTuple {
  TargetGroupArn?: string;
  Weight?: number;
}
export const TargetGroupTuple = S.suspend(() =>
  S.Struct({
    TargetGroupArn: S.optional(S.String),
    Weight: S.optional(S.Number),
  }),
).annotations({
  identifier: "TargetGroupTuple",
}) as any as S.Schema<TargetGroupTuple>;
export type TargetGroupList = TargetGroupTuple[];
export const TargetGroupList = S.Array(TargetGroupTuple);
export interface TargetGroupStickinessConfig {
  Enabled?: boolean;
  DurationSeconds?: number;
}
export const TargetGroupStickinessConfig = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    DurationSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "TargetGroupStickinessConfig",
}) as any as S.Schema<TargetGroupStickinessConfig>;
export interface ForwardActionConfig {
  TargetGroups?: TargetGroupTuple[];
  TargetGroupStickinessConfig?: TargetGroupStickinessConfig;
}
export const ForwardActionConfig = S.suspend(() =>
  S.Struct({
    TargetGroups: S.optional(TargetGroupList),
    TargetGroupStickinessConfig: S.optional(TargetGroupStickinessConfig),
  }),
).annotations({
  identifier: "ForwardActionConfig",
}) as any as S.Schema<ForwardActionConfig>;
export type JwtValidationActionAdditionalClaimFormatEnum =
  | "single-string"
  | "string-array"
  | "space-separated-values";
export const JwtValidationActionAdditionalClaimFormatEnum = S.Literal(
  "single-string",
  "string-array",
  "space-separated-values",
);
export type JwtValidationActionAdditionalClaimValues = string[];
export const JwtValidationActionAdditionalClaimValues = S.Array(S.String);
export interface JwtValidationActionAdditionalClaim {
  Format?: JwtValidationActionAdditionalClaimFormatEnum;
  Name?: string;
  Values?: string[];
}
export const JwtValidationActionAdditionalClaim = S.suspend(() =>
  S.Struct({
    Format: S.optional(JwtValidationActionAdditionalClaimFormatEnum),
    Name: S.optional(S.String),
    Values: S.optional(JwtValidationActionAdditionalClaimValues),
  }),
).annotations({
  identifier: "JwtValidationActionAdditionalClaim",
}) as any as S.Schema<JwtValidationActionAdditionalClaim>;
export type JwtValidationActionAdditionalClaims =
  JwtValidationActionAdditionalClaim[];
export const JwtValidationActionAdditionalClaims = S.Array(
  JwtValidationActionAdditionalClaim,
);
export interface JwtValidationActionConfig {
  JwksEndpoint?: string;
  Issuer?: string;
  AdditionalClaims?: JwtValidationActionAdditionalClaim[];
}
export const JwtValidationActionConfig = S.suspend(() =>
  S.Struct({
    JwksEndpoint: S.optional(S.String),
    Issuer: S.optional(S.String),
    AdditionalClaims: S.optional(JwtValidationActionAdditionalClaims),
  }),
).annotations({
  identifier: "JwtValidationActionConfig",
}) as any as S.Schema<JwtValidationActionConfig>;
export interface Action {
  Type?: ActionTypeEnum;
  TargetGroupArn?: string;
  AuthenticateOidcConfig?: AuthenticateOidcActionConfig;
  AuthenticateCognitoConfig?: AuthenticateCognitoActionConfig;
  Order?: number;
  RedirectConfig?: RedirectActionConfig;
  FixedResponseConfig?: FixedResponseActionConfig;
  ForwardConfig?: ForwardActionConfig;
  JwtValidationConfig?: JwtValidationActionConfig;
}
export const Action = S.suspend(() =>
  S.Struct({
    Type: S.optional(ActionTypeEnum),
    TargetGroupArn: S.optional(S.String),
    AuthenticateOidcConfig: S.optional(AuthenticateOidcActionConfig),
    AuthenticateCognitoConfig: S.optional(AuthenticateCognitoActionConfig),
    Order: S.optional(S.Number),
    RedirectConfig: S.optional(RedirectActionConfig),
    FixedResponseConfig: S.optional(FixedResponseActionConfig),
    ForwardConfig: S.optional(ForwardActionConfig),
    JwtValidationConfig: S.optional(JwtValidationActionConfig),
  }),
).annotations({ identifier: "Action" }) as any as S.Schema<Action>;
export type Actions = Action[];
export const Actions = S.Array(Action);
export type TrustStoreAssociationStatusEnum = "active" | "removed";
export const TrustStoreAssociationStatusEnum = S.Literal("active", "removed");
export type AdvertiseTrustStoreCaNamesEnum = "on" | "off";
export const AdvertiseTrustStoreCaNamesEnum = S.Literal("on", "off");
export interface MutualAuthenticationAttributes {
  Mode?: string;
  TrustStoreArn?: string;
  IgnoreClientCertificateExpiry?: boolean;
  TrustStoreAssociationStatus?: TrustStoreAssociationStatusEnum;
  AdvertiseTrustStoreCaNames?: AdvertiseTrustStoreCaNamesEnum;
}
export const MutualAuthenticationAttributes = S.suspend(() =>
  S.Struct({
    Mode: S.optional(S.String),
    TrustStoreArn: S.optional(S.String),
    IgnoreClientCertificateExpiry: S.optional(S.Boolean),
    TrustStoreAssociationStatus: S.optional(TrustStoreAssociationStatusEnum),
    AdvertiseTrustStoreCaNames: S.optional(AdvertiseTrustStoreCaNamesEnum),
  }),
).annotations({
  identifier: "MutualAuthenticationAttributes",
}) as any as S.Schema<MutualAuthenticationAttributes>;
export interface ModifyListenerInput {
  ListenerArn?: string;
  Port?: number;
  Protocol?: ProtocolEnum;
  SslPolicy?: string;
  Certificates?: Certificate[];
  DefaultActions?: Action[];
  AlpnPolicy?: string[];
  MutualAuthentication?: MutualAuthenticationAttributes;
}
export const ModifyListenerInput = S.suspend(() =>
  S.Struct({
    ListenerArn: S.optional(S.String),
    Port: S.optional(S.Number),
    Protocol: S.optional(ProtocolEnum),
    SslPolicy: S.optional(S.String),
    Certificates: S.optional(CertificateList),
    DefaultActions: S.optional(Actions),
    AlpnPolicy: S.optional(AlpnPolicyName),
    MutualAuthentication: S.optional(MutualAuthenticationAttributes),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyListenerInput",
}) as any as S.Schema<ModifyListenerInput>;
export type ListOfString = string[];
export const ListOfString = S.Array(S.String);
export interface HostHeaderConditionConfig {
  Values?: string[];
  RegexValues?: string[];
}
export const HostHeaderConditionConfig = S.suspend(() =>
  S.Struct({
    Values: S.optional(ListOfString),
    RegexValues: S.optional(ListOfString),
  }),
).annotations({
  identifier: "HostHeaderConditionConfig",
}) as any as S.Schema<HostHeaderConditionConfig>;
export interface PathPatternConditionConfig {
  Values?: string[];
  RegexValues?: string[];
}
export const PathPatternConditionConfig = S.suspend(() =>
  S.Struct({
    Values: S.optional(ListOfString),
    RegexValues: S.optional(ListOfString),
  }),
).annotations({
  identifier: "PathPatternConditionConfig",
}) as any as S.Schema<PathPatternConditionConfig>;
export interface HttpHeaderConditionConfig {
  HttpHeaderName?: string;
  Values?: string[];
  RegexValues?: string[];
}
export const HttpHeaderConditionConfig = S.suspend(() =>
  S.Struct({
    HttpHeaderName: S.optional(S.String),
    Values: S.optional(ListOfString),
    RegexValues: S.optional(ListOfString),
  }),
).annotations({
  identifier: "HttpHeaderConditionConfig",
}) as any as S.Schema<HttpHeaderConditionConfig>;
export interface QueryStringKeyValuePair {
  Key?: string;
  Value?: string;
}
export const QueryStringKeyValuePair = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "QueryStringKeyValuePair",
}) as any as S.Schema<QueryStringKeyValuePair>;
export type QueryStringKeyValuePairList = QueryStringKeyValuePair[];
export const QueryStringKeyValuePairList = S.Array(QueryStringKeyValuePair);
export interface QueryStringConditionConfig {
  Values?: QueryStringKeyValuePair[];
}
export const QueryStringConditionConfig = S.suspend(() =>
  S.Struct({ Values: S.optional(QueryStringKeyValuePairList) }),
).annotations({
  identifier: "QueryStringConditionConfig",
}) as any as S.Schema<QueryStringConditionConfig>;
export interface HttpRequestMethodConditionConfig {
  Values?: string[];
}
export const HttpRequestMethodConditionConfig = S.suspend(() =>
  S.Struct({ Values: S.optional(ListOfString) }),
).annotations({
  identifier: "HttpRequestMethodConditionConfig",
}) as any as S.Schema<HttpRequestMethodConditionConfig>;
export interface SourceIpConditionConfig {
  Values?: string[];
}
export const SourceIpConditionConfig = S.suspend(() =>
  S.Struct({ Values: S.optional(ListOfString) }),
).annotations({
  identifier: "SourceIpConditionConfig",
}) as any as S.Schema<SourceIpConditionConfig>;
export interface RuleCondition {
  Field?: string;
  Values?: string[];
  HostHeaderConfig?: HostHeaderConditionConfig;
  PathPatternConfig?: PathPatternConditionConfig;
  HttpHeaderConfig?: HttpHeaderConditionConfig;
  QueryStringConfig?: QueryStringConditionConfig;
  HttpRequestMethodConfig?: HttpRequestMethodConditionConfig;
  SourceIpConfig?: SourceIpConditionConfig;
  RegexValues?: string[];
}
export const RuleCondition = S.suspend(() =>
  S.Struct({
    Field: S.optional(S.String),
    Values: S.optional(ListOfString),
    HostHeaderConfig: S.optional(HostHeaderConditionConfig),
    PathPatternConfig: S.optional(PathPatternConditionConfig),
    HttpHeaderConfig: S.optional(HttpHeaderConditionConfig),
    QueryStringConfig: S.optional(QueryStringConditionConfig),
    HttpRequestMethodConfig: S.optional(HttpRequestMethodConditionConfig),
    SourceIpConfig: S.optional(SourceIpConditionConfig),
    RegexValues: S.optional(ListOfString),
  }),
).annotations({
  identifier: "RuleCondition",
}) as any as S.Schema<RuleCondition>;
export type RuleConditionList = RuleCondition[];
export const RuleConditionList = S.Array(RuleCondition);
export type TransformTypeEnum = "host-header-rewrite" | "url-rewrite";
export const TransformTypeEnum = S.Literal(
  "host-header-rewrite",
  "url-rewrite",
);
export interface RewriteConfig {
  Regex?: string;
  Replace?: string;
}
export const RewriteConfig = S.suspend(() =>
  S.Struct({ Regex: S.optional(S.String), Replace: S.optional(S.String) }),
).annotations({
  identifier: "RewriteConfig",
}) as any as S.Schema<RewriteConfig>;
export type RewriteConfigList = RewriteConfig[];
export const RewriteConfigList = S.Array(RewriteConfig);
export interface HostHeaderRewriteConfig {
  Rewrites?: RewriteConfig[];
}
export const HostHeaderRewriteConfig = S.suspend(() =>
  S.Struct({ Rewrites: S.optional(RewriteConfigList) }),
).annotations({
  identifier: "HostHeaderRewriteConfig",
}) as any as S.Schema<HostHeaderRewriteConfig>;
export interface UrlRewriteConfig {
  Rewrites?: RewriteConfig[];
}
export const UrlRewriteConfig = S.suspend(() =>
  S.Struct({ Rewrites: S.optional(RewriteConfigList) }),
).annotations({
  identifier: "UrlRewriteConfig",
}) as any as S.Schema<UrlRewriteConfig>;
export interface RuleTransform {
  Type?: TransformTypeEnum;
  HostHeaderRewriteConfig?: HostHeaderRewriteConfig;
  UrlRewriteConfig?: UrlRewriteConfig;
}
export const RuleTransform = S.suspend(() =>
  S.Struct({
    Type: S.optional(TransformTypeEnum),
    HostHeaderRewriteConfig: S.optional(HostHeaderRewriteConfig),
    UrlRewriteConfig: S.optional(UrlRewriteConfig),
  }),
).annotations({
  identifier: "RuleTransform",
}) as any as S.Schema<RuleTransform>;
export type RuleTransformList = RuleTransform[];
export const RuleTransformList = S.Array(RuleTransform);
export interface ModifyRuleInput {
  RuleArn?: string;
  Conditions?: RuleCondition[];
  Actions?: Action[];
  Transforms?: RuleTransform[];
  ResetTransforms?: boolean;
}
export const ModifyRuleInput = S.suspend(() =>
  S.Struct({
    RuleArn: S.optional(S.String),
    Conditions: S.optional(RuleConditionList),
    Actions: S.optional(Actions),
    Transforms: S.optional(RuleTransformList),
    ResetTransforms: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyRuleInput",
}) as any as S.Schema<ModifyRuleInput>;
export interface Matcher {
  HttpCode?: string;
  GrpcCode?: string;
}
export const Matcher = S.suspend(() =>
  S.Struct({ HttpCode: S.optional(S.String), GrpcCode: S.optional(S.String) }),
).annotations({ identifier: "Matcher" }) as any as S.Schema<Matcher>;
export interface ModifyTargetGroupInput {
  TargetGroupArn?: string;
  HealthCheckProtocol?: ProtocolEnum;
  HealthCheckPort?: string;
  HealthCheckPath?: string;
  HealthCheckEnabled?: boolean;
  HealthCheckIntervalSeconds?: number;
  HealthCheckTimeoutSeconds?: number;
  HealthyThresholdCount?: number;
  UnhealthyThresholdCount?: number;
  Matcher?: Matcher;
}
export const ModifyTargetGroupInput = S.suspend(() =>
  S.Struct({
    TargetGroupArn: S.optional(S.String),
    HealthCheckProtocol: S.optional(ProtocolEnum),
    HealthCheckPort: S.optional(S.String),
    HealthCheckPath: S.optional(S.String),
    HealthCheckEnabled: S.optional(S.Boolean),
    HealthCheckIntervalSeconds: S.optional(S.Number),
    HealthCheckTimeoutSeconds: S.optional(S.Number),
    HealthyThresholdCount: S.optional(S.Number),
    UnhealthyThresholdCount: S.optional(S.Number),
    Matcher: S.optional(Matcher),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyTargetGroupInput",
}) as any as S.Schema<ModifyTargetGroupInput>;
export interface ModifyTrustStoreInput {
  TrustStoreArn?: string;
  CaCertificatesBundleS3Bucket?: string;
  CaCertificatesBundleS3Key?: string;
  CaCertificatesBundleS3ObjectVersion?: string;
}
export const ModifyTrustStoreInput = S.suspend(() =>
  S.Struct({
    TrustStoreArn: S.optional(S.String),
    CaCertificatesBundleS3Bucket: S.optional(S.String),
    CaCertificatesBundleS3Key: S.optional(S.String),
    CaCertificatesBundleS3ObjectVersion: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyTrustStoreInput",
}) as any as S.Schema<ModifyTrustStoreInput>;
export interface RegisterTargetsInput {
  TargetGroupArn?: string;
  Targets?: TargetDescription[];
}
export const RegisterTargetsInput = S.suspend(() =>
  S.Struct({
    TargetGroupArn: S.optional(S.String),
    Targets: S.optional(TargetDescriptions),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterTargetsInput",
}) as any as S.Schema<RegisterTargetsInput>;
export interface RegisterTargetsOutput {}
export const RegisterTargetsOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RegisterTargetsOutput",
}) as any as S.Schema<RegisterTargetsOutput>;
export interface RemoveListenerCertificatesInput {
  ListenerArn?: string;
  Certificates?: Certificate[];
}
export const RemoveListenerCertificatesInput = S.suspend(() =>
  S.Struct({
    ListenerArn: S.optional(S.String),
    Certificates: S.optional(CertificateList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveListenerCertificatesInput",
}) as any as S.Schema<RemoveListenerCertificatesInput>;
export interface RemoveListenerCertificatesOutput {}
export const RemoveListenerCertificatesOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveListenerCertificatesOutput",
}) as any as S.Schema<RemoveListenerCertificatesOutput>;
export interface RemoveTagsInput {
  ResourceArns?: string[];
  TagKeys?: string[];
}
export const RemoveTagsInput = S.suspend(() =>
  S.Struct({
    ResourceArns: S.optional(ResourceArns),
    TagKeys: S.optional(TagKeys),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveTagsInput",
}) as any as S.Schema<RemoveTagsInput>;
export interface RemoveTagsOutput {}
export const RemoveTagsOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveTagsOutput",
}) as any as S.Schema<RemoveTagsOutput>;
export interface RemoveTrustStoreRevocationsInput {
  TrustStoreArn?: string;
  RevocationIds?: number[];
}
export const RemoveTrustStoreRevocationsInput = S.suspend(() =>
  S.Struct({
    TrustStoreArn: S.optional(S.String),
    RevocationIds: S.optional(RevocationIds),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveTrustStoreRevocationsInput",
}) as any as S.Schema<RemoveTrustStoreRevocationsInput>;
export interface RemoveTrustStoreRevocationsOutput {}
export const RemoveTrustStoreRevocationsOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveTrustStoreRevocationsOutput",
}) as any as S.Schema<RemoveTrustStoreRevocationsOutput>;
export interface SetIpAddressTypeInput {
  LoadBalancerArn?: string;
  IpAddressType?: IpAddressType;
}
export const SetIpAddressTypeInput = S.suspend(() =>
  S.Struct({
    LoadBalancerArn: S.optional(S.String),
    IpAddressType: S.optional(IpAddressType),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetIpAddressTypeInput",
}) as any as S.Schema<SetIpAddressTypeInput>;
export interface SetSecurityGroupsInput {
  LoadBalancerArn?: string;
  SecurityGroups?: string[];
  EnforceSecurityGroupInboundRulesOnPrivateLinkTraffic?: EnforceSecurityGroupInboundRulesOnPrivateLinkTrafficEnum;
}
export const SetSecurityGroupsInput = S.suspend(() =>
  S.Struct({
    LoadBalancerArn: S.optional(S.String),
    SecurityGroups: S.optional(SecurityGroups),
    EnforceSecurityGroupInboundRulesOnPrivateLinkTraffic: S.optional(
      EnforceSecurityGroupInboundRulesOnPrivateLinkTrafficEnum,
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetSecurityGroupsInput",
}) as any as S.Schema<SetSecurityGroupsInput>;
export interface SubnetMapping {
  SubnetId?: string;
  AllocationId?: string;
  PrivateIPv4Address?: string;
  IPv6Address?: string;
  SourceNatIpv6Prefix?: string;
}
export const SubnetMapping = S.suspend(() =>
  S.Struct({
    SubnetId: S.optional(S.String),
    AllocationId: S.optional(S.String),
    PrivateIPv4Address: S.optional(S.String),
    IPv6Address: S.optional(S.String),
    SourceNatIpv6Prefix: S.optional(S.String),
  }),
).annotations({
  identifier: "SubnetMapping",
}) as any as S.Schema<SubnetMapping>;
export type SubnetMappings = SubnetMapping[];
export const SubnetMappings = S.Array(SubnetMapping);
export interface SetSubnetsInput {
  LoadBalancerArn?: string;
  Subnets?: string[];
  SubnetMappings?: SubnetMapping[];
  IpAddressType?: IpAddressType;
  EnablePrefixForIpv6SourceNat?: EnablePrefixForIpv6SourceNatEnum;
}
export const SetSubnetsInput = S.suspend(() =>
  S.Struct({
    LoadBalancerArn: S.optional(S.String),
    Subnets: S.optional(Subnets),
    SubnetMappings: S.optional(SubnetMappings),
    IpAddressType: S.optional(IpAddressType),
    EnablePrefixForIpv6SourceNat: S.optional(EnablePrefixForIpv6SourceNatEnum),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetSubnetsInput",
}) as any as S.Schema<SetSubnetsInput>;
export type RevocationType = "CRL";
export const RevocationType = S.Literal("CRL");
export interface RevocationContent {
  S3Bucket?: string;
  S3Key?: string;
  S3ObjectVersion?: string;
  RevocationType?: RevocationType;
}
export const RevocationContent = S.suspend(() =>
  S.Struct({
    S3Bucket: S.optional(S.String),
    S3Key: S.optional(S.String),
    S3ObjectVersion: S.optional(S.String),
    RevocationType: S.optional(RevocationType),
  }),
).annotations({
  identifier: "RevocationContent",
}) as any as S.Schema<RevocationContent>;
export type RevocationContents = RevocationContent[];
export const RevocationContents = S.Array(RevocationContent);
export interface MinimumLoadBalancerCapacity {
  CapacityUnits?: number;
}
export const MinimumLoadBalancerCapacity = S.suspend(() =>
  S.Struct({ CapacityUnits: S.optional(S.Number) }),
).annotations({
  identifier: "MinimumLoadBalancerCapacity",
}) as any as S.Schema<MinimumLoadBalancerCapacity>;
export interface ListenerAttribute {
  Key?: string;
  Value?: string;
}
export const ListenerAttribute = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "ListenerAttribute",
}) as any as S.Schema<ListenerAttribute>;
export type ListenerAttributes = ListenerAttribute[];
export const ListenerAttributes = S.Array(ListenerAttribute);
export interface LoadBalancerAttribute {
  Key?: string;
  Value?: string;
}
export const LoadBalancerAttribute = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "LoadBalancerAttribute",
}) as any as S.Schema<LoadBalancerAttribute>;
export type LoadBalancerAttributes = LoadBalancerAttribute[];
export const LoadBalancerAttributes = S.Array(LoadBalancerAttribute);
export interface TargetGroupAttribute {
  Key?: string;
  Value?: string;
}
export const TargetGroupAttribute = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "TargetGroupAttribute",
}) as any as S.Schema<TargetGroupAttribute>;
export type TargetGroupAttributes = TargetGroupAttribute[];
export const TargetGroupAttributes = S.Array(TargetGroupAttribute);
export interface RulePriorityPair {
  RuleArn?: string;
  Priority?: number;
}
export const RulePriorityPair = S.suspend(() =>
  S.Struct({ RuleArn: S.optional(S.String), Priority: S.optional(S.Number) }),
).annotations({
  identifier: "RulePriorityPair",
}) as any as S.Schema<RulePriorityPair>;
export type RulePriorityList = RulePriorityPair[];
export const RulePriorityList = S.Array(RulePriorityPair);
export interface AddListenerCertificatesInput {
  ListenerArn?: string;
  Certificates?: Certificate[];
}
export const AddListenerCertificatesInput = S.suspend(() =>
  S.Struct({
    ListenerArn: S.optional(S.String),
    Certificates: S.optional(CertificateList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddListenerCertificatesInput",
}) as any as S.Schema<AddListenerCertificatesInput>;
export interface AddTagsInput {
  ResourceArns?: string[];
  Tags?: Tag[];
}
export const AddTagsInput = S.suspend(() =>
  S.Struct({
    ResourceArns: S.optional(ResourceArns),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({ identifier: "AddTagsInput" }) as any as S.Schema<AddTagsInput>;
export interface AddTagsOutput {}
export const AddTagsOutput = S.suspend(() => S.Struct({}).pipe(ns)).annotations(
  { identifier: "AddTagsOutput" },
) as any as S.Schema<AddTagsOutput>;
export interface AddTrustStoreRevocationsInput {
  TrustStoreArn?: string;
  RevocationContents?: RevocationContent[];
}
export const AddTrustStoreRevocationsInput = S.suspend(() =>
  S.Struct({
    TrustStoreArn: S.optional(S.String),
    RevocationContents: S.optional(RevocationContents),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddTrustStoreRevocationsInput",
}) as any as S.Schema<AddTrustStoreRevocationsInput>;
export interface CreateLoadBalancerInput {
  Name?: string;
  Subnets?: string[];
  SubnetMappings?: SubnetMapping[];
  SecurityGroups?: string[];
  Scheme?: LoadBalancerSchemeEnum;
  Tags?: Tag[];
  Type?: LoadBalancerTypeEnum;
  IpAddressType?: IpAddressType;
  CustomerOwnedIpv4Pool?: string;
  EnablePrefixForIpv6SourceNat?: EnablePrefixForIpv6SourceNatEnum;
  IpamPools?: IpamPools;
}
export const CreateLoadBalancerInput = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Subnets: S.optional(Subnets),
    SubnetMappings: S.optional(SubnetMappings),
    SecurityGroups: S.optional(SecurityGroups),
    Scheme: S.optional(LoadBalancerSchemeEnum),
    Tags: S.optional(TagList),
    Type: S.optional(LoadBalancerTypeEnum),
    IpAddressType: S.optional(IpAddressType),
    CustomerOwnedIpv4Pool: S.optional(S.String),
    EnablePrefixForIpv6SourceNat: S.optional(EnablePrefixForIpv6SourceNatEnum),
    IpamPools: S.optional(IpamPools),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLoadBalancerInput",
}) as any as S.Schema<CreateLoadBalancerInput>;
export interface CreateTargetGroupInput {
  Name?: string;
  Protocol?: ProtocolEnum;
  ProtocolVersion?: string;
  Port?: number;
  VpcId?: string;
  HealthCheckProtocol?: ProtocolEnum;
  HealthCheckPort?: string;
  HealthCheckEnabled?: boolean;
  HealthCheckPath?: string;
  HealthCheckIntervalSeconds?: number;
  HealthCheckTimeoutSeconds?: number;
  HealthyThresholdCount?: number;
  UnhealthyThresholdCount?: number;
  Matcher?: Matcher;
  TargetType?: TargetTypeEnum;
  Tags?: Tag[];
  IpAddressType?: TargetGroupIpAddressTypeEnum;
  TargetControlPort?: number;
}
export const CreateTargetGroupInput = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Protocol: S.optional(ProtocolEnum),
    ProtocolVersion: S.optional(S.String),
    Port: S.optional(S.Number),
    VpcId: S.optional(S.String),
    HealthCheckProtocol: S.optional(ProtocolEnum),
    HealthCheckPort: S.optional(S.String),
    HealthCheckEnabled: S.optional(S.Boolean),
    HealthCheckPath: S.optional(S.String),
    HealthCheckIntervalSeconds: S.optional(S.Number),
    HealthCheckTimeoutSeconds: S.optional(S.Number),
    HealthyThresholdCount: S.optional(S.Number),
    UnhealthyThresholdCount: S.optional(S.Number),
    Matcher: S.optional(Matcher),
    TargetType: S.optional(TargetTypeEnum),
    Tags: S.optional(TagList),
    IpAddressType: S.optional(TargetGroupIpAddressTypeEnum),
    TargetControlPort: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTargetGroupInput",
}) as any as S.Schema<CreateTargetGroupInput>;
export interface DeregisterTargetsInput {
  TargetGroupArn?: string;
  Targets?: TargetDescription[];
}
export const DeregisterTargetsInput = S.suspend(() =>
  S.Struct({
    TargetGroupArn: S.optional(S.String),
    Targets: S.optional(TargetDescriptions),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeregisterTargetsInput",
}) as any as S.Schema<DeregisterTargetsInput>;
export interface DeregisterTargetsOutput {}
export const DeregisterTargetsOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeregisterTargetsOutput",
}) as any as S.Schema<DeregisterTargetsOutput>;
export interface DescribeListenerAttributesOutput {
  Attributes?: ListenerAttribute[];
}
export const DescribeListenerAttributesOutput = S.suspend(() =>
  S.Struct({ Attributes: S.optional(ListenerAttributes) }).pipe(ns),
).annotations({
  identifier: "DescribeListenerAttributesOutput",
}) as any as S.Schema<DescribeListenerAttributesOutput>;
export interface DescribeListenerCertificatesOutput {
  Certificates?: Certificate[];
  NextMarker?: string;
}
export const DescribeListenerCertificatesOutput = S.suspend(() =>
  S.Struct({
    Certificates: S.optional(CertificateList),
    NextMarker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeListenerCertificatesOutput",
}) as any as S.Schema<DescribeListenerCertificatesOutput>;
export interface DescribeLoadBalancerAttributesOutput {
  Attributes?: LoadBalancerAttribute[];
}
export const DescribeLoadBalancerAttributesOutput = S.suspend(() =>
  S.Struct({ Attributes: S.optional(LoadBalancerAttributes) }).pipe(ns),
).annotations({
  identifier: "DescribeLoadBalancerAttributesOutput",
}) as any as S.Schema<DescribeLoadBalancerAttributesOutput>;
export interface DescribeTargetGroupAttributesOutput {
  Attributes?: TargetGroupAttribute[];
}
export const DescribeTargetGroupAttributesOutput = S.suspend(() =>
  S.Struct({ Attributes: S.optional(TargetGroupAttributes) }).pipe(ns),
).annotations({
  identifier: "DescribeTargetGroupAttributesOutput",
}) as any as S.Schema<DescribeTargetGroupAttributesOutput>;
export type TrustStoreStatus = "ACTIVE" | "CREATING";
export const TrustStoreStatus = S.Literal("ACTIVE", "CREATING");
export interface TrustStore {
  Name?: string;
  TrustStoreArn?: string;
  Status?: TrustStoreStatus;
  NumberOfCaCertificates?: number;
  TotalRevokedEntries?: number;
}
export const TrustStore = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    TrustStoreArn: S.optional(S.String),
    Status: S.optional(TrustStoreStatus),
    NumberOfCaCertificates: S.optional(S.Number),
    TotalRevokedEntries: S.optional(S.Number),
  }),
).annotations({ identifier: "TrustStore" }) as any as S.Schema<TrustStore>;
export type TrustStores = TrustStore[];
export const TrustStores = S.Array(TrustStore);
export interface DescribeTrustStoresOutput {
  TrustStores?: TrustStore[];
  NextMarker?: string;
}
export const DescribeTrustStoresOutput = S.suspend(() =>
  S.Struct({
    TrustStores: S.optional(TrustStores),
    NextMarker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeTrustStoresOutput",
}) as any as S.Schema<DescribeTrustStoresOutput>;
export interface GetResourcePolicyOutput {
  Policy?: string;
}
export const GetResourcePolicyOutput = S.suspend(() =>
  S.Struct({ Policy: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "GetResourcePolicyOutput",
}) as any as S.Schema<GetResourcePolicyOutput>;
export interface GetTrustStoreCaCertificatesBundleOutput {
  Location?: string;
}
export const GetTrustStoreCaCertificatesBundleOutput = S.suspend(() =>
  S.Struct({ Location: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "GetTrustStoreCaCertificatesBundleOutput",
}) as any as S.Schema<GetTrustStoreCaCertificatesBundleOutput>;
export interface GetTrustStoreRevocationContentOutput {
  Location?: string;
}
export const GetTrustStoreRevocationContentOutput = S.suspend(() =>
  S.Struct({ Location: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "GetTrustStoreRevocationContentOutput",
}) as any as S.Schema<GetTrustStoreRevocationContentOutput>;
export interface ModifyCapacityReservationInput {
  LoadBalancerArn?: string;
  MinimumLoadBalancerCapacity?: MinimumLoadBalancerCapacity;
  ResetCapacityReservation?: boolean;
}
export const ModifyCapacityReservationInput = S.suspend(() =>
  S.Struct({
    LoadBalancerArn: S.optional(S.String),
    MinimumLoadBalancerCapacity: S.optional(MinimumLoadBalancerCapacity),
    ResetCapacityReservation: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyCapacityReservationInput",
}) as any as S.Schema<ModifyCapacityReservationInput>;
export interface ModifyIpPoolsOutput {
  IpamPools?: IpamPools;
}
export const ModifyIpPoolsOutput = S.suspend(() =>
  S.Struct({ IpamPools: S.optional(IpamPools) }).pipe(ns),
).annotations({
  identifier: "ModifyIpPoolsOutput",
}) as any as S.Schema<ModifyIpPoolsOutput>;
export interface Listener {
  ListenerArn?: string;
  LoadBalancerArn?: string;
  Port?: number;
  Protocol?: ProtocolEnum;
  Certificates?: Certificate[];
  SslPolicy?: string;
  DefaultActions?: Action[];
  AlpnPolicy?: string[];
  MutualAuthentication?: MutualAuthenticationAttributes;
}
export const Listener = S.suspend(() =>
  S.Struct({
    ListenerArn: S.optional(S.String),
    LoadBalancerArn: S.optional(S.String),
    Port: S.optional(S.Number),
    Protocol: S.optional(ProtocolEnum),
    Certificates: S.optional(CertificateList),
    SslPolicy: S.optional(S.String),
    DefaultActions: S.optional(Actions),
    AlpnPolicy: S.optional(AlpnPolicyName),
    MutualAuthentication: S.optional(MutualAuthenticationAttributes),
  }),
).annotations({ identifier: "Listener" }) as any as S.Schema<Listener>;
export type Listeners = Listener[];
export const Listeners = S.Array(Listener);
export interface ModifyListenerOutput {
  Listeners?: (Listener & {
    DefaultActions: (Action & {
      Type: ActionTypeEnum;
      AuthenticateOidcConfig: AuthenticateOidcActionConfig & {
        Issuer: AuthenticateOidcActionIssuer;
        AuthorizationEndpoint: AuthenticateOidcActionAuthorizationEndpoint;
        TokenEndpoint: AuthenticateOidcActionTokenEndpoint;
        UserInfoEndpoint: AuthenticateOidcActionUserInfoEndpoint;
        ClientId: AuthenticateOidcActionClientId;
      };
      AuthenticateCognitoConfig: AuthenticateCognitoActionConfig & {
        UserPoolArn: AuthenticateCognitoActionUserPoolArn;
        UserPoolClientId: AuthenticateCognitoActionUserPoolClientId;
        UserPoolDomain: AuthenticateCognitoActionUserPoolDomain;
      };
      RedirectConfig: RedirectActionConfig & {
        StatusCode: RedirectActionStatusCodeEnum;
      };
      FixedResponseConfig: FixedResponseActionConfig & {
        StatusCode: FixedResponseActionStatusCode;
      };
      JwtValidationConfig: JwtValidationActionConfig & {
        JwksEndpoint: JwtValidationActionJwksEndpoint;
        Issuer: JwtValidationActionIssuer;
        AdditionalClaims: (JwtValidationActionAdditionalClaim & {
          Format: JwtValidationActionAdditionalClaimFormatEnum;
          Name: JwtValidationActionAdditionalClaimName;
          Values: JwtValidationActionAdditionalClaimValues;
        })[];
      };
    })[];
  })[];
}
export const ModifyListenerOutput = S.suspend(() =>
  S.Struct({ Listeners: S.optional(Listeners) }).pipe(ns),
).annotations({
  identifier: "ModifyListenerOutput",
}) as any as S.Schema<ModifyListenerOutput>;
export interface ModifyListenerAttributesInput {
  ListenerArn?: string;
  Attributes?: ListenerAttribute[];
}
export const ModifyListenerAttributesInput = S.suspend(() =>
  S.Struct({
    ListenerArn: S.optional(S.String),
    Attributes: S.optional(ListenerAttributes),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyListenerAttributesInput",
}) as any as S.Schema<ModifyListenerAttributesInput>;
export interface ModifyLoadBalancerAttributesInput {
  LoadBalancerArn?: string;
  Attributes?: LoadBalancerAttribute[];
}
export const ModifyLoadBalancerAttributesInput = S.suspend(() =>
  S.Struct({
    LoadBalancerArn: S.optional(S.String),
    Attributes: S.optional(LoadBalancerAttributes),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyLoadBalancerAttributesInput",
}) as any as S.Schema<ModifyLoadBalancerAttributesInput>;
export interface Rule {
  RuleArn?: string;
  Priority?: string;
  Conditions?: RuleCondition[];
  Actions?: Action[];
  IsDefault?: boolean;
  Transforms?: RuleTransform[];
}
export const Rule = S.suspend(() =>
  S.Struct({
    RuleArn: S.optional(S.String),
    Priority: S.optional(S.String),
    Conditions: S.optional(RuleConditionList),
    Actions: S.optional(Actions),
    IsDefault: S.optional(S.Boolean),
    Transforms: S.optional(RuleTransformList),
  }),
).annotations({ identifier: "Rule" }) as any as S.Schema<Rule>;
export type Rules = Rule[];
export const Rules = S.Array(Rule);
export interface ModifyRuleOutput {
  Rules?: (Rule & {
    Actions: (Action & {
      Type: ActionTypeEnum;
      AuthenticateOidcConfig: AuthenticateOidcActionConfig & {
        Issuer: AuthenticateOidcActionIssuer;
        AuthorizationEndpoint: AuthenticateOidcActionAuthorizationEndpoint;
        TokenEndpoint: AuthenticateOidcActionTokenEndpoint;
        UserInfoEndpoint: AuthenticateOidcActionUserInfoEndpoint;
        ClientId: AuthenticateOidcActionClientId;
      };
      AuthenticateCognitoConfig: AuthenticateCognitoActionConfig & {
        UserPoolArn: AuthenticateCognitoActionUserPoolArn;
        UserPoolClientId: AuthenticateCognitoActionUserPoolClientId;
        UserPoolDomain: AuthenticateCognitoActionUserPoolDomain;
      };
      RedirectConfig: RedirectActionConfig & {
        StatusCode: RedirectActionStatusCodeEnum;
      };
      FixedResponseConfig: FixedResponseActionConfig & {
        StatusCode: FixedResponseActionStatusCode;
      };
      JwtValidationConfig: JwtValidationActionConfig & {
        JwksEndpoint: JwtValidationActionJwksEndpoint;
        Issuer: JwtValidationActionIssuer;
        AdditionalClaims: (JwtValidationActionAdditionalClaim & {
          Format: JwtValidationActionAdditionalClaimFormatEnum;
          Name: JwtValidationActionAdditionalClaimName;
          Values: JwtValidationActionAdditionalClaimValues;
        })[];
      };
    })[];
    Transforms: (RuleTransform & {
      Type: TransformTypeEnum;
      HostHeaderRewriteConfig: HostHeaderRewriteConfig & {
        Rewrites: (RewriteConfig & {
          Regex: StringValue;
          Replace: StringValue;
        })[];
      };
      UrlRewriteConfig: UrlRewriteConfig & {
        Rewrites: (RewriteConfig & {
          Regex: StringValue;
          Replace: StringValue;
        })[];
      };
    })[];
  })[];
}
export const ModifyRuleOutput = S.suspend(() =>
  S.Struct({ Rules: S.optional(Rules) }).pipe(ns),
).annotations({
  identifier: "ModifyRuleOutput",
}) as any as S.Schema<ModifyRuleOutput>;
export interface TargetGroup {
  TargetGroupArn?: string;
  TargetGroupName?: string;
  Protocol?: ProtocolEnum;
  Port?: number;
  VpcId?: string;
  HealthCheckProtocol?: ProtocolEnum;
  HealthCheckPort?: string;
  HealthCheckEnabled?: boolean;
  HealthCheckIntervalSeconds?: number;
  HealthCheckTimeoutSeconds?: number;
  HealthyThresholdCount?: number;
  UnhealthyThresholdCount?: number;
  HealthCheckPath?: string;
  Matcher?: Matcher;
  LoadBalancerArns?: string[];
  TargetType?: TargetTypeEnum;
  ProtocolVersion?: string;
  IpAddressType?: TargetGroupIpAddressTypeEnum;
  TargetControlPort?: number;
}
export const TargetGroup = S.suspend(() =>
  S.Struct({
    TargetGroupArn: S.optional(S.String),
    TargetGroupName: S.optional(S.String),
    Protocol: S.optional(ProtocolEnum),
    Port: S.optional(S.Number),
    VpcId: S.optional(S.String),
    HealthCheckProtocol: S.optional(ProtocolEnum),
    HealthCheckPort: S.optional(S.String),
    HealthCheckEnabled: S.optional(S.Boolean),
    HealthCheckIntervalSeconds: S.optional(S.Number),
    HealthCheckTimeoutSeconds: S.optional(S.Number),
    HealthyThresholdCount: S.optional(S.Number),
    UnhealthyThresholdCount: S.optional(S.Number),
    HealthCheckPath: S.optional(S.String),
    Matcher: S.optional(Matcher),
    LoadBalancerArns: S.optional(LoadBalancerArns),
    TargetType: S.optional(TargetTypeEnum),
    ProtocolVersion: S.optional(S.String),
    IpAddressType: S.optional(TargetGroupIpAddressTypeEnum),
    TargetControlPort: S.optional(S.Number),
  }),
).annotations({ identifier: "TargetGroup" }) as any as S.Schema<TargetGroup>;
export type TargetGroups = TargetGroup[];
export const TargetGroups = S.Array(TargetGroup);
export interface ModifyTargetGroupOutput {
  TargetGroups?: TargetGroup[];
}
export const ModifyTargetGroupOutput = S.suspend(() =>
  S.Struct({ TargetGroups: S.optional(TargetGroups) }).pipe(ns),
).annotations({
  identifier: "ModifyTargetGroupOutput",
}) as any as S.Schema<ModifyTargetGroupOutput>;
export interface ModifyTargetGroupAttributesInput {
  TargetGroupArn?: string;
  Attributes?: TargetGroupAttribute[];
}
export const ModifyTargetGroupAttributesInput = S.suspend(() =>
  S.Struct({
    TargetGroupArn: S.optional(S.String),
    Attributes: S.optional(TargetGroupAttributes),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyTargetGroupAttributesInput",
}) as any as S.Schema<ModifyTargetGroupAttributesInput>;
export interface ModifyTrustStoreOutput {
  TrustStores?: TrustStore[];
}
export const ModifyTrustStoreOutput = S.suspend(() =>
  S.Struct({ TrustStores: S.optional(TrustStores) }).pipe(ns),
).annotations({
  identifier: "ModifyTrustStoreOutput",
}) as any as S.Schema<ModifyTrustStoreOutput>;
export interface SetIpAddressTypeOutput {
  IpAddressType?: IpAddressType;
}
export const SetIpAddressTypeOutput = S.suspend(() =>
  S.Struct({ IpAddressType: S.optional(IpAddressType) }).pipe(ns),
).annotations({
  identifier: "SetIpAddressTypeOutput",
}) as any as S.Schema<SetIpAddressTypeOutput>;
export interface SetRulePrioritiesInput {
  RulePriorities?: RulePriorityPair[];
}
export const SetRulePrioritiesInput = S.suspend(() =>
  S.Struct({ RulePriorities: S.optional(RulePriorityList) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetRulePrioritiesInput",
}) as any as S.Schema<SetRulePrioritiesInput>;
export interface SetSecurityGroupsOutput {
  SecurityGroupIds?: string[];
  EnforceSecurityGroupInboundRulesOnPrivateLinkTraffic?: EnforceSecurityGroupInboundRulesOnPrivateLinkTrafficEnum;
}
export const SetSecurityGroupsOutput = S.suspend(() =>
  S.Struct({
    SecurityGroupIds: S.optional(SecurityGroups),
    EnforceSecurityGroupInboundRulesOnPrivateLinkTraffic: S.optional(
      EnforceSecurityGroupInboundRulesOnPrivateLinkTrafficEnum,
    ),
  }).pipe(ns),
).annotations({
  identifier: "SetSecurityGroupsOutput",
}) as any as S.Schema<SetSecurityGroupsOutput>;
export type SslProtocols = string[];
export const SslProtocols = S.Array(S.String);
export type SourceNatIpv6Prefixes = string[];
export const SourceNatIpv6Prefixes = S.Array(S.String);
export interface Limit {
  Name?: string;
  Max?: string;
}
export const Limit = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Max: S.optional(S.String) }),
).annotations({ identifier: "Limit" }) as any as S.Schema<Limit>;
export type Limits = Limit[];
export const Limits = S.Array(Limit);
export interface TagDescription {
  ResourceArn?: string;
  Tags?: Tag[];
}
export const TagDescription = S.suspend(() =>
  S.Struct({ ResourceArn: S.optional(S.String), Tags: S.optional(TagList) }),
).annotations({
  identifier: "TagDescription",
}) as any as S.Schema<TagDescription>;
export type TagDescriptions = TagDescription[];
export const TagDescriptions = S.Array(TagDescription);
export interface TrustStoreAssociation {
  ResourceArn?: string;
}
export const TrustStoreAssociation = S.suspend(() =>
  S.Struct({ ResourceArn: S.optional(S.String) }),
).annotations({
  identifier: "TrustStoreAssociation",
}) as any as S.Schema<TrustStoreAssociation>;
export type TrustStoreAssociations = TrustStoreAssociation[];
export const TrustStoreAssociations = S.Array(TrustStoreAssociation);
export interface DescribeTrustStoreRevocation {
  TrustStoreArn?: string;
  RevocationId?: number;
  RevocationType?: RevocationType;
  NumberOfRevokedEntries?: number;
}
export const DescribeTrustStoreRevocation = S.suspend(() =>
  S.Struct({
    TrustStoreArn: S.optional(S.String),
    RevocationId: S.optional(S.Number),
    RevocationType: S.optional(RevocationType),
    NumberOfRevokedEntries: S.optional(S.Number),
  }),
).annotations({
  identifier: "DescribeTrustStoreRevocation",
}) as any as S.Schema<DescribeTrustStoreRevocation>;
export type DescribeTrustStoreRevocationResponse =
  DescribeTrustStoreRevocation[];
export const DescribeTrustStoreRevocationResponse = S.Array(
  DescribeTrustStoreRevocation,
);
export type CapacityReservationStateEnum =
  | "provisioned"
  | "pending"
  | "rebalancing"
  | "failed";
export const CapacityReservationStateEnum = S.Literal(
  "provisioned",
  "pending",
  "rebalancing",
  "failed",
);
export type LoadBalancerStateEnum =
  | "active"
  | "provisioning"
  | "active_impaired"
  | "failed";
export const LoadBalancerStateEnum = S.Literal(
  "active",
  "provisioning",
  "active_impaired",
  "failed",
);
export type TargetHealthStateEnum =
  | "initial"
  | "healthy"
  | "unhealthy"
  | "unhealthy.draining"
  | "unused"
  | "draining"
  | "unavailable";
export const TargetHealthStateEnum = S.Literal(
  "initial",
  "healthy",
  "unhealthy",
  "unhealthy.draining",
  "unused",
  "draining",
  "unavailable",
);
export type TargetHealthReasonEnum =
  | "Elb.RegistrationInProgress"
  | "Elb.InitialHealthChecking"
  | "Target.ResponseCodeMismatch"
  | "Target.Timeout"
  | "Target.FailedHealthChecks"
  | "Target.NotRegistered"
  | "Target.NotInUse"
  | "Target.DeregistrationInProgress"
  | "Target.InvalidState"
  | "Target.IpUnusable"
  | "Target.HealthCheckDisabled"
  | "Elb.InternalError";
export const TargetHealthReasonEnum = S.Literal(
  "Elb.RegistrationInProgress",
  "Elb.InitialHealthChecking",
  "Target.ResponseCodeMismatch",
  "Target.Timeout",
  "Target.FailedHealthChecks",
  "Target.NotRegistered",
  "Target.NotInUse",
  "Target.DeregistrationInProgress",
  "Target.InvalidState",
  "Target.IpUnusable",
  "Target.HealthCheckDisabled",
  "Elb.InternalError",
);
export type AnomalyResultEnum = "anomalous" | "normal";
export const AnomalyResultEnum = S.Literal("anomalous", "normal");
export type MitigationInEffectEnum = "yes" | "no";
export const MitigationInEffectEnum = S.Literal("yes", "no");
export type TargetAdministrativeOverrideStateEnum =
  | "unknown"
  | "no_override"
  | "zonal_shift_active"
  | "zonal_shift_delegated_to_dns";
export const TargetAdministrativeOverrideStateEnum = S.Literal(
  "unknown",
  "no_override",
  "zonal_shift_active",
  "zonal_shift_delegated_to_dns",
);
export type TargetAdministrativeOverrideReasonEnum =
  | "AdministrativeOverride.Unknown"
  | "AdministrativeOverride.NoOverride"
  | "AdministrativeOverride.ZonalShiftActive"
  | "AdministrativeOverride.ZonalShiftDelegatedToDns";
export const TargetAdministrativeOverrideReasonEnum = S.Literal(
  "AdministrativeOverride.Unknown",
  "AdministrativeOverride.NoOverride",
  "AdministrativeOverride.ZonalShiftActive",
  "AdministrativeOverride.ZonalShiftDelegatedToDns",
);
export interface AddListenerCertificatesOutput {
  Certificates?: Certificate[];
}
export const AddListenerCertificatesOutput = S.suspend(() =>
  S.Struct({ Certificates: S.optional(CertificateList) }).pipe(ns),
).annotations({
  identifier: "AddListenerCertificatesOutput",
}) as any as S.Schema<AddListenerCertificatesOutput>;
export interface LoadBalancerState {
  Code?: LoadBalancerStateEnum;
  Reason?: string;
}
export const LoadBalancerState = S.suspend(() =>
  S.Struct({
    Code: S.optional(LoadBalancerStateEnum),
    Reason: S.optional(S.String),
  }),
).annotations({
  identifier: "LoadBalancerState",
}) as any as S.Schema<LoadBalancerState>;
export interface LoadBalancerAddress {
  IpAddress?: string;
  AllocationId?: string;
  PrivateIPv4Address?: string;
  IPv6Address?: string;
}
export const LoadBalancerAddress = S.suspend(() =>
  S.Struct({
    IpAddress: S.optional(S.String),
    AllocationId: S.optional(S.String),
    PrivateIPv4Address: S.optional(S.String),
    IPv6Address: S.optional(S.String),
  }),
).annotations({
  identifier: "LoadBalancerAddress",
}) as any as S.Schema<LoadBalancerAddress>;
export type LoadBalancerAddresses = LoadBalancerAddress[];
export const LoadBalancerAddresses = S.Array(LoadBalancerAddress);
export interface AvailabilityZone {
  ZoneName?: string;
  SubnetId?: string;
  OutpostId?: string;
  LoadBalancerAddresses?: LoadBalancerAddress[];
  SourceNatIpv6Prefixes?: string[];
}
export const AvailabilityZone = S.suspend(() =>
  S.Struct({
    ZoneName: S.optional(S.String),
    SubnetId: S.optional(S.String),
    OutpostId: S.optional(S.String),
    LoadBalancerAddresses: S.optional(LoadBalancerAddresses),
    SourceNatIpv6Prefixes: S.optional(SourceNatIpv6Prefixes),
  }),
).annotations({
  identifier: "AvailabilityZone",
}) as any as S.Schema<AvailabilityZone>;
export type AvailabilityZones = AvailabilityZone[];
export const AvailabilityZones = S.Array(AvailabilityZone);
export interface LoadBalancer {
  LoadBalancerArn?: string;
  DNSName?: string;
  CanonicalHostedZoneId?: string;
  CreatedTime?: Date;
  LoadBalancerName?: string;
  Scheme?: LoadBalancerSchemeEnum;
  VpcId?: string;
  State?: LoadBalancerState;
  Type?: LoadBalancerTypeEnum;
  AvailabilityZones?: AvailabilityZone[];
  SecurityGroups?: string[];
  IpAddressType?: IpAddressType;
  CustomerOwnedIpv4Pool?: string;
  EnforceSecurityGroupInboundRulesOnPrivateLinkTraffic?: string;
  EnablePrefixForIpv6SourceNat?: EnablePrefixForIpv6SourceNatEnum;
  IpamPools?: IpamPools;
}
export const LoadBalancer = S.suspend(() =>
  S.Struct({
    LoadBalancerArn: S.optional(S.String),
    DNSName: S.optional(S.String),
    CanonicalHostedZoneId: S.optional(S.String),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    LoadBalancerName: S.optional(S.String),
    Scheme: S.optional(LoadBalancerSchemeEnum),
    VpcId: S.optional(S.String),
    State: S.optional(LoadBalancerState),
    Type: S.optional(LoadBalancerTypeEnum),
    AvailabilityZones: S.optional(AvailabilityZones),
    SecurityGroups: S.optional(SecurityGroups),
    IpAddressType: S.optional(IpAddressType),
    CustomerOwnedIpv4Pool: S.optional(S.String),
    EnforceSecurityGroupInboundRulesOnPrivateLinkTraffic: S.optional(S.String),
    EnablePrefixForIpv6SourceNat: S.optional(EnablePrefixForIpv6SourceNatEnum),
    IpamPools: S.optional(IpamPools),
  }),
).annotations({ identifier: "LoadBalancer" }) as any as S.Schema<LoadBalancer>;
export type LoadBalancers = LoadBalancer[];
export const LoadBalancers = S.Array(LoadBalancer);
export interface CreateLoadBalancerOutput {
  LoadBalancers?: LoadBalancer[];
}
export const CreateLoadBalancerOutput = S.suspend(() =>
  S.Struct({ LoadBalancers: S.optional(LoadBalancers) }).pipe(ns),
).annotations({
  identifier: "CreateLoadBalancerOutput",
}) as any as S.Schema<CreateLoadBalancerOutput>;
export interface CreateTargetGroupOutput {
  TargetGroups?: TargetGroup[];
}
export const CreateTargetGroupOutput = S.suspend(() =>
  S.Struct({ TargetGroups: S.optional(TargetGroups) }).pipe(ns),
).annotations({
  identifier: "CreateTargetGroupOutput",
}) as any as S.Schema<CreateTargetGroupOutput>;
export interface CreateTrustStoreOutput {
  TrustStores?: TrustStore[];
}
export const CreateTrustStoreOutput = S.suspend(() =>
  S.Struct({ TrustStores: S.optional(TrustStores) }).pipe(ns),
).annotations({
  identifier: "CreateTrustStoreOutput",
}) as any as S.Schema<CreateTrustStoreOutput>;
export interface DescribeAccountLimitsOutput {
  Limits?: Limit[];
  NextMarker?: string;
}
export const DescribeAccountLimitsOutput = S.suspend(() =>
  S.Struct({
    Limits: S.optional(Limits),
    NextMarker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeAccountLimitsOutput",
}) as any as S.Schema<DescribeAccountLimitsOutput>;
export interface DescribeListenersOutput {
  Listeners?: (Listener & {
    DefaultActions: (Action & {
      Type: ActionTypeEnum;
      AuthenticateOidcConfig: AuthenticateOidcActionConfig & {
        Issuer: AuthenticateOidcActionIssuer;
        AuthorizationEndpoint: AuthenticateOidcActionAuthorizationEndpoint;
        TokenEndpoint: AuthenticateOidcActionTokenEndpoint;
        UserInfoEndpoint: AuthenticateOidcActionUserInfoEndpoint;
        ClientId: AuthenticateOidcActionClientId;
      };
      AuthenticateCognitoConfig: AuthenticateCognitoActionConfig & {
        UserPoolArn: AuthenticateCognitoActionUserPoolArn;
        UserPoolClientId: AuthenticateCognitoActionUserPoolClientId;
        UserPoolDomain: AuthenticateCognitoActionUserPoolDomain;
      };
      RedirectConfig: RedirectActionConfig & {
        StatusCode: RedirectActionStatusCodeEnum;
      };
      FixedResponseConfig: FixedResponseActionConfig & {
        StatusCode: FixedResponseActionStatusCode;
      };
      JwtValidationConfig: JwtValidationActionConfig & {
        JwksEndpoint: JwtValidationActionJwksEndpoint;
        Issuer: JwtValidationActionIssuer;
        AdditionalClaims: (JwtValidationActionAdditionalClaim & {
          Format: JwtValidationActionAdditionalClaimFormatEnum;
          Name: JwtValidationActionAdditionalClaimName;
          Values: JwtValidationActionAdditionalClaimValues;
        })[];
      };
    })[];
  })[];
  NextMarker?: string;
}
export const DescribeListenersOutput = S.suspend(() =>
  S.Struct({
    Listeners: S.optional(Listeners),
    NextMarker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeListenersOutput",
}) as any as S.Schema<DescribeListenersOutput>;
export interface DescribeRulesOutput {
  Rules?: (Rule & {
    Actions: (Action & {
      Type: ActionTypeEnum;
      AuthenticateOidcConfig: AuthenticateOidcActionConfig & {
        Issuer: AuthenticateOidcActionIssuer;
        AuthorizationEndpoint: AuthenticateOidcActionAuthorizationEndpoint;
        TokenEndpoint: AuthenticateOidcActionTokenEndpoint;
        UserInfoEndpoint: AuthenticateOidcActionUserInfoEndpoint;
        ClientId: AuthenticateOidcActionClientId;
      };
      AuthenticateCognitoConfig: AuthenticateCognitoActionConfig & {
        UserPoolArn: AuthenticateCognitoActionUserPoolArn;
        UserPoolClientId: AuthenticateCognitoActionUserPoolClientId;
        UserPoolDomain: AuthenticateCognitoActionUserPoolDomain;
      };
      RedirectConfig: RedirectActionConfig & {
        StatusCode: RedirectActionStatusCodeEnum;
      };
      FixedResponseConfig: FixedResponseActionConfig & {
        StatusCode: FixedResponseActionStatusCode;
      };
      JwtValidationConfig: JwtValidationActionConfig & {
        JwksEndpoint: JwtValidationActionJwksEndpoint;
        Issuer: JwtValidationActionIssuer;
        AdditionalClaims: (JwtValidationActionAdditionalClaim & {
          Format: JwtValidationActionAdditionalClaimFormatEnum;
          Name: JwtValidationActionAdditionalClaimName;
          Values: JwtValidationActionAdditionalClaimValues;
        })[];
      };
    })[];
    Transforms: (RuleTransform & {
      Type: TransformTypeEnum;
      HostHeaderRewriteConfig: HostHeaderRewriteConfig & {
        Rewrites: (RewriteConfig & {
          Regex: StringValue;
          Replace: StringValue;
        })[];
      };
      UrlRewriteConfig: UrlRewriteConfig & {
        Rewrites: (RewriteConfig & {
          Regex: StringValue;
          Replace: StringValue;
        })[];
      };
    })[];
  })[];
  NextMarker?: string;
}
export const DescribeRulesOutput = S.suspend(() =>
  S.Struct({ Rules: S.optional(Rules), NextMarker: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "DescribeRulesOutput",
}) as any as S.Schema<DescribeRulesOutput>;
export interface DescribeTagsOutput {
  TagDescriptions?: (TagDescription & { Tags: (Tag & { Key: TagKey })[] })[];
}
export const DescribeTagsOutput = S.suspend(() =>
  S.Struct({ TagDescriptions: S.optional(TagDescriptions) }).pipe(ns),
).annotations({
  identifier: "DescribeTagsOutput",
}) as any as S.Schema<DescribeTagsOutput>;
export interface DescribeTargetGroupsOutput {
  TargetGroups?: TargetGroup[];
  NextMarker?: string;
}
export const DescribeTargetGroupsOutput = S.suspend(() =>
  S.Struct({
    TargetGroups: S.optional(TargetGroups),
    NextMarker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeTargetGroupsOutput",
}) as any as S.Schema<DescribeTargetGroupsOutput>;
export interface DescribeTrustStoreAssociationsOutput {
  TrustStoreAssociations?: TrustStoreAssociation[];
  NextMarker?: string;
}
export const DescribeTrustStoreAssociationsOutput = S.suspend(() =>
  S.Struct({
    TrustStoreAssociations: S.optional(TrustStoreAssociations),
    NextMarker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeTrustStoreAssociationsOutput",
}) as any as S.Schema<DescribeTrustStoreAssociationsOutput>;
export interface DescribeTrustStoreRevocationsOutput {
  TrustStoreRevocations?: DescribeTrustStoreRevocation[];
  NextMarker?: string;
}
export const DescribeTrustStoreRevocationsOutput = S.suspend(() =>
  S.Struct({
    TrustStoreRevocations: S.optional(DescribeTrustStoreRevocationResponse),
    NextMarker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeTrustStoreRevocationsOutput",
}) as any as S.Schema<DescribeTrustStoreRevocationsOutput>;
export interface CapacityReservationStatus {
  Code?: CapacityReservationStateEnum;
  Reason?: string;
}
export const CapacityReservationStatus = S.suspend(() =>
  S.Struct({
    Code: S.optional(CapacityReservationStateEnum),
    Reason: S.optional(S.String),
  }),
).annotations({
  identifier: "CapacityReservationStatus",
}) as any as S.Schema<CapacityReservationStatus>;
export interface ZonalCapacityReservationState {
  State?: CapacityReservationStatus;
  AvailabilityZone?: string;
  EffectiveCapacityUnits?: number;
}
export const ZonalCapacityReservationState = S.suspend(() =>
  S.Struct({
    State: S.optional(CapacityReservationStatus),
    AvailabilityZone: S.optional(S.String),
    EffectiveCapacityUnits: S.optional(S.Number),
  }),
).annotations({
  identifier: "ZonalCapacityReservationState",
}) as any as S.Schema<ZonalCapacityReservationState>;
export type ZonalCapacityReservationStates = ZonalCapacityReservationState[];
export const ZonalCapacityReservationStates = S.Array(
  ZonalCapacityReservationState,
);
export interface ModifyCapacityReservationOutput {
  LastModifiedTime?: Date;
  DecreaseRequestsRemaining?: number;
  MinimumLoadBalancerCapacity?: MinimumLoadBalancerCapacity;
  CapacityReservationState?: ZonalCapacityReservationState[];
}
export const ModifyCapacityReservationOutput = S.suspend(() =>
  S.Struct({
    LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DecreaseRequestsRemaining: S.optional(S.Number),
    MinimumLoadBalancerCapacity: S.optional(MinimumLoadBalancerCapacity),
    CapacityReservationState: S.optional(ZonalCapacityReservationStates),
  }).pipe(ns),
).annotations({
  identifier: "ModifyCapacityReservationOutput",
}) as any as S.Schema<ModifyCapacityReservationOutput>;
export interface ModifyListenerAttributesOutput {
  Attributes?: ListenerAttribute[];
}
export const ModifyListenerAttributesOutput = S.suspend(() =>
  S.Struct({ Attributes: S.optional(ListenerAttributes) }).pipe(ns),
).annotations({
  identifier: "ModifyListenerAttributesOutput",
}) as any as S.Schema<ModifyListenerAttributesOutput>;
export interface ModifyLoadBalancerAttributesOutput {
  Attributes?: LoadBalancerAttribute[];
}
export const ModifyLoadBalancerAttributesOutput = S.suspend(() =>
  S.Struct({ Attributes: S.optional(LoadBalancerAttributes) }).pipe(ns),
).annotations({
  identifier: "ModifyLoadBalancerAttributesOutput",
}) as any as S.Schema<ModifyLoadBalancerAttributesOutput>;
export interface ModifyTargetGroupAttributesOutput {
  Attributes?: TargetGroupAttribute[];
}
export const ModifyTargetGroupAttributesOutput = S.suspend(() =>
  S.Struct({ Attributes: S.optional(TargetGroupAttributes) }).pipe(ns),
).annotations({
  identifier: "ModifyTargetGroupAttributesOutput",
}) as any as S.Schema<ModifyTargetGroupAttributesOutput>;
export interface SetRulePrioritiesOutput {
  Rules?: (Rule & {
    Actions: (Action & {
      Type: ActionTypeEnum;
      AuthenticateOidcConfig: AuthenticateOidcActionConfig & {
        Issuer: AuthenticateOidcActionIssuer;
        AuthorizationEndpoint: AuthenticateOidcActionAuthorizationEndpoint;
        TokenEndpoint: AuthenticateOidcActionTokenEndpoint;
        UserInfoEndpoint: AuthenticateOidcActionUserInfoEndpoint;
        ClientId: AuthenticateOidcActionClientId;
      };
      AuthenticateCognitoConfig: AuthenticateCognitoActionConfig & {
        UserPoolArn: AuthenticateCognitoActionUserPoolArn;
        UserPoolClientId: AuthenticateCognitoActionUserPoolClientId;
        UserPoolDomain: AuthenticateCognitoActionUserPoolDomain;
      };
      RedirectConfig: RedirectActionConfig & {
        StatusCode: RedirectActionStatusCodeEnum;
      };
      FixedResponseConfig: FixedResponseActionConfig & {
        StatusCode: FixedResponseActionStatusCode;
      };
      JwtValidationConfig: JwtValidationActionConfig & {
        JwksEndpoint: JwtValidationActionJwksEndpoint;
        Issuer: JwtValidationActionIssuer;
        AdditionalClaims: (JwtValidationActionAdditionalClaim & {
          Format: JwtValidationActionAdditionalClaimFormatEnum;
          Name: JwtValidationActionAdditionalClaimName;
          Values: JwtValidationActionAdditionalClaimValues;
        })[];
      };
    })[];
    Transforms: (RuleTransform & {
      Type: TransformTypeEnum;
      HostHeaderRewriteConfig: HostHeaderRewriteConfig & {
        Rewrites: (RewriteConfig & {
          Regex: StringValue;
          Replace: StringValue;
        })[];
      };
      UrlRewriteConfig: UrlRewriteConfig & {
        Rewrites: (RewriteConfig & {
          Regex: StringValue;
          Replace: StringValue;
        })[];
      };
    })[];
  })[];
}
export const SetRulePrioritiesOutput = S.suspend(() =>
  S.Struct({ Rules: S.optional(Rules) }).pipe(ns),
).annotations({
  identifier: "SetRulePrioritiesOutput",
}) as any as S.Schema<SetRulePrioritiesOutput>;
export interface Cipher {
  Name?: string;
  Priority?: number;
}
export const Cipher = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Priority: S.optional(S.Number) }),
).annotations({ identifier: "Cipher" }) as any as S.Schema<Cipher>;
export type Ciphers = Cipher[];
export const Ciphers = S.Array(Cipher);
export interface TargetHealth {
  State?: TargetHealthStateEnum;
  Reason?: TargetHealthReasonEnum;
  Description?: string;
}
export const TargetHealth = S.suspend(() =>
  S.Struct({
    State: S.optional(TargetHealthStateEnum),
    Reason: S.optional(TargetHealthReasonEnum),
    Description: S.optional(S.String),
  }),
).annotations({ identifier: "TargetHealth" }) as any as S.Schema<TargetHealth>;
export interface AnomalyDetection {
  Result?: AnomalyResultEnum;
  MitigationInEffect?: MitigationInEffectEnum;
}
export const AnomalyDetection = S.suspend(() =>
  S.Struct({
    Result: S.optional(AnomalyResultEnum),
    MitigationInEffect: S.optional(MitigationInEffectEnum),
  }),
).annotations({
  identifier: "AnomalyDetection",
}) as any as S.Schema<AnomalyDetection>;
export interface AdministrativeOverride {
  State?: TargetAdministrativeOverrideStateEnum;
  Reason?: TargetAdministrativeOverrideReasonEnum;
  Description?: string;
}
export const AdministrativeOverride = S.suspend(() =>
  S.Struct({
    State: S.optional(TargetAdministrativeOverrideStateEnum),
    Reason: S.optional(TargetAdministrativeOverrideReasonEnum),
    Description: S.optional(S.String),
  }),
).annotations({
  identifier: "AdministrativeOverride",
}) as any as S.Schema<AdministrativeOverride>;
export interface TrustStoreRevocation {
  TrustStoreArn?: string;
  RevocationId?: number;
  RevocationType?: RevocationType;
  NumberOfRevokedEntries?: number;
}
export const TrustStoreRevocation = S.suspend(() =>
  S.Struct({
    TrustStoreArn: S.optional(S.String),
    RevocationId: S.optional(S.Number),
    RevocationType: S.optional(RevocationType),
    NumberOfRevokedEntries: S.optional(S.Number),
  }),
).annotations({
  identifier: "TrustStoreRevocation",
}) as any as S.Schema<TrustStoreRevocation>;
export type TrustStoreRevocations = TrustStoreRevocation[];
export const TrustStoreRevocations = S.Array(TrustStoreRevocation);
export interface SslPolicy {
  SslProtocols?: string[];
  Ciphers?: Cipher[];
  Name?: string;
  SupportedLoadBalancerTypes?: string[];
}
export const SslPolicy = S.suspend(() =>
  S.Struct({
    SslProtocols: S.optional(SslProtocols),
    Ciphers: S.optional(Ciphers),
    Name: S.optional(S.String),
    SupportedLoadBalancerTypes: S.optional(ListOfString),
  }),
).annotations({ identifier: "SslPolicy" }) as any as S.Schema<SslPolicy>;
export type SslPolicies = SslPolicy[];
export const SslPolicies = S.Array(SslPolicy);
export interface TargetHealthDescription {
  Target?: TargetDescription;
  HealthCheckPort?: string;
  TargetHealth?: TargetHealth;
  AnomalyDetection?: AnomalyDetection;
  AdministrativeOverride?: AdministrativeOverride;
}
export const TargetHealthDescription = S.suspend(() =>
  S.Struct({
    Target: S.optional(TargetDescription),
    HealthCheckPort: S.optional(S.String),
    TargetHealth: S.optional(TargetHealth),
    AnomalyDetection: S.optional(AnomalyDetection),
    AdministrativeOverride: S.optional(AdministrativeOverride),
  }),
).annotations({
  identifier: "TargetHealthDescription",
}) as any as S.Schema<TargetHealthDescription>;
export type TargetHealthDescriptions = TargetHealthDescription[];
export const TargetHealthDescriptions = S.Array(TargetHealthDescription);
export interface AddTrustStoreRevocationsOutput {
  TrustStoreRevocations?: TrustStoreRevocation[];
}
export const AddTrustStoreRevocationsOutput = S.suspend(() =>
  S.Struct({ TrustStoreRevocations: S.optional(TrustStoreRevocations) }).pipe(
    ns,
  ),
).annotations({
  identifier: "AddTrustStoreRevocationsOutput",
}) as any as S.Schema<AddTrustStoreRevocationsOutput>;
export interface CreateListenerInput {
  LoadBalancerArn?: string;
  Protocol?: ProtocolEnum;
  Port?: number;
  SslPolicy?: string;
  Certificates?: Certificate[];
  DefaultActions?: Action[];
  AlpnPolicy?: string[];
  Tags?: Tag[];
  MutualAuthentication?: MutualAuthenticationAttributes;
}
export const CreateListenerInput = S.suspend(() =>
  S.Struct({
    LoadBalancerArn: S.optional(S.String),
    Protocol: S.optional(ProtocolEnum),
    Port: S.optional(S.Number),
    SslPolicy: S.optional(S.String),
    Certificates: S.optional(CertificateList),
    DefaultActions: S.optional(Actions),
    AlpnPolicy: S.optional(AlpnPolicyName),
    Tags: S.optional(TagList),
    MutualAuthentication: S.optional(MutualAuthenticationAttributes),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateListenerInput",
}) as any as S.Schema<CreateListenerInput>;
export interface CreateRuleInput {
  ListenerArn?: string;
  Conditions?: RuleCondition[];
  Priority?: number;
  Actions?: Action[];
  Tags?: Tag[];
  Transforms?: RuleTransform[];
}
export const CreateRuleInput = S.suspend(() =>
  S.Struct({
    ListenerArn: S.optional(S.String),
    Conditions: S.optional(RuleConditionList),
    Priority: S.optional(S.Number),
    Actions: S.optional(Actions),
    Tags: S.optional(TagList),
    Transforms: S.optional(RuleTransformList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRuleInput",
}) as any as S.Schema<CreateRuleInput>;
export interface DescribeCapacityReservationOutput {
  LastModifiedTime?: Date;
  DecreaseRequestsRemaining?: number;
  MinimumLoadBalancerCapacity?: MinimumLoadBalancerCapacity;
  CapacityReservationState?: ZonalCapacityReservationState[];
}
export const DescribeCapacityReservationOutput = S.suspend(() =>
  S.Struct({
    LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DecreaseRequestsRemaining: S.optional(S.Number),
    MinimumLoadBalancerCapacity: S.optional(MinimumLoadBalancerCapacity),
    CapacityReservationState: S.optional(ZonalCapacityReservationStates),
  }).pipe(ns),
).annotations({
  identifier: "DescribeCapacityReservationOutput",
}) as any as S.Schema<DescribeCapacityReservationOutput>;
export interface DescribeLoadBalancersOutput {
  LoadBalancers?: LoadBalancer[];
  NextMarker?: string;
}
export const DescribeLoadBalancersOutput = S.suspend(() =>
  S.Struct({
    LoadBalancers: S.optional(LoadBalancers),
    NextMarker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeLoadBalancersOutput",
}) as any as S.Schema<DescribeLoadBalancersOutput>;
export interface DescribeSSLPoliciesOutput {
  SslPolicies?: SslPolicy[];
  NextMarker?: string;
}
export const DescribeSSLPoliciesOutput = S.suspend(() =>
  S.Struct({
    SslPolicies: S.optional(SslPolicies),
    NextMarker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeSSLPoliciesOutput",
}) as any as S.Schema<DescribeSSLPoliciesOutput>;
export interface DescribeTargetHealthOutput {
  TargetHealthDescriptions?: (TargetHealthDescription & {
    Target: TargetDescription & { Id: TargetId };
  })[];
}
export const DescribeTargetHealthOutput = S.suspend(() =>
  S.Struct({
    TargetHealthDescriptions: S.optional(TargetHealthDescriptions),
  }).pipe(ns),
).annotations({
  identifier: "DescribeTargetHealthOutput",
}) as any as S.Schema<DescribeTargetHealthOutput>;
export interface SetSubnetsOutput {
  AvailabilityZones?: AvailabilityZone[];
  IpAddressType?: IpAddressType;
  EnablePrefixForIpv6SourceNat?: EnablePrefixForIpv6SourceNatEnum;
}
export const SetSubnetsOutput = S.suspend(() =>
  S.Struct({
    AvailabilityZones: S.optional(AvailabilityZones),
    IpAddressType: S.optional(IpAddressType),
    EnablePrefixForIpv6SourceNat: S.optional(EnablePrefixForIpv6SourceNatEnum),
  }).pipe(ns),
).annotations({
  identifier: "SetSubnetsOutput",
}) as any as S.Schema<SetSubnetsOutput>;
export interface CreateListenerOutput {
  Listeners?: (Listener & {
    DefaultActions: (Action & {
      Type: ActionTypeEnum;
      AuthenticateOidcConfig: AuthenticateOidcActionConfig & {
        Issuer: AuthenticateOidcActionIssuer;
        AuthorizationEndpoint: AuthenticateOidcActionAuthorizationEndpoint;
        TokenEndpoint: AuthenticateOidcActionTokenEndpoint;
        UserInfoEndpoint: AuthenticateOidcActionUserInfoEndpoint;
        ClientId: AuthenticateOidcActionClientId;
      };
      AuthenticateCognitoConfig: AuthenticateCognitoActionConfig & {
        UserPoolArn: AuthenticateCognitoActionUserPoolArn;
        UserPoolClientId: AuthenticateCognitoActionUserPoolClientId;
        UserPoolDomain: AuthenticateCognitoActionUserPoolDomain;
      };
      RedirectConfig: RedirectActionConfig & {
        StatusCode: RedirectActionStatusCodeEnum;
      };
      FixedResponseConfig: FixedResponseActionConfig & {
        StatusCode: FixedResponseActionStatusCode;
      };
      JwtValidationConfig: JwtValidationActionConfig & {
        JwksEndpoint: JwtValidationActionJwksEndpoint;
        Issuer: JwtValidationActionIssuer;
        AdditionalClaims: (JwtValidationActionAdditionalClaim & {
          Format: JwtValidationActionAdditionalClaimFormatEnum;
          Name: JwtValidationActionAdditionalClaimName;
          Values: JwtValidationActionAdditionalClaimValues;
        })[];
      };
    })[];
  })[];
}
export const CreateListenerOutput = S.suspend(() =>
  S.Struct({ Listeners: S.optional(Listeners) }).pipe(ns),
).annotations({
  identifier: "CreateListenerOutput",
}) as any as S.Schema<CreateListenerOutput>;
export interface CreateRuleOutput {
  Rules?: (Rule & {
    Actions: (Action & {
      Type: ActionTypeEnum;
      AuthenticateOidcConfig: AuthenticateOidcActionConfig & {
        Issuer: AuthenticateOidcActionIssuer;
        AuthorizationEndpoint: AuthenticateOidcActionAuthorizationEndpoint;
        TokenEndpoint: AuthenticateOidcActionTokenEndpoint;
        UserInfoEndpoint: AuthenticateOidcActionUserInfoEndpoint;
        ClientId: AuthenticateOidcActionClientId;
      };
      AuthenticateCognitoConfig: AuthenticateCognitoActionConfig & {
        UserPoolArn: AuthenticateCognitoActionUserPoolArn;
        UserPoolClientId: AuthenticateCognitoActionUserPoolClientId;
        UserPoolDomain: AuthenticateCognitoActionUserPoolDomain;
      };
      RedirectConfig: RedirectActionConfig & {
        StatusCode: RedirectActionStatusCodeEnum;
      };
      FixedResponseConfig: FixedResponseActionConfig & {
        StatusCode: FixedResponseActionStatusCode;
      };
      JwtValidationConfig: JwtValidationActionConfig & {
        JwksEndpoint: JwtValidationActionJwksEndpoint;
        Issuer: JwtValidationActionIssuer;
        AdditionalClaims: (JwtValidationActionAdditionalClaim & {
          Format: JwtValidationActionAdditionalClaimFormatEnum;
          Name: JwtValidationActionAdditionalClaimName;
          Values: JwtValidationActionAdditionalClaimValues;
        })[];
      };
    })[];
    Transforms: (RuleTransform & {
      Type: TransformTypeEnum;
      HostHeaderRewriteConfig: HostHeaderRewriteConfig & {
        Rewrites: (RewriteConfig & {
          Regex: StringValue;
          Replace: StringValue;
        })[];
      };
      UrlRewriteConfig: UrlRewriteConfig & {
        Rewrites: (RewriteConfig & {
          Regex: StringValue;
          Replace: StringValue;
        })[];
      };
    })[];
  })[];
}
export const CreateRuleOutput = S.suspend(() =>
  S.Struct({ Rules: S.optional(Rules) }).pipe(ns),
).annotations({
  identifier: "CreateRuleOutput",
}) as any as S.Schema<CreateRuleOutput>;

//# Errors
export class ListenerNotFoundException extends S.TaggedError<ListenerNotFoundException>()(
  "ListenerNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ListenerNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class LoadBalancerNotFoundException extends S.TaggedError<LoadBalancerNotFoundException>()(
  "LoadBalancerNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "LoadBalancerNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class OperationNotPermittedException extends S.TaggedError<OperationNotPermittedException>()(
  "OperationNotPermittedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "OperationNotPermitted", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DeleteAssociationSameAccountException extends S.TaggedError<DeleteAssociationSameAccountException>()(
  "DeleteAssociationSameAccountException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DeleteAssociationSameAccount",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceInUse", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TrustStoreInUseException extends S.TaggedError<TrustStoreInUseException>()(
  "TrustStoreInUseException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TrustStoreInUse", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidTargetException extends S.TaggedError<InvalidTargetException>()(
  "InvalidTargetException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidTarget", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class RevocationIdNotFoundException extends S.TaggedError<RevocationIdNotFoundException>()(
  "RevocationIdNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "RevocationIdNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DuplicateTagKeysException extends S.TaggedError<DuplicateTagKeysException>()(
  "DuplicateTagKeysException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "DuplicateTagKeys", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class RuleNotFoundException extends S.TaggedError<RuleNotFoundException>()(
  "RuleNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "RuleNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TrustStoreAssociationNotFoundException extends S.TaggedError<TrustStoreAssociationNotFoundException>()(
  "TrustStoreAssociationNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AssociationNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TrustStoreNotFoundException extends S.TaggedError<TrustStoreNotFoundException>()(
  "TrustStoreNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TrustStoreNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TargetGroupNotFoundException extends S.TaggedError<TargetGroupNotFoundException>()(
  "TargetGroupNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TargetGroupNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ALPNPolicyNotSupportedException extends S.TaggedError<ALPNPolicyNotSupportedException>()(
  "ALPNPolicyNotSupportedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ALPNPolicyNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class IncompatibleProtocolsException extends S.TaggedError<IncompatibleProtocolsException>()(
  "IncompatibleProtocolsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "IncompatibleProtocols", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidConfigurationRequestException extends S.TaggedError<InvalidConfigurationRequestException>()(
  "InvalidConfigurationRequestException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidConfigurationRequest",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class CaCertificatesBundleNotFoundException extends S.TaggedError<CaCertificatesBundleNotFoundException>()(
  "CaCertificatesBundleNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CaCertificatesBundleNotFound",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class CertificateNotFoundException extends S.TaggedError<CertificateNotFoundException>()(
  "CertificateNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "CertificateNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class AllocationIdNotFoundException extends S.TaggedError<AllocationIdNotFoundException>()(
  "AllocationIdNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AllocationIdNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DuplicateTargetGroupNameException extends S.TaggedError<DuplicateTargetGroupNameException>()(
  "DuplicateTargetGroupNameException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "DuplicateTargetGroupName", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class UnsupportedProtocolException extends S.TaggedError<UnsupportedProtocolException>()(
  "UnsupportedProtocolException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "UnsupportedProtocol", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class CapacityDecreaseRequestsLimitExceededException extends S.TaggedError<CapacityDecreaseRequestsLimitExceededException>()(
  "CapacityDecreaseRequestsLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CapacityDecreaseRequestLimitExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidLoadBalancerActionException extends S.TaggedError<InvalidLoadBalancerActionException>()(
  "InvalidLoadBalancerActionException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidLoadBalancerAction", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidCaCertificatesBundleException extends S.TaggedError<InvalidCaCertificatesBundleException>()(
  "InvalidCaCertificatesBundleException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidCaCertificatesBundle",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class PriorityInUseException extends S.TaggedError<PriorityInUseException>()(
  "PriorityInUseException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "PriorityInUse", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyTags", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TooManyRegistrationsForTargetIdException extends S.TaggedError<TooManyRegistrationsForTargetIdException>()(
  "TooManyRegistrationsForTargetIdException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TooManyRegistrationsForTargetId",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidSubnetException extends S.TaggedError<InvalidSubnetException>()(
  "InvalidSubnetException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSubnet", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidSecurityGroupException extends S.TaggedError<InvalidSecurityGroupException>()(
  "InvalidSecurityGroupException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSecurityGroup", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DuplicateTrustStoreNameException extends S.TaggedError<DuplicateTrustStoreNameException>()(
  "DuplicateTrustStoreNameException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "DuplicateTrustStoreName", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TooManyCertificatesException extends S.TaggedError<TooManyCertificatesException>()(
  "TooManyCertificatesException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyCertificates", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidRevocationContentException extends S.TaggedError<InvalidRevocationContentException>()(
  "InvalidRevocationContentException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidRevocationContent", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class AvailabilityZoneNotSupportedException extends S.TaggedError<AvailabilityZoneNotSupportedException>()(
  "AvailabilityZoneNotSupportedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AvailabilityZoneNotSupported",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SSLPolicyNotFoundException extends S.TaggedError<SSLPolicyNotFoundException>()(
  "SSLPolicyNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "SSLPolicyNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class HealthUnavailableException extends S.TaggedError<HealthUnavailableException>()(
  "HealthUnavailableException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "HealthUnavailable", httpResponseCode: 500 }),
).pipe(C.withServerError) {}
export class CapacityReservationPendingException extends S.TaggedError<CapacityReservationPendingException>()(
  "CapacityReservationPendingException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CapacityReservationPending",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class TargetGroupAssociationLimitException extends S.TaggedError<TargetGroupAssociationLimitException>()(
  "TargetGroupAssociationLimitException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TargetGroupAssociationLimit",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DuplicateListenerException extends S.TaggedError<DuplicateListenerException>()(
  "DuplicateListenerException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "DuplicateListener", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TooManyTargetsException extends S.TaggedError<TooManyTargetsException>()(
  "TooManyTargetsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyTargets", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TooManyTrustStoresException extends S.TaggedError<TooManyTrustStoresException>()(
  "TooManyTrustStoresException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyTrustStores", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TooManyTargetGroupsException extends S.TaggedError<TooManyTargetGroupsException>()(
  "TooManyTargetGroupsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyTargetGroups", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class RevocationContentNotFoundException extends S.TaggedError<RevocationContentNotFoundException>()(
  "RevocationContentNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "RevocationContentNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DuplicateLoadBalancerNameException extends S.TaggedError<DuplicateLoadBalancerNameException>()(
  "DuplicateLoadBalancerNameException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "DuplicateLoadBalancerName", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class CapacityUnitsLimitExceededException extends S.TaggedError<CapacityUnitsLimitExceededException>()(
  "CapacityUnitsLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CapacityUnitsLimitExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class TooManyActionsException extends S.TaggedError<TooManyActionsException>()(
  "TooManyActionsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyActions", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class SubnetNotFoundException extends S.TaggedError<SubnetNotFoundException>()(
  "SubnetNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TooManyTrustStoreRevocationEntriesException extends S.TaggedError<TooManyTrustStoreRevocationEntriesException>()(
  "TooManyTrustStoreRevocationEntriesException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TooManyTrustStoreRevocationEntries",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidSchemeException extends S.TaggedError<InvalidSchemeException>()(
  "InvalidSchemeException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidScheme", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InsufficientCapacityException extends S.TaggedError<InsufficientCapacityException>()(
  "InsufficientCapacityException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InsufficientCapacity", httpResponseCode: 500 }),
).pipe(C.withServerError) {}
export class TooManyUniqueTargetGroupsPerLoadBalancerException extends S.TaggedError<TooManyUniqueTargetGroupsPerLoadBalancerException>()(
  "TooManyUniqueTargetGroupsPerLoadBalancerException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TooManyUniqueTargetGroupsPerLoadBalancer",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class TooManyListenersException extends S.TaggedError<TooManyListenersException>()(
  "TooManyListenersException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyListeners", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TooManyRulesException extends S.TaggedError<TooManyRulesException>()(
  "TooManyRulesException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyRules", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TooManyLoadBalancersException extends S.TaggedError<TooManyLoadBalancersException>()(
  "TooManyLoadBalancersException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyLoadBalancers", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class PriorRequestNotCompleteException extends S.TaggedError<PriorRequestNotCompleteException>()(
  "PriorRequestNotCompleteException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "PriorRequestNotComplete", httpResponseCode: 429 }),
).pipe(C.withThrottlingError) {}
export class TrustStoreNotReadyException extends S.TaggedError<TrustStoreNotReadyException>()(
  "TrustStoreNotReadyException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TrustStoreNotReady", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Deletes the specified target group.
 *
 * You can delete a target group if it is not referenced by any actions. Deleting a target
 * group also deletes any associated health checks. Deleting a target group does not affect its
 * registered targets. For example, any EC2 instances continue to run until you stop or terminate
 * them.
 */
export const deleteTargetGroup: (
  input: DeleteTargetGroupInput,
) => effect.Effect<
  DeleteTargetGroupOutput,
  ResourceInUseException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTargetGroupInput,
  output: DeleteTargetGroupOutput,
  errors: [ResourceInUseException],
}));
/**
 * Describes the attributes for the specified listener.
 */
export const describeListenerAttributes: (
  input: DescribeListenerAttributesInput,
) => effect.Effect<
  DescribeListenerAttributesOutput,
  ListenerNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeListenerAttributesInput,
  output: DescribeListenerAttributesOutput,
  errors: [ListenerNotFoundException],
}));
/**
 * Describes the default certificate and the certificate list for the specified HTTPS or TLS
 * listener.
 *
 * If the default certificate is also in the certificate list, it appears twice in the
 * results (once with `IsDefault` set to true and once with `IsDefault` set
 * to false).
 *
 * For more information, see SSL certificates in the *Application Load Balancers Guide* or
 * Server certificates in the Network Load Balancers
 * Guide.
 */
export const describeListenerCertificates: {
  (
    input: DescribeListenerCertificatesInput,
  ): effect.Effect<
    DescribeListenerCertificatesOutput,
    ListenerNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeListenerCertificatesInput,
  ) => stream.Stream<
    DescribeListenerCertificatesOutput,
    ListenerNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeListenerCertificatesInput,
  ) => stream.Stream<
    Certificate,
    ListenerNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeListenerCertificatesInput,
  output: DescribeListenerCertificatesOutput,
  errors: [ListenerNotFoundException],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "Certificates",
  } as const,
}));
/**
 * Describes the attributes for the specified Application Load Balancer, Network Load
 * Balancer, or Gateway Load Balancer.
 *
 * For more information, see the following:
 *
 * - Load balancer attributes in the Application Load Balancers
 * Guide
 *
 * - Load balancer attributes in the Network Load Balancers
 * Guide
 *
 * - Load balancer attributes in the Gateway Load Balancers
 * Guide
 */
export const describeLoadBalancerAttributes: (
  input: DescribeLoadBalancerAttributesInput,
) => effect.Effect<
  DescribeLoadBalancerAttributesOutput,
  LoadBalancerNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLoadBalancerAttributesInput,
  output: DescribeLoadBalancerAttributesOutput,
  errors: [LoadBalancerNotFoundException],
}));
/**
 * [Application Load Balancers] Modify the IP pool associated to a load balancer.
 */
export const modifyIpPools: (
  input: ModifyIpPoolsInput,
) => effect.Effect<
  ModifyIpPoolsOutput,
  LoadBalancerNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyIpPoolsInput,
  output: ModifyIpPoolsOutput,
  errors: [LoadBalancerNotFoundException],
}));
/**
 * Removes the specified certificate from the certificate list for the specified HTTPS or TLS
 * listener.
 */
export const removeListenerCertificates: (
  input: RemoveListenerCertificatesInput,
) => effect.Effect<
  RemoveListenerCertificatesOutput,
  ListenerNotFoundException | OperationNotPermittedException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveListenerCertificatesInput,
  output: RemoveListenerCertificatesOutput,
  errors: [ListenerNotFoundException, OperationNotPermittedException],
}));
/**
 * Deletes the specified Application Load Balancer, Network Load Balancer, or Gateway Load
 * Balancer. Deleting a load balancer also deletes its listeners.
 *
 * You can't delete a load balancer if deletion protection is enabled. If the load balancer
 * does not exist or has already been deleted, the call succeeds.
 *
 * Deleting a load balancer does not affect its registered targets. For example, your EC2
 * instances continue to run and are still registered to their target groups. If you no longer
 * need these EC2 instances, you can stop or terminate them.
 */
export const deleteLoadBalancer: (
  input: DeleteLoadBalancerInput,
) => effect.Effect<
  DeleteLoadBalancerOutput,
  | LoadBalancerNotFoundException
  | OperationNotPermittedException
  | ResourceInUseException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLoadBalancerInput,
  output: DeleteLoadBalancerOutput,
  errors: [
    LoadBalancerNotFoundException,
    OperationNotPermittedException,
    ResourceInUseException,
  ],
}));
/**
 * Deletes the specified listener.
 *
 * Alternatively, your listener is deleted when you delete the load balancer to which it is
 * attached.
 */
export const deleteListener: (
  input: DeleteListenerInput,
) => effect.Effect<
  DeleteListenerOutput,
  ListenerNotFoundException | ResourceInUseException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteListenerInput,
  output: DeleteListenerOutput,
  errors: [ListenerNotFoundException, ResourceInUseException],
}));
/**
 * Deletes the specified rule.
 *
 * You can't delete the default rule.
 */
export const deleteRule: (
  input: DeleteRuleInput,
) => effect.Effect<
  DeleteRuleOutput,
  OperationNotPermittedException | RuleNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRuleInput,
  output: DeleteRuleOutput,
  errors: [OperationNotPermittedException, RuleNotFoundException],
}));
/**
 * Deletes a trust store.
 */
export const deleteTrustStore: (
  input: DeleteTrustStoreInput,
) => effect.Effect<
  DeleteTrustStoreOutput,
  TrustStoreInUseException | TrustStoreNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTrustStoreInput,
  output: DeleteTrustStoreOutput,
  errors: [TrustStoreInUseException, TrustStoreNotFoundException],
}));
/**
 * Describes the current Elastic Load Balancing resource limits for your Amazon Web Services
 * account.
 *
 * For more information, see the following:
 *
 * - Quotas for your
 * Application Load Balancers
 *
 * - Quotas for your
 * Network Load Balancers
 *
 * - Quotas for your Gateway
 * Load Balancers
 */
export const describeAccountLimits: {
  (
    input: DescribeAccountLimitsInput,
  ): effect.Effect<
    DescribeAccountLimitsOutput,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeAccountLimitsInput,
  ) => stream.Stream<
    DescribeAccountLimitsOutput,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeAccountLimitsInput,
  ) => stream.Stream<
    Limit,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeAccountLimitsInput,
  output: DescribeAccountLimitsOutput,
  errors: [],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "Limits",
  } as const,
}));
/**
 * Describes the attributes for the specified target group.
 *
 * For more information, see the following:
 *
 * - Target group attributes in the Application Load Balancers
 * Guide
 *
 * - Target group attributes in the Network Load Balancers
 * Guide
 *
 * - Target group attributes in the Gateway Load Balancers
 * Guide
 */
export const describeTargetGroupAttributes: (
  input: DescribeTargetGroupAttributesInput,
) => effect.Effect<
  DescribeTargetGroupAttributesOutput,
  TargetGroupNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTargetGroupAttributesInput,
  output: DescribeTargetGroupAttributesOutput,
  errors: [TargetGroupNotFoundException],
}));
/**
 * Describes the specified target groups or all of your target groups. By default, all target
 * groups are described. Alternatively, you can specify one of the following to filter the
 * results: the ARN of the load balancer, the names of one or more target groups, or the ARNs of
 * one or more target groups.
 */
export const describeTargetGroups: {
  (
    input: DescribeTargetGroupsInput,
  ): effect.Effect<
    DescribeTargetGroupsOutput,
    LoadBalancerNotFoundException | TargetGroupNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeTargetGroupsInput,
  ) => stream.Stream<
    DescribeTargetGroupsOutput,
    LoadBalancerNotFoundException | TargetGroupNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeTargetGroupsInput,
  ) => stream.Stream<
    TargetGroup,
    LoadBalancerNotFoundException | TargetGroupNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeTargetGroupsInput,
  output: DescribeTargetGroupsOutput,
  errors: [LoadBalancerNotFoundException, TargetGroupNotFoundException],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "TargetGroups",
  } as const,
}));
/**
 * Describes all resources associated with the specified trust store.
 */
export const describeTrustStoreAssociations: {
  (
    input: DescribeTrustStoreAssociationsInput,
  ): effect.Effect<
    DescribeTrustStoreAssociationsOutput,
    TrustStoreNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeTrustStoreAssociationsInput,
  ) => stream.Stream<
    DescribeTrustStoreAssociationsOutput,
    TrustStoreNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeTrustStoreAssociationsInput,
  ) => stream.Stream<
    TrustStoreAssociation,
    TrustStoreNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeTrustStoreAssociationsInput,
  output: DescribeTrustStoreAssociationsOutput,
  errors: [TrustStoreNotFoundException],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "TrustStoreAssociations",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Describes the revocation files in use by the specified trust store or revocation
 * files.
 */
export const describeTrustStoreRevocations: {
  (
    input: DescribeTrustStoreRevocationsInput,
  ): effect.Effect<
    DescribeTrustStoreRevocationsOutput,
    RevocationIdNotFoundException | TrustStoreNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeTrustStoreRevocationsInput,
  ) => stream.Stream<
    DescribeTrustStoreRevocationsOutput,
    RevocationIdNotFoundException | TrustStoreNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeTrustStoreRevocationsInput,
  ) => stream.Stream<
    DescribeTrustStoreRevocation,
    RevocationIdNotFoundException | TrustStoreNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeTrustStoreRevocationsInput,
  output: DescribeTrustStoreRevocationsOutput,
  errors: [RevocationIdNotFoundException, TrustStoreNotFoundException],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "TrustStoreRevocations",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Retrieves the resource policy for a specified resource.
 */
export const getResourcePolicy: (
  input: GetResourcePolicyInput,
) => effect.Effect<
  GetResourcePolicyOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyInput,
  output: GetResourcePolicyOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Modifies the health checks used when evaluating the health state of the targets in the
 * specified target group.
 */
export const modifyTargetGroup: (
  input: ModifyTargetGroupInput,
) => effect.Effect<
  ModifyTargetGroupOutput,
  | InvalidConfigurationRequestException
  | TargetGroupNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyTargetGroupInput,
  output: ModifyTargetGroupOutput,
  errors: [InvalidConfigurationRequestException, TargetGroupNotFoundException],
}));
/**
 * Modifies the specified attributes of the specified target group.
 */
export const modifyTargetGroupAttributes: (
  input: ModifyTargetGroupAttributesInput,
) => effect.Effect<
  ModifyTargetGroupAttributesOutput,
  | InvalidConfigurationRequestException
  | TargetGroupNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyTargetGroupAttributesInput,
  output: ModifyTargetGroupAttributesOutput,
  errors: [InvalidConfigurationRequestException, TargetGroupNotFoundException],
}));
/**
 * Describes all trust stores for the specified account.
 */
export const describeTrustStores: {
  (
    input: DescribeTrustStoresInput,
  ): effect.Effect<
    DescribeTrustStoresOutput,
    TrustStoreNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeTrustStoresInput,
  ) => stream.Stream<
    DescribeTrustStoresOutput,
    TrustStoreNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeTrustStoresInput,
  ) => stream.Stream<
    TrustStore,
    TrustStoreNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeTrustStoresInput,
  output: DescribeTrustStoresOutput,
  errors: [TrustStoreNotFoundException],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "TrustStores",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Retrieves the ca certificate bundle.
 *
 * This action returns a pre-signed S3 URI which is
 * active for ten minutes.
 */
export const getTrustStoreCaCertificatesBundle: (
  input: GetTrustStoreCaCertificatesBundleInput,
) => effect.Effect<
  GetTrustStoreCaCertificatesBundleOutput,
  TrustStoreNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTrustStoreCaCertificatesBundleInput,
  output: GetTrustStoreCaCertificatesBundleOutput,
  errors: [TrustStoreNotFoundException],
}));
/**
 * Removes the specified revocation file from the specified trust store.
 */
export const removeTrustStoreRevocations: (
  input: RemoveTrustStoreRevocationsInput,
) => effect.Effect<
  RemoveTrustStoreRevocationsOutput,
  RevocationIdNotFoundException | TrustStoreNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveTrustStoreRevocationsInput,
  output: RemoveTrustStoreRevocationsOutput,
  errors: [RevocationIdNotFoundException, TrustStoreNotFoundException],
}));
/**
 * Retrieves the specified revocation file.
 *
 * This action returns a pre-signed S3 URI which is
 * active for ten minutes.
 */
export const getTrustStoreRevocationContent: (
  input: GetTrustStoreRevocationContentInput,
) => effect.Effect<
  GetTrustStoreRevocationContentOutput,
  RevocationIdNotFoundException | TrustStoreNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTrustStoreRevocationContentInput,
  output: GetTrustStoreRevocationContentOutput,
  errors: [RevocationIdNotFoundException, TrustStoreNotFoundException],
}));
/**
 * Deletes a shared trust store association.
 */
export const deleteSharedTrustStoreAssociation: (
  input: DeleteSharedTrustStoreAssociationInput,
) => effect.Effect<
  DeleteSharedTrustStoreAssociationOutput,
  | DeleteAssociationSameAccountException
  | TrustStoreAssociationNotFoundException
  | TrustStoreNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSharedTrustStoreAssociationInput,
  output: DeleteSharedTrustStoreAssociationOutput,
  errors: [
    DeleteAssociationSameAccountException,
    TrustStoreAssociationNotFoundException,
    TrustStoreNotFoundException,
  ],
}));
/**
 * Deregisters the specified targets from the specified target group. After the targets are
 * deregistered, they no longer receive traffic from the load balancer.
 *
 * The load balancer stops sending requests to targets that are deregistering, but uses
 * connection draining to ensure that in-flight traffic completes on the existing connections.
 * This deregistration delay is configured by default but can be updated for each target group.
 *
 * For more information, see the following:
 *
 * -
 * Deregistration delay in the *Application Load Balancers User Guide*
 *
 * -
 * Deregistration delay in the *Network Load Balancers User Guide*
 *
 * -
 * Deregistration delay in the *Gateway Load Balancers User Guide*
 *
 * Note: If the specified target does not exist, the action returns successfully.
 */
export const deregisterTargets: (
  input: DeregisterTargetsInput,
) => effect.Effect<
  DeregisterTargetsOutput,
  InvalidTargetException | TargetGroupNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterTargetsInput,
  output: DeregisterTargetsOutput,
  errors: [InvalidTargetException, TargetGroupNotFoundException],
}));
/**
 * Describes the tags for the specified Elastic Load Balancing resources. You can describe
 * the tags for one or more Application Load Balancers, Network Load Balancers, Gateway Load
 * Balancers, target groups, listeners, or rules.
 */
export const describeTags: (
  input: DescribeTagsInput,
) => effect.Effect<
  DescribeTagsOutput,
  | ListenerNotFoundException
  | LoadBalancerNotFoundException
  | RuleNotFoundException
  | TargetGroupNotFoundException
  | TrustStoreNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTagsInput,
  output: DescribeTagsOutput,
  errors: [
    ListenerNotFoundException,
    LoadBalancerNotFoundException,
    RuleNotFoundException,
    TargetGroupNotFoundException,
    TrustStoreNotFoundException,
  ],
}));
/**
 * Modifies the specified attributes of the specified listener.
 */
export const modifyListenerAttributes: (
  input: ModifyListenerAttributesInput,
) => effect.Effect<
  ModifyListenerAttributesOutput,
  | InvalidConfigurationRequestException
  | ListenerNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyListenerAttributesInput,
  output: ModifyListenerAttributesOutput,
  errors: [InvalidConfigurationRequestException, ListenerNotFoundException],
}));
/**
 * Modifies the specified attributes of the specified Application Load Balancer, Network Load
 * Balancer, or Gateway Load Balancer.
 *
 * If any of the specified attributes can't be modified as requested, the call fails. Any
 * existing attributes that you do not modify retain their current values.
 */
export const modifyLoadBalancerAttributes: (
  input: ModifyLoadBalancerAttributesInput,
) => effect.Effect<
  ModifyLoadBalancerAttributesOutput,
  | InvalidConfigurationRequestException
  | LoadBalancerNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyLoadBalancerAttributesInput,
  output: ModifyLoadBalancerAttributesOutput,
  errors: [InvalidConfigurationRequestException, LoadBalancerNotFoundException],
}));
/**
 * Describes the capacity reservation status for the specified load balancer.
 */
export const describeCapacityReservation: (
  input: DescribeCapacityReservationInput,
) => effect.Effect<
  DescribeCapacityReservationOutput,
  LoadBalancerNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCapacityReservationInput,
  output: DescribeCapacityReservationOutput,
  errors: [LoadBalancerNotFoundException],
}));
/**
 * Describes the specified listeners or the listeners for the specified Application Load
 * Balancer, Network Load Balancer, or Gateway Load Balancer. You must specify either a load
 * balancer or one or more listeners.
 */
export const describeListeners: {
  (
    input: DescribeListenersInput,
  ): effect.Effect<
    DescribeListenersOutput,
    | ListenerNotFoundException
    | LoadBalancerNotFoundException
    | UnsupportedProtocolException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeListenersInput,
  ) => stream.Stream<
    DescribeListenersOutput,
    | ListenerNotFoundException
    | LoadBalancerNotFoundException
    | UnsupportedProtocolException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeListenersInput,
  ) => stream.Stream<
    Listener,
    | ListenerNotFoundException
    | LoadBalancerNotFoundException
    | UnsupportedProtocolException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeListenersInput,
  output: DescribeListenersOutput,
  errors: [
    ListenerNotFoundException,
    LoadBalancerNotFoundException,
    UnsupportedProtocolException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "Listeners",
  } as const,
}));
/**
 * Describes the specified load balancers or all of your load balancers.
 */
export const describeLoadBalancers: {
  (
    input: DescribeLoadBalancersInput,
  ): effect.Effect<
    DescribeLoadBalancersOutput,
    LoadBalancerNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeLoadBalancersInput,
  ) => stream.Stream<
    DescribeLoadBalancersOutput,
    LoadBalancerNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeLoadBalancersInput,
  ) => stream.Stream<
    LoadBalancer,
    LoadBalancerNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeLoadBalancersInput,
  output: DescribeLoadBalancersOutput,
  errors: [LoadBalancerNotFoundException],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "LoadBalancers",
  } as const,
}));
/**
 * Update the ca certificate bundle for the specified trust store.
 */
export const modifyTrustStore: (
  input: ModifyTrustStoreInput,
) => effect.Effect<
  ModifyTrustStoreOutput,
  | CaCertificatesBundleNotFoundException
  | InvalidCaCertificatesBundleException
  | TrustStoreNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyTrustStoreInput,
  output: ModifyTrustStoreOutput,
  errors: [
    CaCertificatesBundleNotFoundException,
    InvalidCaCertificatesBundleException,
    TrustStoreNotFoundException,
  ],
}));
/**
 * Sets the priorities of the specified rules.
 *
 * You can reorder the rules as long as there are no priority conflicts in the new order. Any
 * existing rules that you do not specify retain their current priority.
 */
export const setRulePriorities: (
  input: SetRulePrioritiesInput,
) => effect.Effect<
  SetRulePrioritiesOutput,
  | OperationNotPermittedException
  | PriorityInUseException
  | RuleNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetRulePrioritiesInput,
  output: SetRulePrioritiesOutput,
  errors: [
    OperationNotPermittedException,
    PriorityInUseException,
    RuleNotFoundException,
  ],
}));
/**
 * Removes the specified tags from the specified Elastic Load Balancing resources. You can
 * remove the tags for one or more Application Load Balancers, Network Load Balancers, Gateway
 * Load Balancers, target groups, listeners, or rules.
 */
export const removeTags: (
  input: RemoveTagsInput,
) => effect.Effect<
  RemoveTagsOutput,
  | ListenerNotFoundException
  | LoadBalancerNotFoundException
  | RuleNotFoundException
  | TargetGroupNotFoundException
  | TooManyTagsException
  | TrustStoreNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveTagsInput,
  output: RemoveTagsOutput,
  errors: [
    ListenerNotFoundException,
    LoadBalancerNotFoundException,
    RuleNotFoundException,
    TargetGroupNotFoundException,
    TooManyTagsException,
    TrustStoreNotFoundException,
  ],
}));
/**
 * Describes the specified rules or the rules for the specified listener. You must specify
 * either a listener or rules.
 */
export const describeRules: {
  (
    input: DescribeRulesInput,
  ): effect.Effect<
    DescribeRulesOutput,
    | ListenerNotFoundException
    | RuleNotFoundException
    | UnsupportedProtocolException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeRulesInput,
  ) => stream.Stream<
    DescribeRulesOutput,
    | ListenerNotFoundException
    | RuleNotFoundException
    | UnsupportedProtocolException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeRulesInput,
  ) => stream.Stream<
    Rule,
    | ListenerNotFoundException
    | RuleNotFoundException
    | UnsupportedProtocolException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeRulesInput,
  output: DescribeRulesOutput,
  errors: [
    ListenerNotFoundException,
    RuleNotFoundException,
    UnsupportedProtocolException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "Rules",
  } as const,
}));
/**
 * Sets the type of IP addresses used by the subnets of the specified load balancer.
 */
export const setIpAddressType: (
  input: SetIpAddressTypeInput,
) => effect.Effect<
  SetIpAddressTypeOutput,
  | InvalidConfigurationRequestException
  | InvalidSubnetException
  | LoadBalancerNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetIpAddressTypeInput,
  output: SetIpAddressTypeOutput,
  errors: [
    InvalidConfigurationRequestException,
    InvalidSubnetException,
    LoadBalancerNotFoundException,
  ],
}));
/**
 * Associates the specified security groups with the specified Application Load Balancer or
 * Network Load Balancer. The specified security groups override the previously associated
 * security groups.
 *
 * You can't perform this operation on a Network Load Balancer unless you specified a
 * security group for the load balancer when you created it.
 *
 * You can't associate a security group with a Gateway Load Balancer.
 */
export const setSecurityGroups: (
  input: SetSecurityGroupsInput,
) => effect.Effect<
  SetSecurityGroupsOutput,
  | InvalidConfigurationRequestException
  | InvalidSecurityGroupException
  | LoadBalancerNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetSecurityGroupsInput,
  output: SetSecurityGroupsOutput,
  errors: [
    InvalidConfigurationRequestException,
    InvalidSecurityGroupException,
    LoadBalancerNotFoundException,
  ],
}));
/**
 * Adds the specified tags to the specified Elastic Load Balancing resource. You can tag your
 * Application Load Balancers, Network Load Balancers, Gateway Load Balancers, target groups,
 * trust stores, listeners, and rules.
 *
 * Each tag consists of a key and an optional value. If a resource already has a tag with the
 * same key, `AddTags` updates its value.
 */
export const addTags: (
  input: AddTagsInput,
) => effect.Effect<
  AddTagsOutput,
  | DuplicateTagKeysException
  | ListenerNotFoundException
  | LoadBalancerNotFoundException
  | RuleNotFoundException
  | TargetGroupNotFoundException
  | TooManyTagsException
  | TrustStoreNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsInput,
  output: AddTagsOutput,
  errors: [
    DuplicateTagKeysException,
    ListenerNotFoundException,
    LoadBalancerNotFoundException,
    RuleNotFoundException,
    TargetGroupNotFoundException,
    TooManyTagsException,
    TrustStoreNotFoundException,
  ],
}));
/**
 * Adds the specified SSL server certificate to the certificate list for the specified HTTPS
 * or TLS listener.
 *
 * If the certificate in already in the certificate list, the call is successful but the
 * certificate is not added again.
 *
 * For more information, see SSL
 * certificates in the *Application Load Balancers Guide* or Server
 * certificates in the *Network Load Balancers Guide*.
 */
export const addListenerCertificates: (
  input: AddListenerCertificatesInput,
) => effect.Effect<
  AddListenerCertificatesOutput,
  | CertificateNotFoundException
  | ListenerNotFoundException
  | TooManyCertificatesException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddListenerCertificatesInput,
  output: AddListenerCertificatesOutput,
  errors: [
    CertificateNotFoundException,
    ListenerNotFoundException,
    TooManyCertificatesException,
  ],
}));
/**
 * Describes the specified policies or all policies used for SSL negotiation.
 *
 * For more information, see Security policies in the *Application Load Balancers Guide* and
 * Security policies in the *Network Load Balancers Guide*.
 */
export const describeSSLPolicies: (
  input: DescribeSSLPoliciesInput,
) => effect.Effect<
  DescribeSSLPoliciesOutput,
  SSLPolicyNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSSLPoliciesInput,
  output: DescribeSSLPoliciesOutput,
  errors: [SSLPolicyNotFoundException],
}));
/**
 * Describes the health of the specified targets or all of your targets.
 */
export const describeTargetHealth: (
  input: DescribeTargetHealthInput,
) => effect.Effect<
  DescribeTargetHealthOutput,
  | HealthUnavailableException
  | InvalidTargetException
  | TargetGroupNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTargetHealthInput,
  output: DescribeTargetHealthOutput,
  errors: [
    HealthUnavailableException,
    InvalidTargetException,
    TargetGroupNotFoundException,
  ],
}));
/**
 * Registers the specified targets with the specified target group.
 *
 * If the target is an EC2 instance, it must be in the `running` state when you
 * register it.
 *
 * By default, the load balancer routes requests to registered targets using the protocol and
 * port for the target group. Alternatively, you can override the port for a target when you
 * register it. You can register each EC2 instance or IP address with the same target group
 * multiple times using different ports.
 *
 * For more information, see the following:
 *
 * - Register
 * targets for your Application Load Balancer
 *
 * - Register targets
 * for your Network Load Balancer
 *
 * - Register targets for your
 * Gateway Load Balancer
 */
export const registerTargets: (
  input: RegisterTargetsInput,
) => effect.Effect<
  RegisterTargetsOutput,
  | InvalidTargetException
  | TargetGroupNotFoundException
  | TooManyRegistrationsForTargetIdException
  | TooManyTargetsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterTargetsInput,
  output: RegisterTargetsOutput,
  errors: [
    InvalidTargetException,
    TargetGroupNotFoundException,
    TooManyRegistrationsForTargetIdException,
    TooManyTargetsException,
  ],
}));
/**
 * Creates a trust store.
 *
 * For more information, see Mutual TLS for Application Load Balancers.
 */
export const createTrustStore: (
  input: CreateTrustStoreInput,
) => effect.Effect<
  CreateTrustStoreOutput,
  | CaCertificatesBundleNotFoundException
  | DuplicateTagKeysException
  | DuplicateTrustStoreNameException
  | InvalidCaCertificatesBundleException
  | TooManyTagsException
  | TooManyTrustStoresException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTrustStoreInput,
  output: CreateTrustStoreOutput,
  errors: [
    CaCertificatesBundleNotFoundException,
    DuplicateTagKeysException,
    DuplicateTrustStoreNameException,
    InvalidCaCertificatesBundleException,
    TooManyTagsException,
    TooManyTrustStoresException,
  ],
}));
/**
 * Creates a target group.
 *
 * For more information, see the following:
 *
 * - Target
 * groups for your Application Load Balancers
 *
 * - Target groups
 * for your Network Load Balancers
 *
 * - Target groups for your
 * Gateway Load Balancers
 *
 * This operation is idempotent, which means that it completes at most one time. If you
 * attempt to create multiple target groups with the same settings, each call succeeds.
 */
export const createTargetGroup: (
  input: CreateTargetGroupInput,
) => effect.Effect<
  CreateTargetGroupOutput,
  | DuplicateTargetGroupNameException
  | InvalidConfigurationRequestException
  | TooManyTagsException
  | TooManyTargetGroupsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTargetGroupInput,
  output: CreateTargetGroupOutput,
  errors: [
    DuplicateTargetGroupNameException,
    InvalidConfigurationRequestException,
    TooManyTagsException,
    TooManyTargetGroupsException,
  ],
}));
/**
 * Enables the Availability Zones for the specified public subnets for the specified
 * Application Load Balancer, Network Load Balancer or Gateway Load Balancer. The specified subnets
 * replace the previously enabled subnets.
 */
export const setSubnets: (
  input: SetSubnetsInput,
) => effect.Effect<
  SetSubnetsOutput,
  | AllocationIdNotFoundException
  | AvailabilityZoneNotSupportedException
  | CapacityReservationPendingException
  | InvalidConfigurationRequestException
  | InvalidSubnetException
  | LoadBalancerNotFoundException
  | SubnetNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetSubnetsInput,
  output: SetSubnetsOutput,
  errors: [
    AllocationIdNotFoundException,
    AvailabilityZoneNotSupportedException,
    CapacityReservationPendingException,
    InvalidConfigurationRequestException,
    InvalidSubnetException,
    LoadBalancerNotFoundException,
    SubnetNotFoundException,
  ],
}));
/**
 * Adds the specified revocation file to the specified trust store.
 */
export const addTrustStoreRevocations: (
  input: AddTrustStoreRevocationsInput,
) => effect.Effect<
  AddTrustStoreRevocationsOutput,
  | InvalidRevocationContentException
  | RevocationContentNotFoundException
  | TooManyTrustStoreRevocationEntriesException
  | TrustStoreNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTrustStoreRevocationsInput,
  output: AddTrustStoreRevocationsOutput,
  errors: [
    InvalidRevocationContentException,
    RevocationContentNotFoundException,
    TooManyTrustStoreRevocationEntriesException,
    TrustStoreNotFoundException,
  ],
}));
/**
 * Replaces the specified properties of the specified rule. Any properties that you do not
 * specify are unchanged.
 *
 * To add an item to a list, remove an item from a list, or update an item in a list, you
 * must provide the entire list. For example, to add an action, specify a list with the current
 * actions plus the new action.
 */
export const modifyRule: (
  input: ModifyRuleInput,
) => effect.Effect<
  ModifyRuleOutput,
  | IncompatibleProtocolsException
  | InvalidLoadBalancerActionException
  | OperationNotPermittedException
  | RuleNotFoundException
  | TargetGroupAssociationLimitException
  | TargetGroupNotFoundException
  | TooManyActionsException
  | TooManyRegistrationsForTargetIdException
  | TooManyTargetsException
  | TooManyUniqueTargetGroupsPerLoadBalancerException
  | UnsupportedProtocolException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyRuleInput,
  output: ModifyRuleOutput,
  errors: [
    IncompatibleProtocolsException,
    InvalidLoadBalancerActionException,
    OperationNotPermittedException,
    RuleNotFoundException,
    TargetGroupAssociationLimitException,
    TargetGroupNotFoundException,
    TooManyActionsException,
    TooManyRegistrationsForTargetIdException,
    TooManyTargetsException,
    TooManyUniqueTargetGroupsPerLoadBalancerException,
    UnsupportedProtocolException,
  ],
}));
/**
 * Creates a rule for the specified listener. The listener must be associated with an
 * Application Load Balancer.
 *
 * Each rule consists of a priority, one or more actions, one or more conditions, and
 * up to two optional transforms. Rules are evaluated in priority order, from the lowest value
 * to the highest value. When the conditions for a rule are met, its actions are performed.
 * If the conditions for no rules are met, the actions for the default rule are performed.
 * For more information, see Listener rules in the *Application Load Balancers Guide*.
 */
export const createRule: (
  input: CreateRuleInput,
) => effect.Effect<
  CreateRuleOutput,
  | IncompatibleProtocolsException
  | InvalidConfigurationRequestException
  | InvalidLoadBalancerActionException
  | ListenerNotFoundException
  | PriorityInUseException
  | TargetGroupAssociationLimitException
  | TargetGroupNotFoundException
  | TooManyActionsException
  | TooManyRegistrationsForTargetIdException
  | TooManyRulesException
  | TooManyTagsException
  | TooManyTargetGroupsException
  | TooManyTargetsException
  | TooManyUniqueTargetGroupsPerLoadBalancerException
  | UnsupportedProtocolException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRuleInput,
  output: CreateRuleOutput,
  errors: [
    IncompatibleProtocolsException,
    InvalidConfigurationRequestException,
    InvalidLoadBalancerActionException,
    ListenerNotFoundException,
    PriorityInUseException,
    TargetGroupAssociationLimitException,
    TargetGroupNotFoundException,
    TooManyActionsException,
    TooManyRegistrationsForTargetIdException,
    TooManyRulesException,
    TooManyTagsException,
    TooManyTargetGroupsException,
    TooManyTargetsException,
    TooManyUniqueTargetGroupsPerLoadBalancerException,
    UnsupportedProtocolException,
  ],
}));
/**
 * Creates an Application Load Balancer, Network Load Balancer, or Gateway Load
 * Balancer.
 *
 * For more information, see the following:
 *
 * - Application Load Balancers
 *
 * - Network Load
 * Balancers
 *
 * - Gateway Load
 * Balancers
 *
 * This operation is idempotent, which means that it completes at most one time. If you
 * attempt to create multiple load balancers with the same settings, each call succeeds.
 */
export const createLoadBalancer: (
  input: CreateLoadBalancerInput,
) => effect.Effect<
  CreateLoadBalancerOutput,
  | AllocationIdNotFoundException
  | AvailabilityZoneNotSupportedException
  | DuplicateLoadBalancerNameException
  | DuplicateTagKeysException
  | InvalidConfigurationRequestException
  | InvalidSchemeException
  | InvalidSecurityGroupException
  | InvalidSubnetException
  | OperationNotPermittedException
  | ResourceInUseException
  | SubnetNotFoundException
  | TooManyLoadBalancersException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLoadBalancerInput,
  output: CreateLoadBalancerOutput,
  errors: [
    AllocationIdNotFoundException,
    AvailabilityZoneNotSupportedException,
    DuplicateLoadBalancerNameException,
    DuplicateTagKeysException,
    InvalidConfigurationRequestException,
    InvalidSchemeException,
    InvalidSecurityGroupException,
    InvalidSubnetException,
    OperationNotPermittedException,
    ResourceInUseException,
    SubnetNotFoundException,
    TooManyLoadBalancersException,
    TooManyTagsException,
  ],
}));
/**
 * Modifies the capacity reservation of the specified load balancer.
 *
 * When modifying capacity reservation, you must include at least one `MinimumLoadBalancerCapacity`
 * or `ResetCapacityReservation`.
 */
export const modifyCapacityReservation: (
  input: ModifyCapacityReservationInput,
) => effect.Effect<
  ModifyCapacityReservationOutput,
  | CapacityDecreaseRequestsLimitExceededException
  | CapacityReservationPendingException
  | CapacityUnitsLimitExceededException
  | InsufficientCapacityException
  | InvalidConfigurationRequestException
  | LoadBalancerNotFoundException
  | OperationNotPermittedException
  | PriorRequestNotCompleteException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyCapacityReservationInput,
  output: ModifyCapacityReservationOutput,
  errors: [
    CapacityDecreaseRequestsLimitExceededException,
    CapacityReservationPendingException,
    CapacityUnitsLimitExceededException,
    InsufficientCapacityException,
    InvalidConfigurationRequestException,
    LoadBalancerNotFoundException,
    OperationNotPermittedException,
    PriorRequestNotCompleteException,
  ],
}));
/**
 * Replaces the specified properties of the specified listener. Any properties that you do
 * not specify remain unchanged.
 *
 * Changing the protocol from HTTPS to HTTP, or from TLS to TCP, removes the security policy
 * and default certificate properties. If you change the protocol from HTTP to HTTPS, or from TCP
 * to TLS, you must add the security policy and default certificate properties.
 *
 * To add an item to a list, remove an item from a list, or update an item in a list, you
 * must provide the entire list. For example, to add an action, specify a list with the current
 * actions plus the new action.
 */
export const modifyListener: (
  input: ModifyListenerInput,
) => effect.Effect<
  ModifyListenerOutput,
  | ALPNPolicyNotSupportedException
  | CertificateNotFoundException
  | DuplicateListenerException
  | IncompatibleProtocolsException
  | InvalidConfigurationRequestException
  | InvalidLoadBalancerActionException
  | ListenerNotFoundException
  | SSLPolicyNotFoundException
  | TargetGroupAssociationLimitException
  | TargetGroupNotFoundException
  | TooManyActionsException
  | TooManyCertificatesException
  | TooManyListenersException
  | TooManyRegistrationsForTargetIdException
  | TooManyTargetsException
  | TooManyUniqueTargetGroupsPerLoadBalancerException
  | TrustStoreNotFoundException
  | TrustStoreNotReadyException
  | UnsupportedProtocolException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyListenerInput,
  output: ModifyListenerOutput,
  errors: [
    ALPNPolicyNotSupportedException,
    CertificateNotFoundException,
    DuplicateListenerException,
    IncompatibleProtocolsException,
    InvalidConfigurationRequestException,
    InvalidLoadBalancerActionException,
    ListenerNotFoundException,
    SSLPolicyNotFoundException,
    TargetGroupAssociationLimitException,
    TargetGroupNotFoundException,
    TooManyActionsException,
    TooManyCertificatesException,
    TooManyListenersException,
    TooManyRegistrationsForTargetIdException,
    TooManyTargetsException,
    TooManyUniqueTargetGroupsPerLoadBalancerException,
    TrustStoreNotFoundException,
    TrustStoreNotReadyException,
    UnsupportedProtocolException,
  ],
}));
/**
 * Creates a listener for the specified Application Load Balancer, Network Load Balancer, or
 * Gateway Load Balancer.
 *
 * For more information, see the following:
 *
 * - Listeners for
 * your Application Load Balancers
 *
 * - Listeners for
 * your Network Load Balancers
 *
 * - Listeners for your
 * Gateway Load Balancers
 *
 * This operation is idempotent, which means that it completes at most one time. If you
 * attempt to create multiple listeners with the same settings, each call succeeds.
 */
export const createListener: (
  input: CreateListenerInput,
) => effect.Effect<
  CreateListenerOutput,
  | ALPNPolicyNotSupportedException
  | CertificateNotFoundException
  | DuplicateListenerException
  | IncompatibleProtocolsException
  | InvalidConfigurationRequestException
  | InvalidLoadBalancerActionException
  | LoadBalancerNotFoundException
  | SSLPolicyNotFoundException
  | TargetGroupAssociationLimitException
  | TargetGroupNotFoundException
  | TooManyActionsException
  | TooManyCertificatesException
  | TooManyListenersException
  | TooManyRegistrationsForTargetIdException
  | TooManyTagsException
  | TooManyTargetsException
  | TooManyUniqueTargetGroupsPerLoadBalancerException
  | TrustStoreNotFoundException
  | TrustStoreNotReadyException
  | UnsupportedProtocolException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateListenerInput,
  output: CreateListenerOutput,
  errors: [
    ALPNPolicyNotSupportedException,
    CertificateNotFoundException,
    DuplicateListenerException,
    IncompatibleProtocolsException,
    InvalidConfigurationRequestException,
    InvalidLoadBalancerActionException,
    LoadBalancerNotFoundException,
    SSLPolicyNotFoundException,
    TargetGroupAssociationLimitException,
    TargetGroupNotFoundException,
    TooManyActionsException,
    TooManyCertificatesException,
    TooManyListenersException,
    TooManyRegistrationsForTargetIdException,
    TooManyTagsException,
    TooManyTargetsException,
    TooManyUniqueTargetGroupsPerLoadBalancerException,
    TrustStoreNotFoundException,
    TrustStoreNotReadyException,
    UnsupportedProtocolException,
  ],
}));
