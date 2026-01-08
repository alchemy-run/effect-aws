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
const ns = T.XmlNamespace(
  "http://elasticloadbalancing.amazonaws.com/doc/2012-06-01/",
);
const svc = T.AwsApiService({
  sdkId: "Elastic Load Balancing",
  serviceShapeName: "ElasticLoadBalancing_v7",
});
const auth = T.AwsAuthSigv4({ name: "elasticloadbalancing" });
const ver = T.ServiceVersion("2012-06-01");
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
export type AccessPointName = string;
export type SecurityGroupId = string;
export type SubnetId = string;
export type PolicyName = string;
export type CookieName = string;
export type CookieExpirationPeriod = number;
export type AvailabilityZone = string;
export type LoadBalancerScheme = string;
export type PolicyTypeName = string;
export type AccessPointPort = number;
export type Marker = string;
export type PageSize = number;
export type SSLCertificateId = string;
export type EndPointPort = number;
export type TagKey = string;
export type TagValue = string;
export type HealthCheckTarget = string;
export type HealthCheckInterval = number;
export type HealthCheckTimeout = number;
export type UnhealthyThreshold = number;
export type HealthyThreshold = number;
export type Protocol = string;
export type InstancePort = number;
export type AttributeName = string;
export type AttributeValue = string;
export type InstanceId = string;
export type ErrorDescription = string;
export type S3BucketName = string;
export type AccessLogInterval = number;
export type AccessLogPrefix = string;
export type ConnectionDrainingTimeout = number;
export type IdleTimeout = number;
export type AdditionalAttributeKey = string;
export type AdditionalAttributeValue = string;
export type Name = string;
export type Max = string;
export type State = string;
export type ReasonCode = string;
export type Description = string;
export type DNSName = string;
export type VPCId = string;
export type AttributeType = string;
export type DefaultValue = string;
export type Cardinality = string;
export type SecurityGroupOwnerAlias = string;
export type SecurityGroupName = string;

