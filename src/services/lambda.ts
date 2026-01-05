import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
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
export const Topics = S.Array(S.String);
export const Queues = S.Array(S.String);
export const FunctionResponseTypeList = S.Array(S.String);
export const LayerList = S.Array(S.String);
export const ArchitecturesList = S.Array(S.String);
export const CompatibleRuntimes = S.Array(S.String);
export const CompatibleArchitectures = S.Array(S.String);
export class DeleteFunctionRequest extends S.Class<DeleteFunctionRequest>(
  "DeleteFunctionRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
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
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
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
  { DurableExecutionArn: S.String.pipe(T.HttpLabel("DurableExecutionArn")) },
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
    DurableExecutionArn: S.String.pipe(T.HttpLabel("DurableExecutionArn")),
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
    DurableExecutionArn: S.String.pipe(T.HttpLabel("DurableExecutionArn")),
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
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
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
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
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
  { Resource: S.String.pipe(T.HttpLabel("Resource")) },
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
  { CallbackId: S.String.pipe(T.HttpLabel("CallbackId")) },
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
    CallbackId: S.String.pipe(T.HttpLabel("CallbackId")),
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
    DurableExecutionArn: S.String.pipe(T.HttpLabel("DurableExecutionArn")),
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
    Resource: S.String.pipe(T.HttpLabel("Resource")),
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
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
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
export class GetCapacityProviderRequest extends S.Class<GetCapacityProviderRequest>(
  "GetCapacityProviderRequest",
)(
  { CapacityProviderName: S.String.pipe(T.HttpLabel("CapacityProviderName")) },
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
) {}
export class TargetTrackingScalingPolicy extends S.Class<TargetTrackingScalingPolicy>(
  "TargetTrackingScalingPolicy",
)({ PredefinedMetricType: S.String, TargetValue: S.Number }) {}
export const CapacityProviderScalingPoliciesList = S.Array(
  TargetTrackingScalingPolicy,
);
export class CapacityProviderScalingConfig extends S.Class<CapacityProviderScalingConfig>(
  "CapacityProviderScalingConfig",
)({
  MaxVCpuCount: S.optional(S.Number),
  ScalingMode: S.optional(S.String),
  ScalingPolicies: S.optional(CapacityProviderScalingPoliciesList),
}) {}
export class UpdateCapacityProviderRequest extends S.Class<UpdateCapacityProviderRequest>(
  "UpdateCapacityProviderRequest",
)(
  {
    CapacityProviderName: S.String.pipe(T.HttpLabel("CapacityProviderName")),
    CapacityProviderScalingConfig: S.optional(CapacityProviderScalingConfig),
  },
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
) {}
export class DeleteCapacityProviderRequest extends S.Class<DeleteCapacityProviderRequest>(
  "DeleteCapacityProviderRequest",
)(
  { CapacityProviderName: S.String.pipe(T.HttpLabel("CapacityProviderName")) },
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
) {}
export class ListCapacityProvidersRequest extends S.Class<ListCapacityProvidersRequest>(
  "ListCapacityProvidersRequest",
)(
  {
    State: S.optional(S.String).pipe(T.HttpQuery("State")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2025-11-30/capacity-providers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFunctionVersionsByCapacityProviderRequest extends S.Class<ListFunctionVersionsByCapacityProviderRequest>(
  "ListFunctionVersionsByCapacityProviderRequest",
)(
  {
    CapacityProviderName: S.String.pipe(T.HttpLabel("CapacityProviderName")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
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
) {}
export class ListCodeSigningConfigsRequest extends S.Class<ListCodeSigningConfigsRequest>(
  "ListCodeSigningConfigsRequest",
)(
  {
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2020-04-22/code-signing-configs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCodeSigningConfigRequest extends S.Class<DeleteCodeSigningConfigRequest>(
  "DeleteCodeSigningConfigRequest",
)(
  { CodeSigningConfigArn: S.String.pipe(T.HttpLabel("CodeSigningConfigArn")) },
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
) {}
export class DeleteCodeSigningConfigResponse extends S.Class<DeleteCodeSigningConfigResponse>(
  "DeleteCodeSigningConfigResponse",
)({}) {}
export class GetCodeSigningConfigRequest extends S.Class<GetCodeSigningConfigRequest>(
  "GetCodeSigningConfigRequest",
)(
  { CodeSigningConfigArn: S.String.pipe(T.HttpLabel("CodeSigningConfigArn")) },
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
) {}
export class ListFunctionsByCodeSigningConfigRequest extends S.Class<ListFunctionsByCodeSigningConfigRequest>(
  "ListFunctionsByCodeSigningConfigRequest",
)(
  {
    CodeSigningConfigArn: S.String.pipe(T.HttpLabel("CodeSigningConfigArn")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
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
) {}
export const SigningProfileVersionArns = S.Array(S.String);
export class AllowedPublishers extends S.Class<AllowedPublishers>(
  "AllowedPublishers",
)({ SigningProfileVersionArns: SigningProfileVersionArns }) {}
export class CodeSigningPolicies extends S.Class<CodeSigningPolicies>(
  "CodeSigningPolicies",
)({ UntrustedArtifactOnDeployment: S.optional(S.String) }) {}
export class UpdateCodeSigningConfigRequest extends S.Class<UpdateCodeSigningConfigRequest>(
  "UpdateCodeSigningConfigRequest",
)(
  {
    CodeSigningConfigArn: S.String.pipe(T.HttpLabel("CodeSigningConfigArn")),
    Description: S.optional(S.String),
    AllowedPublishers: S.optional(AllowedPublishers),
    CodeSigningPolicies: S.optional(CodeSigningPolicies),
  },
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
) {}
export class GetEventSourceMappingRequest extends S.Class<GetEventSourceMappingRequest>(
  "GetEventSourceMappingRequest",
)(
  { UUID: S.String.pipe(T.HttpLabel("UUID")) },
  T.all(
    T.Http({ method: "GET", uri: "/2015-03-31/event-source-mappings/{UUID}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Filter extends S.Class<Filter>("Filter")({
  Pattern: S.optional(S.String),
}) {}
export const FilterList = S.Array(Filter);
export class FilterCriteria extends S.Class<FilterCriteria>("FilterCriteria")({
  Filters: S.optional(FilterList),
}) {}
export class SourceAccessConfiguration extends S.Class<SourceAccessConfiguration>(
  "SourceAccessConfiguration",
)({ Type: S.optional(S.String), URI: S.optional(S.String) }) {}
export const SourceAccessConfigurations = S.Array(SourceAccessConfiguration);
export class ScalingConfig extends S.Class<ScalingConfig>("ScalingConfig")({
  MaximumConcurrency: S.optional(S.Number),
}) {}
export class KafkaSchemaRegistryAccessConfig extends S.Class<KafkaSchemaRegistryAccessConfig>(
  "KafkaSchemaRegistryAccessConfig",
)({ Type: S.optional(S.String), URI: S.optional(S.String) }) {}
export const KafkaSchemaRegistryAccessConfigList = S.Array(
  KafkaSchemaRegistryAccessConfig,
);
export class KafkaSchemaValidationConfig extends S.Class<KafkaSchemaValidationConfig>(
  "KafkaSchemaValidationConfig",
)({ Attribute: S.optional(S.String) }) {}
export const KafkaSchemaValidationConfigList = S.Array(
  KafkaSchemaValidationConfig,
);
export class KafkaSchemaRegistryConfig extends S.Class<KafkaSchemaRegistryConfig>(
  "KafkaSchemaRegistryConfig",
)({
  SchemaRegistryURI: S.optional(S.String),
  EventRecordFormat: S.optional(S.String),
  AccessConfigs: S.optional(KafkaSchemaRegistryAccessConfigList),
  SchemaValidationConfigs: S.optional(KafkaSchemaValidationConfigList),
}) {}
export class AmazonManagedKafkaEventSourceConfig extends S.Class<AmazonManagedKafkaEventSourceConfig>(
  "AmazonManagedKafkaEventSourceConfig",
)({
  ConsumerGroupId: S.optional(S.String),
  SchemaRegistryConfig: S.optional(KafkaSchemaRegistryConfig),
}) {}
export class SelfManagedKafkaEventSourceConfig extends S.Class<SelfManagedKafkaEventSourceConfig>(
  "SelfManagedKafkaEventSourceConfig",
)({
  ConsumerGroupId: S.optional(S.String),
  SchemaRegistryConfig: S.optional(KafkaSchemaRegistryConfig),
}) {}
export class DocumentDBEventSourceConfig extends S.Class<DocumentDBEventSourceConfig>(
  "DocumentDBEventSourceConfig",
)({
  DatabaseName: S.optional(S.String),
  CollectionName: S.optional(S.String),
  FullDocument: S.optional(S.String),
}) {}
export const EventSourceMappingMetricList = S.Array(S.String);
export class EventSourceMappingMetricsConfig extends S.Class<EventSourceMappingMetricsConfig>(
  "EventSourceMappingMetricsConfig",
)({ Metrics: S.optional(EventSourceMappingMetricList) }) {}
export class ProvisionedPollerConfig extends S.Class<ProvisionedPollerConfig>(
  "ProvisionedPollerConfig",
)({
  MinimumPollers: S.optional(S.Number),
  MaximumPollers: S.optional(S.Number),
  PollerGroupName: S.optional(S.String),
}) {}
export class UpdateEventSourceMappingRequest extends S.Class<UpdateEventSourceMappingRequest>(
  "UpdateEventSourceMappingRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "PUT", uri: "/2015-03-31/event-source-mappings/{UUID}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEventSourceMappingRequest extends S.Class<DeleteEventSourceMappingRequest>(
  "DeleteEventSourceMappingRequest",
)(
  { UUID: S.String.pipe(T.HttpLabel("UUID")) },
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
) {}
export class ListEventSourceMappingsRequest extends S.Class<ListEventSourceMappingsRequest>(
  "ListEventSourceMappingsRequest",
)(
  {
    EventSourceArn: S.optional(S.String).pipe(T.HttpQuery("EventSourceArn")),
    FunctionName: S.optional(S.String).pipe(T.HttpQuery("FunctionName")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2015-03-31/event-source-mappings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFunctionsRequest extends S.Class<ListFunctionsRequest>(
  "ListFunctionsRequest",
)(
  {
    MasterRegion: S.optional(S.String).pipe(T.HttpQuery("MasterRegion")),
    FunctionVersion: S.optional(S.String).pipe(T.HttpQuery("FunctionVersion")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2015-03-31/functions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFunctionConcurrencyRequest extends S.Class<DeleteFunctionConcurrencyRequest>(
  "DeleteFunctionConcurrencyRequest",
)(
  { FunctionName: S.String.pipe(T.HttpLabel("FunctionName")) },
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
) {}
export class DeleteFunctionConcurrencyResponse extends S.Class<DeleteFunctionConcurrencyResponse>(
  "DeleteFunctionConcurrencyResponse",
)({}) {}
export class DeleteFunctionUrlConfigRequest extends S.Class<DeleteFunctionUrlConfigRequest>(
  "DeleteFunctionUrlConfigRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
  },
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
) {}
export class DeleteFunctionUrlConfigResponse extends S.Class<DeleteFunctionUrlConfigResponse>(
  "DeleteFunctionUrlConfigResponse",
)({}) {}
export class GetFunctionConcurrencyRequest extends S.Class<GetFunctionConcurrencyRequest>(
  "GetFunctionConcurrencyRequest",
)(
  { FunctionName: S.String.pipe(T.HttpLabel("FunctionName")) },
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
) {}
export class GetFunctionUrlConfigRequest extends S.Class<GetFunctionUrlConfigRequest>(
  "GetFunctionUrlConfigRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2021-10-31/functions/{FunctionName}/url" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFunctionUrlConfigsRequest extends S.Class<ListFunctionUrlConfigsRequest>(
  "ListFunctionUrlConfigsRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2021-10-31/functions/{FunctionName}/urls" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListProvisionedConcurrencyConfigsRequest extends S.Class<ListProvisionedConcurrencyConfigsRequest>(
  "ListProvisionedConcurrencyConfigsRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
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
) {}
export class PutFunctionConcurrencyRequest extends S.Class<PutFunctionConcurrencyRequest>(
  "PutFunctionConcurrencyRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    ReservedConcurrentExecutions: S.Number,
  },
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
) {}
export class UpdateFunctionCodeRequest extends S.Class<UpdateFunctionCodeRequest>(
  "UpdateFunctionCodeRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    ZipFile: S.optional(T.Blob),
    S3Bucket: S.optional(S.String),
    S3Key: S.optional(S.String),
    S3ObjectVersion: S.optional(S.String),
    ImageUri: S.optional(S.String),
    Publish: S.optional(S.Boolean),
    DryRun: S.optional(S.Boolean),
    RevisionId: S.optional(S.String),
    Architectures: S.optional(ArchitecturesList),
    SourceKMSKeyArn: S.optional(S.String),
    PublishTo: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/2015-03-31/functions/{FunctionName}/code" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const SubnetIds = S.Array(S.String);
export const SecurityGroupIds = S.Array(S.String);
export class VpcConfig extends S.Class<VpcConfig>("VpcConfig")({
  SubnetIds: S.optional(SubnetIds),
  SecurityGroupIds: S.optional(SecurityGroupIds),
  Ipv6AllowedForDualStack: S.optional(S.Boolean),
}) {}
export const EnvironmentVariables = S.Record({
  key: S.String,
  value: S.String,
});
export class Environment extends S.Class<Environment>("Environment")({
  Variables: S.optional(EnvironmentVariables),
}) {}
export class DeadLetterConfig extends S.Class<DeadLetterConfig>(
  "DeadLetterConfig",
)({ TargetArn: S.optional(S.String) }) {}
export class TracingConfig extends S.Class<TracingConfig>("TracingConfig")({
  Mode: S.optional(S.String),
}) {}
export class FileSystemConfig extends S.Class<FileSystemConfig>(
  "FileSystemConfig",
)({ Arn: S.String, LocalMountPath: S.String }) {}
export const FileSystemConfigList = S.Array(FileSystemConfig);
export const StringList = S.Array(S.String);
export class ImageConfig extends S.Class<ImageConfig>("ImageConfig")({
  EntryPoint: S.optional(StringList),
  Command: S.optional(StringList),
  WorkingDirectory: S.optional(S.String),
}) {}
export class EphemeralStorage extends S.Class<EphemeralStorage>(
  "EphemeralStorage",
)({ Size: S.Number }) {}
export class SnapStart extends S.Class<SnapStart>("SnapStart")({
  ApplyOn: S.optional(S.String),
}) {}
export class LoggingConfig extends S.Class<LoggingConfig>("LoggingConfig")({
  LogFormat: S.optional(S.String),
  ApplicationLogLevel: S.optional(S.String),
  SystemLogLevel: S.optional(S.String),
  LogGroup: S.optional(S.String),
}) {}
export class LambdaManagedInstancesCapacityProviderConfig extends S.Class<LambdaManagedInstancesCapacityProviderConfig>(
  "LambdaManagedInstancesCapacityProviderConfig",
)({
  CapacityProviderArn: S.String,
  PerExecutionEnvironmentMaxConcurrency: S.optional(S.Number),
  ExecutionEnvironmentMemoryGiBPerVCpu: S.optional(S.Number),
}) {}
export class CapacityProviderConfig extends S.Class<CapacityProviderConfig>(
  "CapacityProviderConfig",
)({
  LambdaManagedInstancesCapacityProviderConfig:
    LambdaManagedInstancesCapacityProviderConfig,
}) {}
export class DurableConfig extends S.Class<DurableConfig>("DurableConfig")({
  RetentionPeriodInDays: S.optional(S.Number),
  ExecutionTimeout: S.optional(S.Number),
}) {}
export class UpdateFunctionConfigurationRequest extends S.Class<UpdateFunctionConfigurationRequest>(
  "UpdateFunctionConfigurationRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Role: S.optional(S.String),
    Handler: S.optional(S.String),
    Description: S.optional(S.String),
    Timeout: S.optional(S.Number),
    MemorySize: S.optional(S.Number),
    VpcConfig: S.optional(VpcConfig),
    Environment: S.optional(Environment),
    Runtime: S.optional(S.String),
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
  },
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
) {}
export const HeadersList = S.Array(S.String);
export const AllowMethodsList = S.Array(S.String);
export const AllowOriginsList = S.Array(S.String);
export class Cors extends S.Class<Cors>("Cors")({
  AllowCredentials: S.optional(S.Boolean),
  AllowHeaders: S.optional(HeadersList),
  AllowMethods: S.optional(AllowMethodsList),
  AllowOrigins: S.optional(AllowOriginsList),
  ExposeHeaders: S.optional(HeadersList),
  MaxAge: S.optional(S.Number),
}) {}
export class UpdateFunctionUrlConfigRequest extends S.Class<UpdateFunctionUrlConfigRequest>(
  "UpdateFunctionUrlConfigRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
    AuthType: S.optional(S.String),
    Cors: S.optional(Cors),
    InvokeMode: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/2021-10-31/functions/{FunctionName}/url" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFunctionCodeSigningConfigRequest extends S.Class<DeleteFunctionCodeSigningConfigRequest>(
  "DeleteFunctionCodeSigningConfigRequest",
)(
  { FunctionName: S.String.pipe(T.HttpLabel("FunctionName")) },
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
) {}
export class DeleteFunctionCodeSigningConfigResponse extends S.Class<DeleteFunctionCodeSigningConfigResponse>(
  "DeleteFunctionCodeSigningConfigResponse",
)({}) {}
export class GetFunctionRequest extends S.Class<GetFunctionRequest>(
  "GetFunctionRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2015-03-31/functions/{FunctionName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFunctionCodeSigningConfigRequest extends S.Class<GetFunctionCodeSigningConfigRequest>(
  "GetFunctionCodeSigningConfigRequest",
)(
  { FunctionName: S.String.pipe(T.HttpLabel("FunctionName")) },
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
) {}
export class GetFunctionConfigurationRequest extends S.Class<GetFunctionConfigurationRequest>(
  "GetFunctionConfigurationRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
  },
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
) {}
export class GetFunctionRecursionConfigRequest extends S.Class<GetFunctionRecursionConfigRequest>(
  "GetFunctionRecursionConfigRequest",
)(
  { FunctionName: S.String.pipe(T.HttpLabel("FunctionName")) },
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
) {}
export class GetFunctionScalingConfigRequest extends S.Class<GetFunctionScalingConfigRequest>(
  "GetFunctionScalingConfigRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.String.pipe(T.HttpQuery("Qualifier")),
  },
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
) {}
export class GetPolicyRequest extends S.Class<GetPolicyRequest>(
  "GetPolicyRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
  },
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
) {}
export class GetRuntimeManagementConfigRequest extends S.Class<GetRuntimeManagementConfigRequest>(
  "GetRuntimeManagementConfigRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
  },
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
) {}
export class InvocationRequest extends S.Class<InvocationRequest>(
  "InvocationRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    InvocationType: S.optional(S.String).pipe(
      T.HttpHeader("X-Amz-Invocation-Type"),
    ),
    LogType: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Log-Type")),
    ClientContext: S.optional(S.String).pipe(
      T.HttpHeader("X-Amz-Client-Context"),
    ),
    DurableExecutionName: S.optional(S.String).pipe(
      T.HttpHeader("X-Amz-Durable-Execution-Name"),
    ),
    Payload: S.optional(T.StreamingInput).pipe(T.HttpPayload()),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
    TenantId: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Tenant-Id")),
  },
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
) {}
export class InvokeAsyncRequest extends S.Class<InvokeAsyncRequest>(
  "InvokeAsyncRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    InvokeArgs: T.StreamingInput.pipe(T.HttpPayload()),
  },
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
) {}
export class InvokeWithResponseStreamRequest extends S.Class<InvokeWithResponseStreamRequest>(
  "InvokeWithResponseStreamRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    InvocationType: S.optional(S.String).pipe(
      T.HttpHeader("X-Amz-Invocation-Type"),
    ),
    LogType: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Log-Type")),
    ClientContext: S.optional(S.String).pipe(
      T.HttpHeader("X-Amz-Client-Context"),
    ),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
    Payload: S.optional(T.StreamingInput).pipe(T.HttpPayload()),
    TenantId: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Tenant-Id")),
  },
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
) {}
export class PutFunctionCodeSigningConfigRequest extends S.Class<PutFunctionCodeSigningConfigRequest>(
  "PutFunctionCodeSigningConfigRequest",
)(
  {
    CodeSigningConfigArn: S.String,
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
  },
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
) {}
export class PutFunctionRecursionConfigRequest extends S.Class<PutFunctionRecursionConfigRequest>(
  "PutFunctionRecursionConfigRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    RecursiveLoop: S.String,
  },
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
) {}
export class PutRuntimeManagementConfigRequest extends S.Class<PutRuntimeManagementConfigRequest>(
  "PutRuntimeManagementConfigRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
    UpdateRuntimeOn: S.String,
    RuntimeVersionArn: S.optional(S.String),
  },
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
) {}
export class GetAliasRequest extends S.Class<GetAliasRequest>(
  "GetAliasRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Name: S.String.pipe(T.HttpLabel("Name")),
  },
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
) {}
export const AdditionalVersionWeights = S.Record({
  key: S.String,
  value: S.Number,
});
export class AliasRoutingConfiguration extends S.Class<AliasRoutingConfiguration>(
  "AliasRoutingConfiguration",
)({ AdditionalVersionWeights: S.optional(AdditionalVersionWeights) }) {}
export class UpdateAliasRequest extends S.Class<UpdateAliasRequest>(
  "UpdateAliasRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Name: S.String.pipe(T.HttpLabel("Name")),
    FunctionVersion: S.optional(S.String),
    Description: S.optional(S.String),
    RoutingConfig: S.optional(AliasRoutingConfiguration),
    RevisionId: S.optional(S.String),
  },
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
) {}
export class DeleteAliasRequest extends S.Class<DeleteAliasRequest>(
  "DeleteAliasRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Name: S.String.pipe(T.HttpLabel("Name")),
  },
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
) {}
export class DeleteAliasResponse extends S.Class<DeleteAliasResponse>(
  "DeleteAliasResponse",
)({}) {}
export class ListAliasesRequest extends S.Class<ListAliasesRequest>(
  "ListAliasesRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    FunctionVersion: S.optional(S.String).pipe(T.HttpQuery("FunctionVersion")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
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
) {}
export class PublishVersionRequest extends S.Class<PublishVersionRequest>(
  "PublishVersionRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    CodeSha256: S.optional(S.String),
    Description: S.optional(S.String),
    RevisionId: S.optional(S.String),
    PublishTo: S.optional(S.String),
  },
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
) {}
export class ListVersionsByFunctionRequest extends S.Class<ListVersionsByFunctionRequest>(
  "ListVersionsByFunctionRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
  },
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
) {}
export class ListLayersRequest extends S.Class<ListLayersRequest>(
  "ListLayersRequest",
)(
  {
    CompatibleRuntime: S.optional(S.String).pipe(
      T.HttpQuery("CompatibleRuntime"),
    ),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    CompatibleArchitecture: S.optional(S.String).pipe(
      T.HttpQuery("CompatibleArchitecture"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2018-10-31/layers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLayerVersionsRequest extends S.Class<ListLayerVersionsRequest>(
  "ListLayerVersionsRequest",
)(
  {
    CompatibleRuntime: S.optional(S.String).pipe(
      T.HttpQuery("CompatibleRuntime"),
    ),
    LayerName: S.String.pipe(T.HttpLabel("LayerName")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    CompatibleArchitecture: S.optional(S.String).pipe(
      T.HttpQuery("CompatibleArchitecture"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2018-10-31/layers/{LayerName}/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AddLayerVersionPermissionRequest extends S.Class<AddLayerVersionPermissionRequest>(
  "AddLayerVersionPermissionRequest",
)(
  {
    LayerName: S.String.pipe(T.HttpLabel("LayerName")),
    VersionNumber: S.Number.pipe(T.HttpLabel("VersionNumber")),
    StatementId: S.String,
    Action: S.String,
    Principal: S.String,
    OrganizationId: S.optional(S.String),
    RevisionId: S.optional(S.String).pipe(T.HttpQuery("RevisionId")),
  },
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
) {}
export class DeleteLayerVersionRequest extends S.Class<DeleteLayerVersionRequest>(
  "DeleteLayerVersionRequest",
)(
  {
    LayerName: S.String.pipe(T.HttpLabel("LayerName")),
    VersionNumber: S.Number.pipe(T.HttpLabel("VersionNumber")),
  },
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
) {}
export class DeleteLayerVersionResponse extends S.Class<DeleteLayerVersionResponse>(
  "DeleteLayerVersionResponse",
)({}) {}
export class GetLayerVersionRequest extends S.Class<GetLayerVersionRequest>(
  "GetLayerVersionRequest",
)(
  {
    LayerName: S.String.pipe(T.HttpLabel("LayerName")),
    VersionNumber: S.Number.pipe(T.HttpLabel("VersionNumber")),
  },
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
) {}
export class GetLayerVersionByArnRequest extends S.Class<GetLayerVersionByArnRequest>(
  "GetLayerVersionByArnRequest",
)(
  { Arn: S.String.pipe(T.HttpQuery("Arn")) },
  T.all(
    T.Http({ method: "GET", uri: "/2018-10-31/layers?find=LayerVersion" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLayerVersionPolicyRequest extends S.Class<GetLayerVersionPolicyRequest>(
  "GetLayerVersionPolicyRequest",
)(
  {
    LayerName: S.String.pipe(T.HttpLabel("LayerName")),
    VersionNumber: S.Number.pipe(T.HttpLabel("VersionNumber")),
  },
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
) {}
export class RemoveLayerVersionPermissionRequest extends S.Class<RemoveLayerVersionPermissionRequest>(
  "RemoveLayerVersionPermissionRequest",
)(
  {
    LayerName: S.String.pipe(T.HttpLabel("LayerName")),
    VersionNumber: S.Number.pipe(T.HttpLabel("VersionNumber")),
    StatementId: S.String.pipe(T.HttpLabel("StatementId")),
    RevisionId: S.optional(S.String).pipe(T.HttpQuery("RevisionId")),
  },
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
) {}
export class RemoveLayerVersionPermissionResponse extends S.Class<RemoveLayerVersionPermissionResponse>(
  "RemoveLayerVersionPermissionResponse",
)({}) {}
export class AddPermissionRequest extends S.Class<AddPermissionRequest>(
  "AddPermissionRequest",
)(
  {
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
    FunctionUrlAuthType: S.optional(S.String),
    InvokedViaFunctionUrl: S.optional(S.Boolean),
  },
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
) {}
export class RemovePermissionRequest extends S.Class<RemovePermissionRequest>(
  "RemovePermissionRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    StatementId: S.String.pipe(T.HttpLabel("StatementId")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
    RevisionId: S.optional(S.String).pipe(T.HttpQuery("RevisionId")),
  },
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
) {}
export class RemovePermissionResponse extends S.Class<RemovePermissionResponse>(
  "RemovePermissionResponse",
)({}) {}
export class PutProvisionedConcurrencyConfigRequest extends S.Class<PutProvisionedConcurrencyConfigRequest>(
  "PutProvisionedConcurrencyConfigRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.String.pipe(T.HttpQuery("Qualifier")),
    ProvisionedConcurrentExecutions: S.Number,
  },
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
) {}
export class GetProvisionedConcurrencyConfigRequest extends S.Class<GetProvisionedConcurrencyConfigRequest>(
  "GetProvisionedConcurrencyConfigRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.String.pipe(T.HttpQuery("Qualifier")),
  },
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
) {}
export class DeleteProvisionedConcurrencyConfigRequest extends S.Class<DeleteProvisionedConcurrencyConfigRequest>(
  "DeleteProvisionedConcurrencyConfigRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.String.pipe(T.HttpQuery("Qualifier")),
  },
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
) {}
export class DeleteProvisionedConcurrencyConfigResponse extends S.Class<DeleteProvisionedConcurrencyConfigResponse>(
  "DeleteProvisionedConcurrencyConfigResponse",
)({}) {}
export const CapacityProviderSubnetIds = S.Array(S.String);
export const CapacityProviderSecurityGroupIds = S.Array(S.String);
export const InstanceTypeSet = S.Array(S.String);
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
export class CapacityProviderVpcConfig extends S.Class<CapacityProviderVpcConfig>(
  "CapacityProviderVpcConfig",
)({
  SubnetIds: CapacityProviderSubnetIds,
  SecurityGroupIds: CapacityProviderSecurityGroupIds,
}) {}
export class CapacityProviderPermissionsConfig extends S.Class<CapacityProviderPermissionsConfig>(
  "CapacityProviderPermissionsConfig",
)({ CapacityProviderOperatorRoleArn: S.String }) {}
export class InstanceRequirements extends S.Class<InstanceRequirements>(
  "InstanceRequirements",
)({
  Architectures: S.optional(ArchitecturesList),
  AllowedInstanceTypes: S.optional(InstanceTypeSet),
  ExcludedInstanceTypes: S.optional(InstanceTypeSet),
}) {}
export class CapacityProvider extends S.Class<CapacityProvider>(
  "CapacityProvider",
)({
  CapacityProviderArn: S.String,
  State: S.String,
  VpcConfig: CapacityProviderVpcConfig,
  PermissionsConfig: CapacityProviderPermissionsConfig,
  InstanceRequirements: S.optional(InstanceRequirements),
  CapacityProviderScalingConfig: S.optional(CapacityProviderScalingConfig),
  KmsKeyArn: S.optional(S.String),
  LastModified: S.optional(S.String),
}) {}
export const CapacityProvidersList = S.Array(CapacityProvider);
export const FunctionArnList = S.Array(S.String);
export const EndpointLists = S.Array(S.String);
export const Endpoints = S.Record({ key: S.String, value: EndpointLists });
export class SelfManagedEventSource extends S.Class<SelfManagedEventSource>(
  "SelfManagedEventSource",
)({ Endpoints: S.optional(Endpoints) }) {}
export class FilterCriteriaError extends S.Class<FilterCriteriaError>(
  "FilterCriteriaError",
)({ ErrorCode: S.optional(S.String), Message: S.optional(S.String) }) {}
export class EventSourceMappingConfiguration extends S.Class<EventSourceMappingConfiguration>(
  "EventSourceMappingConfiguration",
)({
  UUID: S.optional(S.String),
  StartingPosition: S.optional(S.String),
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
}) {}
export const EventSourceMappingsList = S.Array(EventSourceMappingConfiguration);
export class FunctionCode extends S.Class<FunctionCode>("FunctionCode")({
  ZipFile: S.optional(T.Blob),
  S3Bucket: S.optional(S.String),
  S3Key: S.optional(S.String),
  S3ObjectVersion: S.optional(S.String),
  ImageUri: S.optional(S.String),
  SourceKMSKeyArn: S.optional(S.String),
}) {}
export class TenancyConfig extends S.Class<TenancyConfig>("TenancyConfig")({
  TenantIsolationMode: S.String,
}) {}
export class VpcConfigResponse extends S.Class<VpcConfigResponse>(
  "VpcConfigResponse",
)({
  SubnetIds: S.optional(SubnetIds),
  SecurityGroupIds: S.optional(SecurityGroupIds),
  VpcId: S.optional(S.String),
  Ipv6AllowedForDualStack: S.optional(S.Boolean),
}) {}
export class EnvironmentError extends S.Class<EnvironmentError>(
  "EnvironmentError",
)({ ErrorCode: S.optional(S.String), Message: S.optional(S.String) }) {}
export class EnvironmentResponse extends S.Class<EnvironmentResponse>(
  "EnvironmentResponse",
)({
  Variables: S.optional(EnvironmentVariables),
  Error: S.optional(EnvironmentError),
}) {}
export class TracingConfigResponse extends S.Class<TracingConfigResponse>(
  "TracingConfigResponse",
)({ Mode: S.optional(S.String) }) {}
export class Layer extends S.Class<Layer>("Layer")({
  Arn: S.optional(S.String),
  CodeSize: S.optional(S.Number),
  SigningProfileVersionArn: S.optional(S.String),
  SigningJobArn: S.optional(S.String),
}) {}
export const LayersReferenceList = S.Array(Layer);
export class ImageConfigError extends S.Class<ImageConfigError>(
  "ImageConfigError",
)({ ErrorCode: S.optional(S.String), Message: S.optional(S.String) }) {}
export class ImageConfigResponse extends S.Class<ImageConfigResponse>(
  "ImageConfigResponse",
)({
  ImageConfig: S.optional(ImageConfig),
  Error: S.optional(ImageConfigError),
}) {}
export class SnapStartResponse extends S.Class<SnapStartResponse>(
  "SnapStartResponse",
)({
  ApplyOn: S.optional(S.String),
  OptimizationStatus: S.optional(S.String),
}) {}
export class RuntimeVersionError extends S.Class<RuntimeVersionError>(
  "RuntimeVersionError",
)({ ErrorCode: S.optional(S.String), Message: S.optional(S.String) }) {}
export class RuntimeVersionConfig extends S.Class<RuntimeVersionConfig>(
  "RuntimeVersionConfig",
)({
  RuntimeVersionArn: S.optional(S.String),
  Error: S.optional(RuntimeVersionError),
}) {}
export class FunctionConfiguration extends S.Class<FunctionConfiguration>(
  "FunctionConfiguration",
)({
  FunctionName: S.optional(S.String),
  FunctionArn: S.optional(S.String),
  Runtime: S.optional(S.String),
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
  State: S.optional(S.String),
  StateReason: S.optional(S.String),
  StateReasonCode: S.optional(S.String),
  LastUpdateStatus: S.optional(S.String),
  LastUpdateStatusReason: S.optional(S.String),
  LastUpdateStatusReasonCode: S.optional(S.String),
  FileSystemConfigs: S.optional(FileSystemConfigList),
  PackageType: S.optional(S.String),
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
}) {}
export const FunctionList = S.Array(FunctionConfiguration);
export class FunctionScalingConfig extends S.Class<FunctionScalingConfig>(
  "FunctionScalingConfig",
)({
  MinExecutionEnvironments: S.optional(S.Number),
  MaxExecutionEnvironments: S.optional(S.Number),
}) {}
export class AliasConfiguration extends S.Class<AliasConfiguration>(
  "AliasConfiguration",
)({
  AliasArn: S.optional(S.String),
  Name: S.optional(S.String),
  FunctionVersion: S.optional(S.String),
  Description: S.optional(S.String),
  RoutingConfig: S.optional(AliasRoutingConfiguration),
  RevisionId: S.optional(S.String),
}) {}
export const AliasList = S.Array(AliasConfiguration);
export class LayerVersionContentInput extends S.Class<LayerVersionContentInput>(
  "LayerVersionContentInput",
)({
  S3Bucket: S.optional(S.String),
  S3Key: S.optional(S.String),
  S3ObjectVersion: S.optional(S.String),
  ZipFile: S.optional(T.Blob),
}) {}
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
    CallbackId: S.String.pipe(T.HttpLabel("CallbackId")),
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
  { Resource: S.String.pipe(T.HttpLabel("Resource")), Tags: Tags },
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
export class UpdateCapacityProviderResponse extends S.Class<UpdateCapacityProviderResponse>(
  "UpdateCapacityProviderResponse",
)({ CapacityProvider: CapacityProvider }) {}
export class DeleteCapacityProviderResponse extends S.Class<DeleteCapacityProviderResponse>(
  "DeleteCapacityProviderResponse",
)({ CapacityProvider: CapacityProvider }) {}
export class ListCapacityProvidersResponse extends S.Class<ListCapacityProvidersResponse>(
  "ListCapacityProvidersResponse",
)({
  CapacityProviders: CapacityProvidersList,
  NextMarker: S.optional(S.String),
}) {}
export class CreateCodeSigningConfigRequest extends S.Class<CreateCodeSigningConfigRequest>(
  "CreateCodeSigningConfigRequest",
)(
  {
    Description: S.optional(S.String),
    AllowedPublishers: AllowedPublishers,
    CodeSigningPolicies: S.optional(CodeSigningPolicies),
    Tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2020-04-22/code-signing-configs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CodeSigningConfig extends S.Class<CodeSigningConfig>(
  "CodeSigningConfig",
)({
  CodeSigningConfigId: S.String,
  CodeSigningConfigArn: S.String,
  Description: S.optional(S.String),
  AllowedPublishers: AllowedPublishers,
  CodeSigningPolicies: CodeSigningPolicies,
  LastModified: S.String,
}) {}
export class GetCodeSigningConfigResponse extends S.Class<GetCodeSigningConfigResponse>(
  "GetCodeSigningConfigResponse",
)({ CodeSigningConfig: CodeSigningConfig }) {}
export class ListFunctionsByCodeSigningConfigResponse extends S.Class<ListFunctionsByCodeSigningConfigResponse>(
  "ListFunctionsByCodeSigningConfigResponse",
)({
  NextMarker: S.optional(S.String),
  FunctionArns: S.optional(FunctionArnList),
}) {}
export class UpdateCodeSigningConfigResponse extends S.Class<UpdateCodeSigningConfigResponse>(
  "UpdateCodeSigningConfigResponse",
)({ CodeSigningConfig: CodeSigningConfig }) {}
export class ListEventSourceMappingsResponse extends S.Class<ListEventSourceMappingsResponse>(
  "ListEventSourceMappingsResponse",
)({
  NextMarker: S.optional(S.String),
  EventSourceMappings: S.optional(EventSourceMappingsList),
}) {}
export class ListFunctionsResponse extends S.Class<ListFunctionsResponse>(
  "ListFunctionsResponse",
)({ NextMarker: S.optional(S.String), Functions: S.optional(FunctionList) }) {}
export class CreateFunctionUrlConfigRequest extends S.Class<CreateFunctionUrlConfigRequest>(
  "CreateFunctionUrlConfigRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.optional(S.String).pipe(T.HttpQuery("Qualifier")),
    AuthType: S.String,
    Cors: S.optional(Cors),
    InvokeMode: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2021-10-31/functions/{FunctionName}/url" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFunctionConcurrencyResponse extends S.Class<GetFunctionConcurrencyResponse>(
  "GetFunctionConcurrencyResponse",
)({ ReservedConcurrentExecutions: S.optional(S.Number) }) {}
export class GetFunctionUrlConfigResponse extends S.Class<GetFunctionUrlConfigResponse>(
  "GetFunctionUrlConfigResponse",
)({
  FunctionUrl: S.String,
  FunctionArn: S.String,
  AuthType: S.String,
  Cors: S.optional(Cors),
  CreationTime: S.String,
  LastModifiedTime: S.String,
  InvokeMode: S.optional(S.String),
}) {}
export class Concurrency extends S.Class<Concurrency>("Concurrency")({
  ReservedConcurrentExecutions: S.optional(S.Number),
}) {}
export class UpdateFunctionUrlConfigResponse extends S.Class<UpdateFunctionUrlConfigResponse>(
  "UpdateFunctionUrlConfigResponse",
)({
  FunctionUrl: S.String,
  FunctionArn: S.String,
  AuthType: S.String,
  Cors: S.optional(Cors),
  CreationTime: S.String,
  LastModifiedTime: S.String,
  InvokeMode: S.optional(S.String),
}) {}
export class GetFunctionCodeSigningConfigResponse extends S.Class<GetFunctionCodeSigningConfigResponse>(
  "GetFunctionCodeSigningConfigResponse",
)({ CodeSigningConfigArn: S.String, FunctionName: S.String }) {}
export class GetFunctionRecursionConfigResponse extends S.Class<GetFunctionRecursionConfigResponse>(
  "GetFunctionRecursionConfigResponse",
)({ RecursiveLoop: S.optional(S.String) }) {}
export class GetFunctionScalingConfigResponse extends S.Class<GetFunctionScalingConfigResponse>(
  "GetFunctionScalingConfigResponse",
)({
  FunctionArn: S.optional(S.String),
  AppliedFunctionScalingConfig: S.optional(FunctionScalingConfig),
  RequestedFunctionScalingConfig: S.optional(FunctionScalingConfig),
}) {}
export class GetPolicyResponse extends S.Class<GetPolicyResponse>(
  "GetPolicyResponse",
)({ Policy: S.optional(S.String), RevisionId: S.optional(S.String) }) {}
export class GetRuntimeManagementConfigResponse extends S.Class<GetRuntimeManagementConfigResponse>(
  "GetRuntimeManagementConfigResponse",
)({
  UpdateRuntimeOn: S.optional(S.String),
  RuntimeVersionArn: S.optional(S.String),
  FunctionArn: S.optional(S.String),
}) {}
export class InvocationResponse extends S.Class<InvocationResponse>(
  "InvocationResponse",
)({
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
}) {}
export class InvokeAsyncResponse extends S.Class<InvokeAsyncResponse>(
  "InvokeAsyncResponse",
)({ Status: S.optional(S.Number).pipe(T.HttpResponseCode()) }) {}
export class PutFunctionCodeSigningConfigResponse extends S.Class<PutFunctionCodeSigningConfigResponse>(
  "PutFunctionCodeSigningConfigResponse",
)({ CodeSigningConfigArn: S.String, FunctionName: S.String }) {}
export class PutFunctionRecursionConfigResponse extends S.Class<PutFunctionRecursionConfigResponse>(
  "PutFunctionRecursionConfigResponse",
)({ RecursiveLoop: S.optional(S.String) }) {}
export class PutFunctionScalingConfigRequest extends S.Class<PutFunctionScalingConfigRequest>(
  "PutFunctionScalingConfigRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Qualifier: S.String.pipe(T.HttpQuery("Qualifier")),
    FunctionScalingConfig: S.optional(FunctionScalingConfig),
  },
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
) {}
export class PutRuntimeManagementConfigResponse extends S.Class<PutRuntimeManagementConfigResponse>(
  "PutRuntimeManagementConfigResponse",
)({
  UpdateRuntimeOn: S.String,
  FunctionArn: S.String,
  RuntimeVersionArn: S.optional(S.String),
}) {}
export class ListAliasesResponse extends S.Class<ListAliasesResponse>(
  "ListAliasesResponse",
)({ NextMarker: S.optional(S.String), Aliases: S.optional(AliasList) }) {}
export class ListVersionsByFunctionResponse extends S.Class<ListVersionsByFunctionResponse>(
  "ListVersionsByFunctionResponse",
)({ NextMarker: S.optional(S.String), Versions: S.optional(FunctionList) }) {}
export class AddLayerVersionPermissionResponse extends S.Class<AddLayerVersionPermissionResponse>(
  "AddLayerVersionPermissionResponse",
)({ Statement: S.optional(S.String), RevisionId: S.optional(S.String) }) {}
export class GetLayerVersionPolicyResponse extends S.Class<GetLayerVersionPolicyResponse>(
  "GetLayerVersionPolicyResponse",
)({ Policy: S.optional(S.String), RevisionId: S.optional(S.String) }) {}
export class PublishLayerVersionRequest extends S.Class<PublishLayerVersionRequest>(
  "PublishLayerVersionRequest",
)(
  {
    LayerName: S.String.pipe(T.HttpLabel("LayerName")),
    Description: S.optional(S.String),
    Content: LayerVersionContentInput,
    CompatibleRuntimes: S.optional(CompatibleRuntimes),
    LicenseInfo: S.optional(S.String),
    CompatibleArchitectures: S.optional(CompatibleArchitectures),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2018-10-31/layers/{LayerName}/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AddPermissionResponse extends S.Class<AddPermissionResponse>(
  "AddPermissionResponse",
)({ Statement: S.optional(S.String) }) {}
export class PutProvisionedConcurrencyConfigResponse extends S.Class<PutProvisionedConcurrencyConfigResponse>(
  "PutProvisionedConcurrencyConfigResponse",
)({
  RequestedProvisionedConcurrentExecutions: S.optional(S.Number),
  AvailableProvisionedConcurrentExecutions: S.optional(S.Number),
  AllocatedProvisionedConcurrentExecutions: S.optional(S.Number),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  LastModified: S.optional(S.String),
}) {}
export class GetProvisionedConcurrencyConfigResponse extends S.Class<GetProvisionedConcurrencyConfigResponse>(
  "GetProvisionedConcurrencyConfigResponse",
)({
  RequestedProvisionedConcurrentExecutions: S.optional(S.Number),
  AvailableProvisionedConcurrentExecutions: S.optional(S.Number),
  AllocatedProvisionedConcurrentExecutions: S.optional(S.Number),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  LastModified: S.optional(S.String),
}) {}
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
export class FunctionVersionsByCapacityProviderListItem extends S.Class<FunctionVersionsByCapacityProviderListItem>(
  "FunctionVersionsByCapacityProviderListItem",
)({ FunctionArn: S.String, State: S.String }) {}
export const FunctionVersionsByCapacityProviderList = S.Array(
  FunctionVersionsByCapacityProviderListItem,
);
export const CodeSigningConfigList = S.Array(CodeSigningConfig);
export class FunctionUrlConfig extends S.Class<FunctionUrlConfig>(
  "FunctionUrlConfig",
)({
  FunctionUrl: S.String,
  FunctionArn: S.String,
  CreationTime: S.String,
  LastModifiedTime: S.String,
  Cors: S.optional(Cors),
  AuthType: S.String,
  InvokeMode: S.optional(S.String),
}) {}
export const FunctionUrlConfigList = S.Array(FunctionUrlConfig);
export class ProvisionedConcurrencyConfigListItem extends S.Class<ProvisionedConcurrencyConfigListItem>(
  "ProvisionedConcurrencyConfigListItem",
)({
  FunctionArn: S.optional(S.String),
  RequestedProvisionedConcurrentExecutions: S.optional(S.Number),
  AvailableProvisionedConcurrentExecutions: S.optional(S.Number),
  AllocatedProvisionedConcurrentExecutions: S.optional(S.Number),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  LastModified: S.optional(S.String),
}) {}
export const ProvisionedConcurrencyConfigList = S.Array(
  ProvisionedConcurrencyConfigListItem,
);
export class FunctionCodeLocation extends S.Class<FunctionCodeLocation>(
  "FunctionCodeLocation",
)({
  RepositoryType: S.optional(S.String),
  Location: S.optional(S.String),
  ImageUri: S.optional(S.String),
  ResolvedImageUri: S.optional(S.String),
  SourceKMSKeyArn: S.optional(S.String),
}) {}
export class TagsError extends S.Class<TagsError>("TagsError")({
  ErrorCode: S.String,
  Message: S.String,
}) {}
export class LayerVersionsListItem extends S.Class<LayerVersionsListItem>(
  "LayerVersionsListItem",
)({
  LayerVersionArn: S.optional(S.String),
  Version: S.optional(S.Number),
  Description: S.optional(S.String),
  CreatedDate: S.optional(S.String),
  CompatibleRuntimes: S.optional(CompatibleRuntimes),
  LicenseInfo: S.optional(S.String),
  CompatibleArchitectures: S.optional(CompatibleArchitectures),
}) {}
export class LayersListItem extends S.Class<LayersListItem>("LayersListItem")({
  LayerName: S.optional(S.String),
  LayerArn: S.optional(S.String),
  LatestMatchingVersion: S.optional(LayerVersionsListItem),
}) {}
export const LayersList = S.Array(LayersListItem);
export const LayerVersionsList = S.Array(LayerVersionsListItem);
export class LayerVersionContentOutput extends S.Class<LayerVersionContentOutput>(
  "LayerVersionContentOutput",
)({
  Location: S.optional(S.String),
  CodeSha256: S.optional(S.String),
  CodeSize: S.optional(S.Number),
  SigningProfileVersionArn: S.optional(S.String),
  SigningJobArn: S.optional(S.String),
}) {}
export class CheckpointDurableExecutionRequest extends S.Class<CheckpointDurableExecutionRequest>(
  "CheckpointDurableExecutionRequest",
)(
  {
    DurableExecutionArn: S.String.pipe(T.HttpLabel("DurableExecutionArn")),
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
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
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
export class CreateCapacityProviderRequest extends S.Class<CreateCapacityProviderRequest>(
  "CreateCapacityProviderRequest",
)(
  {
    CapacityProviderName: S.String,
    VpcConfig: CapacityProviderVpcConfig,
    PermissionsConfig: CapacityProviderPermissionsConfig,
    InstanceRequirements: S.optional(InstanceRequirements),
    CapacityProviderScalingConfig: S.optional(CapacityProviderScalingConfig),
    KmsKeyArn: S.optional(S.String),
    Tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2025-11-30/capacity-providers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCapacityProviderResponse extends S.Class<GetCapacityProviderResponse>(
  "GetCapacityProviderResponse",
)({ CapacityProvider: CapacityProvider }) {}
export class ListFunctionVersionsByCapacityProviderResponse extends S.Class<ListFunctionVersionsByCapacityProviderResponse>(
  "ListFunctionVersionsByCapacityProviderResponse",
)({
  CapacityProviderArn: S.String,
  FunctionVersions: FunctionVersionsByCapacityProviderList,
  NextMarker: S.optional(S.String),
}) {}
export class CreateCodeSigningConfigResponse extends S.Class<CreateCodeSigningConfigResponse>(
  "CreateCodeSigningConfigResponse",
)({ CodeSigningConfig: CodeSigningConfig }) {}
export class ListCodeSigningConfigsResponse extends S.Class<ListCodeSigningConfigsResponse>(
  "ListCodeSigningConfigsResponse",
)({
  NextMarker: S.optional(S.String),
  CodeSigningConfigs: S.optional(CodeSigningConfigList),
}) {}
export class CreateFunctionRequest extends S.Class<CreateFunctionRequest>(
  "CreateFunctionRequest",
)(
  {
    FunctionName: S.String,
    Runtime: S.optional(S.String),
    Role: S.String,
    Handler: S.optional(S.String),
    Code: FunctionCode,
    Description: S.optional(S.String),
    Timeout: S.optional(S.Number),
    MemorySize: S.optional(S.Number),
    Publish: S.optional(S.Boolean),
    VpcConfig: S.optional(VpcConfig),
    PackageType: S.optional(S.String),
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
    PublishTo: S.optional(S.String),
    DurableConfig: S.optional(DurableConfig),
    TenancyConfig: S.optional(TenancyConfig),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2015-03-31/functions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFunctionUrlConfigResponse extends S.Class<CreateFunctionUrlConfigResponse>(
  "CreateFunctionUrlConfigResponse",
)({
  FunctionUrl: S.String,
  FunctionArn: S.String,
  AuthType: S.String,
  Cors: S.optional(Cors),
  CreationTime: S.String,
  InvokeMode: S.optional(S.String),
}) {}
export class ListFunctionUrlConfigsResponse extends S.Class<ListFunctionUrlConfigsResponse>(
  "ListFunctionUrlConfigsResponse",
)({
  FunctionUrlConfigs: FunctionUrlConfigList,
  NextMarker: S.optional(S.String),
}) {}
export class ListProvisionedConcurrencyConfigsResponse extends S.Class<ListProvisionedConcurrencyConfigsResponse>(
  "ListProvisionedConcurrencyConfigsResponse",
)({
  ProvisionedConcurrencyConfigs: S.optional(ProvisionedConcurrencyConfigList),
  NextMarker: S.optional(S.String),
}) {}
export class GetFunctionResponse extends S.Class<GetFunctionResponse>(
  "GetFunctionResponse",
)({
  Configuration: S.optional(FunctionConfiguration),
  Code: S.optional(FunctionCodeLocation),
  Tags: S.optional(Tags),
  TagsError: S.optional(TagsError),
  Concurrency: S.optional(Concurrency),
}) {}
export class PutFunctionScalingConfigResponse extends S.Class<PutFunctionScalingConfigResponse>(
  "PutFunctionScalingConfigResponse",
)({ FunctionState: S.optional(S.String) }) {}
export class CreateAliasRequest extends S.Class<CreateAliasRequest>(
  "CreateAliasRequest",
)(
  {
    FunctionName: S.String.pipe(T.HttpLabel("FunctionName")),
    Name: S.String,
    FunctionVersion: S.String,
    Description: S.optional(S.String),
    RoutingConfig: S.optional(AliasRoutingConfiguration),
  },
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
) {}
export class ListLayersResponse extends S.Class<ListLayersResponse>(
  "ListLayersResponse",
)({ NextMarker: S.optional(S.String), Layers: S.optional(LayersList) }) {}
export class ListLayerVersionsResponse extends S.Class<ListLayerVersionsResponse>(
  "ListLayerVersionsResponse",
)({
  NextMarker: S.optional(S.String),
  LayerVersions: S.optional(LayerVersionsList),
}) {}
export class GetLayerVersionResponse extends S.Class<GetLayerVersionResponse>(
  "GetLayerVersionResponse",
)({
  Content: S.optional(LayerVersionContentOutput),
  LayerArn: S.optional(S.String),
  LayerVersionArn: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedDate: S.optional(S.String),
  Version: S.optional(S.Number),
  CompatibleRuntimes: S.optional(CompatibleRuntimes),
  LicenseInfo: S.optional(S.String),
  CompatibleArchitectures: S.optional(CompatibleArchitectures),
}) {}
export class PublishLayerVersionResponse extends S.Class<PublishLayerVersionResponse>(
  "PublishLayerVersionResponse",
)({
  Content: S.optional(LayerVersionContentOutput),
  LayerArn: S.optional(S.String),
  LayerVersionArn: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedDate: S.optional(S.String),
  Version: S.optional(S.Number),
  CompatibleRuntimes: S.optional(CompatibleRuntimes),
  LicenseInfo: S.optional(S.String),
  CompatibleArchitectures: S.optional(CompatibleArchitectures),
}) {}
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
export class InvokeResponseStreamUpdate extends S.Class<InvokeResponseStreamUpdate>(
  "InvokeResponseStreamUpdate",
)({ Payload: S.optional(T.Blob).pipe(T.EventPayload()) }) {}
export class InvokeWithResponseStreamCompleteEvent extends S.Class<InvokeWithResponseStreamCompleteEvent>(
  "InvokeWithResponseStreamCompleteEvent",
)({
  ErrorCode: S.optional(S.String),
  ErrorDetails: S.optional(S.String),
  LogResult: S.optional(S.String),
}) {}
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
export const InvokeWithResponseStreamResponseEvent = T.EventStream(
  S.Union(
    S.Struct({ PayloadChunk: InvokeResponseStreamUpdate }),
    S.Struct({ InvokeComplete: InvokeWithResponseStreamCompleteEvent }),
  ),
);
export class GetDurableExecutionStateResponse extends S.Class<GetDurableExecutionStateResponse>(
  "GetDurableExecutionStateResponse",
)({ Operations: Operations, NextMarker: S.optional(S.String) }) {}
export class CreateCapacityProviderResponse extends S.Class<CreateCapacityProviderResponse>(
  "CreateCapacityProviderResponse",
)({ CapacityProvider: CapacityProvider }) {}
export class CreateEventSourceMappingRequest extends S.Class<CreateEventSourceMappingRequest>(
  "CreateEventSourceMappingRequest",
)(
  {
    EventSourceArn: S.optional(S.String),
    FunctionName: S.String,
    Enabled: S.optional(S.Boolean),
    BatchSize: S.optional(S.Number),
    FilterCriteria: S.optional(FilterCriteria),
    MaximumBatchingWindowInSeconds: S.optional(S.Number),
    ParallelizationFactor: S.optional(S.Number),
    StartingPosition: S.optional(S.String),
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
  },
  T.all(
    T.Http({ method: "POST", uri: "/2015-03-31/event-source-mappings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InvokeWithResponseStreamResponse extends S.Class<InvokeWithResponseStreamResponse>(
  "InvokeWithResponseStreamResponse",
)({
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
}) {}
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
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
) {}
export class CallbackTimeoutException extends S.TaggedError<CallbackTimeoutException>()(
  "CallbackTimeoutException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class ResourceConflictException extends S.TaggedError<ResourceConflictException>()(
  "ResourceConflictException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
) {}
export class CodeSigningConfigNotFoundException extends S.TaggedError<CodeSigningConfigNotFoundException>()(
  "CodeSigningConfigNotFoundException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class CodeStorageExceededException extends S.TaggedError<CodeStorageExceededException>()(
  "CodeStorageExceededException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
) {}
export class ServiceException extends S.TaggedError<ServiceException>()(
  "ServiceException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class CodeVerificationFailedException extends S.TaggedError<CodeVerificationFailedException>()(
  "CodeVerificationFailedException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class DurableExecutionAlreadyStartedException extends S.TaggedError<DurableExecutionAlreadyStartedException>()(
  "DurableExecutionAlreadyStartedException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class InvalidRequestContentException extends S.TaggedError<InvalidRequestContentException>()(
  "InvalidRequestContentException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
) {}
export class FunctionVersionsPerCapacityProviderLimitExceededException extends S.TaggedError<FunctionVersionsPerCapacityProviderLimitExceededException>()(
  "FunctionVersionsPerCapacityProviderLimitExceededException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
) {}
export class PolicyLengthExceededException extends S.TaggedError<PolicyLengthExceededException>()(
  "PolicyLengthExceededException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {
    retryAfterSeconds: S.optional(S.String).pipe(T.HttpHeader("Retry-After")),
    Type: S.optional(S.String),
    message: S.optional(S.String),
    Reason: S.optional(S.String),
  },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ParseError extends S.TaggedError<ParseError>()("ParseError", {}) {}
export class ProvisionedConcurrencyConfigNotFoundException extends S.TaggedError<ProvisionedConcurrencyConfigNotFoundException>()(
  "ProvisionedConcurrencyConfigNotFoundException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class PreconditionFailedException extends S.TaggedError<PreconditionFailedException>()(
  "PreconditionFailedException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
) {}
export class InvalidCodeSignatureException extends S.TaggedError<InvalidCodeSignatureException>()(
  "InvalidCodeSignatureException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class EC2AccessDeniedException extends S.TaggedError<EC2AccessDeniedException>()(
  "EC2AccessDeniedException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class InvalidRuntimeException extends S.TaggedError<InvalidRuntimeException>()(
  "InvalidRuntimeException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class CapacityProviderLimitExceededException extends S.TaggedError<CapacityProviderLimitExceededException>()(
  "CapacityProviderLimitExceededException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
) {}
export class EC2ThrottledException extends S.TaggedError<EC2ThrottledException>()(
  "EC2ThrottledException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class EC2UnexpectedException extends S.TaggedError<EC2UnexpectedException>()(
  "EC2UnexpectedException",
  {
    Type: S.optional(S.String),
    Message: S.optional(S.String),
    EC2ErrorCode: S.optional(S.String),
  },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class EFSIOException extends S.TaggedError<EFSIOException>()(
  "EFSIOException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class EFSMountConnectivityException extends S.TaggedError<EFSMountConnectivityException>()(
  "EFSMountConnectivityException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class EFSMountFailureException extends S.TaggedError<EFSMountFailureException>()(
  "EFSMountFailureException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class EFSMountTimeoutException extends S.TaggedError<EFSMountTimeoutException>()(
  "EFSMountTimeoutException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class ENILimitReachedException extends S.TaggedError<ENILimitReachedException>()(
  "ENILimitReachedException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class InvalidSecurityGroupIDException extends S.TaggedError<InvalidSecurityGroupIDException>()(
  "InvalidSecurityGroupIDException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class InvalidSubnetIDException extends S.TaggedError<InvalidSubnetIDException>()(
  "InvalidSubnetIDException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class InvalidZipFileException extends S.TaggedError<InvalidZipFileException>()(
  "InvalidZipFileException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class KMSAccessDeniedException extends S.TaggedError<KMSAccessDeniedException>()(
  "KMSAccessDeniedException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class KMSDisabledException extends S.TaggedError<KMSDisabledException>()(
  "KMSDisabledException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class KMSInvalidStateException extends S.TaggedError<KMSInvalidStateException>()(
  "KMSInvalidStateException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class KMSNotFoundException extends S.TaggedError<KMSNotFoundException>()(
  "KMSNotFoundException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class NoPublishedVersionException extends S.TaggedError<NoPublishedVersionException>()(
  "NoPublishedVersionException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class RecursiveInvocationException extends S.TaggedError<RecursiveInvocationException>()(
  "RecursiveInvocationException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class RequestTooLargeException extends S.TaggedError<RequestTooLargeException>()(
  "RequestTooLargeException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
) {}
export class ResourceNotReadyException extends S.TaggedError<ResourceNotReadyException>()(
  "ResourceNotReadyException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class SerializedRequestEntityTooLargeException extends S.TaggedError<SerializedRequestEntityTooLargeException>()(
  "SerializedRequestEntityTooLargeException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
) {}
export class SnapStartException extends S.TaggedError<SnapStartException>()(
  "SnapStartException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class SnapStartNotReadyException extends S.TaggedError<SnapStartNotReadyException>()(
  "SnapStartNotReadyException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class SnapStartTimeoutException extends S.TaggedError<SnapStartTimeoutException>()(
  "SnapStartTimeoutException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class SubnetIPAddressLimitReachedException extends S.TaggedError<SubnetIPAddressLimitReachedException>()(
  "SubnetIPAddressLimitReachedException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class UnsupportedMediaTypeException extends S.TaggedError<UnsupportedMediaTypeException>()(
  "UnsupportedMediaTypeException",
  { Type: S.optional(S.String), message: S.optional(S.String) },
) {}

//# Operations
/**
 * Creates a code signing configuration. A code signing configuration defines a list of allowed signing profiles and defines the code-signing validation policy (action to be taken if deployment validation checks fail).
 */
export const createCodeSigningConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCodeSigningConfigRequest,
    output: CreateCodeSigningConfigResponse,
    errors: [InvalidParameterValueException, ServiceException],
  }),
);
/**
 * Returns a list of code signing configurations. A request returns up to 10,000 configurations per call. You can use the `MaxItems` parameter to return fewer configurations per call.
 */
export const listCodeSigningConfigs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const deleteLayerVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLayerVersionRequest,
  output: DeleteLayerVersionResponse,
  errors: [ServiceException, TooManyRequestsException, ParseError],
}));
/**
 * Returns information about a version of an Lambda layer, with a link to download the layer archive that's valid for 10 minutes.
 */
export const getLayerVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const publishLayerVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getProvisionedConcurrencyConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateEventSourceMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates the configuration of a Lambda function alias.
 */
export const updateAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listFunctionEventInvokeConfigs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns information about the specified code signing configuration.
 */
export const getCodeSigningConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCodeSigningConfigRequest,
    output: GetCodeSigningConfigResponse,
    errors: [
      InvalidParameterValueException,
      ResourceNotFoundException,
      ServiceException,
      ParseError,
    ],
  }),
);
/**
 * List the functions that use the specified code signing configuration. You can use this method prior to deleting a code signing configuration, to verify that no functions are using it.
 */
export const listFunctionsByCodeSigningConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const updateCodeSigningConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateCodeSigningConfigRequest,
    output: UpdateCodeSigningConfigResponse,
    errors: [
      InvalidParameterValueException,
      ResourceNotFoundException,
      ServiceException,
    ],
  }),
);
/**
 * Lists event source mappings. Specify an `EventSourceArn` to show only event source mappings for a single event source.
 */
export const listEventSourceMappings =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const deleteFunctionUrlConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteFunctionUrlConfigRequest,
    output: DeleteFunctionUrlConfigResponse,
    errors: [
      ResourceConflictException,
      ResourceNotFoundException,
      ServiceException,
      TooManyRequestsException,
      ParseError,
    ],
  }),
);
/**
 * Returns details about the reserved concurrency configuration for a function. To set a concurrency limit for a function, use PutFunctionConcurrency.
 */
export const getFunctionConcurrency = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetFunctionConcurrencyRequest,
    output: GetFunctionConcurrencyResponse,
    errors: [
      InvalidParameterValueException,
      ResourceNotFoundException,
      ServiceException,
      TooManyRequestsException,
      ParseError,
    ],
  }),
);
/**
 * Returns details about a Lambda function URL.
 */
export const getFunctionUrlConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetFunctionUrlConfigRequest,
    output: GetFunctionUrlConfigResponse,
    errors: [
      InvalidParameterValueException,
      ResourceNotFoundException,
      ServiceException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Sets the maximum number of simultaneous executions for a function, and reserves capacity for that concurrency level.
 *
 * Concurrency settings apply to the function as a whole, including all published versions and the unpublished version. Reserving concurrency both ensures that your function has capacity to process the specified number of events simultaneously, and prevents it from scaling beyond that level. Use GetFunction to see the current setting for a function.
 *
 * Use GetAccountSettings to see your Regional concurrency limit. You can reserve concurrency for as many functions as you like, as long as you leave at least 100 simultaneous executions unreserved for functions that aren't configured with a per-function limit. For more information, see Lambda function scaling.
 */
export const putFunctionConcurrency = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates the configuration for a Lambda function URL.
 */
export const updateFunctionUrlConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Returns the code signing configuration for the specified function.
 */
export const getFunctionCodeSigningConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getFunctionRecursionConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetFunctionRecursionConfigRequest,
    output: GetFunctionRecursionConfigResponse,
    errors: [
      InvalidParameterValueException,
      ResourceNotFoundException,
      ServiceException,
      TooManyRequestsException,
      ParseError,
    ],
  }),
);
/**
 * Retrieves the scaling configuration for a Lambda Managed Instances function.
 */
export const getFunctionScalingConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetFunctionScalingConfigRequest,
    output: GetFunctionScalingConfigResponse,
    errors: [
      InvalidParameterValueException,
      ResourceNotFoundException,
      ServiceException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Returns the resource-based IAM policy for a function, version, or alias.
 */
export const getPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRuntimeManagementConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRuntimeManagementConfigRequest,
    output: GetRuntimeManagementConfigResponse,
    errors: [
      InvalidParameterValueException,
      ResourceNotFoundException,
      ServiceException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Update the code signing configuration for the function. Changes to the code signing configuration take effect the next time a user tries to deploy a code package to the function.
 */
export const putFunctionCodeSigningConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putFunctionRecursionConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Sets the runtime management configuration for a function's version. For more information, see Runtime updates.
 */
export const putRuntimeManagementConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutRuntimeManagementConfigRequest,
    output: PutRuntimeManagementConfigResponse,
    errors: [
      InvalidParameterValueException,
      ResourceConflictException,
      ResourceNotFoundException,
      ServiceException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Returns details about a Lambda function alias.
 */
export const getAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAliases = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Returns a list of versions, with the version-specific configuration of each. Lambda returns up to 50 versions per call.
 */
export const listVersionsByFunction =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getLayerVersionPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetLayerVersionPolicyRequest,
    output: GetLayerVersionPolicyResponse,
    errors: [
      InvalidParameterValueException,
      ResourceNotFoundException,
      ServiceException,
      TooManyRequestsException,
      ParseError,
    ],
  }),
);
/**
 * Adds a provisioned concurrency configuration to a function's alias or version.
 */
export const putProvisionedConcurrencyConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes the code signing configuration. You can delete the code signing configuration only if no function is using it.
 */
export const deleteCodeSigningConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCodeSigningConfigRequest,
    output: DeleteCodeSigningConfigResponse,
    errors: [
      InvalidParameterValueException,
      ResourceConflictException,
      ResourceNotFoundException,
      ServiceException,
      ParseError,
    ],
  }),
);
/**
 * Removes a concurrent execution limit from a function.
 */
export const deleteFunctionConcurrency = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Returns the version-specific settings of a Lambda function or version. The output includes only options that can vary between versions of a function. To modify these settings, use UpdateFunctionConfiguration.
 *
 * To get all of a function's details, including function-level settings, use GetFunction.
 */
export const getFunctionConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetFunctionConfigurationRequest,
    output: FunctionConfiguration,
    errors: [
      InvalidParameterValueException,
      ResourceNotFoundException,
      ServiceException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Returns information about a version of an Lambda layer, with a link to download the layer archive that's valid for 10 minutes.
 */
export const getLayerVersionByArn = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetLayerVersionByArnRequest,
    output: GetLayerVersionResponse,
    errors: [
      InvalidParameterValueException,
      ResourceNotFoundException,
      ServiceException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Deletes the provisioned concurrency configuration for a function.
 */
export const deleteProvisionedConcurrencyConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
      ParseError,
    ],
  }));
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
    ParseError,
  ],
}));
/**
 * Updates the configuration of an existing capacity provider.
 */
