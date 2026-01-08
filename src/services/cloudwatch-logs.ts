import { HttpClient } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const ns = T.XmlNamespace("http://monitoring.amazonaws.com/doc/2014-03-28/");
const svc = T.AwsApiService({
  sdkId: "CloudWatch Logs",
  serviceShapeName: "Logs_20140328",
});
const auth = T.AwsAuthSigv4({ name: "logs" });
const ver = T.ServiceVersion("2014-03-28");
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
              `https://logs-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (Region === "us-gov-east-1") {
              return e("https://logs.us-gov-east-1.amazonaws.com");
            }
            if (Region === "us-gov-west-1") {
              return e("https://logs.us-gov-west-1.amazonaws.com");
            }
            return e(
              `https://logs-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://logs.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://logs.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type LogGroupName = string;
export type KmsKeyId = string;
export type ResourceIdentifier = string;
export type Arn = string;
export type ExportTaskId = string;
export type ImportId = string;
export type DeliverySourceName = string;
export type FieldHeader = string;
export type FieldDelimiter = string;
export type ExportTaskName = string;
export type LogStreamName = string;
export type Timestamp = number;
export type ExportDestinationBucket = string;
export type ExportDestinationPrefix = string;
export type RoleArn = string;
export type LogGroupArn = string;
export type DetectorName = string;
export type FilterPattern = string;
export type DetectorKmsKeyArn = string;
export type AnomalyVisibilityTime = number;
export type ScheduledQueryName = string;
export type ScheduledQueryDescription = string;
export type QueryString = string;
export type LogGroupIdentifier = string;
export type ScheduleExpression = string;
export type ScheduleTimezone = string;
export type StartTimeOffset = number;
export type PolicyName = string;
export type DeliveryId = string;
export type DeliveryDestinationName = string;
export type DestinationName = string;
export type IntegrationName = string;
export type AnomalyDetectorArn = string;
export type FilterName = string;
export type QueryId = string;
export type ExpectedRevisionId = string;
export type ScheduledQueryIdentifier = string;
export type AccountId = string;
export type NextToken = string;
export type Service = string;
export type LogType = string;
export type ResourceType = string;
export type DescribeLimit = number;
export type LogGroupNamePattern = string;
export type MetricName = string;
export type MetricNamespace = string;
export type DescribeQueriesMaxResults = number;
export type QueryDefinitionName = string;
export type QueryListMaxResults = number;
export type S3TableIntegrationSourceIdentifier = string;
export type EventsLimit = number;
export type DataSourceName = string;
export type DataSourceType = string;
export type LogObjectPointer = string;
export type LogRecordPointer = string;
export type GetScheduledQueryHistoryMaxResults = number;
export type LogGroupNameRegexPattern = string;
export type ListLogGroupsRequestLimit = number;
export type ListAnomaliesLimit = number;
export type IntegrationNamePrefix = string;
export type ListLogAnomalyDetectorsLimit = number;
export type ListLimit = number;
export type FieldIndexName = string;
export type ListLogGroupsForQueryMaxResults = number;
export type ListScheduledQueriesMaxResults = number;
export type ListSourcesForS3TableIntegrationMaxResults = number;
export type AmazonResourceName = string;
export type AccountPolicyDocument = string;
export type SelectionCriteria = string;
export type DataProtectionPolicyDocument = string;
export type DeliveryDestinationPolicy = string;
export type TargetArn = string;
export type AccessPolicy = string;
export type PolicyDocument = string;
export type SequenceToken = string;
export type FieldSelectionCriteria = string;
export type SystemField = string;
export type QueryDefinitionString = string;
export type ClientToken = string;
export type Days = number;
export type DestinationArn = string;
export type EventMessage = string;
export type TagKey = string;
export type AnomalyId = string;
export type PatternId = string;
export type DeliverySuffixPath = string;
export type TagValue = string;
export type MetricValue = string;
export type DefaultValue = number;
export type Integer = number;
export type Message = string;
export type EpochMillis = number;
export type EncryptionKey = string;
export type S3Uri = string;
export type CollectionRetentionDays = number;
export type EntityKeyAttributesKey = string;
export type EntityKeyAttributesValue = string;
export type EntityAttributesKey = string;
export type EntityAttributesValue = string;
export type DimensionsKey = string;
export type DimensionsValue = string;
export type QuoteCharacter = string;
export type Delimiter = string;
export type Column = string;
export type Source = string;
export type Target = string;
export type TargetFormat = string;
export type MatchPattern = string;
export type SourceTimezone = string;
export type TargetTimezone = string;
export type Locale = string;
export type WithKey = string;
export type GrokMatch = string;
export type Key = string;
export type ValueKey = string;
export type DestinationField = string;
export type ParserFieldDelimiter = string;
export type KeyValueDelimiter = string;
export type KeyPrefix = string;
export type NonMatchValue = string;
export type MappingVersion = string;
export type StoredBytes = number;
export type AllowedActionForAllowVendedLogsDeliveryForResource = string;
export type BatchId = string;
export type ErrorMessage = string;
export type FilterCount = number;
export type EventId = string;
export type LogFieldName = string;
export type Field = string;
export type Percentage = number;
export type Value = string;
export type StatsValue = number;
export type PatternString = string;
export type PatternRegex = string;
export type Priority = string;
export type Description = string;
export type S3TableIntegrationSourceStatusReason = string;
export type EventNumber = number;
export type TransformedEventMessage = string;
export type AddKeyValue = string;
export type RenameTo = string;
export type SplitStringDelimiter = string;
export type FromKey = string;
export type ToKey = string;
export type ExportTaskStatusMessage = string;
export type DataType = string;
export type Time = string;
export type Count = number;
export type DynamicTokenPosition = number;
export type TokenString = string;
export type InferredTokenName = string;
export type RequestId = string;
export type SessionId = string;
export type Token = string;
export type LogGroupCount = number;
export type OpenSearchDataSourceName = string;
export type OpenSearchApplicationEndpoint = string;
export type OpenSearchApplicationId = string;
export type OpenSearchCollectionEndpoint = string;
export type OpenSearchWorkspaceId = string;
export type OpenSearchPolicyName = string;
export type TokenValue = number;
export type GroupingIdentifierKey = string;
export type GroupingIdentifierValue = string;
export type IntegrationStatusMessage = string;
export type LogEventIndex = number;
export type QueryCharOffset = number;

