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
  sdkId: "KafkaConnect",
  serviceShapeName: "KafkaConnect",
});
const auth = T.AwsAuthSigv4({ name: "kafkaconnect" });
const ver = T.ServiceVersion("2021-09-14");
const proto = T.AwsProtocolsRestJson1();
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
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e(
            `https://kafkaconnect.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://kafkaconnect.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://kafkaconnect-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true && UseDualStack === false) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://kafkaconnect-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseFIPS === false && UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://kafkaconnect.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://kafkaconnect.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type __stringMax1024 = string;
export type __stringMin1Max128 = string;
export type NetworkType = string;
export type CustomPluginContentType = string;
export type __sensitiveString = string | redacted.Redacted<string>;
export type MaxResults = number;
export type TagKey = string;
export type KafkaClusterClientAuthenticationType = string;
export type KafkaClusterEncryptionInTransitType = string;
export type __longMin1 = number;
export type TagValue = string;
export type __timestampIso8601 = Date;
export type WorkerConfigurationState = string;
export type ConnectorState = string;
export type CustomPluginState = string;
export type ConnectorOperationState = string;
export type ConnectorOperationType = string;
export type __integerMin1Max8 = number;
export type ConnectorOperationStepType = string;
export type ConnectorOperationStepState = string;
export type __integerMin1Max100 = number;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface CreateWorkerConfigurationRequest {
  description?: string;
  name: string;
  propertiesFileContent: string | redacted.Redacted<string>;
  tags?: { [key: string]: string };
}
export const CreateWorkerConfigurationRequest = S.suspend(() =>
  S.Struct({
    description: S.optional(S.String),
    name: S.String,
    propertiesFileContent: SensitiveString,
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/worker-configurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateWorkerConfigurationRequest",
}) as any as S.Schema<CreateWorkerConfigurationRequest>;
export interface DeleteConnectorRequest {
  connectorArn: string;
  currentVersion?: string;
}
export const DeleteConnectorRequest = S.suspend(() =>
  S.Struct({
    connectorArn: S.String.pipe(T.HttpLabel("connectorArn")),
    currentVersion: S.optional(S.String).pipe(T.HttpQuery("currentVersion")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/connectors/{connectorArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConnectorRequest",
}) as any as S.Schema<DeleteConnectorRequest>;
export interface DeleteCustomPluginRequest {
  customPluginArn: string;
}
export const DeleteCustomPluginRequest = S.suspend(() =>
  S.Struct({
    customPluginArn: S.String.pipe(T.HttpLabel("customPluginArn")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/custom-plugins/{customPluginArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCustomPluginRequest",
}) as any as S.Schema<DeleteCustomPluginRequest>;
export interface DeleteWorkerConfigurationRequest {
  workerConfigurationArn: string;
}
export const DeleteWorkerConfigurationRequest = S.suspend(() =>
  S.Struct({
    workerConfigurationArn: S.String.pipe(
      T.HttpLabel("workerConfigurationArn"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/worker-configurations/{workerConfigurationArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteWorkerConfigurationRequest",
}) as any as S.Schema<DeleteWorkerConfigurationRequest>;
export interface DescribeConnectorRequest {
  connectorArn: string;
}
export const DescribeConnectorRequest = S.suspend(() =>
  S.Struct({ connectorArn: S.String.pipe(T.HttpLabel("connectorArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/connectors/{connectorArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConnectorRequest",
}) as any as S.Schema<DescribeConnectorRequest>;
export interface DescribeConnectorOperationRequest {
  connectorOperationArn: string;
}
export const DescribeConnectorOperationRequest = S.suspend(() =>
  S.Struct({
    connectorOperationArn: S.String.pipe(T.HttpLabel("connectorOperationArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v1/connectorOperations/{connectorOperationArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConnectorOperationRequest",
}) as any as S.Schema<DescribeConnectorOperationRequest>;
export interface DescribeCustomPluginRequest {
  customPluginArn: string;
}
export const DescribeCustomPluginRequest = S.suspend(() =>
  S.Struct({
    customPluginArn: S.String.pipe(T.HttpLabel("customPluginArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/custom-plugins/{customPluginArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeCustomPluginRequest",
}) as any as S.Schema<DescribeCustomPluginRequest>;
export interface DescribeWorkerConfigurationRequest {
  workerConfigurationArn: string;
}
export const DescribeWorkerConfigurationRequest = S.suspend(() =>
  S.Struct({
    workerConfigurationArn: S.String.pipe(
      T.HttpLabel("workerConfigurationArn"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v1/worker-configurations/{workerConfigurationArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeWorkerConfigurationRequest",
}) as any as S.Schema<DescribeWorkerConfigurationRequest>;
export interface ListConnectorOperationsRequest {
  connectorArn: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListConnectorOperationsRequest = S.suspend(() =>
  S.Struct({
    connectorArn: S.String.pipe(T.HttpLabel("connectorArn")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v1/connectors/{connectorArn}/operations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConnectorOperationsRequest",
}) as any as S.Schema<ListConnectorOperationsRequest>;
export interface ListConnectorsRequest {
  connectorNamePrefix?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListConnectorsRequest = S.suspend(() =>
  S.Struct({
    connectorNamePrefix: S.optional(S.String).pipe(
      T.HttpQuery("connectorNamePrefix"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/connectors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConnectorsRequest",
}) as any as S.Schema<ListConnectorsRequest>;
export interface ListCustomPluginsRequest {
  maxResults?: number;
  nextToken?: string;
  namePrefix?: string;
}
export const ListCustomPluginsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    namePrefix: S.optional(S.String).pipe(T.HttpQuery("namePrefix")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/custom-plugins" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCustomPluginsRequest",
}) as any as S.Schema<ListCustomPluginsRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/tags/{resourceArn}" }),
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
export interface ListWorkerConfigurationsRequest {
  maxResults?: number;
  nextToken?: string;
  namePrefix?: string;
}
export const ListWorkerConfigurationsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    namePrefix: S.optional(S.String).pipe(T.HttpQuery("namePrefix")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/worker-configurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListWorkerConfigurationsRequest",
}) as any as S.Schema<ListWorkerConfigurationsRequest>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: Tags,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/tags/{resourceArn}" }),
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
      T.Http({ method: "DELETE", uri: "/v1/tags/{resourceArn}" }),
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
export type ConnectorConfiguration = { [key: string]: string };
export const ConnectorConfiguration = S.Record({
  key: S.String,
  value: S.String,
});
export interface KafkaClusterClientAuthentication {
  authenticationType: string;
}
export const KafkaClusterClientAuthentication = S.suspend(() =>
  S.Struct({ authenticationType: S.String }),
).annotations({
  identifier: "KafkaClusterClientAuthentication",
}) as any as S.Schema<KafkaClusterClientAuthentication>;
export interface KafkaClusterEncryptionInTransit {
  encryptionType: string;
}
export const KafkaClusterEncryptionInTransit = S.suspend(() =>
  S.Struct({ encryptionType: S.String }),
).annotations({
  identifier: "KafkaClusterEncryptionInTransit",
}) as any as S.Schema<KafkaClusterEncryptionInTransit>;
export interface WorkerConfiguration {
  revision: number;
  workerConfigurationArn: string;
}
export const WorkerConfiguration = S.suspend(() =>
  S.Struct({ revision: S.Number, workerConfigurationArn: S.String }),
).annotations({
  identifier: "WorkerConfiguration",
}) as any as S.Schema<WorkerConfiguration>;
export type ConnectorConfigurationUpdate = { [key: string]: string };
export const ConnectorConfigurationUpdate = S.Record({
  key: S.String,
  value: S.String,
});
export interface DeleteConnectorResponse {
  connectorArn?: string;
  connectorState?: string;
}
export const DeleteConnectorResponse = S.suspend(() =>
  S.Struct({
    connectorArn: S.optional(S.String),
    connectorState: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteConnectorResponse",
}) as any as S.Schema<DeleteConnectorResponse>;
export interface DeleteCustomPluginResponse {
  customPluginArn?: string;
  customPluginState?: string;
}
export const DeleteCustomPluginResponse = S.suspend(() =>
  S.Struct({
    customPluginArn: S.optional(S.String),
    customPluginState: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteCustomPluginResponse",
}) as any as S.Schema<DeleteCustomPluginResponse>;
export interface DeleteWorkerConfigurationResponse {
  workerConfigurationArn?: string;
  workerConfigurationState?: string;
}
export const DeleteWorkerConfigurationResponse = S.suspend(() =>
  S.Struct({
    workerConfigurationArn: S.optional(S.String),
    workerConfigurationState: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteWorkerConfigurationResponse",
}) as any as S.Schema<DeleteWorkerConfigurationResponse>;
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ProvisionedCapacity {
  mcuCount: number;
  workerCount: number;
}
export const ProvisionedCapacity = S.suspend(() =>
  S.Struct({ mcuCount: S.Number, workerCount: S.Number }),
).annotations({
  identifier: "ProvisionedCapacity",
}) as any as S.Schema<ProvisionedCapacity>;
export interface CustomPlugin {
  customPluginArn: string;
  revision: number;
}
export const CustomPlugin = S.suspend(() =>
  S.Struct({ customPluginArn: S.String, revision: S.Number }),
).annotations({ identifier: "CustomPlugin" }) as any as S.Schema<CustomPlugin>;
export interface S3Location {
  bucketArn: string;
  fileKey: string;
  objectVersion?: string;
}
export const S3Location = S.suspend(() =>
  S.Struct({
    bucketArn: S.String,
    fileKey: S.String,
    objectVersion: S.optional(S.String),
  }),
).annotations({ identifier: "S3Location" }) as any as S.Schema<S3Location>;
export interface ProvisionedCapacityUpdate {
  mcuCount: number;
  workerCount: number;
}
export const ProvisionedCapacityUpdate = S.suspend(() =>
  S.Struct({ mcuCount: S.Number, workerCount: S.Number }),
).annotations({
  identifier: "ProvisionedCapacityUpdate",
}) as any as S.Schema<ProvisionedCapacityUpdate>;
export type __listOf__string = string[];
export const __listOf__string = S.Array(S.String);
export interface Plugin {
  customPlugin: CustomPlugin;
}
export const Plugin = S.suspend(() =>
  S.Struct({ customPlugin: CustomPlugin }),
).annotations({ identifier: "Plugin" }) as any as S.Schema<Plugin>;
export type __listOfPlugin = Plugin[];
export const __listOfPlugin = S.Array(Plugin);
export interface CustomPluginLocation {
  s3Location: S3Location;
}
export const CustomPluginLocation = S.suspend(() =>
  S.Struct({ s3Location: S3Location }),
).annotations({
  identifier: "CustomPluginLocation",
}) as any as S.Schema<CustomPluginLocation>;
export interface WorkerConfigurationRevisionSummary {
  creationTime?: Date;
  description?: string;
  revision?: number;
}
export const WorkerConfigurationRevisionSummary = S.suspend(() =>
  S.Struct({
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    description: S.optional(S.String),
    revision: S.optional(S.Number),
  }),
).annotations({
  identifier: "WorkerConfigurationRevisionSummary",
}) as any as S.Schema<WorkerConfigurationRevisionSummary>;
export interface KafkaClusterClientAuthenticationDescription {
  authenticationType?: string;
}
export const KafkaClusterClientAuthenticationDescription = S.suspend(() =>
  S.Struct({ authenticationType: S.optional(S.String) }),
).annotations({
  identifier: "KafkaClusterClientAuthenticationDescription",
}) as any as S.Schema<KafkaClusterClientAuthenticationDescription>;
export interface KafkaClusterEncryptionInTransitDescription {
  encryptionType?: string;
}
export const KafkaClusterEncryptionInTransitDescription = S.suspend(() =>
  S.Struct({ encryptionType: S.optional(S.String) }),
).annotations({
  identifier: "KafkaClusterEncryptionInTransitDescription",
}) as any as S.Schema<KafkaClusterEncryptionInTransitDescription>;
export interface WorkerConfigurationDescription {
  revision?: number;
  workerConfigurationArn?: string;
}
export const WorkerConfigurationDescription = S.suspend(() =>
  S.Struct({
    revision: S.optional(S.Number),
    workerConfigurationArn: S.optional(S.String),
  }),
).annotations({
  identifier: "WorkerConfigurationDescription",
}) as any as S.Schema<WorkerConfigurationDescription>;
export interface StateDescription {
  code?: string;
  message?: string;
}
export const StateDescription = S.suspend(() =>
  S.Struct({ code: S.optional(S.String), message: S.optional(S.String) }),
).annotations({
  identifier: "StateDescription",
}) as any as S.Schema<StateDescription>;
export interface ConnectorOperationStep {
  stepType?: string;
  stepState?: string;
}
export const ConnectorOperationStep = S.suspend(() =>
  S.Struct({ stepType: S.optional(S.String), stepState: S.optional(S.String) }),
).annotations({
  identifier: "ConnectorOperationStep",
}) as any as S.Schema<ConnectorOperationStep>;
export type __listOfConnectorOperationStep = ConnectorOperationStep[];
export const __listOfConnectorOperationStep = S.Array(ConnectorOperationStep);
export interface ScaleInPolicyDescription {
  cpuUtilizationPercentage?: number;
}
export const ScaleInPolicyDescription = S.suspend(() =>
  S.Struct({ cpuUtilizationPercentage: S.optional(S.Number) }),
).annotations({
  identifier: "ScaleInPolicyDescription",
}) as any as S.Schema<ScaleInPolicyDescription>;
export interface ScaleOutPolicyDescription {
  cpuUtilizationPercentage?: number;
}
export const ScaleOutPolicyDescription = S.suspend(() =>
  S.Struct({ cpuUtilizationPercentage: S.optional(S.Number) }),
).annotations({
  identifier: "ScaleOutPolicyDescription",
}) as any as S.Schema<ScaleOutPolicyDescription>;
export interface AutoScalingDescription {
  maxWorkerCount?: number;
  mcuCount?: number;
  minWorkerCount?: number;
  scaleInPolicy?: ScaleInPolicyDescription;
  scaleOutPolicy?: ScaleOutPolicyDescription;
}
export const AutoScalingDescription = S.suspend(() =>
  S.Struct({
    maxWorkerCount: S.optional(S.Number),
    mcuCount: S.optional(S.Number),
    minWorkerCount: S.optional(S.Number),
    scaleInPolicy: S.optional(ScaleInPolicyDescription),
    scaleOutPolicy: S.optional(ScaleOutPolicyDescription),
  }),
).annotations({
  identifier: "AutoScalingDescription",
}) as any as S.Schema<AutoScalingDescription>;
export interface ProvisionedCapacityDescription {
  mcuCount?: number;
  workerCount?: number;
}
export const ProvisionedCapacityDescription = S.suspend(() =>
  S.Struct({
    mcuCount: S.optional(S.Number),
    workerCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "ProvisionedCapacityDescription",
}) as any as S.Schema<ProvisionedCapacityDescription>;
export interface CapacityDescription {
  autoScaling?: AutoScalingDescription;
  provisionedCapacity?: ProvisionedCapacityDescription;
}
export const CapacityDescription = S.suspend(() =>
  S.Struct({
    autoScaling: S.optional(AutoScalingDescription),
    provisionedCapacity: S.optional(ProvisionedCapacityDescription),
  }),
).annotations({
  identifier: "CapacityDescription",
}) as any as S.Schema<CapacityDescription>;
export interface WorkerSetting {
  capacity?: CapacityDescription;
}
export const WorkerSetting = S.suspend(() =>
  S.Struct({ capacity: S.optional(CapacityDescription) }),
).annotations({
  identifier: "WorkerSetting",
}) as any as S.Schema<WorkerSetting>;
export interface WorkerConfigurationRevisionDescription {
  creationTime?: Date;
  description?: string;
  propertiesFileContent?: string | redacted.Redacted<string>;
  revision?: number;
}
export const WorkerConfigurationRevisionDescription = S.suspend(() =>
  S.Struct({
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    description: S.optional(S.String),
    propertiesFileContent: S.optional(SensitiveString),
    revision: S.optional(S.Number),
  }),
).annotations({
  identifier: "WorkerConfigurationRevisionDescription",
}) as any as S.Schema<WorkerConfigurationRevisionDescription>;
export interface ConnectorOperationSummary {
  connectorOperationArn?: string;
  connectorOperationType?: string;
  connectorOperationState?: string;
  creationTime?: Date;
  endTime?: Date;
}
export const ConnectorOperationSummary = S.suspend(() =>
  S.Struct({
    connectorOperationArn: S.optional(S.String),
    connectorOperationType: S.optional(S.String),
    connectorOperationState: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "ConnectorOperationSummary",
}) as any as S.Schema<ConnectorOperationSummary>;
export type __listOfConnectorOperationSummary = ConnectorOperationSummary[];
export const __listOfConnectorOperationSummary = S.Array(
  ConnectorOperationSummary,
);
export interface VpcDescription {
  securityGroups?: string[];
  subnets?: string[];
}
export const VpcDescription = S.suspend(() =>
  S.Struct({
    securityGroups: S.optional(__listOf__string),
    subnets: S.optional(__listOf__string),
  }),
).annotations({
  identifier: "VpcDescription",
}) as any as S.Schema<VpcDescription>;
export interface ApacheKafkaClusterDescription {
  bootstrapServers?: string;
  vpc?: VpcDescription;
}
export const ApacheKafkaClusterDescription = S.suspend(() =>
  S.Struct({
    bootstrapServers: S.optional(S.String),
    vpc: S.optional(VpcDescription),
  }),
).annotations({
  identifier: "ApacheKafkaClusterDescription",
}) as any as S.Schema<ApacheKafkaClusterDescription>;
export interface KafkaClusterDescription {
  apacheKafkaCluster?: ApacheKafkaClusterDescription;
}
export const KafkaClusterDescription = S.suspend(() =>
  S.Struct({ apacheKafkaCluster: S.optional(ApacheKafkaClusterDescription) }),
).annotations({
  identifier: "KafkaClusterDescription",
}) as any as S.Schema<KafkaClusterDescription>;
export interface CloudWatchLogsLogDeliveryDescription {
  enabled?: boolean;
  logGroup?: string;
}
export const CloudWatchLogsLogDeliveryDescription = S.suspend(() =>
  S.Struct({ enabled: S.optional(S.Boolean), logGroup: S.optional(S.String) }),
).annotations({
  identifier: "CloudWatchLogsLogDeliveryDescription",
}) as any as S.Schema<CloudWatchLogsLogDeliveryDescription>;
export interface FirehoseLogDeliveryDescription {
  deliveryStream?: string;
  enabled?: boolean;
}
export const FirehoseLogDeliveryDescription = S.suspend(() =>
  S.Struct({
    deliveryStream: S.optional(S.String),
    enabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "FirehoseLogDeliveryDescription",
}) as any as S.Schema<FirehoseLogDeliveryDescription>;
export interface S3LogDeliveryDescription {
  bucket?: string;
  enabled?: boolean;
  prefix?: string;
}
export const S3LogDeliveryDescription = S.suspend(() =>
  S.Struct({
    bucket: S.optional(S.String),
    enabled: S.optional(S.Boolean),
    prefix: S.optional(S.String),
  }),
).annotations({
  identifier: "S3LogDeliveryDescription",
}) as any as S.Schema<S3LogDeliveryDescription>;
export interface WorkerLogDeliveryDescription {
  cloudWatchLogs?: CloudWatchLogsLogDeliveryDescription;
  firehose?: FirehoseLogDeliveryDescription;
  s3?: S3LogDeliveryDescription;
}
export const WorkerLogDeliveryDescription = S.suspend(() =>
  S.Struct({
    cloudWatchLogs: S.optional(CloudWatchLogsLogDeliveryDescription),
    firehose: S.optional(FirehoseLogDeliveryDescription),
    s3: S.optional(S3LogDeliveryDescription),
  }),
).annotations({
  identifier: "WorkerLogDeliveryDescription",
}) as any as S.Schema<WorkerLogDeliveryDescription>;
export interface LogDeliveryDescription {
  workerLogDelivery?: WorkerLogDeliveryDescription;
}
export const LogDeliveryDescription = S.suspend(() =>
  S.Struct({ workerLogDelivery: S.optional(WorkerLogDeliveryDescription) }),
).annotations({
  identifier: "LogDeliveryDescription",
}) as any as S.Schema<LogDeliveryDescription>;
export interface CustomPluginDescription {
  customPluginArn?: string;
  revision?: number;
}
export const CustomPluginDescription = S.suspend(() =>
  S.Struct({
    customPluginArn: S.optional(S.String),
    revision: S.optional(S.Number),
  }),
).annotations({
  identifier: "CustomPluginDescription",
}) as any as S.Schema<CustomPluginDescription>;
export interface PluginDescription {
  customPlugin?: CustomPluginDescription;
}
export const PluginDescription = S.suspend(() =>
  S.Struct({ customPlugin: S.optional(CustomPluginDescription) }),
).annotations({
  identifier: "PluginDescription",
}) as any as S.Schema<PluginDescription>;
export type __listOfPluginDescription = PluginDescription[];
export const __listOfPluginDescription = S.Array(PluginDescription);
export interface ConnectorSummary {
  capacity?: CapacityDescription;
  connectorArn?: string;
  connectorDescription?: string;
  connectorName?: string;
  connectorState?: string;
  creationTime?: Date;
  currentVersion?: string;
  kafkaCluster?: KafkaClusterDescription;
  kafkaClusterClientAuthentication?: KafkaClusterClientAuthenticationDescription;
  kafkaClusterEncryptionInTransit?: KafkaClusterEncryptionInTransitDescription;
  kafkaConnectVersion?: string;
  logDelivery?: LogDeliveryDescription;
  networkType?: string;
  plugins?: PluginDescription[];
  serviceExecutionRoleArn?: string;
  workerConfiguration?: WorkerConfigurationDescription;
}
export const ConnectorSummary = S.suspend(() =>
  S.Struct({
    capacity: S.optional(CapacityDescription),
    connectorArn: S.optional(S.String),
    connectorDescription: S.optional(S.String),
    connectorName: S.optional(S.String),
    connectorState: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    currentVersion: S.optional(S.String),
    kafkaCluster: S.optional(KafkaClusterDescription),
    kafkaClusterClientAuthentication: S.optional(
      KafkaClusterClientAuthenticationDescription,
    ),
    kafkaClusterEncryptionInTransit: S.optional(
      KafkaClusterEncryptionInTransitDescription,
    ),
    kafkaConnectVersion: S.optional(S.String),
    logDelivery: S.optional(LogDeliveryDescription),
    networkType: S.optional(S.String),
    plugins: S.optional(__listOfPluginDescription),
    serviceExecutionRoleArn: S.optional(S.String),
    workerConfiguration: S.optional(WorkerConfigurationDescription),
  }),
).annotations({
  identifier: "ConnectorSummary",
}) as any as S.Schema<ConnectorSummary>;
export type __listOfConnectorSummary = ConnectorSummary[];
export const __listOfConnectorSummary = S.Array(ConnectorSummary);
export interface CustomPluginFileDescription {
  fileMd5?: string;
  fileSize?: number;
}
export const CustomPluginFileDescription = S.suspend(() =>
  S.Struct({ fileMd5: S.optional(S.String), fileSize: S.optional(S.Number) }),
).annotations({
  identifier: "CustomPluginFileDescription",
}) as any as S.Schema<CustomPluginFileDescription>;
export interface S3LocationDescription {
  bucketArn?: string;
  fileKey?: string;
  objectVersion?: string;
}
export const S3LocationDescription = S.suspend(() =>
  S.Struct({
    bucketArn: S.optional(S.String),
    fileKey: S.optional(S.String),
    objectVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "S3LocationDescription",
}) as any as S.Schema<S3LocationDescription>;
export interface CustomPluginLocationDescription {
  s3Location?: S3LocationDescription;
}
export const CustomPluginLocationDescription = S.suspend(() =>
  S.Struct({ s3Location: S.optional(S3LocationDescription) }),
).annotations({
  identifier: "CustomPluginLocationDescription",
}) as any as S.Schema<CustomPluginLocationDescription>;
export interface CustomPluginRevisionSummary {
  contentType?: string;
  creationTime?: Date;
  description?: string;
  fileDescription?: CustomPluginFileDescription;
  location?: CustomPluginLocationDescription;
  revision?: number;
}
export const CustomPluginRevisionSummary = S.suspend(() =>
  S.Struct({
    contentType: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    description: S.optional(S.String),
    fileDescription: S.optional(CustomPluginFileDescription),
    location: S.optional(CustomPluginLocationDescription),
    revision: S.optional(S.Number),
  }),
).annotations({
  identifier: "CustomPluginRevisionSummary",
}) as any as S.Schema<CustomPluginRevisionSummary>;
export interface CustomPluginSummary {
  creationTime?: Date;
  customPluginArn?: string;
  customPluginState?: string;
  description?: string;
  latestRevision?: CustomPluginRevisionSummary;
  name?: string;
}
export const CustomPluginSummary = S.suspend(() =>
  S.Struct({
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    customPluginArn: S.optional(S.String),
    customPluginState: S.optional(S.String),
    description: S.optional(S.String),
    latestRevision: S.optional(CustomPluginRevisionSummary),
    name: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomPluginSummary",
}) as any as S.Schema<CustomPluginSummary>;
export type __listOfCustomPluginSummary = CustomPluginSummary[];
export const __listOfCustomPluginSummary = S.Array(CustomPluginSummary);
export interface WorkerConfigurationSummary {
  creationTime?: Date;
  description?: string;
  latestRevision?: WorkerConfigurationRevisionSummary;
  name?: string;
  workerConfigurationArn?: string;
  workerConfigurationState?: string;
}
export const WorkerConfigurationSummary = S.suspend(() =>
  S.Struct({
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    description: S.optional(S.String),
    latestRevision: S.optional(WorkerConfigurationRevisionSummary),
    name: S.optional(S.String),
    workerConfigurationArn: S.optional(S.String),
    workerConfigurationState: S.optional(S.String),
  }),
).annotations({
  identifier: "WorkerConfigurationSummary",
}) as any as S.Schema<WorkerConfigurationSummary>;
export type __listOfWorkerConfigurationSummary = WorkerConfigurationSummary[];
export const __listOfWorkerConfigurationSummary = S.Array(
  WorkerConfigurationSummary,
);
export interface ScaleInPolicy {
  cpuUtilizationPercentage: number;
}
export const ScaleInPolicy = S.suspend(() =>
  S.Struct({ cpuUtilizationPercentage: S.Number }),
).annotations({
  identifier: "ScaleInPolicy",
}) as any as S.Schema<ScaleInPolicy>;
export interface ScaleOutPolicy {
  cpuUtilizationPercentage: number;
}
export const ScaleOutPolicy = S.suspend(() =>
  S.Struct({ cpuUtilizationPercentage: S.Number }),
).annotations({
  identifier: "ScaleOutPolicy",
}) as any as S.Schema<ScaleOutPolicy>;
export interface Vpc {
  securityGroups?: string[];
  subnets: string[];
}
export const Vpc = S.suspend(() =>
  S.Struct({
    securityGroups: S.optional(__listOf__string),
    subnets: __listOf__string,
  }),
).annotations({ identifier: "Vpc" }) as any as S.Schema<Vpc>;
export interface CloudWatchLogsLogDelivery {
  enabled: boolean;
  logGroup?: string;
}
export const CloudWatchLogsLogDelivery = S.suspend(() =>
  S.Struct({ enabled: S.Boolean, logGroup: S.optional(S.String) }),
).annotations({
  identifier: "CloudWatchLogsLogDelivery",
}) as any as S.Schema<CloudWatchLogsLogDelivery>;
export interface FirehoseLogDelivery {
  deliveryStream?: string;
  enabled: boolean;
}
export const FirehoseLogDelivery = S.suspend(() =>
  S.Struct({ deliveryStream: S.optional(S.String), enabled: S.Boolean }),
).annotations({
  identifier: "FirehoseLogDelivery",
}) as any as S.Schema<FirehoseLogDelivery>;
export interface S3LogDelivery {
  bucket?: string;
  enabled: boolean;
  prefix?: string;
}
export const S3LogDelivery = S.suspend(() =>
  S.Struct({
    bucket: S.optional(S.String),
    enabled: S.Boolean,
    prefix: S.optional(S.String),
  }),
).annotations({
  identifier: "S3LogDelivery",
}) as any as S.Schema<S3LogDelivery>;
export interface ScaleInPolicyUpdate {
  cpuUtilizationPercentage: number;
}
export const ScaleInPolicyUpdate = S.suspend(() =>
  S.Struct({ cpuUtilizationPercentage: S.Number }),
).annotations({
  identifier: "ScaleInPolicyUpdate",
}) as any as S.Schema<ScaleInPolicyUpdate>;
export interface ScaleOutPolicyUpdate {
  cpuUtilizationPercentage: number;
}
export const ScaleOutPolicyUpdate = S.suspend(() =>
  S.Struct({ cpuUtilizationPercentage: S.Number }),
).annotations({
  identifier: "ScaleOutPolicyUpdate",
}) as any as S.Schema<ScaleOutPolicyUpdate>;
export interface CreateCustomPluginRequest {
  contentType: string;
  description?: string;
  location: CustomPluginLocation;
  name: string;
  tags?: { [key: string]: string };
}
export const CreateCustomPluginRequest = S.suspend(() =>
  S.Struct({
    contentType: S.String,
    description: S.optional(S.String),
    location: CustomPluginLocation,
    name: S.String,
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/custom-plugins" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCustomPluginRequest",
}) as any as S.Schema<CreateCustomPluginRequest>;
export interface CreateWorkerConfigurationResponse {
  creationTime?: Date;
  latestRevision?: WorkerConfigurationRevisionSummary;
  name?: string;
  workerConfigurationArn?: string;
  workerConfigurationState?: string;
}
export const CreateWorkerConfigurationResponse = S.suspend(() =>
  S.Struct({
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    latestRevision: S.optional(WorkerConfigurationRevisionSummary),
    name: S.optional(S.String),
    workerConfigurationArn: S.optional(S.String),
    workerConfigurationState: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateWorkerConfigurationResponse",
}) as any as S.Schema<CreateWorkerConfigurationResponse>;
export interface DescribeConnectorOperationResponse {
  connectorArn?: string;
  connectorOperationArn?: string;
  connectorOperationState?: string;
  connectorOperationType?: string;
  operationSteps?: ConnectorOperationStep[];
  originWorkerSetting?: WorkerSetting;
  originConnectorConfiguration?: { [key: string]: string };
  targetWorkerSetting?: WorkerSetting;
  targetConnectorConfiguration?: { [key: string]: string };
  errorInfo?: StateDescription;
  creationTime?: Date;
  endTime?: Date;
}
export const DescribeConnectorOperationResponse = S.suspend(() =>
  S.Struct({
    connectorArn: S.optional(S.String),
    connectorOperationArn: S.optional(S.String),
    connectorOperationState: S.optional(S.String),
    connectorOperationType: S.optional(S.String),
    operationSteps: S.optional(__listOfConnectorOperationStep),
    originWorkerSetting: S.optional(WorkerSetting),
    originConnectorConfiguration: S.optional(ConnectorConfiguration),
    targetWorkerSetting: S.optional(WorkerSetting),
    targetConnectorConfiguration: S.optional(ConnectorConfiguration),
    errorInfo: S.optional(StateDescription),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "DescribeConnectorOperationResponse",
}) as any as S.Schema<DescribeConnectorOperationResponse>;
export interface DescribeWorkerConfigurationResponse {
  creationTime?: Date;
  description?: string;
  latestRevision?: WorkerConfigurationRevisionDescription;
  name?: string;
  workerConfigurationArn?: string;
  workerConfigurationState?: string;
}
export const DescribeWorkerConfigurationResponse = S.suspend(() =>
  S.Struct({
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    description: S.optional(S.String),
    latestRevision: S.optional(WorkerConfigurationRevisionDescription),
    name: S.optional(S.String),
    workerConfigurationArn: S.optional(S.String),
    workerConfigurationState: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeWorkerConfigurationResponse",
}) as any as S.Schema<DescribeWorkerConfigurationResponse>;
export interface ListConnectorOperationsResponse {
  connectorOperations?: ConnectorOperationSummary[];
  nextToken?: string;
}
export const ListConnectorOperationsResponse = S.suspend(() =>
  S.Struct({
    connectorOperations: S.optional(__listOfConnectorOperationSummary),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConnectorOperationsResponse",
}) as any as S.Schema<ListConnectorOperationsResponse>;
export interface ListConnectorsResponse {
  connectors?: ConnectorSummary[];
  nextToken?: string;
}
export const ListConnectorsResponse = S.suspend(() =>
  S.Struct({
    connectors: S.optional(__listOfConnectorSummary),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConnectorsResponse",
}) as any as S.Schema<ListConnectorsResponse>;
export interface ListCustomPluginsResponse {
  customPlugins?: CustomPluginSummary[];
  nextToken?: string;
}
export const ListCustomPluginsResponse = S.suspend(() =>
  S.Struct({
    customPlugins: S.optional(__listOfCustomPluginSummary),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCustomPluginsResponse",
}) as any as S.Schema<ListCustomPluginsResponse>;
export interface ListWorkerConfigurationsResponse {
  nextToken?: string;
  workerConfigurations?: WorkerConfigurationSummary[];
}
export const ListWorkerConfigurationsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    workerConfigurations: S.optional(__listOfWorkerConfigurationSummary),
  }),
).annotations({
  identifier: "ListWorkerConfigurationsResponse",
}) as any as S.Schema<ListWorkerConfigurationsResponse>;
export interface AutoScaling {
  maxWorkerCount: number;
  mcuCount: number;
  minWorkerCount: number;
  scaleInPolicy?: ScaleInPolicy;
  scaleOutPolicy?: ScaleOutPolicy;
}
export const AutoScaling = S.suspend(() =>
  S.Struct({
    maxWorkerCount: S.Number,
    mcuCount: S.Number,
    minWorkerCount: S.Number,
    scaleInPolicy: S.optional(ScaleInPolicy),
    scaleOutPolicy: S.optional(ScaleOutPolicy),
  }),
).annotations({ identifier: "AutoScaling" }) as any as S.Schema<AutoScaling>;
export interface ApacheKafkaCluster {
  bootstrapServers: string;
  vpc: Vpc;
}
export const ApacheKafkaCluster = S.suspend(() =>
  S.Struct({ bootstrapServers: S.String, vpc: Vpc }),
).annotations({
  identifier: "ApacheKafkaCluster",
}) as any as S.Schema<ApacheKafkaCluster>;
export interface WorkerLogDelivery {
  cloudWatchLogs?: CloudWatchLogsLogDelivery;
  firehose?: FirehoseLogDelivery;
  s3?: S3LogDelivery;
}
export const WorkerLogDelivery = S.suspend(() =>
  S.Struct({
    cloudWatchLogs: S.optional(CloudWatchLogsLogDelivery),
    firehose: S.optional(FirehoseLogDelivery),
    s3: S.optional(S3LogDelivery),
  }),
).annotations({
  identifier: "WorkerLogDelivery",
}) as any as S.Schema<WorkerLogDelivery>;
export interface AutoScalingUpdate {
  maxWorkerCount: number;
  mcuCount: number;
  minWorkerCount: number;
  scaleInPolicy: ScaleInPolicyUpdate;
  scaleOutPolicy: ScaleOutPolicyUpdate;
}
export const AutoScalingUpdate = S.suspend(() =>
  S.Struct({
    maxWorkerCount: S.Number,
    mcuCount: S.Number,
    minWorkerCount: S.Number,
    scaleInPolicy: ScaleInPolicyUpdate,
    scaleOutPolicy: ScaleOutPolicyUpdate,
  }),
).annotations({
  identifier: "AutoScalingUpdate",
}) as any as S.Schema<AutoScalingUpdate>;
export interface Capacity {
  autoScaling?: AutoScaling;
  provisionedCapacity?: ProvisionedCapacity;
}
export const Capacity = S.suspend(() =>
  S.Struct({
    autoScaling: S.optional(AutoScaling),
    provisionedCapacity: S.optional(ProvisionedCapacity),
  }),
).annotations({ identifier: "Capacity" }) as any as S.Schema<Capacity>;
export interface KafkaCluster {
  apacheKafkaCluster: ApacheKafkaCluster;
}
export const KafkaCluster = S.suspend(() =>
  S.Struct({ apacheKafkaCluster: ApacheKafkaCluster }),
).annotations({ identifier: "KafkaCluster" }) as any as S.Schema<KafkaCluster>;
export interface LogDelivery {
  workerLogDelivery: WorkerLogDelivery;
}
export const LogDelivery = S.suspend(() =>
  S.Struct({ workerLogDelivery: WorkerLogDelivery }),
).annotations({ identifier: "LogDelivery" }) as any as S.Schema<LogDelivery>;
export interface CapacityUpdate {
  autoScaling?: AutoScalingUpdate;
  provisionedCapacity?: ProvisionedCapacityUpdate;
}
export const CapacityUpdate = S.suspend(() =>
  S.Struct({
    autoScaling: S.optional(AutoScalingUpdate),
    provisionedCapacity: S.optional(ProvisionedCapacityUpdate),
  }),
).annotations({
  identifier: "CapacityUpdate",
}) as any as S.Schema<CapacityUpdate>;
export interface CreateConnectorRequest {
  capacity: Capacity;
  connectorConfiguration: { [key: string]: string };
  connectorDescription?: string;
  connectorName: string;
  kafkaCluster: KafkaCluster;
  kafkaClusterClientAuthentication: KafkaClusterClientAuthentication;
  kafkaClusterEncryptionInTransit: KafkaClusterEncryptionInTransit;
  kafkaConnectVersion: string;
  logDelivery?: LogDelivery;
  networkType?: string;
  plugins: Plugin[];
  serviceExecutionRoleArn: string;
  workerConfiguration?: WorkerConfiguration;
  tags?: { [key: string]: string };
}
export const CreateConnectorRequest = S.suspend(() =>
  S.Struct({
    capacity: Capacity,
    connectorConfiguration: ConnectorConfiguration,
    connectorDescription: S.optional(S.String),
    connectorName: S.String,
    kafkaCluster: KafkaCluster,
    kafkaClusterClientAuthentication: KafkaClusterClientAuthentication,
    kafkaClusterEncryptionInTransit: KafkaClusterEncryptionInTransit,
    kafkaConnectVersion: S.String,
    logDelivery: S.optional(LogDelivery),
    networkType: S.optional(S.String),
    plugins: __listOfPlugin,
    serviceExecutionRoleArn: S.String,
    workerConfiguration: S.optional(WorkerConfiguration),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/connectors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConnectorRequest",
}) as any as S.Schema<CreateConnectorRequest>;
export interface CreateCustomPluginResponse {
  customPluginArn?: string;
  customPluginState?: string;
  name?: string;
  revision?: number;
}
export const CreateCustomPluginResponse = S.suspend(() =>
  S.Struct({
    customPluginArn: S.optional(S.String),
    customPluginState: S.optional(S.String),
    name: S.optional(S.String),
    revision: S.optional(S.Number),
  }),
).annotations({
  identifier: "CreateCustomPluginResponse",
}) as any as S.Schema<CreateCustomPluginResponse>;
export interface UpdateConnectorRequest {
  capacity?: CapacityUpdate;
  connectorConfiguration?: { [key: string]: string };
  connectorArn: string;
  currentVersion: string;
}
export const UpdateConnectorRequest = S.suspend(() =>
  S.Struct({
    capacity: S.optional(CapacityUpdate),
    connectorConfiguration: S.optional(ConnectorConfigurationUpdate),
    connectorArn: S.String.pipe(T.HttpLabel("connectorArn")),
    currentVersion: S.String.pipe(T.HttpQuery("currentVersion")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/connectors/{connectorArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConnectorRequest",
}) as any as S.Schema<UpdateConnectorRequest>;
export interface CreateConnectorResponse {
  connectorArn?: string;
  connectorName?: string;
  connectorState?: string;
}
export const CreateConnectorResponse = S.suspend(() =>
  S.Struct({
    connectorArn: S.optional(S.String),
    connectorName: S.optional(S.String),
    connectorState: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateConnectorResponse",
}) as any as S.Schema<CreateConnectorResponse>;
export interface DescribeConnectorResponse {
  capacity?: CapacityDescription;
  connectorArn?: string;
  connectorConfiguration?: { [key: string]: string };
  connectorDescription?: string;
  connectorName?: string;
  connectorState?: string;
  creationTime?: Date;
  currentVersion?: string;
  kafkaCluster?: KafkaClusterDescription;
  kafkaClusterClientAuthentication?: KafkaClusterClientAuthenticationDescription;
  kafkaClusterEncryptionInTransit?: KafkaClusterEncryptionInTransitDescription;
  kafkaConnectVersion?: string;
  logDelivery?: LogDeliveryDescription;
  networkType?: string;
  plugins?: PluginDescription[];
  serviceExecutionRoleArn?: string;
  workerConfiguration?: WorkerConfigurationDescription;
  stateDescription?: StateDescription;
}
export const DescribeConnectorResponse = S.suspend(() =>
  S.Struct({
    capacity: S.optional(CapacityDescription),
    connectorArn: S.optional(S.String),
    connectorConfiguration: S.optional(ConnectorConfiguration),
    connectorDescription: S.optional(S.String),
    connectorName: S.optional(S.String),
    connectorState: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    currentVersion: S.optional(S.String),
    kafkaCluster: S.optional(KafkaClusterDescription),
    kafkaClusterClientAuthentication: S.optional(
      KafkaClusterClientAuthenticationDescription,
    ),
    kafkaClusterEncryptionInTransit: S.optional(
      KafkaClusterEncryptionInTransitDescription,
    ),
    kafkaConnectVersion: S.optional(S.String),
    logDelivery: S.optional(LogDeliveryDescription),
    networkType: S.optional(S.String),
    plugins: S.optional(__listOfPluginDescription),
    serviceExecutionRoleArn: S.optional(S.String),
    workerConfiguration: S.optional(WorkerConfigurationDescription),
    stateDescription: S.optional(StateDescription),
  }),
).annotations({
  identifier: "DescribeConnectorResponse",
}) as any as S.Schema<DescribeConnectorResponse>;
export interface DescribeCustomPluginResponse {
  creationTime?: Date;
  customPluginArn?: string;
  customPluginState?: string;
  description?: string;
  latestRevision?: CustomPluginRevisionSummary;
  name?: string;
  stateDescription?: StateDescription;
}
export const DescribeCustomPluginResponse = S.suspend(() =>
  S.Struct({
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    customPluginArn: S.optional(S.String),
    customPluginState: S.optional(S.String),
    description: S.optional(S.String),
    latestRevision: S.optional(CustomPluginRevisionSummary),
    name: S.optional(S.String),
    stateDescription: S.optional(StateDescription),
  }),
).annotations({
  identifier: "DescribeCustomPluginResponse",
}) as any as S.Schema<DescribeCustomPluginResponse>;
export interface UpdateConnectorResponse {
  connectorArn?: string;
  connectorState?: string;
  connectorOperationArn?: string;
}
export const UpdateConnectorResponse = S.suspend(() =>
  S.Struct({
    connectorArn: S.optional(S.String),
    connectorState: S.optional(S.String),
    connectorOperationArn: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateConnectorResponse",
}) as any as S.Schema<UpdateConnectorResponse>;

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}

//# Operations
/**
 * Removes tags from the specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a worker configuration using the specified properties.
 */
export const createWorkerConfiguration: (
  input: CreateWorkerConfigurationRequest,
) => effect.Effect<
  CreateWorkerConfigurationResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWorkerConfigurationRequest,
  output: CreateWorkerConfigurationResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes the specified connector.
 */
export const deleteConnector: (
  input: DeleteConnectorRequest,
) => effect.Effect<
  DeleteConnectorResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectorRequest,
  output: DeleteConnectorResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a custom plugin.
 */
export const deleteCustomPlugin: (
  input: DeleteCustomPluginRequest,
) => effect.Effect<
  DeleteCustomPluginResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCustomPluginRequest,
  output: DeleteCustomPluginResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes the specified worker configuration.
 */
export const deleteWorkerConfiguration: (
  input: DeleteWorkerConfigurationRequest,
) => effect.Effect<
  DeleteWorkerConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkerConfigurationRequest,
  output: DeleteWorkerConfigurationResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Lists all the tags attached to the specified resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Returns information about the specified connector's operations.
 */
export const describeConnectorOperation: (
  input: DescribeConnectorOperationRequest,
) => effect.Effect<
  DescribeConnectorOperationResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConnectorOperationRequest,
  output: DescribeConnectorOperationResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Returns information about a worker configuration.
 */
export const describeWorkerConfiguration: (
  input: DescribeWorkerConfigurationRequest,
) => effect.Effect<
  DescribeWorkerConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeWorkerConfigurationRequest,
  output: DescribeWorkerConfigurationResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Lists information about a connector's operation(s).
 */
export const listConnectorOperations: {
  (
    input: ListConnectorOperationsRequest,
  ): effect.Effect<
    ListConnectorOperationsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConnectorOperationsRequest,
  ) => stream.Stream<
    ListConnectorOperationsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConnectorOperationsRequest,
  ) => stream.Stream<
    ConnectorOperationSummary,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConnectorOperationsRequest,
  output: ListConnectorOperationsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "connectorOperations",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of all the connectors in this account and Region. The list is limited to connectors whose name starts with the specified prefix. The response also includes a description of each of the listed connectors.
 */
export const listConnectors: {
  (
    input: ListConnectorsRequest,
  ): effect.Effect<
    ListConnectorsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConnectorsRequest,
  ) => stream.Stream<
    ListConnectorsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConnectorsRequest,
  ) => stream.Stream<
    ConnectorSummary,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConnectorsRequest,
  output: ListConnectorsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "connectors",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of all of the custom plugins in this account and Region.
 */
export const listCustomPlugins: {
  (
    input: ListCustomPluginsRequest,
  ): effect.Effect<
    ListCustomPluginsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCustomPluginsRequest,
  ) => stream.Stream<
    ListCustomPluginsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCustomPluginsRequest,
  ) => stream.Stream<
    CustomPluginSummary,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCustomPluginsRequest,
  output: ListCustomPluginsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "customPlugins",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of all of the worker configurations in this account and Region.
 */
export const listWorkerConfigurations: {
  (
    input: ListWorkerConfigurationsRequest,
  ): effect.Effect<
    ListWorkerConfigurationsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkerConfigurationsRequest,
  ) => stream.Stream<
    ListWorkerConfigurationsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkerConfigurationsRequest,
  ) => stream.Stream<
    WorkerConfigurationSummary,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWorkerConfigurationsRequest,
  output: ListWorkerConfigurationsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "workerConfigurations",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Attaches tags to the specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a custom plugin using the specified properties.
 */
export const createCustomPlugin: (
  input: CreateCustomPluginRequest,
) => effect.Effect<
  CreateCustomPluginResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCustomPluginRequest,
  output: CreateCustomPluginResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a connector using the specified properties.
 */
export const createConnector: (
  input: CreateConnectorRequest,
) => effect.Effect<
  CreateConnectorResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConnectorRequest,
  output: CreateConnectorResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Returns summary information about the connector.
 */
export const describeConnector: (
  input: DescribeConnectorRequest,
) => effect.Effect<
  DescribeConnectorResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConnectorRequest,
  output: DescribeConnectorResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * A summary description of the custom plugin.
 */
export const describeCustomPlugin: (
  input: DescribeCustomPluginRequest,
) => effect.Effect<
  DescribeCustomPluginResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCustomPluginRequest,
  output: DescribeCustomPluginResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Updates the specified connector. For request body, specify only one parameter: either `capacity` or `connectorConfiguration`.
 */
export const updateConnector: (
  input: UpdateConnectorRequest,
) => effect.Effect<
  UpdateConnectorResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConnectorRequest,
  output: UpdateConnectorResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
