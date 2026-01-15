import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials as Creds } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "EMR containers",
  serviceShapeName: "AwsChicagoWebService",
});
const auth = T.AwsAuthSigv4({ name: "emr-containers" });
const ver = T.ServiceVersion("2020-10-01");
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
              `https://emr-containers-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (Region === "us-gov-east-1") {
              return e("https://emr-containers.us-gov-east-1.amazonaws.com");
            }
            if (Region === "us-gov-west-1") {
              return e("https://emr-containers.us-gov-west-1.amazonaws.com");
            }
            return e(
              `https://emr-containers-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://emr-containers.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://emr-containers.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ResourceIdString = string;
export type ResourceNameString = string;
export type ClientToken = string;
export type KmsKeyArn = string;
export type EndpointType = string;
export type ReleaseLabel = string;
export type IAMRoleArn = string;
export type ACMCertArn = string;
export type String2048 = string;
export type CredentialType = string;
export type JavaInteger = number;
export type LogContext = string;
export type NextToken = string;
export type RsiArn = string;
export type String1024 = string;
export type String128 = string;
export type ParametricIAMRoleArn = string;
export type ParametricReleaseLabel = string;
export type StringEmpty256 = string;
export type ClusterId = string;
export type TemplateParameterName = string;
export type VirtualClusterArn = string;
export type EntryPointPath = string | redacted.Redacted<string>;
export type EntryPointArgument = string | redacted.Redacted<string>;
export type SparkSubmitParameters = string | redacted.Redacted<string>;
export type SparkSqlParameters = string | redacted.Redacted<string>;
export type JobArn = string;
export type RequestIdentityUserArn = string;
export type String256 = string;
export type JobTemplateArn = string;
export type EndpointArn = string;
export type UriString = string;
export type SecurityConfigurationArn = string;
export type Token = string | redacted.Redacted<string>;
export type TemplateParameter = string;
export type LogGroupName = string;
export type RotationSize = string;
export type MaxFilesToKeep = number;
export type KubernetesNamespace = string;
export type SessionTagValue = string;
export type Base64Encoded = string;
export type SecretsManagerArn = string;

//# Schemas
export type JobRunState =
  | "PENDING"
  | "SUBMITTED"
  | "RUNNING"
  | "FAILED"
  | "CANCELLED"
  | "CANCEL_PENDING"
  | "COMPLETED"
  | (string & {});
export const JobRunState = S.String;
export type JobRunStates = JobRunState[];
export const JobRunStates = S.Array(JobRunState);
export type EndpointTypes = string[];
export const EndpointTypes = S.Array(S.String);
export type EndpointState =
  | "CREATING"
  | "ACTIVE"
  | "TERMINATING"
  | "TERMINATED"
  | "TERMINATED_WITH_ERRORS"
  | (string & {});
export const EndpointState = S.String;
export type EndpointStates = EndpointState[];
export const EndpointStates = S.Array(EndpointState);
export type ContainerProviderType = "EKS" | (string & {});
export const ContainerProviderType = S.String;
export type VirtualClusterState =
  | "RUNNING"
  | "TERMINATING"
  | "TERMINATED"
  | "ARRESTED"
  | (string & {});
