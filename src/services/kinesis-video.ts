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

//# Newtypes
export type ChannelName = string;
export type DeviceName = string;
export type StreamName = string;
export type MediaType = string;
export type KmsKeyId = string;
export type DataRetentionInHours = number;
export type ResourceARN = string;
export type Version = string;
export type MappedResourceConfigurationListLimit = number;
export type NextToken = string;
export type HubDeviceArn = string;
export type ListEdgeAgentConfigurationsInputLimit = number;
export type ListStreamsInputLimit = number;
export type TagKey = string;
export type DataRetentionChangeInHours = number;
export type MessageTtlSeconds = number;
export type TagValue = string;
export type SamplingInterval = number;
export type WidthPixels = number;
export type HeightPixels = number;
export type ErrorMessage = string;
export type FailedStatusDetails = string;
export type DataEndpoint = string;
export type EdgeRetentionInHours = number;
export type DestinationUri = string;
export type DestinationRegion = string;
export type FormatConfigValue = string;
export type Type = string;
export type MediaUriSecretArn = string | Redacted.Redacted<string>;
export type ScheduleExpression = string;
export type DurationInSeconds = number;
export type MaxLocalMediaSizeInMB = number;
export type JobStatusDetails = string;
export type ResourceEndpoint = string;

//# Schemas
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface DeleteEdgeConfigurationInput {
  StreamName?: string;
  StreamARN?: string;
}
export const DeleteEdgeConfigurationInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/deleteEdgeConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEdgeConfigurationInput",
}) as any as S.Schema<DeleteEdgeConfigurationInput>;
export interface DeleteEdgeConfigurationOutput {}
export const DeleteEdgeConfigurationOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteEdgeConfigurationOutput",
}) as any as S.Schema<DeleteEdgeConfigurationOutput>;
export interface DeleteSignalingChannelInput {
  ChannelARN: string;
  CurrentVersion?: string;
}
export const DeleteSignalingChannelInput = S.suspend(() =>
  S.Struct({ ChannelARN: S.String, CurrentVersion: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/deleteSignalingChannel" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSignalingChannelInput",
}) as any as S.Schema<DeleteSignalingChannelInput>;
export interface DeleteSignalingChannelOutput {}
export const DeleteSignalingChannelOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteSignalingChannelOutput",
}) as any as S.Schema<DeleteSignalingChannelOutput>;
export interface DeleteStreamInput {
  StreamARN: string;
  CurrentVersion?: string;
}
export const DeleteStreamInput = S.suspend(() =>
  S.Struct({ StreamARN: S.String, CurrentVersion: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/deleteStream" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteStreamInput",
}) as any as S.Schema<DeleteStreamInput>;
export interface DeleteStreamOutput {}
export const DeleteStreamOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteStreamOutput",
}) as any as S.Schema<DeleteStreamOutput>;
export interface DescribeEdgeConfigurationInput {
  StreamName?: string;
  StreamARN?: string;
}
export const DescribeEdgeConfigurationInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/describeEdgeConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeEdgeConfigurationInput",
}) as any as S.Schema<DescribeEdgeConfigurationInput>;
export interface DescribeImageGenerationConfigurationInput {
  StreamName?: string;
  StreamARN?: string;
}
export const DescribeImageGenerationConfigurationInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/describeImageGenerationConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeImageGenerationConfigurationInput",
}) as any as S.Schema<DescribeImageGenerationConfigurationInput>;
export interface DescribeMappedResourceConfigurationInput {
  StreamName?: string;
  StreamARN?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeMappedResourceConfigurationInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/describeMappedResourceConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeMappedResourceConfigurationInput",
}) as any as S.Schema<DescribeMappedResourceConfigurationInput>;
export interface DescribeMediaStorageConfigurationInput {
  ChannelName?: string;
  ChannelARN?: string;
}
export const DescribeMediaStorageConfigurationInput = S.suspend(() =>
  S.Struct({
    ChannelName: S.optional(S.String),
    ChannelARN: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/describeMediaStorageConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeMediaStorageConfigurationInput",
}) as any as S.Schema<DescribeMediaStorageConfigurationInput>;
export interface DescribeNotificationConfigurationInput {
  StreamName?: string;
  StreamARN?: string;
}
export const DescribeNotificationConfigurationInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/describeNotificationConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeNotificationConfigurationInput",
}) as any as S.Schema<DescribeNotificationConfigurationInput>;
export interface DescribeSignalingChannelInput {
  ChannelName?: string;
  ChannelARN?: string;
}
export const DescribeSignalingChannelInput = S.suspend(() =>
  S.Struct({
    ChannelName: S.optional(S.String),
    ChannelARN: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/describeSignalingChannel" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSignalingChannelInput",
}) as any as S.Schema<DescribeSignalingChannelInput>;
export interface DescribeStreamInput {
  StreamName?: string;
  StreamARN?: string;
}
export const DescribeStreamInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/describeStream" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeStreamInput",
}) as any as S.Schema<DescribeStreamInput>;
export interface DescribeStreamStorageConfigurationInput {
  StreamName?: string;
  StreamARN?: string;
}
export const DescribeStreamStorageConfigurationInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/describeStreamStorageConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeStreamStorageConfigurationInput",
}) as any as S.Schema<DescribeStreamStorageConfigurationInput>;
export interface GetDataEndpointInput {
  StreamName?: string;
  StreamARN?: string;
  APIName: string;
}
export const GetDataEndpointInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    APIName: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/getDataEndpoint" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDataEndpointInput",
}) as any as S.Schema<GetDataEndpointInput>;
export interface ListEdgeAgentConfigurationsInput {
  HubDeviceArn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListEdgeAgentConfigurationsInput = S.suspend(() =>
  S.Struct({
    HubDeviceArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/listEdgeAgentConfigurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEdgeAgentConfigurationsInput",
}) as any as S.Schema<ListEdgeAgentConfigurationsInput>;
export interface ListTagsForResourceInput {
  NextToken?: string;
  ResourceARN: string;
}
export const ListTagsForResourceInput = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String), ResourceARN: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/ListTagsForResource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceInput",
}) as any as S.Schema<ListTagsForResourceInput>;
export interface ListTagsForStreamInput {
  NextToken?: string;
  StreamARN?: string;
  StreamName?: string;
}
export const ListTagsForStreamInput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    StreamARN: S.optional(S.String),
    StreamName: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/listTagsForStream" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForStreamInput",
}) as any as S.Schema<ListTagsForStreamInput>;
export interface TagResourceInput {
  ResourceARN: string;
  Tags: TagList;
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: TagList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/TagResource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceInput",
}) as any as S.Schema<TagResourceInput>;
export interface TagResourceOutput {}
export const TagResourceOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceOutput",
}) as any as S.Schema<TagResourceOutput>;
export type ResourceTags = { [key: string]: string };
export const ResourceTags = S.Record({ key: S.String, value: S.String });
export interface TagStreamInput {
  StreamARN?: string;
  StreamName?: string;
  Tags: ResourceTags;
}
export const TagStreamInput = S.suspend(() =>
  S.Struct({
    StreamARN: S.optional(S.String),
    StreamName: S.optional(S.String),
    Tags: ResourceTags,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/tagStream" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagStreamInput",
}) as any as S.Schema<TagStreamInput>;
export interface TagStreamOutput {}
export const TagStreamOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagStreamOutput",
}) as any as S.Schema<TagStreamOutput>;
export interface UntagResourceInput {
  ResourceARN: string;
  TagKeyList: TagKeyList;
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeyList: TagKeyList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/UntagResource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceInput",
}) as any as S.Schema<UntagResourceInput>;
export interface UntagResourceOutput {}
export const UntagResourceOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceOutput",
}) as any as S.Schema<UntagResourceOutput>;
export interface UntagStreamInput {
  StreamARN?: string;
  StreamName?: string;
  TagKeyList: TagKeyList;
}
export const UntagStreamInput = S.suspend(() =>
  S.Struct({
    StreamARN: S.optional(S.String),
    StreamName: S.optional(S.String),
    TagKeyList: TagKeyList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/untagStream" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagStreamInput",
}) as any as S.Schema<UntagStreamInput>;
export interface UntagStreamOutput {}
export const UntagStreamOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagStreamOutput",
}) as any as S.Schema<UntagStreamOutput>;
export interface UpdateDataRetentionInput {
  StreamName?: string;
  StreamARN?: string;
  CurrentVersion: string;
  Operation: string;
  DataRetentionChangeInHours: number;
}
export const UpdateDataRetentionInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    CurrentVersion: S.String,
    Operation: S.String,
    DataRetentionChangeInHours: S.Number,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/updateDataRetention" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDataRetentionInput",
}) as any as S.Schema<UpdateDataRetentionInput>;
export interface UpdateDataRetentionOutput {}
export const UpdateDataRetentionOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateDataRetentionOutput",
}) as any as S.Schema<UpdateDataRetentionOutput>;
export interface SingleMasterConfiguration {
  MessageTtlSeconds?: number;
}
export const SingleMasterConfiguration = S.suspend(() =>
  S.Struct({ MessageTtlSeconds: S.optional(S.Number) }),
).annotations({
  identifier: "SingleMasterConfiguration",
}) as any as S.Schema<SingleMasterConfiguration>;
export interface UpdateSignalingChannelInput {
  ChannelARN: string;
  CurrentVersion: string;
  SingleMasterConfiguration?: SingleMasterConfiguration;
}
export const UpdateSignalingChannelInput = S.suspend(() =>
  S.Struct({
    ChannelARN: S.String,
    CurrentVersion: S.String,
    SingleMasterConfiguration: S.optional(SingleMasterConfiguration),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/updateSignalingChannel" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSignalingChannelInput",
}) as any as S.Schema<UpdateSignalingChannelInput>;
export interface UpdateSignalingChannelOutput {}
export const UpdateSignalingChannelOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateSignalingChannelOutput",
}) as any as S.Schema<UpdateSignalingChannelOutput>;
export interface UpdateStreamInput {
  StreamName?: string;
  StreamARN?: string;
  CurrentVersion: string;
  DeviceName?: string;
  MediaType?: string;
}
export const UpdateStreamInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    CurrentVersion: S.String,
    DeviceName: S.optional(S.String),
    MediaType: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/updateStream" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateStreamInput",
}) as any as S.Schema<UpdateStreamInput>;
export interface UpdateStreamOutput {}
export const UpdateStreamOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateStreamOutput",
}) as any as S.Schema<UpdateStreamOutput>;
export interface StreamStorageConfiguration {
  DefaultStorageTier: string;
}
export const StreamStorageConfiguration = S.suspend(() =>
  S.Struct({ DefaultStorageTier: S.String }),
).annotations({
  identifier: "StreamStorageConfiguration",
}) as any as S.Schema<StreamStorageConfiguration>;
export interface UpdateStreamStorageConfigurationInput {
  StreamName?: string;
  StreamARN?: string;
  CurrentVersion: string;
  StreamStorageConfiguration: StreamStorageConfiguration;
}
export const UpdateStreamStorageConfigurationInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    CurrentVersion: S.String,
    StreamStorageConfiguration: StreamStorageConfiguration,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/updateStreamStorageConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateStreamStorageConfigurationInput",
}) as any as S.Schema<UpdateStreamStorageConfigurationInput>;
export interface UpdateStreamStorageConfigurationOutput {}
export const UpdateStreamStorageConfigurationOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateStreamStorageConfigurationOutput",
}) as any as S.Schema<UpdateStreamStorageConfigurationOutput>;
export type ListOfProtocols = string[];
export const ListOfProtocols = S.Array(S.String);
export type TagOnCreateList = Tag[];
export const TagOnCreateList = S.Array(Tag);
export interface SingleMasterChannelEndpointConfiguration {
  Protocols?: ListOfProtocols;
  Role?: string;
}
export const SingleMasterChannelEndpointConfiguration = S.suspend(() =>
  S.Struct({
    Protocols: S.optional(ListOfProtocols),
    Role: S.optional(S.String),
  }),
).annotations({
  identifier: "SingleMasterChannelEndpointConfiguration",
}) as any as S.Schema<SingleMasterChannelEndpointConfiguration>;
export interface ChannelNameCondition {
  ComparisonOperator?: string;
  ComparisonValue?: string;
}
export const ChannelNameCondition = S.suspend(() =>
  S.Struct({
    ComparisonOperator: S.optional(S.String),
    ComparisonValue: S.optional(S.String),
  }),
).annotations({
  identifier: "ChannelNameCondition",
}) as any as S.Schema<ChannelNameCondition>;
export interface StreamNameCondition {
  ComparisonOperator?: string;
  ComparisonValue?: string;
}
export const StreamNameCondition = S.suspend(() =>
  S.Struct({
    ComparisonOperator: S.optional(S.String),
    ComparisonValue: S.optional(S.String),
  }),
).annotations({
  identifier: "StreamNameCondition",
}) as any as S.Schema<StreamNameCondition>;
export interface MediaStorageConfiguration {
  StreamARN?: string;
  Status: string;
}
export const MediaStorageConfiguration = S.suspend(() =>
  S.Struct({ StreamARN: S.optional(S.String), Status: S.String }),
).annotations({
  identifier: "MediaStorageConfiguration",
}) as any as S.Schema<MediaStorageConfiguration>;
export interface CreateSignalingChannelInput {
  ChannelName: string;
  ChannelType?: string;
  SingleMasterConfiguration?: SingleMasterConfiguration;
  Tags?: TagOnCreateList;
}
export const CreateSignalingChannelInput = S.suspend(() =>
  S.Struct({
    ChannelName: S.String,
    ChannelType: S.optional(S.String),
    SingleMasterConfiguration: S.optional(SingleMasterConfiguration),
    Tags: S.optional(TagOnCreateList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/createSignalingChannel" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSignalingChannelInput",
}) as any as S.Schema<CreateSignalingChannelInput>;
export interface CreateStreamInput {
  DeviceName?: string;
  StreamName: string;
  MediaType?: string;
  KmsKeyId?: string;
  DataRetentionInHours?: number;
  Tags?: ResourceTags;
  StreamStorageConfiguration?: StreamStorageConfiguration;
}
export const CreateStreamInput = S.suspend(() =>
  S.Struct({
    DeviceName: S.optional(S.String),
    StreamName: S.String,
    MediaType: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    DataRetentionInHours: S.optional(S.Number),
    Tags: S.optional(ResourceTags),
    StreamStorageConfiguration: S.optional(StreamStorageConfiguration),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/createStream" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateStreamInput",
}) as any as S.Schema<CreateStreamInput>;
export interface ImageGenerationDestinationConfig {
  Uri: string;
  DestinationRegion: string;
}
export const ImageGenerationDestinationConfig = S.suspend(() =>
  S.Struct({ Uri: S.String, DestinationRegion: S.String }),
).annotations({
  identifier: "ImageGenerationDestinationConfig",
}) as any as S.Schema<ImageGenerationDestinationConfig>;
export type FormatConfig = { [key: string]: string };
export const FormatConfig = S.Record({ key: S.String, value: S.String });
export interface ImageGenerationConfiguration {
  Status: string;
  ImageSelectorType: string;
  DestinationConfig: ImageGenerationDestinationConfig;
  SamplingInterval: number;
  Format: string;
  FormatConfig?: FormatConfig;
  WidthPixels?: number;
  HeightPixels?: number;
}
export const ImageGenerationConfiguration = S.suspend(() =>
  S.Struct({
    Status: S.String,
    ImageSelectorType: S.String,
    DestinationConfig: ImageGenerationDestinationConfig,
    SamplingInterval: S.Number,
    Format: S.String,
    FormatConfig: S.optional(FormatConfig),
    WidthPixels: S.optional(S.Number),
    HeightPixels: S.optional(S.Number),
  }),
).annotations({
  identifier: "ImageGenerationConfiguration",
}) as any as S.Schema<ImageGenerationConfiguration>;
export interface DescribeImageGenerationConfigurationOutput {
  ImageGenerationConfiguration?: ImageGenerationConfiguration;
}
export const DescribeImageGenerationConfigurationOutput = S.suspend(() =>
  S.Struct({
    ImageGenerationConfiguration: S.optional(ImageGenerationConfiguration),
  }).pipe(ns),
).annotations({
  identifier: "DescribeImageGenerationConfigurationOutput",
}) as any as S.Schema<DescribeImageGenerationConfigurationOutput>;
export interface DescribeMediaStorageConfigurationOutput {
  MediaStorageConfiguration?: MediaStorageConfiguration;
}
export const DescribeMediaStorageConfigurationOutput = S.suspend(() =>
  S.Struct({
    MediaStorageConfiguration: S.optional(MediaStorageConfiguration),
  }).pipe(ns),
).annotations({
  identifier: "DescribeMediaStorageConfigurationOutput",
}) as any as S.Schema<DescribeMediaStorageConfigurationOutput>;
export interface NotificationDestinationConfig {
  Uri: string;
}
export const NotificationDestinationConfig = S.suspend(() =>
  S.Struct({ Uri: S.String }),
).annotations({
  identifier: "NotificationDestinationConfig",
}) as any as S.Schema<NotificationDestinationConfig>;
export interface NotificationConfiguration {
  Status: string;
  DestinationConfig: NotificationDestinationConfig;
}
export const NotificationConfiguration = S.suspend(() =>
  S.Struct({
    Status: S.String,
    DestinationConfig: NotificationDestinationConfig,
  }),
).annotations({
  identifier: "NotificationConfiguration",
}) as any as S.Schema<NotificationConfiguration>;
export interface DescribeNotificationConfigurationOutput {
  NotificationConfiguration?: NotificationConfiguration;
}
export const DescribeNotificationConfigurationOutput = S.suspend(() =>
  S.Struct({
    NotificationConfiguration: S.optional(NotificationConfiguration),
  }).pipe(ns),
).annotations({
  identifier: "DescribeNotificationConfigurationOutput",
}) as any as S.Schema<DescribeNotificationConfigurationOutput>;
export interface DescribeStreamStorageConfigurationOutput {
  StreamName?: string;
  StreamARN?: string;
  StreamStorageConfiguration?: StreamStorageConfiguration;
}
export const DescribeStreamStorageConfigurationOutput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    StreamStorageConfiguration: S.optional(StreamStorageConfiguration),
  }).pipe(ns),
).annotations({
  identifier: "DescribeStreamStorageConfigurationOutput",
}) as any as S.Schema<DescribeStreamStorageConfigurationOutput>;
export interface GetDataEndpointOutput {
  DataEndpoint?: string;
}
export const GetDataEndpointOutput = S.suspend(() =>
  S.Struct({ DataEndpoint: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "GetDataEndpointOutput",
}) as any as S.Schema<GetDataEndpointOutput>;
export interface GetSignalingChannelEndpointInput {
  ChannelARN: string;
  SingleMasterChannelEndpointConfiguration?: SingleMasterChannelEndpointConfiguration;
}
export const GetSignalingChannelEndpointInput = S.suspend(() =>
  S.Struct({
    ChannelARN: S.String,
    SingleMasterChannelEndpointConfiguration: S.optional(
      SingleMasterChannelEndpointConfiguration,
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/getSignalingChannelEndpoint" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSignalingChannelEndpointInput",
}) as any as S.Schema<GetSignalingChannelEndpointInput>;
export interface ListSignalingChannelsInput {
  MaxResults?: number;
  NextToken?: string;
  ChannelNameCondition?: ChannelNameCondition;
}
export const ListSignalingChannelsInput = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ChannelNameCondition: S.optional(ChannelNameCondition),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/listSignalingChannels" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSignalingChannelsInput",
}) as any as S.Schema<ListSignalingChannelsInput>;
export interface ListStreamsInput {
  MaxResults?: number;
  NextToken?: string;
  StreamNameCondition?: StreamNameCondition;
}
export const ListStreamsInput = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    StreamNameCondition: S.optional(StreamNameCondition),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/listStreams" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListStreamsInput",
}) as any as S.Schema<ListStreamsInput>;
export interface ListTagsForResourceOutput {
  NextToken?: string;
  Tags?: ResourceTags;
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Tags: S.optional(ResourceTags),
  }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface ListTagsForStreamOutput {
  NextToken?: string;
  Tags?: ResourceTags;
}
export const ListTagsForStreamOutput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Tags: S.optional(ResourceTags),
  }).pipe(ns),
).annotations({
  identifier: "ListTagsForStreamOutput",
}) as any as S.Schema<ListTagsForStreamOutput>;
export interface UpdateMediaStorageConfigurationInput {
  ChannelARN: string;
  MediaStorageConfiguration: MediaStorageConfiguration;
}
export const UpdateMediaStorageConfigurationInput = S.suspend(() =>
  S.Struct({
    ChannelARN: S.String,
    MediaStorageConfiguration: MediaStorageConfiguration,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/updateMediaStorageConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMediaStorageConfigurationInput",
}) as any as S.Schema<UpdateMediaStorageConfigurationInput>;
export interface UpdateMediaStorageConfigurationOutput {}
export const UpdateMediaStorageConfigurationOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateMediaStorageConfigurationOutput",
}) as any as S.Schema<UpdateMediaStorageConfigurationOutput>;
export interface ScheduleConfig {
  ScheduleExpression: string;
  DurationInSeconds: number;
}
export const ScheduleConfig = S.suspend(() =>
  S.Struct({ ScheduleExpression: S.String, DurationInSeconds: S.Number }),
).annotations({
  identifier: "ScheduleConfig",
}) as any as S.Schema<ScheduleConfig>;
export interface UploaderConfig {
  ScheduleConfig: ScheduleConfig;
}
export const UploaderConfig = S.suspend(() =>
  S.Struct({ ScheduleConfig: ScheduleConfig }),
).annotations({
  identifier: "UploaderConfig",
}) as any as S.Schema<UploaderConfig>;
export interface MappedResourceConfigurationListItem {
  Type?: string;
  ARN?: string;
}
export const MappedResourceConfigurationListItem = S.suspend(() =>
  S.Struct({ Type: S.optional(S.String), ARN: S.optional(S.String) }),
).annotations({
  identifier: "MappedResourceConfigurationListItem",
}) as any as S.Schema<MappedResourceConfigurationListItem>;
export type MappedResourceConfigurationList =
  MappedResourceConfigurationListItem[];