//# Schemas
export type RecordFields = string[];
export const RecordFields = S.Array(S.String);
export type LogGroupArnList = string[];
export const LogGroupArnList = S.Array(S.String);
export type ScheduledQueryLogGroupIdentifiers = string[];
export const ScheduledQueryLogGroupIdentifiers = S.Array(S.String);
export type AccountIds = string[];
export const AccountIds = S.Array(S.String);
export type LogTypes = string[];
export const LogTypes = S.Array(S.String);
export type ResourceTypes = string[];
export const ResourceTypes = S.Array(S.String);
export type DeliveryDestinationTypes = string[];
export const DeliveryDestinationTypes = S.Array(S.String);
export type DescribeFieldIndexesLogGroupIdentifiers = string[];
export const DescribeFieldIndexesLogGroupIdentifiers = S.Array(S.String);
export type ImportStatusList = string[];
export const ImportStatusList = S.Array(S.String);
export type DescribeIndexPoliciesLogGroupIdentifiers = string[];
export const DescribeIndexPoliciesLogGroupIdentifiers = S.Array(S.String);
export type DescribeLogGroupsLogGroupIdentifiers = string[];
export const DescribeLogGroupsLogGroupIdentifiers = S.Array(S.String);
export type InputLogStreamNames = string[];
export const InputLogStreamNames = S.Array(S.String);
export type ExecutionStatusList = string[];
export const ExecutionStatusList = S.Array(S.String);
export type FieldIndexNames = string[];
export const FieldIndexNames = S.Array(S.String);
export type EmitSystemFields = string[];
export const EmitSystemFields = S.Array(S.String);
export type LogGroupNames = string[];
export const LogGroupNames = S.Array(S.String);
export type StartLiveTailLogGroupIdentifiers = string[];
export const StartLiveTailLogGroupIdentifiers = S.Array(S.String);
export type LogGroupIdentifiers = string[];
export const LogGroupIdentifiers = S.Array(S.String);
export type TestEventMessages = string[];
export const TestEventMessages = S.Array(S.String);
export type TagList = string[];
export const TagList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AssociateKmsKeyRequest {
  logGroupName?: string;
  kmsKeyId: string;
  resourceIdentifier?: string;
}
export const AssociateKmsKeyRequest = S.suspend(() =>
  S.Struct({
    logGroupName: S.optional(S.String),
    kmsKeyId: S.String,
    resourceIdentifier: S.optional(S.String),
  }).pipe(
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
  identifier: "AssociateKmsKeyRequest",
}) as any as S.Schema<AssociateKmsKeyRequest>;
export interface AssociateKmsKeyResponse {}
export const AssociateKmsKeyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AssociateKmsKeyResponse",
}) as any as S.Schema<AssociateKmsKeyResponse>;
export interface CancelExportTaskRequest {
  taskId: string;
}
export const CancelExportTaskRequest = S.suspend(() =>
  S.Struct({ taskId: S.String }).pipe(
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
  identifier: "CancelExportTaskRequest",
}) as any as S.Schema<CancelExportTaskRequest>;
export interface CancelExportTaskResponse {}
export const CancelExportTaskResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CancelExportTaskResponse",
}) as any as S.Schema<CancelExportTaskResponse>;
export interface CancelImportTaskRequest {
  importId: string;
}
export const CancelImportTaskRequest = S.suspend(() =>
  S.Struct({ importId: S.String }).pipe(
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
  identifier: "CancelImportTaskRequest",
}) as any as S.Schema<CancelImportTaskRequest>;
export interface CreateExportTaskRequest {
  taskName?: string;
  logGroupName: string;
  logStreamNamePrefix?: string;
  from: number;
  to: number;
  destination: string;
  destinationPrefix?: string;
}
export const CreateExportTaskRequest = S.suspend(() =>
  S.Struct({
    taskName: S.optional(S.String),
    logGroupName: S.String,
    logStreamNamePrefix: S.optional(S.String),
    from: S.Number,
    to: S.Number,
    destination: S.String,
    destinationPrefix: S.optional(S.String),
  }).pipe(
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
  identifier: "CreateExportTaskRequest",
}) as any as S.Schema<CreateExportTaskRequest>;
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface CreateLogAnomalyDetectorRequest {
  logGroupArnList: LogGroupArnList;
  detectorName?: string;
  evaluationFrequency?: string;
  filterPattern?: string;
  kmsKeyId?: string;
  anomalyVisibilityTime?: number;
  tags?: Tags;
}
export const CreateLogAnomalyDetectorRequest = S.suspend(() =>
  S.Struct({
    logGroupArnList: LogGroupArnList,
    detectorName: S.optional(S.String),
    evaluationFrequency: S.optional(S.String),
    filterPattern: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    anomalyVisibilityTime: S.optional(S.Number),
    tags: S.optional(Tags),
  }).pipe(
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
  identifier: "CreateLogAnomalyDetectorRequest",
}) as any as S.Schema<CreateLogAnomalyDetectorRequest>;
export interface CreateLogGroupRequest {
  logGroupName: string;
  kmsKeyId?: string;
  tags?: Tags;
  logGroupClass?: string;
  deletionProtectionEnabled?: boolean;
}
export const CreateLogGroupRequest = S.suspend(() =>
  S.Struct({
    logGroupName: S.String,
    kmsKeyId: S.optional(S.String),
    tags: S.optional(Tags),
    logGroupClass: S.optional(S.String),
    deletionProtectionEnabled: S.optional(S.Boolean),
  }).pipe(
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
  identifier: "CreateLogGroupRequest",
}) as any as S.Schema<CreateLogGroupRequest>;
export interface CreateLogGroupResponse {}
export const CreateLogGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateLogGroupResponse",
}) as any as S.Schema<CreateLogGroupResponse>;
export interface CreateLogStreamRequest {
  logGroupName: string;
  logStreamName: string;
}
export const CreateLogStreamRequest = S.suspend(() =>
  S.Struct({ logGroupName: S.String, logStreamName: S.String }).pipe(
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
  identifier: "CreateLogStreamRequest",
}) as any as S.Schema<CreateLogStreamRequest>;
export interface CreateLogStreamResponse {}
export const CreateLogStreamResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateLogStreamResponse",
}) as any as S.Schema<CreateLogStreamResponse>;
export interface DeleteAccountPolicyRequest {
  policyName: string;
  policyType: string;
}
export const DeleteAccountPolicyRequest = S.suspend(() =>
  S.Struct({ policyName: S.String, policyType: S.String }).pipe(
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
  identifier: "DeleteAccountPolicyRequest",
}) as any as S.Schema<DeleteAccountPolicyRequest>;
export interface DeleteAccountPolicyResponse {}
export const DeleteAccountPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteAccountPolicyResponse",
}) as any as S.Schema<DeleteAccountPolicyResponse>;
export interface DeleteDataProtectionPolicyRequest {
  logGroupIdentifier: string;
}
export const DeleteDataProtectionPolicyRequest = S.suspend(() =>
  S.Struct({ logGroupIdentifier: S.String }).pipe(
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
  identifier: "DeleteDataProtectionPolicyRequest",
}) as any as S.Schema<DeleteDataProtectionPolicyRequest>;
export interface DeleteDataProtectionPolicyResponse {}
export const DeleteDataProtectionPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteDataProtectionPolicyResponse",
}) as any as S.Schema<DeleteDataProtectionPolicyResponse>;
export interface DeleteDeliveryRequest {
  id: string;
}
export const DeleteDeliveryRequest = S.suspend(() =>
  S.Struct({ id: S.String }).pipe(
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
  identifier: "DeleteDeliveryRequest",
}) as any as S.Schema<DeleteDeliveryRequest>;
export interface DeleteDeliveryResponse {}
export const DeleteDeliveryResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteDeliveryResponse",
}) as any as S.Schema<DeleteDeliveryResponse>;
export interface DeleteDeliveryDestinationRequest {
  name: string;
}
export const DeleteDeliveryDestinationRequest = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
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
  identifier: "DeleteDeliveryDestinationRequest",
}) as any as S.Schema<DeleteDeliveryDestinationRequest>;
export interface DeleteDeliveryDestinationResponse {}
export const DeleteDeliveryDestinationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteDeliveryDestinationResponse",
}) as any as S.Schema<DeleteDeliveryDestinationResponse>;
export interface DeleteDeliveryDestinationPolicyRequest {
  deliveryDestinationName: string;
}
export const DeleteDeliveryDestinationPolicyRequest = S.suspend(() =>
  S.Struct({ deliveryDestinationName: S.String }).pipe(
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
  identifier: "DeleteDeliveryDestinationPolicyRequest",
}) as any as S.Schema<DeleteDeliveryDestinationPolicyRequest>;
export interface DeleteDeliveryDestinationPolicyResponse {}
export const DeleteDeliveryDestinationPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteDeliveryDestinationPolicyResponse",
}) as any as S.Schema<DeleteDeliveryDestinationPolicyResponse>;
export interface DeleteDeliverySourceRequest {
  name: string;
}
export const DeleteDeliverySourceRequest = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
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
  identifier: "DeleteDeliverySourceRequest",
}) as any as S.Schema<DeleteDeliverySourceRequest>;
export interface DeleteDeliverySourceResponse {}
export const DeleteDeliverySourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteDeliverySourceResponse",
}) as any as S.Schema<DeleteDeliverySourceResponse>;
export interface DeleteDestinationRequest {
  destinationName: string;
}
export const DeleteDestinationRequest = S.suspend(() =>
  S.Struct({ destinationName: S.String }).pipe(
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
  identifier: "DeleteDestinationRequest",
}) as any as S.Schema<DeleteDestinationRequest>;
export interface DeleteDestinationResponse {}
export const DeleteDestinationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteDestinationResponse",
}) as any as S.Schema<DeleteDestinationResponse>;
export interface DeleteIndexPolicyRequest {
  logGroupIdentifier: string;
}
export const DeleteIndexPolicyRequest = S.suspend(() =>
  S.Struct({ logGroupIdentifier: S.String }).pipe(
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
  identifier: "DeleteIndexPolicyRequest",
}) as any as S.Schema<DeleteIndexPolicyRequest>;
export interface DeleteIndexPolicyResponse {}
export const DeleteIndexPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteIndexPolicyResponse",
}) as any as S.Schema<DeleteIndexPolicyResponse>;
export interface DeleteIntegrationRequest {
  integrationName: string;
  force?: boolean;
}
export const DeleteIntegrationRequest = S.suspend(() =>
  S.Struct({ integrationName: S.String, force: S.optional(S.Boolean) }).pipe(
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
  identifier: "DeleteIntegrationRequest",
}) as any as S.Schema<DeleteIntegrationRequest>;
export interface DeleteIntegrationResponse {}
export const DeleteIntegrationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteIntegrationResponse",
}) as any as S.Schema<DeleteIntegrationResponse>;
export interface DeleteLogAnomalyDetectorRequest {
  anomalyDetectorArn: string;
}
export const DeleteLogAnomalyDetectorRequest = S.suspend(() =>
  S.Struct({ anomalyDetectorArn: S.String }).pipe(
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
  identifier: "DeleteLogAnomalyDetectorRequest",
}) as any as S.Schema<DeleteLogAnomalyDetectorRequest>;
export interface DeleteLogAnomalyDetectorResponse {}
export const DeleteLogAnomalyDetectorResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteLogAnomalyDetectorResponse",
}) as any as S.Schema<DeleteLogAnomalyDetectorResponse>;
export interface DeleteLogGroupRequest {
  logGroupName: string;
}
export const DeleteLogGroupRequest = S.suspend(() =>
  S.Struct({ logGroupName: S.String }).pipe(
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
  identifier: "DeleteLogGroupRequest",
}) as any as S.Schema<DeleteLogGroupRequest>;
export interface DeleteLogGroupResponse {}
export const DeleteLogGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteLogGroupResponse",
}) as any as S.Schema<DeleteLogGroupResponse>;
export interface DeleteLogStreamRequest {
  logGroupName: string;
  logStreamName: string;
}
export const DeleteLogStreamRequest = S.suspend(() =>
  S.Struct({ logGroupName: S.String, logStreamName: S.String }).pipe(
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
  identifier: "DeleteLogStreamRequest",
}) as any as S.Schema<DeleteLogStreamRequest>;
export interface DeleteLogStreamResponse {}
export const DeleteLogStreamResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteLogStreamResponse",
}) as any as S.Schema<DeleteLogStreamResponse>;
export interface DeleteMetricFilterRequest {
  logGroupName: string;
  filterName: string;
}
export const DeleteMetricFilterRequest = S.suspend(() =>
  S.Struct({ logGroupName: S.String, filterName: S.String }).pipe(
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
  identifier: "DeleteMetricFilterRequest",
}) as any as S.Schema<DeleteMetricFilterRequest>;
export interface DeleteMetricFilterResponse {}
export const DeleteMetricFilterResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteMetricFilterResponse",
}) as any as S.Schema<DeleteMetricFilterResponse>;
export interface DeleteQueryDefinitionRequest {
  queryDefinitionId: string;
}
export const DeleteQueryDefinitionRequest = S.suspend(() =>
  S.Struct({ queryDefinitionId: S.String }).pipe(
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
  identifier: "DeleteQueryDefinitionRequest",
}) as any as S.Schema<DeleteQueryDefinitionRequest>;
export interface DeleteResourcePolicyRequest {
  policyName?: string;
  resourceArn?: string;
  expectedRevisionId?: string;
}
export const DeleteResourcePolicyRequest = S.suspend(() =>
  S.Struct({
    policyName: S.optional(S.String),
    resourceArn: S.optional(S.String),
    expectedRevisionId: S.optional(S.String),
  }).pipe(
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
  identifier: "DeleteResourcePolicyRequest",
}) as any as S.Schema<DeleteResourcePolicyRequest>;
export interface DeleteResourcePolicyResponse {}
export const DeleteResourcePolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteResourcePolicyResponse",
}) as any as S.Schema<DeleteResourcePolicyResponse>;
export interface DeleteRetentionPolicyRequest {
  logGroupName: string;
}
export const DeleteRetentionPolicyRequest = S.suspend(() =>
  S.Struct({ logGroupName: S.String }).pipe(
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
  identifier: "DeleteRetentionPolicyRequest",
}) as any as S.Schema<DeleteRetentionPolicyRequest>;
export interface DeleteRetentionPolicyResponse {}
export const DeleteRetentionPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteRetentionPolicyResponse",
}) as any as S.Schema<DeleteRetentionPolicyResponse>;
export interface DeleteScheduledQueryRequest {
  identifier: string;
}
export const DeleteScheduledQueryRequest = S.suspend(() =>
  S.Struct({ identifier: S.String }).pipe(
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
  identifier: "DeleteScheduledQueryRequest",
}) as any as S.Schema<DeleteScheduledQueryRequest>;
export interface DeleteScheduledQueryResponse {}
export const DeleteScheduledQueryResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteScheduledQueryResponse",
}) as any as S.Schema<DeleteScheduledQueryResponse>;
export interface DeleteSubscriptionFilterRequest {
  logGroupName: string;
  filterName: string;
}
export const DeleteSubscriptionFilterRequest = S.suspend(() =>
  S.Struct({ logGroupName: S.String, filterName: S.String }).pipe(
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
  identifier: "DeleteSubscriptionFilterRequest",
}) as any as S.Schema<DeleteSubscriptionFilterRequest>;
export interface DeleteSubscriptionFilterResponse {}
export const DeleteSubscriptionFilterResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteSubscriptionFilterResponse",
}) as any as S.Schema<DeleteSubscriptionFilterResponse>;
export interface DeleteTransformerRequest {
  logGroupIdentifier: string;
}
export const DeleteTransformerRequest = S.suspend(() =>
  S.Struct({ logGroupIdentifier: S.String }).pipe(
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
  identifier: "DeleteTransformerRequest",
}) as any as S.Schema<DeleteTransformerRequest>;
export interface DeleteTransformerResponse {}
export const DeleteTransformerResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteTransformerResponse",
}) as any as S.Schema<DeleteTransformerResponse>;
export interface DescribeAccountPoliciesRequest {
  policyType: string;
  policyName?: string;
  accountIdentifiers?: AccountIds;
  nextToken?: string;
}
export const DescribeAccountPoliciesRequest = S.suspend(() =>
  S.Struct({
    policyType: S.String,
    policyName: S.optional(S.String),
    accountIdentifiers: S.optional(AccountIds),
    nextToken: S.optional(S.String),
  }).pipe(
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
  identifier: "DescribeAccountPoliciesRequest",
}) as any as S.Schema<DescribeAccountPoliciesRequest>;
export interface DescribeConfigurationTemplatesRequest {
  service?: string;
  logTypes?: LogTypes;
  resourceTypes?: ResourceTypes;
  deliveryDestinationTypes?: DeliveryDestinationTypes;
  nextToken?: string;
  limit?: number;
}
export const DescribeConfigurationTemplatesRequest = S.suspend(() =>
  S.Struct({
    service: S.optional(S.String),
    logTypes: S.optional(LogTypes),
    resourceTypes: S.optional(ResourceTypes),
    deliveryDestinationTypes: S.optional(DeliveryDestinationTypes),
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
  }).pipe(
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
  identifier: "DescribeConfigurationTemplatesRequest",
}) as any as S.Schema<DescribeConfigurationTemplatesRequest>;
export interface DescribeDeliveriesRequest {
  nextToken?: string;
  limit?: number;
}
export const DescribeDeliveriesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
  }).pipe(
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
  identifier: "DescribeDeliveriesRequest",
}) as any as S.Schema<DescribeDeliveriesRequest>;
export interface DescribeDeliveryDestinationsRequest {
  nextToken?: string;
  limit?: number;
}
export const DescribeDeliveryDestinationsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
  }).pipe(
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
  identifier: "DescribeDeliveryDestinationsRequest",
}) as any as S.Schema<DescribeDeliveryDestinationsRequest>;
export interface DescribeDeliverySourcesRequest {
  nextToken?: string;
  limit?: number;
}
export const DescribeDeliverySourcesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
  }).pipe(
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
  identifier: "DescribeDeliverySourcesRequest",
}) as any as S.Schema<DescribeDeliverySourcesRequest>;
export interface DescribeDestinationsRequest {
  DestinationNamePrefix?: string;
  nextToken?: string;
  limit?: number;
}
export const DescribeDestinationsRequest = S.suspend(() =>
  S.Struct({
    DestinationNamePrefix: S.optional(S.String),
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
  }).pipe(
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
  identifier: "DescribeDestinationsRequest",
}) as any as S.Schema<DescribeDestinationsRequest>;
export interface DescribeExportTasksRequest {
  taskId?: string;
  statusCode?: string;
  nextToken?: string;
  limit?: number;
}
export const DescribeExportTasksRequest = S.suspend(() =>
  S.Struct({
    taskId: S.optional(S.String),
    statusCode: S.optional(S.String),
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
  }).pipe(
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
  identifier: "DescribeExportTasksRequest",
}) as any as S.Schema<DescribeExportTasksRequest>;
export interface DescribeFieldIndexesRequest {
  logGroupIdentifiers: DescribeFieldIndexesLogGroupIdentifiers;
  nextToken?: string;
}
export const DescribeFieldIndexesRequest = S.suspend(() =>
  S.Struct({
    logGroupIdentifiers: DescribeFieldIndexesLogGroupIdentifiers,
    nextToken: S.optional(S.String),
  }).pipe(
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
  identifier: "DescribeFieldIndexesRequest",
}) as any as S.Schema<DescribeFieldIndexesRequest>;
export interface DescribeImportTaskBatchesRequest {
  importId: string;
  batchImportStatus?: ImportStatusList;
  limit?: number;
  nextToken?: string;
}
export const DescribeImportTaskBatchesRequest = S.suspend(() =>
  S.Struct({
    importId: S.String,
    batchImportStatus: S.optional(ImportStatusList),
    limit: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
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
  identifier: "DescribeImportTaskBatchesRequest",
}) as any as S.Schema<DescribeImportTaskBatchesRequest>;
export interface DescribeImportTasksRequest {
  importId?: string;
  importStatus?: string;
  importSourceArn?: string;
  limit?: number;
  nextToken?: string;
}
export const DescribeImportTasksRequest = S.suspend(() =>
  S.Struct({
    importId: S.optional(S.String),
    importStatus: S.optional(S.String),
    importSourceArn: S.optional(S.String),
    limit: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
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
  identifier: "DescribeImportTasksRequest",
}) as any as S.Schema<DescribeImportTasksRequest>;
export interface DescribeIndexPoliciesRequest {
  logGroupIdentifiers: DescribeIndexPoliciesLogGroupIdentifiers;
  nextToken?: string;
}
export const DescribeIndexPoliciesRequest = S.suspend(() =>
  S.Struct({
    logGroupIdentifiers: DescribeIndexPoliciesLogGroupIdentifiers,
    nextToken: S.optional(S.String),
  }).pipe(
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
  identifier: "DescribeIndexPoliciesRequest",
}) as any as S.Schema<DescribeIndexPoliciesRequest>;
export interface DescribeLogGroupsRequest {
  accountIdentifiers?: AccountIds;
  logGroupNamePrefix?: string;
  logGroupNamePattern?: string;
  nextToken?: string;
  limit?: number;
  includeLinkedAccounts?: boolean;
  logGroupClass?: string;
  logGroupIdentifiers?: DescribeLogGroupsLogGroupIdentifiers;
}
export const DescribeLogGroupsRequest = S.suspend(() =>
  S.Struct({
    accountIdentifiers: S.optional(AccountIds),
    logGroupNamePrefix: S.optional(S.String),
    logGroupNamePattern: S.optional(S.String),
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
    includeLinkedAccounts: S.optional(S.Boolean),
    logGroupClass: S.optional(S.String),
    logGroupIdentifiers: S.optional(DescribeLogGroupsLogGroupIdentifiers),
  }).pipe(
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
  identifier: "DescribeLogGroupsRequest",
}) as any as S.Schema<DescribeLogGroupsRequest>;
export interface DescribeLogStreamsRequest {
  logGroupName?: string;
  logGroupIdentifier?: string;
  logStreamNamePrefix?: string;
  orderBy?: string;
  descending?: boolean;
  nextToken?: string;
  limit?: number;
}
export const DescribeLogStreamsRequest = S.suspend(() =>
  S.Struct({
    logGroupName: S.optional(S.String),
    logGroupIdentifier: S.optional(S.String),
    logStreamNamePrefix: S.optional(S.String),
    orderBy: S.optional(S.String),
    descending: S.optional(S.Boolean),
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
  }).pipe(
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
  identifier: "DescribeLogStreamsRequest",
}) as any as S.Schema<DescribeLogStreamsRequest>;
export interface DescribeMetricFiltersRequest {
  logGroupName?: string;
  filterNamePrefix?: string;
  nextToken?: string;
  limit?: number;
  metricName?: string;
  metricNamespace?: string;
}
export const DescribeMetricFiltersRequest = S.suspend(() =>
  S.Struct({
    logGroupName: S.optional(S.String),
    filterNamePrefix: S.optional(S.String),
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
    metricName: S.optional(S.String),
    metricNamespace: S.optional(S.String),
  }).pipe(
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
  identifier: "DescribeMetricFiltersRequest",
}) as any as S.Schema<DescribeMetricFiltersRequest>;
export interface DescribeQueriesRequest {
  logGroupName?: string;
  status?: string;
  maxResults?: number;
  nextToken?: string;
  queryLanguage?: string;
}
export const DescribeQueriesRequest = S.suspend(() =>
  S.Struct({
    logGroupName: S.optional(S.String),
    status: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    queryLanguage: S.optional(S.String),
  }).pipe(
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
  identifier: "DescribeQueriesRequest",
}) as any as S.Schema<DescribeQueriesRequest>;
export interface DescribeQueryDefinitionsRequest {
  queryLanguage?: string;
  queryDefinitionNamePrefix?: string;
  maxResults?: number;
  nextToken?: string;
}
export const DescribeQueryDefinitionsRequest = S.suspend(() =>
  S.Struct({
    queryLanguage: S.optional(S.String),
    queryDefinitionNamePrefix: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
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
  identifier: "DescribeQueryDefinitionsRequest",
}) as any as S.Schema<DescribeQueryDefinitionsRequest>;
export interface DescribeResourcePoliciesRequest {
  nextToken?: string;
  limit?: number;
  resourceArn?: string;
  policyScope?: string;
}
export const DescribeResourcePoliciesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
    resourceArn: S.optional(S.String),
    policyScope: S.optional(S.String),
  }).pipe(
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
  identifier: "DescribeResourcePoliciesRequest",
}) as any as S.Schema<DescribeResourcePoliciesRequest>;
export interface DescribeSubscriptionFiltersRequest {
  logGroupName: string;
  filterNamePrefix?: string;
  nextToken?: string;
  limit?: number;
}
export const DescribeSubscriptionFiltersRequest = S.suspend(() =>
  S.Struct({
    logGroupName: S.String,
    filterNamePrefix: S.optional(S.String),
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
  }).pipe(
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
  identifier: "DescribeSubscriptionFiltersRequest",
}) as any as S.Schema<DescribeSubscriptionFiltersRequest>;
export interface DisassociateKmsKeyRequest {
  logGroupName?: string;
  resourceIdentifier?: string;
}
export const DisassociateKmsKeyRequest = S.suspend(() =>
  S.Struct({
    logGroupName: S.optional(S.String),
    resourceIdentifier: S.optional(S.String),
  }).pipe(
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
  identifier: "DisassociateKmsKeyRequest",
}) as any as S.Schema<DisassociateKmsKeyRequest>;
export interface DisassociateKmsKeyResponse {}
export const DisassociateKmsKeyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisassociateKmsKeyResponse",
}) as any as S.Schema<DisassociateKmsKeyResponse>;
export interface DisassociateSourceFromS3TableIntegrationRequest {
  identifier: string;
}
export const DisassociateSourceFromS3TableIntegrationRequest = S.suspend(() =>
  S.Struct({ identifier: S.String }).pipe(
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
  identifier: "DisassociateSourceFromS3TableIntegrationRequest",
}) as any as S.Schema<DisassociateSourceFromS3TableIntegrationRequest>;
export interface FilterLogEventsRequest {
  logGroupName?: string;
  logGroupIdentifier?: string;
  logStreamNames?: InputLogStreamNames;
  logStreamNamePrefix?: string;
  startTime?: number;
  endTime?: number;
  filterPattern?: string;
  nextToken?: string;
  limit?: number;
  interleaved?: boolean;
  unmask?: boolean;
}
export const FilterLogEventsRequest = S.suspend(() =>
  S.Struct({
    logGroupName: S.optional(S.String),
    logGroupIdentifier: S.optional(S.String),
    logStreamNames: S.optional(InputLogStreamNames),
    logStreamNamePrefix: S.optional(S.String),
    startTime: S.optional(S.Number),
    endTime: S.optional(S.Number),
    filterPattern: S.optional(S.String),
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
    interleaved: S.optional(S.Boolean),
    unmask: S.optional(S.Boolean),
  }).pipe(
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
  identifier: "FilterLogEventsRequest",
}) as any as S.Schema<FilterLogEventsRequest>;
export interface GetDataProtectionPolicyRequest {
  logGroupIdentifier: string;
}
export const GetDataProtectionPolicyRequest = S.suspend(() =>
  S.Struct({ logGroupIdentifier: S.String }).pipe(
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
  identifier: "GetDataProtectionPolicyRequest",
}) as any as S.Schema<GetDataProtectionPolicyRequest>;
export interface GetDeliveryRequest {
  id: string;
}
export const GetDeliveryRequest = S.suspend(() =>
  S.Struct({ id: S.String }).pipe(
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
  identifier: "GetDeliveryRequest",
}) as any as S.Schema<GetDeliveryRequest>;
export interface GetDeliveryDestinationRequest {
  name: string;
}
export const GetDeliveryDestinationRequest = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
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
  identifier: "GetDeliveryDestinationRequest",
}) as any as S.Schema<GetDeliveryDestinationRequest>;
export interface GetDeliveryDestinationPolicyRequest {
  deliveryDestinationName: string;
}
export const GetDeliveryDestinationPolicyRequest = S.suspend(() =>
  S.Struct({ deliveryDestinationName: S.String }).pipe(
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
  identifier: "GetDeliveryDestinationPolicyRequest",
}) as any as S.Schema<GetDeliveryDestinationPolicyRequest>;
export interface GetDeliverySourceRequest {
  name: string;
}
export const GetDeliverySourceRequest = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
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
  identifier: "GetDeliverySourceRequest",
}) as any as S.Schema<GetDeliverySourceRequest>;
export interface GetIntegrationRequest {
  integrationName: string;
}
export const GetIntegrationRequest = S.suspend(() =>
  S.Struct({ integrationName: S.String }).pipe(
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
  identifier: "GetIntegrationRequest",
}) as any as S.Schema<GetIntegrationRequest>;
export interface GetLogAnomalyDetectorRequest {
  anomalyDetectorArn: string;
}
export const GetLogAnomalyDetectorRequest = S.suspend(() =>
  S.Struct({ anomalyDetectorArn: S.String }).pipe(
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
  identifier: "GetLogAnomalyDetectorRequest",
}) as any as S.Schema<GetLogAnomalyDetectorRequest>;
export interface GetLogEventsRequest {
  logGroupName?: string;
  logGroupIdentifier?: string;
  logStreamName: string;
  startTime?: number;
  endTime?: number;
  nextToken?: string;
  limit?: number;
  startFromHead?: boolean;
  unmask?: boolean;
}
export const GetLogEventsRequest = S.suspend(() =>
  S.Struct({
    logGroupName: S.optional(S.String),
    logGroupIdentifier: S.optional(S.String),
    logStreamName: S.String,
    startTime: S.optional(S.Number),
    endTime: S.optional(S.Number),
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
    startFromHead: S.optional(S.Boolean),
    unmask: S.optional(S.Boolean),
  }).pipe(
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
  identifier: "GetLogEventsRequest",
}) as any as S.Schema<GetLogEventsRequest>;
export interface GetLogFieldsRequest {
  dataSourceName: string;
  dataSourceType: string;
}
export const GetLogFieldsRequest = S.suspend(() =>
  S.Struct({ dataSourceName: S.String, dataSourceType: S.String }).pipe(
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
  identifier: "GetLogFieldsRequest",
}) as any as S.Schema<GetLogFieldsRequest>;
export interface GetLogGroupFieldsRequest {
  logGroupName?: string;
  time?: number;
  logGroupIdentifier?: string;
}
export const GetLogGroupFieldsRequest = S.suspend(() =>
  S.Struct({
    logGroupName: S.optional(S.String),
    time: S.optional(S.Number),
    logGroupIdentifier: S.optional(S.String),
  }).pipe(
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
  identifier: "GetLogGroupFieldsRequest",
}) as any as S.Schema<GetLogGroupFieldsRequest>;
export interface GetLogObjectRequest {
  unmask?: boolean;
  logObjectPointer: string;
}
export const GetLogObjectRequest = S.suspend(() =>
  S.Struct({ unmask: S.optional(S.Boolean), logObjectPointer: S.String }).pipe(
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
  identifier: "GetLogObjectRequest",
}) as any as S.Schema<GetLogObjectRequest>;
export interface GetLogRecordRequest {
  logRecordPointer: string;
  unmask?: boolean;
}
export const GetLogRecordRequest = S.suspend(() =>
  S.Struct({ logRecordPointer: S.String, unmask: S.optional(S.Boolean) }).pipe(
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
  identifier: "GetLogRecordRequest",
}) as any as S.Schema<GetLogRecordRequest>;
export interface GetQueryResultsRequest {
  queryId: string;
}
export const GetQueryResultsRequest = S.suspend(() =>
  S.Struct({ queryId: S.String }).pipe(
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
  identifier: "GetQueryResultsRequest",
}) as any as S.Schema<GetQueryResultsRequest>;
export interface GetScheduledQueryRequest {
  identifier: string;
}
export const GetScheduledQueryRequest = S.suspend(() =>
  S.Struct({ identifier: S.String }).pipe(
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
  identifier: "GetScheduledQueryRequest",
}) as any as S.Schema<GetScheduledQueryRequest>;
export interface GetScheduledQueryHistoryRequest {
  identifier: string;
  startTime: number;
  endTime: number;
  executionStatuses?: ExecutionStatusList;
  maxResults?: number;
  nextToken?: string;
}
export const GetScheduledQueryHistoryRequest = S.suspend(() =>
  S.Struct({
    identifier: S.String,
    startTime: S.Number,
    endTime: S.Number,
    executionStatuses: S.optional(ExecutionStatusList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
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
  identifier: "GetScheduledQueryHistoryRequest",
}) as any as S.Schema<GetScheduledQueryHistoryRequest>;
export interface GetTransformerRequest {
  logGroupIdentifier: string;
}
export const GetTransformerRequest = S.suspend(() =>
  S.Struct({ logGroupIdentifier: S.String }).pipe(
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
  identifier: "GetTransformerRequest",
}) as any as S.Schema<GetTransformerRequest>;
export interface ListAnomaliesRequest {
  anomalyDetectorArn?: string;
  suppressionState?: string;
  limit?: number;
  nextToken?: string;
}
export const ListAnomaliesRequest = S.suspend(() =>
  S.Struct({
    anomalyDetectorArn: S.optional(S.String),
    suppressionState: S.optional(S.String),
    limit: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
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
  identifier: "ListAnomaliesRequest",
}) as any as S.Schema<ListAnomaliesRequest>;
export interface ListIntegrationsRequest {
  integrationNamePrefix?: string;
  integrationType?: string;
  integrationStatus?: string;
}
export const ListIntegrationsRequest = S.suspend(() =>
  S.Struct({
    integrationNamePrefix: S.optional(S.String),
    integrationType: S.optional(S.String),
    integrationStatus: S.optional(S.String),
  }).pipe(
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
  identifier: "ListIntegrationsRequest",
}) as any as S.Schema<ListIntegrationsRequest>;
export interface ListLogAnomalyDetectorsRequest {
  filterLogGroupArn?: string;
  limit?: number;
  nextToken?: string;
}
export const ListLogAnomalyDetectorsRequest = S.suspend(() =>
  S.Struct({
    filterLogGroupArn: S.optional(S.String),
    limit: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
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
  identifier: "ListLogAnomalyDetectorsRequest",
}) as any as S.Schema<ListLogAnomalyDetectorsRequest>;
export interface DataSourceFilter {
  name: string;
  type?: string;
}
export const DataSourceFilter = S.suspend(() =>
  S.Struct({ name: S.String, type: S.optional(S.String) }),
).annotations({
  identifier: "DataSourceFilter",
}) as any as S.Schema<DataSourceFilter>;
export type DataSourceFilters = DataSourceFilter[];
export const DataSourceFilters = S.Array(DataSourceFilter);
export interface ListLogGroupsRequest {
  logGroupNamePattern?: string;
  logGroupClass?: string;
  includeLinkedAccounts?: boolean;
  accountIdentifiers?: AccountIds;
  nextToken?: string;
  limit?: number;
  dataSources?: DataSourceFilters;
  fieldIndexNames?: FieldIndexNames;
}
export const ListLogGroupsRequest = S.suspend(() =>
  S.Struct({
    logGroupNamePattern: S.optional(S.String),
    logGroupClass: S.optional(S.String),
    includeLinkedAccounts: S.optional(S.Boolean),
    accountIdentifiers: S.optional(AccountIds),
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
    dataSources: S.optional(DataSourceFilters),
    fieldIndexNames: S.optional(FieldIndexNames),
  }).pipe(
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
  identifier: "ListLogGroupsRequest",
}) as any as S.Schema<ListLogGroupsRequest>;
export interface ListLogGroupsForQueryRequest {
  queryId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListLogGroupsForQueryRequest = S.suspend(() =>
  S.Struct({
    queryId: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
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
  identifier: "ListLogGroupsForQueryRequest",
}) as any as S.Schema<ListLogGroupsForQueryRequest>;
export interface ListScheduledQueriesRequest {
  maxResults?: number;
  nextToken?: string;
  state?: string;
}
export const ListScheduledQueriesRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    state: S.optional(S.String),
  }).pipe(
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
  identifier: "ListScheduledQueriesRequest",
}) as any as S.Schema<ListScheduledQueriesRequest>;
export interface ListSourcesForS3TableIntegrationRequest {
  integrationArn: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListSourcesForS3TableIntegrationRequest = S.suspend(() =>
  S.Struct({
    integrationArn: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
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
  identifier: "ListSourcesForS3TableIntegrationRequest",
}) as any as S.Schema<ListSourcesForS3TableIntegrationRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String }).pipe(
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
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ListTagsLogGroupRequest {
  logGroupName: string;
}
export const ListTagsLogGroupRequest = S.suspend(() =>
  S.Struct({ logGroupName: S.String }).pipe(
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
  identifier: "ListTagsLogGroupRequest",
}) as any as S.Schema<ListTagsLogGroupRequest>;
export interface PutAccountPolicyRequest {
  policyName: string;
  policyDocument: string;
  policyType: string;
  scope?: string;
  selectionCriteria?: string;
}
export const PutAccountPolicyRequest = S.suspend(() =>
  S.Struct({
    policyName: S.String,
    policyDocument: S.String,
    policyType: S.String,
    scope: S.optional(S.String),
    selectionCriteria: S.optional(S.String),
  }).pipe(
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
  identifier: "PutAccountPolicyRequest",
}) as any as S.Schema<PutAccountPolicyRequest>;
export interface PutDataProtectionPolicyRequest {
  logGroupIdentifier: string;
  policyDocument: string;
}
export const PutDataProtectionPolicyRequest = S.suspend(() =>
  S.Struct({ logGroupIdentifier: S.String, policyDocument: S.String }).pipe(
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
  identifier: "PutDataProtectionPolicyRequest",
}) as any as S.Schema<PutDataProtectionPolicyRequest>;
export interface PutDeliveryDestinationPolicyRequest {
  deliveryDestinationName: string;
  deliveryDestinationPolicy: string;
}
export const PutDeliveryDestinationPolicyRequest = S.suspend(() =>
  S.Struct({
    deliveryDestinationName: S.String,
    deliveryDestinationPolicy: S.String,
  }).pipe(
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
  identifier: "PutDeliveryDestinationPolicyRequest",
}) as any as S.Schema<PutDeliveryDestinationPolicyRequest>;
export interface PutDeliverySourceRequest {
  name: string;
  resourceArn: string;
  logType: string;
  tags?: Tags;
}
export const PutDeliverySourceRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    resourceArn: S.String,
    logType: S.String,
    tags: S.optional(Tags),
  }).pipe(
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
  identifier: "PutDeliverySourceRequest",
}) as any as S.Schema<PutDeliverySourceRequest>;
export interface PutDestinationRequest {
  destinationName: string;
  targetArn: string;
  roleArn: string;
  tags?: Tags;
}
export const PutDestinationRequest = S.suspend(() =>
  S.Struct({
    destinationName: S.String,
    targetArn: S.String,
    roleArn: S.String,
    tags: S.optional(Tags),
  }).pipe(
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
  identifier: "PutDestinationRequest",
}) as any as S.Schema<PutDestinationRequest>;
export interface PutDestinationPolicyRequest {
  destinationName: string;
  accessPolicy: string;
  forceUpdate?: boolean;
}
export const PutDestinationPolicyRequest = S.suspend(() =>
  S.Struct({
    destinationName: S.String,
    accessPolicy: S.String,
    forceUpdate: S.optional(S.Boolean),
  }).pipe(
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
  identifier: "PutDestinationPolicyRequest",
}) as any as S.Schema<PutDestinationPolicyRequest>;
export interface PutDestinationPolicyResponse {}
export const PutDestinationPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutDestinationPolicyResponse",
}) as any as S.Schema<PutDestinationPolicyResponse>;
export interface PutIndexPolicyRequest {
  logGroupIdentifier: string;
  policyDocument: string;
}
export const PutIndexPolicyRequest = S.suspend(() =>
  S.Struct({ logGroupIdentifier: S.String, policyDocument: S.String }).pipe(
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
  identifier: "PutIndexPolicyRequest",
}) as any as S.Schema<PutIndexPolicyRequest>;
export interface PutLogGroupDeletionProtectionRequest {
  logGroupIdentifier: string;
  deletionProtectionEnabled: boolean;
}
export const PutLogGroupDeletionProtectionRequest = S.suspend(() =>
  S.Struct({
    logGroupIdentifier: S.String,
    deletionProtectionEnabled: S.Boolean,
  }).pipe(
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
  identifier: "PutLogGroupDeletionProtectionRequest",
}) as any as S.Schema<PutLogGroupDeletionProtectionRequest>;
export interface PutLogGroupDeletionProtectionResponse {}
export const PutLogGroupDeletionProtectionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutLogGroupDeletionProtectionResponse",
}) as any as S.Schema<PutLogGroupDeletionProtectionResponse>;
export interface PutQueryDefinitionRequest {
  queryLanguage?: string;
  name: string;
  queryDefinitionId?: string;
  logGroupNames?: LogGroupNames;
  queryString: string;
  clientToken?: string;
}
export const PutQueryDefinitionRequest = S.suspend(() =>
  S.Struct({
    queryLanguage: S.optional(S.String),
    name: S.String,
    queryDefinitionId: S.optional(S.String),
    logGroupNames: S.optional(LogGroupNames),
    queryString: S.String,
    clientToken: S.optional(S.String),
  }).pipe(
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
  identifier: "PutQueryDefinitionRequest",
}) as any as S.Schema<PutQueryDefinitionRequest>;
export interface PutResourcePolicyRequest {
  policyName?: string;
  policyDocument?: string;
  resourceArn?: string;
  expectedRevisionId?: string;
}
export const PutResourcePolicyRequest = S.suspend(() =>
  S.Struct({
    policyName: S.optional(S.String),
    policyDocument: S.optional(S.String),
    resourceArn: S.optional(S.String),
    expectedRevisionId: S.optional(S.String),
  }).pipe(
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
  identifier: "PutResourcePolicyRequest",
}) as any as S.Schema<PutResourcePolicyRequest>;
export interface PutRetentionPolicyRequest {
  logGroupName: string;
  retentionInDays: number;
}
export const PutRetentionPolicyRequest = S.suspend(() =>
  S.Struct({ logGroupName: S.String, retentionInDays: S.Number }).pipe(
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
  identifier: "PutRetentionPolicyRequest",
}) as any as S.Schema<PutRetentionPolicyRequest>;
export interface PutRetentionPolicyResponse {}
export const PutRetentionPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutRetentionPolicyResponse",
}) as any as S.Schema<PutRetentionPolicyResponse>;
export interface PutSubscriptionFilterRequest {
  logGroupName: string;
  filterName: string;
  filterPattern: string;
  destinationArn: string;
  roleArn?: string;
  distribution?: string;
  applyOnTransformedLogs?: boolean;
  fieldSelectionCriteria?: string;
  emitSystemFields?: EmitSystemFields;
}
export const PutSubscriptionFilterRequest = S.suspend(() =>
  S.Struct({
    logGroupName: S.String,
    filterName: S.String,
    filterPattern: S.String,
    destinationArn: S.String,
    roleArn: S.optional(S.String),
    distribution: S.optional(S.String),
    applyOnTransformedLogs: S.optional(S.Boolean),
    fieldSelectionCriteria: S.optional(S.String),
    emitSystemFields: S.optional(EmitSystemFields),
  }).pipe(
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
  identifier: "PutSubscriptionFilterRequest",
}) as any as S.Schema<PutSubscriptionFilterRequest>;
export interface PutSubscriptionFilterResponse {}
export const PutSubscriptionFilterResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutSubscriptionFilterResponse",
}) as any as S.Schema<PutSubscriptionFilterResponse>;
export interface StartLiveTailRequest {
  logGroupIdentifiers: StartLiveTailLogGroupIdentifiers;
  logStreamNames?: InputLogStreamNames;
  logStreamNamePrefixes?: InputLogStreamNames;
  logEventFilterPattern?: string;
}
export const StartLiveTailRequest = S.suspend(() =>
  S.Struct({
    logGroupIdentifiers: StartLiveTailLogGroupIdentifiers,
    logStreamNames: S.optional(InputLogStreamNames),
    logStreamNamePrefixes: S.optional(InputLogStreamNames),
    logEventFilterPattern: S.optional(S.String),
  }).pipe(
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
  identifier: "StartLiveTailRequest",
}) as any as S.Schema<StartLiveTailRequest>;
export interface StartQueryRequest {
  queryLanguage?: string;
  logGroupName?: string;
  logGroupNames?: LogGroupNames;
  logGroupIdentifiers?: LogGroupIdentifiers;
  startTime: number;
  endTime: number;
  queryString: string;
  limit?: number;
}
export const StartQueryRequest = S.suspend(() =>
  S.Struct({
    queryLanguage: S.optional(S.String),
    logGroupName: S.optional(S.String),
    logGroupNames: S.optional(LogGroupNames),
    logGroupIdentifiers: S.optional(LogGroupIdentifiers),
    startTime: S.Number,
    endTime: S.Number,
    queryString: S.String,
    limit: S.optional(S.Number),
  }).pipe(
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
  identifier: "StartQueryRequest",
}) as any as S.Schema<StartQueryRequest>;
export interface StopQueryRequest {
  queryId: string;
}
export const StopQueryRequest = S.suspend(() =>
  S.Struct({ queryId: S.String }).pipe(
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
  identifier: "StopQueryRequest",
}) as any as S.Schema<StopQueryRequest>;
export interface TagLogGroupRequest {
  logGroupName: string;
  tags: Tags;
}
export const TagLogGroupRequest = S.suspend(() =>
  S.Struct({ logGroupName: S.String, tags: Tags }).pipe(
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
  identifier: "TagLogGroupRequest",
}) as any as S.Schema<TagLogGroupRequest>;
export interface TagLogGroupResponse {}
export const TagLogGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagLogGroupResponse",
}) as any as S.Schema<TagLogGroupResponse>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tags: Tags }).pipe(
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
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface TestMetricFilterRequest {
  filterPattern: string;
  logEventMessages: TestEventMessages;
}
export const TestMetricFilterRequest = S.suspend(() =>
  S.Struct({
    filterPattern: S.String,
    logEventMessages: TestEventMessages,
  }).pipe(
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
  identifier: "TestMetricFilterRequest",
}) as any as S.Schema<TestMetricFilterRequest>;
export interface AddKeyEntry {
  key: string;
  value: string;
  overwriteIfExists?: boolean;
}
export const AddKeyEntry = S.suspend(() =>
  S.Struct({
    key: S.String,
    value: S.String,
    overwriteIfExists: S.optional(S.Boolean),
  }),
).annotations({ identifier: "AddKeyEntry" }) as any as S.Schema<AddKeyEntry>;
export type AddKeyEntries = AddKeyEntry[];
export const AddKeyEntries = S.Array(AddKeyEntry);
export interface AddKeys {
  entries: AddKeyEntries;
}
export const AddKeys = S.suspend(() =>
  S.Struct({ entries: AddKeyEntries }),
).annotations({ identifier: "AddKeys" }) as any as S.Schema<AddKeys>;
export interface CopyValueEntry {
  source: string;
  target: string;
  overwriteIfExists?: boolean;
}
export const CopyValueEntry = S.suspend(() =>
  S.Struct({
    source: S.String,
    target: S.String,
    overwriteIfExists: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CopyValueEntry",
}) as any as S.Schema<CopyValueEntry>;
export type CopyValueEntries = CopyValueEntry[];
export const CopyValueEntries = S.Array(CopyValueEntry);
export interface CopyValue {
  entries: CopyValueEntries;
}
export const CopyValue = S.suspend(() =>
  S.Struct({ entries: CopyValueEntries }),
).annotations({ identifier: "CopyValue" }) as any as S.Schema<CopyValue>;
export type Columns = string[];
export const Columns = S.Array(S.String);
export interface CSV {
  quoteCharacter?: string;
  delimiter?: string;
  columns?: Columns;
  source?: string;
}
export const CSV = S.suspend(() =>
  S.Struct({
    quoteCharacter: S.optional(S.String),
    delimiter: S.optional(S.String),
    columns: S.optional(Columns),
    source: S.optional(S.String),
  }),
).annotations({ identifier: "CSV" }) as any as S.Schema<CSV>;
export type MatchPatterns = string[];
export const MatchPatterns = S.Array(S.String);
export interface DateTimeConverter {
  source: string;
  target: string;
  targetFormat?: string;
  matchPatterns: MatchPatterns;
  sourceTimezone?: string;
  targetTimezone?: string;
  locale?: string;
}
export const DateTimeConverter = S.suspend(() =>
  S.Struct({
    source: S.String,
    target: S.String,
    targetFormat: S.optional(S.String),
    matchPatterns: MatchPatterns,
    sourceTimezone: S.optional(S.String),
    targetTimezone: S.optional(S.String),
    locale: S.optional(S.String),
  }),
).annotations({
  identifier: "DateTimeConverter",
}) as any as S.Schema<DateTimeConverter>;
export type DeleteWithKeys = string[];
export const DeleteWithKeys = S.Array(S.String);
export interface DeleteKeys {
  withKeys: DeleteWithKeys;
}
export const DeleteKeys = S.suspend(() =>
  S.Struct({ withKeys: DeleteWithKeys }),
).annotations({ identifier: "DeleteKeys" }) as any as S.Schema<DeleteKeys>;
export interface Grok {
  source?: string;
  match: string;
}
export const Grok = S.suspend(() =>
  S.Struct({ source: S.optional(S.String), match: S.String }),
).annotations({ identifier: "Grok" }) as any as S.Schema<Grok>;
export interface ListToMap {
  source: string;
  key: string;
  valueKey?: string;
  target?: string;
  flatten?: boolean;
  flattenedElement?: string;
}
export const ListToMap = S.suspend(() =>
  S.Struct({
    source: S.String,
    key: S.String,
    valueKey: S.optional(S.String),
    target: S.optional(S.String),
    flatten: S.optional(S.Boolean),
    flattenedElement: S.optional(S.String),
  }),
).annotations({ identifier: "ListToMap" }) as any as S.Schema<ListToMap>;
export type LowerCaseStringWithKeys = string[];
export const LowerCaseStringWithKeys = S.Array(S.String);
export interface LowerCaseString {
  withKeys: LowerCaseStringWithKeys;
}
export const LowerCaseString = S.suspend(() =>
  S.Struct({ withKeys: LowerCaseStringWithKeys }),
).annotations({
  identifier: "LowerCaseString",
}) as any as S.Schema<LowerCaseString>;
export interface MoveKeyEntry {
  source: string;
  target: string;
  overwriteIfExists?: boolean;
}
export const MoveKeyEntry = S.suspend(() =>
  S.Struct({
    source: S.String,
    target: S.String,
    overwriteIfExists: S.optional(S.Boolean),
  }),
).annotations({ identifier: "MoveKeyEntry" }) as any as S.Schema<MoveKeyEntry>;
export type MoveKeyEntries = MoveKeyEntry[];
export const MoveKeyEntries = S.Array(MoveKeyEntry);
export interface MoveKeys {
  entries: MoveKeyEntries;
}
export const MoveKeys = S.suspend(() =>
  S.Struct({ entries: MoveKeyEntries }),
).annotations({ identifier: "MoveKeys" }) as any as S.Schema<MoveKeys>;
export interface ParseCloudfront {
  source?: string;
}
export const ParseCloudfront = S.suspend(() =>
  S.Struct({ source: S.optional(S.String) }),
).annotations({
  identifier: "ParseCloudfront",
}) as any as S.Schema<ParseCloudfront>;
export interface ParseJSON {
  source?: string;
  destination?: string;
}
export const ParseJSON = S.suspend(() =>
  S.Struct({ source: S.optional(S.String), destination: S.optional(S.String) }),
).annotations({ identifier: "ParseJSON" }) as any as S.Schema<ParseJSON>;
export interface ParseKeyValue {
  source?: string;
  destination?: string;
  fieldDelimiter?: string;
  keyValueDelimiter?: string;
  keyPrefix?: string;
  nonMatchValue?: string;
  overwriteIfExists?: boolean;
}
export const ParseKeyValue = S.suspend(() =>
  S.Struct({
    source: S.optional(S.String),
    destination: S.optional(S.String),
    fieldDelimiter: S.optional(S.String),
    keyValueDelimiter: S.optional(S.String),
    keyPrefix: S.optional(S.String),
    nonMatchValue: S.optional(S.String),
    overwriteIfExists: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ParseKeyValue",
}) as any as S.Schema<ParseKeyValue>;
export interface ParseRoute53 {
  source?: string;
}
export const ParseRoute53 = S.suspend(() =>
  S.Struct({ source: S.optional(S.String) }),
).annotations({ identifier: "ParseRoute53" }) as any as S.Schema<ParseRoute53>;
export interface ParseToOCSF {
  source?: string;
  eventSource: string;
  ocsfVersion: string;
  mappingVersion?: string;
}
export const ParseToOCSF = S.suspend(() =>
  S.Struct({
    source: S.optional(S.String),
    eventSource: S.String,
    ocsfVersion: S.String,
    mappingVersion: S.optional(S.String),
  }),
).annotations({ identifier: "ParseToOCSF" }) as any as S.Schema<ParseToOCSF>;
export interface ParsePostgres {
  source?: string;
}
export const ParsePostgres = S.suspend(() =>
  S.Struct({ source: S.optional(S.String) }),
).annotations({
  identifier: "ParsePostgres",
}) as any as S.Schema<ParsePostgres>;
export interface ParseVPC {
  source?: string;
}
export const ParseVPC = S.suspend(() =>
  S.Struct({ source: S.optional(S.String) }),
).annotations({ identifier: "ParseVPC" }) as any as S.Schema<ParseVPC>;
export interface ParseWAF {
  source?: string;
}
export const ParseWAF = S.suspend(() =>
  S.Struct({ source: S.optional(S.String) }),
).annotations({ identifier: "ParseWAF" }) as any as S.Schema<ParseWAF>;
export interface RenameKeyEntry {
  key: string;
  renameTo: string;
  overwriteIfExists?: boolean;
}
export const RenameKeyEntry = S.suspend(() =>
  S.Struct({
    key: S.String,
    renameTo: S.String,
    overwriteIfExists: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "RenameKeyEntry",
}) as any as S.Schema<RenameKeyEntry>;
export type RenameKeyEntries = RenameKeyEntry[];
export const RenameKeyEntries = S.Array(RenameKeyEntry);
export interface RenameKeys {
  entries: RenameKeyEntries;
}
export const RenameKeys = S.suspend(() =>
  S.Struct({ entries: RenameKeyEntries }),
).annotations({ identifier: "RenameKeys" }) as any as S.Schema<RenameKeys>;
export interface SplitStringEntry {
  source: string;
  delimiter: string;
}
export const SplitStringEntry = S.suspend(() =>
  S.Struct({ source: S.String, delimiter: S.String }),
).annotations({
  identifier: "SplitStringEntry",
}) as any as S.Schema<SplitStringEntry>;
export type SplitStringEntries = SplitStringEntry[];
export const SplitStringEntries = S.Array(SplitStringEntry);
export interface SplitString {
  entries: SplitStringEntries;
}
export const SplitString = S.suspend(() =>
  S.Struct({ entries: SplitStringEntries }),
).annotations({ identifier: "SplitString" }) as any as S.Schema<SplitString>;
export interface SubstituteStringEntry {
  source: string;
  from: string;
  to: string;
}
export const SubstituteStringEntry = S.suspend(() =>
  S.Struct({ source: S.String, from: S.String, to: S.String }),
).annotations({
  identifier: "SubstituteStringEntry",
}) as any as S.Schema<SubstituteStringEntry>;
export type SubstituteStringEntries = SubstituteStringEntry[];
export const SubstituteStringEntries = S.Array(SubstituteStringEntry);
export interface SubstituteString {
  entries: SubstituteStringEntries;
}
export const SubstituteString = S.suspend(() =>
  S.Struct({ entries: SubstituteStringEntries }),
).annotations({
  identifier: "SubstituteString",
}) as any as S.Schema<SubstituteString>;
export type TrimStringWithKeys = string[];
export const TrimStringWithKeys = S.Array(S.String);
export interface TrimString {
  withKeys: TrimStringWithKeys;
}
export const TrimString = S.suspend(() =>
  S.Struct({ withKeys: TrimStringWithKeys }),
).annotations({ identifier: "TrimString" }) as any as S.Schema<TrimString>;
export interface TypeConverterEntry {
  key: string;
  type: string;
}
export const TypeConverterEntry = S.suspend(() =>
  S.Struct({ key: S.String, type: S.String }),
).annotations({
  identifier: "TypeConverterEntry",
}) as any as S.Schema<TypeConverterEntry>;
export type TypeConverterEntries = TypeConverterEntry[];
export const TypeConverterEntries = S.Array(TypeConverterEntry);
export interface TypeConverter {
  entries: TypeConverterEntries;
}
export const TypeConverter = S.suspend(() =>
  S.Struct({ entries: TypeConverterEntries }),
).annotations({
  identifier: "TypeConverter",
}) as any as S.Schema<TypeConverter>;
export type UpperCaseStringWithKeys = string[];
export const UpperCaseStringWithKeys = S.Array(S.String);
export interface UpperCaseString {
  withKeys: UpperCaseStringWithKeys;
}
export const UpperCaseString = S.suspend(() =>
  S.Struct({ withKeys: UpperCaseStringWithKeys }),
).annotations({
  identifier: "UpperCaseString",
}) as any as S.Schema<UpperCaseString>;
export interface Processor {
  addKeys?: AddKeys;
  copyValue?: CopyValue;
  csv?: CSV;
  dateTimeConverter?: DateTimeConverter;
  deleteKeys?: DeleteKeys;
  grok?: Grok;
  listToMap?: ListToMap;
  lowerCaseString?: LowerCaseString;
  moveKeys?: MoveKeys;
  parseCloudfront?: ParseCloudfront;
  parseJSON?: ParseJSON;
  parseKeyValue?: ParseKeyValue;
  parseRoute53?: ParseRoute53;
  parseToOCSF?: ParseToOCSF;
  parsePostgres?: ParsePostgres;
  parseVPC?: ParseVPC;
  parseWAF?: ParseWAF;
  renameKeys?: RenameKeys;
  splitString?: SplitString;
  substituteString?: SubstituteString;
  trimString?: TrimString;
  typeConverter?: TypeConverter;
  upperCaseString?: UpperCaseString;
}
export const Processor = S.suspend(() =>
  S.Struct({
    addKeys: S.optional(AddKeys),
    copyValue: S.optional(CopyValue),
    csv: S.optional(CSV),
    dateTimeConverter: S.optional(DateTimeConverter),
    deleteKeys: S.optional(DeleteKeys),
    grok: S.optional(Grok),
    listToMap: S.optional(ListToMap),
    lowerCaseString: S.optional(LowerCaseString),
    moveKeys: S.optional(MoveKeys),
    parseCloudfront: S.optional(ParseCloudfront),
    parseJSON: S.optional(ParseJSON),
    parseKeyValue: S.optional(ParseKeyValue),
    parseRoute53: S.optional(ParseRoute53),
    parseToOCSF: S.optional(ParseToOCSF),
    parsePostgres: S.optional(ParsePostgres),
    parseVPC: S.optional(ParseVPC),
    parseWAF: S.optional(ParseWAF),
    renameKeys: S.optional(RenameKeys),
    splitString: S.optional(SplitString),
    substituteString: S.optional(SubstituteString),
    trimString: S.optional(TrimString),
    typeConverter: S.optional(TypeConverter),
    upperCaseString: S.optional(UpperCaseString),
  }),
).annotations({ identifier: "Processor" }) as any as S.Schema<Processor>;
export type Processors = Processor[];
export const Processors = S.Array(Processor);
export interface TestTransformerRequest {
  transformerConfig: Processors;
  logEventMessages: TestEventMessages;
}
export const TestTransformerRequest = S.suspend(() =>
  S.Struct({
    transformerConfig: Processors,
    logEventMessages: TestEventMessages,
  }).pipe(
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
  identifier: "TestTransformerRequest",
}) as any as S.Schema<TestTransformerRequest>;
export interface UntagLogGroupRequest {
  logGroupName: string;
  tags: TagList;
}
export const UntagLogGroupRequest = S.suspend(() =>
  S.Struct({ logGroupName: S.String, tags: TagList }).pipe(
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
  identifier: "UntagLogGroupRequest",
}) as any as S.Schema<UntagLogGroupRequest>;
export interface UntagLogGroupResponse {}
export const UntagLogGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagLogGroupResponse",
}) as any as S.Schema<UntagLogGroupResponse>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tagKeys: TagKeyList }).pipe(
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
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface S3DeliveryConfiguration {
  suffixPath?: string;
  enableHiveCompatiblePath?: boolean;
}
export const S3DeliveryConfiguration = S.suspend(() =>
  S.Struct({
    suffixPath: S.optional(S.String),
    enableHiveCompatiblePath: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "S3DeliveryConfiguration",
}) as any as S.Schema<S3DeliveryConfiguration>;
export interface UpdateDeliveryConfigurationRequest {
  id: string;
  recordFields?: RecordFields;
  fieldDelimiter?: string;
  s3DeliveryConfiguration?: S3DeliveryConfiguration;
}
export const UpdateDeliveryConfigurationRequest = S.suspend(() =>
  S.Struct({
    id: S.String,
    recordFields: S.optional(RecordFields),
    fieldDelimiter: S.optional(S.String),
    s3DeliveryConfiguration: S.optional(S3DeliveryConfiguration),
  }).pipe(
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
  identifier: "UpdateDeliveryConfigurationRequest",
}) as any as S.Schema<UpdateDeliveryConfigurationRequest>;
export interface UpdateDeliveryConfigurationResponse {}
export const UpdateDeliveryConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateDeliveryConfigurationResponse",
}) as any as S.Schema<UpdateDeliveryConfigurationResponse>;
export interface UpdateLogAnomalyDetectorRequest {
  anomalyDetectorArn: string;
  evaluationFrequency?: string;
  filterPattern?: string;
  anomalyVisibilityTime?: number;
  enabled: boolean;
}
export const UpdateLogAnomalyDetectorRequest = S.suspend(() =>
  S.Struct({
    anomalyDetectorArn: S.String,
    evaluationFrequency: S.optional(S.String),
    filterPattern: S.optional(S.String),
    anomalyVisibilityTime: S.optional(S.Number),
    enabled: S.Boolean,
  }).pipe(
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
  identifier: "UpdateLogAnomalyDetectorRequest",
}) as any as S.Schema<UpdateLogAnomalyDetectorRequest>;
export interface UpdateLogAnomalyDetectorResponse {}
export const UpdateLogAnomalyDetectorResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateLogAnomalyDetectorResponse",
}) as any as S.Schema<UpdateLogAnomalyDetectorResponse>;
export interface S3Configuration {
  destinationIdentifier: string;
  roleArn: string;
}
export const S3Configuration = S.suspend(() =>
  S.Struct({ destinationIdentifier: S.String, roleArn: S.String }),
).annotations({
  identifier: "S3Configuration",
}) as any as S.Schema<S3Configuration>;
export interface DestinationConfiguration {
  s3Configuration: S3Configuration;
}
export const DestinationConfiguration = S.suspend(() =>
  S.Struct({ s3Configuration: S3Configuration }),
).annotations({
  identifier: "DestinationConfiguration",
}) as any as S.Schema<DestinationConfiguration>;
export interface UpdateScheduledQueryRequest {
  identifier: string;
  description?: string;
  queryLanguage: string;
  queryString: string;
  logGroupIdentifiers?: ScheduledQueryLogGroupIdentifiers;
  scheduleExpression: string;
  timezone?: string;
  startTimeOffset?: number;
  destinationConfiguration?: DestinationConfiguration;
  scheduleStartTime?: number;
  scheduleEndTime?: number;
  executionRoleArn: string;
  state?: string;
}
export const UpdateScheduledQueryRequest = S.suspend(() =>
  S.Struct({
    identifier: S.String,
    description: S.optional(S.String),
    queryLanguage: S.String,
    queryString: S.String,
    logGroupIdentifiers: S.optional(ScheduledQueryLogGroupIdentifiers),
    scheduleExpression: S.String,
    timezone: S.optional(S.String),
    startTimeOffset: S.optional(S.Number),
    destinationConfiguration: S.optional(DestinationConfiguration),
    scheduleStartTime: S.optional(S.Number),
    scheduleEndTime: S.optional(S.Number),
    executionRoleArn: S.String,
    state: S.optional(S.String),
  }).pipe(
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
  identifier: "UpdateScheduledQueryRequest",
}) as any as S.Schema<UpdateScheduledQueryRequest>;
export interface DataSource {
  name: string;
  type?: string;
}
export const DataSource = S.suspend(() =>
  S.Struct({ name: S.String, type: S.optional(S.String) }),
).annotations({ identifier: "DataSource" }) as any as S.Schema<DataSource>;
export interface ImportFilter {
  startEventTime?: number;
  endEventTime?: number;
}
export const ImportFilter = S.suspend(() =>
  S.Struct({
    startEventTime: S.optional(S.Number),
    endEventTime: S.optional(S.Number),
  }),
).annotations({ identifier: "ImportFilter" }) as any as S.Schema<ImportFilter>;
export interface DeliveryDestinationConfiguration {
  destinationResourceArn: string;
}
export const DeliveryDestinationConfiguration = S.suspend(() =>
  S.Struct({ destinationResourceArn: S.String }),
).annotations({
  identifier: "DeliveryDestinationConfiguration",
}) as any as S.Schema<DeliveryDestinationConfiguration>;
export interface InputLogEvent {
  timestamp: number;
  message: string;
}
export const InputLogEvent = S.suspend(() =>
  S.Struct({ timestamp: S.Number, message: S.String }),
).annotations({
  identifier: "InputLogEvent",
}) as any as S.Schema<InputLogEvent>;
export type InputLogEvents = InputLogEvent[];
export const InputLogEvents = S.Array(InputLogEvent);
export interface SuppressionPeriod {
  value?: number;
  suppressionUnit?: string;
}
export const SuppressionPeriod = S.suspend(() =>
  S.Struct({
    value: S.optional(S.Number),
    suppressionUnit: S.optional(S.String),
  }),
).annotations({
  identifier: "SuppressionPeriod",
}) as any as S.Schema<SuppressionPeriod>;
export type DashboardViewerPrincipals = string[];
export const DashboardViewerPrincipals = S.Array(S.String);
export interface AssociateSourceToS3TableIntegrationRequest {
  integrationArn: string;
  dataSource: DataSource;
}
export const AssociateSourceToS3TableIntegrationRequest = S.suspend(() =>
  S.Struct({ integrationArn: S.String, dataSource: DataSource }).pipe(
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
  identifier: "AssociateSourceToS3TableIntegrationRequest",
}) as any as S.Schema<AssociateSourceToS3TableIntegrationRequest>;
export interface CreateDeliveryRequest {
  deliverySourceName: string;
  deliveryDestinationArn: string;
  recordFields?: RecordFields;
  fieldDelimiter?: string;
  s3DeliveryConfiguration?: S3DeliveryConfiguration;
  tags?: Tags;
}
export const CreateDeliveryRequest = S.suspend(() =>
  S.Struct({
    deliverySourceName: S.String,
    deliveryDestinationArn: S.String,
    recordFields: S.optional(RecordFields),
    fieldDelimiter: S.optional(S.String),
    s3DeliveryConfiguration: S.optional(S3DeliveryConfiguration),
    tags: S.optional(Tags),
  }).pipe(
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
  identifier: "CreateDeliveryRequest",
}) as any as S.Schema<CreateDeliveryRequest>;
export interface CreateExportTaskResponse {
  taskId?: string;
}
export const CreateExportTaskResponse = S.suspend(() =>
  S.Struct({ taskId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateExportTaskResponse",
}) as any as S.Schema<CreateExportTaskResponse>;
export interface CreateImportTaskRequest {
  importSourceArn: string;
  importRoleArn: string;
  importFilter?: ImportFilter;
}
export const CreateImportTaskRequest = S.suspend(() =>
  S.Struct({
    importSourceArn: S.String,
    importRoleArn: S.String,
    importFilter: S.optional(ImportFilter),
  }).pipe(
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
  identifier: "CreateImportTaskRequest",
}) as any as S.Schema<CreateImportTaskRequest>;
export interface CreateLogAnomalyDetectorResponse {
  anomalyDetectorArn?: string;
}
export const CreateLogAnomalyDetectorResponse = S.suspend(() =>
  S.Struct({ anomalyDetectorArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateLogAnomalyDetectorResponse",
}) as any as S.Schema<CreateLogAnomalyDetectorResponse>;
export interface DeleteQueryDefinitionResponse {
  success?: boolean;
}
export const DeleteQueryDefinitionResponse = S.suspend(() =>
  S.Struct({ success: S.optional(S.Boolean) }).pipe(ns),
).annotations({
  identifier: "DeleteQueryDefinitionResponse",
}) as any as S.Schema<DeleteQueryDefinitionResponse>;
export interface DisassociateSourceFromS3TableIntegrationResponse {
  identifier?: string;
}
export const DisassociateSourceFromS3TableIntegrationResponse = S.suspend(() =>
  S.Struct({ identifier: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DisassociateSourceFromS3TableIntegrationResponse",
}) as any as S.Schema<DisassociateSourceFromS3TableIntegrationResponse>;
export interface GetDataProtectionPolicyResponse {
  logGroupIdentifier?: string;
  policyDocument?: string;
  lastUpdatedTime?: number;
}
export const GetDataProtectionPolicyResponse = S.suspend(() =>
  S.Struct({
    logGroupIdentifier: S.optional(S.String),
    policyDocument: S.optional(S.String),
    lastUpdatedTime: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "GetDataProtectionPolicyResponse",
}) as any as S.Schema<GetDataProtectionPolicyResponse>;
export interface Delivery {
  id?: string;
  arn?: string;
  deliverySourceName?: string;
  deliveryDestinationArn?: string;
  deliveryDestinationType?: string;
  recordFields?: RecordFields;
  fieldDelimiter?: string;
  s3DeliveryConfiguration?: S3DeliveryConfiguration;
  tags?: Tags;
}
export const Delivery = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    deliverySourceName: S.optional(S.String),
    deliveryDestinationArn: S.optional(S.String),
    deliveryDestinationType: S.optional(S.String),
    recordFields: S.optional(RecordFields),
    fieldDelimiter: S.optional(S.String),
    s3DeliveryConfiguration: S.optional(S3DeliveryConfiguration),
    tags: S.optional(Tags),
  }),
).annotations({ identifier: "Delivery" }) as any as S.Schema<Delivery>;
export interface GetDeliveryResponse {
  delivery?: Delivery;
}
export const GetDeliveryResponse = S.suspend(() =>
  S.Struct({ delivery: S.optional(Delivery) }).pipe(ns),
).annotations({
  identifier: "GetDeliveryResponse",
}) as any as S.Schema<GetDeliveryResponse>;
export interface DeliveryDestination {
  name?: string;
  arn?: string;
  deliveryDestinationType?: string;
  outputFormat?: string;
  deliveryDestinationConfiguration?: DeliveryDestinationConfiguration;
  tags?: Tags;
}
export const DeliveryDestination = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    deliveryDestinationType: S.optional(S.String),
    outputFormat: S.optional(S.String),
    deliveryDestinationConfiguration: S.optional(
      DeliveryDestinationConfiguration,
    ),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "DeliveryDestination",
}) as any as S.Schema<DeliveryDestination>;
export interface GetDeliveryDestinationResponse {
  deliveryDestination?: DeliveryDestination;
}
export const GetDeliveryDestinationResponse = S.suspend(() =>
  S.Struct({ deliveryDestination: S.optional(DeliveryDestination) }).pipe(ns),
).annotations({
  identifier: "GetDeliveryDestinationResponse",
}) as any as S.Schema<GetDeliveryDestinationResponse>;
export type ResourceArns = string[];
export const ResourceArns = S.Array(S.String);
export interface DeliverySource {
  name?: string;
  arn?: string;
  resourceArns?: ResourceArns;
  service?: string;
  logType?: string;
  tags?: Tags;
}
export const DeliverySource = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    resourceArns: S.optional(ResourceArns),
    service: S.optional(S.String),
    logType: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "DeliverySource",
}) as any as S.Schema<DeliverySource>;
export interface GetDeliverySourceResponse {
  deliverySource?: DeliverySource;
}
export const GetDeliverySourceResponse = S.suspend(() =>
  S.Struct({ deliverySource: S.optional(DeliverySource) }).pipe(ns),
).annotations({
  identifier: "GetDeliverySourceResponse",
}) as any as S.Schema<GetDeliverySourceResponse>;
export interface GetLogAnomalyDetectorResponse {
  detectorName?: string;
  logGroupArnList?: LogGroupArnList;
  evaluationFrequency?: string;
  filterPattern?: string;
  anomalyDetectorStatus?: string;
  kmsKeyId?: string;
  creationTimeStamp?: number;
  lastModifiedTimeStamp?: number;
  anomalyVisibilityTime?: number;
}
export const GetLogAnomalyDetectorResponse = S.suspend(() =>
  S.Struct({
    detectorName: S.optional(S.String),
    logGroupArnList: S.optional(LogGroupArnList),
    evaluationFrequency: S.optional(S.String),
    filterPattern: S.optional(S.String),
    anomalyDetectorStatus: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    creationTimeStamp: S.optional(S.Number),
    lastModifiedTimeStamp: S.optional(S.Number),
    anomalyVisibilityTime: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "GetLogAnomalyDetectorResponse",
}) as any as S.Schema<GetLogAnomalyDetectorResponse>;
export interface GetScheduledQueryResponse {
  scheduledQueryArn?: string;
  name?: string;
  description?: string;
  queryLanguage?: string;
  queryString?: string;
  logGroupIdentifiers?: ScheduledQueryLogGroupIdentifiers;
  scheduleExpression?: string;
  timezone?: string;
  startTimeOffset?: number;
  destinationConfiguration?: DestinationConfiguration;
  state?: string;
  lastTriggeredTime?: number;
  lastExecutionStatus?: string;
  scheduleStartTime?: number;
  scheduleEndTime?: number;
  executionRoleArn?: string;
  creationTime?: number;
  lastUpdatedTime?: number;
}
export const GetScheduledQueryResponse = S.suspend(() =>
  S.Struct({
    scheduledQueryArn: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    queryLanguage: S.optional(S.String),
    queryString: S.optional(S.String),
    logGroupIdentifiers: S.optional(ScheduledQueryLogGroupIdentifiers),
    scheduleExpression: S.optional(S.String),
    timezone: S.optional(S.String),
    startTimeOffset: S.optional(S.Number),
    destinationConfiguration: S.optional(DestinationConfiguration),
    state: S.optional(S.String),
    lastTriggeredTime: S.optional(S.Number),
    lastExecutionStatus: S.optional(S.String),
    scheduleStartTime: S.optional(S.Number),
    scheduleEndTime: S.optional(S.Number),
    executionRoleArn: S.optional(S.String),
    creationTime: S.optional(S.Number),
    lastUpdatedTime: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "GetScheduledQueryResponse",
}) as any as S.Schema<GetScheduledQueryResponse>;
export interface GetTransformerResponse {
  logGroupIdentifier?: string;
  creationTime?: number;
  lastModifiedTime?: number;
  transformerConfig?: Processors;
}
export const GetTransformerResponse = S.suspend(() =>
  S.Struct({
    logGroupIdentifier: S.optional(S.String),
    creationTime: S.optional(S.Number),
    lastModifiedTime: S.optional(S.Number),
    transformerConfig: S.optional(Processors),
  }).pipe(ns),
).annotations({
  identifier: "GetTransformerResponse",
}) as any as S.Schema<GetTransformerResponse>;
export interface ListAggregateLogGroupSummariesRequest {
  accountIdentifiers?: AccountIds;
  includeLinkedAccounts?: boolean;
  logGroupClass?: string;
  logGroupNamePattern?: string;
  dataSources?: DataSourceFilters;
  groupBy: string;
  nextToken?: string;
  limit?: number;
}
export const ListAggregateLogGroupSummariesRequest = S.suspend(() =>
  S.Struct({
    accountIdentifiers: S.optional(AccountIds),
    includeLinkedAccounts: S.optional(S.Boolean),
    logGroupClass: S.optional(S.String),
    logGroupNamePattern: S.optional(S.String),
    dataSources: S.optional(DataSourceFilters),
    groupBy: S.String,
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
  }).pipe(
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
  identifier: "ListAggregateLogGroupSummariesRequest",
}) as any as S.Schema<ListAggregateLogGroupSummariesRequest>;
export interface ListLogGroupsForQueryResponse {
  logGroupIdentifiers?: LogGroupIdentifiers;
  nextToken?: string;
}
export const ListLogGroupsForQueryResponse = S.suspend(() =>
  S.Struct({
    logGroupIdentifiers: S.optional(LogGroupIdentifiers),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListLogGroupsForQueryResponse",
}) as any as S.Schema<ListLogGroupsForQueryResponse>;
export interface ListTagsForResourceResponse {
  tags?: Tags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(Tags) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ListTagsLogGroupResponse {
  tags?: Tags;
}
export const ListTagsLogGroupResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(Tags) }).pipe(ns),
).annotations({
  identifier: "ListTagsLogGroupResponse",
}) as any as S.Schema<ListTagsLogGroupResponse>;
export interface AccountPolicy {
  policyName?: string;
  policyDocument?: string;
  lastUpdatedTime?: number;
  policyType?: string;
  scope?: string;
  selectionCriteria?: string;
  accountId?: string;
}
export const AccountPolicy = S.suspend(() =>
  S.Struct({
    policyName: S.optional(S.String),
    policyDocument: S.optional(S.String),
    lastUpdatedTime: S.optional(S.Number),
    policyType: S.optional(S.String),
    scope: S.optional(S.String),
    selectionCriteria: S.optional(S.String),
    accountId: S.optional(S.String),
  }),
).annotations({
  identifier: "AccountPolicy",
}) as any as S.Schema<AccountPolicy>;
export interface PutAccountPolicyResponse {
  accountPolicy?: AccountPolicy;
}
export const PutAccountPolicyResponse = S.suspend(() =>
  S.Struct({ accountPolicy: S.optional(AccountPolicy) }).pipe(ns),
).annotations({
  identifier: "PutAccountPolicyResponse",
}) as any as S.Schema<PutAccountPolicyResponse>;
export interface PutDataProtectionPolicyResponse {
  logGroupIdentifier?: string;
  policyDocument?: string;
  lastUpdatedTime?: number;
}
export const PutDataProtectionPolicyResponse = S.suspend(() =>
  S.Struct({
    logGroupIdentifier: S.optional(S.String),
    policyDocument: S.optional(S.String),
    lastUpdatedTime: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "PutDataProtectionPolicyResponse",
}) as any as S.Schema<PutDataProtectionPolicyResponse>;
export interface PutDeliveryDestinationRequest {
  name: string;
  outputFormat?: string;
  deliveryDestinationConfiguration?: DeliveryDestinationConfiguration;
  deliveryDestinationType?: string;
  tags?: Tags;
}
export const PutDeliveryDestinationRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    outputFormat: S.optional(S.String),
    deliveryDestinationConfiguration: S.optional(
      DeliveryDestinationConfiguration,
    ),
    deliveryDestinationType: S.optional(S.String),
    tags: S.optional(Tags),
  }).pipe(
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
  identifier: "PutDeliveryDestinationRequest",
}) as any as S.Schema<PutDeliveryDestinationRequest>;
export interface Policy {
  deliveryDestinationPolicy?: string;
}
export const Policy = S.suspend(() =>
  S.Struct({ deliveryDestinationPolicy: S.optional(S.String) }),
).annotations({ identifier: "Policy" }) as any as S.Schema<Policy>;
export interface PutDeliveryDestinationPolicyResponse {
  policy?: Policy;
}
export const PutDeliveryDestinationPolicyResponse = S.suspend(() =>
  S.Struct({ policy: S.optional(Policy) }).pipe(ns),
).annotations({
  identifier: "PutDeliveryDestinationPolicyResponse",
}) as any as S.Schema<PutDeliveryDestinationPolicyResponse>;
export interface PutDeliverySourceResponse {
  deliverySource?: DeliverySource;
}
export const PutDeliverySourceResponse = S.suspend(() =>
  S.Struct({ deliverySource: S.optional(DeliverySource) }).pipe(ns),
).annotations({
  identifier: "PutDeliverySourceResponse",
}) as any as S.Schema<PutDeliverySourceResponse>;
export interface Destination {
  destinationName?: string;
  targetArn?: string;
  roleArn?: string;
  accessPolicy?: string;
  arn?: string;
  creationTime?: number;
}
export const Destination = S.suspend(() =>
  S.Struct({
    destinationName: S.optional(S.String),
    targetArn: S.optional(S.String),
    roleArn: S.optional(S.String),
    accessPolicy: S.optional(S.String),
    arn: S.optional(S.String),
    creationTime: S.optional(S.Number),
  }),
).annotations({ identifier: "Destination" }) as any as S.Schema<Destination>;
export interface PutDestinationResponse {
  destination?: Destination;
}
export const PutDestinationResponse = S.suspend(() =>
  S.Struct({ destination: S.optional(Destination) }).pipe(ns),
).annotations({
  identifier: "PutDestinationResponse",
}) as any as S.Schema<PutDestinationResponse>;
export interface IndexPolicy {
  logGroupIdentifier?: string;
  lastUpdateTime?: number;
  policyDocument?: string;
  policyName?: string;
  source?: string;
}
export const IndexPolicy = S.suspend(() =>
  S.Struct({
    logGroupIdentifier: S.optional(S.String),
    lastUpdateTime: S.optional(S.Number),
    policyDocument: S.optional(S.String),
    policyName: S.optional(S.String),
    source: S.optional(S.String),
  }),
).annotations({ identifier: "IndexPolicy" }) as any as S.Schema<IndexPolicy>;
export interface PutIndexPolicyResponse {
  indexPolicy?: IndexPolicy;
}
export const PutIndexPolicyResponse = S.suspend(() =>
  S.Struct({ indexPolicy: S.optional(IndexPolicy) }).pipe(ns),
).annotations({
  identifier: "PutIndexPolicyResponse",
}) as any as S.Schema<PutIndexPolicyResponse>;
export interface PutQueryDefinitionResponse {
  queryDefinitionId?: string;
}
export const PutQueryDefinitionResponse = S.suspend(() =>
  S.Struct({ queryDefinitionId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "PutQueryDefinitionResponse",
}) as any as S.Schema<PutQueryDefinitionResponse>;
export interface ResourcePolicy {
  policyName?: string;
  policyDocument?: string;
  lastUpdatedTime?: number;
  policyScope?: string;
  resourceArn?: string;
  revisionId?: string;
}
export const ResourcePolicy = S.suspend(() =>
  S.Struct({
    policyName: S.optional(S.String),
    policyDocument: S.optional(S.String),
    lastUpdatedTime: S.optional(S.Number),
    policyScope: S.optional(S.String),
    resourceArn: S.optional(S.String),
    revisionId: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourcePolicy",
}) as any as S.Schema<ResourcePolicy>;
export interface PutResourcePolicyResponse {
  resourcePolicy?: ResourcePolicy;
  revisionId?: string;
}
export const PutResourcePolicyResponse = S.suspend(() =>
  S.Struct({
    resourcePolicy: S.optional(ResourcePolicy),
    revisionId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "PutResourcePolicyResponse",
}) as any as S.Schema<PutResourcePolicyResponse>;
export interface StartQueryResponse {
  queryId?: string;
}
export const StartQueryResponse = S.suspend(() =>
  S.Struct({ queryId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "StartQueryResponse",
}) as any as S.Schema<StartQueryResponse>;
export interface StopQueryResponse {
  success?: boolean;
}
export const StopQueryResponse = S.suspend(() =>
  S.Struct({ success: S.optional(S.Boolean) }).pipe(ns),
).annotations({
  identifier: "StopQueryResponse",
}) as any as S.Schema<StopQueryResponse>;
export interface UpdateAnomalyRequest {
  anomalyId?: string;
  patternId?: string;
  anomalyDetectorArn: string;
  suppressionType?: string;
  suppressionPeriod?: SuppressionPeriod;
  baseline?: boolean;
}
export const UpdateAnomalyRequest = S.suspend(() =>
  S.Struct({
    anomalyId: S.optional(S.String),
    patternId: S.optional(S.String),
    anomalyDetectorArn: S.String,
    suppressionType: S.optional(S.String),
    suppressionPeriod: S.optional(SuppressionPeriod),
    baseline: S.optional(S.Boolean),
  }).pipe(
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
  identifier: "UpdateAnomalyRequest",
}) as any as S.Schema<UpdateAnomalyRequest>;
export interface UpdateAnomalyResponse {}
export const UpdateAnomalyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateAnomalyResponse",
}) as any as S.Schema<UpdateAnomalyResponse>;
export interface UpdateScheduledQueryResponse {
  scheduledQueryArn?: string;
  name?: string;
  description?: string;
  queryLanguage?: string;
  queryString?: string;
  logGroupIdentifiers?: ScheduledQueryLogGroupIdentifiers;
  scheduleExpression?: string;
  timezone?: string;
  startTimeOffset?: number;
  destinationConfiguration?: DestinationConfiguration;
  state?: string;
  lastTriggeredTime?: number;
  lastExecutionStatus?: string;
  scheduleStartTime?: number;
  scheduleEndTime?: number;
  executionRoleArn?: string;
  creationTime?: number;
  lastUpdatedTime?: number;
}
export const UpdateScheduledQueryResponse = S.suspend(() =>
  S.Struct({
    scheduledQueryArn: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    queryLanguage: S.optional(S.String),
    queryString: S.optional(S.String),
    logGroupIdentifiers: S.optional(ScheduledQueryLogGroupIdentifiers),
    scheduleExpression: S.optional(S.String),
    timezone: S.optional(S.String),
    startTimeOffset: S.optional(S.Number),
    destinationConfiguration: S.optional(DestinationConfiguration),
    state: S.optional(S.String),
    lastTriggeredTime: S.optional(S.Number),
    lastExecutionStatus: S.optional(S.String),
    scheduleStartTime: S.optional(S.Number),
    scheduleEndTime: S.optional(S.Number),
    executionRoleArn: S.optional(S.String),
    creationTime: S.optional(S.Number),
    lastUpdatedTime: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "UpdateScheduledQueryResponse",
}) as any as S.Schema<UpdateScheduledQueryResponse>;
export type OutputFormats = string[];
export const OutputFormats = S.Array(S.String);
export type AllowedFieldDelimiters = string[];
export const AllowedFieldDelimiters = S.Array(S.String);
export type InheritedProperties = string[];
export const InheritedProperties = S.Array(S.String);
export interface OpenSearchResourceConfig {
  kmsKeyArn?: string;
  dataSourceRoleArn: string;
  dashboardViewerPrincipals: DashboardViewerPrincipals;
  applicationArn?: string;
  retentionDays: number;
}
export const OpenSearchResourceConfig = S.suspend(() =>
  S.Struct({
    kmsKeyArn: S.optional(S.String),
    dataSourceRoleArn: S.String,
    dashboardViewerPrincipals: DashboardViewerPrincipals,
    applicationArn: S.optional(S.String),
    retentionDays: S.Number,
  }),
).annotations({
  identifier: "OpenSearchResourceConfig",
}) as any as S.Schema<OpenSearchResourceConfig>;
export type EntityKeyAttributes = { [key: string]: string };
export const EntityKeyAttributes = S.Record({ key: S.String, value: S.String });
export type EntityAttributes = { [key: string]: string };
export const EntityAttributes = S.Record({ key: S.String, value: S.String });
export type Dimensions = { [key: string]: string };
export const Dimensions = S.Record({ key: S.String, value: S.String });
export interface ImportStatistics {
  bytesImported?: number;
}
export const ImportStatistics = S.suspend(() =>
  S.Struct({ bytesImported: S.optional(S.Number) }),
).annotations({
  identifier: "ImportStatistics",
}) as any as S.Schema<ImportStatistics>;
export type AccountPolicies = AccountPolicy[];
export const AccountPolicies = S.Array(AccountPolicy);
export type Deliveries = Delivery[];
export const Deliveries = S.Array(Delivery);
export type DeliveryDestinations = DeliveryDestination[];
export const DeliveryDestinations = S.Array(DeliveryDestination);
export type DeliverySources = DeliverySource[];
export const DeliverySources = S.Array(DeliverySource);
export type Destinations = Destination[];
export const Destinations = S.Array(Destination);
export interface FieldIndex {
  logGroupIdentifier?: string;
  fieldIndexName?: string;
  lastScanTime?: number;
  firstEventTime?: number;
  lastEventTime?: number;
  type?: string;
}
export const FieldIndex = S.suspend(() =>
  S.Struct({
    logGroupIdentifier: S.optional(S.String),
    fieldIndexName: S.optional(S.String),
    lastScanTime: S.optional(S.Number),
    firstEventTime: S.optional(S.Number),
    lastEventTime: S.optional(S.Number),
    type: S.optional(S.String),
  }),
).annotations({ identifier: "FieldIndex" }) as any as S.Schema<FieldIndex>;
export type FieldIndexes = FieldIndex[];
export const FieldIndexes = S.Array(FieldIndex);
export interface ImportBatch {
  batchId: string;
  status: string;
  errorMessage?: string;
}
export const ImportBatch = S.suspend(() =>
  S.Struct({
    batchId: S.String,
    status: S.String,
    errorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "ImportBatch" }) as any as S.Schema<ImportBatch>;
export type ImportBatchList = ImportBatch[];
export const ImportBatchList = S.Array(ImportBatch);
export interface Import {
  importId?: string;
  importSourceArn?: string;
  importStatus?: string;
  importDestinationArn?: string;
  importStatistics?: ImportStatistics;
  importFilter?: ImportFilter;
  creationTime?: number;
  lastUpdatedTime?: number;
  errorMessage?: string;
}
export const Import = S.suspend(() =>
  S.Struct({
    importId: S.optional(S.String),
    importSourceArn: S.optional(S.String),
    importStatus: S.optional(S.String),
    importDestinationArn: S.optional(S.String),
    importStatistics: S.optional(ImportStatistics),
    importFilter: S.optional(ImportFilter),
    creationTime: S.optional(S.Number),
    lastUpdatedTime: S.optional(S.Number),
    errorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "Import" }) as any as S.Schema<Import>;
export type ImportList = Import[];
export const ImportList = S.Array(Import);
export type IndexPolicies = IndexPolicy[];
export const IndexPolicies = S.Array(IndexPolicy);
export interface LogGroup {
  logGroupName?: string;
  creationTime?: number;
  retentionInDays?: number;
  metricFilterCount?: number;
  arn?: string;
  storedBytes?: number;
  kmsKeyId?: string;
  dataProtectionStatus?: string;
  inheritedProperties?: InheritedProperties;
  logGroupClass?: string;
  logGroupArn?: string;
  deletionProtectionEnabled?: boolean;
}
export const LogGroup = S.suspend(() =>
  S.Struct({
    logGroupName: S.optional(S.String),
    creationTime: S.optional(S.Number),
    retentionInDays: S.optional(S.Number),
    metricFilterCount: S.optional(S.Number),
    arn: S.optional(S.String),
    storedBytes: S.optional(S.Number),
    kmsKeyId: S.optional(S.String),
    dataProtectionStatus: S.optional(S.String),
    inheritedProperties: S.optional(InheritedProperties),
    logGroupClass: S.optional(S.String),
    logGroupArn: S.optional(S.String),
    deletionProtectionEnabled: S.optional(S.Boolean),
  }),
).annotations({ identifier: "LogGroup" }) as any as S.Schema<LogGroup>;
export type LogGroups = LogGroup[];
export const LogGroups = S.Array(LogGroup);
export interface LogStream {
  logStreamName?: string;
  creationTime?: number;
  firstEventTimestamp?: number;
  lastEventTimestamp?: number;
  lastIngestionTime?: number;
  uploadSequenceToken?: string;
  arn?: string;
  storedBytes?: number;
}
export const LogStream = S.suspend(() =>
  S.Struct({
    logStreamName: S.optional(S.String),
    creationTime: S.optional(S.Number),
    firstEventTimestamp: S.optional(S.Number),
    lastEventTimestamp: S.optional(S.Number),
    lastIngestionTime: S.optional(S.Number),
    uploadSequenceToken: S.optional(S.String),
    arn: S.optional(S.String),
    storedBytes: S.optional(S.Number),
  }),
).annotations({ identifier: "LogStream" }) as any as S.Schema<LogStream>;
export type LogStreams = LogStream[];
export const LogStreams = S.Array(LogStream);
export interface MetricTransformation {
  metricName: string;
  metricNamespace: string;
  metricValue: string;
  defaultValue?: number;
  dimensions?: Dimensions;
  unit?: string;
}
export const MetricTransformation = S.suspend(() =>
  S.Struct({
    metricName: S.String,
    metricNamespace: S.String,
    metricValue: S.String,
    defaultValue: S.optional(S.Number),
    dimensions: S.optional(Dimensions),
    unit: S.optional(S.String),
  }),
).annotations({
  identifier: "MetricTransformation",
}) as any as S.Schema<MetricTransformation>;
export type MetricTransformations = MetricTransformation[];
export const MetricTransformations = S.Array(MetricTransformation);
export interface MetricFilter {
  filterName?: string;
  filterPattern?: string;
  metricTransformations?: MetricTransformations;
  creationTime?: number;
  logGroupName?: string;
  applyOnTransformedLogs?: boolean;
  fieldSelectionCriteria?: string;
  emitSystemFieldDimensions?: EmitSystemFields;
}
export const MetricFilter = S.suspend(() =>
  S.Struct({
    filterName: S.optional(S.String),
    filterPattern: S.optional(S.String),
    metricTransformations: S.optional(MetricTransformations),
    creationTime: S.optional(S.Number),
    logGroupName: S.optional(S.String),
    applyOnTransformedLogs: S.optional(S.Boolean),
    fieldSelectionCriteria: S.optional(S.String),
    emitSystemFieldDimensions: S.optional(EmitSystemFields),
  }),
).annotations({ identifier: "MetricFilter" }) as any as S.Schema<MetricFilter>;
export type MetricFilters = MetricFilter[];
export const MetricFilters = S.Array(MetricFilter);
export interface QueryInfo {
  queryLanguage?: string;
  queryId?: string;
  queryString?: string;
  status?: string;
  createTime?: number;
  logGroupName?: string;
}
export const QueryInfo = S.suspend(() =>
  S.Struct({
    queryLanguage: S.optional(S.String),
    queryId: S.optional(S.String),
    queryString: S.optional(S.String),
    status: S.optional(S.String),
    createTime: S.optional(S.Number),
    logGroupName: S.optional(S.String),
  }),
).annotations({ identifier: "QueryInfo" }) as any as S.Schema<QueryInfo>;
export type QueryInfoList = QueryInfo[];
export const QueryInfoList = S.Array(QueryInfo);
export interface QueryDefinition {
  queryLanguage?: string;
  queryDefinitionId?: string;
  name?: string;
  queryString?: string;
  lastModified?: number;
  logGroupNames?: LogGroupNames;
}
export const QueryDefinition = S.suspend(() =>
  S.Struct({
    queryLanguage: S.optional(S.String),
    queryDefinitionId: S.optional(S.String),
    name: S.optional(S.String),
    queryString: S.optional(S.String),
    lastModified: S.optional(S.Number),
    logGroupNames: S.optional(LogGroupNames),
  }),
).annotations({
  identifier: "QueryDefinition",
}) as any as S.Schema<QueryDefinition>;
export type QueryDefinitionList = QueryDefinition[];
export const QueryDefinitionList = S.Array(QueryDefinition);
export type ResourcePolicies = ResourcePolicy[];
export const ResourcePolicies = S.Array(ResourcePolicy);
export interface SubscriptionFilter {
  filterName?: string;
  logGroupName?: string;
  filterPattern?: string;
  destinationArn?: string;
  roleArn?: string;
  distribution?: string;
  applyOnTransformedLogs?: boolean;
  creationTime?: number;
  fieldSelectionCriteria?: string;
  emitSystemFields?: EmitSystemFields;
}
export const SubscriptionFilter = S.suspend(() =>
  S.Struct({
    filterName: S.optional(S.String),
    logGroupName: S.optional(S.String),
    filterPattern: S.optional(S.String),
    destinationArn: S.optional(S.String),
    roleArn: S.optional(S.String),
    distribution: S.optional(S.String),
    applyOnTransformedLogs: S.optional(S.Boolean),
    creationTime: S.optional(S.Number),
    fieldSelectionCriteria: S.optional(S.String),
    emitSystemFields: S.optional(EmitSystemFields),
  }),
).annotations({
  identifier: "SubscriptionFilter",
}) as any as S.Schema<SubscriptionFilter>;
export type SubscriptionFilters = SubscriptionFilter[];
export const SubscriptionFilters = S.Array(SubscriptionFilter);
export interface FilteredLogEvent {
  logStreamName?: string;
  timestamp?: number;
  message?: string;
  ingestionTime?: number;
  eventId?: string;
}
export const FilteredLogEvent = S.suspend(() =>
  S.Struct({
    logStreamName: S.optional(S.String),
    timestamp: S.optional(S.Number),
    message: S.optional(S.String),
    ingestionTime: S.optional(S.Number),
    eventId: S.optional(S.String),
  }),
).annotations({
  identifier: "FilteredLogEvent",
}) as any as S.Schema<FilteredLogEvent>;
export type FilteredLogEvents = FilteredLogEvent[];
export const FilteredLogEvents = S.Array(FilteredLogEvent);
export interface SearchedLogStream {
  logStreamName?: string;
  searchedCompletely?: boolean;
}
export const SearchedLogStream = S.suspend(() =>
  S.Struct({
    logStreamName: S.optional(S.String),
    searchedCompletely: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SearchedLogStream",
}) as any as S.Schema<SearchedLogStream>;
export type SearchedLogStreams = SearchedLogStream[];
export const SearchedLogStreams = S.Array(SearchedLogStream);
export interface OutputLogEvent {
  timestamp?: number;
  message?: string;
  ingestionTime?: number;
}
export const OutputLogEvent = S.suspend(() =>
  S.Struct({
    timestamp: S.optional(S.Number),
    message: S.optional(S.String),
    ingestionTime: S.optional(S.Number),
  }),
).annotations({
  identifier: "OutputLogEvent",
}) as any as S.Schema<OutputLogEvent>;
export type OutputLogEvents = OutputLogEvent[];
export const OutputLogEvents = S.Array(OutputLogEvent);
export interface LogGroupField {
  name?: string;
  percent?: number;
}
export const LogGroupField = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), percent: S.optional(S.Number) }),
).annotations({
  identifier: "LogGroupField",
}) as any as S.Schema<LogGroupField>;
export type LogGroupFieldList = LogGroupField[];
export const LogGroupFieldList = S.Array(LogGroupField);
export type LogRecord = { [key: string]: string };
export const LogRecord = S.Record({ key: S.String, value: S.String });
export interface ResultField {
  field?: string;
  value?: string;
}
export const ResultField = S.suspend(() =>
  S.Struct({ field: S.optional(S.String), value: S.optional(S.String) }),
).annotations({ identifier: "ResultField" }) as any as S.Schema<ResultField>;
export type ResultRows = ResultField[];
export const ResultRows = S.Array(ResultField);
export type QueryResults = ResultRows[];
export const QueryResults = S.Array(ResultRows);
export interface QueryStatistics {
  recordsMatched?: number;
  recordsScanned?: number;
  estimatedRecordsSkipped?: number;
  bytesScanned?: number;
  estimatedBytesSkipped?: number;
  logGroupsScanned?: number;
}
export const QueryStatistics = S.suspend(() =>
  S.Struct({
    recordsMatched: S.optional(S.Number),
    recordsScanned: S.optional(S.Number),
    estimatedRecordsSkipped: S.optional(S.Number),
    bytesScanned: S.optional(S.Number),
    estimatedBytesSkipped: S.optional(S.Number),
    logGroupsScanned: S.optional(S.Number),
  }),
).annotations({
  identifier: "QueryStatistics",
}) as any as S.Schema<QueryStatistics>;
export interface IntegrationSummary {
  integrationName?: string;
  integrationType?: string;
  integrationStatus?: string;
}
export const IntegrationSummary = S.suspend(() =>
  S.Struct({
    integrationName: S.optional(S.String),
    integrationType: S.optional(S.String),
    integrationStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "IntegrationSummary",
}) as any as S.Schema<IntegrationSummary>;
export type IntegrationSummaries = IntegrationSummary[];
export const IntegrationSummaries = S.Array(IntegrationSummary);
export interface AnomalyDetector {
  anomalyDetectorArn?: string;
  detectorName?: string;
  logGroupArnList?: LogGroupArnList;
  evaluationFrequency?: string;
  filterPattern?: string;
  anomalyDetectorStatus?: string;
  kmsKeyId?: string;
  creationTimeStamp?: number;
  lastModifiedTimeStamp?: number;
  anomalyVisibilityTime?: number;
}
export const AnomalyDetector = S.suspend(() =>
  S.Struct({
    anomalyDetectorArn: S.optional(S.String),
    detectorName: S.optional(S.String),
    logGroupArnList: S.optional(LogGroupArnList),
    evaluationFrequency: S.optional(S.String),
    filterPattern: S.optional(S.String),
    anomalyDetectorStatus: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    creationTimeStamp: S.optional(S.Number),
    lastModifiedTimeStamp: S.optional(S.Number),
    anomalyVisibilityTime: S.optional(S.Number),
  }),
).annotations({
  identifier: "AnomalyDetector",
}) as any as S.Schema<AnomalyDetector>;
export type AnomalyDetectors = AnomalyDetector[];
export const AnomalyDetectors = S.Array(AnomalyDetector);
export interface LogGroupSummary {
  logGroupName?: string;
  logGroupArn?: string;
  logGroupClass?: string;
}
export const LogGroupSummary = S.suspend(() =>
  S.Struct({
    logGroupName: S.optional(S.String),
    logGroupArn: S.optional(S.String),
    logGroupClass: S.optional(S.String),
  }),
).annotations({
  identifier: "LogGroupSummary",
}) as any as S.Schema<LogGroupSummary>;
export type LogGroupSummaries = LogGroupSummary[];
export const LogGroupSummaries = S.Array(LogGroupSummary);
export interface ScheduledQuerySummary {
  scheduledQueryArn?: string;
  name?: string;
  state?: string;
  lastTriggeredTime?: number;
  lastExecutionStatus?: string;
  scheduleExpression?: string;
  timezone?: string;
  destinationConfiguration?: DestinationConfiguration;
  creationTime?: number;
  lastUpdatedTime?: number;
}
export const ScheduledQuerySummary = S.suspend(() =>
  S.Struct({
    scheduledQueryArn: S.optional(S.String),
    name: S.optional(S.String),
    state: S.optional(S.String),
    lastTriggeredTime: S.optional(S.Number),
    lastExecutionStatus: S.optional(S.String),
    scheduleExpression: S.optional(S.String),
    timezone: S.optional(S.String),
    destinationConfiguration: S.optional(DestinationConfiguration),
    creationTime: S.optional(S.Number),
    lastUpdatedTime: S.optional(S.Number),
  }),
).annotations({
  identifier: "ScheduledQuerySummary",
}) as any as S.Schema<ScheduledQuerySummary>;
export type ScheduledQuerySummaryList = ScheduledQuerySummary[];
export const ScheduledQuerySummaryList = S.Array(ScheduledQuerySummary);
export interface S3TableIntegrationSource {
  identifier?: string;
  dataSource?: DataSource;
  status?: string;
  statusReason?: string;
  createdTimeStamp?: number;
}
export const S3TableIntegrationSource = S.suspend(() =>
  S.Struct({
    identifier: S.optional(S.String),
    dataSource: S.optional(DataSource),
    status: S.optional(S.String),
    statusReason: S.optional(S.String),
    createdTimeStamp: S.optional(S.Number),
  }),
).annotations({
  identifier: "S3TableIntegrationSource",
}) as any as S.Schema<S3TableIntegrationSource>;
export type S3TableIntegrationSources = S3TableIntegrationSource[];
export const S3TableIntegrationSources = S.Array(S3TableIntegrationSource);
export type ResourceConfig = {
  openSearchResourceConfig: OpenSearchResourceConfig;
};
export const ResourceConfig = S.Union(
  S.Struct({ openSearchResourceConfig: OpenSearchResourceConfig }),
);
export interface Entity {
  keyAttributes?: EntityKeyAttributes;
  attributes?: EntityAttributes;
}
export const Entity = S.suspend(() =>
  S.Struct({
    keyAttributes: S.optional(EntityKeyAttributes),
    attributes: S.optional(EntityAttributes),
  }),
).annotations({ identifier: "Entity" }) as any as S.Schema<Entity>;
export interface TransformedLogRecord {
  eventNumber?: number;
  eventMessage?: string;
  transformedEventMessage?: string;
}
export const TransformedLogRecord = S.suspend(() =>
  S.Struct({
    eventNumber: S.optional(S.Number),
    eventMessage: S.optional(S.String),
    transformedEventMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "TransformedLogRecord",
}) as any as S.Schema<TransformedLogRecord>;
export type TransformedLogs = TransformedLogRecord[];
export const TransformedLogs = S.Array(TransformedLogRecord);
export interface AssociateSourceToS3TableIntegrationResponse {
  identifier?: string;
}
export const AssociateSourceToS3TableIntegrationResponse = S.suspend(() =>
  S.Struct({ identifier: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "AssociateSourceToS3TableIntegrationResponse",
}) as any as S.Schema<AssociateSourceToS3TableIntegrationResponse>;
export interface CancelImportTaskResponse {
  importId?: string;
  importStatistics?: ImportStatistics;
  importStatus?: string;
  creationTime?: number;
  lastUpdatedTime?: number;
}
export const CancelImportTaskResponse = S.suspend(() =>
  S.Struct({
    importId: S.optional(S.String),
    importStatistics: S.optional(ImportStatistics),
    importStatus: S.optional(S.String),
    creationTime: S.optional(S.Number),
    lastUpdatedTime: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "CancelImportTaskResponse",
}) as any as S.Schema<CancelImportTaskResponse>;
export interface CreateDeliveryResponse {
  delivery?: Delivery;
}
export const CreateDeliveryResponse = S.suspend(() =>
  S.Struct({ delivery: S.optional(Delivery) }).pipe(ns),
).annotations({
  identifier: "CreateDeliveryResponse",
}) as any as S.Schema<CreateDeliveryResponse>;
export interface CreateImportTaskResponse {
  importId?: string;
  importDestinationArn?: string;
  creationTime?: number;
}
export const CreateImportTaskResponse = S.suspend(() =>
  S.Struct({
    importId: S.optional(S.String),
    importDestinationArn: S.optional(S.String),
    creationTime: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "CreateImportTaskResponse",
}) as any as S.Schema<CreateImportTaskResponse>;
export interface CreateScheduledQueryRequest {
  name: string;
  description?: string;
  queryLanguage: string;
  queryString: string;
  logGroupIdentifiers?: ScheduledQueryLogGroupIdentifiers;
  scheduleExpression: string;
  timezone?: string;
  startTimeOffset?: number;
  destinationConfiguration?: DestinationConfiguration;
  scheduleStartTime?: number;
  scheduleEndTime?: number;
  executionRoleArn: string;
  state?: string;
  tags?: Tags;
}
export const CreateScheduledQueryRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    queryLanguage: S.String,
    queryString: S.String,
    logGroupIdentifiers: S.optional(ScheduledQueryLogGroupIdentifiers),
    scheduleExpression: S.String,
    timezone: S.optional(S.String),
    startTimeOffset: S.optional(S.Number),
    destinationConfiguration: S.optional(DestinationConfiguration),
    scheduleStartTime: S.optional(S.Number),
    scheduleEndTime: S.optional(S.Number),
    executionRoleArn: S.String,
    state: S.optional(S.String),
    tags: S.optional(Tags),
  }).pipe(
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
  identifier: "CreateScheduledQueryRequest",
}) as any as S.Schema<CreateScheduledQueryRequest>;
export interface DescribeAccountPoliciesResponse {
  accountPolicies?: AccountPolicies;
  nextToken?: string;
}
export const DescribeAccountPoliciesResponse = S.suspend(() =>
  S.Struct({
    accountPolicies: S.optional(AccountPolicies),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeAccountPoliciesResponse",
}) as any as S.Schema<DescribeAccountPoliciesResponse>;
export interface DescribeDeliveriesResponse {
  deliveries?: Deliveries;
  nextToken?: string;
}
export const DescribeDeliveriesResponse = S.suspend(() =>
  S.Struct({
    deliveries: S.optional(Deliveries),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDeliveriesResponse",
}) as any as S.Schema<DescribeDeliveriesResponse>;
export interface DescribeDeliveryDestinationsResponse {
  deliveryDestinations?: DeliveryDestinations;
  nextToken?: string;
}
export const DescribeDeliveryDestinationsResponse = S.suspend(() =>
  S.Struct({
    deliveryDestinations: S.optional(DeliveryDestinations),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDeliveryDestinationsResponse",
}) as any as S.Schema<DescribeDeliveryDestinationsResponse>;
export interface DescribeDeliverySourcesResponse {
  deliverySources?: DeliverySources;
  nextToken?: string;
}
export const DescribeDeliverySourcesResponse = S.suspend(() =>
  S.Struct({
    deliverySources: S.optional(DeliverySources),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDeliverySourcesResponse",
}) as any as S.Schema<DescribeDeliverySourcesResponse>;
export interface DescribeDestinationsResponse {
  destinations?: Destinations;
  nextToken?: string;
}
export const DescribeDestinationsResponse = S.suspend(() =>
  S.Struct({
    destinations: S.optional(Destinations),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDestinationsResponse",
}) as any as S.Schema<DescribeDestinationsResponse>;
export interface DescribeFieldIndexesResponse {
  fieldIndexes?: FieldIndexes;
  nextToken?: string;
}
export const DescribeFieldIndexesResponse = S.suspend(() =>
  S.Struct({
    fieldIndexes: S.optional(FieldIndexes),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeFieldIndexesResponse",
}) as any as S.Schema<DescribeFieldIndexesResponse>;
export interface DescribeImportTaskBatchesResponse {
  importSourceArn?: string;
  importId?: string;
  importBatches?: ImportBatchList;
  nextToken?: string;
}
export const DescribeImportTaskBatchesResponse = S.suspend(() =>
  S.Struct({
    importSourceArn: S.optional(S.String),
    importId: S.optional(S.String),
    importBatches: S.optional(ImportBatchList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeImportTaskBatchesResponse",
}) as any as S.Schema<DescribeImportTaskBatchesResponse>;
export interface DescribeImportTasksResponse {
  imports?: ImportList;
  nextToken?: string;
}
export const DescribeImportTasksResponse = S.suspend(() =>
  S.Struct({
    imports: S.optional(ImportList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeImportTasksResponse",
}) as any as S.Schema<DescribeImportTasksResponse>;
export interface DescribeIndexPoliciesResponse {
  indexPolicies?: IndexPolicies;
  nextToken?: string;
}
export const DescribeIndexPoliciesResponse = S.suspend(() =>
  S.Struct({
    indexPolicies: S.optional(IndexPolicies),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeIndexPoliciesResponse",
}) as any as S.Schema<DescribeIndexPoliciesResponse>;
export interface DescribeLogGroupsResponse {
  logGroups?: LogGroups;
  nextToken?: string;
}
export const DescribeLogGroupsResponse = S.suspend(() =>
  S.Struct({
    logGroups: S.optional(LogGroups),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeLogGroupsResponse",
}) as any as S.Schema<DescribeLogGroupsResponse>;
export interface DescribeLogStreamsResponse {
  logStreams?: LogStreams;
  nextToken?: string;
}
export const DescribeLogStreamsResponse = S.suspend(() =>
  S.Struct({
    logStreams: S.optional(LogStreams),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeLogStreamsResponse",
}) as any as S.Schema<DescribeLogStreamsResponse>;
export interface DescribeMetricFiltersResponse {
  metricFilters?: MetricFilters;
  nextToken?: string;
}
export const DescribeMetricFiltersResponse = S.suspend(() =>
  S.Struct({
    metricFilters: S.optional(MetricFilters),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeMetricFiltersResponse",
}) as any as S.Schema<DescribeMetricFiltersResponse>;
export interface DescribeQueriesResponse {
  queries?: QueryInfoList;
  nextToken?: string;
}
export const DescribeQueriesResponse = S.suspend(() =>
  S.Struct({
    queries: S.optional(QueryInfoList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeQueriesResponse",
}) as any as S.Schema<DescribeQueriesResponse>;
export interface DescribeQueryDefinitionsResponse {
  queryDefinitions?: QueryDefinitionList;
  nextToken?: string;
}
export const DescribeQueryDefinitionsResponse = S.suspend(() =>
  S.Struct({
    queryDefinitions: S.optional(QueryDefinitionList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeQueryDefinitionsResponse",
}) as any as S.Schema<DescribeQueryDefinitionsResponse>;
export interface DescribeResourcePoliciesResponse {
  resourcePolicies?: ResourcePolicies;
  nextToken?: string;
}
export const DescribeResourcePoliciesResponse = S.suspend(() =>
  S.Struct({
    resourcePolicies: S.optional(ResourcePolicies),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeResourcePoliciesResponse",
}) as any as S.Schema<DescribeResourcePoliciesResponse>;
export interface DescribeSubscriptionFiltersResponse {
  subscriptionFilters?: SubscriptionFilters;
  nextToken?: string;
}
export const DescribeSubscriptionFiltersResponse = S.suspend(() =>
  S.Struct({
    subscriptionFilters: S.optional(SubscriptionFilters),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeSubscriptionFiltersResponse",
}) as any as S.Schema<DescribeSubscriptionFiltersResponse>;
export interface FilterLogEventsResponse {
  events?: FilteredLogEvents;
  searchedLogStreams?: SearchedLogStreams;
  nextToken?: string;
}
export const FilterLogEventsResponse = S.suspend(() =>
  S.Struct({
    events: S.optional(FilteredLogEvents),
    searchedLogStreams: S.optional(SearchedLogStreams),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "FilterLogEventsResponse",
}) as any as S.Schema<FilterLogEventsResponse>;
export interface GetDeliveryDestinationPolicyResponse {
  policy?: Policy;
}
export const GetDeliveryDestinationPolicyResponse = S.suspend(() =>
  S.Struct({ policy: S.optional(Policy) }).pipe(ns),
).annotations({
  identifier: "GetDeliveryDestinationPolicyResponse",
}) as any as S.Schema<GetDeliveryDestinationPolicyResponse>;
export interface GetLogEventsResponse {
  events?: OutputLogEvents;
  nextForwardToken?: string;
  nextBackwardToken?: string;
}
export const GetLogEventsResponse = S.suspend(() =>
  S.Struct({
    events: S.optional(OutputLogEvents),
    nextForwardToken: S.optional(S.String),
    nextBackwardToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetLogEventsResponse",
}) as any as S.Schema<GetLogEventsResponse>;
export interface GetLogGroupFieldsResponse {
  logGroupFields?: LogGroupFieldList;
}
export const GetLogGroupFieldsResponse = S.suspend(() =>
  S.Struct({ logGroupFields: S.optional(LogGroupFieldList) }).pipe(ns),
).annotations({
  identifier: "GetLogGroupFieldsResponse",
}) as any as S.Schema<GetLogGroupFieldsResponse>;
export interface GetLogRecordResponse {
  logRecord?: LogRecord;
}
export const GetLogRecordResponse = S.suspend(() =>
  S.Struct({ logRecord: S.optional(LogRecord) }).pipe(ns),
).annotations({
  identifier: "GetLogRecordResponse",
}) as any as S.Schema<GetLogRecordResponse>;
export interface GetQueryResultsResponse {
  queryLanguage?: string;
  results?: QueryResults;
  statistics?: QueryStatistics;
  status?: string;
  encryptionKey?: string;
}
export const GetQueryResultsResponse = S.suspend(() =>
  S.Struct({
    queryLanguage: S.optional(S.String),
    results: S.optional(QueryResults),
    statistics: S.optional(QueryStatistics),
    status: S.optional(S.String),
    encryptionKey: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetQueryResultsResponse",
}) as any as S.Schema<GetQueryResultsResponse>;
export interface ListIntegrationsResponse {
  integrationSummaries?: IntegrationSummaries;
}
export const ListIntegrationsResponse = S.suspend(() =>
  S.Struct({ integrationSummaries: S.optional(IntegrationSummaries) }).pipe(ns),
).annotations({
  identifier: "ListIntegrationsResponse",
}) as any as S.Schema<ListIntegrationsResponse>;
export interface ListLogAnomalyDetectorsResponse {
  anomalyDetectors?: AnomalyDetectors;
  nextToken?: string;
}
export const ListLogAnomalyDetectorsResponse = S.suspend(() =>
  S.Struct({
    anomalyDetectors: S.optional(AnomalyDetectors),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListLogAnomalyDetectorsResponse",
}) as any as S.Schema<ListLogAnomalyDetectorsResponse>;
export interface ListLogGroupsResponse {
  logGroups?: LogGroupSummaries;
  nextToken?: string;
}
export const ListLogGroupsResponse = S.suspend(() =>
  S.Struct({
    logGroups: S.optional(LogGroupSummaries),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListLogGroupsResponse",
}) as any as S.Schema<ListLogGroupsResponse>;
export interface ListScheduledQueriesResponse {
  nextToken?: string;
  scheduledQueries?: ScheduledQuerySummaryList;
}
export const ListScheduledQueriesResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    scheduledQueries: S.optional(ScheduledQuerySummaryList),
  }).pipe(ns),
).annotations({
  identifier: "ListScheduledQueriesResponse",
}) as any as S.Schema<ListScheduledQueriesResponse>;
export interface ListSourcesForS3TableIntegrationResponse {
  sources?: S3TableIntegrationSources;
  nextToken?: string;
}
export const ListSourcesForS3TableIntegrationResponse = S.suspend(() =>
  S.Struct({
    sources: S.optional(S3TableIntegrationSources),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListSourcesForS3TableIntegrationResponse",
}) as any as S.Schema<ListSourcesForS3TableIntegrationResponse>;
export interface PutDeliveryDestinationResponse {
  deliveryDestination?: DeliveryDestination;
}
export const PutDeliveryDestinationResponse = S.suspend(() =>
  S.Struct({ deliveryDestination: S.optional(DeliveryDestination) }).pipe(ns),
).annotations({
  identifier: "PutDeliveryDestinationResponse",
}) as any as S.Schema<PutDeliveryDestinationResponse>;
export interface PutIntegrationRequest {
  integrationName: string;
  resourceConfig: (typeof ResourceConfig)["Type"];
  integrationType: string;
}
export const PutIntegrationRequest = S.suspend(() =>
  S.Struct({
    integrationName: S.String,
    resourceConfig: ResourceConfig,
    integrationType: S.String,
  }).pipe(
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
  identifier: "PutIntegrationRequest",
}) as any as S.Schema<PutIntegrationRequest>;
export interface PutLogEventsRequest {
  logGroupName: string;
  logStreamName: string;
  logEvents: InputLogEvents;
  sequenceToken?: string;
  entity?: Entity;
}
export const PutLogEventsRequest = S.suspend(() =>
  S.Struct({
    logGroupName: S.String,
    logStreamName: S.String,
    logEvents: InputLogEvents,
    sequenceToken: S.optional(S.String),
    entity: S.optional(Entity),
  }).pipe(
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
  identifier: "PutLogEventsRequest",
}) as any as S.Schema<PutLogEventsRequest>;
export interface PutMetricFilterRequest {
  logGroupName: string;
  filterName: string;
  filterPattern: string;
  metricTransformations: MetricTransformations;
  applyOnTransformedLogs?: boolean;
  fieldSelectionCriteria?: string;
  emitSystemFieldDimensions?: EmitSystemFields;
}
export const PutMetricFilterRequest = S.suspend(() =>
  S.Struct({
    logGroupName: S.String,
    filterName: S.String,
    filterPattern: S.String,
    metricTransformations: MetricTransformations,
    applyOnTransformedLogs: S.optional(S.Boolean),
    fieldSelectionCriteria: S.optional(S.String),
    emitSystemFieldDimensions: S.optional(EmitSystemFields),
  }).pipe(
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
  identifier: "PutMetricFilterRequest",
}) as any as S.Schema<PutMetricFilterRequest>;
export interface PutMetricFilterResponse {}
export const PutMetricFilterResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutMetricFilterResponse",
}) as any as S.Schema<PutMetricFilterResponse>;
export interface TestTransformerResponse {
  transformedLogs?: TransformedLogs;
}
export const TestTransformerResponse = S.suspend(() =>
  S.Struct({ transformedLogs: S.optional(TransformedLogs) }).pipe(ns),
).annotations({
  identifier: "TestTransformerResponse",
}) as any as S.Schema<TestTransformerResponse>;
export interface ConfigurationTemplateDeliveryConfigValues {
  recordFields?: RecordFields;
  fieldDelimiter?: string;
  s3DeliveryConfiguration?: S3DeliveryConfiguration;
}
export const ConfigurationTemplateDeliveryConfigValues = S.suspend(() =>
  S.Struct({
    recordFields: S.optional(RecordFields),
    fieldDelimiter: S.optional(S.String),
    s3DeliveryConfiguration: S.optional(S3DeliveryConfiguration),
  }),
).annotations({
  identifier: "ConfigurationTemplateDeliveryConfigValues",
}) as any as S.Schema<ConfigurationTemplateDeliveryConfigValues>;
export interface RecordField {
  name?: string;
  mandatory?: boolean;
}
export const RecordField = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), mandatory: S.optional(S.Boolean) }),
).annotations({ identifier: "RecordField" }) as any as S.Schema<RecordField>;
export type AllowedFields = RecordField[];
export const AllowedFields = S.Array(RecordField);
export interface ExportTaskStatus {
  code?: string;
  message?: string;
}
export const ExportTaskStatus = S.suspend(() =>
  S.Struct({ code: S.optional(S.String), message: S.optional(S.String) }),
).annotations({
  identifier: "ExportTaskStatus",
}) as any as S.Schema<ExportTaskStatus>;
export interface ExportTaskExecutionInfo {
  creationTime?: number;
  completionTime?: number;
}
export const ExportTaskExecutionInfo = S.suspend(() =>
  S.Struct({
    creationTime: S.optional(S.Number),
    completionTime: S.optional(S.Number),
  }),
).annotations({
  identifier: "ExportTaskExecutionInfo",
}) as any as S.Schema<ExportTaskExecutionInfo>;
export interface LogFieldType {
  type?: string;
  element?: LogFieldType;
  fields?: LogFieldsList;
}
export const LogFieldType = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    element: S.optional(
      S.suspend((): S.Schema<LogFieldType, any> => LogFieldType).annotations({
        identifier: "LogFieldType",
      }),
    ),
    fields: S.optional(
      S.suspend(() => LogFieldsList).annotations({
        identifier: "LogFieldsList",
      }),
    ),
  }),
).annotations({ identifier: "LogFieldType" }) as any as S.Schema<LogFieldType>;
export interface FieldsData {
  data?: Uint8Array;
}
export const FieldsData = S.suspend(() =>
  S.Struct({ data: S.optional(T.Blob) }),
).annotations({ identifier: "FieldsData" }) as any as S.Schema<FieldsData>;
export interface InternalStreamingException {
  message?: string;
}
export const InternalStreamingException = S.suspend(() =>
  S.Struct({ message: S.optional(S.String) }),
).annotations({
  identifier: "InternalStreamingException",
}) as any as S.Schema<InternalStreamingException>;
export interface ScheduledQueryDestination {
  destinationType?: string;
  destinationIdentifier?: string;
  status?: string;
  processedIdentifier?: string;
  errorMessage?: string;
}
export const ScheduledQueryDestination = S.suspend(() =>
  S.Struct({
    destinationType: S.optional(S.String),
    destinationIdentifier: S.optional(S.String),
    status: S.optional(S.String),
    processedIdentifier: S.optional(S.String),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "ScheduledQueryDestination",
}) as any as S.Schema<ScheduledQueryDestination>;
export type ScheduledQueryDestinationList = ScheduledQueryDestination[];
export const ScheduledQueryDestinationList = S.Array(ScheduledQueryDestination);
export type Histogram = { [key: string]: number };
export const Histogram = S.Record({ key: S.String, value: S.Number });
export interface LogEvent {
  timestamp?: number;
  message?: string;
}
export const LogEvent = S.suspend(() =>
  S.Struct({ timestamp: S.optional(S.Number), message: S.optional(S.String) }),
).annotations({ identifier: "LogEvent" }) as any as S.Schema<LogEvent>;
export type LogSamples = LogEvent[];
export const LogSamples = S.Array(LogEvent);
export interface LiveTailSessionStart {
  requestId?: string;
  sessionId?: string;
  logGroupIdentifiers?: StartLiveTailLogGroupIdentifiers;
  logStreamNames?: InputLogStreamNames;
  logStreamNamePrefixes?: InputLogStreamNames;
  logEventFilterPattern?: string;
}
export const LiveTailSessionStart = S.suspend(() =>
  S.Struct({
    requestId: S.optional(S.String),
    sessionId: S.optional(S.String),
    logGroupIdentifiers: S.optional(StartLiveTailLogGroupIdentifiers),
    logStreamNames: S.optional(InputLogStreamNames),
    logStreamNamePrefixes: S.optional(InputLogStreamNames),
    logEventFilterPattern: S.optional(S.String),
  }),
).annotations({
  identifier: "LiveTailSessionStart",
}) as any as S.Schema<LiveTailSessionStart>;
export interface SessionTimeoutException {
  message?: string;
}
export const SessionTimeoutException = S.suspend(() =>
  S.Struct({ message: S.optional(S.String) }),
).annotations({
  identifier: "SessionTimeoutException",
}) as any as S.Schema<SessionTimeoutException>;
export interface SessionStreamingException {
  message?: string;
}
export const SessionStreamingException = S.suspend(() =>
  S.Struct({ message: S.optional(S.String) }),
).annotations({
  identifier: "SessionStreamingException",
}) as any as S.Schema<SessionStreamingException>;
export type ExtractedValues = { [key: string]: string };
export const ExtractedValues = S.Record({ key: S.String, value: S.String });
export interface ConfigurationTemplate {
  service?: string;
  logType?: string;
  resourceType?: string;
  deliveryDestinationType?: string;
  defaultDeliveryConfigValues?: ConfigurationTemplateDeliveryConfigValues;
  allowedFields?: AllowedFields;
  allowedOutputFormats?: OutputFormats;
  allowedActionForAllowVendedLogsDeliveryForResource?: string;
  allowedFieldDelimiters?: AllowedFieldDelimiters;
  allowedSuffixPathFields?: RecordFields;
}
export const ConfigurationTemplate = S.suspend(() =>
  S.Struct({
    service: S.optional(S.String),
    logType: S.optional(S.String),
    resourceType: S.optional(S.String),
    deliveryDestinationType: S.optional(S.String),
    defaultDeliveryConfigValues: S.optional(
      ConfigurationTemplateDeliveryConfigValues,
    ),
    allowedFields: S.optional(AllowedFields),
    allowedOutputFormats: S.optional(OutputFormats),
    allowedActionForAllowVendedLogsDeliveryForResource: S.optional(S.String),
    allowedFieldDelimiters: S.optional(AllowedFieldDelimiters),
    allowedSuffixPathFields: S.optional(RecordFields),
  }),
).annotations({
  identifier: "ConfigurationTemplate",
}) as any as S.Schema<ConfigurationTemplate>;
export type ConfigurationTemplates = ConfigurationTemplate[];
export const ConfigurationTemplates = S.Array(ConfigurationTemplate);
export interface ExportTask {
  taskId?: string;
  taskName?: string;
  logGroupName?: string;
  from?: number;
  to?: number;
  destination?: string;
  destinationPrefix?: string;
  status?: ExportTaskStatus;
  executionInfo?: ExportTaskExecutionInfo;
}
export const ExportTask = S.suspend(() =>
  S.Struct({
    taskId: S.optional(S.String),
    taskName: S.optional(S.String),
    logGroupName: S.optional(S.String),
    from: S.optional(S.Number),
    to: S.optional(S.Number),
    destination: S.optional(S.String),
    destinationPrefix: S.optional(S.String),
    status: S.optional(ExportTaskStatus),
    executionInfo: S.optional(ExportTaskExecutionInfo),
  }),
).annotations({ identifier: "ExportTask" }) as any as S.Schema<ExportTask>;
export type ExportTasks = ExportTask[];
export const ExportTasks = S.Array(ExportTask);
export interface LogFieldsListItem {
  logFieldName?: string;
  logFieldType?: LogFieldType;
}
export const LogFieldsListItem = S.suspend(() =>
  S.Struct({
    logFieldName: S.optional(S.String),
    logFieldType: S.optional(
      S.suspend((): S.Schema<LogFieldType, any> => LogFieldType).annotations({
        identifier: "LogFieldType",
      }),
    ),
  }),
).annotations({
  identifier: "LogFieldsListItem",
}) as any as S.Schema<LogFieldsListItem>;
export type LogFieldsList = LogFieldsListItem[];
export const LogFieldsList = S.Array(
  S.suspend(
    (): S.Schema<LogFieldsListItem, any> => LogFieldsListItem,
  ).annotations({ identifier: "LogFieldsListItem" }),
) as any as S.Schema<LogFieldsList>;
export const GetLogObjectResponseStream = T.EventStream(
  S.Union(
    S.Struct({ fields: FieldsData }),
    S.Struct({ InternalStreamingException: InternalStreamingException }),
  ),
);
export interface TriggerHistoryRecord {
  queryId?: string;
  executionStatus?: string;
  triggeredTimestamp?: number;
  errorMessage?: string;
  destinations?: ScheduledQueryDestinationList;
}
export const TriggerHistoryRecord = S.suspend(() =>
  S.Struct({
    queryId: S.optional(S.String),
    executionStatus: S.optional(S.String),
    triggeredTimestamp: S.optional(S.Number),
    errorMessage: S.optional(S.String),
    destinations: S.optional(ScheduledQueryDestinationList),
  }),
).annotations({
  identifier: "TriggerHistoryRecord",
}) as any as S.Schema<TriggerHistoryRecord>;
export type TriggerHistoryRecordList = TriggerHistoryRecord[];
export const TriggerHistoryRecordList = S.Array(TriggerHistoryRecord);
export interface MetricFilterMatchRecord {
  eventNumber?: number;
  eventMessage?: string;
  extractedValues?: ExtractedValues;
}
export const MetricFilterMatchRecord = S.suspend(() =>
  S.Struct({
    eventNumber: S.optional(S.Number),
    eventMessage: S.optional(S.String),
    extractedValues: S.optional(ExtractedValues),
  }),
).annotations({
  identifier: "MetricFilterMatchRecord",
}) as any as S.Schema<MetricFilterMatchRecord>;
export type MetricFilterMatches = MetricFilterMatchRecord[];
export const MetricFilterMatches = S.Array(MetricFilterMatchRecord);
export interface OpenSearchResourceStatus {
  status?: string;
  statusMessage?: string;
}
export const OpenSearchResourceStatus = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    statusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "OpenSearchResourceStatus",
}) as any as S.Schema<OpenSearchResourceStatus>;
export interface OpenSearchApplication {
  applicationEndpoint?: string;
  applicationArn?: string;
  applicationId?: string;
  status?: OpenSearchResourceStatus;
}
export const OpenSearchApplication = S.suspend(() =>
  S.Struct({
    applicationEndpoint: S.optional(S.String),
    applicationArn: S.optional(S.String),
    applicationId: S.optional(S.String),
    status: S.optional(OpenSearchResourceStatus),
  }),
).annotations({
  identifier: "OpenSearchApplication",
}) as any as S.Schema<OpenSearchApplication>;
export interface OpenSearchCollection {
  collectionEndpoint?: string;
  collectionArn?: string;
  status?: OpenSearchResourceStatus;
}
export const OpenSearchCollection = S.suspend(() =>
  S.Struct({
    collectionEndpoint: S.optional(S.String),
    collectionArn: S.optional(S.String),
    status: S.optional(OpenSearchResourceStatus),
  }),
).annotations({
  identifier: "OpenSearchCollection",
}) as any as S.Schema<OpenSearchCollection>;
export interface OpenSearchWorkspace {
  workspaceId?: string;
  status?: OpenSearchResourceStatus;
}
export const OpenSearchWorkspace = S.suspend(() =>
  S.Struct({
    workspaceId: S.optional(S.String),
    status: S.optional(OpenSearchResourceStatus),
  }),
).annotations({
  identifier: "OpenSearchWorkspace",
}) as any as S.Schema<OpenSearchWorkspace>;
export interface OpenSearchEncryptionPolicy {
  policyName?: string;
  status?: OpenSearchResourceStatus;
}
export const OpenSearchEncryptionPolicy = S.suspend(() =>
  S.Struct({
    policyName: S.optional(S.String),
    status: S.optional(OpenSearchResourceStatus),
  }),
).annotations({
  identifier: "OpenSearchEncryptionPolicy",
}) as any as S.Schema<OpenSearchEncryptionPolicy>;
export interface OpenSearchNetworkPolicy {
  policyName?: string;
  status?: OpenSearchResourceStatus;
}
export const OpenSearchNetworkPolicy = S.suspend(() =>
  S.Struct({
    policyName: S.optional(S.String),
    status: S.optional(OpenSearchResourceStatus),
  }),
).annotations({
  identifier: "OpenSearchNetworkPolicy",
}) as any as S.Schema<OpenSearchNetworkPolicy>;
export interface OpenSearchDataAccessPolicy {
  policyName?: string;
  status?: OpenSearchResourceStatus;
}
export const OpenSearchDataAccessPolicy = S.suspend(() =>
  S.Struct({
    policyName: S.optional(S.String),
    status: S.optional(OpenSearchResourceStatus),
  }),
).annotations({
  identifier: "OpenSearchDataAccessPolicy",
}) as any as S.Schema<OpenSearchDataAccessPolicy>;
export interface OpenSearchLifecyclePolicy {
  policyName?: string;
  status?: OpenSearchResourceStatus;
}
export const OpenSearchLifecyclePolicy = S.suspend(() =>
  S.Struct({
    policyName: S.optional(S.String),
    status: S.optional(OpenSearchResourceStatus),
  }),
).annotations({
  identifier: "OpenSearchLifecyclePolicy",
}) as any as S.Schema<OpenSearchLifecyclePolicy>;
export type Enumerations = { [key: string]: number };
export const Enumerations = S.Record({ key: S.String, value: S.Number });
export interface LiveTailSessionMetadata {
  sampled?: boolean;
}
export const LiveTailSessionMetadata = S.suspend(() =>
  S.Struct({ sampled: S.optional(S.Boolean) }),
).annotations({
  identifier: "LiveTailSessionMetadata",
}) as any as S.Schema<LiveTailSessionMetadata>;
export interface LiveTailSessionLogEvent {
  logStreamName?: string;
  logGroupIdentifier?: string;
  message?: string;
  timestamp?: number;
  ingestionTime?: number;
}
export const LiveTailSessionLogEvent = S.suspend(() =>
  S.Struct({
    logStreamName: S.optional(S.String),
    logGroupIdentifier: S.optional(S.String),
    message: S.optional(S.String),
    timestamp: S.optional(S.Number),
    ingestionTime: S.optional(S.Number),
  }),
).annotations({
  identifier: "LiveTailSessionLogEvent",
}) as any as S.Schema<LiveTailSessionLogEvent>;
export type LiveTailSessionResults = LiveTailSessionLogEvent[];
export const LiveTailSessionResults = S.Array(LiveTailSessionLogEvent);
export interface CreateScheduledQueryResponse {
  scheduledQueryArn?: string;
  state?: string;
}
export const CreateScheduledQueryResponse = S.suspend(() =>
  S.Struct({
    scheduledQueryArn: S.optional(S.String),
    state: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateScheduledQueryResponse",
}) as any as S.Schema<CreateScheduledQueryResponse>;
export interface DescribeConfigurationTemplatesResponse {
  configurationTemplates?: ConfigurationTemplates;
  nextToken?: string;
}
export const DescribeConfigurationTemplatesResponse = S.suspend(() =>
  S.Struct({
    configurationTemplates: S.optional(ConfigurationTemplates),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeConfigurationTemplatesResponse",
}) as any as S.Schema<DescribeConfigurationTemplatesResponse>;
export interface DescribeExportTasksResponse {
  exportTasks?: ExportTasks;
  nextToken?: string;
}
export const DescribeExportTasksResponse = S.suspend(() =>
  S.Struct({
    exportTasks: S.optional(ExportTasks),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeExportTasksResponse",
}) as any as S.Schema<DescribeExportTasksResponse>;
export interface GetLogFieldsResponse {
  logFields?: LogFieldsList;
}
export const GetLogFieldsResponse = S.suspend(() =>
  S.Struct({ logFields: S.optional(LogFieldsList) }).pipe(ns),
).annotations({
  identifier: "GetLogFieldsResponse",
}) as any as S.Schema<GetLogFieldsResponse>;
export interface GetLogObjectResponse {
  fieldStream?: (typeof GetLogObjectResponseStream)["Type"];
}
export const GetLogObjectResponse = S.suspend(() =>
  S.Struct({ fieldStream: S.optional(GetLogObjectResponseStream) }).pipe(ns),
).annotations({
  identifier: "GetLogObjectResponse",
}) as any as S.Schema<GetLogObjectResponse>;
export interface GetScheduledQueryHistoryResponse {
  name?: string;
  scheduledQueryArn?: string;
  triggerHistory?: TriggerHistoryRecordList;
  nextToken?: string;
}
export const GetScheduledQueryHistoryResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    scheduledQueryArn: S.optional(S.String),
    triggerHistory: S.optional(TriggerHistoryRecordList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetScheduledQueryHistoryResponse",
}) as any as S.Schema<GetScheduledQueryHistoryResponse>;
export interface PutIntegrationResponse {
  integrationName?: string;
  integrationStatus?: string;
}
export const PutIntegrationResponse = S.suspend(() =>
  S.Struct({
    integrationName: S.optional(S.String),
    integrationStatus: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "PutIntegrationResponse",
}) as any as S.Schema<PutIntegrationResponse>;
export interface PutTransformerRequest {
  logGroupIdentifier: string;
  transformerConfig: Processors;
}
export const PutTransformerRequest = S.suspend(() =>
  S.Struct({
    logGroupIdentifier: S.String,
    transformerConfig: Processors,
  }).pipe(
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
  identifier: "PutTransformerRequest",
}) as any as S.Schema<PutTransformerRequest>;
export interface PutTransformerResponse {}
export const PutTransformerResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutTransformerResponse",
}) as any as S.Schema<PutTransformerResponse>;
export interface TestMetricFilterResponse {
  matches?: MetricFilterMatches;
}
export const TestMetricFilterResponse = S.suspend(() =>
  S.Struct({ matches: S.optional(MetricFilterMatches) }).pipe(ns),
).annotations({
  identifier: "TestMetricFilterResponse",
}) as any as S.Schema<TestMetricFilterResponse>;
export interface GroupingIdentifier {
  key?: string;
  value?: string;
}
export const GroupingIdentifier = S.suspend(() =>
  S.Struct({ key: S.optional(S.String), value: S.optional(S.String) }),
).annotations({
  identifier: "GroupingIdentifier",
}) as any as S.Schema<GroupingIdentifier>;
export type GroupingIdentifiers = GroupingIdentifier[];
export const GroupingIdentifiers = S.Array(GroupingIdentifier);
export interface PatternToken {
  dynamicTokenPosition?: number;
  isDynamic?: boolean;
  tokenString?: string;
  enumerations?: Enumerations;
  inferredTokenName?: string;
}
export const PatternToken = S.suspend(() =>
  S.Struct({
    dynamicTokenPosition: S.optional(S.Number),
    isDynamic: S.optional(S.Boolean),
    tokenString: S.optional(S.String),
    enumerations: S.optional(Enumerations),
    inferredTokenName: S.optional(S.String),
  }),
).annotations({ identifier: "PatternToken" }) as any as S.Schema<PatternToken>;
export type PatternTokens = PatternToken[];
export const PatternTokens = S.Array(PatternToken);
export interface LiveTailSessionUpdate {
  sessionMetadata?: LiveTailSessionMetadata;
  sessionResults?: LiveTailSessionResults;
}
export const LiveTailSessionUpdate = S.suspend(() =>
  S.Struct({
    sessionMetadata: S.optional(LiveTailSessionMetadata),
    sessionResults: S.optional(LiveTailSessionResults),
  }),
).annotations({
  identifier: "LiveTailSessionUpdate",
}) as any as S.Schema<LiveTailSessionUpdate>;
export interface AggregateLogGroupSummary {
  logGroupCount?: number;
  groupingIdentifiers?: GroupingIdentifiers;
}
export const AggregateLogGroupSummary = S.suspend(() =>
  S.Struct({
    logGroupCount: S.optional(S.Number),
    groupingIdentifiers: S.optional(GroupingIdentifiers),
  }),
).annotations({
  identifier: "AggregateLogGroupSummary",
}) as any as S.Schema<AggregateLogGroupSummary>;
export type AggregateLogGroupSummaries = AggregateLogGroupSummary[];
export const AggregateLogGroupSummaries = S.Array(AggregateLogGroupSummary);
export interface Anomaly {
  anomalyId: string;
  patternId: string;
  anomalyDetectorArn: string;
  patternString: string;
  patternRegex?: string;
  priority?: string;
  firstSeen: number;
  lastSeen: number;
  description: string;
  active: boolean;
  state: string;
  histogram: Histogram;
  logSamples: LogSamples;
  patternTokens: PatternTokens;
  logGroupArnList: LogGroupArnList;
  suppressed?: boolean;
  suppressedDate?: number;
  suppressedUntil?: number;
  isPatternLevelSuppression?: boolean;
}
export const Anomaly = S.suspend(() =>
  S.Struct({
    anomalyId: S.String,
    patternId: S.String,
    anomalyDetectorArn: S.String,
    patternString: S.String,
    patternRegex: S.optional(S.String),
    priority: S.optional(S.String),
    firstSeen: S.Number,
    lastSeen: S.Number,
    description: S.String,
    active: S.Boolean,
    state: S.String,
    histogram: Histogram,
    logSamples: LogSamples,
    patternTokens: PatternTokens,
    logGroupArnList: LogGroupArnList,
    suppressed: S.optional(S.Boolean),
    suppressedDate: S.optional(S.Number),
    suppressedUntil: S.optional(S.Number),
    isPatternLevelSuppression: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Anomaly" }) as any as S.Schema<Anomaly>;
export type Anomalies = Anomaly[];
export const Anomalies = S.Array(Anomaly);
export interface RejectedLogEventsInfo {
  tooNewLogEventStartIndex?: number;
  tooOldLogEventEndIndex?: number;
  expiredLogEventEndIndex?: number;
}
export const RejectedLogEventsInfo = S.suspend(() =>
  S.Struct({
    tooNewLogEventStartIndex: S.optional(S.Number),
    tooOldLogEventEndIndex: S.optional(S.Number),
    expiredLogEventEndIndex: S.optional(S.Number),
  }),
).annotations({
  identifier: "RejectedLogEventsInfo",
}) as any as S.Schema<RejectedLogEventsInfo>;
export interface RejectedEntityInfo {
  errorType: string;
}
export const RejectedEntityInfo = S.suspend(() =>
  S.Struct({ errorType: S.String }),
).annotations({
  identifier: "RejectedEntityInfo",
}) as any as S.Schema<RejectedEntityInfo>;
export const StartLiveTailResponseStream = T.EventStream(
  S.Union(
    S.Struct({ sessionStart: LiveTailSessionStart }),
    S.Struct({ sessionUpdate: LiveTailSessionUpdate }),
    S.Struct({ SessionTimeoutException: SessionTimeoutException }),
    S.Struct({ SessionStreamingException: SessionStreamingException }),
  ),
);
export interface OpenSearchDataSource {
  dataSourceName?: string;
  status?: OpenSearchResourceStatus;
}
export const OpenSearchDataSource = S.suspend(() =>
  S.Struct({
    dataSourceName: S.optional(S.String),
    status: S.optional(OpenSearchResourceStatus),
  }),
).annotations({
  identifier: "OpenSearchDataSource",
}) as any as S.Schema<OpenSearchDataSource>;
export interface ListAggregateLogGroupSummariesResponse {
  aggregateLogGroupSummaries?: AggregateLogGroupSummaries;
  nextToken?: string;
}
export const ListAggregateLogGroupSummariesResponse = S.suspend(() =>
  S.Struct({
    aggregateLogGroupSummaries: S.optional(AggregateLogGroupSummaries),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAggregateLogGroupSummariesResponse",
}) as any as S.Schema<ListAggregateLogGroupSummariesResponse>;
export interface ListAnomaliesResponse {
  anomalies?: Anomalies;
  nextToken?: string;
}
export const ListAnomaliesResponse = S.suspend(() =>
  S.Struct({
    anomalies: S.optional(Anomalies),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAnomaliesResponse",
}) as any as S.Schema<ListAnomaliesResponse>;
export interface PutLogEventsResponse {
  nextSequenceToken?: string;
  rejectedLogEventsInfo?: RejectedLogEventsInfo;
  rejectedEntityInfo?: RejectedEntityInfo;
}
export const PutLogEventsResponse = S.suspend(() =>
  S.Struct({
    nextSequenceToken: S.optional(S.String),
    rejectedLogEventsInfo: S.optional(RejectedLogEventsInfo),
    rejectedEntityInfo: S.optional(RejectedEntityInfo),
  }).pipe(ns),
).annotations({
  identifier: "PutLogEventsResponse",
}) as any as S.Schema<PutLogEventsResponse>;
export interface StartLiveTailResponse {
  responseStream?: (typeof StartLiveTailResponseStream)["Type"];
}
export const StartLiveTailResponse = S.suspend(() =>
  S.Struct({ responseStream: S.optional(StartLiveTailResponseStream) }).pipe(
    ns,
  ),
).annotations({
  identifier: "StartLiveTailResponse",
}) as any as S.Schema<StartLiveTailResponse>;
export interface OpenSearchIntegrationDetails {
  dataSource?: OpenSearchDataSource;
  application?: OpenSearchApplication;
  collection?: OpenSearchCollection;
  workspace?: OpenSearchWorkspace;
  encryptionPolicy?: OpenSearchEncryptionPolicy;
  networkPolicy?: OpenSearchNetworkPolicy;
  accessPolicy?: OpenSearchDataAccessPolicy;
  lifecyclePolicy?: OpenSearchLifecyclePolicy;
}
export const OpenSearchIntegrationDetails = S.suspend(() =>
  S.Struct({
    dataSource: S.optional(OpenSearchDataSource),
    application: S.optional(OpenSearchApplication),
    collection: S.optional(OpenSearchCollection),
    workspace: S.optional(OpenSearchWorkspace),
    encryptionPolicy: S.optional(OpenSearchEncryptionPolicy),
    networkPolicy: S.optional(OpenSearchNetworkPolicy),
    accessPolicy: S.optional(OpenSearchDataAccessPolicy),
    lifecyclePolicy: S.optional(OpenSearchLifecyclePolicy),
  }),
).annotations({
  identifier: "OpenSearchIntegrationDetails",
}) as any as S.Schema<OpenSearchIntegrationDetails>;
export interface QueryCompileErrorLocation {
  startCharOffset?: number;
  endCharOffset?: number;
}
export const QueryCompileErrorLocation = S.suspend(() =>
  S.Struct({
    startCharOffset: S.optional(S.Number),
    endCharOffset: S.optional(S.Number),
  }),
).annotations({
  identifier: "QueryCompileErrorLocation",
}) as any as S.Schema<QueryCompileErrorLocation>;
export type IntegrationDetails = {
  openSearchIntegrationDetails: OpenSearchIntegrationDetails;
};
export const IntegrationDetails = S.Union(
  S.Struct({ openSearchIntegrationDetails: OpenSearchIntegrationDetails }),
);
export interface QueryCompileError {
  location?: QueryCompileErrorLocation;
  message?: string;
}
export const QueryCompileError = S.suspend(() =>
  S.Struct({
    location: S.optional(QueryCompileErrorLocation),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "QueryCompileError",
}) as any as S.Schema<QueryCompileError>;
export interface GetIntegrationResponse {
  integrationName?: string;
  integrationType?: string;
  integrationStatus?: string;
  integrationDetails?: (typeof IntegrationDetails)["Type"];
}
export const GetIntegrationResponse = S.suspend(() =>
  S.Struct({
    integrationName: S.optional(S.String),
    integrationType: S.optional(S.String),
    integrationStatus: S.optional(S.String),
    integrationDetails: S.optional(IntegrationDetails),
  }).pipe(ns),
).annotations({
  identifier: "GetIntegrationResponse",
}) as any as S.Schema<GetIntegrationResponse>;

//# Errors
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { message: S.optional(S.String) },
) {}
export class InvalidOperationException extends S.TaggedError<InvalidOperationException>()(
  "InvalidOperationException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class OperationAbortedException extends S.TaggedError<OperationAbortedException>()(
  "OperationAbortedException",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { message: S.optional(S.String) },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class DataAlreadyAcceptedException extends S.TaggedError<DataAlreadyAcceptedException>()(
  "DataAlreadyAcceptedException",
  {
    expectedSequenceToken: S.optional(S.String),
    message: S.optional(S.String),
  },
) {}
export class MalformedQueryException extends S.TaggedError<MalformedQueryException>()(
  "MalformedQueryException",
  {
    queryCompileError: S.optional(QueryCompileError),
    message: S.optional(S.String),
  },
) {}
export class InvalidSequenceTokenException extends S.TaggedError<InvalidSequenceTokenException>()(
  "InvalidSequenceTokenException",
  {
    expectedSequenceToken: S.optional(S.String),
    message: S.optional(S.String),
  },
) {}
export class UnrecognizedClientException extends S.TaggedError<UnrecognizedClientException>()(
  "UnrecognizedClientException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * The UntagLogGroup operation is on the path to deprecation. We recommend that you use
 * UntagResource instead.
 *
 * Removes the specified tags from the specified log group.
 *
 * To list the tags for a log group, use ListTagsForResource. To add tags, use TagResource.
 *
 * When using IAM policies to control tag management for CloudWatch Logs log groups, the
 * condition keys `aws:Resource/key-name` and `aws:TagKeys` cannot be used
 * to restrict which tags users can assign.
 */
export const untagLogGroup: (
  input: UntagLogGroupRequest,
) => Effect.Effect<
  UntagLogGroupResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagLogGroupRequest,
  output: UntagLogGroupResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * The TagLogGroup operation is on the path to deprecation. We recommend that you use
 * TagResource
 * instead.
 *
 * Adds or updates the specified tags for the specified log group.
 *
 * To list the tags for a log group, use ListTagsForResource. To remove tags, use UntagResource.
 *
 * For more information about tags, see Tag Log Groups in Amazon CloudWatch Logs in the Amazon CloudWatch Logs
 * User Guide.
 *
 * CloudWatch Logs doesn't support IAM policies that prevent users from assigning specified
 * tags to log groups using the aws:Resource/*key-name*
 * or
 * `aws:TagKeys` condition keys. For more information about using tags to control
 * access, see Controlling access to Amazon Web Services resources using tags.
 */
export const tagLogGroup: (
  input: TagLogGroupRequest,
) => Effect.Effect<
  TagLogGroupResponse,
  InvalidParameterException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagLogGroupRequest,
  output: TagLogGroupResponse,
  errors: [InvalidParameterException, ResourceNotFoundException],
}));
/**
 * Returns information about a log group data protection policy.
 */
export const getDataProtectionPolicy: (
  input: GetDataProtectionPolicyRequest,
) => Effect.Effect<
  GetDataProtectionPolicyResponse,
  | InvalidParameterException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataProtectionPolicyRequest,
  output: GetDataProtectionPolicyResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Retrieves information about the log anomaly detector that you specify. The KMS key ARN detected is valid.
 */
export const getLogAnomalyDetector: (
  input: GetLogAnomalyDetectorRequest,
) => Effect.Effect<
  GetLogAnomalyDetectorResponse,
  | InvalidParameterException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLogAnomalyDetectorRequest,
  output: GetLogAnomalyDetectorResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates or updates a destination. This operation is used only to create destinations
 * for cross-account subscriptions.
 *
 * A destination encapsulates a physical resource (such as an Amazon Kinesis stream). With
 * a destination, you can subscribe to a real-time stream of log events for a different account,
 * ingested using PutLogEvents.
 *
 * Through an access policy, a destination controls what is written to it. By default,
 * `PutDestination` does not set any access policy with the destination, which means
 * a cross-account user cannot call PutSubscriptionFilter against this destination. To enable this, the destination
 * owner must call PutDestinationPolicy after `PutDestination`.
 *
 * To perform a `PutDestination` operation, you must also have the
 * `iam:PassRole` permission.
 */
export const putDestination: (
  input: PutDestinationRequest,
) => Effect.Effect<
  PutDestinationResponse,
  | InvalidParameterException
  | OperationAbortedException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDestinationRequest,
  output: PutDestinationResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ServiceUnavailableException,
  ],
}));
/**
 * Use this operation to *suppress* anomaly detection for a specified
 * anomaly or pattern. If you suppress an anomaly, CloudWatch Logs won't report new
 * occurrences of that anomaly and won't update that anomaly with new data. If you suppress a
 * pattern, CloudWatch Logs won't report any anomalies related to that pattern.
 *
 * You must specify either `anomalyId` or `patternId`, but you can't
 * specify both parameters in the same operation.
 *
 * If you have previously used this operation to suppress detection of a pattern or anomaly,
 * you can use it again to cause CloudWatch Logs to end the suppression. To do this, use this
 * operation and specify the anomaly or pattern to stop suppressing, and omit the
 * `suppressionType` and `suppressionPeriod` parameters.
 */
export const updateAnomaly: (
  input: UpdateAnomalyRequest,
) => Effect.Effect<
  UpdateAnomalyResponse,
  | InvalidParameterException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAnomalyRequest,
  output: UpdateAnomalyResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes a CloudWatch Logs account policy. This stops the account-wide policy from
 * applying to log groups or data sources in the account. If you delete a data protection policy
 * or subscription filter policy, any log-group level policies of those types remain in effect.
 * This operation supports deletion of data source-based field index policies, including facet
 * configurations, in addition to log group-based policies.
 *
 * To use this operation, you must be signed on with the correct permissions depending on the
 * type of policy that you are deleting.
 *
 * - To delete a data protection policy, you must have the
 * `logs:DeleteDataProtectionPolicy` and `logs:DeleteAccountPolicy`
 * permissions.
 *
 * - To delete a subscription filter policy, you must have the
 * `logs:DeleteSubscriptionFilter` and `logs:DeleteAccountPolicy`
 * permissions.
 *
 * - To delete a transformer policy, you must have the `logs:DeleteTransformer`
 * and `logs:DeleteAccountPolicy` permissions.
 *
 * - To delete a field index policy, you must have the `logs:DeleteIndexPolicy`
 * and `logs:DeleteAccountPolicy` permissions.
 *
 * If you delete a field index policy that included facet configurations, those facets
 * will no longer be available for interactive exploration in the CloudWatch Logs Insights
 * console. However, facet data is retained for up to 30 days.
 *
 * If you delete a field index policy, the indexing of the log events that happened before
 * you deleted the policy will still be used for up to 30 days to improve CloudWatch Logs
 * Insights queries.
 */
export const deleteAccountPolicy: (
  input: DeleteAccountPolicyRequest,
) => Effect.Effect<
  DeleteAccountPolicyResponse,
  | InvalidParameterException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccountPolicyRequest,
  output: DeleteAccountPolicyResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes the data protection policy from the specified log group.
 *
 * For more information about data protection policies, see PutDataProtectionPolicy.
 */
export const deleteDataProtectionPolicy: (
  input: DeleteDataProtectionPolicyRequest,
) => Effect.Effect<
  DeleteDataProtectionPolicyResponse,
  | InvalidParameterException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataProtectionPolicyRequest,
  output: DeleteDataProtectionPolicyResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes the specified destination, and eventually disables all the subscription filters
 * that publish to it. This operation does not delete the physical resource encapsulated by the
 * destination.
 */
export const deleteDestination: (
  input: DeleteDestinationRequest,
) => Effect.Effect<
  DeleteDestinationResponse,
  | InvalidParameterException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDestinationRequest,
  output: DeleteDestinationResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes the specified CloudWatch Logs anomaly detector.
 */
export const deleteLogAnomalyDetector: (
  input: DeleteLogAnomalyDetectorRequest,
) => Effect.Effect<
  DeleteLogAnomalyDetectorResponse,
  | InvalidParameterException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLogAnomalyDetectorRequest,
  output: DeleteLogAnomalyDetectorResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes the specified metric filter.
 */
export const deleteMetricFilter: (
  input: DeleteMetricFilterRequest,
) => Effect.Effect<
  DeleteMetricFilterResponse,
  | InvalidParameterException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMetricFilterRequest,
  output: DeleteMetricFilterResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes a resource policy from this account. This revokes the access of the identities
 * in that policy to put log events to this account.
 */
export const deleteResourcePolicy: (
  input: DeleteResourcePolicyRequest,
) => Effect.Effect<
  DeleteResourcePolicyResponse,
  | InvalidParameterException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourcePolicyRequest,
  output: DeleteResourcePolicyResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes the specified retention policy.
 *
 * Log events do not expire if they belong to log groups without a retention
 * policy.
 */
export const deleteRetentionPolicy: (
  input: DeleteRetentionPolicyRequest,
) => Effect.Effect<
  DeleteRetentionPolicyResponse,
  | InvalidParameterException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRetentionPolicyRequest,
  output: DeleteRetentionPolicyResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes the specified subscription filter.
 */
export const deleteSubscriptionFilter: (
  input: DeleteSubscriptionFilterRequest,
) => Effect.Effect<
  DeleteSubscriptionFilterResponse,
  | InvalidParameterException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSubscriptionFilterRequest,
  output: DeleteSubscriptionFilterResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Disassociates the specified KMS key from the specified log group or
 * from all CloudWatch Logs Insights query results in the account.
 *
 * When you use `DisassociateKmsKey`, you specify either the
 * `logGroupName` parameter or the `resourceIdentifier` parameter. You
 * can't specify both of those parameters in the same operation.
 *
 * - Specify the `logGroupName` parameter to stop using the KMS key to encrypt future log events ingested and stored in the log group.
 * Instead, they will be encrypted with the default CloudWatch Logs method. The log events
 * that were ingested while the key was associated with the log group are still encrypted
 * with that key. Therefore, CloudWatch Logs will need permissions for the key whenever
 * that data is accessed.
 *
 * - Specify the `resourceIdentifier` parameter with the
 * `query-result` resource to stop using the KMS key to
 * encrypt the results of all future StartQuery
 * operations in the account. They will instead be encrypted with the default CloudWatch Logs method. The results from queries that ran while the key was associated with
 * the account are still encrypted with that key. Therefore, CloudWatch Logs will need
 * permissions for the key whenever that data is accessed.
 *
 * It can take up to 5 minutes for this operation to take effect.
 */
export const disassociateKmsKey: (
  input: DisassociateKmsKeyRequest,
) => Effect.Effect<
  DisassociateKmsKeyResponse,
  | InvalidParameterException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateKmsKeyRequest,
  output: DisassociateKmsKeyResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates or updates an access policy associated with an existing destination. An access
 * policy is an IAM
 * policy document that is used to authorize claims to register a subscription filter
 * against a given destination.
 */
export const putDestinationPolicy: (
  input: PutDestinationPolicyRequest,
) => Effect.Effect<
  PutDestinationPolicyResponse,
  | InvalidParameterException
  | OperationAbortedException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDestinationPolicyRequest,
  output: PutDestinationPolicyResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ServiceUnavailableException,
  ],
}));
/**
 * Sets the retention of the specified log group. With a retention policy, you can
 * configure the number of days for which to retain log events in the specified log
 * group.
 *
 * CloudWatch Logs doesn't immediately delete log events when they reach their retention
 * setting. It typically takes up to 72 hours after that before log events are deleted, but in
 * rare situations might take longer.
 *
 * To illustrate, imagine that you change a log group to have a longer retention setting
 * when it contains log events that are past the expiration date, but haven't been deleted.
 * Those log events will take up to 72 hours to be deleted after the new retention date is
 * reached. To make sure that log data is deleted permanently, keep a log group at its lower
 * retention setting until 72 hours after the previous retention period ends. Alternatively,
 * wait to change the retention setting until you confirm that the earlier log events are
 * deleted.
 *
 * When log events reach their retention setting they are marked for deletion. After they
 * are marked for deletion, they do not add to your archival storage costs anymore, even if
 * they are not actually deleted until later. These log events marked for deletion are also not
 * included when you use an API to retrieve the `storedBytes` value to see how many
 * bytes a log group is storing.
 */
export const putRetentionPolicy: (
  input: PutRetentionPolicyRequest,
) => Effect.Effect<
  PutRetentionPolicyResponse,
  | InvalidParameterException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRetentionPolicyRequest,
  output: PutRetentionPolicyResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Updates an existing log anomaly detector.
 */
export const updateLogAnomalyDetector: (
  input: UpdateLogAnomalyDetectorRequest,
) => Effect.Effect<
  UpdateLogAnomalyDetectorResponse,
  | InvalidParameterException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLogAnomalyDetectorRequest,
  output: UpdateLogAnomalyDetectorResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes the log transformer for the specified log group. As soon as you do this, the
 * transformation of incoming log events according to that transformer stops. If this account has
 * an account-level transformer that applies to this log group, the log group begins using that
 * account-level transformer when this log-group level transformer is deleted.
 *
 * After you delete a transformer, be sure to edit any metric filters or subscription filters
 * that relied on the transformed versions of the log events.
 */
export const deleteTransformer: (
  input: DeleteTransformerRequest,
) => Effect.Effect<
  DeleteTransformerResponse,
  | InvalidOperationException
  | InvalidParameterException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTransformerRequest,
  output: DeleteTransformerResponse,
  errors: [
    InvalidOperationException,
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Enables or disables deletion protection for the specified log group. When enabled on a
 * log group, deletion protection blocks all deletion operations until it is explicitly
 * disabled.
 *
 * For information about the parameters that are common to all actions, see Common Parameters.
 */
export const putLogGroupDeletionProtection: (
  input: PutLogGroupDeletionProtectionRequest,
) => Effect.Effect<
  PutLogGroupDeletionProtectionResponse,
  | AccessDeniedException
  | InvalidOperationException
  | InvalidParameterException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutLogGroupDeletionProtectionRequest,
  output: PutLogGroupDeletionProtectionResponse,
  errors: [
    AccessDeniedException,
    InvalidOperationException,
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates an *anomaly detector* that regularly scans one or more log
 * groups and look for patterns and anomalies in the logs.
 *
 * An anomaly detector can help surface issues by automatically discovering anomalies in your
 * log event traffic. An anomaly detector uses machine learning algorithms to scan log events and
 * find *patterns*. A pattern is a shared text structure that recurs among
 * your log fields. Patterns provide a useful tool for analyzing large sets of logs because a
 * large number of log events can often be compressed into a few patterns.
 *
 * The anomaly detector uses pattern recognition to find `anomalies`, which are
 * unusual log events. It uses the `evaluationFrequency` to compare current log events
 * and patterns with trained baselines.
 *
 * Fields within a pattern are called *tokens*. Fields that vary within a
 * pattern, such as a request ID or timestamp, are referred to as dynamic
 * tokens and represented by ``.
 *
 * The following is an example of a pattern:
 *
 * `[INFO] Request time: ms`
 *
 * This pattern represents log events like `[INFO] Request time: 327 ms` and other
 * similar log events that differ only by the number, in this csse 327. When the pattern is
 * displayed, the different numbers are replaced by ``
 *
 * Any parts of log events that are masked as sensitive data are not scanned for anomalies.
 * For more information about masking sensitive data, see Help protect sensitive log
 * data with masking.
 */
export const createLogAnomalyDetector: (
  input: CreateLogAnomalyDetectorRequest,
) => Effect.Effect<
  CreateLogAnomalyDetectorResponse,
  | InvalidParameterException
  | LimitExceededException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLogAnomalyDetectorRequest,
  output: CreateLogAnomalyDetectorResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates an account-level data protection policy, subscription filter policy, field index
 * policy, transformer policy, or metric extraction policy that applies to all log groups, a
 * subset of log groups, or a data source name and type combination in the account.
 *
 * For field index policies, you can configure indexed fields as *facets*
 * to enable interactive exploration of your logs. Facets provide value distributions and counts
 * for indexed fields in the CloudWatch Logs Insights console without requiring query
 * execution. For more information, see Use facets to group and
 * explore logs.
 *
 * To use this operation, you must be signed on with the correct permissions depending on the
 * type of policy that you are creating.
 *
 * - To create a data protection policy, you must have the
 * `logs:PutDataProtectionPolicy` and `logs:PutAccountPolicy`
 * permissions.
 *
 * - To create a subscription filter policy, you must have the
 * `logs:PutSubscriptionFilter` and `logs:PutAccountPolicy`
 * permissions.
 *
 * - To create a transformer policy, you must have the `logs:PutTransformer` and
 * `logs:PutAccountPolicy` permissions.
 *
 * - To create a field index policy, you must have the `logs:PutIndexPolicy` and
 * `logs:PutAccountPolicy` permissions.
 *
 * - To configure facets for field index policies, you must have the
 * `logs:PutIndexPolicy` and `logs:PutAccountPolicy`
 * permissions.
 *
 * - To create a metric extraction policy, you must have the
 * `logs:PutMetricExtractionPolicy` and `logs:PutAccountPolicy`
 * permissions.
 *
 * **Data protection policy**
 *
 * A data protection policy can help safeguard sensitive data that's ingested by your log
 * groups by auditing and masking the sensitive log data. Each account can have only one
 * account-level data protection policy.
 *
 * Sensitive data is detected and masked when it is ingested into a log group. When you set
 * a data protection policy, log events ingested into the log groups before that time are not
 * masked.
 *
 * If you use `PutAccountPolicy` to create a data protection policy for your whole
 * account, it applies to both existing log groups and all log groups that are created later in
 * this account. The account-level policy is applied to existing log groups with eventual
 * consistency. It might take up to 5 minutes before sensitive data in existing log groups begins
 * to be masked.
 *
 * By default, when a user views a log event that includes masked data, the sensitive data is
 * replaced by asterisks. A user who has the `logs:Unmask` permission can use a GetLogEvents or FilterLogEvents operation with the `unmask` parameter set to
 * `true` to view the unmasked log events. Users with the `logs:Unmask`
 * can also view unmasked data in the CloudWatch Logs console by running a CloudWatch Logs
 * Insights query with the `unmask` query command.
 *
 * For more information, including a list of types of data that can be audited and masked,
 * see Protect sensitive log data
 * with masking.
 *
 * To use the `PutAccountPolicy` operation for a data protection policy, you must
 * be signed on with the `logs:PutDataProtectionPolicy` and
 * `logs:PutAccountPolicy` permissions.
 *
 * The `PutAccountPolicy` operation applies to all log groups in the account. You
 * can use PutDataProtectionPolicy to create a data protection policy that applies to just one
 * log group. If a log group has its own data protection policy and the account also has an
 * account-level data protection policy, then the two policies are cumulative. Any sensitive term
 * specified in either policy is masked.
 *
 * **Subscription filter policy**
 *
 * A subscription filter policy sets up a real-time feed of log events from CloudWatch Logs to other Amazon Web Services services. Account-level subscription filter policies apply to
 * both existing log groups and log groups that are created later in this account. Supported
 * destinations are Kinesis Data Streams, Firehose, and Lambda. When log
 * events are sent to the receiving service, they are Base64 encoded and compressed with the GZIP
 * format.
 *
 * The following destinations are supported for subscription filters:
 *
 * - An Kinesis Data Streams data stream in the same account as the subscription policy, for
 * same-account delivery.
 *
 * - An Firehose data stream in the same account as the subscription policy, for
 * same-account delivery.
 *
 * - A Lambda function in the same account as the subscription policy, for
 * same-account delivery.
 *
 * - A logical destination in a different account created with PutDestination, for cross-account delivery. Kinesis Data Streams and Firehose are supported as logical destinations.
 *
 * Each account can have one account-level subscription filter policy per Region. If you are
 * updating an existing filter, you must specify the correct name in `PolicyName`. To
 * perform a `PutAccountPolicy` subscription filter operation for any destination
 * except a Lambda function, you must also have the `iam:PassRole`
 * permission.
 *
 * **Transformer policy**
 *
 * Creates or updates a *log transformer policy* for your account. You use
 * log transformers to transform log events into a different format, making them easier for you
 * to process and analyze. You can also transform logs from different sources into standardized
 * formats that contain relevant, source-specific information. After you have created a
 * transformer, CloudWatch Logs performs this transformation at the time of log ingestion. You
 * can then refer to the transformed versions of the logs during operations such as querying with
 * CloudWatch Logs Insights or creating metric filters or subscription filters.
 *
 * You can also use a transformer to copy metadata from metadata keys into the log events
 * themselves. This metadata can include log group name, log stream name, account ID and
 * Region.
 *
 * A transformer for a log group is a series of processors, where each processor applies one
 * type of transformation to the log events ingested into this log group. For more information
 * about the available processors to use in a transformer, see Processors that you can use.
 *
 * Having log events in standardized format enables visibility across your applications for
 * your log analysis, reporting, and alarming needs. CloudWatch Logs provides transformation
 * for common log types with out-of-the-box transformation templates for major Amazon Web Services
 * log sources such as VPC flow logs, Lambda, and Amazon RDS. You can use
 * pre-built transformation templates or create custom transformation policies.
 *
 * You can create transformers only for the log groups in the Standard log class.
 *
 * You can have one account-level transformer policy that applies to all log groups in the
 * account. Or you can create as many as 20 account-level transformer policies that are each
 * scoped to a subset of log groups with the `selectionCriteria` parameter. If you
 * have multiple account-level transformer policies with selection criteria, no two of them can
 * use the same or overlapping log group name prefixes. For example, if you have one policy
 * filtered to log groups that start with `my-log`, you can't have another transformer
 * policy filtered to `my-logpprod` or `my-logging`.
 *
 * You can also set up a transformer at the log-group level. For more information, see PutTransformer. If there is both a log-group level transformer created with
 * `PutTransformer` and an account-level transformer that could apply to the same
 * log group, the log group uses only the log-group level transformer. It ignores the
 * account-level transformer.
 *
 * **Field index policy**
 *
 * You can use field index policies to create indexes on fields found in log events for a log
 * group or data source name and type combination. Creating field indexes can help lower the scan
 * volume for CloudWatch Logs Insights queries that reference those fields, because these
 * queries attempt to skip the processing of log events that are known to not match the indexed
 * field. Good fields to index are fields that you often need to query for and fields or values
 * that match only a small fraction of the total log events. Common examples of indexes include
 * request ID, session ID, user IDs, or instance IDs. For more information, see Create field indexes to improve query performance and reduce costs
 *
 * To find the fields that are in your log group events, use the GetLogGroupFields operation. To find the fields for a data source use the GetLogFields operation.
 *
 * For example, suppose you have created a field index for `requestId`. Then, any
 * CloudWatch Logs Insights query on that log group that includes requestId =
 * *value*
 * or requestId in [*value*,
 * *value*, ...] will attempt to process only the log events where
 * the indexed field matches the specified value.
 *
 * Matches of log events to the names of indexed fields are case-sensitive. For example, an
 * indexed field of `RequestId` won't match a log event containing
 * `requestId`.
 *
 * You can have one account-level field index policy that applies to all log groups in the
 * account. Or you can create as many as 20 account-level field index policies that are each
 * scoped to a subset of log groups using `LogGroupNamePrefix` with the
 * `selectionCriteria` parameter. You can have another 20 account-level field index
 * policies using `DataSourceName` and `DataSourceType` for the
 * `selectionCriteria` parameter. If you have multiple account-level index policies
 * with `LogGroupNamePrefix` selection criteria, no two of them can use the same or
 * overlapping log group name prefixes. For example, if you have one policy filtered to log
 * groups that start with *my-log*, you can't have another field index policy
 * filtered to *my-logpprod* or *my-logging*. Similarly, if
 * you have multiple account-level index policies with `DataSourceName` and
 * `DataSourceType` selection criteria, no two of them can use the same data source
 * name and type combination. For example, if you have one policy filtered to the data source
 * name `amazon_vpc` and data source type `flow` you cannot create another
 * policy with this combination.
 *
 * If you create an account-level field index policy in a monitoring account in cross-account
 * observability, the policy is applied only to the monitoring account and not to any source
 * accounts.
 *
 * CloudWatch Logs provides default field indexes for all log groups in the Standard log
 * class. Default field indexes are automatically available for the following fields:
 *
 * - `@logStream`
 *
 * - `@aws.region`
 *
 * - `@aws.account`
 *
 * - `@source.log`
 *
 * - `@data_source_name`
 *
 * - `@data_source_type`
 *
 * - `@data_format`
 *
 * - `traceId`
 *
 * - `severityText`
 *
 * - `attributes.session.id`
 *
 * CloudWatch Logs provides default field indexes for certain data source name and type
 * combinations as well. Default field indexes are automatically available for the following data
 * source name and type combinations as identified in the following list:
 *
 * `amazon_vpc.flow`
 *
 * - `action`
 *
 * - `logStatus`
 *
 * - `region`
 *
 * - `flowDirection`
 *
 * - `type`
 *
 * `amazon_route53.resolver_query`
 *
 * - `transport`
 *
 * - `rcode`
 *
 * `aws_waf.access`
 *
 * - `action`
 *
 * - `httpRequest.country`
 *
 * `aws_cloudtrail.data`, `aws_cloudtrail.management`
 *
 * - `eventSource`
 *
 * - `eventName`
 *
 * - `awsRegion`
 *
 * - `userAgent`
 *
 * - `errorCode`
 *
 * - `eventType`
 *
 * - `managementEvent`
 *
 * - `readOnly`
 *
 * - `eventCategory`
 *
 * - `requestId`
 *
 * Default field indexes are in addition to any custom field indexes you define within your
 * policy. Default field indexes are not counted towards your field index
 * quota.
 *
 * If you want to create a field index policy for a single log group, you can use PutIndexPolicy instead of `PutAccountPolicy`. If you do so, that log
 * group will use that log-group level policy and any account-level policies that match at the
 * data source level; any account-level policy that matches at the log group level (for example,
 * no selection criteria or log group name prefix selection criteria) will be ignored.
 *
 * **Metric extraction policy**
 *
 * A metric extraction policy controls whether CloudWatch Metrics can be created through the
 * Embedded Metrics Format (EMF) for log groups in your account. By default, EMF metric creation
 * is enabled for all log groups. You can use metric extraction policies to disable EMF metric
 * creation for your entire account or specific log groups.
 *
 * When a policy disables EMF metric creation for a log group, log events in the EMF format
 * are still ingested, but no CloudWatch Metrics are created from them.
 *
 * Creating a policy disables metrics for AWS features that use EMF to create metrics, such
 * as CloudWatch Container Insights and CloudWatch Application Signals. To prevent turning off
 * those features by accident, we recommend that you exclude the underlying log-groups through
 * a selection-criteria such as LogGroupNamePrefix NOT IN ["/aws/containerinsights",
 * "/aws/ecs/containerinsights", "/aws/application-signals/data"].
 *
 * Each account can have either one account-level metric extraction policy that applies to
 * all log groups, or up to 5 policies that are each scoped to a subset of log groups with the
 * `selectionCriteria` parameter. The selection criteria supports filtering by
 * `LogGroupName` and `LogGroupNamePrefix` using the operators
 * `IN` and `NOT IN`. You can specify up to 50 values in each
 * `IN` or `NOT IN` list.
 *
 * The selection criteria can be specified in these formats:
 *
 * `LogGroupName IN ["log-group-1", "log-group-2"]`
 *
 * `LogGroupNamePrefix NOT IN ["/aws/prefix1", "/aws/prefix2"]`
 *
 * If you have multiple account-level metric extraction policies with selection criteria, no
 * two of them can have overlapping criteria. For example, if you have one policy with selection
 * criteria `LogGroupNamePrefix IN ["my-log"]`, you can't have another metric
 * extraction policy with selection criteria `LogGroupNamePrefix IN ["/my-log-prod"]`
 * or `LogGroupNamePrefix IN ["/my-logging"]`, as the set of log groups matching these
 * prefixes would be a subset of the log groups matching the first policy's prefix, creating an
 * overlap.
 *
 * When using `NOT IN`, only one policy with this operator is allowed per
 * account.
 *
 * When combining policies with `IN` and `NOT IN` operators, the
 * overlap check ensures that policies don't have conflicting effects. Two policies with
 * `IN` and `NOT IN` operators do not overlap if and only if every value
 * in the `IN `policy is completely contained within some value in the NOT
 * IN policy. For example:
 *
 * - If you have a `NOT IN` policy for prefix `"/aws/lambda"`, you
 * can create an `IN` policy for the exact log group name
 * `"/aws/lambda/function1"` because the set of log groups matching
 * `"/aws/lambda/function1"` is a subset of the log groups matching
 * `"/aws/lambda"`.
 *
 * - If you have a `NOT IN` policy for prefix `"/aws/lambda"`, you
 * cannot create an `IN` policy for prefix `"/aws"` because the set of
 * log groups matching `"/aws"` is not a subset of the log groups matching
 * `"/aws/lambda"`.
 */
export const putAccountPolicy: (
  input: PutAccountPolicyRequest,
) => Effect.Effect<
  PutAccountPolicyResponse,
  | InvalidParameterException
  | LimitExceededException
  | OperationAbortedException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAccountPolicyRequest,
  output: PutAccountPolicyResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    OperationAbortedException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates a data protection policy for the specified log group. A data protection policy can
 * help safeguard sensitive data that's ingested by the log group by auditing and masking the
 * sensitive log data.
 *
 * Sensitive data is detected and masked when it is ingested into the log group. When you
 * set a data protection policy, log events ingested into the log group before that time are
 * not masked.
 *
 * By default, when a user views a log event that includes masked data, the sensitive data is
 * replaced by asterisks. A user who has the `logs:Unmask` permission can use a GetLogEvents or FilterLogEvents operation with the `unmask` parameter set to
 * `true` to view the unmasked log events. Users with the `logs:Unmask`
 * can also view unmasked data in the CloudWatch Logs console by running a CloudWatch Logs
 * Insights query with the `unmask` query command.
 *
 * For more information, including a list of types of data that can be audited and masked,
 * see Protect sensitive log data
 * with masking.
 *
 * The `PutDataProtectionPolicy` operation applies to only the specified log
 * group. You can also use PutAccountPolicy to create an account-level data protection policy that applies to
 * all log groups in the account, including both existing log groups and log groups that are
 * created level. If a log group has its own data protection policy and the account also has an
 * account-level data protection policy, then the two policies are cumulative. Any sensitive term
 * specified in either policy is masked.
 */
export const putDataProtectionPolicy: (
  input: PutDataProtectionPolicyRequest,
) => Effect.Effect<
  PutDataProtectionPolicyResponse,
  | InvalidParameterException
  | LimitExceededException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDataProtectionPolicyRequest,
  output: PutDataProtectionPolicyResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates or updates a *field index policy* for the specified log group.
 * Only log groups in the Standard log class support field index policies. For more information
 * about log classes, see Log
 * classes.
 *
 * You can use field index policies to create *field indexes* on fields
 * found in log events in the log group. Creating field indexes speeds up and lowers the costs
 * for CloudWatch Logs Insights queries that reference those field indexes, because these
 * queries attempt to skip the processing of log events that are known to not match the indexed
 * field. Good fields to index are fields that you often need to query for and fields or values
 * that match only a small fraction of the total log events. Common examples of indexes include
 * request ID, session ID, userID, and instance IDs. For more information, see Create field indexes to improve query performance and reduce costs.
 *
 * You can configure indexed fields as *facets* to enable interactive
 * exploration and filtering of your logs in the CloudWatch Logs Insights console. Facets
 * allow you to view value distributions and counts for indexed fields without running queries.
 * When you create a field index, you can optionally set it as a facet to enable this interactive
 * analysis capability. For more information, see Use facets to group and
 * explore logs.
 *
 * To find the fields that are in your log group events, use the GetLogGroupFields operation.
 *
 * For example, suppose you have created a field index for `requestId`. Then, any
 * CloudWatch Logs Insights query on that log group that includes requestId =
 * *value*
 * or requestId IN [*value*,
 * *value*, ...] will process fewer log events to reduce costs, and
 * have improved performance.
 *
 * CloudWatch Logs provides default field indexes for all log groups in the Standard log
 * class. Default field indexes are automatically available for the following fields:
 *
 * - `@logStream`
 *
 * - `@aws.region`
 *
 * - `@aws.account`
 *
 * - `@source.log`
 *
 * - `traceId`
 *
 * Default field indexes are in addition to any custom field indexes you define within your
 * policy. Default field indexes are not counted towards your field index quota.
 *
 * Each index policy has the following quotas and restrictions:
 *
 * - As many as 20 fields can be included in the policy.
 *
 * - Each field name can include as many as 100 characters.
 *
 * Matches of log events to the names of indexed fields are case-sensitive. For example, a
 * field index of `RequestId` won't match a log event containing
 * `requestId`.
 *
 * Log group-level field index policies created with `PutIndexPolicy` override
 * account-level field index policies created with PutAccountPolicy that apply to log groups. If you use `PutIndexPolicy`
 * to create a field index policy for a log group, that log group uses only that policy for log
 * group-level indexing, including any facet configurations. The log group ignores any
 * account-wide field index policy that applies to log groups, but data source-based account
 * policies may still apply.
 */
export const putIndexPolicy: (
  input: PutIndexPolicyRequest,
) => Effect.Effect<
  PutIndexPolicyResponse,
  | InvalidParameterException
  | LimitExceededException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutIndexPolicyRequest,
  output: PutIndexPolicyResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates or updates a query definition for CloudWatch Logs Insights. For more information,
 * see Analyzing Log Data with CloudWatch Logs Insights.
 *
 * To update a query definition, specify its `queryDefinitionId` in your request.
 * The values of `name`, `queryString`, and `logGroupNames` are
 * changed to the values that you specify in your update operation. No current values are
 * retained from the current query definition. For example, imagine updating a current query
 * definition that includes log groups. If you don't specify the `logGroupNames`
 * parameter in your update operation, the query definition changes to contain no log
 * groups.
 *
 * You must have the `logs:PutQueryDefinition` permission to be able to perform
 * this operation.
 */
export const putQueryDefinition: (
  input: PutQueryDefinitionRequest,
) => Effect.Effect<
  PutQueryDefinitionResponse,
  | InvalidParameterException
  | LimitExceededException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutQueryDefinitionRequest,
  output: PutQueryDefinitionResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates or updates a resource policy allowing other Amazon Web Services services to put
 * log events to this account, such as Amazon Route 53. This API has the following
 * restrictions:
 *
 * - **Supported actions** - Policy only supports
 * `logs:PutLogEvents` and `logs:CreateLogStream ` actions
 *
 * - **Supported principals** - Policy only applies when
 * operations are invoked by Amazon Web Services service principals (not IAM
 * users, roles, or cross-account principals
 *
 * - **Policy limits** - An account can have a maximum of 10
 * policies without resourceARN and one per LogGroup resourceARN
 *
 * Resource policies with actions invoked by non-Amazon Web Services service principals
 * (such as IAM users, roles, or other Amazon Web Services accounts) will not be
 * enforced. For access control involving these principals, use the IAM
 * policies.
 */
export const putResourcePolicy: (
  input: PutResourcePolicyRequest,
) => Effect.Effect<
  PutResourcePolicyResponse,
  | InvalidParameterException
  | LimitExceededException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates a log group with the specified name. You can create up to 1,000,000 log groups
 * per Region per account.
 *
 * You must use the following guidelines when naming a log group:
 *
 * - Log group names must be unique within a Region for an Amazon Web Services
 * account.
 *
 * - Log group names can be between 1 and 512 characters long.
 *
 * - Log group names consist of the following characters: a-z, A-Z, 0-9, '_'
 * (underscore), '-' (hyphen), '/' (forward slash), '.' (period), and '#' (number
 * sign)
 *
 * - Log group names can't start with the string `aws/`
 *
 * When you create a log group, by default the log events in the log group do not expire.
 * To set a retention policy so that events expire and are deleted after a specified time, use
 * PutRetentionPolicy.
 *
 * If you associate an KMS key with the log group, ingested data is
 * encrypted using the KMS key. This association is stored as long as the data
 * encrypted with the KMS key is still within CloudWatch Logs. This enables
 * CloudWatch Logs to decrypt this data whenever it is requested.
 *
 * If you attempt to associate a KMS key with the log group but the KMS key does not exist or the KMS key is disabled, you receive an
 * `InvalidParameterException` error.
 *
 * CloudWatch Logs supports only symmetric KMS keys. Do not associate an
 * asymmetric KMS key with your log group. For more information, see Using
 * Symmetric and Asymmetric Keys.
 */
export const createLogGroup: (
  input: CreateLogGroupRequest,
) => Effect.Effect<
  CreateLogGroupResponse,
  | InvalidParameterException
  | LimitExceededException
  | OperationAbortedException
  | ResourceAlreadyExistsException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLogGroupRequest,
  output: CreateLogGroupResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    OperationAbortedException,
    ResourceAlreadyExistsException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes a log-group level field index policy that was applied to a single log group. The
 * indexing of the log events that happened before you delete the policy will still be used for
 * as many as 30 days to improve CloudWatch Logs Insights queries.
 *
 * If the deleted policy included facet configurations, those facets will no longer be
 * available for interactive exploration in the CloudWatch Logs Insights console for this log
 * group. However, facet data is retained for up to 30 days.
 *
 * You can't use this operation to delete an account-level index policy. Instead, use DeleteAccountPolicy.
 *
 * If you delete a log-group level field index policy and there is an account-level field
 * index policy, in a few minutes the log group begins using that account-wide policy to index
 * new incoming log events. This operation only affects log group-level policies, including any
 * facet configurations, and preserves any data source-based account policies that may apply to
 * the log group.
 */
export const deleteIndexPolicy: (
  input: DeleteIndexPolicyRequest,
) => Effect.Effect<
  DeleteIndexPolicyResponse,
  | InvalidParameterException
  | LimitExceededException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIndexPolicyRequest,
  output: DeleteIndexPolicyResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates or updates a subscription filter and associates it with the specified log
 * group. With subscription filters, you can subscribe to a real-time stream of log events
 * ingested through PutLogEvents
 * and have them delivered to a specific destination. When log events are sent to the receiving
 * service, they are Base64 encoded and compressed with the GZIP format.
 *
 * The following destinations are supported for subscription filters:
 *
 * - An Amazon Kinesis data stream belonging to the same account as the subscription
 * filter, for same-account delivery.
 *
 * - A logical destination created with PutDestination that belongs to a different account, for cross-account delivery.
 * We currently support Kinesis Data Streams and Firehose as logical
 * destinations.
 *
 * - An Amazon Kinesis Data Firehose delivery stream that belongs to the same account as
 * the subscription filter, for same-account delivery.
 *
 * - An Lambda function that belongs to the same account as the
 * subscription filter, for same-account delivery.
 *
 * Each log group can have up to two subscription filters associated with it. If you are
 * updating an existing filter, you must specify the correct name in `filterName`.
 *
 * Using regular expressions in filter patterns is supported. For these filters, there is a
 * quotas of quota of two regular expression patterns within a single filter pattern. There is
 * also a quota of five regular expression patterns per log group. For more information about
 * using regular expressions in filter patterns, see Filter pattern syntax for
 * metric filters, subscription filters, filter log events, and Live Tail.
 *
 * To perform a `PutSubscriptionFilter` operation for any destination except a
 * Lambda function, you must also have the `iam:PassRole`
 * permission.
 */
export const putSubscriptionFilter: (
  input: PutSubscriptionFilterRequest,
) => Effect.Effect<
  PutSubscriptionFilterResponse,
  | InvalidOperationException
  | InvalidParameterException
  | LimitExceededException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutSubscriptionFilterRequest,
  output: PutSubscriptionFilterResponse,
  errors: [
    InvalidOperationException,
    InvalidParameterException,
    LimitExceededException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates an export task so that you can efficiently export data from a log group to an
 * Amazon S3 bucket. When you perform a `CreateExportTask` operation, you must use
 * credentials that have permission to write to the S3 bucket that you specify as the
 * destination.
 *
 * Exporting log data to S3 buckets that are encrypted by KMS is supported.
 * Exporting log data to Amazon S3 buckets that have S3 Object Lock enabled with a
 * retention period is also supported.
 *
 * Exporting to S3 buckets that are encrypted with AES-256 is supported.
 *
 * This is an asynchronous call. If all the required information is provided, this
 * operation initiates an export task and responds with the ID of the task. After the task has
 * started, you can use DescribeExportTasks to get the status of the export task. Each account can only
 * have one active (`RUNNING` or `PENDING`) export task at a time. To
 * cancel an export task, use CancelExportTask.
 *
 * You can export logs from multiple log groups or multiple time ranges to the same S3
 * bucket. To separate log data for each export task, specify a prefix to be used as the Amazon
 * S3 key prefix for all exported objects.
 *
 * We recommend that you don't regularly export to Amazon S3 as a way to
 * continuously archive your logs. For that use case, we instead recommend that you use
 * subscriptions. For more information about subscriptions, see Real-time processing of log data
 * with subscriptions.
 *
 * Time-based sorting on chunks of log data inside an exported file is not guaranteed. You
 * can sort the exported log field data by using Linux utilities.
 */
export const createExportTask: (
  input: CreateExportTaskRequest,
) => Effect.Effect<
  CreateExportTaskResponse,
  | InvalidParameterException
  | LimitExceededException
  | OperationAbortedException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateExportTaskRequest,
  output: CreateExportTaskResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    OperationAbortedException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Removes one or more tags from the specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | InvalidParameterException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Cancels the specified export task.
 *
 * The task must be in the `PENDING` or `RUNNING` state.
 */
export const cancelExportTask: (
  input: CancelExportTaskRequest,
) => Effect.Effect<
  CancelExportTaskResponse,
  | InvalidOperationException
  | InvalidParameterException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelExportTaskRequest,
  output: CancelExportTaskResponse,
  errors: [
    InvalidOperationException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes a saved CloudWatch Logs Insights query definition. A query definition contains
 * details about a saved CloudWatch Logs Insights query.
 *
 * Each `DeleteQueryDefinition` operation can delete one query definition.
 *
 * You must have the `logs:DeleteQueryDefinition` permission to be able to perform
 * this operation.
 */
export const deleteQueryDefinition: (
  input: DeleteQueryDefinitionRequest,
) => Effect.Effect<
  DeleteQueryDefinitionResponse,
  | InvalidParameterException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteQueryDefinitionRequest,
  output: DeleteQueryDefinitionResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns the information about the log transformer associated with this log group.
 *
 * This operation returns data only for transformers created at the log group level. To get
 * information for an account-level transformer, use DescribeAccountPolicies.
 */
export const getTransformer: (
  input: GetTransformerRequest,
) => Effect.Effect<
  GetTransformerResponse,
  | InvalidOperationException
  | InvalidParameterException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTransformerRequest,
  output: GetTransformerResponse,
  errors: [
    InvalidOperationException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns a list of the log groups that were analyzed during a single CloudWatch Logs
 * Insights query. This can be useful for queries that use log group name prefixes or the
 * `filterIndex` command, because the log groups are dynamically selected in these
 * cases.
 *
 * For more information about field indexes, see Create field indexes
 * to improve query performance and reduce costs.
 */
export const listLogGroupsForQuery: {
  (
    input: ListLogGroupsForQueryRequest,
  ): Effect.Effect<
    ListLogGroupsForQueryResponse,
    | AccessDeniedException
    | InvalidParameterException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLogGroupsForQueryRequest,
  ) => Stream.Stream<
    ListLogGroupsForQueryResponse,
    | AccessDeniedException
    | InvalidParameterException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLogGroupsForQueryRequest,
  ) => Stream.Stream<
    LogGroupIdentifier,
    | AccessDeniedException
    | InvalidParameterException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLogGroupsForQueryRequest,
  output: ListLogGroupsForQueryResponse,
  errors: [
    AccessDeniedException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "logGroupIdentifiers",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Displays the tags associated with a CloudWatch Logs resource. Currently, log groups and
 * destinations support tagging.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | InvalidParameterException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * The ListTagsLogGroup operation is on the path to deprecation. We recommend that you use
 * ListTagsForResource instead.
 *
 * Lists the tags for the specified log group.
 */
export const listTagsLogGroup: (
  input: ListTagsLogGroupRequest,
) => Effect.Effect<
  ListTagsLogGroupResponse,
  ResourceNotFoundException | ServiceUnavailableException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsLogGroupRequest,
  output: ListTagsLogGroupResponse,
  errors: [ResourceNotFoundException, ServiceUnavailableException],
}));
/**
 * Stops a CloudWatch Logs Insights query that is in progress. If the query has already
 * ended, the operation returns an error indicating that the specified query is not
 * running.
 *
 * This operation can be used to cancel both interactive queries and individual scheduled
 * query executions. When used with scheduled queries, `StopQuery` cancels only the
 * specific execution identified by the query ID, not the scheduled query configuration
 * itself.
 */
export const stopQuery: (
  input: StopQueryRequest,
) => Effect.Effect<
  StopQueryResponse,
  | InvalidParameterException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopQueryRequest,
  output: StopQueryResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Associates the specified KMS key with either one log group in the
 * account, or with all stored CloudWatch Logs query insights results in the
 * account.
 *
 * When you use `AssociateKmsKey`, you specify either the
 * `logGroupName` parameter or the `resourceIdentifier` parameter. You
 * can't specify both of those parameters in the same operation.
 *
 * - Specify the `logGroupName` parameter to cause log events ingested into that
 * log group to be encrypted with that key. Only the log events ingested after the key is
 * associated are encrypted with that key.
 *
 * Associating a KMS key with a log group overrides any existing
 * associations between the log group and a KMS key. After a KMS key is associated with a log group, all newly ingested data for the log group
 * is encrypted using the KMS key. This association is stored as long as the
 * data encrypted with the KMS key is still within CloudWatch Logs. This
 * enables CloudWatch Logs to decrypt this data whenever it is requested.
 *
 * Associating a key with a log group does not cause the results of queries of that log
 * group to be encrypted with that key. To have query results encrypted with a KMS key, you must use an `AssociateKmsKey` operation with the
 * `resourceIdentifier` parameter that specifies a `query-result`
 * resource.
 *
 * - Specify the `resourceIdentifier` parameter with a `query-result`
 * resource, to use that key to encrypt the stored results of all future StartQuery operations in the account. The response from a GetQueryResults operation will still return the query results in plain
 * text.
 *
 * Even if you have not associated a key with your query results, the query results are
 * encrypted when stored, using the default CloudWatch Logs method.
 *
 * If you run a query from a monitoring account that queries logs in a source account,
 * the query results key from the monitoring account, if any, is used.
 *
 * If you delete the key that is used to encrypt log events or log group query results,
 * then all the associated stored log events or query results that were encrypted with that key
 * will be unencryptable and unusable.
 *
 * CloudWatch Logs supports only symmetric KMS keys. Do not associate an
 * asymmetric KMS key with your log group or query results. For more
 * information, see Using Symmetric and Asymmetric
 * Keys.
 *
 * It can take up to 5 minutes for this operation to take effect.
 *
 * If you attempt to associate a KMS key with a log group but the KMS key does not exist or the KMS key is disabled, you receive an
 * `InvalidParameterException` error.
 */
export const associateKmsKey: (
  input: AssociateKmsKeyRequest,
) => Effect.Effect<
  AssociateKmsKeyResponse,
  | InvalidParameterException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateKmsKeyRequest,
  output: AssociateKmsKeyResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns a list of all CloudWatch Logs account policies in the account.
 *
 * To use this operation, you must be signed on with the correct permissions depending on the
 * type of policy that you are retrieving information for.
 *
 * - To see data protection policies, you must have the
 * `logs:GetDataProtectionPolicy` and `logs:DescribeAccountPolicies`
 * permissions.
 *
 * - To see subscription filter policies, you must have the
 * `logs:DescribeSubscriptionFilters` and
 * `logs:DescribeAccountPolicies` permissions.
 *
 * - To see transformer policies, you must have the `logs:GetTransformer` and
 * `logs:DescribeAccountPolicies` permissions.
 *
 * - To see field index policies, you must have the `logs:DescribeIndexPolicies`
 * and `logs:DescribeAccountPolicies` permissions.
 */
export const describeAccountPolicies: (
  input: DescribeAccountPoliciesRequest,
) => Effect.Effect<
  DescribeAccountPoliciesResponse,
  | InvalidParameterException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAccountPoliciesRequest,
  output: DescribeAccountPoliciesResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Lists all your destinations. The results are ASCII-sorted by destination
 * name.
 */
export const describeDestinations: {
  (
    input: DescribeDestinationsRequest,
  ): Effect.Effect<
    DescribeDestinationsResponse,
    InvalidParameterException | ServiceUnavailableException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDestinationsRequest,
  ) => Stream.Stream<
    DescribeDestinationsResponse,
    InvalidParameterException | ServiceUnavailableException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDestinationsRequest,
  ) => Stream.Stream<
    Destination,
    InvalidParameterException | ServiceUnavailableException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDestinationsRequest,
  output: DescribeDestinationsResponse,
  errors: [InvalidParameterException, ServiceUnavailableException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "destinations",
    pageSize: "limit",
  } as const,
}));
/**
 * Returns a list of custom and default field indexes which are discovered in log data. For
 * more information about field index policies, see PutIndexPolicy.
 */
export const describeFieldIndexes: (
  input: DescribeFieldIndexesRequest,
) => Effect.Effect<
  DescribeFieldIndexesResponse,
  | InvalidParameterException
  | LimitExceededException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFieldIndexesRequest,
  output: DescribeFieldIndexesResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns the field index policies of the specified log group. For more information about
 * field index policies, see PutIndexPolicy.
 *
 * If a specified log group has a log-group level index policy, that policy is returned by
 * this operation.
 *
 * If a specified log group doesn't have a log-group level index policy, but an account-wide
 * index policy applies to it, that account-wide policy is returned by this operation.
 *
 * To find information about only account-level policies, use DescribeAccountPolicies instead.
 */
export const describeIndexPolicies: (
  input: DescribeIndexPoliciesRequest,
) => Effect.Effect<
  DescribeIndexPoliciesResponse,
  | InvalidParameterException
  | LimitExceededException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeIndexPoliciesRequest,
  output: DescribeIndexPoliciesResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns information about log groups, including data sources that ingest into each log
 * group. You can return all your log groups or filter the results by prefix. The results are
 * ASCII-sorted by log group name.
 *
 * CloudWatch Logs doesn't support IAM policies that control access to the
 * `DescribeLogGroups` action by using the
 * aws:ResourceTag/*key-name*
 * condition key. Other CloudWatch
 * Logs actions do support the use of the
 * aws:ResourceTag/*key-name*
 * condition key to control access.
 * For more information about using tags to control access, see Controlling access to Amazon Web Services
 * resources using tags.
 *
 * If you are using CloudWatch cross-account observability, you can use this operation
 * in a monitoring account and view data from the linked source accounts. For more information,
 * see CloudWatch cross-account observability.
 */
export const describeLogGroups: {
  (
    input: DescribeLogGroupsRequest,
  ): Effect.Effect<
    DescribeLogGroupsResponse,
    InvalidParameterException | ServiceUnavailableException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeLogGroupsRequest,
  ) => Stream.Stream<
    DescribeLogGroupsResponse,
    InvalidParameterException | ServiceUnavailableException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeLogGroupsRequest,
  ) => Stream.Stream<
    LogGroup,
    InvalidParameterException | ServiceUnavailableException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeLogGroupsRequest,
  output: DescribeLogGroupsResponse,
  errors: [InvalidParameterException, ServiceUnavailableException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "logGroups",
    pageSize: "limit",
  } as const,
}));
/**
 * Lists the log streams for the specified log group. You can list all the log streams or
 * filter the results by prefix. You can also control how the results are ordered.
 *
 * You can specify the log group to search by using either `logGroupIdentifier` or
 * `logGroupName`. You must include one of these two parameters, but you can't
 * include both.
 *
 * This operation has a limit of 25 transactions per second, after which transactions are
 * throttled.
 *
 * If you are using CloudWatch cross-account observability, you can use this operation
 * in a monitoring account and view data from the linked source accounts. For more information,
 * see CloudWatch cross-account observability.
 */
export const describeLogStreams: {
  (
    input: DescribeLogStreamsRequest,
  ): Effect.Effect<
    DescribeLogStreamsResponse,
    | InvalidParameterException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeLogStreamsRequest,
  ) => Stream.Stream<
    DescribeLogStreamsResponse,
    | InvalidParameterException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeLogStreamsRequest,
  ) => Stream.Stream<
    LogStream,
    | InvalidParameterException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeLogStreamsRequest,
  output: DescribeLogStreamsResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "logStreams",
    pageSize: "limit",
  } as const,
}));
/**
 * Lists the specified metric filters. You can list all of the metric filters or filter
 * the results by log name, prefix, metric name, or metric namespace. The results are
 * ASCII-sorted by filter name.
 */
export const describeMetricFilters: {
  (
    input: DescribeMetricFiltersRequest,
  ): Effect.Effect<
    DescribeMetricFiltersResponse,
    | InvalidParameterException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeMetricFiltersRequest,
  ) => Stream.Stream<
    DescribeMetricFiltersResponse,
    | InvalidParameterException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeMetricFiltersRequest,
  ) => Stream.Stream<
    MetricFilter,
    | InvalidParameterException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeMetricFiltersRequest,
  output: DescribeMetricFiltersResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "metricFilters",
    pageSize: "limit",
  } as const,
}));
/**
 * Returns a list of CloudWatch Logs Insights queries that are scheduled, running, or have
 * been run recently in this account. You can request all queries or limit it to queries of a
 * specific log group or queries with a certain status.
 *
 * This operation includes both interactive queries started directly by users and automated
 * queries executed by scheduled query configurations. Scheduled query executions appear in the
 * results alongside manually initiated queries, providing visibility into all query activity in
 * your account.
 */
