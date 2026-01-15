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
  sdkId: "MediaPackage",
  serviceShapeName: "MediaPackage",
});
const auth = T.AwsAuthSigv4({ name: "mediapackage" });
const ver = T.ServiceVersion("2017-10-12");
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
              `https://mediapackage-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://mediapackage-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://mediapackage.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://mediapackage.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type MaxResults = number;
export type SensitiveString = string | redacted.Redacted<string>;

//# Schemas
export type Origination = "ALLOW" | "DENY" | (string & {});
export const Origination = S.String;
export type __listOf__string = string[];
export const __listOf__string = S.Array(S.String);
export interface DeleteChannelRequest {
  Id: string;
}
export const DeleteChannelRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/channels/{Id}" }),
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
export interface DeleteOriginEndpointRequest {
  Id: string;
}
export const DeleteOriginEndpointRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/origin_endpoints/{Id}" }),
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
export interface DescribeChannelRequest {
  Id: string;
}
export const DescribeChannelRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/channels/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeChannelRequest",
}) as any as S.Schema<DescribeChannelRequest>;
export interface DescribeHarvestJobRequest {
  Id: string;
}
export const DescribeHarvestJobRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/harvest_jobs/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeHarvestJobRequest",
}) as any as S.Schema<DescribeHarvestJobRequest>;
export interface DescribeOriginEndpointRequest {
  Id: string;
}
export const DescribeOriginEndpointRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/origin_endpoints/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeOriginEndpointRequest",
}) as any as S.Schema<DescribeOriginEndpointRequest>;
export interface ListChannelsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListChannelsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/channels" }),
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
export interface ListHarvestJobsRequest {
  IncludeChannelId?: string;
  IncludeStatus?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListHarvestJobsRequest = S.suspend(() =>
  S.Struct({
    IncludeChannelId: S.optional(S.String).pipe(
      T.HttpQuery("includeChannelId"),
    ),
    IncludeStatus: S.optional(S.String).pipe(T.HttpQuery("includeStatus")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/harvest_jobs" }),
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
export interface ListOriginEndpointsRequest {
  ChannelId?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListOriginEndpointsRequest = S.suspend(() =>
  S.Struct({
    ChannelId: S.optional(S.String).pipe(T.HttpQuery("channelId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/origin_endpoints" }),
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
export interface RotateChannelCredentialsRequest {
  Id: string;
}
export const RotateChannelCredentialsRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/channels/{Id}/credentials" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RotateChannelCredentialsRequest",
}) as any as S.Schema<RotateChannelCredentialsRequest>;
export interface RotateIngestEndpointCredentialsRequest {
  Id: string;
  IngestEndpointId: string;
}
export const RotateIngestEndpointCredentialsRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IngestEndpointId: S.String.pipe(T.HttpLabel("IngestEndpointId")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/channels/{Id}/ingest_endpoints/{IngestEndpointId}/credentials",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RotateIngestEndpointCredentialsRequest",
}) as any as S.Schema<RotateIngestEndpointCredentialsRequest>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys?: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: S.optional(__listOf__string).pipe(T.HttpQuery("tagKeys")),
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
export interface UpdateChannelRequest {
  Description?: string;
  Id: string;
}
export const UpdateChannelRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Id: S.String.pipe(T.HttpLabel("Id")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/channels/{Id}" }),
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
export interface Authorization {
  CdnIdentifierSecret?: string;
  SecretsRoleArn?: string;
}
export const Authorization = S.suspend(() =>
  S.Struct({
    CdnIdentifierSecret: S.optional(S.String).pipe(
      T.JsonName("cdnIdentifierSecret"),
    ),
    SecretsRoleArn: S.optional(S.String).pipe(T.JsonName("secretsRoleArn")),
  }),
).annotations({
  identifier: "Authorization",
}) as any as S.Schema<Authorization>;
export type CmafEncryptionMethod = "SAMPLE_AES" | "AES_CTR" | (string & {});
export const CmafEncryptionMethod = S.String;
export type PresetSpeke20Audio =
  | "PRESET-AUDIO-1"
  | "PRESET-AUDIO-2"
  | "PRESET-AUDIO-3"
  | "SHARED"
  | "UNENCRYPTED"
  | (string & {});
export const PresetSpeke20Audio = S.String;
export type PresetSpeke20Video =
  | "PRESET-VIDEO-1"
  | "PRESET-VIDEO-2"
  | "PRESET-VIDEO-3"
  | "PRESET-VIDEO-4"
  | "PRESET-VIDEO-5"
  | "PRESET-VIDEO-6"
  | "PRESET-VIDEO-7"
  | "PRESET-VIDEO-8"
  | "SHARED"
  | "UNENCRYPTED"
  | (string & {});
export const PresetSpeke20Video = S.String;
export interface EncryptionContractConfiguration {
  PresetSpeke20Audio?: PresetSpeke20Audio;
  PresetSpeke20Video?: PresetSpeke20Video;
}
export const EncryptionContractConfiguration = S.suspend(() =>
  S.Struct({
    PresetSpeke20Audio: S.optional(PresetSpeke20Audio).pipe(
      T.JsonName("presetSpeke20Audio"),
    ),
    PresetSpeke20Video: S.optional(PresetSpeke20Video).pipe(
      T.JsonName("presetSpeke20Video"),
    ),
  }),
).annotations({
  identifier: "EncryptionContractConfiguration",
}) as any as S.Schema<EncryptionContractConfiguration>;
export interface SpekeKeyProvider {
  CertificateArn?: string;
  EncryptionContractConfiguration?: EncryptionContractConfiguration;
  ResourceId?: string;
  RoleArn?: string;
  SystemIds?: string[];
  Url?: string;
}
export const SpekeKeyProvider = S.suspend(() =>
  S.Struct({
    CertificateArn: S.optional(S.String).pipe(T.JsonName("certificateArn")),
    EncryptionContractConfiguration: S.optional(EncryptionContractConfiguration)
      .pipe(T.JsonName("encryptionContractConfiguration"))
      .annotations({ identifier: "EncryptionContractConfiguration" }),
    ResourceId: S.optional(S.String).pipe(T.JsonName("resourceId")),
    RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
    SystemIds: S.optional(__listOf__string).pipe(T.JsonName("systemIds")),
    Url: S.optional(S.String).pipe(T.JsonName("url")),
  }),
).annotations({
  identifier: "SpekeKeyProvider",
}) as any as S.Schema<SpekeKeyProvider>;
export interface CmafEncryption {
  ConstantInitializationVector?: string;
  EncryptionMethod?: CmafEncryptionMethod;
  KeyRotationIntervalSeconds?: number;
  SpekeKeyProvider?: SpekeKeyProvider;
}
export const CmafEncryption = S.suspend(() =>
  S.Struct({
    ConstantInitializationVector: S.optional(S.String).pipe(
      T.JsonName("constantInitializationVector"),
    ),
    EncryptionMethod: S.optional(CmafEncryptionMethod).pipe(
      T.JsonName("encryptionMethod"),
    ),
    KeyRotationIntervalSeconds: S.optional(S.Number).pipe(
      T.JsonName("keyRotationIntervalSeconds"),
    ),
    SpekeKeyProvider: S.optional(SpekeKeyProvider)
      .pipe(T.JsonName("spekeKeyProvider"))
      .annotations({ identifier: "SpekeKeyProvider" }),
  }),
).annotations({
  identifier: "CmafEncryption",
}) as any as S.Schema<CmafEncryption>;
export type AdMarkers =
  | "NONE"
  | "SCTE35_ENHANCED"
  | "PASSTHROUGH"
  | "DATERANGE"
  | (string & {});
export const AdMarkers = S.String;
export type __AdTriggersElement =
  | "SPLICE_INSERT"
  | "BREAK"
  | "PROVIDER_ADVERTISEMENT"
  | "DISTRIBUTOR_ADVERTISEMENT"
  | "PROVIDER_PLACEMENT_OPPORTUNITY"
  | "DISTRIBUTOR_PLACEMENT_OPPORTUNITY"
  | "PROVIDER_OVERLAY_PLACEMENT_OPPORTUNITY"
  | "DISTRIBUTOR_OVERLAY_PLACEMENT_OPPORTUNITY"
  | (string & {});
export const __AdTriggersElement = S.String;
export type AdTriggers = __AdTriggersElement[];
export const AdTriggers = S.Array(__AdTriggersElement);
export type AdsOnDeliveryRestrictions =
  | "NONE"
  | "RESTRICTED"
  | "UNRESTRICTED"
  | "BOTH"
  | (string & {});
export const AdsOnDeliveryRestrictions = S.String;
export type PlaylistType = "NONE" | "EVENT" | "VOD" | (string & {});
export const PlaylistType = S.String;
export interface HlsManifestCreateOrUpdateParameters {
  AdMarkers?: AdMarkers;
  AdTriggers?: __AdTriggersElement[];
  AdsOnDeliveryRestrictions?: AdsOnDeliveryRestrictions;
  Id?: string;
  IncludeIframeOnlyStream?: boolean;
  ManifestName?: string;
  PlaylistType?: PlaylistType;
  PlaylistWindowSeconds?: number;
  ProgramDateTimeIntervalSeconds?: number;
}
export const HlsManifestCreateOrUpdateParameters = S.suspend(() =>
  S.Struct({
    AdMarkers: S.optional(AdMarkers).pipe(T.JsonName("adMarkers")),
    AdTriggers: S.optional(AdTriggers).pipe(T.JsonName("adTriggers")),
    AdsOnDeliveryRestrictions: S.optional(AdsOnDeliveryRestrictions).pipe(
      T.JsonName("adsOnDeliveryRestrictions"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    IncludeIframeOnlyStream: S.optional(S.Boolean).pipe(
      T.JsonName("includeIframeOnlyStream"),
    ),
    ManifestName: S.optional(S.String).pipe(T.JsonName("manifestName")),
    PlaylistType: S.optional(PlaylistType).pipe(T.JsonName("playlistType")),
    PlaylistWindowSeconds: S.optional(S.Number).pipe(
      T.JsonName("playlistWindowSeconds"),
    ),
    ProgramDateTimeIntervalSeconds: S.optional(S.Number).pipe(
      T.JsonName("programDateTimeIntervalSeconds"),
    ),
  }),
).annotations({
  identifier: "HlsManifestCreateOrUpdateParameters",
}) as any as S.Schema<HlsManifestCreateOrUpdateParameters>;
export type __listOfHlsManifestCreateOrUpdateParameters =
  HlsManifestCreateOrUpdateParameters[];
export const __listOfHlsManifestCreateOrUpdateParameters = S.Array(
  HlsManifestCreateOrUpdateParameters,
);
export type StreamOrder =
  | "ORIGINAL"
  | "VIDEO_BITRATE_ASCENDING"
  | "VIDEO_BITRATE_DESCENDING"
  | (string & {});
export const StreamOrder = S.String;
export interface StreamSelection {
  MaxVideoBitsPerSecond?: number;
  MinVideoBitsPerSecond?: number;
  StreamOrder?: StreamOrder;
}
export const StreamSelection = S.suspend(() =>
  S.Struct({
    MaxVideoBitsPerSecond: S.optional(S.Number).pipe(
      T.JsonName("maxVideoBitsPerSecond"),
    ),
    MinVideoBitsPerSecond: S.optional(S.Number).pipe(
      T.JsonName("minVideoBitsPerSecond"),
    ),
    StreamOrder: S.optional(StreamOrder).pipe(T.JsonName("streamOrder")),
  }),
).annotations({
  identifier: "StreamSelection",
}) as any as S.Schema<StreamSelection>;
export interface CmafPackageCreateOrUpdateParameters {
  Encryption?: CmafEncryption;
  HlsManifests?: HlsManifestCreateOrUpdateParameters[];
  SegmentDurationSeconds?: number;
  SegmentPrefix?: string;
  StreamSelection?: StreamSelection;
}
export const CmafPackageCreateOrUpdateParameters = S.suspend(() =>
  S.Struct({
    Encryption: S.optional(CmafEncryption)
      .pipe(T.JsonName("encryption"))
      .annotations({ identifier: "CmafEncryption" }),
    HlsManifests: S.optional(__listOfHlsManifestCreateOrUpdateParameters).pipe(
      T.JsonName("hlsManifests"),
    ),
    SegmentDurationSeconds: S.optional(S.Number).pipe(
      T.JsonName("segmentDurationSeconds"),
    ),
    SegmentPrefix: S.optional(S.String).pipe(T.JsonName("segmentPrefix")),
    StreamSelection: S.optional(StreamSelection)
      .pipe(T.JsonName("streamSelection"))
      .annotations({ identifier: "StreamSelection" }),
  }),
).annotations({
  identifier: "CmafPackageCreateOrUpdateParameters",
}) as any as S.Schema<CmafPackageCreateOrUpdateParameters>;
export interface DashEncryption {
  KeyRotationIntervalSeconds?: number;
  SpekeKeyProvider?: SpekeKeyProvider;
}
export const DashEncryption = S.suspend(() =>
  S.Struct({
    KeyRotationIntervalSeconds: S.optional(S.Number).pipe(
      T.JsonName("keyRotationIntervalSeconds"),
    ),
    SpekeKeyProvider: S.optional(SpekeKeyProvider)
      .pipe(T.JsonName("spekeKeyProvider"))
      .annotations({ identifier: "SpekeKeyProvider" }),
  }),
).annotations({
  identifier: "DashEncryption",
}) as any as S.Schema<DashEncryption>;
export type ManifestLayout =
  | "FULL"
  | "COMPACT"
  | "DRM_TOP_LEVEL_COMPACT"
  | (string & {});
export const ManifestLayout = S.String;
export type __PeriodTriggersElement = "ADS" | (string & {});
export const __PeriodTriggersElement = S.String;
export type __listOf__PeriodTriggersElement = __PeriodTriggersElement[];
export const __listOf__PeriodTriggersElement = S.Array(__PeriodTriggersElement);
export type Profile =
  | "NONE"
  | "HBBTV_1_5"
  | "HYBRIDCAST"
  | "DVB_DASH_2014"
  | (string & {});
export const Profile = S.String;
export type SegmentTemplateFormat =
  | "NUMBER_WITH_TIMELINE"
  | "TIME_WITH_TIMELINE"
  | "NUMBER_WITH_DURATION"
  | (string & {});
export const SegmentTemplateFormat = S.String;
export type UtcTiming =
  | "NONE"
  | "HTTP-HEAD"
  | "HTTP-ISO"
  | "HTTP-XSDATE"
  | (string & {});
export const UtcTiming = S.String;
export interface DashPackage {
  AdTriggers?: __AdTriggersElement[];
  AdsOnDeliveryRestrictions?: AdsOnDeliveryRestrictions;
  Encryption?: DashEncryption;
  IncludeIframeOnlyStream?: boolean;
  ManifestLayout?: ManifestLayout;
  ManifestWindowSeconds?: number;
  MinBufferTimeSeconds?: number;
  MinUpdatePeriodSeconds?: number;
  PeriodTriggers?: __PeriodTriggersElement[];
  Profile?: Profile;
  SegmentDurationSeconds?: number;
  SegmentTemplateFormat?: SegmentTemplateFormat;
  StreamSelection?: StreamSelection;
  SuggestedPresentationDelaySeconds?: number;
  UtcTiming?: UtcTiming;
  UtcTimingUri?: string;
}
export const DashPackage = S.suspend(() =>
  S.Struct({
    AdTriggers: S.optional(AdTriggers).pipe(T.JsonName("adTriggers")),
    AdsOnDeliveryRestrictions: S.optional(AdsOnDeliveryRestrictions).pipe(
      T.JsonName("adsOnDeliveryRestrictions"),
    ),
    Encryption: S.optional(DashEncryption)
      .pipe(T.JsonName("encryption"))
      .annotations({ identifier: "DashEncryption" }),
    IncludeIframeOnlyStream: S.optional(S.Boolean).pipe(
      T.JsonName("includeIframeOnlyStream"),
    ),
    ManifestLayout: S.optional(ManifestLayout).pipe(
      T.JsonName("manifestLayout"),
    ),
    ManifestWindowSeconds: S.optional(S.Number).pipe(
      T.JsonName("manifestWindowSeconds"),
    ),
    MinBufferTimeSeconds: S.optional(S.Number).pipe(
      T.JsonName("minBufferTimeSeconds"),
    ),
    MinUpdatePeriodSeconds: S.optional(S.Number).pipe(
      T.JsonName("minUpdatePeriodSeconds"),
    ),
    PeriodTriggers: S.optional(__listOf__PeriodTriggersElement).pipe(
      T.JsonName("periodTriggers"),
    ),
    Profile: S.optional(Profile).pipe(T.JsonName("profile")),
    SegmentDurationSeconds: S.optional(S.Number).pipe(
      T.JsonName("segmentDurationSeconds"),
    ),
    SegmentTemplateFormat: S.optional(SegmentTemplateFormat).pipe(
      T.JsonName("segmentTemplateFormat"),
    ),
    StreamSelection: S.optional(StreamSelection)
      .pipe(T.JsonName("streamSelection"))
      .annotations({ identifier: "StreamSelection" }),
    SuggestedPresentationDelaySeconds: S.optional(S.Number).pipe(
      T.JsonName("suggestedPresentationDelaySeconds"),
    ),
    UtcTiming: S.optional(UtcTiming).pipe(T.JsonName("utcTiming")),
    UtcTimingUri: S.optional(S.String).pipe(T.JsonName("utcTimingUri")),
  }),
).annotations({ identifier: "DashPackage" }) as any as S.Schema<DashPackage>;
export type EncryptionMethod = "AES_128" | "SAMPLE_AES" | (string & {});
export const EncryptionMethod = S.String;
export interface HlsEncryption {
  ConstantInitializationVector?: string;
  EncryptionMethod?: EncryptionMethod;
  KeyRotationIntervalSeconds?: number;
  RepeatExtXKey?: boolean;
  SpekeKeyProvider?: SpekeKeyProvider;
}
export const HlsEncryption = S.suspend(() =>
  S.Struct({
    ConstantInitializationVector: S.optional(S.String).pipe(
      T.JsonName("constantInitializationVector"),
    ),
    EncryptionMethod: S.optional(EncryptionMethod).pipe(
      T.JsonName("encryptionMethod"),
    ),
    KeyRotationIntervalSeconds: S.optional(S.Number).pipe(
      T.JsonName("keyRotationIntervalSeconds"),
    ),
    RepeatExtXKey: S.optional(S.Boolean).pipe(T.JsonName("repeatExtXKey")),
    SpekeKeyProvider: S.optional(SpekeKeyProvider)
      .pipe(T.JsonName("spekeKeyProvider"))
      .annotations({ identifier: "SpekeKeyProvider" }),
  }),
).annotations({
  identifier: "HlsEncryption",
}) as any as S.Schema<HlsEncryption>;
export interface HlsPackage {
  AdMarkers?: AdMarkers;
  AdTriggers?: __AdTriggersElement[];
  AdsOnDeliveryRestrictions?: AdsOnDeliveryRestrictions;
  Encryption?: HlsEncryption;
  IncludeDvbSubtitles?: boolean;
  IncludeIframeOnlyStream?: boolean;
  PlaylistType?: PlaylistType;
  PlaylistWindowSeconds?: number;
  ProgramDateTimeIntervalSeconds?: number;
  SegmentDurationSeconds?: number;
  StreamSelection?: StreamSelection;
  UseAudioRenditionGroup?: boolean;
}
export const HlsPackage = S.suspend(() =>
  S.Struct({
    AdMarkers: S.optional(AdMarkers).pipe(T.JsonName("adMarkers")),
    AdTriggers: S.optional(AdTriggers).pipe(T.JsonName("adTriggers")),
    AdsOnDeliveryRestrictions: S.optional(AdsOnDeliveryRestrictions).pipe(
      T.JsonName("adsOnDeliveryRestrictions"),
    ),
    Encryption: S.optional(HlsEncryption)
      .pipe(T.JsonName("encryption"))
      .annotations({ identifier: "HlsEncryption" }),
    IncludeDvbSubtitles: S.optional(S.Boolean).pipe(
      T.JsonName("includeDvbSubtitles"),
    ),
    IncludeIframeOnlyStream: S.optional(S.Boolean).pipe(
      T.JsonName("includeIframeOnlyStream"),
    ),
    PlaylistType: S.optional(PlaylistType).pipe(T.JsonName("playlistType")),
    PlaylistWindowSeconds: S.optional(S.Number).pipe(
      T.JsonName("playlistWindowSeconds"),
    ),
    ProgramDateTimeIntervalSeconds: S.optional(S.Number).pipe(
      T.JsonName("programDateTimeIntervalSeconds"),
    ),
    SegmentDurationSeconds: S.optional(S.Number).pipe(
      T.JsonName("segmentDurationSeconds"),
    ),
    StreamSelection: S.optional(StreamSelection)
      .pipe(T.JsonName("streamSelection"))
      .annotations({ identifier: "StreamSelection" }),
    UseAudioRenditionGroup: S.optional(S.Boolean).pipe(
      T.JsonName("useAudioRenditionGroup"),
    ),
  }),
).annotations({ identifier: "HlsPackage" }) as any as S.Schema<HlsPackage>;
export interface MssEncryption {
  SpekeKeyProvider?: SpekeKeyProvider;
}
export const MssEncryption = S.suspend(() =>
  S.Struct({
    SpekeKeyProvider: S.optional(SpekeKeyProvider)
      .pipe(T.JsonName("spekeKeyProvider"))
      .annotations({ identifier: "SpekeKeyProvider" }),
  }),
).annotations({
  identifier: "MssEncryption",
}) as any as S.Schema<MssEncryption>;
export interface MssPackage {
  Encryption?: MssEncryption;
  ManifestWindowSeconds?: number;
  SegmentDurationSeconds?: number;
  StreamSelection?: StreamSelection;
}
export const MssPackage = S.suspend(() =>
  S.Struct({
    Encryption: S.optional(MssEncryption)
      .pipe(T.JsonName("encryption"))
      .annotations({ identifier: "MssEncryption" }),
    ManifestWindowSeconds: S.optional(S.Number).pipe(
      T.JsonName("manifestWindowSeconds"),
    ),
    SegmentDurationSeconds: S.optional(S.Number).pipe(
      T.JsonName("segmentDurationSeconds"),
    ),
    StreamSelection: S.optional(StreamSelection)
      .pipe(T.JsonName("streamSelection"))
      .annotations({ identifier: "StreamSelection" }),
  }),
).annotations({ identifier: "MssPackage" }) as any as S.Schema<MssPackage>;
export interface UpdateOriginEndpointRequest {
  Authorization?: Authorization;
  CmafPackage?: CmafPackageCreateOrUpdateParameters;
  DashPackage?: DashPackage;
  Description?: string;
  HlsPackage?: HlsPackage;
  Id: string;
  ManifestName?: string;
  MssPackage?: MssPackage;
  Origination?: Origination;
  StartoverWindowSeconds?: number;
  TimeDelaySeconds?: number;
  Whitelist?: string[];
}
export const UpdateOriginEndpointRequest = S.suspend(() =>
  S.Struct({
    Authorization: S.optional(Authorization)
      .pipe(T.JsonName("authorization"))
      .annotations({ identifier: "Authorization" }),
    CmafPackage: S.optional(CmafPackageCreateOrUpdateParameters)
      .pipe(T.JsonName("cmafPackage"))
      .annotations({ identifier: "CmafPackageCreateOrUpdateParameters" }),
    DashPackage: S.optional(DashPackage)
      .pipe(T.JsonName("dashPackage"))
      .annotations({ identifier: "DashPackage" }),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    HlsPackage: S.optional(HlsPackage)
      .pipe(T.JsonName("hlsPackage"))
      .annotations({ identifier: "HlsPackage" }),
    Id: S.String.pipe(T.HttpLabel("Id")),
    ManifestName: S.optional(S.String).pipe(T.JsonName("manifestName")),
    MssPackage: S.optional(MssPackage)
      .pipe(T.JsonName("mssPackage"))
      .annotations({ identifier: "MssPackage" }),
    Origination: S.optional(Origination).pipe(T.JsonName("origination")),
    StartoverWindowSeconds: S.optional(S.Number).pipe(
      T.JsonName("startoverWindowSeconds"),
    ),
    TimeDelaySeconds: S.optional(S.Number).pipe(T.JsonName("timeDelaySeconds")),
    Whitelist: S.optional(__listOf__string).pipe(T.JsonName("whitelist")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/origin_endpoints/{Id}" }),
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
export interface EgressAccessLogs {
  LogGroupName?: string;
}
export const EgressAccessLogs = S.suspend(() =>
  S.Struct({
    LogGroupName: S.optional(S.String).pipe(T.JsonName("logGroupName")),
  }),
).annotations({
  identifier: "EgressAccessLogs",
}) as any as S.Schema<EgressAccessLogs>;
export interface IngressAccessLogs {
  LogGroupName?: string;
}
export const IngressAccessLogs = S.suspend(() =>
  S.Struct({
    LogGroupName: S.optional(S.String).pipe(T.JsonName("logGroupName")),
  }),
).annotations({
  identifier: "IngressAccessLogs",
}) as any as S.Schema<IngressAccessLogs>;
export type Tags = { [key: string]: string | undefined };
export const Tags = S.Record({ key: S.String, value: S.UndefinedOr(S.String) });
export interface S3Destination {
  BucketName?: string;
  ManifestKey?: string;
  RoleArn?: string;
}
export const S3Destination = S.suspend(() =>
  S.Struct({
    BucketName: S.optional(S.String).pipe(T.JsonName("bucketName")),
    ManifestKey: S.optional(S.String).pipe(T.JsonName("manifestKey")),
    RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
  }),
).annotations({
  identifier: "S3Destination",
}) as any as S.Schema<S3Destination>;
export type Status = "IN_PROGRESS" | "SUCCEEDED" | "FAILED" | (string & {});
export const Status = S.String;
export type __mapOf__string = { [key: string]: string | undefined };
export const __mapOf__string = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface ConfigureLogsRequest {
  EgressAccessLogs?: EgressAccessLogs;
  Id: string;
  IngressAccessLogs?: IngressAccessLogs;
}
export const ConfigureLogsRequest = S.suspend(() =>
  S.Struct({
    EgressAccessLogs: S.optional(EgressAccessLogs)
      .pipe(T.JsonName("egressAccessLogs"))
      .annotations({ identifier: "EgressAccessLogs" }),
    Id: S.String.pipe(T.HttpLabel("Id")),
    IngressAccessLogs: S.optional(IngressAccessLogs)
      .pipe(T.JsonName("ingressAccessLogs"))
      .annotations({ identifier: "IngressAccessLogs" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/channels/{Id}/configure_logs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ConfigureLogsRequest",
}) as any as S.Schema<ConfigureLogsRequest>;
export interface CreateChannelRequest {
  Description?: string;
  Id?: string;
  Tags?: { [key: string]: string | undefined };
}
export const CreateChannelRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/channels" }),
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
export interface CreateHarvestJobRequest {
  EndTime?: string;
  Id?: string;
  OriginEndpointId?: string;
  S3Destination?: S3Destination;
  StartTime?: string;
}
export const CreateHarvestJobRequest = S.suspend(() =>
  S.Struct({
    EndTime: S.optional(S.String).pipe(T.JsonName("endTime")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    OriginEndpointId: S.optional(S.String).pipe(T.JsonName("originEndpointId")),
    S3Destination: S.optional(S3Destination)
      .pipe(T.JsonName("s3Destination"))
      .annotations({ identifier: "S3Destination" }),
    StartTime: S.optional(S.String).pipe(T.JsonName("startTime")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/harvest_jobs" }),
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
export interface DescribeHarvestJobResponse {
  Arn?: string;
  ChannelId?: string;
  CreatedAt?: string;
  EndTime?: string;
  Id?: string;
  OriginEndpointId?: string;
  S3Destination?: S3Destination & {
    BucketName: string;
    ManifestKey: string;
    RoleArn: string;
  };
  StartTime?: string;
  Status?: Status;
}
export const DescribeHarvestJobResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    EndTime: S.optional(S.String).pipe(T.JsonName("endTime")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    OriginEndpointId: S.optional(S.String).pipe(T.JsonName("originEndpointId")),
    S3Destination: S.optional(S3Destination)
      .pipe(T.JsonName("s3Destination"))
      .annotations({ identifier: "S3Destination" }),
    StartTime: S.optional(S.String).pipe(T.JsonName("startTime")),
    Status: S.optional(Status).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "DescribeHarvestJobResponse",
}) as any as S.Schema<DescribeHarvestJobResponse>;
export interface ListTagsForResourceResponse {
  Tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface IngestEndpoint {
  Id?: string;
  Password?: string | redacted.Redacted<string>;
  Url?: string;
  Username?: string | redacted.Redacted<string>;
}
export const IngestEndpoint = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Password: S.optional(SensitiveString).pipe(T.JsonName("password")),
    Url: S.optional(S.String).pipe(T.JsonName("url")),
    Username: S.optional(SensitiveString).pipe(T.JsonName("username")),
  }),
).annotations({
  identifier: "IngestEndpoint",
}) as any as S.Schema<IngestEndpoint>;
export type __listOfIngestEndpoint = IngestEndpoint[];
export const __listOfIngestEndpoint = S.Array(IngestEndpoint);
export interface HlsIngest {
  IngestEndpoints?: IngestEndpoint[];
}
export const HlsIngest = S.suspend(() =>
  S.Struct({
    IngestEndpoints: S.optional(__listOfIngestEndpoint).pipe(
      T.JsonName("ingestEndpoints"),
    ),
  }),
).annotations({ identifier: "HlsIngest" }) as any as S.Schema<HlsIngest>;
export interface RotateChannelCredentialsResponse {
  Arn?: string;
  CreatedAt?: string;
  Description?: string;
  EgressAccessLogs?: EgressAccessLogs;
  HlsIngest?: HlsIngest;
  Id?: string;
  IngressAccessLogs?: IngressAccessLogs;
  Tags?: { [key: string]: string | undefined };
}
export const RotateChannelCredentialsResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EgressAccessLogs: S.optional(EgressAccessLogs)
      .pipe(T.JsonName("egressAccessLogs"))
      .annotations({ identifier: "EgressAccessLogs" }),
    HlsIngest: S.optional(HlsIngest)
      .pipe(T.JsonName("hlsIngest"))
      .annotations({ identifier: "HlsIngest" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    IngressAccessLogs: S.optional(IngressAccessLogs)
      .pipe(T.JsonName("ingressAccessLogs"))
      .annotations({ identifier: "IngressAccessLogs" }),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "RotateChannelCredentialsResponse",
}) as any as S.Schema<RotateChannelCredentialsResponse>;
export interface RotateIngestEndpointCredentialsResponse {
  Arn?: string;
  CreatedAt?: string;
  Description?: string;
  EgressAccessLogs?: EgressAccessLogs;
  HlsIngest?: HlsIngest;
  Id?: string;
  IngressAccessLogs?: IngressAccessLogs;
  Tags?: { [key: string]: string | undefined };
}
export const RotateIngestEndpointCredentialsResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EgressAccessLogs: S.optional(EgressAccessLogs)
      .pipe(T.JsonName("egressAccessLogs"))
      .annotations({ identifier: "EgressAccessLogs" }),
    HlsIngest: S.optional(HlsIngest)
      .pipe(T.JsonName("hlsIngest"))
      .annotations({ identifier: "HlsIngest" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    IngressAccessLogs: S.optional(IngressAccessLogs)
      .pipe(T.JsonName("ingressAccessLogs"))
      .annotations({ identifier: "IngressAccessLogs" }),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "RotateIngestEndpointCredentialsResponse",
}) as any as S.Schema<RotateIngestEndpointCredentialsResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags?: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
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
export interface UpdateChannelResponse {
  Arn?: string;
  CreatedAt?: string;
  Description?: string;
  EgressAccessLogs?: EgressAccessLogs;
  HlsIngest?: HlsIngest;
  Id?: string;
  IngressAccessLogs?: IngressAccessLogs;
  Tags?: { [key: string]: string | undefined };
}
export const UpdateChannelResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EgressAccessLogs: S.optional(EgressAccessLogs)
      .pipe(T.JsonName("egressAccessLogs"))
      .annotations({ identifier: "EgressAccessLogs" }),
    HlsIngest: S.optional(HlsIngest)
      .pipe(T.JsonName("hlsIngest"))
      .annotations({ identifier: "HlsIngest" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    IngressAccessLogs: S.optional(IngressAccessLogs)
      .pipe(T.JsonName("ingressAccessLogs"))
      .annotations({ identifier: "IngressAccessLogs" }),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "UpdateChannelResponse",
}) as any as S.Schema<UpdateChannelResponse>;
export interface HlsManifest {
  AdMarkers?: AdMarkers;
  Id?: string;
  IncludeIframeOnlyStream?: boolean;
  ManifestName?: string;
  PlaylistType?: PlaylistType;
  PlaylistWindowSeconds?: number;
  ProgramDateTimeIntervalSeconds?: number;
  Url?: string;
  AdTriggers?: __AdTriggersElement[];
  AdsOnDeliveryRestrictions?: AdsOnDeliveryRestrictions;
}
export const HlsManifest = S.suspend(() =>
  S.Struct({
    AdMarkers: S.optional(AdMarkers).pipe(T.JsonName("adMarkers")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    IncludeIframeOnlyStream: S.optional(S.Boolean).pipe(
      T.JsonName("includeIframeOnlyStream"),
    ),
    ManifestName: S.optional(S.String).pipe(T.JsonName("manifestName")),
    PlaylistType: S.optional(PlaylistType).pipe(T.JsonName("playlistType")),
    PlaylistWindowSeconds: S.optional(S.Number).pipe(
      T.JsonName("playlistWindowSeconds"),
    ),
    ProgramDateTimeIntervalSeconds: S.optional(S.Number).pipe(
      T.JsonName("programDateTimeIntervalSeconds"),
    ),
    Url: S.optional(S.String).pipe(T.JsonName("url")),
    AdTriggers: S.optional(AdTriggers).pipe(T.JsonName("adTriggers")),
    AdsOnDeliveryRestrictions: S.optional(AdsOnDeliveryRestrictions).pipe(
      T.JsonName("adsOnDeliveryRestrictions"),
    ),
  }),
).annotations({ identifier: "HlsManifest" }) as any as S.Schema<HlsManifest>;
export type __listOfHlsManifest = HlsManifest[];
export const __listOfHlsManifest = S.Array(HlsManifest);
export interface CmafPackage {
  Encryption?: CmafEncryption;
  HlsManifests?: HlsManifest[];
  SegmentDurationSeconds?: number;
  SegmentPrefix?: string;
  StreamSelection?: StreamSelection;
}
export const CmafPackage = S.suspend(() =>
  S.Struct({
    Encryption: S.optional(CmafEncryption)
      .pipe(T.JsonName("encryption"))
      .annotations({ identifier: "CmafEncryption" }),
    HlsManifests: S.optional(__listOfHlsManifest).pipe(
      T.JsonName("hlsManifests"),
    ),
    SegmentDurationSeconds: S.optional(S.Number).pipe(
      T.JsonName("segmentDurationSeconds"),
    ),
    SegmentPrefix: S.optional(S.String).pipe(T.JsonName("segmentPrefix")),
    StreamSelection: S.optional(StreamSelection)
      .pipe(T.JsonName("streamSelection"))
      .annotations({ identifier: "StreamSelection" }),
  }),
).annotations({ identifier: "CmafPackage" }) as any as S.Schema<CmafPackage>;
export interface UpdateOriginEndpointResponse {
  Arn?: string;
  Authorization?: Authorization & {
    CdnIdentifierSecret: string;
    SecretsRoleArn: string;
  };
  ChannelId?: string;
  CmafPackage?: CmafPackage & {
    Encryption: CmafEncryption & {
      SpekeKeyProvider: SpekeKeyProvider & {
        ResourceId: string;
        RoleArn: string;
        SystemIds: __listOf__string;
        Url: string;
        EncryptionContractConfiguration: EncryptionContractConfiguration & {
          PresetSpeke20Audio: PresetSpeke20Audio;
          PresetSpeke20Video: PresetSpeke20Video;
        };
      };
    };
    HlsManifests: (HlsManifest & { Id: string })[];
  };
  CreatedAt?: string;
  DashPackage?: DashPackage & {
    Encryption: DashEncryption & {
      SpekeKeyProvider: SpekeKeyProvider & {
        ResourceId: string;
        RoleArn: string;
        SystemIds: __listOf__string;
        Url: string;
        EncryptionContractConfiguration: EncryptionContractConfiguration & {
          PresetSpeke20Audio: PresetSpeke20Audio;
          PresetSpeke20Video: PresetSpeke20Video;
        };
      };
    };
  };
  Description?: string;
  HlsPackage?: HlsPackage & {
    Encryption: HlsEncryption & {
      SpekeKeyProvider: SpekeKeyProvider & {
        ResourceId: string;
        RoleArn: string;
        SystemIds: __listOf__string;
        Url: string;
        EncryptionContractConfiguration: EncryptionContractConfiguration & {
          PresetSpeke20Audio: PresetSpeke20Audio;
          PresetSpeke20Video: PresetSpeke20Video;
        };
      };
    };
  };
  Id?: string;
  ManifestName?: string;
  MssPackage?: MssPackage & {
    Encryption: MssEncryption & {
      SpekeKeyProvider: SpekeKeyProvider & {
        ResourceId: string;
        RoleArn: string;
        SystemIds: __listOf__string;
        Url: string;
        EncryptionContractConfiguration: EncryptionContractConfiguration & {
          PresetSpeke20Audio: PresetSpeke20Audio;
          PresetSpeke20Video: PresetSpeke20Video;
        };
      };
    };
  };
  Origination?: Origination;
  StartoverWindowSeconds?: number;
  Tags?: { [key: string]: string | undefined };
  TimeDelaySeconds?: number;
  Url?: string;
  Whitelist?: string[];
}
export const UpdateOriginEndpointResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Authorization: S.optional(Authorization)
      .pipe(T.JsonName("authorization"))
      .annotations({ identifier: "Authorization" }),
    ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
    CmafPackage: S.optional(CmafPackage)
      .pipe(T.JsonName("cmafPackage"))
      .annotations({ identifier: "CmafPackage" }),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    DashPackage: S.optional(DashPackage)
      .pipe(T.JsonName("dashPackage"))
      .annotations({ identifier: "DashPackage" }),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    HlsPackage: S.optional(HlsPackage)
      .pipe(T.JsonName("hlsPackage"))
      .annotations({ identifier: "HlsPackage" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    ManifestName: S.optional(S.String).pipe(T.JsonName("manifestName")),
    MssPackage: S.optional(MssPackage)
      .pipe(T.JsonName("mssPackage"))
      .annotations({ identifier: "MssPackage" }),
    Origination: S.optional(Origination).pipe(T.JsonName("origination")),
    StartoverWindowSeconds: S.optional(S.Number).pipe(
      T.JsonName("startoverWindowSeconds"),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    TimeDelaySeconds: S.optional(S.Number).pipe(T.JsonName("timeDelaySeconds")),
    Url: S.optional(S.String).pipe(T.JsonName("url")),
    Whitelist: S.optional(__listOf__string).pipe(T.JsonName("whitelist")),
  }),
).annotations({
  identifier: "UpdateOriginEndpointResponse",
}) as any as S.Schema<UpdateOriginEndpointResponse>;
export interface Channel {
  Arn?: string;
  CreatedAt?: string;
  Description?: string;
  EgressAccessLogs?: EgressAccessLogs;
  HlsIngest?: HlsIngest;
  Id?: string;
  IngressAccessLogs?: IngressAccessLogs;
  Tags?: { [key: string]: string | undefined };
}
export const Channel = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EgressAccessLogs: S.optional(EgressAccessLogs)
      .pipe(T.JsonName("egressAccessLogs"))
      .annotations({ identifier: "EgressAccessLogs" }),
    HlsIngest: S.optional(HlsIngest)
      .pipe(T.JsonName("hlsIngest"))
      .annotations({ identifier: "HlsIngest" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    IngressAccessLogs: S.optional(IngressAccessLogs)
      .pipe(T.JsonName("ingressAccessLogs"))
      .annotations({ identifier: "IngressAccessLogs" }),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({ identifier: "Channel" }) as any as S.Schema<Channel>;
export type __listOfChannel = Channel[];
export const __listOfChannel = S.Array(Channel);
export interface HarvestJob {
  Arn?: string;
  ChannelId?: string;
  CreatedAt?: string;
  EndTime?: string;
  Id?: string;
  OriginEndpointId?: string;
  S3Destination?: S3Destination;
  StartTime?: string;
  Status?: Status;
}
export const HarvestJob = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    EndTime: S.optional(S.String).pipe(T.JsonName("endTime")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    OriginEndpointId: S.optional(S.String).pipe(T.JsonName("originEndpointId")),
    S3Destination: S.optional(S3Destination)
      .pipe(T.JsonName("s3Destination"))
      .annotations({ identifier: "S3Destination" }),
    StartTime: S.optional(S.String).pipe(T.JsonName("startTime")),
    Status: S.optional(Status).pipe(T.JsonName("status")),
  }),
).annotations({ identifier: "HarvestJob" }) as any as S.Schema<HarvestJob>;
export type __listOfHarvestJob = HarvestJob[];
export const __listOfHarvestJob = S.Array(HarvestJob);
export interface OriginEndpoint {
  Arn?: string;
  Authorization?: Authorization;
  ChannelId?: string;
  CmafPackage?: CmafPackage;
  CreatedAt?: string;
  DashPackage?: DashPackage;
  Description?: string;
  HlsPackage?: HlsPackage;
  Id?: string;
  ManifestName?: string;
  MssPackage?: MssPackage;
  Origination?: Origination;
  StartoverWindowSeconds?: number;
  Tags?: { [key: string]: string | undefined };
  TimeDelaySeconds?: number;
  Url?: string;
  Whitelist?: string[];
}
export const OriginEndpoint = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Authorization: S.optional(Authorization)
      .pipe(T.JsonName("authorization"))
      .annotations({ identifier: "Authorization" }),
    ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
    CmafPackage: S.optional(CmafPackage)
      .pipe(T.JsonName("cmafPackage"))
      .annotations({ identifier: "CmafPackage" }),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    DashPackage: S.optional(DashPackage)
      .pipe(T.JsonName("dashPackage"))
      .annotations({ identifier: "DashPackage" }),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    HlsPackage: S.optional(HlsPackage)
      .pipe(T.JsonName("hlsPackage"))
      .annotations({ identifier: "HlsPackage" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    ManifestName: S.optional(S.String).pipe(T.JsonName("manifestName")),
    MssPackage: S.optional(MssPackage)
      .pipe(T.JsonName("mssPackage"))
      .annotations({ identifier: "MssPackage" }),
    Origination: S.optional(Origination).pipe(T.JsonName("origination")),
    StartoverWindowSeconds: S.optional(S.Number).pipe(
      T.JsonName("startoverWindowSeconds"),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    TimeDelaySeconds: S.optional(S.Number).pipe(T.JsonName("timeDelaySeconds")),
    Url: S.optional(S.String).pipe(T.JsonName("url")),
    Whitelist: S.optional(__listOf__string).pipe(T.JsonName("whitelist")),
  }),
).annotations({
  identifier: "OriginEndpoint",
}) as any as S.Schema<OriginEndpoint>;
export type __listOfOriginEndpoint = OriginEndpoint[];
export const __listOfOriginEndpoint = S.Array(OriginEndpoint);
export interface ConfigureLogsResponse {
  Arn?: string;
  CreatedAt?: string;
  Description?: string;
  EgressAccessLogs?: EgressAccessLogs;
  HlsIngest?: HlsIngest;
  Id?: string;
  IngressAccessLogs?: IngressAccessLogs;
  Tags?: { [key: string]: string | undefined };
}
export const ConfigureLogsResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EgressAccessLogs: S.optional(EgressAccessLogs)
      .pipe(T.JsonName("egressAccessLogs"))
      .annotations({ identifier: "EgressAccessLogs" }),
    HlsIngest: S.optional(HlsIngest)
      .pipe(T.JsonName("hlsIngest"))
      .annotations({ identifier: "HlsIngest" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    IngressAccessLogs: S.optional(IngressAccessLogs)
      .pipe(T.JsonName("ingressAccessLogs"))
      .annotations({ identifier: "IngressAccessLogs" }),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "ConfigureLogsResponse",
}) as any as S.Schema<ConfigureLogsResponse>;
export interface CreateChannelResponse {
  Arn?: string;
  CreatedAt?: string;
  Description?: string;
  EgressAccessLogs?: EgressAccessLogs;
  HlsIngest?: HlsIngest;
  Id?: string;
  IngressAccessLogs?: IngressAccessLogs;
  Tags?: { [key: string]: string | undefined };
}
export const CreateChannelResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EgressAccessLogs: S.optional(EgressAccessLogs)
      .pipe(T.JsonName("egressAccessLogs"))
      .annotations({ identifier: "EgressAccessLogs" }),
    HlsIngest: S.optional(HlsIngest)
      .pipe(T.JsonName("hlsIngest"))
      .annotations({ identifier: "HlsIngest" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    IngressAccessLogs: S.optional(IngressAccessLogs)
      .pipe(T.JsonName("ingressAccessLogs"))
      .annotations({ identifier: "IngressAccessLogs" }),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "CreateChannelResponse",
}) as any as S.Schema<CreateChannelResponse>;
export interface CreateHarvestJobResponse {
  Arn?: string;
  ChannelId?: string;
  CreatedAt?: string;
  EndTime?: string;
  Id?: string;
  OriginEndpointId?: string;
  S3Destination?: S3Destination & {
    BucketName: string;
    ManifestKey: string;
    RoleArn: string;
  };
  StartTime?: string;
  Status?: Status;
}
export const CreateHarvestJobResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    EndTime: S.optional(S.String).pipe(T.JsonName("endTime")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    OriginEndpointId: S.optional(S.String).pipe(T.JsonName("originEndpointId")),
    S3Destination: S.optional(S3Destination)
      .pipe(T.JsonName("s3Destination"))
      .annotations({ identifier: "S3Destination" }),
    StartTime: S.optional(S.String).pipe(T.JsonName("startTime")),
    Status: S.optional(Status).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "CreateHarvestJobResponse",
}) as any as S.Schema<CreateHarvestJobResponse>;
export interface ListChannelsResponse {
  Channels?: Channel[];
  NextToken?: string;
}
export const ListChannelsResponse = S.suspend(() =>
  S.Struct({
    Channels: S.optional(__listOfChannel).pipe(T.JsonName("channels")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListChannelsResponse",
}) as any as S.Schema<ListChannelsResponse>;
export interface ListHarvestJobsResponse {
  HarvestJobs?: (HarvestJob & {
    S3Destination: S3Destination & {
      BucketName: string;
      ManifestKey: string;
      RoleArn: string;
    };
  })[];
  NextToken?: string;
}
export const ListHarvestJobsResponse = S.suspend(() =>
  S.Struct({
    HarvestJobs: S.optional(__listOfHarvestJob).pipe(T.JsonName("harvestJobs")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListHarvestJobsResponse",
}) as any as S.Schema<ListHarvestJobsResponse>;
export interface ListOriginEndpointsResponse {
  NextToken?: string;
  OriginEndpoints?: (OriginEndpoint & {
    Authorization: Authorization & {
      CdnIdentifierSecret: string;
      SecretsRoleArn: string;
    };
    CmafPackage: CmafPackage & {
      Encryption: CmafEncryption & {
        SpekeKeyProvider: SpekeKeyProvider & {
          ResourceId: string;
          RoleArn: string;
          SystemIds: __listOf__string;
          Url: string;
          EncryptionContractConfiguration: EncryptionContractConfiguration & {
            PresetSpeke20Audio: PresetSpeke20Audio;
            PresetSpeke20Video: PresetSpeke20Video;
          };
        };
      };
      HlsManifests: (HlsManifest & { Id: string })[];
    };
    DashPackage: DashPackage & {
      Encryption: DashEncryption & {
        SpekeKeyProvider: SpekeKeyProvider & {
          ResourceId: string;
          RoleArn: string;
          SystemIds: __listOf__string;
          Url: string;
          EncryptionContractConfiguration: EncryptionContractConfiguration & {
            PresetSpeke20Audio: PresetSpeke20Audio;
            PresetSpeke20Video: PresetSpeke20Video;
          };
        };
      };
    };
    HlsPackage: HlsPackage & {
      Encryption: HlsEncryption & {
        SpekeKeyProvider: SpekeKeyProvider & {
          ResourceId: string;
          RoleArn: string;
          SystemIds: __listOf__string;
          Url: string;
          EncryptionContractConfiguration: EncryptionContractConfiguration & {
            PresetSpeke20Audio: PresetSpeke20Audio;
            PresetSpeke20Video: PresetSpeke20Video;
          };
        };
      };
    };
    MssPackage: MssPackage & {
      Encryption: MssEncryption & {
        SpekeKeyProvider: SpekeKeyProvider & {
          ResourceId: string;
          RoleArn: string;
          SystemIds: __listOf__string;
          Url: string;
          EncryptionContractConfiguration: EncryptionContractConfiguration & {
            PresetSpeke20Audio: PresetSpeke20Audio;
            PresetSpeke20Video: PresetSpeke20Video;
          };
        };
      };
    };
  })[];
}
export const ListOriginEndpointsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    OriginEndpoints: S.optional(__listOfOriginEndpoint).pipe(
      T.JsonName("originEndpoints"),
    ),
  }),
).annotations({
  identifier: "ListOriginEndpointsResponse",
}) as any as S.Schema<ListOriginEndpointsResponse>;
export interface DescribeChannelResponse {
  Arn?: string;
  CreatedAt?: string;
  Description?: string;
  EgressAccessLogs?: EgressAccessLogs;
  HlsIngest?: HlsIngest;
  Id?: string;
  IngressAccessLogs?: IngressAccessLogs;
  Tags?: { [key: string]: string | undefined };
}
export const DescribeChannelResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EgressAccessLogs: S.optional(EgressAccessLogs)
      .pipe(T.JsonName("egressAccessLogs"))
      .annotations({ identifier: "EgressAccessLogs" }),
    HlsIngest: S.optional(HlsIngest)
      .pipe(T.JsonName("hlsIngest"))
      .annotations({ identifier: "HlsIngest" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    IngressAccessLogs: S.optional(IngressAccessLogs)
      .pipe(T.JsonName("ingressAccessLogs"))
      .annotations({ identifier: "IngressAccessLogs" }),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "DescribeChannelResponse",
}) as any as S.Schema<DescribeChannelResponse>;
export interface DescribeOriginEndpointResponse {
  Arn?: string;
  Authorization?: Authorization & {
    CdnIdentifierSecret: string;
    SecretsRoleArn: string;
  };
  ChannelId?: string;
  CmafPackage?: CmafPackage & {
    Encryption: CmafEncryption & {
      SpekeKeyProvider: SpekeKeyProvider & {
        ResourceId: string;
        RoleArn: string;
        SystemIds: __listOf__string;
        Url: string;
        EncryptionContractConfiguration: EncryptionContractConfiguration & {
          PresetSpeke20Audio: PresetSpeke20Audio;
          PresetSpeke20Video: PresetSpeke20Video;
        };
      };
    };
    HlsManifests: (HlsManifest & { Id: string })[];
  };
  CreatedAt?: string;
  DashPackage?: DashPackage & {
    Encryption: DashEncryption & {
      SpekeKeyProvider: SpekeKeyProvider & {
        ResourceId: string;
        RoleArn: string;
        SystemIds: __listOf__string;
        Url: string;
        EncryptionContractConfiguration: EncryptionContractConfiguration & {
          PresetSpeke20Audio: PresetSpeke20Audio;
          PresetSpeke20Video: PresetSpeke20Video;
        };
      };
    };
  };
  Description?: string;
  HlsPackage?: HlsPackage & {
    Encryption: HlsEncryption & {
      SpekeKeyProvider: SpekeKeyProvider & {
        ResourceId: string;
        RoleArn: string;
        SystemIds: __listOf__string;
        Url: string;
        EncryptionContractConfiguration: EncryptionContractConfiguration & {
          PresetSpeke20Audio: PresetSpeke20Audio;
          PresetSpeke20Video: PresetSpeke20Video;
        };
      };
    };
  };
  Id?: string;
  ManifestName?: string;
  MssPackage?: MssPackage & {
    Encryption: MssEncryption & {
      SpekeKeyProvider: SpekeKeyProvider & {
        ResourceId: string;
        RoleArn: string;
        SystemIds: __listOf__string;
        Url: string;
        EncryptionContractConfiguration: EncryptionContractConfiguration & {
          PresetSpeke20Audio: PresetSpeke20Audio;
          PresetSpeke20Video: PresetSpeke20Video;
        };
      };
    };
  };
  Origination?: Origination;
  StartoverWindowSeconds?: number;
  Tags?: { [key: string]: string | undefined };
  TimeDelaySeconds?: number;
  Url?: string;
  Whitelist?: string[];
}
export const DescribeOriginEndpointResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Authorization: S.optional(Authorization)
      .pipe(T.JsonName("authorization"))
      .annotations({ identifier: "Authorization" }),
    ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
    CmafPackage: S.optional(CmafPackage)
      .pipe(T.JsonName("cmafPackage"))
      .annotations({ identifier: "CmafPackage" }),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    DashPackage: S.optional(DashPackage)
      .pipe(T.JsonName("dashPackage"))
      .annotations({ identifier: "DashPackage" }),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    HlsPackage: S.optional(HlsPackage)
      .pipe(T.JsonName("hlsPackage"))
      .annotations({ identifier: "HlsPackage" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    ManifestName: S.optional(S.String).pipe(T.JsonName("manifestName")),
    MssPackage: S.optional(MssPackage)
      .pipe(T.JsonName("mssPackage"))
      .annotations({ identifier: "MssPackage" }),
    Origination: S.optional(Origination).pipe(T.JsonName("origination")),
    StartoverWindowSeconds: S.optional(S.Number).pipe(
      T.JsonName("startoverWindowSeconds"),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    TimeDelaySeconds: S.optional(S.Number).pipe(T.JsonName("timeDelaySeconds")),
    Url: S.optional(S.String).pipe(T.JsonName("url")),
    Whitelist: S.optional(__listOf__string).pipe(T.JsonName("whitelist")),
  }),
).annotations({
  identifier: "DescribeOriginEndpointResponse",
}) as any as S.Schema<DescribeOriginEndpointResponse>;
export interface CreateOriginEndpointRequest {
  Authorization?: Authorization;
  ChannelId?: string;
  CmafPackage?: CmafPackageCreateOrUpdateParameters;
  DashPackage?: DashPackage;
  Description?: string;
  HlsPackage?: HlsPackage;
  Id?: string;
  ManifestName?: string;
  MssPackage?: MssPackage;
  Origination?: Origination;
  StartoverWindowSeconds?: number;
  Tags?: { [key: string]: string | undefined };
  TimeDelaySeconds?: number;
  Whitelist?: string[];
}
export const CreateOriginEndpointRequest = S.suspend(() =>
  S.Struct({
    Authorization: S.optional(Authorization)
      .pipe(T.JsonName("authorization"))
      .annotations({ identifier: "Authorization" }),
    ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
    CmafPackage: S.optional(CmafPackageCreateOrUpdateParameters)
      .pipe(T.JsonName("cmafPackage"))
      .annotations({ identifier: "CmafPackageCreateOrUpdateParameters" }),
    DashPackage: S.optional(DashPackage)
      .pipe(T.JsonName("dashPackage"))
      .annotations({ identifier: "DashPackage" }),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    HlsPackage: S.optional(HlsPackage)
      .pipe(T.JsonName("hlsPackage"))
      .annotations({ identifier: "HlsPackage" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    ManifestName: S.optional(S.String).pipe(T.JsonName("manifestName")),
    MssPackage: S.optional(MssPackage)
      .pipe(T.JsonName("mssPackage"))
      .annotations({ identifier: "MssPackage" }),
    Origination: S.optional(Origination).pipe(T.JsonName("origination")),
    StartoverWindowSeconds: S.optional(S.Number).pipe(
      T.JsonName("startoverWindowSeconds"),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    TimeDelaySeconds: S.optional(S.Number).pipe(T.JsonName("timeDelaySeconds")),
    Whitelist: S.optional(__listOf__string).pipe(T.JsonName("whitelist")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/origin_endpoints" }),
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
  Arn?: string;
  Authorization?: Authorization & {
    CdnIdentifierSecret: string;
    SecretsRoleArn: string;
  };
  ChannelId?: string;
  CmafPackage?: CmafPackage & {
    Encryption: CmafEncryption & {
      SpekeKeyProvider: SpekeKeyProvider & {
        ResourceId: string;
        RoleArn: string;
        SystemIds: __listOf__string;
        Url: string;
        EncryptionContractConfiguration: EncryptionContractConfiguration & {
          PresetSpeke20Audio: PresetSpeke20Audio;
          PresetSpeke20Video: PresetSpeke20Video;
        };
      };
    };
    HlsManifests: (HlsManifest & { Id: string })[];
  };
  CreatedAt?: string;
  DashPackage?: DashPackage & {
    Encryption: DashEncryption & {
      SpekeKeyProvider: SpekeKeyProvider & {
        ResourceId: string;
        RoleArn: string;
        SystemIds: __listOf__string;
        Url: string;
        EncryptionContractConfiguration: EncryptionContractConfiguration & {
          PresetSpeke20Audio: PresetSpeke20Audio;
          PresetSpeke20Video: PresetSpeke20Video;
        };
      };
    };
  };
  Description?: string;
  HlsPackage?: HlsPackage & {
    Encryption: HlsEncryption & {
      SpekeKeyProvider: SpekeKeyProvider & {
        ResourceId: string;
        RoleArn: string;
        SystemIds: __listOf__string;
        Url: string;
        EncryptionContractConfiguration: EncryptionContractConfiguration & {
          PresetSpeke20Audio: PresetSpeke20Audio;
          PresetSpeke20Video: PresetSpeke20Video;
        };
      };
    };
  };
  Id?: string;
  ManifestName?: string;
  MssPackage?: MssPackage & {
    Encryption: MssEncryption & {
      SpekeKeyProvider: SpekeKeyProvider & {
        ResourceId: string;
        RoleArn: string;
        SystemIds: __listOf__string;
        Url: string;
        EncryptionContractConfiguration: EncryptionContractConfiguration & {
          PresetSpeke20Audio: PresetSpeke20Audio;
          PresetSpeke20Video: PresetSpeke20Video;
        };
      };
    };
  };
  Origination?: Origination;
  StartoverWindowSeconds?: number;
  Tags?: { [key: string]: string | undefined };
  TimeDelaySeconds?: number;
  Url?: string;
  Whitelist?: string[];
}
export const CreateOriginEndpointResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Authorization: S.optional(Authorization)
      .pipe(T.JsonName("authorization"))
      .annotations({ identifier: "Authorization" }),
    ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
    CmafPackage: S.optional(CmafPackage)
      .pipe(T.JsonName("cmafPackage"))
      .annotations({ identifier: "CmafPackage" }),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    DashPackage: S.optional(DashPackage)
      .pipe(T.JsonName("dashPackage"))
      .annotations({ identifier: "DashPackage" }),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    HlsPackage: S.optional(HlsPackage)
      .pipe(T.JsonName("hlsPackage"))
      .annotations({ identifier: "HlsPackage" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    ManifestName: S.optional(S.String).pipe(T.JsonName("manifestName")),
    MssPackage: S.optional(MssPackage)
      .pipe(T.JsonName("mssPackage"))
      .annotations({ identifier: "MssPackage" }),
    Origination: S.optional(Origination).pipe(T.JsonName("origination")),
    StartoverWindowSeconds: S.optional(S.Number).pipe(
      T.JsonName("startoverWindowSeconds"),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    TimeDelaySeconds: S.optional(S.Number).pipe(T.JsonName("timeDelaySeconds")),
    Url: S.optional(S.String).pipe(T.JsonName("url")),
    Whitelist: S.optional(__listOf__string).pipe(T.JsonName("whitelist")),
  }),
).annotations({
  identifier: "CreateOriginEndpointResponse",
}) as any as S.Schema<CreateOriginEndpointResponse>;

//# Errors
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withAuthError) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withServerError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withServerError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withThrottlingError) {}
export class UnprocessableEntityException extends S.TaggedError<UnprocessableEntityException>()(
  "UnprocessableEntityException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 *
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [],
}));
/**
 *
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [],
}));
/**
 *
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [],
}));
/**
 * Deletes an existing Channel.
 */
export const deleteChannel: (
  input: DeleteChannelRequest,
) => effect.Effect<
  DeleteChannelResponse,
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChannelRequest,
  output: DeleteChannelResponse,
  errors: [
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Gets details about a Channel.
 */
export const describeChannel: (
  input: DescribeChannelRequest,
) => effect.Effect<
  DescribeChannelResponse,
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeChannelRequest,
  output: DescribeChannelResponse,
  errors: [
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Gets details about an existing OriginEndpoint.
 */
export const describeOriginEndpoint: (
  input: DescribeOriginEndpointRequest,
) => effect.Effect<
  DescribeOriginEndpointResponse,
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeOriginEndpointRequest,
  output: DescribeOriginEndpointResponse,
  errors: [
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Returns a collection of Channels.
 */
export const listChannels: {
  (
    input: ListChannelsRequest,
  ): effect.Effect<
    ListChannelsResponse,
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnprocessableEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChannelsRequest,
  ) => stream.Stream<
    ListChannelsResponse,
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnprocessableEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChannelsRequest,
  ) => stream.Stream<
    Channel,
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnprocessableEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChannelsRequest,
  output: ListChannelsResponse,
  errors: [
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Channels",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a collection of HarvestJob records.
 */
export const listHarvestJobs: {
  (
    input: ListHarvestJobsRequest,
  ): effect.Effect<
    ListHarvestJobsResponse,
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnprocessableEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListHarvestJobsRequest,
  ) => stream.Stream<
    ListHarvestJobsResponse,
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnprocessableEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListHarvestJobsRequest,
  ) => stream.Stream<
    HarvestJob,
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnprocessableEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListHarvestJobsRequest,
  output: ListHarvestJobsResponse,
  errors: [
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "HarvestJobs",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a collection of OriginEndpoint records.
 */
export const listOriginEndpoints: {
  (
    input: ListOriginEndpointsRequest,
  ): effect.Effect<
    ListOriginEndpointsResponse,
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnprocessableEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOriginEndpointsRequest,
  ) => stream.Stream<
    ListOriginEndpointsResponse,
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnprocessableEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOriginEndpointsRequest,
  ) => stream.Stream<
    OriginEndpoint,
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnprocessableEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOriginEndpointsRequest,
  output: ListOriginEndpointsResponse,
  errors: [
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "OriginEndpoints",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Gets details about an existing HarvestJob.
 */
export const describeHarvestJob: (
  input: DescribeHarvestJobRequest,
) => effect.Effect<
  DescribeHarvestJobResponse,
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeHarvestJobRequest,
  output: DescribeHarvestJobResponse,
  errors: [
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Changes the Channel's first IngestEndpoint's username and password. WARNING - This API is deprecated. Please use RotateIngestEndpointCredentials instead
 */
export const rotateChannelCredentials: (
  input: RotateChannelCredentialsRequest,
) => effect.Effect<
  RotateChannelCredentialsResponse,
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RotateChannelCredentialsRequest,
  output: RotateChannelCredentialsResponse,
  errors: [
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Rotate the IngestEndpoint's username and password, as specified by the IngestEndpoint's id.
 */
export const rotateIngestEndpointCredentials: (
  input: RotateIngestEndpointCredentialsRequest,
) => effect.Effect<
  RotateIngestEndpointCredentialsResponse,
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RotateIngestEndpointCredentialsRequest,
  output: RotateIngestEndpointCredentialsResponse,
  errors: [
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Updates an existing Channel.
 */
export const updateChannel: (
  input: UpdateChannelRequest,
) => effect.Effect<
  UpdateChannelResponse,
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateChannelRequest,
  output: UpdateChannelResponse,
  errors: [
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Updates an existing OriginEndpoint.
 */
export const updateOriginEndpoint: (
  input: UpdateOriginEndpointRequest,
) => effect.Effect<
  UpdateOriginEndpointResponse,
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateOriginEndpointRequest,
  output: UpdateOriginEndpointResponse,
  errors: [
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Deletes an existing OriginEndpoint.
 */
export const deleteOriginEndpoint: (
  input: DeleteOriginEndpointRequest,
) => effect.Effect<
  DeleteOriginEndpointResponse,
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOriginEndpointRequest,
  output: DeleteOriginEndpointResponse,
  errors: [
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Changes the Channel's properities to configure log subscription
 */
export const configureLogs: (
  input: ConfigureLogsRequest,
) => effect.Effect<
  ConfigureLogsResponse,
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ConfigureLogsRequest,
  output: ConfigureLogsResponse,
  errors: [
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Creates a new Channel.
 */
export const createChannel: (
  input: CreateChannelRequest,
) => effect.Effect<
  CreateChannelResponse,
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChannelRequest,
  output: CreateChannelResponse,
  errors: [
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Creates a new HarvestJob record.
 */
export const createHarvestJob: (
  input: CreateHarvestJobRequest,
) => effect.Effect<
  CreateHarvestJobResponse,
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateHarvestJobRequest,
  output: CreateHarvestJobResponse,
  errors: [
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Creates a new OriginEndpoint record.
 */
export const createOriginEndpoint: (
  input: CreateOriginEndpointRequest,
) => effect.Effect<
  CreateOriginEndpointResponse,
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOriginEndpointRequest,
  output: CreateOriginEndpointResponse,
  errors: [
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
