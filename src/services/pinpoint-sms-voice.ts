import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
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
              `https://sms-voice.pinpoint-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://sms-voice.pinpoint-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://sms-voice.pinpoint.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://sms-voice.pinpoint.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type WordCharactersWithDelimiters = string;
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
export type EventType =
  | "INITIATED_CALL"
  | "RINGING"
  | "ANSWERED"
  | "COMPLETED_CALL"
  | "BUSY"
  | "FAILED"
  | "NO_ANSWER";
export const EventType = S.Literal(
  "INITIATED_CALL",
  "RINGING",
  "ANSWERED",
  "COMPLETED_CALL",
  "BUSY",
  "FAILED",
  "NO_ANSWER",
);
export type EventTypes = EventType[];
export const EventTypes = S.Array(EventType);
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
  MatchingEventTypes?: EventType[];
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
  ConfigurationSets?: string[];
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
  MatchingEventTypes?: EventType[];
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
  EventDestinations?: EventDestination[];
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
