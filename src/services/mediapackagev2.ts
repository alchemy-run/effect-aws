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
  sdkId: "MediaPackageV2",
  serviceShapeName: "mediapackagev2",
});
const auth = T.AwsAuthSigv4({ name: "mediapackagev2" });
const ver = T.ServiceVersion("2022-12-25");
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
                                url: "https://mediapackagev2-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://mediapackagev2-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://mediapackagev2.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://mediapackagev2.{Region}.{PartitionResult#dnsSuffix}",
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
export type TagArn = string;
export type TagKey = string;
export type ResourceName = string;
export type IdempotencyToken = string;
export type ResourceDescription = string;
export type EntityTag = string;
export type ListResourceMaxResults = number;
export type PolicyText = string;
export type TagValue = string;
export type ManifestName = string;
export type CdnIdentifierSecretArn = string;
export type S3BucketName = string;
export type S3DestinationPath = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
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
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
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
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface CreateChannelGroupRequest {
  ChannelGroupName: string;
  ClientToken?: string;
  Description?: string;
  Tags?: TagMap;
}
export const CreateChannelGroupRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String,
    ClientToken: S.optional(S.String).pipe(T.HttpHeader("x-amzn-client-token")),
    Description: S.optional(S.String),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/channelGroup" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateChannelGroupRequest",
}) as any as S.Schema<CreateChannelGroupRequest>;
export interface GetChannelGroupRequest {
  ChannelGroupName: string;
}
export const GetChannelGroupRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/channelGroup/{ChannelGroupName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetChannelGroupRequest",
}) as any as S.Schema<GetChannelGroupRequest>;
export interface UpdateChannelGroupRequest {
  ChannelGroupName: string;
  ETag?: string;
  Description?: string;
}
export const UpdateChannelGroupRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("x-amzn-update-if-match")),
    Description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/channelGroup/{ChannelGroupName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateChannelGroupRequest",
}) as any as S.Schema<UpdateChannelGroupRequest>;
export interface DeleteChannelGroupRequest {
  ChannelGroupName: string;
}
export const DeleteChannelGroupRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/channelGroup/{ChannelGroupName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteChannelGroupRequest",
}) as any as S.Schema<DeleteChannelGroupRequest>;
export interface DeleteChannelGroupResponse {}
export const DeleteChannelGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteChannelGroupResponse",
}) as any as S.Schema<DeleteChannelGroupResponse>;
export interface ListChannelGroupsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListChannelGroupsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/channelGroup" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListChannelGroupsRequest",
}) as any as S.Schema<ListChannelGroupsRequest>;
export interface GetChannelRequest {
  ChannelGroupName: string;
  ChannelName: string;
}
export const GetChannelRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/channelGroup/{ChannelGroupName}/channel/{ChannelName}/",
      }),
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
export interface InputSwitchConfiguration {
  MQCSInputSwitching?: boolean;
  PreferredInput?: number;
}
export const InputSwitchConfiguration = S.suspend(() =>
  S.Struct({
    MQCSInputSwitching: S.optional(S.Boolean),
    PreferredInput: S.optional(S.Number),
  }),
).annotations({
  identifier: "InputSwitchConfiguration",
}) as any as S.Schema<InputSwitchConfiguration>;
export interface OutputHeaderConfiguration {
  PublishMQCS?: boolean;
}
export const OutputHeaderConfiguration = S.suspend(() =>
  S.Struct({ PublishMQCS: S.optional(S.Boolean) }),
).annotations({
  identifier: "OutputHeaderConfiguration",
}) as any as S.Schema<OutputHeaderConfiguration>;
export interface UpdateChannelRequest {
  ChannelGroupName: string;
  ChannelName: string;
  ETag?: string;
  Description?: string;
  InputSwitchConfiguration?: InputSwitchConfiguration;
  OutputHeaderConfiguration?: OutputHeaderConfiguration;
}
export const UpdateChannelRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("x-amzn-update-if-match")),
    Description: S.optional(S.String),
    InputSwitchConfiguration: S.optional(InputSwitchConfiguration),
    OutputHeaderConfiguration: S.optional(OutputHeaderConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/channelGroup/{ChannelGroupName}/channel/{ChannelName}/",
      }),
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
export interface DeleteChannelRequest {
  ChannelGroupName: string;
  ChannelName: string;
}
export const DeleteChannelRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/channelGroup/{ChannelGroupName}/channel/{ChannelName}/",
      }),
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
export interface ListChannelsRequest {
  ChannelGroupName: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListChannelsRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/channelGroup/{ChannelGroupName}/channel",
      }),
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
export interface ResetChannelStateRequest {
  ChannelGroupName: string;
  ChannelName: string;
}
export const ResetChannelStateRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/channelGroup/{ChannelGroupName}/channel/{ChannelName}/reset",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ResetChannelStateRequest",
}) as any as S.Schema<ResetChannelStateRequest>;
export interface PutChannelPolicyRequest {
  ChannelGroupName: string;
  ChannelName: string;
  Policy: string;
}
export const PutChannelPolicyRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    Policy: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/channelGroup/{ChannelGroupName}/channel/{ChannelName}/policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutChannelPolicyRequest",
}) as any as S.Schema<PutChannelPolicyRequest>;
export interface PutChannelPolicyResponse {}
export const PutChannelPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutChannelPolicyResponse",
}) as any as S.Schema<PutChannelPolicyResponse>;
export interface GetChannelPolicyRequest {
  ChannelGroupName: string;
  ChannelName: string;
}
export const GetChannelPolicyRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/channelGroup/{ChannelGroupName}/channel/{ChannelName}/policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetChannelPolicyRequest",
}) as any as S.Schema<GetChannelPolicyRequest>;
export interface DeleteChannelPolicyRequest {
  ChannelGroupName: string;
  ChannelName: string;
}
export const DeleteChannelPolicyRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/channelGroup/{ChannelGroupName}/channel/{ChannelName}/policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteChannelPolicyRequest",
}) as any as S.Schema<DeleteChannelPolicyRequest>;
export interface DeleteChannelPolicyResponse {}
export const DeleteChannelPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteChannelPolicyResponse",
}) as any as S.Schema<DeleteChannelPolicyResponse>;
export interface GetOriginEndpointRequest {
  ChannelGroupName: string;
  ChannelName: string;
  OriginEndpointName: string;
}
export const GetOriginEndpointRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    OriginEndpointName: S.String.pipe(T.HttpLabel("OriginEndpointName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/channelGroup/{ChannelGroupName}/channel/{ChannelName}/originEndpoint/{OriginEndpointName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetOriginEndpointRequest",
}) as any as S.Schema<GetOriginEndpointRequest>;
export type ScteFilterList = string[];
export const ScteFilterList = S.Array(S.String);
export interface Scte {
  ScteFilter?: ScteFilterList;
  ScteInSegments?: string;
}
export const Scte = S.suspend(() =>
  S.Struct({
    ScteFilter: S.optional(ScteFilterList),
    ScteInSegments: S.optional(S.String),
  }),
).annotations({ identifier: "Scte" }) as any as S.Schema<Scte>;
export interface EncryptionMethod {
  TsEncryptionMethod?: string;
  CmafEncryptionMethod?: string;
  IsmEncryptionMethod?: string;
}
export const EncryptionMethod = S.suspend(() =>
  S.Struct({
    TsEncryptionMethod: S.optional(S.String),
    CmafEncryptionMethod: S.optional(S.String),
    IsmEncryptionMethod: S.optional(S.String),
  }),
).annotations({
  identifier: "EncryptionMethod",
}) as any as S.Schema<EncryptionMethod>;
export interface EncryptionContractConfiguration {
  PresetSpeke20Audio: string;
  PresetSpeke20Video: string;
}
export const EncryptionContractConfiguration = S.suspend(() =>
  S.Struct({ PresetSpeke20Audio: S.String, PresetSpeke20Video: S.String }),
).annotations({
  identifier: "EncryptionContractConfiguration",
}) as any as S.Schema<EncryptionContractConfiguration>;
export type DrmSystems = string[];
export const DrmSystems = S.Array(S.String);
export interface SpekeKeyProvider {
  EncryptionContractConfiguration: EncryptionContractConfiguration;
  ResourceId: string;
  DrmSystems: DrmSystems;
  RoleArn: string;
  Url: string;
  CertificateArn?: string;
}
export const SpekeKeyProvider = S.suspend(() =>
  S.Struct({
    EncryptionContractConfiguration: EncryptionContractConfiguration,
    ResourceId: S.String,
    DrmSystems: DrmSystems,
    RoleArn: S.String,
    Url: S.String,
    CertificateArn: S.optional(S.String),
  }),
).annotations({
  identifier: "SpekeKeyProvider",
}) as any as S.Schema<SpekeKeyProvider>;
export interface Encryption {
  ConstantInitializationVector?: string;
  EncryptionMethod: EncryptionMethod;
  KeyRotationIntervalSeconds?: number;
  CmafExcludeSegmentDrmMetadata?: boolean;
  SpekeKeyProvider: SpekeKeyProvider;
}
export const Encryption = S.suspend(() =>
  S.Struct({
    ConstantInitializationVector: S.optional(S.String),
    EncryptionMethod: EncryptionMethod,
    KeyRotationIntervalSeconds: S.optional(S.Number),
    CmafExcludeSegmentDrmMetadata: S.optional(S.Boolean),
    SpekeKeyProvider: SpekeKeyProvider,
  }),
).annotations({ identifier: "Encryption" }) as any as S.Schema<Encryption>;
export interface Segment {
  SegmentDurationSeconds?: number;
  SegmentName?: string;
  TsUseAudioRenditionGroup?: boolean;
  IncludeIframeOnlyStreams?: boolean;
  TsIncludeDvbSubtitles?: boolean;
  Scte?: Scte;
  Encryption?: Encryption;
}
export const Segment = S.suspend(() =>
  S.Struct({
    SegmentDurationSeconds: S.optional(S.Number),
    SegmentName: S.optional(S.String),
    TsUseAudioRenditionGroup: S.optional(S.Boolean),
    IncludeIframeOnlyStreams: S.optional(S.Boolean),
    TsIncludeDvbSubtitles: S.optional(S.Boolean),
    Scte: S.optional(Scte),
    Encryption: S.optional(Encryption),
  }),
).annotations({ identifier: "Segment" }) as any as S.Schema<Segment>;
export interface ScteHls {
  AdMarkerHls?: string;
}
export const ScteHls = S.suspend(() =>
  S.Struct({ AdMarkerHls: S.optional(S.String) }),
).annotations({ identifier: "ScteHls" }) as any as S.Schema<ScteHls>;
export interface StartTag {
  TimeOffset: number;
  Precise?: boolean;
}
export const StartTag = S.suspend(() =>
  S.Struct({ TimeOffset: S.Number, Precise: S.optional(S.Boolean) }),
).annotations({ identifier: "StartTag" }) as any as S.Schema<StartTag>;
export interface FilterConfiguration {
  ManifestFilter?: string;
  DrmSettings?: string;
  Start?: Date;
  End?: Date;
  TimeDelaySeconds?: number;
  ClipStartTime?: Date;
}
export const FilterConfiguration = S.suspend(() =>
  S.Struct({
    ManifestFilter: S.optional(S.String),
    DrmSettings: S.optional(S.String),
    Start: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    End: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    TimeDelaySeconds: S.optional(S.Number),
    ClipStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "FilterConfiguration",
}) as any as S.Schema<FilterConfiguration>;
export interface CreateHlsManifestConfiguration {
  ManifestName: string;
  ChildManifestName?: string;
  ScteHls?: ScteHls;
  StartTag?: StartTag;
  ManifestWindowSeconds?: number;
  ProgramDateTimeIntervalSeconds?: number;
  FilterConfiguration?: FilterConfiguration;
  UrlEncodeChildManifest?: boolean;
}
export const CreateHlsManifestConfiguration = S.suspend(() =>
  S.Struct({
    ManifestName: S.String,
    ChildManifestName: S.optional(S.String),
    ScteHls: S.optional(ScteHls),
    StartTag: S.optional(StartTag),
    ManifestWindowSeconds: S.optional(S.Number),
    ProgramDateTimeIntervalSeconds: S.optional(S.Number),
    FilterConfiguration: S.optional(FilterConfiguration),
    UrlEncodeChildManifest: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CreateHlsManifestConfiguration",
}) as any as S.Schema<CreateHlsManifestConfiguration>;
export type CreateHlsManifests = CreateHlsManifestConfiguration[];
export const CreateHlsManifests = S.Array(CreateHlsManifestConfiguration);
export interface CreateLowLatencyHlsManifestConfiguration {
  ManifestName: string;
  ChildManifestName?: string;
  ScteHls?: ScteHls;
  StartTag?: StartTag;
  ManifestWindowSeconds?: number;
  ProgramDateTimeIntervalSeconds?: number;
  FilterConfiguration?: FilterConfiguration;
  UrlEncodeChildManifest?: boolean;
}
export const CreateLowLatencyHlsManifestConfiguration = S.suspend(() =>
  S.Struct({
    ManifestName: S.String,
    ChildManifestName: S.optional(S.String),
    ScteHls: S.optional(ScteHls),
    StartTag: S.optional(StartTag),
    ManifestWindowSeconds: S.optional(S.Number),
    ProgramDateTimeIntervalSeconds: S.optional(S.Number),
    FilterConfiguration: S.optional(FilterConfiguration),
    UrlEncodeChildManifest: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CreateLowLatencyHlsManifestConfiguration",
}) as any as S.Schema<CreateLowLatencyHlsManifestConfiguration>;
export type CreateLowLatencyHlsManifests =
  CreateLowLatencyHlsManifestConfiguration[];
export const CreateLowLatencyHlsManifests = S.Array(
  CreateLowLatencyHlsManifestConfiguration,
);
export type DashPeriodTriggers = string[];
export const DashPeriodTriggers = S.Array(S.String);
export interface ScteDash {
  AdMarkerDash?: string;
}
export const ScteDash = S.suspend(() =>
  S.Struct({ AdMarkerDash: S.optional(S.String) }),
).annotations({ identifier: "ScteDash" }) as any as S.Schema<ScteDash>;
export interface DashUtcTiming {
  TimingMode?: string;
  TimingSource?: string;
}
export const DashUtcTiming = S.suspend(() =>
  S.Struct({
    TimingMode: S.optional(S.String),
    TimingSource: S.optional(S.String),
  }),
).annotations({
  identifier: "DashUtcTiming",
}) as any as S.Schema<DashUtcTiming>;
export type DashProfiles = string[];
export const DashProfiles = S.Array(S.String);
export interface DashBaseUrl {
  Url: string;
  ServiceLocation?: string;
  DvbPriority?: number;
  DvbWeight?: number;
}
export const DashBaseUrl = S.suspend(() =>
  S.Struct({
    Url: S.String,
    ServiceLocation: S.optional(S.String),
    DvbPriority: S.optional(S.Number),
    DvbWeight: S.optional(S.Number),
  }),
).annotations({ identifier: "DashBaseUrl" }) as any as S.Schema<DashBaseUrl>;
export type DashBaseUrls = DashBaseUrl[];
export const DashBaseUrls = S.Array(DashBaseUrl);
export interface DashProgramInformation {
  Title?: string;
  Source?: string;
  Copyright?: string;
  LanguageCode?: string;
  MoreInformationUrl?: string;
}
export const DashProgramInformation = S.suspend(() =>
  S.Struct({
    Title: S.optional(S.String),
    Source: S.optional(S.String),
    Copyright: S.optional(S.String),
    LanguageCode: S.optional(S.String),
    MoreInformationUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "DashProgramInformation",
}) as any as S.Schema<DashProgramInformation>;
export interface DashDvbFontDownload {
  Url?: string;
  MimeType?: string;
  FontFamily?: string;
}
export const DashDvbFontDownload = S.suspend(() =>
  S.Struct({
    Url: S.optional(S.String),
    MimeType: S.optional(S.String),
    FontFamily: S.optional(S.String),
  }),
).annotations({
  identifier: "DashDvbFontDownload",
}) as any as S.Schema<DashDvbFontDownload>;
export interface DashDvbMetricsReporting {
  ReportingUrl: string;
  Probability?: number;
}
export const DashDvbMetricsReporting = S.suspend(() =>
  S.Struct({ ReportingUrl: S.String, Probability: S.optional(S.Number) }),
).annotations({
  identifier: "DashDvbMetricsReporting",
}) as any as S.Schema<DashDvbMetricsReporting>;
export type DashDvbErrorMetrics = DashDvbMetricsReporting[];
export const DashDvbErrorMetrics = S.Array(DashDvbMetricsReporting);
export interface DashDvbSettings {
  FontDownload?: DashDvbFontDownload;
  ErrorMetrics?: DashDvbErrorMetrics;
}
export const DashDvbSettings = S.suspend(() =>
  S.Struct({
    FontDownload: S.optional(DashDvbFontDownload),
    ErrorMetrics: S.optional(DashDvbErrorMetrics),
  }),
).annotations({
  identifier: "DashDvbSettings",
}) as any as S.Schema<DashDvbSettings>;
export interface DashTtmlConfiguration {
  TtmlProfile: string;
}
export const DashTtmlConfiguration = S.suspend(() =>
  S.Struct({ TtmlProfile: S.String }),
).annotations({
  identifier: "DashTtmlConfiguration",
}) as any as S.Schema<DashTtmlConfiguration>;
export interface DashSubtitleConfiguration {
  TtmlConfiguration?: DashTtmlConfiguration;
}
export const DashSubtitleConfiguration = S.suspend(() =>
  S.Struct({ TtmlConfiguration: S.optional(DashTtmlConfiguration) }),
).annotations({
  identifier: "DashSubtitleConfiguration",
}) as any as S.Schema<DashSubtitleConfiguration>;
export interface CreateDashManifestConfiguration {
  ManifestName: string;
  ManifestWindowSeconds?: number;
  FilterConfiguration?: FilterConfiguration;
  MinUpdatePeriodSeconds?: number;
  MinBufferTimeSeconds?: number;
  SuggestedPresentationDelaySeconds?: number;
  SegmentTemplateFormat?: string;
  PeriodTriggers?: DashPeriodTriggers;
  ScteDash?: ScteDash;
  DrmSignaling?: string;
  UtcTiming?: DashUtcTiming;
  Profiles?: DashProfiles;
  BaseUrls?: DashBaseUrls;
  ProgramInformation?: DashProgramInformation;
  DvbSettings?: DashDvbSettings;
  Compactness?: string;
  SubtitleConfiguration?: DashSubtitleConfiguration;
}
export const CreateDashManifestConfiguration = S.suspend(() =>
  S.Struct({
    ManifestName: S.String,
    ManifestWindowSeconds: S.optional(S.Number),
    FilterConfiguration: S.optional(FilterConfiguration),
    MinUpdatePeriodSeconds: S.optional(S.Number),
    MinBufferTimeSeconds: S.optional(S.Number),
    SuggestedPresentationDelaySeconds: S.optional(S.Number),
    SegmentTemplateFormat: S.optional(S.String),
    PeriodTriggers: S.optional(DashPeriodTriggers),
    ScteDash: S.optional(ScteDash),
    DrmSignaling: S.optional(S.String),
    UtcTiming: S.optional(DashUtcTiming),
    Profiles: S.optional(DashProfiles),
    BaseUrls: S.optional(DashBaseUrls),
    ProgramInformation: S.optional(DashProgramInformation),
    DvbSettings: S.optional(DashDvbSettings),
    Compactness: S.optional(S.String),
    SubtitleConfiguration: S.optional(DashSubtitleConfiguration),
  }),
).annotations({
  identifier: "CreateDashManifestConfiguration",
}) as any as S.Schema<CreateDashManifestConfiguration>;
export type CreateDashManifests = CreateDashManifestConfiguration[];
export const CreateDashManifests = S.Array(CreateDashManifestConfiguration);
export interface CreateMssManifestConfiguration {
  ManifestName: string;
  ManifestWindowSeconds?: number;
  FilterConfiguration?: FilterConfiguration;
  ManifestLayout?: string;
}
export const CreateMssManifestConfiguration = S.suspend(() =>
  S.Struct({
    ManifestName: S.String,
    ManifestWindowSeconds: S.optional(S.Number),
    FilterConfiguration: S.optional(FilterConfiguration),
    ManifestLayout: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateMssManifestConfiguration",
}) as any as S.Schema<CreateMssManifestConfiguration>;
export type CreateMssManifests = CreateMssManifestConfiguration[];
export const CreateMssManifests = S.Array(CreateMssManifestConfiguration);
export type EndpointErrorConditions = string[];
export const EndpointErrorConditions = S.Array(S.String);
export interface ForceEndpointErrorConfiguration {
  EndpointErrorConditions?: EndpointErrorConditions;
}
export const ForceEndpointErrorConfiguration = S.suspend(() =>
  S.Struct({ EndpointErrorConditions: S.optional(EndpointErrorConditions) }),
).annotations({
  identifier: "ForceEndpointErrorConfiguration",
}) as any as S.Schema<ForceEndpointErrorConfiguration>;
export interface UpdateOriginEndpointRequest {
  ChannelGroupName: string;
  ChannelName: string;
  OriginEndpointName: string;
  ContainerType: string;
  Segment?: Segment;
  Description?: string;
  StartoverWindowSeconds?: number;
  HlsManifests?: CreateHlsManifests;
  LowLatencyHlsManifests?: CreateLowLatencyHlsManifests;
  DashManifests?: CreateDashManifests;
  MssManifests?: CreateMssManifests;
  ForceEndpointErrorConfiguration?: ForceEndpointErrorConfiguration;
  ETag?: string;
}
export const UpdateOriginEndpointRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    OriginEndpointName: S.String.pipe(T.HttpLabel("OriginEndpointName")),
    ContainerType: S.String,
    Segment: S.optional(Segment),
    Description: S.optional(S.String),
    StartoverWindowSeconds: S.optional(S.Number),
    HlsManifests: S.optional(CreateHlsManifests),
    LowLatencyHlsManifests: S.optional(CreateLowLatencyHlsManifests),
    DashManifests: S.optional(CreateDashManifests),
    MssManifests: S.optional(CreateMssManifests),
    ForceEndpointErrorConfiguration: S.optional(
      ForceEndpointErrorConfiguration,
    ),
    ETag: S.optional(S.String).pipe(T.HttpHeader("x-amzn-update-if-match")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/channelGroup/{ChannelGroupName}/channel/{ChannelName}/originEndpoint/{OriginEndpointName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateOriginEndpointRequest",
}) as any as S.Schema<UpdateOriginEndpointRequest>;
export interface DeleteOriginEndpointRequest {
  ChannelGroupName: string;
  ChannelName: string;
  OriginEndpointName: string;
}
export const DeleteOriginEndpointRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    OriginEndpointName: S.String.pipe(T.HttpLabel("OriginEndpointName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/channelGroup/{ChannelGroupName}/channel/{ChannelName}/originEndpoint/{OriginEndpointName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteOriginEndpointRequest",
}) as any as S.Schema<DeleteOriginEndpointRequest>;
export interface DeleteOriginEndpointResponse {}
export const DeleteOriginEndpointResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteOriginEndpointResponse",
}) as any as S.Schema<DeleteOriginEndpointResponse>;
export interface ListOriginEndpointsRequest {
  ChannelGroupName: string;
  ChannelName: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListOriginEndpointsRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/channelGroup/{ChannelGroupName}/channel/{ChannelName}/originEndpoint",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOriginEndpointsRequest",
}) as any as S.Schema<ListOriginEndpointsRequest>;
export interface ResetOriginEndpointStateRequest {
  ChannelGroupName: string;
  ChannelName: string;
  OriginEndpointName: string;
}
export const ResetOriginEndpointStateRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    OriginEndpointName: S.String.pipe(T.HttpLabel("OriginEndpointName")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/channelGroup/{ChannelGroupName}/channel/{ChannelName}/originEndpoint/{OriginEndpointName}/reset",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ResetOriginEndpointStateRequest",
}) as any as S.Schema<ResetOriginEndpointStateRequest>;
export interface GetOriginEndpointPolicyRequest {
  ChannelGroupName: string;
  ChannelName: string;
  OriginEndpointName: string;
}
export const GetOriginEndpointPolicyRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    OriginEndpointName: S.String.pipe(T.HttpLabel("OriginEndpointName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/channelGroup/{ChannelGroupName}/channel/{ChannelName}/originEndpoint/{OriginEndpointName}/policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetOriginEndpointPolicyRequest",
}) as any as S.Schema<GetOriginEndpointPolicyRequest>;
export interface DeleteOriginEndpointPolicyRequest {
  ChannelGroupName: string;
  ChannelName: string;
  OriginEndpointName: string;
}
export const DeleteOriginEndpointPolicyRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    OriginEndpointName: S.String.pipe(T.HttpLabel("OriginEndpointName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/channelGroup/{ChannelGroupName}/channel/{ChannelName}/originEndpoint/{OriginEndpointName}/policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteOriginEndpointPolicyRequest",
}) as any as S.Schema<DeleteOriginEndpointPolicyRequest>;
export interface DeleteOriginEndpointPolicyResponse {}
export const DeleteOriginEndpointPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteOriginEndpointPolicyResponse",
}) as any as S.Schema<DeleteOriginEndpointPolicyResponse>;
export interface GetHarvestJobRequest {
  ChannelGroupName: string;
  ChannelName: string;
  OriginEndpointName: string;
  HarvestJobName: string;
}
export const GetHarvestJobRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    OriginEndpointName: S.String.pipe(T.HttpLabel("OriginEndpointName")),
    HarvestJobName: S.String.pipe(T.HttpLabel("HarvestJobName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/channelGroup/{ChannelGroupName}/channel/{ChannelName}/originEndpoint/{OriginEndpointName}/harvestJob/{HarvestJobName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetHarvestJobRequest",
}) as any as S.Schema<GetHarvestJobRequest>;
export interface CancelHarvestJobRequest {
  ChannelGroupName: string;
  ChannelName: string;
  OriginEndpointName: string;
  HarvestJobName: string;
  ETag?: string;
}
export const CancelHarvestJobRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    OriginEndpointName: S.String.pipe(T.HttpLabel("OriginEndpointName")),
    HarvestJobName: S.String.pipe(T.HttpLabel("HarvestJobName")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("x-amzn-update-if-match")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/channelGroup/{ChannelGroupName}/channel/{ChannelName}/originEndpoint/{OriginEndpointName}/harvestJob/{HarvestJobName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelHarvestJobRequest",
}) as any as S.Schema<CancelHarvestJobRequest>;
export interface CancelHarvestJobResponse {}
export const CancelHarvestJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelHarvestJobResponse",
}) as any as S.Schema<CancelHarvestJobResponse>;
export interface ListHarvestJobsRequest {
  ChannelGroupName: string;
  ChannelName?: string;
  OriginEndpointName?: string;
  Status?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListHarvestJobsRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.optional(S.String).pipe(T.HttpQuery("channelName")),
    OriginEndpointName: S.optional(S.String).pipe(
      T.HttpQuery("originEndpointName"),
    ),
    Status: S.optional(S.String).pipe(T.HttpQuery("includeStatus")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/channelGroup/{ChannelGroupName}/harvestJob",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListHarvestJobsRequest",
}) as any as S.Schema<ListHarvestJobsRequest>;
export type CdnIdentifierSecretArns = string[];
export const CdnIdentifierSecretArns = S.Array(S.String);
export interface CdnAuthConfiguration {
  CdnIdentifierSecretArns: CdnIdentifierSecretArns;
  SecretsRoleArn: string;
}
export const CdnAuthConfiguration = S.suspend(() =>
  S.Struct({
    CdnIdentifierSecretArns: CdnIdentifierSecretArns,
    SecretsRoleArn: S.String,
  }),
).annotations({
  identifier: "CdnAuthConfiguration",
}) as any as S.Schema<CdnAuthConfiguration>;
export interface HarvesterScheduleConfiguration {
  StartTime: Date;
  EndTime: Date;
}
export const HarvesterScheduleConfiguration = S.suspend(() =>
  S.Struct({
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "HarvesterScheduleConfiguration",
}) as any as S.Schema<HarvesterScheduleConfiguration>;
export interface ListTagsForResourceResponse {
  Tags?: TagMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagMap).pipe(T.JsonName("tags")) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: TagMap;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: TagMap.pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
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
export interface CreateChannelGroupResponse {
  ChannelGroupName: string;
  Arn: string;
  EgressDomain: string;
  CreatedAt: Date;
  ModifiedAt: Date;
  ETag?: string;
  Description?: string;
  Tags?: TagMap;
}
export const CreateChannelGroupResponse = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String,
    Arn: S.String,
    EgressDomain: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ETag: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "CreateChannelGroupResponse",
}) as any as S.Schema<CreateChannelGroupResponse>;
export interface GetChannelGroupResponse {
  ChannelGroupName: string;
  Arn: string;
  EgressDomain: string;
  CreatedAt: Date;
  ModifiedAt: Date;
  Description?: string;
  ETag?: string;
  Tags?: TagMap;
}
export const GetChannelGroupResponse = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String,
    Arn: S.String,
    EgressDomain: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Description: S.optional(S.String),
    ETag: S.optional(S.String),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "GetChannelGroupResponse",
}) as any as S.Schema<GetChannelGroupResponse>;
export interface UpdateChannelGroupResponse {
  ChannelGroupName: string;
  Arn: string;
  EgressDomain: string;
  CreatedAt: Date;
  ModifiedAt: Date;
  Description?: string;
  ETag?: string;
  Tags?: TagMap;
}
export const UpdateChannelGroupResponse = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String,
    Arn: S.String,
    EgressDomain: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Description: S.optional(S.String),
    ETag: S.optional(S.String),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "UpdateChannelGroupResponse",
}) as any as S.Schema<UpdateChannelGroupResponse>;
export interface CreateChannelRequest {
  ChannelGroupName: string;
  ChannelName: string;
  ClientToken?: string;
  InputType?: string;
  Description?: string;
  InputSwitchConfiguration?: InputSwitchConfiguration;
  OutputHeaderConfiguration?: OutputHeaderConfiguration;
  Tags?: TagMap;
}
export const CreateChannelRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String,
    ClientToken: S.optional(S.String).pipe(T.HttpHeader("x-amzn-client-token")),
    InputType: S.optional(S.String),
    Description: S.optional(S.String),
    InputSwitchConfiguration: S.optional(InputSwitchConfiguration),
    OutputHeaderConfiguration: S.optional(OutputHeaderConfiguration),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/channelGroup/{ChannelGroupName}/channel",
      }),
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
export interface IngestEndpoint {
  Id?: string;
  Url?: string;
}
export const IngestEndpoint = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String), Url: S.optional(S.String) }),
).annotations({
  identifier: "IngestEndpoint",
}) as any as S.Schema<IngestEndpoint>;
export type IngestEndpointList = IngestEndpoint[];
export const IngestEndpointList = S.Array(IngestEndpoint);
export interface UpdateChannelResponse {
  Arn: string;
  ChannelName: string;
  ChannelGroupName: string;
  CreatedAt: Date;
  ModifiedAt: Date;
  Description?: string;
  IngestEndpoints?: IngestEndpointList;
  InputType?: string;
  ETag?: string;
  Tags?: TagMap;
  InputSwitchConfiguration?: InputSwitchConfiguration;
  OutputHeaderConfiguration?: OutputHeaderConfiguration;
}
export const UpdateChannelResponse = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    ChannelName: S.String,
    ChannelGroupName: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Description: S.optional(S.String),
    IngestEndpoints: S.optional(IngestEndpointList),
    InputType: S.optional(S.String),
    ETag: S.optional(S.String),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    InputSwitchConfiguration: S.optional(InputSwitchConfiguration),
    OutputHeaderConfiguration: S.optional(OutputHeaderConfiguration),
  }),
).annotations({
  identifier: "UpdateChannelResponse",
}) as any as S.Schema<UpdateChannelResponse>;
export interface ResetChannelStateResponse {
  ChannelGroupName: string;
  ChannelName: string;
  Arn: string;
  ResetAt: Date;
}
export const ResetChannelStateResponse = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String,
    ChannelName: S.String,
    Arn: S.String,
    ResetAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ResetChannelStateResponse",
}) as any as S.Schema<ResetChannelStateResponse>;
export interface GetChannelPolicyResponse {
  ChannelGroupName: string;
  ChannelName: string;
  Policy: string;
}
export const GetChannelPolicyResponse = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String,
    ChannelName: S.String,
    Policy: S.String,
  }),
).annotations({
  identifier: "GetChannelPolicyResponse",
}) as any as S.Schema<GetChannelPolicyResponse>;
export interface GetHlsManifestConfiguration {
  ManifestName: string;
  Url: string;
  ChildManifestName?: string;
  ManifestWindowSeconds?: number;
  ProgramDateTimeIntervalSeconds?: number;
  ScteHls?: ScteHls;
  FilterConfiguration?: FilterConfiguration;
  StartTag?: StartTag;
  UrlEncodeChildManifest?: boolean;
}
export const GetHlsManifestConfiguration = S.suspend(() =>
  S.Struct({
    ManifestName: S.String,
    Url: S.String,
    ChildManifestName: S.optional(S.String),
    ManifestWindowSeconds: S.optional(S.Number),
    ProgramDateTimeIntervalSeconds: S.optional(S.Number),
    ScteHls: S.optional(ScteHls),
    FilterConfiguration: S.optional(FilterConfiguration),
    StartTag: S.optional(StartTag),
    UrlEncodeChildManifest: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GetHlsManifestConfiguration",
}) as any as S.Schema<GetHlsManifestConfiguration>;
export type GetHlsManifests = GetHlsManifestConfiguration[];
export const GetHlsManifests = S.Array(GetHlsManifestConfiguration);
export interface GetLowLatencyHlsManifestConfiguration {
  ManifestName: string;
  Url: string;
  ChildManifestName?: string;
  ManifestWindowSeconds?: number;
  ProgramDateTimeIntervalSeconds?: number;
  ScteHls?: ScteHls;
  FilterConfiguration?: FilterConfiguration;
  StartTag?: StartTag;
  UrlEncodeChildManifest?: boolean;
}
export const GetLowLatencyHlsManifestConfiguration = S.suspend(() =>
  S.Struct({
    ManifestName: S.String,
    Url: S.String,
    ChildManifestName: S.optional(S.String),
    ManifestWindowSeconds: S.optional(S.Number),
    ProgramDateTimeIntervalSeconds: S.optional(S.Number),
    ScteHls: S.optional(ScteHls),
    FilterConfiguration: S.optional(FilterConfiguration),
    StartTag: S.optional(StartTag),
    UrlEncodeChildManifest: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GetLowLatencyHlsManifestConfiguration",
}) as any as S.Schema<GetLowLatencyHlsManifestConfiguration>;
export type GetLowLatencyHlsManifests = GetLowLatencyHlsManifestConfiguration[];
export const GetLowLatencyHlsManifests = S.Array(
  GetLowLatencyHlsManifestConfiguration,
);
export interface GetMssManifestConfiguration {
  ManifestName: string;
  Url: string;
  FilterConfiguration?: FilterConfiguration;
  ManifestWindowSeconds?: number;
  ManifestLayout?: string;
}
export const GetMssManifestConfiguration = S.suspend(() =>
  S.Struct({
    ManifestName: S.String,
    Url: S.String,
    FilterConfiguration: S.optional(FilterConfiguration),
    ManifestWindowSeconds: S.optional(S.Number),
    ManifestLayout: S.optional(S.String),
  }),
).annotations({
  identifier: "GetMssManifestConfiguration",
}) as any as S.Schema<GetMssManifestConfiguration>;
export type GetMssManifests = GetMssManifestConfiguration[];
export const GetMssManifests = S.Array(GetMssManifestConfiguration);
export interface GetDashManifestConfiguration {
  ManifestName: string;
  Url: string;
  ManifestWindowSeconds?: number;
  FilterConfiguration?: FilterConfiguration;
  MinUpdatePeriodSeconds?: number;
  MinBufferTimeSeconds?: number;
  SuggestedPresentationDelaySeconds?: number;
  SegmentTemplateFormat?: string;
  PeriodTriggers?: DashPeriodTriggers;
  ScteDash?: ScteDash;
  DrmSignaling?: string;
  UtcTiming?: DashUtcTiming;
  Profiles?: DashProfiles;
  BaseUrls?: DashBaseUrls;
  ProgramInformation?: DashProgramInformation;
  DvbSettings?: DashDvbSettings;
  Compactness?: string;
  SubtitleConfiguration?: DashSubtitleConfiguration;
}
export const GetDashManifestConfiguration = S.suspend(() =>
  S.Struct({
    ManifestName: S.String,
    Url: S.String,
    ManifestWindowSeconds: S.optional(S.Number),
    FilterConfiguration: S.optional(FilterConfiguration),
    MinUpdatePeriodSeconds: S.optional(S.Number),
    MinBufferTimeSeconds: S.optional(S.Number),
    SuggestedPresentationDelaySeconds: S.optional(S.Number),
    SegmentTemplateFormat: S.optional(S.String),
    PeriodTriggers: S.optional(DashPeriodTriggers),
    ScteDash: S.optional(ScteDash),
    DrmSignaling: S.optional(S.String),
    UtcTiming: S.optional(DashUtcTiming),
    Profiles: S.optional(DashProfiles),
    BaseUrls: S.optional(DashBaseUrls),
    ProgramInformation: S.optional(DashProgramInformation),
    DvbSettings: S.optional(DashDvbSettings),
    Compactness: S.optional(S.String),
    SubtitleConfiguration: S.optional(DashSubtitleConfiguration),
  }),
).annotations({
  identifier: "GetDashManifestConfiguration",
}) as any as S.Schema<GetDashManifestConfiguration>;
export type GetDashManifests = GetDashManifestConfiguration[];
export const GetDashManifests = S.Array(GetDashManifestConfiguration);
export interface UpdateOriginEndpointResponse {
  Arn: string;
  ChannelGroupName: string;
  ChannelName: string;
  OriginEndpointName: string;
  ContainerType: string;
  Segment: Segment;
  CreatedAt: Date;
  ModifiedAt: Date;
  Description?: string;
  StartoverWindowSeconds?: number;
  HlsManifests?: GetHlsManifests;
  LowLatencyHlsManifests?: GetLowLatencyHlsManifests;
  MssManifests?: GetMssManifests;
  ForceEndpointErrorConfiguration?: ForceEndpointErrorConfiguration;
  ETag?: string;
  Tags?: TagMap;
  DashManifests?: GetDashManifests;
}
export const UpdateOriginEndpointResponse = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    ChannelGroupName: S.String,
    ChannelName: S.String,
    OriginEndpointName: S.String,
    ContainerType: S.String,
    Segment: Segment,
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Description: S.optional(S.String),
    StartoverWindowSeconds: S.optional(S.Number),
    HlsManifests: S.optional(GetHlsManifests),
    LowLatencyHlsManifests: S.optional(GetLowLatencyHlsManifests),
    MssManifests: S.optional(GetMssManifests),
    ForceEndpointErrorConfiguration: S.optional(
      ForceEndpointErrorConfiguration,
    ),
    ETag: S.optional(S.String),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    DashManifests: S.optional(GetDashManifests),
  }),
).annotations({
  identifier: "UpdateOriginEndpointResponse",
}) as any as S.Schema<UpdateOriginEndpointResponse>;
export interface ResetOriginEndpointStateResponse {
  ChannelGroupName: string;
  ChannelName: string;
  OriginEndpointName: string;
  Arn: string;
  ResetAt: Date;
}
export const ResetOriginEndpointStateResponse = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String,
    ChannelName: S.String,
    OriginEndpointName: S.String,
    Arn: S.String,
    ResetAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ResetOriginEndpointStateResponse",
}) as any as S.Schema<ResetOriginEndpointStateResponse>;
export interface PutOriginEndpointPolicyRequest {
  ChannelGroupName: string;
  ChannelName: string;
  OriginEndpointName: string;
  Policy: string;
  CdnAuthConfiguration?: CdnAuthConfiguration;
}
export const PutOriginEndpointPolicyRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    OriginEndpointName: S.String.pipe(T.HttpLabel("OriginEndpointName")),
    Policy: S.String,
    CdnAuthConfiguration: S.optional(CdnAuthConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/channelGroup/{ChannelGroupName}/channel/{ChannelName}/originEndpoint/{OriginEndpointName}/policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutOriginEndpointPolicyRequest",
}) as any as S.Schema<PutOriginEndpointPolicyRequest>;
export interface PutOriginEndpointPolicyResponse {}
export const PutOriginEndpointPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutOriginEndpointPolicyResponse",
}) as any as S.Schema<PutOriginEndpointPolicyResponse>;
export interface GetOriginEndpointPolicyResponse {
  ChannelGroupName: string;
  ChannelName: string;
  OriginEndpointName: string;
  Policy: string;
  CdnAuthConfiguration?: CdnAuthConfiguration;
}
export const GetOriginEndpointPolicyResponse = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String,
    ChannelName: S.String,
    OriginEndpointName: S.String,
    Policy: S.String,
    CdnAuthConfiguration: S.optional(CdnAuthConfiguration),
  }),
).annotations({
  identifier: "GetOriginEndpointPolicyResponse",
}) as any as S.Schema<GetOriginEndpointPolicyResponse>;
export interface S3DestinationConfig {
  BucketName: string;
  DestinationPath: string;
}
export const S3DestinationConfig = S.suspend(() =>
  S.Struct({ BucketName: S.String, DestinationPath: S.String }),
).annotations({
  identifier: "S3DestinationConfig",
}) as any as S.Schema<S3DestinationConfig>;
export interface Destination {
  S3Destination: S3DestinationConfig;
}
export const Destination = S.suspend(() =>
  S.Struct({ S3Destination: S3DestinationConfig }),
).annotations({ identifier: "Destination" }) as any as S.Schema<Destination>;
export interface HarvestedHlsManifest {
  ManifestName: string;
}
export const HarvestedHlsManifest = S.suspend(() =>
  S.Struct({ ManifestName: S.String }),
).annotations({
  identifier: "HarvestedHlsManifest",
}) as any as S.Schema<HarvestedHlsManifest>;
export type HarvestedHlsManifestsList = HarvestedHlsManifest[];
export const HarvestedHlsManifestsList = S.Array(HarvestedHlsManifest);
export interface HarvestedDashManifest {
  ManifestName: string;
}
export const HarvestedDashManifest = S.suspend(() =>
  S.Struct({ ManifestName: S.String }),
).annotations({
  identifier: "HarvestedDashManifest",
}) as any as S.Schema<HarvestedDashManifest>;
export type HarvestedDashManifestsList = HarvestedDashManifest[];
export const HarvestedDashManifestsList = S.Array(HarvestedDashManifest);
export interface HarvestedLowLatencyHlsManifest {
  ManifestName: string;
}
export const HarvestedLowLatencyHlsManifest = S.suspend(() =>
  S.Struct({ ManifestName: S.String }),
).annotations({
  identifier: "HarvestedLowLatencyHlsManifest",
}) as any as S.Schema<HarvestedLowLatencyHlsManifest>;
export type HarvestedLowLatencyHlsManifestsList =
  HarvestedLowLatencyHlsManifest[];