//# Schemas
export type LoadBalancerNames = string[];
export const LoadBalancerNames = S.Array(S.String);
export type SecurityGroups = string[];
export const SecurityGroups = S.Array(S.String);
export type Subnets = string[];
export const Subnets = S.Array(S.String);
export type AvailabilityZones = string[];
export const AvailabilityZones = S.Array(S.String);
export type Ports = number[];
export const Ports = S.Array(S.Number);
export type PolicyNames = string[];
export const PolicyNames = S.Array(S.String);
export type PolicyTypeNames = string[];
export const PolicyTypeNames = S.Array(S.String);
export type LoadBalancerNamesMax20 = string[];
export const LoadBalancerNamesMax20 = S.Array(S.String);
export interface ApplySecurityGroupsToLoadBalancerInput {
  LoadBalancerName: string;
  SecurityGroups: SecurityGroups;
}
export const ApplySecurityGroupsToLoadBalancerInput = S.suspend(() =>
  S.Struct({ LoadBalancerName: S.String, SecurityGroups: SecurityGroups }).pipe(
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
  identifier: "ApplySecurityGroupsToLoadBalancerInput",
}) as any as S.Schema<ApplySecurityGroupsToLoadBalancerInput>;
export interface AttachLoadBalancerToSubnetsInput {
  LoadBalancerName: string;
  Subnets: Subnets;
}
export const AttachLoadBalancerToSubnetsInput = S.suspend(() =>
  S.Struct({ LoadBalancerName: S.String, Subnets: Subnets }).pipe(
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
  identifier: "AttachLoadBalancerToSubnetsInput",
}) as any as S.Schema<AttachLoadBalancerToSubnetsInput>;
export interface CreateAppCookieStickinessPolicyInput {
  LoadBalancerName: string;
  PolicyName: string;
  CookieName: string;
}
export const CreateAppCookieStickinessPolicyInput = S.suspend(() =>
  S.Struct({
    LoadBalancerName: S.String,
    PolicyName: S.String,
    CookieName: S.String,
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
  identifier: "CreateAppCookieStickinessPolicyInput",
}) as any as S.Schema<CreateAppCookieStickinessPolicyInput>;
export interface CreateAppCookieStickinessPolicyOutput {}
export const CreateAppCookieStickinessPolicyOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateAppCookieStickinessPolicyOutput",
}) as any as S.Schema<CreateAppCookieStickinessPolicyOutput>;
export interface CreateLBCookieStickinessPolicyInput {
  LoadBalancerName: string;
  PolicyName: string;
  CookieExpirationPeriod?: number;
}
export const CreateLBCookieStickinessPolicyInput = S.suspend(() =>
  S.Struct({
    LoadBalancerName: S.String,
    PolicyName: S.String,
    CookieExpirationPeriod: S.optional(S.Number),
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
  identifier: "CreateLBCookieStickinessPolicyInput",
}) as any as S.Schema<CreateLBCookieStickinessPolicyInput>;
export interface CreateLBCookieStickinessPolicyOutput {}
export const CreateLBCookieStickinessPolicyOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateLBCookieStickinessPolicyOutput",
}) as any as S.Schema<CreateLBCookieStickinessPolicyOutput>;
export interface Listener {
  Protocol: string;
  LoadBalancerPort: number;
  InstanceProtocol?: string;
  InstancePort: number;
  SSLCertificateId?: string;
}
export const Listener = S.suspend(() =>
  S.Struct({
    Protocol: S.String,
    LoadBalancerPort: S.Number,
    InstanceProtocol: S.optional(S.String),
    InstancePort: S.Number,
    SSLCertificateId: S.optional(S.String),
  }),
).annotations({ identifier: "Listener" }) as any as S.Schema<Listener>;
export type Listeners = Listener[];
export const Listeners = S.Array(Listener);
export interface CreateLoadBalancerListenerInput {
  LoadBalancerName: string;
  Listeners: Listeners;
}
export const CreateLoadBalancerListenerInput = S.suspend(() =>
  S.Struct({ LoadBalancerName: S.String, Listeners: Listeners }).pipe(
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
  identifier: "CreateLoadBalancerListenerInput",
}) as any as S.Schema<CreateLoadBalancerListenerInput>;
export interface CreateLoadBalancerListenerOutput {}
export const CreateLoadBalancerListenerOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateLoadBalancerListenerOutput",
}) as any as S.Schema<CreateLoadBalancerListenerOutput>;
export interface DeleteAccessPointInput {
  LoadBalancerName: string;
}
export const DeleteAccessPointInput = S.suspend(() =>
  S.Struct({ LoadBalancerName: S.String }).pipe(
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
  identifier: "DeleteAccessPointInput",
}) as any as S.Schema<DeleteAccessPointInput>;
export interface DeleteAccessPointOutput {}
export const DeleteAccessPointOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteAccessPointOutput",
}) as any as S.Schema<DeleteAccessPointOutput>;
export interface DeleteLoadBalancerListenerInput {
  LoadBalancerName: string;
  LoadBalancerPorts: Ports;
}
export const DeleteLoadBalancerListenerInput = S.suspend(() =>
  S.Struct({ LoadBalancerName: S.String, LoadBalancerPorts: Ports }).pipe(
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
  identifier: "DeleteLoadBalancerListenerInput",
}) as any as S.Schema<DeleteLoadBalancerListenerInput>;
export interface DeleteLoadBalancerListenerOutput {}
export const DeleteLoadBalancerListenerOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteLoadBalancerListenerOutput",
}) as any as S.Schema<DeleteLoadBalancerListenerOutput>;
export interface DeleteLoadBalancerPolicyInput {
  LoadBalancerName: string;
  PolicyName: string;
}
export const DeleteLoadBalancerPolicyInput = S.suspend(() =>
  S.Struct({ LoadBalancerName: S.String, PolicyName: S.String }).pipe(
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
  identifier: "DeleteLoadBalancerPolicyInput",
}) as any as S.Schema<DeleteLoadBalancerPolicyInput>;
export interface DeleteLoadBalancerPolicyOutput {}
export const DeleteLoadBalancerPolicyOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteLoadBalancerPolicyOutput",
}) as any as S.Schema<DeleteLoadBalancerPolicyOutput>;
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
export interface Instance {
  InstanceId?: string;
}
export const Instance = S.suspend(() =>
  S.Struct({ InstanceId: S.optional(S.String) }),
).annotations({ identifier: "Instance" }) as any as S.Schema<Instance>;
export type Instances = Instance[];
export const Instances = S.Array(Instance);
export interface DescribeEndPointStateInput {
  LoadBalancerName: string;
  Instances?: Instances;
}
export const DescribeEndPointStateInput = S.suspend(() =>
  S.Struct({
    LoadBalancerName: S.String,
    Instances: S.optional(Instances),
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
  identifier: "DescribeEndPointStateInput",
}) as any as S.Schema<DescribeEndPointStateInput>;
export interface DescribeLoadBalancerAttributesInput {
  LoadBalancerName: string;
}
export const DescribeLoadBalancerAttributesInput = S.suspend(() =>
  S.Struct({ LoadBalancerName: S.String }).pipe(
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
export interface DescribeLoadBalancerPoliciesInput {
  LoadBalancerName?: string;
  PolicyNames?: PolicyNames;
}
export const DescribeLoadBalancerPoliciesInput = S.suspend(() =>
  S.Struct({
    LoadBalancerName: S.optional(S.String),
    PolicyNames: S.optional(PolicyNames),
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
  identifier: "DescribeLoadBalancerPoliciesInput",
}) as any as S.Schema<DescribeLoadBalancerPoliciesInput>;
export interface DescribeLoadBalancerPolicyTypesInput {
  PolicyTypeNames?: PolicyTypeNames;
}
export const DescribeLoadBalancerPolicyTypesInput = S.suspend(() =>
  S.Struct({ PolicyTypeNames: S.optional(PolicyTypeNames) }).pipe(
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
  identifier: "DescribeLoadBalancerPolicyTypesInput",
}) as any as S.Schema<DescribeLoadBalancerPolicyTypesInput>;
export interface DescribeAccessPointsInput {
  LoadBalancerNames?: LoadBalancerNames;
  Marker?: string;
  PageSize?: number;
}
export const DescribeAccessPointsInput = S.suspend(() =>
  S.Struct({
    LoadBalancerNames: S.optional(LoadBalancerNames),
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
  identifier: "DescribeAccessPointsInput",
}) as any as S.Schema<DescribeAccessPointsInput>;
export interface DescribeTagsInput {
  LoadBalancerNames: LoadBalancerNamesMax20;
}
export const DescribeTagsInput = S.suspend(() =>
  S.Struct({ LoadBalancerNames: LoadBalancerNamesMax20 }).pipe(
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
export interface DetachLoadBalancerFromSubnetsInput {
  LoadBalancerName: string;
  Subnets: Subnets;
}
export const DetachLoadBalancerFromSubnetsInput = S.suspend(() =>
  S.Struct({ LoadBalancerName: S.String, Subnets: Subnets }).pipe(
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
  identifier: "DetachLoadBalancerFromSubnetsInput",
}) as any as S.Schema<DetachLoadBalancerFromSubnetsInput>;
export interface RemoveAvailabilityZonesInput {
  LoadBalancerName: string;
  AvailabilityZones: AvailabilityZones;
}
export const RemoveAvailabilityZonesInput = S.suspend(() =>
  S.Struct({
    LoadBalancerName: S.String,
    AvailabilityZones: AvailabilityZones,
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
  identifier: "RemoveAvailabilityZonesInput",
}) as any as S.Schema<RemoveAvailabilityZonesInput>;
export interface AddAvailabilityZonesInput {
  LoadBalancerName: string;
  AvailabilityZones: AvailabilityZones;
}
export const AddAvailabilityZonesInput = S.suspend(() =>
  S.Struct({
    LoadBalancerName: S.String,
    AvailabilityZones: AvailabilityZones,
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
  identifier: "AddAvailabilityZonesInput",
}) as any as S.Schema<AddAvailabilityZonesInput>;
export interface RegisterEndPointsInput {
  LoadBalancerName: string;
  Instances: Instances;
}
export const RegisterEndPointsInput = S.suspend(() =>
  S.Struct({ LoadBalancerName: S.String, Instances: Instances }).pipe(
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
  identifier: "RegisterEndPointsInput",
}) as any as S.Schema<RegisterEndPointsInput>;
export interface SetLoadBalancerListenerSSLCertificateInput {
  LoadBalancerName: string;
  LoadBalancerPort: number;
  SSLCertificateId: string;
}
export const SetLoadBalancerListenerSSLCertificateInput = S.suspend(() =>
  S.Struct({
    LoadBalancerName: S.String,
    LoadBalancerPort: S.Number,
    SSLCertificateId: S.String,
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
  identifier: "SetLoadBalancerListenerSSLCertificateInput",
}) as any as S.Schema<SetLoadBalancerListenerSSLCertificateInput>;
export interface SetLoadBalancerListenerSSLCertificateOutput {}
export const SetLoadBalancerListenerSSLCertificateOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetLoadBalancerListenerSSLCertificateOutput",
}) as any as S.Schema<SetLoadBalancerListenerSSLCertificateOutput>;
export interface SetLoadBalancerPoliciesForBackendServerInput {
  LoadBalancerName: string;
  InstancePort: number;
  PolicyNames: PolicyNames;
}
export const SetLoadBalancerPoliciesForBackendServerInput = S.suspend(() =>
  S.Struct({
    LoadBalancerName: S.String,
    InstancePort: S.Number,
    PolicyNames: PolicyNames,
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
  identifier: "SetLoadBalancerPoliciesForBackendServerInput",
}) as any as S.Schema<SetLoadBalancerPoliciesForBackendServerInput>;
export interface SetLoadBalancerPoliciesForBackendServerOutput {}
export const SetLoadBalancerPoliciesForBackendServerOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetLoadBalancerPoliciesForBackendServerOutput",
}) as any as S.Schema<SetLoadBalancerPoliciesForBackendServerOutput>;
export interface SetLoadBalancerPoliciesOfListenerInput {
  LoadBalancerName: string;
  LoadBalancerPort: number;
  PolicyNames: PolicyNames;
}
export const SetLoadBalancerPoliciesOfListenerInput = S.suspend(() =>
  S.Struct({
    LoadBalancerName: S.String,
    LoadBalancerPort: S.Number,
    PolicyNames: PolicyNames,
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
  identifier: "SetLoadBalancerPoliciesOfListenerInput",
}) as any as S.Schema<SetLoadBalancerPoliciesOfListenerInput>;
export interface SetLoadBalancerPoliciesOfListenerOutput {}
export const SetLoadBalancerPoliciesOfListenerOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetLoadBalancerPoliciesOfListenerOutput",
}) as any as S.Schema<SetLoadBalancerPoliciesOfListenerOutput>;
export interface Tag {
  Key: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface HealthCheck {
  Target: string;
  Interval: number;
  Timeout: number;
  UnhealthyThreshold: number;
  HealthyThreshold: number;
}
export const HealthCheck = S.suspend(() =>
  S.Struct({
    Target: S.String,
    Interval: S.Number,
    Timeout: S.Number,
    UnhealthyThreshold: S.Number,
    HealthyThreshold: S.Number,
  }),
).annotations({ identifier: "HealthCheck" }) as any as S.Schema<HealthCheck>;
export interface PolicyAttribute {
  AttributeName?: string;
  AttributeValue?: string;
}
export const PolicyAttribute = S.suspend(() =>
  S.Struct({
    AttributeName: S.optional(S.String),
    AttributeValue: S.optional(S.String),
  }),
).annotations({
  identifier: "PolicyAttribute",
}) as any as S.Schema<PolicyAttribute>;
export type PolicyAttributes = PolicyAttribute[];
export const PolicyAttributes = S.Array(PolicyAttribute);
export interface TagKeyOnly {
  Key?: string;
}
export const TagKeyOnly = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String) }),
).annotations({ identifier: "TagKeyOnly" }) as any as S.Schema<TagKeyOnly>;
export type TagKeyList = TagKeyOnly[];
export const TagKeyList = S.Array(TagKeyOnly);
export interface AddTagsInput {
  LoadBalancerNames: LoadBalancerNames;
  Tags: TagList;
}
export const AddTagsInput = S.suspend(() =>
  S.Struct({ LoadBalancerNames: LoadBalancerNames, Tags: TagList }).pipe(
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
export interface ApplySecurityGroupsToLoadBalancerOutput {
  SecurityGroups?: SecurityGroups;
}
export const ApplySecurityGroupsToLoadBalancerOutput = S.suspend(() =>
  S.Struct({ SecurityGroups: S.optional(SecurityGroups) }).pipe(ns),
).annotations({
  identifier: "ApplySecurityGroupsToLoadBalancerOutput",
}) as any as S.Schema<ApplySecurityGroupsToLoadBalancerOutput>;
export interface AttachLoadBalancerToSubnetsOutput {
  Subnets?: Subnets;
}
export const AttachLoadBalancerToSubnetsOutput = S.suspend(() =>
  S.Struct({ Subnets: S.optional(Subnets) }).pipe(ns),
).annotations({
  identifier: "AttachLoadBalancerToSubnetsOutput",
}) as any as S.Schema<AttachLoadBalancerToSubnetsOutput>;
export interface ConfigureHealthCheckInput {
  LoadBalancerName: string;
  HealthCheck: HealthCheck;
}
export const ConfigureHealthCheckInput = S.suspend(() =>
  S.Struct({ LoadBalancerName: S.String, HealthCheck: HealthCheck }).pipe(
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
  identifier: "ConfigureHealthCheckInput",
}) as any as S.Schema<ConfigureHealthCheckInput>;
export interface CreateAccessPointInput {
  LoadBalancerName: string;
  Listeners: Listeners;
  AvailabilityZones?: AvailabilityZones;
  Subnets?: Subnets;
  SecurityGroups?: SecurityGroups;
  Scheme?: string;
  Tags?: TagList;
}
export const CreateAccessPointInput = S.suspend(() =>
  S.Struct({
    LoadBalancerName: S.String,
    Listeners: Listeners,
    AvailabilityZones: S.optional(AvailabilityZones),
    Subnets: S.optional(Subnets),
    SecurityGroups: S.optional(SecurityGroups),
    Scheme: S.optional(S.String),
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
  identifier: "CreateAccessPointInput",
}) as any as S.Schema<CreateAccessPointInput>;
export interface CreateLoadBalancerPolicyInput {
  LoadBalancerName: string;
  PolicyName: string;
  PolicyTypeName: string;
  PolicyAttributes?: PolicyAttributes;
}
export const CreateLoadBalancerPolicyInput = S.suspend(() =>
  S.Struct({
    LoadBalancerName: S.String,
    PolicyName: S.String,
    PolicyTypeName: S.String,
    PolicyAttributes: S.optional(PolicyAttributes),
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
  identifier: "CreateLoadBalancerPolicyInput",
}) as any as S.Schema<CreateLoadBalancerPolicyInput>;
export interface CreateLoadBalancerPolicyOutput {}
export const CreateLoadBalancerPolicyOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateLoadBalancerPolicyOutput",
}) as any as S.Schema<CreateLoadBalancerPolicyOutput>;
export interface DeregisterEndPointsInput {
  LoadBalancerName: string;
  Instances: Instances;
}
export const DeregisterEndPointsInput = S.suspend(() =>
  S.Struct({ LoadBalancerName: S.String, Instances: Instances }).pipe(
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
  identifier: "DeregisterEndPointsInput",
}) as any as S.Schema<DeregisterEndPointsInput>;
export interface CrossZoneLoadBalancing {
  Enabled: boolean;
}
export const CrossZoneLoadBalancing = S.suspend(() =>
  S.Struct({ Enabled: S.Boolean }),
).annotations({
  identifier: "CrossZoneLoadBalancing",
}) as any as S.Schema<CrossZoneLoadBalancing>;
export interface AccessLog {
  Enabled: boolean;
  S3BucketName?: string;
  EmitInterval?: number;
  S3BucketPrefix?: string;
}
export const AccessLog = S.suspend(() =>
  S.Struct({
    Enabled: S.Boolean,
    S3BucketName: S.optional(S.String),
    EmitInterval: S.optional(S.Number),
    S3BucketPrefix: S.optional(S.String),
  }),
).annotations({ identifier: "AccessLog" }) as any as S.Schema<AccessLog>;
export interface ConnectionDraining {
  Enabled: boolean;
  Timeout?: number;
}
export const ConnectionDraining = S.suspend(() =>
  S.Struct({ Enabled: S.Boolean, Timeout: S.optional(S.Number) }),
).annotations({
  identifier: "ConnectionDraining",
}) as any as S.Schema<ConnectionDraining>;
export interface ConnectionSettings {
  IdleTimeout: number;
}
export const ConnectionSettings = S.suspend(() =>
  S.Struct({ IdleTimeout: S.Number }),
).annotations({
  identifier: "ConnectionSettings",
}) as any as S.Schema<ConnectionSettings>;
export interface AdditionalAttribute {
  Key?: string;
  Value?: string;
}
export const AdditionalAttribute = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "AdditionalAttribute",
}) as any as S.Schema<AdditionalAttribute>;
export type AdditionalAttributes = AdditionalAttribute[];
export const AdditionalAttributes = S.Array(AdditionalAttribute);
export interface LoadBalancerAttributes {
  CrossZoneLoadBalancing?: CrossZoneLoadBalancing;
  AccessLog?: AccessLog;
  ConnectionDraining?: ConnectionDraining;
  ConnectionSettings?: ConnectionSettings;
  AdditionalAttributes?: AdditionalAttributes;
}
export const LoadBalancerAttributes = S.suspend(() =>
  S.Struct({
    CrossZoneLoadBalancing: S.optional(CrossZoneLoadBalancing),
    AccessLog: S.optional(AccessLog),
    ConnectionDraining: S.optional(ConnectionDraining),
    ConnectionSettings: S.optional(ConnectionSettings),
    AdditionalAttributes: S.optional(AdditionalAttributes),
  }),
).annotations({
  identifier: "LoadBalancerAttributes",
}) as any as S.Schema<LoadBalancerAttributes>;
export interface DescribeLoadBalancerAttributesOutput {
  LoadBalancerAttributes?: LoadBalancerAttributes;
}
export const DescribeLoadBalancerAttributesOutput = S.suspend(() =>
  S.Struct({ LoadBalancerAttributes: S.optional(LoadBalancerAttributes) }).pipe(
    ns,
  ),
).annotations({
  identifier: "DescribeLoadBalancerAttributesOutput",
}) as any as S.Schema<DescribeLoadBalancerAttributesOutput>;
export interface DetachLoadBalancerFromSubnetsOutput {
  Subnets?: Subnets;
}
export const DetachLoadBalancerFromSubnetsOutput = S.suspend(() =>
  S.Struct({ Subnets: S.optional(Subnets) }).pipe(ns),
).annotations({
  identifier: "DetachLoadBalancerFromSubnetsOutput",
}) as any as S.Schema<DetachLoadBalancerFromSubnetsOutput>;
export interface RemoveAvailabilityZonesOutput {
  AvailabilityZones?: AvailabilityZones;
}
export const RemoveAvailabilityZonesOutput = S.suspend(() =>
  S.Struct({ AvailabilityZones: S.optional(AvailabilityZones) }).pipe(ns),
).annotations({
  identifier: "RemoveAvailabilityZonesOutput",
}) as any as S.Schema<RemoveAvailabilityZonesOutput>;
export interface AddAvailabilityZonesOutput {
  AvailabilityZones?: AvailabilityZones;
}
export const AddAvailabilityZonesOutput = S.suspend(() =>
  S.Struct({ AvailabilityZones: S.optional(AvailabilityZones) }).pipe(ns),
).annotations({
  identifier: "AddAvailabilityZonesOutput",
}) as any as S.Schema<AddAvailabilityZonesOutput>;
export interface RegisterEndPointsOutput {
  Instances?: Instances;
}
export const RegisterEndPointsOutput = S.suspend(() =>
  S.Struct({ Instances: S.optional(Instances) }).pipe(ns),
).annotations({
  identifier: "RegisterEndPointsOutput",
}) as any as S.Schema<RegisterEndPointsOutput>;
export interface RemoveTagsInput {
  LoadBalancerNames: LoadBalancerNames;
  Tags: TagKeyList;
}
export const RemoveTagsInput = S.suspend(() =>
  S.Struct({ LoadBalancerNames: LoadBalancerNames, Tags: TagKeyList }).pipe(
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
export interface Limit {
  Name?: string;
  Max?: string;
}
export const Limit = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Max: S.optional(S.String) }),
).annotations({ identifier: "Limit" }) as any as S.Schema<Limit>;
export type Limits = Limit[];
export const Limits = S.Array(Limit);
export interface InstanceState {
  InstanceId?: string;
  State?: string;
  ReasonCode?: string;
  Description?: string;
}
export const InstanceState = S.suspend(() =>
  S.Struct({
    InstanceId: S.optional(S.String),
    State: S.optional(S.String),
    ReasonCode: S.optional(S.String),
    Description: S.optional(S.String),
  }),
).annotations({
  identifier: "InstanceState",
}) as any as S.Schema<InstanceState>;
export type InstanceStates = InstanceState[];
export const InstanceStates = S.Array(InstanceState);
export interface TagDescription {
  LoadBalancerName?: string;
  Tags?: TagList;
}
export const TagDescription = S.suspend(() =>
  S.Struct({
    LoadBalancerName: S.optional(S.String),
    Tags: S.optional(TagList),
  }),
).annotations({
  identifier: "TagDescription",
}) as any as S.Schema<TagDescription>;
export type TagDescriptions = TagDescription[];
export const TagDescriptions = S.Array(TagDescription);
export interface ConfigureHealthCheckOutput {
  HealthCheck?: HealthCheck;
}
export const ConfigureHealthCheckOutput = S.suspend(() =>
  S.Struct({ HealthCheck: S.optional(HealthCheck) }).pipe(ns),
).annotations({
  identifier: "ConfigureHealthCheckOutput",
}) as any as S.Schema<ConfigureHealthCheckOutput>;
export interface CreateAccessPointOutput {
  DNSName?: string;
}
export const CreateAccessPointOutput = S.suspend(() =>
  S.Struct({ DNSName: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateAccessPointOutput",
}) as any as S.Schema<CreateAccessPointOutput>;
export interface DeregisterEndPointsOutput {
  Instances?: Instances;
}
export const DeregisterEndPointsOutput = S.suspend(() =>
  S.Struct({ Instances: S.optional(Instances) }).pipe(ns),
).annotations({
  identifier: "DeregisterEndPointsOutput",
}) as any as S.Schema<DeregisterEndPointsOutput>;
export interface DescribeAccountLimitsOutput {
  Limits?: Limits;
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
export interface DescribeEndPointStateOutput {
  InstanceStates?: InstanceStates;
}
export const DescribeEndPointStateOutput = S.suspend(() =>
  S.Struct({ InstanceStates: S.optional(InstanceStates) }).pipe(ns),
).annotations({
  identifier: "DescribeEndPointStateOutput",
}) as any as S.Schema<DescribeEndPointStateOutput>;
export interface DescribeTagsOutput {
  TagDescriptions?: TagDescriptions;
}
export const DescribeTagsOutput = S.suspend(() =>
  S.Struct({ TagDescriptions: S.optional(TagDescriptions) }).pipe(ns),
).annotations({
  identifier: "DescribeTagsOutput",
}) as any as S.Schema<DescribeTagsOutput>;
export interface ModifyLoadBalancerAttributesInput {
  LoadBalancerName: string;
  LoadBalancerAttributes: LoadBalancerAttributes;
}
export const ModifyLoadBalancerAttributesInput = S.suspend(() =>
  S.Struct({
    LoadBalancerName: S.String,
    LoadBalancerAttributes: LoadBalancerAttributes,
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
export interface PolicyAttributeDescription {
  AttributeName?: string;
  AttributeValue?: string;
}
export const PolicyAttributeDescription = S.suspend(() =>
  S.Struct({
    AttributeName: S.optional(S.String),
    AttributeValue: S.optional(S.String),
  }),
).annotations({
  identifier: "PolicyAttributeDescription",
}) as any as S.Schema<PolicyAttributeDescription>;
export type PolicyAttributeDescriptions = PolicyAttributeDescription[];
export const PolicyAttributeDescriptions = S.Array(PolicyAttributeDescription);
export interface PolicyAttributeTypeDescription {
  AttributeName?: string;
  AttributeType?: string;
  Description?: string;
  DefaultValue?: string;
  Cardinality?: string;
}
export const PolicyAttributeTypeDescription = S.suspend(() =>
  S.Struct({
    AttributeName: S.optional(S.String),
    AttributeType: S.optional(S.String),
    Description: S.optional(S.String),
    DefaultValue: S.optional(S.String),
    Cardinality: S.optional(S.String),
  }),
).annotations({
  identifier: "PolicyAttributeTypeDescription",
}) as any as S.Schema<PolicyAttributeTypeDescription>;
export type PolicyAttributeTypeDescriptions = PolicyAttributeTypeDescription[];
export const PolicyAttributeTypeDescriptions = S.Array(
  PolicyAttributeTypeDescription,
);
export interface ListenerDescription {
  Listener?: Listener;
  PolicyNames?: PolicyNames;
}
export const ListenerDescription = S.suspend(() =>
  S.Struct({
    Listener: S.optional(Listener),
    PolicyNames: S.optional(PolicyNames),
  }),
).annotations({
  identifier: "ListenerDescription",
}) as any as S.Schema<ListenerDescription>;
export type ListenerDescriptions = ListenerDescription[];
export const ListenerDescriptions = S.Array(ListenerDescription);
export interface BackendServerDescription {
  InstancePort?: number;
  PolicyNames?: PolicyNames;
}
export const BackendServerDescription = S.suspend(() =>
  S.Struct({
    InstancePort: S.optional(S.Number),
    PolicyNames: S.optional(PolicyNames),
  }),
).annotations({
  identifier: "BackendServerDescription",
}) as any as S.Schema<BackendServerDescription>;
export type BackendServerDescriptions = BackendServerDescription[];
export const BackendServerDescriptions = S.Array(BackendServerDescription);
export interface SourceSecurityGroup {
  OwnerAlias?: string;
  GroupName?: string;
}
export const SourceSecurityGroup = S.suspend(() =>
  S.Struct({
    OwnerAlias: S.optional(S.String),
    GroupName: S.optional(S.String),
  }),
).annotations({
  identifier: "SourceSecurityGroup",
}) as any as S.Schema<SourceSecurityGroup>;
export interface PolicyDescription {
  PolicyName?: string;
  PolicyTypeName?: string;
  PolicyAttributeDescriptions?: PolicyAttributeDescriptions;
}
export const PolicyDescription = S.suspend(() =>
  S.Struct({
    PolicyName: S.optional(S.String),
    PolicyTypeName: S.optional(S.String),
    PolicyAttributeDescriptions: S.optional(PolicyAttributeDescriptions),
  }),
).annotations({
  identifier: "PolicyDescription",
}) as any as S.Schema<PolicyDescription>;
export type PolicyDescriptions = PolicyDescription[];
export const PolicyDescriptions = S.Array(PolicyDescription);
export interface PolicyTypeDescription {
  PolicyTypeName?: string;
  Description?: string;
  PolicyAttributeTypeDescriptions?: PolicyAttributeTypeDescriptions;
}
export const PolicyTypeDescription = S.suspend(() =>
  S.Struct({
    PolicyTypeName: S.optional(S.String),
    Description: S.optional(S.String),
    PolicyAttributeTypeDescriptions: S.optional(
      PolicyAttributeTypeDescriptions,
    ),
  }),
).annotations({
  identifier: "PolicyTypeDescription",
}) as any as S.Schema<PolicyTypeDescription>;
export type PolicyTypeDescriptions = PolicyTypeDescription[];
export const PolicyTypeDescriptions = S.Array(PolicyTypeDescription);
export interface AppCookieStickinessPolicy {
  PolicyName?: string;
  CookieName?: string;
}
export const AppCookieStickinessPolicy = S.suspend(() =>
  S.Struct({
    PolicyName: S.optional(S.String),
    CookieName: S.optional(S.String),
  }),
).annotations({
  identifier: "AppCookieStickinessPolicy",
}) as any as S.Schema<AppCookieStickinessPolicy>;
export type AppCookieStickinessPolicies = AppCookieStickinessPolicy[];
export const AppCookieStickinessPolicies = S.Array(AppCookieStickinessPolicy);
export interface LBCookieStickinessPolicy {
  PolicyName?: string;
  CookieExpirationPeriod?: number;
}
export const LBCookieStickinessPolicy = S.suspend(() =>
  S.Struct({
    PolicyName: S.optional(S.String),
    CookieExpirationPeriod: S.optional(S.Number),
  }),
).annotations({
  identifier: "LBCookieStickinessPolicy",
}) as any as S.Schema<LBCookieStickinessPolicy>;
export type LBCookieStickinessPolicies = LBCookieStickinessPolicy[];
export const LBCookieStickinessPolicies = S.Array(LBCookieStickinessPolicy);
export interface DescribeLoadBalancerPoliciesOutput {
  PolicyDescriptions?: PolicyDescriptions;
}
export const DescribeLoadBalancerPoliciesOutput = S.suspend(() =>
  S.Struct({ PolicyDescriptions: S.optional(PolicyDescriptions) }).pipe(ns),
).annotations({
  identifier: "DescribeLoadBalancerPoliciesOutput",
}) as any as S.Schema<DescribeLoadBalancerPoliciesOutput>;
export interface DescribeLoadBalancerPolicyTypesOutput {
  PolicyTypeDescriptions?: PolicyTypeDescriptions;
}
export const DescribeLoadBalancerPolicyTypesOutput = S.suspend(() =>
  S.Struct({ PolicyTypeDescriptions: S.optional(PolicyTypeDescriptions) }).pipe(
    ns,
  ),
).annotations({
  identifier: "DescribeLoadBalancerPolicyTypesOutput",
}) as any as S.Schema<DescribeLoadBalancerPolicyTypesOutput>;
export interface ModifyLoadBalancerAttributesOutput {
  LoadBalancerName?: string;
  LoadBalancerAttributes?: LoadBalancerAttributes;
}
export const ModifyLoadBalancerAttributesOutput = S.suspend(() =>
  S.Struct({
    LoadBalancerName: S.optional(S.String),
    LoadBalancerAttributes: S.optional(LoadBalancerAttributes),
  }).pipe(ns),
).annotations({
  identifier: "ModifyLoadBalancerAttributesOutput",
}) as any as S.Schema<ModifyLoadBalancerAttributesOutput>;
export interface Policies {
  AppCookieStickinessPolicies?: AppCookieStickinessPolicies;
  LBCookieStickinessPolicies?: LBCookieStickinessPolicies;
  OtherPolicies?: PolicyNames;
}
export const Policies = S.suspend(() =>
  S.Struct({
    AppCookieStickinessPolicies: S.optional(AppCookieStickinessPolicies),
    LBCookieStickinessPolicies: S.optional(LBCookieStickinessPolicies),
    OtherPolicies: S.optional(PolicyNames),
  }),
).annotations({ identifier: "Policies" }) as any as S.Schema<Policies>;
export interface LoadBalancerDescription {
  LoadBalancerName?: string;
  DNSName?: string;
  CanonicalHostedZoneName?: string;
  CanonicalHostedZoneNameID?: string;
  ListenerDescriptions?: ListenerDescriptions;
  Policies?: Policies;
  BackendServerDescriptions?: BackendServerDescriptions;
  AvailabilityZones?: AvailabilityZones;
  Subnets?: Subnets;
  VPCId?: string;
  Instances?: Instances;
  HealthCheck?: HealthCheck;
  SourceSecurityGroup?: SourceSecurityGroup;
  SecurityGroups?: SecurityGroups;
  CreatedTime?: Date;
  Scheme?: string;
}
export const LoadBalancerDescription = S.suspend(() =>
  S.Struct({
    LoadBalancerName: S.optional(S.String),
    DNSName: S.optional(S.String),
    CanonicalHostedZoneName: S.optional(S.String),
    CanonicalHostedZoneNameID: S.optional(S.String),
    ListenerDescriptions: S.optional(ListenerDescriptions),
    Policies: S.optional(Policies),
    BackendServerDescriptions: S.optional(BackendServerDescriptions),
    AvailabilityZones: S.optional(AvailabilityZones),
    Subnets: S.optional(Subnets),
    VPCId: S.optional(S.String),
    Instances: S.optional(Instances),
    HealthCheck: S.optional(HealthCheck),
    SourceSecurityGroup: S.optional(SourceSecurityGroup),
    SecurityGroups: S.optional(SecurityGroups),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Scheme: S.optional(S.String),
  }),
).annotations({
  identifier: "LoadBalancerDescription",
}) as any as S.Schema<LoadBalancerDescription>;
export type LoadBalancerDescriptions = LoadBalancerDescription[];
export const LoadBalancerDescriptions = S.Array(LoadBalancerDescription);
export interface DescribeAccessPointsOutput {
  LoadBalancerDescriptions?: LoadBalancerDescriptions;
  NextMarker?: string;
}
export const DescribeAccessPointsOutput = S.suspend(() =>
  S.Struct({
    LoadBalancerDescriptions: S.optional(LoadBalancerDescriptions),
    NextMarker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeAccessPointsOutput",
}) as any as S.Schema<DescribeAccessPointsOutput>;

//# Errors
export class AccessPointNotFoundException extends S.TaggedError<AccessPointNotFoundException>()(
  "AccessPointNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "LoadBalancerNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DuplicatePolicyNameException extends S.TaggedError<DuplicatePolicyNameException>()(
  "DuplicatePolicyNameException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "DuplicatePolicyName", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class LoadBalancerAttributeNotFoundException extends S.TaggedError<LoadBalancerAttributeNotFoundException>()(
  "LoadBalancerAttributeNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "LoadBalancerAttributeNotFound",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidConfigurationRequestException extends S.TaggedError<InvalidConfigurationRequestException>()(
  "InvalidConfigurationRequestException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidConfigurationRequest",
    httpResponseCode: 409,
  }),
).pipe(C.withConflictError) {}
export class InvalidEndPointException extends S.TaggedError<InvalidEndPointException>()(
  "InvalidEndPointException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidInstance", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class CertificateNotFoundException extends S.TaggedError<CertificateNotFoundException>()(
  "CertificateNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "CertificateNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DuplicateTagKeysException extends S.TaggedError<DuplicateTagKeysException>()(
  "DuplicateTagKeysException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "DuplicateTagKeys", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DuplicateListenerException extends S.TaggedError<DuplicateListenerException>()(
  "DuplicateListenerException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "DuplicateListener", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyTags", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class PolicyTypeNotFoundException extends S.TaggedError<PolicyTypeNotFoundException>()(
  "PolicyTypeNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "PolicyTypeNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TooManyPoliciesException extends S.TaggedError<TooManyPoliciesException>()(
  "TooManyPoliciesException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyPolicies", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class PolicyNotFoundException extends S.TaggedError<PolicyNotFoundException>()(
  "PolicyNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "PolicyNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ListenerNotFoundException extends S.TaggedError<ListenerNotFoundException>()(
  "ListenerNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ListenerNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidSecurityGroupException extends S.TaggedError<InvalidSecurityGroupException>()(
  "InvalidSecurityGroupException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSecurityGroup", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidSubnetException extends S.TaggedError<InvalidSubnetException>()(
  "InvalidSubnetException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSubnet", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DuplicateAccessPointNameException extends S.TaggedError<DuplicateAccessPointNameException>()(
  "DuplicateAccessPointNameException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "DuplicateLoadBalancerName", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class UnsupportedProtocolException extends S.TaggedError<UnsupportedProtocolException>()(
  "UnsupportedProtocolException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "UnsupportedProtocol", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class SubnetNotFoundException extends S.TaggedError<SubnetNotFoundException>()(
  "SubnetNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidSchemeException extends S.TaggedError<InvalidSchemeException>()(
  "InvalidSchemeException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidScheme", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DependencyThrottleException extends S.TaggedError<DependencyThrottleException>()(
  "DependencyThrottleException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "DependencyThrottle", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class OperationNotPermittedException extends S.TaggedError<OperationNotPermittedException>()(
  "OperationNotPermittedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "OperationNotPermitted", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TooManyAccessPointsException extends S.TaggedError<TooManyAccessPointsException>()(
  "TooManyAccessPointsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyLoadBalancers", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Deletes the specified load balancer.
 *
 * If you are attempting to recreate a load balancer, you must reconfigure all settings. The DNS name associated with a deleted load balancer are no longer usable. The name and associated DNS record of the deleted load balancer no longer exist and traffic sent to any of its IP addresses is no longer delivered to your instances.
 *
 * If the load balancer does not exist or has already been deleted, the call to
 * `DeleteLoadBalancer` still succeeds.
 */
export const deleteLoadBalancer: (
  input: DeleteAccessPointInput,
) => Effect.Effect<
  DeleteAccessPointOutput,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessPointInput,
  output: DeleteAccessPointOutput,
  errors: [],
}));
/**
 * Adds the specified Availability Zones to the set of Availability Zones for the specified load balancer
 * in EC2-Classic or a default VPC.
 *
 * For load balancers in a non-default VPC, use AttachLoadBalancerToSubnets.
 *
 * The load balancer evenly distributes requests across all its registered Availability Zones
 * that contain instances. For more information, see Add or Remove Availability Zones
 * in the *Classic Load Balancers Guide*.
 */
export const enableAvailabilityZonesForLoadBalancer: (
  input: AddAvailabilityZonesInput,
) => Effect.Effect<
  AddAvailabilityZonesOutput,
  AccessPointNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddAvailabilityZonesInput,
  output: AddAvailabilityZonesOutput,
  errors: [AccessPointNotFoundException],
}));
/**
 * Removes one or more tags from the specified load balancer.
 */
export const removeTags: (
  input: RemoveTagsInput,
) => Effect.Effect<
  RemoveTagsOutput,
  AccessPointNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveTagsInput,
  output: RemoveTagsOutput,
  errors: [AccessPointNotFoundException],
}));
/**
 * Deletes the specified listeners from the specified load balancer.
 */
export const deleteLoadBalancerListeners: (
  input: DeleteLoadBalancerListenerInput,
) => Effect.Effect<
  DeleteLoadBalancerListenerOutput,
  AccessPointNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLoadBalancerListenerInput,
  output: DeleteLoadBalancerListenerOutput,
  errors: [AccessPointNotFoundException],
}));
/**
 * Specifies the health check settings to use when evaluating the health state of your EC2 instances.
 *
 * For more information, see Configure Health Checks for Your Load Balancer
 * in the *Classic Load Balancers Guide*.
 */
export const configureHealthCheck: (
  input: ConfigureHealthCheckInput,
) => Effect.Effect<
  ConfigureHealthCheckOutput,
  AccessPointNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ConfigureHealthCheckInput,
  output: ConfigureHealthCheckOutput,
  errors: [AccessPointNotFoundException],
}));
/**
 * Describes the current Elastic Load Balancing resource limits for your AWS account.
 *
 * For more information, see Limits for Your Classic Load Balancer
 * in the *Classic Load Balancers Guide*.
 */
export const describeAccountLimits: (
  input: DescribeAccountLimitsInput,
) => Effect.Effect<
  DescribeAccountLimitsOutput,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAccountLimitsInput,
  output: DescribeAccountLimitsOutput,
  errors: [],
}));
/**
 * Describes the attributes for the specified load balancer.
 */
