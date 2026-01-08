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
  sdkId: "Lex Runtime Service",
  serviceShapeName: "AWSDeepSenseRunTimeService",
});
const auth = T.AwsAuthSigv4({ name: "lex" });
const ver = T.ServiceVersion("2016-11-28");
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
              `https://runtime.lex-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws") {
              return e(`https://runtime-fips.lex.${Region}.amazonaws.com`);
            }
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://runtime-fips.lex.${Region}.amazonaws.com`);
            }
            return e(
              `https://runtime.lex-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://runtime.lex.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        if ("aws" === _.getAttr(PartitionResult, "name")) {
          return e(`https://runtime.lex.${Region}.amazonaws.com`);
        }
        if ("aws-us-gov" === _.getAttr(PartitionResult, "name")) {
          return e(`https://runtime.lex.${Region}.amazonaws.com`);
        }
        return e(
          `https://runtime.lex.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type BotName = string;
export type BotAlias = string;
export type UserId = string;
export type IntentSummaryCheckpointLabel = string;
export type SynthesizedJsonAttributesString =
  | string
  | Redacted.Redacted<string>;
export type HttpContentType = string;
export type Accept = string;
export type SynthesizedJsonActiveContextsString =
  | string
  | Redacted.Redacted<string>;
export type Text = string | Redacted.Redacted<string>;
export type ActiveContextName = string;
export type IntentName = string;
export type SynthesizedJsonString = string;
export type SensitiveString = string | Redacted.Redacted<string>;
export type SensitiveStringUnbounded = string | Redacted.Redacted<string>;
export type BotVersion = string;
export type ActiveContextTimeToLiveInSeconds = number;
export type ActiveContextTurnsToLive = number;
export type ParameterName = string;
export type ErrorMessage = string;
export type Double = number;
export type SentimentLabel = string;
export type SentimentScore = string;
export type StringWithLength = string;
export type StringUrlWithLength = string;
export type ButtonTextStringWithLength = string;
export type ButtonValueStringWithLength = string;

//# Schemas
export interface DeleteSessionRequest {
  botName: string;
  botAlias: string;
  userId: string;
}
export const DeleteSessionRequest = S.suspend(() =>
  S.Struct({
    botName: S.String.pipe(T.HttpLabel("botName")),
    botAlias: S.String.pipe(T.HttpLabel("botAlias")),
    userId: S.String.pipe(T.HttpLabel("userId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/bot/{botName}/alias/{botAlias}/user/{userId}/session",
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
  botName: string;
  botAlias: string;
  userId: string;
  checkpointLabelFilter?: string;
}
export const GetSessionRequest = S.suspend(() =>
  S.Struct({
    botName: S.String.pipe(T.HttpLabel("botName")),
    botAlias: S.String.pipe(T.HttpLabel("botAlias")),
    userId: S.String.pipe(T.HttpLabel("userId")),
    checkpointLabelFilter: S.optional(S.String).pipe(
      T.HttpQuery("checkpointLabelFilter"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/bot/{botName}/alias/{botAlias}/user/{userId}/session",
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
export interface PostContentRequest {
  botName: string;
  botAlias: string;
  userId: string;
  sessionAttributes?: string | Redacted.Redacted<string>;
  requestAttributes?: string | Redacted.Redacted<string>;
  contentType: string;
  accept?: string;
  inputStream: T.StreamingInputBody;
  activeContexts?: string | Redacted.Redacted<string>;
}
export const PostContentRequest = S.suspend(() =>
  S.Struct({
    botName: S.String.pipe(T.HttpLabel("botName")),
    botAlias: S.String.pipe(T.HttpLabel("botAlias")),
    userId: S.String.pipe(T.HttpLabel("userId")),
    sessionAttributes: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-lex-session-attributes"),
    ),
    requestAttributes: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-lex-request-attributes"),
    ),
    contentType: S.String.pipe(T.HttpHeader("Content-Type")),
    accept: S.optional(S.String).pipe(T.HttpHeader("Accept")),
    inputStream: T.StreamingInput.pipe(T.HttpPayload()),
    activeContexts: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-lex-active-contexts"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/bot/{botName}/alias/{botAlias}/user/{userId}/content",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PostContentRequest",
}) as any as S.Schema<PostContentRequest>;
export type StringMap = { [key: string]: string };
export const StringMap = S.Record({ key: S.String, value: S.String });
export interface DialogAction {
  type: string;
  intentName?: string;
  slots?: StringMap;
  slotToElicit?: string;
  fulfillmentState?: string;
  message?: string | Redacted.Redacted<string>;
  messageFormat?: string;
}
export const DialogAction = S.suspend(() =>
  S.Struct({
    type: S.String,
    intentName: S.optional(S.String),
    slots: S.optional(StringMap),
    slotToElicit: S.optional(S.String),
    fulfillmentState: S.optional(S.String),
    message: S.optional(SensitiveString),
    messageFormat: S.optional(S.String),
  }),
).annotations({ identifier: "DialogAction" }) as any as S.Schema<DialogAction>;
export interface IntentSummary {
  intentName?: string;
  checkpointLabel?: string;
  slots?: StringMap;
  confirmationStatus?: string;
  dialogActionType: string;
  fulfillmentState?: string;
  slotToElicit?: string;
}
export const IntentSummary = S.suspend(() =>
  S.Struct({
    intentName: S.optional(S.String),
    checkpointLabel: S.optional(S.String),
    slots: S.optional(StringMap),
    confirmationStatus: S.optional(S.String),
    dialogActionType: S.String,
    fulfillmentState: S.optional(S.String),
    slotToElicit: S.optional(S.String),
  }),
).annotations({
  identifier: "IntentSummary",
}) as any as S.Schema<IntentSummary>;
export type IntentSummaryList = IntentSummary[];
export const IntentSummaryList = S.Array(IntentSummary);
export interface DeleteSessionResponse {
  botName?: string;
  botAlias?: string;
  userId?: string;
  sessionId?: string;
}
export const DeleteSessionResponse = S.suspend(() =>
  S.Struct({
    botName: S.optional(S.String),
    botAlias: S.optional(S.String),
    userId: S.optional(S.String),
    sessionId: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteSessionResponse",
}) as any as S.Schema<DeleteSessionResponse>;
export interface ActiveContextTimeToLive {
  timeToLiveInSeconds?: number;
  turnsToLive?: number;
}
export const ActiveContextTimeToLive = S.suspend(() =>
  S.Struct({
    timeToLiveInSeconds: S.optional(S.Number),
    turnsToLive: S.optional(S.Number),
  }),
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
  parameters: ActiveContextParametersMap;
}
export const ActiveContext = S.suspend(() =>
  S.Struct({
    name: S.String,
    timeToLive: ActiveContextTimeToLive,
    parameters: ActiveContextParametersMap,
  }),
).annotations({
  identifier: "ActiveContext",
}) as any as S.Schema<ActiveContext>;
export type ActiveContextsList = ActiveContext[];
export const ActiveContextsList = S.Array(ActiveContext);
export interface GetSessionResponse {
  recentIntentSummaryView?: IntentSummaryList;
  sessionAttributes?: StringMap;
  sessionId?: string;
  dialogAction?: DialogAction;
  activeContexts?: ActiveContextsList;
}
export const GetSessionResponse = S.suspend(() =>
  S.Struct({
    recentIntentSummaryView: S.optional(IntentSummaryList),
    sessionAttributes: S.optional(StringMap),
    sessionId: S.optional(S.String),
    dialogAction: S.optional(DialogAction),
    activeContexts: S.optional(ActiveContextsList),
  }),
).annotations({
  identifier: "GetSessionResponse",
}) as any as S.Schema<GetSessionResponse>;
export interface PostContentResponse {
  contentType?: string;
  intentName?: string;
  nluIntentConfidence?: string;
  alternativeIntents?: string;
  slots?: string;
  sessionAttributes?: string;
  sentimentResponse?: string;
  message?: string | Redacted.Redacted<string>;
  encodedMessage?: string | Redacted.Redacted<string>;
  messageFormat?: string;
  dialogState?: string;
  slotToElicit?: string;
  inputTranscript?: string;
  encodedInputTranscript?: string | Redacted.Redacted<string>;
  audioStream?: T.StreamingOutputBody;
  botVersion?: string;
  sessionId?: string;
  activeContexts?: string | Redacted.Redacted<string>;
}
export const PostContentResponse = S.suspend(() =>
  S.Struct({
    contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    intentName: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-lex-intent-name"),
    ),
    nluIntentConfidence: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-lex-nlu-intent-confidence"),
    ),
    alternativeIntents: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-lex-alternative-intents"),
    ),
    slots: S.optional(S.String).pipe(T.HttpHeader("x-amz-lex-slots")),
    sessionAttributes: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-lex-session-attributes"),
    ),
    sentimentResponse: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-lex-sentiment"),
    ),
    message: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-lex-message"),
    ),
    encodedMessage: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-lex-encoded-message"),
    ),
    messageFormat: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-lex-message-format"),
    ),
    dialogState: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-lex-dialog-state"),
    ),
    slotToElicit: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-lex-slot-to-elicit"),
    ),
    inputTranscript: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-lex-input-transcript"),
    ),
    encodedInputTranscript: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-lex-encoded-input-transcript"),
    ),
    audioStream: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
    botVersion: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-lex-bot-version"),
    ),
    sessionId: S.optional(S.String).pipe(T.HttpHeader("x-amz-lex-session-id")),
    activeContexts: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-lex-active-contexts"),
    ),
  }),
).annotations({
  identifier: "PostContentResponse",
}) as any as S.Schema<PostContentResponse>;
export interface PutSessionRequest {
  botName: string;
  botAlias: string;
  userId: string;
  sessionAttributes?: StringMap;
  dialogAction?: DialogAction;
  recentIntentSummaryView?: IntentSummaryList;
  accept?: string;
  activeContexts?: ActiveContextsList;
}
export const PutSessionRequest = S.suspend(() =>
  S.Struct({
    botName: S.String.pipe(T.HttpLabel("botName")),
    botAlias: S.String.pipe(T.HttpLabel("botAlias")),
    userId: S.String.pipe(T.HttpLabel("userId")),
    sessionAttributes: S.optional(StringMap),
    dialogAction: S.optional(DialogAction),
    recentIntentSummaryView: S.optional(IntentSummaryList),
    accept: S.optional(S.String).pipe(T.HttpHeader("Accept")),
    activeContexts: S.optional(ActiveContextsList),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/bot/{botName}/alias/{botAlias}/user/{userId}/session",
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
export interface PostTextRequest {
  botName: string;
  botAlias: string;
  userId: string;
  sessionAttributes?: StringMap;
  requestAttributes?: StringMap;
  inputText: string | Redacted.Redacted<string>;
  activeContexts?: ActiveContextsList;
}
export const PostTextRequest = S.suspend(() =>
  S.Struct({
    botName: S.String.pipe(T.HttpLabel("botName")),
    botAlias: S.String.pipe(T.HttpLabel("botAlias")),
    userId: S.String.pipe(T.HttpLabel("userId")),
    sessionAttributes: S.optional(StringMap),
    requestAttributes: S.optional(StringMap),
    inputText: SensitiveString,
    activeContexts: S.optional(ActiveContextsList),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/bot/{botName}/alias/{botAlias}/user/{userId}/text",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PostTextRequest",
}) as any as S.Schema<PostTextRequest>;
export interface PutSessionResponse {
  contentType?: string;
  intentName?: string;
  slots?: string;
  sessionAttributes?: string;
  message?: string | Redacted.Redacted<string>;
  encodedMessage?: string | Redacted.Redacted<string>;
  messageFormat?: string;
  dialogState?: string;
  slotToElicit?: string;
  audioStream?: T.StreamingOutputBody;
  sessionId?: string;
  activeContexts?: string | Redacted.Redacted<string>;
}
export const PutSessionResponse = S.suspend(() =>
  S.Struct({
    contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    intentName: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-lex-intent-name"),
    ),
    slots: S.optional(S.String).pipe(T.HttpHeader("x-amz-lex-slots")),
    sessionAttributes: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-lex-session-attributes"),
    ),
    message: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-lex-message"),
    ),
    encodedMessage: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-lex-encoded-message"),
    ),
    messageFormat: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-lex-message-format"),
    ),
    dialogState: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-lex-dialog-state"),
    ),
    slotToElicit: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-lex-slot-to-elicit"),
    ),
    audioStream: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
    sessionId: S.optional(S.String).pipe(T.HttpHeader("x-amz-lex-session-id")),
    activeContexts: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-lex-active-contexts"),
    ),
  }),
).annotations({
  identifier: "PutSessionResponse",
}) as any as S.Schema<PutSessionResponse>;
export interface IntentConfidence {
  score?: number;
}
export const IntentConfidence = S.suspend(() =>
  S.Struct({ score: S.optional(S.Number) }),
).annotations({
  identifier: "IntentConfidence",
}) as any as S.Schema<IntentConfidence>;
export interface PredictedIntent {
  intentName?: string;
  nluIntentConfidence?: IntentConfidence;
  slots?: StringMap;
}
export const PredictedIntent = S.suspend(() =>
  S.Struct({
    intentName: S.optional(S.String),
    nluIntentConfidence: S.optional(IntentConfidence),
    slots: S.optional(StringMap),
  }),
).annotations({
  identifier: "PredictedIntent",
}) as any as S.Schema<PredictedIntent>;
export type IntentList = PredictedIntent[];
export const IntentList = S.Array(PredictedIntent);
export interface SentimentResponse {
  sentimentLabel?: string;
  sentimentScore?: string;
}
export const SentimentResponse = S.suspend(() =>
  S.Struct({
    sentimentLabel: S.optional(S.String),
    sentimentScore: S.optional(S.String),
  }),
).annotations({
  identifier: "SentimentResponse",
}) as any as S.Schema<SentimentResponse>;
export interface Button {
  text: string;
  value: string;
}
export const Button = S.suspend(() =>
  S.Struct({ text: S.String, value: S.String }),
).annotations({ identifier: "Button" }) as any as S.Schema<Button>;
export type listOfButtons = Button[];
export const listOfButtons = S.Array(Button);
export interface GenericAttachment {
  title?: string;
  subTitle?: string;
  attachmentLinkUrl?: string;
  imageUrl?: string;
  buttons?: listOfButtons;
}
export const GenericAttachment = S.suspend(() =>
  S.Struct({
    title: S.optional(S.String),
    subTitle: S.optional(S.String),
    attachmentLinkUrl: S.optional(S.String),
    imageUrl: S.optional(S.String),
    buttons: S.optional(listOfButtons),
  }),
).annotations({
  identifier: "GenericAttachment",
}) as any as S.Schema<GenericAttachment>;
export type genericAttachmentList = GenericAttachment[];
export const genericAttachmentList = S.Array(GenericAttachment);
export interface ResponseCard {
  version?: string;
  contentType?: string;
  genericAttachments?: genericAttachmentList;
}
export const ResponseCard = S.suspend(() =>
  S.Struct({
    version: S.optional(S.String),
    contentType: S.optional(S.String),
    genericAttachments: S.optional(genericAttachmentList),
  }),
).annotations({ identifier: "ResponseCard" }) as any as S.Schema<ResponseCard>;
export interface PostTextResponse {
  intentName?: string;
  nluIntentConfidence?: IntentConfidence;
  alternativeIntents?: IntentList;
  slots?: StringMap;
  sessionAttributes?: StringMap;
  message?: string | Redacted.Redacted<string>;
  sentimentResponse?: SentimentResponse;
  messageFormat?: string;
  dialogState?: string;
  slotToElicit?: string;
  responseCard?: ResponseCard;
  sessionId?: string;
  botVersion?: string;
  activeContexts?: ActiveContextsList;
}
export const PostTextResponse = S.suspend(() =>
  S.Struct({
    intentName: S.optional(S.String),
    nluIntentConfidence: S.optional(IntentConfidence),
    alternativeIntents: S.optional(IntentList),
    slots: S.optional(StringMap),
    sessionAttributes: S.optional(StringMap),
    message: S.optional(SensitiveString),
    sentimentResponse: S.optional(SentimentResponse),
    messageFormat: S.optional(S.String),
    dialogState: S.optional(S.String),
    slotToElicit: S.optional(S.String),
    responseCard: S.optional(ResponseCard),
    sessionId: S.optional(S.String),
    botVersion: S.optional(S.String),
    activeContexts: S.optional(ActiveContextsList),
  }),
).annotations({
  identifier: "PostTextResponse",
}) as any as S.Schema<PostTextResponse>;

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class BadGatewayException extends S.TaggedError<BadGatewayException>()(
  "BadGatewayException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {
    retryAfterSeconds: S.optional(S.String).pipe(T.HttpHeader("Retry-After")),
    message: S.optional(S.String),
  },
).pipe(C.withThrottlingError) {}
export class DependencyFailedException extends S.TaggedError<DependencyFailedException>()(
  "DependencyFailedException",
  { Message: S.optional(S.String) },
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class LoopDetectedException extends S.TaggedError<LoopDetectedException>()(
  "LoopDetectedException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class NotAcceptableException extends S.TaggedError<NotAcceptableException>()(
  "NotAcceptableException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class RequestTimeoutException extends S.TaggedError<RequestTimeoutException>()(
  "RequestTimeoutException",
  { message: S.optional(S.String) },
).pipe(C.withTimeoutError) {}
export class UnsupportedMediaTypeException extends S.TaggedError<UnsupportedMediaTypeException>()(
  "UnsupportedMediaTypeException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns session information for a specified bot, alias, and user
 * ID.
 */
export const getSession: (
  input: GetSessionRequest,
) => Effect.Effect<
  GetSessionResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSessionRequest,
  output: GetSessionResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Removes session information for a specified bot, alias, and user ID.
 */
export const deleteSession: (
  input: DeleteSessionRequest,
) => Effect.Effect<
  DeleteSessionResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSessionRequest,
  output: DeleteSessionResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Creates a new session or modifies an existing session with an Amazon Lex
 * bot. Use this operation to enable your application to set the state of the
 * bot.
 *
 * For more information, see Managing
 * Sessions.
 */
export const putSession: (
  input: PutSessionRequest,
) => Effect.Effect<
  PutSessionResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | DependencyFailedException
  | InternalFailureException
  | LimitExceededException
  | NotAcceptableException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutSessionRequest,
  output: PutSessionResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    DependencyFailedException,
    InternalFailureException,
    LimitExceededException,
    NotAcceptableException,
    NotFoundException,
  ],
}));
/**
 * Sends user input to Amazon Lex. Client applications can use this API to
 * send requests to Amazon Lex at runtime. Amazon Lex then interprets the user input
 * using the machine learning model it built for the bot.
 *
 * In response, Amazon Lex returns the next `message` to convey to
 * the user an optional `responseCard` to display. Consider the
 * following example messages:
 *
 * - For a user input "I would like a pizza", Amazon Lex might return a
 * response with a message eliciting slot data (for example, PizzaSize):
 * "What size pizza would you like?"
 *
 * - After the user provides all of the pizza order information,
 * Amazon Lex might return a response with a message to obtain user
 * confirmation "Proceed with the pizza order?".
 *
 * - After the user replies to a confirmation prompt with a "yes",
 * Amazon Lex might return a conclusion statement: "Thank you, your cheese
 * pizza has been ordered.".
 *
 * Not all Amazon Lex messages require a user response. For example, a
 * conclusion statement does not require a response. Some messages require
 * only a "yes" or "no" user response. In addition to the
 * `message`, Amazon Lex provides additional context about the
 * message in the response that you might use to enhance client behavior, for
 * example, to display the appropriate client user interface. These are the
 * `slotToElicit`, `dialogState`,
 * `intentName`, and `slots` fields in the response.
 * Consider the following examples:
 *
 * - If the message is to elicit slot data, Amazon Lex returns the
 * following context information:
 *
 * - `dialogState` set to ElicitSlot
 *
 * - `intentName` set to the intent name in the current
 * context
 *
 * - `slotToElicit` set to the slot name for which the
 * `message` is eliciting information
 *
 * - `slots` set to a map of slots, configured for the
 * intent, with currently known values
 *
 * - If the message is a confirmation prompt, the
 * `dialogState` is set to ConfirmIntent and
 * `SlotToElicit` is set to null.
 *
 * - If the message is a clarification prompt (configured for the
 * intent) that indicates that user intent is not understood, the
 * `dialogState` is set to ElicitIntent and
 * `slotToElicit` is set to null.
 *
 * In addition, Amazon Lex also returns your application-specific
 * `sessionAttributes`. For more information, see Managing
 * Conversation Context.
 */
export const postText: (
  input: PostTextRequest,
) => Effect.Effect<
  PostTextResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | DependencyFailedException
  | InternalFailureException
  | LimitExceededException
  | LoopDetectedException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PostTextRequest,
  output: PostTextResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    DependencyFailedException,
    InternalFailureException,
    LimitExceededException,
    LoopDetectedException,
    NotFoundException,
  ],
}));
/**
 * Sends user input (text or speech) to Amazon Lex. Clients use this API to
 * send text and audio requests to Amazon Lex at runtime. Amazon Lex interprets the
 * user input using the machine learning model that it built for the bot.
 *
 * The `PostContent` operation supports audio input at 8kHz
 * and 16kHz. You can use 8kHz audio to achieve higher speech recognition
 * accuracy in telephone audio applications.
 *
 * In response, Amazon Lex returns the next message to convey to the user.
 * Consider the following example messages:
 *
 * - For a user input "I would like a pizza," Amazon Lex might return a
 * response with a message eliciting slot data (for example,
 * `PizzaSize`): "What size pizza would you like?".
 *
 * - After the user provides all of the pizza order information, Amazon Lex
 * might return a response with a message to get user confirmation:
 * "Order the pizza?".
 *
 * - After the user replies "Yes" to the confirmation prompt, Amazon Lex
 * might return a conclusion statement: "Thank you, your cheese pizza has
 * been ordered.".
 *
 * Not all Amazon Lex messages require a response from the user. For example,
 * conclusion statements do not require a response. Some messages require
 * only a yes or no response. In addition to the `message`, Amazon Lex
 * provides additional context about the message in the response that you can
 * use to enhance client behavior, such as displaying the appropriate client
 * user interface. Consider the following examples:
 *
 * - If the message is to elicit slot data, Amazon Lex returns the
 * following context information:
 *
 * - `x-amz-lex-dialog-state` header set to
 * `ElicitSlot`
 *
 * - `x-amz-lex-intent-name` header set to the intent name
 * in the current context
 *
 * - `x-amz-lex-slot-to-elicit` header set to the slot name
 * for which the `message` is eliciting information
 *
 * - `x-amz-lex-slots` header set to a map of slots
 * configured for the intent with their current values
 *
 * - If the message is a confirmation prompt, the
 * `x-amz-lex-dialog-state` header is set to
 * `Confirmation` and the
 * `x-amz-lex-slot-to-elicit` header is omitted.
 *
 * - If the message is a clarification prompt configured for the
 * intent, indicating that the user intent is not understood, the
 * `x-amz-dialog-state` header is set to
 * `ElicitIntent` and the `x-amz-slot-to-elicit`
 * header is omitted.
 *
 * In addition, Amazon Lex also returns your application-specific
 * `sessionAttributes`. For more information, see Managing
 * Conversation Context.
 */
export const postContent: (
  input: PostContentRequest,
) => Effect.Effect<
  PostContentResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | DependencyFailedException
  | InternalFailureException
  | LimitExceededException
  | LoopDetectedException
  | NotAcceptableException
  | NotFoundException
  | RequestTimeoutException
  | UnsupportedMediaTypeException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PostContentRequest,
  output: PostContentResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    DependencyFailedException,
    InternalFailureException,
    LimitExceededException,
    LoopDetectedException,
    NotAcceptableException,
    NotFoundException,
    RequestTimeoutException,
    UnsupportedMediaTypeException,
  ],
}));