export const VirtualClusterState = S.String;
export type VirtualClusterStates = VirtualClusterState[];
export const VirtualClusterStates = S.Array(VirtualClusterState);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface CancelJobRunRequest {
  id: string;
  virtualClusterId: string;
}
export const CancelJobRunRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    virtualClusterId: S.String.pipe(T.HttpLabel("virtualClusterId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/virtualclusters/{virtualClusterId}/jobruns/{id}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelJobRunRequest",
}) as any as S.Schema<CancelJobRunRequest>;
export interface EksInfo {
  namespace?: string;
  nodeLabel?: string;
}
export const EksInfo = S.suspend(() =>
  S.Struct({
    namespace: S.optional(S.String),
    nodeLabel: S.optional(S.String),
  }),
).annotations({ identifier: "EksInfo" }) as any as S.Schema<EksInfo>;
export type ContainerInfo = { eksInfo: EksInfo };
export const ContainerInfo = S.Union(S.Struct({ eksInfo: EksInfo }));
export interface ContainerProvider {
  type: ContainerProviderType;
  id: string;
  info?: ContainerInfo;
}
export const ContainerProvider = S.suspend(() =>
  S.Struct({
    type: ContainerProviderType,
    id: S.String,
    info: S.optional(ContainerInfo),
  }),
).annotations({
  identifier: "ContainerProvider",
}) as any as S.Schema<ContainerProvider>;
export type TagMap = { [key: string]: string | undefined };
export const TagMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface CreateVirtualClusterRequest {
  name: string;
  containerProvider: ContainerProvider;
  clientToken: string;
  tags?: { [key: string]: string | undefined };
  securityConfigurationId?: string;
}
export const CreateVirtualClusterRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    containerProvider: ContainerProvider,
    clientToken: S.String.pipe(T.IdempotencyToken()),
    tags: S.optional(TagMap),
    securityConfigurationId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/virtualclusters" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateVirtualClusterRequest",
}) as any as S.Schema<CreateVirtualClusterRequest>;
export interface DeleteJobTemplateRequest {
  id: string;
}
export const DeleteJobTemplateRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/jobtemplates/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteJobTemplateRequest",
}) as any as S.Schema<DeleteJobTemplateRequest>;
export interface DeleteManagedEndpointRequest {
  id: string;
  virtualClusterId: string;
}
export const DeleteManagedEndpointRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    virtualClusterId: S.String.pipe(T.HttpLabel("virtualClusterId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/virtualclusters/{virtualClusterId}/endpoints/{id}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteManagedEndpointRequest",
}) as any as S.Schema<DeleteManagedEndpointRequest>;
export interface DeleteVirtualClusterRequest {
  id: string;
}
export const DeleteVirtualClusterRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/virtualclusters/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteVirtualClusterRequest",
}) as any as S.Schema<DeleteVirtualClusterRequest>;
export interface DescribeJobRunRequest {
  id: string;
  virtualClusterId: string;
}
export const DescribeJobRunRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    virtualClusterId: S.String.pipe(T.HttpLabel("virtualClusterId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/virtualclusters/{virtualClusterId}/jobruns/{id}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeJobRunRequest",
}) as any as S.Schema<DescribeJobRunRequest>;
export interface DescribeJobTemplateRequest {
  id: string;
}
export const DescribeJobTemplateRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/jobtemplates/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeJobTemplateRequest",
}) as any as S.Schema<DescribeJobTemplateRequest>;
export interface DescribeManagedEndpointRequest {
  id: string;
  virtualClusterId: string;
}
export const DescribeManagedEndpointRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    virtualClusterId: S.String.pipe(T.HttpLabel("virtualClusterId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/virtualclusters/{virtualClusterId}/endpoints/{id}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeManagedEndpointRequest",
}) as any as S.Schema<DescribeManagedEndpointRequest>;
export interface DescribeSecurityConfigurationRequest {
  id: string;
}
export const DescribeSecurityConfigurationRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/securityconfigurations/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSecurityConfigurationRequest",
}) as any as S.Schema<DescribeSecurityConfigurationRequest>;
export interface DescribeVirtualClusterRequest {
  id: string;
}
export const DescribeVirtualClusterRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/virtualclusters/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeVirtualClusterRequest",
}) as any as S.Schema<DescribeVirtualClusterRequest>;
export interface GetManagedEndpointSessionCredentialsRequest {
  endpointIdentifier: string;
  virtualClusterIdentifier: string;
  executionRoleArn: string;
  credentialType: string;
  durationInSeconds?: number;
  logContext?: string;
  clientToken?: string;
}
export const GetManagedEndpointSessionCredentialsRequest = S.suspend(() =>
  S.Struct({
    endpointIdentifier: S.String.pipe(T.HttpLabel("endpointIdentifier")),
    virtualClusterIdentifier: S.String.pipe(
      T.HttpLabel("virtualClusterIdentifier"),
    ),
    executionRoleArn: S.String,
    credentialType: S.String,
    durationInSeconds: S.optional(S.Number),
    logContext: S.optional(S.String),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/virtualclusters/{virtualClusterIdentifier}/endpoints/{endpointIdentifier}/credentials",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetManagedEndpointSessionCredentialsRequest",
}) as any as S.Schema<GetManagedEndpointSessionCredentialsRequest>;
export interface ListJobRunsRequest {
  virtualClusterId: string;
  createdBefore?: Date;
  createdAfter?: Date;
  name?: string;
  states?: JobRunState[];
  maxResults?: number;
  nextToken?: string;
}
export const ListJobRunsRequest = S.suspend(() =>
  S.Struct({
    virtualClusterId: S.String.pipe(T.HttpLabel("virtualClusterId")),
    createdBefore: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("createdBefore"),
    ),
    createdAfter: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("createdAfter"),
    ),
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
    states: S.optional(JobRunStates).pipe(T.HttpQuery("states")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/virtualclusters/{virtualClusterId}/jobruns",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListJobRunsRequest",
}) as any as S.Schema<ListJobRunsRequest>;
export interface ListJobTemplatesRequest {
  createdAfter?: Date;
  createdBefore?: Date;
  maxResults?: number;
  nextToken?: string;
}
export const ListJobTemplatesRequest = S.suspend(() =>
  S.Struct({
    createdAfter: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("createdAfter"),
    ),
    createdBefore: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("createdBefore"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/jobtemplates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListJobTemplatesRequest",
}) as any as S.Schema<ListJobTemplatesRequest>;
export interface ListManagedEndpointsRequest {
  virtualClusterId: string;
  createdBefore?: Date;
  createdAfter?: Date;
  types?: string[];
  states?: EndpointState[];
  maxResults?: number;
  nextToken?: string;
}
export const ListManagedEndpointsRequest = S.suspend(() =>
  S.Struct({
    virtualClusterId: S.String.pipe(T.HttpLabel("virtualClusterId")),
    createdBefore: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("createdBefore"),
    ),
    createdAfter: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("createdAfter"),
    ),
    types: S.optional(EndpointTypes).pipe(T.HttpQuery("types")),
    states: S.optional(EndpointStates).pipe(T.HttpQuery("states")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/virtualclusters/{virtualClusterId}/endpoints",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListManagedEndpointsRequest",
}) as any as S.Schema<ListManagedEndpointsRequest>;
export interface ListSecurityConfigurationsRequest {
  createdAfter?: Date;
  createdBefore?: Date;
  maxResults?: number;
  nextToken?: string;
}
export const ListSecurityConfigurationsRequest = S.suspend(() =>
  S.Struct({
    createdAfter: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("createdAfter"),
    ),
    createdBefore: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("createdBefore"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/securityconfigurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSecurityConfigurationsRequest",
}) as any as S.Schema<ListSecurityConfigurationsRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
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
export interface ListVirtualClustersRequest {
  containerProviderId?: string;
  containerProviderType?: ContainerProviderType;
  createdAfter?: Date;
  createdBefore?: Date;
  states?: VirtualClusterState[];
  maxResults?: number;
  nextToken?: string;
  eksAccessEntryIntegrated?: boolean;
}
export const ListVirtualClustersRequest = S.suspend(() =>
  S.Struct({
    containerProviderId: S.optional(S.String).pipe(
      T.HttpQuery("containerProviderId"),
    ),
    containerProviderType: S.optional(ContainerProviderType).pipe(
      T.HttpQuery("containerProviderType"),
    ),
    createdAfter: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("createdAfter"),
    ),
    createdBefore: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("createdBefore"),
    ),
    states: S.optional(VirtualClusterStates).pipe(T.HttpQuery("states")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    eksAccessEntryIntegrated: S.optional(S.Boolean).pipe(
      T.HttpQuery("eksAccessEntryIntegrated"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/virtualclusters" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVirtualClustersRequest",
}) as any as S.Schema<ListVirtualClustersRequest>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagMap,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
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
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type ConfigurationList = Configuration[];
export const ConfigurationList = S.Array(
  S.suspend((): S.Schema<Configuration, any> => Configuration).annotations({
    identifier: "Configuration",
  }),
) as any as S.Schema<ConfigurationList>;
export type AllowAWSToRetainLogs = "ENABLED" | "DISABLED" | (string & {});
export const AllowAWSToRetainLogs = S.String;
export interface ManagedLogs {
  allowAWSToRetainLogs?: AllowAWSToRetainLogs;
  encryptionKeyArn?: string;
}
export const ManagedLogs = S.suspend(() =>
  S.Struct({
    allowAWSToRetainLogs: S.optional(AllowAWSToRetainLogs),
    encryptionKeyArn: S.optional(S.String),
  }),
).annotations({ identifier: "ManagedLogs" }) as any as S.Schema<ManagedLogs>;
export type PersistentAppUI = "ENABLED" | "DISABLED" | (string & {});
export const PersistentAppUI = S.String;
export interface CloudWatchMonitoringConfiguration {
  logGroupName: string;
  logStreamNamePrefix?: string;
}
export const CloudWatchMonitoringConfiguration = S.suspend(() =>
  S.Struct({
    logGroupName: S.String,
    logStreamNamePrefix: S.optional(S.String),
  }),
).annotations({
  identifier: "CloudWatchMonitoringConfiguration",
}) as any as S.Schema<CloudWatchMonitoringConfiguration>;
export interface S3MonitoringConfiguration {
  logUri: string;
}
export const S3MonitoringConfiguration = S.suspend(() =>
  S.Struct({ logUri: S.String }),
).annotations({
  identifier: "S3MonitoringConfiguration",
}) as any as S.Schema<S3MonitoringConfiguration>;
export interface ContainerLogRotationConfiguration {
  rotationSize: string;
  maxFilesToKeep: number;
}
export const ContainerLogRotationConfiguration = S.suspend(() =>
  S.Struct({ rotationSize: S.String, maxFilesToKeep: S.Number }),
).annotations({
  identifier: "ContainerLogRotationConfiguration",
}) as any as S.Schema<ContainerLogRotationConfiguration>;
export interface MonitoringConfiguration {
  managedLogs?: ManagedLogs;
  persistentAppUI?: PersistentAppUI;
  cloudWatchMonitoringConfiguration?: CloudWatchMonitoringConfiguration;
  s3MonitoringConfiguration?: S3MonitoringConfiguration;
  containerLogRotationConfiguration?: ContainerLogRotationConfiguration;
}
export const MonitoringConfiguration = S.suspend(() =>
  S.Struct({
    managedLogs: S.optional(ManagedLogs),
    persistentAppUI: S.optional(PersistentAppUI),
    cloudWatchMonitoringConfiguration: S.optional(
      CloudWatchMonitoringConfiguration,
    ),
    s3MonitoringConfiguration: S.optional(S3MonitoringConfiguration),
    containerLogRotationConfiguration: S.optional(
      ContainerLogRotationConfiguration,
    ),
  }),
).annotations({
  identifier: "MonitoringConfiguration",
}) as any as S.Schema<MonitoringConfiguration>;
export interface ConfigurationOverrides {
  applicationConfiguration?: Configuration[];
  monitoringConfiguration?: MonitoringConfiguration;
}
export const ConfigurationOverrides = S.suspend(() =>
  S.Struct({
    applicationConfiguration: S.optional(ConfigurationList),
    monitoringConfiguration: S.optional(MonitoringConfiguration),
  }),
).annotations({
  identifier: "ConfigurationOverrides",
}) as any as S.Schema<ConfigurationOverrides>;
export type EntryPointArguments = string | redacted.Redacted<string>[];
export const EntryPointArguments = S.Array(SensitiveString);
export interface SparkSubmitJobDriver {
  entryPoint: string | redacted.Redacted<string>;
  entryPointArguments?: string | redacted.Redacted<string>[];
  sparkSubmitParameters?: string | redacted.Redacted<string>;
}
export const SparkSubmitJobDriver = S.suspend(() =>
  S.Struct({
    entryPoint: SensitiveString,
    entryPointArguments: S.optional(EntryPointArguments),
    sparkSubmitParameters: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "SparkSubmitJobDriver",
}) as any as S.Schema<SparkSubmitJobDriver>;
export interface SparkSqlJobDriver {
  entryPoint?: string | redacted.Redacted<string>;
  sparkSqlParameters?: string | redacted.Redacted<string>;
}
export const SparkSqlJobDriver = S.suspend(() =>
  S.Struct({
    entryPoint: S.optional(SensitiveString),
    sparkSqlParameters: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "SparkSqlJobDriver",
}) as any as S.Schema<SparkSqlJobDriver>;
export interface JobDriver {
  sparkSubmitJobDriver?: SparkSubmitJobDriver;
  sparkSqlJobDriver?: SparkSqlJobDriver;
}
export const JobDriver = S.suspend(() =>
  S.Struct({
    sparkSubmitJobDriver: S.optional(SparkSubmitJobDriver),
    sparkSqlJobDriver: S.optional(SparkSqlJobDriver),
  }),
).annotations({ identifier: "JobDriver" }) as any as S.Schema<JobDriver>;
export type FailureReason =
  | "INTERNAL_ERROR"
  | "USER_ERROR"
  | "VALIDATION_ERROR"
  | "CLUSTER_UNAVAILABLE"
  | (string & {});
export const FailureReason = S.String;
export interface RetryPolicyConfiguration {
  maxAttempts: number;
}
export const RetryPolicyConfiguration = S.suspend(() =>
  S.Struct({ maxAttempts: S.Number }),
).annotations({
  identifier: "RetryPolicyConfiguration",
}) as any as S.Schema<RetryPolicyConfiguration>;
export interface RetryPolicyExecution {
  currentAttemptCount: number;
}
export const RetryPolicyExecution = S.suspend(() =>
  S.Struct({ currentAttemptCount: S.Number }),
).annotations({
  identifier: "RetryPolicyExecution",
}) as any as S.Schema<RetryPolicyExecution>;
export interface JobRun {
  id?: string;
  name?: string;
  virtualClusterId?: string;
  arn?: string;
  state?: JobRunState;
  clientToken?: string;
  executionRoleArn?: string;
  releaseLabel?: string;
  configurationOverrides?: ConfigurationOverrides;
  jobDriver?: JobDriver;
  createdAt?: Date;
  createdBy?: string;
  finishedAt?: Date;
  stateDetails?: string;
  failureReason?: FailureReason;
  tags?: { [key: string]: string | undefined };
  retryPolicyConfiguration?: RetryPolicyConfiguration;
  retryPolicyExecution?: RetryPolicyExecution;
}
export const JobRun = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    virtualClusterId: S.optional(S.String),
    arn: S.optional(S.String),
    state: S.optional(JobRunState),
    clientToken: S.optional(S.String),
    executionRoleArn: S.optional(S.String),
    releaseLabel: S.optional(S.String),
    configurationOverrides: S.optional(ConfigurationOverrides),
    jobDriver: S.optional(JobDriver),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    createdBy: S.optional(S.String),
    finishedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    stateDetails: S.optional(S.String),
    failureReason: S.optional(FailureReason),
    tags: S.optional(TagMap),
    retryPolicyConfiguration: S.optional(RetryPolicyConfiguration),
    retryPolicyExecution: S.optional(RetryPolicyExecution),
  }),
).annotations({ identifier: "JobRun" }) as any as S.Schema<JobRun>;
export type JobRuns = JobRun[];
export const JobRuns = S.Array(JobRun);
export interface ParametricCloudWatchMonitoringConfiguration {
  logGroupName?: string;
  logStreamNamePrefix?: string;
}
export const ParametricCloudWatchMonitoringConfiguration = S.suspend(() =>
  S.Struct({
    logGroupName: S.optional(S.String),
    logStreamNamePrefix: S.optional(S.String),
  }),
).annotations({
  identifier: "ParametricCloudWatchMonitoringConfiguration",
}) as any as S.Schema<ParametricCloudWatchMonitoringConfiguration>;
export interface ParametricS3MonitoringConfiguration {
  logUri?: string;
}
export const ParametricS3MonitoringConfiguration = S.suspend(() =>
  S.Struct({ logUri: S.optional(S.String) }),
).annotations({
  identifier: "ParametricS3MonitoringConfiguration",
}) as any as S.Schema<ParametricS3MonitoringConfiguration>;
export interface ParametricMonitoringConfiguration {
  persistentAppUI?: string;
  cloudWatchMonitoringConfiguration?: ParametricCloudWatchMonitoringConfiguration;
  s3MonitoringConfiguration?: ParametricS3MonitoringConfiguration;
}
export const ParametricMonitoringConfiguration = S.suspend(() =>
  S.Struct({
    persistentAppUI: S.optional(S.String),
    cloudWatchMonitoringConfiguration: S.optional(
      ParametricCloudWatchMonitoringConfiguration,
    ),
    s3MonitoringConfiguration: S.optional(ParametricS3MonitoringConfiguration),
  }),
).annotations({
  identifier: "ParametricMonitoringConfiguration",
}) as any as S.Schema<ParametricMonitoringConfiguration>;
export interface ParametricConfigurationOverrides {
  applicationConfiguration?: Configuration[];
  monitoringConfiguration?: ParametricMonitoringConfiguration;
}
export const ParametricConfigurationOverrides = S.suspend(() =>
  S.Struct({
    applicationConfiguration: S.optional(ConfigurationList),
    monitoringConfiguration: S.optional(ParametricMonitoringConfiguration),
  }),
).annotations({
  identifier: "ParametricConfigurationOverrides",
}) as any as S.Schema<ParametricConfigurationOverrides>;
export type TemplateParameterDataType = "NUMBER" | "STRING" | (string & {});
export const TemplateParameterDataType = S.String;
export interface TemplateParameterConfiguration {
  type?: TemplateParameterDataType;
  defaultValue?: string;
}
export const TemplateParameterConfiguration = S.suspend(() =>
  S.Struct({
    type: S.optional(TemplateParameterDataType),
    defaultValue: S.optional(S.String),
  }),
).annotations({
  identifier: "TemplateParameterConfiguration",
}) as any as S.Schema<TemplateParameterConfiguration>;
export type TemplateParameterConfigurationMap = {
  [key: string]: TemplateParameterConfiguration | undefined;
};
export const TemplateParameterConfigurationMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(TemplateParameterConfiguration),
});
export interface JobTemplateData {
  executionRoleArn: string;
  releaseLabel: string;
  configurationOverrides?: ParametricConfigurationOverrides;
  jobDriver: JobDriver;
  parameterConfiguration?: {
    [key: string]: TemplateParameterConfiguration | undefined;
  };
  jobTags?: { [key: string]: string | undefined };
}
export const JobTemplateData = S.suspend(() =>
  S.Struct({
    executionRoleArn: S.String,
    releaseLabel: S.String,
    configurationOverrides: S.optional(ParametricConfigurationOverrides),
    jobDriver: JobDriver,
    parameterConfiguration: S.optional(TemplateParameterConfigurationMap),
    jobTags: S.optional(TagMap),
  }),
).annotations({
  identifier: "JobTemplateData",
}) as any as S.Schema<JobTemplateData>;
export interface JobTemplate {
  name?: string;
  id?: string;
  arn?: string;
  createdAt?: Date;
  createdBy?: string;
  tags?: { [key: string]: string | undefined };
  jobTemplateData: JobTemplateData;
  kmsKeyArn?: string;
  decryptionError?: string;
}
export const JobTemplate = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    id: S.optional(S.String),
    arn: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    createdBy: S.optional(S.String),
    tags: S.optional(TagMap),
    jobTemplateData: JobTemplateData,
    kmsKeyArn: S.optional(S.String),
    decryptionError: S.optional(S.String),
  }),
).annotations({ identifier: "JobTemplate" }) as any as S.Schema<JobTemplate>;
export type JobTemplates = JobTemplate[];
export const JobTemplates = S.Array(JobTemplate);
export interface Certificate {
  certificateArn?: string;
  certificateData?: string;
}
export const Certificate = S.suspend(() =>
  S.Struct({
    certificateArn: S.optional(S.String),
    certificateData: S.optional(S.String),
  }),
).annotations({ identifier: "Certificate" }) as any as S.Schema<Certificate>;
export type SubnetIds = string[];
export const SubnetIds = S.Array(S.String);
export interface Endpoint {
  id?: string;
  name?: string;
  arn?: string;
  virtualClusterId?: string;
  type?: string;
  state?: EndpointState;
  releaseLabel?: string;
  executionRoleArn?: string;
  certificateArn?: string;
  certificateAuthority?: Certificate;
  configurationOverrides?: ConfigurationOverrides;
  serverUrl?: string;
  createdAt?: Date;
  securityGroup?: string;
  subnetIds?: string[];
  stateDetails?: string;
  failureReason?: FailureReason;
  tags?: { [key: string]: string | undefined };
}
export const Endpoint = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    arn: S.optional(S.String),
    virtualClusterId: S.optional(S.String),
    type: S.optional(S.String),
    state: S.optional(EndpointState),
    releaseLabel: S.optional(S.String),
    executionRoleArn: S.optional(S.String),
    certificateArn: S.optional(S.String),
    certificateAuthority: S.optional(Certificate),
    configurationOverrides: S.optional(ConfigurationOverrides),
    serverUrl: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    securityGroup: S.optional(S.String),
    subnetIds: S.optional(SubnetIds),
    stateDetails: S.optional(S.String),
    failureReason: S.optional(FailureReason),
    tags: S.optional(TagMap),
  }),
).annotations({ identifier: "Endpoint" }) as any as S.Schema<Endpoint>;
export type Endpoints = Endpoint[];
export const Endpoints = S.Array(Endpoint);
export interface SecureNamespaceInfo {
  clusterId?: string;
  namespace?: string;
}
export const SecureNamespaceInfo = S.suspend(() =>
  S.Struct({
    clusterId: S.optional(S.String),
    namespace: S.optional(S.String),
  }),
).annotations({
  identifier: "SecureNamespaceInfo",
}) as any as S.Schema<SecureNamespaceInfo>;
export interface LakeFormationConfiguration {
  authorizedSessionTagValue?: string;
  secureNamespaceInfo?: SecureNamespaceInfo;
  queryEngineRoleArn?: string;
}
export const LakeFormationConfiguration = S.suspend(() =>
  S.Struct({
    authorizedSessionTagValue: S.optional(S.String),
    secureNamespaceInfo: S.optional(SecureNamespaceInfo),
    queryEngineRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "LakeFormationConfiguration",
}) as any as S.Schema<LakeFormationConfiguration>;
export type CertificateProviderType = "PEM" | (string & {});
export const CertificateProviderType = S.String;
export interface TLSCertificateConfiguration {
  certificateProviderType?: CertificateProviderType;
  publicCertificateSecretArn?: string;
  privateCertificateSecretArn?: string;
}
export const TLSCertificateConfiguration = S.suspend(() =>
  S.Struct({
    certificateProviderType: S.optional(CertificateProviderType),
    publicCertificateSecretArn: S.optional(S.String),
    privateCertificateSecretArn: S.optional(S.String),
  }),
).annotations({
  identifier: "TLSCertificateConfiguration",
}) as any as S.Schema<TLSCertificateConfiguration>;
export interface InTransitEncryptionConfiguration {
  tlsCertificateConfiguration?: TLSCertificateConfiguration;
}
export const InTransitEncryptionConfiguration = S.suspend(() =>
  S.Struct({
    tlsCertificateConfiguration: S.optional(TLSCertificateConfiguration),
  }),
).annotations({
  identifier: "InTransitEncryptionConfiguration",
}) as any as S.Schema<InTransitEncryptionConfiguration>;
export interface EncryptionConfiguration {
  inTransitEncryptionConfiguration?: InTransitEncryptionConfiguration;
}
export const EncryptionConfiguration = S.suspend(() =>
  S.Struct({
    inTransitEncryptionConfiguration: S.optional(
      InTransitEncryptionConfiguration,
    ),
  }),
).annotations({
  identifier: "EncryptionConfiguration",
}) as any as S.Schema<EncryptionConfiguration>;
export interface AuthorizationConfiguration {
  lakeFormationConfiguration?: LakeFormationConfiguration;
  encryptionConfiguration?: EncryptionConfiguration;
}
export const AuthorizationConfiguration = S.suspend(() =>
  S.Struct({
    lakeFormationConfiguration: S.optional(LakeFormationConfiguration),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
  }),
).annotations({
  identifier: "AuthorizationConfiguration",
}) as any as S.Schema<AuthorizationConfiguration>;
export interface SecurityConfigurationData {
  authorizationConfiguration?: AuthorizationConfiguration;
}
export const SecurityConfigurationData = S.suspend(() =>
  S.Struct({
    authorizationConfiguration: S.optional(AuthorizationConfiguration),
  }),
).annotations({
  identifier: "SecurityConfigurationData",
}) as any as S.Schema<SecurityConfigurationData>;
export interface SecurityConfiguration {
  id?: string;
  name?: string;
  arn?: string;
  createdAt?: Date;
  createdBy?: string;
  securityConfigurationData?: SecurityConfigurationData;
  tags?: { [key: string]: string | undefined };
}
export const SecurityConfiguration = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    arn: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    createdBy: S.optional(S.String),
    securityConfigurationData: S.optional(SecurityConfigurationData),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "SecurityConfiguration",
}) as any as S.Schema<SecurityConfiguration>;
export type SecurityConfigurations = SecurityConfiguration[];
export const SecurityConfigurations = S.Array(SecurityConfiguration);
export interface VirtualCluster {
  id?: string;
  name?: string;
  arn?: string;
  state?: VirtualClusterState;
  containerProvider?: ContainerProvider;
  createdAt?: Date;
  tags?: { [key: string]: string | undefined };
  securityConfigurationId?: string;
}
export const VirtualCluster = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    arn: S.optional(S.String),
    state: S.optional(VirtualClusterState),
    containerProvider: S.optional(ContainerProvider),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    tags: S.optional(TagMap),
    securityConfigurationId: S.optional(S.String),
  }),
).annotations({
  identifier: "VirtualCluster",
}) as any as S.Schema<VirtualCluster>;
export type VirtualClusters = VirtualCluster[];
export const VirtualClusters = S.Array(VirtualCluster);
export type TemplateParameterInputMap = { [key: string]: string | undefined };
export const TemplateParameterInputMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface CancelJobRunResponse {
  id?: string;
  virtualClusterId?: string;
}
export const CancelJobRunResponse = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    virtualClusterId: S.optional(S.String),
  }),
).annotations({
  identifier: "CancelJobRunResponse",
}) as any as S.Schema<CancelJobRunResponse>;
export interface CreateVirtualClusterResponse {
  id?: string;
  name?: string;
  arn?: string;
}
export const CreateVirtualClusterResponse = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    arn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateVirtualClusterResponse",
}) as any as S.Schema<CreateVirtualClusterResponse>;
export interface DeleteJobTemplateResponse {
  id?: string;
}
export const DeleteJobTemplateResponse = S.suspend(() =>
  S.Struct({ id: S.optional(S.String) }),
).annotations({
  identifier: "DeleteJobTemplateResponse",
}) as any as S.Schema<DeleteJobTemplateResponse>;
export interface DeleteManagedEndpointResponse {
  id?: string;
  virtualClusterId?: string;
}
export const DeleteManagedEndpointResponse = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    virtualClusterId: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteManagedEndpointResponse",
}) as any as S.Schema<DeleteManagedEndpointResponse>;
export interface DeleteVirtualClusterResponse {
  id?: string;
}
export const DeleteVirtualClusterResponse = S.suspend(() =>
  S.Struct({ id: S.optional(S.String) }),
).annotations({
  identifier: "DeleteVirtualClusterResponse",
}) as any as S.Schema<DeleteVirtualClusterResponse>;
export interface ListJobRunsResponse {
  jobRuns?: JobRun[];
  nextToken?: string;
}
export const ListJobRunsResponse = S.suspend(() =>
  S.Struct({ jobRuns: S.optional(JobRuns), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListJobRunsResponse",
}) as any as S.Schema<ListJobRunsResponse>;
export interface ListJobTemplatesResponse {
  templates?: JobTemplate[];
  nextToken?: string;
}
export const ListJobTemplatesResponse = S.suspend(() =>
  S.Struct({
    templates: S.optional(JobTemplates),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListJobTemplatesResponse",
}) as any as S.Schema<ListJobTemplatesResponse>;
export interface ListManagedEndpointsResponse {
  endpoints?: Endpoint[];
  nextToken?: string;
}
export const ListManagedEndpointsResponse = S.suspend(() =>
  S.Struct({
    endpoints: S.optional(Endpoints),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListManagedEndpointsResponse",
}) as any as S.Schema<ListManagedEndpointsResponse>;
export interface ListSecurityConfigurationsResponse {
  securityConfigurations?: SecurityConfiguration[];
  nextToken?: string;
}
export const ListSecurityConfigurationsResponse = S.suspend(() =>
  S.Struct({
    securityConfigurations: S.optional(SecurityConfigurations),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSecurityConfigurationsResponse",
}) as any as S.Schema<ListSecurityConfigurationsResponse>;
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ListVirtualClustersResponse {
  virtualClusters?: VirtualCluster[];
  nextToken?: string;
}
export const ListVirtualClustersResponse = S.suspend(() =>
  S.Struct({
    virtualClusters: S.optional(VirtualClusters),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListVirtualClustersResponse",
}) as any as S.Schema<ListVirtualClustersResponse>;
export type Credentials = { token: string | redacted.Redacted<string> };
export const Credentials = S.Union(S.Struct({ token: SensitiveString }));
export type SensitivePropertiesMap = { [key: string]: string | undefined };
export const SensitivePropertiesMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface DescribeJobTemplateResponse {
  jobTemplate?: JobTemplate;
}
export const DescribeJobTemplateResponse = S.suspend(() =>
  S.Struct({ jobTemplate: S.optional(JobTemplate) }),
).annotations({
  identifier: "DescribeJobTemplateResponse",
}) as any as S.Schema<DescribeJobTemplateResponse>;
export interface DescribeSecurityConfigurationResponse {
  securityConfiguration?: SecurityConfiguration;
}
export const DescribeSecurityConfigurationResponse = S.suspend(() =>
  S.Struct({ securityConfiguration: S.optional(SecurityConfiguration) }),
).annotations({
  identifier: "DescribeSecurityConfigurationResponse",
}) as any as S.Schema<DescribeSecurityConfigurationResponse>;
export interface DescribeVirtualClusterResponse {
  virtualCluster?: VirtualCluster;
}
export const DescribeVirtualClusterResponse = S.suspend(() =>
  S.Struct({ virtualCluster: S.optional(VirtualCluster) }),
).annotations({
  identifier: "DescribeVirtualClusterResponse",
}) as any as S.Schema<DescribeVirtualClusterResponse>;
export interface GetManagedEndpointSessionCredentialsResponse {
  id?: string;
  credentials?: Credentials;
  expiresAt?: Date;
}
export const GetManagedEndpointSessionCredentialsResponse = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    credentials: S.optional(Credentials),
    expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "GetManagedEndpointSessionCredentialsResponse",
}) as any as S.Schema<GetManagedEndpointSessionCredentialsResponse>;
export interface StartJobRunRequest {
  name?: string;
  virtualClusterId: string;
  clientToken: string;
  executionRoleArn?: string;
  releaseLabel?: string;
  jobDriver?: JobDriver;
  configurationOverrides?: ConfigurationOverrides;
  tags?: { [key: string]: string | undefined };
  jobTemplateId?: string;
  jobTemplateParameters?: { [key: string]: string | undefined };
  retryPolicyConfiguration?: RetryPolicyConfiguration;
}
export const StartJobRunRequest = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    virtualClusterId: S.String.pipe(T.HttpLabel("virtualClusterId")),
    clientToken: S.String.pipe(T.IdempotencyToken()),
    executionRoleArn: S.optional(S.String),
    releaseLabel: S.optional(S.String),
    jobDriver: S.optional(JobDriver),
    configurationOverrides: S.optional(ConfigurationOverrides),
    tags: S.optional(TagMap),
    jobTemplateId: S.optional(S.String),
    jobTemplateParameters: S.optional(TemplateParameterInputMap),
    retryPolicyConfiguration: S.optional(RetryPolicyConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/virtualclusters/{virtualClusterId}/jobruns",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartJobRunRequest",
}) as any as S.Schema<StartJobRunRequest>;
export interface Configuration {
  classification: string;
  properties?: { [key: string]: string | undefined };
  configurations?: Configuration[];
}
export const Configuration = S.suspend(() =>
  S.Struct({
    classification: S.String,
    properties: S.optional(SensitivePropertiesMap),
    configurations: S.optional(
      S.suspend(() => ConfigurationList).annotations({
        identifier: "ConfigurationList",
      }),
    ),
  }),
).annotations({
  identifier: "Configuration",
}) as any as S.Schema<Configuration>;
export interface CreateManagedEndpointRequest {
  name: string;
  virtualClusterId: string;
  type: string;
  releaseLabel: string;
  executionRoleArn: string;
  certificateArn?: string;
  configurationOverrides?: ConfigurationOverrides;
  clientToken: string;
  tags?: { [key: string]: string | undefined };
}
export const CreateManagedEndpointRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    virtualClusterId: S.String.pipe(T.HttpLabel("virtualClusterId")),
    type: S.String,
    releaseLabel: S.String,
    executionRoleArn: S.String,
    certificateArn: S.optional(S.String),
    configurationOverrides: S.optional(ConfigurationOverrides),
    clientToken: S.String.pipe(T.IdempotencyToken()),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/virtualclusters/{virtualClusterId}/endpoints",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateManagedEndpointRequest",
}) as any as S.Schema<CreateManagedEndpointRequest>;
export interface DescribeJobRunResponse {
  jobRun?: JobRun;
}
export const DescribeJobRunResponse = S.suspend(() =>
  S.Struct({ jobRun: S.optional(JobRun) }),
).annotations({
  identifier: "DescribeJobRunResponse",
}) as any as S.Schema<DescribeJobRunResponse>;
export interface DescribeManagedEndpointResponse {
  endpoint?: Endpoint;
}
export const DescribeManagedEndpointResponse = S.suspend(() =>
  S.Struct({ endpoint: S.optional(Endpoint) }),
).annotations({
  identifier: "DescribeManagedEndpointResponse",
}) as any as S.Schema<DescribeManagedEndpointResponse>;
export interface StartJobRunResponse {
  id?: string;
  name?: string;
  arn?: string;
  virtualClusterId?: string;
}
export const StartJobRunResponse = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    arn: S.optional(S.String),
    virtualClusterId: S.optional(S.String),
  }),
).annotations({
  identifier: "StartJobRunResponse",
}) as any as S.Schema<StartJobRunResponse>;
export interface CreateJobTemplateRequest {
  name: string;
  clientToken: string;
  jobTemplateData: JobTemplateData;
  tags?: { [key: string]: string | undefined };
  kmsKeyArn?: string;
}
export const CreateJobTemplateRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    clientToken: S.String.pipe(T.IdempotencyToken()),
    jobTemplateData: JobTemplateData,
    tags: S.optional(TagMap),
    kmsKeyArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/jobtemplates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateJobTemplateRequest",
}) as any as S.Schema<CreateJobTemplateRequest>;
export interface CreateManagedEndpointResponse {
  id?: string;
  name?: string;
  arn?: string;
  virtualClusterId?: string;
}
export const CreateManagedEndpointResponse = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    arn: S.optional(S.String),
    virtualClusterId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateManagedEndpointResponse",
}) as any as S.Schema<CreateManagedEndpointResponse>;
export interface CreateJobTemplateResponse {
  id?: string;
  name?: string;
  arn?: string;
  createdAt?: Date;
}
export const CreateJobTemplateResponse = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    arn: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "CreateJobTemplateResponse",
}) as any as S.Schema<CreateJobTemplateResponse>;
export interface CreateSecurityConfigurationRequest {
  clientToken: string;
  name: string;
  containerProvider?: ContainerProvider;
  securityConfigurationData: SecurityConfigurationData;
  tags?: { [key: string]: string | undefined };
}
export const CreateSecurityConfigurationRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.String.pipe(T.IdempotencyToken()),
    name: S.String,
    containerProvider: S.optional(ContainerProvider),
    securityConfigurationData: SecurityConfigurationData,
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/securityconfigurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSecurityConfigurationRequest",
}) as any as S.Schema<CreateSecurityConfigurationRequest>;
export interface CreateSecurityConfigurationResponse {
  id?: string;
  name?: string;
  arn?: string;
}
export const CreateSecurityConfigurationResponse = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    arn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateSecurityConfigurationResponse",
}) as any as S.Schema<CreateSecurityConfigurationResponse>;

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class EKSRequestThrottledException extends S.TaggedError<EKSRequestThrottledException>()(
  "EKSRequestThrottledException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class RequestThrottledException extends S.TaggedError<RequestThrottledException>()(
  "RequestThrottledException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Cancels a job run. A job run is a unit of work, such as a Spark jar, PySpark script, or
 * SparkSQL query, that you submit to Amazon EMR on EKS.
 */
export const cancelJobRun: (
  input: CancelJobRunRequest,
) => effect.Effect<
  CancelJobRunResponse,
  InternalServerException | ValidationException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelJobRunRequest,
  output: CancelJobRunResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Removes tags from resources.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the tags assigned to the resources.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a virtual cluster. Virtual cluster is a managed entity on Amazon EMR on EKS. You can create, describe, list and delete virtual clusters. They do not consume any
 * additional resource in your system. A single virtual cluster maps to a single Kubernetes
 * namespace. Given this relationship, you can model virtual clusters the same way you model
 * Kubernetes namespaces to meet your requirements.
 */
export const createVirtualCluster: (
  input: CreateVirtualClusterRequest,
) => effect.Effect<
  CreateVirtualClusterResponse,
  | EKSRequestThrottledException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVirtualClusterRequest,
  output: CreateVirtualClusterResponse,
  errors: [
    EKSRequestThrottledException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Displays detailed information about a specified job template. Job template stores values
 * of StartJobRun API request in a template and can be used to start a job run. Job template
 * allows two use cases: avoid repeating recurring StartJobRun API request values, enforcing
 * certain values in StartJobRun API request.
 */
export const describeJobTemplate: (
  input: DescribeJobTemplateRequest,
) => effect.Effect<
  DescribeJobTemplateResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeJobTemplateRequest,
  output: DescribeJobTemplateResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Displays detailed information about a specified security configuration. Security
 * configurations in Amazon EMR on EKS are templates for different security setups. You
 * can use security configurations to configure the Lake Formation integration setup.
 * You can also create a security configuration to re-use a security setup each time you
 * create a virtual cluster.
 */
export const describeSecurityConfiguration: (
  input: DescribeSecurityConfigurationRequest,
) => effect.Effect<
  DescribeSecurityConfigurationResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSecurityConfigurationRequest,
  output: DescribeSecurityConfigurationResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Displays detailed information about a specified virtual cluster. Virtual cluster is a
 * managed entity on Amazon EMR on EKS. You can create, describe, list and delete virtual
 * clusters. They do not consume any additional resource in your system. A single virtual
 * cluster maps to a single Kubernetes namespace. Given this relationship, you can model
 * virtual clusters the same way you model Kubernetes namespaces to meet your
 * requirements.
 */
export const describeVirtualCluster: (
  input: DescribeVirtualClusterRequest,
) => effect.Effect<
  DescribeVirtualClusterResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeVirtualClusterRequest,
  output: DescribeVirtualClusterResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a job template. Job template stores values of StartJobRun API request in a
 * template and can be used to start a job run. Job template allows two use cases: avoid
 * repeating recurring StartJobRun API request values, enforcing certain values in StartJobRun
 * API request.
 */
export const deleteJobTemplate: (
  input: DeleteJobTemplateRequest,
) => effect.Effect<
  DeleteJobTemplateResponse,
  InternalServerException | ValidationException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteJobTemplateRequest,
  output: DeleteJobTemplateResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Deletes a managed endpoint. A managed endpoint is a gateway that connects Amazon EMR Studio to Amazon EMR on EKS so that Amazon EMR Studio can
 * communicate with your virtual cluster.
 */
export const deleteManagedEndpoint: (
  input: DeleteManagedEndpointRequest,
) => effect.Effect<
  DeleteManagedEndpointResponse,
  InternalServerException | ValidationException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteManagedEndpointRequest,
  output: DeleteManagedEndpointResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Deletes a virtual cluster. Virtual cluster is a managed entity on Amazon EMR on EKS. You can create, describe, list and delete virtual clusters. They do not consume any
 * additional resource in your system. A single virtual cluster maps to a single Kubernetes
 * namespace. Given this relationship, you can model virtual clusters the same way you model
 * Kubernetes namespaces to meet your requirements.
 */
export const deleteVirtualCluster: (
  input: DeleteVirtualClusterRequest,
) => effect.Effect<
  DeleteVirtualClusterResponse,
  InternalServerException | ValidationException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVirtualClusterRequest,
  output: DeleteVirtualClusterResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Lists job runs based on a set of parameters. A job run is a unit of work, such as a
 * Spark jar, PySpark script, or SparkSQL query, that you submit to Amazon EMR on EKS.
 */
export const listJobRuns: {
  (
    input: ListJobRunsRequest,
  ): effect.Effect<
    ListJobRunsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobRunsRequest,
  ) => stream.Stream<
    ListJobRunsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListJobRunsRequest,
  ) => stream.Stream<
    JobRun,
    InternalServerException | ValidationException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListJobRunsRequest,
  output: ListJobRunsResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "jobRuns",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists job templates based on a set of parameters. Job template stores values of
 * StartJobRun API request in a template and can be used to start a job run. Job template
 * allows two use cases: avoid repeating recurring StartJobRun API request values, enforcing
 * certain values in StartJobRun API request.
 */
export const listJobTemplates: {
  (
    input: ListJobTemplatesRequest,
  ): effect.Effect<
    ListJobTemplatesResponse,
    InternalServerException | ValidationException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobTemplatesRequest,
  ) => stream.Stream<
    ListJobTemplatesResponse,
    InternalServerException | ValidationException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListJobTemplatesRequest,
  ) => stream.Stream<
    JobTemplate,
    InternalServerException | ValidationException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListJobTemplatesRequest,
  output: ListJobTemplatesResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "templates",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists managed endpoints based on a set of parameters. A managed endpoint is a gateway
 * that connects Amazon EMR Studio to Amazon EMR on EKS so that Amazon EMR Studio can communicate with your virtual cluster.
 */
