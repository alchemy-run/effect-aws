import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "MediaPackage Vod",
  serviceShapeName: "MediaPackageVod",
});
const auth = T.AwsAuthSigv4({ name: "mediapackage-vod" });
const ver = T.ServiceVersion("2018-11-07");
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
                        url: "https://mediapackage-vod-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://mediapackage-vod-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://mediapackage-vod.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://mediapackage-vod.{Region}.{PartitionResult#dnsSuffix}",
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
export class DeleteAssetRequest extends S.Class<DeleteAssetRequest>(
  "DeleteAssetRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/assets/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAssetResponse extends S.Class<DeleteAssetResponse>(
  "DeleteAssetResponse",
)({}) {}
export class DeletePackagingConfigurationRequest extends S.Class<DeletePackagingConfigurationRequest>(
  "DeletePackagingConfigurationRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/packaging_configurations/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePackagingConfigurationResponse extends S.Class<DeletePackagingConfigurationResponse>(
  "DeletePackagingConfigurationResponse",
)({}) {}
export class DeletePackagingGroupRequest extends S.Class<DeletePackagingGroupRequest>(
  "DeletePackagingGroupRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/packaging_groups/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePackagingGroupResponse extends S.Class<DeletePackagingGroupResponse>(
  "DeletePackagingGroupResponse",
)({}) {}
export class DescribeAssetRequest extends S.Class<DescribeAssetRequest>(
  "DescribeAssetRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/assets/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribePackagingConfigurationRequest extends S.Class<DescribePackagingConfigurationRequest>(
  "DescribePackagingConfigurationRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/packaging_configurations/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribePackagingGroupRequest extends S.Class<DescribePackagingGroupRequest>(
  "DescribePackagingGroupRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/packaging_groups/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssetsRequest extends S.Class<ListAssetsRequest>(
  "ListAssetsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    PackagingGroupId: S.optional(S.String).pipe(
      T.HttpQuery("packagingGroupId"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/assets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPackagingConfigurationsRequest extends S.Class<ListPackagingConfigurationsRequest>(
  "ListPackagingConfigurationsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    PackagingGroupId: S.optional(S.String).pipe(
      T.HttpQuery("packagingGroupId"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/packaging_configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPackagingGroupsRequest extends S.Class<ListPackagingGroupsRequest>(
  "ListPackagingGroupsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/packaging_groups" }),
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
  { ResourceArn: S.String.pipe(T.HttpLabel()) },
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
    ResourceArn: S.String.pipe(T.HttpLabel()),
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
export class Authorization extends S.Class<Authorization>("Authorization")({
  CdnIdentifierSecret: S.String.pipe(T.JsonName("cdnIdentifierSecret")),
  SecretsRoleArn: S.String.pipe(T.JsonName("secretsRoleArn")),
}) {}
export class UpdatePackagingGroupRequest extends S.Class<UpdatePackagingGroupRequest>(
  "UpdatePackagingGroupRequest",
)(
  {
    Authorization: S.optional(Authorization).pipe(T.JsonName("authorization")),
    Id: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/packaging_groups/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const __listOf__PeriodTriggersElement = S.Array(S.String);
export class EgressAccessLogs extends S.Class<EgressAccessLogs>(
  "EgressAccessLogs",
)({ LogGroupName: S.optional(S.String).pipe(T.JsonName("logGroupName")) }) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export const __mapOf__string = S.Record({ key: S.String, value: S.String });
export class ConfigureLogsRequest extends S.Class<ConfigureLogsRequest>(
  "ConfigureLogsRequest",
)(
  {
    EgressAccessLogs: S.optional(EgressAccessLogs).pipe(
      T.JsonName("egressAccessLogs"),
    ),
    Id: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/packaging_groups/{Id}/configure_logs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAssetRequest extends S.Class<CreateAssetRequest>(
  "CreateAssetRequest",
)(
  {
    Id: S.String.pipe(T.JsonName("id")),
    PackagingGroupId: S.String.pipe(T.JsonName("packagingGroupId")),
    ResourceId: S.optional(S.String).pipe(T.JsonName("resourceId")),
    SourceArn: S.String.pipe(T.JsonName("sourceArn")),
    SourceRoleArn: S.String.pipe(T.JsonName("sourceRoleArn")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/assets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePackagingGroupRequest extends S.Class<CreatePackagingGroupRequest>(
  "CreatePackagingGroupRequest",
)(
  {
    Authorization: S.optional(Authorization).pipe(T.JsonName("authorization")),
    EgressAccessLogs: S.optional(EgressAccessLogs).pipe(
      T.JsonName("egressAccessLogs"),
    ),
    Id: S.String.pipe(T.JsonName("id")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/packaging_groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EncryptionContractConfiguration extends S.Class<EncryptionContractConfiguration>(
  "EncryptionContractConfiguration",
)({
  PresetSpeke20Audio: S.String.pipe(T.JsonName("presetSpeke20Audio")),
  PresetSpeke20Video: S.String.pipe(T.JsonName("presetSpeke20Video")),
}) {}
export class SpekeKeyProvider extends S.Class<SpekeKeyProvider>(
  "SpekeKeyProvider",
)({
  EncryptionContractConfiguration: S.optional(
    EncryptionContractConfiguration,
  ).pipe(T.JsonName("encryptionContractConfiguration")),
  RoleArn: S.String.pipe(T.JsonName("roleArn")),
  SystemIds: __listOf__string.pipe(T.JsonName("systemIds")),
  Url: S.String.pipe(T.JsonName("url")),
}) {}
export class CmafEncryption extends S.Class<CmafEncryption>("CmafEncryption")({
  ConstantInitializationVector: S.optional(S.String).pipe(
    T.JsonName("constantInitializationVector"),
  ),
  SpekeKeyProvider: SpekeKeyProvider.pipe(T.JsonName("spekeKeyProvider")),
}) {}
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
export class HlsManifest extends S.Class<HlsManifest>("HlsManifest")({
  AdMarkers: S.optional(S.String).pipe(T.JsonName("adMarkers")),
  IncludeIframeOnlyStream: S.optional(S.Boolean).pipe(
    T.JsonName("includeIframeOnlyStream"),
  ),
  ManifestName: S.optional(S.String).pipe(T.JsonName("manifestName")),
  ProgramDateTimeIntervalSeconds: S.optional(S.Number).pipe(
    T.JsonName("programDateTimeIntervalSeconds"),
  ),
  RepeatExtXKey: S.optional(S.Boolean).pipe(T.JsonName("repeatExtXKey")),
  StreamSelection: S.optional(StreamSelection).pipe(
    T.JsonName("streamSelection"),
  ),
}) {}
export const __listOfHlsManifest = S.Array(HlsManifest);
export class CmafPackage extends S.Class<CmafPackage>("CmafPackage")({
  Encryption: S.optional(CmafEncryption).pipe(T.JsonName("encryption")),
  HlsManifests: __listOfHlsManifest.pipe(T.JsonName("hlsManifests")),
  IncludeEncoderConfigurationInSegments: S.optional(S.Boolean).pipe(
    T.JsonName("includeEncoderConfigurationInSegments"),
  ),
  SegmentDurationSeconds: S.optional(S.Number).pipe(
    T.JsonName("segmentDurationSeconds"),
  ),
}) {}
export class DashManifest extends S.Class<DashManifest>("DashManifest")({
  ManifestLayout: S.optional(S.String).pipe(T.JsonName("manifestLayout")),
  ManifestName: S.optional(S.String).pipe(T.JsonName("manifestName")),
  MinBufferTimeSeconds: S.optional(S.Number).pipe(
    T.JsonName("minBufferTimeSeconds"),
  ),
  Profile: S.optional(S.String).pipe(T.JsonName("profile")),
  ScteMarkersSource: S.optional(S.String).pipe(T.JsonName("scteMarkersSource")),
  StreamSelection: S.optional(StreamSelection).pipe(
    T.JsonName("streamSelection"),
  ),
}) {}
export const __listOfDashManifest = S.Array(DashManifest);
export class DashEncryption extends S.Class<DashEncryption>("DashEncryption")({
  SpekeKeyProvider: SpekeKeyProvider.pipe(T.JsonName("spekeKeyProvider")),
}) {}
export class DashPackage extends S.Class<DashPackage>("DashPackage")({
  DashManifests: __listOfDashManifest.pipe(T.JsonName("dashManifests")),
  Encryption: S.optional(DashEncryption).pipe(T.JsonName("encryption")),
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
}) {}
export class HlsEncryption extends S.Class<HlsEncryption>("HlsEncryption")({
  ConstantInitializationVector: S.optional(S.String).pipe(
    T.JsonName("constantInitializationVector"),
  ),
  EncryptionMethod: S.optional(S.String).pipe(T.JsonName("encryptionMethod")),
  SpekeKeyProvider: SpekeKeyProvider.pipe(T.JsonName("spekeKeyProvider")),
}) {}
export class HlsPackage extends S.Class<HlsPackage>("HlsPackage")({
  Encryption: S.optional(HlsEncryption).pipe(T.JsonName("encryption")),
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
}) {}
export class MssEncryption extends S.Class<MssEncryption>("MssEncryption")({
  SpekeKeyProvider: SpekeKeyProvider.pipe(T.JsonName("spekeKeyProvider")),
}) {}
export class MssManifest extends S.Class<MssManifest>("MssManifest")({
  ManifestName: S.optional(S.String).pipe(T.JsonName("manifestName")),
  StreamSelection: S.optional(StreamSelection).pipe(
    T.JsonName("streamSelection"),
  ),
}) {}
export const __listOfMssManifest = S.Array(MssManifest);
export class MssPackage extends S.Class<MssPackage>("MssPackage")({
  Encryption: S.optional(MssEncryption).pipe(T.JsonName("encryption")),
  MssManifests: __listOfMssManifest.pipe(T.JsonName("mssManifests")),
  SegmentDurationSeconds: S.optional(S.Number).pipe(
    T.JsonName("segmentDurationSeconds"),
  ),
}) {}
export class DescribePackagingConfigurationResponse extends S.Class<DescribePackagingConfigurationResponse>(
  "DescribePackagingConfigurationResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CmafPackage: S.optional(CmafPackage).pipe(T.JsonName("cmafPackage")),
  CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
  DashPackage: S.optional(DashPackage).pipe(T.JsonName("dashPackage")),
  HlsPackage: S.optional(HlsPackage).pipe(T.JsonName("hlsPackage")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  MssPackage: S.optional(MssPackage).pipe(T.JsonName("mssPackage")),
  PackagingGroupId: S.optional(S.String).pipe(T.JsonName("packagingGroupId")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class DescribePackagingGroupResponse extends S.Class<DescribePackagingGroupResponse>(
  "DescribePackagingGroupResponse",
)({
  ApproximateAssetCount: S.optional(S.Number).pipe(
    T.JsonName("approximateAssetCount"),
  ),
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Authorization: S.optional(Authorization).pipe(T.JsonName("authorization")),
  CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
  DomainName: S.optional(S.String).pipe(T.JsonName("domainName")),
  EgressAccessLogs: S.optional(EgressAccessLogs).pipe(
    T.JsonName("egressAccessLogs"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel()),
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
export class UpdatePackagingGroupResponse extends S.Class<UpdatePackagingGroupResponse>(
  "UpdatePackagingGroupResponse",
)({
  ApproximateAssetCount: S.optional(S.Number).pipe(
    T.JsonName("approximateAssetCount"),
  ),
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Authorization: S.optional(Authorization).pipe(T.JsonName("authorization")),
  CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
  DomainName: S.optional(S.String).pipe(T.JsonName("domainName")),
  EgressAccessLogs: S.optional(EgressAccessLogs).pipe(
    T.JsonName("egressAccessLogs"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class EgressEndpoint extends S.Class<EgressEndpoint>("EgressEndpoint")({
  PackagingConfigurationId: S.optional(S.String).pipe(
    T.JsonName("packagingConfigurationId"),
  ),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  Url: S.optional(S.String).pipe(T.JsonName("url")),
}) {}
export const __listOfEgressEndpoint = S.Array(EgressEndpoint);
export class AssetShallow extends S.Class<AssetShallow>("AssetShallow")({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  PackagingGroupId: S.optional(S.String).pipe(T.JsonName("packagingGroupId")),
  ResourceId: S.optional(S.String).pipe(T.JsonName("resourceId")),
  SourceArn: S.optional(S.String).pipe(T.JsonName("sourceArn")),
  SourceRoleArn: S.optional(S.String).pipe(T.JsonName("sourceRoleArn")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export const __listOfAssetShallow = S.Array(AssetShallow);
export class PackagingConfiguration extends S.Class<PackagingConfiguration>(
  "PackagingConfiguration",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CmafPackage: S.optional(CmafPackage).pipe(T.JsonName("cmafPackage")),
  CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
  DashPackage: S.optional(DashPackage).pipe(T.JsonName("dashPackage")),
  HlsPackage: S.optional(HlsPackage).pipe(T.JsonName("hlsPackage")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  MssPackage: S.optional(MssPackage).pipe(T.JsonName("mssPackage")),
  PackagingGroupId: S.optional(S.String).pipe(T.JsonName("packagingGroupId")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export const __listOfPackagingConfiguration = S.Array(PackagingConfiguration);
export class PackagingGroup extends S.Class<PackagingGroup>("PackagingGroup")({
  ApproximateAssetCount: S.optional(S.Number).pipe(
    T.JsonName("approximateAssetCount"),
  ),
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Authorization: S.optional(Authorization).pipe(T.JsonName("authorization")),
  CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
  DomainName: S.optional(S.String).pipe(T.JsonName("domainName")),
  EgressAccessLogs: S.optional(EgressAccessLogs).pipe(
    T.JsonName("egressAccessLogs"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export const __listOfPackagingGroup = S.Array(PackagingGroup);
export class ConfigureLogsResponse extends S.Class<ConfigureLogsResponse>(
  "ConfigureLogsResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Authorization: S.optional(Authorization).pipe(T.JsonName("authorization")),
  CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
  DomainName: S.optional(S.String).pipe(T.JsonName("domainName")),
  EgressAccessLogs: S.optional(EgressAccessLogs).pipe(
    T.JsonName("egressAccessLogs"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class CreateAssetResponse extends S.Class<CreateAssetResponse>(
  "CreateAssetResponse",
)({
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
}) {}
export class CreatePackagingGroupResponse extends S.Class<CreatePackagingGroupResponse>(
  "CreatePackagingGroupResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Authorization: S.optional(Authorization).pipe(T.JsonName("authorization")),
  CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
  DomainName: S.optional(S.String).pipe(T.JsonName("domainName")),
  EgressAccessLogs: S.optional(EgressAccessLogs).pipe(
    T.JsonName("egressAccessLogs"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class DescribeAssetResponse extends S.Class<DescribeAssetResponse>(
  "DescribeAssetResponse",
)({
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
}) {}
export class ListAssetsResponse extends S.Class<ListAssetsResponse>(
  "ListAssetsResponse",
)({
  Assets: S.optional(__listOfAssetShallow).pipe(T.JsonName("assets")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListPackagingConfigurationsResponse extends S.Class<ListPackagingConfigurationsResponse>(
  "ListPackagingConfigurationsResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  PackagingConfigurations: S.optional(__listOfPackagingConfiguration).pipe(
    T.JsonName("packagingConfigurations"),
  ),
}) {}
export class ListPackagingGroupsResponse extends S.Class<ListPackagingGroupsResponse>(
  "ListPackagingGroupsResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  PackagingGroups: S.optional(__listOfPackagingGroup).pipe(
    T.JsonName("packagingGroups"),
  ),
}) {}
export class CreatePackagingConfigurationRequest extends S.Class<CreatePackagingConfigurationRequest>(
  "CreatePackagingConfigurationRequest",
)(
  {
    CmafPackage: S.optional(CmafPackage).pipe(T.JsonName("cmafPackage")),
    DashPackage: S.optional(DashPackage).pipe(T.JsonName("dashPackage")),
    HlsPackage: S.optional(HlsPackage).pipe(T.JsonName("hlsPackage")),
    Id: S.String.pipe(T.JsonName("id")),
    MssPackage: S.optional(MssPackage).pipe(T.JsonName("mssPackage")),
    PackagingGroupId: S.String.pipe(T.JsonName("packagingGroupId")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/packaging_configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePackagingConfigurationResponse extends S.Class<CreatePackagingConfigurationResponse>(
  "CreatePackagingConfigurationResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CmafPackage: S.optional(CmafPackage).pipe(T.JsonName("cmafPackage")),
  CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
  DashPackage: S.optional(DashPackage).pipe(T.JsonName("dashPackage")),
  HlsPackage: S.optional(HlsPackage).pipe(T.JsonName("hlsPackage")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  MssPackage: S.optional(MssPackage).pipe(T.JsonName("mssPackage")),
  PackagingGroupId: S.optional(S.String).pipe(T.JsonName("packagingGroupId")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}

//# Errors
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  {},
) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  {},
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {},
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  {},
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {},
) {}
export class UnprocessableEntityException extends S.TaggedError<UnprocessableEntityException>()(
  "UnprocessableEntityException",
  {},
) {}

//# Operations
/**
 * Removes tags from the specified resource. You can specify one or more tags to remove.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [],
}));
/**
 * Returns a description of a MediaPackage VOD PackagingConfiguration resource.
 */
export const describePackagingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describePackagingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Returns a list of the tags assigned to the specified resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [],
}));
/**
 * Adds tags to the specified resource. You can specify one or more tags to add.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [],
}));
/**
 * Updates a specific packaging group. You can't change the id attribute or any other system-generated attributes.
 */
export const updatePackagingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Changes the packaging group's properities to configure log subscription
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
 * Creates a new MediaPackage VOD Asset resource.
 */
export const createAsset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createPackagingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Deletes an existing MediaPackage VOD Asset resource.
 */
export const deleteAsset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a MediaPackage VOD PackagingConfiguration resource.
 */
export const deletePackagingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deletePackagingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Returns a description of a MediaPackage VOD Asset resource.
 */
export const describeAsset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAssets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Returns a collection of MediaPackage VOD PackagingConfiguration resources.
 */
export const listPackagingConfigurations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Returns a collection of MediaPackage VOD PackagingGroup resources.
 */
export const listPackagingGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a new MediaPackage VOD PackagingConfiguration resource.
 */
export const createPackagingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
