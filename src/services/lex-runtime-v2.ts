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
  sdkId: "Lex Runtime V2",
  serviceShapeName: "AWSDeepSenseRunTimeServiceApi2_0",
});
const auth = T.AwsAuthSigv4({ name: "lex" });
const ver = T.ServiceVersion("2020-08-07");
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
              `https://runtime-v2-lex-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://runtime-v2-lex-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://runtime-v2-lex.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://runtime-v2-lex.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type BotIdentifier = string;
export type BotAliasIdentifier = string;
export type LocaleId = string;
export type SessionId = string;
export type NonEmptyString = string;
export type Text = string | Redacted.Redacted<string>;
export type SensitiveNonEmptyString = string | Redacted.Redacted<string>;
export type AttachmentTitle = string;
export type AttachmentUrl = string;
export type ActiveContextName = string;
export type EventId = string;
export type EpochMillis = number;
export type DTMFRegex = string | Redacted.Redacted<string>;
export type Name = string;
export type ButtonText = string;
export type ButtonValue = string;
export type ActiveContextTimeToLiveInSeconds = number;
export type ActiveContextTurnsToLive = number;
export type ParameterName = string;
export type Double = number;
export type RuntimeHintPhrase = string;

//# Schemas
export interface DeleteSessionRequest {
  botId: string;
  botAliasId: string;
  localeId: string;
  sessionId: string;
}
export const DeleteSessionRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botAliasId: S.String.pipe(T.HttpLabel("botAliasId")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteSessionRequest",
}) as any as S.Schema<DeleteSessionRequest>;
export interface GetSessionRequest {
  botId: string;
  botAliasId: string;
  localeId: string;
  sessionId: string;
}
export const GetSessionRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botAliasId: S.String.pipe(T.HttpLabel("botAliasId")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetSessionRequest",
}) as any as S.Schema<GetSessionRequest>;
export interface ElicitSubSlot {
  name: string;
  subSlotToElicit?: ElicitSubSlot;
}
export const ElicitSubSlot = S.suspend(() =>
  S.Struct({
    name: S.String,
    subSlotToElicit: S.optional(
      S.suspend((): S.Schema<ElicitSubSlot, any> => ElicitSubSlot).annotations({
        identifier: "ElicitSubSlot",
      }),
    ),
  }),
).annotations({
  identifier: "ElicitSubSlot",
}) as any as S.Schema<ElicitSubSlot>;
export interface DialogAction {
  type: string;
  slotToElicit?: string;
  slotElicitationStyle?: string;
  subSlotToElicit?: ElicitSubSlot;
}
export const DialogAction = S.suspend(() =>
  S.Struct({
    type: S.String,
    slotToElicit: S.optional(S.String),
    slotElicitationStyle: S.optional(S.String),
    subSlotToElicit: S.optional(ElicitSubSlot),
  }),
).annotations({ identifier: "DialogAction" }) as any as S.Schema<DialogAction>;
export type Slots = { [key: string]: Slot };
export const Slots = S.Record({
  key: S.String,
  value: S.suspend((): S.Schema<Slot, any> => Slot).annotations({
    identifier: "Slot",
  }),
}) as any as S.Schema<Slots>;
export interface Intent {
  name: string;
  slots?: Slots;
  state?: string;
  confirmationState?: string;
}
export const Intent = S.suspend(() =>
  S.Struct({
    name: S.String,
    slots: S.optional(Slots),
    state: S.optional(S.String),
    confirmationState: S.optional(S.String),
  }),
).annotations({ identifier: "Intent" }) as any as S.Schema<Intent>;
export interface ActiveContextTimeToLive {
  timeToLiveInSeconds: number;
  turnsToLive: number;
}
export const ActiveContextTimeToLive = S.suspend(() =>
  S.Struct({ timeToLiveInSeconds: S.Number, turnsToLive: S.Number }),
).annotations({
  identifier: "ActiveContextTimeToLive",
}) as any as S.Schema<ActiveContextTimeToLive>;
export type ActiveContextParametersMap = {
  [key: string]: string | Redacted.Redacted<string>;
};
export const ActiveContextParametersMap = S.Record({
  key: S.String,
  value: SensitiveString,
});
export interface ActiveContext {
  name: string;
  timeToLive: ActiveContextTimeToLive;
  contextAttributes: ActiveContextParametersMap;
}
export const ActiveContext = S.suspend(() =>
  S.Struct({
    name: S.String,
    timeToLive: ActiveContextTimeToLive,
    contextAttributes: ActiveContextParametersMap,
  }),
).annotations({
  identifier: "ActiveContext",
}) as any as S.Schema<ActiveContext>;
export type ActiveContextsList = ActiveContext[];
export const ActiveContextsList = S.Array(ActiveContext);
export type StringMap = { [key: string]: string };
export const StringMap = S.Record({ key: S.String, value: S.String });
export type SlotHintsSlotMap = { [key: string]: RuntimeHintDetails };
export const SlotHintsSlotMap = S.Record({
  key: S.String,
  value: S.suspend(
    (): S.Schema<RuntimeHintDetails, any> => RuntimeHintDetails,
  ).annotations({ identifier: "RuntimeHintDetails" }),
}) as any as S.Schema<SlotHintsSlotMap>;
export type SlotHintsIntentMap = { [key: string]: SlotHintsSlotMap };
export const SlotHintsIntentMap = S.Record({
  key: S.String,
  value: S.suspend(() => SlotHintsSlotMap).annotations({
    identifier: "SlotHintsSlotMap",
  }),
});
export interface RuntimeHints {
  slotHints?: SlotHintsIntentMap;
}
export const RuntimeHints = S.suspend(() =>
  S.Struct({ slotHints: S.optional(SlotHintsIntentMap) }),
).annotations({ identifier: "RuntimeHints" }) as any as S.Schema<RuntimeHints>;
export interface SessionState {
  dialogAction?: DialogAction;
  intent?: Intent;
  activeContexts?: ActiveContextsList;
  sessionAttributes?: StringMap;
  originatingRequestId?: string;
  runtimeHints?: RuntimeHints;
}
export const SessionState = S.suspend(() =>
  S.Struct({
    dialogAction: S.optional(DialogAction),
    intent: S.optional(Intent),
    activeContexts: S.optional(ActiveContextsList),
    sessionAttributes: S.optional(StringMap),
    originatingRequestId: S.optional(S.String),
    runtimeHints: S.optional(RuntimeHints),
  }),
).annotations({ identifier: "SessionState" }) as any as S.Schema<SessionState>;
export interface RecognizeTextRequest {
  botId: string;
  botAliasId: string;
  localeId: string;
  sessionId: string;
  text: string | Redacted.Redacted<string>;
  sessionState?: SessionState;
  requestAttributes?: StringMap;
}
export const RecognizeTextRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botAliasId: S.String.pipe(T.HttpLabel("botAliasId")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    text: SensitiveString,
    sessionState: S.optional(SessionState),
    requestAttributes: S.optional(StringMap),
  }).pipe(
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
  ),
).annotations({
  identifier: "RecognizeTextRequest",
}) as any as S.Schema<RecognizeTextRequest>;
export interface RecognizeUtteranceRequest {
  botId: string;
  botAliasId: string;
  localeId: string;
  sessionId: string;
  sessionState?: string | Redacted.Redacted<string>;
  requestAttributes?: string | Redacted.Redacted<string>;
  requestContentType: string;
  responseContentType?: string;
  inputStream?: T.StreamingInputBody;
}
export const RecognizeUtteranceRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botAliasId: S.String.pipe(T.HttpLabel("botAliasId")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    sessionState: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-lex-session-state"),
    ),
    requestAttributes: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-lex-request-attributes"),
    ),
    requestContentType: S.String.pipe(T.HttpHeader("Content-Type")),
    responseContentType: S.optional(S.String).pipe(
      T.HttpHeader("Response-Content-Type"),
    ),
    inputStream: S.optional(T.StreamingInput).pipe(T.HttpPayload()),
  }).pipe(
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
  ),
).annotations({
  identifier: "RecognizeUtteranceRequest",
}) as any as S.Schema<RecognizeUtteranceRequest>;
export interface DeleteSessionResponse {
  botId?: string;
  botAliasId?: string;
  localeId?: string;
  sessionId?: string;
}
export const DeleteSessionResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botAliasId: S.optional(S.String),
    localeId: S.optional(S.String),
    sessionId: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteSessionResponse",
}) as any as S.Schema<DeleteSessionResponse>;
export interface RecognizeUtteranceResponse {
  inputMode?: string;
  contentType?: string;
  messages?: string;
  interpretations?: string;
  sessionState?: string;
  requestAttributes?: string;
  sessionId?: string;
  inputTranscript?: string;
  audioStream?: T.StreamingOutputBody;
  recognizedBotMember?: string;
}
export const RecognizeUtteranceResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "RecognizeUtteranceResponse",
}) as any as S.Schema<RecognizeUtteranceResponse>;
export interface Button {
  text: string;
  value: string;
}
export const Button = S.suspend(() =>
  S.Struct({ text: S.String, value: S.String }),
).annotations({ identifier: "Button" }) as any as S.Schema<Button>;
export type ButtonsList = Button[];
export const ButtonsList = S.Array(Button);
export interface ImageResponseCard {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  buttons?: ButtonsList;
}
export const ImageResponseCard = S.suspend(() =>
  S.Struct({
    title: S.String,
    subtitle: S.optional(S.String),
    imageUrl: S.optional(S.String),
    buttons: S.optional(ButtonsList),
  }),
).annotations({
  identifier: "ImageResponseCard",
}) as any as S.Schema<ImageResponseCard>;
export interface Message {
  content?: string | Redacted.Redacted<string>;
  contentType: string;
  imageResponseCard?: ImageResponseCard;
}
export const Message = S.suspend(() =>
  S.Struct({
    content: S.optional(SensitiveString),
    contentType: S.String,
    imageResponseCard: S.optional(ImageResponseCard),
  }),
).annotations({ identifier: "Message" }) as any as S.Schema<Message>;
export type Messages = Message[];
export const Messages = S.Array(Message);
export interface ConfigurationEvent {
  requestAttributes?: StringMap;
  responseContentType: string;
  sessionState?: SessionState;
  welcomeMessages?: Messages;
  disablePlayback?: boolean;
  eventId?: string;
  clientTimestampMillis?: number;
}
export const ConfigurationEvent = S.suspend(() =>
  S.Struct({
    requestAttributes: S.optional(StringMap),
    responseContentType: S.String,
    sessionState: S.optional(SessionState),
    welcomeMessages: S.optional(Messages),
    disablePlayback: S.optional(S.Boolean),
    eventId: S.optional(S.String),
    clientTimestampMillis: S.optional(S.Number),
  }),
).annotations({
  identifier: "ConfigurationEvent",
}) as any as S.Schema<ConfigurationEvent>;
export interface AudioInputEvent {
  audioChunk?: Uint8Array;
  contentType: string;
  eventId?: string;
  clientTimestampMillis?: number;
}
export const AudioInputEvent = S.suspend(() =>
  S.Struct({
    audioChunk: S.optional(T.Blob),
    contentType: S.String,
    eventId: S.optional(S.String),
    clientTimestampMillis: S.optional(S.Number),
  }),
).annotations({
  identifier: "AudioInputEvent",
}) as any as S.Schema<AudioInputEvent>;
export interface DTMFInputEvent {
  inputCharacter: string | Redacted.Redacted<string>;
  eventId?: string;
  clientTimestampMillis?: number;
}
export const DTMFInputEvent = S.suspend(() =>
  S.Struct({
    inputCharacter: SensitiveString,
    eventId: S.optional(S.String),
    clientTimestampMillis: S.optional(S.Number),
  }),
).annotations({
  identifier: "DTMFInputEvent",
}) as any as S.Schema<DTMFInputEvent>;
export interface TextInputEvent {
  text: string | Redacted.Redacted<string>;
  eventId?: string;
  clientTimestampMillis?: number;
}
export const TextInputEvent = S.suspend(() =>
  S.Struct({
    text: SensitiveString,
    eventId: S.optional(S.String),
    clientTimestampMillis: S.optional(S.Number),
  }),
).annotations({
  identifier: "TextInputEvent",
}) as any as S.Schema<TextInputEvent>;
export interface PlaybackCompletionEvent {
  eventId?: string;
  clientTimestampMillis?: number;
}
export const PlaybackCompletionEvent = S.suspend(() =>
  S.Struct({
    eventId: S.optional(S.String),
    clientTimestampMillis: S.optional(S.Number),
  }),
).annotations({
  identifier: "PlaybackCompletionEvent",
}) as any as S.Schema<PlaybackCompletionEvent>;
export interface DisconnectionEvent {
  eventId?: string;
  clientTimestampMillis?: number;
}
export const DisconnectionEvent = S.suspend(() =>
  S.Struct({
    eventId: S.optional(S.String),
    clientTimestampMillis: S.optional(S.Number),
  }),
).annotations({
  identifier: "DisconnectionEvent",
}) as any as S.Schema<DisconnectionEvent>;
export interface RecognizedBotMember {
  botId: string;
  botName?: string;
}
export const RecognizedBotMember = S.suspend(() =>
  S.Struct({ botId: S.String, botName: S.optional(S.String) }),
).annotations({
  identifier: "RecognizedBotMember",
}) as any as S.Schema<RecognizedBotMember>;
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
  S.suspend((): S.Schema<Slot, any> => Slot).annotations({
    identifier: "Slot",
  }),
) as any as S.Schema<Values>;
export interface ConfidenceScore {
  score?: number;
}
export const ConfidenceScore = S.suspend(() =>
  S.Struct({ score: S.optional(S.Number) }),
).annotations({
  identifier: "ConfidenceScore",
}) as any as S.Schema<ConfidenceScore>;
export interface SentimentScore {
  positive?: number;
  negative?: number;
  neutral?: number;
  mixed?: number;
}
export const SentimentScore = S.suspend(() =>
  S.Struct({
    positive: S.optional(S.Number),
    negative: S.optional(S.Number),
    neutral: S.optional(S.Number),
    mixed: S.optional(S.Number),
  }),
).annotations({
  identifier: "SentimentScore",
}) as any as S.Schema<SentimentScore>;
export interface SentimentResponse {
  sentiment?: string;
  sentimentScore?: SentimentScore;
}
export const SentimentResponse = S.suspend(() =>
  S.Struct({
    sentiment: S.optional(S.String),
    sentimentScore: S.optional(SentimentScore),
  }),
).annotations({
  identifier: "SentimentResponse",
}) as any as S.Schema<SentimentResponse>;
export interface Interpretation {
  nluConfidence?: ConfidenceScore;
  sentimentResponse?: SentimentResponse;
  intent?: Intent;
  interpretationSource?: string;
}
export const Interpretation = S.suspend(() =>
  S.Struct({
    nluConfidence: S.optional(ConfidenceScore),
    sentimentResponse: S.optional(SentimentResponse),
    intent: S.optional(Intent),
    interpretationSource: S.optional(S.String),
  }),
).annotations({
  identifier: "Interpretation",
}) as any as S.Schema<Interpretation>;
export type Interpretations = Interpretation[];
export const Interpretations = S.Array(Interpretation);
export interface RecognizeTextResponse {
  messages?: Messages;
  sessionState?: SessionState;
  interpretations?: Interpretations;
  requestAttributes?: StringMap;
  sessionId?: string;
  recognizedBotMember?: RecognizedBotMember;
}
export const RecognizeTextResponse = S.suspend(() =>
  S.Struct({
    messages: S.optional(Messages),
    sessionState: S.optional(SessionState),
    interpretations: S.optional(Interpretations),
    requestAttributes: S.optional(StringMap),
    sessionId: S.optional(S.String),
    recognizedBotMember: S.optional(RecognizedBotMember),
  }),
).annotations({
  identifier: "RecognizeTextResponse",
}) as any as S.Schema<RecognizeTextResponse>;
export interface StartConversationRequest {
  botId: string;
  botAliasId: string;
  localeId: string;
  sessionId: string;
  conversationMode?: string;
  requestEventStream: (typeof StartConversationRequestEventStream)["Type"];
}
export const StartConversationRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botAliasId: S.String.pipe(T.HttpLabel("botAliasId")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    conversationMode: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-lex-conversation-mode"),
    ),
    requestEventStream: StartConversationRequestEventStream.pipe(
      T.HttpPayload(),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "StartConversationRequest",
}) as any as S.Schema<StartConversationRequest>;
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface Value {
  originalValue?: string;
  interpretedValue: string;
  resolvedValues?: StringList;
}
export const Value = S.suspend(() =>
  S.Struct({
    originalValue: S.optional(S.String),
    interpretedValue: S.String,
    resolvedValues: S.optional(StringList),
  }),
).annotations({ identifier: "Value" }) as any as S.Schema<Value>;
export interface Slot {
  value?: Value;
  shape?: string;
  values?: Values;
  subSlots?: Slots;
}
export const Slot = S.suspend(() =>
  S.Struct({
    value: S.optional(Value),
    shape: S.optional(S.String),
    values: S.optional(
      S.suspend(() => Values).annotations({ identifier: "Values" }),
    ),
    subSlots: S.optional(
      S.suspend(() => Slots).annotations({ identifier: "Slots" }),
    ),
  }),
).annotations({ identifier: "Slot" }) as any as S.Schema<Slot>;
export interface RuntimeHintValue {
  phrase: string;
}
export const RuntimeHintValue = S.suspend(() =>
  S.Struct({ phrase: S.String }),
).annotations({
  identifier: "RuntimeHintValue",
}) as any as S.Schema<RuntimeHintValue>;
export type RuntimeHintValuesList = RuntimeHintValue[];
export const RuntimeHintValuesList = S.Array(RuntimeHintValue);
export interface GetSessionResponse {
  sessionId?: string;
  messages?: Messages;
  interpretations?: Interpretations;
  sessionState?: SessionState;
}
export const GetSessionResponse = S.suspend(() =>
  S.Struct({
    sessionId: S.optional(S.String),
    messages: S.optional(Messages),
    interpretations: S.optional(Interpretations),
    sessionState: S.optional(SessionState),
  }),
).annotations({
  identifier: "GetSessionResponse",
}) as any as S.Schema<GetSessionResponse>;
export interface RuntimeHintDetails {
  runtimeHintValues?: RuntimeHintValuesList;
  subSlotHints?: SlotHintsSlotMap;
}
export const RuntimeHintDetails = S.suspend(() =>
  S.Struct({
    runtimeHintValues: S.optional(RuntimeHintValuesList),
    subSlotHints: S.optional(
      S.suspend(() => SlotHintsSlotMap).annotations({
        identifier: "SlotHintsSlotMap",
      }),
    ),
  }),
).annotations({
  identifier: "RuntimeHintDetails",
}) as any as S.Schema<RuntimeHintDetails>;
export interface PlaybackInterruptionEvent {
  eventReason?: string;
  causedByEventId?: string;
  eventId?: string;
}
export const PlaybackInterruptionEvent = S.suspend(() =>
  S.Struct({
    eventReason: S.optional(S.String),
    causedByEventId: S.optional(S.String),
    eventId: S.optional(S.String),
  }),
).annotations({
  identifier: "PlaybackInterruptionEvent",
}) as any as S.Schema<PlaybackInterruptionEvent>;
export interface TranscriptEvent {
  transcript?: string;
  eventId?: string;
}
export const TranscriptEvent = S.suspend(() =>
  S.Struct({ transcript: S.optional(S.String), eventId: S.optional(S.String) }),
).annotations({
  identifier: "TranscriptEvent",
}) as any as S.Schema<TranscriptEvent>;
export interface IntentResultEvent {
  inputMode?: string;
  interpretations?: Interpretations;
  sessionState?: SessionState;
  requestAttributes?: StringMap;
  sessionId?: string;
  eventId?: string;
  recognizedBotMember?: RecognizedBotMember;
}
export const IntentResultEvent = S.suspend(() =>
  S.Struct({
    inputMode: S.optional(S.String),
    interpretations: S.optional(Interpretations),
    sessionState: S.optional(SessionState),
    requestAttributes: S.optional(StringMap),
    sessionId: S.optional(S.String),
    eventId: S.optional(S.String),
    recognizedBotMember: S.optional(RecognizedBotMember),
  }),
).annotations({
  identifier: "IntentResultEvent",
}) as any as S.Schema<IntentResultEvent>;
export interface TextResponseEvent {
  messages?: Messages;
  eventId?: string;
}
export const TextResponseEvent = S.suspend(() =>
  S.Struct({ messages: S.optional(Messages), eventId: S.optional(S.String) }),
).annotations({
  identifier: "TextResponseEvent",
}) as any as S.Schema<TextResponseEvent>;
export interface AudioResponseEvent {
  audioChunk?: Uint8Array;
  contentType?: string;
  eventId?: string;
}
export const AudioResponseEvent = S.suspend(() =>
  S.Struct({
    audioChunk: S.optional(T.Blob),
    contentType: S.optional(S.String),
    eventId: S.optional(S.String),
  }),
).annotations({
  identifier: "AudioResponseEvent",
}) as any as S.Schema<AudioResponseEvent>;
export interface HeartbeatEvent {
  eventId?: string;
}
export const HeartbeatEvent = S.suspend(() =>
  S.Struct({ eventId: S.optional(S.String) }),
).annotations({
  identifier: "HeartbeatEvent",
}) as any as S.Schema<HeartbeatEvent>;
export const StartConversationResponseEventStream = T.EventStream(
  S.Union(
    S.Struct({ PlaybackInterruptionEvent: PlaybackInterruptionEvent }),
    S.Struct({ TranscriptEvent: TranscriptEvent }),
    S.Struct({ IntentResultEvent: IntentResultEvent }),
    S.Struct({ TextResponseEvent: TextResponseEvent }),
    S.Struct({ AudioResponseEvent: AudioResponseEvent }),
    S.Struct({ HeartbeatEvent: HeartbeatEvent }),
    S.Struct({
      AccessDeniedException: S.suspend(() => AccessDeniedException).annotations(
        { identifier: "AccessDeniedException" },
      ),
    }),
    S.Struct({
      ResourceNotFoundException: S.suspend(
        () => ResourceNotFoundException,
      ).annotations({ identifier: "ResourceNotFoundException" }),
    }),
    S.Struct({
      ValidationException: S.suspend(() => ValidationException).annotations({
        identifier: "ValidationException",
      }),
    }),
    S.Struct({
      ThrottlingException: S.suspend(() => ThrottlingException).annotations({
        identifier: "ThrottlingException",
      }),
    }),
    S.Struct({
      InternalServerException: S.suspend(
        () => InternalServerException,
      ).annotations({ identifier: "InternalServerException" }),
    }),
    S.Struct({
      ConflictException: S.suspend(() => ConflictException).annotations({
        identifier: "ConflictException",
      }),
    }),
    S.Struct({
      DependencyFailedException: S.suspend(
        () => DependencyFailedException,
      ).annotations({ identifier: "DependencyFailedException" }),
    }),
    S.Struct({
      BadGatewayException: S.suspend(() => BadGatewayException).annotations({
        identifier: "BadGatewayException",
      }),
    }),
  ),
);
export interface StartConversationResponse {
  responseEventStream?: (typeof StartConversationResponseEventStream)["Type"];
}
export const StartConversationResponse = S.suspend(() =>
  S.Struct({
    responseEventStream: S.optional(StartConversationResponseEventStream).pipe(
      T.HttpPayload(),
    ),
  }),
).annotations({
  identifier: "StartConversationResponse",
}) as any as S.Schema<StartConversationResponse>;
export interface PutSessionRequest {
  botId: string;
  botAliasId: string;
  localeId: string;
  sessionId: string;
  messages?: Messages;
  sessionState: SessionState;
  requestAttributes?: StringMap;
  responseContentType?: string;
}
export const PutSessionRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botAliasId: S.String.pipe(T.HttpLabel("botAliasId")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    messages: S.optional(Messages),
    sessionState: SessionState,
    requestAttributes: S.optional(StringMap),
    responseContentType: S.optional(S.String).pipe(
      T.HttpHeader("ResponseContentType"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "PutSessionRequest",
}) as any as S.Schema<PutSessionRequest>;
export interface PutSessionResponse {
  contentType?: string;
  messages?: string;
  sessionState?: string;
  requestAttributes?: string;
  sessionId?: string;
  audioStream?: T.StreamingOutputBody;
}
export const PutSessionResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "PutSessionResponse",
}) as any as S.Schema<PutSessionResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
).pipe(C.withConflictError) {}
export class BadGatewayException extends S.TaggedError<BadGatewayException>()(
  "BadGatewayException",
  { message: S.String },
).pipe(C.withServerError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
).pipe(C.withServerError) {}
export class DependencyFailedException extends S.TaggedError<DependencyFailedException>()(
  "DependencyFailedException",
  { message: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
).pipe(C.withBadRequestError) {}

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
export const deleteSession: (
  input: DeleteSessionRequest,
) => Effect.Effect<
  DeleteSessionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSession: (
  input: GetSessionRequest,
) => Effect.Effect<
  GetSessionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const recognizeText: (
  input: RecognizeTextRequest,
) => Effect.Effect<
  RecognizeTextResponse,
  | AccessDeniedException
  | BadGatewayException
  | ConflictException
  | DependencyFailedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const recognizeUtterance: (
  input: RecognizeUtteranceRequest,
) => Effect.Effect<
  RecognizeUtteranceResponse,
  | AccessDeniedException
  | BadGatewayException
  | ConflictException
  | DependencyFailedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startConversation: (
  input: StartConversationRequest,
) => Effect.Effect<
  StartConversationResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putSession: (
  input: PutSessionRequest,
) => Effect.Effect<
  PutSessionResponse,
  | AccessDeniedException
  | BadGatewayException
  | ConflictException
  | DependencyFailedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