export const listManagedEndpoints: {
  (
    input: ListManagedEndpointsRequest,
  ): effect.Effect<
    ListManagedEndpointsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListManagedEndpointsRequest,
  ) => stream.Stream<
    ListManagedEndpointsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListManagedEndpointsRequest,
  ) => stream.Stream<
    Endpoint,
    InternalServerException | ValidationException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListManagedEndpointsRequest,
  output: ListManagedEndpointsResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "endpoints",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists security configurations based on a set of parameters. Security configurations in
 * Amazon EMR on EKS are templates for different security setups. You can use security
 * configurations to configure the Lake Formation integration setup. You can also
 * create a security configuration to re-use a security setup each time you create a virtual
 * cluster.
 */
export const listSecurityConfigurations: {
  (
    input: ListSecurityConfigurationsRequest,
  ): effect.Effect<
    ListSecurityConfigurationsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSecurityConfigurationsRequest,
  ) => stream.Stream<
    ListSecurityConfigurationsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSecurityConfigurationsRequest,
  ) => stream.Stream<
    SecurityConfiguration,
    InternalServerException | ValidationException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSecurityConfigurationsRequest,
  output: ListSecurityConfigurationsResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "securityConfigurations",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists information about the specified virtual cluster. Virtual cluster is a managed
 * entity on Amazon EMR on EKS. You can create, describe, list and delete virtual
 * clusters. They do not consume any additional resource in your system. A single virtual
 * cluster maps to a single Kubernetes namespace. Given this relationship, you can model
 * virtual clusters the same way you model Kubernetes namespaces to meet your
 * requirements.
 */
