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
import type { Region as Rgn } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "Lightsail",
  serviceShapeName: "Lightsail_20161128",
});
const auth = T.AwsAuthSigv4({ name: "lightsail" });
const ver = T.ServiceVersion("2016-11-28");
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
              `https://lightsail-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://lightsail-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://lightsail.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://lightsail.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ResourceName = string;
export type NonEmptyString = string;
export type BucketName = string;
export type CertificateName = string;
export type DomainName = string;
export type StringMax256 = string;
export type ContainerServiceName = string;
export type ContainerServiceScale = number;
export type Port = number;
export type SensitiveString = string | redacted.Redacted<string>;
export type IsoDate = Date;
export type AutoSnapshotDate = string;
export type Base64 = string;
export type MetricPeriod = number;
export type IncludeCertificateDetails = boolean;
export type SetupHistoryPageToken = string;
export type ContainerLabel = string;
export type EmailAddress = string | redacted.Redacted<string>;
export type SetupDomainName = string;
export type ResourceArn = string;
export type TagKey = string;
export type TagValue = string;
export type ContainerName = string;
export type DomainEntryType = string;
export type BucketAccessLogPrefix = string;
export type TimeOfDay = string;
export type DomainEntryOptionsKeys = string;
export type BucketCorsRuleId = string;
export type BucketCorsAllowedMethod = string;
export type IAMAccessKeyId = string | redacted.Redacted<string>;
export type SensitiveNonEmptyString = string | redacted.Redacted<string>;
export type IpAddress = string;
export type Ipv6Address = string;
export type SerialNumber = string;
export type RequestFailureReason = string;
export type InUseResourceCount = number;
export type KeyAlgorithm = string;
export type IssuerCA = string;
export type EligibleToRenew = string;
export type RevocationReason = string;
export type RenewalStatusReason = string;

//# Schemas
export interface CreateContainerServiceRegistryLoginRequest {}
export const CreateContainerServiceRegistryLoginRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/container-registry-login",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateContainerServiceRegistryLoginRequest",
}) as any as S.Schema<CreateContainerServiceRegistryLoginRequest>;
export interface DownloadDefaultKeyPairRequest {}
export const DownloadDefaultKeyPairRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/DownloadDefaultKeyPair",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DownloadDefaultKeyPairRequest",
}) as any as S.Schema<DownloadDefaultKeyPairRequest>;
export interface GetContainerAPIMetadataRequest {}
export const GetContainerAPIMetadataRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/ls/api/2016-11-28/container-api-metadata",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetContainerAPIMetadataRequest",
}) as any as S.Schema<GetContainerAPIMetadataRequest>;
export interface GetContainerServicePowersRequest {}
export const GetContainerServicePowersRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/ls/api/2016-11-28/container-service-powers",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetContainerServicePowersRequest",
}) as any as S.Schema<GetContainerServicePowersRequest>;
export interface GetDistributionBundlesRequest {}
export const GetDistributionBundlesRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/GetDistributionBundles",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDistributionBundlesRequest",
}) as any as S.Schema<GetDistributionBundlesRequest>;
export interface IsVpcPeeredRequest {}
export const IsVpcPeeredRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/IsVpcPeered" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "IsVpcPeeredRequest",
}) as any as S.Schema<IsVpcPeeredRequest>;
export interface PeerVpcRequest {}
export const PeerVpcRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/PeerVpc" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PeerVpcRequest",
}) as any as S.Schema<PeerVpcRequest>;
export interface UnpeerVpcRequest {}
export const UnpeerVpcRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/UnpeerVpc" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UnpeerVpcRequest",
}) as any as S.Schema<UnpeerVpcRequest>;
export type ResourceNameList = string[];
export const ResourceNameList = S.Array(S.String);
export type RegionName =
  | "us-east-1"
  | "us-east-2"
  | "us-west-1"
  | "us-west-2"
  | "eu-west-1"
  | "eu-west-2"
  | "eu-west-3"
  | "eu-central-1"
  | "ca-central-1"
  | "ap-south-1"
  | "ap-southeast-1"
  | "ap-southeast-2"
  | "ap-northeast-1"
  | "ap-northeast-2"
  | "eu-north-1"
  | "ap-southeast-3";
export const RegionName = S.Literal(
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "eu-central-1",
  "ca-central-1",
  "ap-south-1",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-northeast-1",
  "ap-northeast-2",
  "eu-north-1",
  "ap-southeast-3",
);
export type SubjectAlternativeNameList = string[];
export const SubjectAlternativeNameList = S.Array(S.String);
export type ContactProtocol = "Email" | "SMS";
export const ContactProtocol = S.Literal("Email", "SMS");
export type ContainerServicePowerName =
  | "nano"
  | "micro"
  | "small"
  | "medium"
  | "large"
  | "xlarge";
export const ContainerServicePowerName = S.Literal(
  "nano",
  "micro",
  "small",
  "medium",
  "large",
  "xlarge",
);
export type IpAddressType = "dualstack" | "ipv4" | "ipv6";
export const IpAddressType = S.Literal("dualstack", "ipv4", "ipv6");
export type ViewerMinimumTlsProtocolVersionEnum =
  | "TLSv1.1_2016"
  | "TLSv1.2_2018"
  | "TLSv1.2_2019"
  | "TLSv1.2_2021";
export const ViewerMinimumTlsProtocolVersionEnum = S.Literal(
  "TLSv1.1_2016",
  "TLSv1.2_2018",
  "TLSv1.2_2019",
  "TLSv1.2_2021",
);
export type StringList = string[];
export const StringList = S.Array(S.String);
export type DomainNameList = string[];
export const DomainNameList = S.Array(S.String);
export type AddOnType = "AutoSnapshot" | "StopInstanceOnIdle";
export const AddOnType = S.Literal("AutoSnapshot", "StopInstanceOnIdle");
export type AppCategory = "LfR";
export const AppCategory = S.Literal("LfR");
export type BucketMetricName = "BucketSizeBytes" | "NumberOfObjects";
export const BucketMetricName = S.Literal("BucketSizeBytes", "NumberOfObjects");
export type MetricStatistic =
  | "Minimum"
  | "Maximum"
  | "Sum"
  | "Average"
  | "SampleCount";
export const MetricStatistic = S.Literal(
  "Minimum",
  "Maximum",
  "Sum",
  "Average",
  "SampleCount",
);
export type MetricStatisticList = MetricStatistic[];
export const MetricStatisticList = S.Array(MetricStatistic);
export type MetricUnit =
  | "Seconds"
  | "Microseconds"
  | "Milliseconds"
  | "Bytes"
  | "Kilobytes"
  | "Megabytes"
  | "Gigabytes"
  | "Terabytes"
  | "Bits"
  | "Kilobits"
  | "Megabits"
  | "Gigabits"
  | "Terabits"
  | "Percent"
  | "Count"
  | "Bytes/Second"
  | "Kilobytes/Second"
  | "Megabytes/Second"
  | "Gigabytes/Second"
  | "Terabytes/Second"
  | "Bits/Second"
  | "Kilobits/Second"
  | "Megabits/Second"
  | "Gigabits/Second"
  | "Terabits/Second"
  | "Count/Second"
  | "None";
export const MetricUnit = S.Literal(
  "Seconds",
  "Microseconds",
  "Milliseconds",
  "Bytes",
  "Kilobytes",
  "Megabytes",
  "Gigabytes",
  "Terabytes",
  "Bits",
  "Kilobits",
  "Megabits",
  "Gigabits",
  "Terabits",
  "Percent",
  "Count",
  "Bytes/Second",
  "Kilobytes/Second",
  "Megabytes/Second",
  "Gigabytes/Second",
  "Terabytes/Second",
  "Bits/Second",
  "Kilobits/Second",
  "Megabits/Second",
  "Gigabits/Second",
  "Terabits/Second",
  "Count/Second",
  "None",
);
export type CertificateStatus =
  | "PENDING_VALIDATION"
  | "ISSUED"
  | "INACTIVE"
  | "EXPIRED"
  | "VALIDATION_TIMED_OUT"
  | "REVOKED"
  | "FAILED";
export const CertificateStatus = S.Literal(
  "PENDING_VALIDATION",
  "ISSUED",
  "INACTIVE",
  "EXPIRED",
  "VALIDATION_TIMED_OUT",
  "REVOKED",
  "FAILED",
);
export type CertificateStatusList = CertificateStatus[];
export const CertificateStatusList = S.Array(CertificateStatus);
export type ContactProtocolsList = ContactProtocol[];
export const ContactProtocolsList = S.Array(ContactProtocol);
export type ContainerServiceMetricName = "CPUUtilization" | "MemoryUtilization";
export const ContainerServiceMetricName = S.Literal(
  "CPUUtilization",
  "MemoryUtilization",
);
export type DistributionMetricName =
  | "Requests"
  | "BytesDownloaded"
  | "BytesUploaded"
  | "TotalErrorRate"
  | "Http4xxErrorRate"
  | "Http5xxErrorRate";
export const DistributionMetricName = S.Literal(
  "Requests",
  "BytesDownloaded",
  "BytesUploaded",
  "TotalErrorRate",
  "Http4xxErrorRate",
  "Http5xxErrorRate",
);
export type InstanceAccessProtocol = "ssh" | "rdp";
export const InstanceAccessProtocol = S.Literal("ssh", "rdp");
export type InstanceMetricName =
  | "CPUUtilization"
  | "NetworkIn"
  | "NetworkOut"
  | "StatusCheckFailed"
  | "StatusCheckFailed_Instance"
  | "StatusCheckFailed_System"
  | "BurstCapacityTime"
  | "BurstCapacityPercentage"
  | "MetadataNoToken";
export const InstanceMetricName = S.Literal(
  "CPUUtilization",
  "NetworkIn",
  "NetworkOut",
  "StatusCheckFailed",
  "StatusCheckFailed_Instance",
  "StatusCheckFailed_System",
  "BurstCapacityTime",
  "BurstCapacityPercentage",
  "MetadataNoToken",
);
export type LoadBalancerMetricName =
  | "ClientTLSNegotiationErrorCount"
  | "HealthyHostCount"
  | "UnhealthyHostCount"
  | "HTTPCode_LB_4XX_Count"
  | "HTTPCode_LB_5XX_Count"
  | "HTTPCode_Instance_2XX_Count"
  | "HTTPCode_Instance_3XX_Count"
  | "HTTPCode_Instance_4XX_Count"
  | "HTTPCode_Instance_5XX_Count"
  | "InstanceResponseTime"
  | "RejectedConnectionCount"
  | "RequestCount";
export const LoadBalancerMetricName = S.Literal(
  "ClientTLSNegotiationErrorCount",
  "HealthyHostCount",
  "UnhealthyHostCount",
  "HTTPCode_LB_4XX_Count",
  "HTTPCode_LB_5XX_Count",
  "HTTPCode_Instance_2XX_Count",
  "HTTPCode_Instance_3XX_Count",
  "HTTPCode_Instance_4XX_Count",
  "HTTPCode_Instance_5XX_Count",
  "InstanceResponseTime",
  "RejectedConnectionCount",
  "RequestCount",
);
export type RelationalDatabasePasswordVersion =
  | "CURRENT"
  | "PREVIOUS"
  | "PENDING";
export const RelationalDatabasePasswordVersion = S.Literal(
  "CURRENT",
  "PREVIOUS",
  "PENDING",
);
export type RelationalDatabaseMetricName =
  | "CPUUtilization"
  | "DatabaseConnections"
  | "DiskQueueDepth"
  | "FreeStorageSpace"
  | "NetworkReceiveThroughput"
  | "NetworkTransmitThroughput";
export const RelationalDatabaseMetricName = S.Literal(
  "CPUUtilization",
  "DatabaseConnections",
  "DiskQueueDepth",
  "FreeStorageSpace",
  "NetworkReceiveThroughput",
  "NetworkTransmitThroughput",
);
export type MetricName =
  | "CPUUtilization"
  | "NetworkIn"
  | "NetworkOut"
  | "StatusCheckFailed"
  | "StatusCheckFailed_Instance"
  | "StatusCheckFailed_System"
  | "ClientTLSNegotiationErrorCount"
  | "HealthyHostCount"
  | "UnhealthyHostCount"
  | "HTTPCode_LB_4XX_Count"
  | "HTTPCode_LB_5XX_Count"
  | "HTTPCode_Instance_2XX_Count"
  | "HTTPCode_Instance_3XX_Count"
  | "HTTPCode_Instance_4XX_Count"
  | "HTTPCode_Instance_5XX_Count"
  | "InstanceResponseTime"
  | "RejectedConnectionCount"
  | "RequestCount"
  | "DatabaseConnections"
  | "DiskQueueDepth"
  | "FreeStorageSpace"
  | "NetworkReceiveThroughput"
  | "NetworkTransmitThroughput"
  | "BurstCapacityTime"
  | "BurstCapacityPercentage";
export const MetricName = S.Literal(
  "CPUUtilization",
  "NetworkIn",
  "NetworkOut",
  "StatusCheckFailed",
  "StatusCheckFailed_Instance",
  "StatusCheckFailed_System",
  "ClientTLSNegotiationErrorCount",
  "HealthyHostCount",
  "UnhealthyHostCount",
  "HTTPCode_LB_4XX_Count",
  "HTTPCode_LB_5XX_Count",
  "HTTPCode_Instance_2XX_Count",
  "HTTPCode_Instance_3XX_Count",
  "HTTPCode_Instance_4XX_Count",
  "HTTPCode_Instance_5XX_Count",
  "InstanceResponseTime",
  "RejectedConnectionCount",
  "RequestCount",
  "DatabaseConnections",
  "DiskQueueDepth",
  "FreeStorageSpace",
  "NetworkReceiveThroughput",
  "NetworkTransmitThroughput",
  "BurstCapacityTime",
  "BurstCapacityPercentage",
);
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
export type TreatMissingData =
  | "breaching"
  | "notBreaching"
  | "ignore"
  | "missing";
export const TreatMissingData = S.Literal(
  "breaching",
  "notBreaching",
  "ignore",
  "missing",
);
export type AlarmState = "OK" | "ALARM" | "INSUFFICIENT_DATA";
export const AlarmState = S.Literal("OK", "ALARM", "INSUFFICIENT_DATA");
export type NotificationTriggerList = AlarmState[];
export const NotificationTriggerList = S.Array(AlarmState);
export type NetworkProtocol = "tcp" | "all" | "udp" | "icmp" | "icmpv6";
export const NetworkProtocol = S.Literal("tcp", "all", "udp", "icmp", "icmpv6");
export interface PortInfo {
  fromPort?: number;
  toPort?: number;
  protocol?: NetworkProtocol;
  cidrs?: string[];
  ipv6Cidrs?: string[];
  cidrListAliases?: string[];
}
export const PortInfo = S.suspend(() =>
  S.Struct({
    fromPort: S.optional(S.Number),
    toPort: S.optional(S.Number),
    protocol: S.optional(NetworkProtocol),
    cidrs: S.optional(StringList),
    ipv6Cidrs: S.optional(StringList),
    cidrListAliases: S.optional(StringList),
  }),
).annotations({ identifier: "PortInfo" }) as any as S.Schema<PortInfo>;
export type PortInfoList = PortInfo[];
export const PortInfoList = S.Array(PortInfo);
export type ContactMethodVerificationProtocol = "Email";
export const ContactMethodVerificationProtocol = S.Literal("Email");
export type ResourceType =
  | "ContainerService"
  | "Instance"
  | "StaticIp"
  | "KeyPair"
  | "InstanceSnapshot"
  | "Domain"
  | "PeeredVpc"
  | "LoadBalancer"
  | "LoadBalancerTlsCertificate"
  | "Disk"
  | "DiskSnapshot"
  | "RelationalDatabase"
  | "RelationalDatabaseSnapshot"
  | "ExportSnapshotRecord"
  | "CloudFormationStackRecord"
  | "Alarm"
  | "ContactMethod"
  | "Distribution"
  | "Certificate"
  | "Bucket";
export const ResourceType = S.Literal(
  "ContainerService",
  "Instance",
  "StaticIp",
  "KeyPair",
  "InstanceSnapshot",
  "Domain",
  "PeeredVpc",
  "LoadBalancer",
  "LoadBalancerTlsCertificate",
  "Disk",
  "DiskSnapshot",
  "RelationalDatabase",
  "RelationalDatabaseSnapshot",
  "ExportSnapshotRecord",
  "CloudFormationStackRecord",
  "Alarm",
  "ContactMethod",
  "Distribution",
  "Certificate",
  "Bucket",
);
export type ResourceBucketAccess = "allow" | "deny";
export const ResourceBucketAccess = S.Literal("allow", "deny");
export type SetupDomainNameList = string[];
export const SetupDomainNameList = S.Array(S.String);
export type CertificateProvider = "LetsEncrypt";
export const CertificateProvider = S.Literal("LetsEncrypt");
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type PartnerIdList = string[];
export const PartnerIdList = S.Array(S.String);
export type HttpTokens = "optional" | "required";
export const HttpTokens = S.Literal("optional", "required");
export type HttpEndpoint = "disabled" | "enabled";
export const HttpEndpoint = S.Literal("disabled", "enabled");
export type HttpProtocolIpv6 = "disabled" | "enabled";
export const HttpProtocolIpv6 = S.Literal("disabled", "enabled");
export type LoadBalancerAttributeName =
  | "HealthCheckPath"
  | "SessionStickinessEnabled"
  | "SessionStickiness_LB_CookieDurationSeconds"
  | "HttpsRedirectionEnabled"
  | "TlsPolicyName";
export const LoadBalancerAttributeName = S.Literal(
  "HealthCheckPath",
  "SessionStickinessEnabled",
  "SessionStickiness_LB_CookieDurationSeconds",
  "HttpsRedirectionEnabled",
  "TlsPolicyName",
);
export interface AllocateStaticIpRequest {
  staticIpName: string;
}
export const AllocateStaticIpRequest = S.suspend(() =>
  S.Struct({ staticIpName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/AllocateStaticIp" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AllocateStaticIpRequest",
}) as any as S.Schema<AllocateStaticIpRequest>;
export interface AttachCertificateToDistributionRequest {
  distributionName: string;
  certificateName: string;
}
export const AttachCertificateToDistributionRequest = S.suspend(() =>
  S.Struct({ distributionName: S.String, certificateName: S.String }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/AttachCertificateToDistribution",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AttachCertificateToDistributionRequest",
}) as any as S.Schema<AttachCertificateToDistributionRequest>;
export interface AttachDiskRequest {
  diskName: string;
  instanceName: string;
  diskPath: string;
  autoMounting?: boolean;
}
export const AttachDiskRequest = S.suspend(() =>
  S.Struct({
    diskName: S.String,
    instanceName: S.String,
    diskPath: S.String,
    autoMounting: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/AttachDisk" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AttachDiskRequest",
}) as any as S.Schema<AttachDiskRequest>;
export interface AttachInstancesToLoadBalancerRequest {
  loadBalancerName: string;
  instanceNames: string[];
}
export const AttachInstancesToLoadBalancerRequest = S.suspend(() =>
  S.Struct({
    loadBalancerName: S.String,
    instanceNames: ResourceNameList,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/AttachInstancesToLoadBalancer",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AttachInstancesToLoadBalancerRequest",
}) as any as S.Schema<AttachInstancesToLoadBalancerRequest>;
export interface AttachLoadBalancerTlsCertificateRequest {
  loadBalancerName: string;
  certificateName: string;
}
export const AttachLoadBalancerTlsCertificateRequest = S.suspend(() =>
  S.Struct({ loadBalancerName: S.String, certificateName: S.String }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/AttachLoadBalancerTlsCertificate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AttachLoadBalancerTlsCertificateRequest",
}) as any as S.Schema<AttachLoadBalancerTlsCertificateRequest>;
export interface AttachStaticIpRequest {
  staticIpName: string;
  instanceName: string;
}
export const AttachStaticIpRequest = S.suspend(() =>
  S.Struct({ staticIpName: S.String, instanceName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/AttachStaticIp" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AttachStaticIpRequest",
}) as any as S.Schema<AttachStaticIpRequest>;
export interface CopySnapshotRequest {
  sourceSnapshotName?: string;
  sourceResourceName?: string;
  restoreDate?: string;
  useLatestRestorableAutoSnapshot?: boolean;
  targetSnapshotName: string;
  sourceRegion: RegionName;
}
export const CopySnapshotRequest = S.suspend(() =>
  S.Struct({
    sourceSnapshotName: S.optional(S.String),
    sourceResourceName: S.optional(S.String),
    restoreDate: S.optional(S.String),
    useLatestRestorableAutoSnapshot: S.optional(S.Boolean),
    targetSnapshotName: S.String,
    sourceRegion: RegionName,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/CopySnapshot" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CopySnapshotRequest",
}) as any as S.Schema<CopySnapshotRequest>;
export interface CreateBucketAccessKeyRequest {
  bucketName: string;
}
export const CreateBucketAccessKeyRequest = S.suspend(() =>
  S.Struct({ bucketName: S.String }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/CreateBucketAccessKey",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBucketAccessKeyRequest",
}) as any as S.Schema<CreateBucketAccessKeyRequest>;
export interface Tag {
  key?: string;
  value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.optional(S.String), value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateCertificateRequest {
  certificateName: string;
  domainName: string;
  subjectAlternativeNames?: string[];
  tags?: Tag[];
}
export const CreateCertificateRequest = S.suspend(() =>
  S.Struct({
    certificateName: S.String,
    domainName: S.String,
    subjectAlternativeNames: S.optional(SubjectAlternativeNameList),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/CreateCertificate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCertificateRequest",
}) as any as S.Schema<CreateCertificateRequest>;
export interface CreateContactMethodRequest {
  protocol: ContactProtocol;
  contactEndpoint: string;
}
export const CreateContactMethodRequest = S.suspend(() =>
  S.Struct({ protocol: ContactProtocol, contactEndpoint: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/CreateContactMethod" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateContactMethodRequest",
}) as any as S.Schema<CreateContactMethodRequest>;
export interface AutoSnapshotAddOnRequest {
  snapshotTimeOfDay?: string;
}
export const AutoSnapshotAddOnRequest = S.suspend(() =>
  S.Struct({ snapshotTimeOfDay: S.optional(S.String) }),
).annotations({
  identifier: "AutoSnapshotAddOnRequest",
}) as any as S.Schema<AutoSnapshotAddOnRequest>;
export interface StopInstanceOnIdleRequest {
  threshold?: string;
  duration?: string;
}
export const StopInstanceOnIdleRequest = S.suspend(() =>
  S.Struct({ threshold: S.optional(S.String), duration: S.optional(S.String) }),
).annotations({
  identifier: "StopInstanceOnIdleRequest",
}) as any as S.Schema<StopInstanceOnIdleRequest>;
export interface AddOnRequest {
  addOnType: AddOnType;
  autoSnapshotAddOnRequest?: AutoSnapshotAddOnRequest;
  stopInstanceOnIdleRequest?: StopInstanceOnIdleRequest;
}
export const AddOnRequest = S.suspend(() =>
  S.Struct({
    addOnType: AddOnType,
    autoSnapshotAddOnRequest: S.optional(AutoSnapshotAddOnRequest),
    stopInstanceOnIdleRequest: S.optional(StopInstanceOnIdleRequest),
  }),
).annotations({ identifier: "AddOnRequest" }) as any as S.Schema<AddOnRequest>;
export type AddOnRequestList = AddOnRequest[];
export const AddOnRequestList = S.Array(AddOnRequest);
export interface CreateDiskFromSnapshotRequest {
  diskName: string;
  diskSnapshotName?: string;
  availabilityZone: string;
  sizeInGb: number;
  tags?: Tag[];
  addOns?: AddOnRequest[];
  sourceDiskName?: string;
  restoreDate?: string;
  useLatestRestorableAutoSnapshot?: boolean;
}
export const CreateDiskFromSnapshotRequest = S.suspend(() =>
  S.Struct({
    diskName: S.String,
    diskSnapshotName: S.optional(S.String),
    availabilityZone: S.String,
    sizeInGb: S.Number,
    tags: S.optional(TagList),
    addOns: S.optional(AddOnRequestList),
    sourceDiskName: S.optional(S.String),
    restoreDate: S.optional(S.String),
    useLatestRestorableAutoSnapshot: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/CreateDiskFromSnapshot",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDiskFromSnapshotRequest",
}) as any as S.Schema<CreateDiskFromSnapshotRequest>;
export interface CreateDiskSnapshotRequest {
  diskName?: string;
  diskSnapshotName: string;
  instanceName?: string;
  tags?: Tag[];
}
export const CreateDiskSnapshotRequest = S.suspend(() =>
  S.Struct({
    diskName: S.optional(S.String),
    diskSnapshotName: S.String,
    instanceName: S.optional(S.String),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/CreateDiskSnapshot" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDiskSnapshotRequest",
}) as any as S.Schema<CreateDiskSnapshotRequest>;
export interface CreateDomainRequest {
  domainName: string;
  tags?: Tag[];
}
export const CreateDomainRequest = S.suspend(() =>
  S.Struct({ domainName: S.String, tags: S.optional(TagList) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/CreateDomain" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDomainRequest",
}) as any as S.Schema<CreateDomainRequest>;
export interface CreateGUISessionAccessDetailsRequest {
  resourceName: string;
}
export const CreateGUISessionAccessDetailsRequest = S.suspend(() =>
  S.Struct({ resourceName: S.String }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/create-gui-session-access-details",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateGUISessionAccessDetailsRequest",
}) as any as S.Schema<CreateGUISessionAccessDetailsRequest>;
export interface CreateInstancesRequest {
  instanceNames: string[];
  availabilityZone: string;
  customImageName?: string;
  blueprintId: string;
  bundleId: string;
  userData?: string;
  keyPairName?: string;
  tags?: Tag[];
  addOns?: AddOnRequest[];
  ipAddressType?: IpAddressType;
}
export const CreateInstancesRequest = S.suspend(() =>
  S.Struct({
    instanceNames: StringList,
    availabilityZone: S.String,
    customImageName: S.optional(S.String),
    blueprintId: S.String,
    bundleId: S.String,
    userData: S.optional(S.String),
    keyPairName: S.optional(S.String),
    tags: S.optional(TagList),
    addOns: S.optional(AddOnRequestList),
    ipAddressType: S.optional(IpAddressType),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/CreateInstances" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateInstancesRequest",
}) as any as S.Schema<CreateInstancesRequest>;
export interface CreateInstanceSnapshotRequest {
  instanceSnapshotName: string;
  instanceName: string;
  tags?: Tag[];
}
export const CreateInstanceSnapshotRequest = S.suspend(() =>
  S.Struct({
    instanceSnapshotName: S.String,
    instanceName: S.String,
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/CreateInstanceSnapshot",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateInstanceSnapshotRequest",
}) as any as S.Schema<CreateInstanceSnapshotRequest>;
export interface CreateKeyPairRequest {
  keyPairName: string;
  tags?: Tag[];
}
export const CreateKeyPairRequest = S.suspend(() =>
  S.Struct({ keyPairName: S.String, tags: S.optional(TagList) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/CreateKeyPair" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateKeyPairRequest",
}) as any as S.Schema<CreateKeyPairRequest>;
export interface CreateLoadBalancerRequest {
  loadBalancerName: string;
  instancePort: number;
  healthCheckPath?: string;
  certificateName?: string;
  certificateDomainName?: string;
  certificateAlternativeNames?: string[];
  tags?: Tag[];
  ipAddressType?: IpAddressType;
  tlsPolicyName?: string;
}
export const CreateLoadBalancerRequest = S.suspend(() =>
  S.Struct({
    loadBalancerName: S.String,
    instancePort: S.Number,
    healthCheckPath: S.optional(S.String),
    certificateName: S.optional(S.String),
    certificateDomainName: S.optional(S.String),
    certificateAlternativeNames: S.optional(DomainNameList),
    tags: S.optional(TagList),
    ipAddressType: S.optional(IpAddressType),
    tlsPolicyName: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/CreateLoadBalancer" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLoadBalancerRequest",
}) as any as S.Schema<CreateLoadBalancerRequest>;
export interface CreateLoadBalancerTlsCertificateRequest {
  loadBalancerName: string;
  certificateName: string;
  certificateDomainName: string;
  certificateAlternativeNames?: string[];
  tags?: Tag[];
}
export const CreateLoadBalancerTlsCertificateRequest = S.suspend(() =>
  S.Struct({
    loadBalancerName: S.String,
    certificateName: S.String,
    certificateDomainName: S.String,
    certificateAlternativeNames: S.optional(DomainNameList),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/CreateLoadBalancerTlsCertificate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLoadBalancerTlsCertificateRequest",
}) as any as S.Schema<CreateLoadBalancerTlsCertificateRequest>;
export interface CreateRelationalDatabaseRequest {
  relationalDatabaseName: string;
  availabilityZone?: string;
  relationalDatabaseBlueprintId: string;
  relationalDatabaseBundleId: string;
  masterDatabaseName: string;
  masterUsername: string;
  masterUserPassword?: string | redacted.Redacted<string>;
  preferredBackupWindow?: string;
  preferredMaintenanceWindow?: string;
  publiclyAccessible?: boolean;
  tags?: Tag[];
}
export const CreateRelationalDatabaseRequest = S.suspend(() =>
  S.Struct({
    relationalDatabaseName: S.String,
    availabilityZone: S.optional(S.String),
    relationalDatabaseBlueprintId: S.String,
    relationalDatabaseBundleId: S.String,
    masterDatabaseName: S.String,
    masterUsername: S.String,
    masterUserPassword: S.optional(SensitiveString),
    preferredBackupWindow: S.optional(S.String),
    preferredMaintenanceWindow: S.optional(S.String),
    publiclyAccessible: S.optional(S.Boolean),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/CreateRelationalDatabase",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRelationalDatabaseRequest",
}) as any as S.Schema<CreateRelationalDatabaseRequest>;
export interface CreateRelationalDatabaseFromSnapshotRequest {
  relationalDatabaseName: string;
  availabilityZone?: string;
  publiclyAccessible?: boolean;
  relationalDatabaseSnapshotName?: string;
  relationalDatabaseBundleId?: string;
  sourceRelationalDatabaseName?: string;
  restoreTime?: Date;
  useLatestRestorableTime?: boolean;
  tags?: Tag[];
}
export const CreateRelationalDatabaseFromSnapshotRequest = S.suspend(() =>
  S.Struct({
    relationalDatabaseName: S.String,
    availabilityZone: S.optional(S.String),
    publiclyAccessible: S.optional(S.Boolean),
    relationalDatabaseSnapshotName: S.optional(S.String),
    relationalDatabaseBundleId: S.optional(S.String),
    sourceRelationalDatabaseName: S.optional(S.String),
    restoreTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    useLatestRestorableTime: S.optional(S.Boolean),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/CreateRelationalDatabaseFromSnapshot",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRelationalDatabaseFromSnapshotRequest",
}) as any as S.Schema<CreateRelationalDatabaseFromSnapshotRequest>;
export interface CreateRelationalDatabaseSnapshotRequest {
  relationalDatabaseName: string;
  relationalDatabaseSnapshotName: string;
  tags?: Tag[];
}
export const CreateRelationalDatabaseSnapshotRequest = S.suspend(() =>
  S.Struct({
    relationalDatabaseName: S.String,
    relationalDatabaseSnapshotName: S.String,
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/CreateRelationalDatabaseSnapshot",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRelationalDatabaseSnapshotRequest",
}) as any as S.Schema<CreateRelationalDatabaseSnapshotRequest>;
export interface DeleteAlarmRequest {
  alarmName: string;
}
export const DeleteAlarmRequest = S.suspend(() =>
  S.Struct({ alarmName: S.String.pipe(T.HttpLabel("alarmName")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/ls/api/2016-11-28/DeleteAlarm/{alarmName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAlarmRequest",
}) as any as S.Schema<DeleteAlarmRequest>;
export interface DeleteAutoSnapshotRequest {
  resourceName: string;
  date: string;
}
export const DeleteAutoSnapshotRequest = S.suspend(() =>
  S.Struct({ resourceName: S.String, date: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteAutoSnapshot" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAutoSnapshotRequest",
}) as any as S.Schema<DeleteAutoSnapshotRequest>;
export interface DeleteBucketRequest {
  bucketName: string;
  forceDelete?: boolean;
}
export const DeleteBucketRequest = S.suspend(() =>
  S.Struct({ bucketName: S.String, forceDelete: S.optional(S.Boolean) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteBucket" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBucketRequest",
}) as any as S.Schema<DeleteBucketRequest>;
export interface DeleteBucketAccessKeyRequest {
  bucketName: string;
  accessKeyId: string;
}
export const DeleteBucketAccessKeyRequest = S.suspend(() =>
  S.Struct({ bucketName: S.String, accessKeyId: S.String }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/DeleteBucketAccessKey",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBucketAccessKeyRequest",
}) as any as S.Schema<DeleteBucketAccessKeyRequest>;
export interface DeleteCertificateRequest {
  certificateName: string;
}
export const DeleteCertificateRequest = S.suspend(() =>
  S.Struct({ certificateName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteCertificate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCertificateRequest",
}) as any as S.Schema<DeleteCertificateRequest>;
export interface DeleteContactMethodRequest {
  protocol: ContactProtocol;
}
export const DeleteContactMethodRequest = S.suspend(() =>
  S.Struct({ protocol: ContactProtocol }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteContactMethod" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteContactMethodRequest",
}) as any as S.Schema<DeleteContactMethodRequest>;
export interface DeleteContainerImageRequest {
  serviceName: string;
  image: string;
}
export const DeleteContainerImageRequest = S.suspend(() =>
  S.Struct({
    serviceName: S.String.pipe(T.HttpLabel("serviceName")),
    image: S.String.pipe(T.HttpLabel("image")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/ls/api/2016-11-28/container-services/{serviceName}/images/{image}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteContainerImageRequest",
}) as any as S.Schema<DeleteContainerImageRequest>;
export interface DeleteContainerImageResult {}
export const DeleteContainerImageResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteContainerImageResult",
}) as any as S.Schema<DeleteContainerImageResult>;
export interface DeleteContainerServiceRequest {
  serviceName: string;
}
export const DeleteContainerServiceRequest = S.suspend(() =>
  S.Struct({ serviceName: S.String.pipe(T.HttpLabel("serviceName")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/ls/api/2016-11-28/container-services/{serviceName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteContainerServiceRequest",
}) as any as S.Schema<DeleteContainerServiceRequest>;
export interface DeleteContainerServiceResult {}
export const DeleteContainerServiceResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteContainerServiceResult",
}) as any as S.Schema<DeleteContainerServiceResult>;
export interface DeleteDiskRequest {
  diskName: string;
  forceDeleteAddOns?: boolean;
}
export const DeleteDiskRequest = S.suspend(() =>
  S.Struct({
    diskName: S.String,
    forceDeleteAddOns: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteDisk" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDiskRequest",
}) as any as S.Schema<DeleteDiskRequest>;
export interface DeleteDiskSnapshotRequest {
  diskSnapshotName: string;
}
export const DeleteDiskSnapshotRequest = S.suspend(() =>
  S.Struct({ diskSnapshotName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteDiskSnapshot" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDiskSnapshotRequest",
}) as any as S.Schema<DeleteDiskSnapshotRequest>;
export interface DeleteDistributionRequest {
  distributionName?: string;
}
export const DeleteDistributionRequest = S.suspend(() =>
  S.Struct({ distributionName: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteDistribution" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDistributionRequest",
}) as any as S.Schema<DeleteDistributionRequest>;
export interface DeleteDomainRequest {
  domainName: string;
}
export const DeleteDomainRequest = S.suspend(() =>
  S.Struct({ domainName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteDomain" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDomainRequest",
}) as any as S.Schema<DeleteDomainRequest>;
export type DomainEntryOptions = { [key: string]: string };
export const DomainEntryOptions = S.Record({ key: S.String, value: S.String });
export interface DomainEntry {
  id?: string;
  name?: string;
  target?: string;
  isAlias?: boolean;
  type?: string;
  options?: { [key: string]: string };
}
export const DomainEntry = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    target: S.optional(S.String),
    isAlias: S.optional(S.Boolean),
    type: S.optional(S.String),
    options: S.optional(DomainEntryOptions),
  }),
).annotations({ identifier: "DomainEntry" }) as any as S.Schema<DomainEntry>;
export interface DeleteDomainEntryRequest {
  domainName: string;
  domainEntry: DomainEntry;
}
export const DeleteDomainEntryRequest = S.suspend(() =>
  S.Struct({ domainName: S.String, domainEntry: DomainEntry }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteDomainEntry" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDomainEntryRequest",
}) as any as S.Schema<DeleteDomainEntryRequest>;
export interface DeleteInstanceRequest {
  instanceName: string;
  forceDeleteAddOns?: boolean;
}
export const DeleteInstanceRequest = S.suspend(() =>
  S.Struct({
    instanceName: S.String,
    forceDeleteAddOns: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteInstance" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteInstanceRequest",
}) as any as S.Schema<DeleteInstanceRequest>;
export interface DeleteInstanceSnapshotRequest {
  instanceSnapshotName: string;
}
export const DeleteInstanceSnapshotRequest = S.suspend(() =>
  S.Struct({ instanceSnapshotName: S.String }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/DeleteInstanceSnapshot",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteInstanceSnapshotRequest",
}) as any as S.Schema<DeleteInstanceSnapshotRequest>;
export interface DeleteKeyPairRequest {
  keyPairName: string;
  expectedFingerprint?: string;
}
export const DeleteKeyPairRequest = S.suspend(() =>
  S.Struct({
    keyPairName: S.String,
    expectedFingerprint: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteKeyPair" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteKeyPairRequest",
}) as any as S.Schema<DeleteKeyPairRequest>;
export interface DeleteKnownHostKeysRequest {
  instanceName: string;
}
export const DeleteKnownHostKeysRequest = S.suspend(() =>
  S.Struct({ instanceName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteKnownHostKeys" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteKnownHostKeysRequest",
}) as any as S.Schema<DeleteKnownHostKeysRequest>;
export interface DeleteLoadBalancerRequest {
  loadBalancerName: string;
}
export const DeleteLoadBalancerRequest = S.suspend(() =>
  S.Struct({ loadBalancerName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteLoadBalancer" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLoadBalancerRequest",
}) as any as S.Schema<DeleteLoadBalancerRequest>;
export interface DeleteLoadBalancerTlsCertificateRequest {
  loadBalancerName: string;
  certificateName: string;
  force?: boolean;
}
export const DeleteLoadBalancerTlsCertificateRequest = S.suspend(() =>
  S.Struct({
    loadBalancerName: S.String,
    certificateName: S.String,
    force: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/DeleteLoadBalancerTlsCertificate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLoadBalancerTlsCertificateRequest",
}) as any as S.Schema<DeleteLoadBalancerTlsCertificateRequest>;
export interface DeleteRelationalDatabaseRequest {
  relationalDatabaseName: string;
  skipFinalSnapshot?: boolean;
  finalRelationalDatabaseSnapshotName?: string;
}
export const DeleteRelationalDatabaseRequest = S.suspend(() =>
  S.Struct({
    relationalDatabaseName: S.String,
    skipFinalSnapshot: S.optional(S.Boolean),
    finalRelationalDatabaseSnapshotName: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/DeleteRelationalDatabase",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRelationalDatabaseRequest",
}) as any as S.Schema<DeleteRelationalDatabaseRequest>;
export interface DeleteRelationalDatabaseSnapshotRequest {
  relationalDatabaseSnapshotName: string;
}
export const DeleteRelationalDatabaseSnapshotRequest = S.suspend(() =>
  S.Struct({ relationalDatabaseSnapshotName: S.String }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/DeleteRelationalDatabaseSnapshot",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRelationalDatabaseSnapshotRequest",
}) as any as S.Schema<DeleteRelationalDatabaseSnapshotRequest>;
export interface DetachCertificateFromDistributionRequest {
  distributionName: string;
}
export const DetachCertificateFromDistributionRequest = S.suspend(() =>
  S.Struct({ distributionName: S.String }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/DetachCertificateFromDistribution",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DetachCertificateFromDistributionRequest",
}) as any as S.Schema<DetachCertificateFromDistributionRequest>;
export interface DetachDiskRequest {
  diskName: string;
}
export const DetachDiskRequest = S.suspend(() =>
  S.Struct({ diskName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DetachDisk" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DetachDiskRequest",
}) as any as S.Schema<DetachDiskRequest>;
export interface DetachInstancesFromLoadBalancerRequest {
  loadBalancerName: string;
  instanceNames: string[];
}
export const DetachInstancesFromLoadBalancerRequest = S.suspend(() =>
  S.Struct({
    loadBalancerName: S.String,
    instanceNames: ResourceNameList,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/DetachInstancesFromLoadBalancer",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DetachInstancesFromLoadBalancerRequest",
}) as any as S.Schema<DetachInstancesFromLoadBalancerRequest>;
export interface DetachStaticIpRequest {
  staticIpName: string;
}
export const DetachStaticIpRequest = S.suspend(() =>
  S.Struct({ staticIpName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DetachStaticIp" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DetachStaticIpRequest",
}) as any as S.Schema<DetachStaticIpRequest>;
export interface DisableAddOnRequest {
  addOnType: AddOnType;
  resourceName: string;
}
export const DisableAddOnRequest = S.suspend(() =>
  S.Struct({ addOnType: AddOnType, resourceName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DisableAddOn" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisableAddOnRequest",
}) as any as S.Schema<DisableAddOnRequest>;
export interface DownloadDefaultKeyPairResult {
  publicKeyBase64?: string;
  privateKeyBase64?: string;
  createdAt?: Date;
}
export const DownloadDefaultKeyPairResult = S.suspend(() =>
  S.Struct({
    publicKeyBase64: S.optional(S.String),
    privateKeyBase64: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DownloadDefaultKeyPairResult",
}) as any as S.Schema<DownloadDefaultKeyPairResult>;
export interface EnableAddOnRequest {
  resourceName: string;
  addOnRequest: AddOnRequest;
}
export const EnableAddOnRequest = S.suspend(() =>
  S.Struct({ resourceName: S.String, addOnRequest: AddOnRequest }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/EnableAddOn" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EnableAddOnRequest",
}) as any as S.Schema<EnableAddOnRequest>;
export interface ExportSnapshotRequest {
  sourceSnapshotName: string;
}
export const ExportSnapshotRequest = S.suspend(() =>
  S.Struct({ sourceSnapshotName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/ExportSnapshot" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExportSnapshotRequest",
}) as any as S.Schema<ExportSnapshotRequest>;
export interface GetActiveNamesRequest {
  pageToken?: string;
}
export const GetActiveNamesRequest = S.suspend(() =>
  S.Struct({ pageToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetActiveNames" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetActiveNamesRequest",
}) as any as S.Schema<GetActiveNamesRequest>;
export interface GetAlarmsRequest {
  alarmName?: string;
  pageToken?: string;
  monitoredResourceName?: string;
}
export const GetAlarmsRequest = S.suspend(() =>
  S.Struct({
    alarmName: S.optional(S.String).pipe(T.HttpQuery("alarmName")),
    pageToken: S.optional(S.String).pipe(T.HttpQuery("pageToken")),
    monitoredResourceName: S.optional(S.String).pipe(
      T.HttpQuery("monitoredResourceName"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/ls/api/2016-11-28/GetAlarms" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAlarmsRequest",
}) as any as S.Schema<GetAlarmsRequest>;
export interface GetAutoSnapshotsRequest {
  resourceName: string;
}
export const GetAutoSnapshotsRequest = S.suspend(() =>
  S.Struct({ resourceName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetAutoSnapshots" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAutoSnapshotsRequest",
}) as any as S.Schema<GetAutoSnapshotsRequest>;
export interface GetBlueprintsRequest {
  includeInactive?: boolean;
  pageToken?: string;
  appCategory?: AppCategory;
}
export const GetBlueprintsRequest = S.suspend(() =>
  S.Struct({
    includeInactive: S.optional(S.Boolean),
    pageToken: S.optional(S.String),
    appCategory: S.optional(AppCategory),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetBlueprints" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBlueprintsRequest",
}) as any as S.Schema<GetBlueprintsRequest>;
export interface GetBucketAccessKeysRequest {
  bucketName: string;
}
export const GetBucketAccessKeysRequest = S.suspend(() =>
  S.Struct({ bucketName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetBucketAccessKeys" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBucketAccessKeysRequest",
}) as any as S.Schema<GetBucketAccessKeysRequest>;
export interface GetBucketBundlesRequest {
  includeInactive?: boolean;
}
export const GetBucketBundlesRequest = S.suspend(() =>
  S.Struct({ includeInactive: S.optional(S.Boolean) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetBucketBundles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBucketBundlesRequest",
}) as any as S.Schema<GetBucketBundlesRequest>;
export interface GetBucketMetricDataRequest {
  bucketName: string;
  metricName: BucketMetricName;
  startTime: Date;
  endTime: Date;
  period: number;
  statistics: MetricStatistic[];
  unit: MetricUnit;
}
export const GetBucketMetricDataRequest = S.suspend(() =>
  S.Struct({
    bucketName: S.String,
    metricName: BucketMetricName,
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    period: S.Number,
    statistics: MetricStatisticList,
    unit: MetricUnit,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetBucketMetricData" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBucketMetricDataRequest",
}) as any as S.Schema<GetBucketMetricDataRequest>;
export interface GetBucketsRequest {
  bucketName?: string;
  pageToken?: string;
  includeConnectedResources?: boolean;
  includeCors?: boolean;
}
export const GetBucketsRequest = S.suspend(() =>
  S.Struct({
    bucketName: S.optional(S.String),
    pageToken: S.optional(S.String),
    includeConnectedResources: S.optional(S.Boolean),
    includeCors: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetBuckets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBucketsRequest",
}) as any as S.Schema<GetBucketsRequest>;
export interface GetBundlesRequest {
  includeInactive?: boolean;
  pageToken?: string;
  appCategory?: AppCategory;
}
export const GetBundlesRequest = S.suspend(() =>
  S.Struct({
    includeInactive: S.optional(S.Boolean),
    pageToken: S.optional(S.String),
    appCategory: S.optional(AppCategory),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetBundles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBundlesRequest",
}) as any as S.Schema<GetBundlesRequest>;
export interface GetCertificatesRequest {
  certificateStatuses?: CertificateStatus[];
  includeCertificateDetails?: boolean;
  certificateName?: string;
  pageToken?: string;
}
export const GetCertificatesRequest = S.suspend(() =>
  S.Struct({
    certificateStatuses: S.optional(CertificateStatusList),
    includeCertificateDetails: S.optional(S.Boolean),
    certificateName: S.optional(S.String),
    pageToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetCertificates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCertificatesRequest",
}) as any as S.Schema<GetCertificatesRequest>;
export interface GetCloudFormationStackRecordsRequest {
  pageToken?: string;
}
export const GetCloudFormationStackRecordsRequest = S.suspend(() =>
  S.Struct({ pageToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/GetCloudFormationStackRecords",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCloudFormationStackRecordsRequest",
}) as any as S.Schema<GetCloudFormationStackRecordsRequest>;
export interface GetContactMethodsRequest {
  protocols?: ContactProtocol[];
}
export const GetContactMethodsRequest = S.suspend(() =>
  S.Struct({
    protocols: S.optional(ContactProtocolsList).pipe(T.HttpQuery("protocols")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/ls/api/2016-11-28/GetContactMethods" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetContactMethodsRequest",
}) as any as S.Schema<GetContactMethodsRequest>;
export interface GetContainerImagesRequest {
  serviceName: string;
}
export const GetContainerImagesRequest = S.suspend(() =>
  S.Struct({ serviceName: S.String.pipe(T.HttpLabel("serviceName")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/ls/api/2016-11-28/container-services/{serviceName}/images",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetContainerImagesRequest",
}) as any as S.Schema<GetContainerImagesRequest>;
export interface GetContainerLogRequest {
  serviceName: string;
  containerName: string;
  startTime?: Date;
  endTime?: Date;
  filterPattern?: string;
  pageToken?: string;
}
export const GetContainerLogRequest = S.suspend(() =>
  S.Struct({
    serviceName: S.String.pipe(T.HttpLabel("serviceName")),
    containerName: S.String.pipe(T.HttpLabel("containerName")),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("endTime"),
    ),
    filterPattern: S.optional(S.String).pipe(T.HttpQuery("filterPattern")),
    pageToken: S.optional(S.String).pipe(T.HttpQuery("pageToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/ls/api/2016-11-28/container-services/{serviceName}/containers/{containerName}/log",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetContainerLogRequest",
}) as any as S.Schema<GetContainerLogRequest>;
export interface GetContainerServiceDeploymentsRequest {
  serviceName: string;
}
export const GetContainerServiceDeploymentsRequest = S.suspend(() =>
  S.Struct({ serviceName: S.String.pipe(T.HttpLabel("serviceName")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/ls/api/2016-11-28/container-services/{serviceName}/deployments",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetContainerServiceDeploymentsRequest",
}) as any as S.Schema<GetContainerServiceDeploymentsRequest>;
export interface GetContainerServiceMetricDataRequest {
  serviceName: string;
  metricName: ContainerServiceMetricName;
  startTime: Date;
  endTime: Date;
  period: number;
  statistics: MetricStatistic[];
}
export const GetContainerServiceMetricDataRequest = S.suspend(() =>
  S.Struct({
    serviceName: S.String.pipe(T.HttpLabel("serviceName")),
    metricName: ContainerServiceMetricName.pipe(T.HttpQuery("metricName")),
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("endTime"),
    ),
    period: S.Number.pipe(T.HttpQuery("period")),
    statistics: MetricStatisticList.pipe(T.HttpQuery("statistics")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/ls/api/2016-11-28/container-services/{serviceName}/metrics",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetContainerServiceMetricDataRequest",
}) as any as S.Schema<GetContainerServiceMetricDataRequest>;
export interface GetContainerServicesRequest {
  serviceName?: string;
}
export const GetContainerServicesRequest = S.suspend(() =>
  S.Struct({
    serviceName: S.optional(S.String).pipe(T.HttpQuery("serviceName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/ls/api/2016-11-28/container-services" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetContainerServicesRequest",
}) as any as S.Schema<GetContainerServicesRequest>;
export interface GetCostEstimateRequest {
  resourceName: string;
  startTime: Date;
  endTime: Date;
}
export const GetCostEstimateRequest = S.suspend(() =>
  S.Struct({
    resourceName: S.String,
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/budgettracker/getCostEstimate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCostEstimateRequest",
}) as any as S.Schema<GetCostEstimateRequest>;
export interface GetDiskRequest {
  diskName: string;
}
export const GetDiskRequest = S.suspend(() =>
  S.Struct({ diskName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetDisk" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDiskRequest",
}) as any as S.Schema<GetDiskRequest>;
export interface GetDisksRequest {
  pageToken?: string;
}
export const GetDisksRequest = S.suspend(() =>
  S.Struct({ pageToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetDisks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDisksRequest",
}) as any as S.Schema<GetDisksRequest>;
export interface GetDiskSnapshotRequest {
  diskSnapshotName: string;
}
export const GetDiskSnapshotRequest = S.suspend(() =>
  S.Struct({ diskSnapshotName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetDiskSnapshot" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDiskSnapshotRequest",
}) as any as S.Schema<GetDiskSnapshotRequest>;
export interface GetDiskSnapshotsRequest {
  pageToken?: string;
}
export const GetDiskSnapshotsRequest = S.suspend(() =>
  S.Struct({ pageToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetDiskSnapshots" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDiskSnapshotsRequest",
}) as any as S.Schema<GetDiskSnapshotsRequest>;
export interface GetDistributionLatestCacheResetRequest {
  distributionName?: string;
}
export const GetDistributionLatestCacheResetRequest = S.suspend(() =>
  S.Struct({ distributionName: S.optional(S.String) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/GetDistributionLatestCacheReset",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDistributionLatestCacheResetRequest",
}) as any as S.Schema<GetDistributionLatestCacheResetRequest>;
export interface GetDistributionMetricDataRequest {
  distributionName: string;
  metricName: DistributionMetricName;
  startTime: Date;
  endTime: Date;
  period: number;
  unit: MetricUnit;
  statistics: MetricStatistic[];
}
export const GetDistributionMetricDataRequest = S.suspend(() =>
  S.Struct({
    distributionName: S.String,
    metricName: DistributionMetricName,
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    period: S.Number,
    unit: MetricUnit,
    statistics: MetricStatisticList,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/GetDistributionMetricData",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDistributionMetricDataRequest",
}) as any as S.Schema<GetDistributionMetricDataRequest>;
export interface GetDistributionsRequest {
  distributionName?: string;
  pageToken?: string;
}
export const GetDistributionsRequest = S.suspend(() =>
  S.Struct({
    distributionName: S.optional(S.String),
    pageToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetDistributions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDistributionsRequest",
}) as any as S.Schema<GetDistributionsRequest>;
export interface GetDomainRequest {
  domainName: string;
}
export const GetDomainRequest = S.suspend(() =>
  S.Struct({ domainName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetDomain" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDomainRequest",
}) as any as S.Schema<GetDomainRequest>;
export interface GetDomainsRequest {
  pageToken?: string;
}
export const GetDomainsRequest = S.suspend(() =>
  S.Struct({ pageToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetDomains" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDomainsRequest",
}) as any as S.Schema<GetDomainsRequest>;
export interface GetExportSnapshotRecordsRequest {
  pageToken?: string;
}
export const GetExportSnapshotRecordsRequest = S.suspend(() =>
  S.Struct({ pageToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/GetExportSnapshotRecords",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetExportSnapshotRecordsRequest",
}) as any as S.Schema<GetExportSnapshotRecordsRequest>;
export interface GetInstanceRequest {
  instanceName: string;
}
export const GetInstanceRequest = S.suspend(() =>
  S.Struct({ instanceName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetInstance" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInstanceRequest",
}) as any as S.Schema<GetInstanceRequest>;
export interface GetInstanceAccessDetailsRequest {
  instanceName: string;
  protocol?: InstanceAccessProtocol;
}
export const GetInstanceAccessDetailsRequest = S.suspend(() =>
  S.Struct({
    instanceName: S.String,
    protocol: S.optional(InstanceAccessProtocol),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/GetInstanceAccessDetails",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInstanceAccessDetailsRequest",
}) as any as S.Schema<GetInstanceAccessDetailsRequest>;
export interface GetInstanceMetricDataRequest {
  instanceName: string;
  metricName: InstanceMetricName;
  period: number;
  startTime: Date;
  endTime: Date;
  unit: MetricUnit;
  statistics: MetricStatistic[];
}
export const GetInstanceMetricDataRequest = S.suspend(() =>
  S.Struct({
    instanceName: S.String,
    metricName: InstanceMetricName,
    period: S.Number,
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    unit: MetricUnit,
    statistics: MetricStatisticList,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/GetInstanceMetricData",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInstanceMetricDataRequest",
}) as any as S.Schema<GetInstanceMetricDataRequest>;
export interface GetInstancePortStatesRequest {
  instanceName: string;
}
export const GetInstancePortStatesRequest = S.suspend(() =>
  S.Struct({ instanceName: S.String }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/GetInstancePortStates",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInstancePortStatesRequest",
}) as any as S.Schema<GetInstancePortStatesRequest>;
export interface GetInstancesRequest {
  pageToken?: string;
}
export const GetInstancesRequest = S.suspend(() =>
  S.Struct({ pageToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetInstances" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInstancesRequest",
}) as any as S.Schema<GetInstancesRequest>;
export interface GetInstanceSnapshotRequest {
  instanceSnapshotName: string;
}
export const GetInstanceSnapshotRequest = S.suspend(() =>
  S.Struct({ instanceSnapshotName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetInstanceSnapshot" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInstanceSnapshotRequest",
}) as any as S.Schema<GetInstanceSnapshotRequest>;
export interface GetInstanceSnapshotsRequest {
  pageToken?: string;
}
export const GetInstanceSnapshotsRequest = S.suspend(() =>
  S.Struct({ pageToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/GetInstanceSnapshots",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInstanceSnapshotsRequest",
}) as any as S.Schema<GetInstanceSnapshotsRequest>;
export interface GetInstanceStateRequest {
  instanceName: string;
}
export const GetInstanceStateRequest = S.suspend(() =>
  S.Struct({ instanceName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetInstanceState" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInstanceStateRequest",
}) as any as S.Schema<GetInstanceStateRequest>;
export interface GetKeyPairRequest {
  keyPairName: string;
}
export const GetKeyPairRequest = S.suspend(() =>
  S.Struct({ keyPairName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetKeyPair" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetKeyPairRequest",
}) as any as S.Schema<GetKeyPairRequest>;
export interface GetKeyPairsRequest {
  pageToken?: string;
  includeDefaultKeyPair?: boolean;
}
export const GetKeyPairsRequest = S.suspend(() =>
  S.Struct({
    pageToken: S.optional(S.String),
    includeDefaultKeyPair: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetKeyPairs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetKeyPairsRequest",
}) as any as S.Schema<GetKeyPairsRequest>;
export interface GetLoadBalancerRequest {
  loadBalancerName: string;
}
export const GetLoadBalancerRequest = S.suspend(() =>
  S.Struct({ loadBalancerName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetLoadBalancer" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLoadBalancerRequest",
}) as any as S.Schema<GetLoadBalancerRequest>;
export interface GetLoadBalancerMetricDataRequest {
  loadBalancerName: string;
  metricName: LoadBalancerMetricName;
  period: number;
  startTime: Date;
  endTime: Date;
  unit: MetricUnit;
  statistics: MetricStatistic[];
}
export const GetLoadBalancerMetricDataRequest = S.suspend(() =>
  S.Struct({
    loadBalancerName: S.String,
    metricName: LoadBalancerMetricName,
    period: S.Number,
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    unit: MetricUnit,
    statistics: MetricStatisticList,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/GetLoadBalancerMetricData",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLoadBalancerMetricDataRequest",
}) as any as S.Schema<GetLoadBalancerMetricDataRequest>;
export interface GetLoadBalancersRequest {
  pageToken?: string;
}
export const GetLoadBalancersRequest = S.suspend(() =>
  S.Struct({ pageToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetLoadBalancers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLoadBalancersRequest",
}) as any as S.Schema<GetLoadBalancersRequest>;
export interface GetLoadBalancerTlsCertificatesRequest {
  loadBalancerName: string;
}
export const GetLoadBalancerTlsCertificatesRequest = S.suspend(() =>
  S.Struct({ loadBalancerName: S.String }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/GetLoadBalancerTlsCertificates",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLoadBalancerTlsCertificatesRequest",
}) as any as S.Schema<GetLoadBalancerTlsCertificatesRequest>;
export interface GetLoadBalancerTlsPoliciesRequest {
  pageToken?: string;
}
export const GetLoadBalancerTlsPoliciesRequest = S.suspend(() =>
  S.Struct({ pageToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/GetLoadBalancerTlsPolicies",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLoadBalancerTlsPoliciesRequest",
}) as any as S.Schema<GetLoadBalancerTlsPoliciesRequest>;
export interface GetOperationRequest {
  operationId: string;
}
export const GetOperationRequest = S.suspend(() =>
  S.Struct({ operationId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetOperation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetOperationRequest",
}) as any as S.Schema<GetOperationRequest>;
export interface GetOperationsRequest {
  pageToken?: string;
}
export const GetOperationsRequest = S.suspend(() =>
  S.Struct({ pageToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetOperations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetOperationsRequest",
}) as any as S.Schema<GetOperationsRequest>;
export interface GetOperationsForResourceRequest {
  resourceName: string;
  pageToken?: string;
}
export const GetOperationsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceName: S.String, pageToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/GetOperationsForResource",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetOperationsForResourceRequest",
}) as any as S.Schema<GetOperationsForResourceRequest>;
export interface GetRegionsRequest {
  includeAvailabilityZones?: boolean;
  includeRelationalDatabaseAvailabilityZones?: boolean;
}
export const GetRegionsRequest = S.suspend(() =>
  S.Struct({
    includeAvailabilityZones: S.optional(S.Boolean),
    includeRelationalDatabaseAvailabilityZones: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetRegions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRegionsRequest",
}) as any as S.Schema<GetRegionsRequest>;
export interface GetRelationalDatabaseRequest {
  relationalDatabaseName: string;
}
export const GetRelationalDatabaseRequest = S.suspend(() =>
  S.Struct({ relationalDatabaseName: S.String }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/GetRelationalDatabase",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRelationalDatabaseRequest",
}) as any as S.Schema<GetRelationalDatabaseRequest>;
export interface GetRelationalDatabaseBlueprintsRequest {
  pageToken?: string;
}
export const GetRelationalDatabaseBlueprintsRequest = S.suspend(() =>
  S.Struct({ pageToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/GetRelationalDatabaseBlueprints",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRelationalDatabaseBlueprintsRequest",
}) as any as S.Schema<GetRelationalDatabaseBlueprintsRequest>;
export interface GetRelationalDatabaseBundlesRequest {
  pageToken?: string;
  includeInactive?: boolean;
}
export const GetRelationalDatabaseBundlesRequest = S.suspend(() =>
  S.Struct({
    pageToken: S.optional(S.String),
    includeInactive: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/GetRelationalDatabaseBundles",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRelationalDatabaseBundlesRequest",
}) as any as S.Schema<GetRelationalDatabaseBundlesRequest>;
export interface GetRelationalDatabaseEventsRequest {
  relationalDatabaseName: string;
  durationInMinutes?: number;
  pageToken?: string;
}
export const GetRelationalDatabaseEventsRequest = S.suspend(() =>
  S.Struct({
    relationalDatabaseName: S.String,
    durationInMinutes: S.optional(S.Number),
    pageToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/GetRelationalDatabaseEvents",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRelationalDatabaseEventsRequest",
}) as any as S.Schema<GetRelationalDatabaseEventsRequest>;
export interface GetRelationalDatabaseLogEventsRequest {
  relationalDatabaseName: string;
  logStreamName: string;
  startTime?: Date;
  endTime?: Date;
  startFromHead?: boolean;
  pageToken?: string;
}
export const GetRelationalDatabaseLogEventsRequest = S.suspend(() =>
  S.Struct({
    relationalDatabaseName: S.String,
    logStreamName: S.String,
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    startFromHead: S.optional(S.Boolean),
    pageToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/GetRelationalDatabaseLogEvents",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRelationalDatabaseLogEventsRequest",
}) as any as S.Schema<GetRelationalDatabaseLogEventsRequest>;
export interface GetRelationalDatabaseLogStreamsRequest {
  relationalDatabaseName: string;
}
export const GetRelationalDatabaseLogStreamsRequest = S.suspend(() =>
  S.Struct({ relationalDatabaseName: S.String }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/GetRelationalDatabaseLogStreams",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRelationalDatabaseLogStreamsRequest",
}) as any as S.Schema<GetRelationalDatabaseLogStreamsRequest>;
export interface GetRelationalDatabaseMasterUserPasswordRequest {
  relationalDatabaseName: string;
  passwordVersion?: RelationalDatabasePasswordVersion;
}
export const GetRelationalDatabaseMasterUserPasswordRequest = S.suspend(() =>
  S.Struct({
    relationalDatabaseName: S.String,
    passwordVersion: S.optional(RelationalDatabasePasswordVersion),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/GetRelationalDatabaseMasterUserPassword",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRelationalDatabaseMasterUserPasswordRequest",
}) as any as S.Schema<GetRelationalDatabaseMasterUserPasswordRequest>;
export interface GetRelationalDatabaseMetricDataRequest {
  relationalDatabaseName: string;
  metricName: RelationalDatabaseMetricName;
  period: number;
  startTime: Date;
  endTime: Date;
  unit: MetricUnit;
  statistics: MetricStatistic[];
}
export const GetRelationalDatabaseMetricDataRequest = S.suspend(() =>
  S.Struct({
    relationalDatabaseName: S.String,
    metricName: RelationalDatabaseMetricName,
    period: S.Number,
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    unit: MetricUnit,
    statistics: MetricStatisticList,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/GetRelationalDatabaseMetricData",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRelationalDatabaseMetricDataRequest",
}) as any as S.Schema<GetRelationalDatabaseMetricDataRequest>;
export interface GetRelationalDatabaseParametersRequest {
  relationalDatabaseName: string;
  pageToken?: string;
}
export const GetRelationalDatabaseParametersRequest = S.suspend(() =>
  S.Struct({
    relationalDatabaseName: S.String,
    pageToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/GetRelationalDatabaseParameters",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRelationalDatabaseParametersRequest",
}) as any as S.Schema<GetRelationalDatabaseParametersRequest>;
export interface GetRelationalDatabasesRequest {
  pageToken?: string;
}
export const GetRelationalDatabasesRequest = S.suspend(() =>
  S.Struct({ pageToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/GetRelationalDatabases",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRelationalDatabasesRequest",
}) as any as S.Schema<GetRelationalDatabasesRequest>;
export interface GetRelationalDatabaseSnapshotRequest {
  relationalDatabaseSnapshotName: string;
}
export const GetRelationalDatabaseSnapshotRequest = S.suspend(() =>
  S.Struct({ relationalDatabaseSnapshotName: S.String }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/GetRelationalDatabaseSnapshot",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRelationalDatabaseSnapshotRequest",
}) as any as S.Schema<GetRelationalDatabaseSnapshotRequest>;
export interface GetRelationalDatabaseSnapshotsRequest {
  pageToken?: string;
}
export const GetRelationalDatabaseSnapshotsRequest = S.suspend(() =>
  S.Struct({ pageToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/GetRelationalDatabaseSnapshots",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRelationalDatabaseSnapshotsRequest",
}) as any as S.Schema<GetRelationalDatabaseSnapshotsRequest>;
export interface GetSetupHistoryRequest {
  resourceName: string;
  pageToken?: string;
}
export const GetSetupHistoryRequest = S.suspend(() =>
  S.Struct({ resourceName: S.String, pageToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/get-setup-history" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSetupHistoryRequest",
}) as any as S.Schema<GetSetupHistoryRequest>;
export interface GetStaticIpRequest {
  staticIpName: string;
}
export const GetStaticIpRequest = S.suspend(() =>
  S.Struct({ staticIpName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetStaticIp" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetStaticIpRequest",
}) as any as S.Schema<GetStaticIpRequest>;
export interface GetStaticIpsRequest {
  pageToken?: string;
}
export const GetStaticIpsRequest = S.suspend(() =>
  S.Struct({ pageToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetStaticIps" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetStaticIpsRequest",
}) as any as S.Schema<GetStaticIpsRequest>;
export interface ImportKeyPairRequest {
  keyPairName: string;
  publicKeyBase64: string;
}
export const ImportKeyPairRequest = S.suspend(() =>
  S.Struct({ keyPairName: S.String, publicKeyBase64: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/ImportKeyPair" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ImportKeyPairRequest",
}) as any as S.Schema<ImportKeyPairRequest>;
export interface IsVpcPeeredResult {
  isPeered?: boolean;
}
export const IsVpcPeeredResult = S.suspend(() =>
  S.Struct({ isPeered: S.optional(S.Boolean) }),
).annotations({
  identifier: "IsVpcPeeredResult",
}) as any as S.Schema<IsVpcPeeredResult>;
export interface OpenInstancePublicPortsRequest {
  portInfo: PortInfo;
  instanceName: string;
}
export const OpenInstancePublicPortsRequest = S.suspend(() =>
  S.Struct({ portInfo: PortInfo, instanceName: S.String }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/OpenInstancePublicPorts",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "OpenInstancePublicPortsRequest",
}) as any as S.Schema<OpenInstancePublicPortsRequest>;
export interface PutAlarmRequest {
  alarmName: string;
  metricName: MetricName;
  monitoredResourceName: string;
  comparisonOperator: ComparisonOperator;
  threshold: number;
  evaluationPeriods: number;
  datapointsToAlarm?: number;
  treatMissingData?: TreatMissingData;
  contactProtocols?: ContactProtocol[];
  notificationTriggers?: AlarmState[];
  notificationEnabled?: boolean;
}
export const PutAlarmRequest = S.suspend(() =>
  S.Struct({
    alarmName: S.String,
    metricName: MetricName,
    monitoredResourceName: S.String,
    comparisonOperator: ComparisonOperator,
    threshold: S.Number,
    evaluationPeriods: S.Number,
    datapointsToAlarm: S.optional(S.Number),
    treatMissingData: S.optional(TreatMissingData),
    contactProtocols: S.optional(ContactProtocolsList),
    notificationTriggers: S.optional(NotificationTriggerList),
    notificationEnabled: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/PutAlarm" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutAlarmRequest",
}) as any as S.Schema<PutAlarmRequest>;
export interface PutInstancePublicPortsRequest {
  portInfos: PortInfo[];
  instanceName: string;
}
export const PutInstancePublicPortsRequest = S.suspend(() =>
  S.Struct({ portInfos: PortInfoList, instanceName: S.String }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/PutInstancePublicPorts",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutInstancePublicPortsRequest",
}) as any as S.Schema<PutInstancePublicPortsRequest>;
export interface RebootInstanceRequest {
  instanceName: string;
}
export const RebootInstanceRequest = S.suspend(() =>
  S.Struct({ instanceName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/RebootInstance" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RebootInstanceRequest",
}) as any as S.Schema<RebootInstanceRequest>;
export interface RebootRelationalDatabaseRequest {
  relationalDatabaseName: string;
}
export const RebootRelationalDatabaseRequest = S.suspend(() =>
  S.Struct({ relationalDatabaseName: S.String }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/RebootRelationalDatabase",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RebootRelationalDatabaseRequest",
}) as any as S.Schema<RebootRelationalDatabaseRequest>;
export interface RegisterContainerImageRequest {
  serviceName: string;
  label: string;
  digest: string;
}
export const RegisterContainerImageRequest = S.suspend(() =>
  S.Struct({
    serviceName: S.String.pipe(T.HttpLabel("serviceName")),
    label: S.String,
    digest: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/container-services/{serviceName}/images",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterContainerImageRequest",
}) as any as S.Schema<RegisterContainerImageRequest>;
export interface ReleaseStaticIpRequest {
  staticIpName: string;
}
export const ReleaseStaticIpRequest = S.suspend(() =>
  S.Struct({ staticIpName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/ReleaseStaticIp" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ReleaseStaticIpRequest",
}) as any as S.Schema<ReleaseStaticIpRequest>;
export interface ResetDistributionCacheRequest {
  distributionName?: string;
}
export const ResetDistributionCacheRequest = S.suspend(() =>
  S.Struct({ distributionName: S.optional(S.String) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/ResetDistributionCache",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ResetDistributionCacheRequest",
}) as any as S.Schema<ResetDistributionCacheRequest>;
export interface SendContactMethodVerificationRequest {
  protocol: ContactMethodVerificationProtocol;
}
export const SendContactMethodVerificationRequest = S.suspend(() =>
  S.Struct({ protocol: ContactMethodVerificationProtocol }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/SendContactMethodVerification",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendContactMethodVerificationRequest",
}) as any as S.Schema<SendContactMethodVerificationRequest>;
export interface SetIpAddressTypeRequest {
  resourceType: ResourceType;
  resourceName: string;
  ipAddressType: IpAddressType;
  acceptBundleUpdate?: boolean;
}
export const SetIpAddressTypeRequest = S.suspend(() =>
  S.Struct({
    resourceType: ResourceType,
    resourceName: S.String,
    ipAddressType: IpAddressType,
    acceptBundleUpdate: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/SetIpAddressType" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetIpAddressTypeRequest",
}) as any as S.Schema<SetIpAddressTypeRequest>;
export interface SetResourceAccessForBucketRequest {
  resourceName: string;
  bucketName: string;
  access: ResourceBucketAccess;
}
export const SetResourceAccessForBucketRequest = S.suspend(() =>
  S.Struct({
    resourceName: S.String,
    bucketName: S.String,
    access: ResourceBucketAccess,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/SetResourceAccessForBucket",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetResourceAccessForBucketRequest",
}) as any as S.Schema<SetResourceAccessForBucketRequest>;
export interface SetupInstanceHttpsRequest {
  instanceName: string;
  emailAddress: string | redacted.Redacted<string>;
  domainNames: string[];
  certificateProvider: CertificateProvider;
}
export const SetupInstanceHttpsRequest = S.suspend(() =>
  S.Struct({
    instanceName: S.String,
    emailAddress: SensitiveString,
    domainNames: SetupDomainNameList,
    certificateProvider: CertificateProvider,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/setup-instance-https",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetupInstanceHttpsRequest",
}) as any as S.Schema<SetupInstanceHttpsRequest>;
export interface StartGUISessionRequest {
  resourceName: string;
}
export const StartGUISessionRequest = S.suspend(() =>
  S.Struct({ resourceName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/start-gui-session" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartGUISessionRequest",
}) as any as S.Schema<StartGUISessionRequest>;
export interface StartInstanceRequest {
  instanceName: string;
}
export const StartInstanceRequest = S.suspend(() =>
  S.Struct({ instanceName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/StartInstance" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartInstanceRequest",
}) as any as S.Schema<StartInstanceRequest>;
export interface StartRelationalDatabaseRequest {
  relationalDatabaseName: string;
}
export const StartRelationalDatabaseRequest = S.suspend(() =>
  S.Struct({ relationalDatabaseName: S.String }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/StartRelationalDatabase",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartRelationalDatabaseRequest",
}) as any as S.Schema<StartRelationalDatabaseRequest>;
export interface StopGUISessionRequest {
  resourceName: string;
}
export const StopGUISessionRequest = S.suspend(() =>
  S.Struct({ resourceName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/stop-gui-session" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopGUISessionRequest",
}) as any as S.Schema<StopGUISessionRequest>;
export interface StopInstanceRequest {
  instanceName: string;
  force?: boolean;
}
export const StopInstanceRequest = S.suspend(() =>
  S.Struct({ instanceName: S.String, force: S.optional(S.Boolean) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/StopInstance" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopInstanceRequest",
}) as any as S.Schema<StopInstanceRequest>;
export interface StopRelationalDatabaseRequest {
  relationalDatabaseName: string;
  relationalDatabaseSnapshotName?: string;
}
export const StopRelationalDatabaseRequest = S.suspend(() =>
  S.Struct({
    relationalDatabaseName: S.String,
    relationalDatabaseSnapshotName: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/StopRelationalDatabase",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopRelationalDatabaseRequest",
}) as any as S.Schema<StopRelationalDatabaseRequest>;
export interface TagResourceRequest {
  resourceName: string;
  resourceArn?: string;
  tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceName: S.String,
    resourceArn: S.optional(S.String),
    tags: TagList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/TagResource" }),
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
export interface TestAlarmRequest {
  alarmName: string;
  state: AlarmState;
}
export const TestAlarmRequest = S.suspend(() =>
  S.Struct({
    alarmName: S.String.pipe(T.HttpLabel("alarmName")),
    state: AlarmState.pipe(T.HttpQuery("state")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/ls/api/2016-11-28/TestAlarm/{alarmName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TestAlarmRequest",
}) as any as S.Schema<TestAlarmRequest>;
export interface ResourceLocation {
  availabilityZone?: string;
  regionName?: RegionName;
}
export const ResourceLocation = S.suspend(() =>
  S.Struct({
    availabilityZone: S.optional(S.String),
    regionName: S.optional(RegionName),
  }),
).annotations({
  identifier: "ResourceLocation",
}) as any as S.Schema<ResourceLocation>;
export type OperationType =
  | "DeleteKnownHostKeys"
  | "DeleteInstance"
  | "CreateInstance"
  | "StopInstance"
  | "StartInstance"
  | "RebootInstance"
  | "OpenInstancePublicPorts"
  | "PutInstancePublicPorts"
  | "CloseInstancePublicPorts"
  | "AllocateStaticIp"
  | "ReleaseStaticIp"
  | "AttachStaticIp"
  | "DetachStaticIp"
  | "UpdateDomainEntry"
  | "DeleteDomainEntry"
  | "CreateDomain"
  | "DeleteDomain"
  | "CreateInstanceSnapshot"
  | "DeleteInstanceSnapshot"
  | "CreateInstancesFromSnapshot"
  | "CreateLoadBalancer"
  | "DeleteLoadBalancer"
  | "AttachInstancesToLoadBalancer"
  | "DetachInstancesFromLoadBalancer"
  | "UpdateLoadBalancerAttribute"
  | "CreateLoadBalancerTlsCertificate"
  | "DeleteLoadBalancerTlsCertificate"
  | "AttachLoadBalancerTlsCertificate"
  | "CreateDisk"
  | "DeleteDisk"
  | "AttachDisk"
  | "DetachDisk"
  | "CreateDiskSnapshot"
  | "DeleteDiskSnapshot"
  | "CreateDiskFromSnapshot"
  | "CreateRelationalDatabase"
  | "UpdateRelationalDatabase"
  | "DeleteRelationalDatabase"
  | "CreateRelationalDatabaseFromSnapshot"
  | "CreateRelationalDatabaseSnapshot"
  | "DeleteRelationalDatabaseSnapshot"
  | "UpdateRelationalDatabaseParameters"
  | "StartRelationalDatabase"
  | "RebootRelationalDatabase"
  | "StopRelationalDatabase"
  | "EnableAddOn"
  | "DisableAddOn"
  | "PutAlarm"
  | "GetAlarms"
  | "DeleteAlarm"
  | "TestAlarm"
  | "CreateContactMethod"
  | "GetContactMethods"
  | "SendContactMethodVerification"
  | "DeleteContactMethod"
  | "CreateDistribution"
  | "UpdateDistribution"
  | "DeleteDistribution"
  | "ResetDistributionCache"
  | "AttachCertificateToDistribution"
  | "DetachCertificateFromDistribution"
  | "UpdateDistributionBundle"
  | "SetIpAddressType"
  | "CreateCertificate"
  | "DeleteCertificate"
  | "CreateContainerService"
  | "UpdateContainerService"
  | "DeleteContainerService"
  | "CreateContainerServiceDeployment"
  | "CreateContainerServiceRegistryLogin"
  | "RegisterContainerImage"
  | "DeleteContainerImage"
  | "CreateBucket"
  | "DeleteBucket"
  | "CreateBucketAccessKey"
  | "DeleteBucketAccessKey"
  | "UpdateBucketBundle"
  | "UpdateBucket"
  | "SetResourceAccessForBucket"
  | "UpdateInstanceMetadataOptions"
  | "StartGUISession"
  | "StopGUISession"
  | "SetupInstanceHttps";
export const OperationType = S.Literal(
  "DeleteKnownHostKeys",
  "DeleteInstance",
  "CreateInstance",
  "StopInstance",
  "StartInstance",
  "RebootInstance",
  "OpenInstancePublicPorts",
  "PutInstancePublicPorts",
  "CloseInstancePublicPorts",
  "AllocateStaticIp",
  "ReleaseStaticIp",
  "AttachStaticIp",
  "DetachStaticIp",
  "UpdateDomainEntry",
  "DeleteDomainEntry",
  "CreateDomain",
  "DeleteDomain",
  "CreateInstanceSnapshot",
  "DeleteInstanceSnapshot",
  "CreateInstancesFromSnapshot",
  "CreateLoadBalancer",
  "DeleteLoadBalancer",
  "AttachInstancesToLoadBalancer",
  "DetachInstancesFromLoadBalancer",
  "UpdateLoadBalancerAttribute",
  "CreateLoadBalancerTlsCertificate",
  "DeleteLoadBalancerTlsCertificate",
  "AttachLoadBalancerTlsCertificate",
  "CreateDisk",
  "DeleteDisk",
  "AttachDisk",
  "DetachDisk",
  "CreateDiskSnapshot",
  "DeleteDiskSnapshot",
  "CreateDiskFromSnapshot",
  "CreateRelationalDatabase",
  "UpdateRelationalDatabase",
  "DeleteRelationalDatabase",
  "CreateRelationalDatabaseFromSnapshot",
  "CreateRelationalDatabaseSnapshot",
  "DeleteRelationalDatabaseSnapshot",
  "UpdateRelationalDatabaseParameters",
  "StartRelationalDatabase",
  "RebootRelationalDatabase",
  "StopRelationalDatabase",
  "EnableAddOn",
  "DisableAddOn",
  "PutAlarm",
  "GetAlarms",
  "DeleteAlarm",
  "TestAlarm",
  "CreateContactMethod",
  "GetContactMethods",
  "SendContactMethodVerification",
  "DeleteContactMethod",
  "CreateDistribution",
  "UpdateDistribution",
  "DeleteDistribution",
  "ResetDistributionCache",
  "AttachCertificateToDistribution",
  "DetachCertificateFromDistribution",
  "UpdateDistributionBundle",
  "SetIpAddressType",
  "CreateCertificate",
  "DeleteCertificate",
  "CreateContainerService",
  "UpdateContainerService",
  "DeleteContainerService",
  "CreateContainerServiceDeployment",
  "CreateContainerServiceRegistryLogin",
  "RegisterContainerImage",
  "DeleteContainerImage",
  "CreateBucket",
  "DeleteBucket",
  "CreateBucketAccessKey",
  "DeleteBucketAccessKey",
  "UpdateBucketBundle",
  "UpdateBucket",
  "SetResourceAccessForBucket",
  "UpdateInstanceMetadataOptions",
  "StartGUISession",
  "StopGUISession",
  "SetupInstanceHttps",
);
export type OperationStatus =
  | "NotStarted"
  | "Started"
  | "Failed"
  | "Completed"
  | "Succeeded";
export const OperationStatus = S.Literal(
  "NotStarted",
  "Started",
  "Failed",
  "Completed",
  "Succeeded",
);
export interface Operation {
  id?: string;
  resourceName?: string;
  resourceType?: ResourceType;
  createdAt?: Date;
  location?: ResourceLocation;
  isTerminal?: boolean;
  operationDetails?: string;
  operationType?: OperationType;
  status?: OperationStatus;
  statusChangedAt?: Date;
  errorCode?: string;
  errorDetails?: string;
}
export const Operation = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    resourceName: S.optional(S.String),
    resourceType: S.optional(ResourceType),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    location: S.optional(ResourceLocation),
    isTerminal: S.optional(S.Boolean),
    operationDetails: S.optional(S.String),
    operationType: S.optional(OperationType),
    status: S.optional(OperationStatus),
    statusChangedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    errorCode: S.optional(S.String),
    errorDetails: S.optional(S.String),
  }),
).annotations({ identifier: "Operation" }) as any as S.Schema<Operation>;
export interface UnpeerVpcResult {
  operation?: Operation;
}
export const UnpeerVpcResult = S.suspend(() =>
  S.Struct({ operation: S.optional(Operation) }),
).annotations({
  identifier: "UnpeerVpcResult",
}) as any as S.Schema<UnpeerVpcResult>;
export interface UntagResourceRequest {
  resourceName: string;
  resourceArn?: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceName: S.String,
    resourceArn: S.optional(S.String),
    tagKeys: TagKeyList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/UntagResource" }),
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
export interface UpdateBucketBundleRequest {
  bucketName: string;
  bundleId: string;
}
export const UpdateBucketBundleRequest = S.suspend(() =>
  S.Struct({ bucketName: S.String, bundleId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/UpdateBucketBundle" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBucketBundleRequest",
}) as any as S.Schema<UpdateBucketBundleRequest>;
export type ContainerServicePublicDomainsList = string[];
export const ContainerServicePublicDomainsList = S.Array(S.String);
export type ContainerServicePublicDomains = { [key: string]: string[] };
export const ContainerServicePublicDomains = S.Record({
  key: S.String,
  value: ContainerServicePublicDomainsList,
});
export interface ContainerServiceECRImagePullerRoleRequest {
  isActive?: boolean;
}
export const ContainerServiceECRImagePullerRoleRequest = S.suspend(() =>
  S.Struct({ isActive: S.optional(S.Boolean) }),
).annotations({
  identifier: "ContainerServiceECRImagePullerRoleRequest",
}) as any as S.Schema<ContainerServiceECRImagePullerRoleRequest>;
export interface PrivateRegistryAccessRequest {
  ecrImagePullerRole?: ContainerServiceECRImagePullerRoleRequest;
}
export const PrivateRegistryAccessRequest = S.suspend(() =>
  S.Struct({
    ecrImagePullerRole: S.optional(ContainerServiceECRImagePullerRoleRequest),
  }),
).annotations({
  identifier: "PrivateRegistryAccessRequest",
}) as any as S.Schema<PrivateRegistryAccessRequest>;
export interface UpdateContainerServiceRequest {
  serviceName: string;
  power?: ContainerServicePowerName;
  scale?: number;
  isDisabled?: boolean;
  publicDomainNames?: { [key: string]: string[] };
  privateRegistryAccess?: PrivateRegistryAccessRequest;
}
export const UpdateContainerServiceRequest = S.suspend(() =>
  S.Struct({
    serviceName: S.String.pipe(T.HttpLabel("serviceName")),
    power: S.optional(ContainerServicePowerName),
    scale: S.optional(S.Number),
    isDisabled: S.optional(S.Boolean),
    publicDomainNames: S.optional(ContainerServicePublicDomains),
    privateRegistryAccess: S.optional(PrivateRegistryAccessRequest),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/ls/api/2016-11-28/container-services/{serviceName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateContainerServiceRequest",
}) as any as S.Schema<UpdateContainerServiceRequest>;
export type OriginProtocolPolicyEnum = "http-only" | "https-only";
export const OriginProtocolPolicyEnum = S.Literal("http-only", "https-only");
export interface InputOrigin {
  name?: string;
  regionName?: RegionName;
  protocolPolicy?: OriginProtocolPolicyEnum;
  responseTimeout?: number;
}
export const InputOrigin = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    regionName: S.optional(RegionName),
    protocolPolicy: S.optional(OriginProtocolPolicyEnum),
    responseTimeout: S.optional(S.Number),
  }),
).annotations({ identifier: "InputOrigin" }) as any as S.Schema<InputOrigin>;
export type BehaviorEnum = "dont-cache" | "cache";
export const BehaviorEnum = S.Literal("dont-cache", "cache");
export interface CacheBehavior {
  behavior?: BehaviorEnum;
}
export const CacheBehavior = S.suspend(() =>
  S.Struct({ behavior: S.optional(BehaviorEnum) }),
).annotations({
  identifier: "CacheBehavior",
}) as any as S.Schema<CacheBehavior>;
export type ForwardValues = "none" | "allow-list" | "all";
export const ForwardValues = S.Literal("none", "allow-list", "all");
export interface CookieObject {
  option?: ForwardValues;
  cookiesAllowList?: string[];
}
export const CookieObject = S.suspend(() =>
  S.Struct({
    option: S.optional(ForwardValues),
    cookiesAllowList: S.optional(StringList),
  }),
).annotations({ identifier: "CookieObject" }) as any as S.Schema<CookieObject>;
export type HeaderEnum =
  | "Accept"
  | "Accept-Charset"
  | "Accept-Datetime"
  | "Accept-Encoding"
  | "Accept-Language"
  | "Authorization"
  | "CloudFront-Forwarded-Proto"
  | "CloudFront-Is-Desktop-Viewer"
  | "CloudFront-Is-Mobile-Viewer"
  | "CloudFront-Is-SmartTV-Viewer"
  | "CloudFront-Is-Tablet-Viewer"
  | "CloudFront-Viewer-Country"
  | "Host"
  | "Origin"
  | "Referer";
export const HeaderEnum = S.Literal(
  "Accept",
  "Accept-Charset",
  "Accept-Datetime",
  "Accept-Encoding",
  "Accept-Language",
  "Authorization",
  "CloudFront-Forwarded-Proto",
  "CloudFront-Is-Desktop-Viewer",
  "CloudFront-Is-Mobile-Viewer",
  "CloudFront-Is-SmartTV-Viewer",
  "CloudFront-Is-Tablet-Viewer",
  "CloudFront-Viewer-Country",
  "Host",
  "Origin",
  "Referer",
);
export type HeaderForwardList = HeaderEnum[];
export const HeaderForwardList = S.Array(HeaderEnum);
export interface HeaderObject {
  option?: ForwardValues;
  headersAllowList?: HeaderEnum[];
}
export const HeaderObject = S.suspend(() =>
  S.Struct({
    option: S.optional(ForwardValues),
    headersAllowList: S.optional(HeaderForwardList),
  }),
).annotations({ identifier: "HeaderObject" }) as any as S.Schema<HeaderObject>;
export interface QueryStringObject {
  option?: boolean;
  queryStringsAllowList?: string[];
}
export const QueryStringObject = S.suspend(() =>
  S.Struct({
    option: S.optional(S.Boolean),
    queryStringsAllowList: S.optional(StringList),
  }),
).annotations({
  identifier: "QueryStringObject",
}) as any as S.Schema<QueryStringObject>;
export interface CacheSettings {
  defaultTTL?: number;
  minimumTTL?: number;
  maximumTTL?: number;
  allowedHTTPMethods?: string;
  cachedHTTPMethods?: string;
  forwardedCookies?: CookieObject;
  forwardedHeaders?: HeaderObject;
  forwardedQueryStrings?: QueryStringObject;
}
export const CacheSettings = S.suspend(() =>
  S.Struct({
    defaultTTL: S.optional(S.Number),
    minimumTTL: S.optional(S.Number),
    maximumTTL: S.optional(S.Number),
    allowedHTTPMethods: S.optional(S.String),
    cachedHTTPMethods: S.optional(S.String),
    forwardedCookies: S.optional(CookieObject),
    forwardedHeaders: S.optional(HeaderObject),
    forwardedQueryStrings: S.optional(QueryStringObject),
  }),
).annotations({
  identifier: "CacheSettings",
}) as any as S.Schema<CacheSettings>;
export interface CacheBehaviorPerPath {
  path?: string;
  behavior?: BehaviorEnum;
}
export const CacheBehaviorPerPath = S.suspend(() =>
  S.Struct({ path: S.optional(S.String), behavior: S.optional(BehaviorEnum) }),
).annotations({
  identifier: "CacheBehaviorPerPath",
}) as any as S.Schema<CacheBehaviorPerPath>;
export type CacheBehaviorList = CacheBehaviorPerPath[];
export const CacheBehaviorList = S.Array(CacheBehaviorPerPath);
export interface UpdateDistributionRequest {
  distributionName: string;
  origin?: InputOrigin;
  defaultCacheBehavior?: CacheBehavior;
  cacheBehaviorSettings?: CacheSettings;
  cacheBehaviors?: CacheBehaviorPerPath[];
  isEnabled?: boolean;
  viewerMinimumTlsProtocolVersion?: ViewerMinimumTlsProtocolVersionEnum;
  certificateName?: string;
  useDefaultCertificate?: boolean;
}
export const UpdateDistributionRequest = S.suspend(() =>
  S.Struct({
    distributionName: S.String,
    origin: S.optional(InputOrigin),
    defaultCacheBehavior: S.optional(CacheBehavior),
    cacheBehaviorSettings: S.optional(CacheSettings),
    cacheBehaviors: S.optional(CacheBehaviorList),
    isEnabled: S.optional(S.Boolean),
    viewerMinimumTlsProtocolVersion: S.optional(
      ViewerMinimumTlsProtocolVersionEnum,
    ),
    certificateName: S.optional(S.String),
    useDefaultCertificate: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/UpdateDistribution" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDistributionRequest",
}) as any as S.Schema<UpdateDistributionRequest>;
export interface UpdateDistributionBundleRequest {
  distributionName?: string;
  bundleId?: string;
}
export const UpdateDistributionBundleRequest = S.suspend(() =>
  S.Struct({
    distributionName: S.optional(S.String),
    bundleId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/UpdateDistributionBundle",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDistributionBundleRequest",
}) as any as S.Schema<UpdateDistributionBundleRequest>;
export interface UpdateDomainEntryRequest {
  domainName: string;
  domainEntry: DomainEntry;
}
export const UpdateDomainEntryRequest = S.suspend(() =>
  S.Struct({ domainName: S.String, domainEntry: DomainEntry }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/UpdateDomainEntry" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDomainEntryRequest",
}) as any as S.Schema<UpdateDomainEntryRequest>;
export interface UpdateInstanceMetadataOptionsRequest {
  instanceName: string;
  httpTokens?: HttpTokens;
  httpEndpoint?: HttpEndpoint;
  httpPutResponseHopLimit?: number;
  httpProtocolIpv6?: HttpProtocolIpv6;
}
export const UpdateInstanceMetadataOptionsRequest = S.suspend(() =>
  S.Struct({
    instanceName: S.String,
    httpTokens: S.optional(HttpTokens),
    httpEndpoint: S.optional(HttpEndpoint),
    httpPutResponseHopLimit: S.optional(S.Number),
    httpProtocolIpv6: S.optional(HttpProtocolIpv6),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/UpdateInstanceMetadataOptions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateInstanceMetadataOptionsRequest",
}) as any as S.Schema<UpdateInstanceMetadataOptionsRequest>;
export interface UpdateLoadBalancerAttributeRequest {
  loadBalancerName: string;
  attributeName: LoadBalancerAttributeName;
  attributeValue: string;
}
export const UpdateLoadBalancerAttributeRequest = S.suspend(() =>
  S.Struct({
    loadBalancerName: S.String,
    attributeName: LoadBalancerAttributeName,
    attributeValue: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/UpdateLoadBalancerAttribute",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateLoadBalancerAttributeRequest",
}) as any as S.Schema<UpdateLoadBalancerAttributeRequest>;
export interface UpdateRelationalDatabaseRequest {
  relationalDatabaseName: string;
  masterUserPassword?: string | redacted.Redacted<string>;
  rotateMasterUserPassword?: boolean;
  preferredBackupWindow?: string;
  preferredMaintenanceWindow?: string;
  enableBackupRetention?: boolean;
  disableBackupRetention?: boolean;
  publiclyAccessible?: boolean;
  applyImmediately?: boolean;
  caCertificateIdentifier?: string;
  relationalDatabaseBlueprintId?: string;
}
export const UpdateRelationalDatabaseRequest = S.suspend(() =>
  S.Struct({
    relationalDatabaseName: S.String,
    masterUserPassword: S.optional(SensitiveString),
    rotateMasterUserPassword: S.optional(S.Boolean),
    preferredBackupWindow: S.optional(S.String),
    preferredMaintenanceWindow: S.optional(S.String),
    enableBackupRetention: S.optional(S.Boolean),
    disableBackupRetention: S.optional(S.Boolean),
    publiclyAccessible: S.optional(S.Boolean),
    applyImmediately: S.optional(S.Boolean),
    caCertificateIdentifier: S.optional(S.String),
    relationalDatabaseBlueprintId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/UpdateRelationalDatabase",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRelationalDatabaseRequest",
}) as any as S.Schema<UpdateRelationalDatabaseRequest>;
export type PortInfoSourceType = "DEFAULT" | "INSTANCE" | "NONE" | "CLOSED";
export const PortInfoSourceType = S.Literal(
  "DEFAULT",
  "INSTANCE",
  "NONE",
  "CLOSED",
);
export type AccessType = "public" | "private";
export const AccessType = S.Literal("public", "private");
export type OperationList = Operation[];
export const OperationList = S.Array(Operation);
export interface InstanceEntry {
  sourceName: string;
  instanceType: string;
  portInfoSource: PortInfoSourceType;
  userData?: string;
  availabilityZone: string;
}
export const InstanceEntry = S.suspend(() =>
  S.Struct({
    sourceName: S.String,
    instanceType: S.String,
    portInfoSource: PortInfoSourceType,
    userData: S.optional(S.String),
    availabilityZone: S.String,
  }),
).annotations({
  identifier: "InstanceEntry",
}) as any as S.Schema<InstanceEntry>;
export type InstanceEntryList = InstanceEntry[];
export const InstanceEntryList = S.Array(InstanceEntry);
export type Environment = { [key: string]: string };
export const Environment = S.Record({ key: S.String, value: S.String });
export type ContainerServiceProtocol = "HTTP" | "HTTPS" | "TCP" | "UDP";
export const ContainerServiceProtocol = S.Literal(
  "HTTP",
  "HTTPS",
  "TCP",
  "UDP",
);
export type PortMap = { [key: string]: ContainerServiceProtocol };
export const PortMap = S.Record({
  key: S.String,
  value: ContainerServiceProtocol,
});
export interface Container {
  image?: string;
  command?: string[];
  environment?: { [key: string]: string };
  ports?: { [key: string]: ContainerServiceProtocol };
}
export const Container = S.suspend(() =>
  S.Struct({
    image: S.optional(S.String),
    command: S.optional(StringList),
    environment: S.optional(Environment),
    ports: S.optional(PortMap),
  }),
).annotations({ identifier: "Container" }) as any as S.Schema<Container>;
export type ContainerMap = { [key: string]: Container };
export const ContainerMap = S.Record({ key: S.String, value: Container });
export interface ContainerServiceHealthCheckConfig {
  healthyThreshold?: number;
  unhealthyThreshold?: number;
  timeoutSeconds?: number;
  intervalSeconds?: number;
  path?: string;
  successCodes?: string;
}
export const ContainerServiceHealthCheckConfig = S.suspend(() =>
  S.Struct({
    healthyThreshold: S.optional(S.Number),
    unhealthyThreshold: S.optional(S.Number),
    timeoutSeconds: S.optional(S.Number),
    intervalSeconds: S.optional(S.Number),
    path: S.optional(S.String),
    successCodes: S.optional(S.String),
  }),
).annotations({
  identifier: "ContainerServiceHealthCheckConfig",
}) as any as S.Schema<ContainerServiceHealthCheckConfig>;
export interface EndpointRequest {
  containerName: string;
  containerPort: number;
  healthCheck?: ContainerServiceHealthCheckConfig;
}
export const EndpointRequest = S.suspend(() =>
  S.Struct({
    containerName: S.String,
    containerPort: S.Number,
    healthCheck: S.optional(ContainerServiceHealthCheckConfig),
  }),
).annotations({
  identifier: "EndpointRequest",
}) as any as S.Schema<EndpointRequest>;
export interface ContainerServiceDeploymentRequest {
  containers?: { [key: string]: Container };
  publicEndpoint?: EndpointRequest;
}
export const ContainerServiceDeploymentRequest = S.suspend(() =>
  S.Struct({
    containers: S.optional(ContainerMap),
    publicEndpoint: S.optional(EndpointRequest),
  }),
).annotations({
  identifier: "ContainerServiceDeploymentRequest",
}) as any as S.Schema<ContainerServiceDeploymentRequest>;
export interface ContainerServiceRegistryLogin {
  username?: string;
  password?: string;
  expiresAt?: Date;
  registry?: string;
}
export const ContainerServiceRegistryLogin = S.suspend(() =>
  S.Struct({
    username: S.optional(S.String),
    password: S.optional(S.String),
    expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    registry: S.optional(S.String),
  }),
).annotations({
  identifier: "ContainerServiceRegistryLogin",
}) as any as S.Schema<ContainerServiceRegistryLogin>;
export type Status =
  | "startExpired"
  | "notStarted"
  | "started"
  | "starting"
  | "stopped"
  | "stopping"
  | "settingUpInstance"
  | "failedInstanceCreation"
  | "failedStartingGUISession"
  | "failedStoppingGUISession";
export const Status = S.Literal(
  "startExpired",
  "notStarted",
  "started",
  "starting",
  "stopped",
  "stopping",
  "settingUpInstance",
  "failedInstanceCreation",
  "failedStartingGUISession",
  "failedStoppingGUISession",
);
export type StatusType = "Active" | "Inactive";
export const StatusType = S.Literal("Active", "Inactive");
export interface AccessKeyLastUsed {
  lastUsedDate?: Date;
  region?: string;
  serviceName?: string;
}
export const AccessKeyLastUsed = S.suspend(() =>
  S.Struct({
    lastUsedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    region: S.optional(S.String),
    serviceName: S.optional(S.String),
  }),
).annotations({
  identifier: "AccessKeyLastUsed",
}) as any as S.Schema<AccessKeyLastUsed>;
export interface AccessKey {
  accessKeyId?: string | redacted.Redacted<string>;
  secretAccessKey?: string;
  status?: StatusType;
  createdAt?: Date;
  lastUsed?: AccessKeyLastUsed;
}
export const AccessKey = S.suspend(() =>
  S.Struct({
    accessKeyId: S.optional(SensitiveString),
    secretAccessKey: S.optional(S.String),
    status: S.optional(StatusType),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUsed: S.optional(AccessKeyLastUsed),
  }),
).annotations({ identifier: "AccessKey" }) as any as S.Schema<AccessKey>;
export type AccessKeyList = AccessKey[];
export const AccessKeyList = S.Array(AccessKey);
export interface ResourceRecord {
  name?: string;
  type?: string;
  value?: string;
}
export const ResourceRecord = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    type: S.optional(S.String),
    value: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourceRecord",
}) as any as S.Schema<ResourceRecord>;
export type DnsRecordCreationStateCode = "SUCCEEDED" | "STARTED" | "FAILED";
export const DnsRecordCreationStateCode = S.Literal(
  "SUCCEEDED",
  "STARTED",
  "FAILED",
);
export interface DnsRecordCreationState {
  code?: DnsRecordCreationStateCode;
  message?: string;
}
export const DnsRecordCreationState = S.suspend(() =>
  S.Struct({
    code: S.optional(DnsRecordCreationStateCode),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "DnsRecordCreationState",
}) as any as S.Schema<DnsRecordCreationState>;
export type CertificateDomainValidationStatus =
  | "PENDING_VALIDATION"
  | "FAILED"
  | "SUCCESS";
export const CertificateDomainValidationStatus = S.Literal(
  "PENDING_VALIDATION",
  "FAILED",
  "SUCCESS",
);
export interface DomainValidationRecord {
  domainName?: string;
  resourceRecord?: ResourceRecord;
  dnsRecordCreationState?: DnsRecordCreationState;
  validationStatus?: CertificateDomainValidationStatus;
}
export const DomainValidationRecord = S.suspend(() =>
  S.Struct({
    domainName: S.optional(S.String),
    resourceRecord: S.optional(ResourceRecord),
    dnsRecordCreationState: S.optional(DnsRecordCreationState),
    validationStatus: S.optional(CertificateDomainValidationStatus),
  }),
).annotations({
  identifier: "DomainValidationRecord",
}) as any as S.Schema<DomainValidationRecord>;
export type DomainValidationRecordList = DomainValidationRecord[];
export const DomainValidationRecordList = S.Array(DomainValidationRecord);
export type RenewalStatus =
  | "PendingAutoRenewal"
  | "PendingValidation"
  | "Success"
  | "Failed";
export const RenewalStatus = S.Literal(
  "PendingAutoRenewal",
  "PendingValidation",
  "Success",
  "Failed",
);
export interface RenewalSummary {
  domainValidationRecords?: DomainValidationRecord[];
  renewalStatus?: RenewalStatus;
  renewalStatusReason?: string;
  updatedAt?: Date;
}
export const RenewalSummary = S.suspend(() =>
  S.Struct({
    domainValidationRecords: S.optional(DomainValidationRecordList),
    renewalStatus: S.optional(RenewalStatus),
    renewalStatusReason: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "RenewalSummary",
}) as any as S.Schema<RenewalSummary>;
export interface Certificate {
  arn?: string;
  name?: string;
  domainName?: string;
  status?: CertificateStatus;
  serialNumber?: string;
  subjectAlternativeNames?: string[];
  domainValidationRecords?: DomainValidationRecord[];
  requestFailureReason?: string;
  inUseResourceCount?: number;
  keyAlgorithm?: string;
  createdAt?: Date;
  issuedAt?: Date;
  issuerCA?: string;
  notBefore?: Date;
  notAfter?: Date;
  eligibleToRenew?: string;
  renewalSummary?: RenewalSummary;
  revokedAt?: Date;
  revocationReason?: string;
  tags?: Tag[];
  supportCode?: string;
}
export const Certificate = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(S.String),
    domainName: S.optional(S.String),
    status: S.optional(CertificateStatus),
    serialNumber: S.optional(S.String),
    subjectAlternativeNames: S.optional(SubjectAlternativeNameList),
    domainValidationRecords: S.optional(DomainValidationRecordList),
    requestFailureReason: S.optional(S.String),
    inUseResourceCount: S.optional(S.Number),
    keyAlgorithm: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    issuedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    issuerCA: S.optional(S.String),
    notBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    notAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    eligibleToRenew: S.optional(S.String),
    renewalSummary: S.optional(RenewalSummary),
    revokedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    revocationReason: S.optional(S.String),
    tags: S.optional(TagList),
    supportCode: S.optional(S.String),
  }),
).annotations({ identifier: "Certificate" }) as any as S.Schema<Certificate>;
export interface CertificateSummary {
  certificateArn?: string;
  certificateName?: string;
  domainName?: string;
  certificateDetail?: Certificate;
  tags?: Tag[];
}
export const CertificateSummary = S.suspend(() =>
  S.Struct({
    certificateArn: S.optional(S.String),
    certificateName: S.optional(S.String),
    domainName: S.optional(S.String),
    certificateDetail: S.optional(Certificate),
    tags: S.optional(TagList),
  }),
).annotations({
  identifier: "CertificateSummary",
}) as any as S.Schema<CertificateSummary>;
export type CertificateSummaryList = CertificateSummary[];
export const CertificateSummaryList = S.Array(CertificateSummary);
export type ContainerServiceMetadataEntry = { [key: string]: string };
export const ContainerServiceMetadataEntry = S.Record({
  key: S.String,
  value: S.String,
});
export type ContainerServiceMetadataEntryList = { [key: string]: string }[];
export const ContainerServiceMetadataEntryList = S.Array(
  ContainerServiceMetadataEntry,
);
export interface ContainerServicePower {
  powerId?: string;
  price?: number;
  cpuCount?: number;
  ramSizeInGb?: number;
  name?: string;
  isActive?: boolean;
}
export const ContainerServicePower = S.suspend(() =>
  S.Struct({
    powerId: S.optional(S.String),
    price: S.optional(S.Number),
    cpuCount: S.optional(S.Number),
    ramSizeInGb: S.optional(S.Number),
    name: S.optional(S.String),
    isActive: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ContainerServicePower",
}) as any as S.Schema<ContainerServicePower>;
export type ContainerServicePowerList = ContainerServicePower[];
export const ContainerServicePowerList = S.Array(ContainerServicePower);
export interface AddOn {
  name?: string;
  status?: string;
  snapshotTimeOfDay?: string;
  nextSnapshotTimeOfDay?: string;
  threshold?: string;
  duration?: string;
}
export const AddOn = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    status: S.optional(S.String),
    snapshotTimeOfDay: S.optional(S.String),
    nextSnapshotTimeOfDay: S.optional(S.String),
    threshold: S.optional(S.String),
    duration: S.optional(S.String),
  }),
).annotations({ identifier: "AddOn" }) as any as S.Schema<AddOn>;
export type AddOnList = AddOn[];
export const AddOnList = S.Array(AddOn);
export type DiskState =
  | "pending"
  | "error"
  | "available"
  | "in-use"
  | "unknown";
export const DiskState = S.Literal(
  "pending",
  "error",
  "available",
  "in-use",
  "unknown",
);
export type AutoMountStatus = "Failed" | "Pending" | "Mounted" | "NotMounted";
export const AutoMountStatus = S.Literal(
  "Failed",
  "Pending",
  "Mounted",
  "NotMounted",
);
export interface Disk {
  name?: string;
  arn?: string;
  supportCode?: string;
  createdAt?: Date;
  location?: ResourceLocation;
  resourceType?: ResourceType;
  tags?: Tag[];
  addOns?: AddOn[];
  sizeInGb?: number;
  isSystemDisk?: boolean;
  iops?: number;
  path?: string;
  state?: DiskState;
  attachedTo?: string;
  isAttached?: boolean;
  attachmentState?: string;
  gbInUse?: number;
  autoMountStatus?: AutoMountStatus;
}
export const Disk = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    supportCode: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    location: S.optional(ResourceLocation),
    resourceType: S.optional(ResourceType),
    tags: S.optional(TagList),
    addOns: S.optional(AddOnList),
    sizeInGb: S.optional(S.Number),
    isSystemDisk: S.optional(S.Boolean),
    iops: S.optional(S.Number),
    path: S.optional(S.String),
    state: S.optional(DiskState),
    attachedTo: S.optional(S.String),
    isAttached: S.optional(S.Boolean),
    attachmentState: S.optional(S.String),
    gbInUse: S.optional(S.Number),
    autoMountStatus: S.optional(AutoMountStatus),
  }),
).annotations({ identifier: "Disk" }) as any as S.Schema<Disk>;
export type DiskList = Disk[];
export const DiskList = S.Array(Disk);
export type DiskSnapshotState = "pending" | "completed" | "error" | "unknown";
export const DiskSnapshotState = S.Literal(
  "pending",
  "completed",
  "error",
  "unknown",
);
export interface DiskSnapshot {
  name?: string;
  arn?: string;
  supportCode?: string;
  createdAt?: Date;
  location?: ResourceLocation;
  resourceType?: ResourceType;
  tags?: Tag[];
  sizeInGb?: number;
  state?: DiskSnapshotState;
  progress?: string;
  fromDiskName?: string;
  fromDiskArn?: string;
  fromInstanceName?: string;
  fromInstanceArn?: string;
  isFromAutoSnapshot?: boolean;
}
export const DiskSnapshot = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    supportCode: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    location: S.optional(ResourceLocation),
    resourceType: S.optional(ResourceType),
    tags: S.optional(TagList),
    sizeInGb: S.optional(S.Number),
    state: S.optional(DiskSnapshotState),
    progress: S.optional(S.String),
    fromDiskName: S.optional(S.String),
    fromDiskArn: S.optional(S.String),
    fromInstanceName: S.optional(S.String),
    fromInstanceArn: S.optional(S.String),
    isFromAutoSnapshot: S.optional(S.Boolean),
  }),
).annotations({ identifier: "DiskSnapshot" }) as any as S.Schema<DiskSnapshot>;
export type DiskSnapshotList = DiskSnapshot[];
export const DiskSnapshotList = S.Array(DiskSnapshot);
export interface DistributionBundle {
  bundleId?: string;
  name?: string;
  price?: number;
  transferPerMonthInGb?: number;
  isActive?: boolean;
}
export const DistributionBundle = S.suspend(() =>
  S.Struct({
    bundleId: S.optional(S.String),
    name: S.optional(S.String),
    price: S.optional(S.Number),
    transferPerMonthInGb: S.optional(S.Number),
    isActive: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DistributionBundle",
}) as any as S.Schema<DistributionBundle>;
export type DistributionBundleList = DistributionBundle[];
export const DistributionBundleList = S.Array(DistributionBundle);
export type DomainEntryList = DomainEntry[];
export const DomainEntryList = S.Array(DomainEntry);
export type NameServersUpdateStateCode =
  | "SUCCEEDED"
  | "PENDING"
  | "FAILED"
  | "STARTED";
export const NameServersUpdateStateCode = S.Literal(
  "SUCCEEDED",
  "PENDING",
  "FAILED",
  "STARTED",
);
export interface NameServersUpdateState {
  code?: NameServersUpdateStateCode;
  message?: string;
}
export const NameServersUpdateState = S.suspend(() =>
  S.Struct({
    code: S.optional(NameServersUpdateStateCode),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "NameServersUpdateState",
}) as any as S.Schema<NameServersUpdateState>;
export type R53HostedZoneDeletionStateCode =
  | "SUCCEEDED"
  | "PENDING"
  | "FAILED"
  | "STARTED";
export const R53HostedZoneDeletionStateCode = S.Literal(
  "SUCCEEDED",
  "PENDING",
  "FAILED",
  "STARTED",
);
export interface R53HostedZoneDeletionState {
  code?: R53HostedZoneDeletionStateCode;
  message?: string;
}
export const R53HostedZoneDeletionState = S.suspend(() =>
  S.Struct({
    code: S.optional(R53HostedZoneDeletionStateCode),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "R53HostedZoneDeletionState",
}) as any as S.Schema<R53HostedZoneDeletionState>;
export interface RegisteredDomainDelegationInfo {
  nameServersUpdateState?: NameServersUpdateState;
  r53HostedZoneDeletionState?: R53HostedZoneDeletionState;
}
export const RegisteredDomainDelegationInfo = S.suspend(() =>
  S.Struct({
    nameServersUpdateState: S.optional(NameServersUpdateState),
    r53HostedZoneDeletionState: S.optional(R53HostedZoneDeletionState),
  }),
).annotations({
  identifier: "RegisteredDomainDelegationInfo",
}) as any as S.Schema<RegisteredDomainDelegationInfo>;
export interface Domain {
  name?: string;
  arn?: string;
  supportCode?: string;
  createdAt?: Date;
  location?: ResourceLocation;
  resourceType?: ResourceType;
  tags?: Tag[];
  domainEntries?: DomainEntry[];
  registeredDomainDelegationInfo?: RegisteredDomainDelegationInfo;
}
export const Domain = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    supportCode: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    location: S.optional(ResourceLocation),
    resourceType: S.optional(ResourceType),
    tags: S.optional(TagList),
    domainEntries: S.optional(DomainEntryList),
    registeredDomainDelegationInfo: S.optional(RegisteredDomainDelegationInfo),
  }),
).annotations({ identifier: "Domain" }) as any as S.Schema<Domain>;
export type DomainList = Domain[];
export const DomainList = S.Array(Domain);
export type Ipv6AddressList = string[];
export const Ipv6AddressList = S.Array(S.String);
export interface InstanceHardware {
  cpuCount?: number;
  disks?: Disk[];
  ramSizeInGb?: number;
}
export const InstanceHardware = S.suspend(() =>
  S.Struct({
    cpuCount: S.optional(S.Number),
    disks: S.optional(DiskList),
    ramSizeInGb: S.optional(S.Number),
  }),
).annotations({
  identifier: "InstanceHardware",
}) as any as S.Schema<InstanceHardware>;
export interface MonthlyTransfer {
  gbPerMonthAllocated?: number;
}
export const MonthlyTransfer = S.suspend(() =>
  S.Struct({ gbPerMonthAllocated: S.optional(S.Number) }),
).annotations({
  identifier: "MonthlyTransfer",
}) as any as S.Schema<MonthlyTransfer>;
export type PortAccessType = "Public" | "Private";
export const PortAccessType = S.Literal("Public", "Private");
export type AccessDirection = "inbound" | "outbound";
export const AccessDirection = S.Literal("inbound", "outbound");
export interface InstancePortInfo {
  fromPort?: number;
  toPort?: number;
  protocol?: NetworkProtocol;
  accessFrom?: string;
  accessType?: PortAccessType;
  commonName?: string;
  accessDirection?: AccessDirection;
  cidrs?: string[];
  ipv6Cidrs?: string[];
  cidrListAliases?: string[];
}
export const InstancePortInfo = S.suspend(() =>
  S.Struct({
    fromPort: S.optional(S.Number),
    toPort: S.optional(S.Number),
    protocol: S.optional(NetworkProtocol),
    accessFrom: S.optional(S.String),
    accessType: S.optional(PortAccessType),
    commonName: S.optional(S.String),
    accessDirection: S.optional(AccessDirection),
    cidrs: S.optional(StringList),
    ipv6Cidrs: S.optional(StringList),
    cidrListAliases: S.optional(StringList),
  }),
).annotations({
  identifier: "InstancePortInfo",
}) as any as S.Schema<InstancePortInfo>;
export type InstancePortInfoList = InstancePortInfo[];
export const InstancePortInfoList = S.Array(InstancePortInfo);
export interface InstanceNetworking {
  monthlyTransfer?: MonthlyTransfer;
  ports?: InstancePortInfo[];
}
export const InstanceNetworking = S.suspend(() =>
  S.Struct({
    monthlyTransfer: S.optional(MonthlyTransfer),
    ports: S.optional(InstancePortInfoList),
  }),
).annotations({
  identifier: "InstanceNetworking",
}) as any as S.Schema<InstanceNetworking>;
export interface InstanceState {
  code?: number;
  name?: string;
}
export const InstanceState = S.suspend(() =>
  S.Struct({ code: S.optional(S.Number), name: S.optional(S.String) }),
).annotations({
  identifier: "InstanceState",
}) as any as S.Schema<InstanceState>;
export type InstanceMetadataState = "pending" | "applied";
export const InstanceMetadataState = S.Literal("pending", "applied");
export interface InstanceMetadataOptions {
  state?: InstanceMetadataState;
  httpTokens?: HttpTokens;
  httpEndpoint?: HttpEndpoint;
  httpPutResponseHopLimit?: number;
  httpProtocolIpv6?: HttpProtocolIpv6;
}
export const InstanceMetadataOptions = S.suspend(() =>
  S.Struct({
    state: S.optional(InstanceMetadataState),
    httpTokens: S.optional(HttpTokens),
    httpEndpoint: S.optional(HttpEndpoint),
    httpPutResponseHopLimit: S.optional(S.Number),
    httpProtocolIpv6: S.optional(HttpProtocolIpv6),
  }),
).annotations({
  identifier: "InstanceMetadataOptions",
}) as any as S.Schema<InstanceMetadataOptions>;
export interface Instance {
  name?: string;
  arn?: string;
  supportCode?: string;
  createdAt?: Date;
  location?: ResourceLocation;
  resourceType?: ResourceType;
  tags?: Tag[];
  blueprintId?: string;
  blueprintName?: string;
  bundleId?: string;
  addOns?: AddOn[];
  isStaticIp?: boolean;
  privateIpAddress?: string;
  publicIpAddress?: string;
  ipv6Addresses?: string[];
  ipAddressType?: IpAddressType;
  hardware?: InstanceHardware;
  networking?: InstanceNetworking;
  state?: InstanceState;
  username?: string;
  sshKeyName?: string;
  metadataOptions?: InstanceMetadataOptions;
}
export const Instance = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    supportCode: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    location: S.optional(ResourceLocation),
    resourceType: S.optional(ResourceType),
    tags: S.optional(TagList),
    blueprintId: S.optional(S.String),
    blueprintName: S.optional(S.String),
    bundleId: S.optional(S.String),
    addOns: S.optional(AddOnList),
    isStaticIp: S.optional(S.Boolean),
    privateIpAddress: S.optional(S.String),
    publicIpAddress: S.optional(S.String),
    ipv6Addresses: S.optional(Ipv6AddressList),
    ipAddressType: S.optional(IpAddressType),
    hardware: S.optional(InstanceHardware),
    networking: S.optional(InstanceNetworking),
    state: S.optional(InstanceState),
    username: S.optional(S.String),
    sshKeyName: S.optional(S.String),
    metadataOptions: S.optional(InstanceMetadataOptions),
  }),
).annotations({ identifier: "Instance" }) as any as S.Schema<Instance>;
export type InstanceList = Instance[];
export const InstanceList = S.Array(Instance);
export type InstanceSnapshotState = "pending" | "error" | "available";
export const InstanceSnapshotState = S.Literal("pending", "error", "available");
export interface InstanceSnapshot {
  name?: string;
  arn?: string;
  supportCode?: string;
  createdAt?: Date;
  location?: ResourceLocation;
  resourceType?: ResourceType;
  tags?: Tag[];
  state?: InstanceSnapshotState;
  progress?: string;
  fromAttachedDisks?: Disk[];
  fromInstanceName?: string;
  fromInstanceArn?: string;
  fromBlueprintId?: string;
  fromBundleId?: string;
  isFromAutoSnapshot?: boolean;
  sizeInGb?: number;
}
export const InstanceSnapshot = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    supportCode: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    location: S.optional(ResourceLocation),
    resourceType: S.optional(ResourceType),
    tags: S.optional(TagList),
    state: S.optional(InstanceSnapshotState),
    progress: S.optional(S.String),
    fromAttachedDisks: S.optional(DiskList),
    fromInstanceName: S.optional(S.String),
    fromInstanceArn: S.optional(S.String),
    fromBlueprintId: S.optional(S.String),
    fromBundleId: S.optional(S.String),
    isFromAutoSnapshot: S.optional(S.Boolean),
    sizeInGb: S.optional(S.Number),
  }),
).annotations({
  identifier: "InstanceSnapshot",
}) as any as S.Schema<InstanceSnapshot>;
export type InstanceSnapshotList = InstanceSnapshot[];
export const InstanceSnapshotList = S.Array(InstanceSnapshot);
export interface KeyPair {
  name?: string;
  arn?: string;
  supportCode?: string;
  createdAt?: Date;
  location?: ResourceLocation;
  resourceType?: ResourceType;
  tags?: Tag[];
  fingerprint?: string;
}
export const KeyPair = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    supportCode: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    location: S.optional(ResourceLocation),
    resourceType: S.optional(ResourceType),
    tags: S.optional(TagList),
    fingerprint: S.optional(S.String),
  }),
).annotations({ identifier: "KeyPair" }) as any as S.Schema<KeyPair>;
export type KeyPairList = KeyPair[];
export const KeyPairList = S.Array(KeyPair);
export type LoadBalancerState =
  | "active"
  | "provisioning"
  | "active_impaired"
  | "failed"
  | "unknown";
export const LoadBalancerState = S.Literal(
  "active",
  "provisioning",
  "active_impaired",
  "failed",
  "unknown",
);
export type LoadBalancerProtocol = "HTTP_HTTPS" | "HTTP";
export const LoadBalancerProtocol = S.Literal("HTTP_HTTPS", "HTTP");
export type PortList = number[];
export const PortList = S.Array(S.Number);
export type InstanceHealthState =
  | "initial"
  | "healthy"
  | "unhealthy"
  | "unused"
  | "draining"
  | "unavailable";
export const InstanceHealthState = S.Literal(
  "initial",
  "healthy",
  "unhealthy",
  "unused",
  "draining",
  "unavailable",
);
export type InstanceHealthReason =
  | "Lb.RegistrationInProgress"
  | "Lb.InitialHealthChecking"
  | "Lb.InternalError"
  | "Instance.ResponseCodeMismatch"
  | "Instance.Timeout"
  | "Instance.FailedHealthChecks"
  | "Instance.NotRegistered"
  | "Instance.NotInUse"
  | "Instance.DeregistrationInProgress"
  | "Instance.InvalidState"
  | "Instance.IpUnusable";
export const InstanceHealthReason = S.Literal(
  "Lb.RegistrationInProgress",
  "Lb.InitialHealthChecking",
  "Lb.InternalError",
  "Instance.ResponseCodeMismatch",
  "Instance.Timeout",
  "Instance.FailedHealthChecks",
  "Instance.NotRegistered",
  "Instance.NotInUse",
  "Instance.DeregistrationInProgress",
  "Instance.InvalidState",
  "Instance.IpUnusable",
);
export interface InstanceHealthSummary {
  instanceName?: string;
  instanceHealth?: InstanceHealthState;
  instanceHealthReason?: InstanceHealthReason;
}
export const InstanceHealthSummary = S.suspend(() =>
  S.Struct({
    instanceName: S.optional(S.String),
    instanceHealth: S.optional(InstanceHealthState),
    instanceHealthReason: S.optional(InstanceHealthReason),
  }),
).annotations({
  identifier: "InstanceHealthSummary",
}) as any as S.Schema<InstanceHealthSummary>;
export type InstanceHealthSummaryList = InstanceHealthSummary[];
export const InstanceHealthSummaryList = S.Array(InstanceHealthSummary);
export interface LoadBalancerTlsCertificateSummary {
  name?: string;
  isAttached?: boolean;
}
export const LoadBalancerTlsCertificateSummary = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), isAttached: S.optional(S.Boolean) }),
).annotations({
  identifier: "LoadBalancerTlsCertificateSummary",
}) as any as S.Schema<LoadBalancerTlsCertificateSummary>;
export type LoadBalancerTlsCertificateSummaryList =
  LoadBalancerTlsCertificateSummary[];
export const LoadBalancerTlsCertificateSummaryList = S.Array(
  LoadBalancerTlsCertificateSummary,
);
export type LoadBalancerConfigurationOptions = {
  [key in LoadBalancerAttributeName]?: string;
};
export const LoadBalancerConfigurationOptions = S.partial(
  S.Record({ key: LoadBalancerAttributeName, value: S.String }),
);
export interface LoadBalancer {
  name?: string;
  arn?: string;
  supportCode?: string;
  createdAt?: Date;
  location?: ResourceLocation;
  resourceType?: ResourceType;
  tags?: Tag[];
  dnsName?: string;
  state?: LoadBalancerState;
  protocol?: LoadBalancerProtocol;
  publicPorts?: number[];
  healthCheckPath?: string;
  instancePort?: number;
  instanceHealthSummary?: InstanceHealthSummary[];
  tlsCertificateSummaries?: LoadBalancerTlsCertificateSummary[];
  configurationOptions?: { [key: string]: string };
  ipAddressType?: IpAddressType;
  httpsRedirectionEnabled?: boolean;
  tlsPolicyName?: string;
}
export const LoadBalancer = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    supportCode: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    location: S.optional(ResourceLocation),
    resourceType: S.optional(ResourceType),
    tags: S.optional(TagList),
    dnsName: S.optional(S.String),
    state: S.optional(LoadBalancerState),
    protocol: S.optional(LoadBalancerProtocol),
    publicPorts: S.optional(PortList),
    healthCheckPath: S.optional(S.String),
    instancePort: S.optional(S.Number),
    instanceHealthSummary: S.optional(InstanceHealthSummaryList),
    tlsCertificateSummaries: S.optional(LoadBalancerTlsCertificateSummaryList),
    configurationOptions: S.optional(LoadBalancerConfigurationOptions),
    ipAddressType: S.optional(IpAddressType),
    httpsRedirectionEnabled: S.optional(S.Boolean),
    tlsPolicyName: S.optional(S.String),
  }),
).annotations({ identifier: "LoadBalancer" }) as any as S.Schema<LoadBalancer>;
export type LoadBalancerList = LoadBalancer[];
export const LoadBalancerList = S.Array(LoadBalancer);
export interface RelationalDatabaseHardware {
  cpuCount?: number;
  diskSizeInGb?: number;
  ramSizeInGb?: number;
}
export const RelationalDatabaseHardware = S.suspend(() =>
  S.Struct({
    cpuCount: S.optional(S.Number),
    diskSizeInGb: S.optional(S.Number),
    ramSizeInGb: S.optional(S.Number),
  }),
).annotations({
  identifier: "RelationalDatabaseHardware",
}) as any as S.Schema<RelationalDatabaseHardware>;
export interface PendingModifiedRelationalDatabaseValues {
  masterUserPassword?: string;
  engineVersion?: string;
  backupRetentionEnabled?: boolean;
}
export const PendingModifiedRelationalDatabaseValues = S.suspend(() =>
  S.Struct({
    masterUserPassword: S.optional(S.String),
    engineVersion: S.optional(S.String),
    backupRetentionEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "PendingModifiedRelationalDatabaseValues",
}) as any as S.Schema<PendingModifiedRelationalDatabaseValues>;
export interface RelationalDatabaseEndpoint {
  port?: number;
  address?: string;
}
export const RelationalDatabaseEndpoint = S.suspend(() =>
  S.Struct({ port: S.optional(S.Number), address: S.optional(S.String) }),
).annotations({
  identifier: "RelationalDatabaseEndpoint",
}) as any as S.Schema<RelationalDatabaseEndpoint>;
export interface PendingMaintenanceAction {
  action?: string;
  description?: string;
  currentApplyDate?: Date;
}
export const PendingMaintenanceAction = S.suspend(() =>
  S.Struct({
    action: S.optional(S.String),
    description: S.optional(S.String),
    currentApplyDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "PendingMaintenanceAction",
}) as any as S.Schema<PendingMaintenanceAction>;
export type PendingMaintenanceActionList = PendingMaintenanceAction[];
export const PendingMaintenanceActionList = S.Array(PendingMaintenanceAction);
export interface RelationalDatabase {
  name?: string;
  arn?: string;
  supportCode?: string;
  createdAt?: Date;
  location?: ResourceLocation;
  resourceType?: ResourceType;
  tags?: Tag[];
  relationalDatabaseBlueprintId?: string;
  relationalDatabaseBundleId?: string;
  masterDatabaseName?: string;
  hardware?: RelationalDatabaseHardware;
  state?: string;
  secondaryAvailabilityZone?: string;
  backupRetentionEnabled?: boolean;
  pendingModifiedValues?: PendingModifiedRelationalDatabaseValues;
  engine?: string;
  engineVersion?: string;
  latestRestorableTime?: Date;
  masterUsername?: string;
  parameterApplyStatus?: string;
  preferredBackupWindow?: string;
  preferredMaintenanceWindow?: string;
  publiclyAccessible?: boolean;
  masterEndpoint?: RelationalDatabaseEndpoint;
  pendingMaintenanceActions?: PendingMaintenanceAction[];
  caCertificateIdentifier?: string;
}
export const RelationalDatabase = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    supportCode: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    location: S.optional(ResourceLocation),
    resourceType: S.optional(ResourceType),
    tags: S.optional(TagList),
    relationalDatabaseBlueprintId: S.optional(S.String),
    relationalDatabaseBundleId: S.optional(S.String),
    masterDatabaseName: S.optional(S.String),
    hardware: S.optional(RelationalDatabaseHardware),
    state: S.optional(S.String),
    secondaryAvailabilityZone: S.optional(S.String),
    backupRetentionEnabled: S.optional(S.Boolean),
    pendingModifiedValues: S.optional(PendingModifiedRelationalDatabaseValues),
    engine: S.optional(S.String),
    engineVersion: S.optional(S.String),
    latestRestorableTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    masterUsername: S.optional(S.String),
    parameterApplyStatus: S.optional(S.String),
    preferredBackupWindow: S.optional(S.String),
    preferredMaintenanceWindow: S.optional(S.String),
    publiclyAccessible: S.optional(S.Boolean),
    masterEndpoint: S.optional(RelationalDatabaseEndpoint),
    pendingMaintenanceActions: S.optional(PendingMaintenanceActionList),
    caCertificateIdentifier: S.optional(S.String),
  }),
).annotations({
  identifier: "RelationalDatabase",
}) as any as S.Schema<RelationalDatabase>;
export type RelationalDatabaseList = RelationalDatabase[];
export const RelationalDatabaseList = S.Array(RelationalDatabase);
export interface RelationalDatabaseSnapshot {
  name?: string;
  arn?: string;
  supportCode?: string;
  createdAt?: Date;
  location?: ResourceLocation;
  resourceType?: ResourceType;
  tags?: Tag[];
  engine?: string;
  engineVersion?: string;
  sizeInGb?: number;
  state?: string;
  fromRelationalDatabaseName?: string;
  fromRelationalDatabaseArn?: string;
  fromRelationalDatabaseBundleId?: string;
  fromRelationalDatabaseBlueprintId?: string;
}
export const RelationalDatabaseSnapshot = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    supportCode: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    location: S.optional(ResourceLocation),
    resourceType: S.optional(ResourceType),
    tags: S.optional(TagList),
    engine: S.optional(S.String),
    engineVersion: S.optional(S.String),
    sizeInGb: S.optional(S.Number),
    state: S.optional(S.String),
    fromRelationalDatabaseName: S.optional(S.String),
    fromRelationalDatabaseArn: S.optional(S.String),
    fromRelationalDatabaseBundleId: S.optional(S.String),
    fromRelationalDatabaseBlueprintId: S.optional(S.String),
  }),
).annotations({
  identifier: "RelationalDatabaseSnapshot",
}) as any as S.Schema<RelationalDatabaseSnapshot>;
export type RelationalDatabaseSnapshotList = RelationalDatabaseSnapshot[];
export const RelationalDatabaseSnapshotList = S.Array(
  RelationalDatabaseSnapshot,
);
export interface StaticIp {
  name?: string;
  arn?: string;
  supportCode?: string;
  createdAt?: Date;
  location?: ResourceLocation;
  resourceType?: ResourceType;
  ipAddress?: string;
  attachedTo?: string;
  isAttached?: boolean;
}
export const StaticIp = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    supportCode: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    location: S.optional(ResourceLocation),
    resourceType: S.optional(ResourceType),
    ipAddress: S.optional(S.String),
    attachedTo: S.optional(S.String),
    isAttached: S.optional(S.Boolean),
  }),
).annotations({ identifier: "StaticIp" }) as any as S.Schema<StaticIp>;
export type StaticIpList = StaticIp[];
export const StaticIpList = S.Array(StaticIp);
export interface AccessRules {
  getObject?: AccessType;
  allowPublicOverrides?: boolean;
}
export const AccessRules = S.suspend(() =>
  S.Struct({
    getObject: S.optional(AccessType),
    allowPublicOverrides: S.optional(S.Boolean),
  }),
).annotations({ identifier: "AccessRules" }) as any as S.Schema<AccessRules>;
export interface BucketAccessLogConfig {
  enabled: boolean;
  destination?: string;
  prefix?: string;
}
export const BucketAccessLogConfig = S.suspend(() =>
  S.Struct({
    enabled: S.Boolean,
    destination: S.optional(S.String),
    prefix: S.optional(S.String),
  }),
).annotations({
  identifier: "BucketAccessLogConfig",
}) as any as S.Schema<BucketAccessLogConfig>;
export interface RelationalDatabaseParameter {
  allowedValues?: string;
  applyMethod?: string;
  applyType?: string;
  dataType?: string;
  description?: string;
  isModifiable?: boolean;
  parameterName?: string;
  parameterValue?: string;
}
export const RelationalDatabaseParameter = S.suspend(() =>
  S.Struct({
    allowedValues: S.optional(S.String),
    applyMethod: S.optional(S.String),
    applyType: S.optional(S.String),
    dataType: S.optional(S.String),
    description: S.optional(S.String),
    isModifiable: S.optional(S.Boolean),
    parameterName: S.optional(S.String),
    parameterValue: S.optional(S.String),
  }),
).annotations({
  identifier: "RelationalDatabaseParameter",
}) as any as S.Schema<RelationalDatabaseParameter>;
export type RelationalDatabaseParameterList = RelationalDatabaseParameter[];
export const RelationalDatabaseParameterList = S.Array(
  RelationalDatabaseParameter,
);
export type BucketCorsAllowedMethods = string[];
export const BucketCorsAllowedMethods = S.Array(S.String);
export type BucketCorsAllowedOrigins = string[];
export const BucketCorsAllowedOrigins = S.Array(S.String);
export type BucketCorsAllowedHeaders = string[];
export const BucketCorsAllowedHeaders = S.Array(S.String);
export type BucketCorsExposeHeaders = string[];
export const BucketCorsExposeHeaders = S.Array(S.String);
export interface AllocateStaticIpResult {
  operations?: Operation[];
}
export const AllocateStaticIpResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "AllocateStaticIpResult",
}) as any as S.Schema<AllocateStaticIpResult>;
export interface AttachCertificateToDistributionResult {
  operation?: Operation;
}
export const AttachCertificateToDistributionResult = S.suspend(() =>
  S.Struct({ operation: S.optional(Operation) }),
).annotations({
  identifier: "AttachCertificateToDistributionResult",
}) as any as S.Schema<AttachCertificateToDistributionResult>;
export interface AttachDiskResult {
  operations?: Operation[];
}
export const AttachDiskResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "AttachDiskResult",
}) as any as S.Schema<AttachDiskResult>;
export interface AttachInstancesToLoadBalancerResult {
  operations?: Operation[];
}
export const AttachInstancesToLoadBalancerResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "AttachInstancesToLoadBalancerResult",
}) as any as S.Schema<AttachInstancesToLoadBalancerResult>;
export interface AttachLoadBalancerTlsCertificateResult {
  operations?: Operation[];
}
export const AttachLoadBalancerTlsCertificateResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "AttachLoadBalancerTlsCertificateResult",
}) as any as S.Schema<AttachLoadBalancerTlsCertificateResult>;
export interface AttachStaticIpResult {
  operations?: Operation[];
}
export const AttachStaticIpResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "AttachStaticIpResult",
}) as any as S.Schema<AttachStaticIpResult>;
export interface CloseInstancePublicPortsRequest {
  portInfo: PortInfo;
  instanceName: string;
}
export const CloseInstancePublicPortsRequest = S.suspend(() =>
  S.Struct({ portInfo: PortInfo, instanceName: S.String }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/CloseInstancePublicPorts",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CloseInstancePublicPortsRequest",
}) as any as S.Schema<CloseInstancePublicPortsRequest>;
export interface CopySnapshotResult {
  operations?: Operation[];
}
export const CopySnapshotResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "CopySnapshotResult",
}) as any as S.Schema<CopySnapshotResult>;
export interface CreateBucketRequest {
  bucketName: string;
  bundleId: string;
  tags?: Tag[];
  enableObjectVersioning?: boolean;
}
export const CreateBucketRequest = S.suspend(() =>
  S.Struct({
    bucketName: S.String,
    bundleId: S.String,
    tags: S.optional(TagList),
    enableObjectVersioning: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/CreateBucket" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBucketRequest",
}) as any as S.Schema<CreateBucketRequest>;
export interface CreateCloudFormationStackRequest {
  instances: InstanceEntry[];
}
export const CreateCloudFormationStackRequest = S.suspend(() =>
  S.Struct({ instances: InstanceEntryList }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/CreateCloudFormationStack",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCloudFormationStackRequest",
}) as any as S.Schema<CreateCloudFormationStackRequest>;
export interface CreateContactMethodResult {
  operations?: Operation[];
}
export const CreateContactMethodResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "CreateContactMethodResult",
}) as any as S.Schema<CreateContactMethodResult>;
export interface CreateContainerServiceRegistryLoginResult {
  registryLogin?: ContainerServiceRegistryLogin;
}
export const CreateContainerServiceRegistryLoginResult = S.suspend(() =>
  S.Struct({ registryLogin: S.optional(ContainerServiceRegistryLogin) }),
).annotations({
  identifier: "CreateContainerServiceRegistryLoginResult",
}) as any as S.Schema<CreateContainerServiceRegistryLoginResult>;
export interface CreateDiskFromSnapshotResult {
  operations?: Operation[];
}
export const CreateDiskFromSnapshotResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "CreateDiskFromSnapshotResult",
}) as any as S.Schema<CreateDiskFromSnapshotResult>;
export interface CreateDiskSnapshotResult {
  operations?: Operation[];
}
export const CreateDiskSnapshotResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "CreateDiskSnapshotResult",
}) as any as S.Schema<CreateDiskSnapshotResult>;
export interface CreateDomainResult {
  operation?: Operation;
}
export const CreateDomainResult = S.suspend(() =>
  S.Struct({ operation: S.optional(Operation) }),
).annotations({
  identifier: "CreateDomainResult",
}) as any as S.Schema<CreateDomainResult>;
export interface CreateInstancesResult {
  operations?: Operation[];
}
export const CreateInstancesResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "CreateInstancesResult",
}) as any as S.Schema<CreateInstancesResult>;
export interface CreateInstanceSnapshotResult {
  operations?: Operation[];
}
export const CreateInstanceSnapshotResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "CreateInstanceSnapshotResult",
}) as any as S.Schema<CreateInstanceSnapshotResult>;
export interface CreateLoadBalancerResult {
  operations?: Operation[];
}
export const CreateLoadBalancerResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "CreateLoadBalancerResult",
}) as any as S.Schema<CreateLoadBalancerResult>;
export interface CreateLoadBalancerTlsCertificateResult {
  operations?: Operation[];
}
export const CreateLoadBalancerTlsCertificateResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "CreateLoadBalancerTlsCertificateResult",
}) as any as S.Schema<CreateLoadBalancerTlsCertificateResult>;
export interface CreateRelationalDatabaseResult {
  operations?: Operation[];
}
export const CreateRelationalDatabaseResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "CreateRelationalDatabaseResult",
}) as any as S.Schema<CreateRelationalDatabaseResult>;
export interface CreateRelationalDatabaseFromSnapshotResult {
  operations?: Operation[];
}
export const CreateRelationalDatabaseFromSnapshotResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "CreateRelationalDatabaseFromSnapshotResult",
}) as any as S.Schema<CreateRelationalDatabaseFromSnapshotResult>;
export interface CreateRelationalDatabaseSnapshotResult {
  operations?: Operation[];
}
export const CreateRelationalDatabaseSnapshotResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "CreateRelationalDatabaseSnapshotResult",
}) as any as S.Schema<CreateRelationalDatabaseSnapshotResult>;
export interface DeleteAlarmResult {
  operations?: Operation[];
}
export const DeleteAlarmResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "DeleteAlarmResult",
}) as any as S.Schema<DeleteAlarmResult>;
export interface DeleteAutoSnapshotResult {
  operations?: Operation[];
}
export const DeleteAutoSnapshotResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "DeleteAutoSnapshotResult",
}) as any as S.Schema<DeleteAutoSnapshotResult>;
export interface DeleteBucketResult {
  operations?: Operation[];
}
export const DeleteBucketResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "DeleteBucketResult",
}) as any as S.Schema<DeleteBucketResult>;
export interface DeleteBucketAccessKeyResult {
  operations?: Operation[];
}
export const DeleteBucketAccessKeyResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "DeleteBucketAccessKeyResult",
}) as any as S.Schema<DeleteBucketAccessKeyResult>;
export interface DeleteCertificateResult {
  operations?: Operation[];
}
export const DeleteCertificateResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "DeleteCertificateResult",
}) as any as S.Schema<DeleteCertificateResult>;
export interface DeleteContactMethodResult {
  operations?: Operation[];
}
export const DeleteContactMethodResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "DeleteContactMethodResult",
}) as any as S.Schema<DeleteContactMethodResult>;
export interface DeleteDiskResult {
  operations?: Operation[];
}
export const DeleteDiskResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "DeleteDiskResult",
}) as any as S.Schema<DeleteDiskResult>;
export interface DeleteDiskSnapshotResult {
  operations?: Operation[];
}
export const DeleteDiskSnapshotResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "DeleteDiskSnapshotResult",
}) as any as S.Schema<DeleteDiskSnapshotResult>;
export interface DeleteDistributionResult {
  operation?: Operation;
}
export const DeleteDistributionResult = S.suspend(() =>
  S.Struct({ operation: S.optional(Operation) }),
).annotations({
  identifier: "DeleteDistributionResult",
}) as any as S.Schema<DeleteDistributionResult>;
export interface DeleteDomainResult {
  operation?: Operation;
}
export const DeleteDomainResult = S.suspend(() =>
  S.Struct({ operation: S.optional(Operation) }),
).annotations({
  identifier: "DeleteDomainResult",
}) as any as S.Schema<DeleteDomainResult>;
export interface DeleteDomainEntryResult {
  operation?: Operation;
}
export const DeleteDomainEntryResult = S.suspend(() =>
  S.Struct({ operation: S.optional(Operation) }),
).annotations({
  identifier: "DeleteDomainEntryResult",
}) as any as S.Schema<DeleteDomainEntryResult>;
export interface DeleteInstanceResult {
  operations?: Operation[];
}
export const DeleteInstanceResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "DeleteInstanceResult",
}) as any as S.Schema<DeleteInstanceResult>;
export interface DeleteInstanceSnapshotResult {
  operations?: Operation[];
}
export const DeleteInstanceSnapshotResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "DeleteInstanceSnapshotResult",
}) as any as S.Schema<DeleteInstanceSnapshotResult>;
export interface DeleteKeyPairResult {
  operation?: Operation;
}
export const DeleteKeyPairResult = S.suspend(() =>
  S.Struct({ operation: S.optional(Operation) }),
).annotations({
  identifier: "DeleteKeyPairResult",
}) as any as S.Schema<DeleteKeyPairResult>;
export interface DeleteKnownHostKeysResult {
  operations?: Operation[];
}
export const DeleteKnownHostKeysResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "DeleteKnownHostKeysResult",
}) as any as S.Schema<DeleteKnownHostKeysResult>;
export interface DeleteLoadBalancerResult {
  operations?: Operation[];
}
export const DeleteLoadBalancerResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "DeleteLoadBalancerResult",
}) as any as S.Schema<DeleteLoadBalancerResult>;
export interface DeleteLoadBalancerTlsCertificateResult {
  operations?: Operation[];
}
export const DeleteLoadBalancerTlsCertificateResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "DeleteLoadBalancerTlsCertificateResult",
}) as any as S.Schema<DeleteLoadBalancerTlsCertificateResult>;
export interface DeleteRelationalDatabaseResult {
  operations?: Operation[];
}
export const DeleteRelationalDatabaseResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "DeleteRelationalDatabaseResult",
}) as any as S.Schema<DeleteRelationalDatabaseResult>;
export interface DeleteRelationalDatabaseSnapshotResult {
  operations?: Operation[];
}
export const DeleteRelationalDatabaseSnapshotResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "DeleteRelationalDatabaseSnapshotResult",
}) as any as S.Schema<DeleteRelationalDatabaseSnapshotResult>;
export interface DetachCertificateFromDistributionResult {
  operation?: Operation;
}
export const DetachCertificateFromDistributionResult = S.suspend(() =>
  S.Struct({ operation: S.optional(Operation) }),
).annotations({
  identifier: "DetachCertificateFromDistributionResult",
}) as any as S.Schema<DetachCertificateFromDistributionResult>;
export interface DetachDiskResult {
  operations?: Operation[];
}
export const DetachDiskResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "DetachDiskResult",
}) as any as S.Schema<DetachDiskResult>;
export interface DetachInstancesFromLoadBalancerResult {
  operations?: Operation[];
}
export const DetachInstancesFromLoadBalancerResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "DetachInstancesFromLoadBalancerResult",
}) as any as S.Schema<DetachInstancesFromLoadBalancerResult>;
export interface DetachStaticIpResult {
  operations?: Operation[];
}
export const DetachStaticIpResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "DetachStaticIpResult",
}) as any as S.Schema<DetachStaticIpResult>;
export interface DisableAddOnResult {
  operations?: Operation[];
}
export const DisableAddOnResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "DisableAddOnResult",
}) as any as S.Schema<DisableAddOnResult>;
export interface EnableAddOnResult {
  operations?: Operation[];
}
export const EnableAddOnResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "EnableAddOnResult",
}) as any as S.Schema<EnableAddOnResult>;
export interface ExportSnapshotResult {
  operations?: Operation[];
}
export const ExportSnapshotResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "ExportSnapshotResult",
}) as any as S.Schema<ExportSnapshotResult>;
export interface GetActiveNamesResult {
  activeNames?: string[];
  nextPageToken?: string;
}
export const GetActiveNamesResult = S.suspend(() =>
  S.Struct({
    activeNames: S.optional(StringList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetActiveNamesResult",
}) as any as S.Schema<GetActiveNamesResult>;
export interface GetBucketAccessKeysResult {
  accessKeys?: AccessKey[];
}
export const GetBucketAccessKeysResult = S.suspend(() =>
  S.Struct({ accessKeys: S.optional(AccessKeyList) }),
).annotations({
  identifier: "GetBucketAccessKeysResult",
}) as any as S.Schema<GetBucketAccessKeysResult>;
export interface GetCertificatesResult {
  certificates?: CertificateSummary[];
  nextPageToken?: string;
}
export const GetCertificatesResult = S.suspend(() =>
  S.Struct({
    certificates: S.optional(CertificateSummaryList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetCertificatesResult",
}) as any as S.Schema<GetCertificatesResult>;
export interface GetContainerAPIMetadataResult {
  metadata?: { [key: string]: string }[];
}
export const GetContainerAPIMetadataResult = S.suspend(() =>
  S.Struct({ metadata: S.optional(ContainerServiceMetadataEntryList) }),
).annotations({
  identifier: "GetContainerAPIMetadataResult",
}) as any as S.Schema<GetContainerAPIMetadataResult>;
export interface MetricDatapoint {
  average?: number;
  maximum?: number;
  minimum?: number;
  sampleCount?: number;
  sum?: number;
  timestamp?: Date;
  unit?: MetricUnit;
}
export const MetricDatapoint = S.suspend(() =>
  S.Struct({
    average: S.optional(S.Number),
    maximum: S.optional(S.Number),
    minimum: S.optional(S.Number),
    sampleCount: S.optional(S.Number),
    sum: S.optional(S.Number),
    timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    unit: S.optional(MetricUnit),
  }),
).annotations({
  identifier: "MetricDatapoint",
}) as any as S.Schema<MetricDatapoint>;
export type MetricDatapointList = MetricDatapoint[];
export const MetricDatapointList = S.Array(MetricDatapoint);
export interface GetContainerServiceMetricDataResult {
  metricName?: ContainerServiceMetricName;
  metricData?: MetricDatapoint[];
}
export const GetContainerServiceMetricDataResult = S.suspend(() =>
  S.Struct({
    metricName: S.optional(ContainerServiceMetricName),
    metricData: S.optional(MetricDatapointList),
  }),
).annotations({
  identifier: "GetContainerServiceMetricDataResult",
}) as any as S.Schema<GetContainerServiceMetricDataResult>;
export interface GetContainerServicePowersResult {
  powers?: ContainerServicePower[];
}
export const GetContainerServicePowersResult = S.suspend(() =>
  S.Struct({ powers: S.optional(ContainerServicePowerList) }),
).annotations({
  identifier: "GetContainerServicePowersResult",
}) as any as S.Schema<GetContainerServicePowersResult>;
export interface GetDisksResult {
  disks?: Disk[];
  nextPageToken?: string;
}
export const GetDisksResult = S.suspend(() =>
  S.Struct({
    disks: S.optional(DiskList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDisksResult",
}) as any as S.Schema<GetDisksResult>;
export interface GetDiskSnapshotsResult {
  diskSnapshots?: DiskSnapshot[];
  nextPageToken?: string;
}
export const GetDiskSnapshotsResult = S.suspend(() =>
  S.Struct({
    diskSnapshots: S.optional(DiskSnapshotList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDiskSnapshotsResult",
}) as any as S.Schema<GetDiskSnapshotsResult>;
export interface GetDistributionBundlesResult {
  bundles?: DistributionBundle[];
}
export const GetDistributionBundlesResult = S.suspend(() =>
  S.Struct({ bundles: S.optional(DistributionBundleList) }),
).annotations({
  identifier: "GetDistributionBundlesResult",
}) as any as S.Schema<GetDistributionBundlesResult>;
export interface GetDistributionLatestCacheResetResult {
  status?: string;
  createTime?: Date;
}
export const GetDistributionLatestCacheResetResult = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    createTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetDistributionLatestCacheResetResult",
}) as any as S.Schema<GetDistributionLatestCacheResetResult>;
export interface GetDistributionMetricDataResult {
  metricName?: DistributionMetricName;
  metricData?: MetricDatapoint[];
}
export const GetDistributionMetricDataResult = S.suspend(() =>
  S.Struct({
    metricName: S.optional(DistributionMetricName),
    metricData: S.optional(MetricDatapointList),
  }),
).annotations({
  identifier: "GetDistributionMetricDataResult",
}) as any as S.Schema<GetDistributionMetricDataResult>;
export interface GetDomainsResult {
  domains?: Domain[];
  nextPageToken?: string;
}
export const GetDomainsResult = S.suspend(() =>
  S.Struct({
    domains: S.optional(DomainList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDomainsResult",
}) as any as S.Schema<GetDomainsResult>;
export interface GetInstanceMetricDataResult {
  metricName?: InstanceMetricName;
  metricData?: MetricDatapoint[];
}
export const GetInstanceMetricDataResult = S.suspend(() =>
  S.Struct({
    metricName: S.optional(InstanceMetricName),
    metricData: S.optional(MetricDatapointList),
  }),
).annotations({
  identifier: "GetInstanceMetricDataResult",
}) as any as S.Schema<GetInstanceMetricDataResult>;
export interface GetInstancesResult {
  instances?: Instance[];
  nextPageToken?: string;
}
export const GetInstancesResult = S.suspend(() =>
  S.Struct({
    instances: S.optional(InstanceList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetInstancesResult",
}) as any as S.Schema<GetInstancesResult>;
export interface GetInstanceSnapshotsResult {
  instanceSnapshots?: InstanceSnapshot[];
  nextPageToken?: string;
}
export const GetInstanceSnapshotsResult = S.suspend(() =>
  S.Struct({
    instanceSnapshots: S.optional(InstanceSnapshotList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetInstanceSnapshotsResult",
}) as any as S.Schema<GetInstanceSnapshotsResult>;
export interface GetKeyPairResult {
  keyPair?: KeyPair;
}
export const GetKeyPairResult = S.suspend(() =>
  S.Struct({ keyPair: S.optional(KeyPair) }),
).annotations({
  identifier: "GetKeyPairResult",
}) as any as S.Schema<GetKeyPairResult>;
export interface GetKeyPairsResult {
  keyPairs?: KeyPair[];
  nextPageToken?: string;
}
export const GetKeyPairsResult = S.suspend(() =>
  S.Struct({
    keyPairs: S.optional(KeyPairList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetKeyPairsResult",
}) as any as S.Schema<GetKeyPairsResult>;
export interface GetLoadBalancerMetricDataResult {
  metricName?: LoadBalancerMetricName;
  metricData?: MetricDatapoint[];
}
export const GetLoadBalancerMetricDataResult = S.suspend(() =>
  S.Struct({
    metricName: S.optional(LoadBalancerMetricName),
    metricData: S.optional(MetricDatapointList),
  }),
).annotations({
  identifier: "GetLoadBalancerMetricDataResult",
}) as any as S.Schema<GetLoadBalancerMetricDataResult>;
export interface GetLoadBalancersResult {
  loadBalancers?: LoadBalancer[];
  nextPageToken?: string;
}
export const GetLoadBalancersResult = S.suspend(() =>
  S.Struct({
    loadBalancers: S.optional(LoadBalancerList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetLoadBalancersResult",
}) as any as S.Schema<GetLoadBalancersResult>;
export interface GetOperationResult {
  operation?: Operation;
}
export const GetOperationResult = S.suspend(() =>
  S.Struct({ operation: S.optional(Operation) }),
).annotations({
  identifier: "GetOperationResult",
}) as any as S.Schema<GetOperationResult>;
export interface GetOperationsResult {
  operations?: Operation[];
  nextPageToken?: string;
}
export const GetOperationsResult = S.suspend(() =>
  S.Struct({
    operations: S.optional(OperationList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetOperationsResult",
}) as any as S.Schema<GetOperationsResult>;
export interface GetOperationsForResourceResult {
  operations?: Operation[];
  nextPageCount?: string;
  nextPageToken?: string;
}
export const GetOperationsForResourceResult = S.suspend(() =>
  S.Struct({
    operations: S.optional(OperationList),
    nextPageCount: S.optional(S.String),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetOperationsForResourceResult",
}) as any as S.Schema<GetOperationsForResourceResult>;
export interface GetRelationalDatabaseLogStreamsResult {
  logStreams?: string[];
}
export const GetRelationalDatabaseLogStreamsResult = S.suspend(() =>
  S.Struct({ logStreams: S.optional(StringList) }),
).annotations({
  identifier: "GetRelationalDatabaseLogStreamsResult",
}) as any as S.Schema<GetRelationalDatabaseLogStreamsResult>;
export interface GetRelationalDatabaseMasterUserPasswordResult {
  masterUserPassword?: string | redacted.Redacted<string>;
  createdAt?: Date;
}
export const GetRelationalDatabaseMasterUserPasswordResult = S.suspend(() =>
  S.Struct({
    masterUserPassword: S.optional(SensitiveString),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetRelationalDatabaseMasterUserPasswordResult",
}) as any as S.Schema<GetRelationalDatabaseMasterUserPasswordResult>;
export interface GetRelationalDatabaseMetricDataResult {
  metricName?: RelationalDatabaseMetricName;
  metricData?: MetricDatapoint[];
}
export const GetRelationalDatabaseMetricDataResult = S.suspend(() =>
  S.Struct({
    metricName: S.optional(RelationalDatabaseMetricName),
    metricData: S.optional(MetricDatapointList),
  }),
).annotations({
  identifier: "GetRelationalDatabaseMetricDataResult",
}) as any as S.Schema<GetRelationalDatabaseMetricDataResult>;
export interface GetRelationalDatabaseParametersResult {
  parameters?: RelationalDatabaseParameter[];
  nextPageToken?: string;
}
export const GetRelationalDatabaseParametersResult = S.suspend(() =>
  S.Struct({
    parameters: S.optional(RelationalDatabaseParameterList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetRelationalDatabaseParametersResult",
}) as any as S.Schema<GetRelationalDatabaseParametersResult>;
export interface GetRelationalDatabasesResult {
  relationalDatabases?: RelationalDatabase[];
  nextPageToken?: string;
}
export const GetRelationalDatabasesResult = S.suspend(() =>
  S.Struct({
    relationalDatabases: S.optional(RelationalDatabaseList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetRelationalDatabasesResult",
}) as any as S.Schema<GetRelationalDatabasesResult>;
export interface GetRelationalDatabaseSnapshotsResult {
  relationalDatabaseSnapshots?: RelationalDatabaseSnapshot[];
  nextPageToken?: string;
}
export const GetRelationalDatabaseSnapshotsResult = S.suspend(() =>
  S.Struct({
    relationalDatabaseSnapshots: S.optional(RelationalDatabaseSnapshotList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetRelationalDatabaseSnapshotsResult",
}) as any as S.Schema<GetRelationalDatabaseSnapshotsResult>;
export interface GetStaticIpsResult {
  staticIps?: StaticIp[];
  nextPageToken?: string;
}
export const GetStaticIpsResult = S.suspend(() =>
  S.Struct({
    staticIps: S.optional(StaticIpList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetStaticIpsResult",
}) as any as S.Schema<GetStaticIpsResult>;
export interface ImportKeyPairResult {
  operation?: Operation;
}
export const ImportKeyPairResult = S.suspend(() =>
  S.Struct({ operation: S.optional(Operation) }),
).annotations({
  identifier: "ImportKeyPairResult",
}) as any as S.Schema<ImportKeyPairResult>;
export interface OpenInstancePublicPortsResult {
  operation?: Operation;
}
export const OpenInstancePublicPortsResult = S.suspend(() =>
  S.Struct({ operation: S.optional(Operation) }),
).annotations({
  identifier: "OpenInstancePublicPortsResult",
}) as any as S.Schema<OpenInstancePublicPortsResult>;
export interface PutAlarmResult {
  operations?: Operation[];
}
export const PutAlarmResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "PutAlarmResult",
}) as any as S.Schema<PutAlarmResult>;
export interface PutInstancePublicPortsResult {
  operation?: Operation;
}
export const PutInstancePublicPortsResult = S.suspend(() =>
  S.Struct({ operation: S.optional(Operation) }),
).annotations({
  identifier: "PutInstancePublicPortsResult",
}) as any as S.Schema<PutInstancePublicPortsResult>;
export interface RebootInstanceResult {
  operations?: Operation[];
}
export const RebootInstanceResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "RebootInstanceResult",
}) as any as S.Schema<RebootInstanceResult>;
export interface RebootRelationalDatabaseResult {
  operations?: Operation[];
}
export const RebootRelationalDatabaseResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "RebootRelationalDatabaseResult",
}) as any as S.Schema<RebootRelationalDatabaseResult>;
export interface ContainerImage {
  image?: string;
  digest?: string;
  createdAt?: Date;
}
export const ContainerImage = S.suspend(() =>
  S.Struct({
    image: S.optional(S.String),
    digest: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ContainerImage",
}) as any as S.Schema<ContainerImage>;
export interface RegisterContainerImageResult {
  containerImage?: ContainerImage;
}
export const RegisterContainerImageResult = S.suspend(() =>
  S.Struct({ containerImage: S.optional(ContainerImage) }),
).annotations({
  identifier: "RegisterContainerImageResult",
}) as any as S.Schema<RegisterContainerImageResult>;
export interface ReleaseStaticIpResult {
  operations?: Operation[];
}
export const ReleaseStaticIpResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "ReleaseStaticIpResult",
}) as any as S.Schema<ReleaseStaticIpResult>;
export interface ResetDistributionCacheResult {
  status?: string;
  createTime?: Date;
  operation?: Operation;
}
export const ResetDistributionCacheResult = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    createTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    operation: S.optional(Operation),
  }),
).annotations({
  identifier: "ResetDistributionCacheResult",
}) as any as S.Schema<ResetDistributionCacheResult>;
export interface SendContactMethodVerificationResult {
  operations?: Operation[];
}
export const SendContactMethodVerificationResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "SendContactMethodVerificationResult",
}) as any as S.Schema<SendContactMethodVerificationResult>;
export interface SetIpAddressTypeResult {
  operations?: Operation[];
}
export const SetIpAddressTypeResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "SetIpAddressTypeResult",
}) as any as S.Schema<SetIpAddressTypeResult>;
export interface SetResourceAccessForBucketResult {
  operations?: Operation[];
}
export const SetResourceAccessForBucketResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "SetResourceAccessForBucketResult",
}) as any as S.Schema<SetResourceAccessForBucketResult>;
export interface SetupInstanceHttpsResult {
  operations?: Operation[];
}
export const SetupInstanceHttpsResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "SetupInstanceHttpsResult",
}) as any as S.Schema<SetupInstanceHttpsResult>;
export interface StartGUISessionResult {
  operations?: Operation[];
}
export const StartGUISessionResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "StartGUISessionResult",
}) as any as S.Schema<StartGUISessionResult>;
export interface StartInstanceResult {
  operations?: Operation[];
}
export const StartInstanceResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "StartInstanceResult",
}) as any as S.Schema<StartInstanceResult>;
export interface StartRelationalDatabaseResult {
  operations?: Operation[];
}
export const StartRelationalDatabaseResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "StartRelationalDatabaseResult",
}) as any as S.Schema<StartRelationalDatabaseResult>;
export interface StopGUISessionResult {
  operations?: Operation[];
}
export const StopGUISessionResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "StopGUISessionResult",
}) as any as S.Schema<StopGUISessionResult>;
export interface StopInstanceResult {
  operations?: Operation[];
}
export const StopInstanceResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "StopInstanceResult",
}) as any as S.Schema<StopInstanceResult>;
export interface StopRelationalDatabaseResult {
  operations?: Operation[];
}
export const StopRelationalDatabaseResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "StopRelationalDatabaseResult",
}) as any as S.Schema<StopRelationalDatabaseResult>;
export interface TagResourceResult {
  operations?: Operation[];
}
export const TagResourceResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "TagResourceResult",
}) as any as S.Schema<TagResourceResult>;
export interface TestAlarmResult {
  operations?: Operation[];
}
export const TestAlarmResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "TestAlarmResult",
}) as any as S.Schema<TestAlarmResult>;
export interface UntagResourceResult {
  operations?: Operation[];
}
export const UntagResourceResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "UntagResourceResult",
}) as any as S.Schema<UntagResourceResult>;
export interface UpdateBucketBundleResult {
  operations?: Operation[];
}
export const UpdateBucketBundleResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "UpdateBucketBundleResult",
}) as any as S.Schema<UpdateBucketBundleResult>;
export type ContainerServiceState =
  | "PENDING"
  | "READY"
  | "RUNNING"
  | "UPDATING"
  | "DELETING"
  | "DISABLED"
  | "DEPLOYING";
export const ContainerServiceState = S.Literal(
  "PENDING",
  "READY",
  "RUNNING",
  "UPDATING",
  "DELETING",
  "DISABLED",
  "DEPLOYING",
);
export type ContainerServiceStateDetailCode =
  | "CREATING_SYSTEM_RESOURCES"
  | "CREATING_NETWORK_INFRASTRUCTURE"
  | "PROVISIONING_CERTIFICATE"
  | "PROVISIONING_SERVICE"
  | "CREATING_DEPLOYMENT"
  | "EVALUATING_HEALTH_CHECK"
  | "ACTIVATING_DEPLOYMENT"
  | "CERTIFICATE_LIMIT_EXCEEDED"
  | "UNKNOWN_ERROR";
export const ContainerServiceStateDetailCode = S.Literal(
  "CREATING_SYSTEM_RESOURCES",
  "CREATING_NETWORK_INFRASTRUCTURE",
  "PROVISIONING_CERTIFICATE",
  "PROVISIONING_SERVICE",
  "CREATING_DEPLOYMENT",
  "EVALUATING_HEALTH_CHECK",
  "ACTIVATING_DEPLOYMENT",
  "CERTIFICATE_LIMIT_EXCEEDED",
  "UNKNOWN_ERROR",
);
export interface ContainerServiceStateDetail {
  code?: ContainerServiceStateDetailCode;
  message?: string;
}
export const ContainerServiceStateDetail = S.suspend(() =>
  S.Struct({
    code: S.optional(ContainerServiceStateDetailCode),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "ContainerServiceStateDetail",
}) as any as S.Schema<ContainerServiceStateDetail>;
export type ContainerServiceDeploymentState =
  | "ACTIVATING"
  | "ACTIVE"
  | "INACTIVE"
  | "FAILED";
export const ContainerServiceDeploymentState = S.Literal(
  "ACTIVATING",
  "ACTIVE",
  "INACTIVE",
  "FAILED",
);
export interface ContainerServiceEndpoint {
  containerName?: string;
  containerPort?: number;
  healthCheck?: ContainerServiceHealthCheckConfig;
}
export const ContainerServiceEndpoint = S.suspend(() =>
  S.Struct({
    containerName: S.optional(S.String),
    containerPort: S.optional(S.Number),
    healthCheck: S.optional(ContainerServiceHealthCheckConfig),
  }),
).annotations({
  identifier: "ContainerServiceEndpoint",
}) as any as S.Schema<ContainerServiceEndpoint>;
export interface ContainerServiceDeployment {
  version?: number;
  state?: ContainerServiceDeploymentState;
  containers?: { [key: string]: Container };
  publicEndpoint?: ContainerServiceEndpoint;
  createdAt?: Date;
}
export const ContainerServiceDeployment = S.suspend(() =>
  S.Struct({
    version: S.optional(S.Number),
    state: S.optional(ContainerServiceDeploymentState),
    containers: S.optional(ContainerMap),
    publicEndpoint: S.optional(ContainerServiceEndpoint),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ContainerServiceDeployment",
}) as any as S.Schema<ContainerServiceDeployment>;
export interface ContainerServiceECRImagePullerRole {
  isActive?: boolean;
  principalArn?: string;
}
export const ContainerServiceECRImagePullerRole = S.suspend(() =>
  S.Struct({
    isActive: S.optional(S.Boolean),
    principalArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ContainerServiceECRImagePullerRole",
}) as any as S.Schema<ContainerServiceECRImagePullerRole>;
export interface PrivateRegistryAccess {
  ecrImagePullerRole?: ContainerServiceECRImagePullerRole;
}
export const PrivateRegistryAccess = S.suspend(() =>
  S.Struct({
    ecrImagePullerRole: S.optional(ContainerServiceECRImagePullerRole),
  }),
).annotations({
  identifier: "PrivateRegistryAccess",
}) as any as S.Schema<PrivateRegistryAccess>;
export interface ContainerService {
  containerServiceName?: string;
  arn?: string;
  createdAt?: Date;
  location?: ResourceLocation;
  resourceType?: ResourceType;
  tags?: Tag[];
  power?: ContainerServicePowerName;
  powerId?: string;
  state?: ContainerServiceState;
  stateDetail?: ContainerServiceStateDetail;
  scale?: number;
  currentDeployment?: ContainerServiceDeployment;
  nextDeployment?: ContainerServiceDeployment;
  isDisabled?: boolean;
  principalArn?: string;
  privateDomainName?: string;
  publicDomainNames?: { [key: string]: string[] };
  url?: string;
  privateRegistryAccess?: PrivateRegistryAccess;
}
export const ContainerService = S.suspend(() =>
  S.Struct({
    containerServiceName: S.optional(S.String),
    arn: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    location: S.optional(ResourceLocation),
    resourceType: S.optional(ResourceType),
    tags: S.optional(TagList),
    power: S.optional(ContainerServicePowerName),
    powerId: S.optional(S.String),
    state: S.optional(ContainerServiceState),
    stateDetail: S.optional(ContainerServiceStateDetail),
    scale: S.optional(S.Number),
    currentDeployment: S.optional(ContainerServiceDeployment),
    nextDeployment: S.optional(ContainerServiceDeployment),
    isDisabled: S.optional(S.Boolean),
    principalArn: S.optional(S.String),
    privateDomainName: S.optional(S.String),
    publicDomainNames: S.optional(ContainerServicePublicDomains),
    url: S.optional(S.String),
    privateRegistryAccess: S.optional(PrivateRegistryAccess),
  }),
).annotations({
  identifier: "ContainerService",
}) as any as S.Schema<ContainerService>;
export interface UpdateContainerServiceResult {
  containerService?: ContainerService;
}
export const UpdateContainerServiceResult = S.suspend(() =>
  S.Struct({ containerService: S.optional(ContainerService) }),
).annotations({
  identifier: "UpdateContainerServiceResult",
}) as any as S.Schema<UpdateContainerServiceResult>;
export interface UpdateDistributionResult {
  operation?: Operation;
}
export const UpdateDistributionResult = S.suspend(() =>
  S.Struct({ operation: S.optional(Operation) }),
).annotations({
  identifier: "UpdateDistributionResult",
}) as any as S.Schema<UpdateDistributionResult>;
export interface UpdateDistributionBundleResult {
  operation?: Operation;
}
export const UpdateDistributionBundleResult = S.suspend(() =>
  S.Struct({ operation: S.optional(Operation) }),
).annotations({
  identifier: "UpdateDistributionBundleResult",
}) as any as S.Schema<UpdateDistributionBundleResult>;
export interface UpdateDomainEntryResult {
  operations?: Operation[];
}
export const UpdateDomainEntryResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "UpdateDomainEntryResult",
}) as any as S.Schema<UpdateDomainEntryResult>;
export interface UpdateInstanceMetadataOptionsResult {
  operation?: Operation;
}
export const UpdateInstanceMetadataOptionsResult = S.suspend(() =>
  S.Struct({ operation: S.optional(Operation) }),
).annotations({
  identifier: "UpdateInstanceMetadataOptionsResult",
}) as any as S.Schema<UpdateInstanceMetadataOptionsResult>;
export interface UpdateLoadBalancerAttributeResult {
  operations?: Operation[];
}
export const UpdateLoadBalancerAttributeResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "UpdateLoadBalancerAttributeResult",
}) as any as S.Schema<UpdateLoadBalancerAttributeResult>;
export interface UpdateRelationalDatabaseResult {
  operations?: Operation[];
}
export const UpdateRelationalDatabaseResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "UpdateRelationalDatabaseResult",
}) as any as S.Schema<UpdateRelationalDatabaseResult>;
export interface UpdateRelationalDatabaseParametersRequest {
  relationalDatabaseName: string;
  parameters: RelationalDatabaseParameter[];
}
export const UpdateRelationalDatabaseParametersRequest = S.suspend(() =>
  S.Struct({
    relationalDatabaseName: S.String,
    parameters: RelationalDatabaseParameterList,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/UpdateRelationalDatabaseParameters",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRelationalDatabaseParametersRequest",
}) as any as S.Schema<UpdateRelationalDatabaseParametersRequest>;
export interface DiskMap {
  originalDiskPath?: string;
  newDiskName?: string;
}
export const DiskMap = S.suspend(() =>
  S.Struct({
    originalDiskPath: S.optional(S.String),
    newDiskName: S.optional(S.String),
  }),
).annotations({ identifier: "DiskMap" }) as any as S.Schema<DiskMap>;
export type DiskMapList = DiskMap[];
export const DiskMapList = S.Array(DiskMap);
export type AutoSnapshotStatus =
  | "Success"
  | "Failed"
  | "InProgress"
  | "NotFound";
export const AutoSnapshotStatus = S.Literal(
  "Success",
  "Failed",
  "InProgress",
  "NotFound",
);
export type BlueprintType = "os" | "app";
export const BlueprintType = S.Literal("os", "app");
export type InstancePlatform = "LINUX_UNIX" | "WINDOWS";
export const InstancePlatform = S.Literal("LINUX_UNIX", "WINDOWS");
export type AccountLevelBpaSyncStatus =
  | "InSync"
  | "Failed"
  | "NeverSynced"
  | "Defaulted";
export const AccountLevelBpaSyncStatus = S.Literal(
  "InSync",
  "Failed",
  "NeverSynced",
  "Defaulted",
);
export type BPAStatusMessage =
  | "DEFAULTED_FOR_SLR_MISSING"
  | "SYNC_ON_HOLD"
  | "DEFAULTED_FOR_SLR_MISSING_ON_HOLD"
  | "Unknown";
export const BPAStatusMessage = S.Literal(
  "DEFAULTED_FOR_SLR_MISSING",
  "SYNC_ON_HOLD",
  "DEFAULTED_FOR_SLR_MISSING_ON_HOLD",
  "Unknown",
);
export type InstancePlatformList = InstancePlatform[];
export const InstancePlatformList = S.Array(InstancePlatform);
export type AppCategoryList = AppCategory[];
export const AppCategoryList = S.Array(AppCategory);
export type RecordState = "Started" | "Succeeded" | "Failed";
export const RecordState = S.Literal("Started", "Succeeded", "Failed");
export type ContactMethodStatus = "PendingVerification" | "Valid" | "Invalid";
export const ContactMethodStatus = S.Literal(
  "PendingVerification",
  "Valid",
  "Invalid",
);
export type PortState = "open" | "closed";
export const PortState = S.Literal("open", "closed");
export type LoadBalancerTlsCertificateStatus =
  | "PENDING_VALIDATION"
  | "ISSUED"
  | "INACTIVE"
  | "EXPIRED"
  | "VALIDATION_TIMED_OUT"
  | "REVOKED"
  | "FAILED"
  | "UNKNOWN";
export const LoadBalancerTlsCertificateStatus = S.Literal(
  "PENDING_VALIDATION",
  "ISSUED",
  "INACTIVE",
  "EXPIRED",
  "VALIDATION_TIMED_OUT",
  "REVOKED",
  "FAILED",
  "UNKNOWN",
);
export type LoadBalancerTlsCertificateFailureReason =
  | "NO_AVAILABLE_CONTACTS"
  | "ADDITIONAL_VERIFICATION_REQUIRED"
  | "DOMAIN_NOT_ALLOWED"
  | "INVALID_PUBLIC_DOMAIN"
  | "OTHER";
export const LoadBalancerTlsCertificateFailureReason = S.Literal(
  "NO_AVAILABLE_CONTACTS",
  "ADDITIONAL_VERIFICATION_REQUIRED",
  "DOMAIN_NOT_ALLOWED",
  "INVALID_PUBLIC_DOMAIN",
  "OTHER",
);
export type LoadBalancerTlsCertificateRevocationReason =
  | "UNSPECIFIED"
  | "KEY_COMPROMISE"
  | "CA_COMPROMISE"
  | "AFFILIATION_CHANGED"
  | "SUPERCEDED"
  | "CESSATION_OF_OPERATION"
  | "CERTIFICATE_HOLD"
  | "REMOVE_FROM_CRL"
  | "PRIVILEGE_WITHDRAWN"
  | "A_A_COMPROMISE";
export const LoadBalancerTlsCertificateRevocationReason = S.Literal(
  "UNSPECIFIED",
  "KEY_COMPROMISE",
  "CA_COMPROMISE",
  "AFFILIATION_CHANGED",
  "SUPERCEDED",
  "CESSATION_OF_OPERATION",
  "CERTIFICATE_HOLD",
  "REMOVE_FROM_CRL",
  "PRIVILEGE_WITHDRAWN",
  "A_A_COMPROMISE",
);
export type RelationalDatabaseEngine = "mysql";
export const RelationalDatabaseEngine = S.Literal("mysql");
export type SetupStatus = "succeeded" | "failed" | "inProgress";
export const SetupStatus = S.Literal("succeeded", "failed", "inProgress");
export interface BucketCorsRule {
  id?: string;
  allowedMethods: string[];
  allowedOrigins: string[];
  allowedHeaders?: string[];
  exposeHeaders?: string[];
  maxAgeSeconds?: number;
}
export const BucketCorsRule = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    allowedMethods: BucketCorsAllowedMethods,
    allowedOrigins: BucketCorsAllowedOrigins,
    allowedHeaders: S.optional(BucketCorsAllowedHeaders),
    exposeHeaders: S.optional(BucketCorsExposeHeaders),
    maxAgeSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "BucketCorsRule",
}) as any as S.Schema<BucketCorsRule>;
export type BucketCorsRules = BucketCorsRule[];
export const BucketCorsRules = S.Array(BucketCorsRule);
export interface Session {
  name?: string;
  url?: string | redacted.Redacted<string>;
  isPrimary?: boolean;
}
export const Session = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    url: S.optional(SensitiveString),
    isPrimary: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Session" }) as any as S.Schema<Session>;
export type Sessions = Session[];
export const Sessions = S.Array(Session);
export type AttachedDiskMap = { [key: string]: DiskMap[] };
export const AttachedDiskMap = S.Record({ key: S.String, value: DiskMapList });
export interface Blueprint {
  blueprintId?: string;
  name?: string;
  group?: string;
  type?: BlueprintType;
  description?: string;
  isActive?: boolean;
  minPower?: number;
  version?: string;
  versionCode?: string;
  productUrl?: string;
  licenseUrl?: string;
  platform?: InstancePlatform;
  appCategory?: AppCategory;
}
export const Blueprint = S.suspend(() =>
  S.Struct({
    blueprintId: S.optional(S.String),
    name: S.optional(S.String),
    group: S.optional(S.String),
    type: S.optional(BlueprintType),
    description: S.optional(S.String),
    isActive: S.optional(S.Boolean),
    minPower: S.optional(S.Number),
    version: S.optional(S.String),
    versionCode: S.optional(S.String),
    productUrl: S.optional(S.String),
    licenseUrl: S.optional(S.String),
    platform: S.optional(InstancePlatform),
    appCategory: S.optional(AppCategory),
  }),
).annotations({ identifier: "Blueprint" }) as any as S.Schema<Blueprint>;
export type BlueprintList = Blueprint[];
export const BlueprintList = S.Array(Blueprint);
export interface BucketBundle {
  bundleId?: string;
  name?: string;
  price?: number;
  storagePerMonthInGb?: number;
  transferPerMonthInGb?: number;
  isActive?: boolean;
}
export const BucketBundle = S.suspend(() =>
  S.Struct({
    bundleId: S.optional(S.String),
    name: S.optional(S.String),
    price: S.optional(S.Number),
    storagePerMonthInGb: S.optional(S.Number),
    transferPerMonthInGb: S.optional(S.Number),
    isActive: S.optional(S.Boolean),
  }),
).annotations({ identifier: "BucketBundle" }) as any as S.Schema<BucketBundle>;
export type BucketBundleList = BucketBundle[];
export const BucketBundleList = S.Array(BucketBundle);
export interface AccountLevelBpaSync {
  status?: AccountLevelBpaSyncStatus;
  lastSyncedAt?: Date;
  message?: BPAStatusMessage;
  bpaImpactsLightsail?: boolean;
}
export const AccountLevelBpaSync = S.suspend(() =>
  S.Struct({
    status: S.optional(AccountLevelBpaSyncStatus),
    lastSyncedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    message: S.optional(BPAStatusMessage),
    bpaImpactsLightsail: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AccountLevelBpaSync",
}) as any as S.Schema<AccountLevelBpaSync>;
export interface Bundle {
  price?: number;
  cpuCount?: number;
  diskSizeInGb?: number;
  bundleId?: string;
  instanceType?: string;
  isActive?: boolean;
  name?: string;
  power?: number;
  ramSizeInGb?: number;
  transferPerMonthInGb?: number;
  supportedPlatforms?: InstancePlatform[];
  supportedAppCategories?: AppCategory[];
  publicIpv4AddressCount?: number;
}
export const Bundle = S.suspend(() =>
  S.Struct({
    price: S.optional(S.Number),
    cpuCount: S.optional(S.Number),
    diskSizeInGb: S.optional(S.Number),
    bundleId: S.optional(S.String),
    instanceType: S.optional(S.String),
    isActive: S.optional(S.Boolean),
    name: S.optional(S.String),
    power: S.optional(S.Number),
    ramSizeInGb: S.optional(S.Number),
    transferPerMonthInGb: S.optional(S.Number),
    supportedPlatforms: S.optional(InstancePlatformList),
    supportedAppCategories: S.optional(AppCategoryList),
    publicIpv4AddressCount: S.optional(S.Number),
  }),
).annotations({ identifier: "Bundle" }) as any as S.Schema<Bundle>;
export type BundleList = Bundle[];
export const BundleList = S.Array(Bundle);
export interface ContactMethod {
  contactEndpoint?: string;
  status?: ContactMethodStatus;
  protocol?: ContactProtocol;
  name?: string;
  arn?: string;
  createdAt?: Date;
  location?: ResourceLocation;
  resourceType?: ResourceType;
  supportCode?: string;
}
export const ContactMethod = S.suspend(() =>
  S.Struct({
    contactEndpoint: S.optional(S.String),
    status: S.optional(ContactMethodStatus),
    protocol: S.optional(ContactProtocol),
    name: S.optional(S.String),
    arn: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    location: S.optional(ResourceLocation),
    resourceType: S.optional(ResourceType),
    supportCode: S.optional(S.String),
  }),
).annotations({
  identifier: "ContactMethod",
}) as any as S.Schema<ContactMethod>;
export type ContactMethodsList = ContactMethod[];
export const ContactMethodsList = S.Array(ContactMethod);
export type ContainerImageList = ContainerImage[];
export const ContainerImageList = S.Array(ContainerImage);
export interface ContainerServiceLogEvent {
  createdAt?: Date;
  message?: string;
}
export const ContainerServiceLogEvent = S.suspend(() =>
  S.Struct({
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "ContainerServiceLogEvent",
}) as any as S.Schema<ContainerServiceLogEvent>;
export type ContainerServiceLogEventList = ContainerServiceLogEvent[];
export const ContainerServiceLogEventList = S.Array(ContainerServiceLogEvent);
export interface InstancePortState {
  fromPort?: number;
  toPort?: number;
  protocol?: NetworkProtocol;
  state?: PortState;
  cidrs?: string[];
  ipv6Cidrs?: string[];
  cidrListAliases?: string[];
}
export const InstancePortState = S.suspend(() =>
  S.Struct({
    fromPort: S.optional(S.Number),
    toPort: S.optional(S.Number),
    protocol: S.optional(NetworkProtocol),
    state: S.optional(PortState),
    cidrs: S.optional(StringList),
    ipv6Cidrs: S.optional(StringList),
    cidrListAliases: S.optional(StringList),
  }),
).annotations({
  identifier: "InstancePortState",
}) as any as S.Schema<InstancePortState>;
export type InstancePortStateList = InstancePortState[];
export const InstancePortStateList = S.Array(InstancePortState);
export interface LoadBalancerTlsPolicy {
  name?: string;
  isDefault?: boolean;
  description?: string;
  protocols?: string[];
  ciphers?: string[];
}
export const LoadBalancerTlsPolicy = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    isDefault: S.optional(S.Boolean),
    description: S.optional(S.String),
    protocols: S.optional(StringList),
    ciphers: S.optional(StringList),
  }),
).annotations({
  identifier: "LoadBalancerTlsPolicy",
}) as any as S.Schema<LoadBalancerTlsPolicy>;
export type LoadBalancerTlsPolicyList = LoadBalancerTlsPolicy[];
export const LoadBalancerTlsPolicyList = S.Array(LoadBalancerTlsPolicy);
export interface RelationalDatabaseBlueprint {
  blueprintId?: string;
  engine?: RelationalDatabaseEngine;
  engineVersion?: string;
  engineDescription?: string;
  engineVersionDescription?: string;
  isEngineDefault?: boolean;
}
export const RelationalDatabaseBlueprint = S.suspend(() =>
  S.Struct({
    blueprintId: S.optional(S.String),
    engine: S.optional(RelationalDatabaseEngine),
    engineVersion: S.optional(S.String),
    engineDescription: S.optional(S.String),
    engineVersionDescription: S.optional(S.String),
    isEngineDefault: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "RelationalDatabaseBlueprint",
}) as any as S.Schema<RelationalDatabaseBlueprint>;
export type RelationalDatabaseBlueprintList = RelationalDatabaseBlueprint[];
export const RelationalDatabaseBlueprintList = S.Array(
  RelationalDatabaseBlueprint,
);
export interface RelationalDatabaseBundle {
  bundleId?: string;
  name?: string;
  price?: number;
  ramSizeInGb?: number;
  diskSizeInGb?: number;
  transferPerMonthInGb?: number;
  cpuCount?: number;
  isEncrypted?: boolean;
  isActive?: boolean;
}
export const RelationalDatabaseBundle = S.suspend(() =>
  S.Struct({
    bundleId: S.optional(S.String),
    name: S.optional(S.String),
    price: S.optional(S.Number),
    ramSizeInGb: S.optional(S.Number),
    diskSizeInGb: S.optional(S.Number),
    transferPerMonthInGb: S.optional(S.Number),
    cpuCount: S.optional(S.Number),
    isEncrypted: S.optional(S.Boolean),
    isActive: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "RelationalDatabaseBundle",
}) as any as S.Schema<RelationalDatabaseBundle>;
export type RelationalDatabaseBundleList = RelationalDatabaseBundle[];
export const RelationalDatabaseBundleList = S.Array(RelationalDatabaseBundle);
export interface RelationalDatabaseEvent {
  resource?: string;
  createdAt?: Date;
  message?: string;
  eventCategories?: string[];
}
export const RelationalDatabaseEvent = S.suspend(() =>
  S.Struct({
    resource: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    message: S.optional(S.String),
    eventCategories: S.optional(StringList),
  }),
).annotations({
  identifier: "RelationalDatabaseEvent",
}) as any as S.Schema<RelationalDatabaseEvent>;
export type RelationalDatabaseEventList = RelationalDatabaseEvent[];
export const RelationalDatabaseEventList = S.Array(RelationalDatabaseEvent);
export interface LogEvent {
  createdAt?: Date;
  message?: string;
}
export const LogEvent = S.suspend(() =>
  S.Struct({
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    message: S.optional(S.String),
  }),
).annotations({ identifier: "LogEvent" }) as any as S.Schema<LogEvent>;
export type LogEventList = LogEvent[];
export const LogEventList = S.Array(LogEvent);
export interface BucketCorsConfig {
  rules?: BucketCorsRule[];
}
export const BucketCorsConfig = S.suspend(() =>
  S.Struct({ rules: S.optional(BucketCorsRules) }),
).annotations({
  identifier: "BucketCorsConfig",
}) as any as S.Schema<BucketCorsConfig>;
export type CloudFormationStackRecordSourceType = "ExportSnapshotRecord";
export const CloudFormationStackRecordSourceType = S.Literal(
  "ExportSnapshotRecord",
);
export type ExportSnapshotRecordSourceType =
  | "InstanceSnapshot"
  | "DiskSnapshot";
export const ExportSnapshotRecordSourceType = S.Literal(
  "InstanceSnapshot",
  "DiskSnapshot",
);
export type LoadBalancerTlsCertificateDomainStatus =
  | "PENDING_VALIDATION"
  | "FAILED"
  | "SUCCESS";
export const LoadBalancerTlsCertificateDomainStatus = S.Literal(
  "PENDING_VALIDATION",
  "FAILED",
  "SUCCESS",
);
export type LoadBalancerTlsCertificateRenewalStatus =
  | "PENDING_AUTO_RENEWAL"
  | "PENDING_VALIDATION"
  | "SUCCESS"
  | "FAILED";
export const LoadBalancerTlsCertificateRenewalStatus = S.Literal(
  "PENDING_AUTO_RENEWAL",
  "PENDING_VALIDATION",
  "SUCCESS",
  "FAILED",
);
export interface CloseInstancePublicPortsResult {
  operation?: Operation;
}
export const CloseInstancePublicPortsResult = S.suspend(() =>
  S.Struct({ operation: S.optional(Operation) }),
).annotations({
  identifier: "CloseInstancePublicPortsResult",
}) as any as S.Schema<CloseInstancePublicPortsResult>;
export interface ResourceReceivingAccess {
  name?: string;
  resourceType?: string;
}
export const ResourceReceivingAccess = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), resourceType: S.optional(S.String) }),
).annotations({
  identifier: "ResourceReceivingAccess",
}) as any as S.Schema<ResourceReceivingAccess>;
export type AccessReceiverList = ResourceReceivingAccess[];
export const AccessReceiverList = S.Array(ResourceReceivingAccess);
export interface BucketState {
  code?: string;
  message?: string;
}
export const BucketState = S.suspend(() =>
  S.Struct({ code: S.optional(S.String), message: S.optional(S.String) }),
).annotations({ identifier: "BucketState" }) as any as S.Schema<BucketState>;
export interface Bucket {
  resourceType?: string;
  accessRules?: AccessRules;
  arn?: string;
  bundleId?: string;
  createdAt?: Date;
  url?: string;
  location?: ResourceLocation;
  name?: string;
  supportCode?: string;
  tags?: Tag[];
  objectVersioning?: string;
  ableToUpdateBundle?: boolean;
  readonlyAccessAccounts?: string[];
  resourcesReceivingAccess?: ResourceReceivingAccess[];
  state?: BucketState;
  accessLogConfig?: BucketAccessLogConfig;
  cors?: BucketCorsConfig;
}
export const Bucket = S.suspend(() =>
  S.Struct({
    resourceType: S.optional(S.String),
    accessRules: S.optional(AccessRules),
    arn: S.optional(S.String),
    bundleId: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    url: S.optional(S.String),
    location: S.optional(ResourceLocation),
    name: S.optional(S.String),
    supportCode: S.optional(S.String),
    tags: S.optional(TagList),
    objectVersioning: S.optional(S.String),
    ableToUpdateBundle: S.optional(S.Boolean),
    readonlyAccessAccounts: S.optional(PartnerIdList),
    resourcesReceivingAccess: S.optional(AccessReceiverList),
    state: S.optional(BucketState),
    accessLogConfig: S.optional(BucketAccessLogConfig),
    cors: S.optional(BucketCorsConfig),
  }),
).annotations({ identifier: "Bucket" }) as any as S.Schema<Bucket>;
export interface CreateBucketResult {
  bucket?: Bucket;
  operations?: Operation[];
}
export const CreateBucketResult = S.suspend(() =>
  S.Struct({
    bucket: S.optional(Bucket),
    operations: S.optional(OperationList),
  }),
).annotations({
  identifier: "CreateBucketResult",
}) as any as S.Schema<CreateBucketResult>;
export interface CreateCloudFormationStackResult {
  operations?: Operation[];
}
export const CreateCloudFormationStackResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "CreateCloudFormationStackResult",
}) as any as S.Schema<CreateCloudFormationStackResult>;
export interface CreateContainerServiceRequest {
  serviceName: string;
  power: ContainerServicePowerName;
  scale: number;
  tags?: Tag[];
  publicDomainNames?: { [key: string]: string[] };
  deployment?: ContainerServiceDeploymentRequest;
  privateRegistryAccess?: PrivateRegistryAccessRequest;
}
export const CreateContainerServiceRequest = S.suspend(() =>
  S.Struct({
    serviceName: S.String,
    power: ContainerServicePowerName,
    scale: S.Number,
    tags: S.optional(TagList),
    publicDomainNames: S.optional(ContainerServicePublicDomains),
    deployment: S.optional(ContainerServiceDeploymentRequest),
    privateRegistryAccess: S.optional(PrivateRegistryAccessRequest),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/container-services" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateContainerServiceRequest",
}) as any as S.Schema<CreateContainerServiceRequest>;
export interface CreateDiskRequest {
  diskName: string;
  availabilityZone: string;
  sizeInGb: number;
  tags?: Tag[];
  addOns?: AddOnRequest[];
}
export const CreateDiskRequest = S.suspend(() =>
  S.Struct({
    diskName: S.String,
    availabilityZone: S.String,
    sizeInGb: S.Number,
    tags: S.optional(TagList),
    addOns: S.optional(AddOnRequestList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/CreateDisk" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDiskRequest",
}) as any as S.Schema<CreateDiskRequest>;
export interface CreateDistributionRequest {
  distributionName: string;
  origin: InputOrigin;
  defaultCacheBehavior: CacheBehavior;
  cacheBehaviorSettings?: CacheSettings;
  cacheBehaviors?: CacheBehaviorPerPath[];
  bundleId: string;
  ipAddressType?: IpAddressType;
  tags?: Tag[];
  certificateName?: string;
  viewerMinimumTlsProtocolVersion?: ViewerMinimumTlsProtocolVersionEnum;
}
export const CreateDistributionRequest = S.suspend(() =>
  S.Struct({
    distributionName: S.String,
    origin: InputOrigin,
    defaultCacheBehavior: CacheBehavior,
    cacheBehaviorSettings: S.optional(CacheSettings),
    cacheBehaviors: S.optional(CacheBehaviorList),
    bundleId: S.String,
    ipAddressType: S.optional(IpAddressType),
    tags: S.optional(TagList),
    certificateName: S.optional(S.String),
    viewerMinimumTlsProtocolVersion: S.optional(
      ViewerMinimumTlsProtocolVersionEnum,
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/CreateDistribution" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDistributionRequest",
}) as any as S.Schema<CreateDistributionRequest>;
export interface CreateDomainEntryRequest {
  domainName: string;
  domainEntry: DomainEntry;
}
export const CreateDomainEntryRequest = S.suspend(() =>
  S.Struct({ domainName: S.String, domainEntry: DomainEntry }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/CreateDomainEntry" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDomainEntryRequest",
}) as any as S.Schema<CreateDomainEntryRequest>;
export interface CreateGUISessionAccessDetailsResult {
  resourceName?: string;
  status?: Status;
  percentageComplete?: number;
  failureReason?: string;
  sessions?: Session[];
}
export const CreateGUISessionAccessDetailsResult = S.suspend(() =>
  S.Struct({
    resourceName: S.optional(S.String),
    status: S.optional(Status),
    percentageComplete: S.optional(S.Number),
    failureReason: S.optional(S.String),
    sessions: S.optional(Sessions),
  }),
).annotations({
  identifier: "CreateGUISessionAccessDetailsResult",
}) as any as S.Schema<CreateGUISessionAccessDetailsResult>;
export interface CreateInstancesFromSnapshotRequest {
  instanceNames: string[];
  attachedDiskMapping?: { [key: string]: DiskMap[] };
  availabilityZone: string;
  instanceSnapshotName?: string;
  bundleId: string;
  userData?: string;
  keyPairName?: string;
  tags?: Tag[];
  addOns?: AddOnRequest[];
  ipAddressType?: IpAddressType;
  sourceInstanceName?: string;
  restoreDate?: string;
  useLatestRestorableAutoSnapshot?: boolean;
}
export const CreateInstancesFromSnapshotRequest = S.suspend(() =>
  S.Struct({
    instanceNames: StringList,
    attachedDiskMapping: S.optional(AttachedDiskMap),
    availabilityZone: S.String,
    instanceSnapshotName: S.optional(S.String),
    bundleId: S.String,
    userData: S.optional(S.String),
    keyPairName: S.optional(S.String),
    tags: S.optional(TagList),
    addOns: S.optional(AddOnRequestList),
    ipAddressType: S.optional(IpAddressType),
    sourceInstanceName: S.optional(S.String),
    restoreDate: S.optional(S.String),
    useLatestRestorableAutoSnapshot: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/CreateInstancesFromSnapshot",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateInstancesFromSnapshotRequest",
}) as any as S.Schema<CreateInstancesFromSnapshotRequest>;
export interface CreateKeyPairResult {
  keyPair?: KeyPair;
  publicKeyBase64?: string;
  privateKeyBase64?: string;
  operation?: Operation;
}
export const CreateKeyPairResult = S.suspend(() =>
  S.Struct({
    keyPair: S.optional(KeyPair),
    publicKeyBase64: S.optional(S.String),
    privateKeyBase64: S.optional(S.String),
    operation: S.optional(Operation),
  }),
).annotations({
  identifier: "CreateKeyPairResult",
}) as any as S.Schema<CreateKeyPairResult>;
export interface GetBlueprintsResult {
  blueprints?: Blueprint[];
  nextPageToken?: string;
}
export const GetBlueprintsResult = S.suspend(() =>
  S.Struct({
    blueprints: S.optional(BlueprintList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetBlueprintsResult",
}) as any as S.Schema<GetBlueprintsResult>;
export interface GetBucketBundlesResult {
  bundles?: BucketBundle[];
}
export const GetBucketBundlesResult = S.suspend(() =>
  S.Struct({ bundles: S.optional(BucketBundleList) }),
).annotations({
  identifier: "GetBucketBundlesResult",
}) as any as S.Schema<GetBucketBundlesResult>;
export interface GetBucketMetricDataResult {
  metricName?: BucketMetricName;
  metricData?: MetricDatapoint[];
}
export const GetBucketMetricDataResult = S.suspend(() =>
  S.Struct({
    metricName: S.optional(BucketMetricName),
    metricData: S.optional(MetricDatapointList),
  }),
).annotations({
  identifier: "GetBucketMetricDataResult",
}) as any as S.Schema<GetBucketMetricDataResult>;
export interface GetBundlesResult {
  bundles?: Bundle[];
  nextPageToken?: string;
}
export const GetBundlesResult = S.suspend(() =>
  S.Struct({
    bundles: S.optional(BundleList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetBundlesResult",
}) as any as S.Schema<GetBundlesResult>;
export interface GetContactMethodsResult {
  contactMethods?: ContactMethod[];
}
export const GetContactMethodsResult = S.suspend(() =>
  S.Struct({ contactMethods: S.optional(ContactMethodsList) }),
).annotations({
  identifier: "GetContactMethodsResult",
}) as any as S.Schema<GetContactMethodsResult>;
export interface GetContainerImagesResult {
  containerImages?: ContainerImage[];
}
export const GetContainerImagesResult = S.suspend(() =>
  S.Struct({ containerImages: S.optional(ContainerImageList) }),
).annotations({
  identifier: "GetContainerImagesResult",
}) as any as S.Schema<GetContainerImagesResult>;
export interface GetContainerLogResult {
  logEvents?: ContainerServiceLogEvent[];
  nextPageToken?: string;
}
export const GetContainerLogResult = S.suspend(() =>
  S.Struct({
    logEvents: S.optional(ContainerServiceLogEventList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetContainerLogResult",
}) as any as S.Schema<GetContainerLogResult>;
export interface GetDiskSnapshotResult {
  diskSnapshot?: DiskSnapshot;
}
export const GetDiskSnapshotResult = S.suspend(() =>
  S.Struct({ diskSnapshot: S.optional(DiskSnapshot) }),
).annotations({
  identifier: "GetDiskSnapshotResult",
}) as any as S.Schema<GetDiskSnapshotResult>;
export interface GetInstancePortStatesResult {
  portStates?: InstancePortState[];
}
export const GetInstancePortStatesResult = S.suspend(() =>
  S.Struct({ portStates: S.optional(InstancePortStateList) }),
).annotations({
  identifier: "GetInstancePortStatesResult",
}) as any as S.Schema<GetInstancePortStatesResult>;
export interface GetInstanceSnapshotResult {
  instanceSnapshot?: InstanceSnapshot;
}
export const GetInstanceSnapshotResult = S.suspend(() =>
  S.Struct({ instanceSnapshot: S.optional(InstanceSnapshot) }),
).annotations({
  identifier: "GetInstanceSnapshotResult",
}) as any as S.Schema<GetInstanceSnapshotResult>;
export interface GetInstanceStateResult {
  state?: InstanceState;
}
export const GetInstanceStateResult = S.suspend(() =>
  S.Struct({ state: S.optional(InstanceState) }),
).annotations({
  identifier: "GetInstanceStateResult",
}) as any as S.Schema<GetInstanceStateResult>;
export interface GetLoadBalancerTlsPoliciesResult {
  tlsPolicies?: LoadBalancerTlsPolicy[];
  nextPageToken?: string;
}
export const GetLoadBalancerTlsPoliciesResult = S.suspend(() =>
  S.Struct({
    tlsPolicies: S.optional(LoadBalancerTlsPolicyList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetLoadBalancerTlsPoliciesResult",
}) as any as S.Schema<GetLoadBalancerTlsPoliciesResult>;
export interface GetRelationalDatabaseBlueprintsResult {
  blueprints?: RelationalDatabaseBlueprint[];
  nextPageToken?: string;
}
export const GetRelationalDatabaseBlueprintsResult = S.suspend(() =>
  S.Struct({
    blueprints: S.optional(RelationalDatabaseBlueprintList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetRelationalDatabaseBlueprintsResult",
}) as any as S.Schema<GetRelationalDatabaseBlueprintsResult>;
export interface GetRelationalDatabaseBundlesResult {
  bundles?: RelationalDatabaseBundle[];
  nextPageToken?: string;
}
export const GetRelationalDatabaseBundlesResult = S.suspend(() =>
  S.Struct({
    bundles: S.optional(RelationalDatabaseBundleList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetRelationalDatabaseBundlesResult",
}) as any as S.Schema<GetRelationalDatabaseBundlesResult>;
export interface GetRelationalDatabaseEventsResult {
  relationalDatabaseEvents?: RelationalDatabaseEvent[];
  nextPageToken?: string;
}
export const GetRelationalDatabaseEventsResult = S.suspend(() =>
  S.Struct({
    relationalDatabaseEvents: S.optional(RelationalDatabaseEventList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetRelationalDatabaseEventsResult",
}) as any as S.Schema<GetRelationalDatabaseEventsResult>;
export interface GetRelationalDatabaseLogEventsResult {
  resourceLogEvents?: LogEvent[];
  nextBackwardToken?: string;
  nextForwardToken?: string;
}
export const GetRelationalDatabaseLogEventsResult = S.suspend(() =>
  S.Struct({
    resourceLogEvents: S.optional(LogEventList),
    nextBackwardToken: S.optional(S.String),
    nextForwardToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetRelationalDatabaseLogEventsResult",
}) as any as S.Schema<GetRelationalDatabaseLogEventsResult>;
export interface GetRelationalDatabaseSnapshotResult {
  relationalDatabaseSnapshot?: RelationalDatabaseSnapshot;
}
export const GetRelationalDatabaseSnapshotResult = S.suspend(() =>
  S.Struct({
    relationalDatabaseSnapshot: S.optional(RelationalDatabaseSnapshot),
  }),
).annotations({
  identifier: "GetRelationalDatabaseSnapshotResult",
}) as any as S.Schema<GetRelationalDatabaseSnapshotResult>;
export interface GetStaticIpResult {
  staticIp?: StaticIp;
}
export const GetStaticIpResult = S.suspend(() =>
  S.Struct({ staticIp: S.optional(StaticIp) }),
).annotations({
  identifier: "GetStaticIpResult",
}) as any as S.Schema<GetStaticIpResult>;
export interface PeerVpcResult {
  operation?: Operation;
}
export const PeerVpcResult = S.suspend(() =>
  S.Struct({ operation: S.optional(Operation) }),
).annotations({
  identifier: "PeerVpcResult",
}) as any as S.Schema<PeerVpcResult>;
export interface UpdateBucketRequest {
  bucketName: string;
  accessRules?: AccessRules;
  versioning?: string;
  readonlyAccessAccounts?: string[];
  accessLogConfig?: BucketAccessLogConfig;
  cors?: BucketCorsConfig;
}
export const UpdateBucketRequest = S.suspend(() =>
  S.Struct({
    bucketName: S.String,
    accessRules: S.optional(AccessRules),
    versioning: S.optional(S.String),
    readonlyAccessAccounts: S.optional(PartnerIdList),
    accessLogConfig: S.optional(BucketAccessLogConfig),
    cors: S.optional(BucketCorsConfig),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ls/api/2016-11-28/UpdateBucket" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBucketRequest",
}) as any as S.Schema<UpdateBucketRequest>;
export interface UpdateRelationalDatabaseParametersResult {
  operations?: Operation[];
}
export const UpdateRelationalDatabaseParametersResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "UpdateRelationalDatabaseParametersResult",
}) as any as S.Schema<UpdateRelationalDatabaseParametersResult>;
export interface MonitoredResourceInfo {
  arn?: string;
  name?: string;
  resourceType?: ResourceType;
}
export const MonitoredResourceInfo = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(S.String),
    resourceType: S.optional(ResourceType),
  }),
).annotations({
  identifier: "MonitoredResourceInfo",
}) as any as S.Schema<MonitoredResourceInfo>;
export interface AttachedDisk {
  path?: string;
  sizeInGb?: number;
}
export const AttachedDisk = S.suspend(() =>
  S.Struct({ path: S.optional(S.String), sizeInGb: S.optional(S.Number) }),
).annotations({ identifier: "AttachedDisk" }) as any as S.Schema<AttachedDisk>;
export type AttachedDiskList = AttachedDisk[];
export const AttachedDiskList = S.Array(AttachedDisk);
export interface CloudFormationStackRecordSourceInfo {
  resourceType?: CloudFormationStackRecordSourceType;
  name?: string;
  arn?: string;
}
export const CloudFormationStackRecordSourceInfo = S.suspend(() =>
  S.Struct({
    resourceType: S.optional(CloudFormationStackRecordSourceType),
    name: S.optional(S.String),
    arn: S.optional(S.String),
  }),
).annotations({
  identifier: "CloudFormationStackRecordSourceInfo",
}) as any as S.Schema<CloudFormationStackRecordSourceInfo>;
export type CloudFormationStackRecordSourceInfoList =
  CloudFormationStackRecordSourceInfo[];
export const CloudFormationStackRecordSourceInfoList = S.Array(
  CloudFormationStackRecordSourceInfo,
);
export interface DestinationInfo {
  id?: string;
  service?: string;
}
export const DestinationInfo = S.suspend(() =>
  S.Struct({ id: S.optional(S.String), service: S.optional(S.String) }),
).annotations({
  identifier: "DestinationInfo",
}) as any as S.Schema<DestinationInfo>;
export interface Origin {
  name?: string;
  resourceType?: ResourceType;
  regionName?: RegionName;
  protocolPolicy?: OriginProtocolPolicyEnum;
  responseTimeout?: number;
}
export const Origin = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    resourceType: S.optional(ResourceType),
    regionName: S.optional(RegionName),
    protocolPolicy: S.optional(OriginProtocolPolicyEnum),
    responseTimeout: S.optional(S.Number),
  }),
).annotations({ identifier: "Origin" }) as any as S.Schema<Origin>;
export interface PasswordData {
  ciphertext?: string;
  keyPairName?: string;
}
export const PasswordData = S.suspend(() =>
  S.Struct({
    ciphertext: S.optional(S.String),
    keyPairName: S.optional(S.String),
  }),
).annotations({ identifier: "PasswordData" }) as any as S.Schema<PasswordData>;
export interface HostKeyAttributes {
  algorithm?: string;
  publicKey?: string;
  witnessedAt?: Date;
  fingerprintSHA1?: string;
  fingerprintSHA256?: string;
  notValidBefore?: Date;
  notValidAfter?: Date;
}
export const HostKeyAttributes = S.suspend(() =>
  S.Struct({
    algorithm: S.optional(S.String),
    publicKey: S.optional(S.String),
    witnessedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    fingerprintSHA1: S.optional(S.String),
    fingerprintSHA256: S.optional(S.String),
    notValidBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    notValidAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "HostKeyAttributes",
}) as any as S.Schema<HostKeyAttributes>;
export type HostKeysList = HostKeyAttributes[];
export const HostKeysList = S.Array(HostKeyAttributes);
export interface AvailabilityZone {
  zoneName?: string;
  state?: string;
}
export const AvailabilityZone = S.suspend(() =>
  S.Struct({ zoneName: S.optional(S.String), state: S.optional(S.String) }),
).annotations({
  identifier: "AvailabilityZone",
}) as any as S.Schema<AvailabilityZone>;
export type AvailabilityZoneList = AvailabilityZone[];
export const AvailabilityZoneList = S.Array(AvailabilityZone);
export interface SetupRequest {
  instanceName?: string;
  domainNames?: string[];
  certificateProvider?: CertificateProvider;
}
export const SetupRequest = S.suspend(() =>
  S.Struct({
    instanceName: S.optional(S.String),
    domainNames: S.optional(SetupDomainNameList),
    certificateProvider: S.optional(CertificateProvider),
  }),
).annotations({ identifier: "SetupRequest" }) as any as S.Schema<SetupRequest>;
export interface SetupHistoryResource {
  name?: string;
  arn?: string;
  createdAt?: Date;
  location?: ResourceLocation;
  resourceType?: ResourceType;
}
export const SetupHistoryResource = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    location: S.optional(ResourceLocation),
    resourceType: S.optional(ResourceType),
  }),
).annotations({
  identifier: "SetupHistoryResource",
}) as any as S.Schema<SetupHistoryResource>;
export interface SetupExecutionDetails {
  command?: string;
  dateTime?: Date;
  name?: string;
  status?: SetupStatus;
  standardError?: string;
  standardOutput?: string;
  version?: string;
}
export const SetupExecutionDetails = S.suspend(() =>
  S.Struct({
    command: S.optional(S.String),
    dateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    name: S.optional(S.String),
    status: S.optional(SetupStatus),
    standardError: S.optional(S.String),
    standardOutput: S.optional(S.String),
    version: S.optional(S.String),
  }),
).annotations({
  identifier: "SetupExecutionDetails",
}) as any as S.Schema<SetupExecutionDetails>;
export type SetupExecutionDetailsList = SetupExecutionDetails[];
export const SetupExecutionDetailsList = S.Array(SetupExecutionDetails);
export type PricingUnit = "GB" | "Hrs" | "GB-Mo" | "Bundles" | "Queries";
export const PricingUnit = S.Literal(
  "GB",
  "Hrs",
  "GB-Mo",
  "Bundles",
  "Queries",
);
export type Currency = "USD";
export const Currency = S.Literal("USD");
export type LoadBalancerTlsCertificateDnsRecordCreationStateCode =
  | "SUCCEEDED"
  | "STARTED"
  | "FAILED";
export const LoadBalancerTlsCertificateDnsRecordCreationStateCode = S.Literal(
  "SUCCEEDED",
  "STARTED",
  "FAILED",
);
export interface Alarm {
  name?: string;
  arn?: string;
  createdAt?: Date;
  location?: ResourceLocation;
  resourceType?: ResourceType;
  supportCode?: string;
  monitoredResourceInfo?: MonitoredResourceInfo;
  comparisonOperator?: ComparisonOperator;
  evaluationPeriods?: number;
  period?: number;
  threshold?: number;
  datapointsToAlarm?: number;
  treatMissingData?: TreatMissingData;
  statistic?: MetricStatistic;
  metricName?: MetricName;
  state?: AlarmState;
  unit?: MetricUnit;
  contactProtocols?: ContactProtocol[];
  notificationTriggers?: AlarmState[];
  notificationEnabled?: boolean;
}
export const Alarm = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    location: S.optional(ResourceLocation),
    resourceType: S.optional(ResourceType),
    supportCode: S.optional(S.String),
    monitoredResourceInfo: S.optional(MonitoredResourceInfo),
    comparisonOperator: S.optional(ComparisonOperator),
    evaluationPeriods: S.optional(S.Number),
    period: S.optional(S.Number),
    threshold: S.optional(S.Number),
    datapointsToAlarm: S.optional(S.Number),
    treatMissingData: S.optional(TreatMissingData),
    statistic: S.optional(MetricStatistic),
    metricName: S.optional(MetricName),
    state: S.optional(AlarmState),
    unit: S.optional(MetricUnit),
    contactProtocols: S.optional(ContactProtocolsList),
    notificationTriggers: S.optional(NotificationTriggerList),
    notificationEnabled: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Alarm" }) as any as S.Schema<Alarm>;
export type AlarmsList = Alarm[];
export const AlarmsList = S.Array(Alarm);
export interface AutoSnapshotDetails {
  date?: string;
  createdAt?: Date;
  status?: AutoSnapshotStatus;
  fromAttachedDisks?: AttachedDisk[];
}
export const AutoSnapshotDetails = S.suspend(() =>
  S.Struct({
    date: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(AutoSnapshotStatus),
    fromAttachedDisks: S.optional(AttachedDiskList),
  }),
).annotations({
  identifier: "AutoSnapshotDetails",
}) as any as S.Schema<AutoSnapshotDetails>;
export type AutoSnapshotDetailsList = AutoSnapshotDetails[];
export const AutoSnapshotDetailsList = S.Array(AutoSnapshotDetails);
export type BucketList = Bucket[];
export const BucketList = S.Array(Bucket);
export interface CloudFormationStackRecord {
  name?: string;
  arn?: string;
  createdAt?: Date;
  location?: ResourceLocation;
  resourceType?: ResourceType;
  state?: RecordState;
  sourceInfo?: CloudFormationStackRecordSourceInfo[];
  destinationInfo?: DestinationInfo;
}
export const CloudFormationStackRecord = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    location: S.optional(ResourceLocation),
    resourceType: S.optional(ResourceType),
    state: S.optional(RecordState),
    sourceInfo: S.optional(CloudFormationStackRecordSourceInfoList),
    destinationInfo: S.optional(DestinationInfo),
  }),
).annotations({
  identifier: "CloudFormationStackRecord",
}) as any as S.Schema<CloudFormationStackRecord>;
export type CloudFormationStackRecordList = CloudFormationStackRecord[];
export const CloudFormationStackRecordList = S.Array(CloudFormationStackRecord);
export type ContainerServiceDeploymentList = ContainerServiceDeployment[];
export const ContainerServiceDeploymentList = S.Array(
  ContainerServiceDeployment,
);
export interface LightsailDistribution {
  name?: string;
  arn?: string;
  supportCode?: string;
  createdAt?: Date;
  location?: ResourceLocation;
  resourceType?: ResourceType;
  alternativeDomainNames?: string[];
  status?: string;
  isEnabled?: boolean;
  domainName?: string;
  bundleId?: string;
  certificateName?: string;
  origin?: Origin;
  originPublicDNS?: string;
  defaultCacheBehavior?: CacheBehavior;
  cacheBehaviorSettings?: CacheSettings;
  cacheBehaviors?: CacheBehaviorPerPath[];
  ableToUpdateBundle?: boolean;
  ipAddressType?: IpAddressType;
  tags?: Tag[];
  viewerMinimumTlsProtocolVersion?: string;
}
export const LightsailDistribution = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    supportCode: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    location: S.optional(ResourceLocation),
    resourceType: S.optional(ResourceType),
    alternativeDomainNames: S.optional(StringList),
    status: S.optional(S.String),
    isEnabled: S.optional(S.Boolean),
    domainName: S.optional(S.String),
    bundleId: S.optional(S.String),
    certificateName: S.optional(S.String),
    origin: S.optional(Origin),
    originPublicDNS: S.optional(S.String),
    defaultCacheBehavior: S.optional(CacheBehavior),
    cacheBehaviorSettings: S.optional(CacheSettings),
    cacheBehaviors: S.optional(CacheBehaviorList),
    ableToUpdateBundle: S.optional(S.Boolean),
    ipAddressType: S.optional(IpAddressType),
    tags: S.optional(TagList),
    viewerMinimumTlsProtocolVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "LightsailDistribution",
}) as any as S.Schema<LightsailDistribution>;
export type DistributionList = LightsailDistribution[];
export const DistributionList = S.Array(LightsailDistribution);
export interface InstanceAccessDetails {
  certKey?: string;
  expiresAt?: Date;
  ipAddress?: string;
  ipv6Addresses?: string[];
  password?: string;
  passwordData?: PasswordData;
  privateKey?: string;
  protocol?: InstanceAccessProtocol;
  instanceName?: string;
  username?: string;
  hostKeys?: HostKeyAttributes[];
}
export const InstanceAccessDetails = S.suspend(() =>
  S.Struct({
    certKey: S.optional(S.String),
    expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ipAddress: S.optional(S.String),
    ipv6Addresses: S.optional(Ipv6AddressList),
    password: S.optional(S.String),
    passwordData: S.optional(PasswordData),
    privateKey: S.optional(S.String),
    protocol: S.optional(InstanceAccessProtocol),
    instanceName: S.optional(S.String),
    username: S.optional(S.String),
    hostKeys: S.optional(HostKeysList),
  }),
).annotations({
  identifier: "InstanceAccessDetails",
}) as any as S.Schema<InstanceAccessDetails>;
export interface Region {
  continentCode?: string;
  description?: string;
  displayName?: string;
  name?: RegionName;
  availabilityZones?: AvailabilityZone[];
  relationalDatabaseAvailabilityZones?: AvailabilityZone[];
}
export const Region = S.suspend(() =>
  S.Struct({
    continentCode: S.optional(S.String),
    description: S.optional(S.String),
    displayName: S.optional(S.String),
    name: S.optional(RegionName),
    availabilityZones: S.optional(AvailabilityZoneList),
    relationalDatabaseAvailabilityZones: S.optional(AvailabilityZoneList),
  }),
).annotations({ identifier: "Region" }) as any as S.Schema<Region>;
export type RegionList = Region[];
export const RegionList = S.Array(Region);
export interface SetupHistory {
  operationId?: string;
  request?: SetupRequest;
  resource?: SetupHistoryResource;
  executionDetails?: SetupExecutionDetails[];
  status?: SetupStatus;
}
export const SetupHistory = S.suspend(() =>
  S.Struct({
    operationId: S.optional(S.String),
    request: S.optional(SetupRequest),
    resource: S.optional(SetupHistoryResource),
    executionDetails: S.optional(SetupExecutionDetailsList),
    status: S.optional(SetupStatus),
  }),
).annotations({ identifier: "SetupHistory" }) as any as S.Schema<SetupHistory>;
export type SetupHistoryList = SetupHistory[];
export const SetupHistoryList = S.Array(SetupHistory);
export interface DiskSnapshotInfo {
  sizeInGb?: number;
}
export const DiskSnapshotInfo = S.suspend(() =>
  S.Struct({ sizeInGb: S.optional(S.Number) }),
).annotations({
  identifier: "DiskSnapshotInfo",
}) as any as S.Schema<DiskSnapshotInfo>;
export interface LoadBalancerTlsCertificateDnsRecordCreationState {
  code?: LoadBalancerTlsCertificateDnsRecordCreationStateCode;
  message?: string;
}
export const LoadBalancerTlsCertificateDnsRecordCreationState = S.suspend(() =>
  S.Struct({
    code: S.optional(LoadBalancerTlsCertificateDnsRecordCreationStateCode),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "LoadBalancerTlsCertificateDnsRecordCreationState",
}) as any as S.Schema<LoadBalancerTlsCertificateDnsRecordCreationState>;
export interface LoadBalancerTlsCertificateDomainValidationOption {
  domainName?: string;
  validationStatus?: LoadBalancerTlsCertificateDomainStatus;
}
export const LoadBalancerTlsCertificateDomainValidationOption = S.suspend(() =>
  S.Struct({
    domainName: S.optional(S.String),
    validationStatus: S.optional(LoadBalancerTlsCertificateDomainStatus),
  }),
).annotations({
  identifier: "LoadBalancerTlsCertificateDomainValidationOption",
}) as any as S.Schema<LoadBalancerTlsCertificateDomainValidationOption>;
export type LoadBalancerTlsCertificateDomainValidationOptionList =
  LoadBalancerTlsCertificateDomainValidationOption[];
export const LoadBalancerTlsCertificateDomainValidationOptionList = S.Array(
  LoadBalancerTlsCertificateDomainValidationOption,
);
export interface CreateBucketAccessKeyResult {
  accessKey?: AccessKey;
  operations?: Operation[];
}
export const CreateBucketAccessKeyResult = S.suspend(() =>
  S.Struct({
    accessKey: S.optional(AccessKey),
    operations: S.optional(OperationList),
  }),
).annotations({
  identifier: "CreateBucketAccessKeyResult",
}) as any as S.Schema<CreateBucketAccessKeyResult>;
export interface CreateContainerServiceResult {
  containerService?: ContainerService;
}
export const CreateContainerServiceResult = S.suspend(() =>
  S.Struct({ containerService: S.optional(ContainerService) }),
).annotations({
  identifier: "CreateContainerServiceResult",
}) as any as S.Schema<CreateContainerServiceResult>;
export interface CreateContainerServiceDeploymentRequest {
  serviceName: string;
  containers?: { [key: string]: Container };
  publicEndpoint?: EndpointRequest;
}
export const CreateContainerServiceDeploymentRequest = S.suspend(() =>
  S.Struct({
    serviceName: S.String.pipe(T.HttpLabel("serviceName")),
    containers: S.optional(ContainerMap),
    publicEndpoint: S.optional(EndpointRequest),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ls/api/2016-11-28/container-services/{serviceName}/deployments",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateContainerServiceDeploymentRequest",
}) as any as S.Schema<CreateContainerServiceDeploymentRequest>;
export interface CreateDiskResult {
  operations?: Operation[];
}
export const CreateDiskResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "CreateDiskResult",
}) as any as S.Schema<CreateDiskResult>;
export interface CreateDistributionResult {
  distribution?: LightsailDistribution;
  operation?: Operation;
}
export const CreateDistributionResult = S.suspend(() =>
  S.Struct({
    distribution: S.optional(LightsailDistribution),
    operation: S.optional(Operation),
  }),
).annotations({
  identifier: "CreateDistributionResult",
}) as any as S.Schema<CreateDistributionResult>;
export interface CreateDomainEntryResult {
  operation?: Operation;
}
export const CreateDomainEntryResult = S.suspend(() =>
  S.Struct({ operation: S.optional(Operation) }),
).annotations({
  identifier: "CreateDomainEntryResult",
}) as any as S.Schema<CreateDomainEntryResult>;
export interface CreateInstancesFromSnapshotResult {
  operations?: Operation[];
}
export const CreateInstancesFromSnapshotResult = S.suspend(() =>
  S.Struct({ operations: S.optional(OperationList) }),
).annotations({
  identifier: "CreateInstancesFromSnapshotResult",
}) as any as S.Schema<CreateInstancesFromSnapshotResult>;
export interface GetAlarmsResult {
  alarms?: Alarm[];
  nextPageToken?: string;
}
export const GetAlarmsResult = S.suspend(() =>
  S.Struct({
    alarms: S.optional(AlarmsList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetAlarmsResult",
}) as any as S.Schema<GetAlarmsResult>;
export interface GetAutoSnapshotsResult {
  resourceName?: string;
  resourceType?: ResourceType;
  autoSnapshots?: AutoSnapshotDetails[];
}
export const GetAutoSnapshotsResult = S.suspend(() =>
  S.Struct({
    resourceName: S.optional(S.String),
    resourceType: S.optional(ResourceType),
    autoSnapshots: S.optional(AutoSnapshotDetailsList),
  }),
).annotations({
  identifier: "GetAutoSnapshotsResult",
}) as any as S.Schema<GetAutoSnapshotsResult>;
export interface GetBucketsResult {
  buckets?: Bucket[];
  nextPageToken?: string;
  accountLevelBpaSync?: AccountLevelBpaSync;
}
export const GetBucketsResult = S.suspend(() =>
  S.Struct({
    buckets: S.optional(BucketList),
    nextPageToken: S.optional(S.String),
    accountLevelBpaSync: S.optional(AccountLevelBpaSync),
  }),
).annotations({
  identifier: "GetBucketsResult",
}) as any as S.Schema<GetBucketsResult>;
export interface GetCloudFormationStackRecordsResult {
  cloudFormationStackRecords?: CloudFormationStackRecord[];
  nextPageToken?: string;
}
export const GetCloudFormationStackRecordsResult = S.suspend(() =>
  S.Struct({
    cloudFormationStackRecords: S.optional(CloudFormationStackRecordList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetCloudFormationStackRecordsResult",
}) as any as S.Schema<GetCloudFormationStackRecordsResult>;
export interface GetContainerServiceDeploymentsResult {
  deployments?: ContainerServiceDeployment[];
}
export const GetContainerServiceDeploymentsResult = S.suspend(() =>
  S.Struct({ deployments: S.optional(ContainerServiceDeploymentList) }),
).annotations({
  identifier: "GetContainerServiceDeploymentsResult",
}) as any as S.Schema<GetContainerServiceDeploymentsResult>;
export interface GetDiskResult {
  disk?: Disk;
}
export const GetDiskResult = S.suspend(() =>
  S.Struct({ disk: S.optional(Disk) }),
).annotations({
  identifier: "GetDiskResult",
}) as any as S.Schema<GetDiskResult>;
export interface GetDistributionsResult {
  distributions?: LightsailDistribution[];
  nextPageToken?: string;
}
export const GetDistributionsResult = S.suspend(() =>
  S.Struct({
    distributions: S.optional(DistributionList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDistributionsResult",
}) as any as S.Schema<GetDistributionsResult>;
export interface GetInstanceAccessDetailsResult {
  accessDetails?: InstanceAccessDetails;
}
export const GetInstanceAccessDetailsResult = S.suspend(() =>
  S.Struct({ accessDetails: S.optional(InstanceAccessDetails) }),
).annotations({
  identifier: "GetInstanceAccessDetailsResult",
}) as any as S.Schema<GetInstanceAccessDetailsResult>;
export interface GetLoadBalancerResult {
  loadBalancer?: LoadBalancer;
}
export const GetLoadBalancerResult = S.suspend(() =>
  S.Struct({ loadBalancer: S.optional(LoadBalancer) }),
).annotations({
  identifier: "GetLoadBalancerResult",
}) as any as S.Schema<GetLoadBalancerResult>;
export interface GetRegionsResult {
  regions?: Region[];
}
export const GetRegionsResult = S.suspend(() =>
  S.Struct({ regions: S.optional(RegionList) }),
).annotations({
  identifier: "GetRegionsResult",
}) as any as S.Schema<GetRegionsResult>;
export interface GetRelationalDatabaseResult {
  relationalDatabase?: RelationalDatabase;
}
export const GetRelationalDatabaseResult = S.suspend(() =>
  S.Struct({ relationalDatabase: S.optional(RelationalDatabase) }),
).annotations({
  identifier: "GetRelationalDatabaseResult",
}) as any as S.Schema<GetRelationalDatabaseResult>;
export interface GetSetupHistoryResult {
  setupHistory?: SetupHistory[];
  nextPageToken?: string;
}
export const GetSetupHistoryResult = S.suspend(() =>
  S.Struct({
    setupHistory: S.optional(SetupHistoryList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetSetupHistoryResult",
}) as any as S.Schema<GetSetupHistoryResult>;
export interface UpdateBucketResult {
  bucket?: Bucket;
  operations?: Operation[];
}
export const UpdateBucketResult = S.suspend(() =>
  S.Struct({
    bucket: S.optional(Bucket),
    operations: S.optional(OperationList),
  }),
).annotations({
  identifier: "UpdateBucketResult",
}) as any as S.Schema<UpdateBucketResult>;
export interface LoadBalancerTlsCertificateDomainValidationRecord {
  name?: string;
  type?: string;
  value?: string;
  validationStatus?: LoadBalancerTlsCertificateDomainStatus;
  domainName?: string;
  dnsRecordCreationState?: LoadBalancerTlsCertificateDnsRecordCreationState;
}
export const LoadBalancerTlsCertificateDomainValidationRecord = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    type: S.optional(S.String),
    value: S.optional(S.String),
    validationStatus: S.optional(LoadBalancerTlsCertificateDomainStatus),
    domainName: S.optional(S.String),
    dnsRecordCreationState: S.optional(
      LoadBalancerTlsCertificateDnsRecordCreationState,
    ),
  }),
).annotations({
  identifier: "LoadBalancerTlsCertificateDomainValidationRecord",
}) as any as S.Schema<LoadBalancerTlsCertificateDomainValidationRecord>;
export type LoadBalancerTlsCertificateDomainValidationRecordList =
  LoadBalancerTlsCertificateDomainValidationRecord[];
export const LoadBalancerTlsCertificateDomainValidationRecordList = S.Array(
  LoadBalancerTlsCertificateDomainValidationRecord,
);
export interface LoadBalancerTlsCertificateRenewalSummary {
  renewalStatus?: LoadBalancerTlsCertificateRenewalStatus;
  domainValidationOptions?: LoadBalancerTlsCertificateDomainValidationOption[];
}
export const LoadBalancerTlsCertificateRenewalSummary = S.suspend(() =>
  S.Struct({
    renewalStatus: S.optional(LoadBalancerTlsCertificateRenewalStatus),
    domainValidationOptions: S.optional(
      LoadBalancerTlsCertificateDomainValidationOptionList,
    ),
  }),
).annotations({
  identifier: "LoadBalancerTlsCertificateRenewalSummary",
}) as any as S.Schema<LoadBalancerTlsCertificateRenewalSummary>;
export interface TimePeriod {
  start?: Date;
  end?: Date;
}
export const TimePeriod = S.suspend(() =>
  S.Struct({
    start: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    end: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "TimePeriod" }) as any as S.Schema<TimePeriod>;
export interface DiskInfo {
  name?: string;
  path?: string;
  sizeInGb?: number;
  isSystemDisk?: boolean;
}
export const DiskInfo = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    path: S.optional(S.String),
    sizeInGb: S.optional(S.Number),
    isSystemDisk: S.optional(S.Boolean),
  }),
).annotations({ identifier: "DiskInfo" }) as any as S.Schema<DiskInfo>;
export type DiskInfoList = DiskInfo[];
export const DiskInfoList = S.Array(DiskInfo);
export type ContainerServiceList = ContainerService[];
export const ContainerServiceList = S.Array(ContainerService);
export interface LoadBalancerTlsCertificate {
  name?: string;
  arn?: string;
  supportCode?: string;
  createdAt?: Date;
  location?: ResourceLocation;
  resourceType?: ResourceType;
  tags?: Tag[];
  loadBalancerName?: string;
  isAttached?: boolean;
  status?: LoadBalancerTlsCertificateStatus;
  domainName?: string;
  domainValidationRecords?: LoadBalancerTlsCertificateDomainValidationRecord[];
  failureReason?: LoadBalancerTlsCertificateFailureReason;
  issuedAt?: Date;
  issuer?: string;
  keyAlgorithm?: string;
  notAfter?: Date;
  notBefore?: Date;
  renewalSummary?: LoadBalancerTlsCertificateRenewalSummary;
  revocationReason?: LoadBalancerTlsCertificateRevocationReason;
  revokedAt?: Date;
  serial?: string;
  signatureAlgorithm?: string;
  subject?: string;
  subjectAlternativeNames?: string[];
}
export const LoadBalancerTlsCertificate = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    supportCode: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    location: S.optional(ResourceLocation),
    resourceType: S.optional(ResourceType),
    tags: S.optional(TagList),
    loadBalancerName: S.optional(S.String),
    isAttached: S.optional(S.Boolean),
    status: S.optional(LoadBalancerTlsCertificateStatus),
    domainName: S.optional(S.String),
    domainValidationRecords: S.optional(
      LoadBalancerTlsCertificateDomainValidationRecordList,
    ),
    failureReason: S.optional(LoadBalancerTlsCertificateFailureReason),
    issuedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    issuer: S.optional(S.String),
    keyAlgorithm: S.optional(S.String),
    notAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    notBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    renewalSummary: S.optional(LoadBalancerTlsCertificateRenewalSummary),
    revocationReason: S.optional(LoadBalancerTlsCertificateRevocationReason),
    revokedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    serial: S.optional(S.String),
    signatureAlgorithm: S.optional(S.String),
    subject: S.optional(S.String),
    subjectAlternativeNames: S.optional(StringList),
  }),
).annotations({
  identifier: "LoadBalancerTlsCertificate",
}) as any as S.Schema<LoadBalancerTlsCertificate>;
export type LoadBalancerTlsCertificateList = LoadBalancerTlsCertificate[];
export const LoadBalancerTlsCertificateList = S.Array(
  LoadBalancerTlsCertificate,
);
export interface EstimateByTime {
  usageCost?: number;
  pricingUnit?: PricingUnit;
  unit?: number;
  currency?: Currency;
  timePeriod?: TimePeriod;
}
export const EstimateByTime = S.suspend(() =>
  S.Struct({
    usageCost: S.optional(S.Number),
    pricingUnit: S.optional(PricingUnit),
    unit: S.optional(S.Number),
    currency: S.optional(Currency),
    timePeriod: S.optional(TimePeriod),
  }),
).annotations({
  identifier: "EstimateByTime",
}) as any as S.Schema<EstimateByTime>;
export type EstimatesByTime = EstimateByTime[];
export const EstimatesByTime = S.Array(EstimateByTime);
export interface InstanceSnapshotInfo {
  fromBundleId?: string;
  fromBlueprintId?: string;
  fromDiskInfo?: DiskInfo[];
}
export const InstanceSnapshotInfo = S.suspend(() =>
  S.Struct({
    fromBundleId: S.optional(S.String),
    fromBlueprintId: S.optional(S.String),
    fromDiskInfo: S.optional(DiskInfoList),
  }),
).annotations({
  identifier: "InstanceSnapshotInfo",
}) as any as S.Schema<InstanceSnapshotInfo>;
export interface CreateContainerServiceDeploymentResult {
  containerService?: ContainerService;
}
export const CreateContainerServiceDeploymentResult = S.suspend(() =>
  S.Struct({ containerService: S.optional(ContainerService) }),
).annotations({
  identifier: "CreateContainerServiceDeploymentResult",
}) as any as S.Schema<CreateContainerServiceDeploymentResult>;
export interface ContainerServicesListResult {
  containerServices?: ContainerService[];
}
export const ContainerServicesListResult = S.suspend(() =>
  S.Struct({ containerServices: S.optional(ContainerServiceList) }),
).annotations({
  identifier: "ContainerServicesListResult",
}) as any as S.Schema<ContainerServicesListResult>;
export interface GetDomainResult {
  domain?: Domain;
}
export const GetDomainResult = S.suspend(() =>
  S.Struct({ domain: S.optional(Domain) }),
).annotations({
  identifier: "GetDomainResult",
}) as any as S.Schema<GetDomainResult>;
export interface GetInstanceResult {
  instance?: Instance;
}
export const GetInstanceResult = S.suspend(() =>
  S.Struct({ instance: S.optional(Instance) }),
).annotations({
  identifier: "GetInstanceResult",
}) as any as S.Schema<GetInstanceResult>;
export interface GetLoadBalancerTlsCertificatesResult {
  tlsCertificates?: LoadBalancerTlsCertificate[];
}
export const GetLoadBalancerTlsCertificatesResult = S.suspend(() =>
  S.Struct({ tlsCertificates: S.optional(LoadBalancerTlsCertificateList) }),
).annotations({
  identifier: "GetLoadBalancerTlsCertificatesResult",
}) as any as S.Schema<GetLoadBalancerTlsCertificatesResult>;
export interface CostEstimate {
  usageType?: string;
  resultsByTime?: EstimateByTime[];
}
export const CostEstimate = S.suspend(() =>
  S.Struct({
    usageType: S.optional(S.String),
    resultsByTime: S.optional(EstimatesByTime),
  }),
).annotations({ identifier: "CostEstimate" }) as any as S.Schema<CostEstimate>;
export type CostEstimates = CostEstimate[];
export const CostEstimates = S.Array(CostEstimate);
export interface ExportSnapshotRecordSourceInfo {
  resourceType?: ExportSnapshotRecordSourceType;
  createdAt?: Date;
  name?: string;
  arn?: string;
  fromResourceName?: string;
  fromResourceArn?: string;
  instanceSnapshotInfo?: InstanceSnapshotInfo;
  diskSnapshotInfo?: DiskSnapshotInfo;
}
export const ExportSnapshotRecordSourceInfo = S.suspend(() =>
  S.Struct({
    resourceType: S.optional(ExportSnapshotRecordSourceType),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    name: S.optional(S.String),
    arn: S.optional(S.String),
    fromResourceName: S.optional(S.String),
    fromResourceArn: S.optional(S.String),
    instanceSnapshotInfo: S.optional(InstanceSnapshotInfo),
    diskSnapshotInfo: S.optional(DiskSnapshotInfo),
  }),
).annotations({
  identifier: "ExportSnapshotRecordSourceInfo",
}) as any as S.Schema<ExportSnapshotRecordSourceInfo>;
export interface ResourceBudgetEstimate {
  resourceName?: string;
  resourceType?: ResourceType;
  costEstimates?: CostEstimate[];
  startTime?: Date;
  endTime?: Date;
}
export const ResourceBudgetEstimate = S.suspend(() =>
  S.Struct({
    resourceName: S.optional(S.String),
    resourceType: S.optional(ResourceType),
    costEstimates: S.optional(CostEstimates),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ResourceBudgetEstimate",
}) as any as S.Schema<ResourceBudgetEstimate>;
export type ResourcesBudgetEstimate = ResourceBudgetEstimate[];
export const ResourcesBudgetEstimate = S.Array(ResourceBudgetEstimate);
export interface ExportSnapshotRecord {
  name?: string;
  arn?: string;
  createdAt?: Date;
  location?: ResourceLocation;
  resourceType?: ResourceType;
  state?: RecordState;
  sourceInfo?: ExportSnapshotRecordSourceInfo;
  destinationInfo?: DestinationInfo;
}
export const ExportSnapshotRecord = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    location: S.optional(ResourceLocation),
    resourceType: S.optional(ResourceType),
    state: S.optional(RecordState),
    sourceInfo: S.optional(ExportSnapshotRecordSourceInfo),
    destinationInfo: S.optional(DestinationInfo),
  }),
).annotations({
  identifier: "ExportSnapshotRecord",
}) as any as S.Schema<ExportSnapshotRecord>;
export type ExportSnapshotRecordList = ExportSnapshotRecord[];
export const ExportSnapshotRecordList = S.Array(ExportSnapshotRecord);
export interface CreateCertificateResult {
  certificate?: CertificateSummary;
  operations?: Operation[];
}
export const CreateCertificateResult = S.suspend(() =>
  S.Struct({
    certificate: S.optional(CertificateSummary),
    operations: S.optional(OperationList),
  }),
).annotations({
  identifier: "CreateCertificateResult",
}) as any as S.Schema<CreateCertificateResult>;
export interface GetCostEstimateResult {
  resourcesBudgetEstimate?: ResourceBudgetEstimate[];
}
export const GetCostEstimateResult = S.suspend(() =>
  S.Struct({ resourcesBudgetEstimate: S.optional(ResourcesBudgetEstimate) }),
).annotations({
  identifier: "GetCostEstimateResult",
}) as any as S.Schema<GetCostEstimateResult>;
export interface GetExportSnapshotRecordsResult {
  exportSnapshotRecords?: ExportSnapshotRecord[];
  nextPageToken?: string;
}
export const GetExportSnapshotRecordsResult = S.suspend(() =>
  S.Struct({
    exportSnapshotRecords: S.optional(ExportSnapshotRecordList),
    nextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetExportSnapshotRecordsResult",
}) as any as S.Schema<GetExportSnapshotRecordsResult>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {
    code: S.optional(S.String),
    docs: S.optional(S.String),
    message: S.optional(S.String),
    tip: S.optional(S.String),
  },
).pipe(C.withAuthError) {}
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  {
    code: S.optional(S.String),
    docs: S.optional(S.String),
    message: S.optional(S.String),
    tip: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class AccountSetupInProgressException extends S.TaggedError<AccountSetupInProgressException>()(
  "AccountSetupInProgressException",
  {
    code: S.optional(S.String),
    docs: S.optional(S.String),
    message: S.optional(S.String),
    tip: S.optional(S.String),
  },
) {}
export class RegionSetupInProgressException extends S.TaggedError<RegionSetupInProgressException>()(
  "RegionSetupInProgressException",
  {
    code: S.optional(S.String),
    docs: S.optional(S.String),
    message: S.optional(S.String),
    tip: S.optional(S.String),
  },
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {
    code: S.optional(S.String),
    docs: S.optional(S.String),
    message: S.optional(S.String),
    tip: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class ServiceException extends S.TaggedError<ServiceException>()(
  "ServiceException",
  {
    code: S.optional(S.String),
    docs: S.optional(S.String),
    message: S.optional(S.String),
    tip: S.optional(S.String),
  },
).pipe(C.withServerError) {}
export class OperationFailureException extends S.TaggedError<OperationFailureException>()(
  "OperationFailureException",
  {
    code: S.optional(S.String),
    docs: S.optional(S.String),
    message: S.optional(S.String),
    tip: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class UnauthenticatedException extends S.TaggedError<UnauthenticatedException>()(
  "UnauthenticatedException",
  {
    code: S.optional(S.String),
    docs: S.optional(S.String),
    message: S.optional(S.String),
    tip: S.optional(S.String),
  },
).pipe(C.withAuthError) {}

//# Operations
/**
 * Returns information about Amazon Lightsail containers, such as the current version of the
 * Lightsail Control (lightsailctl) plugin.
 */
export const getContainerAPIMetadata: (
  input: GetContainerAPIMetadataRequest,
) => effect.Effect<
  GetContainerAPIMetadataResult,
  | AccessDeniedException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContainerAPIMetadataRequest,
  output: GetContainerAPIMetadataResult,
  errors: [
    AccessDeniedException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about one or more of your Amazon Lightsail container services.
 */
export const getContainerServices: (
  input: GetContainerServicesRequest,
) => effect.Effect<
  ContainerServicesListResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContainerServicesRequest,
  output: ContainerServicesListResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about a specific domain recordset.
 */
export const getDomain: (
  input: GetDomainRequest,
) => effect.Effect<
  GetDomainResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainRequest,
  output: GetDomainResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about a specific Amazon Lightsail instance, which is a virtual private
 * server.
 */
export const getInstance: (
  input: GetInstanceRequest,
) => effect.Effect<
  GetInstanceResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInstanceRequest,
  output: GetInstanceResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about the TLS certificates that are associated with the specified
 * Lightsail load balancer.
 *
 * TLS is just an updated, more secure version of Secure Socket Layer (SSL).
 *
 * You can have a maximum of 2 certificates associated with a Lightsail load balancer. One
 * is active and the other is inactive.
 */
export const getLoadBalancerTlsCertificates: (
  input: GetLoadBalancerTlsCertificatesRequest,
) => effect.Effect<
  GetLoadBalancerTlsCertificatesResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLoadBalancerTlsCertificatesRequest,
  output: GetLoadBalancerTlsCertificatesResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the available automatic snapshots for an instance or disk. For more information,
 * see the Amazon Lightsail Developer Guide.
 */
export const getAutoSnapshots: (
  input: GetAutoSnapshotsRequest,
) => effect.Effect<
  GetAutoSnapshotsResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAutoSnapshotsRequest,
  output: GetAutoSnapshotsResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the CloudFormation stack record created as a result of the create cloud
 * formation stack operation.
 *
 * An AWS CloudFormation stack is used to create a new Amazon EC2 instance from an exported Lightsail
 * snapshot.
 */
export const getCloudFormationStackRecords: (
  input: GetCloudFormationStackRecordsRequest,
) => effect.Effect<
  GetCloudFormationStackRecordsResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCloudFormationStackRecordsRequest,
  output: GetCloudFormationStackRecordsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about a specific block storage disk.
 */
export const getDisk: (
  input: GetDiskRequest,
) => effect.Effect<
  GetDiskResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDiskRequest,
  output: GetDiskResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about one or more of your Amazon Lightsail content delivery network
 * (CDN) distributions.
 */
export const getDistributions: (
  input: GetDistributionsRequest,
) => effect.Effect<
  GetDistributionsResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDistributionsRequest,
  output: GetDistributionsResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns temporary SSH keys you can use to connect to a specific virtual private server, or
 * *instance*.
 *
 * The `get instance access details` operation supports tag-based access control
 * via resource tags applied to the resource identified by `instance name`. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const getInstanceAccessDetails: (
  input: GetInstanceAccessDetailsRequest,
) => effect.Effect<
  GetInstanceAccessDetailsResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInstanceAccessDetailsRequest,
  output: GetInstanceAccessDetailsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about the specified Lightsail load balancer.
 */
export const getLoadBalancer: (
  input: GetLoadBalancerRequest,
) => effect.Effect<
  GetLoadBalancerResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLoadBalancerRequest,
  output: GetLoadBalancerResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns a list of all valid regions for Amazon Lightsail. Use the include
 * availability zones parameter to also return the Availability Zones in a
 * region.
 */
export const getRegions: (
  input: GetRegionsRequest,
) => effect.Effect<
  GetRegionsResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRegionsRequest,
  output: GetRegionsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about a specific database in Amazon Lightsail.
 */
export const getRelationalDatabase: (
  input: GetRelationalDatabaseRequest,
) => effect.Effect<
  GetRelationalDatabaseResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRelationalDatabaseRequest,
  output: GetRelationalDatabaseResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes the specified block storage disk. The disk must be in the `available`
 * state (not attached to a Lightsail instance).
 *
 * The disk may remain in the `deleting` state for several minutes.
 *
 * The `delete disk` operation supports tag-based access control via resource tags
 * applied to the resource identified by `disk name`. For more information, see the
 * Amazon Lightsail Developer Guide.
 */
export const deleteDisk: (
  input: DeleteDiskRequest,
) => effect.Effect<
  DeleteDiskResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDiskRequest,
  output: DeleteDiskResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the list of available instance images, or *blueprints*. You can
 * use a blueprint to create a new instance already running a specific operating system, as well
 * as a preinstalled app or development stack. The software each instance is running depends on
 * the blueprint image you choose.
 *
 * Use active blueprints when creating new instances. Inactive blueprints are listed to
 * support customers with existing instances and are not necessarily available to create new
 * instances. Blueprints are marked inactive when they become outdated due to operating system
 * updates or new application releases.
 */
export const getBlueprints: (
  input: GetBlueprintsRequest,
) => effect.Effect<
  GetBlueprintsResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBlueprintsRequest,
  output: GetBlueprintsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the bundles that you can apply to an Amazon Lightsail instance when you create
 * it.
 *
 * A bundle describes the specifications of an instance, such as the monthly cost, amount of
 * memory, the number of vCPUs, amount of storage space, and monthly network data transfer
 * quota.
 *
 * Bundles are referred to as *instance plans* in the Lightsail
 * console.
 */
export const getBundles: (
  input: GetBundlesRequest,
) => effect.Effect<
  GetBundlesResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBundlesRequest,
  output: GetBundlesResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about the configured contact methods. Specify a protocol in your
 * request to return information about a specific contact method.
 *
 * A contact method is used to send you notifications about your Amazon Lightsail resources.
 * You can add one email address and one mobile phone number contact method in each Amazon Web Services Region. However, SMS text messaging is not supported in some Amazon Web Services
 * Regions, and SMS text messages cannot be sent to some countries/regions. For more information,
 * see Notifications in Amazon Lightsail.
 */
export const getContactMethods: (
  input: GetContactMethodsRequest,
) => effect.Effect<
  GetContactMethodsResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContactMethodsRequest,
  output: GetContactMethodsResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about a specific block storage disk snapshot.
 */
export const getDiskSnapshot: (
  input: GetDiskSnapshotRequest,
) => effect.Effect<
  GetDiskSnapshotResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDiskSnapshotRequest,
  output: GetDiskSnapshotResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the firewall port states for a specific Amazon Lightsail instance, the IP addresses
 * allowed to connect to the instance through the ports, and the protocol.
 */
export const getInstancePortStates: (
  input: GetInstancePortStatesRequest,
) => effect.Effect<
  GetInstancePortStatesResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInstancePortStatesRequest,
  output: GetInstancePortStatesResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about a specific instance snapshot.
 */
export const getInstanceSnapshot: (
  input: GetInstanceSnapshotRequest,
) => effect.Effect<
  GetInstanceSnapshotResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInstanceSnapshotRequest,
  output: GetInstanceSnapshotResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the state of a specific instance. Works on one instance at a time.
 */
export const getInstanceState: (
  input: GetInstanceStateRequest,
) => effect.Effect<
  GetInstanceStateResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInstanceStateRequest,
  output: GetInstanceStateResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns a list of available database blueprints in Amazon Lightsail. A blueprint describes
 * the major engine version of a database.
 *
 * You can use a blueprint ID to create a new database that runs a specific database
 * engine.
 */
export const getRelationalDatabaseBlueprints: (
  input: GetRelationalDatabaseBlueprintsRequest,
) => effect.Effect<
  GetRelationalDatabaseBlueprintsResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRelationalDatabaseBlueprintsRequest,
  output: GetRelationalDatabaseBlueprintsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the list of bundles that are available in Amazon Lightsail. A bundle describes the
 * performance specifications for a database.
 *
 * You can use a bundle ID to create a new database with explicit performance
 * specifications.
 */
export const getRelationalDatabaseBundles: (
  input: GetRelationalDatabaseBundlesRequest,
) => effect.Effect<
  GetRelationalDatabaseBundlesResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRelationalDatabaseBundlesRequest,
  output: GetRelationalDatabaseBundlesResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns a list of events for a specific database in Amazon Lightsail.
 */
export const getRelationalDatabaseEvents: (
  input: GetRelationalDatabaseEventsRequest,
) => effect.Effect<
  GetRelationalDatabaseEventsResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRelationalDatabaseEventsRequest,
  output: GetRelationalDatabaseEventsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns a list of log events for a database in Amazon Lightsail.
 */
export const getRelationalDatabaseLogEvents: (
  input: GetRelationalDatabaseLogEventsRequest,
) => effect.Effect<
  GetRelationalDatabaseLogEventsResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRelationalDatabaseLogEventsRequest,
  output: GetRelationalDatabaseLogEventsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about a specific database snapshot in Amazon Lightsail.
 */
export const getRelationalDatabaseSnapshot: (
  input: GetRelationalDatabaseSnapshotRequest,
) => effect.Effect<
  GetRelationalDatabaseSnapshotResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRelationalDatabaseSnapshotRequest,
  output: GetRelationalDatabaseSnapshotResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about an Amazon Lightsail static IP.
 */
export const getStaticIp: (
  input: GetStaticIpRequest,
) => effect.Effect<
  GetStaticIpResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStaticIpRequest,
  output: GetStaticIpResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Peers the Lightsail VPC with the user's default VPC.
 */
export const peerVpc: (
  input: PeerVpcRequest,
) => effect.Effect<
  PeerVpcResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PeerVpcRequest,
  output: PeerVpcResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Allows the update of one or more parameters of a database in Amazon Lightsail.
 *
 * Parameter updates don't cause outages; therefore, their application is not subject to the
 * preferred maintenance window. However, there are two ways in which parameter updates are
 * applied: `dynamic` or `pending-reboot`. Parameters marked with a
 * `dynamic` apply type are applied immediately. Parameters marked with a
 * `pending-reboot` apply type are applied only after the database is rebooted using
 * the `reboot relational database` operation.
 *
 * The `update relational database parameters` operation supports tag-based access
 * control via resource tags applied to the resource identified by relationalDatabaseName. For
 * more information, see the Amazon Lightsail Developer Guide.
 */
export const updateRelationalDatabaseParameters: (
  input: UpdateRelationalDatabaseParametersRequest,
) => effect.Effect<
  UpdateRelationalDatabaseParametersResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRelationalDatabaseParametersRequest,
  output: UpdateRelationalDatabaseParametersResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes your Amazon Lightsail content delivery network (CDN) distribution.
 */
export const deleteDistribution: (
  input: DeleteDistributionRequest,
) => effect.Effect<
  DeleteDistributionResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDistributionRequest,
  output: DeleteDistributionResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Detaches an SSL/TLS certificate from your Amazon Lightsail content delivery network (CDN)
 * distribution.
 *
 * After the certificate is detached, your distribution stops accepting traffic for all of
 * the domains that are associated with the certificate.
 */
export const detachCertificateFromDistribution: (
  input: DetachCertificateFromDistributionRequest,
) => effect.Effect<
  DetachCertificateFromDistributionResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachCertificateFromDistributionRequest,
  output: DetachCertificateFromDistributionResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Disables an add-on for an Amazon Lightsail resource. For more information, see the Amazon Lightsail Developer Guide.
 */
export const disableAddOn: (
  input: DisableAddOnRequest,
) => effect.Effect<
  DisableAddOnResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableAddOnRequest,
  output: DisableAddOnResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Enables or modifies an add-on for an Amazon Lightsail resource. For more information, see
 * the Amazon Lightsail Developer Guide.
 */
export const enableAddOn: (
  input: EnableAddOnRequest,
) => effect.Effect<
  EnableAddOnResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableAddOnRequest,
  output: EnableAddOnResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the bundles that can be applied to your Amazon Lightsail content delivery network
 * (CDN) distributions.
 *
 * A distribution bundle specifies the monthly network transfer quota and monthly cost of
 * your distribution.
 */
export const getDistributionBundles: (
  input: GetDistributionBundlesRequest,
) => effect.Effect<
  GetDistributionBundlesResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDistributionBundlesRequest,
  output: GetDistributionBundlesResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the timestamp and status of the last cache reset of a specific Amazon Lightsail
 * content delivery network (CDN) distribution.
 */
export const getDistributionLatestCacheReset: (
  input: GetDistributionLatestCacheResetRequest,
) => effect.Effect<
  GetDistributionLatestCacheResetResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDistributionLatestCacheResetRequest,
  output: GetDistributionLatestCacheResetResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the data points of a specific metric for an Amazon Lightsail content delivery
 * network (CDN) distribution.
 *
 * Metrics report the utilization of your resources, and the error counts generated by them.
 * Monitor and collect metric data regularly to maintain the reliability, availability, and
 * performance of your resources.
 */
export const getDistributionMetricData: (
  input: GetDistributionMetricDataRequest,
) => effect.Effect<
  GetDistributionMetricDataResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDistributionMetricDataRequest,
  output: GetDistributionMetricDataResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates or updates an alarm, and associates it with the specified metric.
 *
 * An alarm is used to monitor a single metric for one of your resources. When a metric
 * condition is met, the alarm can notify you by email, SMS text message, and a banner displayed
 * on the Amazon Lightsail console. For more information, see Alarms
 * in Amazon Lightsail.
 *
 * When this action creates an alarm, the alarm state is immediately set to
 * `INSUFFICIENT_DATA`. The alarm is then evaluated and its state is set
 * appropriately. Any actions associated with the new state are then executed.
 *
 * When you update an existing alarm, its state is left unchanged, but the update completely
 * overwrites the previous configuration of the alarm. The alarm is then evaluated with the
 * updated configuration.
 */
export const putAlarm: (
  input: PutAlarmRequest,
) => effect.Effect<
  PutAlarmResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAlarmRequest,
  output: PutAlarmResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes currently cached content from your Amazon Lightsail content delivery network (CDN)
 * distribution.
 *
 * After resetting the cache, the next time a content request is made, your distribution
 * pulls, serves, and caches it from the origin.
 */
export const resetDistributionCache: (
  input: ResetDistributionCacheRequest,
) => effect.Effect<
  ResetDistributionCacheResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetDistributionCacheRequest,
  output: ResetDistributionCacheResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Sends a verification request to an email contact method to ensure it's owned by the
 * requester. SMS contact methods don't need to be verified.
 *
 * A contact method is used to send you notifications about your Amazon Lightsail resources.
 * You can add one email address and one mobile phone number contact method in each Amazon Web Services Region. However, SMS text messaging is not supported in some Amazon Web Services
 * Regions, and SMS text messages cannot be sent to some countries/regions. For more information,
 * see Notifications in Amazon Lightsail.
 *
 * A verification request is sent to the contact method when you initially create it. Use
 * this action to send another verification request if a previous verification request was
 * deleted, or has expired.
 *
 * Notifications are not sent to an email contact method until after it is verified, and
 * confirmed as valid.
 */
export const sendContactMethodVerification: (
  input: SendContactMethodVerificationRequest,
) => effect.Effect<
  SendContactMethodVerificationResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendContactMethodVerificationRequest,
  output: SendContactMethodVerificationResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Tests an alarm by displaying a banner on the Amazon Lightsail console. If a notification
 * trigger is configured for the specified alarm, the test also sends a notification to the
 * notification protocol (`Email` and/or `SMS`) configured for the
 * alarm.
 *
 * An alarm is used to monitor a single metric for one of your resources. When a metric
 * condition is met, the alarm can notify you by email, SMS text message, and a banner displayed
 * on the Amazon Lightsail console. For more information, see Alarms
 * in Amazon Lightsail.
 */
export const testAlarm: (
  input: TestAlarmRequest,
) => effect.Effect<
  TestAlarmResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestAlarmRequest,
  output: TestAlarmResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Updates an existing Amazon Lightsail content delivery network (CDN) distribution.
 *
 * Use this action to update the configuration of your existing distribution.
 */
export const updateDistribution: (
  input: UpdateDistributionRequest,
) => effect.Effect<
  UpdateDistributionResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDistributionRequest,
  output: UpdateDistributionResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Updates the bundle of your Amazon Lightsail content delivery network (CDN)
 * distribution.
 *
 * A distribution bundle specifies the monthly network transfer quota and monthly cost of
 * your distribution.
 *
 * Update your distribution's bundle if your distribution is going over its monthly network
 * transfer quota and is incurring an overage fee.
 *
 * You can update your distribution's bundle only one time within your monthly Amazon Web Services billing cycle. To determine if you can update your distribution's bundle, use the
 * `GetDistributions` action. The `ableToUpdateBundle` parameter in the
 * result will indicate whether you can currently update your distribution's bundle.
 */
export const updateDistributionBundle: (
  input: UpdateDistributionBundleRequest,
) => effect.Effect<
  UpdateDistributionBundleResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDistributionBundleRequest,
  output: UpdateDistributionBundleResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Attaches an SSL/TLS certificate to your Amazon Lightsail content delivery network (CDN)
 * distribution.
 *
 * After the certificate is attached, your distribution accepts HTTPS traffic for all of the
 * domains that are associated with the certificate.
 *
 * Use the `CreateCertificate` action to create a certificate that you can attach
 * to your distribution.
 *
 * Only certificates created in the `us-east-1`
 * Amazon Web Services Region can be attached to Lightsail distributions. Lightsail
 * distributions are global resources that can reference an origin in any Amazon Web Services
 * Region, and distribute its content globally. However, all distributions are located in the
 * `us-east-1` Region.
 */
export const attachCertificateToDistribution: (
  input: AttachCertificateToDistributionRequest,
) => effect.Effect<
  AttachCertificateToDistributionResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachCertificateToDistributionRequest,
  output: AttachCertificateToDistributionResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates an email or SMS text message contact method.
 *
 * A contact method is used to send you notifications about your Amazon Lightsail resources.
 * You can add one email address and one mobile phone number contact method in each Amazon Web Services Region. However, SMS text messaging is not supported in some Amazon Web Services
 * Regions, and SMS text messages cannot be sent to some countries/regions. For more information,
 * see Notifications in Amazon Lightsail.
 */
export const createContactMethod: (
  input: CreateContactMethodRequest,
) => effect.Effect<
  CreateContactMethodResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateContactMethodRequest,
  output: CreateContactMethodResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes an alarm.
 *
 * An alarm is used to monitor a single metric for one of your resources. When a metric
 * condition is met, the alarm can notify you by email, SMS text message, and a banner displayed
 * on the Amazon Lightsail console. For more information, see Alarms
 * in Amazon Lightsail.
 */
export const deleteAlarm: (
  input: DeleteAlarmRequest,
) => effect.Effect<
  DeleteAlarmResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAlarmRequest,
  output: DeleteAlarmResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes an automatic snapshot of an instance or disk. For more information, see the Amazon Lightsail Developer Guide.
 */
export const deleteAutoSnapshot: (
  input: DeleteAutoSnapshotRequest,
) => effect.Effect<
  DeleteAutoSnapshotResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAutoSnapshotRequest,
  output: DeleteAutoSnapshotResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes a contact method.
 *
 * A contact method is used to send you notifications about your Amazon Lightsail resources.
 * You can add one email address and one mobile phone number contact method in each Amazon Web Services Region. However, SMS text messaging is not supported in some Amazon Web Services
 * Regions, and SMS text messages cannot be sent to some countries/regions. For more information,
 * see Notifications in Amazon Lightsail.
 */
export const deleteContactMethod: (
  input: DeleteContactMethodRequest,
) => effect.Effect<
  DeleteContactMethodResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteContactMethodRequest,
  output: DeleteContactMethodResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes the specified disk snapshot.
 *
 * When you make periodic snapshots of a disk, the snapshots are incremental, and only the
 * blocks on the device that have changed since your last snapshot are saved in the new snapshot.
 * When you delete a snapshot, only the data not needed for any other snapshot is removed. So
 * regardless of which prior snapshots have been deleted, all active snapshots will have access
 * to all the information needed to restore the disk.
 *
 * The `delete disk snapshot` operation supports tag-based access control via
 * resource tags applied to the resource identified by `disk snapshot name`. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const deleteDiskSnapshot: (
  input: DeleteDiskSnapshotRequest,
) => effect.Effect<
  DeleteDiskSnapshotResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDiskSnapshotRequest,
  output: DeleteDiskSnapshotResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes the specified domain recordset and all of its domain records.
 *
 * The `delete domain` operation supports tag-based access control via resource
 * tags applied to the resource identified by `domain name`. For more information, see
 * the Amazon Lightsail Developer Guide.
 */
export const deleteDomain: (
  input: DeleteDomainRequest,
) => effect.Effect<
  DeleteDomainResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainRequest,
  output: DeleteDomainResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes a specific domain entry.
 *
 * The `delete domain entry` operation supports tag-based access control via
 * resource tags applied to the resource identified by `domain name`. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const deleteDomainEntry: (
  input: DeleteDomainEntryRequest,
) => effect.Effect<
  DeleteDomainEntryResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainEntryRequest,
  output: DeleteDomainEntryResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes an Amazon Lightsail instance.
 *
 * The `delete instance` operation supports tag-based access control via resource
 * tags applied to the resource identified by `instance name`. For more information,
 * see the Amazon Lightsail Developer Guide.
 */
export const deleteInstance: (
  input: DeleteInstanceRequest,
) => effect.Effect<
  DeleteInstanceResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInstanceRequest,
  output: DeleteInstanceResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes a specific snapshot of a virtual private server (or
 * *instance*).
 *
 * The `delete instance snapshot` operation supports tag-based access control via
 * resource tags applied to the resource identified by `instance snapshot name`. For
 * more information, see the Amazon Lightsail Developer Guide.
 */
export const deleteInstanceSnapshot: (
  input: DeleteInstanceSnapshotRequest,
) => effect.Effect<
  DeleteInstanceSnapshotResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInstanceSnapshotRequest,
  output: DeleteInstanceSnapshotResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes the specified key pair by removing the public key from Amazon Lightsail.
 *
 * You can delete key pairs that were created using the ImportKeyPair and
 * CreateKeyPair actions, as well as the Lightsail default key pair. A new default
 * key pair will not be created unless you launch an instance without specifying a custom key
 * pair, or you call the DownloadDefaultKeyPair API.
 *
 * The `delete key pair` operation supports tag-based access control via resource
 * tags applied to the resource identified by `key pair name`. For more information,
 * see the Amazon Lightsail Developer Guide.
 */
export const deleteKeyPair: (
  input: DeleteKeyPairRequest,
) => effect.Effect<
  DeleteKeyPairResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKeyPairRequest,
  output: DeleteKeyPairResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes the known host key or certificate used by the Amazon Lightsail browser-based SSH or
 * RDP clients to authenticate an instance. This operation enables the Lightsail browser-based
 * SSH or RDP clients to connect to the instance after a host key mismatch.
 *
 * Perform this operation only if you were expecting the host key or certificate mismatch
 * or if you are familiar with the new host key or certificate on the instance. For more
 * information, see Troubleshooting connection issues when using the Amazon Lightsail browser-based SSH or RDP
 * client.
 */
export const deleteKnownHostKeys: (
  input: DeleteKnownHostKeysRequest,
) => effect.Effect<
  DeleteKnownHostKeysResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKnownHostKeysRequest,
  output: DeleteKnownHostKeysResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes a Lightsail load balancer and all its associated SSL/TLS certificates. Once the
 * load balancer is deleted, you will need to create a new load balancer, create a new
 * certificate, and verify domain ownership again.
 *
 * The `delete load balancer` operation supports tag-based access control via
 * resource tags applied to the resource identified by `load balancer name`. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const deleteLoadBalancer: (
  input: DeleteLoadBalancerRequest,
) => effect.Effect<
  DeleteLoadBalancerResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLoadBalancerRequest,
  output: DeleteLoadBalancerResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes an SSL/TLS certificate associated with a Lightsail load balancer.
 *
 * The `DeleteLoadBalancerTlsCertificate` operation supports tag-based access
 * control via resource tags applied to the resource identified by load balancer
 * name. For more information, see the Amazon Lightsail Developer Guide.
 */
export const deleteLoadBalancerTlsCertificate: (
  input: DeleteLoadBalancerTlsCertificateRequest,
) => effect.Effect<
  DeleteLoadBalancerTlsCertificateResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLoadBalancerTlsCertificateRequest,
  output: DeleteLoadBalancerTlsCertificateResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes a database in Amazon Lightsail.
 *
 * The `delete relational database` operation supports tag-based access control
 * via resource tags applied to the resource identified by relationalDatabaseName. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const deleteRelationalDatabase: (
  input: DeleteRelationalDatabaseRequest,
) => effect.Effect<
  DeleteRelationalDatabaseResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRelationalDatabaseRequest,
  output: DeleteRelationalDatabaseResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes a database snapshot in Amazon Lightsail.
 *
 * The `delete relational database snapshot` operation supports tag-based access
 * control via resource tags applied to the resource identified by relationalDatabaseName. For
 * more information, see the Amazon Lightsail Developer Guide.
 */
export const deleteRelationalDatabaseSnapshot: (
  input: DeleteRelationalDatabaseSnapshotRequest,
) => effect.Effect<
  DeleteRelationalDatabaseSnapshotResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRelationalDatabaseSnapshotRequest,
  output: DeleteRelationalDatabaseSnapshotResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Detaches a stopped block storage disk from a Lightsail instance. Make sure to unmount
 * any file systems on the device within your operating system before stopping the instance and
 * detaching the disk.
 *
 * The `detach disk` operation supports tag-based access control via resource tags
 * applied to the resource identified by `disk name`. For more information, see the
 * Amazon Lightsail Developer Guide.
 */
export const detachDisk: (
  input: DetachDiskRequest,
) => effect.Effect<
  DetachDiskResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachDiskRequest,
  output: DetachDiskResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Detaches the specified instances from a Lightsail load balancer.
 *
 * This operation waits until the instances are no longer needed before they are detached
 * from the load balancer.
 *
 * The `detach instances from load balancer` operation supports tag-based access
 * control via resource tags applied to the resource identified by load balancer
 * name. For more information, see the Amazon Lightsail Developer Guide.
 */
export const detachInstancesFromLoadBalancer: (
  input: DetachInstancesFromLoadBalancerRequest,
) => effect.Effect<
  DetachInstancesFromLoadBalancerResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachInstancesFromLoadBalancerRequest,
  output: DetachInstancesFromLoadBalancerResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Detaches a static IP from the Amazon Lightsail instance to which it is attached.
 */
export const detachStaticIp: (
  input: DetachStaticIpRequest,
) => effect.Effect<
  DetachStaticIpResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachStaticIpRequest,
  output: DetachStaticIpResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Exports an Amazon Lightsail instance or block storage disk snapshot to Amazon Elastic Compute Cloud (Amazon EC2).
 * This operation results in an export snapshot record that can be used with the create
 * cloud formation stack operation to create new Amazon EC2 instances.
 *
 * Exported instance snapshots appear in Amazon EC2 as Amazon Machine Images (AMIs), and the
 * instance system disk appears as an Amazon Elastic Block Store (Amazon EBS) volume. Exported disk snapshots appear in
 * Amazon EC2 as Amazon EBS volumes. Snapshots are exported to the same Amazon Web Services Region in
 * Amazon EC2 as the source Lightsail snapshot.
 *
 * The `export snapshot` operation supports tag-based access control via resource
 * tags applied to the resource identified by `source snapshot name`. For more
 * information, see the Amazon Lightsail Developer Guide.
 *
 * Use the `get instance snapshots` or `get disk snapshots`
 * operations to get a list of snapshots that you can export to Amazon EC2.
 */
export const exportSnapshot: (
  input: ExportSnapshotRequest,
) => effect.Effect<
  ExportSnapshotResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExportSnapshotRequest,
  output: ExportSnapshotResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the names of all active (not deleted) resources.
 */
export const getActiveNames: (
  input: GetActiveNamesRequest,
) => effect.Effect<
  GetActiveNamesResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetActiveNamesRequest,
  output: GetActiveNamesResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about all block storage disks in your AWS account and region.
 */
export const getDisks: (
  input: GetDisksRequest,
) => effect.Effect<
  GetDisksResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDisksRequest,
  output: GetDisksResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about all block storage disk snapshots in your AWS account and
 * region.
 */
export const getDiskSnapshots: (
  input: GetDiskSnapshotsRequest,
) => effect.Effect<
  GetDiskSnapshotsResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDiskSnapshotsRequest,
  output: GetDiskSnapshotsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns a list of all domains in the user's account.
 */
export const getDomains: (
  input: GetDomainsRequest,
) => effect.Effect<
  GetDomainsResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainsRequest,
  output: GetDomainsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the data points for the specified Amazon Lightsail instance metric, given an
 * instance name.
 *
 * Metrics report the utilization of your resources, and the error counts generated by them.
 * Monitor and collect metric data regularly to maintain the reliability, availability, and
 * performance of your resources.
 */
export const getInstanceMetricData: (
  input: GetInstanceMetricDataRequest,
) => effect.Effect<
  GetInstanceMetricDataResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInstanceMetricDataRequest,
  output: GetInstanceMetricDataResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about all Amazon Lightsail virtual private servers, or
 * *instances*.
 */
export const getInstances: (
  input: GetInstancesRequest,
) => effect.Effect<
  GetInstancesResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInstancesRequest,
  output: GetInstancesResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns all instance snapshots for the user's account.
 */
export const getInstanceSnapshots: (
  input: GetInstanceSnapshotsRequest,
) => effect.Effect<
  GetInstanceSnapshotsResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInstanceSnapshotsRequest,
  output: GetInstanceSnapshotsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about a specific key pair.
 */
export const getKeyPair: (
  input: GetKeyPairRequest,
) => effect.Effect<
  GetKeyPairResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKeyPairRequest,
  output: GetKeyPairResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about all key pairs in the user's account.
 */
export const getKeyPairs: (
  input: GetKeyPairsRequest,
) => effect.Effect<
  GetKeyPairsResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKeyPairsRequest,
  output: GetKeyPairsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about health metrics for your Lightsail load balancer.
 *
 * Metrics report the utilization of your resources, and the error counts generated by them.
 * Monitor and collect metric data regularly to maintain the reliability, availability, and
 * performance of your resources.
 */
export const getLoadBalancerMetricData: (
  input: GetLoadBalancerMetricDataRequest,
) => effect.Effect<
  GetLoadBalancerMetricDataResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLoadBalancerMetricDataRequest,
  output: GetLoadBalancerMetricDataResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about all load balancers in an account.
 */
export const getLoadBalancers: (
  input: GetLoadBalancersRequest,
) => effect.Effect<
  GetLoadBalancersResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLoadBalancersRequest,
  output: GetLoadBalancersResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about a specific operation. Operations include events such as when you
 * create an instance, allocate a static IP, attach a static IP, and so on.
 */
export const getOperation: (
  input: GetOperationRequest,
) => effect.Effect<
  GetOperationResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOperationRequest,
  output: GetOperationResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about all operations.
 *
 * Results are returned from oldest to newest, up to a maximum of 200. Results can be paged
 * by making each subsequent call to `GetOperations` use the maximum (last)
 * `statusChangedAt` value from the previous request.
 */
export const getOperations: (
  input: GetOperationsRequest,
) => effect.Effect<
  GetOperationsResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOperationsRequest,
  output: GetOperationsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Gets operations for a specific resource (an instance or a static IP).
 */
export const getOperationsForResource: (
  input: GetOperationsForResourceRequest,
) => effect.Effect<
  GetOperationsForResourceResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOperationsForResourceRequest,
  output: GetOperationsForResourceResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns a list of available log streams for a specific database in Amazon Lightsail.
 */
export const getRelationalDatabaseLogStreams: (
  input: GetRelationalDatabaseLogStreamsRequest,
) => effect.Effect<
  GetRelationalDatabaseLogStreamsResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRelationalDatabaseLogStreamsRequest,
  output: GetRelationalDatabaseLogStreamsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the current, previous, or pending versions of the master user password for a
 * Lightsail database.
 *
 * The `GetRelationalDatabaseMasterUserPassword` operation supports tag-based
 * access control via resource tags applied to the resource identified by
 * relationalDatabaseName.
 */
export const getRelationalDatabaseMasterUserPassword: (
  input: GetRelationalDatabaseMasterUserPasswordRequest,
) => effect.Effect<
  GetRelationalDatabaseMasterUserPasswordResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRelationalDatabaseMasterUserPasswordRequest,
  output: GetRelationalDatabaseMasterUserPasswordResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the data points of the specified metric for a database in Amazon Lightsail.
 *
 * Metrics report the utilization of your resources, and the error counts generated by them.
 * Monitor and collect metric data regularly to maintain the reliability, availability, and
 * performance of your resources.
 */
export const getRelationalDatabaseMetricData: (
  input: GetRelationalDatabaseMetricDataRequest,
) => effect.Effect<
  GetRelationalDatabaseMetricDataResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRelationalDatabaseMetricDataRequest,
  output: GetRelationalDatabaseMetricDataResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns all of the runtime parameters offered by the underlying database software, or
 * engine, for a specific database in Amazon Lightsail.
 *
 * In addition to the parameter names and values, this operation returns other information
 * about each parameter. This information includes whether changes require a reboot, whether the
 * parameter is modifiable, the allowed values, and the data types.
 */
export const getRelationalDatabaseParameters: (
  input: GetRelationalDatabaseParametersRequest,
) => effect.Effect<
  GetRelationalDatabaseParametersResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRelationalDatabaseParametersRequest,
  output: GetRelationalDatabaseParametersResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about all of your databases in Amazon Lightsail.
 */
export const getRelationalDatabases: (
  input: GetRelationalDatabasesRequest,
) => effect.Effect<
  GetRelationalDatabasesResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRelationalDatabasesRequest,
  output: GetRelationalDatabasesResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about all of your database snapshots in Amazon Lightsail.
 */
export const getRelationalDatabaseSnapshots: (
  input: GetRelationalDatabaseSnapshotsRequest,
) => effect.Effect<
  GetRelationalDatabaseSnapshotsResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRelationalDatabaseSnapshotsRequest,
  output: GetRelationalDatabaseSnapshotsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about all static IPs in the user's account.
 */
export const getStaticIps: (
  input: GetStaticIpsRequest,
) => effect.Effect<
  GetStaticIpsResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStaticIpsRequest,
  output: GetStaticIpsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Imports a public SSH key from a specific key pair.
 */
export const importKeyPair: (
  input: ImportKeyPairRequest,
) => effect.Effect<
  ImportKeyPairResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportKeyPairRequest,
  output: ImportKeyPairResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Opens ports for a specific Amazon Lightsail instance, and specifies the IP addresses
 * allowed to connect to the instance through the ports, and the protocol.
 *
 * The `OpenInstancePublicPorts` action supports tag-based access control via
 * resource tags applied to the resource identified by `instanceName`. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const openInstancePublicPorts: (
  input: OpenInstancePublicPortsRequest,
) => effect.Effect<
  OpenInstancePublicPortsResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: OpenInstancePublicPortsRequest,
  output: OpenInstancePublicPortsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Opens ports for a specific Amazon Lightsail instance, and specifies the IP addresses
 * allowed to connect to the instance through the ports, and the protocol. This action also
 * closes all currently open ports that are not included in the request. Include all of the ports
 * and the protocols you want to open in your `PutInstancePublicPorts`request. Or use
 * the `OpenInstancePublicPorts` action to open ports without closing currently open
 * ports.
 *
 * The `PutInstancePublicPorts` action supports tag-based access control via
 * resource tags applied to the resource identified by `instanceName`. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const putInstancePublicPorts: (
  input: PutInstancePublicPortsRequest,
) => effect.Effect<
  PutInstancePublicPortsResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutInstancePublicPortsRequest,
  output: PutInstancePublicPortsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Restarts a specific instance.
 *
 * The `reboot instance` operation supports tag-based access control via resource
 * tags applied to the resource identified by `instance name`. For more information,
 * see the Amazon Lightsail Developer Guide.
 */
export const rebootInstance: (
  input: RebootInstanceRequest,
) => effect.Effect<
  RebootInstanceResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootInstanceRequest,
  output: RebootInstanceResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Restarts a specific database in Amazon Lightsail.
 *
 * The `reboot relational database` operation supports tag-based access control
 * via resource tags applied to the resource identified by relationalDatabaseName. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const rebootRelationalDatabase: (
  input: RebootRelationalDatabaseRequest,
) => effect.Effect<
  RebootRelationalDatabaseResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootRelationalDatabaseRequest,
  output: RebootRelationalDatabaseResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes a specific static IP from your account.
 */
export const releaseStaticIp: (
  input: ReleaseStaticIpRequest,
) => effect.Effect<
  ReleaseStaticIpResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReleaseStaticIpRequest,
  output: ReleaseStaticIpResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Sets the IP address type for an Amazon Lightsail resource.
 *
 * Use this action to enable dual-stack for a resource, which enables IPv4 and IPv6 for the
 * specified resource. Alternately, you can use this action to disable dual-stack, and enable
 * IPv4 only.
 */
export const setIpAddressType: (
  input: SetIpAddressTypeRequest,
) => effect.Effect<
  SetIpAddressTypeResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetIpAddressTypeRequest,
  output: SetIpAddressTypeResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Starts a specific Amazon Lightsail instance from a stopped state. To restart an instance,
 * use the `reboot instance` operation.
 *
 * When you start a stopped instance, Lightsail assigns a new public IP address to the
 * instance. To use the same IP address after stopping and starting an instance, create a
 * static IP address and attach it to the instance. For more information, see the Amazon Lightsail Developer Guide.
 *
 * The `start instance` operation supports tag-based access control via resource
 * tags applied to the resource identified by `instance name`. For more information,
 * see the Amazon Lightsail Developer Guide.
 */
export const startInstance: (
  input: StartInstanceRequest,
) => effect.Effect<
  StartInstanceResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartInstanceRequest,
  output: StartInstanceResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Starts a specific database from a stopped state in Amazon Lightsail. To restart a database,
 * use the `reboot relational database` operation.
 *
 * The `start relational database` operation supports tag-based access control via
 * resource tags applied to the resource identified by relationalDatabaseName. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const startRelationalDatabase: (
  input: StartRelationalDatabaseRequest,
) => effect.Effect<
  StartRelationalDatabaseResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartRelationalDatabaseRequest,
  output: StartRelationalDatabaseResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Stops a specific Amazon Lightsail instance that is currently running.
 *
 * When you start a stopped instance, Lightsail assigns a new public IP address to the
 * instance. To use the same IP address after stopping and starting an instance, create a
 * static IP address and attach it to the instance. For more information, see the Amazon Lightsail Developer Guide.
 *
 * The `stop instance` operation supports tag-based access control via resource
 * tags applied to the resource identified by `instance name`. For more information,
 * see the Amazon Lightsail Developer Guide.
 */
export const stopInstance: (
  input: StopInstanceRequest,
) => effect.Effect<
  StopInstanceResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopInstanceRequest,
  output: StopInstanceResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Stops a specific database that is currently running in Amazon Lightsail.
 *
 * If you don't manually start your database instance after it has been stopped for seven
 * consecutive days, Amazon Lightsail automatically starts it for you. This action helps ensure
 * that your database instance doesn't fall behind on any required maintenance updates.
 *
 * The `stop relational database` operation supports tag-based access control via
 * resource tags applied to the resource identified by relationalDatabaseName. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const stopRelationalDatabase: (
  input: StopRelationalDatabaseRequest,
) => effect.Effect<
  StopRelationalDatabaseResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopRelationalDatabaseRequest,
  output: StopRelationalDatabaseResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Adds one or more tags to the specified Amazon Lightsail resource. Each resource can have a
 * maximum of 50 tags. Each tag consists of a key and an optional value. Tag keys must be unique
 * per resource. For more information about tags, see the Amazon Lightsail Developer Guide.
 *
 * The `tag resource` operation supports tag-based access control via request tags
 * and resource tags applied to the resource identified by `resource name`. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes the specified set of tag keys and their values from the specified Amazon Lightsail
 * resource.
 *
 * The `untag resource` operation supports tag-based access control via request
 * tags and resource tags applied to the resource identified by `resource name`. For
 * more information, see the Amazon Lightsail Developer Guide.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Updates a domain recordset after it is created.
 *
 * The `update domain entry` operation supports tag-based access control via
 * resource tags applied to the resource identified by `domain name`. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const updateDomainEntry: (
  input: UpdateDomainEntryRequest,
) => effect.Effect<
  UpdateDomainEntryResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDomainEntryRequest,
  output: UpdateDomainEntryResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Modifies the Amazon Lightsail instance metadata parameters on a running or stopped
 * instance. When you modify the parameters on a running instance, the `GetInstance`
 * or `GetInstances` API operation initially responds with a state of
 * `pending`. After the parameter modifications are successfully applied, the state
 * changes to `applied` in subsequent `GetInstance` or
 * `GetInstances` API calls. For more information, see Use IMDSv2 with an Amazon Lightsail instance in the *Amazon Lightsail Developer Guide*.
 */
export const updateInstanceMetadataOptions: (
  input: UpdateInstanceMetadataOptionsRequest,
) => effect.Effect<
  UpdateInstanceMetadataOptionsResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateInstanceMetadataOptionsRequest,
  output: UpdateInstanceMetadataOptionsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Updates the specified attribute for a load balancer. You can only update one attribute at
 * a time.
 *
 * The `update load balancer attribute` operation supports tag-based access
 * control via resource tags applied to the resource identified by load balancer
 * name. For more information, see the Amazon Lightsail Developer Guide.
 */
export const updateLoadBalancerAttribute: (
  input: UpdateLoadBalancerAttributeRequest,
) => effect.Effect<
  UpdateLoadBalancerAttributeResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLoadBalancerAttributeRequest,
  output: UpdateLoadBalancerAttributeResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Allows the update of one or more attributes of a database in Amazon Lightsail.
 *
 * Updates are applied immediately, or in cases where the updates could result in an outage,
 * are applied during the database's predefined maintenance window.
 *
 * The `update relational database` operation supports tag-based access control
 * via resource tags applied to the resource identified by relationalDatabaseName. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const updateRelationalDatabase: (
  input: UpdateRelationalDatabaseRequest,
) => effect.Effect<
  UpdateRelationalDatabaseResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRelationalDatabaseRequest,
  output: UpdateRelationalDatabaseResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Downloads the regional Amazon Lightsail default key pair.
 *
 * This action also creates a Lightsail default key pair if a default key pair
 * does not currently exist in the Amazon Web Services Region.
 */
export const downloadDefaultKeyPair: (
  input: DownloadDefaultKeyPairRequest,
) => effect.Effect<
  DownloadDefaultKeyPairResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DownloadDefaultKeyPairRequest,
  output: DownloadDefaultKeyPairResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns a Boolean value indicating whether your Lightsail VPC is peered.
 */
export const isVpcPeered: (
  input: IsVpcPeeredRequest,
) => effect.Effect<
  IsVpcPeeredResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: IsVpcPeeredRequest,
  output: IsVpcPeeredResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Unpeers the Lightsail VPC from the user's default VPC.
 */
export const unpeerVpc: (
  input: UnpeerVpcRequest,
) => effect.Effect<
  UnpeerVpcResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UnpeerVpcRequest,
  output: UnpeerVpcResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Allocates a static IP address.
 */
export const allocateStaticIp: (
  input: AllocateStaticIpRequest,
) => effect.Effect<
  AllocateStaticIpResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AllocateStaticIpRequest,
  output: AllocateStaticIpResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Attaches a block storage disk to a running or stopped Lightsail instance and exposes it
 * to the instance with the specified disk name.
 *
 * The `attach disk` operation supports tag-based access control via resource tags
 * applied to the resource identified by `disk name`. For more information, see the
 * Amazon Lightsail Developer Guide.
 */
export const attachDisk: (
  input: AttachDiskRequest,
) => effect.Effect<
  AttachDiskResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachDiskRequest,
  output: AttachDiskResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Attaches one or more Lightsail instances to a load balancer.
 *
 * After some time, the instances are attached to the load balancer and the health check
 * status is available.
 *
 * The `attach instances to load balancer` operation supports tag-based access
 * control via resource tags applied to the resource identified by load balancer
 * name. For more information, see the Lightsail Developer Guide.
 */
export const attachInstancesToLoadBalancer: (
  input: AttachInstancesToLoadBalancerRequest,
) => effect.Effect<
  AttachInstancesToLoadBalancerResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachInstancesToLoadBalancerRequest,
  output: AttachInstancesToLoadBalancerResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Attaches a Transport Layer Security (TLS) certificate to your load balancer. TLS is just
 * an updated, more secure version of Secure Socket Layer (SSL).
 *
 * Once you create and validate your certificate, you can attach it to your load balancer.
 * You can also use this API to rotate the certificates on your account. Use the
 * `AttachLoadBalancerTlsCertificate` action with the non-attached certificate, and
 * it will replace the existing one and become the attached certificate.
 *
 * The `AttachLoadBalancerTlsCertificate` operation supports tag-based access
 * control via resource tags applied to the resource identified by load balancer
 * name. For more information, see the Amazon Lightsail Developer Guide.
 */
export const attachLoadBalancerTlsCertificate: (
  input: AttachLoadBalancerTlsCertificateRequest,
) => effect.Effect<
  AttachLoadBalancerTlsCertificateResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachLoadBalancerTlsCertificateRequest,
  output: AttachLoadBalancerTlsCertificateResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Attaches a static IP address to a specific Amazon Lightsail instance.
 */
export const attachStaticIp: (
  input: AttachStaticIpRequest,
) => effect.Effect<
  AttachStaticIpResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachStaticIpRequest,
  output: AttachStaticIpResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Copies a manual snapshot of an instance or disk as another manual snapshot, or copies an
 * automatic snapshot of an instance or disk as a manual snapshot. This operation can also be
 * used to copy a manual or automatic snapshot of an instance or a disk from one Amazon Web Services Region to another in Amazon Lightsail.
 *
 * When copying a *manual snapshot*, be sure to define the source
 * region, `source snapshot name`, and `target snapshot name`
 * parameters.
 *
 * When copying an *automatic snapshot*, be sure to define the
 * `source region`, `source resource name`, target snapshot
 * name, and either the `restore date` or the use latest restorable
 * auto snapshot parameters.
 */
export const copySnapshot: (
  input: CopySnapshotRequest,
) => effect.Effect<
  CopySnapshotResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopySnapshotRequest,
  output: CopySnapshotResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates a block storage disk from a manual or automatic snapshot of a disk. The resulting
 * disk can be attached to an Amazon Lightsail instance in the same Availability Zone
 * (`us-east-2a`).
 *
 * The `create disk from snapshot` operation supports tag-based access control via
 * request tags and resource tags applied to the resource identified by disk snapshot
 * name. For more information, see the Amazon Lightsail Developer Guide.
 */
export const createDiskFromSnapshot: (
  input: CreateDiskFromSnapshotRequest,
) => effect.Effect<
  CreateDiskFromSnapshotResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDiskFromSnapshotRequest,
  output: CreateDiskFromSnapshotResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates a snapshot of a block storage disk. You can use snapshots for backups, to make
 * copies of disks, and to save data before shutting down a Lightsail instance.
 *
 * You can take a snapshot of an attached disk that is in use; however, snapshots only
 * capture data that has been written to your disk at the time the snapshot command is issued.
 * This may exclude any data that has been cached by any applications or the operating system. If
 * you can pause any file systems on the disk long enough to take a snapshot, your snapshot
 * should be complete. Nevertheless, if you cannot pause all file writes to the disk, you should
 * unmount the disk from within the Lightsail instance, issue the create disk snapshot command,
 * and then remount the disk to ensure a consistent and complete snapshot. You may remount and
 * use your disk while the snapshot status is pending.
 *
 * You can also use this operation to create a snapshot of an instance's system volume. You
 * might want to do this, for example, to recover data from the system volume of a botched
 * instance or to create a backup of the system volume like you would for a block storage disk.
 * To create a snapshot of a system volume, just define the `instance name` parameter
 * when issuing the snapshot command, and a snapshot of the defined instance's system volume will
 * be created. After the snapshot is available, you can create a block storage disk from the
 * snapshot and attach it to a running instance to access the data on the disk.
 *
 * The `create disk snapshot` operation supports tag-based access control via
 * request tags. For more information, see the Amazon Lightsail Developer Guide.
 */
export const createDiskSnapshot: (
  input: CreateDiskSnapshotRequest,
) => effect.Effect<
  CreateDiskSnapshotResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDiskSnapshotRequest,
  output: CreateDiskSnapshotResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates a domain resource for the specified domain (example.com).
 *
 * The `create domain` operation supports tag-based access control via request
 * tags. For more information, see the Amazon Lightsail Developer Guide.
 */
export const createDomain: (
  input: CreateDomainRequest,
) => effect.Effect<
  CreateDomainResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDomainRequest,
  output: CreateDomainResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates one or more Amazon Lightsail instances.
 *
 * The `create instances` operation supports tag-based access control via request
 * tags. For more information, see the Lightsail Developer Guide.
 */
export const createInstances: (
  input: CreateInstancesRequest,
) => effect.Effect<
  CreateInstancesResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateInstancesRequest,
  output: CreateInstancesResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates a snapshot of a specific virtual private server, or *instance*.
 * You can use a snapshot to create a new instance that is based on that snapshot.
 *
 * The `create instance snapshot` operation supports tag-based access control via
 * request tags. For more information, see the Amazon Lightsail Developer Guide.
 */
export const createInstanceSnapshot: (
  input: CreateInstanceSnapshotRequest,
) => effect.Effect<
  CreateInstanceSnapshotResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateInstanceSnapshotRequest,
  output: CreateInstanceSnapshotResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates a Lightsail load balancer. To learn more about deciding whether to load balance
 * your application, see Configure your Lightsail instances for load balancing. You can create up to 10
 * load balancers per AWS Region in your account.
 *
 * When you create a load balancer, you can specify a unique name and port settings. To
 * change additional load balancer settings, use the `UpdateLoadBalancerAttribute`
 * operation.
 *
 * The `create load balancer` operation supports tag-based access control via
 * request tags. For more information, see the Amazon Lightsail Developer Guide.
 */
export const createLoadBalancer: (
  input: CreateLoadBalancerRequest,
) => effect.Effect<
  CreateLoadBalancerResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLoadBalancerRequest,
  output: CreateLoadBalancerResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates an SSL/TLS certificate for an Amazon Lightsail load balancer.
 *
 * TLS is just an updated, more secure version of Secure Socket Layer (SSL).
 *
 * The `CreateLoadBalancerTlsCertificate` operation supports tag-based access
 * control via resource tags applied to the resource identified by load balancer
 * name. For more information, see the Amazon Lightsail Developer Guide.
 */
export const createLoadBalancerTlsCertificate: (
  input: CreateLoadBalancerTlsCertificateRequest,
) => effect.Effect<
  CreateLoadBalancerTlsCertificateResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLoadBalancerTlsCertificateRequest,
  output: CreateLoadBalancerTlsCertificateResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates a new database in Amazon Lightsail.
 *
 * The `create relational database` operation supports tag-based access control
 * via request tags. For more information, see the Amazon Lightsail Developer Guide.
 */
export const createRelationalDatabase: (
  input: CreateRelationalDatabaseRequest,
) => effect.Effect<
  CreateRelationalDatabaseResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRelationalDatabaseRequest,
  output: CreateRelationalDatabaseResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates a new database from an existing database snapshot in Amazon Lightsail.
 *
 * You can create a new database from a snapshot in if something goes wrong with your
 * original database, or to change it to a different plan, such as a high availability or
 * standard plan.
 *
 * The `create relational database from snapshot` operation supports tag-based
 * access control via request tags and resource tags applied to the resource identified by
 * relationalDatabaseSnapshotName. For more information, see the Amazon Lightsail Developer Guide.
 */
export const createRelationalDatabaseFromSnapshot: (
  input: CreateRelationalDatabaseFromSnapshotRequest,
) => effect.Effect<
  CreateRelationalDatabaseFromSnapshotResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRelationalDatabaseFromSnapshotRequest,
  output: CreateRelationalDatabaseFromSnapshotResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates a snapshot of your database in Amazon Lightsail. You can use snapshots for backups,
 * to make copies of a database, and to save data before deleting a database.
 *
 * The `create relational database snapshot` operation supports tag-based access
 * control via request tags. For more information, see the Amazon Lightsail Developer Guide.
 */
export const createRelationalDatabaseSnapshot: (
  input: CreateRelationalDatabaseSnapshotRequest,
) => effect.Effect<
  CreateRelationalDatabaseSnapshotResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRelationalDatabaseSnapshotRequest,
  output: CreateRelationalDatabaseSnapshotResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Closes ports for a specific Amazon Lightsail instance.
 *
 * The `CloseInstancePublicPorts` action supports tag-based access control via
 * resource tags applied to the resource identified by `instanceName`. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const closeInstancePublicPorts: (
  input: CloseInstancePublicPortsRequest,
) => effect.Effect<
  CloseInstancePublicPortsResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CloseInstancePublicPortsRequest,
  output: CloseInstancePublicPortsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates an AWS CloudFormation stack, which creates a new Amazon EC2 instance from an exported
 * Amazon Lightsail snapshot. This operation results in a CloudFormation stack record that can be
 * used to track the AWS CloudFormation stack created. Use the get cloud formation stack
 * records operation to get a list of the CloudFormation stacks created.
 *
 * Wait until after your new Amazon EC2 instance is created before running the create
 * cloud formation stack operation again with the same export snapshot record.
 */
export const createCloudFormationStack: (
  input: CreateCloudFormationStackRequest,
) => effect.Effect<
  CreateCloudFormationStackResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCloudFormationStackRequest,
  output: CreateCloudFormationStackResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates a custom SSH key pair that you can use with an Amazon Lightsail
 * instance.
 *
 * Use the DownloadDefaultKeyPair action to create a Lightsail default key
 * pair in an Amazon Web Services Region where a default key pair does not currently
 * exist.
 *
 * The `create key pair` operation supports tag-based access control via request
 * tags. For more information, see the Amazon Lightsail Developer Guide.
 */
export const createKeyPair: (
  input: CreateKeyPairRequest,
) => effect.Effect<
  CreateKeyPairResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKeyPairRequest,
  output: CreateKeyPairResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates a block storage disk that can be attached to an Amazon Lightsail instance in the
 * same Availability Zone (`us-east-2a`).
 *
 * The `create disk` operation supports tag-based access control via request tags.
 * For more information, see the Amazon Lightsail Developer Guide.
 */
export const createDisk: (
  input: CreateDiskRequest,
) => effect.Effect<
  CreateDiskResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDiskRequest,
  output: CreateDiskResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates an Amazon Lightsail content delivery network (CDN) distribution.
 *
 * A distribution is a globally distributed network of caching servers that improve the
 * performance of your website or web application hosted on a Lightsail instance. For more
 * information, see Content delivery networks in Amazon Lightsail.
 */
export const createDistribution: (
  input: CreateDistributionRequest,
) => effect.Effect<
  CreateDistributionResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDistributionRequest,
  output: CreateDistributionResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates one of the following domain name system (DNS) records in a domain DNS zone:
 * Address (A), canonical name (CNAME), mail exchanger (MX), name server (NS), start of authority
 * (SOA), service locator (SRV), or text (TXT).
 *
 * The `create domain entry` operation supports tag-based access control via
 * resource tags applied to the resource identified by `domain name`. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const createDomainEntry: (
  input: CreateDomainEntryRequest,
) => effect.Effect<
  CreateDomainEntryResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDomainEntryRequest,
  output: CreateDomainEntryResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates one or more new instances from a manual or automatic snapshot of an
 * instance.
 *
 * The `create instances from snapshot` operation supports tag-based access
 * control via request tags and resource tags applied to the resource identified by
 * `instance snapshot name`. For more information, see the Amazon Lightsail Developer Guide.
 */
export const createInstancesFromSnapshot: (
  input: CreateInstancesFromSnapshotRequest,
) => effect.Effect<
  CreateInstancesFromSnapshotResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateInstancesFromSnapshotRequest,
  output: CreateInstancesFromSnapshotResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the deployments for your Amazon Lightsail container service
 *
 * A deployment specifies the settings, such as the ports and launch command, of containers
 * that are deployed to your container service.
 *
 * The deployments are ordered by version in ascending order. The newest version is listed at
 * the top of the response.
 *
 * A set number of deployments are kept before the oldest one is replaced with the newest
 * one. For more information, see Amazon Lightsail
 * endpoints and quotas in the Amazon Web Services General
 * Reference.
 */
export const getContainerServiceDeployments: (
  input: GetContainerServiceDeploymentsRequest,
) => effect.Effect<
  GetContainerServiceDeploymentsResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContainerServiceDeploymentsRequest,
  output: GetContainerServiceDeploymentsResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns detailed information for five of the most recent `SetupInstanceHttps`
 * requests that were ran on the target instance.
 */
export const getSetupHistory: (
  input: GetSetupHistoryRequest,
) => effect.Effect<
  GetSetupHistoryResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSetupHistoryRequest,
  output: GetSetupHistoryResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Updates an existing Amazon Lightsail bucket.
 *
 * Use this action to update the configuration of an existing bucket, such as versioning,
 * public accessibility, and the Amazon Web Services accounts that can access the bucket.
 */
export const updateBucket: (
  input: UpdateBucketRequest,
) => effect.Effect<
  UpdateBucketResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBucketRequest,
  output: UpdateBucketResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the data points of a specific metric for an Amazon Lightsail bucket.
 *
 * Metrics report the utilization of a bucket. View and collect metric data regularly to
 * monitor the number of objects stored in a bucket (including object versions) and the storage
 * space used by those objects.
 */
export const getBucketMetricData: (
  input: GetBucketMetricDataRequest,
) => effect.Effect<
  GetBucketMetricDataResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketMetricDataRequest,
  output: GetBucketMetricDataResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the container images that are registered to your Amazon Lightsail container
 * service.
 *
 * If you created a deployment on your Lightsail container service that uses container
 * images from a public registry like Docker Hub, those images are not returned as part of this
 * action. Those images are not registered to your Lightsail container service.
 */
export const getContainerImages: (
  input: GetContainerImagesRequest,
) => effect.Effect<
  GetContainerImagesResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContainerImagesRequest,
  output: GetContainerImagesResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the log events of a container of your Amazon Lightsail container service.
 *
 * If your container service has more than one node (i.e., a scale greater than 1), then the
 * log events that are returned for the specified container are merged from all nodes on your
 * container service.
 *
 * Container logs are retained for a certain amount of time. For more information, see
 * Amazon Lightsail
 * endpoints and quotas in the Amazon Web Services General
 * Reference.
 */
export const getContainerLog: (
  input: GetContainerLogRequest,
) => effect.Effect<
  GetContainerLogResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContainerLogRequest,
  output: GetContainerLogResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the existing access key IDs for the specified Amazon Lightsail bucket.
 *
 * This action does not return the secret access key value of an access key. You can get a
 * secret access key only when you create it from the response of the CreateBucketAccessKey action. If you lose the secret access key, you must create
 * a new access key.
 */
export const getBucketAccessKeys: (
  input: GetBucketAccessKeysRequest,
) => effect.Effect<
  GetBucketAccessKeysResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketAccessKeysRequest,
  output: GetBucketAccessKeysResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about one or more Amazon Lightsail SSL/TLS certificates.
 *
 * To get a summary of a certificate, omit `includeCertificateDetails` from your
 * request. The response will include only the certificate Amazon Resource Name (ARN),
 * certificate name, domain name, and tags.
 */
export const getCertificates: (
  input: GetCertificatesRequest,
) => effect.Effect<
  GetCertificatesResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCertificatesRequest,
  output: GetCertificatesResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the data points of a specific metric of your Amazon Lightsail container
 * service.
 *
 * Metrics report the utilization of your resources. Monitor and collect metric data
 * regularly to maintain the reliability, availability, and performance of your resources.
 */
export const getContainerServiceMetricData: (
  input: GetContainerServiceMetricDataRequest,
) => effect.Effect<
  GetContainerServiceMetricDataResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContainerServiceMetricDataRequest,
  output: GetContainerServiceMetricDataResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the list of powers that can be specified for your Amazon Lightsail container
 * services.
 *
 * The power specifies the amount of memory, the number of vCPUs, and the base price of the
 * container service.
 */
export const getContainerServicePowers: (
  input: GetContainerServicePowersRequest,
) => effect.Effect<
  GetContainerServicePowersResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContainerServicePowersRequest,
  output: GetContainerServicePowersResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Registers a container image to your Amazon Lightsail container service.
 *
 * This action is not required if you install and use the Lightsail Control
 * (lightsailctl) plugin to push container images to your Lightsail container service. For
 * more information, see Pushing and managing container images on your Amazon Lightsail container services
 * in the *Amazon Lightsail Developer Guide*.
 */
export const registerContainerImage: (
  input: RegisterContainerImageRequest,
) => effect.Effect<
  RegisterContainerImageResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterContainerImageRequest,
  output: RegisterContainerImageResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Sets the Amazon Lightsail resources that can access the specified Lightsail
 * bucket.
 *
 * Lightsail buckets currently support setting access for Lightsail instances in the same
 * Amazon Web Services Region.
 */
export const setResourceAccessForBucket: (
  input: SetResourceAccessForBucketRequest,
) => effect.Effect<
  SetResourceAccessForBucketResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetResourceAccessForBucketRequest,
  output: SetResourceAccessForBucketResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates an SSL/TLS certificate that secures traffic for your website. After the
 * certificate is created, it is installed on the specified Lightsail instance.
 *
 * If you provide more than one domain name in the request, at least one name must be less
 * than or equal to 63 characters in length.
 */
export const setupInstanceHttps: (
  input: SetupInstanceHttpsRequest,
) => effect.Effect<
  SetupInstanceHttpsResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetupInstanceHttpsRequest,
  output: SetupInstanceHttpsResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Initiates a graphical user interface (GUI) session that’s used to access a virtual
 * computer’s operating system and application. The session will be active for 1 hour. Use this
 * action to resume the session after it expires.
 */
export const startGUISession: (
  input: StartGUISessionRequest,
) => effect.Effect<
  StartGUISessionResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartGUISessionRequest,
  output: StartGUISessionResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Terminates a web-based Amazon DCV session that’s used to access a virtual computer’s
 * operating system or application. The session will close and any unsaved data will be
 * lost.
 */
export const stopGUISession: (
  input: StopGUISessionRequest,
) => effect.Effect<
  StopGUISessionResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopGUISessionRequest,
  output: StopGUISessionResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Updates the bundle, or storage plan, of an existing Amazon Lightsail bucket.
 *
 * A bucket bundle specifies the monthly cost, storage space, and data transfer quota for a
 * bucket. You can update a bucket's bundle only one time within a monthly Amazon Web Services
 * billing cycle. To determine if you can update a bucket's bundle, use the GetBuckets action. The
 * `ableToUpdateBundle` parameter in the response will indicate whether you can
 * currently update a bucket's bundle.
 *
 * Update a bucket's bundle if it's consistently going over its storage space or data
 * transfer quota, or if a bucket's usage is consistently in the lower range of its storage space
 * or data transfer quota. Due to the unpredictable usage fluctuations that a bucket might
 * experience, we strongly recommend that you update a bucket's bundle only as a long-term
 * strategy, instead of as a short-term, monthly cost-cutting measure. Choose a bucket bundle
 * that will provide the bucket with ample storage space and data transfer for a long time to
 * come.
 */
export const updateBucketBundle: (
  input: UpdateBucketBundleRequest,
) => effect.Effect<
  UpdateBucketBundleResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBucketBundleRequest,
  output: UpdateBucketBundleResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Updates the configuration of your Amazon Lightsail container service, such as its power,
 * scale, and public domain names.
 */
export const updateContainerService: (
  input: UpdateContainerServiceRequest,
) => effect.Effect<
  UpdateContainerServiceResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateContainerServiceRequest,
  output: UpdateContainerServiceResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes your Amazon Lightsail container service.
 */
export const deleteContainerService: (
  input: DeleteContainerServiceRequest,
) => effect.Effect<
  DeleteContainerServiceResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteContainerServiceRequest,
  output: DeleteContainerServiceResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates a temporary set of log in credentials that you can use to log in to the Docker
 * process on your local machine. After you're logged in, you can use the native Docker commands
 * to push your local container images to the container image registry of your Amazon Lightsail
 * account so that you can use them with your Lightsail container service. The log in
 * credentials expire 12 hours after they are created, at which point you will need to create a
 * new set of log in credentials.
 *
 * You can only push container images to the container service registry of your Lightsail
 * account. You cannot pull container images or perform any other container image management
 * actions on the container service registry.
 *
 * After you push your container images to the container image registry of your Lightsail
 * account, use the `RegisterContainerImage` action to register the pushed images to a
 * specific Lightsail container service.
 *
 * This action is not required if you install and use the Lightsail Control
 * (lightsailctl) plugin to push container images to your Lightsail container service. For
 * more information, see Pushing and managing container images on your Amazon Lightsail container services
 * in the *Amazon Lightsail Developer Guide*.
 */
export const createContainerServiceRegistryLogin: (
  input: CreateContainerServiceRegistryLoginRequest,
) => effect.Effect<
  CreateContainerServiceRegistryLoginResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateContainerServiceRegistryLoginRequest,
  output: CreateContainerServiceRegistryLoginResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes a Amazon Lightsail bucket.
 *
 * When you delete your bucket, the bucket name is released and can be reused for a new
 * bucket in your account or another Amazon Web Services account.
 */
export const deleteBucket: (
  input: DeleteBucketRequest,
) => effect.Effect<
  DeleteBucketResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBucketRequest,
  output: DeleteBucketResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes an access key for the specified Amazon Lightsail bucket.
 *
 * We recommend that you delete an access key if the secret access key is compromised.
 *
 * For more information about access keys, see Creating access keys for a bucket in Amazon Lightsail in the
 * *Amazon Lightsail Developer Guide*.
 */
export const deleteBucketAccessKey: (
  input: DeleteBucketAccessKeyRequest,
) => effect.Effect<
  DeleteBucketAccessKeyResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBucketAccessKeyRequest,
  output: DeleteBucketAccessKeyResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes an SSL/TLS certificate for your Amazon Lightsail content delivery network (CDN)
 * distribution.
 *
 * Certificates that are currently attached to a distribution cannot be deleted. Use the
 * `DetachCertificateFromDistribution` action to detach a certificate from a
 * distribution.
 */
export const deleteCertificate: (
  input: DeleteCertificateRequest,
) => effect.Effect<
  DeleteCertificateResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCertificateRequest,
  output: DeleteCertificateResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates two URLs that are used to access a virtual computer’s graphical user interface
 * (GUI) session. The primary URL initiates a web-based Amazon DCV session to the virtual
 * computer's application. The secondary URL initiates a web-based Amazon DCV session to the
 * virtual computer's operating session.
 *
 * Use `StartGUISession` to open the session.
 */
export const createGUISessionAccessDetails: (
  input: CreateGUISessionAccessDetailsRequest,
) => effect.Effect<
  CreateGUISessionAccessDetailsResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGUISessionAccessDetailsRequest,
  output: CreateGUISessionAccessDetailsResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates a new access key for the specified Amazon Lightsail bucket. Access keys consist of
 * an access key ID and corresponding secret access key.
 *
 * Access keys grant full programmatic access to the specified bucket and its objects. You
 * can have a maximum of two access keys per bucket. Use the GetBucketAccessKeys action to get a list of current access keys for a specific bucket. For more
 * information about access keys, see Creating access keys for a bucket in Amazon Lightsail in the
 * *Amazon Lightsail Developer Guide*.
 *
 * The `secretAccessKey` value is returned only in response to the
 * `CreateBucketAccessKey` action. You can get a secret access key only when you
 * first create an access key; you cannot get the secret access key later. If you lose the
 * secret access key, you must create a new access key.
 */
export const createBucketAccessKey: (
  input: CreateBucketAccessKeyRequest,
) => effect.Effect<
  CreateBucketAccessKeyResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBucketAccessKeyRequest,
  output: CreateBucketAccessKeyResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates an Amazon Lightsail container service.
 *
 * A Lightsail container service is a compute resource to which you can deploy containers.
 * For more information, see Container services in Amazon Lightsail in the Lightsail Dev
 * Guide.
 */
export const createContainerService: (
  input: CreateContainerServiceRequest,
) => effect.Effect<
  CreateContainerServiceResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateContainerServiceRequest,
  output: CreateContainerServiceResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns a list of TLS security policies that you can apply to Lightsail load
 * balancers.
 *
 * For more information about load balancer TLS security policies, see Configuring TLS security policies on your Amazon Lightsail load
 * balancers in the *Amazon Lightsail Developer Guide*.
 */
export const getLoadBalancerTlsPolicies: (
  input: GetLoadBalancerTlsPoliciesRequest,
) => effect.Effect<
  GetLoadBalancerTlsPoliciesResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLoadBalancerTlsPoliciesRequest,
  output: GetLoadBalancerTlsPoliciesResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates an Amazon Lightsail bucket.
 *
 * A bucket is a cloud storage resource available in the Lightsail object storage service.
 * Use buckets to store objects such as data and its descriptive metadata. For more information
 * about buckets, see Buckets in Amazon Lightsail in the Amazon Lightsail Developer
 * Guide.
 */
export const createBucket: (
  input: CreateBucketRequest,
) => effect.Effect<
  CreateBucketResult,
  | AccessDeniedException
  | InvalidInputException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBucketRequest,
  output: CreateBucketResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the bundles that you can apply to a Amazon Lightsail bucket.
 *
 * The bucket bundle specifies the monthly cost, storage quota, and data transfer quota for a
 * bucket.
 *
 * Use the UpdateBucketBundle action to update the
 * bundle for a bucket.
 */
export const getBucketBundles: (
  input: GetBucketBundlesRequest,
) => effect.Effect<
  GetBucketBundlesResult,
  | AccessDeniedException
  | InvalidInputException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketBundlesRequest,
  output: GetBucketBundlesResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes a container image that is registered to your Amazon Lightsail container
 * service.
 */
export const deleteContainerImage: (
  input: DeleteContainerImageRequest,
) => effect.Effect<
  DeleteContainerImageResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteContainerImageRequest,
  output: DeleteContainerImageResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about one or more Amazon Lightsail buckets. The information returned
 * includes the synchronization status of the Amazon Simple Storage Service (Amazon S3)
 * account-level block public access feature for your Lightsail buckets.
 *
 * For more information about buckets, see Buckets in Amazon Lightsail in the Amazon Lightsail Developer
 * Guide.
 */
export const getBuckets: (
  input: GetBucketsRequest,
) => effect.Effect<
  GetBucketsResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketsRequest,
  output: GetBucketsResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates a deployment for your Amazon Lightsail container service.
 *
 * A deployment specifies the containers that will be launched on the container service and
 * their settings, such as the ports to open, the environment variables to apply, and the launch
 * command to run. It also specifies the container that will serve as the public endpoint of the
 * deployment and its settings, such as the HTTP or HTTPS port to use, and the health check
 * configuration.
 *
 * You can deploy containers to your container service using container images from a public
 * registry such as Amazon ECR Public, or from your local machine. For more information, see
 * Creating container images for your Amazon Lightsail container services in the
 * *Amazon Lightsail Developer Guide*.
 */
export const createContainerServiceDeployment: (
  input: CreateContainerServiceDeploymentRequest,
) => effect.Effect<
  CreateContainerServiceDeploymentResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateContainerServiceDeploymentRequest,
  output: CreateContainerServiceDeploymentResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about the configured alarms. Specify an alarm name in your request to
 * return information about a specific alarm, or specify a monitored resource name to return
 * information about all alarms for a specific resource.
 *
 * An alarm is used to monitor a single metric for one of your resources. When a metric
 * condition is met, the alarm can notify you by email, SMS text message, and a banner displayed
 * on the Amazon Lightsail console. For more information, see Alarms
 * in Amazon Lightsail.
 */
export const getAlarms: (
  input: GetAlarmsRequest,
) => effect.Effect<
  GetAlarmsResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAlarmsRequest,
  output: GetAlarmsResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates an SSL/TLS certificate for an Amazon Lightsail content delivery network (CDN)
 * distribution and a container service.
 *
 * After the certificate is valid, use the `AttachCertificateToDistribution`
 * action to use the certificate and its domains with your distribution. Or use the
 * `UpdateContainerService` action to use the certificate and its domains with your
 * container service.
 *
 * Only certificates created in the `us-east-1`
 * Amazon Web Services Region can be attached to Lightsail distributions. Lightsail
 * distributions are global resources that can reference an origin in any Amazon Web Services
 * Region, and distribute its content globally. However, all distributions are located in the
 * `us-east-1` Region.
 */
export const createCertificate: (
  input: CreateCertificateRequest,
) => effect.Effect<
  CreateCertificateResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCertificateRequest,
  output: CreateCertificateResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Retrieves information about the cost estimate for a specified resource. A cost estimate
 * will not generate for a resource that has been deleted.
 */
export const getCostEstimate: (
  input: GetCostEstimateRequest,
) => effect.Effect<
  GetCostEstimateResult,
  | AccessDeniedException
  | InvalidInputException
  | NotFoundException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCostEstimateRequest,
  output: GetCostEstimateResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns all export snapshot records created as a result of the export
 * snapshot operation.
 *
 * An export snapshot record can be used to create a new Amazon EC2 instance and its related
 * resources with the CreateCloudFormationStack
 * action.
 */
export const getExportSnapshotRecords: (
  input: GetExportSnapshotRecordsRequest,
) => effect.Effect<
  GetExportSnapshotRecordsResult,
  | AccessDeniedException
  | AccountSetupInProgressException
  | InvalidInputException
  | NotFoundException
  | OperationFailureException
  | RegionSetupInProgressException
  | ServiceException
  | UnauthenticatedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetExportSnapshotRecordsRequest,
  output: GetExportSnapshotRecordsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