export const HarvestedLowLatencyHlsManifestsList = S.Array(
  HarvestedLowLatencyHlsManifest,
);
export interface HarvestedManifests {
  HlsManifests?: HarvestedHlsManifestsList;
  DashManifests?: HarvestedDashManifestsList;
  LowLatencyHlsManifests?: HarvestedLowLatencyHlsManifestsList;
}
export const HarvestedManifests = S.suspend(() =>
  S.Struct({
    HlsManifests: S.optional(HarvestedHlsManifestsList),
    DashManifests: S.optional(HarvestedDashManifestsList),
    LowLatencyHlsManifests: S.optional(HarvestedLowLatencyHlsManifestsList),
  }),
).annotations({
  identifier: "HarvestedManifests",
}) as any as S.Schema<HarvestedManifests>;
export interface GetHarvestJobResponse {
  ChannelGroupName: string;
  ChannelName: string;
  OriginEndpointName: string;
  Destination: Destination;
  HarvestJobName: string;
  HarvestedManifests: HarvestedManifests;
  Description?: string;
  ScheduleConfiguration: HarvesterScheduleConfiguration;
  Arn: string;
  CreatedAt: Date;
  ModifiedAt: Date;
  Status: string;
  ErrorMessage?: string;
  ETag?: string;
  Tags?: TagMap;
}
export const GetHarvestJobResponse = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String,
    ChannelName: S.String,
    OriginEndpointName: S.String,
    Destination: Destination,
    HarvestJobName: S.String,
    HarvestedManifests: HarvestedManifests,
    Description: S.optional(S.String),
    ScheduleConfiguration: HarvesterScheduleConfiguration,
    Arn: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Status: S.String,
    ErrorMessage: S.optional(S.String),
    ETag: S.optional(S.String),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetHarvestJobResponse",
}) as any as S.Schema<GetHarvestJobResponse>;
export interface ChannelGroupListConfiguration {
  ChannelGroupName: string;
  Arn: string;
  CreatedAt: Date;
  ModifiedAt: Date;
  Description?: string;
}
export const ChannelGroupListConfiguration = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String,
    Arn: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Description: S.optional(S.String),
  }),
).annotations({
  identifier: "ChannelGroupListConfiguration",
}) as any as S.Schema<ChannelGroupListConfiguration>;
export type ChannelGroupsList = ChannelGroupListConfiguration[];
export const ChannelGroupsList = S.Array(ChannelGroupListConfiguration);
export interface ChannelListConfiguration {
  Arn: string;
  ChannelName: string;
  ChannelGroupName: string;
  CreatedAt: Date;
  ModifiedAt: Date;
  Description?: string;
  InputType?: string;
}
export const ChannelListConfiguration = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    ChannelName: S.String,
    ChannelGroupName: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Description: S.optional(S.String),
    InputType: S.optional(S.String),
  }),
).annotations({
  identifier: "ChannelListConfiguration",
}) as any as S.Schema<ChannelListConfiguration>;
export type ChannelList = ChannelListConfiguration[];
export const ChannelList = S.Array(ChannelListConfiguration);
export interface HarvestJob {
  ChannelGroupName: string;
  ChannelName: string;
  OriginEndpointName: string;
  Destination: Destination;
  HarvestJobName: string;
  HarvestedManifests: HarvestedManifests;
  Description?: string;
  ScheduleConfiguration: HarvesterScheduleConfiguration;
  Arn: string;
  CreatedAt: Date;
  ModifiedAt: Date;
  Status: string;
  ErrorMessage?: string;
  ETag?: string;
}
export const HarvestJob = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String,
    ChannelName: S.String,
    OriginEndpointName: S.String,
    Destination: Destination,
    HarvestJobName: S.String,
    HarvestedManifests: HarvestedManifests,
    Description: S.optional(S.String),
    ScheduleConfiguration: HarvesterScheduleConfiguration,
    Arn: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Status: S.String,
    ErrorMessage: S.optional(S.String),
    ETag: S.optional(S.String),
  }),
).annotations({ identifier: "HarvestJob" }) as any as S.Schema<HarvestJob>;
export type HarvestJobsList = HarvestJob[];
export const HarvestJobsList = S.Array(HarvestJob);
export interface ListChannelGroupsResponse {
  Items?: ChannelGroupsList;
  NextToken?: string;
}
export const ListChannelGroupsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(ChannelGroupsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListChannelGroupsResponse",
}) as any as S.Schema<ListChannelGroupsResponse>;
export interface CreateChannelResponse {
  Arn: string;
  ChannelName: string;
  ChannelGroupName: string;
  CreatedAt: Date;
  ModifiedAt: Date;
  Description?: string;
  IngestEndpoints?: IngestEndpointList;
  InputType?: string;
  ETag?: string;
  Tags?: TagMap;
  InputSwitchConfiguration?: InputSwitchConfiguration;
  OutputHeaderConfiguration?: OutputHeaderConfiguration;
}
export const CreateChannelResponse = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    ChannelName: S.String,
    ChannelGroupName: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Description: S.optional(S.String),
    IngestEndpoints: S.optional(IngestEndpointList),
    InputType: S.optional(S.String),
    ETag: S.optional(S.String),
    Tags: S.optional(TagMap),
    InputSwitchConfiguration: S.optional(InputSwitchConfiguration),
    OutputHeaderConfiguration: S.optional(OutputHeaderConfiguration),
  }),
).annotations({
  identifier: "CreateChannelResponse",
}) as any as S.Schema<CreateChannelResponse>;
export interface GetChannelResponse {
  Arn: string;
  ChannelName: string;
  ChannelGroupName: string;
  CreatedAt: Date;
  ModifiedAt: Date;
  ResetAt?: Date;
  Description?: string;
  IngestEndpoints?: IngestEndpointList;
  InputType?: string;
  ETag?: string;
  Tags?: TagMap;
  InputSwitchConfiguration?: InputSwitchConfiguration;
  OutputHeaderConfiguration?: OutputHeaderConfiguration;
}
export const GetChannelResponse = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    ChannelName: S.String,
    ChannelGroupName: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ResetAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(S.String),
    IngestEndpoints: S.optional(IngestEndpointList),
    InputType: S.optional(S.String),
    ETag: S.optional(S.String),
    Tags: S.optional(TagMap),
    InputSwitchConfiguration: S.optional(InputSwitchConfiguration),
    OutputHeaderConfiguration: S.optional(OutputHeaderConfiguration),
  }),
).annotations({
  identifier: "GetChannelResponse",
}) as any as S.Schema<GetChannelResponse>;
export interface ListChannelsResponse {
  Items?: ChannelList;
  NextToken?: string;
}
export const ListChannelsResponse = S.suspend(() =>
  S.Struct({ Items: S.optional(ChannelList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListChannelsResponse",
}) as any as S.Schema<ListChannelsResponse>;
export interface GetOriginEndpointResponse {
  Arn: string;
  ChannelGroupName: string;
  ChannelName: string;
  OriginEndpointName: string;
  ContainerType: string;
  Segment: Segment;
  CreatedAt: Date;
  ModifiedAt: Date;
  ResetAt?: Date;
  Description?: string;
  StartoverWindowSeconds?: number;
  HlsManifests?: GetHlsManifests;
  LowLatencyHlsManifests?: GetLowLatencyHlsManifests;
  DashManifests?: GetDashManifests;
  MssManifests?: GetMssManifests;
  ForceEndpointErrorConfiguration?: ForceEndpointErrorConfiguration;
  ETag?: string;
  Tags?: TagMap;
}
export const GetOriginEndpointResponse = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    ChannelGroupName: S.String,
    ChannelName: S.String,
    OriginEndpointName: S.String,
    ContainerType: S.String,
    Segment: Segment,
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ResetAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(S.String),
    StartoverWindowSeconds: S.optional(S.Number),
    HlsManifests: S.optional(GetHlsManifests),
    LowLatencyHlsManifests: S.optional(GetLowLatencyHlsManifests),
    DashManifests: S.optional(GetDashManifests),
    MssManifests: S.optional(GetMssManifests),
    ForceEndpointErrorConfiguration: S.optional(
      ForceEndpointErrorConfiguration,
    ),
    ETag: S.optional(S.String),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetOriginEndpointResponse",
}) as any as S.Schema<GetOriginEndpointResponse>;
export interface CreateHarvestJobRequest {
  ChannelGroupName: string;
  ChannelName: string;
  OriginEndpointName: string;
  Description?: string;
  HarvestedManifests: HarvestedManifests;
  ScheduleConfiguration: HarvesterScheduleConfiguration;
  Destination: Destination;
  ClientToken?: string;
  HarvestJobName?: string;
  Tags?: TagMap;
}
export const CreateHarvestJobRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    OriginEndpointName: S.String.pipe(T.HttpLabel("OriginEndpointName")),
    Description: S.optional(S.String),
    HarvestedManifests: HarvestedManifests,
    ScheduleConfiguration: HarvesterScheduleConfiguration,
    Destination: Destination,
    ClientToken: S.optional(S.String).pipe(T.HttpHeader("x-amzn-client-token")),
    HarvestJobName: S.optional(S.String),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/channelGroup/{ChannelGroupName}/channel/{ChannelName}/originEndpoint/{OriginEndpointName}/harvestJob",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateHarvestJobRequest",
}) as any as S.Schema<CreateHarvestJobRequest>;
export interface ListHarvestJobsResponse {
  Items?: HarvestJobsList;
  NextToken?: string;
}
export const ListHarvestJobsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(HarvestJobsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListHarvestJobsResponse",
}) as any as S.Schema<ListHarvestJobsResponse>;
export interface ListHlsManifestConfiguration {
  ManifestName: string;
  ChildManifestName?: string;
  Url?: string;
}
export const ListHlsManifestConfiguration = S.suspend(() =>
  S.Struct({
    ManifestName: S.String,
    ChildManifestName: S.optional(S.String),
    Url: S.optional(S.String),
  }),
).annotations({
  identifier: "ListHlsManifestConfiguration",
}) as any as S.Schema<ListHlsManifestConfiguration>;
export type ListHlsManifests = ListHlsManifestConfiguration[];
export const ListHlsManifests = S.Array(ListHlsManifestConfiguration);
export interface ListLowLatencyHlsManifestConfiguration {
  ManifestName: string;
  ChildManifestName?: string;
  Url?: string;
}
export const ListLowLatencyHlsManifestConfiguration = S.suspend(() =>
  S.Struct({
    ManifestName: S.String,
    ChildManifestName: S.optional(S.String),
    Url: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLowLatencyHlsManifestConfiguration",
}) as any as S.Schema<ListLowLatencyHlsManifestConfiguration>;
export type ListLowLatencyHlsManifests =
  ListLowLatencyHlsManifestConfiguration[];
export const ListLowLatencyHlsManifests = S.Array(
  ListLowLatencyHlsManifestConfiguration,
);
export interface ListDashManifestConfiguration {
  ManifestName: string;
  Url?: string;
}
export const ListDashManifestConfiguration = S.suspend(() =>
  S.Struct({ ManifestName: S.String, Url: S.optional(S.String) }),
).annotations({
  identifier: "ListDashManifestConfiguration",
}) as any as S.Schema<ListDashManifestConfiguration>;
export type ListDashManifests = ListDashManifestConfiguration[];
export const ListDashManifests = S.Array(ListDashManifestConfiguration);
export interface ListMssManifestConfiguration {
  ManifestName: string;
  Url?: string;
}
export const ListMssManifestConfiguration = S.suspend(() =>
  S.Struct({ ManifestName: S.String, Url: S.optional(S.String) }),
).annotations({
  identifier: "ListMssManifestConfiguration",
}) as any as S.Schema<ListMssManifestConfiguration>;
export type ListMssManifests = ListMssManifestConfiguration[];
export const ListMssManifests = S.Array(ListMssManifestConfiguration);
export interface OriginEndpointListConfiguration {
  Arn: string;
  ChannelGroupName: string;
  ChannelName: string;
  OriginEndpointName: string;
  ContainerType: string;
  Description?: string;
  CreatedAt?: Date;
  ModifiedAt?: Date;
  HlsManifests?: ListHlsManifests;
  LowLatencyHlsManifests?: ListLowLatencyHlsManifests;
  DashManifests?: ListDashManifests;
  MssManifests?: ListMssManifests;
  ForceEndpointErrorConfiguration?: ForceEndpointErrorConfiguration;
}
export const OriginEndpointListConfiguration = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    ChannelGroupName: S.String,
    ChannelName: S.String,
    OriginEndpointName: S.String,
    ContainerType: S.String,
    Description: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    HlsManifests: S.optional(ListHlsManifests),
    LowLatencyHlsManifests: S.optional(ListLowLatencyHlsManifests),
    DashManifests: S.optional(ListDashManifests),
    MssManifests: S.optional(ListMssManifests),
    ForceEndpointErrorConfiguration: S.optional(
      ForceEndpointErrorConfiguration,
    ),
  }),
).annotations({
  identifier: "OriginEndpointListConfiguration",
}) as any as S.Schema<OriginEndpointListConfiguration>;
export type OriginEndpointsList = OriginEndpointListConfiguration[];
export const OriginEndpointsList = S.Array(OriginEndpointListConfiguration);
export interface ListOriginEndpointsResponse {
  Items?: OriginEndpointsList;
  NextToken?: string;
}
export const ListOriginEndpointsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(OriginEndpointsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListOriginEndpointsResponse",
}) as any as S.Schema<ListOriginEndpointsResponse>;
export interface CreateHarvestJobResponse {
  ChannelGroupName: string;
  ChannelName: string;
  OriginEndpointName: string;
  Destination: Destination;
  HarvestJobName: string;
  HarvestedManifests: HarvestedManifests;
  Description?: string;
  ScheduleConfiguration: HarvesterScheduleConfiguration;
  Arn: string;
  CreatedAt: Date;
  ModifiedAt: Date;
  Status: string;
  ErrorMessage?: string;
  ETag?: string;
  Tags?: TagMap;
}
export const CreateHarvestJobResponse = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String,
    ChannelName: S.String,
    OriginEndpointName: S.String,
    Destination: Destination,
    HarvestJobName: S.String,
    HarvestedManifests: HarvestedManifests,
    Description: S.optional(S.String),
    ScheduleConfiguration: HarvesterScheduleConfiguration,
    Arn: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Status: S.String,
    ErrorMessage: S.optional(S.String),
    ETag: S.optional(S.String),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "CreateHarvestJobResponse",
}) as any as S.Schema<CreateHarvestJobResponse>;
export interface CreateOriginEndpointRequest {
  ChannelGroupName: string;
  ChannelName: string;
  OriginEndpointName: string;
  ContainerType: string;
  Segment?: Segment;
  ClientToken?: string;
  Description?: string;
  StartoverWindowSeconds?: number;
  HlsManifests?: CreateHlsManifests;
  LowLatencyHlsManifests?: CreateLowLatencyHlsManifests;
  DashManifests?: CreateDashManifests;
  MssManifests?: CreateMssManifests;
  ForceEndpointErrorConfiguration?: ForceEndpointErrorConfiguration;
  Tags?: TagMap;
}
export const CreateOriginEndpointRequest = S.suspend(() =>
  S.Struct({
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    OriginEndpointName: S.String,
    ContainerType: S.String,
    Segment: S.optional(Segment),
    ClientToken: S.optional(S.String).pipe(T.HttpHeader("x-amzn-client-token")),
    Description: S.optional(S.String),
    StartoverWindowSeconds: S.optional(S.Number),
    HlsManifests: S.optional(CreateHlsManifests),
    LowLatencyHlsManifests: S.optional(CreateLowLatencyHlsManifests),
    DashManifests: S.optional(CreateDashManifests),
    MssManifests: S.optional(CreateMssManifests),
    ForceEndpointErrorConfiguration: S.optional(
      ForceEndpointErrorConfiguration,
    ),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/channelGroup/{ChannelGroupName}/channel/{ChannelName}/originEndpoint",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateOriginEndpointRequest",
}) as any as S.Schema<CreateOriginEndpointRequest>;
export interface CreateOriginEndpointResponse {
  Arn: string;
  ChannelGroupName: string;
  ChannelName: string;
  OriginEndpointName: string;
  ContainerType: string;
  Segment: Segment;
  CreatedAt: Date;
  ModifiedAt: Date;
  Description?: string;
  StartoverWindowSeconds?: number;
  HlsManifests?: GetHlsManifests;
  LowLatencyHlsManifests?: GetLowLatencyHlsManifests;
  DashManifests?: GetDashManifests;
  MssManifests?: GetMssManifests;
  ForceEndpointErrorConfiguration?: ForceEndpointErrorConfiguration;
  ETag?: string;
  Tags?: TagMap;
}
export const CreateOriginEndpointResponse = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    ChannelGroupName: S.String,
    ChannelName: S.String,
    OriginEndpointName: S.String,
    ContainerType: S.String,
    Segment: Segment,
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Description: S.optional(S.String),
    StartoverWindowSeconds: S.optional(S.Number),
    HlsManifests: S.optional(GetHlsManifests),
    LowLatencyHlsManifests: S.optional(GetLowLatencyHlsManifests),
    DashManifests: S.optional(GetDashManifests),
    MssManifests: S.optional(GetMssManifests),
    ForceEndpointErrorConfiguration: S.optional(
      ForceEndpointErrorConfiguration,
    ),
    ETag: S.optional(S.String),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "CreateOriginEndpointResponse",
}) as any as S.Schema<CreateOriginEndpointResponse>;

