import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "MediaPackage",
  serviceShapeName: "MediaPackage",
});
const auth = T.AwsAuthSigv4({ name: "mediapackage" });
const ver = T.ServiceVersion("2017-10-12");
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
                        url: "https://mediapackage-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://mediapackage-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://mediapackage.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://mediapackage.{Region}.{PartitionResult#dnsSuffix}",
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
export const __listOf__string = S.Array(S.String);
export class DeleteChannelRequest extends S.Class<DeleteChannelRequest>(
  "DeleteChannelRequest",
)(
  { Id: S.String.pipe(T.HttpLabel("Id")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/channels/{Id}" }),
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
export class DeleteOriginEndpointRequest extends S.Class<DeleteOriginEndpointRequest>(
  "DeleteOriginEndpointRequest",
)(
  { Id: S.String.pipe(T.HttpLabel("Id")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/origin_endpoints/{Id}" }),
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
export class DescribeChannelRequest extends S.Class<DescribeChannelRequest>(
  "DescribeChannelRequest",
)(
  { Id: S.String.pipe(T.HttpLabel("Id")) },
  T.all(
    T.Http({ method: "GET", uri: "/channels/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeHarvestJobRequest extends S.Class<DescribeHarvestJobRequest>(
  "DescribeHarvestJobRequest",
)(
  { Id: S.String.pipe(T.HttpLabel("Id")) },
  T.all(
    T.Http({ method: "GET", uri: "/harvest_jobs/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeOriginEndpointRequest extends S.Class<DescribeOriginEndpointRequest>(
  "DescribeOriginEndpointRequest",
)(
  { Id: S.String.pipe(T.HttpLabel("Id")) },
  T.all(
    T.Http({ method: "GET", uri: "/origin_endpoints/{Id}" }),
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
export class ListHarvestJobsRequest extends S.Class<ListHarvestJobsRequest>(
  "ListHarvestJobsRequest",
)(
  {
    IncludeChannelId: S.optional(S.String).pipe(
      T.HttpQuery("includeChannelId"),
    ),
    IncludeStatus: S.optional(S.String).pipe(T.HttpQuery("includeStatus")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/harvest_jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListOriginEndpointsRequest extends S.Class<ListOriginEndpointsRequest>(
  "ListOriginEndpointsRequest",
)(
  {
    ChannelId: S.optional(S.String).pipe(T.HttpQuery("channelId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/origin_endpoints" }),
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
export class RotateChannelCredentialsRequest extends S.Class<RotateChannelCredentialsRequest>(
  "RotateChannelCredentialsRequest",
)(
  { Id: S.String.pipe(T.HttpLabel("Id")) },
  T.all(
    T.Http({ method: "PUT", uri: "/channels/{Id}/credentials" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RotateIngestEndpointCredentialsRequest extends S.Class<RotateIngestEndpointCredentialsRequest>(
  "RotateIngestEndpointCredentialsRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel("Id")),
    IngestEndpointId: S.String.pipe(T.HttpLabel("IngestEndpointId")),
  },
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
export class UpdateChannelRequest extends S.Class<UpdateChannelRequest>(
  "UpdateChannelRequest",
)(
  {
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Id: S.String.pipe(T.HttpLabel("Id")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/channels/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Authorization extends S.Class<Authorization>("Authorization")({
  CdnIdentifierSecret: S.String.pipe(T.JsonName("cdnIdentifierSecret")),
  SecretsRoleArn: S.String.pipe(T.JsonName("secretsRoleArn")),
}) {}
export class EncryptionContractConfiguration extends S.Class<EncryptionContractConfiguration>(
  "EncryptionContractConfiguration",
)({
  PresetSpeke20Audio: S.String.pipe(T.JsonName("presetSpeke20Audio")),
  PresetSpeke20Video: S.String.pipe(T.JsonName("presetSpeke20Video")),
}) {}
export class SpekeKeyProvider extends S.Class<SpekeKeyProvider>(
  "SpekeKeyProvider",
)({
  CertificateArn: S.optional(S.String).pipe(T.JsonName("certificateArn")),
  EncryptionContractConfiguration: S.optional(
    EncryptionContractConfiguration,
  ).pipe(T.JsonName("encryptionContractConfiguration")),
  ResourceId: S.String.pipe(T.JsonName("resourceId")),
  RoleArn: S.String.pipe(T.JsonName("roleArn")),
  SystemIds: __listOf__string.pipe(T.JsonName("systemIds")),
  Url: S.String.pipe(T.JsonName("url")),
}) {}
export class CmafEncryption extends S.Class<CmafEncryption>("CmafEncryption")({
  ConstantInitializationVector: S.optional(S.String).pipe(
    T.JsonName("constantInitializationVector"),
  ),
  EncryptionMethod: S.optional(S.String).pipe(T.JsonName("encryptionMethod")),
  KeyRotationIntervalSeconds: S.optional(S.Number).pipe(
    T.JsonName("keyRotationIntervalSeconds"),
  ),
  SpekeKeyProvider: SpekeKeyProvider.pipe(T.JsonName("spekeKeyProvider")),
}) {}
export const AdTriggers = S.Array(S.String);
export class HlsManifestCreateOrUpdateParameters extends S.Class<HlsManifestCreateOrUpdateParameters>(
  "HlsManifestCreateOrUpdateParameters",
)({
  AdMarkers: S.optional(S.String).pipe(T.JsonName("adMarkers")),
  AdTriggers: S.optional(AdTriggers).pipe(T.JsonName("adTriggers")),
  AdsOnDeliveryRestrictions: S.optional(S.String).pipe(
    T.JsonName("adsOnDeliveryRestrictions"),
  ),
  Id: S.String.pipe(T.JsonName("id")),
  IncludeIframeOnlyStream: S.optional(S.Boolean).pipe(
    T.JsonName("includeIframeOnlyStream"),
  ),
  ManifestName: S.optional(S.String).pipe(T.JsonName("manifestName")),
  PlaylistType: S.optional(S.String).pipe(T.JsonName("playlistType")),
  PlaylistWindowSeconds: S.optional(S.Number).pipe(
    T.JsonName("playlistWindowSeconds"),
  ),
  ProgramDateTimeIntervalSeconds: S.optional(S.Number).pipe(
    T.JsonName("programDateTimeIntervalSeconds"),
  ),
}) {}
export const __listOfHlsManifestCreateOrUpdateParameters = S.Array(
  HlsManifestCreateOrUpdateParameters,
);
export class StreamSelection extends S.Class<StreamSelection>(
  "StreamSelection",
)({
  MaxVideoBitsPerSecond: S.optional(S.Number).pipe(
    T.JsonName("maxVideoBitsPerSecond"),
  ),
  MinVideoBitsPerSecond: S.optional(S.Number).pipe(
    T.JsonName("minVideoBitsPerSecond"),
  ),
  StreamOrder: S.optional(S.String).pipe(T.JsonName("streamOrder")),
}) {}
export class CmafPackageCreateOrUpdateParameters extends S.Class<CmafPackageCreateOrUpdateParameters>(
  "CmafPackageCreateOrUpdateParameters",
)({
  Encryption: S.optional(CmafEncryption).pipe(T.JsonName("encryption")),
  HlsManifests: S.optional(__listOfHlsManifestCreateOrUpdateParameters).pipe(
    T.JsonName("hlsManifests"),
  ),
  SegmentDurationSeconds: S.optional(S.Number).pipe(
    T.JsonName("segmentDurationSeconds"),
  ),
  SegmentPrefix: S.optional(S.String).pipe(T.JsonName("segmentPrefix")),
  StreamSelection: S.optional(StreamSelection).pipe(
    T.JsonName("streamSelection"),
  ),
}) {}
export class DashEncryption extends S.Class<DashEncryption>("DashEncryption")({
  KeyRotationIntervalSeconds: S.optional(S.Number).pipe(
    T.JsonName("keyRotationIntervalSeconds"),
  ),
  SpekeKeyProvider: SpekeKeyProvider.pipe(T.JsonName("spekeKeyProvider")),
}) {}
export const __listOf__PeriodTriggersElement = S.Array(S.String);
export class DashPackage extends S.Class<DashPackage>("DashPackage")({
  AdTriggers: S.optional(AdTriggers).pipe(T.JsonName("adTriggers")),
  AdsOnDeliveryRestrictions: S.optional(S.String).pipe(
    T.JsonName("adsOnDeliveryRestrictions"),
  ),
  Encryption: S.optional(DashEncryption).pipe(T.JsonName("encryption")),
  IncludeIframeOnlyStream: S.optional(S.Boolean).pipe(
    T.JsonName("includeIframeOnlyStream"),
  ),
  ManifestLayout: S.optional(S.String).pipe(T.JsonName("manifestLayout")),
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
  Profile: S.optional(S.String).pipe(T.JsonName("profile")),
  SegmentDurationSeconds: S.optional(S.Number).pipe(
    T.JsonName("segmentDurationSeconds"),
  ),
  SegmentTemplateFormat: S.optional(S.String).pipe(
    T.JsonName("segmentTemplateFormat"),
  ),
  StreamSelection: S.optional(StreamSelection).pipe(
    T.JsonName("streamSelection"),
  ),
  SuggestedPresentationDelaySeconds: S.optional(S.Number).pipe(
    T.JsonName("suggestedPresentationDelaySeconds"),
  ),
  UtcTiming: S.optional(S.String).pipe(T.JsonName("utcTiming")),
  UtcTimingUri: S.optional(S.String).pipe(T.JsonName("utcTimingUri")),
}) {}
export class HlsEncryption extends S.Class<HlsEncryption>("HlsEncryption")({
  ConstantInitializationVector: S.optional(S.String).pipe(
    T.JsonName("constantInitializationVector"),
  ),
  EncryptionMethod: S.optional(S.String).pipe(T.JsonName("encryptionMethod")),
  KeyRotationIntervalSeconds: S.optional(S.Number).pipe(
    T.JsonName("keyRotationIntervalSeconds"),
  ),
  RepeatExtXKey: S.optional(S.Boolean).pipe(T.JsonName("repeatExtXKey")),
  SpekeKeyProvider: SpekeKeyProvider.pipe(T.JsonName("spekeKeyProvider")),
}) {}
export class HlsPackage extends S.Class<HlsPackage>("HlsPackage")({
  AdMarkers: S.optional(S.String).pipe(T.JsonName("adMarkers")),
  AdTriggers: S.optional(AdTriggers).pipe(T.JsonName("adTriggers")),
  AdsOnDeliveryRestrictions: S.optional(S.String).pipe(
    T.JsonName("adsOnDeliveryRestrictions"),
  ),
  Encryption: S.optional(HlsEncryption).pipe(T.JsonName("encryption")),
  IncludeDvbSubtitles: S.optional(S.Boolean).pipe(
    T.JsonName("includeDvbSubtitles"),
  ),
  IncludeIframeOnlyStream: S.optional(S.Boolean).pipe(
    T.JsonName("includeIframeOnlyStream"),
  ),
  PlaylistType: S.optional(S.String).pipe(T.JsonName("playlistType")),
  PlaylistWindowSeconds: S.optional(S.Number).pipe(
    T.JsonName("playlistWindowSeconds"),
  ),
  ProgramDateTimeIntervalSeconds: S.optional(S.Number).pipe(
    T.JsonName("programDateTimeIntervalSeconds"),
  ),
  SegmentDurationSeconds: S.optional(S.Number).pipe(
    T.JsonName("segmentDurationSeconds"),
  ),
  StreamSelection: S.optional(StreamSelection).pipe(
    T.JsonName("streamSelection"),
  ),
  UseAudioRenditionGroup: S.optional(S.Boolean).pipe(
    T.JsonName("useAudioRenditionGroup"),
  ),
}) {}
export class MssEncryption extends S.Class<MssEncryption>("MssEncryption")({
  SpekeKeyProvider: SpekeKeyProvider.pipe(T.JsonName("spekeKeyProvider")),
}) {}
export class MssPackage extends S.Class<MssPackage>("MssPackage")({
  Encryption: S.optional(MssEncryption).pipe(T.JsonName("encryption")),
  ManifestWindowSeconds: S.optional(S.Number).pipe(
    T.JsonName("manifestWindowSeconds"),
  ),
  SegmentDurationSeconds: S.optional(S.Number).pipe(
    T.JsonName("segmentDurationSeconds"),
  ),
  StreamSelection: S.optional(StreamSelection).pipe(
    T.JsonName("streamSelection"),
  ),
}) {}
export class UpdateOriginEndpointRequest extends S.Class<UpdateOriginEndpointRequest>(
  "UpdateOriginEndpointRequest",
)(
  {
    Authorization: S.optional(Authorization).pipe(T.JsonName("authorization")),
    CmafPackage: S.optional(CmafPackageCreateOrUpdateParameters).pipe(
      T.JsonName("cmafPackage"),
    ),
    DashPackage: S.optional(DashPackage).pipe(T.JsonName("dashPackage")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    HlsPackage: S.optional(HlsPackage).pipe(T.JsonName("hlsPackage")),
    Id: S.String.pipe(T.HttpLabel("Id")),
    ManifestName: S.optional(S.String).pipe(T.JsonName("manifestName")),
    MssPackage: S.optional(MssPackage).pipe(T.JsonName("mssPackage")),
    Origination: S.optional(S.String).pipe(T.JsonName("origination")),
    StartoverWindowSeconds: S.optional(S.Number).pipe(
      T.JsonName("startoverWindowSeconds"),
    ),
    TimeDelaySeconds: S.optional(S.Number).pipe(T.JsonName("timeDelaySeconds")),
    Whitelist: S.optional(__listOf__string).pipe(T.JsonName("whitelist")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/origin_endpoints/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EgressAccessLogs extends S.Class<EgressAccessLogs>(
  "EgressAccessLogs",
)({ LogGroupName: S.optional(S.String).pipe(T.JsonName("logGroupName")) }) {}
export class IngressAccessLogs extends S.Class<IngressAccessLogs>(
  "IngressAccessLogs",
)({ LogGroupName: S.optional(S.String).pipe(T.JsonName("logGroupName")) }) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export class S3Destination extends S.Class<S3Destination>("S3Destination")({
  BucketName: S.String.pipe(T.JsonName("bucketName")),
  ManifestKey: S.String.pipe(T.JsonName("manifestKey")),
  RoleArn: S.String.pipe(T.JsonName("roleArn")),
}) {}
export const __mapOf__string = S.Record({ key: S.String, value: S.String });
export class ConfigureLogsRequest extends S.Class<ConfigureLogsRequest>(
  "ConfigureLogsRequest",
)(
  {
    EgressAccessLogs: S.optional(EgressAccessLogs).pipe(
      T.JsonName("egressAccessLogs"),
    ),
    Id: S.String.pipe(T.HttpLabel("Id")),
    IngressAccessLogs: S.optional(IngressAccessLogs).pipe(
      T.JsonName("ingressAccessLogs"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/channels/{Id}/configure_logs" }),
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
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Id: S.String.pipe(T.JsonName("id")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/channels" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateHarvestJobRequest extends S.Class<CreateHarvestJobRequest>(
  "CreateHarvestJobRequest",
)(
  {
    EndTime: S.String.pipe(T.JsonName("endTime")),
    Id: S.String.pipe(T.JsonName("id")),
    OriginEndpointId: S.String.pipe(T.JsonName("originEndpointId")),
    S3Destination: S3Destination.pipe(T.JsonName("s3Destination")),
    StartTime: S.String.pipe(T.JsonName("startTime")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/harvest_jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeHarvestJobResponse extends S.Class<DescribeHarvestJobResponse>(
  "DescribeHarvestJobResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
  CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
  EndTime: S.optional(S.String).pipe(T.JsonName("endTime")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  OriginEndpointId: S.optional(S.String).pipe(T.JsonName("originEndpointId")),
  S3Destination: S.optional(S3Destination).pipe(T.JsonName("s3Destination")),
  StartTime: S.optional(S.String).pipe(T.JsonName("startTime")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")) }) {}
export class IngestEndpoint extends S.Class<IngestEndpoint>("IngestEndpoint")({
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  Password: S.optional(S.String).pipe(T.JsonName("password")),
  Url: S.optional(S.String).pipe(T.JsonName("url")),
  Username: S.optional(S.String).pipe(T.JsonName("username")),
}) {}
export const __listOfIngestEndpoint = S.Array(IngestEndpoint);
export class HlsIngest extends S.Class<HlsIngest>("HlsIngest")({
  IngestEndpoints: S.optional(__listOfIngestEndpoint).pipe(
    T.JsonName("ingestEndpoints"),
  ),
}) {}
export class RotateChannelCredentialsResponse extends S.Class<RotateChannelCredentialsResponse>(
  "RotateChannelCredentialsResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  EgressAccessLogs: S.optional(EgressAccessLogs).pipe(
    T.JsonName("egressAccessLogs"),
  ),
  HlsIngest: S.optional(HlsIngest).pipe(T.JsonName("hlsIngest")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  IngressAccessLogs: S.optional(IngressAccessLogs).pipe(
    T.JsonName("ingressAccessLogs"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class RotateIngestEndpointCredentialsResponse extends S.Class<RotateIngestEndpointCredentialsResponse>(
  "RotateIngestEndpointCredentialsResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  EgressAccessLogs: S.optional(EgressAccessLogs).pipe(
    T.JsonName("egressAccessLogs"),
  ),
  HlsIngest: S.optional(HlsIngest).pipe(T.JsonName("hlsIngest")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  IngressAccessLogs: S.optional(IngressAccessLogs).pipe(
    T.JsonName("ingressAccessLogs"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
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
export class UpdateChannelResponse extends S.Class<UpdateChannelResponse>(
  "UpdateChannelResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  EgressAccessLogs: S.optional(EgressAccessLogs).pipe(
    T.JsonName("egressAccessLogs"),
  ),
  HlsIngest: S.optional(HlsIngest).pipe(T.JsonName("hlsIngest")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  IngressAccessLogs: S.optional(IngressAccessLogs).pipe(
    T.JsonName("ingressAccessLogs"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class HlsManifest extends S.Class<HlsManifest>("HlsManifest")({
  AdMarkers: S.optional(S.String).pipe(T.JsonName("adMarkers")),
  Id: S.String.pipe(T.JsonName("id")),
  IncludeIframeOnlyStream: S.optional(S.Boolean).pipe(
    T.JsonName("includeIframeOnlyStream"),
  ),
  ManifestName: S.optional(S.String).pipe(T.JsonName("manifestName")),
  PlaylistType: S.optional(S.String).pipe(T.JsonName("playlistType")),
  PlaylistWindowSeconds: S.optional(S.Number).pipe(
    T.JsonName("playlistWindowSeconds"),
  ),
  ProgramDateTimeIntervalSeconds: S.optional(S.Number).pipe(
    T.JsonName("programDateTimeIntervalSeconds"),
  ),
  Url: S.optional(S.String).pipe(T.JsonName("url")),
  AdTriggers: S.optional(AdTriggers).pipe(T.JsonName("adTriggers")),
  AdsOnDeliveryRestrictions: S.optional(S.String).pipe(
    T.JsonName("adsOnDeliveryRestrictions"),
  ),
}) {}
export const __listOfHlsManifest = S.Array(HlsManifest);
export class CmafPackage extends S.Class<CmafPackage>("CmafPackage")({
  Encryption: S.optional(CmafEncryption).pipe(T.JsonName("encryption")),
  HlsManifests: S.optional(__listOfHlsManifest).pipe(
    T.JsonName("hlsManifests"),
  ),
  SegmentDurationSeconds: S.optional(S.Number).pipe(
    T.JsonName("segmentDurationSeconds"),
  ),
  SegmentPrefix: S.optional(S.String).pipe(T.JsonName("segmentPrefix")),
  StreamSelection: S.optional(StreamSelection).pipe(
    T.JsonName("streamSelection"),
  ),
}) {}
export class UpdateOriginEndpointResponse extends S.Class<UpdateOriginEndpointResponse>(
  "UpdateOriginEndpointResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Authorization: S.optional(Authorization).pipe(T.JsonName("authorization")),
  ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
  CmafPackage: S.optional(CmafPackage).pipe(T.JsonName("cmafPackage")),
  CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
  DashPackage: S.optional(DashPackage).pipe(T.JsonName("dashPackage")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  HlsPackage: S.optional(HlsPackage).pipe(T.JsonName("hlsPackage")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  ManifestName: S.optional(S.String).pipe(T.JsonName("manifestName")),
  MssPackage: S.optional(MssPackage).pipe(T.JsonName("mssPackage")),
  Origination: S.optional(S.String).pipe(T.JsonName("origination")),
  StartoverWindowSeconds: S.optional(S.Number).pipe(
    T.JsonName("startoverWindowSeconds"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  TimeDelaySeconds: S.optional(S.Number).pipe(T.JsonName("timeDelaySeconds")),
  Url: S.optional(S.String).pipe(T.JsonName("url")),
  Whitelist: S.optional(__listOf__string).pipe(T.JsonName("whitelist")),
}) {}
export class Channel extends S.Class<Channel>("Channel")({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  EgressAccessLogs: S.optional(EgressAccessLogs).pipe(
    T.JsonName("egressAccessLogs"),
  ),
  HlsIngest: S.optional(HlsIngest).pipe(T.JsonName("hlsIngest")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  IngressAccessLogs: S.optional(IngressAccessLogs).pipe(
    T.JsonName("ingressAccessLogs"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export const __listOfChannel = S.Array(Channel);
export class HarvestJob extends S.Class<HarvestJob>("HarvestJob")({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
  CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
  EndTime: S.optional(S.String).pipe(T.JsonName("endTime")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  OriginEndpointId: S.optional(S.String).pipe(T.JsonName("originEndpointId")),
  S3Destination: S.optional(S3Destination).pipe(T.JsonName("s3Destination")),
  StartTime: S.optional(S.String).pipe(T.JsonName("startTime")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export const __listOfHarvestJob = S.Array(HarvestJob);
export class OriginEndpoint extends S.Class<OriginEndpoint>("OriginEndpoint")({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Authorization: S.optional(Authorization).pipe(T.JsonName("authorization")),
  ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
  CmafPackage: S.optional(CmafPackage).pipe(T.JsonName("cmafPackage")),
  CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
  DashPackage: S.optional(DashPackage).pipe(T.JsonName("dashPackage")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  HlsPackage: S.optional(HlsPackage).pipe(T.JsonName("hlsPackage")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  ManifestName: S.optional(S.String).pipe(T.JsonName("manifestName")),
  MssPackage: S.optional(MssPackage).pipe(T.JsonName("mssPackage")),
  Origination: S.optional(S.String).pipe(T.JsonName("origination")),
  StartoverWindowSeconds: S.optional(S.Number).pipe(
    T.JsonName("startoverWindowSeconds"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  TimeDelaySeconds: S.optional(S.Number).pipe(T.JsonName("timeDelaySeconds")),
  Url: S.optional(S.String).pipe(T.JsonName("url")),
  Whitelist: S.optional(__listOf__string).pipe(T.JsonName("whitelist")),
}) {}
export const __listOfOriginEndpoint = S.Array(OriginEndpoint);
export class ConfigureLogsResponse extends S.Class<ConfigureLogsResponse>(
  "ConfigureLogsResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  EgressAccessLogs: S.optional(EgressAccessLogs).pipe(
    T.JsonName("egressAccessLogs"),
  ),
  HlsIngest: S.optional(HlsIngest).pipe(T.JsonName("hlsIngest")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  IngressAccessLogs: S.optional(IngressAccessLogs).pipe(
    T.JsonName("ingressAccessLogs"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class CreateChannelResponse extends S.Class<CreateChannelResponse>(
  "CreateChannelResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  EgressAccessLogs: S.optional(EgressAccessLogs).pipe(
    T.JsonName("egressAccessLogs"),
  ),
  HlsIngest: S.optional(HlsIngest).pipe(T.JsonName("hlsIngest")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  IngressAccessLogs: S.optional(IngressAccessLogs).pipe(
    T.JsonName("ingressAccessLogs"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class CreateHarvestJobResponse extends S.Class<CreateHarvestJobResponse>(
  "CreateHarvestJobResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
  CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
  EndTime: S.optional(S.String).pipe(T.JsonName("endTime")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  OriginEndpointId: S.optional(S.String).pipe(T.JsonName("originEndpointId")),
  S3Destination: S.optional(S3Destination).pipe(T.JsonName("s3Destination")),
  StartTime: S.optional(S.String).pipe(T.JsonName("startTime")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class ListChannelsResponse extends S.Class<ListChannelsResponse>(
  "ListChannelsResponse",
)({
  Channels: S.optional(__listOfChannel).pipe(T.JsonName("channels")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListHarvestJobsResponse extends S.Class<ListHarvestJobsResponse>(
  "ListHarvestJobsResponse",
)({
  HarvestJobs: S.optional(__listOfHarvestJob).pipe(T.JsonName("harvestJobs")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListOriginEndpointsResponse extends S.Class<ListOriginEndpointsResponse>(
  "ListOriginEndpointsResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  OriginEndpoints: S.optional(__listOfOriginEndpoint).pipe(
    T.JsonName("originEndpoints"),
  ),
}) {}
export class DescribeChannelResponse extends S.Class<DescribeChannelResponse>(
  "DescribeChannelResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  EgressAccessLogs: S.optional(EgressAccessLogs).pipe(
    T.JsonName("egressAccessLogs"),
  ),
  HlsIngest: S.optional(HlsIngest).pipe(T.JsonName("hlsIngest")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  IngressAccessLogs: S.optional(IngressAccessLogs).pipe(
    T.JsonName("ingressAccessLogs"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class DescribeOriginEndpointResponse extends S.Class<DescribeOriginEndpointResponse>(
  "DescribeOriginEndpointResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Authorization: S.optional(Authorization).pipe(T.JsonName("authorization")),
  ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
  CmafPackage: S.optional(CmafPackage).pipe(T.JsonName("cmafPackage")),
  CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
  DashPackage: S.optional(DashPackage).pipe(T.JsonName("dashPackage")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  HlsPackage: S.optional(HlsPackage).pipe(T.JsonName("hlsPackage")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  ManifestName: S.optional(S.String).pipe(T.JsonName("manifestName")),
  MssPackage: S.optional(MssPackage).pipe(T.JsonName("mssPackage")),
  Origination: S.optional(S.String).pipe(T.JsonName("origination")),
  StartoverWindowSeconds: S.optional(S.Number).pipe(
    T.JsonName("startoverWindowSeconds"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  TimeDelaySeconds: S.optional(S.Number).pipe(T.JsonName("timeDelaySeconds")),
  Url: S.optional(S.String).pipe(T.JsonName("url")),
  Whitelist: S.optional(__listOf__string).pipe(T.JsonName("whitelist")),
}) {}
export class CreateOriginEndpointRequest extends S.Class<CreateOriginEndpointRequest>(
  "CreateOriginEndpointRequest",
)(
  {
    Authorization: S.optional(Authorization).pipe(T.JsonName("authorization")),
    ChannelId: S.String.pipe(T.JsonName("channelId")),
    CmafPackage: S.optional(CmafPackageCreateOrUpdateParameters).pipe(
      T.JsonName("cmafPackage"),
    ),
    DashPackage: S.optional(DashPackage).pipe(T.JsonName("dashPackage")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    HlsPackage: S.optional(HlsPackage).pipe(T.JsonName("hlsPackage")),
    Id: S.String.pipe(T.JsonName("id")),
    ManifestName: S.optional(S.String).pipe(T.JsonName("manifestName")),
    MssPackage: S.optional(MssPackage).pipe(T.JsonName("mssPackage")),
    Origination: S.optional(S.String).pipe(T.JsonName("origination")),
    StartoverWindowSeconds: S.optional(S.Number).pipe(
      T.JsonName("startoverWindowSeconds"),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    TimeDelaySeconds: S.optional(S.Number).pipe(T.JsonName("timeDelaySeconds")),
    Whitelist: S.optional(__listOf__string).pipe(T.JsonName("whitelist")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/origin_endpoints" }),
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
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Authorization: S.optional(Authorization).pipe(T.JsonName("authorization")),
  ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
  CmafPackage: S.optional(CmafPackage).pipe(T.JsonName("cmafPackage")),
  CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
  DashPackage: S.optional(DashPackage).pipe(T.JsonName("dashPackage")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  HlsPackage: S.optional(HlsPackage).pipe(T.JsonName("hlsPackage")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  ManifestName: S.optional(S.String).pipe(T.JsonName("manifestName")),
  MssPackage: S.optional(MssPackage).pipe(T.JsonName("mssPackage")),
  Origination: S.optional(S.String).pipe(T.JsonName("origination")),
  StartoverWindowSeconds: S.optional(S.Number).pipe(
    T.JsonName("startoverWindowSeconds"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  TimeDelaySeconds: S.optional(S.Number).pipe(T.JsonName("timeDelaySeconds")),
  Url: S.optional(S.String).pipe(T.JsonName("url")),
  Whitelist: S.optional(__listOf__string).pipe(T.JsonName("whitelist")),
}) {}

//# Errors
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class UnprocessableEntityException extends S.TaggedError<UnprocessableEntityException>()(
  "UnprocessableEntityException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
) {}

//# Operations
/**
 *
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [],
}));
/**
 *
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [],
}));
/**
 *
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [],
}));
/**
 * Deletes an existing Channel.
 */
export const deleteChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeOriginEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Returns a collection of Channels.
 */
export const listChannels = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Returns a collection of HarvestJob records.
 */
export const listHarvestJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Returns a collection of OriginEndpoint records.
 */
export const listOriginEndpoints =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeHarvestJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const rotateChannelCredentials = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Rotate the IngestEndpoint's username and password, as specified by the IngestEndpoint's id.
 */
export const rotateIngestEndpointCredentials =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateOriginEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Deletes an existing OriginEndpoint.
 */
export const deleteOriginEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Changes the Channel's properities to configure log subscription
 */
export const configureLogs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createHarvestJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createOriginEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
