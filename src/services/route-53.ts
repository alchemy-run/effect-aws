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
const ns = T.XmlNamespace("https://route53.amazonaws.com/doc/2013-04-01/");
const svc = T.AwsApiService({
  sdkId: "Route 53",
  serviceShapeName: "AWSDnsV20130401",
});
const auth = T.AwsAuthSigv4({ name: "route53" });
const ver = T.ServiceVersion("2013-04-01");
const proto = T.AwsProtocolsRestXml();
const rules = T.EndpointResolver((p, _) => {
  const { UseDualStack = false, UseFIPS = false, Endpoint, Region } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  const _p0 = () => ({
    authSchemes: [{ name: "sigv4", signingRegion: "us-east-1" }],
  });
  const _p1 = () => ({
    authSchemes: [{ name: "sigv4", signingRegion: "cn-northwest-1" }],
  });
  const _p2 = () => ({
    authSchemes: [{ name: "sigv4", signingRegion: "us-gov-west-1" }],
  });
  const _p3 = () => ({
    authSchemes: [{ name: "sigv4", signingRegion: "eusc-de-east-1" }],
  });
  const _p4 = (_0: unknown) => ({
    authSchemes: [
      {
        name: "sigv4",
        signingRegion: `${_.getAttr(_0, "implicitGlobalRegion")}`,
      },
    ],
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
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e("https://route53.amazonaws.com", _p0(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e("https://route53-fips.amazonaws.com", _p0(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e("https://route53.global.api.aws", _p0(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e("https://route53-fips.global.api.aws", _p0(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-cn" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e("https://route53.amazonaws.com.cn", _p1(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-cn" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            "https://route53.global.api.amazonwebservices.com.cn",
            _p1(),
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e("https://route53.us-gov.amazonaws.com", _p2(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e("https://route53.us-gov.amazonaws.com", _p2(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e("https://route53.us-gov.api.aws", _p2(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e("https://route53.us-gov.api.aws", _p2(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            "https://route53.c2s.ic.gov",
            {
              authSchemes: [{ name: "sigv4", signingRegion: "us-iso-east-1" }],
            },
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-b" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            "https://route53.sc2s.sgov.gov",
            {
              authSchemes: [{ name: "sigv4", signingRegion: "us-isob-east-1" }],
            },
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-e" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            "https://route53.cloud.adc-e.uk",
            {
              authSchemes: [{ name: "sigv4", signingRegion: "eu-isoe-west-1" }],
            },
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-f" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            "https://route53.csp.hci.ic.gov",
            {
              authSchemes: [
                { name: "sigv4", signingRegion: "us-isof-south-1" },
              ],
            },
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-eusc" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e("https://route53.amazonaws.eu", _p3(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-eusc" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            "https://route53.global.api.amazonwebservices.eu",
            _p3(),
            {},
          );
        }
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://route53-fips.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              _p4(PartitionResult),
              {},
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true && UseDualStack === false) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://route53-fips.${_.getAttr(PartitionResult, "dnsSuffix")}`,
              _p4(PartitionResult),
              {},
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseFIPS === false && UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://route53.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              _p4(PartitionResult),
              {},
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://route53.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          _p4(PartitionResult),
          {},
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ResourceId = string;
export type SigningKeyName = string;
export type AssociateVPCComment = string;
export type UUID = string;
export type CollectionVersion = number;
export type TagResourceId = string;
export type TagKey = string;
export type CollectionName = string;
export type CidrNonce = string;
export type HealthCheckNonce = string;
export type DNSName = string;
export type Nonce = string;
export type SigningKeyString = string;
export type SigningKeyStatus = string;
export type CloudWatchLogsLogGroupArn = string;
export type TrafficPolicyName = string;
export type TrafficPolicyDocument = string;
export type TrafficPolicyComment = string;
export type TTL = number;
export type TrafficPolicyId = string;
export type TrafficPolicyVersion = number;
export type HealthCheckId = string;
export type QueryLoggingConfigId = string;
export type TrafficPolicyInstanceId = string;
export type DisassociateVPCComment = string;
export type ChangeId = string;
export type IPAddressCidr = string;
export type GeoLocationContinentCode = string;
export type GeoLocationCountryCode = string;
export type GeoLocationSubdivisionCode = string;
export type HealthCheckCount = number;
export type HostedZoneCount = number;
export type TrafficPolicyInstanceCount = number;
export type CidrLocationNameDefaultNotAllowed = string;
export type PaginationToken = string;
export type PageMarker = string;
export type VPCId = string;
export type ResourceRecordSetIdentifier = string;
export type TrafficPolicyVersionMarker = string;
export type IPAddress = string;
export type SubnetMask = string;
export type HealthCheckVersion = number;
export type Port = number;
export type ResourcePath = string;
export type FullyQualifiedDomainName = string;
export type SearchString = string;
export type FailureThreshold = number;
export type Inverted = boolean;
export type Disabled = boolean;
export type HealthThreshold = number;
export type EnableSNI = boolean;
export type ResourceDescription = string;
export type AcceleratedRecoveryEnabled = boolean;
export type Cidr = string;
export type TagValue = string;
export type RequestInterval = number;
export type MeasureLatency = boolean;
export type RoutingControlArn = string;
export type IsPrivateZone = boolean;
export type AlarmName = string;
export type ResourceURI = string;
export type ErrorMessage = string;
export type UsageCount = number;
export type PageTruncated = boolean;
export type Nameserver = string;
export type RecordDataEntry = string;
export type DNSRCode = string;
export type TransportProtocol = string;
export type ARN = string;
export type SigningKeyInteger = number;
export type SigningKeyTag = number;
export type SigningKeyStatusMessage = string;
export type TrafficPolicyInstanceState = string;
export type Message = string;
export type LimitValue = number;
export type ServeSignature = string;
export type GeoLocationContinentName = string;
export type GeoLocationCountryName = string;
export type GeoLocationSubdivisionName = string;
export type HostedZoneRRSetCount = number;
export type CidrLocationNameDefaultAllowed = string;
export type ResourceRecordSetWeight = number;
export type ResourceRecordSetMultiValueAnswer = boolean;
export type ServicePrincipal = string;
export type EvaluationPeriods = number;
export type Threshold = number;
export type Period = number;
export type MetricName = string;
export type Namespace = string;
export type Status = string;
export type AWSAccountID = string;
export type HostedZoneOwningService = string;
export type RData = string;
export type AliasHealthEnabled = boolean;
export type AWSRegion = string;
export type LocalZoneGroup = string;
export type Bias = number;
export type DimensionField = string;
export type FailureReason = string;
export type Latitude = string;
export type Longitude = string;

//# Schemas
export interface GetCheckerIpRangesRequest {}
export const GetCheckerIpRangesRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2013-04-01/checkeripranges" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCheckerIpRangesRequest",
}) as any as S.Schema<GetCheckerIpRangesRequest>;
export interface GetHealthCheckCountRequest {}
export const GetHealthCheckCountRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2013-04-01/healthcheckcount" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetHealthCheckCountRequest",
}) as any as S.Schema<GetHealthCheckCountRequest>;
export interface GetHostedZoneCountRequest {}
export const GetHostedZoneCountRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2013-04-01/hostedzonecount" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetHostedZoneCountRequest",
}) as any as S.Schema<GetHostedZoneCountRequest>;
export interface GetTrafficPolicyInstanceCountRequest {}
export const GetTrafficPolicyInstanceCountRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2013-04-01/trafficpolicyinstancecount" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTrafficPolicyInstanceCountRequest",
}) as any as S.Schema<GetTrafficPolicyInstanceCountRequest>;
export type TagResourceType = "healthcheck" | "hostedzone";
export const TagResourceType = S.Literal("healthcheck", "hostedzone");
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String.pipe(T.XmlName("Key")));
export type AccountLimitType =
  | "MAX_HEALTH_CHECKS_BY_OWNER"
  | "MAX_HOSTED_ZONES_BY_OWNER"
  | "MAX_TRAFFIC_POLICY_INSTANCES_BY_OWNER"
  | "MAX_REUSABLE_DELEGATION_SETS_BY_OWNER"
  | "MAX_TRAFFIC_POLICIES_BY_OWNER";
export const AccountLimitType = S.Literal(
  "MAX_HEALTH_CHECKS_BY_OWNER",
  "MAX_HOSTED_ZONES_BY_OWNER",
  "MAX_TRAFFIC_POLICY_INSTANCES_BY_OWNER",
  "MAX_REUSABLE_DELEGATION_SETS_BY_OWNER",
  "MAX_TRAFFIC_POLICIES_BY_OWNER",
);
export type CheckerIpRanges = string[];
export const CheckerIpRanges = S.Array(S.String);
export type HostedZoneLimitType =
  | "MAX_RRSETS_BY_ZONE"
  | "MAX_VPCS_ASSOCIATED_BY_ZONE";
export const HostedZoneLimitType = S.Literal(
  "MAX_RRSETS_BY_ZONE",
  "MAX_VPCS_ASSOCIATED_BY_ZONE",
);
export type ReusableDelegationSetLimitType =
  "MAX_ZONES_BY_REUSABLE_DELEGATION_SET";
export const ReusableDelegationSetLimitType = S.Literal(
  "MAX_ZONES_BY_REUSABLE_DELEGATION_SET",
);
export type HostedZoneType = "PrivateHostedZone";
export const HostedZoneType = S.Literal("PrivateHostedZone");
export type VPCRegion =
  | "us-east-1"
  | "us-east-2"
  | "us-west-1"
  | "us-west-2"
  | "eu-west-1"
  | "eu-west-2"
  | "eu-west-3"
  | "eu-central-1"
  | "eu-central-2"
  | "ap-east-1"
  | "me-south-1"
  | "us-gov-west-1"
  | "us-gov-east-1"
  | "us-iso-east-1"
  | "us-iso-west-1"
  | "us-isob-east-1"
  | "me-central-1"
  | "ap-southeast-1"
  | "ap-southeast-2"
  | "ap-southeast-3"
  | "ap-south-1"
  | "ap-south-2"
  | "ap-northeast-1"
  | "ap-northeast-2"
  | "ap-northeast-3"
  | "eu-north-1"
  | "sa-east-1"
  | "ca-central-1"
  | "cn-north-1"
  | "cn-northwest-1"
  | "af-south-1"
  | "eu-south-1"
  | "eu-south-2"
  | "ap-southeast-4"
  | "il-central-1"
  | "ca-west-1"
  | "ap-southeast-5"
  | "mx-central-1"
  | "us-isof-south-1"
  | "us-isof-east-1"
  | "ap-southeast-7"
  | "ap-east-2"
  | "eu-isoe-west-1"
  | "ap-southeast-6"
  | "us-isob-west-1"
  | "eusc-de-east-1";
export const VPCRegion = S.Literal(
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "eu-central-1",
  "eu-central-2",
  "ap-east-1",
  "me-south-1",
  "us-gov-west-1",
  "us-gov-east-1",
  "us-iso-east-1",
  "us-iso-west-1",
  "us-isob-east-1",
  "me-central-1",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-southeast-3",
  "ap-south-1",
  "ap-south-2",
  "ap-northeast-1",
  "ap-northeast-2",
  "ap-northeast-3",
  "eu-north-1",
  "sa-east-1",
  "ca-central-1",
  "cn-north-1",
  "cn-northwest-1",
  "af-south-1",
  "eu-south-1",
  "eu-south-2",
  "ap-southeast-4",
  "il-central-1",
  "ca-west-1",
  "ap-southeast-5",
  "mx-central-1",
  "us-isof-south-1",
  "us-isof-east-1",
  "ap-southeast-7",
  "ap-east-2",
  "eu-isoe-west-1",
  "ap-southeast-6",
  "us-isob-west-1",
  "eusc-de-east-1",
);
export type RRType =
  | "SOA"
  | "A"
  | "TXT"
  | "NS"
  | "CNAME"
  | "MX"
  | "NAPTR"
  | "PTR"
  | "SRV"
  | "SPF"
  | "AAAA"
  | "CAA"
  | "DS"
  | "TLSA"
  | "SSHFP"
  | "SVCB"
  | "HTTPS";
export const RRType = S.Literal(
  "SOA",
  "A",
  "TXT",
  "NS",
  "CNAME",
  "MX",
  "NAPTR",
  "PTR",
  "SRV",
  "SPF",
  "AAAA",
  "CAA",
  "DS",
  "TLSA",
  "SSHFP",
  "SVCB",
  "HTTPS",
);
export type TagResourceIdList = string[];
export const TagResourceIdList = S.Array(
  S.String.pipe(T.XmlName("ResourceId")),
);
export type ChildHealthCheckList = string[];
export const ChildHealthCheckList = S.Array(
  S.String.pipe(T.XmlName("ChildHealthCheck")),
);
export type HealthCheckRegion =
  | "us-east-1"
  | "us-west-1"
  | "us-west-2"
  | "eu-west-1"
  | "ap-southeast-1"
  | "ap-southeast-2"
  | "ap-northeast-1"
  | "sa-east-1";
export const HealthCheckRegion = S.Literal(
  "us-east-1",
  "us-west-1",
  "us-west-2",
  "eu-west-1",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-northeast-1",
  "sa-east-1",
);
export type HealthCheckRegionList = HealthCheckRegion[];
export const HealthCheckRegionList = S.Array(
  HealthCheckRegion.pipe(T.XmlName("Region")),
);
export type InsufficientDataHealthStatus =
  | "Healthy"
  | "Unhealthy"
  | "LastKnownStatus";
export const InsufficientDataHealthStatus = S.Literal(
  "Healthy",
  "Unhealthy",
  "LastKnownStatus",
);
export type ResettableElementName =
  | "FullyQualifiedDomainName"
  | "Regions"
  | "ResourcePath"
  | "ChildHealthChecks";
export const ResettableElementName = S.Literal(
  "FullyQualifiedDomainName",
  "Regions",
  "ResourcePath",
  "ChildHealthChecks",
);
export type ResettableElementNameList = ResettableElementName[];
export const ResettableElementNameList = S.Array(
  ResettableElementName.pipe(T.XmlName("ResettableElementName")),
);
export interface ActivateKeySigningKeyRequest {
  HostedZoneId: string;
  Name: string;
}
export const ActivateKeySigningKeyRequest = S.suspend(() =>
  S.Struct({
    HostedZoneId: S.String.pipe(T.HttpLabel("HostedZoneId")),
    Name: S.String.pipe(T.HttpLabel("Name")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2013-04-01/keysigningkey/{HostedZoneId}/{Name}/activate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ActivateKeySigningKeyRequest",
}) as any as S.Schema<ActivateKeySigningKeyRequest>;
export interface CreateCidrCollectionRequest {
  Name: string;
  CallerReference: string;
}
export const CreateCidrCollectionRequest = S.suspend(() =>
  S.Struct({ Name: S.String, CallerReference: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2013-04-01/cidrcollection" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCidrCollectionRequest",
}) as any as S.Schema<CreateCidrCollectionRequest>;
export interface CreateKeySigningKeyRequest {
  CallerReference: string;
  HostedZoneId: string;
  KeyManagementServiceArn: string;
  Name: string;
  Status: string;
}
export const CreateKeySigningKeyRequest = S.suspend(() =>
  S.Struct({
    CallerReference: S.String,
    HostedZoneId: S.String,
    KeyManagementServiceArn: S.String,
    Name: S.String,
    Status: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2013-04-01/keysigningkey" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateKeySigningKeyRequest",
}) as any as S.Schema<CreateKeySigningKeyRequest>;
export interface CreateQueryLoggingConfigRequest {
  HostedZoneId: string;
  CloudWatchLogsLogGroupArn: string;
}
export const CreateQueryLoggingConfigRequest = S.suspend(() =>
  S.Struct({
    HostedZoneId: S.String,
    CloudWatchLogsLogGroupArn: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2013-04-01/queryloggingconfig" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateQueryLoggingConfigRequest",
}) as any as S.Schema<CreateQueryLoggingConfigRequest>;
export interface CreateReusableDelegationSetRequest {
  CallerReference: string;
  HostedZoneId?: string;
}
export const CreateReusableDelegationSetRequest = S.suspend(() =>
  S.Struct({
    CallerReference: S.String,
    HostedZoneId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2013-04-01/delegationset" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateReusableDelegationSetRequest",
}) as any as S.Schema<CreateReusableDelegationSetRequest>;
export interface CreateTrafficPolicyRequest {
  Name: string;
  Document: string;
  Comment?: string;
}
export const CreateTrafficPolicyRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Document: S.String,
    Comment: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2013-04-01/trafficpolicy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTrafficPolicyRequest",
}) as any as S.Schema<CreateTrafficPolicyRequest>;
export interface CreateTrafficPolicyInstanceRequest {
  HostedZoneId: string;
  Name: string;
  TTL: number;
  TrafficPolicyId: string;
  TrafficPolicyVersion: number;
}
export const CreateTrafficPolicyInstanceRequest = S.suspend(() =>
  S.Struct({
    HostedZoneId: S.String,
    Name: S.String,
    TTL: S.Number,
    TrafficPolicyId: S.String,
    TrafficPolicyVersion: S.Number,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2013-04-01/trafficpolicyinstance" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTrafficPolicyInstanceRequest",
}) as any as S.Schema<CreateTrafficPolicyInstanceRequest>;
export interface CreateTrafficPolicyVersionRequest {
  Id: string;
  Document: string;
  Comment?: string;
}
export const CreateTrafficPolicyVersionRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    Document: S.String,
    Comment: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2013-04-01/trafficpolicy/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTrafficPolicyVersionRequest",
}) as any as S.Schema<CreateTrafficPolicyVersionRequest>;
export interface VPC {
  VPCRegion?: VPCRegion;
  VPCId?: string;
}
export const VPC = S.suspend(() =>
  S.Struct({ VPCRegion: S.optional(VPCRegion), VPCId: S.optional(S.String) }),
).annotations({ identifier: "VPC" }) as any as S.Schema<VPC>;
export interface CreateVPCAssociationAuthorizationRequest {
  HostedZoneId: string;
  VPC: VPC;
}
export const CreateVPCAssociationAuthorizationRequest = S.suspend(() =>
  S.Struct({
    HostedZoneId: S.String.pipe(T.HttpLabel("HostedZoneId")),
    VPC: VPC,
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2013-04-01/hostedzone/{HostedZoneId}/authorizevpcassociation",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateVPCAssociationAuthorizationRequest",
}) as any as S.Schema<CreateVPCAssociationAuthorizationRequest>;
export interface DeactivateKeySigningKeyRequest {
  HostedZoneId: string;
  Name: string;
}
export const DeactivateKeySigningKeyRequest = S.suspend(() =>
  S.Struct({
    HostedZoneId: S.String.pipe(T.HttpLabel("HostedZoneId")),
    Name: S.String.pipe(T.HttpLabel("Name")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2013-04-01/keysigningkey/{HostedZoneId}/{Name}/deactivate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeactivateKeySigningKeyRequest",
}) as any as S.Schema<DeactivateKeySigningKeyRequest>;
export interface DeleteCidrCollectionRequest {
  Id: string;
}
export const DeleteCidrCollectionRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/2013-04-01/cidrcollection/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCidrCollectionRequest",
}) as any as S.Schema<DeleteCidrCollectionRequest>;
export interface DeleteCidrCollectionResponse {}
export const DeleteCidrCollectionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteCidrCollectionResponse",
}) as any as S.Schema<DeleteCidrCollectionResponse>;
export interface DeleteHealthCheckRequest {
  HealthCheckId: string;
}
export const DeleteHealthCheckRequest = S.suspend(() =>
  S.Struct({ HealthCheckId: S.String.pipe(T.HttpLabel("HealthCheckId")) }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/2013-04-01/healthcheck/{HealthCheckId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteHealthCheckRequest",
}) as any as S.Schema<DeleteHealthCheckRequest>;
export interface DeleteHealthCheckResponse {}
export const DeleteHealthCheckResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteHealthCheckResponse",
}) as any as S.Schema<DeleteHealthCheckResponse>;
export interface DeleteHostedZoneRequest {
  Id: string;
}
export const DeleteHostedZoneRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/2013-04-01/hostedzone/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteHostedZoneRequest",
}) as any as S.Schema<DeleteHostedZoneRequest>;
export interface DeleteKeySigningKeyRequest {
  HostedZoneId: string;
  Name: string;
}
export const DeleteKeySigningKeyRequest = S.suspend(() =>
  S.Struct({
    HostedZoneId: S.String.pipe(T.HttpLabel("HostedZoneId")),
    Name: S.String.pipe(T.HttpLabel("Name")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/2013-04-01/keysigningkey/{HostedZoneId}/{Name}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteKeySigningKeyRequest",
}) as any as S.Schema<DeleteKeySigningKeyRequest>;
export interface DeleteQueryLoggingConfigRequest {
  Id: string;
}
export const DeleteQueryLoggingConfigRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/2013-04-01/queryloggingconfig/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteQueryLoggingConfigRequest",
}) as any as S.Schema<DeleteQueryLoggingConfigRequest>;
export interface DeleteQueryLoggingConfigResponse {}
export const DeleteQueryLoggingConfigResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteQueryLoggingConfigResponse",
}) as any as S.Schema<DeleteQueryLoggingConfigResponse>;
export interface DeleteReusableDelegationSetRequest {
  Id: string;
}
export const DeleteReusableDelegationSetRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/2013-04-01/delegationset/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteReusableDelegationSetRequest",
}) as any as S.Schema<DeleteReusableDelegationSetRequest>;
export interface DeleteReusableDelegationSetResponse {}
export const DeleteReusableDelegationSetResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteReusableDelegationSetResponse",
}) as any as S.Schema<DeleteReusableDelegationSetResponse>;
export interface DeleteTrafficPolicyRequest {
  Id: string;
  Version: number;
}
export const DeleteTrafficPolicyRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    Version: S.Number.pipe(T.HttpLabel("Version")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/2013-04-01/trafficpolicy/{Id}/{Version}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTrafficPolicyRequest",
}) as any as S.Schema<DeleteTrafficPolicyRequest>;
export interface DeleteTrafficPolicyResponse {}
export const DeleteTrafficPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteTrafficPolicyResponse",
}) as any as S.Schema<DeleteTrafficPolicyResponse>;
export interface DeleteTrafficPolicyInstanceRequest {
  Id: string;
}
export const DeleteTrafficPolicyInstanceRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/2013-04-01/trafficpolicyinstance/{Id}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTrafficPolicyInstanceRequest",
}) as any as S.Schema<DeleteTrafficPolicyInstanceRequest>;
export interface DeleteTrafficPolicyInstanceResponse {}
export const DeleteTrafficPolicyInstanceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteTrafficPolicyInstanceResponse",
}) as any as S.Schema<DeleteTrafficPolicyInstanceResponse>;
export interface DeleteVPCAssociationAuthorizationRequest {
  HostedZoneId: string;
  VPC: VPC;
}
export const DeleteVPCAssociationAuthorizationRequest = S.suspend(() =>
  S.Struct({
    HostedZoneId: S.String.pipe(T.HttpLabel("HostedZoneId")),
    VPC: VPC,
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2013-04-01/hostedzone/{HostedZoneId}/deauthorizevpcassociation",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteVPCAssociationAuthorizationRequest",
}) as any as S.Schema<DeleteVPCAssociationAuthorizationRequest>;
export interface DeleteVPCAssociationAuthorizationResponse {}
export const DeleteVPCAssociationAuthorizationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteVPCAssociationAuthorizationResponse",
}) as any as S.Schema<DeleteVPCAssociationAuthorizationResponse>;
export interface DisableHostedZoneDNSSECRequest {
  HostedZoneId: string;
}
export const DisableHostedZoneDNSSECRequest = S.suspend(() =>
  S.Struct({ HostedZoneId: S.String.pipe(T.HttpLabel("HostedZoneId")) }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2013-04-01/hostedzone/{HostedZoneId}/disable-dnssec",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisableHostedZoneDNSSECRequest",
}) as any as S.Schema<DisableHostedZoneDNSSECRequest>;
export interface DisassociateVPCFromHostedZoneRequest {
  HostedZoneId: string;
  VPC: VPC;
  Comment?: string;
}
export const DisassociateVPCFromHostedZoneRequest = S.suspend(() =>
  S.Struct({
    HostedZoneId: S.String.pipe(T.HttpLabel("HostedZoneId")),
    VPC: VPC,
    Comment: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2013-04-01/hostedzone/{HostedZoneId}/disassociatevpc",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateVPCFromHostedZoneRequest",
}) as any as S.Schema<DisassociateVPCFromHostedZoneRequest>;
export interface EnableHostedZoneDNSSECRequest {
  HostedZoneId: string;
}
export const EnableHostedZoneDNSSECRequest = S.suspend(() =>
  S.Struct({ HostedZoneId: S.String.pipe(T.HttpLabel("HostedZoneId")) }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2013-04-01/hostedzone/{HostedZoneId}/enable-dnssec",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EnableHostedZoneDNSSECRequest",
}) as any as S.Schema<EnableHostedZoneDNSSECRequest>;
export interface GetAccountLimitRequest {
  Type: AccountLimitType;
}
export const GetAccountLimitRequest = S.suspend(() =>
  S.Struct({ Type: AccountLimitType.pipe(T.HttpLabel("Type")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2013-04-01/accountlimit/{Type}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAccountLimitRequest",
}) as any as S.Schema<GetAccountLimitRequest>;
export interface GetChangeRequest {
  Id: string;
}
export const GetChangeRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2013-04-01/change/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetChangeRequest",
}) as any as S.Schema<GetChangeRequest>;
export interface GetCheckerIpRangesResponse {
  CheckerIpRanges: string[];
}
export const GetCheckerIpRangesResponse = S.suspend(() =>
  S.Struct({ CheckerIpRanges: CheckerIpRanges }).pipe(ns),
).annotations({
  identifier: "GetCheckerIpRangesResponse",
}) as any as S.Schema<GetCheckerIpRangesResponse>;
export interface GetDNSSECRequest {
  HostedZoneId: string;
}
export const GetDNSSECRequest = S.suspend(() =>
  S.Struct({ HostedZoneId: S.String.pipe(T.HttpLabel("HostedZoneId")) }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2013-04-01/hostedzone/{HostedZoneId}/dnssec",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDNSSECRequest",
}) as any as S.Schema<GetDNSSECRequest>;
export interface GetGeoLocationRequest {
  ContinentCode?: string;
  CountryCode?: string;
  SubdivisionCode?: string;
}
export const GetGeoLocationRequest = S.suspend(() =>
  S.Struct({
    ContinentCode: S.optional(S.String).pipe(T.HttpQuery("continentcode")),
    CountryCode: S.optional(S.String).pipe(T.HttpQuery("countrycode")),
    SubdivisionCode: S.optional(S.String).pipe(T.HttpQuery("subdivisioncode")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2013-04-01/geolocation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetGeoLocationRequest",
}) as any as S.Schema<GetGeoLocationRequest>;
export interface GetHealthCheckRequest {
  HealthCheckId: string;
}
export const GetHealthCheckRequest = S.suspend(() =>
  S.Struct({ HealthCheckId: S.String.pipe(T.HttpLabel("HealthCheckId")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2013-04-01/healthcheck/{HealthCheckId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetHealthCheckRequest",
}) as any as S.Schema<GetHealthCheckRequest>;
export interface GetHealthCheckCountResponse {
  HealthCheckCount: number;
}
export const GetHealthCheckCountResponse = S.suspend(() =>
  S.Struct({ HealthCheckCount: S.Number }).pipe(ns),
).annotations({
  identifier: "GetHealthCheckCountResponse",
}) as any as S.Schema<GetHealthCheckCountResponse>;
export interface GetHealthCheckLastFailureReasonRequest {
  HealthCheckId: string;
}
export const GetHealthCheckLastFailureReasonRequest = S.suspend(() =>
  S.Struct({ HealthCheckId: S.String.pipe(T.HttpLabel("HealthCheckId")) }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2013-04-01/healthcheck/{HealthCheckId}/lastfailurereason",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetHealthCheckLastFailureReasonRequest",
}) as any as S.Schema<GetHealthCheckLastFailureReasonRequest>;
export interface GetHealthCheckStatusRequest {
  HealthCheckId: string;
}
export const GetHealthCheckStatusRequest = S.suspend(() =>
  S.Struct({ HealthCheckId: S.String.pipe(T.HttpLabel("HealthCheckId")) }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2013-04-01/healthcheck/{HealthCheckId}/status",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetHealthCheckStatusRequest",
}) as any as S.Schema<GetHealthCheckStatusRequest>;
export interface GetHostedZoneRequest {
  Id: string;
}
export const GetHostedZoneRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2013-04-01/hostedzone/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetHostedZoneRequest",
}) as any as S.Schema<GetHostedZoneRequest>;
export interface GetHostedZoneCountResponse {
  HostedZoneCount: number;
}
export const GetHostedZoneCountResponse = S.suspend(() =>
  S.Struct({ HostedZoneCount: S.Number }).pipe(ns),
).annotations({
  identifier: "GetHostedZoneCountResponse",
}) as any as S.Schema<GetHostedZoneCountResponse>;
export interface GetHostedZoneLimitRequest {
  Type: HostedZoneLimitType;
  HostedZoneId: string;
}
export const GetHostedZoneLimitRequest = S.suspend(() =>
  S.Struct({
    Type: HostedZoneLimitType.pipe(T.HttpLabel("Type")),
    HostedZoneId: S.String.pipe(T.HttpLabel("HostedZoneId")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2013-04-01/hostedzonelimit/{HostedZoneId}/{Type}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetHostedZoneLimitRequest",
}) as any as S.Schema<GetHostedZoneLimitRequest>;
export interface GetQueryLoggingConfigRequest {
  Id: string;
}
export const GetQueryLoggingConfigRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2013-04-01/queryloggingconfig/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetQueryLoggingConfigRequest",
}) as any as S.Schema<GetQueryLoggingConfigRequest>;
export interface GetReusableDelegationSetRequest {
  Id: string;
}
export const GetReusableDelegationSetRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2013-04-01/delegationset/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetReusableDelegationSetRequest",
}) as any as S.Schema<GetReusableDelegationSetRequest>;
export interface GetReusableDelegationSetLimitRequest {
  Type: ReusableDelegationSetLimitType;
  DelegationSetId: string;
}
export const GetReusableDelegationSetLimitRequest = S.suspend(() =>
  S.Struct({
    Type: ReusableDelegationSetLimitType.pipe(T.HttpLabel("Type")),
    DelegationSetId: S.String.pipe(T.HttpLabel("DelegationSetId")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2013-04-01/reusabledelegationsetlimit/{DelegationSetId}/{Type}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetReusableDelegationSetLimitRequest",
}) as any as S.Schema<GetReusableDelegationSetLimitRequest>;
export interface GetTrafficPolicyRequest {
  Id: string;
  Version: number;
}
export const GetTrafficPolicyRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    Version: S.Number.pipe(T.HttpLabel("Version")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2013-04-01/trafficpolicy/{Id}/{Version}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTrafficPolicyRequest",
}) as any as S.Schema<GetTrafficPolicyRequest>;
export interface GetTrafficPolicyInstanceRequest {
  Id: string;
}
export const GetTrafficPolicyInstanceRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2013-04-01/trafficpolicyinstance/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTrafficPolicyInstanceRequest",
}) as any as S.Schema<GetTrafficPolicyInstanceRequest>;
export interface GetTrafficPolicyInstanceCountResponse {
  TrafficPolicyInstanceCount: number;
}
export const GetTrafficPolicyInstanceCountResponse = S.suspend(() =>
  S.Struct({ TrafficPolicyInstanceCount: S.Number }).pipe(ns),
).annotations({
  identifier: "GetTrafficPolicyInstanceCountResponse",
}) as any as S.Schema<GetTrafficPolicyInstanceCountResponse>;
export interface ListCidrBlocksRequest {
  CollectionId: string;
  LocationName?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListCidrBlocksRequest = S.suspend(() =>
  S.Struct({
    CollectionId: S.String.pipe(T.HttpLabel("CollectionId")),
    LocationName: S.optional(S.String).pipe(T.HttpQuery("location")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nexttoken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxresults")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2013-04-01/cidrcollection/{CollectionId}/cidrblocks",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCidrBlocksRequest",
}) as any as S.Schema<ListCidrBlocksRequest>;
export interface ListCidrCollectionsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListCidrCollectionsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nexttoken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxresults")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2013-04-01/cidrcollection" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCidrCollectionsRequest",
}) as any as S.Schema<ListCidrCollectionsRequest>;
export interface ListCidrLocationsRequest {
  CollectionId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListCidrLocationsRequest = S.suspend(() =>
  S.Struct({
    CollectionId: S.String.pipe(T.HttpLabel("CollectionId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nexttoken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxresults")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2013-04-01/cidrcollection/{CollectionId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCidrLocationsRequest",
}) as any as S.Schema<ListCidrLocationsRequest>;
export interface ListGeoLocationsRequest {
  StartContinentCode?: string;
  StartCountryCode?: string;
  StartSubdivisionCode?: string;
  MaxItems?: number;
}
export const ListGeoLocationsRequest = S.suspend(() =>
  S.Struct({
    StartContinentCode: S.optional(S.String).pipe(
      T.HttpQuery("startcontinentcode"),
    ),
    StartCountryCode: S.optional(S.String).pipe(
      T.HttpQuery("startcountrycode"),
    ),
    StartSubdivisionCode: S.optional(S.String).pipe(
      T.HttpQuery("startsubdivisioncode"),
    ),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("maxitems")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2013-04-01/geolocations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListGeoLocationsRequest",
}) as any as S.Schema<ListGeoLocationsRequest>;
export interface ListHealthChecksRequest {
  Marker?: string;
  MaxItems?: number;
}
export const ListHealthChecksRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("maxitems")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2013-04-01/healthcheck" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListHealthChecksRequest",
}) as any as S.Schema<ListHealthChecksRequest>;
export interface ListHostedZonesRequest {
  Marker?: string;
  MaxItems?: number;
  DelegationSetId?: string;
  HostedZoneType?: HostedZoneType;
}
export const ListHostedZonesRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("maxitems")),
    DelegationSetId: S.optional(S.String).pipe(T.HttpQuery("delegationsetid")),
    HostedZoneType: S.optional(HostedZoneType).pipe(
      T.HttpQuery("hostedzonetype"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2013-04-01/hostedzone" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListHostedZonesRequest",
}) as any as S.Schema<ListHostedZonesRequest>;
export interface ListHostedZonesByNameRequest {
  DNSName?: string;
  HostedZoneId?: string;
  MaxItems?: number;
}
export const ListHostedZonesByNameRequest = S.suspend(() =>
  S.Struct({
    DNSName: S.optional(S.String).pipe(T.HttpQuery("dnsname")),
    HostedZoneId: S.optional(S.String).pipe(T.HttpQuery("hostedzoneid")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("maxitems")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2013-04-01/hostedzonesbyname" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListHostedZonesByNameRequest",
}) as any as S.Schema<ListHostedZonesByNameRequest>;
export interface ListHostedZonesByVPCRequest {
  VPCId: string;
  VPCRegion: VPCRegion;
  MaxItems?: number;
  NextToken?: string;
}
export const ListHostedZonesByVPCRequest = S.suspend(() =>
  S.Struct({
    VPCId: S.String.pipe(T.HttpQuery("vpcid")),
    VPCRegion: VPCRegion.pipe(T.HttpQuery("vpcregion")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("maxitems")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nexttoken")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2013-04-01/hostedzonesbyvpc" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListHostedZonesByVPCRequest",
}) as any as S.Schema<ListHostedZonesByVPCRequest>;
export interface ListQueryLoggingConfigsRequest {
  HostedZoneId?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListQueryLoggingConfigsRequest = S.suspend(() =>
  S.Struct({
    HostedZoneId: S.optional(S.String).pipe(T.HttpQuery("hostedzoneid")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nexttoken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxresults")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2013-04-01/queryloggingconfig" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListQueryLoggingConfigsRequest",
}) as any as S.Schema<ListQueryLoggingConfigsRequest>;
export interface ListResourceRecordSetsRequest {
  HostedZoneId: string;
  StartRecordName?: string;
  StartRecordType?: RRType;
  StartRecordIdentifier?: string;
  MaxItems?: number;
}
export const ListResourceRecordSetsRequest = S.suspend(() =>
  S.Struct({
    HostedZoneId: S.String.pipe(T.HttpLabel("HostedZoneId")),
    StartRecordName: S.optional(S.String).pipe(T.HttpQuery("name")),
    StartRecordType: S.optional(RRType).pipe(T.HttpQuery("type")),
    StartRecordIdentifier: S.optional(S.String).pipe(T.HttpQuery("identifier")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("maxitems")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2013-04-01/hostedzone/{HostedZoneId}/rrset",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourceRecordSetsRequest",
}) as any as S.Schema<ListResourceRecordSetsRequest>;
export interface ListReusableDelegationSetsRequest {
  Marker?: string;
  MaxItems?: number;
}
export const ListReusableDelegationSetsRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("maxitems")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2013-04-01/delegationset" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListReusableDelegationSetsRequest",
}) as any as S.Schema<ListReusableDelegationSetsRequest>;
export interface ListTagsForResourceRequest {
  ResourceType: TagResourceType;
  ResourceId: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceType: TagResourceType.pipe(T.HttpLabel("ResourceType")),
    ResourceId: S.String.pipe(T.HttpLabel("ResourceId")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2013-04-01/tags/{ResourceType}/{ResourceId}",
      }),
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
export interface ListTagsForResourcesRequest {
  ResourceType: TagResourceType;
  ResourceIds: string[];
}
export const ListTagsForResourcesRequest = S.suspend(() =>
  S.Struct({
    ResourceType: TagResourceType.pipe(T.HttpLabel("ResourceType")),
    ResourceIds: TagResourceIdList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2013-04-01/tags/{ResourceType}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourcesRequest",
}) as any as S.Schema<ListTagsForResourcesRequest>;
export interface ListTrafficPoliciesRequest {
  TrafficPolicyIdMarker?: string;
  MaxItems?: number;
}
export const ListTrafficPoliciesRequest = S.suspend(() =>
  S.Struct({
    TrafficPolicyIdMarker: S.optional(S.String).pipe(
      T.HttpQuery("trafficpolicyid"),
    ),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("maxitems")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2013-04-01/trafficpolicies" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTrafficPoliciesRequest",
}) as any as S.Schema<ListTrafficPoliciesRequest>;
export interface ListTrafficPolicyInstancesRequest {
  HostedZoneIdMarker?: string;
  TrafficPolicyInstanceNameMarker?: string;
  TrafficPolicyInstanceTypeMarker?: RRType;
  MaxItems?: number;
}
export const ListTrafficPolicyInstancesRequest = S.suspend(() =>
  S.Struct({
    HostedZoneIdMarker: S.optional(S.String).pipe(T.HttpQuery("hostedzoneid")),
    TrafficPolicyInstanceNameMarker: S.optional(S.String).pipe(
      T.HttpQuery("trafficpolicyinstancename"),
    ),
    TrafficPolicyInstanceTypeMarker: S.optional(RRType).pipe(
      T.HttpQuery("trafficpolicyinstancetype"),
    ),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("maxitems")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2013-04-01/trafficpolicyinstances" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTrafficPolicyInstancesRequest",
}) as any as S.Schema<ListTrafficPolicyInstancesRequest>;
export interface ListTrafficPolicyInstancesByHostedZoneRequest {
  HostedZoneId: string;
  TrafficPolicyInstanceNameMarker?: string;
  TrafficPolicyInstanceTypeMarker?: RRType;
  MaxItems?: number;
}
export const ListTrafficPolicyInstancesByHostedZoneRequest = S.suspend(() =>
  S.Struct({
    HostedZoneId: S.String.pipe(T.HttpQuery("id")),
    TrafficPolicyInstanceNameMarker: S.optional(S.String).pipe(
      T.HttpQuery("trafficpolicyinstancename"),
    ),
    TrafficPolicyInstanceTypeMarker: S.optional(RRType).pipe(
      T.HttpQuery("trafficpolicyinstancetype"),
    ),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("maxitems")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2013-04-01/trafficpolicyinstances/hostedzone",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTrafficPolicyInstancesByHostedZoneRequest",
}) as any as S.Schema<ListTrafficPolicyInstancesByHostedZoneRequest>;
export interface ListTrafficPolicyInstancesByPolicyRequest {
  TrafficPolicyId: string;
  TrafficPolicyVersion: number;
  HostedZoneIdMarker?: string;
  TrafficPolicyInstanceNameMarker?: string;
  TrafficPolicyInstanceTypeMarker?: RRType;
  MaxItems?: number;
}
export const ListTrafficPolicyInstancesByPolicyRequest = S.suspend(() =>
  S.Struct({
    TrafficPolicyId: S.String.pipe(T.HttpQuery("id")),
    TrafficPolicyVersion: S.Number.pipe(T.HttpQuery("version")),
    HostedZoneIdMarker: S.optional(S.String).pipe(T.HttpQuery("hostedzoneid")),
    TrafficPolicyInstanceNameMarker: S.optional(S.String).pipe(
      T.HttpQuery("trafficpolicyinstancename"),
    ),
    TrafficPolicyInstanceTypeMarker: S.optional(RRType).pipe(
      T.HttpQuery("trafficpolicyinstancetype"),
    ),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("maxitems")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2013-04-01/trafficpolicyinstances/trafficpolicy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTrafficPolicyInstancesByPolicyRequest",
}) as any as S.Schema<ListTrafficPolicyInstancesByPolicyRequest>;
export interface ListTrafficPolicyVersionsRequest {
  Id: string;
  TrafficPolicyVersionMarker?: string;
  MaxItems?: number;
}
export const ListTrafficPolicyVersionsRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    TrafficPolicyVersionMarker: S.optional(S.String).pipe(
      T.HttpQuery("trafficpolicyversion"),
    ),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("maxitems")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2013-04-01/trafficpolicies/{Id}/versions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTrafficPolicyVersionsRequest",
}) as any as S.Schema<ListTrafficPolicyVersionsRequest>;
export interface ListVPCAssociationAuthorizationsRequest {
  HostedZoneId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListVPCAssociationAuthorizationsRequest = S.suspend(() =>
  S.Struct({
    HostedZoneId: S.String.pipe(T.HttpLabel("HostedZoneId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nexttoken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxresults")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2013-04-01/hostedzone/{HostedZoneId}/authorizevpcassociation",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVPCAssociationAuthorizationsRequest",
}) as any as S.Schema<ListVPCAssociationAuthorizationsRequest>;
export interface TestDNSAnswerRequest {
  HostedZoneId: string;
  RecordName: string;
  RecordType: RRType;
  ResolverIP?: string;
  EDNS0ClientSubnetIP?: string;
  EDNS0ClientSubnetMask?: string;
}
export const TestDNSAnswerRequest = S.suspend(() =>
  S.Struct({
    HostedZoneId: S.String.pipe(T.HttpQuery("hostedzoneid")),
    RecordName: S.String.pipe(T.HttpQuery("recordname")),
    RecordType: RRType.pipe(T.HttpQuery("recordtype")),
    ResolverIP: S.optional(S.String).pipe(T.HttpQuery("resolverip")),
    EDNS0ClientSubnetIP: S.optional(S.String).pipe(
      T.HttpQuery("edns0clientsubnetip"),
    ),
    EDNS0ClientSubnetMask: S.optional(S.String).pipe(
      T.HttpQuery("edns0clientsubnetmask"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2013-04-01/testdnsanswer" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TestDNSAnswerRequest",
}) as any as S.Schema<TestDNSAnswerRequest>;
export interface UpdateHostedZoneCommentRequest {
  Id: string;
  Comment?: string;
}
export const UpdateHostedZoneCommentRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    Comment: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2013-04-01/hostedzone/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateHostedZoneCommentRequest",
}) as any as S.Schema<UpdateHostedZoneCommentRequest>;
export interface UpdateHostedZoneFeaturesRequest {
  HostedZoneId: string;
  EnableAcceleratedRecovery?: boolean;
}
export const UpdateHostedZoneFeaturesRequest = S.suspend(() =>
  S.Struct({
    HostedZoneId: S.String.pipe(T.HttpLabel("HostedZoneId")),
    EnableAcceleratedRecovery: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2013-04-01/hostedzone/{HostedZoneId}/features",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateHostedZoneFeaturesRequest",
}) as any as S.Schema<UpdateHostedZoneFeaturesRequest>;
export interface UpdateHostedZoneFeaturesResponse {}
export const UpdateHostedZoneFeaturesResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateHostedZoneFeaturesResponse",
}) as any as S.Schema<UpdateHostedZoneFeaturesResponse>;
export interface UpdateTrafficPolicyCommentRequest {
  Id: string;
  Version: number;
  Comment: string;
}
export const UpdateTrafficPolicyCommentRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    Version: S.Number.pipe(T.HttpLabel("Version")),
    Comment: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2013-04-01/trafficpolicy/{Id}/{Version}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTrafficPolicyCommentRequest",
}) as any as S.Schema<UpdateTrafficPolicyCommentRequest>;
export interface UpdateTrafficPolicyInstanceRequest {
  Id: string;
  TTL: number;
  TrafficPolicyId: string;
  TrafficPolicyVersion: number;
}
export const UpdateTrafficPolicyInstanceRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    TTL: S.Number,
    TrafficPolicyId: S.String,
    TrafficPolicyVersion: S.Number,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2013-04-01/trafficpolicyinstance/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTrafficPolicyInstanceRequest",
}) as any as S.Schema<UpdateTrafficPolicyInstanceRequest>;
export type CidrCollectionChangeAction = "PUT" | "DELETE_IF_EXISTS";
export const CidrCollectionChangeAction = S.Literal("PUT", "DELETE_IF_EXISTS");
export type CidrList = string[];
export const CidrList = S.Array(S.String.pipe(T.XmlName("Cidr")));
export type HealthCheckType =
  | "HTTP"
  | "HTTPS"
  | "HTTP_STR_MATCH"
  | "HTTPS_STR_MATCH"
  | "TCP"
  | "CALCULATED"
  | "CLOUDWATCH_METRIC"
  | "RECOVERY_CONTROL";
export const HealthCheckType = S.Literal(
  "HTTP",
  "HTTPS",
  "HTTP_STR_MATCH",
  "HTTPS_STR_MATCH",
  "TCP",
  "CALCULATED",
  "CLOUDWATCH_METRIC",
  "RECOVERY_CONTROL",
);
export type CloudWatchRegion =
  | "us-east-1"
  | "us-east-2"
  | "us-west-1"
  | "us-west-2"
  | "ca-central-1"
  | "eu-central-1"
  | "eu-central-2"
  | "eu-west-1"
  | "eu-west-2"
  | "eu-west-3"
  | "ap-east-1"
  | "me-south-1"
  | "me-central-1"
  | "ap-south-1"
  | "ap-south-2"
  | "ap-southeast-1"
  | "ap-southeast-2"
  | "ap-southeast-3"
  | "ap-northeast-1"
  | "ap-northeast-2"
  | "ap-northeast-3"
  | "eu-north-1"
  | "sa-east-1"
  | "cn-northwest-1"
  | "cn-north-1"
  | "af-south-1"
  | "eu-south-1"
  | "eu-south-2"
  | "us-gov-west-1"
  | "us-gov-east-1"
  | "us-iso-east-1"
  | "us-iso-west-1"
  | "us-isob-east-1"
  | "ap-southeast-4"
  | "il-central-1"
  | "ca-west-1"
  | "ap-southeast-5"
  | "mx-central-1"
  | "us-isof-south-1"
  | "us-isof-east-1"
  | "ap-southeast-7"
  | "ap-east-2"
  | "eu-isoe-west-1"
  | "ap-southeast-6"
  | "us-isob-west-1"
  | "eusc-de-east-1";
export const CloudWatchRegion = S.Literal(
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "ca-central-1",
  "eu-central-1",
  "eu-central-2",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "ap-east-1",
  "me-south-1",
  "me-central-1",
  "ap-south-1",
  "ap-south-2",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-southeast-3",
  "ap-northeast-1",
  "ap-northeast-2",
  "ap-northeast-3",
  "eu-north-1",
  "sa-east-1",
  "cn-northwest-1",
  "cn-north-1",
  "af-south-1",
  "eu-south-1",
  "eu-south-2",
  "us-gov-west-1",
  "us-gov-east-1",
  "us-iso-east-1",
  "us-iso-west-1",
  "us-isob-east-1",
  "ap-southeast-4",
  "il-central-1",
  "ca-west-1",
  "ap-southeast-5",
  "mx-central-1",
  "us-isof-south-1",
  "us-isof-east-1",
  "ap-southeast-7",
  "ap-east-2",
  "eu-isoe-west-1",
  "ap-southeast-6",
  "us-isob-west-1",
  "eusc-de-east-1",
);
export interface CidrCollectionChange {
  LocationName: string;
  Action: CidrCollectionChangeAction;
  CidrList: string[];
}
export const CidrCollectionChange = S.suspend(() =>
  S.Struct({
    LocationName: S.String,
    Action: CidrCollectionChangeAction,
    CidrList: CidrList,
  }),
).annotations({
  identifier: "CidrCollectionChange",
}) as any as S.Schema<CidrCollectionChange>;
export type CidrCollectionChanges = CidrCollectionChange[];
export const CidrCollectionChanges = S.Array(CidrCollectionChange);
export interface Tag {
  Key?: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(
  Tag.pipe(T.XmlName("Tag")).annotations({ identifier: "Tag" }),
);
export interface AlarmIdentifier {
  Region: CloudWatchRegion;
  Name: string;
}
export const AlarmIdentifier = S.suspend(() =>
  S.Struct({ Region: CloudWatchRegion, Name: S.String }),
).annotations({
  identifier: "AlarmIdentifier",
}) as any as S.Schema<AlarmIdentifier>;
export interface HealthCheckConfig {
  IPAddress?: string;
  Port?: number;
  Type: HealthCheckType;
  ResourcePath?: string;
  FullyQualifiedDomainName?: string;
  SearchString?: string;
  RequestInterval?: number;
  FailureThreshold?: number;
  MeasureLatency?: boolean;
  Inverted?: boolean;
  Disabled?: boolean;
  HealthThreshold?: number;
  ChildHealthChecks?: string[];
  EnableSNI?: boolean;
  Regions?: HealthCheckRegion[];
  AlarmIdentifier?: AlarmIdentifier;
  InsufficientDataHealthStatus?: InsufficientDataHealthStatus;
  RoutingControlArn?: string;
}
export const HealthCheckConfig = S.suspend(() =>
  S.Struct({
    IPAddress: S.optional(S.String),
    Port: S.optional(S.Number),
    Type: HealthCheckType,
    ResourcePath: S.optional(S.String),
    FullyQualifiedDomainName: S.optional(S.String),
    SearchString: S.optional(S.String),
    RequestInterval: S.optional(S.Number),
    FailureThreshold: S.optional(S.Number),
    MeasureLatency: S.optional(S.Boolean),
    Inverted: S.optional(S.Boolean),
    Disabled: S.optional(S.Boolean),
    HealthThreshold: S.optional(S.Number),
    ChildHealthChecks: S.optional(ChildHealthCheckList),
    EnableSNI: S.optional(S.Boolean),
    Regions: S.optional(HealthCheckRegionList),
    AlarmIdentifier: S.optional(AlarmIdentifier),
    InsufficientDataHealthStatus: S.optional(InsufficientDataHealthStatus),
    RoutingControlArn: S.optional(S.String),
  }),
).annotations({
  identifier: "HealthCheckConfig",
}) as any as S.Schema<HealthCheckConfig>;
export interface HostedZoneConfig {
  Comment?: string;
  PrivateZone?: boolean;
}
export const HostedZoneConfig = S.suspend(() =>
  S.Struct({
    Comment: S.optional(S.String),
    PrivateZone: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "HostedZoneConfig",
}) as any as S.Schema<HostedZoneConfig>;
export interface KeySigningKey {
  Name?: string;
  KmsArn?: string;
  Flag?: number;
  SigningAlgorithmMnemonic?: string;
  SigningAlgorithmType?: number;
  DigestAlgorithmMnemonic?: string;
  DigestAlgorithmType?: number;
  KeyTag?: number;
  DigestValue?: string;
  PublicKey?: string;
  DSRecord?: string;
  DNSKEYRecord?: string;
  Status?: string;
  StatusMessage?: string;
  CreatedDate?: Date;
  LastModifiedDate?: Date;
}
export const KeySigningKey = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    KmsArn: S.optional(S.String),
    Flag: S.optional(S.Number),
    SigningAlgorithmMnemonic: S.optional(S.String),
    SigningAlgorithmType: S.optional(S.Number),
    DigestAlgorithmMnemonic: S.optional(S.String),
    DigestAlgorithmType: S.optional(S.Number),
    KeyTag: S.optional(S.Number),
    DigestValue: S.optional(S.String),
    PublicKey: S.optional(S.String),
    DSRecord: S.optional(S.String),
    DNSKEYRecord: S.optional(S.String),
    Status: S.optional(S.String),
    StatusMessage: S.optional(S.String),
    CreatedDate: S.optional(S.Date),
    LastModifiedDate: S.optional(S.Date),
  }),
).annotations({
  identifier: "KeySigningKey",
}) as any as S.Schema<KeySigningKey>;
export type KeySigningKeys = KeySigningKey[];
export const KeySigningKeys = S.Array(KeySigningKey);
export type VPCs = VPC[];
export const VPCs = S.Array(
  VPC.pipe(T.XmlName("VPC")).annotations({ identifier: "VPC" }),
);
export interface GeoLocationDetails {
  ContinentCode?: string;
  ContinentName?: string;
  CountryCode?: string;
  CountryName?: string;
  SubdivisionCode?: string;
  SubdivisionName?: string;
}
export const GeoLocationDetails = S.suspend(() =>
  S.Struct({
    ContinentCode: S.optional(S.String),
    ContinentName: S.optional(S.String),
    CountryCode: S.optional(S.String),
    CountryName: S.optional(S.String),
    SubdivisionCode: S.optional(S.String),
    SubdivisionName: S.optional(S.String),
  }),
).annotations({
  identifier: "GeoLocationDetails",
}) as any as S.Schema<GeoLocationDetails>;
export type GeoLocationDetailsList = GeoLocationDetails[];
export const GeoLocationDetailsList = S.Array(
  GeoLocationDetails.pipe(T.XmlName("GeoLocationDetails")).annotations({
    identifier: "GeoLocationDetails",
  }),
);
export interface LinkedService {
  ServicePrincipal?: string;
  Description?: string;
}
export const LinkedService = S.suspend(() =>
  S.Struct({
    ServicePrincipal: S.optional(S.String),
    Description: S.optional(S.String),
  }),
).annotations({
  identifier: "LinkedService",
}) as any as S.Schema<LinkedService>;
export type ComparisonOperator =
  | "GreaterThanOrEqualToThreshold"
  | "GreaterThanThreshold"
  | "LessThanThreshold"
  | "LessThanOrEqualToThreshold";
export const ComparisonOperator = S.Literal(
  "GreaterThanOrEqualToThreshold",
  "GreaterThanThreshold",
  "LessThanThreshold",
  "LessThanOrEqualToThreshold",
);
export type Statistic =
  | "Average"
  | "Sum"
  | "SampleCount"
  | "Maximum"
  | "Minimum";
export const Statistic = S.Literal(
  "Average",
  "Sum",
  "SampleCount",
  "Maximum",
  "Minimum",
);
export interface Dimension {
  Name: string;
  Value: string;
}
export const Dimension = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String }),
).annotations({ identifier: "Dimension" }) as any as S.Schema<Dimension>;
export type DimensionList = Dimension[];
export const DimensionList = S.Array(
  Dimension.pipe(T.XmlName("Dimension")).annotations({
    identifier: "Dimension",
  }),
);
export interface CloudWatchAlarmConfiguration {
  EvaluationPeriods: number;
  Threshold: number;
  ComparisonOperator: ComparisonOperator;
  Period: number;
  MetricName: string;
  Namespace: string;
  Statistic: Statistic;
  Dimensions?: Dimension[];
}
export const CloudWatchAlarmConfiguration = S.suspend(() =>
  S.Struct({
    EvaluationPeriods: S.Number,
    Threshold: S.Number,
    ComparisonOperator: ComparisonOperator,
    Period: S.Number,
    MetricName: S.String,
    Namespace: S.String,
    Statistic: Statistic,
    Dimensions: S.optional(DimensionList),
  }),
).annotations({
  identifier: "CloudWatchAlarmConfiguration",
}) as any as S.Schema<CloudWatchAlarmConfiguration>;
export interface HealthCheck {
  Id: string;
  CallerReference: string;
  LinkedService?: LinkedService;
  HealthCheckConfig: HealthCheckConfig;
  HealthCheckVersion: number;
  CloudWatchAlarmConfiguration?: CloudWatchAlarmConfiguration;
}
export const HealthCheck = S.suspend(() =>
  S.Struct({
    Id: S.String,
    CallerReference: S.String,
    LinkedService: S.optional(LinkedService),
    HealthCheckConfig: HealthCheckConfig,
    HealthCheckVersion: S.Number,
    CloudWatchAlarmConfiguration: S.optional(CloudWatchAlarmConfiguration),
  }),
).annotations({ identifier: "HealthCheck" }) as any as S.Schema<HealthCheck>;
export type HealthChecks = HealthCheck[];
export const HealthChecks = S.Array(
  HealthCheck.pipe(T.XmlName("HealthCheck")).annotations({
    identifier: "HealthCheck",
  }),
);
export type AcceleratedRecoveryStatus =
  | "ENABLING"
  | "ENABLE_FAILED"
  | "ENABLING_HOSTED_ZONE_LOCKED"
  | "ENABLED"
  | "DISABLING"
  | "DISABLE_FAILED"
  | "DISABLED"
  | "DISABLING_HOSTED_ZONE_LOCKED";
export const AcceleratedRecoveryStatus = S.Literal(
  "ENABLING",
  "ENABLE_FAILED",
  "ENABLING_HOSTED_ZONE_LOCKED",
  "ENABLED",
  "DISABLING",
  "DISABLE_FAILED",
  "DISABLED",
  "DISABLING_HOSTED_ZONE_LOCKED",
);
export interface HostedZoneFailureReasons {
  AcceleratedRecovery?: string;
}
export const HostedZoneFailureReasons = S.suspend(() =>
  S.Struct({ AcceleratedRecovery: S.optional(S.String) }),
).annotations({
  identifier: "HostedZoneFailureReasons",
}) as any as S.Schema<HostedZoneFailureReasons>;
export interface HostedZoneFeatures {
  AcceleratedRecoveryStatus?: AcceleratedRecoveryStatus;
  FailureReasons?: HostedZoneFailureReasons;
}
export const HostedZoneFeatures = S.suspend(() =>
  S.Struct({
    AcceleratedRecoveryStatus: S.optional(AcceleratedRecoveryStatus),
    FailureReasons: S.optional(HostedZoneFailureReasons),
  }),
).annotations({
  identifier: "HostedZoneFeatures",
}) as any as S.Schema<HostedZoneFeatures>;
export interface HostedZone {
  Id: string;
  Name: string;
  CallerReference: string;
  Config?: HostedZoneConfig;
  ResourceRecordSetCount?: number;
  LinkedService?: LinkedService;
  Features?: HostedZoneFeatures;
}
export const HostedZone = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Name: S.String,
    CallerReference: S.String,
    Config: S.optional(HostedZoneConfig),
    ResourceRecordSetCount: S.optional(S.Number),
    LinkedService: S.optional(LinkedService),
    Features: S.optional(HostedZoneFeatures),
  }),
).annotations({ identifier: "HostedZone" }) as any as S.Schema<HostedZone>;
export type HostedZones = HostedZone[];
export const HostedZones = S.Array(
  HostedZone.pipe(T.XmlName("HostedZone")).annotations({
    identifier: "HostedZone",
  }),
);
export interface QueryLoggingConfig {
  Id: string;
  HostedZoneId: string;
  CloudWatchLogsLogGroupArn: string;
}
export const QueryLoggingConfig = S.suspend(() =>
  S.Struct({
    Id: S.String,
    HostedZoneId: S.String,
    CloudWatchLogsLogGroupArn: S.String,
  }),
).annotations({
  identifier: "QueryLoggingConfig",
}) as any as S.Schema<QueryLoggingConfig>;
export type QueryLoggingConfigs = QueryLoggingConfig[];
export const QueryLoggingConfigs = S.Array(
  QueryLoggingConfig.pipe(T.XmlName("QueryLoggingConfig")).annotations({
    identifier: "QueryLoggingConfig",
  }),
);
export type DelegationSetNameServers = string[];
export const DelegationSetNameServers = S.Array(
  S.String.pipe(T.XmlName("NameServer")),
);
export interface DelegationSet {
  Id?: string;
  CallerReference?: string;
  NameServers: string[];
}
export const DelegationSet = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    CallerReference: S.optional(S.String),
    NameServers: DelegationSetNameServers,
  }),
).annotations({
  identifier: "DelegationSet",
}) as any as S.Schema<DelegationSet>;
export type DelegationSets = DelegationSet[];
export const DelegationSets = S.Array(
  DelegationSet.pipe(T.XmlName("DelegationSet")).annotations({
    identifier: "DelegationSet",
  }),
);
export interface ResourceTagSet {
  ResourceType?: TagResourceType;
  ResourceId?: string;
  Tags?: Tag[];
}
export const ResourceTagSet = S.suspend(() =>
  S.Struct({
    ResourceType: S.optional(TagResourceType),
    ResourceId: S.optional(S.String),
    Tags: S.optional(TagList),
  }),
).annotations({
  identifier: "ResourceTagSet",
}) as any as S.Schema<ResourceTagSet>;
export type ResourceTagSetList = ResourceTagSet[];
export const ResourceTagSetList = S.Array(
  ResourceTagSet.pipe(T.XmlName("ResourceTagSet")).annotations({
    identifier: "ResourceTagSet",
  }),
);
export interface TrafficPolicyInstance {
  Id: string;
  HostedZoneId: string;
  Name: string;
  TTL: number;
  State: string;
  Message: string;
  TrafficPolicyId: string;
  TrafficPolicyVersion: number;
  TrafficPolicyType: RRType;
}
export const TrafficPolicyInstance = S.suspend(() =>
  S.Struct({
    Id: S.String,
    HostedZoneId: S.String,
    Name: S.String,
    TTL: S.Number,
    State: S.String,
    Message: S.String,
    TrafficPolicyId: S.String,
    TrafficPolicyVersion: S.Number,
    TrafficPolicyType: RRType,
  }),
).annotations({
  identifier: "TrafficPolicyInstance",
}) as any as S.Schema<TrafficPolicyInstance>;
export type TrafficPolicyInstances = TrafficPolicyInstance[];
export const TrafficPolicyInstances = S.Array(
  TrafficPolicyInstance.pipe(T.XmlName("TrafficPolicyInstance")).annotations({
    identifier: "TrafficPolicyInstance",
  }),
);
export interface TrafficPolicy {
  Id: string;
  Version: number;
  Name: string;
  Type: RRType;
  Document: string;
  Comment?: string;
}
export const TrafficPolicy = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Version: S.Number,
    Name: S.String,
    Type: RRType,
    Document: S.String,
    Comment: S.optional(S.String),
  }),
).annotations({
  identifier: "TrafficPolicy",
}) as any as S.Schema<TrafficPolicy>;
export type TrafficPolicies = TrafficPolicy[];
export const TrafficPolicies = S.Array(
  TrafficPolicy.pipe(T.XmlName("TrafficPolicy")).annotations({
    identifier: "TrafficPolicy",
  }),
);
export type RecordData = string[];
export const RecordData = S.Array(S.String.pipe(T.XmlName("RecordDataEntry")));
export type ChangeAction = "CREATE" | "DELETE" | "UPSERT";
export const ChangeAction = S.Literal("CREATE", "DELETE", "UPSERT");
export interface AssociateVPCWithHostedZoneRequest {
  HostedZoneId: string;
  VPC: VPC;
  Comment?: string;
}
export const AssociateVPCWithHostedZoneRequest = S.suspend(() =>
  S.Struct({
    HostedZoneId: S.String.pipe(T.HttpLabel("HostedZoneId")),
    VPC: VPC,
    Comment: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2013-04-01/hostedzone/{HostedZoneId}/associatevpc",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateVPCWithHostedZoneRequest",
}) as any as S.Schema<AssociateVPCWithHostedZoneRequest>;
export interface ChangeCidrCollectionRequest {
  Id: string;
  CollectionVersion?: number;
  Changes: CidrCollectionChange[];
}
export const ChangeCidrCollectionRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    CollectionVersion: S.optional(S.Number),
    Changes: CidrCollectionChanges,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2013-04-01/cidrcollection/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ChangeCidrCollectionRequest",
}) as any as S.Schema<ChangeCidrCollectionRequest>;
export interface ChangeTagsForResourceRequest {
  ResourceType: TagResourceType;
  ResourceId: string;
  AddTags?: Tag[];
  RemoveTagKeys?: string[];
}
export const ChangeTagsForResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceType: TagResourceType.pipe(T.HttpLabel("ResourceType")),
    ResourceId: S.String.pipe(T.HttpLabel("ResourceId")),
    AddTags: S.optional(TagList),
    RemoveTagKeys: S.optional(TagKeyList),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2013-04-01/tags/{ResourceType}/{ResourceId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ChangeTagsForResourceRequest",
}) as any as S.Schema<ChangeTagsForResourceRequest>;
export interface ChangeTagsForResourceResponse {}
export const ChangeTagsForResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "ChangeTagsForResourceResponse",
}) as any as S.Schema<ChangeTagsForResourceResponse>;
export interface CreateHealthCheckRequest {
  CallerReference: string;
  HealthCheckConfig: HealthCheckConfig;
}
export const CreateHealthCheckRequest = S.suspend(() =>
  S.Struct({
    CallerReference: S.String,
    HealthCheckConfig: HealthCheckConfig,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2013-04-01/healthcheck" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateHealthCheckRequest",
}) as any as S.Schema<CreateHealthCheckRequest>;
export interface CreateHostedZoneRequest {
  Name: string;
  VPC?: VPC;
  CallerReference: string;
  HostedZoneConfig?: HostedZoneConfig;
  DelegationSetId?: string;
}
export const CreateHostedZoneRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    VPC: S.optional(VPC),
    CallerReference: S.String,
    HostedZoneConfig: S.optional(HostedZoneConfig),
    DelegationSetId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2013-04-01/hostedzone" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateHostedZoneRequest",
}) as any as S.Schema<CreateHostedZoneRequest>;
export interface CreateTrafficPolicyVersionResponse {
  TrafficPolicy: TrafficPolicy;
  Location: string;
}
export const CreateTrafficPolicyVersionResponse = S.suspend(() =>
  S.Struct({
    TrafficPolicy: TrafficPolicy,
    Location: S.String.pipe(T.HttpHeader("Location")),
  }).pipe(ns),
).annotations({
  identifier: "CreateTrafficPolicyVersionResponse",
}) as any as S.Schema<CreateTrafficPolicyVersionResponse>;
export interface CreateVPCAssociationAuthorizationResponse {
  HostedZoneId: string;
  VPC: VPC;
}
export const CreateVPCAssociationAuthorizationResponse = S.suspend(() =>
  S.Struct({ HostedZoneId: S.String, VPC: VPC }).pipe(ns),
).annotations({
  identifier: "CreateVPCAssociationAuthorizationResponse",
}) as any as S.Schema<CreateVPCAssociationAuthorizationResponse>;
export type ChangeStatus = "PENDING" | "INSYNC";
export const ChangeStatus = S.Literal("PENDING", "INSYNC");
export interface ChangeInfo {
  Id: string;
  Status: ChangeStatus;
  SubmittedAt: Date;
  Comment?: string;
}
export const ChangeInfo = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Status: ChangeStatus,
    SubmittedAt: S.Date,
    Comment: S.optional(S.String),
  }),
).annotations({ identifier: "ChangeInfo" }) as any as S.Schema<ChangeInfo>;
export interface DeactivateKeySigningKeyResponse {
  ChangeInfo: ChangeInfo;
}
export const DeactivateKeySigningKeyResponse = S.suspend(() =>
  S.Struct({ ChangeInfo: ChangeInfo }).pipe(ns),
).annotations({
  identifier: "DeactivateKeySigningKeyResponse",
}) as any as S.Schema<DeactivateKeySigningKeyResponse>;
export interface DeleteHostedZoneResponse {
  ChangeInfo: ChangeInfo;
}
export const DeleteHostedZoneResponse = S.suspend(() =>
  S.Struct({ ChangeInfo: ChangeInfo }).pipe(ns),
).annotations({
  identifier: "DeleteHostedZoneResponse",
}) as any as S.Schema<DeleteHostedZoneResponse>;
export interface DeleteKeySigningKeyResponse {
  ChangeInfo: ChangeInfo;
}
export const DeleteKeySigningKeyResponse = S.suspend(() =>
  S.Struct({ ChangeInfo: ChangeInfo }).pipe(ns),
).annotations({
  identifier: "DeleteKeySigningKeyResponse",
}) as any as S.Schema<DeleteKeySigningKeyResponse>;
export interface DisableHostedZoneDNSSECResponse {
  ChangeInfo: ChangeInfo;
}
export const DisableHostedZoneDNSSECResponse = S.suspend(() =>
  S.Struct({ ChangeInfo: ChangeInfo }).pipe(ns),
).annotations({
  identifier: "DisableHostedZoneDNSSECResponse",
}) as any as S.Schema<DisableHostedZoneDNSSECResponse>;
export interface DisassociateVPCFromHostedZoneResponse {
  ChangeInfo: ChangeInfo;
}
export const DisassociateVPCFromHostedZoneResponse = S.suspend(() =>
  S.Struct({ ChangeInfo: ChangeInfo }).pipe(ns),
).annotations({
  identifier: "DisassociateVPCFromHostedZoneResponse",
}) as any as S.Schema<DisassociateVPCFromHostedZoneResponse>;
export interface EnableHostedZoneDNSSECResponse {
  ChangeInfo: ChangeInfo;
}
export const EnableHostedZoneDNSSECResponse = S.suspend(() =>
  S.Struct({ ChangeInfo: ChangeInfo }).pipe(ns),
).annotations({
  identifier: "EnableHostedZoneDNSSECResponse",
}) as any as S.Schema<EnableHostedZoneDNSSECResponse>;
export interface GetChangeResponse {
  ChangeInfo: ChangeInfo;
}
export const GetChangeResponse = S.suspend(() =>
  S.Struct({ ChangeInfo: ChangeInfo }).pipe(ns),
).annotations({
  identifier: "GetChangeResponse",
}) as any as S.Schema<GetChangeResponse>;
export interface StatusReport {
  Status?: string;
  CheckedTime?: Date;
}
export const StatusReport = S.suspend(() =>
  S.Struct({ Status: S.optional(S.String), CheckedTime: S.optional(S.Date) }),
).annotations({ identifier: "StatusReport" }) as any as S.Schema<StatusReport>;
export interface HealthCheckObservation {
  Region?: HealthCheckRegion;
  IPAddress?: string;
  StatusReport?: StatusReport;
}
export const HealthCheckObservation = S.suspend(() =>
  S.Struct({
    Region: S.optional(HealthCheckRegion),
    IPAddress: S.optional(S.String),
    StatusReport: S.optional(StatusReport),
  }),
).annotations({
  identifier: "HealthCheckObservation",
}) as any as S.Schema<HealthCheckObservation>;
export type HealthCheckObservations = HealthCheckObservation[];
export const HealthCheckObservations = S.Array(
  HealthCheckObservation.pipe(T.XmlName("HealthCheckObservation")).annotations({
    identifier: "HealthCheckObservation",
  }),
);
export interface GetHealthCheckStatusResponse {
  HealthCheckObservations: HealthCheckObservation[];
}
export const GetHealthCheckStatusResponse = S.suspend(() =>
  S.Struct({ HealthCheckObservations: HealthCheckObservations }).pipe(ns),
).annotations({
  identifier: "GetHealthCheckStatusResponse",
}) as any as S.Schema<GetHealthCheckStatusResponse>;
export interface GetQueryLoggingConfigResponse {
  QueryLoggingConfig: QueryLoggingConfig;
}
export const GetQueryLoggingConfigResponse = S.suspend(() =>
  S.Struct({ QueryLoggingConfig: QueryLoggingConfig }).pipe(ns),
).annotations({
  identifier: "GetQueryLoggingConfigResponse",
}) as any as S.Schema<GetQueryLoggingConfigResponse>;
export interface GetReusableDelegationSetResponse {
  DelegationSet: DelegationSet;
}
export const GetReusableDelegationSetResponse = S.suspend(() =>
  S.Struct({ DelegationSet: DelegationSet }).pipe(ns),
).annotations({
  identifier: "GetReusableDelegationSetResponse",
}) as any as S.Schema<GetReusableDelegationSetResponse>;
export interface GetTrafficPolicyResponse {
  TrafficPolicy: TrafficPolicy;
}
export const GetTrafficPolicyResponse = S.suspend(() =>
  S.Struct({ TrafficPolicy: TrafficPolicy }).pipe(ns),
).annotations({
  identifier: "GetTrafficPolicyResponse",
}) as any as S.Schema<GetTrafficPolicyResponse>;
export interface GetTrafficPolicyInstanceResponse {
  TrafficPolicyInstance: TrafficPolicyInstance;
}
export const GetTrafficPolicyInstanceResponse = S.suspend(() =>
  S.Struct({ TrafficPolicyInstance: TrafficPolicyInstance }).pipe(ns),
).annotations({
  identifier: "GetTrafficPolicyInstanceResponse",
}) as any as S.Schema<GetTrafficPolicyInstanceResponse>;
export interface ListGeoLocationsResponse {
  GeoLocationDetailsList: GeoLocationDetails[];
  IsTruncated: boolean;
  NextContinentCode?: string;
  NextCountryCode?: string;
  NextSubdivisionCode?: string;
  MaxItems: number;
}
export const ListGeoLocationsResponse = S.suspend(() =>
  S.Struct({
    GeoLocationDetailsList: GeoLocationDetailsList,
    IsTruncated: S.Boolean,
    NextContinentCode: S.optional(S.String),
    NextCountryCode: S.optional(S.String),
    NextSubdivisionCode: S.optional(S.String),
    MaxItems: S.Number,
  }).pipe(ns),
).annotations({
  identifier: "ListGeoLocationsResponse",
}) as any as S.Schema<ListGeoLocationsResponse>;
export interface ListHealthChecksResponse {
  HealthChecks: HealthCheck[];
  Marker: string;
  IsTruncated: boolean;
  NextMarker?: string;
  MaxItems: number;
}
export const ListHealthChecksResponse = S.suspend(() =>
  S.Struct({
    HealthChecks: HealthChecks,
    Marker: S.String,
    IsTruncated: S.Boolean,
    NextMarker: S.optional(S.String),
    MaxItems: S.Number,
  }).pipe(ns),
).annotations({
  identifier: "ListHealthChecksResponse",
}) as any as S.Schema<ListHealthChecksResponse>;
export interface ListHostedZonesResponse {
  HostedZones: HostedZone[];
  Marker: string;
  IsTruncated: boolean;
  NextMarker?: string;
  MaxItems: number;
}
export const ListHostedZonesResponse = S.suspend(() =>
  S.Struct({
    HostedZones: HostedZones,
    Marker: S.String,
    IsTruncated: S.Boolean,
    NextMarker: S.optional(S.String),
    MaxItems: S.Number,
  }).pipe(ns),
).annotations({
  identifier: "ListHostedZonesResponse",
}) as any as S.Schema<ListHostedZonesResponse>;
export interface ListHostedZonesByNameResponse {
  HostedZones: HostedZone[];
  DNSName?: string;
  HostedZoneId?: string;
  IsTruncated: boolean;
  NextDNSName?: string;
  NextHostedZoneId?: string;
  MaxItems: number;
}
export const ListHostedZonesByNameResponse = S.suspend(() =>
  S.Struct({
    HostedZones: HostedZones,
    DNSName: S.optional(S.String),
    HostedZoneId: S.optional(S.String),
    IsTruncated: S.Boolean,
    NextDNSName: S.optional(S.String),
    NextHostedZoneId: S.optional(S.String),
    MaxItems: S.Number,
  }).pipe(ns),
).annotations({
  identifier: "ListHostedZonesByNameResponse",
}) as any as S.Schema<ListHostedZonesByNameResponse>;
export interface ListQueryLoggingConfigsResponse {
  QueryLoggingConfigs: QueryLoggingConfig[];
  NextToken?: string;
}
export const ListQueryLoggingConfigsResponse = S.suspend(() =>
  S.Struct({
    QueryLoggingConfigs: QueryLoggingConfigs,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListQueryLoggingConfigsResponse",
}) as any as S.Schema<ListQueryLoggingConfigsResponse>;
export interface ListReusableDelegationSetsResponse {
  DelegationSets: DelegationSet[];
  Marker: string;
  IsTruncated: boolean;
  NextMarker?: string;
  MaxItems: number;
}
export const ListReusableDelegationSetsResponse = S.suspend(() =>
  S.Struct({
    DelegationSets: DelegationSets,
    Marker: S.String,
    IsTruncated: S.Boolean,
    NextMarker: S.optional(S.String),
    MaxItems: S.Number,
  }).pipe(ns),
).annotations({
  identifier: "ListReusableDelegationSetsResponse",
}) as any as S.Schema<ListReusableDelegationSetsResponse>;
export interface ListTagsForResourcesResponse {
  ResourceTagSets: ResourceTagSet[];
}
export const ListTagsForResourcesResponse = S.suspend(() =>
  S.Struct({ ResourceTagSets: ResourceTagSetList }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourcesResponse",
}) as any as S.Schema<ListTagsForResourcesResponse>;
export interface ListTrafficPolicyInstancesResponse {
  TrafficPolicyInstances: TrafficPolicyInstance[];
  HostedZoneIdMarker?: string;
  TrafficPolicyInstanceNameMarker?: string;
  TrafficPolicyInstanceTypeMarker?: RRType;
  IsTruncated: boolean;
  MaxItems: number;
}
export const ListTrafficPolicyInstancesResponse = S.suspend(() =>
  S.Struct({
    TrafficPolicyInstances: TrafficPolicyInstances,
    HostedZoneIdMarker: S.optional(S.String),
    TrafficPolicyInstanceNameMarker: S.optional(S.String),
    TrafficPolicyInstanceTypeMarker: S.optional(RRType),
    IsTruncated: S.Boolean,
    MaxItems: S.Number,
  }).pipe(ns),
).annotations({
  identifier: "ListTrafficPolicyInstancesResponse",
}) as any as S.Schema<ListTrafficPolicyInstancesResponse>;
export interface ListTrafficPolicyInstancesByHostedZoneResponse {
  TrafficPolicyInstances: TrafficPolicyInstance[];
  TrafficPolicyInstanceNameMarker?: string;
  TrafficPolicyInstanceTypeMarker?: RRType;
  IsTruncated: boolean;
  MaxItems: number;
}
export const ListTrafficPolicyInstancesByHostedZoneResponse = S.suspend(() =>
  S.Struct({
    TrafficPolicyInstances: TrafficPolicyInstances,
    TrafficPolicyInstanceNameMarker: S.optional(S.String),
    TrafficPolicyInstanceTypeMarker: S.optional(RRType),
    IsTruncated: S.Boolean,
    MaxItems: S.Number,
  }).pipe(ns),
).annotations({
  identifier: "ListTrafficPolicyInstancesByHostedZoneResponse",
}) as any as S.Schema<ListTrafficPolicyInstancesByHostedZoneResponse>;
export interface ListTrafficPolicyInstancesByPolicyResponse {
  TrafficPolicyInstances: TrafficPolicyInstance[];
  HostedZoneIdMarker?: string;
  TrafficPolicyInstanceNameMarker?: string;
  TrafficPolicyInstanceTypeMarker?: RRType;
  IsTruncated: boolean;
  MaxItems: number;
}
export const ListTrafficPolicyInstancesByPolicyResponse = S.suspend(() =>
  S.Struct({
    TrafficPolicyInstances: TrafficPolicyInstances,
    HostedZoneIdMarker: S.optional(S.String),
    TrafficPolicyInstanceNameMarker: S.optional(S.String),
    TrafficPolicyInstanceTypeMarker: S.optional(RRType),
    IsTruncated: S.Boolean,
    MaxItems: S.Number,
  }).pipe(ns),
).annotations({
  identifier: "ListTrafficPolicyInstancesByPolicyResponse",
}) as any as S.Schema<ListTrafficPolicyInstancesByPolicyResponse>;
export interface ListTrafficPolicyVersionsResponse {
  TrafficPolicies: TrafficPolicy[];
  IsTruncated: boolean;
  TrafficPolicyVersionMarker: string;
  MaxItems: number;
}
export const ListTrafficPolicyVersionsResponse = S.suspend(() =>
  S.Struct({
    TrafficPolicies: TrafficPolicies,
    IsTruncated: S.Boolean,
    TrafficPolicyVersionMarker: S.String,
    MaxItems: S.Number,
  }).pipe(ns),
).annotations({
  identifier: "ListTrafficPolicyVersionsResponse",
}) as any as S.Schema<ListTrafficPolicyVersionsResponse>;
export interface ListVPCAssociationAuthorizationsResponse {
  HostedZoneId: string;
  NextToken?: string;
  VPCs: VPC[];
}
export const ListVPCAssociationAuthorizationsResponse = S.suspend(() =>
  S.Struct({
    HostedZoneId: S.String,
    NextToken: S.optional(S.String),
    VPCs: VPCs,
  }).pipe(ns),
).annotations({
  identifier: "ListVPCAssociationAuthorizationsResponse",
}) as any as S.Schema<ListVPCAssociationAuthorizationsResponse>;
export interface TestDNSAnswerResponse {
  Nameserver: string;
  RecordName: string;
  RecordType: RRType;
  RecordData: string[];
  ResponseCode: string;
  Protocol: string;
}
export const TestDNSAnswerResponse = S.suspend(() =>
  S.Struct({
    Nameserver: S.String,
    RecordName: S.String,
    RecordType: RRType,
    RecordData: RecordData,
    ResponseCode: S.String,
    Protocol: S.String,
  }).pipe(ns),
).annotations({
  identifier: "TestDNSAnswerResponse",
}) as any as S.Schema<TestDNSAnswerResponse>;
export interface UpdateHealthCheckRequest {
  HealthCheckId: string;
  HealthCheckVersion?: number;
  IPAddress?: string;
  Port?: number;
  ResourcePath?: string;
  FullyQualifiedDomainName?: string;
  SearchString?: string;
  FailureThreshold?: number;
  Inverted?: boolean;
  Disabled?: boolean;
  HealthThreshold?: number;
  ChildHealthChecks?: string[];
  EnableSNI?: boolean;
  Regions?: HealthCheckRegion[];
  AlarmIdentifier?: AlarmIdentifier;
  InsufficientDataHealthStatus?: InsufficientDataHealthStatus;
  ResetElements?: ResettableElementName[];
}
export const UpdateHealthCheckRequest = S.suspend(() =>
  S.Struct({
    HealthCheckId: S.String.pipe(T.HttpLabel("HealthCheckId")),
    HealthCheckVersion: S.optional(S.Number),
    IPAddress: S.optional(S.String),
    Port: S.optional(S.Number),
    ResourcePath: S.optional(S.String),
    FullyQualifiedDomainName: S.optional(S.String),
    SearchString: S.optional(S.String),
    FailureThreshold: S.optional(S.Number),
    Inverted: S.optional(S.Boolean),
    Disabled: S.optional(S.Boolean),
    HealthThreshold: S.optional(S.Number),
    ChildHealthChecks: S.optional(ChildHealthCheckList),
    EnableSNI: S.optional(S.Boolean),
    Regions: S.optional(HealthCheckRegionList),
    AlarmIdentifier: S.optional(AlarmIdentifier),
    InsufficientDataHealthStatus: S.optional(InsufficientDataHealthStatus),
    ResetElements: S.optional(ResettableElementNameList),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2013-04-01/healthcheck/{HealthCheckId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateHealthCheckRequest",
}) as any as S.Schema<UpdateHealthCheckRequest>;
export interface UpdateHostedZoneCommentResponse {
  HostedZone: HostedZone;
}
export const UpdateHostedZoneCommentResponse = S.suspend(() =>
  S.Struct({ HostedZone: HostedZone }).pipe(ns),
).annotations({
  identifier: "UpdateHostedZoneCommentResponse",
}) as any as S.Schema<UpdateHostedZoneCommentResponse>;
export interface UpdateTrafficPolicyCommentResponse {
  TrafficPolicy: TrafficPolicy;
}
export const UpdateTrafficPolicyCommentResponse = S.suspend(() =>
  S.Struct({ TrafficPolicy: TrafficPolicy }).pipe(ns),
).annotations({
  identifier: "UpdateTrafficPolicyCommentResponse",
}) as any as S.Schema<UpdateTrafficPolicyCommentResponse>;
export interface UpdateTrafficPolicyInstanceResponse {
  TrafficPolicyInstance: TrafficPolicyInstance;
}
export const UpdateTrafficPolicyInstanceResponse = S.suspend(() =>
  S.Struct({ TrafficPolicyInstance: TrafficPolicyInstance }).pipe(ns),
).annotations({
  identifier: "UpdateTrafficPolicyInstanceResponse",
}) as any as S.Schema<UpdateTrafficPolicyInstanceResponse>;
export type ResourceRecordSetRegion =
  | "us-east-1"
  | "us-east-2"
  | "us-west-1"
  | "us-west-2"
  | "ca-central-1"
  | "eu-west-1"
  | "eu-west-2"
  | "eu-west-3"
  | "eu-central-1"
  | "eu-central-2"
  | "ap-southeast-1"
  | "ap-southeast-2"
  | "ap-southeast-3"
  | "ap-northeast-1"
  | "ap-northeast-2"
  | "ap-northeast-3"
  | "eu-north-1"
  | "sa-east-1"
  | "cn-north-1"
  | "cn-northwest-1"
  | "ap-east-1"
  | "me-south-1"
  | "me-central-1"
  | "ap-south-1"
  | "ap-south-2"
  | "af-south-1"
  | "eu-south-1"
  | "eu-south-2"
  | "ap-southeast-4"
  | "il-central-1"
  | "ca-west-1"
  | "ap-southeast-5"
  | "mx-central-1"
  | "ap-southeast-7"
  | "us-gov-east-1"
  | "us-gov-west-1"
  | "ap-east-2"
  | "ap-southeast-6"
  | "eusc-de-east-1";
export const ResourceRecordSetRegion = S.Literal(
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "ca-central-1",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "eu-central-1",
  "eu-central-2",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-southeast-3",
  "ap-northeast-1",
  "ap-northeast-2",
  "ap-northeast-3",
  "eu-north-1",
  "sa-east-1",
  "cn-north-1",
  "cn-northwest-1",
  "ap-east-1",
  "me-south-1",
  "me-central-1",
  "ap-south-1",
  "ap-south-2",
  "af-south-1",
  "eu-south-1",
  "eu-south-2",
  "ap-southeast-4",
  "il-central-1",
  "ca-west-1",
  "ap-southeast-5",
  "mx-central-1",
  "ap-southeast-7",
  "us-gov-east-1",
  "us-gov-west-1",
  "ap-east-2",
  "ap-southeast-6",
  "eusc-de-east-1",
);
export interface GeoLocation {
  ContinentCode?: string;
  CountryCode?: string;
  SubdivisionCode?: string;
}
export const GeoLocation = S.suspend(() =>
  S.Struct({
    ContinentCode: S.optional(S.String),
    CountryCode: S.optional(S.String),
    SubdivisionCode: S.optional(S.String),
  }),
).annotations({ identifier: "GeoLocation" }) as any as S.Schema<GeoLocation>;
export type ResourceRecordSetFailover = "PRIMARY" | "SECONDARY";
export const ResourceRecordSetFailover = S.Literal("PRIMARY", "SECONDARY");
export interface ResourceRecord {
  Value: string;
}
export const ResourceRecord = S.suspend(() =>
  S.Struct({ Value: S.String }),
).annotations({
  identifier: "ResourceRecord",
}) as any as S.Schema<ResourceRecord>;
export type ResourceRecords = ResourceRecord[];
export const ResourceRecords = S.Array(
  ResourceRecord.pipe(T.XmlName("ResourceRecord")).annotations({
    identifier: "ResourceRecord",
  }),
);
export interface AliasTarget {
  HostedZoneId: string;
  DNSName: string;
  EvaluateTargetHealth: boolean;
}
export const AliasTarget = S.suspend(() =>
  S.Struct({
    HostedZoneId: S.String,
    DNSName: S.String,
    EvaluateTargetHealth: S.Boolean,
  }),
).annotations({ identifier: "AliasTarget" }) as any as S.Schema<AliasTarget>;
export interface CidrRoutingConfig {
  CollectionId: string;
  LocationName: string;
}
export const CidrRoutingConfig = S.suspend(() =>
  S.Struct({ CollectionId: S.String, LocationName: S.String }),
).annotations({
  identifier: "CidrRoutingConfig",
}) as any as S.Schema<CidrRoutingConfig>;
export interface Coordinates {
  Latitude: string;
  Longitude: string;
}
export const Coordinates = S.suspend(() =>
  S.Struct({ Latitude: S.String, Longitude: S.String }),
).annotations({ identifier: "Coordinates" }) as any as S.Schema<Coordinates>;
export interface GeoProximityLocation {
  AWSRegion?: string;
  LocalZoneGroup?: string;
  Coordinates?: Coordinates;
  Bias?: number;
}
export const GeoProximityLocation = S.suspend(() =>
  S.Struct({
    AWSRegion: S.optional(S.String),
    LocalZoneGroup: S.optional(S.String),
    Coordinates: S.optional(Coordinates),
    Bias: S.optional(S.Number),
  }),
).annotations({
  identifier: "GeoProximityLocation",
}) as any as S.Schema<GeoProximityLocation>;
export interface ResourceRecordSet {
  Name: string;
  Type: RRType;
  SetIdentifier?: string;
  Weight?: number;
  Region?: ResourceRecordSetRegion;
  GeoLocation?: GeoLocation;
  Failover?: ResourceRecordSetFailover;
  MultiValueAnswer?: boolean;
  TTL?: number;
  ResourceRecords?: ResourceRecord[];
  AliasTarget?: AliasTarget;
  HealthCheckId?: string;
  TrafficPolicyInstanceId?: string;
  CidrRoutingConfig?: CidrRoutingConfig;
  GeoProximityLocation?: GeoProximityLocation;
}
export const ResourceRecordSet = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Type: RRType,
    SetIdentifier: S.optional(S.String),
    Weight: S.optional(S.Number),
    Region: S.optional(ResourceRecordSetRegion),
    GeoLocation: S.optional(GeoLocation),
    Failover: S.optional(ResourceRecordSetFailover),
    MultiValueAnswer: S.optional(S.Boolean),
    TTL: S.optional(S.Number),
    ResourceRecords: S.optional(ResourceRecords),
    AliasTarget: S.optional(AliasTarget),
    HealthCheckId: S.optional(S.String),
    TrafficPolicyInstanceId: S.optional(S.String),
    CidrRoutingConfig: S.optional(CidrRoutingConfig),
    GeoProximityLocation: S.optional(GeoProximityLocation),
  }),
).annotations({
  identifier: "ResourceRecordSet",
}) as any as S.Schema<ResourceRecordSet>;
export interface Change {
  Action: ChangeAction;
  ResourceRecordSet: ResourceRecordSet;
}
export const Change = S.suspend(() =>
  S.Struct({ Action: ChangeAction, ResourceRecordSet: ResourceRecordSet }),
).annotations({ identifier: "Change" }) as any as S.Schema<Change>;
export type Changes = Change[];
export const Changes = S.Array(
  Change.pipe(T.XmlName("Change")).annotations({ identifier: "Change" }),
);
export interface ChangeBatch {
  Comment?: string;
  Changes: Change[];
}
export const ChangeBatch = S.suspend(() =>
  S.Struct({ Comment: S.optional(S.String), Changes: Changes }),
).annotations({ identifier: "ChangeBatch" }) as any as S.Schema<ChangeBatch>;
export interface CidrCollection {
  Arn?: string;
  Id?: string;
  Name?: string;
  Version?: number;
}
export const CidrCollection = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Version: S.optional(S.Number),
  }),
).annotations({
  identifier: "CidrCollection",
}) as any as S.Schema<CidrCollection>;
export interface AccountLimit {
  Type: AccountLimitType;
  Value: number;
}
export const AccountLimit = S.suspend(() =>
  S.Struct({ Type: AccountLimitType, Value: S.Number }),
).annotations({ identifier: "AccountLimit" }) as any as S.Schema<AccountLimit>;
export interface DNSSECStatus {
  ServeSignature?: string;
  StatusMessage?: string;
}
export const DNSSECStatus = S.suspend(() =>
  S.Struct({
    ServeSignature: S.optional(S.String),
    StatusMessage: S.optional(S.String),
  }),
).annotations({ identifier: "DNSSECStatus" }) as any as S.Schema<DNSSECStatus>;
export interface HostedZoneLimit {
  Type: HostedZoneLimitType;
  Value: number;
}
export const HostedZoneLimit = S.suspend(() =>
  S.Struct({ Type: HostedZoneLimitType, Value: S.Number }),
).annotations({
  identifier: "HostedZoneLimit",
}) as any as S.Schema<HostedZoneLimit>;
export interface ReusableDelegationSetLimit {
  Type: ReusableDelegationSetLimitType;
  Value: number;
}
export const ReusableDelegationSetLimit = S.suspend(() =>
  S.Struct({ Type: ReusableDelegationSetLimitType, Value: S.Number }),
).annotations({
  identifier: "ReusableDelegationSetLimit",
}) as any as S.Schema<ReusableDelegationSetLimit>;
export interface CidrBlockSummary {
  CidrBlock?: string;
  LocationName?: string;
}
export const CidrBlockSummary = S.suspend(() =>
  S.Struct({
    CidrBlock: S.optional(S.String),
    LocationName: S.optional(S.String),
  }),
).annotations({
  identifier: "CidrBlockSummary",
}) as any as S.Schema<CidrBlockSummary>;
export type CidrBlockSummaries = CidrBlockSummary[];
export const CidrBlockSummaries = S.Array(CidrBlockSummary);
export interface CollectionSummary {
  Arn?: string;
  Id?: string;
  Name?: string;
  Version?: number;
}
export const CollectionSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Version: S.optional(S.Number),
  }),
).annotations({
  identifier: "CollectionSummary",
}) as any as S.Schema<CollectionSummary>;
export type CollectionSummaries = CollectionSummary[];
export const CollectionSummaries = S.Array(CollectionSummary);
export interface LocationSummary {
  LocationName?: string;
}
export const LocationSummary = S.suspend(() =>
  S.Struct({ LocationName: S.optional(S.String) }),
).annotations({
  identifier: "LocationSummary",
}) as any as S.Schema<LocationSummary>;
export type LocationSummaries = LocationSummary[];
export const LocationSummaries = S.Array(LocationSummary);
export interface TrafficPolicySummary {
  Id: string;
  Name: string;
  Type: RRType;
  LatestVersion: number;
  TrafficPolicyCount: number;
}
export const TrafficPolicySummary = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Name: S.String,
    Type: RRType,
    LatestVersion: S.Number,
    TrafficPolicyCount: S.Number,
  }),
).annotations({
  identifier: "TrafficPolicySummary",
}) as any as S.Schema<TrafficPolicySummary>;
export type TrafficPolicySummaries = TrafficPolicySummary[];
export const TrafficPolicySummaries = S.Array(
  TrafficPolicySummary.pipe(T.XmlName("TrafficPolicySummary")).annotations({
    identifier: "TrafficPolicySummary",
  }),
);
export interface ActivateKeySigningKeyResponse {
  ChangeInfo: ChangeInfo;
}
export const ActivateKeySigningKeyResponse = S.suspend(() =>
  S.Struct({ ChangeInfo: ChangeInfo }).pipe(ns),
).annotations({
  identifier: "ActivateKeySigningKeyResponse",
}) as any as S.Schema<ActivateKeySigningKeyResponse>;
export interface AssociateVPCWithHostedZoneResponse {
  ChangeInfo: ChangeInfo;
}
export const AssociateVPCWithHostedZoneResponse = S.suspend(() =>
  S.Struct({ ChangeInfo: ChangeInfo }).pipe(ns),
).annotations({
  identifier: "AssociateVPCWithHostedZoneResponse",
}) as any as S.Schema<AssociateVPCWithHostedZoneResponse>;
export interface ChangeCidrCollectionResponse {
  Id: string;
}
export const ChangeCidrCollectionResponse = S.suspend(() =>
  S.Struct({ Id: S.String }).pipe(ns),
).annotations({
  identifier: "ChangeCidrCollectionResponse",
}) as any as S.Schema<ChangeCidrCollectionResponse>;
export interface ChangeResourceRecordSetsRequest {
  HostedZoneId: string;
  ChangeBatch: ChangeBatch;
}
export const ChangeResourceRecordSetsRequest = S.suspend(() =>
  S.Struct({
    HostedZoneId: S.String.pipe(T.HttpLabel("HostedZoneId")),
    ChangeBatch: ChangeBatch,
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2013-04-01/hostedzone/{HostedZoneId}/rrset",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ChangeResourceRecordSetsRequest",
}) as any as S.Schema<ChangeResourceRecordSetsRequest>;
export interface CreateCidrCollectionResponse {
  Collection?: CidrCollection;
  Location?: string;
}
export const CreateCidrCollectionResponse = S.suspend(() =>
  S.Struct({
    Collection: S.optional(CidrCollection),
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
  }).pipe(ns),
).annotations({
  identifier: "CreateCidrCollectionResponse",
}) as any as S.Schema<CreateCidrCollectionResponse>;
export interface CreateHealthCheckResponse {
  HealthCheck: HealthCheck;
  Location: string;
}
export const CreateHealthCheckResponse = S.suspend(() =>
  S.Struct({
    HealthCheck: HealthCheck,
    Location: S.String.pipe(T.HttpHeader("Location")),
  }).pipe(ns),
).annotations({
  identifier: "CreateHealthCheckResponse",
}) as any as S.Schema<CreateHealthCheckResponse>;
export interface CreateHostedZoneResponse {
  HostedZone: HostedZone;
  ChangeInfo: ChangeInfo;
  DelegationSet: DelegationSet;
  VPC?: VPC;
  Location: string;
}
export const CreateHostedZoneResponse = S.suspend(() =>
  S.Struct({
    HostedZone: HostedZone,
    ChangeInfo: ChangeInfo,
    DelegationSet: DelegationSet,
    VPC: S.optional(VPC),
    Location: S.String.pipe(T.HttpHeader("Location")),
  }).pipe(ns),
).annotations({
  identifier: "CreateHostedZoneResponse",
}) as any as S.Schema<CreateHostedZoneResponse>;
export interface CreateKeySigningKeyResponse {
  ChangeInfo: ChangeInfo;
  KeySigningKey: KeySigningKey;
  Location: string;
}
export const CreateKeySigningKeyResponse = S.suspend(() =>
  S.Struct({
    ChangeInfo: ChangeInfo,
    KeySigningKey: KeySigningKey,
    Location: S.String.pipe(T.HttpHeader("Location")),
  }).pipe(ns),
).annotations({
  identifier: "CreateKeySigningKeyResponse",
}) as any as S.Schema<CreateKeySigningKeyResponse>;
export interface CreateQueryLoggingConfigResponse {
  QueryLoggingConfig: QueryLoggingConfig;
  Location: string;
}
export const CreateQueryLoggingConfigResponse = S.suspend(() =>
  S.Struct({
    QueryLoggingConfig: QueryLoggingConfig,
    Location: S.String.pipe(T.HttpHeader("Location")),
  }).pipe(ns),
).annotations({
  identifier: "CreateQueryLoggingConfigResponse",
}) as any as S.Schema<CreateQueryLoggingConfigResponse>;
export interface CreateReusableDelegationSetResponse {
  DelegationSet: DelegationSet;
  Location: string;
}
export const CreateReusableDelegationSetResponse = S.suspend(() =>
  S.Struct({
    DelegationSet: DelegationSet,
    Location: S.String.pipe(T.HttpHeader("Location")),
  }).pipe(ns),
).annotations({
  identifier: "CreateReusableDelegationSetResponse",
}) as any as S.Schema<CreateReusableDelegationSetResponse>;
export interface CreateTrafficPolicyResponse {
  TrafficPolicy: TrafficPolicy;
  Location: string;
}
export const CreateTrafficPolicyResponse = S.suspend(() =>
  S.Struct({
    TrafficPolicy: TrafficPolicy,
    Location: S.String.pipe(T.HttpHeader("Location")),
  }).pipe(ns),
).annotations({
  identifier: "CreateTrafficPolicyResponse",
}) as any as S.Schema<CreateTrafficPolicyResponse>;
export interface CreateTrafficPolicyInstanceResponse {
  TrafficPolicyInstance: TrafficPolicyInstance;
  Location: string;
}
export const CreateTrafficPolicyInstanceResponse = S.suspend(() =>
  S.Struct({
    TrafficPolicyInstance: TrafficPolicyInstance,
    Location: S.String.pipe(T.HttpHeader("Location")),
  }).pipe(ns),
).annotations({
  identifier: "CreateTrafficPolicyInstanceResponse",
}) as any as S.Schema<CreateTrafficPolicyInstanceResponse>;
export interface GetAccountLimitResponse {
  Limit: AccountLimit;
  Count: number;
}
export const GetAccountLimitResponse = S.suspend(() =>
  S.Struct({ Limit: AccountLimit, Count: S.Number }).pipe(ns),
).annotations({
  identifier: "GetAccountLimitResponse",
}) as any as S.Schema<GetAccountLimitResponse>;
export interface GetDNSSECResponse {
  Status: DNSSECStatus;
  KeySigningKeys: KeySigningKey[];
}
export const GetDNSSECResponse = S.suspend(() =>
  S.Struct({ Status: DNSSECStatus, KeySigningKeys: KeySigningKeys }).pipe(ns),
).annotations({
  identifier: "GetDNSSECResponse",
}) as any as S.Schema<GetDNSSECResponse>;
export interface GetGeoLocationResponse {
  GeoLocationDetails: GeoLocationDetails;
}
export const GetGeoLocationResponse = S.suspend(() =>
  S.Struct({ GeoLocationDetails: GeoLocationDetails }).pipe(ns),
).annotations({
  identifier: "GetGeoLocationResponse",
}) as any as S.Schema<GetGeoLocationResponse>;
export interface GetHostedZoneLimitResponse {
  Limit: HostedZoneLimit;
  Count: number;
}
export const GetHostedZoneLimitResponse = S.suspend(() =>
  S.Struct({ Limit: HostedZoneLimit, Count: S.Number }).pipe(ns),
).annotations({
  identifier: "GetHostedZoneLimitResponse",
}) as any as S.Schema<GetHostedZoneLimitResponse>;
export interface GetReusableDelegationSetLimitResponse {
  Limit: ReusableDelegationSetLimit;
  Count: number;
}
export const GetReusableDelegationSetLimitResponse = S.suspend(() =>
  S.Struct({ Limit: ReusableDelegationSetLimit, Count: S.Number }).pipe(ns),
).annotations({
  identifier: "GetReusableDelegationSetLimitResponse",
}) as any as S.Schema<GetReusableDelegationSetLimitResponse>;
export interface ListCidrBlocksResponse {
  NextToken?: string;
  CidrBlocks?: CidrBlockSummary[];
}
export const ListCidrBlocksResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    CidrBlocks: S.optional(CidrBlockSummaries),
  }).pipe(ns),
).annotations({
  identifier: "ListCidrBlocksResponse",
}) as any as S.Schema<ListCidrBlocksResponse>;
export interface ListCidrCollectionsResponse {
  NextToken?: string;
  CidrCollections?: CollectionSummary[];
}
export const ListCidrCollectionsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    CidrCollections: S.optional(CollectionSummaries),
  }).pipe(ns),
).annotations({
  identifier: "ListCidrCollectionsResponse",
}) as any as S.Schema<ListCidrCollectionsResponse>;
export interface ListCidrLocationsResponse {
  NextToken?: string;
  CidrLocations?: LocationSummary[];
}
export const ListCidrLocationsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    CidrLocations: S.optional(LocationSummaries),
  }).pipe(ns),
).annotations({
  identifier: "ListCidrLocationsResponse",
}) as any as S.Schema<ListCidrLocationsResponse>;
export interface ListTagsForResourceResponse {
  ResourceTagSet: ResourceTagSet;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ ResourceTagSet: ResourceTagSet }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ListTrafficPoliciesResponse {
  TrafficPolicySummaries: TrafficPolicySummary[];
  IsTruncated: boolean;
  TrafficPolicyIdMarker: string;
  MaxItems: number;
}
export const ListTrafficPoliciesResponse = S.suspend(() =>
  S.Struct({
    TrafficPolicySummaries: TrafficPolicySummaries,
    IsTruncated: S.Boolean,
    TrafficPolicyIdMarker: S.String,
    MaxItems: S.Number,
  }).pipe(ns),
).annotations({
  identifier: "ListTrafficPoliciesResponse",
}) as any as S.Schema<ListTrafficPoliciesResponse>;
export interface UpdateHealthCheckResponse {
  HealthCheck: HealthCheck;
}
export const UpdateHealthCheckResponse = S.suspend(() =>
  S.Struct({ HealthCheck: HealthCheck }).pipe(ns),
).annotations({
  identifier: "UpdateHealthCheckResponse",
}) as any as S.Schema<UpdateHealthCheckResponse>;
export interface HostedZoneOwner {
  OwningAccount?: string;
  OwningService?: string;
}
export const HostedZoneOwner = S.suspend(() =>
  S.Struct({
    OwningAccount: S.optional(S.String),
    OwningService: S.optional(S.String),
  }),
).annotations({
  identifier: "HostedZoneOwner",
}) as any as S.Schema<HostedZoneOwner>;
export interface HostedZoneSummary {
  HostedZoneId: string;
  Name: string;
  Owner: HostedZoneOwner;
}
export const HostedZoneSummary = S.suspend(() =>
  S.Struct({ HostedZoneId: S.String, Name: S.String, Owner: HostedZoneOwner }),
).annotations({
  identifier: "HostedZoneSummary",
}) as any as S.Schema<HostedZoneSummary>;
export type HostedZoneSummaries = HostedZoneSummary[];
export const HostedZoneSummaries = S.Array(
  HostedZoneSummary.pipe(T.XmlName("HostedZoneSummary")).annotations({
    identifier: "HostedZoneSummary",
  }),
);
export interface ChangeResourceRecordSetsResponse {
  ChangeInfo: ChangeInfo;
}
export const ChangeResourceRecordSetsResponse = S.suspend(() =>
  S.Struct({ ChangeInfo: ChangeInfo }).pipe(ns),
).annotations({
  identifier: "ChangeResourceRecordSetsResponse",
}) as any as S.Schema<ChangeResourceRecordSetsResponse>;
export interface GetHealthCheckLastFailureReasonResponse {
  HealthCheckObservations: HealthCheckObservation[];
}
export const GetHealthCheckLastFailureReasonResponse = S.suspend(() =>
  S.Struct({ HealthCheckObservations: HealthCheckObservations }).pipe(ns),
).annotations({
  identifier: "GetHealthCheckLastFailureReasonResponse",
}) as any as S.Schema<GetHealthCheckLastFailureReasonResponse>;
export interface ListHostedZonesByVPCResponse {
  HostedZoneSummaries: HostedZoneSummary[];
  MaxItems: number;
  NextToken?: string;
}
export const ListHostedZonesByVPCResponse = S.suspend(() =>
  S.Struct({
    HostedZoneSummaries: HostedZoneSummaries,
    MaxItems: S.Number,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListHostedZonesByVPCResponse",
}) as any as S.Schema<ListHostedZonesByVPCResponse>;
export type ErrorMessages = string[];
export const ErrorMessages = S.Array(S.String.pipe(T.XmlName("Message")));
export type ResourceRecordSets = ResourceRecordSet[];
export const ResourceRecordSets = S.Array(
  ResourceRecordSet.pipe(T.XmlName("ResourceRecordSet")).annotations({
    identifier: "ResourceRecordSet",
  }),
);
export interface GetHealthCheckResponse {
  HealthCheck: HealthCheck;
}
export const GetHealthCheckResponse = S.suspend(() =>
  S.Struct({ HealthCheck: HealthCheck }).pipe(ns),
).annotations({
  identifier: "GetHealthCheckResponse",
}) as any as S.Schema<GetHealthCheckResponse>;
export interface GetHostedZoneResponse {
  HostedZone: HostedZone;
  DelegationSet?: DelegationSet;
  VPCs?: VPC[];
}
export const GetHostedZoneResponse = S.suspend(() =>
  S.Struct({
    HostedZone: HostedZone,
    DelegationSet: S.optional(DelegationSet),
    VPCs: S.optional(VPCs),
  }).pipe(ns),
).annotations({
  identifier: "GetHostedZoneResponse",
}) as any as S.Schema<GetHostedZoneResponse>;
export interface ListResourceRecordSetsResponse {
  ResourceRecordSets: ResourceRecordSet[];
  IsTruncated: boolean;
  NextRecordName?: string;
  NextRecordType?: RRType;
  NextRecordIdentifier?: string;
  MaxItems: number;
}
export const ListResourceRecordSetsResponse = S.suspend(() =>
  S.Struct({
    ResourceRecordSets: ResourceRecordSets,
    IsTruncated: S.Boolean,
    NextRecordName: S.optional(S.String),
    NextRecordType: S.optional(RRType),
    NextRecordIdentifier: S.optional(S.String),
    MaxItems: S.Number,
  }).pipe(ns),
).annotations({
  identifier: "ListResourceRecordSetsResponse",
}) as any as S.Schema<ListResourceRecordSetsResponse>;

//# Errors
export class CidrCollectionInUseException extends S.TaggedError<CidrCollectionInUseException>()(
  "CidrCollectionInUseException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class HealthCheckInUse extends S.TaggedError<HealthCheckInUse>()(
  "HealthCheckInUse",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConcurrentModification extends S.TaggedError<ConcurrentModification>()(
  "ConcurrentModification",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class DelegationSetInUse extends S.TaggedError<DelegationSetInUse>()(
  "DelegationSetInUse",
  { message: S.optional(S.String) },
) {}
export class InvalidInput extends S.TaggedError<InvalidInput>()(
  "InvalidInput",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class HostedZoneNotEmpty extends S.TaggedError<HostedZoneNotEmpty>()(
  "HostedZoneNotEmpty",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class DelegationSetNotReusable extends S.TaggedError<DelegationSetNotReusable>()(
  "DelegationSetNotReusable",
  { message: S.optional(S.String) },
) {}
export class NoSuchTrafficPolicyInstance extends S.TaggedError<NoSuchTrafficPolicyInstance>()(
  "NoSuchTrafficPolicyInstance",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class DNSSECNotFound extends S.TaggedError<DNSSECNotFound>()(
  "DNSSECNotFound",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidVPCId extends S.TaggedError<InvalidVPCId>()(
  "InvalidVPCId",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoSuchChange extends S.TaggedError<NoSuchChange>()(
  "NoSuchChange",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoSuchHealthCheck extends S.TaggedError<NoSuchHealthCheck>()(
  "NoSuchHealthCheck",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoSuchQueryLoggingConfig extends S.TaggedError<NoSuchQueryLoggingConfig>()(
  "NoSuchQueryLoggingConfig",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoSuchTrafficPolicy extends S.TaggedError<NoSuchTrafficPolicy>()(
  "NoSuchTrafficPolicy",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class IncompatibleVersion extends S.TaggedError<IncompatibleVersion>()(
  "IncompatibleVersion",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidDomainName extends S.TaggedError<InvalidDomainName>()(
  "InvalidDomainName",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidPaginationToken extends S.TaggedError<InvalidPaginationToken>()(
  "InvalidPaginationToken",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoSuchHostedZone extends S.TaggedError<NoSuchHostedZone>()(
  "NoSuchHostedZone",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConflictingTypes extends S.TaggedError<ConflictingTypes>()(
  "ConflictingTypes",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidTrafficPolicyDocument extends S.TaggedError<InvalidTrafficPolicyDocument>()(
  "InvalidTrafficPolicyDocument",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidKeySigningKeyStatus extends S.TaggedError<InvalidKeySigningKeyStatus>()(
  "InvalidKeySigningKeyStatus",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoSuchCidrCollectionException extends S.TaggedError<NoSuchCidrCollectionException>()(
  "NoSuchCidrCollectionException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class LimitsExceeded extends S.TaggedError<LimitsExceeded>()(
  "LimitsExceeded",
  { message: S.optional(S.String) },
) {}
export class ConflictingDomainExists extends S.TaggedError<ConflictingDomainExists>()(
  "ConflictingDomainExists",
  { message: S.optional(S.String) },
) {}
export class CidrBlockInUseException extends S.TaggedError<CidrBlockInUseException>()(
  "CidrBlockInUseException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class CidrCollectionAlreadyExistsException extends S.TaggedError<CidrCollectionAlreadyExistsException>()(
  "CidrCollectionAlreadyExistsException",
  { Message: S.optional(S.String) },
) {}
export class HealthCheckAlreadyExists extends S.TaggedError<HealthCheckAlreadyExists>()(
  "HealthCheckAlreadyExists",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InvalidArgument extends S.TaggedError<InvalidArgument>()(
  "InvalidArgument",
  { message: S.optional(S.String) },
) {}
export class InsufficientCloudWatchLogsResourcePolicy extends S.TaggedError<InsufficientCloudWatchLogsResourcePolicy>()(
  "InsufficientCloudWatchLogsResourcePolicy",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class DelegationSetAlreadyCreated extends S.TaggedError<DelegationSetAlreadyCreated>()(
  "DelegationSetAlreadyCreated",
  { message: S.optional(S.String) },
) {}
export class NoSuchDelegationSet extends S.TaggedError<NoSuchDelegationSet>()(
  "NoSuchDelegationSet",
  { message: S.optional(S.String) },
) {}
export class PriorRequestNotComplete extends S.TaggedError<PriorRequestNotComplete>()(
  "PriorRequestNotComplete",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class LastVPCAssociation extends S.TaggedError<LastVPCAssociation>()(
  "LastVPCAssociation",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoSuchGeoLocation extends S.TaggedError<NoSuchGeoLocation>()(
  "NoSuchGeoLocation",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class HostedZoneNotPrivate extends S.TaggedError<HostedZoneNotPrivate>()(
  "HostedZoneNotPrivate",
  { message: S.optional(S.String) },
) {}
export class HealthCheckVersionMismatch extends S.TaggedError<HealthCheckVersionMismatch>()(
  "HealthCheckVersionMismatch",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class TooManyTrafficPolicyVersionsForCurrentPolicy extends S.TaggedError<TooManyTrafficPolicyVersionsForCurrentPolicy>()(
  "TooManyTrafficPolicyVersionsForCurrentPolicy",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidSigningStatus extends S.TaggedError<InvalidSigningStatus>()(
  "InvalidSigningStatus",
  { message: S.optional(S.String) },
) {}
export class HostedZonePartiallyDelegated extends S.TaggedError<HostedZonePartiallyDelegated>()(
  "HostedZonePartiallyDelegated",
  { message: S.optional(S.String) },
) {}
export class VPCAssociationAuthorizationNotFound extends S.TaggedError<VPCAssociationAuthorizationNotFound>()(
  "VPCAssociationAuthorizationNotFound",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyVPCAssociationAuthorizations extends S.TaggedError<TooManyVPCAssociationAuthorizations>()(
  "TooManyVPCAssociationAuthorizations",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TrafficPolicyInUse extends S.TaggedError<TrafficPolicyInUse>()(
  "TrafficPolicyInUse",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyTrafficPolicyInstances extends S.TaggedError<TooManyTrafficPolicyInstances>()(
  "TooManyTrafficPolicyInstances",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyTrafficPolicies extends S.TaggedError<TooManyTrafficPolicies>()(
  "TooManyTrafficPolicies",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidKMSArn extends S.TaggedError<InvalidKMSArn>()(
  "InvalidKMSArn",
  { message: S.optional(S.String) },
) {}
export class NoSuchCidrLocationException extends S.TaggedError<NoSuchCidrLocationException>()(
  "NoSuchCidrLocationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NotAuthorizedException extends S.TaggedError<NotAuthorizedException>()(
  "NotAuthorizedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class CidrCollectionVersionMismatchException extends S.TaggedError<CidrCollectionVersionMismatchException>()(
  "CidrCollectionVersionMismatchException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InvalidChangeBatch extends S.TaggedError<InvalidChangeBatch>()(
  "InvalidChangeBatch",
  { messages: S.optional(ErrorMessages), message: S.optional(S.String) },
) {}
export class TooManyHealthChecks extends S.TaggedError<TooManyHealthChecks>()(
  "TooManyHealthChecks",
  { message: S.optional(S.String) },
) {}
export class InvalidKeySigningKeyName extends S.TaggedError<InvalidKeySigningKeyName>()(
  "InvalidKeySigningKeyName",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoSuchCloudWatchLogsLogGroup extends S.TaggedError<NoSuchCloudWatchLogsLogGroup>()(
  "NoSuchCloudWatchLogsLogGroup",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class DelegationSetAlreadyReusable extends S.TaggedError<DelegationSetAlreadyReusable>()(
  "DelegationSetAlreadyReusable",
  { message: S.optional(S.String) },
) {}
export class VPCAssociationNotFound extends S.TaggedError<VPCAssociationNotFound>()(
  "VPCAssociationNotFound",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class DelegationSetNotAvailable extends S.TaggedError<DelegationSetNotAvailable>()(
  "DelegationSetNotAvailable",
  { message: S.optional(S.String) },
) {}
export class KeySigningKeyInParentDSRecord extends S.TaggedError<KeySigningKeyInParentDSRecord>()(
  "KeySigningKeyInParentDSRecord",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TrafficPolicyInstanceAlreadyExists extends S.TaggedError<TrafficPolicyInstanceAlreadyExists>()(
  "TrafficPolicyInstanceAlreadyExists",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class TrafficPolicyAlreadyExists extends S.TaggedError<TrafficPolicyAlreadyExists>()(
  "TrafficPolicyAlreadyExists",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class NoSuchKeySigningKey extends S.TaggedError<NoSuchKeySigningKey>()(
  "NoSuchKeySigningKey",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class KeySigningKeyWithActiveStatusNotFound extends S.TaggedError<KeySigningKeyWithActiveStatusNotFound>()(
  "KeySigningKeyWithActiveStatusNotFound",
  { message: S.optional(S.String) },
) {}
export class PublicZoneVPCAssociation extends S.TaggedError<PublicZoneVPCAssociation>()(
  "PublicZoneVPCAssociation",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class KeySigningKeyAlreadyExists extends S.TaggedError<KeySigningKeyAlreadyExists>()(
  "KeySigningKeyAlreadyExists",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class QueryLoggingConfigAlreadyExists extends S.TaggedError<QueryLoggingConfigAlreadyExists>()(
  "QueryLoggingConfigAlreadyExists",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class HostedZoneAlreadyExists extends S.TaggedError<HostedZoneAlreadyExists>()(
  "HostedZoneAlreadyExists",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class KeySigningKeyInUse extends S.TaggedError<KeySigningKeyInUse>()(
  "KeySigningKeyInUse",
  { message: S.optional(S.String) },
) {}
export class HostedZoneNotFound extends S.TaggedError<HostedZoneNotFound>()(
  "HostedZoneNotFound",
  { message: S.optional(S.String) },
) {}
export class TooManyKeySigningKeys extends S.TaggedError<TooManyKeySigningKeys>()(
  "TooManyKeySigningKeys",
  { message: S.optional(S.String) },
) {}
export class TooManyHostedZones extends S.TaggedError<TooManyHostedZones>()(
  "TooManyHostedZones",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Route 53 does not perform authorization for this API because it retrieves information
 * that is already available to the public.
 *
 * `GetCheckerIpRanges` still works, but we recommend that you download
 * ip-ranges.json, which includes IP address ranges for all Amazon Web Services
 * services. For more information, see IP Address Ranges
 * of Amazon Route 53 Servers in the Amazon Route 53 Developer
 * Guide.
 */
export const getCheckerIpRanges: (
  input: GetCheckerIpRangesRequest,
) => effect.Effect<
  GetCheckerIpRangesResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCheckerIpRangesRequest,
  output: GetCheckerIpRangesResponse,
  errors: [],
}));
/**
 * Retrieves the number of health checks that are associated with the current Amazon Web Services account.
 */
export const getHealthCheckCount: (
  input: GetHealthCheckCountRequest,
) => effect.Effect<
  GetHealthCheckCountResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetHealthCheckCountRequest,
  output: GetHealthCheckCountResponse,
  errors: [],
}));
/**
 * Gets the number of traffic policy instances that are associated with the current
 * Amazon Web Services account.
 */
export const getTrafficPolicyInstanceCount: (
  input: GetTrafficPolicyInstanceCountRequest,
) => effect.Effect<
  GetTrafficPolicyInstanceCountResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTrafficPolicyInstanceCountRequest,
  output: GetTrafficPolicyInstanceCountResponse,
  errors: [],
}));
/**
 * Retrieves a list of supported geographic locations.
 *
 * Countries are listed first, and continents are listed last. If Amazon Route 53
 * supports subdivisions for a country (for example, states or provinces), the subdivisions
 * for that country are listed in alphabetical order immediately after the corresponding
 * country.
 *
 * Route 53 does not perform authorization for this API because it retrieves information
 * that is already available to the public.
 *
 * For a list of supported geolocation codes, see the GeoLocation data
 * type.
 */
export const listGeoLocations: (
  input: ListGeoLocationsRequest,
) => effect.Effect<
  ListGeoLocationsResponse,
  InvalidInput | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListGeoLocationsRequest,
  output: ListGeoLocationsResponse,
  errors: [InvalidInput],
}));
/**
 * Retrieves a list of the reusable delegation sets that are associated with the current
 * Amazon Web Services account.
 */
export const listReusableDelegationSets: (
  input: ListReusableDelegationSetsRequest,
) => effect.Effect<
  ListReusableDelegationSetsResponse,
  InvalidInput | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListReusableDelegationSetsRequest,
  output: ListReusableDelegationSetsResponse,
  errors: [InvalidInput],
}));
/**
 * Retrieves the number of hosted zones that are associated with the current Amazon Web Services account.
 */
export const getHostedZoneCount: (
  input: GetHostedZoneCountRequest,
) => effect.Effect<
  GetHostedZoneCountResponse,
  InvalidInput | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetHostedZoneCountRequest,
  output: GetHostedZoneCountResponse,
  errors: [InvalidInput],
}));
/**
 * Gets the specified limit for the current account, for example, the maximum number of
 * health checks that you can create using the account.
 *
 * For the default limit, see Limits in the
 * *Amazon Route 53 Developer Guide*. To request a higher limit,
 * open a case.
 *
 * You can also view account limits in Amazon Web Services Trusted Advisor. Sign in to
 * the Amazon Web Services Management Console and open the Trusted Advisor console at https://console.aws.amazon.com/trustedadvisor/. Then choose **Service limits** in the navigation pane.
 */
export const getAccountLimit: (
  input: GetAccountLimitRequest,
) => effect.Effect<
  GetAccountLimitResponse,
  InvalidInput | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountLimitRequest,
  output: GetAccountLimitResponse,
  errors: [InvalidInput],
}));
/**
 * Returns the current status of a change batch request. The status is one of the
 * following values:
 *
 * - `PENDING` indicates that the changes in this request have not
 * propagated to all Amazon Route 53 DNS servers managing the hosted zone. This is the initial status of all
 * change batch requests.
 *
 * - `INSYNC` indicates that the changes have propagated to all Route 53
 * DNS servers managing the hosted zone.
 */
export const getChange: (
  input: GetChangeRequest,
) => effect.Effect<
  GetChangeResponse,
  InvalidInput | NoSuchChange | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetChangeRequest,
  output: GetChangeResponse,
  errors: [InvalidInput, NoSuchChange],
}));
/**
 * Gets status of a specified health check.
 *
 * This API is intended for use during development to diagnose behavior. It doesn’t
 * support production use-cases with high query rates that require immediate and
 * actionable responses.
 */
export const getHealthCheckStatus: (
  input: GetHealthCheckStatusRequest,
) => effect.Effect<
  GetHealthCheckStatusResponse,
  InvalidInput | NoSuchHealthCheck | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetHealthCheckStatusRequest,
  output: GetHealthCheckStatusResponse,
  errors: [InvalidInput, NoSuchHealthCheck],
}));
/**
 * Gets information about a specified configuration for DNS query logging.
 *
 * For more information about DNS query logs, see CreateQueryLoggingConfig and Logging DNS
 * Queries.
 */
export const getQueryLoggingConfig: (
  input: GetQueryLoggingConfigRequest,
) => effect.Effect<
  GetQueryLoggingConfigResponse,
  InvalidInput | NoSuchQueryLoggingConfig | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQueryLoggingConfigRequest,
  output: GetQueryLoggingConfigResponse,
  errors: [InvalidInput, NoSuchQueryLoggingConfig],
}));
/**
 * Gets information about a specific traffic policy version.
 *
 * For information about how of deleting a traffic policy affects the response from
 * `GetTrafficPolicy`, see DeleteTrafficPolicy.
 */
export const getTrafficPolicy: (
  input: GetTrafficPolicyRequest,
) => effect.Effect<
  GetTrafficPolicyResponse,
  InvalidInput | NoSuchTrafficPolicy | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTrafficPolicyRequest,
  output: GetTrafficPolicyResponse,
  errors: [InvalidInput, NoSuchTrafficPolicy],
}));
/**
 * Returns a paginated list of CIDR collections in the Amazon Web Services account
 * (metadata only).
 */
export const listCidrCollections: {
  (
    input: ListCidrCollectionsRequest,
  ): effect.Effect<
    ListCidrCollectionsResponse,
    InvalidInput | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCidrCollectionsRequest,
  ) => stream.Stream<
    ListCidrCollectionsResponse,
    InvalidInput | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCidrCollectionsRequest,
  ) => stream.Stream<
    CollectionSummary,
    InvalidInput | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCidrCollectionsRequest,
  output: ListCidrCollectionsResponse,
  errors: [InvalidInput],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "CidrCollections",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieve a list of the health checks that are associated with the current Amazon Web Services account.
 */
export const listHealthChecks: {
  (
    input: ListHealthChecksRequest,
  ): effect.Effect<
    ListHealthChecksResponse,
    IncompatibleVersion | InvalidInput | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListHealthChecksRequest,
  ) => stream.Stream<
    ListHealthChecksResponse,
    IncompatibleVersion | InvalidInput | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListHealthChecksRequest,
  ) => stream.Stream<
    HealthCheck,
    IncompatibleVersion | InvalidInput | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListHealthChecksRequest,
  output: ListHealthChecksResponse,
  errors: [IncompatibleVersion, InvalidInput],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "HealthChecks",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Retrieves a list of your hosted zones in lexicographic order. The response includes a
 * `HostedZones` child element for each hosted zone created by the current
 * Amazon Web Services account.
 *
 * `ListHostedZonesByName` sorts hosted zones by name with the labels
 * reversed. For example:
 *
 * `com.example.www.`
 *
 * Note the trailing dot, which can change the sort order in some circumstances.
 *
 * If the domain name includes escape characters or Punycode,
 * `ListHostedZonesByName` alphabetizes the domain name using the escaped or
 * Punycoded value, which is the format that Amazon Route 53 saves in its database. For
 * example, to create a hosted zone for exämple.com, you specify ex\344mple.com for
 * the domain name. `ListHostedZonesByName` alphabetizes it as:
 *
 * `com.ex\344mple.`
 *
 * The labels are reversed and alphabetized using the escaped value. For more information
 * about valid domain name formats, including internationalized domain names, see DNS
 * Domain Name Format in the Amazon Route 53 Developer
 * Guide.
 *
 * Route 53 returns up to 100 items in each response. If you have a lot of hosted zones,
 * use the `MaxItems` parameter to list them in groups of up to 100. The
 * response includes values that help navigate from one group of `MaxItems`
 * hosted zones to the next:
 *
 * - The `DNSName` and `HostedZoneId` elements in the
 * response contain the values, if any, specified for the `dnsname` and
 * `hostedzoneid` parameters in the request that produced the
 * current response.
 *
 * - The `MaxItems` element in the response contains the value, if any,
 * that you specified for the `maxitems` parameter in the request that
 * produced the current response.
 *
 * - If the value of `IsTruncated` in the response is true, there are
 * more hosted zones associated with the current Amazon Web Services account.
 *
 * If `IsTruncated` is false, this response includes the last hosted
 * zone that is associated with the current account. The `NextDNSName`
 * element and `NextHostedZoneId` elements are omitted from the
 * response.
 *
 * - The `NextDNSName` and `NextHostedZoneId` elements in the
 * response contain the domain name and the hosted zone ID of the next hosted zone
 * that is associated with the current Amazon Web Services account. If you want to
 * list more hosted zones, make another call to `ListHostedZonesByName`,
 * and specify the value of `NextDNSName` and
 * `NextHostedZoneId` in the `dnsname` and
 * `hostedzoneid` parameters, respectively.
 */
export const listHostedZonesByName: (
  input: ListHostedZonesByNameRequest,
) => effect.Effect<
  ListHostedZonesByNameResponse,
  InvalidDomainName | InvalidInput | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListHostedZonesByNameRequest,
  output: ListHostedZonesByNameResponse,
  errors: [InvalidDomainName, InvalidInput],
}));
/**
 * Gets information about the latest version for every traffic policy that is associated
 * with the current Amazon Web Services account. Policies are listed in the order that they
 * were created in.
 *
 * For information about how of deleting a traffic policy affects the response from
 * `ListTrafficPolicies`, see DeleteTrafficPolicy.
 */
export const listTrafficPolicies: (
  input: ListTrafficPoliciesRequest,
) => effect.Effect<
  ListTrafficPoliciesResponse,
  InvalidInput | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTrafficPoliciesRequest,
  output: ListTrafficPoliciesResponse,
  errors: [InvalidInput],
}));
/**
 * Gets information about the traffic policy instances that you created in a specified
 * hosted zone.
 *
 * After you submit a `CreateTrafficPolicyInstance` or an
 * `UpdateTrafficPolicyInstance` request, there's a brief delay while
 * Amazon Route 53 creates the resource record sets that are specified in the traffic
 * policy definition. For more information, see the `State` response
 * element.
 *
 * Route 53 returns a maximum of 100 items in each response. If you have a lot of traffic
 * policy instances, you can use the `MaxItems` parameter to list them in groups
 * of up to 100.
 */
export const listTrafficPolicyInstancesByHostedZone: (
  input: ListTrafficPolicyInstancesByHostedZoneRequest,
) => effect.Effect<
  ListTrafficPolicyInstancesByHostedZoneResponse,
  InvalidInput | NoSuchHostedZone | NoSuchTrafficPolicyInstance | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTrafficPolicyInstancesByHostedZoneRequest,
  output: ListTrafficPolicyInstancesByHostedZoneResponse,
  errors: [InvalidInput, NoSuchHostedZone, NoSuchTrafficPolicyInstance],
}));
/**
 * Deletes a CIDR collection in the current Amazon Web Services account. The collection
 * must be empty before it can be deleted.
 */