export const describeLoadBalancerAttributes: (
  input: DescribeLoadBalancerAttributesInput,
) => Effect.Effect<
  DescribeLoadBalancerAttributesOutput,
  | AccessPointNotFoundException
  | LoadBalancerAttributeNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLoadBalancerAttributesInput,
  output: DescribeLoadBalancerAttributesOutput,
  errors: [
    AccessPointNotFoundException,
    LoadBalancerAttributeNotFoundException,
  ],
}));
/**
 * Describes the tags associated with the specified load balancers.
 */
export const describeTags: (
  input: DescribeTagsInput,
) => Effect.Effect<
  DescribeTagsOutput,
  AccessPointNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTagsInput,
  output: DescribeTagsOutput,
  errors: [AccessPointNotFoundException],
}));
/**
 * Removes the specified subnets from the set of configured subnets for the load balancer.
 *
 * After a subnet is removed, all EC2 instances registered with the load balancer
 * in the removed subnet go into the `OutOfService` state. Then,
 * the load balancer balances the traffic among the remaining routable subnets.
 */
export const detachLoadBalancerFromSubnets: (
  input: DetachLoadBalancerFromSubnetsInput,
) => Effect.Effect<
  DetachLoadBalancerFromSubnetsOutput,
  | AccessPointNotFoundException
  | InvalidConfigurationRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachLoadBalancerFromSubnetsInput,
  output: DetachLoadBalancerFromSubnetsOutput,
  errors: [AccessPointNotFoundException, InvalidConfigurationRequestException],
}));
/**
 * Adds the specified instances to the specified load balancer.
 *
 * The instance must be a running instance in the same network as the load balancer (EC2-Classic or the same VPC). If you have EC2-Classic instances and a load balancer in a VPC with ClassicLink enabled, you can link the EC2-Classic instances to that VPC and then register the linked EC2-Classic instances with the load balancer in the VPC.
 *
 * Note that `RegisterInstanceWithLoadBalancer` completes when the request has been registered.
 * Instance registration takes a little time to complete. To check the state of the registered instances, use
 * DescribeLoadBalancers or DescribeInstanceHealth.
 *
 * After the instance is registered, it starts receiving traffic
 * and requests from the load balancer. Any instance that is not
 * in one of the Availability Zones registered for the load balancer
 * is moved to the `OutOfService` state. If an Availability Zone
 * is added to the load balancer later, any instances registered with the
 * load balancer move to the `InService` state.
 *
 * To deregister instances from a load balancer, use DeregisterInstancesFromLoadBalancer.
 *
 * For more information, see Register or De-Register EC2 Instances
 * in the *Classic Load Balancers Guide*.
 */
