import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace("https://kinesisvideo.amazonaws.com/doc/2017-09-30/");
const svc = T.AwsApiService({
  sdkId: "Kinesis Video",
  serviceShapeName: "KinesisVideo_20170930",
});
const auth = T.AwsAuthSigv4({ name: "kinesisvideo" });
const ver = T.ServiceVersion("2017-09-30");
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
                        url: "https://kinesisvideo-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://kinesisvideo-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://kinesisvideo.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://kinesisvideo.{Region}.{PartitionResult#dnsSuffix}",
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
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export const TagKeyList = S.Array(S.String);
export class DeleteEdgeConfigurationInput extends S.Class<DeleteEdgeConfigurationInput>(
  "DeleteEdgeConfigurationInput",
)(
  { StreamName: S.optional(S.String), StreamARN: S.optional(S.String) },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/deleteEdgeConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEdgeConfigurationOutput extends S.Class<DeleteEdgeConfigurationOutput>(
  "DeleteEdgeConfigurationOutput",
)({}, ns) {}
export class DeleteSignalingChannelInput extends S.Class<DeleteSignalingChannelInput>(
  "DeleteSignalingChannelInput",
)(
  { ChannelARN: S.String, CurrentVersion: S.optional(S.String) },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/deleteSignalingChannel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSignalingChannelOutput extends S.Class<DeleteSignalingChannelOutput>(
  "DeleteSignalingChannelOutput",
)({}, ns) {}
export class DeleteStreamInput extends S.Class<DeleteStreamInput>(
  "DeleteStreamInput",
)(
  { StreamARN: S.String, CurrentVersion: S.optional(S.String) },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/deleteStream" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteStreamOutput extends S.Class<DeleteStreamOutput>(
  "DeleteStreamOutput",
)({}, ns) {}
export class DescribeEdgeConfigurationInput extends S.Class<DescribeEdgeConfigurationInput>(
  "DescribeEdgeConfigurationInput",
)(
  { StreamName: S.optional(S.String), StreamARN: S.optional(S.String) },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/describeEdgeConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeImageGenerationConfigurationInput extends S.Class<DescribeImageGenerationConfigurationInput>(
  "DescribeImageGenerationConfigurationInput",
)(
  { StreamName: S.optional(S.String), StreamARN: S.optional(S.String) },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/describeImageGenerationConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeMappedResourceConfigurationInput extends S.Class<DescribeMappedResourceConfigurationInput>(
  "DescribeMappedResourceConfigurationInput",
)(
  {
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/describeMappedResourceConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeMediaStorageConfigurationInput extends S.Class<DescribeMediaStorageConfigurationInput>(
  "DescribeMediaStorageConfigurationInput",
)(
  { ChannelName: S.optional(S.String), ChannelARN: S.optional(S.String) },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/describeMediaStorageConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeNotificationConfigurationInput extends S.Class<DescribeNotificationConfigurationInput>(
  "DescribeNotificationConfigurationInput",
)(
  { StreamName: S.optional(S.String), StreamARN: S.optional(S.String) },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/describeNotificationConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeSignalingChannelInput extends S.Class<DescribeSignalingChannelInput>(
  "DescribeSignalingChannelInput",
)(
  { ChannelName: S.optional(S.String), ChannelARN: S.optional(S.String) },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/describeSignalingChannel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeStreamInput extends S.Class<DescribeStreamInput>(
  "DescribeStreamInput",
)(
  { StreamName: S.optional(S.String), StreamARN: S.optional(S.String) },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/describeStream" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeStreamStorageConfigurationInput extends S.Class<DescribeStreamStorageConfigurationInput>(
  "DescribeStreamStorageConfigurationInput",
)(
  { StreamName: S.optional(S.String), StreamARN: S.optional(S.String) },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/describeStreamStorageConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataEndpointInput extends S.Class<GetDataEndpointInput>(
  "GetDataEndpointInput",
)(
  {
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    APIName: S.String,
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/getDataEndpoint" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEdgeAgentConfigurationsInput extends S.Class<ListEdgeAgentConfigurationsInput>(
  "ListEdgeAgentConfigurationsInput",
)(
  {
    HubDeviceArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/listEdgeAgentConfigurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
)(
  { NextToken: S.optional(S.String), ResourceARN: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/ListTagsForResource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForStreamInput extends S.Class<ListTagsForStreamInput>(
  "ListTagsForStreamInput",
)(
  {
    NextToken: S.optional(S.String),
    StreamARN: S.optional(S.String),
    StreamName: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/listTagsForStream" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { ResourceARN: S.String, Tags: TagList },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/TagResource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceOutput extends S.Class<TagResourceOutput>(
  "TagResourceOutput",
)({}, ns) {}
export const ResourceTags = S.Record({ key: S.String, value: S.String });
export class TagStreamInput extends S.Class<TagStreamInput>("TagStreamInput")(
  {
    StreamARN: S.optional(S.String),
    StreamName: S.optional(S.String),
    Tags: ResourceTags,
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/tagStream" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagStreamOutput extends S.Class<TagStreamOutput>(
  "TagStreamOutput",
)({}, ns) {}
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  { ResourceARN: S.String, TagKeyList: TagKeyList },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/UntagResource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({}, ns) {}
export class UntagStreamInput extends S.Class<UntagStreamInput>(
  "UntagStreamInput",
)(
  {
    StreamARN: S.optional(S.String),
    StreamName: S.optional(S.String),
    TagKeyList: TagKeyList,
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/untagStream" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagStreamOutput extends S.Class<UntagStreamOutput>(
  "UntagStreamOutput",
)({}, ns) {}
export class UpdateDataRetentionInput extends S.Class<UpdateDataRetentionInput>(
  "UpdateDataRetentionInput",
)(
  {
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    CurrentVersion: S.String,
    Operation: S.String,
    DataRetentionChangeInHours: S.Number,
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/updateDataRetention" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDataRetentionOutput extends S.Class<UpdateDataRetentionOutput>(
  "UpdateDataRetentionOutput",
)({}, ns) {}
export class SingleMasterConfiguration extends S.Class<SingleMasterConfiguration>(
  "SingleMasterConfiguration",
)({ MessageTtlSeconds: S.optional(S.Number) }) {}
export class UpdateSignalingChannelInput extends S.Class<UpdateSignalingChannelInput>(
  "UpdateSignalingChannelInput",
)(
  {
    ChannelARN: S.String,
    CurrentVersion: S.String,
    SingleMasterConfiguration: S.optional(SingleMasterConfiguration),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/updateSignalingChannel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSignalingChannelOutput extends S.Class<UpdateSignalingChannelOutput>(
  "UpdateSignalingChannelOutput",
)({}, ns) {}
export class UpdateStreamInput extends S.Class<UpdateStreamInput>(
  "UpdateStreamInput",
)(
  {
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    CurrentVersion: S.String,
    DeviceName: S.optional(S.String),
    MediaType: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/updateStream" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateStreamOutput extends S.Class<UpdateStreamOutput>(
  "UpdateStreamOutput",
)({}, ns) {}
export class StreamStorageConfiguration extends S.Class<StreamStorageConfiguration>(
  "StreamStorageConfiguration",
)({ DefaultStorageTier: S.String }) {}
export class UpdateStreamStorageConfigurationInput extends S.Class<UpdateStreamStorageConfigurationInput>(
  "UpdateStreamStorageConfigurationInput",
)(
  {
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    CurrentVersion: S.String,
    StreamStorageConfiguration: StreamStorageConfiguration,
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/updateStreamStorageConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateStreamStorageConfigurationOutput extends S.Class<UpdateStreamStorageConfigurationOutput>(
  "UpdateStreamStorageConfigurationOutput",
)({}, ns) {}
export const ListOfProtocols = S.Array(S.String);
export const TagOnCreateList = S.Array(Tag);
export class SingleMasterChannelEndpointConfiguration extends S.Class<SingleMasterChannelEndpointConfiguration>(
  "SingleMasterChannelEndpointConfiguration",
)({ Protocols: S.optional(ListOfProtocols), Role: S.optional(S.String) }) {}
export class ChannelNameCondition extends S.Class<ChannelNameCondition>(
  "ChannelNameCondition",
)({
  ComparisonOperator: S.optional(S.String),
  ComparisonValue: S.optional(S.String),
}) {}
export class StreamNameCondition extends S.Class<StreamNameCondition>(
  "StreamNameCondition",
)({
  ComparisonOperator: S.optional(S.String),
  ComparisonValue: S.optional(S.String),
}) {}
export class MediaStorageConfiguration extends S.Class<MediaStorageConfiguration>(
  "MediaStorageConfiguration",
)({ StreamARN: S.optional(S.String), Status: S.String }) {}
export class CreateSignalingChannelInput extends S.Class<CreateSignalingChannelInput>(
  "CreateSignalingChannelInput",
)(
  {
    ChannelName: S.String,
    ChannelType: S.optional(S.String),
    SingleMasterConfiguration: S.optional(SingleMasterConfiguration),
    Tags: S.optional(TagOnCreateList),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/createSignalingChannel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateStreamInput extends S.Class<CreateStreamInput>(
  "CreateStreamInput",
)(
  {
    DeviceName: S.optional(S.String),
    StreamName: S.String,
    MediaType: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    DataRetentionInHours: S.optional(S.Number),
    Tags: S.optional(ResourceTags),
    StreamStorageConfiguration: S.optional(StreamStorageConfiguration),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/createStream" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ImageGenerationDestinationConfig extends S.Class<ImageGenerationDestinationConfig>(
  "ImageGenerationDestinationConfig",
)({ Uri: S.String, DestinationRegion: S.String }) {}
export const FormatConfig = S.Record({ key: S.String, value: S.String });
export class ImageGenerationConfiguration extends S.Class<ImageGenerationConfiguration>(
  "ImageGenerationConfiguration",
)({
  Status: S.String,
  ImageSelectorType: S.String,
  DestinationConfig: ImageGenerationDestinationConfig,
  SamplingInterval: S.Number,
  Format: S.String,
  FormatConfig: S.optional(FormatConfig),
  WidthPixels: S.optional(S.Number),
  HeightPixels: S.optional(S.Number),
}) {}
export class DescribeImageGenerationConfigurationOutput extends S.Class<DescribeImageGenerationConfigurationOutput>(
  "DescribeImageGenerationConfigurationOutput",
)(
  { ImageGenerationConfiguration: S.optional(ImageGenerationConfiguration) },
  ns,
) {}
export class DescribeMediaStorageConfigurationOutput extends S.Class<DescribeMediaStorageConfigurationOutput>(
  "DescribeMediaStorageConfigurationOutput",
)({ MediaStorageConfiguration: S.optional(MediaStorageConfiguration) }, ns) {}
export class NotificationDestinationConfig extends S.Class<NotificationDestinationConfig>(
  "NotificationDestinationConfig",
)({ Uri: S.String }) {}
export class NotificationConfiguration extends S.Class<NotificationConfiguration>(
  "NotificationConfiguration",
)({ Status: S.String, DestinationConfig: NotificationDestinationConfig }) {}
export class DescribeNotificationConfigurationOutput extends S.Class<DescribeNotificationConfigurationOutput>(
  "DescribeNotificationConfigurationOutput",
)({ NotificationConfiguration: S.optional(NotificationConfiguration) }, ns) {}
export class DescribeStreamStorageConfigurationOutput extends S.Class<DescribeStreamStorageConfigurationOutput>(
  "DescribeStreamStorageConfigurationOutput",
)(
  {
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    StreamStorageConfiguration: S.optional(StreamStorageConfiguration),
  },
  ns,
) {}
export class GetDataEndpointOutput extends S.Class<GetDataEndpointOutput>(
  "GetDataEndpointOutput",
)({ DataEndpoint: S.optional(S.String) }, ns) {}
export class GetSignalingChannelEndpointInput extends S.Class<GetSignalingChannelEndpointInput>(
  "GetSignalingChannelEndpointInput",
)(
  {
    ChannelARN: S.String,
    SingleMasterChannelEndpointConfiguration: S.optional(
      SingleMasterChannelEndpointConfiguration,
    ),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/getSignalingChannelEndpoint" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSignalingChannelsInput extends S.Class<ListSignalingChannelsInput>(
  "ListSignalingChannelsInput",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ChannelNameCondition: S.optional(ChannelNameCondition),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/listSignalingChannels" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListStreamsInput extends S.Class<ListStreamsInput>(
  "ListStreamsInput",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    StreamNameCondition: S.optional(StreamNameCondition),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/listStreams" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ NextToken: S.optional(S.String), Tags: S.optional(ResourceTags) }, ns) {}
export class ListTagsForStreamOutput extends S.Class<ListTagsForStreamOutput>(
  "ListTagsForStreamOutput",
)({ NextToken: S.optional(S.String), Tags: S.optional(ResourceTags) }, ns) {}
export class UpdateMediaStorageConfigurationInput extends S.Class<UpdateMediaStorageConfigurationInput>(
  "UpdateMediaStorageConfigurationInput",
)(
  {
    ChannelARN: S.String,
    MediaStorageConfiguration: MediaStorageConfiguration,
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/updateMediaStorageConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateMediaStorageConfigurationOutput extends S.Class<UpdateMediaStorageConfigurationOutput>(
  "UpdateMediaStorageConfigurationOutput",
)({}, ns) {}
export class ScheduleConfig extends S.Class<ScheduleConfig>("ScheduleConfig")({
  ScheduleExpression: S.String,
  DurationInSeconds: S.Number,
}) {}
export class UploaderConfig extends S.Class<UploaderConfig>("UploaderConfig")({
  ScheduleConfig: ScheduleConfig,
}) {}
export class MappedResourceConfigurationListItem extends S.Class<MappedResourceConfigurationListItem>(
  "MappedResourceConfigurationListItem",
)({ Type: S.optional(S.String), ARN: S.optional(S.String) }) {}
export const MappedResourceConfigurationList = S.Array(
  MappedResourceConfigurationListItem,
);
export class ChannelInfo extends S.Class<ChannelInfo>("ChannelInfo")({
  ChannelName: S.optional(S.String),
  ChannelARN: S.optional(S.String),
  ChannelType: S.optional(S.String),
  ChannelStatus: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SingleMasterConfiguration: S.optional(SingleMasterConfiguration),
  Version: S.optional(S.String),
}) {}
export class StreamInfo extends S.Class<StreamInfo>("StreamInfo")({
  DeviceName: S.optional(S.String),
  StreamName: S.optional(S.String),
  StreamARN: S.optional(S.String),
  MediaType: S.optional(S.String),
  KmsKeyId: S.optional(S.String),
  Version: S.optional(S.String),
  Status: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DataRetentionInHours: S.optional(S.Number),
}) {}
export class MediaSourceConfig extends S.Class<MediaSourceConfig>(
  "MediaSourceConfig",
)({ MediaUriSecretArn: S.String, MediaUriType: S.String }) {}
export class RecorderConfig extends S.Class<RecorderConfig>("RecorderConfig")({
  MediaSourceConfig: MediaSourceConfig,
  ScheduleConfig: S.optional(ScheduleConfig),
}) {}
export class LocalSizeConfig extends S.Class<LocalSizeConfig>(
  "LocalSizeConfig",
)({
  MaxLocalMediaSizeInMB: S.optional(S.Number),
  StrategyOnFullSize: S.optional(S.String),
}) {}
export class DeletionConfig extends S.Class<DeletionConfig>("DeletionConfig")({
  EdgeRetentionInHours: S.optional(S.Number),
  LocalSizeConfig: S.optional(LocalSizeConfig),
  DeleteAfterUpload: S.optional(S.Boolean),
}) {}
export class EdgeConfig extends S.Class<EdgeConfig>("EdgeConfig")({
  HubDeviceArn: S.String,
  RecorderConfig: RecorderConfig,
  UploaderConfig: S.optional(UploaderConfig),
  DeletionConfig: S.optional(DeletionConfig),
}) {}
export class ListEdgeAgentConfigurationsEdgeConfig extends S.Class<ListEdgeAgentConfigurationsEdgeConfig>(
  "ListEdgeAgentConfigurationsEdgeConfig",
)({
  StreamName: S.optional(S.String),
  StreamARN: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SyncStatus: S.optional(S.String),
  FailedStatusDetails: S.optional(S.String),
  EdgeConfig: S.optional(EdgeConfig),
}) {}
export const ListEdgeAgentConfigurationsEdgeConfigList = S.Array(
  ListEdgeAgentConfigurationsEdgeConfig,
);
export const ChannelInfoList = S.Array(ChannelInfo);
export const StreamInfoList = S.Array(StreamInfo);
export class CreateSignalingChannelOutput extends S.Class<CreateSignalingChannelOutput>(
  "CreateSignalingChannelOutput",
)({ ChannelARN: S.optional(S.String) }, ns) {}
export class CreateStreamOutput extends S.Class<CreateStreamOutput>(
  "CreateStreamOutput",
)({ StreamARN: S.optional(S.String) }, ns) {}
export class DescribeMappedResourceConfigurationOutput extends S.Class<DescribeMappedResourceConfigurationOutput>(
  "DescribeMappedResourceConfigurationOutput",
)(
  {
    MappedResourceConfigurationList: S.optional(
      MappedResourceConfigurationList,
    ),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeSignalingChannelOutput extends S.Class<DescribeSignalingChannelOutput>(
  "DescribeSignalingChannelOutput",
)({ ChannelInfo: S.optional(ChannelInfo) }, ns) {}
export class DescribeStreamOutput extends S.Class<DescribeStreamOutput>(
  "DescribeStreamOutput",
)({ StreamInfo: S.optional(StreamInfo) }, ns) {}
export class ListEdgeAgentConfigurationsOutput extends S.Class<ListEdgeAgentConfigurationsOutput>(
  "ListEdgeAgentConfigurationsOutput",
)(
  {
    EdgeConfigs: S.optional(ListEdgeAgentConfigurationsEdgeConfigList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListSignalingChannelsOutput extends S.Class<ListSignalingChannelsOutput>(
  "ListSignalingChannelsOutput",
)(
  {
    ChannelInfoList: S.optional(ChannelInfoList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListStreamsOutput extends S.Class<ListStreamsOutput>(
  "ListStreamsOutput",
)(
  {
    StreamInfoList: S.optional(StreamInfoList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class UpdateImageGenerationConfigurationInput extends S.Class<UpdateImageGenerationConfigurationInput>(
  "UpdateImageGenerationConfigurationInput",
)(
  {
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    ImageGenerationConfiguration: S.optional(ImageGenerationConfiguration),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/updateImageGenerationConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateImageGenerationConfigurationOutput extends S.Class<UpdateImageGenerationConfigurationOutput>(
  "UpdateImageGenerationConfigurationOutput",
)({}, ns) {}
export class UpdateNotificationConfigurationInput extends S.Class<UpdateNotificationConfigurationInput>(
  "UpdateNotificationConfigurationInput",
)(
  {
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    NotificationConfiguration: S.optional(NotificationConfiguration),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/updateNotificationConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateNotificationConfigurationOutput extends S.Class<UpdateNotificationConfigurationOutput>(
  "UpdateNotificationConfigurationOutput",
)({}, ns) {}
export class LastRecorderStatus extends S.Class<LastRecorderStatus>(
  "LastRecorderStatus",
)({
  JobStatusDetails: S.optional(S.String),
  LastCollectedTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RecorderStatus: S.optional(S.String),
}) {}
export class LastUploaderStatus extends S.Class<LastUploaderStatus>(
  "LastUploaderStatus",
)({
  JobStatusDetails: S.optional(S.String),
  LastCollectedTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UploaderStatus: S.optional(S.String),
}) {}
export class EdgeAgentStatus extends S.Class<EdgeAgentStatus>(
  "EdgeAgentStatus",
)({
  LastRecorderStatus: S.optional(LastRecorderStatus),
  LastUploaderStatus: S.optional(LastUploaderStatus),
}) {}
export class ResourceEndpointListItem extends S.Class<ResourceEndpointListItem>(
  "ResourceEndpointListItem",
)({ Protocol: S.optional(S.String), ResourceEndpoint: S.optional(S.String) }) {}
export const ResourceEndpointList = S.Array(ResourceEndpointListItem);
export class DescribeEdgeConfigurationOutput extends S.Class<DescribeEdgeConfigurationOutput>(
  "DescribeEdgeConfigurationOutput",
)(
  {
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SyncStatus: S.optional(S.String),
    FailedStatusDetails: S.optional(S.String),
    EdgeConfig: S.optional(EdgeConfig),
    EdgeAgentStatus: S.optional(EdgeAgentStatus),
  },
  ns,
) {}
export class GetSignalingChannelEndpointOutput extends S.Class<GetSignalingChannelEndpointOutput>(
  "GetSignalingChannelEndpointOutput",
)({ ResourceEndpointList: S.optional(ResourceEndpointList) }, ns) {}
export class StartEdgeConfigurationUpdateInput extends S.Class<StartEdgeConfigurationUpdateInput>(
  "StartEdgeConfigurationUpdateInput",
)(
  {
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    EdgeConfig: EdgeConfig,
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/startEdgeConfigurationUpdate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartEdgeConfigurationUpdateOutput extends S.Class<StartEdgeConfigurationUpdateOutput>(
  "StartEdgeConfigurationUpdateOutput",
)(
  {
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SyncStatus: S.optional(S.String),
    FailedStatusDetails: S.optional(S.String),
    EdgeConfig: S.optional(EdgeConfig),
  },
  ns,
) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
) {}
export class ClientLimitExceededException extends S.TaggedError<ClientLimitExceededException>()(
  "ClientLimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class InvalidArgumentException extends S.TaggedError<InvalidArgumentException>()(
  "InvalidArgumentException",
  { Message: S.optional(S.String) },
) {}
export class AccountChannelLimitExceededException extends S.TaggedError<AccountChannelLimitExceededException>()(
  "AccountChannelLimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class AccountStreamLimitExceededException extends S.TaggedError<AccountStreamLimitExceededException>()(
  "AccountStreamLimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class NotAuthorizedException extends S.TaggedError<NotAuthorizedException>()(
  "NotAuthorizedException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class NoDataRetentionException extends S.TaggedError<NoDataRetentionException>()(
  "NoDataRetentionException",
  { Message: S.optional(S.String) },
) {}
export class InvalidResourceFormatException extends S.TaggedError<InvalidResourceFormatException>()(
  "InvalidResourceFormatException",
  { Message: S.optional(S.String) },
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { Message: S.optional(S.String) },
) {}
export class DeviceStreamLimitExceededException extends S.TaggedError<DeviceStreamLimitExceededException>()(
  "DeviceStreamLimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class VersionMismatchException extends S.TaggedError<VersionMismatchException>()(
  "VersionMismatchException",
  { Message: S.optional(S.String) },
) {}
export class TagsPerResourceExceededLimitException extends S.TaggedError<TagsPerResourceExceededLimitException>()(
  "TagsPerResourceExceededLimitException",
  { Message: S.optional(S.String) },
) {}
export class StreamEdgeConfigurationNotFoundException extends S.TaggedError<StreamEdgeConfigurationNotFoundException>()(
  "StreamEdgeConfigurationNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class InvalidDeviceException extends S.TaggedError<InvalidDeviceException>()(
  "InvalidDeviceException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns an array of `ChannelInfo` objects. Each object describes a
 * signaling channel. To retrieve only those channels that satisfy a specific condition,
 * you can specify a `ChannelNameCondition`.
 */
export const listSignalingChannels =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSignalingChannelsInput,
    output: ListSignalingChannelsOutput,
    errors: [
      AccessDeniedException,
      ClientLimitExceededException,
      InvalidArgumentException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ChannelInfoList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns an array of `StreamInfo` objects. Each object describes a
 * stream. To retrieve only streams that satisfy a specific condition, you can specify a
 * `StreamNameCondition`.
 */
export const listStreams = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListStreamsInput,
    output: ListStreamsOutput,
    errors: [ClientLimitExceededException, InvalidArgumentException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "StreamInfoList",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns the most current information about the stream. The `streamName`
 * or `streamARN` should be provided in the input.
 */
export const describeMappedResourceConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeMappedResourceConfigurationInput,
    output: DescribeMappedResourceConfigurationOutput,
    errors: [
      AccessDeniedException,
      ClientLimitExceededException,
      InvalidArgumentException,
      ResourceNotFoundException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "MappedResourceConfigurationList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns a list of tags associated with the specified stream.
 *
 * In the request, you must specify either the `StreamName` or the
 * `StreamARN`.
 */
export const listTagsForStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForStreamInput,
  output: ListTagsForStreamOutput,
  errors: [
    ClientLimitExceededException,
    InvalidArgumentException,
    InvalidResourceFormatException,
    NotAuthorizedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns the most current information about the specified stream. You must specify
 * either the `StreamName` or the `StreamARN`.
 */
export const describeStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStreamInput,
  output: DescribeStreamOutput,
  errors: [
    ClientLimitExceededException,
    InvalidArgumentException,
    NotAuthorizedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns an array of edge configurations associated with the specified Edge Agent.
 *
 * In the request, you must specify the Edge Agent `HubDeviceArn`.
 */
export const listEdgeAgentConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListEdgeAgentConfigurationsInput,
    output: ListEdgeAgentConfigurationsOutput,
    errors: [
      ClientLimitExceededException,
      InvalidArgumentException,
      NotAuthorizedException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "EdgeConfigs",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Gets an endpoint for a specified stream for either reading or writing. Use this
 * endpoint in your application to read from the specified stream (using the
 * `GetMedia` or `GetMediaForFragmentList` operations) or write
 * to it (using the `PutMedia` operation).
 *
 * The returned endpoint does not have the API name appended. The client needs to
 * add the API name to the returned endpoint.
 *
 * In the request, specify the stream either by `StreamName` or
 * `StreamARN`.
 */
export const getDataEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataEndpointInput,
  output: GetDataEndpointOutput,
  errors: [
    ClientLimitExceededException,
    InvalidArgumentException,
    NotAuthorizedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns the most current information about the signaling channel. You must specify
 * either the name or the Amazon Resource Name (ARN) of the channel that you want to
 * describe.
 */
export const describeSignalingChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeSignalingChannelInput,
    output: DescribeSignalingChannelOutput,
    errors: [
      AccessDeniedException,
      ClientLimitExceededException,
      InvalidArgumentException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Gets the `ImageGenerationConfiguration` for a given Kinesis video stream.
 */
export const describeImageGenerationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeImageGenerationConfigurationInput,
    output: DescribeImageGenerationConfigurationOutput,
    errors: [
      AccessDeniedException,
      ClientLimitExceededException,
      InvalidArgumentException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Returns the most current information about the channel. Specify the `ChannelName`
 * or `ChannelARN` in the input.
 */
export const describeMediaStorageConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeMediaStorageConfigurationInput,
    output: DescribeMediaStorageConfigurationOutput,
    errors: [
      AccessDeniedException,
      ClientLimitExceededException,
      InvalidArgumentException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Gets the `NotificationConfiguration` for a given Kinesis video stream.
 */
export const describeNotificationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeNotificationConfigurationInput,
    output: DescribeNotificationConfigurationOutput,
    errors: [
      AccessDeniedException,
      ClientLimitExceededException,
      InvalidArgumentException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Retrieves the current storage configuration for the specified Kinesis video stream.
 *
 * In the request, you must specify either the `StreamName` or the `StreamARN`.
 *
 * You must have permissions for the `KinesisVideo:DescribeStreamStorageConfiguration` action.
 */
export const describeStreamStorageConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeStreamStorageConfigurationInput,
    output: DescribeStreamStorageConfigurationOutput,
    errors: [
      AccessDeniedException,
      ClientLimitExceededException,
      InvalidArgumentException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Returns a list of tags associated with the specified signaling channel.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    AccessDeniedException,
    ClientLimitExceededException,
    InvalidArgumentException,
    ResourceNotFoundException,
  ],
}));
/**
 * Removes one or more tags from a signaling channel. In the request, specify only a tag
 * key or keys; don't specify the value. If you specify a tag key that does not exist, it's
 * ignored.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [
    AccessDeniedException,
    ClientLimitExceededException,
    InvalidArgumentException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the notification information for a stream.
 */
export const updateNotificationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateNotificationConfigurationInput,
    output: UpdateNotificationConfigurationOutput,
    errors: [
      AccessDeniedException,
      ClientLimitExceededException,
      InvalidArgumentException,
      NoDataRetentionException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Associates a `SignalingChannel` to a stream to store the media. There are
 * two signaling modes that you can specify :
 *
 * - If `StorageStatus` is enabled, the data will be stored in the
 * `StreamARN` provided. In order for WebRTC Ingestion to work, the stream must have data retention
 * enabled.
 *
 * - If `StorageStatus` is disabled, no data will be stored, and the
 * `StreamARN` parameter will not be needed.
 *
 * If `StorageStatus` is enabled, direct peer-to-peer (master-viewer) connections no
 * longer occur. Peers connect directly to the storage session. You must call the
 * `JoinStorageSession` API to trigger an SDP offer send and establish a
 * connection between a peer and the storage session.
 */
export const updateMediaStorageConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateMediaStorageConfigurationInput,
    output: UpdateMediaStorageConfigurationOutput,
    errors: [
      AccessDeniedException,
      ClientLimitExceededException,
      InvalidArgumentException,
      NoDataRetentionException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Removes one or more tags from a stream. In the request, specify only a tag key or
 * keys; don't specify the value. If you specify a tag key that does not exist, it's
 * ignored.
 *
 * In the request, you must provide the `StreamName` or
 * `StreamARN`.
 */
export const untagStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagStreamInput,
  output: UntagStreamOutput,
  errors: [
    ClientLimitExceededException,
    InvalidArgumentException,
    InvalidResourceFormatException,
    NotAuthorizedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Provides an endpoint for the specified signaling channel to send and receive messages.
 * This API uses the `SingleMasterChannelEndpointConfiguration` input parameter,
 * which consists of the `Protocols` and `Role` properties.
 *
 * `Protocols` is used to determine the communication mechanism. For example,
 * if you specify `WSS` as the protocol, this API produces a secure websocket
 * endpoint. If you specify `HTTPS` as the protocol, this API generates an HTTPS
 * endpoint. If you specify `WEBRTC` as the protocol, but the signaling channel isn't
 * configured for ingestion, you will receive the error
 * `InvalidArgumentException`.
 *
 * `Role` determines the messaging permissions. A `MASTER` role
 * results in this API generating an endpoint that a client can use to communicate with any
 * of the viewers on the channel. A `VIEWER` role results in this API generating
 * an endpoint that a client can use to communicate only with a `MASTER`.
 */
export const getSignalingChannelEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSignalingChannelEndpointInput,
    output: GetSignalingChannelEndpointOutput,
    errors: [
      AccessDeniedException,
      ClientLimitExceededException,
      InvalidArgumentException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Updates the `StreamInfo` and `ImageProcessingConfiguration` fields.
 */
export const updateImageGenerationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateImageGenerationConfigurationInput,
    output: UpdateImageGenerationConfigurationOutput,
    errors: [
      AccessDeniedException,
      ClientLimitExceededException,
      InvalidArgumentException,
      NoDataRetentionException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }));
/**
 * An asynchronous API that updates a stream’s existing edge configuration.
 * The Kinesis Video Stream will sync the stream’s edge configuration with the Edge Agent IoT Greengrass
 * component that runs on an IoT Hub Device, setup at your premise. The time to sync can vary
 * and depends on the connectivity of the Hub Device.
 * The `SyncStatus` will be updated as the edge configuration is acknowledged,
 * and synced with the Edge Agent.
 *
 * If this API is invoked for the first time, a new edge configuration will be created for the stream,
 * and the sync status will be set to `SYNCING`. You will have to wait for the sync status
 * to reach a terminal state such as: `IN_SYNC`, or `SYNC_FAILED`, before using this API again.
 * If you invoke this API during the syncing process, a `ResourceInUseException` will be thrown.
 * The connectivity of the stream’s edge configuration and the Edge Agent will be retried for 15 minutes. After 15 minutes,
 * the status will transition into the `SYNC_FAILED` state.
 *
 * To move an edge configuration from one device to another, use DeleteEdgeConfiguration to delete
 * the current edge configuration. You can then invoke StartEdgeConfigurationUpdate with an updated Hub Device ARN.
 */
export const startEdgeConfigurationUpdate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartEdgeConfigurationUpdateInput,
    output: StartEdgeConfigurationUpdateOutput,
    errors: [
      AccessDeniedException,
      ClientLimitExceededException,
      InvalidArgumentException,
      NoDataRetentionException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Deletes a specified signaling channel. `DeleteSignalingChannel` is an
 * asynchronous operation. If you don't specify the channel's current version, the most
 * recent version is deleted.
 */
export const deleteSignalingChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSignalingChannelInput,
    output: DeleteSignalingChannelOutput,
    errors: [
      AccessDeniedException,
      ClientLimitExceededException,
      InvalidArgumentException,
      ResourceInUseException,
      ResourceNotFoundException,
      VersionMismatchException,
    ],
  }),
);
/**
 * Adds one or more tags to a signaling channel. A *tag* is a
 * key-value pair (the value is optional) that you can define and assign to Amazon Web Services resources.
 * If you specify a tag that already exists, the tag value is replaced with the value that
 * you specify in the request. For more information, see Using Cost Allocation
 * Tags in the Billing and Cost Management and Cost Management User
 * Guide.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    AccessDeniedException,
    ClientLimitExceededException,
    InvalidArgumentException,
    ResourceNotFoundException,
    TagsPerResourceExceededLimitException,
  ],
}));
/**
 * An asynchronous API that deletes a stream’s existing edge configuration, as well as the corresponding media from the Edge Agent.
 *
 * When you invoke this API, the sync status is set to `DELETING`. A deletion process starts, in which active edge jobs are stopped and all media is deleted from the edge device. The time to delete varies, depending on the total amount of stored media. If the deletion process fails, the sync status changes to `DELETE_FAILED`. You will need to re-try the deletion.
 *
 * When the deletion process has completed successfully, the edge configuration is no longer accessible.
 */
export const deleteEdgeConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteEdgeConfigurationInput,
    output: DeleteEdgeConfigurationOutput,
    errors: [
      AccessDeniedException,
      ClientLimitExceededException,
      InvalidArgumentException,
      ResourceNotFoundException,
      StreamEdgeConfigurationNotFoundException,
    ],
  }),
);
/**
 * Increases or decreases the stream's data retention period by the value that you
 * specify. To indicate whether you want to increase or decrease the data retention period,
 * specify the `Operation` parameter in the request body. In the request, you
 * must specify either the `StreamName` or the `StreamARN`.
 *
 * This operation requires permission for the
 * `KinesisVideo:UpdateDataRetention` action.
 *
 * Changing the data retention period affects the data in the stream as
 * follows:
 *
 * - If the data retention period is increased, existing data is retained for
 * the new retention period. For example, if the data retention period is increased
 * from one hour to seven hours, all existing data is retained for seven
 * hours.
 *
 * - If the data retention period is decreased, existing data is retained for
 * the new retention period. For example, if the data retention period is decreased
 * from seven hours to one hour, all existing data is retained for one hour, and
 * any data older than one hour is deleted immediately.
 */
export const updateDataRetention = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataRetentionInput,
  output: UpdateDataRetentionOutput,
  errors: [
    ClientLimitExceededException,
    InvalidArgumentException,
    NotAuthorizedException,
    ResourceInUseException,
    ResourceNotFoundException,
    VersionMismatchException,
  ],
}));
/**
 * Updates stream metadata, such as the device name and media type.
 *
 * You must provide the stream name or the Amazon Resource Name (ARN) of the
 * stream.
 *
 * To make sure that you have the latest version of the stream before updating it, you
 * can specify the stream version. Kinesis Video Streams assigns a version to each stream.
 * When you update a stream, Kinesis Video Streams assigns a new version number. To get the
 * latest stream version, use the `DescribeStream` API.
 *
 * `UpdateStream` is an asynchronous operation, and takes time to
 * complete.
 */
export const updateStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStreamInput,
  output: UpdateStreamOutput,
  errors: [
    ClientLimitExceededException,
    InvalidArgumentException,
    NotAuthorizedException,
    ResourceInUseException,
    ResourceNotFoundException,
    VersionMismatchException,
  ],
}));
/**
 * Updates the existing signaling channel. This is an asynchronous operation and takes
 * time to complete.
 *
 * If the `MessageTtlSeconds` value is updated (either increased or reduced),
 * it only applies to new messages sent via this channel after it's been updated. Existing
 * messages are still expired as per the previous `MessageTtlSeconds`
 * value.
 */
export const updateSignalingChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateSignalingChannelInput,
    output: UpdateSignalingChannelOutput,
    errors: [
      AccessDeniedException,
      ClientLimitExceededException,
      InvalidArgumentException,
      ResourceInUseException,
      ResourceNotFoundException,
      VersionMismatchException,
    ],
  }),
);
/**
 * Updates the storage configuration for an existing Kinesis video stream.
 *
 * This operation allows you to modify the storage tier settings for a stream, enabling you to optimize storage costs and performance based on your access patterns.
 *
 * `UpdateStreamStorageConfiguration` is an asynchronous operation.
 *
 * You must have permissions for the `KinesisVideo:UpdateStreamStorageConfiguration` action.
 */
export const updateStreamStorageConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateStreamStorageConfigurationInput,
    output: UpdateStreamStorageConfigurationOutput,
    errors: [
      AccessDeniedException,
      ClientLimitExceededException,
      InvalidArgumentException,
      ResourceInUseException,
      ResourceNotFoundException,
      VersionMismatchException,
    ],
  }));
/**
 * Deletes a Kinesis video stream and the data contained in the stream.
 *
 * This method marks the stream for deletion, and makes the data in the stream
 * inaccessible immediately.
 *
 * To ensure that you have the latest version of the stream before deleting it, you
 * can specify the stream version. Kinesis Video Streams assigns a version to each stream.
 * When you update a stream, Kinesis Video Streams assigns a new version number. To get the
 * latest stream version, use the `DescribeStream` API.
 *
 * This operation requires permission for the `KinesisVideo:DeleteStream`
 * action.
 */
export const deleteStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStreamInput,
  output: DeleteStreamOutput,
  errors: [
    ClientLimitExceededException,
    InvalidArgumentException,
    NotAuthorizedException,
    ResourceInUseException,
    ResourceNotFoundException,
    VersionMismatchException,
  ],
}));
/**
 * Adds one or more tags to a stream. A *tag* is a key-value pair
 * (the value is optional) that you can define and assign to Amazon Web Services resources. If you specify
 * a tag that already exists, the tag value is replaced with the value that you specify in
 * the request. For more information, see Using Cost Allocation
 * Tags in the *Billing and Cost Management and Cost Management User Guide*.
 *
 * You must provide either the `StreamName` or the
 * `StreamARN`.
 *
 * This operation requires permission for the `KinesisVideo:TagStream`
 * action.
 *
 * A Kinesis video stream can support up to 50 tags.
 */
export const tagStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagStreamInput,
  output: TagStreamOutput,
  errors: [
    ClientLimitExceededException,
    InvalidArgumentException,
    InvalidResourceFormatException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TagsPerResourceExceededLimitException,
  ],
}));
/**
 * Creates a signaling channel.
 *
 * `CreateSignalingChannel` is an asynchronous operation.
 */
export const createSignalingChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSignalingChannelInput,
    output: CreateSignalingChannelOutput,
    errors: [
      AccessDeniedException,
      AccountChannelLimitExceededException,
      ClientLimitExceededException,
      InvalidArgumentException,
      ResourceInUseException,
      TagsPerResourceExceededLimitException,
    ],
  }),
);
/**
 * Describes a stream’s edge configuration that was set using the
 * `StartEdgeConfigurationUpdate` API and the latest status of the edge
 * agent's recorder and uploader jobs. Use this API to get the status of the configuration
 * to determine if the configuration is in sync with the Edge Agent. Use this API to
 * evaluate the health of the Edge Agent.
 */
export const describeEdgeConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeEdgeConfigurationInput,
    output: DescribeEdgeConfigurationOutput,
    errors: [
      AccessDeniedException,
      ClientLimitExceededException,
      InvalidArgumentException,
      ResourceNotFoundException,
      StreamEdgeConfigurationNotFoundException,
    ],
  }),
);
/**
 * Creates a new Kinesis video stream.
 *
 * When you create a new stream, Kinesis Video Streams assigns it a version number.
 * When you change the stream's metadata, Kinesis Video Streams updates the version.
 *
 * `CreateStream` is an asynchronous operation.
 *
 * For information about how the service works, see How it Works.
 *
 * You must have permissions for the `KinesisVideo:CreateStream`
 * action.
 */
export const createStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStreamInput,
  output: CreateStreamOutput,
  errors: [
    AccountStreamLimitExceededException,
    ClientLimitExceededException,
    DeviceStreamLimitExceededException,
    InvalidArgumentException,
    InvalidDeviceException,
    ResourceInUseException,
    TagsPerResourceExceededLimitException,
  ],
}));