export const updateCapacityProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateCapacityProviderRequest,
    output: UpdateCapacityProviderResponse,
    errors: [
      InvalidParameterValueException,
      ResourceConflictException,
      ResourceNotFoundException,
      ServiceException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Deletes a capacity provider. You cannot delete a capacity provider that is currently being used by Lambda functions.
 */
export const deleteCapacityProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCapacityProviderRequest,
    output: DeleteCapacityProviderResponse,
    errors: [
      InvalidParameterValueException,
      ResourceConflictException,
      ResourceNotFoundException,
      ServiceException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Removes the code signing configuration from the function.
 */
export const deleteFunctionCodeSigningConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Grants a principal permission to use a function. You can apply the policy at the function level, or specify a qualifier to restrict access to a single version or alias. If you use a qualifier, the invoker must use the full Amazon Resource Name (ARN) of that version or alias to invoke the function. Note: Lambda does not support adding policies to version $LATEST.
 *
 * To grant permission to another account, specify the account ID as the `Principal`. To grant permission to an organization defined in Organizations, specify the organization ID as the `PrincipalOrgID`. For Amazon Web Services services, the principal is a domain-style identifier that the service defines, such as `s3.amazonaws.com` or `sns.amazonaws.com`. For Amazon Web Services services, you can also specify the ARN of the associated resource as the `SourceArn`. If you grant permission to a service principal without specifying the source, other accounts could potentially configure resources in their account to invoke your Lambda function.
 *
 * This operation adds a statement to a resource-based permissions policy for the function. For more information about function policies, see Using resource-based policies for Lambda.
 */
export const addPermission = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves details about your account's limits and usage in an Amazon Web Services Region.
 */
export const getAccountSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountSettingsRequest,
  output: GetAccountSettingsResponse,
  errors: [ServiceException, TooManyRequestsException],
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
 * Returns a list of capacity providers in your account.
 */
export const listCapacityProviders =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listFunctions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
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
      ParseError,
    ],
  }));
