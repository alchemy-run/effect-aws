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
  sdkId: "Timestream InfluxDB",
  serviceShapeName: "AmazonTimestreamInfluxDB",
});
const auth = T.AwsAuthSigv4({ name: "timestream-influxdb" });
const ver = T.ServiceVersion("2023-01-27");
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
              `https://timestream-influxdb-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://timestream-influxdb-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://timestream-influxdb.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://timestream-influxdb.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Arn = string;
export type TagKey = string;
export type DbClusterName = string;
export type Username = string | redacted.Redacted<string>;
export type Password = string | redacted.Redacted<string>;
export type Organization = string;
export type Bucket = string;
export type Port = number;
export type DbParameterGroupIdentifier = string;
export type AllocatedStorage = number;
export type VpcSubnetId = string;
export type VpcSecurityGroupId = string;
export type DbClusterId = string;
export type NextToken = string;
export type MaxResults = number;
export type DbInstanceId = string;
export type DbInstanceName = string;
export type DbInstanceIdentifier = string;
export type DbParameterGroupName = string;
export type TagValue = string;
export type DbParameterGroupId = string;

//# Schemas
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export type DbInstanceType =
  | "db.influx.medium"
  | "db.influx.large"
  | "db.influx.xlarge"
  | "db.influx.2xlarge"
  | "db.influx.4xlarge"
  | "db.influx.8xlarge"
  | "db.influx.12xlarge"
  | "db.influx.16xlarge"
  | "db.influx.24xlarge"
  | (string & {});
export const DbInstanceType = S.String;
export type DbStorageType =
  | "InfluxIOIncludedT1"
  | "InfluxIOIncludedT2"
  | "InfluxIOIncludedT3"
  | (string & {});
export const DbStorageType = S.String;
export type NetworkType = "IPV4" | "DUAL" | (string & {});
export const NetworkType = S.String;
export type VpcSubnetIdList = string[];
export const VpcSubnetIdList = S.Array(S.String);
export type VpcSecurityGroupIdList = string[];
export const VpcSecurityGroupIdList = S.Array(S.String);
export type ClusterDeploymentType = "MULTI_NODE_READ_REPLICAS" | (string & {});
export const ClusterDeploymentType = S.String;
export type FailoverMode = "AUTOMATIC" | "NO_FAILOVER" | (string & {});
export const FailoverMode = S.String;
export type DbInstanceIdList = string[];
export const DbInstanceIdList = S.Array(S.String);
export type DeploymentType =
  | "SINGLE_AZ"
  | "WITH_MULTIAZ_STANDBY"
  | (string & {});
export const DeploymentType = S.String;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeys,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface GetDbClusterInput {
  dbClusterId: string;
}
export const GetDbClusterInput = S.suspend(() =>
  S.Struct({ dbClusterId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetDbClusterInput",
}) as any as S.Schema<GetDbClusterInput>;
export interface S3Configuration {
  bucketName: string;
  enabled: boolean;
}
export const S3Configuration = S.suspend(() =>
  S.Struct({ bucketName: S.String, enabled: S.Boolean }),
).annotations({
  identifier: "S3Configuration",
}) as any as S.Schema<S3Configuration>;
export interface LogDeliveryConfiguration {
  s3Configuration: S3Configuration;
}
export const LogDeliveryConfiguration = S.suspend(() =>
  S.Struct({ s3Configuration: S3Configuration }),
).annotations({
  identifier: "LogDeliveryConfiguration",
}) as any as S.Schema<LogDeliveryConfiguration>;
export interface UpdateDbClusterInput {
  dbClusterId: string;
  logDeliveryConfiguration?: LogDeliveryConfiguration;
  dbParameterGroupIdentifier?: string;
  port?: number;
  dbInstanceType?: DbInstanceType;
  failoverMode?: FailoverMode;
}
export const UpdateDbClusterInput = S.suspend(() =>
  S.Struct({
    dbClusterId: S.String,
    logDeliveryConfiguration: S.optional(LogDeliveryConfiguration),
    dbParameterGroupIdentifier: S.optional(S.String),
    port: S.optional(S.Number),
    dbInstanceType: S.optional(DbInstanceType),
    failoverMode: S.optional(FailoverMode),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateDbClusterInput",
}) as any as S.Schema<UpdateDbClusterInput>;
export interface DeleteDbClusterInput {
  dbClusterId: string;
}
export const DeleteDbClusterInput = S.suspend(() =>
  S.Struct({ dbClusterId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteDbClusterInput",
}) as any as S.Schema<DeleteDbClusterInput>;
export interface ListDbClustersInput {
  nextToken?: string;
  maxResults?: number;
}
export const ListDbClustersInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDbClustersInput",
}) as any as S.Schema<ListDbClustersInput>;
export interface ListDbInstancesForClusterInput {
  dbClusterId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListDbInstancesForClusterInput = S.suspend(() =>
  S.Struct({
    dbClusterId: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDbInstancesForClusterInput",
}) as any as S.Schema<ListDbInstancesForClusterInput>;
export interface RebootDbClusterInput {
  dbClusterId: string;
  instanceIds?: string[];
}
export const RebootDbClusterInput = S.suspend(() =>
  S.Struct({
    dbClusterId: S.String,
    instanceIds: S.optional(DbInstanceIdList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RebootDbClusterInput",
}) as any as S.Schema<RebootDbClusterInput>;
export type RequestTagMap = { [key: string]: string | undefined };
export const RequestTagMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface CreateDbInstanceInput {
  name: string;
  username?: string | redacted.Redacted<string>;
  password: string | redacted.Redacted<string>;
  organization?: string;
  bucket?: string;
  dbInstanceType: DbInstanceType;
  vpcSubnetIds: string[];
  vpcSecurityGroupIds: string[];
  publiclyAccessible?: boolean;
  dbStorageType?: DbStorageType;
  allocatedStorage: number;
  dbParameterGroupIdentifier?: string;
  deploymentType?: DeploymentType;
  logDeliveryConfiguration?: LogDeliveryConfiguration;
  tags?: { [key: string]: string | undefined };
  port?: number;
  networkType?: NetworkType;
}
export const CreateDbInstanceInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    username: S.optional(SensitiveString),
    password: SensitiveString,
    organization: S.optional(S.String),
    bucket: S.optional(S.String),
    dbInstanceType: DbInstanceType,
    vpcSubnetIds: VpcSubnetIdList,
    vpcSecurityGroupIds: VpcSecurityGroupIdList,
    publiclyAccessible: S.optional(S.Boolean),
    dbStorageType: S.optional(DbStorageType),
    allocatedStorage: S.Number,
    dbParameterGroupIdentifier: S.optional(S.String),
    deploymentType: S.optional(DeploymentType),
    logDeliveryConfiguration: S.optional(LogDeliveryConfiguration),
    tags: S.optional(RequestTagMap),
    port: S.optional(S.Number),
    networkType: S.optional(NetworkType),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateDbInstanceInput",
}) as any as S.Schema<CreateDbInstanceInput>;
export interface GetDbInstanceInput {
  identifier: string;
}
export const GetDbInstanceInput = S.suspend(() =>
  S.Struct({ identifier: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetDbInstanceInput",
}) as any as S.Schema<GetDbInstanceInput>;
export interface UpdateDbInstanceInput {
  identifier: string;
  logDeliveryConfiguration?: LogDeliveryConfiguration;
  dbParameterGroupIdentifier?: string;
  port?: number;
  dbInstanceType?: DbInstanceType;
  deploymentType?: DeploymentType;
  dbStorageType?: DbStorageType;
  allocatedStorage?: number;
}
export const UpdateDbInstanceInput = S.suspend(() =>
  S.Struct({
    identifier: S.String,
    logDeliveryConfiguration: S.optional(LogDeliveryConfiguration),
    dbParameterGroupIdentifier: S.optional(S.String),
    port: S.optional(S.Number),
    dbInstanceType: S.optional(DbInstanceType),
    deploymentType: S.optional(DeploymentType),
    dbStorageType: S.optional(DbStorageType),
    allocatedStorage: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateDbInstanceInput",
}) as any as S.Schema<UpdateDbInstanceInput>;
export interface DeleteDbInstanceInput {
  identifier: string;
}
export const DeleteDbInstanceInput = S.suspend(() =>
  S.Struct({ identifier: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteDbInstanceInput",
}) as any as S.Schema<DeleteDbInstanceInput>;
export interface ListDbInstancesInput {
  nextToken?: string;
  maxResults?: number;
}
export const ListDbInstancesInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDbInstancesInput",
}) as any as S.Schema<ListDbInstancesInput>;
export interface RebootDbInstanceInput {
  identifier: string;
}
export const RebootDbInstanceInput = S.suspend(() =>
  S.Struct({ identifier: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RebootDbInstanceInput",
}) as any as S.Schema<RebootDbInstanceInput>;
export interface GetDbParameterGroupInput {
  identifier: string;
}
export const GetDbParameterGroupInput = S.suspend(() =>
  S.Struct({ identifier: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetDbParameterGroupInput",
}) as any as S.Schema<GetDbParameterGroupInput>;
export interface ListDbParameterGroupsInput {
  nextToken?: string;
  maxResults?: number;
}
export const ListDbParameterGroupsInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDbParameterGroupsInput",
}) as any as S.Schema<ListDbParameterGroupsInput>;
export type ClusterStatus =
  | "CREATING"
  | "UPDATING"
  | "DELETING"
  | "AVAILABLE"
  | "FAILED"
  | "DELETED"
  | "MAINTENANCE"
  | "UPDATING_INSTANCE_TYPE"
  | "REBOOTING"
  | "REBOOT_FAILED"
  | "PARTIALLY_AVAILABLE"
  | (string & {});
export const ClusterStatus = S.String;
export type EngineType =
  | "INFLUXDB_V2"
  | "INFLUXDB_V3_CORE"
  | "INFLUXDB_V3_ENTERPRISE"
  | (string & {});
export const EngineType = S.String;
export type Status =
  | "CREATING"
  | "AVAILABLE"
  | "DELETING"
  | "MODIFYING"
  | "UPDATING"
  | "DELETED"
  | "FAILED"
  | "UPDATING_DEPLOYMENT_TYPE"
  | "UPDATING_INSTANCE_TYPE"
  | "MAINTENANCE"
  | "REBOOTING"
  | "REBOOT_FAILED"
  | (string & {});
export const Status = S.String;
export type InstanceMode =
  | "PRIMARY"
  | "STANDBY"
  | "REPLICA"
  | "INGEST"
  | "QUERY"
  | "COMPACT"
  | "PROCESS"
  | (string & {});
export const InstanceMode = S.String;
export type InstanceModeList = InstanceMode[];
export const InstanceModeList = S.Array(InstanceMode);
export type LogLevel = "debug" | "info" | "error" | (string & {});
export const LogLevel = S.String;
export type TracingType = "log" | "jaeger" | "disabled" | (string & {});
export const TracingType = S.String;
export type LogFormats = "full" | (string & {});
export const LogFormats = S.String;
export type DataFusionRuntimeType =
  | "multi-thread"
  | "multi-thread-alt"
  | (string & {});
export const DataFusionRuntimeType = S.String;
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tags: RequestTagMap }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface GetDbClusterOutput {
  id: string;
  name: string;
  arn: string;
  status?: ClusterStatus;
  endpoint?: string;
  readerEndpoint?: string;
  port?: number;
  deploymentType?: ClusterDeploymentType;
  dbInstanceType?: DbInstanceType;
  networkType?: NetworkType;
  dbStorageType?: DbStorageType;
  allocatedStorage?: number;
  engineType?: EngineType;
  publiclyAccessible?: boolean;
  dbParameterGroupIdentifier?: string;
  logDeliveryConfiguration?: LogDeliveryConfiguration;
  influxAuthParametersSecretArn?: string;
  vpcSubnetIds?: string[];
  vpcSecurityGroupIds?: string[];
  failoverMode?: FailoverMode;
}
export const GetDbClusterOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    arn: S.String,
    status: S.optional(ClusterStatus),
    endpoint: S.optional(S.String),
    readerEndpoint: S.optional(S.String),
    port: S.optional(S.Number),
    deploymentType: S.optional(ClusterDeploymentType),
    dbInstanceType: S.optional(DbInstanceType),
    networkType: S.optional(NetworkType),
    dbStorageType: S.optional(DbStorageType),
    allocatedStorage: S.optional(S.Number),
    engineType: S.optional(EngineType),
    publiclyAccessible: S.optional(S.Boolean),
    dbParameterGroupIdentifier: S.optional(S.String),
    logDeliveryConfiguration: S.optional(LogDeliveryConfiguration),
    influxAuthParametersSecretArn: S.optional(S.String),
    vpcSubnetIds: S.optional(VpcSubnetIdList),
    vpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    failoverMode: S.optional(FailoverMode),
  }),
).annotations({
  identifier: "GetDbClusterOutput",
}) as any as S.Schema<GetDbClusterOutput>;
export interface UpdateDbClusterOutput {
  dbClusterStatus?: ClusterStatus;
}
export const UpdateDbClusterOutput = S.suspend(() =>
  S.Struct({ dbClusterStatus: S.optional(ClusterStatus) }),
).annotations({
  identifier: "UpdateDbClusterOutput",
}) as any as S.Schema<UpdateDbClusterOutput>;
export interface DeleteDbClusterOutput {
  dbClusterStatus?: ClusterStatus;
}
export const DeleteDbClusterOutput = S.suspend(() =>
  S.Struct({ dbClusterStatus: S.optional(ClusterStatus) }),
).annotations({
  identifier: "DeleteDbClusterOutput",
}) as any as S.Schema<DeleteDbClusterOutput>;
export interface RebootDbClusterOutput {
  dbClusterStatus?: ClusterStatus;
}
export const RebootDbClusterOutput = S.suspend(() =>
  S.Struct({ dbClusterStatus: S.optional(ClusterStatus) }),
).annotations({
  identifier: "RebootDbClusterOutput",
}) as any as S.Schema<RebootDbClusterOutput>;
export interface CreateDbInstanceOutput {
  id: string;
  name: string;
  arn: string;
  status?: Status;
  endpoint?: string;
  port?: number;
  networkType?: NetworkType;
  dbInstanceType?: DbInstanceType;
  dbStorageType?: DbStorageType;
  allocatedStorage?: number;
  deploymentType?: DeploymentType;
  vpcSubnetIds: string[];
  publiclyAccessible?: boolean;
  vpcSecurityGroupIds?: string[];
  dbParameterGroupIdentifier?: string;
  availabilityZone?: string;
  secondaryAvailabilityZone?: string;
  logDeliveryConfiguration?: LogDeliveryConfiguration;
  influxAuthParametersSecretArn?: string;
  dbClusterId?: string;
  instanceMode?: InstanceMode;
  instanceModes?: InstanceMode[];
}
export const CreateDbInstanceOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    arn: S.String,
    status: S.optional(Status),
    endpoint: S.optional(S.String),
    port: S.optional(S.Number),
    networkType: S.optional(NetworkType),
    dbInstanceType: S.optional(DbInstanceType),
    dbStorageType: S.optional(DbStorageType),
    allocatedStorage: S.optional(S.Number),
    deploymentType: S.optional(DeploymentType),
    vpcSubnetIds: VpcSubnetIdList,
    publiclyAccessible: S.optional(S.Boolean),
    vpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    dbParameterGroupIdentifier: S.optional(S.String),
    availabilityZone: S.optional(S.String),
    secondaryAvailabilityZone: S.optional(S.String),
    logDeliveryConfiguration: S.optional(LogDeliveryConfiguration),
    influxAuthParametersSecretArn: S.optional(S.String),
    dbClusterId: S.optional(S.String),
    instanceMode: S.optional(InstanceMode),
    instanceModes: S.optional(InstanceModeList),
  }),
).annotations({
  identifier: "CreateDbInstanceOutput",
}) as any as S.Schema<CreateDbInstanceOutput>;
export interface GetDbInstanceOutput {
  id: string;
  name: string;
  arn: string;
  status?: Status;
  endpoint?: string;
  port?: number;
  networkType?: NetworkType;
  dbInstanceType?: DbInstanceType;
  dbStorageType?: DbStorageType;
  allocatedStorage?: number;
  deploymentType?: DeploymentType;
  vpcSubnetIds: string[];
  publiclyAccessible?: boolean;
  vpcSecurityGroupIds?: string[];
  dbParameterGroupIdentifier?: string;
  availabilityZone?: string;
  secondaryAvailabilityZone?: string;
  logDeliveryConfiguration?: LogDeliveryConfiguration;
  influxAuthParametersSecretArn?: string;
  dbClusterId?: string;
  instanceMode?: InstanceMode;
  instanceModes?: InstanceMode[];
}
export const GetDbInstanceOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    arn: S.String,
    status: S.optional(Status),
    endpoint: S.optional(S.String),
    port: S.optional(S.Number),
    networkType: S.optional(NetworkType),
    dbInstanceType: S.optional(DbInstanceType),
    dbStorageType: S.optional(DbStorageType),
    allocatedStorage: S.optional(S.Number),
    deploymentType: S.optional(DeploymentType),
    vpcSubnetIds: VpcSubnetIdList,
    publiclyAccessible: S.optional(S.Boolean),
    vpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    dbParameterGroupIdentifier: S.optional(S.String),
    availabilityZone: S.optional(S.String),
    secondaryAvailabilityZone: S.optional(S.String),
    logDeliveryConfiguration: S.optional(LogDeliveryConfiguration),
    influxAuthParametersSecretArn: S.optional(S.String),
    dbClusterId: S.optional(S.String),
    instanceMode: S.optional(InstanceMode),
    instanceModes: S.optional(InstanceModeList),
  }),
).annotations({
  identifier: "GetDbInstanceOutput",
}) as any as S.Schema<GetDbInstanceOutput>;
export interface UpdateDbInstanceOutput {
  id: string;
  name: string;
  arn: string;
  status?: Status;
  endpoint?: string;
  port?: number;
  networkType?: NetworkType;
  dbInstanceType?: DbInstanceType;
  dbStorageType?: DbStorageType;
  allocatedStorage?: number;
  deploymentType?: DeploymentType;
  vpcSubnetIds: string[];
  publiclyAccessible?: boolean;
  vpcSecurityGroupIds?: string[];
  dbParameterGroupIdentifier?: string;
  availabilityZone?: string;
  secondaryAvailabilityZone?: string;
  logDeliveryConfiguration?: LogDeliveryConfiguration;
  influxAuthParametersSecretArn?: string;
  dbClusterId?: string;
  instanceMode?: InstanceMode;
  instanceModes?: InstanceMode[];
}
export const UpdateDbInstanceOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    arn: S.String,
    status: S.optional(Status),
    endpoint: S.optional(S.String),
    port: S.optional(S.Number),
    networkType: S.optional(NetworkType),
    dbInstanceType: S.optional(DbInstanceType),
    dbStorageType: S.optional(DbStorageType),
    allocatedStorage: S.optional(S.Number),
    deploymentType: S.optional(DeploymentType),
    vpcSubnetIds: VpcSubnetIdList,
    publiclyAccessible: S.optional(S.Boolean),
    vpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    dbParameterGroupIdentifier: S.optional(S.String),
    availabilityZone: S.optional(S.String),
    secondaryAvailabilityZone: S.optional(S.String),
    logDeliveryConfiguration: S.optional(LogDeliveryConfiguration),
    influxAuthParametersSecretArn: S.optional(S.String),
    dbClusterId: S.optional(S.String),
    instanceMode: S.optional(InstanceMode),
    instanceModes: S.optional(InstanceModeList),
  }),
).annotations({
  identifier: "UpdateDbInstanceOutput",
}) as any as S.Schema<UpdateDbInstanceOutput>;
export interface DeleteDbInstanceOutput {
  id: string;
  name: string;
  arn: string;
  status?: Status;
  endpoint?: string;
  port?: number;
  networkType?: NetworkType;
  dbInstanceType?: DbInstanceType;
  dbStorageType?: DbStorageType;
  allocatedStorage?: number;
  deploymentType?: DeploymentType;
  vpcSubnetIds: string[];
  publiclyAccessible?: boolean;
  vpcSecurityGroupIds?: string[];
  dbParameterGroupIdentifier?: string;
  availabilityZone?: string;
  secondaryAvailabilityZone?: string;
  logDeliveryConfiguration?: LogDeliveryConfiguration;
  influxAuthParametersSecretArn?: string;
  dbClusterId?: string;
  instanceMode?: InstanceMode;
  instanceModes?: InstanceMode[];
}
export const DeleteDbInstanceOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    arn: S.String,
    status: S.optional(Status),
    endpoint: S.optional(S.String),
    port: S.optional(S.Number),
    networkType: S.optional(NetworkType),
    dbInstanceType: S.optional(DbInstanceType),
    dbStorageType: S.optional(DbStorageType),
    allocatedStorage: S.optional(S.Number),
    deploymentType: S.optional(DeploymentType),
    vpcSubnetIds: VpcSubnetIdList,
    publiclyAccessible: S.optional(S.Boolean),
    vpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    dbParameterGroupIdentifier: S.optional(S.String),
    availabilityZone: S.optional(S.String),
    secondaryAvailabilityZone: S.optional(S.String),
    logDeliveryConfiguration: S.optional(LogDeliveryConfiguration),
    influxAuthParametersSecretArn: S.optional(S.String),
    dbClusterId: S.optional(S.String),
    instanceMode: S.optional(InstanceMode),
    instanceModes: S.optional(InstanceModeList),
  }),
).annotations({
  identifier: "DeleteDbInstanceOutput",
}) as any as S.Schema<DeleteDbInstanceOutput>;
export interface RebootDbInstanceOutput {
  id: string;
  name: string;
  arn: string;
  status?: Status;
  endpoint?: string;
  port?: number;
  networkType?: NetworkType;
  dbInstanceType?: DbInstanceType;
  dbStorageType?: DbStorageType;
  allocatedStorage?: number;
  deploymentType?: DeploymentType;
  vpcSubnetIds: string[];
  publiclyAccessible?: boolean;
  vpcSecurityGroupIds?: string[];
  dbParameterGroupIdentifier?: string;
  availabilityZone?: string;
  secondaryAvailabilityZone?: string;
  logDeliveryConfiguration?: LogDeliveryConfiguration;
  influxAuthParametersSecretArn?: string;
  dbClusterId?: string;
  instanceMode?: InstanceMode;
  instanceModes?: InstanceMode[];
}
export const RebootDbInstanceOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    arn: S.String,
    status: S.optional(Status),
    endpoint: S.optional(S.String),
    port: S.optional(S.Number),
    networkType: S.optional(NetworkType),
    dbInstanceType: S.optional(DbInstanceType),
    dbStorageType: S.optional(DbStorageType),
    allocatedStorage: S.optional(S.Number),
    deploymentType: S.optional(DeploymentType),
    vpcSubnetIds: VpcSubnetIdList,
    publiclyAccessible: S.optional(S.Boolean),
    vpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    dbParameterGroupIdentifier: S.optional(S.String),
    availabilityZone: S.optional(S.String),
    secondaryAvailabilityZone: S.optional(S.String),
    logDeliveryConfiguration: S.optional(LogDeliveryConfiguration),
    influxAuthParametersSecretArn: S.optional(S.String),
    dbClusterId: S.optional(S.String),
    instanceMode: S.optional(InstanceMode),
    instanceModes: S.optional(InstanceModeList),
  }),
).annotations({
  identifier: "RebootDbInstanceOutput",
}) as any as S.Schema<RebootDbInstanceOutput>;
export type DurationType =
  | "hours"
  | "minutes"
  | "seconds"
  | "milliseconds"
  | "days"
  | (string & {});
export const DurationType = S.String;
export interface Duration {
  durationType: DurationType;
  value: number;
}
export const Duration = S.suspend(() =>
  S.Struct({ durationType: DurationType, value: S.Number }),
).annotations({ identifier: "Duration" }) as any as S.Schema<Duration>;
export interface InfluxDBv2Parameters {
  fluxLogEnabled?: boolean;
  logLevel?: LogLevel;
  noTasks?: boolean;
  queryConcurrency?: number;
  queryQueueSize?: number;
  tracingType?: TracingType;
  metricsDisabled?: boolean;
  httpIdleTimeout?: Duration;
  httpReadHeaderTimeout?: Duration;
  httpReadTimeout?: Duration;
  httpWriteTimeout?: Duration;
  influxqlMaxSelectBuckets?: number;
  influxqlMaxSelectPoint?: number;
  influxqlMaxSelectSeries?: number;
  pprofDisabled?: boolean;
  queryInitialMemoryBytes?: number;
  queryMaxMemoryBytes?: number;
  queryMemoryBytes?: number;
  sessionLength?: number;
  sessionRenewDisabled?: boolean;
  storageCacheMaxMemorySize?: number;
  storageCacheSnapshotMemorySize?: number;
  storageCacheSnapshotWriteColdDuration?: Duration;
  storageCompactFullWriteColdDuration?: Duration;
  storageCompactThroughputBurst?: number;
  storageMaxConcurrentCompactions?: number;
  storageMaxIndexLogFileSize?: number;
  storageNoValidateFieldSize?: boolean;
  storageRetentionCheckInterval?: Duration;
  storageSeriesFileMaxConcurrentSnapshotCompactions?: number;
  storageSeriesIdSetCacheSize?: number;
  storageWalMaxConcurrentWrites?: number;
  storageWalMaxWriteDelay?: Duration;
  uiDisabled?: boolean;
}
export const InfluxDBv2Parameters = S.suspend(() =>
  S.Struct({
    fluxLogEnabled: S.optional(S.Boolean),
    logLevel: S.optional(LogLevel),
    noTasks: S.optional(S.Boolean),
    queryConcurrency: S.optional(S.Number),
    queryQueueSize: S.optional(S.Number),
    tracingType: S.optional(TracingType),
    metricsDisabled: S.optional(S.Boolean),
    httpIdleTimeout: S.optional(Duration),
    httpReadHeaderTimeout: S.optional(Duration),
    httpReadTimeout: S.optional(Duration),
    httpWriteTimeout: S.optional(Duration),
    influxqlMaxSelectBuckets: S.optional(S.Number),
    influxqlMaxSelectPoint: S.optional(S.Number),
    influxqlMaxSelectSeries: S.optional(S.Number),
    pprofDisabled: S.optional(S.Boolean),
    queryInitialMemoryBytes: S.optional(S.Number),
    queryMaxMemoryBytes: S.optional(S.Number),
    queryMemoryBytes: S.optional(S.Number),
    sessionLength: S.optional(S.Number),
    sessionRenewDisabled: S.optional(S.Boolean),
    storageCacheMaxMemorySize: S.optional(S.Number),
    storageCacheSnapshotMemorySize: S.optional(S.Number),
    storageCacheSnapshotWriteColdDuration: S.optional(Duration),
    storageCompactFullWriteColdDuration: S.optional(Duration),
    storageCompactThroughputBurst: S.optional(S.Number),
    storageMaxConcurrentCompactions: S.optional(S.Number),
    storageMaxIndexLogFileSize: S.optional(S.Number),
    storageNoValidateFieldSize: S.optional(S.Boolean),
    storageRetentionCheckInterval: S.optional(Duration),
    storageSeriesFileMaxConcurrentSnapshotCompactions: S.optional(S.Number),
    storageSeriesIdSetCacheSize: S.optional(S.Number),
    storageWalMaxConcurrentWrites: S.optional(S.Number),
    storageWalMaxWriteDelay: S.optional(Duration),
    uiDisabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "InfluxDBv2Parameters",
}) as any as S.Schema<InfluxDBv2Parameters>;
export type PercentOrAbsoluteLong =
  | { percent: string; absolute?: never }
  | { percent?: never; absolute: number };
export const PercentOrAbsoluteLong = S.Union(
  S.Struct({ percent: S.String }),
  S.Struct({ absolute: S.Number }),
);
export interface InfluxDBv3CoreParameters {
  queryFileLimit?: number;
  queryLogSize?: number;
  logFilter?: string;
  logFormat?: LogFormats;
  dataFusionNumThreads?: number;
  dataFusionRuntimeType?: DataFusionRuntimeType;
  dataFusionRuntimeDisableLifoSlot?: boolean;
  dataFusionRuntimeEventInterval?: number;
  dataFusionRuntimeGlobalQueueInterval?: number;
  dataFusionRuntimeMaxBlockingThreads?: number;
  dataFusionRuntimeMaxIoEventsPerTick?: number;
  dataFusionRuntimeThreadKeepAlive?: Duration;
  dataFusionRuntimeThreadPriority?: number;
  dataFusionMaxParquetFanout?: number;
  dataFusionUseCachedParquetLoader?: boolean;
  dataFusionConfig?: string;
  maxHttpRequestSize?: number;
  forceSnapshotMemThreshold?: PercentOrAbsoluteLong;
  walSnapshotSize?: number;
  walMaxWriteBufferSize?: number;
  snapshottedWalFilesToKeep?: number;
  preemptiveCacheAge?: Duration;
  parquetMemCachePrunePercentage?: number;
  parquetMemCachePruneInterval?: Duration;
  disableParquetMemCache?: boolean;
  parquetMemCacheQueryPathDuration?: Duration;
  lastCacheEvictionInterval?: Duration;
  distinctCacheEvictionInterval?: Duration;
  gen1Duration?: Duration;
  execMemPoolBytes?: PercentOrAbsoluteLong;
  parquetMemCacheSize?: PercentOrAbsoluteLong;
  walReplayFailOnError?: boolean;
  walReplayConcurrencyLimit?: number;
  tableIndexCacheMaxEntries?: number;
  tableIndexCacheConcurrencyLimit?: number;
  gen1LookbackDuration?: Duration;
  retentionCheckInterval?: Duration;
  deleteGracePeriod?: Duration;
  hardDeleteDefaultDuration?: Duration;
}
export const InfluxDBv3CoreParameters = S.suspend(() =>
  S.Struct({
    queryFileLimit: S.optional(S.Number),
    queryLogSize: S.optional(S.Number),
    logFilter: S.optional(S.String),
    logFormat: S.optional(LogFormats),
    dataFusionNumThreads: S.optional(S.Number),
    dataFusionRuntimeType: S.optional(DataFusionRuntimeType),
    dataFusionRuntimeDisableLifoSlot: S.optional(S.Boolean),
    dataFusionRuntimeEventInterval: S.optional(S.Number),
    dataFusionRuntimeGlobalQueueInterval: S.optional(S.Number),
    dataFusionRuntimeMaxBlockingThreads: S.optional(S.Number),
    dataFusionRuntimeMaxIoEventsPerTick: S.optional(S.Number),
    dataFusionRuntimeThreadKeepAlive: S.optional(Duration),
    dataFusionRuntimeThreadPriority: S.optional(S.Number),
    dataFusionMaxParquetFanout: S.optional(S.Number),
    dataFusionUseCachedParquetLoader: S.optional(S.Boolean),
    dataFusionConfig: S.optional(S.String),
    maxHttpRequestSize: S.optional(S.Number),
    forceSnapshotMemThreshold: S.optional(PercentOrAbsoluteLong),
    walSnapshotSize: S.optional(S.Number),
    walMaxWriteBufferSize: S.optional(S.Number),
    snapshottedWalFilesToKeep: S.optional(S.Number),
    preemptiveCacheAge: S.optional(Duration),
    parquetMemCachePrunePercentage: S.optional(S.Number),
    parquetMemCachePruneInterval: S.optional(Duration),
    disableParquetMemCache: S.optional(S.Boolean),
    parquetMemCacheQueryPathDuration: S.optional(Duration),
    lastCacheEvictionInterval: S.optional(Duration),
    distinctCacheEvictionInterval: S.optional(Duration),
    gen1Duration: S.optional(Duration),
    execMemPoolBytes: S.optional(PercentOrAbsoluteLong),
    parquetMemCacheSize: S.optional(PercentOrAbsoluteLong),
    walReplayFailOnError: S.optional(S.Boolean),
    walReplayConcurrencyLimit: S.optional(S.Number),
    tableIndexCacheMaxEntries: S.optional(S.Number),
    tableIndexCacheConcurrencyLimit: S.optional(S.Number),
    gen1LookbackDuration: S.optional(Duration),
    retentionCheckInterval: S.optional(Duration),
    deleteGracePeriod: S.optional(Duration),
    hardDeleteDefaultDuration: S.optional(Duration),
  }),
).annotations({
  identifier: "InfluxDBv3CoreParameters",
}) as any as S.Schema<InfluxDBv3CoreParameters>;
export interface InfluxDBv3EnterpriseParameters {
  queryFileLimit?: number;
  queryLogSize?: number;
  logFilter?: string;
  logFormat?: LogFormats;
  dataFusionNumThreads?: number;
  dataFusionRuntimeType?: DataFusionRuntimeType;
  dataFusionRuntimeDisableLifoSlot?: boolean;
  dataFusionRuntimeEventInterval?: number;
  dataFusionRuntimeGlobalQueueInterval?: number;
  dataFusionRuntimeMaxBlockingThreads?: number;
  dataFusionRuntimeMaxIoEventsPerTick?: number;
  dataFusionRuntimeThreadKeepAlive?: Duration;
  dataFusionRuntimeThreadPriority?: number;
  dataFusionMaxParquetFanout?: number;
  dataFusionUseCachedParquetLoader?: boolean;
  dataFusionConfig?: string;
  maxHttpRequestSize?: number;
  forceSnapshotMemThreshold?: PercentOrAbsoluteLong;
  walSnapshotSize?: number;
  walMaxWriteBufferSize?: number;
  snapshottedWalFilesToKeep?: number;
  preemptiveCacheAge?: Duration;
  parquetMemCachePrunePercentage?: number;
  parquetMemCachePruneInterval?: Duration;
  disableParquetMemCache?: boolean;
  parquetMemCacheQueryPathDuration?: Duration;
  lastCacheEvictionInterval?: Duration;
  distinctCacheEvictionInterval?: Duration;
  gen1Duration?: Duration;
  execMemPoolBytes?: PercentOrAbsoluteLong;
  parquetMemCacheSize?: PercentOrAbsoluteLong;
  walReplayFailOnError?: boolean;
  walReplayConcurrencyLimit?: number;
  tableIndexCacheMaxEntries?: number;
  tableIndexCacheConcurrencyLimit?: number;
  gen1LookbackDuration?: Duration;
  retentionCheckInterval?: Duration;
  deleteGracePeriod?: Duration;
  hardDeleteDefaultDuration?: Duration;
  ingestQueryInstances: number;
  queryOnlyInstances: number;
  dedicatedCompactor: boolean;
  compactionRowLimit?: number;
  compactionMaxNumFilesPerPlan?: number;
  compactionGen2Duration?: Duration;
  compactionMultipliers?: string;
  compactionCleanupWait?: Duration;
  compactionCheckInterval?: Duration;
  lastValueCacheDisableFromHistory?: boolean;
  distinctValueCacheDisableFromHistory?: boolean;
  replicationInterval?: Duration;
  catalogSyncInterval?: Duration;
}
export const InfluxDBv3EnterpriseParameters = S.suspend(() =>
  S.Struct({
    queryFileLimit: S.optional(S.Number),
    queryLogSize: S.optional(S.Number),
    logFilter: S.optional(S.String),
    logFormat: S.optional(LogFormats),
    dataFusionNumThreads: S.optional(S.Number),
    dataFusionRuntimeType: S.optional(DataFusionRuntimeType),
    dataFusionRuntimeDisableLifoSlot: S.optional(S.Boolean),
    dataFusionRuntimeEventInterval: S.optional(S.Number),
    dataFusionRuntimeGlobalQueueInterval: S.optional(S.Number),
    dataFusionRuntimeMaxBlockingThreads: S.optional(S.Number),
    dataFusionRuntimeMaxIoEventsPerTick: S.optional(S.Number),
    dataFusionRuntimeThreadKeepAlive: S.optional(Duration),
    dataFusionRuntimeThreadPriority: S.optional(S.Number),
    dataFusionMaxParquetFanout: S.optional(S.Number),
    dataFusionUseCachedParquetLoader: S.optional(S.Boolean),
    dataFusionConfig: S.optional(S.String),
    maxHttpRequestSize: S.optional(S.Number),
    forceSnapshotMemThreshold: S.optional(PercentOrAbsoluteLong),
    walSnapshotSize: S.optional(S.Number),
    walMaxWriteBufferSize: S.optional(S.Number),
    snapshottedWalFilesToKeep: S.optional(S.Number),
    preemptiveCacheAge: S.optional(Duration),
    parquetMemCachePrunePercentage: S.optional(S.Number),
    parquetMemCachePruneInterval: S.optional(Duration),
    disableParquetMemCache: S.optional(S.Boolean),
    parquetMemCacheQueryPathDuration: S.optional(Duration),
    lastCacheEvictionInterval: S.optional(Duration),
    distinctCacheEvictionInterval: S.optional(Duration),
    gen1Duration: S.optional(Duration),
    execMemPoolBytes: S.optional(PercentOrAbsoluteLong),
    parquetMemCacheSize: S.optional(PercentOrAbsoluteLong),
    walReplayFailOnError: S.optional(S.Boolean),
    walReplayConcurrencyLimit: S.optional(S.Number),
    tableIndexCacheMaxEntries: S.optional(S.Number),
    tableIndexCacheConcurrencyLimit: S.optional(S.Number),
    gen1LookbackDuration: S.optional(Duration),
    retentionCheckInterval: S.optional(Duration),
    deleteGracePeriod: S.optional(Duration),
    hardDeleteDefaultDuration: S.optional(Duration),
    ingestQueryInstances: S.Number,
    queryOnlyInstances: S.Number,
    dedicatedCompactor: S.Boolean,
    compactionRowLimit: S.optional(S.Number),
    compactionMaxNumFilesPerPlan: S.optional(S.Number),
    compactionGen2Duration: S.optional(Duration),
    compactionMultipliers: S.optional(S.String),
    compactionCleanupWait: S.optional(Duration),
    compactionCheckInterval: S.optional(Duration),
    lastValueCacheDisableFromHistory: S.optional(S.Boolean),
    distinctValueCacheDisableFromHistory: S.optional(S.Boolean),
    replicationInterval: S.optional(Duration),
    catalogSyncInterval: S.optional(Duration),
  }),
).annotations({
  identifier: "InfluxDBv3EnterpriseParameters",
}) as any as S.Schema<InfluxDBv3EnterpriseParameters>;
export type Parameters =
  | {
      InfluxDBv2: InfluxDBv2Parameters;
      InfluxDBv3Core?: never;
      InfluxDBv3Enterprise?: never;
    }
  | {
      InfluxDBv2?: never;
      InfluxDBv3Core: InfluxDBv3CoreParameters;
      InfluxDBv3Enterprise?: never;
    }
  | {
      InfluxDBv2?: never;
      InfluxDBv3Core?: never;
      InfluxDBv3Enterprise: InfluxDBv3EnterpriseParameters;
    };
export const Parameters = S.Union(
  S.Struct({ InfluxDBv2: InfluxDBv2Parameters }),
  S.Struct({ InfluxDBv3Core: InfluxDBv3CoreParameters }),
  S.Struct({ InfluxDBv3Enterprise: InfluxDBv3EnterpriseParameters }),
);
export interface GetDbParameterGroupOutput {
  id: string;
  name: string;
  arn: string;
  description?: string;
  parameters?: Parameters;
}
export const GetDbParameterGroupOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    arn: S.String,
    description: S.optional(S.String),
    parameters: S.optional(Parameters),
  }),
).annotations({
  identifier: "GetDbParameterGroupOutput",
}) as any as S.Schema<GetDbParameterGroupOutput>;
export type ResponseTagMap = { [key: string]: string | undefined };
export const ResponseTagMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface DbClusterSummary {
  id: string;
  name: string;
  arn: string;
  status?: ClusterStatus;
  endpoint?: string;
  readerEndpoint?: string;
  port?: number;
  deploymentType?: ClusterDeploymentType;
  dbInstanceType?: DbInstanceType;
  networkType?: NetworkType;
  dbStorageType?: DbStorageType;
  allocatedStorage?: number;
  engineType?: EngineType;
}
export const DbClusterSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    arn: S.String,
    status: S.optional(ClusterStatus),
    endpoint: S.optional(S.String),
    readerEndpoint: S.optional(S.String),
    port: S.optional(S.Number),
    deploymentType: S.optional(ClusterDeploymentType),
    dbInstanceType: S.optional(DbInstanceType),
    networkType: S.optional(NetworkType),
    dbStorageType: S.optional(DbStorageType),
    allocatedStorage: S.optional(S.Number),
    engineType: S.optional(EngineType),
  }),
).annotations({
  identifier: "DbClusterSummary",
}) as any as S.Schema<DbClusterSummary>;
export type DbClusterSummaryList = DbClusterSummary[];
export const DbClusterSummaryList = S.Array(DbClusterSummary);
export interface DbInstanceForClusterSummary {
  id: string;
  name: string;
  arn: string;
  status?: Status;
  endpoint?: string;
  port?: number;
  networkType?: NetworkType;
  dbInstanceType?: DbInstanceType;
  dbStorageType?: DbStorageType;
  allocatedStorage?: number;
  deploymentType?: DeploymentType;
  instanceMode?: InstanceMode;
  instanceModes?: InstanceMode[];
}
export const DbInstanceForClusterSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    arn: S.String,
    status: S.optional(Status),
    endpoint: S.optional(S.String),
    port: S.optional(S.Number),
    networkType: S.optional(NetworkType),
    dbInstanceType: S.optional(DbInstanceType),
    dbStorageType: S.optional(DbStorageType),
    allocatedStorage: S.optional(S.Number),
    deploymentType: S.optional(DeploymentType),
    instanceMode: S.optional(InstanceMode),
    instanceModes: S.optional(InstanceModeList),
  }),
).annotations({
  identifier: "DbInstanceForClusterSummary",
}) as any as S.Schema<DbInstanceForClusterSummary>;
export type DbInstanceForClusterSummaryList = DbInstanceForClusterSummary[];
export const DbInstanceForClusterSummaryList = S.Array(
  DbInstanceForClusterSummary,
);
export interface DbInstanceSummary {
  id: string;
  name: string;
  arn: string;
  status?: Status;
  endpoint?: string;
  port?: number;
  networkType?: NetworkType;
  dbInstanceType?: DbInstanceType;
  dbStorageType?: DbStorageType;
  allocatedStorage?: number;
  deploymentType?: DeploymentType;
}
export const DbInstanceSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    arn: S.String,
    status: S.optional(Status),
    endpoint: S.optional(S.String),
    port: S.optional(S.Number),
    networkType: S.optional(NetworkType),
    dbInstanceType: S.optional(DbInstanceType),
    dbStorageType: S.optional(DbStorageType),
    allocatedStorage: S.optional(S.Number),
    deploymentType: S.optional(DeploymentType),
  }),
).annotations({
  identifier: "DbInstanceSummary",
}) as any as S.Schema<DbInstanceSummary>;
export type DbInstanceSummaryList = DbInstanceSummary[];
export const DbInstanceSummaryList = S.Array(DbInstanceSummary);
export interface DbParameterGroupSummary {
  id: string;
  name: string;
  arn: string;
  description?: string;
}
export const DbParameterGroupSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    arn: S.String,
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "DbParameterGroupSummary",
}) as any as S.Schema<DbParameterGroupSummary>;
export type DbParameterGroupSummaryList = DbParameterGroupSummary[];
export const DbParameterGroupSummaryList = S.Array(DbParameterGroupSummary);
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(ResponseTagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface CreateDbClusterInput {
  name: string;
  username?: string | redacted.Redacted<string>;
  password?: string | redacted.Redacted<string>;
  organization?: string;
  bucket?: string;
  port?: number;
  dbParameterGroupIdentifier?: string;
  dbInstanceType: DbInstanceType;
  dbStorageType?: DbStorageType;
  allocatedStorage?: number;
  networkType?: NetworkType;
  publiclyAccessible?: boolean;
  vpcSubnetIds: string[];
  vpcSecurityGroupIds: string[];
  deploymentType?: ClusterDeploymentType;
  failoverMode?: FailoverMode;
  logDeliveryConfiguration?: LogDeliveryConfiguration;
  tags?: { [key: string]: string | undefined };
}
export const CreateDbClusterInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    username: S.optional(SensitiveString),
    password: S.optional(SensitiveString),
    organization: S.optional(S.String),
    bucket: S.optional(S.String),
    port: S.optional(S.Number),
    dbParameterGroupIdentifier: S.optional(S.String),
    dbInstanceType: DbInstanceType,
    dbStorageType: S.optional(DbStorageType),
    allocatedStorage: S.optional(S.Number),
    networkType: S.optional(NetworkType),
    publiclyAccessible: S.optional(S.Boolean),
    vpcSubnetIds: VpcSubnetIdList,
    vpcSecurityGroupIds: VpcSecurityGroupIdList,
    deploymentType: S.optional(ClusterDeploymentType),
    failoverMode: S.optional(FailoverMode),
    logDeliveryConfiguration: S.optional(LogDeliveryConfiguration),
    tags: S.optional(RequestTagMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateDbClusterInput",
}) as any as S.Schema<CreateDbClusterInput>;
export interface ListDbClustersOutput {
  items: DbClusterSummary[];
  nextToken?: string;
}
export const ListDbClustersOutput = S.suspend(() =>
  S.Struct({ items: DbClusterSummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListDbClustersOutput",
}) as any as S.Schema<ListDbClustersOutput>;
export interface ListDbInstancesForClusterOutput {
  items: DbInstanceForClusterSummary[];
  nextToken?: string;
}
export const ListDbInstancesForClusterOutput = S.suspend(() =>
  S.Struct({
    items: DbInstanceForClusterSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDbInstancesForClusterOutput",
}) as any as S.Schema<ListDbInstancesForClusterOutput>;
export interface ListDbInstancesOutput {
  items: DbInstanceSummary[];
  nextToken?: string;
}
export const ListDbInstancesOutput = S.suspend(() =>
  S.Struct({ items: DbInstanceSummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListDbInstancesOutput",
}) as any as S.Schema<ListDbInstancesOutput>;
export interface ListDbParameterGroupsOutput {
  items: DbParameterGroupSummary[];
  nextToken?: string;
}
export const ListDbParameterGroupsOutput = S.suspend(() =>
  S.Struct({
    items: DbParameterGroupSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDbParameterGroupsOutput",
}) as any as S.Schema<ListDbParameterGroupsOutput>;
export interface CreateDbClusterOutput {
  dbClusterId?: string;
  dbClusterStatus?: ClusterStatus;
}
export const CreateDbClusterOutput = S.suspend(() =>
  S.Struct({
    dbClusterId: S.optional(S.String),
    dbClusterStatus: S.optional(ClusterStatus),
  }),
).annotations({
  identifier: "CreateDbClusterOutput",
}) as any as S.Schema<CreateDbClusterOutput>;
export interface CreateDbParameterGroupInput {
  name: string;
  description?: string;
  parameters?: Parameters;
  tags?: { [key: string]: string | undefined };
}
export const CreateDbParameterGroupInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    parameters: S.optional(Parameters),
    tags: S.optional(RequestTagMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateDbParameterGroupInput",
}) as any as S.Schema<CreateDbParameterGroupInput>;
export interface CreateDbParameterGroupOutput {
  id: string;
  name: string;
  arn: string;
  description?: string;
  parameters?: Parameters;
}
export const CreateDbParameterGroupOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    arn: S.String,
    description: S.optional(S.String),
    parameters: S.optional(Parameters),
  }),
).annotations({
  identifier: "CreateDbParameterGroupOutput",
}) as any as S.Schema<CreateDbParameterGroupOutput>;
export type ValidationExceptionReason =
  | "FIELD_VALIDATION_FAILED"
  | "OTHER"
  | (string & {});
export const ValidationExceptionReason = S.String;

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withBadRequestError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
).pipe(C.withQuotaError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withConflictError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String, reason: ValidationExceptionReason },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Removes the tag from the specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * A list of tags applied to the resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Tags are composed of a Key/Value pairs. You can use tags to categorize and track your Timestream for InfluxDB resources.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  ResourceNotFoundException | ServiceQuotaExceededException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ResourceNotFoundException, ServiceQuotaExceededException],
}));
/**
 * Retrieves information about a Timestream for InfluxDB cluster.
 */
export const getDbCluster: (
  input: GetDbClusterInput,
) => effect.Effect<
  GetDbClusterOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDbClusterInput,
  output: GetDbClusterOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new Timestream for InfluxDB DB parameter group to associate with DB instances.
 */
export const createDbParameterGroup: (
  input: CreateDbParameterGroupInput,
) => effect.Effect<
  CreateDbParameterGroupOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDbParameterGroupInput,
  output: CreateDbParameterGroupOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a Timestream for InfluxDB cluster.
 */
export const updateDbCluster: (
  input: UpdateDbClusterInput,
) => effect.Effect<
  UpdateDbClusterOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDbClusterInput,
  output: UpdateDbClusterOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of Timestream for InfluxDB DB clusters.
 */
export const listDbClusters: {
  (
    input: ListDbClustersInput,
  ): effect.Effect<
    ListDbClustersOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDbClustersInput,
  ) => stream.Stream<
    ListDbClustersOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDbClustersInput,
  ) => stream.Stream<
    DbClusterSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDbClustersInput,
  output: ListDbClustersOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of Timestream for InfluxDB clusters.
 */
export const listDbInstancesForCluster: {
  (
    input: ListDbInstancesForClusterInput,
  ): effect.Effect<
    ListDbInstancesForClusterOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDbInstancesForClusterInput,
  ) => stream.Stream<
    ListDbInstancesForClusterOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDbInstancesForClusterInput,
  ) => stream.Stream<
    DbInstanceForClusterSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDbInstancesForClusterInput,
  output: ListDbInstancesForClusterOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of Timestream for InfluxDB DB instances.
 */
export const listDbInstances: {
  (
    input: ListDbInstancesInput,
  ): effect.Effect<
    ListDbInstancesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDbInstancesInput,
  ) => stream.Stream<
    ListDbInstancesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDbInstancesInput,
  ) => stream.Stream<
    DbInstanceSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDbInstancesInput,
  output: ListDbInstancesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of Timestream for InfluxDB DB parameter groups.
 */
export const listDbParameterGroups: {
  (
    input: ListDbParameterGroupsInput,
  ): effect.Effect<
    ListDbParameterGroupsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDbParameterGroupsInput,
  ) => stream.Stream<
    ListDbParameterGroupsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDbParameterGroupsInput,
  ) => stream.Stream<
    DbParameterGroupSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDbParameterGroupsInput,
  output: ListDbParameterGroupsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a Timestream for InfluxDB DB instance.
 */
export const getDbInstance: (
  input: GetDbInstanceInput,
) => effect.Effect<
  GetDbInstanceOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDbInstanceInput,
  output: GetDbInstanceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a Timestream for InfluxDB DB parameter group.
 */
export const getDbParameterGroup: (
  input: GetDbParameterGroupInput,
) => effect.Effect<
  GetDbParameterGroupOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDbParameterGroupInput,
  output: GetDbParameterGroupOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a Timestream for InfluxDB cluster.
 */
export const deleteDbCluster: (
  input: DeleteDbClusterInput,
) => effect.Effect<
  DeleteDbClusterOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDbClusterInput,
  output: DeleteDbClusterOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Reboots a Timestream for InfluxDB cluster.
 */
export const rebootDbCluster: (
  input: RebootDbClusterInput,
) => effect.Effect<
  RebootDbClusterOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootDbClusterInput,
  output: RebootDbClusterOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new Timestream for InfluxDB DB instance.
 */
export const createDbInstance: (
  input: CreateDbInstanceInput,
) => effect.Effect<
  CreateDbInstanceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDbInstanceInput,
  output: CreateDbInstanceOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a Timestream for InfluxDB DB instance.
 */
export const updateDbInstance: (
  input: UpdateDbInstanceInput,
) => effect.Effect<
  UpdateDbInstanceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDbInstanceInput,
  output: UpdateDbInstanceOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a Timestream for InfluxDB DB instance.
 */
export const deleteDbInstance: (
  input: DeleteDbInstanceInput,
) => effect.Effect<
  DeleteDbInstanceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDbInstanceInput,
  output: DeleteDbInstanceOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Reboots a Timestream for InfluxDB instance.
 */
export const rebootDbInstance: (
  input: RebootDbInstanceInput,
) => effect.Effect<
  RebootDbInstanceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootDbInstanceInput,
  output: RebootDbInstanceOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new Timestream for InfluxDB cluster.
 */
export const createDbCluster: (
  input: CreateDbClusterInput,
) => effect.Effect<
  CreateDbClusterOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDbClusterInput,
  output: CreateDbClusterOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