export const deleteCidrCollection: (
  input: DeleteCidrCollectionRequest,
) => effect.Effect<
  DeleteCidrCollectionResponse,
  | CidrCollectionInUseException
  | ConcurrentModification
  | InvalidInput
  | NoSuchCidrCollectionException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCidrCollectionRequest,
  output: DeleteCidrCollectionResponse,
  errors: [
    CidrCollectionInUseException,
    ConcurrentModification,
    InvalidInput,
    NoSuchCidrCollectionException,
  ],
}));
/**
 * Gets information about a specified traffic policy instance.
 *
 * Use `GetTrafficPolicyInstance` with the `id` of new traffic policy instance to confirm that the
 * `CreateTrafficPolicyInstance` or an `UpdateTrafficPolicyInstance` request completed successfully.
 * For more information, see the `State` response
 * element.
 *
 * In the Route 53 console, traffic policy instances are known as policy
 * records.
 */
export const getTrafficPolicyInstance: (
  input: GetTrafficPolicyInstanceRequest,
) => effect.Effect<
  GetTrafficPolicyInstanceResponse,
  InvalidInput | NoSuchTrafficPolicyInstance | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTrafficPolicyInstanceRequest,
  output: GetTrafficPolicyInstanceResponse,
  errors: [InvalidInput, NoSuchTrafficPolicyInstance],
}));
/**
 * Gets information about the traffic policy instances that you created by using the
 * current Amazon Web Services account.
 *
 * After you submit an `UpdateTrafficPolicyInstance` request, there's a
 * brief delay while Amazon Route 53 creates the resource record sets that are
 * specified in the traffic policy definition. For more information, see the
 * `State` response element.
 *
 * Route 53 returns a maximum of 100 items in each response. If you have a lot of traffic
 * policy instances, you can use the `MaxItems` parameter to list them in groups
 * of up to 100.
 */