export const registerInstancesWithLoadBalancer: (
  input: RegisterEndPointsInput,
) => Effect.Effect<
  RegisterEndPointsOutput,
  AccessPointNotFoundException | InvalidEndPointException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterEndPointsInput,
  output: RegisterEndPointsOutput,
  errors: [AccessPointNotFoundException, InvalidEndPointException],
}));
/**
 * Removes the specified Availability Zones from the set of Availability Zones for the specified load balancer
 * in EC2-Classic or a default VPC.
 *
 * For load balancers in a non-default VPC, use DetachLoadBalancerFromSubnets.
 *
 * There must be at least one Availability Zone registered with a load balancer at all times.
 * After an Availability Zone is removed, all instances registered with the load balancer that are in the removed
 * Availability Zone go into the `OutOfService` state. Then, the load balancer attempts to equally balance
 * the traffic among its remaining Availability Zones.
 *
 * For more information, see Add or Remove Availability Zones
 * in the *Classic Load Balancers Guide*.
 */
export const disableAvailabilityZonesForLoadBalancer: (
  input: RemoveAvailabilityZonesInput,
) => Effect.Effect<
  RemoveAvailabilityZonesOutput,
  | AccessPointNotFoundException
  | InvalidConfigurationRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveAvailabilityZonesInput,
  output: RemoveAvailabilityZonesOutput,
  errors: [AccessPointNotFoundException, InvalidConfigurationRequestException],
}));
/**
 * Deletes the specified policy from the specified load balancer. This policy must not be enabled for any listeners.
 */
