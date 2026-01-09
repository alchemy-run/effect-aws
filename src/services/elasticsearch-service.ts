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
const ns = T.XmlNamespace("http://es.amazonaws.com/doc/2015-01-01/");
const svc = T.AwsApiService({
  sdkId: "Elasticsearch Service",
  serviceShapeName: "AmazonElasticsearchService2015",
});
const auth = T.AwsAuthSigv4({ name: "es" });
const ver = T.ServiceVersion("2015-01-01");
const proto = T.AwsProtocolsRestJson1();
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
              `https://es-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://es-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            if ("aws" === _.getAttr(PartitionResult, "name")) {
              return e(`https://aos.${Region}.api.aws`);
            }
            if ("aws-cn" === _.getAttr(PartitionResult, "name")) {
              return e(`https://aos.${Region}.api.amazonwebservices.com.cn`);
            }
            if ("aws-us-gov" === _.getAttr(PartitionResult, "name")) {
              return e(`https://aos.${Region}.api.aws`);
            }
            return e(
              `https://es.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://es.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type CrossClusterSearchConnectionId = string;
export type ARN = string;
export type PackageID = string;
export type DomainName = string;
export type AWSAccount = string;
export type DryRun = boolean;
export type ElasticsearchVersionString = string;
export type PolicyDocument = string;
export type ConnectionAlias = string;
export type PackageName = string;
export type PackageDescription = string;
export type DomainArn = string;
export type ClientToken = string;
export type ErrorMessage = string;
export type VpcEndpointId = string;
export type MaxResults = number;
export type NextToken = string;
export type GUID = string;
export type ReservationToken = string;
export type InstanceCount = number;
export type CommitMessage = string;
export type TagKey = string;
export type TagValue = string;
export type IntegerClass = number;
export type UserPoolId = string;
export type IdentityPoolId = string;
export type RoleArn = string;
export type KmsKeyId = string;
export type DomainNameFqdn = string;
export type OwnerId = string;
export type Region = string;
export type S3BucketName = string;
export type S3Key = string;
export type NonEmptyString = string;
export type DescribePackagesFilterValue = string;
export type UpgradeName = string;
export type CloudWatchLogsLogGroupArn = string;
export type Username = string | redacted.Redacted<string>;
export type Password = string | redacted.Redacted<string>;
export type BackendRole = string;
export type StartAt = Date;
export type LastUpdated = Date;
export type PackageVersion = string;
export type ReferencePath = string;
export type DeploymentCloseDateTimeStamp = Date;
export type Endpoint = string;
export type DomainId = string;
export type ServiceUrl = string;
export type CreatedAt = Date;
export type UpdateTimestamp = Date;
export type TotalNumberOfStages = number;
export type InstanceRole = string;
export type StartTimestamp = Date;
export type Message = string;
export type SAMLMetadata = string;
export type SAMLEntityId = string;
export type DurationValue = number;
export type CrossClusterSearchConnectionStatusMessage = string;
export type ErrorType = string;
export type DisableTimestamp = Date;
export type ChangeProgressStageName = string;
export type ChangeProgressStageStatus = string;
export type Description = string;
export type Issue = string;
export type DeploymentType = string;
export type AutoTuneDate = Date;
export type ScheduledAutoTuneDescription = string;
export type UIntValue = number;
export type StorageTypeName = string;
export type StorageSubTypeName = string;
export type LimitName = string;
export type LimitValue = string;
export type MinimumInstanceCount = number;
export type MaximumInstanceCount = number;

//# Schemas
export interface DeleteElasticsearchServiceRoleRequest {}
export const DeleteElasticsearchServiceRoleRequest = S.suspend(() =>
  S.Struct({}).pipe(
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
  identifier: "DeleteElasticsearchServiceRoleRequest",
}) as any as S.Schema<DeleteElasticsearchServiceRoleRequest>;
export interface DeleteElasticsearchServiceRoleResponse {}
export const DeleteElasticsearchServiceRoleResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteElasticsearchServiceRoleResponse",
}) as any as S.Schema<DeleteElasticsearchServiceRoleResponse>;
export type PackageType = "TXT-DICTIONARY" | (string & {});
export const PackageType = S.String;
export type DomainNameList = string[];
export const DomainNameList = S.Array(S.String);
export type ESPartitionInstanceType =
  | "m3.medium.elasticsearch"
  | "m3.large.elasticsearch"
  | "m3.xlarge.elasticsearch"
  | "m3.2xlarge.elasticsearch"
  | "m4.large.elasticsearch"
  | "m4.xlarge.elasticsearch"
  | "m4.2xlarge.elasticsearch"
  | "m4.4xlarge.elasticsearch"
  | "m4.10xlarge.elasticsearch"
  | "m5.large.elasticsearch"
  | "m5.xlarge.elasticsearch"
  | "m5.2xlarge.elasticsearch"
  | "m5.4xlarge.elasticsearch"
  | "m5.12xlarge.elasticsearch"
  | "r5.large.elasticsearch"
  | "r5.xlarge.elasticsearch"
  | "r5.2xlarge.elasticsearch"
  | "r5.4xlarge.elasticsearch"
  | "r5.12xlarge.elasticsearch"
  | "c5.large.elasticsearch"
  | "c5.xlarge.elasticsearch"
  | "c5.2xlarge.elasticsearch"
  | "c5.4xlarge.elasticsearch"
  | "c5.9xlarge.elasticsearch"
  | "c5.18xlarge.elasticsearch"
  | "ultrawarm1.medium.elasticsearch"
  | "ultrawarm1.large.elasticsearch"
  | "t2.micro.elasticsearch"
  | "t2.small.elasticsearch"
  | "t2.medium.elasticsearch"
  | "r3.large.elasticsearch"
  | "r3.xlarge.elasticsearch"
  | "r3.2xlarge.elasticsearch"
  | "r3.4xlarge.elasticsearch"
  | "r3.8xlarge.elasticsearch"
  | "i2.xlarge.elasticsearch"
  | "i2.2xlarge.elasticsearch"
  | "d2.xlarge.elasticsearch"
  | "d2.2xlarge.elasticsearch"
  | "d2.4xlarge.elasticsearch"
  | "d2.8xlarge.elasticsearch"
  | "c4.large.elasticsearch"
  | "c4.xlarge.elasticsearch"
  | "c4.2xlarge.elasticsearch"
  | "c4.4xlarge.elasticsearch"
  | "c4.8xlarge.elasticsearch"
  | "r4.large.elasticsearch"
  | "r4.xlarge.elasticsearch"
  | "r4.2xlarge.elasticsearch"
  | "r4.4xlarge.elasticsearch"
  | "r4.8xlarge.elasticsearch"
  | "r4.16xlarge.elasticsearch"
  | "i3.large.elasticsearch"
  | "i3.xlarge.elasticsearch"
  | "i3.2xlarge.elasticsearch"
  | "i3.4xlarge.elasticsearch"
  | "i3.8xlarge.elasticsearch"
  | "i3.16xlarge.elasticsearch"
  | (string & {});
export const ESPartitionInstanceType = S.String;
export type VpcEndpointIdList = string[];
export const VpcEndpointIdList = S.Array(S.String);
export type EngineType = "OpenSearch" | "Elasticsearch" | (string & {});
export const EngineType = S.String;
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface AcceptInboundCrossClusterSearchConnectionRequest {
  CrossClusterSearchConnectionId: string;
}
export const AcceptInboundCrossClusterSearchConnectionRequest = S.suspend(() =>
  S.Struct({
    CrossClusterSearchConnectionId: S.String.pipe(
      T.HttpLabel("CrossClusterSearchConnectionId"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "PUT",
        uri: "/2015-01-01/es/ccs/inboundConnection/{CrossClusterSearchConnectionId}/accept",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AcceptInboundCrossClusterSearchConnectionRequest",
}) as any as S.Schema<AcceptInboundCrossClusterSearchConnectionRequest>;
export interface AssociatePackageRequest {
  PackageID: string;
  DomainName: string;
}
export const AssociatePackageRequest = S.suspend(() =>
  S.Struct({
    PackageID: S.String.pipe(T.HttpLabel("PackageID")),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2015-01-01/packages/associate/{PackageID}/{DomainName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociatePackageRequest",
}) as any as S.Schema<AssociatePackageRequest>;
export interface AuthorizeVpcEndpointAccessRequest {
  DomainName: string;
  Account: string;
}
export const AuthorizeVpcEndpointAccessRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Account: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2015-01-01/es/domain/{DomainName}/authorizeVpcEndpointAccess",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AuthorizeVpcEndpointAccessRequest",
}) as any as S.Schema<AuthorizeVpcEndpointAccessRequest>;
export interface CancelDomainConfigChangeRequest {
  DomainName: string;
  DryRun?: boolean;
}
export const CancelDomainConfigChangeRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2015-01-01/es/domain/{DomainName}/config/cancel",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelDomainConfigChangeRequest",
}) as any as S.Schema<CancelDomainConfigChangeRequest>;
export interface CancelElasticsearchServiceSoftwareUpdateRequest {
  DomainName: string;
}
export const CancelElasticsearchServiceSoftwareUpdateRequest = S.suspend(() =>
  S.Struct({ DomainName: S.String }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2015-01-01/es/serviceSoftwareUpdate/cancel",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelElasticsearchServiceSoftwareUpdateRequest",
}) as any as S.Schema<CancelElasticsearchServiceSoftwareUpdateRequest>;
export interface VPCOptions {
  SubnetIds?: string[];
  SecurityGroupIds?: string[];
}
export const VPCOptions = S.suspend(() =>
  S.Struct({
    SubnetIds: S.optional(StringList),
    SecurityGroupIds: S.optional(StringList),
  }),
).annotations({ identifier: "VPCOptions" }) as any as S.Schema<VPCOptions>;
export interface CreateVpcEndpointRequest {
  DomainArn: string;
  VpcOptions: VPCOptions;
  ClientToken?: string;
}
export const CreateVpcEndpointRequest = S.suspend(() =>
  S.Struct({
    DomainArn: S.String,
    VpcOptions: VPCOptions,
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2015-01-01/es/vpcEndpoints" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateVpcEndpointRequest",
}) as any as S.Schema<CreateVpcEndpointRequest>;
export interface DeleteElasticsearchDomainRequest {
  DomainName: string;
}
export const DeleteElasticsearchDomainRequest = S.suspend(() =>
  S.Struct({ DomainName: S.String.pipe(T.HttpLabel("DomainName")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/2015-01-01/es/domain/{DomainName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteElasticsearchDomainRequest",
}) as any as S.Schema<DeleteElasticsearchDomainRequest>;
export interface DeleteInboundCrossClusterSearchConnectionRequest {
  CrossClusterSearchConnectionId: string;
}
export const DeleteInboundCrossClusterSearchConnectionRequest = S.suspend(() =>
  S.Struct({
    CrossClusterSearchConnectionId: S.String.pipe(
      T.HttpLabel("CrossClusterSearchConnectionId"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/2015-01-01/es/ccs/inboundConnection/{CrossClusterSearchConnectionId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteInboundCrossClusterSearchConnectionRequest",
}) as any as S.Schema<DeleteInboundCrossClusterSearchConnectionRequest>;
export interface DeleteOutboundCrossClusterSearchConnectionRequest {
  CrossClusterSearchConnectionId: string;
}
export const DeleteOutboundCrossClusterSearchConnectionRequest = S.suspend(() =>
  S.Struct({
    CrossClusterSearchConnectionId: S.String.pipe(
      T.HttpLabel("CrossClusterSearchConnectionId"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/2015-01-01/es/ccs/outboundConnection/{CrossClusterSearchConnectionId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteOutboundCrossClusterSearchConnectionRequest",
}) as any as S.Schema<DeleteOutboundCrossClusterSearchConnectionRequest>;
export interface DeletePackageRequest {
  PackageID: string;
}
export const DeletePackageRequest = S.suspend(() =>
  S.Struct({ PackageID: S.String.pipe(T.HttpLabel("PackageID")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/2015-01-01/packages/{PackageID}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePackageRequest",
}) as any as S.Schema<DeletePackageRequest>;
export interface DeleteVpcEndpointRequest {
  VpcEndpointId: string;
}
export const DeleteVpcEndpointRequest = S.suspend(() =>
  S.Struct({ VpcEndpointId: S.String.pipe(T.HttpLabel("VpcEndpointId")) }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/2015-01-01/es/vpcEndpoints/{VpcEndpointId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteVpcEndpointRequest",
}) as any as S.Schema<DeleteVpcEndpointRequest>;
export interface DescribeDomainAutoTunesRequest {
  DomainName: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeDomainAutoTunesRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2015-01-01/es/domain/{DomainName}/autoTunes",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDomainAutoTunesRequest",
}) as any as S.Schema<DescribeDomainAutoTunesRequest>;
export interface DescribeDomainChangeProgressRequest {
  DomainName: string;
  ChangeId?: string;
}
export const DescribeDomainChangeProgressRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ChangeId: S.optional(S.String).pipe(T.HttpQuery("changeid")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2015-01-01/es/domain/{DomainName}/progress",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDomainChangeProgressRequest",
}) as any as S.Schema<DescribeDomainChangeProgressRequest>;
export interface DescribeElasticsearchDomainRequest {
  DomainName: string;
}
export const DescribeElasticsearchDomainRequest = S.suspend(() =>
  S.Struct({ DomainName: S.String.pipe(T.HttpLabel("DomainName")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2015-01-01/es/domain/{DomainName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeElasticsearchDomainRequest",
}) as any as S.Schema<DescribeElasticsearchDomainRequest>;
export interface DescribeElasticsearchDomainConfigRequest {
  DomainName: string;
}
export const DescribeElasticsearchDomainConfigRequest = S.suspend(() =>
  S.Struct({ DomainName: S.String.pipe(T.HttpLabel("DomainName")) }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2015-01-01/es/domain/{DomainName}/config",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeElasticsearchDomainConfigRequest",
}) as any as S.Schema<DescribeElasticsearchDomainConfigRequest>;
export interface DescribeElasticsearchDomainsRequest {
  DomainNames: string[];
}
export const DescribeElasticsearchDomainsRequest = S.suspend(() =>
  S.Struct({ DomainNames: DomainNameList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2015-01-01/es/domain-info" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeElasticsearchDomainsRequest",
}) as any as S.Schema<DescribeElasticsearchDomainsRequest>;
export interface DescribeElasticsearchInstanceTypeLimitsRequest {
  DomainName?: string;
  InstanceType: ESPartitionInstanceType;
  ElasticsearchVersion: string;
}
export const DescribeElasticsearchInstanceTypeLimitsRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.optional(S.String).pipe(T.HttpQuery("domainName")),
    InstanceType: ESPartitionInstanceType.pipe(T.HttpLabel("InstanceType")),
    ElasticsearchVersion: S.String.pipe(T.HttpLabel("ElasticsearchVersion")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2015-01-01/es/instanceTypeLimits/{ElasticsearchVersion}/{InstanceType}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeElasticsearchInstanceTypeLimitsRequest",
}) as any as S.Schema<DescribeElasticsearchInstanceTypeLimitsRequest>;
export type ValueStringList = string[];
export const ValueStringList = S.Array(S.String);
export interface Filter {
  Name?: string;
  Values?: string[];
}
export const Filter = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Values: S.optional(ValueStringList) }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type FilterList = Filter[];
export const FilterList = S.Array(Filter);
export interface DescribeOutboundCrossClusterSearchConnectionsRequest {
  Filters?: Filter[];
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeOutboundCrossClusterSearchConnectionsRequest = S.suspend(
  () =>
    S.Struct({
      Filters: S.optional(FilterList),
      MaxResults: S.optional(S.Number),
      NextToken: S.optional(S.String),
    }).pipe(
      T.all(
        ns,
        T.Http({
          method: "POST",
          uri: "/2015-01-01/es/ccs/outboundConnection/search",
        }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "DescribeOutboundCrossClusterSearchConnectionsRequest",
}) as any as S.Schema<DescribeOutboundCrossClusterSearchConnectionsRequest>;
export interface DescribeReservedElasticsearchInstanceOfferingsRequest {
  ReservedElasticsearchInstanceOfferingId?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeReservedElasticsearchInstanceOfferingsRequest = S.suspend(
  () =>
    S.Struct({
      ReservedElasticsearchInstanceOfferingId: S.optional(S.String).pipe(
        T.HttpQuery("offeringId"),
      ),
      MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
      NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    }).pipe(
      T.all(
        ns,
        T.Http({
          method: "GET",
          uri: "/2015-01-01/es/reservedInstanceOfferings",
        }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "DescribeReservedElasticsearchInstanceOfferingsRequest",
}) as any as S.Schema<DescribeReservedElasticsearchInstanceOfferingsRequest>;
export interface DescribeReservedElasticsearchInstancesRequest {
  ReservedElasticsearchInstanceId?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeReservedElasticsearchInstancesRequest = S.suspend(() =>
  S.Struct({
    ReservedElasticsearchInstanceId: S.optional(S.String).pipe(
      T.HttpQuery("reservationId"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2015-01-01/es/reservedInstances" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeReservedElasticsearchInstancesRequest",
}) as any as S.Schema<DescribeReservedElasticsearchInstancesRequest>;
export interface DescribeVpcEndpointsRequest {
  VpcEndpointIds: string[];
}
export const DescribeVpcEndpointsRequest = S.suspend(() =>
  S.Struct({ VpcEndpointIds: VpcEndpointIdList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2015-01-01/es/vpcEndpoints/describe" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeVpcEndpointsRequest",
}) as any as S.Schema<DescribeVpcEndpointsRequest>;
export interface DissociatePackageRequest {
  PackageID: string;
  DomainName: string;
}
export const DissociatePackageRequest = S.suspend(() =>
  S.Struct({
    PackageID: S.String.pipe(T.HttpLabel("PackageID")),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2015-01-01/packages/dissociate/{PackageID}/{DomainName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DissociatePackageRequest",
}) as any as S.Schema<DissociatePackageRequest>;
export interface GetCompatibleElasticsearchVersionsRequest {
  DomainName?: string;
}
export const GetCompatibleElasticsearchVersionsRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.optional(S.String).pipe(T.HttpQuery("domainName")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2015-01-01/es/compatibleVersions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCompatibleElasticsearchVersionsRequest",
}) as any as S.Schema<GetCompatibleElasticsearchVersionsRequest>;
export interface GetPackageVersionHistoryRequest {
  PackageID: string;
  MaxResults?: number;
  NextToken?: string;
}
export const GetPackageVersionHistoryRequest = S.suspend(() =>
  S.Struct({
    PackageID: S.String.pipe(T.HttpLabel("PackageID")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2015-01-01/packages/{PackageID}/history",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPackageVersionHistoryRequest",
}) as any as S.Schema<GetPackageVersionHistoryRequest>;
export interface GetUpgradeHistoryRequest {
  DomainName: string;
  MaxResults?: number;
  NextToken?: string;
}
export const GetUpgradeHistoryRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2015-01-01/es/upgradeDomain/{DomainName}/history",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetUpgradeHistoryRequest",
}) as any as S.Schema<GetUpgradeHistoryRequest>;
export interface GetUpgradeStatusRequest {
  DomainName: string;
}
export const GetUpgradeStatusRequest = S.suspend(() =>
  S.Struct({ DomainName: S.String.pipe(T.HttpLabel("DomainName")) }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2015-01-01/es/upgradeDomain/{DomainName}/status",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetUpgradeStatusRequest",
}) as any as S.Schema<GetUpgradeStatusRequest>;
export interface ListDomainNamesRequest {
  EngineType?: EngineType;
}
export const ListDomainNamesRequest = S.suspend(() =>
  S.Struct({
    EngineType: S.optional(EngineType).pipe(T.HttpQuery("engineType")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2015-01-01/domain" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDomainNamesRequest",
}) as any as S.Schema<ListDomainNamesRequest>;
export interface ListDomainsForPackageRequest {
  PackageID: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListDomainsForPackageRequest = S.suspend(() =>
  S.Struct({
    PackageID: S.String.pipe(T.HttpLabel("PackageID")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2015-01-01/packages/{PackageID}/domains",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDomainsForPackageRequest",
}) as any as S.Schema<ListDomainsForPackageRequest>;
export interface ListElasticsearchInstanceTypesRequest {
  ElasticsearchVersion: string;
  DomainName?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListElasticsearchInstanceTypesRequest = S.suspend(() =>
  S.Struct({
    ElasticsearchVersion: S.String.pipe(T.HttpLabel("ElasticsearchVersion")),
    DomainName: S.optional(S.String).pipe(T.HttpQuery("domainName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2015-01-01/es/instanceTypes/{ElasticsearchVersion}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListElasticsearchInstanceTypesRequest",
}) as any as S.Schema<ListElasticsearchInstanceTypesRequest>;
export interface ListElasticsearchVersionsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListElasticsearchVersionsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2015-01-01/es/versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListElasticsearchVersionsRequest",
}) as any as S.Schema<ListElasticsearchVersionsRequest>;
export interface ListPackagesForDomainRequest {
  DomainName: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListPackagesForDomainRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2015-01-01/domain/{DomainName}/packages",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPackagesForDomainRequest",
}) as any as S.Schema<ListPackagesForDomainRequest>;
export interface ListTagsRequest {
  ARN: string;
}
export const ListTagsRequest = S.suspend(() =>
  S.Struct({ ARN: S.String.pipe(T.HttpQuery("arn")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2015-01-01/tags" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsRequest",
}) as any as S.Schema<ListTagsRequest>;
export interface ListVpcEndpointAccessRequest {
  DomainName: string;
  NextToken?: string;
}
export const ListVpcEndpointAccessRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2015-01-01/es/domain/{DomainName}/listVpcEndpointAccess",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVpcEndpointAccessRequest",
}) as any as S.Schema<ListVpcEndpointAccessRequest>;
export interface ListVpcEndpointsRequest {
  NextToken?: string;
}
export const ListVpcEndpointsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2015-01-01/es/vpcEndpoints" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVpcEndpointsRequest",
}) as any as S.Schema<ListVpcEndpointsRequest>;
export interface ListVpcEndpointsForDomainRequest {
  DomainName: string;
  NextToken?: string;
}
export const ListVpcEndpointsForDomainRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2015-01-01/es/domain/{DomainName}/vpcEndpoints",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVpcEndpointsForDomainRequest",
}) as any as S.Schema<ListVpcEndpointsForDomainRequest>;
export interface PurchaseReservedElasticsearchInstanceOfferingRequest {
  ReservedElasticsearchInstanceOfferingId: string;
  ReservationName: string;
  InstanceCount?: number;
}
export const PurchaseReservedElasticsearchInstanceOfferingRequest = S.suspend(
  () =>
    S.Struct({
      ReservedElasticsearchInstanceOfferingId: S.String,
      ReservationName: S.String,
      InstanceCount: S.optional(S.Number),
    }).pipe(
      T.all(
        ns,
        T.Http({
          method: "POST",
          uri: "/2015-01-01/es/purchaseReservedInstanceOffering",
        }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "PurchaseReservedElasticsearchInstanceOfferingRequest",
}) as any as S.Schema<PurchaseReservedElasticsearchInstanceOfferingRequest>;
export interface RejectInboundCrossClusterSearchConnectionRequest {
  CrossClusterSearchConnectionId: string;
}
export const RejectInboundCrossClusterSearchConnectionRequest = S.suspend(() =>
  S.Struct({
    CrossClusterSearchConnectionId: S.String.pipe(
      T.HttpLabel("CrossClusterSearchConnectionId"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "PUT",
        uri: "/2015-01-01/es/ccs/inboundConnection/{CrossClusterSearchConnectionId}/reject",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RejectInboundCrossClusterSearchConnectionRequest",
}) as any as S.Schema<RejectInboundCrossClusterSearchConnectionRequest>;
export interface RemoveTagsRequest {
  ARN: string;
  TagKeys: string[];
}
export const RemoveTagsRequest = S.suspend(() =>
  S.Struct({ ARN: S.String, TagKeys: StringList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2015-01-01/tags-removal" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveTagsRequest",
}) as any as S.Schema<RemoveTagsRequest>;
export interface RemoveTagsResponse {}
export const RemoveTagsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveTagsResponse",
}) as any as S.Schema<RemoveTagsResponse>;
export interface RevokeVpcEndpointAccessRequest {
  DomainName: string;
  Account: string;
}
export const RevokeVpcEndpointAccessRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Account: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2015-01-01/es/domain/{DomainName}/revokeVpcEndpointAccess",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RevokeVpcEndpointAccessRequest",
}) as any as S.Schema<RevokeVpcEndpointAccessRequest>;
export interface RevokeVpcEndpointAccessResponse {}
export const RevokeVpcEndpointAccessResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RevokeVpcEndpointAccessResponse",
}) as any as S.Schema<RevokeVpcEndpointAccessResponse>;
export interface StartElasticsearchServiceSoftwareUpdateRequest {
  DomainName: string;
}
export const StartElasticsearchServiceSoftwareUpdateRequest = S.suspend(() =>
  S.Struct({ DomainName: S.String }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2015-01-01/es/serviceSoftwareUpdate/start",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartElasticsearchServiceSoftwareUpdateRequest",
}) as any as S.Schema<StartElasticsearchServiceSoftwareUpdateRequest>;
export interface PackageSource {
  S3BucketName?: string;
  S3Key?: string;
}
export const PackageSource = S.suspend(() =>
  S.Struct({ S3BucketName: S.optional(S.String), S3Key: S.optional(S.String) }),
).annotations({
  identifier: "PackageSource",
}) as any as S.Schema<PackageSource>;
export interface UpdatePackageRequest {
  PackageID: string;
  PackageSource: PackageSource;
  PackageDescription?: string;
  CommitMessage?: string;
}
export const UpdatePackageRequest = S.suspend(() =>
  S.Struct({
    PackageID: S.String,
    PackageSource: PackageSource,
    PackageDescription: S.optional(S.String),
    CommitMessage: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2015-01-01/packages/update" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePackageRequest",
}) as any as S.Schema<UpdatePackageRequest>;
export interface UpdateVpcEndpointRequest {
  VpcEndpointId: string;
  VpcOptions: VPCOptions;
}
export const UpdateVpcEndpointRequest = S.suspend(() =>
  S.Struct({ VpcEndpointId: S.String, VpcOptions: VPCOptions }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2015-01-01/es/vpcEndpoints/update" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateVpcEndpointRequest",
}) as any as S.Schema<UpdateVpcEndpointRequest>;
export interface UpgradeElasticsearchDomainRequest {
  DomainName: string;
  TargetVersion: string;
  PerformCheckOnly?: boolean;
}
export const UpgradeElasticsearchDomainRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String,
    TargetVersion: S.String,
    PerformCheckOnly: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2015-01-01/es/upgradeDomain" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpgradeElasticsearchDomainRequest",
}) as any as S.Schema<UpgradeElasticsearchDomainRequest>;
export type ESWarmPartitionInstanceType =
  | "ultrawarm1.medium.elasticsearch"
  | "ultrawarm1.large.elasticsearch"
  | (string & {});
export const ESWarmPartitionInstanceType = S.String;
export type VolumeType = "standard" | "gp2" | "io1" | "gp3" | (string & {});
export const VolumeType = S.String;
export type LogType =
  | "INDEX_SLOW_LOGS"
  | "SEARCH_SLOW_LOGS"
  | "ES_APPLICATION_LOGS"
  | "AUDIT_LOGS"
  | (string & {});
export const LogType = S.String;
export type TLSSecurityPolicy =
  | "Policy-Min-TLS-1-0-2019-07"
  | "Policy-Min-TLS-1-2-2019-07"
  | "Policy-Min-TLS-1-2-PFS-2023-10"
  | (string & {});
export const TLSSecurityPolicy = S.String;
export type AutoTuneDesiredState = "ENABLED" | "DISABLED" | (string & {});
export const AutoTuneDesiredState = S.String;
export type DescribePackagesFilterName =
  | "PackageID"
  | "PackageName"
  | "PackageStatus"
  | (string & {});
export const DescribePackagesFilterName = S.String;
export type DescribePackagesFilterValues = string[];
export const DescribePackagesFilterValues = S.Array(S.String);
export type RollbackOnDisable =
  | "NO_ROLLBACK"
  | "DEFAULT_ROLLBACK"
  | (string & {});
export const RollbackOnDisable = S.String;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export type GUIDList = string[];
export const GUIDList = S.Array(S.String);
export interface EBSOptions {
  EBSEnabled?: boolean;
  VolumeType?: VolumeType;
  VolumeSize?: number;
  Iops?: number;
  Throughput?: number;
}
export const EBSOptions = S.suspend(() =>
  S.Struct({
    EBSEnabled: S.optional(S.Boolean),
    VolumeType: S.optional(VolumeType),
    VolumeSize: S.optional(S.Number),
    Iops: S.optional(S.Number),
    Throughput: S.optional(S.Number),
  }),
).annotations({ identifier: "EBSOptions" }) as any as S.Schema<EBSOptions>;
export interface SnapshotOptions {
  AutomatedSnapshotStartHour?: number;
}
export const SnapshotOptions = S.suspend(() =>
  S.Struct({ AutomatedSnapshotStartHour: S.optional(S.Number) }),
).annotations({
  identifier: "SnapshotOptions",
}) as any as S.Schema<SnapshotOptions>;
export interface CognitoOptions {
  Enabled?: boolean;
  UserPoolId?: string;
  IdentityPoolId?: string;
  RoleArn?: string;
}
export const CognitoOptions = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    UserPoolId: S.optional(S.String),
    IdentityPoolId: S.optional(S.String),
    RoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CognitoOptions",
}) as any as S.Schema<CognitoOptions>;
export interface EncryptionAtRestOptions {
  Enabled?: boolean;
  KmsKeyId?: string;
}
export const EncryptionAtRestOptions = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean), KmsKeyId: S.optional(S.String) }),
).annotations({
  identifier: "EncryptionAtRestOptions",
}) as any as S.Schema<EncryptionAtRestOptions>;
export interface NodeToNodeEncryptionOptions {
  Enabled?: boolean;
}
export const NodeToNodeEncryptionOptions = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "NodeToNodeEncryptionOptions",
}) as any as S.Schema<NodeToNodeEncryptionOptions>;
export type AdvancedOptions = { [key: string]: string | undefined };
export const AdvancedOptions = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface DomainEndpointOptions {
  EnforceHTTPS?: boolean;
  TLSSecurityPolicy?: TLSSecurityPolicy;
  CustomEndpointEnabled?: boolean;
  CustomEndpoint?: string;
  CustomEndpointCertificateArn?: string;
}
export const DomainEndpointOptions = S.suspend(() =>
  S.Struct({
    EnforceHTTPS: S.optional(S.Boolean),
    TLSSecurityPolicy: S.optional(TLSSecurityPolicy),
    CustomEndpointEnabled: S.optional(S.Boolean),
    CustomEndpoint: S.optional(S.String),
    CustomEndpointCertificateArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DomainEndpointOptions",
}) as any as S.Schema<DomainEndpointOptions>;
export interface DomainInformation {
  OwnerId?: string;
  DomainName: string;
  Region?: string;
}
export const DomainInformation = S.suspend(() =>
  S.Struct({
    OwnerId: S.optional(S.String),
    DomainName: S.String,
    Region: S.optional(S.String),
  }),
).annotations({
  identifier: "DomainInformation",
}) as any as S.Schema<DomainInformation>;
export type EndpointsMap = { [key: string]: string | undefined };
export const EndpointsMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface ZoneAwarenessConfig {
  AvailabilityZoneCount?: number;
}
export const ZoneAwarenessConfig = S.suspend(() =>
  S.Struct({ AvailabilityZoneCount: S.optional(S.Number) }),
).annotations({
  identifier: "ZoneAwarenessConfig",
}) as any as S.Schema<ZoneAwarenessConfig>;
export interface ColdStorageOptions {
  Enabled: boolean;
}
export const ColdStorageOptions = S.suspend(() =>
  S.Struct({ Enabled: S.Boolean }),
).annotations({
  identifier: "ColdStorageOptions",
}) as any as S.Schema<ColdStorageOptions>;
export interface ElasticsearchClusterConfig {
  InstanceType?: ESPartitionInstanceType;
  InstanceCount?: number;
  DedicatedMasterEnabled?: boolean;
  ZoneAwarenessEnabled?: boolean;
  ZoneAwarenessConfig?: ZoneAwarenessConfig;
  DedicatedMasterType?: ESPartitionInstanceType;
  DedicatedMasterCount?: number;
  WarmEnabled?: boolean;
  WarmType?: ESWarmPartitionInstanceType;
  WarmCount?: number;
  ColdStorageOptions?: ColdStorageOptions;
}
export const ElasticsearchClusterConfig = S.suspend(() =>
  S.Struct({
    InstanceType: S.optional(ESPartitionInstanceType),
    InstanceCount: S.optional(S.Number),
    DedicatedMasterEnabled: S.optional(S.Boolean),
    ZoneAwarenessEnabled: S.optional(S.Boolean),
    ZoneAwarenessConfig: S.optional(ZoneAwarenessConfig),
    DedicatedMasterType: S.optional(ESPartitionInstanceType),
    DedicatedMasterCount: S.optional(S.Number),
    WarmEnabled: S.optional(S.Boolean),
    WarmType: S.optional(ESWarmPartitionInstanceType),
    WarmCount: S.optional(S.Number),
    ColdStorageOptions: S.optional(ColdStorageOptions),
  }),
).annotations({
  identifier: "ElasticsearchClusterConfig",
}) as any as S.Schema<ElasticsearchClusterConfig>;
export interface VPCDerivedInfo {
  VPCId?: string;
  SubnetIds?: string[];
  AvailabilityZones?: string[];
  SecurityGroupIds?: string[];
}
export const VPCDerivedInfo = S.suspend(() =>
  S.Struct({
    VPCId: S.optional(S.String),
    SubnetIds: S.optional(StringList),
    AvailabilityZones: S.optional(StringList),
    SecurityGroupIds: S.optional(StringList),
  }),
).annotations({
  identifier: "VPCDerivedInfo",
}) as any as S.Schema<VPCDerivedInfo>;
export interface LogPublishingOption {
  CloudWatchLogsLogGroupArn?: string;
  Enabled?: boolean;
}
export const LogPublishingOption = S.suspend(() =>
  S.Struct({
    CloudWatchLogsLogGroupArn: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "LogPublishingOption",
}) as any as S.Schema<LogPublishingOption>;
export type LogPublishingOptions = { [key in LogType]?: LogPublishingOption };
export const LogPublishingOptions = S.partial(
  S.Record({ key: LogType, value: S.UndefinedOr(LogPublishingOption) }),
);
export type DeploymentStatus =
  | "PENDING_UPDATE"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "NOT_ELIGIBLE"
  | "ELIGIBLE"
  | (string & {});
export const DeploymentStatus = S.String;
export interface ServiceSoftwareOptions {
  CurrentVersion?: string;
  NewVersion?: string;
  UpdateAvailable?: boolean;
  Cancellable?: boolean;
  UpdateStatus?: DeploymentStatus;
  Description?: string;
  AutomatedUpdateDate?: Date;
  OptionalDeployment?: boolean;
}
export const ServiceSoftwareOptions = S.suspend(() =>
  S.Struct({
    CurrentVersion: S.optional(S.String),
    NewVersion: S.optional(S.String),
    UpdateAvailable: S.optional(S.Boolean),
    Cancellable: S.optional(S.Boolean),
    UpdateStatus: S.optional(DeploymentStatus),
    Description: S.optional(S.String),
    AutomatedUpdateDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    OptionalDeployment: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ServiceSoftwareOptions",
}) as any as S.Schema<ServiceSoftwareOptions>;
export interface SAMLIdp {
  MetadataContent: string;
  EntityId: string;
}
export const SAMLIdp = S.suspend(() =>
  S.Struct({ MetadataContent: S.String, EntityId: S.String }),
).annotations({ identifier: "SAMLIdp" }) as any as S.Schema<SAMLIdp>;
export interface SAMLOptionsOutput {
  Enabled?: boolean;
  Idp?: SAMLIdp;
  SubjectKey?: string;
  RolesKey?: string;
  SessionTimeoutMinutes?: number;
}
export const SAMLOptionsOutput = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    Idp: S.optional(SAMLIdp),
    SubjectKey: S.optional(S.String),
    RolesKey: S.optional(S.String),
    SessionTimeoutMinutes: S.optional(S.Number),
  }),
).annotations({
  identifier: "SAMLOptionsOutput",
}) as any as S.Schema<SAMLOptionsOutput>;
export interface AdvancedSecurityOptions {
  Enabled?: boolean;
  InternalUserDatabaseEnabled?: boolean;
  SAMLOptions?: SAMLOptionsOutput;
  AnonymousAuthDisableDate?: Date;
  AnonymousAuthEnabled?: boolean;
}
export const AdvancedSecurityOptions = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    InternalUserDatabaseEnabled: S.optional(S.Boolean),
    SAMLOptions: S.optional(SAMLOptionsOutput),
    AnonymousAuthDisableDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AnonymousAuthEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AdvancedSecurityOptions",
}) as any as S.Schema<AdvancedSecurityOptions>;
export type AutoTuneState =
  | "ENABLED"
  | "DISABLED"
  | "ENABLE_IN_PROGRESS"
  | "DISABLE_IN_PROGRESS"
  | "DISABLED_AND_ROLLBACK_SCHEDULED"
  | "DISABLED_AND_ROLLBACK_IN_PROGRESS"
  | "DISABLED_AND_ROLLBACK_COMPLETE"
  | "DISABLED_AND_ROLLBACK_ERROR"
  | "ERROR"
  | (string & {});
export const AutoTuneState = S.String;
export interface AutoTuneOptionsOutput {
  State?: AutoTuneState;
  ErrorMessage?: string;
}
export const AutoTuneOptionsOutput = S.suspend(() =>
  S.Struct({
    State: S.optional(AutoTuneState),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "AutoTuneOptionsOutput",
}) as any as S.Schema<AutoTuneOptionsOutput>;
export type ConfigChangeStatus =
  | "Pending"
  | "Initializing"
  | "Validating"
  | "ValidationFailed"
  | "ApplyingChanges"
  | "Completed"
  | "PendingUserInput"
  | "Cancelled"
  | (string & {});
export const ConfigChangeStatus = S.String;
export type InitiatedBy = "CUSTOMER" | "SERVICE" | (string & {});
export const InitiatedBy = S.String;
export interface ChangeProgressDetails {
  ChangeId?: string;
  Message?: string;
  ConfigChangeStatus?: ConfigChangeStatus;
  StartTime?: Date;
  LastUpdatedTime?: Date;
  InitiatedBy?: InitiatedBy;
}
export const ChangeProgressDetails = S.suspend(() =>
  S.Struct({
    ChangeId: S.optional(S.String),
    Message: S.optional(S.String),
    ConfigChangeStatus: S.optional(ConfigChangeStatus),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    InitiatedBy: S.optional(InitiatedBy),
  }),
).annotations({
  identifier: "ChangeProgressDetails",
}) as any as S.Schema<ChangeProgressDetails>;
export type DomainProcessingStatusType =
  | "Creating"
  | "Active"
  | "Modifying"
  | "UpgradingEngineVersion"
  | "UpdatingServiceSoftware"
  | "Isolated"
  | "Deleting"
  | (string & {});
export const DomainProcessingStatusType = S.String;
export type PropertyValueType =
  | "PLAIN_TEXT"
  | "STRINGIFIED_JSON"
  | (string & {});
export const PropertyValueType = S.String;
export interface ModifyingProperties {
  Name?: string;
  ActiveValue?: string;
  PendingValue?: string;
  ValueType?: PropertyValueType;
}
export const ModifyingProperties = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    ActiveValue: S.optional(S.String),
    PendingValue: S.optional(S.String),
    ValueType: S.optional(PropertyValueType),
  }),
).annotations({
  identifier: "ModifyingProperties",
}) as any as S.Schema<ModifyingProperties>;
export type ModifyingPropertiesList = ModifyingProperties[];
export const ModifyingPropertiesList = S.Array(ModifyingProperties);
export interface ElasticsearchDomainStatus {
  DomainId: string;
  DomainName: string;
  ARN: string;
  Created?: boolean;
  Deleted?: boolean;
  Endpoint?: string;
  Endpoints?: { [key: string]: string | undefined };
  Processing?: boolean;
  UpgradeProcessing?: boolean;
  ElasticsearchVersion?: string;
  ElasticsearchClusterConfig: ElasticsearchClusterConfig;
  EBSOptions?: EBSOptions;
  AccessPolicies?: string;
  SnapshotOptions?: SnapshotOptions;
  VPCOptions?: VPCDerivedInfo;
  CognitoOptions?: CognitoOptions;
  EncryptionAtRestOptions?: EncryptionAtRestOptions;
  NodeToNodeEncryptionOptions?: NodeToNodeEncryptionOptions;
  AdvancedOptions?: { [key: string]: string | undefined };
  LogPublishingOptions?: { [key: string]: LogPublishingOption | undefined };
  ServiceSoftwareOptions?: ServiceSoftwareOptions;
  DomainEndpointOptions?: DomainEndpointOptions;
  AdvancedSecurityOptions?: AdvancedSecurityOptions;
  AutoTuneOptions?: AutoTuneOptionsOutput;
  ChangeProgressDetails?: ChangeProgressDetails;
  DomainProcessingStatus?: DomainProcessingStatusType;
  ModifyingProperties?: ModifyingProperties[];
}
export const ElasticsearchDomainStatus = S.suspend(() =>
  S.Struct({
    DomainId: S.String,
    DomainName: S.String,
    ARN: S.String,
    Created: S.optional(S.Boolean),
    Deleted: S.optional(S.Boolean),
    Endpoint: S.optional(S.String),
    Endpoints: S.optional(EndpointsMap),
    Processing: S.optional(S.Boolean),
    UpgradeProcessing: S.optional(S.Boolean),
    ElasticsearchVersion: S.optional(S.String),
    ElasticsearchClusterConfig: ElasticsearchClusterConfig,
    EBSOptions: S.optional(EBSOptions),
    AccessPolicies: S.optional(S.String),
    SnapshotOptions: S.optional(SnapshotOptions),
    VPCOptions: S.optional(VPCDerivedInfo),
    CognitoOptions: S.optional(CognitoOptions),
    EncryptionAtRestOptions: S.optional(EncryptionAtRestOptions),
    NodeToNodeEncryptionOptions: S.optional(NodeToNodeEncryptionOptions),
    AdvancedOptions: S.optional(AdvancedOptions),
    LogPublishingOptions: S.optional(LogPublishingOptions),
    ServiceSoftwareOptions: S.optional(ServiceSoftwareOptions),
    DomainEndpointOptions: S.optional(DomainEndpointOptions),
    AdvancedSecurityOptions: S.optional(AdvancedSecurityOptions),
    AutoTuneOptions: S.optional(AutoTuneOptionsOutput),
    ChangeProgressDetails: S.optional(ChangeProgressDetails),
    DomainProcessingStatus: S.optional(DomainProcessingStatusType),
    ModifyingProperties: S.optional(ModifyingPropertiesList),
  }),
).annotations({
  identifier: "ElasticsearchDomainStatus",
}) as any as S.Schema<ElasticsearchDomainStatus>;
export type ElasticsearchDomainStatusList = ElasticsearchDomainStatus[];
export const ElasticsearchDomainStatusList = S.Array(ElasticsearchDomainStatus);
export type OutboundCrossClusterSearchConnectionStatusCode =
  | "PENDING_ACCEPTANCE"
  | "VALIDATING"
  | "VALIDATION_FAILED"
  | "PROVISIONING"
  | "ACTIVE"
  | "REJECTED"
  | "DELETING"
  | "DELETED"
  | (string & {});
export const OutboundCrossClusterSearchConnectionStatusCode = S.String;
export interface OutboundCrossClusterSearchConnectionStatus {
  StatusCode?: OutboundCrossClusterSearchConnectionStatusCode;
  Message?: string;
}
export const OutboundCrossClusterSearchConnectionStatus = S.suspend(() =>
  S.Struct({
    StatusCode: S.optional(OutboundCrossClusterSearchConnectionStatusCode),
    Message: S.optional(S.String),
  }),
).annotations({
  identifier: "OutboundCrossClusterSearchConnectionStatus",
}) as any as S.Schema<OutboundCrossClusterSearchConnectionStatus>;
export interface OutboundCrossClusterSearchConnection {
  SourceDomainInfo?: DomainInformation;
  DestinationDomainInfo?: DomainInformation;
  CrossClusterSearchConnectionId?: string;
  ConnectionAlias?: string;
  ConnectionStatus?: OutboundCrossClusterSearchConnectionStatus;
}
export const OutboundCrossClusterSearchConnection = S.suspend(() =>
  S.Struct({
    SourceDomainInfo: S.optional(DomainInformation),
    DestinationDomainInfo: S.optional(DomainInformation),
    CrossClusterSearchConnectionId: S.optional(S.String),
    ConnectionAlias: S.optional(S.String),
    ConnectionStatus: S.optional(OutboundCrossClusterSearchConnectionStatus),
  }),
).annotations({
  identifier: "OutboundCrossClusterSearchConnection",
}) as any as S.Schema<OutboundCrossClusterSearchConnection>;
export type OutboundCrossClusterSearchConnections =
  OutboundCrossClusterSearchConnection[];
export const OutboundCrossClusterSearchConnections = S.Array(
  OutboundCrossClusterSearchConnection,
);
export interface DescribePackagesFilter {
  Name?: DescribePackagesFilterName;
  Value?: string[];
}
export const DescribePackagesFilter = S.suspend(() =>
  S.Struct({
    Name: S.optional(DescribePackagesFilterName),
    Value: S.optional(DescribePackagesFilterValues),
  }),
).annotations({
  identifier: "DescribePackagesFilter",
}) as any as S.Schema<DescribePackagesFilter>;
export type DescribePackagesFilterList = DescribePackagesFilter[];
export const DescribePackagesFilterList = S.Array(DescribePackagesFilter);
export type VpcEndpointStatus =
  | "CREATING"
  | "CREATE_FAILED"
  | "ACTIVE"
  | "UPDATING"
  | "UPDATE_FAILED"
  | "DELETING"
  | "DELETE_FAILED"
  | (string & {});
export const VpcEndpointStatus = S.String;
export interface VpcEndpoint {
  VpcEndpointId?: string;
  VpcEndpointOwner?: string;
  DomainArn?: string;
  VpcOptions?: VPCDerivedInfo;
  Status?: VpcEndpointStatus;
  Endpoint?: string;
}
export const VpcEndpoint = S.suspend(() =>
  S.Struct({
    VpcEndpointId: S.optional(S.String),
    VpcEndpointOwner: S.optional(S.String),
    DomainArn: S.optional(S.String),
    VpcOptions: S.optional(VPCDerivedInfo),
    Status: S.optional(VpcEndpointStatus),
    Endpoint: S.optional(S.String),
  }),
).annotations({ identifier: "VpcEndpoint" }) as any as S.Schema<VpcEndpoint>;
export type VpcEndpoints = VpcEndpoint[];
export const VpcEndpoints = S.Array(VpcEndpoint);
export type UpgradeStep =
  | "PRE_UPGRADE_CHECK"
  | "SNAPSHOT"
  | "UPGRADE"
  | (string & {});
export const UpgradeStep = S.String;
export type UpgradeStatus =
  | "IN_PROGRESS"
  | "SUCCEEDED"
  | "SUCCEEDED_WITH_ISSUES"
  | "FAILED"
  | (string & {});
export const UpgradeStatus = S.String;
export type DomainPackageStatus =
  | "ASSOCIATING"
  | "ASSOCIATION_FAILED"
  | "ACTIVE"
  | "DISSOCIATING"
  | "DISSOCIATION_FAILED"
  | (string & {});
export const DomainPackageStatus = S.String;
export interface ErrorDetails {
  ErrorType?: string;
  ErrorMessage?: string;
}
export const ErrorDetails = S.suspend(() =>
  S.Struct({
    ErrorType: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "ErrorDetails" }) as any as S.Schema<ErrorDetails>;
export interface DomainPackageDetails {
  PackageID?: string;
  PackageName?: string;
  PackageType?: PackageType;
  LastUpdated?: Date;
  DomainName?: string;
  DomainPackageStatus?: DomainPackageStatus;
  PackageVersion?: string;
  ReferencePath?: string;
  ErrorDetails?: ErrorDetails;
}
export const DomainPackageDetails = S.suspend(() =>
  S.Struct({
    PackageID: S.optional(S.String),
    PackageName: S.optional(S.String),
    PackageType: S.optional(PackageType),
    LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DomainName: S.optional(S.String),
    DomainPackageStatus: S.optional(DomainPackageStatus),
    PackageVersion: S.optional(S.String),
    ReferencePath: S.optional(S.String),
    ErrorDetails: S.optional(ErrorDetails),
  }),
).annotations({
  identifier: "DomainPackageDetails",
}) as any as S.Schema<DomainPackageDetails>;
export type DomainPackageDetailsList = DomainPackageDetails[];
export const DomainPackageDetailsList = S.Array(DomainPackageDetails);
export type ElasticsearchInstanceTypeList = ESPartitionInstanceType[];
export const ElasticsearchInstanceTypeList = S.Array(ESPartitionInstanceType);
export type ElasticsearchVersionList = string[];
export const ElasticsearchVersionList = S.Array(S.String);
export type PrincipalType = "AWS_ACCOUNT" | "AWS_SERVICE" | (string & {});
export const PrincipalType = S.String;
export interface AuthorizedPrincipal {
  PrincipalType?: PrincipalType;
  Principal?: string;
}
export const AuthorizedPrincipal = S.suspend(() =>
  S.Struct({
    PrincipalType: S.optional(PrincipalType),
    Principal: S.optional(S.String),
  }),
).annotations({
  identifier: "AuthorizedPrincipal",
}) as any as S.Schema<AuthorizedPrincipal>;
export type AuthorizedPrincipalList = AuthorizedPrincipal[];
export const AuthorizedPrincipalList = S.Array(AuthorizedPrincipal);
export interface VpcEndpointSummary {
  VpcEndpointId?: string;
  VpcEndpointOwner?: string;
  DomainArn?: string;
  Status?: VpcEndpointStatus;
}
export const VpcEndpointSummary = S.suspend(() =>
  S.Struct({
    VpcEndpointId: S.optional(S.String),
    VpcEndpointOwner: S.optional(S.String),
    DomainArn: S.optional(S.String),
    Status: S.optional(VpcEndpointStatus),
  }),
).annotations({
  identifier: "VpcEndpointSummary",
}) as any as S.Schema<VpcEndpointSummary>;
export type VpcEndpointSummaryList = VpcEndpointSummary[];
export const VpcEndpointSummaryList = S.Array(VpcEndpointSummary);
export type TimeUnit = "HOURS" | (string & {});
export const TimeUnit = S.String;
export interface Duration {
  Value?: number;
  Unit?: TimeUnit;
}
export const Duration = S.suspend(() =>
  S.Struct({ Value: S.optional(S.Number), Unit: S.optional(TimeUnit) }),
).annotations({ identifier: "Duration" }) as any as S.Schema<Duration>;
export interface AutoTuneMaintenanceSchedule {
  StartAt?: Date;
  Duration?: Duration;
  CronExpressionForRecurrence?: string;
}
export const AutoTuneMaintenanceSchedule = S.suspend(() =>
  S.Struct({
    StartAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Duration: S.optional(Duration),
    CronExpressionForRecurrence: S.optional(S.String),
  }),
).annotations({
  identifier: "AutoTuneMaintenanceSchedule",
}) as any as S.Schema<AutoTuneMaintenanceSchedule>;
export type AutoTuneMaintenanceScheduleList = AutoTuneMaintenanceSchedule[];
export const AutoTuneMaintenanceScheduleList = S.Array(
  AutoTuneMaintenanceSchedule,
);
export interface AutoTuneOptions {
  DesiredState?: AutoTuneDesiredState;
  RollbackOnDisable?: RollbackOnDisable;
  MaintenanceSchedules?: AutoTuneMaintenanceSchedule[];
}
export const AutoTuneOptions = S.suspend(() =>
  S.Struct({
    DesiredState: S.optional(AutoTuneDesiredState),
    RollbackOnDisable: S.optional(RollbackOnDisable),
    MaintenanceSchedules: S.optional(AutoTuneMaintenanceScheduleList),
  }),
).annotations({
  identifier: "AutoTuneOptions",
}) as any as S.Schema<AutoTuneOptions>;
export interface AddTagsRequest {
  ARN: string;
  TagList: Tag[];
}
export const AddTagsRequest = S.suspend(() =>
  S.Struct({ ARN: S.String, TagList: TagList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2015-01-01/tags" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddTagsRequest",
}) as any as S.Schema<AddTagsRequest>;
export interface AddTagsResponse {}
export const AddTagsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AddTagsResponse",
}) as any as S.Schema<AddTagsResponse>;
export interface CreateOutboundCrossClusterSearchConnectionRequest {
  SourceDomainInfo: DomainInformation;
  DestinationDomainInfo: DomainInformation;
  ConnectionAlias: string;
}
export const CreateOutboundCrossClusterSearchConnectionRequest = S.suspend(() =>
  S.Struct({
    SourceDomainInfo: DomainInformation,
    DestinationDomainInfo: DomainInformation,
    ConnectionAlias: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2015-01-01/es/ccs/outboundConnection" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateOutboundCrossClusterSearchConnectionRequest",
}) as any as S.Schema<CreateOutboundCrossClusterSearchConnectionRequest>;
export interface CreatePackageRequest {
  PackageName: string;
  PackageType: PackageType;
  PackageDescription?: string;
  PackageSource: PackageSource;
}
export const CreatePackageRequest = S.suspend(() =>
  S.Struct({
    PackageName: S.String,
    PackageType: PackageType,
    PackageDescription: S.optional(S.String),
    PackageSource: PackageSource,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2015-01-01/packages" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePackageRequest",
}) as any as S.Schema<CreatePackageRequest>;
export type InboundCrossClusterSearchConnectionStatusCode =
  | "PENDING_ACCEPTANCE"
  | "APPROVED"
  | "REJECTING"
  | "REJECTED"
  | "DELETING"
  | "DELETED"
  | (string & {});
export const InboundCrossClusterSearchConnectionStatusCode = S.String;
export interface InboundCrossClusterSearchConnectionStatus {
  StatusCode?: InboundCrossClusterSearchConnectionStatusCode;
  Message?: string;
}
export const InboundCrossClusterSearchConnectionStatus = S.suspend(() =>
  S.Struct({
    StatusCode: S.optional(InboundCrossClusterSearchConnectionStatusCode),
    Message: S.optional(S.String),
  }),
).annotations({
  identifier: "InboundCrossClusterSearchConnectionStatus",
}) as any as S.Schema<InboundCrossClusterSearchConnectionStatus>;
export interface InboundCrossClusterSearchConnection {
  SourceDomainInfo?: DomainInformation;
  DestinationDomainInfo?: DomainInformation;
  CrossClusterSearchConnectionId?: string;
  ConnectionStatus?: InboundCrossClusterSearchConnectionStatus;
}
export const InboundCrossClusterSearchConnection = S.suspend(() =>
  S.Struct({
    SourceDomainInfo: S.optional(DomainInformation),
    DestinationDomainInfo: S.optional(DomainInformation),
    CrossClusterSearchConnectionId: S.optional(S.String),
    ConnectionStatus: S.optional(InboundCrossClusterSearchConnectionStatus),
  }),
).annotations({
  identifier: "InboundCrossClusterSearchConnection",
}) as any as S.Schema<InboundCrossClusterSearchConnection>;
export interface DeleteInboundCrossClusterSearchConnectionResponse {
  CrossClusterSearchConnection?: InboundCrossClusterSearchConnection;
}
export const DeleteInboundCrossClusterSearchConnectionResponse = S.suspend(() =>
  S.Struct({
    CrossClusterSearchConnection: S.optional(
      InboundCrossClusterSearchConnection,
    ),
  }).pipe(ns),
).annotations({
  identifier: "DeleteInboundCrossClusterSearchConnectionResponse",
}) as any as S.Schema<DeleteInboundCrossClusterSearchConnectionResponse>;
export interface DescribeElasticsearchDomainResponse {
  DomainStatus: ElasticsearchDomainStatus;
}
export const DescribeElasticsearchDomainResponse = S.suspend(() =>
  S.Struct({ DomainStatus: ElasticsearchDomainStatus }).pipe(ns),
).annotations({
  identifier: "DescribeElasticsearchDomainResponse",
}) as any as S.Schema<DescribeElasticsearchDomainResponse>;
export interface DescribeElasticsearchDomainsResponse {
  DomainStatusList: ElasticsearchDomainStatus[];
}
export const DescribeElasticsearchDomainsResponse = S.suspend(() =>
  S.Struct({ DomainStatusList: ElasticsearchDomainStatusList }).pipe(ns),
).annotations({
  identifier: "DescribeElasticsearchDomainsResponse",
}) as any as S.Schema<DescribeElasticsearchDomainsResponse>;
export interface DescribeInboundCrossClusterSearchConnectionsRequest {
  Filters?: Filter[];
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeInboundCrossClusterSearchConnectionsRequest = S.suspend(
  () =>
    S.Struct({
      Filters: S.optional(FilterList),
      MaxResults: S.optional(S.Number),
      NextToken: S.optional(S.String),
    }).pipe(
      T.all(
        ns,
        T.Http({
          method: "POST",
          uri: "/2015-01-01/es/ccs/inboundConnection/search",
        }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "DescribeInboundCrossClusterSearchConnectionsRequest",
}) as any as S.Schema<DescribeInboundCrossClusterSearchConnectionsRequest>;
export interface DescribeOutboundCrossClusterSearchConnectionsResponse {
  CrossClusterSearchConnections?: OutboundCrossClusterSearchConnection[];
  NextToken?: string;
}
export const DescribeOutboundCrossClusterSearchConnectionsResponse = S.suspend(
  () =>
    S.Struct({
      CrossClusterSearchConnections: S.optional(
        OutboundCrossClusterSearchConnections,
      ),
      NextToken: S.optional(S.String),
    }).pipe(ns),
).annotations({
  identifier: "DescribeOutboundCrossClusterSearchConnectionsResponse",
}) as any as S.Schema<DescribeOutboundCrossClusterSearchConnectionsResponse>;
export interface DescribePackagesRequest {
  Filters?: DescribePackagesFilter[];
  MaxResults?: number;
  NextToken?: string;
}
export const DescribePackagesRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(DescribePackagesFilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2015-01-01/packages/describe" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePackagesRequest",
}) as any as S.Schema<DescribePackagesRequest>;
export interface DissociatePackageResponse {
  DomainPackageDetails?: DomainPackageDetails;
}
export const DissociatePackageResponse = S.suspend(() =>
  S.Struct({ DomainPackageDetails: S.optional(DomainPackageDetails) }).pipe(ns),
).annotations({
  identifier: "DissociatePackageResponse",
}) as any as S.Schema<DissociatePackageResponse>;
export interface GetUpgradeStatusResponse {
  UpgradeStep?: UpgradeStep;
  StepStatus?: UpgradeStatus;
  UpgradeName?: string;
}
export const GetUpgradeStatusResponse = S.suspend(() =>
  S.Struct({
    UpgradeStep: S.optional(UpgradeStep),
    StepStatus: S.optional(UpgradeStatus),
    UpgradeName: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetUpgradeStatusResponse",
}) as any as S.Schema<GetUpgradeStatusResponse>;
export interface ListDomainsForPackageResponse {
  DomainPackageDetailsList?: DomainPackageDetails[];
  NextToken?: string;
}
export const ListDomainsForPackageResponse = S.suspend(() =>
  S.Struct({
    DomainPackageDetailsList: S.optional(DomainPackageDetailsList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListDomainsForPackageResponse",
}) as any as S.Schema<ListDomainsForPackageResponse>;
export interface ListElasticsearchInstanceTypesResponse {
  ElasticsearchInstanceTypes?: ESPartitionInstanceType[];
  NextToken?: string;
}
export const ListElasticsearchInstanceTypesResponse = S.suspend(() =>
  S.Struct({
    ElasticsearchInstanceTypes: S.optional(ElasticsearchInstanceTypeList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListElasticsearchInstanceTypesResponse",
}) as any as S.Schema<ListElasticsearchInstanceTypesResponse>;
export interface ListElasticsearchVersionsResponse {
  ElasticsearchVersions?: string[];
  NextToken?: string;
}
export const ListElasticsearchVersionsResponse = S.suspend(() =>
  S.Struct({
    ElasticsearchVersions: S.optional(ElasticsearchVersionList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListElasticsearchVersionsResponse",
}) as any as S.Schema<ListElasticsearchVersionsResponse>;
export interface ListPackagesForDomainResponse {
  DomainPackageDetailsList?: DomainPackageDetails[];
  NextToken?: string;
}
export const ListPackagesForDomainResponse = S.suspend(() =>
  S.Struct({
    DomainPackageDetailsList: S.optional(DomainPackageDetailsList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListPackagesForDomainResponse",
}) as any as S.Schema<ListPackagesForDomainResponse>;
export interface ListTagsResponse {
  TagList?: Tag[];
}
export const ListTagsResponse = S.suspend(() =>
  S.Struct({ TagList: S.optional(TagList) }).pipe(ns),
).annotations({
  identifier: "ListTagsResponse",
}) as any as S.Schema<ListTagsResponse>;
export interface ListVpcEndpointAccessResponse {
  AuthorizedPrincipalList: AuthorizedPrincipal[];
  NextToken: string;
}
export const ListVpcEndpointAccessResponse = S.suspend(() =>
  S.Struct({
    AuthorizedPrincipalList: AuthorizedPrincipalList,
    NextToken: S.String,
  }).pipe(ns),
).annotations({
  identifier: "ListVpcEndpointAccessResponse",
}) as any as S.Schema<ListVpcEndpointAccessResponse>;
export interface ListVpcEndpointsResponse {
  VpcEndpointSummaryList: VpcEndpointSummary[];
  NextToken: string;
}
export const ListVpcEndpointsResponse = S.suspend(() =>
  S.Struct({
    VpcEndpointSummaryList: VpcEndpointSummaryList,
    NextToken: S.String,
  }).pipe(ns),
).annotations({
  identifier: "ListVpcEndpointsResponse",
}) as any as S.Schema<ListVpcEndpointsResponse>;
export interface ListVpcEndpointsForDomainResponse {
  VpcEndpointSummaryList: VpcEndpointSummary[];
  NextToken: string;
}
export const ListVpcEndpointsForDomainResponse = S.suspend(() =>
  S.Struct({
    VpcEndpointSummaryList: VpcEndpointSummaryList,
    NextToken: S.String,
  }).pipe(ns),
).annotations({
  identifier: "ListVpcEndpointsForDomainResponse",
}) as any as S.Schema<ListVpcEndpointsForDomainResponse>;
export interface PurchaseReservedElasticsearchInstanceOfferingResponse {
  ReservedElasticsearchInstanceId?: string;
  ReservationName?: string;
}
export const PurchaseReservedElasticsearchInstanceOfferingResponse = S.suspend(
  () =>
    S.Struct({
      ReservedElasticsearchInstanceId: S.optional(S.String),
      ReservationName: S.optional(S.String),
    }).pipe(ns),
).annotations({
  identifier: "PurchaseReservedElasticsearchInstanceOfferingResponse",
}) as any as S.Schema<PurchaseReservedElasticsearchInstanceOfferingResponse>;
export interface RejectInboundCrossClusterSearchConnectionResponse {
  CrossClusterSearchConnection?: InboundCrossClusterSearchConnection;
}
export const RejectInboundCrossClusterSearchConnectionResponse = S.suspend(() =>
  S.Struct({
    CrossClusterSearchConnection: S.optional(
      InboundCrossClusterSearchConnection,
    ),
  }).pipe(ns),
).annotations({
  identifier: "RejectInboundCrossClusterSearchConnectionResponse",
}) as any as S.Schema<RejectInboundCrossClusterSearchConnectionResponse>;
export interface StartElasticsearchServiceSoftwareUpdateResponse {
  ServiceSoftwareOptions?: ServiceSoftwareOptions;
}
export const StartElasticsearchServiceSoftwareUpdateResponse = S.suspend(() =>
  S.Struct({ ServiceSoftwareOptions: S.optional(ServiceSoftwareOptions) }).pipe(
    ns,
  ),
).annotations({
  identifier: "StartElasticsearchServiceSoftwareUpdateResponse",
}) as any as S.Schema<StartElasticsearchServiceSoftwareUpdateResponse>;
export interface MasterUserOptions {
  MasterUserARN?: string;
  MasterUserName?: string | redacted.Redacted<string>;
  MasterUserPassword?: string | redacted.Redacted<string>;
}
export const MasterUserOptions = S.suspend(() =>
  S.Struct({
    MasterUserARN: S.optional(S.String),
    MasterUserName: S.optional(SensitiveString),
    MasterUserPassword: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "MasterUserOptions",
}) as any as S.Schema<MasterUserOptions>;
export interface SAMLOptionsInput {
  Enabled?: boolean;
  Idp?: SAMLIdp;
  MasterUserName?: string | redacted.Redacted<string>;
  MasterBackendRole?: string;
  SubjectKey?: string;
  RolesKey?: string;
  SessionTimeoutMinutes?: number;
}
export const SAMLOptionsInput = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    Idp: S.optional(SAMLIdp),
    MasterUserName: S.optional(SensitiveString),
    MasterBackendRole: S.optional(S.String),
    SubjectKey: S.optional(S.String),
    RolesKey: S.optional(S.String),
    SessionTimeoutMinutes: S.optional(S.Number),
  }),
).annotations({
  identifier: "SAMLOptionsInput",
}) as any as S.Schema<SAMLOptionsInput>;
export interface AdvancedSecurityOptionsInput {
  Enabled?: boolean;
  InternalUserDatabaseEnabled?: boolean;
  MasterUserOptions?: MasterUserOptions;
  SAMLOptions?: SAMLOptionsInput;
  AnonymousAuthEnabled?: boolean;
}
export const AdvancedSecurityOptionsInput = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    InternalUserDatabaseEnabled: S.optional(S.Boolean),
    MasterUserOptions: S.optional(MasterUserOptions),
    SAMLOptions: S.optional(SAMLOptionsInput),
    AnonymousAuthEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AdvancedSecurityOptionsInput",
}) as any as S.Schema<AdvancedSecurityOptionsInput>;
export interface UpdateElasticsearchDomainConfigRequest {
  DomainName: string;
  ElasticsearchClusterConfig?: ElasticsearchClusterConfig;
  EBSOptions?: EBSOptions;
  SnapshotOptions?: SnapshotOptions;
  VPCOptions?: VPCOptions;
  CognitoOptions?: CognitoOptions;
  AdvancedOptions?: { [key: string]: string | undefined };
  AccessPolicies?: string;
  LogPublishingOptions?: { [key: string]: LogPublishingOption | undefined };
  DomainEndpointOptions?: DomainEndpointOptions;
  AdvancedSecurityOptions?: AdvancedSecurityOptionsInput;
  NodeToNodeEncryptionOptions?: NodeToNodeEncryptionOptions;
  EncryptionAtRestOptions?: EncryptionAtRestOptions;
  AutoTuneOptions?: AutoTuneOptions;
  DryRun?: boolean;
}
export const UpdateElasticsearchDomainConfigRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ElasticsearchClusterConfig: S.optional(ElasticsearchClusterConfig),
    EBSOptions: S.optional(EBSOptions),
    SnapshotOptions: S.optional(SnapshotOptions),
    VPCOptions: S.optional(VPCOptions),
    CognitoOptions: S.optional(CognitoOptions),
    AdvancedOptions: S.optional(AdvancedOptions),
    AccessPolicies: S.optional(S.String),
    LogPublishingOptions: S.optional(LogPublishingOptions),
    DomainEndpointOptions: S.optional(DomainEndpointOptions),
    AdvancedSecurityOptions: S.optional(AdvancedSecurityOptionsInput),
    NodeToNodeEncryptionOptions: S.optional(NodeToNodeEncryptionOptions),
    EncryptionAtRestOptions: S.optional(EncryptionAtRestOptions),
    AutoTuneOptions: S.optional(AutoTuneOptions),
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2015-01-01/es/domain/{DomainName}/config",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateElasticsearchDomainConfigRequest",
}) as any as S.Schema<UpdateElasticsearchDomainConfigRequest>;
export type PackageStatus =
  | "COPYING"
  | "COPY_FAILED"
  | "VALIDATING"
  | "VALIDATION_FAILED"
  | "AVAILABLE"
  | "DELETING"
  | "DELETED"
  | "DELETE_FAILED"
  | (string & {});
export const PackageStatus = S.String;
export interface PackageDetails {
  PackageID?: string;
  PackageName?: string;
  PackageType?: PackageType;
  PackageDescription?: string;
  PackageStatus?: PackageStatus;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  AvailablePackageVersion?: string;
  ErrorDetails?: ErrorDetails;
}
export const PackageDetails = S.suspend(() =>
  S.Struct({
    PackageID: S.optional(S.String),
    PackageName: S.optional(S.String),
    PackageType: S.optional(PackageType),
    PackageDescription: S.optional(S.String),
    PackageStatus: S.optional(PackageStatus),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    AvailablePackageVersion: S.optional(S.String),
    ErrorDetails: S.optional(ErrorDetails),
  }),
).annotations({
  identifier: "PackageDetails",
}) as any as S.Schema<PackageDetails>;
export interface UpdatePackageResponse {
  PackageDetails?: PackageDetails;
}
export const UpdatePackageResponse = S.suspend(() =>
  S.Struct({ PackageDetails: S.optional(PackageDetails) }).pipe(ns),
).annotations({
  identifier: "UpdatePackageResponse",
}) as any as S.Schema<UpdatePackageResponse>;
export interface UpdateVpcEndpointResponse {
  VpcEndpoint: VpcEndpoint;
}
export const UpdateVpcEndpointResponse = S.suspend(() =>
  S.Struct({ VpcEndpoint: VpcEndpoint }).pipe(ns),
).annotations({
  identifier: "UpdateVpcEndpointResponse",
}) as any as S.Schema<UpdateVpcEndpointResponse>;
export type AutoTuneType = "SCHEDULED_ACTION" | (string & {});
export const AutoTuneType = S.String;
export type OverallChangeStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | (string & {});
export const OverallChangeStatus = S.String;
export type ReservedElasticsearchInstancePaymentOption =
  | "ALL_UPFRONT"
  | "PARTIAL_UPFRONT"
  | "NO_UPFRONT"
  | (string & {});
export const ReservedElasticsearchInstancePaymentOption = S.String;
export type VpcEndpointErrorCode =
  | "ENDPOINT_NOT_FOUND"
  | "SERVER_ERROR"
  | (string & {});
export const VpcEndpointErrorCode = S.String;
export interface CancelledChangeProperty {
  PropertyName?: string;
  CancelledValue?: string;
  ActiveValue?: string;
}
export const CancelledChangeProperty = S.suspend(() =>
  S.Struct({
    PropertyName: S.optional(S.String),
    CancelledValue: S.optional(S.String),
    ActiveValue: S.optional(S.String),
  }),
).annotations({
  identifier: "CancelledChangeProperty",
}) as any as S.Schema<CancelledChangeProperty>;
export type CancelledChangePropertyList = CancelledChangeProperty[];
export const CancelledChangePropertyList = S.Array(CancelledChangeProperty);
export type InboundCrossClusterSearchConnections =
  InboundCrossClusterSearchConnection[];
export const InboundCrossClusterSearchConnections = S.Array(
  InboundCrossClusterSearchConnection,
);
export type PackageDetailsList = PackageDetails[];
export const PackageDetailsList = S.Array(PackageDetails);
export interface RecurringCharge {
  RecurringChargeAmount?: number;
  RecurringChargeFrequency?: string;
}
export const RecurringCharge = S.suspend(() =>
  S.Struct({
    RecurringChargeAmount: S.optional(S.Number),
    RecurringChargeFrequency: S.optional(S.String),
  }),
).annotations({
  identifier: "RecurringCharge",
}) as any as S.Schema<RecurringCharge>;
export type RecurringChargeList = RecurringCharge[];
export const RecurringChargeList = S.Array(
  RecurringCharge.pipe(T.XmlName("RecurringCharge")).annotations({
    identifier: "RecurringCharge",
  }),
);
export interface ReservedElasticsearchInstance {
  ReservationName?: string;
  ReservedElasticsearchInstanceId?: string;
  ReservedElasticsearchInstanceOfferingId?: string;
  ElasticsearchInstanceType?: ESPartitionInstanceType;
  StartTime?: Date;
  Duration?: number;
  FixedPrice?: number;
  UsagePrice?: number;
  CurrencyCode?: string;
  ElasticsearchInstanceCount?: number;
  State?: string;
  PaymentOption?: ReservedElasticsearchInstancePaymentOption;
  RecurringCharges?: RecurringCharge[];
}
export const ReservedElasticsearchInstance = S.suspend(() =>
  S.Struct({
    ReservationName: S.optional(S.String),
    ReservedElasticsearchInstanceId: S.optional(S.String),
    ReservedElasticsearchInstanceOfferingId: S.optional(S.String),
    ElasticsearchInstanceType: S.optional(ESPartitionInstanceType),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Duration: S.optional(S.Number),
    FixedPrice: S.optional(S.Number),
    UsagePrice: S.optional(S.Number),
    CurrencyCode: S.optional(S.String),
    ElasticsearchInstanceCount: S.optional(S.Number),
    State: S.optional(S.String),
    PaymentOption: S.optional(ReservedElasticsearchInstancePaymentOption),
    RecurringCharges: S.optional(RecurringChargeList),
  }),
).annotations({
  identifier: "ReservedElasticsearchInstance",
}) as any as S.Schema<ReservedElasticsearchInstance>;
export type ReservedElasticsearchInstanceList = ReservedElasticsearchInstance[];
export const ReservedElasticsearchInstanceList = S.Array(
  ReservedElasticsearchInstance,
);
export interface VpcEndpointError {
  VpcEndpointId?: string;
  ErrorCode?: VpcEndpointErrorCode;
  ErrorMessage?: string;
}
export const VpcEndpointError = S.suspend(() =>
  S.Struct({
    VpcEndpointId: S.optional(S.String),
    ErrorCode: S.optional(VpcEndpointErrorCode),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "VpcEndpointError",
}) as any as S.Schema<VpcEndpointError>;
export type VpcEndpointErrorList = VpcEndpointError[];
export const VpcEndpointErrorList = S.Array(VpcEndpointError);
export interface CompatibleVersionsMap {
  SourceVersion?: string;
  TargetVersions?: string[];
}
export const CompatibleVersionsMap = S.suspend(() =>
  S.Struct({
    SourceVersion: S.optional(S.String),
    TargetVersions: S.optional(ElasticsearchVersionList),
  }),
).annotations({
  identifier: "CompatibleVersionsMap",
}) as any as S.Schema<CompatibleVersionsMap>;
export type CompatibleElasticsearchVersionsList = CompatibleVersionsMap[];
export const CompatibleElasticsearchVersionsList = S.Array(
  CompatibleVersionsMap,
);
export interface PackageVersionHistory {
  PackageVersion?: string;
  CommitMessage?: string;
  CreatedAt?: Date;
}
export const PackageVersionHistory = S.suspend(() =>
  S.Struct({
    PackageVersion: S.optional(S.String),
    CommitMessage: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "PackageVersionHistory",
}) as any as S.Schema<PackageVersionHistory>;
export type PackageVersionHistoryList = PackageVersionHistory[];
export const PackageVersionHistoryList = S.Array(PackageVersionHistory);
export interface DomainInfo {
  DomainName?: string;
  EngineType?: EngineType;
}
export const DomainInfo = S.suspend(() =>
  S.Struct({
    DomainName: S.optional(S.String),
    EngineType: S.optional(EngineType),
  }),
).annotations({ identifier: "DomainInfo" }) as any as S.Schema<DomainInfo>;
export type DomainInfoList = DomainInfo[];
export const DomainInfoList = S.Array(DomainInfo);
export type Issues = string[];
export const Issues = S.Array(S.String);
export interface AuthorizeVpcEndpointAccessResponse {
  AuthorizedPrincipal: AuthorizedPrincipal;
}
export const AuthorizeVpcEndpointAccessResponse = S.suspend(() =>
  S.Struct({ AuthorizedPrincipal: AuthorizedPrincipal }).pipe(ns),
).annotations({
  identifier: "AuthorizeVpcEndpointAccessResponse",
}) as any as S.Schema<AuthorizeVpcEndpointAccessResponse>;
export interface CancelDomainConfigChangeResponse {
  DryRun?: boolean;
  CancelledChangeIds?: string[];
  CancelledChangeProperties?: CancelledChangeProperty[];
}
export const CancelDomainConfigChangeResponse = S.suspend(() =>
  S.Struct({
    DryRun: S.optional(S.Boolean),
    CancelledChangeIds: S.optional(GUIDList),
    CancelledChangeProperties: S.optional(CancelledChangePropertyList),
  }).pipe(ns),
).annotations({
  identifier: "CancelDomainConfigChangeResponse",
}) as any as S.Schema<CancelDomainConfigChangeResponse>;
export interface CancelElasticsearchServiceSoftwareUpdateResponse {
  ServiceSoftwareOptions?: ServiceSoftwareOptions;
}
export const CancelElasticsearchServiceSoftwareUpdateResponse = S.suspend(() =>
  S.Struct({ ServiceSoftwareOptions: S.optional(ServiceSoftwareOptions) }).pipe(
    ns,
  ),
).annotations({
  identifier: "CancelElasticsearchServiceSoftwareUpdateResponse",
}) as any as S.Schema<CancelElasticsearchServiceSoftwareUpdateResponse>;
export interface CreateOutboundCrossClusterSearchConnectionResponse {
  SourceDomainInfo?: DomainInformation;
  DestinationDomainInfo?: DomainInformation;
  ConnectionAlias?: string;
  ConnectionStatus?: OutboundCrossClusterSearchConnectionStatus;
  CrossClusterSearchConnectionId?: string;
}
export const CreateOutboundCrossClusterSearchConnectionResponse = S.suspend(
  () =>
    S.Struct({
      SourceDomainInfo: S.optional(DomainInformation),
      DestinationDomainInfo: S.optional(DomainInformation),
      ConnectionAlias: S.optional(S.String),
      ConnectionStatus: S.optional(OutboundCrossClusterSearchConnectionStatus),
      CrossClusterSearchConnectionId: S.optional(S.String),
    }).pipe(ns),
).annotations({
  identifier: "CreateOutboundCrossClusterSearchConnectionResponse",
}) as any as S.Schema<CreateOutboundCrossClusterSearchConnectionResponse>;
export interface CreatePackageResponse {
  PackageDetails?: PackageDetails;
}
export const CreatePackageResponse = S.suspend(() =>
  S.Struct({ PackageDetails: S.optional(PackageDetails) }).pipe(ns),
).annotations({
  identifier: "CreatePackageResponse",
}) as any as S.Schema<CreatePackageResponse>;
export interface DeletePackageResponse {
  PackageDetails?: PackageDetails;
}
export const DeletePackageResponse = S.suspend(() =>
  S.Struct({ PackageDetails: S.optional(PackageDetails) }).pipe(ns),
).annotations({
  identifier: "DeletePackageResponse",
}) as any as S.Schema<DeletePackageResponse>;
export interface DeleteVpcEndpointResponse {
  VpcEndpointSummary: VpcEndpointSummary;
}
export const DeleteVpcEndpointResponse = S.suspend(() =>
  S.Struct({ VpcEndpointSummary: VpcEndpointSummary }).pipe(ns),
).annotations({
  identifier: "DeleteVpcEndpointResponse",
}) as any as S.Schema<DeleteVpcEndpointResponse>;
export interface DescribeInboundCrossClusterSearchConnectionsResponse {
  CrossClusterSearchConnections?: InboundCrossClusterSearchConnection[];
  NextToken?: string;
}
export const DescribeInboundCrossClusterSearchConnectionsResponse = S.suspend(
  () =>
    S.Struct({
      CrossClusterSearchConnections: S.optional(
        InboundCrossClusterSearchConnections,
      ),
      NextToken: S.optional(S.String),
    }).pipe(ns),
).annotations({
  identifier: "DescribeInboundCrossClusterSearchConnectionsResponse",
}) as any as S.Schema<DescribeInboundCrossClusterSearchConnectionsResponse>;
export interface DescribePackagesResponse {
  PackageDetailsList?: PackageDetails[];
  NextToken?: string;
}
export const DescribePackagesResponse = S.suspend(() =>
  S.Struct({
    PackageDetailsList: S.optional(PackageDetailsList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribePackagesResponse",
}) as any as S.Schema<DescribePackagesResponse>;
export interface DescribeReservedElasticsearchInstancesResponse {
  NextToken?: string;
  ReservedElasticsearchInstances?: ReservedElasticsearchInstance[];
}
export const DescribeReservedElasticsearchInstancesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ReservedElasticsearchInstances: S.optional(
      ReservedElasticsearchInstanceList,
    ),
  }).pipe(ns),
).annotations({
  identifier: "DescribeReservedElasticsearchInstancesResponse",
}) as any as S.Schema<DescribeReservedElasticsearchInstancesResponse>;
export interface DescribeVpcEndpointsResponse {
  VpcEndpoints: VpcEndpoint[];
  VpcEndpointErrors: VpcEndpointError[];
}
export const DescribeVpcEndpointsResponse = S.suspend(() =>
  S.Struct({
    VpcEndpoints: VpcEndpoints,
    VpcEndpointErrors: VpcEndpointErrorList,
  }).pipe(ns),
).annotations({
  identifier: "DescribeVpcEndpointsResponse",
}) as any as S.Schema<DescribeVpcEndpointsResponse>;
export interface GetCompatibleElasticsearchVersionsResponse {
  CompatibleElasticsearchVersions?: CompatibleVersionsMap[];
}
export const GetCompatibleElasticsearchVersionsResponse = S.suspend(() =>
  S.Struct({
    CompatibleElasticsearchVersions: S.optional(
      CompatibleElasticsearchVersionsList,
    ),
  }).pipe(ns),
).annotations({
  identifier: "GetCompatibleElasticsearchVersionsResponse",
}) as any as S.Schema<GetCompatibleElasticsearchVersionsResponse>;
export interface GetPackageVersionHistoryResponse {
  PackageID?: string;
  PackageVersionHistoryList?: PackageVersionHistory[];
  NextToken?: string;
}
export const GetPackageVersionHistoryResponse = S.suspend(() =>
  S.Struct({
    PackageID: S.optional(S.String),
    PackageVersionHistoryList: S.optional(PackageVersionHistoryList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetPackageVersionHistoryResponse",
}) as any as S.Schema<GetPackageVersionHistoryResponse>;
export interface ListDomainNamesResponse {
  DomainNames?: DomainInfo[];
}
export const ListDomainNamesResponse = S.suspend(() =>
  S.Struct({ DomainNames: S.optional(DomainInfoList) }).pipe(ns),
).annotations({
  identifier: "ListDomainNamesResponse",
}) as any as S.Schema<ListDomainNamesResponse>;
export interface UpgradeElasticsearchDomainResponse {
  DomainName?: string;
  TargetVersion?: string;
  PerformCheckOnly?: boolean;
  ChangeProgressDetails?: ChangeProgressDetails;
}
export const UpgradeElasticsearchDomainResponse = S.suspend(() =>
  S.Struct({
    DomainName: S.optional(S.String),
    TargetVersion: S.optional(S.String),
    PerformCheckOnly: S.optional(S.Boolean),
    ChangeProgressDetails: S.optional(ChangeProgressDetails),
  }).pipe(ns),
).annotations({
  identifier: "UpgradeElasticsearchDomainResponse",
}) as any as S.Schema<UpgradeElasticsearchDomainResponse>;
export interface ChangeProgressStage {
  Name?: string;
  Status?: string;
  Description?: string;
  LastUpdated?: Date;
}
export const ChangeProgressStage = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    Description: S.optional(S.String),
    LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ChangeProgressStage",
}) as any as S.Schema<ChangeProgressStage>;
export type ChangeProgressStageList = ChangeProgressStage[];
export const ChangeProgressStageList = S.Array(ChangeProgressStage);
export type OptionState =
  | "RequiresIndexDocuments"
  | "Processing"
  | "Active"
  | (string & {});
export const OptionState = S.String;
export interface OptionStatus {
  CreationDate: Date;
  UpdateDate: Date;
  UpdateVersion?: number;
  State: OptionState;
  PendingDeletion?: boolean;
}
export const OptionStatus = S.suspend(() =>
  S.Struct({
    CreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    UpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    UpdateVersion: S.optional(S.Number),
    State: OptionState,
    PendingDeletion: S.optional(S.Boolean),
  }),
).annotations({ identifier: "OptionStatus" }) as any as S.Schema<OptionStatus>;
export interface ElasticsearchClusterConfigStatus {
  Options: ElasticsearchClusterConfig;
  Status: OptionStatus;
}
export const ElasticsearchClusterConfigStatus = S.suspend(() =>
  S.Struct({ Options: ElasticsearchClusterConfig, Status: OptionStatus }),
).annotations({
  identifier: "ElasticsearchClusterConfigStatus",
}) as any as S.Schema<ElasticsearchClusterConfigStatus>;
export interface EBSOptionsStatus {
  Options: EBSOptions;
  Status: OptionStatus;
}
export const EBSOptionsStatus = S.suspend(() =>
  S.Struct({ Options: EBSOptions, Status: OptionStatus }),
).annotations({
  identifier: "EBSOptionsStatus",
}) as any as S.Schema<EBSOptionsStatus>;
export interface AccessPoliciesStatus {
  Options: string;
  Status: OptionStatus;
}
export const AccessPoliciesStatus = S.suspend(() =>
  S.Struct({ Options: S.String, Status: OptionStatus }),
).annotations({
  identifier: "AccessPoliciesStatus",
}) as any as S.Schema<AccessPoliciesStatus>;
export interface SnapshotOptionsStatus {
  Options: SnapshotOptions;
  Status: OptionStatus;
}
export const SnapshotOptionsStatus = S.suspend(() =>
  S.Struct({ Options: SnapshotOptions, Status: OptionStatus }),
).annotations({
  identifier: "SnapshotOptionsStatus",
}) as any as S.Schema<SnapshotOptionsStatus>;
export interface VPCDerivedInfoStatus {
  Options: VPCDerivedInfo;
  Status: OptionStatus;
}
export const VPCDerivedInfoStatus = S.suspend(() =>
  S.Struct({ Options: VPCDerivedInfo, Status: OptionStatus }),
).annotations({
  identifier: "VPCDerivedInfoStatus",
}) as any as S.Schema<VPCDerivedInfoStatus>;
export interface CognitoOptionsStatus {
  Options: CognitoOptions;
  Status: OptionStatus;
}
export const CognitoOptionsStatus = S.suspend(() =>
  S.Struct({ Options: CognitoOptions, Status: OptionStatus }),
).annotations({
  identifier: "CognitoOptionsStatus",
}) as any as S.Schema<CognitoOptionsStatus>;
export interface EncryptionAtRestOptionsStatus {
  Options: EncryptionAtRestOptions;
  Status: OptionStatus;
}
export const EncryptionAtRestOptionsStatus = S.suspend(() =>
  S.Struct({ Options: EncryptionAtRestOptions, Status: OptionStatus }),
).annotations({
  identifier: "EncryptionAtRestOptionsStatus",
}) as any as S.Schema<EncryptionAtRestOptionsStatus>;
export interface NodeToNodeEncryptionOptionsStatus {
  Options: NodeToNodeEncryptionOptions;
  Status: OptionStatus;
}
export const NodeToNodeEncryptionOptionsStatus = S.suspend(() =>
  S.Struct({ Options: NodeToNodeEncryptionOptions, Status: OptionStatus }),
).annotations({
  identifier: "NodeToNodeEncryptionOptionsStatus",
}) as any as S.Schema<NodeToNodeEncryptionOptionsStatus>;
export interface AdvancedOptionsStatus {
  Options: { [key: string]: string | undefined };
  Status: OptionStatus;
}
export const AdvancedOptionsStatus = S.suspend(() =>
  S.Struct({ Options: AdvancedOptions, Status: OptionStatus }),
).annotations({
  identifier: "AdvancedOptionsStatus",
}) as any as S.Schema<AdvancedOptionsStatus>;
export interface LogPublishingOptionsStatus {
  Options?: { [key: string]: LogPublishingOption | undefined };
  Status?: OptionStatus;
}
export const LogPublishingOptionsStatus = S.suspend(() =>
  S.Struct({
    Options: S.optional(LogPublishingOptions),
    Status: S.optional(OptionStatus),
  }),
).annotations({
  identifier: "LogPublishingOptionsStatus",
}) as any as S.Schema<LogPublishingOptionsStatus>;
export interface DomainEndpointOptionsStatus {
  Options: DomainEndpointOptions;
  Status: OptionStatus;
}
export const DomainEndpointOptionsStatus = S.suspend(() =>
  S.Struct({ Options: DomainEndpointOptions, Status: OptionStatus }),
).annotations({
  identifier: "DomainEndpointOptionsStatus",
}) as any as S.Schema<DomainEndpointOptionsStatus>;
export interface AdvancedSecurityOptionsStatus {
  Options: AdvancedSecurityOptions;
  Status: OptionStatus;
}
export const AdvancedSecurityOptionsStatus = S.suspend(() =>
  S.Struct({ Options: AdvancedSecurityOptions, Status: OptionStatus }),
).annotations({
  identifier: "AdvancedSecurityOptionsStatus",
}) as any as S.Schema<AdvancedSecurityOptionsStatus>;
export interface UpgradeStepItem {
  UpgradeStep?: UpgradeStep;
  UpgradeStepStatus?: UpgradeStatus;
  Issues?: string[];
  ProgressPercent?: number;
}
export const UpgradeStepItem = S.suspend(() =>
  S.Struct({
    UpgradeStep: S.optional(UpgradeStep),
    UpgradeStepStatus: S.optional(UpgradeStatus),
    Issues: S.optional(Issues),
    ProgressPercent: S.optional(S.Number),
  }),
).annotations({
  identifier: "UpgradeStepItem",
}) as any as S.Schema<UpgradeStepItem>;
export type UpgradeStepsList = UpgradeStepItem[];
export const UpgradeStepsList = S.Array(UpgradeStepItem);
export type ScheduledAutoTuneActionType =
  | "JVM_HEAP_SIZE_TUNING"
  | "JVM_YOUNG_GEN_TUNING"
  | (string & {});
export const ScheduledAutoTuneActionType = S.String;
export type ScheduledAutoTuneSeverityType =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | (string & {});
export const ScheduledAutoTuneSeverityType = S.String;
export type LimitValueList = string[];
export const LimitValueList = S.Array(S.String);
export interface AutoTuneOptionsInput {
  DesiredState?: AutoTuneDesiredState;
  MaintenanceSchedules?: AutoTuneMaintenanceSchedule[];
}
export const AutoTuneOptionsInput = S.suspend(() =>
  S.Struct({
    DesiredState: S.optional(AutoTuneDesiredState),
    MaintenanceSchedules: S.optional(AutoTuneMaintenanceScheduleList),
  }),
).annotations({
  identifier: "AutoTuneOptionsInput",
}) as any as S.Schema<AutoTuneOptionsInput>;
export interface ChangeProgressStatusDetails {
  ChangeId?: string;
  StartTime?: Date;
  Status?: OverallChangeStatus;
  PendingProperties?: string[];
  CompletedProperties?: string[];
  TotalNumberOfStages?: number;
  ChangeProgressStages?: ChangeProgressStage[];
  ConfigChangeStatus?: ConfigChangeStatus;
  LastUpdatedTime?: Date;
  InitiatedBy?: InitiatedBy;
}
export const ChangeProgressStatusDetails = S.suspend(() =>
  S.Struct({
    ChangeId: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(OverallChangeStatus),
    PendingProperties: S.optional(StringList),
    CompletedProperties: S.optional(StringList),
    TotalNumberOfStages: S.optional(S.Number),
    ChangeProgressStages: S.optional(ChangeProgressStageList),
    ConfigChangeStatus: S.optional(ConfigChangeStatus),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    InitiatedBy: S.optional(InitiatedBy),
  }),
).annotations({
  identifier: "ChangeProgressStatusDetails",
}) as any as S.Schema<ChangeProgressStatusDetails>;
export interface ReservedElasticsearchInstanceOffering {
  ReservedElasticsearchInstanceOfferingId?: string;
  ElasticsearchInstanceType?: ESPartitionInstanceType;
  Duration?: number;
  FixedPrice?: number;
  UsagePrice?: number;
  CurrencyCode?: string;
  PaymentOption?: ReservedElasticsearchInstancePaymentOption;
  RecurringCharges?: RecurringCharge[];
}
export const ReservedElasticsearchInstanceOffering = S.suspend(() =>
  S.Struct({
    ReservedElasticsearchInstanceOfferingId: S.optional(S.String),
    ElasticsearchInstanceType: S.optional(ESPartitionInstanceType),
    Duration: S.optional(S.Number),
    FixedPrice: S.optional(S.Number),
    UsagePrice: S.optional(S.Number),
    CurrencyCode: S.optional(S.String),
    PaymentOption: S.optional(ReservedElasticsearchInstancePaymentOption),
    RecurringCharges: S.optional(RecurringChargeList),
  }),
).annotations({
  identifier: "ReservedElasticsearchInstanceOffering",
}) as any as S.Schema<ReservedElasticsearchInstanceOffering>;
export type ReservedElasticsearchInstanceOfferingList =
  ReservedElasticsearchInstanceOffering[];
export const ReservedElasticsearchInstanceOfferingList = S.Array(
  ReservedElasticsearchInstanceOffering.pipe(
    T.XmlName("ReservedElasticsearchInstanceOffering"),
  ).annotations({ identifier: "ReservedElasticsearchInstanceOffering" }),
);
export interface UpgradeHistory {
  UpgradeName?: string;
  StartTimestamp?: Date;
  UpgradeStatus?: UpgradeStatus;
  StepsList?: UpgradeStepItem[];
}
export const UpgradeHistory = S.suspend(() =>
  S.Struct({
    UpgradeName: S.optional(S.String),
    StartTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpgradeStatus: S.optional(UpgradeStatus),
    StepsList: S.optional(UpgradeStepsList),
  }),
).annotations({
  identifier: "UpgradeHistory",
}) as any as S.Schema<UpgradeHistory>;
export type UpgradeHistoryList = UpgradeHistory[];
export const UpgradeHistoryList = S.Array(UpgradeHistory);
export interface DryRunResults {
  DeploymentType?: string;
  Message?: string;
}
export const DryRunResults = S.suspend(() =>
  S.Struct({
    DeploymentType: S.optional(S.String),
    Message: S.optional(S.String),
  }),
).annotations({
  identifier: "DryRunResults",
}) as any as S.Schema<DryRunResults>;
export interface ScheduledAutoTuneDetails {
  Date?: Date;
  ActionType?: ScheduledAutoTuneActionType;
  Action?: string;
  Severity?: ScheduledAutoTuneSeverityType;
}
export const ScheduledAutoTuneDetails = S.suspend(() =>
  S.Struct({
    Date: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ActionType: S.optional(ScheduledAutoTuneActionType),
    Action: S.optional(S.String),
    Severity: S.optional(ScheduledAutoTuneSeverityType),
  }),
).annotations({
  identifier: "ScheduledAutoTuneDetails",
}) as any as S.Schema<ScheduledAutoTuneDetails>;
export interface AutoTuneStatus {
  CreationDate: Date;
  UpdateDate: Date;
  UpdateVersion?: number;
  State: AutoTuneState;
  ErrorMessage?: string;
  PendingDeletion?: boolean;
}
export const AutoTuneStatus = S.suspend(() =>
  S.Struct({
    CreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    UpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    UpdateVersion: S.optional(S.Number),
    State: AutoTuneState,
    ErrorMessage: S.optional(S.String),
    PendingDeletion: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AutoTuneStatus",
}) as any as S.Schema<AutoTuneStatus>;
export interface AdditionalLimit {
  LimitName?: string;
  LimitValues?: string[];
}
export const AdditionalLimit = S.suspend(() =>
  S.Struct({
    LimitName: S.optional(S.String),
    LimitValues: S.optional(LimitValueList),
  }),
).annotations({
  identifier: "AdditionalLimit",
}) as any as S.Schema<AdditionalLimit>;
export type AdditionalLimitList = AdditionalLimit[];
export const AdditionalLimitList = S.Array(AdditionalLimit);
export interface AcceptInboundCrossClusterSearchConnectionResponse {
  CrossClusterSearchConnection?: InboundCrossClusterSearchConnection;
}
export const AcceptInboundCrossClusterSearchConnectionResponse = S.suspend(() =>
  S.Struct({
    CrossClusterSearchConnection: S.optional(
      InboundCrossClusterSearchConnection,
    ),
  }).pipe(ns),
).annotations({
  identifier: "AcceptInboundCrossClusterSearchConnectionResponse",
}) as any as S.Schema<AcceptInboundCrossClusterSearchConnectionResponse>;
export interface AssociatePackageResponse {
  DomainPackageDetails?: DomainPackageDetails;
}
export const AssociatePackageResponse = S.suspend(() =>
  S.Struct({ DomainPackageDetails: S.optional(DomainPackageDetails) }).pipe(ns),
).annotations({
  identifier: "AssociatePackageResponse",
}) as any as S.Schema<AssociatePackageResponse>;
export interface CreateElasticsearchDomainRequest {
  DomainName: string;
  ElasticsearchVersion?: string;
  ElasticsearchClusterConfig?: ElasticsearchClusterConfig;
  EBSOptions?: EBSOptions;
  AccessPolicies?: string;
  SnapshotOptions?: SnapshotOptions;
  VPCOptions?: VPCOptions;
  CognitoOptions?: CognitoOptions;
  EncryptionAtRestOptions?: EncryptionAtRestOptions;
  NodeToNodeEncryptionOptions?: NodeToNodeEncryptionOptions;
  AdvancedOptions?: { [key: string]: string | undefined };
  LogPublishingOptions?: { [key: string]: LogPublishingOption | undefined };
  DomainEndpointOptions?: DomainEndpointOptions;
  AdvancedSecurityOptions?: AdvancedSecurityOptionsInput;
  AutoTuneOptions?: AutoTuneOptionsInput;
  TagList?: Tag[];
}
export const CreateElasticsearchDomainRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String,
    ElasticsearchVersion: S.optional(S.String),
    ElasticsearchClusterConfig: S.optional(ElasticsearchClusterConfig),
    EBSOptions: S.optional(EBSOptions),
    AccessPolicies: S.optional(S.String),
    SnapshotOptions: S.optional(SnapshotOptions),
    VPCOptions: S.optional(VPCOptions),
    CognitoOptions: S.optional(CognitoOptions),
    EncryptionAtRestOptions: S.optional(EncryptionAtRestOptions),
    NodeToNodeEncryptionOptions: S.optional(NodeToNodeEncryptionOptions),
    AdvancedOptions: S.optional(AdvancedOptions),
    LogPublishingOptions: S.optional(LogPublishingOptions),
    DomainEndpointOptions: S.optional(DomainEndpointOptions),
    AdvancedSecurityOptions: S.optional(AdvancedSecurityOptionsInput),
    AutoTuneOptions: S.optional(AutoTuneOptionsInput),
    TagList: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2015-01-01/es/domain" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateElasticsearchDomainRequest",
}) as any as S.Schema<CreateElasticsearchDomainRequest>;
export interface CreateVpcEndpointResponse {
  VpcEndpoint: VpcEndpoint;
}
export const CreateVpcEndpointResponse = S.suspend(() =>
  S.Struct({ VpcEndpoint: VpcEndpoint }).pipe(ns),
).annotations({
  identifier: "CreateVpcEndpointResponse",
}) as any as S.Schema<CreateVpcEndpointResponse>;
export interface DeleteOutboundCrossClusterSearchConnectionResponse {
  CrossClusterSearchConnection?: OutboundCrossClusterSearchConnection;
}
export const DeleteOutboundCrossClusterSearchConnectionResponse = S.suspend(
  () =>
    S.Struct({
      CrossClusterSearchConnection: S.optional(
        OutboundCrossClusterSearchConnection,
      ),
    }).pipe(ns),
).annotations({
  identifier: "DeleteOutboundCrossClusterSearchConnectionResponse",
}) as any as S.Schema<DeleteOutboundCrossClusterSearchConnectionResponse>;
export interface DescribeDomainChangeProgressResponse {
  ChangeProgressStatus?: ChangeProgressStatusDetails;
}
export const DescribeDomainChangeProgressResponse = S.suspend(() =>
  S.Struct({
    ChangeProgressStatus: S.optional(ChangeProgressStatusDetails),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDomainChangeProgressResponse",
}) as any as S.Schema<DescribeDomainChangeProgressResponse>;
export interface DescribeReservedElasticsearchInstanceOfferingsResponse {
  NextToken?: string;
  ReservedElasticsearchInstanceOfferings?: ReservedElasticsearchInstanceOffering[];
}
export const DescribeReservedElasticsearchInstanceOfferingsResponse = S.suspend(
  () =>
    S.Struct({
      NextToken: S.optional(S.String),
      ReservedElasticsearchInstanceOfferings: S.optional(
        ReservedElasticsearchInstanceOfferingList,
      ),
    }).pipe(ns),
).annotations({
  identifier: "DescribeReservedElasticsearchInstanceOfferingsResponse",
}) as any as S.Schema<DescribeReservedElasticsearchInstanceOfferingsResponse>;
export interface GetUpgradeHistoryResponse {
  UpgradeHistories?: UpgradeHistory[];
  NextToken?: string;
}
export const GetUpgradeHistoryResponse = S.suspend(() =>
  S.Struct({
    UpgradeHistories: S.optional(UpgradeHistoryList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetUpgradeHistoryResponse",
}) as any as S.Schema<GetUpgradeHistoryResponse>;
export interface ElasticsearchVersionStatus {
  Options: string;
  Status: OptionStatus;
}
export const ElasticsearchVersionStatus = S.suspend(() =>
  S.Struct({ Options: S.String, Status: OptionStatus }),
).annotations({
  identifier: "ElasticsearchVersionStatus",
}) as any as S.Schema<ElasticsearchVersionStatus>;
export interface AutoTuneOptionsStatus {
  Options?: AutoTuneOptions;
  Status?: AutoTuneStatus;
}
export const AutoTuneOptionsStatus = S.suspend(() =>
  S.Struct({
    Options: S.optional(AutoTuneOptions),
    Status: S.optional(AutoTuneStatus),
  }),
).annotations({
  identifier: "AutoTuneOptionsStatus",
}) as any as S.Schema<AutoTuneOptionsStatus>;
export interface ElasticsearchDomainConfig {
  ElasticsearchVersion?: ElasticsearchVersionStatus;
  ElasticsearchClusterConfig?: ElasticsearchClusterConfigStatus;
  EBSOptions?: EBSOptionsStatus;
  AccessPolicies?: AccessPoliciesStatus;
  SnapshotOptions?: SnapshotOptionsStatus;
  VPCOptions?: VPCDerivedInfoStatus;
  CognitoOptions?: CognitoOptionsStatus;
  EncryptionAtRestOptions?: EncryptionAtRestOptionsStatus;
  NodeToNodeEncryptionOptions?: NodeToNodeEncryptionOptionsStatus;
  AdvancedOptions?: AdvancedOptionsStatus;
  LogPublishingOptions?: LogPublishingOptionsStatus;
  DomainEndpointOptions?: DomainEndpointOptionsStatus;
  AdvancedSecurityOptions?: AdvancedSecurityOptionsStatus;
  AutoTuneOptions?: AutoTuneOptionsStatus;
  ChangeProgressDetails?: ChangeProgressDetails;
  ModifyingProperties?: ModifyingProperties[];
}
export const ElasticsearchDomainConfig = S.suspend(() =>
  S.Struct({
    ElasticsearchVersion: S.optional(ElasticsearchVersionStatus),
    ElasticsearchClusterConfig: S.optional(ElasticsearchClusterConfigStatus),
    EBSOptions: S.optional(EBSOptionsStatus),
    AccessPolicies: S.optional(AccessPoliciesStatus),
    SnapshotOptions: S.optional(SnapshotOptionsStatus),
    VPCOptions: S.optional(VPCDerivedInfoStatus),
    CognitoOptions: S.optional(CognitoOptionsStatus),
    EncryptionAtRestOptions: S.optional(EncryptionAtRestOptionsStatus),
    NodeToNodeEncryptionOptions: S.optional(NodeToNodeEncryptionOptionsStatus),
    AdvancedOptions: S.optional(AdvancedOptionsStatus),
    LogPublishingOptions: S.optional(LogPublishingOptionsStatus),
    DomainEndpointOptions: S.optional(DomainEndpointOptionsStatus),
    AdvancedSecurityOptions: S.optional(AdvancedSecurityOptionsStatus),
    AutoTuneOptions: S.optional(AutoTuneOptionsStatus),
    ChangeProgressDetails: S.optional(ChangeProgressDetails),
    ModifyingProperties: S.optional(ModifyingPropertiesList),
  }),
).annotations({
  identifier: "ElasticsearchDomainConfig",
}) as any as S.Schema<ElasticsearchDomainConfig>;
export interface UpdateElasticsearchDomainConfigResponse {
  DomainConfig: ElasticsearchDomainConfig;
  DryRunResults?: DryRunResults;
}
export const UpdateElasticsearchDomainConfigResponse = S.suspend(() =>
  S.Struct({
    DomainConfig: ElasticsearchDomainConfig,
    DryRunResults: S.optional(DryRunResults),
  }).pipe(ns),
).annotations({
  identifier: "UpdateElasticsearchDomainConfigResponse",
}) as any as S.Schema<UpdateElasticsearchDomainConfigResponse>;
export interface AutoTuneDetails {
  ScheduledAutoTuneDetails?: ScheduledAutoTuneDetails;
}
export const AutoTuneDetails = S.suspend(() =>
  S.Struct({ ScheduledAutoTuneDetails: S.optional(ScheduledAutoTuneDetails) }),
).annotations({
  identifier: "AutoTuneDetails",
}) as any as S.Schema<AutoTuneDetails>;
export interface StorageTypeLimit {
  LimitName?: string;
  LimitValues?: string[];
}
export const StorageTypeLimit = S.suspend(() =>
  S.Struct({
    LimitName: S.optional(S.String),
    LimitValues: S.optional(LimitValueList),
  }),
).annotations({
  identifier: "StorageTypeLimit",
}) as any as S.Schema<StorageTypeLimit>;
export type StorageTypeLimitList = StorageTypeLimit[];
export const StorageTypeLimitList = S.Array(StorageTypeLimit);
export interface InstanceCountLimits {
  MinimumInstanceCount?: number;
  MaximumInstanceCount?: number;
}
export const InstanceCountLimits = S.suspend(() =>
  S.Struct({
    MinimumInstanceCount: S.optional(S.Number),
    MaximumInstanceCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "InstanceCountLimits",
}) as any as S.Schema<InstanceCountLimits>;
export interface AutoTune {
  AutoTuneType?: AutoTuneType;
  AutoTuneDetails?: AutoTuneDetails;
}
export const AutoTune = S.suspend(() =>
  S.Struct({
    AutoTuneType: S.optional(AutoTuneType),
    AutoTuneDetails: S.optional(AutoTuneDetails),
  }),
).annotations({ identifier: "AutoTune" }) as any as S.Schema<AutoTune>;
export type AutoTuneList = AutoTune[];
export const AutoTuneList = S.Array(AutoTune);
export interface StorageType {
  StorageTypeName?: string;
  StorageSubTypeName?: string;
  StorageTypeLimits?: StorageTypeLimit[];
}
export const StorageType = S.suspend(() =>
  S.Struct({
    StorageTypeName: S.optional(S.String),
    StorageSubTypeName: S.optional(S.String),
    StorageTypeLimits: S.optional(StorageTypeLimitList),
  }),
).annotations({ identifier: "StorageType" }) as any as S.Schema<StorageType>;
export type StorageTypeList = StorageType[];
export const StorageTypeList = S.Array(StorageType);
export interface InstanceLimits {
  InstanceCountLimits?: InstanceCountLimits;
}
export const InstanceLimits = S.suspend(() =>
  S.Struct({ InstanceCountLimits: S.optional(InstanceCountLimits) }),
).annotations({
  identifier: "InstanceLimits",
}) as any as S.Schema<InstanceLimits>;
export interface CreateElasticsearchDomainResponse {
  DomainStatus?: ElasticsearchDomainStatus;
}
export const CreateElasticsearchDomainResponse = S.suspend(() =>
  S.Struct({ DomainStatus: S.optional(ElasticsearchDomainStatus) }).pipe(ns),
).annotations({
  identifier: "CreateElasticsearchDomainResponse",
}) as any as S.Schema<CreateElasticsearchDomainResponse>;
export interface DeleteElasticsearchDomainResponse {
  DomainStatus?: ElasticsearchDomainStatus;
}
export const DeleteElasticsearchDomainResponse = S.suspend(() =>
  S.Struct({ DomainStatus: S.optional(ElasticsearchDomainStatus) }).pipe(ns),
).annotations({
  identifier: "DeleteElasticsearchDomainResponse",
}) as any as S.Schema<DeleteElasticsearchDomainResponse>;
export interface DescribeDomainAutoTunesResponse {
  AutoTunes?: AutoTune[];
  NextToken?: string;
}
export const DescribeDomainAutoTunesResponse = S.suspend(() =>
  S.Struct({
    AutoTunes: S.optional(AutoTuneList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDomainAutoTunesResponse",
}) as any as S.Schema<DescribeDomainAutoTunesResponse>;
export interface DescribeElasticsearchDomainConfigResponse {
  DomainConfig: ElasticsearchDomainConfig;
}
export const DescribeElasticsearchDomainConfigResponse = S.suspend(() =>
  S.Struct({ DomainConfig: ElasticsearchDomainConfig }).pipe(ns),
).annotations({
  identifier: "DescribeElasticsearchDomainConfigResponse",
}) as any as S.Schema<DescribeElasticsearchDomainConfigResponse>;
export interface Limits {
  StorageTypes?: StorageType[];
  InstanceLimits?: InstanceLimits;
  AdditionalLimits?: AdditionalLimit[];
}
export const Limits = S.suspend(() =>
  S.Struct({
    StorageTypes: S.optional(StorageTypeList),
    InstanceLimits: S.optional(InstanceLimits),
    AdditionalLimits: S.optional(AdditionalLimitList),
  }),
).annotations({ identifier: "Limits" }) as any as S.Schema<Limits>;
export type LimitsByRole = { [key: string]: Limits | undefined };
export const LimitsByRole = S.Record({
  key: S.String,
  value: S.UndefinedOr(Limits),
});
export interface DescribeElasticsearchInstanceTypeLimitsResponse {
  LimitsByRole?: { [key: string]: Limits | undefined };
}
export const DescribeElasticsearchInstanceTypeLimitsResponse = S.suspend(() =>
  S.Struct({ LimitsByRole: S.optional(LimitsByRole) }).pipe(ns),
).annotations({
  identifier: "DescribeElasticsearchInstanceTypeLimitsResponse",
}) as any as S.Schema<DescribeElasticsearchInstanceTypeLimitsResponse>;

//# Errors
export class BaseException extends S.TaggedError<BaseException>()(
  "BaseException",
  { message: S.optional(S.String) },
) {}
export class InternalException extends S.TaggedError<InternalException>()(
  "InternalException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class DisabledOperationException extends S.TaggedError<DisabledOperationException>()(
  "DisabledOperationException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InvalidPaginationTokenException extends S.TaggedError<InvalidPaginationTokenException>()(
  "InvalidPaginationTokenException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InvalidTypeException extends S.TaggedError<InvalidTypeException>()(
  "InvalidTypeException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}

//# Operations
/**
 * Retrieves all Amazon OpenSearch Service-managed VPC endpoints in the current account and Region.
 */
export const listVpcEndpoints: (
  input: ListVpcEndpointsRequest,
) => effect.Effect<
  ListVpcEndpointsResponse,
  BaseException | DisabledOperationException | InternalException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListVpcEndpointsRequest,
  output: ListVpcEndpointsResponse,
  errors: [BaseException, DisabledOperationException, InternalException],
}));
/**
 * Deletes the service-linked role that Elasticsearch Service uses to manage and maintain VPC domains. Role deletion will fail if any existing VPC domains use the role. You must delete any such Elasticsearch domains before deleting the role. See Deleting Elasticsearch Service Role in *VPC Endpoints for Amazon Elasticsearch Service Domains*.
 */
export const deleteElasticsearchServiceRole: (
  input: DeleteElasticsearchServiceRoleRequest,
) => effect.Effect<
  DeleteElasticsearchServiceRoleResponse,
  BaseException | InternalException | ValidationException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteElasticsearchServiceRoleRequest,
  output: DeleteElasticsearchServiceRoleResponse,
  errors: [BaseException, InternalException, ValidationException],
}));
/**
 * Returns domain configuration information about the specified Elasticsearch domain, including the domain ID, domain endpoint, and domain ARN.
 */
export const describeElasticsearchDomain: (
  input: DescribeElasticsearchDomainRequest,
) => effect.Effect<
  DescribeElasticsearchDomainResponse,
  | BaseException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeElasticsearchDomainRequest,
  output: DescribeElasticsearchDomainResponse,
  errors: [
    BaseException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information about reserved Elasticsearch instances for this account.
 */
export const describeReservedElasticsearchInstances: {
  (
    input: DescribeReservedElasticsearchInstancesRequest,
  ): effect.Effect<
    DescribeReservedElasticsearchInstancesResponse,
    | DisabledOperationException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeReservedElasticsearchInstancesRequest,
  ) => stream.Stream<
    DescribeReservedElasticsearchInstancesResponse,
    | DisabledOperationException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeReservedElasticsearchInstancesRequest,
  ) => stream.Stream<
    unknown,
    | DisabledOperationException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeReservedElasticsearchInstancesRequest,
  output: DescribeReservedElasticsearchInstancesResponse,
  errors: [
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Describes one or more Amazon OpenSearch Service-managed VPC endpoints.
 */
export const describeVpcEndpoints: (
  input: DescribeVpcEndpointsRequest,
) => effect.Effect<
  DescribeVpcEndpointsResponse,
  | BaseException
  | DisabledOperationException
  | InternalException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeVpcEndpointsRequest,
  output: DescribeVpcEndpointsResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    ValidationException,
  ],
}));
/**
 * Returns a list of upgrade compatible Elastisearch versions.
 * You can optionally pass a
 *
 * DomainName
 *
 * to get all upgrade compatible Elasticsearch versions for that specific domain.
 */
export const getCompatibleElasticsearchVersions: (
  input: GetCompatibleElasticsearchVersionsRequest,
) => effect.Effect<
  GetCompatibleElasticsearchVersionsResponse,
  | BaseException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCompatibleElasticsearchVersionsRequest,
  output: GetCompatibleElasticsearchVersionsResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a list of versions of the package, along with their creation time and commit message.
 */
export const getPackageVersionHistory: {
  (
    input: GetPackageVersionHistoryRequest,
  ): effect.Effect<
    GetPackageVersionHistoryResponse,
    | AccessDeniedException
    | BaseException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: GetPackageVersionHistoryRequest,
  ) => stream.Stream<
    GetPackageVersionHistoryResponse,
    | AccessDeniedException
    | BaseException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: GetPackageVersionHistoryRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | BaseException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetPackageVersionHistoryRequest,
  output: GetPackageVersionHistoryResponse,
  errors: [
    AccessDeniedException,
    BaseException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the name of all Elasticsearch domains owned by the current user's account.
 */
export const listDomainNames: (
  input: ListDomainNamesRequest,
) => effect.Effect<
  ListDomainNamesResponse,
  BaseException | ValidationException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDomainNamesRequest,
  output: ListDomainNamesResponse,
  errors: [BaseException, ValidationException],
}));
/**
 * Modifies an Amazon OpenSearch Service-managed interface VPC endpoint.
 */
export const updateVpcEndpoint: (
  input: UpdateVpcEndpointRequest,
) => effect.Effect<
  UpdateVpcEndpointResponse,
  | BaseException
  | ConflictException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVpcEndpointRequest,
  output: UpdateVpcEndpointResponse,
  errors: [
    BaseException,
    ConflictException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Attaches tags to an existing Elasticsearch domain. Tags are a set of case-sensitive key value pairs. An Elasticsearch domain may have up to 10 tags. See
 * Tagging Amazon Elasticsearch Service Domains for more information.
 */
export const addTags: (
  input: AddTagsRequest,
) => effect.Effect<
  AddTagsResponse,
  | BaseException
  | InternalException
  | LimitExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsRequest,
  output: AddTagsResponse,
  errors: [
    BaseException,
    InternalException,
    LimitExceededException,
    ValidationException,
  ],
}));
/**
 * Returns domain configuration information about the specified Elasticsearch domains, including the domain ID, domain endpoint, and domain ARN.
 */
export const describeElasticsearchDomains: (
  input: DescribeElasticsearchDomainsRequest,
) => effect.Effect<
  DescribeElasticsearchDomainsResponse,
  BaseException | InternalException | ValidationException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeElasticsearchDomainsRequest,
  output: DescribeElasticsearchDomainsResponse,
  errors: [BaseException, InternalException, ValidationException],
}));
/**
 * Removes the specified set of tags from the specified Elasticsearch domain.
 */
export const removeTags: (
  input: RemoveTagsRequest,
) => effect.Effect<
  RemoveTagsResponse,
  BaseException | InternalException | ValidationException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveTagsRequest,
  output: RemoveTagsResponse,
  errors: [BaseException, InternalException, ValidationException],
}));
/**
 * List all Elasticsearch instance types that are supported for given ElasticsearchVersion
 */
export const listElasticsearchInstanceTypes: {
  (
    input: ListElasticsearchInstanceTypesRequest,
  ): effect.Effect<
    ListElasticsearchInstanceTypesResponse,
    | BaseException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListElasticsearchInstanceTypesRequest,
  ) => stream.Stream<
    ListElasticsearchInstanceTypesResponse,
    | BaseException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListElasticsearchInstanceTypesRequest,
  ) => stream.Stream<
    unknown,
    | BaseException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListElasticsearchInstanceTypesRequest,
  output: ListElasticsearchInstanceTypesResponse,
  errors: [
    BaseException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List all supported Elasticsearch versions
 */
export const listElasticsearchVersions: {
  (
    input: ListElasticsearchVersionsRequest,
  ): effect.Effect<
    ListElasticsearchVersionsResponse,
    | BaseException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListElasticsearchVersionsRequest,
  ) => stream.Stream<
    ListElasticsearchVersionsResponse,
    | BaseException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListElasticsearchVersionsRequest,
  ) => stream.Stream<
    unknown,
    | BaseException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListElasticsearchVersionsRequest,
  output: ListElasticsearchVersionsResponse,
  errors: [
    BaseException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns all tags for the given Elasticsearch domain.
 */
export const listTags: (
  input: ListTagsRequest,
) => effect.Effect<
  ListTagsResponse,
  | BaseException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsRequest,
  output: ListTagsResponse,
  errors: [
    BaseException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Revokes access to an Amazon OpenSearch Service domain that was provided through an interface
 * VPC endpoint.
 */
export const revokeVpcEndpointAccess: (
  input: RevokeVpcEndpointAccessRequest,
) => effect.Effect<
  RevokeVpcEndpointAccessResponse,
  | BaseException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RevokeVpcEndpointAccessRequest,
  output: RevokeVpcEndpointAccessResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Schedules a service software update for an Amazon ES domain.
 */
export const startElasticsearchServiceSoftwareUpdate: (
  input: StartElasticsearchServiceSoftwareUpdateRequest,
) => effect.Effect<
  StartElasticsearchServiceSoftwareUpdateResponse,
  | BaseException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartElasticsearchServiceSoftwareUpdateRequest,
  output: StartElasticsearchServiceSoftwareUpdateResponse,
  errors: [
    BaseException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Allows the destination domain owner to delete an existing inbound cross-cluster search connection.
 */
export const deleteInboundCrossClusterSearchConnection: (
  input: DeleteInboundCrossClusterSearchConnectionRequest,
) => effect.Effect<
  DeleteInboundCrossClusterSearchConnectionResponse,
  DisabledOperationException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInboundCrossClusterSearchConnectionRequest,
  output: DeleteInboundCrossClusterSearchConnectionResponse,
  errors: [DisabledOperationException, ResourceNotFoundException],
}));
/**
 * Retrieves the latest status of the last upgrade or upgrade eligibility check that was performed on the domain.
 */
export const getUpgradeStatus: (
  input: GetUpgradeStatusRequest,
) => effect.Effect<
  GetUpgradeStatusResponse,
  | BaseException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUpgradeStatusRequest,
  output: GetUpgradeStatusResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about each principal that is allowed to access a
 * given Amazon OpenSearch Service domain through the use of an interface VPC endpoint.
 */
export const listVpcEndpointAccess: (
  input: ListVpcEndpointAccessRequest,
) => effect.Effect<
  ListVpcEndpointAccessResponse,
  | BaseException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListVpcEndpointAccessRequest,
  output: ListVpcEndpointAccessResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves all Amazon OpenSearch Service-managed VPC endpoints associated with a particular domain.
 */
export const listVpcEndpointsForDomain: (
  input: ListVpcEndpointsForDomainRequest,
) => effect.Effect<
  ListVpcEndpointsForDomainResponse,
  | BaseException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListVpcEndpointsForDomainRequest,
  output: ListVpcEndpointsForDomainResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
  ],
}));
/**
 * Allows the destination domain owner to reject an inbound cross-cluster search connection request.
 */
export const rejectInboundCrossClusterSearchConnection: (
  input: RejectInboundCrossClusterSearchConnectionRequest,
) => effect.Effect<
  RejectInboundCrossClusterSearchConnectionResponse,
  DisabledOperationException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectInboundCrossClusterSearchConnectionRequest,
  output: RejectInboundCrossClusterSearchConnectionResponse,
  errors: [DisabledOperationException, ResourceNotFoundException],
}));
/**
 * Cancels a pending configuration change on an Amazon OpenSearch Service domain.
 */
export const cancelDomainConfigChange: (
  input: CancelDomainConfigChangeRequest,
) => effect.Effect<
  CancelDomainConfigChangeResponse,
  | BaseException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelDomainConfigChangeRequest,
  output: CancelDomainConfigChangeResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Cancels a scheduled service software update for an Amazon ES domain. You can only perform this operation before the `AutomatedUpdateDate` and when the `UpdateStatus` is in the `PENDING_UPDATE` state.
 */
export const cancelElasticsearchServiceSoftwareUpdate: (
  input: CancelElasticsearchServiceSoftwareUpdateRequest,
) => effect.Effect<
  CancelElasticsearchServiceSoftwareUpdateResponse,
  | BaseException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelElasticsearchServiceSoftwareUpdateRequest,
  output: CancelElasticsearchServiceSoftwareUpdateResponse,
  errors: [
    BaseException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes an Amazon OpenSearch Service-managed interface VPC endpoint.
 */
export const deleteVpcEndpoint: (
  input: DeleteVpcEndpointRequest,
) => effect.Effect<
  DeleteVpcEndpointResponse,
  | BaseException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVpcEndpointRequest,
  output: DeleteVpcEndpointResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists all Amazon ES domains associated with the package.
 */
export const listDomainsForPackage: {
  (
    input: ListDomainsForPackageRequest,
  ): effect.Effect<
    ListDomainsForPackageResponse,
    | AccessDeniedException
    | BaseException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListDomainsForPackageRequest,
  ) => stream.Stream<
    ListDomainsForPackageResponse,
    | AccessDeniedException
    | BaseException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListDomainsForPackageRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | BaseException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDomainsForPackageRequest,
  output: ListDomainsForPackageResponse,
  errors: [
    AccessDeniedException,
    BaseException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all packages associated with the Amazon ES domain.
 */
export const listPackagesForDomain: {
  (
    input: ListPackagesForDomainRequest,
  ): effect.Effect<
    ListPackagesForDomainResponse,
    | AccessDeniedException
    | BaseException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListPackagesForDomainRequest,
  ) => stream.Stream<
    ListPackagesForDomainResponse,
    | AccessDeniedException
    | BaseException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListPackagesForDomainRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | BaseException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPackagesForDomainRequest,
  output: ListPackagesForDomainResponse,
  errors: [
    AccessDeniedException,
    BaseException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Updates a package for use with Amazon ES domains.
 */
export const updatePackage: (
  input: UpdatePackageRequest,
) => effect.Effect<
  UpdatePackageResponse,
  | AccessDeniedException
  | BaseException
  | InternalException
  | LimitExceededException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePackageRequest,
  output: UpdatePackageResponse,
  errors: [
    AccessDeniedException,
    BaseException,
    InternalException,
    LimitExceededException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Delete the package.
 */
export const deletePackage: (
  input: DeletePackageRequest,
) => effect.Effect<
  DeletePackageResponse,
  | AccessDeniedException
  | BaseException
  | ConflictException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePackageRequest,
  output: DeletePackageResponse,
  errors: [
    AccessDeniedException,
    BaseException,
    ConflictException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes all packages available to Amazon ES. Includes options for filtering, limiting the number of results, and pagination.
 */
export const describePackages: {
  (
    input: DescribePackagesRequest,
  ): effect.Effect<
    DescribePackagesResponse,
    | AccessDeniedException
    | BaseException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribePackagesRequest,
  ) => stream.Stream<
    DescribePackagesResponse,
    | AccessDeniedException
    | BaseException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribePackagesRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | BaseException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribePackagesRequest,
  output: DescribePackagesResponse,
  errors: [
    AccessDeniedException,
    BaseException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all the outbound cross-cluster search connections for a source domain.
 */
export const describeOutboundCrossClusterSearchConnections: {
  (
    input: DescribeOutboundCrossClusterSearchConnectionsRequest,
  ): effect.Effect<
    DescribeOutboundCrossClusterSearchConnectionsResponse,
    DisabledOperationException | InvalidPaginationTokenException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeOutboundCrossClusterSearchConnectionsRequest,
  ) => stream.Stream<
    DescribeOutboundCrossClusterSearchConnectionsResponse,
    DisabledOperationException | InvalidPaginationTokenException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeOutboundCrossClusterSearchConnectionsRequest,
  ) => stream.Stream<
    unknown,
    DisabledOperationException | InvalidPaginationTokenException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeOutboundCrossClusterSearchConnectionsRequest,
  output: DescribeOutboundCrossClusterSearchConnectionsResponse,
  errors: [DisabledOperationException, InvalidPaginationTokenException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Dissociates a package from the Amazon ES domain.
 */
export const dissociatePackage: (
  input: DissociatePackageRequest,
) => effect.Effect<
  DissociatePackageResponse,
  | AccessDeniedException
  | BaseException
  | ConflictException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DissociatePackageRequest,
  output: DissociatePackageResponse,
  errors: [
    AccessDeniedException,
    BaseException,
    ConflictException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Provides access to an Amazon OpenSearch Service domain through the use of an interface VPC endpoint.
 */
export const authorizeVpcEndpointAccess: (
  input: AuthorizeVpcEndpointAccessRequest,
) => effect.Effect<
  AuthorizeVpcEndpointAccessResponse,
  | BaseException
  | DisabledOperationException
  | InternalException
  | LimitExceededException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AuthorizeVpcEndpointAccessRequest,
  output: AuthorizeVpcEndpointAccessResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    LimitExceededException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists all the inbound cross-cluster search connections for a destination domain.
 */
export const describeInboundCrossClusterSearchConnections: {
  (
    input: DescribeInboundCrossClusterSearchConnectionsRequest,
  ): effect.Effect<
    DescribeInboundCrossClusterSearchConnectionsResponse,
    DisabledOperationException | InvalidPaginationTokenException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeInboundCrossClusterSearchConnectionsRequest,
  ) => stream.Stream<
    DescribeInboundCrossClusterSearchConnectionsResponse,
    DisabledOperationException | InvalidPaginationTokenException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeInboundCrossClusterSearchConnectionsRequest,
  ) => stream.Stream<
    unknown,
    DisabledOperationException | InvalidPaginationTokenException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeInboundCrossClusterSearchConnectionsRequest,
  output: DescribeInboundCrossClusterSearchConnectionsResponse,
  errors: [DisabledOperationException, InvalidPaginationTokenException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Allows the destination domain owner to accept an inbound cross-cluster search connection request.
 */
export const acceptInboundCrossClusterSearchConnection: (
  input: AcceptInboundCrossClusterSearchConnectionRequest,
) => effect.Effect<
  AcceptInboundCrossClusterSearchConnectionResponse,
  | DisabledOperationException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptInboundCrossClusterSearchConnectionRequest,
  output: AcceptInboundCrossClusterSearchConnectionResponse,
  errors: [
    DisabledOperationException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Associates a package with an Amazon ES domain.
 */
export const associatePackage: (
  input: AssociatePackageRequest,
) => effect.Effect<
  AssociatePackageResponse,
  | AccessDeniedException
  | BaseException
  | ConflictException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociatePackageRequest,
  output: AssociatePackageResponse,
  errors: [
    AccessDeniedException,
    BaseException,
    ConflictException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon OpenSearch Service-managed VPC endpoint.
 */
export const createVpcEndpoint: (
  input: CreateVpcEndpointRequest,
) => effect.Effect<
  CreateVpcEndpointResponse,
  | BaseException
  | ConflictException
  | DisabledOperationException
  | InternalException
  | LimitExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVpcEndpointRequest,
  output: CreateVpcEndpointResponse,
  errors: [
    BaseException,
    ConflictException,
    DisabledOperationException,
    InternalException,
    LimitExceededException,
    ValidationException,
  ],
}));
/**
 * Allows the source domain owner to delete an existing outbound cross-cluster search connection.
 */
export const deleteOutboundCrossClusterSearchConnection: (
  input: DeleteOutboundCrossClusterSearchConnectionRequest,
) => effect.Effect<
  DeleteOutboundCrossClusterSearchConnectionResponse,
  DisabledOperationException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOutboundCrossClusterSearchConnectionRequest,
  output: DeleteOutboundCrossClusterSearchConnectionResponse,
  errors: [DisabledOperationException, ResourceNotFoundException],
}));
/**
 * Returns information about the current blue/green deployment happening on a domain, including
 * a change ID, status, and progress stages.
 */
export const describeDomainChangeProgress: (
  input: DescribeDomainChangeProgressRequest,
) => effect.Effect<
  DescribeDomainChangeProgressResponse,
  | BaseException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDomainChangeProgressRequest,
  output: DescribeDomainChangeProgressResponse,
  errors: [
    BaseException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists available reserved Elasticsearch instance offerings.
 */
export const describeReservedElasticsearchInstanceOfferings: {
  (
    input: DescribeReservedElasticsearchInstanceOfferingsRequest,
  ): effect.Effect<
    DescribeReservedElasticsearchInstanceOfferingsResponse,
    | DisabledOperationException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeReservedElasticsearchInstanceOfferingsRequest,
  ) => stream.Stream<
    DescribeReservedElasticsearchInstanceOfferingsResponse,
    | DisabledOperationException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeReservedElasticsearchInstanceOfferingsRequest,
  ) => stream.Stream<
    unknown,
    | DisabledOperationException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeReservedElasticsearchInstanceOfferingsRequest,
  output: DescribeReservedElasticsearchInstanceOfferingsResponse,
  errors: [
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the complete history of the last 10 upgrades that were performed on the domain.
 */
export const getUpgradeHistory: {
  (
    input: GetUpgradeHistoryRequest,
  ): effect.Effect<
    GetUpgradeHistoryResponse,
    | BaseException
    | DisabledOperationException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: GetUpgradeHistoryRequest,
  ) => stream.Stream<
    GetUpgradeHistoryResponse,
    | BaseException
    | DisabledOperationException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: GetUpgradeHistoryRequest,
  ) => stream.Stream<
    unknown,
    | BaseException
    | DisabledOperationException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetUpgradeHistoryRequest,
  output: GetUpgradeHistoryResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Allows you to either upgrade your domain or perform an Upgrade eligibility check to a compatible Elasticsearch version.
 */
export const upgradeElasticsearchDomain: (
  input: UpgradeElasticsearchDomainRequest,
) => effect.Effect<
  UpgradeElasticsearchDomainResponse,
  | BaseException
  | DisabledOperationException
  | InternalException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpgradeElasticsearchDomainRequest,
  output: UpgradeElasticsearchDomainResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Create a package for use with Amazon ES domains.
 */
export const createPackage: (
  input: CreatePackageRequest,
) => effect.Effect<
  CreatePackageResponse,
  | AccessDeniedException
  | BaseException
  | InternalException
  | InvalidTypeException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePackageRequest,
  output: CreatePackageResponse,
  errors: [
    AccessDeniedException,
    BaseException,
    InternalException,
    InvalidTypeException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ValidationException,
  ],
}));
/**
 * Allows you to purchase reserved Elasticsearch instances.
 */
export const purchaseReservedElasticsearchInstanceOffering: (
  input: PurchaseReservedElasticsearchInstanceOfferingRequest,
) => effect.Effect<
  PurchaseReservedElasticsearchInstanceOfferingResponse,
  | DisabledOperationException
  | InternalException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PurchaseReservedElasticsearchInstanceOfferingRequest,
  output: PurchaseReservedElasticsearchInstanceOfferingResponse,
  errors: [
    DisabledOperationException,
    InternalException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a new cross-cluster search connection from a source domain to a destination domain.
 */
export const createOutboundCrossClusterSearchConnection: (
  input: CreateOutboundCrossClusterSearchConnectionRequest,
) => effect.Effect<
  CreateOutboundCrossClusterSearchConnectionResponse,
  | DisabledOperationException
  | InternalException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOutboundCrossClusterSearchConnectionRequest,
  output: CreateOutboundCrossClusterSearchConnectionResponse,
  errors: [
    DisabledOperationException,
    InternalException,
    LimitExceededException,
    ResourceAlreadyExistsException,
  ],
}));
/**
 * Modifies the cluster configuration of the specified Elasticsearch domain, setting as setting the instance type and the number of instances.
 */
export const updateElasticsearchDomainConfig: (
  input: UpdateElasticsearchDomainConfigRequest,
) => effect.Effect<
  UpdateElasticsearchDomainConfigResponse,
  | BaseException
  | InternalException
  | InvalidTypeException
  | LimitExceededException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateElasticsearchDomainConfigRequest,
  output: UpdateElasticsearchDomainConfigResponse,
  errors: [
    BaseException,
    InternalException,
    InvalidTypeException,
    LimitExceededException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a new Elasticsearch domain. For more information,
 * see Creating Elasticsearch Domains in the *Amazon Elasticsearch Service Developer Guide*.
 */
export const createElasticsearchDomain: (
  input: CreateElasticsearchDomainRequest,
) => effect.Effect<
  CreateElasticsearchDomainResponse,
  | BaseException
  | DisabledOperationException
  | InternalException
  | InvalidTypeException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateElasticsearchDomainRequest,
  output: CreateElasticsearchDomainResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    InvalidTypeException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ValidationException,
  ],
}));
/**
 * Permanently deletes the specified Elasticsearch domain and all of its data. Once a domain is deleted, it cannot be recovered.
 */
export const deleteElasticsearchDomain: (
  input: DeleteElasticsearchDomainRequest,
) => effect.Effect<
  DeleteElasticsearchDomainResponse,
  | BaseException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteElasticsearchDomainRequest,
  output: DeleteElasticsearchDomainResponse,
  errors: [
    BaseException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Provides scheduled Auto-Tune action details for the Elasticsearch domain, such as Auto-Tune action type, description, severity, and scheduled date.
 */
export const describeDomainAutoTunes: {
  (
    input: DescribeDomainAutoTunesRequest,
  ): effect.Effect<
    DescribeDomainAutoTunesResponse,
    | BaseException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDomainAutoTunesRequest,
  ) => stream.Stream<
    DescribeDomainAutoTunesResponse,
    | BaseException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDomainAutoTunesRequest,
  ) => stream.Stream<
    unknown,
    | BaseException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDomainAutoTunesRequest,
  output: DescribeDomainAutoTunesResponse,
  errors: [
    BaseException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Provides cluster configuration information about the specified Elasticsearch domain, such as the state, creation date, update version, and update date for cluster options.
 */
export const describeElasticsearchDomainConfig: (
  input: DescribeElasticsearchDomainConfigRequest,
) => effect.Effect<
  DescribeElasticsearchDomainConfigResponse,
  | BaseException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeElasticsearchDomainConfigRequest,
  output: DescribeElasticsearchDomainConfigResponse,
  errors: [
    BaseException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describe Elasticsearch Limits for a given InstanceType and ElasticsearchVersion.
 * When modifying existing Domain, specify the
 *
 * DomainName
 *
 * to know what Limits are supported for modifying.
 */
export const describeElasticsearchInstanceTypeLimits: (
  input: DescribeElasticsearchInstanceTypeLimitsRequest,
) => effect.Effect<
  DescribeElasticsearchInstanceTypeLimitsResponse,
  | BaseException
  | InternalException
  | InvalidTypeException
  | LimitExceededException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeElasticsearchInstanceTypeLimitsRequest,
  output: DescribeElasticsearchInstanceTypeLimitsResponse,
  errors: [
    BaseException,
    InternalException,
    InvalidTypeException,
    LimitExceededException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
