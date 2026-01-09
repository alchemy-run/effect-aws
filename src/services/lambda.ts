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
  sdkId: "Lambda",
  serviceShapeName: "AWSGirApiService",
});
const auth = T.AwsAuthSigv4({ name: "lambda" });
const ver = T.ServiceVersion("2015-03-31");
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
              `https://lambda-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://lambda-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://lambda.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://lambda.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type DurableExecutionArn = string;
export type CheckpointToken = string;
export type ClientToken = string;
export type NamespacedFunctionName = string;
export type NumericLatestPublishedOrAliasQualifier = string;
export type IncludeExecutionData = boolean;
export type ItemCount = number;
export type ReverseOrder = boolean;
export type DurableExecutionName = string;
export type ExecutionTimestamp = Date;
export type MaxFunctionEventInvokeConfigListItems = number;
export type TaggableResource = string;
export type MaximumRetryAttempts = number;
export type MaximumEventAgeInSeconds = number;
export type CallbackId = string;
export type TagKey = string;
export type CapacityProviderName = string;
export type KMSKeyArnNonEmpty = string;
export type MaxFiftyListItems = number;
export type Description = string;
export type MaxListItems = number;
export type CodeSigningConfigArn = string;
export type Arn = string;
export type Enabled = boolean;
export type BatchSize = number;
export type MaximumBatchingWindowInSeconds = number;
export type ParallelizationFactor = number;
export type MaximumRecordAgeInSeconds = number;
export type BisectBatchOnFunctionError = boolean;
export type MaximumRetryAttemptsEventSourceMapping = number;
export type TumblingWindowInSeconds = number;
export type Topic = string;
export type Queue = string;
export type KMSKeyArn = string;
export type FunctionName = string;
export type RoleArn = string;
export type Handler = string;
export type Timeout = number;
export type MemorySize = number;
export type LayerVersionArn = string;
export type MasterRegion = string;
export type FunctionUrlQualifier = string;
export type MaxItems = number;
export type MaxProvisionedConcurrencyConfigListItems = number;
export type ReservedConcurrentExecutions = number;
export type S3Bucket = string;
export type S3Key = string;
export type S3ObjectVersion = string;
export type UnqualifiedFunctionName = string;
export type PublishedFunctionQualifier = string;
export type TenantId = string;
export type RuntimeVersionArn = string;
export type Alias = string;
export type VersionWithLatestPublished = string;
export type MaxLayerListItems = number;
export type LayerName = string;
export type LayerVersionNumber = number;
export type StatementId = string;
export type LayerPermissionAllowedAction = string;
export type LayerPermissionAllowedPrincipal = string;
export type OrganizationId = string;
export type LicenseInfo = string;
export type Action = string;
export type Principal = string;
export type SourceOwner = string;
export type EventSourceToken = string;
export type PrincipalOrgID = string;
export type InvokedViaFunctionUrl = boolean;
export type NamespacedStatementId = string;
export type Qualifier = string;
export type PositiveInteger = number;
export type OperationId = string;
export type OperationName = string;
export type OperationSubType = string;
export type OperationPayload = string | redacted.Redacted<string>;
export type UnreservedConcurrentExecutions = number;
export type ErrorMessage = string | redacted.Redacted<string>;
export type ErrorType = string | redacted.Redacted<string>;
export type ErrorData = string | redacted.Redacted<string>;
export type StackTraceEntry = string | redacted.Redacted<string>;
export type TagValue = string;
export type SubnetId = string;
export type SecurityGroupId = string;
export type InstanceType = string;
export type CapacityProviderMaxVCpuCount = number;
export type URI = string;
export type MaximumConcurrency = number;
export type DatabaseName = string;
export type CollectionName = string;
export type MinimumNumberOfPollers = number;
export type MaximumNumberOfPollers = number;
export type ProvisionedPollerGroupName = string;
export type ResourceArn = string;
export type FileSystemArn = string;
export type LocalMountPath = string;
export type WorkingDirectory = string;
export type EphemeralStorageSize = number;
export type LogGroup = string;
export type RetentionPeriodInDays = number;
export type ExecutionTimeout = number;
export type AllowCredentials = boolean;
export type Header = string;
export type Method = string;
export type Origin = string;
export type MaxAge = number;
export type FunctionScalingConfigExecutionEnvironments = number;
export type NameSpacedFunctionArn = string;
export type InputPayload = string | redacted.Redacted<string>;
export type OutputPayload = string | redacted.Redacted<string>;
export type FunctionArn = string;
export type CapacityProviderArn = string;
export type EventSourceMappingArn = string;
export type FunctionUrl = string;
export type Version = string;
export type StateReason = string;
export type LastUpdateStatusReason = string;
export type HttpStatus = number;
export type LayerArn = string;
export type NonNegativeInteger = number;
export type ReplayChildren = boolean;
export type DurationSeconds = number;
export type DestinationArn = string;
export type MetricTargetValue = number;
export type Pattern = string;
export type Endpoint = string;
export type SchemaRegistryUri = string;
export type EnvironmentVariableName = string | redacted.Redacted<string>;
export type EnvironmentVariableValue = string | redacted.Redacted<string>;
export type PerExecutionEnvironmentMaxConcurrency = number;
export type ExecutionEnvironmentMemoryGiBPerVCpu = number;
export type AdditionalVersion = string;
export type Weight = number;
export type XAmznTraceId = string;
export type EventId = number;
export type CodeSigningConfigId = string;
export type FilterCriteriaErrorCode = string;
export type FilterCriteriaErrorMessage = string;
export type VpcId = string;
export type TagsErrorCode = string;
export type TagsErrorMessage = string;
export type AttemptCount = number;
export type SensitiveString = string | redacted.Redacted<string>;
export type Truncated = boolean;

//# Schemas
export interface GetAccountSettingsRequest {}
export const GetAccountSettingsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2016-08-19/account-settings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAccountSettingsRequest",
}) as any as S.Schema<GetAccountSettingsRequest>;
export type ExecutionStatus =
  | "RUNNING"
  | "SUCCEEDED"
  | "FAILED"
  | "TIMED_OUT"
  | "STOPPED"
  | (string & {});
export const ExecutionStatus = S.String;
export type ExecutionStatusList = ExecutionStatus[];
export const ExecutionStatusList = S.Array(ExecutionStatus);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type CapacityProviderState =
  | "Pending"
  | "Active"
  | "Failed"
  | "Deleting"
  | (string & {});
export const CapacityProviderState = S.String;
export type EventSourcePosition =
  | "TRIM_HORIZON"
  | "LATEST"
  | "AT_TIMESTAMP"
  | (string & {});
export const EventSourcePosition = S.String;
export type Topics = string[];
export const Topics = S.Array(S.String);
export type Queues = string[];
export const Queues = S.Array(S.String);
export type FunctionResponseType = "ReportBatchItemFailures" | (string & {});
export const FunctionResponseType = S.String;
export type FunctionResponseTypeList = FunctionResponseType[];
export const FunctionResponseTypeList = S.Array(FunctionResponseType);
export type Runtime =
  | "nodejs"
  | "nodejs4.3"
  | "nodejs6.10"
  | "nodejs8.10"
  | "nodejs10.x"
  | "nodejs12.x"
  | "nodejs14.x"
  | "nodejs16.x"
  | "java8"
  | "java8.al2"
  | "java11"
  | "python2.7"
  | "python3.6"
  | "python3.7"
  | "python3.8"
  | "python3.9"
  | "dotnetcore1.0"
  | "dotnetcore2.0"
  | "dotnetcore2.1"
  | "dotnetcore3.1"
  | "dotnet6"
  | "dotnet8"
  | "nodejs4.3-edge"
  | "go1.x"
  | "ruby2.5"
  | "ruby2.7"
  | "provided"
  | "provided.al2"
  | "nodejs18.x"
  | "python3.10"
  | "java17"
  | "ruby3.2"
  | "ruby3.3"
  | "ruby3.4"
  | "python3.11"
  | "nodejs20.x"
  | "provided.al2023"
  | "python3.12"
  | "java21"
  | "python3.13"
  | "nodejs22.x"
  | "nodejs24.x"
  | "python3.14"
  | "java25"
  | "dotnet10"
  | (string & {});
export const Runtime = S.String;
export type PackageType = "Zip" | "Image" | (string & {});
export const PackageType = S.String;
export type LayerList = string[];
export const LayerList = S.Array(S.String);
export type Architecture = "x86_64" | "arm64" | (string & {});
export const Architecture = S.String;
export type ArchitecturesList = Architecture[];
export const ArchitecturesList = S.Array(Architecture);
export type FunctionVersionLatestPublished = "LATEST_PUBLISHED" | (string & {});
export const FunctionVersionLatestPublished = S.String;
export type FunctionVersion = "ALL" | (string & {});
export const FunctionVersion = S.String;
export type FunctionUrlAuthType = "NONE" | "AWS_IAM" | (string & {});
export const FunctionUrlAuthType = S.String;
export type InvokeMode = "BUFFERED" | "RESPONSE_STREAM" | (string & {});
export const InvokeMode = S.String;
export type InvocationType =
  | "Event"
  | "RequestResponse"
  | "DryRun"
  | (string & {});
export const InvocationType = S.String;
export type LogType = "None" | "Tail" | (string & {});
export const LogType = S.String;
export type ResponseStreamingInvocationType =
  | "RequestResponse"
  | "DryRun"
  | (string & {});
export const ResponseStreamingInvocationType = S.String;
export type RecursiveLoop = "Allow" | "Terminate" | (string & {});
export const RecursiveLoop = S.String;
export type UpdateRuntimeOn =
  | "Auto"
  | "Manual"
  | "FunctionUpdate"
  | (string & {});
export const UpdateRuntimeOn = S.String;
export type CompatibleRuntimes = Runtime[];
export const CompatibleRuntimes = S.Array(Runtime);
export type CompatibleArchitectures = Architecture[];
export const CompatibleArchitectures = S.Array(Architecture);
export interface DeleteFunctionRequest {
  FunctionName: string;
  Qualifier?: string;
}
export const DeleteFunctionRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/2015-03-31/functions/{FunctionName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFunctionRequest",
}) as any as S.Schema<DeleteFunctionRequest>;
export interface DeleteFunctionEventInvokeConfigRequest {
  FunctionName: string;
  Qualifier?: string;
}
export const DeleteFunctionEventInvokeConfigRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/2019-09-25/functions/{FunctionName}/event-invoke-config",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFunctionEventInvokeConfigRequest",
}) as any as S.Schema<DeleteFunctionEventInvokeConfigRequest>;
export interface DeleteFunctionEventInvokeConfigResponse {}
export const DeleteFunctionEventInvokeConfigResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteFunctionEventInvokeConfigResponse",
}) as any as S.Schema<DeleteFunctionEventInvokeConfigResponse>;
export interface GetDurableExecutionRequest {
  DurableExecutionArn: string;
}
export const GetDurableExecutionRequest = S.suspend(() =>
  S.Struct({
    DurableExecutionArn: S.String.pipe(T.HttpLabel("DurableExecutionArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2025-12-01/durable-executions/{DurableExecutionArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDurableExecutionRequest",
}) as any as S.Schema<GetDurableExecutionRequest>;
export interface GetDurableExecutionHistoryRequest {
  DurableExecutionArn: string;
  IncludeExecutionData?: boolean;
  MaxItems?: number;
  Marker?: string;
  ReverseOrder?: boolean;
}
export const GetDurableExecutionHistoryRequest = S.suspend(() =>
  S.Struct({
    DurableExecutionArn: S.String.pipe(T.HttpLabel("DurableExecutionArn")),
    IncludeExecutionData: S.optional(S.Boolean).pipe(
      T.HttpQuery("IncludeExecutionData"),
    ),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    ReverseOrder: S.optional(S.Boolean).pipe(T.HttpQuery("ReverseOrder")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2025-12-01/durable-executions/{DurableExecutionArn}/history",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDurableExecutionHistoryRequest",
}) as any as S.Schema<GetDurableExecutionHistoryRequest>;
export interface GetDurableExecutionStateRequest {
  DurableExecutionArn: string;
  CheckpointToken: string;
  Marker?: string;
  MaxItems?: number;
}
export const GetDurableExecutionStateRequest = S.suspend(() =>
  S.Struct({
    DurableExecutionArn: S.String.pipe(T.HttpLabel("DurableExecutionArn")),
    CheckpointToken: S.String.pipe(T.HttpQuery("CheckpointToken")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2025-12-01/durable-executions/{DurableExecutionArn}/state",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDurableExecutionStateRequest",
}) as any as S.Schema<GetDurableExecutionStateRequest>;
export interface GetFunctionEventInvokeConfigRequest {
  FunctionName: string;
  Qualifier?: string;
}
export const GetFunctionEventInvokeConfigRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2019-09-25/functions/{FunctionName}/event-invoke-config",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFunctionEventInvokeConfigRequest",
}) as any as S.Schema<GetFunctionEventInvokeConfigRequest>;
export interface ListDurableExecutionsByFunctionRequest {
  FunctionName: string;
  Qualifier?: string;
  DurableExecutionName?: string;
  Statuses?: ExecutionStatus[];
  StartedAfter?: Date;
  StartedBefore?: Date;
  ReverseOrder?: boolean;
  Marker?: string;
  MaxItems?: number;
}
export const ListDurableExecutionsByFunctionRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
    DurableExecutionName: S.optional(S.String).pipe(
      T.HttpQuery("DurableExecutionName"),
    ),
    Statuses: S.optional(ExecutionStatusList).pipe(T.HttpQuery("Statuses")),
    StartedAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("StartedAfter")),
    StartedBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("StartedBefore")),
    ReverseOrder: S.optional(S.Boolean).pipe(T.HttpQuery("ReverseOrder")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2025-12-01/functions/{FunctionName}/durable-executions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDurableExecutionsByFunctionRequest",
}) as any as S.Schema<ListDurableExecutionsByFunctionRequest>;
export interface ListFunctionEventInvokeConfigsRequest {
  FunctionName: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListFunctionEventInvokeConfigsRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2019-09-25/functions/{FunctionName}/event-invoke-config/list",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFunctionEventInvokeConfigsRequest",
}) as any as S.Schema<ListFunctionEventInvokeConfigsRequest>;
export interface ListTagsRequest {
  Resource: string;
}
export const ListTagsRequest = S.suspend(() =>
  S.Struct({ Resource: S.String.pipe(T.HttpLabel("Resource")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2017-03-31/tags/{Resource}" }),
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
export interface SendDurableExecutionCallbackHeartbeatRequest {
  CallbackId: string;
}
export const SendDurableExecutionCallbackHeartbeatRequest = S.suspend(() =>
  S.Struct({ CallbackId: S.String.pipe(T.HttpLabel("CallbackId")) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/2025-12-01/durable-execution-callbacks/{CallbackId}/heartbeat",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendDurableExecutionCallbackHeartbeatRequest",
}) as any as S.Schema<SendDurableExecutionCallbackHeartbeatRequest>;
export interface SendDurableExecutionCallbackHeartbeatResponse {}
export const SendDurableExecutionCallbackHeartbeatResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "SendDurableExecutionCallbackHeartbeatResponse",
}) as any as S.Schema<SendDurableExecutionCallbackHeartbeatResponse>;
export interface SendDurableExecutionCallbackSuccessRequest {
  CallbackId: string;
  Result?: T.StreamingInputBody;
}
export const SendDurableExecutionCallbackSuccessRequest = S.suspend(() =>
  S.Struct({
    CallbackId: S.String.pipe(T.HttpLabel("CallbackId")),
    Result: S.optional(T.StreamingInput).pipe(T.HttpPayload()),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/2025-12-01/durable-execution-callbacks/{CallbackId}/succeed",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendDurableExecutionCallbackSuccessRequest",
}) as any as S.Schema<SendDurableExecutionCallbackSuccessRequest>;
export interface SendDurableExecutionCallbackSuccessResponse {}
export const SendDurableExecutionCallbackSuccessResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "SendDurableExecutionCallbackSuccessResponse",
}) as any as S.Schema<SendDurableExecutionCallbackSuccessResponse>;
export type StackTraceEntries = string | redacted.Redacted<string>[];
export const StackTraceEntries = S.Array(SensitiveString);
export interface ErrorObject {
  ErrorMessage?: string | redacted.Redacted<string>;
  ErrorType?: string | redacted.Redacted<string>;
  ErrorData?: string | redacted.Redacted<string>;
  StackTrace?: string | redacted.Redacted<string>[];
}
export const ErrorObject = S.suspend(() =>
  S.Struct({
    ErrorMessage: S.optional(SensitiveString),
    ErrorType: S.optional(SensitiveString),
    ErrorData: S.optional(SensitiveString),
    StackTrace: S.optional(StackTraceEntries),
  }),
).annotations({ identifier: "ErrorObject" }) as any as S.Schema<ErrorObject>;
export interface StopDurableExecutionRequest {
  DurableExecutionArn: string;
  Error?: ErrorObject;
}
export const StopDurableExecutionRequest = S.suspend(() =>
  S.Struct({
    DurableExecutionArn: S.String.pipe(T.HttpLabel("DurableExecutionArn")),
    Error: S.optional(ErrorObject)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ErrorObject" }),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/2025-12-01/durable-executions/{DurableExecutionArn}/stop",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopDurableExecutionRequest",
}) as any as S.Schema<StopDurableExecutionRequest>;
export interface UntagResourceRequest {
  Resource: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    Resource: S.String.pipe(T.HttpLabel("Resource")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/2017-03-31/tags/{Resource}" }),
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
export interface OnSuccess {
  Destination?: string;
}
export const OnSuccess = S.suspend(() =>
  S.Struct({ Destination: S.optional(S.String) }),
).annotations({ identifier: "OnSuccess" }) as any as S.Schema<OnSuccess>;
export interface OnFailure {
  Destination?: string;
}
export const OnFailure = S.suspend(() =>
  S.Struct({ Destination: S.optional(S.String) }),
).annotations({ identifier: "OnFailure" }) as any as S.Schema<OnFailure>;
export interface DestinationConfig {
  OnSuccess?: OnSuccess;
  OnFailure?: OnFailure;
}
export const DestinationConfig = S.suspend(() =>
  S.Struct({
    OnSuccess: S.optional(OnSuccess),
    OnFailure: S.optional(OnFailure),
  }),
).annotations({
  identifier: "DestinationConfig",
}) as any as S.Schema<DestinationConfig>;
export interface UpdateFunctionEventInvokeConfigRequest {
  FunctionName: string;
  Qualifier?: string;
  MaximumRetryAttempts?: number;
  MaximumEventAgeInSeconds?: number;
  DestinationConfig?: DestinationConfig;
}
export const UpdateFunctionEventInvokeConfigRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
    MaximumRetryAttempts: S.optional(S.Number),
    MaximumEventAgeInSeconds: S.optional(S.Number),
    DestinationConfig: S.optional(DestinationConfig),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/2019-09-25/functions/{FunctionName}/event-invoke-config",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFunctionEventInvokeConfigRequest",
}) as any as S.Schema<UpdateFunctionEventInvokeConfigRequest>;
export interface GetCapacityProviderRequest {
  CapacityProviderName: string;
}
export const GetCapacityProviderRequest = S.suspend(() =>
  S.Struct({
    CapacityProviderName: S.String.pipe(T.HttpLabel("CapacityProviderName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2025-11-30/capacity-providers/{CapacityProviderName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCapacityProviderRequest",
}) as any as S.Schema<GetCapacityProviderRequest>;
export type CapacityProviderScalingMode = "Auto" | "Manual" | (string & {});
export const CapacityProviderScalingMode = S.String;
export type CapacityProviderPredefinedMetricType =
  | "LambdaCapacityProviderAverageCPUUtilization"
  | (string & {});
export const CapacityProviderPredefinedMetricType = S.String;
export interface TargetTrackingScalingPolicy {
  PredefinedMetricType: CapacityProviderPredefinedMetricType;
  TargetValue: number;
}
export const TargetTrackingScalingPolicy = S.suspend(() =>
  S.Struct({
    PredefinedMetricType: CapacityProviderPredefinedMetricType,
    TargetValue: S.Number,
  }),
).annotations({
  identifier: "TargetTrackingScalingPolicy",
}) as any as S.Schema<TargetTrackingScalingPolicy>;
export type CapacityProviderScalingPoliciesList = TargetTrackingScalingPolicy[];
export const CapacityProviderScalingPoliciesList = S.Array(
  TargetTrackingScalingPolicy,
);
export interface CapacityProviderScalingConfig {
  MaxVCpuCount?: number;
  ScalingMode?: CapacityProviderScalingMode;
  ScalingPolicies?: TargetTrackingScalingPolicy[];
}
export const CapacityProviderScalingConfig = S.suspend(() =>
  S.Struct({
    MaxVCpuCount: S.optional(S.Number),
    ScalingMode: S.optional(CapacityProviderScalingMode),
    ScalingPolicies: S.optional(CapacityProviderScalingPoliciesList),
  }),
).annotations({
  identifier: "CapacityProviderScalingConfig",
}) as any as S.Schema<CapacityProviderScalingConfig>;
export interface UpdateCapacityProviderRequest {
  CapacityProviderName: string;
  CapacityProviderScalingConfig?: CapacityProviderScalingConfig;
}
export const UpdateCapacityProviderRequest = S.suspend(() =>
  S.Struct({
    CapacityProviderName: S.String.pipe(T.HttpLabel("CapacityProviderName")),
    CapacityProviderScalingConfig: S.optional(CapacityProviderScalingConfig),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/2025-11-30/capacity-providers/{CapacityProviderName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCapacityProviderRequest",
}) as any as S.Schema<UpdateCapacityProviderRequest>;
export interface DeleteCapacityProviderRequest {
  CapacityProviderName: string;
}
export const DeleteCapacityProviderRequest = S.suspend(() =>
  S.Struct({
    CapacityProviderName: S.String.pipe(T.HttpLabel("CapacityProviderName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/2025-11-30/capacity-providers/{CapacityProviderName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCapacityProviderRequest",
}) as any as S.Schema<DeleteCapacityProviderRequest>;
export interface ListCapacityProvidersRequest {
  State?: CapacityProviderState;
  Marker?: string;
  MaxItems?: number;
}
export const ListCapacityProvidersRequest = S.suspend(() =>
  S.Struct({
    State: S.optional(CapacityProviderState).pipe(T.HttpQuery("State")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2025-11-30/capacity-providers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCapacityProvidersRequest",
}) as any as S.Schema<ListCapacityProvidersRequest>;
export interface ListFunctionVersionsByCapacityProviderRequest {
  CapacityProviderName: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListFunctionVersionsByCapacityProviderRequest = S.suspend(() =>
  S.Struct({
    CapacityProviderName: S.String.pipe(T.HttpLabel("CapacityProviderName")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2025-11-30/capacity-providers/{CapacityProviderName}/function-versions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFunctionVersionsByCapacityProviderRequest",
}) as any as S.Schema<ListFunctionVersionsByCapacityProviderRequest>;
export interface ListCodeSigningConfigsRequest {
  Marker?: string;
  MaxItems?: number;
}
export const ListCodeSigningConfigsRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2020-04-22/code-signing-configs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCodeSigningConfigsRequest",
}) as any as S.Schema<ListCodeSigningConfigsRequest>;
export interface DeleteCodeSigningConfigRequest {
  CodeSigningConfigArn: string;
}
export const DeleteCodeSigningConfigRequest = S.suspend(() =>
  S.Struct({
    CodeSigningConfigArn: S.String.pipe(T.HttpLabel("CodeSigningConfigArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/2020-04-22/code-signing-configs/{CodeSigningConfigArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCodeSigningConfigRequest",
}) as any as S.Schema<DeleteCodeSigningConfigRequest>;
export interface DeleteCodeSigningConfigResponse {}
export const DeleteCodeSigningConfigResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCodeSigningConfigResponse",
}) as any as S.Schema<DeleteCodeSigningConfigResponse>;
export interface GetCodeSigningConfigRequest {
  CodeSigningConfigArn: string;
}
export const GetCodeSigningConfigRequest = S.suspend(() =>
  S.Struct({
    CodeSigningConfigArn: S.String.pipe(T.HttpLabel("CodeSigningConfigArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2020-04-22/code-signing-configs/{CodeSigningConfigArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCodeSigningConfigRequest",
}) as any as S.Schema<GetCodeSigningConfigRequest>;
export interface ListFunctionsByCodeSigningConfigRequest {
  CodeSigningConfigArn: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListFunctionsByCodeSigningConfigRequest = S.suspend(() =>
  S.Struct({
    CodeSigningConfigArn: S.String.pipe(T.HttpLabel("CodeSigningConfigArn")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2020-04-22/code-signing-configs/{CodeSigningConfigArn}/functions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFunctionsByCodeSigningConfigRequest",
}) as any as S.Schema<ListFunctionsByCodeSigningConfigRequest>;
export type SigningProfileVersionArns = string[];
export const SigningProfileVersionArns = S.Array(S.String);
export interface AllowedPublishers {
  SigningProfileVersionArns: string[];
}
export const AllowedPublishers = S.suspend(() =>
  S.Struct({ SigningProfileVersionArns: SigningProfileVersionArns }),
).annotations({
  identifier: "AllowedPublishers",
}) as any as S.Schema<AllowedPublishers>;
export type CodeSigningPolicy = "Warn" | "Enforce" | (string & {});
export const CodeSigningPolicy = S.String;
export interface CodeSigningPolicies {
  UntrustedArtifactOnDeployment?: CodeSigningPolicy;
}
export const CodeSigningPolicies = S.suspend(() =>
  S.Struct({ UntrustedArtifactOnDeployment: S.optional(CodeSigningPolicy) }),
).annotations({
  identifier: "CodeSigningPolicies",
}) as any as S.Schema<CodeSigningPolicies>;
export interface UpdateCodeSigningConfigRequest {
  CodeSigningConfigArn: string;
  Description?: string;
  AllowedPublishers?: AllowedPublishers;
  CodeSigningPolicies?: CodeSigningPolicies;
}
export const UpdateCodeSigningConfigRequest = S.suspend(() =>
  S.Struct({
    CodeSigningConfigArn: S.String.pipe(T.HttpLabel("CodeSigningConfigArn")),
    Description: S.optional(S.String),
    AllowedPublishers: S.optional(AllowedPublishers),
    CodeSigningPolicies: S.optional(CodeSigningPolicies),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/2020-04-22/code-signing-configs/{CodeSigningConfigArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCodeSigningConfigRequest",
}) as any as S.Schema<UpdateCodeSigningConfigRequest>;
export interface GetEventSourceMappingRequest {
  UUID: string;
}
export const GetEventSourceMappingRequest = S.suspend(() =>
  S.Struct({ UUID: S.String.pipe(T.HttpLabel("UUID")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2015-03-31/event-source-mappings/{UUID}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEventSourceMappingRequest",
}) as any as S.Schema<GetEventSourceMappingRequest>;
export interface Filter {
  Pattern?: string;
}
export const Filter = S.suspend(() =>
  S.Struct({ Pattern: S.optional(S.String) }),
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
export type SourceAccessType =
  | "BASIC_AUTH"
  | "VPC_SUBNET"
  | "VPC_SECURITY_GROUP"
  | "SASL_SCRAM_512_AUTH"
  | "SASL_SCRAM_256_AUTH"
  | "VIRTUAL_HOST"
  | "CLIENT_CERTIFICATE_TLS_AUTH"
  | "SERVER_ROOT_CA_CERTIFICATE"
  | (string & {});
export const SourceAccessType = S.String;
export interface SourceAccessConfiguration {
  Type?: SourceAccessType;
  URI?: string;
}
export const SourceAccessConfiguration = S.suspend(() =>
  S.Struct({ Type: S.optional(SourceAccessType), URI: S.optional(S.String) }),
).annotations({
  identifier: "SourceAccessConfiguration",
}) as any as S.Schema<SourceAccessConfiguration>;
export type SourceAccessConfigurations = SourceAccessConfiguration[];
export const SourceAccessConfigurations = S.Array(SourceAccessConfiguration);
export interface ScalingConfig {
  MaximumConcurrency?: number;
}
export const ScalingConfig = S.suspend(() =>
  S.Struct({ MaximumConcurrency: S.optional(S.Number) }),
).annotations({
  identifier: "ScalingConfig",
}) as any as S.Schema<ScalingConfig>;
export type SchemaRegistryEventRecordFormat = "JSON" | "SOURCE" | (string & {});
export const SchemaRegistryEventRecordFormat = S.String;
export type KafkaSchemaRegistryAuthType =
  | "BASIC_AUTH"
  | "CLIENT_CERTIFICATE_TLS_AUTH"
  | "SERVER_ROOT_CA_CERTIFICATE"
  | (string & {});
export const KafkaSchemaRegistryAuthType = S.String;
export interface KafkaSchemaRegistryAccessConfig {
  Type?: KafkaSchemaRegistryAuthType;
  URI?: string;
}
export const KafkaSchemaRegistryAccessConfig = S.suspend(() =>
  S.Struct({
    Type: S.optional(KafkaSchemaRegistryAuthType),
    URI: S.optional(S.String),
  }),
).annotations({
  identifier: "KafkaSchemaRegistryAccessConfig",
}) as any as S.Schema<KafkaSchemaRegistryAccessConfig>;
export type KafkaSchemaRegistryAccessConfigList =
  KafkaSchemaRegistryAccessConfig[];
export const KafkaSchemaRegistryAccessConfigList = S.Array(
  KafkaSchemaRegistryAccessConfig,
);
export type KafkaSchemaValidationAttribute = "KEY" | "VALUE" | (string & {});
export const KafkaSchemaValidationAttribute = S.String;
export interface KafkaSchemaValidationConfig {
  Attribute?: KafkaSchemaValidationAttribute;
}
export const KafkaSchemaValidationConfig = S.suspend(() =>
  S.Struct({ Attribute: S.optional(KafkaSchemaValidationAttribute) }),
).annotations({
  identifier: "KafkaSchemaValidationConfig",
}) as any as S.Schema<KafkaSchemaValidationConfig>;
export type KafkaSchemaValidationConfigList = KafkaSchemaValidationConfig[];
export const KafkaSchemaValidationConfigList = S.Array(
  KafkaSchemaValidationConfig,
);
export interface KafkaSchemaRegistryConfig {
  SchemaRegistryURI?: string;
  EventRecordFormat?: SchemaRegistryEventRecordFormat;
  AccessConfigs?: KafkaSchemaRegistryAccessConfig[];
  SchemaValidationConfigs?: KafkaSchemaValidationConfig[];
}
export const KafkaSchemaRegistryConfig = S.suspend(() =>
  S.Struct({
    SchemaRegistryURI: S.optional(S.String),
    EventRecordFormat: S.optional(SchemaRegistryEventRecordFormat),
    AccessConfigs: S.optional(KafkaSchemaRegistryAccessConfigList),
    SchemaValidationConfigs: S.optional(KafkaSchemaValidationConfigList),
  }),
).annotations({
  identifier: "KafkaSchemaRegistryConfig",
}) as any as S.Schema<KafkaSchemaRegistryConfig>;
export interface AmazonManagedKafkaEventSourceConfig {
  ConsumerGroupId?: string;
  SchemaRegistryConfig?: KafkaSchemaRegistryConfig;
}
export const AmazonManagedKafkaEventSourceConfig = S.suspend(() =>
  S.Struct({
    ConsumerGroupId: S.optional(S.String),
    SchemaRegistryConfig: S.optional(KafkaSchemaRegistryConfig),
  }),
).annotations({
  identifier: "AmazonManagedKafkaEventSourceConfig",
}) as any as S.Schema<AmazonManagedKafkaEventSourceConfig>;
export interface SelfManagedKafkaEventSourceConfig {
  ConsumerGroupId?: string;
  SchemaRegistryConfig?: KafkaSchemaRegistryConfig;
}
export const SelfManagedKafkaEventSourceConfig = S.suspend(() =>
  S.Struct({
    ConsumerGroupId: S.optional(S.String),
    SchemaRegistryConfig: S.optional(KafkaSchemaRegistryConfig),
  }),
).annotations({
  identifier: "SelfManagedKafkaEventSourceConfig",
}) as any as S.Schema<SelfManagedKafkaEventSourceConfig>;
export type FullDocument = "UpdateLookup" | "Default" | (string & {});
export const FullDocument = S.String;
export interface DocumentDBEventSourceConfig {
  DatabaseName?: string;
  CollectionName?: string;
  FullDocument?: FullDocument;
}
export const DocumentDBEventSourceConfig = S.suspend(() =>
  S.Struct({
    DatabaseName: S.optional(S.String),
    CollectionName: S.optional(S.String),
    FullDocument: S.optional(FullDocument),
  }),
).annotations({
  identifier: "DocumentDBEventSourceConfig",
}) as any as S.Schema<DocumentDBEventSourceConfig>;
export type EventSourceMappingMetric = "EventCount" | (string & {});
export const EventSourceMappingMetric = S.String;
export type EventSourceMappingMetricList = EventSourceMappingMetric[];
export const EventSourceMappingMetricList = S.Array(EventSourceMappingMetric);
export interface EventSourceMappingMetricsConfig {
  Metrics?: EventSourceMappingMetric[];
}
export const EventSourceMappingMetricsConfig = S.suspend(() =>
  S.Struct({ Metrics: S.optional(EventSourceMappingMetricList) }),
).annotations({
  identifier: "EventSourceMappingMetricsConfig",
}) as any as S.Schema<EventSourceMappingMetricsConfig>;
export interface ProvisionedPollerConfig {
  MinimumPollers?: number;
  MaximumPollers?: number;
  PollerGroupName?: string;
}
export const ProvisionedPollerConfig = S.suspend(() =>
  S.Struct({
    MinimumPollers: S.optional(S.Number),
    MaximumPollers: S.optional(S.Number),
    PollerGroupName: S.optional(S.String),
  }),
).annotations({
  identifier: "ProvisionedPollerConfig",
}) as any as S.Schema<ProvisionedPollerConfig>;
export interface UpdateEventSourceMappingRequest {
  UUID: string;
  FunctionName?: string;
  Enabled?: boolean;
  BatchSize?: number;
  FilterCriteria?: FilterCriteria;
  MaximumBatchingWindowInSeconds?: number;
  DestinationConfig?: DestinationConfig;
  MaximumRecordAgeInSeconds?: number;
  BisectBatchOnFunctionError?: boolean;
  MaximumRetryAttempts?: number;
  ParallelizationFactor?: number;
  SourceAccessConfigurations?: SourceAccessConfiguration[];
  TumblingWindowInSeconds?: number;
  FunctionResponseTypes?: FunctionResponseType[];
  ScalingConfig?: ScalingConfig;
  AmazonManagedKafkaEventSourceConfig?: AmazonManagedKafkaEventSourceConfig;
  SelfManagedKafkaEventSourceConfig?: SelfManagedKafkaEventSourceConfig;
  DocumentDBEventSourceConfig?: DocumentDBEventSourceConfig;
  KMSKeyArn?: string;
  MetricsConfig?: EventSourceMappingMetricsConfig;
  ProvisionedPollerConfig?: ProvisionedPollerConfig;
}
export const UpdateEventSourceMappingRequest = S.suspend(() =>
  S.Struct({
    UUID: S.String.pipe(T.HttpLabel("UUID")),
    FunctionName: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
    BatchSize: S.optional(S.Number),
    FilterCriteria: S.optional(FilterCriteria),
    MaximumBatchingWindowInSeconds: S.optional(S.Number),
    DestinationConfig: S.optional(DestinationConfig),
    MaximumRecordAgeInSeconds: S.optional(S.Number),
    BisectBatchOnFunctionError: S.optional(S.Boolean),
    MaximumRetryAttempts: S.optional(S.Number),
    ParallelizationFactor: S.optional(S.Number),
    SourceAccessConfigurations: S.optional(SourceAccessConfigurations),
    TumblingWindowInSeconds: S.optional(S.Number),
    FunctionResponseTypes: S.optional(FunctionResponseTypeList),
    ScalingConfig: S.optional(ScalingConfig),
    AmazonManagedKafkaEventSourceConfig: S.optional(
      AmazonManagedKafkaEventSourceConfig,
    ),
    SelfManagedKafkaEventSourceConfig: S.optional(
      SelfManagedKafkaEventSourceConfig,
    ),
    DocumentDBEventSourceConfig: S.optional(DocumentDBEventSourceConfig),
    KMSKeyArn: S.optional(S.String),
    MetricsConfig: S.optional(EventSourceMappingMetricsConfig),
    ProvisionedPollerConfig: S.optional(ProvisionedPollerConfig),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/2015-03-31/event-source-mappings/{UUID}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEventSourceMappingRequest",
}) as any as S.Schema<UpdateEventSourceMappingRequest>;
export interface DeleteEventSourceMappingRequest {
  UUID: string;
}
export const DeleteEventSourceMappingRequest = S.suspend(() =>
  S.Struct({ UUID: S.String.pipe(T.HttpLabel("UUID")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/2015-03-31/event-source-mappings/{UUID}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEventSourceMappingRequest",
}) as any as S.Schema<DeleteEventSourceMappingRequest>;
export interface ListEventSourceMappingsRequest {
  EventSourceArn?: string;
  FunctionName?: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListEventSourceMappingsRequest = S.suspend(() =>
  S.Struct({
    EventSourceArn: S.optional(S.String).pipe(T.HttpQuery("EventSourceArn")),
    FunctionName: S.optional(S.String).pipe(T.HttpQuery("FunctionName")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2015-03-31/event-source-mappings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEventSourceMappingsRequest",
}) as any as S.Schema<ListEventSourceMappingsRequest>;
export interface ListFunctionsRequest {
  MasterRegion?: string;
  FunctionVersion?: FunctionVersion;
  Marker?: string;
  MaxItems?: number;
}
export const ListFunctionsRequest = S.suspend(() =>
  S.Struct({
    MasterRegion: S.optional(S.String).pipe(T.HttpQuery("MasterRegion")),
    FunctionVersion: S.optional(FunctionVersion).pipe(
      T.HttpQuery("FunctionVersion"),
    ),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2015-03-31/functions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFunctionsRequest",
}) as any as S.Schema<ListFunctionsRequest>;
export interface DeleteFunctionConcurrencyRequest {
  FunctionName: string;
}
export const DeleteFunctionConcurrencyRequest = S.suspend(() =>
  S.Struct({ FunctionName: S.String.pipe(T.HttpLabel("FunctionName")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/2017-10-31/functions/{FunctionName}/concurrency",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFunctionConcurrencyRequest",
}) as any as S.Schema<DeleteFunctionConcurrencyRequest>;
export interface DeleteFunctionConcurrencyResponse {}
export const DeleteFunctionConcurrencyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteFunctionConcurrencyResponse",
}) as any as S.Schema<DeleteFunctionConcurrencyResponse>;
export interface DeleteFunctionUrlConfigRequest {
  FunctionName: string;
  Qualifier?: string;
}
export const DeleteFunctionUrlConfigRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/2021-10-31/functions/{FunctionName}/url",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFunctionUrlConfigRequest",
}) as any as S.Schema<DeleteFunctionUrlConfigRequest>;
export interface DeleteFunctionUrlConfigResponse {}
export const DeleteFunctionUrlConfigResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteFunctionUrlConfigResponse",
}) as any as S.Schema<DeleteFunctionUrlConfigResponse>;
export interface GetFunctionConcurrencyRequest {
  FunctionName: string;
}
export const GetFunctionConcurrencyRequest = S.suspend(() =>
  S.Struct({ FunctionName: S.String.pipe(T.HttpLabel("FunctionName")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2019-09-30/functions/{FunctionName}/concurrency",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFunctionConcurrencyRequest",
}) as any as S.Schema<GetFunctionConcurrencyRequest>;
export interface GetFunctionUrlConfigRequest {
  FunctionName: string;
  Qualifier?: string;
}
export const GetFunctionUrlConfigRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2021-10-31/functions/{FunctionName}/url",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFunctionUrlConfigRequest",
}) as any as S.Schema<GetFunctionUrlConfigRequest>;
export interface ListFunctionUrlConfigsRequest {
  FunctionName: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListFunctionUrlConfigsRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2021-10-31/functions/{FunctionName}/urls",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFunctionUrlConfigsRequest",
}) as any as S.Schema<ListFunctionUrlConfigsRequest>;
export interface ListProvisionedConcurrencyConfigsRequest {
  FunctionName: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListProvisionedConcurrencyConfigsRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2019-09-30/functions/{FunctionName}/provisioned-concurrency?List=ALL",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProvisionedConcurrencyConfigsRequest",
}) as any as S.Schema<ListProvisionedConcurrencyConfigsRequest>;
export interface PutFunctionConcurrencyRequest {
  FunctionName: string;
  ReservedConcurrentExecutions: number;
}
export const PutFunctionConcurrencyRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    ReservedConcurrentExecutions: S.Number,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/2017-10-31/functions/{FunctionName}/concurrency",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutFunctionConcurrencyRequest",
}) as any as S.Schema<PutFunctionConcurrencyRequest>;
export interface UpdateFunctionCodeRequest {
  FunctionName: string;
  ZipFile?: Uint8Array | redacted.Redacted<Uint8Array>;
  S3Bucket?: string;
  S3Key?: string;
  S3ObjectVersion?: string;
  ImageUri?: string;
  Publish?: boolean;
  DryRun?: boolean;
  RevisionId?: string;
  Architectures?: Architecture[];
  SourceKMSKeyArn?: string;
  PublishTo?: FunctionVersionLatestPublished;
}
export const UpdateFunctionCodeRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    ZipFile: S.optional(SensitiveBlob),
    S3Bucket: S.optional(S.String),
    S3Key: S.optional(S.String),
    S3ObjectVersion: S.optional(S.String),
    ImageUri: S.optional(S.String),
    Publish: S.optional(S.Boolean),
    DryRun: S.optional(S.Boolean),
    RevisionId: S.optional(S.String),
    Architectures: S.optional(ArchitecturesList),
    SourceKMSKeyArn: S.optional(S.String),
    PublishTo: S.optional(FunctionVersionLatestPublished),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/2015-03-31/functions/{FunctionName}/code",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFunctionCodeRequest",
}) as any as S.Schema<UpdateFunctionCodeRequest>;
export type SubnetIds = string[];
export const SubnetIds = S.Array(S.String);
export type SecurityGroupIds = string[];
export const SecurityGroupIds = S.Array(S.String);
export interface VpcConfig {
  SubnetIds?: string[];
  SecurityGroupIds?: string[];
  Ipv6AllowedForDualStack?: boolean;
}
export const VpcConfig = S.suspend(() =>
  S.Struct({
    SubnetIds: S.optional(SubnetIds),
    SecurityGroupIds: S.optional(SecurityGroupIds),
    Ipv6AllowedForDualStack: S.optional(S.Boolean),
  }),
).annotations({ identifier: "VpcConfig" }) as any as S.Schema<VpcConfig>;
export type EnvironmentVariables = {
  [key: string]: string | redacted.Redacted<string> | undefined;
};
export const EnvironmentVariables = S.Record({
  key: S.String,
  value: S.UndefinedOr(SensitiveString),
});
export interface Environment {
  Variables?: { [key: string]: string | redacted.Redacted<string> | undefined };
}
export const Environment = S.suspend(() =>
  S.Struct({ Variables: S.optional(EnvironmentVariables) }),
).annotations({ identifier: "Environment" }) as any as S.Schema<Environment>;
export interface DeadLetterConfig {
  TargetArn?: string;
}
export const DeadLetterConfig = S.suspend(() =>
  S.Struct({ TargetArn: S.optional(S.String) }),
).annotations({
  identifier: "DeadLetterConfig",
}) as any as S.Schema<DeadLetterConfig>;
export type TracingMode = "Active" | "PassThrough" | (string & {});
export const TracingMode = S.String;
export interface TracingConfig {
  Mode?: TracingMode;
}
export const TracingConfig = S.suspend(() =>
  S.Struct({ Mode: S.optional(TracingMode) }),
).annotations({
  identifier: "TracingConfig",
}) as any as S.Schema<TracingConfig>;
export interface FileSystemConfig {
  Arn: string;
  LocalMountPath: string;
}
export const FileSystemConfig = S.suspend(() =>
  S.Struct({ Arn: S.String, LocalMountPath: S.String }),
).annotations({
  identifier: "FileSystemConfig",
}) as any as S.Schema<FileSystemConfig>;
export type FileSystemConfigList = FileSystemConfig[];
export const FileSystemConfigList = S.Array(FileSystemConfig);
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface ImageConfig {
  EntryPoint?: string[];
  Command?: string[];
  WorkingDirectory?: string;
}
export const ImageConfig = S.suspend(() =>
  S.Struct({
    EntryPoint: S.optional(StringList),
    Command: S.optional(StringList),
    WorkingDirectory: S.optional(S.String),
  }),
).annotations({ identifier: "ImageConfig" }) as any as S.Schema<ImageConfig>;
export interface EphemeralStorage {
  Size: number;
}
export const EphemeralStorage = S.suspend(() =>
  S.Struct({ Size: S.Number }),
).annotations({
  identifier: "EphemeralStorage",
}) as any as S.Schema<EphemeralStorage>;
export type SnapStartApplyOn = "PublishedVersions" | "None" | (string & {});
export const SnapStartApplyOn = S.String;
export interface SnapStart {
  ApplyOn?: SnapStartApplyOn;
}
export const SnapStart = S.suspend(() =>
  S.Struct({ ApplyOn: S.optional(SnapStartApplyOn) }),
).annotations({ identifier: "SnapStart" }) as any as S.Schema<SnapStart>;
export type LogFormat = "JSON" | "Text" | (string & {});
export const LogFormat = S.String;
export type ApplicationLogLevel =
  | "TRACE"
  | "DEBUG"
  | "INFO"
  | "WARN"
  | "ERROR"
  | "FATAL"
  | (string & {});
export const ApplicationLogLevel = S.String;
export type SystemLogLevel = "DEBUG" | "INFO" | "WARN" | (string & {});
export const SystemLogLevel = S.String;
export interface LoggingConfig {
  LogFormat?: LogFormat;
  ApplicationLogLevel?: ApplicationLogLevel;
  SystemLogLevel?: SystemLogLevel;
  LogGroup?: string;
}
export const LoggingConfig = S.suspend(() =>
  S.Struct({
    LogFormat: S.optional(LogFormat),
    ApplicationLogLevel: S.optional(ApplicationLogLevel),
    SystemLogLevel: S.optional(SystemLogLevel),
    LogGroup: S.optional(S.String),
  }),
).annotations({
  identifier: "LoggingConfig",
}) as any as S.Schema<LoggingConfig>;
export interface LambdaManagedInstancesCapacityProviderConfig {
  CapacityProviderArn: string;
  PerExecutionEnvironmentMaxConcurrency?: number;
  ExecutionEnvironmentMemoryGiBPerVCpu?: number;
}
export const LambdaManagedInstancesCapacityProviderConfig = S.suspend(() =>
  S.Struct({
    CapacityProviderArn: S.String,
    PerExecutionEnvironmentMaxConcurrency: S.optional(S.Number),
    ExecutionEnvironmentMemoryGiBPerVCpu: S.optional(S.Number),
  }),
).annotations({
  identifier: "LambdaManagedInstancesCapacityProviderConfig",
}) as any as S.Schema<LambdaManagedInstancesCapacityProviderConfig>;
export interface CapacityProviderConfig {
  LambdaManagedInstancesCapacityProviderConfig: LambdaManagedInstancesCapacityProviderConfig;
}
export const CapacityProviderConfig = S.suspend(() =>
  S.Struct({
    LambdaManagedInstancesCapacityProviderConfig:
      LambdaManagedInstancesCapacityProviderConfig,
  }),
).annotations({
  identifier: "CapacityProviderConfig",
}) as any as S.Schema<CapacityProviderConfig>;
export interface DurableConfig {
  RetentionPeriodInDays?: number;
  ExecutionTimeout?: number;
}
export const DurableConfig = S.suspend(() =>
  S.Struct({
    RetentionPeriodInDays: S.optional(S.Number),
    ExecutionTimeout: S.optional(S.Number),
  }),
).annotations({
  identifier: "DurableConfig",
}) as any as S.Schema<DurableConfig>;
export interface UpdateFunctionConfigurationRequest {
  FunctionName: string;
  Role?: string;
  Handler?: string;
  Description?: string;
  Timeout?: number;
  MemorySize?: number;
  VpcConfig?: VpcConfig;
  Environment?: Environment;
  Runtime?: Runtime;
  DeadLetterConfig?: DeadLetterConfig;
  KMSKeyArn?: string;
  TracingConfig?: TracingConfig;
  RevisionId?: string;
  Layers?: string[];
  FileSystemConfigs?: FileSystemConfig[];
  ImageConfig?: ImageConfig;
  EphemeralStorage?: EphemeralStorage;
  SnapStart?: SnapStart;
  LoggingConfig?: LoggingConfig;
  CapacityProviderConfig?: CapacityProviderConfig;
  DurableConfig?: DurableConfig;
}
export const UpdateFunctionConfigurationRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Role: S.optional(S.String),
    Handler: S.optional(S.String),
    Description: S.optional(S.String),
    Timeout: S.optional(S.Number),
    MemorySize: S.optional(S.Number),
    VpcConfig: S.optional(VpcConfig),
    Environment: S.optional(Environment),
    Runtime: S.optional(Runtime),
    DeadLetterConfig: S.optional(DeadLetterConfig),
    KMSKeyArn: S.optional(S.String),
    TracingConfig: S.optional(TracingConfig),
    RevisionId: S.optional(S.String),
    Layers: S.optional(LayerList),
    FileSystemConfigs: S.optional(FileSystemConfigList),
    ImageConfig: S.optional(ImageConfig),
    EphemeralStorage: S.optional(EphemeralStorage),
    SnapStart: S.optional(SnapStart),
    LoggingConfig: S.optional(LoggingConfig),
    CapacityProviderConfig: S.optional(CapacityProviderConfig),
    DurableConfig: S.optional(DurableConfig),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/2015-03-31/functions/{FunctionName}/configuration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFunctionConfigurationRequest",
}) as any as S.Schema<UpdateFunctionConfigurationRequest>;
export type HeadersList = string[];
export const HeadersList = S.Array(S.String);
export type AllowMethodsList = string[];
export const AllowMethodsList = S.Array(S.String);
export type AllowOriginsList = string[];
export const AllowOriginsList = S.Array(S.String);
export interface Cors {
  AllowCredentials?: boolean;
  AllowHeaders?: string[];
  AllowMethods?: string[];
  AllowOrigins?: string[];
  ExposeHeaders?: string[];
  MaxAge?: number;
}
export const Cors = S.suspend(() =>
  S.Struct({
    AllowCredentials: S.optional(S.Boolean),
    AllowHeaders: S.optional(HeadersList),
    AllowMethods: S.optional(AllowMethodsList),
    AllowOrigins: S.optional(AllowOriginsList),
    ExposeHeaders: S.optional(HeadersList),
    MaxAge: S.optional(S.Number),
  }),
).annotations({ identifier: "Cors" }) as any as S.Schema<Cors>;
export interface UpdateFunctionUrlConfigRequest {
  FunctionName: string;
  Qualifier?: string;
  AuthType?: FunctionUrlAuthType;
  Cors?: Cors;
  InvokeMode?: InvokeMode;
}
export const UpdateFunctionUrlConfigRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
    AuthType: S.optional(FunctionUrlAuthType),
    Cors: S.optional(Cors),
    InvokeMode: S.optional(InvokeMode),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/2021-10-31/functions/{FunctionName}/url",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFunctionUrlConfigRequest",
}) as any as S.Schema<UpdateFunctionUrlConfigRequest>;
export interface DeleteFunctionCodeSigningConfigRequest {
  FunctionName: string;
}
export const DeleteFunctionCodeSigningConfigRequest = S.suspend(() =>
  S.Struct({ FunctionName: S.String.pipe(T.HttpLabel("FunctionName")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/2020-06-30/functions/{FunctionName}/code-signing-config",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFunctionCodeSigningConfigRequest",
}) as any as S.Schema<DeleteFunctionCodeSigningConfigRequest>;
export interface DeleteFunctionCodeSigningConfigResponse {}
export const DeleteFunctionCodeSigningConfigResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteFunctionCodeSigningConfigResponse",
}) as any as S.Schema<DeleteFunctionCodeSigningConfigResponse>;
export interface GetFunctionRequest {
  FunctionName: string;
  Qualifier?: string;
}
export const GetFunctionRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2015-03-31/functions/{FunctionName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFunctionRequest",
}) as any as S.Schema<GetFunctionRequest>;
export interface GetFunctionCodeSigningConfigRequest {
  FunctionName: string;
}
export const GetFunctionCodeSigningConfigRequest = S.suspend(() =>
  S.Struct({ FunctionName: S.String.pipe(T.HttpLabel("FunctionName")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2020-06-30/functions/{FunctionName}/code-signing-config",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFunctionCodeSigningConfigRequest",
}) as any as S.Schema<GetFunctionCodeSigningConfigRequest>;
export interface GetFunctionConfigurationRequest {
  FunctionName: string;
  Qualifier?: string;
}
export const GetFunctionConfigurationRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2015-03-31/functions/{FunctionName}/configuration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFunctionConfigurationRequest",
}) as any as S.Schema<GetFunctionConfigurationRequest>;
export interface GetFunctionRecursionConfigRequest {
  FunctionName: string;
}
export const GetFunctionRecursionConfigRequest = S.suspend(() =>
  S.Struct({ FunctionName: S.String.pipe(T.HttpLabel("FunctionName")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2024-08-31/functions/{FunctionName}/recursion-config",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFunctionRecursionConfigRequest",
}) as any as S.Schema<GetFunctionRecursionConfigRequest>;
export interface GetFunctionScalingConfigRequest {
  FunctionName: string;
  Qualifier: string;
}
export const GetFunctionScalingConfigRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.String.pipe(T.HttpQuery("Qualifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2025-11-30/functions/{FunctionName}/function-scaling-config",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFunctionScalingConfigRequest",
}) as any as S.Schema<GetFunctionScalingConfigRequest>;
export interface GetPolicyRequest {
  FunctionName: string;
  Qualifier?: string;
}
export const GetPolicyRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2015-03-31/functions/{FunctionName}/policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPolicyRequest",
}) as any as S.Schema<GetPolicyRequest>;
export interface GetRuntimeManagementConfigRequest {
  FunctionName: string;
  Qualifier?: string;
}
export const GetRuntimeManagementConfigRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2021-07-20/functions/{FunctionName}/runtime-management-config",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRuntimeManagementConfigRequest",
}) as any as S.Schema<GetRuntimeManagementConfigRequest>;
export interface InvocationRequest {
  FunctionName: string;
  InvocationType?: InvocationType;
  LogType?: LogType;
  ClientContext?: string;
  DurableExecutionName?: string;
  Payload?: T.StreamingInputBody;
  Qualifier?: string;
  TenantId?: string;
}
export const InvocationRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    InvocationType: S.optional(InvocationType).pipe(
      T.HttpHeader("X-Amz-Invocation-Type"),
    ),
    LogType: S.optional(LogType).pipe(T.HttpHeader("X-Amz-Log-Type")),
    ClientContext: S.optional(S.String).pipe(
      T.HttpHeader("X-Amz-Client-Context"),
    ),
    DurableExecutionName: S.optional(S.String).pipe(
      T.HttpHeader("X-Amz-Durable-Execution-Name"),
    ),
    Payload: S.optional(T.StreamingInput).pipe(T.HttpPayload()),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
    TenantId: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Tenant-Id")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/2015-03-31/functions/{FunctionName}/invocations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "InvocationRequest",
}) as any as S.Schema<InvocationRequest>;
export interface InvokeAsyncRequest {
  FunctionName: string;
  InvokeArgs: T.StreamingInputBody;
}
export const InvokeAsyncRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    InvokeArgs: T.StreamingInput.pipe(T.HttpPayload()),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/2014-11-13/functions/{FunctionName}/invoke-async",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "InvokeAsyncRequest",
}) as any as S.Schema<InvokeAsyncRequest>;
export interface InvokeWithResponseStreamRequest {
  FunctionName: string;
  InvocationType?: ResponseStreamingInvocationType;
  LogType?: LogType;
  ClientContext?: string;
  Qualifier?: string;
  Payload?: T.StreamingInputBody;
  TenantId?: string;
}
export const InvokeWithResponseStreamRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    InvocationType: S.optional(ResponseStreamingInvocationType).pipe(
      T.HttpHeader("X-Amz-Invocation-Type"),
    ),
    LogType: S.optional(LogType).pipe(T.HttpHeader("X-Amz-Log-Type")),
    ClientContext: S.optional(S.String).pipe(
      T.HttpHeader("X-Amz-Client-Context"),
    ),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
    Payload: S.optional(T.StreamingInput).pipe(T.HttpPayload()),
    TenantId: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Tenant-Id")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/2021-11-15/functions/{FunctionName}/response-streaming-invocations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "InvokeWithResponseStreamRequest",
}) as any as S.Schema<InvokeWithResponseStreamRequest>;
export interface PutFunctionCodeSigningConfigRequest {
  CodeSigningConfigArn: string;
  FunctionName: string;
}
export const PutFunctionCodeSigningConfigRequest = S.suspend(() =>
  S.Struct({
    CodeSigningConfigArn: S.String,
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/2020-06-30/functions/{FunctionName}/code-signing-config",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutFunctionCodeSigningConfigRequest",
}) as any as S.Schema<PutFunctionCodeSigningConfigRequest>;
export interface PutFunctionRecursionConfigRequest {
  FunctionName: string;
  RecursiveLoop: RecursiveLoop;
}
export const PutFunctionRecursionConfigRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    RecursiveLoop: RecursiveLoop,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/2024-08-31/functions/{FunctionName}/recursion-config",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutFunctionRecursionConfigRequest",
}) as any as S.Schema<PutFunctionRecursionConfigRequest>;
export interface PutRuntimeManagementConfigRequest {
  FunctionName: string;
  Qualifier?: string;
  UpdateRuntimeOn: UpdateRuntimeOn;
  RuntimeVersionArn?: string;
}
export const PutRuntimeManagementConfigRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
    UpdateRuntimeOn: UpdateRuntimeOn,
    RuntimeVersionArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/2021-07-20/functions/{FunctionName}/runtime-management-config",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutRuntimeManagementConfigRequest",
}) as any as S.Schema<PutRuntimeManagementConfigRequest>;
export interface GetAliasRequest {
  FunctionName: string;
  Name: string;
}
export const GetAliasRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Name: S.String.pipe(T.HttpLabel("Name")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2015-03-31/functions/{FunctionName}/aliases/{Name}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAliasRequest",
}) as any as S.Schema<GetAliasRequest>;
export type AdditionalVersionWeights = { [key: string]: number | undefined };
export const AdditionalVersionWeights = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.Number),
});
export interface AliasRoutingConfiguration {
  AdditionalVersionWeights?: { [key: string]: number | undefined };
}
export const AliasRoutingConfiguration = S.suspend(() =>
  S.Struct({ AdditionalVersionWeights: S.optional(AdditionalVersionWeights) }),
).annotations({
  identifier: "AliasRoutingConfiguration",
}) as any as S.Schema<AliasRoutingConfiguration>;
export interface UpdateAliasRequest {
  FunctionName: string;
  Name: string;
  FunctionVersion?: string;
  Description?: string;
  RoutingConfig?: AliasRoutingConfiguration;
  RevisionId?: string;
}
export const UpdateAliasRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Name: S.String.pipe(T.HttpLabel("Name")),
    FunctionVersion: S.optional(S.String),
    Description: S.optional(S.String),
    RoutingConfig: S.optional(AliasRoutingConfiguration),
    RevisionId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/2015-03-31/functions/{FunctionName}/aliases/{Name}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAliasRequest",
}) as any as S.Schema<UpdateAliasRequest>;
export interface DeleteAliasRequest {
  FunctionName: string;
  Name: string;
}
export const DeleteAliasRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Name: S.String.pipe(T.HttpLabel("Name")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/2015-03-31/functions/{FunctionName}/aliases/{Name}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAliasRequest",
}) as any as S.Schema<DeleteAliasRequest>;
export interface DeleteAliasResponse {}
export const DeleteAliasResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteAliasResponse",
}) as any as S.Schema<DeleteAliasResponse>;
export interface ListAliasesRequest {
  FunctionName: string;
  FunctionVersion?: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListAliasesRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    FunctionVersion: S.optional(S.String).pipe(T.HttpQuery("FunctionVersion")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2015-03-31/functions/{FunctionName}/aliases",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAliasesRequest",
}) as any as S.Schema<ListAliasesRequest>;
export interface PublishVersionRequest {
  FunctionName: string;
  CodeSha256?: string;
  Description?: string;
  RevisionId?: string;
  PublishTo?: FunctionVersionLatestPublished;
}
export const PublishVersionRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    CodeSha256: S.optional(S.String),
    Description: S.optional(S.String),
    RevisionId: S.optional(S.String),
    PublishTo: S.optional(FunctionVersionLatestPublished),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/2015-03-31/functions/{FunctionName}/versions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PublishVersionRequest",
}) as any as S.Schema<PublishVersionRequest>;
export interface ListVersionsByFunctionRequest {
  FunctionName: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListVersionsByFunctionRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2015-03-31/functions/{FunctionName}/versions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVersionsByFunctionRequest",
}) as any as S.Schema<ListVersionsByFunctionRequest>;
export interface ListLayersRequest {
  CompatibleRuntime?: Runtime;
  Marker?: string;
  MaxItems?: number;
  CompatibleArchitecture?: Architecture;
}
export const ListLayersRequest = S.suspend(() =>
  S.Struct({
    CompatibleRuntime: S.optional(Runtime).pipe(
      T.HttpQuery("CompatibleRuntime"),
    ),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    CompatibleArchitecture: S.optional(Architecture).pipe(
      T.HttpQuery("CompatibleArchitecture"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2018-10-31/layers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLayersRequest",
}) as any as S.Schema<ListLayersRequest>;
export interface ListLayerVersionsRequest {
  CompatibleRuntime?: Runtime;
  LayerName: string;
  Marker?: string;
  MaxItems?: number;
  CompatibleArchitecture?: Architecture;
}
export const ListLayerVersionsRequest = S.suspend(() =>
  S.Struct({
    CompatibleRuntime: S.optional(Runtime).pipe(
      T.HttpQuery("CompatibleRuntime"),
    ),
    LayerName: S.String.pipe(T.HttpLabel("LayerName")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    CompatibleArchitecture: S.optional(Architecture).pipe(
      T.HttpQuery("CompatibleArchitecture"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2018-10-31/layers/{LayerName}/versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLayerVersionsRequest",
}) as any as S.Schema<ListLayerVersionsRequest>;
export interface AddLayerVersionPermissionRequest {
  LayerName: string;
  VersionNumber: number;
  StatementId: string;
  Action: string;
  Principal: string;
  OrganizationId?: string;
  RevisionId?: string;
}
export const AddLayerVersionPermissionRequest = S.suspend(() =>
  S.Struct({
    LayerName: S.String.pipe(T.HttpLabel("LayerName")),
    VersionNumber: S.Number.pipe(T.HttpLabel("VersionNumber")),
    StatementId: S.String,
    Action: S.String,
    Principal: S.String,
    OrganizationId: S.optional(S.String),
    RevisionId: S.optional(S.String).pipe(T.HttpQuery("RevisionId")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/2018-10-31/layers/{LayerName}/versions/{VersionNumber}/policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddLayerVersionPermissionRequest",
}) as any as S.Schema<AddLayerVersionPermissionRequest>;
export interface DeleteLayerVersionRequest {
  LayerName: string;
  VersionNumber: number;
}
export const DeleteLayerVersionRequest = S.suspend(() =>
  S.Struct({
    LayerName: S.String.pipe(T.HttpLabel("LayerName")),
    VersionNumber: S.Number.pipe(T.HttpLabel("VersionNumber")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/2018-10-31/layers/{LayerName}/versions/{VersionNumber}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLayerVersionRequest",
}) as any as S.Schema<DeleteLayerVersionRequest>;
export interface DeleteLayerVersionResponse {}
export const DeleteLayerVersionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteLayerVersionResponse",
}) as any as S.Schema<DeleteLayerVersionResponse>;
export interface GetLayerVersionRequest {
  LayerName: string;
  VersionNumber: number;
}
export const GetLayerVersionRequest = S.suspend(() =>
  S.Struct({
    LayerName: S.String.pipe(T.HttpLabel("LayerName")),
    VersionNumber: S.Number.pipe(T.HttpLabel("VersionNumber")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2018-10-31/layers/{LayerName}/versions/{VersionNumber}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLayerVersionRequest",
}) as any as S.Schema<GetLayerVersionRequest>;
export interface GetLayerVersionByArnRequest {
  Arn: string;
}
export const GetLayerVersionByArnRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpQuery("Arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2018-10-31/layers?find=LayerVersion" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLayerVersionByArnRequest",
}) as any as S.Schema<GetLayerVersionByArnRequest>;
export interface GetLayerVersionPolicyRequest {
  LayerName: string;
  VersionNumber: number;
}
export const GetLayerVersionPolicyRequest = S.suspend(() =>
  S.Struct({
    LayerName: S.String.pipe(T.HttpLabel("LayerName")),
    VersionNumber: S.Number.pipe(T.HttpLabel("VersionNumber")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2018-10-31/layers/{LayerName}/versions/{VersionNumber}/policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLayerVersionPolicyRequest",
}) as any as S.Schema<GetLayerVersionPolicyRequest>;
export interface RemoveLayerVersionPermissionRequest {
  LayerName: string;
  VersionNumber: number;
  StatementId: string;
  RevisionId?: string;
}
export const RemoveLayerVersionPermissionRequest = S.suspend(() =>
  S.Struct({
    LayerName: S.String.pipe(T.HttpLabel("LayerName")),
    VersionNumber: S.Number.pipe(T.HttpLabel("VersionNumber")),
    StatementId: S.String.pipe(T.HttpLabel("StatementId")),
    RevisionId: S.optional(S.String).pipe(T.HttpQuery("RevisionId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/2018-10-31/layers/{LayerName}/versions/{VersionNumber}/policy/{StatementId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveLayerVersionPermissionRequest",
}) as any as S.Schema<RemoveLayerVersionPermissionRequest>;
export interface RemoveLayerVersionPermissionResponse {}
export const RemoveLayerVersionPermissionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RemoveLayerVersionPermissionResponse",
}) as any as S.Schema<RemoveLayerVersionPermissionResponse>;
export interface AddPermissionRequest {
  FunctionName: string;
  StatementId: string;
  Action: string;
  Principal: string;
  SourceArn?: string;
  SourceAccount?: string;
  EventSourceToken?: string;
  Qualifier?: string;
  RevisionId?: string;
  PrincipalOrgID?: string;
  FunctionUrlAuthType?: FunctionUrlAuthType;
  InvokedViaFunctionUrl?: boolean;
}
export const AddPermissionRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    StatementId: S.String,
    Action: S.String,
    Principal: S.String,
    SourceArn: S.optional(S.String),
    SourceAccount: S.optional(S.String),
    EventSourceToken: S.optional(S.String),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
    RevisionId: S.optional(S.String),
    PrincipalOrgID: S.optional(S.String),
    FunctionUrlAuthType: S.optional(FunctionUrlAuthType),
    InvokedViaFunctionUrl: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/2015-03-31/functions/{FunctionName}/policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddPermissionRequest",
}) as any as S.Schema<AddPermissionRequest>;
export interface RemovePermissionRequest {
  FunctionName: string;
  StatementId: string;
  Qualifier?: string;
  RevisionId?: string;
}
export const RemovePermissionRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    StatementId: S.String.pipe(T.HttpLabel("StatementId")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
    RevisionId: S.optional(S.String).pipe(T.HttpQuery("RevisionId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/2015-03-31/functions/{FunctionName}/policy/{StatementId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemovePermissionRequest",
}) as any as S.Schema<RemovePermissionRequest>;
export interface RemovePermissionResponse {}
export const RemovePermissionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RemovePermissionResponse",
}) as any as S.Schema<RemovePermissionResponse>;
export interface PutProvisionedConcurrencyConfigRequest {
  FunctionName: string;
  Qualifier: string;
  ProvisionedConcurrentExecutions: number;
}
export const PutProvisionedConcurrencyConfigRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.String.pipe(T.HttpQuery("Qualifier")),
    ProvisionedConcurrentExecutions: S.Number,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/2019-09-30/functions/{FunctionName}/provisioned-concurrency",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutProvisionedConcurrencyConfigRequest",
}) as any as S.Schema<PutProvisionedConcurrencyConfigRequest>;
export interface GetProvisionedConcurrencyConfigRequest {
  FunctionName: string;
  Qualifier: string;
}
export const GetProvisionedConcurrencyConfigRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.String.pipe(T.HttpQuery("Qualifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2019-09-30/functions/{FunctionName}/provisioned-concurrency",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetProvisionedConcurrencyConfigRequest",
}) as any as S.Schema<GetProvisionedConcurrencyConfigRequest>;
export interface DeleteProvisionedConcurrencyConfigRequest {
  FunctionName: string;
  Qualifier: string;
}
export const DeleteProvisionedConcurrencyConfigRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.String.pipe(T.HttpQuery("Qualifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/2019-09-30/functions/{FunctionName}/provisioned-concurrency",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProvisionedConcurrencyConfigRequest",
}) as any as S.Schema<DeleteProvisionedConcurrencyConfigRequest>;
export interface DeleteProvisionedConcurrencyConfigResponse {}
export const DeleteProvisionedConcurrencyConfigResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteProvisionedConcurrencyConfigResponse",
}) as any as S.Schema<DeleteProvisionedConcurrencyConfigResponse>;
export type OperationType =
  | "EXECUTION"
  | "CONTEXT"
  | "STEP"
  | "WAIT"
  | "CALLBACK"
  | "CHAINED_INVOKE"
  | (string & {});
export const OperationType = S.String;
export type OperationAction =
  | "START"
  | "SUCCEED"
  | "FAIL"
  | "RETRY"
  | "CANCEL"
  | (string & {});
export const OperationAction = S.String;
export type CapacityProviderSubnetIds = string[];
export const CapacityProviderSubnetIds = S.Array(S.String);
export type CapacityProviderSecurityGroupIds = string[];
export const CapacityProviderSecurityGroupIds = S.Array(S.String);
export type InstanceTypeSet = string[];
export const InstanceTypeSet = S.Array(S.String);
export type TenantIsolationMode = "PER_TENANT" | (string & {});
export const TenantIsolationMode = S.String;
export interface AccountLimit {
  TotalCodeSize?: number;
  CodeSizeUnzipped?: number;
  CodeSizeZipped?: number;
  ConcurrentExecutions?: number;
  UnreservedConcurrentExecutions?: number;
}
export const AccountLimit = S.suspend(() =>
  S.Struct({
    TotalCodeSize: S.optional(S.Number),
    CodeSizeUnzipped: S.optional(S.Number),
    CodeSizeZipped: S.optional(S.Number),
    ConcurrentExecutions: S.optional(S.Number),
    UnreservedConcurrentExecutions: S.optional(S.Number),
  }),
).annotations({ identifier: "AccountLimit" }) as any as S.Schema<AccountLimit>;
export interface AccountUsage {
  TotalCodeSize?: number;
  FunctionCount?: number;
}
export const AccountUsage = S.suspend(() =>
  S.Struct({
    TotalCodeSize: S.optional(S.Number),
    FunctionCount: S.optional(S.Number),
  }),
).annotations({ identifier: "AccountUsage" }) as any as S.Schema<AccountUsage>;
export interface FunctionEventInvokeConfig {
  LastModified?: Date;
  FunctionArn?: string;
  MaximumRetryAttempts?: number;
  MaximumEventAgeInSeconds?: number;
  DestinationConfig?: DestinationConfig;
}
export const FunctionEventInvokeConfig = S.suspend(() =>
  S.Struct({
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FunctionArn: S.optional(S.String),
    MaximumRetryAttempts: S.optional(S.Number),
    MaximumEventAgeInSeconds: S.optional(S.Number),
    DestinationConfig: S.optional(DestinationConfig),
  }),
).annotations({
  identifier: "FunctionEventInvokeConfig",
}) as any as S.Schema<FunctionEventInvokeConfig>;
export type FunctionEventInvokeConfigList = FunctionEventInvokeConfig[];
export const FunctionEventInvokeConfigList = S.Array(FunctionEventInvokeConfig);
export type Tags = { [key: string]: string | undefined };
export const Tags = S.Record({ key: S.String, value: S.UndefinedOr(S.String) });
export interface CapacityProviderVpcConfig {
  SubnetIds: string[];
  SecurityGroupIds: string[];
}
export const CapacityProviderVpcConfig = S.suspend(() =>
  S.Struct({
    SubnetIds: CapacityProviderSubnetIds,
    SecurityGroupIds: CapacityProviderSecurityGroupIds,
  }),
).annotations({
  identifier: "CapacityProviderVpcConfig",
}) as any as S.Schema<CapacityProviderVpcConfig>;
export interface CapacityProviderPermissionsConfig {
  CapacityProviderOperatorRoleArn: string;
}
export const CapacityProviderPermissionsConfig = S.suspend(() =>
  S.Struct({ CapacityProviderOperatorRoleArn: S.String }),
).annotations({
  identifier: "CapacityProviderPermissionsConfig",
}) as any as S.Schema<CapacityProviderPermissionsConfig>;
export interface InstanceRequirements {
  Architectures?: Architecture[];
  AllowedInstanceTypes?: string[];
  ExcludedInstanceTypes?: string[];
}
export const InstanceRequirements = S.suspend(() =>
  S.Struct({
    Architectures: S.optional(ArchitecturesList),
    AllowedInstanceTypes: S.optional(InstanceTypeSet),
    ExcludedInstanceTypes: S.optional(InstanceTypeSet),
  }),
).annotations({
  identifier: "InstanceRequirements",
}) as any as S.Schema<InstanceRequirements>;
export interface CapacityProvider {
  CapacityProviderArn: string;
  State: CapacityProviderState;
  VpcConfig: CapacityProviderVpcConfig;
  PermissionsConfig: CapacityProviderPermissionsConfig;
  InstanceRequirements?: InstanceRequirements;
  CapacityProviderScalingConfig?: CapacityProviderScalingConfig;
  KmsKeyArn?: string;
  LastModified?: string;
}
export const CapacityProvider = S.suspend(() =>
  S.Struct({
    CapacityProviderArn: S.String,
    State: CapacityProviderState,
    VpcConfig: CapacityProviderVpcConfig,
    PermissionsConfig: CapacityProviderPermissionsConfig,
    InstanceRequirements: S.optional(InstanceRequirements),
    CapacityProviderScalingConfig: S.optional(CapacityProviderScalingConfig),
    KmsKeyArn: S.optional(S.String),
    LastModified: S.optional(S.String),
  }),
).annotations({
  identifier: "CapacityProvider",
}) as any as S.Schema<CapacityProvider>;
export type CapacityProvidersList = CapacityProvider[];
export const CapacityProvidersList = S.Array(CapacityProvider);
export type FunctionArnList = string[];
export const FunctionArnList = S.Array(S.String);
export type EndPointType = "KAFKA_BOOTSTRAP_SERVERS" | (string & {});
export const EndPointType = S.String;
export type EndpointLists = string[];
export const EndpointLists = S.Array(S.String);
export type Endpoints = { [key in EndPointType]?: string[] };
export const Endpoints = S.partial(
  S.Record({ key: EndPointType, value: S.UndefinedOr(EndpointLists) }),
);
export interface SelfManagedEventSource {
  Endpoints?: { [key: string]: string[] | undefined };
}
export const SelfManagedEventSource = S.suspend(() =>
  S.Struct({ Endpoints: S.optional(Endpoints) }),
).annotations({
  identifier: "SelfManagedEventSource",
}) as any as S.Schema<SelfManagedEventSource>;
export interface FilterCriteriaError {
  ErrorCode?: string;
  Message?: string;
}
export const FilterCriteriaError = S.suspend(() =>
  S.Struct({ ErrorCode: S.optional(S.String), Message: S.optional(S.String) }),
).annotations({
  identifier: "FilterCriteriaError",
}) as any as S.Schema<FilterCriteriaError>;
export interface EventSourceMappingConfiguration {
  UUID?: string;
  StartingPosition?: EventSourcePosition;
  StartingPositionTimestamp?: Date;
  BatchSize?: number;
  MaximumBatchingWindowInSeconds?: number;
  ParallelizationFactor?: number;
  EventSourceArn?: string;
  FilterCriteria?: FilterCriteria;
  FunctionArn?: string;
  LastModified?: Date;
  LastProcessingResult?: string;
  State?: string;
  StateTransitionReason?: string;
  DestinationConfig?: DestinationConfig;
  Topics?: string[];
  Queues?: string[];
  SourceAccessConfigurations?: SourceAccessConfiguration[];
  SelfManagedEventSource?: SelfManagedEventSource;
  MaximumRecordAgeInSeconds?: number;
  BisectBatchOnFunctionError?: boolean;
  MaximumRetryAttempts?: number;
  TumblingWindowInSeconds?: number;
  FunctionResponseTypes?: FunctionResponseType[];
  AmazonManagedKafkaEventSourceConfig?: AmazonManagedKafkaEventSourceConfig;
  SelfManagedKafkaEventSourceConfig?: SelfManagedKafkaEventSourceConfig;
  ScalingConfig?: ScalingConfig;
  DocumentDBEventSourceConfig?: DocumentDBEventSourceConfig;
  KMSKeyArn?: string;
  FilterCriteriaError?: FilterCriteriaError;
  EventSourceMappingArn?: string;
  MetricsConfig?: EventSourceMappingMetricsConfig;
  ProvisionedPollerConfig?: ProvisionedPollerConfig;
}
export const EventSourceMappingConfiguration = S.suspend(() =>
  S.Struct({
    UUID: S.optional(S.String),
    StartingPosition: S.optional(EventSourcePosition),
    StartingPositionTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    BatchSize: S.optional(S.Number),
    MaximumBatchingWindowInSeconds: S.optional(S.Number),
    ParallelizationFactor: S.optional(S.Number),
    EventSourceArn: S.optional(S.String),
    FilterCriteria: S.optional(FilterCriteria),
    FunctionArn: S.optional(S.String),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastProcessingResult: S.optional(S.String),
    State: S.optional(S.String),
    StateTransitionReason: S.optional(S.String),
    DestinationConfig: S.optional(DestinationConfig),
    Topics: S.optional(Topics),
    Queues: S.optional(Queues),
    SourceAccessConfigurations: S.optional(SourceAccessConfigurations),
    SelfManagedEventSource: S.optional(SelfManagedEventSource),
    MaximumRecordAgeInSeconds: S.optional(S.Number),
    BisectBatchOnFunctionError: S.optional(S.Boolean),
    MaximumRetryAttempts: S.optional(S.Number),
    TumblingWindowInSeconds: S.optional(S.Number),
    FunctionResponseTypes: S.optional(FunctionResponseTypeList),
    AmazonManagedKafkaEventSourceConfig: S.optional(
      AmazonManagedKafkaEventSourceConfig,
    ),
    SelfManagedKafkaEventSourceConfig: S.optional(
      SelfManagedKafkaEventSourceConfig,
    ),
    ScalingConfig: S.optional(ScalingConfig),
    DocumentDBEventSourceConfig: S.optional(DocumentDBEventSourceConfig),
    KMSKeyArn: S.optional(S.String),
    FilterCriteriaError: S.optional(FilterCriteriaError),
    EventSourceMappingArn: S.optional(S.String),
    MetricsConfig: S.optional(EventSourceMappingMetricsConfig),
    ProvisionedPollerConfig: S.optional(ProvisionedPollerConfig),
  }),
).annotations({
  identifier: "EventSourceMappingConfiguration",
}) as any as S.Schema<EventSourceMappingConfiguration>;
export type EventSourceMappingsList = EventSourceMappingConfiguration[];
export const EventSourceMappingsList = S.Array(EventSourceMappingConfiguration);
export interface FunctionCode {
  ZipFile?: Uint8Array | redacted.Redacted<Uint8Array>;
  S3Bucket?: string;
  S3Key?: string;
  S3ObjectVersion?: string;
  ImageUri?: string;
  SourceKMSKeyArn?: string;
}
export const FunctionCode = S.suspend(() =>
  S.Struct({
    ZipFile: S.optional(SensitiveBlob),
    S3Bucket: S.optional(S.String),
    S3Key: S.optional(S.String),
    S3ObjectVersion: S.optional(S.String),
    ImageUri: S.optional(S.String),
    SourceKMSKeyArn: S.optional(S.String),
  }),
).annotations({ identifier: "FunctionCode" }) as any as S.Schema<FunctionCode>;
export interface TenancyConfig {
  TenantIsolationMode: TenantIsolationMode;
}
export const TenancyConfig = S.suspend(() =>
  S.Struct({ TenantIsolationMode: TenantIsolationMode }),
).annotations({
  identifier: "TenancyConfig",
}) as any as S.Schema<TenancyConfig>;
export interface VpcConfigResponse {
  SubnetIds?: string[];
  SecurityGroupIds?: string[];
  VpcId?: string;
  Ipv6AllowedForDualStack?: boolean;
}
export const VpcConfigResponse = S.suspend(() =>
  S.Struct({
    SubnetIds: S.optional(SubnetIds),
    SecurityGroupIds: S.optional(SecurityGroupIds),
    VpcId: S.optional(S.String),
    Ipv6AllowedForDualStack: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "VpcConfigResponse",
}) as any as S.Schema<VpcConfigResponse>;
export interface EnvironmentError {
  ErrorCode?: string;
  Message?: string | redacted.Redacted<string>;
}
export const EnvironmentError = S.suspend(() =>
  S.Struct({
    ErrorCode: S.optional(S.String),
    Message: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "EnvironmentError",
}) as any as S.Schema<EnvironmentError>;
export interface EnvironmentResponse {
  Variables?: { [key: string]: string | redacted.Redacted<string> | undefined };
  Error?: EnvironmentError;
}
export const EnvironmentResponse = S.suspend(() =>
  S.Struct({
    Variables: S.optional(EnvironmentVariables),
    Error: S.optional(EnvironmentError),
  }),
).annotations({
  identifier: "EnvironmentResponse",
}) as any as S.Schema<EnvironmentResponse>;
export interface TracingConfigResponse {
  Mode?: TracingMode;
}
export const TracingConfigResponse = S.suspend(() =>
  S.Struct({ Mode: S.optional(TracingMode) }),
).annotations({
  identifier: "TracingConfigResponse",
}) as any as S.Schema<TracingConfigResponse>;
export interface Layer {
  Arn?: string;
  CodeSize?: number;
  SigningProfileVersionArn?: string;
  SigningJobArn?: string;
}
export const Layer = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    CodeSize: S.optional(S.Number),
    SigningProfileVersionArn: S.optional(S.String),
    SigningJobArn: S.optional(S.String),
  }),
).annotations({ identifier: "Layer" }) as any as S.Schema<Layer>;
export type LayersReferenceList = Layer[];
export const LayersReferenceList = S.Array(Layer);
export type State =
  | "Pending"
  | "Active"
  | "Inactive"
  | "Failed"
  | "Deactivating"
  | "Deactivated"
  | "ActiveNonInvocable"
  | "Deleting"
  | (string & {});
export const State = S.String;
export type StateReasonCode =
  | "Idle"
  | "Creating"
  | "Restoring"
  | "EniLimitExceeded"
  | "InsufficientRolePermissions"
  | "InvalidConfiguration"
  | "InternalError"
  | "SubnetOutOfIPAddresses"
  | "InvalidSubnet"
  | "InvalidSecurityGroup"
  | "ImageDeleted"
  | "ImageAccessDenied"
  | "InvalidImage"
  | "KMSKeyAccessDenied"
  | "KMSKeyNotFound"
  | "InvalidStateKMSKey"
  | "DisabledKMSKey"
  | "EFSIOError"
  | "EFSMountConnectivityError"
  | "EFSMountFailure"
  | "EFSMountTimeout"
  | "InvalidRuntime"
  | "InvalidZipFileException"
  | "FunctionError"
  | "DrainingDurableExecutions"
  | "VcpuLimitExceeded"
  | "CapacityProviderScalingLimitExceeded"
  | "InsufficientCapacity"
  | "EC2RequestLimitExceeded"
  | "FunctionError.InitTimeout"
  | "FunctionError.RuntimeInitError"
  | "FunctionError.ExtensionInitError"
  | "FunctionError.InvalidEntryPoint"
  | "FunctionError.InvalidWorkingDirectory"
  | "FunctionError.PermissionDenied"
  | "FunctionError.TooManyExtensions"
  | "FunctionError.InitResourceExhausted"
  | "DisallowedByVpcEncryptionControl"
  | "Creating"
  | (string & {});
export const StateReasonCode = S.String;
export type LastUpdateStatus =
  | "Successful"
  | "Failed"
  | "InProgress"
  | (string & {});
export const LastUpdateStatus = S.String;
export type LastUpdateStatusReasonCode =
  | "EniLimitExceeded"
  | "InsufficientRolePermissions"
  | "InvalidConfiguration"
  | "InternalError"
  | "SubnetOutOfIPAddresses"
  | "InvalidSubnet"
  | "InvalidSecurityGroup"
  | "ImageDeleted"
  | "ImageAccessDenied"
  | "InvalidImage"
  | "KMSKeyAccessDenied"
  | "KMSKeyNotFound"
  | "InvalidStateKMSKey"
  | "DisabledKMSKey"
  | "EFSIOError"
  | "EFSMountConnectivityError"
  | "EFSMountFailure"
  | "EFSMountTimeout"
  | "InvalidRuntime"
  | "InvalidZipFileException"
  | "FunctionError"
  | "VcpuLimitExceeded"
  | "CapacityProviderScalingLimitExceeded"
  | "InsufficientCapacity"
  | "EC2RequestLimitExceeded"
  | "FunctionError.InitTimeout"
  | "FunctionError.RuntimeInitError"
  | "FunctionError.ExtensionInitError"
  | "FunctionError.InvalidEntryPoint"
  | "FunctionError.InvalidWorkingDirectory"
  | "FunctionError.PermissionDenied"
  | "FunctionError.TooManyExtensions"
  | "FunctionError.InitResourceExhausted"
  | "DisallowedByVpcEncryptionControl"
  | "Creating"
  | (string & {});
export const LastUpdateStatusReasonCode = S.String;
export interface ImageConfigError {
  ErrorCode?: string;
  Message?: string | redacted.Redacted<string>;
}
export const ImageConfigError = S.suspend(() =>
  S.Struct({
    ErrorCode: S.optional(S.String),
    Message: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ImageConfigError",
}) as any as S.Schema<ImageConfigError>;
export interface ImageConfigResponse {
  ImageConfig?: ImageConfig;
  Error?: ImageConfigError;
}
export const ImageConfigResponse = S.suspend(() =>
  S.Struct({
    ImageConfig: S.optional(ImageConfig),
    Error: S.optional(ImageConfigError),
  }),
).annotations({
  identifier: "ImageConfigResponse",
}) as any as S.Schema<ImageConfigResponse>;
export type SnapStartOptimizationStatus = "On" | "Off" | (string & {});
export const SnapStartOptimizationStatus = S.String;
export interface SnapStartResponse {
  ApplyOn?: SnapStartApplyOn;
  OptimizationStatus?: SnapStartOptimizationStatus;
}
export const SnapStartResponse = S.suspend(() =>
  S.Struct({
    ApplyOn: S.optional(SnapStartApplyOn),
    OptimizationStatus: S.optional(SnapStartOptimizationStatus),
  }),
).annotations({
  identifier: "SnapStartResponse",
}) as any as S.Schema<SnapStartResponse>;
export interface RuntimeVersionError {
  ErrorCode?: string;
  Message?: string | redacted.Redacted<string>;
}
export const RuntimeVersionError = S.suspend(() =>
  S.Struct({
    ErrorCode: S.optional(S.String),
    Message: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "RuntimeVersionError",
}) as any as S.Schema<RuntimeVersionError>;
export interface RuntimeVersionConfig {
  RuntimeVersionArn?: string;
  Error?: RuntimeVersionError;
}
export const RuntimeVersionConfig = S.suspend(() =>
  S.Struct({
    RuntimeVersionArn: S.optional(S.String),
    Error: S.optional(RuntimeVersionError),
  }),
).annotations({
  identifier: "RuntimeVersionConfig",
}) as any as S.Schema<RuntimeVersionConfig>;
export interface FunctionConfiguration {
  FunctionName?: string;
  FunctionArn?: string;
  Runtime?: Runtime;
  Role?: string;
  Handler?: string;
  CodeSize?: number;
  Description?: string;
  Timeout?: number;
  MemorySize?: number;
  LastModified?: string;
  CodeSha256?: string;
  Version?: string;
  VpcConfig?: VpcConfigResponse;
  DeadLetterConfig?: DeadLetterConfig;
  Environment?: EnvironmentResponse;
  KMSKeyArn?: string;
  TracingConfig?: TracingConfigResponse;
  MasterArn?: string;
  RevisionId?: string;
  Layers?: Layer[];
  State?: State;
  StateReason?: string;
  StateReasonCode?: StateReasonCode;
  LastUpdateStatus?: LastUpdateStatus;
  LastUpdateStatusReason?: string;
  LastUpdateStatusReasonCode?: LastUpdateStatusReasonCode;
  FileSystemConfigs?: FileSystemConfig[];
  PackageType?: PackageType;
  ImageConfigResponse?: ImageConfigResponse;
  SigningProfileVersionArn?: string;
  SigningJobArn?: string;
  Architectures?: Architecture[];
  EphemeralStorage?: EphemeralStorage;
  SnapStart?: SnapStartResponse;
  RuntimeVersionConfig?: RuntimeVersionConfig;
  LoggingConfig?: LoggingConfig;
  CapacityProviderConfig?: CapacityProviderConfig;
  ConfigSha256?: string;
  DurableConfig?: DurableConfig;
  TenancyConfig?: TenancyConfig;
}
export const FunctionConfiguration = S.suspend(() =>
  S.Struct({
    FunctionName: S.optional(S.String),
    FunctionArn: S.optional(S.String),
    Runtime: S.optional(Runtime),
    Role: S.optional(S.String),
    Handler: S.optional(S.String),
    CodeSize: S.optional(S.Number),
    Description: S.optional(S.String),
    Timeout: S.optional(S.Number),
    MemorySize: S.optional(S.Number),
    LastModified: S.optional(S.String),
    CodeSha256: S.optional(S.String),
    Version: S.optional(S.String),
    VpcConfig: S.optional(VpcConfigResponse),
    DeadLetterConfig: S.optional(DeadLetterConfig),
    Environment: S.optional(EnvironmentResponse),
    KMSKeyArn: S.optional(S.String),
    TracingConfig: S.optional(TracingConfigResponse),
    MasterArn: S.optional(S.String),
    RevisionId: S.optional(S.String),
    Layers: S.optional(LayersReferenceList),
    State: S.optional(State),
    StateReason: S.optional(S.String),
    StateReasonCode: S.optional(StateReasonCode),
    LastUpdateStatus: S.optional(LastUpdateStatus),
    LastUpdateStatusReason: S.optional(S.String),
    LastUpdateStatusReasonCode: S.optional(LastUpdateStatusReasonCode),
    FileSystemConfigs: S.optional(FileSystemConfigList),
    PackageType: S.optional(PackageType),
    ImageConfigResponse: S.optional(ImageConfigResponse),
    SigningProfileVersionArn: S.optional(S.String),
    SigningJobArn: S.optional(S.String),
    Architectures: S.optional(ArchitecturesList),
    EphemeralStorage: S.optional(EphemeralStorage),
    SnapStart: S.optional(SnapStartResponse),
    RuntimeVersionConfig: S.optional(RuntimeVersionConfig),
    LoggingConfig: S.optional(LoggingConfig),
    CapacityProviderConfig: S.optional(CapacityProviderConfig),
    ConfigSha256: S.optional(S.String),
    DurableConfig: S.optional(DurableConfig),
    TenancyConfig: S.optional(TenancyConfig),
  }),
).annotations({
  identifier: "FunctionConfiguration",
}) as any as S.Schema<FunctionConfiguration>;
export type FunctionList = FunctionConfiguration[];
export const FunctionList = S.Array(FunctionConfiguration);
export interface FunctionScalingConfig {
  MinExecutionEnvironments?: number;
  MaxExecutionEnvironments?: number;
}
export const FunctionScalingConfig = S.suspend(() =>
  S.Struct({
    MinExecutionEnvironments: S.optional(S.Number),
    MaxExecutionEnvironments: S.optional(S.Number),
  }),
).annotations({
  identifier: "FunctionScalingConfig",
}) as any as S.Schema<FunctionScalingConfig>;
export interface AliasConfiguration {
  AliasArn?: string;
  Name?: string;
  FunctionVersion?: string;
  Description?: string;
  RoutingConfig?: AliasRoutingConfiguration;
  RevisionId?: string;
}
export const AliasConfiguration = S.suspend(() =>
  S.Struct({
    AliasArn: S.optional(S.String),
    Name: S.optional(S.String),
    FunctionVersion: S.optional(S.String),
    Description: S.optional(S.String),
    RoutingConfig: S.optional(AliasRoutingConfiguration),
    RevisionId: S.optional(S.String),
  }),
).annotations({
  identifier: "AliasConfiguration",
}) as any as S.Schema<AliasConfiguration>;
export type AliasList = AliasConfiguration[];
export const AliasList = S.Array(AliasConfiguration);
export interface LayerVersionContentInput {
  S3Bucket?: string;
  S3Key?: string;
  S3ObjectVersion?: string;
  ZipFile?: Uint8Array | redacted.Redacted<Uint8Array>;
}
export const LayerVersionContentInput = S.suspend(() =>
  S.Struct({
    S3Bucket: S.optional(S.String),
    S3Key: S.optional(S.String),
    S3ObjectVersion: S.optional(S.String),
    ZipFile: S.optional(SensitiveBlob),
  }),
).annotations({
  identifier: "LayerVersionContentInput",
}) as any as S.Schema<LayerVersionContentInput>;
export type ProvisionedConcurrencyStatusEnum =
  | "IN_PROGRESS"
  | "READY"
  | "FAILED"
  | (string & {});
export const ProvisionedConcurrencyStatusEnum = S.String;
export interface DeleteFunctionResponse {
  StatusCode?: number;
}
export const DeleteFunctionResponse = S.suspend(() =>
  S.Struct({ StatusCode: S.optional(S.Number).pipe(T.HttpResponseCode()) }),
).annotations({
  identifier: "DeleteFunctionResponse",
}) as any as S.Schema<DeleteFunctionResponse>;
export interface GetAccountSettingsResponse {
  AccountLimit?: AccountLimit;
  AccountUsage?: AccountUsage;
}
export const GetAccountSettingsResponse = S.suspend(() =>
  S.Struct({
    AccountLimit: S.optional(AccountLimit),
    AccountUsage: S.optional(AccountUsage),
  }),
).annotations({
  identifier: "GetAccountSettingsResponse",
}) as any as S.Schema<GetAccountSettingsResponse>;
export interface ListFunctionEventInvokeConfigsResponse {
  FunctionEventInvokeConfigs?: FunctionEventInvokeConfig[];
  NextMarker?: string;
}
export const ListFunctionEventInvokeConfigsResponse = S.suspend(() =>
  S.Struct({
    FunctionEventInvokeConfigs: S.optional(FunctionEventInvokeConfigList),
    NextMarker: S.optional(S.String),
  }),
).annotations({
  identifier: "ListFunctionEventInvokeConfigsResponse",
}) as any as S.Schema<ListFunctionEventInvokeConfigsResponse>;
export interface ListTagsResponse {
  Tags?: { [key: string]: string | undefined };
}
export const ListTagsResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsResponse",
}) as any as S.Schema<ListTagsResponse>;
export interface SendDurableExecutionCallbackFailureRequest {
  CallbackId: string;
  Error?: ErrorObject;
}
export const SendDurableExecutionCallbackFailureRequest = S.suspend(() =>
  S.Struct({
    CallbackId: S.String.pipe(T.HttpLabel("CallbackId")),
    Error: S.optional(ErrorObject)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ErrorObject" }),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/2025-12-01/durable-execution-callbacks/{CallbackId}/fail",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendDurableExecutionCallbackFailureRequest",
}) as any as S.Schema<SendDurableExecutionCallbackFailureRequest>;
export interface SendDurableExecutionCallbackFailureResponse {}
export const SendDurableExecutionCallbackFailureResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "SendDurableExecutionCallbackFailureResponse",
}) as any as S.Schema<SendDurableExecutionCallbackFailureResponse>;
export interface StopDurableExecutionResponse {
  StopTimestamp: Date;
}
export const StopDurableExecutionResponse = S.suspend(() =>
  S.Struct({ StopTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")) }),
).annotations({
  identifier: "StopDurableExecutionResponse",
}) as any as S.Schema<StopDurableExecutionResponse>;
export interface TagResourceRequest {
  Resource: string;
  Tags: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    Resource: S.String.pipe(T.HttpLabel("Resource")),
    Tags: Tags,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2017-03-31/tags/{Resource}" }),
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
export interface UpdateCapacityProviderResponse {
  CapacityProvider: CapacityProvider;
}
export const UpdateCapacityProviderResponse = S.suspend(() =>
  S.Struct({ CapacityProvider: CapacityProvider }),
).annotations({
  identifier: "UpdateCapacityProviderResponse",
}) as any as S.Schema<UpdateCapacityProviderResponse>;
export interface DeleteCapacityProviderResponse {
  CapacityProvider: CapacityProvider;
}
export const DeleteCapacityProviderResponse = S.suspend(() =>
  S.Struct({ CapacityProvider: CapacityProvider }),
).annotations({
  identifier: "DeleteCapacityProviderResponse",
}) as any as S.Schema<DeleteCapacityProviderResponse>;
export interface ListCapacityProvidersResponse {
  CapacityProviders: CapacityProvider[];
  NextMarker?: string;
}
export const ListCapacityProvidersResponse = S.suspend(() =>
  S.Struct({
    CapacityProviders: CapacityProvidersList,
    NextMarker: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCapacityProvidersResponse",
}) as any as S.Schema<ListCapacityProvidersResponse>;
export interface CreateCodeSigningConfigRequest {
  Description?: string;
  AllowedPublishers: AllowedPublishers;
  CodeSigningPolicies?: CodeSigningPolicies;
  Tags?: { [key: string]: string | undefined };
}
export const CreateCodeSigningConfigRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    AllowedPublishers: AllowedPublishers,
    CodeSigningPolicies: S.optional(CodeSigningPolicies),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2020-04-22/code-signing-configs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCodeSigningConfigRequest",
}) as any as S.Schema<CreateCodeSigningConfigRequest>;
export interface CodeSigningConfig {
  CodeSigningConfigId: string;
  CodeSigningConfigArn: string;
  Description?: string;
  AllowedPublishers: AllowedPublishers;
  CodeSigningPolicies: CodeSigningPolicies;
  LastModified: string;
}
export const CodeSigningConfig = S.suspend(() =>
  S.Struct({
    CodeSigningConfigId: S.String,
    CodeSigningConfigArn: S.String,
    Description: S.optional(S.String),
    AllowedPublishers: AllowedPublishers,
    CodeSigningPolicies: CodeSigningPolicies,
    LastModified: S.String,
  }),
).annotations({
  identifier: "CodeSigningConfig",
}) as any as S.Schema<CodeSigningConfig>;
export interface GetCodeSigningConfigResponse {
  CodeSigningConfig: CodeSigningConfig;
}
export const GetCodeSigningConfigResponse = S.suspend(() =>
  S.Struct({ CodeSigningConfig: CodeSigningConfig }),
).annotations({
  identifier: "GetCodeSigningConfigResponse",
}) as any as S.Schema<GetCodeSigningConfigResponse>;
export interface ListFunctionsByCodeSigningConfigResponse {
  NextMarker?: string;
  FunctionArns?: string[];
}
export const ListFunctionsByCodeSigningConfigResponse = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    FunctionArns: S.optional(FunctionArnList),
  }),
).annotations({
  identifier: "ListFunctionsByCodeSigningConfigResponse",
}) as any as S.Schema<ListFunctionsByCodeSigningConfigResponse>;
export interface UpdateCodeSigningConfigResponse {
  CodeSigningConfig: CodeSigningConfig;
}
export const UpdateCodeSigningConfigResponse = S.suspend(() =>
  S.Struct({ CodeSigningConfig: CodeSigningConfig }),
).annotations({
  identifier: "UpdateCodeSigningConfigResponse",
}) as any as S.Schema<UpdateCodeSigningConfigResponse>;
export interface ListEventSourceMappingsResponse {
  NextMarker?: string;
  EventSourceMappings?: EventSourceMappingConfiguration[];
}
export const ListEventSourceMappingsResponse = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    EventSourceMappings: S.optional(EventSourceMappingsList),
  }),
).annotations({
  identifier: "ListEventSourceMappingsResponse",
}) as any as S.Schema<ListEventSourceMappingsResponse>;
export interface ListFunctionsResponse {
  NextMarker?: string;
  Functions?: FunctionConfiguration[];
}
export const ListFunctionsResponse = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    Functions: S.optional(FunctionList),
  }),
).annotations({
  identifier: "ListFunctionsResponse",
}) as any as S.Schema<ListFunctionsResponse>;
export interface CreateFunctionUrlConfigRequest {
  FunctionName: string;
  Qualifier?: string;
  AuthType: FunctionUrlAuthType;
  Cors?: Cors;
  InvokeMode?: InvokeMode;
}
export const CreateFunctionUrlConfigRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
    AuthType: FunctionUrlAuthType,
    Cors: S.optional(Cors),
    InvokeMode: S.optional(InvokeMode),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/2021-10-31/functions/{FunctionName}/url",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFunctionUrlConfigRequest",
}) as any as S.Schema<CreateFunctionUrlConfigRequest>;
export interface GetFunctionConcurrencyResponse {
  ReservedConcurrentExecutions?: number;
}
export const GetFunctionConcurrencyResponse = S.suspend(() =>
  S.Struct({ ReservedConcurrentExecutions: S.optional(S.Number) }),
).annotations({
  identifier: "GetFunctionConcurrencyResponse",
}) as any as S.Schema<GetFunctionConcurrencyResponse>;
export interface GetFunctionUrlConfigResponse {
  FunctionUrl: string;
  FunctionArn: string;
  AuthType: FunctionUrlAuthType;
  Cors?: Cors;
  CreationTime: string;
  LastModifiedTime: string;
  InvokeMode?: InvokeMode;
}
export const GetFunctionUrlConfigResponse = S.suspend(() =>
  S.Struct({
    FunctionUrl: S.String,
    FunctionArn: S.String,
    AuthType: FunctionUrlAuthType,
    Cors: S.optional(Cors),
    CreationTime: S.String,
    LastModifiedTime: S.String,
    InvokeMode: S.optional(InvokeMode),
  }),
).annotations({
  identifier: "GetFunctionUrlConfigResponse",
}) as any as S.Schema<GetFunctionUrlConfigResponse>;
export interface Concurrency {
  ReservedConcurrentExecutions?: number;
}
export const Concurrency = S.suspend(() =>
  S.Struct({ ReservedConcurrentExecutions: S.optional(S.Number) }),
).annotations({ identifier: "Concurrency" }) as any as S.Schema<Concurrency>;
export interface UpdateFunctionUrlConfigResponse {
  FunctionUrl: string;
  FunctionArn: string;
  AuthType: FunctionUrlAuthType;
  Cors?: Cors;
  CreationTime: string;
  LastModifiedTime: string;
  InvokeMode?: InvokeMode;
}
export const UpdateFunctionUrlConfigResponse = S.suspend(() =>
  S.Struct({
    FunctionUrl: S.String,
    FunctionArn: S.String,
    AuthType: FunctionUrlAuthType,
    Cors: S.optional(Cors),
    CreationTime: S.String,
    LastModifiedTime: S.String,
    InvokeMode: S.optional(InvokeMode),
  }),
).annotations({
  identifier: "UpdateFunctionUrlConfigResponse",
}) as any as S.Schema<UpdateFunctionUrlConfigResponse>;
export interface GetFunctionCodeSigningConfigResponse {
  CodeSigningConfigArn: string;
  FunctionName: string;
}
export const GetFunctionCodeSigningConfigResponse = S.suspend(() =>
  S.Struct({ CodeSigningConfigArn: S.String, FunctionName: S.String }),
).annotations({
  identifier: "GetFunctionCodeSigningConfigResponse",
}) as any as S.Schema<GetFunctionCodeSigningConfigResponse>;
export interface GetFunctionRecursionConfigResponse {
  RecursiveLoop?: RecursiveLoop;
}
export const GetFunctionRecursionConfigResponse = S.suspend(() =>
  S.Struct({ RecursiveLoop: S.optional(RecursiveLoop) }),
).annotations({
  identifier: "GetFunctionRecursionConfigResponse",
}) as any as S.Schema<GetFunctionRecursionConfigResponse>;
export interface GetFunctionScalingConfigResponse {
  FunctionArn?: string;
  AppliedFunctionScalingConfig?: FunctionScalingConfig;
  RequestedFunctionScalingConfig?: FunctionScalingConfig;
}
export const GetFunctionScalingConfigResponse = S.suspend(() =>
  S.Struct({
    FunctionArn: S.optional(S.String),
    AppliedFunctionScalingConfig: S.optional(FunctionScalingConfig),
    RequestedFunctionScalingConfig: S.optional(FunctionScalingConfig),
  }),
).annotations({
  identifier: "GetFunctionScalingConfigResponse",
}) as any as S.Schema<GetFunctionScalingConfigResponse>;
export interface GetPolicyResponse {
  Policy?: string;
  RevisionId?: string;
}
export const GetPolicyResponse = S.suspend(() =>
  S.Struct({ Policy: S.optional(S.String), RevisionId: S.optional(S.String) }),
).annotations({
  identifier: "GetPolicyResponse",
}) as any as S.Schema<GetPolicyResponse>;
export interface GetRuntimeManagementConfigResponse {
  UpdateRuntimeOn?: UpdateRuntimeOn;
  RuntimeVersionArn?: string;
  FunctionArn?: string;
}
export const GetRuntimeManagementConfigResponse = S.suspend(() =>
  S.Struct({
    UpdateRuntimeOn: S.optional(UpdateRuntimeOn),
    RuntimeVersionArn: S.optional(S.String),
    FunctionArn: S.optional(S.String),
  }),
).annotations({
  identifier: "GetRuntimeManagementConfigResponse",
}) as any as S.Schema<GetRuntimeManagementConfigResponse>;
export interface InvocationResponse {
  StatusCode?: number;
  FunctionError?: string;
  LogResult?: string;
  Payload?: T.StreamingOutputBody;
  ExecutedVersion?: string;
  DurableExecutionArn?: string;
}
export const InvocationResponse = S.suspend(() =>
  S.Struct({
    StatusCode: S.optional(S.Number).pipe(T.HttpResponseCode()),
    FunctionError: S.optional(S.String).pipe(
      T.HttpHeader("X-Amz-Function-Error"),
    ),
    LogResult: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Log-Result")),
    Payload: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
    ExecutedVersion: S.optional(S.String).pipe(
      T.HttpHeader("X-Amz-Executed-Version"),
    ),
    DurableExecutionArn: S.optional(S.String).pipe(
      T.HttpHeader("X-Amz-Durable-Execution-Arn"),
    ),
  }),
).annotations({
  identifier: "InvocationResponse",
}) as any as S.Schema<InvocationResponse>;
export interface InvokeAsyncResponse {
  Status?: number;
}
export const InvokeAsyncResponse = S.suspend(() =>
  S.Struct({ Status: S.optional(S.Number).pipe(T.HttpResponseCode()) }),
).annotations({
  identifier: "InvokeAsyncResponse",
}) as any as S.Schema<InvokeAsyncResponse>;
export interface PutFunctionCodeSigningConfigResponse {
  CodeSigningConfigArn: string;
  FunctionName: string;
}
export const PutFunctionCodeSigningConfigResponse = S.suspend(() =>
  S.Struct({ CodeSigningConfigArn: S.String, FunctionName: S.String }),
).annotations({
  identifier: "PutFunctionCodeSigningConfigResponse",
}) as any as S.Schema<PutFunctionCodeSigningConfigResponse>;
export interface PutFunctionRecursionConfigResponse {
  RecursiveLoop?: RecursiveLoop;
}
export const PutFunctionRecursionConfigResponse = S.suspend(() =>
  S.Struct({ RecursiveLoop: S.optional(RecursiveLoop) }),
).annotations({
  identifier: "PutFunctionRecursionConfigResponse",
}) as any as S.Schema<PutFunctionRecursionConfigResponse>;
export interface PutFunctionScalingConfigRequest {
  FunctionName: string;
  Qualifier: string;
  FunctionScalingConfig?: FunctionScalingConfig;
}
export const PutFunctionScalingConfigRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.String.pipe(T.HttpQuery("Qualifier")),
    FunctionScalingConfig: S.optional(FunctionScalingConfig),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/2025-11-30/functions/{FunctionName}/function-scaling-config",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutFunctionScalingConfigRequest",
}) as any as S.Schema<PutFunctionScalingConfigRequest>;
export interface PutRuntimeManagementConfigResponse {
  UpdateRuntimeOn: UpdateRuntimeOn;
  FunctionArn: string;
  RuntimeVersionArn?: string;
}
export const PutRuntimeManagementConfigResponse = S.suspend(() =>
  S.Struct({
    UpdateRuntimeOn: UpdateRuntimeOn,
    FunctionArn: S.String,
    RuntimeVersionArn: S.optional(S.String),
  }),
).annotations({
  identifier: "PutRuntimeManagementConfigResponse",
}) as any as S.Schema<PutRuntimeManagementConfigResponse>;
export interface ListAliasesResponse {
  NextMarker?: string;
  Aliases?: AliasConfiguration[];
}
export const ListAliasesResponse = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    Aliases: S.optional(AliasList),
  }),
).annotations({
  identifier: "ListAliasesResponse",
}) as any as S.Schema<ListAliasesResponse>;
export interface ListVersionsByFunctionResponse {
  NextMarker?: string;
  Versions?: FunctionConfiguration[];
}
export const ListVersionsByFunctionResponse = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    Versions: S.optional(FunctionList),
  }),
).annotations({
  identifier: "ListVersionsByFunctionResponse",
}) as any as S.Schema<ListVersionsByFunctionResponse>;
export interface AddLayerVersionPermissionResponse {
  Statement?: string;
  RevisionId?: string;
}
export const AddLayerVersionPermissionResponse = S.suspend(() =>
  S.Struct({
    Statement: S.optional(S.String),
    RevisionId: S.optional(S.String),
  }),
).annotations({
  identifier: "AddLayerVersionPermissionResponse",
}) as any as S.Schema<AddLayerVersionPermissionResponse>;
export interface GetLayerVersionPolicyResponse {
  Policy?: string;
  RevisionId?: string;
}
export const GetLayerVersionPolicyResponse = S.suspend(() =>
  S.Struct({ Policy: S.optional(S.String), RevisionId: S.optional(S.String) }),
).annotations({
  identifier: "GetLayerVersionPolicyResponse",
}) as any as S.Schema<GetLayerVersionPolicyResponse>;
export interface PublishLayerVersionRequest {
  LayerName: string;
  Description?: string;
  Content: LayerVersionContentInput;
  CompatibleRuntimes?: Runtime[];
  LicenseInfo?: string;
  CompatibleArchitectures?: Architecture[];
}
export const PublishLayerVersionRequest = S.suspend(() =>
  S.Struct({
    LayerName: S.String.pipe(T.HttpLabel("LayerName")),
    Description: S.optional(S.String),
    Content: LayerVersionContentInput,
    CompatibleRuntimes: S.optional(CompatibleRuntimes),
    LicenseInfo: S.optional(S.String),
    CompatibleArchitectures: S.optional(CompatibleArchitectures),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/2018-10-31/layers/{LayerName}/versions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PublishLayerVersionRequest",
}) as any as S.Schema<PublishLayerVersionRequest>;
export interface AddPermissionResponse {
  Statement?: string;
}
export const AddPermissionResponse = S.suspend(() =>
  S.Struct({ Statement: S.optional(S.String) }),
).annotations({
  identifier: "AddPermissionResponse",
}) as any as S.Schema<AddPermissionResponse>;
export interface PutProvisionedConcurrencyConfigResponse {
  RequestedProvisionedConcurrentExecutions?: number;
  AvailableProvisionedConcurrentExecutions?: number;
  AllocatedProvisionedConcurrentExecutions?: number;
  Status?: ProvisionedConcurrencyStatusEnum;
  StatusReason?: string;
  LastModified?: string;
}
export const PutProvisionedConcurrencyConfigResponse = S.suspend(() =>
  S.Struct({
    RequestedProvisionedConcurrentExecutions: S.optional(S.Number),
    AvailableProvisionedConcurrentExecutions: S.optional(S.Number),
    AllocatedProvisionedConcurrentExecutions: S.optional(S.Number),
    Status: S.optional(ProvisionedConcurrencyStatusEnum),
    StatusReason: S.optional(S.String),
    LastModified: S.optional(S.String),
  }),
).annotations({
  identifier: "PutProvisionedConcurrencyConfigResponse",
}) as any as S.Schema<PutProvisionedConcurrencyConfigResponse>;
export interface GetProvisionedConcurrencyConfigResponse {
  RequestedProvisionedConcurrentExecutions?: number;
  AvailableProvisionedConcurrentExecutions?: number;
  AllocatedProvisionedConcurrentExecutions?: number;
  Status?: ProvisionedConcurrencyStatusEnum;
  StatusReason?: string;
  LastModified?: string;
}
export const GetProvisionedConcurrencyConfigResponse = S.suspend(() =>
  S.Struct({
    RequestedProvisionedConcurrentExecutions: S.optional(S.Number),
    AvailableProvisionedConcurrentExecutions: S.optional(S.Number),
    AllocatedProvisionedConcurrentExecutions: S.optional(S.Number),
    Status: S.optional(ProvisionedConcurrencyStatusEnum),
    StatusReason: S.optional(S.String),
    LastModified: S.optional(S.String),
  }),
).annotations({
  identifier: "GetProvisionedConcurrencyConfigResponse",
}) as any as S.Schema<GetProvisionedConcurrencyConfigResponse>;
export interface ContextOptions {
  ReplayChildren?: boolean;
}
export const ContextOptions = S.suspend(() =>
  S.Struct({ ReplayChildren: S.optional(S.Boolean) }),
).annotations({
  identifier: "ContextOptions",
}) as any as S.Schema<ContextOptions>;
export interface StepOptions {
  NextAttemptDelaySeconds?: number;
}
export const StepOptions = S.suspend(() =>
  S.Struct({ NextAttemptDelaySeconds: S.optional(S.Number) }),
).annotations({ identifier: "StepOptions" }) as any as S.Schema<StepOptions>;
export interface WaitOptions {
  WaitSeconds?: number;
}
export const WaitOptions = S.suspend(() =>
  S.Struct({ WaitSeconds: S.optional(S.Number) }),
).annotations({ identifier: "WaitOptions" }) as any as S.Schema<WaitOptions>;
export interface CallbackOptions {
  TimeoutSeconds?: number;
  HeartbeatTimeoutSeconds?: number;
}
export const CallbackOptions = S.suspend(() =>
  S.Struct({
    TimeoutSeconds: S.optional(S.Number),
    HeartbeatTimeoutSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "CallbackOptions",
}) as any as S.Schema<CallbackOptions>;
export interface ChainedInvokeOptions {
  FunctionName: string;
  TenantId?: string;
}
export const ChainedInvokeOptions = S.suspend(() =>
  S.Struct({ FunctionName: S.String, TenantId: S.optional(S.String) }),
).annotations({
  identifier: "ChainedInvokeOptions",
}) as any as S.Schema<ChainedInvokeOptions>;
export type EventType =
  | "ExecutionStarted"
  | "ExecutionSucceeded"
  | "ExecutionFailed"
  | "ExecutionTimedOut"
  | "ExecutionStopped"
  | "ContextStarted"
  | "ContextSucceeded"
  | "ContextFailed"
  | "WaitStarted"
  | "WaitSucceeded"
  | "WaitCancelled"
  | "StepStarted"
  | "StepSucceeded"
  | "StepFailed"
  | "ChainedInvokeStarted"
  | "ChainedInvokeSucceeded"
  | "ChainedInvokeFailed"
  | "ChainedInvokeTimedOut"
  | "ChainedInvokeStopped"
  | "CallbackStarted"
  | "CallbackSucceeded"
  | "CallbackFailed"
  | "CallbackTimedOut"
  | "InvocationCompleted"
  | (string & {});
export const EventType = S.String;
export interface ContextStartedDetails {}
export const ContextStartedDetails = S.suspend(() => S.Struct({})).annotations({
  identifier: "ContextStartedDetails",
}) as any as S.Schema<ContextStartedDetails>;
export interface StepStartedDetails {}
export const StepStartedDetails = S.suspend(() => S.Struct({})).annotations({
  identifier: "StepStartedDetails",
}) as any as S.Schema<StepStartedDetails>;
export type OperationStatus =
  | "STARTED"
  | "PENDING"
  | "READY"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELLED"
  | "TIMED_OUT"
  | "STOPPED"
  | (string & {});
export const OperationStatus = S.String;
export interface OperationUpdate {
  Id: string;
  ParentId?: string;
  Name?: string;
  Type: OperationType;
  SubType?: string;
  Action: OperationAction;
  Payload?: string | redacted.Redacted<string>;
  Error?: ErrorObject;
  ContextOptions?: ContextOptions;
  StepOptions?: StepOptions;
  WaitOptions?: WaitOptions;
  CallbackOptions?: CallbackOptions;
  ChainedInvokeOptions?: ChainedInvokeOptions;
}
export const OperationUpdate = S.suspend(() =>
  S.Struct({
    Id: S.String,
    ParentId: S.optional(S.String),
    Name: S.optional(S.String),
    Type: OperationType,
    SubType: S.optional(S.String),
    Action: OperationAction,
    Payload: S.optional(SensitiveString),
    Error: S.optional(ErrorObject),
    ContextOptions: S.optional(ContextOptions),
    StepOptions: S.optional(StepOptions),
    WaitOptions: S.optional(WaitOptions),
    CallbackOptions: S.optional(CallbackOptions),
    ChainedInvokeOptions: S.optional(ChainedInvokeOptions),
  }),
).annotations({
  identifier: "OperationUpdate",
}) as any as S.Schema<OperationUpdate>;
export type OperationUpdates = OperationUpdate[];
export const OperationUpdates = S.Array(OperationUpdate);
export interface TraceHeader {
  XAmznTraceId?: string;
}
export const TraceHeader = S.suspend(() =>
  S.Struct({ XAmznTraceId: S.optional(S.String) }),
).annotations({ identifier: "TraceHeader" }) as any as S.Schema<TraceHeader>;
export interface Execution {
  DurableExecutionArn: string;
  DurableExecutionName: string;
  FunctionArn: string;
  Status: ExecutionStatus;
  StartTimestamp: Date;
  EndTimestamp?: Date;
}
export const Execution = S.suspend(() =>
  S.Struct({
    DurableExecutionArn: S.String,
    DurableExecutionName: S.String,
    FunctionArn: S.String,
    Status: ExecutionStatus,
    StartTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Execution" }) as any as S.Schema<Execution>;
export type DurableExecutions = Execution[];
export const DurableExecutions = S.Array(Execution);
export interface FunctionVersionsByCapacityProviderListItem {
  FunctionArn: string;
  State: State;
}
export const FunctionVersionsByCapacityProviderListItem = S.suspend(() =>
  S.Struct({ FunctionArn: S.String, State: State }),
).annotations({
  identifier: "FunctionVersionsByCapacityProviderListItem",
}) as any as S.Schema<FunctionVersionsByCapacityProviderListItem>;
export type FunctionVersionsByCapacityProviderList =
  FunctionVersionsByCapacityProviderListItem[];
export const FunctionVersionsByCapacityProviderList = S.Array(
  FunctionVersionsByCapacityProviderListItem,
);
export type CodeSigningConfigList = CodeSigningConfig[];
export const CodeSigningConfigList = S.Array(CodeSigningConfig);
export interface FunctionUrlConfig {
  FunctionUrl: string;
  FunctionArn: string;
  CreationTime: string;
  LastModifiedTime: string;
  Cors?: Cors;
  AuthType: FunctionUrlAuthType;
  InvokeMode?: InvokeMode;
}
export const FunctionUrlConfig = S.suspend(() =>
  S.Struct({
    FunctionUrl: S.String,
    FunctionArn: S.String,
    CreationTime: S.String,
    LastModifiedTime: S.String,
    Cors: S.optional(Cors),
    AuthType: FunctionUrlAuthType,
    InvokeMode: S.optional(InvokeMode),
  }),
).annotations({
  identifier: "FunctionUrlConfig",
}) as any as S.Schema<FunctionUrlConfig>;
export type FunctionUrlConfigList = FunctionUrlConfig[];
export const FunctionUrlConfigList = S.Array(FunctionUrlConfig);
export interface ProvisionedConcurrencyConfigListItem {
  FunctionArn?: string;
  RequestedProvisionedConcurrentExecutions?: number;
  AvailableProvisionedConcurrentExecutions?: number;
  AllocatedProvisionedConcurrentExecutions?: number;
  Status?: ProvisionedConcurrencyStatusEnum;
  StatusReason?: string;
  LastModified?: string;
}
export const ProvisionedConcurrencyConfigListItem = S.suspend(() =>
  S.Struct({
    FunctionArn: S.optional(S.String),
    RequestedProvisionedConcurrentExecutions: S.optional(S.Number),
    AvailableProvisionedConcurrentExecutions: S.optional(S.Number),
    AllocatedProvisionedConcurrentExecutions: S.optional(S.Number),
    Status: S.optional(ProvisionedConcurrencyStatusEnum),
    StatusReason: S.optional(S.String),
    LastModified: S.optional(S.String),
  }),
).annotations({
  identifier: "ProvisionedConcurrencyConfigListItem",
}) as any as S.Schema<ProvisionedConcurrencyConfigListItem>;
export type ProvisionedConcurrencyConfigList =
  ProvisionedConcurrencyConfigListItem[];
export const ProvisionedConcurrencyConfigList = S.Array(
  ProvisionedConcurrencyConfigListItem,
);
export interface FunctionCodeLocation {
  RepositoryType?: string;
  Location?: string;
  ImageUri?: string;
  ResolvedImageUri?: string;
  SourceKMSKeyArn?: string;
}
export const FunctionCodeLocation = S.suspend(() =>
  S.Struct({
    RepositoryType: S.optional(S.String),
    Location: S.optional(S.String),
    ImageUri: S.optional(S.String),
    ResolvedImageUri: S.optional(S.String),
    SourceKMSKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "FunctionCodeLocation",
}) as any as S.Schema<FunctionCodeLocation>;
export interface TagsError {
  ErrorCode: string;
  Message: string;
}
export const TagsError = S.suspend(() =>
  S.Struct({ ErrorCode: S.String, Message: S.String }),
).annotations({ identifier: "TagsError" }) as any as S.Schema<TagsError>;
export interface LayerVersionsListItem {
  LayerVersionArn?: string;
  Version?: number;
  Description?: string;
  CreatedDate?: string;
  CompatibleRuntimes?: Runtime[];
  LicenseInfo?: string;
  CompatibleArchitectures?: Architecture[];
}
export const LayerVersionsListItem = S.suspend(() =>
  S.Struct({
    LayerVersionArn: S.optional(S.String),
    Version: S.optional(S.Number),
    Description: S.optional(S.String),
    CreatedDate: S.optional(S.String),
    CompatibleRuntimes: S.optional(CompatibleRuntimes),
    LicenseInfo: S.optional(S.String),
    CompatibleArchitectures: S.optional(CompatibleArchitectures),
  }),
).annotations({
  identifier: "LayerVersionsListItem",
}) as any as S.Schema<LayerVersionsListItem>;
export interface LayersListItem {
  LayerName?: string;
  LayerArn?: string;
  LatestMatchingVersion?: LayerVersionsListItem;
}
export const LayersListItem = S.suspend(() =>
  S.Struct({
    LayerName: S.optional(S.String),
    LayerArn: S.optional(S.String),
    LatestMatchingVersion: S.optional(LayerVersionsListItem),
  }),
).annotations({
  identifier: "LayersListItem",
}) as any as S.Schema<LayersListItem>;
export type LayersList = LayersListItem[];
export const LayersList = S.Array(LayersListItem);
export type LayerVersionsList = LayerVersionsListItem[];
export const LayerVersionsList = S.Array(LayerVersionsListItem);
export type ThrottleReason =
  | "ConcurrentInvocationLimitExceeded"
  | "FunctionInvocationRateLimitExceeded"
  | "ReservedFunctionConcurrentInvocationLimitExceeded"
  | "ReservedFunctionInvocationRateLimitExceeded"
  | "CallerRateLimitExceeded"
  | "ConcurrentSnapshotCreateLimitExceeded"
  | (string & {});
export const ThrottleReason = S.String;
export interface LayerVersionContentOutput {
  Location?: string;
  CodeSha256?: string;
  CodeSize?: number;
  SigningProfileVersionArn?: string;
  SigningJobArn?: string;
}
export const LayerVersionContentOutput = S.suspend(() =>
  S.Struct({
    Location: S.optional(S.String),
    CodeSha256: S.optional(S.String),
    CodeSize: S.optional(S.Number),
    SigningProfileVersionArn: S.optional(S.String),
    SigningJobArn: S.optional(S.String),
  }),
).annotations({
  identifier: "LayerVersionContentOutput",
}) as any as S.Schema<LayerVersionContentOutput>;
export interface CheckpointDurableExecutionRequest {
  DurableExecutionArn: string;
  CheckpointToken: string;
  Updates?: OperationUpdate[];
  ClientToken?: string;
}
export const CheckpointDurableExecutionRequest = S.suspend(() =>
  S.Struct({
    DurableExecutionArn: S.String.pipe(T.HttpLabel("DurableExecutionArn")),
    CheckpointToken: S.String,
    Updates: S.optional(OperationUpdates),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/2025-12-01/durable-executions/{DurableExecutionArn}/checkpoint",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CheckpointDurableExecutionRequest",
}) as any as S.Schema<CheckpointDurableExecutionRequest>;
export interface GetDurableExecutionResponse {
  DurableExecutionArn: string;
  DurableExecutionName: string;
  FunctionArn: string;
  InputPayload?: string | redacted.Redacted<string>;
  Result?: string | redacted.Redacted<string>;
  Error?: ErrorObject;
  StartTimestamp: Date;
  Status: ExecutionStatus;
  EndTimestamp?: Date;
  Version?: string;
  TraceHeader?: TraceHeader;
}
export const GetDurableExecutionResponse = S.suspend(() =>
  S.Struct({
    DurableExecutionArn: S.String,
    DurableExecutionName: S.String,
    FunctionArn: S.String,
    InputPayload: S.optional(SensitiveString),
    Result: S.optional(SensitiveString),
    Error: S.optional(ErrorObject),
    StartTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Status: ExecutionStatus,
    EndTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Version: S.optional(S.String),
    TraceHeader: S.optional(TraceHeader),
  }),
).annotations({
  identifier: "GetDurableExecutionResponse",
}) as any as S.Schema<GetDurableExecutionResponse>;
export interface ListDurableExecutionsByFunctionResponse {
  DurableExecutions?: Execution[];
  NextMarker?: string;
}
export const ListDurableExecutionsByFunctionResponse = S.suspend(() =>
  S.Struct({
    DurableExecutions: S.optional(DurableExecutions),
    NextMarker: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDurableExecutionsByFunctionResponse",
}) as any as S.Schema<ListDurableExecutionsByFunctionResponse>;
export interface PutFunctionEventInvokeConfigRequest {
  FunctionName: string;
  Qualifier?: string;
  MaximumRetryAttempts?: number;
  MaximumEventAgeInSeconds?: number;
  DestinationConfig?: DestinationConfig;
}
export const PutFunctionEventInvokeConfigRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
    MaximumRetryAttempts: S.optional(S.Number),
    MaximumEventAgeInSeconds: S.optional(S.Number),
    DestinationConfig: S.optional(DestinationConfig),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/2019-09-25/functions/{FunctionName}/event-invoke-config",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutFunctionEventInvokeConfigRequest",
}) as any as S.Schema<PutFunctionEventInvokeConfigRequest>;
export interface CreateCapacityProviderRequest {
  CapacityProviderName: string;
  VpcConfig: CapacityProviderVpcConfig;
  PermissionsConfig: CapacityProviderPermissionsConfig;
  InstanceRequirements?: InstanceRequirements;
  CapacityProviderScalingConfig?: CapacityProviderScalingConfig;
  KmsKeyArn?: string;
  Tags?: { [key: string]: string | undefined };
}
export const CreateCapacityProviderRequest = S.suspend(() =>
  S.Struct({
    CapacityProviderName: S.String,
    VpcConfig: CapacityProviderVpcConfig,
    PermissionsConfig: CapacityProviderPermissionsConfig,
    InstanceRequirements: S.optional(InstanceRequirements),
    CapacityProviderScalingConfig: S.optional(CapacityProviderScalingConfig),
    KmsKeyArn: S.optional(S.String),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2025-11-30/capacity-providers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCapacityProviderRequest",
}) as any as S.Schema<CreateCapacityProviderRequest>;
export interface GetCapacityProviderResponse {
  CapacityProvider: CapacityProvider;
}
export const GetCapacityProviderResponse = S.suspend(() =>
  S.Struct({ CapacityProvider: CapacityProvider }),
).annotations({
  identifier: "GetCapacityProviderResponse",
}) as any as S.Schema<GetCapacityProviderResponse>;
export interface ListFunctionVersionsByCapacityProviderResponse {
  CapacityProviderArn: string;
  FunctionVersions: FunctionVersionsByCapacityProviderListItem[];
  NextMarker?: string;
}
export const ListFunctionVersionsByCapacityProviderResponse = S.suspend(() =>
  S.Struct({
    CapacityProviderArn: S.String,
    FunctionVersions: FunctionVersionsByCapacityProviderList,
    NextMarker: S.optional(S.String),
  }),
).annotations({
  identifier: "ListFunctionVersionsByCapacityProviderResponse",
}) as any as S.Schema<ListFunctionVersionsByCapacityProviderResponse>;
export interface CreateCodeSigningConfigResponse {
  CodeSigningConfig: CodeSigningConfig;
}
export const CreateCodeSigningConfigResponse = S.suspend(() =>
  S.Struct({ CodeSigningConfig: CodeSigningConfig }),
).annotations({
  identifier: "CreateCodeSigningConfigResponse",
}) as any as S.Schema<CreateCodeSigningConfigResponse>;
export interface ListCodeSigningConfigsResponse {
  NextMarker?: string;
  CodeSigningConfigs?: CodeSigningConfig[];
}
export const ListCodeSigningConfigsResponse = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    CodeSigningConfigs: S.optional(CodeSigningConfigList),
  }),
).annotations({
  identifier: "ListCodeSigningConfigsResponse",
}) as any as S.Schema<ListCodeSigningConfigsResponse>;
export interface CreateFunctionRequest {
  FunctionName: string;
  Runtime?: Runtime;
  Role: string;
  Handler?: string;
  Code: FunctionCode;
  Description?: string;
  Timeout?: number;
  MemorySize?: number;
  Publish?: boolean;
  VpcConfig?: VpcConfig;
  PackageType?: PackageType;
  DeadLetterConfig?: DeadLetterConfig;
  Environment?: Environment;
  KMSKeyArn?: string;
  TracingConfig?: TracingConfig;
  Tags?: { [key: string]: string | undefined };
  Layers?: string[];
  FileSystemConfigs?: FileSystemConfig[];
  ImageConfig?: ImageConfig;
  CodeSigningConfigArn?: string;
  Architectures?: Architecture[];
  EphemeralStorage?: EphemeralStorage;
  SnapStart?: SnapStart;
  LoggingConfig?: LoggingConfig;
  CapacityProviderConfig?: CapacityProviderConfig;
  PublishTo?: FunctionVersionLatestPublished;
  DurableConfig?: DurableConfig;
  TenancyConfig?: TenancyConfig;
}
export const CreateFunctionRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String,
    Runtime: S.optional(Runtime),
    Role: S.String,
    Handler: S.optional(S.String),
    Code: FunctionCode,
    Description: S.optional(S.String),
    Timeout: S.optional(S.Number),
    MemorySize: S.optional(S.Number),
    Publish: S.optional(S.Boolean),
    VpcConfig: S.optional(VpcConfig),
    PackageType: S.optional(PackageType),
    DeadLetterConfig: S.optional(DeadLetterConfig),
    Environment: S.optional(Environment),
    KMSKeyArn: S.optional(S.String),
    TracingConfig: S.optional(TracingConfig),
    Tags: S.optional(Tags),
    Layers: S.optional(LayerList),
    FileSystemConfigs: S.optional(FileSystemConfigList),
    ImageConfig: S.optional(ImageConfig),
    CodeSigningConfigArn: S.optional(S.String),
    Architectures: S.optional(ArchitecturesList),
    EphemeralStorage: S.optional(EphemeralStorage),
    SnapStart: S.optional(SnapStart),
    LoggingConfig: S.optional(LoggingConfig),
    CapacityProviderConfig: S.optional(CapacityProviderConfig),
    PublishTo: S.optional(FunctionVersionLatestPublished),
    DurableConfig: S.optional(DurableConfig),
    TenancyConfig: S.optional(TenancyConfig),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2015-03-31/functions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFunctionRequest",
}) as any as S.Schema<CreateFunctionRequest>;
export interface CreateFunctionUrlConfigResponse {
  FunctionUrl: string;
  FunctionArn: string;
  AuthType: FunctionUrlAuthType;
  Cors?: Cors;
  CreationTime: string;
  InvokeMode?: InvokeMode;
}
export const CreateFunctionUrlConfigResponse = S.suspend(() =>
  S.Struct({
    FunctionUrl: S.String,
    FunctionArn: S.String,
    AuthType: FunctionUrlAuthType,
    Cors: S.optional(Cors),
    CreationTime: S.String,
    InvokeMode: S.optional(InvokeMode),
  }),
).annotations({
  identifier: "CreateFunctionUrlConfigResponse",
}) as any as S.Schema<CreateFunctionUrlConfigResponse>;
export interface ListFunctionUrlConfigsResponse {
  FunctionUrlConfigs: FunctionUrlConfig[];
  NextMarker?: string;
}
export const ListFunctionUrlConfigsResponse = S.suspend(() =>
  S.Struct({
    FunctionUrlConfigs: FunctionUrlConfigList,
    NextMarker: S.optional(S.String),
  }),
).annotations({
  identifier: "ListFunctionUrlConfigsResponse",
}) as any as S.Schema<ListFunctionUrlConfigsResponse>;
export interface ListProvisionedConcurrencyConfigsResponse {
  ProvisionedConcurrencyConfigs?: ProvisionedConcurrencyConfigListItem[];
  NextMarker?: string;
}
export const ListProvisionedConcurrencyConfigsResponse = S.suspend(() =>
  S.Struct({
    ProvisionedConcurrencyConfigs: S.optional(ProvisionedConcurrencyConfigList),
    NextMarker: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProvisionedConcurrencyConfigsResponse",
}) as any as S.Schema<ListProvisionedConcurrencyConfigsResponse>;
export interface GetFunctionResponse {
  Configuration?: FunctionConfiguration;
  Code?: FunctionCodeLocation;
  Tags?: { [key: string]: string | undefined };
  TagsError?: TagsError;
  Concurrency?: Concurrency;
}
export const GetFunctionResponse = S.suspend(() =>
  S.Struct({
    Configuration: S.optional(FunctionConfiguration),
    Code: S.optional(FunctionCodeLocation),
    Tags: S.optional(Tags),
    TagsError: S.optional(TagsError),
    Concurrency: S.optional(Concurrency),
  }),
).annotations({
  identifier: "GetFunctionResponse",
}) as any as S.Schema<GetFunctionResponse>;
export interface PutFunctionScalingConfigResponse {
  FunctionState?: State;
}
export const PutFunctionScalingConfigResponse = S.suspend(() =>
  S.Struct({ FunctionState: S.optional(State) }),
).annotations({
  identifier: "PutFunctionScalingConfigResponse",
}) as any as S.Schema<PutFunctionScalingConfigResponse>;
export interface CreateAliasRequest {
  FunctionName: string;
  Name: string;
  FunctionVersion: string;
  Description?: string;
  RoutingConfig?: AliasRoutingConfiguration;
}
export const CreateAliasRequest = S.suspend(() =>
  S.Struct({
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Name: S.String,
    FunctionVersion: S.String,
    Description: S.optional(S.String),
    RoutingConfig: S.optional(AliasRoutingConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/2015-03-31/functions/{FunctionName}/aliases",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAliasRequest",
}) as any as S.Schema<CreateAliasRequest>;
export interface ListLayersResponse {
  NextMarker?: string;
  Layers?: LayersListItem[];
}
export const ListLayersResponse = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    Layers: S.optional(LayersList),
  }),
).annotations({
  identifier: "ListLayersResponse",
}) as any as S.Schema<ListLayersResponse>;
export interface ListLayerVersionsResponse {
  NextMarker?: string;
  LayerVersions?: LayerVersionsListItem[];
}
export const ListLayerVersionsResponse = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    LayerVersions: S.optional(LayerVersionsList),
  }),
).annotations({
  identifier: "ListLayerVersionsResponse",
}) as any as S.Schema<ListLayerVersionsResponse>;
export interface GetLayerVersionResponse {
  Content?: LayerVersionContentOutput;
  LayerArn?: string;
  LayerVersionArn?: string;
  Description?: string;
  CreatedDate?: string;
  Version?: number;
  CompatibleRuntimes?: Runtime[];
  LicenseInfo?: string;
  CompatibleArchitectures?: Architecture[];
}
export const GetLayerVersionResponse = S.suspend(() =>
  S.Struct({
    Content: S.optional(LayerVersionContentOutput),
    LayerArn: S.optional(S.String),
    LayerVersionArn: S.optional(S.String),
    Description: S.optional(S.String),
    CreatedDate: S.optional(S.String),
    Version: S.optional(S.Number),
    CompatibleRuntimes: S.optional(CompatibleRuntimes),
    LicenseInfo: S.optional(S.String),
    CompatibleArchitectures: S.optional(CompatibleArchitectures),
  }),
).annotations({
  identifier: "GetLayerVersionResponse",
}) as any as S.Schema<GetLayerVersionResponse>;
export interface PublishLayerVersionResponse {
  Content?: LayerVersionContentOutput;
  LayerArn?: string;
  LayerVersionArn?: string;
  Description?: string;
  CreatedDate?: string;
  Version?: number;
  CompatibleRuntimes?: Runtime[];
  LicenseInfo?: string;
  CompatibleArchitectures?: Architecture[];
}
export const PublishLayerVersionResponse = S.suspend(() =>
  S.Struct({
    Content: S.optional(LayerVersionContentOutput),
    LayerArn: S.optional(S.String),
    LayerVersionArn: S.optional(S.String),
    Description: S.optional(S.String),
    CreatedDate: S.optional(S.String),
    Version: S.optional(S.Number),
    CompatibleRuntimes: S.optional(CompatibleRuntimes),
    LicenseInfo: S.optional(S.String),
    CompatibleArchitectures: S.optional(CompatibleArchitectures),
  }),
).annotations({
  identifier: "PublishLayerVersionResponse",
}) as any as S.Schema<PublishLayerVersionResponse>;
export interface EventError {
  Payload?: ErrorObject;
  Truncated?: boolean;
}
export const EventError = S.suspend(() =>
  S.Struct({
    Payload: S.optional(ErrorObject),
    Truncated: S.optional(S.Boolean),
  }),
).annotations({ identifier: "EventError" }) as any as S.Schema<EventError>;
export interface ExecutionTimedOutDetails {
  Error?: EventError;
}
export const ExecutionTimedOutDetails = S.suspend(() =>
  S.Struct({ Error: S.optional(EventError) }),
).annotations({
  identifier: "ExecutionTimedOutDetails",
}) as any as S.Schema<ExecutionTimedOutDetails>;
export interface ExecutionStoppedDetails {
  Error: EventError;
}
export const ExecutionStoppedDetails = S.suspend(() =>
  S.Struct({ Error: EventError }),
).annotations({
  identifier: "ExecutionStoppedDetails",
}) as any as S.Schema<ExecutionStoppedDetails>;
export interface EventResult {
  Payload?: string | redacted.Redacted<string>;
  Truncated?: boolean;
}
export const EventResult = S.suspend(() =>
  S.Struct({
    Payload: S.optional(SensitiveString),
    Truncated: S.optional(S.Boolean),
  }),
).annotations({ identifier: "EventResult" }) as any as S.Schema<EventResult>;
export interface ContextSucceededDetails {
  Result: EventResult;
}
export const ContextSucceededDetails = S.suspend(() =>
  S.Struct({ Result: EventResult }),
).annotations({
  identifier: "ContextSucceededDetails",
}) as any as S.Schema<ContextSucceededDetails>;
export interface ContextFailedDetails {
  Error: EventError;
}
export const ContextFailedDetails = S.suspend(() =>
  S.Struct({ Error: EventError }),
).annotations({
  identifier: "ContextFailedDetails",
}) as any as S.Schema<ContextFailedDetails>;
export interface WaitStartedDetails {
  Duration: number;
  ScheduledEndTimestamp: Date;
}
export const WaitStartedDetails = S.suspend(() =>
  S.Struct({
    Duration: S.Number,
    ScheduledEndTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "WaitStartedDetails",
}) as any as S.Schema<WaitStartedDetails>;
export interface WaitSucceededDetails {
  Duration?: number;
}
export const WaitSucceededDetails = S.suspend(() =>
  S.Struct({ Duration: S.optional(S.Number) }),
).annotations({
  identifier: "WaitSucceededDetails",
}) as any as S.Schema<WaitSucceededDetails>;
export interface WaitCancelledDetails {
  Error?: EventError;
}
export const WaitCancelledDetails = S.suspend(() =>
  S.Struct({ Error: S.optional(EventError) }),
).annotations({
  identifier: "WaitCancelledDetails",
}) as any as S.Schema<WaitCancelledDetails>;
export interface RetryDetails {
  CurrentAttempt?: number;
  NextAttemptDelaySeconds?: number;
}
export const RetryDetails = S.suspend(() =>
  S.Struct({
    CurrentAttempt: S.optional(S.Number),
    NextAttemptDelaySeconds: S.optional(S.Number),
  }),
).annotations({ identifier: "RetryDetails" }) as any as S.Schema<RetryDetails>;
export interface StepFailedDetails {
  Error: EventError;
  RetryDetails: RetryDetails;
}
export const StepFailedDetails = S.suspend(() =>
  S.Struct({ Error: EventError, RetryDetails: RetryDetails }),
).annotations({
  identifier: "StepFailedDetails",
}) as any as S.Schema<StepFailedDetails>;
export interface EventInput {
  Payload?: string | redacted.Redacted<string>;
  Truncated?: boolean;
}
export const EventInput = S.suspend(() =>
  S.Struct({
    Payload: S.optional(SensitiveString),
    Truncated: S.optional(S.Boolean),
  }),
).annotations({ identifier: "EventInput" }) as any as S.Schema<EventInput>;
export interface ChainedInvokeStartedDetails {
  FunctionName: string;
  TenantId?: string;
  Input?: EventInput;
  ExecutedVersion?: string;
  DurableExecutionArn?: string;
}
export const ChainedInvokeStartedDetails = S.suspend(() =>
  S.Struct({
    FunctionName: S.String,
    TenantId: S.optional(S.String),
    Input: S.optional(EventInput),
    ExecutedVersion: S.optional(S.String),
    DurableExecutionArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ChainedInvokeStartedDetails",
}) as any as S.Schema<ChainedInvokeStartedDetails>;
export interface ChainedInvokeSucceededDetails {
  Result: EventResult;
}
export const ChainedInvokeSucceededDetails = S.suspend(() =>
  S.Struct({ Result: EventResult }),
).annotations({
  identifier: "ChainedInvokeSucceededDetails",
}) as any as S.Schema<ChainedInvokeSucceededDetails>;
export interface ChainedInvokeFailedDetails {
  Error: EventError;
}
export const ChainedInvokeFailedDetails = S.suspend(() =>
  S.Struct({ Error: EventError }),
).annotations({
  identifier: "ChainedInvokeFailedDetails",
}) as any as S.Schema<ChainedInvokeFailedDetails>;
export interface ChainedInvokeTimedOutDetails {
  Error: EventError;
}
export const ChainedInvokeTimedOutDetails = S.suspend(() =>
  S.Struct({ Error: EventError }),
).annotations({
  identifier: "ChainedInvokeTimedOutDetails",
}) as any as S.Schema<ChainedInvokeTimedOutDetails>;
export interface ChainedInvokeStoppedDetails {
  Error: EventError;
}
export const ChainedInvokeStoppedDetails = S.suspend(() =>
  S.Struct({ Error: EventError }),
).annotations({
  identifier: "ChainedInvokeStoppedDetails",
}) as any as S.Schema<ChainedInvokeStoppedDetails>;
export interface CallbackStartedDetails {
  CallbackId: string;
  HeartbeatTimeout?: number;
  Timeout?: number;
}
export const CallbackStartedDetails = S.suspend(() =>
  S.Struct({
    CallbackId: S.String,
    HeartbeatTimeout: S.optional(S.Number),
    Timeout: S.optional(S.Number),
  }),
).annotations({
  identifier: "CallbackStartedDetails",
}) as any as S.Schema<CallbackStartedDetails>;
export interface CallbackSucceededDetails {
  Result: EventResult;
}
export const CallbackSucceededDetails = S.suspend(() =>
  S.Struct({ Result: EventResult }),
).annotations({
  identifier: "CallbackSucceededDetails",
}) as any as S.Schema<CallbackSucceededDetails>;
export interface CallbackFailedDetails {
  Error: EventError;
}
export const CallbackFailedDetails = S.suspend(() =>
  S.Struct({ Error: EventError }),
).annotations({
  identifier: "CallbackFailedDetails",
}) as any as S.Schema<CallbackFailedDetails>;
export interface CallbackTimedOutDetails {
  Error: EventError;
}
export const CallbackTimedOutDetails = S.suspend(() =>
  S.Struct({ Error: EventError }),
).annotations({
  identifier: "CallbackTimedOutDetails",
}) as any as S.Schema<CallbackTimedOutDetails>;
export interface InvocationCompletedDetails {
  StartTimestamp: Date;
  EndTimestamp: Date;
  RequestId: string;
  Error?: EventError;
}
export const InvocationCompletedDetails = S.suspend(() =>
  S.Struct({
    StartTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    RequestId: S.String,
    Error: S.optional(EventError),
  }),
).annotations({
  identifier: "InvocationCompletedDetails",
}) as any as S.Schema<InvocationCompletedDetails>;
export interface ExecutionDetails {
  InputPayload?: string | redacted.Redacted<string>;
}
export const ExecutionDetails = S.suspend(() =>
  S.Struct({ InputPayload: S.optional(SensitiveString) }),
).annotations({
  identifier: "ExecutionDetails",
}) as any as S.Schema<ExecutionDetails>;
export interface ContextDetails {
  ReplayChildren?: boolean;
  Result?: string | redacted.Redacted<string>;
  Error?: ErrorObject;
}
export const ContextDetails = S.suspend(() =>
  S.Struct({
    ReplayChildren: S.optional(S.Boolean),
    Result: S.optional(SensitiveString),
    Error: S.optional(ErrorObject),
  }),
).annotations({
  identifier: "ContextDetails",
}) as any as S.Schema<ContextDetails>;
export interface StepDetails {
  Attempt?: number;
  NextAttemptTimestamp?: Date;
  Result?: string | redacted.Redacted<string>;
  Error?: ErrorObject;
}
export const StepDetails = S.suspend(() =>
  S.Struct({
    Attempt: S.optional(S.Number),
    NextAttemptTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Result: S.optional(SensitiveString),
    Error: S.optional(ErrorObject),
  }),
).annotations({ identifier: "StepDetails" }) as any as S.Schema<StepDetails>;
export interface WaitDetails {
  ScheduledEndTimestamp?: Date;
}
export const WaitDetails = S.suspend(() =>
  S.Struct({
    ScheduledEndTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "WaitDetails" }) as any as S.Schema<WaitDetails>;
export interface CallbackDetails {
  CallbackId?: string;
  Result?: string | redacted.Redacted<string>;
  Error?: ErrorObject;
}
export const CallbackDetails = S.suspend(() =>
  S.Struct({
    CallbackId: S.optional(S.String),
    Result: S.optional(SensitiveString),
    Error: S.optional(ErrorObject),
  }),
).annotations({
  identifier: "CallbackDetails",
}) as any as S.Schema<CallbackDetails>;
export interface ChainedInvokeDetails {
  Result?: string | redacted.Redacted<string>;
  Error?: ErrorObject;
}
export const ChainedInvokeDetails = S.suspend(() =>
  S.Struct({
    Result: S.optional(SensitiveString),
    Error: S.optional(ErrorObject),
  }),
).annotations({
  identifier: "ChainedInvokeDetails",
}) as any as S.Schema<ChainedInvokeDetails>;
export interface InvokeResponseStreamUpdate {
  Payload?: Uint8Array | redacted.Redacted<Uint8Array>;
}
export const InvokeResponseStreamUpdate = S.suspend(() =>
  S.Struct({ Payload: S.optional(SensitiveBlob).pipe(T.EventPayload()) }),
).annotations({
  identifier: "InvokeResponseStreamUpdate",
}) as any as S.Schema<InvokeResponseStreamUpdate>;
export interface InvokeWithResponseStreamCompleteEvent {
  ErrorCode?: string;
  ErrorDetails?: string;
  LogResult?: string;
}
export const InvokeWithResponseStreamCompleteEvent = S.suspend(() =>
  S.Struct({
    ErrorCode: S.optional(S.String),
    ErrorDetails: S.optional(S.String),
    LogResult: S.optional(S.String),
  }),
).annotations({
  identifier: "InvokeWithResponseStreamCompleteEvent",
}) as any as S.Schema<InvokeWithResponseStreamCompleteEvent>;
export interface Operation {
  Id: string;
  ParentId?: string;
  Name?: string;
  Type: OperationType;
  SubType?: string;
  StartTimestamp: Date;
  EndTimestamp?: Date;
  Status: OperationStatus;
  ExecutionDetails?: ExecutionDetails;
  ContextDetails?: ContextDetails;
  StepDetails?: StepDetails;
  WaitDetails?: WaitDetails;
  CallbackDetails?: CallbackDetails;
  ChainedInvokeDetails?: ChainedInvokeDetails;
}
export const Operation = S.suspend(() =>
  S.Struct({
    Id: S.String,
    ParentId: S.optional(S.String),
    Name: S.optional(S.String),
    Type: OperationType,
    SubType: S.optional(S.String),
    StartTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: OperationStatus,
    ExecutionDetails: S.optional(ExecutionDetails),
    ContextDetails: S.optional(ContextDetails),
    StepDetails: S.optional(StepDetails),
    WaitDetails: S.optional(WaitDetails),
    CallbackDetails: S.optional(CallbackDetails),
    ChainedInvokeDetails: S.optional(ChainedInvokeDetails),
  }),
).annotations({ identifier: "Operation" }) as any as S.Schema<Operation>;
export type Operations = Operation[];
export const Operations = S.Array(Operation);
export type InvokeWithResponseStreamResponseEvent =
  | { PayloadChunk: InvokeResponseStreamUpdate; InvokeComplete?: never }
  | {
      PayloadChunk?: never;
      InvokeComplete: InvokeWithResponseStreamCompleteEvent;
    };
export const InvokeWithResponseStreamResponseEvent = T.EventStream(
  S.Union(
    S.Struct({ PayloadChunk: InvokeResponseStreamUpdate }),
    S.Struct({ InvokeComplete: InvokeWithResponseStreamCompleteEvent }),
  ),
) as any as S.Schema<
  stream.Stream<InvokeWithResponseStreamResponseEvent, Error, never>
>;
export interface GetDurableExecutionStateResponse {
  Operations: Operation[];
  NextMarker?: string;
}
export const GetDurableExecutionStateResponse = S.suspend(() =>
  S.Struct({ Operations: Operations, NextMarker: S.optional(S.String) }),
).annotations({
  identifier: "GetDurableExecutionStateResponse",
}) as any as S.Schema<GetDurableExecutionStateResponse>;
export interface CreateCapacityProviderResponse {
  CapacityProvider: CapacityProvider;
}
export const CreateCapacityProviderResponse = S.suspend(() =>
  S.Struct({ CapacityProvider: CapacityProvider }),
).annotations({
  identifier: "CreateCapacityProviderResponse",
}) as any as S.Schema<CreateCapacityProviderResponse>;
export interface CreateEventSourceMappingRequest {
  EventSourceArn?: string;
  FunctionName: string;
  Enabled?: boolean;
  BatchSize?: number;
  FilterCriteria?: FilterCriteria;
  MaximumBatchingWindowInSeconds?: number;
  ParallelizationFactor?: number;
  StartingPosition?: EventSourcePosition;
  StartingPositionTimestamp?: Date;
  DestinationConfig?: DestinationConfig;
  MaximumRecordAgeInSeconds?: number;
  BisectBatchOnFunctionError?: boolean;
  MaximumRetryAttempts?: number;
  Tags?: { [key: string]: string | undefined };
  TumblingWindowInSeconds?: number;
  Topics?: string[];
  Queues?: string[];
  SourceAccessConfigurations?: SourceAccessConfiguration[];
  SelfManagedEventSource?: SelfManagedEventSource;
  FunctionResponseTypes?: FunctionResponseType[];
  AmazonManagedKafkaEventSourceConfig?: AmazonManagedKafkaEventSourceConfig;
  SelfManagedKafkaEventSourceConfig?: SelfManagedKafkaEventSourceConfig;
  ScalingConfig?: ScalingConfig;
  DocumentDBEventSourceConfig?: DocumentDBEventSourceConfig;
  KMSKeyArn?: string;
  MetricsConfig?: EventSourceMappingMetricsConfig;
  ProvisionedPollerConfig?: ProvisionedPollerConfig;
}
export const CreateEventSourceMappingRequest = S.suspend(() =>
  S.Struct({
    EventSourceArn: S.optional(S.String),
    FunctionName: S.String,
    Enabled: S.optional(S.Boolean),
    BatchSize: S.optional(S.Number),
    FilterCriteria: S.optional(FilterCriteria),
    MaximumBatchingWindowInSeconds: S.optional(S.Number),
    ParallelizationFactor: S.optional(S.Number),
    StartingPosition: S.optional(EventSourcePosition),
    StartingPositionTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    DestinationConfig: S.optional(DestinationConfig),
    MaximumRecordAgeInSeconds: S.optional(S.Number),
    BisectBatchOnFunctionError: S.optional(S.Boolean),
    MaximumRetryAttempts: S.optional(S.Number),
    Tags: S.optional(Tags),
    TumblingWindowInSeconds: S.optional(S.Number),
    Topics: S.optional(Topics),
    Queues: S.optional(Queues),
    SourceAccessConfigurations: S.optional(SourceAccessConfigurations),
    SelfManagedEventSource: S.optional(SelfManagedEventSource),
    FunctionResponseTypes: S.optional(FunctionResponseTypeList),
    AmazonManagedKafkaEventSourceConfig: S.optional(
      AmazonManagedKafkaEventSourceConfig,
    ),
    SelfManagedKafkaEventSourceConfig: S.optional(
      SelfManagedKafkaEventSourceConfig,
    ),
    ScalingConfig: S.optional(ScalingConfig),
    DocumentDBEventSourceConfig: S.optional(DocumentDBEventSourceConfig),
    KMSKeyArn: S.optional(S.String),
    MetricsConfig: S.optional(EventSourceMappingMetricsConfig),
    ProvisionedPollerConfig: S.optional(ProvisionedPollerConfig),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2015-03-31/event-source-mappings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEventSourceMappingRequest",
}) as any as S.Schema<CreateEventSourceMappingRequest>;
export interface InvokeWithResponseStreamResponse {
  StatusCode?: number;
  ExecutedVersion?: string;
  EventStream?: stream.Stream<
    InvokeWithResponseStreamResponseEvent,
    Error,
    never
  >;
  ResponseStreamContentType?: string;
}
export const InvokeWithResponseStreamResponse = S.suspend(() =>
  S.Struct({
    StatusCode: S.optional(S.Number).pipe(T.HttpResponseCode()),
    ExecutedVersion: S.optional(S.String).pipe(
      T.HttpHeader("X-Amz-Executed-Version"),
    ),
    EventStream: S.optional(InvokeWithResponseStreamResponseEvent).pipe(
      T.HttpPayload(),
    ),
    ResponseStreamContentType: S.optional(S.String).pipe(
      T.HttpHeader("Content-Type"),
    ),
  }),
).annotations({
  identifier: "InvokeWithResponseStreamResponse",
}) as any as S.Schema<InvokeWithResponseStreamResponse>;
export interface ExecutionStartedDetails {
  Input: EventInput;
  ExecutionTimeout: number;
}
export const ExecutionStartedDetails = S.suspend(() =>
  S.Struct({ Input: EventInput, ExecutionTimeout: S.Number }),
).annotations({
  identifier: "ExecutionStartedDetails",
}) as any as S.Schema<ExecutionStartedDetails>;
export interface ExecutionSucceededDetails {
  Result: EventResult;
}
export const ExecutionSucceededDetails = S.suspend(() =>
  S.Struct({ Result: EventResult }),
).annotations({
  identifier: "ExecutionSucceededDetails",
}) as any as S.Schema<ExecutionSucceededDetails>;
export interface ExecutionFailedDetails {
  Error: EventError;
}
export const ExecutionFailedDetails = S.suspend(() =>
  S.Struct({ Error: EventError }),
).annotations({
  identifier: "ExecutionFailedDetails",
}) as any as S.Schema<ExecutionFailedDetails>;
export interface StepSucceededDetails {
  Result: EventResult;
  RetryDetails: RetryDetails;
}
export const StepSucceededDetails = S.suspend(() =>
  S.Struct({ Result: EventResult, RetryDetails: RetryDetails }),
).annotations({
  identifier: "StepSucceededDetails",
}) as any as S.Schema<StepSucceededDetails>;
export interface CheckpointUpdatedExecutionState {
  Operations?: Operation[];
  NextMarker?: string;
}
export const CheckpointUpdatedExecutionState = S.suspend(() =>
  S.Struct({
    Operations: S.optional(Operations),
    NextMarker: S.optional(S.String),
  }),
).annotations({
  identifier: "CheckpointUpdatedExecutionState",
}) as any as S.Schema<CheckpointUpdatedExecutionState>;
export interface Event {
  EventType?: EventType;
  SubType?: string;
  EventId?: number;
  Id?: string;
  Name?: string;
  EventTimestamp?: Date;
  ParentId?: string;
  ExecutionStartedDetails?: ExecutionStartedDetails;
  ExecutionSucceededDetails?: ExecutionSucceededDetails;
  ExecutionFailedDetails?: ExecutionFailedDetails;
  ExecutionTimedOutDetails?: ExecutionTimedOutDetails;
  ExecutionStoppedDetails?: ExecutionStoppedDetails;
  ContextStartedDetails?: ContextStartedDetails;
  ContextSucceededDetails?: ContextSucceededDetails;
  ContextFailedDetails?: ContextFailedDetails;
  WaitStartedDetails?: WaitStartedDetails;
  WaitSucceededDetails?: WaitSucceededDetails;
  WaitCancelledDetails?: WaitCancelledDetails;
  StepStartedDetails?: StepStartedDetails;
  StepSucceededDetails?: StepSucceededDetails;
  StepFailedDetails?: StepFailedDetails;
  ChainedInvokeStartedDetails?: ChainedInvokeStartedDetails;
  ChainedInvokeSucceededDetails?: ChainedInvokeSucceededDetails;
  ChainedInvokeFailedDetails?: ChainedInvokeFailedDetails;
  ChainedInvokeTimedOutDetails?: ChainedInvokeTimedOutDetails;
  ChainedInvokeStoppedDetails?: ChainedInvokeStoppedDetails;
  CallbackStartedDetails?: CallbackStartedDetails;
  CallbackSucceededDetails?: CallbackSucceededDetails;
  CallbackFailedDetails?: CallbackFailedDetails;
  CallbackTimedOutDetails?: CallbackTimedOutDetails;
  InvocationCompletedDetails?: InvocationCompletedDetails;
}
export const Event = S.suspend(() =>
  S.Struct({
    EventType: S.optional(EventType),
    SubType: S.optional(S.String),
    EventId: S.optional(S.Number),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    EventTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ParentId: S.optional(S.String),
    ExecutionStartedDetails: S.optional(ExecutionStartedDetails),
    ExecutionSucceededDetails: S.optional(ExecutionSucceededDetails),
    ExecutionFailedDetails: S.optional(ExecutionFailedDetails),
    ExecutionTimedOutDetails: S.optional(ExecutionTimedOutDetails),
    ExecutionStoppedDetails: S.optional(ExecutionStoppedDetails),
    ContextStartedDetails: S.optional(ContextStartedDetails),
    ContextSucceededDetails: S.optional(ContextSucceededDetails),
    ContextFailedDetails: S.optional(ContextFailedDetails),
    WaitStartedDetails: S.optional(WaitStartedDetails),
    WaitSucceededDetails: S.optional(WaitSucceededDetails),
    WaitCancelledDetails: S.optional(WaitCancelledDetails),
    StepStartedDetails: S.optional(StepStartedDetails),
    StepSucceededDetails: S.optional(StepSucceededDetails),
    StepFailedDetails: S.optional(StepFailedDetails),
    ChainedInvokeStartedDetails: S.optional(ChainedInvokeStartedDetails),
    ChainedInvokeSucceededDetails: S.optional(ChainedInvokeSucceededDetails),
    ChainedInvokeFailedDetails: S.optional(ChainedInvokeFailedDetails),
    ChainedInvokeTimedOutDetails: S.optional(ChainedInvokeTimedOutDetails),
    ChainedInvokeStoppedDetails: S.optional(ChainedInvokeStoppedDetails),
    CallbackStartedDetails: S.optional(CallbackStartedDetails),
    CallbackSucceededDetails: S.optional(CallbackSucceededDetails),
    CallbackFailedDetails: S.optional(CallbackFailedDetails),
    CallbackTimedOutDetails: S.optional(CallbackTimedOutDetails),
    InvocationCompletedDetails: S.optional(InvocationCompletedDetails),
  }),
).annotations({ identifier: "Event" }) as any as S.Schema<Event>;
export type Events = Event[];
export const Events = S.Array(Event);
export interface CheckpointDurableExecutionResponse {
  CheckpointToken?: string;
  NewExecutionState: CheckpointUpdatedExecutionState;
}
export const CheckpointDurableExecutionResponse = S.suspend(() =>
  S.Struct({
    CheckpointToken: S.optional(S.String),
    NewExecutionState: CheckpointUpdatedExecutionState,
  }),
).annotations({
  identifier: "CheckpointDurableExecutionResponse",
}) as any as S.Schema<CheckpointDurableExecutionResponse>;
export interface GetDurableExecutionHistoryResponse {
  Events: Event[];
  NextMarker?: string;
}
export const GetDurableExecutionHistoryResponse = S.suspend(() =>
  S.Struct({ Events: Events, NextMarker: S.optional(S.String) }),
).annotations({
  identifier: "GetDurableExecutionHistoryResponse",
}) as any as S.Schema<GetDurableExecutionHistoryResponse>;

//# Errors
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class CallbackTimeoutException extends S.TaggedError<CallbackTimeoutException>()(
  "CallbackTimeoutException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceConflictException extends S.TaggedError<ResourceConflictException>()(
  "ResourceConflictException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class CodeSigningConfigNotFoundException extends S.TaggedError<CodeSigningConfigNotFoundException>()(
  "CodeSigningConfigNotFoundException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class CodeStorageExceededException extends S.TaggedError<CodeStorageExceededException>()(
  "CodeStorageExceededException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceException extends S.TaggedError<ServiceException>()(
  "ServiceException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class CodeVerificationFailedException extends S.TaggedError<CodeVerificationFailedException>()(
  "CodeVerificationFailedException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class DurableExecutionAlreadyStartedException extends S.TaggedError<DurableExecutionAlreadyStartedException>()(
  "DurableExecutionAlreadyStartedException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InvalidRequestContentException extends S.TaggedError<InvalidRequestContentException>()(
  "InvalidRequestContentException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class FunctionVersionsPerCapacityProviderLimitExceededException extends S.TaggedError<FunctionVersionsPerCapacityProviderLimitExceededException>()(
  "FunctionVersionsPerCapacityProviderLimitExceededException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class PolicyLengthExceededException extends S.TaggedError<PolicyLengthExceededException>()(
  "PolicyLengthExceededException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {
    retryAfterSeconds: S.optional(S.String).pipe(T.HttpHeader("Retry-After")),
    Type: S.optional(S.String),
    message: S.optional(S.String),
    Reason: S.optional(ThrottleReason),
  },
).pipe(C.withThrottlingError) {}
export class ParseError extends S.TaggedError<ParseError>()("ParseError", {}) {}
export class ProvisionedConcurrencyConfigNotFoundException extends S.TaggedError<ProvisionedConcurrencyConfigNotFoundException>()(
  "ProvisionedConcurrencyConfigNotFoundException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class PreconditionFailedException extends S.TaggedError<PreconditionFailedException>()(
  "PreconditionFailedException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
) {}
export class InvalidCodeSignatureException extends S.TaggedError<InvalidCodeSignatureException>()(
  "InvalidCodeSignatureException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class EC2AccessDeniedException extends S.TaggedError<EC2AccessDeniedException>()(
  "EC2AccessDeniedException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InvalidRuntimeException extends S.TaggedError<InvalidRuntimeException>()(
  "InvalidRuntimeException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class CapacityProviderLimitExceededException extends S.TaggedError<CapacityProviderLimitExceededException>()(
  "CapacityProviderLimitExceededException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class EC2ThrottledException extends S.TaggedError<EC2ThrottledException>()(
  "EC2ThrottledException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class EC2UnexpectedException extends S.TaggedError<EC2UnexpectedException>()(
  "EC2UnexpectedException",
  {
    Type: S.optional(S.String),
    Message: S.optional(S.String),
    EC2ErrorCode: S.optional(S.String),
  },
).pipe(C.withServerError) {}
export class EFSIOException extends S.TaggedError<EFSIOException>()(
  "EFSIOException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class EFSMountConnectivityException extends S.TaggedError<EFSMountConnectivityException>()(
  "EFSMountConnectivityException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withTimeoutError) {}
export class EFSMountFailureException extends S.TaggedError<EFSMountFailureException>()(
  "EFSMountFailureException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class EFSMountTimeoutException extends S.TaggedError<EFSMountTimeoutException>()(
  "EFSMountTimeoutException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withTimeoutError) {}
export class ENILimitReachedException extends S.TaggedError<ENILimitReachedException>()(
  "ENILimitReachedException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InvalidSecurityGroupIDException extends S.TaggedError<InvalidSecurityGroupIDException>()(
  "InvalidSecurityGroupIDException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InvalidSubnetIDException extends S.TaggedError<InvalidSubnetIDException>()(
  "InvalidSubnetIDException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InvalidZipFileException extends S.TaggedError<InvalidZipFileException>()(
  "InvalidZipFileException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class KMSAccessDeniedException extends S.TaggedError<KMSAccessDeniedException>()(
  "KMSAccessDeniedException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class KMSDisabledException extends S.TaggedError<KMSDisabledException>()(
  "KMSDisabledException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class KMSInvalidStateException extends S.TaggedError<KMSInvalidStateException>()(
  "KMSInvalidStateException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class KMSNotFoundException extends S.TaggedError<KMSNotFoundException>()(
  "KMSNotFoundException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class NoPublishedVersionException extends S.TaggedError<NoPublishedVersionException>()(
  "NoPublishedVersionException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class RecursiveInvocationException extends S.TaggedError<RecursiveInvocationException>()(
  "RecursiveInvocationException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class RequestTooLargeException extends S.TaggedError<RequestTooLargeException>()(
  "RequestTooLargeException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotReadyException extends S.TaggedError<ResourceNotReadyException>()(
  "ResourceNotReadyException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class SerializedRequestEntityTooLargeException extends S.TaggedError<SerializedRequestEntityTooLargeException>()(
  "SerializedRequestEntityTooLargeException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class SnapStartException extends S.TaggedError<SnapStartException>()(
  "SnapStartException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class SnapStartNotReadyException extends S.TaggedError<SnapStartNotReadyException>()(
  "SnapStartNotReadyException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class SnapStartTimeoutException extends S.TaggedError<SnapStartTimeoutException>()(
  "SnapStartTimeoutException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withTimeoutError) {}
export class SubnetIPAddressLimitReachedException extends S.TaggedError<SubnetIPAddressLimitReachedException>()(
  "SubnetIPAddressLimitReachedException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class UnsupportedMediaTypeException extends S.TaggedError<UnsupportedMediaTypeException>()(
  "UnsupportedMediaTypeException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Creates a code signing configuration. A code signing configuration defines a list of allowed signing profiles and defines the code-signing validation policy (action to be taken if deployment validation checks fail).
 */
export const createCodeSigningConfig: (
  input: CreateCodeSigningConfigRequest,
) => effect.Effect<
  CreateCodeSigningConfigResponse,
  InvalidParameterValueException | ServiceException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCodeSigningConfigRequest,
  output: CreateCodeSigningConfigResponse,
  errors: [InvalidParameterValueException, ServiceException],
}));
/**
 * Returns a list of code signing configurations. A request returns up to 10,000 configurations per call. You can use the `MaxItems` parameter to return fewer configurations per call.
 */
export const listCodeSigningConfigs: {
  (
    input: ListCodeSigningConfigsRequest,
  ): effect.Effect<
    ListCodeSigningConfigsResponse,
    InvalidParameterValueException | ServiceException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCodeSigningConfigsRequest,
  ) => stream.Stream<
    ListCodeSigningConfigsResponse,
    InvalidParameterValueException | ServiceException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCodeSigningConfigsRequest,
  ) => stream.Stream<
    CodeSigningConfig,
    InvalidParameterValueException | ServiceException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCodeSigningConfigsRequest,
  output: ListCodeSigningConfigsResponse,
  errors: [InvalidParameterValueException, ServiceException],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "CodeSigningConfigs",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Deletes a version of an Lambda layer. Deleted versions can no longer be viewed or added to functions. To avoid breaking functions, a copy of the version remains in Lambda until no functions refer to it.
 */
export const deleteLayerVersion: (
  input: DeleteLayerVersionRequest,
) => effect.Effect<
  DeleteLayerVersionResponse,
  ServiceException | TooManyRequestsException | ParseError | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLayerVersionRequest,
  output: DeleteLayerVersionResponse,
  errors: [ServiceException, TooManyRequestsException, ParseError],
}));
/**
 * Returns information about a version of an Lambda layer, with a link to download the layer archive that's valid for 10 minutes.
 */
export const getLayerVersion: (
  input: GetLayerVersionRequest,
) => effect.Effect<
  GetLayerVersionResponse,
  | InvalidParameterValueException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLayerVersionRequest,
  output: GetLayerVersionResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Creates an Lambda layer from a ZIP archive. Each time you call `PublishLayerVersion` with the same layer name, a new version is created.
 *
 * Add layers to your function with CreateFunction or UpdateFunctionConfiguration.
 */
export const publishLayerVersion: (
  input: PublishLayerVersionRequest,
) => effect.Effect<
  PublishLayerVersionResponse,
  | CodeStorageExceededException
  | InvalidParameterValueException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PublishLayerVersionRequest,
  output: PublishLayerVersionResponse,
  errors: [
    CodeStorageExceededException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Retrieves the provisioned concurrency configuration for a function's alias or version.
 */
export const getProvisionedConcurrencyConfig: (
  input: GetProvisionedConcurrencyConfigRequest,
) => effect.Effect<
  GetProvisionedConcurrencyConfigResponse,
  | InvalidParameterValueException
  | ProvisionedConcurrencyConfigNotFoundException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProvisionedConcurrencyConfigRequest,
  output: GetProvisionedConcurrencyConfigResponse,
  errors: [
    InvalidParameterValueException,
    ProvisionedConcurrencyConfigNotFoundException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Updates an event source mapping. You can change the function that Lambda invokes, or pause invocation and resume later from the same location.
 *
 * For details about how to configure different event sources, see the following topics.
 *
 * - Amazon DynamoDB Streams
 *
 * - Amazon Kinesis
 *
 * - Amazon SQS
 *
 * - Amazon MQ and RabbitMQ
 *
 * - Amazon MSK
 *
 * - Apache Kafka
 *
 * - Amazon DocumentDB
 *
 * The following error handling options are available for stream sources (DynamoDB, Kinesis, Amazon MSK, and self-managed Apache Kafka):
 *
 * - `BisectBatchOnFunctionError` – If the function returns an error, split the batch in two and retry.
 *
 * - `MaximumRecordAgeInSeconds` – Discard records older than the specified age. The default value is infinite (-1). When set to infinite (-1), failed records are retried until the record expires
 *
 * - `MaximumRetryAttempts` – Discard records after the specified number of retries. The default value is infinite (-1). When set to infinite (-1), failed records are retried until the record expires.
 *
 * - `OnFailure` – Send discarded records to an Amazon SQS queue, Amazon SNS topic, Kafka topic, or Amazon S3 bucket. For more information, see Adding a destination.
 *
 * The following option is available only for DynamoDB and Kinesis event sources:
 *
 * - `ParallelizationFactor` – Process multiple batches from each shard concurrently.
 *
 * For information about which configuration parameters apply to each event source, see the following topics.
 *
 * - Amazon DynamoDB Streams
 *
 * - Amazon Kinesis
 *
 * - Amazon SQS
 *
 * - Amazon MQ and RabbitMQ
 *
 * - Amazon MSK
 *
 * - Apache Kafka
 *
 * - Amazon DocumentDB
 */
export const updateEventSourceMapping: (
  input: UpdateEventSourceMappingRequest,
) => effect.Effect<
  EventSourceMappingConfiguration,
  | InvalidParameterValueException
  | ResourceConflictException
  | ResourceInUseException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEventSourceMappingRequest,
  output: EventSourceMappingConfiguration,
  errors: [
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Updates the configuration of a Lambda function alias.
 */
export const updateAlias: (
  input: UpdateAliasRequest,
) => effect.Effect<
  AliasConfiguration,
  | InvalidParameterValueException
  | PreconditionFailedException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAliasRequest,
  output: AliasConfiguration,
  errors: [
    InvalidParameterValueException,
    PreconditionFailedException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Retrieves a list of configurations for asynchronous invocation for a function.
 *
 * To configure options for asynchronous invocation, use PutFunctionEventInvokeConfig.
 */
export const listFunctionEventInvokeConfigs: {
  (
    input: ListFunctionEventInvokeConfigsRequest,
  ): effect.Effect<
    ListFunctionEventInvokeConfigsResponse,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | ParseError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFunctionEventInvokeConfigsRequest,
  ) => stream.Stream<
    ListFunctionEventInvokeConfigsResponse,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | ParseError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFunctionEventInvokeConfigsRequest,
  ) => stream.Stream<
    FunctionEventInvokeConfig,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | ParseError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFunctionEventInvokeConfigsRequest,
  output: ListFunctionEventInvokeConfigsResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "FunctionEventInvokeConfigs",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Returns a function, event source mapping, or code signing configuration's tags. You can also view function tags with GetFunction.
 */
export const listTags: (
  input: ListTagsRequest,
) => effect.Effect<
  ListTagsResponse,
  | InvalidParameterValueException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsRequest,
  output: ListTagsResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Stops a running durable execution. The execution transitions to STOPPED status and cannot be resumed. Any in-progress operations are terminated.
 */
export const stopDurableExecution: (
  input: StopDurableExecutionRequest,
) => effect.Effect<
  StopDurableExecutionResponse,
  | InvalidParameterValueException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopDurableExecutionRequest,
  output: StopDurableExecutionResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Returns information about the specified code signing configuration.
 */
export const getCodeSigningConfig: (
  input: GetCodeSigningConfigRequest,
) => effect.Effect<
  GetCodeSigningConfigResponse,
  | InvalidParameterValueException
  | ResourceNotFoundException
  | ServiceException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCodeSigningConfigRequest,
  output: GetCodeSigningConfigResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    ParseError,
  ],
}));
/**
 * List the functions that use the specified code signing configuration. You can use this method prior to deleting a code signing configuration, to verify that no functions are using it.
 */
export const listFunctionsByCodeSigningConfig: {
  (
    input: ListFunctionsByCodeSigningConfigRequest,
  ): effect.Effect<
    ListFunctionsByCodeSigningConfigResponse,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFunctionsByCodeSigningConfigRequest,
  ) => stream.Stream<
    ListFunctionsByCodeSigningConfigResponse,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFunctionsByCodeSigningConfigRequest,
  ) => stream.Stream<
    FunctionArn,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFunctionsByCodeSigningConfigRequest,
  output: ListFunctionsByCodeSigningConfigResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "FunctionArns",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Update the code signing configuration. Changes to the code signing configuration take effect the next time a user tries to deploy a code package to the function.
 */
export const updateCodeSigningConfig: (
  input: UpdateCodeSigningConfigRequest,
) => effect.Effect<
  UpdateCodeSigningConfigResponse,
  | InvalidParameterValueException
  | ResourceNotFoundException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCodeSigningConfigRequest,
  output: UpdateCodeSigningConfigResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
  ],
}));
/**
 * Lists event source mappings. Specify an `EventSourceArn` to show only event source mappings for a single event source.
 */
export const listEventSourceMappings: {
  (
    input: ListEventSourceMappingsRequest,
  ): effect.Effect<
    ListEventSourceMappingsResponse,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEventSourceMappingsRequest,
  ) => stream.Stream<
    ListEventSourceMappingsResponse,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEventSourceMappingsRequest,
  ) => stream.Stream<
    EventSourceMappingConfiguration,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEventSourceMappingsRequest,
  output: ListEventSourceMappingsResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "EventSourceMappings",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Deletes a Lambda function URL. When you delete a function URL, you can't recover it. Creating a new function URL results in a different URL address.
 */
export const deleteFunctionUrlConfig: (
  input: DeleteFunctionUrlConfigRequest,
) => effect.Effect<
  DeleteFunctionUrlConfigResponse,
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFunctionUrlConfigRequest,
  output: DeleteFunctionUrlConfigResponse,
  errors: [
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Returns details about the reserved concurrency configuration for a function. To set a concurrency limit for a function, use PutFunctionConcurrency.
 */
export const getFunctionConcurrency: (
  input: GetFunctionConcurrencyRequest,
) => effect.Effect<
  GetFunctionConcurrencyResponse,
  | InvalidParameterValueException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFunctionConcurrencyRequest,
  output: GetFunctionConcurrencyResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Returns details about a Lambda function URL.
 */
export const getFunctionUrlConfig: (
  input: GetFunctionUrlConfigRequest,
) => effect.Effect<
  GetFunctionUrlConfigResponse,
  | InvalidParameterValueException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFunctionUrlConfigRequest,
  output: GetFunctionUrlConfigResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Sets the maximum number of simultaneous executions for a function, and reserves capacity for that concurrency level.
 *
 * Concurrency settings apply to the function as a whole, including all published versions and the unpublished version. Reserving concurrency both ensures that your function has capacity to process the specified number of events simultaneously, and prevents it from scaling beyond that level. Use GetFunction to see the current setting for a function.
 *
 * Use GetAccountSettings to see your Regional concurrency limit. You can reserve concurrency for as many functions as you like, as long as you leave at least 100 simultaneous executions unreserved for functions that aren't configured with a per-function limit. For more information, see Lambda function scaling.
 */
export const putFunctionConcurrency: (
  input: PutFunctionConcurrencyRequest,
) => effect.Effect<
  Concurrency,
  | InvalidParameterValueException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutFunctionConcurrencyRequest,
  output: Concurrency,
  errors: [
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Updates the configuration for a Lambda function URL.
 */
export const updateFunctionUrlConfig: (
  input: UpdateFunctionUrlConfigRequest,
) => effect.Effect<
  UpdateFunctionUrlConfigResponse,
  | InvalidParameterValueException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFunctionUrlConfigRequest,
  output: UpdateFunctionUrlConfigResponse,
  errors: [
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Returns the code signing configuration for the specified function.
 */
export const getFunctionCodeSigningConfig: (
  input: GetFunctionCodeSigningConfigRequest,
) => effect.Effect<
  GetFunctionCodeSigningConfigResponse,
  | InvalidParameterValueException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFunctionCodeSigningConfigRequest,
  output: GetFunctionCodeSigningConfigResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Returns your function's recursive loop detection configuration.
 */
export const getFunctionRecursionConfig: (
  input: GetFunctionRecursionConfigRequest,
) => effect.Effect<
  GetFunctionRecursionConfigResponse,
  | InvalidParameterValueException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFunctionRecursionConfigRequest,
  output: GetFunctionRecursionConfigResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Retrieves the scaling configuration for a Lambda Managed Instances function.
 */
export const getFunctionScalingConfig: (
  input: GetFunctionScalingConfigRequest,
) => effect.Effect<
  GetFunctionScalingConfigResponse,
  | InvalidParameterValueException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFunctionScalingConfigRequest,
  output: GetFunctionScalingConfigResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Returns the resource-based IAM policy for a function, version, or alias.
 */
export const getPolicy: (
  input: GetPolicyRequest,
) => effect.Effect<
  GetPolicyResponse,
  | InvalidParameterValueException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyRequest,
  output: GetPolicyResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the runtime management configuration for a function's version. If the runtime update mode is **Manual**, this includes the ARN of the runtime version and the runtime update mode. If the runtime update mode is **Auto** or **Function update**, this includes the runtime update mode and `null` is returned for the ARN. For more information, see Runtime updates.
 */
export const getRuntimeManagementConfig: (
  input: GetRuntimeManagementConfigRequest,
) => effect.Effect<
  GetRuntimeManagementConfigResponse,
  | InvalidParameterValueException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRuntimeManagementConfigRequest,
  output: GetRuntimeManagementConfigResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Update the code signing configuration for the function. Changes to the code signing configuration take effect the next time a user tries to deploy a code package to the function.
 */
export const putFunctionCodeSigningConfig: (
  input: PutFunctionCodeSigningConfigRequest,
) => effect.Effect<
  PutFunctionCodeSigningConfigResponse,
  | CodeSigningConfigNotFoundException
  | InvalidParameterValueException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutFunctionCodeSigningConfigRequest,
  output: PutFunctionCodeSigningConfigResponse,
  errors: [
    CodeSigningConfigNotFoundException,
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Sets your function's recursive loop detection configuration.
 *
 * When you configure a Lambda function to output to the same service or resource that invokes the function, it's possible to create an infinite recursive loop. For example, a Lambda function might write a message to an Amazon Simple Queue Service (Amazon SQS) queue, which then invokes the same function. This invocation causes the function to write another message to the queue, which in turn invokes the function again.
 *
 * Lambda can detect certain types of recursive loops shortly after they occur. When Lambda detects a recursive loop and your function's recursive loop detection configuration is set to `Terminate`, it stops your function being invoked and notifies you.
 */
export const putFunctionRecursionConfig: (
  input: PutFunctionRecursionConfigRequest,
) => effect.Effect<
  PutFunctionRecursionConfigResponse,
  | InvalidParameterValueException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutFunctionRecursionConfigRequest,
  output: PutFunctionRecursionConfigResponse,
  errors: [
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Sets the runtime management configuration for a function's version. For more information, see Runtime updates.
 */
export const putRuntimeManagementConfig: (
  input: PutRuntimeManagementConfigRequest,
) => effect.Effect<
  PutRuntimeManagementConfigResponse,
  | InvalidParameterValueException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRuntimeManagementConfigRequest,
  output: PutRuntimeManagementConfigResponse,
  errors: [
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Returns details about a Lambda function alias.
 */
export const getAlias: (
  input: GetAliasRequest,
) => effect.Effect<
  AliasConfiguration,
  | InvalidParameterValueException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAliasRequest,
  output: AliasConfiguration,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Returns a list of aliases for a Lambda function.
 */
export const listAliases: {
  (
    input: ListAliasesRequest,
  ): effect.Effect<
    ListAliasesResponse,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAliasesRequest,
  ) => stream.Stream<
    ListAliasesResponse,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAliasesRequest,
  ) => stream.Stream<
    AliasConfiguration,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAliasesRequest,
  output: ListAliasesResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "Aliases",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Returns a list of versions, with the version-specific configuration of each. Lambda returns up to 50 versions per call.
 */
export const listVersionsByFunction: {
  (
    input: ListVersionsByFunctionRequest,
  ): effect.Effect<
    ListVersionsByFunctionResponse,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListVersionsByFunctionRequest,
  ) => stream.Stream<
    ListVersionsByFunctionResponse,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListVersionsByFunctionRequest,
  ) => stream.Stream<
    FunctionConfiguration,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListVersionsByFunctionRequest,
  output: ListVersionsByFunctionResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "Versions",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Returns the permission policy for a version of an Lambda layer. For more information, see AddLayerVersionPermission.
 */
export const getLayerVersionPolicy: (
  input: GetLayerVersionPolicyRequest,
) => effect.Effect<
  GetLayerVersionPolicyResponse,
  | InvalidParameterValueException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLayerVersionPolicyRequest,
  output: GetLayerVersionPolicyResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Adds a provisioned concurrency configuration to a function's alias or version.
 */
export const putProvisionedConcurrencyConfig: (
  input: PutProvisionedConcurrencyConfigRequest,
) => effect.Effect<
  PutProvisionedConcurrencyConfigResponse,
  | InvalidParameterValueException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutProvisionedConcurrencyConfigRequest,
  output: PutProvisionedConcurrencyConfigResponse,
  errors: [
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Removes tags from a function, event source mapping, or code signing configuration.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InvalidParameterValueException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Updates the configuration for asynchronous invocation for a function, version, or alias.
 *
 * To configure options for asynchronous invocation, use PutFunctionEventInvokeConfig.
 */
export const updateFunctionEventInvokeConfig: (
  input: UpdateFunctionEventInvokeConfigRequest,
) => effect.Effect<
  FunctionEventInvokeConfig,
  | InvalidParameterValueException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFunctionEventInvokeConfigRequest,
  output: FunctionEventInvokeConfig,
  errors: [
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes the code signing configuration. You can delete the code signing configuration only if no function is using it.
 */
export const deleteCodeSigningConfig: (
  input: DeleteCodeSigningConfigRequest,
) => effect.Effect<
  DeleteCodeSigningConfigResponse,
  | InvalidParameterValueException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCodeSigningConfigRequest,
  output: DeleteCodeSigningConfigResponse,
  errors: [
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    ParseError,
  ],
}));
/**
 * Removes a concurrent execution limit from a function.
 */
export const deleteFunctionConcurrency: (
  input: DeleteFunctionConcurrencyRequest,
) => effect.Effect<
  DeleteFunctionConcurrencyResponse,
  | InvalidParameterValueException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFunctionConcurrencyRequest,
  output: DeleteFunctionConcurrencyResponse,
  errors: [
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Returns the version-specific settings of a Lambda function or version. The output includes only options that can vary between versions of a function. To modify these settings, use UpdateFunctionConfiguration.
 *
 * To get all of a function's details, including function-level settings, use GetFunction.
 */
export const getFunctionConfiguration: (
  input: GetFunctionConfigurationRequest,
) => effect.Effect<
  FunctionConfiguration,
  | InvalidParameterValueException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFunctionConfigurationRequest,
  output: FunctionConfiguration,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Returns information about a version of an Lambda layer, with a link to download the layer archive that's valid for 10 minutes.
 */
export const getLayerVersionByArn: (
  input: GetLayerVersionByArnRequest,
) => effect.Effect<
  GetLayerVersionResponse,
  | InvalidParameterValueException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLayerVersionByArnRequest,
  output: GetLayerVersionResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes the provisioned concurrency configuration for a function.
 */
export const deleteProvisionedConcurrencyConfig: (
  input: DeleteProvisionedConcurrencyConfigRequest,
) => effect.Effect<
  DeleteProvisionedConcurrencyConfigResponse,
  | InvalidParameterValueException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProvisionedConcurrencyConfigRequest,
  output: DeleteProvisionedConcurrencyConfigResponse,
  errors: [
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Deletes a Lambda function. To delete a specific function version, use the `Qualifier` parameter. Otherwise, all versions and aliases are deleted. This doesn't require the user to have explicit permissions for DeleteAlias.
 *
 * A deleted Lambda function cannot be recovered. Ensure that you specify the correct function name and version before deleting.
 *
 * To delete Lambda event source mappings that invoke a function, use DeleteEventSourceMapping. For Amazon Web Services services and resources that invoke your function directly, delete the trigger in the service where you originally configured it.
 */
export const deleteFunction: (
  input: DeleteFunctionRequest,
) => effect.Effect<
  DeleteFunctionResponse,
  | InvalidParameterValueException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFunctionRequest,
  output: DeleteFunctionResponse,
  errors: [
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes the configuration for asynchronous invocation for a function, version, or alias.
 *
 * To configure options for asynchronous invocation, use PutFunctionEventInvokeConfig.
 */
export const deleteFunctionEventInvokeConfig: (
  input: DeleteFunctionEventInvokeConfigRequest,
) => effect.Effect<
  DeleteFunctionEventInvokeConfigResponse,
  | InvalidParameterValueException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFunctionEventInvokeConfigRequest,
  output: DeleteFunctionEventInvokeConfigResponse,
  errors: [
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Adds tags to a function, event source mapping, or code signing configuration.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InvalidParameterValueException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Updates the configuration of an existing capacity provider.
 */
export const updateCapacityProvider: (
  input: UpdateCapacityProviderRequest,
) => effect.Effect<
  UpdateCapacityProviderResponse,
  | InvalidParameterValueException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCapacityProviderRequest,
  output: UpdateCapacityProviderResponse,
  errors: [
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a capacity provider. You cannot delete a capacity provider that is currently being used by Lambda functions.
 */
export const deleteCapacityProvider: (
  input: DeleteCapacityProviderRequest,
) => effect.Effect<
  DeleteCapacityProviderResponse,
  | InvalidParameterValueException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCapacityProviderRequest,
  output: DeleteCapacityProviderResponse,
  errors: [
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Removes the code signing configuration from the function.
 */
export const deleteFunctionCodeSigningConfig: (
  input: DeleteFunctionCodeSigningConfigRequest,
) => effect.Effect<
  DeleteFunctionCodeSigningConfigResponse,
  | CodeSigningConfigNotFoundException
  | InvalidParameterValueException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFunctionCodeSigningConfigRequest,
  output: DeleteFunctionCodeSigningConfigResponse,
  errors: [
    CodeSigningConfigNotFoundException,
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves detailed information about a specific durable execution, including its current status, input payload, result or error information, and execution metadata such as start time and usage statistics.
 */
export const getDurableExecution: (
  input: GetDurableExecutionRequest,
) => effect.Effect<
  GetDurableExecutionResponse,
  | InvalidParameterValueException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDurableExecutionRequest,
  output: GetDurableExecutionResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Grants a principal permission to use a function. You can apply the policy at the function level, or specify a qualifier to restrict access to a single version or alias. If you use a qualifier, the invoker must use the full Amazon Resource Name (ARN) of that version or alias to invoke the function. Note: Lambda does not support adding policies to version $LATEST.
 *
 * To grant permission to another account, specify the account ID as the `Principal`. To grant permission to an organization defined in Organizations, specify the organization ID as the `PrincipalOrgID`. For Amazon Web Services services, the principal is a domain-style identifier that the service defines, such as `s3.amazonaws.com` or `sns.amazonaws.com`. For Amazon Web Services services, you can also specify the ARN of the associated resource as the `SourceArn`. If you grant permission to a service principal without specifying the source, other accounts could potentially configure resources in their account to invoke your Lambda function.
 *
 * This operation adds a statement to a resource-based permissions policy for the function. For more information about function policies, see Using resource-based policies for Lambda.
 */
export const addPermission: (
  input: AddPermissionRequest,
) => effect.Effect<
  AddPermissionResponse,
  | InvalidParameterValueException
  | PolicyLengthExceededException
  | PreconditionFailedException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddPermissionRequest,
  output: AddPermissionResponse,
  errors: [
    InvalidParameterValueException,
    PolicyLengthExceededException,
    PreconditionFailedException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Deletes a Lambda function alias.
 */
export const deleteAlias: (
  input: DeleteAliasRequest,
) => effect.Effect<
  DeleteAliasResponse,
  | InvalidParameterValueException
  | ResourceConflictException
  | ServiceException
  | TooManyRequestsException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAliasRequest,
  output: DeleteAliasResponse,
  errors: [
    InvalidParameterValueException,
    ResourceConflictException,
    ServiceException,
    TooManyRequestsException,
    ResourceNotFoundException,
  ],
}));
/**
 * Sends a successful completion response for a callback operation in a durable execution. Use this API when an external system has successfully completed a callback operation.
 */
export const sendDurableExecutionCallbackSuccess: (
  input: SendDurableExecutionCallbackSuccessRequest,
) => effect.Effect<
  SendDurableExecutionCallbackSuccessResponse,
  | CallbackTimeoutException
  | InvalidParameterValueException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendDurableExecutionCallbackSuccessRequest,
  output: SendDurableExecutionCallbackSuccessResponse,
  errors: [
    CallbackTimeoutException,
    InvalidParameterValueException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Sends a failure response for a callback operation in a durable execution. Use this API when an external system cannot complete a callback operation successfully.
 */
export const sendDurableExecutionCallbackFailure: (
  input: SendDurableExecutionCallbackFailureRequest,
) => effect.Effect<
  SendDurableExecutionCallbackFailureResponse,
  | CallbackTimeoutException
  | InvalidParameterValueException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendDurableExecutionCallbackFailureRequest,
  output: SendDurableExecutionCallbackFailureResponse,
  errors: [
    CallbackTimeoutException,
    InvalidParameterValueException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves details about your account's limits and usage in an Amazon Web Services Region.
 */
export const getAccountSettings: (
  input: GetAccountSettingsRequest,
) => effect.Effect<
  GetAccountSettingsResponse,
  ServiceException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountSettingsRequest,
  output: GetAccountSettingsResponse,
  errors: [ServiceException, TooManyRequestsException],
}));
/**
 * Sends a heartbeat signal for a long-running callback operation to prevent timeout. Use this API to extend the callback timeout period while the external operation is still in progress.
 */
export const sendDurableExecutionCallbackHeartbeat: (
  input: SendDurableExecutionCallbackHeartbeatRequest,
) => effect.Effect<
  SendDurableExecutionCallbackHeartbeatResponse,
  | CallbackTimeoutException
  | InvalidParameterValueException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendDurableExecutionCallbackHeartbeatRequest,
  output: SendDurableExecutionCallbackHeartbeatResponse,
  errors: [
    CallbackTimeoutException,
    InvalidParameterValueException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Returns a list of capacity providers in your account.
 */
export const listCapacityProviders: {
  (
    input: ListCapacityProvidersRequest,
  ): effect.Effect<
    ListCapacityProvidersResponse,
    | InvalidParameterValueException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCapacityProvidersRequest,
  ) => stream.Stream<
    ListCapacityProvidersResponse,
    | InvalidParameterValueException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCapacityProvidersRequest,
  ) => stream.Stream<
    CapacityProvider,
    | InvalidParameterValueException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCapacityProvidersRequest,
  output: ListCapacityProvidersResponse,
  errors: [
    InvalidParameterValueException,
    ServiceException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "CapacityProviders",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Returns a list of Lambda functions, with the version-specific configuration of each. Lambda returns up to 50 functions per call.
 *
 * Set `FunctionVersion` to `ALL` to include all published versions of each function in addition to the unpublished version.
 *
 * The `ListFunctions` operation returns a subset of the FunctionConfiguration fields. To get the additional fields (State, StateReasonCode, StateReason, LastUpdateStatus, LastUpdateStatusReason, LastUpdateStatusReasonCode, RuntimeVersionConfig) for a function or version, use GetFunction.
 */
export const listFunctions: {
  (
    input: ListFunctionsRequest,
  ): effect.Effect<
    ListFunctionsResponse,
    | InvalidParameterValueException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFunctionsRequest,
  ) => stream.Stream<
    ListFunctionsResponse,
    | InvalidParameterValueException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFunctionsRequest,
  ) => stream.Stream<
    FunctionConfiguration,
    | InvalidParameterValueException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFunctionsRequest,
  output: ListFunctionsResponse,
  errors: [
    InvalidParameterValueException,
    ServiceException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "Functions",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Retrieves the configuration for asynchronous invocation for a function, version, or alias.
 *
 * To configure options for asynchronous invocation, use PutFunctionEventInvokeConfig.
 */
export const getFunctionEventInvokeConfig: (
  input: GetFunctionEventInvokeConfigRequest,
) => effect.Effect<
  FunctionEventInvokeConfig,
  | InvalidParameterValueException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFunctionEventInvokeConfigRequest,
  output: FunctionEventInvokeConfig,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Returns a list of durable executions for a specified Lambda function. You can filter the results by execution name, status, and start time range. This API supports pagination for large result sets.
 */
export const listDurableExecutionsByFunction: {
  (
    input: ListDurableExecutionsByFunctionRequest,
  ): effect.Effect<
    ListDurableExecutionsByFunctionResponse,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDurableExecutionsByFunctionRequest,
  ) => stream.Stream<
    ListDurableExecutionsByFunctionResponse,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDurableExecutionsByFunctionRequest,
  ) => stream.Stream<
    Execution,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDurableExecutionsByFunctionRequest,
  output: ListDurableExecutionsByFunctionResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "DurableExecutions",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Configures options for asynchronous invocation on a function, version, or alias. If a configuration already exists for a function, version, or alias, this operation overwrites it. If you exclude any settings, they are removed. To set one option without affecting existing settings for other options, use UpdateFunctionEventInvokeConfig.
 *
 * By default, Lambda retries an asynchronous invocation twice if the function returns an error. It retains events in a queue for up to six hours. When an event fails all processing attempts or stays in the asynchronous invocation queue for too long, Lambda discards it. To retain discarded events, configure a dead-letter queue with UpdateFunctionConfiguration.
 *
 * To send an invocation record to a queue, topic, S3 bucket, function, or event bus, specify a destination. You can configure separate destinations for successful invocations (on-success) and events that fail all processing attempts (on-failure). You can configure destinations in addition to or instead of a dead-letter queue.
 *
 * S3 buckets are supported only for on-failure destinations. To retain records of successful invocations, use another destination type.
 */
export const putFunctionEventInvokeConfig: (
  input: PutFunctionEventInvokeConfigRequest,
) => effect.Effect<
  FunctionEventInvokeConfig,
  | InvalidParameterValueException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutFunctionEventInvokeConfigRequest,
  output: FunctionEventInvokeConfig,
  errors: [
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Retrieves information about a specific capacity provider, including its configuration, state, and associated resources.
 */
export const getCapacityProvider: (
  input: GetCapacityProviderRequest,
) => effect.Effect<
  GetCapacityProviderResponse,
  | InvalidParameterValueException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCapacityProviderRequest,
  output: GetCapacityProviderResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Returns a list of function versions that are configured to use a specific capacity provider.
 */
export const listFunctionVersionsByCapacityProvider: {
  (
    input: ListFunctionVersionsByCapacityProviderRequest,
  ): effect.Effect<
    ListFunctionVersionsByCapacityProviderResponse,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFunctionVersionsByCapacityProviderRequest,
  ) => stream.Stream<
    ListFunctionVersionsByCapacityProviderResponse,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFunctionVersionsByCapacityProviderRequest,
  ) => stream.Stream<
    FunctionVersionsByCapacityProviderListItem,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFunctionVersionsByCapacityProviderRequest,
  output: ListFunctionVersionsByCapacityProviderResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "FunctionVersions",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Returns details about an event source mapping. You can get the identifier of a mapping from the output of ListEventSourceMappings.
 */
export const getEventSourceMapping: (
  input: GetEventSourceMappingRequest,
) => effect.Effect<
  EventSourceMappingConfiguration,
  | InvalidParameterValueException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEventSourceMappingRequest,
  output: EventSourceMappingConfiguration,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a Lambda function URL with the specified configuration parameters. A function URL is a dedicated HTTP(S) endpoint that you can use to invoke your function.
 */
export const createFunctionUrlConfig: (
  input: CreateFunctionUrlConfigRequest,
) => effect.Effect<
  CreateFunctionUrlConfigResponse,
  | InvalidParameterValueException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFunctionUrlConfigRequest,
  output: CreateFunctionUrlConfigResponse,
  errors: [
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Returns a list of Lambda function URLs for the specified function.
 */
export const listFunctionUrlConfigs: {
  (
    input: ListFunctionUrlConfigsRequest,
  ): effect.Effect<
    ListFunctionUrlConfigsResponse,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFunctionUrlConfigsRequest,
  ) => stream.Stream<
    ListFunctionUrlConfigsResponse,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFunctionUrlConfigsRequest,
  ) => stream.Stream<
    FunctionUrlConfig,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFunctionUrlConfigsRequest,
  output: ListFunctionUrlConfigsResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "FunctionUrlConfigs",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Retrieves a list of provisioned concurrency configurations for a function.
 */
export const listProvisionedConcurrencyConfigs: {
  (
    input: ListProvisionedConcurrencyConfigsRequest,
  ): effect.Effect<
    ListProvisionedConcurrencyConfigsResponse,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | ParseError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProvisionedConcurrencyConfigsRequest,
  ) => stream.Stream<
    ListProvisionedConcurrencyConfigsResponse,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | ParseError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProvisionedConcurrencyConfigsRequest,
  ) => stream.Stream<
    ProvisionedConcurrencyConfigListItem,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | ParseError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProvisionedConcurrencyConfigsRequest,
  output: ListProvisionedConcurrencyConfigsResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "ProvisionedConcurrencyConfigs",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Returns information about the function or function version, with a link to download the deployment package that's valid for 10 minutes. If you specify a function version, only details that are specific to that version are returned.
 */
export const getFunction: (
  input: GetFunctionRequest,
) => effect.Effect<
  GetFunctionResponse,
  | InvalidParameterValueException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFunctionRequest,
  output: GetFunctionResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Sets the scaling configuration for a Lambda Managed Instances function. The scaling configuration defines the minimum and maximum number of execution environments that can be provisioned for the function, allowing you to control scaling behavior and resource allocation.
 */
export const putFunctionScalingConfig: (
  input: PutFunctionScalingConfigRequest,
) => effect.Effect<
  PutFunctionScalingConfigResponse,
  | InvalidParameterValueException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutFunctionScalingConfigRequest,
  output: PutFunctionScalingConfigResponse,
  errors: [
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates an alias for a Lambda function version. Use aliases to provide clients with a function identifier that you can update to invoke a different version.
 *
 * You can also map an alias to split invocation requests between two versions. Use the `RoutingConfig` parameter to specify a second version and the percentage of invocation requests that it receives.
 */
export const createAlias: (
  input: CreateAliasRequest,
) => effect.Effect<
  AliasConfiguration,
  | InvalidParameterValueException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAliasRequest,
  output: AliasConfiguration,
  errors: [
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Lists Lambda layers and shows information about the latest version of each. Specify a runtime identifier to list only layers that indicate that they're compatible with that runtime. Specify a compatible architecture to include only layers that are compatible with that instruction set architecture.
 */
export const listLayers: {
  (
    input: ListLayersRequest,
  ): effect.Effect<
    ListLayersResponse,
    | InvalidParameterValueException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLayersRequest,
  ) => stream.Stream<
    ListLayersResponse,
    | InvalidParameterValueException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLayersRequest,
  ) => stream.Stream<
    LayersListItem,
    | InvalidParameterValueException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLayersRequest,
  output: ListLayersResponse,
  errors: [
    InvalidParameterValueException,
    ServiceException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "Layers",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists the versions of an Lambda layer. Versions that have been deleted aren't listed. Specify a runtime identifier to list only versions that indicate that they're compatible with that runtime. Specify a compatible architecture to include only layer versions that are compatible with that architecture.
 */
export const listLayerVersions: {
  (
    input: ListLayerVersionsRequest,
  ): effect.Effect<
    ListLayerVersionsResponse,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | ParseError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLayerVersionsRequest,
  ) => stream.Stream<
    ListLayerVersionsResponse,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | ParseError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLayerVersionsRequest,
  ) => stream.Stream<
    LayerVersionsListItem,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | ParseError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLayerVersionsRequest,
  output: ListLayerVersionsResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "LayerVersions",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Deletes an event source mapping. You can get the identifier of a mapping from the output of ListEventSourceMappings.
 *
 * When you delete an event source mapping, it enters a `Deleting` state and might not be completely deleted for several seconds.
 */
export const deleteEventSourceMapping: (
  input: DeleteEventSourceMappingRequest,
) => effect.Effect<
  EventSourceMappingConfiguration,
  | InvalidParameterValueException
  | ResourceConflictException
  | ResourceInUseException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventSourceMappingRequest,
  output: EventSourceMappingConfiguration,
  errors: [
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Removes a statement from the permissions policy for a version of an Lambda layer. For more information, see AddLayerVersionPermission.
 */
export const removeLayerVersionPermission: (
  input: RemoveLayerVersionPermissionRequest,
) => effect.Effect<
  RemoveLayerVersionPermissionResponse,
  | InvalidParameterValueException
  | PreconditionFailedException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveLayerVersionPermissionRequest,
  output: RemoveLayerVersionPermissionResponse,
  errors: [
    InvalidParameterValueException,
    PreconditionFailedException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Revokes function-use permission from an Amazon Web Services service or another Amazon Web Services account. You can get the ID of the statement from the output of GetPolicy.
 */
export const removePermission: (
  input: RemovePermissionRequest,
) => effect.Effect<
  RemovePermissionResponse,
  | InvalidParameterValueException
  | PreconditionFailedException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemovePermissionRequest,
  output: RemovePermissionResponse,
  errors: [
    InvalidParameterValueException,
    PreconditionFailedException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a version from the current code and configuration of a function. Use versions to create a snapshot of your function code and configuration that doesn't change.
 *
 * Lambda doesn't publish a version if the function's configuration and code haven't changed since the last version. Use UpdateFunctionCode or UpdateFunctionConfiguration to update the function before publishing a version.
 *
 * Clients can invoke versions directly or with an alias. To create an alias, use CreateAlias.
 */
export const publishVersion: (
  input: PublishVersionRequest,
) => effect.Effect<
  FunctionConfiguration,
  | CodeStorageExceededException
  | FunctionVersionsPerCapacityProviderLimitExceededException
  | InvalidParameterValueException
  | PreconditionFailedException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PublishVersionRequest,
  output: FunctionConfiguration,
  errors: [
    CodeStorageExceededException,
    FunctionVersionsPerCapacityProviderLimitExceededException,
    InvalidParameterValueException,
    PreconditionFailedException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Adds permissions to the resource-based policy of a version of an Lambda layer. Use this action to grant layer usage permission to other accounts. You can grant permission to a single account, all accounts in an organization, or all Amazon Web Services accounts.
 *
 * To revoke permission, call RemoveLayerVersionPermission with the statement ID that you specified when you added it.
 */
export const addLayerVersionPermission: (
  input: AddLayerVersionPermissionRequest,
) => effect.Effect<
  AddLayerVersionPermissionResponse,
  | InvalidParameterValueException
  | PolicyLengthExceededException
  | PreconditionFailedException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddLayerVersionPermissionRequest,
  output: AddLayerVersionPermissionResponse,
  errors: [
    InvalidParameterValueException,
    PolicyLengthExceededException,
    PreconditionFailedException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Retrieves the current execution state required for the replay process during durable function execution. This API is used by the Lambda durable functions SDK to get state information needed for replay. You typically don't need to call this API directly as the SDK handles state management automatically.
 *
 * The response contains operations ordered by start sequence number in ascending order. Completed operations with children don't include child operation details since they don't need to be replayed.
 */
export const getDurableExecutionState: {
  (
    input: GetDurableExecutionStateRequest,
  ): effect.Effect<
    GetDurableExecutionStateResponse,
    | InvalidParameterValueException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetDurableExecutionStateRequest,
  ) => stream.Stream<
    GetDurableExecutionStateResponse,
    | InvalidParameterValueException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetDurableExecutionStateRequest,
  ) => stream.Stream<
    Operation,
    | InvalidParameterValueException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetDurableExecutionStateRequest,
  output: GetDurableExecutionStateResponse,
  errors: [
    InvalidParameterValueException,
    ServiceException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "Operations",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Creates a mapping between an event source and an Lambda function. Lambda reads items from the event source and invokes the function.
 *
 * For details about how to configure different event sources, see the following topics.
 *
 * - Amazon DynamoDB Streams
 *
 * - Amazon Kinesis
 *
 * - Amazon SQS
 *
 * - Amazon MQ and RabbitMQ
 *
 * - Amazon MSK
 *
 * - Apache Kafka
 *
 * - Amazon DocumentDB
 *
 * The following error handling options are available for stream sources (DynamoDB, Kinesis, Amazon MSK, and self-managed Apache Kafka):
 *
 * - `BisectBatchOnFunctionError` – If the function returns an error, split the batch in two and retry.
 *
 * - `MaximumRecordAgeInSeconds` – Discard records older than the specified age. The default value is infinite (-1). When set to infinite (-1), failed records are retried until the record expires
 *
 * - `MaximumRetryAttempts` – Discard records after the specified number of retries. The default value is infinite (-1). When set to infinite (-1), failed records are retried until the record expires.
 *
 * - `OnFailure` – Send discarded records to an Amazon SQS queue, Amazon SNS topic, Kafka topic, or Amazon S3 bucket. For more information, see Adding a destination.
 *
 * The following option is available only for DynamoDB and Kinesis event sources:
 *
 * - `ParallelizationFactor` – Process multiple batches from each shard concurrently.
 *
 * For information about which configuration parameters apply to each event source, see the following topics.
 *
 * - Amazon DynamoDB Streams
 *
 * - Amazon Kinesis
 *
 * - Amazon SQS
 *
 * - Amazon MQ and RabbitMQ
 *
 * - Amazon MSK
 *
 * - Apache Kafka
 *
 * - Amazon DocumentDB
 */
export const createEventSourceMapping: (
  input: CreateEventSourceMappingRequest,
) => effect.Effect<
  EventSourceMappingConfiguration,
  | InvalidParameterValueException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ResourceInUseException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEventSourceMappingRequest,
  output: EventSourceMappingConfiguration,
  errors: [
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ResourceInUseException,
  ],
}));
/**
 * Modify the version-specific settings of a Lambda function.
 *
 * When you update a function, Lambda provisions an instance of the function and its supporting resources. If your function connects to a VPC, this process can take a minute. During this time, you can't modify the function, but you can still invoke it. The `LastUpdateStatus`, `LastUpdateStatusReason`, and `LastUpdateStatusReasonCode` fields in the response from GetFunctionConfiguration indicate when the update is complete and the function is processing events with the new configuration. For more information, see Lambda function states.
 *
 * These settings can vary between versions of a function and are locked when you publish a version. You can't modify the configuration of a published version, only the unpublished version.
 *
 * To configure function concurrency, use PutFunctionConcurrency. To grant invoke permissions to an Amazon Web Services account or Amazon Web Services service, use AddPermission.
 */
export const updateFunctionConfiguration: (
  input: UpdateFunctionConfigurationRequest,
) => effect.Effect<
  FunctionConfiguration,
  | CodeSigningConfigNotFoundException
  | CodeVerificationFailedException
  | InvalidCodeSignatureException
  | InvalidParameterValueException
  | PreconditionFailedException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFunctionConfigurationRequest,
  output: FunctionConfiguration,
  errors: [
    CodeSigningConfigNotFoundException,
    CodeVerificationFailedException,
    InvalidCodeSignatureException,
    InvalidParameterValueException,
    PreconditionFailedException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * For asynchronous function invocation, use Invoke.
 *
 * Invokes a function asynchronously.
 *
 * The payload limit is 256KB. For larger payloads, for up to 1MB, use Invoke.
 *
 * If you do use the InvokeAsync action, note that it doesn't support the use of X-Ray active tracing. Trace ID is not propagated to the function, even if X-Ray active tracing is turned on.
 */
export const invokeAsync: (
  input: InvokeAsyncRequest,
) => effect.Effect<
  InvokeAsyncResponse,
  | InvalidRequestContentException
  | InvalidRuntimeException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InvokeAsyncRequest,
  output: InvokeAsyncResponse,
  errors: [
    InvalidRequestContentException,
    InvalidRuntimeException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
  ],
}));
/**
 * Creates a Lambda function. To create a function, you need a deployment package and an execution role. The deployment package is a .zip file archive or container image that contains your function code. The execution role grants the function permission to use Amazon Web Services services, such as Amazon CloudWatch Logs for log streaming and X-Ray for request tracing.
 *
 * If the deployment package is a container image, then you set the package type to `Image`. For a container image, the code property must include the URI of a container image in the Amazon ECR registry. You do not need to specify the handler and runtime properties.
 *
 * If the deployment package is a .zip file archive, then you set the package type to `Zip`. For a .zip file archive, the code property specifies the location of the .zip file. You must also specify the handler and runtime properties. The code in the deployment package must be compatible with the target instruction set architecture of the function (`x86-64` or `arm64`). If you do not specify the architecture, then the default value is `x86-64`.
 *
 * When you create a function, Lambda provisions an instance of the function and its supporting resources. If your function connects to a VPC, this process can take a minute or so. During this time, you can't invoke or modify the function. The `State`, `StateReason`, and `StateReasonCode` fields in the response from GetFunctionConfiguration indicate when the function is ready to invoke. For more information, see Lambda function states.
 *
 * A function has an unpublished version, and can have published versions and aliases. The unpublished version changes when you update your function's code and configuration. A published version is a snapshot of your function code and configuration that can't be changed. An alias is a named resource that maps to a version, and can be changed to map to a different version. Use the `Publish` parameter to create version `1` of your function from its initial configuration.
 *
 * The other parameters let you configure version-specific and function-level settings. You can modify version-specific settings later with UpdateFunctionConfiguration. Function-level settings apply to both the unpublished and published versions of the function, and include tags (TagResource) and per-function concurrency limits (PutFunctionConcurrency).
 *
 * You can use code signing if your deployment package is a .zip file archive. To enable code signing for this function, specify the ARN of a code-signing configuration. When a user attempts to deploy a code package with UpdateFunctionCode, Lambda checks that the code package has a valid signature from a trusted publisher. The code-signing configuration includes set of signing profiles, which define the trusted publishers for this function.
 *
 * If another Amazon Web Services account or an Amazon Web Services service invokes your function, use AddPermission to grant permission by creating a resource-based Identity and Access Management (IAM) policy. You can grant permissions at the function level, on a version, or on an alias.
 *
 * To invoke your function directly, use Invoke. To invoke your function in response to events in other Amazon Web Services services, create an event source mapping (CreateEventSourceMapping), or configure a function trigger in the other service. For more information, see Invoking Lambda functions.
 */
export const createFunction: (
  input: CreateFunctionRequest,
) => effect.Effect<
  FunctionConfiguration,
  | CodeSigningConfigNotFoundException
  | CodeStorageExceededException
  | CodeVerificationFailedException
  | FunctionVersionsPerCapacityProviderLimitExceededException
  | InvalidCodeSignatureException
  | InvalidParameterValueException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFunctionRequest,
  output: FunctionConfiguration,
  errors: [
    CodeSigningConfigNotFoundException,
    CodeStorageExceededException,
    CodeVerificationFailedException,
    FunctionVersionsPerCapacityProviderLimitExceededException,
    InvalidCodeSignatureException,
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates a Lambda function's code. If code signing is enabled for the function, the code package must be signed by a trusted publisher. For more information, see Configuring code signing for Lambda.
 *
 * If the function's package type is `Image`, then you must specify the code package in `ImageUri` as the URI of a container image in the Amazon ECR registry.
 *
 * If the function's package type is `Zip`, then you must specify the deployment package as a .zip file archive. Enter the Amazon S3 bucket and key of the code .zip file location. You can also provide the function code inline using the `ZipFile` field.
 *
 * The code in the deployment package must be compatible with the target instruction set architecture of the function (`x86-64` or `arm64`).
 *
 * The function's code is locked when you publish a version. You can't modify the code of a published version, only the unpublished version.
 *
 * For a function defined as a container image, Lambda resolves the image tag to an image digest. In Amazon ECR, if you update the image tag to a new image, Lambda does not automatically update the function.
 */
export const updateFunctionCode: (
  input: UpdateFunctionCodeRequest,
) => effect.Effect<
  FunctionConfiguration,
  | CodeSigningConfigNotFoundException
  | CodeStorageExceededException
  | CodeVerificationFailedException
  | InvalidCodeSignatureException
  | InvalidParameterValueException
  | PreconditionFailedException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceException
  | TooManyRequestsException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFunctionCodeRequest,
  output: FunctionConfiguration,
  errors: [
    CodeSigningConfigNotFoundException,
    CodeStorageExceededException,
    CodeVerificationFailedException,
    InvalidCodeSignatureException,
    InvalidParameterValueException,
    PreconditionFailedException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
    ParseError,
  ],
}));
/**
 * Saves the progress of a durable function execution during runtime. This API is used by the Lambda durable functions SDK to checkpoint completed steps and schedule asynchronous operations. You typically don't need to call this API directly as the SDK handles checkpointing automatically.
 *
 * Each checkpoint operation consumes the current checkpoint token and returns a new one for the next checkpoint. This ensures that checkpoints are applied in the correct order and prevents duplicate or out-of-order state updates.
 */
export const checkpointDurableExecution: (
  input: CheckpointDurableExecutionRequest,
) => effect.Effect<
  CheckpointDurableExecutionResponse,
  | InvalidParameterValueException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CheckpointDurableExecutionRequest,
  output: CheckpointDurableExecutionResponse,
  errors: [
    InvalidParameterValueException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the execution history for a durable execution, showing all the steps, callbacks, and events that occurred during the execution. This provides a detailed audit trail of the execution's progress over time.
 *
 * The history is available while the execution is running and for a retention period after it completes (1-90 days, default 30 days). You can control whether to include execution data such as step results and callback payloads.
 */
export const getDurableExecutionHistory: {
  (
    input: GetDurableExecutionHistoryRequest,
  ): effect.Effect<
    GetDurableExecutionHistoryResponse,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetDurableExecutionHistoryRequest,
  ) => stream.Stream<
    GetDurableExecutionHistoryResponse,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetDurableExecutionHistoryRequest,
  ) => stream.Stream<
    Event,
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetDurableExecutionHistoryRequest,
  output: GetDurableExecutionHistoryResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "Events",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Creates a capacity provider that manages compute resources for Lambda functions
 */
export const createCapacityProvider: (
  input: CreateCapacityProviderRequest,
) => effect.Effect<
  CreateCapacityProviderResponse,
  | CapacityProviderLimitExceededException
  | InvalidParameterValueException
  | ResourceConflictException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCapacityProviderRequest,
  output: CreateCapacityProviderResponse,
  errors: [
    CapacityProviderLimitExceededException,
    InvalidParameterValueException,
    ResourceConflictException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Invokes a Lambda function. You can invoke a function synchronously (and wait for the response), or asynchronously. By default, Lambda invokes your function synchronously (i.e. the`InvocationType` is `RequestResponse`). To invoke a function asynchronously, set `InvocationType` to `Event`. Lambda passes the `ClientContext` object to your function for synchronous invocations only.
 *
 * For synchronous invocations, the maximum payload size is 6 MB. For asynchronous invocations, the maximum payload size is 1 MB.
 *
 * For synchronous invocation, details about the function response, including errors, are included in the response body and headers. For either invocation type, you can find more information in the execution log and trace.
 *
 * When an error occurs, your function may be invoked multiple times. Retry behavior varies by error type, client, event source, and invocation type. For example, if you invoke a function asynchronously and it returns an error, Lambda executes the function up to two more times. For more information, see Error handling and automatic retries in Lambda.
 *
 * For asynchronous invocation, Lambda adds events to a queue before sending them to your function. If your function does not have enough capacity to keep up with the queue, events may be lost. Occasionally, your function may receive the same event multiple times, even if no error occurs. To retain events that were not processed, configure your function with a dead-letter queue.
 *
 * The status code in the API response doesn't reflect function errors. Error codes are reserved for errors that prevent your function from executing, such as permissions errors, quota errors, or issues with your function's code and configuration. For example, Lambda returns `TooManyRequestsException` if running the function would cause you to exceed a concurrency limit at either the account level (`ConcurrentInvocationLimitExceeded`) or function level (`ReservedFunctionConcurrentInvocationLimitExceeded`).
 *
 * For functions with a long timeout, your client might disconnect during synchronous invocation while it waits for a response. Configure your HTTP client, SDK, firewall, proxy, or operating system to allow for long connections with timeout or keep-alive settings.
 *
 * This operation requires permission for the lambda:InvokeFunction action. For details on how to set up permissions for cross-account invocations, see Granting function access to other accounts.
 */
export const invoke: (
  input: InvocationRequest,
) => effect.Effect<
  InvocationResponse,
  | DurableExecutionAlreadyStartedException
  | EC2AccessDeniedException
  | EC2ThrottledException
  | EC2UnexpectedException
  | EFSIOException
  | EFSMountConnectivityException
  | EFSMountFailureException
  | EFSMountTimeoutException
  | ENILimitReachedException
  | InvalidParameterValueException
  | InvalidRequestContentException
  | InvalidRuntimeException
  | InvalidSecurityGroupIDException
  | InvalidSubnetIDException
  | InvalidZipFileException
  | KMSAccessDeniedException
  | KMSDisabledException
  | KMSInvalidStateException
  | KMSNotFoundException
  | NoPublishedVersionException
  | RecursiveInvocationException
  | RequestTooLargeException
  | ResourceConflictException
  | ResourceNotFoundException
  | ResourceNotReadyException
  | SerializedRequestEntityTooLargeException
  | ServiceException
  | SnapStartException
  | SnapStartNotReadyException
  | SnapStartTimeoutException
  | SubnetIPAddressLimitReachedException
  | TooManyRequestsException
  | UnsupportedMediaTypeException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InvocationRequest,
  output: InvocationResponse,
  errors: [
    DurableExecutionAlreadyStartedException,
    EC2AccessDeniedException,
    EC2ThrottledException,
    EC2UnexpectedException,
    EFSIOException,
    EFSMountConnectivityException,
    EFSMountFailureException,
    EFSMountTimeoutException,
    ENILimitReachedException,
    InvalidParameterValueException,
    InvalidRequestContentException,
    InvalidRuntimeException,
    InvalidSecurityGroupIDException,
    InvalidSubnetIDException,
    InvalidZipFileException,
    KMSAccessDeniedException,
    KMSDisabledException,
    KMSInvalidStateException,
    KMSNotFoundException,
    NoPublishedVersionException,
    RecursiveInvocationException,
    RequestTooLargeException,
    ResourceConflictException,
    ResourceNotFoundException,
    ResourceNotReadyException,
    SerializedRequestEntityTooLargeException,
    ServiceException,
    SnapStartException,
    SnapStartNotReadyException,
    SnapStartTimeoutException,
    SubnetIPAddressLimitReachedException,
    TooManyRequestsException,
    UnsupportedMediaTypeException,
    ParseError,
  ],
}));
/**
 * Configure your Lambda functions to stream response payloads back to clients. For more information, see Configuring a Lambda function to stream responses.
 *
 * This operation requires permission for the lambda:InvokeFunction action. For details on how to set up permissions for cross-account invocations, see Granting function access to other accounts.
 */
export const invokeWithResponseStream: (
  input: InvokeWithResponseStreamRequest,
) => effect.Effect<
  InvokeWithResponseStreamResponse,
  | EC2AccessDeniedException
  | EC2ThrottledException
  | EC2UnexpectedException
  | EFSIOException
  | EFSMountConnectivityException
  | EFSMountFailureException
  | EFSMountTimeoutException
  | ENILimitReachedException
  | InvalidParameterValueException
  | InvalidRequestContentException
  | InvalidRuntimeException
  | InvalidSecurityGroupIDException
  | InvalidSubnetIDException
  | InvalidZipFileException
  | KMSAccessDeniedException
  | KMSDisabledException
  | KMSInvalidStateException
  | KMSNotFoundException
  | NoPublishedVersionException
  | RecursiveInvocationException
  | RequestTooLargeException
  | ResourceConflictException
  | ResourceNotFoundException
  | ResourceNotReadyException
  | SerializedRequestEntityTooLargeException
  | ServiceException
  | SnapStartException
  | SnapStartNotReadyException
  | SnapStartTimeoutException
  | SubnetIPAddressLimitReachedException
  | TooManyRequestsException
  | UnsupportedMediaTypeException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InvokeWithResponseStreamRequest,
  output: InvokeWithResponseStreamResponse,
  errors: [
    EC2AccessDeniedException,
    EC2ThrottledException,
    EC2UnexpectedException,
    EFSIOException,
    EFSMountConnectivityException,
    EFSMountFailureException,
    EFSMountTimeoutException,
    ENILimitReachedException,
    InvalidParameterValueException,
    InvalidRequestContentException,
    InvalidRuntimeException,
    InvalidSecurityGroupIDException,
    InvalidSubnetIDException,
    InvalidZipFileException,
    KMSAccessDeniedException,
    KMSDisabledException,
    KMSInvalidStateException,
    KMSNotFoundException,
    NoPublishedVersionException,
    RecursiveInvocationException,
    RequestTooLargeException,
    ResourceConflictException,
    ResourceNotFoundException,
    ResourceNotReadyException,
    SerializedRequestEntityTooLargeException,
    ServiceException,
    SnapStartException,
    SnapStartNotReadyException,
    SnapStartTimeoutException,
    SubnetIPAddressLimitReachedException,
    TooManyRequestsException,
    UnsupportedMediaTypeException,
  ],
}));