//# Errors
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.optional(S.String),
    ValidationExceptionType: S.optional(S.String),
  },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    Message: S.optional(S.String),
    ConflictExceptionType: S.optional(S.String),
  },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String), ResourceTypeNotFound: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Removes one or more tags from the specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ValidationException],
}));
/**
 * Lists the tags assigned to a resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ValidationException],
}));
/**
 * Assigns one of more tags (key-value pairs) to the specified MediaPackage resource.
 *
 * Tags can help you organize and categorize your resources. You can also use them to scope user permissions, by granting a user permission to access or change only resources with certain tag values. You can use the TagResource operation with a resource that already has tags. If you specify a new tag key for the resource, this tag is appended to the list of tags associated with the resource. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces the previous value for that tag.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ValidationException],
}));
/**
 * Delete a channel to stop AWS Elemental MediaPackage from receiving further content. You must delete the channel's origin endpoints before you can delete the channel.
 */
export const deleteChannel: (
  input: DeleteChannelRequest,
) => Effect.Effect<
  DeleteChannelResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChannelRequest,
  output: DeleteChannelResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the specified origin endpoint that's configured in AWS Elemental MediaPackage to obtain its playback URL and to view the packaging settings that it's currently using.
 */
export const getOriginEndpoint: (
  input: GetOriginEndpointRequest,
) => Effect.Effect<
  GetOriginEndpointResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOriginEndpointRequest,
  output: GetOriginEndpointResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of harvest jobs that match the specified criteria.
 */
