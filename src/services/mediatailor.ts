import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "MediaTailor",
  serviceShapeName: "MediaTailor",
});
const auth = T.AwsAuthSigv4({ name: "mediatailor" });
const ver = T.ServiceVersion("2018-04-23");
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
                        url: "https://api.mediatailor-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://api.mediatailor-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://api.mediatailor.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://api.mediatailor.{Region}.{PartitionResult#dnsSuffix}",
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
export const __listOfLoggingStrategies = S.Array(S.String);
export const __listOf__string = S.Array(S.String);
export const Audiences = S.Array(S.String);
export const LogTypes = S.Array(S.String);
export class ListAlertsRequest extends S.Class<ListAlertsRequest>(
  "ListAlertsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    ResourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/alerts" }),
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
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: __listOf__string.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
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
export class DescribeChannelRequest extends S.Class<DescribeChannelRequest>(
  "DescribeChannelRequest",
)(
  { ChannelName: S.String.pipe(T.HttpLabel("ChannelName")) },
  T.all(
    T.Http({ method: "GET", uri: "/channel/{ChannelName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SlateSource extends S.Class<SlateSource>("SlateSource")({
  SourceLocationName: S.optional(S.String),
  VodSourceName: S.optional(S.String),
}) {}
export class DashPlaylistSettings extends S.Class<DashPlaylistSettings>(
  "DashPlaylistSettings",
)({
  ManifestWindowSeconds: S.optional(S.Number),
  MinBufferTimeSeconds: S.optional(S.Number),
  MinUpdatePeriodSeconds: S.optional(S.Number),
  SuggestedPresentationDelaySeconds: S.optional(S.Number),
}) {}
export const adMarkupTypes = S.Array(S.String);
export class HlsPlaylistSettings extends S.Class<HlsPlaylistSettings>(
  "HlsPlaylistSettings",
)({
  ManifestWindowSeconds: S.optional(S.Number),
  AdMarkupType: S.optional(adMarkupTypes),
}) {}
export class RequestOutputItem extends S.Class<RequestOutputItem>(
  "RequestOutputItem",
)({
  DashPlaylistSettings: S.optional(DashPlaylistSettings),
  HlsPlaylistSettings: S.optional(HlsPlaylistSettings),
  ManifestName: S.String,
  SourceGroup: S.String,
}) {}
export const RequestOutputs = S.Array(RequestOutputItem);
export class TimeShiftConfiguration extends S.Class<TimeShiftConfiguration>(
  "TimeShiftConfiguration",
)({ MaxTimeDelaySeconds: S.Number }) {}
export class UpdateChannelRequest extends S.Class<UpdateChannelRequest>(
  "UpdateChannelRequest",
)(
  {
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    FillerSlate: S.optional(SlateSource),
    Outputs: RequestOutputs,
    TimeShiftConfiguration: S.optional(TimeShiftConfiguration),
    Audiences: S.optional(Audiences),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/channel/{ChannelName}" }),
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
  { ChannelName: S.String.pipe(T.HttpLabel("ChannelName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/channel/{ChannelName}" }),
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
export class ListChannelsRequest extends S.Class<ListChannelsRequest>(
  "ListChannelsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/channels" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ConfigureLogsForChannelRequest extends S.Class<ConfigureLogsForChannelRequest>(
  "ConfigureLogsForChannelRequest",
)(
  { ChannelName: S.String, LogTypes: LogTypes },
  T.all(
    T.Http({ method: "PUT", uri: "/configureLogs/channel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetChannelScheduleRequest extends S.Class<GetChannelScheduleRequest>(
  "GetChannelScheduleRequest",
)(
  {
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    DurationMinutes: S.optional(S.String).pipe(T.HttpQuery("durationMinutes")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Audience: S.optional(S.String).pipe(T.HttpQuery("audience")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/channel/{ChannelName}/schedule" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartChannelRequest extends S.Class<StartChannelRequest>(
  "StartChannelRequest",
)(
  { ChannelName: S.String.pipe(T.HttpLabel("ChannelName")) },
  T.all(
    T.Http({ method: "PUT", uri: "/channel/{ChannelName}/start" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartChannelResponse extends S.Class<StartChannelResponse>(
  "StartChannelResponse",
)({}) {}
export class StopChannelRequest extends S.Class<StopChannelRequest>(
  "StopChannelRequest",
)(
  { ChannelName: S.String.pipe(T.HttpLabel("ChannelName")) },
  T.all(
    T.Http({ method: "PUT", uri: "/channel/{ChannelName}/stop" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopChannelResponse extends S.Class<StopChannelResponse>(
  "StopChannelResponse",
)({}) {}
export class PutChannelPolicyRequest extends S.Class<PutChannelPolicyRequest>(
  "PutChannelPolicyRequest",
)(
  { ChannelName: S.String.pipe(T.HttpLabel("ChannelName")), Policy: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/channel/{ChannelName}/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutChannelPolicyResponse extends S.Class<PutChannelPolicyResponse>(
  "PutChannelPolicyResponse",
)({}) {}
export class GetChannelPolicyRequest extends S.Class<GetChannelPolicyRequest>(
  "GetChannelPolicyRequest",
)(
  { ChannelName: S.String.pipe(T.HttpLabel("ChannelName")) },
  T.all(
    T.Http({ method: "GET", uri: "/channel/{ChannelName}/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteChannelPolicyRequest extends S.Class<DeleteChannelPolicyRequest>(
  "DeleteChannelPolicyRequest",
)(
  { ChannelName: S.String.pipe(T.HttpLabel("ChannelName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/channel/{ChannelName}/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteChannelPolicyResponse extends S.Class<DeleteChannelPolicyResponse>(
  "DeleteChannelPolicyResponse",
)({}) {}
export class DescribeProgramRequest extends S.Class<DescribeProgramRequest>(
  "DescribeProgramRequest",
)(
  {
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    ProgramName: S.String.pipe(T.HttpLabel("ProgramName")),
  },
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
) {}
export class DeleteProgramRequest extends S.Class<DeleteProgramRequest>(
  "DeleteProgramRequest",
)(
  {
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    ProgramName: S.String.pipe(T.HttpLabel("ProgramName")),
  },
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
) {}
export class DeleteProgramResponse extends S.Class<DeleteProgramResponse>(
  "DeleteProgramResponse",
)({}) {}
export class DescribeLiveSourceRequest extends S.Class<DescribeLiveSourceRequest>(
  "DescribeLiveSourceRequest",
)(
  {
    LiveSourceName: S.String.pipe(T.HttpLabel("LiveSourceName")),
    SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")),
  },
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
) {}
export class HttpPackageConfiguration extends S.Class<HttpPackageConfiguration>(
  "HttpPackageConfiguration",
)({ Path: S.String, SourceGroup: S.String, Type: S.String }) {}
export const HttpPackageConfigurations = S.Array(HttpPackageConfiguration);
export class UpdateLiveSourceRequest extends S.Class<UpdateLiveSourceRequest>(
  "UpdateLiveSourceRequest",
)(
  {
    HttpPackageConfigurations: HttpPackageConfigurations,
    LiveSourceName: S.String.pipe(T.HttpLabel("LiveSourceName")),
    SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")),
  },
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
) {}
export class DeleteLiveSourceRequest extends S.Class<DeleteLiveSourceRequest>(
  "DeleteLiveSourceRequest",
)(
  {
    LiveSourceName: S.String.pipe(T.HttpLabel("LiveSourceName")),
    SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")),
  },
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
) {}
export class DeleteLiveSourceResponse extends S.Class<DeleteLiveSourceResponse>(
  "DeleteLiveSourceResponse",
)({}) {}
export class ListLiveSourcesRequest extends S.Class<ListLiveSourcesRequest>(
  "ListLiveSourcesRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")),
  },
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
) {}
export class GetPlaybackConfigurationRequest extends S.Class<GetPlaybackConfigurationRequest>(
  "GetPlaybackConfigurationRequest",
)(
  { Name: S.String.pipe(T.HttpLabel("Name")) },
  T.all(
    T.Http({ method: "GET", uri: "/playbackConfiguration/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePlaybackConfigurationRequest extends S.Class<DeletePlaybackConfigurationRequest>(
  "DeletePlaybackConfigurationRequest",
)(
  { Name: S.String.pipe(T.HttpLabel("Name")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/playbackConfiguration/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePlaybackConfigurationResponse extends S.Class<DeletePlaybackConfigurationResponse>(
  "DeletePlaybackConfigurationResponse",
)({}) {}
export class ListPlaybackConfigurationsRequest extends S.Class<ListPlaybackConfigurationsRequest>(
  "ListPlaybackConfigurationsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/playbackConfigurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPrefetchScheduleRequest extends S.Class<GetPrefetchScheduleRequest>(
  "GetPrefetchScheduleRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel("Name")),
    PlaybackConfigurationName: S.String.pipe(
      T.HttpLabel("PlaybackConfigurationName"),
    ),
  },
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
) {}
export class DeletePrefetchScheduleRequest extends S.Class<DeletePrefetchScheduleRequest>(
  "DeletePrefetchScheduleRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel("Name")),
    PlaybackConfigurationName: S.String.pipe(
      T.HttpLabel("PlaybackConfigurationName"),
    ),
  },
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
) {}
export class DeletePrefetchScheduleResponse extends S.Class<DeletePrefetchScheduleResponse>(
  "DeletePrefetchScheduleResponse",
)({}) {}
export class ListPrefetchSchedulesRequest extends S.Class<ListPrefetchSchedulesRequest>(
  "ListPrefetchSchedulesRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    PlaybackConfigurationName: S.String.pipe(
      T.HttpLabel("PlaybackConfigurationName"),
    ),
    ScheduleType: S.optional(S.String),
    StreamId: S.optional(S.String),
  },
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
) {}
export class DescribeSourceLocationRequest extends S.Class<DescribeSourceLocationRequest>(
  "DescribeSourceLocationRequest",
)(
  { SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")) },
  T.all(
    T.Http({ method: "GET", uri: "/sourceLocation/{SourceLocationName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SecretsManagerAccessTokenConfiguration extends S.Class<SecretsManagerAccessTokenConfiguration>(
  "SecretsManagerAccessTokenConfiguration",
)({
  HeaderName: S.optional(S.String),
  SecretArn: S.optional(S.String),
  SecretStringKey: S.optional(S.String),
}) {}
export class AccessConfiguration extends S.Class<AccessConfiguration>(
  "AccessConfiguration",
)({
  AccessType: S.optional(S.String),
  SecretsManagerAccessTokenConfiguration: S.optional(
    SecretsManagerAccessTokenConfiguration,
  ),
}) {}
export class DefaultSegmentDeliveryConfiguration extends S.Class<DefaultSegmentDeliveryConfiguration>(
  "DefaultSegmentDeliveryConfiguration",
)({ BaseUrl: S.optional(S.String) }) {}
export class HttpConfiguration extends S.Class<HttpConfiguration>(
  "HttpConfiguration",
)({ BaseUrl: S.String }) {}
export class SegmentDeliveryConfiguration extends S.Class<SegmentDeliveryConfiguration>(
  "SegmentDeliveryConfiguration",
)({ BaseUrl: S.optional(S.String), Name: S.optional(S.String) }) {}
export const __listOfSegmentDeliveryConfiguration = S.Array(
  SegmentDeliveryConfiguration,
);
export class UpdateSourceLocationRequest extends S.Class<UpdateSourceLocationRequest>(
  "UpdateSourceLocationRequest",
)(
  {
    AccessConfiguration: S.optional(AccessConfiguration),
    DefaultSegmentDeliveryConfiguration: S.optional(
      DefaultSegmentDeliveryConfiguration,
    ),
    HttpConfiguration: HttpConfiguration,
    SegmentDeliveryConfigurations: S.optional(
      __listOfSegmentDeliveryConfiguration,
    ),
    SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/sourceLocation/{SourceLocationName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSourceLocationRequest extends S.Class<DeleteSourceLocationRequest>(
  "DeleteSourceLocationRequest",
)(
  { SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/sourceLocation/{SourceLocationName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSourceLocationResponse extends S.Class<DeleteSourceLocationResponse>(
  "DeleteSourceLocationResponse",
)({}) {}
export class ListSourceLocationsRequest extends S.Class<ListSourceLocationsRequest>(
  "ListSourceLocationsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/sourceLocations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const __mapOf__string = S.Record({ key: S.String, value: S.String });
export class CreateVodSourceRequest extends S.Class<CreateVodSourceRequest>(
  "CreateVodSourceRequest",
)(
  {
    HttpPackageConfigurations: HttpPackageConfigurations,
    SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    VodSourceName: S.String.pipe(T.HttpLabel("VodSourceName")),
  },
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
) {}
export class DescribeVodSourceRequest extends S.Class<DescribeVodSourceRequest>(
  "DescribeVodSourceRequest",
)(
  {
    SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")),
    VodSourceName: S.String.pipe(T.HttpLabel("VodSourceName")),
  },
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
) {}
export class UpdateVodSourceRequest extends S.Class<UpdateVodSourceRequest>(
  "UpdateVodSourceRequest",
)(
  {
    HttpPackageConfigurations: HttpPackageConfigurations,
    SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")),
    VodSourceName: S.String.pipe(T.HttpLabel("VodSourceName")),
  },
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
) {}
export class DeleteVodSourceRequest extends S.Class<DeleteVodSourceRequest>(
  "DeleteVodSourceRequest",
)(
  {
    SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")),
    VodSourceName: S.String.pipe(T.HttpLabel("VodSourceName")),
  },
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
) {}
export class DeleteVodSourceResponse extends S.Class<DeleteVodSourceResponse>(
  "DeleteVodSourceResponse",
)({}) {}
export class ListVodSourcesRequest extends S.Class<ListVodSourcesRequest>(
  "ListVodSourcesRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")),
  },
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
) {}
export const __adsInteractionPublishOptInEventTypesList = S.Array(S.String);
export const __adsInteractionExcludeEventTypesList = S.Array(S.String);
export const __manifestServiceExcludeEventTypesList = S.Array(S.String);
export class AdsInteractionLog extends S.Class<AdsInteractionLog>(
  "AdsInteractionLog",
)({
  PublishOptInEventTypes: S.optional(
    __adsInteractionPublishOptInEventTypesList,
  ),
  ExcludeEventTypes: S.optional(__adsInteractionExcludeEventTypesList),
}) {}
export class ManifestServiceInteractionLog extends S.Class<ManifestServiceInteractionLog>(
  "ManifestServiceInteractionLog",
)({ ExcludeEventTypes: S.optional(__manifestServiceExcludeEventTypesList) }) {}
export class AvailSuppression extends S.Class<AvailSuppression>(
  "AvailSuppression",
)({
  Mode: S.optional(S.String),
  Value: S.optional(S.String),
  FillPolicy: S.optional(S.String),
}) {}
export class Bumper extends S.Class<Bumper>("Bumper")({
  EndUrl: S.optional(S.String),
  StartUrl: S.optional(S.String),
}) {}
export class CdnConfiguration extends S.Class<CdnConfiguration>(
  "CdnConfiguration",
)({
  AdSegmentUrlPrefix: S.optional(S.String),
  ContentSegmentUrlPrefix: S.optional(S.String),
}) {}
export const ConfigurationAliasesRequest = S.Record({
  key: S.String,
  value: __mapOf__string,
});
export class DashConfigurationForPut extends S.Class<DashConfigurationForPut>(
  "DashConfigurationForPut",
)({
  MpdLocation: S.optional(S.String),
  OriginManifestType: S.optional(S.String),
}) {}
export class LivePreRollConfiguration extends S.Class<LivePreRollConfiguration>(
  "LivePreRollConfiguration",
)({
  AdDecisionServerUrl: S.optional(S.String),
  MaxDurationSeconds: S.optional(S.Number),
}) {}
export class AdConditioningConfiguration extends S.Class<AdConditioningConfiguration>(
  "AdConditioningConfiguration",
)({ StreamingMediaFileConditioning: S.String }) {}
export class ConfigureLogsForPlaybackConfigurationRequest extends S.Class<ConfigureLogsForPlaybackConfigurationRequest>(
  "ConfigureLogsForPlaybackConfigurationRequest",
)(
  {
    PercentEnabled: S.Number,
    PlaybackConfigurationName: S.String,
    EnabledLoggingStrategies: S.optional(__listOfLoggingStrategies),
    AdsInteractionLog: S.optional(AdsInteractionLog),
    ManifestServiceInteractionLog: S.optional(ManifestServiceInteractionLog),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/configureLogs/playbackConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: __mapOf__string.pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
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
export class ResponseOutputItem extends S.Class<ResponseOutputItem>(
  "ResponseOutputItem",
)({
  DashPlaylistSettings: S.optional(DashPlaylistSettings),
  HlsPlaylistSettings: S.optional(HlsPlaylistSettings),
  ManifestName: S.String,
  PlaybackUrl: S.String,
  SourceGroup: S.String,
}) {}
export const ResponseOutputs = S.Array(ResponseOutputItem);
export class UpdateChannelResponse extends S.Class<UpdateChannelResponse>(
  "UpdateChannelResponse",
)({
  Arn: S.optional(S.String),
  ChannelName: S.optional(S.String),
  ChannelState: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FillerSlate: S.optional(SlateSource),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Outputs: S.optional(ResponseOutputs),
  PlaybackMode: S.optional(S.String),
  Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  Tier: S.optional(S.String),
  TimeShiftConfiguration: S.optional(TimeShiftConfiguration),
  Audiences: S.optional(Audiences),
}) {}
export class ConfigureLogsForChannelResponse extends S.Class<ConfigureLogsForChannelResponse>(
  "ConfigureLogsForChannelResponse",
)({ ChannelName: S.optional(S.String), LogTypes: S.optional(LogTypes) }) {}
export class GetChannelPolicyResponse extends S.Class<GetChannelPolicyResponse>(
  "GetChannelPolicyResponse",
)({ Policy: S.optional(S.String) }) {}
export class SpliceInsertMessage extends S.Class<SpliceInsertMessage>(
  "SpliceInsertMessage",
)({
  AvailNum: S.optional(S.Number),
  AvailsExpected: S.optional(S.Number),
  SpliceEventId: S.optional(S.Number),
  UniqueProgramId: S.optional(S.Number),
}) {}
export class SegmentationDescriptor extends S.Class<SegmentationDescriptor>(
  "SegmentationDescriptor",
)({
  SegmentationEventId: S.optional(S.Number),
  SegmentationUpidType: S.optional(S.Number),
  SegmentationUpid: S.optional(S.String),
  SegmentationTypeId: S.optional(S.Number),
  SegmentNum: S.optional(S.Number),
  SegmentsExpected: S.optional(S.Number),
  SubSegmentNum: S.optional(S.Number),
  SubSegmentsExpected: S.optional(S.Number),
}) {}
export const SegmentationDescriptorList = S.Array(SegmentationDescriptor);
export class TimeSignalMessage extends S.Class<TimeSignalMessage>(
  "TimeSignalMessage",
)({ SegmentationDescriptors: S.optional(SegmentationDescriptorList) }) {}
export class KeyValuePair extends S.Class<KeyValuePair>("KeyValuePair")({
  Key: S.String,
  Value: S.String,
}) {}
export const AdBreakMetadataList = S.Array(KeyValuePair);
export class AdBreak extends S.Class<AdBreak>("AdBreak")({
  MessageType: S.optional(S.String),
  OffsetMillis: S.Number,
  Slate: S.optional(SlateSource),
  SpliceInsertMessage: S.optional(SpliceInsertMessage),
  TimeSignalMessage: S.optional(TimeSignalMessage),
  AdBreakMetadata: S.optional(AdBreakMetadataList),
}) {}
export const __listOfAdBreak = S.Array(AdBreak);
export class ClipRange extends S.Class<ClipRange>("ClipRange")({
  EndOffsetMillis: S.optional(S.Number),
  StartOffsetMillis: S.optional(S.Number),
}) {}
export class AlternateMedia extends S.Class<AlternateMedia>("AlternateMedia")({
  SourceLocationName: S.optional(S.String),
  LiveSourceName: S.optional(S.String),
  VodSourceName: S.optional(S.String),
  ClipRange: S.optional(ClipRange),
  ScheduledStartTimeMillis: S.optional(S.Number),
  AdBreaks: S.optional(__listOfAdBreak),
  DurationMillis: S.optional(S.Number),
}) {}
export const __listOfAlternateMedia = S.Array(AlternateMedia);
export class AudienceMedia extends S.Class<AudienceMedia>("AudienceMedia")({
  Audience: S.optional(S.String),
  AlternateMedia: S.optional(__listOfAlternateMedia),
}) {}
export const __listOfAudienceMedia = S.Array(AudienceMedia);
export class DescribeProgramResponse extends S.Class<DescribeProgramResponse>(
  "DescribeProgramResponse",
)({
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
}) {}
export class CreateLiveSourceRequest extends S.Class<CreateLiveSourceRequest>(
  "CreateLiveSourceRequest",
)(
  {
    HttpPackageConfigurations: HttpPackageConfigurations,
    LiveSourceName: S.String.pipe(T.HttpLabel("LiveSourceName")),
    SourceLocationName: S.String.pipe(T.HttpLabel("SourceLocationName")),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  },
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
) {}
export class DescribeLiveSourceResponse extends S.Class<DescribeLiveSourceResponse>(
  "DescribeLiveSourceResponse",
)({
  Arn: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  HttpPackageConfigurations: S.optional(HttpPackageConfigurations),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LiveSourceName: S.optional(S.String),
  SourceLocationName: S.optional(S.String),
  Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
}) {}
export class UpdateLiveSourceResponse extends S.Class<UpdateLiveSourceResponse>(
  "UpdateLiveSourceResponse",
)({
  Arn: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  HttpPackageConfigurations: S.optional(HttpPackageConfigurations),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LiveSourceName: S.optional(S.String),
  SourceLocationName: S.optional(S.String),
  Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
}) {}
export class AvailMatchingCriteria extends S.Class<AvailMatchingCriteria>(
  "AvailMatchingCriteria",
)({ DynamicVariable: S.String, Operator: S.String }) {}
export const __listOfAvailMatchingCriteria = S.Array(AvailMatchingCriteria);
export class PrefetchConsumption extends S.Class<PrefetchConsumption>(
  "PrefetchConsumption",
)({
  AvailMatchingCriteria: S.optional(__listOfAvailMatchingCriteria),
  EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class TrafficShapingRetrievalWindow extends S.Class<TrafficShapingRetrievalWindow>(
  "TrafficShapingRetrievalWindow",
)({ RetrievalWindowDurationSeconds: S.optional(S.Number) }) {}
export class TrafficShapingTpsConfiguration extends S.Class<TrafficShapingTpsConfiguration>(
  "TrafficShapingTpsConfiguration",
)({
  PeakTps: S.optional(S.Number),
  PeakConcurrentUsers: S.optional(S.Number),
}) {}
export class PrefetchRetrieval extends S.Class<PrefetchRetrieval>(
  "PrefetchRetrieval",
)({
  DynamicVariables: S.optional(__mapOf__string),
  EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TrafficShapingType: S.optional(S.String),
  TrafficShapingRetrievalWindow: S.optional(TrafficShapingRetrievalWindow),
  TrafficShapingTpsConfiguration: S.optional(TrafficShapingTpsConfiguration),
}) {}
export class RecurringConsumption extends S.Class<RecurringConsumption>(
  "RecurringConsumption",
)({
  RetrievedAdExpirationSeconds: S.optional(S.Number),
  AvailMatchingCriteria: S.optional(__listOfAvailMatchingCriteria),
}) {}
export class RecurringRetrieval extends S.Class<RecurringRetrieval>(
  "RecurringRetrieval",
)({
  DynamicVariables: S.optional(__mapOf__string),
  DelayAfterAvailEndSeconds: S.optional(S.Number),
  TrafficShapingType: S.optional(S.String),
  TrafficShapingRetrievalWindow: S.optional(TrafficShapingRetrievalWindow),
  TrafficShapingTpsConfiguration: S.optional(TrafficShapingTpsConfiguration),
}) {}
export class RecurringPrefetchConfiguration extends S.Class<RecurringPrefetchConfiguration>(
  "RecurringPrefetchConfiguration",
)({
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  RecurringConsumption: RecurringConsumption,
  RecurringRetrieval: RecurringRetrieval,
}) {}
export class GetPrefetchScheduleResponse extends S.Class<GetPrefetchScheduleResponse>(
  "GetPrefetchScheduleResponse",
)({
  Arn: S.optional(S.String),
  Consumption: S.optional(PrefetchConsumption),
  Name: S.optional(S.String),
  PlaybackConfigurationName: S.optional(S.String),
  Retrieval: S.optional(PrefetchRetrieval),
  ScheduleType: S.optional(S.String),
  RecurringPrefetchConfiguration: S.optional(RecurringPrefetchConfiguration),
  StreamId: S.optional(S.String),
}) {}
export class DescribeSourceLocationResponse extends S.Class<DescribeSourceLocationResponse>(
  "DescribeSourceLocationResponse",
)({
  AccessConfiguration: S.optional(AccessConfiguration),
  Arn: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DefaultSegmentDeliveryConfiguration: S.optional(
    DefaultSegmentDeliveryConfiguration,
  ),
  HttpConfiguration: S.optional(HttpConfiguration),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SegmentDeliveryConfigurations: S.optional(
    __listOfSegmentDeliveryConfiguration,
  ),
  SourceLocationName: S.optional(S.String),
  Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
}) {}
export class UpdateSourceLocationResponse extends S.Class<UpdateSourceLocationResponse>(
  "UpdateSourceLocationResponse",
)({
  AccessConfiguration: S.optional(AccessConfiguration),
  Arn: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DefaultSegmentDeliveryConfiguration: S.optional(
    DefaultSegmentDeliveryConfiguration,
  ),
  HttpConfiguration: S.optional(HttpConfiguration),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SegmentDeliveryConfigurations: S.optional(
    __listOfSegmentDeliveryConfiguration,
  ),
  SourceLocationName: S.optional(S.String),
  Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
}) {}
export class CreateVodSourceResponse extends S.Class<CreateVodSourceResponse>(
  "CreateVodSourceResponse",
)({
  Arn: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  HttpPackageConfigurations: S.optional(HttpPackageConfigurations),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SourceLocationName: S.optional(S.String),
  Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  VodSourceName: S.optional(S.String),
}) {}
export class UpdateVodSourceResponse extends S.Class<UpdateVodSourceResponse>(
  "UpdateVodSourceResponse",
)({
  Arn: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  HttpPackageConfigurations: S.optional(HttpPackageConfigurations),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SourceLocationName: S.optional(S.String),
  Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  VodSourceName: S.optional(S.String),
}) {}
export class Transition extends S.Class<Transition>("Transition")({
  DurationMillis: S.optional(S.Number),
  RelativePosition: S.String,
  RelativeProgram: S.optional(S.String),
  ScheduledStartTimeMillis: S.optional(S.Number),
  Type: S.String,
}) {}
export class UpdateProgramTransition extends S.Class<UpdateProgramTransition>(
  "UpdateProgramTransition",
)({
  ScheduledStartTimeMillis: S.optional(S.Number),
  DurationMillis: S.optional(S.Number),
}) {}
export class AdMarkerPassthrough extends S.Class<AdMarkerPassthrough>(
  "AdMarkerPassthrough",
)({ Enabled: S.optional(S.Boolean) }) {}
export class Alert extends S.Class<Alert>("Alert")({
  AlertCode: S.String,
  AlertMessage: S.String,
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  RelatedResourceArns: __listOf__string,
  ResourceArn: S.String,
  Category: S.optional(S.String),
}) {}
export const __listOfAlert = S.Array(Alert);
export class LogConfigurationForChannel extends S.Class<LogConfigurationForChannel>(
  "LogConfigurationForChannel",
)({ LogTypes: S.optional(LogTypes) }) {}
export class Channel extends S.Class<Channel>("Channel")({
  Arn: S.String,
  ChannelName: S.String,
  ChannelState: S.String,
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FillerSlate: S.optional(SlateSource),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Outputs: ResponseOutputs,
  PlaybackMode: S.String,
  Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  Tier: S.String,
  LogConfiguration: LogConfigurationForChannel,
  Audiences: S.optional(Audiences),
}) {}
export const __listOfChannel = S.Array(Channel);
export class ScheduleConfiguration extends S.Class<ScheduleConfiguration>(
  "ScheduleConfiguration",
)({ Transition: Transition, ClipRange: S.optional(ClipRange) }) {}
export class UpdateProgramScheduleConfiguration extends S.Class<UpdateProgramScheduleConfiguration>(
  "UpdateProgramScheduleConfiguration",
)({
  Transition: S.optional(UpdateProgramTransition),
  ClipRange: S.optional(ClipRange),
}) {}
export class LiveSource extends S.Class<LiveSource>("LiveSource")({
  Arn: S.String,
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  HttpPackageConfigurations: HttpPackageConfigurations,
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LiveSourceName: S.String,
  SourceLocationName: S.String,
  Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
}) {}
export const __listOfLiveSource = S.Array(LiveSource);
export class ManifestProcessingRules extends S.Class<ManifestProcessingRules>(
  "ManifestProcessingRules",
)({ AdMarkerPassthrough: S.optional(AdMarkerPassthrough) }) {}
export const ConfigurationAliasesResponse = S.Record({
  key: S.String,
  value: __mapOf__string,
});
export class DashConfiguration extends S.Class<DashConfiguration>(
  "DashConfiguration",
)({
  ManifestEndpointPrefix: S.optional(S.String),
  MpdLocation: S.optional(S.String),
  OriginManifestType: S.optional(S.String),
}) {}
export class HlsConfiguration extends S.Class<HlsConfiguration>(
  "HlsConfiguration",
)({ ManifestEndpointPrefix: S.optional(S.String) }) {}
export class LogConfiguration extends S.Class<LogConfiguration>(
  "LogConfiguration",
)({
  PercentEnabled: S.Number,
  EnabledLoggingStrategies: __listOfLoggingStrategies,
  AdsInteractionLog: S.optional(AdsInteractionLog),
  ManifestServiceInteractionLog: S.optional(ManifestServiceInteractionLog),
}) {}
export const StringMap = S.Record({ key: S.String, value: S.String });
export class HttpRequest extends S.Class<HttpRequest>("HttpRequest")({
  Method: S.optional(S.String),
  Body: S.optional(S.String),
  Headers: S.optional(StringMap),
  CompressRequest: S.optional(S.String),
}) {}
export class AdDecisionServerConfiguration extends S.Class<AdDecisionServerConfiguration>(
  "AdDecisionServerConfiguration",
)({ HttpRequest: S.optional(HttpRequest) }) {}
export class PlaybackConfiguration extends S.Class<PlaybackConfiguration>(
  "PlaybackConfiguration",
)({
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
}) {}
export const __listOfPlaybackConfiguration = S.Array(PlaybackConfiguration);
export class PrefetchSchedule extends S.Class<PrefetchSchedule>(
  "PrefetchSchedule",
)({
  Arn: S.String,
  Consumption: S.optional(PrefetchConsumption),
  Name: S.String,
  PlaybackConfigurationName: S.String,
  Retrieval: S.optional(PrefetchRetrieval),
  ScheduleType: S.optional(S.String),
  RecurringPrefetchConfiguration: S.optional(RecurringPrefetchConfiguration),
  StreamId: S.optional(S.String),
}) {}
export const __listOfPrefetchSchedule = S.Array(PrefetchSchedule);
export class SourceLocation extends S.Class<SourceLocation>("SourceLocation")({
  AccessConfiguration: S.optional(AccessConfiguration),
  Arn: S.String,
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DefaultSegmentDeliveryConfiguration: S.optional(
    DefaultSegmentDeliveryConfiguration,
  ),
  HttpConfiguration: HttpConfiguration,
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SegmentDeliveryConfigurations: S.optional(
    __listOfSegmentDeliveryConfiguration,
  ),
  SourceLocationName: S.String,
  Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
}) {}
export const __listOfSourceLocation = S.Array(SourceLocation);
export class AdBreakOpportunity extends S.Class<AdBreakOpportunity>(
  "AdBreakOpportunity",
)({ OffsetMillis: S.Number }) {}
export const AdBreakOpportunities = S.Array(AdBreakOpportunity);
export class VodSource extends S.Class<VodSource>("VodSource")({
  Arn: S.String,
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  HttpPackageConfigurations: HttpPackageConfigurations,
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SourceLocationName: S.String,
  Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  VodSourceName: S.String,
}) {}
export const __listOfVodSource = S.Array(VodSource);
export class ConfigureLogsForPlaybackConfigurationResponse extends S.Class<ConfigureLogsForPlaybackConfigurationResponse>(
  "ConfigureLogsForPlaybackConfigurationResponse",
)({
  PercentEnabled: S.Number,
  PlaybackConfigurationName: S.optional(S.String),
  EnabledLoggingStrategies: S.optional(__listOfLoggingStrategies),
  AdsInteractionLog: S.optional(AdsInteractionLog),
  ManifestServiceInteractionLog: S.optional(ManifestServiceInteractionLog),
}) {}
export class ListAlertsResponse extends S.Class<ListAlertsResponse>(
  "ListAlertsResponse",
)({ Items: S.optional(__listOfAlert), NextToken: S.optional(S.String) }) {}
export class CreateChannelRequest extends S.Class<CreateChannelRequest>(
  "CreateChannelRequest",
)(
  {
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    FillerSlate: S.optional(SlateSource),
    Outputs: RequestOutputs,
    PlaybackMode: S.String,
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    Tier: S.optional(S.String),
    TimeShiftConfiguration: S.optional(TimeShiftConfiguration),
    Audiences: S.optional(Audiences),
  },
  T.all(
    T.Http({ method: "POST", uri: "/channel/{ChannelName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeChannelResponse extends S.Class<DescribeChannelResponse>(
  "DescribeChannelResponse",
)({
  Arn: S.optional(S.String),
  ChannelName: S.optional(S.String),
  ChannelState: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FillerSlate: S.optional(SlateSource),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Outputs: S.optional(ResponseOutputs),
  PlaybackMode: S.optional(S.String),
  Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  Tier: S.optional(S.String),
  LogConfiguration: LogConfigurationForChannel,
  TimeShiftConfiguration: S.optional(TimeShiftConfiguration),
  Audiences: S.optional(Audiences),
}) {}
export class ListChannelsResponse extends S.Class<ListChannelsResponse>(
  "ListChannelsResponse",
)({ Items: S.optional(__listOfChannel), NextToken: S.optional(S.String) }) {}
export class UpdateProgramRequest extends S.Class<UpdateProgramRequest>(
  "UpdateProgramRequest",
)(
  {
    AdBreaks: S.optional(__listOfAdBreak),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    ProgramName: S.String.pipe(T.HttpLabel("ProgramName")),
    ScheduleConfiguration: UpdateProgramScheduleConfiguration,
    AudienceMedia: S.optional(__listOfAudienceMedia),
  },
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
) {}
export class CreateLiveSourceResponse extends S.Class<CreateLiveSourceResponse>(
  "CreateLiveSourceResponse",
)({
  Arn: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  HttpPackageConfigurations: S.optional(HttpPackageConfigurations),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LiveSourceName: S.optional(S.String),
  SourceLocationName: S.optional(S.String),
  Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
}) {}
export class ListLiveSourcesResponse extends S.Class<ListLiveSourcesResponse>(
  "ListLiveSourcesResponse",
)({ Items: S.optional(__listOfLiveSource), NextToken: S.optional(S.String) }) {}
export class GetPlaybackConfigurationResponse extends S.Class<GetPlaybackConfigurationResponse>(
  "GetPlaybackConfigurationResponse",
)({
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
}) {}
export class ListPlaybackConfigurationsResponse extends S.Class<ListPlaybackConfigurationsResponse>(
  "ListPlaybackConfigurationsResponse",
)({
  Items: S.optional(__listOfPlaybackConfiguration),
  NextToken: S.optional(S.String),
}) {}
export class CreatePrefetchScheduleRequest extends S.Class<CreatePrefetchScheduleRequest>(
  "CreatePrefetchScheduleRequest",
)(
  {
    Consumption: S.optional(PrefetchConsumption),
    Name: S.String.pipe(T.HttpLabel("Name")),
    PlaybackConfigurationName: S.String.pipe(
      T.HttpLabel("PlaybackConfigurationName"),
    ),
    Retrieval: S.optional(PrefetchRetrieval),
    RecurringPrefetchConfiguration: S.optional(RecurringPrefetchConfiguration),
    ScheduleType: S.optional(S.String),
    StreamId: S.optional(S.String),
  },
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
) {}
export class ListPrefetchSchedulesResponse extends S.Class<ListPrefetchSchedulesResponse>(
  "ListPrefetchSchedulesResponse",
)({
  Items: S.optional(__listOfPrefetchSchedule),
  NextToken: S.optional(S.String),
}) {}
export class CreateSourceLocationRequest extends S.Class<CreateSourceLocationRequest>(
  "CreateSourceLocationRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "POST", uri: "/sourceLocation/{SourceLocationName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSourceLocationsResponse extends S.Class<ListSourceLocationsResponse>(
  "ListSourceLocationsResponse",
)({
  Items: S.optional(__listOfSourceLocation),
  NextToken: S.optional(S.String),
}) {}
export class DescribeVodSourceResponse extends S.Class<DescribeVodSourceResponse>(
  "DescribeVodSourceResponse",
)({
  AdBreakOpportunities: S.optional(AdBreakOpportunities),
  Arn: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  HttpPackageConfigurations: S.optional(HttpPackageConfigurations),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SourceLocationName: S.optional(S.String),
  Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  VodSourceName: S.optional(S.String),
}) {}
export class ListVodSourcesResponse extends S.Class<ListVodSourcesResponse>(
  "ListVodSourcesResponse",
)({ Items: S.optional(__listOfVodSource), NextToken: S.optional(S.String) }) {}
export class ScheduleAdBreak extends S.Class<ScheduleAdBreak>(
  "ScheduleAdBreak",
)({
  ApproximateDurationSeconds: S.optional(S.Number),
  ApproximateStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  SourceLocationName: S.optional(S.String),
  VodSourceName: S.optional(S.String),
}) {}
export const __listOfScheduleAdBreak = S.Array(ScheduleAdBreak);
export class ScheduleEntry extends S.Class<ScheduleEntry>("ScheduleEntry")({
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
}) {}
export const __listOfScheduleEntry = S.Array(ScheduleEntry);
export class CreateChannelResponse extends S.Class<CreateChannelResponse>(
  "CreateChannelResponse",
)({
  Arn: S.optional(S.String),
  ChannelName: S.optional(S.String),
  ChannelState: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FillerSlate: S.optional(SlateSource),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Outputs: S.optional(ResponseOutputs),
  PlaybackMode: S.optional(S.String),
  Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  Tier: S.optional(S.String),
  TimeShiftConfiguration: S.optional(TimeShiftConfiguration),
  Audiences: S.optional(Audiences),
}) {}
export class GetChannelScheduleResponse extends S.Class<GetChannelScheduleResponse>(
  "GetChannelScheduleResponse",
)({
  Items: S.optional(__listOfScheduleEntry),
  NextToken: S.optional(S.String),
}) {}
export class CreateProgramRequest extends S.Class<CreateProgramRequest>(
  "CreateProgramRequest",
)(
  {
    AdBreaks: S.optional(__listOfAdBreak),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    LiveSourceName: S.optional(S.String),
    ProgramName: S.String.pipe(T.HttpLabel("ProgramName")),
    ScheduleConfiguration: ScheduleConfiguration,
    SourceLocationName: S.String,
    VodSourceName: S.optional(S.String),
    AudienceMedia: S.optional(__listOfAudienceMedia),
  },
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
) {}
export class UpdateProgramResponse extends S.Class<UpdateProgramResponse>(
  "UpdateProgramResponse",
)({
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
}) {}
export class PutPlaybackConfigurationRequest extends S.Class<PutPlaybackConfigurationRequest>(
  "PutPlaybackConfigurationRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "PUT", uri: "/playbackConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePrefetchScheduleResponse extends S.Class<CreatePrefetchScheduleResponse>(
  "CreatePrefetchScheduleResponse",
)({
  Arn: S.optional(S.String),
  Consumption: S.optional(PrefetchConsumption),
  Name: S.optional(S.String),
  PlaybackConfigurationName: S.optional(S.String),
  Retrieval: S.optional(PrefetchRetrieval),
  RecurringPrefetchConfiguration: S.optional(RecurringPrefetchConfiguration),
  ScheduleType: S.optional(S.String),
  StreamId: S.optional(S.String),
}) {}
export class CreateSourceLocationResponse extends S.Class<CreateSourceLocationResponse>(
  "CreateSourceLocationResponse",
)({
  AccessConfiguration: S.optional(AccessConfiguration),
  Arn: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DefaultSegmentDeliveryConfiguration: S.optional(
    DefaultSegmentDeliveryConfiguration,
  ),
  HttpConfiguration: S.optional(HttpConfiguration),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SegmentDeliveryConfigurations: S.optional(
    __listOfSegmentDeliveryConfiguration,
  ),
  SourceLocationName: S.optional(S.String),
  Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
}) {}
export class CreateProgramResponse extends S.Class<CreateProgramResponse>(
  "CreateProgramResponse",
)({
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
}) {}
export class PutPlaybackConfigurationResponse extends S.Class<PutPlaybackConfigurationResponse>(
  "PutPlaybackConfigurationResponse",
)({
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
}) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes a channel. For information about MediaTailor channels, see Working with channels in the *MediaTailor User Guide*.
 */
export const deleteChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChannelRequest,
  output: DeleteChannelResponse,
  errors: [],
}));
/**
 * Starts a channel. For information about MediaTailor channels, see Working with channels in the *MediaTailor User Guide*.
 */
export const startChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartChannelRequest,
  output: StartChannelResponse,
  errors: [],
}));
/**
 * Stops a channel. For information about MediaTailor channels, see Working with channels in the *MediaTailor User Guide*.
 */
export const stopChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopChannelRequest,
  output: StopChannelResponse,
  errors: [],
}));
/**
 * Creates an IAM policy for the channel. IAM policies are used to control access to your channel.
 */
export const putChannelPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutChannelPolicyRequest,
  output: PutChannelPolicyResponse,
  errors: [],
}));
/**
 * The channel policy to delete.
 */
export const deleteChannelPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChannelPolicyRequest,
  output: DeleteChannelPolicyResponse,
  errors: [],
}));
/**
 * Deletes a program within a channel. For information about programs, see Working with programs in the *MediaTailor User Guide*.
 */
export const deleteProgram = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProgramRequest,
  output: DeleteProgramResponse,
  errors: [],
}));
/**
 * The live source to delete.
 */
export const deleteLiveSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLiveSourceRequest,
  output: DeleteLiveSourceResponse,
  errors: [],
}));
/**
 * Deletes a playback configuration. For information about MediaTailor configurations, see Working with configurations in AWS Elemental MediaTailor.
 */
export const deletePlaybackConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeletePlaybackConfigurationRequest,
    output: DeletePlaybackConfigurationResponse,
    errors: [],
  }),
);
/**
 * Deletes a prefetch schedule for a specific playback configuration. If you call `DeletePrefetchSchedule` on an expired prefetch schedule, MediaTailor returns an HTTP 404 status code. For more information about ad prefetching, see Using ad prefetching in the *MediaTailor User Guide*.
 */
export const deletePrefetchSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeletePrefetchScheduleRequest,
    output: DeletePrefetchScheduleResponse,
    errors: [],
  }),
);
/**
 * Deletes a source location. A source location is a container for sources. For more information about source locations, see Working with source locations in the *MediaTailor User Guide*.
 */
export const deleteSourceLocation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSourceLocationRequest,
    output: DeleteSourceLocationResponse,
    errors: [],
  }),
);
/**
 * The video on demand (VOD) source to delete.
 */
export const deleteVodSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVodSourceRequest,
  output: DeleteVodSourceResponse,
  errors: [],
}));
/**
 * The resource to untag.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [BadRequestException],
}));
/**
 * Updates a channel. For information about MediaTailor channels, see Working with channels in the *MediaTailor User Guide*.
 */
export const updateChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateChannelRequest,
  output: UpdateChannelResponse,
  errors: [],
}));
/**
 * Configures Amazon CloudWatch log settings for a channel.
 */
export const configureLogsForChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ConfigureLogsForChannelRequest,
    output: ConfigureLogsForChannelResponse,
    errors: [],
  }),
);
/**
 * Returns the channel's IAM policy. IAM policies are used to control access to your channel.
 */
export const getChannelPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetChannelPolicyRequest,
  output: GetChannelPolicyResponse,
  errors: [],
}));
/**
 * Describes a program within a channel. For information about programs, see Working with programs in the *MediaTailor User Guide*.
 */
export const describeProgram = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProgramRequest,
  output: DescribeProgramResponse,
  errors: [],
}));
/**
 * The live source to describe.
 */
