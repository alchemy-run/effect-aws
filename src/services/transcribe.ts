import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Transcribe",
  serviceShapeName: "Transcribe",
});
const auth = T.AwsAuthSigv4({ name: "transcribe" });
const ver = T.ServiceVersion("2017-10-26");
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
                        url: "https://transcribe-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://fips.transcribe.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws-us-gov",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://fips.transcribe.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://transcribe-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://transcribe.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
              conditions: [
                { fn: "stringEquals", argv: [{ ref: "Region" }, "cn-north-1"] },
              ],
              endpoint: {
                url: "https://cn.transcribe.cn-north-1.amazonaws.com.cn",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [
                {
                  fn: "stringEquals",
                  argv: [{ ref: "Region" }, "cn-northwest-1"],
                },
              ],
              endpoint: {
                url: "https://cn.transcribe.cn-northwest-1.amazonaws.com.cn",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://transcribe.{Region}.{PartitionResult#dnsSuffix}",
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
export const Phrases = S.Array(S.String);
export const Words = S.Array(S.String);
export const LanguageOptions = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateMedicalVocabularyRequest extends S.Class<CreateMedicalVocabularyRequest>(
  "CreateMedicalVocabularyRequest",
)(
  {
    VocabularyName: S.String.pipe(T.HttpLabel()),
    LanguageCode: S.String,
    VocabularyFileUri: S.String,
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/medicalvocabularies/{VocabularyName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateVocabularyRequest extends S.Class<CreateVocabularyRequest>(
  "CreateVocabularyRequest",
)(
  {
    VocabularyName: S.String.pipe(T.HttpLabel()),
    LanguageCode: S.String,
    Phrases: S.optional(Phrases),
    VocabularyFileUri: S.optional(S.String),
    Tags: S.optional(TagList),
    DataAccessRoleArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/vocabularies/{VocabularyName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateVocabularyFilterRequest extends S.Class<CreateVocabularyFilterRequest>(
  "CreateVocabularyFilterRequest",
)(
  {
    VocabularyFilterName: S.String.pipe(T.HttpLabel()),
    LanguageCode: S.String,
    Words: S.optional(Words),
    VocabularyFilterFileUri: S.optional(S.String),
    Tags: S.optional(TagList),
    DataAccessRoleArn: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/vocabularyFilters/{VocabularyFilterName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCallAnalyticsCategoryRequest extends S.Class<DeleteCallAnalyticsCategoryRequest>(
  "DeleteCallAnalyticsCategoryRequest",
)(
  { CategoryName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/callanalyticscategories/{CategoryName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCallAnalyticsCategoryResponse extends S.Class<DeleteCallAnalyticsCategoryResponse>(
  "DeleteCallAnalyticsCategoryResponse",
)({}) {}
export class DeleteCallAnalyticsJobRequest extends S.Class<DeleteCallAnalyticsJobRequest>(
  "DeleteCallAnalyticsJobRequest",
)(
  { CallAnalyticsJobName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/callanalyticsjobs/{CallAnalyticsJobName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCallAnalyticsJobResponse extends S.Class<DeleteCallAnalyticsJobResponse>(
  "DeleteCallAnalyticsJobResponse",
)({}) {}
export class DeleteLanguageModelRequest extends S.Class<DeleteLanguageModelRequest>(
  "DeleteLanguageModelRequest",
)(
  { ModelName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/languagemodels/{ModelName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLanguageModelResponse extends S.Class<DeleteLanguageModelResponse>(
  "DeleteLanguageModelResponse",
)({}) {}
export class DeleteMedicalScribeJobRequest extends S.Class<DeleteMedicalScribeJobRequest>(
  "DeleteMedicalScribeJobRequest",
)(
  { MedicalScribeJobName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/medicalscribejobs/{MedicalScribeJobName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMedicalScribeJobResponse extends S.Class<DeleteMedicalScribeJobResponse>(
  "DeleteMedicalScribeJobResponse",
)({}) {}
export class DeleteMedicalTranscriptionJobRequest extends S.Class<DeleteMedicalTranscriptionJobRequest>(
  "DeleteMedicalTranscriptionJobRequest",
)(
  { MedicalTranscriptionJobName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/medicaltranscriptionjobs/{MedicalTranscriptionJobName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMedicalTranscriptionJobResponse extends S.Class<DeleteMedicalTranscriptionJobResponse>(
  "DeleteMedicalTranscriptionJobResponse",
)({}) {}
export class DeleteMedicalVocabularyRequest extends S.Class<DeleteMedicalVocabularyRequest>(
  "DeleteMedicalVocabularyRequest",
)(
  { VocabularyName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/medicalvocabularies/{VocabularyName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMedicalVocabularyResponse extends S.Class<DeleteMedicalVocabularyResponse>(
  "DeleteMedicalVocabularyResponse",
)({}) {}
export class DeleteTranscriptionJobRequest extends S.Class<DeleteTranscriptionJobRequest>(
  "DeleteTranscriptionJobRequest",
)(
  { TranscriptionJobName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/transcriptionjobs/{TranscriptionJobName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTranscriptionJobResponse extends S.Class<DeleteTranscriptionJobResponse>(
  "DeleteTranscriptionJobResponse",
)({}) {}
export class DeleteVocabularyRequest extends S.Class<DeleteVocabularyRequest>(
  "DeleteVocabularyRequest",
)(
  { VocabularyName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/vocabularies/{VocabularyName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVocabularyResponse extends S.Class<DeleteVocabularyResponse>(
  "DeleteVocabularyResponse",
)({}) {}
export class DeleteVocabularyFilterRequest extends S.Class<DeleteVocabularyFilterRequest>(
  "DeleteVocabularyFilterRequest",
)(
  { VocabularyFilterName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/vocabularyFilters/{VocabularyFilterName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVocabularyFilterResponse extends S.Class<DeleteVocabularyFilterResponse>(
  "DeleteVocabularyFilterResponse",
)({}) {}
export class DescribeLanguageModelRequest extends S.Class<DescribeLanguageModelRequest>(
  "DescribeLanguageModelRequest",
)(
  { ModelName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/languagemodels/{ModelName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCallAnalyticsCategoryRequest extends S.Class<GetCallAnalyticsCategoryRequest>(
  "GetCallAnalyticsCategoryRequest",
)(
  { CategoryName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/callanalyticscategories/{CategoryName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCallAnalyticsJobRequest extends S.Class<GetCallAnalyticsJobRequest>(
  "GetCallAnalyticsJobRequest",
)(
  { CallAnalyticsJobName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/callanalyticsjobs/{CallAnalyticsJobName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMedicalScribeJobRequest extends S.Class<GetMedicalScribeJobRequest>(
  "GetMedicalScribeJobRequest",
)(
  { MedicalScribeJobName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/medicalscribejobs/{MedicalScribeJobName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMedicalTranscriptionJobRequest extends S.Class<GetMedicalTranscriptionJobRequest>(
  "GetMedicalTranscriptionJobRequest",
)(
  { MedicalTranscriptionJobName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/medicaltranscriptionjobs/{MedicalTranscriptionJobName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMedicalVocabularyRequest extends S.Class<GetMedicalVocabularyRequest>(
  "GetMedicalVocabularyRequest",
)(
  { VocabularyName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/medicalvocabularies/{VocabularyName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTranscriptionJobRequest extends S.Class<GetTranscriptionJobRequest>(
  "GetTranscriptionJobRequest",
)(
  { TranscriptionJobName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/transcriptionjobs/{TranscriptionJobName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVocabularyRequest extends S.Class<GetVocabularyRequest>(
  "GetVocabularyRequest",
)(
  { VocabularyName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/vocabularies/{VocabularyName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVocabularyFilterRequest extends S.Class<GetVocabularyFilterRequest>(
  "GetVocabularyFilterRequest",
)(
  { VocabularyFilterName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/vocabularyFilters/{VocabularyFilterName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCallAnalyticsCategoriesRequest extends S.Class<ListCallAnalyticsCategoriesRequest>(
  "ListCallAnalyticsCategoriesRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/callanalyticscategories" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCallAnalyticsJobsRequest extends S.Class<ListCallAnalyticsJobsRequest>(
  "ListCallAnalyticsJobsRequest",
)(
  {
    Status: S.optional(S.String).pipe(T.HttpQuery("Status")),
    JobNameContains: S.optional(S.String).pipe(T.HttpQuery("JobNameContains")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/callanalyticsjobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLanguageModelsRequest extends S.Class<ListLanguageModelsRequest>(
  "ListLanguageModelsRequest",
)(
  {
    StatusEquals: S.optional(S.String).pipe(
      T.HttpQuery("         StatusEquals"),
    ),
    NameContains: S.optional(S.String).pipe(T.HttpQuery("NameContains")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/languagemodels" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMedicalScribeJobsRequest extends S.Class<ListMedicalScribeJobsRequest>(
  "ListMedicalScribeJobsRequest",
)(
  {
    Status: S.optional(S.String).pipe(T.HttpQuery("Status")),
    JobNameContains: S.optional(S.String).pipe(T.HttpQuery("JobNameContains")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/medicalscribejobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMedicalTranscriptionJobsRequest extends S.Class<ListMedicalTranscriptionJobsRequest>(
  "ListMedicalTranscriptionJobsRequest",
)(
  {
    Status: S.optional(S.String).pipe(T.HttpQuery("Status")),
    JobNameContains: S.optional(S.String).pipe(T.HttpQuery("JobNameContains")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/medicaltranscriptionjobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMedicalVocabulariesRequest extends S.Class<ListMedicalVocabulariesRequest>(
  "ListMedicalVocabulariesRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    StateEquals: S.optional(S.String).pipe(T.HttpQuery("StateEquals")),
    NameContains: S.optional(S.String).pipe(T.HttpQuery("NameContains")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/medicalvocabularies" }),
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
export class ListTranscriptionJobsRequest extends S.Class<ListTranscriptionJobsRequest>(
  "ListTranscriptionJobsRequest",
)(
  {
    Status: S.optional(S.String).pipe(T.HttpQuery("Status")),
    JobNameContains: S.optional(S.String).pipe(T.HttpQuery("JobNameContains")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/transcriptionjobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVocabulariesRequest extends S.Class<ListVocabulariesRequest>(
  "ListVocabulariesRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    StateEquals: S.optional(S.String).pipe(T.HttpQuery("StateEquals")),
    NameContains: S.optional(S.String).pipe(T.HttpQuery("NameContains")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/vocabularies" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVocabularyFiltersRequest extends S.Class<ListVocabularyFiltersRequest>(
  "ListVocabularyFiltersRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NameContains: S.optional(S.String).pipe(T.HttpQuery("NameContains")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/vocabularyFilters" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel()), Tags: TagList },
  T.all(
    T.Http({ method: "PUT", uri: "/tags/{ResourceArn}" }),
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
  {
    ResourceArn: S.String.pipe(T.HttpLabel()),
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
export class AbsoluteTimeRange extends S.Class<AbsoluteTimeRange>(
  "AbsoluteTimeRange",
)({
  StartTime: S.optional(S.Number),
  EndTime: S.optional(S.Number),
  First: S.optional(S.Number),
  Last: S.optional(S.Number),
}) {}
export class RelativeTimeRange extends S.Class<RelativeTimeRange>(
  "RelativeTimeRange",
)({
  StartPercentage: S.optional(S.Number),
  EndPercentage: S.optional(S.Number),
  First: S.optional(S.Number),
  Last: S.optional(S.Number),
}) {}
export class NonTalkTimeFilter extends S.Class<NonTalkTimeFilter>(
  "NonTalkTimeFilter",
)({
  Threshold: S.optional(S.Number),
  AbsoluteTimeRange: S.optional(AbsoluteTimeRange),
  RelativeTimeRange: S.optional(RelativeTimeRange),
  Negate: S.optional(S.Boolean),
}) {}
export class InterruptionFilter extends S.Class<InterruptionFilter>(
  "InterruptionFilter",
)({
  Threshold: S.optional(S.Number),
  ParticipantRole: S.optional(S.String),
  AbsoluteTimeRange: S.optional(AbsoluteTimeRange),
  RelativeTimeRange: S.optional(RelativeTimeRange),
  Negate: S.optional(S.Boolean),
}) {}
export const StringTargetList = S.Array(S.String);
export class TranscriptFilter extends S.Class<TranscriptFilter>(
  "TranscriptFilter",
)({
  TranscriptFilterType: S.String,
  AbsoluteTimeRange: S.optional(AbsoluteTimeRange),
  RelativeTimeRange: S.optional(RelativeTimeRange),
  ParticipantRole: S.optional(S.String),
  Negate: S.optional(S.Boolean),
  Targets: StringTargetList,
}) {}
export const SentimentValueList = S.Array(S.String);
export class SentimentFilter extends S.Class<SentimentFilter>(
  "SentimentFilter",
)({
  Sentiments: SentimentValueList,
  AbsoluteTimeRange: S.optional(AbsoluteTimeRange),
  RelativeTimeRange: S.optional(RelativeTimeRange),
  ParticipantRole: S.optional(S.String),
  Negate: S.optional(S.Boolean),
}) {}
export const Rule = S.Union(
  S.Struct({ NonTalkTimeFilter: NonTalkTimeFilter }),
  S.Struct({ InterruptionFilter: InterruptionFilter }),
  S.Struct({ TranscriptFilter: TranscriptFilter }),
  S.Struct({ SentimentFilter: SentimentFilter }),
);
export const RuleList = S.Array(Rule);
export class UpdateCallAnalyticsCategoryRequest extends S.Class<UpdateCallAnalyticsCategoryRequest>(
  "UpdateCallAnalyticsCategoryRequest",
)(
  {
    CategoryName: S.String.pipe(T.HttpLabel()),
    Rules: RuleList,
    InputType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/callanalyticscategories/{CategoryName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateMedicalVocabularyRequest extends S.Class<UpdateMedicalVocabularyRequest>(
  "UpdateMedicalVocabularyRequest",
)(
  {
    VocabularyName: S.String.pipe(T.HttpLabel()),
    LanguageCode: S.String,
    VocabularyFileUri: S.String,
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/medicalvocabularies/{VocabularyName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateVocabularyRequest extends S.Class<UpdateVocabularyRequest>(
  "UpdateVocabularyRequest",
)(
  {
    VocabularyName: S.String.pipe(T.HttpLabel()),
    LanguageCode: S.String,
    Phrases: S.optional(Phrases),
    VocabularyFileUri: S.optional(S.String),
    DataAccessRoleArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/vocabularies/{VocabularyName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateVocabularyFilterRequest extends S.Class<UpdateVocabularyFilterRequest>(
  "UpdateVocabularyFilterRequest",
)(
  {
    VocabularyFilterName: S.String.pipe(T.HttpLabel()),
    Words: S.optional(Words),
    VocabularyFilterFileUri: S.optional(S.String),
    DataAccessRoleArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/vocabularyFilters/{VocabularyFilterName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const PiiEntityTypes = S.Array(S.String);
export const SubtitleFormats = S.Array(S.String);
export const ToxicityCategories = S.Array(S.String);
export class InputDataConfig extends S.Class<InputDataConfig>(
  "InputDataConfig",
)({
  S3Uri: S.String,
  TuningDataS3Uri: S.optional(S.String),
  DataAccessRoleArn: S.String,
}) {}
export class CategoryProperties extends S.Class<CategoryProperties>(
  "CategoryProperties",
)({
  CategoryName: S.optional(S.String),
  Rules: S.optional(RuleList),
  CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Tags: S.optional(TagList),
  InputType: S.optional(S.String),
}) {}
export const CategoryPropertiesList = S.Array(CategoryProperties);
export class LanguageModel extends S.Class<LanguageModel>("LanguageModel")({
  ModelName: S.optional(S.String),
  CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LanguageCode: S.optional(S.String),
  BaseModelName: S.optional(S.String),
  ModelStatus: S.optional(S.String),
  UpgradeAvailability: S.optional(S.Boolean),
  FailureReason: S.optional(S.String),
  InputDataConfig: S.optional(InputDataConfig),
}) {}
export const Models = S.Array(LanguageModel);
export class Media extends S.Class<Media>("Media")({
  MediaFileUri: S.optional(S.String),
  RedactedMediaFileUri: S.optional(S.String),
}) {}
export class ChannelDefinition extends S.Class<ChannelDefinition>(
  "ChannelDefinition",
)({ ChannelId: S.optional(S.Number), ParticipantRole: S.optional(S.String) }) {}
export const ChannelDefinitions = S.Array(ChannelDefinition);
export const KMSEncryptionContextMap = S.Record({
  key: S.String,
  value: S.String,
});
export class MedicalScribeChannelDefinition extends S.Class<MedicalScribeChannelDefinition>(
  "MedicalScribeChannelDefinition",
)({ ChannelId: S.Number, ParticipantRole: S.String }) {}
export const MedicalScribeChannelDefinitions = S.Array(
  MedicalScribeChannelDefinition,
);
export class MedicalTranscriptionSetting extends S.Class<MedicalTranscriptionSetting>(
  "MedicalTranscriptionSetting",
)({
  ShowSpeakerLabels: S.optional(S.Boolean),
  MaxSpeakerLabels: S.optional(S.Number),
  ChannelIdentification: S.optional(S.Boolean),
  ShowAlternatives: S.optional(S.Boolean),
  MaxAlternatives: S.optional(S.Number),
  VocabularyName: S.optional(S.String),
}) {}
export class Settings extends S.Class<Settings>("Settings")({
  VocabularyName: S.optional(S.String),
  ShowSpeakerLabels: S.optional(S.Boolean),
  MaxSpeakerLabels: S.optional(S.Number),
  ChannelIdentification: S.optional(S.Boolean),
  ShowAlternatives: S.optional(S.Boolean),
  MaxAlternatives: S.optional(S.Number),
  VocabularyFilterName: S.optional(S.String),
  VocabularyFilterMethod: S.optional(S.String),
}) {}
export class ModelSettings extends S.Class<ModelSettings>("ModelSettings")({
  LanguageModelName: S.optional(S.String),
}) {}
export class JobExecutionSettings extends S.Class<JobExecutionSettings>(
  "JobExecutionSettings",
)({
  AllowDeferredExecution: S.optional(S.Boolean),
  DataAccessRoleArn: S.optional(S.String),
}) {}
export class ContentRedaction extends S.Class<ContentRedaction>(
  "ContentRedaction",
)({
  RedactionType: S.String,
  RedactionOutput: S.String,
  PiiEntityTypes: S.optional(PiiEntityTypes),
}) {}
export class Subtitles extends S.Class<Subtitles>("Subtitles")({
  Formats: S.optional(SubtitleFormats),
  OutputStartIndex: S.optional(S.Number),
}) {}
export class ToxicityDetectionSettings extends S.Class<ToxicityDetectionSettings>(
  "ToxicityDetectionSettings",
)({ ToxicityCategories: ToxicityCategories }) {}
export const ToxicityDetection = S.Array(ToxicityDetectionSettings);
export class CreateLanguageModelRequest extends S.Class<CreateLanguageModelRequest>(
  "CreateLanguageModelRequest",
)(
  {
    LanguageCode: S.String,
    BaseModelName: S.String,
    ModelName: S.String.pipe(T.HttpLabel()),
    InputDataConfig: InputDataConfig,
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/languagemodels/{ModelName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateMedicalVocabularyResponse extends S.Class<CreateMedicalVocabularyResponse>(
  "CreateMedicalVocabularyResponse",
)({
  VocabularyName: S.optional(S.String),
  LanguageCode: S.optional(S.String),
  VocabularyState: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FailureReason: S.optional(S.String),
}) {}
export class CreateVocabularyResponse extends S.Class<CreateVocabularyResponse>(
  "CreateVocabularyResponse",
)({
  VocabularyName: S.optional(S.String),
  LanguageCode: S.optional(S.String),
  VocabularyState: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FailureReason: S.optional(S.String),
}) {}
export class CreateVocabularyFilterResponse extends S.Class<CreateVocabularyFilterResponse>(
  "CreateVocabularyFilterResponse",
)({
  VocabularyFilterName: S.optional(S.String),
  LanguageCode: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetMedicalVocabularyResponse extends S.Class<GetMedicalVocabularyResponse>(
  "GetMedicalVocabularyResponse",
)({
  VocabularyName: S.optional(S.String),
  LanguageCode: S.optional(S.String),
  VocabularyState: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FailureReason: S.optional(S.String),
  DownloadUri: S.optional(S.String),
}) {}
export class GetVocabularyResponse extends S.Class<GetVocabularyResponse>(
  "GetVocabularyResponse",
)({
  VocabularyName: S.optional(S.String),
  LanguageCode: S.optional(S.String),
  VocabularyState: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FailureReason: S.optional(S.String),
  DownloadUri: S.optional(S.String),
}) {}
export class GetVocabularyFilterResponse extends S.Class<GetVocabularyFilterResponse>(
  "GetVocabularyFilterResponse",
)({
  VocabularyFilterName: S.optional(S.String),
  LanguageCode: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DownloadUri: S.optional(S.String),
}) {}
export class ListCallAnalyticsCategoriesResponse extends S.Class<ListCallAnalyticsCategoriesResponse>(
  "ListCallAnalyticsCategoriesResponse",
)({
  NextToken: S.optional(S.String),
  Categories: S.optional(CategoryPropertiesList),
}) {}
export class ListLanguageModelsResponse extends S.Class<ListLanguageModelsResponse>(
  "ListLanguageModelsResponse",
)({ NextToken: S.optional(S.String), Models: S.optional(Models) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ ResourceArn: S.optional(S.String), Tags: S.optional(TagList) }) {}
export class VocabularyInfo extends S.Class<VocabularyInfo>("VocabularyInfo")({
  VocabularyName: S.optional(S.String),
  LanguageCode: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  VocabularyState: S.optional(S.String),
}) {}
export const Vocabularies = S.Array(VocabularyInfo);
export class ListVocabulariesResponse extends S.Class<ListVocabulariesResponse>(
  "ListVocabulariesResponse",
)({
  Status: S.optional(S.String),
  NextToken: S.optional(S.String),
  Vocabularies: S.optional(Vocabularies),
}) {}
export class StartMedicalTranscriptionJobRequest extends S.Class<StartMedicalTranscriptionJobRequest>(
  "StartMedicalTranscriptionJobRequest",
)(
  {
    MedicalTranscriptionJobName: S.String.pipe(T.HttpLabel()),
    LanguageCode: S.String,
    MediaSampleRateHertz: S.optional(S.Number),
    MediaFormat: S.optional(S.String),
    Media: Media,
    OutputBucketName: S.String,
    OutputKey: S.optional(S.String),
    OutputEncryptionKMSKeyId: S.optional(S.String),
    KMSEncryptionContext: S.optional(KMSEncryptionContextMap),
    Settings: S.optional(MedicalTranscriptionSetting),
    ContentIdentificationType: S.optional(S.String),
    Specialty: S.String,
    Type: S.String,
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/medicaltranscriptionjobs/{MedicalTranscriptionJobName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCallAnalyticsCategoryResponse extends S.Class<UpdateCallAnalyticsCategoryResponse>(
  "UpdateCallAnalyticsCategoryResponse",
)({ CategoryProperties: S.optional(CategoryProperties) }) {}
export class UpdateMedicalVocabularyResponse extends S.Class<UpdateMedicalVocabularyResponse>(
  "UpdateMedicalVocabularyResponse",
)({
  VocabularyName: S.optional(S.String),
  LanguageCode: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  VocabularyState: S.optional(S.String),
}) {}
export class UpdateVocabularyResponse extends S.Class<UpdateVocabularyResponse>(
  "UpdateVocabularyResponse",
)({
  VocabularyName: S.optional(S.String),
  LanguageCode: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  VocabularyState: S.optional(S.String),
}) {}
export class UpdateVocabularyFilterResponse extends S.Class<UpdateVocabularyFilterResponse>(
  "UpdateVocabularyFilterResponse",
)({
  VocabularyFilterName: S.optional(S.String),
  LanguageCode: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class Summarization extends S.Class<Summarization>("Summarization")({
  GenerateAbstractiveSummary: S.Boolean,
}) {}
export class ClinicalNoteGenerationSettings extends S.Class<ClinicalNoteGenerationSettings>(
  "ClinicalNoteGenerationSettings",
)({ NoteTemplate: S.optional(S.String) }) {}
export class MedicalScribePatientContext extends S.Class<MedicalScribePatientContext>(
  "MedicalScribePatientContext",
)({ Pronouns: S.optional(S.String) }) {}
export class LanguageIdSettings extends S.Class<LanguageIdSettings>(
  "LanguageIdSettings",
)({
  VocabularyName: S.optional(S.String),
  VocabularyFilterName: S.optional(S.String),
  LanguageModelName: S.optional(S.String),
}) {}
export class CallAnalyticsSkippedFeature extends S.Class<CallAnalyticsSkippedFeature>(
  "CallAnalyticsSkippedFeature",
)({
  Feature: S.optional(S.String),
  ReasonCode: S.optional(S.String),
  Message: S.optional(S.String),
}) {}
export const CallAnalyticsSkippedFeatureList = S.Array(
  CallAnalyticsSkippedFeature,
);
export class CallAnalyticsJobDetails extends S.Class<CallAnalyticsJobDetails>(
  "CallAnalyticsJobDetails",
)({ Skipped: S.optional(CallAnalyticsSkippedFeatureList) }) {}
export class CallAnalyticsJobSummary extends S.Class<CallAnalyticsJobSummary>(
  "CallAnalyticsJobSummary",
)({
  CallAnalyticsJobName: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LanguageCode: S.optional(S.String),
  CallAnalyticsJobStatus: S.optional(S.String),
  CallAnalyticsJobDetails: S.optional(CallAnalyticsJobDetails),
  FailureReason: S.optional(S.String),
}) {}
export const CallAnalyticsJobSummaries = S.Array(CallAnalyticsJobSummary);
export class MedicalScribeJobSummary extends S.Class<MedicalScribeJobSummary>(
  "MedicalScribeJobSummary",
)({
  MedicalScribeJobName: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LanguageCode: S.optional(S.String),
  MedicalScribeJobStatus: S.optional(S.String),
  FailureReason: S.optional(S.String),
}) {}
export const MedicalScribeJobSummaries = S.Array(MedicalScribeJobSummary);
export class MedicalTranscriptionJobSummary extends S.Class<MedicalTranscriptionJobSummary>(
  "MedicalTranscriptionJobSummary",
)({
  MedicalTranscriptionJobName: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LanguageCode: S.optional(S.String),
  TranscriptionJobStatus: S.optional(S.String),
  FailureReason: S.optional(S.String),
  OutputLocationType: S.optional(S.String),
  Specialty: S.optional(S.String),
  ContentIdentificationType: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const MedicalTranscriptionJobSummaries = S.Array(
  MedicalTranscriptionJobSummary,
);
export class LanguageCodeItem extends S.Class<LanguageCodeItem>(
  "LanguageCodeItem",
)({
  LanguageCode: S.optional(S.String),
  DurationInSeconds: S.optional(S.Number),
}) {}
export const LanguageCodeList = S.Array(LanguageCodeItem);
export class TranscriptionJobSummary extends S.Class<TranscriptionJobSummary>(
  "TranscriptionJobSummary",
)({
  TranscriptionJobName: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LanguageCode: S.optional(S.String),
  TranscriptionJobStatus: S.optional(S.String),
  FailureReason: S.optional(S.String),
  OutputLocationType: S.optional(S.String),
  ContentRedaction: S.optional(ContentRedaction),
  ModelSettings: S.optional(ModelSettings),
  IdentifyLanguage: S.optional(S.Boolean),
  IdentifyMultipleLanguages: S.optional(S.Boolean),
  IdentifiedLanguageScore: S.optional(S.Number),
  LanguageCodes: S.optional(LanguageCodeList),
  ToxicityDetection: S.optional(ToxicityDetection),
}) {}
export const TranscriptionJobSummaries = S.Array(TranscriptionJobSummary);
export class VocabularyFilterInfo extends S.Class<VocabularyFilterInfo>(
  "VocabularyFilterInfo",
)({
  VocabularyFilterName: S.optional(S.String),
  LanguageCode: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const VocabularyFilters = S.Array(VocabularyFilterInfo);
export const LanguageIdSettingsMap = S.Record({
  key: S.String,
  value: LanguageIdSettings,
});
export class CallAnalyticsJobSettings extends S.Class<CallAnalyticsJobSettings>(
  "CallAnalyticsJobSettings",
)({
  VocabularyName: S.optional(S.String),
  VocabularyFilterName: S.optional(S.String),
  VocabularyFilterMethod: S.optional(S.String),
  LanguageModelName: S.optional(S.String),
  ContentRedaction: S.optional(ContentRedaction),
  LanguageOptions: S.optional(LanguageOptions),
  LanguageIdSettings: S.optional(LanguageIdSettingsMap),
  Summarization: S.optional(Summarization),
}) {}
export class MedicalScribeSettings extends S.Class<MedicalScribeSettings>(
  "MedicalScribeSettings",
)({
  ShowSpeakerLabels: S.optional(S.Boolean),
  MaxSpeakerLabels: S.optional(S.Number),
  ChannelIdentification: S.optional(S.Boolean),
  VocabularyName: S.optional(S.String),
  VocabularyFilterName: S.optional(S.String),
  VocabularyFilterMethod: S.optional(S.String),
  ClinicalNoteGenerationSettings: S.optional(ClinicalNoteGenerationSettings),
}) {}
export class MedicalScribeContext extends S.Class<MedicalScribeContext>(
  "MedicalScribeContext",
)({ PatientContext: S.optional(MedicalScribePatientContext) }) {}
export const SubtitleFileUris = S.Array(S.String);
export class CreateLanguageModelResponse extends S.Class<CreateLanguageModelResponse>(
  "CreateLanguageModelResponse",
)({
  LanguageCode: S.optional(S.String),
  BaseModelName: S.optional(S.String),
  ModelName: S.optional(S.String),
  InputDataConfig: S.optional(InputDataConfig),
  ModelStatus: S.optional(S.String),
}) {}
export class DescribeLanguageModelResponse extends S.Class<DescribeLanguageModelResponse>(
  "DescribeLanguageModelResponse",
)({ LanguageModel: S.optional(LanguageModel) }) {}
export class GetCallAnalyticsCategoryResponse extends S.Class<GetCallAnalyticsCategoryResponse>(
  "GetCallAnalyticsCategoryResponse",
)({ CategoryProperties: S.optional(CategoryProperties) }) {}
export class ListCallAnalyticsJobsResponse extends S.Class<ListCallAnalyticsJobsResponse>(
  "ListCallAnalyticsJobsResponse",
)({
  Status: S.optional(S.String),
  NextToken: S.optional(S.String),
  CallAnalyticsJobSummaries: S.optional(CallAnalyticsJobSummaries),
}) {}
export class ListMedicalScribeJobsResponse extends S.Class<ListMedicalScribeJobsResponse>(
  "ListMedicalScribeJobsResponse",
)({
  Status: S.optional(S.String),
  NextToken: S.optional(S.String),
  MedicalScribeJobSummaries: S.optional(MedicalScribeJobSummaries),
}) {}
export class ListMedicalTranscriptionJobsResponse extends S.Class<ListMedicalTranscriptionJobsResponse>(
  "ListMedicalTranscriptionJobsResponse",
)({
  Status: S.optional(S.String),
  NextToken: S.optional(S.String),
  MedicalTranscriptionJobSummaries: S.optional(
    MedicalTranscriptionJobSummaries,
  ),
}) {}
export class ListMedicalVocabulariesResponse extends S.Class<ListMedicalVocabulariesResponse>(
  "ListMedicalVocabulariesResponse",
)({
  Status: S.optional(S.String),
  NextToken: S.optional(S.String),
  Vocabularies: S.optional(Vocabularies),
}) {}
export class ListTranscriptionJobsResponse extends S.Class<ListTranscriptionJobsResponse>(
  "ListTranscriptionJobsResponse",
)({
  Status: S.optional(S.String),
  NextToken: S.optional(S.String),
  TranscriptionJobSummaries: S.optional(TranscriptionJobSummaries),
}) {}
export class ListVocabularyFiltersResponse extends S.Class<ListVocabularyFiltersResponse>(
  "ListVocabularyFiltersResponse",
)({
  NextToken: S.optional(S.String),
  VocabularyFilters: S.optional(VocabularyFilters),
}) {}
export class StartCallAnalyticsJobRequest extends S.Class<StartCallAnalyticsJobRequest>(
  "StartCallAnalyticsJobRequest",
)(
  {
    CallAnalyticsJobName: S.String.pipe(T.HttpLabel()),
    Media: Media,
    OutputLocation: S.optional(S.String),
    OutputEncryptionKMSKeyId: S.optional(S.String),
    DataAccessRoleArn: S.optional(S.String),
    Settings: S.optional(CallAnalyticsJobSettings),
    Tags: S.optional(TagList),
    ChannelDefinitions: S.optional(ChannelDefinitions),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/callanalyticsjobs/{CallAnalyticsJobName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartMedicalScribeJobRequest extends S.Class<StartMedicalScribeJobRequest>(
  "StartMedicalScribeJobRequest",
)(
  {
    MedicalScribeJobName: S.String.pipe(T.HttpLabel()),
    Media: Media,
    OutputBucketName: S.String,
    OutputEncryptionKMSKeyId: S.optional(S.String),
    KMSEncryptionContext: S.optional(KMSEncryptionContextMap),
    DataAccessRoleArn: S.String,
    Settings: MedicalScribeSettings,
    ChannelDefinitions: S.optional(MedicalScribeChannelDefinitions),
    Tags: S.optional(TagList),
    MedicalScribeContext: S.optional(MedicalScribeContext),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/medicalscribejobs/{MedicalScribeJobName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class MedicalTranscript extends S.Class<MedicalTranscript>(
  "MedicalTranscript",
)({ TranscriptFileUri: S.optional(S.String) }) {}
export class MedicalTranscriptionJob extends S.Class<MedicalTranscriptionJob>(
  "MedicalTranscriptionJob",
)({
  MedicalTranscriptionJobName: S.optional(S.String),
  TranscriptionJobStatus: S.optional(S.String),
  LanguageCode: S.optional(S.String),
  MediaSampleRateHertz: S.optional(S.Number),
  MediaFormat: S.optional(S.String),
  Media: S.optional(Media),
  Transcript: S.optional(MedicalTranscript),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FailureReason: S.optional(S.String),
  Settings: S.optional(MedicalTranscriptionSetting),
  ContentIdentificationType: S.optional(S.String),
  Specialty: S.optional(S.String),
  Type: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export class StartMedicalTranscriptionJobResponse extends S.Class<StartMedicalTranscriptionJobResponse>(
  "StartMedicalTranscriptionJobResponse",
)({ MedicalTranscriptionJob: S.optional(MedicalTranscriptionJob) }) {}
export class StartTranscriptionJobRequest extends S.Class<StartTranscriptionJobRequest>(
  "StartTranscriptionJobRequest",
)(
  {
    TranscriptionJobName: S.String.pipe(T.HttpLabel()),
    LanguageCode: S.optional(S.String),
    MediaSampleRateHertz: S.optional(S.Number),
    MediaFormat: S.optional(S.String),
    Media: Media,
    OutputBucketName: S.optional(S.String),
    OutputKey: S.optional(S.String),
    OutputEncryptionKMSKeyId: S.optional(S.String),
    KMSEncryptionContext: S.optional(KMSEncryptionContextMap),
    Settings: S.optional(Settings),
    ModelSettings: S.optional(ModelSettings),
    JobExecutionSettings: S.optional(JobExecutionSettings),
    ContentRedaction: S.optional(ContentRedaction),
    IdentifyLanguage: S.optional(S.Boolean),
    IdentifyMultipleLanguages: S.optional(S.Boolean),
    LanguageOptions: S.optional(LanguageOptions),
    Subtitles: S.optional(Subtitles),
    Tags: S.optional(TagList),
    LanguageIdSettings: S.optional(LanguageIdSettingsMap),
    ToxicityDetection: S.optional(ToxicityDetection),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/transcriptionjobs/{TranscriptionJobName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Transcript extends S.Class<Transcript>("Transcript")({
  TranscriptFileUri: S.optional(S.String),
  RedactedTranscriptFileUri: S.optional(S.String),
}) {}
export class MedicalScribeOutput extends S.Class<MedicalScribeOutput>(
  "MedicalScribeOutput",
)({ TranscriptFileUri: S.String, ClinicalDocumentUri: S.String }) {}
export class SubtitlesOutput extends S.Class<SubtitlesOutput>(
  "SubtitlesOutput",
)({
  Formats: S.optional(SubtitleFormats),
  SubtitleFileUris: S.optional(SubtitleFileUris),
  OutputStartIndex: S.optional(S.Number),
}) {}
export class MedicalScribeJob extends S.Class<MedicalScribeJob>(
  "MedicalScribeJob",
)({
  MedicalScribeJobName: S.optional(S.String),
  MedicalScribeJobStatus: S.optional(S.String),
  LanguageCode: S.optional(S.String),
  Media: S.optional(Media),
  MedicalScribeOutput: S.optional(MedicalScribeOutput),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FailureReason: S.optional(S.String),
  Settings: S.optional(MedicalScribeSettings),
  DataAccessRoleArn: S.optional(S.String),
  ChannelDefinitions: S.optional(MedicalScribeChannelDefinitions),
  MedicalScribeContextProvided: S.optional(S.Boolean),
  Tags: S.optional(TagList),
}) {}
export class TranscriptionJob extends S.Class<TranscriptionJob>(
  "TranscriptionJob",
)({
  TranscriptionJobName: S.optional(S.String),
  TranscriptionJobStatus: S.optional(S.String),
  LanguageCode: S.optional(S.String),
  MediaSampleRateHertz: S.optional(S.Number),
  MediaFormat: S.optional(S.String),
  Media: S.optional(Media),
  Transcript: S.optional(Transcript),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FailureReason: S.optional(S.String),
  Settings: S.optional(Settings),
  ModelSettings: S.optional(ModelSettings),
  JobExecutionSettings: S.optional(JobExecutionSettings),
  ContentRedaction: S.optional(ContentRedaction),
  IdentifyLanguage: S.optional(S.Boolean),
  IdentifyMultipleLanguages: S.optional(S.Boolean),
  LanguageOptions: S.optional(LanguageOptions),
  IdentifiedLanguageScore: S.optional(S.Number),
  LanguageCodes: S.optional(LanguageCodeList),
  Tags: S.optional(TagList),
  Subtitles: S.optional(SubtitlesOutput),
  LanguageIdSettings: S.optional(LanguageIdSettingsMap),
  ToxicityDetection: S.optional(ToxicityDetection),
}) {}
export class CreateCallAnalyticsCategoryRequest extends S.Class<CreateCallAnalyticsCategoryRequest>(
  "CreateCallAnalyticsCategoryRequest",
)(
  {
    CategoryName: S.String.pipe(T.HttpLabel()),
    Rules: RuleList,
    Tags: S.optional(TagList),
    InputType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/callanalyticscategories/{CategoryName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMedicalScribeJobResponse extends S.Class<GetMedicalScribeJobResponse>(
  "GetMedicalScribeJobResponse",
)({ MedicalScribeJob: S.optional(MedicalScribeJob) }) {}
export class GetMedicalTranscriptionJobResponse extends S.Class<GetMedicalTranscriptionJobResponse>(
  "GetMedicalTranscriptionJobResponse",
)({ MedicalTranscriptionJob: S.optional(MedicalTranscriptionJob) }) {}
export class GetTranscriptionJobResponse extends S.Class<GetTranscriptionJobResponse>(
  "GetTranscriptionJobResponse",
)({ TranscriptionJob: S.optional(TranscriptionJob) }) {}
export class CallAnalyticsJob extends S.Class<CallAnalyticsJob>(
  "CallAnalyticsJob",
)({
  CallAnalyticsJobName: S.optional(S.String),
  CallAnalyticsJobStatus: S.optional(S.String),
  CallAnalyticsJobDetails: S.optional(CallAnalyticsJobDetails),
  LanguageCode: S.optional(S.String),
  MediaSampleRateHertz: S.optional(S.Number),
  MediaFormat: S.optional(S.String),
  Media: S.optional(Media),
  Transcript: S.optional(Transcript),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FailureReason: S.optional(S.String),
  DataAccessRoleArn: S.optional(S.String),
  IdentifiedLanguageScore: S.optional(S.Number),
  Settings: S.optional(CallAnalyticsJobSettings),
  ChannelDefinitions: S.optional(ChannelDefinitions),
  Tags: S.optional(TagList),
}) {}
export class StartCallAnalyticsJobResponse extends S.Class<StartCallAnalyticsJobResponse>(
  "StartCallAnalyticsJobResponse",
)({ CallAnalyticsJob: S.optional(CallAnalyticsJob) }) {}
export class StartMedicalScribeJobResponse extends S.Class<StartMedicalScribeJobResponse>(
  "StartMedicalScribeJobResponse",
)({ MedicalScribeJob: S.optional(MedicalScribeJob) }) {}
export class StartTranscriptionJobResponse extends S.Class<StartTranscriptionJobResponse>(
  "StartTranscriptionJobResponse",
)({ TranscriptionJob: S.optional(TranscriptionJob) }) {}
export class CreateCallAnalyticsCategoryResponse extends S.Class<CreateCallAnalyticsCategoryResponse>(
  "CreateCallAnalyticsCategoryResponse",
)({ CategoryProperties: S.optional(CategoryProperties) }) {}
export class GetCallAnalyticsJobResponse extends S.Class<GetCallAnalyticsJobResponse>(
  "GetCallAnalyticsJobResponse",
)({ CallAnalyticsJob: S.optional(CallAnalyticsJob) }) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {},
) {}
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  {},
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}

//# Operations
/**
 * Deletes a Medical Scribe job. To use this operation, specify the name of the
 * job you want to delete using `MedicalScribeJobName`. Job names are
 * case sensitive.
 */
export const deleteMedicalScribeJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteMedicalScribeJobRequest,
    output: DeleteMedicalScribeJobResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      LimitExceededException,
    ],
  }),
);
/**
 * Deletes a medical transcription job. To use this operation, specify the name of the
 * job you want to delete using `MedicalTranscriptionJobName`. Job names are
 * case sensitive.
 */
export const deleteMedicalTranscriptionJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteMedicalTranscriptionJobRequest,
    output: DeleteMedicalTranscriptionJobResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      LimitExceededException,
    ],
  }));
/**
 * Deletes a transcription job. To use this operation, specify the name of the job you
 * want to delete using `TranscriptionJobName`. Job names are case
 * sensitive.
 */
export const deleteTranscriptionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteTranscriptionJobRequest,
    output: DeleteTranscriptionJobResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      LimitExceededException,
    ],
  }),
);
/**
 * Deletes a custom vocabulary. To use this operation, specify the name of the custom
 * vocabulary you want to delete using `VocabularyName`. Custom vocabulary names
 * are case sensitive.
 */
export const deleteVocabulary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVocabularyRequest,
  output: DeleteVocabularyResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Deletes a custom vocabulary filter. To use this operation, specify the name of the
 * custom vocabulary filter you want to delete using `VocabularyFilterName`.
 * Custom vocabulary filter names are case sensitive.
 */
export const deleteVocabularyFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteVocabularyFilterRequest,
    output: DeleteVocabularyFilterResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      LimitExceededException,
      NotFoundException,
    ],
  }),
);
/**
 * Removes the specified tags from the specified Amazon Transcribe resource.
 *
 * If you include `UntagResource` in your request, you must also include
 * `ResourceArn` and `TagKeys`.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Creates a new custom medical vocabulary.
 *
 * Before creating a new custom medical vocabulary, you must first upload a text file
 * that contains your vocabulary table into an Amazon S3 bucket.
 * Note that this differs from , where you can
 * include a list of terms within your request using the `Phrases` flag;
 * `CreateMedicalVocabulary` does not support the `Phrases`
 * flag and only accepts vocabularies in table format.
 *
 * Each language has a character set that contains all allowed characters for that
 * specific language. If you use unsupported characters, your custom vocabulary request
 * fails. Refer to Character Sets for Custom Vocabularies to get the character set for your
 * language.
 *
 * For more information, see Custom
 * vocabularies.
 */
export const createMedicalVocabulary = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateMedicalVocabularyRequest,
    output: CreateMedicalVocabularyResponse,
    errors: [
      BadRequestException,
      ConflictException,
      InternalFailureException,
      LimitExceededException,
    ],
  }),
);
/**
 * Creates a new custom vocabulary.
 *
 * When creating a new custom vocabulary, you can either upload a text file that contains
 * your new entries, phrases, and terms into an Amazon S3 bucket and include the
 * URI in your request. Or you can include a list of terms directly in your request using
 * the `Phrases` flag.
 *
 * Each language has a character set that contains all allowed characters for that
 * specific language. If you use unsupported characters, your custom vocabulary request
 * fails. Refer to Character Sets for Custom Vocabularies to get the character set for your
 * language.
 *
 * For more information, see Custom
 * vocabularies.
 */
export const createVocabulary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVocabularyRequest,
  output: CreateVocabularyResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
  ],
}));
/**
 * Creates a new custom vocabulary filter.
 *
 * You can use custom vocabulary filters to mask, delete, or flag specific words from
 * your transcript. Custom vocabulary filters are commonly used to mask profanity in
 * transcripts.
 *
 * Each language has a character set that contains all allowed characters for that
 * specific language. If you use unsupported characters, your custom vocabulary filter
 * request fails. Refer to Character Sets for Custom
 * Vocabularies to get the character set for your language.
 *
 * For more information, see Vocabulary
 * filtering.
 */
export const createVocabularyFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateVocabularyFilterRequest,
    output: CreateVocabularyFilterResponse,
    errors: [
      BadRequestException,
      ConflictException,
      InternalFailureException,
      LimitExceededException,
    ],
  }),
);
/**
 * Deletes a Call Analytics category. To use this operation, specify the name of the
 * category you want to delete using `CategoryName`. Category names are case
 * sensitive.
 */
export const deleteCallAnalyticsCategory = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCallAnalyticsCategoryRequest,
    output: DeleteCallAnalyticsCategoryResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      LimitExceededException,
      NotFoundException,
    ],
  }),
);
/**
 * Deletes a Call Analytics job. To use this operation, specify the name of the job you
 * want to delete using `CallAnalyticsJobName`. Job names are case
 * sensitive.
 */
export const deleteCallAnalyticsJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCallAnalyticsJobRequest,
    output: DeleteCallAnalyticsJobResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      LimitExceededException,
    ],
  }),
);
/**
 * Deletes a custom language model. To use this operation, specify the name of the
 * language model you want to delete using `ModelName`. custom language model
 * names are case sensitive.
 */
export const deleteLanguageModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLanguageModelRequest,
  output: DeleteLanguageModelResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
}));
/**
 * Deletes a custom medical vocabulary. To use this operation, specify the name of the
 * custom vocabulary you want to delete using `VocabularyName`. Custom
 * vocabulary names are case sensitive.
 */
export const deleteMedicalVocabulary = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteMedicalVocabularyRequest,
    output: DeleteMedicalVocabularyResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      LimitExceededException,
      NotFoundException,
    ],
  }),
);
/**
 * Provides information about the specified custom medical vocabulary.
 *
 * To view the status of the specified custom medical vocabulary, check the
 * `VocabularyState` field. If the status is `READY`, your custom
 * vocabulary is available to use. If the status is `FAILED`,
 * `FailureReason` provides details on why your vocabulary failed.
 *
 * To get a list of your custom medical vocabularies, use the operation.
 */
export const getMedicalVocabulary = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetMedicalVocabularyRequest,
    output: GetMedicalVocabularyResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      LimitExceededException,
      NotFoundException,
    ],
  }),
);
/**
 * Provides information about the specified custom vocabulary.
 *
 * To view the status of the specified custom vocabulary, check the
 * `VocabularyState` field. If the status is `READY`, your custom
 * vocabulary is available to use. If the status is `FAILED`,
 * `FailureReason` provides details on why your custom vocabulary
 * failed.
 *
 * To get a list of your custom vocabularies, use the operation.
 */
export const getVocabulary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVocabularyRequest,
  output: GetVocabularyResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Provides information about the specified custom vocabulary filter.
 *
 * To get a list of your custom vocabulary filters, use the operation.
 */
export const getVocabularyFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVocabularyFilterRequest,
  output: GetVocabularyFilterResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Provides a list of Call Analytics categories, including all rules that make up each
 * category.
 *
 * To get detailed information about a specific Call Analytics category, use the operation.
 */
export const listCallAnalyticsCategories = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListCallAnalyticsCategoriesRequest,
    output: ListCallAnalyticsCategoriesResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      LimitExceededException,
    ],
  }),
);
/**
 * Provides a list of custom language models that match the specified criteria. If no
 * criteria are specified, all custom language models are returned.
 *
 * To get detailed information about a specific custom language model, use the operation.
 */
export const listLanguageModels = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLanguageModelsRequest,
  output: ListLanguageModelsResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
}));
/**
 * Lists all tags associated with the specified transcription job, vocabulary, model, or
 * resource.
 *
 * To learn more about using tags with Amazon Transcribe, refer to Tagging
 * resources.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Provides a list of custom vocabularies that match the specified criteria. If no
 * criteria are specified, all custom vocabularies are returned.
 *
 * To get detailed information about a specific custom vocabulary, use the operation.
 */
export const listVocabularies = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListVocabulariesRequest,
  output: ListVocabulariesResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
}));
/**
 * Adds one or more custom tags, each in the form of a key:value pair, to the specified
 * resource.
 *
 * To learn more about using tags with Amazon Transcribe, refer to Tagging
 * resources.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Updates the specified Call Analytics category with new rules. Note that the
 * `UpdateCallAnalyticsCategory` operation overwrites all existing rules
 * contained in the specified category. You cannot append additional rules onto an existing
 * category.
 *
 * To create a new category, see .
 */
export const updateCallAnalyticsCategory = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateCallAnalyticsCategoryRequest,
    output: UpdateCallAnalyticsCategoryResponse,
    errors: [
      BadRequestException,
      ConflictException,
      InternalFailureException,
      LimitExceededException,
      NotFoundException,
    ],
  }),
);
/**
 * Updates an existing custom medical vocabulary with new values. This operation
 * overwrites all existing information with your new values; you cannot append new terms
 * onto an existing custom vocabulary.
 */
export const updateMedicalVocabulary = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateMedicalVocabularyRequest,
    output: UpdateMedicalVocabularyResponse,
    errors: [
      BadRequestException,
      ConflictException,
      InternalFailureException,
      LimitExceededException,
      NotFoundException,
    ],
  }),
);
/**
 * Updates an existing custom vocabulary with new values. This operation overwrites all
 * existing information with your new values; you cannot append new terms onto an existing
 * custom vocabulary.
 */
export const updateVocabulary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVocabularyRequest,
  output: UpdateVocabularyResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Updates an existing custom vocabulary filter with a new list of words. The new list
 * you provide overwrites all previous entries; you cannot append new terms onto an
 * existing custom vocabulary filter.
 */
export const updateVocabularyFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateVocabularyFilterRequest,
    output: UpdateVocabularyFilterResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      LimitExceededException,
      NotFoundException,
    ],
  }),
);
/**
 * Creates a new custom language model.
 *
 * When creating a new custom language model, you must specify:
 *
 * - If you want a Wideband (audio sample rates over 16,000 Hz) or Narrowband
 * (audio sample rates under 16,000 Hz) base model
 *
 * - The location of your training and tuning files (this must be an Amazon S3 URI)
 *
 * - The language of your model
 *
 * - A unique name for your model
 */
export const createLanguageModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLanguageModelRequest,
  output: CreateLanguageModelResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
  ],
}));
/**
 * Provides information about the specified custom language model.
 *
 * This operation also shows if the base language model that you used to create your
 * custom language model has been updated. If Amazon Transcribe has updated the base
 * model, you can create a new custom language model using the updated base model.
 *
 * If you tried to create a new custom language model and the request wasn't successful,
 * you can use `DescribeLanguageModel` to help identify the reason for this
 * failure.
 */
export const describeLanguageModel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeLanguageModelRequest,
    output: DescribeLanguageModelResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      LimitExceededException,
      NotFoundException,
    ],
  }),
);
/**
 * Provides information about the specified Call Analytics category.
 *
 * To get a list of your Call Analytics categories, use the operation.
 */
export const getCallAnalyticsCategory = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCallAnalyticsCategoryRequest,
    output: GetCallAnalyticsCategoryResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      LimitExceededException,
      NotFoundException,
    ],
  }),
);
/**
 * Provides a list of Call Analytics jobs that match the specified criteria. If no
 * criteria are specified, all Call Analytics jobs are returned.
 *
 * To get detailed information about a specific Call Analytics job, use the operation.
 */
export const listCallAnalyticsJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListCallAnalyticsJobsRequest,
    output: ListCallAnalyticsJobsResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      LimitExceededException,
    ],
  }),
);
/**
 * Provides a list of Medical Scribe jobs that match the specified criteria. If no
 * criteria are specified, all Medical Scribe jobs are returned.
 *
 * To get detailed information about a specific Medical Scribe job, use the operation.
 */
export const listMedicalScribeJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListMedicalScribeJobsRequest,
    output: ListMedicalScribeJobsResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      LimitExceededException,
    ],
  }),
);
/**
 * Provides a list of medical transcription jobs that match the specified criteria. If no
 * criteria are specified, all medical transcription jobs are returned.
 *
 * To get detailed information about a specific medical transcription job, use the operation.
 */
export const listMedicalTranscriptionJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListMedicalTranscriptionJobsRequest,
    output: ListMedicalTranscriptionJobsResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      LimitExceededException,
    ],
  }));
/**
 * Provides a list of custom medical vocabularies that match the specified criteria. If
 * no criteria are specified, all custom medical vocabularies are returned.
 *
 * To get detailed information about a specific custom medical vocabulary, use the operation.
 */
export const listMedicalVocabularies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListMedicalVocabulariesRequest,
    output: ListMedicalVocabulariesResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      LimitExceededException,
    ],
  }),
);
/**
 * Provides a list of transcription jobs that match the specified criteria. If no
 * criteria are specified, all transcription jobs are returned.
 *
 * To get detailed information about a specific transcription job, use the operation.
 */
export const listTranscriptionJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListTranscriptionJobsRequest,
    output: ListTranscriptionJobsResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      LimitExceededException,
    ],
  }),
);
/**
 * Provides a list of custom vocabulary filters that match the specified criteria. If no
 * criteria are specified, all custom vocabularies are returned.
 *
 * To get detailed information about a specific custom vocabulary filter, use the operation.
 */
export const listVocabularyFilters = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListVocabularyFiltersRequest,
    output: ListVocabularyFiltersResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      LimitExceededException,
    ],
  }),
);
/**
 * Transcribes the audio from a medical dictation or conversation and applies any
 * additional Request Parameters you choose to include in your request.
 *
 * In addition to many standard transcription features, Amazon Transcribe Medical
 * provides you with a robust medical vocabulary and, optionally, content identification,
 * which adds flags to personal health information (PHI). To learn more about these
 * features, refer to How Amazon Transcribe Medical
 * works.
 *
 * To make a `StartMedicalTranscriptionJob` request, you must first upload
 * your media file into an Amazon S3 bucket; you can then specify the Amazon S3 location
 * of the file using the `Media` parameter.
 *
 * You must include the following parameters in your
 * `StartMedicalTranscriptionJob` request:
 *
 * - `region`: The Amazon Web Services Region where you are making your
 * request. For a list of Amazon Web Services Regions supported with Amazon Transcribe, refer to Amazon Transcribe endpoints and
 * quotas.
 *
 * - `MedicalTranscriptionJobName`: A custom name you create for your
 * transcription job that is unique within your Amazon Web Services account.
 *
 * - `Media` (`MediaFileUri`): The Amazon S3 location
 * of your media file.
 *
 * - `LanguageCode`: This must be `en-US`.
 *
 * - `OutputBucketName`: The Amazon S3 bucket where you want
 * your transcript stored. If you want your output stored in a sub-folder of this
 * bucket, you must also include `OutputKey`.
 *
 * - `Specialty`: This must be `PRIMARYCARE`.
 *
 * - `Type`: Choose whether your audio is a conversation or a
 * dictation.
 */
export const startMedicalTranscriptionJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartMedicalTranscriptionJobRequest,
    output: StartMedicalTranscriptionJobResponse,
    errors: [
      BadRequestException,
      ConflictException,
      InternalFailureException,
      LimitExceededException,
    ],
  }));
/**
 * Provides information about the specified Medical Scribe job.
 *
 * To view the status of the specified medical transcription job, check the
 * `MedicalScribeJobStatus` field. If the status is `COMPLETED`,
 * the job is finished. You can find the results at the location specified in
 * `MedicalScribeOutput`.
 * If the status is `FAILED`, `FailureReason` provides details on why your Medical Scribe job
 * failed.
 *
 * To get a list of your Medical Scribe jobs, use the operation.
 */
export const getMedicalScribeJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMedicalScribeJobRequest,
  output: GetMedicalScribeJobResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Provides information about the specified medical transcription job.
 *
 * To view the status of the specified medical transcription job, check the
 * `TranscriptionJobStatus` field. If the status is `COMPLETED`,
 * the job is finished. You can find the results at the location specified in
 * `TranscriptFileUri`. If the status is `FAILED`,
 * `FailureReason` provides details on why your transcription job
 * failed.
 *
 * To get a list of your medical transcription jobs, use the operation.
 */
export const getMedicalTranscriptionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetMedicalTranscriptionJobRequest,
    output: GetMedicalTranscriptionJobResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      LimitExceededException,
      NotFoundException,
    ],
  }),
);
/**
 * Provides information about the specified transcription job.
 *
 * To view the status of the specified transcription job, check the
 * `TranscriptionJobStatus` field. If the status is `COMPLETED`,
 * the job is finished. You can find the results at the location specified in
 * `TranscriptFileUri`. If the status is `FAILED`,
 * `FailureReason` provides details on why your transcription job
 * failed.
 *
 * If you enabled content redaction, the redacted transcript can be found at the location
 * specified in `RedactedTranscriptFileUri`.
 *
 * To get a list of your transcription jobs, use the operation.
 */
export const getTranscriptionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTranscriptionJobRequest,
  output: GetTranscriptionJobResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Transcribes the audio from a customer service call and applies any additional Request
 * Parameters you choose to include in your request.
 *
 * In addition to many standard transcription features, Call Analytics provides you with
 * call characteristics, call summarization, speaker sentiment, and optional redaction of
 * your text transcript and your audio file. You can also apply custom categories to flag
 * specified conditions. To learn more about these features and insights, refer to Analyzing call
 * center audio with Call Analytics.
 *
 * If you want to apply categories to your Call Analytics job, you must create them
 * before submitting your job request. Categories cannot be retroactively applied to a job.
 * To create a new category, use the
 * operation. To learn more about Call Analytics categories, see Creating categories for post-call
 * transcriptions and Creating categories for
 * real-time transcriptions.
 *
 * To make a `StartCallAnalyticsJob` request, you must first upload your media
 * file into an Amazon S3 bucket; you can then specify the Amazon S3
 * location of the file using the `Media` parameter.
 *
 * Job queuing is available for Call Analytics jobs. If you pass a `DataAccessRoleArn`
 * in your request and you exceed your Concurrent Job Limit, your job will automatically be
 * added to a queue to be processed once your concurrent job count is below the limit.
 *
 * You must include the following parameters in your `StartCallAnalyticsJob`
 * request:
 *
 * - `region`: The Amazon Web Services Region where you are making your
 * request. For a list of Amazon Web Services Regions supported with Amazon Transcribe, refer to Amazon Transcribe endpoints and
 * quotas.
 *
 * - `CallAnalyticsJobName`: A custom name that you create for your
 * transcription job that's unique within your Amazon Web Services account.
 *
 * - `Media` (`MediaFileUri` or
 * `RedactedMediaFileUri`): The Amazon S3 location of your
 * media file.
 *
 * With Call Analytics, you can redact the audio contained in your media file by
 * including `RedactedMediaFileUri`, instead of `MediaFileUri`,
 * to specify the location of your input audio. If you choose to redact your audio, you
 * can find your redacted media at the location specified in the
 * `RedactedMediaFileUri` field of your response.
 */
export const startCallAnalyticsJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartCallAnalyticsJobRequest,
    output: StartCallAnalyticsJobResponse,
    errors: [
      BadRequestException,
      ConflictException,
      InternalFailureException,
      LimitExceededException,
    ],
  }),
);
/**
 * Transcribes patient-clinician conversations and generates clinical notes.
 *
 * Amazon Web Services HealthScribe automatically provides rich conversation transcripts, identifies speaker roles,
 * classifies dialogues, extracts medical terms, and generates preliminary clinical notes.
 * To learn more about these features, refer to Amazon Web Services HealthScribe.
 *
 * To make a `StartMedicalScribeJob` request, you must first upload
 * your media file into an Amazon S3 bucket; you can then specify the Amazon S3 location
 * of the file using the `Media` parameter.
 *
 * You must include the following parameters in your
 * `StartMedicalTranscriptionJob` request:
 *
 * - `DataAccessRoleArn`: The ARN of an IAM role with the these minimum permissions: read permission on input file Amazon S3 bucket specified in `Media`,
 * write permission on the Amazon S3 bucket specified in `OutputBucketName`, and full permissions on the KMS key specified in `OutputEncryptionKMSKeyId` (if set).
 * The role should also allow `transcribe.amazonaws.com` to assume it.
 *
 * - `Media` (`MediaFileUri`): The Amazon S3 location
 * of your media file.
 *
 * - `MedicalScribeJobName`: A custom name you create for your
 * MedicalScribe job that is unique within your Amazon Web Services account.
 *
 * - `OutputBucketName`: The Amazon S3 bucket where you want
 * your output files stored.
 *
 * - `Settings`: A `MedicalScribeSettings` object
 * that must set exactly one of `ShowSpeakerLabels` or `ChannelIdentification` to true.
 * If `ShowSpeakerLabels` is true, `MaxSpeakerLabels` must also be set.
 *
 * - `ChannelDefinitions`: A `MedicalScribeChannelDefinitions` array should be set if and only if the `ChannelIdentification`
 * value of `Settings` is set to true.
 */
export const startMedicalScribeJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartMedicalScribeJobRequest,
    output: StartMedicalScribeJobResponse,
    errors: [
      BadRequestException,
      ConflictException,
      InternalFailureException,
      LimitExceededException,
    ],
  }),
);
/**
 * Transcribes the audio from a media file and applies any additional Request Parameters
 * you choose to include in your request.
 *
 * To make a `StartTranscriptionJob` request, you must first upload your media
 * file into an Amazon S3 bucket; you can then specify the Amazon S3
 * location of the file using the `Media` parameter.
 *
 * You must include the following parameters in your `StartTranscriptionJob`
 * request:
 *
 * - `region`: The Amazon Web Services Region where you are making your
 * request. For a list of Amazon Web Services Regions supported with Amazon Transcribe, refer to Amazon Transcribe endpoints and
 * quotas.
 *
 * - `TranscriptionJobName`: A custom name you create for your
 * transcription job that is unique within your Amazon Web Services account.
 *
 * - `Media` (`MediaFileUri`): The Amazon S3 location
 * of your media file.
 *
 * - One of `LanguageCode`, `IdentifyLanguage`, or
 * `IdentifyMultipleLanguages`: If you know the language of your
 * media file, specify it using the `LanguageCode` parameter; you can
 * find all valid language codes in the Supported
 * languages table. If you do not know the languages spoken in your
 * media, use either `IdentifyLanguage` or
 * `IdentifyMultipleLanguages` and let Amazon Transcribe identify
 * the languages for you.
 */
export const startTranscriptionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartTranscriptionJobRequest,
    output: StartTranscriptionJobResponse,
    errors: [
      BadRequestException,
      ConflictException,
      InternalFailureException,
      LimitExceededException,
    ],
  }),
);
/**
 * Creates a new Call Analytics category.
 *
 * All categories are automatically applied to your Call Analytics transcriptions. Note that in
 * order to apply categories to your transcriptions, you must create them before submitting your
 * transcription request, as categories cannot be applied retroactively.
 *
 * When creating a new category, you can use the `InputType` parameter to
 * label the category as a `POST_CALL` or a `REAL_TIME` category.
 * `POST_CALL` categories can only be applied to post-call transcriptions and
 * `REAL_TIME` categories can only be applied to real-time transcriptions. If you
 * do not include `InputType`, your category is created as a
 * `POST_CALL` category by default.
 *
 * Call Analytics categories are composed of rules. For each category, you must create
 * between 1 and 20 rules. Rules can include these parameters: , , , and .
 *
 * To update an existing category, see .
 *
 * To learn more about Call Analytics categories, see Creating categories for post-call
 * transcriptions and Creating categories for
 * real-time transcriptions.
 */
export const createCallAnalyticsCategory = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCallAnalyticsCategoryRequest,
    output: CreateCallAnalyticsCategoryResponse,
    errors: [
      BadRequestException,
      ConflictException,
      InternalFailureException,
      LimitExceededException,
    ],
  }),
);
/**
 * Provides information about the specified Call Analytics job.
 *
 * To view the job's status, refer to `CallAnalyticsJobStatus`. If the status
 * is `COMPLETED`, the job is finished. You can find your completed transcript
 * at the URI specified in `TranscriptFileUri`. If the status is
 * `FAILED`, `FailureReason` provides details on why your
 * transcription job failed.
 *
 * If you enabled personally identifiable information (PII) redaction, the redacted
 * transcript appears at the location specified in
 * `RedactedTranscriptFileUri`.
 *
 * If you chose to redact the audio in your media file, you can find your redacted media
 * file at the location specified in `RedactedMediaFileUri`.
 *
 * To get a list of your Call Analytics jobs, use the operation.
 */
export const getCallAnalyticsJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCallAnalyticsJobRequest,
  output: GetCallAnalyticsJobResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