export const listHarvestJobs: {
  (
    input: ListHarvestJobsRequest,
  ): Effect.Effect<
    ListHarvestJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListHarvestJobsRequest,
  ) => Stream.Stream<
    ListHarvestJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListHarvestJobsRequest,
  ) => Stream.Stream<
    HarvestJob,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListHarvestJobsRequest,
  output: ListHarvestJobsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Items",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Update the specified channel. You can edit if MediaPackage sends ingest or egress access logs to the CloudWatch log group, if content will be encrypted, the description on a channel, and your channel's policy settings. You can't edit the name of the channel or CloudFront distribution details.
 *
 * Any edits you make that impact the video output may not be reflected for a few minutes.
 */
export const updateChannel: (
  input: UpdateChannelRequest,
) => Effect.Effect<
  UpdateChannelResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateChannelRequest,
  output: UpdateChannelResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Resetting the channel can help to clear errors from misconfigurations in the encoder. A reset refreshes the ingest stream and removes previous content.
 *
 * Be sure to stop the encoder before you reset the channel, and wait at least 30 seconds before you restart the encoder.
 */
export const resetChannelState: (
  input: ResetChannelStateRequest,
) => Effect.Effect<
  ResetChannelStateResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetChannelStateRequest,
  output: ResetChannelStateResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Resetting the origin endpoint can help to resolve unexpected behavior and other content packaging issues. It also helps to preserve special events when you don't want the previous content to be available for viewing. A reset clears out all previous content from the origin endpoint.
 *
 * MediaPackage might return old content from this endpoint in the first 30 seconds after the endpoint reset. For best results, when possible, wait 30 seconds from endpoint reset to send playback requests to this endpoint.
 */
