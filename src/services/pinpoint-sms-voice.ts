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
  sdkId: "Pinpoint SMS Voice",
  serviceShapeName: "PinpointSMSVoice",
});
const auth = T.AwsAuthSigv4({ name: "sms-voice" });
const ver = T.ServiceVersion("2018-09-05");
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
          conditions: [],
          rules: [
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
              endpoint: {
                url: { ref: "Endpoint" },
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
      rules: [
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                                "supportsFIPS",
                              ],
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://sms-voice.pinpoint-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://sms-voice.pinpoint-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://sms-voice.pinpoint.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://sms-voice.pinpoint.{Region}.{PartitionResult#dnsSuffix}",
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
          ],
          type: "tree",
        },
        {
          conditions: [],
          error: "Invalid Configuration: Missing Region",
          type: "error",
        },
      ],
      type: "tree",
    },
  ],
});

//# Newtypes
export type WordCharactersWithDelimiters = string;
export type __string = string;
export type NonEmptyString = string;
export type NextTokenString = string;

//# Schemas
export interface CreateConfigurationSetRequest {
  ConfigurationSetName?: string;
}
export const CreateConfigurationSetRequest = S.suspend(() =>
  S.Struct({ ConfigurationSetName: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/sms-voice/configuration-sets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConfigurationSetRequest",
}) as any as S.Schema<CreateConfigurationSetRequest>;
export interface CreateConfigurationSetResponse {}
export const CreateConfigurationSetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateConfigurationSetResponse",
}) as any as S.Schema<CreateConfigurationSetResponse>;
export interface DeleteConfigurationSetRequest {
  ConfigurationSetName: string;
}
export const DeleteConfigurationSetRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String.pipe(T.HttpLabel("ConfigurationSetName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/sms-voice/configuration-sets/{ConfigurationSetName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConfigurationSetRequest",
}) as any as S.Schema<DeleteConfigurationSetRequest>;
export interface DeleteConfigurationSetResponse {}
export const DeleteConfigurationSetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConfigurationSetResponse",
}) as any as S.Schema<DeleteConfigurationSetResponse>;
export interface DeleteConfigurationSetEventDestinationRequest {
  ConfigurationSetName: string;
  EventDestinationName: string;
}
export const DeleteConfigurationSetEventDestinationRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String.pipe(T.HttpLabel("ConfigurationSetName")),
    EventDestinationName: S.String.pipe(T.HttpLabel("EventDestinationName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/sms-voice/configuration-sets/{ConfigurationSetName}/event-destinations/{EventDestinationName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConfigurationSetEventDestinationRequest",
}) as any as S.Schema<DeleteConfigurationSetEventDestinationRequest>;
export interface DeleteConfigurationSetEventDestinationResponse {}
export const DeleteConfigurationSetEventDestinationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConfigurationSetEventDestinationResponse",
}) as any as S.Schema<DeleteConfigurationSetEventDestinationResponse>;
export interface GetConfigurationSetEventDestinationsRequest {
  ConfigurationSetName: string;
}
export const GetConfigurationSetEventDestinationsRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String.pipe(T.HttpLabel("ConfigurationSetName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v1/sms-voice/configuration-sets/{ConfigurationSetName}/event-destinations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConfigurationSetEventDestinationsRequest",
}) as any as S.Schema<GetConfigurationSetEventDestinationsRequest>;
export interface ListConfigurationSetsRequest {
  NextToken?: string;
  PageSize?: string;
}
export const ListConfigurationSetsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("PageSize")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/sms-voice/configuration-sets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConfigurationSetsRequest",
}) as any as S.Schema<ListConfigurationSetsRequest>;
export interface CloudWatchLogsDestination {
  IamRoleArn?: string;
  LogGroupArn?: string;
}
export const CloudWatchLogsDestination = S.suspend(() =>
  S.Struct({
    IamRoleArn: S.optional(S.String),
    LogGroupArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CloudWatchLogsDestination",
}) as any as S.Schema<CloudWatchLogsDestination>;
export interface KinesisFirehoseDestination {
  DeliveryStreamArn?: string;
  IamRoleArn?: string;
}
export const KinesisFirehoseDestination = S.suspend(() =>
  S.Struct({
    DeliveryStreamArn: S.optional(S.String),
    IamRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "KinesisFirehoseDestination",
}) as any as S.Schema<KinesisFirehoseDestination>;
export type EventTypes = string[];
export const EventTypes = S.Array(S.String);
export interface SnsDestination {
  TopicArn?: string;
}
export const SnsDestination = S.suspend(() =>
  S.Struct({ TopicArn: S.optional(S.String) }),
).annotations({
  identifier: "SnsDestination",
}) as any as S.Schema<SnsDestination>;
export interface EventDestinationDefinition {
  CloudWatchLogsDestination?: CloudWatchLogsDestination;
  Enabled?: boolean;
  KinesisFirehoseDestination?: KinesisFirehoseDestination;
  MatchingEventTypes?: EventTypes;
  SnsDestination?: SnsDestination;
}
export const EventDestinationDefinition = S.suspend(() =>
  S.Struct({
    CloudWatchLogsDestination: S.optional(CloudWatchLogsDestination),
    Enabled: S.optional(S.Boolean),
    KinesisFirehoseDestination: S.optional(KinesisFirehoseDestination),
    MatchingEventTypes: S.optional(EventTypes),
    SnsDestination: S.optional(SnsDestination),
  }),
).annotations({
  identifier: "EventDestinationDefinition",
}) as any as S.Schema<EventDestinationDefinition>;
export interface UpdateConfigurationSetEventDestinationRequest {
  ConfigurationSetName: string;
  EventDestination?: EventDestinationDefinition;
  EventDestinationName: string;
}
export const UpdateConfigurationSetEventDestinationRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String.pipe(T.HttpLabel("ConfigurationSetName")),
    EventDestination: S.optional(EventDestinationDefinition),
    EventDestinationName: S.String.pipe(T.HttpLabel("EventDestinationName")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v1/sms-voice/configuration-sets/{ConfigurationSetName}/event-destinations/{EventDestinationName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConfigurationSetEventDestinationRequest",
}) as any as S.Schema<UpdateConfigurationSetEventDestinationRequest>;
export interface UpdateConfigurationSetEventDestinationResponse {}
export const UpdateConfigurationSetEventDestinationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateConfigurationSetEventDestinationResponse",
}) as any as S.Schema<UpdateConfigurationSetEventDestinationResponse>;
export type ConfigurationSets = string[];
export const ConfigurationSets = S.Array(S.String);
export interface ListConfigurationSetsResponse {
  ConfigurationSets?: ConfigurationSets;
  NextToken?: string;
}
export const ListConfigurationSetsResponse = S.suspend(() =>
  S.Struct({
    ConfigurationSets: S.optional(ConfigurationSets),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConfigurationSetsResponse",
}) as any as S.Schema<ListConfigurationSetsResponse>;
export interface CallInstructionsMessageType {
  Text?: string;
}
export const CallInstructionsMessageType = S.suspend(() =>
  S.Struct({ Text: S.optional(S.String) }),
).annotations({
  identifier: "CallInstructionsMessageType",
}) as any as S.Schema<CallInstructionsMessageType>;
export interface PlainTextMessageType {
  LanguageCode?: string;
  Text?: string;
  VoiceId?: string;
}
export const PlainTextMessageType = S.suspend(() =>
  S.Struct({
    LanguageCode: S.optional(S.String),
    Text: S.optional(S.String),
    VoiceId: S.optional(S.String),
  }),
).annotations({
  identifier: "PlainTextMessageType",
}) as any as S.Schema<PlainTextMessageType>;
export interface SSMLMessageType {
  LanguageCode?: string;
  Text?: string;
  VoiceId?: string;
}
export const SSMLMessageType = S.suspend(() =>
  S.Struct({
    LanguageCode: S.optional(S.String),
    Text: S.optional(S.String),
    VoiceId: S.optional(S.String),
  }),
).annotations({
  identifier: "SSMLMessageType",
}) as any as S.Schema<SSMLMessageType>;
export interface EventDestination {
  CloudWatchLogsDestination?: CloudWatchLogsDestination;
  Enabled?: boolean;
  KinesisFirehoseDestination?: KinesisFirehoseDestination;
  MatchingEventTypes?: EventTypes;
  Name?: string;
  SnsDestination?: SnsDestination;
}
export const EventDestination = S.suspend(() =>
  S.Struct({
    CloudWatchLogsDestination: S.optional(CloudWatchLogsDestination),
    Enabled: S.optional(S.Boolean),
    KinesisFirehoseDestination: S.optional(KinesisFirehoseDestination),
    MatchingEventTypes: S.optional(EventTypes),
    Name: S.optional(S.String),
    SnsDestination: S.optional(SnsDestination),
  }),
).annotations({
  identifier: "EventDestination",
}) as any as S.Schema<EventDestination>;
export type EventDestinations = EventDestination[];
export const EventDestinations = S.Array(EventDestination);
export interface VoiceMessageContent {
  CallInstructionsMessage?: CallInstructionsMessageType;
  PlainTextMessage?: PlainTextMessageType;
  SSMLMessage?: SSMLMessageType;
}
export const VoiceMessageContent = S.suspend(() =>
  S.Struct({
    CallInstructionsMessage: S.optional(CallInstructionsMessageType),
    PlainTextMessage: S.optional(PlainTextMessageType),
    SSMLMessage: S.optional(SSMLMessageType),
  }),
).annotations({
  identifier: "VoiceMessageContent",
}) as any as S.Schema<VoiceMessageContent>;
export interface CreateConfigurationSetEventDestinationRequest {
  ConfigurationSetName: string;
  EventDestination?: EventDestinationDefinition;
  EventDestinationName?: string;
}
export const CreateConfigurationSetEventDestinationRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String.pipe(T.HttpLabel("ConfigurationSetName")),
    EventDestination: S.optional(EventDestinationDefinition),
    EventDestinationName: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v1/sms-voice/configuration-sets/{ConfigurationSetName}/event-destinations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConfigurationSetEventDestinationRequest",
}) as any as S.Schema<CreateConfigurationSetEventDestinationRequest>;
export interface CreateConfigurationSetEventDestinationResponse {}
export const CreateConfigurationSetEventDestinationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateConfigurationSetEventDestinationResponse",
}) as any as S.Schema<CreateConfigurationSetEventDestinationResponse>;
export interface GetConfigurationSetEventDestinationsResponse {
  EventDestinations?: EventDestinations;
}
export const GetConfigurationSetEventDestinationsResponse = S.suspend(() =>
  S.Struct({ EventDestinations: S.optional(EventDestinations) }),
).annotations({
  identifier: "GetConfigurationSetEventDestinationsResponse",
}) as any as S.Schema<GetConfigurationSetEventDestinationsResponse>;
export interface SendVoiceMessageRequest {
  CallerId?: string;
  ConfigurationSetName?: string;
  Content?: VoiceMessageContent;
  DestinationPhoneNumber?: string;
  OriginationPhoneNumber?: string;
}
export const SendVoiceMessageRequest = S.suspend(() =>
  S.Struct({
    CallerId: S.optional(S.String),
    ConfigurationSetName: S.optional(S.String),
    Content: S.optional(VoiceMessageContent),
    DestinationPhoneNumber: S.optional(S.String),
    OriginationPhoneNumber: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/sms-voice/voice/message" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendVoiceMessageRequest",
}) as any as S.Schema<SendVoiceMessageRequest>;
export interface SendVoiceMessageResponse {
  MessageId?: string;
}
export const SendVoiceMessageResponse = S.suspend(() =>
  S.Struct({ MessageId: S.optional(S.String) }),
).annotations({
  identifier: "SendVoiceMessageResponse",
}) as any as S.Schema<SendVoiceMessageResponse>;

//# Errors
export class AlreadyExistsException extends S.TaggedError<AlreadyExistsException>()(
  "AlreadyExistsException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InternalServiceErrorException extends S.TaggedError<InternalServiceErrorException>()(
  "InternalServiceErrorException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * List all of the configuration sets associated with your Amazon Pinpoint account in the current region.
 */
export const listConfigurationSets: (
  input: ListConfigurationSetsRequest,
) => Effect.Effect<
  ListConfigurationSetsResponse,
  | BadRequestException
  | InternalServiceErrorException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListConfigurationSetsRequest,
  output: ListConfigurationSetsResponse,
  errors: [
    BadRequestException,
    InternalServiceErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Create a new configuration set. After you create the configuration set, you can add one or more event destinations to it.
 */
export const createConfigurationSet: (
  input: CreateConfigurationSetRequest,
) => Effect.Effect<
  CreateConfigurationSetResponse,
  | AlreadyExistsException
  | BadRequestException
  | InternalServiceErrorException
  | LimitExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConfigurationSetRequest,
  output: CreateConfigurationSetResponse,
  errors: [
    AlreadyExistsException,
    BadRequestException,
    InternalServiceErrorException,
    LimitExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Obtain information about an event destination, including the types of events it reports, the Amazon Resource Name (ARN) of the destination, and the name of the event destination.
 */
export const getConfigurationSetEventDestinations: (
  input: GetConfigurationSetEventDestinationsRequest,
) => Effect.Effect<
  GetConfigurationSetEventDestinationsResponse,
  | BadRequestException
  | InternalServiceErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfigurationSetEventDestinationsRequest,
  output: GetConfigurationSetEventDestinationsResponse,
  errors: [
    BadRequestException,
    InternalServiceErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes an event destination in a configuration set.
 */
export const deleteConfigurationSetEventDestination: (
  input: DeleteConfigurationSetEventDestinationRequest,
) => Effect.Effect<
  DeleteConfigurationSetEventDestinationResponse,
  | BadRequestException
  | InternalServiceErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfigurationSetEventDestinationRequest,
  output: DeleteConfigurationSetEventDestinationResponse,
  errors: [
    BadRequestException,
    InternalServiceErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Update an event destination in a configuration set. An event destination is a location that you publish information about your voice calls to. For example, you can log an event to an Amazon CloudWatch destination when a call fails.
 */
export const updateConfigurationSetEventDestination: (
  input: UpdateConfigurationSetEventDestinationRequest,
) => Effect.Effect<
  UpdateConfigurationSetEventDestinationResponse,
  | BadRequestException
  | InternalServiceErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConfigurationSetEventDestinationRequest,
  output: UpdateConfigurationSetEventDestinationResponse,
  errors: [
    BadRequestException,
    InternalServiceErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes an existing configuration set.
 */
export const deleteConfigurationSet: (
  input: DeleteConfigurationSetRequest,
) => Effect.Effect<
  DeleteConfigurationSetResponse,
  | BadRequestException
  | InternalServiceErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfigurationSetRequest,
  output: DeleteConfigurationSetResponse,
  errors: [
    BadRequestException,
    InternalServiceErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Create a new voice message and send it to a recipient's phone number.
 */
export const sendVoiceMessage: (
  input: SendVoiceMessageRequest,
) => Effect.Effect<
  SendVoiceMessageResponse,
  | BadRequestException
  | InternalServiceErrorException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendVoiceMessageRequest,
  output: SendVoiceMessageResponse,
  errors: [
    BadRequestException,
    InternalServiceErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Create a new event destination in a configuration set.
 */
export const createConfigurationSetEventDestination: (
  input: CreateConfigurationSetEventDestinationRequest,
) => Effect.Effect<
  CreateConfigurationSetEventDestinationResponse,
  | AlreadyExistsException
  | BadRequestException
  | InternalServiceErrorException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConfigurationSetEventDestinationRequest,
  output: CreateConfigurationSetEventDestinationResponse,
  errors: [
    AlreadyExistsException,
    BadRequestException,
    InternalServiceErrorException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
