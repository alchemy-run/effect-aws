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
  sdkId: "MediaPackage Vod",
  serviceShapeName: "MediaPackageVod",
});
const auth = T.AwsAuthSigv4({ name: "mediapackage-vod" });
const ver = T.ServiceVersion("2018-11-07");
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
              `https://mediapackage-vod-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://mediapackage-vod-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://mediapackage-vod.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://mediapackage-vod.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type __string = string;
export type MaxResults = number;
export type __integer = number;

//# Schemas
export type __listOf__string = string[];
export const __listOf__string = S.Array(S.String);
export interface DeleteAssetRequest {
  Id: string;
}
export const DeleteAssetRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/assets/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAssetRequest",
}) as any as S.Schema<DeleteAssetRequest>;
export interface DeleteAssetResponse {}
export const DeleteAssetResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteAssetResponse",
}) as any as S.Schema<DeleteAssetResponse>;
export interface DeletePackagingConfigurationRequest {
  Id: string;
}
export const DeletePackagingConfigurationRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/packaging_configurations/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePackagingConfigurationRequest",
}) as any as S.Schema<DeletePackagingConfigurationRequest>;
export interface DeletePackagingConfigurationResponse {}
export const DeletePackagingConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePackagingConfigurationResponse",
}) as any as S.Schema<DeletePackagingConfigurationResponse>;
export interface DeletePackagingGroupRequest {
  Id: string;
}
export const DeletePackagingGroupRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/packaging_groups/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePackagingGroupRequest",
}) as any as S.Schema<DeletePackagingGroupRequest>;
export interface DeletePackagingGroupResponse {}
export const DeletePackagingGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePackagingGroupResponse",
}) as any as S.Schema<DeletePackagingGroupResponse>;
export interface DescribeAssetRequest {
  Id: string;
}
export const DescribeAssetRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/assets/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAssetRequest",
}) as any as S.Schema<DescribeAssetRequest>;
export interface DescribePackagingConfigurationRequest {
  Id: string;
}
export const DescribePackagingConfigurationRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/packaging_configurations/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePackagingConfigurationRequest",
}) as any as S.Schema<DescribePackagingConfigurationRequest>;
export interface DescribePackagingGroupRequest {
  Id: string;
}
export const DescribePackagingGroupRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/packaging_groups/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePackagingGroupRequest",
}) as any as S.Schema<DescribePackagingGroupRequest>;
export interface ListAssetsRequest {
  MaxResults?: number;
  NextToken?: string;
  PackagingGroupId?: string;
}
export const ListAssetsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    PackagingGroupId: S.optional(S.String).pipe(
      T.HttpQuery("packagingGroupId"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/assets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssetsRequest",
}) as any as S.Schema<ListAssetsRequest>;
export interface ListPackagingConfigurationsRequest {
  MaxResults?: number;
  NextToken?: string;
  PackagingGroupId?: string;
}
export const ListPackagingConfigurationsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    PackagingGroupId: S.optional(S.String).pipe(
      T.HttpQuery("packagingGroupId"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/packaging_configurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPackagingConfigurationsRequest",
}) as any as S.Schema<ListPackagingConfigurationsRequest>;
export interface ListPackagingGroupsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListPackagingGroupsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/packaging_groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPackagingGroupsRequest",
}) as any as S.Schema<ListPackagingGroupsRequest>;
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
  TagKeys: __listOf__string;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: __listOf__string.pipe(T.HttpQuery("tagKeys")),
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
export interface Authorization {
  CdnIdentifierSecret: string;
  SecretsRoleArn: string;
}
export const Authorization = S.suspend(() =>
  S.Struct({
    CdnIdentifierSecret: S.String.pipe(T.JsonName("cdnIdentifierSecret")),
    SecretsRoleArn: S.String.pipe(T.JsonName("secretsRoleArn")),
  }),
).annotations({
  identifier: "Authorization",
}) as any as S.Schema<Authorization>;
export interface UpdatePackagingGroupRequest {
  Authorization?: Authorization;
  Id: string;
}
export const UpdatePackagingGroupRequest = S.suspend(() =>
  S.Struct({
    Authorization: S.optional(Authorization)
      .pipe(T.JsonName("authorization"))
      .annotations({ identifier: "Authorization" }),
    Id: S.String.pipe(T.HttpLabel("Id")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/packaging_groups/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePackagingGroupRequest",
}) as any as S.Schema<UpdatePackagingGroupRequest>;
export type __listOf__PeriodTriggersElement = string[];
export const __listOf__PeriodTriggersElement = S.Array(S.String);
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
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export type __mapOf__string = { [key: string]: string };
export const __mapOf__string = S.Record({ key: S.String, value: S.String });
export interface ConfigureLogsRequest {
  EgressAccessLogs?: EgressAccessLogs;
  Id: string;
}
export const ConfigureLogsRequest = S.suspend(() =>
  S.Struct({
    EgressAccessLogs: S.optional(EgressAccessLogs)
      .pipe(T.JsonName("egressAccessLogs"))
      .annotations({ identifier: "EgressAccessLogs" }),
    Id: S.String.pipe(T.HttpLabel("Id")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/packaging_groups/{Id}/configure_logs" }),
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
export interface CreateAssetRequest {
  Id: string;
  PackagingGroupId: string;
  ResourceId?: string;
  SourceArn: string;
  SourceRoleArn: string;
  Tags?: Tags;
}
export const CreateAssetRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.JsonName("id")),
    PackagingGroupId: S.String.pipe(T.JsonName("packagingGroupId")),
    ResourceId: S.optional(S.String).pipe(T.JsonName("resourceId")),
    SourceArn: S.String.pipe(T.JsonName("sourceArn")),
    SourceRoleArn: S.String.pipe(T.JsonName("sourceRoleArn")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/assets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAssetRequest",
}) as any as S.Schema<CreateAssetRequest>;
export interface CreatePackagingGroupRequest {
  Authorization?: Authorization;
  EgressAccessLogs?: EgressAccessLogs;
  Id: string;
  Tags?: Tags;
}
export const CreatePackagingGroupRequest = S.suspend(() =>
  S.Struct({
    Authorization: S.optional(Authorization)
      .pipe(T.JsonName("authorization"))
      .annotations({ identifier: "Authorization" }),
    EgressAccessLogs: S.optional(EgressAccessLogs)
      .pipe(T.JsonName("egressAccessLogs"))
      .annotations({ identifier: "EgressAccessLogs" }),
    Id: S.String.pipe(T.JsonName("id")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/packaging_groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePackagingGroupRequest",
}) as any as S.Schema<CreatePackagingGroupRequest>;
export interface EncryptionContractConfiguration {
  PresetSpeke20Audio: string;
  PresetSpeke20Video: string;
}
export const EncryptionContractConfiguration = S.suspend(() =>
  S.Struct({
    PresetSpeke20Audio: S.String.pipe(T.JsonName("presetSpeke20Audio")),
    PresetSpeke20Video: S.String.pipe(T.JsonName("presetSpeke20Video")),
  }),
).annotations({
  identifier: "EncryptionContractConfiguration",
}) as any as S.Schema<EncryptionContractConfiguration>;
export interface SpekeKeyProvider {
  EncryptionContractConfiguration?: EncryptionContractConfiguration;
  RoleArn: string;
  SystemIds: __listOf__string;
  Url: string;
}
export const SpekeKeyProvider = S.suspend(() =>
  S.Struct({
    EncryptionContractConfiguration: S.optional(EncryptionContractConfiguration)
      .pipe(T.JsonName("encryptionContractConfiguration"))
      .annotations({ identifier: "EncryptionContractConfiguration" }),
    RoleArn: S.String.pipe(T.JsonName("roleArn")),
    SystemIds: __listOf__string.pipe(T.JsonName("systemIds")),
    Url: S.String.pipe(T.JsonName("url")),
  }),
).annotations({
  identifier: "SpekeKeyProvider",
}) as any as S.Schema<SpekeKeyProvider>;
export interface CmafEncryption {
  ConstantInitializationVector?: string;
  SpekeKeyProvider: SpekeKeyProvider;
}
export const CmafEncryption = S.suspend(() =>
  S.Struct({
    ConstantInitializationVector: S.optional(S.String).pipe(
      T.JsonName("constantInitializationVector"),
    ),
    SpekeKeyProvider: SpekeKeyProvider.pipe(
      T.JsonName("spekeKeyProvider"),
    ).annotations({ identifier: "SpekeKeyProvider" }),
  }),
).annotations({
  identifier: "CmafEncryption",
}) as any as S.Schema<CmafEncryption>;
export interface StreamSelection {
  MaxVideoBitsPerSecond?: number;
  MinVideoBitsPerSecond?: number;
  StreamOrder?: string;
}
export const StreamSelection = S.suspend(() =>
  S.Struct({
    MaxVideoBitsPerSecond: S.optional(S.Number).pipe(
      T.JsonName("maxVideoBitsPerSecond"),
    ),
    MinVideoBitsPerSecond: S.optional(S.Number).pipe(
      T.JsonName("minVideoBitsPerSecond"),
    ),
    StreamOrder: S.optional(S.String).pipe(T.JsonName("streamOrder")),
  }),
).annotations({
  identifier: "StreamSelection",
}) as any as S.Schema<StreamSelection>;
export interface HlsManifest {
  AdMarkers?: string;
  IncludeIframeOnlyStream?: boolean;
  ManifestName?: string;
  ProgramDateTimeIntervalSeconds?: number;
  RepeatExtXKey?: boolean;
  StreamSelection?: StreamSelection;
}
export const HlsManifest = S.suspend(() =>
  S.Struct({
    AdMarkers: S.optional(S.String).pipe(T.JsonName("adMarkers")),
    IncludeIframeOnlyStream: S.optional(S.Boolean).pipe(
      T.JsonName("includeIframeOnlyStream"),
    ),
    ManifestName: S.optional(S.String).pipe(T.JsonName("manifestName")),
    ProgramDateTimeIntervalSeconds: S.optional(S.Number).pipe(
      T.JsonName("programDateTimeIntervalSeconds"),
    ),
    RepeatExtXKey: S.optional(S.Boolean).pipe(T.JsonName("repeatExtXKey")),
    StreamSelection: S.optional(StreamSelection)
      .pipe(T.JsonName("streamSelection"))
      .annotations({ identifier: "StreamSelection" }),
  }),
).annotations({ identifier: "HlsManifest" }) as any as S.Schema<HlsManifest>;
export type __listOfHlsManifest = HlsManifest[];
export const __listOfHlsManifest = S.Array(HlsManifest);
export interface CmafPackage {
  Encryption?: CmafEncryption;
  HlsManifests: __listOfHlsManifest;
  IncludeEncoderConfigurationInSegments?: boolean;
  SegmentDurationSeconds?: number;
}
export const CmafPackage = S.suspend(() =>
  S.Struct({
    Encryption: S.optional(CmafEncryption)
      .pipe(T.JsonName("encryption"))
      .annotations({ identifier: "CmafEncryption" }),
    HlsManifests: __listOfHlsManifest.pipe(T.JsonName("hlsManifests")),
    IncludeEncoderConfigurationInSegments: S.optional(S.Boolean).pipe(
      T.JsonName("includeEncoderConfigurationInSegments"),
    ),
    SegmentDurationSeconds: S.optional(S.Number).pipe(
      T.JsonName("segmentDurationSeconds"),
    ),
  }),
).annotations({ identifier: "CmafPackage" }) as any as S.Schema<CmafPackage>;
export interface DashManifest {
  ManifestLayout?: string;
  ManifestName?: string;
  MinBufferTimeSeconds?: number;
  Profile?: string;
  ScteMarkersSource?: string;
  StreamSelection?: StreamSelection;
}
export const DashManifest = S.suspend(() =>
  S.Struct({
    ManifestLayout: S.optional(S.String).pipe(T.JsonName("manifestLayout")),
    ManifestName: S.optional(S.String).pipe(T.JsonName("manifestName")),
    MinBufferTimeSeconds: S.optional(S.Number).pipe(
      T.JsonName("minBufferTimeSeconds"),
    ),
    Profile: S.optional(S.String).pipe(T.JsonName("profile")),
    ScteMarkersSource: S.optional(S.String).pipe(
      T.JsonName("scteMarkersSource"),
    ),
    StreamSelection: S.optional(StreamSelection)
      .pipe(T.JsonName("streamSelection"))
      .annotations({ identifier: "StreamSelection" }),
  }),
).annotations({ identifier: "DashManifest" }) as any as S.Schema<DashManifest>;
export type __listOfDashManifest = DashManifest[];
export const __listOfDashManifest = S.Array(DashManifest);
export interface DashEncryption {
  SpekeKeyProvider: SpekeKeyProvider;
}
export const DashEncryption = S.suspend(() =>
  S.Struct({
    SpekeKeyProvider: SpekeKeyProvider.pipe(
      T.JsonName("spekeKeyProvider"),
    ).annotations({ identifier: "SpekeKeyProvider" }),
  }),
).annotations({
  identifier: "DashEncryption",
}) as any as S.Schema<DashEncryption>;
export interface DashPackage {
  DashManifests: __listOfDashManifest;
  Encryption?: DashEncryption;
  IncludeEncoderConfigurationInSegments?: boolean;
  IncludeIframeOnlyStream?: boolean;
  PeriodTriggers?: __listOf__PeriodTriggersElement;
  SegmentDurationSeconds?: number;
  SegmentTemplateFormat?: string;
}
export const DashPackage = S.suspend(() =>
  S.Struct({
    DashManifests: __listOfDashManifest.pipe(T.JsonName("dashManifests")),
    Encryption: S.optional(DashEncryption)
      .pipe(T.JsonName("encryption"))
      .annotations({ identifier: "DashEncryption" }),
    IncludeEncoderConfigurationInSegments: S.optional(S.Boolean).pipe(
      T.JsonName("includeEncoderConfigurationInSegments"),
    ),
    IncludeIframeOnlyStream: S.optional(S.Boolean).pipe(
      T.JsonName("includeIframeOnlyStream"),
    ),
    PeriodTriggers: S.optional(__listOf__PeriodTriggersElement).pipe(
      T.JsonName("periodTriggers"),
    ),
    SegmentDurationSeconds: S.optional(S.Number).pipe(
      T.JsonName("segmentDurationSeconds"),
    ),
    SegmentTemplateFormat: S.optional(S.String).pipe(
      T.JsonName("segmentTemplateFormat"),
    ),
  }),
).annotations({ identifier: "DashPackage" }) as any as S.Schema<DashPackage>;
export interface HlsEncryption {
  ConstantInitializationVector?: string;
  EncryptionMethod?: string;
  SpekeKeyProvider: SpekeKeyProvider;
}
export const HlsEncryption = S.suspend(() =>
  S.Struct({
    ConstantInitializationVector: S.optional(S.String).pipe(
      T.JsonName("constantInitializationVector"),
    ),
    EncryptionMethod: S.optional(S.String).pipe(T.JsonName("encryptionMethod")),
    SpekeKeyProvider: SpekeKeyProvider.pipe(
      T.JsonName("spekeKeyProvider"),
    ).annotations({ identifier: "SpekeKeyProvider" }),
  }),
).annotations({
  identifier: "HlsEncryption",
}) as any as S.Schema<HlsEncryption>;
export interface HlsPackage {
  Encryption?: HlsEncryption;
  HlsManifests: __listOfHlsManifest;
  IncludeDvbSubtitles?: boolean;
  SegmentDurationSeconds?: number;
  UseAudioRenditionGroup?: boolean;
}
export const HlsPackage = S.suspend(() =>
  S.Struct({
    Encryption: S.optional(HlsEncryption)
      .pipe(T.JsonName("encryption"))
      .annotations({ identifier: "HlsEncryption" }),
    HlsManifests: __listOfHlsManifest.pipe(T.JsonName("hlsManifests")),
    IncludeDvbSubtitles: S.optional(S.Boolean).pipe(
      T.JsonName("includeDvbSubtitles"),
    ),
    SegmentDurationSeconds: S.optional(S.Number).pipe(
      T.JsonName("segmentDurationSeconds"),
    ),
    UseAudioRenditionGroup: S.optional(S.Boolean).pipe(
      T.JsonName("useAudioRenditionGroup"),
    ),
  }),
).annotations({ identifier: "HlsPackage" }) as any as S.Schema<HlsPackage>;
export interface MssEncryption {
  SpekeKeyProvider: SpekeKeyProvider;
}
export const MssEncryption = S.suspend(() =>
  S.Struct({
    SpekeKeyProvider: SpekeKeyProvider.pipe(
      T.JsonName("spekeKeyProvider"),
    ).annotations({ identifier: "SpekeKeyProvider" }),
  }),
).annotations({
  identifier: "MssEncryption",
}) as any as S.Schema<MssEncryption>;
export interface MssManifest {
  ManifestName?: string;
  StreamSelection?: StreamSelection;
}
export const MssManifest = S.suspend(() =>
  S.Struct({
    ManifestName: S.optional(S.String).pipe(T.JsonName("manifestName")),
    StreamSelection: S.optional(StreamSelection)
      .pipe(T.JsonName("streamSelection"))
      .annotations({ identifier: "StreamSelection" }),
  }),
).annotations({ identifier: "MssManifest" }) as any as S.Schema<MssManifest>;
export type __listOfMssManifest = MssManifest[];
export const __listOfMssManifest = S.Array(MssManifest);
export interface MssPackage {
  Encryption?: MssEncryption;
  MssManifests: __listOfMssManifest;
  SegmentDurationSeconds?: number;
}
export const MssPackage = S.suspend(() =>
  S.Struct({
    Encryption: S.optional(MssEncryption)
      .pipe(T.JsonName("encryption"))
      .annotations({ identifier: "MssEncryption" }),
    MssManifests: __listOfMssManifest.pipe(T.JsonName("mssManifests")),
    SegmentDurationSeconds: S.optional(S.Number).pipe(
      T.JsonName("segmentDurationSeconds"),
    ),
  }),
).annotations({ identifier: "MssPackage" }) as any as S.Schema<MssPackage>;
export interface DescribePackagingConfigurationResponse {
  Arn?: string;
  CmafPackage?: CmafPackage;
  CreatedAt?: string;
  DashPackage?: DashPackage;
  HlsPackage?: HlsPackage;
  Id?: string;
  MssPackage?: MssPackage;
  PackagingGroupId?: string;
  Tags?: Tags;
}
export const DescribePackagingConfigurationResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CmafPackage: S.optional(CmafPackage)
      .pipe(T.JsonName("cmafPackage"))
      .annotations({ identifier: "CmafPackage" }),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    DashPackage: S.optional(DashPackage)
      .pipe(T.JsonName("dashPackage"))
      .annotations({ identifier: "DashPackage" }),
    HlsPackage: S.optional(HlsPackage)
      .pipe(T.JsonName("hlsPackage"))
      .annotations({ identifier: "HlsPackage" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    MssPackage: S.optional(MssPackage)
      .pipe(T.JsonName("mssPackage"))
      .annotations({ identifier: "MssPackage" }),
    PackagingGroupId: S.optional(S.String).pipe(T.JsonName("packagingGroupId")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "DescribePackagingConfigurationResponse",
}) as any as S.Schema<DescribePackagingConfigurationResponse>;
export interface DescribePackagingGroupResponse {
  ApproximateAssetCount?: number;
  Arn?: string;
  Authorization?: Authorization;
  CreatedAt?: string;
  DomainName?: string;
  EgressAccessLogs?: EgressAccessLogs;
  Id?: string;
  Tags?: Tags;
}
export const DescribePackagingGroupResponse = S.suspend(() =>
  S.Struct({
    ApproximateAssetCount: S.optional(S.Number).pipe(
      T.JsonName("approximateAssetCount"),
    ),
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Authorization: S.optional(Authorization)
      .pipe(T.JsonName("authorization"))
      .annotations({ identifier: "Authorization" }),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    DomainName: S.optional(S.String).pipe(T.JsonName("domainName")),
    EgressAccessLogs: S.optional(EgressAccessLogs)
      .pipe(T.JsonName("egressAccessLogs"))
      .annotations({ identifier: "EgressAccessLogs" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "DescribePackagingGroupResponse",
}) as any as S.Schema<DescribePackagingGroupResponse>;
export interface ListTagsForResourceResponse {
  Tags?: __mapOf__string;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: __mapOf__string;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: __mapOf__string.pipe(T.JsonName("tags")),
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
export interface UpdatePackagingGroupResponse {
  ApproximateAssetCount?: number;
  Arn?: string;
  Authorization?: Authorization;
  CreatedAt?: string;
  DomainName?: string;
  EgressAccessLogs?: EgressAccessLogs;
  Id?: string;
  Tags?: Tags;
}
export const UpdatePackagingGroupResponse = S.suspend(() =>
  S.Struct({
    ApproximateAssetCount: S.optional(S.Number).pipe(
      T.JsonName("approximateAssetCount"),
    ),
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Authorization: S.optional(Authorization)
      .pipe(T.JsonName("authorization"))
      .annotations({ identifier: "Authorization" }),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    DomainName: S.optional(S.String).pipe(T.JsonName("domainName")),
    EgressAccessLogs: S.optional(EgressAccessLogs)
      .pipe(T.JsonName("egressAccessLogs"))
      .annotations({ identifier: "EgressAccessLogs" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "UpdatePackagingGroupResponse",
}) as any as S.Schema<UpdatePackagingGroupResponse>;
export interface EgressEndpoint {
  PackagingConfigurationId?: string;
  Status?: string;
  Url?: string;
}
export const EgressEndpoint = S.suspend(() =>
  S.Struct({
    PackagingConfigurationId: S.optional(S.String).pipe(
      T.JsonName("packagingConfigurationId"),
    ),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
    Url: S.optional(S.String).pipe(T.JsonName("url")),
  }),
).annotations({
  identifier: "EgressEndpoint",
}) as any as S.Schema<EgressEndpoint>;
export type __listOfEgressEndpoint = EgressEndpoint[];
export const __listOfEgressEndpoint = S.Array(EgressEndpoint);
export interface AssetShallow {
  Arn?: string;
  CreatedAt?: string;
  Id?: string;
  PackagingGroupId?: string;
  ResourceId?: string;
  SourceArn?: string;
  SourceRoleArn?: string;
  Tags?: Tags;
}
export const AssetShallow = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    PackagingGroupId: S.optional(S.String).pipe(T.JsonName("packagingGroupId")),
    ResourceId: S.optional(S.String).pipe(T.JsonName("resourceId")),
    SourceArn: S.optional(S.String).pipe(T.JsonName("sourceArn")),
    SourceRoleArn: S.optional(S.String).pipe(T.JsonName("sourceRoleArn")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({ identifier: "AssetShallow" }) as any as S.Schema<AssetShallow>;
export type __listOfAssetShallow = AssetShallow[];
export const __listOfAssetShallow = S.Array(AssetShallow);
export interface PackagingConfiguration {
  Arn?: string;
  CmafPackage?: CmafPackage;
  CreatedAt?: string;
  DashPackage?: DashPackage;
  HlsPackage?: HlsPackage;
  Id?: string;
  MssPackage?: MssPackage;
  PackagingGroupId?: string;
  Tags?: Tags;
}
export const PackagingConfiguration = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CmafPackage: S.optional(CmafPackage)
      .pipe(T.JsonName("cmafPackage"))
      .annotations({ identifier: "CmafPackage" }),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    DashPackage: S.optional(DashPackage)
      .pipe(T.JsonName("dashPackage"))
      .annotations({ identifier: "DashPackage" }),
    HlsPackage: S.optional(HlsPackage)
      .pipe(T.JsonName("hlsPackage"))
      .annotations({ identifier: "HlsPackage" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    MssPackage: S.optional(MssPackage)
      .pipe(T.JsonName("mssPackage"))
      .annotations({ identifier: "MssPackage" }),
    PackagingGroupId: S.optional(S.String).pipe(T.JsonName("packagingGroupId")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "PackagingConfiguration",
}) as any as S.Schema<PackagingConfiguration>;
export type __listOfPackagingConfiguration = PackagingConfiguration[];
export const __listOfPackagingConfiguration = S.Array(PackagingConfiguration);
export interface PackagingGroup {
  ApproximateAssetCount?: number;
  Arn?: string;
  Authorization?: Authorization;
  CreatedAt?: string;
  DomainName?: string;
  EgressAccessLogs?: EgressAccessLogs;
  Id?: string;
  Tags?: Tags;
}
export const PackagingGroup = S.suspend(() =>
  S.Struct({
    ApproximateAssetCount: S.optional(S.Number).pipe(
      T.JsonName("approximateAssetCount"),
    ),
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Authorization: S.optional(Authorization)
      .pipe(T.JsonName("authorization"))
      .annotations({ identifier: "Authorization" }),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    DomainName: S.optional(S.String).pipe(T.JsonName("domainName")),
    EgressAccessLogs: S.optional(EgressAccessLogs)
      .pipe(T.JsonName("egressAccessLogs"))
      .annotations({ identifier: "EgressAccessLogs" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "PackagingGroup",
}) as any as S.Schema<PackagingGroup>;
export type __listOfPackagingGroup = PackagingGroup[];
export const __listOfPackagingGroup = S.Array(PackagingGroup);
export interface ConfigureLogsResponse {
  Arn?: string;
  Authorization?: Authorization;
  CreatedAt?: string;
  DomainName?: string;
  EgressAccessLogs?: EgressAccessLogs;
  Id?: string;
  Tags?: Tags;
}
export const ConfigureLogsResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Authorization: S.optional(Authorization)
      .pipe(T.JsonName("authorization"))
      .annotations({ identifier: "Authorization" }),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    DomainName: S.optional(S.String).pipe(T.JsonName("domainName")),
    EgressAccessLogs: S.optional(EgressAccessLogs)
      .pipe(T.JsonName("egressAccessLogs"))
      .annotations({ identifier: "EgressAccessLogs" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "ConfigureLogsResponse",
}) as any as S.Schema<ConfigureLogsResponse>;
export interface CreateAssetResponse {
  Arn?: string;
  CreatedAt?: string;
  EgressEndpoints?: __listOfEgressEndpoint;
  Id?: string;
  PackagingGroupId?: string;
  ResourceId?: string;
  SourceArn?: string;
  SourceRoleArn?: string;
  Tags?: Tags;
}
export const CreateAssetResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    EgressEndpoints: S.optional(__listOfEgressEndpoint).pipe(
      T.JsonName("egressEndpoints"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    PackagingGroupId: S.optional(S.String).pipe(T.JsonName("packagingGroupId")),
    ResourceId: S.optional(S.String).pipe(T.JsonName("resourceId")),
    SourceArn: S.optional(S.String).pipe(T.JsonName("sourceArn")),
    SourceRoleArn: S.optional(S.String).pipe(T.JsonName("sourceRoleArn")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "CreateAssetResponse",
}) as any as S.Schema<CreateAssetResponse>;
export interface CreatePackagingGroupResponse {
  Arn?: string;
  Authorization?: Authorization;
  CreatedAt?: string;
  DomainName?: string;
  EgressAccessLogs?: EgressAccessLogs;
  Id?: string;
  Tags?: Tags;
}
export const CreatePackagingGroupResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Authorization: S.optional(Authorization)
      .pipe(T.JsonName("authorization"))
      .annotations({ identifier: "Authorization" }),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    DomainName: S.optional(S.String).pipe(T.JsonName("domainName")),
    EgressAccessLogs: S.optional(EgressAccessLogs)
      .pipe(T.JsonName("egressAccessLogs"))
      .annotations({ identifier: "EgressAccessLogs" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "CreatePackagingGroupResponse",
}) as any as S.Schema<CreatePackagingGroupResponse>;
export interface DescribeAssetResponse {
  Arn?: string;
  CreatedAt?: string;
  EgressEndpoints?: __listOfEgressEndpoint;
  Id?: string;
  PackagingGroupId?: string;
  ResourceId?: string;
  SourceArn?: string;
  SourceRoleArn?: string;
  Tags?: Tags;
}
export const DescribeAssetResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    EgressEndpoints: S.optional(__listOfEgressEndpoint).pipe(
      T.JsonName("egressEndpoints"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    PackagingGroupId: S.optional(S.String).pipe(T.JsonName("packagingGroupId")),
    ResourceId: S.optional(S.String).pipe(T.JsonName("resourceId")),
    SourceArn: S.optional(S.String).pipe(T.JsonName("sourceArn")),
    SourceRoleArn: S.optional(S.String).pipe(T.JsonName("sourceRoleArn")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "DescribeAssetResponse",
}) as any as S.Schema<DescribeAssetResponse>;
export interface ListAssetsResponse {
  Assets?: __listOfAssetShallow;
  NextToken?: string;
}
export const ListAssetsResponse = S.suspend(() =>
  S.Struct({
    Assets: S.optional(__listOfAssetShallow).pipe(T.JsonName("assets")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListAssetsResponse",
}) as any as S.Schema<ListAssetsResponse>;
export interface ListPackagingConfigurationsResponse {
  NextToken?: string;
  PackagingConfigurations?: __listOfPackagingConfiguration;
}
export const ListPackagingConfigurationsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    PackagingConfigurations: S.optional(__listOfPackagingConfiguration).pipe(
      T.JsonName("packagingConfigurations"),
    ),
  }),
).annotations({
  identifier: "ListPackagingConfigurationsResponse",
}) as any as S.Schema<ListPackagingConfigurationsResponse>;
export interface ListPackagingGroupsResponse {
  NextToken?: string;
  PackagingGroups?: __listOfPackagingGroup;
}
export const ListPackagingGroupsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    PackagingGroups: S.optional(__listOfPackagingGroup).pipe(
      T.JsonName("packagingGroups"),
    ),
  }),
).annotations({
  identifier: "ListPackagingGroupsResponse",
}) as any as S.Schema<ListPackagingGroupsResponse>;
export interface CreatePackagingConfigurationRequest {
  CmafPackage?: CmafPackage;
  DashPackage?: DashPackage;
  HlsPackage?: HlsPackage;
  Id: string;
  MssPackage?: MssPackage;
  PackagingGroupId: string;
  Tags?: Tags;
}
export const CreatePackagingConfigurationRequest = S.suspend(() =>
  S.Struct({
    CmafPackage: S.optional(CmafPackage)
      .pipe(T.JsonName("cmafPackage"))
      .annotations({ identifier: "CmafPackage" }),
    DashPackage: S.optional(DashPackage)
      .pipe(T.JsonName("dashPackage"))
      .annotations({ identifier: "DashPackage" }),
    HlsPackage: S.optional(HlsPackage)
      .pipe(T.JsonName("hlsPackage"))
      .annotations({ identifier: "HlsPackage" }),
    Id: S.String.pipe(T.JsonName("id")),
    MssPackage: S.optional(MssPackage)
      .pipe(T.JsonName("mssPackage"))
      .annotations({ identifier: "MssPackage" }),
    PackagingGroupId: S.String.pipe(T.JsonName("packagingGroupId")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/packaging_configurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePackagingConfigurationRequest",
}) as any as S.Schema<CreatePackagingConfigurationRequest>;
export interface CreatePackagingConfigurationResponse {
  Arn?: string;
  CmafPackage?: CmafPackage;
  CreatedAt?: string;
  DashPackage?: DashPackage;
  HlsPackage?: HlsPackage;
  Id?: string;
  MssPackage?: MssPackage;
  PackagingGroupId?: string;
  Tags?: Tags;
}
export const CreatePackagingConfigurationResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CmafPackage: S.optional(CmafPackage)
      .pipe(T.JsonName("cmafPackage"))
      .annotations({ identifier: "CmafPackage" }),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    DashPackage: S.optional(DashPackage)
      .pipe(T.JsonName("dashPackage"))
      .annotations({ identifier: "DashPackage" }),
    HlsPackage: S.optional(HlsPackage)
      .pipe(T.JsonName("hlsPackage"))
      .annotations({ identifier: "HlsPackage" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    MssPackage: S.optional(MssPackage)
      .pipe(T.JsonName("mssPackage"))
      .annotations({ identifier: "MssPackage" }),
    PackagingGroupId: S.optional(S.String).pipe(T.JsonName("packagingGroupId")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "CreatePackagingConfigurationResponse",
}) as any as S.Schema<CreatePackagingConfigurationResponse>;

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
 * Removes tags from the specified resource. You can specify one or more tags to remove.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [],
}));
/**
 * Returns a list of the tags assigned to the specified resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [],
}));
/**
 * Adds tags to the specified resource. You can specify one or more tags to add.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [],
}));
/**
 * Deletes an existing MediaPackage VOD Asset resource.
 */
export const deleteAsset: (
  input: DeleteAssetRequest,
) => Effect.Effect<
  DeleteAssetResponse,
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssetRequest,
  output: DeleteAssetResponse,
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
 * Returns a description of a MediaPackage VOD Asset resource.
 */
export const describeAsset: (
  input: DescribeAssetRequest,
) => Effect.Effect<
  DescribeAssetResponse,
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAssetRequest,
  output: DescribeAssetResponse,
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
 * Returns a collection of MediaPackage VOD Asset resources.
 */
export const listAssets: {
  (
    input: ListAssetsRequest,
  ): Effect.Effect<
    ListAssetsResponse,
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
    input: ListAssetsRequest,
  ) => Stream.Stream<
    ListAssetsResponse,
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
    input: ListAssetsRequest,
  ) => Stream.Stream<
    AssetShallow,
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
  input: ListAssetsRequest,
  output: ListAssetsResponse,
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
    items: "Assets",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a collection of MediaPackage VOD PackagingConfiguration resources.
 */
export const listPackagingConfigurations: {
  (
    input: ListPackagingConfigurationsRequest,
  ): Effect.Effect<
    ListPackagingConfigurationsResponse,
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
    input: ListPackagingConfigurationsRequest,
  ) => Stream.Stream<
    ListPackagingConfigurationsResponse,
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
    input: ListPackagingConfigurationsRequest,
  ) => Stream.Stream<
    PackagingConfiguration,
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
  input: ListPackagingConfigurationsRequest,
  output: ListPackagingConfigurationsResponse,
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
    items: "PackagingConfigurations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a collection of MediaPackage VOD PackagingGroup resources.
 */
export const listPackagingGroups: {
  (
    input: ListPackagingGroupsRequest,
  ): Effect.Effect<
    ListPackagingGroupsResponse,
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
    input: ListPackagingGroupsRequest,
  ) => Stream.Stream<
    ListPackagingGroupsResponse,
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
    input: ListPackagingGroupsRequest,
  ) => Stream.Stream<
    PackagingGroup,
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
  input: ListPackagingGroupsRequest,
  output: ListPackagingGroupsResponse,
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
    items: "PackagingGroups",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a description of a MediaPackage VOD PackagingConfiguration resource.
 */
export const describePackagingConfiguration: (
  input: DescribePackagingConfigurationRequest,
) => Effect.Effect<
  DescribePackagingConfigurationResponse,
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePackagingConfigurationRequest,
  output: DescribePackagingConfigurationResponse,
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
 * Returns a description of a MediaPackage VOD PackagingGroup resource.
 */
export const describePackagingGroup: (
  input: DescribePackagingGroupRequest,
) => Effect.Effect<
  DescribePackagingGroupResponse,
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePackagingGroupRequest,
  output: DescribePackagingGroupResponse,
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
 * Updates a specific packaging group. You can't change the id attribute or any other system-generated attributes.
 */
export const updatePackagingGroup: (
  input: UpdatePackagingGroupRequest,
) => Effect.Effect<
  UpdatePackagingGroupResponse,
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePackagingGroupRequest,
  output: UpdatePackagingGroupResponse,
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
 * Deletes a MediaPackage VOD PackagingConfiguration resource.
 */
export const deletePackagingConfiguration: (
  input: DeletePackagingConfigurationRequest,
) => Effect.Effect<
  DeletePackagingConfigurationResponse,
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePackagingConfigurationRequest,
  output: DeletePackagingConfigurationResponse,
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
 * Deletes a MediaPackage VOD PackagingGroup resource.
 */
export const deletePackagingGroup: (
  input: DeletePackagingGroupRequest,
) => Effect.Effect<
  DeletePackagingGroupResponse,
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePackagingGroupRequest,
  output: DeletePackagingGroupResponse,
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
 * Changes the packaging group's properities to configure log subscription
 */
export const configureLogs: (
  input: ConfigureLogsRequest,
) => Effect.Effect<
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
 * Creates a new MediaPackage VOD Asset resource.
 */
export const createAsset: (
  input: CreateAssetRequest,
) => Effect.Effect<
  CreateAssetResponse,
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssetRequest,
  output: CreateAssetResponse,
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
 * Creates a new MediaPackage VOD PackagingGroup resource.
 */
export const createPackagingGroup: (
  input: CreatePackagingGroupRequest,
) => Effect.Effect<
  CreatePackagingGroupResponse,
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePackagingGroupRequest,
  output: CreatePackagingGroupResponse,
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
 * Creates a new MediaPackage VOD PackagingConfiguration resource.
 */
export const createPackagingConfiguration: (
  input: CreatePackagingConfigurationRequest,
) => Effect.Effect<
  CreatePackagingConfigurationResponse,
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePackagingConfigurationRequest,
  output: CreatePackagingConfigurationResponse,
  errors: [
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