export const listTrafficPolicyInstances: (
  input: ListTrafficPolicyInstancesRequest,
) => effect.Effect<
  ListTrafficPolicyInstancesResponse,
  InvalidInput | NoSuchTrafficPolicyInstance | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTrafficPolicyInstancesRequest,
  output: ListTrafficPolicyInstancesResponse,
  errors: [InvalidInput, NoSuchTrafficPolicyInstance],
}));
/**
 * Deletes a health check.
 *
 * Amazon Route 53 does not prevent you from deleting a health check even if the
 * health check is associated with one or more resource record sets. If you delete a
 * health check and you don't update the associated resource record sets, the future
 * status of the health check can't be predicted and may change. This will affect the
 * routing of DNS queries for your DNS failover configuration. For more information,
 * see Replacing and Deleting Health Checks in the Amazon Route 53
 * Developer Guide.
 *
 * If you're using Cloud Map and you configured Cloud Map to create a Route 53
 * health check when you register an instance, you can't use the Route 53
 * `DeleteHealthCheck` command to delete the health check. The health check
 * is deleted automatically when you deregister the instance; there can be a delay of
 * several hours before the health check is deleted from Route 53.
 */
export const deleteHealthCheck: (
  input: DeleteHealthCheckRequest,
) => effect.Effect<
  DeleteHealthCheckResponse,
  HealthCheckInUse | InvalidInput | NoSuchHealthCheck | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteHealthCheckRequest,
  output: DeleteHealthCheckResponse,
  errors: [HealthCheckInUse, InvalidInput, NoSuchHealthCheck],
}));
/**
 * Deletes a configuration for DNS query logging. If you delete a configuration, Amazon
 * Route 53 stops sending query logs to CloudWatch Logs. Route 53 doesn't delete any logs
 * that are already in CloudWatch Logs.
 *
 * For more information about DNS query logs, see CreateQueryLoggingConfig.
 */