export const MappedResourceConfigurationList = S.Array(
  MappedResourceConfigurationListItem,
);
export interface ChannelInfo {
  ChannelName?: string;
  ChannelARN?: string;
  ChannelType?: string;
  ChannelStatus?: string;
  CreationTime?: Date;
  SingleMasterConfiguration?: SingleMasterConfiguration;
  Version?: string;
}
export const ChannelInfo = S.suspend(() =>
  S.Struct({
    ChannelName: S.optional(S.String),
    ChannelARN: S.optional(S.String),
    ChannelType: S.optional(S.String),
    ChannelStatus: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    SingleMasterConfiguration: S.optional(SingleMasterConfiguration),
    Version: S.optional(S.String),
  }),
).annotations({ identifier: "ChannelInfo" }) as any as S.Schema<ChannelInfo>;
export interface StreamInfo {
  DeviceName?: string;
  StreamName?: string;
  StreamARN?: string;
  MediaType?: string;
  KmsKeyId?: string;
  Version?: string;
  Status?: string;
  CreationTime?: Date;
  DataRetentionInHours?: number;
}
export const StreamInfo = S.suspend(() =>
  S.Struct({
    DeviceName: S.optional(S.String),
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    MediaType: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    Version: S.optional(S.String),
    Status: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DataRetentionInHours: S.optional(S.Number),
  }),
).annotations({ identifier: "StreamInfo" }) as any as S.Schema<StreamInfo>;
export interface MediaSourceConfig {
  MediaUriSecretArn: string | Redacted.Redacted<string>;
  MediaUriType: string;
}
export const MediaSourceConfig = S.suspend(() =>
  S.Struct({ MediaUriSecretArn: SensitiveString, MediaUriType: S.String }),
).annotations({
  identifier: "MediaSourceConfig",
}) as any as S.Schema<MediaSourceConfig>;
export interface RecorderConfig {
  MediaSourceConfig: MediaSourceConfig;
  ScheduleConfig?: ScheduleConfig;
}
export const RecorderConfig = S.suspend(() =>
  S.Struct({
    MediaSourceConfig: MediaSourceConfig,
    ScheduleConfig: S.optional(ScheduleConfig),
  }),
).annotations({
  identifier: "RecorderConfig",
}) as any as S.Schema<RecorderConfig>;
export interface LocalSizeConfig {
  MaxLocalMediaSizeInMB?: number;
  StrategyOnFullSize?: string;
}
export const LocalSizeConfig = S.suspend(() =>
  S.Struct({
    MaxLocalMediaSizeInMB: S.optional(S.Number),
    StrategyOnFullSize: S.optional(S.String),
  }),
).annotations({
  identifier: "LocalSizeConfig",
}) as any as S.Schema<LocalSizeConfig>;
export interface DeletionConfig {
  EdgeRetentionInHours?: number;
  LocalSizeConfig?: LocalSizeConfig;
  DeleteAfterUpload?: boolean;
}
export const DeletionConfig = S.suspend(() =>
  S.Struct({
    EdgeRetentionInHours: S.optional(S.Number),
    LocalSizeConfig: S.optional(LocalSizeConfig),
    DeleteAfterUpload: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DeletionConfig",
}) as any as S.Schema<DeletionConfig>;
export interface EdgeConfig {
  HubDeviceArn: string;
  RecorderConfig: RecorderConfig;
  UploaderConfig?: UploaderConfig;
  DeletionConfig?: DeletionConfig;
}
export const EdgeConfig = S.suspend(() =>
  S.Struct({
    HubDeviceArn: S.String,
    RecorderConfig: RecorderConfig,
    UploaderConfig: S.optional(UploaderConfig),
    DeletionConfig: S.optional(DeletionConfig),
  }),
).annotations({ identifier: "EdgeConfig" }) as any as S.Schema<EdgeConfig>;
export interface ListEdgeAgentConfigurationsEdgeConfig {
  StreamName?: string;
  StreamARN?: string;
  CreationTime?: Date;
  LastUpdatedTime?: Date;
  SyncStatus?: string;
  FailedStatusDetails?: string;
  EdgeConfig?: EdgeConfig;
}
export const ListEdgeAgentConfigurationsEdgeConfig = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SyncStatus: S.optional(S.String),
    FailedStatusDetails: S.optional(S.String),
    EdgeConfig: S.optional(EdgeConfig),
  }),
).annotations({
  identifier: "ListEdgeAgentConfigurationsEdgeConfig",
}) as any as S.Schema<ListEdgeAgentConfigurationsEdgeConfig>;
export type ListEdgeAgentConfigurationsEdgeConfigList =
  ListEdgeAgentConfigurationsEdgeConfig[];