export const describeLiveSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLiveSourceRequest,
  output: DescribeLiveSourceResponse,
  errors: [],
}));
/**
 * Updates a live source's configuration.
 */
export const updateLiveSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLiveSourceRequest,
  output: UpdateLiveSourceResponse,
  errors: [],
}));
/**
 * Retrieves a prefetch schedule for a playback configuration. A prefetch schedule allows you to tell MediaTailor to fetch and prepare certain ads before an ad break happens. For more information about ad prefetching, see Using ad prefetching in the *MediaTailor User Guide*.
 */
export const getPrefetchSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPrefetchScheduleRequest,
  output: GetPrefetchScheduleResponse,
  errors: [],
}));
/**
 * Describes a source location. A source location is a container for sources. For more information about source locations, see Working with source locations in the *MediaTailor User Guide*.
 */
export const describeSourceLocation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeSourceLocationRequest,
    output: DescribeSourceLocationResponse,
    errors: [],
  }),
);
/**
 * Updates a source location. A source location is a container for sources. For more information about source locations, see Working with source locations in the *MediaTailor User Guide*.
 */
export const updateSourceLocation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateSourceLocationRequest,
    output: UpdateSourceLocationResponse,
    errors: [],
  }),
);
/**
 * The VOD source configuration parameters.
 */