export const deleteQueryLoggingConfig: (
  input: DeleteQueryLoggingConfigRequest,
) => effect.Effect<
  DeleteQueryLoggingConfigResponse,
  | ConcurrentModification
  | InvalidInput
  | NoSuchQueryLoggingConfig
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteQueryLoggingConfigRequest,
  output: DeleteQueryLoggingConfigResponse,
  errors: [ConcurrentModification, InvalidInput, NoSuchQueryLoggingConfig],
}));
/**
 * Gets information about the traffic policy instances that you created by using a
 * specify traffic policy version.
 *
 * After you submit a `CreateTrafficPolicyInstance` or an
 * `UpdateTrafficPolicyInstance` request, there's a brief delay while
 * Amazon Route 53 creates the resource record sets that are specified in the traffic
 * policy definition. For more information, see the `State` response
 * element.
 *
 * Route 53 returns a maximum of 100 items in each response. If you have a lot of traffic
 * policy instances, you can use the `MaxItems` parameter to list them in groups
 * of up to 100.
 */
export const listTrafficPolicyInstancesByPolicy: (
  input: ListTrafficPolicyInstancesByPolicyRequest,
) => effect.Effect<
  ListTrafficPolicyInstancesByPolicyResponse,
  | InvalidInput
  | NoSuchTrafficPolicy
  | NoSuchTrafficPolicyInstance
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTrafficPolicyInstancesByPolicyRequest,
  output: ListTrafficPolicyInstancesByPolicyResponse,
  errors: [InvalidInput, NoSuchTrafficPolicy, NoSuchTrafficPolicyInstance],
}));
/**
 * Gets information about all of the versions for a specified traffic policy.
 *
 * Traffic policy versions are listed in numerical order by
 * `VersionNumber`.
 */
