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
  sdkId: "Bedrock Data Automation",
  serviceShapeName: "AmazonBedrockKeystoneBuildTimeService",
});
const auth = T.AwsAuthSigv4({ name: "bedrock" });
const ver = T.ServiceVersion("2023-07-26");
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
              `https://bedrock-data-automation-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://bedrock-data-automation-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://bedrock-data-automation.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://bedrock-data-automation.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type BlueprintArn = string;
export type ClientToken = string;
export type TaggableResourceArn = string;
export type TagKey = string;
export type DataAutomationProfileArn = string;
export type BlueprintOptimizationInvocationArn = string;
export type BlueprintName = string | redacted.Redacted<string>;
export type BlueprintSchema = string | redacted.Redacted<string>;
export type BlueprintVersion = string;
export type MaxResults = number;
export type NextToken = string;
export type DataAutomationProjectName = string | redacted.Redacted<string>;
export type DataAutomationProjectDescription =
  | string
  | redacted.Redacted<string>;
export type DataAutomationProjectArn = string;
export type TagValue = string;
export type KmsKeyId = string;
export type NonBlankString = string;
export type S3Uri = string;
export type S3ObjectVersion = string;
export type EncryptionContextKey = string;
export type EncryptionContextValue = string;

//# Schemas
export type BlueprintStage = "DEVELOPMENT" | "LIVE";
export const BlueprintStage = S.Literal("DEVELOPMENT", "LIVE");
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type Type = "DOCUMENT" | "IMAGE" | "AUDIO" | "VIDEO";
export const Type = S.Literal("DOCUMENT", "IMAGE", "AUDIO", "VIDEO");
export type ResourceOwner = "SERVICE" | "ACCOUNT";
export const ResourceOwner = S.Literal("SERVICE", "ACCOUNT");
export type BlueprintStageFilter = "DEVELOPMENT" | "LIVE" | "ALL";
export const BlueprintStageFilter = S.Literal("DEVELOPMENT", "LIVE", "ALL");
export type DataAutomationProjectStage = "DEVELOPMENT" | "LIVE";
export const DataAutomationProjectStage = S.Literal("DEVELOPMENT", "LIVE");
export type DataAutomationProjectType = "ASYNC" | "SYNC";
export const DataAutomationProjectType = S.Literal("ASYNC", "SYNC");
export type DataAutomationProjectStageFilter = "DEVELOPMENT" | "LIVE" | "ALL";
export const DataAutomationProjectStageFilter = S.Literal(
  "DEVELOPMENT",
  "LIVE",
  "ALL",
);
export interface CopyBlueprintStageRequest {
  blueprintArn: string;
  sourceStage: BlueprintStage;
  targetStage: BlueprintStage;
  clientToken?: string;
}
export const CopyBlueprintStageRequest = S.suspend(() =>
  S.Struct({
    blueprintArn: S.String.pipe(T.HttpLabel("blueprintArn")),
    sourceStage: BlueprintStage,
    targetStage: BlueprintStage,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/blueprints/{blueprintArn}/copy-stage" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CopyBlueprintStageRequest",
}) as any as S.Schema<CopyBlueprintStageRequest>;
export interface CopyBlueprintStageResponse {}
export const CopyBlueprintStageResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CopyBlueprintStageResponse",
}) as any as S.Schema<CopyBlueprintStageResponse>;
export interface CreateBlueprintVersionRequest {
  blueprintArn: string;
  clientToken?: string;
}
export const CreateBlueprintVersionRequest = S.suspend(() =>
  S.Struct({
    blueprintArn: S.String.pipe(T.HttpLabel("blueprintArn")),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/blueprints/{blueprintArn}/versions/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBlueprintVersionRequest",
}) as any as S.Schema<CreateBlueprintVersionRequest>;
export interface ListTagsForResourceRequest {
  resourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceARN: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listTagsForResource" }),
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
  resourceARN: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ resourceARN: S.String, tagKeys: TagKeyList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/untagResource" }),
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
export interface GetBlueprintOptimizationStatusRequest {
  invocationArn: string;
}
export const GetBlueprintOptimizationStatusRequest = S.suspend(() =>
  S.Struct({ invocationArn: S.String.pipe(T.HttpLabel("invocationArn")) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/getBlueprintOptimizationStatus/{invocationArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBlueprintOptimizationStatusRequest",
}) as any as S.Schema<GetBlueprintOptimizationStatusRequest>;
export type KmsEncryptionContext = { [key: string]: string };
export const KmsEncryptionContext = S.Record({
  key: S.String,
  value: S.String,
});
export interface EncryptionConfiguration {
  kmsKeyId: string;
  kmsEncryptionContext?: { [key: string]: string };
}
export const EncryptionConfiguration = S.suspend(() =>
  S.Struct({
    kmsKeyId: S.String,
    kmsEncryptionContext: S.optional(KmsEncryptionContext),
  }),
).annotations({
  identifier: "EncryptionConfiguration",
}) as any as S.Schema<EncryptionConfiguration>;
export interface Tag {
  key: string;
  value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateBlueprintRequest {
  blueprintName: string | redacted.Redacted<string>;
  type: Type;
  blueprintStage?: BlueprintStage;
  schema: string | redacted.Redacted<string>;
  clientToken?: string;
  encryptionConfiguration?: EncryptionConfiguration;
  tags?: Tag[];
}
export const CreateBlueprintRequest = S.suspend(() =>
  S.Struct({
    blueprintName: SensitiveString,
    type: Type,
    blueprintStage: S.optional(BlueprintStage),
    schema: SensitiveString,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/blueprints/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBlueprintRequest",
}) as any as S.Schema<CreateBlueprintRequest>;
export interface GetBlueprintRequest {
  blueprintArn: string;
  blueprintVersion?: string;
  blueprintStage?: BlueprintStage;
}
export const GetBlueprintRequest = S.suspend(() =>
  S.Struct({
    blueprintArn: S.String.pipe(T.HttpLabel("blueprintArn")),
    blueprintVersion: S.optional(S.String),
    blueprintStage: S.optional(BlueprintStage),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/blueprints/{blueprintArn}/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBlueprintRequest",
}) as any as S.Schema<GetBlueprintRequest>;
export interface UpdateBlueprintRequest {
  blueprintArn: string;
  schema: string | redacted.Redacted<string>;
  blueprintStage?: BlueprintStage;
  encryptionConfiguration?: EncryptionConfiguration;
}
export const UpdateBlueprintRequest = S.suspend(() =>
  S.Struct({
    blueprintArn: S.String.pipe(T.HttpLabel("blueprintArn")),
    schema: SensitiveString,
    blueprintStage: S.optional(BlueprintStage),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/blueprints/{blueprintArn}/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBlueprintRequest",
}) as any as S.Schema<UpdateBlueprintRequest>;
export interface DeleteBlueprintRequest {
  blueprintArn: string;
  blueprintVersion?: string;
}
export const DeleteBlueprintRequest = S.suspend(() =>
  S.Struct({
    blueprintArn: S.String.pipe(T.HttpLabel("blueprintArn")),
    blueprintVersion: S.optional(S.String).pipe(
      T.HttpQuery("blueprintVersion"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/blueprints/{blueprintArn}/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBlueprintRequest",
}) as any as S.Schema<DeleteBlueprintRequest>;
export interface DeleteBlueprintResponse {}
export const DeleteBlueprintResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteBlueprintResponse",
}) as any as S.Schema<DeleteBlueprintResponse>;
export interface GetDataAutomationProjectRequest {
  projectArn: string;
  projectStage?: DataAutomationProjectStage;
}
export const GetDataAutomationProjectRequest = S.suspend(() =>
  S.Struct({
    projectArn: S.String.pipe(T.HttpLabel("projectArn")),
    projectStage: S.optional(DataAutomationProjectStage),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/data-automation-projects/{projectArn}/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDataAutomationProjectRequest",
}) as any as S.Schema<GetDataAutomationProjectRequest>;
export type DocumentExtractionGranularityType =
  | "DOCUMENT"
  | "PAGE"
  | "ELEMENT"
  | "WORD"
  | "LINE";
export const DocumentExtractionGranularityType = S.Literal(
  "DOCUMENT",
  "PAGE",
  "ELEMENT",
  "WORD",
  "LINE",
);
export type DocumentExtractionGranularityTypes =
  DocumentExtractionGranularityType[];
export const DocumentExtractionGranularityTypes = S.Array(
  DocumentExtractionGranularityType,
);
export interface DocumentExtractionGranularity {
  types?: DocumentExtractionGranularityType[];
}
export const DocumentExtractionGranularity = S.suspend(() =>
  S.Struct({ types: S.optional(DocumentExtractionGranularityTypes) }),
).annotations({
  identifier: "DocumentExtractionGranularity",
}) as any as S.Schema<DocumentExtractionGranularity>;
export type State = "ENABLED" | "DISABLED";
export const State = S.Literal("ENABLED", "DISABLED");
export interface DocumentBoundingBox {
  state: State;
}
export const DocumentBoundingBox = S.suspend(() =>
  S.Struct({ state: State }),
).annotations({
  identifier: "DocumentBoundingBox",
}) as any as S.Schema<DocumentBoundingBox>;
export interface DocumentStandardExtraction {
  granularity: DocumentExtractionGranularity;
  boundingBox: DocumentBoundingBox;
}
export const DocumentStandardExtraction = S.suspend(() =>
  S.Struct({
    granularity: DocumentExtractionGranularity,
    boundingBox: DocumentBoundingBox,
  }),
).annotations({
  identifier: "DocumentStandardExtraction",
}) as any as S.Schema<DocumentStandardExtraction>;
export interface DocumentStandardGenerativeField {
  state: State;
}
export const DocumentStandardGenerativeField = S.suspend(() =>
  S.Struct({ state: State }),
).annotations({
  identifier: "DocumentStandardGenerativeField",
}) as any as S.Schema<DocumentStandardGenerativeField>;
export type DocumentOutputTextFormatType =
  | "PLAIN_TEXT"
  | "MARKDOWN"
  | "HTML"
  | "CSV";
export const DocumentOutputTextFormatType = S.Literal(
  "PLAIN_TEXT",
  "MARKDOWN",
  "HTML",
  "CSV",
);
export type DocumentOutputTextFormatTypes = DocumentOutputTextFormatType[];
export const DocumentOutputTextFormatTypes = S.Array(
  DocumentOutputTextFormatType,
);
export interface DocumentOutputTextFormat {
  types?: DocumentOutputTextFormatType[];
}
export const DocumentOutputTextFormat = S.suspend(() =>
  S.Struct({ types: S.optional(DocumentOutputTextFormatTypes) }),
).annotations({
  identifier: "DocumentOutputTextFormat",
}) as any as S.Schema<DocumentOutputTextFormat>;
export interface DocumentOutputAdditionalFileFormat {
  state: State;
}
export const DocumentOutputAdditionalFileFormat = S.suspend(() =>
  S.Struct({ state: State }),
).annotations({
  identifier: "DocumentOutputAdditionalFileFormat",
}) as any as S.Schema<DocumentOutputAdditionalFileFormat>;
export interface DocumentOutputFormat {
  textFormat: DocumentOutputTextFormat;
  additionalFileFormat: DocumentOutputAdditionalFileFormat;
}
export const DocumentOutputFormat = S.suspend(() =>
  S.Struct({
    textFormat: DocumentOutputTextFormat,
    additionalFileFormat: DocumentOutputAdditionalFileFormat,
  }),
).annotations({
  identifier: "DocumentOutputFormat",
}) as any as S.Schema<DocumentOutputFormat>;
export interface DocumentStandardOutputConfiguration {
  extraction?: DocumentStandardExtraction;
  generativeField?: DocumentStandardGenerativeField;
  outputFormat?: DocumentOutputFormat;
}
export const DocumentStandardOutputConfiguration = S.suspend(() =>
  S.Struct({
    extraction: S.optional(DocumentStandardExtraction),
    generativeField: S.optional(DocumentStandardGenerativeField),
    outputFormat: S.optional(DocumentOutputFormat),
  }),
).annotations({
  identifier: "DocumentStandardOutputConfiguration",
}) as any as S.Schema<DocumentStandardOutputConfiguration>;
export type ImageExtractionCategoryType =
  | "CONTENT_MODERATION"
  | "TEXT_DETECTION"
  | "LOGOS";
export const ImageExtractionCategoryType = S.Literal(
  "CONTENT_MODERATION",
  "TEXT_DETECTION",
  "LOGOS",
);
export type ImageExtractionCategoryTypes = ImageExtractionCategoryType[];
export const ImageExtractionCategoryTypes = S.Array(
  ImageExtractionCategoryType,
);
export interface ImageExtractionCategory {
  state: State;
  types?: ImageExtractionCategoryType[];
}
export const ImageExtractionCategory = S.suspend(() =>
  S.Struct({ state: State, types: S.optional(ImageExtractionCategoryTypes) }),
).annotations({
  identifier: "ImageExtractionCategory",
}) as any as S.Schema<ImageExtractionCategory>;
export interface ImageBoundingBox {
  state: State;
}
export const ImageBoundingBox = S.suspend(() =>
  S.Struct({ state: State }),
).annotations({
  identifier: "ImageBoundingBox",
}) as any as S.Schema<ImageBoundingBox>;
export interface ImageStandardExtraction {
  category: ImageExtractionCategory;
  boundingBox: ImageBoundingBox;
}
export const ImageStandardExtraction = S.suspend(() =>
  S.Struct({
    category: ImageExtractionCategory,
    boundingBox: ImageBoundingBox,
  }),
).annotations({
  identifier: "ImageStandardExtraction",
}) as any as S.Schema<ImageStandardExtraction>;
export type ImageStandardGenerativeFieldType = "IMAGE_SUMMARY" | "IAB";
export const ImageStandardGenerativeFieldType = S.Literal(
  "IMAGE_SUMMARY",
  "IAB",
);
export type ImageStandardGenerativeFieldTypes =
  ImageStandardGenerativeFieldType[];
export const ImageStandardGenerativeFieldTypes = S.Array(
  ImageStandardGenerativeFieldType,
);
export interface ImageStandardGenerativeField {
  state: State;
  types?: ImageStandardGenerativeFieldType[];
}
export const ImageStandardGenerativeField = S.suspend(() =>
  S.Struct({
    state: State,
    types: S.optional(ImageStandardGenerativeFieldTypes),
  }),
).annotations({
  identifier: "ImageStandardGenerativeField",
}) as any as S.Schema<ImageStandardGenerativeField>;
export interface ImageStandardOutputConfiguration {
  extraction?: ImageStandardExtraction;
  generativeField?: ImageStandardGenerativeField;
}
export const ImageStandardOutputConfiguration = S.suspend(() =>
  S.Struct({
    extraction: S.optional(ImageStandardExtraction),
    generativeField: S.optional(ImageStandardGenerativeField),
  }),
).annotations({
  identifier: "ImageStandardOutputConfiguration",
}) as any as S.Schema<ImageStandardOutputConfiguration>;
export type VideoExtractionCategoryType =
  | "CONTENT_MODERATION"
  | "TEXT_DETECTION"
  | "TRANSCRIPT"
  | "LOGOS";
export const VideoExtractionCategoryType = S.Literal(
  "CONTENT_MODERATION",
  "TEXT_DETECTION",
  "TRANSCRIPT",
  "LOGOS",
);
export type VideoExtractionCategoryTypes = VideoExtractionCategoryType[];
export const VideoExtractionCategoryTypes = S.Array(
  VideoExtractionCategoryType,
);
export interface VideoExtractionCategory {
  state: State;
  types?: VideoExtractionCategoryType[];
}
export const VideoExtractionCategory = S.suspend(() =>
  S.Struct({ state: State, types: S.optional(VideoExtractionCategoryTypes) }),
).annotations({
  identifier: "VideoExtractionCategory",
}) as any as S.Schema<VideoExtractionCategory>;
export interface VideoBoundingBox {
  state: State;
}
export const VideoBoundingBox = S.suspend(() =>
  S.Struct({ state: State }),
).annotations({
  identifier: "VideoBoundingBox",
}) as any as S.Schema<VideoBoundingBox>;
export interface VideoStandardExtraction {
  category: VideoExtractionCategory;
  boundingBox: VideoBoundingBox;
}
export const VideoStandardExtraction = S.suspend(() =>
  S.Struct({
    category: VideoExtractionCategory,
    boundingBox: VideoBoundingBox,
  }),
).annotations({
  identifier: "VideoStandardExtraction",
}) as any as S.Schema<VideoStandardExtraction>;
export type VideoStandardGenerativeFieldType =
  | "VIDEO_SUMMARY"
  | "IAB"
  | "CHAPTER_SUMMARY";
export const VideoStandardGenerativeFieldType = S.Literal(
  "VIDEO_SUMMARY",
  "IAB",
  "CHAPTER_SUMMARY",
);
export type VideoStandardGenerativeFieldTypes =
  VideoStandardGenerativeFieldType[];
export const VideoStandardGenerativeFieldTypes = S.Array(
  VideoStandardGenerativeFieldType,
);
export interface VideoStandardGenerativeField {
  state: State;
  types?: VideoStandardGenerativeFieldType[];
}
export const VideoStandardGenerativeField = S.suspend(() =>
  S.Struct({
    state: State,
    types: S.optional(VideoStandardGenerativeFieldTypes),
  }),
).annotations({
  identifier: "VideoStandardGenerativeField",
}) as any as S.Schema<VideoStandardGenerativeField>;
export interface VideoStandardOutputConfiguration {
  extraction?: VideoStandardExtraction;
  generativeField?: VideoStandardGenerativeField;
}
export const VideoStandardOutputConfiguration = S.suspend(() =>
  S.Struct({
    extraction: S.optional(VideoStandardExtraction),
    generativeField: S.optional(VideoStandardGenerativeField),
  }),
).annotations({
  identifier: "VideoStandardOutputConfiguration",
}) as any as S.Schema<VideoStandardOutputConfiguration>;
export type AudioExtractionCategoryType =
  | "AUDIO_CONTENT_MODERATION"
  | "TRANSCRIPT"
  | "TOPIC_CONTENT_MODERATION";
export const AudioExtractionCategoryType = S.Literal(
  "AUDIO_CONTENT_MODERATION",
  "TRANSCRIPT",
  "TOPIC_CONTENT_MODERATION",
);
export type AudioExtractionCategoryTypes = AudioExtractionCategoryType[];
export const AudioExtractionCategoryTypes = S.Array(
  AudioExtractionCategoryType,
);
export interface SpeakerLabelingConfiguration {
  state: State;
}
export const SpeakerLabelingConfiguration = S.suspend(() =>
  S.Struct({ state: State }),
).annotations({
  identifier: "SpeakerLabelingConfiguration",
}) as any as S.Schema<SpeakerLabelingConfiguration>;
export interface ChannelLabelingConfiguration {
  state: State;
}
export const ChannelLabelingConfiguration = S.suspend(() =>
  S.Struct({ state: State }),
).annotations({
  identifier: "ChannelLabelingConfiguration",
}) as any as S.Schema<ChannelLabelingConfiguration>;
export interface TranscriptConfiguration {
  speakerLabeling?: SpeakerLabelingConfiguration;
  channelLabeling?: ChannelLabelingConfiguration;
}
export const TranscriptConfiguration = S.suspend(() =>
  S.Struct({
    speakerLabeling: S.optional(SpeakerLabelingConfiguration),
    channelLabeling: S.optional(ChannelLabelingConfiguration),
  }),
).annotations({
  identifier: "TranscriptConfiguration",
}) as any as S.Schema<TranscriptConfiguration>;
export interface AudioExtractionCategoryTypeConfiguration {
  transcript?: TranscriptConfiguration;
}
export const AudioExtractionCategoryTypeConfiguration = S.suspend(() =>
  S.Struct({ transcript: S.optional(TranscriptConfiguration) }),
).annotations({
  identifier: "AudioExtractionCategoryTypeConfiguration",
}) as any as S.Schema<AudioExtractionCategoryTypeConfiguration>;
export interface AudioExtractionCategory {
  state: State;
  types?: AudioExtractionCategoryType[];
  typeConfiguration?: AudioExtractionCategoryTypeConfiguration;
}
export const AudioExtractionCategory = S.suspend(() =>
  S.Struct({
    state: State,
    types: S.optional(AudioExtractionCategoryTypes),
    typeConfiguration: S.optional(AudioExtractionCategoryTypeConfiguration),
  }),
).annotations({
  identifier: "AudioExtractionCategory",
}) as any as S.Schema<AudioExtractionCategory>;
export interface AudioStandardExtraction {
  category: AudioExtractionCategory;
}
export const AudioStandardExtraction = S.suspend(() =>
  S.Struct({ category: AudioExtractionCategory }),
).annotations({
  identifier: "AudioStandardExtraction",
}) as any as S.Schema<AudioStandardExtraction>;
export type AudioStandardGenerativeFieldType =
  | "AUDIO_SUMMARY"
  | "IAB"
  | "TOPIC_SUMMARY";
export const AudioStandardGenerativeFieldType = S.Literal(
  "AUDIO_SUMMARY",
  "IAB",
  "TOPIC_SUMMARY",
);
export type AudioStandardGenerativeFieldTypes =
  AudioStandardGenerativeFieldType[];
export const AudioStandardGenerativeFieldTypes = S.Array(
  AudioStandardGenerativeFieldType,
);
export interface AudioStandardGenerativeField {
  state: State;
  types?: AudioStandardGenerativeFieldType[];
}
export const AudioStandardGenerativeField = S.suspend(() =>
  S.Struct({
    state: State,
    types: S.optional(AudioStandardGenerativeFieldTypes),
  }),
).annotations({
  identifier: "AudioStandardGenerativeField",
}) as any as S.Schema<AudioStandardGenerativeField>;
export interface AudioStandardOutputConfiguration {
  extraction?: AudioStandardExtraction;
  generativeField?: AudioStandardGenerativeField;
}
export const AudioStandardOutputConfiguration = S.suspend(() =>
  S.Struct({
    extraction: S.optional(AudioStandardExtraction),
    generativeField: S.optional(AudioStandardGenerativeField),
  }),
).annotations({
  identifier: "AudioStandardOutputConfiguration",
}) as any as S.Schema<AudioStandardOutputConfiguration>;
export interface StandardOutputConfiguration {
  document?: DocumentStandardOutputConfiguration;
  image?: ImageStandardOutputConfiguration;
  video?: VideoStandardOutputConfiguration;
  audio?: AudioStandardOutputConfiguration;
}
export const StandardOutputConfiguration = S.suspend(() =>
  S.Struct({
    document: S.optional(DocumentStandardOutputConfiguration),
    image: S.optional(ImageStandardOutputConfiguration),
    video: S.optional(VideoStandardOutputConfiguration),
    audio: S.optional(AudioStandardOutputConfiguration),
  }),
).annotations({
  identifier: "StandardOutputConfiguration",
}) as any as S.Schema<StandardOutputConfiguration>;
export interface BlueprintItem {
  blueprintArn: string;
  blueprintVersion?: string;
  blueprintStage?: BlueprintStage;
}
export const BlueprintItem = S.suspend(() =>
  S.Struct({
    blueprintArn: S.String,
    blueprintVersion: S.optional(S.String),
    blueprintStage: S.optional(BlueprintStage),
  }),
).annotations({
  identifier: "BlueprintItem",
}) as any as S.Schema<BlueprintItem>;
export type BlueprintItems = BlueprintItem[];
export const BlueprintItems = S.Array(BlueprintItem);
export interface CustomOutputConfiguration {
  blueprints?: BlueprintItem[];
}
export const CustomOutputConfiguration = S.suspend(() =>
  S.Struct({ blueprints: S.optional(BlueprintItems) }),
).annotations({
  identifier: "CustomOutputConfiguration",
}) as any as S.Schema<CustomOutputConfiguration>;
export interface SplitterConfiguration {
  state?: State;
}
export const SplitterConfiguration = S.suspend(() =>
  S.Struct({ state: S.optional(State) }),
).annotations({
  identifier: "SplitterConfiguration",
}) as any as S.Schema<SplitterConfiguration>;
export interface ModalityProcessingConfiguration {
  state?: State;
}
export const ModalityProcessingConfiguration = S.suspend(() =>
  S.Struct({ state: S.optional(State) }),
).annotations({
  identifier: "ModalityProcessingConfiguration",
}) as any as S.Schema<ModalityProcessingConfiguration>;
export type SensitiveDataDetectionMode =
  | "DETECTION"
  | "DETECTION_AND_REDACTION";
export const SensitiveDataDetectionMode = S.Literal(
  "DETECTION",
  "DETECTION_AND_REDACTION",
);
export type SensitiveDataDetectionScopeType = "STANDARD" | "CUSTOM";
export const SensitiveDataDetectionScopeType = S.Literal("STANDARD", "CUSTOM");
export type SensitiveDataDetectionScope = SensitiveDataDetectionScopeType[];
export const SensitiveDataDetectionScope = S.Array(
  SensitiveDataDetectionScopeType,
);
export type PIIEntityType =
  | "ALL"
  | "ADDRESS"
  | "AGE"
  | "NAME"
  | "EMAIL"
  | "PHONE"
  | "USERNAME"
  | "PASSWORD"
  | "DRIVER_ID"
  | "LICENSE_PLATE"
  | "VEHICLE_IDENTIFICATION_NUMBER"
  | "CREDIT_DEBIT_CARD_CVV"
  | "CREDIT_DEBIT_CARD_EXPIRY"
  | "CREDIT_DEBIT_CARD_NUMBER"
  | "PIN"
  | "INTERNATIONAL_BANK_ACCOUNT_NUMBER"
  | "SWIFT_CODE"
  | "IP_ADDRESS"
  | "MAC_ADDRESS"
  | "URL"
  | "AWS_ACCESS_KEY"
  | "AWS_SECRET_KEY"
  | "US_BANK_ACCOUNT_NUMBER"
  | "US_BANK_ROUTING_NUMBER"
  | "US_INDIVIDUAL_TAX_IDENTIFICATION_NUMBER"
  | "US_PASSPORT_NUMBER"
  | "US_SOCIAL_SECURITY_NUMBER"
  | "CA_HEALTH_NUMBER"
  | "CA_SOCIAL_INSURANCE_NUMBER"
  | "UK_NATIONAL_HEALTH_SERVICE_NUMBER"
  | "UK_NATIONAL_INSURANCE_NUMBER"
  | "UK_UNIQUE_TAXPAYER_REFERENCE_NUMBER";
export const PIIEntityType = S.Literal(
  "ALL",
  "ADDRESS",
  "AGE",
  "NAME",
  "EMAIL",
  "PHONE",
  "USERNAME",
  "PASSWORD",
  "DRIVER_ID",
  "LICENSE_PLATE",
  "VEHICLE_IDENTIFICATION_NUMBER",
  "CREDIT_DEBIT_CARD_CVV",
  "CREDIT_DEBIT_CARD_EXPIRY",
  "CREDIT_DEBIT_CARD_NUMBER",
  "PIN",
  "INTERNATIONAL_BANK_ACCOUNT_NUMBER",
  "SWIFT_CODE",
  "IP_ADDRESS",
  "MAC_ADDRESS",
  "URL",
  "AWS_ACCESS_KEY",
  "AWS_SECRET_KEY",
  "US_BANK_ACCOUNT_NUMBER",
  "US_BANK_ROUTING_NUMBER",
  "US_INDIVIDUAL_TAX_IDENTIFICATION_NUMBER",
  "US_PASSPORT_NUMBER",
  "US_SOCIAL_SECURITY_NUMBER",
  "CA_HEALTH_NUMBER",
  "CA_SOCIAL_INSURANCE_NUMBER",
  "UK_NATIONAL_HEALTH_SERVICE_NUMBER",
  "UK_NATIONAL_INSURANCE_NUMBER",
  "UK_UNIQUE_TAXPAYER_REFERENCE_NUMBER",
);
export type PIIEntityTypes = PIIEntityType[];
export const PIIEntityTypes = S.Array(PIIEntityType);
export type PIIRedactionMaskMode = "PII" | "ENTITY_TYPE";
export const PIIRedactionMaskMode = S.Literal("PII", "ENTITY_TYPE");
export interface PIIEntitiesConfiguration {
  piiEntityTypes?: PIIEntityType[];
  redactionMaskMode?: PIIRedactionMaskMode;
}
export const PIIEntitiesConfiguration = S.suspend(() =>
  S.Struct({
    piiEntityTypes: S.optional(PIIEntityTypes),
    redactionMaskMode: S.optional(PIIRedactionMaskMode),
  }),
).annotations({
  identifier: "PIIEntitiesConfiguration",
}) as any as S.Schema<PIIEntitiesConfiguration>;
export interface SensitiveDataConfiguration {
  detectionMode: SensitiveDataDetectionMode;
  detectionScope?: SensitiveDataDetectionScopeType[];
  piiEntitiesConfiguration?: PIIEntitiesConfiguration;
}
export const SensitiveDataConfiguration = S.suspend(() =>
  S.Struct({
    detectionMode: SensitiveDataDetectionMode,
    detectionScope: S.optional(SensitiveDataDetectionScope),
    piiEntitiesConfiguration: S.optional(PIIEntitiesConfiguration),
  }),
).annotations({
  identifier: "SensitiveDataConfiguration",
}) as any as S.Schema<SensitiveDataConfiguration>;
export interface DocumentOverrideConfiguration {
  splitter?: SplitterConfiguration;
  modalityProcessing?: ModalityProcessingConfiguration;
  sensitiveDataConfiguration?: SensitiveDataConfiguration;
}
export const DocumentOverrideConfiguration = S.suspend(() =>
  S.Struct({
    splitter: S.optional(SplitterConfiguration),
    modalityProcessing: S.optional(ModalityProcessingConfiguration),
    sensitiveDataConfiguration: S.optional(SensitiveDataConfiguration),
  }),
).annotations({
  identifier: "DocumentOverrideConfiguration",
}) as any as S.Schema<DocumentOverrideConfiguration>;
export interface ImageOverrideConfiguration {
  modalityProcessing?: ModalityProcessingConfiguration;
  sensitiveDataConfiguration?: SensitiveDataConfiguration;
}
export const ImageOverrideConfiguration = S.suspend(() =>
  S.Struct({
    modalityProcessing: S.optional(ModalityProcessingConfiguration),
    sensitiveDataConfiguration: S.optional(SensitiveDataConfiguration),
  }),
).annotations({
  identifier: "ImageOverrideConfiguration",
}) as any as S.Schema<ImageOverrideConfiguration>;
export interface VideoOverrideConfiguration {
  modalityProcessing?: ModalityProcessingConfiguration;
  sensitiveDataConfiguration?: SensitiveDataConfiguration;
}
export const VideoOverrideConfiguration = S.suspend(() =>
  S.Struct({
    modalityProcessing: S.optional(ModalityProcessingConfiguration),
    sensitiveDataConfiguration: S.optional(SensitiveDataConfiguration),
  }),
).annotations({
  identifier: "VideoOverrideConfiguration",
}) as any as S.Schema<VideoOverrideConfiguration>;
export type Language =
  | "EN"
  | "DE"
  | "ES"
  | "FR"
  | "IT"
  | "PT"
  | "JA"
  | "KO"
  | "CN"
  | "TW"
  | "HK";
export const Language = S.Literal(
  "EN",
  "DE",
  "ES",
  "FR",
  "IT",
  "PT",
  "JA",
  "KO",
  "CN",
  "TW",
  "HK",
);
export type AudioInputLanguages = Language[];
export const AudioInputLanguages = S.Array(Language);
export type AudioGenerativeOutputLanguage = "DEFAULT" | "EN";
export const AudioGenerativeOutputLanguage = S.Literal("DEFAULT", "EN");
export interface AudioLanguageConfiguration {
  inputLanguages?: Language[];
  generativeOutputLanguage?: AudioGenerativeOutputLanguage;
  identifyMultipleLanguages?: boolean;
}
export const AudioLanguageConfiguration = S.suspend(() =>
  S.Struct({
    inputLanguages: S.optional(AudioInputLanguages),
    generativeOutputLanguage: S.optional(AudioGenerativeOutputLanguage),
    identifyMultipleLanguages: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AudioLanguageConfiguration",
}) as any as S.Schema<AudioLanguageConfiguration>;
export interface AudioOverrideConfiguration {
  modalityProcessing?: ModalityProcessingConfiguration;
  languageConfiguration?: AudioLanguageConfiguration;
  sensitiveDataConfiguration?: SensitiveDataConfiguration;
}
export const AudioOverrideConfiguration = S.suspend(() =>
  S.Struct({
    modalityProcessing: S.optional(ModalityProcessingConfiguration),
    languageConfiguration: S.optional(AudioLanguageConfiguration),
    sensitiveDataConfiguration: S.optional(SensitiveDataConfiguration),
  }),
).annotations({
  identifier: "AudioOverrideConfiguration",
}) as any as S.Schema<AudioOverrideConfiguration>;
export type DesiredModality = "IMAGE" | "DOCUMENT" | "AUDIO" | "VIDEO";
export const DesiredModality = S.Literal("IMAGE", "DOCUMENT", "AUDIO", "VIDEO");
export interface ModalityRoutingConfiguration {
  jpeg?: DesiredModality;
  png?: DesiredModality;
  mp4?: DesiredModality;
  mov?: DesiredModality;
}
export const ModalityRoutingConfiguration = S.suspend(() =>
  S.Struct({
    jpeg: S.optional(DesiredModality),
    png: S.optional(DesiredModality),
    mp4: S.optional(DesiredModality),
    mov: S.optional(DesiredModality),
  }),
).annotations({
  identifier: "ModalityRoutingConfiguration",
}) as any as S.Schema<ModalityRoutingConfiguration>;
export interface OverrideConfiguration {
  document?: DocumentOverrideConfiguration;
  image?: ImageOverrideConfiguration;
  video?: VideoOverrideConfiguration;
  audio?: AudioOverrideConfiguration;
  modalityRouting?: ModalityRoutingConfiguration;
}
export const OverrideConfiguration = S.suspend(() =>
  S.Struct({
    document: S.optional(DocumentOverrideConfiguration),
    image: S.optional(ImageOverrideConfiguration),
    video: S.optional(VideoOverrideConfiguration),
    audio: S.optional(AudioOverrideConfiguration),
    modalityRouting: S.optional(ModalityRoutingConfiguration),
  }),
).annotations({
  identifier: "OverrideConfiguration",
}) as any as S.Schema<OverrideConfiguration>;
export interface UpdateDataAutomationProjectRequest {
  projectArn: string;
  projectStage?: DataAutomationProjectStage;
  projectDescription?: string | redacted.Redacted<string>;
  standardOutputConfiguration: StandardOutputConfiguration;
  customOutputConfiguration?: CustomOutputConfiguration;
  overrideConfiguration?: OverrideConfiguration;
  encryptionConfiguration?: EncryptionConfiguration;
}
export const UpdateDataAutomationProjectRequest = S.suspend(() =>
  S.Struct({
    projectArn: S.String.pipe(T.HttpLabel("projectArn")),
    projectStage: S.optional(DataAutomationProjectStage),
    projectDescription: S.optional(SensitiveString),
    standardOutputConfiguration: StandardOutputConfiguration,
    customOutputConfiguration: S.optional(CustomOutputConfiguration),
    overrideConfiguration: S.optional(OverrideConfiguration),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/data-automation-projects/{projectArn}/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDataAutomationProjectRequest",
}) as any as S.Schema<UpdateDataAutomationProjectRequest>;
export interface DeleteDataAutomationProjectRequest {
  projectArn: string;
}
export const DeleteDataAutomationProjectRequest = S.suspend(() =>
  S.Struct({ projectArn: S.String.pipe(T.HttpLabel("projectArn")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/data-automation-projects/{projectArn}/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDataAutomationProjectRequest",
}) as any as S.Schema<DeleteDataAutomationProjectRequest>;
export interface BlueprintOptimizationObject {
  blueprintArn: string;
  stage?: BlueprintStage;
}
export const BlueprintOptimizationObject = S.suspend(() =>
  S.Struct({ blueprintArn: S.String, stage: S.optional(BlueprintStage) }),
).annotations({
  identifier: "BlueprintOptimizationObject",
}) as any as S.Schema<BlueprintOptimizationObject>;
export interface S3Object {
  s3Uri: string;
  version?: string;
}
export const S3Object = S.suspend(() =>
  S.Struct({ s3Uri: S.String, version: S.optional(S.String) }),
).annotations({ identifier: "S3Object" }) as any as S.Schema<S3Object>;
export interface BlueprintOptimizationOutputConfiguration {
  s3Object: S3Object;
}
export const BlueprintOptimizationOutputConfiguration = S.suspend(() =>
  S.Struct({ s3Object: S3Object }),
).annotations({
  identifier: "BlueprintOptimizationOutputConfiguration",
}) as any as S.Schema<BlueprintOptimizationOutputConfiguration>;
export type BlueprintOptimizationJobStatus =
  | "Created"
  | "InProgress"
  | "Success"
  | "ServiceError"
  | "ClientError";
export const BlueprintOptimizationJobStatus = S.Literal(
  "Created",
  "InProgress",
  "Success",
  "ServiceError",
  "ClientError",
);
export interface DataAutomationProjectFilter {
  projectArn: string;
  projectStage?: DataAutomationProjectStage;
}
export const DataAutomationProjectFilter = S.suspend(() =>
  S.Struct({
    projectArn: S.String,
    projectStage: S.optional(DataAutomationProjectStage),
  }),
).annotations({
  identifier: "DataAutomationProjectFilter",
}) as any as S.Schema<DataAutomationProjectFilter>;
export type DataAutomationProjectStatus =
  | "COMPLETED"
  | "IN_PROGRESS"
  | "FAILED";
export const DataAutomationProjectStatus = S.Literal(
  "COMPLETED",
  "IN_PROGRESS",
  "FAILED",
);
export interface BlueprintFilter {
  blueprintArn: string;
  blueprintVersion?: string;
  blueprintStage?: BlueprintStage;
}
export const BlueprintFilter = S.suspend(() =>
  S.Struct({
    blueprintArn: S.String,
    blueprintVersion: S.optional(S.String),
    blueprintStage: S.optional(BlueprintStage),
  }),
).annotations({
  identifier: "BlueprintFilter",
}) as any as S.Schema<BlueprintFilter>;
export interface ListTagsForResourceResponse {
  tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  resourceARN: string;
  tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ resourceARN: S.String, tags: TagList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tagResource" }),
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
export interface GetBlueprintOptimizationStatusResponse {
  status?: BlueprintOptimizationJobStatus;
  errorType?: string;
  errorMessage?: string;
  outputConfiguration?: BlueprintOptimizationOutputConfiguration;
}
export const GetBlueprintOptimizationStatusResponse = S.suspend(() =>
  S.Struct({
    status: S.optional(BlueprintOptimizationJobStatus),
    errorType: S.optional(S.String),
    errorMessage: S.optional(S.String),
    outputConfiguration: S.optional(BlueprintOptimizationOutputConfiguration),
  }),
).annotations({
  identifier: "GetBlueprintOptimizationStatusResponse",
}) as any as S.Schema<GetBlueprintOptimizationStatusResponse>;
export interface BlueprintOptimizationSample {
  assetS3Object: S3Object;
  groundTruthS3Object: S3Object;
}
export const BlueprintOptimizationSample = S.suspend(() =>
  S.Struct({ assetS3Object: S3Object, groundTruthS3Object: S3Object }),
).annotations({
  identifier: "BlueprintOptimizationSample",
}) as any as S.Schema<BlueprintOptimizationSample>;
export type BlueprintOptimizationSamples = BlueprintOptimizationSample[];
export const BlueprintOptimizationSamples = S.Array(
  BlueprintOptimizationSample,
);
export interface Blueprint {
  blueprintArn: string;
  schema: string | redacted.Redacted<string>;
  type: Type;
  creationTime: Date;
  lastModifiedTime: Date;
  blueprintName: string | redacted.Redacted<string>;
  blueprintVersion?: string;
  blueprintStage?: BlueprintStage;
  kmsKeyId?: string;
  kmsEncryptionContext?: { [key: string]: string };
  optimizationSamples?: BlueprintOptimizationSample[];
  optimizationTime?: Date;
}
export const Blueprint = S.suspend(() =>
  S.Struct({
    blueprintArn: S.String,
    schema: SensitiveString,
    type: Type,
    creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModifiedTime: S.Date.pipe(T.TimestampFormat("date-time")),
    blueprintName: SensitiveString,
    blueprintVersion: S.optional(S.String),
    blueprintStage: S.optional(BlueprintStage),
    kmsKeyId: S.optional(S.String),
    kmsEncryptionContext: S.optional(KmsEncryptionContext),
    optimizationSamples: S.optional(BlueprintOptimizationSamples),
    optimizationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({ identifier: "Blueprint" }) as any as S.Schema<Blueprint>;
export interface CreateBlueprintResponse {
  blueprint: Blueprint;
}
export const CreateBlueprintResponse = S.suspend(() =>
  S.Struct({ blueprint: Blueprint }),
).annotations({
  identifier: "CreateBlueprintResponse",
}) as any as S.Schema<CreateBlueprintResponse>;
export interface GetBlueprintResponse {
  blueprint: Blueprint;
}
export const GetBlueprintResponse = S.suspend(() =>
  S.Struct({ blueprint: Blueprint }),
).annotations({
  identifier: "GetBlueprintResponse",
}) as any as S.Schema<GetBlueprintResponse>;
export interface UpdateBlueprintResponse {
  blueprint: Blueprint;
}
export const UpdateBlueprintResponse = S.suspend(() =>
  S.Struct({ blueprint: Blueprint }),
).annotations({
  identifier: "UpdateBlueprintResponse",
}) as any as S.Schema<UpdateBlueprintResponse>;
export interface ListBlueprintsRequest {
  blueprintArn?: string;
  resourceOwner?: ResourceOwner;
  blueprintStageFilter?: BlueprintStageFilter;
  maxResults?: number;
  nextToken?: string;
  projectFilter?: DataAutomationProjectFilter;
}
export const ListBlueprintsRequest = S.suspend(() =>
  S.Struct({
    blueprintArn: S.optional(S.String),
    resourceOwner: S.optional(ResourceOwner),
    blueprintStageFilter: S.optional(BlueprintStageFilter),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    projectFilter: S.optional(DataAutomationProjectFilter),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/blueprints/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBlueprintsRequest",
}) as any as S.Schema<ListBlueprintsRequest>;
export interface UpdateDataAutomationProjectResponse {
  projectArn: string;
  projectStage?: DataAutomationProjectStage;
  status?: DataAutomationProjectStatus;
}
export const UpdateDataAutomationProjectResponse = S.suspend(() =>
  S.Struct({
    projectArn: S.String,
    projectStage: S.optional(DataAutomationProjectStage),
    status: S.optional(DataAutomationProjectStatus),
  }),
).annotations({
  identifier: "UpdateDataAutomationProjectResponse",
}) as any as S.Schema<UpdateDataAutomationProjectResponse>;
export interface DeleteDataAutomationProjectResponse {
  projectArn: string;
  status?: DataAutomationProjectStatus;
}
export const DeleteDataAutomationProjectResponse = S.suspend(() =>
  S.Struct({
    projectArn: S.String,
    status: S.optional(DataAutomationProjectStatus),
  }),
).annotations({
  identifier: "DeleteDataAutomationProjectResponse",
}) as any as S.Schema<DeleteDataAutomationProjectResponse>;
export interface ListDataAutomationProjectsRequest {
  maxResults?: number;
  nextToken?: string;
  projectStageFilter?: DataAutomationProjectStageFilter;
  blueprintFilter?: BlueprintFilter;
  resourceOwner?: ResourceOwner;
}
export const ListDataAutomationProjectsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    projectStageFilter: S.optional(DataAutomationProjectStageFilter),
    blueprintFilter: S.optional(BlueprintFilter),
    resourceOwner: S.optional(ResourceOwner),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/data-automation-projects/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDataAutomationProjectsRequest",
}) as any as S.Schema<ListDataAutomationProjectsRequest>;
export interface DataAutomationProject {
  projectArn: string;
  creationTime: Date;
  lastModifiedTime: Date;
  projectName: string | redacted.Redacted<string>;
  projectStage?: DataAutomationProjectStage;
  projectType?: DataAutomationProjectType;
  projectDescription?: string | redacted.Redacted<string>;
  standardOutputConfiguration?: StandardOutputConfiguration;
  customOutputConfiguration?: CustomOutputConfiguration;
  overrideConfiguration?: OverrideConfiguration;
  status: DataAutomationProjectStatus;
  kmsKeyId?: string;
  kmsEncryptionContext?: { [key: string]: string };
}
export const DataAutomationProject = S.suspend(() =>
  S.Struct({
    projectArn: S.String,
    creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModifiedTime: S.Date.pipe(T.TimestampFormat("date-time")),
    projectName: SensitiveString,
    projectStage: S.optional(DataAutomationProjectStage),
    projectType: S.optional(DataAutomationProjectType),
    projectDescription: S.optional(SensitiveString),
    standardOutputConfiguration: S.optional(StandardOutputConfiguration),
    customOutputConfiguration: S.optional(CustomOutputConfiguration),
    overrideConfiguration: S.optional(OverrideConfiguration),
    status: DataAutomationProjectStatus,
    kmsKeyId: S.optional(S.String),
    kmsEncryptionContext: S.optional(KmsEncryptionContext),
  }),
).annotations({
  identifier: "DataAutomationProject",
}) as any as S.Schema<DataAutomationProject>;
export interface CreateBlueprintVersionResponse {
  blueprint: Blueprint;
}
export const CreateBlueprintVersionResponse = S.suspend(() =>
  S.Struct({ blueprint: Blueprint }),
).annotations({
  identifier: "CreateBlueprintVersionResponse",
}) as any as S.Schema<CreateBlueprintVersionResponse>;
export interface InvokeBlueprintOptimizationAsyncRequest {
  blueprint: BlueprintOptimizationObject;
  samples: BlueprintOptimizationSample[];
  outputConfiguration: BlueprintOptimizationOutputConfiguration;
  dataAutomationProfileArn: string;
  encryptionConfiguration?: EncryptionConfiguration;
  tags?: Tag[];
}
export const InvokeBlueprintOptimizationAsyncRequest = S.suspend(() =>
  S.Struct({
    blueprint: BlueprintOptimizationObject,
    samples: BlueprintOptimizationSamples,
    outputConfiguration: BlueprintOptimizationOutputConfiguration,
    dataAutomationProfileArn: S.String,
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/invokeBlueprintOptimizationAsync" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "InvokeBlueprintOptimizationAsyncRequest",
}) as any as S.Schema<InvokeBlueprintOptimizationAsyncRequest>;
export interface GetDataAutomationProjectResponse {
  project: DataAutomationProject;
}
export const GetDataAutomationProjectResponse = S.suspend(() =>
  S.Struct({ project: DataAutomationProject }),
).annotations({
  identifier: "GetDataAutomationProjectResponse",
}) as any as S.Schema<GetDataAutomationProjectResponse>;
export interface BlueprintSummary {
  blueprintArn: string;
  blueprintVersion?: string;
  blueprintStage?: BlueprintStage;
  blueprintName?: string | redacted.Redacted<string>;
  creationTime: Date;
  lastModifiedTime?: Date;
}
export const BlueprintSummary = S.suspend(() =>
  S.Struct({
    blueprintArn: S.String,
    blueprintVersion: S.optional(S.String),
    blueprintStage: S.optional(BlueprintStage),
    blueprintName: S.optional(SensitiveString),
    creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "BlueprintSummary",
}) as any as S.Schema<BlueprintSummary>;
export type Blueprints = BlueprintSummary[];
export const Blueprints = S.Array(BlueprintSummary);
export interface DataAutomationProjectSummary {
  projectArn: string;
  projectStage?: DataAutomationProjectStage;
  projectType?: DataAutomationProjectType;
  projectName?: string | redacted.Redacted<string>;
  creationTime: Date;
}
export const DataAutomationProjectSummary = S.suspend(() =>
  S.Struct({
    projectArn: S.String,
    projectStage: S.optional(DataAutomationProjectStage),
    projectType: S.optional(DataAutomationProjectType),
    projectName: S.optional(SensitiveString),
    creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "DataAutomationProjectSummary",
}) as any as S.Schema<DataAutomationProjectSummary>;
export type DataAutomationProjectSummaries = DataAutomationProjectSummary[];
export const DataAutomationProjectSummaries = S.Array(
  DataAutomationProjectSummary,
);
export interface InvokeBlueprintOptimizationAsyncResponse {
  invocationArn: string;
}
export const InvokeBlueprintOptimizationAsyncResponse = S.suspend(() =>
  S.Struct({ invocationArn: S.String }),
).annotations({
  identifier: "InvokeBlueprintOptimizationAsyncResponse",
}) as any as S.Schema<InvokeBlueprintOptimizationAsyncResponse>;
export interface ListBlueprintsResponse {
  blueprints: BlueprintSummary[];
  nextToken?: string;
}
export const ListBlueprintsResponse = S.suspend(() =>
  S.Struct({ blueprints: Blueprints, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListBlueprintsResponse",
}) as any as S.Schema<ListBlueprintsResponse>;
export interface ListDataAutomationProjectsResponse {
  projects: DataAutomationProjectSummary[];
  nextToken?: string;
}
export const ListDataAutomationProjectsResponse = S.suspend(() =>
  S.Struct({
    projects: DataAutomationProjectSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataAutomationProjectsResponse",
}) as any as S.Schema<ListDataAutomationProjectsResponse>;
export interface ValidationExceptionField {
  name: string;
  message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export interface CreateDataAutomationProjectRequest {
  projectName: string | redacted.Redacted<string>;
  projectDescription?: string | redacted.Redacted<string>;
  projectStage?: DataAutomationProjectStage;
  projectType?: DataAutomationProjectType;
  standardOutputConfiguration: StandardOutputConfiguration;
  customOutputConfiguration?: CustomOutputConfiguration;
  overrideConfiguration?: OverrideConfiguration;
  clientToken?: string;
  encryptionConfiguration?: EncryptionConfiguration;
  tags?: Tag[];
}
export const CreateDataAutomationProjectRequest = S.suspend(() =>
  S.Struct({
    projectName: SensitiveString,
    projectDescription: S.optional(SensitiveString),
    projectStage: S.optional(DataAutomationProjectStage),
    projectType: S.optional(DataAutomationProjectType),
    standardOutputConfiguration: StandardOutputConfiguration,
    customOutputConfiguration: S.optional(CustomOutputConfiguration),
    overrideConfiguration: S.optional(OverrideConfiguration),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/data-automation-projects/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDataAutomationProjectRequest",
}) as any as S.Schema<CreateDataAutomationProjectRequest>;
export interface CreateDataAutomationProjectResponse {
  projectArn: string;
  projectStage?: DataAutomationProjectStage;
  status?: DataAutomationProjectStatus;
}
export const CreateDataAutomationProjectResponse = S.suspend(() =>
  S.Struct({
    projectArn: S.String,
    projectStage: S.optional(DataAutomationProjectStage),
    status: S.optional(DataAutomationProjectStatus),
  }),
).annotations({
  identifier: "CreateDataAutomationProjectResponse",
}) as any as S.Schema<CreateDataAutomationProjectResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.optional(S.String),
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Copies a Blueprint from one stage to another
 */
export const copyBlueprintStage: (
  input: CopyBlueprintStageRequest,
) => effect.Effect<
  CopyBlueprintStageResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopyBlueprintStageRequest,
  output: CopyBlueprintStageResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon Bedrock Data Automation Blueprint
 */
export const createBlueprint: (
  input: CreateBlueprintRequest,
) => effect.Effect<
  CreateBlueprintResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBlueprintRequest,
  output: CreateBlueprintResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all existing Amazon Bedrock Data Automation Blueprints
 */
export const listBlueprints: {
  (
    input: ListBlueprintsRequest,
  ): effect.Effect<
    ListBlueprintsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBlueprintsRequest,
  ) => stream.Stream<
    ListBlueprintsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBlueprintsRequest,
  ) => stream.Stream<
    BlueprintSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBlueprintsRequest,
  output: ListBlueprintsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "blueprints",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all existing Amazon Bedrock Data Automation Projects
 */
export const listDataAutomationProjects: {
  (
    input: ListDataAutomationProjectsRequest,
  ): effect.Effect<
    ListDataAutomationProjectsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataAutomationProjectsRequest,
  ) => stream.Stream<
    ListDataAutomationProjectsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataAutomationProjectsRequest,
  ) => stream.Stream<
    DataAutomationProjectSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDataAutomationProjectsRequest,
  output: ListDataAutomationProjectsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "projects",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a new version of an existing Amazon Bedrock Data Automation Blueprint
 */
export const createBlueprintVersion: (
  input: CreateBlueprintVersionRequest,
) => effect.Effect<
  CreateBlueprintVersionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBlueprintVersionRequest,
  output: CreateBlueprintVersionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets an existing Amazon Bedrock Data Automation Project
 */
export const getDataAutomationProject: (
  input: GetDataAutomationProjectRequest,
) => effect.Effect<
  GetDataAutomationProjectResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataAutomationProjectRequest,
  output: GetDataAutomationProjectResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List tags for an Amazon Bedrock Data Automation resource
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Tag an Amazon Bedrock Data Automation resource
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * API used to get blueprint optimization status.
 */
export const getBlueprintOptimizationStatus: (
  input: GetBlueprintOptimizationStatusRequest,
) => effect.Effect<
  GetBlueprintOptimizationStatusResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBlueprintOptimizationStatusRequest,
  output: GetBlueprintOptimizationStatusResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets an existing Amazon Bedrock Data Automation Blueprint
 */
export const getBlueprint: (
  input: GetBlueprintRequest,
) => effect.Effect<
  GetBlueprintResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBlueprintRequest,
  output: GetBlueprintResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an existing Amazon Bedrock Data Automation Project
 */
export const deleteDataAutomationProject: (
  input: DeleteDataAutomationProjectRequest,
) => effect.Effect<
  DeleteDataAutomationProjectResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataAutomationProjectRequest,
  output: DeleteDataAutomationProjectResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Untag an Amazon Bedrock Data Automation resource
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an existing Amazon Bedrock Data Automation Blueprint
 */
export const deleteBlueprint: (
  input: DeleteBlueprintRequest,
) => effect.Effect<
  DeleteBlueprintResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBlueprintRequest,
  output: DeleteBlueprintResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an existing Amazon Bedrock Data Automation Blueprint
 */
export const updateBlueprint: (
  input: UpdateBlueprintRequest,
) => effect.Effect<
  UpdateBlueprintResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBlueprintRequest,
  output: UpdateBlueprintResponse,
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
 * Updates an existing Amazon Bedrock Data Automation Project
 */
export const updateDataAutomationProject: (
  input: UpdateDataAutomationProjectRequest,
) => effect.Effect<
  UpdateDataAutomationProjectResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataAutomationProjectRequest,
  output: UpdateDataAutomationProjectResponse,
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
 * Invoke an async job to perform Blueprint Optimization
 */
export const invokeBlueprintOptimizationAsync: (
  input: InvokeBlueprintOptimizationAsyncRequest,
) => effect.Effect<
  InvokeBlueprintOptimizationAsyncResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InvokeBlueprintOptimizationAsyncRequest,
  output: InvokeBlueprintOptimizationAsyncResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon Bedrock Data Automation Project
 */
export const createDataAutomationProject: (
  input: CreateDataAutomationProjectRequest,
) => effect.Effect<
  CreateDataAutomationProjectResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataAutomationProjectRequest,
  output: CreateDataAutomationProjectResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