export const ListEdgeAgentConfigurationsEdgeConfigList = S.Array(
  ListEdgeAgentConfigurationsEdgeConfig,
);
export type ChannelInfoList = ChannelInfo[];
export const ChannelInfoList = S.Array(ChannelInfo);
export type StreamInfoList = StreamInfo[];
export const StreamInfoList = S.Array(StreamInfo);
export interface CreateSignalingChannelOutput {
  ChannelARN?: string;
}
export const CreateSignalingChannelOutput = S.suspend(() =>
  S.Struct({ ChannelARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateSignalingChannelOutput",
}) as any as S.Schema<CreateSignalingChannelOutput>;
export interface CreateStreamOutput {
  StreamARN?: string;
}
export const CreateStreamOutput = S.suspend(() =>
  S.Struct({ StreamARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateStreamOutput",
}) as any as S.Schema<CreateStreamOutput>;
export interface DescribeMappedResourceConfigurationOutput {
  MappedResourceConfigurationList?: MappedResourceConfigurationList;
  NextToken?: string;
}
export const DescribeMappedResourceConfigurationOutput = S.suspend(() =>
  S.Struct({
    MappedResourceConfigurationList: S.optional(
      MappedResourceConfigurationList,
    ),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeMappedResourceConfigurationOutput",
}) as any as S.Schema<DescribeMappedResourceConfigurationOutput>;
export interface DescribeSignalingChannelOutput {
  ChannelInfo?: ChannelInfo;
}
export const DescribeSignalingChannelOutput = S.suspend(() =>
  S.Struct({ ChannelInfo: S.optional(ChannelInfo) }).pipe(ns),
).annotations({
  identifier: "DescribeSignalingChannelOutput",
}) as any as S.Schema<DescribeSignalingChannelOutput>;
export interface DescribeStreamOutput {
  StreamInfo?: StreamInfo;
}
export const DescribeStreamOutput = S.suspend(() =>
  S.Struct({ StreamInfo: S.optional(StreamInfo) }).pipe(ns),
).annotations({
  identifier: "DescribeStreamOutput",
}) as any as S.Schema<DescribeStreamOutput>;
export interface ListEdgeAgentConfigurationsOutput {
  EdgeConfigs?: ListEdgeAgentConfigurationsEdgeConfigList;
  NextToken?: string;
}
export const ListEdgeAgentConfigurationsOutput = S.suspend(() =>
  S.Struct({
    EdgeConfigs: S.optional(ListEdgeAgentConfigurationsEdgeConfigList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListEdgeAgentConfigurationsOutput",
}) as any as S.Schema<ListEdgeAgentConfigurationsOutput>;
export interface ListSignalingChannelsOutput {
  ChannelInfoList?: ChannelInfoList;
  NextToken?: string;
}
export const ListSignalingChannelsOutput = S.suspend(() =>
  S.Struct({
    ChannelInfoList: S.optional(ChannelInfoList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListSignalingChannelsOutput",
}) as any as S.Schema<ListSignalingChannelsOutput>;
export interface ListStreamsOutput {
  StreamInfoList?: StreamInfoList;
  NextToken?: string;
}
export const ListStreamsOutput = S.suspend(() =>
  S.Struct({
    StreamInfoList: S.optional(StreamInfoList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListStreamsOutput",
}) as any as S.Schema<ListStreamsOutput>;
export interface UpdateImageGenerationConfigurationInput {
  StreamName?: string;
  StreamARN?: string;
  ImageGenerationConfiguration?: ImageGenerationConfiguration;
}
export const UpdateImageGenerationConfigurationInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    ImageGenerationConfiguration: S.optional(ImageGenerationConfiguration),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/updateImageGenerationConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateImageGenerationConfigurationInput",
}) as any as S.Schema<UpdateImageGenerationConfigurationInput>;
export interface UpdateImageGenerationConfigurationOutput {}
export const UpdateImageGenerationConfigurationOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateImageGenerationConfigurationOutput",
}) as any as S.Schema<UpdateImageGenerationConfigurationOutput>;
export interface UpdateNotificationConfigurationInput {
  StreamName?: string;
  StreamARN?: string;
  NotificationConfiguration?: NotificationConfiguration;
}
export const UpdateNotificationConfigurationInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    NotificationConfiguration: S.optional(NotificationConfiguration),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/updateNotificationConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateNotificationConfigurationInput",
}) as any as S.Schema<UpdateNotificationConfigurationInput>;
export interface UpdateNotificationConfigurationOutput {}
export const UpdateNotificationConfigurationOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateNotificationConfigurationOutput",
}) as any as S.Schema<UpdateNotificationConfigurationOutput>;
export interface LastRecorderStatus {
  JobStatusDetails?: string;
  LastCollectedTime?: Date;
  LastUpdatedTime?: Date;
  RecorderStatus?: string;
}
export const LastRecorderStatus = S.suspend(() =>
  S.Struct({
    JobStatusDetails: S.optional(S.String),
    LastCollectedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    RecorderStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "LastRecorderStatus",
}) as any as S.Schema<LastRecorderStatus>;
export interface LastUploaderStatus {
  JobStatusDetails?: string;
  LastCollectedTime?: Date;
  LastUpdatedTime?: Date;
  UploaderStatus?: string;
}
export const LastUploaderStatus = S.suspend(() =>
  S.Struct({
    JobStatusDetails: S.optional(S.String),
    LastCollectedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    UploaderStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "LastUploaderStatus",
}) as any as S.Schema<LastUploaderStatus>;
export interface EdgeAgentStatus {
  LastRecorderStatus?: LastRecorderStatus;
  LastUploaderStatus?: LastUploaderStatus;
}
export const EdgeAgentStatus = S.suspend(() =>
  S.Struct({
    LastRecorderStatus: S.optional(LastRecorderStatus),
    LastUploaderStatus: S.optional(LastUploaderStatus),
  }),
).annotations({
  identifier: "EdgeAgentStatus",
}) as any as S.Schema<EdgeAgentStatus>;
export interface ResourceEndpointListItem {
  Protocol?: string;
  ResourceEndpoint?: string;
}
export const ResourceEndpointListItem = S.suspend(() =>
  S.Struct({
    Protocol: S.optional(S.String),
    ResourceEndpoint: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourceEndpointListItem",
}) as any as S.Schema<ResourceEndpointListItem>;
export type ResourceEndpointList = ResourceEndpointListItem[];
export const ResourceEndpointList = S.Array(ResourceEndpointListItem);
export interface DescribeEdgeConfigurationOutput {
  StreamName?: string;
  StreamARN?: string;
  CreationTime?: Date;
  LastUpdatedTime?: Date;
  SyncStatus?: string;
  FailedStatusDetails?: string;
  EdgeConfig?: EdgeConfig;
  EdgeAgentStatus?: EdgeAgentStatus;
}
export const DescribeEdgeConfigurationOutput = S.suspend(() =>
  S.Struct({
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
  }).pipe(ns),
).annotations({
  identifier: "DescribeEdgeConfigurationOutput",
}) as any as S.Schema<DescribeEdgeConfigurationOutput>;
export interface GetSignalingChannelEndpointOutput {
  ResourceEndpointList?: ResourceEndpointList;
}
export const GetSignalingChannelEndpointOutput = S.suspend(() =>
  S.Struct({ ResourceEndpointList: S.optional(ResourceEndpointList) }).pipe(ns),
).annotations({
  identifier: "GetSignalingChannelEndpointOutput",
}) as any as S.Schema<GetSignalingChannelEndpointOutput>;
export interface StartEdgeConfigurationUpdateInput {
  StreamName?: string;
  StreamARN?: string;
  EdgeConfig: EdgeConfig;
}
export const StartEdgeConfigurationUpdateInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    EdgeConfig: EdgeConfig,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/startEdgeConfigurationUpdate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartEdgeConfigurationUpdateInput",
}) as any as S.Schema<StartEdgeConfigurationUpdateInput>;
export interface StartEdgeConfigurationUpdateOutput {
  StreamName?: string;
  StreamARN?: string;
  CreationTime?: Date;
  LastUpdatedTime?: Date;
  SyncStatus?: string;
  FailedStatusDetails?: string;
  EdgeConfig?: EdgeConfig;
}
export const StartEdgeConfigurationUpdateOutput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SyncStatus: S.optional(S.String),
    FailedStatusDetails: S.optional(S.String),
    EdgeConfig: S.optional(EdgeConfig),
  }).pipe(ns),
).annotations({
  identifier: "StartEdgeConfigurationUpdateOutput",
}) as any as S.Schema<StartEdgeConfigurationUpdateOutput>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ClientLimitExceededException extends S.TaggedError<ClientLimitExceededException>()(
  "ClientLimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidArgumentException extends S.TaggedError<InvalidArgumentException>()(
  "InvalidArgumentException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AccountChannelLimitExceededException extends S.TaggedError<AccountChannelLimitExceededException>()(
  "AccountChannelLimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AccountStreamLimitExceededException extends S.TaggedError<AccountStreamLimitExceededException>()(
  "AccountStreamLimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NotAuthorizedException extends S.TaggedError<NotAuthorizedException>()(
  "NotAuthorizedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoDataRetentionException extends S.TaggedError<NoDataRetentionException>()(
  "NoDataRetentionException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidResourceFormatException extends S.TaggedError<InvalidResourceFormatException>()(
  "InvalidResourceFormatException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class DeviceStreamLimitExceededException extends S.TaggedError<DeviceStreamLimitExceededException>()(
  "DeviceStreamLimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class VersionMismatchException extends S.TaggedError<VersionMismatchException>()(
  "VersionMismatchException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TagsPerResourceExceededLimitException extends S.TaggedError<TagsPerResourceExceededLimitException>()(
  "TagsPerResourceExceededLimitException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class StreamEdgeConfigurationNotFoundException extends S.TaggedError<StreamEdgeConfigurationNotFoundException>()(
  "StreamEdgeConfigurationNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidDeviceException extends S.TaggedError<InvalidDeviceException>()(
  "InvalidDeviceException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns an array of `ChannelInfo` objects. Each object describes a
 * signaling channel. To retrieve only those channels that satisfy a specific condition,
 * you can specify a `ChannelNameCondition`.
 */
export const listSignalingChannels: {
  (
    input: ListSignalingChannelsInput,
  ): Effect.Effect<
    ListSignalingChannelsOutput,
    | AccessDeniedException
    | ClientLimitExceededException
    | InvalidArgumentException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSignalingChannelsInput,
  ) => Stream.Stream<
    ListSignalingChannelsOutput,
    | AccessDeniedException
    | ClientLimitExceededException
    | InvalidArgumentException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSignalingChannelsInput,
  ) => Stream.Stream<
    ChannelInfo,
    | AccessDeniedException
    | ClientLimitExceededException
    | InvalidArgumentException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listStreams: {
  (
    input: ListStreamsInput,
  ): Effect.Effect<
    ListStreamsOutput,
    ClientLimitExceededException | InvalidArgumentException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStreamsInput,
  ) => Stream.Stream<
    ListStreamsOutput,
    ClientLimitExceededException | InvalidArgumentException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStreamsInput,
  ) => Stream.Stream<
    StreamInfo,
    ClientLimitExceededException | InvalidArgumentException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStreamsInput,
  output: ListStreamsOutput,
  errors: [ClientLimitExceededException, InvalidArgumentException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "StreamInfoList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the most current information about the stream. The `streamName`
 * or `streamARN` should be provided in the input.
 */
export const describeMappedResourceConfiguration: {
  (
    input: DescribeMappedResourceConfigurationInput,
  ): Effect.Effect<
    DescribeMappedResourceConfigurationOutput,
    | AccessDeniedException
    | ClientLimitExceededException
    | InvalidArgumentException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeMappedResourceConfigurationInput,
  ) => Stream.Stream<
    DescribeMappedResourceConfigurationOutput,
    | AccessDeniedException
    | ClientLimitExceededException
    | InvalidArgumentException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeMappedResourceConfigurationInput,
  ) => Stream.Stream<
    MappedResourceConfigurationListItem,
    | AccessDeniedException
    | ClientLimitExceededException
    | InvalidArgumentException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listTagsForStream: (
  input: ListTagsForStreamInput,
) => Effect.Effect<
  ListTagsForStreamOutput,
  | ClientLimitExceededException
  | InvalidArgumentException
  | InvalidResourceFormatException
  | NotAuthorizedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeStream: (
  input: DescribeStreamInput,
) => Effect.Effect<
  DescribeStreamOutput,
  | ClientLimitExceededException
  | InvalidArgumentException
  | NotAuthorizedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listEdgeAgentConfigurations: {
  (
    input: ListEdgeAgentConfigurationsInput,
  ): Effect.Effect<
    ListEdgeAgentConfigurationsOutput,
    | ClientLimitExceededException
    | InvalidArgumentException
    | NotAuthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEdgeAgentConfigurationsInput,
  ) => Stream.Stream<
    ListEdgeAgentConfigurationsOutput,
    | ClientLimitExceededException
    | InvalidArgumentException
    | NotAuthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEdgeAgentConfigurationsInput,
  ) => Stream.Stream<
    ListEdgeAgentConfigurationsEdgeConfig,
    | ClientLimitExceededException
    | InvalidArgumentException
    | NotAuthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getDataEndpoint: (
  input: GetDataEndpointInput,
) => Effect.Effect<
  GetDataEndpointOutput,
  | ClientLimitExceededException
  | InvalidArgumentException
  | NotAuthorizedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeSignalingChannel: (
  input: DescribeSignalingChannelInput,
) => Effect.Effect<
  DescribeSignalingChannelOutput,
  | AccessDeniedException
  | ClientLimitExceededException
  | InvalidArgumentException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSignalingChannelInput,
  output: DescribeSignalingChannelOutput,
  errors: [
    AccessDeniedException,
    ClientLimitExceededException,
    InvalidArgumentException,
    ResourceNotFoundException,
  ],
}));
/**
 * Gets the `ImageGenerationConfiguration` for a given Kinesis video stream.
 */