export const resetOriginEndpointState: (
  input: ResetOriginEndpointStateRequest,
) => Effect.Effect<
  ResetOriginEndpointStateResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetOriginEndpointStateRequest,
  output: ResetOriginEndpointStateResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Attaches an IAM policy to the specified origin endpoint. You can attach only one policy with each request.
 */
export const putOriginEndpointPolicy: (
  input: PutOriginEndpointPolicyRequest,
) => Effect.Effect<
  PutOriginEndpointPolicyResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutOriginEndpointPolicyRequest,
  output: PutOriginEndpointPolicyResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Attaches an IAM policy to the specified channel. With policies, you can specify who has access to AWS resources and what actions they can perform on those resources. You can attach only one policy with each request.
 */
export const putChannelPolicy: (
  input: PutChannelPolicyRequest,
) => Effect.Effect<
  PutChannelPolicyResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutChannelPolicyRequest,
  output: PutChannelPolicyResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Cancels an in-progress harvest job.
 */
export const cancelHarvestJob: (
  input: CancelHarvestJobRequest,
) => Effect.Effect<
  CancelHarvestJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelHarvestJobRequest,
  output: CancelHarvestJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update the specified channel group. You can edit the description on a channel group for easier identification later from the AWS Elemental MediaPackage console. You can't edit the name of the channel group.
 *
 * Any edits you make that impact the video output may not be reflected for a few minutes.
 */
