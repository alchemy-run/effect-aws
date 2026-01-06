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
const svc = T.AwsApiService({
  sdkId: "IoT Events",
  serviceShapeName: "IotColumboService",
});
const auth = T.AwsAuthSigv4({ name: "iotevents" });
const ver = T.ServiceVersion("2018-07-27");
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
                        url: "https://iotevents-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://iotevents-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://iotevents.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://iotevents.{Region}.{PartitionResult#dnsSuffix}",
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

//# Newtypes
export type AlarmModelName = string;
export type AlarmModelDescription = string;
export type AmazonResourceName = string;
export type AttributeJsonPath = string;
export type Severity = number;
export type DetectorModelName = string;
export type DetectorModelDescription = string;
export type InputName = string;
export type InputDescription = string;
export type AlarmModelVersion = string;
export type DetectorModelVersion = string;
export type AnalysisId = string;
export type NextToken = string;
export type MaxAnalysisResults = number;
export type MaxResults = number;
export type TagKey = string;
export type TagValue = string;
export type StateName = string;
export type errorMessage = string;
export type AlarmModelArn = string;
export type StatusMessage = string;
export type InputProperty = string;
export type Threshold = string;
export type KeyValue = string;
export type AnalysisType = string;
export type AnalysisMessage = string;
export type DetectorModelArn = string;
export type InputArn = string;
export type SMSSenderId = string;
export type NotificationAdditionalMessage = string;
export type FromEmail = string;
export type MQTTTopic = string;
export type QueueUrl = string;
export type DeliveryStreamName = string;
export type FirehoseSeparator = string;
export type DynamoKeyType = string;
export type DynamoKeyField = string;
export type DynamoKeyValue = string;
export type DynamoOperation = string;
export type DynamoTableName = string;
export type AssetPropertyEntryId = string;
export type AssetId = string;
export type AssetPropertyId = string;
export type AssetPropertyAlias = string;
export type AssetModelId = string;
export type AnalysisResultLocationPath = string;
export type EmailSubject = string;
export type ContentExpression = string;
export type AssetPropertyQuality = string;
export type EventName = string;
export type Condition = string;
export type IdentityStoreId = string;
export type SSOReferenceId = string;
export type AssetPropertyStringValue = string;
export type AssetPropertyIntegerValue = string;
export type AssetPropertyDoubleValue = string;
export type AssetPropertyBooleanValue = string;
export type AssetPropertyTimeInSeconds = string;
export type AssetPropertyOffsetInNanos = string;
export type VariableName = string;
export type VariableValue = string;
export type TimerName = string;
export type Seconds = number;
export type resourceId = string;
export type resourceArn = string;
export type ResourceName = string;