export const createVodSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVodSourceRequest,
  output: CreateVodSourceResponse,
  errors: [],
}));
/**
 * Updates a VOD source's configuration.
 */
export const updateVodSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVodSourceRequest,
  output: UpdateVodSourceResponse,
  errors: [],
}));
/**
 * A list of tags that are associated with this resource. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [BadRequestException],
}));
/**
 * The resource to tag. Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see Tagging AWS Elemental MediaTailor Resources.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [BadRequestException],
}));
/**
 * Defines where AWS Elemental MediaTailor sends logs for the playback configuration.
 */
export const configureLogsForPlaybackConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ConfigureLogsForPlaybackConfigurationRequest,
    output: ConfigureLogsForPlaybackConfigurationResponse,
    errors: [],
  }));
/**
 * Lists the alerts that are associated with a MediaTailor channel assembly resource.
 */
export const listAlerts = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeChannelRequest,
  output: DescribeChannelResponse,
  errors: [],
}));
/**
 * Retrieves information about the channels that are associated with the current AWS account.
 */
export const listChannels = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListChannelsRequest,
    output: ListChannelsResponse,
    errors: [],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Items",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * The live source configuration.
 */
export const createLiveSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLiveSourceRequest,
  output: CreateLiveSourceResponse,
  errors: [],
}));
/**
 * Lists the live sources contained in a source location. A source represents a piece of content.
 */