export const listTrafficPolicyVersions: (
  input: ListTrafficPolicyVersionsRequest,
) => effect.Effect<
  ListTrafficPolicyVersionsResponse,
  InvalidInput | NoSuchTrafficPolicy | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTrafficPolicyVersionsRequest,
  output: ListTrafficPolicyVersionsResponse,
  errors: [InvalidInput, NoSuchTrafficPolicy],
}));
/**
 * Updates the comment for a specified traffic policy version.
 */
export const updateTrafficPolicyComment: (
  input: UpdateTrafficPolicyCommentRequest,
) => effect.Effect<
  UpdateTrafficPolicyCommentResponse,
  ConcurrentModification | InvalidInput | NoSuchTrafficPolicy | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTrafficPolicyCommentRequest,
  output: UpdateTrafficPolicyCommentResponse,
  errors: [ConcurrentModification, InvalidInput, NoSuchTrafficPolicy],
}));
/**
 * Gets a list of the VPCs that were created by other accounts and that can be associated
 * with a specified hosted zone because you've submitted one or more
 * `CreateVPCAssociationAuthorization` requests.
 *
 * The response includes a `VPCs` element with a `VPC` child
 * element for each VPC that can be associated with the hosted zone.
 */
export const listVPCAssociationAuthorizations: (
  input: ListVPCAssociationAuthorizationsRequest,
) => effect.Effect<
  ListVPCAssociationAuthorizationsResponse,
  InvalidInput | InvalidPaginationToken | NoSuchHostedZone | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListVPCAssociationAuthorizationsRequest,
  output: ListVPCAssociationAuthorizationsResponse,
  errors: [InvalidInput, InvalidPaginationToken, NoSuchHostedZone],
}));
/**
 * Gets the value that Amazon Route 53 returns in response to a DNS request for a
 * specified record name and type. You can optionally specify the IP address of a DNS
 * resolver, an EDNS0 client subnet IP address, and a subnet mask.
 *
 * This call only supports querying public hosted zones.
 *
 * The `TestDnsAnswer ` returns information similar to what you would expect from the answer
 * section of the `dig` command. Therefore, if you query for the name
 * servers of a subdomain that point to the parent name servers, those will not be
 * returned.
 */