export const updateChannelGroup: (
  input: UpdateChannelGroupRequest,
) => Effect.Effect<
  UpdateChannelGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateChannelGroupRequest,
  output: UpdateChannelGroupResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the specified origin endpoint policy that's configured in AWS Elemental MediaPackage.
 */
export const getOriginEndpointPolicy: (
  input: GetOriginEndpointPolicyRequest,
) => Effect.Effect<
  GetOriginEndpointPolicyResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOriginEndpointPolicyRequest,
  output: GetOriginEndpointPolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the details of a specific harvest job.
 */
export const getHarvestJob: (
  input: GetHarvestJobRequest,
) => Effect.Effect<
  GetHarvestJobResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetHarvestJobRequest,
  output: GetHarvestJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the specified channel group that's configured in AWS Elemental MediaPackage.
 */
export const getChannelGroup: (
  input: GetChannelGroupRequest,
) => Effect.Effect<
  GetChannelGroupResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetChannelGroupRequest,
  output: GetChannelGroupResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the specified channel that's configured in AWS Elemental MediaPackage.
 */
export const getChannel: (
  input: GetChannelRequest,
) => Effect.Effect<
  GetChannelResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetChannelRequest,
  output: GetChannelResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves all channels in a specific channel group that are configured in AWS Elemental MediaPackage.
 */
