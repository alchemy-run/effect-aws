import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Lambda",
  serviceShapeName: "AWSGirApiService",
});
const auth = T.AwsAuthSigv4({ name: "lambda" });
const ver = T.ServiceVersion("2015-03-31");
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
          conditions: [
            { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
          ],
          error:
            "Invalid Configuration: Dualstack and custom endpoint are not supported",
          type: "error",
        },
        {
          conditions: [],
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
          type: "endpoint",
        },
      ],
      type: "tree",
    },
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
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
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
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
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
                        url: "https://lambda-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
                        },
                        true,
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://lambda-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
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
                        url: "https://lambda.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://lambda.{Region}.{PartitionResult#dnsSuffix}",
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
});

//# Schemas
export class GetAccountSettingsRequest extends S.Class<GetAccountSettingsRequest>(
  "GetAccountSettingsRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/2016-08-19/account-settings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ExecutionStatusList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class DeleteFunctionRequest extends S.Class<DeleteFunctionRequest>(
  "DeleteFunctionRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel()),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/2015-03-31/functions/{FunctionName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFunctionEventInvokeConfigRequest extends S.Class<DeleteFunctionEventInvokeConfigRequest>(
  "DeleteFunctionEventInvokeConfigRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel()),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
  },
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
) {}
export class DeleteFunctionEventInvokeConfigResponse extends S.Class<DeleteFunctionEventInvokeConfigResponse>(
  "DeleteFunctionEventInvokeConfigResponse",
)({}) {}
export class GetDurableExecutionRequest extends S.Class<GetDurableExecutionRequest>(
  "GetDurableExecutionRequest",
)(
  { DurableExecutionArn: S.String.pipe(T.HttpLabel()) },
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
) {}
export class GetDurableExecutionHistoryRequest extends S.Class<GetDurableExecutionHistoryRequest>(
  "GetDurableExecutionHistoryRequest",
)(
  {
    DurableExecutionArn: S.String.pipe(T.HttpLabel()),
    IncludeExecutionData: S.optional(S.Boolean).pipe(
      T.HttpQuery("IncludeExecutionData"),
    ),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    ReverseOrder: S.optional(S.Boolean).pipe(T.HttpQuery("ReverseOrder")),
  },
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
) {}
export class GetDurableExecutionStateRequest extends S.Class<GetDurableExecutionStateRequest>(
  "GetDurableExecutionStateRequest",
)(
  {
    DurableExecutionArn: S.String.pipe(T.HttpLabel()),
    CheckpointToken: S.String.pipe(T.HttpQuery("CheckpointToken")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
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
) {}
export class GetFunctionEventInvokeConfigRequest extends S.Class<GetFunctionEventInvokeConfigRequest>(
  "GetFunctionEventInvokeConfigRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel()),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
  },
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
) {}
export class ListDurableExecutionsByFunctionRequest extends S.Class<ListDurableExecutionsByFunctionRequest>(
  "ListDurableExecutionsByFunctionRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel()),
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
  },
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
) {}
export class ListFunctionEventInvokeConfigsRequest extends S.Class<ListFunctionEventInvokeConfigsRequest>(
  "ListFunctionEventInvokeConfigsRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel()),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
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
) {}
export class ListTagsRequest extends S.Class<ListTagsRequest>(
  "ListTagsRequest",
)(
  { Resource: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/2017-03-31/tags/{Resource}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendDurableExecutionCallbackHeartbeatRequest extends S.Class<SendDurableExecutionCallbackHeartbeatRequest>(
  "SendDurableExecutionCallbackHeartbeatRequest",
)(
  { CallbackId: S.String.pipe(T.HttpLabel()) },
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
) {}
export class SendDurableExecutionCallbackHeartbeatResponse extends S.Class<SendDurableExecutionCallbackHeartbeatResponse>(
  "SendDurableExecutionCallbackHeartbeatResponse",
)({}) {}
export class SendDurableExecutionCallbackSuccessRequest extends S.Class<SendDurableExecutionCallbackSuccessRequest>(
  "SendDurableExecutionCallbackSuccessRequest",
)(
  {
    CallbackId: S.String.pipe(T.HttpLabel()),
    Result: S.optional(T.StreamingInput).pipe(T.HttpPayload()),
  },
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
) {}
export class SendDurableExecutionCallbackSuccessResponse extends S.Class<SendDurableExecutionCallbackSuccessResponse>(
  "SendDurableExecutionCallbackSuccessResponse",
)({}) {}
export const StackTraceEntries = S.Array(S.String);
export class ErrorObject extends S.Class<ErrorObject>("ErrorObject")({
  ErrorMessage: S.optional(S.String),
  ErrorType: S.optional(S.String),
  ErrorData: S.optional(S.String),
  StackTrace: S.optional(StackTraceEntries),
}) {}
export class StopDurableExecutionRequest extends S.Class<StopDurableExecutionRequest>(
  "StopDurableExecutionRequest",
)(
  {
    DurableExecutionArn: S.String.pipe(T.HttpLabel()),
    Error: S.optional(ErrorObject).pipe(T.HttpPayload()),
  },
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
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    Resource: S.String.pipe(T.HttpLabel()),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/2017-03-31/tags/{Resource}" }),
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
export class OnSuccess extends S.Class<OnSuccess>("OnSuccess")({
  Destination: S.optional(S.String),
}) {}
export class OnFailure extends S.Class<OnFailure>("OnFailure")({
  Destination: S.optional(S.String),
}) {}
export class DestinationConfig extends S.Class<DestinationConfig>(
  "DestinationConfig",
)({ OnSuccess: S.optional(OnSuccess), OnFailure: S.optional(OnFailure) }) {}
export class UpdateFunctionEventInvokeConfigRequest extends S.Class<UpdateFunctionEventInvokeConfigRequest>(
  "UpdateFunctionEventInvokeConfigRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel()),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
    MaximumRetryAttempts: S.optional(S.Number),
    MaximumEventAgeInSeconds: S.optional(S.Number),
    DestinationConfig: S.optional(DestinationConfig),
  },
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
) {}
export class AccountLimit extends S.Class<AccountLimit>("AccountLimit")({
  TotalCodeSize: S.optional(S.Number),
  CodeSizeUnzipped: S.optional(S.Number),
  CodeSizeZipped: S.optional(S.Number),
  ConcurrentExecutions: S.optional(S.Number),
  UnreservedConcurrentExecutions: S.optional(S.Number),
}) {}
export class AccountUsage extends S.Class<AccountUsage>("AccountUsage")({
  TotalCodeSize: S.optional(S.Number),
  FunctionCount: S.optional(S.Number),
}) {}
export class FunctionEventInvokeConfig extends S.Class<FunctionEventInvokeConfig>(
  "FunctionEventInvokeConfig",
)({
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FunctionArn: S.optional(S.String),
  MaximumRetryAttempts: S.optional(S.Number),
  MaximumEventAgeInSeconds: S.optional(S.Number),
  DestinationConfig: S.optional(DestinationConfig),
}) {}
export const FunctionEventInvokeConfigList = S.Array(FunctionEventInvokeConfig);
export const Tags = S.Record({ key: S.String, value: S.String });
export class DeleteFunctionResponse extends S.Class<DeleteFunctionResponse>(
  "DeleteFunctionResponse",
)({ StatusCode: S.optional(S.Number).pipe(T.HttpResponseCode()) }) {}
export class GetAccountSettingsResponse extends S.Class<GetAccountSettingsResponse>(
  "GetAccountSettingsResponse",
)({
  AccountLimit: S.optional(AccountLimit),
  AccountUsage: S.optional(AccountUsage),
}) {}
export class ListFunctionEventInvokeConfigsResponse extends S.Class<ListFunctionEventInvokeConfigsResponse>(
  "ListFunctionEventInvokeConfigsResponse",
)({
  FunctionEventInvokeConfigs: S.optional(FunctionEventInvokeConfigList),
  NextMarker: S.optional(S.String),
}) {}
export class ListTagsResponse extends S.Class<ListTagsResponse>(
  "ListTagsResponse",
)({ Tags: S.optional(Tags) }) {}
export class SendDurableExecutionCallbackFailureRequest extends S.Class<SendDurableExecutionCallbackFailureRequest>(
  "SendDurableExecutionCallbackFailureRequest",
)(
  {
    CallbackId: S.String.pipe(T.HttpLabel()),
    Error: S.optional(ErrorObject).pipe(T.HttpPayload()),
  },
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
) {}
export class SendDurableExecutionCallbackFailureResponse extends S.Class<SendDurableExecutionCallbackFailureResponse>(
  "SendDurableExecutionCallbackFailureResponse",
)({}) {}
export class StopDurableExecutionResponse extends S.Class<StopDurableExecutionResponse>(
  "StopDurableExecutionResponse",
)({ StopTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { Resource: S.String.pipe(T.HttpLabel()), Tags: Tags },
  T.all(
    T.Http({ method: "POST", uri: "/2017-03-31/tags/{Resource}" }),
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
export class ContextOptions extends S.Class<ContextOptions>("ContextOptions")({
  ReplayChildren: S.optional(S.Boolean),
}) {}
export class StepOptions extends S.Class<StepOptions>("StepOptions")({
  NextAttemptDelaySeconds: S.optional(S.Number),
}) {}
export class WaitOptions extends S.Class<WaitOptions>("WaitOptions")({
  WaitSeconds: S.optional(S.Number),
}) {}
export class CallbackOptions extends S.Class<CallbackOptions>(
  "CallbackOptions",
)({
  TimeoutSeconds: S.optional(S.Number),
  HeartbeatTimeoutSeconds: S.optional(S.Number),
}) {}
export class ChainedInvokeOptions extends S.Class<ChainedInvokeOptions>(
  "ChainedInvokeOptions",
)({ FunctionName: S.String, TenantId: S.optional(S.String) }) {}
export class ContextStartedDetails extends S.Class<ContextStartedDetails>(
  "ContextStartedDetails",
)({}) {}
export class StepStartedDetails extends S.Class<StepStartedDetails>(
  "StepStartedDetails",
)({}) {}
export class OperationUpdate extends S.Class<OperationUpdate>(
  "OperationUpdate",
)({
  Id: S.String,
  ParentId: S.optional(S.String),
  Name: S.optional(S.String),
  Type: S.String,
  SubType: S.optional(S.String),
  Action: S.String,
  Payload: S.optional(S.String),
  Error: S.optional(ErrorObject),
  ContextOptions: S.optional(ContextOptions),
  StepOptions: S.optional(StepOptions),
  WaitOptions: S.optional(WaitOptions),
  CallbackOptions: S.optional(CallbackOptions),
  ChainedInvokeOptions: S.optional(ChainedInvokeOptions),
}) {}
export const OperationUpdates = S.Array(OperationUpdate);
export class TraceHeader extends S.Class<TraceHeader>("TraceHeader")({
  XAmznTraceId: S.optional(S.String),
}) {}
export class Execution extends S.Class<Execution>("Execution")({
  DurableExecutionArn: S.String,
  DurableExecutionName: S.String,
  FunctionArn: S.String,
  Status: S.String,
  StartTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const DurableExecutions = S.Array(Execution);
export class CheckpointDurableExecutionRequest extends S.Class<CheckpointDurableExecutionRequest>(
  "CheckpointDurableExecutionRequest",
)(
  {
    DurableExecutionArn: S.String.pipe(T.HttpLabel()),
    CheckpointToken: S.String,
    Updates: S.optional(OperationUpdates),
    ClientToken: S.optional(S.String),
  },
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
) {}
export class GetDurableExecutionResponse extends S.Class<GetDurableExecutionResponse>(
  "GetDurableExecutionResponse",
)({
  DurableExecutionArn: S.String,
  DurableExecutionName: S.String,
  FunctionArn: S.String,
  InputPayload: S.optional(S.String),
  Result: S.optional(S.String),
  Error: S.optional(ErrorObject),
  StartTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Status: S.String,
  EndTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Version: S.optional(S.String),
  TraceHeader: S.optional(TraceHeader),
}) {}
export class ListDurableExecutionsByFunctionResponse extends S.Class<ListDurableExecutionsByFunctionResponse>(
  "ListDurableExecutionsByFunctionResponse",
)({
  DurableExecutions: S.optional(DurableExecutions),
  NextMarker: S.optional(S.String),
}) {}
export class PutFunctionEventInvokeConfigRequest extends S.Class<PutFunctionEventInvokeConfigRequest>(
  "PutFunctionEventInvokeConfigRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel()),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
    MaximumRetryAttempts: S.optional(S.Number),
    MaximumEventAgeInSeconds: S.optional(S.Number),
    DestinationConfig: S.optional(DestinationConfig),
  },
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
) {}
export class EventError extends S.Class<EventError>("EventError")({
  Payload: S.optional(ErrorObject),
  Truncated: S.optional(S.Boolean),
}) {}
export class ExecutionTimedOutDetails extends S.Class<ExecutionTimedOutDetails>(
  "ExecutionTimedOutDetails",
)({ Error: S.optional(EventError) }) {}
export class ExecutionStoppedDetails extends S.Class<ExecutionStoppedDetails>(
  "ExecutionStoppedDetails",
)({ Error: EventError }) {}
export class EventResult extends S.Class<EventResult>("EventResult")({
  Payload: S.optional(S.String),
  Truncated: S.optional(S.Boolean),
}) {}
export class ContextSucceededDetails extends S.Class<ContextSucceededDetails>(
  "ContextSucceededDetails",
)({ Result: EventResult }) {}
export class ContextFailedDetails extends S.Class<ContextFailedDetails>(
  "ContextFailedDetails",
)({ Error: EventError }) {}
export class WaitStartedDetails extends S.Class<WaitStartedDetails>(
  "WaitStartedDetails",
)({
  Duration: S.Number,
  ScheduledEndTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class WaitSucceededDetails extends S.Class<WaitSucceededDetails>(
  "WaitSucceededDetails",
)({ Duration: S.optional(S.Number) }) {}
export class WaitCancelledDetails extends S.Class<WaitCancelledDetails>(
  "WaitCancelledDetails",
)({ Error: S.optional(EventError) }) {}
export class RetryDetails extends S.Class<RetryDetails>("RetryDetails")({
  CurrentAttempt: S.optional(S.Number),
  NextAttemptDelaySeconds: S.optional(S.Number),
}) {}
export class StepFailedDetails extends S.Class<StepFailedDetails>(
  "StepFailedDetails",
)({ Error: EventError, RetryDetails: RetryDetails }) {}
export class EventInput extends S.Class<EventInput>("EventInput")({
  Payload: S.optional(S.String),
  Truncated: S.optional(S.Boolean),
}) {}
export class ChainedInvokeStartedDetails extends S.Class<ChainedInvokeStartedDetails>(
  "ChainedInvokeStartedDetails",
)({
  FunctionName: S.String,
  TenantId: S.optional(S.String),
  Input: S.optional(EventInput),
  ExecutedVersion: S.optional(S.String),
  DurableExecutionArn: S.optional(S.String),
}) {}
export class ChainedInvokeSucceededDetails extends S.Class<ChainedInvokeSucceededDetails>(
  "ChainedInvokeSucceededDetails",
)({ Result: EventResult }) {}
export class ChainedInvokeFailedDetails extends S.Class<ChainedInvokeFailedDetails>(
  "ChainedInvokeFailedDetails",
)({ Error: EventError }) {}
export class ChainedInvokeTimedOutDetails extends S.Class<ChainedInvokeTimedOutDetails>(
  "ChainedInvokeTimedOutDetails",
)({ Error: EventError }) {}
export class ChainedInvokeStoppedDetails extends S.Class<ChainedInvokeStoppedDetails>(
  "ChainedInvokeStoppedDetails",
)({ Error: EventError }) {}
export class CallbackStartedDetails extends S.Class<CallbackStartedDetails>(
  "CallbackStartedDetails",
)({
  CallbackId: S.String,
  HeartbeatTimeout: S.optional(S.Number),
  Timeout: S.optional(S.Number),
}) {}
export class CallbackSucceededDetails extends S.Class<CallbackSucceededDetails>(
  "CallbackSucceededDetails",
)({ Result: EventResult }) {}
export class CallbackFailedDetails extends S.Class<CallbackFailedDetails>(
  "CallbackFailedDetails",
)({ Error: EventError }) {}
export class CallbackTimedOutDetails extends S.Class<CallbackTimedOutDetails>(
  "CallbackTimedOutDetails",
)({ Error: EventError }) {}
export class InvocationCompletedDetails extends S.Class<InvocationCompletedDetails>(
  "InvocationCompletedDetails",
)({
  StartTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  RequestId: S.String,
  Error: S.optional(EventError),
}) {}
export class ExecutionDetails extends S.Class<ExecutionDetails>(
  "ExecutionDetails",
)({ InputPayload: S.optional(S.String) }) {}
export class ContextDetails extends S.Class<ContextDetails>("ContextDetails")({
  ReplayChildren: S.optional(S.Boolean),
  Result: S.optional(S.String),
  Error: S.optional(ErrorObject),
}) {}
export class StepDetails extends S.Class<StepDetails>("StepDetails")({
  Attempt: S.optional(S.Number),
  NextAttemptTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Result: S.optional(S.String),
  Error: S.optional(ErrorObject),
}) {}
export class WaitDetails extends S.Class<WaitDetails>("WaitDetails")({
  ScheduledEndTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class CallbackDetails extends S.Class<CallbackDetails>(
  "CallbackDetails",
)({
  CallbackId: S.optional(S.String),
  Result: S.optional(S.String),
  Error: S.optional(ErrorObject),
}) {}
export class ChainedInvokeDetails extends S.Class<ChainedInvokeDetails>(
  "ChainedInvokeDetails",
)({ Result: S.optional(S.String), Error: S.optional(ErrorObject) }) {}
export class Operation extends S.Class<Operation>("Operation")({
  Id: S.String,
  ParentId: S.optional(S.String),
  Name: S.optional(S.String),
  Type: S.String,
  SubType: S.optional(S.String),
  StartTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.String,
  ExecutionDetails: S.optional(ExecutionDetails),
  ContextDetails: S.optional(ContextDetails),
  StepDetails: S.optional(StepDetails),
  WaitDetails: S.optional(WaitDetails),
  CallbackDetails: S.optional(CallbackDetails),
  ChainedInvokeDetails: S.optional(ChainedInvokeDetails),
}) {}
export const Operations = S.Array(Operation);
export class GetDurableExecutionStateResponse extends S.Class<GetDurableExecutionStateResponse>(
  "GetDurableExecutionStateResponse",
)({ Operations: Operations, NextMarker: S.optional(S.String) }) {}
export class ExecutionStartedDetails extends S.Class<ExecutionStartedDetails>(
  "ExecutionStartedDetails",
)({ Input: EventInput, ExecutionTimeout: S.Number }) {}
export class ExecutionSucceededDetails extends S.Class<ExecutionSucceededDetails>(
  "ExecutionSucceededDetails",
)({ Result: EventResult }) {}
export class ExecutionFailedDetails extends S.Class<ExecutionFailedDetails>(
  "ExecutionFailedDetails",
)({ Error: EventError }) {}
export class StepSucceededDetails extends S.Class<StepSucceededDetails>(
  "StepSucceededDetails",
)({ Result: EventResult, RetryDetails: RetryDetails }) {}
export class CheckpointUpdatedExecutionState extends S.Class<CheckpointUpdatedExecutionState>(
  "CheckpointUpdatedExecutionState",
)({ Operations: S.optional(Operations), NextMarker: S.optional(S.String) }) {}
export class Event extends S.Class<Event>("Event")({
  EventType: S.optional(S.String),
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
}) {}
export const Events = S.Array(Event);
export class CheckpointDurableExecutionResponse extends S.Class<CheckpointDurableExecutionResponse>(
  "CheckpointDurableExecutionResponse",
)({
  CheckpointToken: S.optional(S.String),
  NewExecutionState: CheckpointUpdatedExecutionState,
}) {}
export class GetDurableExecutionHistoryResponse extends S.Class<GetDurableExecutionHistoryResponse>(
  "GetDurableExecutionHistoryResponse",
)({ Events: Events, NextMarker: S.optional(S.String) }) {}

//# Errors
export class CallbackTimeoutException extends S.TaggedError<CallbackTimeoutException>()(
  "CallbackTimeoutException",
  {},
) {}
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  {},
) {}
export class ResourceConflictException extends S.TaggedError<ResourceConflictException>()(
  "ResourceConflictException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ServiceException extends S.TaggedError<ServiceException>()(
  "ServiceException",
  {},
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {},
) {}

//# Operations
/**
 * Deletes the configuration for asynchronous invocation for a function, version, or alias.
 *
 * To configure options for asynchronous invocation, use PutFunctionEventInvokeConfig.
 */
export const deleteFunctionEventInvokeConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteFunctionEventInvokeConfigRequest,
    output: DeleteFunctionEventInvokeConfigResponse,
    errors: [
      InvalidParameterValueException,
      ResourceConflictException,
      ResourceNotFoundException,
      ServiceException,
      TooManyRequestsException,
    ],
  }));
/**
 * Retrieves details about your account's limits and usage in an Amazon Web Services Region.
 */
export const getAccountSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountSettingsRequest,
  output: GetAccountSettingsResponse,
  errors: [ServiceException, TooManyRequestsException],
}));
/**
 * Retrieves the configuration for asynchronous invocation for a function, version, or alias.
 *
 * To configure options for asynchronous invocation, use PutFunctionEventInvokeConfig.
 */
export const getFunctionEventInvokeConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetFunctionEventInvokeConfigRequest,
    output: FunctionEventInvokeConfig,
    errors: [
      InvalidParameterValueException,
      ResourceNotFoundException,
      ServiceException,
      TooManyRequestsException,
    ],
  }));
