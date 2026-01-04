import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Translate",
  serviceShapeName: "AWSShineFrontendService_20170701",
});
const auth = T.AwsAuthSigv4({ name: "translate" });
const ver = T.ServiceVersion("2017-07-01");
const proto = T.AwsProtocolsAwsJson1_1();
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
                        url: "https://translate-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://translate-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://translate.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://translate.{Region}.{PartitionResult#dnsSuffix}",
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
export const TargetLanguageCodeStringList = S.Array(S.String);
export const ResourceNameList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class DeleteParallelDataRequest extends S.Class<DeleteParallelDataRequest>(
  "DeleteParallelDataRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTerminologyRequest extends S.Class<DeleteTerminologyRequest>(
  "DeleteTerminologyRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTerminologyResponse extends S.Class<DeleteTerminologyResponse>(
  "DeleteTerminologyResponse",
)({}) {}
export class DescribeTextTranslationJobRequest extends S.Class<DescribeTextTranslationJobRequest>(
  "DescribeTextTranslationJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetParallelDataRequest extends S.Class<GetParallelDataRequest>(
  "GetParallelDataRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTerminologyRequest extends S.Class<GetTerminologyRequest>(
  "GetTerminologyRequest",
)(
  { Name: S.String, TerminologyDataFormat: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLanguagesRequest extends S.Class<ListLanguagesRequest>(
  "ListLanguagesRequest",
)(
  {
    DisplayLanguageCode: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListParallelDataRequest extends S.Class<ListParallelDataRequest>(
  "ListParallelDataRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTerminologiesRequest extends S.Class<ListTerminologiesRequest>(
  "ListTerminologiesRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopTextTranslationJobRequest extends S.Class<StopTextTranslationJobRequest>(
  "StopTextTranslationJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String, Tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class TranslationSettings extends S.Class<TranslationSettings>(
  "TranslationSettings",
)({
  Formality: S.optional(S.String),
  Profanity: S.optional(S.String),
  Brevity: S.optional(S.String),
}) {}
export class TranslateTextRequest extends S.Class<TranslateTextRequest>(
  "TranslateTextRequest",
)(
  {
    Text: S.String,
    TerminologyNames: S.optional(ResourceNameList),
    SourceLanguageCode: S.String,
    TargetLanguageCode: S.String,
    Settings: S.optional(TranslationSettings),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceArn: S.String, TagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class ParallelDataConfig extends S.Class<ParallelDataConfig>(
  "ParallelDataConfig",
)({ S3Uri: S.optional(S.String), Format: S.optional(S.String) }) {}
export class UpdateParallelDataRequest extends S.Class<UpdateParallelDataRequest>(
  "UpdateParallelDataRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    ParallelDataConfig: ParallelDataConfig,
    ClientToken: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EncryptionKey extends S.Class<EncryptionKey>("EncryptionKey")({
  Type: S.String,
  Id: S.String,
}) {}
export class TerminologyData extends S.Class<TerminologyData>(
  "TerminologyData",
)({ File: T.Blob, Format: S.String, Directionality: S.optional(S.String) }) {}
export const LanguageCodeStringList = S.Array(S.String);
export class ParallelDataProperties extends S.Class<ParallelDataProperties>(
  "ParallelDataProperties",
)({
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
  Description: S.optional(S.String),
  Status: S.optional(S.String),
  SourceLanguageCode: S.optional(S.String),
  TargetLanguageCodes: S.optional(LanguageCodeStringList),
  ParallelDataConfig: S.optional(ParallelDataConfig),
  Message: S.optional(S.String),
  ImportedDataSize: S.optional(S.Number),
  ImportedRecordCount: S.optional(S.Number),
  FailedRecordCount: S.optional(S.Number),
  SkippedRecordCount: S.optional(S.Number),
  EncryptionKey: S.optional(EncryptionKey),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LatestUpdateAttemptStatus: S.optional(S.String),
  LatestUpdateAttemptAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const ParallelDataPropertiesList = S.Array(ParallelDataProperties);
export class TerminologyProperties extends S.Class<TerminologyProperties>(
  "TerminologyProperties",
)({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Arn: S.optional(S.String),
  SourceLanguageCode: S.optional(S.String),
  TargetLanguageCodes: S.optional(LanguageCodeStringList),
  EncryptionKey: S.optional(EncryptionKey),
  SizeBytes: S.optional(S.Number),
  TermCount: S.optional(S.Number),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Directionality: S.optional(S.String),
  Message: S.optional(S.String),
  SkippedTermCount: S.optional(S.Number),
  Format: S.optional(S.String),
}) {}
export const TerminologyPropertiesList = S.Array(TerminologyProperties);
export class TextTranslationJobFilter extends S.Class<TextTranslationJobFilter>(
  "TextTranslationJobFilter",
)({
  JobName: S.optional(S.String),
  JobStatus: S.optional(S.String),
  SubmittedBeforeTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  SubmittedAfterTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class InputDataConfig extends S.Class<InputDataConfig>(
  "InputDataConfig",
)({ S3Uri: S.String, ContentType: S.String }) {}
export class OutputDataConfig extends S.Class<OutputDataConfig>(
  "OutputDataConfig",
)({ S3Uri: S.String, EncryptionKey: S.optional(EncryptionKey) }) {}
export class Document extends S.Class<Document>("Document")({
  Content: T.Blob,
  ContentType: S.String,
}) {}
export class CreateParallelDataRequest extends S.Class<CreateParallelDataRequest>(
  "CreateParallelDataRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    ParallelDataConfig: ParallelDataConfig,
    EncryptionKey: S.optional(EncryptionKey),
    ClientToken: S.String,
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteParallelDataResponse extends S.Class<DeleteParallelDataResponse>(
  "DeleteParallelDataResponse",
)({ Name: S.optional(S.String), Status: S.optional(S.String) }) {}
export class ImportTerminologyRequest extends S.Class<ImportTerminologyRequest>(
  "ImportTerminologyRequest",
)(
  {
    Name: S.String,
    MergeStrategy: S.String,
    Description: S.optional(S.String),
    TerminologyData: TerminologyData,
    EncryptionKey: S.optional(EncryptionKey),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListParallelDataResponse extends S.Class<ListParallelDataResponse>(
  "ListParallelDataResponse",
)({
  ParallelDataPropertiesList: S.optional(ParallelDataPropertiesList),
  NextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }) {}
export class ListTerminologiesResponse extends S.Class<ListTerminologiesResponse>(
  "ListTerminologiesResponse",
)({
  TerminologyPropertiesList: S.optional(TerminologyPropertiesList),
  NextToken: S.optional(S.String),
}) {}
export class ListTextTranslationJobsRequest extends S.Class<ListTextTranslationJobsRequest>(
  "ListTextTranslationJobsRequest",
)(
  {
    Filter: S.optional(TextTranslationJobFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartTextTranslationJobRequest extends S.Class<StartTextTranslationJobRequest>(
  "StartTextTranslationJobRequest",
)(
  {
    JobName: S.optional(S.String),
    InputDataConfig: InputDataConfig,
    OutputDataConfig: OutputDataConfig,
    DataAccessRoleArn: S.String,
    SourceLanguageCode: S.String,
    TargetLanguageCodes: TargetLanguageCodeStringList,
    TerminologyNames: S.optional(ResourceNameList),
    ParallelDataNames: S.optional(ResourceNameList),
    ClientToken: S.String,
    Settings: S.optional(TranslationSettings),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopTextTranslationJobResponse extends S.Class<StopTextTranslationJobResponse>(
  "StopTextTranslationJobResponse",
)({ JobId: S.optional(S.String), JobStatus: S.optional(S.String) }) {}
export class TranslateDocumentRequest extends S.Class<TranslateDocumentRequest>(
  "TranslateDocumentRequest",
)(
  {
    Document: Document,
    TerminologyNames: S.optional(ResourceNameList),
    SourceLanguageCode: S.String,
    TargetLanguageCode: S.String,
    Settings: S.optional(TranslationSettings),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateParallelDataResponse extends S.Class<UpdateParallelDataResponse>(
  "UpdateParallelDataResponse",
)({
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  LatestUpdateAttemptStatus: S.optional(S.String),
  LatestUpdateAttemptAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class ParallelDataDataLocation extends S.Class<ParallelDataDataLocation>(
  "ParallelDataDataLocation",
)({ RepositoryType: S.String, Location: S.String }) {}
export class TerminologyDataLocation extends S.Class<TerminologyDataLocation>(
  "TerminologyDataLocation",
)({ RepositoryType: S.String, Location: S.String }) {}
export class Language extends S.Class<Language>("Language")({
  LanguageName: S.String,
  LanguageCode: S.String,
}) {}
export const LanguagesList = S.Array(Language);
export class JobDetails extends S.Class<JobDetails>("JobDetails")({
  TranslatedDocumentsCount: S.optional(S.Number),
  DocumentsWithErrorsCount: S.optional(S.Number),
  InputDocumentsCount: S.optional(S.Number),
}) {}
export class TextTranslationJobProperties extends S.Class<TextTranslationJobProperties>(
  "TextTranslationJobProperties",
)({
  JobId: S.optional(S.String),
  JobName: S.optional(S.String),
  JobStatus: S.optional(S.String),
  JobDetails: S.optional(JobDetails),
  SourceLanguageCode: S.optional(S.String),
  TargetLanguageCodes: S.optional(TargetLanguageCodeStringList),
  TerminologyNames: S.optional(ResourceNameList),
  ParallelDataNames: S.optional(ResourceNameList),
  Message: S.optional(S.String),
  SubmittedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  InputDataConfig: S.optional(InputDataConfig),
  OutputDataConfig: S.optional(OutputDataConfig),
  DataAccessRoleArn: S.optional(S.String),
  Settings: S.optional(TranslationSettings),
}) {}
export const TextTranslationJobPropertiesList = S.Array(
  TextTranslationJobProperties,
);
export class CreateParallelDataResponse extends S.Class<CreateParallelDataResponse>(
  "CreateParallelDataResponse",
)({ Name: S.optional(S.String), Status: S.optional(S.String) }) {}
export class GetParallelDataResponse extends S.Class<GetParallelDataResponse>(
  "GetParallelDataResponse",
)({
  ParallelDataProperties: S.optional(ParallelDataProperties),
  DataLocation: S.optional(ParallelDataDataLocation),
  AuxiliaryDataLocation: S.optional(ParallelDataDataLocation),
  LatestUpdateAttemptAuxiliaryDataLocation: S.optional(
    ParallelDataDataLocation,
  ),
}) {}
export class GetTerminologyResponse extends S.Class<GetTerminologyResponse>(
  "GetTerminologyResponse",
)({
  TerminologyProperties: S.optional(TerminologyProperties),
  TerminologyDataLocation: S.optional(TerminologyDataLocation),
  AuxiliaryDataLocation: S.optional(TerminologyDataLocation),
}) {}
export class ImportTerminologyResponse extends S.Class<ImportTerminologyResponse>(
  "ImportTerminologyResponse",
)({
  TerminologyProperties: S.optional(TerminologyProperties),
  AuxiliaryDataLocation: S.optional(TerminologyDataLocation),
}) {}
export class ListLanguagesResponse extends S.Class<ListLanguagesResponse>(
  "ListLanguagesResponse",
)({
  Languages: S.optional(LanguagesList),
  DisplayLanguageCode: S.optional(S.String),
  NextToken: S.optional(S.String),
}) {}
export class ListTextTranslationJobsResponse extends S.Class<ListTextTranslationJobsResponse>(
  "ListTextTranslationJobsResponse",
)({
  TextTranslationJobPropertiesList: S.optional(
    TextTranslationJobPropertiesList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class StartTextTranslationJobResponse extends S.Class<StartTextTranslationJobResponse>(
  "StartTextTranslationJobResponse",
)({ JobId: S.optional(S.String), JobStatus: S.optional(S.String) }) {}
export class Term extends S.Class<Term>("Term")({
  SourceText: S.optional(S.String),
  TargetText: S.optional(S.String),
}) {}
export const TermList = S.Array(Term);
export class TranslatedDocument extends S.Class<TranslatedDocument>(
  "TranslatedDocument",
)({ Content: T.Blob }) {}
export class AppliedTerminology extends S.Class<AppliedTerminology>(
  "AppliedTerminology",
)({ Name: S.optional(S.String), Terms: S.optional(TermList) }) {}
export const AppliedTerminologyList = S.Array(AppliedTerminology);
export class DescribeTextTranslationJobResponse extends S.Class<DescribeTextTranslationJobResponse>(
  "DescribeTextTranslationJobResponse",
)({ TextTranslationJobProperties: S.optional(TextTranslationJobProperties) }) {}
export class TranslateDocumentResponse extends S.Class<TranslateDocumentResponse>(
  "TranslateDocumentResponse",
)({
  TranslatedDocument: TranslatedDocument,
  SourceLanguageCode: S.String,
  TargetLanguageCode: S.String,
  AppliedTerminologies: S.optional(AppliedTerminologyList),
  AppliedSettings: S.optional(TranslationSettings),
}) {}
export class TranslateTextResponse extends S.Class<TranslateTextResponse>(
  "TranslateTextResponse",
)({
  TranslatedText: S.String,
  SourceLanguageCode: S.String,
  TargetLanguageCode: S.String,
  AppliedTerminologies: S.optional(AppliedTerminologyList),
  AppliedSettings: S.optional(TranslationSettings),
}) {}

//# Errors
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  {},
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String), ResourceArn: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
) {}
export class UnsupportedDisplayLanguageCodeException extends S.TaggedError<UnsupportedDisplayLanguageCodeException>()(
  "UnsupportedDisplayLanguageCodeException",
  { Message: S.optional(S.String), DisplayLanguageCode: S.optional(S.String) },
) {}
export class InvalidFilterException extends S.TaggedError<InvalidFilterException>()(
  "InvalidFilterException",
  { Message: S.optional(S.String) },
) {}
export class UnsupportedLanguagePairException extends S.TaggedError<UnsupportedLanguagePairException>()(
  "UnsupportedLanguagePairException",
  {
    Message: S.optional(S.String),
    SourceLanguageCode: S.optional(S.String),
    TargetLanguageCode: S.optional(S.String),
  },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Message: S.optional(S.String) },
) {}
export class DetectedLanguageLowConfidenceException extends S.TaggedError<DetectedLanguageLowConfidenceException>()(
  "DetectedLanguageLowConfidenceException",
  { Message: S.optional(S.String), DetectedLanguageCode: S.optional(S.String) },
) {}
export class TextSizeLimitExceededException extends S.TaggedError<TextSizeLimitExceededException>()(
  "TextSizeLimitExceededException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Provides a list of your parallel data resources in Amazon Translate.
 */
export const listParallelData = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListParallelDataRequest,
  output: ListParallelDataResponse,
  errors: [
    InternalServerException,
    InvalidParameterValueException,
    TooManyRequestsException,
  ],
}));
/**
 * Lists all tags associated with a given Amazon Translate resource.
 * For more information, see
 * Tagging your resources.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    InvalidParameterValueException,
    ResourceNotFoundException,
  ],
}));
/**
 * Provides a list of custom terminologies associated with your account.
 */
export const listTerminologies = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTerminologiesRequest,
  output: ListTerminologiesResponse,
  errors: [
    InternalServerException,
    InvalidParameterValueException,
    TooManyRequestsException,
  ],
}));
/**
 * Stops an asynchronous batch translation job that is in progress.
 *
 * If the job's state is `IN_PROGRESS`, the job will be marked for termination and
 * put into the `STOP_REQUESTED` state. If the job completes before it can be stopped,
 * it is put into the `COMPLETED` state. Otherwise, the job is put into the
 * `STOPPED` state.
 *
 * Asynchronous batch translation jobs are started with the StartTextTranslationJob operation. You can use the DescribeTextTranslationJob or ListTextTranslationJobs
 * operations to get a batch translation job's `JobId`.
 */
export const stopTextTranslationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopTextTranslationJobRequest,
    output: StopTextTranslationJobResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Removes a specific tag associated with an Amazon Translate resource.
 * For more information, see
 * Tagging your resources.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    ConcurrentModificationException,
    InternalServerException,
    InvalidParameterValueException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a parallel data resource in Amazon Translate.
 */
export const deleteParallelData = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteParallelDataRequest,
  output: DeleteParallelDataResponse,
  errors: [
    ConcurrentModificationException,
    InternalServerException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * A synchronous action that deletes a custom terminology.
 */
export const deleteTerminology = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTerminologyRequest,
  output: DeleteTerminologyResponse,
  errors: [
    InternalServerException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Provides information about a parallel data resource.
 */
export const getParallelData = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetParallelDataRequest,
  output: GetParallelDataResponse,
  errors: [
    InternalServerException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves a custom terminology.
 */
export const getTerminology = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTerminologyRequest,
  output: GetTerminologyResponse,
  errors: [
    InternalServerException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Associates a specific tag with a resource. A tag is a key-value pair
 * that adds as a metadata to a resource.
 * For more information, see
 * Tagging your resources.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ConcurrentModificationException,
    InternalServerException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    TooManyTagsException,
  ],
}));
/**
 * Updates a previously created parallel data resource by importing a new input file from
 * Amazon S3.
 */
export const updateParallelData = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateParallelDataRequest,
  output: UpdateParallelDataResponse,
  errors: [
    ConcurrentModificationException,
    ConflictException,
    InternalServerException,
    InvalidParameterValueException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a parallel data resource in Amazon Translate by importing an input file from
 * Amazon S3. Parallel data files contain examples that show how you want segments of text to be
 * translated. By adding parallel data, you can influence the style, tone, and word choice in
 * your translation output.
 */
export const createParallelData = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateParallelDataRequest,
  output: CreateParallelDataResponse,
  errors: [
    ConcurrentModificationException,
    ConflictException,
    InternalServerException,
    InvalidParameterValueException,
    InvalidRequestException,
    LimitExceededException,
    TooManyRequestsException,
    TooManyTagsException,
  ],
}));
/**
 * Gets the properties associated with an asynchronous batch translation job including name,
 * ID, status, source and target languages, input/output S3 buckets, and so on.
 */
export const describeTextTranslationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeTextTranslationJobRequest,
    output: DescribeTextTranslationJobResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Creates or updates a custom terminology, depending on whether one already exists for the
 * given terminology name. Importing a terminology with the same name as an existing one will
 * merge the terminologies based on the chosen merge strategy. The only supported merge strategy
 * is OVERWRITE, where the imported terminology overwrites the existing terminology of the same
 * name.
 *
 * If you import a terminology that overwrites an existing one, the new terminology takes up
 * to 10 minutes to fully propagate. After that, translations have access to the new
 * terminology.
 */
export const importTerminology = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportTerminologyRequest,
  output: ImportTerminologyResponse,
  errors: [
    ConcurrentModificationException,
    InternalServerException,
    InvalidParameterValueException,
    LimitExceededException,
    TooManyRequestsException,
    TooManyTagsException,
  ],
}));
/**
 * Provides a list of languages (RFC-5646 codes and names) that Amazon Translate supports.
 */
export const listLanguages = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLanguagesRequest,
  output: ListLanguagesResponse,
  errors: [
    InternalServerException,
    InvalidParameterValueException,
    TooManyRequestsException,
    UnsupportedDisplayLanguageCodeException,
  ],
}));
/**
 * Gets a list of the batch translation jobs that you have submitted.
 */
export const listTextTranslationJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListTextTranslationJobsRequest,
    output: ListTextTranslationJobsResponse,
    errors: [
      InternalServerException,
      InvalidFilterException,
      InvalidRequestException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Starts an asynchronous batch translation job. Use batch translation jobs to
 * translate large volumes of text across multiple documents at once.
 * For batch translation, you can input documents with different source languages (specify `auto`
 * as the source language). You can specify one
 * or more target languages. Batch translation translates each input document into each of the target languages.
 * For more information, see
 * Asynchronous batch processing.
 *
 * Batch translation jobs can be described with the DescribeTextTranslationJob operation, listed with the ListTextTranslationJobs operation, and stopped with the StopTextTranslationJob operation.
 */
export const startTextTranslationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartTextTranslationJobRequest,
    output: StartTextTranslationJobResponse,
    errors: [
      InternalServerException,
      InvalidParameterValueException,
      InvalidRequestException,
      ResourceNotFoundException,
      TooManyRequestsException,
      UnsupportedLanguagePairException,
    ],
  }),
);
/**
 * Translates the input document from the source language to the target language.
 * This synchronous operation supports text, HTML, or Word documents as the input document.
 *
 * `TranslateDocument` supports translations from English to any supported language,
 * and from any supported language to English. Therefore, specify either the source language code
 * or the target language code as “en” (English).
 *
 * If you set the `Formality` parameter, the request will fail if the target language does
 * not support formality. For a list of target languages that support formality, see
 * Setting formality.
 */
export const translateDocument = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TranslateDocumentRequest,
  output: TranslateDocumentResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnsupportedLanguagePairException,
  ],
}));
/**
 * Translates input text from the source language to the target language. For a list of
 * available languages and language codes, see Supported languages.
 */
export const translateText = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TranslateTextRequest,
  output: TranslateTextResponse,
  errors: [
    DetectedLanguageLowConfidenceException,
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    TextSizeLimitExceededException,
    TooManyRequestsException,
    UnsupportedLanguagePairException,
  ],
}));
