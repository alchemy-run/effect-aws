import { HttpClient } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as Strm from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
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

//# Newtypes
export type ChannelArn = string;
export type StreamKeyArn = string;
export type ChannelName = string;
export type ChannelLatencyMode = string;
export type ChannelRecordingConfigurationArn = string;
export type ChannelPlaybackRestrictionPolicyArn = string;
export type ContainerFormat = string;
export type PlaybackRestrictionPolicyAllowedCountry = string;
export type PlaybackRestrictionPolicyAllowedOrigin = string;
export type PlaybackRestrictionPolicyName = string;
export type RecordingConfigurationName = string;
export type RecordingReconnectWindowSeconds = number;
export type PlaybackKeyPairArn = string;
export type PlaybackRestrictionPolicyArn = string;
export type RecordingConfigurationArn = string;
export type StreamId = string;
export type PlaybackPublicKeyMaterial = string;
export type PlaybackKeyPairName = string;
export type PaginationToken = string;
export type MaxChannelResults = number;
export type MaxPlaybackKeyPairResults = number;
export type MaxPlaybackRestrictionPolicyResults = number;
export type MaxRecordingConfigurationResults = number;
export type MaxStreamKeyResults = number;
export type MaxStreamResults = number;
export type ResourceArn = string;
export type StreamMetadata = string | Redacted.Redacted<string>;
export type ViewerId = string;
export type ViewerSessionVersion = number;
export type TagKey = string;
export type TagValue = string;
export type RecordingMode = string;
export type TargetIntervalSeconds = number;
export type ThumbnailConfigurationStorage = string;
export type RenditionConfigurationRenditionSelection = string;
export type StreamHealth = string;
export type errorMessage = string;
export type S3DestinationBucketName = string;
export type IngestEndpoint = string;
export type PlaybackURL = string;
export type errorCode = string;
export type StreamKeyValue = string | Redacted.Redacted<string>;
export type PlaybackKeyPairFingerprint = string;
export type RecordingConfigurationState = string;
export type StreamState = string;
export type StreamViewerCount = number;
export type SrtEndpoint = string;
export type SrtPassphrase = string | Redacted.Redacted<string>;
export type Integer = number;

