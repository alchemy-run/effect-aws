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
const ns = T.XmlNamespace("http://events.amazonaws.com/doc/2015-10-07");
const svc = T.AwsApiService({ sdkId: "Pipes", serviceShapeName: "Pipes" });
const auth = T.AwsAuthSigv4({ name: "pipes" });
const ver = T.ServiceVersion("2015-10-07");
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
              `https://pipes-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://pipes-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://pipes.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://pipes.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type PipeArn = string;
export type TagKey = string;
export type PipeName = string;
export type PipeDescription = string | redacted.Redacted<string>;
export type RequestedPipeState = string;
export type ArnOrUrl = string;
export type OptionalArn = string;
export type Arn = string;
export type RoleArn = string;
export type KmsKeyIdentifier = string;
export type PipeState = string;
export type ResourceArn = string;
export type NextToken = string | redacted.Redacted<string>;
export type LimitMax100 = number;
export type TagValue = string | redacted.Redacted<string>;
export type InputTemplate = string | redacted.Redacted<string>;
export type LogLevel = string;
export type IncludeExecutionDataOption = string;
export type RequestedPipeStateDescribeResponse = string;
export type PipeStateReason = string;
export type LimitMax10000 = number;
export type OnPartialBatchItemFailureStreams = string;
export type MaximumBatchingWindowInSeconds = number;
export type MaximumRecordAgeInSeconds = number;
export type MaximumRetryAttemptsESM = number;
export type LimitMax10 = number;
export type KinesisStreamStartPosition = string;
export type DynamoDBStreamStartPosition = string;
export type MQBrokerQueueName = string | redacted.Redacted<string>;
export type URI = string | redacted.Redacted<string>;
export type KafkaTopicName = string | redacted.Redacted<string>;
export type MSKStartPosition = string;
export type SelfManagedKafkaStartPosition = string;
export type EndpointString = string | redacted.Redacted<string>;
export type SecretManagerArn = string;
export type PathParameter = string | redacted.Redacted<string>;
export type PipeTargetInvocationType = string;
export type KinesisPartitionKey = string | redacted.Redacted<string>;
export type ArnOrJsonPath = string;
export type LimitMin1 = number;
export type LaunchType = string;
export type PropagateTags = string;
export type ReferenceId = string | redacted.Redacted<string>;
export type MessageGroupId = string | redacted.Redacted<string>;
export type MessageDeduplicationId = string | redacted.Redacted<string>;
export type SecretManagerArnOrJsonPath = string;
export type Database = string | redacted.Redacted<string>;
export type DbUser = string | redacted.Redacted<string>;
export type StatementName = string | redacted.Redacted<string>;
export type Sql = string | redacted.Redacted<string>;
export type EventBridgeEndpointId = string | redacted.Redacted<string>;
export type EventBridgeDetailType = string | redacted.Redacted<string>;
export type EventBridgeEventSource = string | redacted.Redacted<string>;
export type JsonPath = string;
export type LogStreamName = string;
export type TimeValue = string;
export type EpochTimeUnit = string;
export type TimeFieldType = string;
export type TimestampFormat = string;
export type VersionValue = string;
export type S3OutputFormat = string;
export type FirehoseArn = string;
export type CloudwatchLogGroupArn = string;
export type EventPattern = string | redacted.Redacted<string>;
export type SubnetId = string | redacted.Redacted<string>;
export type SecurityGroupId = string | redacted.Redacted<string>;
export type HeaderKey = string;
export type HeaderValue = string | redacted.Redacted<string>;
export type QueryStringKey = string;
export type QueryStringValue = string | redacted.Redacted<string>;
export type CapacityProvider = string | redacted.Redacted<string>;
export type CapacityProviderStrategyItemWeight = number;
export type CapacityProviderStrategyItemBase = number;
export type PlacementConstraintType = string;
export type PlacementConstraintExpression = string | redacted.Redacted<string>;
export type PlacementStrategyType = string;
export type PlacementStrategyField = string | redacted.Redacted<string>;
export type BatchArraySize = number;
export type BatchRetryAttempts = number;
export type BatchJobDependencyType = string;
export type SageMakerPipelineParameterName = string | redacted.Redacted<string>;
export type SageMakerPipelineParameterValue =
  | string
  | redacted.Redacted<string>;
export type DimensionValue = string;
export type DimensionValueType = string;
export type DimensionName = string;
export type MeasureValue = string;
export type MeasureValueType = string;
export type MeasureName = string;
export type MultiMeasureName = string;
export type ErrorMessage = string;
export type Subnet = string | redacted.Redacted<string>;
export type SecurityGroup = string | redacted.Redacted<string>;
export type AssignPublicIp = string;
export type EphemeralStorageSize = number;
export type BatchResourceRequirementType = string;
export type MultiMeasureAttributeName = string;
export type EcsEnvironmentFileType = string;
export type EcsResourceRequirementType = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      ns,
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
      ns,
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
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface DescribePipeRequest {
  Name: string;
}
export const DescribePipeRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v1/pipes/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePipeRequest",
}) as any as S.Schema<DescribePipeRequest>;
export interface DeletePipeRequest {
  Name: string;
}
export const DeletePipeRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/v1/pipes/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePipeRequest",
}) as any as S.Schema<DeletePipeRequest>;
export interface ListPipesRequest {
  NamePrefix?: string;
  DesiredState?: string;
  CurrentState?: string;
  SourcePrefix?: string;
  TargetPrefix?: string;
  NextToken?: string | redacted.Redacted<string>;
  Limit?: number;
}
export const ListPipesRequest = S.suspend(() =>
  S.Struct({
    NamePrefix: S.optional(S.String).pipe(T.HttpQuery("NamePrefix")),
    DesiredState: S.optional(S.String).pipe(T.HttpQuery("DesiredState")),
    CurrentState: S.optional(S.String).pipe(T.HttpQuery("CurrentState")),
    SourcePrefix: S.optional(S.String).pipe(T.HttpQuery("SourcePrefix")),
    TargetPrefix: S.optional(S.String).pipe(T.HttpQuery("TargetPrefix")),
    NextToken: S.optional(SensitiveString).pipe(T.HttpQuery("NextToken")),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("Limit")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v1/pipes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPipesRequest",
}) as any as S.Schema<ListPipesRequest>;
export interface StartPipeRequest {
  Name: string;
}
export const StartPipeRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/pipes/{Name}/start" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartPipeRequest",
}) as any as S.Schema<StartPipeRequest>;
export interface StopPipeRequest {
  Name: string;
}
export const StopPipeRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/pipes/{Name}/stop" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopPipeRequest",
}) as any as S.Schema<StopPipeRequest>;
export type IncludeExecutionData = string[];
export const IncludeExecutionData = S.Array(S.String);
export type TagMap = {
  [key: string]: string | redacted.Redacted<string> | undefined;
};
export const TagMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(SensitiveString),
});
export type KafkaBootstrapServers = string | redacted.Redacted<string>[];
export const KafkaBootstrapServers = S.Array(SensitiveString);
export type PathParameterList = string | redacted.Redacted<string>[];
export const PathParameterList = S.Array(SensitiveString);
export type Sqls = string | redacted.Redacted<string>[];
export const Sqls = S.Array(SensitiveString);
export type EventBridgeEventResourceList = string[];
export const EventBridgeEventResourceList = S.Array(S.String);
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string | redacted.Redacted<string> | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string | redacted.Redacted<string> | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagMap,
  }).pipe(
    T.all(
      ns,
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
export const TagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface DeletePipeResponse {
  Arn?: string;
  Name?: string;
  DesiredState?: string;
  CurrentState?: string;
  CreationTime?: Date;
  LastModifiedTime?: Date;
}
export const DeletePipeResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    DesiredState: S.optional(S.String),
    CurrentState: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }).pipe(ns),
).annotations({
  identifier: "DeletePipeResponse",
}) as any as S.Schema<DeletePipeResponse>;
export interface StartPipeResponse {
  Arn?: string;
  Name?: string;
  DesiredState?: string;
  CurrentState?: string;
  CreationTime?: Date;
  LastModifiedTime?: Date;
}
export const StartPipeResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    DesiredState: S.optional(S.String),
    CurrentState: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }).pipe(ns),
).annotations({
  identifier: "StartPipeResponse",
}) as any as S.Schema<StartPipeResponse>;
export interface StopPipeResponse {
  Arn?: string;
  Name?: string;
  DesiredState?: string;
  CurrentState?: string;
  CreationTime?: Date;
  LastModifiedTime?: Date;
}
export const StopPipeResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    DesiredState: S.optional(S.String),
    CurrentState: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }).pipe(ns),
).annotations({
  identifier: "StopPipeResponse",
}) as any as S.Schema<StopPipeResponse>;
export interface DeadLetterConfig {
  Arn?: string;
}
export const DeadLetterConfig = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "DeadLetterConfig",
}) as any as S.Schema<DeadLetterConfig>;
export interface PipeSourceDynamoDBStreamParameters {
  BatchSize?: number;
  DeadLetterConfig?: DeadLetterConfig;
  OnPartialBatchItemFailure?: string;
  MaximumBatchingWindowInSeconds?: number;
  MaximumRecordAgeInSeconds?: number;
  MaximumRetryAttempts?: number;
  ParallelizationFactor?: number;
  StartingPosition: string;
}
export const PipeSourceDynamoDBStreamParameters = S.suspend(() =>
  S.Struct({
    BatchSize: S.optional(S.Number),
    DeadLetterConfig: S.optional(DeadLetterConfig),
    OnPartialBatchItemFailure: S.optional(S.String),
    MaximumBatchingWindowInSeconds: S.optional(S.Number),
    MaximumRecordAgeInSeconds: S.optional(S.Number),
    MaximumRetryAttempts: S.optional(S.Number),
    ParallelizationFactor: S.optional(S.Number),
    StartingPosition: S.String,
  }),
).annotations({
  identifier: "PipeSourceDynamoDBStreamParameters",
}) as any as S.Schema<PipeSourceDynamoDBStreamParameters>;
export interface PipeSourceSqsQueueParameters {
  BatchSize?: number;
  MaximumBatchingWindowInSeconds?: number;
}
export const PipeSourceSqsQueueParameters = S.suspend(() =>
  S.Struct({
    BatchSize: S.optional(S.Number),
    MaximumBatchingWindowInSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "PipeSourceSqsQueueParameters",
}) as any as S.Schema<PipeSourceSqsQueueParameters>;
export type MQBrokerAccessCredentials = { BasicAuth: string };
export const MQBrokerAccessCredentials = S.Union(
  S.Struct({ BasicAuth: S.String }),
);
export interface PipeSourceRabbitMQBrokerParameters {
  Credentials: MQBrokerAccessCredentials;
  QueueName: string | redacted.Redacted<string>;
  VirtualHost?: string | redacted.Redacted<string>;
  BatchSize?: number;
  MaximumBatchingWindowInSeconds?: number;
}
export const PipeSourceRabbitMQBrokerParameters = S.suspend(() =>
  S.Struct({
    Credentials: MQBrokerAccessCredentials,
    QueueName: SensitiveString,
    VirtualHost: S.optional(SensitiveString),
    BatchSize: S.optional(S.Number),
    MaximumBatchingWindowInSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "PipeSourceRabbitMQBrokerParameters",
}) as any as S.Schema<PipeSourceRabbitMQBrokerParameters>;
export interface PipeTargetLambdaFunctionParameters {
  InvocationType?: string;
}
export const PipeTargetLambdaFunctionParameters = S.suspend(() =>
  S.Struct({ InvocationType: S.optional(S.String) }),
).annotations({
  identifier: "PipeTargetLambdaFunctionParameters",
}) as any as S.Schema<PipeTargetLambdaFunctionParameters>;
export interface PipeTargetStateMachineParameters {
  InvocationType?: string;
}
export const PipeTargetStateMachineParameters = S.suspend(() =>
  S.Struct({ InvocationType: S.optional(S.String) }),
).annotations({
  identifier: "PipeTargetStateMachineParameters",
}) as any as S.Schema<PipeTargetStateMachineParameters>;
export interface PipeTargetKinesisStreamParameters {
  PartitionKey: string | redacted.Redacted<string>;
}
export const PipeTargetKinesisStreamParameters = S.suspend(() =>
  S.Struct({ PartitionKey: SensitiveString }),
).annotations({
  identifier: "PipeTargetKinesisStreamParameters",
}) as any as S.Schema<PipeTargetKinesisStreamParameters>;
export interface PipeTargetSqsQueueParameters {
  MessageGroupId?: string | redacted.Redacted<string>;
  MessageDeduplicationId?: string | redacted.Redacted<string>;
}
export const PipeTargetSqsQueueParameters = S.suspend(() =>
  S.Struct({
    MessageGroupId: S.optional(SensitiveString),
    MessageDeduplicationId: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "PipeTargetSqsQueueParameters",
}) as any as S.Schema<PipeTargetSqsQueueParameters>;
export type HeaderParametersMap = {
  [key: string]: string | redacted.Redacted<string> | undefined;
};
export const HeaderParametersMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(SensitiveString),
});
export type QueryStringParametersMap = {
  [key: string]: string | redacted.Redacted<string> | undefined;
};
export const QueryStringParametersMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(SensitiveString),
});
export interface PipeTargetHttpParameters {
  PathParameterValues?: string | redacted.Redacted<string>[];
  HeaderParameters?: {
    [key: string]: string | redacted.Redacted<string> | undefined;
  };
  QueryStringParameters?: {
    [key: string]: string | redacted.Redacted<string> | undefined;
  };
}
export const PipeTargetHttpParameters = S.suspend(() =>
  S.Struct({
    PathParameterValues: S.optional(PathParameterList),
    HeaderParameters: S.optional(HeaderParametersMap),
    QueryStringParameters: S.optional(QueryStringParametersMap),
  }),
).annotations({
  identifier: "PipeTargetHttpParameters",
}) as any as S.Schema<PipeTargetHttpParameters>;
export interface PipeTargetRedshiftDataParameters {
  SecretManagerArn?: string;
  Database: string | redacted.Redacted<string>;
  DbUser?: string | redacted.Redacted<string>;
  StatementName?: string | redacted.Redacted<string>;
  WithEvent?: boolean;
  Sqls: string | redacted.Redacted<string>[];
}
export const PipeTargetRedshiftDataParameters = S.suspend(() =>
  S.Struct({
    SecretManagerArn: S.optional(S.String),
    Database: SensitiveString,
    DbUser: S.optional(SensitiveString),
    StatementName: S.optional(SensitiveString),
    WithEvent: S.optional(S.Boolean),
    Sqls: Sqls,
  }),
).annotations({
  identifier: "PipeTargetRedshiftDataParameters",
}) as any as S.Schema<PipeTargetRedshiftDataParameters>;
export interface PipeTargetEventBridgeEventBusParameters {
  EndpointId?: string | redacted.Redacted<string>;
  DetailType?: string | redacted.Redacted<string>;
  Source?: string | redacted.Redacted<string>;
  Resources?: string[];
  Time?: string;
}
export const PipeTargetEventBridgeEventBusParameters = S.suspend(() =>
  S.Struct({
    EndpointId: S.optional(SensitiveString),
    DetailType: S.optional(SensitiveString),
    Source: S.optional(SensitiveString),
    Resources: S.optional(EventBridgeEventResourceList),
    Time: S.optional(S.String),
  }),
).annotations({
  identifier: "PipeTargetEventBridgeEventBusParameters",
}) as any as S.Schema<PipeTargetEventBridgeEventBusParameters>;
export interface PipeTargetCloudWatchLogsParameters {
  LogStreamName?: string;
  Timestamp?: string;
}
export const PipeTargetCloudWatchLogsParameters = S.suspend(() =>
  S.Struct({
    LogStreamName: S.optional(S.String),
    Timestamp: S.optional(S.String),
  }),
).annotations({
  identifier: "PipeTargetCloudWatchLogsParameters",
}) as any as S.Schema<PipeTargetCloudWatchLogsParameters>;
export interface S3LogDestinationParameters {
  BucketName: string;
  BucketOwner: string;
  OutputFormat?: string;
  Prefix?: string;
}
export const S3LogDestinationParameters = S.suspend(() =>
  S.Struct({
    BucketName: S.String,
    BucketOwner: S.String,
    OutputFormat: S.optional(S.String),
    Prefix: S.optional(S.String),
  }),
).annotations({
  identifier: "S3LogDestinationParameters",
}) as any as S.Schema<S3LogDestinationParameters>;
export interface FirehoseLogDestinationParameters {
  DeliveryStreamArn: string;
}
export const FirehoseLogDestinationParameters = S.suspend(() =>
  S.Struct({ DeliveryStreamArn: S.String }),
).annotations({
  identifier: "FirehoseLogDestinationParameters",
}) as any as S.Schema<FirehoseLogDestinationParameters>;
export interface CloudwatchLogsLogDestinationParameters {
  LogGroupArn: string;
}
export const CloudwatchLogsLogDestinationParameters = S.suspend(() =>
  S.Struct({ LogGroupArn: S.String }),
).annotations({
  identifier: "CloudwatchLogsLogDestinationParameters",
}) as any as S.Schema<CloudwatchLogsLogDestinationParameters>;
export interface UpdatePipeSourceKinesisStreamParameters {
  BatchSize?: number;
  DeadLetterConfig?: DeadLetterConfig;
  OnPartialBatchItemFailure?: string;
  MaximumBatchingWindowInSeconds?: number;
  MaximumRecordAgeInSeconds?: number;
  MaximumRetryAttempts?: number;
  ParallelizationFactor?: number;
}
export const UpdatePipeSourceKinesisStreamParameters = S.suspend(() =>
  S.Struct({
    BatchSize: S.optional(S.Number),
    DeadLetterConfig: S.optional(DeadLetterConfig),
    OnPartialBatchItemFailure: S.optional(S.String),
    MaximumBatchingWindowInSeconds: S.optional(S.Number),
    MaximumRecordAgeInSeconds: S.optional(S.Number),
    MaximumRetryAttempts: S.optional(S.Number),
    ParallelizationFactor: S.optional(S.Number),
  }),
).annotations({
  identifier: "UpdatePipeSourceKinesisStreamParameters",
}) as any as S.Schema<UpdatePipeSourceKinesisStreamParameters>;
export interface UpdatePipeSourceDynamoDBStreamParameters {
  BatchSize?: number;
  DeadLetterConfig?: DeadLetterConfig;
  OnPartialBatchItemFailure?: string;
  MaximumBatchingWindowInSeconds?: number;
  MaximumRecordAgeInSeconds?: number;
  MaximumRetryAttempts?: number;
  ParallelizationFactor?: number;
}
export const UpdatePipeSourceDynamoDBStreamParameters = S.suspend(() =>
  S.Struct({
    BatchSize: S.optional(S.Number),
    DeadLetterConfig: S.optional(DeadLetterConfig),
    OnPartialBatchItemFailure: S.optional(S.String),
    MaximumBatchingWindowInSeconds: S.optional(S.Number),
    MaximumRecordAgeInSeconds: S.optional(S.Number),
    MaximumRetryAttempts: S.optional(S.Number),
    ParallelizationFactor: S.optional(S.Number),
  }),
).annotations({
  identifier: "UpdatePipeSourceDynamoDBStreamParameters",
}) as any as S.Schema<UpdatePipeSourceDynamoDBStreamParameters>;
export interface UpdatePipeSourceSqsQueueParameters {
  BatchSize?: number;
  MaximumBatchingWindowInSeconds?: number;
}
export const UpdatePipeSourceSqsQueueParameters = S.suspend(() =>
  S.Struct({
    BatchSize: S.optional(S.Number),
    MaximumBatchingWindowInSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "UpdatePipeSourceSqsQueueParameters",
}) as any as S.Schema<UpdatePipeSourceSqsQueueParameters>;
export interface UpdatePipeSourceActiveMQBrokerParameters {
  Credentials: MQBrokerAccessCredentials;
  BatchSize?: number;
  MaximumBatchingWindowInSeconds?: number;
}
export const UpdatePipeSourceActiveMQBrokerParameters = S.suspend(() =>
  S.Struct({
    Credentials: MQBrokerAccessCredentials,
    BatchSize: S.optional(S.Number),
    MaximumBatchingWindowInSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "UpdatePipeSourceActiveMQBrokerParameters",
}) as any as S.Schema<UpdatePipeSourceActiveMQBrokerParameters>;
export interface UpdatePipeSourceRabbitMQBrokerParameters {
  Credentials: MQBrokerAccessCredentials;
  BatchSize?: number;
  MaximumBatchingWindowInSeconds?: number;
}
export const UpdatePipeSourceRabbitMQBrokerParameters = S.suspend(() =>
  S.Struct({
    Credentials: MQBrokerAccessCredentials,
    BatchSize: S.optional(S.Number),
    MaximumBatchingWindowInSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "UpdatePipeSourceRabbitMQBrokerParameters",
}) as any as S.Schema<UpdatePipeSourceRabbitMQBrokerParameters>;
export type MSKAccessCredentials =
  | { SaslScram512Auth: string; ClientCertificateTlsAuth?: never }
  | { SaslScram512Auth?: never; ClientCertificateTlsAuth: string };
export const MSKAccessCredentials = S.Union(
  S.Struct({ SaslScram512Auth: S.String }),
  S.Struct({ ClientCertificateTlsAuth: S.String }),
);
export interface UpdatePipeSourceManagedStreamingKafkaParameters {
  BatchSize?: number;
  Credentials?: MSKAccessCredentials;
  MaximumBatchingWindowInSeconds?: number;
}
export const UpdatePipeSourceManagedStreamingKafkaParameters = S.suspend(() =>
  S.Struct({
    BatchSize: S.optional(S.Number),
    Credentials: S.optional(MSKAccessCredentials),
    MaximumBatchingWindowInSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "UpdatePipeSourceManagedStreamingKafkaParameters",
}) as any as S.Schema<UpdatePipeSourceManagedStreamingKafkaParameters>;
export type SelfManagedKafkaAccessConfigurationCredentials =
  | {
      BasicAuth: string;
      SaslScram512Auth?: never;
      SaslScram256Auth?: never;
      ClientCertificateTlsAuth?: never;
    }
  | {
      BasicAuth?: never;
      SaslScram512Auth: string;
      SaslScram256Auth?: never;
      ClientCertificateTlsAuth?: never;
    }
  | {
      BasicAuth?: never;
      SaslScram512Auth?: never;
      SaslScram256Auth: string;
      ClientCertificateTlsAuth?: never;
    }
  | {
      BasicAuth?: never;
      SaslScram512Auth?: never;
      SaslScram256Auth?: never;
      ClientCertificateTlsAuth: string;
    };
export const SelfManagedKafkaAccessConfigurationCredentials = S.Union(
  S.Struct({ BasicAuth: S.String }),
  S.Struct({ SaslScram512Auth: S.String }),
  S.Struct({ SaslScram256Auth: S.String }),
  S.Struct({ ClientCertificateTlsAuth: S.String }),
);
export type SubnetIds = string | redacted.Redacted<string>[];
export const SubnetIds = S.Array(SensitiveString);
export type SecurityGroupIds = string | redacted.Redacted<string>[];
export const SecurityGroupIds = S.Array(SensitiveString);
export interface SelfManagedKafkaAccessConfigurationVpc {
  Subnets?: string | redacted.Redacted<string>[];
  SecurityGroup?: string | redacted.Redacted<string>[];
}
export const SelfManagedKafkaAccessConfigurationVpc = S.suspend(() =>
  S.Struct({
    Subnets: S.optional(SubnetIds),
    SecurityGroup: S.optional(SecurityGroupIds),
  }),
).annotations({
  identifier: "SelfManagedKafkaAccessConfigurationVpc",
}) as any as S.Schema<SelfManagedKafkaAccessConfigurationVpc>;
export interface UpdatePipeSourceSelfManagedKafkaParameters {
  BatchSize?: number;
  MaximumBatchingWindowInSeconds?: number;
  Credentials?: SelfManagedKafkaAccessConfigurationCredentials;
  ServerRootCaCertificate?: string;
  Vpc?: SelfManagedKafkaAccessConfigurationVpc;
}
export const UpdatePipeSourceSelfManagedKafkaParameters = S.suspend(() =>
  S.Struct({
    BatchSize: S.optional(S.Number),
    MaximumBatchingWindowInSeconds: S.optional(S.Number),
    Credentials: S.optional(SelfManagedKafkaAccessConfigurationCredentials),
    ServerRootCaCertificate: S.optional(S.String),
    Vpc: S.optional(SelfManagedKafkaAccessConfigurationVpc),
  }),
).annotations({
  identifier: "UpdatePipeSourceSelfManagedKafkaParameters",
}) as any as S.Schema<UpdatePipeSourceSelfManagedKafkaParameters>;
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface PipeLogConfigurationParameters {
  S3LogDestination?: S3LogDestinationParameters;
  FirehoseLogDestination?: FirehoseLogDestinationParameters;
  CloudwatchLogsLogDestination?: CloudwatchLogsLogDestinationParameters;
  Level: string;
  IncludeExecutionData?: string[];
}
export const PipeLogConfigurationParameters = S.suspend(() =>
  S.Struct({
    S3LogDestination: S.optional(S3LogDestinationParameters),
    FirehoseLogDestination: S.optional(FirehoseLogDestinationParameters),
    CloudwatchLogsLogDestination: S.optional(
      CloudwatchLogsLogDestinationParameters,
    ),
    Level: S.String,
    IncludeExecutionData: S.optional(IncludeExecutionData),
  }),
).annotations({
  identifier: "PipeLogConfigurationParameters",
}) as any as S.Schema<PipeLogConfigurationParameters>;
export interface Filter {
  Pattern?: string | redacted.Redacted<string>;
}
export const Filter = S.suspend(() =>
  S.Struct({ Pattern: S.optional(SensitiveString) }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type FilterList = Filter[];
export const FilterList = S.Array(Filter);
export interface FilterCriteria {
  Filters?: Filter[];
}
export const FilterCriteria = S.suspend(() =>
  S.Struct({ Filters: S.optional(FilterList) }),
).annotations({
  identifier: "FilterCriteria",
}) as any as S.Schema<FilterCriteria>;
export interface UpdatePipeSourceParameters {
  FilterCriteria?: FilterCriteria;
  KinesisStreamParameters?: UpdatePipeSourceKinesisStreamParameters;
  DynamoDBStreamParameters?: UpdatePipeSourceDynamoDBStreamParameters;
  SqsQueueParameters?: UpdatePipeSourceSqsQueueParameters;
  ActiveMQBrokerParameters?: UpdatePipeSourceActiveMQBrokerParameters;
  RabbitMQBrokerParameters?: UpdatePipeSourceRabbitMQBrokerParameters;
  ManagedStreamingKafkaParameters?: UpdatePipeSourceManagedStreamingKafkaParameters;
  SelfManagedKafkaParameters?: UpdatePipeSourceSelfManagedKafkaParameters;
}
export const UpdatePipeSourceParameters = S.suspend(() =>
  S.Struct({
    FilterCriteria: S.optional(FilterCriteria),
    KinesisStreamParameters: S.optional(
      UpdatePipeSourceKinesisStreamParameters,
    ),
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
  }),
).annotations({
  identifier: "UpdatePipeSourceParameters",
}) as any as S.Schema<UpdatePipeSourceParameters>;
export interface Pipe {
  Name?: string;
  Arn?: string;
  DesiredState?: string;
  CurrentState?: string;
  StateReason?: string;
  CreationTime?: Date;
  LastModifiedTime?: Date;
  Source?: string;
  Target?: string;
  Enrichment?: string;
}
export const Pipe = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    DesiredState: S.optional(S.String),
    CurrentState: S.optional(S.String),
    StateReason: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Source: S.optional(S.String),
    Target: S.optional(S.String),
    Enrichment: S.optional(S.String),
  }),
).annotations({ identifier: "Pipe" }) as any as S.Schema<Pipe>;
export type PipeList = Pipe[];
export const PipeList = S.Array(Pipe);
export interface CapacityProviderStrategyItem {
  capacityProvider: string | redacted.Redacted<string>;
  weight?: number;
  base?: number;
}
export const CapacityProviderStrategyItem = S.suspend(() =>
  S.Struct({
    capacityProvider: SensitiveString,
    weight: S.optional(S.Number),
    base: S.optional(S.Number),
  }),
).annotations({
  identifier: "CapacityProviderStrategyItem",
}) as any as S.Schema<CapacityProviderStrategyItem>;
export type CapacityProviderStrategy = CapacityProviderStrategyItem[];
export const CapacityProviderStrategy = S.Array(CapacityProviderStrategyItem);
export interface PlacementConstraint {
  type?: string;
  expression?: string | redacted.Redacted<string>;
}
export const PlacementConstraint = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    expression: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "PlacementConstraint",
}) as any as S.Schema<PlacementConstraint>;
export type PlacementConstraints = PlacementConstraint[];
export const PlacementConstraints = S.Array(PlacementConstraint);
export interface PlacementStrategy {
  type?: string;
  field?: string | redacted.Redacted<string>;
}
export const PlacementStrategy = S.suspend(() =>
  S.Struct({ type: S.optional(S.String), field: S.optional(SensitiveString) }),
).annotations({
  identifier: "PlacementStrategy",
}) as any as S.Schema<PlacementStrategy>;
export type PlacementStrategies = PlacementStrategy[];
export const PlacementStrategies = S.Array(PlacementStrategy);
export interface Tag {
  Key: string;
  Value: string | redacted.Redacted<string>;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: SensitiveString }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface BatchArrayProperties {
  Size?: number;
}
export const BatchArrayProperties = S.suspend(() =>
  S.Struct({ Size: S.optional(S.Number) }),
).annotations({
  identifier: "BatchArrayProperties",
}) as any as S.Schema<BatchArrayProperties>;
export interface BatchRetryStrategy {
  Attempts?: number;
}
export const BatchRetryStrategy = S.suspend(() =>
  S.Struct({ Attempts: S.optional(S.Number) }),
).annotations({
  identifier: "BatchRetryStrategy",
}) as any as S.Schema<BatchRetryStrategy>;
export interface BatchJobDependency {
  JobId?: string;
  Type?: string;
}
export const BatchJobDependency = S.suspend(() =>
  S.Struct({ JobId: S.optional(S.String), Type: S.optional(S.String) }),
).annotations({
  identifier: "BatchJobDependency",
}) as any as S.Schema<BatchJobDependency>;
export type BatchDependsOn = BatchJobDependency[];
export const BatchDependsOn = S.Array(BatchJobDependency);
export type BatchParametersMap = { [key: string]: string | undefined };
export const BatchParametersMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface SageMakerPipelineParameter {
  Name: string | redacted.Redacted<string>;
  Value: string | redacted.Redacted<string>;
}
export const SageMakerPipelineParameter = S.suspend(() =>
  S.Struct({ Name: SensitiveString, Value: SensitiveString }),
).annotations({
  identifier: "SageMakerPipelineParameter",
}) as any as S.Schema<SageMakerPipelineParameter>;
export type SageMakerPipelineParameterList = SageMakerPipelineParameter[];
export const SageMakerPipelineParameterList = S.Array(
  SageMakerPipelineParameter,
);
export interface DimensionMapping {
  DimensionValue: string;
  DimensionValueType: string;
  DimensionName: string;
}
export const DimensionMapping = S.suspend(() =>
  S.Struct({
    DimensionValue: S.String,
    DimensionValueType: S.String,
    DimensionName: S.String,
  }),
).annotations({
  identifier: "DimensionMapping",
}) as any as S.Schema<DimensionMapping>;
export type DimensionMappings = DimensionMapping[];
export const DimensionMappings = S.Array(DimensionMapping);
export interface SingleMeasureMapping {
  MeasureValue: string;
  MeasureValueType: string;
  MeasureName: string;
}
export const SingleMeasureMapping = S.suspend(() =>
  S.Struct({
    MeasureValue: S.String,
    MeasureValueType: S.String,
    MeasureName: S.String,
  }),
).annotations({
  identifier: "SingleMeasureMapping",
}) as any as S.Schema<SingleMeasureMapping>;
export type SingleMeasureMappings = SingleMeasureMapping[];
export const SingleMeasureMappings = S.Array(SingleMeasureMapping);
export type Subnets = string | redacted.Redacted<string>[];
export const Subnets = S.Array(SensitiveString);
export type SecurityGroups = string | redacted.Redacted<string>[];
export const SecurityGroups = S.Array(SensitiveString);
export interface PipeEnrichmentHttpParameters {
  PathParameterValues?: string | redacted.Redacted<string>[];
  HeaderParameters?: {
    [key: string]: string | redacted.Redacted<string> | undefined;
  };
  QueryStringParameters?: {
    [key: string]: string | redacted.Redacted<string> | undefined;
  };
}
export const PipeEnrichmentHttpParameters = S.suspend(() =>
  S.Struct({
    PathParameterValues: S.optional(PathParameterList),
    HeaderParameters: S.optional(HeaderParametersMap),
    QueryStringParameters: S.optional(QueryStringParametersMap),
  }),
).annotations({
  identifier: "PipeEnrichmentHttpParameters",
}) as any as S.Schema<PipeEnrichmentHttpParameters>;
export interface PipeEnrichmentParameters {
  InputTemplate?: string | redacted.Redacted<string>;
  HttpParameters?: PipeEnrichmentHttpParameters;
}
export const PipeEnrichmentParameters = S.suspend(() =>
  S.Struct({
    InputTemplate: S.optional(SensitiveString),
    HttpParameters: S.optional(PipeEnrichmentHttpParameters),
  }),
).annotations({
  identifier: "PipeEnrichmentParameters",
}) as any as S.Schema<PipeEnrichmentParameters>;
export interface AwsVpcConfiguration {
  Subnets: string | redacted.Redacted<string>[];
  SecurityGroups?: string | redacted.Redacted<string>[];
  AssignPublicIp?: string;
}
export const AwsVpcConfiguration = S.suspend(() =>
  S.Struct({
    Subnets: Subnets,
    SecurityGroups: S.optional(SecurityGroups),
    AssignPublicIp: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsVpcConfiguration",
}) as any as S.Schema<AwsVpcConfiguration>;
export interface NetworkConfiguration {
  awsvpcConfiguration?: AwsVpcConfiguration;
}
export const NetworkConfiguration = S.suspend(() =>
  S.Struct({ awsvpcConfiguration: S.optional(AwsVpcConfiguration) }),
).annotations({
  identifier: "NetworkConfiguration",
}) as any as S.Schema<NetworkConfiguration>;
export interface EcsEnvironmentVariable {
  name?: string;
  value?: string;
}
export const EcsEnvironmentVariable = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), value: S.optional(S.String) }),
).annotations({
  identifier: "EcsEnvironmentVariable",
}) as any as S.Schema<EcsEnvironmentVariable>;
export type EcsEnvironmentVariableList = EcsEnvironmentVariable[];
export const EcsEnvironmentVariableList = S.Array(EcsEnvironmentVariable);
export interface EcsEnvironmentFile {
  type: string;
  value: string;
}
export const EcsEnvironmentFile = S.suspend(() =>
  S.Struct({ type: S.String, value: S.String }),
).annotations({
  identifier: "EcsEnvironmentFile",
}) as any as S.Schema<EcsEnvironmentFile>;
export type EcsEnvironmentFileList = EcsEnvironmentFile[];
export const EcsEnvironmentFileList = S.Array(EcsEnvironmentFile);
export interface EcsResourceRequirement {
  type: string;
  value: string;
}
export const EcsResourceRequirement = S.suspend(() =>
  S.Struct({ type: S.String, value: S.String }),
).annotations({
  identifier: "EcsResourceRequirement",
}) as any as S.Schema<EcsResourceRequirement>;
export type EcsResourceRequirementsList = EcsResourceRequirement[];
export const EcsResourceRequirementsList = S.Array(EcsResourceRequirement);
export interface EcsContainerOverride {
  Command?: string[];
  Cpu?: number;
  Environment?: EcsEnvironmentVariable[];
  EnvironmentFiles?: EcsEnvironmentFile[];
  Memory?: number;
  MemoryReservation?: number;
  Name?: string;
  ResourceRequirements?: EcsResourceRequirement[];
}
export const EcsContainerOverride = S.suspend(() =>
  S.Struct({
    Command: S.optional(StringList),
    Cpu: S.optional(S.Number),
    Environment: S.optional(EcsEnvironmentVariableList),
    EnvironmentFiles: S.optional(EcsEnvironmentFileList),
    Memory: S.optional(S.Number),
    MemoryReservation: S.optional(S.Number),
    Name: S.optional(S.String),
    ResourceRequirements: S.optional(EcsResourceRequirementsList),
  }),
).annotations({
  identifier: "EcsContainerOverride",
}) as any as S.Schema<EcsContainerOverride>;
export type EcsContainerOverrideList = EcsContainerOverride[];
export const EcsContainerOverrideList = S.Array(EcsContainerOverride);
export interface EcsEphemeralStorage {
  sizeInGiB: number;
}
export const EcsEphemeralStorage = S.suspend(() =>
  S.Struct({ sizeInGiB: S.Number }),
).annotations({
  identifier: "EcsEphemeralStorage",
}) as any as S.Schema<EcsEphemeralStorage>;
export interface EcsInferenceAcceleratorOverride {
  deviceName?: string;
  deviceType?: string;
}
export const EcsInferenceAcceleratorOverride = S.suspend(() =>
  S.Struct({
    deviceName: S.optional(S.String),
    deviceType: S.optional(S.String),
  }),
).annotations({
  identifier: "EcsInferenceAcceleratorOverride",
}) as any as S.Schema<EcsInferenceAcceleratorOverride>;
export type EcsInferenceAcceleratorOverrideList =
  EcsInferenceAcceleratorOverride[];
export const EcsInferenceAcceleratorOverrideList = S.Array(
  EcsInferenceAcceleratorOverride,
);
export interface EcsTaskOverride {
  ContainerOverrides?: EcsContainerOverride[];
  Cpu?: string;
  EphemeralStorage?: EcsEphemeralStorage;
  ExecutionRoleArn?: string;
  InferenceAcceleratorOverrides?: EcsInferenceAcceleratorOverride[];
  Memory?: string;
  TaskRoleArn?: string;
}
export const EcsTaskOverride = S.suspend(() =>
  S.Struct({
    ContainerOverrides: S.optional(EcsContainerOverrideList),
    Cpu: S.optional(S.String),
    EphemeralStorage: S.optional(EcsEphemeralStorage),
    ExecutionRoleArn: S.optional(S.String),
    InferenceAcceleratorOverrides: S.optional(
      EcsInferenceAcceleratorOverrideList,
    ),
    Memory: S.optional(S.String),
    TaskRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "EcsTaskOverride",
}) as any as S.Schema<EcsTaskOverride>;
export interface PipeTargetEcsTaskParameters {
  TaskDefinitionArn: string;
  TaskCount?: number;
  LaunchType?: string;
  NetworkConfiguration?: NetworkConfiguration;
  PlatformVersion?: string;
  Group?: string;
  CapacityProviderStrategy?: CapacityProviderStrategyItem[];
  EnableECSManagedTags?: boolean;
  EnableExecuteCommand?: boolean;
  PlacementConstraints?: PlacementConstraint[];
  PlacementStrategy?: PlacementStrategy[];
  PropagateTags?: string;
  ReferenceId?: string | redacted.Redacted<string>;
  Overrides?: EcsTaskOverride;
  Tags?: Tag[];
}
export const PipeTargetEcsTaskParameters = S.suspend(() =>
  S.Struct({
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
    ReferenceId: S.optional(SensitiveString),
    Overrides: S.optional(EcsTaskOverride),
    Tags: S.optional(TagList),
  }),
).annotations({
  identifier: "PipeTargetEcsTaskParameters",
}) as any as S.Schema<PipeTargetEcsTaskParameters>;
export interface BatchEnvironmentVariable {
  Name?: string;
  Value?: string;
}
export const BatchEnvironmentVariable = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "BatchEnvironmentVariable",
}) as any as S.Schema<BatchEnvironmentVariable>;
export type BatchEnvironmentVariableList = BatchEnvironmentVariable[];
export const BatchEnvironmentVariableList = S.Array(BatchEnvironmentVariable);
export interface BatchResourceRequirement {
  Type: string;
  Value: string;
}
export const BatchResourceRequirement = S.suspend(() =>
  S.Struct({ Type: S.String, Value: S.String }),
).annotations({
  identifier: "BatchResourceRequirement",
}) as any as S.Schema<BatchResourceRequirement>;
export type BatchResourceRequirementsList = BatchResourceRequirement[];
export const BatchResourceRequirementsList = S.Array(BatchResourceRequirement);
export interface BatchContainerOverrides {
  Command?: string[];
  Environment?: BatchEnvironmentVariable[];
  InstanceType?: string;
  ResourceRequirements?: BatchResourceRequirement[];
}
export const BatchContainerOverrides = S.suspend(() =>
  S.Struct({
    Command: S.optional(StringList),
    Environment: S.optional(BatchEnvironmentVariableList),
    InstanceType: S.optional(S.String),
    ResourceRequirements: S.optional(BatchResourceRequirementsList),
  }),
).annotations({
  identifier: "BatchContainerOverrides",
}) as any as S.Schema<BatchContainerOverrides>;
export interface PipeTargetBatchJobParameters {
  JobDefinition: string;
  JobName: string;
  ArrayProperties?: BatchArrayProperties;
  RetryStrategy?: BatchRetryStrategy;
  ContainerOverrides?: BatchContainerOverrides;
  DependsOn?: BatchJobDependency[];
  Parameters?: { [key: string]: string | undefined };
}
export const PipeTargetBatchJobParameters = S.suspend(() =>
  S.Struct({
    JobDefinition: S.String,
    JobName: S.String,
    ArrayProperties: S.optional(BatchArrayProperties),
    RetryStrategy: S.optional(BatchRetryStrategy),
    ContainerOverrides: S.optional(BatchContainerOverrides),
    DependsOn: S.optional(BatchDependsOn),
    Parameters: S.optional(BatchParametersMap),
  }),
).annotations({
  identifier: "PipeTargetBatchJobParameters",
}) as any as S.Schema<PipeTargetBatchJobParameters>;
export interface PipeTargetSageMakerPipelineParameters {
  PipelineParameterList?: SageMakerPipelineParameter[];
}
export const PipeTargetSageMakerPipelineParameters = S.suspend(() =>
  S.Struct({
    PipelineParameterList: S.optional(SageMakerPipelineParameterList),
  }),
).annotations({
  identifier: "PipeTargetSageMakerPipelineParameters",
}) as any as S.Schema<PipeTargetSageMakerPipelineParameters>;
export interface MultiMeasureAttributeMapping {
  MeasureValue: string;
  MeasureValueType: string;
  MultiMeasureAttributeName: string;
}
export const MultiMeasureAttributeMapping = S.suspend(() =>
  S.Struct({
    MeasureValue: S.String,
    MeasureValueType: S.String,
    MultiMeasureAttributeName: S.String,
  }),
).annotations({
  identifier: "MultiMeasureAttributeMapping",
}) as any as S.Schema<MultiMeasureAttributeMapping>;
export type MultiMeasureAttributeMappings = MultiMeasureAttributeMapping[];
export const MultiMeasureAttributeMappings = S.Array(
  MultiMeasureAttributeMapping,
);
export interface MultiMeasureMapping {
  MultiMeasureName: string;
  MultiMeasureAttributeMappings: MultiMeasureAttributeMapping[];
}
export const MultiMeasureMapping = S.suspend(() =>
  S.Struct({
    MultiMeasureName: S.String,
    MultiMeasureAttributeMappings: MultiMeasureAttributeMappings,
  }),
).annotations({
  identifier: "MultiMeasureMapping",
}) as any as S.Schema<MultiMeasureMapping>;
export type MultiMeasureMappings = MultiMeasureMapping[];
export const MultiMeasureMappings = S.Array(MultiMeasureMapping);
export interface PipeTargetTimestreamParameters {
  TimeValue: string;
  EpochTimeUnit?: string;
  TimeFieldType?: string;
  TimestampFormat?: string;
  VersionValue: string;
  DimensionMappings: DimensionMapping[];
  SingleMeasureMappings?: SingleMeasureMapping[];
  MultiMeasureMappings?: MultiMeasureMapping[];
}
export const PipeTargetTimestreamParameters = S.suspend(() =>
  S.Struct({
    TimeValue: S.String,
    EpochTimeUnit: S.optional(S.String),
    TimeFieldType: S.optional(S.String),
    TimestampFormat: S.optional(S.String),
    VersionValue: S.String,
    DimensionMappings: DimensionMappings,
    SingleMeasureMappings: S.optional(SingleMeasureMappings),
    MultiMeasureMappings: S.optional(MultiMeasureMappings),
  }),
).annotations({
  identifier: "PipeTargetTimestreamParameters",
}) as any as S.Schema<PipeTargetTimestreamParameters>;
export interface PipeTargetParameters {
  InputTemplate?: string | redacted.Redacted<string>;
  LambdaFunctionParameters?: PipeTargetLambdaFunctionParameters;
  StepFunctionStateMachineParameters?: PipeTargetStateMachineParameters;
  KinesisStreamParameters?: PipeTargetKinesisStreamParameters;
  EcsTaskParameters?: PipeTargetEcsTaskParameters;
  BatchJobParameters?: PipeTargetBatchJobParameters;
  SqsQueueParameters?: PipeTargetSqsQueueParameters;
  HttpParameters?: PipeTargetHttpParameters;
  RedshiftDataParameters?: PipeTargetRedshiftDataParameters;
  SageMakerPipelineParameters?: PipeTargetSageMakerPipelineParameters;
  EventBridgeEventBusParameters?: PipeTargetEventBridgeEventBusParameters;
  CloudWatchLogsParameters?: PipeTargetCloudWatchLogsParameters;
  TimestreamParameters?: PipeTargetTimestreamParameters;
}
export const PipeTargetParameters = S.suspend(() =>
  S.Struct({
    InputTemplate: S.optional(SensitiveString),
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
  }),
).annotations({
  identifier: "PipeTargetParameters",
}) as any as S.Schema<PipeTargetParameters>;
export interface UpdatePipeRequest {
  Name: string;
  Description?: string | redacted.Redacted<string>;
  DesiredState?: string;
  SourceParameters?: UpdatePipeSourceParameters;
  Enrichment?: string;
  EnrichmentParameters?: PipeEnrichmentParameters;
  Target?: string;
  TargetParameters?: PipeTargetParameters;
  RoleArn: string;
  LogConfiguration?: PipeLogConfigurationParameters;
  KmsKeyIdentifier?: string;
}
export const UpdatePipeRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    Description: S.optional(SensitiveString),
    DesiredState: S.optional(S.String),
    SourceParameters: S.optional(UpdatePipeSourceParameters),
    Enrichment: S.optional(S.String),
    EnrichmentParameters: S.optional(PipeEnrichmentParameters),
    Target: S.optional(S.String),
    TargetParameters: S.optional(PipeTargetParameters),
    RoleArn: S.String,
    LogConfiguration: S.optional(PipeLogConfigurationParameters),
    KmsKeyIdentifier: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/v1/pipes/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePipeRequest",
}) as any as S.Schema<UpdatePipeRequest>;
export interface ListPipesResponse {
  Pipes?: Pipe[];
  NextToken?: string | redacted.Redacted<string>;
}
export const ListPipesResponse = S.suspend(() =>
  S.Struct({
    Pipes: S.optional(PipeList),
    NextToken: S.optional(SensitiveString),
  }).pipe(ns),
).annotations({
  identifier: "ListPipesResponse",
}) as any as S.Schema<ListPipesResponse>;
export interface PipeSourceKinesisStreamParameters {
  BatchSize?: number;
  DeadLetterConfig?: DeadLetterConfig;
  OnPartialBatchItemFailure?: string;
  MaximumBatchingWindowInSeconds?: number;
  MaximumRecordAgeInSeconds?: number;
  MaximumRetryAttempts?: number;
  ParallelizationFactor?: number;
  StartingPosition: string;
  StartingPositionTimestamp?: Date;
}
export const PipeSourceKinesisStreamParameters = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "PipeSourceKinesisStreamParameters",
}) as any as S.Schema<PipeSourceKinesisStreamParameters>;
export interface PipeSourceActiveMQBrokerParameters {
  Credentials: MQBrokerAccessCredentials;
  QueueName: string | redacted.Redacted<string>;
  BatchSize?: number;
  MaximumBatchingWindowInSeconds?: number;
}
export const PipeSourceActiveMQBrokerParameters = S.suspend(() =>
  S.Struct({
    Credentials: MQBrokerAccessCredentials,
    QueueName: SensitiveString,
    BatchSize: S.optional(S.Number),
    MaximumBatchingWindowInSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "PipeSourceActiveMQBrokerParameters",
}) as any as S.Schema<PipeSourceActiveMQBrokerParameters>;
export interface PipeSourceManagedStreamingKafkaParameters {
  TopicName: string | redacted.Redacted<string>;
  StartingPosition?: string;
  BatchSize?: number;
  MaximumBatchingWindowInSeconds?: number;
  ConsumerGroupID?: string | redacted.Redacted<string>;
  Credentials?: MSKAccessCredentials;
}
export const PipeSourceManagedStreamingKafkaParameters = S.suspend(() =>
  S.Struct({
    TopicName: SensitiveString,
    StartingPosition: S.optional(S.String),
    BatchSize: S.optional(S.Number),
    MaximumBatchingWindowInSeconds: S.optional(S.Number),
    ConsumerGroupID: S.optional(SensitiveString),
    Credentials: S.optional(MSKAccessCredentials),
  }),
).annotations({
  identifier: "PipeSourceManagedStreamingKafkaParameters",
}) as any as S.Schema<PipeSourceManagedStreamingKafkaParameters>;
export interface PipeSourceSelfManagedKafkaParameters {
  TopicName: string | redacted.Redacted<string>;
  StartingPosition?: string;
  AdditionalBootstrapServers?: string | redacted.Redacted<string>[];
  BatchSize?: number;
  MaximumBatchingWindowInSeconds?: number;
  ConsumerGroupID?: string | redacted.Redacted<string>;
  Credentials?: SelfManagedKafkaAccessConfigurationCredentials;
  ServerRootCaCertificate?: string;
  Vpc?: SelfManagedKafkaAccessConfigurationVpc;
}
export const PipeSourceSelfManagedKafkaParameters = S.suspend(() =>
  S.Struct({
    TopicName: SensitiveString,
    StartingPosition: S.optional(S.String),
    AdditionalBootstrapServers: S.optional(KafkaBootstrapServers),
    BatchSize: S.optional(S.Number),
    MaximumBatchingWindowInSeconds: S.optional(S.Number),
    ConsumerGroupID: S.optional(SensitiveString),
    Credentials: S.optional(SelfManagedKafkaAccessConfigurationCredentials),
    ServerRootCaCertificate: S.optional(S.String),
    Vpc: S.optional(SelfManagedKafkaAccessConfigurationVpc),
  }),
).annotations({
  identifier: "PipeSourceSelfManagedKafkaParameters",
}) as any as S.Schema<PipeSourceSelfManagedKafkaParameters>;
export interface S3LogDestination {
  BucketName?: string;
  Prefix?: string;
  BucketOwner?: string;
  OutputFormat?: string;
}
export const S3LogDestination = S.suspend(() =>
  S.Struct({
    BucketName: S.optional(S.String),
    Prefix: S.optional(S.String),
    BucketOwner: S.optional(S.String),
    OutputFormat: S.optional(S.String),
  }),
).annotations({
  identifier: "S3LogDestination",
}) as any as S.Schema<S3LogDestination>;
export interface FirehoseLogDestination {
  DeliveryStreamArn?: string;
}
export const FirehoseLogDestination = S.suspend(() =>
  S.Struct({ DeliveryStreamArn: S.optional(S.String) }),
).annotations({
  identifier: "FirehoseLogDestination",
}) as any as S.Schema<FirehoseLogDestination>;
export interface CloudwatchLogsLogDestination {
  LogGroupArn?: string;
}
export const CloudwatchLogsLogDestination = S.suspend(() =>
  S.Struct({ LogGroupArn: S.optional(S.String) }),
).annotations({
  identifier: "CloudwatchLogsLogDestination",
}) as any as S.Schema<CloudwatchLogsLogDestination>;
export interface PipeSourceParameters {
  FilterCriteria?: FilterCriteria;
  KinesisStreamParameters?: PipeSourceKinesisStreamParameters;
  DynamoDBStreamParameters?: PipeSourceDynamoDBStreamParameters;
  SqsQueueParameters?: PipeSourceSqsQueueParameters;
  ActiveMQBrokerParameters?: PipeSourceActiveMQBrokerParameters;
  RabbitMQBrokerParameters?: PipeSourceRabbitMQBrokerParameters;
  ManagedStreamingKafkaParameters?: PipeSourceManagedStreamingKafkaParameters;
  SelfManagedKafkaParameters?: PipeSourceSelfManagedKafkaParameters;
}
export const PipeSourceParameters = S.suspend(() =>
  S.Struct({
    FilterCriteria: S.optional(FilterCriteria),
    KinesisStreamParameters: S.optional(PipeSourceKinesisStreamParameters),
    DynamoDBStreamParameters: S.optional(PipeSourceDynamoDBStreamParameters),
    SqsQueueParameters: S.optional(PipeSourceSqsQueueParameters),
    ActiveMQBrokerParameters: S.optional(PipeSourceActiveMQBrokerParameters),
    RabbitMQBrokerParameters: S.optional(PipeSourceRabbitMQBrokerParameters),
    ManagedStreamingKafkaParameters: S.optional(
      PipeSourceManagedStreamingKafkaParameters,
    ),
    SelfManagedKafkaParameters: S.optional(
      PipeSourceSelfManagedKafkaParameters,
    ),
  }),
).annotations({
  identifier: "PipeSourceParameters",
}) as any as S.Schema<PipeSourceParameters>;
export interface PipeLogConfiguration {
  S3LogDestination?: S3LogDestination;
  FirehoseLogDestination?: FirehoseLogDestination;
  CloudwatchLogsLogDestination?: CloudwatchLogsLogDestination;
  Level?: string;
  IncludeExecutionData?: string[];
}
export const PipeLogConfiguration = S.suspend(() =>
  S.Struct({
    S3LogDestination: S.optional(S3LogDestination),
    FirehoseLogDestination: S.optional(FirehoseLogDestination),
    CloudwatchLogsLogDestination: S.optional(CloudwatchLogsLogDestination),
    Level: S.optional(S.String),
    IncludeExecutionData: S.optional(IncludeExecutionData),
  }),
).annotations({
  identifier: "PipeLogConfiguration",
}) as any as S.Schema<PipeLogConfiguration>;
export interface DescribePipeResponse {
  Arn?: string;
  Name?: string;
  Description?: string | redacted.Redacted<string>;
  DesiredState?: string;
  CurrentState?: string;
  StateReason?: string;
  Source?: string;
  SourceParameters?: PipeSourceParameters;
  Enrichment?: string;
  EnrichmentParameters?: PipeEnrichmentParameters;
  Target?: string;
  TargetParameters?: PipeTargetParameters;
  RoleArn?: string;
  Tags?: { [key: string]: string | redacted.Redacted<string> | undefined };
  CreationTime?: Date;
  LastModifiedTime?: Date;
  LogConfiguration?: PipeLogConfiguration;
  KmsKeyIdentifier?: string;
}
export const DescribePipeResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(SensitiveString),
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
  }).pipe(ns),
).annotations({
  identifier: "DescribePipeResponse",
}) as any as S.Schema<DescribePipeResponse>;
export interface UpdatePipeResponse {
  Arn?: string;
  Name?: string;
  DesiredState?: string;
  CurrentState?: string;
  CreationTime?: Date;
  LastModifiedTime?: Date;
}
export const UpdatePipeResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    DesiredState: S.optional(S.String),
    CurrentState: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }).pipe(ns),
).annotations({
  identifier: "UpdatePipeResponse",
}) as any as S.Schema<UpdatePipeResponse>;
export interface ValidationExceptionField {
  name: string;
  message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export interface CreatePipeRequest {
  Name: string;
  Description?: string | redacted.Redacted<string>;
  DesiredState?: string;
  Source: string;
  SourceParameters?: PipeSourceParameters;
  Enrichment?: string;
  EnrichmentParameters?: PipeEnrichmentParameters;
  Target: string;
  TargetParameters?: PipeTargetParameters;
  RoleArn: string;
  Tags?: { [key: string]: string | redacted.Redacted<string> | undefined };
  LogConfiguration?: PipeLogConfigurationParameters;
  KmsKeyIdentifier?: string;
}
export const CreatePipeRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    Description: S.optional(SensitiveString),
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
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/pipes/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePipeRequest",
}) as any as S.Schema<CreatePipeRequest>;
export interface CreatePipeResponse {
  Arn?: string;
  Name?: string;
  DesiredState?: string;
  CurrentState?: string;
  CreationTime?: Date;
  LastModifiedTime?: Date;
}
export const CreatePipeResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    DesiredState: S.optional(S.String),
    CurrentState: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }).pipe(ns),
).annotations({
  identifier: "CreatePipeResponse",
}) as any as S.Schema<CreatePipeResponse>;

//# Errors
export class InternalException extends S.TaggedError<InternalException>()(
  "InternalException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withServerError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withConflictError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.optional(S.String),
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
  },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Removes one or more tags from the specified pipes.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  InternalException | NotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [InternalException, NotFoundException, ValidationException],
}));
/**
 * Displays the tags associated with a pipe.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  InternalException | NotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  InternalException | NotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [InternalException, NotFoundException, ValidationException],
}));
/**
 * Delete an existing pipe. For more information about pipes, see Amazon EventBridge Pipes in the Amazon EventBridge User Guide.
 */
export const deletePipe: (
  input: DeletePipeRequest,
) => effect.Effect<
  DeletePipeResponse,
  | ConflictException
  | InternalException
  | NotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listPipes: {
  (
    input: ListPipesRequest,
  ): effect.Effect<
    ListPipesResponse,
    | InternalException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPipesRequest,
  ) => stream.Stream<
    ListPipesResponse,
    | InternalException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPipesRequest,
  ) => stream.Stream<
    Pipe,
    | InternalException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const startPipe: (
  input: StartPipeRequest,
) => effect.Effect<
  StartPipeResponse,
  | ConflictException
  | InternalException
  | NotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopPipe: (
  input: StopPipeRequest,
) => effect.Effect<
  StopPipeResponse,
  | ConflictException
  | InternalException
  | NotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describePipe: (
  input: DescribePipeRequest,
) => effect.Effect<
  DescribePipeResponse,
  | InternalException
  | NotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePipe: (
  input: UpdatePipeRequest,
) => effect.Effect<
  UpdatePipeResponse,
  | ConflictException
  | InternalException
  | NotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createPipe: (
  input: CreatePipeRequest,
) => effect.Effect<
  CreatePipeResponse,
  | ConflictException
  | InternalException
  | NotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