export const deleteLoadBalancerPolicy: (
  input: DeleteLoadBalancerPolicyInput,
) => Effect.Effect<
  DeleteLoadBalancerPolicyOutput,
  | AccessPointNotFoundException
  | InvalidConfigurationRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLoadBalancerPolicyInput,
  output: DeleteLoadBalancerPolicyOutput,
  errors: [AccessPointNotFoundException, InvalidConfigurationRequestException],
}));
/**
 * Deregisters the specified instances from the specified load balancer. After the instance is deregistered, it no longer receives traffic from the load balancer.
 *
 * You can use DescribeLoadBalancers to verify that the instance is deregistered from the load balancer.
 *
 * For more information, see Register or De-Register EC2 Instances
 * in the *Classic Load Balancers Guide*.
 */
export const deregisterInstancesFromLoadBalancer: (
  input: DeregisterEndPointsInput,
) => Effect.Effect<
  DeregisterEndPointsOutput,
  AccessPointNotFoundException | InvalidEndPointException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterEndPointsInput,
  output: DeregisterEndPointsOutput,
  errors: [AccessPointNotFoundException, InvalidEndPointException],
}));
/**
 * Describes the state of the specified instances with respect to the specified load balancer. If no instances are specified, the call describes the state of all instances that are currently registered with the load balancer. If instances are specified, their state is returned even if they are no longer registered with the load balancer. The state of terminated instances is not returned.
 */
