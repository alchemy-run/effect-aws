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
  sdkId: "Kinesis Video Signaling",
  serviceShapeName: "AWSAcuitySignalingService",
});
const auth = T.AwsAuthSigv4({ name: "kinesisvideo" });
const ver = T.ServiceVersion("2019-12-04");
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
              `https://kinesisvideo-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://kinesisvideo-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://kinesisvideo.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://kinesisvideo.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ResourceARN = string;
export type ClientId = string;
export type Username = string;
export type MessagePayload = string;
export type Answer = string;
export type Uri = string;
export type Password = string;
export type Ttl = number;
export type ErrorMessage = string;

//# Schemas
export interface GetIceServerConfigRequest {
  ChannelARN: string;
  ClientId?: string;
  Service?: string;
  Username?: string;
}
export const GetIceServerConfigRequest = S.suspend(() =>
  S.Struct({
    ChannelARN: S.String,
    ClientId: S.optional(S.String),
    Service: S.optional(S.String),
    Username: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/get-ice-server-config" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIceServerConfigRequest",
}) as any as S.Schema<GetIceServerConfigRequest>;
export interface SendAlexaOfferToMasterRequest {
  ChannelARN: string;
  SenderClientId: string;
  MessagePayload: string;
}
export const SendAlexaOfferToMasterRequest = S.suspend(() =>
  S.Struct({
    ChannelARN: S.String,
    SenderClientId: S.String,
    MessagePayload: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/send-alexa-offer-to-master" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendAlexaOfferToMasterRequest",
}) as any as S.Schema<SendAlexaOfferToMasterRequest>;
export interface SendAlexaOfferToMasterResponse {
  Answer?: string;
}
export const SendAlexaOfferToMasterResponse = S.suspend(() =>
  S.Struct({ Answer: S.optional(S.String) }),
).annotations({
  identifier: "SendAlexaOfferToMasterResponse",
}) as any as S.Schema<SendAlexaOfferToMasterResponse>;
export type Uris = string[];
export const Uris = S.Array(S.String);
export interface IceServer {
  Uris?: Uris;
  Username?: string;
  Password?: string;
  Ttl?: number;
}
export const IceServer = S.suspend(() =>
  S.Struct({
    Uris: S.optional(Uris),
    Username: S.optional(S.String),
    Password: S.optional(S.String),
    Ttl: S.optional(S.Number),
  }),
).annotations({ identifier: "IceServer" }) as any as S.Schema<IceServer>;
export type IceServerList = IceServer[];
export const IceServerList = S.Array(IceServer);
export interface GetIceServerConfigResponse {
  IceServerList?: IceServerList;
}
export const GetIceServerConfigResponse = S.suspend(() =>
  S.Struct({ IceServerList: S.optional(IceServerList) }),
).annotations({
  identifier: "GetIceServerConfigResponse",
}) as any as S.Schema<GetIceServerConfigResponse>;

//# Errors
export class ClientLimitExceededException extends S.TaggedError<ClientLimitExceededException>()(
  "ClientLimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidArgumentException extends S.TaggedError<InvalidArgumentException>()(
  "InvalidArgumentException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NotAuthorizedException extends S.TaggedError<NotAuthorizedException>()(
  "NotAuthorizedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InvalidClientException extends S.TaggedError<InvalidClientException>()(
  "InvalidClientException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class SessionExpiredException extends S.TaggedError<SessionExpiredException>()(
  "SessionExpiredException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * This API allows you to connect WebRTC-enabled devices with Alexa display devices. When
 * invoked, it sends the Alexa Session Description Protocol (SDP) offer to the master peer.
 * The offer is delivered as soon as the master is connected to the specified signaling
 * channel. This API returns the SDP answer from the connected master. If the master is not
 * connected to the signaling channel, redelivery requests are made until the message
 * expires.
 */
export const sendAlexaOfferToMaster: (
  input: SendAlexaOfferToMasterRequest,
) => Effect.Effect<
  SendAlexaOfferToMasterResponse,
  | ClientLimitExceededException
  | InvalidArgumentException
  | NotAuthorizedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendAlexaOfferToMasterRequest,
  output: SendAlexaOfferToMasterResponse,
  errors: [
    ClientLimitExceededException,
    InvalidArgumentException,
    NotAuthorizedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Gets the Interactive Connectivity Establishment (ICE) server configuration
 * information, including URIs, username, and password which can be used to configure the
 * WebRTC connection. The ICE component uses this configuration information to setup the
 * WebRTC connection, including authenticating with the Traversal Using Relays around NAT
 * (TURN) relay server.
 *
 * TURN is a protocol that is used to improve the connectivity of peer-to-peer
 * applications. By providing a cloud-based relay service, TURN ensures that a connection
 * can be established even when one or more peers are incapable of a direct peer-to-peer
 * connection. For more information, see A REST API For
 * Access To TURN Services.
 *
 * You can invoke this API to establish a fallback mechanism in case either of the peers
 * is unable to establish a direct peer-to-peer connection over a signaling channel. You
 * must specify either a signaling channel ARN or the client ID in order to invoke this
 * API.
 */
export const getIceServerConfig: (
  input: GetIceServerConfigRequest,
) => Effect.Effect<
  GetIceServerConfigResponse,
  | ClientLimitExceededException
  | InvalidArgumentException
  | InvalidClientException
  | NotAuthorizedException
  | ResourceNotFoundException
  | SessionExpiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIceServerConfigRequest,
  output: GetIceServerConfigResponse,
  errors: [
    ClientLimitExceededException,
    InvalidArgumentException,
    InvalidClientException,
    NotAuthorizedException,
    ResourceNotFoundException,
    SessionExpiredException,
  ],
}));