export const listChannels: {
  (
    input: ListChannelsRequest,
  ): Effect.Effect<
    ListChannelsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChannelsRequest,
  ) => Stream.Stream<
    ListChannelsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChannelsRequest,
  ) => Stream.Stream<
    ChannelListConfiguration,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChannelsRequest,
  output: ListChannelsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Items",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Delete a channel policy.
 */
export const deleteChannelPolicy: (
  input: DeleteChannelPolicyRequest,
) => Effect.Effect<
  DeleteChannelPolicyResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChannelPolicyRequest,
  output: DeleteChannelPolicyResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Delete an origin endpoint policy.
 */
export const deleteOriginEndpointPolicy: (
  input: DeleteOriginEndpointPolicyRequest,
) => Effect.Effect<
  DeleteOriginEndpointPolicyResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOriginEndpointPolicyRequest,
  output: DeleteOriginEndpointPolicyResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Origin endpoints can serve content until they're deleted. Delete the endpoint if it should no longer respond to playback requests. You must delete all endpoints from a channel before you can delete the channel.
 */
export const deleteOriginEndpoint: (
  input: DeleteOriginEndpointRequest,
) => Effect.Effect<
  DeleteOriginEndpointResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOriginEndpointRequest,
  output: DeleteOriginEndpointResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Delete a channel group. You must delete the channel group's channels and origin endpoints before you can delete the channel group. If you delete a channel group, you'll lose access to the egress domain and will have to create a new channel group to replace it.
 */
