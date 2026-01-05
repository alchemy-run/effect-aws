import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Chime SDK Media Pipelines",
  serviceShapeName: "ChimeSDKMediaPipelinesService",
});
const auth = T.AwsAuthSigv4({ name: "chime" });
const ver = T.ServiceVersion("2021-07-15");
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
                        url: "https://media-pipelines-chime-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://media-pipelines-chime-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://media-pipelines-chime.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://media-pipelines-chime.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeyList = S.Array(S.String);
export class DeleteMediaCapturePipelineRequest extends S.Class<DeleteMediaCapturePipelineRequest>(
  "DeleteMediaCapturePipelineRequest",
)(
  { MediaPipelineId: S.String.pipe(T.HttpLabel("MediaPipelineId")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/sdk-media-capture-pipelines/{MediaPipelineId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMediaCapturePipelineResponse extends S.Class<DeleteMediaCapturePipelineResponse>(
  "DeleteMediaCapturePipelineResponse",
)({}) {}
export class DeleteMediaInsightsPipelineConfigurationRequest extends S.Class<DeleteMediaInsightsPipelineConfigurationRequest>(
  "DeleteMediaInsightsPipelineConfigurationRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/media-insights-pipeline-configurations/{Identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMediaInsightsPipelineConfigurationResponse extends S.Class<DeleteMediaInsightsPipelineConfigurationResponse>(
  "DeleteMediaInsightsPipelineConfigurationResponse",
)({}) {}
export class DeleteMediaPipelineRequest extends S.Class<DeleteMediaPipelineRequest>(
  "DeleteMediaPipelineRequest",
)(
  { MediaPipelineId: S.String.pipe(T.HttpLabel("MediaPipelineId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/sdk-media-pipelines/{MediaPipelineId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMediaPipelineResponse extends S.Class<DeleteMediaPipelineResponse>(
  "DeleteMediaPipelineResponse",
)({}) {}
export class DeleteMediaPipelineKinesisVideoStreamPoolRequest extends S.Class<DeleteMediaPipelineKinesisVideoStreamPoolRequest>(
  "DeleteMediaPipelineKinesisVideoStreamPoolRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/media-pipeline-kinesis-video-stream-pools/{Identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMediaPipelineKinesisVideoStreamPoolResponse extends S.Class<DeleteMediaPipelineKinesisVideoStreamPoolResponse>(
  "DeleteMediaPipelineKinesisVideoStreamPoolResponse",
)({}) {}
export class GetMediaCapturePipelineRequest extends S.Class<GetMediaCapturePipelineRequest>(
  "GetMediaCapturePipelineRequest",
)(
  { MediaPipelineId: S.String.pipe(T.HttpLabel("MediaPipelineId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/sdk-media-capture-pipelines/{MediaPipelineId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMediaInsightsPipelineConfigurationRequest extends S.Class<GetMediaInsightsPipelineConfigurationRequest>(
  "GetMediaInsightsPipelineConfigurationRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/media-insights-pipeline-configurations/{Identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMediaPipelineRequest extends S.Class<GetMediaPipelineRequest>(
  "GetMediaPipelineRequest",
)(
  { MediaPipelineId: S.String.pipe(T.HttpLabel("MediaPipelineId")) },
  T.all(
    T.Http({ method: "GET", uri: "/sdk-media-pipelines/{MediaPipelineId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMediaPipelineKinesisVideoStreamPoolRequest extends S.Class<GetMediaPipelineKinesisVideoStreamPoolRequest>(
  "GetMediaPipelineKinesisVideoStreamPoolRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/media-pipeline-kinesis-video-stream-pools/{Identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSpeakerSearchTaskRequest extends S.Class<GetSpeakerSearchTaskRequest>(
  "GetSpeakerSearchTaskRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    SpeakerSearchTaskId: S.String.pipe(T.HttpLabel("SpeakerSearchTaskId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/media-insights-pipelines/{Identifier}/speaker-search-tasks/{SpeakerSearchTaskId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVoiceToneAnalysisTaskRequest extends S.Class<GetVoiceToneAnalysisTaskRequest>(
  "GetVoiceToneAnalysisTaskRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    VoiceToneAnalysisTaskId: S.String.pipe(
      T.HttpLabel("VoiceToneAnalysisTaskId"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/media-insights-pipelines/{Identifier}/voice-tone-analysis-tasks/{VoiceToneAnalysisTaskId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMediaCapturePipelinesRequest extends S.Class<ListMediaCapturePipelinesRequest>(
  "ListMediaCapturePipelinesRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/sdk-media-capture-pipelines" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMediaInsightsPipelineConfigurationsRequest extends S.Class<ListMediaInsightsPipelineConfigurationsRequest>(
  "ListMediaInsightsPipelineConfigurationsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/media-insights-pipeline-configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMediaPipelineKinesisVideoStreamPoolsRequest extends S.Class<ListMediaPipelineKinesisVideoStreamPoolsRequest>(
  "ListMediaPipelineKinesisVideoStreamPoolsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/media-pipeline-kinesis-video-stream-pools",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMediaPipelinesRequest extends S.Class<ListMediaPipelinesRequest>(
  "ListMediaPipelinesRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/sdk-media-pipelines" }),
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
  { ResourceARN: S.String.pipe(T.HttpQuery("arn")) },
  T.all(T.Http({ method: "GET", uri: "/tags" }), svc, auth, proto, ver, rules),
) {}
export class KinesisVideoStreamSourceTaskConfiguration extends S.Class<KinesisVideoStreamSourceTaskConfiguration>(
  "KinesisVideoStreamSourceTaskConfiguration",
)({
  StreamArn: S.String,
  ChannelId: S.Number,
  FragmentNumber: S.optional(S.String),
}) {}
export class StartVoiceToneAnalysisTaskRequest extends S.Class<StartVoiceToneAnalysisTaskRequest>(
  "StartVoiceToneAnalysisTaskRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    LanguageCode: S.String,
    KinesisVideoStreamSourceTaskConfiguration: S.optional(
      KinesisVideoStreamSourceTaskConfiguration,
    ),
    ClientRequestToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/media-insights-pipelines/{Identifier}/voice-tone-analysis-tasks?operation=start",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopSpeakerSearchTaskRequest extends S.Class<StopSpeakerSearchTaskRequest>(
  "StopSpeakerSearchTaskRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    SpeakerSearchTaskId: S.String.pipe(T.HttpLabel("SpeakerSearchTaskId")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/media-insights-pipelines/{Identifier}/speaker-search-tasks/{SpeakerSearchTaskId}?operation=stop",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopSpeakerSearchTaskResponse extends S.Class<StopSpeakerSearchTaskResponse>(
  "StopSpeakerSearchTaskResponse",
)({}) {}
export class StopVoiceToneAnalysisTaskRequest extends S.Class<StopVoiceToneAnalysisTaskRequest>(
  "StopVoiceToneAnalysisTaskRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    VoiceToneAnalysisTaskId: S.String.pipe(
      T.HttpLabel("VoiceToneAnalysisTaskId"),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/media-insights-pipelines/{Identifier}/voice-tone-analysis-tasks/{VoiceToneAnalysisTaskId}?operation=stop",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopVoiceToneAnalysisTaskResponse extends S.Class<StopVoiceToneAnalysisTaskResponse>(
  "StopVoiceToneAnalysisTaskResponse",
)({}) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String, Tags: TagList },
  T.all(
    T.Http({ method: "POST", uri: "/tags?operation=tag-resource" }),
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
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceARN: S.String, TagKeys: TagKeyList },
  T.all(
    T.Http({ method: "POST", uri: "/tags?operation=untag-resource" }),
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
export const KeywordMatchWordList = S.Array(S.String);
export class KeywordMatchConfiguration extends S.Class<KeywordMatchConfiguration>(
  "KeywordMatchConfiguration",
)({
  RuleName: S.String,
  Keywords: KeywordMatchWordList,
  Negate: S.optional(S.Boolean),
}) {}
export class SentimentConfiguration extends S.Class<SentimentConfiguration>(
  "SentimentConfiguration",
)({ RuleName: S.String, SentimentType: S.String, TimePeriod: S.Number }) {}
export class IssueDetectionConfiguration extends S.Class<IssueDetectionConfiguration>(
  "IssueDetectionConfiguration",
)({ RuleName: S.String }) {}
export class RealTimeAlertRule extends S.Class<RealTimeAlertRule>(
  "RealTimeAlertRule",
)({
  Type: S.String,
  KeywordMatchConfiguration: S.optional(KeywordMatchConfiguration),
  SentimentConfiguration: S.optional(SentimentConfiguration),
  IssueDetectionConfiguration: S.optional(IssueDetectionConfiguration),
}) {}
export const RealTimeAlertRuleList = S.Array(RealTimeAlertRule);
export class RealTimeAlertConfiguration extends S.Class<RealTimeAlertConfiguration>(
  "RealTimeAlertConfiguration",
)({
  Disabled: S.optional(S.Boolean),
  Rules: S.optional(RealTimeAlertRuleList),
}) {}
export class PostCallAnalyticsSettings extends S.Class<PostCallAnalyticsSettings>(
  "PostCallAnalyticsSettings",
)({
  OutputLocation: S.String,
  DataAccessRoleArn: S.String,
  ContentRedactionOutput: S.optional(S.String),
  OutputEncryptionKMSKeyId: S.optional(S.String),
}) {}
export const CategoryNameList = S.Array(S.String);
export class AmazonTranscribeCallAnalyticsProcessorConfiguration extends S.Class<AmazonTranscribeCallAnalyticsProcessorConfiguration>(
  "AmazonTranscribeCallAnalyticsProcessorConfiguration",
)({
  LanguageCode: S.String,
  VocabularyName: S.optional(S.String),
  VocabularyFilterName: S.optional(S.String),
  VocabularyFilterMethod: S.optional(S.String),
  LanguageModelName: S.optional(S.String),
  EnablePartialResultsStabilization: S.optional(S.Boolean),
  PartialResultsStability: S.optional(S.String),
  ContentIdentificationType: S.optional(S.String),
  ContentRedactionType: S.optional(S.String),
  PiiEntityTypes: S.optional(S.String),
  FilterPartialResults: S.optional(S.Boolean),
  PostCallAnalyticsSettings: S.optional(PostCallAnalyticsSettings),
  CallAnalyticsStreamCategories: S.optional(CategoryNameList),
}) {}
export class AmazonTranscribeProcessorConfiguration extends S.Class<AmazonTranscribeProcessorConfiguration>(
  "AmazonTranscribeProcessorConfiguration",
)({
  LanguageCode: S.optional(S.String),
  VocabularyName: S.optional(S.String),
  VocabularyFilterName: S.optional(S.String),
  VocabularyFilterMethod: S.optional(S.String),
  ShowSpeakerLabel: S.optional(S.Boolean),
  EnablePartialResultsStabilization: S.optional(S.Boolean),
  PartialResultsStability: S.optional(S.String),
  ContentIdentificationType: S.optional(S.String),
  ContentRedactionType: S.optional(S.String),
  PiiEntityTypes: S.optional(S.String),
  LanguageModelName: S.optional(S.String),
  FilterPartialResults: S.optional(S.Boolean),
  IdentifyLanguage: S.optional(S.Boolean),
  IdentifyMultipleLanguages: S.optional(S.Boolean),
  LanguageOptions: S.optional(S.String),
  PreferredLanguage: S.optional(S.String),
  VocabularyNames: S.optional(S.String),
  VocabularyFilterNames: S.optional(S.String),
}) {}
export class KinesisDataStreamSinkConfiguration extends S.Class<KinesisDataStreamSinkConfiguration>(
  "KinesisDataStreamSinkConfiguration",
)({ InsightsTarget: S.optional(S.String) }) {}
export class S3RecordingSinkConfiguration extends S.Class<S3RecordingSinkConfiguration>(
  "S3RecordingSinkConfiguration",
)({
  Destination: S.optional(S.String),
  RecordingFileFormat: S.optional(S.String),
}) {}
export class VoiceAnalyticsProcessorConfiguration extends S.Class<VoiceAnalyticsProcessorConfiguration>(
  "VoiceAnalyticsProcessorConfiguration",
)({
  SpeakerSearchStatus: S.optional(S.String),
  VoiceToneAnalysisStatus: S.optional(S.String),
}) {}
export class LambdaFunctionSinkConfiguration extends S.Class<LambdaFunctionSinkConfiguration>(
  "LambdaFunctionSinkConfiguration",
)({ InsightsTarget: S.optional(S.String) }) {}
export class SqsQueueSinkConfiguration extends S.Class<SqsQueueSinkConfiguration>(
  "SqsQueueSinkConfiguration",
)({ InsightsTarget: S.optional(S.String) }) {}
export class SnsTopicSinkConfiguration extends S.Class<SnsTopicSinkConfiguration>(
  "SnsTopicSinkConfiguration",
)({ InsightsTarget: S.optional(S.String) }) {}
export class VoiceEnhancementSinkConfiguration extends S.Class<VoiceEnhancementSinkConfiguration>(
  "VoiceEnhancementSinkConfiguration",
)({ Disabled: S.optional(S.Boolean) }) {}
export class MediaInsightsPipelineConfigurationElement extends S.Class<MediaInsightsPipelineConfigurationElement>(
  "MediaInsightsPipelineConfigurationElement",
)({
  Type: S.String,
  AmazonTranscribeCallAnalyticsProcessorConfiguration: S.optional(
    AmazonTranscribeCallAnalyticsProcessorConfiguration,
  ),
  AmazonTranscribeProcessorConfiguration: S.optional(
    AmazonTranscribeProcessorConfiguration,
  ),
  KinesisDataStreamSinkConfiguration: S.optional(
    KinesisDataStreamSinkConfiguration,
  ),
  S3RecordingSinkConfiguration: S.optional(S3RecordingSinkConfiguration),
  VoiceAnalyticsProcessorConfiguration: S.optional(
    VoiceAnalyticsProcessorConfiguration,
  ),
  LambdaFunctionSinkConfiguration: S.optional(LambdaFunctionSinkConfiguration),
  SqsQueueSinkConfiguration: S.optional(SqsQueueSinkConfiguration),
  SnsTopicSinkConfiguration: S.optional(SnsTopicSinkConfiguration),
  VoiceEnhancementSinkConfiguration: S.optional(
    VoiceEnhancementSinkConfiguration,
  ),
}) {}
export const MediaInsightsPipelineConfigurationElements = S.Array(
  MediaInsightsPipelineConfigurationElement,
);
export class UpdateMediaInsightsPipelineConfigurationRequest extends S.Class<UpdateMediaInsightsPipelineConfigurationRequest>(
  "UpdateMediaInsightsPipelineConfigurationRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    ResourceAccessRoleArn: S.String,
    RealTimeAlertConfiguration: S.optional(RealTimeAlertConfiguration),
    Elements: MediaInsightsPipelineConfigurationElements,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/media-insights-pipeline-configurations/{Identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateMediaInsightsPipelineStatusRequest extends S.Class<UpdateMediaInsightsPipelineStatusRequest>(
  "UpdateMediaInsightsPipelineStatusRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    UpdateStatus: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/media-insights-pipeline-status/{Identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateMediaInsightsPipelineStatusResponse extends S.Class<UpdateMediaInsightsPipelineStatusResponse>(
  "UpdateMediaInsightsPipelineStatusResponse",
)({}) {}
export class SseAwsKeyManagementParams extends S.Class<SseAwsKeyManagementParams>(
  "SseAwsKeyManagementParams",
)({ AwsKmsKeyId: S.String, AwsKmsEncryptionContext: S.optional(S.String) }) {}
export const MediaInsightsRuntimeMetadata = S.Record({
  key: S.String,
  value: S.String,
});
export class S3RecordingSinkRuntimeConfiguration extends S.Class<S3RecordingSinkRuntimeConfiguration>(
  "S3RecordingSinkRuntimeConfiguration",
)({ Destination: S.String, RecordingFileFormat: S.String }) {}
export class KinesisVideoStreamConfiguration extends S.Class<KinesisVideoStreamConfiguration>(
  "KinesisVideoStreamConfiguration",
)({ Region: S.String, DataRetentionInHours: S.optional(S.Number) }) {}
export class MediaStreamSource extends S.Class<MediaStreamSource>(
  "MediaStreamSource",
)({ SourceType: S.String, SourceArn: S.String }) {}
export const MediaStreamSourceList = S.Array(MediaStreamSource);
export class MediaStreamSink extends S.Class<MediaStreamSink>(
  "MediaStreamSink",
)({
  SinkArn: S.String,
  SinkType: S.String,
  ReservedStreamCapacity: S.Number,
  MediaStreamType: S.String,
}) {}
export const MediaStreamSinkList = S.Array(MediaStreamSink);
export class KinesisVideoStreamConfigurationUpdate extends S.Class<KinesisVideoStreamConfigurationUpdate>(
  "KinesisVideoStreamConfigurationUpdate",
)({ DataRetentionInHours: S.optional(S.Number) }) {}
export class CreateMediaPipelineKinesisVideoStreamPoolRequest extends S.Class<CreateMediaPipelineKinesisVideoStreamPoolRequest>(
  "CreateMediaPipelineKinesisVideoStreamPoolRequest",
)(
  {
    StreamConfiguration: KinesisVideoStreamConfiguration,
    PoolName: S.String,
    ClientRequestToken: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/media-pipeline-kinesis-video-stream-pools",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateMediaStreamPipelineRequest extends S.Class<CreateMediaStreamPipelineRequest>(
  "CreateMediaStreamPipelineRequest",
)(
  {
    Sources: MediaStreamSourceList,
    Sinks: MediaStreamSinkList,
    ClientRequestToken: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/sdk-media-stream-pipelines" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }) {}
export class StartSpeakerSearchTaskRequest extends S.Class<StartSpeakerSearchTaskRequest>(
  "StartSpeakerSearchTaskRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    VoiceProfileDomainArn: S.String,
    KinesisVideoStreamSourceTaskConfiguration: S.optional(
      KinesisVideoStreamSourceTaskConfiguration,
    ),
    ClientRequestToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/media-insights-pipelines/{Identifier}/speaker-search-tasks?operation=start",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class VoiceToneAnalysisTask extends S.Class<VoiceToneAnalysisTask>(
  "VoiceToneAnalysisTask",
)({
  VoiceToneAnalysisTaskId: S.optional(S.String),
  VoiceToneAnalysisTaskStatus: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class StartVoiceToneAnalysisTaskResponse extends S.Class<StartVoiceToneAnalysisTaskResponse>(
  "StartVoiceToneAnalysisTaskResponse",
)({ VoiceToneAnalysisTask: S.optional(VoiceToneAnalysisTask) }) {}
export class MediaInsightsPipelineConfiguration extends S.Class<MediaInsightsPipelineConfiguration>(
  "MediaInsightsPipelineConfiguration",
)({
  MediaInsightsPipelineConfigurationName: S.optional(S.String),
  MediaInsightsPipelineConfigurationArn: S.optional(S.String),
  ResourceAccessRoleArn: S.optional(S.String),
  RealTimeAlertConfiguration: S.optional(RealTimeAlertConfiguration),
  Elements: S.optional(MediaInsightsPipelineConfigurationElements),
  MediaInsightsPipelineConfigurationId: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class UpdateMediaInsightsPipelineConfigurationResponse extends S.Class<UpdateMediaInsightsPipelineConfigurationResponse>(
  "UpdateMediaInsightsPipelineConfigurationResponse",
)({
  MediaInsightsPipelineConfiguration: S.optional(
    MediaInsightsPipelineConfiguration,
  ),
}) {}
export class UpdateMediaPipelineKinesisVideoStreamPoolRequest extends S.Class<UpdateMediaPipelineKinesisVideoStreamPoolRequest>(
  "UpdateMediaPipelineKinesisVideoStreamPoolRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    StreamConfiguration: S.optional(KinesisVideoStreamConfigurationUpdate),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/media-pipeline-kinesis-video-stream-pools/{Identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class S3BucketSinkConfiguration extends S.Class<S3BucketSinkConfiguration>(
  "S3BucketSinkConfiguration",
)({ Destination: S.String }) {}
export class RecordingStreamConfiguration extends S.Class<RecordingStreamConfiguration>(
  "RecordingStreamConfiguration",
)({ StreamArn: S.optional(S.String) }) {}
export const RecordingStreamList = S.Array(RecordingStreamConfiguration);
export class PresenterOnlyConfiguration extends S.Class<PresenterOnlyConfiguration>(
  "PresenterOnlyConfiguration",
)({ PresenterPosition: S.optional(S.String) }) {}
export class ActiveSpeakerOnlyConfiguration extends S.Class<ActiveSpeakerOnlyConfiguration>(
  "ActiveSpeakerOnlyConfiguration",
)({ ActiveSpeakerPosition: S.optional(S.String) }) {}
export class HorizontalLayoutConfiguration extends S.Class<HorizontalLayoutConfiguration>(
  "HorizontalLayoutConfiguration",
)({
  TileOrder: S.optional(S.String),
  TilePosition: S.optional(S.String),
  TileCount: S.optional(S.Number),
  TileAspectRatio: S.optional(S.String),
}) {}
export class VerticalLayoutConfiguration extends S.Class<VerticalLayoutConfiguration>(
  "VerticalLayoutConfiguration",
)({
  TileOrder: S.optional(S.String),
  TilePosition: S.optional(S.String),
  TileCount: S.optional(S.Number),
  TileAspectRatio: S.optional(S.String),
}) {}
export class VideoAttribute extends S.Class<VideoAttribute>("VideoAttribute")({
  CornerRadius: S.optional(S.Number),
  BorderColor: S.optional(S.String),
  HighlightColor: S.optional(S.String),
  BorderThickness: S.optional(S.Number),
}) {}
export class GridViewConfiguration extends S.Class<GridViewConfiguration>(
  "GridViewConfiguration",
)({
  ContentShareLayout: S.String,
  PresenterOnlyConfiguration: S.optional(PresenterOnlyConfiguration),
  ActiveSpeakerOnlyConfiguration: S.optional(ActiveSpeakerOnlyConfiguration),
  HorizontalLayoutConfiguration: S.optional(HorizontalLayoutConfiguration),
  VerticalLayoutConfiguration: S.optional(VerticalLayoutConfiguration),
  VideoAttribute: S.optional(VideoAttribute),
  CanvasOrientation: S.optional(S.String),
}) {}
export class CompositedVideoArtifactsConfiguration extends S.Class<CompositedVideoArtifactsConfiguration>(
  "CompositedVideoArtifactsConfiguration",
)({
  Layout: S.optional(S.String),
  Resolution: S.optional(S.String),
  GridViewConfiguration: GridViewConfiguration,
}) {}
export const AttendeeIdList = S.Array(S.String);
export const ExternalUserIdList = S.Array(S.String);
export class SelectedVideoStreams extends S.Class<SelectedVideoStreams>(
  "SelectedVideoStreams",
)({
  AttendeeIds: S.optional(AttendeeIdList),
  ExternalUserIds: S.optional(ExternalUserIdList),
}) {}
export class SourceConfiguration extends S.Class<SourceConfiguration>(
  "SourceConfiguration",
)({ SelectedVideoStreams: S.optional(SelectedVideoStreams) }) {}
export class ChimeSdkMeetingLiveConnectorConfiguration extends S.Class<ChimeSdkMeetingLiveConnectorConfiguration>(
  "ChimeSdkMeetingLiveConnectorConfiguration",
)({
  Arn: S.String,
  MuxType: S.String,
  CompositedVideo: S.optional(CompositedVideoArtifactsConfiguration),
  SourceConfiguration: S.optional(SourceConfiguration),
}) {}
export class LiveConnectorRTMPConfiguration extends S.Class<LiveConnectorRTMPConfiguration>(
  "LiveConnectorRTMPConfiguration",
)({
  Url: S.String,
  AudioChannels: S.optional(S.String),
  AudioSampleRate: S.optional(S.String),
}) {}
export class ConcatenationSink extends S.Class<ConcatenationSink>(
  "ConcatenationSink",
)({ Type: S.String, S3BucketSinkConfiguration: S3BucketSinkConfiguration }) {}
export const ConcatenationSinkList = S.Array(ConcatenationSink);
export class LiveConnectorSourceConfiguration extends S.Class<LiveConnectorSourceConfiguration>(
  "LiveConnectorSourceConfiguration",
)({
  SourceType: S.String,
  ChimeSdkMeetingLiveConnectorConfiguration:
    ChimeSdkMeetingLiveConnectorConfiguration,
}) {}
export const LiveConnectorSourceList = S.Array(
  LiveConnectorSourceConfiguration,
);
export class LiveConnectorSinkConfiguration extends S.Class<LiveConnectorSinkConfiguration>(
  "LiveConnectorSinkConfiguration",
)({ SinkType: S.String, RTMPConfiguration: LiveConnectorRTMPConfiguration }) {}
export const LiveConnectorSinkList = S.Array(LiveConnectorSinkConfiguration);
export class AudioArtifactsConfiguration extends S.Class<AudioArtifactsConfiguration>(
  "AudioArtifactsConfiguration",
)({ MuxType: S.String }) {}
export class VideoArtifactsConfiguration extends S.Class<VideoArtifactsConfiguration>(
  "VideoArtifactsConfiguration",
)({ State: S.String, MuxType: S.optional(S.String) }) {}
export class ContentArtifactsConfiguration extends S.Class<ContentArtifactsConfiguration>(
  "ContentArtifactsConfiguration",
)({ State: S.String, MuxType: S.optional(S.String) }) {}
export class ArtifactsConfiguration extends S.Class<ArtifactsConfiguration>(
  "ArtifactsConfiguration",
)({
  Audio: AudioArtifactsConfiguration,
  Video: VideoArtifactsConfiguration,
  Content: ContentArtifactsConfiguration,
  CompositedVideo: S.optional(CompositedVideoArtifactsConfiguration),
}) {}
export class ChimeSdkMeetingConfiguration extends S.Class<ChimeSdkMeetingConfiguration>(
  "ChimeSdkMeetingConfiguration",
)({
  SourceConfiguration: S.optional(SourceConfiguration),
  ArtifactsConfiguration: S.optional(ArtifactsConfiguration),
}) {}
export class MediaCapturePipeline extends S.Class<MediaCapturePipeline>(
  "MediaCapturePipeline",
)({
  MediaPipelineId: S.optional(S.String),
  MediaPipelineArn: S.optional(S.String),
  SourceType: S.optional(S.String),
  SourceArn: S.optional(S.String),
  Status: S.optional(S.String),
  SinkType: S.optional(S.String),
  SinkArn: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ChimeSdkMeetingConfiguration: S.optional(ChimeSdkMeetingConfiguration),
  SseAwsKeyManagementParams: S.optional(SseAwsKeyManagementParams),
  SinkIamRoleArn: S.optional(S.String),
}) {}
export class KinesisVideoStreamPoolConfiguration extends S.Class<KinesisVideoStreamPoolConfiguration>(
  "KinesisVideoStreamPoolConfiguration",
)({
  PoolArn: S.optional(S.String),
  PoolName: S.optional(S.String),
  PoolId: S.optional(S.String),
  PoolStatus: S.optional(S.String),
  PoolSize: S.optional(S.Number),
  StreamConfiguration: S.optional(KinesisVideoStreamConfiguration),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class SpeakerSearchTask extends S.Class<SpeakerSearchTask>(
  "SpeakerSearchTask",
)({
  SpeakerSearchTaskId: S.optional(S.String),
  SpeakerSearchTaskStatus: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class MediaCapturePipelineSummary extends S.Class<MediaCapturePipelineSummary>(
  "MediaCapturePipelineSummary",
)({
  MediaPipelineId: S.optional(S.String),
  MediaPipelineArn: S.optional(S.String),
}) {}
export const MediaCapturePipelineSummaryList = S.Array(
  MediaCapturePipelineSummary,
);
export class MediaInsightsPipelineConfigurationSummary extends S.Class<MediaInsightsPipelineConfigurationSummary>(
  "MediaInsightsPipelineConfigurationSummary",
)({
  MediaInsightsPipelineConfigurationName: S.optional(S.String),
  MediaInsightsPipelineConfigurationId: S.optional(S.String),
  MediaInsightsPipelineConfigurationArn: S.optional(S.String),
}) {}
export const MediaInsightsPipelineConfigurationSummaryList = S.Array(
  MediaInsightsPipelineConfigurationSummary,
);
export class KinesisVideoStreamPoolSummary extends S.Class<KinesisVideoStreamPoolSummary>(
  "KinesisVideoStreamPoolSummary",
)({
  PoolName: S.optional(S.String),
  PoolId: S.optional(S.String),
  PoolArn: S.optional(S.String),
}) {}
export const KinesisVideoStreamPoolSummaryList = S.Array(
  KinesisVideoStreamPoolSummary,
);
export class MediaPipelineSummary extends S.Class<MediaPipelineSummary>(
  "MediaPipelineSummary",
)({
  MediaPipelineId: S.optional(S.String),
  MediaPipelineArn: S.optional(S.String),
}) {}
export const MediaPipelineList = S.Array(MediaPipelineSummary);
export class TimestampRange extends S.Class<TimestampRange>("TimestampRange")({
  StartTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class CreateMediaLiveConnectorPipelineRequest extends S.Class<CreateMediaLiveConnectorPipelineRequest>(
  "CreateMediaLiveConnectorPipelineRequest",
)(
  {
    Sources: LiveConnectorSourceList,
    Sinks: LiveConnectorSinkList,
    ClientRequestToken: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/sdk-media-live-connector-pipelines" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateMediaPipelineKinesisVideoStreamPoolResponse extends S.Class<CreateMediaPipelineKinesisVideoStreamPoolResponse>(
  "CreateMediaPipelineKinesisVideoStreamPoolResponse",
)({
  KinesisVideoStreamPoolConfiguration: S.optional(
    KinesisVideoStreamPoolConfiguration,
  ),
}) {}
export class MediaStreamPipeline extends S.Class<MediaStreamPipeline>(
  "MediaStreamPipeline",
)({
  MediaPipelineId: S.optional(S.String),
  MediaPipelineArn: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Status: S.optional(S.String),
  Sources: S.optional(MediaStreamSourceList),
  Sinks: S.optional(MediaStreamSinkList),
}) {}
export class CreateMediaStreamPipelineResponse extends S.Class<CreateMediaStreamPipelineResponse>(
  "CreateMediaStreamPipelineResponse",
)({ MediaStreamPipeline: S.optional(MediaStreamPipeline) }) {}
export class GetMediaCapturePipelineResponse extends S.Class<GetMediaCapturePipelineResponse>(
  "GetMediaCapturePipelineResponse",
)({ MediaCapturePipeline: S.optional(MediaCapturePipeline) }) {}
export class GetMediaInsightsPipelineConfigurationResponse extends S.Class<GetMediaInsightsPipelineConfigurationResponse>(
  "GetMediaInsightsPipelineConfigurationResponse",
)({
  MediaInsightsPipelineConfiguration: S.optional(
    MediaInsightsPipelineConfiguration,
  ),
}) {}
export class GetMediaPipelineKinesisVideoStreamPoolResponse extends S.Class<GetMediaPipelineKinesisVideoStreamPoolResponse>(
  "GetMediaPipelineKinesisVideoStreamPoolResponse",
)({
  KinesisVideoStreamPoolConfiguration: S.optional(
    KinesisVideoStreamPoolConfiguration,
  ),
}) {}
export class GetSpeakerSearchTaskResponse extends S.Class<GetSpeakerSearchTaskResponse>(
  "GetSpeakerSearchTaskResponse",
)({ SpeakerSearchTask: S.optional(SpeakerSearchTask) }) {}
export class GetVoiceToneAnalysisTaskResponse extends S.Class<GetVoiceToneAnalysisTaskResponse>(
  "GetVoiceToneAnalysisTaskResponse",
)({ VoiceToneAnalysisTask: S.optional(VoiceToneAnalysisTask) }) {}
export class ListMediaCapturePipelinesResponse extends S.Class<ListMediaCapturePipelinesResponse>(
  "ListMediaCapturePipelinesResponse",
)({
  MediaCapturePipelines: S.optional(MediaCapturePipelineSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListMediaInsightsPipelineConfigurationsResponse extends S.Class<ListMediaInsightsPipelineConfigurationsResponse>(
  "ListMediaInsightsPipelineConfigurationsResponse",
)({
  MediaInsightsPipelineConfigurations: S.optional(
    MediaInsightsPipelineConfigurationSummaryList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListMediaPipelineKinesisVideoStreamPoolsResponse extends S.Class<ListMediaPipelineKinesisVideoStreamPoolsResponse>(
  "ListMediaPipelineKinesisVideoStreamPoolsResponse",
)({
  KinesisVideoStreamPools: S.optional(KinesisVideoStreamPoolSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListMediaPipelinesResponse extends S.Class<ListMediaPipelinesResponse>(
  "ListMediaPipelinesResponse",
)({
  MediaPipelines: S.optional(MediaPipelineList),
  NextToken: S.optional(S.String),
}) {}
export class StartSpeakerSearchTaskResponse extends S.Class<StartSpeakerSearchTaskResponse>(
  "StartSpeakerSearchTaskResponse",
)({ SpeakerSearchTask: S.optional(SpeakerSearchTask) }) {}
export class UpdateMediaPipelineKinesisVideoStreamPoolResponse extends S.Class<UpdateMediaPipelineKinesisVideoStreamPoolResponse>(
  "UpdateMediaPipelineKinesisVideoStreamPoolResponse",
)({
  KinesisVideoStreamPoolConfiguration: S.optional(
    KinesisVideoStreamPoolConfiguration,
  ),
}) {}
export class FragmentSelector extends S.Class<FragmentSelector>(
  "FragmentSelector",
)({ FragmentSelectorType: S.String, TimestampRange: TimestampRange }) {}
export class MediaLiveConnectorPipeline extends S.Class<MediaLiveConnectorPipeline>(
  "MediaLiveConnectorPipeline",
)({
  Sources: S.optional(LiveConnectorSourceList),
  Sinks: S.optional(LiveConnectorSinkList),
  MediaPipelineId: S.optional(S.String),
  MediaPipelineArn: S.optional(S.String),
  Status: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class AudioConcatenationConfiguration extends S.Class<AudioConcatenationConfiguration>(
  "AudioConcatenationConfiguration",
)({ State: S.String }) {}
export class VideoConcatenationConfiguration extends S.Class<VideoConcatenationConfiguration>(
  "VideoConcatenationConfiguration",
)({ State: S.String }) {}
export class ContentConcatenationConfiguration extends S.Class<ContentConcatenationConfiguration>(
  "ContentConcatenationConfiguration",
)({ State: S.String }) {}
export class DataChannelConcatenationConfiguration extends S.Class<DataChannelConcatenationConfiguration>(
  "DataChannelConcatenationConfiguration",
)({ State: S.String }) {}
export class TranscriptionMessagesConcatenationConfiguration extends S.Class<TranscriptionMessagesConcatenationConfiguration>(
  "TranscriptionMessagesConcatenationConfiguration",
)({ State: S.String }) {}
export class MeetingEventsConcatenationConfiguration extends S.Class<MeetingEventsConcatenationConfiguration>(
  "MeetingEventsConcatenationConfiguration",
)({ State: S.String }) {}
export class CompositedVideoConcatenationConfiguration extends S.Class<CompositedVideoConcatenationConfiguration>(
  "CompositedVideoConcatenationConfiguration",
)({ State: S.String }) {}
export class ArtifactsConcatenationConfiguration extends S.Class<ArtifactsConcatenationConfiguration>(
  "ArtifactsConcatenationConfiguration",
)({
  Audio: AudioConcatenationConfiguration,
  Video: VideoConcatenationConfiguration,
  Content: ContentConcatenationConfiguration,
  DataChannel: DataChannelConcatenationConfiguration,
  TranscriptionMessages: TranscriptionMessagesConcatenationConfiguration,
  MeetingEvents: MeetingEventsConcatenationConfiguration,
  CompositedVideo: CompositedVideoConcatenationConfiguration,
}) {}
export class ChimeSdkMeetingConcatenationConfiguration extends S.Class<ChimeSdkMeetingConcatenationConfiguration>(
  "ChimeSdkMeetingConcatenationConfiguration",
)({ ArtifactsConfiguration: ArtifactsConcatenationConfiguration }) {}
export class MediaCapturePipelineSourceConfiguration extends S.Class<MediaCapturePipelineSourceConfiguration>(
  "MediaCapturePipelineSourceConfiguration",
)({
  MediaPipelineArn: S.String,
  ChimeSdkMeetingConfiguration: ChimeSdkMeetingConcatenationConfiguration,
}) {}
export class ConcatenationSource extends S.Class<ConcatenationSource>(
  "ConcatenationSource",
)({
  Type: S.String,
  MediaCapturePipelineSourceConfiguration:
    MediaCapturePipelineSourceConfiguration,
}) {}
export const ConcatenationSourceList = S.Array(ConcatenationSource);
export class MediaConcatenationPipeline extends S.Class<MediaConcatenationPipeline>(
  "MediaConcatenationPipeline",
)({
  MediaPipelineId: S.optional(S.String),
  MediaPipelineArn: S.optional(S.String),
  Sources: S.optional(ConcatenationSourceList),
  Sinks: S.optional(ConcatenationSinkList),
  Status: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class ChannelDefinition extends S.Class<ChannelDefinition>(
  "ChannelDefinition",
)({ ChannelId: S.Number, ParticipantRole: S.optional(S.String) }) {}
export const ChannelDefinitions = S.Array(ChannelDefinition);
export class KinesisVideoStreamRecordingSourceRuntimeConfiguration extends S.Class<KinesisVideoStreamRecordingSourceRuntimeConfiguration>(
  "KinesisVideoStreamRecordingSourceRuntimeConfiguration",
)({ Streams: RecordingStreamList, FragmentSelector: FragmentSelector }) {}
export class StreamChannelDefinition extends S.Class<StreamChannelDefinition>(
  "StreamChannelDefinition",
)({
  NumberOfChannels: S.Number,
  ChannelDefinitions: S.optional(ChannelDefinitions),
}) {}
export class MediaInsightsPipelineElementStatus extends S.Class<MediaInsightsPipelineElementStatus>(
  "MediaInsightsPipelineElementStatus",
)({ Type: S.optional(S.String), Status: S.optional(S.String) }) {}
export const MediaInsightsPipelineElementStatuses = S.Array(
  MediaInsightsPipelineElementStatus,
);
export class CreateMediaInsightsPipelineConfigurationRequest extends S.Class<CreateMediaInsightsPipelineConfigurationRequest>(
  "CreateMediaInsightsPipelineConfigurationRequest",
)(
  {
    MediaInsightsPipelineConfigurationName: S.String,
    ResourceAccessRoleArn: S.String,
    RealTimeAlertConfiguration: S.optional(RealTimeAlertConfiguration),
    Elements: MediaInsightsPipelineConfigurationElements,
    Tags: S.optional(TagList),
    ClientRequestToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/media-insights-pipeline-configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateMediaLiveConnectorPipelineResponse extends S.Class<CreateMediaLiveConnectorPipelineResponse>(
  "CreateMediaLiveConnectorPipelineResponse",
)({ MediaLiveConnectorPipeline: S.optional(MediaLiveConnectorPipeline) }) {}
export class StreamConfiguration extends S.Class<StreamConfiguration>(
  "StreamConfiguration",
)({
  StreamArn: S.String,
  FragmentNumber: S.optional(S.String),
  StreamChannelDefinition: StreamChannelDefinition,
}) {}
export const Streams = S.Array(StreamConfiguration);
export class KinesisVideoStreamSourceRuntimeConfiguration extends S.Class<KinesisVideoStreamSourceRuntimeConfiguration>(
  "KinesisVideoStreamSourceRuntimeConfiguration",
)({ Streams: Streams, MediaEncoding: S.String, MediaSampleRate: S.Number }) {}
export class MediaInsightsPipeline extends S.Class<MediaInsightsPipeline>(
  "MediaInsightsPipeline",
)({
  MediaPipelineId: S.optional(S.String),
  MediaPipelineArn: S.optional(S.String),
  MediaInsightsPipelineConfigurationArn: S.optional(S.String),
  Status: S.optional(S.String),
  KinesisVideoStreamSourceRuntimeConfiguration: S.optional(
    KinesisVideoStreamSourceRuntimeConfiguration,
  ),
  MediaInsightsRuntimeMetadata: S.optional(MediaInsightsRuntimeMetadata),
  KinesisVideoStreamRecordingSourceRuntimeConfiguration: S.optional(
    KinesisVideoStreamRecordingSourceRuntimeConfiguration,
  ),
  S3RecordingSinkRuntimeConfiguration: S.optional(
    S3RecordingSinkRuntimeConfiguration,
  ),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ElementStatuses: S.optional(MediaInsightsPipelineElementStatuses),
}) {}
export class MediaPipeline extends S.Class<MediaPipeline>("MediaPipeline")({
  MediaCapturePipeline: S.optional(MediaCapturePipeline),
  MediaLiveConnectorPipeline: S.optional(MediaLiveConnectorPipeline),
  MediaConcatenationPipeline: S.optional(MediaConcatenationPipeline),
  MediaInsightsPipeline: S.optional(MediaInsightsPipeline),
  MediaStreamPipeline: S.optional(MediaStreamPipeline),
}) {}
export class CreateMediaInsightsPipelineRequest extends S.Class<CreateMediaInsightsPipelineRequest>(
  "CreateMediaInsightsPipelineRequest",
)(
  {
    MediaInsightsPipelineConfigurationArn: S.String,
    KinesisVideoStreamSourceRuntimeConfiguration: S.optional(
      KinesisVideoStreamSourceRuntimeConfiguration,
    ),
    MediaInsightsRuntimeMetadata: S.optional(MediaInsightsRuntimeMetadata),
    KinesisVideoStreamRecordingSourceRuntimeConfiguration: S.optional(
      KinesisVideoStreamRecordingSourceRuntimeConfiguration,
    ),
    S3RecordingSinkRuntimeConfiguration: S.optional(
      S3RecordingSinkRuntimeConfiguration,
    ),
    Tags: S.optional(TagList),
    ClientRequestToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/media-insights-pipelines" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateMediaInsightsPipelineConfigurationResponse extends S.Class<CreateMediaInsightsPipelineConfigurationResponse>(
  "CreateMediaInsightsPipelineConfigurationResponse",
)({
  MediaInsightsPipelineConfiguration: S.optional(
    MediaInsightsPipelineConfiguration,
  ),
}) {}
export class GetMediaPipelineResponse extends S.Class<GetMediaPipelineResponse>(
  "GetMediaPipelineResponse",
)({ MediaPipeline: S.optional(MediaPipeline) }) {}
export class CreateMediaCapturePipelineRequest extends S.Class<CreateMediaCapturePipelineRequest>(
  "CreateMediaCapturePipelineRequest",
)(
  {
    SourceType: S.String,
    SourceArn: S.String,
    SinkType: S.String,
    SinkArn: S.String,
    ClientRequestToken: S.optional(S.String),
    ChimeSdkMeetingConfiguration: S.optional(ChimeSdkMeetingConfiguration),
    SseAwsKeyManagementParams: S.optional(SseAwsKeyManagementParams),
    SinkIamRoleArn: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/sdk-media-capture-pipelines" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateMediaConcatenationPipelineRequest extends S.Class<CreateMediaConcatenationPipelineRequest>(
  "CreateMediaConcatenationPipelineRequest",
)(
  {
    Sources: ConcatenationSourceList,
    Sinks: ConcatenationSinkList,
    ClientRequestToken: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/sdk-media-concatenation-pipelines" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateMediaInsightsPipelineResponse extends S.Class<CreateMediaInsightsPipelineResponse>(
  "CreateMediaInsightsPipelineResponse",
)({ MediaInsightsPipeline: MediaInsightsPipeline }) {}
export class CreateMediaCapturePipelineResponse extends S.Class<CreateMediaCapturePipelineResponse>(
  "CreateMediaCapturePipelineResponse",
)({ MediaCapturePipeline: S.optional(MediaCapturePipeline) }) {}
export class CreateMediaConcatenationPipelineResponse extends S.Class<CreateMediaConcatenationPipelineResponse>(
  "CreateMediaConcatenationPipelineResponse",
)({ MediaConcatenationPipeline: S.optional(MediaConcatenationPipeline) }) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    RequestId: S.optional(S.String),
  },
) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    RequestId: S.optional(S.String),
  },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    RequestId: S.optional(S.String),
  },
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    RequestId: S.optional(S.String),
  },
) {}
export class ResourceLimitExceededException extends S.TaggedError<ResourceLimitExceededException>()(
  "ResourceLimitExceededException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    RequestId: S.optional(S.String),
  },
) {}
export class ServiceFailureException extends S.TaggedError<ServiceFailureException>()(
  "ServiceFailureException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    RequestId: S.optional(S.String),
  },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    RequestId: S.optional(S.String),
  },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ThrottledClientException extends S.TaggedError<ThrottledClientException>()(
  "ThrottledClientException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    RequestId: S.optional(S.String),
  },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class UnauthorizedClientException extends S.TaggedError<UnauthorizedClientException>()(
  "UnauthorizedClientException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    RequestId: S.optional(S.String),
  },
) {}

//# Operations
/**
 * Deletes the media pipeline.
 */
export const deleteMediaCapturePipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteMediaCapturePipelineRequest,
    output: DeleteMediaCapturePipelineResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Gets an existing media pipeline.
 */
export const getMediaPipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMediaPipelineRequest,
  output: GetMediaPipelineResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Returns a list of media pipelines.
 */
export const listMediaCapturePipelines =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListMediaCapturePipelinesRequest,
    output: ListMediaCapturePipelinesResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Gets an existing media pipeline.
 */
export const getMediaCapturePipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetMediaCapturePipelineRequest,
    output: GetMediaCapturePipelineResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Gets the configuration settings for a media insights pipeline.
 */
export const getMediaInsightsPipelineConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetMediaInsightsPipelineConfigurationRequest,
    output: GetMediaInsightsPipelineConfigurationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Gets an Kinesis video stream pool.
 */
export const getMediaPipelineKinesisVideoStreamPool =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetMediaPipelineKinesisVideoStreamPoolRequest,
    output: GetMediaPipelineKinesisVideoStreamPoolResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Retrieves the details of the specified speaker search task.
 */
export const getSpeakerSearchTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSpeakerSearchTaskRequest,
    output: GetSpeakerSearchTaskResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Retrieves the details of a voice tone analysis task.
 */
export const getVoiceToneAnalysisTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetVoiceToneAnalysisTaskRequest,
    output: GetVoiceToneAnalysisTaskResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Starts a voice tone analysis task. For more information about voice tone analysis, see
 * Using Amazon Chime SDK voice analytics
 * in the *Amazon Chime SDK Developer Guide*.
 *
 * Before starting any voice tone analysis tasks, you must provide all notices and obtain all consents from the speaker as required under applicable privacy and biometrics laws, and as required under the
 * AWS service terms for the Amazon Chime SDK.
 */
export const startVoiceToneAnalysisTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartVoiceToneAnalysisTaskRequest,
    output: StartVoiceToneAnalysisTaskResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Updates an Amazon Kinesis Video Stream pool in a media pipeline.
 */
export const updateMediaPipelineKinesisVideoStreamPool =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateMediaPipelineKinesisVideoStreamPoolRequest,
    output: UpdateMediaPipelineKinesisVideoStreamPoolResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Lists the tags available for a media pipeline.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * The ARN of the media pipeline that you want to tag. Consists of the pipeline's endpoint region, resource ID, and pipeline ID.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Removes any tags from a media pipeline.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Creates a streaming media pipeline.
 */
export const createMediaStreamPipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateMediaStreamPipelineRequest,
    output: CreateMediaStreamPipelineResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Updates the media insights pipeline's configuration settings.
 */
export const updateMediaInsightsPipelineConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateMediaInsightsPipelineConfigurationRequest,
    output: UpdateMediaInsightsPipelineConfigurationResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Deletes the specified configuration settings.
 */
export const deleteMediaInsightsPipelineConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteMediaInsightsPipelineConfigurationRequest,
    output: DeleteMediaInsightsPipelineConfigurationResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Deletes the media pipeline.
 */
export const deleteMediaPipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMediaPipelineRequest,
  output: DeleteMediaPipelineResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Deletes an Amazon Kinesis Video Stream pool.
 */
export const deleteMediaPipelineKinesisVideoStreamPool =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteMediaPipelineKinesisVideoStreamPoolRequest,
    output: DeleteMediaPipelineKinesisVideoStreamPoolResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Stops a speaker search task.
 */
export const stopSpeakerSearchTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopSpeakerSearchTaskRequest,
    output: StopSpeakerSearchTaskResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Stops a voice tone analysis task.
 */
export const stopVoiceToneAnalysisTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopVoiceToneAnalysisTaskRequest,
    output: StopVoiceToneAnalysisTaskResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Updates the status of a media insights pipeline.
 */
export const updateMediaInsightsPipelineStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateMediaInsightsPipelineStatusRequest,
    output: UpdateMediaInsightsPipelineStatusResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Starts a speaker search task.
 *
 * Before starting any speaker search tasks, you must provide all notices and obtain all consents from the speaker as required under applicable privacy and biometrics laws, and as required under the
 * AWS service terms for the Amazon Chime SDK.
 */
export const startSpeakerSearchTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartSpeakerSearchTaskRequest,
    output: StartSpeakerSearchTaskResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Lists the available media insights pipeline configurations.
 */
export const listMediaInsightsPipelineConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListMediaInsightsPipelineConfigurationsRequest,
    output: ListMediaInsightsPipelineConfigurationsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the video stream pools in the media pipeline.
 */
export const listMediaPipelineKinesisVideoStreamPools =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListMediaPipelineKinesisVideoStreamPoolsRequest,
    output: ListMediaPipelineKinesisVideoStreamPoolsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns a list of media pipelines.
 */
export const listMediaPipelines = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListMediaPipelinesRequest,
    output: ListMediaPipelinesResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Creates an Amazon Kinesis Video Stream pool for use with media stream
 * pipelines.
 *
 * If a meeting uses an opt-in Region as its
 * MediaRegion,
 * the KVS stream must be in that same Region. For example, if a meeting uses the `af-south-1` Region, the KVS stream must also be in `af-south-1`. However, if the meeting uses a
 * Region that AWS turns on by default, the KVS stream can be in any available Region, including an opt-in Region. For example, if the meeting uses `ca-central-1`, the KVS stream can be in
 * `eu-west-2`, `us-east-1`, `af-south-1`, or any other Region that the Amazon Chime SDK supports.
 *
 * To learn which AWS Region a meeting uses, call the GetMeeting API and
 * use the MediaRegion
 * parameter from the response.
 *
 * For more information about opt-in Regions, refer to Available Regions in the
 * *Amazon Chime SDK Developer Guide*, and
 * Specify which AWS Regions your account can use,
 * in the *AWS Account Management Reference Guide*.
 */
export const createMediaPipelineKinesisVideoStreamPool =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateMediaPipelineKinesisVideoStreamPoolRequest,
    output: CreateMediaPipelineKinesisVideoStreamPoolResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Creates a media live connector pipeline in an Amazon Chime SDK meeting.
 */
export const createMediaLiveConnectorPipeline =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateMediaLiveConnectorPipelineRequest,
    output: CreateMediaLiveConnectorPipelineResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * A structure that contains the static configurations for a media insights
 * pipeline.
 */
export const createMediaInsightsPipelineConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateMediaInsightsPipelineConfigurationRequest,
    output: CreateMediaInsightsPipelineConfigurationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Creates a media insights pipeline.
 */
export const createMediaInsightsPipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateMediaInsightsPipelineRequest,
    output: CreateMediaInsightsPipelineResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Creates a media pipeline.
 */
export const createMediaCapturePipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateMediaCapturePipelineRequest,
    output: CreateMediaCapturePipelineResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Creates a media concatenation pipeline.
 */
export const createMediaConcatenationPipeline =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateMediaConcatenationPipelineRequest,
    output: CreateMediaConcatenationPipelineResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