export const listLiveSources = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListLiveSourcesRequest,
    output: ListLiveSourcesResponse,
    errors: [],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Items",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Retrieves a playback configuration. For information about MediaTailor configurations, see Working with configurations in AWS Elemental MediaTailor.
 */
export const getPlaybackConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetPlaybackConfigurationRequest,
    output: GetPlaybackConfigurationResponse,
    errors: [],
  }),
);
/**
 * Retrieves existing playback configurations. For information about MediaTailor configurations, see Working with Configurations in AWS Elemental MediaTailor.
 */
export const listPlaybackConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listPrefetchSchedules =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listSourceLocations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeVodSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeVodSourceRequest,
  output: DescribeVodSourceResponse,
  errors: [],
}));
/**
 * Lists the VOD sources contained in a source location. A source represents a piece of content.
 */
export const listVodSources = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListVodSourcesRequest,
    output: ListVodSourcesResponse,
    errors: [],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Items",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Creates a channel. For information about MediaTailor channels, see Working with channels in the *MediaTailor User Guide*.
 */
export const createChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChannelRequest,
  output: CreateChannelResponse,
  errors: [],
}));
/**
 * Retrieves information about your channel's schedule.
 */
export const getChannelSchedule = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: GetChannelScheduleRequest,
    output: GetChannelScheduleResponse,
    errors: [],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Items",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Updates a program within a channel.
 */
