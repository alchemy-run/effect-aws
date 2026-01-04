import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "IoT Events Data",
  serviceShapeName: "IotColumboDataService",
});
const auth = T.AwsAuthSigv4({ name: "ioteventsdata" });
const ver = T.ServiceVersion("2018-10-23");
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
                        url: "https://data.iotevents-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://data.iotevents-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://data.iotevents.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://data.iotevents.{Region}.{PartitionResult#dnsSuffix}",
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
export class DescribeAlarmRequest extends S.Class<DescribeAlarmRequest>(
  "DescribeAlarmRequest",
)(
  {
    alarmModelName: S.String.pipe(T.HttpLabel()),
    keyValue: S.optional(S.String).pipe(T.HttpQuery("keyValue")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/alarms/{alarmModelName}/keyValues" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDetectorRequest extends S.Class<DescribeDetectorRequest>(
  "DescribeDetectorRequest",
)(
  {
    detectorModelName: S.String.pipe(T.HttpLabel()),
    keyValue: S.optional(S.String).pipe(T.HttpQuery("keyValue")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/detectors/{detectorModelName}/keyValues" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAlarmsRequest extends S.Class<ListAlarmsRequest>(
  "ListAlarmsRequest",
)(
  {
    alarmModelName: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/alarms/{alarmModelName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDetectorsRequest extends S.Class<ListDetectorsRequest>(
  "ListDetectorsRequest",
)(
  {
    detectorModelName: S.String.pipe(T.HttpLabel()),
    stateName: S.optional(S.String).pipe(T.HttpQuery("stateName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/detectors/{detectorModelName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AcknowledgeAlarmActionRequest extends S.Class<AcknowledgeAlarmActionRequest>(
  "AcknowledgeAlarmActionRequest",
)({
  requestId: S.String,
  alarmModelName: S.String,
  keyValue: S.optional(S.String),
  note: S.optional(S.String),
}) {}
export const AcknowledgeAlarmActionRequests = S.Array(
  AcknowledgeAlarmActionRequest,
);
export class DeleteDetectorRequest extends S.Class<DeleteDetectorRequest>(
  "DeleteDetectorRequest",
)({
  messageId: S.String,
  detectorModelName: S.String,
  keyValue: S.optional(S.String),
}) {}
export const DeleteDetectorRequests = S.Array(DeleteDetectorRequest);
export class DisableAlarmActionRequest extends S.Class<DisableAlarmActionRequest>(
  "DisableAlarmActionRequest",
)({
  requestId: S.String,
  alarmModelName: S.String,
  keyValue: S.optional(S.String),
  note: S.optional(S.String),
}) {}
export const DisableAlarmActionRequests = S.Array(DisableAlarmActionRequest);
export class EnableAlarmActionRequest extends S.Class<EnableAlarmActionRequest>(
  "EnableAlarmActionRequest",
)({
  requestId: S.String,
  alarmModelName: S.String,
  keyValue: S.optional(S.String),
  note: S.optional(S.String),
}) {}
export const EnableAlarmActionRequests = S.Array(EnableAlarmActionRequest);
export class ResetAlarmActionRequest extends S.Class<ResetAlarmActionRequest>(
  "ResetAlarmActionRequest",
)({
  requestId: S.String,
  alarmModelName: S.String,
  keyValue: S.optional(S.String),
  note: S.optional(S.String),
}) {}
export const ResetAlarmActionRequests = S.Array(ResetAlarmActionRequest);
export class SnoozeAlarmActionRequest extends S.Class<SnoozeAlarmActionRequest>(
  "SnoozeAlarmActionRequest",
)({
  requestId: S.String,
  alarmModelName: S.String,
  keyValue: S.optional(S.String),
  note: S.optional(S.String),
  snoozeDuration: S.Number,
}) {}
export const SnoozeAlarmActionRequests = S.Array(SnoozeAlarmActionRequest);
export class BatchAcknowledgeAlarmRequest extends S.Class<BatchAcknowledgeAlarmRequest>(
  "BatchAcknowledgeAlarmRequest",
)(
  { acknowledgeActionRequests: AcknowledgeAlarmActionRequests },
  T.all(
    T.Http({ method: "POST", uri: "/alarms/acknowledge" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchDeleteDetectorRequest extends S.Class<BatchDeleteDetectorRequest>(
  "BatchDeleteDetectorRequest",
)(
  { detectors: DeleteDetectorRequests },
  T.all(
    T.Http({ method: "POST", uri: "/detectors/delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchDisableAlarmRequest extends S.Class<BatchDisableAlarmRequest>(
  "BatchDisableAlarmRequest",
)(
  { disableActionRequests: DisableAlarmActionRequests },
  T.all(
    T.Http({ method: "POST", uri: "/alarms/disable" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchEnableAlarmRequest extends S.Class<BatchEnableAlarmRequest>(
  "BatchEnableAlarmRequest",
)(
  { enableActionRequests: EnableAlarmActionRequests },
  T.all(
    T.Http({ method: "POST", uri: "/alarms/enable" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchResetAlarmRequest extends S.Class<BatchResetAlarmRequest>(
  "BatchResetAlarmRequest",
)(
  { resetActionRequests: ResetAlarmActionRequests },
  T.all(
    T.Http({ method: "POST", uri: "/alarms/reset" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchSnoozeAlarmRequest extends S.Class<BatchSnoozeAlarmRequest>(
  "BatchSnoozeAlarmRequest",
)(
  { snoozeActionRequests: SnoozeAlarmActionRequests },
  T.all(
    T.Http({ method: "POST", uri: "/alarms/snooze" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TimestampValue extends S.Class<TimestampValue>("TimestampValue")({
  timeInMillis: S.optional(S.Number),
}) {}
export class Message extends S.Class<Message>("Message")({
  messageId: S.String,
  inputName: S.String,
  payload: T.Blob,
  timestamp: S.optional(TimestampValue),
}) {}
export const Messages = S.Array(Message);
export class AlarmSummary extends S.Class<AlarmSummary>("AlarmSummary")({
  alarmModelName: S.optional(S.String),
  alarmModelVersion: S.optional(S.String),
  keyValue: S.optional(S.String),
  stateName: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const AlarmSummaries = S.Array(AlarmSummary);
export class VariableDefinition extends S.Class<VariableDefinition>(
  "VariableDefinition",
)({ name: S.String, value: S.String }) {}
export const VariableDefinitions = S.Array(VariableDefinition);
export class TimerDefinition extends S.Class<TimerDefinition>(
  "TimerDefinition",
)({ name: S.String, seconds: S.Number }) {}
export const TimerDefinitions = S.Array(TimerDefinition);
export class BatchAlarmActionErrorEntry extends S.Class<BatchAlarmActionErrorEntry>(
  "BatchAlarmActionErrorEntry",
)({
  requestId: S.optional(S.String),
  errorCode: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export const BatchAlarmActionErrorEntries = S.Array(BatchAlarmActionErrorEntry);
export class BatchDisableAlarmResponse extends S.Class<BatchDisableAlarmResponse>(
  "BatchDisableAlarmResponse",
)({ errorEntries: S.optional(BatchAlarmActionErrorEntries) }) {}
export class BatchEnableAlarmResponse extends S.Class<BatchEnableAlarmResponse>(
  "BatchEnableAlarmResponse",
)({ errorEntries: S.optional(BatchAlarmActionErrorEntries) }) {}
export class BatchPutMessageRequest extends S.Class<BatchPutMessageRequest>(
  "BatchPutMessageRequest",
)(
  { messages: Messages },
  T.all(
    T.Http({ method: "POST", uri: "/inputs/messages" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchResetAlarmResponse extends S.Class<BatchResetAlarmResponse>(
  "BatchResetAlarmResponse",
)({ errorEntries: S.optional(BatchAlarmActionErrorEntries) }) {}
export class BatchSnoozeAlarmResponse extends S.Class<BatchSnoozeAlarmResponse>(
  "BatchSnoozeAlarmResponse",
)({ errorEntries: S.optional(BatchAlarmActionErrorEntries) }) {}
export class ListAlarmsResponse extends S.Class<ListAlarmsResponse>(
  "ListAlarmsResponse",
)({
  alarmSummaries: S.optional(AlarmSummaries),
  nextToken: S.optional(S.String),
}) {}
export class DetectorStateDefinition extends S.Class<DetectorStateDefinition>(
  "DetectorStateDefinition",
)({
  stateName: S.String,
  variables: VariableDefinitions,
  timers: TimerDefinitions,
}) {}
export class DetectorStateSummary extends S.Class<DetectorStateSummary>(
  "DetectorStateSummary",
)({ stateName: S.optional(S.String) }) {}
export class BatchDeleteDetectorErrorEntry extends S.Class<BatchDeleteDetectorErrorEntry>(
  "BatchDeleteDetectorErrorEntry",
)({
  messageId: S.optional(S.String),
  errorCode: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export const BatchDeleteDetectorErrorEntries = S.Array(
  BatchDeleteDetectorErrorEntry,
);
export class UpdateDetectorRequest extends S.Class<UpdateDetectorRequest>(
  "UpdateDetectorRequest",
)({
  messageId: S.String,
  detectorModelName: S.String,
  keyValue: S.optional(S.String),
  state: DetectorStateDefinition,
}) {}
export const UpdateDetectorRequests = S.Array(UpdateDetectorRequest);
export class DetectorSummary extends S.Class<DetectorSummary>(
  "DetectorSummary",
)({
  detectorModelName: S.optional(S.String),
  keyValue: S.optional(S.String),
  detectorModelVersion: S.optional(S.String),
  state: S.optional(DetectorStateSummary),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const DetectorSummaries = S.Array(DetectorSummary);
export class Variable extends S.Class<Variable>("Variable")({
  name: S.String,
  value: S.String,
}) {}
export const Variables = S.Array(Variable);
export class Timer extends S.Class<Timer>("Timer")({
  name: S.String,
  timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const Timers = S.Array(Timer);
export class BatchAcknowledgeAlarmResponse extends S.Class<BatchAcknowledgeAlarmResponse>(
  "BatchAcknowledgeAlarmResponse",
)({ errorEntries: S.optional(BatchAlarmActionErrorEntries) }) {}
export class BatchDeleteDetectorResponse extends S.Class<BatchDeleteDetectorResponse>(
  "BatchDeleteDetectorResponse",
)({
  batchDeleteDetectorErrorEntries: S.optional(BatchDeleteDetectorErrorEntries),
}) {}
export class BatchUpdateDetectorRequest extends S.Class<BatchUpdateDetectorRequest>(
  "BatchUpdateDetectorRequest",
)(
  { detectors: UpdateDetectorRequests },
  T.all(
    T.Http({ method: "POST", uri: "/detectors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDetectorsResponse extends S.Class<ListDetectorsResponse>(
  "ListDetectorsResponse",
)({
  detectorSummaries: S.optional(DetectorSummaries),
  nextToken: S.optional(S.String),
}) {}
export class DetectorState extends S.Class<DetectorState>("DetectorState")({
  stateName: S.String,
  variables: Variables,
  timers: Timers,
}) {}
export class SimpleRuleEvaluation extends S.Class<SimpleRuleEvaluation>(
  "SimpleRuleEvaluation",
)({
  inputPropertyValue: S.optional(S.String),
  operator: S.optional(S.String),
  thresholdValue: S.optional(S.String),
}) {}
export class SnoozeActionConfiguration extends S.Class<SnoozeActionConfiguration>(
  "SnoozeActionConfiguration",
)({ snoozeDuration: S.optional(S.Number), note: S.optional(S.String) }) {}
export class EnableActionConfiguration extends S.Class<EnableActionConfiguration>(
  "EnableActionConfiguration",
)({ note: S.optional(S.String) }) {}
export class DisableActionConfiguration extends S.Class<DisableActionConfiguration>(
  "DisableActionConfiguration",
)({ note: S.optional(S.String) }) {}
export class AcknowledgeActionConfiguration extends S.Class<AcknowledgeActionConfiguration>(
  "AcknowledgeActionConfiguration",
)({ note: S.optional(S.String) }) {}
export class ResetActionConfiguration extends S.Class<ResetActionConfiguration>(
  "ResetActionConfiguration",
)({ note: S.optional(S.String) }) {}
export class StateChangeConfiguration extends S.Class<StateChangeConfiguration>(
  "StateChangeConfiguration",
)({ triggerType: S.optional(S.String) }) {}
export class BatchPutMessageErrorEntry extends S.Class<BatchPutMessageErrorEntry>(
  "BatchPutMessageErrorEntry",
)({
  messageId: S.optional(S.String),
  errorCode: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export const BatchPutMessageErrorEntries = S.Array(BatchPutMessageErrorEntry);
export class Detector extends S.Class<Detector>("Detector")({
  detectorModelName: S.optional(S.String),
  keyValue: S.optional(S.String),
  detectorModelVersion: S.optional(S.String),
  state: S.optional(DetectorState),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class RuleEvaluation extends S.Class<RuleEvaluation>("RuleEvaluation")({
  simpleRuleEvaluation: S.optional(SimpleRuleEvaluation),
}) {}
export class CustomerAction extends S.Class<CustomerAction>("CustomerAction")({
  actionName: S.optional(S.String),
  snoozeActionConfiguration: S.optional(SnoozeActionConfiguration),
  enableActionConfiguration: S.optional(EnableActionConfiguration),
  disableActionConfiguration: S.optional(DisableActionConfiguration),
  acknowledgeActionConfiguration: S.optional(AcknowledgeActionConfiguration),
  resetActionConfiguration: S.optional(ResetActionConfiguration),
}) {}
export class SystemEvent extends S.Class<SystemEvent>("SystemEvent")({
  eventType: S.optional(S.String),
  stateChangeConfiguration: S.optional(StateChangeConfiguration),
}) {}
export class BatchPutMessageResponse extends S.Class<BatchPutMessageResponse>(
  "BatchPutMessageResponse",
)({ BatchPutMessageErrorEntries: S.optional(BatchPutMessageErrorEntries) }) {}
export class DescribeDetectorResponse extends S.Class<DescribeDetectorResponse>(
  "DescribeDetectorResponse",
)({ detector: S.optional(Detector) }) {}
export class AlarmState extends S.Class<AlarmState>("AlarmState")({
  stateName: S.optional(S.String),
  ruleEvaluation: S.optional(RuleEvaluation),
  customerAction: S.optional(CustomerAction),
  systemEvent: S.optional(SystemEvent),
}) {}
export class BatchUpdateDetectorErrorEntry extends S.Class<BatchUpdateDetectorErrorEntry>(
  "BatchUpdateDetectorErrorEntry",
)({
  messageId: S.optional(S.String),
  errorCode: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export const BatchUpdateDetectorErrorEntries = S.Array(
  BatchUpdateDetectorErrorEntry,
);
export class Alarm extends S.Class<Alarm>("Alarm")({
  alarmModelName: S.optional(S.String),
  alarmModelVersion: S.optional(S.String),
  keyValue: S.optional(S.String),
  alarmState: S.optional(AlarmState),
  severity: S.optional(S.Number),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class BatchUpdateDetectorResponse extends S.Class<BatchUpdateDetectorResponse>(
  "BatchUpdateDetectorResponse",
)({
  batchUpdateDetectorErrorEntries: S.optional(BatchUpdateDetectorErrorEntries),
}) {}
export class DescribeAlarmResponse extends S.Class<DescribeAlarmResponse>(
  "DescribeAlarmResponse",
)({ alarm: S.optional(Alarm) }) {}

//# Errors
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  {},
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
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
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Acknowledges one or more alarms. The alarms change to the `ACKNOWLEDGED` state
 * after you acknowledge them.
 */
export const batchAcknowledgeAlarm = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchAcknowledgeAlarmRequest,
    output: BatchAcknowledgeAlarmResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes one or more detectors that were created. When a detector is deleted, its state will be cleared and the detector will be removed from the list of detectors. The deleted detector will no longer appear if referenced in the ListDetectors API call.
 */
export const batchDeleteDetector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteDetectorRequest,
  output: BatchDeleteDetectorResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Disables one or more alarms. The alarms change to the `DISABLED` state after
 * you disable them.
 */
export const batchDisableAlarm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDisableAlarmRequest,
  output: BatchDisableAlarmResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Enables one or more alarms. The alarms change to the `NORMAL` state after you
 * enable them.
 */
export const batchEnableAlarm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchEnableAlarmRequest,
  output: BatchEnableAlarmResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Resets one or more alarms. The alarms return to the `NORMAL` state after you
 * reset them.
 */
export const batchResetAlarm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchResetAlarmRequest,
  output: BatchResetAlarmResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Changes one or more alarms to the snooze mode. The alarms change to the
 * `SNOOZE_DISABLED` state after you set them to the snooze mode.
 */
export const batchSnoozeAlarm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchSnoozeAlarmRequest,
  output: BatchSnoozeAlarmResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Lists one or more alarms. The operation returns only the metadata associated with each
 * alarm.
 */
export const listAlarms = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAlarmsRequest,
  output: ListAlarmsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Lists detectors (the instances of a detector model).
 */
export const listDetectors = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDetectorsRequest,
  output: ListDetectorsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Sends a set of messages to the IoT Events system. Each message payload is transformed into
 * the input you specify (`"inputName"`) and ingested into any detectors that monitor
 * that input. If multiple messages are sent, the order in which the messages are processed isn't
 * guaranteed. To guarantee ordering, you must send messages one at a time and wait for a
 * successful response.
 */
export const batchPutMessage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchPutMessageRequest,
  output: BatchPutMessageResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Returns information about the specified detector (instance).
 */
export const describeDetector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDetectorRequest,
  output: DescribeDetectorResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Updates the state, variable values, and timer settings of one or more detectors
 * (instances) of a specified detector model.
 */
export const batchUpdateDetector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchUpdateDetectorRequest,
  output: BatchUpdateDetectorResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about an alarm.
 */
export const describeAlarm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAlarmRequest,
  output: DescribeAlarmResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
