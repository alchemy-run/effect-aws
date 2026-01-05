import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "KafkaConnect",
  serviceShapeName: "KafkaConnect",
});
const auth = T.AwsAuthSigv4({ name: "kafkaconnect" });
const ver = T.ServiceVersion("2021-09-14");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
    UseDualStack: {
      builtIn: "AWS::UseDualStack",
      required: true,
      default: false,
      documentation:
        "When true, use the dual-stack endpoint. If the configured endpoint does not support dual-stack, dispatching the request MAY return an error.",
      type: "boolean",
    },
    UseFIPS: {
      builtIn: "AWS::UseFIPS",
      required: true,
      default: false,
      documentation:
        "When true, send this request to the FIPS-compliant regional endpoint. If the configured endpoint does not have a FIPS compliant endpoint, dispatching the request will return an error.",
      type: "boolean",
    },
    Endpoint: {
      builtIn: "SDK::Endpoint",
      required: false,
      documentation: "Override the endpoint used to send this request",
      type: "string",
    },
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
      type: "string",
    },
  },
  rules: [
    {
      conditions: [{ fn: "isSet", argv: [{ ref: "Endpoint" }] }],
      rules: [
        {
          conditions: [
            { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
          ],
          error:
            "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: "error",
        },
        {
          conditions: [],
          rules: [
            {
              conditions: [
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
              ],
              error:
                "Invalid Configuration: Dualstack and custom endpoint are not supported",
              type: "error",
            },
            {
              conditions: [],
              endpoint: {
                url: { ref: "Endpoint" },
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
          ],
          type: "tree",
        },
      ],
      type: "tree",
    },
    {
      conditions: [],
      rules: [
        {
          conditions: [{ fn: "isSet", argv: [{ ref: "Region" }] }],
          rules: [
            {
              conditions: [
                {
                  fn: "aws.partition",
                  argv: [{ ref: "Region" }],
                  assign: "PartitionResult",
                },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-us-gov",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://kafkaconnect.{Region}.{PartitionResult#dnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-us-gov",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://kafkaconnect.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  rules: [
                    {
                      conditions: [
                        {
                          fn: "booleanEquals",
                          argv: [
                            true,
                            {
                              fn: "getAttr",
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                          ],
                        },
                        {
                          fn: "booleanEquals",
                          argv: [
                            true,
                            {
                              fn: "getAttr",
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsDualStack",
                              ],
                            },
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          endpoint: {
                            url: "https://kafkaconnect-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                            properties: {},
                            headers: {},
                          },
                          type: "endpoint",
                        },
                      ],
                      type: "tree",
                    },
                    {
                      conditions: [],
                      error:
                        "FIPS and DualStack are enabled, but this partition does not support one or both",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  rules: [
                    {
                      conditions: [
                        {
                          fn: "booleanEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          endpoint: {
                            url: "https://kafkaconnect-fips.{Region}.{PartitionResult#dnsSuffix}",
                            properties: {},
                            headers: {},
                          },
                          type: "endpoint",
                        },
                      ],
                      type: "tree",
                    },
                    {
                      conditions: [],
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  rules: [
                    {
                      conditions: [
                        {
                          fn: "booleanEquals",
                          argv: [
                            true,
                            {
                              fn: "getAttr",
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsDualStack",
                              ],
                            },
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          endpoint: {
                            url: "https://kafkaconnect.{Region}.{PartitionResult#dualStackDnsSuffix}",
                            properties: {},
                            headers: {},
                          },
                          type: "endpoint",
                        },
                      ],
                      type: "tree",
                    },
                    {
                      conditions: [],
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  endpoint: {
                    url: "https://kafkaconnect.{Region}.{PartitionResult#dnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
              ],
              type: "tree",
            },
          ],
          type: "tree",
        },
        {
          conditions: [],
          error: "Invalid Configuration: Missing Region",
          type: "error",
        },
      ],
      type: "tree",
    },
  ],
});

//# Schemas
export const TagKeyList = S.Array(S.String);
export const Tags = S.Record({ key: S.String, value: S.String });
export class CreateWorkerConfigurationRequest extends S.Class<CreateWorkerConfigurationRequest>(
  "CreateWorkerConfigurationRequest",
)(
  {
    description: S.optional(S.String),
    name: S.String,
    propertiesFileContent: S.String,
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/worker-configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConnectorRequest extends S.Class<DeleteConnectorRequest>(
  "DeleteConnectorRequest",
)(
  {
    connectorArn: S.String.pipe(T.HttpLabel("connectorArn")),
    currentVersion: S.optional(S.String).pipe(T.HttpQuery("currentVersion")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/connectors/{connectorArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCustomPluginRequest extends S.Class<DeleteCustomPluginRequest>(
  "DeleteCustomPluginRequest",
)(
  { customPluginArn: S.String.pipe(T.HttpLabel("customPluginArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/custom-plugins/{customPluginArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWorkerConfigurationRequest extends S.Class<DeleteWorkerConfigurationRequest>(
  "DeleteWorkerConfigurationRequest",
)(
  {
    workerConfigurationArn: S.String.pipe(
      T.HttpLabel("workerConfigurationArn"),
    ),
  },
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
) {}
export class DescribeConnectorRequest extends S.Class<DescribeConnectorRequest>(
  "DescribeConnectorRequest",
)(
  { connectorArn: S.String.pipe(T.HttpLabel("connectorArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/connectors/{connectorArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeConnectorOperationRequest extends S.Class<DescribeConnectorOperationRequest>(
  "DescribeConnectorOperationRequest",
)(
  {
    connectorOperationArn: S.String.pipe(T.HttpLabel("connectorOperationArn")),
  },
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
) {}
export class DescribeCustomPluginRequest extends S.Class<DescribeCustomPluginRequest>(
  "DescribeCustomPluginRequest",
)(
  { customPluginArn: S.String.pipe(T.HttpLabel("customPluginArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/custom-plugins/{customPluginArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeWorkerConfigurationRequest extends S.Class<DescribeWorkerConfigurationRequest>(
  "DescribeWorkerConfigurationRequest",
)(
  {
    workerConfigurationArn: S.String.pipe(
      T.HttpLabel("workerConfigurationArn"),
    ),
  },
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
) {}
export class ListConnectorOperationsRequest extends S.Class<ListConnectorOperationsRequest>(
  "ListConnectorOperationsRequest",
)(
  {
    connectorArn: S.String.pipe(T.HttpLabel("connectorArn")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/connectors/{connectorArn}/operations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListConnectorsRequest extends S.Class<ListConnectorsRequest>(
  "ListConnectorsRequest",
)(
  {
    connectorNamePrefix: S.optional(S.String).pipe(
      T.HttpQuery("connectorNamePrefix"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/connectors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCustomPluginsRequest extends S.Class<ListCustomPluginsRequest>(
  "ListCustomPluginsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    namePrefix: S.optional(S.String).pipe(T.HttpQuery("namePrefix")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/custom-plugins" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWorkerConfigurationsRequest extends S.Class<ListWorkerConfigurationsRequest>(
  "ListWorkerConfigurationsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    namePrefix: S.optional(S.String).pipe(T.HttpQuery("namePrefix")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/worker-configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: Tags },
  T.all(
    T.Http({ method: "POST", uri: "/v1/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export const ConnectorConfiguration = S.Record({
  key: S.String,
  value: S.String,
});
export class KafkaClusterClientAuthentication extends S.Class<KafkaClusterClientAuthentication>(
  "KafkaClusterClientAuthentication",
)({ authenticationType: S.String }) {}
export class KafkaClusterEncryptionInTransit extends S.Class<KafkaClusterEncryptionInTransit>(
  "KafkaClusterEncryptionInTransit",
)({ encryptionType: S.String }) {}
export class WorkerConfiguration extends S.Class<WorkerConfiguration>(
  "WorkerConfiguration",
)({ revision: S.Number, workerConfigurationArn: S.String }) {}
export const ConnectorConfigurationUpdate = S.Record({
  key: S.String,
  value: S.String,
});
export class DeleteConnectorResponse extends S.Class<DeleteConnectorResponse>(
  "DeleteConnectorResponse",
)({
  connectorArn: S.optional(S.String),
  connectorState: S.optional(S.String),
}) {}
export class DeleteCustomPluginResponse extends S.Class<DeleteCustomPluginResponse>(
  "DeleteCustomPluginResponse",
)({
  customPluginArn: S.optional(S.String),
  customPluginState: S.optional(S.String),
}) {}
export class DeleteWorkerConfigurationResponse extends S.Class<DeleteWorkerConfigurationResponse>(
  "DeleteWorkerConfigurationResponse",
)({
  workerConfigurationArn: S.optional(S.String),
  workerConfigurationState: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(Tags) }) {}
export class ProvisionedCapacity extends S.Class<ProvisionedCapacity>(
  "ProvisionedCapacity",
)({ mcuCount: S.Number, workerCount: S.Number }) {}
export class CustomPlugin extends S.Class<CustomPlugin>("CustomPlugin")({
  customPluginArn: S.String,
  revision: S.Number,
}) {}
export class S3Location extends S.Class<S3Location>("S3Location")({
  bucketArn: S.String,
  fileKey: S.String,
  objectVersion: S.optional(S.String),
}) {}
export class ProvisionedCapacityUpdate extends S.Class<ProvisionedCapacityUpdate>(
  "ProvisionedCapacityUpdate",
)({ mcuCount: S.Number, workerCount: S.Number }) {}
export const __listOf__string = S.Array(S.String);
export class Plugin extends S.Class<Plugin>("Plugin")({
  customPlugin: CustomPlugin,
}) {}
export const __listOfPlugin = S.Array(Plugin);
export class CustomPluginLocation extends S.Class<CustomPluginLocation>(
  "CustomPluginLocation",
)({ s3Location: S3Location }) {}
export class WorkerConfigurationRevisionSummary extends S.Class<WorkerConfigurationRevisionSummary>(
  "WorkerConfigurationRevisionSummary",
)({
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  description: S.optional(S.String),
  revision: S.optional(S.Number),
}) {}
export class KafkaClusterClientAuthenticationDescription extends S.Class<KafkaClusterClientAuthenticationDescription>(
  "KafkaClusterClientAuthenticationDescription",
)({ authenticationType: S.optional(S.String) }) {}
export class KafkaClusterEncryptionInTransitDescription extends S.Class<KafkaClusterEncryptionInTransitDescription>(
  "KafkaClusterEncryptionInTransitDescription",
)({ encryptionType: S.optional(S.String) }) {}
export class WorkerConfigurationDescription extends S.Class<WorkerConfigurationDescription>(
  "WorkerConfigurationDescription",
)({
  revision: S.optional(S.Number),
  workerConfigurationArn: S.optional(S.String),
}) {}
export class StateDescription extends S.Class<StateDescription>(
  "StateDescription",
)({ code: S.optional(S.String), message: S.optional(S.String) }) {}
export class ConnectorOperationStep extends S.Class<ConnectorOperationStep>(
  "ConnectorOperationStep",
)({ stepType: S.optional(S.String), stepState: S.optional(S.String) }) {}
export const __listOfConnectorOperationStep = S.Array(ConnectorOperationStep);
export class ScaleInPolicyDescription extends S.Class<ScaleInPolicyDescription>(
  "ScaleInPolicyDescription",
)({ cpuUtilizationPercentage: S.optional(S.Number) }) {}
export class ScaleOutPolicyDescription extends S.Class<ScaleOutPolicyDescription>(
  "ScaleOutPolicyDescription",
)({ cpuUtilizationPercentage: S.optional(S.Number) }) {}
export class AutoScalingDescription extends S.Class<AutoScalingDescription>(
  "AutoScalingDescription",
)({
  maxWorkerCount: S.optional(S.Number),
  mcuCount: S.optional(S.Number),
  minWorkerCount: S.optional(S.Number),
  scaleInPolicy: S.optional(ScaleInPolicyDescription),
  scaleOutPolicy: S.optional(ScaleOutPolicyDescription),
}) {}
export class ProvisionedCapacityDescription extends S.Class<ProvisionedCapacityDescription>(
  "ProvisionedCapacityDescription",
)({ mcuCount: S.optional(S.Number), workerCount: S.optional(S.Number) }) {}
export class CapacityDescription extends S.Class<CapacityDescription>(
  "CapacityDescription",
)({
  autoScaling: S.optional(AutoScalingDescription),
  provisionedCapacity: S.optional(ProvisionedCapacityDescription),
}) {}
export class WorkerSetting extends S.Class<WorkerSetting>("WorkerSetting")({
  capacity: S.optional(CapacityDescription),
}) {}
export class WorkerConfigurationRevisionDescription extends S.Class<WorkerConfigurationRevisionDescription>(
  "WorkerConfigurationRevisionDescription",
)({
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  description: S.optional(S.String),
  propertiesFileContent: S.optional(S.String),
  revision: S.optional(S.Number),
}) {}
export class ConnectorOperationSummary extends S.Class<ConnectorOperationSummary>(
  "ConnectorOperationSummary",
)({
  connectorOperationArn: S.optional(S.String),
  connectorOperationType: S.optional(S.String),
  connectorOperationState: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const __listOfConnectorOperationSummary = S.Array(
  ConnectorOperationSummary,
);
export class VpcDescription extends S.Class<VpcDescription>("VpcDescription")({
  securityGroups: S.optional(__listOf__string),
  subnets: S.optional(__listOf__string),
}) {}
export class ApacheKafkaClusterDescription extends S.Class<ApacheKafkaClusterDescription>(
  "ApacheKafkaClusterDescription",
)({
  bootstrapServers: S.optional(S.String),
  vpc: S.optional(VpcDescription),
}) {}
export class KafkaClusterDescription extends S.Class<KafkaClusterDescription>(
  "KafkaClusterDescription",
)({ apacheKafkaCluster: S.optional(ApacheKafkaClusterDescription) }) {}
export class CloudWatchLogsLogDeliveryDescription extends S.Class<CloudWatchLogsLogDeliveryDescription>(
  "CloudWatchLogsLogDeliveryDescription",
)({ enabled: S.optional(S.Boolean), logGroup: S.optional(S.String) }) {}
export class FirehoseLogDeliveryDescription extends S.Class<FirehoseLogDeliveryDescription>(
  "FirehoseLogDeliveryDescription",
)({ deliveryStream: S.optional(S.String), enabled: S.optional(S.Boolean) }) {}
export class S3LogDeliveryDescription extends S.Class<S3LogDeliveryDescription>(
  "S3LogDeliveryDescription",
)({
  bucket: S.optional(S.String),
  enabled: S.optional(S.Boolean),
  prefix: S.optional(S.String),
}) {}
export class WorkerLogDeliveryDescription extends S.Class<WorkerLogDeliveryDescription>(
  "WorkerLogDeliveryDescription",
)({
  cloudWatchLogs: S.optional(CloudWatchLogsLogDeliveryDescription),
  firehose: S.optional(FirehoseLogDeliveryDescription),
  s3: S.optional(S3LogDeliveryDescription),
}) {}
export class LogDeliveryDescription extends S.Class<LogDeliveryDescription>(
  "LogDeliveryDescription",
)({ workerLogDelivery: S.optional(WorkerLogDeliveryDescription) }) {}
export class CustomPluginDescription extends S.Class<CustomPluginDescription>(
  "CustomPluginDescription",
)({ customPluginArn: S.optional(S.String), revision: S.optional(S.Number) }) {}
export class PluginDescription extends S.Class<PluginDescription>(
  "PluginDescription",
)({ customPlugin: S.optional(CustomPluginDescription) }) {}
export const __listOfPluginDescription = S.Array(PluginDescription);
export class ConnectorSummary extends S.Class<ConnectorSummary>(
  "ConnectorSummary",
)({
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
}) {}
export const __listOfConnectorSummary = S.Array(ConnectorSummary);
export class CustomPluginFileDescription extends S.Class<CustomPluginFileDescription>(
  "CustomPluginFileDescription",
)({ fileMd5: S.optional(S.String), fileSize: S.optional(S.Number) }) {}
export class S3LocationDescription extends S.Class<S3LocationDescription>(
  "S3LocationDescription",
)({
  bucketArn: S.optional(S.String),
  fileKey: S.optional(S.String),
  objectVersion: S.optional(S.String),
}) {}
export class CustomPluginLocationDescription extends S.Class<CustomPluginLocationDescription>(
  "CustomPluginLocationDescription",
)({ s3Location: S.optional(S3LocationDescription) }) {}
export class CustomPluginRevisionSummary extends S.Class<CustomPluginRevisionSummary>(
  "CustomPluginRevisionSummary",
)({
  contentType: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  description: S.optional(S.String),
  fileDescription: S.optional(CustomPluginFileDescription),
  location: S.optional(CustomPluginLocationDescription),
  revision: S.optional(S.Number),
}) {}
export class CustomPluginSummary extends S.Class<CustomPluginSummary>(
  "CustomPluginSummary",
)({
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  customPluginArn: S.optional(S.String),
  customPluginState: S.optional(S.String),
  description: S.optional(S.String),
  latestRevision: S.optional(CustomPluginRevisionSummary),
  name: S.optional(S.String),
}) {}
export const __listOfCustomPluginSummary = S.Array(CustomPluginSummary);
export class WorkerConfigurationSummary extends S.Class<WorkerConfigurationSummary>(
  "WorkerConfigurationSummary",
)({
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  description: S.optional(S.String),
  latestRevision: S.optional(WorkerConfigurationRevisionSummary),
  name: S.optional(S.String),
  workerConfigurationArn: S.optional(S.String),
  workerConfigurationState: S.optional(S.String),
}) {}
export const __listOfWorkerConfigurationSummary = S.Array(
  WorkerConfigurationSummary,
);
export class ScaleInPolicy extends S.Class<ScaleInPolicy>("ScaleInPolicy")({
  cpuUtilizationPercentage: S.Number,
}) {}
export class ScaleOutPolicy extends S.Class<ScaleOutPolicy>("ScaleOutPolicy")({
  cpuUtilizationPercentage: S.Number,
}) {}
export class Vpc extends S.Class<Vpc>("Vpc")({
  securityGroups: S.optional(__listOf__string),
  subnets: __listOf__string,
}) {}
export class CloudWatchLogsLogDelivery extends S.Class<CloudWatchLogsLogDelivery>(
  "CloudWatchLogsLogDelivery",
)({ enabled: S.Boolean, logGroup: S.optional(S.String) }) {}
export class FirehoseLogDelivery extends S.Class<FirehoseLogDelivery>(
  "FirehoseLogDelivery",
)({ deliveryStream: S.optional(S.String), enabled: S.Boolean }) {}
export class S3LogDelivery extends S.Class<S3LogDelivery>("S3LogDelivery")({
  bucket: S.optional(S.String),
  enabled: S.Boolean,
  prefix: S.optional(S.String),
}) {}
export class ScaleInPolicyUpdate extends S.Class<ScaleInPolicyUpdate>(
  "ScaleInPolicyUpdate",
)({ cpuUtilizationPercentage: S.Number }) {}
export class ScaleOutPolicyUpdate extends S.Class<ScaleOutPolicyUpdate>(
  "ScaleOutPolicyUpdate",
)({ cpuUtilizationPercentage: S.Number }) {}
export class CreateCustomPluginRequest extends S.Class<CreateCustomPluginRequest>(
  "CreateCustomPluginRequest",
)(
  {
    contentType: S.String,
    description: S.optional(S.String),
    location: CustomPluginLocation,
    name: S.String,
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/custom-plugins" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateWorkerConfigurationResponse extends S.Class<CreateWorkerConfigurationResponse>(
  "CreateWorkerConfigurationResponse",
)({
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  latestRevision: S.optional(WorkerConfigurationRevisionSummary),
  name: S.optional(S.String),
  workerConfigurationArn: S.optional(S.String),
  workerConfigurationState: S.optional(S.String),
}) {}
export class DescribeConnectorOperationResponse extends S.Class<DescribeConnectorOperationResponse>(
  "DescribeConnectorOperationResponse",
)({
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
}) {}
export class DescribeWorkerConfigurationResponse extends S.Class<DescribeWorkerConfigurationResponse>(
  "DescribeWorkerConfigurationResponse",
)({
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  description: S.optional(S.String),
  latestRevision: S.optional(WorkerConfigurationRevisionDescription),
  name: S.optional(S.String),
  workerConfigurationArn: S.optional(S.String),
  workerConfigurationState: S.optional(S.String),
}) {}
export class ListConnectorOperationsResponse extends S.Class<ListConnectorOperationsResponse>(
  "ListConnectorOperationsResponse",
)({
  connectorOperations: S.optional(__listOfConnectorOperationSummary),
  nextToken: S.optional(S.String),
}) {}
export class ListConnectorsResponse extends S.Class<ListConnectorsResponse>(
  "ListConnectorsResponse",
)({
  connectors: S.optional(__listOfConnectorSummary),
  nextToken: S.optional(S.String),
}) {}
export class ListCustomPluginsResponse extends S.Class<ListCustomPluginsResponse>(
  "ListCustomPluginsResponse",
)({
  customPlugins: S.optional(__listOfCustomPluginSummary),
  nextToken: S.optional(S.String),
}) {}
export class ListWorkerConfigurationsResponse extends S.Class<ListWorkerConfigurationsResponse>(
  "ListWorkerConfigurationsResponse",
)({
  nextToken: S.optional(S.String),
  workerConfigurations: S.optional(__listOfWorkerConfigurationSummary),
}) {}
export class AutoScaling extends S.Class<AutoScaling>("AutoScaling")({
  maxWorkerCount: S.Number,
  mcuCount: S.Number,
  minWorkerCount: S.Number,
  scaleInPolicy: S.optional(ScaleInPolicy),
  scaleOutPolicy: S.optional(ScaleOutPolicy),
}) {}
export class ApacheKafkaCluster extends S.Class<ApacheKafkaCluster>(
  "ApacheKafkaCluster",
)({ bootstrapServers: S.String, vpc: Vpc }) {}
export class WorkerLogDelivery extends S.Class<WorkerLogDelivery>(
  "WorkerLogDelivery",
)({
  cloudWatchLogs: S.optional(CloudWatchLogsLogDelivery),
  firehose: S.optional(FirehoseLogDelivery),
  s3: S.optional(S3LogDelivery),
}) {}
export class AutoScalingUpdate extends S.Class<AutoScalingUpdate>(
  "AutoScalingUpdate",
)({
  maxWorkerCount: S.Number,
  mcuCount: S.Number,
  minWorkerCount: S.Number,
  scaleInPolicy: ScaleInPolicyUpdate,
  scaleOutPolicy: ScaleOutPolicyUpdate,
}) {}
export class Capacity extends S.Class<Capacity>("Capacity")({
  autoScaling: S.optional(AutoScaling),
  provisionedCapacity: S.optional(ProvisionedCapacity),
}) {}
export class KafkaCluster extends S.Class<KafkaCluster>("KafkaCluster")({
  apacheKafkaCluster: ApacheKafkaCluster,
}) {}
export class LogDelivery extends S.Class<LogDelivery>("LogDelivery")({
  workerLogDelivery: WorkerLogDelivery,
}) {}
export class CapacityUpdate extends S.Class<CapacityUpdate>("CapacityUpdate")({
  autoScaling: S.optional(AutoScalingUpdate),
  provisionedCapacity: S.optional(ProvisionedCapacityUpdate),
}) {}
export class CreateConnectorRequest extends S.Class<CreateConnectorRequest>(
  "CreateConnectorRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/connectors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCustomPluginResponse extends S.Class<CreateCustomPluginResponse>(
  "CreateCustomPluginResponse",
)({
  customPluginArn: S.optional(S.String),
  customPluginState: S.optional(S.String),
  name: S.optional(S.String),
  revision: S.optional(S.Number),
}) {}
export class UpdateConnectorRequest extends S.Class<UpdateConnectorRequest>(
  "UpdateConnectorRequest",
)(
  {
    capacity: S.optional(CapacityUpdate),
    connectorConfiguration: S.optional(ConnectorConfigurationUpdate),
    connectorArn: S.String.pipe(T.HttpLabel("connectorArn")),
    currentVersion: S.String.pipe(T.HttpQuery("currentVersion")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/connectors/{connectorArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateConnectorResponse extends S.Class<CreateConnectorResponse>(
  "CreateConnectorResponse",
)({
  connectorArn: S.optional(S.String),
  connectorName: S.optional(S.String),
  connectorState: S.optional(S.String),
}) {}
export class DescribeConnectorResponse extends S.Class<DescribeConnectorResponse>(
  "DescribeConnectorResponse",
)({
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
}) {}
export class DescribeCustomPluginResponse extends S.Class<DescribeCustomPluginResponse>(
  "DescribeCustomPluginResponse",
)({
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  customPluginArn: S.optional(S.String),
  customPluginState: S.optional(S.String),
  description: S.optional(S.String),
  latestRevision: S.optional(CustomPluginRevisionSummary),
  name: S.optional(S.String),
  stateDescription: S.optional(StateDescription),
}) {}
export class UpdateConnectorResponse extends S.Class<UpdateConnectorResponse>(
  "UpdateConnectorResponse",
)({
  connectorArn: S.optional(S.String),
  connectorState: S.optional(S.String),
  connectorOperationArn: S.optional(S.String),
}) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { message: S.optional(S.String) },
) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String) },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Removes tags from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createWorkerConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Deletes the specified connector.
 */
export const deleteConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteCustomPlugin = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteWorkerConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Lists all the tags attached to the specified resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeConnectorOperation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Returns information about a worker configuration.
 */
export const describeWorkerConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Lists information about a connector's operation(s).
 */
export const listConnectorOperations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listConnectors = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Returns a list of all of the custom plugins in this account and Region.
 */
export const listCustomPlugins = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Returns a list of all of the worker configurations in this account and Region.
 */
export const listWorkerConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createCustomPlugin = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeCustomPlugin = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates the specified connector. For request body, specify only one parameter: either `capacity` or `connectorConfiguration`.
 */
export const updateConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
