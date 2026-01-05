import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Bedrock Data Automation",
  serviceShapeName: "AmazonBedrockKeystoneBuildTimeService",
});
const auth = T.AwsAuthSigv4({ name: "bedrock" });
const ver = T.ServiceVersion("2023-07-26");
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
                                url: "https://bedrock-data-automation-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://bedrock-data-automation-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://bedrock-data-automation.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://bedrock-data-automation.{Region}.{PartitionResult#dnsSuffix}",
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
export class CopyBlueprintStageRequest extends S.Class<CopyBlueprintStageRequest>(
  "CopyBlueprintStageRequest",
)(
  {
    blueprintArn: S.String.pipe(T.HttpLabel("blueprintArn")),
    sourceStage: S.String,
    targetStage: S.String,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/blueprints/{blueprintArn}/copy-stage" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CopyBlueprintStageResponse extends S.Class<CopyBlueprintStageResponse>(
  "CopyBlueprintStageResponse",
)({}) {}
export class CreateBlueprintVersionRequest extends S.Class<CreateBlueprintVersionRequest>(
  "CreateBlueprintVersionRequest",
)(
  {
    blueprintArn: S.String.pipe(T.HttpLabel("blueprintArn")),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/blueprints/{blueprintArn}/versions/" }),
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
  { resourceARN: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/listTagsForResource" }),
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
  { resourceARN: S.String, tagKeys: TagKeyList },
  T.all(
    T.Http({ method: "POST", uri: "/untagResource" }),
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
export class GetBlueprintOptimizationStatusRequest extends S.Class<GetBlueprintOptimizationStatusRequest>(
  "GetBlueprintOptimizationStatusRequest",
)(
  { invocationArn: S.String.pipe(T.HttpLabel("invocationArn")) },
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
) {}
export const KmsEncryptionContext = S.Record({
  key: S.String,
  value: S.String,
});
export class EncryptionConfiguration extends S.Class<EncryptionConfiguration>(
  "EncryptionConfiguration",
)({
  kmsKeyId: S.String,
  kmsEncryptionContext: S.optional(KmsEncryptionContext),
}) {}
export class Tag extends S.Class<Tag>("Tag")({
  key: S.String,
  value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateBlueprintRequest extends S.Class<CreateBlueprintRequest>(
  "CreateBlueprintRequest",
)(
  {
    blueprintName: S.String,
    type: S.String,
    blueprintStage: S.optional(S.String),
    schema: S.String,
    clientToken: S.optional(S.String),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/blueprints/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBlueprintRequest extends S.Class<GetBlueprintRequest>(
  "GetBlueprintRequest",
)(
  {
    blueprintArn: S.String.pipe(T.HttpLabel("blueprintArn")),
    blueprintVersion: S.optional(S.String),
    blueprintStage: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/blueprints/{blueprintArn}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateBlueprintRequest extends S.Class<UpdateBlueprintRequest>(
  "UpdateBlueprintRequest",
)(
  {
    blueprintArn: S.String.pipe(T.HttpLabel("blueprintArn")),
    schema: S.String,
    blueprintStage: S.optional(S.String),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/blueprints/{blueprintArn}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBlueprintRequest extends S.Class<DeleteBlueprintRequest>(
  "DeleteBlueprintRequest",
)(
  {
    blueprintArn: S.String.pipe(T.HttpLabel("blueprintArn")),
    blueprintVersion: S.optional(S.String).pipe(
      T.HttpQuery("blueprintVersion"),
    ),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/blueprints/{blueprintArn}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBlueprintResponse extends S.Class<DeleteBlueprintResponse>(
  "DeleteBlueprintResponse",
)({}) {}
export class GetDataAutomationProjectRequest extends S.Class<GetDataAutomationProjectRequest>(
  "GetDataAutomationProjectRequest",
)(
  {
    projectArn: S.String.pipe(T.HttpLabel("projectArn")),
    projectStage: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/data-automation-projects/{projectArn}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const DocumentExtractionGranularityTypes = S.Array(S.String);
export class DocumentExtractionGranularity extends S.Class<DocumentExtractionGranularity>(
  "DocumentExtractionGranularity",
)({ types: S.optional(DocumentExtractionGranularityTypes) }) {}
export class DocumentBoundingBox extends S.Class<DocumentBoundingBox>(
  "DocumentBoundingBox",
)({ state: S.String }) {}
export class DocumentStandardExtraction extends S.Class<DocumentStandardExtraction>(
  "DocumentStandardExtraction",
)({
  granularity: DocumentExtractionGranularity,
  boundingBox: DocumentBoundingBox,
}) {}
export class DocumentStandardGenerativeField extends S.Class<DocumentStandardGenerativeField>(
  "DocumentStandardGenerativeField",
)({ state: S.String }) {}
export const DocumentOutputTextFormatTypes = S.Array(S.String);
export class DocumentOutputTextFormat extends S.Class<DocumentOutputTextFormat>(
  "DocumentOutputTextFormat",
)({ types: S.optional(DocumentOutputTextFormatTypes) }) {}
export class DocumentOutputAdditionalFileFormat extends S.Class<DocumentOutputAdditionalFileFormat>(
  "DocumentOutputAdditionalFileFormat",
)({ state: S.String }) {}
export class DocumentOutputFormat extends S.Class<DocumentOutputFormat>(
  "DocumentOutputFormat",
)({
  textFormat: DocumentOutputTextFormat,
  additionalFileFormat: DocumentOutputAdditionalFileFormat,
}) {}
export class DocumentStandardOutputConfiguration extends S.Class<DocumentStandardOutputConfiguration>(
  "DocumentStandardOutputConfiguration",
)({
  extraction: S.optional(DocumentStandardExtraction),
  generativeField: S.optional(DocumentStandardGenerativeField),
  outputFormat: S.optional(DocumentOutputFormat),
}) {}
export const ImageExtractionCategoryTypes = S.Array(S.String);
export class ImageExtractionCategory extends S.Class<ImageExtractionCategory>(
  "ImageExtractionCategory",
)({ state: S.String, types: S.optional(ImageExtractionCategoryTypes) }) {}
export class ImageBoundingBox extends S.Class<ImageBoundingBox>(
  "ImageBoundingBox",
)({ state: S.String }) {}
export class ImageStandardExtraction extends S.Class<ImageStandardExtraction>(
  "ImageStandardExtraction",
)({ category: ImageExtractionCategory, boundingBox: ImageBoundingBox }) {}
export const ImageStandardGenerativeFieldTypes = S.Array(S.String);
export class ImageStandardGenerativeField extends S.Class<ImageStandardGenerativeField>(
  "ImageStandardGenerativeField",
)({ state: S.String, types: S.optional(ImageStandardGenerativeFieldTypes) }) {}
export class ImageStandardOutputConfiguration extends S.Class<ImageStandardOutputConfiguration>(
  "ImageStandardOutputConfiguration",
)({
  extraction: S.optional(ImageStandardExtraction),
  generativeField: S.optional(ImageStandardGenerativeField),
}) {}
export const VideoExtractionCategoryTypes = S.Array(S.String);
export class VideoExtractionCategory extends S.Class<VideoExtractionCategory>(
  "VideoExtractionCategory",
)({ state: S.String, types: S.optional(VideoExtractionCategoryTypes) }) {}
export class VideoBoundingBox extends S.Class<VideoBoundingBox>(
  "VideoBoundingBox",
)({ state: S.String }) {}
export class VideoStandardExtraction extends S.Class<VideoStandardExtraction>(
  "VideoStandardExtraction",
)({ category: VideoExtractionCategory, boundingBox: VideoBoundingBox }) {}
export const VideoStandardGenerativeFieldTypes = S.Array(S.String);
export class VideoStandardGenerativeField extends S.Class<VideoStandardGenerativeField>(
  "VideoStandardGenerativeField",
)({ state: S.String, types: S.optional(VideoStandardGenerativeFieldTypes) }) {}
export class VideoStandardOutputConfiguration extends S.Class<VideoStandardOutputConfiguration>(
  "VideoStandardOutputConfiguration",
)({
  extraction: S.optional(VideoStandardExtraction),
  generativeField: S.optional(VideoStandardGenerativeField),
}) {}
export const AudioExtractionCategoryTypes = S.Array(S.String);
export class SpeakerLabelingConfiguration extends S.Class<SpeakerLabelingConfiguration>(
  "SpeakerLabelingConfiguration",
)({ state: S.String }) {}
export class ChannelLabelingConfiguration extends S.Class<ChannelLabelingConfiguration>(
  "ChannelLabelingConfiguration",
)({ state: S.String }) {}
export class TranscriptConfiguration extends S.Class<TranscriptConfiguration>(
  "TranscriptConfiguration",
)({
  speakerLabeling: S.optional(SpeakerLabelingConfiguration),
  channelLabeling: S.optional(ChannelLabelingConfiguration),
}) {}
export class AudioExtractionCategoryTypeConfiguration extends S.Class<AudioExtractionCategoryTypeConfiguration>(
  "AudioExtractionCategoryTypeConfiguration",
)({ transcript: S.optional(TranscriptConfiguration) }) {}
export class AudioExtractionCategory extends S.Class<AudioExtractionCategory>(
  "AudioExtractionCategory",
)({
  state: S.String,
  types: S.optional(AudioExtractionCategoryTypes),
  typeConfiguration: S.optional(AudioExtractionCategoryTypeConfiguration),
}) {}
export class AudioStandardExtraction extends S.Class<AudioStandardExtraction>(
  "AudioStandardExtraction",
)({ category: AudioExtractionCategory }) {}
export const AudioStandardGenerativeFieldTypes = S.Array(S.String);
export class AudioStandardGenerativeField extends S.Class<AudioStandardGenerativeField>(
  "AudioStandardGenerativeField",
)({ state: S.String, types: S.optional(AudioStandardGenerativeFieldTypes) }) {}
export class AudioStandardOutputConfiguration extends S.Class<AudioStandardOutputConfiguration>(
  "AudioStandardOutputConfiguration",
)({
  extraction: S.optional(AudioStandardExtraction),
  generativeField: S.optional(AudioStandardGenerativeField),
}) {}
export class StandardOutputConfiguration extends S.Class<StandardOutputConfiguration>(
  "StandardOutputConfiguration",
)({
  document: S.optional(DocumentStandardOutputConfiguration),
  image: S.optional(ImageStandardOutputConfiguration),
  video: S.optional(VideoStandardOutputConfiguration),
  audio: S.optional(AudioStandardOutputConfiguration),
}) {}
export class BlueprintItem extends S.Class<BlueprintItem>("BlueprintItem")({
  blueprintArn: S.String,
  blueprintVersion: S.optional(S.String),
  blueprintStage: S.optional(S.String),
}) {}
export const BlueprintItems = S.Array(BlueprintItem);
export class CustomOutputConfiguration extends S.Class<CustomOutputConfiguration>(
  "CustomOutputConfiguration",
)({ blueprints: S.optional(BlueprintItems) }) {}
export class SplitterConfiguration extends S.Class<SplitterConfiguration>(
  "SplitterConfiguration",
)({ state: S.optional(S.String) }) {}
export class ModalityProcessingConfiguration extends S.Class<ModalityProcessingConfiguration>(
  "ModalityProcessingConfiguration",
)({ state: S.optional(S.String) }) {}
export const SensitiveDataDetectionScope = S.Array(S.String);
export const PIIEntityTypes = S.Array(S.String);
export class PIIEntitiesConfiguration extends S.Class<PIIEntitiesConfiguration>(
  "PIIEntitiesConfiguration",
)({
  piiEntityTypes: S.optional(PIIEntityTypes),
  redactionMaskMode: S.optional(S.String),
}) {}
export class SensitiveDataConfiguration extends S.Class<SensitiveDataConfiguration>(
  "SensitiveDataConfiguration",
)({
  detectionMode: S.String,
  detectionScope: S.optional(SensitiveDataDetectionScope),
  piiEntitiesConfiguration: S.optional(PIIEntitiesConfiguration),
}) {}
export class DocumentOverrideConfiguration extends S.Class<DocumentOverrideConfiguration>(
  "DocumentOverrideConfiguration",
)({
  splitter: S.optional(SplitterConfiguration),
  modalityProcessing: S.optional(ModalityProcessingConfiguration),
  sensitiveDataConfiguration: S.optional(SensitiveDataConfiguration),
}) {}
export class ImageOverrideConfiguration extends S.Class<ImageOverrideConfiguration>(
  "ImageOverrideConfiguration",
)({
  modalityProcessing: S.optional(ModalityProcessingConfiguration),
  sensitiveDataConfiguration: S.optional(SensitiveDataConfiguration),
}) {}
export class VideoOverrideConfiguration extends S.Class<VideoOverrideConfiguration>(
  "VideoOverrideConfiguration",
)({
  modalityProcessing: S.optional(ModalityProcessingConfiguration),
  sensitiveDataConfiguration: S.optional(SensitiveDataConfiguration),
}) {}
export const AudioInputLanguages = S.Array(S.String);
export class AudioLanguageConfiguration extends S.Class<AudioLanguageConfiguration>(
  "AudioLanguageConfiguration",
)({
  inputLanguages: S.optional(AudioInputLanguages),
  generativeOutputLanguage: S.optional(S.String),
  identifyMultipleLanguages: S.optional(S.Boolean),
}) {}
export class AudioOverrideConfiguration extends S.Class<AudioOverrideConfiguration>(
  "AudioOverrideConfiguration",
)({
  modalityProcessing: S.optional(ModalityProcessingConfiguration),
  languageConfiguration: S.optional(AudioLanguageConfiguration),
  sensitiveDataConfiguration: S.optional(SensitiveDataConfiguration),
}) {}
export class ModalityRoutingConfiguration extends S.Class<ModalityRoutingConfiguration>(
  "ModalityRoutingConfiguration",
)({
  jpeg: S.optional(S.String),
  png: S.optional(S.String),
  mp4: S.optional(S.String),
  mov: S.optional(S.String),
}) {}
export class OverrideConfiguration extends S.Class<OverrideConfiguration>(
  "OverrideConfiguration",
)({
  document: S.optional(DocumentOverrideConfiguration),
  image: S.optional(ImageOverrideConfiguration),
  video: S.optional(VideoOverrideConfiguration),
  audio: S.optional(AudioOverrideConfiguration),
  modalityRouting: S.optional(ModalityRoutingConfiguration),
}) {}
export class UpdateDataAutomationProjectRequest extends S.Class<UpdateDataAutomationProjectRequest>(
  "UpdateDataAutomationProjectRequest",
)(
  {
    projectArn: S.String.pipe(T.HttpLabel("projectArn")),
    projectStage: S.optional(S.String),
    projectDescription: S.optional(S.String),
    standardOutputConfiguration: StandardOutputConfiguration,
    customOutputConfiguration: S.optional(CustomOutputConfiguration),
    overrideConfiguration: S.optional(OverrideConfiguration),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/data-automation-projects/{projectArn}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDataAutomationProjectRequest extends S.Class<DeleteDataAutomationProjectRequest>(
  "DeleteDataAutomationProjectRequest",
)(
  { projectArn: S.String.pipe(T.HttpLabel("projectArn")) },
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
) {}
export class BlueprintOptimizationObject extends S.Class<BlueprintOptimizationObject>(
  "BlueprintOptimizationObject",
)({ blueprintArn: S.String, stage: S.optional(S.String) }) {}
export class S3Object extends S.Class<S3Object>("S3Object")({
  s3Uri: S.String,
  version: S.optional(S.String),
}) {}
export class BlueprintOptimizationOutputConfiguration extends S.Class<BlueprintOptimizationOutputConfiguration>(
  "BlueprintOptimizationOutputConfiguration",
)({ s3Object: S3Object }) {}
export class DataAutomationProjectFilter extends S.Class<DataAutomationProjectFilter>(
  "DataAutomationProjectFilter",
)({ projectArn: S.String, projectStage: S.optional(S.String) }) {}
export class BlueprintFilter extends S.Class<BlueprintFilter>(
  "BlueprintFilter",
)({
  blueprintArn: S.String,
  blueprintVersion: S.optional(S.String),
  blueprintStage: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagList) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceARN: S.String, tags: TagList },
  T.all(
    T.Http({ method: "POST", uri: "/tagResource" }),
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
export class GetBlueprintOptimizationStatusResponse extends S.Class<GetBlueprintOptimizationStatusResponse>(
  "GetBlueprintOptimizationStatusResponse",
)({
  status: S.optional(S.String),
  errorType: S.optional(S.String),
  errorMessage: S.optional(S.String),
  outputConfiguration: S.optional(BlueprintOptimizationOutputConfiguration),
}) {}
export class BlueprintOptimizationSample extends S.Class<BlueprintOptimizationSample>(
  "BlueprintOptimizationSample",
)({ assetS3Object: S3Object, groundTruthS3Object: S3Object }) {}
export const BlueprintOptimizationSamples = S.Array(
  BlueprintOptimizationSample,
);
export class Blueprint extends S.Class<Blueprint>("Blueprint")({
  blueprintArn: S.String,
  schema: S.String,
  type: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  lastModifiedTime: S.Date.pipe(T.TimestampFormat("date-time")),
  blueprintName: S.String,
  blueprintVersion: S.optional(S.String),
  blueprintStage: S.optional(S.String),
  kmsKeyId: S.optional(S.String),
  kmsEncryptionContext: S.optional(KmsEncryptionContext),
  optimizationSamples: S.optional(BlueprintOptimizationSamples),
  optimizationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class CreateBlueprintResponse extends S.Class<CreateBlueprintResponse>(
  "CreateBlueprintResponse",
)({ blueprint: Blueprint }) {}
export class GetBlueprintResponse extends S.Class<GetBlueprintResponse>(
  "GetBlueprintResponse",
)({ blueprint: Blueprint }) {}
export class UpdateBlueprintResponse extends S.Class<UpdateBlueprintResponse>(
  "UpdateBlueprintResponse",
)({ blueprint: Blueprint }) {}
export class ListBlueprintsRequest extends S.Class<ListBlueprintsRequest>(
  "ListBlueprintsRequest",
)(
  {
    blueprintArn: S.optional(S.String),
    resourceOwner: S.optional(S.String),
    blueprintStageFilter: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    projectFilter: S.optional(DataAutomationProjectFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/blueprints/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDataAutomationProjectResponse extends S.Class<UpdateDataAutomationProjectResponse>(
  "UpdateDataAutomationProjectResponse",
)({
  projectArn: S.String,
  projectStage: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export class DeleteDataAutomationProjectResponse extends S.Class<DeleteDataAutomationProjectResponse>(
  "DeleteDataAutomationProjectResponse",
)({ projectArn: S.String, status: S.optional(S.String) }) {}
export class ListDataAutomationProjectsRequest extends S.Class<ListDataAutomationProjectsRequest>(
  "ListDataAutomationProjectsRequest",
)(
  {
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    projectStageFilter: S.optional(S.String),
    blueprintFilter: S.optional(BlueprintFilter),
    resourceOwner: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/data-automation-projects/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DataAutomationProject extends S.Class<DataAutomationProject>(
  "DataAutomationProject",
)({
  projectArn: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  lastModifiedTime: S.Date.pipe(T.TimestampFormat("date-time")),
  projectName: S.String,
  projectStage: S.optional(S.String),
  projectType: S.optional(S.String),
  projectDescription: S.optional(S.String),
  standardOutputConfiguration: S.optional(StandardOutputConfiguration),
  customOutputConfiguration: S.optional(CustomOutputConfiguration),
  overrideConfiguration: S.optional(OverrideConfiguration),
  status: S.String,
  kmsKeyId: S.optional(S.String),
  kmsEncryptionContext: S.optional(KmsEncryptionContext),
}) {}
export class CreateBlueprintVersionResponse extends S.Class<CreateBlueprintVersionResponse>(
  "CreateBlueprintVersionResponse",
)({ blueprint: Blueprint }) {}
export class InvokeBlueprintOptimizationAsyncRequest extends S.Class<InvokeBlueprintOptimizationAsyncRequest>(
  "InvokeBlueprintOptimizationAsyncRequest",
)(
  {
    blueprint: BlueprintOptimizationObject,
    samples: BlueprintOptimizationSamples,
    outputConfiguration: BlueprintOptimizationOutputConfiguration,
    dataAutomationProfileArn: S.String,
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/invokeBlueprintOptimizationAsync" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataAutomationProjectResponse extends S.Class<GetDataAutomationProjectResponse>(
  "GetDataAutomationProjectResponse",
)({ project: DataAutomationProject }) {}
export class BlueprintSummary extends S.Class<BlueprintSummary>(
  "BlueprintSummary",
)({
  blueprintArn: S.String,
  blueprintVersion: S.optional(S.String),
  blueprintStage: S.optional(S.String),
  blueprintName: S.optional(S.String),
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const Blueprints = S.Array(BlueprintSummary);
export class DataAutomationProjectSummary extends S.Class<DataAutomationProjectSummary>(
  "DataAutomationProjectSummary",
)({
  projectArn: S.String,
  projectStage: S.optional(S.String),
  projectType: S.optional(S.String),
  projectName: S.optional(S.String),
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const DataAutomationProjectSummaries = S.Array(
  DataAutomationProjectSummary,
);
export class InvokeBlueprintOptimizationAsyncResponse extends S.Class<InvokeBlueprintOptimizationAsyncResponse>(
  "InvokeBlueprintOptimizationAsyncResponse",
)({ invocationArn: S.String }) {}
export class ListBlueprintsResponse extends S.Class<ListBlueprintsResponse>(
  "ListBlueprintsResponse",
)({ blueprints: Blueprints, nextToken: S.optional(S.String) }) {}
export class ListDataAutomationProjectsResponse extends S.Class<ListDataAutomationProjectsResponse>(
  "ListDataAutomationProjectsResponse",
)({
  projects: DataAutomationProjectSummaries,
  nextToken: S.optional(S.String),
}) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class CreateDataAutomationProjectRequest extends S.Class<CreateDataAutomationProjectRequest>(
  "CreateDataAutomationProjectRequest",
)(
  {
    projectName: S.String,
    projectDescription: S.optional(S.String),
    projectStage: S.optional(S.String),
    projectType: S.optional(S.String),
    standardOutputConfiguration: StandardOutputConfiguration,
    customOutputConfiguration: S.optional(CustomOutputConfiguration),
    overrideConfiguration: S.optional(OverrideConfiguration),
    clientToken: S.optional(S.String),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/data-automation-projects/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDataAutomationProjectResponse extends S.Class<CreateDataAutomationProjectResponse>(
  "CreateDataAutomationProjectResponse",
)({
  projectArn: S.String,
  projectStage: S.optional(S.String),
  status: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.optional(S.String),
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * Copies a Blueprint from one stage to another
 */
export const copyBlueprintStage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createBlueprint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listBlueprints = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Lists all existing Amazon Bedrock Data Automation Projects
 */
export const listDataAutomationProjects =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createBlueprintVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Gets an existing Amazon Bedrock Data Automation Project
 */
export const getDataAutomationProject = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDataAutomationProjectRequest,
    output: GetDataAutomationProjectResponse,
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
 * List tags for an Amazon Bedrock Data Automation resource
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getBlueprintOptimizationStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getBlueprint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteDataAutomationProject = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDataAutomationProjectRequest,
    output: DeleteDataAutomationProjectResponse,
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
 * Untag an Amazon Bedrock Data Automation resource
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteBlueprint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateBlueprint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateDataAutomationProject = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Invoke an async job to perform Blueprint Optimization
 */
export const invokeBlueprintOptimizationAsync =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDataAutomationProject = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
