import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace("http://events.amazonaws.com/doc/2015-10-07");
const svc = T.AwsApiService({ sdkId: "Pipes", serviceShapeName: "Pipes" });
const auth = T.AwsAuthSigv4({ name: "pipes" });
const ver = T.ServiceVersion("2015-10-07");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
      type: "string",
    },
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://pipes-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://pipes-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://pipes.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://pipes.{Region}.{PartitionResult#dnsSuffix}",
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
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}, ns) {}
export class DescribePipeRequest extends S.Class<DescribePipeRequest>(
  "DescribePipeRequest",
)(
  { Name: S.String.pipe(T.HttpLabel("Name")) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/v1/pipes/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePipeRequest extends S.Class<DeletePipeRequest>(
  "DeletePipeRequest",
)(
  { Name: S.String.pipe(T.HttpLabel("Name")) },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/v1/pipes/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPipesRequest extends S.Class<ListPipesRequest>(
  "ListPipesRequest",
)(
  {
    NamePrefix: S.optional(S.String).pipe(T.HttpQuery("NamePrefix")),
    DesiredState: S.optional(S.String).pipe(T.HttpQuery("DesiredState")),
    CurrentState: S.optional(S.String).pipe(T.HttpQuery("CurrentState")),
    SourcePrefix: S.optional(S.String).pipe(T.HttpQuery("SourcePrefix")),
    TargetPrefix: S.optional(S.String).pipe(T.HttpQuery("TargetPrefix")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("Limit")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/v1/pipes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartPipeRequest extends S.Class<StartPipeRequest>(
  "StartPipeRequest",
)(
  { Name: S.String.pipe(T.HttpLabel("Name")) },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/pipes/{Name}/start" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopPipeRequest extends S.Class<StopPipeRequest>(
  "StopPipeRequest",
)(
  { Name: S.String.pipe(T.HttpLabel("Name")) },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/pipes/{Name}/stop" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const IncludeExecutionData = S.Array(S.String);
export const TagMap = S.Record({ key: S.String, value: S.String });
export const KafkaBootstrapServers = S.Array(S.String);
export const PathParameterList = S.Array(S.String);
export const Sqls = S.Array(S.String);
export const EventBridgeEventResourceList = S.Array(S.String);
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }, ns) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagMap },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}, ns) {}
export class DeletePipeResponse extends S.Class<DeletePipeResponse>(
  "DeletePipeResponse",
)(
  {
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    DesiredState: S.optional(S.String),
    CurrentState: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  ns,
) {}
export class StartPipeResponse extends S.Class<StartPipeResponse>(
  "StartPipeResponse",
)(
  {
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    DesiredState: S.optional(S.String),
    CurrentState: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  ns,
) {}
export class StopPipeResponse extends S.Class<StopPipeResponse>(
  "StopPipeResponse",
)(
  {
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    DesiredState: S.optional(S.String),
    CurrentState: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  ns,
) {}
export class DeadLetterConfig extends S.Class<DeadLetterConfig>(
  "DeadLetterConfig",
)({ Arn: S.optional(S.String) }) {}
export class PipeSourceDynamoDBStreamParameters extends S.Class<PipeSourceDynamoDBStreamParameters>(
  "PipeSourceDynamoDBStreamParameters",
)({
  BatchSize: S.optional(S.Number),
  DeadLetterConfig: S.optional(DeadLetterConfig),
  OnPartialBatchItemFailure: S.optional(S.String),
  MaximumBatchingWindowInSeconds: S.optional(S.Number),
  MaximumRecordAgeInSeconds: S.optional(S.Number),
  MaximumRetryAttempts: S.optional(S.Number),
  ParallelizationFactor: S.optional(S.Number),
  StartingPosition: S.String,
}) {}
export class PipeSourceSqsQueueParameters extends S.Class<PipeSourceSqsQueueParameters>(
  "PipeSourceSqsQueueParameters",
)({
  BatchSize: S.optional(S.Number),
  MaximumBatchingWindowInSeconds: S.optional(S.Number),
}) {}
export const MQBrokerAccessCredentials = S.Union(
  S.Struct({ BasicAuth: S.String }),
);
export class PipeSourceRabbitMQBrokerParameters extends S.Class<PipeSourceRabbitMQBrokerParameters>(
  "PipeSourceRabbitMQBrokerParameters",
)({
  Credentials: MQBrokerAccessCredentials,
  QueueName: S.String,
  VirtualHost: S.optional(S.String),
  BatchSize: S.optional(S.Number),
  MaximumBatchingWindowInSeconds: S.optional(S.Number),
}) {}
export class PipeTargetLambdaFunctionParameters extends S.Class<PipeTargetLambdaFunctionParameters>(
  "PipeTargetLambdaFunctionParameters",
)({ InvocationType: S.optional(S.String) }) {}
export class PipeTargetStateMachineParameters extends S.Class<PipeTargetStateMachineParameters>(
  "PipeTargetStateMachineParameters",
)({ InvocationType: S.optional(S.String) }) {}
export class PipeTargetKinesisStreamParameters extends S.Class<PipeTargetKinesisStreamParameters>(
  "PipeTargetKinesisStreamParameters",
)({ PartitionKey: S.String }) {}
export class PipeTargetSqsQueueParameters extends S.Class<PipeTargetSqsQueueParameters>(
  "PipeTargetSqsQueueParameters",
)({
  MessageGroupId: S.optional(S.String),
  MessageDeduplicationId: S.optional(S.String),
}) {}
export const HeaderParametersMap = S.Record({ key: S.String, value: S.String });
export const QueryStringParametersMap = S.Record({
  key: S.String,
  value: S.String,
});
export class PipeTargetHttpParameters extends S.Class<PipeTargetHttpParameters>(
  "PipeTargetHttpParameters",
)({
  PathParameterValues: S.optional(PathParameterList),
  HeaderParameters: S.optional(HeaderParametersMap),
  QueryStringParameters: S.optional(QueryStringParametersMap),
}) {}
export class PipeTargetRedshiftDataParameters extends S.Class<PipeTargetRedshiftDataParameters>(
  "PipeTargetRedshiftDataParameters",
)({
  SecretManagerArn: S.optional(S.String),
  Database: S.String,
  DbUser: S.optional(S.String),
  StatementName: S.optional(S.String),
  WithEvent: S.optional(S.Boolean),
  Sqls: Sqls,
}) {}
export class PipeTargetEventBridgeEventBusParameters extends S.Class<PipeTargetEventBridgeEventBusParameters>(
  "PipeTargetEventBridgeEventBusParameters",
)({
  EndpointId: S.optional(S.String),
  DetailType: S.optional(S.String),
  Source: S.optional(S.String),
  Resources: S.optional(EventBridgeEventResourceList),
  Time: S.optional(S.String),
}) {}
export class PipeTargetCloudWatchLogsParameters extends S.Class<PipeTargetCloudWatchLogsParameters>(
  "PipeTargetCloudWatchLogsParameters",
)({ LogStreamName: S.optional(S.String), Timestamp: S.optional(S.String) }) {}
export class S3LogDestinationParameters extends S.Class<S3LogDestinationParameters>(
  "S3LogDestinationParameters",
)({
  BucketName: S.String,
  BucketOwner: S.String,
  OutputFormat: S.optional(S.String),
  Prefix: S.optional(S.String),
}) {}
export class FirehoseLogDestinationParameters extends S.Class<FirehoseLogDestinationParameters>(
  "FirehoseLogDestinationParameters",
)({ DeliveryStreamArn: S.String }) {}
export class CloudwatchLogsLogDestinationParameters extends S.Class<CloudwatchLogsLogDestinationParameters>(
  "CloudwatchLogsLogDestinationParameters",
)({ LogGroupArn: S.String }) {}
export class UpdatePipeSourceKinesisStreamParameters extends S.Class<UpdatePipeSourceKinesisStreamParameters>(
  "UpdatePipeSourceKinesisStreamParameters",
)({
  BatchSize: S.optional(S.Number),
  DeadLetterConfig: S.optional(DeadLetterConfig),
  OnPartialBatchItemFailure: S.optional(S.String),
  MaximumBatchingWindowInSeconds: S.optional(S.Number),
  MaximumRecordAgeInSeconds: S.optional(S.Number),
  MaximumRetryAttempts: S.optional(S.Number),
  ParallelizationFactor: S.optional(S.Number),
}) {}
export class UpdatePipeSourceDynamoDBStreamParameters extends S.Class<UpdatePipeSourceDynamoDBStreamParameters>(
  "UpdatePipeSourceDynamoDBStreamParameters",
)({
  BatchSize: S.optional(S.Number),
  DeadLetterConfig: S.optional(DeadLetterConfig),
  OnPartialBatchItemFailure: S.optional(S.String),
  MaximumBatchingWindowInSeconds: S.optional(S.Number),
  MaximumRecordAgeInSeconds: S.optional(S.Number),
  MaximumRetryAttempts: S.optional(S.Number),
  ParallelizationFactor: S.optional(S.Number),
}) {}
export class UpdatePipeSourceSqsQueueParameters extends S.Class<UpdatePipeSourceSqsQueueParameters>(
  "UpdatePipeSourceSqsQueueParameters",
)({
  BatchSize: S.optional(S.Number),
  MaximumBatchingWindowInSeconds: S.optional(S.Number),
}) {}
export class UpdatePipeSourceActiveMQBrokerParameters extends S.Class<UpdatePipeSourceActiveMQBrokerParameters>(
  "UpdatePipeSourceActiveMQBrokerParameters",
)({
  Credentials: MQBrokerAccessCredentials,
  BatchSize: S.optional(S.Number),
  MaximumBatchingWindowInSeconds: S.optional(S.Number),
}) {}
export class UpdatePipeSourceRabbitMQBrokerParameters extends S.Class<UpdatePipeSourceRabbitMQBrokerParameters>(
  "UpdatePipeSourceRabbitMQBrokerParameters",
)({
  Credentials: MQBrokerAccessCredentials,
  BatchSize: S.optional(S.Number),
  MaximumBatchingWindowInSeconds: S.optional(S.Number),
}) {}
export const MSKAccessCredentials = S.Union(
  S.Struct({ SaslScram512Auth: S.String }),
  S.Struct({ ClientCertificateTlsAuth: S.String }),
);
export class UpdatePipeSourceManagedStreamingKafkaParameters extends S.Class<UpdatePipeSourceManagedStreamingKafkaParameters>(
  "UpdatePipeSourceManagedStreamingKafkaParameters",
)({
  BatchSize: S.optional(S.Number),
  Credentials: S.optional(MSKAccessCredentials),
  MaximumBatchingWindowInSeconds: S.optional(S.Number),
}) {}
export const SelfManagedKafkaAccessConfigurationCredentials = S.Union(
  S.Struct({ BasicAuth: S.String }),
  S.Struct({ SaslScram512Auth: S.String }),
  S.Struct({ SaslScram256Auth: S.String }),
  S.Struct({ ClientCertificateTlsAuth: S.String }),
);
export const SubnetIds = S.Array(S.String);
export const SecurityGroupIds = S.Array(S.String);
export class SelfManagedKafkaAccessConfigurationVpc extends S.Class<SelfManagedKafkaAccessConfigurationVpc>(
  "SelfManagedKafkaAccessConfigurationVpc",
)({
  Subnets: S.optional(SubnetIds),
  SecurityGroup: S.optional(SecurityGroupIds),
}) {}
export class UpdatePipeSourceSelfManagedKafkaParameters extends S.Class<UpdatePipeSourceSelfManagedKafkaParameters>(
  "UpdatePipeSourceSelfManagedKafkaParameters",
)({
  BatchSize: S.optional(S.Number),
  MaximumBatchingWindowInSeconds: S.optional(S.Number),
  Credentials: S.optional(SelfManagedKafkaAccessConfigurationCredentials),
  ServerRootCaCertificate: S.optional(S.String),
  Vpc: S.optional(SelfManagedKafkaAccessConfigurationVpc),
}) {}
export const StringList = S.Array(S.String);
export class PipeLogConfigurationParameters extends S.Class<PipeLogConfigurationParameters>(
  "PipeLogConfigurationParameters",
)({
  S3LogDestination: S.optional(S3LogDestinationParameters),
  FirehoseLogDestination: S.optional(FirehoseLogDestinationParameters),
  CloudwatchLogsLogDestination: S.optional(
    CloudwatchLogsLogDestinationParameters,
  ),
  Level: S.String,
  IncludeExecutionData: S.optional(IncludeExecutionData),
}) {}
export class Filter extends S.Class<Filter>("Filter")({
  Pattern: S.optional(S.String),
}) {}
export const FilterList = S.Array(Filter);
export class FilterCriteria extends S.Class<FilterCriteria>("FilterCriteria")({
  Filters: S.optional(FilterList),
}) {}
export class UpdatePipeSourceParameters extends S.Class<UpdatePipeSourceParameters>(
  "UpdatePipeSourceParameters",
)({
  FilterCriteria: S.optional(FilterCriteria),
  KinesisStreamParameters: S.optional(UpdatePipeSourceKinesisStreamParameters),
  DynamoDBStreamParameters: S.optional(
    UpdatePipeSourceDynamoDBStreamParameters,
  ),
  SqsQueueParameters: S.optional(UpdatePipeSourceSqsQueueParameters),
  ActiveMQBrokerParameters: S.optional(
    UpdatePipeSourceActiveMQBrokerParameters,
  ),
  RabbitMQBrokerParameters: S.optional(
    UpdatePipeSourceRabbitMQBrokerParameters,
  ),
  ManagedStreamingKafkaParameters: S.optional(
    UpdatePipeSourceManagedStreamingKafkaParameters,
  ),
  SelfManagedKafkaParameters: S.optional(
    UpdatePipeSourceSelfManagedKafkaParameters,
  ),
}) {}
export class Pipe extends S.Class<Pipe>("Pipe")({
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
  DesiredState: S.optional(S.String),
  CurrentState: S.optional(S.String),
  StateReason: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Source: S.optional(S.String),
  Target: S.optional(S.String),
  Enrichment: S.optional(S.String),
}) {}
export const PipeList = S.Array(Pipe);
export class CapacityProviderStrategyItem extends S.Class<CapacityProviderStrategyItem>(
  "CapacityProviderStrategyItem",
)({
  capacityProvider: S.String,
  weight: S.optional(S.Number),
  base: S.optional(S.Number),
}) {}
export const CapacityProviderStrategy = S.Array(CapacityProviderStrategyItem);
export class PlacementConstraint extends S.Class<PlacementConstraint>(
  "PlacementConstraint",
)({ type: S.optional(S.String), expression: S.optional(S.String) }) {}
export const PlacementConstraints = S.Array(PlacementConstraint);
export class PlacementStrategy extends S.Class<PlacementStrategy>(
  "PlacementStrategy",
)({ type: S.optional(S.String), field: S.optional(S.String) }) {}
export const PlacementStrategies = S.Array(PlacementStrategy);
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class BatchArrayProperties extends S.Class<BatchArrayProperties>(
  "BatchArrayProperties",
)({ Size: S.optional(S.Number) }) {}
export class BatchRetryStrategy extends S.Class<BatchRetryStrategy>(
  "BatchRetryStrategy",
)({ Attempts: S.optional(S.Number) }) {}
export class BatchJobDependency extends S.Class<BatchJobDependency>(
  "BatchJobDependency",
)({ JobId: S.optional(S.String), Type: S.optional(S.String) }) {}
export const BatchDependsOn = S.Array(BatchJobDependency);
export const BatchParametersMap = S.Record({ key: S.String, value: S.String });
export class SageMakerPipelineParameter extends S.Class<SageMakerPipelineParameter>(
  "SageMakerPipelineParameter",
)({ Name: S.String, Value: S.String }) {}
export const SageMakerPipelineParameterList = S.Array(
  SageMakerPipelineParameter,
);
export class DimensionMapping extends S.Class<DimensionMapping>(
  "DimensionMapping",
)({
  DimensionValue: S.String,
  DimensionValueType: S.String,
  DimensionName: S.String,
}) {}
export const DimensionMappings = S.Array(DimensionMapping);
export class SingleMeasureMapping extends S.Class<SingleMeasureMapping>(
  "SingleMeasureMapping",
)({
  MeasureValue: S.String,
  MeasureValueType: S.String,
  MeasureName: S.String,
}) {}
export const SingleMeasureMappings = S.Array(SingleMeasureMapping);
export const Subnets = S.Array(S.String);
export const SecurityGroups = S.Array(S.String);
export class PipeEnrichmentHttpParameters extends S.Class<PipeEnrichmentHttpParameters>(
  "PipeEnrichmentHttpParameters",
)({
  PathParameterValues: S.optional(PathParameterList),
  HeaderParameters: S.optional(HeaderParametersMap),
  QueryStringParameters: S.optional(QueryStringParametersMap),
}) {}
export class PipeEnrichmentParameters extends S.Class<PipeEnrichmentParameters>(
  "PipeEnrichmentParameters",
)({
  InputTemplate: S.optional(S.String),
  HttpParameters: S.optional(PipeEnrichmentHttpParameters),
}) {}
export class AwsVpcConfiguration extends S.Class<AwsVpcConfiguration>(
  "AwsVpcConfiguration",
)({
  Subnets: Subnets,
  SecurityGroups: S.optional(SecurityGroups),
  AssignPublicIp: S.optional(S.String),
}) {}
export class NetworkConfiguration extends S.Class<NetworkConfiguration>(
  "NetworkConfiguration",
)({ awsvpcConfiguration: S.optional(AwsVpcConfiguration) }) {}
export class EcsEnvironmentVariable extends S.Class<EcsEnvironmentVariable>(
  "EcsEnvironmentVariable",
)({ name: S.optional(S.String), value: S.optional(S.String) }) {}
export const EcsEnvironmentVariableList = S.Array(EcsEnvironmentVariable);
export class EcsEnvironmentFile extends S.Class<EcsEnvironmentFile>(
  "EcsEnvironmentFile",
)({ type: S.String, value: S.String }) {}
export const EcsEnvironmentFileList = S.Array(EcsEnvironmentFile);
export class EcsResourceRequirement extends S.Class<EcsResourceRequirement>(
  "EcsResourceRequirement",
)({ type: S.String, value: S.String }) {}
export const EcsResourceRequirementsList = S.Array(EcsResourceRequirement);
export class EcsContainerOverride extends S.Class<EcsContainerOverride>(
  "EcsContainerOverride",
)({
  Command: S.optional(StringList),
  Cpu: S.optional(S.Number),
  Environment: S.optional(EcsEnvironmentVariableList),
  EnvironmentFiles: S.optional(EcsEnvironmentFileList),
  Memory: S.optional(S.Number),
  MemoryReservation: S.optional(S.Number),
  Name: S.optional(S.String),
  ResourceRequirements: S.optional(EcsResourceRequirementsList),
}) {}
export const EcsContainerOverrideList = S.Array(EcsContainerOverride);
export class EcsEphemeralStorage extends S.Class<EcsEphemeralStorage>(
  "EcsEphemeralStorage",
)({ sizeInGiB: S.Number }) {}
export class EcsInferenceAcceleratorOverride extends S.Class<EcsInferenceAcceleratorOverride>(
  "EcsInferenceAcceleratorOverride",
)({ deviceName: S.optional(S.String), deviceType: S.optional(S.String) }) {}
export const EcsInferenceAcceleratorOverrideList = S.Array(
  EcsInferenceAcceleratorOverride,
);
export class EcsTaskOverride extends S.Class<EcsTaskOverride>(
  "EcsTaskOverride",
)({
  ContainerOverrides: S.optional(EcsContainerOverrideList),
  Cpu: S.optional(S.String),
  EphemeralStorage: S.optional(EcsEphemeralStorage),
  ExecutionRoleArn: S.optional(S.String),
  InferenceAcceleratorOverrides: S.optional(
    EcsInferenceAcceleratorOverrideList,
  ),
  Memory: S.optional(S.String),
  TaskRoleArn: S.optional(S.String),
}) {}
export class PipeTargetEcsTaskParameters extends S.Class<PipeTargetEcsTaskParameters>(
  "PipeTargetEcsTaskParameters",
)({
  TaskDefinitionArn: S.String,
  TaskCount: S.optional(S.Number),
  LaunchType: S.optional(S.String),
  NetworkConfiguration: S.optional(NetworkConfiguration),
  PlatformVersion: S.optional(S.String),
  Group: S.optional(S.String),
  CapacityProviderStrategy: S.optional(CapacityProviderStrategy),
  EnableECSManagedTags: S.optional(S.Boolean),
  EnableExecuteCommand: S.optional(S.Boolean),
  PlacementConstraints: S.optional(PlacementConstraints),
  PlacementStrategy: S.optional(PlacementStrategies),
  PropagateTags: S.optional(S.String),
  ReferenceId: S.optional(S.String),
  Overrides: S.optional(EcsTaskOverride),
  Tags: S.optional(TagList),
}) {}
export class BatchEnvironmentVariable extends S.Class<BatchEnvironmentVariable>(
  "BatchEnvironmentVariable",
)({ Name: S.optional(S.String), Value: S.optional(S.String) }) {}
export const BatchEnvironmentVariableList = S.Array(BatchEnvironmentVariable);
export class BatchResourceRequirement extends S.Class<BatchResourceRequirement>(
  "BatchResourceRequirement",
)({ Type: S.String, Value: S.String }) {}
export const BatchResourceRequirementsList = S.Array(BatchResourceRequirement);
export class BatchContainerOverrides extends S.Class<BatchContainerOverrides>(
  "BatchContainerOverrides",
)({
  Command: S.optional(StringList),
  Environment: S.optional(BatchEnvironmentVariableList),
  InstanceType: S.optional(S.String),
  ResourceRequirements: S.optional(BatchResourceRequirementsList),
}) {}
export class PipeTargetBatchJobParameters extends S.Class<PipeTargetBatchJobParameters>(
  "PipeTargetBatchJobParameters",
)({
  JobDefinition: S.String,
  JobName: S.String,
  ArrayProperties: S.optional(BatchArrayProperties),
  RetryStrategy: S.optional(BatchRetryStrategy),
  ContainerOverrides: S.optional(BatchContainerOverrides),
  DependsOn: S.optional(BatchDependsOn),
  Parameters: S.optional(BatchParametersMap),
}) {}
export class PipeTargetSageMakerPipelineParameters extends S.Class<PipeTargetSageMakerPipelineParameters>(
  "PipeTargetSageMakerPipelineParameters",
)({ PipelineParameterList: S.optional(SageMakerPipelineParameterList) }) {}
export class MultiMeasureAttributeMapping extends S.Class<MultiMeasureAttributeMapping>(
  "MultiMeasureAttributeMapping",
)({
  MeasureValue: S.String,
  MeasureValueType: S.String,
  MultiMeasureAttributeName: S.String,
}) {}
export const MultiMeasureAttributeMappings = S.Array(
  MultiMeasureAttributeMapping,
);
export class MultiMeasureMapping extends S.Class<MultiMeasureMapping>(
  "MultiMeasureMapping",
)({
  MultiMeasureName: S.String,
  MultiMeasureAttributeMappings: MultiMeasureAttributeMappings,
}) {}
export const MultiMeasureMappings = S.Array(MultiMeasureMapping);
export class PipeTargetTimestreamParameters extends S.Class<PipeTargetTimestreamParameters>(
  "PipeTargetTimestreamParameters",
)({
  TimeValue: S.String,
  EpochTimeUnit: S.optional(S.String),
  TimeFieldType: S.optional(S.String),
  TimestampFormat: S.optional(S.String),
  VersionValue: S.String,
  DimensionMappings: DimensionMappings,
  SingleMeasureMappings: S.optional(SingleMeasureMappings),
  MultiMeasureMappings: S.optional(MultiMeasureMappings),
}) {}
export class PipeTargetParameters extends S.Class<PipeTargetParameters>(
  "PipeTargetParameters",
)({
  InputTemplate: S.optional(S.String),
  LambdaFunctionParameters: S.optional(PipeTargetLambdaFunctionParameters),
  StepFunctionStateMachineParameters: S.optional(
    PipeTargetStateMachineParameters,
  ),
  KinesisStreamParameters: S.optional(PipeTargetKinesisStreamParameters),
  EcsTaskParameters: S.optional(PipeTargetEcsTaskParameters),
  BatchJobParameters: S.optional(PipeTargetBatchJobParameters),
  SqsQueueParameters: S.optional(PipeTargetSqsQueueParameters),
  HttpParameters: S.optional(PipeTargetHttpParameters),
  RedshiftDataParameters: S.optional(PipeTargetRedshiftDataParameters),
  SageMakerPipelineParameters: S.optional(
    PipeTargetSageMakerPipelineParameters,
  ),
  EventBridgeEventBusParameters: S.optional(
    PipeTargetEventBridgeEventBusParameters,
  ),
  CloudWatchLogsParameters: S.optional(PipeTargetCloudWatchLogsParameters),
  TimestreamParameters: S.optional(PipeTargetTimestreamParameters),
}) {}
export class UpdatePipeRequest extends S.Class<UpdatePipeRequest>(
  "UpdatePipeRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel("Name")),
    Description: S.optional(S.String),
    DesiredState: S.optional(S.String),
    SourceParameters: S.optional(UpdatePipeSourceParameters),
    Enrichment: S.optional(S.String),
    EnrichmentParameters: S.optional(PipeEnrichmentParameters),
    Target: S.optional(S.String),
    TargetParameters: S.optional(PipeTargetParameters),
    RoleArn: S.String,
    LogConfiguration: S.optional(PipeLogConfigurationParameters),
    KmsKeyIdentifier: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "PUT", uri: "/v1/pipes/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPipesResponse extends S.Class<ListPipesResponse>(
  "ListPipesResponse",
)({ Pipes: S.optional(PipeList), NextToken: S.optional(S.String) }, ns) {}
export class PipeSourceKinesisStreamParameters extends S.Class<PipeSourceKinesisStreamParameters>(
  "PipeSourceKinesisStreamParameters",
)({
  BatchSize: S.optional(S.Number),
  DeadLetterConfig: S.optional(DeadLetterConfig),
  OnPartialBatchItemFailure: S.optional(S.String),
  MaximumBatchingWindowInSeconds: S.optional(S.Number),
  MaximumRecordAgeInSeconds: S.optional(S.Number),
  MaximumRetryAttempts: S.optional(S.Number),
  ParallelizationFactor: S.optional(S.Number),
  StartingPosition: S.String,
  StartingPositionTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class PipeSourceActiveMQBrokerParameters extends S.Class<PipeSourceActiveMQBrokerParameters>(
  "PipeSourceActiveMQBrokerParameters",
)({
  Credentials: MQBrokerAccessCredentials,
  QueueName: S.String,
  BatchSize: S.optional(S.Number),
  MaximumBatchingWindowInSeconds: S.optional(S.Number),
}) {}
export class PipeSourceManagedStreamingKafkaParameters extends S.Class<PipeSourceManagedStreamingKafkaParameters>(
  "PipeSourceManagedStreamingKafkaParameters",
)({
  TopicName: S.String,
  StartingPosition: S.optional(S.String),
  BatchSize: S.optional(S.Number),
  MaximumBatchingWindowInSeconds: S.optional(S.Number),
  ConsumerGroupID: S.optional(S.String),
  Credentials: S.optional(MSKAccessCredentials),
}) {}
export class PipeSourceSelfManagedKafkaParameters extends S.Class<PipeSourceSelfManagedKafkaParameters>(
  "PipeSourceSelfManagedKafkaParameters",
)({
  TopicName: S.String,
  StartingPosition: S.optional(S.String),
  AdditionalBootstrapServers: S.optional(KafkaBootstrapServers),
  BatchSize: S.optional(S.Number),
  MaximumBatchingWindowInSeconds: S.optional(S.Number),
  ConsumerGroupID: S.optional(S.String),
  Credentials: S.optional(SelfManagedKafkaAccessConfigurationCredentials),
  ServerRootCaCertificate: S.optional(S.String),
  Vpc: S.optional(SelfManagedKafkaAccessConfigurationVpc),
}) {}
export class S3LogDestination extends S.Class<S3LogDestination>(
  "S3LogDestination",
)({
  BucketName: S.optional(S.String),
  Prefix: S.optional(S.String),
  BucketOwner: S.optional(S.String),
  OutputFormat: S.optional(S.String),
}) {}
export class FirehoseLogDestination extends S.Class<FirehoseLogDestination>(
  "FirehoseLogDestination",
)({ DeliveryStreamArn: S.optional(S.String) }) {}
export class CloudwatchLogsLogDestination extends S.Class<CloudwatchLogsLogDestination>(
  "CloudwatchLogsLogDestination",
)({ LogGroupArn: S.optional(S.String) }) {}
export class PipeSourceParameters extends S.Class<PipeSourceParameters>(
  "PipeSourceParameters",
)({
  FilterCriteria: S.optional(FilterCriteria),
  KinesisStreamParameters: S.optional(PipeSourceKinesisStreamParameters),
  DynamoDBStreamParameters: S.optional(PipeSourceDynamoDBStreamParameters),
  SqsQueueParameters: S.optional(PipeSourceSqsQueueParameters),
  ActiveMQBrokerParameters: S.optional(PipeSourceActiveMQBrokerParameters),
  RabbitMQBrokerParameters: S.optional(PipeSourceRabbitMQBrokerParameters),
  ManagedStreamingKafkaParameters: S.optional(
    PipeSourceManagedStreamingKafkaParameters,
  ),
  SelfManagedKafkaParameters: S.optional(PipeSourceSelfManagedKafkaParameters),
}) {}
export class PipeLogConfiguration extends S.Class<PipeLogConfiguration>(
  "PipeLogConfiguration",
)({
  S3LogDestination: S.optional(S3LogDestination),
  FirehoseLogDestination: S.optional(FirehoseLogDestination),
  CloudwatchLogsLogDestination: S.optional(CloudwatchLogsLogDestination),
  Level: S.optional(S.String),
  IncludeExecutionData: S.optional(IncludeExecutionData),
}) {}
export class DescribePipeResponse extends S.Class<DescribePipeResponse>(
  "DescribePipeResponse",
)(
  {
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    DesiredState: S.optional(S.String),
    CurrentState: S.optional(S.String),
    StateReason: S.optional(S.String),
    Source: S.optional(S.String),
    SourceParameters: S.optional(PipeSourceParameters),
    Enrichment: S.optional(S.String),
    EnrichmentParameters: S.optional(PipeEnrichmentParameters),
    Target: S.optional(S.String),
    TargetParameters: S.optional(PipeTargetParameters),
    RoleArn: S.optional(S.String),
    Tags: S.optional(TagMap),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LogConfiguration: S.optional(PipeLogConfiguration),
    KmsKeyIdentifier: S.optional(S.String),
  },
  ns,
) {}
export class UpdatePipeResponse extends S.Class<UpdatePipeResponse>(
  "UpdatePipeResponse",
)(
  {
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    DesiredState: S.optional(S.String),
    CurrentState: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  ns,
) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class CreatePipeRequest extends S.Class<CreatePipeRequest>(
  "CreatePipeRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel("Name")),
    Description: S.optional(S.String),
    DesiredState: S.optional(S.String),
    Source: S.String,
    SourceParameters: S.optional(PipeSourceParameters),
    Enrichment: S.optional(S.String),
    EnrichmentParameters: S.optional(PipeEnrichmentParameters),
    Target: S.String,
    TargetParameters: S.optional(PipeTargetParameters),
    RoleArn: S.String,
    Tags: S.optional(TagMap),
    LogConfiguration: S.optional(PipeLogConfigurationParameters),
    KmsKeyIdentifier: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/pipes/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePipeResponse extends S.Class<CreatePipeResponse>(
  "CreatePipeResponse",
)(
  {
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    DesiredState: S.optional(S.String),
    CurrentState: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  ns,
) {}

//# Errors
export class InternalException extends S.TaggedError<InternalException>()(
  "InternalException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.optional(S.String),
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
  },
) {}

//# Operations
/**
 * Removes one or more tags from the specified pipes.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [InternalException, NotFoundException, ValidationException],
}));
/**
 * Displays the tags associated with a pipe.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [InternalException, NotFoundException, ValidationException],
}));
/**
 * Assigns one or more tags (key-value pairs) to the specified pipe. Tags can help you
 * organize and categorize your resources. You can also use them to scope user permissions by
 * granting a user permission to access or change only resources with certain tag
 * values.
 *
 * Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly
 * as strings of characters.
 *
 * You can use the `TagResource` action with a pipe that already has tags. If
 * you specify a new tag key, this tag is appended to the list of tags associated with the
 * pipe. If you specify a tag key that is already associated with the pipe, the new tag value
 * that you specify replaces the previous value for that tag.
 *
 * You can associate as many as 50 tags with a pipe.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [InternalException, NotFoundException, ValidationException],
}));
/**
 * Delete an existing pipe. For more information about pipes, see Amazon EventBridge Pipes in the Amazon EventBridge User Guide.
 */
export const deletePipe = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePipeRequest,
  output: DeletePipeResponse,
  errors: [
    ConflictException,
    InternalException,
    NotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get the pipes associated with this account. For more information about pipes, see Amazon EventBridge Pipes in the Amazon EventBridge User Guide.
 */
export const listPipes = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPipesRequest,
  output: ListPipesResponse,
  errors: [InternalException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Pipes",
    pageSize: "Limit",
  } as const,
}));
/**
 * Start an existing pipe.
 */
export const startPipe = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartPipeRequest,
  output: StartPipeResponse,
  errors: [
    ConflictException,
    InternalException,
    NotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Stop an existing pipe.
 */
export const stopPipe = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopPipeRequest,
  output: StopPipeResponse,
  errors: [
    ConflictException,
    InternalException,
    NotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get the information about an existing pipe. For more information about pipes, see Amazon EventBridge Pipes in the Amazon EventBridge User Guide.
 */
export const describePipe = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePipeRequest,
  output: DescribePipeResponse,
  errors: [
    InternalException,
    NotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update an existing pipe. When you call `UpdatePipe`, EventBridge only the
 * updates fields you have specified in the request; the rest remain unchanged. The exception
 * to this is if you modify any Amazon Web Services-service specific fields in the
 * `SourceParameters`, `EnrichmentParameters`, or
 * `TargetParameters` objects. For example,
 * `DynamoDBStreamParameters` or `EventBridgeEventBusParameters`.
 * EventBridge updates the fields in these objects atomically as one and overrides existing
 * values. This is by design, and means that if you don't specify an optional field in one of
 * these `Parameters` objects, EventBridge sets that field to its system-default
 * value during the update.
 *
 * For more information about pipes, see
 * Amazon EventBridge Pipes in the Amazon EventBridge User Guide.
 */
export const updatePipe = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePipeRequest,
  output: UpdatePipeResponse,
  errors: [
    ConflictException,
    InternalException,
    NotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Create a pipe. Amazon EventBridge Pipes connect event sources to targets and reduces
 * the need for specialized knowledge and integration code.
 */
export const createPipe = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePipeRequest,
  output: CreatePipeResponse,
  errors: [
    ConflictException,
    InternalException,
    NotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
