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
const svc = T.AwsApiService({
  sdkId: "Transcribe Streaming",
  serviceShapeName: "Transcribe",
});
const auth = T.AwsAuthSigv4({ name: "transcribe" });
const ver = T.ServiceVersion("2017-10-26");
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
              `https://transcribestreaming-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://transcribestreaming-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://transcribestreaming.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://transcribestreaming.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type SessionId = string;
export type MediaSampleRateHertz = number;
export type VocabularyName = string;
export type VocabularyFilterName = string;
export type ModelName = string;
export type LanguageOptions = string;
export type VocabularyNames = string;
export type VocabularyFilterNames = string;
export type PiiEntityTypes = string;
export type MedicalScribeMediaSampleRateHertz = number;
export type NumberOfChannels = number;
export type RequestId = string;
export type IamRoleArn = string;
export type ChannelId = number;
export type MedicalScribeChannelId = number;
export type KMSKeyId = string;
export type NonEmptyString = string;
export type BucketName = string;
export type Uri = string;
export type Double = number;
export type Confidence = number;
export type Long = number;
export type Integer = number;

//# Schemas
export interface GetMedicalScribeStreamRequest {
  SessionId: string;
}
export const GetMedicalScribeStreamRequest = S.suspend(() =>
  S.Struct({ SessionId: S.String.pipe(T.HttpLabel("SessionId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/medical-scribe-stream/{SessionId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMedicalScribeStreamRequest",
}) as any as S.Schema<GetMedicalScribeStreamRequest>;
export interface AudioEvent {
  AudioChunk?: Uint8Array;
}
export const AudioEvent = S.suspend(() =>
  S.Struct({ AudioChunk: S.optional(T.Blob).pipe(T.EventPayload()) }),
).annotations({ identifier: "AudioEvent" }) as any as S.Schema<AudioEvent>;
export interface ChannelDefinition {
  ChannelId: number;
  ParticipantRole: string;
}
export const ChannelDefinition = S.suspend(() =>
  S.Struct({ ChannelId: S.Number, ParticipantRole: S.String }),
).annotations({
  identifier: "ChannelDefinition",
}) as any as S.Schema<ChannelDefinition>;
export type ChannelDefinitions = ChannelDefinition[];
export const ChannelDefinitions = S.Array(ChannelDefinition);
export interface PostCallAnalyticsSettings {
  OutputLocation: string;
  DataAccessRoleArn: string;
  ContentRedactionOutput?: string;
  OutputEncryptionKMSKeyId?: string;
}
export const PostCallAnalyticsSettings = S.suspend(() =>
  S.Struct({
    OutputLocation: S.String,
    DataAccessRoleArn: S.String,
    ContentRedactionOutput: S.optional(S.String),
    OutputEncryptionKMSKeyId: S.optional(S.String),
  }),
).annotations({
  identifier: "PostCallAnalyticsSettings",
}) as any as S.Schema<PostCallAnalyticsSettings>;
export interface ConfigurationEvent {
  ChannelDefinitions?: ChannelDefinitions;
  PostCallAnalyticsSettings?: PostCallAnalyticsSettings;
}
export const ConfigurationEvent = S.suspend(() =>
  S.Struct({
    ChannelDefinitions: S.optional(ChannelDefinitions),
    PostCallAnalyticsSettings: S.optional(PostCallAnalyticsSettings),
  }),
).annotations({
  identifier: "ConfigurationEvent",
}) as any as S.Schema<ConfigurationEvent>;
export const AudioStream = T.InputEventStream(
  S.Union(
    S.Struct({ AudioEvent: AudioEvent }),
    S.Struct({ ConfigurationEvent: ConfigurationEvent }),
  ),
);
export interface StartMedicalStreamTranscriptionRequest {
  LanguageCode: string;
  MediaSampleRateHertz: number;
  MediaEncoding: string;
  VocabularyName?: string;
  Specialty: string;
  Type: string;
  ShowSpeakerLabel?: boolean;
  SessionId?: string;
  AudioStream: (typeof AudioStream)["Type"];
  EnableChannelIdentification?: boolean;
  NumberOfChannels?: number;
  ContentIdentificationType?: string;
}
export const StartMedicalStreamTranscriptionRequest = S.suspend(() =>
  S.Struct({
    LanguageCode: S.String.pipe(
      T.HttpHeader("x-amzn-transcribe-language-code"),
    ),
    MediaSampleRateHertz: S.Number.pipe(
      T.HttpHeader("x-amzn-transcribe-sample-rate"),
    ),
    MediaEncoding: S.String.pipe(
      T.HttpHeader("x-amzn-transcribe-media-encoding"),
    ),
    VocabularyName: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-vocabulary-name"),
    ),
    Specialty: S.String.pipe(T.HttpHeader("x-amzn-transcribe-specialty")),
    Type: S.String.pipe(T.HttpHeader("x-amzn-transcribe-type")),
    ShowSpeakerLabel: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amzn-transcribe-show-speaker-label"),
    ),
    SessionId: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-session-id"),
    ),
    AudioStream: AudioStream.pipe(T.HttpPayload()),
    EnableChannelIdentification: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amzn-transcribe-enable-channel-identification"),
    ),
    NumberOfChannels: S.optional(S.Number).pipe(
      T.HttpHeader("x-amzn-transcribe-number-of-channels"),
    ),
    ContentIdentificationType: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-content-identification-type"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/medical-stream-transcription" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartMedicalStreamTranscriptionRequest",
}) as any as S.Schema<StartMedicalStreamTranscriptionRequest>;
export interface StartStreamTranscriptionRequest {
  LanguageCode?: string;
  MediaSampleRateHertz: number;
  MediaEncoding: string;
  VocabularyName?: string;
  SessionId?: string;
  AudioStream: (typeof AudioStream)["Type"];
  VocabularyFilterName?: string;
  VocabularyFilterMethod?: string;
  ShowSpeakerLabel?: boolean;
  EnableChannelIdentification?: boolean;
  NumberOfChannels?: number;
  EnablePartialResultsStabilization?: boolean;
  PartialResultsStability?: string;
  ContentIdentificationType?: string;
  ContentRedactionType?: string;
  PiiEntityTypes?: string;
  LanguageModelName?: string;
  IdentifyLanguage?: boolean;
  LanguageOptions?: string;
  PreferredLanguage?: string;
  IdentifyMultipleLanguages?: boolean;
  VocabularyNames?: string;
  VocabularyFilterNames?: string;
}
export const StartStreamTranscriptionRequest = S.suspend(() =>
  S.Struct({
    LanguageCode: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-language-code"),
    ),
    MediaSampleRateHertz: S.Number.pipe(
      T.HttpHeader("x-amzn-transcribe-sample-rate"),
    ),
    MediaEncoding: S.String.pipe(
      T.HttpHeader("x-amzn-transcribe-media-encoding"),
    ),
    VocabularyName: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-vocabulary-name"),
    ),
    SessionId: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-session-id"),
    ),
    AudioStream: AudioStream.pipe(T.HttpPayload()),
    VocabularyFilterName: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-vocabulary-filter-name"),
    ),
    VocabularyFilterMethod: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-vocabulary-filter-method"),
    ),
    ShowSpeakerLabel: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amzn-transcribe-show-speaker-label"),
    ),
    EnableChannelIdentification: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amzn-transcribe-enable-channel-identification"),
    ),
    NumberOfChannels: S.optional(S.Number).pipe(
      T.HttpHeader("x-amzn-transcribe-number-of-channels"),
    ),
    EnablePartialResultsStabilization: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amzn-transcribe-enable-partial-results-stabilization"),
    ),
    PartialResultsStability: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-partial-results-stability"),
    ),
    ContentIdentificationType: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-content-identification-type"),
    ),
    ContentRedactionType: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-content-redaction-type"),
    ),
    PiiEntityTypes: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-pii-entity-types"),
    ),
    LanguageModelName: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-language-model-name"),
    ),
    IdentifyLanguage: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amzn-transcribe-identify-language"),
    ),
    LanguageOptions: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-language-options"),
    ),
    PreferredLanguage: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-preferred-language"),
    ),
    IdentifyMultipleLanguages: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amzn-transcribe-identify-multiple-languages"),
    ),
    VocabularyNames: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-vocabulary-names"),
    ),
    VocabularyFilterNames: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-vocabulary-filter-names"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/stream-transcription" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartStreamTranscriptionRequest",
}) as any as S.Schema<StartStreamTranscriptionRequest>;
export interface MedicalScribeAudioEvent {
  AudioChunk: Uint8Array;
}
export const MedicalScribeAudioEvent = S.suspend(() =>
  S.Struct({ AudioChunk: T.Blob.pipe(T.EventPayload()) }),
).annotations({
  identifier: "MedicalScribeAudioEvent",
}) as any as S.Schema<MedicalScribeAudioEvent>;
export interface MedicalScribeSessionControlEvent {
  Type: string;
}
export const MedicalScribeSessionControlEvent = S.suspend(() =>
  S.Struct({ Type: S.String }),
).annotations({
  identifier: "MedicalScribeSessionControlEvent",
}) as any as S.Schema<MedicalScribeSessionControlEvent>;
export interface MedicalScribeChannelDefinition {
  ChannelId: number;
  ParticipantRole: string;
}
export const MedicalScribeChannelDefinition = S.suspend(() =>
  S.Struct({ ChannelId: S.Number, ParticipantRole: S.String }),
).annotations({
  identifier: "MedicalScribeChannelDefinition",
}) as any as S.Schema<MedicalScribeChannelDefinition>;
export type MedicalScribeChannelDefinitions = MedicalScribeChannelDefinition[];
export const MedicalScribeChannelDefinitions = S.Array(
  MedicalScribeChannelDefinition,
);
export type KMSEncryptionContextMap = { [key: string]: string };
export const KMSEncryptionContextMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface ClinicalNoteGenerationSettings {
  OutputBucketName: string;
  NoteTemplate?: string;
}
export const ClinicalNoteGenerationSettings = S.suspend(() =>
  S.Struct({ OutputBucketName: S.String, NoteTemplate: S.optional(S.String) }),
).annotations({
  identifier: "ClinicalNoteGenerationSettings",
}) as any as S.Schema<ClinicalNoteGenerationSettings>;
export interface MedicalScribePatientContext {
  Pronouns?: string;
}
export const MedicalScribePatientContext = S.suspend(() =>
  S.Struct({ Pronouns: S.optional(S.String) }),
).annotations({
  identifier: "MedicalScribePatientContext",
}) as any as S.Schema<MedicalScribePatientContext>;
export interface ClinicalNoteGenerationResult {
  ClinicalNoteOutputLocation?: string;
  TranscriptOutputLocation?: string;
  Status?: string;
  FailureReason?: string;
}
export const ClinicalNoteGenerationResult = S.suspend(() =>
  S.Struct({
    ClinicalNoteOutputLocation: S.optional(S.String),
    TranscriptOutputLocation: S.optional(S.String),
    Status: S.optional(S.String),
    FailureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "ClinicalNoteGenerationResult",
}) as any as S.Schema<ClinicalNoteGenerationResult>;
export interface MedicalScribeEncryptionSettings {
  KmsEncryptionContext?: KMSEncryptionContextMap;
  KmsKeyId: string;
}
export const MedicalScribeEncryptionSettings = S.suspend(() =>
  S.Struct({
    KmsEncryptionContext: S.optional(KMSEncryptionContextMap),
    KmsKeyId: S.String,
  }),
).annotations({
  identifier: "MedicalScribeEncryptionSettings",
}) as any as S.Schema<MedicalScribeEncryptionSettings>;
export interface MedicalScribePostStreamAnalyticsSettings {
  ClinicalNoteGenerationSettings: ClinicalNoteGenerationSettings;
}
export const MedicalScribePostStreamAnalyticsSettings = S.suspend(() =>
  S.Struct({ ClinicalNoteGenerationSettings: ClinicalNoteGenerationSettings }),
).annotations({
  identifier: "MedicalScribePostStreamAnalyticsSettings",
}) as any as S.Schema<MedicalScribePostStreamAnalyticsSettings>;
export interface MedicalScribeContext {
  PatientContext?: MedicalScribePatientContext;
}
export const MedicalScribeContext = S.suspend(() =>
  S.Struct({ PatientContext: S.optional(MedicalScribePatientContext) }),
).annotations({
  identifier: "MedicalScribeContext",
}) as any as S.Schema<MedicalScribeContext>;
export interface StartCallAnalyticsStreamTranscriptionRequest {
  LanguageCode?: string;
  MediaSampleRateHertz: number;
  MediaEncoding: string;
  VocabularyName?: string;
  SessionId?: string;
  AudioStream: (typeof AudioStream)["Type"];
  VocabularyFilterName?: string;
  VocabularyFilterMethod?: string;
  LanguageModelName?: string;
  IdentifyLanguage?: boolean;
  LanguageOptions?: string;
  PreferredLanguage?: string;
  VocabularyNames?: string;
  VocabularyFilterNames?: string;
  EnablePartialResultsStabilization?: boolean;
  PartialResultsStability?: string;
  ContentIdentificationType?: string;
  ContentRedactionType?: string;
  PiiEntityTypes?: string;
}
export const StartCallAnalyticsStreamTranscriptionRequest = S.suspend(() =>
  S.Struct({
    LanguageCode: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-language-code"),
    ),
    MediaSampleRateHertz: S.Number.pipe(
      T.HttpHeader("x-amzn-transcribe-sample-rate"),
    ),
    MediaEncoding: S.String.pipe(
      T.HttpHeader("x-amzn-transcribe-media-encoding"),
    ),
    VocabularyName: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-vocabulary-name"),
    ),
    SessionId: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-session-id"),
    ),
    AudioStream: AudioStream.pipe(T.HttpPayload()),
    VocabularyFilterName: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-vocabulary-filter-name"),
    ),
    VocabularyFilterMethod: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-vocabulary-filter-method"),
    ),
    LanguageModelName: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-language-model-name"),
    ),
    IdentifyLanguage: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amzn-transcribe-identify-language"),
    ),
    LanguageOptions: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-language-options"),
    ),
    PreferredLanguage: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-preferred-language"),
    ),
    VocabularyNames: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-vocabulary-names"),
    ),
    VocabularyFilterNames: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-vocabulary-filter-names"),
    ),
    EnablePartialResultsStabilization: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amzn-transcribe-enable-partial-results-stabilization"),
    ),
    PartialResultsStability: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-partial-results-stability"),
    ),
    ContentIdentificationType: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-content-identification-type"),
    ),
    ContentRedactionType: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-content-redaction-type"),
    ),
    PiiEntityTypes: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-pii-entity-types"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/call-analytics-stream-transcription" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartCallAnalyticsStreamTranscriptionRequest",
}) as any as S.Schema<StartCallAnalyticsStreamTranscriptionRequest>;
export interface MedicalScribePostStreamAnalyticsResult {
  ClinicalNoteGenerationResult?: ClinicalNoteGenerationResult;
}
export const MedicalScribePostStreamAnalyticsResult = S.suspend(() =>
  S.Struct({
    ClinicalNoteGenerationResult: S.optional(ClinicalNoteGenerationResult),
  }),
).annotations({
  identifier: "MedicalScribePostStreamAnalyticsResult",
}) as any as S.Schema<MedicalScribePostStreamAnalyticsResult>;
export interface MedicalScribeConfigurationEvent {
  VocabularyName?: string;
  VocabularyFilterName?: string;
  VocabularyFilterMethod?: string;
  ResourceAccessRoleArn: string;
  ChannelDefinitions?: MedicalScribeChannelDefinitions;
  EncryptionSettings?: MedicalScribeEncryptionSettings;
  PostStreamAnalyticsSettings: MedicalScribePostStreamAnalyticsSettings;
  MedicalScribeContext?: MedicalScribeContext;
}
export const MedicalScribeConfigurationEvent = S.suspend(() =>
  S.Struct({
    VocabularyName: S.optional(S.String),
    VocabularyFilterName: S.optional(S.String),
    VocabularyFilterMethod: S.optional(S.String),
    ResourceAccessRoleArn: S.String,
    ChannelDefinitions: S.optional(MedicalScribeChannelDefinitions),
    EncryptionSettings: S.optional(MedicalScribeEncryptionSettings),
    PostStreamAnalyticsSettings: MedicalScribePostStreamAnalyticsSettings,
    MedicalScribeContext: S.optional(MedicalScribeContext),
  }),
).annotations({
  identifier: "MedicalScribeConfigurationEvent",
}) as any as S.Schema<MedicalScribeConfigurationEvent>;
export interface MedicalScribeStreamDetails {
  SessionId?: string;
  StreamCreatedAt?: Date;
  StreamEndedAt?: Date;
  LanguageCode?: string;
  MediaSampleRateHertz?: number;
  MediaEncoding?: string;
  VocabularyName?: string;
  VocabularyFilterName?: string;
  VocabularyFilterMethod?: string;
  ResourceAccessRoleArn?: string;
  ChannelDefinitions?: MedicalScribeChannelDefinitions;
  EncryptionSettings?: MedicalScribeEncryptionSettings;
  StreamStatus?: string;
  PostStreamAnalyticsSettings?: MedicalScribePostStreamAnalyticsSettings;
  PostStreamAnalyticsResult?: MedicalScribePostStreamAnalyticsResult;
  MedicalScribeContextProvided?: boolean;
}
export const MedicalScribeStreamDetails = S.suspend(() =>
  S.Struct({
    SessionId: S.optional(S.String),
    StreamCreatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    StreamEndedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LanguageCode: S.optional(S.String),
    MediaSampleRateHertz: S.optional(S.Number),
    MediaEncoding: S.optional(S.String),
    VocabularyName: S.optional(S.String),
    VocabularyFilterName: S.optional(S.String),
    VocabularyFilterMethod: S.optional(S.String),
    ResourceAccessRoleArn: S.optional(S.String),
    ChannelDefinitions: S.optional(MedicalScribeChannelDefinitions),
    EncryptionSettings: S.optional(MedicalScribeEncryptionSettings),
    StreamStatus: S.optional(S.String),
    PostStreamAnalyticsSettings: S.optional(
      MedicalScribePostStreamAnalyticsSettings,
    ),
    PostStreamAnalyticsResult: S.optional(
      MedicalScribePostStreamAnalyticsResult,
    ),
    MedicalScribeContextProvided: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "MedicalScribeStreamDetails",
}) as any as S.Schema<MedicalScribeStreamDetails>;
export const MedicalScribeInputStream = T.InputEventStream(
  S.Union(
    S.Struct({ AudioEvent: MedicalScribeAudioEvent }),
    S.Struct({ SessionControlEvent: MedicalScribeSessionControlEvent }),
    S.Struct({ ConfigurationEvent: MedicalScribeConfigurationEvent }),
  ),
);
export interface GetMedicalScribeStreamResponse {
  MedicalScribeStreamDetails?: MedicalScribeStreamDetails;
}
export const GetMedicalScribeStreamResponse = S.suspend(() =>
  S.Struct({
    MedicalScribeStreamDetails: S.optional(MedicalScribeStreamDetails),
  }),
).annotations({
  identifier: "GetMedicalScribeStreamResponse",
}) as any as S.Schema<GetMedicalScribeStreamResponse>;
export interface StartMedicalScribeStreamRequest {
  SessionId?: string;
  LanguageCode: string;
  MediaSampleRateHertz: number;
  MediaEncoding: string;
  InputStream: (typeof MedicalScribeInputStream)["Type"];
}
export const StartMedicalScribeStreamRequest = S.suspend(() =>
  S.Struct({
    SessionId: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-session-id"),
    ),
    LanguageCode: S.String.pipe(
      T.HttpHeader("x-amzn-transcribe-language-code"),
    ),
    MediaSampleRateHertz: S.Number.pipe(
      T.HttpHeader("x-amzn-transcribe-sample-rate"),
    ),
    MediaEncoding: S.String.pipe(
      T.HttpHeader("x-amzn-transcribe-media-encoding"),
    ),
    InputStream: MedicalScribeInputStream.pipe(T.HttpPayload()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/medical-scribe-stream" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartMedicalScribeStreamRequest",
}) as any as S.Schema<StartMedicalScribeStreamRequest>;
export interface LanguageWithScore {
  LanguageCode?: string;
  Score?: number;
}
export const LanguageWithScore = S.suspend(() =>
  S.Struct({ LanguageCode: S.optional(S.String), Score: S.optional(S.Number) }),
).annotations({
  identifier: "LanguageWithScore",
}) as any as S.Schema<LanguageWithScore>;
export type LanguageIdentification = LanguageWithScore[];
export const LanguageIdentification = S.Array(LanguageWithScore);
export interface MedicalItem {
  StartTime?: number;
  EndTime?: number;
  Type?: string;
  Content?: string;
  Confidence?: number;
  Speaker?: string;
}
export const MedicalItem = S.suspend(() =>
  S.Struct({
    StartTime: S.optional(S.Number),
    EndTime: S.optional(S.Number),
    Type: S.optional(S.String),
    Content: S.optional(S.String),
    Confidence: S.optional(S.Number),
    Speaker: S.optional(S.String),
  }),
).annotations({ identifier: "MedicalItem" }) as any as S.Schema<MedicalItem>;
export type MedicalItemList = MedicalItem[];
export const MedicalItemList = S.Array(MedicalItem);
export interface MedicalEntity {
  StartTime?: number;
  EndTime?: number;
  Category?: string;
  Content?: string;
  Confidence?: number;
}
export const MedicalEntity = S.suspend(() =>
  S.Struct({
    StartTime: S.optional(S.Number),
    EndTime: S.optional(S.Number),
    Category: S.optional(S.String),
    Content: S.optional(S.String),
    Confidence: S.optional(S.Number),
  }),
).annotations({
  identifier: "MedicalEntity",
}) as any as S.Schema<MedicalEntity>;
export type MedicalEntityList = MedicalEntity[];
export const MedicalEntityList = S.Array(MedicalEntity);
export interface Item {
  StartTime?: number;
  EndTime?: number;
  Type?: string;
  Content?: string;
  VocabularyFilterMatch?: boolean;
  Speaker?: string;
  Confidence?: number;
  Stable?: boolean;
}
export const Item = S.suspend(() =>
  S.Struct({
    StartTime: S.optional(S.Number),
    EndTime: S.optional(S.Number),
    Type: S.optional(S.String),
    Content: S.optional(S.String),
    VocabularyFilterMatch: S.optional(S.Boolean),
    Speaker: S.optional(S.String),
    Confidence: S.optional(S.Number),
    Stable: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Item" }) as any as S.Schema<Item>;
export type ItemList = Item[];
export const ItemList = S.Array(Item);
export interface Entity {
  StartTime?: number;
  EndTime?: number;
  Category?: string;
  Type?: string;
  Content?: string;
  Confidence?: number;
}
export const Entity = S.suspend(() =>
  S.Struct({
    StartTime: S.optional(S.Number),
    EndTime: S.optional(S.Number),
    Category: S.optional(S.String),
    Type: S.optional(S.String),
    Content: S.optional(S.String),
    Confidence: S.optional(S.Number),
  }),
).annotations({ identifier: "Entity" }) as any as S.Schema<Entity>;
export type EntityList = Entity[];
export const EntityList = S.Array(Entity);
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface MedicalAlternative {
  Transcript?: string;
  Items?: MedicalItemList;
  Entities?: MedicalEntityList;
}
export const MedicalAlternative = S.suspend(() =>
  S.Struct({
    Transcript: S.optional(S.String),
    Items: S.optional(MedicalItemList),
    Entities: S.optional(MedicalEntityList),
  }),
).annotations({
  identifier: "MedicalAlternative",
}) as any as S.Schema<MedicalAlternative>;
export type MedicalAlternativeList = MedicalAlternative[];
export const MedicalAlternativeList = S.Array(MedicalAlternative);
export interface Alternative {
  Transcript?: string;
  Items?: ItemList;
  Entities?: EntityList;
}
export const Alternative = S.suspend(() =>
  S.Struct({
    Transcript: S.optional(S.String),
    Items: S.optional(ItemList),
    Entities: S.optional(EntityList),
  }),
).annotations({ identifier: "Alternative" }) as any as S.Schema<Alternative>;
export type AlternativeList = Alternative[];
export const AlternativeList = S.Array(Alternative);
export interface MedicalResult {
  ResultId?: string;
  StartTime?: number;
  EndTime?: number;
  IsPartial?: boolean;
  Alternatives?: MedicalAlternativeList;
  ChannelId?: string;
}
export const MedicalResult = S.suspend(() =>
  S.Struct({
    ResultId: S.optional(S.String),
    StartTime: S.optional(S.Number),
    EndTime: S.optional(S.Number),
    IsPartial: S.optional(S.Boolean),
    Alternatives: S.optional(MedicalAlternativeList),
    ChannelId: S.optional(S.String),
  }),
).annotations({
  identifier: "MedicalResult",
}) as any as S.Schema<MedicalResult>;
export type MedicalResultList = MedicalResult[];
export const MedicalResultList = S.Array(MedicalResult);
export interface Result {
  ResultId?: string;
  StartTime?: number;
  EndTime?: number;
  IsPartial?: boolean;
  Alternatives?: AlternativeList;
  ChannelId?: string;
  LanguageCode?: string;
  LanguageIdentification?: LanguageIdentification;
}
export const Result = S.suspend(() =>
  S.Struct({
    ResultId: S.optional(S.String),
    StartTime: S.optional(S.Number),
    EndTime: S.optional(S.Number),
    IsPartial: S.optional(S.Boolean),
    Alternatives: S.optional(AlternativeList),
    ChannelId: S.optional(S.String),
    LanguageCode: S.optional(S.String),
    LanguageIdentification: S.optional(LanguageIdentification),
  }),
).annotations({ identifier: "Result" }) as any as S.Schema<Result>;
export type ResultList = Result[];
export const ResultList = S.Array(Result);
export interface CallAnalyticsItem {
  BeginOffsetMillis?: number;
  EndOffsetMillis?: number;
  Type?: string;
  Content?: string;
  Confidence?: number;
  VocabularyFilterMatch?: boolean;
  Stable?: boolean;
}
export const CallAnalyticsItem = S.suspend(() =>
  S.Struct({
    BeginOffsetMillis: S.optional(S.Number),
    EndOffsetMillis: S.optional(S.Number),
    Type: S.optional(S.String),
    Content: S.optional(S.String),
    Confidence: S.optional(S.Number),
    VocabularyFilterMatch: S.optional(S.Boolean),
    Stable: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CallAnalyticsItem",
}) as any as S.Schema<CallAnalyticsItem>;
export type CallAnalyticsItemList = CallAnalyticsItem[];
export const CallAnalyticsItemList = S.Array(CallAnalyticsItem);
export interface CallAnalyticsEntity {
  BeginOffsetMillis?: number;
  EndOffsetMillis?: number;
  Category?: string;
  Type?: string;
  Content?: string;
  Confidence?: number;
}
export const CallAnalyticsEntity = S.suspend(() =>
  S.Struct({
    BeginOffsetMillis: S.optional(S.Number),
    EndOffsetMillis: S.optional(S.Number),
    Category: S.optional(S.String),
    Type: S.optional(S.String),
    Content: S.optional(S.String),
    Confidence: S.optional(S.Number),
  }),
).annotations({
  identifier: "CallAnalyticsEntity",
}) as any as S.Schema<CallAnalyticsEntity>;
export type CallAnalyticsEntityList = CallAnalyticsEntity[];
export const CallAnalyticsEntityList = S.Array(CallAnalyticsEntity);
export interface CallAnalyticsLanguageWithScore {
  LanguageCode?: string;
  Score?: number;
}
export const CallAnalyticsLanguageWithScore = S.suspend(() =>
  S.Struct({ LanguageCode: S.optional(S.String), Score: S.optional(S.Number) }),
).annotations({
  identifier: "CallAnalyticsLanguageWithScore",
}) as any as S.Schema<CallAnalyticsLanguageWithScore>;
export type CallAnalyticsLanguageIdentification =
  CallAnalyticsLanguageWithScore[];
export const CallAnalyticsLanguageIdentification = S.Array(
  CallAnalyticsLanguageWithScore,
);
export interface MedicalTranscript {
  Results?: MedicalResultList;
}
export const MedicalTranscript = S.suspend(() =>
  S.Struct({ Results: S.optional(MedicalResultList) }),
).annotations({
  identifier: "MedicalTranscript",
}) as any as S.Schema<MedicalTranscript>;
export interface Transcript {
  Results?: ResultList;
}
export const Transcript = S.suspend(() =>
  S.Struct({ Results: S.optional(ResultList) }),
).annotations({ identifier: "Transcript" }) as any as S.Schema<Transcript>;
export interface MedicalTranscriptEvent {
  Transcript?: MedicalTranscript;
}
export const MedicalTranscriptEvent = S.suspend(() =>
  S.Struct({ Transcript: S.optional(MedicalTranscript) }),
).annotations({
  identifier: "MedicalTranscriptEvent",
}) as any as S.Schema<MedicalTranscriptEvent>;
export interface TranscriptEvent {
  Transcript?: Transcript;
}
export const TranscriptEvent = S.suspend(() =>
  S.Struct({ Transcript: S.optional(Transcript) }),
).annotations({
  identifier: "TranscriptEvent",
}) as any as S.Schema<TranscriptEvent>;
export interface CharacterOffsets {
  Begin?: number;
  End?: number;
}
export const CharacterOffsets = S.suspend(() =>
  S.Struct({ Begin: S.optional(S.Number), End: S.optional(S.Number) }),
).annotations({
  identifier: "CharacterOffsets",
}) as any as S.Schema<CharacterOffsets>;
export const MedicalTranscriptResultStream = T.EventStream(
  S.Union(
    S.Struct({ TranscriptEvent: MedicalTranscriptEvent }),
    S.Struct({
      BadRequestException: S.suspend(() => BadRequestException).annotations({
        identifier: "BadRequestException",
      }),
    }),
    S.Struct({
      LimitExceededException: S.suspend(
        () => LimitExceededException,
      ).annotations({ identifier: "LimitExceededException" }),
    }),
    S.Struct({
      InternalFailureException: S.suspend(
        () => InternalFailureException,
      ).annotations({ identifier: "InternalFailureException" }),
    }),
    S.Struct({
      ConflictException: S.suspend(() => ConflictException).annotations({
        identifier: "ConflictException",
      }),
    }),
    S.Struct({
      ServiceUnavailableException: S.suspend(
        () => ServiceUnavailableException,
      ).annotations({ identifier: "ServiceUnavailableException" }),
    }),
  ),
);
export const TranscriptResultStream = T.EventStream(
  S.Union(
    S.Struct({ TranscriptEvent: TranscriptEvent }),
    S.Struct({
      BadRequestException: S.suspend(() => BadRequestException).annotations({
        identifier: "BadRequestException",
      }),
    }),
    S.Struct({
      LimitExceededException: S.suspend(
        () => LimitExceededException,
      ).annotations({ identifier: "LimitExceededException" }),
    }),
    S.Struct({
      InternalFailureException: S.suspend(
        () => InternalFailureException,
      ).annotations({ identifier: "InternalFailureException" }),
    }),
    S.Struct({
      ConflictException: S.suspend(() => ConflictException).annotations({
        identifier: "ConflictException",
      }),
    }),
    S.Struct({
      ServiceUnavailableException: S.suspend(
        () => ServiceUnavailableException,
      ).annotations({ identifier: "ServiceUnavailableException" }),
    }),
  ),
);
export interface IssueDetected {
  CharacterOffsets?: CharacterOffsets;
}
export const IssueDetected = S.suspend(() =>
  S.Struct({ CharacterOffsets: S.optional(CharacterOffsets) }),
).annotations({
  identifier: "IssueDetected",
}) as any as S.Schema<IssueDetected>;
export type IssuesDetected = IssueDetected[];
export const IssuesDetected = S.Array(IssueDetected);
export interface TimestampRange {
  BeginOffsetMillis?: number;
  EndOffsetMillis?: number;
}
export const TimestampRange = S.suspend(() =>
  S.Struct({
    BeginOffsetMillis: S.optional(S.Number),
    EndOffsetMillis: S.optional(S.Number),
  }),
).annotations({
  identifier: "TimestampRange",
}) as any as S.Schema<TimestampRange>;
export type TimestampRanges = TimestampRange[];
export const TimestampRanges = S.Array(TimestampRange);
export interface StartMedicalStreamTranscriptionResponse {
  RequestId?: string;
  LanguageCode?: string;
  MediaSampleRateHertz?: number;
  MediaEncoding?: string;
  VocabularyName?: string;
  Specialty?: string;
  Type?: string;
  ShowSpeakerLabel?: boolean;
  SessionId?: string;
  TranscriptResultStream?: (typeof MedicalTranscriptResultStream)["Type"];
  EnableChannelIdentification?: boolean;
  NumberOfChannels?: number;
  ContentIdentificationType?: string;
}
export const StartMedicalStreamTranscriptionResponse = S.suspend(() =>
  S.Struct({
    RequestId: S.optional(S.String).pipe(T.HttpHeader("x-amzn-request-id")),
    LanguageCode: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-language-code"),
    ),
    MediaSampleRateHertz: S.optional(S.Number).pipe(
      T.HttpHeader("x-amzn-transcribe-sample-rate"),
    ),
    MediaEncoding: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-media-encoding"),
    ),
    VocabularyName: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-vocabulary-name"),
    ),
    Specialty: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-specialty"),
    ),
    Type: S.optional(S.String).pipe(T.HttpHeader("x-amzn-transcribe-type")),
    ShowSpeakerLabel: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amzn-transcribe-show-speaker-label"),
    ),
    SessionId: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-session-id"),
    ),
    TranscriptResultStream: S.optional(MedicalTranscriptResultStream).pipe(
      T.HttpPayload(),
    ),
    EnableChannelIdentification: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amzn-transcribe-enable-channel-identification"),
    ),
    NumberOfChannels: S.optional(S.Number).pipe(
      T.HttpHeader("x-amzn-transcribe-number-of-channels"),
    ),
    ContentIdentificationType: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-content-identification-type"),
    ),
  }),
).annotations({
  identifier: "StartMedicalStreamTranscriptionResponse",
}) as any as S.Schema<StartMedicalStreamTranscriptionResponse>;
export interface StartStreamTranscriptionResponse {
  RequestId?: string;
  LanguageCode?: string;
  MediaSampleRateHertz?: number;
  MediaEncoding?: string;
  VocabularyName?: string;
  SessionId?: string;
  TranscriptResultStream?: (typeof TranscriptResultStream)["Type"];
  VocabularyFilterName?: string;
  VocabularyFilterMethod?: string;
  ShowSpeakerLabel?: boolean;
  EnableChannelIdentification?: boolean;
  NumberOfChannels?: number;
  EnablePartialResultsStabilization?: boolean;
  PartialResultsStability?: string;
  ContentIdentificationType?: string;
  ContentRedactionType?: string;
  PiiEntityTypes?: string;
  LanguageModelName?: string;
  IdentifyLanguage?: boolean;
  LanguageOptions?: string;
  PreferredLanguage?: string;
  IdentifyMultipleLanguages?: boolean;
  VocabularyNames?: string;
  VocabularyFilterNames?: string;
}
export const StartStreamTranscriptionResponse = S.suspend(() =>
  S.Struct({
    RequestId: S.optional(S.String).pipe(T.HttpHeader("x-amzn-request-id")),
    LanguageCode: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-language-code"),
    ),
    MediaSampleRateHertz: S.optional(S.Number).pipe(
      T.HttpHeader("x-amzn-transcribe-sample-rate"),
    ),
    MediaEncoding: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-media-encoding"),
    ),
    VocabularyName: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-vocabulary-name"),
    ),
    SessionId: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-session-id"),
    ),
    TranscriptResultStream: S.optional(TranscriptResultStream).pipe(
      T.HttpPayload(),
    ),
    VocabularyFilterName: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-vocabulary-filter-name"),
    ),
    VocabularyFilterMethod: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-vocabulary-filter-method"),
    ),
    ShowSpeakerLabel: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amzn-transcribe-show-speaker-label"),
    ),
    EnableChannelIdentification: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amzn-transcribe-enable-channel-identification"),
    ),
    NumberOfChannels: S.optional(S.Number).pipe(
      T.HttpHeader("x-amzn-transcribe-number-of-channels"),
    ),
    EnablePartialResultsStabilization: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amzn-transcribe-enable-partial-results-stabilization"),
    ),
    PartialResultsStability: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-partial-results-stability"),
    ),
    ContentIdentificationType: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-content-identification-type"),
    ),
    ContentRedactionType: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-content-redaction-type"),
    ),
    PiiEntityTypes: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-pii-entity-types"),
    ),
    LanguageModelName: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-language-model-name"),
    ),
    IdentifyLanguage: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amzn-transcribe-identify-language"),
    ),
    LanguageOptions: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-language-options"),
    ),
    PreferredLanguage: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-preferred-language"),
    ),
    IdentifyMultipleLanguages: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amzn-transcribe-identify-multiple-languages"),
    ),
    VocabularyNames: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-vocabulary-names"),
    ),
    VocabularyFilterNames: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-vocabulary-filter-names"),
    ),
  }),
).annotations({
  identifier: "StartStreamTranscriptionResponse",
}) as any as S.Schema<StartStreamTranscriptionResponse>;
export interface UtteranceEvent {
  UtteranceId?: string;
  IsPartial?: boolean;
  ParticipantRole?: string;
  BeginOffsetMillis?: number;
  EndOffsetMillis?: number;
  Transcript?: string;
  Items?: CallAnalyticsItemList;
  Entities?: CallAnalyticsEntityList;
  Sentiment?: string;
  IssuesDetected?: IssuesDetected;
  LanguageCode?: string;
  LanguageIdentification?: CallAnalyticsLanguageIdentification;
}
export const UtteranceEvent = S.suspend(() =>
  S.Struct({
    UtteranceId: S.optional(S.String),
    IsPartial: S.optional(S.Boolean),
    ParticipantRole: S.optional(S.String),
    BeginOffsetMillis: S.optional(S.Number),
    EndOffsetMillis: S.optional(S.Number),
    Transcript: S.optional(S.String),
    Items: S.optional(CallAnalyticsItemList),
    Entities: S.optional(CallAnalyticsEntityList),
    Sentiment: S.optional(S.String),
    IssuesDetected: S.optional(IssuesDetected),
    LanguageCode: S.optional(S.String),
    LanguageIdentification: S.optional(CallAnalyticsLanguageIdentification),
  }),
).annotations({
  identifier: "UtteranceEvent",
}) as any as S.Schema<UtteranceEvent>;
export interface PointsOfInterest {
  TimestampRanges?: TimestampRanges;
}
export const PointsOfInterest = S.suspend(() =>
  S.Struct({ TimestampRanges: S.optional(TimestampRanges) }),
).annotations({
  identifier: "PointsOfInterest",
}) as any as S.Schema<PointsOfInterest>;
export interface MedicalScribeTranscriptItem {
  BeginAudioTime?: number;
  EndAudioTime?: number;
  Type?: string;
  Confidence?: number;
  Content?: string;
  VocabularyFilterMatch?: boolean;
}
export const MedicalScribeTranscriptItem = S.suspend(() =>
  S.Struct({
    BeginAudioTime: S.optional(S.Number),
    EndAudioTime: S.optional(S.Number),
    Type: S.optional(S.String),
    Confidence: S.optional(S.Number),
    Content: S.optional(S.String),
    VocabularyFilterMatch: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "MedicalScribeTranscriptItem",
}) as any as S.Schema<MedicalScribeTranscriptItem>;
export type MedicalScribeTranscriptItemList = MedicalScribeTranscriptItem[];
export const MedicalScribeTranscriptItemList = S.Array(
  MedicalScribeTranscriptItem,
);
export type MatchedCategoryDetails = { [key: string]: PointsOfInterest };
export const MatchedCategoryDetails = S.Record({
  key: S.String,
  value: PointsOfInterest,
});
export interface MedicalScribeTranscriptSegment {
  SegmentId?: string;
  BeginAudioTime?: number;
  EndAudioTime?: number;
  Content?: string;
  Items?: MedicalScribeTranscriptItemList;
  IsPartial?: boolean;
  ChannelId?: string;
}
export const MedicalScribeTranscriptSegment = S.suspend(() =>
  S.Struct({
    SegmentId: S.optional(S.String),
    BeginAudioTime: S.optional(S.Number),
    EndAudioTime: S.optional(S.Number),
    Content: S.optional(S.String),
    Items: S.optional(MedicalScribeTranscriptItemList),
    IsPartial: S.optional(S.Boolean),
    ChannelId: S.optional(S.String),
  }),
).annotations({
  identifier: "MedicalScribeTranscriptSegment",
}) as any as S.Schema<MedicalScribeTranscriptSegment>;
export interface CategoryEvent {
  MatchedCategories?: StringList;
  MatchedDetails?: MatchedCategoryDetails;
}
export const CategoryEvent = S.suspend(() =>
  S.Struct({
    MatchedCategories: S.optional(StringList),
    MatchedDetails: S.optional(MatchedCategoryDetails),
  }),
).annotations({
  identifier: "CategoryEvent",
}) as any as S.Schema<CategoryEvent>;
export interface MedicalScribeTranscriptEvent {
  TranscriptSegment?: MedicalScribeTranscriptSegment;
}
export const MedicalScribeTranscriptEvent = S.suspend(() =>
  S.Struct({ TranscriptSegment: S.optional(MedicalScribeTranscriptSegment) }),
).annotations({
  identifier: "MedicalScribeTranscriptEvent",
}) as any as S.Schema<MedicalScribeTranscriptEvent>;
export const CallAnalyticsTranscriptResultStream = T.EventStream(
  S.Union(
    S.Struct({ UtteranceEvent: UtteranceEvent }),
    S.Struct({ CategoryEvent: CategoryEvent }),
    S.Struct({
      BadRequestException: S.suspend(() => BadRequestException).annotations({
        identifier: "BadRequestException",
      }),
    }),
    S.Struct({
      LimitExceededException: S.suspend(
        () => LimitExceededException,
      ).annotations({ identifier: "LimitExceededException" }),
    }),
    S.Struct({
      InternalFailureException: S.suspend(
        () => InternalFailureException,
      ).annotations({ identifier: "InternalFailureException" }),
    }),
    S.Struct({
      ConflictException: S.suspend(() => ConflictException).annotations({
        identifier: "ConflictException",
      }),
    }),
    S.Struct({
      ServiceUnavailableException: S.suspend(
        () => ServiceUnavailableException,
      ).annotations({ identifier: "ServiceUnavailableException" }),
    }),
  ),
);
export const MedicalScribeResultStream = T.EventStream(
  S.Union(
    S.Struct({ TranscriptEvent: MedicalScribeTranscriptEvent }),
    S.Struct({
      BadRequestException: S.suspend(() => BadRequestException).annotations({
        identifier: "BadRequestException",
      }),
    }),
    S.Struct({
      LimitExceededException: S.suspend(
        () => LimitExceededException,
      ).annotations({ identifier: "LimitExceededException" }),
    }),
    S.Struct({
      InternalFailureException: S.suspend(
        () => InternalFailureException,
      ).annotations({ identifier: "InternalFailureException" }),
    }),
    S.Struct({
      ConflictException: S.suspend(() => ConflictException).annotations({
        identifier: "ConflictException",
      }),
    }),
    S.Struct({
      ServiceUnavailableException: S.suspend(
        () => ServiceUnavailableException,
      ).annotations({ identifier: "ServiceUnavailableException" }),
    }),
  ),
);
export interface StartCallAnalyticsStreamTranscriptionResponse {
  RequestId?: string;
  LanguageCode?: string;
  MediaSampleRateHertz?: number;
  MediaEncoding?: string;
  VocabularyName?: string;
  SessionId?: string;
  CallAnalyticsTranscriptResultStream?: (typeof CallAnalyticsTranscriptResultStream)["Type"];
  VocabularyFilterName?: string;
  VocabularyFilterMethod?: string;
  LanguageModelName?: string;
  IdentifyLanguage?: boolean;
  LanguageOptions?: string;
  PreferredLanguage?: string;
  VocabularyNames?: string;
  VocabularyFilterNames?: string;
  EnablePartialResultsStabilization?: boolean;
  PartialResultsStability?: string;
  ContentIdentificationType?: string;
  ContentRedactionType?: string;
  PiiEntityTypes?: string;
}
export const StartCallAnalyticsStreamTranscriptionResponse = S.suspend(() =>
  S.Struct({
    RequestId: S.optional(S.String).pipe(T.HttpHeader("x-amzn-request-id")),
    LanguageCode: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-language-code"),
    ),
    MediaSampleRateHertz: S.optional(S.Number).pipe(
      T.HttpHeader("x-amzn-transcribe-sample-rate"),
    ),
    MediaEncoding: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-media-encoding"),
    ),
    VocabularyName: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-vocabulary-name"),
    ),
    SessionId: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-session-id"),
    ),
    CallAnalyticsTranscriptResultStream: S.optional(
      CallAnalyticsTranscriptResultStream,
    ).pipe(T.HttpPayload()),
    VocabularyFilterName: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-vocabulary-filter-name"),
    ),
    VocabularyFilterMethod: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-vocabulary-filter-method"),
    ),
    LanguageModelName: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-language-model-name"),
    ),
    IdentifyLanguage: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amzn-transcribe-identify-language"),
    ),
    LanguageOptions: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-language-options"),
    ),
    PreferredLanguage: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-preferred-language"),
    ),
    VocabularyNames: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-vocabulary-names"),
    ),
    VocabularyFilterNames: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-vocabulary-filter-names"),
    ),
    EnablePartialResultsStabilization: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amzn-transcribe-enable-partial-results-stabilization"),
    ),
    PartialResultsStability: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-partial-results-stability"),
    ),
    ContentIdentificationType: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-content-identification-type"),
    ),
    ContentRedactionType: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-content-redaction-type"),
    ),
    PiiEntityTypes: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-pii-entity-types"),
    ),
  }),
).annotations({
  identifier: "StartCallAnalyticsStreamTranscriptionResponse",
}) as any as S.Schema<StartCallAnalyticsStreamTranscriptionResponse>;
export interface StartMedicalScribeStreamResponse {
  SessionId?: string;
  RequestId?: string;
  LanguageCode?: string;
  MediaSampleRateHertz?: number;
  MediaEncoding?: string;
  ResultStream?: (typeof MedicalScribeResultStream)["Type"];
}
export const StartMedicalScribeStreamResponse = S.suspend(() =>
  S.Struct({
    SessionId: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-session-id"),
    ),
    RequestId: S.optional(S.String).pipe(T.HttpHeader("x-amzn-request-id")),
    LanguageCode: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-language-code"),
    ),
    MediaSampleRateHertz: S.optional(S.Number).pipe(
      T.HttpHeader("x-amzn-transcribe-sample-rate"),
    ),
    MediaEncoding: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-transcribe-media-encoding"),
    ),
    ResultStream: S.optional(MedicalScribeResultStream).pipe(T.HttpPayload()),
  }),
).annotations({
  identifier: "StartMedicalScribeStreamResponse",
}) as any as S.Schema<StartMedicalScribeStreamResponse>;

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}

//# Operations
/**
 * Provides details about the specified Amazon Web Services HealthScribe streaming session.
 * To view the status of the streaming session, check the `StreamStatus` field in the response. To get the
 * details of post-stream analytics, including its status, check the `PostStreamAnalyticsResult` field in the response.
 */
export const getMedicalScribeStream: (
  input: GetMedicalScribeStreamRequest,
) => Effect.Effect<
  GetMedicalScribeStreamResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMedicalScribeStreamRequest,
  output: GetMedicalScribeStreamResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Starts a bidirectional HTTP/2 or WebSocket stream where audio is streamed to
 * Amazon Transcribe Medical and the transcription results are streamed to your
 * application.
 *
 * The following parameters are required:
 *
 * - `language-code`
 *
 * - `media-encoding`
 *
 * - `sample-rate`
 *
 * For more information on streaming with Amazon Transcribe Medical, see
 * Transcribing
 * streaming audio.
 */
export const startMedicalStreamTranscription: (
  input: StartMedicalStreamTranscriptionRequest,
) => Effect.Effect<
  StartMedicalStreamTranscriptionResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMedicalStreamTranscriptionRequest,
  output: StartMedicalStreamTranscriptionResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    ServiceUnavailableException,
  ],
}));
/**
 * Starts a bidirectional HTTP/2 or WebSocket stream where audio is streamed to
 * Amazon Transcribe and the transcription results are streamed to your application.
 *
 * The following parameters are required:
 *
 * - `language-code` or `identify-language` or `identify-multiple-language`
 *
 * - `media-encoding`
 *
 * - `sample-rate`
 *
 * For more information on streaming with Amazon Transcribe, see Transcribing streaming audio.
 */
export const startStreamTranscription: (
  input: StartStreamTranscriptionRequest,
) => Effect.Effect<
  StartStreamTranscriptionResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartStreamTranscriptionRequest,
  output: StartStreamTranscriptionResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    ServiceUnavailableException,
  ],
}));
/**
 * Starts a bidirectional HTTP/2 or WebSocket stream where audio is streamed to
 * Amazon Transcribe and the transcription results are streamed to your application. Use this operation
 * for Call Analytics transcriptions.
 *
 * The following parameters are required:
 *
 * - `language-code` or `identify-language`
 *
 * - `media-encoding`
 *
 * - `sample-rate`
 *
 * For more information on streaming with Amazon Transcribe, see Transcribing streaming audio.
 */
export const startCallAnalyticsStreamTranscription: (
  input: StartCallAnalyticsStreamTranscriptionRequest,
) => Effect.Effect<
  StartCallAnalyticsStreamTranscriptionResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartCallAnalyticsStreamTranscriptionRequest,
  output: StartCallAnalyticsStreamTranscriptionResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    ServiceUnavailableException,
  ],
}));
/**
 * Starts a bidirectional HTTP/2 stream, where audio is streamed to
 * Amazon Web Services HealthScribe
 * and the transcription results are streamed to your application.
 *
 * When you start a stream, you first specify the stream configuration in a `MedicalScribeConfigurationEvent`.
 * This event includes channel definitions, encryption settings, medical scribe context, and post-stream analytics settings, such as the output configuration for aggregated transcript and clinical note generation. These are additional
 * streaming session configurations beyond those provided in your initial start request headers. Whether you are starting a new session or resuming an existing session,
 * your first event must be a `MedicalScribeConfigurationEvent`.
 *
 * After you send a `MedicalScribeConfigurationEvent`, you start `AudioEvents` and Amazon Web Services HealthScribe
 * responds with real-time transcription results. When you are finished, to start processing the results with the post-stream analytics, send a `MedicalScribeSessionControlEvent` with a `Type` of
 * `END_OF_SESSION` and Amazon Web Services HealthScribe starts the analytics.
 *
 * You can pause or resume streaming.
 * To pause streaming, complete the input stream without sending the
 * `MedicalScribeSessionControlEvent`.
 * To resume streaming, call the `StartMedicalScribeStream` and specify the same SessionId you used to start the stream.
 *
 * The following parameters are required:
 *
 * - `language-code`
 *
 * - `media-encoding`
 *
 * - `media-sample-rate-hertz`
 *
 * For more information on streaming with
 * Amazon Web Services HealthScribe,
 * see Amazon Web Services HealthScribe.
 */
export const startMedicalScribeStream: (
  input: StartMedicalScribeStreamRequest,
) => Effect.Effect<
  StartMedicalScribeStreamResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMedicalScribeStreamRequest,
  output: StartMedicalScribeStreamResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    ServiceUnavailableException,
  ],
}));