export const describeInstanceHealth: (
  input: DescribeEndPointStateInput,
) => Effect.Effect<
  DescribeEndPointStateOutput,
  AccessPointNotFoundException | InvalidEndPointException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEndPointStateInput,
  output: DescribeEndPointStateOutput,
  errors: [AccessPointNotFoundException, InvalidEndPointException],
}));
/**
 * Modifies the attributes of the specified load balancer.
 *
 * You can modify the load balancer attributes, such as `AccessLogs`, `ConnectionDraining`, and
 * `CrossZoneLoadBalancing` by either enabling or disabling them. Or, you can modify the load balancer attribute
 * `ConnectionSettings` by specifying an idle connection timeout value for your load balancer.
 *
 * For more information, see the following in the *Classic Load Balancers Guide*:
 *
 * - Cross-Zone Load Balancing
 *
 * - Connection Draining
 *
 * - Access Logs
 *
 * - Idle Connection Timeout
 */
export const modifyLoadBalancerAttributes: (
  input: ModifyLoadBalancerAttributesInput,
) => Effect.Effect<
  ModifyLoadBalancerAttributesOutput,
  | AccessPointNotFoundException
  | InvalidConfigurationRequestException
  | LoadBalancerAttributeNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyLoadBalancerAttributesInput,
  output: ModifyLoadBalancerAttributesOutput,
  errors: [
    AccessPointNotFoundException,
    InvalidConfigurationRequestException,
    LoadBalancerAttributeNotFoundException,
  ],
}));
/**
 * Adds the specified tags to the specified load balancer. Each load balancer can have a maximum of 10 tags.
 *
 * Each tag consists of a key and an optional value. If a tag with the same key is already associated
 * with the load balancer, `AddTags` updates its value.
 *
 * For more information, see Tag Your Classic Load Balancer
 * in the *Classic Load Balancers Guide*.
 */