/**
 * Retrieves a list of configurations for asynchronous invocation for a function.
 *
 * To configure options for asynchronous invocation, use PutFunctionEventInvokeConfig.
 */
export const listFunctionEventInvokeConfigs =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListFunctionEventInvokeConfigsRequest,
    output: ListFunctionEventInvokeConfigsResponse,
    errors: [
      InvalidParameterValueException,
      ResourceNotFoundException,
      ServiceException,
      TooManyRequestsException,
    ],
  }));
/**
 * Returns a function, event source mapping, or code signing configuration's tags. You can also view function tags with GetFunction.
 */
export const listTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsRequest,
  output: ListTagsResponse,
  errors: [
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Sends a failure response for a callback operation in a durable execution. Use this API when an external system cannot complete a callback operation successfully.
 */
export const sendDurableExecutionCallbackFailure =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Sends a heartbeat signal for a long-running callback operation to prevent timeout. Use this API to extend the callback timeout period while the external operation is still in progress.
 */
export const sendDurableExecutionCallbackHeartbeat =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Sends a successful completion response for a callback operation in a durable execution. Use this API when an external system has successfully completed a callback operation.
 */
export const sendDurableExecutionCallbackSuccess =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Stops a running durable execution. The execution transitions to STOPPED status and cannot be resumed. Any in-progress operations are terminated.
 */
export const stopDurableExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopDurableExecutionRequest,
    output: StopDurableExecutionResponse,
    errors: [
      InvalidParameterValueException,
      ResourceNotFoundException,
      ServiceException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Adds tags to a function, event source mapping, or code signing configuration.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Removes tags from a function, event source mapping, or code signing configuration.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InvalidParameterValueException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates the configuration for asynchronous invocation for a function, version, or alias.
 *
 * To configure options for asynchronous invocation, use PutFunctionEventInvokeConfig.
 */
export const updateFunctionEventInvokeConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a Lambda function. To delete a specific function version, use the `Qualifier` parameter. Otherwise, all versions and aliases are deleted. This doesn't require the user to have explicit permissions for DeleteAlias.
 *
 * A deleted Lambda function cannot be recovered. Ensure that you specify the correct function name and version before deleting.
 *
 * To delete Lambda event source mappings that invoke a function, use DeleteEventSourceMapping. For Amazon Web Services services and resources that invoke your function directly, delete the trigger in the service where you originally configured it.
 */
export const deleteFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves detailed information about a specific durable execution, including its current status, input payload, result or error information, and execution metadata such as start time and usage statistics.
 */
export const getDurableExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns a list of durable executions for a specified Lambda function. You can filter the results by execution name, status, and start time range. This API supports pagination for large result sets.
 */
export const listDurableExecutionsByFunction =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListDurableExecutionsByFunctionRequest,
    output: ListDurableExecutionsByFunctionResponse,
    errors: [
      InvalidParameterValueException,
      ResourceNotFoundException,
      ServiceException,
      TooManyRequestsException,
    ],
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
export const putFunctionEventInvokeConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutFunctionEventInvokeConfigRequest,
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
 * Retrieves the current execution state required for the replay process during durable function execution. This API is used by the Lambda durable functions SDK to get state information needed for replay. You typically don't need to call this API directly as the SDK handles state management automatically.
 *
 * The response contains operations ordered by start sequence number in ascending order. Completed operations with children don't include child operation details since they don't need to be replayed.
 */
export const getDurableExecutionState = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDurableExecutionStateRequest,
    output: GetDurableExecutionStateResponse,
    errors: [
      InvalidParameterValueException,
      ServiceException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Saves the progress of a durable function execution during runtime. This API is used by the Lambda durable functions SDK to checkpoint completed steps and schedule asynchronous operations. You typically don't need to call this API directly as the SDK handles checkpointing automatically.
 *
 * Each checkpoint operation consumes the current checkpoint token and returns a new one for the next checkpoint. This ensures that checkpoints are applied in the correct order and prevents duplicate or out-of-order state updates.
 */
export const checkpointDurableExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CheckpointDurableExecutionRequest,
    output: CheckpointDurableExecutionResponse,
    errors: [
      InvalidParameterValueException,
      ServiceException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Retrieves the execution history for a durable execution, showing all the steps, callbacks, and events that occurred during the execution. This provides a detailed audit trail of the execution's progress over time.
 *
 * The history is available while the execution is running and for a retention period after it completes (1-90 days, default 30 days). You can control whether to include execution data such as step results and callback payloads.
 */
export const getDurableExecutionHistory = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDurableExecutionHistoryRequest,
    output: GetDurableExecutionHistoryResponse,
    errors: [
      InvalidParameterValueException,
      ResourceNotFoundException,
      ServiceException,
      TooManyRequestsException,
    ],
  }),
);
