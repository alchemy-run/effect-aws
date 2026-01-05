import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Lex Runtime Service",
  serviceShapeName: "AWSDeepSenseRunTimeService",
});
const auth = T.AwsAuthSigv4({ name: "lex" });
const ver = T.ServiceVersion("2016-11-28");
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
                        url: "https://runtime.lex-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://runtime-fips.lex.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws-us-gov",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://runtime-fips.lex.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://runtime.lex-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://runtime.lex.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
              conditions: [
                {
                  fn: "stringEquals",
                  argv: [
                    "aws",
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                  ],
                },
              ],
              endpoint: {
                url: "https://runtime.lex.{Region}.amazonaws.com",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [
                {
                  fn: "stringEquals",
                  argv: [
                    "aws-us-gov",
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                  ],
                },
              ],
              endpoint: {
                url: "https://runtime.lex.{Region}.amazonaws.com",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://runtime.lex.{Region}.{PartitionResult#dnsSuffix}",
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
    botName: S.String.pipe(T.HttpLabel("botName")),
    botAlias: S.String.pipe(T.HttpLabel("botAlias")),
    userId: S.String.pipe(T.HttpLabel("userId")),
  },
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
) {}
export class GetSessionRequest extends S.Class<GetSessionRequest>(
  "GetSessionRequest",
)(
  {
    botName: S.String.pipe(T.HttpLabel("botName")),
    botAlias: S.String.pipe(T.HttpLabel("botAlias")),
    userId: S.String.pipe(T.HttpLabel("userId")),
    checkpointLabelFilter: S.optional(S.String).pipe(
      T.HttpQuery("checkpointLabelFilter"),
    ),
  },
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
) {}
export class PostContentRequest extends S.Class<PostContentRequest>(
  "PostContentRequest",
)(
  {
    botName: S.String.pipe(T.HttpLabel("botName")),
    botAlias: S.String.pipe(T.HttpLabel("botAlias")),
    userId: S.String.pipe(T.HttpLabel("userId")),
    sessionAttributes: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-lex-session-attributes"),
    ),
    requestAttributes: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-lex-request-attributes"),
    ),
    contentType: S.String.pipe(T.HttpHeader("Content-Type")),
    accept: S.optional(S.String).pipe(T.HttpHeader("Accept")),
    inputStream: T.StreamingInput.pipe(T.HttpPayload()),
    activeContexts: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-lex-active-contexts"),
    ),
  },
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
) {}
export const StringMap = S.Record({ key: S.String, value: S.String });
export class DialogAction extends S.Class<DialogAction>("DialogAction")({
  type: S.String,
  intentName: S.optional(S.String),
  slots: S.optional(StringMap),
  slotToElicit: S.optional(S.String),
  fulfillmentState: S.optional(S.String),
  message: S.optional(S.String),
  messageFormat: S.optional(S.String),
}) {}
export class IntentSummary extends S.Class<IntentSummary>("IntentSummary")({
  intentName: S.optional(S.String),
  checkpointLabel: S.optional(S.String),
  slots: S.optional(StringMap),
  confirmationStatus: S.optional(S.String),
  dialogActionType: S.String,
  fulfillmentState: S.optional(S.String),
  slotToElicit: S.optional(S.String),
}) {}
export const IntentSummaryList = S.Array(IntentSummary);
export class DeleteSessionResponse extends S.Class<DeleteSessionResponse>(
  "DeleteSessionResponse",
)({
  botName: S.optional(S.String),
  botAlias: S.optional(S.String),
  userId: S.optional(S.String),
  sessionId: S.optional(S.String),
}) {}
export class ActiveContextTimeToLive extends S.Class<ActiveContextTimeToLive>(
  "ActiveContextTimeToLive",
)({
  timeToLiveInSeconds: S.optional(S.Number),
  turnsToLive: S.optional(S.Number),
}) {}
export const ActiveContextParametersMap = S.Record({
  key: S.String,
  value: S.String,
});
export class ActiveContext extends S.Class<ActiveContext>("ActiveContext")({
  name: S.String,
  timeToLive: ActiveContextTimeToLive,
  parameters: ActiveContextParametersMap,
}) {}
export const ActiveContextsList = S.Array(ActiveContext);
export class GetSessionResponse extends S.Class<GetSessionResponse>(
  "GetSessionResponse",
)({
  recentIntentSummaryView: S.optional(IntentSummaryList),
  sessionAttributes: S.optional(StringMap),
  sessionId: S.optional(S.String),
  dialogAction: S.optional(DialogAction),
  activeContexts: S.optional(ActiveContextsList),
}) {}
export class PostContentResponse extends S.Class<PostContentResponse>(
  "PostContentResponse",
)({
  contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  intentName: S.optional(S.String).pipe(T.HttpHeader("x-amz-lex-intent-name")),
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
  message: S.optional(S.String).pipe(T.HttpHeader("x-amz-lex-message")),
  encodedMessage: S.optional(S.String).pipe(
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
  encodedInputTranscript: S.optional(S.String).pipe(
    T.HttpHeader("x-amz-lex-encoded-input-transcript"),
  ),
  audioStream: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
  botVersion: S.optional(S.String).pipe(T.HttpHeader("x-amz-lex-bot-version")),
  sessionId: S.optional(S.String).pipe(T.HttpHeader("x-amz-lex-session-id")),
  activeContexts: S.optional(S.String).pipe(
    T.HttpHeader("x-amz-lex-active-contexts"),
  ),
}) {}
export class PutSessionRequest extends S.Class<PutSessionRequest>(
  "PutSessionRequest",
)(
  {
    botName: S.String.pipe(T.HttpLabel("botName")),
    botAlias: S.String.pipe(T.HttpLabel("botAlias")),
    userId: S.String.pipe(T.HttpLabel("userId")),
    sessionAttributes: S.optional(StringMap),
    dialogAction: S.optional(DialogAction),
    recentIntentSummaryView: S.optional(IntentSummaryList),
    accept: S.optional(S.String).pipe(T.HttpHeader("Accept")),
    activeContexts: S.optional(ActiveContextsList),
  },
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
) {}
export class PostTextRequest extends S.Class<PostTextRequest>(
  "PostTextRequest",
)(
  {
    botName: S.String.pipe(T.HttpLabel("botName")),
    botAlias: S.String.pipe(T.HttpLabel("botAlias")),
    userId: S.String.pipe(T.HttpLabel("userId")),
    sessionAttributes: S.optional(StringMap),
    requestAttributes: S.optional(StringMap),
    inputText: S.String,
    activeContexts: S.optional(ActiveContextsList),
  },
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
) {}
export class PutSessionResponse extends S.Class<PutSessionResponse>(
  "PutSessionResponse",
)({
  contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  intentName: S.optional(S.String).pipe(T.HttpHeader("x-amz-lex-intent-name")),
  slots: S.optional(S.String).pipe(T.HttpHeader("x-amz-lex-slots")),
  sessionAttributes: S.optional(S.String).pipe(
    T.HttpHeader("x-amz-lex-session-attributes"),
  ),
  message: S.optional(S.String).pipe(T.HttpHeader("x-amz-lex-message")),
  encodedMessage: S.optional(S.String).pipe(
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
  activeContexts: S.optional(S.String).pipe(
    T.HttpHeader("x-amz-lex-active-contexts"),
  ),
}) {}
export class IntentConfidence extends S.Class<IntentConfidence>(
  "IntentConfidence",
)({ score: S.optional(S.Number) }) {}
export class PredictedIntent extends S.Class<PredictedIntent>(
  "PredictedIntent",
)({
  intentName: S.optional(S.String),
  nluIntentConfidence: S.optional(IntentConfidence),
  slots: S.optional(StringMap),
}) {}
export const IntentList = S.Array(PredictedIntent);
export class SentimentResponse extends S.Class<SentimentResponse>(
  "SentimentResponse",
)({
  sentimentLabel: S.optional(S.String),
  sentimentScore: S.optional(S.String),
}) {}
export class Button extends S.Class<Button>("Button")({
  text: S.String,
  value: S.String,
}) {}
export const listOfButtons = S.Array(Button);
export class GenericAttachment extends S.Class<GenericAttachment>(
  "GenericAttachment",
)({
  title: S.optional(S.String),
  subTitle: S.optional(S.String),
  attachmentLinkUrl: S.optional(S.String),
  imageUrl: S.optional(S.String),
  buttons: S.optional(listOfButtons),
}) {}
export const genericAttachmentList = S.Array(GenericAttachment);
export class ResponseCard extends S.Class<ResponseCard>("ResponseCard")({
  version: S.optional(S.String),
  contentType: S.optional(S.String),
  genericAttachments: S.optional(genericAttachmentList),
}) {}
export class PostTextResponse extends S.Class<PostTextResponse>(
  "PostTextResponse",
)({
  intentName: S.optional(S.String),
  nluIntentConfidence: S.optional(IntentConfidence),
  alternativeIntents: S.optional(IntentList),
  slots: S.optional(StringMap),
  sessionAttributes: S.optional(StringMap),
  message: S.optional(S.String),
  sentimentResponse: S.optional(SentimentResponse),
  messageFormat: S.optional(S.String),
  dialogState: S.optional(S.String),
  slotToElicit: S.optional(S.String),
  responseCard: S.optional(ResponseCard),
  sessionId: S.optional(S.String),
  botVersion: S.optional(S.String),
  activeContexts: S.optional(ActiveContextsList),
}) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { message: S.optional(S.String) },
) {}
export class BadGatewayException extends S.TaggedError<BadGatewayException>()(
  "BadGatewayException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {
    retryAfterSeconds: S.optional(S.String).pipe(T.HttpHeader("Retry-After")),
    message: S.optional(S.String),
  },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class DependencyFailedException extends S.TaggedError<DependencyFailedException>()(
  "DependencyFailedException",
  { Message: S.optional(S.String) },
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String) },
) {}
export class LoopDetectedException extends S.TaggedError<LoopDetectedException>()(
  "LoopDetectedException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class NotAcceptableException extends S.TaggedError<NotAcceptableException>()(
  "NotAcceptableException",
  { message: S.optional(S.String) },
) {}
export class RequestTimeoutException extends S.TaggedError<RequestTimeoutException>()(
  "RequestTimeoutException",
  { message: S.optional(S.String) },
) {}
export class UnsupportedMediaTypeException extends S.TaggedError<UnsupportedMediaTypeException>()(
  "UnsupportedMediaTypeException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns session information for a specified bot, alias, and user
 * ID.
 */
export const getSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const postText = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const postContent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