export const describeImageGenerationConfiguration: (
  input: DescribeImageGenerationConfigurationInput,
) => Effect.Effect<
  DescribeImageGenerationConfigurationOutput,
  | AccessDeniedException
  | ClientLimitExceededException
  | InvalidArgumentException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeMediaStorageConfiguration: (
  input: DescribeMediaStorageConfigurationInput,
) => Effect.Effect<
  DescribeMediaStorageConfigurationOutput,
  | AccessDeniedException
  | ClientLimitExceededException
  | InvalidArgumentException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeNotificationConfiguration: (
  input: DescribeNotificationConfigurationInput,
) => Effect.Effect<
  DescribeNotificationConfigurationOutput,
  | AccessDeniedException
  | ClientLimitExceededException
  | InvalidArgumentException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeStreamStorageConfiguration: (
  input: DescribeStreamStorageConfigurationInput,
) => Effect.Effect<
  DescribeStreamStorageConfigurationOutput,
  | AccessDeniedException
  | ClientLimitExceededException
  | InvalidArgumentException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => Effect.Effect<
  ListTagsForResourceOutput,
  | AccessDeniedException
  | ClientLimitExceededException
  | InvalidArgumentException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource: (
  input: UntagResourceInput,
) => Effect.Effect<
  UntagResourceOutput,
  | AccessDeniedException
  | ClientLimitExceededException
  | InvalidArgumentException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateNotificationConfiguration: (
  input: UpdateNotificationConfigurationInput,
) => Effect.Effect<
  UpdateNotificationConfigurationOutput,
  | AccessDeniedException
  | ClientLimitExceededException
  | InvalidArgumentException
  | NoDataRetentionException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateMediaStorageConfiguration: (
  input: UpdateMediaStorageConfigurationInput,
) => Effect.Effect<
  UpdateMediaStorageConfigurationOutput,
  | AccessDeniedException
  | ClientLimitExceededException
  | InvalidArgumentException
  | NoDataRetentionException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagStream: (
  input: UntagStreamInput,
) => Effect.Effect<
  UntagStreamOutput,
  | ClientLimitExceededException
  | InvalidArgumentException
  | InvalidResourceFormatException
  | NotAuthorizedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSignalingChannelEndpoint: (
  input: GetSignalingChannelEndpointInput,
) => Effect.Effect<
  GetSignalingChannelEndpointOutput,
  | AccessDeniedException
  | ClientLimitExceededException
  | InvalidArgumentException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSignalingChannelEndpointInput,
  output: GetSignalingChannelEndpointOutput,
  errors: [
    AccessDeniedException,
    ClientLimitExceededException,
    InvalidArgumentException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the `StreamInfo` and `ImageProcessingConfiguration` fields.
 */
export const updateImageGenerationConfiguration: (
  input: UpdateImageGenerationConfigurationInput,
) => Effect.Effect<
  UpdateImageGenerationConfigurationOutput,
  | AccessDeniedException
  | ClientLimitExceededException
  | InvalidArgumentException
  | NoDataRetentionException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startEdgeConfigurationUpdate: (
  input: StartEdgeConfigurationUpdateInput,
) => Effect.Effect<
  StartEdgeConfigurationUpdateOutput,
  | AccessDeniedException
  | ClientLimitExceededException
  | InvalidArgumentException
  | NoDataRetentionException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteSignalingChannel: (
  input: DeleteSignalingChannelInput,
) => Effect.Effect<
  DeleteSignalingChannelOutput,
  | AccessDeniedException
  | ClientLimitExceededException
  | InvalidArgumentException
  | ResourceInUseException
  | ResourceNotFoundException
  | VersionMismatchException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Adds one or more tags to a signaling channel. A *tag* is a
 * key-value pair (the value is optional) that you can define and assign to Amazon Web Services resources.
 * If you specify a tag that already exists, the tag value is replaced with the value that
 * you specify in the request. For more information, see Using Cost Allocation
 * Tags in the Billing and Cost Management and Cost Management User
 * Guide.
 */
export const tagResource: (
  input: TagResourceInput,
) => Effect.Effect<
  TagResourceOutput,
  | AccessDeniedException
  | ClientLimitExceededException
  | InvalidArgumentException
  | ResourceNotFoundException
  | TagsPerResourceExceededLimitException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteEdgeConfiguration: (
  input: DeleteEdgeConfigurationInput,
) => Effect.Effect<
  DeleteEdgeConfigurationOutput,
  | AccessDeniedException
  | ClientLimitExceededException
  | InvalidArgumentException
  | ResourceNotFoundException
  | StreamEdgeConfigurationNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEdgeConfigurationInput,
  output: DeleteEdgeConfigurationOutput,
  errors: [
    AccessDeniedException,
    ClientLimitExceededException,
    InvalidArgumentException,
    ResourceNotFoundException,
    StreamEdgeConfigurationNotFoundException,
  ],
}));
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
export const updateDataRetention: (
  input: UpdateDataRetentionInput,
) => Effect.Effect<
  UpdateDataRetentionOutput,
  | ClientLimitExceededException
  | InvalidArgumentException
  | NotAuthorizedException
  | ResourceInUseException
  | ResourceNotFoundException
  | VersionMismatchException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateStream: (
  input: UpdateStreamInput,
) => Effect.Effect<
  UpdateStreamOutput,
  | ClientLimitExceededException
  | InvalidArgumentException
  | NotAuthorizedException
  | ResourceInUseException
  | ResourceNotFoundException
  | VersionMismatchException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateSignalingChannel: (
  input: UpdateSignalingChannelInput,
) => Effect.Effect<
  UpdateSignalingChannelOutput,
  | AccessDeniedException
  | ClientLimitExceededException
  | InvalidArgumentException
  | ResourceInUseException
  | ResourceNotFoundException
  | VersionMismatchException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates the storage configuration for an existing Kinesis video stream.
 *
 * This operation allows you to modify the storage tier settings for a stream, enabling you to optimize storage costs and performance based on your access patterns.
 *
 * `UpdateStreamStorageConfiguration` is an asynchronous operation.
 *
 * You must have permissions for the `KinesisVideo:UpdateStreamStorageConfiguration` action.
 */