export const listVirtualClusters: {
  (
    input: ListVirtualClustersRequest,
  ): effect.Effect<
    ListVirtualClustersResponse,
    InternalServerException | ValidationException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListVirtualClustersRequest,
  ) => stream.Stream<
    ListVirtualClustersResponse,
    InternalServerException | ValidationException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListVirtualClustersRequest,
  ) => stream.Stream<
    VirtualCluster,
    InternalServerException | ValidationException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListVirtualClustersRequest,
  output: ListVirtualClustersResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "virtualClusters",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Assigns tags to resources. A tag is a label that you assign to an Amazon Web Services
 * resource. Each tag consists of a key and an optional value, both of which you define. Tags
 * enable you to categorize your Amazon Web Services resources by attributes such as purpose,
 * owner, or environment. When you have many resources of the same type, you can quickly
 * identify a specific resource based on the tags you've assigned to it. For example, you can
 * define a set of tags for your Amazon EMR on EKS clusters to help you track each
 * cluster's owner and stack level. We recommend that you devise a consistent set of tag keys
 * for each resource type. You can then search and filter the resources based on the tags that
 * you add.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Displays detailed information about a job run. A job run is a unit of work, such as a
 * Spark jar, PySpark script, or SparkSQL query, that you submit to Amazon EMR on EKS.
 */