export const testDNSAnswer: (
  input: TestDNSAnswerRequest,
) => effect.Effect<
  TestDNSAnswerResponse,
  InvalidInput | NoSuchHostedZone | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestDNSAnswerRequest,
  output: TestDNSAnswerResponse,
  errors: [InvalidInput, NoSuchHostedZone],
}));
/**
 * Lists the configurations for DNS query logging that are associated with the current
 * Amazon Web Services account or the configuration that is associated with a specified
 * hosted zone.
 *
 * For more information about DNS query logs, see CreateQueryLoggingConfig. Additional information, including the format of
 * DNS query logs, appears in Logging DNS Queries in
 * the *Amazon Route 53 Developer Guide*.
 */
export const listQueryLoggingConfigs: {
  (
    input: ListQueryLoggingConfigsRequest,
  ): effect.Effect<
    ListQueryLoggingConfigsResponse,
    InvalidInput | InvalidPaginationToken | NoSuchHostedZone | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListQueryLoggingConfigsRequest,
  ) => stream.Stream<
    ListQueryLoggingConfigsResponse,
    InvalidInput | InvalidPaginationToken | NoSuchHostedZone | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListQueryLoggingConfigsRequest,
  ) => stream.Stream<
    QueryLoggingConfig,
    InvalidInput | InvalidPaginationToken | NoSuchHostedZone | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListQueryLoggingConfigsRequest,
  output: ListQueryLoggingConfigsResponse,
  errors: [InvalidInput, InvalidPaginationToken, NoSuchHostedZone],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "QueryLoggingConfigs",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a paginated list of CIDR locations for the given collection (metadata only,
 * does not include CIDR blocks).
 */
export const listCidrLocations: {
  (
    input: ListCidrLocationsRequest,
  ): effect.Effect<
    ListCidrLocationsResponse,
    InvalidInput | NoSuchCidrCollectionException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCidrLocationsRequest,
  ) => stream.Stream<
    ListCidrLocationsResponse,
    InvalidInput | NoSuchCidrCollectionException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCidrLocationsRequest,
  ) => stream.Stream<
    LocationSummary,
    InvalidInput | NoSuchCidrCollectionException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCidrLocationsRequest,
  output: ListCidrLocationsResponse,
  errors: [InvalidInput, NoSuchCidrCollectionException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "CidrLocations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates a CIDR collection in the current Amazon Web Services account.
 */
export const createCidrCollection: (
  input: CreateCidrCollectionRequest,
) => effect.Effect<
  CreateCidrCollectionResponse,
  | CidrCollectionAlreadyExistsException
  | ConcurrentModification
  | InvalidInput
  | LimitsExceeded
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCidrCollectionRequest,
  output: CreateCidrCollectionResponse,
  errors: [
    CidrCollectionAlreadyExistsException,
    ConcurrentModification,
    InvalidInput,
    LimitsExceeded,
  ],
}));
/**
 * Deletes a reusable delegation set.
 *
 * You can delete a reusable delegation set only if it isn't associated with any
 * hosted zones.
 *
 * To verify that the reusable delegation set is not associated with any hosted zones,
 * submit a GetReusableDelegationSet request and specify the ID of the reusable
 * delegation set that you want to delete.
 */
export const deleteReusableDelegationSet: (
  input: DeleteReusableDelegationSetRequest,
) => effect.Effect<
  DeleteReusableDelegationSetResponse,
  | DelegationSetInUse
  | DelegationSetNotReusable
  | InvalidInput
  | NoSuchDelegationSet
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteReusableDelegationSetRequest,
  output: DeleteReusableDelegationSetResponse,
  errors: [
    DelegationSetInUse,
    DelegationSetNotReusable,
    InvalidInput,
    NoSuchDelegationSet,
  ],
}));
/**
 * Deletes a traffic policy instance and all of the resource record sets that Amazon
 * Route 53 created when you created the instance.
 *
 * In the Route 53 console, traffic policy instances are known as policy
 * records.
 */
export const deleteTrafficPolicyInstance: (
  input: DeleteTrafficPolicyInstanceRequest,
) => effect.Effect<
  DeleteTrafficPolicyInstanceResponse,
  | InvalidInput
  | NoSuchTrafficPolicyInstance
  | PriorRequestNotComplete
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTrafficPolicyInstanceRequest,
  output: DeleteTrafficPolicyInstanceResponse,
  errors: [InvalidInput, NoSuchTrafficPolicyInstance, PriorRequestNotComplete],
}));
/**
 * Gets information about whether a specified geographic location is supported for Amazon
 * Route 53 geolocation resource record sets.
 *
 * Route 53 does not perform authorization for this API because it retrieves information
 * that is already available to the public.
 *
 * Use the following syntax to determine whether a continent is supported for
 * geolocation:
 *
 * GET /2013-04-01/geolocation?continentcode=two-letter abbreviation for
 * a continent
 *
 * Use the following syntax to determine whether a country is supported for
 * geolocation:
 *
 * GET /2013-04-01/geolocation?countrycode=two-character country
 * code
 *
 * Use the following syntax to determine whether a subdivision of a country is supported
 * for geolocation:
 *
 * GET /2013-04-01/geolocation?countrycode=two-character country
 * code&subdivisioncode=subdivision
 * code
 */
export const getGeoLocation: (
  input: GetGeoLocationRequest,
) => effect.Effect<
  GetGeoLocationResponse,
  InvalidInput | NoSuchGeoLocation | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGeoLocationRequest,
  output: GetGeoLocationResponse,
  errors: [InvalidInput, NoSuchGeoLocation],
}));
/**
 * Gets the reason that a specified health check failed most recently.
 */
export const getHealthCheckLastFailureReason: (
  input: GetHealthCheckLastFailureReasonRequest,
) => effect.Effect<
  GetHealthCheckLastFailureReasonResponse,
  InvalidInput | NoSuchHealthCheck | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetHealthCheckLastFailureReasonRequest,
  output: GetHealthCheckLastFailureReasonResponse,
  errors: [InvalidInput, NoSuchHealthCheck],
}));
/**
 * Gets the specified limit for a specified hosted zone, for example, the maximum number
 * of records that you can create in the hosted zone.
 *
 * For the default limit, see Limits in the
 * *Amazon Route 53 Developer Guide*. To request a higher limit,
 * open a case.
 */
export const getHostedZoneLimit: (
  input: GetHostedZoneLimitRequest,
) => effect.Effect<
  GetHostedZoneLimitResponse,
  HostedZoneNotPrivate | InvalidInput | NoSuchHostedZone | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetHostedZoneLimitRequest,
  output: GetHostedZoneLimitResponse,
  errors: [HostedZoneNotPrivate, InvalidInput, NoSuchHostedZone],
}));
/**
 * Lists all the private hosted zones that a specified VPC is associated with, regardless
 * of which Amazon Web Services account or Amazon Web Services service owns the hosted zones.
 * The `HostedZoneOwner` structure in the response contains one of the following
 * values:
 *
 * - An `OwningAccount` element, which contains the account number of
 * either the current Amazon Web Services account or another Amazon Web Services account. Some services, such as Cloud Map, create
 * hosted zones using the current account.
 *
 * - An `OwningService` element, which identifies the Amazon Web Services
 * service that created and owns the hosted zone. For example, if a hosted zone was
 * created by Amazon Elastic File System (Amazon EFS), the value of
 * `Owner` is `efs.amazonaws.com`.
 *
 * `ListHostedZonesByVPC` returns the hosted zones associated with the specified VPC and does not reflect the hosted zone
 * associations to VPCs via Route 53 Profiles. To get the associations to a Profile, call the ListProfileResourceAssociations API.
 *
 * When listing private hosted zones, the hosted zone and the Amazon VPC must
 * belong to the same partition where the hosted zones were created. A partition is a
 * group of Amazon Web Services Regions. Each Amazon Web Services account is scoped to
 * one partition.
 *
 * The following are the supported partitions:
 *
 * - `aws` - Amazon Web Services Regions
 *
 * - `aws-cn` - China Regions
 *
 * - `aws-us-gov` - Amazon Web Services GovCloud (US) Region
 *
 * For more information, see Access Management
 * in the *Amazon Web Services General Reference*.
 */
export const listHostedZonesByVPC: (
  input: ListHostedZonesByVPCRequest,
) => effect.Effect<
  ListHostedZonesByVPCResponse,
  InvalidInput | InvalidPaginationToken | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListHostedZonesByVPCRequest,
  output: ListHostedZonesByVPCResponse,
  errors: [InvalidInput, InvalidPaginationToken],
}));
/**
 * Updates an existing health check. Note that some values can't be updated.
 *
 * For more information about updating health checks, see Creating,
 * Updating, and Deleting Health Checks in the Amazon Route 53
 * Developer Guide.
 */
export const updateHealthCheck: (
  input: UpdateHealthCheckRequest,
) => effect.Effect<
  UpdateHealthCheckResponse,
  HealthCheckVersionMismatch | InvalidInput | NoSuchHealthCheck | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateHealthCheckRequest,
  output: UpdateHealthCheckResponse,
  errors: [HealthCheckVersionMismatch, InvalidInput, NoSuchHealthCheck],
}));
/**
 * Returns information about DNSSEC for a specific hosted zone, including the key-signing
 * keys (KSKs) in the hosted zone.
 */
export const getDNSSEC: (
  input: GetDNSSECRequest,
) => effect.Effect<
  GetDNSSECResponse,
  InvalidArgument | InvalidInput | NoSuchHostedZone | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDNSSECRequest,
  output: GetDNSSECResponse,
  errors: [InvalidArgument, InvalidInput, NoSuchHostedZone],
}));
/**
 * Creates a new version of an existing traffic policy. When you create a new version of
 * a traffic policy, you specify the ID of the traffic policy that you want to update and a
 * JSON-formatted document that describes the new version. You use traffic policies to
 * create multiple DNS resource record sets for one domain name (such as example.com) or
 * one subdomain name (such as www.example.com). You can create a maximum of 1000 versions
 * of a traffic policy. If you reach the limit and need to create another version, you'll
 * need to start a new traffic policy.
 */