export const updateStreamStorageConfiguration: (
  input: UpdateStreamStorageConfigurationInput,
) => Effect.Effect<
  UpdateStreamStorageConfigurationOutput,
  | AccessDeniedException
  | ClientLimitExceededException
  | InvalidArgumentException
  | ResourceInUseException
  | ResourceNotFoundException
  | VersionMismatchException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteStream: (
  input: DeleteStreamInput,
) => Effect.Effect<
  DeleteStreamOutput,
  | ClientLimitExceededException
  | InvalidArgumentException
  | NotAuthorizedException
  | ResourceInUseException
  | ResourceNotFoundException
  | VersionMismatchException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagStream: (
  input: TagStreamInput,
) => Effect.Effect<
  TagStreamOutput,
  | ClientLimitExceededException
  | InvalidArgumentException
  | InvalidResourceFormatException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TagsPerResourceExceededLimitException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createSignalingChannel: (
  input: CreateSignalingChannelInput,
) => Effect.Effect<
  CreateSignalingChannelOutput,
  | AccessDeniedException
  | AccountChannelLimitExceededException
  | ClientLimitExceededException
  | InvalidArgumentException
  | ResourceInUseException
  | TagsPerResourceExceededLimitException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Describes a stream’s edge configuration that was set using the
 * `StartEdgeConfigurationUpdate` API and the latest status of the edge
 * agent's recorder and uploader jobs. Use this API to get the status of the configuration
 * to determine if the configuration is in sync with the Edge Agent. Use this API to
 * evaluate the health of the Edge Agent.
 */
export const describeEdgeConfiguration: (
  input: DescribeEdgeConfigurationInput,
) => Effect.Effect<
  DescribeEdgeConfigurationOutput,
  | AccessDeniedException
  | ClientLimitExceededException
  | InvalidArgumentException
  | ResourceNotFoundException
  | StreamEdgeConfigurationNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEdgeConfigurationInput,
  output: DescribeEdgeConfigurationOutput,
  errors: [
    AccessDeniedException,
    ClientLimitExceededException,
    InvalidArgumentException,
    ResourceNotFoundException,
    StreamEdgeConfigurationNotFoundException,
  ],
}));
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
export const createStream: (
  input: CreateStreamInput,
) => Effect.Effect<
  CreateStreamOutput,
  | AccountStreamLimitExceededException
  | ClientLimitExceededException
  | DeviceStreamLimitExceededException
  | InvalidArgumentException
  | InvalidDeviceException
  | ResourceInUseException
  | TagsPerResourceExceededLimitException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