export const describeQueries: (
  input: DescribeQueriesRequest,
) => Effect.Effect<
  DescribeQueriesResponse,
  | InvalidParameterException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeQueriesRequest,
  output: DescribeQueriesResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation returns a paginated list of your saved CloudWatch Logs Insights query
 * definitions. You can retrieve query definitions from the current account or from a source
 * account that is linked to the current account.
 *
 * You can use the `queryDefinitionNamePrefix` parameter to limit the results to
 * only the query definitions that have names that start with a certain string.
 */
export const describeQueryDefinitions: (
  input: DescribeQueryDefinitionsRequest,
) => Effect.Effect<
  DescribeQueryDefinitionsResponse,
  InvalidParameterException | ServiceUnavailableException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeQueryDefinitionsRequest,
  output: DescribeQueryDefinitionsResponse,
  errors: [InvalidParameterException, ServiceUnavailableException],
}));
/**
 * Lists the resource policies in this account.
 */
export const describeResourcePolicies: (
  input: DescribeResourcePoliciesRequest,
) => Effect.Effect<
  DescribeResourcePoliciesResponse,
  InvalidParameterException | ServiceUnavailableException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeResourcePoliciesRequest,
  output: DescribeResourcePoliciesResponse,
  errors: [InvalidParameterException, ServiceUnavailableException],
}));
/**
 * Lists the subscription filters for the specified log group. You can list all the
 * subscription filters or filter the results by prefix. The results are ASCII-sorted by filter
 * name.
 */
