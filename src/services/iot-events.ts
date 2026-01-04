import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
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

//# Schemas
export class DescribeLoggingOptionsRequest extends S.Class<DescribeLoggingOptionsRequest>(
  "DescribeLoggingOptionsRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/logging" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagKeys = S.Array(S.String);
export class DeleteAlarmModelRequest extends S.Class<DeleteAlarmModelRequest>(
  "DeleteAlarmModelRequest",
)(
  { alarmModelName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/alarm-models/{alarmModelName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAlarmModelResponse extends S.Class<DeleteAlarmModelResponse>(
  "DeleteAlarmModelResponse",
)({}) {}
export class DeleteDetectorModelRequest extends S.Class<DeleteDetectorModelRequest>(
  "DeleteDetectorModelRequest",
)(
  { detectorModelName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/detector-models/{detectorModelName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDetectorModelResponse extends S.Class<DeleteDetectorModelResponse>(
  "DeleteDetectorModelResponse",
)({}) {}
export class DeleteInputRequest extends S.Class<DeleteInputRequest>(
  "DeleteInputRequest",
)(
  { inputName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/inputs/{inputName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteInputResponse extends S.Class<DeleteInputResponse>(
  "DeleteInputResponse",
)({}) {}
export class DescribeAlarmModelRequest extends S.Class<DescribeAlarmModelRequest>(
  "DescribeAlarmModelRequest",
)(
  {
    alarmModelName: S.String.pipe(T.HttpLabel()),
    alarmModelVersion: S.optional(S.String).pipe(T.HttpQuery("version")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/alarm-models/{alarmModelName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDetectorModelRequest extends S.Class<DescribeDetectorModelRequest>(
  "DescribeDetectorModelRequest",
)(
  {
    detectorModelName: S.String.pipe(T.HttpLabel()),
    detectorModelVersion: S.optional(S.String).pipe(T.HttpQuery("version")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/detector-models/{detectorModelName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDetectorModelAnalysisRequest extends S.Class<DescribeDetectorModelAnalysisRequest>(
  "DescribeDetectorModelAnalysisRequest",
)(
  { analysisId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/analysis/detector-models/{analysisId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeInputRequest extends S.Class<DescribeInputRequest>(
  "DescribeInputRequest",
)(
  { inputName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/inputs/{inputName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDetectorModelAnalysisResultsRequest extends S.Class<GetDetectorModelAnalysisResultsRequest>(
  "GetDetectorModelAnalysisResultsRequest",
)(
  {
    analysisId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
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
) {}
export class ListAlarmModelsRequest extends S.Class<ListAlarmModelsRequest>(
  "ListAlarmModelsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/alarm-models" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAlarmModelVersionsRequest extends S.Class<ListAlarmModelVersionsRequest>(
  "ListAlarmModelVersionsRequest",
)(
  {
    alarmModelName: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/alarm-models/{alarmModelName}/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDetectorModelsRequest extends S.Class<ListDetectorModelsRequest>(
  "ListDetectorModelsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/detector-models" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDetectorModelVersionsRequest extends S.Class<ListDetectorModelVersionsRequest>(
  "ListDetectorModelVersionsRequest",
)(
  {
    detectorModelName: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
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
) {}
export class ListInputsRequest extends S.Class<ListInputsRequest>(
  "ListInputsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/inputs" }),
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
  { resourceArn: S.String.pipe(T.HttpQuery("resourceArn")) },
  T.all(T.Http({ method: "GET", uri: "/tags" }), svc, auth, proto, ver, rules),
) {}
export class DetectorDebugOption extends S.Class<DetectorDebugOption>(
  "DetectorDebugOption",
)({ detectorModelName: S.String, keyValue: S.optional(S.String) }) {}
export const DetectorDebugOptions = S.Array(DetectorDebugOption);
export class LoggingOptions extends S.Class<LoggingOptions>("LoggingOptions")({
  roleArn: S.String,
  level: S.String,
  enabled: S.Boolean,
  detectorDebugOptions: S.optional(DetectorDebugOptions),
}) {}
export class PutLoggingOptionsRequest extends S.Class<PutLoggingOptionsRequest>(
  "PutLoggingOptionsRequest",
)(
  { loggingOptions: LoggingOptions },
  T.all(
    T.Http({ method: "PUT", uri: "/logging" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutLoggingOptionsResponse extends S.Class<PutLoggingOptionsResponse>(
  "PutLoggingOptionsResponse",
)({}) {}
export class SetVariableAction extends S.Class<SetVariableAction>(
  "SetVariableAction",
)({ variableName: S.String, value: S.String }) {}
export class Payload extends S.Class<Payload>("Payload")({
  contentExpression: S.String,
  type: S.String,
}) {}
export class SNSTopicPublishAction extends S.Class<SNSTopicPublishAction>(
  "SNSTopicPublishAction",
)({ targetArn: S.String, payload: S.optional(Payload) }) {}
export class IotTopicPublishAction extends S.Class<IotTopicPublishAction>(
  "IotTopicPublishAction",
)({ mqttTopic: S.String, payload: S.optional(Payload) }) {}
export class SetTimerAction extends S.Class<SetTimerAction>("SetTimerAction")({
  timerName: S.String,
  seconds: S.optional(S.Number),
  durationExpression: S.optional(S.String),
}) {}
export class ClearTimerAction extends S.Class<ClearTimerAction>(
  "ClearTimerAction",
)({ timerName: S.String }) {}
export class ResetTimerAction extends S.Class<ResetTimerAction>(
  "ResetTimerAction",
)({ timerName: S.String }) {}
export class LambdaAction extends S.Class<LambdaAction>("LambdaAction")({
  functionArn: S.String,
  payload: S.optional(Payload),
}) {}
export class IotEventsAction extends S.Class<IotEventsAction>(
  "IotEventsAction",
)({ inputName: S.String, payload: S.optional(Payload) }) {}
export class SqsAction extends S.Class<SqsAction>("SqsAction")({
  queueUrl: S.String,
  useBase64: S.optional(S.Boolean),
  payload: S.optional(Payload),
}) {}
export class FirehoseAction extends S.Class<FirehoseAction>("FirehoseAction")({
  deliveryStreamName: S.String,
  separator: S.optional(S.String),
  payload: S.optional(Payload),
}) {}
export class DynamoDBAction extends S.Class<DynamoDBAction>("DynamoDBAction")({
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
}) {}
export class DynamoDBv2Action extends S.Class<DynamoDBv2Action>(
  "DynamoDBv2Action",
)({ tableName: S.String, payload: S.optional(Payload) }) {}
export class AssetPropertyVariant extends S.Class<AssetPropertyVariant>(
  "AssetPropertyVariant",
)({
  stringValue: S.optional(S.String),
  integerValue: S.optional(S.String),
  doubleValue: S.optional(S.String),
  booleanValue: S.optional(S.String),
}) {}
export class AssetPropertyTimestamp extends S.Class<AssetPropertyTimestamp>(
  "AssetPropertyTimestamp",
)({ timeInSeconds: S.String, offsetInNanos: S.optional(S.String) }) {}
export class AssetPropertyValue extends S.Class<AssetPropertyValue>(
  "AssetPropertyValue",
)({
  value: S.optional(AssetPropertyVariant),
  timestamp: S.optional(AssetPropertyTimestamp),
  quality: S.optional(S.String),
}) {}
export class IotSiteWiseAction extends S.Class<IotSiteWiseAction>(
  "IotSiteWiseAction",
)({
  entryId: S.optional(S.String),
  assetId: S.optional(S.String),
  propertyId: S.optional(S.String),
  propertyAlias: S.optional(S.String),
  propertyValue: S.optional(AssetPropertyValue),
}) {}
export class Action extends S.Class<Action>("Action")({
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
}) {}
export const Actions = S.Array(Action);
export class Event extends S.Class<Event>("Event")({
  eventName: S.String,
  condition: S.optional(S.String),
  actions: S.optional(Actions),
}) {}
export const Events = S.Array(Event);
export class TransitionEvent extends S.Class<TransitionEvent>(
  "TransitionEvent",
)({
  eventName: S.String,
  condition: S.String,
  actions: S.optional(Actions),
  nextState: S.String,
}) {}
export const TransitionEvents = S.Array(TransitionEvent);
export class OnInputLifecycle extends S.Class<OnInputLifecycle>(
  "OnInputLifecycle",
)({
  events: S.optional(Events),
  transitionEvents: S.optional(TransitionEvents),
}) {}
export class OnEnterLifecycle extends S.Class<OnEnterLifecycle>(
  "OnEnterLifecycle",
)({ events: S.optional(Events) }) {}
export class OnExitLifecycle extends S.Class<OnExitLifecycle>(
  "OnExitLifecycle",
)({ events: S.optional(Events) }) {}
export class State extends S.Class<State>("State")({
  stateName: S.String,
  onInput: S.optional(OnInputLifecycle),
  onEnter: S.optional(OnEnterLifecycle),
  onExit: S.optional(OnExitLifecycle),
}) {}
export const States = S.Array(State);
export class DetectorModelDefinition extends S.Class<DetectorModelDefinition>(
  "DetectorModelDefinition",
)({ states: States, initialStateName: S.String }) {}
export class StartDetectorModelAnalysisRequest extends S.Class<StartDetectorModelAnalysisRequest>(
  "StartDetectorModelAnalysisRequest",
)(
  { detectorModelDefinition: DetectorModelDefinition },
  T.all(
    T.Http({ method: "POST", uri: "/analysis/detector-models" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  key: S.String,
  value: S.String,
}) {}
export const Tags = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpQuery("resourceArn")), tags: Tags },
  T.all(T.Http({ method: "POST", uri: "/tags" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags" }),
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
export class SimpleRule extends S.Class<SimpleRule>("SimpleRule")({
  inputProperty: S.String,
  comparisonOperator: S.String,
  threshold: S.String,
}) {}
export class AlarmRule extends S.Class<AlarmRule>("AlarmRule")({
  simpleRule: S.optional(SimpleRule),
}) {}
export class NotificationTargetActions extends S.Class<NotificationTargetActions>(
  "NotificationTargetActions",
)({ lambdaAction: S.optional(LambdaAction) }) {}
export class SSOIdentity extends S.Class<SSOIdentity>("SSOIdentity")({
  identityStoreId: S.String,
  userId: S.optional(S.String),
}) {}
export class RecipientDetail extends S.Class<RecipientDetail>(
  "RecipientDetail",
)({ ssoIdentity: S.optional(SSOIdentity) }) {}
export const RecipientDetails = S.Array(RecipientDetail);
export class SMSConfiguration extends S.Class<SMSConfiguration>(
  "SMSConfiguration",
)({
  senderId: S.optional(S.String),
  additionalMessage: S.optional(S.String),
  recipients: RecipientDetails,
}) {}
export const SMSConfigurations = S.Array(SMSConfiguration);
export class EmailContent extends S.Class<EmailContent>("EmailContent")({
  subject: S.optional(S.String),
  additionalMessage: S.optional(S.String),
}) {}
export class EmailRecipients extends S.Class<EmailRecipients>(
  "EmailRecipients",
)({ to: S.optional(RecipientDetails) }) {}
export class EmailConfiguration extends S.Class<EmailConfiguration>(
  "EmailConfiguration",
)({
  from: S.String,
  content: S.optional(EmailContent),
  recipients: EmailRecipients,
}) {}
export const EmailConfigurations = S.Array(EmailConfiguration);
export class NotificationAction extends S.Class<NotificationAction>(
  "NotificationAction",
)({
  action: NotificationTargetActions,
  smsConfigurations: S.optional(SMSConfigurations),
  emailConfigurations: S.optional(EmailConfigurations),
}) {}
export const NotificationActions = S.Array(NotificationAction);
export class AlarmNotification extends S.Class<AlarmNotification>(
  "AlarmNotification",
)({ notificationActions: S.optional(NotificationActions) }) {}
export class AlarmAction extends S.Class<AlarmAction>("AlarmAction")({
  sns: S.optional(SNSTopicPublishAction),
  iotTopicPublish: S.optional(IotTopicPublishAction),
  lambda: S.optional(LambdaAction),
  iotEvents: S.optional(IotEventsAction),
  sqs: S.optional(SqsAction),
  firehose: S.optional(FirehoseAction),
  dynamoDB: S.optional(DynamoDBAction),
  dynamoDBv2: S.optional(DynamoDBv2Action),
  iotSiteWise: S.optional(IotSiteWiseAction),
}) {}
export const AlarmActions = S.Array(AlarmAction);
export class AlarmEventActions extends S.Class<AlarmEventActions>(
  "AlarmEventActions",
)({ alarmActions: S.optional(AlarmActions) }) {}
export class InitializationConfiguration extends S.Class<InitializationConfiguration>(
  "InitializationConfiguration",
)({ disabledOnInitialization: S.Boolean }) {}
export class AcknowledgeFlow extends S.Class<AcknowledgeFlow>(
  "AcknowledgeFlow",
)({ enabled: S.Boolean }) {}
export class AlarmCapabilities extends S.Class<AlarmCapabilities>(
  "AlarmCapabilities",
)({
  initializationConfiguration: S.optional(InitializationConfiguration),
  acknowledgeFlow: S.optional(AcknowledgeFlow),
}) {}
export class UpdateAlarmModelRequest extends S.Class<UpdateAlarmModelRequest>(
  "UpdateAlarmModelRequest",
)(
  {
    alarmModelName: S.String.pipe(T.HttpLabel()),
    alarmModelDescription: S.optional(S.String),
    roleArn: S.String,
    severity: S.optional(S.Number),
    alarmRule: AlarmRule,
    alarmNotification: S.optional(AlarmNotification),
    alarmEventActions: S.optional(AlarmEventActions),
    alarmCapabilities: S.optional(AlarmCapabilities),
  },
  T.all(
    T.Http({ method: "POST", uri: "/alarm-models/{alarmModelName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDetectorModelRequest extends S.Class<UpdateDetectorModelRequest>(
  "UpdateDetectorModelRequest",
)(
  {
    detectorModelName: S.String.pipe(T.HttpLabel()),
    detectorModelDefinition: DetectorModelDefinition,
    detectorModelDescription: S.optional(S.String),
    roleArn: S.String,
    evaluationMethod: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector-models/{detectorModelName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Attribute extends S.Class<Attribute>("Attribute")({
  jsonPath: S.String,
}) {}
export const Attributes = S.Array(Attribute);
export class InputDefinition extends S.Class<InputDefinition>(
  "InputDefinition",
)({ attributes: Attributes }) {}
export class UpdateInputRequest extends S.Class<UpdateInputRequest>(
  "UpdateInputRequest",
)(
  {
    inputName: S.String.pipe(T.HttpLabel()),
    inputDescription: S.optional(S.String),
    inputDefinition: InputDefinition,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/inputs/{inputName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAlarmModelResponse extends S.Class<DescribeAlarmModelResponse>(
  "DescribeAlarmModelResponse",
)({
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
}) {}
export class DescribeDetectorModelAnalysisResponse extends S.Class<DescribeDetectorModelAnalysisResponse>(
  "DescribeDetectorModelAnalysisResponse",
)({ status: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(Tags) }) {}
export class StartDetectorModelAnalysisResponse extends S.Class<StartDetectorModelAnalysisResponse>(
  "StartDetectorModelAnalysisResponse",
)({ analysisId: S.optional(S.String) }) {}
export class UpdateAlarmModelResponse extends S.Class<UpdateAlarmModelResponse>(
  "UpdateAlarmModelResponse",
)({
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  alarmModelArn: S.optional(S.String),
  alarmModelVersion: S.optional(S.String),
  lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
}) {}
export class IotEventsInputIdentifier extends S.Class<IotEventsInputIdentifier>(
  "IotEventsInputIdentifier",
)({ inputName: S.String }) {}
export class DetectorModelConfiguration extends S.Class<DetectorModelConfiguration>(
  "DetectorModelConfiguration",
)({
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
}) {}
export class DetectorModel extends S.Class<DetectorModel>("DetectorModel")({
  detectorModelDefinition: S.optional(DetectorModelDefinition),
  detectorModelConfiguration: S.optional(DetectorModelConfiguration),
}) {}
export class InputConfiguration extends S.Class<InputConfiguration>(
  "InputConfiguration",
)({
  inputName: S.String,
  inputDescription: S.optional(S.String),
  inputArn: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: S.String,
}) {}
export class Input extends S.Class<Input>("Input")({
  inputConfiguration: S.optional(InputConfiguration),
  inputDefinition: S.optional(InputDefinition),
}) {}
export class AlarmModelSummary extends S.Class<AlarmModelSummary>(
  "AlarmModelSummary",
)({
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  alarmModelDescription: S.optional(S.String),
  alarmModelName: S.optional(S.String),
}) {}
export const AlarmModelSummaries = S.Array(AlarmModelSummary);
export class AlarmModelVersionSummary extends S.Class<AlarmModelVersionSummary>(
  "AlarmModelVersionSummary",
)({
  alarmModelName: S.optional(S.String),
  alarmModelArn: S.optional(S.String),
  alarmModelVersion: S.optional(S.String),
  roleArn: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
  statusMessage: S.optional(S.String),
}) {}
export const AlarmModelVersionSummaries = S.Array(AlarmModelVersionSummary);
export class DetectorModelSummary extends S.Class<DetectorModelSummary>(
  "DetectorModelSummary",
)({
  detectorModelName: S.optional(S.String),
  detectorModelDescription: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const DetectorModelSummaries = S.Array(DetectorModelSummary);
export class DetectorModelVersionSummary extends S.Class<DetectorModelVersionSummary>(
  "DetectorModelVersionSummary",
)({
  detectorModelName: S.optional(S.String),
  detectorModelVersion: S.optional(S.String),
  detectorModelArn: S.optional(S.String),
  roleArn: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
  evaluationMethod: S.optional(S.String),
}) {}
export const DetectorModelVersionSummaries = S.Array(
  DetectorModelVersionSummary,
);
export class InputSummary extends S.Class<InputSummary>("InputSummary")({
  inputName: S.optional(S.String),
  inputDescription: S.optional(S.String),
  inputArn: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
}) {}
export const InputSummaries = S.Array(InputSummary);
export class IotSiteWiseAssetModelPropertyIdentifier extends S.Class<IotSiteWiseAssetModelPropertyIdentifier>(
  "IotSiteWiseAssetModelPropertyIdentifier",
)({ assetModelId: S.String, propertyId: S.String }) {}
export class CreateInputRequest extends S.Class<CreateInputRequest>(
  "CreateInputRequest",
)(
  {
    inputName: S.String,
    inputDescription: S.optional(S.String),
    inputDefinition: InputDefinition,
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/inputs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDetectorModelResponse extends S.Class<DescribeDetectorModelResponse>(
  "DescribeDetectorModelResponse",
)({ detectorModel: S.optional(DetectorModel) }) {}
export class DescribeInputResponse extends S.Class<DescribeInputResponse>(
  "DescribeInputResponse",
)({ input: S.optional(Input) }) {}
export class DescribeLoggingOptionsResponse extends S.Class<DescribeLoggingOptionsResponse>(
  "DescribeLoggingOptionsResponse",
)({ loggingOptions: S.optional(LoggingOptions) }) {}
export class ListAlarmModelsResponse extends S.Class<ListAlarmModelsResponse>(
  "ListAlarmModelsResponse",
)({
  alarmModelSummaries: S.optional(AlarmModelSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListAlarmModelVersionsResponse extends S.Class<ListAlarmModelVersionsResponse>(
  "ListAlarmModelVersionsResponse",
)({
  alarmModelVersionSummaries: S.optional(AlarmModelVersionSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListDetectorModelsResponse extends S.Class<ListDetectorModelsResponse>(
  "ListDetectorModelsResponse",
)({
  detectorModelSummaries: S.optional(DetectorModelSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListDetectorModelVersionsResponse extends S.Class<ListDetectorModelVersionsResponse>(
  "ListDetectorModelVersionsResponse",
)({
  detectorModelVersionSummaries: S.optional(DetectorModelVersionSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListInputsResponse extends S.Class<ListInputsResponse>(
  "ListInputsResponse",
)({
  inputSummaries: S.optional(InputSummaries),
  nextToken: S.optional(S.String),
}) {}
export class UpdateDetectorModelResponse extends S.Class<UpdateDetectorModelResponse>(
  "UpdateDetectorModelResponse",
)({ detectorModelConfiguration: S.optional(DetectorModelConfiguration) }) {}
export class UpdateInputResponse extends S.Class<UpdateInputResponse>(
  "UpdateInputResponse",
)({ inputConfiguration: S.optional(InputConfiguration) }) {}
export class AnalysisResultLocation extends S.Class<AnalysisResultLocation>(
  "AnalysisResultLocation",
)({ path: S.optional(S.String) }) {}
export const AnalysisResultLocations = S.Array(AnalysisResultLocation);
export class IotSiteWiseInputIdentifier extends S.Class<IotSiteWiseInputIdentifier>(
  "IotSiteWiseInputIdentifier",
)({
  iotSiteWiseAssetModelPropertyIdentifier: S.optional(
    IotSiteWiseAssetModelPropertyIdentifier,
  ),
}) {}
export class AnalysisResult extends S.Class<AnalysisResult>("AnalysisResult")({
  type: S.optional(S.String),
  level: S.optional(S.String),
  message: S.optional(S.String),
  locations: S.optional(AnalysisResultLocations),
}) {}
export const AnalysisResults = S.Array(AnalysisResult);
export class InputIdentifier extends S.Class<InputIdentifier>(
  "InputIdentifier",
)({
  iotEventsInputIdentifier: S.optional(IotEventsInputIdentifier),
  iotSiteWiseInputIdentifier: S.optional(IotSiteWiseInputIdentifier),
}) {}
export class CreateInputResponse extends S.Class<CreateInputResponse>(
  "CreateInputResponse",
)({ inputConfiguration: S.optional(InputConfiguration) }) {}
export class GetDetectorModelAnalysisResultsResponse extends S.Class<GetDetectorModelAnalysisResultsResponse>(
  "GetDetectorModelAnalysisResultsResponse",
)({
  analysisResults: S.optional(AnalysisResults),
  nextToken: S.optional(S.String),
}) {}
export class ListInputRoutingsRequest extends S.Class<ListInputRoutingsRequest>(
  "ListInputRoutingsRequest",
)(
  {
    inputIdentifier: InputIdentifier,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/input-routings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RoutedResource extends S.Class<RoutedResource>("RoutedResource")({
  name: S.optional(S.String),
  arn: S.optional(S.String),
}) {}
export const RoutedResources = S.Array(RoutedResource);
export class CreateAlarmModelRequest extends S.Class<CreateAlarmModelRequest>(
  "CreateAlarmModelRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "POST", uri: "/alarm-models" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListInputRoutingsResponse extends S.Class<ListInputRoutingsResponse>(
  "ListInputRoutingsResponse",
)({
  routedResources: S.optional(RoutedResources),
  nextToken: S.optional(S.String),
}) {}
export class CreateAlarmModelResponse extends S.Class<CreateAlarmModelResponse>(
  "CreateAlarmModelResponse",
)({
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  alarmModelArn: S.optional(S.String),
  alarmModelVersion: S.optional(S.String),
  lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
}) {}
export class CreateDetectorModelRequest extends S.Class<CreateDetectorModelRequest>(
  "CreateDetectorModelRequest",
)(
  {
    detectorModelName: S.String,
    detectorModelDefinition: DetectorModelDefinition,
    detectorModelDescription: S.optional(S.String),
    key: S.optional(S.String),
    roleArn: S.String,
    tags: S.optional(Tags),
    evaluationMethod: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector-models" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDetectorModelResponse extends S.Class<CreateDetectorModelResponse>(
  "CreateDetectorModelResponse",
)({ detectorModelConfiguration: S.optional(DetectorModelConfiguration) }) {}

//# Errors
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  {},
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  {},
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
) {}
export class UnsupportedOperationException extends S.TaggedError<UnsupportedOperationException>()(
  "UnsupportedOperationException",
  {},
) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceArn: S.optional(S.String),
  },
) {}

//# Operations
/**
 * Deletes a detector model. Any active instances of the detector model are also
 * deleted.
 */
export const deleteDetectorModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteInput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves information about an alarm model. If you don't specify a value for the
 * `alarmModelVersion` parameter, the latest version is returned.
 */
export const describeAlarmModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeDetectorModelAnalysis =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists the tags (metadata) you have assigned to the resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Performs an analysis of your detector model. For more information,
 * see Troubleshooting a detector model
 * in the *AWS IoT Events Developer Guide*.
 */
export const startDetectorModelAnalysis = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartDetectorModelAnalysisRequest,
    output: StartDetectorModelAnalysisResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Adds to or modifies the tags of the given resource. Tags are metadata that can be used to
 * manage a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Removes the given tags (metadata) from the resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates an alarm model. Any alarms that were created based on the previous version are
 * deleted and then created again as new data arrives.
 */
export const updateAlarmModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes an alarm model. Any alarm instances that were created based on this alarm model
 * are also deleted. This action can't be undone.
 */
export const deleteAlarmModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Describes a detector model. If the `version` parameter is not specified,
 * information about the latest version is returned.
 */
export const describeDetectorModel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDetectorModelRequest,
    output: DescribeDetectorModelResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Describes an input.
 */
export const describeInput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves the current settings of the AWS IoT Events logging options.
 */
export const describeLoggingOptions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Lists the alarm models that you created. The operation returns only the metadata
 * associated with each alarm model.
 */
export const listAlarmModels = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists all the versions of an alarm model. The operation returns only the metadata
 * associated with each alarm model version.
 */
export const listAlarmModelVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAlarmModelVersionsRequest,
    output: ListAlarmModelVersionsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists the detector models you have created. Only the metadata associated with each
 * detector model is returned.
 */
export const listDetectorModels = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists all the versions of a detector model. Only the metadata associated with each
 * detector model version is returned.
 */
export const listDetectorModelVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDetectorModelVersionsRequest,
    output: ListDetectorModelVersionsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists the inputs you have created.
 */
export const listInputs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Sets or updates the AWS IoT Events logging options.
 *
 * If you update the value of any `loggingOptions` field, it takes up to one
 * minute for the change to take effect. If you change the policy attached to the role you
 * specified in the `roleArn` field (for example, to correct an invalid policy), it
 * takes up to five minutes for that change to take effect.
 */
export const putLoggingOptions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates a detector model. Detectors (instances) spawned by the previous version are
 * deleted and then re-created as new inputs arrive.
 */
export const updateDetectorModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateInput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves one or more analysis results of the detector model.
 *
 * After AWS IoT Events starts analyzing your detector model, you have up to 24 hours to retrieve the analysis results.
 */
export const getDetectorModelAnalysisResults =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates an input.
 */
export const createInput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listInputRoutings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates an alarm model to monitor an AWS IoT Events input attribute. You can use the alarm to get
 * notified when the value is outside a specified range. For more information, see Create an
 * alarm model in the *AWS IoT Events Developer Guide*.
 */
export const createAlarmModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDetectorModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