export const describeJobRun: (
  input: DescribeJobRunRequest,
) => effect.Effect<
  DescribeJobRunResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeJobRunRequest,
  output: DescribeJobRunResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Displays detailed information about a managed endpoint. A managed endpoint is a gateway
 * that connects Amazon EMR Studio to Amazon EMR on EKS so that Amazon EMR Studio can communicate with your virtual cluster.
 */
export const describeManagedEndpoint: (
  input: DescribeManagedEndpointRequest,
) => effect.Effect<
  DescribeManagedEndpointResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeManagedEndpointRequest,
  output: DescribeManagedEndpointResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Generate a session token to connect to a managed endpoint.
 */
export const getManagedEndpointSessionCredentials: (
  input: GetManagedEndpointSessionCredentialsRequest,
) => effect.Effect<
  GetManagedEndpointSessionCredentialsResponse,
  | InternalServerException
  | RequestThrottledException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetManagedEndpointSessionCredentialsRequest,
  output: GetManagedEndpointSessionCredentialsResponse,
  errors: [
    InternalServerException,
    RequestThrottledException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Starts a job run. A job run is a unit of work, such as a Spark jar, PySpark script, or
 * SparkSQL query, that you submit to Amazon EMR on EKS.
 */
export const startJobRun: (
  input: StartJobRunRequest,
) => effect.Effect<
  StartJobRunResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartJobRunRequest,
  output: StartJobRunResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a managed endpoint. A managed endpoint is a gateway that connects Amazon EMR Studio to Amazon EMR on EKS so that Amazon EMR Studio can
 * communicate with your virtual cluster.
 */
export const createManagedEndpoint: (
  input: CreateManagedEndpointRequest,
) => effect.Effect<
  CreateManagedEndpointResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateManagedEndpointRequest,
  output: CreateManagedEndpointResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a job template. Job template stores values of StartJobRun API request in a
 * template and can be used to start a job run. Job template allows two use cases: avoid
 * repeating recurring StartJobRun API request values, enforcing certain values in StartJobRun
 * API request.
 */
export const createJobTemplate: (
  input: CreateJobTemplateRequest,
) => effect.Effect<
  CreateJobTemplateResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateJobTemplateRequest,
  output: CreateJobTemplateResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a security configuration. Security configurations in Amazon EMR on EKS are
 * templates for different security setups. You can use security configurations to configure
 * the Lake Formation integration setup. You can also create a security configuration
 * to re-use a security setup each time you create a virtual cluster.
 */
export const createSecurityConfiguration: (
  input: CreateSecurityConfigurationRequest,
) => effect.Effect<
  CreateSecurityConfigurationResponse,
  InternalServerException | ValidationException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSecurityConfigurationRequest,
  output: CreateSecurityConfigurationResponse,
  errors: [InternalServerException, ValidationException],
}));
