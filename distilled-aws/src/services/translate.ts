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
  sdkId: "Translate",
  serviceShapeName: "AWSShineFrontendService_20170701",
});
const auth = T.AwsAuthSigv4({ name: "translate" });
const ver = T.ServiceVersion("2017-07-01");
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
              `https://translate-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://translate-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://translate.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://translate.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ResourceName = string;
export type Description = string;
export type ClientTokenString = string;
export type JobId = string;
export type NextToken = string;
export type MaxResultsInteger = number;
export type ResourceArn = string;
export type JobName = string;
export type IamRoleArn = string;
export type LanguageCodeString = string;
export type BoundedLengthString = string;
export type TagKey = string;
export type S3Uri = string;
export type EncryptionKeyID = string;
export type TagValue = string;
export type TerminologyFile = Uint8Array | redacted.Redacted<Uint8Array>;
export type ContentType = string;
export type DocumentContent = Uint8Array | redacted.Redacted<Uint8Array>;
export type TranslatedTextString = string;
export type UnboundedLengthString = string;
export type ParallelDataArn = string;
export type TerminologyArn = string;
export type LocalizedNameString = string;
export type TranslatedDocumentContent =
  | Uint8Array
  | redacted.Redacted<Uint8Array>;

//# Schemas
export type TerminologyDataFormat = "CSV" | "TMX" | "TSV" | (string & {});
export const TerminologyDataFormat = S.String;
export type MergeStrategy = "OVERWRITE" | (string & {});
export const MergeStrategy = S.String;
export type DisplayLanguageCode =
  | "de"
  | "en"
  | "es"
  | "fr"
  | "it"
  | "ja"
  | "ko"
  | "pt"
  | "zh"
  | "zh-TW"
  | (string & {});
export const DisplayLanguageCode = S.String;
export type TargetLanguageCodeStringList = string[];
export const TargetLanguageCodeStringList = S.Array(S.String);
export type ResourceNameList = string[];
export const ResourceNameList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface DeleteParallelDataRequest {
  Name: string;
}
export const DeleteParallelDataRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteParallelDataRequest",
}) as any as S.Schema<DeleteParallelDataRequest>;
export interface DeleteTerminologyRequest {
  Name: string;
}
export const DeleteTerminologyRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteTerminologyRequest",
}) as any as S.Schema<DeleteTerminologyRequest>;
export interface DeleteTerminologyResponse {}
export const DeleteTerminologyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTerminologyResponse",
}) as any as S.Schema<DeleteTerminologyResponse>;
export interface DescribeTextTranslationJobRequest {
  JobId: string;
}
export const DescribeTextTranslationJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeTextTranslationJobRequest",
}) as any as S.Schema<DescribeTextTranslationJobRequest>;
export interface GetParallelDataRequest {
  Name: string;
}
export const GetParallelDataRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetParallelDataRequest",
}) as any as S.Schema<GetParallelDataRequest>;
export interface GetTerminologyRequest {
  Name: string;
  TerminologyDataFormat?: TerminologyDataFormat;
}
export const GetTerminologyRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    TerminologyDataFormat: S.optional(TerminologyDataFormat),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetTerminologyRequest",
}) as any as S.Schema<GetTerminologyRequest>;
export interface ListLanguagesRequest {
  DisplayLanguageCode?: DisplayLanguageCode;
  NextToken?: string;
  MaxResults?: number;
}
export const ListLanguagesRequest = S.suspend(() =>
  S.Struct({
    DisplayLanguageCode: S.optional(DisplayLanguageCode),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListLanguagesRequest",
}) as any as S.Schema<ListLanguagesRequest>;
export interface ListParallelDataRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListParallelDataRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListParallelDataRequest",
}) as any as S.Schema<ListParallelDataRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ListTerminologiesRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListTerminologiesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTerminologiesRequest",
}) as any as S.Schema<ListTerminologiesRequest>;
export interface StopTextTranslationJobRequest {
  JobId: string;
}
export const StopTextTranslationJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopTextTranslationJobRequest",
}) as any as S.Schema<StopTextTranslationJobRequest>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: TagList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export type Formality = "FORMAL" | "INFORMAL" | (string & {});
export const Formality = S.String;
export type Profanity = "MASK" | (string & {});
export const Profanity = S.String;
export type Brevity = "ON" | (string & {});
export const Brevity = S.String;
export interface TranslationSettings {
  Formality?: Formality;
  Profanity?: Profanity;
  Brevity?: Brevity;
}
export const TranslationSettings = S.suspend(() =>
  S.Struct({
    Formality: S.optional(Formality),
    Profanity: S.optional(Profanity),
    Brevity: S.optional(Brevity),
  }),
).annotations({
  identifier: "TranslationSettings",
}) as any as S.Schema<TranslationSettings>;
export interface TranslateTextRequest {
  Text: string;
  TerminologyNames?: string[];
  SourceLanguageCode: string;
  TargetLanguageCode: string;
  Settings?: TranslationSettings;
}
export const TranslateTextRequest = S.suspend(() =>
  S.Struct({
    Text: S.String,
    TerminologyNames: S.optional(ResourceNameList),
    SourceLanguageCode: S.String,
    TargetLanguageCode: S.String,
    Settings: S.optional(TranslationSettings),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TranslateTextRequest",
}) as any as S.Schema<TranslateTextRequest>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagKeys: TagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type ParallelDataFormat = "TSV" | "CSV" | "TMX" | (string & {});
export const ParallelDataFormat = S.String;
export interface ParallelDataConfig {
  S3Uri?: string;
  Format?: ParallelDataFormat;
}
export const ParallelDataConfig = S.suspend(() =>
  S.Struct({
    S3Uri: S.optional(S.String),
    Format: S.optional(ParallelDataFormat),
  }),
).annotations({
  identifier: "ParallelDataConfig",
}) as any as S.Schema<ParallelDataConfig>;
export interface UpdateParallelDataRequest {
  Name: string;
  Description?: string;
  ParallelDataConfig: ParallelDataConfig;
  ClientToken: string;
}
export const UpdateParallelDataRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    ParallelDataConfig: ParallelDataConfig,
    ClientToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateParallelDataRequest",
}) as any as S.Schema<UpdateParallelDataRequest>;
export type EncryptionKeyType = "KMS" | (string & {});
export const EncryptionKeyType = S.String;
export type Directionality = "UNI" | "MULTI" | (string & {});
export const Directionality = S.String;
export type JobStatus =
  | "SUBMITTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "COMPLETED_WITH_ERROR"
  | "FAILED"
  | "STOP_REQUESTED"
  | "STOPPED"
  | (string & {});
export const JobStatus = S.String;
export interface EncryptionKey {
  Type: EncryptionKeyType;
  Id: string;
}
export const EncryptionKey = S.suspend(() =>
  S.Struct({ Type: EncryptionKeyType, Id: S.String }),
).annotations({
  identifier: "EncryptionKey",
}) as any as S.Schema<EncryptionKey>;
export type ParallelDataStatus =
  | "CREATING"
  | "UPDATING"
  | "ACTIVE"
  | "DELETING"
  | "FAILED"
  | (string & {});
export const ParallelDataStatus = S.String;
export interface TerminologyData {
  File: Uint8Array | redacted.Redacted<Uint8Array>;
  Format: TerminologyDataFormat;
  Directionality?: Directionality;
}
export const TerminologyData = S.suspend(() =>
  S.Struct({
    File: SensitiveBlob,
    Format: TerminologyDataFormat,
    Directionality: S.optional(Directionality),
  }),
).annotations({
  identifier: "TerminologyData",
}) as any as S.Schema<TerminologyData>;
export type LanguageCodeStringList = string[];
export const LanguageCodeStringList = S.Array(S.String);
export interface ParallelDataProperties {
  Name?: string;
  Arn?: string;
  Description?: string;
  Status?: ParallelDataStatus;
  SourceLanguageCode?: string;
  TargetLanguageCodes?: string[];
  ParallelDataConfig?: ParallelDataConfig;
  Message?: string;
  ImportedDataSize?: number;
  ImportedRecordCount?: number;
  FailedRecordCount?: number;
  SkippedRecordCount?: number;
  EncryptionKey?: EncryptionKey;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  LatestUpdateAttemptStatus?: ParallelDataStatus;
  LatestUpdateAttemptAt?: Date;
}
export const ParallelDataProperties = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(ParallelDataStatus),
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
    LatestUpdateAttemptStatus: S.optional(ParallelDataStatus),
    LatestUpdateAttemptAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ParallelDataProperties",
}) as any as S.Schema<ParallelDataProperties>;
export type ParallelDataPropertiesList = ParallelDataProperties[];
export const ParallelDataPropertiesList = S.Array(ParallelDataProperties);
export interface TerminologyProperties {
  Name?: string;
  Description?: string;
  Arn?: string;
  SourceLanguageCode?: string;
  TargetLanguageCodes?: string[];
  EncryptionKey?: EncryptionKey;
  SizeBytes?: number;
  TermCount?: number;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  Directionality?: Directionality;
  Message?: string;
  SkippedTermCount?: number;
  Format?: TerminologyDataFormat;
}
export const TerminologyProperties = S.suspend(() =>
  S.Struct({
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
    Directionality: S.optional(Directionality),
    Message: S.optional(S.String),
    SkippedTermCount: S.optional(S.Number),
    Format: S.optional(TerminologyDataFormat),
  }),
).annotations({
  identifier: "TerminologyProperties",
}) as any as S.Schema<TerminologyProperties>;
export type TerminologyPropertiesList = TerminologyProperties[];
export const TerminologyPropertiesList = S.Array(TerminologyProperties);
export interface TextTranslationJobFilter {
  JobName?: string;
  JobStatus?: JobStatus;
  SubmittedBeforeTime?: Date;
  SubmittedAfterTime?: Date;
}
export const TextTranslationJobFilter = S.suspend(() =>
  S.Struct({
    JobName: S.optional(S.String),
    JobStatus: S.optional(JobStatus),
    SubmittedBeforeTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SubmittedAfterTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "TextTranslationJobFilter",
}) as any as S.Schema<TextTranslationJobFilter>;
export interface InputDataConfig {
  S3Uri: string;
  ContentType: string;
}
export const InputDataConfig = S.suspend(() =>
  S.Struct({ S3Uri: S.String, ContentType: S.String }),
).annotations({
  identifier: "InputDataConfig",
}) as any as S.Schema<InputDataConfig>;
export interface OutputDataConfig {
  S3Uri: string;
  EncryptionKey?: EncryptionKey;
}
export const OutputDataConfig = S.suspend(() =>
  S.Struct({ S3Uri: S.String, EncryptionKey: S.optional(EncryptionKey) }),
).annotations({
  identifier: "OutputDataConfig",
}) as any as S.Schema<OutputDataConfig>;
export interface Document {
  Content: Uint8Array | redacted.Redacted<Uint8Array>;
  ContentType: string;
}
export const Document = S.suspend(() =>
  S.Struct({ Content: SensitiveBlob, ContentType: S.String }),
).annotations({ identifier: "Document" }) as any as S.Schema<Document>;
export interface CreateParallelDataRequest {
  Name: string;
  Description?: string;
  ParallelDataConfig: ParallelDataConfig;
  EncryptionKey?: EncryptionKey;
  ClientToken: string;
  Tags?: Tag[];
}
export const CreateParallelDataRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    ParallelDataConfig: ParallelDataConfig,
    EncryptionKey: S.optional(EncryptionKey),
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateParallelDataRequest",
}) as any as S.Schema<CreateParallelDataRequest>;
export interface DeleteParallelDataResponse {
  Name?: string;
  Status?: ParallelDataStatus;
}
export const DeleteParallelDataResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Status: S.optional(ParallelDataStatus),
  }),
).annotations({
  identifier: "DeleteParallelDataResponse",
}) as any as S.Schema<DeleteParallelDataResponse>;
export interface ImportTerminologyRequest {
  Name: string;
  MergeStrategy: MergeStrategy;
  Description?: string;
  TerminologyData: TerminologyData;
  EncryptionKey?: EncryptionKey;
  Tags?: Tag[];
}
export const ImportTerminologyRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    MergeStrategy: MergeStrategy,
    Description: S.optional(S.String),
    TerminologyData: TerminologyData,
    EncryptionKey: S.optional(EncryptionKey),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ImportTerminologyRequest",
}) as any as S.Schema<ImportTerminologyRequest>;
export interface ListParallelDataResponse {
  ParallelDataPropertiesList?: ParallelDataProperties[];
  NextToken?: string;
}
export const ListParallelDataResponse = S.suspend(() =>
  S.Struct({
    ParallelDataPropertiesList: S.optional(ParallelDataPropertiesList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListParallelDataResponse",
}) as any as S.Schema<ListParallelDataResponse>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ListTerminologiesResponse {
  TerminologyPropertiesList?: TerminologyProperties[];
  NextToken?: string;
}
export const ListTerminologiesResponse = S.suspend(() =>
  S.Struct({
    TerminologyPropertiesList: S.optional(TerminologyPropertiesList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTerminologiesResponse",
}) as any as S.Schema<ListTerminologiesResponse>;
export interface ListTextTranslationJobsRequest {
  Filter?: TextTranslationJobFilter;
  NextToken?: string;
  MaxResults?: number;
}
export const ListTextTranslationJobsRequest = S.suspend(() =>
  S.Struct({
    Filter: S.optional(TextTranslationJobFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTextTranslationJobsRequest",
}) as any as S.Schema<ListTextTranslationJobsRequest>;
export interface StartTextTranslationJobRequest {
  JobName?: string;
  InputDataConfig: InputDataConfig;
  OutputDataConfig: OutputDataConfig;
  DataAccessRoleArn: string;
  SourceLanguageCode: string;
  TargetLanguageCodes: string[];
  TerminologyNames?: string[];
  ParallelDataNames?: string[];
  ClientToken: string;
  Settings?: TranslationSettings;
}
export const StartTextTranslationJobRequest = S.suspend(() =>
  S.Struct({
    JobName: S.optional(S.String),
    InputDataConfig: InputDataConfig,
    OutputDataConfig: OutputDataConfig,
    DataAccessRoleArn: S.String,
    SourceLanguageCode: S.String,
    TargetLanguageCodes: TargetLanguageCodeStringList,
    TerminologyNames: S.optional(ResourceNameList),
    ParallelDataNames: S.optional(ResourceNameList),
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    Settings: S.optional(TranslationSettings),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartTextTranslationJobRequest",
}) as any as S.Schema<StartTextTranslationJobRequest>;
export interface StopTextTranslationJobResponse {
  JobId?: string;
  JobStatus?: JobStatus;
}
export const StopTextTranslationJobResponse = S.suspend(() =>
  S.Struct({ JobId: S.optional(S.String), JobStatus: S.optional(JobStatus) }),
).annotations({
  identifier: "StopTextTranslationJobResponse",
}) as any as S.Schema<StopTextTranslationJobResponse>;
export interface TranslateDocumentRequest {
  Document: Document;
  TerminologyNames?: string[];
  SourceLanguageCode: string;
  TargetLanguageCode: string;
  Settings?: TranslationSettings;
}
export const TranslateDocumentRequest = S.suspend(() =>
  S.Struct({
    Document: Document,
    TerminologyNames: S.optional(ResourceNameList),
    SourceLanguageCode: S.String,
    TargetLanguageCode: S.String,
    Settings: S.optional(TranslationSettings),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TranslateDocumentRequest",
}) as any as S.Schema<TranslateDocumentRequest>;
export interface UpdateParallelDataResponse {
  Name?: string;
  Status?: ParallelDataStatus;
  LatestUpdateAttemptStatus?: ParallelDataStatus;
  LatestUpdateAttemptAt?: Date;
}
export const UpdateParallelDataResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Status: S.optional(ParallelDataStatus),
    LatestUpdateAttemptStatus: S.optional(ParallelDataStatus),
    LatestUpdateAttemptAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "UpdateParallelDataResponse",
}) as any as S.Schema<UpdateParallelDataResponse>;
export interface ParallelDataDataLocation {
  RepositoryType: string;
  Location: string;
}
export const ParallelDataDataLocation = S.suspend(() =>
  S.Struct({ RepositoryType: S.String, Location: S.String }),
).annotations({
  identifier: "ParallelDataDataLocation",
}) as any as S.Schema<ParallelDataDataLocation>;
export interface TerminologyDataLocation {
  RepositoryType: string;
  Location: string;
}
export const TerminologyDataLocation = S.suspend(() =>
  S.Struct({ RepositoryType: S.String, Location: S.String }),
).annotations({
  identifier: "TerminologyDataLocation",
}) as any as S.Schema<TerminologyDataLocation>;
export interface Language {
  LanguageName: string;
  LanguageCode: string;
}
export const Language = S.suspend(() =>
  S.Struct({ LanguageName: S.String, LanguageCode: S.String }),
).annotations({ identifier: "Language" }) as any as S.Schema<Language>;
export type LanguagesList = Language[];
export const LanguagesList = S.Array(Language);
export interface JobDetails {
  TranslatedDocumentsCount?: number;
  DocumentsWithErrorsCount?: number;
  InputDocumentsCount?: number;
}
export const JobDetails = S.suspend(() =>
  S.Struct({
    TranslatedDocumentsCount: S.optional(S.Number),
    DocumentsWithErrorsCount: S.optional(S.Number),
    InputDocumentsCount: S.optional(S.Number),
  }),
).annotations({ identifier: "JobDetails" }) as any as S.Schema<JobDetails>;
export interface TextTranslationJobProperties {
  JobId?: string;
  JobName?: string;
  JobStatus?: JobStatus;
  JobDetails?: JobDetails;
  SourceLanguageCode?: string;
  TargetLanguageCodes?: string[];
  TerminologyNames?: string[];
  ParallelDataNames?: string[];
  Message?: string;
  SubmittedTime?: Date;
  EndTime?: Date;
  InputDataConfig?: InputDataConfig;
  OutputDataConfig?: OutputDataConfig;
  DataAccessRoleArn?: string;
  Settings?: TranslationSettings;
}
export const TextTranslationJobProperties = S.suspend(() =>
  S.Struct({
    JobId: S.optional(S.String),
    JobName: S.optional(S.String),
    JobStatus: S.optional(JobStatus),
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
  }),
).annotations({
  identifier: "TextTranslationJobProperties",
}) as any as S.Schema<TextTranslationJobProperties>;
export type TextTranslationJobPropertiesList = TextTranslationJobProperties[];
export const TextTranslationJobPropertiesList = S.Array(
  TextTranslationJobProperties,
);
export interface CreateParallelDataResponse {
  Name?: string;
  Status?: ParallelDataStatus;
}
export const CreateParallelDataResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Status: S.optional(ParallelDataStatus),
  }),
).annotations({
  identifier: "CreateParallelDataResponse",
}) as any as S.Schema<CreateParallelDataResponse>;
export interface GetParallelDataResponse {
  ParallelDataProperties?: ParallelDataProperties;
  DataLocation?: ParallelDataDataLocation;
  AuxiliaryDataLocation?: ParallelDataDataLocation;
  LatestUpdateAttemptAuxiliaryDataLocation?: ParallelDataDataLocation;
}
export const GetParallelDataResponse = S.suspend(() =>
  S.Struct({
    ParallelDataProperties: S.optional(ParallelDataProperties),
    DataLocation: S.optional(ParallelDataDataLocation),
    AuxiliaryDataLocation: S.optional(ParallelDataDataLocation),
    LatestUpdateAttemptAuxiliaryDataLocation: S.optional(
      ParallelDataDataLocation,
    ),
  }),
).annotations({
  identifier: "GetParallelDataResponse",
}) as any as S.Schema<GetParallelDataResponse>;
export interface GetTerminologyResponse {
  TerminologyProperties?: TerminologyProperties;
  TerminologyDataLocation?: TerminologyDataLocation;
  AuxiliaryDataLocation?: TerminologyDataLocation;
}
export const GetTerminologyResponse = S.suspend(() =>
  S.Struct({
    TerminologyProperties: S.optional(TerminologyProperties),
    TerminologyDataLocation: S.optional(TerminologyDataLocation),
    AuxiliaryDataLocation: S.optional(TerminologyDataLocation),
  }),
).annotations({
  identifier: "GetTerminologyResponse",
}) as any as S.Schema<GetTerminologyResponse>;
export interface ImportTerminologyResponse {
  TerminologyProperties?: TerminologyProperties;
  AuxiliaryDataLocation?: TerminologyDataLocation;
}
export const ImportTerminologyResponse = S.suspend(() =>
  S.Struct({
    TerminologyProperties: S.optional(TerminologyProperties),
    AuxiliaryDataLocation: S.optional(TerminologyDataLocation),
  }),
).annotations({
  identifier: "ImportTerminologyResponse",
}) as any as S.Schema<ImportTerminologyResponse>;
export interface ListLanguagesResponse {
  Languages?: Language[];
  DisplayLanguageCode?: DisplayLanguageCode;
  NextToken?: string;
}
export const ListLanguagesResponse = S.suspend(() =>
  S.Struct({
    Languages: S.optional(LanguagesList),
    DisplayLanguageCode: S.optional(DisplayLanguageCode),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLanguagesResponse",
}) as any as S.Schema<ListLanguagesResponse>;
export interface ListTextTranslationJobsResponse {
  TextTranslationJobPropertiesList?: TextTranslationJobProperties[];
  NextToken?: string;
}
export const ListTextTranslationJobsResponse = S.suspend(() =>
  S.Struct({
    TextTranslationJobPropertiesList: S.optional(
      TextTranslationJobPropertiesList,
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTextTranslationJobsResponse",
}) as any as S.Schema<ListTextTranslationJobsResponse>;
export interface StartTextTranslationJobResponse {
  JobId?: string;
  JobStatus?: JobStatus;
}
export const StartTextTranslationJobResponse = S.suspend(() =>
  S.Struct({ JobId: S.optional(S.String), JobStatus: S.optional(JobStatus) }),
).annotations({
  identifier: "StartTextTranslationJobResponse",
}) as any as S.Schema<StartTextTranslationJobResponse>;
export interface Term {
  SourceText?: string;
  TargetText?: string;
}
export const Term = S.suspend(() =>
  S.Struct({
    SourceText: S.optional(S.String),
    TargetText: S.optional(S.String),
  }),
).annotations({ identifier: "Term" }) as any as S.Schema<Term>;
export type TermList = Term[];
export const TermList = S.Array(Term);
export interface TranslatedDocument {
  Content: Uint8Array | redacted.Redacted<Uint8Array>;
}
export const TranslatedDocument = S.suspend(() =>
  S.Struct({ Content: SensitiveBlob }),
).annotations({
  identifier: "TranslatedDocument",
}) as any as S.Schema<TranslatedDocument>;
export interface AppliedTerminology {
  Name?: string;
  Terms?: Term[];
}
export const AppliedTerminology = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Terms: S.optional(TermList) }),
).annotations({
  identifier: "AppliedTerminology",
}) as any as S.Schema<AppliedTerminology>;
export type AppliedTerminologyList = AppliedTerminology[];
export const AppliedTerminologyList = S.Array(AppliedTerminology);
export interface DescribeTextTranslationJobResponse {
  TextTranslationJobProperties?: TextTranslationJobProperties;
}
export const DescribeTextTranslationJobResponse = S.suspend(() =>
  S.Struct({
    TextTranslationJobProperties: S.optional(TextTranslationJobProperties),
  }),
).annotations({
  identifier: "DescribeTextTranslationJobResponse",
}) as any as S.Schema<DescribeTextTranslationJobResponse>;
export interface TranslateDocumentResponse {
  TranslatedDocument: TranslatedDocument;
  SourceLanguageCode: string;
  TargetLanguageCode: string;
  AppliedTerminologies?: AppliedTerminology[];
  AppliedSettings?: TranslationSettings;
}
export const TranslateDocumentResponse = S.suspend(() =>
  S.Struct({
    TranslatedDocument: TranslatedDocument,
    SourceLanguageCode: S.String,
    TargetLanguageCode: S.String,
    AppliedTerminologies: S.optional(AppliedTerminologyList),
    AppliedSettings: S.optional(TranslationSettings),
  }),
).annotations({
  identifier: "TranslateDocumentResponse",
}) as any as S.Schema<TranslateDocumentResponse>;
export interface TranslateTextResponse {
  TranslatedText: string;
  SourceLanguageCode: string;
  TargetLanguageCode: string;
  AppliedTerminologies?: AppliedTerminology[];
  AppliedSettings?: TranslationSettings;
}
export const TranslateTextResponse = S.suspend(() =>
  S.Struct({
    TranslatedText: S.String,
    SourceLanguageCode: S.String,
    TargetLanguageCode: S.String,
    AppliedTerminologies: S.optional(AppliedTerminologyList),
    AppliedSettings: S.optional(TranslationSettings),
  }),
).annotations({
  identifier: "TranslateTextResponse",
}) as any as S.Schema<TranslateTextResponse>;

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class InvalidFilterException extends S.TaggedError<InvalidFilterException>()(
  "InvalidFilterException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String), ResourceArn: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnsupportedDisplayLanguageCodeException extends S.TaggedError<UnsupportedDisplayLanguageCodeException>()(
  "UnsupportedDisplayLanguageCodeException",
  { Message: S.optional(S.String), DisplayLanguageCode: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnsupportedLanguagePairException extends S.TaggedError<UnsupportedLanguagePairException>()(
  "UnsupportedLanguagePairException",
  {
    Message: S.optional(S.String),
    SourceLanguageCode: S.optional(S.String),
    TargetLanguageCode: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class DetectedLanguageLowConfidenceException extends S.TaggedError<DetectedLanguageLowConfidenceException>()(
  "DetectedLanguageLowConfidenceException",
  { Message: S.optional(S.String), DetectedLanguageCode: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TextSizeLimitExceededException extends S.TaggedError<TextSizeLimitExceededException>()(
  "TextSizeLimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists all tags associated with a given Amazon Translate resource.
 * For more information, see
 * Tagging your resources.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InternalServerException
  | InvalidParameterValueException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    InvalidParameterValueException,
    ResourceNotFoundException,
  ],
}));
/**
 * Removes a specific tag associated with an Amazon Translate resource.
 * For more information, see
 * Tagging your resources.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | ConcurrentModificationException
  | InternalServerException
  | InvalidParameterValueException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Associates a specific tag with a resource. A tag is a key-value pair
 * that adds as a metadata to a resource.
 * For more information, see
 * Tagging your resources.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | ConcurrentModificationException
  | InternalServerException
  | InvalidParameterValueException
  | ResourceNotFoundException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopTextTranslationJob: (
  input: StopTextTranslationJobRequest,
) => effect.Effect<
  StopTextTranslationJobResponse,
  | InternalServerException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopTextTranslationJobRequest,
  output: StopTextTranslationJobResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Provides a list of your parallel data resources in Amazon Translate.
 */
export const listParallelData: {
  (
    input: ListParallelDataRequest,
  ): effect.Effect<
    ListParallelDataResponse,
    | InternalServerException
    | InvalidParameterValueException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListParallelDataRequest,
  ) => stream.Stream<
    ListParallelDataResponse,
    | InternalServerException
    | InvalidParameterValueException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListParallelDataRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | InvalidParameterValueException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListParallelDataRequest,
  output: ListParallelDataResponse,
  errors: [
    InternalServerException,
    InvalidParameterValueException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Provides a list of custom terminologies associated with your account.
 */
export const listTerminologies: {
  (
    input: ListTerminologiesRequest,
  ): effect.Effect<
    ListTerminologiesResponse,
    | InternalServerException
    | InvalidParameterValueException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTerminologiesRequest,
  ) => stream.Stream<
    ListTerminologiesResponse,
    | InternalServerException
    | InvalidParameterValueException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTerminologiesRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | InvalidParameterValueException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTerminologiesRequest,
  output: ListTerminologiesResponse,
  errors: [
    InternalServerException,
    InvalidParameterValueException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Deletes a parallel data resource in Amazon Translate.
 */
export const deleteParallelData: (
  input: DeleteParallelDataRequest,
) => effect.Effect<
  DeleteParallelDataResponse,
  | ConcurrentModificationException
  | InternalServerException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteTerminology: (
  input: DeleteTerminologyRequest,
) => effect.Effect<
  DeleteTerminologyResponse,
  | InternalServerException
  | InvalidParameterValueException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getParallelData: (
  input: GetParallelDataRequest,
) => effect.Effect<
  GetParallelDataResponse,
  | InternalServerException
  | InvalidParameterValueException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTerminology: (
  input: GetTerminologyRequest,
) => effect.Effect<
  GetTerminologyResponse,
  | InternalServerException
  | InvalidParameterValueException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Gets the properties associated with an asynchronous batch translation job including name,
 * ID, status, source and target languages, input/output S3 buckets, and so on.
 */
export const describeTextTranslationJob: (
  input: DescribeTextTranslationJobRequest,
) => effect.Effect<
  DescribeTextTranslationJobResponse,
  | InternalServerException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTextTranslationJobRequest,
  output: DescribeTextTranslationJobResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
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
export const importTerminology: (
  input: ImportTerminologyRequest,
) => effect.Effect<
  ImportTerminologyResponse,
  | ConcurrentModificationException
  | InternalServerException
  | InvalidParameterValueException
  | LimitExceededException
  | TooManyRequestsException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates a previously created parallel data resource by importing a new input file from
 * Amazon S3.
 */
export const updateParallelData: (
  input: UpdateParallelDataRequest,
) => effect.Effect<
  UpdateParallelDataResponse,
  | ConcurrentModificationException
  | ConflictException
  | InternalServerException
  | InvalidParameterValueException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createParallelData: (
  input: CreateParallelDataRequest,
) => effect.Effect<
  CreateParallelDataResponse,
  | ConcurrentModificationException
  | ConflictException
  | InternalServerException
  | InvalidParameterValueException
  | InvalidRequestException
  | LimitExceededException
  | TooManyRequestsException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Gets a list of the batch translation jobs that you have submitted.
 */
export const listTextTranslationJobs: {
  (
    input: ListTextTranslationJobsRequest,
  ): effect.Effect<
    ListTextTranslationJobsResponse,
    | InternalServerException
    | InvalidFilterException
    | InvalidRequestException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTextTranslationJobsRequest,
  ) => stream.Stream<
    ListTextTranslationJobsResponse,
    | InternalServerException
    | InvalidFilterException
    | InvalidRequestException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTextTranslationJobsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | InvalidFilterException
    | InvalidRequestException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTextTranslationJobsRequest,
  output: ListTextTranslationJobsResponse,
  errors: [
    InternalServerException,
    InvalidFilterException,
    InvalidRequestException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Provides a list of languages (RFC-5646 codes and names) that Amazon Translate supports.
 */
export const listLanguages: {
  (
    input: ListLanguagesRequest,
  ): effect.Effect<
    ListLanguagesResponse,
    | InternalServerException
    | InvalidParameterValueException
    | TooManyRequestsException
    | UnsupportedDisplayLanguageCodeException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLanguagesRequest,
  ) => stream.Stream<
    ListLanguagesResponse,
    | InternalServerException
    | InvalidParameterValueException
    | TooManyRequestsException
    | UnsupportedDisplayLanguageCodeException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLanguagesRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | InvalidParameterValueException
    | TooManyRequestsException
    | UnsupportedDisplayLanguageCodeException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLanguagesRequest,
  output: ListLanguagesResponse,
  errors: [
    InternalServerException,
    InvalidParameterValueException,
    TooManyRequestsException,
    UnsupportedDisplayLanguageCodeException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
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
export const startTextTranslationJob: (
  input: StartTextTranslationJobRequest,
) => effect.Effect<
  StartTextTranslationJobResponse,
  | InternalServerException
  | InvalidParameterValueException
  | InvalidRequestException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UnsupportedLanguagePairException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
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
export const translateDocument: (
  input: TranslateDocumentRequest,
) => effect.Effect<
  TranslateDocumentResponse,
  | InternalServerException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnsupportedLanguagePairException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const translateText: (
  input: TranslateTextRequest,
) => effect.Effect<
  TranslateTextResponse,
  | DetectedLanguageLowConfidenceException
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | TextSizeLimitExceededException
  | TooManyRequestsException
  | UnsupportedLanguagePairException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