export const describeSubscriptionFilters: {
  (
    input: DescribeSubscriptionFiltersRequest,
  ): Effect.Effect<
    DescribeSubscriptionFiltersResponse,
    | InvalidParameterException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeSubscriptionFiltersRequest,
  ) => Stream.Stream<
    DescribeSubscriptionFiltersResponse,
    | InvalidParameterException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeSubscriptionFiltersRequest,
  ) => Stream.Stream<
    SubscriptionFilter,
    | InvalidParameterException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeSubscriptionFiltersRequest,
  output: DescribeSubscriptionFiltersResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "subscriptionFilters",
    pageSize: "limit",
  } as const,
}));
/**
 * Lists log events from the specified log group. You can list all the log events or
 * filter the results using one or more of the following:
 *
 * - A filter pattern
 *
 * - A time range
 *
 * - The log stream name, or a log stream name prefix that matches multiple log
 * streams
 *
 * You must have the `logs:FilterLogEvents` permission to perform this
 * operation.
 *
 * You can specify the log group to search by using either `logGroupIdentifier` or
 * `logGroupName`. You must include one of these two parameters, but you can't
 * include both.
 *
 * `FilterLogEvents` is a paginated operation. Each page returned can contain up
 * to 1 MB of log events or up to 10,000 log events. A returned page might only be partially
 * full, or even empty. For example, if the result of a query would return 15,000 log events, the
 * first page isn't guaranteed to have 10,000 log events even if they all fit into 1 MB.
 *
 * Partially full or empty pages don't necessarily mean that pagination is finished. If the
 * results include a `nextToken`, there might be more log events available. You can
 * return these additional log events by providing the nextToken in a subsequent
 * `FilterLogEvents` operation. If the results don't include a
 * `nextToken`, then pagination is finished.
 *
 * Specifying the `limit` parameter only guarantees that a single page doesn't
 * return more log events than the specified limit, but it might return fewer events than the
 * limit. This is the expected API behavior.
 *
 * The returned log events are sorted by event timestamp, the timestamp when the event was
 * ingested by CloudWatch Logs, and the ID of the `PutLogEvents` request.
 *
 * If you are using CloudWatch cross-account observability, you can use this operation
 * in a monitoring account and view data from the linked source accounts. For more information,
 * see CloudWatch cross-account observability.
 *
 * If you are using log
 * transformation, the `FilterLogEvents` operation returns only the
 * original versions of log events, before they were transformed. To view the transformed
 * versions, you must use a CloudWatch Logs
 * query.
 */