//# Schemas
export type ChannelArnList = string[];
export const ChannelArnList = S.Array(S.String);
export type StreamKeyArnList = string[];
export const StreamKeyArnList = S.Array(S.String);
export type PlaybackRestrictionPolicyAllowedCountryList = string[];
export const PlaybackRestrictionPolicyAllowedCountryList = S.Array(S.String);
export type PlaybackRestrictionPolicyAllowedOriginList = string[];
export const PlaybackRestrictionPolicyAllowedOriginList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface BatchGetChannelRequest {
  arns: ChannelArnList;
}
export const BatchGetChannelRequest = S.suspend(() =>
  S.Struct({ arns: ChannelArnList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/BatchGetChannel" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetChannelRequest",
}) as any as S.Schema<BatchGetChannelRequest>;
export interface BatchGetStreamKeyRequest {
  arns: StreamKeyArnList;
}
export const BatchGetStreamKeyRequest = S.suspend(() =>
  S.Struct({ arns: StreamKeyArnList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/BatchGetStreamKey" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetStreamKeyRequest",
}) as any as S.Schema<BatchGetStreamKeyRequest>;
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface CreatePlaybackRestrictionPolicyRequest {
  allowedCountries?: PlaybackRestrictionPolicyAllowedCountryList;
  allowedOrigins?: PlaybackRestrictionPolicyAllowedOriginList;
  enableStrictOriginEnforcement?: boolean;
  name?: string;
  tags?: Tags;
}
export const CreatePlaybackRestrictionPolicyRequest = S.suspend(() =>
  S.Struct({
    allowedCountries: S.optional(PlaybackRestrictionPolicyAllowedCountryList),
    allowedOrigins: S.optional(PlaybackRestrictionPolicyAllowedOriginList),
    enableStrictOriginEnforcement: S.optional(S.Boolean),
    name: S.optional(S.String),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreatePlaybackRestrictionPolicy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePlaybackRestrictionPolicyRequest",
}) as any as S.Schema<CreatePlaybackRestrictionPolicyRequest>;
export interface CreateStreamKeyRequest {
  channelArn: string;
  tags?: Tags;
}
export const CreateStreamKeyRequest = S.suspend(() =>
  S.Struct({ channelArn: S.String, tags: S.optional(Tags) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateStreamKey" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateStreamKeyRequest",
}) as any as S.Schema<CreateStreamKeyRequest>;
export interface DeleteChannelRequest {
  arn: string;
}
export const DeleteChannelRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteChannel" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteChannelRequest",
}) as any as S.Schema<DeleteChannelRequest>;
export interface DeleteChannelResponse {}
export const DeleteChannelResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteChannelResponse",
}) as any as S.Schema<DeleteChannelResponse>;
export interface DeletePlaybackKeyPairRequest {
  arn: string;
}
export const DeletePlaybackKeyPairRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeletePlaybackKeyPair" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePlaybackKeyPairRequest",
}) as any as S.Schema<DeletePlaybackKeyPairRequest>;
export interface DeletePlaybackKeyPairResponse {}
export const DeletePlaybackKeyPairResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePlaybackKeyPairResponse",
}) as any as S.Schema<DeletePlaybackKeyPairResponse>;
export interface DeletePlaybackRestrictionPolicyRequest {
  arn: string;
}
export const DeletePlaybackRestrictionPolicyRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeletePlaybackRestrictionPolicy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePlaybackRestrictionPolicyRequest",
}) as any as S.Schema<DeletePlaybackRestrictionPolicyRequest>;
export interface DeletePlaybackRestrictionPolicyResponse {}
export const DeletePlaybackRestrictionPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePlaybackRestrictionPolicyResponse",
}) as any as S.Schema<DeletePlaybackRestrictionPolicyResponse>;
export interface DeleteRecordingConfigurationRequest {
  arn: string;
}
export const DeleteRecordingConfigurationRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteRecordingConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRecordingConfigurationRequest",
}) as any as S.Schema<DeleteRecordingConfigurationRequest>;
export interface DeleteRecordingConfigurationResponse {}
export const DeleteRecordingConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteRecordingConfigurationResponse",
}) as any as S.Schema<DeleteRecordingConfigurationResponse>;
export interface DeleteStreamKeyRequest {
  arn: string;
}
export const DeleteStreamKeyRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteStreamKey" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteStreamKeyRequest",
}) as any as S.Schema<DeleteStreamKeyRequest>;
export interface DeleteStreamKeyResponse {}
export const DeleteStreamKeyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteStreamKeyResponse",
}) as any as S.Schema<DeleteStreamKeyResponse>;
export interface GetChannelRequest {
  arn: string;
}
export const GetChannelRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetChannel" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetChannelRequest",
}) as any as S.Schema<GetChannelRequest>;
export interface GetPlaybackKeyPairRequest {
  arn: string;
}
export const GetPlaybackKeyPairRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetPlaybackKeyPair" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPlaybackKeyPairRequest",
}) as any as S.Schema<GetPlaybackKeyPairRequest>;
export interface GetPlaybackRestrictionPolicyRequest {
  arn: string;
}
export const GetPlaybackRestrictionPolicyRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetPlaybackRestrictionPolicy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPlaybackRestrictionPolicyRequest",
}) as any as S.Schema<GetPlaybackRestrictionPolicyRequest>;
export interface GetRecordingConfigurationRequest {
  arn: string;
}
export const GetRecordingConfigurationRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetRecordingConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRecordingConfigurationRequest",
}) as any as S.Schema<GetRecordingConfigurationRequest>;
export interface GetStreamRequest {
  channelArn: string;
}
export const GetStreamRequest = S.suspend(() =>
  S.Struct({ channelArn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetStream" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetStreamRequest",
}) as any as S.Schema<GetStreamRequest>;
export interface GetStreamKeyRequest {
  arn: string;
}
export const GetStreamKeyRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetStreamKey" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetStreamKeyRequest",
}) as any as S.Schema<GetStreamKeyRequest>;
export interface GetStreamSessionRequest {
  channelArn: string;
  streamId?: string;
}
export const GetStreamSessionRequest = S.suspend(() =>
  S.Struct({ channelArn: S.String, streamId: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetStreamSession" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetStreamSessionRequest",
}) as any as S.Schema<GetStreamSessionRequest>;
export interface ImportPlaybackKeyPairRequest {
  publicKeyMaterial: string;
  name?: string;
  tags?: Tags;
}
export const ImportPlaybackKeyPairRequest = S.suspend(() =>
  S.Struct({
    publicKeyMaterial: S.String,
    name: S.optional(S.String),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ImportPlaybackKeyPair" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ImportPlaybackKeyPairRequest",
}) as any as S.Schema<ImportPlaybackKeyPairRequest>;
export interface ListChannelsRequest {
  filterByName?: string;
  filterByRecordingConfigurationArn?: string;
  filterByPlaybackRestrictionPolicyArn?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListChannelsRequest = S.suspend(() =>
  S.Struct({
    filterByName: S.optional(S.String),
    filterByRecordingConfigurationArn: S.optional(S.String),
    filterByPlaybackRestrictionPolicyArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListChannels" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListChannelsRequest",
}) as any as S.Schema<ListChannelsRequest>;
export interface ListPlaybackKeyPairsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListPlaybackKeyPairsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListPlaybackKeyPairs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPlaybackKeyPairsRequest",
}) as any as S.Schema<ListPlaybackKeyPairsRequest>;
export interface ListPlaybackRestrictionPoliciesRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListPlaybackRestrictionPoliciesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListPlaybackRestrictionPolicies" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPlaybackRestrictionPoliciesRequest",
}) as any as S.Schema<ListPlaybackRestrictionPoliciesRequest>;
export interface ListRecordingConfigurationsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListRecordingConfigurationsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListRecordingConfigurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRecordingConfigurationsRequest",
}) as any as S.Schema<ListRecordingConfigurationsRequest>;
export interface ListStreamKeysRequest {
  channelArn: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListStreamKeysRequest = S.suspend(() =>
  S.Struct({
    channelArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListStreamKeys" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListStreamKeysRequest",
}) as any as S.Schema<ListStreamKeysRequest>;
export interface ListStreamSessionsRequest {
  channelArn: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListStreamSessionsRequest = S.suspend(() =>
  S.Struct({
    channelArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListStreamSessions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListStreamSessionsRequest",
}) as any as S.Schema<ListStreamSessionsRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface PutMetadataRequest {
  channelArn: string;
  metadata: string | Redacted.Redacted<string>;
}
export const PutMetadataRequest = S.suspend(() =>
  S.Struct({ channelArn: S.String, metadata: SensitiveString }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/PutMetadata" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutMetadataRequest",
}) as any as S.Schema<PutMetadataRequest>;
export interface PutMetadataResponse {}
export const PutMetadataResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "PutMetadataResponse",
}) as any as S.Schema<PutMetadataResponse>;
export interface StartViewerSessionRevocationRequest {
  channelArn: string;
  viewerId: string;
  viewerSessionVersionsLessThanOrEqualTo?: number;
}
export const StartViewerSessionRevocationRequest = S.suspend(() =>
  S.Struct({
    channelArn: S.String,
    viewerId: S.String,
    viewerSessionVersionsLessThanOrEqualTo: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StartViewerSessionRevocation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartViewerSessionRevocationRequest",
}) as any as S.Schema<StartViewerSessionRevocationRequest>;
export interface StartViewerSessionRevocationResponse {}
export const StartViewerSessionRevocationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StartViewerSessionRevocationResponse",
}) as any as S.Schema<StartViewerSessionRevocationResponse>;
export interface StopStreamRequest {
  channelArn: string;
}
export const StopStreamRequest = S.suspend(() =>
  S.Struct({ channelArn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StopStream" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopStreamRequest",
}) as any as S.Schema<StopStreamRequest>;
export interface StopStreamResponse {}
export const StopStreamResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "StopStreamResponse",
}) as any as S.Schema<StopStreamResponse>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: Tags,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface MultitrackInputConfiguration {
  enabled?: boolean;
  policy?: string;
  maximumResolution?: string;
}
export const MultitrackInputConfiguration = S.suspend(() =>
  S.Struct({
    enabled: S.optional(S.Boolean),
    policy: S.optional(S.String),
    maximumResolution: S.optional(S.String),
  }),
).annotations({
  identifier: "MultitrackInputConfiguration",
}) as any as S.Schema<MultitrackInputConfiguration>;
export interface UpdateChannelRequest {
  arn: string;
  name?: string;
  latencyMode?: string;
  type?: string;
  authorized?: boolean;
  recordingConfigurationArn?: string;
  insecureIngest?: boolean;
  preset?: string;
  playbackRestrictionPolicyArn?: string;
  multitrackInputConfiguration?: MultitrackInputConfiguration;
  containerFormat?: string;
}
export const UpdateChannelRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateChannel" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateChannelRequest",
}) as any as S.Schema<UpdateChannelRequest>;
export interface UpdatePlaybackRestrictionPolicyRequest {
  arn: string;
  allowedCountries?: PlaybackRestrictionPolicyAllowedCountryList;
  allowedOrigins?: PlaybackRestrictionPolicyAllowedOriginList;
  enableStrictOriginEnforcement?: boolean;
  name?: string;
}
export const UpdatePlaybackRestrictionPolicyRequest = S.suspend(() =>
  S.Struct({
    arn: S.String,
    allowedCountries: S.optional(PlaybackRestrictionPolicyAllowedCountryList),
    allowedOrigins: S.optional(PlaybackRestrictionPolicyAllowedOriginList),
    enableStrictOriginEnforcement: S.optional(S.Boolean),
    name: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdatePlaybackRestrictionPolicy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePlaybackRestrictionPolicyRequest",
}) as any as S.Schema<UpdatePlaybackRestrictionPolicyRequest>;
export type ThumbnailConfigurationStorageList = string[];
export const ThumbnailConfigurationStorageList = S.Array(S.String);
export type RenditionConfigurationRenditionList = string[];
export const RenditionConfigurationRenditionList = S.Array(S.String);
export interface BatchStartViewerSessionRevocationViewerSession {
  channelArn: string;
  viewerId: string;
  viewerSessionVersionsLessThanOrEqualTo?: number;
}
export const BatchStartViewerSessionRevocationViewerSession = S.suspend(() =>
  S.Struct({
    channelArn: S.String,
    viewerId: S.String,
    viewerSessionVersionsLessThanOrEqualTo: S.optional(S.Number),
  }),
).annotations({
  identifier: "BatchStartViewerSessionRevocationViewerSession",
}) as any as S.Schema<BatchStartViewerSessionRevocationViewerSession>;
export type BatchStartViewerSessionRevocationViewerSessionList =
  BatchStartViewerSessionRevocationViewerSession[];
export const BatchStartViewerSessionRevocationViewerSessionList = S.Array(
  BatchStartViewerSessionRevocationViewerSession,
);
export interface ThumbnailConfiguration {
  recordingMode?: string;
  targetIntervalSeconds?: number;
  resolution?: string;
  storage?: ThumbnailConfigurationStorageList;
}
export const ThumbnailConfiguration = S.suspend(() =>
  S.Struct({
    recordingMode: S.optional(S.String),
    targetIntervalSeconds: S.optional(S.Number),
    resolution: S.optional(S.String),
    storage: S.optional(ThumbnailConfigurationStorageList),
  }),
).annotations({
  identifier: "ThumbnailConfiguration",
}) as any as S.Schema<ThumbnailConfiguration>;
export interface RenditionConfiguration {
  renditionSelection?: string;
  renditions?: RenditionConfigurationRenditionList;
}
export const RenditionConfiguration = S.suspend(() =>
  S.Struct({
    renditionSelection: S.optional(S.String),
    renditions: S.optional(RenditionConfigurationRenditionList),
  }),
).annotations({
  identifier: "RenditionConfiguration",
}) as any as S.Schema<RenditionConfiguration>;
export interface StreamFilters {
  health?: string;
}
export const StreamFilters = S.suspend(() =>
  S.Struct({ health: S.optional(S.String) }),
).annotations({
  identifier: "StreamFilters",
}) as any as S.Schema<StreamFilters>;
export interface BatchStartViewerSessionRevocationRequest {
  viewerSessions: BatchStartViewerSessionRevocationViewerSessionList;
}
export const BatchStartViewerSessionRevocationRequest = S.suspend(() =>
  S.Struct({
    viewerSessions: BatchStartViewerSessionRevocationViewerSessionList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/BatchStartViewerSessionRevocation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchStartViewerSessionRevocationRequest",
}) as any as S.Schema<BatchStartViewerSessionRevocationRequest>;
export interface CreateChannelRequest {
  name?: string;
  latencyMode?: string;
  type?: string;
  authorized?: boolean;
  recordingConfigurationArn?: string;
  tags?: Tags;
  insecureIngest?: boolean;
  preset?: string;
  playbackRestrictionPolicyArn?: string;
  multitrackInputConfiguration?: MultitrackInputConfiguration;
  containerFormat?: string;
}
export const CreateChannelRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateChannel" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateChannelRequest",
}) as any as S.Schema<CreateChannelRequest>;
export interface StreamKey {
  arn?: string;
  value?: string | Redacted.Redacted<string>;
  channelArn?: string;
  tags?: Tags;
}
export const StreamKey = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    value: S.optional(SensitiveString),
    channelArn: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({ identifier: "StreamKey" }) as any as S.Schema<StreamKey>;
