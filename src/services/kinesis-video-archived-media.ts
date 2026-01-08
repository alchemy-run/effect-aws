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
  sdkId: "Kinesis Video Archived Media",
  serviceShapeName: "AWSAcuityReader",
});
const auth = T.AwsAuthSigv4({ name: "kinesisvideo" });
const ver = T.ServiceVersion("2017-09-30");
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
export type StreamName = string;
export type ResourceARN = string;
export type Expires = number;
export type DASHMaxResults = number;
export type HLSMaxResults = number;
export type SamplingInterval = number;
export type WidthPixels = number;
export type HeightPixels = number;
export type GetImagesMaxResults = number;
export type NextToken = string;
export type FragmentNumberString = string;
export type ListFragmentsMaxResults = number;
export type FormatConfigValue = string;
export type ContentType = string;
export type ErrorMessage = string;
export type ImageContent = string;
export type DASHStreamingSessionURL = string;
export type HLSStreamingSessionURL = string;
export type Long = number;

//# Schemas
export type FragmentNumberList = string[];
export const FragmentNumberList = S.Array(S.String);
export interface GetMediaForFragmentListInput {
  StreamName?: string;
  StreamARN?: string;
  Fragments: FragmentNumberList;
}
export const GetMediaForFragmentListInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    Fragments: FragmentNumberList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/getMediaForFragmentList" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMediaForFragmentListInput",
}) as any as S.Schema<GetMediaForFragmentListInput>;
export type FormatConfig = { [key: string]: string };
export const FormatConfig = S.Record({ key: S.String, value: S.String });
export interface GetImagesInput {
  StreamName?: string;
  StreamARN?: string;
  ImageSelectorType: string;
  StartTimestamp: Date;
  EndTimestamp: Date;
  SamplingInterval?: number;
  Format: string;
  FormatConfig?: FormatConfig;
  WidthPixels?: number;
  HeightPixels?: number;
  MaxResults?: number;
  NextToken?: string;
}
export const GetImagesInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    ImageSelectorType: S.String,
    StartTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    SamplingInterval: S.optional(S.Number),
    Format: S.String,
    FormatConfig: S.optional(FormatConfig),
    WidthPixels: S.optional(S.Number),
    HeightPixels: S.optional(S.Number),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/getImages" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetImagesInput",
}) as any as S.Schema<GetImagesInput>;
export interface GetMediaForFragmentListOutput {
  ContentType?: string;
  Payload?: T.StreamingOutputBody;
}
export const GetMediaForFragmentListOutput = S.suspend(() =>
  S.Struct({
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    Payload: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
  }),
).annotations({
  identifier: "GetMediaForFragmentListOutput",
}) as any as S.Schema<GetMediaForFragmentListOutput>;
export interface ClipTimestampRange {
  StartTimestamp: Date;
  EndTimestamp: Date;
}
export const ClipTimestampRange = S.suspend(() =>
  S.Struct({
    StartTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ClipTimestampRange",
}) as any as S.Schema<ClipTimestampRange>;
export interface DASHTimestampRange {
  StartTimestamp?: Date;
  EndTimestamp?: Date;
}
export const DASHTimestampRange = S.suspend(() =>
  S.Struct({
    StartTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DASHTimestampRange",
}) as any as S.Schema<DASHTimestampRange>;
export interface HLSTimestampRange {
  StartTimestamp?: Date;
  EndTimestamp?: Date;
}
export const HLSTimestampRange = S.suspend(() =>
  S.Struct({
    StartTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "HLSTimestampRange",
}) as any as S.Schema<HLSTimestampRange>;
export interface TimestampRange {
  StartTimestamp: Date;
  EndTimestamp: Date;
}
export const TimestampRange = S.suspend(() =>
  S.Struct({
    StartTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "TimestampRange",
}) as any as S.Schema<TimestampRange>;
export interface ClipFragmentSelector {
  FragmentSelectorType: string;
  TimestampRange: ClipTimestampRange;
}
export const ClipFragmentSelector = S.suspend(() =>
  S.Struct({
    FragmentSelectorType: S.String,
    TimestampRange: ClipTimestampRange,
  }),
).annotations({
  identifier: "ClipFragmentSelector",
}) as any as S.Schema<ClipFragmentSelector>;
export interface DASHFragmentSelector {
  FragmentSelectorType?: string;
  TimestampRange?: DASHTimestampRange;
}
export const DASHFragmentSelector = S.suspend(() =>
  S.Struct({
    FragmentSelectorType: S.optional(S.String),
    TimestampRange: S.optional(DASHTimestampRange),
  }),
).annotations({
  identifier: "DASHFragmentSelector",
}) as any as S.Schema<DASHFragmentSelector>;
export interface HLSFragmentSelector {
  FragmentSelectorType?: string;
  TimestampRange?: HLSTimestampRange;
}
export const HLSFragmentSelector = S.suspend(() =>
  S.Struct({
    FragmentSelectorType: S.optional(S.String),
    TimestampRange: S.optional(HLSTimestampRange),
  }),
).annotations({
  identifier: "HLSFragmentSelector",
}) as any as S.Schema<HLSFragmentSelector>;
export interface FragmentSelector {
  FragmentSelectorType: string;
  TimestampRange: TimestampRange;
}
export const FragmentSelector = S.suspend(() =>
  S.Struct({ FragmentSelectorType: S.String, TimestampRange: TimestampRange }),
).annotations({
  identifier: "FragmentSelector",
}) as any as S.Schema<FragmentSelector>;
export interface GetClipInput {
  StreamName?: string;
  StreamARN?: string;
  ClipFragmentSelector: ClipFragmentSelector;
}
export const GetClipInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    ClipFragmentSelector: ClipFragmentSelector,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/getClip" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({ identifier: "GetClipInput" }) as any as S.Schema<GetClipInput>;
export interface GetDASHStreamingSessionURLInput {
  StreamName?: string;
  StreamARN?: string;
  PlaybackMode?: string;
  DisplayFragmentTimestamp?: string;
  DisplayFragmentNumber?: string;
  DASHFragmentSelector?: DASHFragmentSelector;
  Expires?: number;
  MaxManifestFragmentResults?: number;
}
export const GetDASHStreamingSessionURLInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    PlaybackMode: S.optional(S.String),
    DisplayFragmentTimestamp: S.optional(S.String),
    DisplayFragmentNumber: S.optional(S.String),
    DASHFragmentSelector: S.optional(DASHFragmentSelector),
    Expires: S.optional(S.Number),
    MaxManifestFragmentResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/getDASHStreamingSessionURL" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDASHStreamingSessionURLInput",
}) as any as S.Schema<GetDASHStreamingSessionURLInput>;
export interface GetHLSStreamingSessionURLInput {
  StreamName?: string;
  StreamARN?: string;
  PlaybackMode?: string;
  HLSFragmentSelector?: HLSFragmentSelector;
  ContainerFormat?: string;
  DiscontinuityMode?: string;
  DisplayFragmentTimestamp?: string;
  Expires?: number;
  MaxMediaPlaylistFragmentResults?: number;
}
export const GetHLSStreamingSessionURLInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    PlaybackMode: S.optional(S.String),
    HLSFragmentSelector: S.optional(HLSFragmentSelector),
    ContainerFormat: S.optional(S.String),
    DiscontinuityMode: S.optional(S.String),
    DisplayFragmentTimestamp: S.optional(S.String),
    Expires: S.optional(S.Number),
    MaxMediaPlaylistFragmentResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/getHLSStreamingSessionURL" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetHLSStreamingSessionURLInput",
}) as any as S.Schema<GetHLSStreamingSessionURLInput>;
export interface ListFragmentsInput {
  StreamName?: string;
  StreamARN?: string;
  MaxResults?: number;
  NextToken?: string;
  FragmentSelector?: FragmentSelector;
}
export const ListFragmentsInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    FragmentSelector: S.optional(FragmentSelector),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listFragments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFragmentsInput",
}) as any as S.Schema<ListFragmentsInput>;
export interface Image {
  TimeStamp?: Date;
  Error?: string;
  ImageContent?: string;
}
export const Image = S.suspend(() =>
  S.Struct({
    TimeStamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Error: S.optional(S.String),
    ImageContent: S.optional(S.String),
  }),
).annotations({ identifier: "Image" }) as any as S.Schema<Image>;
export type Images = Image[];
export const Images = S.Array(Image);
export interface GetClipOutput {
  ContentType?: string;
  Payload?: T.StreamingOutputBody;
}
export const GetClipOutput = S.suspend(() =>
  S.Struct({
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    Payload: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
  }),
).annotations({
  identifier: "GetClipOutput",
}) as any as S.Schema<GetClipOutput>;
export interface GetDASHStreamingSessionURLOutput {
  DASHStreamingSessionURL?: string;
}
export const GetDASHStreamingSessionURLOutput = S.suspend(() =>
  S.Struct({ DASHStreamingSessionURL: S.optional(S.String) }),
).annotations({
  identifier: "GetDASHStreamingSessionURLOutput",
}) as any as S.Schema<GetDASHStreamingSessionURLOutput>;
export interface GetHLSStreamingSessionURLOutput {
  HLSStreamingSessionURL?: string;
}
export const GetHLSStreamingSessionURLOutput = S.suspend(() =>
  S.Struct({ HLSStreamingSessionURL: S.optional(S.String) }),
).annotations({
  identifier: "GetHLSStreamingSessionURLOutput",
}) as any as S.Schema<GetHLSStreamingSessionURLOutput>;
export interface GetImagesOutput {
  Images?: Images;
  NextToken?: string;
}
export const GetImagesOutput = S.suspend(() =>
  S.Struct({ Images: S.optional(Images), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "GetImagesOutput",
}) as any as S.Schema<GetImagesOutput>;
export interface Fragment {
  FragmentNumber?: string;
  FragmentSizeInBytes?: number;
  ProducerTimestamp?: Date;
  ServerTimestamp?: Date;
  FragmentLengthInMilliseconds?: number;
}
export const Fragment = S.suspend(() =>
  S.Struct({
    FragmentNumber: S.optional(S.String),
    FragmentSizeInBytes: S.optional(S.Number),
    ProducerTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ServerTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    FragmentLengthInMilliseconds: S.optional(S.Number),
  }),
).annotations({ identifier: "Fragment" }) as any as S.Schema<Fragment>;
export type FragmentList = Fragment[];
export const FragmentList = S.Array(Fragment);
export interface ListFragmentsOutput {
  Fragments?: FragmentList;
  NextToken?: string;
}
export const ListFragmentsOutput = S.suspend(() =>
  S.Struct({
    Fragments: S.optional(FragmentList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListFragmentsOutput",
}) as any as S.Schema<ListFragmentsOutput>;

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
export class InvalidCodecPrivateDataException extends S.TaggedError<InvalidCodecPrivateDataException>()(
  "InvalidCodecPrivateDataException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoDataRetentionException extends S.TaggedError<NoDataRetentionException>()(
  "NoDataRetentionException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidMediaFrameException extends S.TaggedError<InvalidMediaFrameException>()(
  "InvalidMediaFrameException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class MissingCodecPrivateDataException extends S.TaggedError<MissingCodecPrivateDataException>()(
  "MissingCodecPrivateDataException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnsupportedStreamMediaTypeException extends S.TaggedError<UnsupportedStreamMediaTypeException>()(
  "UnsupportedStreamMediaTypeException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Gets media for a list of fragments (specified by fragment number) from the archived
 * data in an Amazon Kinesis video stream.
 *
 * You must first call the `GetDataEndpoint` API to get an endpoint.
 * Then send the `GetMediaForFragmentList` requests to this endpoint using
 * the --endpoint-url
 * parameter.
 *
 * For limits, see Kinesis Video Streams Limits.
 *
 * If an error is thrown after invoking a Kinesis Video Streams archived media API,
 * in addition to the HTTP status code and the response body, it includes the following
 * pieces of information:
 *
 * - `x-amz-ErrorType` HTTP header – contains a more specific error
 * type in addition to what the HTTP status code provides.
 *
 * - `x-amz-RequestId` HTTP header – if you want to report an issue to
 * Amazon Web Services, the support team can better diagnose the problem if given the Request
 * Id.
 *
 * Both the HTTP status code and the ErrorType header can be utilized to make
 * programmatic decisions about whether errors are retry-able and under what
 * conditions, as well as provide information on what actions the client programmer
 * might need to take in order to successfully try again.
 *
 * For more information, see the **Errors** section at
 * the bottom of this topic, as well as Common Errors.
 */
export const getMediaForFragmentList: (
  input: GetMediaForFragmentListInput,
) => Effect.Effect<
  GetMediaForFragmentListOutput,
  | ClientLimitExceededException
  | InvalidArgumentException
  | NotAuthorizedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMediaForFragmentListInput,
  output: GetMediaForFragmentListOutput,
  errors: [
    ClientLimitExceededException,
    InvalidArgumentException,
    NotAuthorizedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a list of Fragment objects from the specified stream and
 * timestamp range within the archived data.
 *
 * Listing fragments is eventually consistent. This means that even if the producer
 * receives an acknowledgment that a fragment is persisted, the result might not be
 * returned immediately from a request to `ListFragments`. However, results are
 * typically available in less than one second.
 *
 * You must first call the `GetDataEndpoint` API to get an endpoint.
 * Then send the `ListFragments` requests to this endpoint using the --endpoint-url
 * parameter.
 *
 * If an error is thrown after invoking a Kinesis Video Streams archived media API,
 * in addition to the HTTP status code and the response body, it includes the following
 * pieces of information:
 *
 * - `x-amz-ErrorType` HTTP header – contains a more specific error
 * type in addition to what the HTTP status code provides.
 *
 * - `x-amz-RequestId` HTTP header – if you want to report an issue to
 * Amazon Web Services, the support team can better diagnose the problem if given the Request
 * Id.
 *
 * Both the HTTP status code and the ErrorType header can be utilized to make
 * programmatic decisions about whether errors are retry-able and under what
 * conditions, as well as provide information on what actions the client programmer
 * might need to take in order to successfully try again.
 *
 * For more information, see the **Errors** section at
 * the bottom of this topic, as well as Common Errors.
 */
export const listFragments: {
  (
    input: ListFragmentsInput,
  ): Effect.Effect<
    ListFragmentsOutput,
    | ClientLimitExceededException
    | InvalidArgumentException
    | NotAuthorizedException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFragmentsInput,
  ) => Stream.Stream<
    ListFragmentsOutput,
    | ClientLimitExceededException
    | InvalidArgumentException
    | NotAuthorizedException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFragmentsInput,
  ) => Stream.Stream<
    Fragment,
    | ClientLimitExceededException
    | InvalidArgumentException
    | NotAuthorizedException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFragmentsInput,
  output: ListFragmentsOutput,
  errors: [
    ClientLimitExceededException,
    InvalidArgumentException,
    NotAuthorizedException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Fragments",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves a list of images corresponding to each timestamp for a given time range,
 * sampling interval, and image format configuration.
 */
export const getImages: {
  (
    input: GetImagesInput,
  ): Effect.Effect<
    GetImagesOutput,
    | ClientLimitExceededException
    | InvalidArgumentException
    | NoDataRetentionException
    | NotAuthorizedException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetImagesInput,
  ) => Stream.Stream<
    GetImagesOutput,
    | ClientLimitExceededException
    | InvalidArgumentException
    | NoDataRetentionException
    | NotAuthorizedException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetImagesInput,
  ) => Stream.Stream<
    Image,
    | ClientLimitExceededException
    | InvalidArgumentException
    | NoDataRetentionException
    | NotAuthorizedException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetImagesInput,
  output: GetImagesOutput,
  errors: [
    ClientLimitExceededException,
    InvalidArgumentException,
    NoDataRetentionException,
    NotAuthorizedException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Images",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves an MPEG Dynamic Adaptive Streaming over HTTP (DASH) URL for the stream. You
 * can then open the URL in a media player to view the stream contents.
 *
 * Both the `StreamName` and the `StreamARN` parameters are
 * optional, but you must specify either the `StreamName` or the
 * `StreamARN` when invoking this API operation.
 *
 * An Amazon Kinesis video stream has the following requirements for providing data
 * through MPEG-DASH:
 *
 * - The media must contain h.264 or h.265 encoded video and, optionally, AAC or
 * G.711 encoded audio. Specifically, the codec ID of track 1 should be
 * `V_MPEG/ISO/AVC` (for h.264) or V_MPEGH/ISO/HEVC (for H.265).
 * Optionally, the codec ID of track 2 should be `A_AAC` (for AAC) or
 * A_MS/ACM (for G.711).
 *
 * - Data retention must be greater than 0.
 *
 * - The video track of each fragment must contain codec private data in the
 * Advanced Video Coding (AVC) for H.264 format and HEVC for H.265 format. For more
 * information, see MPEG-4
 * specification ISO/IEC 14496-15. For information about adapting
 * stream data to a given format, see NAL Adaptation Flags.
 *
 * - The audio track (if present) of each fragment must contain codec private data
 * in the AAC format (AAC
 * specification ISO/IEC 13818-7) or the MS
 * Wave format.
 *
 * The following procedure shows how to use MPEG-DASH with Kinesis Video Streams:
 *
 * - Get an endpoint using GetDataEndpoint, specifying
 * `GET_DASH_STREAMING_SESSION_URL` for the `APIName`
 * parameter.
 *
 * - Retrieve the MPEG-DASH URL using `GetDASHStreamingSessionURL`.
 * Kinesis Video Streams creates an MPEG-DASH streaming session to be used for
 * accessing content in a stream using the MPEG-DASH protocol.
 * `GetDASHStreamingSessionURL` returns an authenticated URL (that
 * includes an encrypted session token) for the session's MPEG-DASH
 * *manifest* (the root resource needed for streaming with
 * MPEG-DASH).
 *
 * Don't share or store this token where an unauthorized entity can access
 * it. The token provides access to the content of the stream. Safeguard the
 * token with the same measures that you use with your Amazon Web Services credentials.
 *
 * The media that is made available through the manifest consists only of the
 * requested stream, time range, and format. No other media data (such as frames
 * outside the requested window or alternate bitrates) is made available.
 *
 * - Provide the URL (containing the encrypted session token) for the MPEG-DASH
 * manifest to a media player that supports the MPEG-DASH protocol. Kinesis Video
 * Streams makes the initialization fragment and media fragments available through
 * the manifest URL. The initialization fragment contains the codec private data
 * for the stream, and other data needed to set up the video or audio decoder and
 * renderer. The media fragments contain encoded video frames or encoded audio
 * samples.
 *
 * - The media player receives the authenticated URL and requests stream metadata
 * and media data normally. When the media player requests data, it calls the
 * following actions:
 *
 * - **GetDASHManifest:** Retrieves an MPEG DASH
 * manifest, which contains the metadata for the media that you want to
 * playback.
 *
 * - **GetMP4InitFragment:** Retrieves the MP4
 * initialization fragment. The media player typically loads the
 * initialization fragment before loading any media fragments. This
 * fragment contains the "`fytp`" and "`moov`" MP4
 * atoms, and the child atoms that are needed to initialize the media
 * player decoder.
 *
 * The initialization fragment does not correspond to a fragment in a
 * Kinesis video stream. It contains only the codec private data for the
 * stream and respective track, which the media player needs to decode the
 * media frames.
 *
 * - **GetMP4MediaFragment:** Retrieves MP4
 * media fragments. These fragments contain the "`moof`" and
 * "`mdat`" MP4 atoms and their child atoms, containing the
 * encoded fragment's media frames and their timestamps.
 *
 * After the first media fragment is made available in a streaming
 * session, any fragments that don't contain the same codec private
 * data cause an error to be returned when those different media
 * fragments are loaded. Therefore, the codec private data should not
 * change between fragments in a session. This also means that the
 * session fails if the fragments in a stream change from having only
 * video to having both audio and video.
 *
 * Data retrieved with this action is billable. See Pricing for details.
 *
 * For restrictions that apply to MPEG-DASH sessions, see Kinesis Video Streams Limits.
 *
 * You can monitor the amount of data that the media player consumes by monitoring the
 * `GetMP4MediaFragment.OutgoingBytes` Amazon CloudWatch metric. For
 * information about using CloudWatch to monitor Kinesis Video Streams, see Monitoring Kinesis Video Streams. For pricing information, see Amazon Kinesis Video
 * Streams Pricing and Amazon Web Services
 * Pricing. Charges for both HLS sessions and outgoing Amazon Web Services data apply.
 *
 * For more information about HLS, see HTTP Live Streaming on the
 * Apple Developer site.
 *
 * If an error is thrown after invoking a Kinesis Video Streams archived media API,
 * in addition to the HTTP status code and the response body, it includes the following
 * pieces of information:
 *
 * - `x-amz-ErrorType` HTTP header – contains a more specific error
 * type in addition to what the HTTP status code provides.
 *
 * - `x-amz-RequestId` HTTP header – if you want to report an issue to
 * Amazon Web Services the support team can better diagnose the problem if given the Request
 * Id.
 *
 * Both the HTTP status code and the ErrorType header can be utilized to make
 * programmatic decisions about whether errors are retry-able and under what
 * conditions, as well as provide information on what actions the client programmer
 * might need to take in order to successfully try again.
 *
 * For more information, see the **Errors** section at
 * the bottom of this topic, as well as Common Errors.
 */
export const getDASHStreamingSessionURL: (
  input: GetDASHStreamingSessionURLInput,
) => Effect.Effect<
  GetDASHStreamingSessionURLOutput,
  | ClientLimitExceededException
  | InvalidArgumentException
  | InvalidCodecPrivateDataException
  | MissingCodecPrivateDataException
  | NoDataRetentionException
  | NotAuthorizedException
  | ResourceNotFoundException
  | UnsupportedStreamMediaTypeException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDASHStreamingSessionURLInput,
  output: GetDASHStreamingSessionURLOutput,
  errors: [
    ClientLimitExceededException,
    InvalidArgumentException,
    InvalidCodecPrivateDataException,
    MissingCodecPrivateDataException,
    NoDataRetentionException,
    NotAuthorizedException,
    ResourceNotFoundException,
    UnsupportedStreamMediaTypeException,
  ],
}));
/**
 * Retrieves an HTTP Live Streaming (HLS) URL for the stream. You can then open the URL
 * in a browser or media player to view the stream contents.
 *
 * Both the `StreamName` and the `StreamARN` parameters are
 * optional, but you must specify either the `StreamName` or the
 * `StreamARN` when invoking this API operation.
 *
 * An Amazon Kinesis video stream has the following requirements for providing data
 * through HLS:
 *
 * - For streaming video, the media must contain H.264 or H.265 encoded video and, optionally, AAC
 * encoded audio. Specifically, the codec ID of track 1 should be
 * `V_MPEG/ISO/AVC` (for H.264) or `V_MPEG/ISO/HEVC` (for
 * H.265). Optionally, the codec ID of track 2 should be `A_AAC`. For audio only streaming, the codec ID of track 1 should be
 * `A_AAC`.
 *
 * - Data retention must be greater than 0.
 *
 * - The video track of each fragment must contain codec private data in the
 * Advanced Video Coding (AVC) for H.264 format or HEVC for H.265 format (MPEG-4 specification ISO/IEC
 * 14496-15). For information about adapting stream data to a given
 * format, see NAL Adaptation Flags.
 *
 * - The audio track (if present) of each fragment must contain codec private data
 * in the AAC format (AAC
 * specification ISO/IEC 13818-7).
 *
 * Kinesis Video Streams HLS sessions contain fragments in the fragmented MPEG-4 form
 * (also called fMP4 or CMAF) or the MPEG-2 form (also called TS chunks, which the HLS
 * specification also supports). For more information about HLS fragment types, see the
 * HLS
 * specification.
 *
 * The following procedure shows how to use HLS with Kinesis Video Streams:
 *
 * - Get an endpoint using GetDataEndpoint, specifying
 * `GET_HLS_STREAMING_SESSION_URL` for the `APIName`
 * parameter.
 *
 * - Retrieve the HLS URL using `GetHLSStreamingSessionURL`. Kinesis
 * Video Streams creates an HLS streaming session to be used for accessing content
 * in a stream using the HLS protocol. `GetHLSStreamingSessionURL`
 * returns an authenticated URL (that includes an encrypted session token) for the
 * session's HLS *master playlist* (the root resource needed for
 * streaming with HLS).
 *
 * Don't share or store this token where an unauthorized entity could access
 * it. The token provides access to the content of the stream. Safeguard the
 * token with the same measures that you would use with your Amazon Web Services
 * credentials.
 *
 * The media that is made available through the playlist consists only of the
 * requested stream, time range, and format. No other media data (such as frames
 * outside the requested window or alternate bitrates) is made available.
 *
 * - Provide the URL (containing the encrypted session token) for the HLS master
 * playlist to a media player that supports the HLS protocol. Kinesis Video Streams
 * makes the HLS media playlist, initialization fragment, and media fragments
 * available through the master playlist URL. The initialization fragment contains
 * the codec private data for the stream, and other data needed to set up the video
 * or audio decoder and renderer. The media fragments contain H.264-encoded video
 * frames or AAC-encoded audio samples.
 *
 * - The media player receives the authenticated URL and requests stream metadata
 * and media data normally. When the media player requests data, it calls the
 * following actions:
 *
 * - **GetHLSMasterPlaylist:** Retrieves an HLS
 * master playlist, which contains a URL for the
 * `GetHLSMediaPlaylist` action for each track, and
 * additional metadata for the media player, including estimated bitrate
 * and resolution.
 *
 * - **GetHLSMediaPlaylist:** Retrieves an HLS
 * media playlist, which contains a URL to access the MP4 initialization
 * fragment with the `GetMP4InitFragment` action, and URLs to
 * access the MP4 media fragments with the `GetMP4MediaFragment`
 * actions. The HLS media playlist also contains metadata about the stream
 * that the player needs to play it, such as whether the
 * `PlaybackMode` is `LIVE` or
 * `ON_DEMAND`. The HLS media playlist is typically static
 * for sessions with a `PlaybackType` of `ON_DEMAND`.
 * The HLS media playlist is continually updated with new fragments for
 * sessions with a `PlaybackType` of `LIVE`. There is
 * a distinct HLS media playlist for the video track and the audio track
 * (if applicable) that contains MP4 media URLs for the specific track.
 *
 * - **GetMP4InitFragment:** Retrieves the MP4
 * initialization fragment. The media player typically loads the
 * initialization fragment before loading any media fragments. This
 * fragment contains the "`fytp`" and "`moov`" MP4
 * atoms, and the child atoms that are needed to initialize the media
 * player decoder.
 *
 * The initialization fragment does not correspond to a fragment in a
 * Kinesis video stream. It contains only the codec private data for the
 * stream and respective track, which the media player needs to decode the
 * media frames.
 *
 * - **GetMP4MediaFragment:** Retrieves MP4
 * media fragments. These fragments contain the "`moof`" and
 * "`mdat`" MP4 atoms and their child atoms, containing the
 * encoded fragment's media frames and their timestamps.
 *
 * For the HLS streaming session, in-track codec private data (CPD)
 * changes are supported. After the first media fragment is made
 * available in a streaming session, fragments can contain CPD changes
 * for each track. Therefore, the fragments in a session can have a
 * different resolution, bit rate, or other information in the CPD
 * without interrupting playback. However, any change made in the track
 * number or track codec format can return an error when those
 * different media fragments are loaded. For example, streaming will
 * fail if the fragments in the stream change from having only video to
 * having both audio and video, or if an AAC audio track is changed to
 * an ALAW audio track. For each streaming session, only 500 CPD
 * changes are allowed.
 *
 * Data retrieved with this action is billable. For information, see
 * Pricing.
 *
 * - **GetTSFragment:** Retrieves MPEG TS
 * fragments containing both initialization and media data for all tracks
 * in the stream.
 *
 * If the `ContainerFormat` is `MPEG_TS`, this
 * API is used instead of `GetMP4InitFragment` and
 * `GetMP4MediaFragment` to retrieve stream
 * media.
 *
 * Data retrieved with this action is billable. For more information, see
 * Kinesis Video Streams pricing.
 *
 * A streaming session URL must not be shared between players. The service
 * might throttle a session if multiple media players are sharing it. For
 * connection limits, see Kinesis Video Streams Limits.
 *
 * You can monitor the amount of data that the media player consumes by monitoring the
 * `GetMP4MediaFragment.OutgoingBytes` Amazon CloudWatch metric. For
 * information about using CloudWatch to monitor Kinesis Video Streams, see Monitoring Kinesis Video Streams. For pricing information, see Amazon Kinesis Video
 * Streams Pricing and Amazon Web Services
 * Pricing. Charges for both HLS sessions and outgoing Amazon Web Services data apply.
 *
 * For more information about HLS, see HTTP Live Streaming on the
 * Apple Developer site.
 *
 * If an error is thrown after invoking a Kinesis Video Streams archived media API,
 * in addition to the HTTP status code and the response body, it includes the following
 * pieces of information:
 *
 * - `x-amz-ErrorType` HTTP header – contains a more specific error
 * type in addition to what the HTTP status code provides.
 *
 * - `x-amz-RequestId` HTTP header – if you want to report an issue to
 * Amazon Web Services, the support team can better diagnose the problem if given the Request
 * Id.
 *
 * Both the HTTP status code and the ErrorType header can be utilized to make
 * programmatic decisions about whether errors are retry-able and under what
 * conditions, as well as provide information on what actions the client programmer
 * might need to take in order to successfully try again.
 *
 * For more information, see the **Errors** section at
 * the bottom of this topic, as well as Common Errors.
 */
export const getHLSStreamingSessionURL: (
  input: GetHLSStreamingSessionURLInput,
) => Effect.Effect<
  GetHLSStreamingSessionURLOutput,
  | ClientLimitExceededException
  | InvalidArgumentException
  | InvalidCodecPrivateDataException
  | MissingCodecPrivateDataException
  | NoDataRetentionException
  | NotAuthorizedException
  | ResourceNotFoundException
  | UnsupportedStreamMediaTypeException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetHLSStreamingSessionURLInput,
  output: GetHLSStreamingSessionURLOutput,
  errors: [
    ClientLimitExceededException,
    InvalidArgumentException,
    InvalidCodecPrivateDataException,
    MissingCodecPrivateDataException,
    NoDataRetentionException,
    NotAuthorizedException,
    ResourceNotFoundException,
    UnsupportedStreamMediaTypeException,
  ],
}));
/**
 * Downloads an MP4 file (clip) containing the archived, on-demand media from the
 * specified video stream over the specified time range.
 *
 * Both the StreamName and the StreamARN parameters are optional, but you must specify
 * either the StreamName or the StreamARN when invoking this API operation.
 *
 * As a prerequisite to using GetCLip API, you must obtain an endpoint using
 * `GetDataEndpoint`, specifying GET_CLIP for`` the
 * `APIName` parameter.
 *
 * An Amazon Kinesis video stream has the following requirements for providing data
 * through MP4:
 *
 * - The media must contain h.264 or h.265 encoded video and, optionally, AAC or
 * G.711 encoded audio. Specifically, the codec ID of track 1 should be
 * `V_MPEG/ISO/AVC` (for h.264) or V_MPEGH/ISO/HEVC (for H.265).
 * Optionally, the codec ID of track 2 should be `A_AAC` (for AAC) or
 * A_MS/ACM (for G.711).
 *
 * - Data retention must be greater than 0.
 *
 * - The video track of each fragment must contain codec private data in the
 * Advanced Video Coding (AVC) for H.264 format and HEVC for H.265 format. For more
 * information, see MPEG-4
 * specification ISO/IEC 14496-15. For information about adapting
 * stream data to a given format, see NAL Adaptation Flags.
 *
 * - The audio track (if present) of each fragment must contain codec private data
 * in the AAC format (AAC
 * specification ISO/IEC 13818-7) or the MS
 * Wave format.
 *
 * You can monitor the amount of outgoing data by monitoring the
 * `GetClip.OutgoingBytes` Amazon CloudWatch metric. For information about
 * using CloudWatch to monitor Kinesis Video Streams, see Monitoring Kinesis Video Streams. For pricing information, see Amazon Kinesis Video
 * Streams Pricing and Amazon Web Services
 * Pricing. Charges for outgoing Amazon Web Services data apply.
 */
export const getClip: (
  input: GetClipInput,
) => Effect.Effect<
  GetClipOutput,
  | ClientLimitExceededException
  | InvalidArgumentException
  | InvalidCodecPrivateDataException
  | InvalidMediaFrameException
  | MissingCodecPrivateDataException
  | NoDataRetentionException
  | NotAuthorizedException
  | ResourceNotFoundException
  | UnsupportedStreamMediaTypeException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetClipInput,
  output: GetClipOutput,
  errors: [
    ClientLimitExceededException,
    InvalidArgumentException,
    InvalidCodecPrivateDataException,
    InvalidMediaFrameException,
    MissingCodecPrivateDataException,
    NoDataRetentionException,
    NotAuthorizedException,
    ResourceNotFoundException,
    UnsupportedStreamMediaTypeException,
  ],
}));
