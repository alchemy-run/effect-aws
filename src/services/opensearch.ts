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
const ns = T.XmlNamespace("http://es.amazonaws.com/doc/2021-01-01/");
const svc = T.AwsApiService({
  sdkId: "OpenSearch",
  serviceShapeName: "AmazonOpenSearchService",
});
const auth = T.AwsAuthSigv4({ name: "es" });
const ver = T.ServiceVersion("2021-01-01");
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
export type ConnectionId = string;
export type DomainName = string;
export type DataSourceName = string;
export type DataSourceDescription = string;
export type DirectQueryDataSourceName = string;
export type DirectQueryDataSourceDescription = string;
export type ARN = string;
export type PackageID = string;
export type AWSAccount = string;
export type DryRun = boolean;
export type ClientToken = string;
export type ApplicationName = string;
export type KmsKeyArn = string;
export type VersionString = string;
export type PolicyDocument = string;
export type IndexName = string;
export type IndexSchema = unknown;
export type ConnectionAlias = string;
export type PackageName = string;
export type PackageDescription = string;
export type EngineVersion = string;
export type DomainArn = string;
export type Id = string;
export type VpcEndpointId = string;
export type MaxResults = number;
export type NextToken = string;
export type GUID = string;
export type RequestId = string;
export type InstanceTypeString = string;
export type ReservationToken = string;
export type InstanceCount = number;
export type NodeId = string;
export type CommitMessage = string;
export type PackageUser = string;
export type TagKey = string;
export type TagValue = string;
export type RoleArn = string;
export type AppConfigValue = string;
export type IntegerClass = number;
export type UserPoolId = string;
export type IdentityPoolId = string;
export type KmsKeyId = string;
export type DomainNameFqdn = string;
export type IdentityCenterInstanceARN = string;
export type Endpoint = string;
export type S3BucketName = string;
export type S3Key = string;
export type LicenseFilepath = string;
export type NonEmptyString = string;
export type DescribePackagesFilterValue = string;
export type ErrorMessage = string;
export type NumberOfAZs = string;
export type NumberOfNodes = string;
export type NumberOfShards = string;
export type MaintenanceStatusMessage = string;
export type UpdateTimestamp = Date;
export type UpgradeName = string;
export type DirectQueryDataSourceRoleArn = string;
export type CloudWatchLogsLogGroupArn = string;
export type Username = string | redacted.Redacted<string>;
export type Password = string | redacted.Redacted<string>;
export type BackendRole = string;
export type SubjectKey = string;
export type RolesKey = string;
export type IAMFederationSubjectKey = string;
export type IAMFederationRolesKey = string;
export type StartAt = Date;
export type OwnerId = string;
export type Region = string;
export type DeploymentCloseDateTimeStamp = Date;
export type DomainId = string;
export type ServiceUrl = string;
export type HostedZoneId = string;
export type CreatedAt = Date;
export type LastUpdated = Date;
export type PackageVersion = string;
export type PackageOwner = string;
export type TotalNumberOfStages = number;
export type AvailabilityZone = string;
export type StorageTypeName = string;
export type VolumeSize = string;
export type DeploymentType = string;
export type Message = string;
export type InstanceRole = string;
export type ReferencePath = string;
export type StartTimestamp = Date;
export type SAMLMetadata = string;
export type SAMLEntityId = string;
export type DurationValue = number;
export type StartTimeHours = number;
export type StartTimeMinutes = number;
export type ConnectionStatusMessage = string;
export type DisableTimestamp = Date;
export type IdentityCenterApplicationARN = string;
export type IdentityStoreId = string;
export type ErrorType = string;
export type PluginName = string;
export type PluginDescription = string;
export type PluginVersion = string;
export type PluginClassName = string;
export type UncompressedPluginSizeInBytes = number;
export type ChangeProgressStageName = string;
export type ChangeProgressStageStatus = string;
export type Description = string;
export type Issue = string;
export type AutoTuneDate = Date;
export type ScheduledAutoTuneDescription = string;
export type UIntValue = number;
export type StorageSubTypeName = string;
export type LimitName = string;
export type LimitValue = string;
export type MinimumInstanceCount = number;
export type MaximumInstanceCount = number;

//# Schemas
export interface GetDefaultApplicationSettingRequest {}
export const GetDefaultApplicationSettingRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2021-01-01/opensearch/defaultApplicationSetting",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDefaultApplicationSettingRequest",
}) as any as S.Schema<GetDefaultApplicationSettingRequest>;
export type DirectQueryOpenSearchARNList = string[];
export const DirectQueryOpenSearchARNList = S.Array(S.String);
export type PackageIDList = string[];
export const PackageIDList = S.Array(S.String);
export type AWSServicePrincipal = "application.opensearchservice.amazonaws.com";
export const AWSServicePrincipal = S.Literal(
  "application.opensearchservice.amazonaws.com",
);
export type IPAddressType = "ipv4" | "dualstack";
export const IPAddressType = S.Literal("ipv4", "dualstack");
export type ConnectionMode = "DIRECT" | "VPC_ENDPOINT";
export const ConnectionMode = S.Literal("DIRECT", "VPC_ENDPOINT");
export type PackageType =
  | "TXT-DICTIONARY"
  | "ZIP-PLUGIN"
  | "PACKAGE-LICENSE"
  | "PACKAGE-CONFIG";
export const PackageType = S.Literal(
  "TXT-DICTIONARY",
  "ZIP-PLUGIN",
  "PACKAGE-LICENSE",
  "PACKAGE-CONFIG",
);
export type DomainNameList = string[];
export const DomainNameList = S.Array(S.String);
export type OpenSearchPartitionInstanceType =
  | "m3.medium.search"
  | "m3.large.search"
  | "m3.xlarge.search"
  | "m3.2xlarge.search"
  | "m4.large.search"
  | "m4.xlarge.search"
  | "m4.2xlarge.search"
  | "m4.4xlarge.search"
  | "m4.10xlarge.search"
  | "m5.large.search"
  | "m5.xlarge.search"
  | "m5.2xlarge.search"
  | "m5.4xlarge.search"
  | "m5.12xlarge.search"
  | "m5.24xlarge.search"
  | "r5.large.search"
  | "r5.xlarge.search"
  | "r5.2xlarge.search"
  | "r5.4xlarge.search"
  | "r5.12xlarge.search"
  | "r5.24xlarge.search"
  | "c5.large.search"
  | "c5.xlarge.search"
  | "c5.2xlarge.search"
  | "c5.4xlarge.search"
  | "c5.9xlarge.search"
  | "c5.18xlarge.search"
  | "t3.nano.search"
  | "t3.micro.search"
  | "t3.small.search"
  | "t3.medium.search"
  | "t3.large.search"
  | "t3.xlarge.search"
  | "t3.2xlarge.search"
  | "or1.medium.search"
  | "or1.large.search"
  | "or1.xlarge.search"
  | "or1.2xlarge.search"
  | "or1.4xlarge.search"
  | "or1.8xlarge.search"
  | "or1.12xlarge.search"
  | "or1.16xlarge.search"
  | "ultrawarm1.medium.search"
  | "ultrawarm1.large.search"
  | "ultrawarm1.xlarge.search"
  | "t2.micro.search"
  | "t2.small.search"
  | "t2.medium.search"
  | "r3.large.search"
  | "r3.xlarge.search"
  | "r3.2xlarge.search"
  | "r3.4xlarge.search"
  | "r3.8xlarge.search"
  | "i2.xlarge.search"
  | "i2.2xlarge.search"
  | "d2.xlarge.search"
  | "d2.2xlarge.search"
  | "d2.4xlarge.search"
  | "d2.8xlarge.search"
  | "c4.large.search"
  | "c4.xlarge.search"
  | "c4.2xlarge.search"
  | "c4.4xlarge.search"
  | "c4.8xlarge.search"
  | "r4.large.search"
  | "r4.xlarge.search"
  | "r4.2xlarge.search"
  | "r4.4xlarge.search"
  | "r4.8xlarge.search"
  | "r4.16xlarge.search"
  | "i3.large.search"
  | "i3.xlarge.search"
  | "i3.2xlarge.search"
  | "i3.4xlarge.search"
  | "i3.8xlarge.search"
  | "i3.16xlarge.search"
  | "r6g.large.search"
  | "r6g.xlarge.search"
  | "r6g.2xlarge.search"
  | "r6g.4xlarge.search"
  | "r6g.8xlarge.search"
  | "r6g.12xlarge.search"
  | "m6g.large.search"
  | "m6g.xlarge.search"
  | "m6g.2xlarge.search"
  | "m6g.4xlarge.search"
  | "m6g.8xlarge.search"
  | "m6g.12xlarge.search"
  | "c6g.large.search"
  | "c6g.xlarge.search"
  | "c6g.2xlarge.search"
  | "c6g.4xlarge.search"
  | "c6g.8xlarge.search"
  | "c6g.12xlarge.search"
  | "r6gd.large.search"
  | "r6gd.xlarge.search"
  | "r6gd.2xlarge.search"
  | "r6gd.4xlarge.search"
  | "r6gd.8xlarge.search"
  | "r6gd.12xlarge.search"
  | "r6gd.16xlarge.search"
  | "t4g.small.search"
  | "t4g.medium.search";
export const OpenSearchPartitionInstanceType = S.Literal(
  "m3.medium.search",
  "m3.large.search",
  "m3.xlarge.search",
  "m3.2xlarge.search",
  "m4.large.search",
  "m4.xlarge.search",
  "m4.2xlarge.search",
  "m4.4xlarge.search",
  "m4.10xlarge.search",
  "m5.large.search",
  "m5.xlarge.search",
  "m5.2xlarge.search",
  "m5.4xlarge.search",
  "m5.12xlarge.search",
  "m5.24xlarge.search",
  "r5.large.search",
  "r5.xlarge.search",
  "r5.2xlarge.search",
  "r5.4xlarge.search",
  "r5.12xlarge.search",
  "r5.24xlarge.search",
  "c5.large.search",
  "c5.xlarge.search",
  "c5.2xlarge.search",
  "c5.4xlarge.search",
  "c5.9xlarge.search",
  "c5.18xlarge.search",
  "t3.nano.search",
  "t3.micro.search",
  "t3.small.search",
  "t3.medium.search",
  "t3.large.search",
  "t3.xlarge.search",
  "t3.2xlarge.search",
  "or1.medium.search",
  "or1.large.search",
  "or1.xlarge.search",
  "or1.2xlarge.search",
  "or1.4xlarge.search",
  "or1.8xlarge.search",
  "or1.12xlarge.search",
  "or1.16xlarge.search",
  "ultrawarm1.medium.search",
  "ultrawarm1.large.search",
  "ultrawarm1.xlarge.search",
  "t2.micro.search",
  "t2.small.search",
  "t2.medium.search",
  "r3.large.search",
  "r3.xlarge.search",
  "r3.2xlarge.search",
  "r3.4xlarge.search",
  "r3.8xlarge.search",
  "i2.xlarge.search",
  "i2.2xlarge.search",
  "d2.xlarge.search",
  "d2.2xlarge.search",
  "d2.4xlarge.search",
  "d2.8xlarge.search",
  "c4.large.search",
  "c4.xlarge.search",
  "c4.2xlarge.search",
  "c4.4xlarge.search",
  "c4.8xlarge.search",
  "r4.large.search",
  "r4.xlarge.search",
  "r4.2xlarge.search",
  "r4.4xlarge.search",
  "r4.8xlarge.search",
  "r4.16xlarge.search",
  "i3.large.search",
  "i3.xlarge.search",
  "i3.2xlarge.search",
  "i3.4xlarge.search",
  "i3.8xlarge.search",
  "i3.16xlarge.search",
  "r6g.large.search",
  "r6g.xlarge.search",
  "r6g.2xlarge.search",
  "r6g.4xlarge.search",
  "r6g.8xlarge.search",
  "r6g.12xlarge.search",
  "m6g.large.search",
  "m6g.xlarge.search",
  "m6g.2xlarge.search",
  "m6g.4xlarge.search",
  "m6g.8xlarge.search",
  "m6g.12xlarge.search",
  "c6g.large.search",
  "c6g.xlarge.search",
  "c6g.2xlarge.search",
  "c6g.4xlarge.search",
  "c6g.8xlarge.search",
  "c6g.12xlarge.search",
  "r6gd.large.search",
  "r6gd.xlarge.search",
  "r6gd.2xlarge.search",
  "r6gd.4xlarge.search",
  "r6gd.8xlarge.search",
  "r6gd.12xlarge.search",
  "r6gd.16xlarge.search",
  "t4g.small.search",
  "t4g.medium.search",
);
export type VpcEndpointIdList = string[];
export const VpcEndpointIdList = S.Array(S.String);
export type ApplicationStatus =
  | "CREATING"
  | "UPDATING"
  | "DELETING"
  | "ACTIVE"
  | "FAILED";
export const ApplicationStatus = S.Literal(
  "CREATING",
  "UPDATING",
  "DELETING",
  "ACTIVE",
  "FAILED",
);
export type ApplicationStatuses = ApplicationStatus[];
export const ApplicationStatuses = S.Array(ApplicationStatus);
export type MaintenanceType =
  | "REBOOT_NODE"
  | "RESTART_SEARCH_PROCESS"
  | "RESTART_DASHBOARD";
export const MaintenanceType = S.Literal(
  "REBOOT_NODE",
  "RESTART_SEARCH_PROCESS",
  "RESTART_DASHBOARD",
);
export type MaintenanceStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED"
  | "TIMED_OUT";
export const MaintenanceStatus = S.Literal(
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "FAILED",
  "TIMED_OUT",
);
export type EngineType = "OpenSearch" | "Elasticsearch";
export const EngineType = S.Literal("OpenSearch", "Elasticsearch");
export type StringList = string[];
export const StringList = S.Array(S.String);
export type ScheduleAt = "NOW" | "TIMESTAMP" | "OFF_PEAK_WINDOW";
export const ScheduleAt = S.Literal("NOW", "TIMESTAMP", "OFF_PEAK_WINDOW");
export type DataSourceStatus = "ACTIVE" | "DISABLED";
export const DataSourceStatus = S.Literal("ACTIVE", "DISABLED");
export type DryRunMode = "Basic" | "Verbose";
export const DryRunMode = S.Literal("Basic", "Verbose");
export type PackageScopeOperationEnum = "ADD" | "OVERRIDE" | "REMOVE";
export const PackageScopeOperationEnum = S.Literal("ADD", "OVERRIDE", "REMOVE");
export type PackageUserList = string[];
export const PackageUserList = S.Array(S.String);
export type ActionType =
  | "SERVICE_SOFTWARE_UPDATE"
  | "JVM_HEAP_SIZE_TUNING"
  | "JVM_YOUNG_GEN_TUNING";
