import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Transcribe Streaming",
  serviceShapeName: "Transcribe",
});
const auth = T.AwsAuthSigv4({ name: "transcribe" });
const ver = T.ServiceVersion("2017-10-26");
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
                        url: "https://transcribestreaming-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://transcribestreaming-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://transcribestreaming.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://transcribestreaming.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetMedicalScribeStreamRequest extends S.Class<GetMedicalScribeStreamRequest>(
  "GetMedicalScribeStreamRequest",
)(
  { SessionId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/medical-scribe-stream/{SessionId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AudioEvent extends S.Class<AudioEvent>("AudioEvent")({
  AudioChunk: S.optional(T.Blob).pipe(T.EventPayload()),
}) {}
export class ChannelDefinition extends S.Class<ChannelDefinition>(
  "ChannelDefinition",
)({ ChannelId: S.Number, ParticipantRole: S.String }) {}
export const ChannelDefinitions = S.Array(ChannelDefinition);
export class PostCallAnalyticsSettings extends S.Class<PostCallAnalyticsSettings>(
  "PostCallAnalyticsSettings",
)({
  OutputLocation: S.String,
  DataAccessRoleArn: S.String,
  ContentRedactionOutput: S.optional(S.String),
  OutputEncryptionKMSKeyId: S.optional(S.String),
}) {}
export class ConfigurationEvent extends S.Class<ConfigurationEvent>(
  "ConfigurationEvent",
)({
  ChannelDefinitions: S.optional(ChannelDefinitions),
  PostCallAnalyticsSettings: S.optional(PostCallAnalyticsSettings),
}) {}
export const AudioStream = T.InputEventStream(
  S.Union(
    S.Struct({ AudioEvent: AudioEvent }),
    S.Struct({ ConfigurationEvent: ConfigurationEvent }),
  ),
);
export class StartMedicalStreamTranscriptionRequest extends S.Class<StartMedicalStreamTranscriptionRequest>(
  "StartMedicalStreamTranscriptionRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "POST", uri: "/medical-stream-transcription" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartStreamTranscriptionRequest extends S.Class<StartStreamTranscriptionRequest>(
  "StartStreamTranscriptionRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "POST", uri: "/stream-transcription" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class MedicalScribeAudioEvent extends S.Class<MedicalScribeAudioEvent>(
  "MedicalScribeAudioEvent",
)({ AudioChunk: T.Blob.pipe(T.EventPayload()) }) {}
export class MedicalScribeSessionControlEvent extends S.Class<MedicalScribeSessionControlEvent>(
  "MedicalScribeSessionControlEvent",
)({ Type: S.String }) {}
export class MedicalScribeChannelDefinition extends S.Class<MedicalScribeChannelDefinition>(
  "MedicalScribeChannelDefinition",
)({ ChannelId: S.Number, ParticipantRole: S.String }) {}
export const MedicalScribeChannelDefinitions = S.Array(
  MedicalScribeChannelDefinition,
);
export const KMSEncryptionContextMap = S.Record({
  key: S.String,
  value: S.String,
});
export class ClinicalNoteGenerationSettings extends S.Class<ClinicalNoteGenerationSettings>(
  "ClinicalNoteGenerationSettings",
)({ OutputBucketName: S.String, NoteTemplate: S.optional(S.String) }) {}
export class MedicalScribePatientContext extends S.Class<MedicalScribePatientContext>(
  "MedicalScribePatientContext",
)({ Pronouns: S.optional(S.String) }) {}
export class ClinicalNoteGenerationResult extends S.Class<ClinicalNoteGenerationResult>(
  "ClinicalNoteGenerationResult",
)({
  ClinicalNoteOutputLocation: S.optional(S.String),
  TranscriptOutputLocation: S.optional(S.String),
  Status: S.optional(S.String),
  FailureReason: S.optional(S.String),
}) {}
export class MedicalScribeEncryptionSettings extends S.Class<MedicalScribeEncryptionSettings>(
  "MedicalScribeEncryptionSettings",
)({
  KmsEncryptionContext: S.optional(KMSEncryptionContextMap),
  KmsKeyId: S.String,
}) {}
export class MedicalScribePostStreamAnalyticsSettings extends S.Class<MedicalScribePostStreamAnalyticsSettings>(
  "MedicalScribePostStreamAnalyticsSettings",
)({ ClinicalNoteGenerationSettings: ClinicalNoteGenerationSettings }) {}
export class MedicalScribeContext extends S.Class<MedicalScribeContext>(
  "MedicalScribeContext",
)({ PatientContext: S.optional(MedicalScribePatientContext) }) {}
export class StartCallAnalyticsStreamTranscriptionRequest extends S.Class<StartCallAnalyticsStreamTranscriptionRequest>(
  "StartCallAnalyticsStreamTranscriptionRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "POST", uri: "/call-analytics-stream-transcription" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class MedicalScribePostStreamAnalyticsResult extends S.Class<MedicalScribePostStreamAnalyticsResult>(
  "MedicalScribePostStreamAnalyticsResult",
)({ ClinicalNoteGenerationResult: S.optional(ClinicalNoteGenerationResult) }) {}
export class MedicalScribeConfigurationEvent extends S.Class<MedicalScribeConfigurationEvent>(
  "MedicalScribeConfigurationEvent",
)({
  VocabularyName: S.optional(S.String),
  VocabularyFilterName: S.optional(S.String),
  VocabularyFilterMethod: S.optional(S.String),
  ResourceAccessRoleArn: S.String,
  ChannelDefinitions: S.optional(MedicalScribeChannelDefinitions),
  EncryptionSettings: S.optional(MedicalScribeEncryptionSettings),
  PostStreamAnalyticsSettings: MedicalScribePostStreamAnalyticsSettings,
  MedicalScribeContext: S.optional(MedicalScribeContext),
}) {}
export class MedicalScribeStreamDetails extends S.Class<MedicalScribeStreamDetails>(
  "MedicalScribeStreamDetails",
)({
  SessionId: S.optional(S.String),
  StreamCreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
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
  PostStreamAnalyticsResult: S.optional(MedicalScribePostStreamAnalyticsResult),
  MedicalScribeContextProvided: S.optional(S.Boolean),
}) {}
export const MedicalScribeInputStream = T.InputEventStream(
  S.Union(
    S.Struct({ AudioEvent: MedicalScribeAudioEvent }),
    S.Struct({ SessionControlEvent: MedicalScribeSessionControlEvent }),
    S.Struct({ ConfigurationEvent: MedicalScribeConfigurationEvent }),
  ),
);
export class GetMedicalScribeStreamResponse extends S.Class<GetMedicalScribeStreamResponse>(
  "GetMedicalScribeStreamResponse",
)({ MedicalScribeStreamDetails: S.optional(MedicalScribeStreamDetails) }) {}
export class StartMedicalScribeStreamRequest extends S.Class<StartMedicalScribeStreamRequest>(
  "StartMedicalScribeStreamRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "POST", uri: "/medical-scribe-stream" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class LanguageWithScore extends S.Class<LanguageWithScore>(
  "LanguageWithScore",
)({ LanguageCode: S.optional(S.String), Score: S.optional(S.Number) }) {}
export const LanguageIdentification = S.Array(LanguageWithScore);
export class MedicalItem extends S.Class<MedicalItem>("MedicalItem")({
  StartTime: S.optional(S.Number),
  EndTime: S.optional(S.Number),
  Type: S.optional(S.String),
  Content: S.optional(S.String),
  Confidence: S.optional(S.Number),
  Speaker: S.optional(S.String),
}) {}
export const MedicalItemList = S.Array(MedicalItem);
export class MedicalEntity extends S.Class<MedicalEntity>("MedicalEntity")({
  StartTime: S.optional(S.Number),
  EndTime: S.optional(S.Number),
  Category: S.optional(S.String),
  Content: S.optional(S.String),
  Confidence: S.optional(S.Number),
}) {}
export const MedicalEntityList = S.Array(MedicalEntity);
export class Item extends S.Class<Item>("Item")({
  StartTime: S.optional(S.Number),
  EndTime: S.optional(S.Number),
  Type: S.optional(S.String),
  Content: S.optional(S.String),
  VocabularyFilterMatch: S.optional(S.Boolean),
  Speaker: S.optional(S.String),
  Confidence: S.optional(S.Number),
  Stable: S.optional(S.Boolean),
}) {}
export const ItemList = S.Array(Item);
export class Entity extends S.Class<Entity>("Entity")({
  StartTime: S.optional(S.Number),
  EndTime: S.optional(S.Number),
  Category: S.optional(S.String),
  Type: S.optional(S.String),
  Content: S.optional(S.String),
  Confidence: S.optional(S.Number),
}) {}
export const EntityList = S.Array(Entity);
export const StringList = S.Array(S.String);
export class MedicalAlternative extends S.Class<MedicalAlternative>(
  "MedicalAlternative",
)({
  Transcript: S.optional(S.String),
  Items: S.optional(MedicalItemList),
  Entities: S.optional(MedicalEntityList),
}) {}
export const MedicalAlternativeList = S.Array(MedicalAlternative);
export class Alternative extends S.Class<Alternative>("Alternative")({
  Transcript: S.optional(S.String),
  Items: S.optional(ItemList),
  Entities: S.optional(EntityList),
}) {}
export const AlternativeList = S.Array(Alternative);
export class MedicalResult extends S.Class<MedicalResult>("MedicalResult")({
  ResultId: S.optional(S.String),
  StartTime: S.optional(S.Number),
  EndTime: S.optional(S.Number),
  IsPartial: S.optional(S.Boolean),
  Alternatives: S.optional(MedicalAlternativeList),
  ChannelId: S.optional(S.String),
}) {}
export const MedicalResultList = S.Array(MedicalResult);
export class Result extends S.Class<Result>("Result")({
  ResultId: S.optional(S.String),
  StartTime: S.optional(S.Number),
  EndTime: S.optional(S.Number),
  IsPartial: S.optional(S.Boolean),
  Alternatives: S.optional(AlternativeList),
  ChannelId: S.optional(S.String),
  LanguageCode: S.optional(S.String),
  LanguageIdentification: S.optional(LanguageIdentification),
}) {}
export const ResultList = S.Array(Result);
export class CallAnalyticsItem extends S.Class<CallAnalyticsItem>(
  "CallAnalyticsItem",
)({
  BeginOffsetMillis: S.optional(S.Number),
  EndOffsetMillis: S.optional(S.Number),
  Type: S.optional(S.String),
  Content: S.optional(S.String),
  Confidence: S.optional(S.Number),
  VocabularyFilterMatch: S.optional(S.Boolean),
  Stable: S.optional(S.Boolean),
}) {}
export const CallAnalyticsItemList = S.Array(CallAnalyticsItem);
export class CallAnalyticsEntity extends S.Class<CallAnalyticsEntity>(
  "CallAnalyticsEntity",
)({
  BeginOffsetMillis: S.optional(S.Number),
  EndOffsetMillis: S.optional(S.Number),
  Category: S.optional(S.String),
  Type: S.optional(S.String),
  Content: S.optional(S.String),
  Confidence: S.optional(S.Number),
}) {}
export const CallAnalyticsEntityList = S.Array(CallAnalyticsEntity);
export class CallAnalyticsLanguageWithScore extends S.Class<CallAnalyticsLanguageWithScore>(
  "CallAnalyticsLanguageWithScore",
)({ LanguageCode: S.optional(S.String), Score: S.optional(S.Number) }) {}
export const CallAnalyticsLanguageIdentification = S.Array(
  CallAnalyticsLanguageWithScore,
);
export class MedicalTranscript extends S.Class<MedicalTranscript>(
  "MedicalTranscript",
)({ Results: S.optional(MedicalResultList) }) {}
export class Transcript extends S.Class<Transcript>("Transcript")({
  Results: S.optional(ResultList),
}) {}
export class MedicalTranscriptEvent extends S.Class<MedicalTranscriptEvent>(
  "MedicalTranscriptEvent",
)({ Transcript: S.optional(MedicalTranscript) }) {}
export class TranscriptEvent extends S.Class<TranscriptEvent>(
  "TranscriptEvent",
)({ Transcript: S.optional(Transcript) }) {}
export class CharacterOffsets extends S.Class<CharacterOffsets>(
  "CharacterOffsets",
)({ Begin: S.optional(S.Number), End: S.optional(S.Number) }) {}
export const MedicalTranscriptResultStream = T.EventStream(
  S.Union(
    S.Struct({ TranscriptEvent: MedicalTranscriptEvent }),
    S.Struct({ BadRequestException: S.suspend(() => BadRequestException) }),
    S.Struct({
      LimitExceededException: S.suspend(() => LimitExceededException),
    }),
    S.Struct({
      InternalFailureException: S.suspend(() => InternalFailureException),
    }),
    S.Struct({ ConflictException: S.suspend(() => ConflictException) }),
    S.Struct({
      ServiceUnavailableException: S.suspend(() => ServiceUnavailableException),
    }),
  ),
);
export const TranscriptResultStream = T.EventStream(
  S.Union(
    S.Struct({ TranscriptEvent: TranscriptEvent }),
    S.Struct({ BadRequestException: S.suspend(() => BadRequestException) }),
    S.Struct({
      LimitExceededException: S.suspend(() => LimitExceededException),
    }),
    S.Struct({
      InternalFailureException: S.suspend(() => InternalFailureException),
    }),
    S.Struct({ ConflictException: S.suspend(() => ConflictException) }),
    S.Struct({
      ServiceUnavailableException: S.suspend(() => ServiceUnavailableException),
    }),
  ),
);
export class IssueDetected extends S.Class<IssueDetected>("IssueDetected")({
  CharacterOffsets: S.optional(CharacterOffsets),
}) {}
export const IssuesDetected = S.Array(IssueDetected);
export class TimestampRange extends S.Class<TimestampRange>("TimestampRange")({
  BeginOffsetMillis: S.optional(S.Number),
  EndOffsetMillis: S.optional(S.Number),
}) {}
export const TimestampRanges = S.Array(TimestampRange);
export class StartMedicalStreamTranscriptionResponse extends S.Class<StartMedicalStreamTranscriptionResponse>(
  "StartMedicalStreamTranscriptionResponse",
)({
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
}) {}
export class StartStreamTranscriptionResponse extends S.Class<StartStreamTranscriptionResponse>(
  "StartStreamTranscriptionResponse",
)({
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
}) {}
export class UtteranceEvent extends S.Class<UtteranceEvent>("UtteranceEvent")({
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
}) {}
export class PointsOfInterest extends S.Class<PointsOfInterest>(
  "PointsOfInterest",
)({ TimestampRanges: S.optional(TimestampRanges) }) {}
export class MedicalScribeTranscriptItem extends S.Class<MedicalScribeTranscriptItem>(
  "MedicalScribeTranscriptItem",
)({
  BeginAudioTime: S.optional(S.Number),
  EndAudioTime: S.optional(S.Number),
  Type: S.optional(S.String),
  Confidence: S.optional(S.Number),
  Content: S.optional(S.String),
  VocabularyFilterMatch: S.optional(S.Boolean),
}) {}
export const MedicalScribeTranscriptItemList = S.Array(
  MedicalScribeTranscriptItem,
);
export const MatchedCategoryDetails = S.Record({
  key: S.String,
  value: PointsOfInterest,
});
export class MedicalScribeTranscriptSegment extends S.Class<MedicalScribeTranscriptSegment>(
  "MedicalScribeTranscriptSegment",
)({
  SegmentId: S.optional(S.String),
  BeginAudioTime: S.optional(S.Number),
  EndAudioTime: S.optional(S.Number),
  Content: S.optional(S.String),
  Items: S.optional(MedicalScribeTranscriptItemList),
  IsPartial: S.optional(S.Boolean),
  ChannelId: S.optional(S.String),
}) {}
export class CategoryEvent extends S.Class<CategoryEvent>("CategoryEvent")({
  MatchedCategories: S.optional(StringList),
  MatchedDetails: S.optional(MatchedCategoryDetails),
}) {}
export class MedicalScribeTranscriptEvent extends S.Class<MedicalScribeTranscriptEvent>(
  "MedicalScribeTranscriptEvent",
)({ TranscriptSegment: S.optional(MedicalScribeTranscriptSegment) }) {}
export const CallAnalyticsTranscriptResultStream = T.EventStream(
  S.Union(
    S.Struct({ UtteranceEvent: UtteranceEvent }),
    S.Struct({ CategoryEvent: CategoryEvent }),
    S.Struct({ BadRequestException: S.suspend(() => BadRequestException) }),
    S.Struct({
      LimitExceededException: S.suspend(() => LimitExceededException),
    }),
    S.Struct({
      InternalFailureException: S.suspend(() => InternalFailureException),
    }),
    S.Struct({ ConflictException: S.suspend(() => ConflictException) }),
    S.Struct({
      ServiceUnavailableException: S.suspend(() => ServiceUnavailableException),
    }),
  ),
);
export const MedicalScribeResultStream = T.EventStream(
  S.Union(
    S.Struct({ TranscriptEvent: MedicalScribeTranscriptEvent }),
    S.Struct({ BadRequestException: S.suspend(() => BadRequestException) }),
    S.Struct({
      LimitExceededException: S.suspend(() => LimitExceededException),
    }),
    S.Struct({
      InternalFailureException: S.suspend(() => InternalFailureException),
    }),
    S.Struct({ ConflictException: S.suspend(() => ConflictException) }),
    S.Struct({
      ServiceUnavailableException: S.suspend(() => ServiceUnavailableException),
    }),
  ),
);
export class StartCallAnalyticsStreamTranscriptionResponse extends S.Class<StartCallAnalyticsStreamTranscriptionResponse>(
  "StartCallAnalyticsStreamTranscriptionResponse",
)({
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
}) {}
export class StartMedicalScribeStreamResponse extends S.Class<StartMedicalScribeStreamResponse>(
  "StartMedicalScribeStreamResponse",
)({
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
}) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Message: S.optional(S.String) },
) {}
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { Message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Provides details about the specified Amazon Web Services HealthScribe streaming session.
 * To view the status of the streaming session, check the `StreamStatus` field in the response. To get the
 * details of post-stream analytics, including its status, check the `PostStreamAnalyticsResult` field in the response.
 */
export const getMedicalScribeStream = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetMedicalScribeStreamRequest,
    output: GetMedicalScribeStreamResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
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
export const startMedicalStreamTranscription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startStreamTranscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartStreamTranscriptionRequest,
    output: StartStreamTranscriptionResponse,
    errors: [
      BadRequestException,
      ConflictException,
      InternalFailureException,
      LimitExceededException,
      ServiceUnavailableException,
    ],
  }),
);
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
export const startCallAnalyticsStreamTranscription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startMedicalScribeStream = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartMedicalScribeStreamRequest,
    output: StartMedicalScribeStreamResponse,
    errors: [
      BadRequestException,
      ConflictException,
      InternalFailureException,
      LimitExceededException,
      ServiceUnavailableException,
    ],
  }),
);
