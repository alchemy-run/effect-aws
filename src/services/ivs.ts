import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "ivs",
  serviceShapeName: "AmazonInteractiveVideoService",
});
const auth = T.AwsAuthSigv4({ name: "ivs" });
const ver = T.ServiceVersion("2020-07-14");
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
                        url: "https://ivs-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://ivs-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://ivs.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://ivs.{Region}.{PartitionResult#dnsSuffix}",
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
export const ChannelArnList = S.Array(S.String);
export const StreamKeyArnList = S.Array(S.String);
export const PlaybackRestrictionPolicyAllowedCountryList = S.Array(S.String);
export const PlaybackRestrictionPolicyAllowedOriginList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class BatchGetChannelRequest extends S.Class<BatchGetChannelRequest>(
  "BatchGetChannelRequest",
)(
  { arns: ChannelArnList },
  T.all(
    T.Http({ method: "POST", uri: "/BatchGetChannel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetStreamKeyRequest extends S.Class<BatchGetStreamKeyRequest>(
  "BatchGetStreamKeyRequest",
)(
  { arns: StreamKeyArnList },
  T.all(
    T.Http({ method: "POST", uri: "/BatchGetStreamKey" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export class CreatePlaybackRestrictionPolicyRequest extends S.Class<CreatePlaybackRestrictionPolicyRequest>(
  "CreatePlaybackRestrictionPolicyRequest",
)(
  {
    allowedCountries: S.optional(PlaybackRestrictionPolicyAllowedCountryList),
    allowedOrigins: S.optional(PlaybackRestrictionPolicyAllowedOriginList),
    enableStrictOriginEnforcement: S.optional(S.Boolean),
    name: S.optional(S.String),
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreatePlaybackRestrictionPolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateStreamKeyRequest extends S.Class<CreateStreamKeyRequest>(
  "CreateStreamKeyRequest",
)(
  { channelArn: S.String, tags: S.optional(Tags) },
  T.all(
    T.Http({ method: "POST", uri: "/CreateStreamKey" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteChannelRequest extends S.Class<DeleteChannelRequest>(
  "DeleteChannelRequest",
)(
  { arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteChannel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteChannelResponse extends S.Class<DeleteChannelResponse>(
  "DeleteChannelResponse",
)({}) {}
export class DeletePlaybackKeyPairRequest extends S.Class<DeletePlaybackKeyPairRequest>(
  "DeletePlaybackKeyPairRequest",
)(
  { arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeletePlaybackKeyPair" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePlaybackKeyPairResponse extends S.Class<DeletePlaybackKeyPairResponse>(
  "DeletePlaybackKeyPairResponse",
)({}) {}
export class DeletePlaybackRestrictionPolicyRequest extends S.Class<DeletePlaybackRestrictionPolicyRequest>(
  "DeletePlaybackRestrictionPolicyRequest",
)(
  { arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeletePlaybackRestrictionPolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePlaybackRestrictionPolicyResponse extends S.Class<DeletePlaybackRestrictionPolicyResponse>(
  "DeletePlaybackRestrictionPolicyResponse",
)({}) {}
export class DeleteRecordingConfigurationRequest extends S.Class<DeleteRecordingConfigurationRequest>(
  "DeleteRecordingConfigurationRequest",
)(
  { arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteRecordingConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRecordingConfigurationResponse extends S.Class<DeleteRecordingConfigurationResponse>(
  "DeleteRecordingConfigurationResponse",
)({}) {}
export class DeleteStreamKeyRequest extends S.Class<DeleteStreamKeyRequest>(
  "DeleteStreamKeyRequest",
)(
  { arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteStreamKey" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteStreamKeyResponse extends S.Class<DeleteStreamKeyResponse>(
  "DeleteStreamKeyResponse",
)({}) {}
export class GetChannelRequest extends S.Class<GetChannelRequest>(
  "GetChannelRequest",
)(
  { arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetChannel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPlaybackKeyPairRequest extends S.Class<GetPlaybackKeyPairRequest>(
  "GetPlaybackKeyPairRequest",
)(
  { arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetPlaybackKeyPair" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPlaybackRestrictionPolicyRequest extends S.Class<GetPlaybackRestrictionPolicyRequest>(
  "GetPlaybackRestrictionPolicyRequest",
)(
  { arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetPlaybackRestrictionPolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRecordingConfigurationRequest extends S.Class<GetRecordingConfigurationRequest>(
  "GetRecordingConfigurationRequest",
)(
  { arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetRecordingConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetStreamRequest extends S.Class<GetStreamRequest>(
  "GetStreamRequest",
)(
  { channelArn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetStream" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetStreamKeyRequest extends S.Class<GetStreamKeyRequest>(
  "GetStreamKeyRequest",
)(
  { arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetStreamKey" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetStreamSessionRequest extends S.Class<GetStreamSessionRequest>(
  "GetStreamSessionRequest",
)(
  { channelArn: S.String, streamId: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/GetStreamSession" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ImportPlaybackKeyPairRequest extends S.Class<ImportPlaybackKeyPairRequest>(
  "ImportPlaybackKeyPairRequest",
)(
  {
    publicKeyMaterial: S.String,
    name: S.optional(S.String),
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ImportPlaybackKeyPair" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListChannelsRequest extends S.Class<ListChannelsRequest>(
  "ListChannelsRequest",
)(
  {
    filterByName: S.optional(S.String),
    filterByRecordingConfigurationArn: S.optional(S.String),
    filterByPlaybackRestrictionPolicyArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListChannels" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPlaybackKeyPairsRequest extends S.Class<ListPlaybackKeyPairsRequest>(
  "ListPlaybackKeyPairsRequest",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(
    T.Http({ method: "POST", uri: "/ListPlaybackKeyPairs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPlaybackRestrictionPoliciesRequest extends S.Class<ListPlaybackRestrictionPoliciesRequest>(
  "ListPlaybackRestrictionPoliciesRequest",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(
    T.Http({ method: "POST", uri: "/ListPlaybackRestrictionPolicies" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRecordingConfigurationsRequest extends S.Class<ListRecordingConfigurationsRequest>(
  "ListRecordingConfigurationsRequest",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(
    T.Http({ method: "POST", uri: "/ListRecordingConfigurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListStreamKeysRequest extends S.Class<ListStreamKeysRequest>(
  "ListStreamKeysRequest",
)(
  {
    channelArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListStreamKeys" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListStreamSessionsRequest extends S.Class<ListStreamSessionsRequest>(
  "ListStreamSessionsRequest",
)(
  {
    channelArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListStreamSessions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutMetadataRequest extends S.Class<PutMetadataRequest>(
  "PutMetadataRequest",
)(
  { channelArn: S.String, metadata: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/PutMetadata" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutMetadataResponse extends S.Class<PutMetadataResponse>(
  "PutMetadataResponse",
)({}) {}
export class StartViewerSessionRevocationRequest extends S.Class<StartViewerSessionRevocationRequest>(
  "StartViewerSessionRevocationRequest",
)(
  {
    channelArn: S.String,
    viewerId: S.String,
    viewerSessionVersionsLessThanOrEqualTo: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/StartViewerSessionRevocation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartViewerSessionRevocationResponse extends S.Class<StartViewerSessionRevocationResponse>(
  "StartViewerSessionRevocationResponse",
)({}) {}
export class StopStreamRequest extends S.Class<StopStreamRequest>(
  "StopStreamRequest",
)(
  { channelArn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/StopStream" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopStreamResponse extends S.Class<StopStreamResponse>(
  "StopStreamResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()), tags: Tags },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel()),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class MultitrackInputConfiguration extends S.Class<MultitrackInputConfiguration>(
  "MultitrackInputConfiguration",
)({
  enabled: S.optional(S.Boolean),
  policy: S.optional(S.String),
  maximumResolution: S.optional(S.String),
}) {}
export class UpdateChannelRequest extends S.Class<UpdateChannelRequest>(
  "UpdateChannelRequest",
)(
  {
    arn: S.String,
    name: S.optional(S.String),
    latencyMode: S.optional(S.String),
    type: S.optional(S.String),
    authorized: S.optional(S.Boolean),
    recordingConfigurationArn: S.optional(S.String),
    insecureIngest: S.optional(S.Boolean),
    preset: S.optional(S.String),
    playbackRestrictionPolicyArn: S.optional(S.String),
    multitrackInputConfiguration: S.optional(MultitrackInputConfiguration),
    containerFormat: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateChannel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePlaybackRestrictionPolicyRequest extends S.Class<UpdatePlaybackRestrictionPolicyRequest>(
  "UpdatePlaybackRestrictionPolicyRequest",
)(
  {
    arn: S.String,
    allowedCountries: S.optional(PlaybackRestrictionPolicyAllowedCountryList),
    allowedOrigins: S.optional(PlaybackRestrictionPolicyAllowedOriginList),
    enableStrictOriginEnforcement: S.optional(S.Boolean),
    name: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/UpdatePlaybackRestrictionPolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ThumbnailConfigurationStorageList = S.Array(S.String);
export const RenditionConfigurationRenditionList = S.Array(S.String);
export class BatchStartViewerSessionRevocationViewerSession extends S.Class<BatchStartViewerSessionRevocationViewerSession>(
  "BatchStartViewerSessionRevocationViewerSession",
)({
  channelArn: S.String,
  viewerId: S.String,
  viewerSessionVersionsLessThanOrEqualTo: S.optional(S.Number),
}) {}
export const BatchStartViewerSessionRevocationViewerSessionList = S.Array(
  BatchStartViewerSessionRevocationViewerSession,
);
export class ThumbnailConfiguration extends S.Class<ThumbnailConfiguration>(
  "ThumbnailConfiguration",
)({
  recordingMode: S.optional(S.String),
  targetIntervalSeconds: S.optional(S.Number),
  resolution: S.optional(S.String),
  storage: S.optional(ThumbnailConfigurationStorageList),
}) {}
export class RenditionConfiguration extends S.Class<RenditionConfiguration>(
  "RenditionConfiguration",
)({
  renditionSelection: S.optional(S.String),
  renditions: S.optional(RenditionConfigurationRenditionList),
}) {}
export class StreamFilters extends S.Class<StreamFilters>("StreamFilters")({
  health: S.optional(S.String),
}) {}
export class BatchStartViewerSessionRevocationRequest extends S.Class<BatchStartViewerSessionRevocationRequest>(
  "BatchStartViewerSessionRevocationRequest",
)(
  { viewerSessions: BatchStartViewerSessionRevocationViewerSessionList },
  T.all(
    T.Http({ method: "POST", uri: "/BatchStartViewerSessionRevocation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateChannelRequest extends S.Class<CreateChannelRequest>(
  "CreateChannelRequest",
)(
  {
    name: S.optional(S.String),
    latencyMode: S.optional(S.String),
    type: S.optional(S.String),
    authorized: S.optional(S.Boolean),
    recordingConfigurationArn: S.optional(S.String),
    tags: S.optional(Tags),
    insecureIngest: S.optional(S.Boolean),
    preset: S.optional(S.String),
    playbackRestrictionPolicyArn: S.optional(S.String),
    multitrackInputConfiguration: S.optional(MultitrackInputConfiguration),
    containerFormat: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateChannel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StreamKey extends S.Class<StreamKey>("StreamKey")({
  arn: S.optional(S.String),
  value: S.optional(S.String),
  channelArn: S.optional(S.String),
  tags: S.optional(Tags),
}) {}
export class CreateStreamKeyResponse extends S.Class<CreateStreamKeyResponse>(
  "CreateStreamKeyResponse",
)({ streamKey: S.optional(StreamKey) }) {}
export class Srt extends S.Class<Srt>("Srt")({
  endpoint: S.optional(S.String),
  passphrase: S.optional(S.String),
}) {}
export class Channel extends S.Class<Channel>("Channel")({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  latencyMode: S.optional(S.String),
  type: S.optional(S.String),
  recordingConfigurationArn: S.optional(S.String),
  ingestEndpoint: S.optional(S.String),
  playbackUrl: S.optional(S.String),
  authorized: S.optional(S.Boolean),
  tags: S.optional(Tags),
  insecureIngest: S.optional(S.Boolean),
  preset: S.optional(S.String),
  srt: S.optional(Srt),
  playbackRestrictionPolicyArn: S.optional(S.String),
  multitrackInputConfiguration: S.optional(MultitrackInputConfiguration),
  containerFormat: S.optional(S.String),
}) {}
export class GetChannelResponse extends S.Class<GetChannelResponse>(
  "GetChannelResponse",
)({ channel: S.optional(Channel) }) {}
export class PlaybackRestrictionPolicy extends S.Class<PlaybackRestrictionPolicy>(
  "PlaybackRestrictionPolicy",
)({
  arn: S.String,
  allowedCountries: PlaybackRestrictionPolicyAllowedCountryList,
  allowedOrigins: PlaybackRestrictionPolicyAllowedOriginList,
  enableStrictOriginEnforcement: S.optional(S.Boolean),
  name: S.optional(S.String),
  tags: S.optional(Tags),
}) {}
export class GetPlaybackRestrictionPolicyResponse extends S.Class<GetPlaybackRestrictionPolicyResponse>(
  "GetPlaybackRestrictionPolicyResponse",
)({ playbackRestrictionPolicy: S.optional(PlaybackRestrictionPolicy) }) {}
export class GetStreamKeyResponse extends S.Class<GetStreamKeyResponse>(
  "GetStreamKeyResponse",
)({ streamKey: S.optional(StreamKey) }) {}
export class PlaybackKeyPair extends S.Class<PlaybackKeyPair>(
  "PlaybackKeyPair",
)({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  fingerprint: S.optional(S.String),
  tags: S.optional(Tags),
}) {}
export class ImportPlaybackKeyPairResponse extends S.Class<ImportPlaybackKeyPairResponse>(
  "ImportPlaybackKeyPairResponse",
)({ keyPair: S.optional(PlaybackKeyPair) }) {}
export class ListStreamsRequest extends S.Class<ListStreamsRequest>(
  "ListStreamsRequest",
)(
  {
    filterBy: S.optional(StreamFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListStreams" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: Tags }) {}
export class UpdateChannelResponse extends S.Class<UpdateChannelResponse>(
  "UpdateChannelResponse",
)({ channel: S.optional(Channel) }) {}
export class UpdatePlaybackRestrictionPolicyResponse extends S.Class<UpdatePlaybackRestrictionPolicyResponse>(
  "UpdatePlaybackRestrictionPolicyResponse",
)({ playbackRestrictionPolicy: S.optional(PlaybackRestrictionPolicy) }) {}
export class S3DestinationConfiguration extends S.Class<S3DestinationConfiguration>(
  "S3DestinationConfiguration",
)({ bucketName: S.String }) {}
export class BatchError extends S.Class<BatchError>("BatchError")({
  arn: S.optional(S.String),
  code: S.optional(S.String),
  message: S.optional(S.String),
}) {}
export const BatchErrors = S.Array(BatchError);
export const StreamKeys = S.Array(StreamKey);
export class DestinationConfiguration extends S.Class<DestinationConfiguration>(
  "DestinationConfiguration",
)({ s3: S.optional(S3DestinationConfiguration) }) {}
export class RecordingConfiguration extends S.Class<RecordingConfiguration>(
  "RecordingConfiguration",
)({
  arn: S.String,
  name: S.optional(S.String),
  destinationConfiguration: DestinationConfiguration,
  state: S.String,
  tags: S.optional(Tags),
  thumbnailConfiguration: S.optional(ThumbnailConfiguration),
  recordingReconnectWindowSeconds: S.optional(S.Number),
  renditionConfiguration: S.optional(RenditionConfiguration),
}) {}
export class Stream extends S.Class<Stream>("Stream")({
  channelArn: S.optional(S.String),
  streamId: S.optional(S.String),
  playbackUrl: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  state: S.optional(S.String),
  health: S.optional(S.String),
  viewerCount: S.optional(S.Number),
}) {}
export class ChannelSummary extends S.Class<ChannelSummary>("ChannelSummary")({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  latencyMode: S.optional(S.String),
  authorized: S.optional(S.Boolean),
  recordingConfigurationArn: S.optional(S.String),
  tags: S.optional(Tags),
  insecureIngest: S.optional(S.Boolean),
  type: S.optional(S.String),
  preset: S.optional(S.String),
  playbackRestrictionPolicyArn: S.optional(S.String),
}) {}
export const ChannelList = S.Array(ChannelSummary);
export class PlaybackKeyPairSummary extends S.Class<PlaybackKeyPairSummary>(
  "PlaybackKeyPairSummary",
)({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  tags: S.optional(Tags),
}) {}
export const PlaybackKeyPairList = S.Array(PlaybackKeyPairSummary);
export class PlaybackRestrictionPolicySummary extends S.Class<PlaybackRestrictionPolicySummary>(
  "PlaybackRestrictionPolicySummary",
)({
  arn: S.String,
  allowedCountries: PlaybackRestrictionPolicyAllowedCountryList,
  allowedOrigins: PlaybackRestrictionPolicyAllowedOriginList,
  enableStrictOriginEnforcement: S.optional(S.Boolean),
  name: S.optional(S.String),
  tags: S.optional(Tags),
}) {}
export const PlaybackRestrictionPolicyList = S.Array(
  PlaybackRestrictionPolicySummary,
);
export class RecordingConfigurationSummary extends S.Class<RecordingConfigurationSummary>(
  "RecordingConfigurationSummary",
)({
  arn: S.String,
  name: S.optional(S.String),
  destinationConfiguration: DestinationConfiguration,
  state: S.String,
  tags: S.optional(Tags),
}) {}
export const RecordingConfigurationList = S.Array(
  RecordingConfigurationSummary,
);
export class StreamKeySummary extends S.Class<StreamKeySummary>(
  "StreamKeySummary",
)({
  arn: S.optional(S.String),
  channelArn: S.optional(S.String),
  tags: S.optional(Tags),
}) {}
export const StreamKeyList = S.Array(StreamKeySummary);
export class StreamSessionSummary extends S.Class<StreamSessionSummary>(
  "StreamSessionSummary",
)({
  streamId: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  hasErrorEvent: S.optional(S.Boolean),
}) {}
export const StreamSessionList = S.Array(StreamSessionSummary);
export class VideoConfiguration extends S.Class<VideoConfiguration>(
  "VideoConfiguration",
)({
  avcProfile: S.optional(S.String),
  avcLevel: S.optional(S.String),
  codec: S.optional(S.String),
  encoder: S.optional(S.String),
  targetBitrate: S.optional(S.Number),
  targetFramerate: S.optional(S.Number),
  videoHeight: S.optional(S.Number),
  videoWidth: S.optional(S.Number),
  level: S.optional(S.String),
  track: S.optional(S.String),
  profile: S.optional(S.String),
}) {}
export const VideoConfigurationList = S.Array(VideoConfiguration);
export class AudioConfiguration extends S.Class<AudioConfiguration>(
  "AudioConfiguration",
)({
  codec: S.optional(S.String),
  targetBitrate: S.optional(S.Number),
  sampleRate: S.optional(S.Number),
  channels: S.optional(S.Number),
  track: S.optional(S.String),
}) {}
export const AudioConfigurationList = S.Array(AudioConfiguration);
export class BatchGetStreamKeyResponse extends S.Class<BatchGetStreamKeyResponse>(
  "BatchGetStreamKeyResponse",
)({ streamKeys: S.optional(StreamKeys), errors: S.optional(BatchErrors) }) {}
export class CreateChannelResponse extends S.Class<CreateChannelResponse>(
  "CreateChannelResponse",
)({ channel: S.optional(Channel), streamKey: S.optional(StreamKey) }) {}
export class CreatePlaybackRestrictionPolicyResponse extends S.Class<CreatePlaybackRestrictionPolicyResponse>(
  "CreatePlaybackRestrictionPolicyResponse",
)({ playbackRestrictionPolicy: S.optional(PlaybackRestrictionPolicy) }) {}
export class CreateRecordingConfigurationRequest extends S.Class<CreateRecordingConfigurationRequest>(
  "CreateRecordingConfigurationRequest",
)(
  {
    name: S.optional(S.String),
    destinationConfiguration: DestinationConfiguration,
    tags: S.optional(Tags),
    thumbnailConfiguration: S.optional(ThumbnailConfiguration),
    recordingReconnectWindowSeconds: S.optional(S.Number),
    renditionConfiguration: S.optional(RenditionConfiguration),
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateRecordingConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPlaybackKeyPairResponse extends S.Class<GetPlaybackKeyPairResponse>(
  "GetPlaybackKeyPairResponse",
)({ keyPair: S.optional(PlaybackKeyPair) }) {}
export class GetRecordingConfigurationResponse extends S.Class<GetRecordingConfigurationResponse>(
  "GetRecordingConfigurationResponse",
)({ recordingConfiguration: S.optional(RecordingConfiguration) }) {}
export class GetStreamResponse extends S.Class<GetStreamResponse>(
  "GetStreamResponse",
)({ stream: S.optional(Stream) }) {}
export class ListChannelsResponse extends S.Class<ListChannelsResponse>(
  "ListChannelsResponse",
)({ channels: ChannelList, nextToken: S.optional(S.String) }) {}
export class ListPlaybackKeyPairsResponse extends S.Class<ListPlaybackKeyPairsResponse>(
  "ListPlaybackKeyPairsResponse",
)({ keyPairs: PlaybackKeyPairList, nextToken: S.optional(S.String) }) {}
export class ListPlaybackRestrictionPoliciesResponse extends S.Class<ListPlaybackRestrictionPoliciesResponse>(
  "ListPlaybackRestrictionPoliciesResponse",
)({
  playbackRestrictionPolicies: PlaybackRestrictionPolicyList,
  nextToken: S.optional(S.String),
}) {}
export class ListRecordingConfigurationsResponse extends S.Class<ListRecordingConfigurationsResponse>(
  "ListRecordingConfigurationsResponse",
)({
  recordingConfigurations: RecordingConfigurationList,
  nextToken: S.optional(S.String),
}) {}
export class ListStreamKeysResponse extends S.Class<ListStreamKeysResponse>(
  "ListStreamKeysResponse",
)({ streamKeys: StreamKeyList, nextToken: S.optional(S.String) }) {}
export class ListStreamSessionsResponse extends S.Class<ListStreamSessionsResponse>(
  "ListStreamSessionsResponse",
)({ streamSessions: StreamSessionList, nextToken: S.optional(S.String) }) {}
export class IngestConfigurations extends S.Class<IngestConfigurations>(
  "IngestConfigurations",
)({
  videoConfigurations: VideoConfigurationList,
  audioConfigurations: AudioConfigurationList,
}) {}
export class StreamEvent extends S.Class<StreamEvent>("StreamEvent")({
  name: S.optional(S.String),
  type: S.optional(S.String),
  eventTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  code: S.optional(S.String),
}) {}
export const StreamEvents = S.Array(StreamEvent);
export const Channels = S.Array(Channel);
export class BatchStartViewerSessionRevocationError extends S.Class<BatchStartViewerSessionRevocationError>(
  "BatchStartViewerSessionRevocationError",
)({
  channelArn: S.String,
  viewerId: S.String,
  code: S.optional(S.String),
  message: S.optional(S.String),
}) {}
export const BatchStartViewerSessionRevocationErrors = S.Array(
  BatchStartViewerSessionRevocationError,
);
export class StreamSummary extends S.Class<StreamSummary>("StreamSummary")({
  channelArn: S.optional(S.String),
  streamId: S.optional(S.String),
  state: S.optional(S.String),
  health: S.optional(S.String),
  viewerCount: S.optional(S.Number),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const StreamList = S.Array(StreamSummary);
export class BatchGetChannelResponse extends S.Class<BatchGetChannelResponse>(
  "BatchGetChannelResponse",
)({ channels: S.optional(Channels), errors: S.optional(BatchErrors) }) {}
export class BatchStartViewerSessionRevocationResponse extends S.Class<BatchStartViewerSessionRevocationResponse>(
  "BatchStartViewerSessionRevocationResponse",
)({ errors: S.optional(BatchStartViewerSessionRevocationErrors) }) {}
export class CreateRecordingConfigurationResponse extends S.Class<CreateRecordingConfigurationResponse>(
  "CreateRecordingConfigurationResponse",
)({ recordingConfiguration: S.optional(RecordingConfiguration) }) {}
export class ListStreamsResponse extends S.Class<ListStreamsResponse>(
  "ListStreamsResponse",
)({ streams: StreamList, nextToken: S.optional(S.String) }) {}
export class IngestConfiguration extends S.Class<IngestConfiguration>(
  "IngestConfiguration",
)({
  video: S.optional(VideoConfiguration),
  audio: S.optional(AudioConfiguration),
}) {}
export class StreamSession extends S.Class<StreamSession>("StreamSession")({
  streamId: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  channel: S.optional(Channel),
  ingestConfiguration: S.optional(IngestConfiguration),
  ingestConfigurations: S.optional(IngestConfigurations),
  recordingConfiguration: S.optional(RecordingConfiguration),
  truncatedEvents: S.optional(StreamEvents),
}) {}
export class GetStreamSessionResponse extends S.Class<GetStreamSessionResponse>(
  "GetStreamSessionResponse",
)({ streamSession: S.optional(StreamSession) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class PendingVerification extends S.TaggedError<PendingVerification>()(
  "PendingVerification",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ChannelNotBroadcasting extends S.TaggedError<ChannelNotBroadcasting>()(
  "ChannelNotBroadcasting",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class StreamUnavailable extends S.TaggedError<StreamUnavailable>()(
  "StreamUnavailable",
  { exceptionMessage: S.optional(S.String) },
) {}

//# Operations
/**
 * Removes tags from the resource with the specified ARN.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified channel and its associated stream keys.
 *
 * If you try to delete a live channel, you will get an error (409 ConflictException). To
 * delete a channel that is live, call StopStream, wait for the Amazon
 * EventBridge "Stream End" event (to verify that the stream's state is no longer Live), then
 * call DeleteChannel. (See Using EventBridge with Amazon IVS.)
 */
export const deleteChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChannelRequest,
  output: DeleteChannelResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    PendingVerification,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a specified authorization key pair. This invalidates future viewer tokens
 * generated using the key pair’s `privateKey`. For more information, see Setting Up Private
 * Channels in the *Amazon IVS User Guide*.
 */
export const deletePlaybackKeyPair = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeletePlaybackKeyPairRequest,
    output: DeletePlaybackKeyPairResponse,
    errors: [
      AccessDeniedException,
      PendingVerification,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes the specified playback restriction policy.
 */
export const deletePlaybackRestrictionPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeletePlaybackRestrictionPolicyRequest,
    output: DeletePlaybackRestrictionPolicyResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      PendingVerification,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Deletes the recording configuration for the specified ARN.
 *
 * If you try to delete a recording configuration that is associated with a channel, you will
 * get an error (409 ConflictException). To avoid this, for all channels that reference the
 * recording configuration, first use UpdateChannel to set the
 * `recordingConfigurationArn` field to an empty string, then use
 * DeleteRecordingConfiguration.
 */
export const deleteRecordingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteRecordingConfigurationRequest,
    output: DeleteRecordingConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Deletes the stream key for the specified ARN, so it can no longer be used to
 * stream.
 */
export const deleteStreamKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStreamKeyRequest,
  output: DeleteStreamKeyResponse,
  errors: [
    AccessDeniedException,
    PendingVerification,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets the channel configuration for the specified channel ARN. See also BatchGetChannel.
 */
export const getChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetChannelRequest,
  output: GetChannelResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets the specified playback restriction policy.
 */
export const getPlaybackRestrictionPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetPlaybackRestrictionPolicyRequest,
    output: GetPlaybackRestrictionPolicyResponse,
    errors: [
      AccessDeniedException,
      PendingVerification,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Gets stream-key information for a specified ARN.
 */
export const getStreamKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStreamKeyRequest,
  output: GetStreamKeyResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Imports the public portion of a new key pair and returns its `arn` and
 * `fingerprint`. The `privateKey` can then be used to generate viewer
 * authorization tokens, to grant viewers access to private channels. For more information, see
 * Setting Up
 * Private Channels in the *Amazon IVS User Guide*.
 */
export const importPlaybackKeyPair = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ImportPlaybackKeyPairRequest,
    output: ImportPlaybackKeyPairResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      PendingVerification,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Gets information about Amazon Web Services tags for the specified ARN.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Inserts metadata into the active stream of the specified channel. At most 5 requests per
 * second per channel are allowed, each with a maximum 1 KB payload. (If 5 TPS is not sufficient
 * for your needs, we recommend batching your data into a single PutMetadata call.) At most 155
 * requests per second per account are allowed. Also see Embedding Metadata within a Video Stream in
 * the *Amazon IVS User Guide*.
 */
export const putMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutMetadataRequest,
  output: PutMetadataResponse,
  errors: [
    AccessDeniedException,
    ChannelNotBroadcasting,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts the process of revoking the viewer session associated with a specified channel ARN
 * and viewer ID. Optionally, you can provide a version to revoke viewer sessions less than and
 * including that version. For instructions on associating a viewer ID with a viewer session, see
 * Setting Up
 * Private Channels.
 */
export const startViewerSessionRevocation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartViewerSessionRevocationRequest,
    output: StartViewerSessionRevocationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      PendingVerification,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Disconnects the incoming RTMPS stream for the specified channel. Can be used in
 * conjunction with DeleteStreamKey to prevent further streaming to a
 * channel.
 *
 * Many streaming client-software libraries automatically reconnect a dropped RTMPS
 * session, so to stop the stream permanently, you may want to first revoke the
 * `streamKey` attached to the channel.
 */
export const stopStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopStreamRequest,
  output: StopStreamResponse,
  errors: [
    AccessDeniedException,
    ChannelNotBroadcasting,
    ResourceNotFoundException,
    StreamUnavailable,
    ValidationException,
  ],
}));
/**
 * Adds or updates tags for the Amazon Web Services resource with the specified ARN.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates a channel's configuration. Live channels cannot be updated. You must stop the
 * ongoing stream, update the channel, and restart the stream for the changes to take
 * effect.
 */
export const updateChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateChannelRequest,
  output: UpdateChannelResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    PendingVerification,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates a specified playback restriction policy.
 */
export const updatePlaybackRestrictionPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdatePlaybackRestrictionPolicyRequest,
    output: UpdatePlaybackRestrictionPolicyResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      PendingVerification,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Performs GetStreamKey on multiple ARNs simultaneously.
 */
export const batchGetStreamKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetStreamKeyRequest,
  output: BatchGetStreamKeyResponse,
  errors: [],
}));
/**
 * Creates a new channel and an associated stream key to start streaming.
 */
export const createChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChannelRequest,
  output: CreateChannelResponse,
  errors: [
    AccessDeniedException,
    PendingVerification,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a new playback restriction policy, for constraining playback by countries and/or
 * origins.
 */
export const createPlaybackRestrictionPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreatePlaybackRestrictionPolicyRequest,
    output: CreatePlaybackRestrictionPolicyResponse,
    errors: [
      AccessDeniedException,
      PendingVerification,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates a stream key, used to initiate a stream, for the specified channel ARN.
 *
 * Note that CreateChannel creates a stream key. If you subsequently use
 * CreateStreamKey on the same channel, it will fail because a stream key already exists and
 * there is a limit of 1 stream key per channel. To reset the stream key on a channel, use DeleteStreamKey and then CreateStreamKey.
 */
export const createStreamKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStreamKeyRequest,
  output: CreateStreamKeyResponse,
  errors: [
    AccessDeniedException,
    PendingVerification,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Gets a specified playback authorization key pair and returns the `arn` and
 * `fingerprint`. The `privateKey` held by the caller can be used to
 * generate viewer authorization tokens, to grant viewers access to private channels. For more
 * information, see Setting Up Private Channels in the Amazon IVS User
 * Guide.
 */
export const getPlaybackKeyPair = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPlaybackKeyPairRequest,
  output: GetPlaybackKeyPairResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets the recording configuration for the specified ARN.
 */
export const getRecordingConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRecordingConfigurationRequest,
    output: GetRecordingConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Gets information about the active (live) stream on a specified channel.
 */
export const getStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStreamRequest,
  output: GetStreamResponse,
  errors: [
    AccessDeniedException,
    ChannelNotBroadcasting,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets summary information about all channels in your account, in the Amazon Web Services
 * region where the API request is processed. This list can be filtered to match a specified name
 * or recording-configuration ARN. Filters are mutually exclusive and cannot be used together. If
 * you try to use both filters, you will get an error (409 ConflictException).
 */
export const listChannels = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListChannelsRequest,
  output: ListChannelsResponse,
  errors: [AccessDeniedException, ConflictException, ValidationException],
}));
/**
 * Gets summary information about playback key pairs. For more information, see Setting Up Private
 * Channels in the *Amazon IVS User Guide*.
 */
export const listPlaybackKeyPairs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListPlaybackKeyPairsRequest,
    output: ListPlaybackKeyPairsResponse,
    errors: [AccessDeniedException, ValidationException],
  }),
);
/**
 * Gets summary information about playback restriction policies.
 */
export const listPlaybackRestrictionPolicies =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListPlaybackRestrictionPoliciesRequest,
    output: ListPlaybackRestrictionPoliciesResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      PendingVerification,
      ValidationException,
    ],
  }));
/**
 * Gets summary information about all recording configurations in your account, in the
 * Amazon Web Services region where the API request is processed.
 */
export const listRecordingConfigurations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListRecordingConfigurationsRequest,
    output: ListRecordingConfigurationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ValidationException,
    ],
  }),
);
/**
 * Gets summary information about stream keys for the specified channel.
 */
export const listStreamKeys = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListStreamKeysRequest,
  output: ListStreamKeysResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets a summary of current and previous streams for a specified channel in your account, in
 * the AWS region where the API request is processed.
 */
export const listStreamSessions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListStreamSessionsRequest,
  output: ListStreamSessionsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Performs GetChannel on multiple ARNs simultaneously.
 */
export const batchGetChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetChannelRequest,
  output: BatchGetChannelResponse,
  errors: [],
}));
/**
 * Performs StartViewerSessionRevocation on multiple channel ARN and viewer
 * ID pairs simultaneously.
 */
export const batchStartViewerSessionRevocation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchStartViewerSessionRevocationRequest,
    output: BatchStartViewerSessionRevocationResponse,
    errors: [
      AccessDeniedException,
      PendingVerification,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates a new recording configuration, used to enable recording to Amazon S3.
 *
 * **Known issue:** In the us-east-1 region, if you use the
 * Amazon Web Services CLI to create a recording configuration, it returns success even if the
 * S3 bucket is in a different region. In this case, the `state` of the recording
 * configuration is `CREATE_FAILED` (instead of `ACTIVE`). (In other
 * regions, the CLI correctly returns failure if the bucket is in a different region.)
 *
 * **Workaround:** Ensure that your S3 bucket is in the same
 * region as the recording configuration. If you create a recording configuration in a different
 * region as your S3 bucket, delete that recording configuration and create a new one with an S3
 * bucket from the correct region.
 */
export const createRecordingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateRecordingConfigurationRequest,
    output: CreateRecordingConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      PendingVerification,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }));
/**
 * Gets summary information about live streams in your account, in the Amazon Web Services
 * region where the API request is processed.
 */
export const listStreams = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListStreamsRequest,
  output: ListStreamsResponse,
  errors: [AccessDeniedException, ValidationException],
}));
/**
 * Gets metadata on a specified stream.
 */
export const getStreamSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStreamSessionRequest,
  output: GetStreamSessionResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
