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
const svc = T.AwsApiService({ sdkId: "MWAA", serviceShapeName: "AmazonMWAA" });
const auth = T.AwsAuthSigv4({ name: "airflow" });
const ver = T.ServiceVersion("2020-07-01");
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
              `https://airflow-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://airflow-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://airflow.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://airflow.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type EnvironmentName = string;
export type IamRoleArn = string;
export type S3BucketArn = string;
export type RelativePath = string;
export type S3ObjectVersion = string;
export type EnvironmentClass = string;
export type MaxWorkers = number;
export type KmsKey = string;
export type AirflowVersion = string;
export type WeeklyMaintenanceWindowStart = string;
export type WebserverAccessMode = string;
export type MinWorkers = number;
export type Schedulers = number;
export type EndpointManagement = string;
export type MinWebservers = number;
export type MaxWebservers = number;
export type RestApiPath = string;
export type RestApiMethod = string;
export type RestApiRequestBody = unknown;
export type NextToken = string;
export type EnvironmentArn = string;
export type TagKey = string;
export type WorkerReplacementStrategy = string;
export type SubnetId = string;
export type SecurityGroupId = string;
export type ConfigKey = string;
export type ConfigValue = string | redacted.Redacted<string>;
export type TagValue = string;
export type Unit = string;
export type Token = string | redacted.Redacted<string>;
export type Hostname = string;
export type IamIdentity = string;
export type AirflowIdentity = string;
export type RestApiResponse = unknown;
export type LoggingEnabled = boolean;
export type LoggingLevel = string;
export type EnvironmentStatus = string;
export type CreatedAt = Date;
export type WebserverUrl = string;
export type VpcEndpointServiceName = string;
export type CeleryExecutorQueue = string;
export type UpdateStatus = string;
export type UpdateCreatedAt = Date;
export type UpdateSource = string;
export type CloudWatchLogGroupArn = string;
export type ErrorCode = string;
export type ErrorMessage = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface CreateCliTokenRequest {
  Name: string;
}
export const CreateCliTokenRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/clitoken/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCliTokenRequest",
}) as any as S.Schema<CreateCliTokenRequest>;
export interface CreateWebLoginTokenRequest {
  Name: string;
}
export const CreateWebLoginTokenRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/webtoken/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateWebLoginTokenRequest",
}) as any as S.Schema<CreateWebLoginTokenRequest>;
export interface DeleteEnvironmentInput {
  Name: string;
}
export const DeleteEnvironmentInput = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/environments/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEnvironmentInput",
}) as any as S.Schema<DeleteEnvironmentInput>;
export interface DeleteEnvironmentOutput {}
export const DeleteEnvironmentOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEnvironmentOutput",
}) as any as S.Schema<DeleteEnvironmentOutput>;
export interface GetEnvironmentInput {
  Name: string;
}
export const GetEnvironmentInput = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/environments/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEnvironmentInput",
}) as any as S.Schema<GetEnvironmentInput>;
export interface InvokeRestApiRequest {
  Name: string;
  Path: string;
  Method: string;
  QueryParameters?: any;
  Body?: any;
}
export const InvokeRestApiRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    Path: S.String,
    Method: S.String,
    QueryParameters: S.optional(S.Any),
    Body: S.optional(S.Any),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/restapi/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "InvokeRestApiRequest",
}) as any as S.Schema<InvokeRestApiRequest>;
export interface ListEnvironmentsInput {
  NextToken?: string;
  MaxResults?: number;
}
export const ListEnvironmentsInput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/environments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEnvironmentsInput",
}) as any as S.Schema<ListEnvironmentsInput>;
export interface ListTagsForResourceInput {
  ResourceArn: string;
}
export const ListTagsForResourceInput = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceInput",
}) as any as S.Schema<ListTagsForResourceInput>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface TagResourceInput {
  ResourceArn: string;
  Tags: { [key: string]: string };
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: TagMap,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceInput",
}) as any as S.Schema<TagResourceInput>;
export interface TagResourceOutput {}
export const TagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceOutput",
}) as any as S.Schema<TagResourceOutput>;
export interface UntagResourceInput {
  ResourceArn: string;
  tagKeys: string[];
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceInput",
}) as any as S.Schema<UntagResourceInput>;
export interface UntagResourceOutput {}
export const UntagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceOutput",
}) as any as S.Schema<UntagResourceOutput>;
export type SubnetList = string[];
export const SubnetList = S.Array(S.String);
export type SecurityGroupList = string[];
export const SecurityGroupList = S.Array(S.String);
export interface NetworkConfiguration {
  SubnetIds?: string[];
  SecurityGroupIds?: string[];
}
export const NetworkConfiguration = S.suspend(() =>
  S.Struct({
    SubnetIds: S.optional(SubnetList),
    SecurityGroupIds: S.optional(SecurityGroupList),
  }),
).annotations({
  identifier: "NetworkConfiguration",
}) as any as S.Schema<NetworkConfiguration>;
export type AirflowConfigurationOptions = {
  [key: string]: string | redacted.Redacted<string>;
};
export const AirflowConfigurationOptions = S.Record({
  key: S.String,
  value: SensitiveString,
});
export type EnvironmentList = string[];
export const EnvironmentList = S.Array(S.String);
export interface UpdateNetworkConfigurationInput {
  SecurityGroupIds: string[];
}
export const UpdateNetworkConfigurationInput = S.suspend(() =>
  S.Struct({ SecurityGroupIds: SecurityGroupList }),
).annotations({
  identifier: "UpdateNetworkConfigurationInput",
}) as any as S.Schema<UpdateNetworkConfigurationInput>;
export interface CreateCliTokenResponse {
  CliToken?: string | redacted.Redacted<string>;
  WebServerHostname?: string;
}
export const CreateCliTokenResponse = S.suspend(() =>
  S.Struct({
    CliToken: S.optional(SensitiveString),
    WebServerHostname: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateCliTokenResponse",
}) as any as S.Schema<CreateCliTokenResponse>;
export interface CreateWebLoginTokenResponse {
  WebToken?: string | redacted.Redacted<string>;
  WebServerHostname?: string;
  IamIdentity?: string;
  AirflowIdentity?: string;
}
export const CreateWebLoginTokenResponse = S.suspend(() =>
  S.Struct({
    WebToken: S.optional(SensitiveString),
    WebServerHostname: S.optional(S.String),
    IamIdentity: S.optional(S.String),
    AirflowIdentity: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateWebLoginTokenResponse",
}) as any as S.Schema<CreateWebLoginTokenResponse>;
export interface InvokeRestApiResponse {
  RestApiStatusCode?: number;
  RestApiResponse?: any;
}
export const InvokeRestApiResponse = S.suspend(() =>
  S.Struct({
    RestApiStatusCode: S.optional(S.Number),
    RestApiResponse: S.optional(S.Any),
  }),
).annotations({
  identifier: "InvokeRestApiResponse",
}) as any as S.Schema<InvokeRestApiResponse>;
export interface ListEnvironmentsOutput {
  Environments: string[];
  NextToken?: string;
}
export const ListEnvironmentsOutput = S.suspend(() =>
  S.Struct({ Environments: EnvironmentList, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListEnvironmentsOutput",
}) as any as S.Schema<ListEnvironmentsOutput>;
export interface ListTagsForResourceOutput {
  Tags?: { [key: string]: string };
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface ModuleLoggingConfigurationInput {
  Enabled: boolean;
  LogLevel: string;
}
export const ModuleLoggingConfigurationInput = S.suspend(() =>
  S.Struct({ Enabled: S.Boolean, LogLevel: S.String }),
).annotations({
  identifier: "ModuleLoggingConfigurationInput",
}) as any as S.Schema<ModuleLoggingConfigurationInput>;
export interface LoggingConfigurationInput {
  DagProcessingLogs?: ModuleLoggingConfigurationInput;
  SchedulerLogs?: ModuleLoggingConfigurationInput;
  WebserverLogs?: ModuleLoggingConfigurationInput;
  WorkerLogs?: ModuleLoggingConfigurationInput;
  TaskLogs?: ModuleLoggingConfigurationInput;
}
export const LoggingConfigurationInput = S.suspend(() =>
  S.Struct({
    DagProcessingLogs: S.optional(ModuleLoggingConfigurationInput),
    SchedulerLogs: S.optional(ModuleLoggingConfigurationInput),
    WebserverLogs: S.optional(ModuleLoggingConfigurationInput),
    WorkerLogs: S.optional(ModuleLoggingConfigurationInput),
    TaskLogs: S.optional(ModuleLoggingConfigurationInput),
  }),
).annotations({
  identifier: "LoggingConfigurationInput",
}) as any as S.Schema<LoggingConfigurationInput>;
export interface UpdateEnvironmentInput {
  Name: string;
  ExecutionRoleArn?: string;
  AirflowConfigurationOptions?: {
    [key: string]: string | redacted.Redacted<string>;
  };
  AirflowVersion?: string;
  DagS3Path?: string;
  EnvironmentClass?: string;
  LoggingConfiguration?: LoggingConfigurationInput;
  MaxWorkers?: number;
  MinWorkers?: number;
  MaxWebservers?: number;
  MinWebservers?: number;
  WorkerReplacementStrategy?: string;
  NetworkConfiguration?: UpdateNetworkConfigurationInput;
  PluginsS3Path?: string;
  PluginsS3ObjectVersion?: string;
  RequirementsS3Path?: string;
  RequirementsS3ObjectVersion?: string;
  Schedulers?: number;
  SourceBucketArn?: string;
  StartupScriptS3Path?: string;
  StartupScriptS3ObjectVersion?: string;
  WebserverAccessMode?: string;
  WeeklyMaintenanceWindowStart?: string;
}
export const UpdateEnvironmentInput = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    ExecutionRoleArn: S.optional(S.String),
    AirflowConfigurationOptions: S.optional(AirflowConfigurationOptions),
    AirflowVersion: S.optional(S.String),
    DagS3Path: S.optional(S.String),
    EnvironmentClass: S.optional(S.String),
    LoggingConfiguration: S.optional(LoggingConfigurationInput),
    MaxWorkers: S.optional(S.Number),
    MinWorkers: S.optional(S.Number),
    MaxWebservers: S.optional(S.Number),
    MinWebservers: S.optional(S.Number),
    WorkerReplacementStrategy: S.optional(S.String),
    NetworkConfiguration: S.optional(UpdateNetworkConfigurationInput),
    PluginsS3Path: S.optional(S.String),
    PluginsS3ObjectVersion: S.optional(S.String),
    RequirementsS3Path: S.optional(S.String),
    RequirementsS3ObjectVersion: S.optional(S.String),
    Schedulers: S.optional(S.Number),
    SourceBucketArn: S.optional(S.String),
    StartupScriptS3Path: S.optional(S.String),
    StartupScriptS3ObjectVersion: S.optional(S.String),
    WebserverAccessMode: S.optional(S.String),
    WeeklyMaintenanceWindowStart: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/environments/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEnvironmentInput",
}) as any as S.Schema<UpdateEnvironmentInput>;
export interface Dimension {
  Name: string;
  Value: string;
}
export const Dimension = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String }),
).annotations({ identifier: "Dimension" }) as any as S.Schema<Dimension>;
export type Dimensions = Dimension[];
export const Dimensions = S.Array(Dimension);
export interface StatisticSet {
  SampleCount?: number;
  Sum?: number;
  Minimum?: number;
  Maximum?: number;
}
export const StatisticSet = S.suspend(() =>
  S.Struct({
    SampleCount: S.optional(S.Number),
    Sum: S.optional(S.Number),
    Minimum: S.optional(S.Number),
    Maximum: S.optional(S.Number),
  }),
).annotations({ identifier: "StatisticSet" }) as any as S.Schema<StatisticSet>;
export interface MetricDatum {
  MetricName: string;
  Timestamp: Date;
  Dimensions?: Dimension[];
  Value?: number;
  Unit?: string;
  StatisticValues?: StatisticSet;
}
export const MetricDatum = S.suspend(() =>
  S.Struct({
    MetricName: S.String,
    Timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Dimensions: S.optional(Dimensions),
    Value: S.optional(S.Number),
    Unit: S.optional(S.String),
    StatisticValues: S.optional(StatisticSet),
  }),
).annotations({ identifier: "MetricDatum" }) as any as S.Schema<MetricDatum>;
export type MetricData = MetricDatum[];
export const MetricData = S.Array(MetricDatum);
export interface CreateEnvironmentInput {
  Name: string;
  ExecutionRoleArn: string;
  SourceBucketArn: string;
  DagS3Path: string;
  NetworkConfiguration: NetworkConfiguration;
  PluginsS3Path?: string;
  PluginsS3ObjectVersion?: string;
  RequirementsS3Path?: string;
  RequirementsS3ObjectVersion?: string;
  StartupScriptS3Path?: string;
  StartupScriptS3ObjectVersion?: string;
  AirflowConfigurationOptions?: {
    [key: string]: string | redacted.Redacted<string>;
  };
  EnvironmentClass?: string;
  MaxWorkers?: number;
  KmsKey?: string;
  AirflowVersion?: string;
  LoggingConfiguration?: LoggingConfigurationInput;
  WeeklyMaintenanceWindowStart?: string;
  Tags?: { [key: string]: string };
  WebserverAccessMode?: string;
  MinWorkers?: number;
  Schedulers?: number;
  EndpointManagement?: string;
  MinWebservers?: number;
  MaxWebservers?: number;
}
export const CreateEnvironmentInput = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    ExecutionRoleArn: S.String,
    SourceBucketArn: S.String,
    DagS3Path: S.String,
    NetworkConfiguration: NetworkConfiguration,
    PluginsS3Path: S.optional(S.String),
    PluginsS3ObjectVersion: S.optional(S.String),
    RequirementsS3Path: S.optional(S.String),
    RequirementsS3ObjectVersion: S.optional(S.String),
    StartupScriptS3Path: S.optional(S.String),
    StartupScriptS3ObjectVersion: S.optional(S.String),
    AirflowConfigurationOptions: S.optional(AirflowConfigurationOptions),
    EnvironmentClass: S.optional(S.String),
    MaxWorkers: S.optional(S.Number),
    KmsKey: S.optional(S.String),
    AirflowVersion: S.optional(S.String),
    LoggingConfiguration: S.optional(LoggingConfigurationInput),
    WeeklyMaintenanceWindowStart: S.optional(S.String),
    Tags: S.optional(TagMap),
    WebserverAccessMode: S.optional(S.String),
    MinWorkers: S.optional(S.Number),
    Schedulers: S.optional(S.Number),
    EndpointManagement: S.optional(S.String),
    MinWebservers: S.optional(S.Number),
    MaxWebservers: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/environments/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEnvironmentInput",
}) as any as S.Schema<CreateEnvironmentInput>;
export interface PublishMetricsInput {
  EnvironmentName: string;
  MetricData: MetricDatum[];
}
export const PublishMetricsInput = S.suspend(() =>
  S.Struct({
    EnvironmentName: S.String.pipe(T.HttpLabel("EnvironmentName")),
    MetricData: MetricData,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/metrics/environments/{EnvironmentName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PublishMetricsInput",
}) as any as S.Schema<PublishMetricsInput>;
export interface PublishMetricsOutput {}
export const PublishMetricsOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "PublishMetricsOutput",
}) as any as S.Schema<PublishMetricsOutput>;
export interface UpdateEnvironmentOutput {
  Arn?: string;
}
export const UpdateEnvironmentOutput = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateEnvironmentOutput",
}) as any as S.Schema<UpdateEnvironmentOutput>;
export interface ModuleLoggingConfiguration {
  Enabled?: boolean;
  LogLevel?: string;
  CloudWatchLogGroupArn?: string;
}
export const ModuleLoggingConfiguration = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    LogLevel: S.optional(S.String),
    CloudWatchLogGroupArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ModuleLoggingConfiguration",
}) as any as S.Schema<ModuleLoggingConfiguration>;
export interface UpdateError {
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const UpdateError = S.suspend(() =>
  S.Struct({
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "UpdateError" }) as any as S.Schema<UpdateError>;
export interface CreateEnvironmentOutput {
  Arn?: string;
}
export const CreateEnvironmentOutput = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "CreateEnvironmentOutput",
}) as any as S.Schema<CreateEnvironmentOutput>;
export interface LoggingConfiguration {
  DagProcessingLogs?: ModuleLoggingConfiguration;
  SchedulerLogs?: ModuleLoggingConfiguration;
  WebserverLogs?: ModuleLoggingConfiguration;
  WorkerLogs?: ModuleLoggingConfiguration;
  TaskLogs?: ModuleLoggingConfiguration;
}
export const LoggingConfiguration = S.suspend(() =>
  S.Struct({
    DagProcessingLogs: S.optional(ModuleLoggingConfiguration),
    SchedulerLogs: S.optional(ModuleLoggingConfiguration),
    WebserverLogs: S.optional(ModuleLoggingConfiguration),
    WorkerLogs: S.optional(ModuleLoggingConfiguration),
    TaskLogs: S.optional(ModuleLoggingConfiguration),
  }),
).annotations({
  identifier: "LoggingConfiguration",
}) as any as S.Schema<LoggingConfiguration>;
export interface LastUpdate {
  Status?: string;
  CreatedAt?: Date;
  Error?: UpdateError;
  Source?: string;
  WorkerReplacementStrategy?: string;
}
export const LastUpdate = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Error: S.optional(UpdateError),
    Source: S.optional(S.String),
    WorkerReplacementStrategy: S.optional(S.String),
  }),
).annotations({ identifier: "LastUpdate" }) as any as S.Schema<LastUpdate>;
export interface Environment {
  Name?: string;
  Status?: string;
  Arn?: string;
  CreatedAt?: Date;
  WebserverUrl?: string;
  ExecutionRoleArn?: string;
  ServiceRoleArn?: string;
  KmsKey?: string;
  AirflowVersion?: string;
  SourceBucketArn?: string;
  DagS3Path?: string;
  PluginsS3Path?: string;
  PluginsS3ObjectVersion?: string;
  RequirementsS3Path?: string;
  RequirementsS3ObjectVersion?: string;
  StartupScriptS3Path?: string;
  StartupScriptS3ObjectVersion?: string;
  AirflowConfigurationOptions?: {
    [key: string]: string | redacted.Redacted<string>;
  };
  EnvironmentClass?: string;
  MaxWorkers?: number;
  NetworkConfiguration?: NetworkConfiguration;
  LoggingConfiguration?: LoggingConfiguration;
  LastUpdate?: LastUpdate;
  WeeklyMaintenanceWindowStart?: string;
  Tags?: { [key: string]: string };
  WebserverAccessMode?: string;
  MinWorkers?: number;
  Schedulers?: number;
  WebserverVpcEndpointService?: string;
  DatabaseVpcEndpointService?: string;
  CeleryExecutorQueue?: string;
  EndpointManagement?: string;
  MinWebservers?: number;
  MaxWebservers?: number;
}
export const Environment = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    Arn: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    WebserverUrl: S.optional(S.String),
    ExecutionRoleArn: S.optional(S.String),
    ServiceRoleArn: S.optional(S.String),
    KmsKey: S.optional(S.String),
    AirflowVersion: S.optional(S.String),
    SourceBucketArn: S.optional(S.String),
    DagS3Path: S.optional(S.String),
    PluginsS3Path: S.optional(S.String),
    PluginsS3ObjectVersion: S.optional(S.String),
    RequirementsS3Path: S.optional(S.String),
    RequirementsS3ObjectVersion: S.optional(S.String),
    StartupScriptS3Path: S.optional(S.String),
    StartupScriptS3ObjectVersion: S.optional(S.String),
    AirflowConfigurationOptions: S.optional(AirflowConfigurationOptions),
    EnvironmentClass: S.optional(S.String),
    MaxWorkers: S.optional(S.Number),
    NetworkConfiguration: S.optional(NetworkConfiguration),
    LoggingConfiguration: S.optional(LoggingConfiguration),
    LastUpdate: S.optional(LastUpdate),
    WeeklyMaintenanceWindowStart: S.optional(S.String),
    Tags: S.optional(TagMap),
    WebserverAccessMode: S.optional(S.String),
    MinWorkers: S.optional(S.Number),
    Schedulers: S.optional(S.Number),
    WebserverVpcEndpointService: S.optional(S.String),
    DatabaseVpcEndpointService: S.optional(S.String),
    CeleryExecutorQueue: S.optional(S.String),
    EndpointManagement: S.optional(S.String),
    MinWebservers: S.optional(S.Number),
    MaxWebservers: S.optional(S.Number),
  }),
).annotations({ identifier: "Environment" }) as any as S.Schema<Environment>;
export interface GetEnvironmentOutput {
  Environment?: Environment;
}
export const GetEnvironmentOutput = S.suspend(() =>
  S.Struct({ Environment: S.optional(Environment) }),
).annotations({
  identifier: "GetEnvironmentOutput",
}) as any as S.Schema<GetEnvironmentOutput>;

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class RestApiClientException extends S.TaggedError<RestApiClientException>()(
  "RestApiClientException",
  {
    RestApiStatusCode: S.optional(S.Number),
    RestApiResponse: S.optional(S.Any),
  },
).pipe(C.withBadRequestError) {}
export class RestApiServerException extends S.TaggedError<RestApiServerException>()(
  "RestApiServerException",
  {
    RestApiStatusCode: S.optional(S.Number),
    RestApiResponse: S.optional(S.Any),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Creates a CLI token for the Airflow CLI. To learn more, see Creating an Apache Airflow CLI token.
 */
export const createCliToken: (
  input: CreateCliTokenRequest,
) => effect.Effect<
  CreateCliTokenResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCliTokenRequest,
  output: CreateCliTokenResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Lists the Amazon Managed Workflows for Apache Airflow (MWAA) environments.
 */
export const listEnvironments: {
  (
    input: ListEnvironmentsInput,
  ): effect.Effect<
    ListEnvironmentsOutput,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEnvironmentsInput,
  ) => stream.Stream<
    ListEnvironmentsOutput,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEnvironmentsInput,
  ) => stream.Stream<
    EnvironmentName,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEnvironmentsInput,
  output: ListEnvironmentsOutput,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Environments",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * **Internal only**. Publishes environment health metrics to Amazon CloudWatch.
 */
export const publishMetrics: (
  input: PublishMetricsInput,
) => effect.Effect<
  PublishMetricsOutput,
  InternalServerException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PublishMetricsInput,
  output: PublishMetricsOutput,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Updates an Amazon Managed Workflows for Apache Airflow (MWAA) environment.
 */
export const updateEnvironment: (
  input: UpdateEnvironmentInput,
) => effect.Effect<
  UpdateEnvironmentOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEnvironmentInput,
  output: UpdateEnvironmentOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes an Amazon Managed Workflows for Apache Airflow (Amazon MWAA) environment.
 */
export const deleteEnvironment: (
  input: DeleteEnvironmentInput,
) => effect.Effect<
  DeleteEnvironmentOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentInput,
  output: DeleteEnvironmentOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the key-value tag pairs associated to the Amazon Managed Workflows for Apache Airflow (MWAA) environment. For example, `"Environment": "Staging"`.
 */
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => effect.Effect<
  ListTagsForResourceOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Associates key-value tag pairs to your Amazon Managed Workflows for Apache Airflow (MWAA) environment.
 */
export const tagResource: (
  input: TagResourceInput,
) => effect.Effect<
  TagResourceOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes key-value tag pairs associated to your Amazon Managed Workflows for Apache Airflow (MWAA) environment. For example, `"Environment": "Staging"`.
 */
export const untagResource: (
  input: UntagResourceInput,
) => effect.Effect<
  UntagResourceOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a web login token for the Airflow Web UI. To learn more, see Creating an Apache Airflow web login token.
 */
export const createWebLoginToken: (
  input: CreateWebLoginTokenRequest,
) => effect.Effect<
  CreateWebLoginTokenResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWebLoginTokenRequest,
  output: CreateWebLoginTokenResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon Managed Workflows for Apache Airflow (Amazon MWAA) environment.
 */
export const createEnvironment: (
  input: CreateEnvironmentInput,
) => effect.Effect<
  CreateEnvironmentOutput,
  InternalServerException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEnvironmentInput,
  output: CreateEnvironmentOutput,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Describes an Amazon Managed Workflows for Apache Airflow (MWAA) environment.
 */
export const getEnvironment: (
  input: GetEnvironmentInput,
) => effect.Effect<
  GetEnvironmentOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnvironmentInput,
  output: GetEnvironmentOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Invokes the Apache Airflow REST API on the webserver with the specified inputs. To
 * learn more, see Using the Apache Airflow REST API
 */
export const invokeRestApi: (
  input: InvokeRestApiRequest,
) => effect.Effect<
  InvokeRestApiResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | RestApiClientException
  | RestApiServerException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InvokeRestApiRequest,
  output: InvokeRestApiResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    RestApiClientException,
    RestApiServerException,
    ValidationException,
  ],
}));