export const createTrafficPolicyVersion: (
  input: CreateTrafficPolicyVersionRequest,
) => effect.Effect<
  CreateTrafficPolicyVersionResponse,
  | ConcurrentModification
  | InvalidInput
  | InvalidTrafficPolicyDocument
  | NoSuchTrafficPolicy
  | TooManyTrafficPolicyVersionsForCurrentPolicy
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTrafficPolicyVersionRequest,
  output: CreateTrafficPolicyVersionResponse,
  errors: [
    ConcurrentModification,
    InvalidInput,
    InvalidTrafficPolicyDocument,
    NoSuchTrafficPolicy,
    TooManyTrafficPolicyVersionsForCurrentPolicy,
  ],
}));
/**
 * Gets the maximum number of hosted zones that you can associate with the specified
 * reusable delegation set.
 *
 * For the default limit, see Limits in the
 * *Amazon Route 53 Developer Guide*. To request a higher limit,
 * open a case.
 */
export const getReusableDelegationSetLimit: (
  input: GetReusableDelegationSetLimitRequest,
) => effect.Effect<
  GetReusableDelegationSetLimitResponse,
  InvalidInput | NoSuchDelegationSet | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReusableDelegationSetLimitRequest,
  output: GetReusableDelegationSetLimitResponse,
  errors: [InvalidInput, NoSuchDelegationSet],
}));
/**
 * Retrieves information about a specified reusable delegation set, including the four
 * name servers that are assigned to the delegation set.
 */
export const getReusableDelegationSet: (
  input: GetReusableDelegationSetRequest,
) => effect.Effect<
  GetReusableDelegationSetResponse,
  DelegationSetNotReusable | InvalidInput | NoSuchDelegationSet | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReusableDelegationSetRequest,
  output: GetReusableDelegationSetResponse,
  errors: [DelegationSetNotReusable, InvalidInput, NoSuchDelegationSet],
}));
/**
 * Retrieves a list of the public and private hosted zones that are associated with the
 * current Amazon Web Services account. The response includes a `HostedZones`
 * child element for each hosted zone.
 *
 * Amazon Route 53 returns a maximum of 100 items in each response. If you have a lot of
 * hosted zones, you can use the `maxitems` parameter to list them in groups of
 * up to 100.
 */
export const listHostedZones: {
  (
    input: ListHostedZonesRequest,
  ): effect.Effect<
    ListHostedZonesResponse,
    | DelegationSetNotReusable
    | InvalidInput
    | NoSuchDelegationSet
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListHostedZonesRequest,
  ) => stream.Stream<
    ListHostedZonesResponse,
    | DelegationSetNotReusable
    | InvalidInput
    | NoSuchDelegationSet
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListHostedZonesRequest,
  ) => stream.Stream<
    HostedZone,
    | DelegationSetNotReusable
    | InvalidInput
    | NoSuchDelegationSet
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListHostedZonesRequest,
  output: ListHostedZonesResponse,
  errors: [DelegationSetNotReusable, InvalidInput, NoSuchDelegationSet],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "HostedZones",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * After you submit a `UpdateTrafficPolicyInstance` request, there's a brief delay while Route 53 creates the resource record sets
 * that are specified in the traffic policy definition. Use `GetTrafficPolicyInstance` with the `id` of updated traffic policy instance confirm
 * that the
 * `UpdateTrafficPolicyInstance` request completed successfully. For more information, see the `State` response element.
 *
 * Updates the resource record sets in a specified hosted zone that were created based on
 * the settings in a specified traffic policy version.
 *
 * When you update a traffic policy instance, Amazon Route 53 continues to respond to DNS
 * queries for the root resource record set name (such as example.com) while it replaces
 * one group of resource record sets with another. Route 53 performs the following
 * operations:
 *
 * - Route 53 creates a new group of resource record sets based on the specified
 * traffic policy. This is true regardless of how significant the differences are
 * between the existing resource record sets and the new resource record sets.
 *
 * - When all of the new resource record sets have been created, Route 53 starts to
 * respond to DNS queries for the root resource record set name (such as
 * example.com) by using the new resource record sets.
 *
 * - Route 53 deletes the old group of resource record sets that are associated
 * with the root resource record set name.
 */
export const updateTrafficPolicyInstance: (
  input: UpdateTrafficPolicyInstanceRequest,
) => effect.Effect<
  UpdateTrafficPolicyInstanceResponse,
  | ConflictingTypes
  | InvalidInput
  | NoSuchTrafficPolicy
  | NoSuchTrafficPolicyInstance
  | PriorRequestNotComplete
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTrafficPolicyInstanceRequest,
  output: UpdateTrafficPolicyInstanceResponse,
  errors: [
    ConflictingTypes,
    InvalidInput,
    NoSuchTrafficPolicy,
    NoSuchTrafficPolicyInstance,
    PriorRequestNotComplete,
  ],
}));
/**
 * Updates the features configuration for a hosted zone. This operation allows you to enable or disable specific features for your hosted zone, such as accelerated recovery.
 *
 * Accelerated recovery enables you to update DNS records in your public hosted zone even when the us-east-1 region is unavailable.
 */
export const updateHostedZoneFeatures: (
  input: UpdateHostedZoneFeaturesRequest,
) => effect.Effect<
  UpdateHostedZoneFeaturesResponse,
  | InvalidInput
  | LimitsExceeded
  | NoSuchHostedZone
  | PriorRequestNotComplete
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateHostedZoneFeaturesRequest,
  output: UpdateHostedZoneFeaturesResponse,
  errors: [
    InvalidInput,
    LimitsExceeded,
    NoSuchHostedZone,
    PriorRequestNotComplete,
  ],
}));
/**
 * Deletes a hosted zone.
 *
 * If the hosted zone was created by another service, such as Cloud Map, see
 * Deleting Public Hosted Zones That Were Created by Another Service in the
 * *Amazon Route 53 Developer Guide* for information
 * about how to delete it. (The process is the same for public and private hosted zones
 * that were created by another service.)
 *
 * If you want to keep your domain registration but you want to stop routing internet
 * traffic to your website or web application, we recommend that you delete resource record
 * sets in the hosted zone instead of deleting the hosted zone.
 *
 * If you delete a hosted zone, you can't undelete it. You must create a new hosted
 * zone and update the name servers for your domain registration, which can require up
 * to 48 hours to take effect. (If you delegated responsibility for a subdomain to a
 * hosted zone and you delete the child hosted zone, you must update the name servers
 * in the parent hosted zone.) In addition, if you delete a hosted zone, someone could
 * hijack the domain and route traffic to their own resources using your domain
 * name.
 *
 * If you want to avoid the monthly charge for the hosted zone, you can transfer DNS
 * service for the domain to a free DNS service. When you transfer DNS service, you have to
 * update the name servers for the domain registration. If the domain is registered with
 * Route 53, see UpdateDomainNameservers for information about how to replace Route 53 name servers with name servers for the new DNS service. If the domain is
 * registered with another registrar, use the method provided by the registrar to update
 * name servers for the domain registration. For more information, perform an internet
 * search on "free DNS service."
 *
 * You can delete a hosted zone only if it contains only the default SOA and NS records
 * and has DNSSEC signing disabled. If the hosted zone contains other records or has DNSSEC
 * enabled, you must delete the records and disable DNSSEC before deletion. Attempting to
 * delete a hosted zone with additional records or DNSSEC enabled returns a
 * `HostedZoneNotEmpty` error. For information about deleting records, see
 * ChangeResourceRecordSets.
 *
 * To verify that the hosted zone has been deleted, do one of the following:
 *
 * - Use the `GetHostedZone` action to request information about the
 * hosted zone.
 *
 * - Use the `ListHostedZones` action to get a list of the hosted zones
 * associated with the current Amazon Web Services account.
 */
export const deleteHostedZone: (
  input: DeleteHostedZoneRequest,
) => effect.Effect<
  DeleteHostedZoneResponse,
  | HostedZoneNotEmpty
  | InvalidDomainName
  | InvalidInput
  | NoSuchHostedZone
  | PriorRequestNotComplete
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteHostedZoneRequest,
  output: DeleteHostedZoneResponse,
  errors: [
    HostedZoneNotEmpty,
    InvalidDomainName,
    InvalidInput,
    NoSuchHostedZone,
    PriorRequestNotComplete,
  ],
}));
/**
 * Updates the comment for a specified hosted zone.
 */
export const updateHostedZoneComment: (
  input: UpdateHostedZoneCommentRequest,
) => effect.Effect<
  UpdateHostedZoneCommentResponse,
  InvalidInput | NoSuchHostedZone | PriorRequestNotComplete | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateHostedZoneCommentRequest,
  output: UpdateHostedZoneCommentResponse,
  errors: [InvalidInput, NoSuchHostedZone, PriorRequestNotComplete],
}));
/**
 * Removes authorization to submit an `AssociateVPCWithHostedZone` request to
 * associate a specified VPC with a hosted zone that was created by a different account.
 * You must use the account that created the hosted zone to submit a
 * `DeleteVPCAssociationAuthorization` request.
 *
 * Sending this request only prevents the Amazon Web Services account that created the
 * VPC from associating the VPC with the Amazon Route 53 hosted zone in the future. If
 * the VPC is already associated with the hosted zone,
 * `DeleteVPCAssociationAuthorization` won't disassociate the VPC from
 * the hosted zone. If you want to delete an existing association, use
 * `DisassociateVPCFromHostedZone`.
 */
export const deleteVPCAssociationAuthorization: (
  input: DeleteVPCAssociationAuthorizationRequest,
) => effect.Effect<
  DeleteVPCAssociationAuthorizationResponse,
  | ConcurrentModification
  | InvalidInput
  | InvalidVPCId
  | NoSuchHostedZone
  | VPCAssociationAuthorizationNotFound
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVPCAssociationAuthorizationRequest,
  output: DeleteVPCAssociationAuthorizationResponse,
  errors: [
    ConcurrentModification,
    InvalidInput,
    InvalidVPCId,
    NoSuchHostedZone,
    VPCAssociationAuthorizationNotFound,
  ],
}));
/**
 * Authorizes the Amazon Web Services account that created a specified VPC to submit an
 * `AssociateVPCWithHostedZone` request to associate the VPC with a
 * specified hosted zone that was created by a different account. To submit a
 * `CreateVPCAssociationAuthorization` request, you must use the account
 * that created the hosted zone. After you authorize the association, use the account that
 * created the VPC to submit an `AssociateVPCWithHostedZone` request.
 *
 * If you want to associate multiple VPCs that you created by using one account with
 * a hosted zone that you created by using a different account, you must submit one
 * authorization request for each VPC.
 */
export const createVPCAssociationAuthorization: (
  input: CreateVPCAssociationAuthorizationRequest,
) => effect.Effect<
  CreateVPCAssociationAuthorizationResponse,
  | ConcurrentModification
  | InvalidInput
  | InvalidVPCId
  | NoSuchHostedZone
  | TooManyVPCAssociationAuthorizations
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVPCAssociationAuthorizationRequest,
  output: CreateVPCAssociationAuthorizationResponse,
  errors: [
    ConcurrentModification,
    InvalidInput,
    InvalidVPCId,
    NoSuchHostedZone,
    TooManyVPCAssociationAuthorizations,
  ],
}));
/**
 * Deletes a traffic policy.
 *
 * When you delete a traffic policy, Route 53 sets a flag on the policy to indicate that
 * it has been deleted. However, Route 53 never fully deletes the traffic policy. Note the
 * following:
 *
 * - Deleted traffic policies aren't listed if you run ListTrafficPolicies.
 *
 * - There's no way to get a list of deleted policies.
 *
 * - If you retain the ID of the policy, you can get information about the policy,
 * including the traffic policy document, by running GetTrafficPolicy.
 */
export const deleteTrafficPolicy: (
  input: DeleteTrafficPolicyRequest,
) => effect.Effect<
  DeleteTrafficPolicyResponse,
  | ConcurrentModification
  | InvalidInput
  | NoSuchTrafficPolicy
  | TrafficPolicyInUse
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTrafficPolicyRequest,
  output: DeleteTrafficPolicyResponse,
  errors: [
    ConcurrentModification,
    InvalidInput,
    NoSuchTrafficPolicy,
    TrafficPolicyInUse,
  ],
}));
/**
 * Returns a paginated list of location objects and their CIDR blocks.
 */
export const listCidrBlocks: {
  (
    input: ListCidrBlocksRequest,
  ): effect.Effect<
    ListCidrBlocksResponse,
    | InvalidInput
    | NoSuchCidrCollectionException
    | NoSuchCidrLocationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCidrBlocksRequest,
  ) => stream.Stream<
    ListCidrBlocksResponse,
    | InvalidInput
    | NoSuchCidrCollectionException
    | NoSuchCidrLocationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCidrBlocksRequest,
  ) => stream.Stream<
    CidrBlockSummary,
    | InvalidInput
    | NoSuchCidrCollectionException
    | NoSuchCidrLocationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCidrBlocksRequest,
  output: ListCidrBlocksResponse,
  errors: [
    InvalidInput,
    NoSuchCidrCollectionException,
    NoSuchCidrLocationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "CidrBlocks",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates, changes, or deletes CIDR blocks within a collection. Contains authoritative
 * IP information mapping blocks to one or multiple locations.
 *
 * A change request can update multiple locations in a collection at a time, which is
 * helpful if you want to move one or more CIDR blocks from one location to another in one
 * transaction, without downtime.
 *
 * **Limits**
 *
 * The max number of CIDR blocks included in the request is 1000. As a result, big updates
 * require multiple API calls.
 *
 * ** PUT and DELETE_IF_EXISTS**
 *
 * Use `ChangeCidrCollection` to perform the following actions:
 *
 * - `PUT`: Create a CIDR block within the specified collection.
 *
 * - ` DELETE_IF_EXISTS`: Delete an existing CIDR block from the
 * collection.
 */
export const changeCidrCollection: (
  input: ChangeCidrCollectionRequest,
) => effect.Effect<
  ChangeCidrCollectionResponse,
  | CidrBlockInUseException
  | CidrCollectionVersionMismatchException
  | ConcurrentModification
  | InvalidInput
  | LimitsExceeded
  | NoSuchCidrCollectionException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ChangeCidrCollectionRequest,
  output: ChangeCidrCollectionResponse,
  errors: [
    CidrBlockInUseException,
    CidrCollectionVersionMismatchException,
    ConcurrentModification,
    InvalidInput,
    LimitsExceeded,
    NoSuchCidrCollectionException,
  ],
}));
/**
 * Creates, changes, or deletes a resource record set, which contains authoritative DNS
 * information for a specified domain name or subdomain name. For example, you can use
 * `ChangeResourceRecordSets` to create a resource record set that routes
 * traffic for test.example.com to a web server that has an IP address of
 * 192.0.2.44.
 *
 * **Deleting Resource Record Sets**
 *
 * To delete a resource record set, you must specify all the same values that you
 * specified when you created it.
 *
 * **Change Batches and Transactional Changes**
 *
 * The request body must include a document with a
 * `ChangeResourceRecordSetsRequest` element. The request body contains a
 * list of change items, known as a change batch. Change batches are considered
 * transactional changes. Route 53 validates the changes in the request and then either
 * makes all or none of the changes in the change batch request. This ensures that DNS
 * routing isn't adversely affected by partial changes to the resource record sets in a
 * hosted zone.
 *
 * For example, suppose a change batch request contains two changes: it deletes the
 * `CNAME` resource record set for www.example.com and creates an alias
 * resource record set for www.example.com. If validation for both records succeeds, Route
 * 53 deletes the first resource record set and creates the second resource record set in a
 * single operation. If validation for either the `DELETE` or the
 * `CREATE` action fails, then the request is canceled, and the original
 * `CNAME` record continues to exist.
 *
 * If you try to delete the same resource record set more than once in a single
 * change batch, Route 53 returns an `InvalidChangeBatch` error.
 *
 * **Traffic Flow**
 *
 * To create resource record sets for complex routing configurations, use either the
 * traffic flow visual editor in the Route 53 console or the API actions for traffic
 * policies and traffic policy instances. Save the configuration as a traffic policy, then
 * associate the traffic policy with one or more domain names (such as example.com) or
 * subdomain names (such as www.example.com), in the same hosted zone or in multiple hosted
 * zones. You can roll back the updates if the new configuration isn't performing as
 * expected. For more information, see Using Traffic Flow to Route
 * DNS Traffic in the Amazon Route 53 Developer
 * Guide.
 *
 * **Create, Delete, and Upsert**
 *
 * Use `ChangeResourceRecordsSetsRequest` to perform the following
 * actions:
 *
 * - `CREATE`: Creates a resource record set that has the specified
 * values.
 *
 * - `DELETE`: Deletes an existing resource record set that has the
 * specified values.
 *
 * - `UPSERT`: If a resource set doesn't exist, Route 53 creates it. If a resource
 * set exists Route 53 updates it with the values in the request.
 *
 * Syntaxes for Creating, Updating, and Deleting Resource Record
 * Sets
 *
 * The syntax for a request depends on the type of resource record set that you want to
 * create, delete, or update, such as weighted, alias, or failover. The XML elements in
 * your request must appear in the order listed in the syntax.
 *
 * For an example for each type of resource record set, see "Examples."
 *
 * Don't refer to the syntax in the "Parameter Syntax" section, which includes
 * all of the elements for every kind of resource record set that you can create, delete,
 * or update by using `ChangeResourceRecordSets`.
 *
 * **Change Propagation to Route 53 DNS Servers**
 *
 * When you submit a `ChangeResourceRecordSets` request, Route 53 propagates your
 * changes to all of the Route 53 authoritative DNS servers managing the hosted zone. While
 * your changes are propagating, `GetChange` returns a status of
 * `PENDING`. When propagation is complete, `GetChange` returns a
 * status of `INSYNC`. Changes generally propagate to all Route 53 name servers
 * managing the hosted zone within 60 seconds. For more information, see GetChange.
 *
 * **Limits on ChangeResourceRecordSets Requests**
 *
 * For information about the limits on a `ChangeResourceRecordSets` request,
 * see Limits in the *Amazon Route 53 Developer Guide*.
 */
export const changeResourceRecordSets: (
  input: ChangeResourceRecordSetsRequest,
) => effect.Effect<
  ChangeResourceRecordSetsResponse,
  | InvalidChangeBatch
  | InvalidInput
  | NoSuchHealthCheck
  | NoSuchHostedZone
  | PriorRequestNotComplete
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ChangeResourceRecordSetsRequest,
  output: ChangeResourceRecordSetsResponse,
  errors: [
    InvalidChangeBatch,
    InvalidInput,
    NoSuchHealthCheck,
    NoSuchHostedZone,
    PriorRequestNotComplete,
  ],
}));
/**
 * Creates a new health check.
 *
 * For information about adding health checks to resource record sets, see HealthCheckId in ChangeResourceRecordSets.
 *
 * **ELB Load Balancers**
 *
 * If you're registering EC2 instances with an Elastic Load Balancing (ELB) load
 * balancer, do not create Amazon Route 53 health checks for the EC2 instances. When you
 * register an EC2 instance with a load balancer, you configure settings for an ELB health
 * check, which performs a similar function to a Route 53 health check.
 *
 * **Private Hosted Zones**
 *
 * You can associate health checks with failover resource record sets in a private hosted
 * zone. Note the following:
 *
 * - Route 53 health checkers are outside the VPC. To check the health of an
 * endpoint within a VPC by IP address, you must assign a public IP address to the
 * instance in the VPC.
 *
 * - You can configure a health checker to check the health of an external resource
 * that the instance relies on, such as a database server.
 *
 * - You can create a CloudWatch metric, associate an alarm with the metric, and
 * then create a health check that is based on the state of the alarm. For example,
 * you might create a CloudWatch metric that checks the status of the Amazon EC2
 * `StatusCheckFailed` metric, add an alarm to the metric, and then
 * create a health check that is based on the state of the alarm. For information
 * about creating CloudWatch metrics and alarms by using the CloudWatch console,
 * see the Amazon
 * CloudWatch User Guide.
 */
export const createHealthCheck: (
  input: CreateHealthCheckRequest,
) => effect.Effect<
  CreateHealthCheckResponse,
  HealthCheckAlreadyExists | InvalidInput | TooManyHealthChecks | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateHealthCheckRequest,
  output: CreateHealthCheckResponse,
  errors: [HealthCheckAlreadyExists, InvalidInput, TooManyHealthChecks],
}));
/**
 * Disassociates an Amazon Virtual Private Cloud (Amazon VPC) from an Amazon Route 53
 * private hosted zone. Note the following:
 *
 * - You can't disassociate the last Amazon VPC from a private hosted zone.
 *
 * - You can't convert a private hosted zone into a public hosted zone.
 *
 * - You can submit a `DisassociateVPCFromHostedZone` request using
 * either the account that created the hosted zone or the account that created the
 * Amazon VPC.
 *
 * - Some services, such as Cloud Map and Amazon Elastic File System
 * (Amazon EFS) automatically create hosted zones and associate VPCs with the
 * hosted zones. A service can create a hosted zone using your account or using its
 * own account. You can disassociate a VPC from a hosted zone only if the service
 * created the hosted zone using your account.
 *
 * When you run DisassociateVPCFromHostedZone, if the hosted zone has a value for
 * `OwningAccount`, you can use
 * `DisassociateVPCFromHostedZone`. If the hosted zone has a value
 * for `OwningService`, you can't use
 * `DisassociateVPCFromHostedZone`.
 *
 * When revoking access, the hosted zone and the Amazon VPC must belong to
 * the same partition. A partition is a group of Amazon Web Services Regions. Each
 * Amazon Web Services account is scoped to one partition.
 *
 * The following are the supported partitions:
 *
 * - `aws` - Amazon Web Services Regions
 *
 * - `aws-cn` - China Regions
 *
 * - `aws-us-gov` - Amazon Web Services GovCloud (US) Region
 *
 * For more information, see Access Management
 * in the *Amazon Web Services General Reference*.
 */
export const disassociateVPCFromHostedZone: (
  input: DisassociateVPCFromHostedZoneRequest,
) => effect.Effect<
  DisassociateVPCFromHostedZoneResponse,
  | InvalidInput
  | InvalidVPCId
  | LastVPCAssociation
  | NoSuchHostedZone
  | VPCAssociationNotFound
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateVPCFromHostedZoneRequest,
  output: DisassociateVPCFromHostedZoneResponse,
  errors: [
    InvalidInput,
    InvalidVPCId,
    LastVPCAssociation,
    NoSuchHostedZone,
    VPCAssociationNotFound,
  ],
}));
/**
 * Gets information about a specified health check.
 */
export const getHealthCheck: (
  input: GetHealthCheckRequest,
) => effect.Effect<
  GetHealthCheckResponse,
  IncompatibleVersion | InvalidInput | NoSuchHealthCheck | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetHealthCheckRequest,
  output: GetHealthCheckResponse,
  errors: [IncompatibleVersion, InvalidInput, NoSuchHealthCheck],
}));
/**
 * Gets information about a specified hosted zone including the four name servers
 * assigned to the hosted zone.
 *
 * `` returns the VPCs associated with the specified hosted zone and does not reflect the VPC
 * associations by Route 53 Profiles. To get the associations to a Profile, call the ListProfileAssociations API.
 */