export const addTags: (
  input: AddTagsInput,
) => Effect.Effect<
  AddTagsOutput,
  | AccessPointNotFoundException
  | DuplicateTagKeysException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsInput,
  output: AddTagsOutput,
  errors: [
    AccessPointNotFoundException,
    DuplicateTagKeysException,
    TooManyTagsException,
  ],
}));
/**
 * Generates a stickiness policy with sticky session lifetimes controlled by the lifetime of the browser (user-agent) or a specified expiration period. This policy can be associated only with HTTP/HTTPS listeners.
 *
 * When a load balancer implements this policy, the load balancer uses a special cookie to track the instance for each request. When the load balancer receives a request, it first checks to see if this cookie is present in the request.
 * If so, the load balancer sends the request to the application server specified in the cookie. If not, the load balancer sends the request to a server that is chosen based on the existing load-balancing algorithm.
 *
 * A cookie is inserted into the response for binding subsequent requests from the same user to that server. The validity of the cookie is based on the cookie expiration time, which is specified in the policy configuration.
 *
 * For more information, see Duration-Based Session Stickiness
 * in the *Classic Load Balancers Guide*.
 */
export const createLBCookieStickinessPolicy: (
  input: CreateLBCookieStickinessPolicyInput,
) => Effect.Effect<
  CreateLBCookieStickinessPolicyOutput,
  | AccessPointNotFoundException
  | DuplicatePolicyNameException
  | InvalidConfigurationRequestException
  | TooManyPoliciesException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLBCookieStickinessPolicyInput,
  output: CreateLBCookieStickinessPolicyOutput,
  errors: [
    AccessPointNotFoundException,
    DuplicatePolicyNameException,
    InvalidConfigurationRequestException,
    TooManyPoliciesException,
  ],
}));
/**
 * Replaces the set of policies associated with the specified port on which the EC2 instance is listening with a new set of policies.
 * At this time, only the back-end server authentication policy type can be applied to the instance ports; this policy type is composed of multiple public key policies.
 *
 * Each time you use `SetLoadBalancerPoliciesForBackendServer` to enable the policies,
 * use the `PolicyNames` parameter to list the policies that you want to enable.
 *
 * You can use DescribeLoadBalancers or DescribeLoadBalancerPolicies to verify that the policy
 * is associated with the EC2 instance.
 *
 * For more information about enabling back-end instance authentication, see Configure Back-end Instance Authentication
 * in the *Classic Load Balancers Guide*. For more information about Proxy Protocol, see
 * Configure Proxy Protocol Support
 * in the *Classic Load Balancers Guide*.
 */
export const setLoadBalancerPoliciesForBackendServer: (
  input: SetLoadBalancerPoliciesForBackendServerInput,
) => Effect.Effect<
  SetLoadBalancerPoliciesForBackendServerOutput,
  | AccessPointNotFoundException
  | InvalidConfigurationRequestException
  | PolicyNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetLoadBalancerPoliciesForBackendServerInput,
  output: SetLoadBalancerPoliciesForBackendServerOutput,
  errors: [
    AccessPointNotFoundException,
    InvalidConfigurationRequestException,
    PolicyNotFoundException,
  ],
}));
/**
 * Replaces the current set of policies for the specified load balancer port with the specified set of policies.
 *
 * To enable back-end server authentication, use SetLoadBalancerPoliciesForBackendServer.
 *
 * For more information about setting policies, see
 * Update the SSL Negotiation Configuration,
 * Duration-Based Session Stickiness, and
 * Application-Controlled Session Stickiness
 * in the *Classic Load Balancers Guide*.
 */
export const setLoadBalancerPoliciesOfListener: (
  input: SetLoadBalancerPoliciesOfListenerInput,
) => Effect.Effect<
  SetLoadBalancerPoliciesOfListenerOutput,
  | AccessPointNotFoundException
  | InvalidConfigurationRequestException
  | ListenerNotFoundException
  | PolicyNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetLoadBalancerPoliciesOfListenerInput,
  output: SetLoadBalancerPoliciesOfListenerOutput,
  errors: [
    AccessPointNotFoundException,
    InvalidConfigurationRequestException,
    ListenerNotFoundException,
    PolicyNotFoundException,
  ],
}));
/**
 * Associates one or more security groups with your load balancer in a virtual private cloud (VPC). The specified security groups override the previously associated security groups.
 *
 * For more information, see Security Groups for Load Balancers in a VPC
 * in the *Classic Load Balancers Guide*.
 */
export const applySecurityGroupsToLoadBalancer: (
  input: ApplySecurityGroupsToLoadBalancerInput,
) => Effect.Effect<
  ApplySecurityGroupsToLoadBalancerOutput,
  | AccessPointNotFoundException
  | InvalidConfigurationRequestException
  | InvalidSecurityGroupException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ApplySecurityGroupsToLoadBalancerInput,
  output: ApplySecurityGroupsToLoadBalancerOutput,
  errors: [
    AccessPointNotFoundException,
    InvalidConfigurationRequestException,
    InvalidSecurityGroupException,
  ],
}));
/**
 * Describes the specified load balancer policy types or all load balancer policy types.
 *
 * The description of each type indicates how it can be used. For example,
 * some policies can be used only with layer 7 listeners,
 * some policies can be used only with layer 4 listeners,
 * and some policies can be used only with your EC2 instances.
 *
 * You can use CreateLoadBalancerPolicy to create a policy configuration for any of these policy types.
 * Then, depending on the policy type, use either SetLoadBalancerPoliciesOfListener or
 * SetLoadBalancerPoliciesForBackendServer to set the policy.
 */