export const filterLogEvents: {
  (
    input: FilterLogEventsRequest,
  ): Effect.Effect<
    FilterLogEventsResponse,
    | InvalidParameterException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: FilterLogEventsRequest,
  ) => Stream.Stream<
    FilterLogEventsResponse,
    | InvalidParameterException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: FilterLogEventsRequest,
  ) => Stream.Stream<
    unknown,
    | InvalidParameterException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: FilterLogEventsRequest,
  output: FilterLogEventsResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "limit",
  } as const,
}));
/**
 * Lists log events from the specified log stream. You can list all of the log events or
 * filter using a time range.
 *
 * `GetLogEvents` is a paginated operation. Each page returned can contain up to 1
 * MB of log events or up to 10,000 log events. A returned page might only be partially full, or
 * even empty. For example, if the result of a query would return 15,000 log events, the first
 * page isn't guaranteed to have 10,000 log events even if they all fit into 1 MB.
 *
 * Partially full or empty pages don't necessarily mean that pagination is finished. As long
 * as the `nextBackwardToken` or `nextForwardToken` returned is NOT equal
 * to the `nextToken` that you passed into the API call, there might be more log
 * events available. The token that you use depends on the direction you want to move in along
 * the log stream. The returned tokens are never null.
 *
 * If you set `startFromHead` to `true` and you don’t include
 * `endTime` in your request, you can end up in a situation where the pagination
 * doesn't terminate. This can happen when the new log events are being added to the target log
 * streams faster than they are being read. This situation is a good use case for the CloudWatch Logs
 * Live Tail feature.
 *
 * If you are using CloudWatch cross-account observability, you can use this operation
 * in a monitoring account and view data from the linked source accounts. For more information,
 * see CloudWatch cross-account observability.
 *
 * You can specify the log group to search by using either `logGroupIdentifier` or
 * `logGroupName`. You must include one of these two parameters, but you can't
 * include both.
 *
 * If you are using log
 * transformation, the `GetLogEvents` operation returns only the original
 * versions of log events, before they were transformed. To view the transformed versions, you
 * must use a CloudWatch Logs
 * query.
 */
