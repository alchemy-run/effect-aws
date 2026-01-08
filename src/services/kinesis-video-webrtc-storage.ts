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
  sdkId: "Kinesis Video WebRTC Storage",
  serviceShapeName: "AWSAcuityRoutingServiceLambda",
});
const auth = T.AwsAuthSigv4({ name: "kinesisvideo" });
const ver = T.ServiceVersion("2018-05-10");
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
export type ChannelArn = string;
export type ClientId = string;

//# Schemas
export interface JoinStorageSessionInput {
  channelArn: string;
}
export const JoinStorageSessionInput = S.suspend(() =>
  S.Struct({ channelArn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/joinStorageSession" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "JoinStorageSessionInput",
}) as any as S.Schema<JoinStorageSessionInput>;
export interface JoinStorageSessionResponse {}
export const JoinStorageSessionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "JoinStorageSessionResponse",
}) as any as S.Schema<JoinStorageSessionResponse>;
export interface JoinStorageSessionAsViewerInput {
  channelArn: string;
  clientId: string;
}
export const JoinStorageSessionAsViewerInput = S.suspend(() =>
  S.Struct({ channelArn: S.String, clientId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/joinStorageSessionAsViewer" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "JoinStorageSessionAsViewerInput",
}) as any as S.Schema<JoinStorageSessionAsViewerInput>;
export interface JoinStorageSessionAsViewerResponse {}
export const JoinStorageSessionAsViewerResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "JoinStorageSessionAsViewerResponse",
}) as any as S.Schema<JoinStorageSessionAsViewerResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ClientLimitExceededException extends S.TaggedError<ClientLimitExceededException>()(
  "ClientLimitExceededException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidArgumentException extends S.TaggedError<InvalidArgumentException>()(
  "InvalidArgumentException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Before using this API, you must call the `GetSignalingChannelEndpoint` API to request the WEBRTC endpoint. You then specify the endpoint and region in your `JoinStorageSession` API request.
 *
 * Join the ongoing one way-video and/or multi-way audio WebRTC session as a video producing
 * device for an input channel. If there’s no existing session for the channel, a new streaming
 * session needs to be created, and the Amazon Resource Name (ARN) of the signaling channel must
 * be provided.
 *
 * Currently for the `SINGLE_MASTER` type, a video producing
 * device is able to ingest both audio and video media into a stream. Only video producing devices can join the session and record media.
 *
 * Both audio and video tracks are currently required for WebRTC ingestion.
 *
 * Current requirements:
 *
 * - Video track: H.264
 *
 * - Audio track: Opus
 *
 * The resulting ingested video in the Kinesis video stream will have the following
 * parameters: H.264 video and AAC audio.
 *
 * Once a master participant has negotiated a connection through WebRTC, the ingested media
 * session will be stored in the Kinesis video stream. Multiple viewers are then able to play
 * back real-time media through our Playback APIs.
 *
 * You can also use existing Kinesis Video Streams features like `HLS` or
 * `DASH` playback, image generation via GetImages, and more
 * with ingested WebRTC media.
 *
 * S3 image delivery and notifications are not currently supported.
 *
 * Assume that only one video producing device client
 * can be associated with a session for the channel. If more than one
 * client joins the session of a specific channel as a video producing device,
 * the most recent client request takes precedence.
 *
 * **Additional information**
 *
 * - **Idempotent** - This API is not idempotent.
 *
 * - **Retry behavior** - This is counted as a new API call.
 *
 * - **Concurrent calls** - Concurrent calls are allowed. An offer is sent once per each call.
 */
export const joinStorageSession: (
  input: JoinStorageSessionInput,
) => Effect.Effect<
  JoinStorageSessionResponse,
  | AccessDeniedException
  | ClientLimitExceededException
  | InvalidArgumentException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: JoinStorageSessionInput,
  output: JoinStorageSessionResponse,
  errors: [
    AccessDeniedException,
    ClientLimitExceededException,
    InvalidArgumentException,
    ResourceNotFoundException,
  ],
}));
/**
 * Join the ongoing one way-video and/or multi-way audio WebRTC session as
 * a viewer for an input channel. If there’s
 * no existing session for the channel, create a new streaming session and provide
 * the Amazon Resource Name (ARN) of the signaling channel (`channelArn`)
 * and client id (`clientId`).
 *
 * Currently for `SINGLE_MASTER` type, a video producing device
 * is able to ingest both audio and video media into a stream, while viewers
 * can only ingest audio. Both a video producing device and viewers can join
 * a session first and wait for other participants. While participants are having peer to peer conversations through WebRTC,
 * the ingested media session will be stored into the Kinesis Video Stream.
 * Multiple viewers are able to playback real-time media.
 *
 * Customers can also use existing Kinesis Video Streams features like
 * `HLS` or `DASH` playback, Image generation, and more
 * with ingested WebRTC media. If there’s an existing session with the same
 * `clientId` that's found in the join session request, the new request takes precedence.
 */
export const joinStorageSessionAsViewer: (
  input: JoinStorageSessionAsViewerInput,
) => Effect.Effect<
  JoinStorageSessionAsViewerResponse,
  | AccessDeniedException
  | ClientLimitExceededException
  | InvalidArgumentException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: JoinStorageSessionAsViewerInput,
  output: JoinStorageSessionAsViewerResponse,
  errors: [
    AccessDeniedException,
    ClientLimitExceededException,
    InvalidArgumentException,
    ResourceNotFoundException,
  ],
}));
