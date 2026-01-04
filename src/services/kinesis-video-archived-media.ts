import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Kinesis Video Archived Media",
  serviceShapeName: "AWSAcuityReader",
});
const auth = T.AwsAuthSigv4({ name: "kinesisvideo" });
const ver = T.ServiceVersion("2017-09-30");
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
                        url: "https://kinesisvideo-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://kinesisvideo-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://kinesisvideo.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://kinesisvideo.{Region}.{PartitionResult#dnsSuffix}",
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
export const FragmentNumberList = S.Array(S.String);
export class GetMediaForFragmentListInput extends S.Class<GetMediaForFragmentListInput>(
  "GetMediaForFragmentListInput",
)(
  {
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    Fragments: FragmentNumberList,
  },
  T.all(
    T.Http({ method: "POST", uri: "/getMediaForFragmentList" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const FormatConfig = S.Record({ key: S.String, value: S.String });
export class GetImagesInput extends S.Class<GetImagesInput>("GetImagesInput")(
  {
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
  },
  T.all(
    T.Http({ method: "POST", uri: "/getImages" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMediaForFragmentListOutput extends S.Class<GetMediaForFragmentListOutput>(
  "GetMediaForFragmentListOutput",
)({
  ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  Payload: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
}) {}
export class ClipTimestampRange extends S.Class<ClipTimestampRange>(
  "ClipTimestampRange",
)({
  StartTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class DASHTimestampRange extends S.Class<DASHTimestampRange>(
  "DASHTimestampRange",
)({
  StartTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class HLSTimestampRange extends S.Class<HLSTimestampRange>(
  "HLSTimestampRange",
)({
  StartTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class TimestampRange extends S.Class<TimestampRange>("TimestampRange")({
  StartTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class ClipFragmentSelector extends S.Class<ClipFragmentSelector>(
  "ClipFragmentSelector",
)({ FragmentSelectorType: S.String, TimestampRange: ClipTimestampRange }) {}
export class DASHFragmentSelector extends S.Class<DASHFragmentSelector>(
  "DASHFragmentSelector",
)({
  FragmentSelectorType: S.optional(S.String),
  TimestampRange: S.optional(DASHTimestampRange),
}) {}
export class HLSFragmentSelector extends S.Class<HLSFragmentSelector>(
  "HLSFragmentSelector",
)({
  FragmentSelectorType: S.optional(S.String),
  TimestampRange: S.optional(HLSTimestampRange),
}) {}
export class FragmentSelector extends S.Class<FragmentSelector>(
  "FragmentSelector",
)({ FragmentSelectorType: S.String, TimestampRange: TimestampRange }) {}
export class GetClipInput extends S.Class<GetClipInput>("GetClipInput")(
  {
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    ClipFragmentSelector: ClipFragmentSelector,
  },
  T.all(
    T.Http({ method: "POST", uri: "/getClip" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDASHStreamingSessionURLInput extends S.Class<GetDASHStreamingSessionURLInput>(
  "GetDASHStreamingSessionURLInput",
)(
  {
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    PlaybackMode: S.optional(S.String),
    DisplayFragmentTimestamp: S.optional(S.String),
    DisplayFragmentNumber: S.optional(S.String),
    DASHFragmentSelector: S.optional(DASHFragmentSelector),
    Expires: S.optional(S.Number),
    MaxManifestFragmentResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/getDASHStreamingSessionURL" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetHLSStreamingSessionURLInput extends S.Class<GetHLSStreamingSessionURLInput>(
  "GetHLSStreamingSessionURLInput",
)(
  {
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    PlaybackMode: S.optional(S.String),
    HLSFragmentSelector: S.optional(HLSFragmentSelector),
    ContainerFormat: S.optional(S.String),
    DiscontinuityMode: S.optional(S.String),
    DisplayFragmentTimestamp: S.optional(S.String),
    Expires: S.optional(S.Number),
    MaxMediaPlaylistFragmentResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/getHLSStreamingSessionURL" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFragmentsInput extends S.Class<ListFragmentsInput>(
  "ListFragmentsInput",
)(
  {
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    FragmentSelector: S.optional(FragmentSelector),
  },
  T.all(
    T.Http({ method: "POST", uri: "/listFragments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Image extends S.Class<Image>("Image")({
  TimeStamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Error: S.optional(S.String),
  ImageContent: S.optional(S.String),
}) {}
export const Images = S.Array(Image);
export class GetClipOutput extends S.Class<GetClipOutput>("GetClipOutput")({
  ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  Payload: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
}) {}
export class GetDASHStreamingSessionURLOutput extends S.Class<GetDASHStreamingSessionURLOutput>(
  "GetDASHStreamingSessionURLOutput",
)({ DASHStreamingSessionURL: S.optional(S.String) }) {}
export class GetHLSStreamingSessionURLOutput extends S.Class<GetHLSStreamingSessionURLOutput>(
  "GetHLSStreamingSessionURLOutput",
)({ HLSStreamingSessionURL: S.optional(S.String) }) {}
export class GetImagesOutput extends S.Class<GetImagesOutput>(
  "GetImagesOutput",
)({ Images: S.optional(Images), NextToken: S.optional(S.String) }) {}
export class Fragment extends S.Class<Fragment>("Fragment")({
  FragmentNumber: S.optional(S.String),
  FragmentSizeInBytes: S.optional(S.Number),
  ProducerTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ServerTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FragmentLengthInMilliseconds: S.optional(S.Number),
}) {}
export const FragmentList = S.Array(Fragment);
export class ListFragmentsOutput extends S.Class<ListFragmentsOutput>(
  "ListFragmentsOutput",
)({ Fragments: S.optional(FragmentList), NextToken: S.optional(S.String) }) {}

//# Errors
export class ClientLimitExceededException extends S.TaggedError<ClientLimitExceededException>()(
  "ClientLimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class InvalidArgumentException extends S.TaggedError<InvalidArgumentException>()(
  "InvalidArgumentException",
  {},
) {}
export class InvalidCodecPrivateDataException extends S.TaggedError<InvalidCodecPrivateDataException>()(
  "InvalidCodecPrivateDataException",
  {},
) {}
export class MissingCodecPrivateDataException extends S.TaggedError<MissingCodecPrivateDataException>()(
  "MissingCodecPrivateDataException",
  {},
) {}
export class NoDataRetentionException extends S.TaggedError<NoDataRetentionException>()(
  "NoDataRetentionException",
  {},
) {}
export class NotAuthorizedException extends S.TaggedError<NotAuthorizedException>()(
  "NotAuthorizedException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class UnsupportedStreamMediaTypeException extends S.TaggedError<UnsupportedStreamMediaTypeException>()(
  "UnsupportedStreamMediaTypeException",
  {},
) {}
export class InvalidMediaFrameException extends S.TaggedError<InvalidMediaFrameException>()(
  "InvalidMediaFrameException",
  { Message: S.optional(S.String) },
) {}

//# Operations
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
export const getHLSStreamingSessionURL = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Retrieves a list of images corresponding to each timestamp for a given time range,
 * sampling interval, and image format configuration.
 */
export const getImages = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetImagesInput,
  output: GetImagesOutput,
  errors: [
    ClientLimitExceededException,
    InvalidArgumentException,
    NoDataRetentionException,
    NotAuthorizedException,
    ResourceNotFoundException,
  ],
}));
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
export const getMediaForFragmentList = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetMediaForFragmentListInput,
    output: GetMediaForFragmentListOutput,
    errors: [
      ClientLimitExceededException,
      InvalidArgumentException,
      NotAuthorizedException,
      ResourceNotFoundException,
    ],
  }),
);
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
export const listFragments = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFragmentsInput,
  output: ListFragmentsOutput,
  errors: [
    ClientLimitExceededException,
    InvalidArgumentException,
    NotAuthorizedException,
    ResourceNotFoundException,
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
export const getClip = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDASHStreamingSessionURL = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