export const getLogEvents: {
  (
    input: GetLogEventsRequest,
  ): Effect.Effect<
    GetLogEventsResponse,
    | InvalidParameterException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetLogEventsRequest,
  ) => Stream.Stream<
    GetLogEventsResponse,
    | InvalidParameterException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetLogEventsRequest,
  ) => Stream.Stream<
    OutputLogEvent,
    | InvalidParameterException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetLogEventsRequest,
  output: GetLogEventsResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextForwardToken",
    items: "events",
    pageSize: "limit",
  } as const,
}));
/**
 * Returns a list of the fields that are included in log events in the specified log group.
 * Includes the percentage of log events that contain each field. The search is limited to a time
 * period that you specify.
 *
 * This operation is used for discovering fields within log group events. For discovering
 * fields across data sources, use the GetLogFields operation.
 *
 * You can specify the log group to search by using either `logGroupIdentifier` or
 * `logGroupName`. You must specify one of these parameters, but you can't specify
 * both.
 *
 * In the results, fields that start with `@` are fields generated by CloudWatch
 * Logs. For example, `@timestamp` is the timestamp of each log event. For more
 * information about the fields that are generated by CloudWatch logs, see Supported
 * Logs and Discovered Fields.
 *
 * The response results are sorted by the frequency percentage, starting with the highest
 * percentage.
 *
 * If you are using CloudWatch cross-account observability, you can use this operation
 * in a monitoring account and view data from the linked source accounts. For more information,
 * see CloudWatch cross-account observability.
 */
