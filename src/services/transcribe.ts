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
  sdkId: "Transcribe",
  serviceShapeName: "Transcribe",
});
const auth = T.AwsAuthSigv4({ name: "transcribe" });
const ver = T.ServiceVersion("2017-10-26");
const proto = T.AwsProtocolsAwsJson1_1();
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
              `https://transcribe-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws") {
              return e(`https://fips.transcribe.${Region}.amazonaws.com`);
            }
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://fips.transcribe.${Region}.amazonaws.com`);
            }
            return e(
              `https://transcribe-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://transcribe.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        if (Region === "cn-north-1") {
          return e("https://cn.transcribe.cn-north-1.amazonaws.com.cn");
        }
        if (Region === "cn-northwest-1") {
          return e("https://cn.transcribe.cn-northwest-1.amazonaws.com.cn");
        }
        return e(
          `https://transcribe.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type CategoryName = string;
export type ModelName = string;
export type VocabularyName = string;
export type Uri = string;
export type Phrase = string;
export type DataAccessRoleArn = string;
export type VocabularyFilterName = string;
export type Word = string;
export type CallAnalyticsJobName = string;
export type TranscriptionJobName = string;
export type NextToken = string;
export type MaxResults = number;
export type TranscribeArn = string;
export type KMSKeyId = string;
export type OutputBucketName = string;
export type MedicalMediaSampleRateHertz = number;
export type OutputKey = string;
export type MediaSampleRateHertz = number;
export type TagKey = string;
export type TagValue = string;
export type ChannelId = number;
export type NonEmptyString = string;
export type MaxSpeakers = number;
export type MedicalScribeChannelId = number;
export type MaxAlternatives = number;
export type SubtitleOutputStartIndex = number;
export type FailureReason = string;
export type TimestampMilliseconds = number;
export type IdentifiedLanguageScore = number;
export type Percentage = number;
export type DurationInSeconds = number;

//# Schemas
export type InputType = "REAL_TIME" | "POST_CALL" | (string & {});
export const InputType = S.String;
export type CLMLanguageCode =
  | "en-US"
  | "hi-IN"
  | "es-US"
  | "en-GB"
  | "en-AU"
  | "de-DE"
  | "ja-JP"
  | (string & {});
export const CLMLanguageCode = S.String;
export type BaseModelName = "NarrowBand" | "WideBand" | (string & {});
export const BaseModelName = S.String;
export type LanguageCode =
  | "af-ZA"
  | "ar-AE"
  | "ar-SA"
  | "da-DK"
  | "de-CH"
  | "de-DE"
  | "en-AB"
  | "en-AU"
  | "en-GB"
  | "en-IE"
  | "en-IN"
  | "en-US"
  | "en-WL"
  | "es-ES"
  | "es-US"
  | "fa-IR"
  | "fr-CA"
  | "fr-FR"
  | "he-IL"
  | "hi-IN"
  | "id-ID"
  | "it-IT"
  | "ja-JP"
  | "ko-KR"
  | "ms-MY"
  | "nl-NL"
  | "pt-BR"
  | "pt-PT"
  | "ru-RU"
  | "ta-IN"
  | "te-IN"
  | "tr-TR"
  | "zh-CN"
  | "zh-TW"
  | "th-TH"
  | "en-ZA"
  | "en-NZ"
  | "vi-VN"
  | "sv-SE"
  | "ab-GE"
  | "ast-ES"
  | "az-AZ"
  | "ba-RU"
  | "be-BY"
  | "bg-BG"
  | "bn-IN"
  | "bs-BA"
  | "ca-ES"
  | "ckb-IQ"
  | "ckb-IR"
  | "cs-CZ"
  | "cy-WL"
  | "el-GR"
  | "et-EE"
  | "et-ET"
  | "eu-ES"
  | "fi-FI"
  | "gl-ES"
  | "gu-IN"
  | "ha-NG"
  | "hr-HR"
  | "hu-HU"
  | "hy-AM"
  | "is-IS"
  | "ka-GE"
  | "kab-DZ"
  | "kk-KZ"
  | "kn-IN"
  | "ky-KG"
  | "lg-IN"
  | "lt-LT"
  | "lv-LV"
  | "mhr-RU"
  | "mi-NZ"
  | "mk-MK"
  | "ml-IN"
  | "mn-MN"
  | "mr-IN"
  | "mt-MT"
  | "no-NO"
  | "or-IN"
  | "pa-IN"
  | "pl-PL"
  | "ps-AF"
  | "ro-RO"
  | "rw-RW"
  | "si-LK"
  | "sk-SK"
  | "sl-SI"
  | "so-SO"
  | "sr-RS"
  | "su-ID"
  | "sw-BI"
  | "sw-KE"
  | "sw-RW"
  | "sw-TZ"
  | "sw-UG"
  | "tl-PH"
  | "tt-RU"
  | "ug-CN"
  | "uk-UA"
  | "uz-UZ"
  | "wo-SN"
  | "zh-HK"
  | "zu-ZA"
  | (string & {});
export const LanguageCode = S.String;
export type Phrases = string[];
export const Phrases = S.Array(S.String);
export type Words = string[];
export const Words = S.Array(S.String);
export type CallAnalyticsJobStatus =
  | "QUEUED"
  | "IN_PROGRESS"
  | "FAILED"
  | "COMPLETED"
  | (string & {});
export const CallAnalyticsJobStatus = S.String;
export type ModelStatus =
  | "IN_PROGRESS"
  | "FAILED"
  | "COMPLETED"
  | (string & {});
export const ModelStatus = S.String;
export type MedicalScribeJobStatus =
  | "QUEUED"
  | "IN_PROGRESS"
  | "FAILED"
  | "COMPLETED"
  | (string & {});
export const MedicalScribeJobStatus = S.String;
export type TranscriptionJobStatus =
  | "QUEUED"
  | "IN_PROGRESS"
  | "FAILED"
  | "COMPLETED"
  | (string & {});
export const TranscriptionJobStatus = S.String;
export type VocabularyState = "PENDING" | "READY" | "FAILED" | (string & {});
export const VocabularyState = S.String;
export type MediaFormat =
  | "mp3"
  | "mp4"
  | "wav"
  | "flac"
  | "ogg"
  | "amr"
  | "webm"
  | "m4a"
  | (string & {});
export const MediaFormat = S.String;
export type MedicalContentIdentificationType = "PHI" | (string & {});
export const MedicalContentIdentificationType = S.String;
export type Specialty = "PRIMARYCARE" | (string & {});
export const Specialty = S.String;
export type Type = "CONVERSATION" | "DICTATION" | (string & {});
export const Type = S.String;
export type LanguageOptions = LanguageCode[];
export const LanguageOptions = S.Array(LanguageCode);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateMedicalVocabularyRequest {
  VocabularyName: string;
  LanguageCode: LanguageCode;
  VocabularyFileUri: string;
  Tags?: Tag[];
}
export const CreateMedicalVocabularyRequest = S.suspend(() =>
  S.Struct({
    VocabularyName: S.String.pipe(T.HttpLabel("VocabularyName")),
    LanguageCode: LanguageCode,
    VocabularyFileUri: S.String,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/medicalvocabularies/{VocabularyName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMedicalVocabularyRequest",
}) as any as S.Schema<CreateMedicalVocabularyRequest>;
export interface CreateVocabularyRequest {
  VocabularyName: string;
  LanguageCode: LanguageCode;
  Phrases?: string[];
  VocabularyFileUri?: string;
  Tags?: Tag[];
  DataAccessRoleArn?: string;
}
export const CreateVocabularyRequest = S.suspend(() =>
  S.Struct({
    VocabularyName: S.String.pipe(T.HttpLabel("VocabularyName")),
    LanguageCode: LanguageCode,
    Phrases: S.optional(Phrases),
    VocabularyFileUri: S.optional(S.String),
    Tags: S.optional(TagList),
    DataAccessRoleArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/vocabularies/{VocabularyName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateVocabularyRequest",
}) as any as S.Schema<CreateVocabularyRequest>;
export interface CreateVocabularyFilterRequest {
  VocabularyFilterName: string;
  LanguageCode: LanguageCode;
  Words?: string[];
  VocabularyFilterFileUri?: string;
  Tags?: Tag[];
  DataAccessRoleArn?: string;
}
export const CreateVocabularyFilterRequest = S.suspend(() =>
  S.Struct({
    VocabularyFilterName: S.String.pipe(T.HttpLabel("VocabularyFilterName")),
    LanguageCode: LanguageCode,
    Words: S.optional(Words),
    VocabularyFilterFileUri: S.optional(S.String),
    Tags: S.optional(TagList),
    DataAccessRoleArn: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateVocabularyFilterRequest",
}) as any as S.Schema<CreateVocabularyFilterRequest>;
export interface DeleteCallAnalyticsCategoryRequest {
  CategoryName: string;
}
export const DeleteCallAnalyticsCategoryRequest = S.suspend(() =>
  S.Struct({ CategoryName: S.String.pipe(T.HttpLabel("CategoryName")) }).pipe(
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
  ),
).annotations({
  identifier: "DeleteCallAnalyticsCategoryRequest",
}) as any as S.Schema<DeleteCallAnalyticsCategoryRequest>;
export interface DeleteCallAnalyticsCategoryResponse {}
export const DeleteCallAnalyticsCategoryResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCallAnalyticsCategoryResponse",
}) as any as S.Schema<DeleteCallAnalyticsCategoryResponse>;
export interface DeleteCallAnalyticsJobRequest {
  CallAnalyticsJobName: string;
}
export const DeleteCallAnalyticsJobRequest = S.suspend(() =>
  S.Struct({
    CallAnalyticsJobName: S.String.pipe(T.HttpLabel("CallAnalyticsJobName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteCallAnalyticsJobRequest",
}) as any as S.Schema<DeleteCallAnalyticsJobRequest>;
export interface DeleteCallAnalyticsJobResponse {}
export const DeleteCallAnalyticsJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCallAnalyticsJobResponse",
}) as any as S.Schema<DeleteCallAnalyticsJobResponse>;
export interface DeleteLanguageModelRequest {
  ModelName: string;
}
export const DeleteLanguageModelRequest = S.suspend(() =>
  S.Struct({ ModelName: S.String.pipe(T.HttpLabel("ModelName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/languagemodels/{ModelName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLanguageModelRequest",
}) as any as S.Schema<DeleteLanguageModelRequest>;
export interface DeleteLanguageModelResponse {}
export const DeleteLanguageModelResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteLanguageModelResponse",
}) as any as S.Schema<DeleteLanguageModelResponse>;
export interface DeleteMedicalScribeJobRequest {
  MedicalScribeJobName: string;
}
export const DeleteMedicalScribeJobRequest = S.suspend(() =>
  S.Struct({
    MedicalScribeJobName: S.String.pipe(T.HttpLabel("MedicalScribeJobName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteMedicalScribeJobRequest",
}) as any as S.Schema<DeleteMedicalScribeJobRequest>;
export interface DeleteMedicalScribeJobResponse {}
export const DeleteMedicalScribeJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteMedicalScribeJobResponse",
}) as any as S.Schema<DeleteMedicalScribeJobResponse>;
export interface DeleteMedicalTranscriptionJobRequest {
  MedicalTranscriptionJobName: string;
}
export const DeleteMedicalTranscriptionJobRequest = S.suspend(() =>
  S.Struct({
    MedicalTranscriptionJobName: S.String.pipe(
      T.HttpLabel("MedicalTranscriptionJobName"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteMedicalTranscriptionJobRequest",
}) as any as S.Schema<DeleteMedicalTranscriptionJobRequest>;
export interface DeleteMedicalTranscriptionJobResponse {}
export const DeleteMedicalTranscriptionJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteMedicalTranscriptionJobResponse",
}) as any as S.Schema<DeleteMedicalTranscriptionJobResponse>;
export interface DeleteMedicalVocabularyRequest {
  VocabularyName: string;
}
export const DeleteMedicalVocabularyRequest = S.suspend(() =>
  S.Struct({
    VocabularyName: S.String.pipe(T.HttpLabel("VocabularyName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/medicalvocabularies/{VocabularyName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMedicalVocabularyRequest",
}) as any as S.Schema<DeleteMedicalVocabularyRequest>;
export interface DeleteMedicalVocabularyResponse {}
export const DeleteMedicalVocabularyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteMedicalVocabularyResponse",
}) as any as S.Schema<DeleteMedicalVocabularyResponse>;
export interface DeleteTranscriptionJobRequest {
  TranscriptionJobName: string;
}
export const DeleteTranscriptionJobRequest = S.suspend(() =>
  S.Struct({
    TranscriptionJobName: S.String.pipe(T.HttpLabel("TranscriptionJobName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteTranscriptionJobRequest",
}) as any as S.Schema<DeleteTranscriptionJobRequest>;
export interface DeleteTranscriptionJobResponse {}
export const DeleteTranscriptionJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTranscriptionJobResponse",
}) as any as S.Schema<DeleteTranscriptionJobResponse>;
export interface DeleteVocabularyRequest {
  VocabularyName: string;
}
export const DeleteVocabularyRequest = S.suspend(() =>
  S.Struct({
    VocabularyName: S.String.pipe(T.HttpLabel("VocabularyName")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/vocabularies/{VocabularyName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteVocabularyRequest",
}) as any as S.Schema<DeleteVocabularyRequest>;
export interface DeleteVocabularyResponse {}
export const DeleteVocabularyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteVocabularyResponse",
}) as any as S.Schema<DeleteVocabularyResponse>;
export interface DeleteVocabularyFilterRequest {
  VocabularyFilterName: string;
}
export const DeleteVocabularyFilterRequest = S.suspend(() =>
  S.Struct({
    VocabularyFilterName: S.String.pipe(T.HttpLabel("VocabularyFilterName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteVocabularyFilterRequest",
}) as any as S.Schema<DeleteVocabularyFilterRequest>;
export interface DeleteVocabularyFilterResponse {}
export const DeleteVocabularyFilterResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteVocabularyFilterResponse",
}) as any as S.Schema<DeleteVocabularyFilterResponse>;
export interface DescribeLanguageModelRequest {
  ModelName: string;
}
export const DescribeLanguageModelRequest = S.suspend(() =>
  S.Struct({ ModelName: S.String.pipe(T.HttpLabel("ModelName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/languagemodels/{ModelName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeLanguageModelRequest",
}) as any as S.Schema<DescribeLanguageModelRequest>;
export interface GetCallAnalyticsCategoryRequest {
  CategoryName: string;
}
export const GetCallAnalyticsCategoryRequest = S.suspend(() =>
  S.Struct({ CategoryName: S.String.pipe(T.HttpLabel("CategoryName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/callanalyticscategories/{CategoryName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCallAnalyticsCategoryRequest",
}) as any as S.Schema<GetCallAnalyticsCategoryRequest>;
export interface GetCallAnalyticsJobRequest {
  CallAnalyticsJobName: string;
}
export const GetCallAnalyticsJobRequest = S.suspend(() =>
  S.Struct({
    CallAnalyticsJobName: S.String.pipe(T.HttpLabel("CallAnalyticsJobName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/callanalyticsjobs/{CallAnalyticsJobName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCallAnalyticsJobRequest",
}) as any as S.Schema<GetCallAnalyticsJobRequest>;
export interface GetMedicalScribeJobRequest {
  MedicalScribeJobName: string;
}
export const GetMedicalScribeJobRequest = S.suspend(() =>
  S.Struct({
    MedicalScribeJobName: S.String.pipe(T.HttpLabel("MedicalScribeJobName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/medicalscribejobs/{MedicalScribeJobName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMedicalScribeJobRequest",
}) as any as S.Schema<GetMedicalScribeJobRequest>;
export interface GetMedicalTranscriptionJobRequest {
  MedicalTranscriptionJobName: string;
}
export const GetMedicalTranscriptionJobRequest = S.suspend(() =>
  S.Struct({
    MedicalTranscriptionJobName: S.String.pipe(
      T.HttpLabel("MedicalTranscriptionJobName"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetMedicalTranscriptionJobRequest",
}) as any as S.Schema<GetMedicalTranscriptionJobRequest>;
export interface GetMedicalVocabularyRequest {
  VocabularyName: string;
}
export const GetMedicalVocabularyRequest = S.suspend(() =>
  S.Struct({
    VocabularyName: S.String.pipe(T.HttpLabel("VocabularyName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/medicalvocabularies/{VocabularyName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMedicalVocabularyRequest",
}) as any as S.Schema<GetMedicalVocabularyRequest>;
export interface GetTranscriptionJobRequest {
  TranscriptionJobName: string;
}
export const GetTranscriptionJobRequest = S.suspend(() =>
  S.Struct({
    TranscriptionJobName: S.String.pipe(T.HttpLabel("TranscriptionJobName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/transcriptionjobs/{TranscriptionJobName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTranscriptionJobRequest",
}) as any as S.Schema<GetTranscriptionJobRequest>;
export interface GetVocabularyRequest {
  VocabularyName: string;
}
export const GetVocabularyRequest = S.suspend(() =>
  S.Struct({
    VocabularyName: S.String.pipe(T.HttpLabel("VocabularyName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/vocabularies/{VocabularyName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetVocabularyRequest",
}) as any as S.Schema<GetVocabularyRequest>;
export interface GetVocabularyFilterRequest {
  VocabularyFilterName: string;
}
export const GetVocabularyFilterRequest = S.suspend(() =>
  S.Struct({
    VocabularyFilterName: S.String.pipe(T.HttpLabel("VocabularyFilterName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/vocabularyFilters/{VocabularyFilterName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetVocabularyFilterRequest",
}) as any as S.Schema<GetVocabularyFilterRequest>;
export interface ListCallAnalyticsCategoriesRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListCallAnalyticsCategoriesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/callanalyticscategories" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCallAnalyticsCategoriesRequest",
}) as any as S.Schema<ListCallAnalyticsCategoriesRequest>;
export interface ListCallAnalyticsJobsRequest {
  Status?: CallAnalyticsJobStatus;
  JobNameContains?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListCallAnalyticsJobsRequest = S.suspend(() =>
  S.Struct({
    Status: S.optional(CallAnalyticsJobStatus).pipe(T.HttpQuery("Status")),
    JobNameContains: S.optional(S.String).pipe(T.HttpQuery("JobNameContains")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/callanalyticsjobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCallAnalyticsJobsRequest",
}) as any as S.Schema<ListCallAnalyticsJobsRequest>;
export interface ListLanguageModelsRequest {
  StatusEquals?: ModelStatus;
  NameContains?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListLanguageModelsRequest = S.suspend(() =>
  S.Struct({
    StatusEquals: S.optional(ModelStatus).pipe(
      T.HttpQuery("         StatusEquals"),
    ),
    NameContains: S.optional(S.String).pipe(T.HttpQuery("NameContains")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/languagemodels" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLanguageModelsRequest",
}) as any as S.Schema<ListLanguageModelsRequest>;
export interface ListMedicalScribeJobsRequest {
  Status?: MedicalScribeJobStatus;
  JobNameContains?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListMedicalScribeJobsRequest = S.suspend(() =>
  S.Struct({
    Status: S.optional(MedicalScribeJobStatus).pipe(T.HttpQuery("Status")),
    JobNameContains: S.optional(S.String).pipe(T.HttpQuery("JobNameContains")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/medicalscribejobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMedicalScribeJobsRequest",
}) as any as S.Schema<ListMedicalScribeJobsRequest>;
export interface ListMedicalTranscriptionJobsRequest {
  Status?: TranscriptionJobStatus;
  JobNameContains?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListMedicalTranscriptionJobsRequest = S.suspend(() =>
  S.Struct({
    Status: S.optional(TranscriptionJobStatus).pipe(T.HttpQuery("Status")),
    JobNameContains: S.optional(S.String).pipe(T.HttpQuery("JobNameContains")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/medicaltranscriptionjobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMedicalTranscriptionJobsRequest",
}) as any as S.Schema<ListMedicalTranscriptionJobsRequest>;
export interface ListMedicalVocabulariesRequest {
  NextToken?: string;
  MaxResults?: number;
  StateEquals?: VocabularyState;
  NameContains?: string;
}
export const ListMedicalVocabulariesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    StateEquals: S.optional(VocabularyState).pipe(T.HttpQuery("StateEquals")),
    NameContains: S.optional(S.String).pipe(T.HttpQuery("NameContains")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/medicalvocabularies" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMedicalVocabulariesRequest",
}) as any as S.Schema<ListMedicalVocabulariesRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
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
export interface ListTranscriptionJobsRequest {
  Status?: TranscriptionJobStatus;
  JobNameContains?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListTranscriptionJobsRequest = S.suspend(() =>
  S.Struct({
    Status: S.optional(TranscriptionJobStatus).pipe(T.HttpQuery("Status")),
    JobNameContains: S.optional(S.String).pipe(T.HttpQuery("JobNameContains")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/transcriptionjobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTranscriptionJobsRequest",
}) as any as S.Schema<ListTranscriptionJobsRequest>;
export interface ListVocabulariesRequest {
  NextToken?: string;
  MaxResults?: number;
  StateEquals?: VocabularyState;
  NameContains?: string;
}
export const ListVocabulariesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    StateEquals: S.optional(VocabularyState).pipe(T.HttpQuery("StateEquals")),
    NameContains: S.optional(S.String).pipe(T.HttpQuery("NameContains")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/vocabularies" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVocabulariesRequest",
}) as any as S.Schema<ListVocabulariesRequest>;
export interface ListVocabularyFiltersRequest {
  NextToken?: string;
  MaxResults?: number;
  NameContains?: string;
}
export const ListVocabularyFiltersRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NameContains: S.optional(S.String).pipe(T.HttpQuery("NameContains")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/vocabularyFilters" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVocabularyFiltersRequest",
}) as any as S.Schema<ListVocabularyFiltersRequest>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: TagList,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/tags/{ResourceArn}" }),
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
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
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
export interface AbsoluteTimeRange {
  StartTime?: number;
  EndTime?: number;
  First?: number;
  Last?: number;
}
export const AbsoluteTimeRange = S.suspend(() =>
  S.Struct({
    StartTime: S.optional(S.Number),
    EndTime: S.optional(S.Number),
    First: S.optional(S.Number),
    Last: S.optional(S.Number),
  }),
).annotations({
  identifier: "AbsoluteTimeRange",
}) as any as S.Schema<AbsoluteTimeRange>;
export interface RelativeTimeRange {
  StartPercentage?: number;
  EndPercentage?: number;
  First?: number;
  Last?: number;
}
export const RelativeTimeRange = S.suspend(() =>
  S.Struct({
    StartPercentage: S.optional(S.Number),
    EndPercentage: S.optional(S.Number),
    First: S.optional(S.Number),
    Last: S.optional(S.Number),
  }),
).annotations({
  identifier: "RelativeTimeRange",
}) as any as S.Schema<RelativeTimeRange>;
export interface NonTalkTimeFilter {
  Threshold?: number;
  AbsoluteTimeRange?: AbsoluteTimeRange;
  RelativeTimeRange?: RelativeTimeRange;
  Negate?: boolean;
}
export const NonTalkTimeFilter = S.suspend(() =>
  S.Struct({
    Threshold: S.optional(S.Number),
    AbsoluteTimeRange: S.optional(AbsoluteTimeRange),
    RelativeTimeRange: S.optional(RelativeTimeRange),
    Negate: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "NonTalkTimeFilter",
}) as any as S.Schema<NonTalkTimeFilter>;
export type ParticipantRole = "AGENT" | "CUSTOMER" | (string & {});
export const ParticipantRole = S.String;
export interface InterruptionFilter {
  Threshold?: number;
  ParticipantRole?: ParticipantRole;
  AbsoluteTimeRange?: AbsoluteTimeRange;
  RelativeTimeRange?: RelativeTimeRange;
  Negate?: boolean;
}
export const InterruptionFilter = S.suspend(() =>
  S.Struct({
    Threshold: S.optional(S.Number),
    ParticipantRole: S.optional(ParticipantRole),
    AbsoluteTimeRange: S.optional(AbsoluteTimeRange),
    RelativeTimeRange: S.optional(RelativeTimeRange),
    Negate: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "InterruptionFilter",
}) as any as S.Schema<InterruptionFilter>;
export type TranscriptFilterType = "EXACT" | (string & {});
export const TranscriptFilterType = S.String;
export type StringTargetList = string[];
export const StringTargetList = S.Array(S.String);
export interface TranscriptFilter {
  TranscriptFilterType: TranscriptFilterType;
  AbsoluteTimeRange?: AbsoluteTimeRange;
  RelativeTimeRange?: RelativeTimeRange;
  ParticipantRole?: ParticipantRole;
  Negate?: boolean;
  Targets: string[];
}
export const TranscriptFilter = S.suspend(() =>
  S.Struct({
    TranscriptFilterType: TranscriptFilterType,
    AbsoluteTimeRange: S.optional(AbsoluteTimeRange),
    RelativeTimeRange: S.optional(RelativeTimeRange),
    ParticipantRole: S.optional(ParticipantRole),
    Negate: S.optional(S.Boolean),
    Targets: StringTargetList,
  }),
).annotations({
  identifier: "TranscriptFilter",
}) as any as S.Schema<TranscriptFilter>;
export type SentimentValue =
  | "POSITIVE"
  | "NEGATIVE"
  | "NEUTRAL"
  | "MIXED"
  | (string & {});
export const SentimentValue = S.String;
export type SentimentValueList = SentimentValue[];
export const SentimentValueList = S.Array(SentimentValue);
export interface SentimentFilter {
  Sentiments: SentimentValue[];
  AbsoluteTimeRange?: AbsoluteTimeRange;
  RelativeTimeRange?: RelativeTimeRange;
  ParticipantRole?: ParticipantRole;
  Negate?: boolean;
}
export const SentimentFilter = S.suspend(() =>
  S.Struct({
    Sentiments: SentimentValueList,
    AbsoluteTimeRange: S.optional(AbsoluteTimeRange),
    RelativeTimeRange: S.optional(RelativeTimeRange),
    ParticipantRole: S.optional(ParticipantRole),
    Negate: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SentimentFilter",
}) as any as S.Schema<SentimentFilter>;
export type Rule =
  | {
      NonTalkTimeFilter: NonTalkTimeFilter;
      InterruptionFilter?: never;
      TranscriptFilter?: never;
      SentimentFilter?: never;
    }
  | {
      NonTalkTimeFilter?: never;
      InterruptionFilter: InterruptionFilter;
      TranscriptFilter?: never;
      SentimentFilter?: never;
    }
  | {
      NonTalkTimeFilter?: never;
      InterruptionFilter?: never;
      TranscriptFilter: TranscriptFilter;
      SentimentFilter?: never;
    }
  | {
      NonTalkTimeFilter?: never;
      InterruptionFilter?: never;
      TranscriptFilter?: never;
      SentimentFilter: SentimentFilter;
    };
export const Rule = S.Union(
  S.Struct({ NonTalkTimeFilter: NonTalkTimeFilter }),
  S.Struct({ InterruptionFilter: InterruptionFilter }),
  S.Struct({ TranscriptFilter: TranscriptFilter }),
  S.Struct({ SentimentFilter: SentimentFilter }),
);
export type RuleList = Rule[];
export const RuleList = S.Array(Rule);
export interface UpdateCallAnalyticsCategoryRequest {
  CategoryName: string;
  Rules: Rule[];
  InputType?: InputType;
}
export const UpdateCallAnalyticsCategoryRequest = S.suspend(() =>
  S.Struct({
    CategoryName: S.String.pipe(T.HttpLabel("CategoryName")),
    Rules: RuleList,
    InputType: S.optional(InputType),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/callanalyticscategories/{CategoryName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCallAnalyticsCategoryRequest",
}) as any as S.Schema<UpdateCallAnalyticsCategoryRequest>;
export interface UpdateMedicalVocabularyRequest {
  VocabularyName: string;
  LanguageCode: LanguageCode;
  VocabularyFileUri: string;
}
export const UpdateMedicalVocabularyRequest = S.suspend(() =>
  S.Struct({
    VocabularyName: S.String.pipe(T.HttpLabel("VocabularyName")),
    LanguageCode: LanguageCode,
    VocabularyFileUri: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/medicalvocabularies/{VocabularyName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMedicalVocabularyRequest",
}) as any as S.Schema<UpdateMedicalVocabularyRequest>;
export interface UpdateVocabularyRequest {
  VocabularyName: string;
  LanguageCode: LanguageCode;
  Phrases?: string[];
  VocabularyFileUri?: string;
  DataAccessRoleArn?: string;
}
export const UpdateVocabularyRequest = S.suspend(() =>
  S.Struct({
    VocabularyName: S.String.pipe(T.HttpLabel("VocabularyName")),
    LanguageCode: LanguageCode,
    Phrases: S.optional(Phrases),
    VocabularyFileUri: S.optional(S.String),
    DataAccessRoleArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/vocabularies/{VocabularyName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateVocabularyRequest",
}) as any as S.Schema<UpdateVocabularyRequest>;
export interface UpdateVocabularyFilterRequest {
  VocabularyFilterName: string;
  Words?: string[];
  VocabularyFilterFileUri?: string;
  DataAccessRoleArn?: string;
}
export const UpdateVocabularyFilterRequest = S.suspend(() =>
  S.Struct({
    VocabularyFilterName: S.String.pipe(T.HttpLabel("VocabularyFilterName")),
    Words: S.optional(Words),
    VocabularyFilterFileUri: S.optional(S.String),
    DataAccessRoleArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/vocabularyFilters/{VocabularyFilterName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateVocabularyFilterRequest",
}) as any as S.Schema<UpdateVocabularyFilterRequest>;
export type VocabularyFilterMethod = "remove" | "mask" | "tag" | (string & {});
export const VocabularyFilterMethod = S.String;
export type MedicalScribeParticipantRole =
  | "PATIENT"
  | "CLINICIAN"
  | (string & {});
export const MedicalScribeParticipantRole = S.String;
export type RedactionType = "PII" | (string & {});
export const RedactionType = S.String;
export type RedactionOutput =
  | "redacted"
  | "redacted_and_unredacted"
  | (string & {});
export const RedactionOutput = S.String;
export type PiiEntityType =
  | "BANK_ACCOUNT_NUMBER"
  | "BANK_ROUTING"
  | "CREDIT_DEBIT_NUMBER"
  | "CREDIT_DEBIT_CVV"
  | "CREDIT_DEBIT_EXPIRY"
  | "PIN"
  | "EMAIL"
  | "ADDRESS"
  | "NAME"
  | "PHONE"
  | "SSN"
  | "ALL"
  | (string & {});
export const PiiEntityType = S.String;
export type PiiEntityTypes = PiiEntityType[];
export const PiiEntityTypes = S.Array(PiiEntityType);
export type SubtitleFormat = "vtt" | "srt" | (string & {});
export const SubtitleFormat = S.String;
export type SubtitleFormats = SubtitleFormat[];
export const SubtitleFormats = S.Array(SubtitleFormat);
export type ToxicityCategory = "ALL" | (string & {});
export const ToxicityCategory = S.String;
export type ToxicityCategories = ToxicityCategory[];
export const ToxicityCategories = S.Array(ToxicityCategory);
export interface InputDataConfig {
  S3Uri: string;
  TuningDataS3Uri?: string;
  DataAccessRoleArn: string;
}
export const InputDataConfig = S.suspend(() =>
  S.Struct({
    S3Uri: S.String,
    TuningDataS3Uri: S.optional(S.String),
    DataAccessRoleArn: S.String,
  }),
).annotations({
  identifier: "InputDataConfig",
}) as any as S.Schema<InputDataConfig>;
export interface CategoryProperties {
  CategoryName?: string;
  Rules?: Rule[];
  CreateTime?: Date;
  LastUpdateTime?: Date;
  Tags?: Tag[];
  InputType?: InputType;
}
export const CategoryProperties = S.suspend(() =>
  S.Struct({
    CategoryName: S.optional(S.String),
    Rules: S.optional(RuleList),
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Tags: S.optional(TagList),
    InputType: S.optional(InputType),
  }),
).annotations({
  identifier: "CategoryProperties",
}) as any as S.Schema<CategoryProperties>;
export type CategoryPropertiesList = CategoryProperties[];
export const CategoryPropertiesList = S.Array(CategoryProperties);
export interface LanguageModel {
  ModelName?: string;
  CreateTime?: Date;
  LastModifiedTime?: Date;
  LanguageCode?: CLMLanguageCode;
  BaseModelName?: BaseModelName;
  ModelStatus?: ModelStatus;
  UpgradeAvailability?: boolean;
  FailureReason?: string;
  InputDataConfig?: InputDataConfig;
}
export const LanguageModel = S.suspend(() =>
  S.Struct({
    ModelName: S.optional(S.String),
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LanguageCode: S.optional(CLMLanguageCode),
    BaseModelName: S.optional(BaseModelName),
    ModelStatus: S.optional(ModelStatus),
    UpgradeAvailability: S.optional(S.Boolean),
    FailureReason: S.optional(S.String),
    InputDataConfig: S.optional(InputDataConfig),
  }),
).annotations({
  identifier: "LanguageModel",
}) as any as S.Schema<LanguageModel>;
export type Models = LanguageModel[];
export const Models = S.Array(LanguageModel);
export interface Media {
  MediaFileUri?: string;
  RedactedMediaFileUri?: string;
}
export const Media = S.suspend(() =>
  S.Struct({
    MediaFileUri: S.optional(S.String),
    RedactedMediaFileUri: S.optional(S.String),
  }),
).annotations({ identifier: "Media" }) as any as S.Schema<Media>;
export interface ChannelDefinition {
  ChannelId?: number;
  ParticipantRole?: ParticipantRole;
}
export const ChannelDefinition = S.suspend(() =>
  S.Struct({
    ChannelId: S.optional(S.Number),
    ParticipantRole: S.optional(ParticipantRole),
  }),
).annotations({
  identifier: "ChannelDefinition",
}) as any as S.Schema<ChannelDefinition>;
export type ChannelDefinitions = ChannelDefinition[];
export const ChannelDefinitions = S.Array(ChannelDefinition);
export type KMSEncryptionContextMap = { [key: string]: string | undefined };
export const KMSEncryptionContextMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface MedicalScribeChannelDefinition {
  ChannelId: number;
  ParticipantRole: MedicalScribeParticipantRole;
}
export const MedicalScribeChannelDefinition = S.suspend(() =>
  S.Struct({
    ChannelId: S.Number,
    ParticipantRole: MedicalScribeParticipantRole,
  }),
).annotations({
  identifier: "MedicalScribeChannelDefinition",
}) as any as S.Schema<MedicalScribeChannelDefinition>;
export type MedicalScribeChannelDefinitions = MedicalScribeChannelDefinition[];
export const MedicalScribeChannelDefinitions = S.Array(
  MedicalScribeChannelDefinition,
);
export interface MedicalTranscriptionSetting {
  ShowSpeakerLabels?: boolean;
  MaxSpeakerLabels?: number;
  ChannelIdentification?: boolean;
  ShowAlternatives?: boolean;
  MaxAlternatives?: number;
  VocabularyName?: string;
}
export const MedicalTranscriptionSetting = S.suspend(() =>
  S.Struct({
    ShowSpeakerLabels: S.optional(S.Boolean),
    MaxSpeakerLabels: S.optional(S.Number),
    ChannelIdentification: S.optional(S.Boolean),
    ShowAlternatives: S.optional(S.Boolean),
    MaxAlternatives: S.optional(S.Number),
    VocabularyName: S.optional(S.String),
  }),
).annotations({
  identifier: "MedicalTranscriptionSetting",
}) as any as S.Schema<MedicalTranscriptionSetting>;
export interface Settings {
  VocabularyName?: string;
  ShowSpeakerLabels?: boolean;
  MaxSpeakerLabels?: number;
  ChannelIdentification?: boolean;
  ShowAlternatives?: boolean;
  MaxAlternatives?: number;
  VocabularyFilterName?: string;
  VocabularyFilterMethod?: VocabularyFilterMethod;
}
export const Settings = S.suspend(() =>
  S.Struct({
    VocabularyName: S.optional(S.String),
    ShowSpeakerLabels: S.optional(S.Boolean),
    MaxSpeakerLabels: S.optional(S.Number),
    ChannelIdentification: S.optional(S.Boolean),
    ShowAlternatives: S.optional(S.Boolean),
    MaxAlternatives: S.optional(S.Number),
    VocabularyFilterName: S.optional(S.String),
    VocabularyFilterMethod: S.optional(VocabularyFilterMethod),
  }),
).annotations({ identifier: "Settings" }) as any as S.Schema<Settings>;
export interface ModelSettings {
  LanguageModelName?: string;
}
export const ModelSettings = S.suspend(() =>
  S.Struct({ LanguageModelName: S.optional(S.String) }),
).annotations({
  identifier: "ModelSettings",
}) as any as S.Schema<ModelSettings>;
export interface JobExecutionSettings {
  AllowDeferredExecution?: boolean;
  DataAccessRoleArn?: string;
}
export const JobExecutionSettings = S.suspend(() =>
  S.Struct({
    AllowDeferredExecution: S.optional(S.Boolean),
    DataAccessRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "JobExecutionSettings",
}) as any as S.Schema<JobExecutionSettings>;
export interface ContentRedaction {
  RedactionType: RedactionType;
  RedactionOutput: RedactionOutput;
  PiiEntityTypes?: PiiEntityType[];
}
export const ContentRedaction = S.suspend(() =>
  S.Struct({
    RedactionType: RedactionType,
    RedactionOutput: RedactionOutput,
    PiiEntityTypes: S.optional(PiiEntityTypes),
  }),
).annotations({
  identifier: "ContentRedaction",
}) as any as S.Schema<ContentRedaction>;
export interface Subtitles {
  Formats?: SubtitleFormat[];
  OutputStartIndex?: number;
}
export const Subtitles = S.suspend(() =>
  S.Struct({
    Formats: S.optional(SubtitleFormats),
    OutputStartIndex: S.optional(S.Number),
  }),
).annotations({ identifier: "Subtitles" }) as any as S.Schema<Subtitles>;
export interface ToxicityDetectionSettings {
  ToxicityCategories: ToxicityCategory[];
}
export const ToxicityDetectionSettings = S.suspend(() =>
  S.Struct({ ToxicityCategories: ToxicityCategories }),
).annotations({
  identifier: "ToxicityDetectionSettings",
}) as any as S.Schema<ToxicityDetectionSettings>;
export type ToxicityDetection = ToxicityDetectionSettings[];
export const ToxicityDetection = S.Array(ToxicityDetectionSettings);
export type MedicalScribeNoteTemplate =
  | "HISTORY_AND_PHYSICAL"
  | "GIRPP"
  | "BIRP"
  | "SIRP"
  | "DAP"
  | "BEHAVIORAL_SOAP"
  | "PHYSICAL_SOAP"
  | (string & {});
export const MedicalScribeNoteTemplate = S.String;
export type Pronouns = "HE_HIM" | "SHE_HER" | "THEY_THEM" | (string & {});
export const Pronouns = S.String;
export interface CreateLanguageModelRequest {
  LanguageCode: CLMLanguageCode;
  BaseModelName: BaseModelName;
  ModelName: string;
  InputDataConfig: InputDataConfig;
  Tags?: Tag[];
}
export const CreateLanguageModelRequest = S.suspend(() =>
  S.Struct({
    LanguageCode: CLMLanguageCode,
    BaseModelName: BaseModelName,
    ModelName: S.String.pipe(T.HttpLabel("ModelName")),
    InputDataConfig: InputDataConfig,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/languagemodels/{ModelName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLanguageModelRequest",
}) as any as S.Schema<CreateLanguageModelRequest>;
export interface CreateMedicalVocabularyResponse {
  VocabularyName?: string;
  LanguageCode?: LanguageCode;
  VocabularyState?: VocabularyState;
  LastModifiedTime?: Date;
  FailureReason?: string;
}
export const CreateMedicalVocabularyResponse = S.suspend(() =>
  S.Struct({
    VocabularyName: S.optional(S.String),
    LanguageCode: S.optional(LanguageCode),
    VocabularyState: S.optional(VocabularyState),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    FailureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateMedicalVocabularyResponse",
}) as any as S.Schema<CreateMedicalVocabularyResponse>;
export interface CreateVocabularyResponse {
  VocabularyName?: string;
  LanguageCode?: LanguageCode;
  VocabularyState?: VocabularyState;
  LastModifiedTime?: Date;
  FailureReason?: string;
}
export const CreateVocabularyResponse = S.suspend(() =>
  S.Struct({
    VocabularyName: S.optional(S.String),
    LanguageCode: S.optional(LanguageCode),
    VocabularyState: S.optional(VocabularyState),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    FailureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateVocabularyResponse",
}) as any as S.Schema<CreateVocabularyResponse>;
export interface CreateVocabularyFilterResponse {
  VocabularyFilterName?: string;
  LanguageCode?: LanguageCode;
  LastModifiedTime?: Date;
}
export const CreateVocabularyFilterResponse = S.suspend(() =>
  S.Struct({
    VocabularyFilterName: S.optional(S.String),
    LanguageCode: S.optional(LanguageCode),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "CreateVocabularyFilterResponse",
}) as any as S.Schema<CreateVocabularyFilterResponse>;
export interface GetMedicalVocabularyResponse {
  VocabularyName?: string;
  LanguageCode?: LanguageCode;
  VocabularyState?: VocabularyState;
  LastModifiedTime?: Date;
  FailureReason?: string;
  DownloadUri?: string;
}
export const GetMedicalVocabularyResponse = S.suspend(() =>
  S.Struct({
    VocabularyName: S.optional(S.String),
    LanguageCode: S.optional(LanguageCode),
    VocabularyState: S.optional(VocabularyState),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    FailureReason: S.optional(S.String),
    DownloadUri: S.optional(S.String),
  }),
).annotations({
  identifier: "GetMedicalVocabularyResponse",
}) as any as S.Schema<GetMedicalVocabularyResponse>;
export interface GetVocabularyResponse {
  VocabularyName?: string;
  LanguageCode?: LanguageCode;
  VocabularyState?: VocabularyState;
  LastModifiedTime?: Date;
  FailureReason?: string;
  DownloadUri?: string;
}
export const GetVocabularyResponse = S.suspend(() =>
  S.Struct({
    VocabularyName: S.optional(S.String),
    LanguageCode: S.optional(LanguageCode),
    VocabularyState: S.optional(VocabularyState),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    FailureReason: S.optional(S.String),
    DownloadUri: S.optional(S.String),
  }),
).annotations({
  identifier: "GetVocabularyResponse",
}) as any as S.Schema<GetVocabularyResponse>;
export interface GetVocabularyFilterResponse {
  VocabularyFilterName?: string;
  LanguageCode?: LanguageCode;
  LastModifiedTime?: Date;
  DownloadUri?: string;
}
export const GetVocabularyFilterResponse = S.suspend(() =>
  S.Struct({
    VocabularyFilterName: S.optional(S.String),
    LanguageCode: S.optional(LanguageCode),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    DownloadUri: S.optional(S.String),
  }),
).annotations({
  identifier: "GetVocabularyFilterResponse",
}) as any as S.Schema<GetVocabularyFilterResponse>;
export interface ListCallAnalyticsCategoriesResponse {
  NextToken?: string;
  Categories?: CategoryProperties[];
}
export const ListCallAnalyticsCategoriesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Categories: S.optional(CategoryPropertiesList),
  }),
).annotations({
  identifier: "ListCallAnalyticsCategoriesResponse",
}) as any as S.Schema<ListCallAnalyticsCategoriesResponse>;
export interface ListLanguageModelsResponse {
  NextToken?: string;
  Models?: LanguageModel[];
}
export const ListLanguageModelsResponse = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String), Models: S.optional(Models) }),
).annotations({
  identifier: "ListLanguageModelsResponse",
}) as any as S.Schema<ListLanguageModelsResponse>;
export interface ListTagsForResourceResponse {
  ResourceArn?: string;
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ ResourceArn: S.optional(S.String), Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface VocabularyInfo {
  VocabularyName?: string;
  LanguageCode?: LanguageCode;
  LastModifiedTime?: Date;
  VocabularyState?: VocabularyState;
}
export const VocabularyInfo = S.suspend(() =>
  S.Struct({
    VocabularyName: S.optional(S.String),
    LanguageCode: S.optional(LanguageCode),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    VocabularyState: S.optional(VocabularyState),
  }),
).annotations({
  identifier: "VocabularyInfo",
}) as any as S.Schema<VocabularyInfo>;
export type Vocabularies = VocabularyInfo[];
export const Vocabularies = S.Array(VocabularyInfo);
export interface ListVocabulariesResponse {
  Status?: VocabularyState;
  NextToken?: string;
  Vocabularies?: VocabularyInfo[];
}
export const ListVocabulariesResponse = S.suspend(() =>
  S.Struct({
    Status: S.optional(VocabularyState),
    NextToken: S.optional(S.String),
    Vocabularies: S.optional(Vocabularies),
  }),
).annotations({
  identifier: "ListVocabulariesResponse",
}) as any as S.Schema<ListVocabulariesResponse>;
export interface StartMedicalTranscriptionJobRequest {
  MedicalTranscriptionJobName: string;
  LanguageCode: LanguageCode;
  MediaSampleRateHertz?: number;
  MediaFormat?: MediaFormat;
  Media: Media;
  OutputBucketName: string;
  OutputKey?: string;
  OutputEncryptionKMSKeyId?: string;
  KMSEncryptionContext?: { [key: string]: string | undefined };
  Settings?: MedicalTranscriptionSetting;
  ContentIdentificationType?: MedicalContentIdentificationType;
  Specialty: Specialty;
  Type: Type;
  Tags?: Tag[];
}
export const StartMedicalTranscriptionJobRequest = S.suspend(() =>
  S.Struct({
    MedicalTranscriptionJobName: S.String.pipe(
      T.HttpLabel("MedicalTranscriptionJobName"),
    ),
    LanguageCode: LanguageCode,
    MediaSampleRateHertz: S.optional(S.Number),
    MediaFormat: S.optional(MediaFormat),
    Media: Media,
    OutputBucketName: S.String,
    OutputKey: S.optional(S.String),
    OutputEncryptionKMSKeyId: S.optional(S.String),
    KMSEncryptionContext: S.optional(KMSEncryptionContextMap),
    Settings: S.optional(MedicalTranscriptionSetting),
    ContentIdentificationType: S.optional(MedicalContentIdentificationType),
    Specialty: Specialty,
    Type: Type,
    Tags: S.optional(TagList),
  }).pipe(
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
  ),
).annotations({
  identifier: "StartMedicalTranscriptionJobRequest",
}) as any as S.Schema<StartMedicalTranscriptionJobRequest>;
export interface UpdateCallAnalyticsCategoryResponse {
  CategoryProperties?: CategoryProperties;
}
export const UpdateCallAnalyticsCategoryResponse = S.suspend(() =>
  S.Struct({ CategoryProperties: S.optional(CategoryProperties) }),
).annotations({
  identifier: "UpdateCallAnalyticsCategoryResponse",
}) as any as S.Schema<UpdateCallAnalyticsCategoryResponse>;
export interface UpdateMedicalVocabularyResponse {
  VocabularyName?: string;
  LanguageCode?: LanguageCode;
  LastModifiedTime?: Date;
  VocabularyState?: VocabularyState;
}
export const UpdateMedicalVocabularyResponse = S.suspend(() =>
  S.Struct({
    VocabularyName: S.optional(S.String),
    LanguageCode: S.optional(LanguageCode),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    VocabularyState: S.optional(VocabularyState),
  }),
).annotations({
  identifier: "UpdateMedicalVocabularyResponse",
}) as any as S.Schema<UpdateMedicalVocabularyResponse>;
export interface UpdateVocabularyResponse {
  VocabularyName?: string;
  LanguageCode?: LanguageCode;
  LastModifiedTime?: Date;
  VocabularyState?: VocabularyState;
}
export const UpdateVocabularyResponse = S.suspend(() =>
  S.Struct({
    VocabularyName: S.optional(S.String),
    LanguageCode: S.optional(LanguageCode),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    VocabularyState: S.optional(VocabularyState),
  }),
).annotations({
  identifier: "UpdateVocabularyResponse",
}) as any as S.Schema<UpdateVocabularyResponse>;
export interface UpdateVocabularyFilterResponse {
  VocabularyFilterName?: string;
  LanguageCode?: LanguageCode;
  LastModifiedTime?: Date;
}
export const UpdateVocabularyFilterResponse = S.suspend(() =>
  S.Struct({
    VocabularyFilterName: S.optional(S.String),
    LanguageCode: S.optional(LanguageCode),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "UpdateVocabularyFilterResponse",
}) as any as S.Schema<UpdateVocabularyFilterResponse>;
export type MedicalScribeLanguageCode = "en-US" | (string & {});
export const MedicalScribeLanguageCode = S.String;
export type OutputLocationType =
  | "CUSTOMER_BUCKET"
  | "SERVICE_BUCKET"
  | (string & {});
export const OutputLocationType = S.String;
export interface Summarization {
  GenerateAbstractiveSummary: boolean;
}
export const Summarization = S.suspend(() =>
  S.Struct({ GenerateAbstractiveSummary: S.Boolean }),
).annotations({
  identifier: "Summarization",
}) as any as S.Schema<Summarization>;
export interface ClinicalNoteGenerationSettings {
  NoteTemplate?: MedicalScribeNoteTemplate;
}
export const ClinicalNoteGenerationSettings = S.suspend(() =>
  S.Struct({ NoteTemplate: S.optional(MedicalScribeNoteTemplate) }),
).annotations({
  identifier: "ClinicalNoteGenerationSettings",
}) as any as S.Schema<ClinicalNoteGenerationSettings>;
export interface MedicalScribePatientContext {
  Pronouns?: Pronouns;
}
export const MedicalScribePatientContext = S.suspend(() =>
  S.Struct({ Pronouns: S.optional(Pronouns) }),
).annotations({
  identifier: "MedicalScribePatientContext",
}) as any as S.Schema<MedicalScribePatientContext>;
export interface LanguageIdSettings {
  VocabularyName?: string;
  VocabularyFilterName?: string;
  LanguageModelName?: string;
}
export const LanguageIdSettings = S.suspend(() =>
  S.Struct({
    VocabularyName: S.optional(S.String),
    VocabularyFilterName: S.optional(S.String),
    LanguageModelName: S.optional(S.String),
  }),
).annotations({
  identifier: "LanguageIdSettings",
}) as any as S.Schema<LanguageIdSettings>;
export type CallAnalyticsFeature = "GENERATIVE_SUMMARIZATION" | (string & {});
export const CallAnalyticsFeature = S.String;
export type CallAnalyticsSkippedReasonCode =
  | "INSUFFICIENT_CONVERSATION_CONTENT"
  | "FAILED_SAFETY_GUIDELINES"
  | (string & {});
export const CallAnalyticsSkippedReasonCode = S.String;
export interface CallAnalyticsSkippedFeature {
  Feature?: CallAnalyticsFeature;
  ReasonCode?: CallAnalyticsSkippedReasonCode;
  Message?: string;
}
export const CallAnalyticsSkippedFeature = S.suspend(() =>
  S.Struct({
    Feature: S.optional(CallAnalyticsFeature),
    ReasonCode: S.optional(CallAnalyticsSkippedReasonCode),
    Message: S.optional(S.String),
  }),
).annotations({
  identifier: "CallAnalyticsSkippedFeature",
}) as any as S.Schema<CallAnalyticsSkippedFeature>;
export type CallAnalyticsSkippedFeatureList = CallAnalyticsSkippedFeature[];
export const CallAnalyticsSkippedFeatureList = S.Array(
  CallAnalyticsSkippedFeature,
);
export interface CallAnalyticsJobDetails {
  Skipped?: CallAnalyticsSkippedFeature[];
}
export const CallAnalyticsJobDetails = S.suspend(() =>
  S.Struct({ Skipped: S.optional(CallAnalyticsSkippedFeatureList) }),
).annotations({
  identifier: "CallAnalyticsJobDetails",
}) as any as S.Schema<CallAnalyticsJobDetails>;
export interface CallAnalyticsJobSummary {
  CallAnalyticsJobName?: string;
  CreationTime?: Date;
  StartTime?: Date;
  CompletionTime?: Date;
  LanguageCode?: LanguageCode;
  CallAnalyticsJobStatus?: CallAnalyticsJobStatus;
  CallAnalyticsJobDetails?: CallAnalyticsJobDetails;
  FailureReason?: string;
}
export const CallAnalyticsJobSummary = S.suspend(() =>
  S.Struct({
    CallAnalyticsJobName: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LanguageCode: S.optional(LanguageCode),
    CallAnalyticsJobStatus: S.optional(CallAnalyticsJobStatus),
    CallAnalyticsJobDetails: S.optional(CallAnalyticsJobDetails),
    FailureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "CallAnalyticsJobSummary",
}) as any as S.Schema<CallAnalyticsJobSummary>;
export type CallAnalyticsJobSummaries = CallAnalyticsJobSummary[];
export const CallAnalyticsJobSummaries = S.Array(CallAnalyticsJobSummary);
export interface MedicalScribeJobSummary {
  MedicalScribeJobName?: string;
  CreationTime?: Date;
  StartTime?: Date;
  CompletionTime?: Date;
  LanguageCode?: MedicalScribeLanguageCode;
  MedicalScribeJobStatus?: MedicalScribeJobStatus;
  FailureReason?: string;
}
export const MedicalScribeJobSummary = S.suspend(() =>
  S.Struct({
    MedicalScribeJobName: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LanguageCode: S.optional(MedicalScribeLanguageCode),
    MedicalScribeJobStatus: S.optional(MedicalScribeJobStatus),
    FailureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "MedicalScribeJobSummary",
}) as any as S.Schema<MedicalScribeJobSummary>;
export type MedicalScribeJobSummaries = MedicalScribeJobSummary[];
export const MedicalScribeJobSummaries = S.Array(MedicalScribeJobSummary);
export interface MedicalTranscriptionJobSummary {
  MedicalTranscriptionJobName?: string;
  CreationTime?: Date;
  StartTime?: Date;
  CompletionTime?: Date;
  LanguageCode?: LanguageCode;
  TranscriptionJobStatus?: TranscriptionJobStatus;
  FailureReason?: string;
  OutputLocationType?: OutputLocationType;
  Specialty?: Specialty;
  ContentIdentificationType?: MedicalContentIdentificationType;
  Type?: Type;
}
export const MedicalTranscriptionJobSummary = S.suspend(() =>
  S.Struct({
    MedicalTranscriptionJobName: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LanguageCode: S.optional(LanguageCode),
    TranscriptionJobStatus: S.optional(TranscriptionJobStatus),
    FailureReason: S.optional(S.String),
    OutputLocationType: S.optional(OutputLocationType),
    Specialty: S.optional(Specialty),
    ContentIdentificationType: S.optional(MedicalContentIdentificationType),
    Type: S.optional(Type),
  }),
).annotations({
  identifier: "MedicalTranscriptionJobSummary",
}) as any as S.Schema<MedicalTranscriptionJobSummary>;
export type MedicalTranscriptionJobSummaries = MedicalTranscriptionJobSummary[];
export const MedicalTranscriptionJobSummaries = S.Array(
  MedicalTranscriptionJobSummary,
);
export interface LanguageCodeItem {
  LanguageCode?: LanguageCode;
  DurationInSeconds?: number;
}
export const LanguageCodeItem = S.suspend(() =>
  S.Struct({
    LanguageCode: S.optional(LanguageCode),
    DurationInSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "LanguageCodeItem",
}) as any as S.Schema<LanguageCodeItem>;
export type LanguageCodeList = LanguageCodeItem[];
export const LanguageCodeList = S.Array(LanguageCodeItem);
export interface TranscriptionJobSummary {
  TranscriptionJobName?: string;
  CreationTime?: Date;
  StartTime?: Date;
  CompletionTime?: Date;
  LanguageCode?: LanguageCode;
  TranscriptionJobStatus?: TranscriptionJobStatus;
  FailureReason?: string;
  OutputLocationType?: OutputLocationType;
  ContentRedaction?: ContentRedaction;
  ModelSettings?: ModelSettings;
  IdentifyLanguage?: boolean;
  IdentifyMultipleLanguages?: boolean;
  IdentifiedLanguageScore?: number;
  LanguageCodes?: LanguageCodeItem[];
  ToxicityDetection?: ToxicityDetectionSettings[];
}
export const TranscriptionJobSummary = S.suspend(() =>
  S.Struct({
    TranscriptionJobName: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LanguageCode: S.optional(LanguageCode),
    TranscriptionJobStatus: S.optional(TranscriptionJobStatus),
    FailureReason: S.optional(S.String),
    OutputLocationType: S.optional(OutputLocationType),
    ContentRedaction: S.optional(ContentRedaction),
    ModelSettings: S.optional(ModelSettings),
    IdentifyLanguage: S.optional(S.Boolean),
    IdentifyMultipleLanguages: S.optional(S.Boolean),
    IdentifiedLanguageScore: S.optional(S.Number),
    LanguageCodes: S.optional(LanguageCodeList),
    ToxicityDetection: S.optional(ToxicityDetection),
  }),
).annotations({
  identifier: "TranscriptionJobSummary",
}) as any as S.Schema<TranscriptionJobSummary>;
export type TranscriptionJobSummaries = TranscriptionJobSummary[];
export const TranscriptionJobSummaries = S.Array(TranscriptionJobSummary);
export interface VocabularyFilterInfo {
  VocabularyFilterName?: string;
  LanguageCode?: LanguageCode;
  LastModifiedTime?: Date;
}
export const VocabularyFilterInfo = S.suspend(() =>
  S.Struct({
    VocabularyFilterName: S.optional(S.String),
    LanguageCode: S.optional(LanguageCode),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "VocabularyFilterInfo",
}) as any as S.Schema<VocabularyFilterInfo>;
export type VocabularyFilters = VocabularyFilterInfo[];
export const VocabularyFilters = S.Array(VocabularyFilterInfo);
export type LanguageIdSettingsMap = {
  [key in LanguageCode]?: LanguageIdSettings;
};
export const LanguageIdSettingsMap = S.partial(
  S.Record({ key: LanguageCode, value: S.UndefinedOr(LanguageIdSettings) }),
);
export interface CallAnalyticsJobSettings {
  VocabularyName?: string;
  VocabularyFilterName?: string;
  VocabularyFilterMethod?: VocabularyFilterMethod;
  LanguageModelName?: string;
  ContentRedaction?: ContentRedaction;
  LanguageOptions?: LanguageCode[];
  LanguageIdSettings?: { [key: string]: LanguageIdSettings | undefined };
  Summarization?: Summarization;
}
export const CallAnalyticsJobSettings = S.suspend(() =>
  S.Struct({
    VocabularyName: S.optional(S.String),
    VocabularyFilterName: S.optional(S.String),
    VocabularyFilterMethod: S.optional(VocabularyFilterMethod),
    LanguageModelName: S.optional(S.String),
    ContentRedaction: S.optional(ContentRedaction),
    LanguageOptions: S.optional(LanguageOptions),
    LanguageIdSettings: S.optional(LanguageIdSettingsMap),
    Summarization: S.optional(Summarization),
  }),
).annotations({
  identifier: "CallAnalyticsJobSettings",
}) as any as S.Schema<CallAnalyticsJobSettings>;
export interface MedicalScribeSettings {
  ShowSpeakerLabels?: boolean;
  MaxSpeakerLabels?: number;
  ChannelIdentification?: boolean;
  VocabularyName?: string;
  VocabularyFilterName?: string;
  VocabularyFilterMethod?: VocabularyFilterMethod;
  ClinicalNoteGenerationSettings?: ClinicalNoteGenerationSettings;
}
export const MedicalScribeSettings = S.suspend(() =>
  S.Struct({
    ShowSpeakerLabels: S.optional(S.Boolean),
    MaxSpeakerLabels: S.optional(S.Number),
    ChannelIdentification: S.optional(S.Boolean),
    VocabularyName: S.optional(S.String),
    VocabularyFilterName: S.optional(S.String),
    VocabularyFilterMethod: S.optional(VocabularyFilterMethod),
    ClinicalNoteGenerationSettings: S.optional(ClinicalNoteGenerationSettings),
  }),
).annotations({
  identifier: "MedicalScribeSettings",
}) as any as S.Schema<MedicalScribeSettings>;
export interface MedicalScribeContext {
  PatientContext?: MedicalScribePatientContext;
}
export const MedicalScribeContext = S.suspend(() =>
  S.Struct({ PatientContext: S.optional(MedicalScribePatientContext) }),
).annotations({
  identifier: "MedicalScribeContext",
}) as any as S.Schema<MedicalScribeContext>;
export type SubtitleFileUris = string[];
export const SubtitleFileUris = S.Array(S.String);
export interface CreateLanguageModelResponse {
  LanguageCode?: CLMLanguageCode;
  BaseModelName?: BaseModelName;
  ModelName?: string;
  InputDataConfig?: InputDataConfig;
  ModelStatus?: ModelStatus;
}
export const CreateLanguageModelResponse = S.suspend(() =>
  S.Struct({
    LanguageCode: S.optional(CLMLanguageCode),
    BaseModelName: S.optional(BaseModelName),
    ModelName: S.optional(S.String),
    InputDataConfig: S.optional(InputDataConfig),
    ModelStatus: S.optional(ModelStatus),
  }),
).annotations({
  identifier: "CreateLanguageModelResponse",
}) as any as S.Schema<CreateLanguageModelResponse>;
export interface DescribeLanguageModelResponse {
  LanguageModel?: LanguageModel;
}
export const DescribeLanguageModelResponse = S.suspend(() =>
  S.Struct({ LanguageModel: S.optional(LanguageModel) }),
).annotations({
  identifier: "DescribeLanguageModelResponse",
}) as any as S.Schema<DescribeLanguageModelResponse>;
export interface GetCallAnalyticsCategoryResponse {
  CategoryProperties?: CategoryProperties;
}
export const GetCallAnalyticsCategoryResponse = S.suspend(() =>
  S.Struct({ CategoryProperties: S.optional(CategoryProperties) }),
).annotations({
  identifier: "GetCallAnalyticsCategoryResponse",
}) as any as S.Schema<GetCallAnalyticsCategoryResponse>;
export interface ListCallAnalyticsJobsResponse {
  Status?: CallAnalyticsJobStatus;
  NextToken?: string;
  CallAnalyticsJobSummaries?: CallAnalyticsJobSummary[];
}
export const ListCallAnalyticsJobsResponse = S.suspend(() =>
  S.Struct({
    Status: S.optional(CallAnalyticsJobStatus),
    NextToken: S.optional(S.String),
    CallAnalyticsJobSummaries: S.optional(CallAnalyticsJobSummaries),
  }),
).annotations({
  identifier: "ListCallAnalyticsJobsResponse",
}) as any as S.Schema<ListCallAnalyticsJobsResponse>;
export interface ListMedicalScribeJobsResponse {
  Status?: MedicalScribeJobStatus;
  NextToken?: string;
  MedicalScribeJobSummaries?: MedicalScribeJobSummary[];
}
export const ListMedicalScribeJobsResponse = S.suspend(() =>
  S.Struct({
    Status: S.optional(MedicalScribeJobStatus),
    NextToken: S.optional(S.String),
    MedicalScribeJobSummaries: S.optional(MedicalScribeJobSummaries),
  }),
).annotations({
  identifier: "ListMedicalScribeJobsResponse",
}) as any as S.Schema<ListMedicalScribeJobsResponse>;
export interface ListMedicalTranscriptionJobsResponse {
  Status?: TranscriptionJobStatus;
  NextToken?: string;
  MedicalTranscriptionJobSummaries?: MedicalTranscriptionJobSummary[];
}
export const ListMedicalTranscriptionJobsResponse = S.suspend(() =>
  S.Struct({
    Status: S.optional(TranscriptionJobStatus),
    NextToken: S.optional(S.String),
    MedicalTranscriptionJobSummaries: S.optional(
      MedicalTranscriptionJobSummaries,
    ),
  }),
).annotations({
  identifier: "ListMedicalTranscriptionJobsResponse",
}) as any as S.Schema<ListMedicalTranscriptionJobsResponse>;
export interface ListMedicalVocabulariesResponse {
  Status?: VocabularyState;
  NextToken?: string;
  Vocabularies?: VocabularyInfo[];
}
export const ListMedicalVocabulariesResponse = S.suspend(() =>
  S.Struct({
    Status: S.optional(VocabularyState),
    NextToken: S.optional(S.String),
    Vocabularies: S.optional(Vocabularies),
  }),
).annotations({
  identifier: "ListMedicalVocabulariesResponse",
}) as any as S.Schema<ListMedicalVocabulariesResponse>;
export interface ListTranscriptionJobsResponse {
  Status?: TranscriptionJobStatus;
  NextToken?: string;
  TranscriptionJobSummaries?: TranscriptionJobSummary[];
}
export const ListTranscriptionJobsResponse = S.suspend(() =>
  S.Struct({
    Status: S.optional(TranscriptionJobStatus),
    NextToken: S.optional(S.String),
    TranscriptionJobSummaries: S.optional(TranscriptionJobSummaries),
  }),
).annotations({
  identifier: "ListTranscriptionJobsResponse",
}) as any as S.Schema<ListTranscriptionJobsResponse>;
export interface ListVocabularyFiltersResponse {
  NextToken?: string;
  VocabularyFilters?: VocabularyFilterInfo[];
}
export const ListVocabularyFiltersResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    VocabularyFilters: S.optional(VocabularyFilters),
  }),
).annotations({
  identifier: "ListVocabularyFiltersResponse",
}) as any as S.Schema<ListVocabularyFiltersResponse>;
export interface StartCallAnalyticsJobRequest {
  CallAnalyticsJobName: string;
  Media: Media;
  OutputLocation?: string;
  OutputEncryptionKMSKeyId?: string;
  DataAccessRoleArn?: string;
  Settings?: CallAnalyticsJobSettings;
  Tags?: Tag[];
  ChannelDefinitions?: ChannelDefinition[];
}
export const StartCallAnalyticsJobRequest = S.suspend(() =>
  S.Struct({
    CallAnalyticsJobName: S.String.pipe(T.HttpLabel("CallAnalyticsJobName")),
    Media: Media,
    OutputLocation: S.optional(S.String),
    OutputEncryptionKMSKeyId: S.optional(S.String),
    DataAccessRoleArn: S.optional(S.String),
    Settings: S.optional(CallAnalyticsJobSettings),
    Tags: S.optional(TagList),
    ChannelDefinitions: S.optional(ChannelDefinitions),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/callanalyticsjobs/{CallAnalyticsJobName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartCallAnalyticsJobRequest",
}) as any as S.Schema<StartCallAnalyticsJobRequest>;
export interface StartMedicalScribeJobRequest {
  MedicalScribeJobName: string;
  Media: Media;
  OutputBucketName: string;
  OutputEncryptionKMSKeyId?: string;
  KMSEncryptionContext?: { [key: string]: string | undefined };
  DataAccessRoleArn: string;
  Settings: MedicalScribeSettings;
  ChannelDefinitions?: MedicalScribeChannelDefinition[];
  Tags?: Tag[];
  MedicalScribeContext?: MedicalScribeContext;
}
export const StartMedicalScribeJobRequest = S.suspend(() =>
  S.Struct({
    MedicalScribeJobName: S.String.pipe(T.HttpLabel("MedicalScribeJobName")),
    Media: Media,
    OutputBucketName: S.String,
    OutputEncryptionKMSKeyId: S.optional(S.String),
    KMSEncryptionContext: S.optional(KMSEncryptionContextMap),
    DataAccessRoleArn: S.String,
    Settings: MedicalScribeSettings,
    ChannelDefinitions: S.optional(MedicalScribeChannelDefinitions),
    Tags: S.optional(TagList),
    MedicalScribeContext: S.optional(MedicalScribeContext),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/medicalscribejobs/{MedicalScribeJobName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartMedicalScribeJobRequest",
}) as any as S.Schema<StartMedicalScribeJobRequest>;
export interface MedicalTranscript {
  TranscriptFileUri?: string;
}
export const MedicalTranscript = S.suspend(() =>
  S.Struct({ TranscriptFileUri: S.optional(S.String) }),
).annotations({
  identifier: "MedicalTranscript",
}) as any as S.Schema<MedicalTranscript>;
export interface MedicalTranscriptionJob {
  MedicalTranscriptionJobName?: string;
  TranscriptionJobStatus?: TranscriptionJobStatus;
  LanguageCode?: LanguageCode;
  MediaSampleRateHertz?: number;
  MediaFormat?: MediaFormat;
  Media?: Media;
  Transcript?: MedicalTranscript;
  StartTime?: Date;
  CreationTime?: Date;
  CompletionTime?: Date;
  FailureReason?: string;
  Settings?: MedicalTranscriptionSetting;
  ContentIdentificationType?: MedicalContentIdentificationType;
  Specialty?: Specialty;
  Type?: Type;
  Tags?: Tag[];
}
export const MedicalTranscriptionJob = S.suspend(() =>
  S.Struct({
    MedicalTranscriptionJobName: S.optional(S.String),
    TranscriptionJobStatus: S.optional(TranscriptionJobStatus),
    LanguageCode: S.optional(LanguageCode),
    MediaSampleRateHertz: S.optional(S.Number),
    MediaFormat: S.optional(MediaFormat),
    Media: S.optional(Media),
    Transcript: S.optional(MedicalTranscript),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FailureReason: S.optional(S.String),
    Settings: S.optional(MedicalTranscriptionSetting),
    ContentIdentificationType: S.optional(MedicalContentIdentificationType),
    Specialty: S.optional(Specialty),
    Type: S.optional(Type),
    Tags: S.optional(TagList),
  }),
).annotations({
  identifier: "MedicalTranscriptionJob",
}) as any as S.Schema<MedicalTranscriptionJob>;
export interface StartMedicalTranscriptionJobResponse {
  MedicalTranscriptionJob?: MedicalTranscriptionJob;
}
export const StartMedicalTranscriptionJobResponse = S.suspend(() =>
  S.Struct({ MedicalTranscriptionJob: S.optional(MedicalTranscriptionJob) }),
).annotations({
  identifier: "StartMedicalTranscriptionJobResponse",
}) as any as S.Schema<StartMedicalTranscriptionJobResponse>;
export interface StartTranscriptionJobRequest {
  TranscriptionJobName: string;
  LanguageCode?: LanguageCode;
  MediaSampleRateHertz?: number;
  MediaFormat?: MediaFormat;
  Media: Media;
  OutputBucketName?: string;
  OutputKey?: string;
  OutputEncryptionKMSKeyId?: string;
  KMSEncryptionContext?: { [key: string]: string | undefined };
  Settings?: Settings;
  ModelSettings?: ModelSettings;
  JobExecutionSettings?: JobExecutionSettings;
  ContentRedaction?: ContentRedaction;
  IdentifyLanguage?: boolean;
  IdentifyMultipleLanguages?: boolean;
  LanguageOptions?: LanguageCode[];
  Subtitles?: Subtitles;
  Tags?: Tag[];
  LanguageIdSettings?: { [key: string]: LanguageIdSettings | undefined };
  ToxicityDetection?: ToxicityDetectionSettings[];
}
export const StartTranscriptionJobRequest = S.suspend(() =>
  S.Struct({
    TranscriptionJobName: S.String.pipe(T.HttpLabel("TranscriptionJobName")),
    LanguageCode: S.optional(LanguageCode),
    MediaSampleRateHertz: S.optional(S.Number),
    MediaFormat: S.optional(MediaFormat),
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
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/transcriptionjobs/{TranscriptionJobName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartTranscriptionJobRequest",
}) as any as S.Schema<StartTranscriptionJobRequest>;
export interface Transcript {
  TranscriptFileUri?: string;
  RedactedTranscriptFileUri?: string;
}
export const Transcript = S.suspend(() =>
  S.Struct({
    TranscriptFileUri: S.optional(S.String),
    RedactedTranscriptFileUri: S.optional(S.String),
  }),
).annotations({ identifier: "Transcript" }) as any as S.Schema<Transcript>;
export interface MedicalScribeOutput {
  TranscriptFileUri: string;
  ClinicalDocumentUri: string;
}
export const MedicalScribeOutput = S.suspend(() =>
  S.Struct({ TranscriptFileUri: S.String, ClinicalDocumentUri: S.String }),
).annotations({
  identifier: "MedicalScribeOutput",
}) as any as S.Schema<MedicalScribeOutput>;
export interface SubtitlesOutput {
  Formats?: SubtitleFormat[];
  SubtitleFileUris?: string[];
  OutputStartIndex?: number;
}
export const SubtitlesOutput = S.suspend(() =>
  S.Struct({
    Formats: S.optional(SubtitleFormats),
    SubtitleFileUris: S.optional(SubtitleFileUris),
    OutputStartIndex: S.optional(S.Number),
  }),
).annotations({
  identifier: "SubtitlesOutput",
}) as any as S.Schema<SubtitlesOutput>;
export interface MedicalScribeJob {
  MedicalScribeJobName?: string;
  MedicalScribeJobStatus?: MedicalScribeJobStatus;
  LanguageCode?: MedicalScribeLanguageCode;
  Media?: Media;
  MedicalScribeOutput?: MedicalScribeOutput;
  StartTime?: Date;
  CreationTime?: Date;
  CompletionTime?: Date;
  FailureReason?: string;
  Settings?: MedicalScribeSettings;
  DataAccessRoleArn?: string;
  ChannelDefinitions?: MedicalScribeChannelDefinition[];
  MedicalScribeContextProvided?: boolean;
  Tags?: Tag[];
}
export const MedicalScribeJob = S.suspend(() =>
  S.Struct({
    MedicalScribeJobName: S.optional(S.String),
    MedicalScribeJobStatus: S.optional(MedicalScribeJobStatus),
    LanguageCode: S.optional(MedicalScribeLanguageCode),
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
  }),
).annotations({
  identifier: "MedicalScribeJob",
}) as any as S.Schema<MedicalScribeJob>;
export interface TranscriptionJob {
  TranscriptionJobName?: string;
  TranscriptionJobStatus?: TranscriptionJobStatus;
  LanguageCode?: LanguageCode;
  MediaSampleRateHertz?: number;
  MediaFormat?: MediaFormat;
  Media?: Media;
  Transcript?: Transcript;
  StartTime?: Date;
  CreationTime?: Date;
  CompletionTime?: Date;
  FailureReason?: string;
  Settings?: Settings;
  ModelSettings?: ModelSettings;
  JobExecutionSettings?: JobExecutionSettings;
  ContentRedaction?: ContentRedaction;
  IdentifyLanguage?: boolean;
  IdentifyMultipleLanguages?: boolean;
  LanguageOptions?: LanguageCode[];
  IdentifiedLanguageScore?: number;
  LanguageCodes?: LanguageCodeItem[];
  Tags?: Tag[];
  Subtitles?: SubtitlesOutput;
  LanguageIdSettings?: { [key: string]: LanguageIdSettings | undefined };
  ToxicityDetection?: ToxicityDetectionSettings[];
}
export const TranscriptionJob = S.suspend(() =>
  S.Struct({
    TranscriptionJobName: S.optional(S.String),
    TranscriptionJobStatus: S.optional(TranscriptionJobStatus),
    LanguageCode: S.optional(LanguageCode),
    MediaSampleRateHertz: S.optional(S.Number),
    MediaFormat: S.optional(MediaFormat),
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
  }),
).annotations({
  identifier: "TranscriptionJob",
}) as any as S.Schema<TranscriptionJob>;
export interface CreateCallAnalyticsCategoryRequest {
  CategoryName: string;
  Rules: Rule[];
  Tags?: Tag[];
  InputType?: InputType;
}
export const CreateCallAnalyticsCategoryRequest = S.suspend(() =>
  S.Struct({
    CategoryName: S.String.pipe(T.HttpLabel("CategoryName")),
    Rules: RuleList,
    Tags: S.optional(TagList),
    InputType: S.optional(InputType),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/callanalyticscategories/{CategoryName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCallAnalyticsCategoryRequest",
}) as any as S.Schema<CreateCallAnalyticsCategoryRequest>;
export interface GetMedicalScribeJobResponse {
  MedicalScribeJob?: MedicalScribeJob;
}
export const GetMedicalScribeJobResponse = S.suspend(() =>
  S.Struct({ MedicalScribeJob: S.optional(MedicalScribeJob) }),
).annotations({
  identifier: "GetMedicalScribeJobResponse",
}) as any as S.Schema<GetMedicalScribeJobResponse>;
export interface GetMedicalTranscriptionJobResponse {
  MedicalTranscriptionJob?: MedicalTranscriptionJob;
}
export const GetMedicalTranscriptionJobResponse = S.suspend(() =>
  S.Struct({ MedicalTranscriptionJob: S.optional(MedicalTranscriptionJob) }),
).annotations({
  identifier: "GetMedicalTranscriptionJobResponse",
}) as any as S.Schema<GetMedicalTranscriptionJobResponse>;
export interface GetTranscriptionJobResponse {
  TranscriptionJob?: TranscriptionJob;
}
export const GetTranscriptionJobResponse = S.suspend(() =>
  S.Struct({ TranscriptionJob: S.optional(TranscriptionJob) }),
).annotations({
  identifier: "GetTranscriptionJobResponse",
}) as any as S.Schema<GetTranscriptionJobResponse>;
export interface CallAnalyticsJob {
  CallAnalyticsJobName?: string;
  CallAnalyticsJobStatus?: CallAnalyticsJobStatus;
  CallAnalyticsJobDetails?: CallAnalyticsJobDetails;
  LanguageCode?: LanguageCode;
  MediaSampleRateHertz?: number;
  MediaFormat?: MediaFormat;
  Media?: Media;
  Transcript?: Transcript;
  StartTime?: Date;
  CreationTime?: Date;
  CompletionTime?: Date;
  FailureReason?: string;
  DataAccessRoleArn?: string;
  IdentifiedLanguageScore?: number;
  Settings?: CallAnalyticsJobSettings;
  ChannelDefinitions?: ChannelDefinition[];
  Tags?: Tag[];
}
export const CallAnalyticsJob = S.suspend(() =>
  S.Struct({
    CallAnalyticsJobName: S.optional(S.String),
    CallAnalyticsJobStatus: S.optional(CallAnalyticsJobStatus),
    CallAnalyticsJobDetails: S.optional(CallAnalyticsJobDetails),
    LanguageCode: S.optional(LanguageCode),
    MediaSampleRateHertz: S.optional(S.Number),
    MediaFormat: S.optional(MediaFormat),
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
  }),
).annotations({
  identifier: "CallAnalyticsJob",
}) as any as S.Schema<CallAnalyticsJob>;
export interface StartCallAnalyticsJobResponse {
  CallAnalyticsJob?: CallAnalyticsJob;
}
export const StartCallAnalyticsJobResponse = S.suspend(() =>
  S.Struct({ CallAnalyticsJob: S.optional(CallAnalyticsJob) }),
).annotations({
  identifier: "StartCallAnalyticsJobResponse",
}) as any as S.Schema<StartCallAnalyticsJobResponse>;
export interface StartMedicalScribeJobResponse {
  MedicalScribeJob?: MedicalScribeJob;
}
export const StartMedicalScribeJobResponse = S.suspend(() =>
  S.Struct({ MedicalScribeJob: S.optional(MedicalScribeJob) }),
).annotations({
  identifier: "StartMedicalScribeJobResponse",
}) as any as S.Schema<StartMedicalScribeJobResponse>;
export interface StartTranscriptionJobResponse {
  TranscriptionJob?: TranscriptionJob;
}
export const StartTranscriptionJobResponse = S.suspend(() =>
  S.Struct({ TranscriptionJob: S.optional(TranscriptionJob) }),
).annotations({
  identifier: "StartTranscriptionJobResponse",
}) as any as S.Schema<StartTranscriptionJobResponse>;
export interface CreateCallAnalyticsCategoryResponse {
  CategoryProperties?: CategoryProperties;
}
export const CreateCallAnalyticsCategoryResponse = S.suspend(() =>
  S.Struct({ CategoryProperties: S.optional(CategoryProperties) }),
).annotations({
  identifier: "CreateCallAnalyticsCategoryResponse",
}) as any as S.Schema<CreateCallAnalyticsCategoryResponse>;
export interface GetCallAnalyticsJobResponse {
  CallAnalyticsJob?: CallAnalyticsJob;
}
export const GetCallAnalyticsJobResponse = S.suspend(() =>
  S.Struct({ CallAnalyticsJob: S.optional(CallAnalyticsJob) }),
).annotations({
  identifier: "GetCallAnalyticsJobResponse",
}) as any as S.Schema<GetCallAnalyticsJobResponse>;

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
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
export const startCallAnalyticsJob: (
  input: StartCallAnalyticsJobRequest,
) => effect.Effect<
  StartCallAnalyticsJobResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartCallAnalyticsJobRequest,
  output: StartCallAnalyticsJobResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
  ],
}));
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
export const startMedicalScribeJob: (
  input: StartMedicalScribeJobRequest,
) => effect.Effect<
  StartMedicalScribeJobResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMedicalScribeJobRequest,
  output: StartMedicalScribeJobResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
  ],
}));
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
export const startTranscriptionJob: (
  input: StartTranscriptionJobRequest,
) => effect.Effect<
  StartTranscriptionJobResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartTranscriptionJobRequest,
  output: StartTranscriptionJobResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
  ],
}));
/**
 * Provides a list of Call Analytics jobs that match the specified criteria. If no
 * criteria are specified, all Call Analytics jobs are returned.
 *
 * To get detailed information about a specific Call Analytics job, use the operation.
 */
export const listCallAnalyticsJobs: {
  (
    input: ListCallAnalyticsJobsRequest,
  ): effect.Effect<
    ListCallAnalyticsJobsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCallAnalyticsJobsRequest,
  ) => stream.Stream<
    ListCallAnalyticsJobsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCallAnalyticsJobsRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCallAnalyticsJobsRequest,
  output: ListCallAnalyticsJobsResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Provides a list of Medical Scribe jobs that match the specified criteria. If no
 * criteria are specified, all Medical Scribe jobs are returned.
 *
 * To get detailed information about a specific Medical Scribe job, use the operation.
 */
export const listMedicalScribeJobs: {
  (
    input: ListMedicalScribeJobsRequest,
  ): effect.Effect<
    ListMedicalScribeJobsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMedicalScribeJobsRequest,
  ) => stream.Stream<
    ListMedicalScribeJobsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMedicalScribeJobsRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMedicalScribeJobsRequest,
  output: ListMedicalScribeJobsResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Provides a list of medical transcription jobs that match the specified criteria. If no
 * criteria are specified, all medical transcription jobs are returned.
 *
 * To get detailed information about a specific medical transcription job, use the operation.
 */
export const listMedicalTranscriptionJobs: {
  (
    input: ListMedicalTranscriptionJobsRequest,
  ): effect.Effect<
    ListMedicalTranscriptionJobsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMedicalTranscriptionJobsRequest,
  ) => stream.Stream<
    ListMedicalTranscriptionJobsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMedicalTranscriptionJobsRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMedicalTranscriptionJobsRequest,
  output: ListMedicalTranscriptionJobsResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Provides a list of custom medical vocabularies that match the specified criteria. If
 * no criteria are specified, all custom medical vocabularies are returned.
 *
 * To get detailed information about a specific custom medical vocabulary, use the operation.
 */
export const listMedicalVocabularies: {
  (
    input: ListMedicalVocabulariesRequest,
  ): effect.Effect<
    ListMedicalVocabulariesResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMedicalVocabulariesRequest,
  ) => stream.Stream<
    ListMedicalVocabulariesResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMedicalVocabulariesRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMedicalVocabulariesRequest,
  output: ListMedicalVocabulariesResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Provides a list of transcription jobs that match the specified criteria. If no
 * criteria are specified, all transcription jobs are returned.
 *
 * To get detailed information about a specific transcription job, use the operation.
 */
export const listTranscriptionJobs: {
  (
    input: ListTranscriptionJobsRequest,
  ): effect.Effect<
    ListTranscriptionJobsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTranscriptionJobsRequest,
  ) => stream.Stream<
    ListTranscriptionJobsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTranscriptionJobsRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTranscriptionJobsRequest,
  output: ListTranscriptionJobsResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Provides a list of custom vocabulary filters that match the specified criteria. If no
 * criteria are specified, all custom vocabularies are returned.
 *
 * To get detailed information about a specific custom vocabulary filter, use the operation.
 */
export const listVocabularyFilters: {
  (
    input: ListVocabularyFiltersRequest,
  ): effect.Effect<
    ListVocabularyFiltersResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListVocabularyFiltersRequest,
  ) => stream.Stream<
    ListVocabularyFiltersResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListVocabularyFiltersRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListVocabularyFiltersRequest,
  output: ListVocabularyFiltersResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Provides a list of Call Analytics categories, including all rules that make up each
 * category.
 *
 * To get detailed information about a specific Call Analytics category, use the operation.
 */
export const listCallAnalyticsCategories: {
  (
    input: ListCallAnalyticsCategoriesRequest,
  ): effect.Effect<
    ListCallAnalyticsCategoriesResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCallAnalyticsCategoriesRequest,
  ) => stream.Stream<
    ListCallAnalyticsCategoriesResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCallAnalyticsCategoriesRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCallAnalyticsCategoriesRequest,
  output: ListCallAnalyticsCategoriesResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Provides a list of custom language models that match the specified criteria. If no
 * criteria are specified, all custom language models are returned.
 *
 * To get detailed information about a specific custom language model, use the operation.
 */
export const listLanguageModels: {
  (
    input: ListLanguageModelsRequest,
  ): effect.Effect<
    ListLanguageModelsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLanguageModelsRequest,
  ) => stream.Stream<
    ListLanguageModelsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLanguageModelsRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLanguageModelsRequest,
  output: ListLanguageModelsResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Provides a list of custom vocabularies that match the specified criteria. If no
 * criteria are specified, all custom vocabularies are returned.
 *
 * To get detailed information about a specific custom vocabulary, use the operation.
 */
export const listVocabularies: {
  (
    input: ListVocabulariesRequest,
  ): effect.Effect<
    ListVocabulariesResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListVocabulariesRequest,
  ) => stream.Stream<
    ListVocabulariesResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListVocabulariesRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListVocabulariesRequest,
  output: ListVocabulariesResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Deletes a Call Analytics job. To use this operation, specify the name of the job you
 * want to delete using `CallAnalyticsJobName`. Job names are case
 * sensitive.
 */
export const deleteCallAnalyticsJob: (
  input: DeleteCallAnalyticsJobRequest,
) => effect.Effect<
  DeleteCallAnalyticsJobResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCallAnalyticsJobRequest,
  output: DeleteCallAnalyticsJobResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
}));
/**
 * Deletes a custom language model. To use this operation, specify the name of the
 * language model you want to delete using `ModelName`. custom language model
 * names are case sensitive.
 */
export const deleteLanguageModel: (
  input: DeleteLanguageModelRequest,
) => effect.Effect<
  DeleteLanguageModelResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLanguageModelRequest,
  output: DeleteLanguageModelResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
}));
/**
 * Deletes a Medical Scribe job. To use this operation, specify the name of the
 * job you want to delete using `MedicalScribeJobName`. Job names are
 * case sensitive.
 */
export const deleteMedicalScribeJob: (
  input: DeleteMedicalScribeJobRequest,
) => effect.Effect<
  DeleteMedicalScribeJobResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMedicalScribeJobRequest,
  output: DeleteMedicalScribeJobResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
}));
/**
 * Deletes a medical transcription job. To use this operation, specify the name of the
 * job you want to delete using `MedicalTranscriptionJobName`. Job names are
 * case sensitive.
 */
export const deleteMedicalTranscriptionJob: (
  input: DeleteMedicalTranscriptionJobRequest,
) => effect.Effect<
  DeleteMedicalTranscriptionJobResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteTranscriptionJob: (
  input: DeleteTranscriptionJobRequest,
) => effect.Effect<
  DeleteTranscriptionJobResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTranscriptionJobRequest,
  output: DeleteTranscriptionJobResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
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
export const createMedicalVocabulary: (
  input: CreateMedicalVocabularyRequest,
) => effect.Effect<
  CreateMedicalVocabularyResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMedicalVocabularyRequest,
  output: CreateMedicalVocabularyResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
  ],
}));
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
export const createVocabulary: (
  input: CreateVocabularyRequest,
) => effect.Effect<
  CreateVocabularyResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createVocabularyFilter: (
  input: CreateVocabularyFilterRequest,
) => effect.Effect<
  CreateVocabularyFilterResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVocabularyFilterRequest,
  output: CreateVocabularyFilterResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
  ],
}));
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
export const createLanguageModel: (
  input: CreateLanguageModelRequest,
) => effect.Effect<
  CreateLanguageModelResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startMedicalTranscriptionJob: (
  input: StartMedicalTranscriptionJobRequest,
) => effect.Effect<
  StartMedicalTranscriptionJobResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createCallAnalyticsCategory: (
  input: CreateCallAnalyticsCategoryRequest,
) => effect.Effect<
  CreateCallAnalyticsCategoryResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCallAnalyticsCategoryRequest,
  output: CreateCallAnalyticsCategoryResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
  ],
}));
/**
 * Deletes a Call Analytics category. To use this operation, specify the name of the
 * category you want to delete using `CategoryName`. Category names are case
 * sensitive.
 */
export const deleteCallAnalyticsCategory: (
  input: DeleteCallAnalyticsCategoryRequest,
) => effect.Effect<
  DeleteCallAnalyticsCategoryResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCallAnalyticsCategoryRequest,
  output: DeleteCallAnalyticsCategoryResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
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
export const getCallAnalyticsJob: (
  input: GetCallAnalyticsJobRequest,
) => effect.Effect<
  GetCallAnalyticsJobResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCallAnalyticsJobRequest,
  output: GetCallAnalyticsJobResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
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
export const getMedicalScribeJob: (
  input: GetMedicalScribeJobRequest,
) => effect.Effect<
  GetMedicalScribeJobResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getMedicalTranscriptionJob: (
  input: GetMedicalTranscriptionJobRequest,
) => effect.Effect<
  GetMedicalTranscriptionJobResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMedicalTranscriptionJobRequest,
  output: GetMedicalTranscriptionJobResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
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
export const getTranscriptionJob: (
  input: GetTranscriptionJobRequest,
) => effect.Effect<
  GetTranscriptionJobResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeLanguageModel: (
  input: DescribeLanguageModelRequest,
) => effect.Effect<
  DescribeLanguageModelResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLanguageModelRequest,
  output: DescribeLanguageModelResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Provides information about the specified Call Analytics category.
 *
 * To get a list of your Call Analytics categories, use the operation.
 */
export const getCallAnalyticsCategory: (
  input: GetCallAnalyticsCategoryRequest,
) => effect.Effect<
  GetCallAnalyticsCategoryResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCallAnalyticsCategoryRequest,
  output: GetCallAnalyticsCategoryResponse,
  errors: [
    BadRequestException,
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
export const updateCallAnalyticsCategory: (
  input: UpdateCallAnalyticsCategoryRequest,
) => effect.Effect<
  UpdateCallAnalyticsCategoryResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCallAnalyticsCategoryRequest,
  output: UpdateCallAnalyticsCategoryResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
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
export const getMedicalVocabulary: (
  input: GetMedicalVocabularyRequest,
) => effect.Effect<
  GetMedicalVocabularyResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMedicalVocabularyRequest,
  output: GetMedicalVocabularyResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
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
export const getVocabulary: (
  input: GetVocabularyRequest,
) => effect.Effect<
  GetVocabularyResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getVocabularyFilter: (
  input: GetVocabularyFilterRequest,
) => effect.Effect<
  GetVocabularyFilterResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists all tags associated with the specified transcription job, vocabulary, model, or
 * resource.
 *
 * To learn more about using tags with Amazon Transcribe, refer to Tagging
 * resources.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates an existing custom vocabulary filter with a new list of words. The new list
 * you provide overwrites all previous entries; you cannot append new terms onto an
 * existing custom vocabulary filter.
 */
export const updateVocabularyFilter: (
  input: UpdateVocabularyFilterRequest,
) => effect.Effect<
  UpdateVocabularyFilterResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVocabularyFilterRequest,
  output: UpdateVocabularyFilterResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Deletes a custom medical vocabulary. To use this operation, specify the name of the
 * custom vocabulary you want to delete using `VocabularyName`. Custom
 * vocabulary names are case sensitive.
 */
export const deleteMedicalVocabulary: (
  input: DeleteMedicalVocabularyRequest,
) => effect.Effect<
  DeleteMedicalVocabularyResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMedicalVocabularyRequest,
  output: DeleteMedicalVocabularyResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Deletes a custom vocabulary. To use this operation, specify the name of the custom
 * vocabulary you want to delete using `VocabularyName`. Custom vocabulary names
 * are case sensitive.
 */
export const deleteVocabulary: (
  input: DeleteVocabularyRequest,
) => effect.Effect<
  DeleteVocabularyResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteVocabularyFilter: (
  input: DeleteVocabularyFilterRequest,
) => effect.Effect<
  DeleteVocabularyFilterResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVocabularyFilterRequest,
  output: DeleteVocabularyFilterResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Updates an existing custom medical vocabulary with new values. This operation
 * overwrites all existing information with your new values; you cannot append new terms
 * onto an existing custom vocabulary.
 */
export const updateMedicalVocabulary: (
  input: UpdateMedicalVocabularyRequest,
) => effect.Effect<
  UpdateMedicalVocabularyResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMedicalVocabularyRequest,
  output: UpdateMedicalVocabularyResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Updates an existing custom vocabulary with new values. This operation overwrites all
 * existing information with your new values; you cannot append new terms onto an existing
 * custom vocabulary.
 */
export const updateVocabulary: (
  input: UpdateVocabularyRequest,
) => effect.Effect<
  UpdateVocabularyResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Adds one or more custom tags, each in the form of a key:value pair, to the specified
 * resource.
 *
 * To learn more about using tags with Amazon Transcribe, refer to Tagging
 * resources.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Removes the specified tags from the specified Amazon Transcribe resource.
 *
 * If you include `UntagResource` in your request, you must also include
 * `ResourceArn` and `TagKeys`.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