export interface CreateStreamKeyResponse {
  streamKey?: StreamKey;
}
export const CreateStreamKeyResponse = S.suspend(() =>
  S.Struct({ streamKey: S.optional(StreamKey) }),
).annotations({
  identifier: "CreateStreamKeyResponse",
}) as any as S.Schema<CreateStreamKeyResponse>;
export interface Srt {
  endpoint?: string;
  passphrase?: string | Redacted.Redacted<string>;
}
export const Srt = S.suspend(() =>
  S.Struct({
    endpoint: S.optional(S.String),
    passphrase: S.optional(SensitiveString),
  }),
).annotations({ identifier: "Srt" }) as any as S.Schema<Srt>;
export interface Channel {
  arn?: string;
  name?: string;
  latencyMode?: string;
  type?: string;
  recordingConfigurationArn?: string;
  ingestEndpoint?: string;
  playbackUrl?: string;
  authorized?: boolean;
  tags?: Tags;
  insecureIngest?: boolean;
  preset?: string;
  srt?: Srt;
  playbackRestrictionPolicyArn?: string;
  multitrackInputConfiguration?: MultitrackInputConfiguration;
  containerFormat?: string;
}
export const Channel = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Channel" }) as any as S.Schema<Channel>;
export interface GetChannelResponse {
  channel?: Channel;
}
export const GetChannelResponse = S.suspend(() =>
  S.Struct({ channel: S.optional(Channel) }),
).annotations({
  identifier: "GetChannelResponse",
}) as any as S.Schema<GetChannelResponse>;
export interface PlaybackRestrictionPolicy {
  arn: string;
  allowedCountries: PlaybackRestrictionPolicyAllowedCountryList;
  allowedOrigins: PlaybackRestrictionPolicyAllowedOriginList;
  enableStrictOriginEnforcement?: boolean;
  name?: string;
  tags?: Tags;
}
export const PlaybackRestrictionPolicy = S.suspend(() =>
  S.Struct({
    arn: S.String,
    allowedCountries: PlaybackRestrictionPolicyAllowedCountryList,
    allowedOrigins: PlaybackRestrictionPolicyAllowedOriginList,
    enableStrictOriginEnforcement: S.optional(S.Boolean),
    name: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "PlaybackRestrictionPolicy",
}) as any as S.Schema<PlaybackRestrictionPolicy>;
export interface GetPlaybackRestrictionPolicyResponse {
  playbackRestrictionPolicy?: PlaybackRestrictionPolicy;
}
export const GetPlaybackRestrictionPolicyResponse = S.suspend(() =>
  S.Struct({
    playbackRestrictionPolicy: S.optional(PlaybackRestrictionPolicy),
  }),
).annotations({
  identifier: "GetPlaybackRestrictionPolicyResponse",
}) as any as S.Schema<GetPlaybackRestrictionPolicyResponse>;
export interface GetStreamKeyResponse {
  streamKey?: StreamKey;
}
export const GetStreamKeyResponse = S.suspend(() =>
  S.Struct({ streamKey: S.optional(StreamKey) }),
).annotations({
  identifier: "GetStreamKeyResponse",
}) as any as S.Schema<GetStreamKeyResponse>;
export interface PlaybackKeyPair {
  arn?: string;
  name?: string;
  fingerprint?: string;
  tags?: Tags;
}
export const PlaybackKeyPair = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(S.String),
    fingerprint: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "PlaybackKeyPair",
}) as any as S.Schema<PlaybackKeyPair>;
export interface ImportPlaybackKeyPairResponse {
  keyPair?: PlaybackKeyPair;
}
export const ImportPlaybackKeyPairResponse = S.suspend(() =>
  S.Struct({ keyPair: S.optional(PlaybackKeyPair) }),
).annotations({
  identifier: "ImportPlaybackKeyPairResponse",
}) as any as S.Schema<ImportPlaybackKeyPairResponse>;
export interface ListStreamsRequest {
  filterBy?: StreamFilters;
  nextToken?: string;
  maxResults?: number;
}
export const ListStreamsRequest = S.suspend(() =>
  S.Struct({
    filterBy: S.optional(StreamFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListStreams" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListStreamsRequest",
}) as any as S.Schema<ListStreamsRequest>;
export interface ListTagsForResourceResponse {
  tags: Tags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: Tags }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface UpdateChannelResponse {
  channel?: Channel;
}
export const UpdateChannelResponse = S.suspend(() =>
  S.Struct({ channel: S.optional(Channel) }),
).annotations({
  identifier: "UpdateChannelResponse",
}) as any as S.Schema<UpdateChannelResponse>;
export interface UpdatePlaybackRestrictionPolicyResponse {
  playbackRestrictionPolicy?: PlaybackRestrictionPolicy;
}
export const UpdatePlaybackRestrictionPolicyResponse = S.suspend(() =>
  S.Struct({
    playbackRestrictionPolicy: S.optional(PlaybackRestrictionPolicy),
  }),
).annotations({
  identifier: "UpdatePlaybackRestrictionPolicyResponse",
}) as any as S.Schema<UpdatePlaybackRestrictionPolicyResponse>;
export interface S3DestinationConfiguration {
  bucketName: string;
}
export const S3DestinationConfiguration = S.suspend(() =>
  S.Struct({ bucketName: S.String }),
).annotations({
  identifier: "S3DestinationConfiguration",
}) as any as S.Schema<S3DestinationConfiguration>;
export interface BatchError {
  arn?: string;
  code?: string;
  message?: string;
}
export const BatchError = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    code: S.optional(S.String),
    message: S.optional(S.String),
  }),
).annotations({ identifier: "BatchError" }) as any as S.Schema<BatchError>;
export type BatchErrors = BatchError[];
export const BatchErrors = S.Array(BatchError);
export type StreamKeys = StreamKey[];
export const StreamKeys = S.Array(StreamKey);
export interface DestinationConfiguration {
  s3?: S3DestinationConfiguration;
}
export const DestinationConfiguration = S.suspend(() =>
  S.Struct({ s3: S.optional(S3DestinationConfiguration) }),
).annotations({
  identifier: "DestinationConfiguration",
}) as any as S.Schema<DestinationConfiguration>;
export interface RecordingConfiguration {
  arn: string;
  name?: string;
  destinationConfiguration: DestinationConfiguration;
  state: string;
  tags?: Tags;
  thumbnailConfiguration?: ThumbnailConfiguration;
  recordingReconnectWindowSeconds?: number;
  renditionConfiguration?: RenditionConfiguration;
}
export const RecordingConfiguration = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.optional(S.String),
    destinationConfiguration: DestinationConfiguration,
    state: S.String,
    tags: S.optional(Tags),
    thumbnailConfiguration: S.optional(ThumbnailConfiguration),
    recordingReconnectWindowSeconds: S.optional(S.Number),
    renditionConfiguration: S.optional(RenditionConfiguration),
  }),
).annotations({
  identifier: "RecordingConfiguration",
}) as any as S.Schema<RecordingConfiguration>;
export interface Stream {
  channelArn?: string;
  streamId?: string;
  playbackUrl?: string;
  startTime?: Date;
  state?: string;
  health?: string;
  viewerCount?: number;
}
export const Stream = S.suspend(() =>
  S.Struct({
    channelArn: S.optional(S.String),
    streamId: S.optional(S.String),
    playbackUrl: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    state: S.optional(S.String),
    health: S.optional(S.String),
    viewerCount: S.optional(S.Number),
  }),
).annotations({ identifier: "Stream" }) as any as S.Schema<Stream>;
export interface ChannelSummary {
  arn?: string;
  name?: string;
  latencyMode?: string;
  authorized?: boolean;
  recordingConfigurationArn?: string;
  tags?: Tags;
  insecureIngest?: boolean;
  type?: string;
  preset?: string;
  playbackRestrictionPolicyArn?: string;
}
export const ChannelSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ChannelSummary",
}) as any as S.Schema<ChannelSummary>;
export type ChannelList = ChannelSummary[];
export const ChannelList = S.Array(ChannelSummary);
export interface PlaybackKeyPairSummary {
  arn?: string;
  name?: string;
  tags?: Tags;
}
export const PlaybackKeyPairSummary = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "PlaybackKeyPairSummary",
}) as any as S.Schema<PlaybackKeyPairSummary>;
export type PlaybackKeyPairList = PlaybackKeyPairSummary[];
export const PlaybackKeyPairList = S.Array(PlaybackKeyPairSummary);
export interface PlaybackRestrictionPolicySummary {
  arn: string;
  allowedCountries: PlaybackRestrictionPolicyAllowedCountryList;
  allowedOrigins: PlaybackRestrictionPolicyAllowedOriginList;
  enableStrictOriginEnforcement?: boolean;
  name?: string;
  tags?: Tags;
}
export const PlaybackRestrictionPolicySummary = S.suspend(() =>
  S.Struct({
    arn: S.String,
    allowedCountries: PlaybackRestrictionPolicyAllowedCountryList,
    allowedOrigins: PlaybackRestrictionPolicyAllowedOriginList,
    enableStrictOriginEnforcement: S.optional(S.Boolean),
    name: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "PlaybackRestrictionPolicySummary",
}) as any as S.Schema<PlaybackRestrictionPolicySummary>;
export type PlaybackRestrictionPolicyList = PlaybackRestrictionPolicySummary[];
export const PlaybackRestrictionPolicyList = S.Array(
  PlaybackRestrictionPolicySummary,
);
export interface RecordingConfigurationSummary {
  arn: string;
  name?: string;
  destinationConfiguration: DestinationConfiguration;
  state: string;
  tags?: Tags;
}
export const RecordingConfigurationSummary = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.optional(S.String),
    destinationConfiguration: DestinationConfiguration,
    state: S.String,
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "RecordingConfigurationSummary",
}) as any as S.Schema<RecordingConfigurationSummary>;
export type RecordingConfigurationList = RecordingConfigurationSummary[];
export const RecordingConfigurationList = S.Array(
  RecordingConfigurationSummary,
);
export interface StreamKeySummary {
  arn?: string;
  channelArn?: string;
  tags?: Tags;
}
export const StreamKeySummary = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    channelArn: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "StreamKeySummary",
}) as any as S.Schema<StreamKeySummary>;
export type StreamKeyList = StreamKeySummary[];
export const StreamKeyList = S.Array(StreamKeySummary);
export interface StreamSessionSummary {
  streamId?: string;
  startTime?: Date;
  endTime?: Date;
  hasErrorEvent?: boolean;
}
export const StreamSessionSummary = S.suspend(() =>
  S.Struct({
    streamId: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    hasErrorEvent: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "StreamSessionSummary",
}) as any as S.Schema<StreamSessionSummary>;
export type StreamSessionList = StreamSessionSummary[];
export const StreamSessionList = S.Array(StreamSessionSummary);
export interface VideoConfiguration {
  avcProfile?: string;
  avcLevel?: string;
  codec?: string;
  encoder?: string;
  targetBitrate?: number;
  targetFramerate?: number;
  videoHeight?: number;
  videoWidth?: number;
  level?: string;
  track?: string;
  profile?: string;
}
export const VideoConfiguration = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "VideoConfiguration",
}) as any as S.Schema<VideoConfiguration>;
export type VideoConfigurationList = VideoConfiguration[];
export const VideoConfigurationList = S.Array(VideoConfiguration);
export interface AudioConfiguration {
  codec?: string;
  targetBitrate?: number;
  sampleRate?: number;
  channels?: number;
  track?: string;
}
export const AudioConfiguration = S.suspend(() =>
  S.Struct({
    codec: S.optional(S.String),
    targetBitrate: S.optional(S.Number),
    sampleRate: S.optional(S.Number),
    channels: S.optional(S.Number),
    track: S.optional(S.String),
  }),
).annotations({
  identifier: "AudioConfiguration",
}) as any as S.Schema<AudioConfiguration>;
export type AudioConfigurationList = AudioConfiguration[];
export const AudioConfigurationList = S.Array(AudioConfiguration);
export interface BatchGetStreamKeyResponse {
  streamKeys?: StreamKeys;
  errors?: BatchErrors;
}
export const BatchGetStreamKeyResponse = S.suspend(() =>
  S.Struct({
    streamKeys: S.optional(StreamKeys),
    errors: S.optional(BatchErrors),
  }),
).annotations({
  identifier: "BatchGetStreamKeyResponse",
}) as any as S.Schema<BatchGetStreamKeyResponse>;
export interface CreateChannelResponse {
  channel?: Channel;
  streamKey?: StreamKey;
}
export const CreateChannelResponse = S.suspend(() =>
  S.Struct({ channel: S.optional(Channel), streamKey: S.optional(StreamKey) }),
).annotations({
  identifier: "CreateChannelResponse",
}) as any as S.Schema<CreateChannelResponse>;
export interface CreatePlaybackRestrictionPolicyResponse {
  playbackRestrictionPolicy?: PlaybackRestrictionPolicy;
}
export const CreatePlaybackRestrictionPolicyResponse = S.suspend(() =>
  S.Struct({
    playbackRestrictionPolicy: S.optional(PlaybackRestrictionPolicy),
  }),
).annotations({
  identifier: "CreatePlaybackRestrictionPolicyResponse",
}) as any as S.Schema<CreatePlaybackRestrictionPolicyResponse>;
export interface CreateRecordingConfigurationRequest {
  name?: string;
  destinationConfiguration: DestinationConfiguration;
  tags?: Tags;
  thumbnailConfiguration?: ThumbnailConfiguration;
  recordingReconnectWindowSeconds?: number;
  renditionConfiguration?: RenditionConfiguration;
}
export const CreateRecordingConfigurationRequest = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    destinationConfiguration: DestinationConfiguration,
    tags: S.optional(Tags),
    thumbnailConfiguration: S.optional(ThumbnailConfiguration),
    recordingReconnectWindowSeconds: S.optional(S.Number),
    renditionConfiguration: S.optional(RenditionConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateRecordingConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRecordingConfigurationRequest",
}) as any as S.Schema<CreateRecordingConfigurationRequest>;
export interface GetPlaybackKeyPairResponse {
  keyPair?: PlaybackKeyPair;
}
export const GetPlaybackKeyPairResponse = S.suspend(() =>
  S.Struct({ keyPair: S.optional(PlaybackKeyPair) }),
).annotations({
  identifier: "GetPlaybackKeyPairResponse",
}) as any as S.Schema<GetPlaybackKeyPairResponse>;
export interface GetRecordingConfigurationResponse {
  recordingConfiguration?: RecordingConfiguration;
}
export const GetRecordingConfigurationResponse = S.suspend(() =>
  S.Struct({ recordingConfiguration: S.optional(RecordingConfiguration) }),
).annotations({
  identifier: "GetRecordingConfigurationResponse",
}) as any as S.Schema<GetRecordingConfigurationResponse>;
export interface GetStreamResponse {
  stream?: Stream;
}
export const GetStreamResponse = S.suspend(() =>
  S.Struct({ stream: S.optional(Stream) }),
).annotations({
  identifier: "GetStreamResponse",
}) as any as S.Schema<GetStreamResponse>;
export interface ListChannelsResponse {
  channels: ChannelList;
  nextToken?: string;
}
export const ListChannelsResponse = S.suspend(() =>
  S.Struct({ channels: ChannelList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListChannelsResponse",
}) as any as S.Schema<ListChannelsResponse>;
export interface ListPlaybackKeyPairsResponse {
  keyPairs: PlaybackKeyPairList;
  nextToken?: string;
}
export const ListPlaybackKeyPairsResponse = S.suspend(() =>
  S.Struct({ keyPairs: PlaybackKeyPairList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListPlaybackKeyPairsResponse",
}) as any as S.Schema<ListPlaybackKeyPairsResponse>;
export interface ListPlaybackRestrictionPoliciesResponse {
  playbackRestrictionPolicies: PlaybackRestrictionPolicyList;
  nextToken?: string;
}
export const ListPlaybackRestrictionPoliciesResponse = S.suspend(() =>
  S.Struct({
    playbackRestrictionPolicies: PlaybackRestrictionPolicyList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPlaybackRestrictionPoliciesResponse",
}) as any as S.Schema<ListPlaybackRestrictionPoliciesResponse>;
export interface ListRecordingConfigurationsResponse {
  recordingConfigurations: RecordingConfigurationList;
  nextToken?: string;
}
export const ListRecordingConfigurationsResponse = S.suspend(() =>
  S.Struct({
    recordingConfigurations: RecordingConfigurationList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRecordingConfigurationsResponse",
}) as any as S.Schema<ListRecordingConfigurationsResponse>;
export interface ListStreamKeysResponse {
  streamKeys: StreamKeyList;
  nextToken?: string;
}
export const ListStreamKeysResponse = S.suspend(() =>
  S.Struct({ streamKeys: StreamKeyList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListStreamKeysResponse",
}) as any as S.Schema<ListStreamKeysResponse>;
export interface ListStreamSessionsResponse {
  streamSessions: StreamSessionList;
  nextToken?: string;
}
export const ListStreamSessionsResponse = S.suspend(() =>
  S.Struct({
    streamSessions: StreamSessionList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListStreamSessionsResponse",
}) as any as S.Schema<ListStreamSessionsResponse>;
export interface IngestConfigurations {
  videoConfigurations: VideoConfigurationList;
  audioConfigurations: AudioConfigurationList;
}
export const IngestConfigurations = S.suspend(() =>
  S.Struct({
    videoConfigurations: VideoConfigurationList,
    audioConfigurations: AudioConfigurationList,
  }),
).annotations({
  identifier: "IngestConfigurations",
}) as any as S.Schema<IngestConfigurations>;
export interface StreamEvent {
  name?: string;
  type?: string;
  eventTime?: Date;
  code?: string;
}
export const StreamEvent = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    type: S.optional(S.String),
    eventTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    code: S.optional(S.String),
  }),
).annotations({ identifier: "StreamEvent" }) as any as S.Schema<StreamEvent>;
export type StreamEvents = StreamEvent[];
export const StreamEvents = S.Array(StreamEvent);
export type Channels = Channel[];
export const Channels = S.Array(Channel);
export interface BatchStartViewerSessionRevocationError {
  channelArn: string;
  viewerId: string;
  code?: string;
  message?: string;
}
export const BatchStartViewerSessionRevocationError = S.suspend(() =>
  S.Struct({
    channelArn: S.String,
    viewerId: S.String,
    code: S.optional(S.String),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchStartViewerSessionRevocationError",
}) as any as S.Schema<BatchStartViewerSessionRevocationError>;
export type BatchStartViewerSessionRevocationErrors =
  BatchStartViewerSessionRevocationError[];
export const BatchStartViewerSessionRevocationErrors = S.Array(
  BatchStartViewerSessionRevocationError,
);
export interface StreamSummary {
  channelArn?: string;
  streamId?: string;
  state?: string;
  health?: string;
  viewerCount?: number;
  startTime?: Date;
}
export const StreamSummary = S.suspend(() =>
  S.Struct({
    channelArn: S.optional(S.String),
    streamId: S.optional(S.String),
    state: S.optional(S.String),
    health: S.optional(S.String),
    viewerCount: S.optional(S.Number),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "StreamSummary",
}) as any as S.Schema<StreamSummary>;
export type StreamList = StreamSummary[];
export const StreamList = S.Array(StreamSummary);
export interface BatchGetChannelResponse {
  channels?: Channels;
  errors?: BatchErrors;
}
export const BatchGetChannelResponse = S.suspend(() =>
  S.Struct({ channels: S.optional(Channels), errors: S.optional(BatchErrors) }),
).annotations({
  identifier: "BatchGetChannelResponse",
}) as any as S.Schema<BatchGetChannelResponse>;
export interface BatchStartViewerSessionRevocationResponse {
  errors?: BatchStartViewerSessionRevocationErrors;
}
export const BatchStartViewerSessionRevocationResponse = S.suspend(() =>
  S.Struct({ errors: S.optional(BatchStartViewerSessionRevocationErrors) }),
).annotations({
  identifier: "BatchStartViewerSessionRevocationResponse",
}) as any as S.Schema<BatchStartViewerSessionRevocationResponse>;
export interface CreateRecordingConfigurationResponse {
  recordingConfiguration?: RecordingConfiguration;
}
export const CreateRecordingConfigurationResponse = S.suspend(() =>
  S.Struct({ recordingConfiguration: S.optional(RecordingConfiguration) }),
).annotations({
  identifier: "CreateRecordingConfigurationResponse",
}) as any as S.Schema<CreateRecordingConfigurationResponse>;
export interface ListStreamsResponse {
  streams: StreamList;
  nextToken?: string;
}
export const ListStreamsResponse = S.suspend(() =>
  S.Struct({ streams: StreamList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListStreamsResponse",
}) as any as S.Schema<ListStreamsResponse>;
export interface IngestConfiguration {
  video?: VideoConfiguration;
  audio?: AudioConfiguration;
}
export const IngestConfiguration = S.suspend(() =>
  S.Struct({
    video: S.optional(VideoConfiguration),
    audio: S.optional(AudioConfiguration),
  }),
).annotations({
  identifier: "IngestConfiguration",
}) as any as S.Schema<IngestConfiguration>;
export interface StreamSession {
  streamId?: string;
  startTime?: Date;
  endTime?: Date;
  channel?: Channel;
  ingestConfiguration?: IngestConfiguration;
  ingestConfigurations?: IngestConfigurations;
  recordingConfiguration?: RecordingConfiguration;
  truncatedEvents?: StreamEvents;
}
export const StreamSession = S.suspend(() =>
  S.Struct({
    streamId: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    channel: S.optional(Channel),
    ingestConfiguration: S.optional(IngestConfiguration),
    ingestConfigurations: S.optional(IngestConfigurations),
    recordingConfiguration: S.optional(RecordingConfiguration),
    truncatedEvents: S.optional(StreamEvents),
  }),
).annotations({
  identifier: "StreamSession",
}) as any as S.Schema<StreamSession>;
export interface GetStreamSessionResponse {
  streamSession?: StreamSession;
}
export const GetStreamSessionResponse = S.suspend(() =>
  S.Struct({ streamSession: S.optional(StreamSession) }),
).annotations({
  identifier: "GetStreamSessionResponse",
}) as any as S.Schema<GetStreamSessionResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { exceptionMessage: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { exceptionMessage: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { exceptionMessage: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { exceptionMessage: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class PendingVerification extends S.TaggedError<PendingVerification>()(
  "PendingVerification",
  { exceptionMessage: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ChannelNotBroadcasting extends S.TaggedError<ChannelNotBroadcasting>()(
  "ChannelNotBroadcasting",
  { exceptionMessage: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { exceptionMessage: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { exceptionMessage: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { exceptionMessage: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class StreamUnavailable extends S.TaggedError<StreamUnavailable>()(
  "StreamUnavailable",
  { exceptionMessage: S.optional(S.String) },
).pipe(C.withServerError) {}

//# Operations
/**
 * Performs GetStreamKey on multiple ARNs simultaneously.
 */
export const batchGetStreamKey: (
  input: BatchGetStreamKeyRequest,
) => Effect.Effect<
  BatchGetStreamKeyResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetStreamKeyRequest,
  output: BatchGetStreamKeyResponse,
  errors: [],
}));
/**
 * Performs GetChannel on multiple ARNs simultaneously.
 */
export const batchGetChannel: (
  input: BatchGetChannelRequest,
) => Effect.Effect<
  BatchGetChannelResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetChannelRequest,
  output: BatchGetChannelResponse,
  errors: [],
}));
/**
 * Gets the channel configuration for the specified channel ARN. See also BatchGetChannel.
 */
export const getChannel: (
  input: GetChannelRequest,
) => Effect.Effect<
  GetChannelResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetChannelRequest,
  output: GetChannelResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets summary information about live streams in your account, in the Amazon Web Services
 * region where the API request is processed.
 */
export const listStreams: {
  (
    input: ListStreamsRequest,
  ): Effect.Effect<
    ListStreamsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStreamsRequest,
  ) => Strm.Stream<
    ListStreamsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStreamsRequest,
  ) => Strm.Stream<
    unknown,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStreamsRequest,
  output: ListStreamsResponse,
  errors: [AccessDeniedException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Inserts metadata into the active stream of the specified channel. At most 5 requests per
 * second per channel are allowed, each with a maximum 1 KB payload. (If 5 TPS is not sufficient
 * for your needs, we recommend batching your data into a single PutMetadata call.) At most 155
 * requests per second per account are allowed. Also see Embedding Metadata within a Video Stream in
 * the *Amazon IVS User Guide*.
 */
export const putMetadata: (
  input: PutMetadataRequest,
) => Effect.Effect<
  PutMetadataResponse,
  | AccessDeniedException
  | ChannelNotBroadcasting
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Imports the public portion of a new key pair and returns its `arn` and
 * `fingerprint`. The `privateKey` can then be used to generate viewer
 * authorization tokens, to grant viewers access to private channels. For more information, see
 * Setting Up
 * Private Channels in the *Amazon IVS User Guide*.
 */
export const importPlaybackKeyPair: (
  input: ImportPlaybackKeyPairRequest,
) => Effect.Effect<
  ImportPlaybackKeyPairResponse,
  | AccessDeniedException
  | ConflictException
  | PendingVerification
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportPlaybackKeyPairRequest,
  output: ImportPlaybackKeyPairResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    PendingVerification,
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
export const getPlaybackKeyPair: (
  input: GetPlaybackKeyPairRequest,
) => Effect.Effect<
  GetPlaybackKeyPairResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPlaybackKeyPairRequest,
  output: GetPlaybackKeyPairResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets the specified playback restriction policy.
 */
export const getPlaybackRestrictionPolicy: (
  input: GetPlaybackRestrictionPolicyRequest,
) => Effect.Effect<
  GetPlaybackRestrictionPolicyResponse,
  | AccessDeniedException
  | PendingVerification
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Gets the recording configuration for the specified ARN.
 */
export const getRecordingConfiguration: (
  input: GetRecordingConfigurationRequest,
) => Effect.Effect<
  GetRecordingConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRecordingConfigurationRequest,
  output: GetRecordingConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
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
export const listChannels: {
  (
    input: ListChannelsRequest,
  ): Effect.Effect<
    ListChannelsResponse,
    | AccessDeniedException
    | ConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChannelsRequest,
  ) => Strm.Stream<
    ListChannelsResponse,
    | AccessDeniedException
    | ConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChannelsRequest,
  ) => Strm.Stream<
    unknown,
    | AccessDeniedException
    | ConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChannelsRequest,
  output: ListChannelsResponse,
  errors: [AccessDeniedException, ConflictException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets summary information about playback key pairs. For more information, see Setting Up Private
 * Channels in the *Amazon IVS User Guide*.
 */
export const listPlaybackKeyPairs: {
  (
    input: ListPlaybackKeyPairsRequest,
  ): Effect.Effect<
    ListPlaybackKeyPairsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPlaybackKeyPairsRequest,
  ) => Strm.Stream<
    ListPlaybackKeyPairsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPlaybackKeyPairsRequest,
  ) => Strm.Stream<
    unknown,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPlaybackKeyPairsRequest,
  output: ListPlaybackKeyPairsResponse,
  errors: [AccessDeniedException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets summary information about playback restriction policies.
 */
export const listPlaybackRestrictionPolicies: {
  (
    input: ListPlaybackRestrictionPoliciesRequest,
  ): Effect.Effect<
    ListPlaybackRestrictionPoliciesResponse,
    | AccessDeniedException
    | ConflictException
    | PendingVerification
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPlaybackRestrictionPoliciesRequest,
  ) => Strm.Stream<
    ListPlaybackRestrictionPoliciesResponse,
    | AccessDeniedException
    | ConflictException
    | PendingVerification
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPlaybackRestrictionPoliciesRequest,
  ) => Strm.Stream<
    unknown,
    | AccessDeniedException
    | ConflictException
    | PendingVerification
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPlaybackRestrictionPoliciesRequest,
  output: ListPlaybackRestrictionPoliciesResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    PendingVerification,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets summary information about all recording configurations in your account, in the
 * Amazon Web Services region where the API request is processed.
 */
export const listRecordingConfigurations: {
  (
    input: ListRecordingConfigurationsRequest,
  ): Effect.Effect<
    ListRecordingConfigurationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRecordingConfigurationsRequest,
  ) => Strm.Stream<
    ListRecordingConfigurationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRecordingConfigurationsRequest,
  ) => Strm.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRecordingConfigurationsRequest,
  output: ListRecordingConfigurationsResponse,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets summary information about stream keys for the specified channel.
 */
export const listStreamKeys: {
  (
    input: ListStreamKeysRequest,
  ): Effect.Effect<
    ListStreamKeysResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStreamKeysRequest,
  ) => Strm.Stream<
    ListStreamKeysResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStreamKeysRequest,
  ) => Strm.Stream<
    unknown,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStreamKeysRequest,
  output: ListStreamKeysResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets a summary of current and previous streams for a specified channel in your account, in
 * the AWS region where the API request is processed.
 */
export const listStreamSessions: {
  (
    input: ListStreamSessionsRequest,
  ): Effect.Effect<
    ListStreamSessionsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStreamSessionsRequest,
  ) => Strm.Stream<
    ListStreamSessionsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStreamSessionsRequest,
  ) => Strm.Stream<
    unknown,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStreamSessionsRequest,
  output: ListStreamSessionsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates a channel's configuration. Live channels cannot be updated. You must stop the
 * ongoing stream, update the channel, and restart the stream for the changes to take
 * effect.
 */
export const updateChannel: (
  input: UpdateChannelRequest,
) => Effect.Effect<
  UpdateChannelResponse,
  | AccessDeniedException
  | ConflictException
  | PendingVerification
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePlaybackRestrictionPolicy: (
  input: UpdatePlaybackRestrictionPolicyRequest,
) => Effect.Effect<
  UpdatePlaybackRestrictionPolicyResponse,
  | AccessDeniedException
  | ConflictException
  | PendingVerification
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes the specified playback restriction policy.
 */
export const deletePlaybackRestrictionPolicy: (
  input: DeletePlaybackRestrictionPolicyRequest,
) => Effect.Effect<
  DeletePlaybackRestrictionPolicyResponse,
  | AccessDeniedException
  | ConflictException
  | PendingVerification
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteRecordingConfiguration: (
  input: DeleteRecordingConfigurationRequest,
) => Effect.Effect<
  DeleteRecordingConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Gets stream-key information for a specified ARN.
 */
export const getStreamKey: (
  input: GetStreamKeyRequest,
) => Effect.Effect<
  GetStreamKeyResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStreamKeyRequest,
  output: GetStreamKeyResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Adds or updates tags for the Amazon Web Services resource with the specified ARN.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes tags from the resource with the specified ARN.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets information about Amazon Web Services tags for the specified ARN.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a specified authorization key pair. This invalidates future viewer tokens
 * generated using the key pair’s `privateKey`. For more information, see Setting Up Private
 * Channels in the *Amazon IVS User Guide*.
 */
export const deletePlaybackKeyPair: (
  input: DeletePlaybackKeyPairRequest,
) => Effect.Effect<
  DeletePlaybackKeyPairResponse,
  | AccessDeniedException
  | PendingVerification
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePlaybackKeyPairRequest,
  output: DeletePlaybackKeyPairResponse,
  errors: [
    AccessDeniedException,
    PendingVerification,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes the stream key for the specified ARN, so it can no longer be used to
 * stream.
 */
export const deleteStreamKey: (
  input: DeleteStreamKeyRequest,
) => Effect.Effect<
  DeleteStreamKeyResponse,
  | AccessDeniedException
  | PendingVerification
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes the specified channel and its associated stream keys.
 *
 * If you try to delete a live channel, you will get an error (409 ConflictException). To
 * delete a channel that is live, call StopStream, wait for the Amazon
 * EventBridge "Stream End" event (to verify that the stream's state is no longer Live), then
 * call DeleteChannel. (See Using EventBridge with Amazon IVS.)
 */
export const deleteChannel: (
  input: DeleteChannelRequest,
) => Effect.Effect<
  DeleteChannelResponse,
  | AccessDeniedException
  | ConflictException
  | PendingVerification
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Gets information about the active (live) stream on a specified channel.
 */
export const getStream: (
  input: GetStreamRequest,
) => Effect.Effect<
  GetStreamResponse,
  | AccessDeniedException
  | ChannelNotBroadcasting
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Disconnects the incoming RTMPS stream for the specified channel. Can be used in
 * conjunction with DeleteStreamKey to prevent further streaming to a
 * channel.
 *
 * Many streaming client-software libraries automatically reconnect a dropped RTMPS
 * session, so to stop the stream permanently, you may want to first revoke the
 * `streamKey` attached to the channel.
 */
export const stopStream: (
  input: StopStreamRequest,
) => Effect.Effect<
  StopStreamResponse,
  | AccessDeniedException
  | ChannelNotBroadcasting
  | ResourceNotFoundException
  | StreamUnavailable
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Starts the process of revoking the viewer session associated with a specified channel ARN
 * and viewer ID. Optionally, you can provide a version to revoke viewer sessions less than and
 * including that version. For instructions on associating a viewer ID with a viewer session, see
 * Setting Up
 * Private Channels.
 */
export const startViewerSessionRevocation: (
  input: StartViewerSessionRevocationRequest,
) => Effect.Effect<
  StartViewerSessionRevocationResponse,
  | AccessDeniedException
  | InternalServerException
  | PendingVerification
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Performs StartViewerSessionRevocation on multiple channel ARN and viewer
 * ID pairs simultaneously.
 */
export const batchStartViewerSessionRevocation: (
  input: BatchStartViewerSessionRevocationRequest,
) => Effect.Effect<
  BatchStartViewerSessionRevocationResponse,
  | AccessDeniedException
  | PendingVerification
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a stream key, used to initiate a stream, for the specified channel ARN.
 *
 * Note that CreateChannel creates a stream key. If you subsequently use
 * CreateStreamKey on the same channel, it will fail because a stream key already exists and
 * there is a limit of 1 stream key per channel. To reset the stream key on a channel, use DeleteStreamKey and then CreateStreamKey.
 */
export const createStreamKey: (
  input: CreateStreamKeyRequest,
) => Effect.Effect<
  CreateStreamKeyResponse,
  | AccessDeniedException
  | PendingVerification
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new channel and an associated stream key to start streaming.
 */
export const createChannel: (
  input: CreateChannelRequest,
) => Effect.Effect<
  CreateChannelResponse,
  | AccessDeniedException
  | PendingVerification
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createPlaybackRestrictionPolicy: (
  input: CreatePlaybackRestrictionPolicyRequest,
) => Effect.Effect<
  CreatePlaybackRestrictionPolicyResponse,
  | AccessDeniedException
  | PendingVerification
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createRecordingConfiguration: (
  input: CreateRecordingConfigurationRequest,
) => Effect.Effect<
  CreateRecordingConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | PendingVerification
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Gets metadata on a specified stream.
 */
export const getStreamSession: (
  input: GetStreamSessionRequest,
) => Effect.Effect<
  GetStreamSessionResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStreamSessionRequest,
  output: GetStreamSessionResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
