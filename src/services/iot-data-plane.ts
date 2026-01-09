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
  sdkId: "IoT Data Plane",
  serviceShapeName: "IotMoonrakerService",
});
const auth = T.AwsAuthSigv4({ name: "iotdata" });
const ver = T.ServiceVersion("2015-05-28");
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
              `https://data-ats.iot-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (Region === "ca-central-1") {
              return e("https://data.iot-fips.ca-central-1.amazonaws.com");
            }
            if (Region === "us-east-1") {
              return e("https://data.iot-fips.us-east-1.amazonaws.com");
            }
            if (Region === "us-east-2") {
              return e("https://data.iot-fips.us-east-2.amazonaws.com");
            }
            if (Region === "us-west-1") {
              return e("https://data.iot-fips.us-west-1.amazonaws.com");
            }
            if (Region === "us-west-2") {
              return e("https://data.iot-fips.us-west-2.amazonaws.com");
            }
            if (Region === "us-gov-east-1") {
              return e("https://data.iot-fips.us-gov-east-1.amazonaws.com");
            }
            if (Region === "us-gov-west-1") {
              return e("https://data.iot-fips.us-gov-west-1.amazonaws.com");
            }
            return e(
              `https://data-ats.iot-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://data-ats.iot.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        if (Region === "cn-north-1") {
          return e("https://data.ats.iot.cn-north-1.amazonaws.com.cn");
        }
        if ("aws" === _.getAttr(PartitionResult, "name")) {
          return e(`https://data-ats.iot.${Region}.amazonaws.com`);
        }
        if ("aws-cn" === _.getAttr(PartitionResult, "name")) {
          return e(`https://data-ats.iot.${Region}.amazonaws.com.cn`);
        }
        if ("aws-us-gov" === _.getAttr(PartitionResult, "name")) {
          return e(`https://data-ats.iot.${Region}.amazonaws.com`);
        }
        return e(
          `https://data-ats.iot.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ClientId = string;
export type CleanSession = boolean;
export type PreventWillMessage = boolean;
export type ThingName = string;
export type ShadowName = string;
export type Topic = string;
export type NextToken = string;
export type PageSize = number;
export type MaxResults = number;
export type Qos = number;
export type Retain = boolean;
export type SynthesizedJsonUserProperties = string;
export type ContentType = string;
export type ResponseTopic = string;
export type CorrelationData = string;
export type MessageExpiry = number;
export type ErrorMessage = string;
export type Payload = Uint8Array;
export type UserPropertiesBlob = Uint8Array;
export type PayloadSize = number;

//# Schemas
export type PayloadFormatIndicator =
  | "UNSPECIFIED_BYTES"
  | "UTF8_DATA"
  | (string & {});
export const PayloadFormatIndicator = S.String;
export interface DeleteConnectionRequest {
  clientId: string;
  cleanSession?: boolean;
  preventWillMessage?: boolean;
}
export const DeleteConnectionRequest = S.suspend(() =>
  S.Struct({
    clientId: S.String.pipe(T.HttpLabel("clientId")),
    cleanSession: S.optional(S.Boolean).pipe(T.HttpQuery("cleanSession")),
    preventWillMessage: S.optional(S.Boolean).pipe(
      T.HttpQuery("preventWillMessage"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/connections/{clientId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConnectionRequest",
}) as any as S.Schema<DeleteConnectionRequest>;
export interface DeleteConnectionResponse {}
export const DeleteConnectionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConnectionResponse",
}) as any as S.Schema<DeleteConnectionResponse>;
export interface DeleteThingShadowRequest {
  thingName: string;
  shadowName?: string;
}
export const DeleteThingShadowRequest = S.suspend(() =>
  S.Struct({
    thingName: S.String.pipe(T.HttpLabel("thingName")),
    shadowName: S.optional(S.String).pipe(T.HttpQuery("name")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/things/{thingName}/shadow" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteThingShadowRequest",
}) as any as S.Schema<DeleteThingShadowRequest>;
export interface GetRetainedMessageRequest {
  topic: string;
}
export const GetRetainedMessageRequest = S.suspend(() =>
  S.Struct({ topic: S.String.pipe(T.HttpLabel("topic")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/retainedMessage/{topic}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRetainedMessageRequest",
}) as any as S.Schema<GetRetainedMessageRequest>;
export interface GetThingShadowRequest {
  thingName: string;
  shadowName?: string;
}
export const GetThingShadowRequest = S.suspend(() =>
  S.Struct({
    thingName: S.String.pipe(T.HttpLabel("thingName")),
    shadowName: S.optional(S.String).pipe(T.HttpQuery("name")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/things/{thingName}/shadow" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetThingShadowRequest",
}) as any as S.Schema<GetThingShadowRequest>;
export interface ListNamedShadowsForThingRequest {
  thingName: string;
  nextToken?: string;
  pageSize?: number;
}
export const ListNamedShadowsForThingRequest = S.suspend(() =>
  S.Struct({
    thingName: S.String.pipe(T.HttpLabel("thingName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/api/things/shadow/ListNamedShadowsForThing/{thingName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListNamedShadowsForThingRequest",
}) as any as S.Schema<ListNamedShadowsForThingRequest>;
export interface ListRetainedMessagesRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListRetainedMessagesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/retainedMessage" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRetainedMessagesRequest",
}) as any as S.Schema<ListRetainedMessagesRequest>;
export interface PublishRequest {
  topic: string;
  qos?: number;
  retain?: boolean;
  payload?: T.StreamingInputBody;
  userProperties?: string;
  payloadFormatIndicator?: PayloadFormatIndicator;
  contentType?: string;
  responseTopic?: string;
  correlationData?: string;
  messageExpiry?: number;
}
export const PublishRequest = S.suspend(() =>
  S.Struct({
    topic: S.String.pipe(T.HttpLabel("topic")),
    qos: S.optional(S.Number).pipe(T.HttpQuery("qos")),
    retain: S.optional(S.Boolean).pipe(T.HttpQuery("retain")),
    payload: S.optional(T.StreamingInput).pipe(T.HttpPayload()),
    userProperties: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-mqtt5-user-properties"),
    ),
    payloadFormatIndicator: S.optional(PayloadFormatIndicator).pipe(
      T.HttpHeader("x-amz-mqtt5-payload-format-indicator"),
    ),
    contentType: S.optional(S.String).pipe(T.HttpQuery("contentType")),
    responseTopic: S.optional(S.String).pipe(T.HttpQuery("responseTopic")),
    correlationData: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-mqtt5-correlation-data"),
    ),
    messageExpiry: S.optional(S.Number).pipe(T.HttpQuery("messageExpiry")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/topics/{topic}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PublishRequest",
}) as any as S.Schema<PublishRequest>;
export interface PublishResponse {}
export const PublishResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "PublishResponse",
}) as any as S.Schema<PublishResponse>;
export interface UpdateThingShadowRequest {
  thingName: string;
  shadowName?: string;
  payload: T.StreamingInputBody;
}
export const UpdateThingShadowRequest = S.suspend(() =>
  S.Struct({
    thingName: S.String.pipe(T.HttpLabel("thingName")),
    shadowName: S.optional(S.String).pipe(T.HttpQuery("name")),
    payload: T.StreamingInput.pipe(T.HttpPayload()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/things/{thingName}/shadow" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateThingShadowRequest",
}) as any as S.Schema<UpdateThingShadowRequest>;
export type NamedShadowList = string[];
export const NamedShadowList = S.Array(S.String);
export interface DeleteThingShadowResponse {
  payload: T.StreamingOutputBody;
}
export const DeleteThingShadowResponse = S.suspend(() =>
  S.Struct({ payload: T.StreamingOutput.pipe(T.HttpPayload()) }),
).annotations({
  identifier: "DeleteThingShadowResponse",
}) as any as S.Schema<DeleteThingShadowResponse>;
export interface GetRetainedMessageResponse {
  topic?: string;
  payload?: Uint8Array;
  qos?: number;
  lastModifiedTime?: number;
  userProperties?: Uint8Array;
}
export const GetRetainedMessageResponse = S.suspend(() =>
  S.Struct({
    topic: S.optional(S.String),
    payload: S.optional(T.Blob),
    qos: S.optional(S.Number),
    lastModifiedTime: S.optional(S.Number),
    userProperties: S.optional(T.Blob),
  }),
).annotations({
  identifier: "GetRetainedMessageResponse",
}) as any as S.Schema<GetRetainedMessageResponse>;
export interface GetThingShadowResponse {
  payload?: T.StreamingOutputBody;
}
export const GetThingShadowResponse = S.suspend(() =>
  S.Struct({ payload: S.optional(T.StreamingOutput).pipe(T.HttpPayload()) }),
).annotations({
  identifier: "GetThingShadowResponse",
}) as any as S.Schema<GetThingShadowResponse>;
export interface ListNamedShadowsForThingResponse {
  results?: string[];
  nextToken?: string;
  timestamp?: number;
}
export const ListNamedShadowsForThingResponse = S.suspend(() =>
  S.Struct({
    results: S.optional(NamedShadowList),
    nextToken: S.optional(S.String),
    timestamp: S.optional(S.Number),
  }),
).annotations({
  identifier: "ListNamedShadowsForThingResponse",
}) as any as S.Schema<ListNamedShadowsForThingResponse>;
export interface UpdateThingShadowResponse {
  payload?: T.StreamingOutputBody;
}
export const UpdateThingShadowResponse = S.suspend(() =>
  S.Struct({ payload: S.optional(T.StreamingOutput).pipe(T.HttpPayload()) }),
).annotations({
  identifier: "UpdateThingShadowResponse",
}) as any as S.Schema<UpdateThingShadowResponse>;
export interface RetainedMessageSummary {
  topic?: string;
  payloadSize?: number;
  qos?: number;
  lastModifiedTime?: number;
}
export const RetainedMessageSummary = S.suspend(() =>
  S.Struct({
    topic: S.optional(S.String),
    payloadSize: S.optional(S.Number),
    qos: S.optional(S.Number),
    lastModifiedTime: S.optional(S.Number),
  }),
).annotations({
  identifier: "RetainedMessageSummary",
}) as any as S.Schema<RetainedMessageSummary>;
export type RetainedMessageList = RetainedMessageSummary[];
export const RetainedMessageList = S.Array(RetainedMessageSummary);
export interface ListRetainedMessagesResponse {
  retainedTopics?: RetainedMessageSummary[];
  nextToken?: string;
}
export const ListRetainedMessagesResponse = S.suspend(() =>
  S.Struct({
    retainedTopics: S.optional(RetainedMessageList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRetainedMessagesResponse",
}) as any as S.Schema<ListRetainedMessagesResponse>;

//# Errors
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class MethodNotAllowedException extends S.TaggedError<MethodNotAllowedException>()(
  "MethodNotAllowedException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class RequestEntityTooLargeException extends S.TaggedError<RequestEntityTooLargeException>()(
  "RequestEntityTooLargeException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class UnsupportedDocumentEncodingException extends S.TaggedError<UnsupportedDocumentEncodingException>()(
  "UnsupportedDocumentEncodingException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Disconnects a connected MQTT client from Amazon Web Services IoT Core. When you disconnect a client, Amazon Web Services IoT Core closes the client's network connection and optionally cleans the session state.
 */
export const deleteConnection: (
  input: DeleteConnectionRequest,
) => effect.Effect<
  DeleteConnectionResponse,
  | ForbiddenException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectionRequest,
  output: DeleteConnectionResponse,
  errors: [
    ForbiddenException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Publishes an MQTT message.
 *
 * Requires permission to access the Publish action.
 *
 * For more information about MQTT messages, see
 * MQTT Protocol in the
 * IoT Developer Guide.
 *
 * For more information about messaging costs, see Amazon Web Services IoT Core
 * pricing - Messaging.
 */
export const publish: (
  input: PublishRequest,
) => effect.Effect<
  PublishResponse,
  | InternalFailureException
  | InvalidRequestException
  | MethodNotAllowedException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PublishRequest,
  output: PublishResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    MethodNotAllowedException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets the details of a single retained message for the specified topic.
 *
 * This action returns the message payload of the retained message, which can
 * incur messaging costs. To list only the topic names of the retained messages, call
 * ListRetainedMessages.
 *
 * Requires permission to access the GetRetainedMessage action.
 *
 * For more information about messaging costs, see Amazon Web Services IoT Core
 * pricing - Messaging.
 */
export const getRetainedMessage: (
  input: GetRetainedMessageRequest,
) => effect.Effect<
  GetRetainedMessageResponse,
  | InternalFailureException
  | InvalidRequestException
  | MethodNotAllowedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRetainedMessageRequest,
  output: GetRetainedMessageResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    MethodNotAllowedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the shadows for the specified thing.
 *
 * Requires permission to access the ListNamedShadowsForThing action.
 */
export const listNamedShadowsForThing: (
  input: ListNamedShadowsForThingRequest,
) => effect.Effect<
  ListNamedShadowsForThingResponse,
  | InternalFailureException
  | InvalidRequestException
  | MethodNotAllowedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListNamedShadowsForThingRequest,
  output: ListNamedShadowsForThingResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    MethodNotAllowedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Lists summary information about the retained messages stored for the account.
 *
 * This action returns only the topic names of the retained messages. It doesn't
 * return any message payloads. Although this action doesn't return a message payload,
 * it can still incur messaging costs.
 *
 * To get the message payload of a retained message, call
 * GetRetainedMessage
 * with the topic name of the retained message.
 *
 * Requires permission to access the ListRetainedMessages action.
 *
 * For more information about messaging costs, see Amazon Web Services IoT Core
 * pricing - Messaging.
 */
export const listRetainedMessages: {
  (
    input: ListRetainedMessagesRequest,
  ): effect.Effect<
    ListRetainedMessagesResponse,
    | InternalFailureException
    | InvalidRequestException
    | MethodNotAllowedException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRetainedMessagesRequest,
  ) => stream.Stream<
    ListRetainedMessagesResponse,
    | InternalFailureException
    | InvalidRequestException
    | MethodNotAllowedException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRetainedMessagesRequest,
  ) => stream.Stream<
    RetainedMessageSummary,
    | InternalFailureException
    | InvalidRequestException
    | MethodNotAllowedException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRetainedMessagesRequest,
  output: ListRetainedMessagesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    MethodNotAllowedException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "retainedTopics",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Deletes the shadow for the specified thing.
 *
 * Requires permission to access the DeleteThingShadow action.
 *
 * For more information, see DeleteThingShadow in the IoT Developer Guide.
 */
export const deleteThingShadow: (
  input: DeleteThingShadowRequest,
) => effect.Effect<
  DeleteThingShadowResponse,
  | InternalFailureException
  | InvalidRequestException
  | MethodNotAllowedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | UnsupportedDocumentEncodingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteThingShadowRequest,
  output: DeleteThingShadowResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    MethodNotAllowedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    UnsupportedDocumentEncodingException,
  ],
}));
/**
 * Gets the shadow for the specified thing.
 *
 * Requires permission to access the GetThingShadow action.
 *
 * For more information, see GetThingShadow in the
 * IoT Developer Guide.
 */
export const getThingShadow: (
  input: GetThingShadowRequest,
) => effect.Effect<
  GetThingShadowResponse,
  | InternalFailureException
  | InvalidRequestException
  | MethodNotAllowedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | UnsupportedDocumentEncodingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetThingShadowRequest,
  output: GetThingShadowResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    MethodNotAllowedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    UnsupportedDocumentEncodingException,
  ],
}));
/**
 * Updates the shadow for the specified thing.
 *
 * Requires permission to access the UpdateThingShadow action.
 *
 * For more information, see UpdateThingShadow in the
 * IoT Developer Guide.
 */
export const updateThingShadow: (
  input: UpdateThingShadowRequest,
) => effect.Effect<
  UpdateThingShadowResponse,
  | ConflictException
  | InternalFailureException
  | InvalidRequestException
  | MethodNotAllowedException
  | RequestEntityTooLargeException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | UnsupportedDocumentEncodingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateThingShadowRequest,
  output: UpdateThingShadowResponse,
  errors: [
    ConflictException,
    InternalFailureException,
    InvalidRequestException,
    MethodNotAllowedException,
    RequestEntityTooLargeException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    UnsupportedDocumentEncodingException,
  ],
}));
