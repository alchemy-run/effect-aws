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
  sdkId: "MediaTailor",
  serviceShapeName: "MediaTailor",
});
const auth = T.AwsAuthSigv4({ name: "mediatailor" });
const ver = T.ServiceVersion("2018-04-23");
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
              `https://api.mediatailor-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://api.mediatailor-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://api.mediatailor.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://api.mediatailor.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type __integer = number;
export type __string = string;
export type MaxResults = number;
export type __integerMin1 = number;
export type __integerMin1Max100 = number;
export type __long = number;

//# Schemas
export type __listOfLoggingStrategies = string[];
export const __listOfLoggingStrategies = S.Array(S.String);
export type __listOf__string = string[];
export const __listOf__string = S.Array(S.String);
export type Audiences = string[];
export const Audiences = S.Array(S.String);
export type LogTypes = string[];
export const LogTypes = S.Array(S.String);
export interface ListAlertsRequest {
  MaxResults?: number;
  NextToken?: string;
  ResourceArn: string;
}
export const ListAlertsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    ResourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/alerts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAlertsRequest",
}) as any as S.Schema<ListAlertsRequest>;
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
export interface DescribeChannelRequest {
  ChannelName: string;
}
export const DescribeChannelRequest = S.suspend(() =>
  S.Struct({ ChannelName: S.String.pipe(T.HttpLabel("ChannelName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/channel/{ChannelName}" }),
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
export interface SlateSource {
  SourceLocationName?: string;
  VodSourceName?: string;
}
export const SlateSource = S.suspend(() =>
  S.Struct({
    SourceLocationName: S.optional(S.String),
    VodSourceName: S.optional(S.String),
  }),
).annotations({ identifier: "SlateSource" }) as any as S.Schema<SlateSource>;
export interface DashPlaylistSettings {
  ManifestWindowSeconds?: number;
  MinBufferTimeSeconds?: number;
  MinUpdatePeriodSeconds?: number;
  SuggestedPresentationDelaySeconds?: number;
}
export const DashPlaylistSettings = S.suspend(() =>
  S.Struct({
    ManifestWindowSeconds: S.optional(S.Number),
    MinBufferTimeSeconds: S.optional(S.Number),
    MinUpdatePeriodSeconds: S.optional(S.Number),
    SuggestedPresentationDelaySeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "DashPlaylistSettings",
}) as any as S.Schema<DashPlaylistSettings>;
export type adMarkupTypes = string[];
export const adMarkupTypes = S.Array(S.String);
export interface HlsPlaylistSettings {
  ManifestWindowSeconds?: number;
  AdMarkupType?: adMarkupTypes;
}
export const HlsPlaylistSettings = S.suspend(() =>
  S.Struct({
    ManifestWindowSeconds: S.optional(S.Number),
    AdMarkupType: S.optional(adMarkupTypes),
  }),
).annotations({
  identifier: "HlsPlaylistSettings",
}) as any as S.Schema<HlsPlaylistSettings>;
export interface RequestOutputItem {
  DashPlaylistSettings?: DashPlaylistSettings;
  HlsPlaylistSettings?: HlsPlaylistSettings;
  ManifestName: string;
  SourceGroup: string;
}
export const RequestOutputItem = S.suspend(() =>
  S.Struct({
    DashPlaylistSettings: S.optional(DashPlaylistSettings),
    HlsPlaylistSettings: S.optional(HlsPlaylistSettings),
    ManifestName: S.String,
    SourceGroup: S.String,
  }),
).annotations({
  identifier: "RequestOutputItem",
}) as any as S.Schema<RequestOutputItem>;
export type RequestOutputs = RequestOutputItem[];
export const RequestOutputs = S.Array(RequestOutputItem);
export interface TimeShiftConfiguration {
  MaxTimeDelaySeconds: number;
}
export const TimeShiftConfiguration = S.suspend(() =>
  S.Struct({ MaxTimeDelaySeconds: S.Number }),
).annotations({
  identifier: "TimeShiftConfiguration",
}) as any as S.Schema<TimeShiftConfiguration>;
export interface UpdateChannelRequest {
  ChannelName: string;
  FillerSlate?: SlateSource;
  Outputs: RequestOutputs;
  TimeShiftConfiguration?: TimeShiftConfiguration;
  Audiences?: Audiences;
}
export const UpdateChannelRequest = S.suspend(() =>
  S.Struct({
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    FillerSlate: S.optional(SlateSource),
    Outputs: RequestOutputs,
    TimeShiftConfiguration: S.optional(TimeShiftConfiguration),
    Audiences: S.optional(Audiences),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/channel/{ChannelName}" }),
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
  ChannelName: string;
}
export const DeleteChannelRequest = S.suspend(() =>
  S.Struct({ ChannelName: S.String.pipe(T.HttpLabel("ChannelName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/channel/{ChannelName}" }),
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
export interface ConfigureLogsForChannelRequest {
  ChannelName: string;
  LogTypes: LogTypes;
}
export const ConfigureLogsForChannelRequest = S.suspend(() =>
  S.Struct({ ChannelName: S.String, LogTypes: LogTypes }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/configureLogs/channel" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ConfigureLogsForChannelRequest",
}) as any as S.Schema<ConfigureLogsForChannelRequest>;
export interface GetChannelScheduleRequest {
  ChannelName: string;
  DurationMinutes?: string;
  MaxResults?: number;
  NextToken?: string;
  Audience?: string;
}
export const GetChannelScheduleRequest = S.suspend(() =>
  S.Struct({
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    DurationMinutes: S.optional(S.String).pipe(T.HttpQuery("durationMinutes")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Audience: S.optional(S.String).pipe(T.HttpQuery("audience")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/channel/{ChannelName}/schedule" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetChannelScheduleRequest",
}) as any as S.Schema<GetChannelScheduleRequest>;
export interface StartChannelRequest {
  ChannelName: string;
}
export const StartChannelRequest = S.suspend(() =>
  S.Struct({ ChannelName: S.String.pipe(T.HttpLabel("ChannelName")) }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/channel/{ChannelName}/start" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartChannelRequest",
}) as any as S.Schema<StartChannelRequest>;
export interface StartChannelResponse {}
export const StartChannelResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "StartChannelResponse",
}) as any as S.Schema<StartChannelResponse>;
export interface StopChannelRequest {
  ChannelName: string;
}
export const StopChannelRequest = S.suspend(() =>
  S.Struct({ ChannelName: S.String.pipe(T.HttpLabel("ChannelName")) }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/channel/{ChannelName}/stop" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopChannelRequest",
}) as any as S.Schema<StopChannelRequest>;
export interface StopChannelResponse {}
export const StopChannelResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "StopChannelResponse",
}) as any as S.Schema<StopChannelResponse>;
export interface PutChannelPolicyRequest {
  ChannelName: string;
  Policy: string;
}
export const PutChannelPolicyRequest = S.suspend(() =>
  S.Struct({
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    Policy: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/channel/{ChannelName}/policy" }),
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
  ChannelName: string;
}
export const GetChannelPolicyRequest = S.suspend(() =>
  S.Struct({ ChannelName: S.String.pipe(T.HttpLabel("ChannelName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/channel/{ChannelName}/policy" }),
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
  ChannelName: string;
}
export const DeleteChannelPolicyRequest = S.suspend(() =>
  S.Struct({ ChannelName: S.String.pipe(T.HttpLabel("ChannelName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/channel/{ChannelName}/policy" }),
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
export interface DescribeProgramRequest {
  ChannelName: string;
  ProgramName: string;
}
export const DescribeProgramRequest = S.suspend(() =>
  S.Struct({
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    ProgramName: S.String.pipe(T.HttpLabel("ProgramName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/channel/{ChannelName}/program/{ProgramName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeProgramRequest",
}) as any as S.Schema<DescribeProgramRequest>;
export interface DeleteProgramRequest {
  ChannelName: string;
  ProgramName: string;
}
export const DeleteProgramRequest = S.suspend(() =>
  S.Struct({
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    ProgramName: S.String.pipe(T.HttpLabel("ProgramName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/channel/{ChannelName}/program/{ProgramName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProgramRequest",
}) as any as S.Schema<DeleteProgramRequest>;
export interface DeleteProgramResponse {}
export const DeleteProgramResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteProgramResponse",
}) as any as S.Schema<DeleteProgramResponse>;
export interface DescribeLiveSourceRequest {
  LiveSourceName: string;
  SourceLocationName: string;
}
export const DescribeLiveSourceRequest = S.suspend(() =>
  S.Struct({
    LiveSourceName: S.String.pipe(T.HttpLabel("LiveSourceName")),
    SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/sourceLocation/{SourceLocationName}/liveSource/{LiveSourceName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeLiveSourceRequest",
}) as any as S.Schema<DescribeLiveSourceRequest>;
export interface HttpPackageConfiguration {
  Path: string;
  SourceGroup: string;
  Type: string;
}
export const HttpPackageConfiguration = S.suspend(() =>
  S.Struct({ Path: S.String, SourceGroup: S.String, Type: S.String }),
).annotations({
  identifier: "HttpPackageConfiguration",
}) as any as S.Schema<HttpPackageConfiguration>;
export type HttpPackageConfigurations = HttpPackageConfiguration[];
export const HttpPackageConfigurations = S.Array(HttpPackageConfiguration);
export interface UpdateLiveSourceRequest {
  HttpPackageConfigurations: HttpPackageConfigurations;
  LiveSourceName: string;
  SourceLocationName: string;
}
export const UpdateLiveSourceRequest = S.suspend(() =>
  S.Struct({
    HttpPackageConfigurations: HttpPackageConfigurations,
    LiveSourceName: S.String.pipe(T.HttpLabel("LiveSourceName")),
    SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/sourceLocation/{SourceLocationName}/liveSource/{LiveSourceName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateLiveSourceRequest",
}) as any as S.Schema<UpdateLiveSourceRequest>;
export interface DeleteLiveSourceRequest {
  LiveSourceName: string;
  SourceLocationName: string;
}
export const DeleteLiveSourceRequest = S.suspend(() =>
  S.Struct({
    LiveSourceName: S.String.pipe(T.HttpLabel("LiveSourceName")),
    SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/sourceLocation/{SourceLocationName}/liveSource/{LiveSourceName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLiveSourceRequest",
}) as any as S.Schema<DeleteLiveSourceRequest>;
export interface DeleteLiveSourceResponse {}
export const DeleteLiveSourceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteLiveSourceResponse",
}) as any as S.Schema<DeleteLiveSourceResponse>;
export interface ListLiveSourcesRequest {
  MaxResults?: number;
  NextToken?: string;
  SourceLocationName: string;
}
export const ListLiveSourcesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/sourceLocation/{SourceLocationName}/liveSources",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLiveSourcesRequest",
}) as any as S.Schema<ListLiveSourcesRequest>;
export interface GetPlaybackConfigurationRequest {
  Name: string;
}
export const GetPlaybackConfigurationRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/playbackConfiguration/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPlaybackConfigurationRequest",
}) as any as S.Schema<GetPlaybackConfigurationRequest>;
export interface DeletePlaybackConfigurationRequest {
  Name: string;
}
export const DeletePlaybackConfigurationRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/playbackConfiguration/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePlaybackConfigurationRequest",
}) as any as S.Schema<DeletePlaybackConfigurationRequest>;
export interface DeletePlaybackConfigurationResponse {}
export const DeletePlaybackConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePlaybackConfigurationResponse",
}) as any as S.Schema<DeletePlaybackConfigurationResponse>;
export interface ListPlaybackConfigurationsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListPlaybackConfigurationsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/playbackConfigurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPlaybackConfigurationsRequest",
}) as any as S.Schema<ListPlaybackConfigurationsRequest>;
export interface GetPrefetchScheduleRequest {
  Name: string;
  PlaybackConfigurationName: string;
}
export const GetPrefetchScheduleRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    PlaybackConfigurationName: S.String.pipe(
      T.HttpLabel("PlaybackConfigurationName"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/prefetchSchedule/{PlaybackConfigurationName}/{Name}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPrefetchScheduleRequest",
}) as any as S.Schema<GetPrefetchScheduleRequest>;
export interface DeletePrefetchScheduleRequest {
  Name: string;
  PlaybackConfigurationName: string;
}
export const DeletePrefetchScheduleRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    PlaybackConfigurationName: S.String.pipe(
      T.HttpLabel("PlaybackConfigurationName"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/prefetchSchedule/{PlaybackConfigurationName}/{Name}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePrefetchScheduleRequest",
}) as any as S.Schema<DeletePrefetchScheduleRequest>;
export interface DeletePrefetchScheduleResponse {}
export const DeletePrefetchScheduleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePrefetchScheduleResponse",
}) as any as S.Schema<DeletePrefetchScheduleResponse>;
export interface ListPrefetchSchedulesRequest {
  MaxResults?: number;
  NextToken?: string;
  PlaybackConfigurationName: string;
  ScheduleType?: string;
  StreamId?: string;
}
export const ListPrefetchSchedulesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    PlaybackConfigurationName: S.String.pipe(
      T.HttpLabel("PlaybackConfigurationName"),
    ),
    ScheduleType: S.optional(S.String),
    StreamId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/prefetchSchedule/{PlaybackConfigurationName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPrefetchSchedulesRequest",
}) as any as S.Schema<ListPrefetchSchedulesRequest>;
export interface DescribeSourceLocationRequest {
  SourceLocationName: string;
}
export const DescribeSourceLocationRequest = S.suspend(() =>
  S.Struct({
    SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/sourceLocation/{SourceLocationName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSourceLocationRequest",
}) as any as S.Schema<DescribeSourceLocationRequest>;
export interface SecretsManagerAccessTokenConfiguration {
  HeaderName?: string;
  SecretArn?: string;
  SecretStringKey?: string;
}
export const SecretsManagerAccessTokenConfiguration = S.suspend(() =>
  S.Struct({
    HeaderName: S.optional(S.String),
    SecretArn: S.optional(S.String),
    SecretStringKey: S.optional(S.String),
  }),
).annotations({
  identifier: "SecretsManagerAccessTokenConfiguration",
}) as any as S.Schema<SecretsManagerAccessTokenConfiguration>;
export interface AccessConfiguration {
  AccessType?: string;
  SecretsManagerAccessTokenConfiguration?: SecretsManagerAccessTokenConfiguration;
}
export const AccessConfiguration = S.suspend(() =>
  S.Struct({
    AccessType: S.optional(S.String),
    SecretsManagerAccessTokenConfiguration: S.optional(
      SecretsManagerAccessTokenConfiguration,
    ),
  }),
).annotations({
  identifier: "AccessConfiguration",
}) as any as S.Schema<AccessConfiguration>;
export interface DefaultSegmentDeliveryConfiguration {
  BaseUrl?: string;
}
export const DefaultSegmentDeliveryConfiguration = S.suspend(() =>
  S.Struct({ BaseUrl: S.optional(S.String) }),
).annotations({
  identifier: "DefaultSegmentDeliveryConfiguration",
}) as any as S.Schema<DefaultSegmentDeliveryConfiguration>;
export interface HttpConfiguration {
  BaseUrl: string;
}
export const HttpConfiguration = S.suspend(() =>
  S.Struct({ BaseUrl: S.String }),
).annotations({
  identifier: "HttpConfiguration",
}) as any as S.Schema<HttpConfiguration>;
export interface SegmentDeliveryConfiguration {
  BaseUrl?: string;
  Name?: string;
}
export const SegmentDeliveryConfiguration = S.suspend(() =>
  S.Struct({ BaseUrl: S.optional(S.String), Name: S.optional(S.String) }),
).annotations({
  identifier: "SegmentDeliveryConfiguration",
}) as any as S.Schema<SegmentDeliveryConfiguration>;
export type __listOfSegmentDeliveryConfiguration =
  SegmentDeliveryConfiguration[];
export const __listOfSegmentDeliveryConfiguration = S.Array(
  SegmentDeliveryConfiguration,
);
export interface UpdateSourceLocationRequest {
  AccessConfiguration?: AccessConfiguration;
  DefaultSegmentDeliveryConfiguration?: DefaultSegmentDeliveryConfiguration;
  HttpConfiguration: HttpConfiguration;
  SegmentDeliveryConfigurations?: __listOfSegmentDeliveryConfiguration;
  SourceLocationName: string;
}
export const UpdateSourceLocationRequest = S.suspend(() =>
  S.Struct({
    AccessConfiguration: S.optional(AccessConfiguration),
    DefaultSegmentDeliveryConfiguration: S.optional(
      DefaultSegmentDeliveryConfiguration,
    ),
    HttpConfiguration: HttpConfiguration,
    SegmentDeliveryConfigurations: S.optional(
      __listOfSegmentDeliveryConfiguration,
    ),
    SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/sourceLocation/{SourceLocationName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSourceLocationRequest",
}) as any as S.Schema<UpdateSourceLocationRequest>;
export interface DeleteSourceLocationRequest {
  SourceLocationName: string;
}
export const DeleteSourceLocationRequest = S.suspend(() =>
  S.Struct({
    SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/sourceLocation/{SourceLocationName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSourceLocationRequest",
}) as any as S.Schema<DeleteSourceLocationRequest>;
export interface DeleteSourceLocationResponse {}
export const DeleteSourceLocationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSourceLocationResponse",
}) as any as S.Schema<DeleteSourceLocationResponse>;
export interface ListSourceLocationsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListSourceLocationsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/sourceLocations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSourceLocationsRequest",
}) as any as S.Schema<ListSourceLocationsRequest>;
export type __mapOf__string = { [key: string]: string };
export const __mapOf__string = S.Record({ key: S.String, value: S.String });
export interface CreateVodSourceRequest {
  HttpPackageConfigurations: HttpPackageConfigurations;
  SourceLocationName: string;
  Tags?: __mapOf__string;
  VodSourceName: string;
}
export const CreateVodSourceRequest = S.suspend(() =>
  S.Struct({
    HttpPackageConfigurations: HttpPackageConfigurations,
    SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    VodSourceName: S.String.pipe(T.HttpLabel("VodSourceName")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/sourceLocation/{SourceLocationName}/vodSource/{VodSourceName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateVodSourceRequest",
}) as any as S.Schema<CreateVodSourceRequest>;
export interface DescribeVodSourceRequest {
  SourceLocationName: string;
  VodSourceName: string;
}
export const DescribeVodSourceRequest = S.suspend(() =>
  S.Struct({
    SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")),
    VodSourceName: S.String.pipe(T.HttpLabel("VodSourceName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/sourceLocation/{SourceLocationName}/vodSource/{VodSourceName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeVodSourceRequest",
}) as any as S.Schema<DescribeVodSourceRequest>;
export interface UpdateVodSourceRequest {
  HttpPackageConfigurations: HttpPackageConfigurations;
  SourceLocationName: string;
  VodSourceName: string;
}
export const UpdateVodSourceRequest = S.suspend(() =>
  S.Struct({
    HttpPackageConfigurations: HttpPackageConfigurations,
    SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")),
    VodSourceName: S.String.pipe(T.HttpLabel("VodSourceName")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/sourceLocation/{SourceLocationName}/vodSource/{VodSourceName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateVodSourceRequest",
}) as any as S.Schema<UpdateVodSourceRequest>;
export interface DeleteVodSourceRequest {
  SourceLocationName: string;
  VodSourceName: string;
}
export const DeleteVodSourceRequest = S.suspend(() =>
  S.Struct({
    SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")),
    VodSourceName: S.String.pipe(T.HttpLabel("VodSourceName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/sourceLocation/{SourceLocationName}/vodSource/{VodSourceName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteVodSourceRequest",
}) as any as S.Schema<DeleteVodSourceRequest>;
export interface DeleteVodSourceResponse {}
export const DeleteVodSourceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteVodSourceResponse",
}) as any as S.Schema<DeleteVodSourceResponse>;
export interface ListVodSourcesRequest {
  MaxResults?: number;
  NextToken?: string;
  SourceLocationName: string;
}
export const ListVodSourcesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/sourceLocation/{SourceLocationName}/vodSources",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVodSourcesRequest",
}) as any as S.Schema<ListVodSourcesRequest>;
export type __adsInteractionPublishOptInEventTypesList = string[];
export const __adsInteractionPublishOptInEventTypesList = S.Array(S.String);
export type __adsInteractionExcludeEventTypesList = string[];
export const __adsInteractionExcludeEventTypesList = S.Array(S.String);
export type __manifestServiceExcludeEventTypesList = string[];
export const __manifestServiceExcludeEventTypesList = S.Array(S.String);
export interface AdsInteractionLog {
  PublishOptInEventTypes?: __adsInteractionPublishOptInEventTypesList;
  ExcludeEventTypes?: __adsInteractionExcludeEventTypesList;
}
export const AdsInteractionLog = S.suspend(() =>
  S.Struct({
    PublishOptInEventTypes: S.optional(
      __adsInteractionPublishOptInEventTypesList,
    ),
    ExcludeEventTypes: S.optional(__adsInteractionExcludeEventTypesList),
  }),
).annotations({
  identifier: "AdsInteractionLog",
}) as any as S.Schema<AdsInteractionLog>;
export interface ManifestServiceInteractionLog {
  ExcludeEventTypes?: __manifestServiceExcludeEventTypesList;
}
export const ManifestServiceInteractionLog = S.suspend(() =>
  S.Struct({
    ExcludeEventTypes: S.optional(__manifestServiceExcludeEventTypesList),
  }),
).annotations({
  identifier: "ManifestServiceInteractionLog",
}) as any as S.Schema<ManifestServiceInteractionLog>;
export interface AvailSuppression {
  Mode?: string;
  Value?: string;
  FillPolicy?: string;
}
export const AvailSuppression = S.suspend(() =>
  S.Struct({
    Mode: S.optional(S.String),
    Value: S.optional(S.String),
    FillPolicy: S.optional(S.String),
  }),
).annotations({
  identifier: "AvailSuppression",
}) as any as S.Schema<AvailSuppression>;
export interface Bumper {
  EndUrl?: string;
  StartUrl?: string;
}
export const Bumper = S.suspend(() =>
  S.Struct({ EndUrl: S.optional(S.String), StartUrl: S.optional(S.String) }),
).annotations({ identifier: "Bumper" }) as any as S.Schema<Bumper>;
export interface CdnConfiguration {
  AdSegmentUrlPrefix?: string;
  ContentSegmentUrlPrefix?: string;
}
export const CdnConfiguration = S.suspend(() =>
  S.Struct({
    AdSegmentUrlPrefix: S.optional(S.String),
    ContentSegmentUrlPrefix: S.optional(S.String),
  }),
).annotations({
  identifier: "CdnConfiguration",
}) as any as S.Schema<CdnConfiguration>;
export type ConfigurationAliasesRequest = { [key: string]: __mapOf__string };
export const ConfigurationAliasesRequest = S.Record({
  key: S.String,
  value: __mapOf__string,
});
export interface DashConfigurationForPut {
  MpdLocation?: string;
  OriginManifestType?: string;
}
export const DashConfigurationForPut = S.suspend(() =>
  S.Struct({
    MpdLocation: S.optional(S.String),
    OriginManifestType: S.optional(S.String),
  }),
).annotations({
  identifier: "DashConfigurationForPut",
}) as any as S.Schema<DashConfigurationForPut>;
export interface LivePreRollConfiguration {
  AdDecisionServerUrl?: string;
  MaxDurationSeconds?: number;
}
export const LivePreRollConfiguration = S.suspend(() =>
  S.Struct({
    AdDecisionServerUrl: S.optional(S.String),
    MaxDurationSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "LivePreRollConfiguration",
}) as any as S.Schema<LivePreRollConfiguration>;
export interface AdConditioningConfiguration {
  StreamingMediaFileConditioning: string;
}
export const AdConditioningConfiguration = S.suspend(() =>
  S.Struct({ StreamingMediaFileConditioning: S.String }),
).annotations({
  identifier: "AdConditioningConfiguration",
}) as any as S.Schema<AdConditioningConfiguration>;
export interface ConfigureLogsForPlaybackConfigurationRequest {
  PercentEnabled: number;
  PlaybackConfigurationName: string;
  EnabledLoggingStrategies?: __listOfLoggingStrategies;
  AdsInteractionLog?: AdsInteractionLog;
  ManifestServiceInteractionLog?: ManifestServiceInteractionLog;
}
export const ConfigureLogsForPlaybackConfigurationRequest = S.suspend(() =>
  S.Struct({
    PercentEnabled: S.Number,
    PlaybackConfigurationName: S.String,
    EnabledLoggingStrategies: S.optional(__listOfLoggingStrategies),
    AdsInteractionLog: S.optional(AdsInteractionLog),
    ManifestServiceInteractionLog: S.optional(ManifestServiceInteractionLog),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/configureLogs/playbackConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ConfigureLogsForPlaybackConfigurationRequest",
}) as any as S.Schema<ConfigureLogsForPlaybackConfigurationRequest>;
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
export interface ResponseOutputItem {
  DashPlaylistSettings?: DashPlaylistSettings;
  HlsPlaylistSettings?: HlsPlaylistSettings;
  ManifestName: string;
  PlaybackUrl: string;
  SourceGroup: string;
}
export const ResponseOutputItem = S.suspend(() =>
  S.Struct({
    DashPlaylistSettings: S.optional(DashPlaylistSettings),
    HlsPlaylistSettings: S.optional(HlsPlaylistSettings),
    ManifestName: S.String,
    PlaybackUrl: S.String,
    SourceGroup: S.String,
  }),
).annotations({
  identifier: "ResponseOutputItem",
}) as any as S.Schema<ResponseOutputItem>;
export type ResponseOutputs = ResponseOutputItem[];
export const ResponseOutputs = S.Array(ResponseOutputItem);
export interface UpdateChannelResponse {
  Arn?: string;
  ChannelName?: string;
  ChannelState?: string;
  CreationTime?: Date;
  FillerSlate?: SlateSource;
  LastModifiedTime?: Date;
  Outputs?: ResponseOutputs;
  PlaybackMode?: string;
  Tags?: __mapOf__string;
  Tier?: string;
  TimeShiftConfiguration?: TimeShiftConfiguration;
  Audiences?: Audiences;
}
export const UpdateChannelResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    ChannelName: S.optional(S.String),
    ChannelState: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FillerSlate: S.optional(SlateSource),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Outputs: S.optional(ResponseOutputs),
    PlaybackMode: S.optional(S.String),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    Tier: S.optional(S.String),
    TimeShiftConfiguration: S.optional(TimeShiftConfiguration),
    Audiences: S.optional(Audiences),
  }),
).annotations({
  identifier: "UpdateChannelResponse",
}) as any as S.Schema<UpdateChannelResponse>;
export interface ConfigureLogsForChannelResponse {
  ChannelName?: string;
  LogTypes?: LogTypes;
}
export const ConfigureLogsForChannelResponse = S.suspend(() =>
  S.Struct({
    ChannelName: S.optional(S.String),
    LogTypes: S.optional(LogTypes),
  }),
).annotations({
  identifier: "ConfigureLogsForChannelResponse",
}) as any as S.Schema<ConfigureLogsForChannelResponse>;
export interface GetChannelPolicyResponse {
  Policy?: string;
}
export const GetChannelPolicyResponse = S.suspend(() =>
  S.Struct({ Policy: S.optional(S.String) }),
).annotations({
  identifier: "GetChannelPolicyResponse",
}) as any as S.Schema<GetChannelPolicyResponse>;
export interface SpliceInsertMessage {
  AvailNum?: number;
  AvailsExpected?: number;
  SpliceEventId?: number;
  UniqueProgramId?: number;
}
export const SpliceInsertMessage = S.suspend(() =>
  S.Struct({
    AvailNum: S.optional(S.Number),
    AvailsExpected: S.optional(S.Number),
    SpliceEventId: S.optional(S.Number),
    UniqueProgramId: S.optional(S.Number),
  }),
).annotations({
  identifier: "SpliceInsertMessage",
}) as any as S.Schema<SpliceInsertMessage>;
export interface SegmentationDescriptor {
  SegmentationEventId?: number;
  SegmentationUpidType?: number;
  SegmentationUpid?: string;
  SegmentationTypeId?: number;
  SegmentNum?: number;
  SegmentsExpected?: number;
  SubSegmentNum?: number;
  SubSegmentsExpected?: number;
}
export const SegmentationDescriptor = S.suspend(() =>
  S.Struct({
    SegmentationEventId: S.optional(S.Number),
    SegmentationUpidType: S.optional(S.Number),
    SegmentationUpid: S.optional(S.String),
    SegmentationTypeId: S.optional(S.Number),
    SegmentNum: S.optional(S.Number),
    SegmentsExpected: S.optional(S.Number),
    SubSegmentNum: S.optional(S.Number),
    SubSegmentsExpected: S.optional(S.Number),
  }),
).annotations({
  identifier: "SegmentationDescriptor",
}) as any as S.Schema<SegmentationDescriptor>;
export type SegmentationDescriptorList = SegmentationDescriptor[];
export const SegmentationDescriptorList = S.Array(SegmentationDescriptor);
export interface TimeSignalMessage {
  SegmentationDescriptors?: SegmentationDescriptorList;
}
export const TimeSignalMessage = S.suspend(() =>
  S.Struct({ SegmentationDescriptors: S.optional(SegmentationDescriptorList) }),
).annotations({
  identifier: "TimeSignalMessage",
}) as any as S.Schema<TimeSignalMessage>;
export interface KeyValuePair {
  Key: string;
  Value: string;
}
export const KeyValuePair = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "KeyValuePair" }) as any as S.Schema<KeyValuePair>;
export type AdBreakMetadataList = KeyValuePair[];
export const AdBreakMetadataList = S.Array(KeyValuePair);
export interface AdBreak {
  MessageType?: string;
  OffsetMillis: number;
  Slate?: SlateSource;
  SpliceInsertMessage?: SpliceInsertMessage;
  TimeSignalMessage?: TimeSignalMessage;
  AdBreakMetadata?: AdBreakMetadataList;
}
export const AdBreak = S.suspend(() =>
  S.Struct({
    MessageType: S.optional(S.String),
    OffsetMillis: S.Number,
    Slate: S.optional(SlateSource),
    SpliceInsertMessage: S.optional(SpliceInsertMessage),
    TimeSignalMessage: S.optional(TimeSignalMessage),
    AdBreakMetadata: S.optional(AdBreakMetadataList),
  }),
).annotations({ identifier: "AdBreak" }) as any as S.Schema<AdBreak>;
export type __listOfAdBreak = AdBreak[];
export const __listOfAdBreak = S.Array(AdBreak);
export interface ClipRange {
  EndOffsetMillis?: number;
  StartOffsetMillis?: number;
}
export const ClipRange = S.suspend(() =>
  S.Struct({
    EndOffsetMillis: S.optional(S.Number),
    StartOffsetMillis: S.optional(S.Number),
  }),
).annotations({ identifier: "ClipRange" }) as any as S.Schema<ClipRange>;
export interface AlternateMedia {
  SourceLocationName?: string;
  LiveSourceName?: string;
  VodSourceName?: string;
  ClipRange?: ClipRange;
  ScheduledStartTimeMillis?: number;
  AdBreaks?: __listOfAdBreak;
  DurationMillis?: number;
}
export const AlternateMedia = S.suspend(() =>
  S.Struct({
    SourceLocationName: S.optional(S.String),
    LiveSourceName: S.optional(S.String),
    VodSourceName: S.optional(S.String),
    ClipRange: S.optional(ClipRange),
    ScheduledStartTimeMillis: S.optional(S.Number),
    AdBreaks: S.optional(__listOfAdBreak),
    DurationMillis: S.optional(S.Number),
  }),
).annotations({
  identifier: "AlternateMedia",
}) as any as S.Schema<AlternateMedia>;
export type __listOfAlternateMedia = AlternateMedia[];
export const __listOfAlternateMedia = S.Array(AlternateMedia);
export interface AudienceMedia {
  Audience?: string;
  AlternateMedia?: __listOfAlternateMedia;
}
export const AudienceMedia = S.suspend(() =>
  S.Struct({
    Audience: S.optional(S.String),
    AlternateMedia: S.optional(__listOfAlternateMedia),
  }),
).annotations({
  identifier: "AudienceMedia",
}) as any as S.Schema<AudienceMedia>;
export type __listOfAudienceMedia = AudienceMedia[];
export const __listOfAudienceMedia = S.Array(AudienceMedia);
export interface DescribeProgramResponse {
  AdBreaks?: __listOfAdBreak;
  Arn?: string;
  ChannelName?: string;
  CreationTime?: Date;
  LiveSourceName?: string;
  ProgramName?: string;
  ScheduledStartTime?: Date;
  SourceLocationName?: string;
  VodSourceName?: string;
  ClipRange?: ClipRange;
  DurationMillis?: number;
  AudienceMedia?: __listOfAudienceMedia;
}
export const DescribeProgramResponse = S.suspend(() =>
  S.Struct({
    AdBreaks: S.optional(__listOfAdBreak),
    Arn: S.optional(S.String),
    ChannelName: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LiveSourceName: S.optional(S.String),
    ProgramName: S.optional(S.String),
    ScheduledStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SourceLocationName: S.optional(S.String),
    VodSourceName: S.optional(S.String),
    ClipRange: S.optional(ClipRange),
    DurationMillis: S.optional(S.Number),
    AudienceMedia: S.optional(__listOfAudienceMedia),
  }),
).annotations({
  identifier: "DescribeProgramResponse",
}) as any as S.Schema<DescribeProgramResponse>;
export interface CreateLiveSourceRequest {
  HttpPackageConfigurations: HttpPackageConfigurations;
  LiveSourceName: string;
  SourceLocationName: string;
  Tags?: __mapOf__string;
}
export const CreateLiveSourceRequest = S.suspend(() =>
  S.Struct({
    HttpPackageConfigurations: HttpPackageConfigurations,
    LiveSourceName: S.String.pipe(T.HttpLabel("LiveSourceName")),
    SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/sourceLocation/{SourceLocationName}/liveSource/{LiveSourceName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLiveSourceRequest",
}) as any as S.Schema<CreateLiveSourceRequest>;
export interface DescribeLiveSourceResponse {
  Arn?: string;
  CreationTime?: Date;
  HttpPackageConfigurations?: HttpPackageConfigurations;
  LastModifiedTime?: Date;
  LiveSourceName?: string;
  SourceLocationName?: string;
  Tags?: __mapOf__string;
}
export const DescribeLiveSourceResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    HttpPackageConfigurations: S.optional(HttpPackageConfigurations),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LiveSourceName: S.optional(S.String),
    SourceLocationName: S.optional(S.String),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "DescribeLiveSourceResponse",
}) as any as S.Schema<DescribeLiveSourceResponse>;
export interface UpdateLiveSourceResponse {
  Arn?: string;
  CreationTime?: Date;
  HttpPackageConfigurations?: HttpPackageConfigurations;
  LastModifiedTime?: Date;
  LiveSourceName?: string;
  SourceLocationName?: string;
  Tags?: __mapOf__string;
}
export const UpdateLiveSourceResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    HttpPackageConfigurations: S.optional(HttpPackageConfigurations),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LiveSourceName: S.optional(S.String),
    SourceLocationName: S.optional(S.String),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "UpdateLiveSourceResponse",
}) as any as S.Schema<UpdateLiveSourceResponse>;
export interface AvailMatchingCriteria {
  DynamicVariable: string;
  Operator: string;
}
export const AvailMatchingCriteria = S.suspend(() =>
  S.Struct({ DynamicVariable: S.String, Operator: S.String }),
).annotations({
  identifier: "AvailMatchingCriteria",
}) as any as S.Schema<AvailMatchingCriteria>;
export type __listOfAvailMatchingCriteria = AvailMatchingCriteria[];
export const __listOfAvailMatchingCriteria = S.Array(AvailMatchingCriteria);
export interface PrefetchConsumption {
  AvailMatchingCriteria?: __listOfAvailMatchingCriteria;
  EndTime: Date;
  StartTime?: Date;
}
export const PrefetchConsumption = S.suspend(() =>
  S.Struct({
    AvailMatchingCriteria: S.optional(__listOfAvailMatchingCriteria),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "PrefetchConsumption",
}) as any as S.Schema<PrefetchConsumption>;
export interface TrafficShapingRetrievalWindow {
  RetrievalWindowDurationSeconds?: number;
}
export const TrafficShapingRetrievalWindow = S.suspend(() =>
  S.Struct({ RetrievalWindowDurationSeconds: S.optional(S.Number) }),
).annotations({
  identifier: "TrafficShapingRetrievalWindow",
}) as any as S.Schema<TrafficShapingRetrievalWindow>;
export interface TrafficShapingTpsConfiguration {
  PeakTps?: number;
  PeakConcurrentUsers?: number;
}
export const TrafficShapingTpsConfiguration = S.suspend(() =>
  S.Struct({
    PeakTps: S.optional(S.Number),
    PeakConcurrentUsers: S.optional(S.Number),
  }),
).annotations({
  identifier: "TrafficShapingTpsConfiguration",
}) as any as S.Schema<TrafficShapingTpsConfiguration>;
export interface PrefetchRetrieval {
  DynamicVariables?: __mapOf__string;
  EndTime: Date;
  StartTime?: Date;
  TrafficShapingType?: string;
  TrafficShapingRetrievalWindow?: TrafficShapingRetrievalWindow;
  TrafficShapingTpsConfiguration?: TrafficShapingTpsConfiguration;
}
export const PrefetchRetrieval = S.suspend(() =>
  S.Struct({
    DynamicVariables: S.optional(__mapOf__string),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    TrafficShapingType: S.optional(S.String),
    TrafficShapingRetrievalWindow: S.optional(TrafficShapingRetrievalWindow),
    TrafficShapingTpsConfiguration: S.optional(TrafficShapingTpsConfiguration),
  }),
).annotations({
  identifier: "PrefetchRetrieval",
}) as any as S.Schema<PrefetchRetrieval>;
export interface RecurringConsumption {
  RetrievedAdExpirationSeconds?: number;
  AvailMatchingCriteria?: __listOfAvailMatchingCriteria;
}
export const RecurringConsumption = S.suspend(() =>
  S.Struct({
    RetrievedAdExpirationSeconds: S.optional(S.Number),
    AvailMatchingCriteria: S.optional(__listOfAvailMatchingCriteria),
  }),
).annotations({
  identifier: "RecurringConsumption",
}) as any as S.Schema<RecurringConsumption>;
export interface RecurringRetrieval {
  DynamicVariables?: __mapOf__string;
  DelayAfterAvailEndSeconds?: number;
  TrafficShapingType?: string;
  TrafficShapingRetrievalWindow?: TrafficShapingRetrievalWindow;
  TrafficShapingTpsConfiguration?: TrafficShapingTpsConfiguration;
}
export const RecurringRetrieval = S.suspend(() =>
  S.Struct({
    DynamicVariables: S.optional(__mapOf__string),
    DelayAfterAvailEndSeconds: S.optional(S.Number),
    TrafficShapingType: S.optional(S.String),
    TrafficShapingRetrievalWindow: S.optional(TrafficShapingRetrievalWindow),
    TrafficShapingTpsConfiguration: S.optional(TrafficShapingTpsConfiguration),
  }),
).annotations({
  identifier: "RecurringRetrieval",
}) as any as S.Schema<RecurringRetrieval>;
export interface RecurringPrefetchConfiguration {
  StartTime?: Date;
  EndTime: Date;
  RecurringConsumption: RecurringConsumption;
  RecurringRetrieval: RecurringRetrieval;
}
export const RecurringPrefetchConfiguration = S.suspend(() =>
  S.Struct({
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    RecurringConsumption: RecurringConsumption,
    RecurringRetrieval: RecurringRetrieval,
  }),
).annotations({
  identifier: "RecurringPrefetchConfiguration",
}) as any as S.Schema<RecurringPrefetchConfiguration>;
export interface GetPrefetchScheduleResponse {
  Arn?: string;
  Consumption?: PrefetchConsumption;
  Name?: string;
  PlaybackConfigurationName?: string;
  Retrieval?: PrefetchRetrieval;
  ScheduleType?: string;
  RecurringPrefetchConfiguration?: RecurringPrefetchConfiguration;
  StreamId?: string;
}
export const GetPrefetchScheduleResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Consumption: S.optional(PrefetchConsumption),
    Name: S.optional(S.String),
    PlaybackConfigurationName: S.optional(S.String),
    Retrieval: S.optional(PrefetchRetrieval),
    ScheduleType: S.optional(S.String),
    RecurringPrefetchConfiguration: S.optional(RecurringPrefetchConfiguration),
    StreamId: S.optional(S.String),
  }),
).annotations({
  identifier: "GetPrefetchScheduleResponse",
}) as any as S.Schema<GetPrefetchScheduleResponse>;
export interface DescribeSourceLocationResponse {
  AccessConfiguration?: AccessConfiguration;
  Arn?: string;
  CreationTime?: Date;
  DefaultSegmentDeliveryConfiguration?: DefaultSegmentDeliveryConfiguration;
  HttpConfiguration?: HttpConfiguration;
  LastModifiedTime?: Date;
  SegmentDeliveryConfigurations?: __listOfSegmentDeliveryConfiguration;
  SourceLocationName?: string;
  Tags?: __mapOf__string;
}
export const DescribeSourceLocationResponse = S.suspend(() =>
  S.Struct({
    AccessConfiguration: S.optional(AccessConfiguration),
    Arn: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DefaultSegmentDeliveryConfiguration: S.optional(
      DefaultSegmentDeliveryConfiguration,
    ),
    HttpConfiguration: S.optional(HttpConfiguration),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SegmentDeliveryConfigurations: S.optional(
      __listOfSegmentDeliveryConfiguration,
    ),
    SourceLocationName: S.optional(S.String),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "DescribeSourceLocationResponse",
}) as any as S.Schema<DescribeSourceLocationResponse>;
export interface UpdateSourceLocationResponse {
  AccessConfiguration?: AccessConfiguration;
  Arn?: string;
  CreationTime?: Date;
  DefaultSegmentDeliveryConfiguration?: DefaultSegmentDeliveryConfiguration;
  HttpConfiguration?: HttpConfiguration;
  LastModifiedTime?: Date;
  SegmentDeliveryConfigurations?: __listOfSegmentDeliveryConfiguration;
  SourceLocationName?: string;
  Tags?: __mapOf__string;
}
export const UpdateSourceLocationResponse = S.suspend(() =>
  S.Struct({
    AccessConfiguration: S.optional(AccessConfiguration),
    Arn: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DefaultSegmentDeliveryConfiguration: S.optional(
      DefaultSegmentDeliveryConfiguration,
    ),
    HttpConfiguration: S.optional(HttpConfiguration),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SegmentDeliveryConfigurations: S.optional(
      __listOfSegmentDeliveryConfiguration,
    ),
    SourceLocationName: S.optional(S.String),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "UpdateSourceLocationResponse",
}) as any as S.Schema<UpdateSourceLocationResponse>;
export interface CreateVodSourceResponse {
  Arn?: string;
  CreationTime?: Date;
  HttpPackageConfigurations?: HttpPackageConfigurations;
  LastModifiedTime?: Date;
  SourceLocationName?: string;
  Tags?: __mapOf__string;
  VodSourceName?: string;
}
export const CreateVodSourceResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    HttpPackageConfigurations: S.optional(HttpPackageConfigurations),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SourceLocationName: S.optional(S.String),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    VodSourceName: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateVodSourceResponse",
}) as any as S.Schema<CreateVodSourceResponse>;
export interface UpdateVodSourceResponse {
  Arn?: string;
  CreationTime?: Date;
  HttpPackageConfigurations?: HttpPackageConfigurations;
  LastModifiedTime?: Date;
  SourceLocationName?: string;
  Tags?: __mapOf__string;
  VodSourceName?: string;
}
export const UpdateVodSourceResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    HttpPackageConfigurations: S.optional(HttpPackageConfigurations),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SourceLocationName: S.optional(S.String),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    VodSourceName: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateVodSourceResponse",
}) as any as S.Schema<UpdateVodSourceResponse>;
export interface Transition {
  DurationMillis?: number;
  RelativePosition: string;
  RelativeProgram?: string;
  ScheduledStartTimeMillis?: number;
  Type: string;
}
export const Transition = S.suspend(() =>
  S.Struct({
    DurationMillis: S.optional(S.Number),
    RelativePosition: S.String,
    RelativeProgram: S.optional(S.String),
    ScheduledStartTimeMillis: S.optional(S.Number),
    Type: S.String,
  }),
).annotations({ identifier: "Transition" }) as any as S.Schema<Transition>;
export interface UpdateProgramTransition {
  ScheduledStartTimeMillis?: number;
  DurationMillis?: number;
}
export const UpdateProgramTransition = S.suspend(() =>
  S.Struct({
    ScheduledStartTimeMillis: S.optional(S.Number),
    DurationMillis: S.optional(S.Number),
  }),
).annotations({
  identifier: "UpdateProgramTransition",
}) as any as S.Schema<UpdateProgramTransition>;
export interface AdMarkerPassthrough {
  Enabled?: boolean;
}
export const AdMarkerPassthrough = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "AdMarkerPassthrough",
}) as any as S.Schema<AdMarkerPassthrough>;
export interface Alert {
  AlertCode: string;
  AlertMessage: string;
  LastModifiedTime: Date;
  RelatedResourceArns: __listOf__string;
  ResourceArn: string;
  Category?: string;
}
export const Alert = S.suspend(() =>
  S.Struct({
    AlertCode: S.String,
    AlertMessage: S.String,
    LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    RelatedResourceArns: __listOf__string,
    ResourceArn: S.String,
    Category: S.optional(S.String),
  }),
).annotations({ identifier: "Alert" }) as any as S.Schema<Alert>;
export type __listOfAlert = Alert[];
export const __listOfAlert = S.Array(Alert);
export interface LogConfigurationForChannel {
  LogTypes?: LogTypes;
}
export const LogConfigurationForChannel = S.suspend(() =>
  S.Struct({ LogTypes: S.optional(LogTypes) }),
).annotations({
  identifier: "LogConfigurationForChannel",
}) as any as S.Schema<LogConfigurationForChannel>;
export interface Channel {
  Arn: string;
  ChannelName: string;
  ChannelState: string;
  CreationTime?: Date;
  FillerSlate?: SlateSource;
  LastModifiedTime?: Date;
  Outputs: ResponseOutputs;
  PlaybackMode: string;
  Tags?: __mapOf__string;
  Tier: string;
  LogConfiguration: LogConfigurationForChannel;
  Audiences?: Audiences;
}
export const Channel = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    ChannelName: S.String,
    ChannelState: S.String,
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FillerSlate: S.optional(SlateSource),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Outputs: ResponseOutputs,
    PlaybackMode: S.String,
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    Tier: S.String,
    LogConfiguration: LogConfigurationForChannel,
    Audiences: S.optional(Audiences),
  }),
).annotations({ identifier: "Channel" }) as any as S.Schema<Channel>;
export type __listOfChannel = Channel[];
export const __listOfChannel = S.Array(Channel);
export interface ScheduleConfiguration {
  Transition: Transition;
  ClipRange?: ClipRange;
}
export const ScheduleConfiguration = S.suspend(() =>
  S.Struct({ Transition: Transition, ClipRange: S.optional(ClipRange) }),
).annotations({
  identifier: "ScheduleConfiguration",
}) as any as S.Schema<ScheduleConfiguration>;
export interface UpdateProgramScheduleConfiguration {
  Transition?: UpdateProgramTransition;
  ClipRange?: ClipRange;
}
export const UpdateProgramScheduleConfiguration = S.suspend(() =>
  S.Struct({
    Transition: S.optional(UpdateProgramTransition),
    ClipRange: S.optional(ClipRange),
  }),
).annotations({
  identifier: "UpdateProgramScheduleConfiguration",
}) as any as S.Schema<UpdateProgramScheduleConfiguration>;
export interface LiveSource {
  Arn: string;
  CreationTime?: Date;
  HttpPackageConfigurations: HttpPackageConfigurations;
  LastModifiedTime?: Date;
  LiveSourceName: string;
  SourceLocationName: string;
  Tags?: __mapOf__string;
}
export const LiveSource = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    HttpPackageConfigurations: HttpPackageConfigurations,
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LiveSourceName: S.String,
    SourceLocationName: S.String,
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  }),
).annotations({ identifier: "LiveSource" }) as any as S.Schema<LiveSource>;
export type __listOfLiveSource = LiveSource[];
export const __listOfLiveSource = S.Array(LiveSource);
export interface ManifestProcessingRules {
  AdMarkerPassthrough?: AdMarkerPassthrough;
}
export const ManifestProcessingRules = S.suspend(() =>
  S.Struct({ AdMarkerPassthrough: S.optional(AdMarkerPassthrough) }),
).annotations({
  identifier: "ManifestProcessingRules",
}) as any as S.Schema<ManifestProcessingRules>;
export type ConfigurationAliasesResponse = { [key: string]: __mapOf__string };
export const ConfigurationAliasesResponse = S.Record({
  key: S.String,
  value: __mapOf__string,
});
export interface DashConfiguration {
  ManifestEndpointPrefix?: string;
  MpdLocation?: string;
  OriginManifestType?: string;
}
export const DashConfiguration = S.suspend(() =>
  S.Struct({
    ManifestEndpointPrefix: S.optional(S.String),
    MpdLocation: S.optional(S.String),
    OriginManifestType: S.optional(S.String),
  }),
).annotations({
  identifier: "DashConfiguration",
}) as any as S.Schema<DashConfiguration>;
export interface HlsConfiguration {
  ManifestEndpointPrefix?: string;
}
export const HlsConfiguration = S.suspend(() =>
  S.Struct({ ManifestEndpointPrefix: S.optional(S.String) }),
).annotations({
  identifier: "HlsConfiguration",
}) as any as S.Schema<HlsConfiguration>;
export interface LogConfiguration {
  PercentEnabled: number;
  EnabledLoggingStrategies: __listOfLoggingStrategies;
  AdsInteractionLog?: AdsInteractionLog;
  ManifestServiceInteractionLog?: ManifestServiceInteractionLog;
}
export const LogConfiguration = S.suspend(() =>
  S.Struct({
    PercentEnabled: S.Number,
    EnabledLoggingStrategies: __listOfLoggingStrategies,
    AdsInteractionLog: S.optional(AdsInteractionLog),
    ManifestServiceInteractionLog: S.optional(ManifestServiceInteractionLog),
  }),
).annotations({
  identifier: "LogConfiguration",
}) as any as S.Schema<LogConfiguration>;
export type StringMap = { [key: string]: string };
export const StringMap = S.Record({ key: S.String, value: S.String });
export interface HttpRequest {
  Method?: string;
  Body?: string;
  Headers?: StringMap;
  CompressRequest?: string;
}
export const HttpRequest = S.suspend(() =>
  S.Struct({
    Method: S.optional(S.String),
    Body: S.optional(S.String),
    Headers: S.optional(StringMap),
    CompressRequest: S.optional(S.String),
  }),
).annotations({ identifier: "HttpRequest" }) as any as S.Schema<HttpRequest>;
export interface AdDecisionServerConfiguration {
  HttpRequest?: HttpRequest;
}
export const AdDecisionServerConfiguration = S.suspend(() =>
  S.Struct({ HttpRequest: S.optional(HttpRequest) }),
).annotations({
  identifier: "AdDecisionServerConfiguration",
}) as any as S.Schema<AdDecisionServerConfiguration>;
export interface PlaybackConfiguration {
  AdDecisionServerUrl?: string;
  AvailSuppression?: AvailSuppression;
  Bumper?: Bumper;
  CdnConfiguration?: CdnConfiguration;
  ConfigurationAliases?: ConfigurationAliasesResponse;
  DashConfiguration?: DashConfiguration;
  HlsConfiguration?: HlsConfiguration;
  InsertionMode?: string;
  LivePreRollConfiguration?: LivePreRollConfiguration;
  LogConfiguration?: LogConfiguration;
  ManifestProcessingRules?: ManifestProcessingRules;
  Name?: string;
  PersonalizationThresholdSeconds?: number;
  PlaybackConfigurationArn?: string;
  PlaybackEndpointPrefix?: string;
  SessionInitializationEndpointPrefix?: string;
  SlateAdUrl?: string;
  Tags?: __mapOf__string;
  TranscodeProfileName?: string;
  VideoContentSourceUrl?: string;
  AdConditioningConfiguration?: AdConditioningConfiguration;
  AdDecisionServerConfiguration?: AdDecisionServerConfiguration;
}
export const PlaybackConfiguration = S.suspend(() =>
  S.Struct({
    AdDecisionServerUrl: S.optional(S.String),
    AvailSuppression: S.optional(AvailSuppression),
    Bumper: S.optional(Bumper),
    CdnConfiguration: S.optional(CdnConfiguration),
    ConfigurationAliases: S.optional(ConfigurationAliasesResponse),
    DashConfiguration: S.optional(DashConfiguration),
    HlsConfiguration: S.optional(HlsConfiguration),
    InsertionMode: S.optional(S.String),
    LivePreRollConfiguration: S.optional(LivePreRollConfiguration),
    LogConfiguration: S.optional(LogConfiguration),
    ManifestProcessingRules: S.optional(ManifestProcessingRules),
    Name: S.optional(S.String),
    PersonalizationThresholdSeconds: S.optional(S.Number),
    PlaybackConfigurationArn: S.optional(S.String),
    PlaybackEndpointPrefix: S.optional(S.String),
    SessionInitializationEndpointPrefix: S.optional(S.String),
    SlateAdUrl: S.optional(S.String),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    TranscodeProfileName: S.optional(S.String),
    VideoContentSourceUrl: S.optional(S.String),
    AdConditioningConfiguration: S.optional(AdConditioningConfiguration),
    AdDecisionServerConfiguration: S.optional(AdDecisionServerConfiguration),
  }),
).annotations({
  identifier: "PlaybackConfiguration",
}) as any as S.Schema<PlaybackConfiguration>;
export type __listOfPlaybackConfiguration = PlaybackConfiguration[];
export const __listOfPlaybackConfiguration = S.Array(PlaybackConfiguration);
export interface PrefetchSchedule {
  Arn: string;
  Consumption?: PrefetchConsumption;
  Name: string;
  PlaybackConfigurationName: string;
  Retrieval?: PrefetchRetrieval;
  ScheduleType?: string;
  RecurringPrefetchConfiguration?: RecurringPrefetchConfiguration;
  StreamId?: string;
}
export const PrefetchSchedule = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    Consumption: S.optional(PrefetchConsumption),
    Name: S.String,
    PlaybackConfigurationName: S.String,
    Retrieval: S.optional(PrefetchRetrieval),
    ScheduleType: S.optional(S.String),
    RecurringPrefetchConfiguration: S.optional(RecurringPrefetchConfiguration),
    StreamId: S.optional(S.String),
  }),
).annotations({
  identifier: "PrefetchSchedule",
}) as any as S.Schema<PrefetchSchedule>;
export type __listOfPrefetchSchedule = PrefetchSchedule[];
export const __listOfPrefetchSchedule = S.Array(PrefetchSchedule);
export interface SourceLocation {
  AccessConfiguration?: AccessConfiguration;
  Arn: string;
  CreationTime?: Date;
  DefaultSegmentDeliveryConfiguration?: DefaultSegmentDeliveryConfiguration;
  HttpConfiguration: HttpConfiguration;
  LastModifiedTime?: Date;
  SegmentDeliveryConfigurations?: __listOfSegmentDeliveryConfiguration;
  SourceLocationName: string;
  Tags?: __mapOf__string;
}
export const SourceLocation = S.suspend(() =>
  S.Struct({
    AccessConfiguration: S.optional(AccessConfiguration),
    Arn: S.String,
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DefaultSegmentDeliveryConfiguration: S.optional(
      DefaultSegmentDeliveryConfiguration,
    ),
    HttpConfiguration: HttpConfiguration,
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SegmentDeliveryConfigurations: S.optional(
      __listOfSegmentDeliveryConfiguration,
    ),
    SourceLocationName: S.String,
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "SourceLocation",
}) as any as S.Schema<SourceLocation>;
export type __listOfSourceLocation = SourceLocation[];
export const __listOfSourceLocation = S.Array(SourceLocation);
export interface AdBreakOpportunity {
  OffsetMillis: number;
}
export const AdBreakOpportunity = S.suspend(() =>
  S.Struct({ OffsetMillis: S.Number }),
).annotations({
  identifier: "AdBreakOpportunity",
}) as any as S.Schema<AdBreakOpportunity>;
export type AdBreakOpportunities = AdBreakOpportunity[];
export const AdBreakOpportunities = S.Array(AdBreakOpportunity);
export interface VodSource {
  Arn: string;
  CreationTime?: Date;
  HttpPackageConfigurations: HttpPackageConfigurations;
  LastModifiedTime?: Date;
  SourceLocationName: string;
  Tags?: __mapOf__string;
  VodSourceName: string;
}
export const VodSource = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    HttpPackageConfigurations: HttpPackageConfigurations,
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SourceLocationName: S.String,
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    VodSourceName: S.String,
  }),
).annotations({ identifier: "VodSource" }) as any as S.Schema<VodSource>;
export type __listOfVodSource = VodSource[];
export const __listOfVodSource = S.Array(VodSource);
export interface ConfigureLogsForPlaybackConfigurationResponse {
  PercentEnabled: number;
  PlaybackConfigurationName?: string;
  EnabledLoggingStrategies?: __listOfLoggingStrategies;
  AdsInteractionLog?: AdsInteractionLog;
  ManifestServiceInteractionLog?: ManifestServiceInteractionLog;
}
export const ConfigureLogsForPlaybackConfigurationResponse = S.suspend(() =>
  S.Struct({
    PercentEnabled: S.Number,
    PlaybackConfigurationName: S.optional(S.String),
    EnabledLoggingStrategies: S.optional(__listOfLoggingStrategies),
    AdsInteractionLog: S.optional(AdsInteractionLog),
    ManifestServiceInteractionLog: S.optional(ManifestServiceInteractionLog),
  }),
).annotations({
  identifier: "ConfigureLogsForPlaybackConfigurationResponse",
}) as any as S.Schema<ConfigureLogsForPlaybackConfigurationResponse>;
export interface ListAlertsResponse {
  Items?: __listOfAlert;
  NextToken?: string;
}
export const ListAlertsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(__listOfAlert),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAlertsResponse",
}) as any as S.Schema<ListAlertsResponse>;
export interface CreateChannelRequest {
  ChannelName: string;
  FillerSlate?: SlateSource;
  Outputs: RequestOutputs;
  PlaybackMode: string;
  Tags?: __mapOf__string;
  Tier?: string;
  TimeShiftConfiguration?: TimeShiftConfiguration;
  Audiences?: Audiences;
}
export const CreateChannelRequest = S.suspend(() =>
  S.Struct({
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    FillerSlate: S.optional(SlateSource),
    Outputs: RequestOutputs,
    PlaybackMode: S.String,
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    Tier: S.optional(S.String),
    TimeShiftConfiguration: S.optional(TimeShiftConfiguration),
    Audiences: S.optional(Audiences),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/channel/{ChannelName}" }),
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
export interface DescribeChannelResponse {
  Arn?: string;
  ChannelName?: string;
  ChannelState?: string;
  CreationTime?: Date;
  FillerSlate?: SlateSource;
  LastModifiedTime?: Date;
  Outputs?: ResponseOutputs;
  PlaybackMode?: string;
  Tags?: __mapOf__string;
  Tier?: string;
  LogConfiguration: LogConfigurationForChannel;
  TimeShiftConfiguration?: TimeShiftConfiguration;
  Audiences?: Audiences;
}
export const DescribeChannelResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    ChannelName: S.optional(S.String),
    ChannelState: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FillerSlate: S.optional(SlateSource),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Outputs: S.optional(ResponseOutputs),
    PlaybackMode: S.optional(S.String),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    Tier: S.optional(S.String),
    LogConfiguration: LogConfigurationForChannel,
    TimeShiftConfiguration: S.optional(TimeShiftConfiguration),
    Audiences: S.optional(Audiences),
  }),
).annotations({
  identifier: "DescribeChannelResponse",
}) as any as S.Schema<DescribeChannelResponse>;
export interface ListChannelsResponse {
  Items?: __listOfChannel;
  NextToken?: string;
}
export const ListChannelsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(__listOfChannel),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListChannelsResponse",
}) as any as S.Schema<ListChannelsResponse>;
export interface UpdateProgramRequest {
  AdBreaks?: __listOfAdBreak;
  ChannelName: string;
  ProgramName: string;
  ScheduleConfiguration: UpdateProgramScheduleConfiguration;
  AudienceMedia?: __listOfAudienceMedia;
}
export const UpdateProgramRequest = S.suspend(() =>
  S.Struct({
    AdBreaks: S.optional(__listOfAdBreak),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    ProgramName: S.String.pipe(T.HttpLabel("ProgramName")),
    ScheduleConfiguration: UpdateProgramScheduleConfiguration,
    AudienceMedia: S.optional(__listOfAudienceMedia),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/channel/{ChannelName}/program/{ProgramName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateProgramRequest",
}) as any as S.Schema<UpdateProgramRequest>;
export interface CreateLiveSourceResponse {
  Arn?: string;
  CreationTime?: Date;
  HttpPackageConfigurations?: HttpPackageConfigurations;
  LastModifiedTime?: Date;
  LiveSourceName?: string;
  SourceLocationName?: string;
  Tags?: __mapOf__string;
}
export const CreateLiveSourceResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    HttpPackageConfigurations: S.optional(HttpPackageConfigurations),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LiveSourceName: S.optional(S.String),
    SourceLocationName: S.optional(S.String),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "CreateLiveSourceResponse",
}) as any as S.Schema<CreateLiveSourceResponse>;
export interface ListLiveSourcesResponse {
  Items?: __listOfLiveSource;
  NextToken?: string;
}
export const ListLiveSourcesResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(__listOfLiveSource),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLiveSourcesResponse",
}) as any as S.Schema<ListLiveSourcesResponse>;
export interface GetPlaybackConfigurationResponse {
  AdDecisionServerUrl?: string;
  AvailSuppression?: AvailSuppression;
  Bumper?: Bumper;
  CdnConfiguration?: CdnConfiguration;
  ConfigurationAliases?: ConfigurationAliasesResponse;
  DashConfiguration?: DashConfiguration;
  HlsConfiguration?: HlsConfiguration;
  InsertionMode?: string;
  LivePreRollConfiguration?: LivePreRollConfiguration;
  LogConfiguration?: LogConfiguration;
  ManifestProcessingRules?: ManifestProcessingRules;
  Name?: string;
  PersonalizationThresholdSeconds?: number;
  PlaybackConfigurationArn?: string;
  PlaybackEndpointPrefix?: string;
  SessionInitializationEndpointPrefix?: string;
  SlateAdUrl?: string;
  Tags?: __mapOf__string;
  TranscodeProfileName?: string;
  VideoContentSourceUrl?: string;
  AdConditioningConfiguration?: AdConditioningConfiguration;
  AdDecisionServerConfiguration?: AdDecisionServerConfiguration;
}
export const GetPlaybackConfigurationResponse = S.suspend(() =>
  S.Struct({
    AdDecisionServerUrl: S.optional(S.String),
    AvailSuppression: S.optional(AvailSuppression),
    Bumper: S.optional(Bumper),
    CdnConfiguration: S.optional(CdnConfiguration),
    ConfigurationAliases: S.optional(ConfigurationAliasesResponse),
    DashConfiguration: S.optional(DashConfiguration),
    HlsConfiguration: S.optional(HlsConfiguration),
    InsertionMode: S.optional(S.String),
    LivePreRollConfiguration: S.optional(LivePreRollConfiguration),
    LogConfiguration: S.optional(LogConfiguration),
    ManifestProcessingRules: S.optional(ManifestProcessingRules),
    Name: S.optional(S.String),
    PersonalizationThresholdSeconds: S.optional(S.Number),
    PlaybackConfigurationArn: S.optional(S.String),
    PlaybackEndpointPrefix: S.optional(S.String),
    SessionInitializationEndpointPrefix: S.optional(S.String),
    SlateAdUrl: S.optional(S.String),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    TranscodeProfileName: S.optional(S.String),
    VideoContentSourceUrl: S.optional(S.String),
    AdConditioningConfiguration: S.optional(AdConditioningConfiguration),
    AdDecisionServerConfiguration: S.optional(AdDecisionServerConfiguration),
  }),
).annotations({
  identifier: "GetPlaybackConfigurationResponse",
}) as any as S.Schema<GetPlaybackConfigurationResponse>;
export interface ListPlaybackConfigurationsResponse {
  Items?: __listOfPlaybackConfiguration;
  NextToken?: string;
}
export const ListPlaybackConfigurationsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(__listOfPlaybackConfiguration),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPlaybackConfigurationsResponse",
}) as any as S.Schema<ListPlaybackConfigurationsResponse>;
export interface CreatePrefetchScheduleRequest {
  Consumption?: PrefetchConsumption;
  Name: string;
  PlaybackConfigurationName: string;
  Retrieval?: PrefetchRetrieval;
  RecurringPrefetchConfiguration?: RecurringPrefetchConfiguration;
  ScheduleType?: string;
  StreamId?: string;
}
export const CreatePrefetchScheduleRequest = S.suspend(() =>
  S.Struct({
    Consumption: S.optional(PrefetchConsumption),
    Name: S.String.pipe(T.HttpLabel("Name")),
    PlaybackConfigurationName: S.String.pipe(
      T.HttpLabel("PlaybackConfigurationName"),
    ),
    Retrieval: S.optional(PrefetchRetrieval),
    RecurringPrefetchConfiguration: S.optional(RecurringPrefetchConfiguration),
    ScheduleType: S.optional(S.String),
    StreamId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/prefetchSchedule/{PlaybackConfigurationName}/{Name}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePrefetchScheduleRequest",
}) as any as S.Schema<CreatePrefetchScheduleRequest>;
export interface ListPrefetchSchedulesResponse {
  Items?: __listOfPrefetchSchedule;
  NextToken?: string;
}
export const ListPrefetchSchedulesResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(__listOfPrefetchSchedule),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPrefetchSchedulesResponse",
}) as any as S.Schema<ListPrefetchSchedulesResponse>;
export interface CreateSourceLocationRequest {
  AccessConfiguration?: AccessConfiguration;
  DefaultSegmentDeliveryConfiguration?: DefaultSegmentDeliveryConfiguration;
  HttpConfiguration: HttpConfiguration;
  SegmentDeliveryConfigurations?: __listOfSegmentDeliveryConfiguration;
  SourceLocationName: string;
  Tags?: __mapOf__string;
}
export const CreateSourceLocationRequest = S.suspend(() =>
  S.Struct({
    AccessConfiguration: S.optional(AccessConfiguration),
    DefaultSegmentDeliveryConfiguration: S.optional(
      DefaultSegmentDeliveryConfiguration,
    ),
    HttpConfiguration: HttpConfiguration,
    SegmentDeliveryConfigurations: S.optional(
      __listOfSegmentDeliveryConfiguration,
    ),
    SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/sourceLocation/{SourceLocationName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSourceLocationRequest",
}) as any as S.Schema<CreateSourceLocationRequest>;
export interface ListSourceLocationsResponse {
  Items?: __listOfSourceLocation;
  NextToken?: string;
}
export const ListSourceLocationsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(__listOfSourceLocation),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSourceLocationsResponse",
}) as any as S.Schema<ListSourceLocationsResponse>;
export interface DescribeVodSourceResponse {
  AdBreakOpportunities?: AdBreakOpportunities;
  Arn?: string;
  CreationTime?: Date;
  HttpPackageConfigurations?: HttpPackageConfigurations;
  LastModifiedTime?: Date;
  SourceLocationName?: string;
  Tags?: __mapOf__string;
  VodSourceName?: string;
}
export const DescribeVodSourceResponse = S.suspend(() =>
  S.Struct({
    AdBreakOpportunities: S.optional(AdBreakOpportunities),
    Arn: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    HttpPackageConfigurations: S.optional(HttpPackageConfigurations),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SourceLocationName: S.optional(S.String),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    VodSourceName: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeVodSourceResponse",
}) as any as S.Schema<DescribeVodSourceResponse>;
export interface ListVodSourcesResponse {
  Items?: __listOfVodSource;
  NextToken?: string;
}
export const ListVodSourcesResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(__listOfVodSource),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListVodSourcesResponse",
}) as any as S.Schema<ListVodSourcesResponse>;
export interface ScheduleAdBreak {
  ApproximateDurationSeconds?: number;
  ApproximateStartTime?: Date;
  SourceLocationName?: string;
  VodSourceName?: string;
}
export const ScheduleAdBreak = S.suspend(() =>
  S.Struct({
    ApproximateDurationSeconds: S.optional(S.Number),
    ApproximateStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SourceLocationName: S.optional(S.String),
    VodSourceName: S.optional(S.String),
  }),
).annotations({
  identifier: "ScheduleAdBreak",
}) as any as S.Schema<ScheduleAdBreak>;
export type __listOfScheduleAdBreak = ScheduleAdBreak[];
export const __listOfScheduleAdBreak = S.Array(ScheduleAdBreak);
export interface ScheduleEntry {
  ApproximateDurationSeconds?: number;
  ApproximateStartTime?: Date;
  Arn: string;
  ChannelName: string;
  LiveSourceName?: string;
  ProgramName: string;
  ScheduleAdBreaks?: __listOfScheduleAdBreak;
  ScheduleEntryType?: string;
  SourceLocationName: string;
  VodSourceName?: string;
  Audiences?: Audiences;
}
export const ScheduleEntry = S.suspend(() =>
  S.Struct({
    ApproximateDurationSeconds: S.optional(S.Number),
    ApproximateStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Arn: S.String,
    ChannelName: S.String,
    LiveSourceName: S.optional(S.String),
    ProgramName: S.String,
    ScheduleAdBreaks: S.optional(__listOfScheduleAdBreak),
    ScheduleEntryType: S.optional(S.String),
    SourceLocationName: S.String,
    VodSourceName: S.optional(S.String),
    Audiences: S.optional(Audiences),
  }),
).annotations({
  identifier: "ScheduleEntry",
}) as any as S.Schema<ScheduleEntry>;
export type __listOfScheduleEntry = ScheduleEntry[];
export const __listOfScheduleEntry = S.Array(ScheduleEntry);
export interface CreateChannelResponse {
  Arn?: string;
  ChannelName?: string;
  ChannelState?: string;
  CreationTime?: Date;
  FillerSlate?: SlateSource;
  LastModifiedTime?: Date;
  Outputs?: ResponseOutputs;
  PlaybackMode?: string;
  Tags?: __mapOf__string;
  Tier?: string;
  TimeShiftConfiguration?: TimeShiftConfiguration;
  Audiences?: Audiences;
}
export const CreateChannelResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    ChannelName: S.optional(S.String),
    ChannelState: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FillerSlate: S.optional(SlateSource),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Outputs: S.optional(ResponseOutputs),
    PlaybackMode: S.optional(S.String),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    Tier: S.optional(S.String),
    TimeShiftConfiguration: S.optional(TimeShiftConfiguration),
    Audiences: S.optional(Audiences),
  }),
).annotations({
  identifier: "CreateChannelResponse",
}) as any as S.Schema<CreateChannelResponse>;
export interface GetChannelScheduleResponse {
  Items?: __listOfScheduleEntry;
  NextToken?: string;
}
export const GetChannelScheduleResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(__listOfScheduleEntry),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetChannelScheduleResponse",
}) as any as S.Schema<GetChannelScheduleResponse>;
export interface CreateProgramRequest {
  AdBreaks?: __listOfAdBreak;
  ChannelName: string;
  LiveSourceName?: string;
  ProgramName: string;
  ScheduleConfiguration: ScheduleConfiguration;
  SourceLocationName: string;
  VodSourceName?: string;
  AudienceMedia?: __listOfAudienceMedia;
}
export const CreateProgramRequest = S.suspend(() =>
  S.Struct({
    AdBreaks: S.optional(__listOfAdBreak),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    LiveSourceName: S.optional(S.String),
    ProgramName: S.String.pipe(T.HttpLabel("ProgramName")),
    ScheduleConfiguration: ScheduleConfiguration,
    SourceLocationName: S.String,
    VodSourceName: S.optional(S.String),
    AudienceMedia: S.optional(__listOfAudienceMedia),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/channel/{ChannelName}/program/{ProgramName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProgramRequest",
}) as any as S.Schema<CreateProgramRequest>;
export interface UpdateProgramResponse {
  AdBreaks?: __listOfAdBreak;
  Arn?: string;
  ChannelName?: string;
  CreationTime?: Date;
  ProgramName?: string;
  SourceLocationName?: string;
  VodSourceName?: string;
  LiveSourceName?: string;
  ClipRange?: ClipRange;
  DurationMillis?: number;
  ScheduledStartTime?: Date;
  AudienceMedia?: __listOfAudienceMedia;
}
export const UpdateProgramResponse = S.suspend(() =>
  S.Struct({
    AdBreaks: S.optional(__listOfAdBreak),
    Arn: S.optional(S.String),
    ChannelName: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ProgramName: S.optional(S.String),
    SourceLocationName: S.optional(S.String),
    VodSourceName: S.optional(S.String),
    LiveSourceName: S.optional(S.String),
    ClipRange: S.optional(ClipRange),
    DurationMillis: S.optional(S.Number),
    ScheduledStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AudienceMedia: S.optional(__listOfAudienceMedia),
  }),
).annotations({
  identifier: "UpdateProgramResponse",
}) as any as S.Schema<UpdateProgramResponse>;
export interface PutPlaybackConfigurationRequest {
  AdDecisionServerUrl?: string;
  AvailSuppression?: AvailSuppression;
  Bumper?: Bumper;
  CdnConfiguration?: CdnConfiguration;
  ConfigurationAliases?: ConfigurationAliasesRequest;
  DashConfiguration?: DashConfigurationForPut;
  InsertionMode?: string;
  LivePreRollConfiguration?: LivePreRollConfiguration;
  ManifestProcessingRules?: ManifestProcessingRules;
  Name: string;
  PersonalizationThresholdSeconds?: number;
  SlateAdUrl?: string;
  Tags?: __mapOf__string;
  TranscodeProfileName?: string;
  VideoContentSourceUrl?: string;
  AdConditioningConfiguration?: AdConditioningConfiguration;
  AdDecisionServerConfiguration?: AdDecisionServerConfiguration;
}
export const PutPlaybackConfigurationRequest = S.suspend(() =>
  S.Struct({
    AdDecisionServerUrl: S.optional(S.String),
    AvailSuppression: S.optional(AvailSuppression),
    Bumper: S.optional(Bumper),
    CdnConfiguration: S.optional(CdnConfiguration),
    ConfigurationAliases: S.optional(ConfigurationAliasesRequest),
    DashConfiguration: S.optional(DashConfigurationForPut),
    InsertionMode: S.optional(S.String),
    LivePreRollConfiguration: S.optional(LivePreRollConfiguration),
    ManifestProcessingRules: S.optional(ManifestProcessingRules),
    Name: S.String,
    PersonalizationThresholdSeconds: S.optional(S.Number),
    SlateAdUrl: S.optional(S.String),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    TranscodeProfileName: S.optional(S.String),
    VideoContentSourceUrl: S.optional(S.String),
    AdConditioningConfiguration: S.optional(AdConditioningConfiguration),
    AdDecisionServerConfiguration: S.optional(AdDecisionServerConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/playbackConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutPlaybackConfigurationRequest",
}) as any as S.Schema<PutPlaybackConfigurationRequest>;
export interface CreatePrefetchScheduleResponse {
  Arn?: string;
  Consumption?: PrefetchConsumption;
  Name?: string;
  PlaybackConfigurationName?: string;
  Retrieval?: PrefetchRetrieval;
  RecurringPrefetchConfiguration?: RecurringPrefetchConfiguration;
  ScheduleType?: string;
  StreamId?: string;
}
export const CreatePrefetchScheduleResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Consumption: S.optional(PrefetchConsumption),
    Name: S.optional(S.String),
    PlaybackConfigurationName: S.optional(S.String),
    Retrieval: S.optional(PrefetchRetrieval),
    RecurringPrefetchConfiguration: S.optional(RecurringPrefetchConfiguration),
    ScheduleType: S.optional(S.String),
    StreamId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreatePrefetchScheduleResponse",
}) as any as S.Schema<CreatePrefetchScheduleResponse>;
export interface CreateSourceLocationResponse {
  AccessConfiguration?: AccessConfiguration;
  Arn?: string;
  CreationTime?: Date;
  DefaultSegmentDeliveryConfiguration?: DefaultSegmentDeliveryConfiguration;
  HttpConfiguration?: HttpConfiguration;
  LastModifiedTime?: Date;
  SegmentDeliveryConfigurations?: __listOfSegmentDeliveryConfiguration;
  SourceLocationName?: string;
  Tags?: __mapOf__string;
}
export const CreateSourceLocationResponse = S.suspend(() =>
  S.Struct({
    AccessConfiguration: S.optional(AccessConfiguration),
    Arn: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DefaultSegmentDeliveryConfiguration: S.optional(
      DefaultSegmentDeliveryConfiguration,
    ),
    HttpConfiguration: S.optional(HttpConfiguration),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SegmentDeliveryConfigurations: S.optional(
      __listOfSegmentDeliveryConfiguration,
    ),
    SourceLocationName: S.optional(S.String),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "CreateSourceLocationResponse",
}) as any as S.Schema<CreateSourceLocationResponse>;
export interface CreateProgramResponse {
  AdBreaks?: __listOfAdBreak;
  Arn?: string;
  ChannelName?: string;
  CreationTime?: Date;
  LiveSourceName?: string;
  ProgramName?: string;
  ScheduledStartTime?: Date;
  SourceLocationName?: string;
  VodSourceName?: string;
  ClipRange?: ClipRange;
  DurationMillis?: number;
  AudienceMedia?: __listOfAudienceMedia;
}
export const CreateProgramResponse = S.suspend(() =>
  S.Struct({
    AdBreaks: S.optional(__listOfAdBreak),
    Arn: S.optional(S.String),
    ChannelName: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LiveSourceName: S.optional(S.String),
    ProgramName: S.optional(S.String),
    ScheduledStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SourceLocationName: S.optional(S.String),
    VodSourceName: S.optional(S.String),
    ClipRange: S.optional(ClipRange),
    DurationMillis: S.optional(S.Number),
    AudienceMedia: S.optional(__listOfAudienceMedia),
  }),
).annotations({
  identifier: "CreateProgramResponse",
}) as any as S.Schema<CreateProgramResponse>;
export interface PutPlaybackConfigurationResponse {
  AdDecisionServerUrl?: string;
  AvailSuppression?: AvailSuppression;
  Bumper?: Bumper;
  CdnConfiguration?: CdnConfiguration;
  ConfigurationAliases?: ConfigurationAliasesResponse;
  DashConfiguration?: DashConfiguration;
  HlsConfiguration?: HlsConfiguration;
  InsertionMode?: string;
  LivePreRollConfiguration?: LivePreRollConfiguration;
  LogConfiguration?: LogConfiguration;
  ManifestProcessingRules?: ManifestProcessingRules;
  Name?: string;
  PersonalizationThresholdSeconds?: number;
  PlaybackConfigurationArn?: string;
  PlaybackEndpointPrefix?: string;
  SessionInitializationEndpointPrefix?: string;
  SlateAdUrl?: string;
  Tags?: __mapOf__string;
  TranscodeProfileName?: string;
  VideoContentSourceUrl?: string;
  AdConditioningConfiguration?: AdConditioningConfiguration;
  AdDecisionServerConfiguration?: AdDecisionServerConfiguration;
}
export const PutPlaybackConfigurationResponse = S.suspend(() =>
  S.Struct({
    AdDecisionServerUrl: S.optional(S.String),
    AvailSuppression: S.optional(AvailSuppression),
    Bumper: S.optional(Bumper),
    CdnConfiguration: S.optional(CdnConfiguration),
    ConfigurationAliases: S.optional(ConfigurationAliasesResponse),
    DashConfiguration: S.optional(DashConfiguration),
    HlsConfiguration: S.optional(HlsConfiguration),
    InsertionMode: S.optional(S.String),
    LivePreRollConfiguration: S.optional(LivePreRollConfiguration),
    LogConfiguration: S.optional(LogConfiguration),
    ManifestProcessingRules: S.optional(ManifestProcessingRules),
    Name: S.optional(S.String),
    PersonalizationThresholdSeconds: S.optional(S.Number),
    PlaybackConfigurationArn: S.optional(S.String),
    PlaybackEndpointPrefix: S.optional(S.String),
    SessionInitializationEndpointPrefix: S.optional(S.String),
    SlateAdUrl: S.optional(S.String),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    TranscodeProfileName: S.optional(S.String),
    VideoContentSourceUrl: S.optional(S.String),
    AdConditioningConfiguration: S.optional(AdConditioningConfiguration),
    AdDecisionServerConfiguration: S.optional(AdDecisionServerConfiguration),
  }),
).annotations({
  identifier: "PutPlaybackConfigurationResponse",
}) as any as S.Schema<PutPlaybackConfigurationResponse>;

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Deletes a channel. For information about MediaTailor channels, see Working with channels in the *MediaTailor User Guide*.
 */
export const deleteChannel: (
  input: DeleteChannelRequest,
) => Effect.Effect<
  DeleteChannelResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChannelRequest,
  output: DeleteChannelResponse,
  errors: [],
}));
/**
 * Starts a channel. For information about MediaTailor channels, see Working with channels in the *MediaTailor User Guide*.
 */
export const startChannel: (
  input: StartChannelRequest,
) => Effect.Effect<
  StartChannelResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartChannelRequest,
  output: StartChannelResponse,
  errors: [],
}));
/**
 * Stops a channel. For information about MediaTailor channels, see Working with channels in the *MediaTailor User Guide*.
 */
export const stopChannel: (
  input: StopChannelRequest,
) => Effect.Effect<
  StopChannelResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopChannelRequest,
  output: StopChannelResponse,
  errors: [],
}));
/**
 * Creates an IAM policy for the channel. IAM policies are used to control access to your channel.
 */
export const putChannelPolicy: (
  input: PutChannelPolicyRequest,
) => Effect.Effect<
  PutChannelPolicyResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutChannelPolicyRequest,
  output: PutChannelPolicyResponse,
  errors: [],
}));
/**
 * The channel policy to delete.
 */
export const deleteChannelPolicy: (
  input: DeleteChannelPolicyRequest,
) => Effect.Effect<
  DeleteChannelPolicyResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChannelPolicyRequest,
  output: DeleteChannelPolicyResponse,
  errors: [],
}));
/**
 * Deletes a program within a channel. For information about programs, see Working with programs in the *MediaTailor User Guide*.
 */
export const deleteProgram: (
  input: DeleteProgramRequest,
) => Effect.Effect<
  DeleteProgramResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProgramRequest,
  output: DeleteProgramResponse,
  errors: [],
}));
/**
 * The live source to delete.
 */
export const deleteLiveSource: (
  input: DeleteLiveSourceRequest,
) => Effect.Effect<
  DeleteLiveSourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLiveSourceRequest,
  output: DeleteLiveSourceResponse,
  errors: [],
}));
/**
 * Deletes a playback configuration. For information about MediaTailor configurations, see Working with configurations in AWS Elemental MediaTailor.
 */
export const deletePlaybackConfiguration: (
  input: DeletePlaybackConfigurationRequest,
) => Effect.Effect<
  DeletePlaybackConfigurationResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePlaybackConfigurationRequest,
  output: DeletePlaybackConfigurationResponse,
  errors: [],
}));
/**
 * Deletes a prefetch schedule for a specific playback configuration. If you call `DeletePrefetchSchedule` on an expired prefetch schedule, MediaTailor returns an HTTP 404 status code. For more information about ad prefetching, see Using ad prefetching in the *MediaTailor User Guide*.
 */
export const deletePrefetchSchedule: (
  input: DeletePrefetchScheduleRequest,
) => Effect.Effect<
  DeletePrefetchScheduleResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePrefetchScheduleRequest,
  output: DeletePrefetchScheduleResponse,
  errors: [],
}));
/**
 * Deletes a source location. A source location is a container for sources. For more information about source locations, see Working with source locations in the *MediaTailor User Guide*.
 */
export const deleteSourceLocation: (
  input: DeleteSourceLocationRequest,
) => Effect.Effect<
  DeleteSourceLocationResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSourceLocationRequest,
  output: DeleteSourceLocationResponse,
  errors: [],
}));
/**
 * The video on demand (VOD) source to delete.
 */
export const deleteVodSource: (
  input: DeleteVodSourceRequest,
) => Effect.Effect<
  DeleteVodSourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVodSourceRequest,
  output: DeleteVodSourceResponse,
  errors: [],
}));
/**
 * The resource to untag.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  BadRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [BadRequestException],
}));
/**
 * Updates a channel. For information about MediaTailor channels, see Working with channels in the *MediaTailor User Guide*.
 */
export const updateChannel: (
  input: UpdateChannelRequest,
) => Effect.Effect<
  UpdateChannelResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateChannelRequest,
  output: UpdateChannelResponse,
  errors: [],
}));
/**
 * Configures Amazon CloudWatch log settings for a channel.
 */
export const configureLogsForChannel: (
  input: ConfigureLogsForChannelRequest,
) => Effect.Effect<
  ConfigureLogsForChannelResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ConfigureLogsForChannelRequest,
  output: ConfigureLogsForChannelResponse,
  errors: [],
}));
/**
 * Returns the channel's IAM policy. IAM policies are used to control access to your channel.
 */
export const getChannelPolicy: (
  input: GetChannelPolicyRequest,
) => Effect.Effect<
  GetChannelPolicyResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetChannelPolicyRequest,
  output: GetChannelPolicyResponse,
  errors: [],
}));
/**
 * Describes a program within a channel. For information about programs, see Working with programs in the *MediaTailor User Guide*.
 */
export const describeProgram: (
  input: DescribeProgramRequest,
) => Effect.Effect<
  DescribeProgramResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProgramRequest,
  output: DescribeProgramResponse,
  errors: [],
}));
/**
 * The live source to describe.
 */
export const describeLiveSource: (
  input: DescribeLiveSourceRequest,
) => Effect.Effect<
  DescribeLiveSourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLiveSourceRequest,
  output: DescribeLiveSourceResponse,
  errors: [],
}));
/**
 * Updates a live source's configuration.
 */
export const updateLiveSource: (
  input: UpdateLiveSourceRequest,
) => Effect.Effect<
  UpdateLiveSourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLiveSourceRequest,
  output: UpdateLiveSourceResponse,
  errors: [],
}));
/**
 * Retrieves a prefetch schedule for a playback configuration. A prefetch schedule allows you to tell MediaTailor to fetch and prepare certain ads before an ad break happens. For more information about ad prefetching, see Using ad prefetching in the *MediaTailor User Guide*.
 */
export const getPrefetchSchedule: (
  input: GetPrefetchScheduleRequest,
) => Effect.Effect<
  GetPrefetchScheduleResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPrefetchScheduleRequest,
  output: GetPrefetchScheduleResponse,
  errors: [],
}));
/**
 * Describes a source location. A source location is a container for sources. For more information about source locations, see Working with source locations in the *MediaTailor User Guide*.
 */
export const describeSourceLocation: (
  input: DescribeSourceLocationRequest,
) => Effect.Effect<
  DescribeSourceLocationResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSourceLocationRequest,
  output: DescribeSourceLocationResponse,
  errors: [],
}));
/**
 * Updates a source location. A source location is a container for sources. For more information about source locations, see Working with source locations in the *MediaTailor User Guide*.
 */
export const updateSourceLocation: (
  input: UpdateSourceLocationRequest,
) => Effect.Effect<
  UpdateSourceLocationResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSourceLocationRequest,
  output: UpdateSourceLocationResponse,
  errors: [],
}));
/**
 * The VOD source configuration parameters.
 */
export const createVodSource: (
  input: CreateVodSourceRequest,
) => Effect.Effect<
  CreateVodSourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVodSourceRequest,
  output: CreateVodSourceResponse,
  errors: [],
}));
/**
 * Updates a VOD source's configuration.
 */
export const updateVodSource: (
  input: UpdateVodSourceRequest,
) => Effect.Effect<
  UpdateVodSourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVodSourceRequest,
  output: UpdateVodSourceResponse,
  errors: [],
}));
/**
 * A list of tags that are associated with this resource. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  BadRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [BadRequestException],
}));
/**
 * The resource to tag. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  BadRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [BadRequestException],
}));
/**
 * Defines where AWS Elemental MediaTailor sends logs for the playback configuration.
 */
export const configureLogsForPlaybackConfiguration: (
  input: ConfigureLogsForPlaybackConfigurationRequest,
) => Effect.Effect<
  ConfigureLogsForPlaybackConfigurationResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ConfigureLogsForPlaybackConfigurationRequest,
  output: ConfigureLogsForPlaybackConfigurationResponse,
  errors: [],
}));
/**
 * Lists the alerts that are associated with a MediaTailor channel assembly resource.
 */
export const listAlerts: {
  (
    input: ListAlertsRequest,
  ): Effect.Effect<
    ListAlertsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAlertsRequest,
  ) => Stream.Stream<
    ListAlertsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAlertsRequest,
  ) => Stream.Stream<
    Alert,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAlertsRequest,
  output: ListAlertsResponse,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Items",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Describes a channel. For information about MediaTailor channels, see Working with channels in the *MediaTailor User Guide*.
 */
export const describeChannel: (
  input: DescribeChannelRequest,
) => Effect.Effect<
  DescribeChannelResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeChannelRequest,
  output: DescribeChannelResponse,
  errors: [],
}));
/**
 * Retrieves information about the channels that are associated with the current AWS account.
 */
export const listChannels: {
  (
    input: ListChannelsRequest,
  ): Effect.Effect<
    ListChannelsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChannelsRequest,
  ) => Stream.Stream<
    ListChannelsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChannelsRequest,
  ) => Stream.Stream<
    Channel,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChannelsRequest,
  output: ListChannelsResponse,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Items",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * The live source configuration.
 */
export const createLiveSource: (
  input: CreateLiveSourceRequest,
) => Effect.Effect<
  CreateLiveSourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLiveSourceRequest,
  output: CreateLiveSourceResponse,
  errors: [],
}));
/**
 * Lists the live sources contained in a source location. A source represents a piece of content.
 */
export const listLiveSources: {
  (
    input: ListLiveSourcesRequest,
  ): Effect.Effect<
    ListLiveSourcesResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLiveSourcesRequest,
  ) => Stream.Stream<
    ListLiveSourcesResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLiveSourcesRequest,
  ) => Stream.Stream<
    LiveSource,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLiveSourcesRequest,
  output: ListLiveSourcesResponse,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Items",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves a playback configuration. For information about MediaTailor configurations, see Working with configurations in AWS Elemental MediaTailor.
 */
export const getPlaybackConfiguration: (
  input: GetPlaybackConfigurationRequest,
) => Effect.Effect<
  GetPlaybackConfigurationResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPlaybackConfigurationRequest,
  output: GetPlaybackConfigurationResponse,
  errors: [],
}));
/**
 * Retrieves existing playback configurations. For information about MediaTailor configurations, see Working with Configurations in AWS Elemental MediaTailor.
 */
export const listPlaybackConfigurations: {
  (
    input: ListPlaybackConfigurationsRequest,
  ): Effect.Effect<
    ListPlaybackConfigurationsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPlaybackConfigurationsRequest,
  ) => Stream.Stream<
    ListPlaybackConfigurationsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPlaybackConfigurationsRequest,
  ) => Stream.Stream<
    PlaybackConfiguration,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPlaybackConfigurationsRequest,
  output: ListPlaybackConfigurationsResponse,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Items",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the prefetch schedules for a playback configuration.
 */
export const listPrefetchSchedules: {
  (
    input: ListPrefetchSchedulesRequest,
  ): Effect.Effect<
    ListPrefetchSchedulesResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPrefetchSchedulesRequest,
  ) => Stream.Stream<
    ListPrefetchSchedulesResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPrefetchSchedulesRequest,
  ) => Stream.Stream<
    PrefetchSchedule,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPrefetchSchedulesRequest,
  output: ListPrefetchSchedulesResponse,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Items",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the source locations for a channel. A source location defines the host server URL, and contains a list of sources.
 */
export const listSourceLocations: {
  (
    input: ListSourceLocationsRequest,
  ): Effect.Effect<
    ListSourceLocationsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSourceLocationsRequest,
  ) => Stream.Stream<
    ListSourceLocationsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSourceLocationsRequest,
  ) => Stream.Stream<
    SourceLocation,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSourceLocationsRequest,
  output: ListSourceLocationsResponse,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Items",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Provides details about a specific video on demand (VOD) source in a specific source location.
 */
export const describeVodSource: (
  input: DescribeVodSourceRequest,
) => Effect.Effect<
  DescribeVodSourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeVodSourceRequest,
  output: DescribeVodSourceResponse,
  errors: [],
}));
/**
 * Lists the VOD sources contained in a source location. A source represents a piece of content.
 */
export const listVodSources: {
  (
    input: ListVodSourcesRequest,
  ): Effect.Effect<
    ListVodSourcesResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListVodSourcesRequest,
  ) => Stream.Stream<
    ListVodSourcesResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListVodSourcesRequest,
  ) => Stream.Stream<
    VodSource,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListVodSourcesRequest,
  output: ListVodSourcesResponse,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Items",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates a channel. For information about MediaTailor channels, see Working with channels in the *MediaTailor User Guide*.
 */
export const createChannel: (
  input: CreateChannelRequest,
) => Effect.Effect<
  CreateChannelResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChannelRequest,
  output: CreateChannelResponse,
  errors: [],
}));
/**
 * Retrieves information about your channel's schedule.
 */
export const getChannelSchedule: {
  (
    input: GetChannelScheduleRequest,
  ): Effect.Effect<
    GetChannelScheduleResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetChannelScheduleRequest,
  ) => Stream.Stream<
    GetChannelScheduleResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetChannelScheduleRequest,
  ) => Stream.Stream<
    ScheduleEntry,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetChannelScheduleRequest,
  output: GetChannelScheduleResponse,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Items",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Updates a program within a channel.
 */
export const updateProgram: (
  input: UpdateProgramRequest,
) => Effect.Effect<
  UpdateProgramResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProgramRequest,
  output: UpdateProgramResponse,
  errors: [],
}));
/**
 * Creates a prefetch schedule for a playback configuration. A prefetch schedule allows you to tell MediaTailor to fetch and prepare certain ads before an ad break happens. For more information about ad prefetching, see Using ad prefetching in the *MediaTailor User Guide*.
 */
export const createPrefetchSchedule: (
  input: CreatePrefetchScheduleRequest,
) => Effect.Effect<
  CreatePrefetchScheduleResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePrefetchScheduleRequest,
  output: CreatePrefetchScheduleResponse,
  errors: [],
}));
/**
 * Creates a source location. A source location is a container for sources. For more information about source locations, see Working with source locations in the *MediaTailor User Guide*.
 */
export const createSourceLocation: (
  input: CreateSourceLocationRequest,
) => Effect.Effect<
  CreateSourceLocationResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSourceLocationRequest,
  output: CreateSourceLocationResponse,
  errors: [],
}));
/**
 * Creates a program within a channel. For information about programs, see Working with programs in the *MediaTailor User Guide*.
 */
export const createProgram: (
  input: CreateProgramRequest,
) => Effect.Effect<
  CreateProgramResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProgramRequest,
  output: CreateProgramResponse,
  errors: [],
}));
/**
 * Creates a playback configuration. For information about MediaTailor configurations, see Working with configurations in AWS Elemental MediaTailor.
 */
export const putPlaybackConfiguration: (
  input: PutPlaybackConfigurationRequest,
) => Effect.Effect<
  PutPlaybackConfigurationResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutPlaybackConfigurationRequest,
  output: PutPlaybackConfigurationResponse,
  errors: [],
}));
