import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Lex Runtime V2",
  serviceShapeName: "AWSDeepSenseRunTimeServiceApi2_0",
});
const auth = T.AwsAuthSigv4({ name: "lex" });
const ver = T.ServiceVersion("2020-08-07");
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
                        url: "https://runtime-v2-lex-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://runtime-v2-lex-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://runtime-v2-lex.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://runtime-v2-lex.{Region}.{PartitionResult#dnsSuffix}",
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
export class DeleteSessionRequest extends S.Class<DeleteSessionRequest>(
  "DeleteSessionRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botAliasId: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    sessionId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/bots/{botId}/botAliases/{botAliasId}/botLocales/{localeId}/sessions/{sessionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSessionRequest extends S.Class<GetSessionRequest>(
  "GetSessionRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botAliasId: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    sessionId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/bots/{botId}/botAliases/{botAliasId}/botLocales/{localeId}/sessions/{sessionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ElicitSubSlot extends S.Class<ElicitSubSlot>("ElicitSubSlot")({
  name: S.String,
  subSlotToElicit: S.optional(
    S.suspend((): S.Schema<ElicitSubSlot, any> => ElicitSubSlot),
  ),
}) {}
export class DialogAction extends S.Class<DialogAction>("DialogAction")({
  type: S.String,
  slotToElicit: S.optional(S.String),
  slotElicitationStyle: S.optional(S.String),
  subSlotToElicit: S.optional(ElicitSubSlot),
}) {}
export type Slots = { [key: string]: Slot };
export const Slots = S.Record({
  key: S.String,
  value: S.suspend((): S.Schema<Slot, any> => Slot),
}) as any as S.Schema<Slots>;
export class Intent extends S.Class<Intent>("Intent")({
  name: S.String,
  slots: S.optional(Slots),
  state: S.optional(S.String),
  confirmationState: S.optional(S.String),
}) {}
export class ActiveContextTimeToLive extends S.Class<ActiveContextTimeToLive>(
  "ActiveContextTimeToLive",
)({ timeToLiveInSeconds: S.Number, turnsToLive: S.Number }) {}
export const ActiveContextParametersMap = S.Record({
  key: S.String,
  value: S.String,
});
export class ActiveContext extends S.Class<ActiveContext>("ActiveContext")({
  name: S.String,
  timeToLive: ActiveContextTimeToLive,
  contextAttributes: ActiveContextParametersMap,
}) {}
export const ActiveContextsList = S.Array(ActiveContext);
export const StringMap = S.Record({ key: S.String, value: S.String });
export type SlotHintsSlotMap = { [key: string]: RuntimeHintDetails };
export const SlotHintsSlotMap = S.Record({
  key: S.String,
  value: S.suspend((): S.Schema<RuntimeHintDetails, any> => RuntimeHintDetails),
}) as any as S.Schema<SlotHintsSlotMap>;
export const SlotHintsIntentMap = S.Record({
  key: S.String,
  value: S.suspend(() => SlotHintsSlotMap),
});
export class RuntimeHints extends S.Class<RuntimeHints>("RuntimeHints")({
  slotHints: S.optional(SlotHintsIntentMap),
}) {}
export class SessionState extends S.Class<SessionState>("SessionState")({
  dialogAction: S.optional(DialogAction),
  intent: S.optional(Intent),
  activeContexts: S.optional(ActiveContextsList),
  sessionAttributes: S.optional(StringMap),
  originatingRequestId: S.optional(S.String),
  runtimeHints: S.optional(RuntimeHints),
}) {}
export class RecognizeTextRequest extends S.Class<RecognizeTextRequest>(
  "RecognizeTextRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botAliasId: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    sessionId: S.String.pipe(T.HttpLabel()),
    text: S.String,
    sessionState: S.optional(SessionState),
    requestAttributes: S.optional(StringMap),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/bots/{botId}/botAliases/{botAliasId}/botLocales/{localeId}/sessions/{sessionId}/text",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RecognizeUtteranceRequest extends S.Class<RecognizeUtteranceRequest>(
  "RecognizeUtteranceRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botAliasId: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    sessionId: S.String.pipe(T.HttpLabel()),
    sessionState: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-lex-session-state"),
    ),
    requestAttributes: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-lex-request-attributes"),
    ),
    requestContentType: S.String.pipe(T.HttpHeader("Content-Type")),
    responseContentType: S.optional(S.String).pipe(
      T.HttpHeader("Response-Content-Type"),
    ),
    inputStream: S.optional(T.StreamingInput).pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/bots/{botId}/botAliases/{botAliasId}/botLocales/{localeId}/sessions/{sessionId}/utterance",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSessionResponse extends S.Class<DeleteSessionResponse>(
  "DeleteSessionResponse",
)({
  botId: S.optional(S.String),
  botAliasId: S.optional(S.String),
  localeId: S.optional(S.String),
  sessionId: S.optional(S.String),
}) {}
export class RecognizeUtteranceResponse extends S.Class<RecognizeUtteranceResponse>(
  "RecognizeUtteranceResponse",
)({
  inputMode: S.optional(S.String).pipe(T.HttpHeader("x-amz-lex-input-mode")),
  contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  messages: S.optional(S.String).pipe(T.HttpHeader("x-amz-lex-messages")),
  interpretations: S.optional(S.String).pipe(
    T.HttpHeader("x-amz-lex-interpretations"),
  ),
  sessionState: S.optional(S.String).pipe(
    T.HttpHeader("x-amz-lex-session-state"),
  ),
  requestAttributes: S.optional(S.String).pipe(
    T.HttpHeader("x-amz-lex-request-attributes"),
  ),
  sessionId: S.optional(S.String).pipe(T.HttpHeader("x-amz-lex-session-id")),
  inputTranscript: S.optional(S.String).pipe(
    T.HttpHeader("x-amz-lex-input-transcript"),
  ),
  audioStream: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
  recognizedBotMember: S.optional(S.String).pipe(
    T.HttpHeader("x-amz-lex-recognized-bot-member"),
  ),
}) {}
export class Button extends S.Class<Button>("Button")({
  text: S.String,
  value: S.String,
}) {}
export const ButtonsList = S.Array(Button);
export class ImageResponseCard extends S.Class<ImageResponseCard>(
  "ImageResponseCard",
)({
  title: S.String,
  subtitle: S.optional(S.String),
  imageUrl: S.optional(S.String),
  buttons: S.optional(ButtonsList),
}) {}
export class Message extends S.Class<Message>("Message")({
  content: S.optional(S.String),
  contentType: S.String,
  imageResponseCard: S.optional(ImageResponseCard),
}) {}
export const Messages = S.Array(Message);
export class ConfigurationEvent extends S.Class<ConfigurationEvent>(
  "ConfigurationEvent",
)({
  requestAttributes: S.optional(StringMap),
  responseContentType: S.String,
  sessionState: S.optional(SessionState),
  welcomeMessages: S.optional(Messages),
  disablePlayback: S.optional(S.Boolean),
  eventId: S.optional(S.String),
  clientTimestampMillis: S.optional(S.Number),
}) {}
export class AudioInputEvent extends S.Class<AudioInputEvent>(
  "AudioInputEvent",
)({
  audioChunk: S.optional(T.Blob),
  contentType: S.String,
  eventId: S.optional(S.String),
  clientTimestampMillis: S.optional(S.Number),
}) {}
export class DTMFInputEvent extends S.Class<DTMFInputEvent>("DTMFInputEvent")({
  inputCharacter: S.String,
  eventId: S.optional(S.String),
  clientTimestampMillis: S.optional(S.Number),
}) {}
export class TextInputEvent extends S.Class<TextInputEvent>("TextInputEvent")({
  text: S.String,
  eventId: S.optional(S.String),
  clientTimestampMillis: S.optional(S.Number),
}) {}
export class PlaybackCompletionEvent extends S.Class<PlaybackCompletionEvent>(
  "PlaybackCompletionEvent",
)({
  eventId: S.optional(S.String),
  clientTimestampMillis: S.optional(S.Number),
}) {}
export class DisconnectionEvent extends S.Class<DisconnectionEvent>(
  "DisconnectionEvent",
)({
  eventId: S.optional(S.String),
  clientTimestampMillis: S.optional(S.Number),
}) {}
export class RecognizedBotMember extends S.Class<RecognizedBotMember>(
  "RecognizedBotMember",
)({ botId: S.String, botName: S.optional(S.String) }) {}
export const StartConversationRequestEventStream = T.InputEventStream(
  S.Union(
    S.Struct({ ConfigurationEvent: ConfigurationEvent }),
    S.Struct({ AudioInputEvent: AudioInputEvent }),
    S.Struct({ DTMFInputEvent: DTMFInputEvent }),
    S.Struct({ TextInputEvent: TextInputEvent }),
    S.Struct({ PlaybackCompletionEvent: PlaybackCompletionEvent }),
    S.Struct({ DisconnectionEvent: DisconnectionEvent }),
  ),
);
export type Values = Slot[];
export const Values = S.Array(
  S.suspend((): S.Schema<Slot, any> => Slot),
) as any as S.Schema<Values>;
export class ConfidenceScore extends S.Class<ConfidenceScore>(
  "ConfidenceScore",
)({ score: S.optional(S.Number) }) {}
export class SentimentScore extends S.Class<SentimentScore>("SentimentScore")({
  positive: S.optional(S.Number),
  negative: S.optional(S.Number),
  neutral: S.optional(S.Number),
  mixed: S.optional(S.Number),
}) {}
export class SentimentResponse extends S.Class<SentimentResponse>(
  "SentimentResponse",
)({
  sentiment: S.optional(S.String),
  sentimentScore: S.optional(SentimentScore),
}) {}
export class Interpretation extends S.Class<Interpretation>("Interpretation")({
  nluConfidence: S.optional(ConfidenceScore),
  sentimentResponse: S.optional(SentimentResponse),
  intent: S.optional(Intent),
  interpretationSource: S.optional(S.String),
}) {}
export const Interpretations = S.Array(Interpretation);
export class RecognizeTextResponse extends S.Class<RecognizeTextResponse>(
  "RecognizeTextResponse",
)({
  messages: S.optional(Messages),
  sessionState: S.optional(SessionState),
  interpretations: S.optional(Interpretations),
  requestAttributes: S.optional(StringMap),
  sessionId: S.optional(S.String),
  recognizedBotMember: S.optional(RecognizedBotMember),
}) {}
export class StartConversationRequest extends S.Class<StartConversationRequest>(
  "StartConversationRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botAliasId: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    sessionId: S.String.pipe(T.HttpLabel()),
    conversationMode: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-lex-conversation-mode"),
    ),
    requestEventStream: StartConversationRequestEventStream.pipe(
      T.HttpPayload(),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/bots/{botId}/botAliases/{botAliasId}/botLocales/{localeId}/sessions/{sessionId}/conversation",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const StringList = S.Array(S.String);
export class Value extends S.Class<Value>("Value")({
  originalValue: S.optional(S.String),
  interpretedValue: S.String,
  resolvedValues: S.optional(StringList),
}) {}
export class Slot extends S.Class<Slot>("Slot")({
  value: S.optional(Value),
  shape: S.optional(S.String),
  values: S.optional(S.suspend(() => Values)),
  subSlots: S.optional(S.suspend(() => Slots)),
}) {}
export class RuntimeHintValue extends S.Class<RuntimeHintValue>(
  "RuntimeHintValue",
)({ phrase: S.String }) {}
export const RuntimeHintValuesList = S.Array(RuntimeHintValue);
export class GetSessionResponse extends S.Class<GetSessionResponse>(
  "GetSessionResponse",
)({
  sessionId: S.optional(S.String),
  messages: S.optional(Messages),
  interpretations: S.optional(Interpretations),
  sessionState: S.optional(SessionState),
}) {}
export class RuntimeHintDetails extends S.Class<RuntimeHintDetails>(
  "RuntimeHintDetails",
)({
  runtimeHintValues: S.optional(RuntimeHintValuesList),
  subSlotHints: S.optional(S.suspend(() => SlotHintsSlotMap)),
}) {}
export class PlaybackInterruptionEvent extends S.Class<PlaybackInterruptionEvent>(
  "PlaybackInterruptionEvent",
)({
  eventReason: S.optional(S.String),
  causedByEventId: S.optional(S.String),
  eventId: S.optional(S.String),
}) {}
export class TranscriptEvent extends S.Class<TranscriptEvent>(
  "TranscriptEvent",
)({ transcript: S.optional(S.String), eventId: S.optional(S.String) }) {}
export class IntentResultEvent extends S.Class<IntentResultEvent>(
  "IntentResultEvent",
)({
  inputMode: S.optional(S.String),
  interpretations: S.optional(Interpretations),
  sessionState: S.optional(SessionState),
  requestAttributes: S.optional(StringMap),
  sessionId: S.optional(S.String),
  eventId: S.optional(S.String),
  recognizedBotMember: S.optional(RecognizedBotMember),
}) {}
export class TextResponseEvent extends S.Class<TextResponseEvent>(
  "TextResponseEvent",
)({ messages: S.optional(Messages), eventId: S.optional(S.String) }) {}
export class AudioResponseEvent extends S.Class<AudioResponseEvent>(
  "AudioResponseEvent",
)({
  audioChunk: S.optional(T.Blob),
  contentType: S.optional(S.String),
  eventId: S.optional(S.String),
}) {}
export class HeartbeatEvent extends S.Class<HeartbeatEvent>("HeartbeatEvent")({
  eventId: S.optional(S.String),
}) {}
export const StartConversationResponseEventStream = T.EventStream(
  S.Union(
    S.Struct({ PlaybackInterruptionEvent: PlaybackInterruptionEvent }),
    S.Struct({ TranscriptEvent: TranscriptEvent }),
    S.Struct({ IntentResultEvent: IntentResultEvent }),
    S.Struct({ TextResponseEvent: TextResponseEvent }),
    S.Struct({ AudioResponseEvent: AudioResponseEvent }),
    S.Struct({ HeartbeatEvent: HeartbeatEvent }),
    S.Struct({ AccessDeniedException: S.suspend(() => AccessDeniedException) }),
    S.Struct({
      ResourceNotFoundException: S.suspend(() => ResourceNotFoundException),
    }),
    S.Struct({ ValidationException: S.suspend(() => ValidationException) }),
    S.Struct({ ThrottlingException: S.suspend(() => ThrottlingException) }),
    S.Struct({
      InternalServerException: S.suspend(() => InternalServerException),
    }),
    S.Struct({ ConflictException: S.suspend(() => ConflictException) }),
    S.Struct({
      DependencyFailedException: S.suspend(() => DependencyFailedException),
    }),
    S.Struct({ BadGatewayException: S.suspend(() => BadGatewayException) }),
  ),
);
export class StartConversationResponse extends S.Class<StartConversationResponse>(
  "StartConversationResponse",
)({
  responseEventStream: S.optional(StartConversationResponseEventStream).pipe(
    T.HttpPayload(),
  ),
}) {}
export class PutSessionRequest extends S.Class<PutSessionRequest>(
  "PutSessionRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botAliasId: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    sessionId: S.String.pipe(T.HttpLabel()),
    messages: S.optional(Messages),
    sessionState: SessionState,
    requestAttributes: S.optional(StringMap),
    responseContentType: S.optional(S.String).pipe(
      T.HttpHeader("ResponseContentType"),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/bots/{botId}/botAliases/{botAliasId}/botLocales/{localeId}/sessions/{sessionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutSessionResponse extends S.Class<PutSessionResponse>(
  "PutSessionResponse",
)({
  contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  messages: S.optional(S.String).pipe(T.HttpHeader("x-amz-lex-messages")),
  sessionState: S.optional(S.String).pipe(
    T.HttpHeader("x-amz-lex-session-state"),
  ),
  requestAttributes: S.optional(S.String).pipe(
    T.HttpHeader("x-amz-lex-request-attributes"),
  ),
  sessionId: S.optional(S.String).pipe(T.HttpHeader("x-amz-lex-session-id")),
  audioStream: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class BadGatewayException extends S.TaggedError<BadGatewayException>()(
  "BadGatewayException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class DependencyFailedException extends S.TaggedError<DependencyFailedException>()(
  "DependencyFailedException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}

//# Operations
/**
 * Removes session information for a specified bot, alias, and user ID.
 *
 * You can use this operation to restart a conversation with a bot.
 * When you remove a session, the entire history of the session is removed
 * so that you can start again.
 *
 * You don't need to delete a session. Sessions have a time limit and
 * will expire. Set the session time limit when you create the bot. The
 * default is 5 minutes, but you can specify anything between 1 minute and
 * 24 hours.
 *
 * If you specify a bot or alias ID that doesn't exist, you receive a
 * `BadRequestException.`
 *
 * If the locale doesn't exist in the bot, or if the locale hasn't been
 * enables for the alias, you receive a
 * `BadRequestException`.
 */
export const deleteSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSessionRequest,
  output: DeleteSessionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns session information for a specified bot, alias, and
 * user.
 *
 * For example, you can use this operation to retrieve session
 * information for a user that has left a long-running session in
 * use.
 *
 * If the bot, alias, or session identifier doesn't exist, Amazon Lex V2
 * returns a `BadRequestException`. If the locale doesn't exist
 * or is not enabled for the alias, you receive a
 * `BadRequestException`.
 */
export const getSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSessionRequest,
  output: GetSessionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Sends user input to Amazon Lex V2. Client applications use this API to send
 * requests to Amazon Lex V2 at runtime. Amazon Lex V2 then interprets the user input
 * using the machine learning model that it build for the bot.
 *
 * In response, Amazon Lex V2 returns the next message to convey to the user
 * and an optional response card to display.
 *
 * If the optional post-fulfillment response is specified, the messages
 * are returned as follows. For more information, see PostFulfillmentStatusSpecification.
 *
 * - **Success message** - Returned if
 * the Lambda function completes successfully and the intent state is
 * fulfilled or ready fulfillment if the message is present.
 *
 * - **Failed message** - The failed
 * message is returned if the Lambda function throws an exception or
 * if the Lambda function returns a failed intent state without a
 * message.
 *
 * - **Timeout message** - If you
 * don't configure a timeout message and a timeout, and the Lambda
 * function doesn't return within 30 seconds, the timeout message is
 * returned. If you configure a timeout, the timeout message is
 * returned when the period times out.
 *
 * For more information, see Completion message.
 */
export const recognizeText = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RecognizeTextRequest,
  output: RecognizeTextResponse,
  errors: [
    AccessDeniedException,
    BadGatewayException,
    ConflictException,
    DependencyFailedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Sends user input to Amazon Lex V2. You can send text or speech. Clients use
 * this API to send text and audio requests to Amazon Lex V2 at runtime. Amazon Lex V2
 * interprets the user input using the machine learning model built for
 * the bot.
 *
 * The following request fields must be compressed with gzip and then
 * base64 encoded before you send them to Amazon Lex V2.
 *
 * - requestAttributes
 *
 * - sessionState
 *
 * The following response fields are compressed using gzip and then
 * base64 encoded by Amazon Lex V2. Before you can use these fields, you must
 * decode and decompress them.
 *
 * - inputTranscript
 *
 * - interpretations
 *
 * - messages
 *
 * - requestAttributes
 *
 * - sessionState
 *
 * The example contains a Java application that compresses and encodes
 * a Java object to send to Amazon Lex V2, and a second that decodes and
 * decompresses a response from Amazon Lex V2.
 *
 * If the optional post-fulfillment response is specified, the messages
 * are returned as follows. For more information, see PostFulfillmentStatusSpecification.
 *
 * - **Success message** - Returned if
 * the Lambda function completes successfully and the intent state is
 * fulfilled or ready fulfillment if the message is present.
 *
 * - **Failed message** - The failed
 * message is returned if the Lambda function throws an exception or
 * if the Lambda function returns a failed intent state without a
 * message.
 *
 * - **Timeout message** - If you
 * don't configure a timeout message and a timeout, and the Lambda
 * function doesn't return within 30 seconds, the timeout message is
 * returned. If you configure a timeout, the timeout message is
 * returned when the period times out.
 *
 * For more information, see Completion message.
 */
export const recognizeUtterance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RecognizeUtteranceRequest,
  output: RecognizeUtteranceResponse,
  errors: [
    AccessDeniedException,
    BadGatewayException,
    ConflictException,
    DependencyFailedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts an HTTP/2 bidirectional event stream that enables you to send
 * audio, text, or DTMF input in real time. After your application starts
 * a conversation, users send input to Amazon Lex V2 as a stream of events. Amazon Lex V2
 * processes the incoming events and responds with streaming text or audio
 * events.
 *
 * Audio input must be in the following format: audio/lpcm
 * sample-rate=8000 sample-size-bits=16 channel-count=1;
 * is-big-endian=false.
 *
 * If the optional post-fulfillment response is specified, the messages
 * are returned as follows. For more information, see PostFulfillmentStatusSpecification.
 *
 * - **Success message** - Returned if
 * the Lambda function completes successfully and the intent state is
 * fulfilled or ready fulfillment if the message is present.
 *
 * - **Failed message** - The failed
 * message is returned if the Lambda function throws an exception or
 * if the Lambda function returns a failed intent state without a
 * message.
 *
 * - **Timeout message** - If you
 * don't configure a timeout message and a timeout, and the Lambda
 * function doesn't return within 30 seconds, the timeout message is
 * returned. If you configure a timeout, the timeout message is
 * returned when the period times out.
 *
 * For more information, see Completion message.
 *
 * If the optional update message is configured, it is played at the
 * specified frequency while the Lambda function is running and the update
 * message state is active. If the fulfillment update message is not
 * active, the Lambda function runs with a 30 second timeout.
 *
 * For more information, see Update message
 *
 * The `StartConversation` operation is supported only in
 * the following SDKs:
 *
 * - AWS SDK for C++
 *
 * - AWS SDK for Java V2
 *
 * - AWS SDK for Ruby V3
 */
export const startConversation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartConversationRequest,
  output: StartConversationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new session or modifies an existing session with an Amazon Lex V2
 * bot. Use this operation to enable your application to set the state of
 * the bot.
 */
export const putSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutSessionRequest,
  output: PutSessionResponse,
  errors: [
    AccessDeniedException,
    BadGatewayException,
    ConflictException,
    DependencyFailedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