/**
 * Returns a list of durable executions for a specified Lambda function. You can filter the results by execution name, status, and start time range. This API supports pagination for large result sets.
 */
export const listDurableExecutionsByFunction =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
      ParseError,
    ],
  }));
/**
 * Retrieves information about a specific capacity provider, including its configuration, state, and associated resources.
 */
export const getCapacityProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listFunctionVersionsByCapacityProvider =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getEventSourceMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetEventSourceMappingRequest,
    output: EventSourceMappingConfiguration,
    errors: [
      InvalidParameterValueException,
      ResourceNotFoundException,
      ServiceException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Creates a Lambda function URL with the specified configuration parameters. A function URL is a dedicated HTTP(S) endpoint that you can use to invoke your function.
 */
export const createFunctionUrlConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Returns a list of Lambda function URLs for the specified function.
 */
export const listFunctionUrlConfigs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listProvisionedConcurrencyConfigs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putFunctionScalingConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutFunctionScalingConfigRequest,
    output: PutFunctionScalingConfigResponse,
    errors: [
      InvalidParameterValueException,
      ResourceConflictException,
      ResourceNotFoundException,
      ServiceException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Creates an alias for a Lambda function version. Use aliases to provide clients with a function identifier that you can update to invoke a different version.
 *
 * You can also map an alias to split invocation requests between two versions. Use the `RoutingConfig` parameter to specify a second version and the percentage of invocation requests that it receives.
 */
export const createAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listLayers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listLayerVersions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Deletes an event source mapping. You can get the identifier of a mapping from the output of ListEventSourceMappings.
 *
 * When you delete an event source mapping, it enters a `Deleting` state and might not be completely deleted for several seconds.
 */
export const deleteEventSourceMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Removes a statement from the permissions policy for a version of an Lambda layer. For more information, see AddLayerVersionPermission.
 */
export const removeLayerVersionPermission =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const removePermission = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const publishVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const addLayerVersionPermission = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Retrieves the current execution state required for the replay process during durable function execution. This API is used by the Lambda durable functions SDK to get state information needed for replay. You typically don't need to call this API directly as the SDK handles state management automatically.
 *
 * The response contains operations ordered by start sequence number in ascending order. Completed operations with children don't include child operation details since they don't need to be replayed.
 */
export const getDurableExecutionState =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createEventSourceMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Modify the version-specific settings of a Lambda function.
 *
 * When you update a function, Lambda provisions an instance of the function and its supporting resources. If your function connects to a VPC, this process can take a minute. During this time, you can't modify the function, but you can still invoke it. The `LastUpdateStatus`, `LastUpdateStatusReason`, and `LastUpdateStatusReasonCode` fields in the response from GetFunctionConfiguration indicate when the update is complete and the function is processing events with the new configuration. For more information, see Lambda function states.
 *
 * These settings can vary between versions of a function and are locked when you publish a version. You can't modify the configuration of a published version, only the unpublished version.
 *
 * To configure function concurrency, use PutFunctionConcurrency. To grant invoke permissions to an Amazon Web Services account or Amazon Web Services service, use AddPermission.
 */
export const updateFunctionConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * For asynchronous function invocation, use Invoke.
 *
 * Invokes a function asynchronously.
 *
 * The payload limit is 256KB. For larger payloads, for up to 1MB, use Invoke.
 *
 * If you do use the InvokeAsync action, note that it doesn't support the use of X-Ray active tracing. Trace ID is not propagated to the function, even if X-Ray active tracing is turned on.
 */
export const invokeAsync = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateFunctionCode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDurableExecutionHistory =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createCapacityProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCapacityProviderRequest,
    output: CreateCapacityProviderResponse,
    errors: [
      CapacityProviderLimitExceededException,
      InvalidParameterValueException,
      ResourceConflictException,
      ServiceException,
      TooManyRequestsException,
    ],
  }),
);
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
export const invoke = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const invokeWithResponseStream = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