export const ActionType = S.Literal(
  "SERVICE_SOFTWARE_UPDATE",
  "JVM_HEAP_SIZE_TUNING",
  "JVM_YOUNG_GEN_TUNING",
);
export interface AcceptInboundConnectionRequest {
  ConnectionId: string;
}
export const AcceptInboundConnectionRequest = S.suspend(() =>
  S.Struct({ ConnectionId: S.String.pipe(T.HttpLabel("ConnectionId")) }).pipe(
    T.all(
      ns,
      T.Http({
        method: "PUT",
        uri: "/2021-01-01/opensearch/cc/inboundConnection/{ConnectionId}/accept",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AcceptInboundConnectionRequest",
}) as any as S.Schema<AcceptInboundConnectionRequest>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface AddTagsRequest {
  ARN: string;
  TagList: Tag[];
}
export const AddTagsRequest = S.suspend(() =>
  S.Struct({ ARN: S.String, TagList: TagList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2021-01-01/tags" }),
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
export interface AuthorizeVpcEndpointAccessRequest {
  DomainName: string;
  Account?: string;
  Service?: AWSServicePrincipal;
}
export const AuthorizeVpcEndpointAccessRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Account: S.optional(S.String),
    Service: S.optional(AWSServicePrincipal),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2021-01-01/opensearch/domain/{DomainName}/authorizeVpcEndpointAccess",
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
        uri: "/2021-01-01/opensearch/domain/{DomainName}/config/cancel",
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
export interface CancelServiceSoftwareUpdateRequest {
  DomainName: string;
}
export const CancelServiceSoftwareUpdateRequest = S.suspend(() =>
  S.Struct({ DomainName: S.String }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2021-01-01/opensearch/serviceSoftwareUpdate/cancel",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelServiceSoftwareUpdateRequest",
}) as any as S.Schema<CancelServiceSoftwareUpdateRequest>;
export interface CreateIndexRequest {
  DomainName: string;
  IndexName: string;
  IndexSchema: any;
}
export const CreateIndexRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    IndexName: S.String,
    IndexSchema: S.Any,
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2021-01-01/opensearch/domain/{DomainName}/index",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateIndexRequest",
}) as any as S.Schema<CreateIndexRequest>;
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
      T.Http({ method: "POST", uri: "/2021-01-01/opensearch/vpcEndpoints" }),
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
export interface DeleteApplicationRequest {
  id: string;
}
export const DeleteApplicationRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/2021-01-01/opensearch/application/{id}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteApplicationRequest",
}) as any as S.Schema<DeleteApplicationRequest>;
export interface DeleteApplicationResponse {}
export const DeleteApplicationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteApplicationResponse",
}) as any as S.Schema<DeleteApplicationResponse>;
export interface DeleteDataSourceRequest {
  DomainName: string;
  Name: string;
}
export const DeleteDataSourceRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Name: S.String.pipe(T.HttpLabel("Name")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/2021-01-01/opensearch/domain/{DomainName}/dataSource/{Name}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDataSourceRequest",
}) as any as S.Schema<DeleteDataSourceRequest>;
export interface DeleteDirectQueryDataSourceRequest {
  DataSourceName: string;
}
export const DeleteDirectQueryDataSourceRequest = S.suspend(() =>
  S.Struct({
    DataSourceName: S.String.pipe(T.HttpLabel("DataSourceName")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/2021-01-01/opensearch/directQueryDataSource/{DataSourceName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDirectQueryDataSourceRequest",
}) as any as S.Schema<DeleteDirectQueryDataSourceRequest>;
export interface DeleteDirectQueryDataSourceResponse {}
export const DeleteDirectQueryDataSourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteDirectQueryDataSourceResponse",
}) as any as S.Schema<DeleteDirectQueryDataSourceResponse>;
export interface DeleteDomainRequest {
  DomainName: string;
}
export const DeleteDomainRequest = S.suspend(() =>
  S.Struct({ DomainName: S.String.pipe(T.HttpLabel("DomainName")) }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/2021-01-01/opensearch/domain/{DomainName}",
      }),
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
export interface DeleteInboundConnectionRequest {
  ConnectionId: string;
}
export const DeleteInboundConnectionRequest = S.suspend(() =>
  S.Struct({ ConnectionId: S.String.pipe(T.HttpLabel("ConnectionId")) }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/2021-01-01/opensearch/cc/inboundConnection/{ConnectionId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteInboundConnectionRequest",
}) as any as S.Schema<DeleteInboundConnectionRequest>;
export interface DeleteIndexRequest {
  DomainName: string;
  IndexName: string;
}
export const DeleteIndexRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    IndexName: S.String.pipe(T.HttpLabel("IndexName")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/2021-01-01/opensearch/domain/{DomainName}/index/{IndexName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteIndexRequest",
}) as any as S.Schema<DeleteIndexRequest>;
export interface DeleteOutboundConnectionRequest {
  ConnectionId: string;
}
export const DeleteOutboundConnectionRequest = S.suspend(() =>
  S.Struct({ ConnectionId: S.String.pipe(T.HttpLabel("ConnectionId")) }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/2021-01-01/opensearch/cc/outboundConnection/{ConnectionId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteOutboundConnectionRequest",
}) as any as S.Schema<DeleteOutboundConnectionRequest>;
export interface DeletePackageRequest {
  PackageID: string;
}
export const DeletePackageRequest = S.suspend(() =>
  S.Struct({ PackageID: S.String.pipe(T.HttpLabel("PackageID")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/2021-01-01/packages/{PackageID}" }),
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
        uri: "/2021-01-01/opensearch/vpcEndpoints/{VpcEndpointId}",
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
export interface DescribeDomainRequest {
  DomainName: string;
}
export const DescribeDomainRequest = S.suspend(() =>
  S.Struct({ DomainName: S.String.pipe(T.HttpLabel("DomainName")) }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2021-01-01/opensearch/domain/{DomainName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDomainRequest",
}) as any as S.Schema<DescribeDomainRequest>;
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
        uri: "/2021-01-01/opensearch/domain/{DomainName}/autoTunes",
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
        uri: "/2021-01-01/opensearch/domain/{DomainName}/progress",
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
export interface DescribeDomainConfigRequest {
  DomainName: string;
}
export const DescribeDomainConfigRequest = S.suspend(() =>
  S.Struct({ DomainName: S.String.pipe(T.HttpLabel("DomainName")) }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2021-01-01/opensearch/domain/{DomainName}/config",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDomainConfigRequest",
}) as any as S.Schema<DescribeDomainConfigRequest>;
export interface DescribeDomainHealthRequest {
  DomainName: string;
}
export const DescribeDomainHealthRequest = S.suspend(() =>
  S.Struct({ DomainName: S.String.pipe(T.HttpLabel("DomainName")) }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2021-01-01/opensearch/domain/{DomainName}/health",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDomainHealthRequest",
}) as any as S.Schema<DescribeDomainHealthRequest>;
export interface DescribeDomainNodesRequest {
  DomainName: string;
}
export const DescribeDomainNodesRequest = S.suspend(() =>
  S.Struct({ DomainName: S.String.pipe(T.HttpLabel("DomainName")) }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2021-01-01/opensearch/domain/{DomainName}/nodes",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDomainNodesRequest",
}) as any as S.Schema<DescribeDomainNodesRequest>;
export interface DescribeDomainsRequest {
  DomainNames: string[];
}
export const DescribeDomainsRequest = S.suspend(() =>
  S.Struct({ DomainNames: DomainNameList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2021-01-01/opensearch/domain-info" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDomainsRequest",
}) as any as S.Schema<DescribeDomainsRequest>;
export interface DescribeDryRunProgressRequest {
  DomainName: string;
  DryRunId?: string;
  LoadDryRunConfig?: boolean;
}
export const DescribeDryRunProgressRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    DryRunId: S.optional(S.String).pipe(T.HttpQuery("dryRunId")),
    LoadDryRunConfig: S.optional(S.Boolean).pipe(
      T.HttpQuery("loadDryRunConfig"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2021-01-01/opensearch/domain/{DomainName}/dryRun",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDryRunProgressRequest",
}) as any as S.Schema<DescribeDryRunProgressRequest>;
export interface DescribeInstanceTypeLimitsRequest {
  DomainName?: string;
  InstanceType: OpenSearchPartitionInstanceType;
  EngineVersion: string;
}
export const DescribeInstanceTypeLimitsRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.optional(S.String).pipe(T.HttpQuery("domainName")),
    InstanceType: OpenSearchPartitionInstanceType.pipe(
      T.HttpLabel("InstanceType"),
    ),
    EngineVersion: S.String.pipe(T.HttpLabel("EngineVersion")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2021-01-01/opensearch/instanceTypeLimits/{EngineVersion}/{InstanceType}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeInstanceTypeLimitsRequest",
}) as any as S.Schema<DescribeInstanceTypeLimitsRequest>;
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
export interface DescribeOutboundConnectionsRequest {
  Filters?: Filter[];
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeOutboundConnectionsRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(FilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2021-01-01/opensearch/cc/outboundConnection/search",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeOutboundConnectionsRequest",
}) as any as S.Schema<DescribeOutboundConnectionsRequest>;
export interface DescribeReservedInstanceOfferingsRequest {
  ReservedInstanceOfferingId?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeReservedInstanceOfferingsRequest = S.suspend(() =>
  S.Struct({
    ReservedInstanceOfferingId: S.optional(S.String).pipe(
      T.HttpQuery("offeringId"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2021-01-01/opensearch/reservedInstanceOfferings",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeReservedInstanceOfferingsRequest",
}) as any as S.Schema<DescribeReservedInstanceOfferingsRequest>;
export interface DescribeReservedInstancesRequest {
  ReservedInstanceId?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeReservedInstancesRequest = S.suspend(() =>
  S.Struct({
    ReservedInstanceId: S.optional(S.String).pipe(T.HttpQuery("reservationId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2021-01-01/opensearch/reservedInstances",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeReservedInstancesRequest",
}) as any as S.Schema<DescribeReservedInstancesRequest>;
export interface DescribeVpcEndpointsRequest {
  VpcEndpointIds: string[];
}
export const DescribeVpcEndpointsRequest = S.suspend(() =>
  S.Struct({ VpcEndpointIds: VpcEndpointIdList }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2021-01-01/opensearch/vpcEndpoints/describe",
      }),
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
        uri: "/2021-01-01/packages/dissociate/{PackageID}/{DomainName}",
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
export interface DissociatePackagesRequest {
  PackageList: string[];
  DomainName: string;
}
export const DissociatePackagesRequest = S.suspend(() =>
  S.Struct({ PackageList: PackageIDList, DomainName: S.String }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2021-01-01/packages/dissociateMultiple",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DissociatePackagesRequest",
}) as any as S.Schema<DissociatePackagesRequest>;
export interface GetApplicationRequest {
  id: string;
}
export const GetApplicationRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2021-01-01/opensearch/application/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetApplicationRequest",
}) as any as S.Schema<GetApplicationRequest>;
export interface GetCompatibleVersionsRequest {
  DomainName?: string;
}
export const GetCompatibleVersionsRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.optional(S.String).pipe(T.HttpQuery("domainName")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2021-01-01/opensearch/compatibleVersions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCompatibleVersionsRequest",
}) as any as S.Schema<GetCompatibleVersionsRequest>;
export interface GetDataSourceRequest {
  DomainName: string;
  Name: string;
}
export const GetDataSourceRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Name: S.String.pipe(T.HttpLabel("Name")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2021-01-01/opensearch/domain/{DomainName}/dataSource/{Name}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDataSourceRequest",
}) as any as S.Schema<GetDataSourceRequest>;
export interface GetDefaultApplicationSettingResponse {
  applicationArn?: string;
}
export const GetDefaultApplicationSettingResponse = S.suspend(() =>
  S.Struct({ applicationArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "GetDefaultApplicationSettingResponse",
}) as any as S.Schema<GetDefaultApplicationSettingResponse>;
export interface GetDirectQueryDataSourceRequest {
  DataSourceName: string;
}
export const GetDirectQueryDataSourceRequest = S.suspend(() =>
  S.Struct({
    DataSourceName: S.String.pipe(T.HttpLabel("DataSourceName")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2021-01-01/opensearch/directQueryDataSource/{DataSourceName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDirectQueryDataSourceRequest",
}) as any as S.Schema<GetDirectQueryDataSourceRequest>;
export interface GetDomainMaintenanceStatusRequest {
  DomainName: string;
  MaintenanceId: string;
}
export const GetDomainMaintenanceStatusRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    MaintenanceId: S.String.pipe(T.HttpQuery("maintenanceId")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2021-01-01/opensearch/domain/{DomainName}/domainMaintenance",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDomainMaintenanceStatusRequest",
}) as any as S.Schema<GetDomainMaintenanceStatusRequest>;
export interface GetIndexRequest {
  DomainName: string;
  IndexName: string;
}
export const GetIndexRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    IndexName: S.String.pipe(T.HttpLabel("IndexName")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2021-01-01/opensearch/domain/{DomainName}/index/{IndexName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIndexRequest",
}) as any as S.Schema<GetIndexRequest>;
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
        uri: "/2021-01-01/packages/{PackageID}/history",
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
        uri: "/2021-01-01/opensearch/upgradeDomain/{DomainName}/history",
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
        uri: "/2021-01-01/opensearch/upgradeDomain/{DomainName}/status",
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
export interface ListApplicationsRequest {
  nextToken?: string;
  statuses?: ApplicationStatus[];
  maxResults?: number;
}
export const ListApplicationsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    statuses: S.optional(ApplicationStatuses).pipe(T.HttpQuery("statuses")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2021-01-01/opensearch/list-applications",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListApplicationsRequest",
}) as any as S.Schema<ListApplicationsRequest>;
export interface ListDataSourcesRequest {
  DomainName: string;
}
export const ListDataSourcesRequest = S.suspend(() =>
  S.Struct({ DomainName: S.String.pipe(T.HttpLabel("DomainName")) }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2021-01-01/opensearch/domain/{DomainName}/dataSource",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDataSourcesRequest",
}) as any as S.Schema<ListDataSourcesRequest>;
export interface ListDirectQueryDataSourcesRequest {
  NextToken?: string;
}
export const ListDirectQueryDataSourcesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nexttoken")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2021-01-01/opensearch/directQueryDataSource",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDirectQueryDataSourcesRequest",
}) as any as S.Schema<ListDirectQueryDataSourcesRequest>;
export interface ListDomainMaintenancesRequest {
  DomainName: string;
  Action?: MaintenanceType;
  Status?: MaintenanceStatus;
  MaxResults?: number;
  NextToken?: string;
}
export const ListDomainMaintenancesRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Action: S.optional(MaintenanceType).pipe(T.HttpQuery("action")),
    Status: S.optional(MaintenanceStatus).pipe(T.HttpQuery("status")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2021-01-01/opensearch/domain/{DomainName}/domainMaintenances",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDomainMaintenancesRequest",
}) as any as S.Schema<ListDomainMaintenancesRequest>;
export interface ListDomainNamesRequest {
  EngineType?: EngineType;
}
export const ListDomainNamesRequest = S.suspend(() =>
  S.Struct({
    EngineType: S.optional(EngineType).pipe(T.HttpQuery("engineType")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2021-01-01/domain" }),
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
        uri: "/2021-01-01/packages/{PackageID}/domains",
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
export interface ListInstanceTypeDetailsRequest {
  EngineVersion: string;
  DomainName?: string;
  MaxResults?: number;
  NextToken?: string;
  RetrieveAZs?: boolean;
  InstanceType?: string;
}
export const ListInstanceTypeDetailsRequest = S.suspend(() =>
  S.Struct({
    EngineVersion: S.String.pipe(T.HttpLabel("EngineVersion")),
    DomainName: S.optional(S.String).pipe(T.HttpQuery("domainName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    RetrieveAZs: S.optional(S.Boolean).pipe(T.HttpQuery("retrieveAZs")),
    InstanceType: S.optional(S.String).pipe(T.HttpQuery("instanceType")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2021-01-01/opensearch/instanceTypeDetails/{EngineVersion}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListInstanceTypeDetailsRequest",
}) as any as S.Schema<ListInstanceTypeDetailsRequest>;
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
        uri: "/2021-01-01/domain/{DomainName}/packages",
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
export interface ListScheduledActionsRequest {
  DomainName: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListScheduledActionsRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2021-01-01/opensearch/domain/{DomainName}/scheduledActions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListScheduledActionsRequest",
}) as any as S.Schema<ListScheduledActionsRequest>;
export interface ListTagsRequest {
  ARN: string;
}
export const ListTagsRequest = S.suspend(() =>
  S.Struct({ ARN: S.String.pipe(T.HttpQuery("arn")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2021-01-01/tags" }),
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
export interface ListVersionsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListVersionsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2021-01-01/opensearch/versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVersionsRequest",
}) as any as S.Schema<ListVersionsRequest>;
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
        uri: "/2021-01-01/opensearch/domain/{DomainName}/listVpcEndpointAccess",
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
      T.Http({ method: "GET", uri: "/2021-01-01/opensearch/vpcEndpoints" }),
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
        uri: "/2021-01-01/opensearch/domain/{DomainName}/vpcEndpoints",
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
export interface PurchaseReservedInstanceOfferingRequest {
  ReservedInstanceOfferingId: string;
  ReservationName: string;
  InstanceCount?: number;
}
export const PurchaseReservedInstanceOfferingRequest = S.suspend(() =>
  S.Struct({
    ReservedInstanceOfferingId: S.String,
    ReservationName: S.String,
    InstanceCount: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2021-01-01/opensearch/purchaseReservedInstanceOffering",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PurchaseReservedInstanceOfferingRequest",
}) as any as S.Schema<PurchaseReservedInstanceOfferingRequest>;
export interface PutDefaultApplicationSettingRequest {
  applicationArn: string;
  setAsDefault: boolean;
}
export const PutDefaultApplicationSettingRequest = S.suspend(() =>
  S.Struct({ applicationArn: S.String, setAsDefault: S.Boolean }).pipe(
    T.all(
      ns,
      T.Http({
        method: "PUT",
        uri: "/2021-01-01/opensearch/defaultApplicationSetting",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutDefaultApplicationSettingRequest",
}) as any as S.Schema<PutDefaultApplicationSettingRequest>;
export interface RejectInboundConnectionRequest {
  ConnectionId: string;
}
export const RejectInboundConnectionRequest = S.suspend(() =>
  S.Struct({ ConnectionId: S.String.pipe(T.HttpLabel("ConnectionId")) }).pipe(
    T.all(
      ns,
      T.Http({
        method: "PUT",
        uri: "/2021-01-01/opensearch/cc/inboundConnection/{ConnectionId}/reject",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RejectInboundConnectionRequest",
}) as any as S.Schema<RejectInboundConnectionRequest>;
export interface RemoveTagsRequest {
  ARN: string;
  TagKeys: string[];
}
export const RemoveTagsRequest = S.suspend(() =>
  S.Struct({ ARN: S.String, TagKeys: StringList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2021-01-01/tags-removal" }),
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
  Account?: string;
  Service?: AWSServicePrincipal;
}
export const RevokeVpcEndpointAccessRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Account: S.optional(S.String),
    Service: S.optional(AWSServicePrincipal),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2021-01-01/opensearch/domain/{DomainName}/revokeVpcEndpointAccess",
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
export interface StartDomainMaintenanceRequest {
  DomainName: string;
  Action: MaintenanceType;
  NodeId?: string;
}
export const StartDomainMaintenanceRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Action: MaintenanceType,
    NodeId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2021-01-01/opensearch/domain/{DomainName}/domainMaintenance",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartDomainMaintenanceRequest",
}) as any as S.Schema<StartDomainMaintenanceRequest>;
export interface StartServiceSoftwareUpdateRequest {
  DomainName: string;
  ScheduleAt?: ScheduleAt;
  DesiredStartTime?: number;
}
export const StartServiceSoftwareUpdateRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String,
    ScheduleAt: S.optional(ScheduleAt),
    DesiredStartTime: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2021-01-01/opensearch/serviceSoftwareUpdate/start",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartServiceSoftwareUpdateRequest",
}) as any as S.Schema<StartServiceSoftwareUpdateRequest>;
export interface DataSource {
  dataSourceArn?: string;
  dataSourceDescription?: string;
}
export const DataSource = S.suspend(() =>
  S.Struct({
    dataSourceArn: S.optional(S.String),
    dataSourceDescription: S.optional(S.String),
  }),
).annotations({ identifier: "DataSource" }) as any as S.Schema<DataSource>;
export type DataSources = DataSource[];
export const DataSources = S.Array(DataSource);
export type AppConfigType =
  | "opensearchDashboards.dashboardAdmin.users"
  | "opensearchDashboards.dashboardAdmin.groups";
export const AppConfigType = S.Literal(
  "opensearchDashboards.dashboardAdmin.users",
  "opensearchDashboards.dashboardAdmin.groups",
);
export interface AppConfig {
  key?: AppConfigType;
  value?: string;
}
export const AppConfig = S.suspend(() =>
  S.Struct({ key: S.optional(AppConfigType), value: S.optional(S.String) }),
).annotations({ identifier: "AppConfig" }) as any as S.Schema<AppConfig>;
export type AppConfigs = AppConfig[];
export const AppConfigs = S.Array(AppConfig);
export interface UpdateApplicationRequest {
  id: string;
  dataSources?: DataSource[];
  appConfigs?: AppConfig[];
}
export const UpdateApplicationRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    dataSources: S.optional(DataSources),
    appConfigs: S.optional(AppConfigs),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/2021-01-01/opensearch/application/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateApplicationRequest",
}) as any as S.Schema<UpdateApplicationRequest>;
export interface S3GlueDataCatalog {
  RoleArn?: string;
}
export const S3GlueDataCatalog = S.suspend(() =>
  S.Struct({ RoleArn: S.optional(S.String) }),
).annotations({
  identifier: "S3GlueDataCatalog",
}) as any as S.Schema<S3GlueDataCatalog>;
export type DataSourceType = { S3GlueDataCatalog: S3GlueDataCatalog };
export const DataSourceType = S.Union(
  S.Struct({ S3GlueDataCatalog: S3GlueDataCatalog }),
);
export interface UpdateDataSourceRequest {
  DomainName: string;
  Name: string;
  DataSourceType: DataSourceType;
  Description?: string;
  Status?: DataSourceStatus;
}
export const UpdateDataSourceRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Name: S.String.pipe(T.HttpLabel("Name")),
    DataSourceType: DataSourceType,
    Description: S.optional(S.String),
    Status: S.optional(DataSourceStatus),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "PUT",
        uri: "/2021-01-01/opensearch/domain/{DomainName}/dataSource/{Name}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDataSourceRequest",
}) as any as S.Schema<UpdateDataSourceRequest>;
export interface CloudWatchDirectQueryDataSource {
  RoleArn: string;
}
export const CloudWatchDirectQueryDataSource = S.suspend(() =>
  S.Struct({ RoleArn: S.String }),
).annotations({
  identifier: "CloudWatchDirectQueryDataSource",
}) as any as S.Schema<CloudWatchDirectQueryDataSource>;
export interface SecurityLakeDirectQueryDataSource {
  RoleArn: string;
}
export const SecurityLakeDirectQueryDataSource = S.suspend(() =>
  S.Struct({ RoleArn: S.String }),
).annotations({
  identifier: "SecurityLakeDirectQueryDataSource",
}) as any as S.Schema<SecurityLakeDirectQueryDataSource>;
export type DirectQueryDataSourceType =
  | { CloudWatchLog: CloudWatchDirectQueryDataSource }
  | { SecurityLake: SecurityLakeDirectQueryDataSource };
export const DirectQueryDataSourceType = S.Union(
  S.Struct({ CloudWatchLog: CloudWatchDirectQueryDataSource }),
  S.Struct({ SecurityLake: SecurityLakeDirectQueryDataSource }),
);
export interface UpdateDirectQueryDataSourceRequest {
  DataSourceName: string;
  DataSourceType: DirectQueryDataSourceType;
  Description?: string;
  OpenSearchArns: string[];
}
export const UpdateDirectQueryDataSourceRequest = S.suspend(() =>
  S.Struct({
    DataSourceName: S.String.pipe(T.HttpLabel("DataSourceName")),
    DataSourceType: DirectQueryDataSourceType,
    Description: S.optional(S.String),
    OpenSearchArns: DirectQueryOpenSearchARNList,
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "PUT",
        uri: "/2021-01-01/opensearch/directQueryDataSource/{DataSourceName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDirectQueryDataSourceRequest",
}) as any as S.Schema<UpdateDirectQueryDataSourceRequest>;
export interface UpdateIndexRequest {
  DomainName: string;
  IndexName: string;
  IndexSchema: any;
}
export const UpdateIndexRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    IndexName: S.String.pipe(T.HttpLabel("IndexName")),
    IndexSchema: S.Any,
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "PUT",
        uri: "/2021-01-01/opensearch/domain/{DomainName}/index/{IndexName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateIndexRequest",
}) as any as S.Schema<UpdateIndexRequest>;
export interface PackageSource {
  S3BucketName?: string;
  S3Key?: string;
}
export const PackageSource = S.suspend(() =>
  S.Struct({ S3BucketName: S.optional(S.String), S3Key: S.optional(S.String) }),
).annotations({
  identifier: "PackageSource",
}) as any as S.Schema<PackageSource>;
export type RequirementLevel = "REQUIRED" | "OPTIONAL" | "NONE";
export const RequirementLevel = S.Literal("REQUIRED", "OPTIONAL", "NONE");
export interface PackageConfiguration {
  LicenseRequirement: RequirementLevel;
  LicenseFilepath?: string;
  ConfigurationRequirement: RequirementLevel;
  RequiresRestartForConfigurationUpdate?: boolean;
}
export const PackageConfiguration = S.suspend(() =>
  S.Struct({
    LicenseRequirement: RequirementLevel,
    LicenseFilepath: S.optional(S.String),
    ConfigurationRequirement: RequirementLevel,
    RequiresRestartForConfigurationUpdate: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "PackageConfiguration",
}) as any as S.Schema<PackageConfiguration>;
export interface PackageEncryptionOptions {
  KmsKeyIdentifier?: string;
  EncryptionEnabled: boolean;
}
export const PackageEncryptionOptions = S.suspend(() =>
  S.Struct({
    KmsKeyIdentifier: S.optional(S.String),
    EncryptionEnabled: S.Boolean,
  }),
).annotations({
  identifier: "PackageEncryptionOptions",
}) as any as S.Schema<PackageEncryptionOptions>;
export interface UpdatePackageRequest {
  PackageID: string;
  PackageSource: PackageSource;
  PackageDescription?: string;
  CommitMessage?: string;
  PackageConfiguration?: PackageConfiguration;
  PackageEncryptionOptions?: PackageEncryptionOptions;
}
export const UpdatePackageRequest = S.suspend(() =>
  S.Struct({
    PackageID: S.String,
    PackageSource: PackageSource,
    PackageDescription: S.optional(S.String),
    CommitMessage: S.optional(S.String),
    PackageConfiguration: S.optional(PackageConfiguration),
    PackageEncryptionOptions: S.optional(PackageEncryptionOptions),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2021-01-01/packages/update" }),
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
export interface UpdatePackageScopeRequest {
  PackageID: string;
  Operation: PackageScopeOperationEnum;
  PackageUserList: string[];
}
export const UpdatePackageScopeRequest = S.suspend(() =>
  S.Struct({
    PackageID: S.String,
    Operation: PackageScopeOperationEnum,
    PackageUserList: PackageUserList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2021-01-01/packages/updateScope" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePackageScopeRequest",
}) as any as S.Schema<UpdatePackageScopeRequest>;
export interface UpdateScheduledActionRequest {
  DomainName: string;
  ActionID: string;
  ActionType: ActionType;
  ScheduleAt: ScheduleAt;
  DesiredStartTime?: number;
}
export const UpdateScheduledActionRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ActionID: S.String,
    ActionType: ActionType,
    ScheduleAt: ScheduleAt,
    DesiredStartTime: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "PUT",
        uri: "/2021-01-01/opensearch/domain/{DomainName}/scheduledAction/update",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateScheduledActionRequest",
}) as any as S.Schema<UpdateScheduledActionRequest>;
export interface UpdateVpcEndpointRequest {
  VpcEndpointId: string;
  VpcOptions: VPCOptions;
}
export const UpdateVpcEndpointRequest = S.suspend(() =>
  S.Struct({ VpcEndpointId: S.String, VpcOptions: VPCOptions }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2021-01-01/opensearch/vpcEndpoints/update",
      }),
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
export type AdvancedOptions = { [key: string]: string };
export const AdvancedOptions = S.Record({ key: S.String, value: S.String });
export interface UpgradeDomainRequest {
  DomainName: string;
  TargetVersion: string;
  PerformCheckOnly?: boolean;
  AdvancedOptions?: { [key: string]: string };
}
export const UpgradeDomainRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String,
    TargetVersion: S.String,
    PerformCheckOnly: S.optional(S.Boolean),
    AdvancedOptions: S.optional(AdvancedOptions),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2021-01-01/opensearch/upgradeDomain" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpgradeDomainRequest",
}) as any as S.Schema<UpgradeDomainRequest>;
export type OpenSearchWarmPartitionInstanceType =
  | "ultrawarm1.medium.search"
  | "ultrawarm1.large.search"
  | "ultrawarm1.xlarge.search";
export const OpenSearchWarmPartitionInstanceType = S.Literal(
  "ultrawarm1.medium.search",
  "ultrawarm1.large.search",
  "ultrawarm1.xlarge.search",
);
export type VolumeType = "standard" | "gp2" | "io1" | "gp3";
export const VolumeType = S.Literal("standard", "gp2", "io1", "gp3");
export type LogType =
  | "INDEX_SLOW_LOGS"
  | "SEARCH_SLOW_LOGS"
  | "ES_APPLICATION_LOGS"
  | "AUDIT_LOGS";
export const LogType = S.Literal(
  "INDEX_SLOW_LOGS",
  "SEARCH_SLOW_LOGS",
  "ES_APPLICATION_LOGS",
  "AUDIT_LOGS",
);
export type TLSSecurityPolicy =
  | "Policy-Min-TLS-1-0-2019-07"
  | "Policy-Min-TLS-1-2-2019-07"
  | "Policy-Min-TLS-1-2-PFS-2023-10";
export const TLSSecurityPolicy = S.Literal(
  "Policy-Min-TLS-1-0-2019-07",
  "Policy-Min-TLS-1-2-2019-07",
  "Policy-Min-TLS-1-2-PFS-2023-10",
);
export type SubjectKeyIdCOption = "UserName" | "UserId" | "Email";
export const SubjectKeyIdCOption = S.Literal("UserName", "UserId", "Email");
export type RolesKeyIdCOption = "GroupName" | "GroupId";
export const RolesKeyIdCOption = S.Literal("GroupName", "GroupId");
export type AutoTuneDesiredState = "ENABLED" | "DISABLED";
export const AutoTuneDesiredState = S.Literal("ENABLED", "DISABLED");
export type DescribePackagesFilterName =
  | "PackageID"
  | "PackageName"
  | "PackageStatus"
  | "PackageType"
  | "EngineVersion"
  | "PackageOwner";
export const DescribePackagesFilterName = S.Literal(
  "PackageID",
  "PackageName",
  "PackageStatus",
  "PackageType",
  "EngineVersion",
  "PackageOwner",
);
export type DescribePackagesFilterValues = string[];
export const DescribePackagesFilterValues = S.Array(S.String);
export type RollbackOnDisable = "NO_ROLLBACK" | "DEFAULT_ROLLBACK";
export const RollbackOnDisable = S.Literal("NO_ROLLBACK", "DEFAULT_ROLLBACK");
export interface KeyStoreAccessOption {
  KeyAccessRoleArn?: string;
  KeyStoreAccessEnabled: boolean;
}
export const KeyStoreAccessOption = S.suspend(() =>
  S.Struct({
    KeyAccessRoleArn: S.optional(S.String),
    KeyStoreAccessEnabled: S.Boolean,
  }),
).annotations({
  identifier: "KeyStoreAccessOption",
}) as any as S.Schema<KeyStoreAccessOption>;
export interface PackageAssociationConfiguration {
  KeyStoreAccessOption?: KeyStoreAccessOption;
}
export const PackageAssociationConfiguration = S.suspend(() =>
  S.Struct({ KeyStoreAccessOption: S.optional(KeyStoreAccessOption) }),
).annotations({
  identifier: "PackageAssociationConfiguration",
}) as any as S.Schema<PackageAssociationConfiguration>;
export interface PackageDetailsForAssociation {
  PackageID: string;
  PrerequisitePackageIDList?: string[];
  AssociationConfiguration?: PackageAssociationConfiguration;
}
export const PackageDetailsForAssociation = S.suspend(() =>
  S.Struct({
    PackageID: S.String,
    PrerequisitePackageIDList: S.optional(PackageIDList),
    AssociationConfiguration: S.optional(PackageAssociationConfiguration),
  }),
).annotations({
  identifier: "PackageDetailsForAssociation",
}) as any as S.Schema<PackageDetailsForAssociation>;
export type PackageDetailsForAssociationList = PackageDetailsForAssociation[];
export const PackageDetailsForAssociationList = S.Array(
  PackageDetailsForAssociation,
);
export type GUIDList = string[];
export const GUIDList = S.Array(S.String);
export interface IamIdentityCenterOptionsInput {
  enabled?: boolean;
  iamIdentityCenterInstanceArn?: string;
  iamRoleForIdentityCenterApplicationArn?: string;
}
export const IamIdentityCenterOptionsInput = S.suspend(() =>
  S.Struct({
    enabled: S.optional(S.Boolean),
    iamIdentityCenterInstanceArn: S.optional(S.String),
    iamRoleForIdentityCenterApplicationArn: S.optional(S.String),
  }),
).annotations({
  identifier: "IamIdentityCenterOptionsInput",
}) as any as S.Schema<IamIdentityCenterOptionsInput>;
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
export interface IdentityCenterOptionsInput {
  EnabledAPIAccess?: boolean;
  IdentityCenterInstanceARN?: string;
  SubjectKey?: SubjectKeyIdCOption;
  RolesKey?: RolesKeyIdCOption;
}
export const IdentityCenterOptionsInput = S.suspend(() =>
  S.Struct({
    EnabledAPIAccess: S.optional(S.Boolean),
    IdentityCenterInstanceARN: S.optional(S.String),
    SubjectKey: S.optional(SubjectKeyIdCOption),
    RolesKey: S.optional(RolesKeyIdCOption),
  }),
).annotations({
  identifier: "IdentityCenterOptionsInput",
}) as any as S.Schema<IdentityCenterOptionsInput>;
export interface SoftwareUpdateOptions {
  AutoSoftwareUpdateEnabled?: boolean;
}
export const SoftwareUpdateOptions = S.suspend(() =>
  S.Struct({ AutoSoftwareUpdateEnabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "SoftwareUpdateOptions",
}) as any as S.Schema<SoftwareUpdateOptions>;
export type IndexStatus = "CREATED" | "UPDATED" | "DELETED";
export const IndexStatus = S.Literal("CREATED", "UPDATED", "DELETED");
export interface PackageVendingOptions {
  VendingEnabled: boolean;
}
export const PackageVendingOptions = S.suspend(() =>
  S.Struct({ VendingEnabled: S.Boolean }),
).annotations({
  identifier: "PackageVendingOptions",
}) as any as S.Schema<PackageVendingOptions>;
export type DomainState = "Active" | "Processing" | "NotAvailable";
export const DomainState = S.Literal("Active", "Processing", "NotAvailable");
export type MasterNodeStatus = "Available" | "UnAvailable";
export const MasterNodeStatus = S.Literal("Available", "UnAvailable");
export type DomainHealth = "Red" | "Yellow" | "Green" | "NotAvailable";
export const DomainHealth = S.Literal("Red", "Yellow", "Green", "NotAvailable");
export type EndpointsMap = { [key: string]: string };
export const EndpointsMap = S.Record({ key: S.String, value: S.String });
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
export type NodeOptionsNodeType = "coordinator";
export const NodeOptionsNodeType = S.Literal("coordinator");
export interface NodeConfig {
  Enabled?: boolean;
  Type?: OpenSearchPartitionInstanceType;
  Count?: number;
}
export const NodeConfig = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    Type: S.optional(OpenSearchPartitionInstanceType),
    Count: S.optional(S.Number),
  }),
).annotations({ identifier: "NodeConfig" }) as any as S.Schema<NodeConfig>;
export interface NodeOption {
  NodeType?: NodeOptionsNodeType;
  NodeConfig?: NodeConfig;
}
export const NodeOption = S.suspend(() =>
  S.Struct({
    NodeType: S.optional(NodeOptionsNodeType),
    NodeConfig: S.optional(NodeConfig),
  }),
).annotations({ identifier: "NodeOption" }) as any as S.Schema<NodeOption>;
export type NodeOptionsList = NodeOption[];
export const NodeOptionsList = S.Array(NodeOption);
export interface ClusterConfig {
  InstanceType?: OpenSearchPartitionInstanceType;
  InstanceCount?: number;
  DedicatedMasterEnabled?: boolean;
  ZoneAwarenessEnabled?: boolean;
  ZoneAwarenessConfig?: ZoneAwarenessConfig;
  DedicatedMasterType?: OpenSearchPartitionInstanceType;
  DedicatedMasterCount?: number;
  WarmEnabled?: boolean;
  WarmType?: OpenSearchWarmPartitionInstanceType;
  WarmCount?: number;
  ColdStorageOptions?: ColdStorageOptions;
  MultiAZWithStandbyEnabled?: boolean;
  NodeOptions?: NodeOption[];
}
export const ClusterConfig = S.suspend(() =>
  S.Struct({
    InstanceType: S.optional(OpenSearchPartitionInstanceType),
    InstanceCount: S.optional(S.Number),
    DedicatedMasterEnabled: S.optional(S.Boolean),
    ZoneAwarenessEnabled: S.optional(S.Boolean),
    ZoneAwarenessConfig: S.optional(ZoneAwarenessConfig),
    DedicatedMasterType: S.optional(OpenSearchPartitionInstanceType),
    DedicatedMasterCount: S.optional(S.Number),
    WarmEnabled: S.optional(S.Boolean),
    WarmType: S.optional(OpenSearchWarmPartitionInstanceType),
    WarmCount: S.optional(S.Number),
    ColdStorageOptions: S.optional(ColdStorageOptions),
    MultiAZWithStandbyEnabled: S.optional(S.Boolean),
    NodeOptions: S.optional(NodeOptionsList),
  }),
).annotations({
  identifier: "ClusterConfig",
}) as any as S.Schema<ClusterConfig>;
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
  S.Record({ key: LogType, value: LogPublishingOption }),
);
export type DeploymentStatus =
  | "PENDING_UPDATE"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "NOT_ELIGIBLE"
  | "ELIGIBLE";
export const DeploymentStatus = S.Literal(
  "PENDING_UPDATE",
  "IN_PROGRESS",
  "COMPLETED",
  "NOT_ELIGIBLE",
  "ELIGIBLE",
);
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
export interface JWTOptionsOutput {
  Enabled?: boolean;
  SubjectKey?: string;
  RolesKey?: string;
  PublicKey?: string;
}
export const JWTOptionsOutput = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    SubjectKey: S.optional(S.String),
    RolesKey: S.optional(S.String),
    PublicKey: S.optional(S.String),
  }),
).annotations({
  identifier: "JWTOptionsOutput",
}) as any as S.Schema<JWTOptionsOutput>;
export interface IAMFederationOptionsOutput {
  Enabled?: boolean;
  SubjectKey?: string;
  RolesKey?: string;
}
export const IAMFederationOptionsOutput = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    SubjectKey: S.optional(S.String),
    RolesKey: S.optional(S.String),
  }),
).annotations({
  identifier: "IAMFederationOptionsOutput",
}) as any as S.Schema<IAMFederationOptionsOutput>;
export interface AdvancedSecurityOptions {
  Enabled?: boolean;
  InternalUserDatabaseEnabled?: boolean;
  SAMLOptions?: SAMLOptionsOutput;
  JWTOptions?: JWTOptionsOutput;
  IAMFederationOptions?: IAMFederationOptionsOutput;
  AnonymousAuthDisableDate?: Date;
  AnonymousAuthEnabled?: boolean;
}
export const AdvancedSecurityOptions = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    InternalUserDatabaseEnabled: S.optional(S.Boolean),
    SAMLOptions: S.optional(SAMLOptionsOutput),
    JWTOptions: S.optional(JWTOptionsOutput),
    IAMFederationOptions: S.optional(IAMFederationOptionsOutput),
    AnonymousAuthDisableDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AnonymousAuthEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AdvancedSecurityOptions",
}) as any as S.Schema<AdvancedSecurityOptions>;
export interface IdentityCenterOptions {
  EnabledAPIAccess?: boolean;
  IdentityCenterInstanceARN?: string;
  SubjectKey?: SubjectKeyIdCOption;
  RolesKey?: RolesKeyIdCOption;
  IdentityCenterApplicationARN?: string;
  IdentityStoreId?: string;
}
export const IdentityCenterOptions = S.suspend(() =>
  S.Struct({
    EnabledAPIAccess: S.optional(S.Boolean),
    IdentityCenterInstanceARN: S.optional(S.String),
    SubjectKey: S.optional(SubjectKeyIdCOption),
    RolesKey: S.optional(RolesKeyIdCOption),
    IdentityCenterApplicationARN: S.optional(S.String),
    IdentityStoreId: S.optional(S.String),
  }),
).annotations({
  identifier: "IdentityCenterOptions",
}) as any as S.Schema<IdentityCenterOptions>;
export type AutoTuneState =
  | "ENABLED"
  | "DISABLED"
  | "ENABLE_IN_PROGRESS"
  | "DISABLE_IN_PROGRESS"
  | "DISABLED_AND_ROLLBACK_SCHEDULED"
  | "DISABLED_AND_ROLLBACK_IN_PROGRESS"
  | "DISABLED_AND_ROLLBACK_COMPLETE"
  | "DISABLED_AND_ROLLBACK_ERROR"
  | "ERROR";
export const AutoTuneState = S.Literal(
  "ENABLED",
  "DISABLED",
  "ENABLE_IN_PROGRESS",
  "DISABLE_IN_PROGRESS",
  "DISABLED_AND_ROLLBACK_SCHEDULED",
  "DISABLED_AND_ROLLBACK_IN_PROGRESS",
  "DISABLED_AND_ROLLBACK_COMPLETE",
  "DISABLED_AND_ROLLBACK_ERROR",
  "ERROR",
);
export interface AutoTuneOptionsOutput {
  State?: AutoTuneState;
  ErrorMessage?: string;
  UseOffPeakWindow?: boolean;
}
export const AutoTuneOptionsOutput = S.suspend(() =>
  S.Struct({
    State: S.optional(AutoTuneState),
    ErrorMessage: S.optional(S.String),
    UseOffPeakWindow: S.optional(S.Boolean),
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
  | "Cancelled";
export const ConfigChangeStatus = S.Literal(
  "Pending",
  "Initializing",
  "Validating",
  "ValidationFailed",
  "ApplyingChanges",
  "Completed",
  "PendingUserInput",
  "Cancelled",
);
export type InitiatedBy = "CUSTOMER" | "SERVICE";
export const InitiatedBy = S.Literal("CUSTOMER", "SERVICE");
export interface ChangeProgressDetails {
  ChangeId?: string;
  Message?: string;
  ConfigChangeStatus?: ConfigChangeStatus;
  InitiatedBy?: InitiatedBy;
  StartTime?: Date;
  LastUpdatedTime?: Date;
}
export const ChangeProgressDetails = S.suspend(() =>
  S.Struct({
    ChangeId: S.optional(S.String),
    Message: S.optional(S.String),
    ConfigChangeStatus: S.optional(ConfigChangeStatus),
    InitiatedBy: S.optional(InitiatedBy),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ChangeProgressDetails",
}) as any as S.Schema<ChangeProgressDetails>;
export interface WindowStartTime {
  Hours: number;
  Minutes: number;
}
export const WindowStartTime = S.suspend(() =>
  S.Struct({ Hours: S.Number, Minutes: S.Number }),
).annotations({
  identifier: "WindowStartTime",
}) as any as S.Schema<WindowStartTime>;
export interface OffPeakWindow {
  WindowStartTime?: WindowStartTime;
}
export const OffPeakWindow = S.suspend(() =>
  S.Struct({ WindowStartTime: S.optional(WindowStartTime) }),
).annotations({
  identifier: "OffPeakWindow",
}) as any as S.Schema<OffPeakWindow>;
export interface OffPeakWindowOptions {
  Enabled?: boolean;
  OffPeakWindow?: OffPeakWindow;
}
export const OffPeakWindowOptions = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    OffPeakWindow: S.optional(OffPeakWindow),
  }),
).annotations({
  identifier: "OffPeakWindowOptions",
}) as any as S.Schema<OffPeakWindowOptions>;
export type DomainProcessingStatusType =
  | "Creating"
  | "Active"
  | "Modifying"
  | "UpgradingEngineVersion"
  | "UpdatingServiceSoftware"
  | "Isolated"
  | "Deleting";
export const DomainProcessingStatusType = S.Literal(
  "Creating",
  "Active",
  "Modifying",
  "UpgradingEngineVersion",
  "UpdatingServiceSoftware",
  "Isolated",
  "Deleting",
);
export type PropertyValueType = "PLAIN_TEXT" | "STRINGIFIED_JSON";
export const PropertyValueType = S.Literal("PLAIN_TEXT", "STRINGIFIED_JSON");
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
export type NaturalLanguageQueryGenerationDesiredState = "ENABLED" | "DISABLED";
export const NaturalLanguageQueryGenerationDesiredState = S.Literal(
  "ENABLED",
  "DISABLED",
);
export type NaturalLanguageQueryGenerationCurrentState =
  | "NOT_ENABLED"
  | "ENABLE_COMPLETE"
  | "ENABLE_IN_PROGRESS"
  | "ENABLE_FAILED"
  | "DISABLE_COMPLETE"
  | "DISABLE_IN_PROGRESS"
  | "DISABLE_FAILED";
export const NaturalLanguageQueryGenerationCurrentState = S.Literal(
  "NOT_ENABLED",
  "ENABLE_COMPLETE",
  "ENABLE_IN_PROGRESS",
  "ENABLE_FAILED",
  "DISABLE_COMPLETE",
  "DISABLE_IN_PROGRESS",
  "DISABLE_FAILED",
);
export interface NaturalLanguageQueryGenerationOptionsOutput {
  DesiredState?: NaturalLanguageQueryGenerationDesiredState;
  CurrentState?: NaturalLanguageQueryGenerationCurrentState;
}
export const NaturalLanguageQueryGenerationOptionsOutput = S.suspend(() =>
  S.Struct({
    DesiredState: S.optional(NaturalLanguageQueryGenerationDesiredState),
    CurrentState: S.optional(NaturalLanguageQueryGenerationCurrentState),
  }),
).annotations({
  identifier: "NaturalLanguageQueryGenerationOptionsOutput",
}) as any as S.Schema<NaturalLanguageQueryGenerationOptionsOutput>;
export interface S3VectorsEngine {
  Enabled?: boolean;
}
export const S3VectorsEngine = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "S3VectorsEngine",
}) as any as S.Schema<S3VectorsEngine>;
export interface ServerlessVectorAcceleration {
  Enabled?: boolean;
}
export const ServerlessVectorAcceleration = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "ServerlessVectorAcceleration",
}) as any as S.Schema<ServerlessVectorAcceleration>;
export interface AIMLOptionsOutput {
  NaturalLanguageQueryGenerationOptions?: NaturalLanguageQueryGenerationOptionsOutput;
  S3VectorsEngine?: S3VectorsEngine;
  ServerlessVectorAcceleration?: ServerlessVectorAcceleration;
}
export const AIMLOptionsOutput = S.suspend(() =>
  S.Struct({
    NaturalLanguageQueryGenerationOptions: S.optional(
      NaturalLanguageQueryGenerationOptionsOutput,
    ),
    S3VectorsEngine: S.optional(S3VectorsEngine),
    ServerlessVectorAcceleration: S.optional(ServerlessVectorAcceleration),
  }),
).annotations({
  identifier: "AIMLOptionsOutput",
}) as any as S.Schema<AIMLOptionsOutput>;
export interface DomainStatus {
  DomainId: string;
  DomainName: string;
  ARN: string;
  Created?: boolean;
  Deleted?: boolean;
  Endpoint?: string;
  EndpointV2?: string;
  Endpoints?: { [key: string]: string };
  DomainEndpointV2HostedZoneId?: string;
  Processing?: boolean;
  UpgradeProcessing?: boolean;
  EngineVersion?: string;
  ClusterConfig: ClusterConfig;
  EBSOptions?: EBSOptions;
  AccessPolicies?: string;
  IPAddressType?: IPAddressType;
  SnapshotOptions?: SnapshotOptions;
  VPCOptions?: VPCDerivedInfo;
  CognitoOptions?: CognitoOptions;
  EncryptionAtRestOptions?: EncryptionAtRestOptions;
  NodeToNodeEncryptionOptions?: NodeToNodeEncryptionOptions;
  AdvancedOptions?: { [key: string]: string };
  LogPublishingOptions?: { [key: string]: LogPublishingOption };
  ServiceSoftwareOptions?: ServiceSoftwareOptions;
  DomainEndpointOptions?: DomainEndpointOptions;
  AdvancedSecurityOptions?: AdvancedSecurityOptions;
  IdentityCenterOptions?: IdentityCenterOptions;
  AutoTuneOptions?: AutoTuneOptionsOutput;
  ChangeProgressDetails?: ChangeProgressDetails;
  OffPeakWindowOptions?: OffPeakWindowOptions;
  SoftwareUpdateOptions?: SoftwareUpdateOptions;
  DomainProcessingStatus?: DomainProcessingStatusType;
  ModifyingProperties?: ModifyingProperties[];
  AIMLOptions?: AIMLOptionsOutput;
}
export const DomainStatus = S.suspend(() =>
  S.Struct({
    DomainId: S.String,
    DomainName: S.String,
    ARN: S.String,
    Created: S.optional(S.Boolean),
    Deleted: S.optional(S.Boolean),
    Endpoint: S.optional(S.String),
    EndpointV2: S.optional(S.String),
    Endpoints: S.optional(EndpointsMap),
    DomainEndpointV2HostedZoneId: S.optional(S.String),
    Processing: S.optional(S.Boolean),
    UpgradeProcessing: S.optional(S.Boolean),
    EngineVersion: S.optional(S.String),
    ClusterConfig: ClusterConfig,
    EBSOptions: S.optional(EBSOptions),
    AccessPolicies: S.optional(S.String),
    IPAddressType: S.optional(IPAddressType),
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
    IdentityCenterOptions: S.optional(IdentityCenterOptions),
    AutoTuneOptions: S.optional(AutoTuneOptionsOutput),
    ChangeProgressDetails: S.optional(ChangeProgressDetails),
    OffPeakWindowOptions: S.optional(OffPeakWindowOptions),
    SoftwareUpdateOptions: S.optional(SoftwareUpdateOptions),
    DomainProcessingStatus: S.optional(DomainProcessingStatusType),
    ModifyingProperties: S.optional(ModifyingPropertiesList),
    AIMLOptions: S.optional(AIMLOptionsOutput),
  }),
).annotations({ identifier: "DomainStatus" }) as any as S.Schema<DomainStatus>;
export type DomainStatusList = DomainStatus[];
export const DomainStatusList = S.Array(DomainStatus);
export interface AWSDomainInformation {
  OwnerId?: string;
  DomainName: string;
  Region?: string;
}
export const AWSDomainInformation = S.suspend(() =>
  S.Struct({
    OwnerId: S.optional(S.String),
    DomainName: S.String,
    Region: S.optional(S.String),
  }),
).annotations({
  identifier: "AWSDomainInformation",
}) as any as S.Schema<AWSDomainInformation>;
export interface DomainInformationContainer {
  AWSDomainInformation?: AWSDomainInformation;
}
export const DomainInformationContainer = S.suspend(() =>
  S.Struct({ AWSDomainInformation: S.optional(AWSDomainInformation) }),
).annotations({
  identifier: "DomainInformationContainer",
}) as any as S.Schema<DomainInformationContainer>;
export type OutboundConnectionStatusCode =
  | "VALIDATING"
  | "VALIDATION_FAILED"
  | "PENDING_ACCEPTANCE"
  | "APPROVED"
  | "PROVISIONING"
  | "ACTIVE"
  | "REJECTING"
  | "REJECTED"
  | "DELETING"
  | "DELETED";
export const OutboundConnectionStatusCode = S.Literal(
  "VALIDATING",
  "VALIDATION_FAILED",
  "PENDING_ACCEPTANCE",
  "APPROVED",
  "PROVISIONING",
  "ACTIVE",
  "REJECTING",
  "REJECTED",
  "DELETING",
  "DELETED",
);
export interface OutboundConnectionStatus {
  StatusCode?: OutboundConnectionStatusCode;
  Message?: string;
}
export const OutboundConnectionStatus = S.suspend(() =>
  S.Struct({
    StatusCode: S.optional(OutboundConnectionStatusCode),
    Message: S.optional(S.String),
  }),
).annotations({
  identifier: "OutboundConnectionStatus",
}) as any as S.Schema<OutboundConnectionStatus>;
export type SkipUnavailableStatus = "ENABLED" | "DISABLED";
export const SkipUnavailableStatus = S.Literal("ENABLED", "DISABLED");
export interface CrossClusterSearchConnectionProperties {
  SkipUnavailable?: SkipUnavailableStatus;
}
export const CrossClusterSearchConnectionProperties = S.suspend(() =>
  S.Struct({ SkipUnavailable: S.optional(SkipUnavailableStatus) }),
).annotations({
  identifier: "CrossClusterSearchConnectionProperties",
}) as any as S.Schema<CrossClusterSearchConnectionProperties>;
export interface ConnectionProperties {
  Endpoint?: string;
  CrossClusterSearch?: CrossClusterSearchConnectionProperties;
}
export const ConnectionProperties = S.suspend(() =>
  S.Struct({
    Endpoint: S.optional(S.String),
    CrossClusterSearch: S.optional(CrossClusterSearchConnectionProperties),
  }),
).annotations({
  identifier: "ConnectionProperties",
}) as any as S.Schema<ConnectionProperties>;
export interface OutboundConnection {
  LocalDomainInfo?: DomainInformationContainer;
  RemoteDomainInfo?: DomainInformationContainer;
  ConnectionId?: string;
  ConnectionAlias?: string;
  ConnectionStatus?: OutboundConnectionStatus;
  ConnectionMode?: ConnectionMode;
  ConnectionProperties?: ConnectionProperties;
}
export const OutboundConnection = S.suspend(() =>
  S.Struct({
    LocalDomainInfo: S.optional(DomainInformationContainer),
    RemoteDomainInfo: S.optional(DomainInformationContainer),
    ConnectionId: S.optional(S.String),
    ConnectionAlias: S.optional(S.String),
    ConnectionStatus: S.optional(OutboundConnectionStatus),
    ConnectionMode: S.optional(ConnectionMode),
    ConnectionProperties: S.optional(ConnectionProperties),
  }),
).annotations({
  identifier: "OutboundConnection",
}) as any as S.Schema<OutboundConnection>;
export type OutboundConnections = OutboundConnection[];
export const OutboundConnections = S.Array(OutboundConnection);
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
  | "DELETE_FAILED";
export const VpcEndpointStatus = S.Literal(
  "CREATING",
  "CREATE_FAILED",
  "ACTIVE",
  "UPDATING",
  "UPDATE_FAILED",
  "DELETING",
  "DELETE_FAILED",
);
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
export type DomainPackageStatus =
  | "ASSOCIATING"
  | "ASSOCIATION_FAILED"
  | "ACTIVE"
  | "DISSOCIATING"
  | "DISSOCIATION_FAILED";
export const DomainPackageStatus = S.Literal(
  "ASSOCIATING",
  "ASSOCIATION_FAILED",
  "ACTIVE",
  "DISSOCIATING",
  "DISSOCIATION_FAILED",
);
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
  PrerequisitePackageIDList?: string[];
  ReferencePath?: string;
  ErrorDetails?: ErrorDetails;
  AssociationConfiguration?: PackageAssociationConfiguration;
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
    PrerequisitePackageIDList: S.optional(PackageIDList),
    ReferencePath: S.optional(S.String),
    ErrorDetails: S.optional(ErrorDetails),
    AssociationConfiguration: S.optional(PackageAssociationConfiguration),
  }),
).annotations({
  identifier: "DomainPackageDetails",
}) as any as S.Schema<DomainPackageDetails>;
export type DomainPackageDetailsList = DomainPackageDetails[];
export const DomainPackageDetailsList = S.Array(DomainPackageDetails);
export type UpgradeStep = "PRE_UPGRADE_CHECK" | "SNAPSHOT" | "UPGRADE";
export const UpgradeStep = S.Literal(
  "PRE_UPGRADE_CHECK",
  "SNAPSHOT",
  "UPGRADE",
);
export type UpgradeStatus =
  | "IN_PROGRESS"
  | "SUCCEEDED"
  | "SUCCEEDED_WITH_ISSUES"
  | "FAILED";
export const UpgradeStatus = S.Literal(
  "IN_PROGRESS",
  "SUCCEEDED",
  "SUCCEEDED_WITH_ISSUES",
  "FAILED",
);
export type VersionList = string[];
export const VersionList = S.Array(S.String);
export type PrincipalType = "AWS_ACCOUNT" | "AWS_SERVICE";
export const PrincipalType = S.Literal("AWS_ACCOUNT", "AWS_SERVICE");
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
export type TimeUnit = "HOURS";
export const TimeUnit = S.Literal("HOURS");
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
  UseOffPeakWindow?: boolean;
}
export const AutoTuneOptions = S.suspend(() =>
  S.Struct({
    DesiredState: S.optional(AutoTuneDesiredState),
    RollbackOnDisable: S.optional(RollbackOnDisable),
    MaintenanceSchedules: S.optional(AutoTuneMaintenanceScheduleList),
    UseOffPeakWindow: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AutoTuneOptions",
}) as any as S.Schema<AutoTuneOptions>;
export interface AssociatePackagesRequest {
  PackageList: PackageDetailsForAssociation[];
  DomainName: string;
}
export const AssociatePackagesRequest = S.suspend(() =>
  S.Struct({
    PackageList: PackageDetailsForAssociationList,
    DomainName: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2021-01-01/packages/associateMultiple" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociatePackagesRequest",
}) as any as S.Schema<AssociatePackagesRequest>;
export interface CreateApplicationRequest {
  clientToken?: string;
  name: string;
  dataSources?: DataSource[];
  iamIdentityCenterOptions?: IamIdentityCenterOptionsInput;
  appConfigs?: AppConfig[];
  tagList?: Tag[];
  kmsKeyArn?: string;
}
export const CreateApplicationRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    name: S.String,
    dataSources: S.optional(DataSources),
    iamIdentityCenterOptions: S.optional(IamIdentityCenterOptionsInput),
    appConfigs: S.optional(AppConfigs),
    tagList: S.optional(TagList),
    kmsKeyArn: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2021-01-01/opensearch/application" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateApplicationRequest",
}) as any as S.Schema<CreateApplicationRequest>;
export interface CreateIndexResponse {
  Status: IndexStatus;
}
export const CreateIndexResponse = S.suspend(() =>
  S.Struct({ Status: IndexStatus }).pipe(ns),
).annotations({
  identifier: "CreateIndexResponse",
}) as any as S.Schema<CreateIndexResponse>;
export interface CreatePackageRequest {
  PackageName: string;
  PackageType: PackageType;
  PackageDescription?: string;
  PackageSource: PackageSource;
  PackageConfiguration?: PackageConfiguration;
  EngineVersion?: string;
  PackageVendingOptions?: PackageVendingOptions;
  PackageEncryptionOptions?: PackageEncryptionOptions;
}
export const CreatePackageRequest = S.suspend(() =>
  S.Struct({
    PackageName: S.String,
    PackageType: PackageType,
    PackageDescription: S.optional(S.String),
    PackageSource: PackageSource,
    PackageConfiguration: S.optional(PackageConfiguration),
    EngineVersion: S.optional(S.String),
    PackageVendingOptions: S.optional(PackageVendingOptions),
    PackageEncryptionOptions: S.optional(PackageEncryptionOptions),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2021-01-01/packages" }),
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
export interface DeleteDataSourceResponse {
  Message?: string;
}
export const DeleteDataSourceResponse = S.suspend(() =>
  S.Struct({ Message: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteDataSourceResponse",
}) as any as S.Schema<DeleteDataSourceResponse>;
export type InboundConnectionStatusCode =
  | "PENDING_ACCEPTANCE"
  | "APPROVED"
  | "PROVISIONING"
  | "ACTIVE"
  | "REJECTING"
  | "REJECTED"
  | "DELETING"
  | "DELETED";
export const InboundConnectionStatusCode = S.Literal(
  "PENDING_ACCEPTANCE",
  "APPROVED",
  "PROVISIONING",
  "ACTIVE",
  "REJECTING",
  "REJECTED",
  "DELETING",
  "DELETED",
);
export interface InboundConnectionStatus {
  StatusCode?: InboundConnectionStatusCode;
  Message?: string;
}
export const InboundConnectionStatus = S.suspend(() =>
  S.Struct({
    StatusCode: S.optional(InboundConnectionStatusCode),
    Message: S.optional(S.String),
  }),
).annotations({
  identifier: "InboundConnectionStatus",
}) as any as S.Schema<InboundConnectionStatus>;
export interface InboundConnection {
  LocalDomainInfo?: DomainInformationContainer;
  RemoteDomainInfo?: DomainInformationContainer;
  ConnectionId?: string;
  ConnectionStatus?: InboundConnectionStatus;
  ConnectionMode?: ConnectionMode;
}
export const InboundConnection = S.suspend(() =>
  S.Struct({
    LocalDomainInfo: S.optional(DomainInformationContainer),
    RemoteDomainInfo: S.optional(DomainInformationContainer),
    ConnectionId: S.optional(S.String),
    ConnectionStatus: S.optional(InboundConnectionStatus),
    ConnectionMode: S.optional(ConnectionMode),
  }),
).annotations({
  identifier: "InboundConnection",
}) as any as S.Schema<InboundConnection>;
export interface DeleteInboundConnectionResponse {
  Connection?: InboundConnection;
}
export const DeleteInboundConnectionResponse = S.suspend(() =>
  S.Struct({ Connection: S.optional(InboundConnection) }).pipe(ns),
).annotations({
  identifier: "DeleteInboundConnectionResponse",
}) as any as S.Schema<DeleteInboundConnectionResponse>;
export interface DeleteIndexResponse {
  Status: IndexStatus;
}
export const DeleteIndexResponse = S.suspend(() =>
  S.Struct({ Status: IndexStatus }).pipe(ns),
).annotations({
  identifier: "DeleteIndexResponse",
}) as any as S.Schema<DeleteIndexResponse>;
export interface DescribeDomainResponse {
  DomainStatus: DomainStatus;
}
export const DescribeDomainResponse = S.suspend(() =>
  S.Struct({ DomainStatus: DomainStatus }).pipe(ns),
).annotations({
  identifier: "DescribeDomainResponse",
}) as any as S.Schema<DescribeDomainResponse>;
export interface DescribeDomainsResponse {
  DomainStatusList: DomainStatus[];
}
export const DescribeDomainsResponse = S.suspend(() =>
  S.Struct({ DomainStatusList: DomainStatusList }).pipe(ns),
).annotations({
  identifier: "DescribeDomainsResponse",
}) as any as S.Schema<DescribeDomainsResponse>;
export interface DescribeInboundConnectionsRequest {
  Filters?: Filter[];
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeInboundConnectionsRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(FilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2021-01-01/opensearch/cc/inboundConnection/search",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeInboundConnectionsRequest",
}) as any as S.Schema<DescribeInboundConnectionsRequest>;
export interface DescribeOutboundConnectionsResponse {
  Connections?: OutboundConnection[];
  NextToken?: string;
}
export const DescribeOutboundConnectionsResponse = S.suspend(() =>
  S.Struct({
    Connections: S.optional(OutboundConnections),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeOutboundConnectionsResponse",
}) as any as S.Schema<DescribeOutboundConnectionsResponse>;
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
      T.Http({ method: "POST", uri: "/2021-01-01/packages/describe" }),
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
export interface DissociatePackagesResponse {
  DomainPackageDetailsList?: DomainPackageDetails[];
}
export const DissociatePackagesResponse = S.suspend(() =>
  S.Struct({
    DomainPackageDetailsList: S.optional(DomainPackageDetailsList),
  }).pipe(ns),
).annotations({
  identifier: "DissociatePackagesResponse",
}) as any as S.Schema<DissociatePackagesResponse>;
export interface GetDataSourceResponse {
  DataSourceType?: DataSourceType;
  Name?: string;
  Description?: string;
  Status?: DataSourceStatus;
}
export const GetDataSourceResponse = S.suspend(() =>
  S.Struct({
    DataSourceType: S.optional(DataSourceType),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(DataSourceStatus),
  }).pipe(ns),
).annotations({
  identifier: "GetDataSourceResponse",
}) as any as S.Schema<GetDataSourceResponse>;
export interface GetDirectQueryDataSourceResponse {
  DataSourceName?: string;
  DataSourceType?: DirectQueryDataSourceType;
  Description?: string;
  OpenSearchArns?: string[];
  DataSourceArn?: string;
}
export const GetDirectQueryDataSourceResponse = S.suspend(() =>
  S.Struct({
    DataSourceName: S.optional(S.String),
    DataSourceType: S.optional(DirectQueryDataSourceType),
    Description: S.optional(S.String),
    OpenSearchArns: S.optional(DirectQueryOpenSearchARNList),
    DataSourceArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetDirectQueryDataSourceResponse",
}) as any as S.Schema<GetDirectQueryDataSourceResponse>;
export interface GetDomainMaintenanceStatusResponse {
  Status?: MaintenanceStatus;
  StatusMessage?: string;
  NodeId?: string;
  Action?: MaintenanceType;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const GetDomainMaintenanceStatusResponse = S.suspend(() =>
  S.Struct({
    Status: S.optional(MaintenanceStatus),
    StatusMessage: S.optional(S.String),
    NodeId: S.optional(S.String),
    Action: S.optional(MaintenanceType),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(ns),
).annotations({
  identifier: "GetDomainMaintenanceStatusResponse",
}) as any as S.Schema<GetDomainMaintenanceStatusResponse>;
export interface GetIndexResponse {
  IndexSchema: any;
}
export const GetIndexResponse = S.suspend(() =>
  S.Struct({ IndexSchema: S.Any }).pipe(ns),
).annotations({
  identifier: "GetIndexResponse",
}) as any as S.Schema<GetIndexResponse>;
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
export interface ListVersionsResponse {
  Versions?: string[];
  NextToken?: string;
}
export const ListVersionsResponse = S.suspend(() =>
  S.Struct({
    Versions: S.optional(VersionList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListVersionsResponse",
}) as any as S.Schema<ListVersionsResponse>;
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
export interface PurchaseReservedInstanceOfferingResponse {
  ReservedInstanceId?: string;
  ReservationName?: string;
}
export const PurchaseReservedInstanceOfferingResponse = S.suspend(() =>
  S.Struct({
    ReservedInstanceId: S.optional(S.String),
    ReservationName: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "PurchaseReservedInstanceOfferingResponse",
}) as any as S.Schema<PurchaseReservedInstanceOfferingResponse>;
export interface PutDefaultApplicationSettingResponse {
  applicationArn?: string;
}
export const PutDefaultApplicationSettingResponse = S.suspend(() =>
  S.Struct({ applicationArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "PutDefaultApplicationSettingResponse",
}) as any as S.Schema<PutDefaultApplicationSettingResponse>;
export interface RejectInboundConnectionResponse {
  Connection?: InboundConnection;
}
export const RejectInboundConnectionResponse = S.suspend(() =>
  S.Struct({ Connection: S.optional(InboundConnection) }).pipe(ns),
).annotations({
  identifier: "RejectInboundConnectionResponse",
}) as any as S.Schema<RejectInboundConnectionResponse>;
export interface StartDomainMaintenanceResponse {
  MaintenanceId?: string;
}
export const StartDomainMaintenanceResponse = S.suspend(() =>
  S.Struct({ MaintenanceId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "StartDomainMaintenanceResponse",
}) as any as S.Schema<StartDomainMaintenanceResponse>;
export interface StartServiceSoftwareUpdateResponse {
  ServiceSoftwareOptions?: ServiceSoftwareOptions;
}
export const StartServiceSoftwareUpdateResponse = S.suspend(() =>
  S.Struct({ ServiceSoftwareOptions: S.optional(ServiceSoftwareOptions) }).pipe(
    ns,
  ),
).annotations({
  identifier: "StartServiceSoftwareUpdateResponse",
}) as any as S.Schema<StartServiceSoftwareUpdateResponse>;
export interface IamIdentityCenterOptions {
  enabled?: boolean;
  iamIdentityCenterInstanceArn?: string;
  iamRoleForIdentityCenterApplicationArn?: string;
  iamIdentityCenterApplicationArn?: string;
}
export const IamIdentityCenterOptions = S.suspend(() =>
  S.Struct({
    enabled: S.optional(S.Boolean),
    iamIdentityCenterInstanceArn: S.optional(S.String),
    iamRoleForIdentityCenterApplicationArn: S.optional(S.String),
    iamIdentityCenterApplicationArn: S.optional(S.String),
  }),
).annotations({
  identifier: "IamIdentityCenterOptions",
}) as any as S.Schema<IamIdentityCenterOptions>;
export interface UpdateApplicationResponse {
  id?: string;
  name?: string;
  arn?: string;
  dataSources?: DataSource[];
  iamIdentityCenterOptions?: IamIdentityCenterOptions;
  appConfigs?: AppConfig[];
  createdAt?: Date;
  lastUpdatedAt?: Date;
}
export const UpdateApplicationResponse = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    arn: S.optional(S.String),
    dataSources: S.optional(DataSources),
    iamIdentityCenterOptions: S.optional(IamIdentityCenterOptions),
    appConfigs: S.optional(AppConfigs),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(ns),
).annotations({
  identifier: "UpdateApplicationResponse",
}) as any as S.Schema<UpdateApplicationResponse>;
export interface UpdateDataSourceResponse {
  Message?: string;
}
export const UpdateDataSourceResponse = S.suspend(() =>
  S.Struct({ Message: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateDataSourceResponse",
}) as any as S.Schema<UpdateDataSourceResponse>;
export interface UpdateDirectQueryDataSourceResponse {
  DataSourceArn?: string;
}
export const UpdateDirectQueryDataSourceResponse = S.suspend(() =>
  S.Struct({ DataSourceArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateDirectQueryDataSourceResponse",
}) as any as S.Schema<UpdateDirectQueryDataSourceResponse>;
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
export interface JWTOptionsInput {
  Enabled?: boolean;
  SubjectKey?: string;
  RolesKey?: string;
  PublicKey?: string;
}
export const JWTOptionsInput = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    SubjectKey: S.optional(S.String),
    RolesKey: S.optional(S.String),
    PublicKey: S.optional(S.String),
  }),
).annotations({
  identifier: "JWTOptionsInput",
}) as any as S.Schema<JWTOptionsInput>;
export interface IAMFederationOptionsInput {
  Enabled?: boolean;
  SubjectKey?: string;
  RolesKey?: string;
}
export const IAMFederationOptionsInput = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    SubjectKey: S.optional(S.String),
    RolesKey: S.optional(S.String),
  }),
).annotations({
  identifier: "IAMFederationOptionsInput",
}) as any as S.Schema<IAMFederationOptionsInput>;
export interface AdvancedSecurityOptionsInput {
  Enabled?: boolean;
  InternalUserDatabaseEnabled?: boolean;
  MasterUserOptions?: MasterUserOptions;
  SAMLOptions?: SAMLOptionsInput;
  JWTOptions?: JWTOptionsInput;
  IAMFederationOptions?: IAMFederationOptionsInput;
  AnonymousAuthEnabled?: boolean;
}
export const AdvancedSecurityOptionsInput = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    InternalUserDatabaseEnabled: S.optional(S.Boolean),
    MasterUserOptions: S.optional(MasterUserOptions),
    SAMLOptions: S.optional(SAMLOptionsInput),
    JWTOptions: S.optional(JWTOptionsInput),
    IAMFederationOptions: S.optional(IAMFederationOptionsInput),
    AnonymousAuthEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AdvancedSecurityOptionsInput",
}) as any as S.Schema<AdvancedSecurityOptionsInput>;
export interface NaturalLanguageQueryGenerationOptionsInput {
  DesiredState?: NaturalLanguageQueryGenerationDesiredState;
}
export const NaturalLanguageQueryGenerationOptionsInput = S.suspend(() =>
  S.Struct({
    DesiredState: S.optional(NaturalLanguageQueryGenerationDesiredState),
  }),
).annotations({
  identifier: "NaturalLanguageQueryGenerationOptionsInput",
}) as any as S.Schema<NaturalLanguageQueryGenerationOptionsInput>;
export interface AIMLOptionsInput {
  NaturalLanguageQueryGenerationOptions?: NaturalLanguageQueryGenerationOptionsInput;
  S3VectorsEngine?: S3VectorsEngine;
  ServerlessVectorAcceleration?: ServerlessVectorAcceleration;
}
export const AIMLOptionsInput = S.suspend(() =>
  S.Struct({
    NaturalLanguageQueryGenerationOptions: S.optional(
      NaturalLanguageQueryGenerationOptionsInput,
    ),
    S3VectorsEngine: S.optional(S3VectorsEngine),
    ServerlessVectorAcceleration: S.optional(ServerlessVectorAcceleration),
  }),
).annotations({
  identifier: "AIMLOptionsInput",
}) as any as S.Schema<AIMLOptionsInput>;
export interface UpdateDomainConfigRequest {
  DomainName: string;
  ClusterConfig?: ClusterConfig;
  EBSOptions?: EBSOptions;
  SnapshotOptions?: SnapshotOptions;
  VPCOptions?: VPCOptions;
  CognitoOptions?: CognitoOptions;
  AdvancedOptions?: { [key: string]: string };
  AccessPolicies?: string;
  IPAddressType?: IPAddressType;
  LogPublishingOptions?: { [key: string]: LogPublishingOption };
  EncryptionAtRestOptions?: EncryptionAtRestOptions;
  DomainEndpointOptions?: DomainEndpointOptions;
  NodeToNodeEncryptionOptions?: NodeToNodeEncryptionOptions;
  AdvancedSecurityOptions?: AdvancedSecurityOptionsInput;
  IdentityCenterOptions?: IdentityCenterOptionsInput;
  AutoTuneOptions?: AutoTuneOptions;
  DryRun?: boolean;
  DryRunMode?: DryRunMode;
  OffPeakWindowOptions?: OffPeakWindowOptions;
  SoftwareUpdateOptions?: SoftwareUpdateOptions;
  AIMLOptions?: AIMLOptionsInput;
}
export const UpdateDomainConfigRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ClusterConfig: S.optional(ClusterConfig),
    EBSOptions: S.optional(EBSOptions),
    SnapshotOptions: S.optional(SnapshotOptions),
    VPCOptions: S.optional(VPCOptions),
    CognitoOptions: S.optional(CognitoOptions),
    AdvancedOptions: S.optional(AdvancedOptions),
    AccessPolicies: S.optional(S.String),
    IPAddressType: S.optional(IPAddressType),
    LogPublishingOptions: S.optional(LogPublishingOptions),
    EncryptionAtRestOptions: S.optional(EncryptionAtRestOptions),
    DomainEndpointOptions: S.optional(DomainEndpointOptions),
    NodeToNodeEncryptionOptions: S.optional(NodeToNodeEncryptionOptions),
    AdvancedSecurityOptions: S.optional(AdvancedSecurityOptionsInput),
    IdentityCenterOptions: S.optional(IdentityCenterOptionsInput),
    AutoTuneOptions: S.optional(AutoTuneOptions),
    DryRun: S.optional(S.Boolean),
    DryRunMode: S.optional(DryRunMode),
    OffPeakWindowOptions: S.optional(OffPeakWindowOptions),
    SoftwareUpdateOptions: S.optional(SoftwareUpdateOptions),
    AIMLOptions: S.optional(AIMLOptionsInput),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2021-01-01/opensearch/domain/{DomainName}/config",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDomainConfigRequest",
}) as any as S.Schema<UpdateDomainConfigRequest>;
export interface UpdateIndexResponse {
  Status: IndexStatus;
}
export const UpdateIndexResponse = S.suspend(() =>
  S.Struct({ Status: IndexStatus }).pipe(ns),
).annotations({
  identifier: "UpdateIndexResponse",
}) as any as S.Schema<UpdateIndexResponse>;
export type PackageStatus =
  | "COPYING"
  | "COPY_FAILED"
  | "VALIDATING"
  | "VALIDATION_FAILED"
  | "AVAILABLE"
  | "DELETING"
  | "DELETED"
  | "DELETE_FAILED";
export const PackageStatus = S.Literal(
  "COPYING",
  "COPY_FAILED",
  "VALIDATING",
  "VALIDATION_FAILED",
  "AVAILABLE",
  "DELETING",
  "DELETED",
  "DELETE_FAILED",
);
export interface PluginProperties {
  Name?: string;
  Description?: string;
  Version?: string;
  ClassName?: string;
  UncompressedSizeInBytes?: number;
}
export const PluginProperties = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Version: S.optional(S.String),
    ClassName: S.optional(S.String),
    UncompressedSizeInBytes: S.optional(S.Number),
  }),
).annotations({
  identifier: "PluginProperties",
}) as any as S.Schema<PluginProperties>;
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
  EngineVersion?: string;
  AvailablePluginProperties?: PluginProperties;
  AvailablePackageConfiguration?: PackageConfiguration;
  AllowListedUserList?: string[];
  PackageOwner?: string;
  PackageVendingOptions?: PackageVendingOptions;
  PackageEncryptionOptions?: PackageEncryptionOptions;
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
    EngineVersion: S.optional(S.String),
    AvailablePluginProperties: S.optional(PluginProperties),
    AvailablePackageConfiguration: S.optional(PackageConfiguration),
    AllowListedUserList: S.optional(PackageUserList),
    PackageOwner: S.optional(S.String),
    PackageVendingOptions: S.optional(PackageVendingOptions),
    PackageEncryptionOptions: S.optional(PackageEncryptionOptions),
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
export interface UpdatePackageScopeResponse {
  PackageID?: string;
  Operation?: PackageScopeOperationEnum;
  PackageUserList?: string[];
}
export const UpdatePackageScopeResponse = S.suspend(() =>
  S.Struct({
    PackageID: S.optional(S.String),
    Operation: S.optional(PackageScopeOperationEnum),
    PackageUserList: S.optional(PackageUserList),
  }).pipe(ns),
).annotations({
  identifier: "UpdatePackageScopeResponse",
}) as any as S.Schema<UpdatePackageScopeResponse>;
export type ActionSeverity = "HIGH" | "MEDIUM" | "LOW";
export const ActionSeverity = S.Literal("HIGH", "MEDIUM", "LOW");
export type ScheduledBy = "CUSTOMER" | "SYSTEM";
export const ScheduledBy = S.Literal("CUSTOMER", "SYSTEM");
export type ActionStatus =
  | "PENDING_UPDATE"
  | "IN_PROGRESS"
  | "FAILED"
  | "COMPLETED"
  | "NOT_ELIGIBLE"
  | "ELIGIBLE";
export const ActionStatus = S.Literal(
  "PENDING_UPDATE",
  "IN_PROGRESS",
  "FAILED",
  "COMPLETED",
  "NOT_ELIGIBLE",
  "ELIGIBLE",
);
export interface ScheduledAction {
  Id: string;
  Type: ActionType;
  Severity: ActionSeverity;
  ScheduledTime: number;
  Description?: string;
  ScheduledBy?: ScheduledBy;
  Status?: ActionStatus;
  Mandatory?: boolean;
  Cancellable?: boolean;
}
export const ScheduledAction = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Type: ActionType,
    Severity: ActionSeverity,
    ScheduledTime: S.Number,
    Description: S.optional(S.String),
    ScheduledBy: S.optional(ScheduledBy),
    Status: S.optional(ActionStatus),
    Mandatory: S.optional(S.Boolean),
    Cancellable: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ScheduledAction",
}) as any as S.Schema<ScheduledAction>;
export interface UpdateScheduledActionResponse {
  ScheduledAction?: ScheduledAction;
}
export const UpdateScheduledActionResponse = S.suspend(() =>
  S.Struct({ ScheduledAction: S.optional(ScheduledAction) }).pipe(ns),
).annotations({
  identifier: "UpdateScheduledActionResponse",
}) as any as S.Schema<UpdateScheduledActionResponse>;
export interface UpdateVpcEndpointResponse {
  VpcEndpoint: VpcEndpoint;
}
export const UpdateVpcEndpointResponse = S.suspend(() =>
  S.Struct({ VpcEndpoint: VpcEndpoint }).pipe(ns),
).annotations({
  identifier: "UpdateVpcEndpointResponse",
}) as any as S.Schema<UpdateVpcEndpointResponse>;
export type AutoTuneType = "SCHEDULED_ACTION";
export const AutoTuneType = S.Literal("SCHEDULED_ACTION");
export type OverallChangeStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";
export const OverallChangeStatus = S.Literal(
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
);
export type NodeType = "Data" | "Ultrawarm" | "Master" | "Warm";
export const NodeType = S.Literal("Data", "Ultrawarm", "Master", "Warm");
export type NodeStatus = "Active" | "StandBy" | "NotAvailable";
export const NodeStatus = S.Literal("Active", "StandBy", "NotAvailable");
export type ReservedInstancePaymentOption =
  | "ALL_UPFRONT"
  | "PARTIAL_UPFRONT"
  | "NO_UPFRONT";
export const ReservedInstancePaymentOption = S.Literal(
  "ALL_UPFRONT",
  "PARTIAL_UPFRONT",
  "NO_UPFRONT",
);
export type VpcEndpointErrorCode = "ENDPOINT_NOT_FOUND" | "SERVER_ERROR";
export const VpcEndpointErrorCode = S.Literal(
  "ENDPOINT_NOT_FOUND",
  "SERVER_ERROR",
);
export type InstanceRoleList = string[];
export const InstanceRoleList = S.Array(S.String);
export type AvailabilityZoneList = string[];
export const AvailabilityZoneList = S.Array(S.String);
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
export interface DomainNodesStatus {
  NodeId?: string;
  NodeType?: NodeType;
  AvailabilityZone?: string;
  InstanceType?: OpenSearchPartitionInstanceType;
  NodeStatus?: NodeStatus;
  StorageType?: string;
  StorageVolumeType?: VolumeType;
  StorageSize?: string;
}
export const DomainNodesStatus = S.suspend(() =>
  S.Struct({
    NodeId: S.optional(S.String),
    NodeType: S.optional(NodeType),
    AvailabilityZone: S.optional(S.String),
    InstanceType: S.optional(OpenSearchPartitionInstanceType),
    NodeStatus: S.optional(NodeStatus),
    StorageType: S.optional(S.String),
    StorageVolumeType: S.optional(VolumeType),
    StorageSize: S.optional(S.String),
  }),
).annotations({
  identifier: "DomainNodesStatus",
}) as any as S.Schema<DomainNodesStatus>;
export type DomainNodesStatusList = DomainNodesStatus[];
export const DomainNodesStatusList = S.Array(DomainNodesStatus);
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
export type InboundConnections = InboundConnection[];
export const InboundConnections = S.Array(InboundConnection);
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
export interface ReservedInstance {
  ReservationName?: string;
  ReservedInstanceId?: string;
  BillingSubscriptionId?: number;
  ReservedInstanceOfferingId?: string;
  InstanceType?: OpenSearchPartitionInstanceType;
  StartTime?: Date;
  Duration?: number;
  FixedPrice?: number;
  UsagePrice?: number;
  CurrencyCode?: string;
  InstanceCount?: number;
  State?: string;
  PaymentOption?: ReservedInstancePaymentOption;
  RecurringCharges?: RecurringCharge[];
}
export const ReservedInstance = S.suspend(() =>
  S.Struct({
    ReservationName: S.optional(S.String),
    ReservedInstanceId: S.optional(S.String),
    BillingSubscriptionId: S.optional(S.Number),
    ReservedInstanceOfferingId: S.optional(S.String),
    InstanceType: S.optional(OpenSearchPartitionInstanceType),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Duration: S.optional(S.Number),
    FixedPrice: S.optional(S.Number),
    UsagePrice: S.optional(S.Number),
    CurrencyCode: S.optional(S.String),
    InstanceCount: S.optional(S.Number),
    State: S.optional(S.String),
    PaymentOption: S.optional(ReservedInstancePaymentOption),
    RecurringCharges: S.optional(RecurringChargeList),
  }),
).annotations({
  identifier: "ReservedInstance",
}) as any as S.Schema<ReservedInstance>;
export type ReservedInstanceList = ReservedInstance[];
export const ReservedInstanceList = S.Array(ReservedInstance);
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
    TargetVersions: S.optional(VersionList),
  }),
).annotations({
  identifier: "CompatibleVersionsMap",
}) as any as S.Schema<CompatibleVersionsMap>;
export type CompatibleVersionsList = CompatibleVersionsMap[];
export const CompatibleVersionsList = S.Array(CompatibleVersionsMap);
export interface PackageVersionHistory {
  PackageVersion?: string;
  CommitMessage?: string;
  CreatedAt?: Date;
  PluginProperties?: PluginProperties;
  PackageConfiguration?: PackageConfiguration;
}
export const PackageVersionHistory = S.suspend(() =>
  S.Struct({
    PackageVersion: S.optional(S.String),
    CommitMessage: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    PluginProperties: S.optional(PluginProperties),
    PackageConfiguration: S.optional(PackageConfiguration),
  }),
).annotations({
  identifier: "PackageVersionHistory",
}) as any as S.Schema<PackageVersionHistory>;
export type PackageVersionHistoryList = PackageVersionHistory[];
export const PackageVersionHistoryList = S.Array(PackageVersionHistory);
export interface ApplicationSummary {
  id?: string;
  arn?: string;
  name?: string;
  endpoint?: string;
  status?: ApplicationStatus;
  createdAt?: Date;
  lastUpdatedAt?: Date;
}
export const ApplicationSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    name: S.optional(S.String),
    endpoint: S.optional(S.String),
    status: S.optional(ApplicationStatus),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ApplicationSummary",
}) as any as S.Schema<ApplicationSummary>;
export type ApplicationSummaries = ApplicationSummary[];
export const ApplicationSummaries = S.Array(ApplicationSummary);
export interface DataSourceDetails {
  DataSourceType?: DataSourceType;
  Name?: string;
  Description?: string;
  Status?: DataSourceStatus;
}
export const DataSourceDetails = S.suspend(() =>
  S.Struct({
    DataSourceType: S.optional(DataSourceType),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(DataSourceStatus),
  }),
).annotations({
  identifier: "DataSourceDetails",
}) as any as S.Schema<DataSourceDetails>;
export type DataSourceList = DataSourceDetails[];
export const DataSourceList = S.Array(DataSourceDetails);
export interface DirectQueryDataSource {
  DataSourceName?: string;
  DataSourceType?: DirectQueryDataSourceType;
  Description?: string;
  OpenSearchArns?: string[];
  DataSourceArn?: string;
  TagList?: Tag[];
}
export const DirectQueryDataSource = S.suspend(() =>
  S.Struct({
    DataSourceName: S.optional(S.String),
    DataSourceType: S.optional(DirectQueryDataSourceType),
    Description: S.optional(S.String),
    OpenSearchArns: S.optional(DirectQueryOpenSearchARNList),
    DataSourceArn: S.optional(S.String),
    TagList: S.optional(TagList),
  }),
).annotations({
  identifier: "DirectQueryDataSource",
}) as any as S.Schema<DirectQueryDataSource>;
export type DirectQueryDataSourceList = DirectQueryDataSource[];
export const DirectQueryDataSourceList = S.Array(DirectQueryDataSource);
export interface DomainMaintenanceDetails {
  MaintenanceId?: string;
  DomainName?: string;
  Action?: MaintenanceType;
  NodeId?: string;
  Status?: MaintenanceStatus;
  StatusMessage?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const DomainMaintenanceDetails = S.suspend(() =>
  S.Struct({
    MaintenanceId: S.optional(S.String),
    DomainName: S.optional(S.String),
    Action: S.optional(MaintenanceType),
    NodeId: S.optional(S.String),
    Status: S.optional(MaintenanceStatus),
    StatusMessage: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DomainMaintenanceDetails",
}) as any as S.Schema<DomainMaintenanceDetails>;
export type DomainMaintenanceList = DomainMaintenanceDetails[];
export const DomainMaintenanceList = S.Array(DomainMaintenanceDetails);
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
export interface InstanceTypeDetails {
  InstanceType?: OpenSearchPartitionInstanceType;
  EncryptionEnabled?: boolean;
  CognitoEnabled?: boolean;
  AppLogsEnabled?: boolean;
  AdvancedSecurityEnabled?: boolean;
  WarmEnabled?: boolean;
  InstanceRole?: string[];
  AvailabilityZones?: string[];
}
export const InstanceTypeDetails = S.suspend(() =>
  S.Struct({
    InstanceType: S.optional(OpenSearchPartitionInstanceType),
    EncryptionEnabled: S.optional(S.Boolean),
    CognitoEnabled: S.optional(S.Boolean),
    AppLogsEnabled: S.optional(S.Boolean),
    AdvancedSecurityEnabled: S.optional(S.Boolean),
    WarmEnabled: S.optional(S.Boolean),
    InstanceRole: S.optional(InstanceRoleList),
    AvailabilityZones: S.optional(AvailabilityZoneList),
  }),
).annotations({
  identifier: "InstanceTypeDetails",
}) as any as S.Schema<InstanceTypeDetails>;
export type InstanceTypeDetailsList = InstanceTypeDetails[];
export const InstanceTypeDetailsList = S.Array(InstanceTypeDetails);
export type ScheduledActionsList = ScheduledAction[];
export const ScheduledActionsList = S.Array(ScheduledAction);
export type ZoneStatus = "Active" | "StandBy" | "NotAvailable";
export const ZoneStatus = S.Literal("Active", "StandBy", "NotAvailable");
export type Issues = string[];
export const Issues = S.Array(S.String);
export interface AddDataSourceRequest {
  DomainName: string;
  Name: string;
  DataSourceType: DataSourceType;
  Description?: string;
}
export const AddDataSourceRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Name: S.String,
    DataSourceType: DataSourceType,
    Description: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2021-01-01/opensearch/domain/{DomainName}/dataSource",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddDataSourceRequest",
}) as any as S.Schema<AddDataSourceRequest>;
export interface AddDirectQueryDataSourceRequest {
  DataSourceName: string;
  DataSourceType: DirectQueryDataSourceType;
  Description?: string;
  OpenSearchArns: string[];
  TagList?: Tag[];
}
export const AddDirectQueryDataSourceRequest = S.suspend(() =>
  S.Struct({
    DataSourceName: S.String,
    DataSourceType: DirectQueryDataSourceType,
    Description: S.optional(S.String),
    OpenSearchArns: DirectQueryOpenSearchARNList,
    TagList: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2021-01-01/opensearch/directQueryDataSource",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddDirectQueryDataSourceRequest",
}) as any as S.Schema<AddDirectQueryDataSourceRequest>;
export interface AssociatePackageRequest {
  PackageID: string;
  DomainName: string;
  PrerequisitePackageIDList?: string[];
  AssociationConfiguration?: PackageAssociationConfiguration;
}
export const AssociatePackageRequest = S.suspend(() =>
  S.Struct({
    PackageID: S.String.pipe(T.HttpLabel("PackageID")),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    PrerequisitePackageIDList: S.optional(PackageIDList),
    AssociationConfiguration: S.optional(PackageAssociationConfiguration),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2021-01-01/packages/associate/{PackageID}/{DomainName}",
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
export interface AssociatePackagesResponse {
  DomainPackageDetailsList?: DomainPackageDetails[];
}
export const AssociatePackagesResponse = S.suspend(() =>
  S.Struct({
    DomainPackageDetailsList: S.optional(DomainPackageDetailsList),
  }).pipe(ns),
).annotations({
  identifier: "AssociatePackagesResponse",
}) as any as S.Schema<AssociatePackagesResponse>;
export interface AuthorizeVpcEndpointAccessResponse {
  AuthorizedPrincipal: AuthorizedPrincipal;
}
export const AuthorizeVpcEndpointAccessResponse = S.suspend(() =>
  S.Struct({ AuthorizedPrincipal: AuthorizedPrincipal }).pipe(ns),
).annotations({
  identifier: "AuthorizeVpcEndpointAccessResponse",
}) as any as S.Schema<AuthorizeVpcEndpointAccessResponse>;
export interface CancelDomainConfigChangeResponse {
  CancelledChangeIds?: string[];
  CancelledChangeProperties?: CancelledChangeProperty[];
  DryRun?: boolean;
}
export const CancelDomainConfigChangeResponse = S.suspend(() =>
  S.Struct({
    CancelledChangeIds: S.optional(GUIDList),
    CancelledChangeProperties: S.optional(CancelledChangePropertyList),
    DryRun: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "CancelDomainConfigChangeResponse",
}) as any as S.Schema<CancelDomainConfigChangeResponse>;
export interface CancelServiceSoftwareUpdateResponse {
  ServiceSoftwareOptions?: ServiceSoftwareOptions;
}
export const CancelServiceSoftwareUpdateResponse = S.suspend(() =>
  S.Struct({ ServiceSoftwareOptions: S.optional(ServiceSoftwareOptions) }).pipe(
    ns,
  ),
).annotations({
  identifier: "CancelServiceSoftwareUpdateResponse",
}) as any as S.Schema<CancelServiceSoftwareUpdateResponse>;
export interface CreateApplicationResponse {
  id?: string;
  name?: string;
  arn?: string;
  dataSources?: DataSource[];
  iamIdentityCenterOptions?: IamIdentityCenterOptions;
  appConfigs?: AppConfig[];
  tagList?: Tag[];
  createdAt?: Date;
  kmsKeyArn?: string;
}
export const CreateApplicationResponse = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    arn: S.optional(S.String),
    dataSources: S.optional(DataSources),
    iamIdentityCenterOptions: S.optional(IamIdentityCenterOptions),
    appConfigs: S.optional(AppConfigs),
    tagList: S.optional(TagList),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    kmsKeyArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateApplicationResponse",
}) as any as S.Schema<CreateApplicationResponse>;
export interface CreateOutboundConnectionRequest {
  LocalDomainInfo: DomainInformationContainer;
  RemoteDomainInfo: DomainInformationContainer;
  ConnectionAlias: string;
  ConnectionMode?: ConnectionMode;
  ConnectionProperties?: ConnectionProperties;
}
export const CreateOutboundConnectionRequest = S.suspend(() =>
  S.Struct({
    LocalDomainInfo: DomainInformationContainer,
    RemoteDomainInfo: DomainInformationContainer,
    ConnectionAlias: S.String,
    ConnectionMode: S.optional(ConnectionMode),
    ConnectionProperties: S.optional(ConnectionProperties),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2021-01-01/opensearch/cc/outboundConnection",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateOutboundConnectionRequest",
}) as any as S.Schema<CreateOutboundConnectionRequest>;
export interface CreatePackageResponse {
  PackageDetails?: PackageDetails;
}
export const CreatePackageResponse = S.suspend(() =>
  S.Struct({ PackageDetails: S.optional(PackageDetails) }).pipe(ns),
).annotations({
  identifier: "CreatePackageResponse",
}) as any as S.Schema<CreatePackageResponse>;
export interface DeleteVpcEndpointResponse {
  VpcEndpointSummary: VpcEndpointSummary;
}
export const DeleteVpcEndpointResponse = S.suspend(() =>
  S.Struct({ VpcEndpointSummary: VpcEndpointSummary }).pipe(ns),
).annotations({
  identifier: "DeleteVpcEndpointResponse",
}) as any as S.Schema<DeleteVpcEndpointResponse>;
export interface DescribeDomainNodesResponse {
  DomainNodesStatusList?: DomainNodesStatus[];
}
export const DescribeDomainNodesResponse = S.suspend(() =>
  S.Struct({ DomainNodesStatusList: S.optional(DomainNodesStatusList) }).pipe(
    ns,
  ),
).annotations({
  identifier: "DescribeDomainNodesResponse",
}) as any as S.Schema<DescribeDomainNodesResponse>;
export interface DescribeInboundConnectionsResponse {
  Connections?: InboundConnection[];
  NextToken?: string;
}
export const DescribeInboundConnectionsResponse = S.suspend(() =>
  S.Struct({
    Connections: S.optional(InboundConnections),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeInboundConnectionsResponse",
}) as any as S.Schema<DescribeInboundConnectionsResponse>;
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
export interface DescribeReservedInstancesResponse {
  NextToken?: string;
  ReservedInstances?: ReservedInstance[];
}
export const DescribeReservedInstancesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ReservedInstances: S.optional(ReservedInstanceList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeReservedInstancesResponse",
}) as any as S.Schema<DescribeReservedInstancesResponse>;
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
export interface DissociatePackageResponse {
  DomainPackageDetails?: DomainPackageDetails;
}
export const DissociatePackageResponse = S.suspend(() =>
  S.Struct({ DomainPackageDetails: S.optional(DomainPackageDetails) }).pipe(ns),
).annotations({
  identifier: "DissociatePackageResponse",
}) as any as S.Schema<DissociatePackageResponse>;
export interface GetApplicationResponse {
  id?: string;
  arn?: string;
  name?: string;
  endpoint?: string;
  status?: ApplicationStatus;
  iamIdentityCenterOptions?: IamIdentityCenterOptions;
  dataSources?: DataSource[];
  appConfigs?: AppConfig[];
  createdAt?: Date;
  lastUpdatedAt?: Date;
  kmsKeyArn?: string;
}
export const GetApplicationResponse = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    name: S.optional(S.String),
    endpoint: S.optional(S.String),
    status: S.optional(ApplicationStatus),
    iamIdentityCenterOptions: S.optional(IamIdentityCenterOptions),
    dataSources: S.optional(DataSources),
    appConfigs: S.optional(AppConfigs),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    kmsKeyArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetApplicationResponse",
}) as any as S.Schema<GetApplicationResponse>;
export interface GetCompatibleVersionsResponse {
  CompatibleVersions?: CompatibleVersionsMap[];
}
export const GetCompatibleVersionsResponse = S.suspend(() =>
  S.Struct({ CompatibleVersions: S.optional(CompatibleVersionsList) }).pipe(ns),
).annotations({
  identifier: "GetCompatibleVersionsResponse",
}) as any as S.Schema<GetCompatibleVersionsResponse>;
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
export interface ListApplicationsResponse {
  ApplicationSummaries?: ApplicationSummary[];
  nextToken?: string;
}
export const ListApplicationsResponse = S.suspend(() =>
  S.Struct({
    ApplicationSummaries: S.optional(ApplicationSummaries),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListApplicationsResponse",
}) as any as S.Schema<ListApplicationsResponse>;
export interface ListDataSourcesResponse {
  DataSources?: DataSourceDetails[];
}
export const ListDataSourcesResponse = S.suspend(() =>
  S.Struct({ DataSources: S.optional(DataSourceList) }).pipe(ns),
).annotations({
  identifier: "ListDataSourcesResponse",
}) as any as S.Schema<ListDataSourcesResponse>;
export interface ListDirectQueryDataSourcesResponse {
  NextToken?: string;
  DirectQueryDataSources?: DirectQueryDataSource[];
}
export const ListDirectQueryDataSourcesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    DirectQueryDataSources: S.optional(DirectQueryDataSourceList),
  }).pipe(ns),
).annotations({
  identifier: "ListDirectQueryDataSourcesResponse",
}) as any as S.Schema<ListDirectQueryDataSourcesResponse>;
export interface ListDomainMaintenancesResponse {
  DomainMaintenances?: DomainMaintenanceDetails[];
  NextToken?: string;
}
export const ListDomainMaintenancesResponse = S.suspend(() =>
  S.Struct({
    DomainMaintenances: S.optional(DomainMaintenanceList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListDomainMaintenancesResponse",
}) as any as S.Schema<ListDomainMaintenancesResponse>;
export interface ListDomainNamesResponse {
  DomainNames?: DomainInfo[];
}
export const ListDomainNamesResponse = S.suspend(() =>
  S.Struct({ DomainNames: S.optional(DomainInfoList) }).pipe(ns),
).annotations({
  identifier: "ListDomainNamesResponse",
}) as any as S.Schema<ListDomainNamesResponse>;
export interface ListInstanceTypeDetailsResponse {
  InstanceTypeDetails?: InstanceTypeDetails[];
  NextToken?: string;
}
export const ListInstanceTypeDetailsResponse = S.suspend(() =>
  S.Struct({
    InstanceTypeDetails: S.optional(InstanceTypeDetailsList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListInstanceTypeDetailsResponse",
}) as any as S.Schema<ListInstanceTypeDetailsResponse>;
export interface ListScheduledActionsResponse {
  ScheduledActions?: ScheduledAction[];
  NextToken?: string;
}
export const ListScheduledActionsResponse = S.suspend(() =>
  S.Struct({
    ScheduledActions: S.optional(ScheduledActionsList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListScheduledActionsResponse",
}) as any as S.Schema<ListScheduledActionsResponse>;
export type OptionState = "RequiresIndexDocuments" | "Processing" | "Active";
export const OptionState = S.Literal(
  "RequiresIndexDocuments",
  "Processing",
  "Active",
);
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
export interface VersionStatus {
  Options: string;
  Status: OptionStatus;
}
export const VersionStatus = S.suspend(() =>
  S.Struct({ Options: S.String, Status: OptionStatus }),
).annotations({
  identifier: "VersionStatus",
}) as any as S.Schema<VersionStatus>;
export interface ClusterConfigStatus {
  Options: ClusterConfig;
  Status: OptionStatus;
}
export const ClusterConfigStatus = S.suspend(() =>
  S.Struct({ Options: ClusterConfig, Status: OptionStatus }),
).annotations({
  identifier: "ClusterConfigStatus",
}) as any as S.Schema<ClusterConfigStatus>;
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
export interface IPAddressTypeStatus {
  Options: IPAddressType;
  Status: OptionStatus;
}
export const IPAddressTypeStatus = S.suspend(() =>
  S.Struct({ Options: IPAddressType, Status: OptionStatus }),
).annotations({
  identifier: "IPAddressTypeStatus",
}) as any as S.Schema<IPAddressTypeStatus>;
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
  Options: { [key: string]: string };
  Status: OptionStatus;
}
export const AdvancedOptionsStatus = S.suspend(() =>
  S.Struct({ Options: AdvancedOptions, Status: OptionStatus }),
).annotations({
  identifier: "AdvancedOptionsStatus",
}) as any as S.Schema<AdvancedOptionsStatus>;
export interface LogPublishingOptionsStatus {
  Options?: { [key: string]: LogPublishingOption };
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
export interface IdentityCenterOptionsStatus {
  Options: IdentityCenterOptions;
  Status: OptionStatus;
}
export const IdentityCenterOptionsStatus = S.suspend(() =>
  S.Struct({ Options: IdentityCenterOptions, Status: OptionStatus }),
).annotations({
  identifier: "IdentityCenterOptionsStatus",
}) as any as S.Schema<IdentityCenterOptionsStatus>;
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
export interface OffPeakWindowOptionsStatus {
  Options?: OffPeakWindowOptions;
  Status?: OptionStatus;
}
export const OffPeakWindowOptionsStatus = S.suspend(() =>
  S.Struct({
    Options: S.optional(OffPeakWindowOptions),
    Status: S.optional(OptionStatus),
  }),
).annotations({
  identifier: "OffPeakWindowOptionsStatus",
}) as any as S.Schema<OffPeakWindowOptionsStatus>;
export interface SoftwareUpdateOptionsStatus {
  Options?: SoftwareUpdateOptions;
  Status?: OptionStatus;
}
export const SoftwareUpdateOptionsStatus = S.suspend(() =>
  S.Struct({
    Options: S.optional(SoftwareUpdateOptions),
    Status: S.optional(OptionStatus),
  }),
).annotations({
  identifier: "SoftwareUpdateOptionsStatus",
}) as any as S.Schema<SoftwareUpdateOptionsStatus>;
export interface AIMLOptionsStatus {
  Options?: AIMLOptionsOutput;
  Status?: OptionStatus;
}
export const AIMLOptionsStatus = S.suspend(() =>
  S.Struct({
    Options: S.optional(AIMLOptionsOutput),
    Status: S.optional(OptionStatus),
  }),
).annotations({
  identifier: "AIMLOptionsStatus",
}) as any as S.Schema<AIMLOptionsStatus>;
export interface DomainConfig {
  EngineVersion?: VersionStatus;
  ClusterConfig?: ClusterConfigStatus;
  EBSOptions?: EBSOptionsStatus;
  AccessPolicies?: AccessPoliciesStatus;
  IPAddressType?: IPAddressTypeStatus;
  SnapshotOptions?: SnapshotOptionsStatus;
  VPCOptions?: VPCDerivedInfoStatus;
  CognitoOptions?: CognitoOptionsStatus;
  EncryptionAtRestOptions?: EncryptionAtRestOptionsStatus;
  NodeToNodeEncryptionOptions?: NodeToNodeEncryptionOptionsStatus;
  AdvancedOptions?: AdvancedOptionsStatus;
  LogPublishingOptions?: LogPublishingOptionsStatus;
  DomainEndpointOptions?: DomainEndpointOptionsStatus;
  AdvancedSecurityOptions?: AdvancedSecurityOptionsStatus;
  IdentityCenterOptions?: IdentityCenterOptionsStatus;
  AutoTuneOptions?: AutoTuneOptionsStatus;
  ChangeProgressDetails?: ChangeProgressDetails;
  OffPeakWindowOptions?: OffPeakWindowOptionsStatus;
  SoftwareUpdateOptions?: SoftwareUpdateOptionsStatus;
  ModifyingProperties?: ModifyingProperties[];
  AIMLOptions?: AIMLOptionsStatus;
}
export const DomainConfig = S.suspend(() =>
  S.Struct({
    EngineVersion: S.optional(VersionStatus),
    ClusterConfig: S.optional(ClusterConfigStatus),
    EBSOptions: S.optional(EBSOptionsStatus),
    AccessPolicies: S.optional(AccessPoliciesStatus),
    IPAddressType: S.optional(IPAddressTypeStatus),
    SnapshotOptions: S.optional(SnapshotOptionsStatus),
    VPCOptions: S.optional(VPCDerivedInfoStatus),
    CognitoOptions: S.optional(CognitoOptionsStatus),
    EncryptionAtRestOptions: S.optional(EncryptionAtRestOptionsStatus),
    NodeToNodeEncryptionOptions: S.optional(NodeToNodeEncryptionOptionsStatus),
    AdvancedOptions: S.optional(AdvancedOptionsStatus),
    LogPublishingOptions: S.optional(LogPublishingOptionsStatus),
    DomainEndpointOptions: S.optional(DomainEndpointOptionsStatus),
    AdvancedSecurityOptions: S.optional(AdvancedSecurityOptionsStatus),
    IdentityCenterOptions: S.optional(IdentityCenterOptionsStatus),
    AutoTuneOptions: S.optional(AutoTuneOptionsStatus),
    ChangeProgressDetails: S.optional(ChangeProgressDetails),
    OffPeakWindowOptions: S.optional(OffPeakWindowOptionsStatus),
    SoftwareUpdateOptions: S.optional(SoftwareUpdateOptionsStatus),
    ModifyingProperties: S.optional(ModifyingPropertiesList),
    AIMLOptions: S.optional(AIMLOptionsStatus),
  }),
).annotations({ identifier: "DomainConfig" }) as any as S.Schema<DomainConfig>;
export interface ValidationFailure {
  Code?: string;
  Message?: string;
}
export const ValidationFailure = S.suspend(() =>
  S.Struct({ Code: S.optional(S.String), Message: S.optional(S.String) }),
).annotations({
  identifier: "ValidationFailure",
}) as any as S.Schema<ValidationFailure>;
export type ValidationFailures = ValidationFailure[];
export const ValidationFailures = S.Array(ValidationFailure);
export interface DryRunProgressStatus {
  DryRunId: string;
  DryRunStatus: string;
  CreationDate: string;
  UpdateDate: string;
  ValidationFailures?: ValidationFailure[];
}
export const DryRunProgressStatus = S.suspend(() =>
  S.Struct({
    DryRunId: S.String,
    DryRunStatus: S.String,
    CreationDate: S.String,
    UpdateDate: S.String,
    ValidationFailures: S.optional(ValidationFailures),
  }),
).annotations({
  identifier: "DryRunProgressStatus",
}) as any as S.Schema<DryRunProgressStatus>;
export interface UpdateDomainConfigResponse {
  DomainConfig: DomainConfig;
  DryRunResults?: DryRunResults;
  DryRunProgressStatus?: DryRunProgressStatus;
}
export const UpdateDomainConfigResponse = S.suspend(() =>
  S.Struct({
    DomainConfig: DomainConfig,
    DryRunResults: S.optional(DryRunResults),
    DryRunProgressStatus: S.optional(DryRunProgressStatus),
  }).pipe(ns),
).annotations({
  identifier: "UpdateDomainConfigResponse",
}) as any as S.Schema<UpdateDomainConfigResponse>;
export interface UpgradeDomainResponse {
  UpgradeId?: string;
  DomainName?: string;
  TargetVersion?: string;
  PerformCheckOnly?: boolean;
  AdvancedOptions?: { [key: string]: string };
  ChangeProgressDetails?: ChangeProgressDetails;
}
export const UpgradeDomainResponse = S.suspend(() =>
  S.Struct({
    UpgradeId: S.optional(S.String),
    DomainName: S.optional(S.String),
    TargetVersion: S.optional(S.String),
    PerformCheckOnly: S.optional(S.Boolean),
    AdvancedOptions: S.optional(AdvancedOptions),
    ChangeProgressDetails: S.optional(ChangeProgressDetails),
  }).pipe(ns),
).annotations({
  identifier: "UpgradeDomainResponse",
}) as any as S.Schema<UpgradeDomainResponse>;
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
export interface AvailabilityZoneInfo {
  AvailabilityZoneName?: string;
  ZoneStatus?: ZoneStatus;
  ConfiguredDataNodeCount?: string;
  AvailableDataNodeCount?: string;
  TotalShards?: string;
  TotalUnAssignedShards?: string;
}
export const AvailabilityZoneInfo = S.suspend(() =>
  S.Struct({
    AvailabilityZoneName: S.optional(S.String),
    ZoneStatus: S.optional(ZoneStatus),
    ConfiguredDataNodeCount: S.optional(S.String),
    AvailableDataNodeCount: S.optional(S.String),
    TotalShards: S.optional(S.String),
    TotalUnAssignedShards: S.optional(S.String),
  }),
).annotations({
  identifier: "AvailabilityZoneInfo",
}) as any as S.Schema<AvailabilityZoneInfo>;
export type AvailabilityZoneInfoList = AvailabilityZoneInfo[];
export const AvailabilityZoneInfoList = S.Array(AvailabilityZoneInfo);
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
  | "JVM_YOUNG_GEN_TUNING";
export const ScheduledAutoTuneActionType = S.Literal(
  "JVM_HEAP_SIZE_TUNING",
  "JVM_YOUNG_GEN_TUNING",
);
export type ScheduledAutoTuneSeverityType = "LOW" | "MEDIUM" | "HIGH";
export const ScheduledAutoTuneSeverityType = S.Literal("LOW", "MEDIUM", "HIGH");
export type LimitValueList = string[];
export const LimitValueList = S.Array(S.String);
export interface AutoTuneOptionsInput {
  DesiredState?: AutoTuneDesiredState;
  MaintenanceSchedules?: AutoTuneMaintenanceSchedule[];
  UseOffPeakWindow?: boolean;
}
export const AutoTuneOptionsInput = S.suspend(() =>
  S.Struct({
    DesiredState: S.optional(AutoTuneDesiredState),
    MaintenanceSchedules: S.optional(AutoTuneMaintenanceScheduleList),
    UseOffPeakWindow: S.optional(S.Boolean),
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
  LastUpdatedTime?: Date;
  ConfigChangeStatus?: ConfigChangeStatus;
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
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ConfigChangeStatus: S.optional(ConfigChangeStatus),
    InitiatedBy: S.optional(InitiatedBy),
  }),
).annotations({
  identifier: "ChangeProgressStatusDetails",
}) as any as S.Schema<ChangeProgressStatusDetails>;
export interface EnvironmentInfo {
  AvailabilityZoneInformation?: AvailabilityZoneInfo[];
}
export const EnvironmentInfo = S.suspend(() =>
  S.Struct({
    AvailabilityZoneInformation: S.optional(AvailabilityZoneInfoList),
  }),
).annotations({
  identifier: "EnvironmentInfo",
}) as any as S.Schema<EnvironmentInfo>;
export type EnvironmentInfoList = EnvironmentInfo[];
export const EnvironmentInfoList = S.Array(EnvironmentInfo);
export interface ReservedInstanceOffering {
  ReservedInstanceOfferingId?: string;
  InstanceType?: OpenSearchPartitionInstanceType;
  Duration?: number;
  FixedPrice?: number;
  UsagePrice?: number;
  CurrencyCode?: string;
  PaymentOption?: ReservedInstancePaymentOption;
  RecurringCharges?: RecurringCharge[];
}
export const ReservedInstanceOffering = S.suspend(() =>
  S.Struct({
    ReservedInstanceOfferingId: S.optional(S.String),
    InstanceType: S.optional(OpenSearchPartitionInstanceType),
    Duration: S.optional(S.Number),
    FixedPrice: S.optional(S.Number),
    UsagePrice: S.optional(S.Number),
    CurrencyCode: S.optional(S.String),
    PaymentOption: S.optional(ReservedInstancePaymentOption),
    RecurringCharges: S.optional(RecurringChargeList),
  }),
).annotations({
  identifier: "ReservedInstanceOffering",
}) as any as S.Schema<ReservedInstanceOffering>;
export type ReservedInstanceOfferingList = ReservedInstanceOffering[];
export const ReservedInstanceOfferingList = S.Array(
  ReservedInstanceOffering.pipe(
    T.XmlName("ReservedInstanceOffering"),
  ).annotations({ identifier: "ReservedInstanceOffering" }),
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
export interface AcceptInboundConnectionResponse {
  Connection?: InboundConnection;
}
export const AcceptInboundConnectionResponse = S.suspend(() =>
  S.Struct({ Connection: S.optional(InboundConnection) }).pipe(ns),
).annotations({
  identifier: "AcceptInboundConnectionResponse",
}) as any as S.Schema<AcceptInboundConnectionResponse>;
export interface AddDataSourceResponse {
  Message?: string;
}
export const AddDataSourceResponse = S.suspend(() =>
  S.Struct({ Message: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "AddDataSourceResponse",
}) as any as S.Schema<AddDataSourceResponse>;
export interface AddDirectQueryDataSourceResponse {
  DataSourceArn?: string;
}
export const AddDirectQueryDataSourceResponse = S.suspend(() =>
  S.Struct({ DataSourceArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "AddDirectQueryDataSourceResponse",
}) as any as S.Schema<AddDirectQueryDataSourceResponse>;
export interface AssociatePackageResponse {
  DomainPackageDetails?: DomainPackageDetails;
}
export const AssociatePackageResponse = S.suspend(() =>
  S.Struct({ DomainPackageDetails: S.optional(DomainPackageDetails) }).pipe(ns),
).annotations({
  identifier: "AssociatePackageResponse",
}) as any as S.Schema<AssociatePackageResponse>;
export interface CreateDomainRequest {
  DomainName: string;
  EngineVersion?: string;
  ClusterConfig?: ClusterConfig;
  EBSOptions?: EBSOptions;
  AccessPolicies?: string;
  IPAddressType?: IPAddressType;
  SnapshotOptions?: SnapshotOptions;
  VPCOptions?: VPCOptions;
  CognitoOptions?: CognitoOptions;
  EncryptionAtRestOptions?: EncryptionAtRestOptions;
  NodeToNodeEncryptionOptions?: NodeToNodeEncryptionOptions;
  AdvancedOptions?: { [key: string]: string };
  LogPublishingOptions?: { [key: string]: LogPublishingOption };
  DomainEndpointOptions?: DomainEndpointOptions;
  AdvancedSecurityOptions?: AdvancedSecurityOptionsInput;
  IdentityCenterOptions?: IdentityCenterOptionsInput;
  TagList?: Tag[];
  AutoTuneOptions?: AutoTuneOptionsInput;
  OffPeakWindowOptions?: OffPeakWindowOptions;
  SoftwareUpdateOptions?: SoftwareUpdateOptions;
  AIMLOptions?: AIMLOptionsInput;
}
export const CreateDomainRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String,
    EngineVersion: S.optional(S.String),
    ClusterConfig: S.optional(ClusterConfig),
    EBSOptions: S.optional(EBSOptions),
    AccessPolicies: S.optional(S.String),
    IPAddressType: S.optional(IPAddressType),
    SnapshotOptions: S.optional(SnapshotOptions),
    VPCOptions: S.optional(VPCOptions),
    CognitoOptions: S.optional(CognitoOptions),
    EncryptionAtRestOptions: S.optional(EncryptionAtRestOptions),
    NodeToNodeEncryptionOptions: S.optional(NodeToNodeEncryptionOptions),
    AdvancedOptions: S.optional(AdvancedOptions),
    LogPublishingOptions: S.optional(LogPublishingOptions),
    DomainEndpointOptions: S.optional(DomainEndpointOptions),
    AdvancedSecurityOptions: S.optional(AdvancedSecurityOptionsInput),
    IdentityCenterOptions: S.optional(IdentityCenterOptionsInput),
    TagList: S.optional(TagList),
    AutoTuneOptions: S.optional(AutoTuneOptionsInput),
    OffPeakWindowOptions: S.optional(OffPeakWindowOptions),
    SoftwareUpdateOptions: S.optional(SoftwareUpdateOptions),
    AIMLOptions: S.optional(AIMLOptionsInput),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2021-01-01/opensearch/domain" }),
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
export interface CreateOutboundConnectionResponse {
  LocalDomainInfo?: DomainInformationContainer;
  RemoteDomainInfo?: DomainInformationContainer;
  ConnectionAlias?: string;
  ConnectionStatus?: OutboundConnectionStatus;
  ConnectionId?: string;
  ConnectionMode?: ConnectionMode;
  ConnectionProperties?: ConnectionProperties;
}
export const CreateOutboundConnectionResponse = S.suspend(() =>
  S.Struct({
    LocalDomainInfo: S.optional(DomainInformationContainer),
    RemoteDomainInfo: S.optional(DomainInformationContainer),
    ConnectionAlias: S.optional(S.String),
    ConnectionStatus: S.optional(OutboundConnectionStatus),
    ConnectionId: S.optional(S.String),
    ConnectionMode: S.optional(ConnectionMode),
    ConnectionProperties: S.optional(ConnectionProperties),
  }).pipe(ns),
).annotations({
  identifier: "CreateOutboundConnectionResponse",
}) as any as S.Schema<CreateOutboundConnectionResponse>;
export interface CreateVpcEndpointResponse {
  VpcEndpoint: VpcEndpoint;
}
export const CreateVpcEndpointResponse = S.suspend(() =>
  S.Struct({ VpcEndpoint: VpcEndpoint }).pipe(ns),
).annotations({
  identifier: "CreateVpcEndpointResponse",
}) as any as S.Schema<CreateVpcEndpointResponse>;
export interface DeleteOutboundConnectionResponse {
  Connection?: OutboundConnection;
}
export const DeleteOutboundConnectionResponse = S.suspend(() =>
  S.Struct({ Connection: S.optional(OutboundConnection) }).pipe(ns),
).annotations({
  identifier: "DeleteOutboundConnectionResponse",
}) as any as S.Schema<DeleteOutboundConnectionResponse>;
export interface DeletePackageResponse {
  PackageDetails?: PackageDetails;
}
export const DeletePackageResponse = S.suspend(() =>
  S.Struct({ PackageDetails: S.optional(PackageDetails) }).pipe(ns),
).annotations({
  identifier: "DeletePackageResponse",
}) as any as S.Schema<DeletePackageResponse>;
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
export interface DescribeDomainHealthResponse {
  DomainState?: DomainState;
  AvailabilityZoneCount?: string;
  ActiveAvailabilityZoneCount?: string;
  StandByAvailabilityZoneCount?: string;
  DataNodeCount?: string;
  DedicatedMaster?: boolean;
  MasterEligibleNodeCount?: string;
  WarmNodeCount?: string;
  MasterNode?: MasterNodeStatus;
  ClusterHealth?: DomainHealth;
  TotalShards?: string;
  TotalUnAssignedShards?: string;
  EnvironmentInformation?: EnvironmentInfo[];
}
export const DescribeDomainHealthResponse = S.suspend(() =>
  S.Struct({
    DomainState: S.optional(DomainState),
    AvailabilityZoneCount: S.optional(S.String),
    ActiveAvailabilityZoneCount: S.optional(S.String),
    StandByAvailabilityZoneCount: S.optional(S.String),
    DataNodeCount: S.optional(S.String),
    DedicatedMaster: S.optional(S.Boolean),
    MasterEligibleNodeCount: S.optional(S.String),
    WarmNodeCount: S.optional(S.String),
    MasterNode: S.optional(MasterNodeStatus),
    ClusterHealth: S.optional(DomainHealth),
    TotalShards: S.optional(S.String),
    TotalUnAssignedShards: S.optional(S.String),
    EnvironmentInformation: S.optional(EnvironmentInfoList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDomainHealthResponse",
}) as any as S.Schema<DescribeDomainHealthResponse>;
export interface DescribeDryRunProgressResponse {
  DryRunProgressStatus?: DryRunProgressStatus;
  DryRunConfig?: DomainStatus;
  DryRunResults?: DryRunResults;
}
export const DescribeDryRunProgressResponse = S.suspend(() =>
  S.Struct({
    DryRunProgressStatus: S.optional(DryRunProgressStatus),
    DryRunConfig: S.optional(DomainStatus),
    DryRunResults: S.optional(DryRunResults),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDryRunProgressResponse",
}) as any as S.Schema<DescribeDryRunProgressResponse>;
export interface DescribeReservedInstanceOfferingsResponse {
  NextToken?: string;
  ReservedInstanceOfferings?: ReservedInstanceOffering[];
}
export const DescribeReservedInstanceOfferingsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ReservedInstanceOfferings: S.optional(ReservedInstanceOfferingList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeReservedInstanceOfferingsResponse",
}) as any as S.Schema<DescribeReservedInstanceOfferingsResponse>;
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
export type SlotList = number[];
export const SlotList = S.Array(S.Number);
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
export interface CreateDomainResponse {
  DomainStatus?: DomainStatus;
}
export const CreateDomainResponse = S.suspend(() =>
  S.Struct({ DomainStatus: S.optional(DomainStatus) }).pipe(ns),
).annotations({
  identifier: "CreateDomainResponse",
}) as any as S.Schema<CreateDomainResponse>;
export interface DeleteDomainResponse {
  DomainStatus?: DomainStatus;
}
export const DeleteDomainResponse = S.suspend(() =>
  S.Struct({ DomainStatus: S.optional(DomainStatus) }).pipe(ns),
).annotations({
  identifier: "DeleteDomainResponse",
}) as any as S.Schema<DeleteDomainResponse>;
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
export interface DescribeDomainConfigResponse {
  DomainConfig: DomainConfig;
}
export const DescribeDomainConfigResponse = S.suspend(() =>
  S.Struct({ DomainConfig: DomainConfig }).pipe(ns),
).annotations({
  identifier: "DescribeDomainConfigResponse",
}) as any as S.Schema<DescribeDomainConfigResponse>;
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
export type LimitsByRole = { [key: string]: Limits };
export const LimitsByRole = S.Record({ key: S.String, value: Limits });
export interface DescribeInstanceTypeLimitsResponse {
  LimitsByRole?: { [key: string]: Limits };
}
export const DescribeInstanceTypeLimitsResponse = S.suspend(() =>
  S.Struct({ LimitsByRole: S.optional(LimitsByRole) }).pipe(ns),
).annotations({
  identifier: "DescribeInstanceTypeLimitsResponse",
}) as any as S.Schema<DescribeInstanceTypeLimitsResponse>;

//# Errors
export class BaseException extends S.TaggedError<BaseException>()(
  "BaseException",
  { message: S.optional(S.String) },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalException extends S.TaggedError<InternalException>()(
  "InternalException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class DependencyFailureException extends S.TaggedError<DependencyFailureException>()(
  "DependencyFailureException",
  { message: S.optional(S.String) },
) {}
export class DisabledOperationException extends S.TaggedError<DisabledOperationException>()(
  "DisabledOperationException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InvalidTypeException extends S.TaggedError<InvalidTypeException>()(
  "InvalidTypeException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InvalidPaginationTokenException extends S.TaggedError<InvalidPaginationTokenException>()(
  "InvalidPaginationTokenException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class SlotNotAvailableException extends S.TaggedError<SlotNotAvailableException>()(
  "SlotNotAvailableException",
  { SlotSuggestions: S.optional(SlotList), message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}

//# Operations
/**
 * Retrieves all Amazon OpenSearch Service-managed VPC endpoints in the current Amazon Web Services account and Region.
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
 * Allows the source Amazon OpenSearch Service domain owner to delete an existing
 * outbound cross-cluster search connection. For more information, see Cross-cluster search for Amazon OpenSearch Service.
 */
export const deleteOutboundConnection: (
  input: DeleteOutboundConnectionRequest,
) => effect.Effect<
  DeleteOutboundConnectionResponse,
  DisabledOperationException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOutboundConnectionRequest,
  output: DeleteOutboundConnectionResponse,
  errors: [DisabledOperationException, ResourceNotFoundException],
}));
/**
 * Lists all the inbound cross-cluster search connections for a destination (remote)
 * Amazon OpenSearch Service domain. For more information, see Cross-cluster search for Amazon OpenSearch Service.
 */
export const describeInboundConnections: {
  (
    input: DescribeInboundConnectionsRequest,
  ): effect.Effect<
    DescribeInboundConnectionsResponse,
    DisabledOperationException | InvalidPaginationTokenException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeInboundConnectionsRequest,
  ) => stream.Stream<
    DescribeInboundConnectionsResponse,
    DisabledOperationException | InvalidPaginationTokenException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeInboundConnectionsRequest,
  ) => stream.Stream<
    unknown,
    DisabledOperationException | InvalidPaginationTokenException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeInboundConnectionsRequest,
  output: DescribeInboundConnectionsResponse,
  errors: [DisabledOperationException, InvalidPaginationTokenException],
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
 * Retrieves the complete history of the last 10 upgrades performed on an Amazon OpenSearch
 * Service domain.
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
 * Allows you to either upgrade your Amazon OpenSearch Service domain or perform an
 * upgrade eligibility check to a compatible version of OpenSearch or Elasticsearch.
 */
export const upgradeDomain: (
  input: UpgradeDomainRequest,
) => effect.Effect<
  UpgradeDomainResponse,
  | BaseException
  | DisabledOperationException
  | InternalException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpgradeDomainRequest,
  output: UpgradeDomainResponse,
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
 * Updates a package for use with Amazon OpenSearch Service domains. For more
 * information, see Custom packages
 * for Amazon OpenSearch Service.
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
 * Allows you to purchase Amazon OpenSearch Service Reserved Instances.
 */
export const purchaseReservedInstanceOffering: (
  input: PurchaseReservedInstanceOfferingRequest,
) => effect.Effect<
  PurchaseReservedInstanceOfferingResponse,
  | DisabledOperationException
  | InternalException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PurchaseReservedInstanceOfferingRequest,
  output: PurchaseReservedInstanceOfferingResponse,
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
 * Provides access to an Amazon OpenSearch Service domain through the use of an interface
 * VPC endpoint.
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
 * Allows the destination Amazon OpenSearch Service domain owner to accept an inbound
 * cross-cluster search connection request. For more information, see Cross-cluster search for Amazon OpenSearch Service.
 */
export const acceptInboundConnection: (
  input: AcceptInboundConnectionRequest,
) => effect.Effect<
  AcceptInboundConnectionResponse,
  | DisabledOperationException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptInboundConnectionRequest,
  output: AcceptInboundConnectionResponse,
  errors: [
    DisabledOperationException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a new direct-query data source to the specified domain. For more information,
 * see Creating Amazon OpenSearch Service data source integrations with Amazon
 * S3.
 */
export const addDataSource: (
  input: AddDataSourceRequest,
) => effect.Effect<
  AddDataSourceResponse,
  | BaseException
  | DependencyFailureException
  | DisabledOperationException
  | InternalException
  | LimitExceededException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddDataSourceRequest,
  output: AddDataSourceResponse,
  errors: [
    BaseException,
    DependencyFailureException,
    DisabledOperationException,
    InternalException,
    LimitExceededException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Adds a new data source in Amazon OpenSearch Service so that you can perform direct
 * queries on external data.
 */
export const addDirectQueryDataSource: (
  input: AddDirectQueryDataSourceRequest,
) => effect.Effect<
  AddDirectQueryDataSourceResponse,
  | BaseException
  | DisabledOperationException
  | InternalException
  | LimitExceededException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddDirectQueryDataSourceRequest,
  output: AddDirectQueryDataSourceResponse,
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
 * Allows the destination Amazon OpenSearch Service domain owner to delete an existing
 * inbound cross-cluster search connection. For more information, see Cross-cluster search for Amazon OpenSearch Service.
 */
export const deleteInboundConnection: (
  input: DeleteInboundConnectionRequest,
) => effect.Effect<
  DeleteInboundConnectionResponse,
  DisabledOperationException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInboundConnectionRequest,
  output: DeleteInboundConnectionResponse,
  errors: [DisabledOperationException, ResourceNotFoundException],
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
 * Returns information about domain and nodes, including data nodes, master nodes,
 * ultrawarm nodes, Availability Zone(s), standby nodes, node configurations, and node
 * states.
 */
export const describeDomainNodes: (
  input: DescribeDomainNodesRequest,
) => effect.Effect<
  DescribeDomainNodesResponse,
  | BaseException
  | DependencyFailureException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDomainNodesRequest,
  output: DescribeDomainNodesResponse,
  errors: [
    BaseException,
    DependencyFailureException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes all packages available to OpenSearch Service. For more information, see
 * Custom packages
 * for Amazon OpenSearch Service.
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
 * Describes the Amazon OpenSearch Service instances that you have reserved in a given
 * Region. For more information, see Reserved Instances in Amazon
 * OpenSearch Service.
 */
export const describeReservedInstances: {
  (
    input: DescribeReservedInstancesRequest,
  ): effect.Effect<
    DescribeReservedInstancesResponse,
    | DisabledOperationException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeReservedInstancesRequest,
  ) => stream.Stream<
    DescribeReservedInstancesResponse,
    | DisabledOperationException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeReservedInstancesRequest,
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
  input: DescribeReservedInstancesRequest,
  output: DescribeReservedInstancesResponse,
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
 * Removes a package from the specified Amazon OpenSearch Service domain. The package
 * can't be in use with any OpenSearch index for the dissociation to succeed. The package
 * is still available in OpenSearch Service for association later. For more information,
 * see Custom packages
 * for Amazon OpenSearch Service.
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
 * Retrieves the configuration and status of an existing OpenSearch application.
 */
export const getApplication: (
  input: GetApplicationRequest,
) => effect.Effect<
  GetApplicationResponse,
  | AccessDeniedException
  | BaseException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApplicationRequest,
  output: GetApplicationResponse,
  errors: [
    AccessDeniedException,
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a map of OpenSearch or Elasticsearch versions and the versions you can upgrade
 * them to.
 */
export const getCompatibleVersions: (
  input: GetCompatibleVersionsRequest,
) => effect.Effect<
  GetCompatibleVersionsResponse,
  | BaseException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCompatibleVersionsRequest,
  output: GetCompatibleVersionsResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a list of Amazon OpenSearch Service package versions, along with their creation
 * time, commit message, and plugin properties (if the package is a zip plugin package). For more
 * information, see Custom packages for Amazon
 * OpenSearch Service.
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
 * Lists all OpenSearch applications under your account.
 */
export const listApplications: {
  (
    input: ListApplicationsRequest,
  ): effect.Effect<
    ListApplicationsResponse,
    | AccessDeniedException
    | BaseException
    | DisabledOperationException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListApplicationsRequest,
  ) => stream.Stream<
    ListApplicationsResponse,
    | AccessDeniedException
    | BaseException
    | DisabledOperationException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListApplicationsRequest,
  ) => stream.Stream<
    ApplicationSummary,
    | AccessDeniedException
    | BaseException
    | DisabledOperationException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListApplicationsRequest,
  output: ListApplicationsResponse,
  errors: [
    AccessDeniedException,
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "ApplicationSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists direct-query data sources for a specific domain. For more information, see For
 * more information, see Working with
 * Amazon OpenSearch Service direct queries with Amazon S3.
 */
export const listDataSources: (
  input: ListDataSourcesRequest,
) => effect.Effect<
  ListDataSourcesResponse,
  | BaseException
  | DependencyFailureException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDataSourcesRequest,
  output: ListDataSourcesResponse,
  errors: [
    BaseException,
    DependencyFailureException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists an inventory of all the direct query data sources that you have configured
 * within Amazon OpenSearch Service.
 */
export const listDirectQueryDataSources: (
  input: ListDirectQueryDataSourcesRequest,
) => effect.Effect<
  ListDirectQueryDataSourcesResponse,
  | BaseException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDirectQueryDataSourcesRequest,
  output: ListDirectQueryDataSourcesResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * A list of maintenance actions for the domain.
 */
export const listDomainMaintenances: {
  (
    input: ListDomainMaintenancesRequest,
  ): effect.Effect<
    ListDomainMaintenancesResponse,
    | BaseException
    | DisabledOperationException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListDomainMaintenancesRequest,
  ) => stream.Stream<
    ListDomainMaintenancesResponse,
    | BaseException
    | DisabledOperationException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListDomainMaintenancesRequest,
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
  input: ListDomainMaintenancesRequest,
  output: ListDomainMaintenancesResponse,
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
 * Lists all instance types and available features for a given OpenSearch or
 * Elasticsearch version.
 */
export const listInstanceTypeDetails: {
  (
    input: ListInstanceTypeDetailsRequest,
  ): effect.Effect<
    ListInstanceTypeDetailsResponse,
    | BaseException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListInstanceTypeDetailsRequest,
  ) => stream.Stream<
    ListInstanceTypeDetailsResponse,
    | BaseException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListInstanceTypeDetailsRequest,
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
  input: ListInstanceTypeDetailsRequest,
  output: ListInstanceTypeDetailsResponse,
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
 * Describes the domain configuration for the specified Amazon OpenSearch Service domain,
 * including the domain ID, domain service endpoint, and domain ARN.
 */
export const describeDomain: (
  input: DescribeDomainRequest,
) => effect.Effect<
  DescribeDomainResponse,
  | BaseException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDomainRequest,
  output: DescribeDomainResponse,
  errors: [
    BaseException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists all Amazon OpenSearch Service domains associated with a given package. For more
 * information, see Custom packages
 * for Amazon OpenSearch Service.
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
 * Lists all packages associated with an Amazon OpenSearch Service domain. For more
 * information, see Custom packages
 * for Amazon OpenSearch Service.
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
 * Returns all resource tags for an Amazon OpenSearch Service domain, data source, or
 * application. For more information, see Tagging Amazon OpenSearch Service resources.
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
 * Lists all versions of OpenSearch and Elasticsearch that Amazon OpenSearch Service
 * supports.
 */
export const listVersions: {
  (
    input: ListVersionsRequest,
  ): effect.Effect<
    ListVersionsResponse,
    | BaseException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListVersionsRequest,
  ) => stream.Stream<
    ListVersionsResponse,
    | BaseException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListVersionsRequest,
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
  input: ListVersionsRequest,
  output: ListVersionsResponse,
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
 * Sets the default application to the application with the specified ARN.
 *
 * To remove the default application, use the `GetDefaultApplicationSetting`
 * operation to get the current default and then call the
 * `PutDefaultApplicationSetting` with the current applications ARN and the
 * `setAsDefault` parameter set to `false`.
 */
export const putDefaultApplicationSetting: (
  input: PutDefaultApplicationSettingRequest,
) => effect.Effect<
  PutDefaultApplicationSettingResponse,
  | AccessDeniedException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDefaultApplicationSettingRequest,
  output: PutDefaultApplicationSettingResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Schedules a service software update for an Amazon OpenSearch Service domain. For more
 * information, see Service
 * software updates in Amazon OpenSearch Service.
 */
export const startServiceSoftwareUpdate: (
  input: StartServiceSoftwareUpdateRequest,
) => effect.Effect<
  StartServiceSoftwareUpdateResponse,
  | BaseException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartServiceSoftwareUpdateRequest,
  output: StartServiceSoftwareUpdateResponse,
  errors: [
    BaseException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets the ARN of the current default application.
 *
 * If the default application isn't set, the operation returns a resource not found
 * error.
 */
export const getDefaultApplicationSetting: (
  input: GetDefaultApplicationSettingRequest,
) => effect.Effect<
  GetDefaultApplicationSettingResponse,
  | AccessDeniedException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDefaultApplicationSettingRequest,
  output: GetDefaultApplicationSettingResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Dissociates multiple packages from a domain simultaneously.
 */
export const dissociatePackages: (
  input: DissociatePackagesRequest,
) => effect.Effect<
  DissociatePackagesResponse,
  | BaseException
  | ConflictException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DissociatePackagesRequest,
  output: DissociatePackagesResponse,
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
 * Updates the configuration and settings of an existing OpenSearch application.
 */
export const updateApplication: (
  input: UpdateApplicationRequest,
) => effect.Effect<
  UpdateApplicationResponse,
  | AccessDeniedException
  | BaseException
  | ConflictException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApplicationRequest,
  output: UpdateApplicationResponse,
  errors: [
    AccessDeniedException,
    BaseException,
    ConflictException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
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
 * Operation in the Amazon OpenSearch Service API for associating multiple packages with
 * a domain simultaneously.
 */
export const associatePackages: (
  input: AssociatePackagesRequest,
) => effect.Effect<
  AssociatePackagesResponse,
  | BaseException
  | ConflictException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociatePackagesRequest,
  output: AssociatePackagesResponse,
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
 * Retrieves information about a direct query data source.
 */
export const getDataSource: (
  input: GetDataSourceRequest,
) => effect.Effect<
  GetDataSourceResponse,
  | BaseException
  | DependencyFailureException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataSourceRequest,
  output: GetDataSourceResponse,
  errors: [
    BaseException,
    DependencyFailureException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates a direct-query data source. For more information, see Working
 * with Amazon OpenSearch Service data source integrations with Amazon
 * S3.
 */
export const updateDataSource: (
  input: UpdateDataSourceRequest,
) => effect.Effect<
  UpdateDataSourceResponse,
  | BaseException
  | DependencyFailureException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataSourceRequest,
  output: UpdateDataSourceResponse,
  errors: [
    BaseException,
    DependencyFailureException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns detailed configuration information for a specific direct query data source in
 * Amazon OpenSearch Service.
 */
export const getDirectQueryDataSource: (
  input: GetDirectQueryDataSourceRequest,
) => effect.Effect<
  GetDirectQueryDataSourceResponse,
  | BaseException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDirectQueryDataSourceRequest,
  output: GetDirectQueryDataSourceResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * The status of the maintenance action.
 */
export const getDomainMaintenanceStatus: (
  input: GetDomainMaintenanceStatusRequest,
) => effect.Effect<
  GetDomainMaintenanceStatusResponse,
  | BaseException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainMaintenanceStatusRequest,
  output: GetDomainMaintenanceStatusResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns the most recent status of the last upgrade or upgrade eligibility check performed on
 * an Amazon OpenSearch Service domain.
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
 * Retrieves information about each Amazon Web Services principal that is allowed to
 * access a given Amazon OpenSearch Service domain through the use of an interface VPC
 * endpoint.
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
 * Retrieves all Amazon OpenSearch Service-managed VPC endpoints associated with a
 * particular domain.
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
 * Allows the remote Amazon OpenSearch Service domain owner to reject an inbound
 * cross-cluster connection request.
 */
export const rejectInboundConnection: (
  input: RejectInboundConnectionRequest,
) => effect.Effect<
  RejectInboundConnectionResponse,
  DisabledOperationException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectInboundConnectionRequest,
  output: RejectInboundConnectionResponse,
  errors: [DisabledOperationException, ResourceNotFoundException],
}));
/**
 * Starts the node maintenance process on the data node. These processes can include a
 * node reboot, an Opensearch or Elasticsearch process restart, or a Dashboard or Kibana
 * restart.
 */
export const startDomainMaintenance: (
  input: StartDomainMaintenanceRequest,
) => effect.Effect<
  StartDomainMaintenanceResponse,
  | BaseException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDomainMaintenanceRequest,
  output: StartDomainMaintenanceResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration or properties of an existing direct query data source in
 * Amazon OpenSearch Service.
 */
export const updateDirectQueryDataSource: (
  input: UpdateDirectQueryDataSourceRequest,
) => effect.Effect<
  UpdateDirectQueryDataSourceResponse,
  | BaseException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDirectQueryDataSourceRequest,
  output: UpdateDirectQueryDataSourceResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the scope of a package. Scope of the package defines users who can view and
 * associate a package.
 */
export const updatePackageScope: (
  input: UpdatePackageScopeRequest,
) => effect.Effect<
  UpdatePackageScopeResponse,
  | BaseException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePackageScopeRequest,
  output: UpdatePackageScopeResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a previously configured direct query data source from Amazon OpenSearch
 * Service.
 */
export const deleteDirectQueryDataSource: (
  input: DeleteDirectQueryDataSourceRequest,
) => effect.Effect<
  DeleteDirectQueryDataSourceResponse,
  | BaseException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDirectQueryDataSourceRequest,
  output: DeleteDirectQueryDataSourceResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Revokes access to an Amazon OpenSearch Service domain that was provided through an
 * interface VPC endpoint.
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
 * Deletes a specified OpenSearch application.
 */
export const deleteApplication: (
  input: DeleteApplicationRequest,
) => effect.Effect<
  DeleteApplicationResponse,
  | AccessDeniedException
  | BaseException
  | ConflictException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationRequest,
  output: DeleteApplicationResponse,
  errors: [
    AccessDeniedException,
    BaseException,
    ConflictException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a direct-query data source. For more information, see Deleting
 * an Amazon OpenSearch Service data source with Amazon S3.
 */
export const deleteDataSource: (
  input: DeleteDataSourceRequest,
) => effect.Effect<
  DeleteDataSourceResponse,
  | BaseException
  | DependencyFailureException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataSourceRequest,
  output: DeleteDataSourceResponse,
  errors: [
    BaseException,
    DependencyFailureException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Associates a package with an Amazon OpenSearch Service domain. For more information,
 * see Custom packages
 * for Amazon OpenSearch Service.
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
 * Modifies the cluster configuration of the specified Amazon OpenSearch Service
 * domain.
 */
export const updateDomainConfig: (
  input: UpdateDomainConfigRequest,
) => effect.Effect<
  UpdateDomainConfigResponse,
  | BaseException
  | InternalException
  | InvalidTypeException
  | LimitExceededException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDomainConfigRequest,
  output: UpdateDomainConfigResponse,
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
 * Retrieves a list of configuration changes that are scheduled for a domain. These
 * changes can be service
 * software updates or blue/green Auto-Tune enhancements.
 */
export const listScheduledActions: {
  (
    input: ListScheduledActionsRequest,
  ): effect.Effect<
    ListScheduledActionsResponse,
    | BaseException
    | InternalException
    | InvalidPaginationTokenException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListScheduledActionsRequest,
  ) => stream.Stream<
    ListScheduledActionsResponse,
    | BaseException
    | InternalException
    | InvalidPaginationTokenException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListScheduledActionsRequest,
  ) => stream.Stream<
    unknown,
    | BaseException
    | InternalException
    | InvalidPaginationTokenException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListScheduledActionsRequest,
  output: ListScheduledActionsResponse,
  errors: [
    BaseException,
    InternalException,
    InvalidPaginationTokenException,
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
 * Lists all the outbound cross-cluster connections for a local (source) Amazon
 * OpenSearch Service domain. For more information, see Cross-cluster search for Amazon OpenSearch Service.
 */
export const describeOutboundConnections: {
  (
    input: DescribeOutboundConnectionsRequest,
  ): effect.Effect<
    DescribeOutboundConnectionsResponse,
    DisabledOperationException | InvalidPaginationTokenException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeOutboundConnectionsRequest,
  ) => stream.Stream<
    DescribeOutboundConnectionsResponse,
    DisabledOperationException | InvalidPaginationTokenException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeOutboundConnectionsRequest,
  ) => stream.Stream<
    unknown,
    DisabledOperationException | InvalidPaginationTokenException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeOutboundConnectionsRequest,
  output: DescribeOutboundConnectionsResponse,
  errors: [DisabledOperationException, InvalidPaginationTokenException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the names of all Amazon OpenSearch Service domains owned by the current user
 * in the active Region.
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
 * Returns domain configuration information about the specified Amazon OpenSearch Service
 * domains.
 */
export const describeDomains: (
  input: DescribeDomainsRequest,
) => effect.Effect<
  DescribeDomainsResponse,
  BaseException | InternalException | ValidationException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDomainsRequest,
  output: DescribeDomainsResponse,
  errors: [BaseException, InternalException, ValidationException],
}));
/**
 * Removes the specified set of tags from an Amazon OpenSearch Service domain, data
 * source, or application. For more information, see Tagging Amazon OpenSearch Service resources.
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
 * Creates an OpenSearch UI application. For more information, see Using the OpenSearch user interface in Amazon OpenSearch Service.
 */
export const createApplication: (
  input: CreateApplicationRequest,
) => effect.Effect<
  CreateApplicationResponse,
  | AccessDeniedException
  | BaseException
  | ConflictException
  | DisabledOperationException
  | InternalException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationRequest,
  output: CreateApplicationResponse,
  errors: [
    AccessDeniedException,
    BaseException,
    ConflictException,
    DisabledOperationException,
    InternalException,
    ValidationException,
  ],
}));
/**
 * Attaches tags to an existing Amazon OpenSearch Service domain, data source, or
 * application.
 *
 * Tags are a set of case-sensitive key-value pairs. A domain, data source, or
 * application can have up to 10 tags. For more information, see Tagging Amazon OpenSearch Service resources.
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
 * Cancels a scheduled service software update for an Amazon OpenSearch Service domain.
 * You can only perform this operation before the `AutomatedUpdateDate` and when
 * the domain's `UpdateStatus` is `PENDING_UPDATE`. For more
 * information, see Service
 * software updates in Amazon OpenSearch Service.
 */
export const cancelServiceSoftwareUpdate: (
  input: CancelServiceSoftwareUpdateRequest,
) => effect.Effect<
  CancelServiceSoftwareUpdateResponse,
  | BaseException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelServiceSoftwareUpdateRequest,
  output: CancelServiceSoftwareUpdateResponse,
  errors: [
    BaseException,
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
 * Deletes an Amazon OpenSearch Service package. For more information, see Custom packages
 * for Amazon OpenSearch Service.
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
 * Returns information about the current blue/green deployment happening on an Amazon
 * OpenSearch Service domain. For more information, see Making configuration changes in Amazon OpenSearch Service.
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
 * Returns information about domain and node health, the standby Availability Zone,
 * number of nodes per Availability Zone, and shard count per node.
 */
export const describeDomainHealth: (
  input: DescribeDomainHealthRequest,
) => effect.Effect<
  DescribeDomainHealthResponse,
  | BaseException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDomainHealthRequest,
  output: DescribeDomainHealthResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes the progress of a pre-update dry run analysis on an Amazon OpenSearch
 * Service domain. For more information, see Determining whether a change will cause a blue/green deployment.
 */
export const describeDryRunProgress: (
  input: DescribeDryRunProgressRequest,
) => effect.Effect<
  DescribeDryRunProgressResponse,
  | BaseException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDryRunProgressRequest,
  output: DescribeDryRunProgressResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes the available Amazon OpenSearch Service Reserved Instance offerings for a
 * given Region. For more information, see Reserved Instances in Amazon
 * OpenSearch Service.
 */
export const describeReservedInstanceOfferings: {
  (
    input: DescribeReservedInstanceOfferingsRequest,
  ): effect.Effect<
    DescribeReservedInstanceOfferingsResponse,
    | DisabledOperationException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeReservedInstanceOfferingsRequest,
  ) => stream.Stream<
    DescribeReservedInstanceOfferingsResponse,
    | DisabledOperationException
    | InternalException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeReservedInstanceOfferingsRequest,
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
  input: DescribeReservedInstanceOfferingsRequest,
  output: DescribeReservedInstanceOfferingsResponse,
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
 * Creates a new cross-cluster search connection from a source Amazon OpenSearch Service domain
 * to a destination domain. For more information, see Cross-cluster search
 * for Amazon OpenSearch Service.
 */
export const createOutboundConnection: (
  input: CreateOutboundConnectionRequest,
) => effect.Effect<
  CreateOutboundConnectionResponse,
  | DisabledOperationException
  | InternalException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOutboundConnectionRequest,
  output: CreateOutboundConnectionResponse,
  errors: [
    DisabledOperationException,
    InternalException,
    LimitExceededException,
    ResourceAlreadyExistsException,
  ],
}));
/**
 * Creates a package for use with Amazon OpenSearch Service domains. For more
 * information, see Custom packages
 * for Amazon OpenSearch Service.
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
 * Creates an Amazon OpenSearch Service domain. For more information, see Creating and
 * managing Amazon OpenSearch Service domains.
 */
export const createDomain: (
  input: CreateDomainRequest,
) => effect.Effect<
  CreateDomainResponse,
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
  input: CreateDomainRequest,
  output: CreateDomainResponse,
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
 * Deletes an Amazon OpenSearch Service domain and all of its data. You can't recover a
 * domain after you delete it.
 */
export const deleteDomain: (
  input: DeleteDomainRequest,
) => effect.Effect<
  DeleteDomainResponse,
  | BaseException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainRequest,
  output: DeleteDomainResponse,
  errors: [
    BaseException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns the list of optimizations that Auto-Tune has made to an Amazon OpenSearch
 * Service domain. For more information, see Auto-Tune for Amazon
 * OpenSearch Service.
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
 * Returns the configuration of an Amazon OpenSearch Service domain.
 */
export const describeDomainConfig: (
  input: DescribeDomainConfigRequest,
) => effect.Effect<
  DescribeDomainConfigResponse,
  | BaseException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDomainConfigRequest,
  output: DescribeDomainConfigResponse,
  errors: [
    BaseException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Reschedules a planned domain configuration change for a later time. This change can be
 * a scheduled service
 * software update or a blue/green Auto-Tune enhancement.
 */
export const updateScheduledAction: (
  input: UpdateScheduledActionRequest,
) => effect.Effect<
  UpdateScheduledActionResponse,
  | BaseException
  | ConflictException
  | InternalException
  | LimitExceededException
  | ResourceNotFoundException
  | SlotNotAvailableException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateScheduledActionRequest,
  output: UpdateScheduledActionResponse,
  errors: [
    BaseException,
    ConflictException,
    InternalException,
    LimitExceededException,
    ResourceNotFoundException,
    SlotNotAvailableException,
    ValidationException,
  ],
}));
/**
 * Deletes an OpenSearch index. This operation permanently removes the index and cannot be undone.
 */
export const deleteIndex: (
  input: DeleteIndexRequest,
) => effect.Effect<
  DeleteIndexResponse,
  | AccessDeniedException
  | DependencyFailureException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIndexRequest,
  output: DeleteIndexResponse,
  errors: [
    AccessDeniedException,
    DependencyFailureException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about an OpenSearch index including its schema and semantic enrichment configuration. Use this operation to view the current index structure and semantic search settings.
 */
export const getIndex: (
  input: GetIndexRequest,
) => effect.Effect<
  GetIndexResponse,
  | AccessDeniedException
  | DependencyFailureException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIndexRequest,
  output: GetIndexResponse,
  errors: [
    AccessDeniedException,
    DependencyFailureException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an existing OpenSearch index schema and semantic enrichment configuration. This operation allows modification of field mappings and semantic search settings for text fields. Changes to semantic enrichment configuration will apply to newly ingested documents.
 */
export const updateIndex: (
  input: UpdateIndexRequest,
) => effect.Effect<
  UpdateIndexResponse,
  | AccessDeniedException
  | DependencyFailureException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIndexRequest,
  output: UpdateIndexResponse,
  errors: [
    AccessDeniedException,
    DependencyFailureException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an OpenSearch index with optional automatic semantic enrichment for specified text fields. Automatic semantic enrichment enables semantic search capabilities without requiring machine learning expertise, improving search relevance by up to 20% by understanding search intent and contextual meaning beyond keyword matching. The semantic enrichment process has zero impact on search latency as sparse encodings are stored directly within the index during indexing. For more information, see Automatic semantic enrichment.
 */
export const createIndex: (
  input: CreateIndexRequest,
) => effect.Effect<
  CreateIndexResponse,
  | AccessDeniedException
  | DependencyFailureException
  | DisabledOperationException
  | InternalException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIndexRequest,
  output: CreateIndexResponse,
  errors: [
    AccessDeniedException,
    DependencyFailureException,
    DisabledOperationException,
    InternalException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Describes the instance count, storage, and master node limits for a given OpenSearch
 * or Elasticsearch version and instance type.
 */
export const describeInstanceTypeLimits: (
  input: DescribeInstanceTypeLimitsRequest,
) => effect.Effect<
  DescribeInstanceTypeLimitsResponse,
  | BaseException
  | InternalException
  | InvalidTypeException
  | LimitExceededException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeInstanceTypeLimitsRequest,
  output: DescribeInstanceTypeLimitsResponse,
  errors: [
    BaseException,
    InternalException,
    InvalidTypeException,
    LimitExceededException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