export const updateProgram = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProgramRequest,
  output: UpdateProgramResponse,
  errors: [],
}));
/**
 * Creates a prefetch schedule for a playback configuration. A prefetch schedule allows you to tell MediaTailor to fetch and prepare certain ads before an ad break happens. For more information about ad prefetching, see Using ad prefetching in the *MediaTailor User Guide*.
 */
export const createPrefetchSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreatePrefetchScheduleRequest,
    output: CreatePrefetchScheduleResponse,
    errors: [],
  }),
);
/**
 * Creates a source location. A source location is a container for sources. For more information about source locations, see Working with source locations in the *MediaTailor User Guide*.
 */
export const createSourceLocation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSourceLocationRequest,
    output: CreateSourceLocationResponse,
    errors: [],
  }),
);
/**
 * Creates a program within a channel. For information about programs, see Working with programs in the *MediaTailor User Guide*.
 */
export const createProgram = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProgramRequest,
  output: CreateProgramResponse,
  errors: [],
}));
/**
 * Creates a playback configuration. For information about MediaTailor configurations, see Working with configurations in AWS Elemental MediaTailor.
 */
export const putPlaybackConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutPlaybackConfigurationRequest,
    output: PutPlaybackConfigurationResponse,
    errors: [],
  }),
);