//# Schemas
export interface DescribeLoggingOptionsRequest {}
export const DescribeLoggingOptionsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/logging" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeLoggingOptionsRequest",
}) as any as S.Schema<DescribeLoggingOptionsRequest>;
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export interface DeleteAlarmModelRequest {
  alarmModelName: string;
}
export const DeleteAlarmModelRequest = S.suspend(() =>
  S.Struct({
    alarmModelName: S.String.pipe(T.HttpLabel("alarmModelName")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/alarm-models/{alarmModelName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAlarmModelRequest",
}) as any as S.Schema<DeleteAlarmModelRequest>;
export interface DeleteAlarmModelResponse {}
export const DeleteAlarmModelResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAlarmModelResponse",
}) as any as S.Schema<DeleteAlarmModelResponse>;
export interface DeleteDetectorModelRequest {
  detectorModelName: string;
}
export const DeleteDetectorModelRequest = S.suspend(() =>
  S.Struct({
    detectorModelName: S.String.pipe(T.HttpLabel("detectorModelName")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/detector-models/{detectorModelName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDetectorModelRequest",
}) as any as S.Schema<DeleteDetectorModelRequest>;
export interface DeleteDetectorModelResponse {}
export const DeleteDetectorModelResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDetectorModelResponse",
}) as any as S.Schema<DeleteDetectorModelResponse>;
export interface DeleteInputRequest {
  inputName: string;
}
export const DeleteInputRequest = S.suspend(() =>
  S.Struct({ inputName: S.String.pipe(T.HttpLabel("inputName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/inputs/{inputName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteInputRequest",
}) as any as S.Schema<DeleteInputRequest>;
export interface DeleteInputResponse {}
export const DeleteInputResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteInputResponse",
}) as any as S.Schema<DeleteInputResponse>;
export interface DescribeAlarmModelRequest {
  alarmModelName: string;
  alarmModelVersion?: string;
}
export const DescribeAlarmModelRequest = S.suspend(() =>
  S.Struct({
    alarmModelName: S.String.pipe(T.HttpLabel("alarmModelName")),
    alarmModelVersion: S.optional(S.String).pipe(T.HttpQuery("version")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/alarm-models/{alarmModelName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAlarmModelRequest",
}) as any as S.Schema<DescribeAlarmModelRequest>;
export interface DescribeDetectorModelRequest {
  detectorModelName: string;
  detectorModelVersion?: string;
}
export const DescribeDetectorModelRequest = S.suspend(() =>
  S.Struct({
    detectorModelName: S.String.pipe(T.HttpLabel("detectorModelName")),
    detectorModelVersion: S.optional(S.String).pipe(T.HttpQuery("version")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/detector-models/{detectorModelName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDetectorModelRequest",
}) as any as S.Schema<DescribeDetectorModelRequest>;
export interface DescribeDetectorModelAnalysisRequest {
  analysisId: string;
}
export const DescribeDetectorModelAnalysisRequest = S.suspend(() =>
  S.Struct({ analysisId: S.String.pipe(T.HttpLabel("analysisId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/analysis/detector-models/{analysisId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDetectorModelAnalysisRequest",
}) as any as S.Schema<DescribeDetectorModelAnalysisRequest>;
export interface DescribeInputRequest {
  inputName: string;
}
export const DescribeInputRequest = S.suspend(() =>
  S.Struct({ inputName: S.String.pipe(T.HttpLabel("inputName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/inputs/{inputName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeInputRequest",
}) as any as S.Schema<DescribeInputRequest>;
export interface GetDetectorModelAnalysisResultsRequest {
  analysisId: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetDetectorModelAnalysisResultsRequest = S.suspend(() =>
  S.Struct({
    analysisId: S.String.pipe(T.HttpLabel("analysisId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/analysis/detector-models/{analysisId}/results",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDetectorModelAnalysisResultsRequest",
}) as any as S.Schema<GetDetectorModelAnalysisResultsRequest>;
export interface ListAlarmModelsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListAlarmModelsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/alarm-models" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAlarmModelsRequest",
}) as any as S.Schema<ListAlarmModelsRequest>;
export interface ListAlarmModelVersionsRequest {
  alarmModelName: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAlarmModelVersionsRequest = S.suspend(() =>
  S.Struct({
    alarmModelName: S.String.pipe(T.HttpLabel("alarmModelName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/alarm-models/{alarmModelName}/versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAlarmModelVersionsRequest",
}) as any as S.Schema<ListAlarmModelVersionsRequest>;
export interface ListDetectorModelsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListDetectorModelsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/detector-models" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDetectorModelsRequest",
}) as any as S.Schema<ListDetectorModelsRequest>;
export interface ListDetectorModelVersionsRequest {
  detectorModelName: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListDetectorModelVersionsRequest = S.suspend(() =>
  S.Struct({
    detectorModelName: S.String.pipe(T.HttpLabel("detectorModelName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/detector-models/{detectorModelName}/versions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDetectorModelVersionsRequest",
}) as any as S.Schema<ListDetectorModelVersionsRequest>;
export interface ListInputsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListInputsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/inputs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListInputsRequest",
}) as any as S.Schema<ListInputsRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpQuery("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags" }),
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
export interface DetectorDebugOption {
  detectorModelName: string;
  keyValue?: string;
}
export const DetectorDebugOption = S.suspend(() =>
  S.Struct({ detectorModelName: S.String, keyValue: S.optional(S.String) }),
).annotations({
  identifier: "DetectorDebugOption",
}) as any as S.Schema<DetectorDebugOption>;
export type DetectorDebugOptions = DetectorDebugOption[];
export const DetectorDebugOptions = S.Array(DetectorDebugOption);
export interface LoggingOptions {
  roleArn: string;
  level: string;
  enabled: boolean;
  detectorDebugOptions?: DetectorDebugOptions;
}
export const LoggingOptions = S.suspend(() =>
  S.Struct({
    roleArn: S.String,
    level: S.String,
    enabled: S.Boolean,
    detectorDebugOptions: S.optional(DetectorDebugOptions),
  }),
).annotations({
  identifier: "LoggingOptions",
}) as any as S.Schema<LoggingOptions>;
export interface PutLoggingOptionsRequest {
  loggingOptions: LoggingOptions;
}
export const PutLoggingOptionsRequest = S.suspend(() =>
  S.Struct({ loggingOptions: LoggingOptions }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/logging" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutLoggingOptionsRequest",
}) as any as S.Schema<PutLoggingOptionsRequest>;
export interface PutLoggingOptionsResponse {}
export const PutLoggingOptionsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutLoggingOptionsResponse",
}) as any as S.Schema<PutLoggingOptionsResponse>;
export interface SetVariableAction {
  variableName: string;
  value: string;
}
export const SetVariableAction = S.suspend(() =>
  S.Struct({ variableName: S.String, value: S.String }),
).annotations({
  identifier: "SetVariableAction",
}) as any as S.Schema<SetVariableAction>;
export interface Payload {
  contentExpression: string;
  type: string;
}
export const Payload = S.suspend(() =>
  S.Struct({ contentExpression: S.String, type: S.String }),
).annotations({ identifier: "Payload" }) as any as S.Schema<Payload>;
export interface SNSTopicPublishAction {
  targetArn: string;
  payload?: Payload;
}
export const SNSTopicPublishAction = S.suspend(() =>
  S.Struct({ targetArn: S.String, payload: S.optional(Payload) }),
).annotations({
  identifier: "SNSTopicPublishAction",
}) as any as S.Schema<SNSTopicPublishAction>;
export interface IotTopicPublishAction {
  mqttTopic: string;
  payload?: Payload;
}
export const IotTopicPublishAction = S.suspend(() =>
  S.Struct({ mqttTopic: S.String, payload: S.optional(Payload) }),
).annotations({
  identifier: "IotTopicPublishAction",
}) as any as S.Schema<IotTopicPublishAction>;
export interface SetTimerAction {
  timerName: string;
  seconds?: number;
  durationExpression?: string;
}
export const SetTimerAction = S.suspend(() =>
  S.Struct({
    timerName: S.String,
    seconds: S.optional(S.Number),
    durationExpression: S.optional(S.String),
  }),
).annotations({
  identifier: "SetTimerAction",
}) as any as S.Schema<SetTimerAction>;
export interface ClearTimerAction {
  timerName: string;
}
export const ClearTimerAction = S.suspend(() =>
  S.Struct({ timerName: S.String }),
).annotations({
  identifier: "ClearTimerAction",
}) as any as S.Schema<ClearTimerAction>;
export interface ResetTimerAction {
  timerName: string;
}
export const ResetTimerAction = S.suspend(() =>
  S.Struct({ timerName: S.String }),
).annotations({
  identifier: "ResetTimerAction",
}) as any as S.Schema<ResetTimerAction>;
export interface LambdaAction {
  functionArn: string;
  payload?: Payload;
}
export const LambdaAction = S.suspend(() =>
  S.Struct({ functionArn: S.String, payload: S.optional(Payload) }),
).annotations({ identifier: "LambdaAction" }) as any as S.Schema<LambdaAction>;
export interface IotEventsAction {
  inputName: string;
  payload?: Payload;
}
export const IotEventsAction = S.suspend(() =>
  S.Struct({ inputName: S.String, payload: S.optional(Payload) }),
).annotations({
  identifier: "IotEventsAction",
}) as any as S.Schema<IotEventsAction>;
export interface SqsAction {
  queueUrl: string;
  useBase64?: boolean;
  payload?: Payload;
}
export const SqsAction = S.suspend(() =>
  S.Struct({
    queueUrl: S.String,
    useBase64: S.optional(S.Boolean),
    payload: S.optional(Payload),
  }),
).annotations({ identifier: "SqsAction" }) as any as S.Schema<SqsAction>;
export interface FirehoseAction {
  deliveryStreamName: string;
  separator?: string;
  payload?: Payload;
}
export const FirehoseAction = S.suspend(() =>
  S.Struct({
    deliveryStreamName: S.String,
    separator: S.optional(S.String),
    payload: S.optional(Payload),
  }),
).annotations({
  identifier: "FirehoseAction",
}) as any as S.Schema<FirehoseAction>;
export interface DynamoDBAction {
  hashKeyType?: string;
  hashKeyField: string;
  hashKeyValue: string;
  rangeKeyType?: string;
  rangeKeyField?: string;
  rangeKeyValue?: string;
  operation?: string;
  payloadField?: string;
  tableName: string;
  payload?: Payload;
}
export const DynamoDBAction = S.suspend(() =>
  S.Struct({
    hashKeyType: S.optional(S.String),
    hashKeyField: S.String,
    hashKeyValue: S.String,
    rangeKeyType: S.optional(S.String),
    rangeKeyField: S.optional(S.String),
    rangeKeyValue: S.optional(S.String),
    operation: S.optional(S.String),
    payloadField: S.optional(S.String),
    tableName: S.String,
    payload: S.optional(Payload),
  }),
).annotations({
  identifier: "DynamoDBAction",
}) as any as S.Schema<DynamoDBAction>;
export interface DynamoDBv2Action {
  tableName: string;
  payload?: Payload;
}
export const DynamoDBv2Action = S.suspend(() =>
  S.Struct({ tableName: S.String, payload: S.optional(Payload) }),
).annotations({
  identifier: "DynamoDBv2Action",
}) as any as S.Schema<DynamoDBv2Action>;
export interface AssetPropertyVariant {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: string;
  booleanValue?: string;
}
export const AssetPropertyVariant = S.suspend(() =>
  S.Struct({
    stringValue: S.optional(S.String),
    integerValue: S.optional(S.String),
    doubleValue: S.optional(S.String),
    booleanValue: S.optional(S.String),
  }),
).annotations({
  identifier: "AssetPropertyVariant",
}) as any as S.Schema<AssetPropertyVariant>;
export interface AssetPropertyTimestamp {
  timeInSeconds: string;
  offsetInNanos?: string;
}
export const AssetPropertyTimestamp = S.suspend(() =>
  S.Struct({ timeInSeconds: S.String, offsetInNanos: S.optional(S.String) }),
).annotations({
  identifier: "AssetPropertyTimestamp",
}) as any as S.Schema<AssetPropertyTimestamp>;
export interface AssetPropertyValue {
  value?: AssetPropertyVariant;
  timestamp?: AssetPropertyTimestamp;
  quality?: string;
}
export const AssetPropertyValue = S.suspend(() =>
  S.Struct({
    value: S.optional(AssetPropertyVariant),
    timestamp: S.optional(AssetPropertyTimestamp),
    quality: S.optional(S.String),
  }),
).annotations({
  identifier: "AssetPropertyValue",
}) as any as S.Schema<AssetPropertyValue>;
export interface IotSiteWiseAction {
  entryId?: string;
  assetId?: string;
  propertyId?: string;
  propertyAlias?: string;
  propertyValue?: AssetPropertyValue;
}
export const IotSiteWiseAction = S.suspend(() =>
  S.Struct({
    entryId: S.optional(S.String),
    assetId: S.optional(S.String),
    propertyId: S.optional(S.String),
    propertyAlias: S.optional(S.String),
    propertyValue: S.optional(AssetPropertyValue),
  }),
).annotations({
  identifier: "IotSiteWiseAction",
}) as any as S.Schema<IotSiteWiseAction>;
export interface Action {
  setVariable?: SetVariableAction;
  sns?: SNSTopicPublishAction;
  iotTopicPublish?: IotTopicPublishAction;
  setTimer?: SetTimerAction;
  clearTimer?: ClearTimerAction;
  resetTimer?: ResetTimerAction;
  lambda?: LambdaAction;
  iotEvents?: IotEventsAction;
  sqs?: SqsAction;
  firehose?: FirehoseAction;
  dynamoDB?: DynamoDBAction;
  dynamoDBv2?: DynamoDBv2Action;
  iotSiteWise?: IotSiteWiseAction;
}
export const Action = S.suspend(() =>
  S.Struct({
    setVariable: S.optional(SetVariableAction),
    sns: S.optional(SNSTopicPublishAction),
    iotTopicPublish: S.optional(IotTopicPublishAction),
    setTimer: S.optional(SetTimerAction),
    clearTimer: S.optional(ClearTimerAction),
    resetTimer: S.optional(ResetTimerAction),
    lambda: S.optional(LambdaAction),
    iotEvents: S.optional(IotEventsAction),
    sqs: S.optional(SqsAction),
    firehose: S.optional(FirehoseAction),
    dynamoDB: S.optional(DynamoDBAction),
    dynamoDBv2: S.optional(DynamoDBv2Action),
    iotSiteWise: S.optional(IotSiteWiseAction),
  }),
).annotations({ identifier: "Action" }) as any as S.Schema<Action>;
export type Actions = Action[];
export const Actions = S.Array(Action);
export interface Event {
  eventName: string;
  condition?: string;
  actions?: Actions;
}
export const Event = S.suspend(() =>
  S.Struct({
    eventName: S.String,
    condition: S.optional(S.String),
    actions: S.optional(Actions),
  }),
).annotations({ identifier: "Event" }) as any as S.Schema<Event>;
export type Events = Event[];
export const Events = S.Array(Event);
export interface TransitionEvent {
  eventName: string;
  condition: string;
  actions?: Actions;
  nextState: string;
}
export const TransitionEvent = S.suspend(() =>
  S.Struct({
    eventName: S.String,
    condition: S.String,
    actions: S.optional(Actions),
    nextState: S.String,
  }),
).annotations({
  identifier: "TransitionEvent",
}) as any as S.Schema<TransitionEvent>;
export type TransitionEvents = TransitionEvent[];
export const TransitionEvents = S.Array(TransitionEvent);
export interface OnInputLifecycle {
  events?: Events;
  transitionEvents?: TransitionEvents;
}
export const OnInputLifecycle = S.suspend(() =>
  S.Struct({
    events: S.optional(Events),
    transitionEvents: S.optional(TransitionEvents),
  }),
).annotations({
  identifier: "OnInputLifecycle",
}) as any as S.Schema<OnInputLifecycle>;
export interface OnEnterLifecycle {
  events?: Events;
}
export const OnEnterLifecycle = S.suspend(() =>
  S.Struct({ events: S.optional(Events) }),
).annotations({
  identifier: "OnEnterLifecycle",
}) as any as S.Schema<OnEnterLifecycle>;
export interface OnExitLifecycle {
  events?: Events;
}
export const OnExitLifecycle = S.suspend(() =>
  S.Struct({ events: S.optional(Events) }),
).annotations({
  identifier: "OnExitLifecycle",
}) as any as S.Schema<OnExitLifecycle>;
export interface State {
  stateName: string;
  onInput?: OnInputLifecycle;
  onEnter?: OnEnterLifecycle;
  onExit?: OnExitLifecycle;
}
export const State = S.suspend(() =>
  S.Struct({
    stateName: S.String,
    onInput: S.optional(OnInputLifecycle),
    onEnter: S.optional(OnEnterLifecycle),
    onExit: S.optional(OnExitLifecycle),
  }),
).annotations({ identifier: "State" }) as any as S.Schema<State>;
export type States = State[];
export const States = S.Array(State);
export interface DetectorModelDefinition {
  states: States;
  initialStateName: string;
}
export const DetectorModelDefinition = S.suspend(() =>
  S.Struct({ states: States, initialStateName: S.String }),
).annotations({
  identifier: "DetectorModelDefinition",
}) as any as S.Schema<DetectorModelDefinition>;
export interface StartDetectorModelAnalysisRequest {
  detectorModelDefinition: DetectorModelDefinition;
}
export const StartDetectorModelAnalysisRequest = S.suspend(() =>
  S.Struct({ detectorModelDefinition: DetectorModelDefinition }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/analysis/detector-models" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartDetectorModelAnalysisRequest",
}) as any as S.Schema<StartDetectorModelAnalysisRequest>;
export interface Tag {
  key: string;
  value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export interface TagResourceRequest {
  resourceArn: string;
  tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    tags: Tags,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags" }),
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
  tagKeys: TagKeys;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags" }),
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
export interface SimpleRule {
  inputProperty: string;
  comparisonOperator: string;
  threshold: string;
}
export const SimpleRule = S.suspend(() =>
  S.Struct({
    inputProperty: S.String,
    comparisonOperator: S.String,
    threshold: S.String,
  }),
).annotations({ identifier: "SimpleRule" }) as any as S.Schema<SimpleRule>;
export interface AlarmRule {
  simpleRule?: SimpleRule;
}
export const AlarmRule = S.suspend(() =>
  S.Struct({ simpleRule: S.optional(SimpleRule) }),
).annotations({ identifier: "AlarmRule" }) as any as S.Schema<AlarmRule>;
export interface NotificationTargetActions {
  lambdaAction?: LambdaAction;
}
export const NotificationTargetActions = S.suspend(() =>
  S.Struct({ lambdaAction: S.optional(LambdaAction) }),
).annotations({
  identifier: "NotificationTargetActions",
}) as any as S.Schema<NotificationTargetActions>;
export interface SSOIdentity {
  identityStoreId: string;
  userId?: string;
}
export const SSOIdentity = S.suspend(() =>
  S.Struct({ identityStoreId: S.String, userId: S.optional(S.String) }),
).annotations({ identifier: "SSOIdentity" }) as any as S.Schema<SSOIdentity>;
export interface RecipientDetail {
  ssoIdentity?: SSOIdentity;
}
export const RecipientDetail = S.suspend(() =>
  S.Struct({ ssoIdentity: S.optional(SSOIdentity) }),
).annotations({
  identifier: "RecipientDetail",
}) as any as S.Schema<RecipientDetail>;
export type RecipientDetails = RecipientDetail[];
export const RecipientDetails = S.Array(RecipientDetail);
export interface SMSConfiguration {
  senderId?: string;
  additionalMessage?: string;
  recipients: RecipientDetails;
}
export const SMSConfiguration = S.suspend(() =>
  S.Struct({
    senderId: S.optional(S.String),
    additionalMessage: S.optional(S.String),
    recipients: RecipientDetails,
  }),
).annotations({
  identifier: "SMSConfiguration",
}) as any as S.Schema<SMSConfiguration>;
export type SMSConfigurations = SMSConfiguration[];
export const SMSConfigurations = S.Array(SMSConfiguration);
export interface EmailContent {
  subject?: string;
  additionalMessage?: string;
}
export const EmailContent = S.suspend(() =>
  S.Struct({
    subject: S.optional(S.String),
    additionalMessage: S.optional(S.String),
  }),
).annotations({ identifier: "EmailContent" }) as any as S.Schema<EmailContent>;
export interface EmailRecipients {
  to?: RecipientDetails;
}
export const EmailRecipients = S.suspend(() =>
  S.Struct({ to: S.optional(RecipientDetails) }),
).annotations({
  identifier: "EmailRecipients",
}) as any as S.Schema<EmailRecipients>;
export interface EmailConfiguration {
  from: string;
  content?: EmailContent;
  recipients: EmailRecipients;
}
export const EmailConfiguration = S.suspend(() =>
  S.Struct({
    from: S.String,
    content: S.optional(EmailContent),
    recipients: EmailRecipients,
  }),
).annotations({
  identifier: "EmailConfiguration",
}) as any as S.Schema<EmailConfiguration>;
export type EmailConfigurations = EmailConfiguration[];
export const EmailConfigurations = S.Array(EmailConfiguration);
export interface NotificationAction {
  action: NotificationTargetActions;
  smsConfigurations?: SMSConfigurations;
  emailConfigurations?: EmailConfigurations;
}
export const NotificationAction = S.suspend(() =>
  S.Struct({
    action: NotificationTargetActions,
    smsConfigurations: S.optional(SMSConfigurations),
    emailConfigurations: S.optional(EmailConfigurations),
  }),
).annotations({
  identifier: "NotificationAction",
}) as any as S.Schema<NotificationAction>;
export type NotificationActions = NotificationAction[];
export const NotificationActions = S.Array(NotificationAction);
export interface AlarmNotification {
  notificationActions?: NotificationActions;
}
export const AlarmNotification = S.suspend(() =>
  S.Struct({ notificationActions: S.optional(NotificationActions) }),
).annotations({
  identifier: "AlarmNotification",
}) as any as S.Schema<AlarmNotification>;
export interface AlarmAction {
  sns?: SNSTopicPublishAction;
  iotTopicPublish?: IotTopicPublishAction;
  lambda?: LambdaAction;
  iotEvents?: IotEventsAction;
  sqs?: SqsAction;
  firehose?: FirehoseAction;
  dynamoDB?: DynamoDBAction;
  dynamoDBv2?: DynamoDBv2Action;
  iotSiteWise?: IotSiteWiseAction;
}
export const AlarmAction = S.suspend(() =>
  S.Struct({
    sns: S.optional(SNSTopicPublishAction),
    iotTopicPublish: S.optional(IotTopicPublishAction),
    lambda: S.optional(LambdaAction),
    iotEvents: S.optional(IotEventsAction),
    sqs: S.optional(SqsAction),
    firehose: S.optional(FirehoseAction),
    dynamoDB: S.optional(DynamoDBAction),
    dynamoDBv2: S.optional(DynamoDBv2Action),
    iotSiteWise: S.optional(IotSiteWiseAction),
  }),
).annotations({ identifier: "AlarmAction" }) as any as S.Schema<AlarmAction>;
export type AlarmActions = AlarmAction[];
export const AlarmActions = S.Array(AlarmAction);
export interface AlarmEventActions {
  alarmActions?: AlarmActions;
}
export const AlarmEventActions = S.suspend(() =>
  S.Struct({ alarmActions: S.optional(AlarmActions) }),
).annotations({
  identifier: "AlarmEventActions",
}) as any as S.Schema<AlarmEventActions>;
export interface InitializationConfiguration {
  disabledOnInitialization: boolean;
}
export const InitializationConfiguration = S.suspend(() =>
  S.Struct({ disabledOnInitialization: S.Boolean }),
).annotations({
  identifier: "InitializationConfiguration",
}) as any as S.Schema<InitializationConfiguration>;
export interface AcknowledgeFlow {
  enabled: boolean;
}
export const AcknowledgeFlow = S.suspend(() =>
  S.Struct({ enabled: S.Boolean }),
).annotations({
  identifier: "AcknowledgeFlow",
}) as any as S.Schema<AcknowledgeFlow>;
export interface AlarmCapabilities {
  initializationConfiguration?: InitializationConfiguration;
  acknowledgeFlow?: AcknowledgeFlow;
}
export const AlarmCapabilities = S.suspend(() =>
  S.Struct({
    initializationConfiguration: S.optional(InitializationConfiguration),
    acknowledgeFlow: S.optional(AcknowledgeFlow),
  }),
).annotations({
  identifier: "AlarmCapabilities",
}) as any as S.Schema<AlarmCapabilities>;
export interface UpdateAlarmModelRequest {
  alarmModelName: string;
  alarmModelDescription?: string;
  roleArn: string;
  severity?: number;
  alarmRule: AlarmRule;
  alarmNotification?: AlarmNotification;
  alarmEventActions?: AlarmEventActions;
  alarmCapabilities?: AlarmCapabilities;
}
export const UpdateAlarmModelRequest = S.suspend(() =>
  S.Struct({
    alarmModelName: S.String.pipe(T.HttpLabel("alarmModelName")),
    alarmModelDescription: S.optional(S.String),
    roleArn: S.String,
    severity: S.optional(S.Number),
    alarmRule: AlarmRule,
    alarmNotification: S.optional(AlarmNotification),
    alarmEventActions: S.optional(AlarmEventActions),
    alarmCapabilities: S.optional(AlarmCapabilities),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/alarm-models/{alarmModelName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAlarmModelRequest",
}) as any as S.Schema<UpdateAlarmModelRequest>;
export interface UpdateDetectorModelRequest {
  detectorModelName: string;
  detectorModelDefinition: DetectorModelDefinition;
  detectorModelDescription?: string;
  roleArn: string;
  evaluationMethod?: string;
}
export const UpdateDetectorModelRequest = S.suspend(() =>
  S.Struct({
    detectorModelName: S.String.pipe(T.HttpLabel("detectorModelName")),
    detectorModelDefinition: DetectorModelDefinition,
    detectorModelDescription: S.optional(S.String),
    roleArn: S.String,
    evaluationMethod: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/detector-models/{detectorModelName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDetectorModelRequest",
}) as any as S.Schema<UpdateDetectorModelRequest>;
export interface Attribute {
  jsonPath: string;
}
export const Attribute = S.suspend(() =>
  S.Struct({ jsonPath: S.String }),
).annotations({ identifier: "Attribute" }) as any as S.Schema<Attribute>;
export type Attributes = Attribute[];
export const Attributes = S.Array(Attribute);
export interface InputDefinition {
  attributes: Attributes;
}
export const InputDefinition = S.suspend(() =>
  S.Struct({ attributes: Attributes }),
).annotations({
  identifier: "InputDefinition",
}) as any as S.Schema<InputDefinition>;
export interface UpdateInputRequest {
  inputName: string;
  inputDescription?: string;
  inputDefinition: InputDefinition;
}
export const UpdateInputRequest = S.suspend(() =>
  S.Struct({
    inputName: S.String.pipe(T.HttpLabel("inputName")),
    inputDescription: S.optional(S.String),
    inputDefinition: InputDefinition,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/inputs/{inputName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateInputRequest",
}) as any as S.Schema<UpdateInputRequest>;
export interface DescribeAlarmModelResponse {
  creationTime?: Date;
  alarmModelArn?: string;
  alarmModelVersion?: string;
  lastUpdateTime?: Date;
  status?: string;
  statusMessage?: string;
  alarmModelName?: string;
  alarmModelDescription?: string;
  roleArn?: string;
  key?: string;
  severity?: number;
  alarmRule?: AlarmRule;
  alarmNotification?: AlarmNotification;
  alarmEventActions?: AlarmEventActions;
  alarmCapabilities?: AlarmCapabilities;
}
export const DescribeAlarmModelResponse = S.suspend(() =>
  S.Struct({
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    alarmModelArn: S.optional(S.String),
    alarmModelVersion: S.optional(S.String),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(S.String),
    statusMessage: S.optional(S.String),
    alarmModelName: S.optional(S.String),
    alarmModelDescription: S.optional(S.String),
    roleArn: S.optional(S.String),
    key: S.optional(S.String),
    severity: S.optional(S.Number),
    alarmRule: S.optional(AlarmRule),
    alarmNotification: S.optional(AlarmNotification),
    alarmEventActions: S.optional(AlarmEventActions),
    alarmCapabilities: S.optional(AlarmCapabilities),
  }),
).annotations({
  identifier: "DescribeAlarmModelResponse",
}) as any as S.Schema<DescribeAlarmModelResponse>;
export interface DescribeDetectorModelAnalysisResponse {
  status?: string;
}
export const DescribeDetectorModelAnalysisResponse = S.suspend(() =>
  S.Struct({ status: S.optional(S.String) }),
).annotations({
  identifier: "DescribeDetectorModelAnalysisResponse",
}) as any as S.Schema<DescribeDetectorModelAnalysisResponse>;
export interface ListTagsForResourceResponse {
  tags?: Tags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface StartDetectorModelAnalysisResponse {
  analysisId?: string;
}
export const StartDetectorModelAnalysisResponse = S.suspend(() =>
  S.Struct({ analysisId: S.optional(S.String) }),
).annotations({
  identifier: "StartDetectorModelAnalysisResponse",
}) as any as S.Schema<StartDetectorModelAnalysisResponse>;
export interface UpdateAlarmModelResponse {
  creationTime?: Date;
  alarmModelArn?: string;
  alarmModelVersion?: string;
  lastUpdateTime?: Date;
  status?: string;
}
export const UpdateAlarmModelResponse = S.suspend(() =>
  S.Struct({
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    alarmModelArn: S.optional(S.String),
    alarmModelVersion: S.optional(S.String),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateAlarmModelResponse",
}) as any as S.Schema<UpdateAlarmModelResponse>;
export interface IotEventsInputIdentifier {
  inputName: string;
}
export const IotEventsInputIdentifier = S.suspend(() =>
  S.Struct({ inputName: S.String }),
).annotations({
  identifier: "IotEventsInputIdentifier",
}) as any as S.Schema<IotEventsInputIdentifier>;
export interface DetectorModelConfiguration {
  detectorModelName?: string;
  detectorModelVersion?: string;
  detectorModelDescription?: string;
  detectorModelArn?: string;
  roleArn?: string;
  creationTime?: Date;
  lastUpdateTime?: Date;
  status?: string;
  key?: string;
  evaluationMethod?: string;
}
export const DetectorModelConfiguration = S.suspend(() =>
  S.Struct({
    detectorModelName: S.optional(S.String),
    detectorModelVersion: S.optional(S.String),
    detectorModelDescription: S.optional(S.String),
    detectorModelArn: S.optional(S.String),
    roleArn: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(S.String),
    key: S.optional(S.String),
    evaluationMethod: S.optional(S.String),
  }),
).annotations({
  identifier: "DetectorModelConfiguration",
}) as any as S.Schema<DetectorModelConfiguration>;
export interface DetectorModel {
  detectorModelDefinition?: DetectorModelDefinition;
  detectorModelConfiguration?: DetectorModelConfiguration;
}
export const DetectorModel = S.suspend(() =>
  S.Struct({
    detectorModelDefinition: S.optional(DetectorModelDefinition),
    detectorModelConfiguration: S.optional(DetectorModelConfiguration),
  }),
).annotations({
  identifier: "DetectorModel",
}) as any as S.Schema<DetectorModel>;
export interface InputConfiguration {
  inputName: string;
  inputDescription?: string;
  inputArn: string;
  creationTime: Date;
  lastUpdateTime: Date;
  status: string;
}
export const InputConfiguration = S.suspend(() =>
  S.Struct({
    inputName: S.String,
    inputDescription: S.optional(S.String),
    inputArn: S.String,
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: S.String,
  }),
).annotations({
  identifier: "InputConfiguration",
}) as any as S.Schema<InputConfiguration>;
export interface Input {
  inputConfiguration?: InputConfiguration;
  inputDefinition?: InputDefinition;
}
export const Input = S.suspend(() =>
  S.Struct({
    inputConfiguration: S.optional(InputConfiguration),
    inputDefinition: S.optional(InputDefinition),
  }),
).annotations({ identifier: "Input" }) as any as S.Schema<Input>;
export interface AlarmModelSummary {
  creationTime?: Date;
  alarmModelDescription?: string;
  alarmModelName?: string;
}
export const AlarmModelSummary = S.suspend(() =>
  S.Struct({
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    alarmModelDescription: S.optional(S.String),
    alarmModelName: S.optional(S.String),
  }),
).annotations({
  identifier: "AlarmModelSummary",
}) as any as S.Schema<AlarmModelSummary>;
export type AlarmModelSummaries = AlarmModelSummary[];
export const AlarmModelSummaries = S.Array(AlarmModelSummary);
export interface AlarmModelVersionSummary {
  alarmModelName?: string;
  alarmModelArn?: string;
  alarmModelVersion?: string;
  roleArn?: string;
  creationTime?: Date;
  lastUpdateTime?: Date;
  status?: string;
  statusMessage?: string;
}
export const AlarmModelVersionSummary = S.suspend(() =>
  S.Struct({
    alarmModelName: S.optional(S.String),
    alarmModelArn: S.optional(S.String),
    alarmModelVersion: S.optional(S.String),
    roleArn: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(S.String),
    statusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "AlarmModelVersionSummary",
}) as any as S.Schema<AlarmModelVersionSummary>;
export type AlarmModelVersionSummaries = AlarmModelVersionSummary[];
export const AlarmModelVersionSummaries = S.Array(AlarmModelVersionSummary);
export interface DetectorModelSummary {
  detectorModelName?: string;
  detectorModelDescription?: string;
  creationTime?: Date;
}
export const DetectorModelSummary = S.suspend(() =>
  S.Struct({
    detectorModelName: S.optional(S.String),
    detectorModelDescription: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DetectorModelSummary",
}) as any as S.Schema<DetectorModelSummary>;
export type DetectorModelSummaries = DetectorModelSummary[];
export const DetectorModelSummaries = S.Array(DetectorModelSummary);
export interface DetectorModelVersionSummary {
  detectorModelName?: string;
  detectorModelVersion?: string;
  detectorModelArn?: string;
  roleArn?: string;
  creationTime?: Date;
  lastUpdateTime?: Date;
  status?: string;
  evaluationMethod?: string;
}
export const DetectorModelVersionSummary = S.suspend(() =>
  S.Struct({
    detectorModelName: S.optional(S.String),
    detectorModelVersion: S.optional(S.String),
    detectorModelArn: S.optional(S.String),
    roleArn: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(S.String),
    evaluationMethod: S.optional(S.String),
  }),
).annotations({
  identifier: "DetectorModelVersionSummary",
}) as any as S.Schema<DetectorModelVersionSummary>;
export type DetectorModelVersionSummaries = DetectorModelVersionSummary[];
export const DetectorModelVersionSummaries = S.Array(
  DetectorModelVersionSummary,
);
export interface InputSummary {
  inputName?: string;
  inputDescription?: string;
  inputArn?: string;
  creationTime?: Date;
  lastUpdateTime?: Date;
  status?: string;
}
export const InputSummary = S.suspend(() =>
  S.Struct({
    inputName: S.optional(S.String),
    inputDescription: S.optional(S.String),
    inputArn: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(S.String),
  }),
).annotations({ identifier: "InputSummary" }) as any as S.Schema<InputSummary>;
export type InputSummaries = InputSummary[];
export const InputSummaries = S.Array(InputSummary);
export interface IotSiteWiseAssetModelPropertyIdentifier {
  assetModelId: string;
  propertyId: string;
}
export const IotSiteWiseAssetModelPropertyIdentifier = S.suspend(() =>
  S.Struct({ assetModelId: S.String, propertyId: S.String }),
).annotations({
  identifier: "IotSiteWiseAssetModelPropertyIdentifier",
}) as any as S.Schema<IotSiteWiseAssetModelPropertyIdentifier>;
export interface CreateInputRequest {
  inputName: string;
  inputDescription?: string;
  inputDefinition: InputDefinition;
  tags?: Tags;
}
export const CreateInputRequest = S.suspend(() =>
  S.Struct({
    inputName: S.String,
    inputDescription: S.optional(S.String),
    inputDefinition: InputDefinition,
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/inputs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateInputRequest",
}) as any as S.Schema<CreateInputRequest>;
export interface DescribeDetectorModelResponse {
  detectorModel?: DetectorModel;
}
export const DescribeDetectorModelResponse = S.suspend(() =>
  S.Struct({ detectorModel: S.optional(DetectorModel) }),
).annotations({
  identifier: "DescribeDetectorModelResponse",
}) as any as S.Schema<DescribeDetectorModelResponse>;
export interface DescribeInputResponse {
  input?: Input;
}
export const DescribeInputResponse = S.suspend(() =>
  S.Struct({ input: S.optional(Input) }),
).annotations({
  identifier: "DescribeInputResponse",
}) as any as S.Schema<DescribeInputResponse>;
export interface DescribeLoggingOptionsResponse {
  loggingOptions?: LoggingOptions;
}
export const DescribeLoggingOptionsResponse = S.suspend(() =>
  S.Struct({ loggingOptions: S.optional(LoggingOptions) }),
).annotations({
  identifier: "DescribeLoggingOptionsResponse",
}) as any as S.Schema<DescribeLoggingOptionsResponse>;
export interface ListAlarmModelsResponse {
  alarmModelSummaries?: AlarmModelSummaries;
  nextToken?: string;
}
export const ListAlarmModelsResponse = S.suspend(() =>
  S.Struct({
    alarmModelSummaries: S.optional(AlarmModelSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAlarmModelsResponse",
}) as any as S.Schema<ListAlarmModelsResponse>;
export interface ListAlarmModelVersionsResponse {
  alarmModelVersionSummaries?: AlarmModelVersionSummaries;
  nextToken?: string;
}
export const ListAlarmModelVersionsResponse = S.suspend(() =>
  S.Struct({
    alarmModelVersionSummaries: S.optional(AlarmModelVersionSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAlarmModelVersionsResponse",
}) as any as S.Schema<ListAlarmModelVersionsResponse>;
export interface ListDetectorModelsResponse {
  detectorModelSummaries?: DetectorModelSummaries;
  nextToken?: string;
}
export const ListDetectorModelsResponse = S.suspend(() =>
  S.Struct({
    detectorModelSummaries: S.optional(DetectorModelSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDetectorModelsResponse",
}) as any as S.Schema<ListDetectorModelsResponse>;
export interface ListDetectorModelVersionsResponse {
  detectorModelVersionSummaries?: DetectorModelVersionSummaries;
  nextToken?: string;
}
export const ListDetectorModelVersionsResponse = S.suspend(() =>
  S.Struct({
    detectorModelVersionSummaries: S.optional(DetectorModelVersionSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDetectorModelVersionsResponse",
}) as any as S.Schema<ListDetectorModelVersionsResponse>;
export interface ListInputsResponse {
  inputSummaries?: InputSummaries;
  nextToken?: string;
}
export const ListInputsResponse = S.suspend(() =>
  S.Struct({
    inputSummaries: S.optional(InputSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListInputsResponse",
}) as any as S.Schema<ListInputsResponse>;
export interface UpdateDetectorModelResponse {
  detectorModelConfiguration?: DetectorModelConfiguration;
}
export const UpdateDetectorModelResponse = S.suspend(() =>
  S.Struct({
    detectorModelConfiguration: S.optional(DetectorModelConfiguration),
  }),
).annotations({
  identifier: "UpdateDetectorModelResponse",
}) as any as S.Schema<UpdateDetectorModelResponse>;
export interface UpdateInputResponse {
  inputConfiguration?: InputConfiguration;
}
export const UpdateInputResponse = S.suspend(() =>
  S.Struct({ inputConfiguration: S.optional(InputConfiguration) }),
).annotations({
  identifier: "UpdateInputResponse",
}) as any as S.Schema<UpdateInputResponse>;
export interface AnalysisResultLocation {
  path?: string;
}
export const AnalysisResultLocation = S.suspend(() =>
  S.Struct({ path: S.optional(S.String) }),
).annotations({
  identifier: "AnalysisResultLocation",
}) as any as S.Schema<AnalysisResultLocation>;
export type AnalysisResultLocations = AnalysisResultLocation[];
export const AnalysisResultLocations = S.Array(AnalysisResultLocation);
export interface IotSiteWiseInputIdentifier {
  iotSiteWiseAssetModelPropertyIdentifier?: IotSiteWiseAssetModelPropertyIdentifier;
}
export const IotSiteWiseInputIdentifier = S.suspend(() =>
  S.Struct({
    iotSiteWiseAssetModelPropertyIdentifier: S.optional(
      IotSiteWiseAssetModelPropertyIdentifier,
    ),
  }),
).annotations({
  identifier: "IotSiteWiseInputIdentifier",
}) as any as S.Schema<IotSiteWiseInputIdentifier>;
export interface AnalysisResult {
  type?: string;
  level?: string;
  message?: string;
  locations?: AnalysisResultLocations;
}
export const AnalysisResult = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    level: S.optional(S.String),
    message: S.optional(S.String),
    locations: S.optional(AnalysisResultLocations),
  }),
).annotations({
  identifier: "AnalysisResult",
}) as any as S.Schema<AnalysisResult>;
export type AnalysisResults = AnalysisResult[];
export const AnalysisResults = S.Array(AnalysisResult);
export interface InputIdentifier {
  iotEventsInputIdentifier?: IotEventsInputIdentifier;
  iotSiteWiseInputIdentifier?: IotSiteWiseInputIdentifier;
}
export const InputIdentifier = S.suspend(() =>
  S.Struct({
    iotEventsInputIdentifier: S.optional(IotEventsInputIdentifier),
    iotSiteWiseInputIdentifier: S.optional(IotSiteWiseInputIdentifier),
  }),
).annotations({
  identifier: "InputIdentifier",
}) as any as S.Schema<InputIdentifier>;
export interface CreateInputResponse {
  inputConfiguration?: InputConfiguration;
}
export const CreateInputResponse = S.suspend(() =>
  S.Struct({ inputConfiguration: S.optional(InputConfiguration) }),
).annotations({
  identifier: "CreateInputResponse",
}) as any as S.Schema<CreateInputResponse>;
export interface GetDetectorModelAnalysisResultsResponse {
  analysisResults?: AnalysisResults;
  nextToken?: string;
}
export const GetDetectorModelAnalysisResultsResponse = S.suspend(() =>
  S.Struct({
    analysisResults: S.optional(AnalysisResults),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDetectorModelAnalysisResultsResponse",
}) as any as S.Schema<GetDetectorModelAnalysisResultsResponse>;
export interface ListInputRoutingsRequest {
  inputIdentifier: InputIdentifier;
  maxResults?: number;
  nextToken?: string;
}
export const ListInputRoutingsRequest = S.suspend(() =>
  S.Struct({
    inputIdentifier: InputIdentifier,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/input-routings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListInputRoutingsRequest",
}) as any as S.Schema<ListInputRoutingsRequest>;
export interface RoutedResource {
  name?: string;
  arn?: string;
}
export const RoutedResource = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), arn: S.optional(S.String) }),
).annotations({
  identifier: "RoutedResource",
}) as any as S.Schema<RoutedResource>;
export type RoutedResources = RoutedResource[];
export const RoutedResources = S.Array(RoutedResource);
export interface CreateAlarmModelRequest {
  alarmModelName: string;
  alarmModelDescription?: string;
  roleArn: string;
  tags?: Tags;
  key?: string;
  severity?: number;
  alarmRule: AlarmRule;
  alarmNotification?: AlarmNotification;
  alarmEventActions?: AlarmEventActions;
  alarmCapabilities?: AlarmCapabilities;
}
export const CreateAlarmModelRequest = S.suspend(() =>
  S.Struct({
    alarmModelName: S.String,
    alarmModelDescription: S.optional(S.String),
    roleArn: S.String,
    tags: S.optional(Tags),
    key: S.optional(S.String),
    severity: S.optional(S.Number),
    alarmRule: AlarmRule,
    alarmNotification: S.optional(AlarmNotification),
    alarmEventActions: S.optional(AlarmEventActions),
    alarmCapabilities: S.optional(AlarmCapabilities),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/alarm-models" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAlarmModelRequest",
}) as any as S.Schema<CreateAlarmModelRequest>;
export interface ListInputRoutingsResponse {
  routedResources?: RoutedResources;
  nextToken?: string;
}
export const ListInputRoutingsResponse = S.suspend(() =>
  S.Struct({
    routedResources: S.optional(RoutedResources),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListInputRoutingsResponse",
}) as any as S.Schema<ListInputRoutingsResponse>;
export interface CreateAlarmModelResponse {
  creationTime?: Date;
  alarmModelArn?: string;
  alarmModelVersion?: string;
  lastUpdateTime?: Date;
  status?: string;
}
export const CreateAlarmModelResponse = S.suspend(() =>
  S.Struct({
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    alarmModelArn: S.optional(S.String),
    alarmModelVersion: S.optional(S.String),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateAlarmModelResponse",
}) as any as S.Schema<CreateAlarmModelResponse>;
export interface CreateDetectorModelRequest {
  detectorModelName: string;
  detectorModelDefinition: DetectorModelDefinition;
  detectorModelDescription?: string;
  key?: string;
  roleArn: string;
  tags?: Tags;
  evaluationMethod?: string;
}
export const CreateDetectorModelRequest = S.suspend(() =>
  S.Struct({
    detectorModelName: S.String,
    detectorModelDefinition: DetectorModelDefinition,
    detectorModelDescription: S.optional(S.String),
    key: S.optional(S.String),
    roleArn: S.String,
    tags: S.optional(Tags),
    evaluationMethod: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/detector-models" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDetectorModelRequest",
}) as any as S.Schema<CreateDetectorModelRequest>;
export interface CreateDetectorModelResponse {
  detectorModelConfiguration?: DetectorModelConfiguration;
}
export const CreateDetectorModelResponse = S.suspend(() =>
  S.Struct({
    detectorModelConfiguration: S.optional(DetectorModelConfiguration),
  }),
).annotations({
  identifier: "CreateDetectorModelResponse",
}) as any as S.Schema<CreateDetectorModelResponse>;

//# Errors
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceArn: S.optional(S.String),
  },
).pipe(C.withConflictError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class UnsupportedOperationException extends S.TaggedError<UnsupportedOperationException>()(
  "UnsupportedOperationException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}

//# Operations
/**
 * Lists the alarm models that you created. The operation returns only the metadata
 * associated with each alarm model.
 */
export const listAlarmModels: (
  input: ListAlarmModelsRequest,
) => Effect.Effect<
  ListAlarmModelsResponse,
  | InternalFailureException
  | InvalidRequestException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAlarmModelsRequest,
  output: ListAlarmModelsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Performs an analysis of your detector model. For more information,
 * see Troubleshooting a detector model
 * in the *AWS IoT Events Developer Guide*.
 */
export const startDetectorModelAnalysis: (
  input: StartDetectorModelAnalysisRequest,
) => Effect.Effect<
  StartDetectorModelAnalysisResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDetectorModelAnalysisRequest,
  output: StartDetectorModelAnalysisResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Updates a detector model. Detectors (instances) spawned by the previous version are
 * deleted and then re-created as new inputs arrive.
 */
export const updateDetectorModel: (
  input: UpdateDetectorModelRequest,
) => Effect.Effect<
  UpdateDetectorModelResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDetectorModelRequest,
  output: UpdateDetectorModelResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Updates an input.
 */
export const updateInput: (
  input: UpdateInputRequest,
) => Effect.Effect<
  UpdateInputResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateInputRequest,
  output: UpdateInputResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Lists the tags (metadata) you have assigned to the resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates an alarm model. Any alarms that were created based on the previous version are
 * deleted and then created again as new data arrives.
 */
export const updateAlarmModel: (
  input: UpdateAlarmModelRequest,
) => Effect.Effect<
  UpdateAlarmModelResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAlarmModelRequest,
  output: UpdateAlarmModelResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a detector model. Any active instances of the detector model are also
 * deleted.
 */
export const deleteDetectorModel: (
  input: DeleteDetectorModelRequest,
) => Effect.Effect<
  DeleteDetectorModelResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDetectorModelRequest,
  output: DeleteDetectorModelResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Deletes an input.
 */
export const deleteInput: (
  input: DeleteInputRequest,
) => Effect.Effect<
  DeleteInputResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInputRequest,
  output: DeleteInputResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Removes the given tags (metadata) from the resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes an input.
 */
export const describeInput: (
  input: DescribeInputRequest,
) => Effect.Effect<
  DescribeInputResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeInputRequest,
  output: DescribeInputResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Lists all the versions of an alarm model. The operation returns only the metadata
 * associated with each alarm model version.
 */
export const listAlarmModelVersions: (
  input: ListAlarmModelVersionsRequest,
) => Effect.Effect<
  ListAlarmModelVersionsResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAlarmModelVersionsRequest,
  output: ListAlarmModelVersionsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Lists all the versions of a detector model. Only the metadata associated with each
 * detector model version is returned.
 */
export const listDetectorModelVersions: (
  input: ListDetectorModelVersionsRequest,
) => Effect.Effect<
  ListDetectorModelVersionsResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDetectorModelVersionsRequest,
  output: ListDetectorModelVersionsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about an alarm model. If you don't specify a value for the
 * `alarmModelVersion` parameter, the latest version is returned.
 */
export const describeAlarmModel: (
  input: DescribeAlarmModelRequest,
) => Effect.Effect<
  DescribeAlarmModelResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAlarmModelRequest,
  output: DescribeAlarmModelResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves runtime information about a detector model analysis.
 *
 * After AWS IoT Events starts analyzing your detector model, you have up to 24 hours to retrieve the analysis results.
 */
export const describeDetectorModelAnalysis: (
  input: DescribeDetectorModelAnalysisRequest,
) => Effect.Effect<
  DescribeDetectorModelAnalysisResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDetectorModelAnalysisRequest,
  output: DescribeDetectorModelAnalysisResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Deletes an alarm model. Any alarm instances that were created based on this alarm model
 * are also deleted. This action can't be undone.
 */
export const deleteAlarmModel: (
  input: DeleteAlarmModelRequest,
) => Effect.Effect<
  DeleteAlarmModelResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAlarmModelRequest,
  output: DeleteAlarmModelResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Lists the detector models you have created. Only the metadata associated with each
 * detector model is returned.
 */
export const listDetectorModels: (
  input: ListDetectorModelsRequest,
) => Effect.Effect<
  ListDetectorModelsResponse,
  | InternalFailureException
  | InvalidRequestException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDetectorModelsRequest,
  output: ListDetectorModelsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Lists the inputs you have created.
 */
export const listInputs: (
  input: ListInputsRequest,
) => Effect.Effect<
  ListInputsResponse,
  | InternalFailureException
  | InvalidRequestException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListInputsRequest,
  output: ListInputsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Describes a detector model. If the `version` parameter is not specified,
 * information about the latest version is returned.
 */
export const describeDetectorModel: (
  input: DescribeDetectorModelRequest,
) => Effect.Effect<
  DescribeDetectorModelResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDetectorModelRequest,
  output: DescribeDetectorModelResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves one or more analysis results of the detector model.
 *
 * After AWS IoT Events starts analyzing your detector model, you have up to 24 hours to retrieve the analysis results.
 */
export const getDetectorModelAnalysisResults: (
  input: GetDetectorModelAnalysisResultsRequest,
) => Effect.Effect<
  GetDetectorModelAnalysisResultsResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDetectorModelAnalysisResultsRequest,
  output: GetDetectorModelAnalysisResultsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Adds to or modifies the tags of the given resource. Tags are metadata that can be used to
 * manage a resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates an input.
 */
export const createInput: (
  input: CreateInputRequest,
) => Effect.Effect<
  CreateInputResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceAlreadyExistsException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateInputRequest,
  output: CreateInputResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Lists one or more input routings.
 */
export const listInputRoutings: (
  input: ListInputRoutingsRequest,
) => Effect.Effect<
  ListInputRoutingsResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListInputRoutingsRequest,
  output: ListInputRoutingsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Sets or updates the AWS IoT Events logging options.
 *
 * If you update the value of any `loggingOptions` field, it takes up to one
 * minute for the change to take effect. If you change the policy attached to the role you
 * specified in the `roleArn` field (for example, to correct an invalid policy), it
 * takes up to five minutes for that change to take effect.
 */
export const putLoggingOptions: (
  input: PutLoggingOptionsRequest,
) => Effect.Effect<
  PutLoggingOptionsResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceInUseException
  | ServiceUnavailableException
  | ThrottlingException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutLoggingOptionsRequest,
  output: PutLoggingOptionsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceInUseException,
    ServiceUnavailableException,
    ThrottlingException,
    UnsupportedOperationException,
  ],
}));
/**
 * Retrieves the current settings of the AWS IoT Events logging options.
 */
export const describeLoggingOptions: (
  input: DescribeLoggingOptionsRequest,
) => Effect.Effect<
  DescribeLoggingOptionsResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLoggingOptionsRequest,
  output: DescribeLoggingOptionsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnsupportedOperationException,
  ],
}));
/**
 * Creates an alarm model to monitor an AWS IoT Events input attribute. You can use the alarm to get
 * notified when the value is outside a specified range. For more information, see Create an
 * alarm model in the *AWS IoT Events Developer Guide*.
 */
export const createAlarmModel: (
  input: CreateAlarmModelRequest,
) => Effect.Effect<
  CreateAlarmModelResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAlarmModelRequest,
  output: CreateAlarmModelResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Creates a detector model.
 */
export const createDetectorModel: (
  input: CreateDetectorModelRequest,
) => Effect.Effect<
  CreateDetectorModelResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDetectorModelRequest,
  output: CreateDetectorModelResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
