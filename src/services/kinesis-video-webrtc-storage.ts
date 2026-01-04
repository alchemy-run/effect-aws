import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Kinesis Video WebRTC Storage",
  serviceShapeName: "AWSAcuityRoutingServiceLambda",
});
const auth = T.AwsAuthSigv4({ name: "kinesisvideo" });
const ver = T.ServiceVersion("2018-05-10");
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
                                url: "https://kinesisvideo-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://kinesisvideo-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://kinesisvideo.{Region}.{PartitionResult#dualStackDnsSuffix}",
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

//# Schemas
export class JoinStorageSessionInput extends S.Class<JoinStorageSessionInput>(
  "JoinStorageSessionInput",
)(
  { channelArn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/joinStorageSession" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class JoinStorageSessionResponse extends S.Class<JoinStorageSessionResponse>(
  "JoinStorageSessionResponse",
)({}) {}
export class JoinStorageSessionAsViewerInput extends S.Class<JoinStorageSessionAsViewerInput>(
  "JoinStorageSessionAsViewerInput",
)(
  { channelArn: S.String, clientId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/joinStorageSessionAsViewer" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class JoinStorageSessionAsViewerResponse extends S.Class<JoinStorageSessionAsViewerResponse>(
  "JoinStorageSessionAsViewerResponse",
)({}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class ClientLimitExceededException extends S.TaggedError<ClientLimitExceededException>()(
  "ClientLimitExceededException",
  {},
) {}
export class InvalidArgumentException extends S.TaggedError<InvalidArgumentException>()(
  "InvalidArgumentException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}

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
export const joinStorageSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const joinStorageSessionAsViewer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: JoinStorageSessionAsViewerInput,
    output: JoinStorageSessionAsViewerResponse,
    errors: [
      AccessDeniedException,
      ClientLimitExceededException,
      InvalidArgumentException,
      ResourceNotFoundException,
    ],
  }),
);