export const describeLoadBalancerPolicyTypes: (
  input: DescribeLoadBalancerPolicyTypesInput,
) => Effect.Effect<
  DescribeLoadBalancerPolicyTypesOutput,
  PolicyTypeNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLoadBalancerPolicyTypesInput,
  output: DescribeLoadBalancerPolicyTypesOutput,
  errors: [PolicyTypeNotFoundException],
}));
/**
 * Generates a stickiness policy with sticky session lifetimes that follow that of an application-generated cookie. This policy can be associated only with HTTP/HTTPS listeners.
 *
 * This policy is similar to the policy created by CreateLBCookieStickinessPolicy,
 * except that the lifetime of the special Elastic Load Balancing cookie, `AWSELB`,
 * follows the lifetime of the application-generated cookie specified in the policy configuration.
 * The load balancer only inserts a new stickiness cookie when the application response
 * includes a new application cookie.
 *
 * If the application cookie is explicitly removed or expires, the session stops being sticky until a new application cookie is issued.
 *
 * For more information, see Application-Controlled Session Stickiness
 * in the *Classic Load Balancers Guide*.
 */
export const createAppCookieStickinessPolicy: (
  input: CreateAppCookieStickinessPolicyInput,
) => Effect.Effect<
  CreateAppCookieStickinessPolicyOutput,
  | AccessPointNotFoundException
  | DuplicatePolicyNameException
  | InvalidConfigurationRequestException
  | TooManyPoliciesException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAppCookieStickinessPolicyInput,
  output: CreateAppCookieStickinessPolicyOutput,
  errors: [
    AccessPointNotFoundException,
    DuplicatePolicyNameException,
    InvalidConfigurationRequestException,
    TooManyPoliciesException,
  ],
}));
/**
 * Creates a policy with the specified attributes for the specified load balancer.
 *
 * Policies are settings that are saved for your load balancer and that can be applied to the listener or the application server, depending on the policy type.
 */
export const createLoadBalancerPolicy: (
  input: CreateLoadBalancerPolicyInput,
) => Effect.Effect<
  CreateLoadBalancerPolicyOutput,
  | AccessPointNotFoundException
  | DuplicatePolicyNameException
  | InvalidConfigurationRequestException
  | PolicyTypeNotFoundException
  | TooManyPoliciesException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLoadBalancerPolicyInput,
  output: CreateLoadBalancerPolicyOutput,
  errors: [
    AccessPointNotFoundException,
    DuplicatePolicyNameException,
    InvalidConfigurationRequestException,
    PolicyTypeNotFoundException,
    TooManyPoliciesException,
  ],
}));
/**
 * Describes the specified policies.
 *
 * If you specify a load balancer name, the action returns the descriptions of all policies created for the load balancer.
 * If you specify a policy name associated with your load balancer, the action returns the description of that policy.
 * If you don't specify a load balancer name, the action returns descriptions of the specified sample policies, or descriptions of all sample policies.
 * The names of the sample policies have the `ELBSample-` prefix.
 */
export const describeLoadBalancerPolicies: (
  input: DescribeLoadBalancerPoliciesInput,
) => Effect.Effect<
  DescribeLoadBalancerPoliciesOutput,
  AccessPointNotFoundException | PolicyNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLoadBalancerPoliciesInput,
  output: DescribeLoadBalancerPoliciesOutput,
  errors: [AccessPointNotFoundException, PolicyNotFoundException],
}));
/**
 * Creates one or more listeners for the specified load balancer. If a listener with the specified port does not already exist, it is created; otherwise, the properties of the new listener must match the properties of the existing listener.
 *
 * For more information, see Listeners for Your Classic Load Balancer
 * in the *Classic Load Balancers Guide*.
 */
export const createLoadBalancerListeners: (
  input: CreateLoadBalancerListenerInput,
) => Effect.Effect<
  CreateLoadBalancerListenerOutput,
  | AccessPointNotFoundException
  | CertificateNotFoundException
  | DuplicateListenerException
  | InvalidConfigurationRequestException
  | UnsupportedProtocolException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLoadBalancerListenerInput,
  output: CreateLoadBalancerListenerOutput,
  errors: [
    AccessPointNotFoundException,
    CertificateNotFoundException,
    DuplicateListenerException,
    InvalidConfigurationRequestException,
    UnsupportedProtocolException,
  ],
}));
/**
 * Adds one or more subnets to the set of configured subnets for the specified load balancer.
 *
 * The load balancer evenly distributes requests across all registered subnets.
 * For more information, see Add or Remove Subnets for Your Load Balancer in a VPC
 * in the *Classic Load Balancers Guide*.
 */
export const attachLoadBalancerToSubnets: (
  input: AttachLoadBalancerToSubnetsInput,
) => Effect.Effect<
  AttachLoadBalancerToSubnetsOutput,
  | AccessPointNotFoundException
  | InvalidConfigurationRequestException
  | InvalidSubnetException
  | SubnetNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachLoadBalancerToSubnetsInput,
  output: AttachLoadBalancerToSubnetsOutput,
  errors: [
    AccessPointNotFoundException,
    InvalidConfigurationRequestException,
    InvalidSubnetException,
    SubnetNotFoundException,
  ],
}));
/**
 * Sets the certificate that terminates the specified listener's SSL connections. The specified certificate replaces any prior certificate that was used on the same load balancer and port.
 *
 * For more information about updating your SSL certificate, see
 * Replace the SSL Certificate for Your Load Balancer
 * in the *Classic Load Balancers Guide*.
 */
export const setLoadBalancerListenerSSLCertificate: (
  input: SetLoadBalancerListenerSSLCertificateInput,
) => Effect.Effect<
  SetLoadBalancerListenerSSLCertificateOutput,
  | AccessPointNotFoundException
  | CertificateNotFoundException
  | InvalidConfigurationRequestException
  | ListenerNotFoundException
  | UnsupportedProtocolException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetLoadBalancerListenerSSLCertificateInput,
  output: SetLoadBalancerListenerSSLCertificateOutput,
  errors: [
    AccessPointNotFoundException,
    CertificateNotFoundException,
    InvalidConfigurationRequestException,
    ListenerNotFoundException,
    UnsupportedProtocolException,
  ],
}));
/**
 * Describes the specified the load balancers. If no load balancers are specified, the call describes all of your load balancers.
 */
export const describeLoadBalancers: {
  (
    input: DescribeAccessPointsInput,
  ): Effect.Effect<
    DescribeAccessPointsOutput,
    AccessPointNotFoundException | DependencyThrottleException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeAccessPointsInput,
  ) => Stream.Stream<
    DescribeAccessPointsOutput,
    AccessPointNotFoundException | DependencyThrottleException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeAccessPointsInput,
  ) => Stream.Stream<
    LoadBalancerDescription,
    AccessPointNotFoundException | DependencyThrottleException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeAccessPointsInput,
  output: DescribeAccessPointsOutput,
  errors: [AccessPointNotFoundException, DependencyThrottleException],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "LoadBalancerDescriptions",
  } as const,
}));
/**
 * Creates a Classic Load Balancer.
 *
 * You can add listeners, security groups, subnets, and tags when you create your load balancer,
 * or you can add them later using CreateLoadBalancerListeners,
 * ApplySecurityGroupsToLoadBalancer, AttachLoadBalancerToSubnets,
 * and AddTags.
 *
 * To describe your current load balancers, see DescribeLoadBalancers.
 * When you are finished with a load balancer, you can delete it using
 * DeleteLoadBalancer.
 *
 * You can create up to 20 load balancers per region per account.
 * You can request an increase for the number of load balancers for your account.
 * For more information, see Limits for Your Classic Load Balancer
 * in the *Classic Load Balancers Guide*.
 */
export const createLoadBalancer: (
  input: CreateAccessPointInput,
) => Effect.Effect<
  CreateAccessPointOutput,
  | CertificateNotFoundException
  | DuplicateAccessPointNameException
  | DuplicateTagKeysException
  | InvalidConfigurationRequestException
  | InvalidSchemeException
  | InvalidSecurityGroupException
  | InvalidSubnetException
  | OperationNotPermittedException
  | SubnetNotFoundException
  | TooManyAccessPointsException
  | TooManyTagsException
  | UnsupportedProtocolException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccessPointInput,
  output: CreateAccessPointOutput,
  errors: [
    CertificateNotFoundException,
    DuplicateAccessPointNameException,
    DuplicateTagKeysException,
    InvalidConfigurationRequestException,
    InvalidSchemeException,
    InvalidSecurityGroupException,
    InvalidSubnetException,
    OperationNotPermittedException,
    SubnetNotFoundException,
    TooManyAccessPointsException,
    TooManyTagsException,
    UnsupportedProtocolException,
  ],
}));