export const getLogGroupFields: (
  input: GetLogGroupFieldsRequest,
) => Effect.Effect<
  GetLogGroupFieldsResponse,
  | InvalidParameterException
  | LimitExceededException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLogGroupFieldsRequest,
  output: GetLogGroupFieldsResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Retrieves all of the fields and values of a single log event. All fields are retrieved,
 * even if the original query that produced the `logRecordPointer` retrieved only a
 * subset of fields. Fields are returned as field name/field value pairs.
 *
 * The full unparsed log event is returned within `@message`.
 */
export const getLogRecord: (
  input: GetLogRecordRequest,
) => Effect.Effect<
  GetLogRecordResponse,
  | InvalidParameterException
  | LimitExceededException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLogRecordRequest,
  output: GetLogRecordResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns the results from the specified query.
 *
 * Only the fields requested in the query are returned, along with a `@ptr` field,
 * which is the identifier for the log record. You can use the value of `@ptr` in a
 * GetLogRecord
 * operation to get the full log record.
 *
 * `GetQueryResults` does not start running a query. To run a query, use StartQuery. For more information about how long results of previous queries are
 * available, see CloudWatch Logs
 * quotas.
 *
 * If the value of the `Status` field in the output is `Running`, this
 * operation returns only partial results. If you see a value of `Scheduled` or
 * `Running` for the status, you can retry the operation later to see the final
 * results.
 *
 * This operation is used both for retrieving results from interactive queries and from
 * automated scheduled query executions. Scheduled queries use `GetQueryResults`
 * internally to retrieve query results for processing and delivery to configured
 * destinations.
 *
 * If you are using CloudWatch cross-account observability, you can use this operation
 * in a monitoring account to start queries in linked source accounts. For more information, see
 * CloudWatch cross-account observability.
 */
export const getQueryResults: (
  input: GetQueryResultsRequest,
) => Effect.Effect<
  GetQueryResultsResponse,
  | InvalidParameterException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQueryResultsRequest,
  output: GetQueryResultsResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns a list of integrations between CloudWatch Logs and other services in this
 * account. Currently, only one integration can be created in an account, and this integration
 * must be with OpenSearch Service.
 */
export const listIntegrations: (
  input: ListIntegrationsRequest,
) => Effect.Effect<
  ListIntegrationsResponse,
  InvalidParameterException | ServiceUnavailableException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListIntegrationsRequest,
  output: ListIntegrationsResponse,
  errors: [InvalidParameterException, ServiceUnavailableException],
}));
/**
 * Retrieves a list of the log anomaly detectors in the account.
 */
export const listLogAnomalyDetectors: {
  (
    input: ListLogAnomalyDetectorsRequest,
  ): Effect.Effect<
    ListLogAnomalyDetectorsResponse,
    | InvalidParameterException
    | OperationAbortedException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLogAnomalyDetectorsRequest,
  ) => Stream.Stream<
    ListLogAnomalyDetectorsResponse,
    | InvalidParameterException
    | OperationAbortedException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLogAnomalyDetectorsRequest,
  ) => Stream.Stream<
    AnomalyDetector,
    | InvalidParameterException
    | OperationAbortedException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLogAnomalyDetectorsRequest,
  output: ListLogAnomalyDetectorsResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "anomalyDetectors",
    pageSize: "limit",
  } as const,
}));
/**
 * Returns a list of log groups in the Region in your account. If you are performing this
 * action in a monitoring account, you can choose to also return log groups from source accounts
 * that are linked to the monitoring account. For more information about using cross-account
 * observability to set up monitoring accounts and source accounts, see
 * CloudWatch cross-account observability.
 *
 * You can optionally filter the list by log group class, by using regular expressions in
 * your request to match strings in the log group names, by using the fieldIndexes parameter to
 * filter log groups based on which field indexes are configured, by using the dataSources
 * parameter to filter log groups by data source types, and by using the fieldIndexNames
 * parameter to filter by specific field index names.
 *
 * This operation is paginated. By default, your first use of this operation returns 50
 * results, and includes a token to use in a subsequent operation to return more results.
 */
export const listLogGroups: (
  input: ListLogGroupsRequest,
) => Effect.Effect<
  ListLogGroupsResponse,
  InvalidParameterException | ServiceUnavailableException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLogGroupsRequest,
  output: ListLogGroupsResponse,
  errors: [InvalidParameterException, ServiceUnavailableException],
}));
/**
 * Creates or updates a metric filter and associates it with the specified log group. With
 * metric filters, you can configure rules to extract metric data from log events ingested
 * through PutLogEvents.
 *
 * The maximum number of metric filters that can be associated with a log group is
 * 100.
 *
 * Using regular expressions in filter patterns is supported. For these filters, there is a
 * quota of two regular expression patterns within a single filter pattern. There is also a quota
 * of five regular expression patterns per log group. For more information about using regular
 * expressions in filter patterns, see Filter pattern syntax for
 * metric filters, subscription filters, filter log events, and Live Tail.
 *
 * When you create a metric filter, you can also optionally assign a unit and dimensions to
 * the metric that is created.
 *
 * Metrics extracted from log events are charged as custom metrics. To prevent unexpected
 * high charges, do not specify high-cardinality fields such as `IPAddress` or
 * `requestID` as dimensions. Each different value found for a dimension is
 * treated as a separate metric and accrues charges as a separate custom metric.
 *
 * CloudWatch Logs might disable a metric filter if it generates 1,000 different
 * name/value pairs for your specified dimensions within one hour.
 *
 * You can also set up a billing alarm to alert you if your charges are higher than
 * expected. For more information, see
 * Creating a Billing Alarm to Monitor Your Estimated Amazon Web Services Charges.
 */
export const putMetricFilter: (
  input: PutMetricFilterRequest,
) => Effect.Effect<
  PutMetricFilterResponse,
  | InvalidOperationException
  | InvalidParameterException
  | LimitExceededException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutMetricFilterRequest,
  output: PutMetricFilterResponse,
  errors: [
    InvalidOperationException,
    InvalidParameterException,
    LimitExceededException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Use this operation to test a log transformer. You enter the transformer configuration and
 * a set of log events to test with. The operation responds with an array that includes the
 * original log events and the transformed versions.
 */
export const testTransformer: (
  input: TestTransformerRequest,
) => Effect.Effect<
  TestTransformerResponse,
  | InvalidOperationException
  | InvalidParameterException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestTransformerRequest,
  output: TestTransformerResponse,
  errors: [
    InvalidOperationException,
    InvalidParameterException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates a log stream for the specified log group. A log stream is a sequence of log
 * events that originate from a single source, such as an application instance or a resource that
 * is being monitored.
 *
 * There is no limit on the number of log streams that you can create for a log group.
 * There is a limit of 50 TPS on `CreateLogStream` operations, after which
 * transactions are throttled.
 *
 * You must use the following guidelines when naming a log stream:
 *
 * - Log stream names must be unique within the log group.
 *
 * - Log stream names can be between 1 and 512 characters long.
 *
 * - Don't use ':' (colon) or '*' (asterisk) characters.
 */
export const createLogStream: (
  input: CreateLogStreamRequest,
) => Effect.Effect<
  CreateLogStreamResponse,
  | InvalidParameterException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLogStreamRequest,
  output: CreateLogStreamResponse,
  errors: [
    InvalidParameterException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Cancels an active import task and stops importing data from the CloudTrail Lake Event Data Store.
 */
export const cancelImportTask: (
  input: CancelImportTaskRequest,
) => Effect.Effect<
  CancelImportTaskResponse,
  | AccessDeniedException
  | InvalidOperationException
  | InvalidParameterException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelImportTaskRequest,
  output: CancelImportTaskResponse,
  errors: [
    AccessDeniedException,
    InvalidOperationException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists the specified export tasks. You can list all your export tasks or filter the
 * results based on task ID or task status.
 */
export const describeExportTasks: (
  input: DescribeExportTasksRequest,
) => Effect.Effect<
  DescribeExportTasksResponse,
  InvalidParameterException | ServiceUnavailableException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeExportTasksRequest,
  output: DescribeExportTasksResponse,
  errors: [InvalidParameterException, ServiceUnavailableException],
}));
/**
 * Discovers available fields for a specific data source and type. The response includes any
 * field modifications introduced through pipelines, such as new fields or changed field types.
 */
export const getLogFields: (
  input: GetLogFieldsRequest,
) => Effect.Effect<
  GetLogFieldsResponse,
  | InvalidParameterException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLogFieldsRequest,
  output: GetLogFieldsResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Retrieves a large logging object (LLO) and streams it back. This API is used to fetch the
 * content of large portions of log events that have been ingested through the
 * PutOpenTelemetryLogs API. When log events contain fields that would cause the total event size
 * to exceed 1MB, CloudWatch Logs automatically processes up to 10 fields, starting with the
 * largest fields. Each field is truncated as needed to keep the total event size as close to 1MB
 * as possible. The excess portions are stored as Large Log Objects (LLOs) and these fields are
 * processed separately and LLO reference system fields (in the format
 * `@ptr.$[path.to.field]`) are added. The path in the reference field reflects the
 * original JSON structure where the large field was located. For example, this could be
 * `@ptr.$['input']['message']`, `@ptr.$['AAA']['BBB']['CCC']['DDD']`,
 * `@ptr.$['AAA']`, or any other path matching your log structure.
 */
export const getLogObject: (
  input: GetLogObjectRequest,
) => Effect.Effect<
  GetLogObjectResponse,
  | AccessDeniedException
  | InvalidOperationException
  | InvalidParameterException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLogObjectRequest,
  output: GetLogObjectResponse,
  errors: [
    AccessDeniedException,
    InvalidOperationException,
    InvalidParameterException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates or updates a *log transformer* for a single log group. You use
 * log transformers to transform log events into a different format, making them easier for you
 * to process and analyze. You can also transform logs from different sources into standardized
 * formats that contains relevant, source-specific information.
 *
 * After you have created a transformer, CloudWatch Logs performs the transformations at
 * the time of log ingestion. You can then refer to the transformed versions of the logs during
 * operations such as querying with CloudWatch Logs Insights or creating metric filters or
 * subscription filers.
 *
 * You can also use a transformer to copy metadata from metadata keys into the log events
 * themselves. This metadata can include log group name, log stream name, account ID and
 * Region.
 *
 * A transformer for a log group is a series of processors, where each processor applies one
 * type of transformation to the log events ingested into this log group. The processors work one
 * after another, in the order that you list them, like a pipeline. For more information about
 * the available processors to use in a transformer, see Processors that you can use.
 *
 * Having log events in standardized format enables visibility across your applications for
 * your log analysis, reporting, and alarming needs. CloudWatch Logs provides transformation
 * for common log types with out-of-the-box transformation templates for major Amazon Web Services
 * log sources such as VPC flow logs, Lambda, and Amazon RDS. You can use
 * pre-built transformation templates or create custom transformation policies.
 *
 * You can create transformers only for the log groups in the Standard log class.
 *
 * You can also set up a transformer at the account level. For more information, see PutAccountPolicy. If there is both a log-group level transformer created with
 * `PutTransformer` and an account-level transformer that could apply to the same
 * log group, the log group uses only the log-group level transformer. It ignores the
 * account-level transformer.
 */
export const putTransformer: (
  input: PutTransformerRequest,
) => Effect.Effect<
  PutTransformerResponse,
  | InvalidOperationException
  | InvalidParameterException
  | LimitExceededException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutTransformerRequest,
  output: PutTransformerResponse,
  errors: [
    InvalidOperationException,
    InvalidParameterException,
    LimitExceededException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Tests the filter pattern of a metric filter against a sample of log event messages. You
 * can use this operation to validate the correctness of a metric filter pattern.
 */
export const testMetricFilter: (
  input: TestMetricFilterRequest,
) => Effect.Effect<
  TestMetricFilterResponse,
  InvalidParameterException | ServiceUnavailableException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestMetricFilterRequest,
  output: TestMetricFilterResponse,
  errors: [InvalidParameterException, ServiceUnavailableException],
}));
/**
 * Deletes the integration between CloudWatch Logs and OpenSearch Service. If your
 * integration has active vended logs dashboards, you must specify `true` for the
 * `force` parameter, otherwise the operation will fail. If you delete the
 * integration by setting `force` to `true`, all your vended logs
 * dashboards powered by OpenSearch Service will be deleted and the data that was on them will no
 * longer be accessible.
 */
