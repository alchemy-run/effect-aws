import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
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

//# Schemas
export const TagKeyList = S.Array(S.String);
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
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
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
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateChannelGroupRequest extends S.Class<CreateChannelGroupRequest>(
  "CreateChannelGroupRequest",
)(
  {
    ChannelGroupName: S.String,
    ClientToken: S.optional(S.String).pipe(T.HttpHeader("x-amzn-client-token")),
    Description: S.optional(S.String),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/channelGroup" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetChannelGroupRequest extends S.Class<GetChannelGroupRequest>(
  "GetChannelGroupRequest",
)(
  { ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")) },
  T.all(
    T.Http({ method: "GET", uri: "/channelGroup/{ChannelGroupName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateChannelGroupRequest extends S.Class<UpdateChannelGroupRequest>(
  "UpdateChannelGroupRequest",
)(
  {
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("x-amzn-update-if-match")),
    Description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/channelGroup/{ChannelGroupName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteChannelGroupRequest extends S.Class<DeleteChannelGroupRequest>(
  "DeleteChannelGroupRequest",
)(
  { ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/channelGroup/{ChannelGroupName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteChannelGroupResponse extends S.Class<DeleteChannelGroupResponse>(
  "DeleteChannelGroupResponse",
)({}) {}
export class ListChannelGroupsRequest extends S.Class<ListChannelGroupsRequest>(
  "ListChannelGroupsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/channelGroup" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetChannelRequest extends S.Class<GetChannelRequest>(
  "GetChannelRequest",
)(
  {
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
  },
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
) {}
export class InputSwitchConfiguration extends S.Class<InputSwitchConfiguration>(
  "InputSwitchConfiguration",
)({
  MQCSInputSwitching: S.optional(S.Boolean),
  PreferredInput: S.optional(S.Number),
}) {}
export class OutputHeaderConfiguration extends S.Class<OutputHeaderConfiguration>(
  "OutputHeaderConfiguration",
)({ PublishMQCS: S.optional(S.Boolean) }) {}
export class UpdateChannelRequest extends S.Class<UpdateChannelRequest>(
  "UpdateChannelRequest",
)(
  {
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("x-amzn-update-if-match")),
    Description: S.optional(S.String),
    InputSwitchConfiguration: S.optional(InputSwitchConfiguration),
    OutputHeaderConfiguration: S.optional(OutputHeaderConfiguration),
  },
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
) {}
export class DeleteChannelRequest extends S.Class<DeleteChannelRequest>(
  "DeleteChannelRequest",
)(
  {
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
  },
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
) {}
export class DeleteChannelResponse extends S.Class<DeleteChannelResponse>(
  "DeleteChannelResponse",
)({}) {}
export class ListChannelsRequest extends S.Class<ListChannelsRequest>(
  "ListChannelsRequest",
)(
  {
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/channelGroup/{ChannelGroupName}/channel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResetChannelStateRequest extends S.Class<ResetChannelStateRequest>(
  "ResetChannelStateRequest",
)(
  {
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
  },
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
) {}
export class PutChannelPolicyRequest extends S.Class<PutChannelPolicyRequest>(
  "PutChannelPolicyRequest",
)(
  {
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    Policy: S.String,
  },
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
) {}
export class PutChannelPolicyResponse extends S.Class<PutChannelPolicyResponse>(
  "PutChannelPolicyResponse",
)({}) {}
export class GetChannelPolicyRequest extends S.Class<GetChannelPolicyRequest>(
  "GetChannelPolicyRequest",
)(
  {
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
  },
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
) {}
export class DeleteChannelPolicyRequest extends S.Class<DeleteChannelPolicyRequest>(
  "DeleteChannelPolicyRequest",
)(
  {
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
  },
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
) {}
export class DeleteChannelPolicyResponse extends S.Class<DeleteChannelPolicyResponse>(
  "DeleteChannelPolicyResponse",
)({}) {}
export class GetOriginEndpointRequest extends S.Class<GetOriginEndpointRequest>(
  "GetOriginEndpointRequest",
)(
  {
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    OriginEndpointName: S.String.pipe(T.HttpLabel("OriginEndpointName")),
  },
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
) {}
export const ScteFilterList = S.Array(S.String);
export class Scte extends S.Class<Scte>("Scte")({
  ScteFilter: S.optional(ScteFilterList),
  ScteInSegments: S.optional(S.String),
}) {}
export class EncryptionMethod extends S.Class<EncryptionMethod>(
  "EncryptionMethod",
)({
  TsEncryptionMethod: S.optional(S.String),
  CmafEncryptionMethod: S.optional(S.String),
  IsmEncryptionMethod: S.optional(S.String),
}) {}
export class EncryptionContractConfiguration extends S.Class<EncryptionContractConfiguration>(
  "EncryptionContractConfiguration",
)({ PresetSpeke20Audio: S.String, PresetSpeke20Video: S.String }) {}
export const DrmSystems = S.Array(S.String);
export class SpekeKeyProvider extends S.Class<SpekeKeyProvider>(
  "SpekeKeyProvider",
)({
  EncryptionContractConfiguration: EncryptionContractConfiguration,
  ResourceId: S.String,
  DrmSystems: DrmSystems,
  RoleArn: S.String,
  Url: S.String,
  CertificateArn: S.optional(S.String),
}) {}
export class Encryption extends S.Class<Encryption>("Encryption")({
  ConstantInitializationVector: S.optional(S.String),
  EncryptionMethod: EncryptionMethod,
  KeyRotationIntervalSeconds: S.optional(S.Number),
  CmafExcludeSegmentDrmMetadata: S.optional(S.Boolean),
  SpekeKeyProvider: SpekeKeyProvider,
}) {}
export class Segment extends S.Class<Segment>("Segment")({
  SegmentDurationSeconds: S.optional(S.Number),
  SegmentName: S.optional(S.String),
  TsUseAudioRenditionGroup: S.optional(S.Boolean),
  IncludeIframeOnlyStreams: S.optional(S.Boolean),
  TsIncludeDvbSubtitles: S.optional(S.Boolean),
  Scte: S.optional(Scte),
  Encryption: S.optional(Encryption),
}) {}
export class ScteHls extends S.Class<ScteHls>("ScteHls")({
  AdMarkerHls: S.optional(S.String),
}) {}
export class StartTag extends S.Class<StartTag>("StartTag")({
  TimeOffset: S.Number,
  Precise: S.optional(S.Boolean),
}) {}
export class FilterConfiguration extends S.Class<FilterConfiguration>(
  "FilterConfiguration",
)({
  ManifestFilter: S.optional(S.String),
  DrmSettings: S.optional(S.String),
  Start: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  End: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TimeDelaySeconds: S.optional(S.Number),
  ClipStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreateHlsManifestConfiguration extends S.Class<CreateHlsManifestConfiguration>(
  "CreateHlsManifestConfiguration",
)({
  ManifestName: S.String,
  ChildManifestName: S.optional(S.String),
  ScteHls: S.optional(ScteHls),
  StartTag: S.optional(StartTag),
  ManifestWindowSeconds: S.optional(S.Number),
  ProgramDateTimeIntervalSeconds: S.optional(S.Number),
  FilterConfiguration: S.optional(FilterConfiguration),
  UrlEncodeChildManifest: S.optional(S.Boolean),
}) {}
export const CreateHlsManifests = S.Array(CreateHlsManifestConfiguration);
export class CreateLowLatencyHlsManifestConfiguration extends S.Class<CreateLowLatencyHlsManifestConfiguration>(
  "CreateLowLatencyHlsManifestConfiguration",
)({
  ManifestName: S.String,
  ChildManifestName: S.optional(S.String),
  ScteHls: S.optional(ScteHls),
  StartTag: S.optional(StartTag),
  ManifestWindowSeconds: S.optional(S.Number),
  ProgramDateTimeIntervalSeconds: S.optional(S.Number),
  FilterConfiguration: S.optional(FilterConfiguration),
  UrlEncodeChildManifest: S.optional(S.Boolean),
}) {}
export const CreateLowLatencyHlsManifests = S.Array(
  CreateLowLatencyHlsManifestConfiguration,
);
export const DashPeriodTriggers = S.Array(S.String);
export class ScteDash extends S.Class<ScteDash>("ScteDash")({
  AdMarkerDash: S.optional(S.String),
}) {}
export class DashUtcTiming extends S.Class<DashUtcTiming>("DashUtcTiming")({
  TimingMode: S.optional(S.String),
  TimingSource: S.optional(S.String),
}) {}
export const DashProfiles = S.Array(S.String);
export class DashBaseUrl extends S.Class<DashBaseUrl>("DashBaseUrl")({
  Url: S.String,
  ServiceLocation: S.optional(S.String),
  DvbPriority: S.optional(S.Number),
  DvbWeight: S.optional(S.Number),
}) {}
export const DashBaseUrls = S.Array(DashBaseUrl);
export class DashProgramInformation extends S.Class<DashProgramInformation>(
  "DashProgramInformation",
)({
  Title: S.optional(S.String),
  Source: S.optional(S.String),
  Copyright: S.optional(S.String),
  LanguageCode: S.optional(S.String),
  MoreInformationUrl: S.optional(S.String),
}) {}
export class DashDvbFontDownload extends S.Class<DashDvbFontDownload>(
  "DashDvbFontDownload",
)({
  Url: S.optional(S.String),
  MimeType: S.optional(S.String),
  FontFamily: S.optional(S.String),
}) {}
export class DashDvbMetricsReporting extends S.Class<DashDvbMetricsReporting>(
  "DashDvbMetricsReporting",
)({ ReportingUrl: S.String, Probability: S.optional(S.Number) }) {}
export const DashDvbErrorMetrics = S.Array(DashDvbMetricsReporting);
export class DashDvbSettings extends S.Class<DashDvbSettings>(
  "DashDvbSettings",
)({
  FontDownload: S.optional(DashDvbFontDownload),
  ErrorMetrics: S.optional(DashDvbErrorMetrics),
}) {}
export class DashTtmlConfiguration extends S.Class<DashTtmlConfiguration>(
  "DashTtmlConfiguration",
)({ TtmlProfile: S.String }) {}
export class DashSubtitleConfiguration extends S.Class<DashSubtitleConfiguration>(
  "DashSubtitleConfiguration",
)({ TtmlConfiguration: S.optional(DashTtmlConfiguration) }) {}
export class CreateDashManifestConfiguration extends S.Class<CreateDashManifestConfiguration>(
  "CreateDashManifestConfiguration",
)({
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
}) {}
export const CreateDashManifests = S.Array(CreateDashManifestConfiguration);
export class CreateMssManifestConfiguration extends S.Class<CreateMssManifestConfiguration>(
  "CreateMssManifestConfiguration",
)({
  ManifestName: S.String,
  ManifestWindowSeconds: S.optional(S.Number),
  FilterConfiguration: S.optional(FilterConfiguration),
  ManifestLayout: S.optional(S.String),
}) {}
export const CreateMssManifests = S.Array(CreateMssManifestConfiguration);
export const EndpointErrorConditions = S.Array(S.String);
export class ForceEndpointErrorConfiguration extends S.Class<ForceEndpointErrorConfiguration>(
  "ForceEndpointErrorConfiguration",
)({ EndpointErrorConditions: S.optional(EndpointErrorConditions) }) {}
export class UpdateOriginEndpointRequest extends S.Class<UpdateOriginEndpointRequest>(
  "UpdateOriginEndpointRequest",
)(
  {
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
  },
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
) {}
export class DeleteOriginEndpointRequest extends S.Class<DeleteOriginEndpointRequest>(
  "DeleteOriginEndpointRequest",
)(
  {
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    OriginEndpointName: S.String.pipe(T.HttpLabel("OriginEndpointName")),
  },
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
) {}
export class DeleteOriginEndpointResponse extends S.Class<DeleteOriginEndpointResponse>(
  "DeleteOriginEndpointResponse",
)({}) {}
export class ListOriginEndpointsRequest extends S.Class<ListOriginEndpointsRequest>(
  "ListOriginEndpointsRequest",
)(
  {
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
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
) {}
export class ResetOriginEndpointStateRequest extends S.Class<ResetOriginEndpointStateRequest>(
  "ResetOriginEndpointStateRequest",
)(
  {
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    OriginEndpointName: S.String.pipe(T.HttpLabel("OriginEndpointName")),
  },
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
) {}
export class GetOriginEndpointPolicyRequest extends S.Class<GetOriginEndpointPolicyRequest>(
  "GetOriginEndpointPolicyRequest",
)(
  {
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    OriginEndpointName: S.String.pipe(T.HttpLabel("OriginEndpointName")),
  },
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
) {}
export class DeleteOriginEndpointPolicyRequest extends S.Class<DeleteOriginEndpointPolicyRequest>(
  "DeleteOriginEndpointPolicyRequest",
)(
  {
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    OriginEndpointName: S.String.pipe(T.HttpLabel("OriginEndpointName")),
  },
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
) {}
export class DeleteOriginEndpointPolicyResponse extends S.Class<DeleteOriginEndpointPolicyResponse>(
  "DeleteOriginEndpointPolicyResponse",
)({}) {}
export class GetHarvestJobRequest extends S.Class<GetHarvestJobRequest>(
  "GetHarvestJobRequest",
)(
  {
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    OriginEndpointName: S.String.pipe(T.HttpLabel("OriginEndpointName")),
    HarvestJobName: S.String.pipe(T.HttpLabel("HarvestJobName")),
  },
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
) {}
export class CancelHarvestJobRequest extends S.Class<CancelHarvestJobRequest>(
  "CancelHarvestJobRequest",
)(
  {
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    OriginEndpointName: S.String.pipe(T.HttpLabel("OriginEndpointName")),
    HarvestJobName: S.String.pipe(T.HttpLabel("HarvestJobName")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("x-amzn-update-if-match")),
  },
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
) {}
export class CancelHarvestJobResponse extends S.Class<CancelHarvestJobResponse>(
  "CancelHarvestJobResponse",
)({}) {}
export class ListHarvestJobsRequest extends S.Class<ListHarvestJobsRequest>(
  "ListHarvestJobsRequest",
)(
  {
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.optional(S.String).pipe(T.HttpQuery("channelName")),
    OriginEndpointName: S.optional(S.String).pipe(
      T.HttpQuery("originEndpointName"),
    ),
    Status: S.optional(S.String).pipe(T.HttpQuery("includeStatus")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
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
) {}
export const CdnIdentifierSecretArns = S.Array(S.String);
export class CdnAuthConfiguration extends S.Class<CdnAuthConfiguration>(
  "CdnAuthConfiguration",
)({
  CdnIdentifierSecretArns: CdnIdentifierSecretArns,
  SecretsRoleArn: S.String,
}) {}
export class HarvesterScheduleConfiguration extends S.Class<HarvesterScheduleConfiguration>(
  "HarvesterScheduleConfiguration",
)({
  StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagMap).pipe(T.JsonName("tags")) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: TagMap.pipe(T.JsonName("tags")),
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
export class CreateChannelGroupResponse extends S.Class<CreateChannelGroupResponse>(
  "CreateChannelGroupResponse",
)({
  ChannelGroupName: S.String,
  Arn: S.String,
  EgressDomain: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ETag: S.optional(S.String),
  Description: S.optional(S.String),
  Tags: S.optional(TagMap),
}) {}
export class GetChannelGroupResponse extends S.Class<GetChannelGroupResponse>(
  "GetChannelGroupResponse",
)({
  ChannelGroupName: S.String,
  Arn: S.String,
  EgressDomain: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Description: S.optional(S.String),
  ETag: S.optional(S.String),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
}) {}
export class UpdateChannelGroupResponse extends S.Class<UpdateChannelGroupResponse>(
  "UpdateChannelGroupResponse",
)({
  ChannelGroupName: S.String,
  Arn: S.String,
  EgressDomain: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Description: S.optional(S.String),
  ETag: S.optional(S.String),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
}) {}
export class CreateChannelRequest extends S.Class<CreateChannelRequest>(
  "CreateChannelRequest",
)(
  {
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String,
    ClientToken: S.optional(S.String).pipe(T.HttpHeader("x-amzn-client-token")),
    InputType: S.optional(S.String),
    Description: S.optional(S.String),
    InputSwitchConfiguration: S.optional(InputSwitchConfiguration),
    OutputHeaderConfiguration: S.optional(OutputHeaderConfiguration),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/channelGroup/{ChannelGroupName}/channel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class IngestEndpoint extends S.Class<IngestEndpoint>("IngestEndpoint")({
  Id: S.optional(S.String),
  Url: S.optional(S.String),
}) {}
export const IngestEndpointList = S.Array(IngestEndpoint);
export class UpdateChannelResponse extends S.Class<UpdateChannelResponse>(
  "UpdateChannelResponse",
)({
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
}) {}
export class ResetChannelStateResponse extends S.Class<ResetChannelStateResponse>(
  "ResetChannelStateResponse",
)({
  ChannelGroupName: S.String,
  ChannelName: S.String,
  Arn: S.String,
  ResetAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class GetChannelPolicyResponse extends S.Class<GetChannelPolicyResponse>(
  "GetChannelPolicyResponse",
)({ ChannelGroupName: S.String, ChannelName: S.String, Policy: S.String }) {}
export class GetHlsManifestConfiguration extends S.Class<GetHlsManifestConfiguration>(
  "GetHlsManifestConfiguration",
)({
  ManifestName: S.String,
  Url: S.String,
  ChildManifestName: S.optional(S.String),
  ManifestWindowSeconds: S.optional(S.Number),
  ProgramDateTimeIntervalSeconds: S.optional(S.Number),
  ScteHls: S.optional(ScteHls),
  FilterConfiguration: S.optional(FilterConfiguration),
  StartTag: S.optional(StartTag),
  UrlEncodeChildManifest: S.optional(S.Boolean),
}) {}
export const GetHlsManifests = S.Array(GetHlsManifestConfiguration);
export class GetLowLatencyHlsManifestConfiguration extends S.Class<GetLowLatencyHlsManifestConfiguration>(
  "GetLowLatencyHlsManifestConfiguration",
)({
  ManifestName: S.String,
  Url: S.String,
  ChildManifestName: S.optional(S.String),
  ManifestWindowSeconds: S.optional(S.Number),
  ProgramDateTimeIntervalSeconds: S.optional(S.Number),
  ScteHls: S.optional(ScteHls),
  FilterConfiguration: S.optional(FilterConfiguration),
  StartTag: S.optional(StartTag),
  UrlEncodeChildManifest: S.optional(S.Boolean),
}) {}
export const GetLowLatencyHlsManifests = S.Array(
  GetLowLatencyHlsManifestConfiguration,
);
export class GetMssManifestConfiguration extends S.Class<GetMssManifestConfiguration>(
  "GetMssManifestConfiguration",
)({
  ManifestName: S.String,
  Url: S.String,
  FilterConfiguration: S.optional(FilterConfiguration),
  ManifestWindowSeconds: S.optional(S.Number),
  ManifestLayout: S.optional(S.String),
}) {}
export const GetMssManifests = S.Array(GetMssManifestConfiguration);
export class GetDashManifestConfiguration extends S.Class<GetDashManifestConfiguration>(
  "GetDashManifestConfiguration",
)({
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
}) {}
export const GetDashManifests = S.Array(GetDashManifestConfiguration);
export class UpdateOriginEndpointResponse extends S.Class<UpdateOriginEndpointResponse>(
  "UpdateOriginEndpointResponse",
)({
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
  ForceEndpointErrorConfiguration: S.optional(ForceEndpointErrorConfiguration),
  ETag: S.optional(S.String),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  DashManifests: S.optional(GetDashManifests),
}) {}
export class ResetOriginEndpointStateResponse extends S.Class<ResetOriginEndpointStateResponse>(
  "ResetOriginEndpointStateResponse",
)({
  ChannelGroupName: S.String,
  ChannelName: S.String,
  OriginEndpointName: S.String,
  Arn: S.String,
  ResetAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class PutOriginEndpointPolicyRequest extends S.Class<PutOriginEndpointPolicyRequest>(
  "PutOriginEndpointPolicyRequest",
)(
  {
    ChannelGroupName: S.String.pipe(T.HttpLabel("ChannelGroupName")),
    ChannelName: S.String.pipe(T.HttpLabel("ChannelName")),
    OriginEndpointName: S.String.pipe(T.HttpLabel("OriginEndpointName")),
    Policy: S.String,
    CdnAuthConfiguration: S.optional(CdnAuthConfiguration),
  },
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
) {}
export class PutOriginEndpointPolicyResponse extends S.Class<PutOriginEndpointPolicyResponse>(
  "PutOriginEndpointPolicyResponse",
)({}) {}
export class GetOriginEndpointPolicyResponse extends S.Class<GetOriginEndpointPolicyResponse>(
  "GetOriginEndpointPolicyResponse",
)({
  ChannelGroupName: S.String,
  ChannelName: S.String,
  OriginEndpointName: S.String,
  Policy: S.String,
  CdnAuthConfiguration: S.optional(CdnAuthConfiguration),
}) {}
export class S3DestinationConfig extends S.Class<S3DestinationConfig>(
  "S3DestinationConfig",
)({ BucketName: S.String, DestinationPath: S.String }) {}
export class Destination extends S.Class<Destination>("Destination")({
  S3Destination: S3DestinationConfig,
}) {}
export class HarvestedHlsManifest extends S.Class<HarvestedHlsManifest>(
  "HarvestedHlsManifest",
)({ ManifestName: S.String }) {}
export const HarvestedHlsManifestsList = S.Array(HarvestedHlsManifest);
export class HarvestedDashManifest extends S.Class<HarvestedDashManifest>(
  "HarvestedDashManifest",
)({ ManifestName: S.String }) {}
export const HarvestedDashManifestsList = S.Array(HarvestedDashManifest);
export class HarvestedLowLatencyHlsManifest extends S.Class<HarvestedLowLatencyHlsManifest>(
  "HarvestedLowLatencyHlsManifest",
)({ ManifestName: S.String }) {}
export const HarvestedLowLatencyHlsManifestsList = S.Array(
  HarvestedLowLatencyHlsManifest,
);
export class HarvestedManifests extends S.Class<HarvestedManifests>(
  "HarvestedManifests",
)({
  HlsManifests: S.optional(HarvestedHlsManifestsList),
  DashManifests: S.optional(HarvestedDashManifestsList),
  LowLatencyHlsManifests: S.optional(HarvestedLowLatencyHlsManifestsList),
}) {}
export class GetHarvestJobResponse extends S.Class<GetHarvestJobResponse>(
  "GetHarvestJobResponse",
)({
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
}) {}
export class ChannelGroupListConfiguration extends S.Class<ChannelGroupListConfiguration>(
  "ChannelGroupListConfiguration",
)({
  ChannelGroupName: S.String,
  Arn: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Description: S.optional(S.String),
}) {}
export const ChannelGroupsList = S.Array(ChannelGroupListConfiguration);
export class ChannelListConfiguration extends S.Class<ChannelListConfiguration>(
  "ChannelListConfiguration",
)({
  Arn: S.String,
  ChannelName: S.String,
  ChannelGroupName: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Description: S.optional(S.String),
  InputType: S.optional(S.String),
}) {}
export const ChannelList = S.Array(ChannelListConfiguration);
export class HarvestJob extends S.Class<HarvestJob>("HarvestJob")({
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
}) {}
export const HarvestJobsList = S.Array(HarvestJob);
export class ListChannelGroupsResponse extends S.Class<ListChannelGroupsResponse>(
  "ListChannelGroupsResponse",
)({ Items: S.optional(ChannelGroupsList), NextToken: S.optional(S.String) }) {}
export class CreateChannelResponse extends S.Class<CreateChannelResponse>(
  "CreateChannelResponse",
)({
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
}) {}
export class GetChannelResponse extends S.Class<GetChannelResponse>(
  "GetChannelResponse",
)({
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
}) {}
export class ListChannelsResponse extends S.Class<ListChannelsResponse>(
  "ListChannelsResponse",
)({ Items: S.optional(ChannelList), NextToken: S.optional(S.String) }) {}
export class GetOriginEndpointResponse extends S.Class<GetOriginEndpointResponse>(
  "GetOriginEndpointResponse",
)({
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
  ForceEndpointErrorConfiguration: S.optional(ForceEndpointErrorConfiguration),
  ETag: S.optional(S.String),
  Tags: S.optional(TagMap),
}) {}
export class CreateHarvestJobRequest extends S.Class<CreateHarvestJobRequest>(
  "CreateHarvestJobRequest",
)(
  {
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
  },
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
) {}
export class ListHarvestJobsResponse extends S.Class<ListHarvestJobsResponse>(
  "ListHarvestJobsResponse",
)({ Items: S.optional(HarvestJobsList), NextToken: S.optional(S.String) }) {}
export class ListHlsManifestConfiguration extends S.Class<ListHlsManifestConfiguration>(
  "ListHlsManifestConfiguration",
)({
  ManifestName: S.String,
  ChildManifestName: S.optional(S.String),
  Url: S.optional(S.String),
}) {}
export const ListHlsManifests = S.Array(ListHlsManifestConfiguration);
export class ListLowLatencyHlsManifestConfiguration extends S.Class<ListLowLatencyHlsManifestConfiguration>(
  "ListLowLatencyHlsManifestConfiguration",
)({
  ManifestName: S.String,
  ChildManifestName: S.optional(S.String),
  Url: S.optional(S.String),
}) {}
export const ListLowLatencyHlsManifests = S.Array(
  ListLowLatencyHlsManifestConfiguration,
);
export class ListDashManifestConfiguration extends S.Class<ListDashManifestConfiguration>(
  "ListDashManifestConfiguration",
)({ ManifestName: S.String, Url: S.optional(S.String) }) {}
export const ListDashManifests = S.Array(ListDashManifestConfiguration);
export class ListMssManifestConfiguration extends S.Class<ListMssManifestConfiguration>(
  "ListMssManifestConfiguration",
)({ ManifestName: S.String, Url: S.optional(S.String) }) {}
export const ListMssManifests = S.Array(ListMssManifestConfiguration);
export class OriginEndpointListConfiguration extends S.Class<OriginEndpointListConfiguration>(
  "OriginEndpointListConfiguration",
)({
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
  ForceEndpointErrorConfiguration: S.optional(ForceEndpointErrorConfiguration),
}) {}
export const OriginEndpointsList = S.Array(OriginEndpointListConfiguration);
export class ListOriginEndpointsResponse extends S.Class<ListOriginEndpointsResponse>(
  "ListOriginEndpointsResponse",
)({
  Items: S.optional(OriginEndpointsList),
  NextToken: S.optional(S.String),
}) {}
export class CreateHarvestJobResponse extends S.Class<CreateHarvestJobResponse>(
  "CreateHarvestJobResponse",
)({
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
}) {}
export class CreateOriginEndpointRequest extends S.Class<CreateOriginEndpointRequest>(
  "CreateOriginEndpointRequest",
)(
  {
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
  },
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
) {}
export class CreateOriginEndpointResponse extends S.Class<CreateOriginEndpointResponse>(
  "CreateOriginEndpointResponse",
)({
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
  ForceEndpointErrorConfiguration: S.optional(ForceEndpointErrorConfiguration),
  ETag: S.optional(S.String),
  Tags: S.optional(TagMap),
}) {}

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
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    Message: S.optional(S.String),
    ConflictExceptionType: S.optional(S.String),
  },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String), ResourceTypeNotFound: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Removes one or more tags from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ValidationException],
}));
/**
 * Lists the tags assigned to a resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ValidationException],
}));
/**
 * Assigns one of more tags (key-value pairs) to the specified MediaPackage resource.
 *
 * Tags can help you organize and categorize your resources. You can also use them to scope user permissions, by granting a user permission to access or change only resources with certain tag values. You can use the TagResource operation with a resource that already has tags. If you specify a new tag key for the resource, this tag is appended to the list of tags associated with the resource. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces the previous value for that tag.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ValidationException],
}));
/**
 * Delete a channel to stop AWS Elemental MediaPackage from receiving further content. You must delete the channel's origin endpoints before you can delete the channel.
 */
export const deleteChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getOriginEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listHarvestJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Update the specified channel. You can edit if MediaPackage sends ingest or egress access logs to the CloudWatch log group, if content will be encrypted, the description on a channel, and your channel's policy settings. You can't edit the name of the channel or CloudFront distribution details.
 *
 * Any edits you make that impact the video output may not be reflected for a few minutes.
 */
export const updateChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const resetChannelState = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const resetOriginEndpointState = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Attaches an IAM policy to the specified origin endpoint. You can attach only one policy with each request.
 */
export const putOriginEndpointPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Attaches an IAM policy to the specified channel. With policies, you can specify who has access to AWS resources and what actions they can perform on those resources. You can attach only one policy with each request.
 */
export const putChannelPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const cancelHarvestJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateChannelGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getOriginEndpointPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetOriginEndpointPolicyRequest,
    output: GetOriginEndpointPolicyResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves the details of a specific harvest job.
 */
export const getHarvestJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getChannelGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listChannels = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Delete a channel policy.
 */
export const deleteChannelPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteOriginEndpointPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteOriginEndpointPolicyRequest,
    output: DeleteOriginEndpointPolicyResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Origin endpoints can serve content until they're deleted. Delete the endpoint if it should no longer respond to playback requests. You must delete all endpoints from a channel before you can delete the channel.
 */
export const deleteOriginEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteOriginEndpointRequest,
    output: DeleteOriginEndpointResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Delete a channel group. You must delete the channel group's channels and origin endpoints before you can delete the channel group. If you delete a channel group, you'll lose access to the egress domain and will have to create a new channel group to replace it.
 */
export const deleteChannelGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listChannelGroups = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Retrieves the specified channel policy that's configured in AWS Elemental MediaPackage. With policies, you can specify who has access to AWS resources and what actions they can perform on those resources.
 */
export const getChannelPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listOriginEndpoints =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createHarvestJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateOriginEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Create a channel group to group your channels and origin endpoints. A channel group is the top-level resource that consists of channels and origin endpoints that are associated with it and that provides predictable URLs for stream delivery. All channels and origin endpoints within the channel group are guaranteed to share the DNS. You can create only one channel group with each request.
 */
export const createChannelGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createOriginEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