export const deleteChannelGroup: (
  input: DeleteChannelGroupRequest,
) => Effect.Effect<
  DeleteChannelGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChannelGroupRequest,
  output: DeleteChannelGroupResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves all channel groups that are configured in Elemental MediaPackage.
 */
export const listChannelGroups: {
  (
    input: ListChannelGroupsRequest,
  ): Effect.Effect<
    ListChannelGroupsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChannelGroupsRequest,
  ) => Stream.Stream<
    ListChannelGroupsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChannelGroupsRequest,
  ) => Stream.Stream<
    ChannelGroupListConfiguration,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChannelGroupsRequest,
  output: ListChannelGroupsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Items",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the specified channel policy that's configured in AWS Elemental MediaPackage. With policies, you can specify who has access to AWS resources and what actions they can perform on those resources.
 */
export const getChannelPolicy: (
  input: GetChannelPolicyRequest,
) => Effect.Effect<
  GetChannelPolicyResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetChannelPolicyRequest,
  output: GetChannelPolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves all origin endpoints in a specific channel that are configured in AWS Elemental MediaPackage.
 */
export const listOriginEndpoints: {
  (
    input: ListOriginEndpointsRequest,
  ): Effect.Effect<
    ListOriginEndpointsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOriginEndpointsRequest,
  ) => Stream.Stream<
    ListOriginEndpointsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOriginEndpointsRequest,
  ) => Stream.Stream<
    OriginEndpointListConfiguration,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOriginEndpointsRequest,
  output: ListOriginEndpointsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Items",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates a new harvest job to export content from a MediaPackage v2 channel to an S3 bucket.
 */
export const createHarvestJob: (
  input: CreateHarvestJobRequest,
) => Effect.Effect<
  CreateHarvestJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateHarvestJobRequest,
  output: CreateHarvestJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update the specified origin endpoint. Edit the packaging preferences on an endpoint to optimize the viewing experience. You can't edit the name of the endpoint.
 *
 * Any edits you make that impact the video output may not be reflected for a few minutes.
 */
export const updateOriginEndpoint: (
  input: UpdateOriginEndpointRequest,
) => Effect.Effect<
  UpdateOriginEndpointResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateOriginEndpointRequest,
  output: UpdateOriginEndpointResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Create a channel group to group your channels and origin endpoints. A channel group is the top-level resource that consists of channels and origin endpoints that are associated with it and that provides predictable URLs for stream delivery. All channels and origin endpoints within the channel group are guaranteed to share the DNS. You can create only one channel group with each request.
 */
export const createChannelGroup: (
  input: CreateChannelGroupRequest,
) => Effect.Effect<
  CreateChannelGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChannelGroupRequest,
  output: CreateChannelGroupResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Create a channel to start receiving content streams. The channel represents the input to MediaPackage for incoming live content from an encoder such as AWS Elemental MediaLive. The channel receives content, and after packaging it, outputs it through an origin endpoint to downstream devices (such as video players or CDNs) that request the content. You can create only one channel with each request. We recommend that you spread out channels between channel groups, such as putting redundant channels in the same AWS Region in different channel groups.
 */
export const createChannel: (
  input: CreateChannelRequest,
) => Effect.Effect<
  CreateChannelResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChannelRequest,
  output: CreateChannelResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The endpoint is attached to a channel, and represents the output of the live content. You can associate multiple endpoints to a single channel. Each endpoint gives players and downstream CDNs (such as Amazon CloudFront) access to the content for playback. Content can't be served from a channel until it has an endpoint. You can create only one endpoint with each request.
 */
export const createOriginEndpoint: (
  input: CreateOriginEndpointRequest,
) => Effect.Effect<
  CreateOriginEndpointResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOriginEndpointRequest,
  output: CreateOriginEndpointResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