export const getHostedZone: (
  input: GetHostedZoneRequest,
) => effect.Effect<
  GetHostedZoneResponse,
  InvalidInput | NoSuchHostedZone | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetHostedZoneRequest,
  output: GetHostedZoneResponse,
  errors: [InvalidInput, NoSuchHostedZone],
}));
/**
 * Lists the resource record sets in a specified hosted zone.
 *
 * `ListResourceRecordSets` returns up to 300 resource record sets at a time
 * in ASCII order, beginning at a position specified by the `name` and
 * `type` elements.
 *
 * **Sort order**
 *
 * `ListResourceRecordSets` sorts results first by DNS name with the labels
 * reversed, for example:
 *
 * `com.example.www.`
 *
 * Note the trailing dot, which can change the sort order when the record name contains
 * characters that appear before `.` (decimal 46) in the ASCII table. These
 * characters include the following: `! " # $ % & ' ( ) * + , -`
 *
 * When multiple records have the same DNS name, `ListResourceRecordSets`
 * sorts results by the record type.
 *
 * **Specifying where to start listing records**
 *
 * You can use the name and type elements to specify the resource record set that the
 * list begins with:
 *
 * ### If you do not specify Name or Type
 *
 * The results begin with the first resource record set that the hosted zone
 * contains.
 *
 * ### If you specify Name but not Type
 *
 * The results begin with the first resource record set in the list whose
 * name is greater than or equal to `Name`.
 *
 * ### If you specify Type but not Name
 *
 * Amazon Route 53 returns the `InvalidInput` error.
 *
 * ### If you specify both Name and Type
 *
 * The results begin with the first resource record set in the list whose
 * name is greater than or equal to `Name`, and whose type is
 * greater than or equal to `Type`.
 *
 * Type is only used to sort between records with the same record Name.
 *
 * **Resource record sets that are PENDING**
 *
 * This action returns the most current version of the records. This includes records
 * that are `PENDING`, and that are not yet available on all Route 53 DNS
 * servers.
 *
 * **Changing resource record sets**
 *
 * To ensure that you get an accurate listing of the resource record sets for a hosted
 * zone at a point in time, do not submit a `ChangeResourceRecordSets` request
 * while you're paging through the results of a `ListResourceRecordSets`
 * request. If you do, some pages may display results without the latest changes while
 * other pages display results with the latest changes.
 *
 * **Displaying the next page of results**
 *
 * If a `ListResourceRecordSets` command returns more than one page of
 * results, the value of `IsTruncated` is `true`. To display the next
 * page of results, get the values of `NextRecordName`,
 * `NextRecordType`, and `NextRecordIdentifier` (if any) from the
 * response. Then submit another `ListResourceRecordSets` request, and specify
 * those values for `StartRecordName`, `StartRecordType`, and
 * `StartRecordIdentifier`.
 */
export const listResourceRecordSets: (
  input: ListResourceRecordSetsRequest,
) => effect.Effect<
  ListResourceRecordSetsResponse,
  InvalidInput | NoSuchHostedZone | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListResourceRecordSetsRequest,
  output: ListResourceRecordSetsResponse,
  errors: [InvalidInput, NoSuchHostedZone],
}));
/**
 * Lists tags for up to 10 health checks or hosted zones.
 *
 * For information about using tags for cost allocation, see Using Cost Allocation
 * Tags in the *Billing and Cost Management User Guide*.
 */
export const listTagsForResources: (
  input: ListTagsForResourcesRequest,
) => effect.Effect<
  ListTagsForResourcesResponse,
  | InvalidInput
  | NoSuchHealthCheck
  | NoSuchHostedZone
  | PriorRequestNotComplete
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourcesRequest,
  output: ListTagsForResourcesResponse,
  errors: [
    InvalidInput,
    NoSuchHealthCheck,
    NoSuchHostedZone,
    PriorRequestNotComplete,
    ThrottlingException,
  ],
}));
/**
 * Creates resource record sets in a specified hosted zone based on the settings in a
 * specified traffic policy version. In addition, `CreateTrafficPolicyInstance`
 * associates the resource record sets with a specified domain name (such as example.com)
 * or subdomain name (such as www.example.com). Amazon Route 53 responds to DNS queries for
 * the domain or subdomain name by using the resource record sets that
 * `CreateTrafficPolicyInstance` created.
 *
 * After you submit an `CreateTrafficPolicyInstance` request, there's a
 * brief delay while Amazon Route 53 creates the resource record sets that are
 * specified in the traffic policy definition.
 * Use `GetTrafficPolicyInstance` with the `id` of new traffic policy instance to confirm that the `CreateTrafficPolicyInstance`
 * request completed successfully. For more information, see the
 * `State` response element.
 */
export const createTrafficPolicyInstance: (
  input: CreateTrafficPolicyInstanceRequest,
) => effect.Effect<
  CreateTrafficPolicyInstanceResponse,
  | InvalidInput
  | NoSuchHostedZone
  | NoSuchTrafficPolicy
  | TooManyTrafficPolicyInstances
  | TrafficPolicyInstanceAlreadyExists
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTrafficPolicyInstanceRequest,
  output: CreateTrafficPolicyInstanceResponse,
  errors: [
    InvalidInput,
    NoSuchHostedZone,
    NoSuchTrafficPolicy,
    TooManyTrafficPolicyInstances,
    TrafficPolicyInstanceAlreadyExists,
  ],
}));
/**
 * Creates a traffic policy, which you use to create multiple DNS resource record sets
 * for one domain name (such as example.com) or one subdomain name (such as
 * www.example.com).
 */
export const createTrafficPolicy: (
  input: CreateTrafficPolicyRequest,
) => effect.Effect<
  CreateTrafficPolicyResponse,
  | InvalidInput
  | InvalidTrafficPolicyDocument
  | TooManyTrafficPolicies
  | TrafficPolicyAlreadyExists
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTrafficPolicyRequest,
  output: CreateTrafficPolicyResponse,
  errors: [
    InvalidInput,
    InvalidTrafficPolicyDocument,
    TooManyTrafficPolicies,
    TrafficPolicyAlreadyExists,
  ],
}));
/**
 * Deletes a key-signing key (KSK). Before you can delete a KSK, you must deactivate it.
 * The KSK must be deactivated before you can delete it regardless of whether the hosted
 * zone is enabled for DNSSEC signing.
 *
 * You can use DeactivateKeySigningKey to deactivate the key before you delete it.
 *
 * Use GetDNSSEC to verify that the KSK is in an `INACTIVE`
 * status.
 */
export const deleteKeySigningKey: (
  input: DeleteKeySigningKeyRequest,
) => effect.Effect<
  DeleteKeySigningKeyResponse,
  | ConcurrentModification
  | InvalidInput
  | InvalidKeySigningKeyStatus
  | InvalidKMSArn
  | InvalidSigningStatus
  | NoSuchKeySigningKey
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKeySigningKeyRequest,
  output: DeleteKeySigningKeyResponse,
  errors: [
    ConcurrentModification,
    InvalidInput,
    InvalidKeySigningKeyStatus,
    InvalidKMSArn,
    InvalidSigningStatus,
    NoSuchKeySigningKey,
  ],
}));
/**
 * Disables DNSSEC signing in a specific hosted zone. This action does not deactivate any
 * key-signing keys (KSKs) that are active in the hosted zone.
 */
export const disableHostedZoneDNSSEC: (
  input: DisableHostedZoneDNSSECRequest,
) => effect.Effect<
  DisableHostedZoneDNSSECResponse,
  | ConcurrentModification
  | DNSSECNotFound
  | InvalidArgument
  | InvalidInput
  | InvalidKeySigningKeyStatus
  | InvalidKMSArn
  | KeySigningKeyInParentDSRecord
  | NoSuchHostedZone
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableHostedZoneDNSSECRequest,
  output: DisableHostedZoneDNSSECResponse,
  errors: [
    ConcurrentModification,
    DNSSECNotFound,
    InvalidArgument,
    InvalidInput,
    InvalidKeySigningKeyStatus,
    InvalidKMSArn,
    KeySigningKeyInParentDSRecord,
    NoSuchHostedZone,
  ],
}));
/**
 * Adds, edits, or deletes tags for a health check or a hosted zone.
 *
 * For information about using tags for cost allocation, see Using Cost Allocation
 * Tags in the *Billing and Cost Management User Guide*.
 */
export const changeTagsForResource: (
  input: ChangeTagsForResourceRequest,
) => effect.Effect<
  ChangeTagsForResourceResponse,
  | InvalidInput
  | NoSuchHealthCheck
  | NoSuchHostedZone
  | PriorRequestNotComplete
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ChangeTagsForResourceRequest,
  output: ChangeTagsForResourceResponse,
  errors: [
    InvalidInput,
    NoSuchHealthCheck,
    NoSuchHostedZone,
    PriorRequestNotComplete,
    ThrottlingException,
  ],
}));
/**
 * Lists tags for one health check or hosted zone.
 *
 * For information about using tags for cost allocation, see Using Cost Allocation
 * Tags in the *Billing and Cost Management User Guide*.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InvalidInput
  | NoSuchHealthCheck
  | NoSuchHostedZone
  | PriorRequestNotComplete
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InvalidInput,
    NoSuchHealthCheck,
    NoSuchHostedZone,
    PriorRequestNotComplete,
    ThrottlingException,
  ],
}));
/**
 * Enables DNSSEC signing in a specific hosted zone.
 */
export const enableHostedZoneDNSSEC: (
  input: EnableHostedZoneDNSSECRequest,
) => effect.Effect<
  EnableHostedZoneDNSSECResponse,
  | ConcurrentModification
  | DNSSECNotFound
  | HostedZonePartiallyDelegated
  | InvalidArgument
  | InvalidInput
  | InvalidKeySigningKeyStatus
  | InvalidKMSArn
  | KeySigningKeyWithActiveStatusNotFound
  | NoSuchHostedZone
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableHostedZoneDNSSECRequest,
  output: EnableHostedZoneDNSSECResponse,
  errors: [
    ConcurrentModification,
    DNSSECNotFound,
    HostedZonePartiallyDelegated,
    InvalidArgument,
    InvalidInput,
    InvalidKeySigningKeyStatus,
    InvalidKMSArn,
    KeySigningKeyWithActiveStatusNotFound,
    NoSuchHostedZone,
  ],
}));
/**
 * Activates a key-signing key (KSK) so that it can be used for signing by DNSSEC. This
 * operation changes the KSK status to `ACTIVE`.
 */
export const activateKeySigningKey: (
  input: ActivateKeySigningKeyRequest,
) => effect.Effect<
  ActivateKeySigningKeyResponse,
  | ConcurrentModification
  | InvalidInput
  | InvalidKeySigningKeyStatus
  | InvalidKMSArn
  | InvalidSigningStatus
  | NoSuchKeySigningKey
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ActivateKeySigningKeyRequest,
  output: ActivateKeySigningKeyResponse,
  errors: [
    ConcurrentModification,
    InvalidInput,
    InvalidKeySigningKeyStatus,
    InvalidKMSArn,
    InvalidSigningStatus,
    NoSuchKeySigningKey,
  ],
}));
/**
 * Associates an Amazon VPC with a private hosted zone.
 *
 * To perform the association, the VPC and the private hosted zone must already
 * exist. You can't convert a public hosted zone into a private hosted zone.
 *
 * If you want to associate a VPC that was created by using one Amazon Web Services account with a private hosted zone that was created by using a
 * different account, the Amazon Web Services account that created the private hosted
 * zone must first submit a `CreateVPCAssociationAuthorization` request.
 * Then the account that created the VPC must submit an
 * `AssociateVPCWithHostedZone` request.
 *
 * When granting access, the hosted zone and the Amazon VPC must belong to
 * the same partition. A partition is a group of Amazon Web Services Regions. Each
 * Amazon Web Services account is scoped to one partition.
 *
 * The following are the supported partitions:
 *
 * - `aws` - Amazon Web Services Regions
 *
 * - `aws-cn` - China Regions
 *
 * - `aws-us-gov` - Amazon Web Services GovCloud (US) Region
 *
 * For more information, see Access Management
 * in the *Amazon Web Services General Reference*.
 */
export const associateVPCWithHostedZone: (
  input: AssociateVPCWithHostedZoneRequest,
) => effect.Effect<
  AssociateVPCWithHostedZoneResponse,
  | ConflictingDomainExists
  | InvalidInput
  | InvalidVPCId
  | LimitsExceeded
  | NoSuchHostedZone
  | NotAuthorizedException
  | PriorRequestNotComplete
  | PublicZoneVPCAssociation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateVPCWithHostedZoneRequest,
  output: AssociateVPCWithHostedZoneResponse,
  errors: [
    ConflictingDomainExists,
    InvalidInput,
    InvalidVPCId,
    LimitsExceeded,
    NoSuchHostedZone,
    NotAuthorizedException,
    PriorRequestNotComplete,
    PublicZoneVPCAssociation,
  ],
}));
/**
 * Creates a configuration for DNS query logging. After you create a query logging
 * configuration, Amazon Route 53 begins to publish log data to an Amazon CloudWatch Logs
 * log group.
 *
 * DNS query logs contain information about the queries that Route 53 receives for a
 * specified public hosted zone, such as the following:
 *
 * - Route 53 edge location that responded to the DNS query
 *
 * - Domain or subdomain that was requested
 *
 * - DNS record type, such as A or AAAA
 *
 * - DNS response code, such as `NoError` or
 * `ServFail`
 *
 * ### Log Group and Resource Policy
 *
 * Before you create a query logging configuration, perform the following
 * operations.
 *
 * If you create a query logging configuration using the Route 53
 * console, Route 53 performs these operations automatically.
 *
 * - Create a CloudWatch Logs log group, and make note of the ARN,
 * which you specify when you create a query logging configuration.
 * Note the following:
 *
 * - You must create the log group in the us-east-1
 * region.
 *
 * - You must use the same Amazon Web Services account to create
 * the log group and the hosted zone that you want to configure
 * query logging for.
 *
 * - When you create log groups for query logging, we recommend
 * that you use a consistent prefix, for example:
 *
 * /aws/route53/hosted zone
 * name
 *
 * In the next step, you'll create a resource policy, which
 * controls access to one or more log groups and the associated
 * Amazon Web Services resources, such as Route 53 hosted
 * zones. There's a limit on the number of resource policies
 * that you can create, so we recommend that you use a
 * consistent prefix so you can use the same resource policy
 * for all the log groups that you create for query
 * logging.
 *
 * - Create a CloudWatch Logs resource policy, and give it the
 * permissions that Route 53 needs to create log streams and to send
 * query logs to log streams. You must create the CloudWatch Logs resource policy in the us-east-1
 * region. For the value of `Resource`,
 * specify the ARN for the log group that you created in the previous
 * step. To use the same resource policy for all the CloudWatch Logs
 * log groups that you created for query logging configurations,
 * replace the hosted zone name with `*`, for
 * example:
 *
 * `arn:aws:logs:us-east-1:123412341234:log-group:/aws/route53/*`
 *
 * To avoid the confused deputy problem, a security issue where an
 * entity without a permission for an action can coerce a
 * more-privileged entity to perform it, you can optionally limit the
 * permissions that a service has to a resource in a resource-based
 * policy by supplying the following values:
 *
 * - For `aws:SourceArn`, supply the hosted zone ARN
 * used in creating the query logging configuration. For
 * example, aws:SourceArn:
 * arn:aws:route53:::hostedzone/hosted zone
 * ID.
 *
 * - For `aws:SourceAccount`, supply the account ID
 * for the account that creates the query logging
 * configuration. For example,
 * `aws:SourceAccount:111111111111`.
 *
 * For more information, see The confused
 * deputy problem in the Amazon Web Services
 * IAM User Guide.
 *
 * You can't use the CloudWatch console to create or edit a
 * resource policy. You must use the CloudWatch API, one of the
 * Amazon Web Services SDKs, or the CLI.
 *
 * ### Log Streams and Edge Locations
 *
 * When Route 53 finishes creating the configuration for DNS query logging,
 * it does the following:
 *
 * - Creates a log stream for an edge location the first time that the
 * edge location responds to DNS queries for the specified hosted zone.
 * That log stream is used to log all queries that Route 53 responds to
 * for that edge location.
 *
 * - Begins to send query logs to the applicable log stream.
 *
 * The name of each log stream is in the following format:
 *
 * *hosted zone ID*\/edge location
 * code
 *
 * The edge location code is a three-letter code and an arbitrarily assigned
 * number, for example, DFW3. The three-letter code typically corresponds with
 * the International Air Transport Association airport code for an airport near
 * the edge location. (These abbreviations might change in the future.) For a
 * list of edge locations, see "The Route 53 Global Network" on the Route 53 Product Details
 * page.
 *
 * ### Queries That Are Logged
 *
 * Query logs contain only the queries that DNS resolvers forward to Route
 * 53. If a DNS resolver has already cached the response to a query (such as
 * the IP address for a load balancer for example.com), the resolver will
 * continue to return the cached response. It doesn't forward another query to
 * Route 53 until the TTL for the corresponding resource record set expires.
 * Depending on how many DNS queries are submitted for a resource record set,
 * and depending on the TTL for that resource record set, query logs might
 * contain information about only one query out of every several thousand
 * queries that are submitted to DNS. For more information about how DNS works,
 * see Routing
 * Internet Traffic to Your Website or Web Application in the
 * *Amazon Route 53 Developer Guide*.
 *
 * ### Log File Format
 *
 * For a list of the values in each query log and the format of each value,
 * see Logging DNS
 * Queries in the Amazon Route 53 Developer
 * Guide.
 *
 * ### Pricing
 *
 * For information about charges for query logs, see Amazon CloudWatch Pricing.
 *
 * ### How to Stop Logging
 *
 * If you want Route 53 to stop sending query logs to CloudWatch Logs, delete
 * the query logging configuration. For more information, see DeleteQueryLoggingConfig.
 */
export const createQueryLoggingConfig: (
  input: CreateQueryLoggingConfigRequest,
) => effect.Effect<
  CreateQueryLoggingConfigResponse,
  | ConcurrentModification
  | InsufficientCloudWatchLogsResourcePolicy
  | InvalidInput
  | NoSuchCloudWatchLogsLogGroup
  | NoSuchHostedZone
  | QueryLoggingConfigAlreadyExists
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateQueryLoggingConfigRequest,
  output: CreateQueryLoggingConfigResponse,
  errors: [
    ConcurrentModification,
    InsufficientCloudWatchLogsResourcePolicy,
    InvalidInput,
    NoSuchCloudWatchLogsLogGroup,
    NoSuchHostedZone,
    QueryLoggingConfigAlreadyExists,
  ],
}));
/**
 * Deactivates a key-signing key (KSK) so that it will not be used for signing by DNSSEC.
 * This operation changes the KSK status to `INACTIVE`.
 */
export const deactivateKeySigningKey: (
  input: DeactivateKeySigningKeyRequest,
) => effect.Effect<
  DeactivateKeySigningKeyResponse,
  | ConcurrentModification
  | InvalidInput
  | InvalidKeySigningKeyStatus
  | InvalidSigningStatus
  | KeySigningKeyInParentDSRecord
  | KeySigningKeyInUse
  | NoSuchKeySigningKey
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeactivateKeySigningKeyRequest,
  output: DeactivateKeySigningKeyResponse,
  errors: [
    ConcurrentModification,
    InvalidInput,
    InvalidKeySigningKeyStatus,
    InvalidSigningStatus,
    KeySigningKeyInParentDSRecord,
    KeySigningKeyInUse,
    NoSuchKeySigningKey,
  ],
}));
/**
 * Creates a delegation set (a group of four name servers) that can be reused by multiple
 * hosted zones that were created by the same Amazon Web Services account.
 *
 * You can also create a reusable delegation set that uses the four name servers that are
 * associated with an existing hosted zone. Specify the hosted zone ID in the
 * `CreateReusableDelegationSet` request.
 *
 * You can't associate a reusable delegation set with a private hosted zone.
 *
 * For information about using a reusable delegation set to configure white label name
 * servers, see Configuring White
 * Label Name Servers.
 *
 * The process for migrating existing hosted zones to use a reusable delegation set is
 * comparable to the process for configuring white label name servers. You need to perform
 * the following steps:
 *
 * - Create a reusable delegation set.
 *
 * - Recreate hosted zones, and reduce the TTL to 60 seconds or less.
 *
 * - Recreate resource record sets in the new hosted zones.
 *
 * - Change the registrar's name servers to use the name servers for the new hosted
 * zones.
 *
 * - Monitor traffic for the website or application.
 *
 * - Change TTLs back to their original values.
 *
 * If you want to migrate existing hosted zones to use a reusable delegation set, the
 * existing hosted zones can't use any of the name servers that are assigned to the
 * reusable delegation set. If one or more hosted zones do use one or more name servers
 * that are assigned to the reusable delegation set, you can do one of the
 * following:
 *
 * - For small numbers of hosted zones—up to a few hundred—it's
 * relatively easy to create reusable delegation sets until you get one that has
 * four name servers that don't overlap with any of the name servers in your hosted
 * zones.
 *
 * - For larger numbers of hosted zones, the easiest solution is to use more than
 * one reusable delegation set.
 *
 * - For larger numbers of hosted zones, you can also migrate hosted zones that
 * have overlapping name servers to hosted zones that don't have overlapping name
 * servers, then migrate the hosted zones again to use the reusable delegation
 * set.
 */
export const createReusableDelegationSet: (
  input: CreateReusableDelegationSetRequest,
) => effect.Effect<
  CreateReusableDelegationSetResponse,
  | DelegationSetAlreadyCreated
  | DelegationSetAlreadyReusable
  | DelegationSetNotAvailable
  | HostedZoneNotFound
  | InvalidArgument
  | InvalidInput
  | LimitsExceeded
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateReusableDelegationSetRequest,
  output: CreateReusableDelegationSetResponse,
  errors: [
    DelegationSetAlreadyCreated,
    DelegationSetAlreadyReusable,
    DelegationSetNotAvailable,
    HostedZoneNotFound,
    InvalidArgument,
    InvalidInput,
    LimitsExceeded,
  ],
}));
/**
 * Creates a new key-signing key (KSK) associated with a hosted zone. You can only have
 * two KSKs per hosted zone.
 */
export const createKeySigningKey: (
  input: CreateKeySigningKeyRequest,
) => effect.Effect<
  CreateKeySigningKeyResponse,
  | ConcurrentModification
  | InvalidArgument
  | InvalidInput
  | InvalidKeySigningKeyName
  | InvalidKeySigningKeyStatus
  | InvalidKMSArn
  | InvalidSigningStatus
  | KeySigningKeyAlreadyExists
  | NoSuchHostedZone
  | TooManyKeySigningKeys
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKeySigningKeyRequest,
  output: CreateKeySigningKeyResponse,
  errors: [
    ConcurrentModification,
    InvalidArgument,
    InvalidInput,
    InvalidKeySigningKeyName,
    InvalidKeySigningKeyStatus,
    InvalidKMSArn,
    InvalidSigningStatus,
    KeySigningKeyAlreadyExists,
    NoSuchHostedZone,
    TooManyKeySigningKeys,
  ],
}));
/**
 * Creates a new public or private hosted zone. You create records in a public hosted
 * zone to define how you want to route traffic on the internet for a domain, such as
 * example.com, and its subdomains (apex.example.com, acme.example.com). You create records
 * in a private hosted zone to define how you want to route traffic for a domain and its
 * subdomains within one or more Amazon Virtual Private Clouds (Amazon VPCs).
 *
 * You can't convert a public hosted zone to a private hosted zone or vice versa.
 * Instead, you must create a new hosted zone with the same name and create new
 * resource record sets.
 *
 * For more information about charges for hosted zones, see Amazon Route 53 Pricing.
 *
 * Note the following:
 *
 * - You can't create a hosted zone for a top-level domain (TLD) such as
 * .com.
 *
 * - For public hosted zones, Route 53 automatically creates a default SOA record
 * and four NS records for the zone. For more information about SOA and NS records,
 * see NS and SOA Records
 * that Route 53 Creates for a Hosted Zone in the
 * *Amazon Route 53 Developer Guide*.
 *
 * If you want to use the same name servers for multiple public hosted zones, you
 * can optionally associate a reusable delegation set with the hosted zone. See the
 * `DelegationSetId` element.
 *
 * - If your domain is registered with a registrar other than Route 53,
 * you must update the name servers with your registrar to make Route 53 the DNS
 * service for the domain. For more information, see Migrating DNS Service
 * for an Existing Domain to Amazon Route 53 in the
 * *Amazon Route 53 Developer Guide*.
 *
 * When you submit a `CreateHostedZone` request, the initial status of the
 * hosted zone is `PENDING`. For public hosted zones, this means that the NS and
 * SOA records are not yet available on all Route 53 DNS servers. When the NS and
 * SOA records are available, the status of the zone changes to `INSYNC`.
 *
 * The `CreateHostedZone` request requires the caller to have an
 * `ec2:DescribeVpcs` permission.
 *
 * When creating private hosted zones, the Amazon VPC must belong to the same
 * partition where the hosted zone is created. A partition is a group of Amazon Web Services Regions. Each Amazon Web Services account is scoped to one
 * partition.
 *
 * The following are the supported partitions:
 *
 * - `aws` - Amazon Web Services Regions
 *
 * - `aws-cn` - China Regions
 *
 * - `aws-us-gov` - Amazon Web Services GovCloud (US) Region
 *
 * For more information, see Access Management
 * in the *Amazon Web Services General Reference*.
 */
export const createHostedZone: (
  input: CreateHostedZoneRequest,
) => effect.Effect<
  CreateHostedZoneResponse,
  | ConflictingDomainExists
  | DelegationSetNotAvailable
  | DelegationSetNotReusable
  | HostedZoneAlreadyExists
  | InvalidDomainName
  | InvalidInput
  | InvalidVPCId
  | NoSuchDelegationSet
  | TooManyHostedZones
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateHostedZoneRequest,
  output: CreateHostedZoneResponse,
  errors: [
    ConflictingDomainExists,
    DelegationSetNotAvailable,
    DelegationSetNotReusable,
    HostedZoneAlreadyExists,
    InvalidDomainName,
    InvalidInput,
    InvalidVPCId,
    NoSuchDelegationSet,
    TooManyHostedZones,
  ],
}));