export const deleteIntegration: (
  input: DeleteIntegrationRequest,
) => Effect.Effect<
  DeleteIntegrationResponse,
  | InvalidParameterException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIntegrationRequest,
  output: DeleteIntegrationResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ValidationException,
  ],
}));
/**
 * Starts an import from a data source to CloudWatch Log and creates a managed log group as the destination for the imported data.
 * Currently, CloudTrail Event Data Store is the only supported data source.
 *
 * The import task must satisfy the following constraints:
 *
 * - The specified source must be in an ACTIVE state.
 *
 * - The API caller must have permissions to access the data in the provided source and to perform iam:PassRole on the
 * provided import role which has the same permissions, as described below.
 *
 * - The provided IAM role must trust the "cloudtrail.amazonaws.com" principal and have the following permissions:
 *
 * - cloudtrail:GetEventDataStoreData
 *
 * - logs:CreateLogGroup
 *
 * - logs:CreateLogStream
 *
 * - logs:PutResourcePolicy
 *
 * - (If source has an associated AWS KMS Key) kms:Decrypt
 *
 * - (If source has an associated AWS KMS Key) kms:GenerateDataKey
 *
 * Example IAM policy for provided import role:
 *
 * `[ { "Effect": "Allow", "Action": "iam:PassRole", "Resource": "arn:aws:iam::123456789012:role/apiCallerCredentials", "Condition": { "StringLike": { "iam:AssociatedResourceARN": "arn:aws:logs:us-east-1:123456789012:log-group:aws/cloudtrail/f1d45bff-d0e3-4868-b5d9-2eb678aa32fb:*" } } }, { "Effect": "Allow", "Action": [ "cloudtrail:GetEventDataStoreData" ], "Resource": [ "arn:aws:cloudtrail:us-east-1:123456789012:eventdatastore/f1d45bff-d0e3-4868-b5d9-2eb678aa32fb" ] }, { "Effect": "Allow", "Action": [ "logs:CreateImportTask", "logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutResourcePolicy" ], "Resource": [ "arn:aws:logs:us-east-1:123456789012:log-group:/aws/cloudtrail/*" ] }, { "Effect": "Allow", "Action": [ "kms:Decrypt", "kms:GenerateDataKey" ], "Resource": [ "arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012" ] } ]`
 *
 * - If the import source has a customer managed key, the "cloudtrail.amazonaws.com" principal needs permissions to perform kms:Decrypt and kms:GenerateDataKey.
 *
 * - There can be no more than 3 active imports per account at a given time.
 *
 * - The startEventTime must be less than or equal to endEventTime.
 *
 * - The data being imported must be within the specified source's retention period.
 */
export const createImportTask: (
  input: CreateImportTaskRequest,
) => Effect.Effect<
  CreateImportTaskResponse,
  | AccessDeniedException
  | ConflictException
  | InvalidOperationException
  | InvalidParameterException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateImportTaskRequest,
  output: CreateImportTaskResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InvalidOperationException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a scheduled query and stops all future executions. This operation also removes any
 * configured actions and associated resources.
 */
export const deleteScheduledQuery: (
  input: DeleteScheduledQueryRequest,
) => Effect.Effect<
  DeleteScheduledQueryResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteScheduledQueryRequest,
  output: DeleteScheduledQueryResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets detailed information about the individual batches within an import task, including their status and any error messages.
 * For CloudTrail Event Data Store sources, a batch refers to a subset of stored events grouped by their eventTime.
 */
export const describeImportTaskBatches: (
  input: DescribeImportTaskBatchesRequest,
) => Effect.Effect<
  DescribeImportTaskBatchesResponse,
  | AccessDeniedException
  | InvalidOperationException
  | InvalidParameterException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeImportTaskBatchesRequest,
  output: DescribeImportTaskBatchesResponse,
  errors: [
    AccessDeniedException,
    InvalidOperationException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists and describes import tasks, with optional filtering by import status and source ARN.
 */
export const describeImportTasks: (
  input: DescribeImportTasksRequest,
) => Effect.Effect<
  DescribeImportTasksResponse,
  | AccessDeniedException
  | InvalidOperationException
  | InvalidParameterException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeImportTasksRequest,
  output: DescribeImportTasksResponse,
  errors: [
    AccessDeniedException,
    InvalidOperationException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists all scheduled queries in your account and region. You can filter results by state to
 * show only enabled or disabled queries.
 */
export const listScheduledQueries: {
  (
    input: ListScheduledQueriesRequest,
  ): Effect.Effect<
    ListScheduledQueriesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListScheduledQueriesRequest,
  ) => Stream.Stream<
    ListScheduledQueriesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListScheduledQueriesRequest,
  ) => Stream.Stream<
    ScheduledQuerySummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListScheduledQueriesRequest,
  output: ListScheduledQueriesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "scheduledQueries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of data source associations for a specified S3 Table Integration, showing
 * which data sources are currently associated for query access.
 */
export const listSourcesForS3TableIntegration: {
  (
    input: ListSourcesForS3TableIntegrationRequest,
  ): Effect.Effect<
    ListSourcesForS3TableIntegrationResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSourcesForS3TableIntegrationRequest,
  ) => Stream.Stream<
    ListSourcesForS3TableIntegrationResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSourcesForS3TableIntegrationRequest,
  ) => Stream.Stream<
    S3TableIntegrationSource,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSourcesForS3TableIntegrationRequest,
  output: ListSourcesForS3TableIntegrationResponse,
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
    items: "sources",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Deletes a *delivery destination*. A delivery is a connection between a
 * logical *delivery source* and a logical delivery
 * destination.
 *
 * You can't delete a delivery destination if any current deliveries are associated with it.
 * To find whether any deliveries are associated with this delivery destination, use the DescribeDeliveries operation and check the `deliveryDestinationArn`
 * field in the results.
 */
export const deleteDeliveryDestination: (
  input: DeleteDeliveryDestinationRequest,
) => Effect.Effect<
  DeleteDeliveryDestinationResponse,
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ServiceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDeliveryDestinationRequest,
  output: DeleteDeliveryDestinationResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Disassociates a data source from an S3 Table Integration, removing query access and
 * deleting all associated data from the integration.
 */
export const disassociateSourceFromS3TableIntegration: (
  input: DisassociateSourceFromS3TableIntegrationRequest,
) => Effect.Effect<
  DisassociateSourceFromS3TableIntegrationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateSourceFromS3TableIntegrationRequest,
  output: DisassociateSourceFromS3TableIntegrationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves details about a specific scheduled query, including its configuration, execution
 * status, and metadata.
 */
export const getScheduledQuery: (
  input: GetScheduledQueryRequest,
) => Effect.Effect<
  GetScheduledQueryResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetScheduledQueryRequest,
  output: GetScheduledQueryResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an existing scheduled query with new configuration. This operation uses PUT
 * semantics, allowing modification of query parameters, schedule, and destinations.
 */
export const updateScheduledQuery: (
  input: UpdateScheduledQueryRequest,
) => Effect.Effect<
  UpdateScheduledQueryResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateScheduledQueryRequest,
  output: UpdateScheduledQueryResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Associates a data source with an S3 Table Integration for query access in the 'logs'
 * namespace. This enables querying log data using analytics engines that support Iceberg such as
 * Amazon Athena, Amazon Redshift, and Apache Spark.
 */
export const associateSourceToS3TableIntegration: (
  input: AssociateSourceToS3TableIntegrationRequest,
) => Effect.Effect<
  AssociateSourceToS3TableIntegrationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateSourceToS3TableIntegrationRequest,
  output: AssociateSourceToS3TableIntegrationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Use this operation to update the configuration of a delivery to change
 * either the S3 path pattern or the format of the delivered logs. You can't use this operation
 * to change the source or destination of the delivery.
 */
export const updateDeliveryConfiguration: (
  input: UpdateDeliveryConfigurationRequest,
) => Effect.Effect<
  UpdateDeliveryConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDeliveryConfigurationRequest,
  output: UpdateDeliveryConfigurationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a *delivery source*. A delivery is a connection between a
 * logical *delivery source* and a logical delivery
 * destination.
 *
 * You can't delete a delivery source if any current deliveries are associated with it. To
 * find whether any deliveries are associated with this delivery source, use the DescribeDeliveries operation and check the `deliverySourceName` field in
 * the results.
 */
export const deleteDeliverySource: (
  input: DeleteDeliverySourceRequest,
) => Effect.Effect<
  DeleteDeliverySourceResponse,
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ServiceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDeliverySourceRequest,
  output: DeleteDeliverySourceResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a *delivery*. A delivery is a connection between a logical
 * *delivery source* and a logical delivery
 * destination. Deleting a delivery only deletes the connection between the delivery
 * source and delivery destination. It does not delete the delivery destination or the delivery
 * source.
 */
export const deleteDelivery: (
  input: DeleteDeliveryRequest,
) => Effect.Effect<
  DeleteDeliveryResponse,
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ServiceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDeliveryRequest,
  output: DeleteDeliveryResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns complete information about one logical *delivery*. A delivery
 * is a connection between a
 * delivery
 * source
 * and a
 * *delivery destination*
 * .
 *
 * A delivery source represents an Amazon Web Services resource that sends logs to an logs
 * delivery destination. The destination can be CloudWatch Logs, Amazon S3, or Firehose. Only some Amazon Web Services services support being configured as a delivery
 * source. These services are listed in Enable logging from
 * Amazon Web Services services.
 *
 * You need to specify the delivery `id` in this operation. You can find the IDs
 * of the deliveries in your account with the DescribeDeliveries operation.
 */
export const getDelivery: (
  input: GetDeliveryRequest,
) => Effect.Effect<
  GetDeliveryResponse,
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ServiceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeliveryRequest,
  output: GetDeliveryResponse,
  errors: [
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves complete information about one delivery destination.
 */
export const getDeliveryDestination: (
  input: GetDeliveryDestinationRequest,
) => Effect.Effect<
  GetDeliveryDestinationResponse,
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ServiceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeliveryDestinationRequest,
  output: GetDeliveryDestinationResponse,
  errors: [
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves complete information about one delivery source.
 */
export const getDeliverySource: (
  input: GetDeliverySourceRequest,
) => Effect.Effect<
  GetDeliverySourceResponse,
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ServiceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeliverySourceRequest,
  output: GetDeliverySourceResponse,
  errors: [
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates or updates a logical *delivery source*. A delivery source
 * represents an Amazon Web Services resource that sends logs to an logs delivery destination. The
 * destination can be CloudWatch Logs, Amazon S3, Firehose or X-Ray for sending traces.
 *
 * To configure logs delivery between a delivery destination and an Amazon Web Services
 * service that is supported as a delivery source, you must do the following:
 *
 * - Use `PutDeliverySource` to create a delivery source, which is a logical
 * object that represents the resource that is actually sending the logs.
 *
 * - Use `PutDeliveryDestination` to create a delivery
 * destination, which is a logical object that represents the actual delivery
 * destination. For more information, see PutDeliveryDestination.
 *
 * - If you are delivering logs cross-account, you must use PutDeliveryDestinationPolicy in the destination account to assign an IAM policy to the destination. This policy allows delivery to that destination.
 *
 * - Use `CreateDelivery` to create a *delivery* by pairing
 * exactly one delivery source and one delivery destination. For more information, see CreateDelivery.
 *
 * You can configure a single delivery source to send logs to multiple destinations by
 * creating multiple deliveries. You can also create multiple deliveries to configure multiple
 * delivery sources to send logs to the same delivery destination.
 *
 * Only some Amazon Web Services services support being configured as a delivery source. These
 * services are listed as **Supported [V2 Permissions]** in the
 * table at Enabling logging from
 * Amazon Web Services services.
 *
 * If you use this operation to update an existing delivery source, all the current delivery
 * source parameters are overwritten with the new parameter values that you specify.
 */
export const putDeliverySource: (
  input: PutDeliverySourceRequest,
) => Effect.Effect<
  PutDeliverySourceResponse,
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ServiceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDeliverySourceRequest,
  output: PutDeliverySourceResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a *delivery*. A delivery is a connection between a logical
 * *delivery source* and a logical *delivery destination*
 * that you have already created.
 *
 * Only some Amazon Web Services services support being configured as a delivery source using
 * this operation. These services are listed as Supported [V2
 * Permissions] in the table at Enabling logging from
 * Amazon Web Services services.
 *
 * A delivery destination can represent a log group in CloudWatch Logs, an Amazon S3 bucket, a delivery stream in Firehose, or X-Ray.
 *
 * To configure logs delivery between a supported Amazon Web Services service and a
 * destination, you must do the following:
 *
 * - Create a delivery source, which is a logical object that represents the resource that
 * is actually sending the logs. For more information, see PutDeliverySource.
 *
 * - Create a *delivery destination*, which is a logical object that
 * represents the actual delivery destination. For more information, see PutDeliveryDestination.
 *
 * - If you are delivering logs cross-account, you must use PutDeliveryDestinationPolicy in the destination account to assign an IAM policy to the destination. This policy allows delivery to that destination.
 *
 * - Use `CreateDelivery` to create a *delivery* by pairing
 * exactly one delivery source and one delivery destination.
 *
 * You can configure a single delivery source to send logs to multiple destinations by
 * creating multiple deliveries. You can also create multiple deliveries to configure multiple
 * delivery sources to send logs to the same delivery destination.
 *
 * To update an existing delivery configuration, use UpdateDeliveryConfiguration.
 */
export const createDelivery: (
  input: CreateDeliveryRequest,
) => Effect.Effect<
  CreateDeliveryResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ServiceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDeliveryRequest,
  output: CreateDeliveryResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of the deliveries that have been created in the account.
 *
 * A *delivery* is a connection between a
 * delivery
 * source
 * and a
 * *delivery destination*
 * .
 *
 * A delivery source represents an Amazon Web Services resource that sends logs to an logs
 * delivery destination. The destination can be CloudWatch Logs, Amazon S3, Firehose or X-Ray. Only some Amazon Web Services services support being
 * configured as a delivery source. These services are listed in Enable logging from
 * Amazon Web Services services.
 */
export const describeDeliveries: {
  (
    input: DescribeDeliveriesRequest,
  ): Effect.Effect<
    DescribeDeliveriesResponse,
    | ServiceQuotaExceededException
    | ServiceUnavailableException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDeliveriesRequest,
  ) => Stream.Stream<
    DescribeDeliveriesResponse,
    | ServiceQuotaExceededException
    | ServiceUnavailableException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDeliveriesRequest,
  ) => Stream.Stream<
    Delivery,
    | ServiceQuotaExceededException
    | ServiceUnavailableException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDeliveriesRequest,
  output: DescribeDeliveriesResponse,
  errors: [
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "deliveries",
    pageSize: "limit",
  } as const,
}));
/**
 * Retrieves a list of the delivery destinations that have been created in the
 * account.
 */
export const describeDeliveryDestinations: {
  (
    input: DescribeDeliveryDestinationsRequest,
  ): Effect.Effect<
    DescribeDeliveryDestinationsResponse,
    | ServiceQuotaExceededException
    | ServiceUnavailableException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDeliveryDestinationsRequest,
  ) => Stream.Stream<
    DescribeDeliveryDestinationsResponse,
    | ServiceQuotaExceededException
    | ServiceUnavailableException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDeliveryDestinationsRequest,
  ) => Stream.Stream<
    DeliveryDestination,
    | ServiceQuotaExceededException
    | ServiceUnavailableException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDeliveryDestinationsRequest,
  output: DescribeDeliveryDestinationsResponse,
  errors: [
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "deliveryDestinations",
    pageSize: "limit",
  } as const,
}));
/**
 * Retrieves a list of the delivery sources that have been created in the account.
 */
export const describeDeliverySources: {
  (
    input: DescribeDeliverySourcesRequest,
  ): Effect.Effect<
    DescribeDeliverySourcesResponse,
    | ServiceQuotaExceededException
    | ServiceUnavailableException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDeliverySourcesRequest,
  ) => Stream.Stream<
    DescribeDeliverySourcesResponse,
    | ServiceQuotaExceededException
    | ServiceUnavailableException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDeliverySourcesRequest,
  ) => Stream.Stream<
    DeliverySource,
    | ServiceQuotaExceededException
    | ServiceUnavailableException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDeliverySourcesRequest,
  output: DescribeDeliverySourcesResponse,
  errors: [
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "deliverySources",
    pageSize: "limit",
  } as const,
}));
/**
 * Creates or updates a logical *delivery destination*. A delivery
 * destination is an Amazon Web Services resource that represents an Amazon Web Services service
 * that logs can be sent to. CloudWatch Logs, Amazon S3, and Firehose are
 * supported as logs delivery destinations and X-Ray as the trace delivery
 * destination.
 *
 * To configure logs delivery between a supported Amazon Web Services service and a
 * destination, you must do the following:
 *
 * - Create a delivery source, which is a logical object that represents the resource that
 * is actually sending the logs. For more information, see PutDeliverySource.
 *
 * - Use `PutDeliveryDestination` to create a delivery
 * destination in the same account of the actual delivery destination. The
 * delivery destination that you create is a logical object that represents the actual
 * delivery destination.
 *
 * - If you are delivering logs cross-account, you must use PutDeliveryDestinationPolicy in the destination account to assign an IAM policy to the destination. This policy allows delivery to that destination.
 *
 * - Use `CreateDelivery` to create a *delivery* by pairing
 * exactly one delivery source and one delivery destination. For more information, see CreateDelivery.
 *
 * You can configure a single delivery source to send logs to multiple destinations by
 * creating multiple deliveries. You can also create multiple deliveries to configure multiple
 * delivery sources to send logs to the same delivery destination.
 *
 * Only some Amazon Web Services services support being configured as a delivery source. These
 * services are listed as **Supported [V2 Permissions]** in the
 * table at Enabling logging from
 * Amazon Web Services services.
 *
 * If you use this operation to update an existing delivery destination, all the current
 * delivery destination parameters are overwritten with the new parameter values that you
 * specify.
 */
export const putDeliveryDestination: (
  input: PutDeliveryDestinationRequest,
) => Effect.Effect<
  PutDeliveryDestinationResponse,
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ServiceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDeliveryDestinationRequest,
  output: PutDeliveryDestinationResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Assigns one or more tags (key-value pairs) to the specified CloudWatch Logs resource.
 * Currently, the only CloudWatch Logs resources that can be tagged are log groups and
 * destinations.
 *
 * Tags can help you organize and categorize your resources. You can also use them to scope
 * user permissions by granting a user permission to access or change only resources with certain
 * tag values.
 *
 * Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as
 * strings of characters.
 *
 * You can use the `TagResource` action with a resource that already has tags. If
 * you specify a new tag key for the alarm, this tag is appended to the list of tags associated
 * with the alarm. If you specify a tag key that is already associated with the alarm, the new
 * tag value that you specify replaces the previous value for that tag.
 *
 * You can associate as many as 50 tags with a CloudWatch Logs resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | InvalidParameterException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    TooManyTagsException,
  ],
}));
/**
 * Deletes the specified log group and permanently deletes all the archived log events
 * associated with the log group.
 */
export const deleteLogGroup: (
  input: DeleteLogGroupRequest,
) => Effect.Effect<
  DeleteLogGroupResponse,
  | InvalidParameterException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLogGroupRequest,
  output: DeleteLogGroupResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified log stream and permanently deletes all the archived log events
 * associated with the log stream.
 */
export const deleteLogStream: (
  input: DeleteLogStreamRequest,
) => Effect.Effect<
  DeleteLogStreamResponse,
  | InvalidParameterException
  | OperationAbortedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLogStreamRequest,
  output: DeleteLogStreamResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ValidationException,
  ],
}));
/**
 * Deletes a delivery destination policy. For more information about these policies, see
 * PutDeliveryDestinationPolicy.
 */
export const deleteDeliveryDestinationPolicy: (
  input: DeleteDeliveryDestinationPolicyRequest,
) => Effect.Effect<
  DeleteDeliveryDestinationPolicyResponse,
  | ConflictException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDeliveryDestinationPolicyRequest,
  output: DeleteDeliveryDestinationPolicyResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ValidationException,
  ],
}));
/**
 * Creates and assigns an IAM policy that grants permissions to CloudWatch Logs to deliver logs cross-account to a specified destination in this account. To
 * configure the delivery of logs from an Amazon Web Services service in another account to a logs
 * delivery destination in the current account, you must do the following:
 *
 * - Create a delivery source, which is a logical object that represents the resource that
 * is actually sending the logs. For more information, see PutDeliverySource.
 *
 * - Create a *delivery destination*, which is a logical object that
 * represents the actual delivery destination. For more information, see PutDeliveryDestination.
 *
 * - Use this operation in the destination account to assign an IAM policy
 * to the destination. This policy allows delivery to that destination.
 *
 * - Create a *delivery* by pairing exactly one delivery source and one
 * delivery destination. For more information, see CreateDelivery.
 *
 * Only some Amazon Web Services services support being configured as a delivery source. These
 * services are listed as **Supported [V2 Permissions]** in the
 * table at Enabling logging from
 * Amazon Web Services services.
 *
 * The contents of the policy must include two statements. One statement enables general logs
 * delivery, and the other allows delivery to the chosen destination. See the examples for the
 * needed policies.
 */
export const putDeliveryDestinationPolicy: (
  input: PutDeliveryDestinationPolicyRequest,
) => Effect.Effect<
  PutDeliveryDestinationPolicyResponse,
  | ConflictException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDeliveryDestinationPolicyRequest,
  output: PutDeliveryDestinationPolicyResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ValidationException,
  ],
}));
/**
 * Retrieves the delivery destination policy assigned to the delivery destination that you
 * specify. For more information about delivery destinations and their policies, see PutDeliveryDestinationPolicy.
 */
export const getDeliveryDestinationPolicy: (
  input: GetDeliveryDestinationPolicyRequest,
) => Effect.Effect<
  GetDeliveryDestinationPolicyResponse,
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeliveryDestinationPolicyRequest,
  output: GetDeliveryDestinationPolicyResponse,
  errors: [
    ResourceNotFoundException,
    ServiceUnavailableException,
    ValidationException,
  ],
}));
/**
 * Creates a scheduled query that runs CloudWatch Logs Insights queries at regular intervals.
 * Scheduled queries enable proactive monitoring by automatically executing queries to detect
 * patterns and anomalies in your log data. Query results can be delivered to Amazon S3 for analysis
 * or further processing.
 */
export const createScheduledQuery: (
  input: CreateScheduledQueryRequest,
) => Effect.Effect<
  CreateScheduledQueryResponse,
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
  input: CreateScheduledQueryRequest,
  output: CreateScheduledQueryResponse,
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
 * Use this operation to return the valid and default values that are used when creating
 * delivery sources, delivery destinations, and deliveries. For more information about
 * deliveries, see CreateDelivery.
 */
export const describeConfigurationTemplates: {
  (
    input: DescribeConfigurationTemplatesRequest,
  ): Effect.Effect<
    DescribeConfigurationTemplatesResponse,
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeConfigurationTemplatesRequest,
  ) => Stream.Stream<
    DescribeConfigurationTemplatesResponse,
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeConfigurationTemplatesRequest,
  ) => Stream.Stream<
    ConfigurationTemplate,
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeConfigurationTemplatesRequest,
  output: DescribeConfigurationTemplatesResponse,
  errors: [
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "configurationTemplates",
    pageSize: "limit",
  } as const,
}));
/**
 * Retrieves the execution history of a scheduled query within a specified time range,
 * including query results and destination processing status.
 */
export const getScheduledQueryHistory: {
  (
    input: GetScheduledQueryHistoryRequest,
  ): Effect.Effect<
    GetScheduledQueryHistoryResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetScheduledQueryHistoryRequest,
  ) => Stream.Stream<
    GetScheduledQueryHistoryResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetScheduledQueryHistoryRequest,
  ) => Stream.Stream<
    TriggerHistoryRecord,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetScheduledQueryHistoryRequest,
  output: GetScheduledQueryHistoryResponse,
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
    items: "triggerHistory",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates an integration between CloudWatch Logs and another service in this account.
 * Currently, only integrations with OpenSearch Service are supported, and currently you can have
 * only one integration in your account.
 *
 * Integrating with OpenSearch Service makes it possible for you to create curated vended
 * logs dashboards, powered by OpenSearch Service analytics. For more information, see Vended log
 * dashboards powered by Amazon OpenSearch Service.
 *
 * You can use this operation only to create a new integration. You can't modify an existing
 * integration.
 */
export const putIntegration: (
  input: PutIntegrationRequest,
) => Effect.Effect<
  PutIntegrationResponse,
  | InvalidParameterException
  | LimitExceededException
  | ServiceUnavailableException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutIntegrationRequest,
  output: PutIntegrationResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    ServiceUnavailableException,
    ValidationException,
  ],
}));
/**
 * Returns an aggregate summary of all log groups in the Region grouped by specified data
 * source characteristics. Supports optional filtering by log group class, name patterns, and
 * data sources. If you perform this action in a monitoring account, you can also return
 * aggregated summaries of log groups from source accounts that are linked to the monitoring
 * account. For more information about using cross-account observability to set up monitoring
 * accounts and source accounts, see CloudWatch
 * cross-account observability.
 *
 * The operation aggregates log groups by data source name and type and optionally format,
 * providing counts of log groups that share these characteristics. The operation paginates
 * results. By default, it returns up to 50 results and includes a token to retrieve more
 * results.
 */
export const listAggregateLogGroupSummaries: {
  (
    input: ListAggregateLogGroupSummariesRequest,
  ): Effect.Effect<
    ListAggregateLogGroupSummariesResponse,
    | InvalidParameterException
    | ServiceUnavailableException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAggregateLogGroupSummariesRequest,
  ) => Stream.Stream<
    ListAggregateLogGroupSummariesResponse,
    | InvalidParameterException
    | ServiceUnavailableException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAggregateLogGroupSummariesRequest,
  ) => Stream.Stream<
    AggregateLogGroupSummary,
    | InvalidParameterException
    | ServiceUnavailableException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAggregateLogGroupSummariesRequest,
  output: ListAggregateLogGroupSummariesResponse,
  errors: [
    InvalidParameterException,
    ServiceUnavailableException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "aggregateLogGroupSummaries",
    pageSize: "limit",
  } as const,
}));
/**
 * Returns a list of anomalies that log anomaly detectors have found. For details about the
 * structure format of each anomaly object that is returned, see the example in this
 * section.
 */
export const listAnomalies: {
  (
    input: ListAnomaliesRequest,
  ): Effect.Effect<
    ListAnomaliesResponse,
    | InvalidParameterException
    | OperationAbortedException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAnomaliesRequest,
  ) => Stream.Stream<
    ListAnomaliesResponse,
    | InvalidParameterException
    | OperationAbortedException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAnomaliesRequest,
  ) => Stream.Stream<
    Anomaly,
    | InvalidParameterException
    | OperationAbortedException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAnomaliesRequest,
  output: ListAnomaliesResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "anomalies",
    pageSize: "limit",
  } as const,
}));
/**
 * Starts a Live Tail streaming session for one or more log groups. A Live Tail session
 * returns a stream of log events that have been recently ingested in the log groups. For more
 * information, see Use Live Tail to view logs
 * in near real time.
 *
 * The response to this operation is a response stream, over which the server sends live log
 * events and the client receives them.
 *
 * The following objects are sent over the stream:
 *
 * - A single LiveTailSessionStart object is sent at the start of the session.
 *
 * - Every second, a LiveTailSessionUpdate object is sent. Each of these objects contains an array
 * of the actual log events.
 *
 * If no new log events were ingested in the past second, the
 * `LiveTailSessionUpdate` object will contain an empty array.
 *
 * The array of log events contained in a `LiveTailSessionUpdate` can include
 * as many as 500 log events. If the number of log events matching the request exceeds 500
 * per second, the log events are sampled down to 500 log events to be included in each
 * `LiveTailSessionUpdate` object.
 *
 * If your client consumes the log events slower than the server produces them, CloudWatch Logs buffers up to 10 `LiveTailSessionUpdate` events or 5000 log
 * events, after which it starts dropping the oldest events.
 *
 * - A SessionStreamingException object is returned if an unknown error occurs on the
 * server side.
 *
 * - A SessionTimeoutException object is returned when the session times out, after it
 * has been kept open for three hours.
 *
 * The `StartLiveTail` API routes requests to
 * `streaming-logs.*Region*.amazonaws.com` using SDK host
 * prefix injection. VPC endpoint support is not available for this API.
 *
 * You can end a session before it times out by closing the session stream or by closing
 * the client that is receiving the stream. The session also ends if the established connection
 * between the client and the server breaks.
 *
 * For examples of using an SDK to start a Live Tail session, see Start
 * a Live Tail session using an Amazon Web Services SDK.
 */
export const startLiveTail: (
  input: StartLiveTailRequest,
) => Effect.Effect<
  StartLiveTailResponse,
  | AccessDeniedException
  | InvalidOperationException
  | InvalidParameterException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartLiveTailRequest,
  output: StartLiveTailResponse,
  errors: [
    AccessDeniedException,
    InvalidOperationException,
    InvalidParameterException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns information about one integration between CloudWatch Logs and OpenSearch Service.
 */
export const getIntegration: (
  input: GetIntegrationRequest,
) => Effect.Effect<
  GetIntegrationResponse,
  | InvalidParameterException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIntegrationRequest,
  output: GetIntegrationResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Starts a query of one or more log groups or data sources using CloudWatch Logs
 * Insights. You specify the log groups or data sources and time range to query and the query
 * string to use. You can query up to 10 data sources in a single query.
 *
 * For more information, see CloudWatch Logs Insights Query
 * Syntax.
 *
 * After you run a query using `StartQuery`, the query results are stored by
 * CloudWatch Logs. You can use GetQueryResults to retrieve the results of a query, using the `queryId`
 * that `StartQuery` returns.
 *
 * Interactive queries started with `StartQuery` share concurrency limits with
 * automated scheduled query executions. Both types of queries count toward the same regional
 * concurrent query quota, so high scheduled query activity may affect the availability of
 * concurrent slots for interactive queries.
 *
 * To specify the log groups to query, a `StartQuery` operation must include one
 * of the following:
 *
 * - Either exactly one of the following parameters: `logGroupName`,
 * `logGroupNames`, or `logGroupIdentifiers`
 *
 * - Or the `queryString` must include a `SOURCE` command to select
 * log groups for the query. The `SOURCE` command can select log groups based on
 * log group name prefix, account ID, and log class, or select data sources using
 * dataSource syntax in LogsQL, PPL, and SQL.
 *
 * For more information about the `SOURCE` command, see SOURCE.
 *
 * If you have associated a KMS key with the query results in this
 * account, then StartQuery uses
 * that key to encrypt the results when it stores them. If no key is associated with query
 * results, the query results are encrypted with the default CloudWatch Logs encryption
 * method.
 *
 * Queries time out after 60 minutes of runtime. If your queries are timing out, reduce the
 * time range being searched or partition your query into a number of queries.
 *
 * If you are using CloudWatch cross-account observability, you can use this operation
 * in a monitoring account to start a query in a linked source account. For more information, see
 * CloudWatch cross-account observability. For a cross-account `StartQuery`
 * operation, the query definition must be defined in the monitoring account.
 *
 * You can have up to 30 concurrent CloudWatch Logs insights queries, including queries
 * that have been added to dashboards.
 */
export const startQuery: (
  input: StartQueryRequest,
) => Effect.Effect<
  StartQueryResponse,
  | InvalidParameterException
  | LimitExceededException
  | MalformedQueryException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartQueryRequest,
  output: StartQueryResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    MalformedQueryException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Uploads a batch of log events to the specified log stream.
 *
 * The sequence token is now ignored in `PutLogEvents` actions.
 * `PutLogEvents` actions are always accepted and never return
 * `InvalidSequenceTokenException` or `DataAlreadyAcceptedException`
 * even if the sequence token is not valid. You can use parallel `PutLogEvents`
 * actions on the same log stream.
 *
 * The batch of events must satisfy the following constraints:
 *
 * - The maximum batch size is 1,048,576 bytes. This size is calculated as the sum of
 * all event messages in UTF-8, plus 26 bytes for each log event.
 *
 * - Events more than 2 hours in the future are rejected while processing remaining
 * valid events.
 *
 * - Events older than 14 days or preceding the log group's retention period are
 * rejected while processing remaining valid events.
 *
 * - The log events in the batch must be in chronological order by their timestamp. The
 * timestamp is the time that the event occurred, expressed as the number of milliseconds
 * after `Jan 1, 1970 00:00:00 UTC`. (In Amazon Web Services Tools for PowerShell
 * and the Amazon Web Services SDK for .NET, the timestamp is specified in .NET format:
 * `yyyy-mm-ddThh:mm:ss`. For example, `2017-09-15T13:45:30`.)
 *
 * - A batch of log events in a single request must be in a chronological order.
 * Otherwise, the operation fails.
 *
 * - Each log event can be no larger than 1 MB.
 *
 * - The maximum number of log events in a batch is 10,000.
 *
 * - For valid events (within 14 days in the past to 2 hours in future), the time span
 * in a single batch cannot exceed 24 hours. Otherwise, the operation fails.
 *
 * The quota of five requests per second per log stream has been removed. Instead,
 * `PutLogEvents` actions are throttled based on a per-second per-account quota.
 * You can request an increase to the per-second throttling quota by using the Service Quotas service.
 *
 * If a call to `PutLogEvents` returns "UnrecognizedClientException" the most
 * likely cause is a non-valid Amazon Web Services access key ID or secret key.
 */
export const putLogEvents: (
  input: PutLogEventsRequest,
) => Effect.Effect<
  PutLogEventsResponse,
  | DataAlreadyAcceptedException
  | InvalidParameterException
  | InvalidSequenceTokenException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | UnrecognizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutLogEventsRequest,
  output: PutLogEventsResponse,
  errors: [
    DataAlreadyAcceptedException,
    InvalidParameterException,
    InvalidSequenceTokenException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    UnrecognizedClientException,
  ],
}));
