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
  sdkId: "Lex Models V2",
  serviceShapeName: "LexModelBuildingServiceV2",
});
const auth = T.AwsAuthSigv4({ name: "lex" });
const ver = T.ServiceVersion("2020-08-07");
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
              `https://models-v2-lex-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://models-v2-lex-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://models-v2-lex.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://models-v2-lex.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Id = string;
export type BotVersion = string;
export type LocaleId = string;
export type DraftBotVersion = string;
export type Name = string;
export type Description = string;
export type RoleArn = string;
export type SessionTTL = number;
export type NumericalBotVersion = string;
export type ConfidenceThreshold = number;
export type ReplicaRegion = string;
export type ImportExportFilePassword = string | redacted.Redacted<string>;
export type DisplayName = string;
export type IntentSignature = string;
export type AmazonResourceName = string;
export type Policy = string;
export type Operation = string;
export type RevisionId = string;
export type BuiltInOrCustomSlotTypeId = string;
export type SlotTypeSignature = string;
export type PresignedS3Url = string;
export type SkipResourceInUseCheck = boolean;
export type BotAliasId = string;
export type SessionId = string;
export type MaxResults = number;
export type NextToken = string;
export type BuiltInsMaxResults = number;
export type AnalyticsPath = string;
export type NextIndex = number;
export type GenerationInput = string;
export type TagKey = string;
export type Phrase = string;
export type Weight = number;
export type ItemId = string;
export type ChildDirected = boolean;
export type TagValue = string;
export type BotAliasName = string;
export type BoxedBoolean = boolean;
export type VoiceId = string;
export type Utterance = string;
export type ContextTimeToLiveInSeconds = number;
export type ContextTurnsToLive = number;
export type KendraIndexArn = string;
export type QueryFilterString = string;
export type ServicePrincipal = string;
export type PrincipalArn = string;
export type ConditionOperator = string;
export type SubSlotExpression = string;
export type FilterValue = string;
export type AnalyticsFilterValue = string;
export type KmsKeyArn = string;
export type FilePassword = string | redacted.Redacted<string>;
export type S3BucketName = string;
export type S3ObjectPath = string;
export type PriorityValue = number;
export type ExceptionMessage = string;
export type FailureReason = string;
export type LocaleName = string;
export type ResourceCount = number;
export type RecommendedAction = string;
export type BedrockModelArn = string;
export type ImportedResourceId = string;
export type Count = number;
export type FulfillmentTimeout = number;
export type PromptMaxRetries = number;
export type BedrockModelCustomPrompt = string;
export type QInConnectAssistantARN = string;
export type ConditionKey = string;
export type ConditionValue = string;
export type Value = string;
export type RegexPattern = string;
export type TimeValue = number;
export type BotLocaleHistoryEventDescription = string;
export type SampleUtterancesCount = number;
export type RecordNumber = number;
export type TestSetConversationId = string;
export type TurnNumber = number;
export type SecretsManagerSecretArn = string;
export type DeepgramModelId = string;
export type Enabled = boolean;
export type FulfillmentStartResponseDelay = number;
export type FulfillmentUpdateResponseFrequency = number;
export type NonEmptyString = string;
export type DomainEndpoint = string;
export type OSIndexName = string;
export type IncludeField = string;
export type BedrockKnowledgeBaseArn = string;
export type BedrockGuardrailIdentifier = string;
export type BedrockGuardrailVersion = string;
export type SlotDefaultValueString = string;
export type StillWaitingResponseFrequency = number;
export type StillWaitingResponseTimeout = number;
export type ObjectPrefix = string;
export type RetryAfterSeconds = number;
export type LambdaARN = string;
export type CodeHookInterfaceVersion = string;
export type CloudWatchLogGroupArn = string;
export type LogPrefix = string;
export type S3BucketArn = string;
export type MaxDisambiguationIntents = number;
export type CustomDisambiguationMessage = string;
export type ConditionExpression = string;
export type QuestionField = string;
export type AnswerField = string;
export type ErrorMessage = string;
export type AnalyticsNodeCount = number;
export type AnalyticsNodeLevel = number;
export type AnalyticsChannel = string;
export type AnalyticsSessionId = string;
export type AnalyticsLongValue = number;
export type AnalyticsOriginatingRequestId = string;
export type UtteranceUnderstood = boolean;
export type Transcript = string;
export type TestSetAgentPrompt = string;
export type PlainTextMessageValue = string;
export type CustomPayloadValue = string;
export type SSMLMessageValue = string;
export type AttachmentTitle = string;
export type AttachmentUrl = string;
export type TimeInMilliSeconds = number;
export type AnalyticsBinValue = number;
export type AnalyticsGroupByValue = string;
export type AnalyticsMetricValue = number;
export type TestSetUtteranceText = string;
export type ButtonText = string;
export type ButtonValue = string;
export type MaxUtteranceDigits = number;
export type DTMFCharacter = string;
export type HitCount = number;
export type MissedCount = number;
export type ActiveContextName = string;
export type AudioFileS3Location = string;
export type TestResultSlotName = string;
export type RuntimeHintPhrase = string;

//# Schemas
export interface CreateUploadUrlRequest {}
export const CreateUploadUrlRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/createuploadurl" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateUploadUrlRequest",
}) as any as S.Schema<CreateUploadUrlRequest>;
export type BotType = "Bot" | "BotNetwork";
export const BotType = S.Literal("Bot", "BotNetwork");
export type SpeechDetectionSensitivity =
  | "Default"
  | "HighNoiseTolerance"
  | "MaximumNoiseTolerance";
export const SpeechDetectionSensitivity = S.Literal(
  "Default",
  "HighNoiseTolerance",
  "MaximumNoiseTolerance",
);
export type ImportExportFileFormat = "LexJson" | "TSV" | "CSV";
export const ImportExportFileFormat = S.Literal("LexJson", "TSV", "CSV");
export type Effect = "Allow" | "Deny";
export const Effect = S.Literal("Allow", "Deny");
export type OperationList = string[];
export const OperationList = S.Array(S.String);
export type SearchOrder = "Ascending" | "Descending";
export const SearchOrder = S.Literal("Ascending", "Descending");
export type MergeStrategy = "Overwrite" | "FailOnConflict" | "Append";
export const MergeStrategy = S.Literal("Overwrite", "FailOnConflict", "Append");
export type TestExecutionApiMode = "Streaming" | "NonStreaming";
export const TestExecutionApiMode = S.Literal("Streaming", "NonStreaming");
export type TestExecutionModality = "Text" | "Audio";
export const TestExecutionModality = S.Literal("Text", "Audio");
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface BuildBotLocaleRequest {
  botId: string;
  botVersion: string;
  localeId: string;
}
export const BuildBotLocaleRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BuildBotLocaleRequest",
}) as any as S.Schema<BuildBotLocaleRequest>;
export interface CreateBotReplicaRequest {
  botId: string;
  replicaRegion: string;
}
export const CreateBotReplicaRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    replicaRegion: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/bots/{botId}/replicas" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBotReplicaRequest",
}) as any as S.Schema<CreateBotReplicaRequest>;
export interface CreateResourcePolicyRequest {
  resourceArn: string;
  policy: string;
}
export const CreateResourcePolicyRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    policy: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/policy/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateResourcePolicyRequest",
}) as any as S.Schema<CreateResourcePolicyRequest>;
export interface CreateUploadUrlResponse {
  importId?: string;
  uploadUrl?: string;
}
export const CreateUploadUrlResponse = S.suspend(() =>
  S.Struct({ importId: S.optional(S.String), uploadUrl: S.optional(S.String) }),
).annotations({
  identifier: "CreateUploadUrlResponse",
}) as any as S.Schema<CreateUploadUrlResponse>;
export interface DeleteBotRequest {
  botId: string;
  skipResourceInUseCheck?: boolean;
}
export const DeleteBotRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    skipResourceInUseCheck: S.optional(S.Boolean).pipe(
      T.HttpQuery("skipResourceInUseCheck"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/bots/{botId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBotRequest",
}) as any as S.Schema<DeleteBotRequest>;
export interface DeleteBotAliasRequest {
  botAliasId: string;
  botId: string;
  skipResourceInUseCheck?: boolean;
}
export const DeleteBotAliasRequest = S.suspend(() =>
  S.Struct({
    botAliasId: S.String.pipe(T.HttpLabel("botAliasId")),
    botId: S.String.pipe(T.HttpLabel("botId")),
    skipResourceInUseCheck: S.optional(S.Boolean).pipe(
      T.HttpQuery("skipResourceInUseCheck"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/bots/{botId}/botaliases/{botAliasId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBotAliasRequest",
}) as any as S.Schema<DeleteBotAliasRequest>;
export interface DeleteBotLocaleRequest {
  botId: string;
  botVersion: string;
  localeId: string;
}
export const DeleteBotLocaleRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBotLocaleRequest",
}) as any as S.Schema<DeleteBotLocaleRequest>;
export interface DeleteBotReplicaRequest {
  botId: string;
  replicaRegion: string;
}
export const DeleteBotReplicaRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    replicaRegion: S.String.pipe(T.HttpLabel("replicaRegion")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/bots/{botId}/replicas/{replicaRegion}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBotReplicaRequest",
}) as any as S.Schema<DeleteBotReplicaRequest>;
export interface DeleteBotVersionRequest {
  botId: string;
  botVersion: string;
  skipResourceInUseCheck?: boolean;
}
export const DeleteBotVersionRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    skipResourceInUseCheck: S.optional(S.Boolean).pipe(
      T.HttpQuery("skipResourceInUseCheck"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/bots/{botId}/botversions/{botVersion}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBotVersionRequest",
}) as any as S.Schema<DeleteBotVersionRequest>;
export interface DeleteCustomVocabularyRequest {
  botId: string;
  botVersion: string;
  localeId: string;
}
export const DeleteCustomVocabularyRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/customvocabulary",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCustomVocabularyRequest",
}) as any as S.Schema<DeleteCustomVocabularyRequest>;
export interface DeleteExportRequest {
  exportId: string;
}
export const DeleteExportRequest = S.suspend(() =>
  S.Struct({ exportId: S.String.pipe(T.HttpLabel("exportId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/exports/{exportId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteExportRequest",
}) as any as S.Schema<DeleteExportRequest>;
export interface DeleteImportRequest {
  importId: string;
}
export const DeleteImportRequest = S.suspend(() =>
  S.Struct({ importId: S.String.pipe(T.HttpLabel("importId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/imports/{importId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteImportRequest",
}) as any as S.Schema<DeleteImportRequest>;
export interface DeleteIntentRequest {
  intentId: string;
  botId: string;
  botVersion: string;
  localeId: string;
}
export const DeleteIntentRequest = S.suspend(() =>
  S.Struct({
    intentId: S.String.pipe(T.HttpLabel("intentId")),
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/intents/{intentId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteIntentRequest",
}) as any as S.Schema<DeleteIntentRequest>;
export interface DeleteIntentResponse {}
export const DeleteIntentResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteIntentResponse",
}) as any as S.Schema<DeleteIntentResponse>;
export interface DeleteResourcePolicyRequest {
  resourceArn: string;
  expectedRevisionId?: string;
}
export const DeleteResourcePolicyRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    expectedRevisionId: S.optional(S.String).pipe(
      T.HttpQuery("expectedRevisionId"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/policy/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteResourcePolicyRequest",
}) as any as S.Schema<DeleteResourcePolicyRequest>;
export interface DeleteResourcePolicyStatementRequest {
  resourceArn: string;
  statementId: string;
  expectedRevisionId?: string;
}
export const DeleteResourcePolicyStatementRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    statementId: S.String.pipe(T.HttpLabel("statementId")),
    expectedRevisionId: S.optional(S.String).pipe(
      T.HttpQuery("expectedRevisionId"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/policy/{resourceArn}/statements/{statementId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteResourcePolicyStatementRequest",
}) as any as S.Schema<DeleteResourcePolicyStatementRequest>;
export interface DeleteSlotRequest {
  slotId: string;
  botId: string;
  botVersion: string;
  localeId: string;
  intentId: string;
}
export const DeleteSlotRequest = S.suspend(() =>
  S.Struct({
    slotId: S.String.pipe(T.HttpLabel("slotId")),
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    intentId: S.String.pipe(T.HttpLabel("intentId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/intents/{intentId}/slots/{slotId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSlotRequest",
}) as any as S.Schema<DeleteSlotRequest>;
export interface DeleteSlotResponse {}
export const DeleteSlotResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteSlotResponse",
}) as any as S.Schema<DeleteSlotResponse>;
export interface DeleteSlotTypeRequest {
  slotTypeId: string;
  botId: string;
  botVersion: string;
  localeId: string;
  skipResourceInUseCheck?: boolean;
}
export const DeleteSlotTypeRequest = S.suspend(() =>
  S.Struct({
    slotTypeId: S.String.pipe(T.HttpLabel("slotTypeId")),
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    skipResourceInUseCheck: S.optional(S.Boolean).pipe(
      T.HttpQuery("skipResourceInUseCheck"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/slottypes/{slotTypeId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSlotTypeRequest",
}) as any as S.Schema<DeleteSlotTypeRequest>;
export interface DeleteSlotTypeResponse {}
export const DeleteSlotTypeResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteSlotTypeResponse" },
) as any as S.Schema<DeleteSlotTypeResponse>;
export interface DeleteTestSetRequest {
  testSetId: string;
}
export const DeleteTestSetRequest = S.suspend(() =>
  S.Struct({ testSetId: S.String.pipe(T.HttpLabel("testSetId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/testsets/{testSetId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTestSetRequest",
}) as any as S.Schema<DeleteTestSetRequest>;
export interface DeleteTestSetResponse {}
export const DeleteTestSetResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteTestSetResponse",
}) as any as S.Schema<DeleteTestSetResponse>;
export interface DeleteUtterancesRequest {
  botId: string;
  localeId?: string;
  sessionId?: string;
}
export const DeleteUtterancesRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    localeId: S.optional(S.String).pipe(T.HttpQuery("localeId")),
    sessionId: S.optional(S.String).pipe(T.HttpQuery("sessionId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/bots/{botId}/utterances" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteUtterancesRequest",
}) as any as S.Schema<DeleteUtterancesRequest>;
export interface DeleteUtterancesResponse {}
export const DeleteUtterancesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteUtterancesResponse",
}) as any as S.Schema<DeleteUtterancesResponse>;
export interface DescribeBotRequest {
  botId: string;
}
export const DescribeBotRequest = S.suspend(() =>
  S.Struct({ botId: S.String.pipe(T.HttpLabel("botId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/bots/{botId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeBotRequest",
}) as any as S.Schema<DescribeBotRequest>;
export interface DescribeBotAliasRequest {
  botAliasId: string;
  botId: string;
}
export const DescribeBotAliasRequest = S.suspend(() =>
  S.Struct({
    botAliasId: S.String.pipe(T.HttpLabel("botAliasId")),
    botId: S.String.pipe(T.HttpLabel("botId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/bots/{botId}/botaliases/{botAliasId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeBotAliasRequest",
}) as any as S.Schema<DescribeBotAliasRequest>;
export interface DescribeBotLocaleRequest {
  botId: string;
  botVersion: string;
  localeId: string;
}
export const DescribeBotLocaleRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeBotLocaleRequest",
}) as any as S.Schema<DescribeBotLocaleRequest>;
export interface DescribeBotRecommendationRequest {
  botId: string;
  botVersion: string;
  localeId: string;
  botRecommendationId: string;
}
export const DescribeBotRecommendationRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    botRecommendationId: S.String.pipe(T.HttpLabel("botRecommendationId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/botrecommendations/{botRecommendationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeBotRecommendationRequest",
}) as any as S.Schema<DescribeBotRecommendationRequest>;
export interface DescribeBotReplicaRequest {
  botId: string;
  replicaRegion: string;
}
export const DescribeBotReplicaRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    replicaRegion: S.String.pipe(T.HttpLabel("replicaRegion")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/bots/{botId}/replicas/{replicaRegion}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeBotReplicaRequest",
}) as any as S.Schema<DescribeBotReplicaRequest>;
export interface DescribeBotResourceGenerationRequest {
  botId: string;
  botVersion: string;
  localeId: string;
  generationId: string;
}
export const DescribeBotResourceGenerationRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    generationId: S.String.pipe(T.HttpLabel("generationId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/generations/{generationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeBotResourceGenerationRequest",
}) as any as S.Schema<DescribeBotResourceGenerationRequest>;
export interface DescribeBotVersionRequest {
  botId: string;
  botVersion: string;
}
export const DescribeBotVersionRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/bots/{botId}/botversions/{botVersion}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeBotVersionRequest",
}) as any as S.Schema<DescribeBotVersionRequest>;
export interface DescribeCustomVocabularyMetadataRequest {
  botId: string;
  botVersion: string;
  localeId: string;
}
export const DescribeCustomVocabularyMetadataRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/customvocabulary/DEFAULT/metadata",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeCustomVocabularyMetadataRequest",
}) as any as S.Schema<DescribeCustomVocabularyMetadataRequest>;
export interface DescribeExportRequest {
  exportId: string;
}
export const DescribeExportRequest = S.suspend(() =>
  S.Struct({ exportId: S.String.pipe(T.HttpLabel("exportId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/exports/{exportId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeExportRequest",
}) as any as S.Schema<DescribeExportRequest>;
export interface DescribeImportRequest {
  importId: string;
}
export const DescribeImportRequest = S.suspend(() =>
  S.Struct({ importId: S.String.pipe(T.HttpLabel("importId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/imports/{importId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeImportRequest",
}) as any as S.Schema<DescribeImportRequest>;
export interface DescribeIntentRequest {
  intentId: string;
  botId: string;
  botVersion: string;
  localeId: string;
}
export const DescribeIntentRequest = S.suspend(() =>
  S.Struct({
    intentId: S.String.pipe(T.HttpLabel("intentId")),
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/intents/{intentId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeIntentRequest",
}) as any as S.Schema<DescribeIntentRequest>;
export interface DescribeResourcePolicyRequest {
  resourceArn: string;
}
export const DescribeResourcePolicyRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/policy/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeResourcePolicyRequest",
}) as any as S.Schema<DescribeResourcePolicyRequest>;
export interface DescribeSlotRequest {
  slotId: string;
  botId: string;
  botVersion: string;
  localeId: string;
  intentId: string;
}
export const DescribeSlotRequest = S.suspend(() =>
  S.Struct({
    slotId: S.String.pipe(T.HttpLabel("slotId")),
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    intentId: S.String.pipe(T.HttpLabel("intentId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/intents/{intentId}/slots/{slotId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSlotRequest",
}) as any as S.Schema<DescribeSlotRequest>;
export interface DescribeSlotTypeRequest {
  slotTypeId: string;
  botId: string;
  botVersion: string;
  localeId: string;
}
export const DescribeSlotTypeRequest = S.suspend(() =>
  S.Struct({
    slotTypeId: S.String.pipe(T.HttpLabel("slotTypeId")),
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/slottypes/{slotTypeId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSlotTypeRequest",
}) as any as S.Schema<DescribeSlotTypeRequest>;
export interface DescribeTestExecutionRequest {
  testExecutionId: string;
}
export const DescribeTestExecutionRequest = S.suspend(() =>
  S.Struct({
    testExecutionId: S.String.pipe(T.HttpLabel("testExecutionId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/testexecutions/{testExecutionId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeTestExecutionRequest",
}) as any as S.Schema<DescribeTestExecutionRequest>;
export interface DescribeTestSetRequest {
  testSetId: string;
}
export const DescribeTestSetRequest = S.suspend(() =>
  S.Struct({ testSetId: S.String.pipe(T.HttpLabel("testSetId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/testsets/{testSetId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeTestSetRequest",
}) as any as S.Schema<DescribeTestSetRequest>;
export interface DescribeTestSetDiscrepancyReportRequest {
  testSetDiscrepancyReportId: string;
}
export const DescribeTestSetDiscrepancyReportRequest = S.suspend(() =>
  S.Struct({
    testSetDiscrepancyReportId: S.String.pipe(
      T.HttpLabel("testSetDiscrepancyReportId"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/testsetdiscrepancy/{testSetDiscrepancyReportId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeTestSetDiscrepancyReportRequest",
}) as any as S.Schema<DescribeTestSetDiscrepancyReportRequest>;
export interface DescribeTestSetGenerationRequest {
  testSetGenerationId: string;
}
export const DescribeTestSetGenerationRequest = S.suspend(() =>
  S.Struct({
    testSetGenerationId: S.String.pipe(T.HttpLabel("testSetGenerationId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/testsetgenerations/{testSetGenerationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeTestSetGenerationRequest",
}) as any as S.Schema<DescribeTestSetGenerationRequest>;
export interface GenerateBotElementRequest {
  intentId: string;
  botId: string;
  botVersion: string;
  localeId: string;
}
export const GenerateBotElementRequest = S.suspend(() =>
  S.Struct({
    intentId: S.String,
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/generate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GenerateBotElementRequest",
}) as any as S.Schema<GenerateBotElementRequest>;
export interface GetTestExecutionArtifactsUrlRequest {
  testExecutionId: string;
}
export const GetTestExecutionArtifactsUrlRequest = S.suspend(() =>
  S.Struct({
    testExecutionId: S.String.pipe(T.HttpLabel("testExecutionId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/testexecutions/{testExecutionId}/artifacturl",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTestExecutionArtifactsUrlRequest",
}) as any as S.Schema<GetTestExecutionArtifactsUrlRequest>;
export interface ListBotAliasesRequest {
  botId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListBotAliasesRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/bots/{botId}/botaliases" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBotAliasesRequest",
}) as any as S.Schema<ListBotAliasesRequest>;
export interface ListBotAliasReplicasRequest {
  botId: string;
  replicaRegion: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListBotAliasReplicasRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    replicaRegion: S.String.pipe(T.HttpLabel("replicaRegion")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/bots/{botId}/replicas/{replicaRegion}/botaliases",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBotAliasReplicasRequest",
}) as any as S.Schema<ListBotAliasReplicasRequest>;
export interface ListBotRecommendationsRequest {
  botId: string;
  botVersion: string;
  localeId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListBotRecommendationsRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/botrecommendations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBotRecommendationsRequest",
}) as any as S.Schema<ListBotRecommendationsRequest>;
export interface ListBotReplicasRequest {
  botId: string;
}
export const ListBotReplicasRequest = S.suspend(() =>
  S.Struct({ botId: S.String.pipe(T.HttpLabel("botId")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/bots/{botId}/replicas" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBotReplicasRequest",
}) as any as S.Schema<ListBotReplicasRequest>;
export interface ListCustomVocabularyItemsRequest {
  botId: string;
  botVersion: string;
  localeId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListCustomVocabularyItemsRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/customvocabulary/DEFAULT/list",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCustomVocabularyItemsRequest",
}) as any as S.Schema<ListCustomVocabularyItemsRequest>;
export interface ListRecommendedIntentsRequest {
  botId: string;
  botVersion: string;
  localeId: string;
  botRecommendationId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListRecommendedIntentsRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    botRecommendationId: S.String.pipe(T.HttpLabel("botRecommendationId")),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/botrecommendations/{botRecommendationId}/intents",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRecommendedIntentsRequest",
}) as any as S.Schema<ListRecommendedIntentsRequest>;
export interface ListTagsForResourceRequest {
  resourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceARN: S.String.pipe(T.HttpLabel("resourceARN")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceARN}" }),
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
export interface ListTestSetRecordsRequest {
  testSetId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListTestSetRecordsRequest = S.suspend(() =>
  S.Struct({
    testSetId: S.String.pipe(T.HttpLabel("testSetId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/testsets/{testSetId}/records" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTestSetRecordsRequest",
}) as any as S.Schema<ListTestSetRecordsRequest>;
export interface StartBotResourceGenerationRequest {
  generationInputPrompt: string;
  botId: string;
  botVersion: string;
  localeId: string;
}
export const StartBotResourceGenerationRequest = S.suspend(() =>
  S.Struct({
    generationInputPrompt: S.String,
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/startgeneration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartBotResourceGenerationRequest",
}) as any as S.Schema<StartBotResourceGenerationRequest>;
export interface StopBotRecommendationRequest {
  botId: string;
  botVersion: string;
  localeId: string;
  botRecommendationId: string;
}
export const StopBotRecommendationRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    botRecommendationId: S.String.pipe(T.HttpLabel("botRecommendationId")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/botrecommendations/{botRecommendationId}/stopbotrecommendation",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopBotRecommendationRequest",
}) as any as S.Schema<StopBotRecommendationRequest>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface TagResourceRequest {
  resourceARN: string;
  tags: { [key: string]: string };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceARN: S.String.pipe(T.HttpLabel("resourceARN")),
    tags: TagMap,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceARN}" }),
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
  resourceARN: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceARN: S.String.pipe(T.HttpLabel("resourceARN")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceARN}" }),
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
export interface DataPrivacy {
  childDirected: boolean;
}
export const DataPrivacy = S.suspend(() =>
  S.Struct({ childDirected: S.Boolean }),
).annotations({ identifier: "DataPrivacy" }) as any as S.Schema<DataPrivacy>;
export interface BotMember {
  botMemberId: string;
  botMemberName: string;
  botMemberAliasId: string;
  botMemberAliasName: string;
  botMemberVersion: string;
}
export const BotMember = S.suspend(() =>
  S.Struct({
    botMemberId: S.String,
    botMemberName: S.String,
    botMemberAliasId: S.String,
    botMemberAliasName: S.String,
    botMemberVersion: S.String,
  }),
).annotations({ identifier: "BotMember" }) as any as S.Schema<BotMember>;
export type BotMembers = BotMember[];
export const BotMembers = S.Array(BotMember);
export interface ErrorLogSettings {
  enabled: boolean;
}
export const ErrorLogSettings = S.suspend(() =>
  S.Struct({ enabled: S.Boolean }),
).annotations({
  identifier: "ErrorLogSettings",
}) as any as S.Schema<ErrorLogSettings>;
export interface UpdateBotRequest {
  botId: string;
  botName: string;
  description?: string;
  roleArn: string;
  dataPrivacy: DataPrivacy;
  idleSessionTTLInSeconds: number;
  botType?: BotType;
  botMembers?: BotMember[];
  errorLogSettings?: ErrorLogSettings;
}
export const UpdateBotRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botName: S.String,
    description: S.optional(S.String),
    roleArn: S.String,
    dataPrivacy: DataPrivacy,
    idleSessionTTLInSeconds: S.Number,
    botType: S.optional(BotType),
    botMembers: S.optional(BotMembers),
    errorLogSettings: S.optional(ErrorLogSettings),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/bots/{botId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBotRequest",
}) as any as S.Schema<UpdateBotRequest>;
export interface LambdaCodeHook {
  lambdaARN: string;
  codeHookInterfaceVersion: string;
}
export const LambdaCodeHook = S.suspend(() =>
  S.Struct({ lambdaARN: S.String, codeHookInterfaceVersion: S.String }),
).annotations({
  identifier: "LambdaCodeHook",
}) as any as S.Schema<LambdaCodeHook>;
export interface CodeHookSpecification {
  lambdaCodeHook: LambdaCodeHook;
}
export const CodeHookSpecification = S.suspend(() =>
  S.Struct({ lambdaCodeHook: LambdaCodeHook }),
).annotations({
  identifier: "CodeHookSpecification",
}) as any as S.Schema<CodeHookSpecification>;
export interface BotAliasLocaleSettings {
  enabled: boolean;
  codeHookSpecification?: CodeHookSpecification;
}
export const BotAliasLocaleSettings = S.suspend(() =>
  S.Struct({
    enabled: S.Boolean,
    codeHookSpecification: S.optional(CodeHookSpecification),
  }),
).annotations({
  identifier: "BotAliasLocaleSettings",
}) as any as S.Schema<BotAliasLocaleSettings>;
export type BotAliasLocaleSettingsMap = {
  [key: string]: BotAliasLocaleSettings;
};
export const BotAliasLocaleSettingsMap = S.Record({
  key: S.String,
  value: BotAliasLocaleSettings,
});
export interface CloudWatchLogGroupLogDestination {
  cloudWatchLogGroupArn: string;
  logPrefix: string;
}
export const CloudWatchLogGroupLogDestination = S.suspend(() =>
  S.Struct({ cloudWatchLogGroupArn: S.String, logPrefix: S.String }),
).annotations({
  identifier: "CloudWatchLogGroupLogDestination",
}) as any as S.Schema<CloudWatchLogGroupLogDestination>;
export interface TextLogDestination {
  cloudWatch: CloudWatchLogGroupLogDestination;
}
export const TextLogDestination = S.suspend(() =>
  S.Struct({ cloudWatch: CloudWatchLogGroupLogDestination }),
).annotations({
  identifier: "TextLogDestination",
}) as any as S.Schema<TextLogDestination>;
export interface TextLogSetting {
  enabled: boolean;
  destination: TextLogDestination;
  selectiveLoggingEnabled?: boolean;
}
export const TextLogSetting = S.suspend(() =>
  S.Struct({
    enabled: S.Boolean,
    destination: TextLogDestination,
    selectiveLoggingEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "TextLogSetting",
}) as any as S.Schema<TextLogSetting>;
export type TextLogSettingsList = TextLogSetting[];
export const TextLogSettingsList = S.Array(TextLogSetting);
export interface S3BucketLogDestination {
  kmsKeyArn?: string;
  s3BucketArn: string;
  logPrefix: string;
}
export const S3BucketLogDestination = S.suspend(() =>
  S.Struct({
    kmsKeyArn: S.optional(S.String),
    s3BucketArn: S.String,
    logPrefix: S.String,
  }),
).annotations({
  identifier: "S3BucketLogDestination",
}) as any as S.Schema<S3BucketLogDestination>;
export interface AudioLogDestination {
  s3Bucket: S3BucketLogDestination;
}
export const AudioLogDestination = S.suspend(() =>
  S.Struct({ s3Bucket: S3BucketLogDestination }),
).annotations({
  identifier: "AudioLogDestination",
}) as any as S.Schema<AudioLogDestination>;
export interface AudioLogSetting {
  enabled: boolean;
  destination: AudioLogDestination;
  selectiveLoggingEnabled?: boolean;
}
export const AudioLogSetting = S.suspend(() =>
  S.Struct({
    enabled: S.Boolean,
    destination: AudioLogDestination,
    selectiveLoggingEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AudioLogSetting",
}) as any as S.Schema<AudioLogSetting>;
export type AudioLogSettingsList = AudioLogSetting[];
export const AudioLogSettingsList = S.Array(AudioLogSetting);
export interface ConversationLogSettings {
  textLogSettings?: TextLogSetting[];
  audioLogSettings?: AudioLogSetting[];
}
export const ConversationLogSettings = S.suspend(() =>
  S.Struct({
    textLogSettings: S.optional(TextLogSettingsList),
    audioLogSettings: S.optional(AudioLogSettingsList),
  }),
).annotations({
  identifier: "ConversationLogSettings",
}) as any as S.Schema<ConversationLogSettings>;
export interface SentimentAnalysisSettings {
  detectSentiment: boolean;
}
export const SentimentAnalysisSettings = S.suspend(() =>
  S.Struct({ detectSentiment: S.Boolean }),
).annotations({
  identifier: "SentimentAnalysisSettings",
}) as any as S.Schema<SentimentAnalysisSettings>;
export interface UpdateBotAliasRequest {
  botAliasId: string;
  botAliasName: string;
  description?: string;
  botVersion?: string;
  botAliasLocaleSettings?: { [key: string]: BotAliasLocaleSettings };
  conversationLogSettings?: ConversationLogSettings;
  sentimentAnalysisSettings?: SentimentAnalysisSettings;
  botId: string;
}
export const UpdateBotAliasRequest = S.suspend(() =>
  S.Struct({
    botAliasId: S.String.pipe(T.HttpLabel("botAliasId")),
    botAliasName: S.String,
    description: S.optional(S.String),
    botVersion: S.optional(S.String),
    botAliasLocaleSettings: S.optional(BotAliasLocaleSettingsMap),
    conversationLogSettings: S.optional(ConversationLogSettings),
    sentimentAnalysisSettings: S.optional(SentimentAnalysisSettings),
    botId: S.String.pipe(T.HttpLabel("botId")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/bots/{botId}/botaliases/{botAliasId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBotAliasRequest",
}) as any as S.Schema<UpdateBotAliasRequest>;
export type VoiceEngine = "standard" | "neural" | "long-form" | "generative";
export const VoiceEngine = S.Literal(
  "standard",
  "neural",
  "long-form",
  "generative",
);
export interface VoiceSettings {
  engine?: VoiceEngine;
  voiceId: string;
}
export const VoiceSettings = S.suspend(() =>
  S.Struct({ engine: S.optional(VoiceEngine), voiceId: S.String }),
).annotations({
  identifier: "VoiceSettings",
}) as any as S.Schema<VoiceSettings>;
export interface SpeechFoundationModel {
  modelArn: string;
  voiceId?: string;
}
export const SpeechFoundationModel = S.suspend(() =>
  S.Struct({ modelArn: S.String, voiceId: S.optional(S.String) }),
).annotations({
  identifier: "SpeechFoundationModel",
}) as any as S.Schema<SpeechFoundationModel>;
export interface UnifiedSpeechSettings {
  speechFoundationModel: SpeechFoundationModel;
}
export const UnifiedSpeechSettings = S.suspend(() =>
  S.Struct({ speechFoundationModel: SpeechFoundationModel }),
).annotations({
  identifier: "UnifiedSpeechSettings",
}) as any as S.Schema<UnifiedSpeechSettings>;
export type SpeechModelPreference = "Standard" | "Neural" | "Deepgram";
export const SpeechModelPreference = S.Literal(
  "Standard",
  "Neural",
  "Deepgram",
);
export interface DeepgramSpeechModelConfig {
  apiTokenSecretArn: string;
  modelId?: string;
}
export const DeepgramSpeechModelConfig = S.suspend(() =>
  S.Struct({ apiTokenSecretArn: S.String, modelId: S.optional(S.String) }),
).annotations({
  identifier: "DeepgramSpeechModelConfig",
}) as any as S.Schema<DeepgramSpeechModelConfig>;
export interface SpeechModelConfig {
  deepgramConfig?: DeepgramSpeechModelConfig;
}
export const SpeechModelConfig = S.suspend(() =>
  S.Struct({ deepgramConfig: S.optional(DeepgramSpeechModelConfig) }),
).annotations({
  identifier: "SpeechModelConfig",
}) as any as S.Schema<SpeechModelConfig>;
export interface SpeechRecognitionSettings {
  speechModelPreference?: SpeechModelPreference;
  speechModelConfig?: SpeechModelConfig;
}
export const SpeechRecognitionSettings = S.suspend(() =>
  S.Struct({
    speechModelPreference: S.optional(SpeechModelPreference),
    speechModelConfig: S.optional(SpeechModelConfig),
  }),
).annotations({
  identifier: "SpeechRecognitionSettings",
}) as any as S.Schema<SpeechRecognitionSettings>;
export interface BedrockGuardrailConfiguration {
  identifier: string;
  version: string;
}
export const BedrockGuardrailConfiguration = S.suspend(() =>
  S.Struct({ identifier: S.String, version: S.String }),
).annotations({
  identifier: "BedrockGuardrailConfiguration",
}) as any as S.Schema<BedrockGuardrailConfiguration>;
export type BedrockTraceStatus = "ENABLED" | "DISABLED";
export const BedrockTraceStatus = S.Literal("ENABLED", "DISABLED");
export interface BedrockModelSpecification {
  modelArn: string;
  guardrail?: BedrockGuardrailConfiguration;
  traceStatus?: BedrockTraceStatus;
  customPrompt?: string;
}
export const BedrockModelSpecification = S.suspend(() =>
  S.Struct({
    modelArn: S.String,
    guardrail: S.optional(BedrockGuardrailConfiguration),
    traceStatus: S.optional(BedrockTraceStatus),
    customPrompt: S.optional(S.String),
  }),
).annotations({
  identifier: "BedrockModelSpecification",
}) as any as S.Schema<BedrockModelSpecification>;
export interface SlotResolutionImprovementSpecification {
  enabled: boolean;
  bedrockModelSpecification?: BedrockModelSpecification;
}
export const SlotResolutionImprovementSpecification = S.suspend(() =>
  S.Struct({
    enabled: S.Boolean,
    bedrockModelSpecification: S.optional(BedrockModelSpecification),
  }),
).annotations({
  identifier: "SlotResolutionImprovementSpecification",
}) as any as S.Schema<SlotResolutionImprovementSpecification>;
export type AssistedNluMode = "Primary" | "Fallback";
export const AssistedNluMode = S.Literal("Primary", "Fallback");
export interface IntentDisambiguationSettings {
  enabled: boolean;
  maxDisambiguationIntents?: number;
  customDisambiguationMessage?: string;
}
export const IntentDisambiguationSettings = S.suspend(() =>
  S.Struct({
    enabled: S.Boolean,
    maxDisambiguationIntents: S.optional(S.Number),
    customDisambiguationMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "IntentDisambiguationSettings",
}) as any as S.Schema<IntentDisambiguationSettings>;
export interface NluImprovementSpecification {
  enabled: boolean;
  assistedNluMode?: AssistedNluMode;
  intentDisambiguationSettings?: IntentDisambiguationSettings;
}
export const NluImprovementSpecification = S.suspend(() =>
  S.Struct({
    enabled: S.Boolean,
    assistedNluMode: S.optional(AssistedNluMode),
    intentDisambiguationSettings: S.optional(IntentDisambiguationSettings),
  }),
).annotations({
  identifier: "NluImprovementSpecification",
}) as any as S.Schema<NluImprovementSpecification>;
export interface RuntimeSettings {
  slotResolutionImprovement?: SlotResolutionImprovementSpecification;
  nluImprovement?: NluImprovementSpecification;
}
export const RuntimeSettings = S.suspend(() =>
  S.Struct({
    slotResolutionImprovement: S.optional(
      SlotResolutionImprovementSpecification,
    ),
    nluImprovement: S.optional(NluImprovementSpecification),
  }),
).annotations({
  identifier: "RuntimeSettings",
}) as any as S.Schema<RuntimeSettings>;
export interface DescriptiveBotBuilderSpecification {
  enabled: boolean;
  bedrockModelSpecification?: BedrockModelSpecification;
}
export const DescriptiveBotBuilderSpecification = S.suspend(() =>
  S.Struct({
    enabled: S.Boolean,
    bedrockModelSpecification: S.optional(BedrockModelSpecification),
  }),
).annotations({
  identifier: "DescriptiveBotBuilderSpecification",
}) as any as S.Schema<DescriptiveBotBuilderSpecification>;
export interface SampleUtteranceGenerationSpecification {
  enabled: boolean;
  bedrockModelSpecification?: BedrockModelSpecification;
}
export const SampleUtteranceGenerationSpecification = S.suspend(() =>
  S.Struct({
    enabled: S.Boolean,
    bedrockModelSpecification: S.optional(BedrockModelSpecification),
  }),
).annotations({
  identifier: "SampleUtteranceGenerationSpecification",
}) as any as S.Schema<SampleUtteranceGenerationSpecification>;
export interface BuildtimeSettings {
  descriptiveBotBuilder?: DescriptiveBotBuilderSpecification;
  sampleUtteranceGeneration?: SampleUtteranceGenerationSpecification;
}
export const BuildtimeSettings = S.suspend(() =>
  S.Struct({
    descriptiveBotBuilder: S.optional(DescriptiveBotBuilderSpecification),
    sampleUtteranceGeneration: S.optional(
      SampleUtteranceGenerationSpecification,
    ),
  }),
).annotations({
  identifier: "BuildtimeSettings",
}) as any as S.Schema<BuildtimeSettings>;
export interface GenerativeAISettings {
  runtimeSettings?: RuntimeSettings;
  buildtimeSettings?: BuildtimeSettings;
}
export const GenerativeAISettings = S.suspend(() =>
  S.Struct({
    runtimeSettings: S.optional(RuntimeSettings),
    buildtimeSettings: S.optional(BuildtimeSettings),
  }),
).annotations({
  identifier: "GenerativeAISettings",
}) as any as S.Schema<GenerativeAISettings>;
export interface UpdateBotLocaleRequest {
  botId: string;
  botVersion: string;
  localeId: string;
  description?: string;
  nluIntentConfidenceThreshold: number;
  voiceSettings?: VoiceSettings;
  unifiedSpeechSettings?: UnifiedSpeechSettings;
  speechRecognitionSettings?: SpeechRecognitionSettings;
  generativeAISettings?: GenerativeAISettings;
  speechDetectionSensitivity?: SpeechDetectionSensitivity;
}
export const UpdateBotLocaleRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    description: S.optional(S.String),
    nluIntentConfidenceThreshold: S.Number,
    voiceSettings: S.optional(VoiceSettings),
    unifiedSpeechSettings: S.optional(UnifiedSpeechSettings),
    speechRecognitionSettings: S.optional(SpeechRecognitionSettings),
    generativeAISettings: S.optional(GenerativeAISettings),
    speechDetectionSensitivity: S.optional(SpeechDetectionSensitivity),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBotLocaleRequest",
}) as any as S.Schema<UpdateBotLocaleRequest>;
export interface EncryptionSetting {
  kmsKeyArn?: string;
  botLocaleExportPassword?: string | redacted.Redacted<string>;
  associatedTranscriptsPassword?: string | redacted.Redacted<string>;
}
export const EncryptionSetting = S.suspend(() =>
  S.Struct({
    kmsKeyArn: S.optional(S.String),
    botLocaleExportPassword: S.optional(SensitiveString),
    associatedTranscriptsPassword: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "EncryptionSetting",
}) as any as S.Schema<EncryptionSetting>;
export interface UpdateBotRecommendationRequest {
  botId: string;
  botVersion: string;
  localeId: string;
  botRecommendationId: string;
  encryptionSetting: EncryptionSetting;
}
export const UpdateBotRecommendationRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    botRecommendationId: S.String.pipe(T.HttpLabel("botRecommendationId")),
    encryptionSetting: EncryptionSetting,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/botrecommendations/{botRecommendationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBotRecommendationRequest",
}) as any as S.Schema<UpdateBotRecommendationRequest>;
export interface UpdateExportRequest {
  exportId: string;
  filePassword?: string | redacted.Redacted<string>;
}
export const UpdateExportRequest = S.suspend(() =>
  S.Struct({
    exportId: S.String.pipe(T.HttpLabel("exportId")),
    filePassword: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/exports/{exportId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateExportRequest",
}) as any as S.Schema<UpdateExportRequest>;
export interface UpdateResourcePolicyRequest {
  resourceArn: string;
  policy: string;
  expectedRevisionId?: string;
}
export const UpdateResourcePolicyRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    policy: S.String,
    expectedRevisionId: S.optional(S.String).pipe(
      T.HttpQuery("expectedRevisionId"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/policy/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateResourcePolicyRequest",
}) as any as S.Schema<UpdateResourcePolicyRequest>;
export interface SlotDefaultValue {
  defaultValue: string;
}
export const SlotDefaultValue = S.suspend(() =>
  S.Struct({ defaultValue: S.String }),
).annotations({
  identifier: "SlotDefaultValue",
}) as any as S.Schema<SlotDefaultValue>;
export type SlotDefaultValueList = SlotDefaultValue[];
export const SlotDefaultValueList = S.Array(SlotDefaultValue);
export interface SlotDefaultValueSpecification {
  defaultValueList: SlotDefaultValue[];
}
export const SlotDefaultValueSpecification = S.suspend(() =>
  S.Struct({ defaultValueList: SlotDefaultValueList }),
).annotations({
  identifier: "SlotDefaultValueSpecification",
}) as any as S.Schema<SlotDefaultValueSpecification>;
export type SlotConstraint = "Required" | "Optional";
export const SlotConstraint = S.Literal("Required", "Optional");
export interface PlainTextMessage {
  value: string;
}
export const PlainTextMessage = S.suspend(() =>
  S.Struct({ value: S.String }),
).annotations({
  identifier: "PlainTextMessage",
}) as any as S.Schema<PlainTextMessage>;
export interface CustomPayload {
  value: string;
}
export const CustomPayload = S.suspend(() =>
  S.Struct({ value: S.String }),
).annotations({
  identifier: "CustomPayload",
}) as any as S.Schema<CustomPayload>;
export interface SSMLMessage {
  value: string;
}
export const SSMLMessage = S.suspend(() =>
  S.Struct({ value: S.String }),
).annotations({ identifier: "SSMLMessage" }) as any as S.Schema<SSMLMessage>;
export interface Button {
  text: string;
  value: string;
}
export const Button = S.suspend(() =>
  S.Struct({ text: S.String, value: S.String }),
).annotations({ identifier: "Button" }) as any as S.Schema<Button>;
export type ButtonsList = Button[];
export const ButtonsList = S.Array(Button);
export interface ImageResponseCard {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  buttons?: Button[];
}
export const ImageResponseCard = S.suspend(() =>
  S.Struct({
    title: S.String,
    subtitle: S.optional(S.String),
    imageUrl: S.optional(S.String),
    buttons: S.optional(ButtonsList),
  }),
).annotations({
  identifier: "ImageResponseCard",
}) as any as S.Schema<ImageResponseCard>;
export interface Message {
  plainTextMessage?: PlainTextMessage;
  customPayload?: CustomPayload;
  ssmlMessage?: SSMLMessage;
  imageResponseCard?: ImageResponseCard;
}
export const Message = S.suspend(() =>
  S.Struct({
    plainTextMessage: S.optional(PlainTextMessage),
    customPayload: S.optional(CustomPayload),
    ssmlMessage: S.optional(SSMLMessage),
    imageResponseCard: S.optional(ImageResponseCard),
  }),
).annotations({ identifier: "Message" }) as any as S.Schema<Message>;
export type MessageVariationsList = Message[];
export const MessageVariationsList = S.Array(Message);
export interface MessageGroup {
  message: Message;
  variations?: Message[];
}
export const MessageGroup = S.suspend(() =>
  S.Struct({ message: Message, variations: S.optional(MessageVariationsList) }),
).annotations({ identifier: "MessageGroup" }) as any as S.Schema<MessageGroup>;
export type MessageGroupsList = MessageGroup[];
export const MessageGroupsList = S.Array(MessageGroup);
export type MessageSelectionStrategy = "Random" | "Ordered";
export const MessageSelectionStrategy = S.Literal("Random", "Ordered");
export type PromptAttempt =
  | "Initial"
  | "Retry1"
  | "Retry2"
  | "Retry3"
  | "Retry4"
  | "Retry5";
export const PromptAttempt = S.Literal(
  "Initial",
  "Retry1",
  "Retry2",
  "Retry3",
  "Retry4",
  "Retry5",
);
export interface AllowedInputTypes {
  allowAudioInput: boolean;
  allowDTMFInput: boolean;
}
export const AllowedInputTypes = S.suspend(() =>
  S.Struct({ allowAudioInput: S.Boolean, allowDTMFInput: S.Boolean }),
).annotations({
  identifier: "AllowedInputTypes",
}) as any as S.Schema<AllowedInputTypes>;
export interface AudioSpecification {
  maxLengthMs: number;
  endTimeoutMs: number;
}
export const AudioSpecification = S.suspend(() =>
  S.Struct({ maxLengthMs: S.Number, endTimeoutMs: S.Number }),
).annotations({
  identifier: "AudioSpecification",
}) as any as S.Schema<AudioSpecification>;
export interface DTMFSpecification {
  maxLength: number;
  endTimeoutMs: number;
  deletionCharacter: string;
  endCharacter: string;
}
export const DTMFSpecification = S.suspend(() =>
  S.Struct({
    maxLength: S.Number,
    endTimeoutMs: S.Number,
    deletionCharacter: S.String,
    endCharacter: S.String,
  }),
).annotations({
  identifier: "DTMFSpecification",
}) as any as S.Schema<DTMFSpecification>;
export interface AudioAndDTMFInputSpecification {
  startTimeoutMs: number;
  audioSpecification?: AudioSpecification;
  dtmfSpecification?: DTMFSpecification;
}
export const AudioAndDTMFInputSpecification = S.suspend(() =>
  S.Struct({
    startTimeoutMs: S.Number,
    audioSpecification: S.optional(AudioSpecification),
    dtmfSpecification: S.optional(DTMFSpecification),
  }),
).annotations({
  identifier: "AudioAndDTMFInputSpecification",
}) as any as S.Schema<AudioAndDTMFInputSpecification>;
export interface TextInputSpecification {
  startTimeoutMs: number;
}
export const TextInputSpecification = S.suspend(() =>
  S.Struct({ startTimeoutMs: S.Number }),
).annotations({
  identifier: "TextInputSpecification",
}) as any as S.Schema<TextInputSpecification>;
export interface PromptAttemptSpecification {
  allowInterrupt?: boolean;
  allowedInputTypes: AllowedInputTypes;
  audioAndDTMFInputSpecification?: AudioAndDTMFInputSpecification;
  textInputSpecification?: TextInputSpecification;
}
export const PromptAttemptSpecification = S.suspend(() =>
  S.Struct({
    allowInterrupt: S.optional(S.Boolean),
    allowedInputTypes: AllowedInputTypes,
    audioAndDTMFInputSpecification: S.optional(AudioAndDTMFInputSpecification),
    textInputSpecification: S.optional(TextInputSpecification),
  }),
).annotations({
  identifier: "PromptAttemptSpecification",
}) as any as S.Schema<PromptAttemptSpecification>;
export type PromptAttemptsSpecificationMap = {
  [key in PromptAttempt]?: PromptAttemptSpecification;
};
export const PromptAttemptsSpecificationMap = S.partial(
  S.Record({ key: PromptAttempt, value: PromptAttemptSpecification }),
);
export interface PromptSpecification {
  messageGroups: MessageGroup[];
  maxRetries: number;
  allowInterrupt?: boolean;
  messageSelectionStrategy?: MessageSelectionStrategy;
  promptAttemptsSpecification?: { [key: string]: PromptAttemptSpecification };
}
export const PromptSpecification = S.suspend(() =>
  S.Struct({
    messageGroups: MessageGroupsList,
    maxRetries: S.Number,
    allowInterrupt: S.optional(S.Boolean),
    messageSelectionStrategy: S.optional(MessageSelectionStrategy),
    promptAttemptsSpecification: S.optional(PromptAttemptsSpecificationMap),
  }),
).annotations({
  identifier: "PromptSpecification",
}) as any as S.Schema<PromptSpecification>;
export interface SampleUtterance {
  utterance: string;
}
export const SampleUtterance = S.suspend(() =>
  S.Struct({ utterance: S.String }),
).annotations({
  identifier: "SampleUtterance",
}) as any as S.Schema<SampleUtterance>;
export type SampleUtterancesList = SampleUtterance[];
export const SampleUtterancesList = S.Array(SampleUtterance);
export interface ResponseSpecification {
  messageGroups: MessageGroup[];
  allowInterrupt?: boolean;
}
export const ResponseSpecification = S.suspend(() =>
  S.Struct({
    messageGroups: MessageGroupsList,
    allowInterrupt: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ResponseSpecification",
}) as any as S.Schema<ResponseSpecification>;
export interface StillWaitingResponseSpecification {
  messageGroups: MessageGroup[];
  frequencyInSeconds: number;
  timeoutInSeconds: number;
  allowInterrupt?: boolean;
}
export const StillWaitingResponseSpecification = S.suspend(() =>
  S.Struct({
    messageGroups: MessageGroupsList,
    frequencyInSeconds: S.Number,
    timeoutInSeconds: S.Number,
    allowInterrupt: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "StillWaitingResponseSpecification",
}) as any as S.Schema<StillWaitingResponseSpecification>;
export interface WaitAndContinueSpecification {
  waitingResponse: ResponseSpecification;
  continueResponse: ResponseSpecification;
  stillWaitingResponse?: StillWaitingResponseSpecification;
  active?: boolean;
}
export const WaitAndContinueSpecification = S.suspend(() =>
  S.Struct({
    waitingResponse: ResponseSpecification,
    continueResponse: ResponseSpecification,
    stillWaitingResponse: S.optional(StillWaitingResponseSpecification),
    active: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "WaitAndContinueSpecification",
}) as any as S.Schema<WaitAndContinueSpecification>;
export type DialogActionType =
  | "ElicitIntent"
  | "StartIntent"
  | "ElicitSlot"
  | "EvaluateConditional"
  | "InvokeDialogCodeHook"
  | "ConfirmIntent"
  | "FulfillIntent"
  | "CloseIntent"
  | "EndConversation";
export const DialogActionType = S.Literal(
  "ElicitIntent",
  "StartIntent",
  "ElicitSlot",
  "EvaluateConditional",
  "InvokeDialogCodeHook",
  "ConfirmIntent",
  "FulfillIntent",
  "CloseIntent",
  "EndConversation",
);
export interface DialogAction {
  type: DialogActionType;
  slotToElicit?: string;
  suppressNextMessage?: boolean;
}
export const DialogAction = S.suspend(() =>
  S.Struct({
    type: DialogActionType,
    slotToElicit: S.optional(S.String),
    suppressNextMessage: S.optional(S.Boolean),
  }),
).annotations({ identifier: "DialogAction" }) as any as S.Schema<DialogAction>;
export type SlotShape = "Scalar" | "List";
export const SlotShape = S.Literal("Scalar", "List");
export interface SlotValue {
  interpretedValue?: string;
}
export const SlotValue = S.suspend(() =>
  S.Struct({ interpretedValue: S.optional(S.String) }),
).annotations({ identifier: "SlotValue" }) as any as S.Schema<SlotValue>;
export interface SlotValueOverride {
  shape?: SlotShape;
  value?: SlotValue;
  values?: SlotValueOverride[];
}
export const SlotValueOverride = S.suspend(() =>
  S.Struct({
    shape: S.optional(SlotShape),
    value: S.optional(SlotValue),
    values: S.optional(
      S.suspend(() => SlotValues).annotations({ identifier: "SlotValues" }),
    ),
  }),
).annotations({
  identifier: "SlotValueOverride",
}) as any as S.Schema<SlotValueOverride>;
export type SlotValueOverrideMap = { [key: string]: SlotValueOverride };
export const SlotValueOverrideMap = S.Record({
  key: S.String,
  value: S.suspend(
    (): S.Schema<SlotValueOverride, any> => SlotValueOverride,
  ).annotations({ identifier: "SlotValueOverride" }),
});
export interface IntentOverride {
  name?: string;
  slots?: { [key: string]: SlotValueOverride };
}
export const IntentOverride = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    slots: S.optional(SlotValueOverrideMap),
  }),
).annotations({
  identifier: "IntentOverride",
}) as any as S.Schema<IntentOverride>;
export type StringMap = { [key: string]: string };
export const StringMap = S.Record({ key: S.String, value: S.String });
export interface DialogState {
  dialogAction?: DialogAction;
  intent?: IntentOverride;
  sessionAttributes?: { [key: string]: string };
}
export const DialogState = S.suspend(() =>
  S.Struct({
    dialogAction: S.optional(DialogAction),
    intent: S.optional(IntentOverride),
    sessionAttributes: S.optional(StringMap),
  }),
).annotations({ identifier: "DialogState" }) as any as S.Schema<DialogState>;
export interface Condition {
  expressionString: string;
}
export const Condition = S.suspend(() =>
  S.Struct({ expressionString: S.String }),
).annotations({ identifier: "Condition" }) as any as S.Schema<Condition>;
export interface ConditionalBranch {
  name: string;
  condition: Condition;
  nextStep: DialogState;
  response?: ResponseSpecification;
}
export const ConditionalBranch = S.suspend(() =>
  S.Struct({
    name: S.String,
    condition: Condition,
    nextStep: DialogState,
    response: S.optional(ResponseSpecification),
  }),
).annotations({
  identifier: "ConditionalBranch",
}) as any as S.Schema<ConditionalBranch>;
export type ConditionalBranches = ConditionalBranch[];
export const ConditionalBranches = S.Array(ConditionalBranch);
export interface DefaultConditionalBranch {
  nextStep?: DialogState;
  response?: ResponseSpecification;
}
export const DefaultConditionalBranch = S.suspend(() =>
  S.Struct({
    nextStep: S.optional(DialogState),
    response: S.optional(ResponseSpecification),
  }),
).annotations({
  identifier: "DefaultConditionalBranch",
}) as any as S.Schema<DefaultConditionalBranch>;
export interface ConditionalSpecification {
  active: boolean;
  conditionalBranches: ConditionalBranch[];
  defaultBranch: DefaultConditionalBranch;
}
export const ConditionalSpecification = S.suspend(() =>
  S.Struct({
    active: S.Boolean,
    conditionalBranches: ConditionalBranches,
    defaultBranch: DefaultConditionalBranch,
  }),
).annotations({
  identifier: "ConditionalSpecification",
}) as any as S.Schema<ConditionalSpecification>;
export interface PostDialogCodeHookInvocationSpecification {
  successResponse?: ResponseSpecification;
  successNextStep?: DialogState;
  successConditional?: ConditionalSpecification;
  failureResponse?: ResponseSpecification;
  failureNextStep?: DialogState;
  failureConditional?: ConditionalSpecification;
  timeoutResponse?: ResponseSpecification;
  timeoutNextStep?: DialogState;
  timeoutConditional?: ConditionalSpecification;
}
export const PostDialogCodeHookInvocationSpecification = S.suspend(() =>
  S.Struct({
    successResponse: S.optional(ResponseSpecification),
    successNextStep: S.optional(DialogState),
    successConditional: S.optional(ConditionalSpecification),
    failureResponse: S.optional(ResponseSpecification),
    failureNextStep: S.optional(DialogState),
    failureConditional: S.optional(ConditionalSpecification),
    timeoutResponse: S.optional(ResponseSpecification),
    timeoutNextStep: S.optional(DialogState),
    timeoutConditional: S.optional(ConditionalSpecification),
  }),
).annotations({
  identifier: "PostDialogCodeHookInvocationSpecification",
}) as any as S.Schema<PostDialogCodeHookInvocationSpecification>;
export interface DialogCodeHookInvocationSetting {
  enableCodeHookInvocation: boolean;
  active: boolean;
  invocationLabel?: string;
  postCodeHookSpecification: PostDialogCodeHookInvocationSpecification;
}
export const DialogCodeHookInvocationSetting = S.suspend(() =>
  S.Struct({
    enableCodeHookInvocation: S.Boolean,
    active: S.Boolean,
    invocationLabel: S.optional(S.String),
    postCodeHookSpecification: PostDialogCodeHookInvocationSpecification,
  }),
).annotations({
  identifier: "DialogCodeHookInvocationSetting",
}) as any as S.Schema<DialogCodeHookInvocationSetting>;
export interface ElicitationCodeHookInvocationSetting {
  enableCodeHookInvocation: boolean;
  invocationLabel?: string;
}
export const ElicitationCodeHookInvocationSetting = S.suspend(() =>
  S.Struct({
    enableCodeHookInvocation: S.Boolean,
    invocationLabel: S.optional(S.String),
  }),
).annotations({
  identifier: "ElicitationCodeHookInvocationSetting",
}) as any as S.Schema<ElicitationCodeHookInvocationSetting>;
export interface SlotCaptureSetting {
  captureResponse?: ResponseSpecification;
  captureNextStep?: DialogState;
  captureConditional?: ConditionalSpecification;
  failureResponse?: ResponseSpecification;
  failureNextStep?: DialogState;
  failureConditional?: ConditionalSpecification;
  codeHook?: DialogCodeHookInvocationSetting;
  elicitationCodeHook?: ElicitationCodeHookInvocationSetting;
}
export const SlotCaptureSetting = S.suspend(() =>
  S.Struct({
    captureResponse: S.optional(ResponseSpecification),
    captureNextStep: S.optional(DialogState),
    captureConditional: S.optional(ConditionalSpecification),
    failureResponse: S.optional(ResponseSpecification),
    failureNextStep: S.optional(DialogState),
    failureConditional: S.optional(ConditionalSpecification),
    codeHook: S.optional(DialogCodeHookInvocationSetting),
    elicitationCodeHook: S.optional(ElicitationCodeHookInvocationSetting),
  }),
).annotations({
  identifier: "SlotCaptureSetting",
}) as any as S.Schema<SlotCaptureSetting>;
export type SlotResolutionStrategy = "EnhancedFallback" | "Default";
export const SlotResolutionStrategy = S.Literal("EnhancedFallback", "Default");
export interface SlotResolutionSetting {
  slotResolutionStrategy: SlotResolutionStrategy;
}
export const SlotResolutionSetting = S.suspend(() =>
  S.Struct({ slotResolutionStrategy: SlotResolutionStrategy }),
).annotations({
  identifier: "SlotResolutionSetting",
}) as any as S.Schema<SlotResolutionSetting>;
export interface SlotValueElicitationSetting {
  defaultValueSpecification?: SlotDefaultValueSpecification;
  slotConstraint: SlotConstraint;
  promptSpecification?: PromptSpecification;
  sampleUtterances?: SampleUtterance[];
  waitAndContinueSpecification?: WaitAndContinueSpecification;
  slotCaptureSetting?: SlotCaptureSetting;
  slotResolutionSetting?: SlotResolutionSetting;
}
export const SlotValueElicitationSetting = S.suspend(() =>
  S.Struct({
    defaultValueSpecification: S.optional(SlotDefaultValueSpecification),
    slotConstraint: SlotConstraint,
    promptSpecification: S.optional(PromptSpecification),
    sampleUtterances: S.optional(SampleUtterancesList),
    waitAndContinueSpecification: S.optional(WaitAndContinueSpecification),
    slotCaptureSetting: S.optional(SlotCaptureSetting),
    slotResolutionSetting: S.optional(SlotResolutionSetting),
  }),
).annotations({
  identifier: "SlotValueElicitationSetting",
}) as any as S.Schema<SlotValueElicitationSetting>;
export type ObfuscationSettingType = "None" | "DefaultObfuscation";
export const ObfuscationSettingType = S.Literal("None", "DefaultObfuscation");
export interface ObfuscationSetting {
  obfuscationSettingType: ObfuscationSettingType;
}
export const ObfuscationSetting = S.suspend(() =>
  S.Struct({ obfuscationSettingType: ObfuscationSettingType }),
).annotations({
  identifier: "ObfuscationSetting",
}) as any as S.Schema<ObfuscationSetting>;
export interface MultipleValuesSetting {
  allowMultipleValues?: boolean;
}
export const MultipleValuesSetting = S.suspend(() =>
  S.Struct({ allowMultipleValues: S.optional(S.Boolean) }),
).annotations({
  identifier: "MultipleValuesSetting",
}) as any as S.Schema<MultipleValuesSetting>;
export interface SubSlotValueElicitationSetting {
  defaultValueSpecification?: SlotDefaultValueSpecification;
  promptSpecification: PromptSpecification;
  sampleUtterances?: SampleUtterance[];
  waitAndContinueSpecification?: WaitAndContinueSpecification;
}
export const SubSlotValueElicitationSetting = S.suspend(() =>
  S.Struct({
    defaultValueSpecification: S.optional(SlotDefaultValueSpecification),
    promptSpecification: PromptSpecification,
    sampleUtterances: S.optional(SampleUtterancesList),
    waitAndContinueSpecification: S.optional(WaitAndContinueSpecification),
  }),
).annotations({
  identifier: "SubSlotValueElicitationSetting",
}) as any as S.Schema<SubSlotValueElicitationSetting>;
export interface Specifications {
  slotTypeId: string;
  valueElicitationSetting: SubSlotValueElicitationSetting;
}
export const Specifications = S.suspend(() =>
  S.Struct({
    slotTypeId: S.String,
    valueElicitationSetting: SubSlotValueElicitationSetting,
  }),
).annotations({
  identifier: "Specifications",
}) as any as S.Schema<Specifications>;
export type SubSlotSpecificationMap = { [key: string]: Specifications };
export const SubSlotSpecificationMap = S.Record({
  key: S.String,
  value: Specifications,
});
export interface SubSlotSetting {
  expression?: string;
  slotSpecifications?: { [key: string]: Specifications };
}
export const SubSlotSetting = S.suspend(() =>
  S.Struct({
    expression: S.optional(S.String),
    slotSpecifications: S.optional(SubSlotSpecificationMap),
  }),
).annotations({
  identifier: "SubSlotSetting",
}) as any as S.Schema<SubSlotSetting>;
export interface UpdateSlotRequest {
  slotId: string;
  slotName: string;
  description?: string;
  slotTypeId?: string;
  valueElicitationSetting: SlotValueElicitationSetting;
  obfuscationSetting?: ObfuscationSetting;
  botId: string;
  botVersion: string;
  localeId: string;
  intentId: string;
  multipleValuesSetting?: MultipleValuesSetting;
  subSlotSetting?: SubSlotSetting;
}
export const UpdateSlotRequest = S.suspend(() =>
  S.Struct({
    slotId: S.String.pipe(T.HttpLabel("slotId")),
    slotName: S.String,
    description: S.optional(S.String),
    slotTypeId: S.optional(S.String),
    valueElicitationSetting: SlotValueElicitationSetting,
    obfuscationSetting: S.optional(ObfuscationSetting),
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    intentId: S.String.pipe(T.HttpLabel("intentId")),
    multipleValuesSetting: S.optional(MultipleValuesSetting),
    subSlotSetting: S.optional(SubSlotSetting),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/intents/{intentId}/slots/{slotId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSlotRequest",
}) as any as S.Schema<UpdateSlotRequest>;
export interface SampleValue {
  value: string;
}
export const SampleValue = S.suspend(() =>
  S.Struct({ value: S.String }),
).annotations({ identifier: "SampleValue" }) as any as S.Schema<SampleValue>;
export type SynonymList = SampleValue[];
export const SynonymList = S.Array(SampleValue);
export interface SlotTypeValue {
  sampleValue?: SampleValue;
  synonyms?: SampleValue[];
}
export const SlotTypeValue = S.suspend(() =>
  S.Struct({
    sampleValue: S.optional(SampleValue),
    synonyms: S.optional(SynonymList),
  }),
).annotations({
  identifier: "SlotTypeValue",
}) as any as S.Schema<SlotTypeValue>;
export type SlotTypeValues = SlotTypeValue[];
export const SlotTypeValues = S.Array(SlotTypeValue);
export type SlotValueResolutionStrategy =
  | "OriginalValue"
  | "TopResolution"
  | "Concatenation";
export const SlotValueResolutionStrategy = S.Literal(
  "OriginalValue",
  "TopResolution",
  "Concatenation",
);
export interface SlotValueRegexFilter {
  pattern: string;
}
export const SlotValueRegexFilter = S.suspend(() =>
  S.Struct({ pattern: S.String }),
).annotations({
  identifier: "SlotValueRegexFilter",
}) as any as S.Schema<SlotValueRegexFilter>;
export type AudioRecognitionStrategy = "UseSlotValuesAsCustomVocabulary";
export const AudioRecognitionStrategy = S.Literal(
  "UseSlotValuesAsCustomVocabulary",
);
export interface AdvancedRecognitionSetting {
  audioRecognitionStrategy?: AudioRecognitionStrategy;
}
export const AdvancedRecognitionSetting = S.suspend(() =>
  S.Struct({ audioRecognitionStrategy: S.optional(AudioRecognitionStrategy) }),
).annotations({
  identifier: "AdvancedRecognitionSetting",
}) as any as S.Schema<AdvancedRecognitionSetting>;
export interface SlotValueSelectionSetting {
  resolutionStrategy: SlotValueResolutionStrategy;
  regexFilter?: SlotValueRegexFilter;
  advancedRecognitionSetting?: AdvancedRecognitionSetting;
}
export const SlotValueSelectionSetting = S.suspend(() =>
  S.Struct({
    resolutionStrategy: SlotValueResolutionStrategy,
    regexFilter: S.optional(SlotValueRegexFilter),
    advancedRecognitionSetting: S.optional(AdvancedRecognitionSetting),
  }),
).annotations({
  identifier: "SlotValueSelectionSetting",
}) as any as S.Schema<SlotValueSelectionSetting>;
export interface GrammarSlotTypeSource {
  s3BucketName: string;
  s3ObjectKey: string;
  kmsKeyArn?: string;
}
export const GrammarSlotTypeSource = S.suspend(() =>
  S.Struct({
    s3BucketName: S.String,
    s3ObjectKey: S.String,
    kmsKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "GrammarSlotTypeSource",
}) as any as S.Schema<GrammarSlotTypeSource>;
export interface GrammarSlotTypeSetting {
  source?: GrammarSlotTypeSource;
}
export const GrammarSlotTypeSetting = S.suspend(() =>
  S.Struct({ source: S.optional(GrammarSlotTypeSource) }),
).annotations({
  identifier: "GrammarSlotTypeSetting",
}) as any as S.Schema<GrammarSlotTypeSetting>;
export interface ExternalSourceSetting {
  grammarSlotTypeSetting?: GrammarSlotTypeSetting;
}
export const ExternalSourceSetting = S.suspend(() =>
  S.Struct({ grammarSlotTypeSetting: S.optional(GrammarSlotTypeSetting) }),
).annotations({
  identifier: "ExternalSourceSetting",
}) as any as S.Schema<ExternalSourceSetting>;
export interface SubSlotTypeComposition {
  name: string;
  slotTypeId: string;
}
export const SubSlotTypeComposition = S.suspend(() =>
  S.Struct({ name: S.String, slotTypeId: S.String }),
).annotations({
  identifier: "SubSlotTypeComposition",
}) as any as S.Schema<SubSlotTypeComposition>;
export type SubSlotTypeList = SubSlotTypeComposition[];
export const SubSlotTypeList = S.Array(SubSlotTypeComposition);
export interface CompositeSlotTypeSetting {
  subSlots?: SubSlotTypeComposition[];
}
export const CompositeSlotTypeSetting = S.suspend(() =>
  S.Struct({ subSlots: S.optional(SubSlotTypeList) }),
).annotations({
  identifier: "CompositeSlotTypeSetting",
}) as any as S.Schema<CompositeSlotTypeSetting>;
export interface UpdateSlotTypeRequest {
  slotTypeId: string;
  slotTypeName: string;
  description?: string;
  slotTypeValues?: SlotTypeValue[];
  valueSelectionSetting?: SlotValueSelectionSetting;
  parentSlotTypeSignature?: string;
  botId: string;
  botVersion: string;
  localeId: string;
  externalSourceSetting?: ExternalSourceSetting;
  compositeSlotTypeSetting?: CompositeSlotTypeSetting;
}
export const UpdateSlotTypeRequest = S.suspend(() =>
  S.Struct({
    slotTypeId: S.String.pipe(T.HttpLabel("slotTypeId")),
    slotTypeName: S.String,
    description: S.optional(S.String),
    slotTypeValues: S.optional(SlotTypeValues),
    valueSelectionSetting: S.optional(SlotValueSelectionSetting),
    parentSlotTypeSignature: S.optional(S.String),
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    externalSourceSetting: S.optional(ExternalSourceSetting),
    compositeSlotTypeSetting: S.optional(CompositeSlotTypeSetting),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/slottypes/{slotTypeId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSlotTypeRequest",
}) as any as S.Schema<UpdateSlotTypeRequest>;
export interface UpdateTestSetRequest {
  testSetId: string;
  testSetName: string;
  description?: string;
}
export const UpdateTestSetRequest = S.suspend(() =>
  S.Struct({
    testSetId: S.String.pipe(T.HttpLabel("testSetId")),
    testSetName: S.String,
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/testsets/{testSetId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTestSetRequest",
}) as any as S.Schema<UpdateTestSetRequest>;
export type AggregatedUtterancesSortAttribute = "HitCount" | "MissedCount";
export const AggregatedUtterancesSortAttribute = S.Literal(
  "HitCount",
  "MissedCount",
);
export type SortOrder = "Ascending" | "Descending";
export const SortOrder = S.Literal("Ascending", "Descending");
export type AggregatedUtterancesFilterName = "Utterance";
export const AggregatedUtterancesFilterName = S.Literal("Utterance");
export type FilterValues = string[];
export const FilterValues = S.Array(S.String);
export type AggregatedUtterancesFilterOperator = "CO" | "EQ";
export const AggregatedUtterancesFilterOperator = S.Literal("CO", "EQ");
export type BotLocaleSortAttribute = "BotLocaleName";
export const BotLocaleSortAttribute = S.Literal("BotLocaleName");
export type BotLocaleFilterName = "BotLocaleName";
export const BotLocaleFilterName = S.Literal("BotLocaleName");
export type BotLocaleFilterOperator = "CO" | "EQ";
export const BotLocaleFilterOperator = S.Literal("CO", "EQ");
export type GenerationSortByAttribute = "creationStartTime" | "lastUpdatedTime";
export const GenerationSortByAttribute = S.Literal(
  "creationStartTime",
  "lastUpdatedTime",
);
export type BotSortAttribute = "BotName";
export const BotSortAttribute = S.Literal("BotName");
export type BotFilterName = "BotName" | "BotType";
export const BotFilterName = S.Literal("BotName", "BotType");
export type BotFilterOperator = "CO" | "EQ" | "NE";
export const BotFilterOperator = S.Literal("CO", "EQ", "NE");
export type BotVersionReplicaSortAttribute = "BotVersion";
export const BotVersionReplicaSortAttribute = S.Literal("BotVersion");
export type BotVersionSortAttribute = "BotVersion";
export const BotVersionSortAttribute = S.Literal("BotVersion");
export type BuiltInIntentSortAttribute = "IntentSignature";
export const BuiltInIntentSortAttribute = S.Literal("IntentSignature");
export type BuiltInSlotTypeSortAttribute = "SlotTypeSignature";
export const BuiltInSlotTypeSortAttribute = S.Literal("SlotTypeSignature");
export type ExportSortAttribute = "LastUpdatedDateTime";
export const ExportSortAttribute = S.Literal("LastUpdatedDateTime");
export type ExportFilterName = "ExportResourceType";
export const ExportFilterName = S.Literal("ExportResourceType");
export type ExportFilterOperator = "CO" | "EQ";
export const ExportFilterOperator = S.Literal("CO", "EQ");
export type ImportSortAttribute = "LastUpdatedDateTime";
export const ImportSortAttribute = S.Literal("LastUpdatedDateTime");
export type ImportFilterName = "ImportResourceType";
export const ImportFilterName = S.Literal("ImportResourceType");
export type ImportFilterOperator = "CO" | "EQ";
export const ImportFilterOperator = S.Literal("CO", "EQ");
export type AnalyticsIntentMetricName =
  | "Count"
  | "Success"
  | "Failure"
  | "Switched"
  | "Dropped";
export const AnalyticsIntentMetricName = S.Literal(
  "Count",
  "Success",
  "Failure",
  "Switched",
  "Dropped",
);
export type AnalyticsMetricStatistic = "Sum" | "Avg" | "Max";
export const AnalyticsMetricStatistic = S.Literal("Sum", "Avg", "Max");
export type AnalyticsSortOrder = "Ascending" | "Descending";
export const AnalyticsSortOrder = S.Literal("Ascending", "Descending");
export type AnalyticsBinByName = "ConversationStartTime" | "UtteranceTimestamp";
export const AnalyticsBinByName = S.Literal(
  "ConversationStartTime",
  "UtteranceTimestamp",
);
export type AnalyticsInterval = "OneHour" | "OneDay";
export const AnalyticsInterval = S.Literal("OneHour", "OneDay");
export type AnalyticsIntentField =
  | "IntentName"
  | "IntentEndState"
  | "IntentLevel";
export const AnalyticsIntentField = S.Literal(
  "IntentName",
  "IntentEndState",
  "IntentLevel",
);
export type AnalyticsIntentFilterName =
  | "BotAliasId"
  | "BotVersion"
  | "LocaleId"
  | "Modality"
  | "Channel"
  | "SessionId"
  | "OriginatingRequestId"
  | "IntentName"
  | "IntentEndState";
export const AnalyticsIntentFilterName = S.Literal(
  "BotAliasId",
  "BotVersion",
  "LocaleId",
  "Modality",
  "Channel",
  "SessionId",
  "OriginatingRequestId",
  "IntentName",
  "IntentEndState",
);
export type AnalyticsFilterOperator = "EQ" | "GT" | "LT";
export const AnalyticsFilterOperator = S.Literal("EQ", "GT", "LT");
export type AnalyticsFilterValues = string[];
export const AnalyticsFilterValues = S.Array(S.String);
export type AnalyticsCommonFilterName =
  | "BotAliasId"
  | "BotVersion"
  | "LocaleId"
  | "Modality"
  | "Channel";
export const AnalyticsCommonFilterName = S.Literal(
  "BotAliasId",
  "BotVersion",
  "LocaleId",
  "Modality",
  "Channel",
);
export type IntentSortAttribute = "IntentName" | "LastUpdatedDateTime";
export const IntentSortAttribute = S.Literal(
  "IntentName",
  "LastUpdatedDateTime",
);
export type IntentFilterName = "IntentName";
export const IntentFilterName = S.Literal("IntentName");
export type IntentFilterOperator = "CO" | "EQ";
export const IntentFilterOperator = S.Literal("CO", "EQ");
export type AnalyticsIntentStageMetricName =
  | "Count"
  | "Success"
  | "Failed"
  | "Dropped"
  | "Retry";
export const AnalyticsIntentStageMetricName = S.Literal(
  "Count",
  "Success",
  "Failed",
  "Dropped",
  "Retry",
);
export type AnalyticsIntentStageField = "IntentStageName" | "SwitchedToIntent";
export const AnalyticsIntentStageField = S.Literal(
  "IntentStageName",
  "SwitchedToIntent",
);
export type AnalyticsIntentStageFilterName =
  | "BotAliasId"
  | "BotVersion"
  | "LocaleId"
  | "Modality"
  | "Channel"
  | "SessionId"
  | "OriginatingRequestId"
  | "IntentName"
  | "IntentStageName";
export const AnalyticsIntentStageFilterName = S.Literal(
  "BotAliasId",
  "BotVersion",
  "LocaleId",
  "Modality",
  "Channel",
  "SessionId",
  "OriginatingRequestId",
  "IntentName",
  "IntentStageName",
);
export type AnalyticsSessionSortByName =
  | "ConversationStartTime"
  | "NumberOfTurns"
  | "Duration";
export const AnalyticsSessionSortByName = S.Literal(
  "ConversationStartTime",
  "NumberOfTurns",
  "Duration",
);
export type AnalyticsSessionFilterName =
  | "BotAliasId"
  | "BotVersion"
  | "LocaleId"
  | "Modality"
  | "Channel"
  | "Duration"
  | "ConversationEndState"
  | "SessionId"
  | "OriginatingRequestId"
  | "IntentPath";
export const AnalyticsSessionFilterName = S.Literal(
  "BotAliasId",
  "BotVersion",
  "LocaleId",
  "Modality",
  "Channel",
  "Duration",
  "ConversationEndState",
  "SessionId",
  "OriginatingRequestId",
  "IntentPath",
);
export type AnalyticsSessionMetricName =
  | "Count"
  | "Success"
  | "Failure"
  | "Dropped"
  | "Duration"
  | "TurnsPerConversation"
  | "Concurrency";
export const AnalyticsSessionMetricName = S.Literal(
  "Count",
  "Success",
  "Failure",
  "Dropped",
  "Duration",
  "TurnsPerConversation",
  "Concurrency",
);
export type AnalyticsSessionField = "ConversationEndState" | "LocaleId";
export const AnalyticsSessionField = S.Literal(
  "ConversationEndState",
  "LocaleId",
);
export type SlotSortAttribute = "SlotName" | "LastUpdatedDateTime";
export const SlotSortAttribute = S.Literal("SlotName", "LastUpdatedDateTime");
export type SlotFilterName = "SlotName";
export const SlotFilterName = S.Literal("SlotName");
export type SlotFilterOperator = "CO" | "EQ";
export const SlotFilterOperator = S.Literal("CO", "EQ");
export type SlotTypeSortAttribute = "SlotTypeName" | "LastUpdatedDateTime";
export const SlotTypeSortAttribute = S.Literal(
  "SlotTypeName",
  "LastUpdatedDateTime",
);
export type SlotTypeFilterName = "SlotTypeName" | "ExternalSourceType";
export const SlotTypeFilterName = S.Literal(
  "SlotTypeName",
  "ExternalSourceType",
);
export type SlotTypeFilterOperator = "CO" | "EQ";
export const SlotTypeFilterOperator = S.Literal("CO", "EQ");
export type TestResultTypeFilter =
  | "OverallTestResults"
  | "ConversationLevelTestResults"
  | "IntentClassificationTestResults"
  | "SlotResolutionTestResults"
  | "UtteranceLevelResults";
export const TestResultTypeFilter = S.Literal(
  "OverallTestResults",
  "ConversationLevelTestResults",
  "IntentClassificationTestResults",
  "SlotResolutionTestResults",
  "UtteranceLevelResults",
);
export type TestExecutionSortAttribute = "TestSetName" | "CreationDateTime";
export const TestExecutionSortAttribute = S.Literal(
  "TestSetName",
  "CreationDateTime",
);
export type TestSetSortAttribute = "TestSetName" | "LastUpdatedDateTime";
export const TestSetSortAttribute = S.Literal(
  "TestSetName",
  "LastUpdatedDateTime",
);
export type AnalyticsUtteranceSortByName = "UtteranceTimestamp";
export const AnalyticsUtteranceSortByName = S.Literal("UtteranceTimestamp");
export type AnalyticsUtteranceFilterName =
  | "BotAliasId"
  | "BotVersion"
  | "LocaleId"
  | "Modality"
  | "Channel"
  | "SessionId"
  | "OriginatingRequestId"
  | "UtteranceState"
  | "UtteranceText";
export const AnalyticsUtteranceFilterName = S.Literal(
  "BotAliasId",
  "BotVersion",
  "LocaleId",
  "Modality",
  "Channel",
  "SessionId",
  "OriginatingRequestId",
  "UtteranceState",
  "UtteranceText",
);
export type AnalyticsUtteranceMetricName =
  | "Count"
  | "Missed"
  | "Detected"
  | "UtteranceTimestamp";
export const AnalyticsUtteranceMetricName = S.Literal(
  "Count",
  "Missed",
  "Detected",
  "UtteranceTimestamp",
);
export type AnalyticsUtteranceField = "UtteranceText" | "UtteranceState";
export const AnalyticsUtteranceField = S.Literal(
  "UtteranceText",
  "UtteranceState",
);
export type AnalyticsUtteranceAttributeName = "LastUsedIntent";
export const AnalyticsUtteranceAttributeName = S.Literal("LastUsedIntent");
export type AssociatedTranscriptFilterName = "IntentId" | "SlotTypeId";
export const AssociatedTranscriptFilterName = S.Literal(
  "IntentId",
  "SlotTypeId",
);
export interface NewCustomVocabularyItem {
  phrase: string;
  weight?: number;
  displayAs?: string;
}
export const NewCustomVocabularyItem = S.suspend(() =>
  S.Struct({
    phrase: S.String,
    weight: S.optional(S.Number),
    displayAs: S.optional(S.String),
  }),
).annotations({
  identifier: "NewCustomVocabularyItem",
}) as any as S.Schema<NewCustomVocabularyItem>;
export type CreateCustomVocabularyItemsList = NewCustomVocabularyItem[];
export const CreateCustomVocabularyItemsList = S.Array(NewCustomVocabularyItem);
export interface CustomVocabularyEntryId {
  itemId: string;
}
export const CustomVocabularyEntryId = S.suspend(() =>
  S.Struct({ itemId: S.String }),
).annotations({
  identifier: "CustomVocabularyEntryId",
}) as any as S.Schema<CustomVocabularyEntryId>;
export type DeleteCustomVocabularyItemsList = CustomVocabularyEntryId[];
export const DeleteCustomVocabularyItemsList = S.Array(CustomVocabularyEntryId);
export interface CustomVocabularyItem {
  itemId: string;
  phrase: string;
  weight?: number;
  displayAs?: string;
}
export const CustomVocabularyItem = S.suspend(() =>
  S.Struct({
    itemId: S.String,
    phrase: S.String,
    weight: S.optional(S.Number),
    displayAs: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomVocabularyItem",
}) as any as S.Schema<CustomVocabularyItem>;
export type UpdateCustomVocabularyItemsList = CustomVocabularyItem[];
export const UpdateCustomVocabularyItemsList = S.Array(CustomVocabularyItem);
export type BotLocaleStatus =
  | "Creating"
  | "Building"
  | "Built"
  | "ReadyExpressTesting"
  | "Failed"
  | "Deleting"
  | "NotBuilt"
  | "Importing"
  | "Processing";
export const BotLocaleStatus = S.Literal(
  "Creating",
  "Building",
  "Built",
  "ReadyExpressTesting",
  "Failed",
  "Deleting",
  "NotBuilt",
  "Importing",
  "Processing",
);
export type BotReplicaStatus = "Enabling" | "Enabled" | "Deleting" | "Failed";
export const BotReplicaStatus = S.Literal(
  "Enabling",
  "Enabled",
  "Deleting",
  "Failed",
);
export interface DialogCodeHookSettings {
  enabled: boolean;
}
export const DialogCodeHookSettings = S.suspend(() =>
  S.Struct({ enabled: S.Boolean }),
).annotations({
  identifier: "DialogCodeHookSettings",
}) as any as S.Schema<DialogCodeHookSettings>;
export interface IntentClosingSetting {
  closingResponse?: ResponseSpecification;
  active?: boolean;
  nextStep?: DialogState;
  conditional?: ConditionalSpecification;
}
export const IntentClosingSetting = S.suspend(() =>
  S.Struct({
    closingResponse: S.optional(ResponseSpecification),
    active: S.optional(S.Boolean),
    nextStep: S.optional(DialogState),
    conditional: S.optional(ConditionalSpecification),
  }),
).annotations({
  identifier: "IntentClosingSetting",
}) as any as S.Schema<IntentClosingSetting>;
export interface InputContext {
  name: string;
}
export const InputContext = S.suspend(() =>
  S.Struct({ name: S.String }),
).annotations({ identifier: "InputContext" }) as any as S.Schema<InputContext>;
export type InputContextsList = InputContext[];
export const InputContextsList = S.Array(InputContext);
export interface OutputContext {
  name: string;
  timeToLiveInSeconds: number;
  turnsToLive: number;
}
export const OutputContext = S.suspend(() =>
  S.Struct({
    name: S.String,
    timeToLiveInSeconds: S.Number,
    turnsToLive: S.Number,
  }),
).annotations({
  identifier: "OutputContext",
}) as any as S.Schema<OutputContext>;
export type OutputContextsList = OutputContext[];
export const OutputContextsList = S.Array(OutputContext);
export interface KendraConfiguration {
  kendraIndex: string;
  queryFilterStringEnabled?: boolean;
  queryFilterString?: string;
}
export const KendraConfiguration = S.suspend(() =>
  S.Struct({
    kendraIndex: S.String,
    queryFilterStringEnabled: S.optional(S.Boolean),
    queryFilterString: S.optional(S.String),
  }),
).annotations({
  identifier: "KendraConfiguration",
}) as any as S.Schema<KendraConfiguration>;
export interface InitialResponseSetting {
  initialResponse?: ResponseSpecification;
  nextStep?: DialogState;
  conditional?: ConditionalSpecification;
  codeHook?: DialogCodeHookInvocationSetting;
}
export const InitialResponseSetting = S.suspend(() =>
  S.Struct({
    initialResponse: S.optional(ResponseSpecification),
    nextStep: S.optional(DialogState),
    conditional: S.optional(ConditionalSpecification),
    codeHook: S.optional(DialogCodeHookInvocationSetting),
  }),
).annotations({
  identifier: "InitialResponseSetting",
}) as any as S.Schema<InitialResponseSetting>;
export interface Principal {
  service?: string;
  arn?: string;
}
export const Principal = S.suspend(() =>
  S.Struct({ service: S.optional(S.String), arn: S.optional(S.String) }),
).annotations({ identifier: "Principal" }) as any as S.Schema<Principal>;
export type PrincipalList = Principal[];
export const PrincipalList = S.Array(Principal);
export type BotStatus =
  | "Creating"
  | "Available"
  | "Inactive"
  | "Deleting"
  | "Failed"
  | "Versioning"
  | "Importing"
  | "Updating";
export const BotStatus = S.Literal(
  "Creating",
  "Available",
  "Inactive",
  "Deleting",
  "Failed",
  "Versioning",
  "Importing",
  "Updating",
);
export type BotAliasStatus = "Creating" | "Available" | "Deleting" | "Failed";
export const BotAliasStatus = S.Literal(
  "Creating",
  "Available",
  "Deleting",
  "Failed",
);
export type CustomVocabularyStatus =
  | "Ready"
  | "Deleting"
  | "Exporting"
  | "Importing"
  | "Creating";
export const CustomVocabularyStatus = S.Literal(
  "Ready",
  "Deleting",
  "Exporting",
  "Importing",
  "Creating",
);
export type ExportStatus = "InProgress" | "Completed" | "Failed" | "Deleting";
export const ExportStatus = S.Literal(
  "InProgress",
  "Completed",
  "Failed",
  "Deleting",
);
export type ImportStatus = "InProgress" | "Completed" | "Failed" | "Deleting";
export const ImportStatus = S.Literal(
  "InProgress",
  "Completed",
  "Failed",
  "Deleting",
);
export type FailureReasons = string[];
export const FailureReasons = S.Array(S.String);
export type RecommendedActions = string[];
export const RecommendedActions = S.Array(S.String);
export type BotRecommendationStatus =
  | "Processing"
  | "Deleting"
  | "Deleted"
  | "Downloading"
  | "Updating"
  | "Available"
  | "Failed"
  | "Stopping"
  | "Stopped";
export const BotRecommendationStatus = S.Literal(
  "Processing",
  "Deleting",
  "Deleted",
  "Downloading",
  "Updating",
  "Available",
  "Failed",
  "Stopping",
  "Stopped",
);
export type GenerationStatus = "Failed" | "Complete" | "InProgress";
export const GenerationStatus = S.Literal("Failed", "Complete", "InProgress");
export type TestExecutionStatus =
  | "Pending"
  | "Waiting"
  | "InProgress"
  | "Completed"
  | "Failed"
  | "Stopping"
  | "Stopped";
export const TestExecutionStatus = S.Literal(
  "Pending",
  "Waiting",
  "InProgress",
  "Completed",
  "Failed",
  "Stopping",
  "Stopped",
);
export type TestSetModality = "Text" | "Audio";
export const TestSetModality = S.Literal("Text", "Audio");
export type TestSetStatus =
  | "Importing"
  | "PendingAnnotation"
  | "Deleting"
  | "ValidationError"
  | "Ready";
export const TestSetStatus = S.Literal(
  "Importing",
  "PendingAnnotation",
  "Deleting",
  "ValidationError",
  "Ready",
);
export type TestSetDiscrepancyReportStatus =
  | "InProgress"
  | "Completed"
  | "Failed";
export const TestSetDiscrepancyReportStatus = S.Literal(
  "InProgress",
  "Completed",
  "Failed",
);
export type TestSetGenerationStatus =
  | "Generating"
  | "Ready"
  | "Failed"
  | "Pending";
export const TestSetGenerationStatus = S.Literal(
  "Generating",
  "Ready",
  "Failed",
  "Pending",
);
export interface AggregatedUtterancesSortBy {
  attribute: AggregatedUtterancesSortAttribute;
  order: SortOrder;
}
export const AggregatedUtterancesSortBy = S.suspend(() =>
  S.Struct({ attribute: AggregatedUtterancesSortAttribute, order: SortOrder }),
).annotations({
  identifier: "AggregatedUtterancesSortBy",
}) as any as S.Schema<AggregatedUtterancesSortBy>;
export interface AggregatedUtterancesFilter {
  name: AggregatedUtterancesFilterName;
  values: string[];
  operator: AggregatedUtterancesFilterOperator;
}
export const AggregatedUtterancesFilter = S.suspend(() =>
  S.Struct({
    name: AggregatedUtterancesFilterName,
    values: FilterValues,
    operator: AggregatedUtterancesFilterOperator,
  }),
).annotations({
  identifier: "AggregatedUtterancesFilter",
}) as any as S.Schema<AggregatedUtterancesFilter>;
export type AggregatedUtterancesFilters = AggregatedUtterancesFilter[];
export const AggregatedUtterancesFilters = S.Array(AggregatedUtterancesFilter);
export interface BotLocaleSortBy {
  attribute: BotLocaleSortAttribute;
  order: SortOrder;
}
export const BotLocaleSortBy = S.suspend(() =>
  S.Struct({ attribute: BotLocaleSortAttribute, order: SortOrder }),
).annotations({
  identifier: "BotLocaleSortBy",
}) as any as S.Schema<BotLocaleSortBy>;
export interface BotLocaleFilter {
  name: BotLocaleFilterName;
  values: string[];
  operator: BotLocaleFilterOperator;
}
export const BotLocaleFilter = S.suspend(() =>
  S.Struct({
    name: BotLocaleFilterName,
    values: FilterValues,
    operator: BotLocaleFilterOperator,
  }),
).annotations({
  identifier: "BotLocaleFilter",
}) as any as S.Schema<BotLocaleFilter>;
export type BotLocaleFilters = BotLocaleFilter[];
export const BotLocaleFilters = S.Array(BotLocaleFilter);
export interface GenerationSortBy {
  attribute: GenerationSortByAttribute;
  order: SortOrder;
}
export const GenerationSortBy = S.suspend(() =>
  S.Struct({ attribute: GenerationSortByAttribute, order: SortOrder }),
).annotations({
  identifier: "GenerationSortBy",
}) as any as S.Schema<GenerationSortBy>;
export interface BotSortBy {
  attribute: BotSortAttribute;
  order: SortOrder;
}
export const BotSortBy = S.suspend(() =>
  S.Struct({ attribute: BotSortAttribute, order: SortOrder }),
).annotations({ identifier: "BotSortBy" }) as any as S.Schema<BotSortBy>;
export interface BotFilter {
  name: BotFilterName;
  values: string[];
  operator: BotFilterOperator;
}
export const BotFilter = S.suspend(() =>
  S.Struct({
    name: BotFilterName,
    values: FilterValues,
    operator: BotFilterOperator,
  }),
).annotations({ identifier: "BotFilter" }) as any as S.Schema<BotFilter>;
export type BotFilters = BotFilter[];
export const BotFilters = S.Array(BotFilter);
export interface BotVersionReplicaSortBy {
  attribute: BotVersionReplicaSortAttribute;
  order: SortOrder;
}
export const BotVersionReplicaSortBy = S.suspend(() =>
  S.Struct({ attribute: BotVersionReplicaSortAttribute, order: SortOrder }),
).annotations({
  identifier: "BotVersionReplicaSortBy",
}) as any as S.Schema<BotVersionReplicaSortBy>;
export interface BotVersionSortBy {
  attribute: BotVersionSortAttribute;
  order: SortOrder;
}
export const BotVersionSortBy = S.suspend(() =>
  S.Struct({ attribute: BotVersionSortAttribute, order: SortOrder }),
).annotations({
  identifier: "BotVersionSortBy",
}) as any as S.Schema<BotVersionSortBy>;
export interface BuiltInIntentSortBy {
  attribute: BuiltInIntentSortAttribute;
  order: SortOrder;
}
export const BuiltInIntentSortBy = S.suspend(() =>
  S.Struct({ attribute: BuiltInIntentSortAttribute, order: SortOrder }),
).annotations({
  identifier: "BuiltInIntentSortBy",
}) as any as S.Schema<BuiltInIntentSortBy>;
export interface BuiltInSlotTypeSortBy {
  attribute: BuiltInSlotTypeSortAttribute;
  order: SortOrder;
}
export const BuiltInSlotTypeSortBy = S.suspend(() =>
  S.Struct({ attribute: BuiltInSlotTypeSortAttribute, order: SortOrder }),
).annotations({
  identifier: "BuiltInSlotTypeSortBy",
}) as any as S.Schema<BuiltInSlotTypeSortBy>;
export type CustomVocabularyItems = CustomVocabularyItem[];
export const CustomVocabularyItems = S.Array(CustomVocabularyItem);
export interface ExportSortBy {
  attribute: ExportSortAttribute;
  order: SortOrder;
}
export const ExportSortBy = S.suspend(() =>
  S.Struct({ attribute: ExportSortAttribute, order: SortOrder }),
).annotations({ identifier: "ExportSortBy" }) as any as S.Schema<ExportSortBy>;
export interface ExportFilter {
  name: ExportFilterName;
  values: string[];
  operator: ExportFilterOperator;
}
export const ExportFilter = S.suspend(() =>
  S.Struct({
    name: ExportFilterName,
    values: FilterValues,
    operator: ExportFilterOperator,
  }),
).annotations({ identifier: "ExportFilter" }) as any as S.Schema<ExportFilter>;
export type ExportFilters = ExportFilter[];
export const ExportFilters = S.Array(ExportFilter);
export interface ImportSortBy {
  attribute: ImportSortAttribute;
  order: SortOrder;
}
export const ImportSortBy = S.suspend(() =>
  S.Struct({ attribute: ImportSortAttribute, order: SortOrder }),
).annotations({ identifier: "ImportSortBy" }) as any as S.Schema<ImportSortBy>;
export interface ImportFilter {
  name: ImportFilterName;
  values: string[];
  operator: ImportFilterOperator;
}
export const ImportFilter = S.suspend(() =>
  S.Struct({
    name: ImportFilterName,
    values: FilterValues,
    operator: ImportFilterOperator,
  }),
).annotations({ identifier: "ImportFilter" }) as any as S.Schema<ImportFilter>;
export type ImportFilters = ImportFilter[];
export const ImportFilters = S.Array(ImportFilter);
export interface AnalyticsIntentMetric {
  name: AnalyticsIntentMetricName;
  statistic: AnalyticsMetricStatistic;
  order?: AnalyticsSortOrder;
}
export const AnalyticsIntentMetric = S.suspend(() =>
  S.Struct({
    name: AnalyticsIntentMetricName,
    statistic: AnalyticsMetricStatistic,
    order: S.optional(AnalyticsSortOrder),
  }),
).annotations({
  identifier: "AnalyticsIntentMetric",
}) as any as S.Schema<AnalyticsIntentMetric>;
export type AnalyticsIntentMetrics = AnalyticsIntentMetric[];
export const AnalyticsIntentMetrics = S.Array(AnalyticsIntentMetric);
export interface AnalyticsBinBySpecification {
  name: AnalyticsBinByName;
  interval: AnalyticsInterval;
  order?: AnalyticsSortOrder;
}
export const AnalyticsBinBySpecification = S.suspend(() =>
  S.Struct({
    name: AnalyticsBinByName,
    interval: AnalyticsInterval,
    order: S.optional(AnalyticsSortOrder),
  }),
).annotations({
  identifier: "AnalyticsBinBySpecification",
}) as any as S.Schema<AnalyticsBinBySpecification>;
export type AnalyticsBinByList = AnalyticsBinBySpecification[];
export const AnalyticsBinByList = S.Array(AnalyticsBinBySpecification);
export interface AnalyticsIntentGroupBySpecification {
  name: AnalyticsIntentField;
}
export const AnalyticsIntentGroupBySpecification = S.suspend(() =>
  S.Struct({ name: AnalyticsIntentField }),
).annotations({
  identifier: "AnalyticsIntentGroupBySpecification",
}) as any as S.Schema<AnalyticsIntentGroupBySpecification>;
export type AnalyticsIntentGroupByList = AnalyticsIntentGroupBySpecification[];
export const AnalyticsIntentGroupByList = S.Array(
  AnalyticsIntentGroupBySpecification,
);
export interface AnalyticsIntentFilter {
  name: AnalyticsIntentFilterName;
  operator: AnalyticsFilterOperator;
  values: string[];
}
export const AnalyticsIntentFilter = S.suspend(() =>
  S.Struct({
    name: AnalyticsIntentFilterName,
    operator: AnalyticsFilterOperator,
    values: AnalyticsFilterValues,
  }),
).annotations({
  identifier: "AnalyticsIntentFilter",
}) as any as S.Schema<AnalyticsIntentFilter>;
export type AnalyticsIntentFilters = AnalyticsIntentFilter[];
export const AnalyticsIntentFilters = S.Array(AnalyticsIntentFilter);
export interface AnalyticsPathFilter {
  name: AnalyticsCommonFilterName;
  operator: AnalyticsFilterOperator;
  values: string[];
}
export const AnalyticsPathFilter = S.suspend(() =>
  S.Struct({
    name: AnalyticsCommonFilterName,
    operator: AnalyticsFilterOperator,
    values: AnalyticsFilterValues,
  }),
).annotations({
  identifier: "AnalyticsPathFilter",
}) as any as S.Schema<AnalyticsPathFilter>;
export type AnalyticsPathFilters = AnalyticsPathFilter[];
export const AnalyticsPathFilters = S.Array(AnalyticsPathFilter);
export interface IntentSortBy {
  attribute: IntentSortAttribute;
  order: SortOrder;
}
export const IntentSortBy = S.suspend(() =>
  S.Struct({ attribute: IntentSortAttribute, order: SortOrder }),
).annotations({ identifier: "IntentSortBy" }) as any as S.Schema<IntentSortBy>;
export interface IntentFilter {
  name: IntentFilterName;
  values: string[];
  operator: IntentFilterOperator;
}
export const IntentFilter = S.suspend(() =>
  S.Struct({
    name: IntentFilterName,
    values: FilterValues,
    operator: IntentFilterOperator,
  }),
).annotations({ identifier: "IntentFilter" }) as any as S.Schema<IntentFilter>;
export type IntentFilters = IntentFilter[];
export const IntentFilters = S.Array(IntentFilter);
export interface AnalyticsIntentStageMetric {
  name: AnalyticsIntentStageMetricName;
  statistic: AnalyticsMetricStatistic;
  order?: AnalyticsSortOrder;
}
export const AnalyticsIntentStageMetric = S.suspend(() =>
  S.Struct({
    name: AnalyticsIntentStageMetricName,
    statistic: AnalyticsMetricStatistic,
    order: S.optional(AnalyticsSortOrder),
  }),
).annotations({
  identifier: "AnalyticsIntentStageMetric",
}) as any as S.Schema<AnalyticsIntentStageMetric>;
export type AnalyticsIntentStageMetrics = AnalyticsIntentStageMetric[];
export const AnalyticsIntentStageMetrics = S.Array(AnalyticsIntentStageMetric);
export interface AnalyticsIntentStageGroupBySpecification {
  name: AnalyticsIntentStageField;
}
export const AnalyticsIntentStageGroupBySpecification = S.suspend(() =>
  S.Struct({ name: AnalyticsIntentStageField }),
).annotations({
  identifier: "AnalyticsIntentStageGroupBySpecification",
}) as any as S.Schema<AnalyticsIntentStageGroupBySpecification>;
export type AnalyticsIntentStageGroupByList =
  AnalyticsIntentStageGroupBySpecification[];
export const AnalyticsIntentStageGroupByList = S.Array(
  AnalyticsIntentStageGroupBySpecification,
);
export interface AnalyticsIntentStageFilter {
  name: AnalyticsIntentStageFilterName;
  operator: AnalyticsFilterOperator;
  values: string[];
}
export const AnalyticsIntentStageFilter = S.suspend(() =>
  S.Struct({
    name: AnalyticsIntentStageFilterName,
    operator: AnalyticsFilterOperator,
    values: AnalyticsFilterValues,
  }),
).annotations({
  identifier: "AnalyticsIntentStageFilter",
}) as any as S.Schema<AnalyticsIntentStageFilter>;
export type AnalyticsIntentStageFilters = AnalyticsIntentStageFilter[];
export const AnalyticsIntentStageFilters = S.Array(AnalyticsIntentStageFilter);
export interface SessionDataSortBy {
  name: AnalyticsSessionSortByName;
  order: AnalyticsSortOrder;
}
export const SessionDataSortBy = S.suspend(() =>
  S.Struct({ name: AnalyticsSessionSortByName, order: AnalyticsSortOrder }),
).annotations({
  identifier: "SessionDataSortBy",
}) as any as S.Schema<SessionDataSortBy>;
export interface AnalyticsSessionFilter {
  name: AnalyticsSessionFilterName;
  operator: AnalyticsFilterOperator;
  values: string[];
}
export const AnalyticsSessionFilter = S.suspend(() =>
  S.Struct({
    name: AnalyticsSessionFilterName,
    operator: AnalyticsFilterOperator,
    values: AnalyticsFilterValues,
  }),
).annotations({
  identifier: "AnalyticsSessionFilter",
}) as any as S.Schema<AnalyticsSessionFilter>;
export type AnalyticsSessionFilters = AnalyticsSessionFilter[];
export const AnalyticsSessionFilters = S.Array(AnalyticsSessionFilter);
export interface AnalyticsSessionMetric {
  name: AnalyticsSessionMetricName;
  statistic: AnalyticsMetricStatistic;
  order?: AnalyticsSortOrder;
}
export const AnalyticsSessionMetric = S.suspend(() =>
  S.Struct({
    name: AnalyticsSessionMetricName,
    statistic: AnalyticsMetricStatistic,
    order: S.optional(AnalyticsSortOrder),
  }),
).annotations({
  identifier: "AnalyticsSessionMetric",
}) as any as S.Schema<AnalyticsSessionMetric>;
export type AnalyticsSessionMetrics = AnalyticsSessionMetric[];
export const AnalyticsSessionMetrics = S.Array(AnalyticsSessionMetric);
export interface AnalyticsSessionGroupBySpecification {
  name: AnalyticsSessionField;
}
export const AnalyticsSessionGroupBySpecification = S.suspend(() =>
  S.Struct({ name: AnalyticsSessionField }),
).annotations({
  identifier: "AnalyticsSessionGroupBySpecification",
}) as any as S.Schema<AnalyticsSessionGroupBySpecification>;
export type AnalyticsSessionGroupByList =
  AnalyticsSessionGroupBySpecification[];
export const AnalyticsSessionGroupByList = S.Array(
  AnalyticsSessionGroupBySpecification,
);
export interface SlotSortBy {
  attribute: SlotSortAttribute;
  order: SortOrder;
}
export const SlotSortBy = S.suspend(() =>
  S.Struct({ attribute: SlotSortAttribute, order: SortOrder }),
).annotations({ identifier: "SlotSortBy" }) as any as S.Schema<SlotSortBy>;
export interface SlotFilter {
  name: SlotFilterName;
  values: string[];
  operator: SlotFilterOperator;
}
export const SlotFilter = S.suspend(() =>
  S.Struct({
    name: SlotFilterName,
    values: FilterValues,
    operator: SlotFilterOperator,
  }),
).annotations({ identifier: "SlotFilter" }) as any as S.Schema<SlotFilter>;
export type SlotFilters = SlotFilter[];
export const SlotFilters = S.Array(SlotFilter);
export interface SlotTypeSortBy {
  attribute: SlotTypeSortAttribute;
  order: SortOrder;
}
export const SlotTypeSortBy = S.suspend(() =>
  S.Struct({ attribute: SlotTypeSortAttribute, order: SortOrder }),
).annotations({
  identifier: "SlotTypeSortBy",
}) as any as S.Schema<SlotTypeSortBy>;
export interface SlotTypeFilter {
  name: SlotTypeFilterName;
  values: string[];
  operator: SlotTypeFilterOperator;
}
export const SlotTypeFilter = S.suspend(() =>
  S.Struct({
    name: SlotTypeFilterName,
    values: FilterValues,
    operator: SlotTypeFilterOperator,
  }),
).annotations({
  identifier: "SlotTypeFilter",
}) as any as S.Schema<SlotTypeFilter>;
export type SlotTypeFilters = SlotTypeFilter[];
export const SlotTypeFilters = S.Array(SlotTypeFilter);
export interface TestExecutionSortBy {
  attribute: TestExecutionSortAttribute;
  order: SortOrder;
}
export const TestExecutionSortBy = S.suspend(() =>
  S.Struct({ attribute: TestExecutionSortAttribute, order: SortOrder }),
).annotations({
  identifier: "TestExecutionSortBy",
}) as any as S.Schema<TestExecutionSortBy>;
export interface TestSetSortBy {
  attribute: TestSetSortAttribute;
  order: SortOrder;
}
export const TestSetSortBy = S.suspend(() =>
  S.Struct({ attribute: TestSetSortAttribute, order: SortOrder }),
).annotations({
  identifier: "TestSetSortBy",
}) as any as S.Schema<TestSetSortBy>;
export interface UtteranceDataSortBy {
  name: AnalyticsUtteranceSortByName;
  order: AnalyticsSortOrder;
}
export const UtteranceDataSortBy = S.suspend(() =>
  S.Struct({ name: AnalyticsUtteranceSortByName, order: AnalyticsSortOrder }),
).annotations({
  identifier: "UtteranceDataSortBy",
}) as any as S.Schema<UtteranceDataSortBy>;
export interface AnalyticsUtteranceFilter {
  name: AnalyticsUtteranceFilterName;
  operator: AnalyticsFilterOperator;
  values: string[];
}
export const AnalyticsUtteranceFilter = S.suspend(() =>
  S.Struct({
    name: AnalyticsUtteranceFilterName,
    operator: AnalyticsFilterOperator,
    values: AnalyticsFilterValues,
  }),
).annotations({
  identifier: "AnalyticsUtteranceFilter",
}) as any as S.Schema<AnalyticsUtteranceFilter>;
export type AnalyticsUtteranceFilters = AnalyticsUtteranceFilter[];
export const AnalyticsUtteranceFilters = S.Array(AnalyticsUtteranceFilter);
export interface AnalyticsUtteranceMetric {
  name: AnalyticsUtteranceMetricName;
  statistic: AnalyticsMetricStatistic;
  order?: AnalyticsSortOrder;
}
export const AnalyticsUtteranceMetric = S.suspend(() =>
  S.Struct({
    name: AnalyticsUtteranceMetricName,
    statistic: AnalyticsMetricStatistic,
    order: S.optional(AnalyticsSortOrder),
  }),
).annotations({
  identifier: "AnalyticsUtteranceMetric",
}) as any as S.Schema<AnalyticsUtteranceMetric>;
export type AnalyticsUtteranceMetrics = AnalyticsUtteranceMetric[];
export const AnalyticsUtteranceMetrics = S.Array(AnalyticsUtteranceMetric);
export interface AnalyticsUtteranceGroupBySpecification {
  name: AnalyticsUtteranceField;
}
export const AnalyticsUtteranceGroupBySpecification = S.suspend(() =>
  S.Struct({ name: AnalyticsUtteranceField }),
).annotations({
  identifier: "AnalyticsUtteranceGroupBySpecification",
}) as any as S.Schema<AnalyticsUtteranceGroupBySpecification>;
export type AnalyticsUtteranceGroupByList =
  AnalyticsUtteranceGroupBySpecification[];
export const AnalyticsUtteranceGroupByList = S.Array(
  AnalyticsUtteranceGroupBySpecification,
);
export interface AnalyticsUtteranceAttribute {
  name: AnalyticsUtteranceAttributeName;
}
export const AnalyticsUtteranceAttribute = S.suspend(() =>
  S.Struct({ name: AnalyticsUtteranceAttributeName }),
).annotations({
  identifier: "AnalyticsUtteranceAttribute",
}) as any as S.Schema<AnalyticsUtteranceAttribute>;
export type AnalyticsUtteranceAttributes = AnalyticsUtteranceAttribute[];
export const AnalyticsUtteranceAttributes = S.Array(
  AnalyticsUtteranceAttribute,
);
export interface AssociatedTranscriptFilter {
  name: AssociatedTranscriptFilterName;
  values: string[];
}
export const AssociatedTranscriptFilter = S.suspend(() =>
  S.Struct({ name: AssociatedTranscriptFilterName, values: FilterValues }),
).annotations({
  identifier: "AssociatedTranscriptFilter",
}) as any as S.Schema<AssociatedTranscriptFilter>;
export type AssociatedTranscriptFilters = AssociatedTranscriptFilter[];
export const AssociatedTranscriptFilters = S.Array(AssociatedTranscriptFilter);
export interface TestSetStorageLocation {
  s3BucketName: string;
  s3Path: string;
  kmsKeyArn?: string;
}
export const TestSetStorageLocation = S.suspend(() =>
  S.Struct({
    s3BucketName: S.String,
    s3Path: S.String,
    kmsKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "TestSetStorageLocation",
}) as any as S.Schema<TestSetStorageLocation>;
export interface SlotPriority {
  priority: number;
  slotId: string;
}
export const SlotPriority = S.suspend(() =>
  S.Struct({ priority: S.Number, slotId: S.String }),
).annotations({ identifier: "SlotPriority" }) as any as S.Schema<SlotPriority>;
export type SlotPrioritiesList = SlotPriority[];
export const SlotPrioritiesList = S.Array(SlotPriority);
export type TimeDimension = "Hours" | "Days" | "Weeks";
export const TimeDimension = S.Literal("Hours", "Days", "Weeks");
export type TestResultMatchStatus = "Matched" | "Mismatched" | "ExecutionError";
export const TestResultMatchStatus = S.Literal(
  "Matched",
  "Mismatched",
  "ExecutionError",
);
export type TranscriptFormat = "Lex";
export const TranscriptFormat = S.Literal("Lex");
export interface BatchCreateCustomVocabularyItemRequest {
  botId: string;
  botVersion: string;
  localeId: string;
  customVocabularyItemList: NewCustomVocabularyItem[];
}
export const BatchCreateCustomVocabularyItemRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    customVocabularyItemList: CreateCustomVocabularyItemsList,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/customvocabulary/DEFAULT/batchcreate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchCreateCustomVocabularyItemRequest",
}) as any as S.Schema<BatchCreateCustomVocabularyItemRequest>;
export interface BatchDeleteCustomVocabularyItemRequest {
  botId: string;
  botVersion: string;
  localeId: string;
  customVocabularyItemList: CustomVocabularyEntryId[];
}
export const BatchDeleteCustomVocabularyItemRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    customVocabularyItemList: DeleteCustomVocabularyItemsList,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/customvocabulary/DEFAULT/batchdelete",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDeleteCustomVocabularyItemRequest",
}) as any as S.Schema<BatchDeleteCustomVocabularyItemRequest>;
export interface BatchUpdateCustomVocabularyItemRequest {
  botId: string;
  botVersion: string;
  localeId: string;
  customVocabularyItemList: CustomVocabularyItem[];
}
export const BatchUpdateCustomVocabularyItemRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    customVocabularyItemList: UpdateCustomVocabularyItemsList,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/customvocabulary/DEFAULT/batchupdate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchUpdateCustomVocabularyItemRequest",
}) as any as S.Schema<BatchUpdateCustomVocabularyItemRequest>;
export interface BuildBotLocaleResponse {
  botId?: string;
  botVersion?: string;
  localeId?: string;
  botLocaleStatus?: BotLocaleStatus;
  lastBuildSubmittedDateTime?: Date;
}
export const BuildBotLocaleResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    botLocaleStatus: S.optional(BotLocaleStatus),
    lastBuildSubmittedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "BuildBotLocaleResponse",
}) as any as S.Schema<BuildBotLocaleResponse>;
export interface CreateBotRequest {
  botName: string;
  description?: string;
  roleArn: string;
  dataPrivacy: DataPrivacy;
  idleSessionTTLInSeconds: number;
  botTags?: { [key: string]: string };
  testBotAliasTags?: { [key: string]: string };
  botType?: BotType;
  botMembers?: BotMember[];
  errorLogSettings?: ErrorLogSettings;
}
export const CreateBotRequest = S.suspend(() =>
  S.Struct({
    botName: S.String,
    description: S.optional(S.String),
    roleArn: S.String,
    dataPrivacy: DataPrivacy,
    idleSessionTTLInSeconds: S.Number,
    botTags: S.optional(TagMap),
    testBotAliasTags: S.optional(TagMap),
    botType: S.optional(BotType),
    botMembers: S.optional(BotMembers),
    errorLogSettings: S.optional(ErrorLogSettings),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/bots" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBotRequest",
}) as any as S.Schema<CreateBotRequest>;
export interface CreateBotReplicaResponse {
  botId?: string;
  replicaRegion?: string;
  sourceRegion?: string;
  creationDateTime?: Date;
  botReplicaStatus?: BotReplicaStatus;
}
export const CreateBotReplicaResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    replicaRegion: S.optional(S.String),
    sourceRegion: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    botReplicaStatus: S.optional(BotReplicaStatus),
  }),
).annotations({
  identifier: "CreateBotReplicaResponse",
}) as any as S.Schema<CreateBotReplicaResponse>;
export interface CreateResourcePolicyResponse {
  resourceArn?: string;
  revisionId?: string;
}
export const CreateResourcePolicyResponse = S.suspend(() =>
  S.Struct({
    resourceArn: S.optional(S.String),
    revisionId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateResourcePolicyResponse",
}) as any as S.Schema<CreateResourcePolicyResponse>;
export interface DeleteBotResponse {
  botId?: string;
  botStatus?: BotStatus;
}
export const DeleteBotResponse = S.suspend(() =>
  S.Struct({ botId: S.optional(S.String), botStatus: S.optional(BotStatus) }),
).annotations({
  identifier: "DeleteBotResponse",
}) as any as S.Schema<DeleteBotResponse>;
export interface DeleteBotAliasResponse {
  botAliasId?: string;
  botId?: string;
  botAliasStatus?: BotAliasStatus;
}
export const DeleteBotAliasResponse = S.suspend(() =>
  S.Struct({
    botAliasId: S.optional(S.String),
    botId: S.optional(S.String),
    botAliasStatus: S.optional(BotAliasStatus),
  }),
).annotations({
  identifier: "DeleteBotAliasResponse",
}) as any as S.Schema<DeleteBotAliasResponse>;
export interface DeleteBotLocaleResponse {
  botId?: string;
  botVersion?: string;
  localeId?: string;
  botLocaleStatus?: BotLocaleStatus;
}
export const DeleteBotLocaleResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    botLocaleStatus: S.optional(BotLocaleStatus),
  }),
).annotations({
  identifier: "DeleteBotLocaleResponse",
}) as any as S.Schema<DeleteBotLocaleResponse>;
export interface DeleteBotReplicaResponse {
  botId?: string;
  replicaRegion?: string;
  botReplicaStatus?: BotReplicaStatus;
}
export const DeleteBotReplicaResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    replicaRegion: S.optional(S.String),
    botReplicaStatus: S.optional(BotReplicaStatus),
  }),
).annotations({
  identifier: "DeleteBotReplicaResponse",
}) as any as S.Schema<DeleteBotReplicaResponse>;
export interface DeleteBotVersionResponse {
  botId?: string;
  botVersion?: string;
  botStatus?: BotStatus;
}
export const DeleteBotVersionResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    botStatus: S.optional(BotStatus),
  }),
).annotations({
  identifier: "DeleteBotVersionResponse",
}) as any as S.Schema<DeleteBotVersionResponse>;
export interface DeleteCustomVocabularyResponse {
  botId?: string;
  botVersion?: string;
  localeId?: string;
  customVocabularyStatus?: CustomVocabularyStatus;
}
export const DeleteCustomVocabularyResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    customVocabularyStatus: S.optional(CustomVocabularyStatus),
  }),
).annotations({
  identifier: "DeleteCustomVocabularyResponse",
}) as any as S.Schema<DeleteCustomVocabularyResponse>;
export interface DeleteExportResponse {
  exportId?: string;
  exportStatus?: ExportStatus;
}
export const DeleteExportResponse = S.suspend(() =>
  S.Struct({
    exportId: S.optional(S.String),
    exportStatus: S.optional(ExportStatus),
  }),
).annotations({
  identifier: "DeleteExportResponse",
}) as any as S.Schema<DeleteExportResponse>;
export interface DeleteImportResponse {
  importId?: string;
  importStatus?: ImportStatus;
}
export const DeleteImportResponse = S.suspend(() =>
  S.Struct({
    importId: S.optional(S.String),
    importStatus: S.optional(ImportStatus),
  }),
).annotations({
  identifier: "DeleteImportResponse",
}) as any as S.Schema<DeleteImportResponse>;
export interface DeleteResourcePolicyResponse {
  resourceArn?: string;
  revisionId?: string;
}
export const DeleteResourcePolicyResponse = S.suspend(() =>
  S.Struct({
    resourceArn: S.optional(S.String),
    revisionId: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteResourcePolicyResponse",
}) as any as S.Schema<DeleteResourcePolicyResponse>;
export interface DeleteResourcePolicyStatementResponse {
  resourceArn?: string;
  revisionId?: string;
}
export const DeleteResourcePolicyStatementResponse = S.suspend(() =>
  S.Struct({
    resourceArn: S.optional(S.String),
    revisionId: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteResourcePolicyStatementResponse",
}) as any as S.Schema<DeleteResourcePolicyStatementResponse>;
export interface DescribeBotResponse {
  botId?: string;
  botName?: string;
  description?: string;
  roleArn?: string;
  dataPrivacy?: DataPrivacy;
  idleSessionTTLInSeconds?: number;
  botStatus?: BotStatus;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  botType?: BotType;
  botMembers?: BotMember[];
  failureReasons?: string[];
  errorLogSettings?: ErrorLogSettings;
}
export const DescribeBotResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botName: S.optional(S.String),
    description: S.optional(S.String),
    roleArn: S.optional(S.String),
    dataPrivacy: S.optional(DataPrivacy),
    idleSessionTTLInSeconds: S.optional(S.Number),
    botStatus: S.optional(BotStatus),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    botType: S.optional(BotType),
    botMembers: S.optional(BotMembers),
    failureReasons: S.optional(FailureReasons),
    errorLogSettings: S.optional(ErrorLogSettings),
  }),
).annotations({
  identifier: "DescribeBotResponse",
}) as any as S.Schema<DescribeBotResponse>;
export interface DescribeBotReplicaResponse {
  botId?: string;
  replicaRegion?: string;
  sourceRegion?: string;
  creationDateTime?: Date;
  botReplicaStatus?: BotReplicaStatus;
  failureReasons?: string[];
}
export const DescribeBotReplicaResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    replicaRegion: S.optional(S.String),
    sourceRegion: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    botReplicaStatus: S.optional(BotReplicaStatus),
    failureReasons: S.optional(FailureReasons),
  }),
).annotations({
  identifier: "DescribeBotReplicaResponse",
}) as any as S.Schema<DescribeBotReplicaResponse>;
export interface DescribeBotResourceGenerationResponse {
  botId?: string;
  botVersion?: string;
  localeId?: string;
  generationId?: string;
  failureReasons?: string[];
  generationStatus?: GenerationStatus;
  generationInputPrompt?: string;
  generatedBotLocaleUrl?: string;
  creationDateTime?: Date;
  modelArn?: string;
  lastUpdatedDateTime?: Date;
}
export const DescribeBotResourceGenerationResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    generationId: S.optional(S.String),
    failureReasons: S.optional(FailureReasons),
    generationStatus: S.optional(GenerationStatus),
    generationInputPrompt: S.optional(S.String),
    generatedBotLocaleUrl: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    modelArn: S.optional(S.String),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DescribeBotResourceGenerationResponse",
}) as any as S.Schema<DescribeBotResourceGenerationResponse>;
export interface ParentBotNetwork {
  botId: string;
  botVersion: string;
}
export const ParentBotNetwork = S.suspend(() =>
  S.Struct({ botId: S.String, botVersion: S.String }),
).annotations({
  identifier: "ParentBotNetwork",
}) as any as S.Schema<ParentBotNetwork>;
export type ParentBotNetworks = ParentBotNetwork[];
export const ParentBotNetworks = S.Array(ParentBotNetwork);
export interface DescribeBotVersionResponse {
  botId?: string;
  botName?: string;
  botVersion?: string;
  description?: string;
  roleArn?: string;
  dataPrivacy?: DataPrivacy;
  idleSessionTTLInSeconds?: number;
  botStatus?: BotStatus;
  failureReasons?: string[];
  creationDateTime?: Date;
  parentBotNetworks?: ParentBotNetwork[];
  botType?: BotType;
  botMembers?: BotMember[];
}
export const DescribeBotVersionResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botName: S.optional(S.String),
    botVersion: S.optional(S.String),
    description: S.optional(S.String),
    roleArn: S.optional(S.String),
    dataPrivacy: S.optional(DataPrivacy),
    idleSessionTTLInSeconds: S.optional(S.Number),
    botStatus: S.optional(BotStatus),
    failureReasons: S.optional(FailureReasons),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    parentBotNetworks: S.optional(ParentBotNetworks),
    botType: S.optional(BotType),
    botMembers: S.optional(BotMembers),
  }),
).annotations({
  identifier: "DescribeBotVersionResponse",
}) as any as S.Schema<DescribeBotVersionResponse>;
export interface DescribeCustomVocabularyMetadataResponse {
  botId?: string;
  botVersion?: string;
  localeId?: string;
  customVocabularyStatus?: CustomVocabularyStatus;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
}
export const DescribeCustomVocabularyMetadataResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    customVocabularyStatus: S.optional(CustomVocabularyStatus),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DescribeCustomVocabularyMetadataResponse",
}) as any as S.Schema<DescribeCustomVocabularyMetadataResponse>;
export interface BotExportSpecification {
  botId: string;
  botVersion: string;
}
export const BotExportSpecification = S.suspend(() =>
  S.Struct({ botId: S.String, botVersion: S.String }),
).annotations({
  identifier: "BotExportSpecification",
}) as any as S.Schema<BotExportSpecification>;
export interface BotLocaleExportSpecification {
  botId: string;
  botVersion: string;
  localeId: string;
}
export const BotLocaleExportSpecification = S.suspend(() =>
  S.Struct({ botId: S.String, botVersion: S.String, localeId: S.String }),
).annotations({
  identifier: "BotLocaleExportSpecification",
}) as any as S.Schema<BotLocaleExportSpecification>;
export interface CustomVocabularyExportSpecification {
  botId: string;
  botVersion: string;
  localeId: string;
}
export const CustomVocabularyExportSpecification = S.suspend(() =>
  S.Struct({ botId: S.String, botVersion: S.String, localeId: S.String }),
).annotations({
  identifier: "CustomVocabularyExportSpecification",
}) as any as S.Schema<CustomVocabularyExportSpecification>;
export interface TestSetExportSpecification {
  testSetId: string;
}
export const TestSetExportSpecification = S.suspend(() =>
  S.Struct({ testSetId: S.String }),
).annotations({
  identifier: "TestSetExportSpecification",
}) as any as S.Schema<TestSetExportSpecification>;
export interface ExportResourceSpecification {
  botExportSpecification?: BotExportSpecification;
  botLocaleExportSpecification?: BotLocaleExportSpecification;
  customVocabularyExportSpecification?: CustomVocabularyExportSpecification;
  testSetExportSpecification?: TestSetExportSpecification;
}
export const ExportResourceSpecification = S.suspend(() =>
  S.Struct({
    botExportSpecification: S.optional(BotExportSpecification),
    botLocaleExportSpecification: S.optional(BotLocaleExportSpecification),
    customVocabularyExportSpecification: S.optional(
      CustomVocabularyExportSpecification,
    ),
    testSetExportSpecification: S.optional(TestSetExportSpecification),
  }),
).annotations({
  identifier: "ExportResourceSpecification",
}) as any as S.Schema<ExportResourceSpecification>;
export interface DescribeExportResponse {
  exportId?: string;
  resourceSpecification?: ExportResourceSpecification;
  fileFormat?: ImportExportFileFormat;
  exportStatus?: ExportStatus;
  failureReasons?: string[];
  downloadUrl?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
}
export const DescribeExportResponse = S.suspend(() =>
  S.Struct({
    exportId: S.optional(S.String),
    resourceSpecification: S.optional(ExportResourceSpecification),
    fileFormat: S.optional(ImportExportFileFormat),
    exportStatus: S.optional(ExportStatus),
    failureReasons: S.optional(FailureReasons),
    downloadUrl: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DescribeExportResponse",
}) as any as S.Schema<DescribeExportResponse>;
export interface BotImportSpecification {
  botName: string;
  roleArn: string;
  dataPrivacy: DataPrivacy;
  errorLogSettings?: ErrorLogSettings;
  idleSessionTTLInSeconds?: number;
  botTags?: { [key: string]: string };
  testBotAliasTags?: { [key: string]: string };
}
export const BotImportSpecification = S.suspend(() =>
  S.Struct({
    botName: S.String,
    roleArn: S.String,
    dataPrivacy: DataPrivacy,
    errorLogSettings: S.optional(ErrorLogSettings),
    idleSessionTTLInSeconds: S.optional(S.Number),
    botTags: S.optional(TagMap),
    testBotAliasTags: S.optional(TagMap),
  }),
).annotations({
  identifier: "BotImportSpecification",
}) as any as S.Schema<BotImportSpecification>;
export interface BotLocaleImportSpecification {
  botId: string;
  botVersion: string;
  localeId: string;
  nluIntentConfidenceThreshold?: number;
  voiceSettings?: VoiceSettings;
  speechRecognitionSettings?: SpeechRecognitionSettings;
  speechDetectionSensitivity?: SpeechDetectionSensitivity;
  unifiedSpeechSettings?: UnifiedSpeechSettings;
}
export const BotLocaleImportSpecification = S.suspend(() =>
  S.Struct({
    botId: S.String,
    botVersion: S.String,
    localeId: S.String,
    nluIntentConfidenceThreshold: S.optional(S.Number),
    voiceSettings: S.optional(VoiceSettings),
    speechRecognitionSettings: S.optional(SpeechRecognitionSettings),
    speechDetectionSensitivity: S.optional(SpeechDetectionSensitivity),
    unifiedSpeechSettings: S.optional(UnifiedSpeechSettings),
  }),
).annotations({
  identifier: "BotLocaleImportSpecification",
}) as any as S.Schema<BotLocaleImportSpecification>;
export interface CustomVocabularyImportSpecification {
  botId: string;
  botVersion: string;
  localeId: string;
}
export const CustomVocabularyImportSpecification = S.suspend(() =>
  S.Struct({ botId: S.String, botVersion: S.String, localeId: S.String }),
).annotations({
  identifier: "CustomVocabularyImportSpecification",
}) as any as S.Schema<CustomVocabularyImportSpecification>;
export interface TestSetImportInputLocation {
  s3BucketName: string;
  s3Path: string;
}
export const TestSetImportInputLocation = S.suspend(() =>
  S.Struct({ s3BucketName: S.String, s3Path: S.String }),
).annotations({
  identifier: "TestSetImportInputLocation",
}) as any as S.Schema<TestSetImportInputLocation>;
export interface TestSetImportResourceSpecification {
  testSetName: string;
  description?: string;
  roleArn: string;
  storageLocation: TestSetStorageLocation;
  importInputLocation: TestSetImportInputLocation;
  modality: TestSetModality;
  testSetTags?: { [key: string]: string };
}
export const TestSetImportResourceSpecification = S.suspend(() =>
  S.Struct({
    testSetName: S.String,
    description: S.optional(S.String),
    roleArn: S.String,
    storageLocation: TestSetStorageLocation,
    importInputLocation: TestSetImportInputLocation,
    modality: TestSetModality,
    testSetTags: S.optional(TagMap),
  }),
).annotations({
  identifier: "TestSetImportResourceSpecification",
}) as any as S.Schema<TestSetImportResourceSpecification>;
export interface ImportResourceSpecification {
  botImportSpecification?: BotImportSpecification;
  botLocaleImportSpecification?: BotLocaleImportSpecification;
  customVocabularyImportSpecification?: CustomVocabularyImportSpecification;
  testSetImportResourceSpecification?: TestSetImportResourceSpecification;
}
export const ImportResourceSpecification = S.suspend(() =>
  S.Struct({
    botImportSpecification: S.optional(BotImportSpecification),
    botLocaleImportSpecification: S.optional(BotLocaleImportSpecification),
    customVocabularyImportSpecification: S.optional(
      CustomVocabularyImportSpecification,
    ),
    testSetImportResourceSpecification: S.optional(
      TestSetImportResourceSpecification,
    ),
  }),
).annotations({
  identifier: "ImportResourceSpecification",
}) as any as S.Schema<ImportResourceSpecification>;
export interface DescribeImportResponse {
  importId?: string;
  resourceSpecification?: ImportResourceSpecification;
  importedResourceId?: string;
  importedResourceName?: string;
  mergeStrategy?: MergeStrategy;
  importStatus?: ImportStatus;
  failureReasons?: string[];
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
}
export const DescribeImportResponse = S.suspend(() =>
  S.Struct({
    importId: S.optional(S.String),
    resourceSpecification: S.optional(ImportResourceSpecification),
    importedResourceId: S.optional(S.String),
    importedResourceName: S.optional(S.String),
    mergeStrategy: S.optional(MergeStrategy),
    importStatus: S.optional(ImportStatus),
    failureReasons: S.optional(FailureReasons),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DescribeImportResponse",
}) as any as S.Schema<DescribeImportResponse>;
export interface PostFulfillmentStatusSpecification {
  successResponse?: ResponseSpecification;
  failureResponse?: ResponseSpecification;
  timeoutResponse?: ResponseSpecification;
  successNextStep?: DialogState;
  successConditional?: ConditionalSpecification;
  failureNextStep?: DialogState;
  failureConditional?: ConditionalSpecification;
  timeoutNextStep?: DialogState;
  timeoutConditional?: ConditionalSpecification;
}
export const PostFulfillmentStatusSpecification = S.suspend(() =>
  S.Struct({
    successResponse: S.optional(ResponseSpecification),
    failureResponse: S.optional(ResponseSpecification),
    timeoutResponse: S.optional(ResponseSpecification),
    successNextStep: S.optional(DialogState),
    successConditional: S.optional(ConditionalSpecification),
    failureNextStep: S.optional(DialogState),
    failureConditional: S.optional(ConditionalSpecification),
    timeoutNextStep: S.optional(DialogState),
    timeoutConditional: S.optional(ConditionalSpecification),
  }),
).annotations({
  identifier: "PostFulfillmentStatusSpecification",
}) as any as S.Schema<PostFulfillmentStatusSpecification>;
export interface FulfillmentStartResponseSpecification {
  delayInSeconds: number;
  messageGroups: MessageGroup[];
  allowInterrupt?: boolean;
}
export const FulfillmentStartResponseSpecification = S.suspend(() =>
  S.Struct({
    delayInSeconds: S.Number,
    messageGroups: MessageGroupsList,
    allowInterrupt: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "FulfillmentStartResponseSpecification",
}) as any as S.Schema<FulfillmentStartResponseSpecification>;
export interface FulfillmentUpdateResponseSpecification {
  frequencyInSeconds: number;
  messageGroups: MessageGroup[];
  allowInterrupt?: boolean;
}
export const FulfillmentUpdateResponseSpecification = S.suspend(() =>
  S.Struct({
    frequencyInSeconds: S.Number,
    messageGroups: MessageGroupsList,
    allowInterrupt: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "FulfillmentUpdateResponseSpecification",
}) as any as S.Schema<FulfillmentUpdateResponseSpecification>;
export interface FulfillmentUpdatesSpecification {
  active: boolean;
  startResponse?: FulfillmentStartResponseSpecification;
  updateResponse?: FulfillmentUpdateResponseSpecification;
  timeoutInSeconds?: number;
}
export const FulfillmentUpdatesSpecification = S.suspend(() =>
  S.Struct({
    active: S.Boolean,
    startResponse: S.optional(FulfillmentStartResponseSpecification),
    updateResponse: S.optional(FulfillmentUpdateResponseSpecification),
    timeoutInSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "FulfillmentUpdatesSpecification",
}) as any as S.Schema<FulfillmentUpdatesSpecification>;
export interface FulfillmentCodeHookSettings {
  enabled: boolean;
  postFulfillmentStatusSpecification?: PostFulfillmentStatusSpecification;
  fulfillmentUpdatesSpecification?: FulfillmentUpdatesSpecification;
  active?: boolean;
}
export const FulfillmentCodeHookSettings = S.suspend(() =>
  S.Struct({
    enabled: S.Boolean,
    postFulfillmentStatusSpecification: S.optional(
      PostFulfillmentStatusSpecification,
    ),
    fulfillmentUpdatesSpecification: S.optional(
      FulfillmentUpdatesSpecification,
    ),
    active: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "FulfillmentCodeHookSettings",
}) as any as S.Schema<FulfillmentCodeHookSettings>;
export interface IntentConfirmationSetting {
  promptSpecification: PromptSpecification;
  declinationResponse?: ResponseSpecification;
  active?: boolean;
  confirmationResponse?: ResponseSpecification;
  confirmationNextStep?: DialogState;
  confirmationConditional?: ConditionalSpecification;
  declinationNextStep?: DialogState;
  declinationConditional?: ConditionalSpecification;
  failureResponse?: ResponseSpecification;
  failureNextStep?: DialogState;
  failureConditional?: ConditionalSpecification;
  codeHook?: DialogCodeHookInvocationSetting;
  elicitationCodeHook?: ElicitationCodeHookInvocationSetting;
}
export const IntentConfirmationSetting = S.suspend(() =>
  S.Struct({
    promptSpecification: PromptSpecification,
    declinationResponse: S.optional(ResponseSpecification),
    active: S.optional(S.Boolean),
    confirmationResponse: S.optional(ResponseSpecification),
    confirmationNextStep: S.optional(DialogState),
    confirmationConditional: S.optional(ConditionalSpecification),
    declinationNextStep: S.optional(DialogState),
    declinationConditional: S.optional(ConditionalSpecification),
    failureResponse: S.optional(ResponseSpecification),
    failureNextStep: S.optional(DialogState),
    failureConditional: S.optional(ConditionalSpecification),
    codeHook: S.optional(DialogCodeHookInvocationSetting),
    elicitationCodeHook: S.optional(ElicitationCodeHookInvocationSetting),
  }),
).annotations({
  identifier: "IntentConfirmationSetting",
}) as any as S.Schema<IntentConfirmationSetting>;
export interface ExactResponseFields {
  questionField: string;
  answerField: string;
}
export const ExactResponseFields = S.suspend(() =>
  S.Struct({ questionField: S.String, answerField: S.String }),
).annotations({
  identifier: "ExactResponseFields",
}) as any as S.Schema<ExactResponseFields>;
export type OSIncludeFields = string[];
export const OSIncludeFields = S.Array(S.String);
export interface OpensearchConfiguration {
  domainEndpoint: string;
  indexName: string;
  exactResponse?: boolean;
  exactResponseFields?: ExactResponseFields;
  includeFields?: string[];
}
export const OpensearchConfiguration = S.suspend(() =>
  S.Struct({
    domainEndpoint: S.String,
    indexName: S.String,
    exactResponse: S.optional(S.Boolean),
    exactResponseFields: S.optional(ExactResponseFields),
    includeFields: S.optional(OSIncludeFields),
  }),
).annotations({
  identifier: "OpensearchConfiguration",
}) as any as S.Schema<OpensearchConfiguration>;
export interface QnAKendraConfiguration {
  kendraIndex: string;
  queryFilterStringEnabled?: boolean;
  queryFilterString?: string;
  exactResponse?: boolean;
}
export const QnAKendraConfiguration = S.suspend(() =>
  S.Struct({
    kendraIndex: S.String,
    queryFilterStringEnabled: S.optional(S.Boolean),
    queryFilterString: S.optional(S.String),
    exactResponse: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "QnAKendraConfiguration",
}) as any as S.Schema<QnAKendraConfiguration>;
export interface BedrockKnowledgeStoreExactResponseFields {
  answerField?: string;
}
export const BedrockKnowledgeStoreExactResponseFields = S.suspend(() =>
  S.Struct({ answerField: S.optional(S.String) }),
).annotations({
  identifier: "BedrockKnowledgeStoreExactResponseFields",
}) as any as S.Schema<BedrockKnowledgeStoreExactResponseFields>;
export interface BedrockKnowledgeStoreConfiguration {
  bedrockKnowledgeBaseArn: string;
  exactResponse?: boolean;
  exactResponseFields?: BedrockKnowledgeStoreExactResponseFields;
}
export const BedrockKnowledgeStoreConfiguration = S.suspend(() =>
  S.Struct({
    bedrockKnowledgeBaseArn: S.String,
    exactResponse: S.optional(S.Boolean),
    exactResponseFields: S.optional(BedrockKnowledgeStoreExactResponseFields),
  }),
).annotations({
  identifier: "BedrockKnowledgeStoreConfiguration",
}) as any as S.Schema<BedrockKnowledgeStoreConfiguration>;
export interface DataSourceConfiguration {
  opensearchConfiguration?: OpensearchConfiguration;
  kendraConfiguration?: QnAKendraConfiguration;
  bedrockKnowledgeStoreConfiguration?: BedrockKnowledgeStoreConfiguration;
}
export const DataSourceConfiguration = S.suspend(() =>
  S.Struct({
    opensearchConfiguration: S.optional(OpensearchConfiguration),
    kendraConfiguration: S.optional(QnAKendraConfiguration),
    bedrockKnowledgeStoreConfiguration: S.optional(
      BedrockKnowledgeStoreConfiguration,
    ),
  }),
).annotations({
  identifier: "DataSourceConfiguration",
}) as any as S.Schema<DataSourceConfiguration>;
export interface QnAIntentConfiguration {
  dataSourceConfiguration?: DataSourceConfiguration;
  bedrockModelConfiguration?: BedrockModelSpecification;
}
export const QnAIntentConfiguration = S.suspend(() =>
  S.Struct({
    dataSourceConfiguration: S.optional(DataSourceConfiguration),
    bedrockModelConfiguration: S.optional(BedrockModelSpecification),
  }),
).annotations({
  identifier: "QnAIntentConfiguration",
}) as any as S.Schema<QnAIntentConfiguration>;
export interface QInConnectAssistantConfiguration {
  assistantArn: string;
}
export const QInConnectAssistantConfiguration = S.suspend(() =>
  S.Struct({ assistantArn: S.String }),
).annotations({
  identifier: "QInConnectAssistantConfiguration",
}) as any as S.Schema<QInConnectAssistantConfiguration>;
export interface QInConnectIntentConfiguration {
  qInConnectAssistantConfiguration?: QInConnectAssistantConfiguration;
}
export const QInConnectIntentConfiguration = S.suspend(() =>
  S.Struct({
    qInConnectAssistantConfiguration: S.optional(
      QInConnectAssistantConfiguration,
    ),
  }),
).annotations({
  identifier: "QInConnectIntentConfiguration",
}) as any as S.Schema<QInConnectIntentConfiguration>;
export interface DescribeIntentResponse {
  intentId?: string;
  intentName?: string;
  intentDisplayName?: string;
  description?: string;
  parentIntentSignature?: string;
  sampleUtterances?: SampleUtterance[];
  dialogCodeHook?: DialogCodeHookSettings;
  fulfillmentCodeHook?: FulfillmentCodeHookSettings;
  slotPriorities?: SlotPriority[];
  intentConfirmationSetting?: IntentConfirmationSetting;
  intentClosingSetting?: IntentClosingSetting;
  inputContexts?: InputContext[];
  outputContexts?: OutputContext[];
  kendraConfiguration?: KendraConfiguration;
  botId?: string;
  botVersion?: string;
  localeId?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  initialResponseSetting?: InitialResponseSetting;
  qnAIntentConfiguration?: QnAIntentConfiguration;
  qInConnectIntentConfiguration?: QInConnectIntentConfiguration;
}
export const DescribeIntentResponse = S.suspend(() =>
  S.Struct({
    intentId: S.optional(S.String),
    intentName: S.optional(S.String),
    intentDisplayName: S.optional(S.String),
    description: S.optional(S.String),
    parentIntentSignature: S.optional(S.String),
    sampleUtterances: S.optional(SampleUtterancesList),
    dialogCodeHook: S.optional(DialogCodeHookSettings),
    fulfillmentCodeHook: S.optional(FulfillmentCodeHookSettings),
    slotPriorities: S.optional(SlotPrioritiesList),
    intentConfirmationSetting: S.optional(IntentConfirmationSetting),
    intentClosingSetting: S.optional(IntentClosingSetting),
    inputContexts: S.optional(InputContextsList),
    outputContexts: S.optional(OutputContextsList),
    kendraConfiguration: S.optional(KendraConfiguration),
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    initialResponseSetting: S.optional(InitialResponseSetting),
    qnAIntentConfiguration: S.optional(QnAIntentConfiguration),
    qInConnectIntentConfiguration: S.optional(QInConnectIntentConfiguration),
  }),
).annotations({
  identifier: "DescribeIntentResponse",
}) as any as S.Schema<DescribeIntentResponse>;
export interface DescribeResourcePolicyResponse {
  resourceArn?: string;
  policy?: string;
  revisionId?: string;
}
export const DescribeResourcePolicyResponse = S.suspend(() =>
  S.Struct({
    resourceArn: S.optional(S.String),
    policy: S.optional(S.String),
    revisionId: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeResourcePolicyResponse",
}) as any as S.Schema<DescribeResourcePolicyResponse>;
export interface DescribeSlotResponse {
  slotId?: string;
  slotName?: string;
  description?: string;
  slotTypeId?: string;
  valueElicitationSetting?: SlotValueElicitationSetting;
  obfuscationSetting?: ObfuscationSetting;
  botId?: string;
  botVersion?: string;
  localeId?: string;
  intentId?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  multipleValuesSetting?: MultipleValuesSetting;
  subSlotSetting?: SubSlotSetting;
}
export const DescribeSlotResponse = S.suspend(() =>
  S.Struct({
    slotId: S.optional(S.String),
    slotName: S.optional(S.String),
    description: S.optional(S.String),
    slotTypeId: S.optional(S.String),
    valueElicitationSetting: S.optional(SlotValueElicitationSetting),
    obfuscationSetting: S.optional(ObfuscationSetting),
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    intentId: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    multipleValuesSetting: S.optional(MultipleValuesSetting),
    subSlotSetting: S.optional(SubSlotSetting),
  }),
).annotations({
  identifier: "DescribeSlotResponse",
}) as any as S.Schema<DescribeSlotResponse>;
export interface DescribeSlotTypeResponse {
  slotTypeId?: string;
  slotTypeName?: string;
  description?: string;
  slotTypeValues?: SlotTypeValue[];
  valueSelectionSetting?: SlotValueSelectionSetting;
  parentSlotTypeSignature?: string;
  botId?: string;
  botVersion?: string;
  localeId?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  externalSourceSetting?: ExternalSourceSetting;
  compositeSlotTypeSetting?: CompositeSlotTypeSetting;
}
export const DescribeSlotTypeResponse = S.suspend(() =>
  S.Struct({
    slotTypeId: S.optional(S.String),
    slotTypeName: S.optional(S.String),
    description: S.optional(S.String),
    slotTypeValues: S.optional(SlotTypeValues),
    valueSelectionSetting: S.optional(SlotValueSelectionSetting),
    parentSlotTypeSignature: S.optional(S.String),
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    externalSourceSetting: S.optional(ExternalSourceSetting),
    compositeSlotTypeSetting: S.optional(CompositeSlotTypeSetting),
  }),
).annotations({
  identifier: "DescribeSlotTypeResponse",
}) as any as S.Schema<DescribeSlotTypeResponse>;
export interface BotAliasTestExecutionTarget {
  botId: string;
  botAliasId: string;
  localeId: string;
}
export const BotAliasTestExecutionTarget = S.suspend(() =>
  S.Struct({ botId: S.String, botAliasId: S.String, localeId: S.String }),
).annotations({
  identifier: "BotAliasTestExecutionTarget",
}) as any as S.Schema<BotAliasTestExecutionTarget>;
export interface TestExecutionTarget {
  botAliasTarget?: BotAliasTestExecutionTarget;
}
export const TestExecutionTarget = S.suspend(() =>
  S.Struct({ botAliasTarget: S.optional(BotAliasTestExecutionTarget) }),
).annotations({
  identifier: "TestExecutionTarget",
}) as any as S.Schema<TestExecutionTarget>;
export interface DescribeTestExecutionResponse {
  testExecutionId?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  testExecutionStatus?: TestExecutionStatus;
  testSetId?: string;
  testSetName?: string;
  target?: TestExecutionTarget;
  apiMode?: TestExecutionApiMode;
  testExecutionModality?: TestExecutionModality;
  failureReasons?: string[];
}
export const DescribeTestExecutionResponse = S.suspend(() =>
  S.Struct({
    testExecutionId: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    testExecutionStatus: S.optional(TestExecutionStatus),
    testSetId: S.optional(S.String),
    testSetName: S.optional(S.String),
    target: S.optional(TestExecutionTarget),
    apiMode: S.optional(TestExecutionApiMode),
    testExecutionModality: S.optional(TestExecutionModality),
    failureReasons: S.optional(FailureReasons),
  }),
).annotations({
  identifier: "DescribeTestExecutionResponse",
}) as any as S.Schema<DescribeTestExecutionResponse>;
export interface DescribeTestSetResponse {
  testSetId?: string;
  testSetName?: string;
  description?: string;
  modality?: TestSetModality;
  status?: TestSetStatus;
  roleArn?: string;
  numTurns?: number;
  storageLocation?: TestSetStorageLocation;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
}
export const DescribeTestSetResponse = S.suspend(() =>
  S.Struct({
    testSetId: S.optional(S.String),
    testSetName: S.optional(S.String),
    description: S.optional(S.String),
    modality: S.optional(TestSetModality),
    status: S.optional(TestSetStatus),
    roleArn: S.optional(S.String),
    numTurns: S.optional(S.Number),
    storageLocation: S.optional(TestSetStorageLocation),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DescribeTestSetResponse",
}) as any as S.Schema<DescribeTestSetResponse>;
export type ConversationLogsInputModeFilter = "Speech" | "Text";
export const ConversationLogsInputModeFilter = S.Literal("Speech", "Text");
export interface ConversationLogsDataSourceFilterBy {
  startTime: Date;
  endTime: Date;
  inputMode: ConversationLogsInputModeFilter;
}
export const ConversationLogsDataSourceFilterBy = S.suspend(() =>
  S.Struct({
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    inputMode: ConversationLogsInputModeFilter,
  }),
).annotations({
  identifier: "ConversationLogsDataSourceFilterBy",
}) as any as S.Schema<ConversationLogsDataSourceFilterBy>;
export interface ConversationLogsDataSource {
  botId: string;
  botAliasId: string;
  localeId: string;
  filter: ConversationLogsDataSourceFilterBy;
}
export const ConversationLogsDataSource = S.suspend(() =>
  S.Struct({
    botId: S.String,
    botAliasId: S.String,
    localeId: S.String,
    filter: ConversationLogsDataSourceFilterBy,
  }),
).annotations({
  identifier: "ConversationLogsDataSource",
}) as any as S.Schema<ConversationLogsDataSource>;
export interface TestSetGenerationDataSource {
  conversationLogsDataSource?: ConversationLogsDataSource;
}
export const TestSetGenerationDataSource = S.suspend(() =>
  S.Struct({
    conversationLogsDataSource: S.optional(ConversationLogsDataSource),
  }),
).annotations({
  identifier: "TestSetGenerationDataSource",
}) as any as S.Schema<TestSetGenerationDataSource>;
export interface DescribeTestSetGenerationResponse {
  testSetGenerationId?: string;
  testSetGenerationStatus?: TestSetGenerationStatus;
  failureReasons?: string[];
  testSetId?: string;
  testSetName?: string;
  description?: string;
  storageLocation?: TestSetStorageLocation;
  generationDataSource?: TestSetGenerationDataSource;
  roleArn?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
}
export const DescribeTestSetGenerationResponse = S.suspend(() =>
  S.Struct({
    testSetGenerationId: S.optional(S.String),
    testSetGenerationStatus: S.optional(TestSetGenerationStatus),
    failureReasons: S.optional(FailureReasons),
    testSetId: S.optional(S.String),
    testSetName: S.optional(S.String),
    description: S.optional(S.String),
    storageLocation: S.optional(TestSetStorageLocation),
    generationDataSource: S.optional(TestSetGenerationDataSource),
    roleArn: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DescribeTestSetGenerationResponse",
}) as any as S.Schema<DescribeTestSetGenerationResponse>;
export interface GenerateBotElementResponse {
  botId?: string;
  botVersion?: string;
  localeId?: string;
  intentId?: string;
  sampleUtterances?: SampleUtterance[];
}
export const GenerateBotElementResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    intentId: S.optional(S.String),
    sampleUtterances: S.optional(SampleUtterancesList),
  }),
).annotations({
  identifier: "GenerateBotElementResponse",
}) as any as S.Schema<GenerateBotElementResponse>;
export interface GetTestExecutionArtifactsUrlResponse {
  testExecutionId?: string;
  downloadArtifactsUrl?: string;
}
export const GetTestExecutionArtifactsUrlResponse = S.suspend(() =>
  S.Struct({
    testExecutionId: S.optional(S.String),
    downloadArtifactsUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "GetTestExecutionArtifactsUrlResponse",
}) as any as S.Schema<GetTestExecutionArtifactsUrlResponse>;
export interface ListBotLocalesRequest {
  botId: string;
  botVersion: string;
  sortBy?: BotLocaleSortBy;
  filters?: BotLocaleFilter[];
  maxResults?: number;
  nextToken?: string;
}
export const ListBotLocalesRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    sortBy: S.optional(BotLocaleSortBy),
    filters: S.optional(BotLocaleFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBotLocalesRequest",
}) as any as S.Schema<ListBotLocalesRequest>;
export interface ListBotResourceGenerationsRequest {
  botId: string;
  botVersion: string;
  localeId: string;
  sortBy?: GenerationSortBy;
  maxResults?: number;
  nextToken?: string;
}
export const ListBotResourceGenerationsRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    sortBy: S.optional(GenerationSortBy),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/generations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBotResourceGenerationsRequest",
}) as any as S.Schema<ListBotResourceGenerationsRequest>;
export interface ListBotsRequest {
  sortBy?: BotSortBy;
  filters?: BotFilter[];
  maxResults?: number;
  nextToken?: string;
}
export const ListBotsRequest = S.suspend(() =>
  S.Struct({
    sortBy: S.optional(BotSortBy),
    filters: S.optional(BotFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/bots" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBotsRequest",
}) as any as S.Schema<ListBotsRequest>;
export interface ListBotVersionReplicasRequest {
  botId: string;
  replicaRegion: string;
  maxResults?: number;
  nextToken?: string;
  sortBy?: BotVersionReplicaSortBy;
}
export const ListBotVersionReplicasRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    replicaRegion: S.String.pipe(T.HttpLabel("replicaRegion")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    sortBy: S.optional(BotVersionReplicaSortBy),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/bots/{botId}/replicas/{replicaRegion}/botversions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBotVersionReplicasRequest",
}) as any as S.Schema<ListBotVersionReplicasRequest>;
export interface ListBotVersionsRequest {
  botId: string;
  sortBy?: BotVersionSortBy;
  maxResults?: number;
  nextToken?: string;
}
export const ListBotVersionsRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    sortBy: S.optional(BotVersionSortBy),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/bots/{botId}/botversions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBotVersionsRequest",
}) as any as S.Schema<ListBotVersionsRequest>;
export interface ListBuiltInIntentsRequest {
  localeId: string;
  sortBy?: BuiltInIntentSortBy;
  maxResults?: number;
  nextToken?: string;
}
export const ListBuiltInIntentsRequest = S.suspend(() =>
  S.Struct({
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    sortBy: S.optional(BuiltInIntentSortBy),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/builtins/locales/{localeId}/intents" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBuiltInIntentsRequest",
}) as any as S.Schema<ListBuiltInIntentsRequest>;
export interface ListBuiltInSlotTypesRequest {
  localeId: string;
  sortBy?: BuiltInSlotTypeSortBy;
  maxResults?: number;
  nextToken?: string;
}
export const ListBuiltInSlotTypesRequest = S.suspend(() =>
  S.Struct({
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    sortBy: S.optional(BuiltInSlotTypeSortBy),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/builtins/locales/{localeId}/slottypes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBuiltInSlotTypesRequest",
}) as any as S.Schema<ListBuiltInSlotTypesRequest>;
export interface ListCustomVocabularyItemsResponse {
  botId?: string;
  botVersion?: string;
  localeId?: string;
  customVocabularyItems?: CustomVocabularyItem[];
  nextToken?: string;
}
export const ListCustomVocabularyItemsResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    customVocabularyItems: S.optional(CustomVocabularyItems),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCustomVocabularyItemsResponse",
}) as any as S.Schema<ListCustomVocabularyItemsResponse>;
export interface ListExportsRequest {
  botId?: string;
  botVersion?: string;
  sortBy?: ExportSortBy;
  filters?: ExportFilter[];
  maxResults?: number;
  nextToken?: string;
  localeId?: string;
}
export const ListExportsRequest = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    sortBy: S.optional(ExportSortBy),
    filters: S.optional(ExportFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    localeId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/exports" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListExportsRequest",
}) as any as S.Schema<ListExportsRequest>;
export interface ListImportsRequest {
  botId?: string;
  botVersion?: string;
  sortBy?: ImportSortBy;
  filters?: ImportFilter[];
  maxResults?: number;
  nextToken?: string;
  localeId?: string;
}
export const ListImportsRequest = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    sortBy: S.optional(ImportSortBy),
    filters: S.optional(ImportFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    localeId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/imports" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListImportsRequest",
}) as any as S.Schema<ListImportsRequest>;
export interface ListIntentMetricsRequest {
  botId: string;
  startDateTime: Date;
  endDateTime: Date;
  metrics: AnalyticsIntentMetric[];
  binBy?: AnalyticsBinBySpecification[];
  groupBy?: AnalyticsIntentGroupBySpecification[];
  filters?: AnalyticsIntentFilter[];
  maxResults?: number;
  nextToken?: string;
}
export const ListIntentMetricsRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    startDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    metrics: AnalyticsIntentMetrics,
    binBy: S.optional(AnalyticsBinByList),
    groupBy: S.optional(AnalyticsIntentGroupByList),
    filters: S.optional(AnalyticsIntentFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/bots/{botId}/analytics/intentmetrics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIntentMetricsRequest",
}) as any as S.Schema<ListIntentMetricsRequest>;
export interface ListIntentPathsRequest {
  botId: string;
  startDateTime: Date;
  endDateTime: Date;
  intentPath: string;
  filters?: AnalyticsPathFilter[];
}
export const ListIntentPathsRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    startDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    intentPath: S.String,
    filters: S.optional(AnalyticsPathFilters),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/bots/{botId}/analytics/intentpaths" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIntentPathsRequest",
}) as any as S.Schema<ListIntentPathsRequest>;
export interface ListIntentsRequest {
  botId: string;
  botVersion: string;
  localeId: string;
  sortBy?: IntentSortBy;
  filters?: IntentFilter[];
  maxResults?: number;
  nextToken?: string;
}
export const ListIntentsRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    sortBy: S.optional(IntentSortBy),
    filters: S.optional(IntentFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/intents",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIntentsRequest",
}) as any as S.Schema<ListIntentsRequest>;
export interface ListIntentStageMetricsRequest {
  botId: string;
  startDateTime: Date;
  endDateTime: Date;
  metrics: AnalyticsIntentStageMetric[];
  binBy?: AnalyticsBinBySpecification[];
  groupBy?: AnalyticsIntentStageGroupBySpecification[];
  filters?: AnalyticsIntentStageFilter[];
  maxResults?: number;
  nextToken?: string;
}
export const ListIntentStageMetricsRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    startDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    metrics: AnalyticsIntentStageMetrics,
    binBy: S.optional(AnalyticsBinByList),
    groupBy: S.optional(AnalyticsIntentStageGroupByList),
    filters: S.optional(AnalyticsIntentStageFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/bots/{botId}/analytics/intentstagemetrics",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIntentStageMetricsRequest",
}) as any as S.Schema<ListIntentStageMetricsRequest>;
export interface ListSessionAnalyticsDataRequest {
  botId: string;
  startDateTime: Date;
  endDateTime: Date;
  sortBy?: SessionDataSortBy;
  filters?: AnalyticsSessionFilter[];
  maxResults?: number;
  nextToken?: string;
}
export const ListSessionAnalyticsDataRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    startDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    sortBy: S.optional(SessionDataSortBy),
    filters: S.optional(AnalyticsSessionFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/bots/{botId}/analytics/sessions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSessionAnalyticsDataRequest",
}) as any as S.Schema<ListSessionAnalyticsDataRequest>;
export interface ListSessionMetricsRequest {
  botId: string;
  startDateTime: Date;
  endDateTime: Date;
  metrics: AnalyticsSessionMetric[];
  binBy?: AnalyticsBinBySpecification[];
  groupBy?: AnalyticsSessionGroupBySpecification[];
  filters?: AnalyticsSessionFilter[];
  maxResults?: number;
  nextToken?: string;
}
export const ListSessionMetricsRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    startDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    metrics: AnalyticsSessionMetrics,
    binBy: S.optional(AnalyticsBinByList),
    groupBy: S.optional(AnalyticsSessionGroupByList),
    filters: S.optional(AnalyticsSessionFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/bots/{botId}/analytics/sessionmetrics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSessionMetricsRequest",
}) as any as S.Schema<ListSessionMetricsRequest>;
export interface ListSlotsRequest {
  botId: string;
  botVersion: string;
  localeId: string;
  intentId: string;
  sortBy?: SlotSortBy;
  filters?: SlotFilter[];
  maxResults?: number;
  nextToken?: string;
}
export const ListSlotsRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    intentId: S.String.pipe(T.HttpLabel("intentId")),
    sortBy: S.optional(SlotSortBy),
    filters: S.optional(SlotFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/intents/{intentId}/slots",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSlotsRequest",
}) as any as S.Schema<ListSlotsRequest>;
export interface ListSlotTypesRequest {
  botId: string;
  botVersion: string;
  localeId: string;
  sortBy?: SlotTypeSortBy;
  filters?: SlotTypeFilter[];
  maxResults?: number;
  nextToken?: string;
}
export const ListSlotTypesRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    sortBy: S.optional(SlotTypeSortBy),
    filters: S.optional(SlotTypeFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/slottypes",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSlotTypesRequest",
}) as any as S.Schema<ListSlotTypesRequest>;
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ListTestExecutionsRequest {
  sortBy?: TestExecutionSortBy;
  maxResults?: number;
  nextToken?: string;
}
export const ListTestExecutionsRequest = S.suspend(() =>
  S.Struct({
    sortBy: S.optional(TestExecutionSortBy),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/testexecutions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTestExecutionsRequest",
}) as any as S.Schema<ListTestExecutionsRequest>;
export interface ListTestSetsRequest {
  sortBy?: TestSetSortBy;
  maxResults?: number;
  nextToken?: string;
}
export const ListTestSetsRequest = S.suspend(() =>
  S.Struct({
    sortBy: S.optional(TestSetSortBy),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/testsets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTestSetsRequest",
}) as any as S.Schema<ListTestSetsRequest>;
export interface ListUtteranceAnalyticsDataRequest {
  botId: string;
  startDateTime: Date;
  endDateTime: Date;
  sortBy?: UtteranceDataSortBy;
  filters?: AnalyticsUtteranceFilter[];
  maxResults?: number;
  nextToken?: string;
}
export const ListUtteranceAnalyticsDataRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    startDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    sortBy: S.optional(UtteranceDataSortBy),
    filters: S.optional(AnalyticsUtteranceFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/bots/{botId}/analytics/utterances" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListUtteranceAnalyticsDataRequest",
}) as any as S.Schema<ListUtteranceAnalyticsDataRequest>;
export interface ListUtteranceMetricsRequest {
  botId: string;
  startDateTime: Date;
  endDateTime: Date;
  metrics: AnalyticsUtteranceMetric[];
  binBy?: AnalyticsBinBySpecification[];
  groupBy?: AnalyticsUtteranceGroupBySpecification[];
  attributes?: AnalyticsUtteranceAttribute[];
  filters?: AnalyticsUtteranceFilter[];
  maxResults?: number;
  nextToken?: string;
}
export const ListUtteranceMetricsRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    startDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    metrics: AnalyticsUtteranceMetrics,
    binBy: S.optional(AnalyticsBinByList),
    groupBy: S.optional(AnalyticsUtteranceGroupByList),
    attributes: S.optional(AnalyticsUtteranceAttributes),
    filters: S.optional(AnalyticsUtteranceFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/bots/{botId}/analytics/utterancemetrics",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListUtteranceMetricsRequest",
}) as any as S.Schema<ListUtteranceMetricsRequest>;
export interface SearchAssociatedTranscriptsRequest {
  botId: string;
  botVersion: string;
  localeId: string;
  botRecommendationId: string;
  searchOrder?: SearchOrder;
  filters: AssociatedTranscriptFilter[];
  maxResults?: number;
  nextIndex?: number;
}
export const SearchAssociatedTranscriptsRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    botRecommendationId: S.String.pipe(T.HttpLabel("botRecommendationId")),
    searchOrder: S.optional(SearchOrder),
    filters: AssociatedTranscriptFilters,
    maxResults: S.optional(S.Number),
    nextIndex: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/botrecommendations/{botRecommendationId}/associatedtranscripts",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchAssociatedTranscriptsRequest",
}) as any as S.Schema<SearchAssociatedTranscriptsRequest>;
export interface StartBotResourceGenerationResponse {
  generationInputPrompt?: string;
  generationId?: string;
  botId?: string;
  botVersion?: string;
  localeId?: string;
  generationStatus?: GenerationStatus;
  creationDateTime?: Date;
}
export const StartBotResourceGenerationResponse = S.suspend(() =>
  S.Struct({
    generationInputPrompt: S.optional(S.String),
    generationId: S.optional(S.String),
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    generationStatus: S.optional(GenerationStatus),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "StartBotResourceGenerationResponse",
}) as any as S.Schema<StartBotResourceGenerationResponse>;
export interface StopBotRecommendationResponse {
  botId?: string;
  botVersion?: string;
  localeId?: string;
  botRecommendationStatus?: BotRecommendationStatus;
  botRecommendationId?: string;
}
export const StopBotRecommendationResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    botRecommendationStatus: S.optional(BotRecommendationStatus),
    botRecommendationId: S.optional(S.String),
  }),
).annotations({
  identifier: "StopBotRecommendationResponse",
}) as any as S.Schema<StopBotRecommendationResponse>;
export interface UpdateBotResponse {
  botId?: string;
  botName?: string;
  description?: string;
  roleArn?: string;
  dataPrivacy?: DataPrivacy;
  idleSessionTTLInSeconds?: number;
  botStatus?: BotStatus;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  botType?: BotType;
  botMembers?: BotMember[];
  errorLogSettings?: ErrorLogSettings;
}
export const UpdateBotResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botName: S.optional(S.String),
    description: S.optional(S.String),
    roleArn: S.optional(S.String),
    dataPrivacy: S.optional(DataPrivacy),
    idleSessionTTLInSeconds: S.optional(S.Number),
    botStatus: S.optional(BotStatus),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    botType: S.optional(BotType),
    botMembers: S.optional(BotMembers),
    errorLogSettings: S.optional(ErrorLogSettings),
  }),
).annotations({
  identifier: "UpdateBotResponse",
}) as any as S.Schema<UpdateBotResponse>;
export interface UpdateBotAliasResponse {
  botAliasId?: string;
  botAliasName?: string;
  description?: string;
  botVersion?: string;
  botAliasLocaleSettings?: { [key: string]: BotAliasLocaleSettings };
  conversationLogSettings?: ConversationLogSettings;
  sentimentAnalysisSettings?: SentimentAnalysisSettings;
  botAliasStatus?: BotAliasStatus;
  botId?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
}
export const UpdateBotAliasResponse = S.suspend(() =>
  S.Struct({
    botAliasId: S.optional(S.String),
    botAliasName: S.optional(S.String),
    description: S.optional(S.String),
    botVersion: S.optional(S.String),
    botAliasLocaleSettings: S.optional(BotAliasLocaleSettingsMap),
    conversationLogSettings: S.optional(ConversationLogSettings),
    sentimentAnalysisSettings: S.optional(SentimentAnalysisSettings),
    botAliasStatus: S.optional(BotAliasStatus),
    botId: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "UpdateBotAliasResponse",
}) as any as S.Schema<UpdateBotAliasResponse>;
export interface UpdateBotLocaleResponse {
  botId?: string;
  botVersion?: string;
  localeId?: string;
  localeName?: string;
  description?: string;
  nluIntentConfidenceThreshold?: number;
  voiceSettings?: VoiceSettings;
  unifiedSpeechSettings?: UnifiedSpeechSettings;
  speechRecognitionSettings?: SpeechRecognitionSettings;
  botLocaleStatus?: BotLocaleStatus;
  failureReasons?: string[];
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  recommendedActions?: string[];
  generativeAISettings?: GenerativeAISettings;
  speechDetectionSensitivity?: SpeechDetectionSensitivity;
}
export const UpdateBotLocaleResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    localeName: S.optional(S.String),
    description: S.optional(S.String),
    nluIntentConfidenceThreshold: S.optional(S.Number),
    voiceSettings: S.optional(VoiceSettings),
    unifiedSpeechSettings: S.optional(UnifiedSpeechSettings),
    speechRecognitionSettings: S.optional(SpeechRecognitionSettings),
    botLocaleStatus: S.optional(BotLocaleStatus),
    failureReasons: S.optional(FailureReasons),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    recommendedActions: S.optional(RecommendedActions),
    generativeAISettings: S.optional(GenerativeAISettings),
    speechDetectionSensitivity: S.optional(SpeechDetectionSensitivity),
  }),
).annotations({
  identifier: "UpdateBotLocaleResponse",
}) as any as S.Schema<UpdateBotLocaleResponse>;
export type ObjectPrefixes = string[];
export const ObjectPrefixes = S.Array(S.String);
export interface PathFormat {
  objectPrefixes?: string[];
}
export const PathFormat = S.suspend(() =>
  S.Struct({ objectPrefixes: S.optional(ObjectPrefixes) }),
).annotations({ identifier: "PathFormat" }) as any as S.Schema<PathFormat>;
export interface DateRangeFilter {
  startDateTime: Date;
  endDateTime: Date;
}
export const DateRangeFilter = S.suspend(() =>
  S.Struct({
    startDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "DateRangeFilter",
}) as any as S.Schema<DateRangeFilter>;
export interface LexTranscriptFilter {
  dateRangeFilter?: DateRangeFilter;
}
export const LexTranscriptFilter = S.suspend(() =>
  S.Struct({ dateRangeFilter: S.optional(DateRangeFilter) }),
).annotations({
  identifier: "LexTranscriptFilter",
}) as any as S.Schema<LexTranscriptFilter>;
export interface TranscriptFilter {
  lexTranscriptFilter?: LexTranscriptFilter;
}
export const TranscriptFilter = S.suspend(() =>
  S.Struct({ lexTranscriptFilter: S.optional(LexTranscriptFilter) }),
).annotations({
  identifier: "TranscriptFilter",
}) as any as S.Schema<TranscriptFilter>;
export interface S3BucketTranscriptSource {
  s3BucketName: string;
  pathFormat?: PathFormat;
  transcriptFormat: TranscriptFormat;
  transcriptFilter?: TranscriptFilter;
  kmsKeyArn?: string;
}
export const S3BucketTranscriptSource = S.suspend(() =>
  S.Struct({
    s3BucketName: S.String,
    pathFormat: S.optional(PathFormat),
    transcriptFormat: TranscriptFormat,
    transcriptFilter: S.optional(TranscriptFilter),
    kmsKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "S3BucketTranscriptSource",
}) as any as S.Schema<S3BucketTranscriptSource>;
export interface TranscriptSourceSetting {
  s3BucketTranscriptSource?: S3BucketTranscriptSource;
}
export const TranscriptSourceSetting = S.suspend(() =>
  S.Struct({ s3BucketTranscriptSource: S.optional(S3BucketTranscriptSource) }),
).annotations({
  identifier: "TranscriptSourceSetting",
}) as any as S.Schema<TranscriptSourceSetting>;
export interface UpdateBotRecommendationResponse {
  botId?: string;
  botVersion?: string;
  localeId?: string;
  botRecommendationStatus?: BotRecommendationStatus;
  botRecommendationId?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  transcriptSourceSetting?: TranscriptSourceSetting;
  encryptionSetting?: EncryptionSetting;
}
export const UpdateBotRecommendationResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    botRecommendationStatus: S.optional(BotRecommendationStatus),
    botRecommendationId: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    transcriptSourceSetting: S.optional(TranscriptSourceSetting),
    encryptionSetting: S.optional(EncryptionSetting),
  }),
).annotations({
  identifier: "UpdateBotRecommendationResponse",
}) as any as S.Schema<UpdateBotRecommendationResponse>;
export interface UpdateExportResponse {
  exportId?: string;
  resourceSpecification?: ExportResourceSpecification;
  fileFormat?: ImportExportFileFormat;
  exportStatus?: ExportStatus;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
}
export const UpdateExportResponse = S.suspend(() =>
  S.Struct({
    exportId: S.optional(S.String),
    resourceSpecification: S.optional(ExportResourceSpecification),
    fileFormat: S.optional(ImportExportFileFormat),
    exportStatus: S.optional(ExportStatus),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "UpdateExportResponse",
}) as any as S.Schema<UpdateExportResponse>;
export interface UpdateIntentRequest {
  intentId: string;
  intentName: string;
  intentDisplayName?: string;
  description?: string;
  parentIntentSignature?: string;
  sampleUtterances?: SampleUtterance[];
  dialogCodeHook?: DialogCodeHookSettings;
  fulfillmentCodeHook?: FulfillmentCodeHookSettings;
  slotPriorities?: SlotPriority[];
  intentConfirmationSetting?: IntentConfirmationSetting;
  intentClosingSetting?: IntentClosingSetting;
  inputContexts?: InputContext[];
  outputContexts?: OutputContext[];
  kendraConfiguration?: KendraConfiguration;
  botId: string;
  botVersion: string;
  localeId: string;
  initialResponseSetting?: InitialResponseSetting;
  qnAIntentConfiguration?: QnAIntentConfiguration;
  qInConnectIntentConfiguration?: QInConnectIntentConfiguration;
}
export const UpdateIntentRequest = S.suspend(() =>
  S.Struct({
    intentId: S.String.pipe(T.HttpLabel("intentId")),
    intentName: S.String,
    intentDisplayName: S.optional(S.String),
    description: S.optional(S.String),
    parentIntentSignature: S.optional(S.String),
    sampleUtterances: S.optional(SampleUtterancesList),
    dialogCodeHook: S.optional(DialogCodeHookSettings),
    fulfillmentCodeHook: S.optional(FulfillmentCodeHookSettings),
    slotPriorities: S.optional(SlotPrioritiesList),
    intentConfirmationSetting: S.optional(IntentConfirmationSetting),
    intentClosingSetting: S.optional(IntentClosingSetting),
    inputContexts: S.optional(InputContextsList),
    outputContexts: S.optional(OutputContextsList),
    kendraConfiguration: S.optional(KendraConfiguration),
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    initialResponseSetting: S.optional(InitialResponseSetting),
    qnAIntentConfiguration: S.optional(QnAIntentConfiguration),
    qInConnectIntentConfiguration: S.optional(QInConnectIntentConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/intents/{intentId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateIntentRequest",
}) as any as S.Schema<UpdateIntentRequest>;
export interface UpdateResourcePolicyResponse {
  resourceArn?: string;
  revisionId?: string;
}
export const UpdateResourcePolicyResponse = S.suspend(() =>
  S.Struct({
    resourceArn: S.optional(S.String),
    revisionId: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateResourcePolicyResponse",
}) as any as S.Schema<UpdateResourcePolicyResponse>;
export interface UpdateSlotResponse {
  slotId?: string;
  slotName?: string;
  description?: string;
  slotTypeId?: string;
  valueElicitationSetting?: SlotValueElicitationSetting;
  obfuscationSetting?: ObfuscationSetting;
  botId?: string;
  botVersion?: string;
  localeId?: string;
  intentId?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  multipleValuesSetting?: MultipleValuesSetting;
  subSlotSetting?: SubSlotSetting;
}
export const UpdateSlotResponse = S.suspend(() =>
  S.Struct({
    slotId: S.optional(S.String),
    slotName: S.optional(S.String),
    description: S.optional(S.String),
    slotTypeId: S.optional(S.String),
    valueElicitationSetting: S.optional(SlotValueElicitationSetting),
    obfuscationSetting: S.optional(ObfuscationSetting),
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    intentId: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    multipleValuesSetting: S.optional(MultipleValuesSetting),
    subSlotSetting: S.optional(SubSlotSetting),
  }),
).annotations({
  identifier: "UpdateSlotResponse",
}) as any as S.Schema<UpdateSlotResponse>;
export interface UpdateSlotTypeResponse {
  slotTypeId?: string;
  slotTypeName?: string;
  description?: string;
  slotTypeValues?: SlotTypeValue[];
  valueSelectionSetting?: SlotValueSelectionSetting;
  parentSlotTypeSignature?: string;
  botId?: string;
  botVersion?: string;
  localeId?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  externalSourceSetting?: ExternalSourceSetting;
  compositeSlotTypeSetting?: CompositeSlotTypeSetting;
}
export const UpdateSlotTypeResponse = S.suspend(() =>
  S.Struct({
    slotTypeId: S.optional(S.String),
    slotTypeName: S.optional(S.String),
    description: S.optional(S.String),
    slotTypeValues: S.optional(SlotTypeValues),
    valueSelectionSetting: S.optional(SlotValueSelectionSetting),
    parentSlotTypeSignature: S.optional(S.String),
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    externalSourceSetting: S.optional(ExternalSourceSetting),
    compositeSlotTypeSetting: S.optional(CompositeSlotTypeSetting),
  }),
).annotations({
  identifier: "UpdateSlotTypeResponse",
}) as any as S.Schema<UpdateSlotTypeResponse>;
export interface UpdateTestSetResponse {
  testSetId?: string;
  testSetName?: string;
  description?: string;
  modality?: TestSetModality;
  status?: TestSetStatus;
  roleArn?: string;
  numTurns?: number;
  storageLocation?: TestSetStorageLocation;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
}
export const UpdateTestSetResponse = S.suspend(() =>
  S.Struct({
    testSetId: S.optional(S.String),
    testSetName: S.optional(S.String),
    description: S.optional(S.String),
    modality: S.optional(TestSetModality),
    status: S.optional(TestSetStatus),
    roleArn: S.optional(S.String),
    numTurns: S.optional(S.Number),
    storageLocation: S.optional(TestSetStorageLocation),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "UpdateTestSetResponse",
}) as any as S.Schema<UpdateTestSetResponse>;
export interface BotVersionLocaleDetails {
  sourceBotVersion: string;
}
export const BotVersionLocaleDetails = S.suspend(() =>
  S.Struct({ sourceBotVersion: S.String }),
).annotations({
  identifier: "BotVersionLocaleDetails",
}) as any as S.Schema<BotVersionLocaleDetails>;
export type ConditionKeyValueMap = { [key: string]: string };
export const ConditionKeyValueMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface TestSetDiscrepancyReportBotAliasTarget {
  botId: string;
  botAliasId: string;
  localeId: string;
}
export const TestSetDiscrepancyReportBotAliasTarget = S.suspend(() =>
  S.Struct({ botId: S.String, botAliasId: S.String, localeId: S.String }),
).annotations({
  identifier: "TestSetDiscrepancyReportBotAliasTarget",
}) as any as S.Schema<TestSetDiscrepancyReportBotAliasTarget>;
export interface RelativeAggregationDuration {
  timeDimension: TimeDimension;
  timeValue: number;
}
export const RelativeAggregationDuration = S.suspend(() =>
  S.Struct({ timeDimension: TimeDimension, timeValue: S.Number }),
).annotations({
  identifier: "RelativeAggregationDuration",
}) as any as S.Schema<RelativeAggregationDuration>;
export type BotAliasReplicationStatus =
  | "Creating"
  | "Updating"
  | "Available"
  | "Deleting"
  | "Failed";
export const BotAliasReplicationStatus = S.Literal(
  "Creating",
  "Updating",
  "Available",
  "Deleting",
  "Failed",
);
export interface ConversationLevelTestResultsFilterBy {
  endToEndResult?: TestResultMatchStatus;
}
export const ConversationLevelTestResultsFilterBy = S.suspend(() =>
  S.Struct({ endToEndResult: S.optional(TestResultMatchStatus) }),
).annotations({
  identifier: "ConversationLevelTestResultsFilterBy",
}) as any as S.Schema<ConversationLevelTestResultsFilterBy>;
export type BotVersionLocaleSpecification = {
  [key: string]: BotVersionLocaleDetails;
};
export const BotVersionLocaleSpecification = S.Record({
  key: S.String,
  value: BotVersionLocaleDetails,
});
export type ConditionMap = { [key: string]: { [key: string]: string } };
export const ConditionMap = S.Record({
  key: S.String,
  value: ConditionKeyValueMap,
});
export interface TestSetDiscrepancyReportResourceTarget {
  botAliasTarget?: TestSetDiscrepancyReportBotAliasTarget;
}
export const TestSetDiscrepancyReportResourceTarget = S.suspend(() =>
  S.Struct({
    botAliasTarget: S.optional(TestSetDiscrepancyReportBotAliasTarget),
  }),
).annotations({
  identifier: "TestSetDiscrepancyReportResourceTarget",
}) as any as S.Schema<TestSetDiscrepancyReportResourceTarget>;
export interface BotAliasHistoryEvent {
  botVersion?: string;
  startDate?: Date;
  endDate?: Date;
}
export const BotAliasHistoryEvent = S.suspend(() =>
  S.Struct({
    botVersion: S.optional(S.String),
    startDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "BotAliasHistoryEvent",
}) as any as S.Schema<BotAliasHistoryEvent>;
export type BotAliasHistoryEventsList = BotAliasHistoryEvent[];
export const BotAliasHistoryEventsList = S.Array(BotAliasHistoryEvent);
export interface BotLocaleHistoryEvent {
  event: string;
  eventDate: Date;
}
export const BotLocaleHistoryEvent = S.suspend(() =>
  S.Struct({
    event: S.String,
    eventDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "BotLocaleHistoryEvent",
}) as any as S.Schema<BotLocaleHistoryEvent>;
export type BotLocaleHistoryEventsList = BotLocaleHistoryEvent[];
export const BotLocaleHistoryEventsList = S.Array(BotLocaleHistoryEvent);
export interface UtteranceAggregationDuration {
  relativeAggregationDuration: RelativeAggregationDuration;
}
export const UtteranceAggregationDuration = S.suspend(() =>
  S.Struct({ relativeAggregationDuration: RelativeAggregationDuration }),
).annotations({
  identifier: "UtteranceAggregationDuration",
}) as any as S.Schema<UtteranceAggregationDuration>;
export interface BotAliasSummary {
  botAliasId?: string;
  botAliasName?: string;
  description?: string;
  botVersion?: string;
  botAliasStatus?: BotAliasStatus;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
}
export const BotAliasSummary = S.suspend(() =>
  S.Struct({
    botAliasId: S.optional(S.String),
    botAliasName: S.optional(S.String),
    description: S.optional(S.String),
    botVersion: S.optional(S.String),
    botAliasStatus: S.optional(BotAliasStatus),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "BotAliasSummary",
}) as any as S.Schema<BotAliasSummary>;
export type BotAliasSummaryList = BotAliasSummary[];
export const BotAliasSummaryList = S.Array(BotAliasSummary);
export interface BotAliasReplicaSummary {
  botAliasId?: string;
  botAliasReplicationStatus?: BotAliasReplicationStatus;
  botVersion?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  failureReasons?: string[];
}
export const BotAliasReplicaSummary = S.suspend(() =>
  S.Struct({
    botAliasId: S.optional(S.String),
    botAliasReplicationStatus: S.optional(BotAliasReplicationStatus),
    botVersion: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    failureReasons: S.optional(FailureReasons),
  }),
).annotations({
  identifier: "BotAliasReplicaSummary",
}) as any as S.Schema<BotAliasReplicaSummary>;
export type BotAliasReplicaSummaryList = BotAliasReplicaSummary[];
export const BotAliasReplicaSummaryList = S.Array(BotAliasReplicaSummary);
export interface BotRecommendationSummary {
  botRecommendationStatus: BotRecommendationStatus;
  botRecommendationId: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
}
export const BotRecommendationSummary = S.suspend(() =>
  S.Struct({
    botRecommendationStatus: BotRecommendationStatus,
    botRecommendationId: S.String,
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "BotRecommendationSummary",
}) as any as S.Schema<BotRecommendationSummary>;
export type BotRecommendationSummaryList = BotRecommendationSummary[];
export const BotRecommendationSummaryList = S.Array(BotRecommendationSummary);
export interface BotReplicaSummary {
  replicaRegion?: string;
  creationDateTime?: Date;
  botReplicaStatus?: BotReplicaStatus;
  failureReasons?: string[];
}
export const BotReplicaSummary = S.suspend(() =>
  S.Struct({
    replicaRegion: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    botReplicaStatus: S.optional(BotReplicaStatus),
    failureReasons: S.optional(FailureReasons),
  }),
).annotations({
  identifier: "BotReplicaSummary",
}) as any as S.Schema<BotReplicaSummary>;
export type BotReplicaSummaryList = BotReplicaSummary[];
export const BotReplicaSummaryList = S.Array(BotReplicaSummary);
export interface RecommendedIntentSummary {
  intentId?: string;
  intentName?: string;
  sampleUtterancesCount?: number;
}
export const RecommendedIntentSummary = S.suspend(() =>
  S.Struct({
    intentId: S.optional(S.String),
    intentName: S.optional(S.String),
    sampleUtterancesCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "RecommendedIntentSummary",
}) as any as S.Schema<RecommendedIntentSummary>;
export type RecommendedIntentSummaryList = RecommendedIntentSummary[];
export const RecommendedIntentSummaryList = S.Array(RecommendedIntentSummary);
export interface TestExecutionResultFilterBy {
  resultTypeFilter: TestResultTypeFilter;
  conversationLevelTestResultsFilterBy?: ConversationLevelTestResultsFilterBy;
}
export const TestExecutionResultFilterBy = S.suspend(() =>
  S.Struct({
    resultTypeFilter: TestResultTypeFilter,
    conversationLevelTestResultsFilterBy: S.optional(
      ConversationLevelTestResultsFilterBy,
    ),
  }),
).annotations({
  identifier: "TestExecutionResultFilterBy",
}) as any as S.Schema<TestExecutionResultFilterBy>;
export type ErrorCode =
  | "DUPLICATE_INPUT"
  | "RESOURCE_DOES_NOT_EXIST"
  | "RESOURCE_ALREADY_EXISTS"
  | "INTERNAL_SERVER_FAILURE";
export const ErrorCode = S.Literal(
  "DUPLICATE_INPUT",
  "RESOURCE_DOES_NOT_EXIST",
  "RESOURCE_ALREADY_EXISTS",
  "INTERNAL_SERVER_FAILURE",
);
export interface FailedCustomVocabularyItem {
  itemId?: string;
  errorMessage?: string;
  errorCode?: ErrorCode;
}
export const FailedCustomVocabularyItem = S.suspend(() =>
  S.Struct({
    itemId: S.optional(S.String),
    errorMessage: S.optional(S.String),
    errorCode: S.optional(ErrorCode),
  }),
).annotations({
  identifier: "FailedCustomVocabularyItem",
}) as any as S.Schema<FailedCustomVocabularyItem>;
export type FailedCustomVocabularyItems = FailedCustomVocabularyItem[];
export const FailedCustomVocabularyItems = S.Array(FailedCustomVocabularyItem);
export interface BatchDeleteCustomVocabularyItemResponse {
  botId?: string;
  botVersion?: string;
  localeId?: string;
  errors?: FailedCustomVocabularyItem[];
  resources?: CustomVocabularyItem[];
}
export const BatchDeleteCustomVocabularyItemResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    errors: S.optional(FailedCustomVocabularyItems),
    resources: S.optional(CustomVocabularyItems),
  }),
).annotations({
  identifier: "BatchDeleteCustomVocabularyItemResponse",
}) as any as S.Schema<BatchDeleteCustomVocabularyItemResponse>;
export interface BatchUpdateCustomVocabularyItemResponse {
  botId?: string;
  botVersion?: string;
  localeId?: string;
  errors?: FailedCustomVocabularyItem[];
  resources?: CustomVocabularyItem[];
}
export const BatchUpdateCustomVocabularyItemResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    errors: S.optional(FailedCustomVocabularyItems),
    resources: S.optional(CustomVocabularyItems),
  }),
).annotations({
  identifier: "BatchUpdateCustomVocabularyItemResponse",
}) as any as S.Schema<BatchUpdateCustomVocabularyItemResponse>;
export interface CreateBotResponse {
  botId?: string;
  botName?: string;
  description?: string;
  roleArn?: string;
  dataPrivacy?: DataPrivacy;
  idleSessionTTLInSeconds?: number;
  botStatus?: BotStatus;
  creationDateTime?: Date;
  botTags?: { [key: string]: string };
  testBotAliasTags?: { [key: string]: string };
  botType?: BotType;
  botMembers?: BotMember[];
  errorLogSettings?: ErrorLogSettings;
}
export const CreateBotResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botName: S.optional(S.String),
    description: S.optional(S.String),
    roleArn: S.optional(S.String),
    dataPrivacy: S.optional(DataPrivacy),
    idleSessionTTLInSeconds: S.optional(S.Number),
    botStatus: S.optional(BotStatus),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    botTags: S.optional(TagMap),
    testBotAliasTags: S.optional(TagMap),
    botType: S.optional(BotType),
    botMembers: S.optional(BotMembers),
    errorLogSettings: S.optional(ErrorLogSettings),
  }),
).annotations({
  identifier: "CreateBotResponse",
}) as any as S.Schema<CreateBotResponse>;
export interface CreateBotVersionRequest {
  botId: string;
  description?: string;
  botVersionLocaleSpecification: { [key: string]: BotVersionLocaleDetails };
}
export const CreateBotVersionRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    description: S.optional(S.String),
    botVersionLocaleSpecification: BotVersionLocaleSpecification,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/bots/{botId}/botversions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBotVersionRequest",
}) as any as S.Schema<CreateBotVersionRequest>;
export interface CreateExportRequest {
  resourceSpecification: ExportResourceSpecification;
  fileFormat: ImportExportFileFormat;
  filePassword?: string | redacted.Redacted<string>;
}
export const CreateExportRequest = S.suspend(() =>
  S.Struct({
    resourceSpecification: ExportResourceSpecification,
    fileFormat: ImportExportFileFormat,
    filePassword: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/exports" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateExportRequest",
}) as any as S.Schema<CreateExportRequest>;
export interface CreateResourcePolicyStatementRequest {
  resourceArn: string;
  statementId: string;
  effect: Effect;
  principal: Principal[];
  action: string[];
  condition?: { [key: string]: { [key: string]: string } };
  expectedRevisionId?: string;
}
export const CreateResourcePolicyStatementRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    statementId: S.String,
    effect: Effect,
    principal: PrincipalList,
    action: OperationList,
    condition: S.optional(ConditionMap),
    expectedRevisionId: S.optional(S.String).pipe(
      T.HttpQuery("expectedRevisionId"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/policy/{resourceArn}/statements" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateResourcePolicyStatementRequest",
}) as any as S.Schema<CreateResourcePolicyStatementRequest>;
export interface CreateTestSetDiscrepancyReportRequest {
  testSetId: string;
  target: TestSetDiscrepancyReportResourceTarget;
}
export const CreateTestSetDiscrepancyReportRequest = S.suspend(() =>
  S.Struct({
    testSetId: S.String.pipe(T.HttpLabel("testSetId")),
    target: TestSetDiscrepancyReportResourceTarget,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/testsets/{testSetId}/testsetdiscrepancy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTestSetDiscrepancyReportRequest",
}) as any as S.Schema<CreateTestSetDiscrepancyReportRequest>;
export interface DescribeBotAliasResponse {
  botAliasId?: string;
  botAliasName?: string;
  description?: string;
  botVersion?: string;
  botAliasLocaleSettings?: { [key: string]: BotAliasLocaleSettings };
  conversationLogSettings?: ConversationLogSettings;
  sentimentAnalysisSettings?: SentimentAnalysisSettings;
  botAliasHistoryEvents?: BotAliasHistoryEvent[];
  botAliasStatus?: BotAliasStatus;
  botId?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  parentBotNetworks?: ParentBotNetwork[];
}
export const DescribeBotAliasResponse = S.suspend(() =>
  S.Struct({
    botAliasId: S.optional(S.String),
    botAliasName: S.optional(S.String),
    description: S.optional(S.String),
    botVersion: S.optional(S.String),
    botAliasLocaleSettings: S.optional(BotAliasLocaleSettingsMap),
    conversationLogSettings: S.optional(ConversationLogSettings),
    sentimentAnalysisSettings: S.optional(SentimentAnalysisSettings),
    botAliasHistoryEvents: S.optional(BotAliasHistoryEventsList),
    botAliasStatus: S.optional(BotAliasStatus),
    botId: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    parentBotNetworks: S.optional(ParentBotNetworks),
  }),
).annotations({
  identifier: "DescribeBotAliasResponse",
}) as any as S.Schema<DescribeBotAliasResponse>;
export interface DescribeBotLocaleResponse {
  botId?: string;
  botVersion?: string;
  localeId?: string;
  localeName?: string;
  description?: string;
  nluIntentConfidenceThreshold?: number;
  voiceSettings?: VoiceSettings;
  unifiedSpeechSettings?: UnifiedSpeechSettings;
  speechRecognitionSettings?: SpeechRecognitionSettings;
  intentsCount?: number;
  slotTypesCount?: number;
  botLocaleStatus?: BotLocaleStatus;
  failureReasons?: string[];
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  lastBuildSubmittedDateTime?: Date;
  botLocaleHistoryEvents?: BotLocaleHistoryEvent[];
  recommendedActions?: string[];
  generativeAISettings?: GenerativeAISettings;
  speechDetectionSensitivity?: SpeechDetectionSensitivity;
}
export const DescribeBotLocaleResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    localeName: S.optional(S.String),
    description: S.optional(S.String),
    nluIntentConfidenceThreshold: S.optional(S.Number),
    voiceSettings: S.optional(VoiceSettings),
    unifiedSpeechSettings: S.optional(UnifiedSpeechSettings),
    speechRecognitionSettings: S.optional(SpeechRecognitionSettings),
    intentsCount: S.optional(S.Number),
    slotTypesCount: S.optional(S.Number),
    botLocaleStatus: S.optional(BotLocaleStatus),
    failureReasons: S.optional(FailureReasons),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastBuildSubmittedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    botLocaleHistoryEvents: S.optional(BotLocaleHistoryEventsList),
    recommendedActions: S.optional(RecommendedActions),
    generativeAISettings: S.optional(GenerativeAISettings),
    speechDetectionSensitivity: S.optional(SpeechDetectionSensitivity),
  }),
).annotations({
  identifier: "DescribeBotLocaleResponse",
}) as any as S.Schema<DescribeBotLocaleResponse>;
export interface ListAggregatedUtterancesRequest {
  botId: string;
  botAliasId?: string;
  botVersion?: string;
  localeId: string;
  aggregationDuration: UtteranceAggregationDuration;
  sortBy?: AggregatedUtterancesSortBy;
  filters?: AggregatedUtterancesFilter[];
  maxResults?: number;
  nextToken?: string;
}
export const ListAggregatedUtterancesRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botAliasId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.String,
    aggregationDuration: UtteranceAggregationDuration,
    sortBy: S.optional(AggregatedUtterancesSortBy),
    filters: S.optional(AggregatedUtterancesFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/bots/{botId}/aggregatedutterances" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAggregatedUtterancesRequest",
}) as any as S.Schema<ListAggregatedUtterancesRequest>;
export interface ListBotAliasesResponse {
  botAliasSummaries?: BotAliasSummary[];
  nextToken?: string;
  botId?: string;
}
export const ListBotAliasesResponse = S.suspend(() =>
  S.Struct({
    botAliasSummaries: S.optional(BotAliasSummaryList),
    nextToken: S.optional(S.String),
    botId: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBotAliasesResponse",
}) as any as S.Schema<ListBotAliasesResponse>;
export interface ListBotAliasReplicasResponse {
  botId?: string;
  sourceRegion?: string;
  replicaRegion?: string;
  botAliasReplicaSummaries?: BotAliasReplicaSummary[];
  nextToken?: string;
}
export const ListBotAliasReplicasResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    sourceRegion: S.optional(S.String),
    replicaRegion: S.optional(S.String),
    botAliasReplicaSummaries: S.optional(BotAliasReplicaSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBotAliasReplicasResponse",
}) as any as S.Schema<ListBotAliasReplicasResponse>;
export interface ListBotRecommendationsResponse {
  botId?: string;
  botVersion?: string;
  localeId?: string;
  botRecommendationSummaries?: BotRecommendationSummary[];
  nextToken?: string;
}
export const ListBotRecommendationsResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    botRecommendationSummaries: S.optional(BotRecommendationSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBotRecommendationsResponse",
}) as any as S.Schema<ListBotRecommendationsResponse>;
export interface ListBotReplicasResponse {
  botId?: string;
  sourceRegion?: string;
  botReplicaSummaries?: BotReplicaSummary[];
}
export const ListBotReplicasResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    sourceRegion: S.optional(S.String),
    botReplicaSummaries: S.optional(BotReplicaSummaryList),
  }),
).annotations({
  identifier: "ListBotReplicasResponse",
}) as any as S.Schema<ListBotReplicasResponse>;
export interface ListRecommendedIntentsResponse {
  botId?: string;
  botVersion?: string;
  localeId?: string;
  botRecommendationId?: string;
  summaryList?: RecommendedIntentSummary[];
  nextToken?: string;
}
export const ListRecommendedIntentsResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    botRecommendationId: S.optional(S.String),
    summaryList: S.optional(RecommendedIntentSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRecommendedIntentsResponse",
}) as any as S.Schema<ListRecommendedIntentsResponse>;
export interface ListTestExecutionResultItemsRequest {
  testExecutionId: string;
  resultFilterBy: TestExecutionResultFilterBy;
  maxResults?: number;
  nextToken?: string;
}
export const ListTestExecutionResultItemsRequest = S.suspend(() =>
  S.Struct({
    testExecutionId: S.String.pipe(T.HttpLabel("testExecutionId")),
    resultFilterBy: TestExecutionResultFilterBy,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/testexecutions/{testExecutionId}/results",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTestExecutionResultItemsRequest",
}) as any as S.Schema<ListTestExecutionResultItemsRequest>;
export interface StartTestExecutionRequest {
  testSetId: string;
  target: TestExecutionTarget;
  apiMode: TestExecutionApiMode;
  testExecutionModality?: TestExecutionModality;
}
export const StartTestExecutionRequest = S.suspend(() =>
  S.Struct({
    testSetId: S.String.pipe(T.HttpLabel("testSetId")),
    target: TestExecutionTarget,
    apiMode: TestExecutionApiMode,
    testExecutionModality: S.optional(TestExecutionModality),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/testsets/{testSetId}/testexecutions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartTestExecutionRequest",
}) as any as S.Schema<StartTestExecutionRequest>;
export interface UpdateIntentResponse {
  intentId?: string;
  intentName?: string;
  intentDisplayName?: string;
  description?: string;
  parentIntentSignature?: string;
  sampleUtterances?: SampleUtterance[];
  dialogCodeHook?: DialogCodeHookSettings;
  fulfillmentCodeHook?: FulfillmentCodeHookSettings;
  slotPriorities?: SlotPriority[];
  intentConfirmationSetting?: IntentConfirmationSetting;
  intentClosingSetting?: IntentClosingSetting;
  inputContexts?: InputContext[];
  outputContexts?: OutputContext[];
  kendraConfiguration?: KendraConfiguration;
  botId?: string;
  botVersion?: string;
  localeId?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  initialResponseSetting?: InitialResponseSetting;
  qnAIntentConfiguration?: QnAIntentConfiguration;
  qInConnectIntentConfiguration?: QInConnectIntentConfiguration;
}
export const UpdateIntentResponse = S.suspend(() =>
  S.Struct({
    intentId: S.optional(S.String),
    intentName: S.optional(S.String),
    intentDisplayName: S.optional(S.String),
    description: S.optional(S.String),
    parentIntentSignature: S.optional(S.String),
    sampleUtterances: S.optional(SampleUtterancesList),
    dialogCodeHook: S.optional(DialogCodeHookSettings),
    fulfillmentCodeHook: S.optional(FulfillmentCodeHookSettings),
    slotPriorities: S.optional(SlotPrioritiesList),
    intentConfirmationSetting: S.optional(IntentConfirmationSetting),
    intentClosingSetting: S.optional(IntentClosingSetting),
    inputContexts: S.optional(InputContextsList),
    outputContexts: S.optional(OutputContextsList),
    kendraConfiguration: S.optional(KendraConfiguration),
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    initialResponseSetting: S.optional(InitialResponseSetting),
    qnAIntentConfiguration: S.optional(QnAIntentConfiguration),
    qInConnectIntentConfiguration: S.optional(QInConnectIntentConfiguration),
  }),
).annotations({
  identifier: "UpdateIntentResponse",
}) as any as S.Schema<UpdateIntentResponse>;
export interface TestSetIntentDiscrepancyItem {
  intentName: string;
  errorMessage: string;
}
export const TestSetIntentDiscrepancyItem = S.suspend(() =>
  S.Struct({ intentName: S.String, errorMessage: S.String }),
).annotations({
  identifier: "TestSetIntentDiscrepancyItem",
}) as any as S.Schema<TestSetIntentDiscrepancyItem>;
export type TestSetIntentDiscrepancyList = TestSetIntentDiscrepancyItem[];
export const TestSetIntentDiscrepancyList = S.Array(
  TestSetIntentDiscrepancyItem,
);
export interface TestSetSlotDiscrepancyItem {
  intentName: string;
  slotName: string;
  errorMessage: string;
}
export const TestSetSlotDiscrepancyItem = S.suspend(() =>
  S.Struct({
    intentName: S.String,
    slotName: S.String,
    errorMessage: S.String,
  }),
).annotations({
  identifier: "TestSetSlotDiscrepancyItem",
}) as any as S.Schema<TestSetSlotDiscrepancyItem>;
export type TestSetSlotDiscrepancyList = TestSetSlotDiscrepancyItem[];
export const TestSetSlotDiscrepancyList = S.Array(TestSetSlotDiscrepancyItem);
export type BotVersionReplicationStatus =
  | "Creating"
  | "Available"
  | "Deleting"
  | "Failed";
export const BotVersionReplicationStatus = S.Literal(
  "Creating",
  "Available",
  "Deleting",
  "Failed",
);
export type ImportResourceType =
  | "Bot"
  | "BotLocale"
  | "CustomVocabulary"
  | "TestSet";
export const ImportResourceType = S.Literal(
  "Bot",
  "BotLocale",
  "CustomVocabulary",
  "TestSet",
);
export type AnalyticsNodeType = "Inner" | "Exit";
export const AnalyticsNodeType = S.Literal("Inner", "Exit");
export type ConversationEndState = "Success" | "Failure" | "Dropped";
export const ConversationEndState = S.Literal("Success", "Failure", "Dropped");
export type AnalyticsModality = "Speech" | "Text" | "DTMF" | "MultiMode";
export const AnalyticsModality = S.Literal(
  "Speech",
  "Text",
  "DTMF",
  "MultiMode",
);
export type SlotTypeCategory =
  | "Custom"
  | "Extended"
  | "ExternalGrammar"
  | "Composite";
export const SlotTypeCategory = S.Literal(
  "Custom",
  "Extended",
  "ExternalGrammar",
  "Composite",
);
export type IntentState =
  | "Failed"
  | "Fulfilled"
  | "InProgress"
  | "ReadyForFulfillment"
  | "Waiting"
  | "FulfillmentInProgress";
export const IntentState = S.Literal(
  "Failed",
  "Fulfilled",
  "InProgress",
  "ReadyForFulfillment",
  "Waiting",
  "FulfillmentInProgress",
);
export type SlotValues = SlotValueOverride[];
export const SlotValues = S.Array(
  S.suspend(
    (): S.Schema<SlotValueOverride, any> => SlotValueOverride,
  ).annotations({ identifier: "SlotValueOverride" }),
) as any as S.Schema<SlotValues>;
export interface TestSetDiscrepancyErrors {
  intentDiscrepancies: TestSetIntentDiscrepancyItem[];
  slotDiscrepancies: TestSetSlotDiscrepancyItem[];
}
export const TestSetDiscrepancyErrors = S.suspend(() =>
  S.Struct({
    intentDiscrepancies: TestSetIntentDiscrepancyList,
    slotDiscrepancies: TestSetSlotDiscrepancyList,
  }),
).annotations({
  identifier: "TestSetDiscrepancyErrors",
}) as any as S.Schema<TestSetDiscrepancyErrors>;
export interface BotLocaleSummary {
  localeId?: string;
  localeName?: string;
  description?: string;
  botLocaleStatus?: BotLocaleStatus;
  lastUpdatedDateTime?: Date;
  lastBuildSubmittedDateTime?: Date;
}
export const BotLocaleSummary = S.suspend(() =>
  S.Struct({
    localeId: S.optional(S.String),
    localeName: S.optional(S.String),
    description: S.optional(S.String),
    botLocaleStatus: S.optional(BotLocaleStatus),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastBuildSubmittedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "BotLocaleSummary",
}) as any as S.Schema<BotLocaleSummary>;
export type BotLocaleSummaryList = BotLocaleSummary[];
export const BotLocaleSummaryList = S.Array(BotLocaleSummary);
export interface GenerationSummary {
  generationId?: string;
  generationStatus?: GenerationStatus;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
}
export const GenerationSummary = S.suspend(() =>
  S.Struct({
    generationId: S.optional(S.String),
    generationStatus: S.optional(GenerationStatus),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "GenerationSummary",
}) as any as S.Schema<GenerationSummary>;
export type GenerationSummaryList = GenerationSummary[];
export const GenerationSummaryList = S.Array(GenerationSummary);
export interface BotSummary {
  botId?: string;
  botName?: string;
  description?: string;
  botStatus?: BotStatus;
  latestBotVersion?: string;
  lastUpdatedDateTime?: Date;
  botType?: BotType;
}
export const BotSummary = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botName: S.optional(S.String),
    description: S.optional(S.String),
    botStatus: S.optional(BotStatus),
    latestBotVersion: S.optional(S.String),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    botType: S.optional(BotType),
  }),
).annotations({ identifier: "BotSummary" }) as any as S.Schema<BotSummary>;
export type BotSummaryList = BotSummary[];
export const BotSummaryList = S.Array(BotSummary);
export interface BotVersionReplicaSummary {
  botVersion?: string;
  botVersionReplicationStatus?: BotVersionReplicationStatus;
  creationDateTime?: Date;
  failureReasons?: string[];
}
export const BotVersionReplicaSummary = S.suspend(() =>
  S.Struct({
    botVersion: S.optional(S.String),
    botVersionReplicationStatus: S.optional(BotVersionReplicationStatus),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    failureReasons: S.optional(FailureReasons),
  }),
).annotations({
  identifier: "BotVersionReplicaSummary",
}) as any as S.Schema<BotVersionReplicaSummary>;
export type BotVersionReplicaSummaryList = BotVersionReplicaSummary[];
export const BotVersionReplicaSummaryList = S.Array(BotVersionReplicaSummary);
export interface BotVersionSummary {
  botName?: string;
  botVersion?: string;
  description?: string;
  botStatus?: BotStatus;
  creationDateTime?: Date;
}
export const BotVersionSummary = S.suspend(() =>
  S.Struct({
    botName: S.optional(S.String),
    botVersion: S.optional(S.String),
    description: S.optional(S.String),
    botStatus: S.optional(BotStatus),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "BotVersionSummary",
}) as any as S.Schema<BotVersionSummary>;
export type BotVersionSummaryList = BotVersionSummary[];
export const BotVersionSummaryList = S.Array(BotVersionSummary);
export interface BuiltInIntentSummary {
  intentSignature?: string;
  description?: string;
}
export const BuiltInIntentSummary = S.suspend(() =>
  S.Struct({
    intentSignature: S.optional(S.String),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "BuiltInIntentSummary",
}) as any as S.Schema<BuiltInIntentSummary>;
export type BuiltInIntentSummaryList = BuiltInIntentSummary[];
export const BuiltInIntentSummaryList = S.Array(BuiltInIntentSummary);
export interface BuiltInSlotTypeSummary {
  slotTypeSignature?: string;
  description?: string;
}
export const BuiltInSlotTypeSummary = S.suspend(() =>
  S.Struct({
    slotTypeSignature: S.optional(S.String),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "BuiltInSlotTypeSummary",
}) as any as S.Schema<BuiltInSlotTypeSummary>;
export type BuiltInSlotTypeSummaryList = BuiltInSlotTypeSummary[];
export const BuiltInSlotTypeSummaryList = S.Array(BuiltInSlotTypeSummary);
export interface ExportSummary {
  exportId?: string;
  resourceSpecification?: ExportResourceSpecification;
  fileFormat?: ImportExportFileFormat;
  exportStatus?: ExportStatus;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
}
export const ExportSummary = S.suspend(() =>
  S.Struct({
    exportId: S.optional(S.String),
    resourceSpecification: S.optional(ExportResourceSpecification),
    fileFormat: S.optional(ImportExportFileFormat),
    exportStatus: S.optional(ExportStatus),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ExportSummary",
}) as any as S.Schema<ExportSummary>;
export type ExportSummaryList = ExportSummary[];
export const ExportSummaryList = S.Array(ExportSummary);
export interface ImportSummary {
  importId?: string;
  importedResourceId?: string;
  importedResourceName?: string;
  importStatus?: ImportStatus;
  mergeStrategy?: MergeStrategy;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  importedResourceType?: ImportResourceType;
}
export const ImportSummary = S.suspend(() =>
  S.Struct({
    importId: S.optional(S.String),
    importedResourceId: S.optional(S.String),
    importedResourceName: S.optional(S.String),
    importStatus: S.optional(ImportStatus),
    mergeStrategy: S.optional(MergeStrategy),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    importedResourceType: S.optional(ImportResourceType),
  }),
).annotations({
  identifier: "ImportSummary",
}) as any as S.Schema<ImportSummary>;
export type ImportSummaryList = ImportSummary[];
export const ImportSummaryList = S.Array(ImportSummary);
export interface AnalyticsIntentNodeSummary {
  intentName?: string;
  intentPath?: string;
  intentCount?: number;
  intentLevel?: number;
  nodeType?: AnalyticsNodeType;
}
export const AnalyticsIntentNodeSummary = S.suspend(() =>
  S.Struct({
    intentName: S.optional(S.String),
    intentPath: S.optional(S.String),
    intentCount: S.optional(S.Number),
    intentLevel: S.optional(S.Number),
    nodeType: S.optional(AnalyticsNodeType),
  }),
).annotations({
  identifier: "AnalyticsIntentNodeSummary",
}) as any as S.Schema<AnalyticsIntentNodeSummary>;
export type AnalyticsIntentNodeSummaries = AnalyticsIntentNodeSummary[];
export const AnalyticsIntentNodeSummaries = S.Array(AnalyticsIntentNodeSummary);
export interface IntentSummary {
  intentId?: string;
  intentName?: string;
  intentDisplayName?: string;
  description?: string;
  parentIntentSignature?: string;
  inputContexts?: InputContext[];
  outputContexts?: OutputContext[];
  lastUpdatedDateTime?: Date;
}
export const IntentSummary = S.suspend(() =>
  S.Struct({
    intentId: S.optional(S.String),
    intentName: S.optional(S.String),
    intentDisplayName: S.optional(S.String),
    description: S.optional(S.String),
    parentIntentSignature: S.optional(S.String),
    inputContexts: S.optional(InputContextsList),
    outputContexts: S.optional(OutputContextsList),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "IntentSummary",
}) as any as S.Schema<IntentSummary>;
export type IntentSummaryList = IntentSummary[];
export const IntentSummaryList = S.Array(IntentSummary);
export interface SlotSummary {
  slotId?: string;
  slotName?: string;
  description?: string;
  slotConstraint?: SlotConstraint;
  slotTypeId?: string;
  valueElicitationPromptSpecification?: PromptSpecification;
  lastUpdatedDateTime?: Date;
}
export const SlotSummary = S.suspend(() =>
  S.Struct({
    slotId: S.optional(S.String),
    slotName: S.optional(S.String),
    description: S.optional(S.String),
    slotConstraint: S.optional(SlotConstraint),
    slotTypeId: S.optional(S.String),
    valueElicitationPromptSpecification: S.optional(PromptSpecification),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "SlotSummary" }) as any as S.Schema<SlotSummary>;
export type SlotSummaryList = SlotSummary[];
export const SlotSummaryList = S.Array(SlotSummary);
export interface SlotTypeSummary {
  slotTypeId?: string;
  slotTypeName?: string;
  description?: string;
  parentSlotTypeSignature?: string;
  lastUpdatedDateTime?: Date;
  slotTypeCategory?: SlotTypeCategory;
}
export const SlotTypeSummary = S.suspend(() =>
  S.Struct({
    slotTypeId: S.optional(S.String),
    slotTypeName: S.optional(S.String),
    description: S.optional(S.String),
    parentSlotTypeSignature: S.optional(S.String),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    slotTypeCategory: S.optional(SlotTypeCategory),
  }),
).annotations({
  identifier: "SlotTypeSummary",
}) as any as S.Schema<SlotTypeSummary>;
export type SlotTypeSummaryList = SlotTypeSummary[];
export const SlotTypeSummaryList = S.Array(SlotTypeSummary);
export interface TestExecutionSummary {
  testExecutionId?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  testExecutionStatus?: TestExecutionStatus;
  testSetId?: string;
  testSetName?: string;
  target?: TestExecutionTarget;
  apiMode?: TestExecutionApiMode;
  testExecutionModality?: TestExecutionModality;
}
export const TestExecutionSummary = S.suspend(() =>
  S.Struct({
    testExecutionId: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    testExecutionStatus: S.optional(TestExecutionStatus),
    testSetId: S.optional(S.String),
    testSetName: S.optional(S.String),
    target: S.optional(TestExecutionTarget),
    apiMode: S.optional(TestExecutionApiMode),
    testExecutionModality: S.optional(TestExecutionModality),
  }),
).annotations({
  identifier: "TestExecutionSummary",
}) as any as S.Schema<TestExecutionSummary>;
export type TestExecutionSummaryList = TestExecutionSummary[];
export const TestExecutionSummaryList = S.Array(TestExecutionSummary);
export interface TestSetSummary {
  testSetId?: string;
  testSetName?: string;
  description?: string;
  modality?: TestSetModality;
  status?: TestSetStatus;
  roleArn?: string;
  numTurns?: number;
  storageLocation?: TestSetStorageLocation;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
}
export const TestSetSummary = S.suspend(() =>
  S.Struct({
    testSetId: S.optional(S.String),
    testSetName: S.optional(S.String),
    description: S.optional(S.String),
    modality: S.optional(TestSetModality),
    status: S.optional(TestSetStatus),
    roleArn: S.optional(S.String),
    numTurns: S.optional(S.Number),
    storageLocation: S.optional(TestSetStorageLocation),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "TestSetSummary",
}) as any as S.Schema<TestSetSummary>;
export type TestSetSummaryList = TestSetSummary[];
export const TestSetSummaryList = S.Array(TestSetSummary);
export interface AssociatedTranscript {
  transcript?: string;
}
export const AssociatedTranscript = S.suspend(() =>
  S.Struct({ transcript: S.optional(S.String) }),
).annotations({
  identifier: "AssociatedTranscript",
}) as any as S.Schema<AssociatedTranscript>;
export type AssociatedTranscriptList = AssociatedTranscript[];
export const AssociatedTranscriptList = S.Array(AssociatedTranscript);
export interface IntentStatistics {
  discoveredIntentCount?: number;
}
export const IntentStatistics = S.suspend(() =>
  S.Struct({ discoveredIntentCount: S.optional(S.Number) }),
).annotations({
  identifier: "IntentStatistics",
}) as any as S.Schema<IntentStatistics>;
export interface SlotTypeStatistics {
  discoveredSlotTypeCount?: number;
}
export const SlotTypeStatistics = S.suspend(() =>
  S.Struct({ discoveredSlotTypeCount: S.optional(S.Number) }),
).annotations({
  identifier: "SlotTypeStatistics",
}) as any as S.Schema<SlotTypeStatistics>;
export interface AgentTurnSpecification {
  agentPrompt: string;
}
export const AgentTurnSpecification = S.suspend(() =>
  S.Struct({ agentPrompt: S.String }),
).annotations({
  identifier: "AgentTurnSpecification",
}) as any as S.Schema<AgentTurnSpecification>;
export type UtteranceContentType =
  | "PlainText"
  | "CustomPayload"
  | "SSML"
  | "ImageResponseCard";
export const UtteranceContentType = S.Literal(
  "PlainText",
  "CustomPayload",
  "SSML",
  "ImageResponseCard",
);
export interface BatchCreateCustomVocabularyItemResponse {
  botId?: string;
  botVersion?: string;
  localeId?: string;
  errors?: FailedCustomVocabularyItem[];
  resources?: CustomVocabularyItem[];
}
export const BatchCreateCustomVocabularyItemResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    errors: S.optional(FailedCustomVocabularyItems),
    resources: S.optional(CustomVocabularyItems),
  }),
).annotations({
  identifier: "BatchCreateCustomVocabularyItemResponse",
}) as any as S.Schema<BatchCreateCustomVocabularyItemResponse>;
export interface CreateBotVersionResponse {
  botId?: string;
  description?: string;
  botVersion?: string;
  botVersionLocaleSpecification?: { [key: string]: BotVersionLocaleDetails };
  botStatus?: BotStatus;
  creationDateTime?: Date;
}
export const CreateBotVersionResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    description: S.optional(S.String),
    botVersion: S.optional(S.String),
    botVersionLocaleSpecification: S.optional(BotVersionLocaleSpecification),
    botStatus: S.optional(BotStatus),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "CreateBotVersionResponse",
}) as any as S.Schema<CreateBotVersionResponse>;
export interface CreateExportResponse {
  exportId?: string;
  resourceSpecification?: ExportResourceSpecification;
  fileFormat?: ImportExportFileFormat;
  exportStatus?: ExportStatus;
  creationDateTime?: Date;
}
export const CreateExportResponse = S.suspend(() =>
  S.Struct({
    exportId: S.optional(S.String),
    resourceSpecification: S.optional(ExportResourceSpecification),
    fileFormat: S.optional(ImportExportFileFormat),
    exportStatus: S.optional(ExportStatus),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "CreateExportResponse",
}) as any as S.Schema<CreateExportResponse>;
export interface CreateResourcePolicyStatementResponse {
  resourceArn?: string;
  revisionId?: string;
}
export const CreateResourcePolicyStatementResponse = S.suspend(() =>
  S.Struct({
    resourceArn: S.optional(S.String),
    revisionId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateResourcePolicyStatementResponse",
}) as any as S.Schema<CreateResourcePolicyStatementResponse>;
export interface CreateSlotTypeRequest {
  slotTypeName: string;
  description?: string;
  slotTypeValues?: SlotTypeValue[];
  valueSelectionSetting?: SlotValueSelectionSetting;
  parentSlotTypeSignature?: string;
  botId: string;
  botVersion: string;
  localeId: string;
  externalSourceSetting?: ExternalSourceSetting;
  compositeSlotTypeSetting?: CompositeSlotTypeSetting;
}
export const CreateSlotTypeRequest = S.suspend(() =>
  S.Struct({
    slotTypeName: S.String,
    description: S.optional(S.String),
    slotTypeValues: S.optional(SlotTypeValues),
    valueSelectionSetting: S.optional(SlotValueSelectionSetting),
    parentSlotTypeSignature: S.optional(S.String),
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    externalSourceSetting: S.optional(ExternalSourceSetting),
    compositeSlotTypeSetting: S.optional(CompositeSlotTypeSetting),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/slottypes",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSlotTypeRequest",
}) as any as S.Schema<CreateSlotTypeRequest>;
export interface CreateTestSetDiscrepancyReportResponse {
  testSetDiscrepancyReportId?: string;
  creationDateTime?: Date;
  testSetId?: string;
  target?: TestSetDiscrepancyReportResourceTarget;
}
export const CreateTestSetDiscrepancyReportResponse = S.suspend(() =>
  S.Struct({
    testSetDiscrepancyReportId: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    testSetId: S.optional(S.String),
    target: S.optional(TestSetDiscrepancyReportResourceTarget),
  }),
).annotations({
  identifier: "CreateTestSetDiscrepancyReportResponse",
}) as any as S.Schema<CreateTestSetDiscrepancyReportResponse>;
export interface DescribeTestSetDiscrepancyReportResponse {
  testSetDiscrepancyReportId?: string;
  testSetId?: string;
  creationDateTime?: Date;
  target?: TestSetDiscrepancyReportResourceTarget;
  testSetDiscrepancyReportStatus?: TestSetDiscrepancyReportStatus;
  lastUpdatedDataTime?: Date;
  testSetDiscrepancyTopErrors?: TestSetDiscrepancyErrors;
  testSetDiscrepancyRawOutputUrl?: string;
  failureReasons?: string[];
}
export const DescribeTestSetDiscrepancyReportResponse = S.suspend(() =>
  S.Struct({
    testSetDiscrepancyReportId: S.optional(S.String),
    testSetId: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    target: S.optional(TestSetDiscrepancyReportResourceTarget),
    testSetDiscrepancyReportStatus: S.optional(TestSetDiscrepancyReportStatus),
    lastUpdatedDataTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    testSetDiscrepancyTopErrors: S.optional(TestSetDiscrepancyErrors),
    testSetDiscrepancyRawOutputUrl: S.optional(S.String),
    failureReasons: S.optional(FailureReasons),
  }),
).annotations({
  identifier: "DescribeTestSetDiscrepancyReportResponse",
}) as any as S.Schema<DescribeTestSetDiscrepancyReportResponse>;
export interface ListBotLocalesResponse {
  botId?: string;
  botVersion?: string;
  nextToken?: string;
  botLocaleSummaries?: BotLocaleSummary[];
}
export const ListBotLocalesResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    nextToken: S.optional(S.String),
    botLocaleSummaries: S.optional(BotLocaleSummaryList),
  }),
).annotations({
  identifier: "ListBotLocalesResponse",
}) as any as S.Schema<ListBotLocalesResponse>;
export interface ListBotResourceGenerationsResponse {
  botId?: string;
  botVersion?: string;
  localeId?: string;
  generationSummaries?: GenerationSummary[];
  nextToken?: string;
}
export const ListBotResourceGenerationsResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    generationSummaries: S.optional(GenerationSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBotResourceGenerationsResponse",
}) as any as S.Schema<ListBotResourceGenerationsResponse>;
export interface ListBotsResponse {
  botSummaries?: BotSummary[];
  nextToken?: string;
}
export const ListBotsResponse = S.suspend(() =>
  S.Struct({
    botSummaries: S.optional(BotSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBotsResponse",
}) as any as S.Schema<ListBotsResponse>;
export interface ListBotVersionReplicasResponse {
  botId?: string;
  sourceRegion?: string;
  replicaRegion?: string;
  botVersionReplicaSummaries?: BotVersionReplicaSummary[];
  nextToken?: string;
}
export const ListBotVersionReplicasResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    sourceRegion: S.optional(S.String),
    replicaRegion: S.optional(S.String),
    botVersionReplicaSummaries: S.optional(BotVersionReplicaSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBotVersionReplicasResponse",
}) as any as S.Schema<ListBotVersionReplicasResponse>;
export interface ListBotVersionsResponse {
  botId?: string;
  botVersionSummaries?: BotVersionSummary[];
  nextToken?: string;
}
export const ListBotVersionsResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersionSummaries: S.optional(BotVersionSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBotVersionsResponse",
}) as any as S.Schema<ListBotVersionsResponse>;
export interface ListBuiltInIntentsResponse {
  builtInIntentSummaries?: BuiltInIntentSummary[];
  nextToken?: string;
  localeId?: string;
}
export const ListBuiltInIntentsResponse = S.suspend(() =>
  S.Struct({
    builtInIntentSummaries: S.optional(BuiltInIntentSummaryList),
    nextToken: S.optional(S.String),
    localeId: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBuiltInIntentsResponse",
}) as any as S.Schema<ListBuiltInIntentsResponse>;
export interface ListBuiltInSlotTypesResponse {
  builtInSlotTypeSummaries?: BuiltInSlotTypeSummary[];
  nextToken?: string;
  localeId?: string;
}
export const ListBuiltInSlotTypesResponse = S.suspend(() =>
  S.Struct({
    builtInSlotTypeSummaries: S.optional(BuiltInSlotTypeSummaryList),
    nextToken: S.optional(S.String),
    localeId: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBuiltInSlotTypesResponse",
}) as any as S.Schema<ListBuiltInSlotTypesResponse>;
export interface ListExportsResponse {
  botId?: string;
  botVersion?: string;
  exportSummaries?: ExportSummary[];
  nextToken?: string;
  localeId?: string;
}
export const ListExportsResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    exportSummaries: S.optional(ExportSummaryList),
    nextToken: S.optional(S.String),
    localeId: S.optional(S.String),
  }),
).annotations({
  identifier: "ListExportsResponse",
}) as any as S.Schema<ListExportsResponse>;
export interface ListImportsResponse {
  botId?: string;
  botVersion?: string;
  importSummaries?: ImportSummary[];
  nextToken?: string;
  localeId?: string;
}
export const ListImportsResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    importSummaries: S.optional(ImportSummaryList),
    nextToken: S.optional(S.String),
    localeId: S.optional(S.String),
  }),
).annotations({
  identifier: "ListImportsResponse",
}) as any as S.Schema<ListImportsResponse>;
export interface ListIntentPathsResponse {
  nodeSummaries?: AnalyticsIntentNodeSummary[];
}
export const ListIntentPathsResponse = S.suspend(() =>
  S.Struct({ nodeSummaries: S.optional(AnalyticsIntentNodeSummaries) }),
).annotations({
  identifier: "ListIntentPathsResponse",
}) as any as S.Schema<ListIntentPathsResponse>;
export interface ListIntentsResponse {
  botId?: string;
  botVersion?: string;
  localeId?: string;
  intentSummaries?: IntentSummary[];
  nextToken?: string;
}
export const ListIntentsResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    intentSummaries: S.optional(IntentSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListIntentsResponse",
}) as any as S.Schema<ListIntentsResponse>;
export interface ListSlotsResponse {
  botId?: string;
  botVersion?: string;
  localeId?: string;
  intentId?: string;
  slotSummaries?: SlotSummary[];
  nextToken?: string;
}
export const ListSlotsResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    intentId: S.optional(S.String),
    slotSummaries: S.optional(SlotSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSlotsResponse",
}) as any as S.Schema<ListSlotsResponse>;
export interface ListSlotTypesResponse {
  botId?: string;
  botVersion?: string;
  localeId?: string;
  slotTypeSummaries?: SlotTypeSummary[];
  nextToken?: string;
}
export const ListSlotTypesResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    slotTypeSummaries: S.optional(SlotTypeSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSlotTypesResponse",
}) as any as S.Schema<ListSlotTypesResponse>;
export interface ListTestExecutionsResponse {
  testExecutions?: TestExecutionSummary[];
  nextToken?: string;
}
export const ListTestExecutionsResponse = S.suspend(() =>
  S.Struct({
    testExecutions: S.optional(TestExecutionSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTestExecutionsResponse",
}) as any as S.Schema<ListTestExecutionsResponse>;
export interface ListTestSetsResponse {
  testSets?: TestSetSummary[];
  nextToken?: string;
}
export const ListTestSetsResponse = S.suspend(() =>
  S.Struct({
    testSets: S.optional(TestSetSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTestSetsResponse",
}) as any as S.Schema<ListTestSetsResponse>;
export interface SearchAssociatedTranscriptsResponse {
  botId?: string;
  botVersion?: string;
  localeId?: string;
  botRecommendationId?: string;
  nextIndex?: number;
  associatedTranscripts?: AssociatedTranscript[];
  totalResults?: number;
}
export const SearchAssociatedTranscriptsResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    botRecommendationId: S.optional(S.String),
    nextIndex: S.optional(S.Number),
    associatedTranscripts: S.optional(AssociatedTranscriptList),
    totalResults: S.optional(S.Number),
  }),
).annotations({
  identifier: "SearchAssociatedTranscriptsResponse",
}) as any as S.Schema<SearchAssociatedTranscriptsResponse>;
export interface StartImportRequest {
  importId: string;
  resourceSpecification: ImportResourceSpecification;
  mergeStrategy: MergeStrategy;
  filePassword?: string | redacted.Redacted<string>;
}
export const StartImportRequest = S.suspend(() =>
  S.Struct({
    importId: S.String,
    resourceSpecification: ImportResourceSpecification,
    mergeStrategy: MergeStrategy,
    filePassword: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/imports" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartImportRequest",
}) as any as S.Schema<StartImportRequest>;
export interface StartTestExecutionResponse {
  testExecutionId?: string;
  creationDateTime?: Date;
  testSetId?: string;
  target?: TestExecutionTarget;
  apiMode?: TestExecutionApiMode;
  testExecutionModality?: TestExecutionModality;
}
export const StartTestExecutionResponse = S.suspend(() =>
  S.Struct({
    testExecutionId: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    testSetId: S.optional(S.String),
    target: S.optional(TestExecutionTarget),
    apiMode: S.optional(TestExecutionApiMode),
    testExecutionModality: S.optional(TestExecutionModality),
  }),
).annotations({
  identifier: "StartTestExecutionResponse",
}) as any as S.Schema<StartTestExecutionResponse>;
export interface StartTestSetGenerationRequest {
  testSetName: string;
  description?: string;
  storageLocation: TestSetStorageLocation;
  generationDataSource: TestSetGenerationDataSource;
  roleArn: string;
  testSetTags?: { [key: string]: string };
}
export const StartTestSetGenerationRequest = S.suspend(() =>
  S.Struct({
    testSetName: S.String,
    description: S.optional(S.String),
    storageLocation: TestSetStorageLocation,
    generationDataSource: TestSetGenerationDataSource,
    roleArn: S.String,
    testSetTags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/testsetgenerations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartTestSetGenerationRequest",
}) as any as S.Schema<StartTestSetGenerationRequest>;
export interface BotRecommendationResultStatistics {
  intents?: IntentStatistics;
  slotTypes?: SlotTypeStatistics;
}
export const BotRecommendationResultStatistics = S.suspend(() =>
  S.Struct({
    intents: S.optional(IntentStatistics),
    slotTypes: S.optional(SlotTypeStatistics),
  }),
).annotations({
  identifier: "BotRecommendationResultStatistics",
}) as any as S.Schema<BotRecommendationResultStatistics>;
export interface AnalyticsBinKey {
  name?: AnalyticsBinByName;
  value?: number;
}
export const AnalyticsBinKey = S.suspend(() =>
  S.Struct({
    name: S.optional(AnalyticsBinByName),
    value: S.optional(S.Number),
  }),
).annotations({
  identifier: "AnalyticsBinKey",
}) as any as S.Schema<AnalyticsBinKey>;
export type AnalyticsBinKeys = AnalyticsBinKey[];
export const AnalyticsBinKeys = S.Array(AnalyticsBinKey);
export interface AnalyticsIntentGroupByKey {
  name?: AnalyticsIntentField;
  value?: string;
}
export const AnalyticsIntentGroupByKey = S.suspend(() =>
  S.Struct({
    name: S.optional(AnalyticsIntentField),
    value: S.optional(S.String),
  }),
).annotations({
  identifier: "AnalyticsIntentGroupByKey",
}) as any as S.Schema<AnalyticsIntentGroupByKey>;
export type AnalyticsIntentGroupByKeys = AnalyticsIntentGroupByKey[];
export const AnalyticsIntentGroupByKeys = S.Array(AnalyticsIntentGroupByKey);
export interface AnalyticsIntentMetricResult {
  name?: AnalyticsIntentMetricName;
  statistic?: AnalyticsMetricStatistic;
  value?: number;
}
export const AnalyticsIntentMetricResult = S.suspend(() =>
  S.Struct({
    name: S.optional(AnalyticsIntentMetricName),
    statistic: S.optional(AnalyticsMetricStatistic),
    value: S.optional(S.Number),
  }),
).annotations({
  identifier: "AnalyticsIntentMetricResult",
}) as any as S.Schema<AnalyticsIntentMetricResult>;
export type AnalyticsIntentMetricResults = AnalyticsIntentMetricResult[];
export const AnalyticsIntentMetricResults = S.Array(
  AnalyticsIntentMetricResult,
);
export interface AnalyticsIntentStageGroupByKey {
  name?: AnalyticsIntentStageField;
  value?: string;
}
export const AnalyticsIntentStageGroupByKey = S.suspend(() =>
  S.Struct({
    name: S.optional(AnalyticsIntentStageField),
    value: S.optional(S.String),
  }),
).annotations({
  identifier: "AnalyticsIntentStageGroupByKey",
}) as any as S.Schema<AnalyticsIntentStageGroupByKey>;
export type AnalyticsIntentStageGroupByKeys = AnalyticsIntentStageGroupByKey[];
export const AnalyticsIntentStageGroupByKeys = S.Array(
  AnalyticsIntentStageGroupByKey,
);
export interface AnalyticsIntentStageMetricResult {
  name?: AnalyticsIntentStageMetricName;
  statistic?: AnalyticsMetricStatistic;
  value?: number;
}
export const AnalyticsIntentStageMetricResult = S.suspend(() =>
  S.Struct({
    name: S.optional(AnalyticsIntentStageMetricName),
    statistic: S.optional(AnalyticsMetricStatistic),
    value: S.optional(S.Number),
  }),
).annotations({
  identifier: "AnalyticsIntentStageMetricResult",
}) as any as S.Schema<AnalyticsIntentStageMetricResult>;
export type AnalyticsIntentStageMetricResults =
  AnalyticsIntentStageMetricResult[];
export const AnalyticsIntentStageMetricResults = S.Array(
  AnalyticsIntentStageMetricResult,
);
export interface InvokedIntentSample {
  intentName?: string;
}
export const InvokedIntentSample = S.suspend(() =>
  S.Struct({ intentName: S.optional(S.String) }),
).annotations({
  identifier: "InvokedIntentSample",
}) as any as S.Schema<InvokedIntentSample>;
export type InvokedIntentSamples = InvokedIntentSample[];
export const InvokedIntentSamples = S.Array(InvokedIntentSample);
export interface AnalyticsSessionGroupByKey {
  name?: AnalyticsSessionField;
  value?: string;
}
export const AnalyticsSessionGroupByKey = S.suspend(() =>
  S.Struct({
    name: S.optional(AnalyticsSessionField),
    value: S.optional(S.String),
  }),
).annotations({
  identifier: "AnalyticsSessionGroupByKey",
}) as any as S.Schema<AnalyticsSessionGroupByKey>;
export type AnalyticsSessionGroupByKeys = AnalyticsSessionGroupByKey[];
export const AnalyticsSessionGroupByKeys = S.Array(AnalyticsSessionGroupByKey);
export interface AnalyticsSessionMetricResult {
  name?: AnalyticsSessionMetricName;
  statistic?: AnalyticsMetricStatistic;
  value?: number;
}
export const AnalyticsSessionMetricResult = S.suspend(() =>
  S.Struct({
    name: S.optional(AnalyticsSessionMetricName),
    statistic: S.optional(AnalyticsMetricStatistic),
    value: S.optional(S.Number),
  }),
).annotations({
  identifier: "AnalyticsSessionMetricResult",
}) as any as S.Schema<AnalyticsSessionMetricResult>;
export type AnalyticsSessionMetricResults = AnalyticsSessionMetricResult[];
export const AnalyticsSessionMetricResults = S.Array(
  AnalyticsSessionMetricResult,
);
export interface UtteranceBotResponse {
  content?: string;
  contentType?: UtteranceContentType;
  imageResponseCard?: ImageResponseCard;
}
export const UtteranceBotResponse = S.suspend(() =>
  S.Struct({
    content: S.optional(S.String),
    contentType: S.optional(UtteranceContentType),
    imageResponseCard: S.optional(ImageResponseCard),
  }),
).annotations({
  identifier: "UtteranceBotResponse",
}) as any as S.Schema<UtteranceBotResponse>;
export type UtteranceBotResponses = UtteranceBotResponse[];
export const UtteranceBotResponses = S.Array(UtteranceBotResponse);
export interface AnalyticsUtteranceGroupByKey {
  name?: AnalyticsUtteranceField;
  value?: string;
}
export const AnalyticsUtteranceGroupByKey = S.suspend(() =>
  S.Struct({
    name: S.optional(AnalyticsUtteranceField),
    value: S.optional(S.String),
  }),
).annotations({
  identifier: "AnalyticsUtteranceGroupByKey",
}) as any as S.Schema<AnalyticsUtteranceGroupByKey>;
export type AnalyticsUtteranceGroupByKeys = AnalyticsUtteranceGroupByKey[];
export const AnalyticsUtteranceGroupByKeys = S.Array(
  AnalyticsUtteranceGroupByKey,
);
export interface AnalyticsUtteranceMetricResult {
  name?: AnalyticsUtteranceMetricName;
  statistic?: AnalyticsMetricStatistic;
  value?: number;
}
export const AnalyticsUtteranceMetricResult = S.suspend(() =>
  S.Struct({
    name: S.optional(AnalyticsUtteranceMetricName),
    statistic: S.optional(AnalyticsMetricStatistic),
    value: S.optional(S.Number),
  }),
).annotations({
  identifier: "AnalyticsUtteranceMetricResult",
}) as any as S.Schema<AnalyticsUtteranceMetricResult>;
export type AnalyticsUtteranceMetricResults = AnalyticsUtteranceMetricResult[];
export const AnalyticsUtteranceMetricResults = S.Array(
  AnalyticsUtteranceMetricResult,
);
export interface AnalyticsUtteranceAttributeResult {
  lastUsedIntent?: string;
}
export const AnalyticsUtteranceAttributeResult = S.suspend(() =>
  S.Struct({ lastUsedIntent: S.optional(S.String) }),
).annotations({
  identifier: "AnalyticsUtteranceAttributeResult",
}) as any as S.Schema<AnalyticsUtteranceAttributeResult>;
export type AnalyticsUtteranceAttributeResults =
  AnalyticsUtteranceAttributeResult[];
export const AnalyticsUtteranceAttributeResults = S.Array(
  AnalyticsUtteranceAttributeResult,
);
export interface BotRecommendationResults {
  botLocaleExportUrl?: string;
  associatedTranscriptsUrl?: string;
  statistics?: BotRecommendationResultStatistics;
}
export const BotRecommendationResults = S.suspend(() =>
  S.Struct({
    botLocaleExportUrl: S.optional(S.String),
    associatedTranscriptsUrl: S.optional(S.String),
    statistics: S.optional(BotRecommendationResultStatistics),
  }),
).annotations({
  identifier: "BotRecommendationResults",
}) as any as S.Schema<BotRecommendationResults>;
export interface AggregatedUtterancesSummary {
  utterance?: string;
  hitCount?: number;
  missedCount?: number;
  utteranceFirstRecordedInAggregationDuration?: Date;
  utteranceLastRecordedInAggregationDuration?: Date;
  containsDataFromDeletedResources?: boolean;
}
export const AggregatedUtterancesSummary = S.suspend(() =>
  S.Struct({
    utterance: S.optional(S.String),
    hitCount: S.optional(S.Number),
    missedCount: S.optional(S.Number),
    utteranceFirstRecordedInAggregationDuration: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    utteranceLastRecordedInAggregationDuration: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    containsDataFromDeletedResources: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AggregatedUtterancesSummary",
}) as any as S.Schema<AggregatedUtterancesSummary>;
export type AggregatedUtterancesSummaryList = AggregatedUtterancesSummary[];
export const AggregatedUtterancesSummaryList = S.Array(
  AggregatedUtterancesSummary,
);
export interface AnalyticsIntentResult {
  binKeys?: AnalyticsBinKey[];
  groupByKeys?: AnalyticsIntentGroupByKey[];
  metricsResults?: AnalyticsIntentMetricResult[];
}
export const AnalyticsIntentResult = S.suspend(() =>
  S.Struct({
    binKeys: S.optional(AnalyticsBinKeys),
    groupByKeys: S.optional(AnalyticsIntentGroupByKeys),
    metricsResults: S.optional(AnalyticsIntentMetricResults),
  }),
).annotations({
  identifier: "AnalyticsIntentResult",
}) as any as S.Schema<AnalyticsIntentResult>;
export type AnalyticsIntentResults = AnalyticsIntentResult[];
export const AnalyticsIntentResults = S.Array(AnalyticsIntentResult);
export interface AnalyticsIntentStageResult {
  binKeys?: AnalyticsBinKey[];
  groupByKeys?: AnalyticsIntentStageGroupByKey[];
  metricsResults?: AnalyticsIntentStageMetricResult[];
}
export const AnalyticsIntentStageResult = S.suspend(() =>
  S.Struct({
    binKeys: S.optional(AnalyticsBinKeys),
    groupByKeys: S.optional(AnalyticsIntentStageGroupByKeys),
    metricsResults: S.optional(AnalyticsIntentStageMetricResults),
  }),
).annotations({
  identifier: "AnalyticsIntentStageResult",
}) as any as S.Schema<AnalyticsIntentStageResult>;
export type AnalyticsIntentStageResults = AnalyticsIntentStageResult[];
export const AnalyticsIntentStageResults = S.Array(AnalyticsIntentStageResult);
export interface SessionSpecification {
  botAliasId?: string;
  botVersion?: string;
  localeId?: string;
  channel?: string;
  sessionId?: string;
  conversationStartTime?: Date;
  conversationEndTime?: Date;
  conversationDurationSeconds?: number;
  conversationEndState?: ConversationEndState;
  mode?: AnalyticsModality;
  numberOfTurns?: number;
  invokedIntentSamples?: InvokedIntentSample[];
  originatingRequestId?: string;
}
export const SessionSpecification = S.suspend(() =>
  S.Struct({
    botAliasId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    channel: S.optional(S.String),
    sessionId: S.optional(S.String),
    conversationStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    conversationEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    conversationDurationSeconds: S.optional(S.Number),
    conversationEndState: S.optional(ConversationEndState),
    mode: S.optional(AnalyticsModality),
    numberOfTurns: S.optional(S.Number),
    invokedIntentSamples: S.optional(InvokedIntentSamples),
    originatingRequestId: S.optional(S.String),
  }),
).annotations({
  identifier: "SessionSpecification",
}) as any as S.Schema<SessionSpecification>;
export type SessionSpecifications = SessionSpecification[];
export const SessionSpecifications = S.Array(SessionSpecification);
export interface AnalyticsSessionResult {
  binKeys?: AnalyticsBinKey[];
  groupByKeys?: AnalyticsSessionGroupByKey[];
  metricsResults?: AnalyticsSessionMetricResult[];
}
export const AnalyticsSessionResult = S.suspend(() =>
  S.Struct({
    binKeys: S.optional(AnalyticsBinKeys),
    groupByKeys: S.optional(AnalyticsSessionGroupByKeys),
    metricsResults: S.optional(AnalyticsSessionMetricResults),
  }),
).annotations({
  identifier: "AnalyticsSessionResult",
}) as any as S.Schema<AnalyticsSessionResult>;
export type AnalyticsSessionResults = AnalyticsSessionResult[];
export const AnalyticsSessionResults = S.Array(AnalyticsSessionResult);
export interface UtteranceSpecification {
  botAliasId?: string;
  botVersion?: string;
  localeId?: string;
  sessionId?: string;
  channel?: string;
  mode?: AnalyticsModality;
  conversationStartTime?: Date;
  conversationEndTime?: Date;
  utterance?: string;
  utteranceTimestamp?: Date;
  audioVoiceDurationMillis?: number;
  utteranceUnderstood?: boolean;
  inputType?: string;
  outputType?: string;
  associatedIntentName?: string;
  associatedSlotName?: string;
  intentState?: IntentState;
  dialogActionType?: string;
  botResponseAudioVoiceId?: string;
  slotsFilledInSession?: string;
  utteranceRequestId?: string;
  botResponses?: UtteranceBotResponse[];
}
export const UtteranceSpecification = S.suspend(() =>
  S.Struct({
    botAliasId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    sessionId: S.optional(S.String),
    channel: S.optional(S.String),
    mode: S.optional(AnalyticsModality),
    conversationStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    conversationEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    utterance: S.optional(S.String),
    utteranceTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    audioVoiceDurationMillis: S.optional(S.Number),
    utteranceUnderstood: S.optional(S.Boolean),
    inputType: S.optional(S.String),
    outputType: S.optional(S.String),
    associatedIntentName: S.optional(S.String),
    associatedSlotName: S.optional(S.String),
    intentState: S.optional(IntentState),
    dialogActionType: S.optional(S.String),
    botResponseAudioVoiceId: S.optional(S.String),
    slotsFilledInSession: S.optional(S.String),
    utteranceRequestId: S.optional(S.String),
    botResponses: S.optional(UtteranceBotResponses),
  }),
).annotations({
  identifier: "UtteranceSpecification",
}) as any as S.Schema<UtteranceSpecification>;
export type UtteranceSpecifications = UtteranceSpecification[];
export const UtteranceSpecifications = S.Array(UtteranceSpecification);
export interface AnalyticsUtteranceResult {
  binKeys?: AnalyticsBinKey[];
  groupByKeys?: AnalyticsUtteranceGroupByKey[];
  metricsResults?: AnalyticsUtteranceMetricResult[];
  attributeResults?: AnalyticsUtteranceAttributeResult[];
}
export const AnalyticsUtteranceResult = S.suspend(() =>
  S.Struct({
    binKeys: S.optional(AnalyticsBinKeys),
    groupByKeys: S.optional(AnalyticsUtteranceGroupByKeys),
    metricsResults: S.optional(AnalyticsUtteranceMetricResults),
    attributeResults: S.optional(AnalyticsUtteranceAttributeResults),
  }),
).annotations({
  identifier: "AnalyticsUtteranceResult",
}) as any as S.Schema<AnalyticsUtteranceResult>;
export type AnalyticsUtteranceResults = AnalyticsUtteranceResult[];
export const AnalyticsUtteranceResults = S.Array(AnalyticsUtteranceResult);
export interface CreateBotAliasRequest {
  botAliasName: string;
  description?: string;
  botVersion?: string;
  botAliasLocaleSettings?: { [key: string]: BotAliasLocaleSettings };
  conversationLogSettings?: ConversationLogSettings;
  sentimentAnalysisSettings?: SentimentAnalysisSettings;
  botId: string;
  tags?: { [key: string]: string };
}
export const CreateBotAliasRequest = S.suspend(() =>
  S.Struct({
    botAliasName: S.String,
    description: S.optional(S.String),
    botVersion: S.optional(S.String),
    botAliasLocaleSettings: S.optional(BotAliasLocaleSettingsMap),
    conversationLogSettings: S.optional(ConversationLogSettings),
    sentimentAnalysisSettings: S.optional(SentimentAnalysisSettings),
    botId: S.String.pipe(T.HttpLabel("botId")),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/bots/{botId}/botaliases" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBotAliasRequest",
}) as any as S.Schema<CreateBotAliasRequest>;
export interface CreateBotLocaleRequest {
  botId: string;
  botVersion: string;
  localeId: string;
  description?: string;
  nluIntentConfidenceThreshold: number;
  voiceSettings?: VoiceSettings;
  unifiedSpeechSettings?: UnifiedSpeechSettings;
  speechRecognitionSettings?: SpeechRecognitionSettings;
  generativeAISettings?: GenerativeAISettings;
  speechDetectionSensitivity?: SpeechDetectionSensitivity;
}
export const CreateBotLocaleRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String,
    description: S.optional(S.String),
    nluIntentConfidenceThreshold: S.Number,
    voiceSettings: S.optional(VoiceSettings),
    unifiedSpeechSettings: S.optional(UnifiedSpeechSettings),
    speechRecognitionSettings: S.optional(SpeechRecognitionSettings),
    generativeAISettings: S.optional(GenerativeAISettings),
    speechDetectionSensitivity: S.optional(SpeechDetectionSensitivity),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBotLocaleRequest",
}) as any as S.Schema<CreateBotLocaleRequest>;
export interface CreateSlotRequest {
  slotName: string;
  description?: string;
  slotTypeId?: string;
  valueElicitationSetting: SlotValueElicitationSetting;
  obfuscationSetting?: ObfuscationSetting;
  botId: string;
  botVersion: string;
  localeId: string;
  intentId: string;
  multipleValuesSetting?: MultipleValuesSetting;
  subSlotSetting?: SubSlotSetting;
}
export const CreateSlotRequest = S.suspend(() =>
  S.Struct({
    slotName: S.String,
    description: S.optional(S.String),
    slotTypeId: S.optional(S.String),
    valueElicitationSetting: SlotValueElicitationSetting,
    obfuscationSetting: S.optional(ObfuscationSetting),
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    intentId: S.String.pipe(T.HttpLabel("intentId")),
    multipleValuesSetting: S.optional(MultipleValuesSetting),
    subSlotSetting: S.optional(SubSlotSetting),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/intents/{intentId}/slots",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSlotRequest",
}) as any as S.Schema<CreateSlotRequest>;
export interface CreateSlotTypeResponse {
  slotTypeId?: string;
  slotTypeName?: string;
  description?: string;
  slotTypeValues?: SlotTypeValue[];
  valueSelectionSetting?: SlotValueSelectionSetting;
  parentSlotTypeSignature?: string;
  botId?: string;
  botVersion?: string;
  localeId?: string;
  creationDateTime?: Date;
  externalSourceSetting?: ExternalSourceSetting;
  compositeSlotTypeSetting?: CompositeSlotTypeSetting;
}
export const CreateSlotTypeResponse = S.suspend(() =>
  S.Struct({
    slotTypeId: S.optional(S.String),
    slotTypeName: S.optional(S.String),
    description: S.optional(S.String),
    slotTypeValues: S.optional(SlotTypeValues),
    valueSelectionSetting: S.optional(SlotValueSelectionSetting),
    parentSlotTypeSignature: S.optional(S.String),
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    externalSourceSetting: S.optional(ExternalSourceSetting),
    compositeSlotTypeSetting: S.optional(CompositeSlotTypeSetting),
  }),
).annotations({
  identifier: "CreateSlotTypeResponse",
}) as any as S.Schema<CreateSlotTypeResponse>;
export interface DescribeBotRecommendationResponse {
  botId?: string;
  botVersion?: string;
  localeId?: string;
  botRecommendationStatus?: BotRecommendationStatus;
  botRecommendationId?: string;
  failureReasons?: string[];
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  transcriptSourceSetting?: TranscriptSourceSetting;
  encryptionSetting?: EncryptionSetting;
  botRecommendationResults?: BotRecommendationResults;
}
export const DescribeBotRecommendationResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    botRecommendationStatus: S.optional(BotRecommendationStatus),
    botRecommendationId: S.optional(S.String),
    failureReasons: S.optional(FailureReasons),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    transcriptSourceSetting: S.optional(TranscriptSourceSetting),
    encryptionSetting: S.optional(EncryptionSetting),
    botRecommendationResults: S.optional(BotRecommendationResults),
  }),
).annotations({
  identifier: "DescribeBotRecommendationResponse",
}) as any as S.Schema<DescribeBotRecommendationResponse>;
export interface ListAggregatedUtterancesResponse {
  botId?: string;
  botAliasId?: string;
  botVersion?: string;
  localeId?: string;
  aggregationDuration?: UtteranceAggregationDuration;
  aggregationWindowStartTime?: Date;
  aggregationWindowEndTime?: Date;
  aggregationLastRefreshedDateTime?: Date;
  aggregatedUtterancesSummaries?: AggregatedUtterancesSummary[];
  nextToken?: string;
}
export const ListAggregatedUtterancesResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botAliasId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    aggregationDuration: S.optional(UtteranceAggregationDuration),
    aggregationWindowStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    aggregationWindowEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    aggregationLastRefreshedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    aggregatedUtterancesSummaries: S.optional(AggregatedUtterancesSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAggregatedUtterancesResponse",
}) as any as S.Schema<ListAggregatedUtterancesResponse>;
export interface ListIntentMetricsResponse {
  botId?: string;
  results?: AnalyticsIntentResult[];
  nextToken?: string;
}
export const ListIntentMetricsResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    results: S.optional(AnalyticsIntentResults),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListIntentMetricsResponse",
}) as any as S.Schema<ListIntentMetricsResponse>;
export interface ListIntentStageMetricsResponse {
  botId?: string;
  results?: AnalyticsIntentStageResult[];
  nextToken?: string;
}
export const ListIntentStageMetricsResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    results: S.optional(AnalyticsIntentStageResults),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListIntentStageMetricsResponse",
}) as any as S.Schema<ListIntentStageMetricsResponse>;
export interface ListSessionAnalyticsDataResponse {
  botId?: string;
  nextToken?: string;
  sessions?: SessionSpecification[];
}
export const ListSessionAnalyticsDataResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    nextToken: S.optional(S.String),
    sessions: S.optional(SessionSpecifications),
  }),
).annotations({
  identifier: "ListSessionAnalyticsDataResponse",
}) as any as S.Schema<ListSessionAnalyticsDataResponse>;
export interface ListSessionMetricsResponse {
  botId?: string;
  results?: AnalyticsSessionResult[];
  nextToken?: string;
}
export const ListSessionMetricsResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    results: S.optional(AnalyticsSessionResults),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSessionMetricsResponse",
}) as any as S.Schema<ListSessionMetricsResponse>;
export interface ActiveContext {
  name: string;
}
export const ActiveContext = S.suspend(() =>
  S.Struct({ name: S.String }),
).annotations({
  identifier: "ActiveContext",
}) as any as S.Schema<ActiveContext>;
export type ActiveContextList = ActiveContext[];
export const ActiveContextList = S.Array(ActiveContext);
export interface ListUtteranceAnalyticsDataResponse {
  botId?: string;
  nextToken?: string;
  utterances?: UtteranceSpecification[];
}
export const ListUtteranceAnalyticsDataResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    nextToken: S.optional(S.String),
    utterances: S.optional(UtteranceSpecifications),
  }),
).annotations({
  identifier: "ListUtteranceAnalyticsDataResponse",
}) as any as S.Schema<ListUtteranceAnalyticsDataResponse>;
export interface ListUtteranceMetricsResponse {
  botId?: string;
  results?: AnalyticsUtteranceResult[];
  nextToken?: string;
}
export const ListUtteranceMetricsResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    results: S.optional(AnalyticsUtteranceResults),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListUtteranceMetricsResponse",
}) as any as S.Schema<ListUtteranceMetricsResponse>;
export interface StartImportResponse {
  importId?: string;
  resourceSpecification?: ImportResourceSpecification;
  mergeStrategy?: MergeStrategy;
  importStatus?: ImportStatus;
  creationDateTime?: Date;
}
export const StartImportResponse = S.suspend(() =>
  S.Struct({
    importId: S.optional(S.String),
    resourceSpecification: S.optional(ImportResourceSpecification),
    mergeStrategy: S.optional(MergeStrategy),
    importStatus: S.optional(ImportStatus),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "StartImportResponse",
}) as any as S.Schema<StartImportResponse>;
export interface StartTestSetGenerationResponse {
  testSetGenerationId?: string;
  creationDateTime?: Date;
  testSetGenerationStatus?: TestSetGenerationStatus;
  testSetName?: string;
  description?: string;
  storageLocation?: TestSetStorageLocation;
  generationDataSource?: TestSetGenerationDataSource;
  roleArn?: string;
  testSetTags?: { [key: string]: string };
}
export const StartTestSetGenerationResponse = S.suspend(() =>
  S.Struct({
    testSetGenerationId: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    testSetGenerationStatus: S.optional(TestSetGenerationStatus),
    testSetName: S.optional(S.String),
    description: S.optional(S.String),
    storageLocation: S.optional(TestSetStorageLocation),
    generationDataSource: S.optional(TestSetGenerationDataSource),
    roleArn: S.optional(S.String),
    testSetTags: S.optional(TagMap),
  }),
).annotations({
  identifier: "StartTestSetGenerationResponse",
}) as any as S.Schema<StartTestSetGenerationResponse>;
export interface UtteranceAudioInputSpecification {
  audioFileS3Location: string;
}
export const UtteranceAudioInputSpecification = S.suspend(() =>
  S.Struct({ audioFileS3Location: S.String }),
).annotations({
  identifier: "UtteranceAudioInputSpecification",
}) as any as S.Schema<UtteranceAudioInputSpecification>;
export type UserTurnSlotOutputList = UserTurnSlotOutput[];
export const UserTurnSlotOutputList = S.Array(
  S.suspend(
    (): S.Schema<UserTurnSlotOutput, any> => UserTurnSlotOutput,
  ).annotations({ identifier: "UserTurnSlotOutput" }),
) as any as S.Schema<UserTurnSlotOutputList>;
export interface CreateBotAliasResponse {
  botAliasId?: string;
  botAliasName?: string;
  description?: string;
  botVersion?: string;
  botAliasLocaleSettings?: { [key: string]: BotAliasLocaleSettings };
  conversationLogSettings?: ConversationLogSettings;
  sentimentAnalysisSettings?: SentimentAnalysisSettings;
  botAliasStatus?: BotAliasStatus;
  botId?: string;
  creationDateTime?: Date;
  tags?: { [key: string]: string };
}
export const CreateBotAliasResponse = S.suspend(() =>
  S.Struct({
    botAliasId: S.optional(S.String),
    botAliasName: S.optional(S.String),
    description: S.optional(S.String),
    botVersion: S.optional(S.String),
    botAliasLocaleSettings: S.optional(BotAliasLocaleSettingsMap),
    conversationLogSettings: S.optional(ConversationLogSettings),
    sentimentAnalysisSettings: S.optional(SentimentAnalysisSettings),
    botAliasStatus: S.optional(BotAliasStatus),
    botId: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "CreateBotAliasResponse",
}) as any as S.Schema<CreateBotAliasResponse>;
export interface CreateBotLocaleResponse {
  botId?: string;
  botVersion?: string;
  localeName?: string;
  localeId?: string;
  description?: string;
  nluIntentConfidenceThreshold?: number;
  voiceSettings?: VoiceSettings;
  unifiedSpeechSettings?: UnifiedSpeechSettings;
  speechRecognitionSettings?: SpeechRecognitionSettings;
  botLocaleStatus?: BotLocaleStatus;
  creationDateTime?: Date;
  generativeAISettings?: GenerativeAISettings;
  speechDetectionSensitivity?: SpeechDetectionSensitivity;
}
export const CreateBotLocaleResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeName: S.optional(S.String),
    localeId: S.optional(S.String),
    description: S.optional(S.String),
    nluIntentConfidenceThreshold: S.optional(S.Number),
    voiceSettings: S.optional(VoiceSettings),
    unifiedSpeechSettings: S.optional(UnifiedSpeechSettings),
    speechRecognitionSettings: S.optional(SpeechRecognitionSettings),
    botLocaleStatus: S.optional(BotLocaleStatus),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    generativeAISettings: S.optional(GenerativeAISettings),
    speechDetectionSensitivity: S.optional(SpeechDetectionSensitivity),
  }),
).annotations({
  identifier: "CreateBotLocaleResponse",
}) as any as S.Schema<CreateBotLocaleResponse>;
export interface CreateSlotResponse {
  slotId?: string;
  slotName?: string;
  description?: string;
  slotTypeId?: string;
  valueElicitationSetting?: SlotValueElicitationSetting;
  obfuscationSetting?: ObfuscationSetting;
  botId?: string;
  botVersion?: string;
  localeId?: string;
  intentId?: string;
  creationDateTime?: Date;
  multipleValuesSetting?: MultipleValuesSetting;
  subSlotSetting?: SubSlotSetting;
}
export const CreateSlotResponse = S.suspend(() =>
  S.Struct({
    slotId: S.optional(S.String),
    slotName: S.optional(S.String),
    description: S.optional(S.String),
    slotTypeId: S.optional(S.String),
    valueElicitationSetting: S.optional(SlotValueElicitationSetting),
    obfuscationSetting: S.optional(ObfuscationSetting),
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    intentId: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    multipleValuesSetting: S.optional(MultipleValuesSetting),
    subSlotSetting: S.optional(SubSlotSetting),
  }),
).annotations({
  identifier: "CreateSlotResponse",
}) as any as S.Schema<CreateSlotResponse>;
export interface UtteranceInputSpecification {
  textInput?: string;
  audioInput?: UtteranceAudioInputSpecification;
}
export const UtteranceInputSpecification = S.suspend(() =>
  S.Struct({
    textInput: S.optional(S.String),
    audioInput: S.optional(UtteranceAudioInputSpecification),
  }),
).annotations({
  identifier: "UtteranceInputSpecification",
}) as any as S.Schema<UtteranceInputSpecification>;
export interface StartBotRecommendationRequest {
  botId: string;
  botVersion: string;
  localeId: string;
  transcriptSourceSetting: TranscriptSourceSetting;
  encryptionSetting?: EncryptionSetting;
}
export const StartBotRecommendationRequest = S.suspend(() =>
  S.Struct({
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    transcriptSourceSetting: TranscriptSourceSetting,
    encryptionSetting: S.optional(EncryptionSetting),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/botrecommendations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartBotRecommendationRequest",
}) as any as S.Schema<StartBotRecommendationRequest>;
export interface UserTurnSlotOutput {
  value?: string;
  values?: UserTurnSlotOutput[];
  subSlots?: { [key: string]: UserTurnSlotOutput };
}
export const UserTurnSlotOutput = S.suspend(() =>
  S.Struct({
    value: S.optional(S.String),
    values: S.optional(
      S.suspend(() => UserTurnSlotOutputList).annotations({
        identifier: "UserTurnSlotOutputList",
      }),
    ),
    subSlots: S.optional(
      S.suspend(() => UserTurnSlotOutputMap).annotations({
        identifier: "UserTurnSlotOutputMap",
      }),
    ),
  }),
).annotations({
  identifier: "UserTurnSlotOutput",
}) as any as S.Schema<UserTurnSlotOutput>;
export type TestResultMatchStatusCountMap = {
  [key in TestResultMatchStatus]?: number;
};
export const TestResultMatchStatusCountMap = S.partial(
  S.Record({ key: TestResultMatchStatus, value: S.Number }),
);
export interface ConversationLevelIntentClassificationResultItem {
  intentName: string;
  matchResult: TestResultMatchStatus;
}
export const ConversationLevelIntentClassificationResultItem = S.suspend(() =>
  S.Struct({ intentName: S.String, matchResult: TestResultMatchStatus }),
).annotations({
  identifier: "ConversationLevelIntentClassificationResultItem",
}) as any as S.Schema<ConversationLevelIntentClassificationResultItem>;
export type ConversationLevelIntentClassificationResults =
  ConversationLevelIntentClassificationResultItem[];
export const ConversationLevelIntentClassificationResults = S.Array(
  ConversationLevelIntentClassificationResultItem,
);
export interface ConversationLevelSlotResolutionResultItem {
  intentName: string;
  slotName: string;
  matchResult: TestResultMatchStatus;
}
export const ConversationLevelSlotResolutionResultItem = S.suspend(() =>
  S.Struct({
    intentName: S.String,
    slotName: S.String,
    matchResult: TestResultMatchStatus,
  }),
).annotations({
  identifier: "ConversationLevelSlotResolutionResultItem",
}) as any as S.Schema<ConversationLevelSlotResolutionResultItem>;
export type ConversationLevelSlotResolutionResults =
  ConversationLevelSlotResolutionResultItem[];
export const ConversationLevelSlotResolutionResults = S.Array(
  ConversationLevelSlotResolutionResultItem,
);
export interface IntentClassificationTestResultItemCounts {
  totalResultCount: number;
  speechTranscriptionResultCounts?: { [key: string]: number };
  intentMatchResultCounts: { [key: string]: number };
}
export const IntentClassificationTestResultItemCounts = S.suspend(() =>
  S.Struct({
    totalResultCount: S.Number,
    speechTranscriptionResultCounts: S.optional(TestResultMatchStatusCountMap),
    intentMatchResultCounts: TestResultMatchStatusCountMap,
  }),
).annotations({
  identifier: "IntentClassificationTestResultItemCounts",
}) as any as S.Schema<IntentClassificationTestResultItemCounts>;
export type UserTurnSlotOutputMap = { [key: string]: UserTurnSlotOutput };
export const UserTurnSlotOutputMap = S.Record({
  key: S.String,
  value: S.suspend(
    (): S.Schema<UserTurnSlotOutput, any> => UserTurnSlotOutput,
  ).annotations({ identifier: "UserTurnSlotOutput" }),
}) as any as S.Schema<UserTurnSlotOutputMap>;
export interface OverallTestResultItem {
  multiTurnConversation: boolean;
  totalResultCount: number;
  speechTranscriptionResultCounts?: { [key: string]: number };
  endToEndResultCounts: { [key: string]: number };
}
export const OverallTestResultItem = S.suspend(() =>
  S.Struct({
    multiTurnConversation: S.Boolean,
    totalResultCount: S.Number,
    speechTranscriptionResultCounts: S.optional(TestResultMatchStatusCountMap),
    endToEndResultCounts: TestResultMatchStatusCountMap,
  }),
).annotations({
  identifier: "OverallTestResultItem",
}) as any as S.Schema<OverallTestResultItem>;
export type OverallTestResultItemList = OverallTestResultItem[];
export const OverallTestResultItemList = S.Array(OverallTestResultItem);
export interface ConversationLevelTestResultItem {
  conversationId: string;
  endToEndResult: TestResultMatchStatus;
  speechTranscriptionResult?: TestResultMatchStatus;
  intentClassificationResults: ConversationLevelIntentClassificationResultItem[];
  slotResolutionResults: ConversationLevelSlotResolutionResultItem[];
}
export const ConversationLevelTestResultItem = S.suspend(() =>
  S.Struct({
    conversationId: S.String,
    endToEndResult: TestResultMatchStatus,
    speechTranscriptionResult: S.optional(TestResultMatchStatus),
    intentClassificationResults: ConversationLevelIntentClassificationResults,
    slotResolutionResults: ConversationLevelSlotResolutionResults,
  }),
).annotations({
  identifier: "ConversationLevelTestResultItem",
}) as any as S.Schema<ConversationLevelTestResultItem>;
export type ConversationLevelTestResultItemList =
  ConversationLevelTestResultItem[];
export const ConversationLevelTestResultItemList = S.Array(
  ConversationLevelTestResultItem,
);
export interface IntentClassificationTestResultItem {
  intentName: string;
  multiTurnConversation: boolean;
  resultCounts: IntentClassificationTestResultItemCounts;
}
export const IntentClassificationTestResultItem = S.suspend(() =>
  S.Struct({
    intentName: S.String,
    multiTurnConversation: S.Boolean,
    resultCounts: IntentClassificationTestResultItemCounts,
  }),
).annotations({
  identifier: "IntentClassificationTestResultItem",
}) as any as S.Schema<IntentClassificationTestResultItem>;
export type IntentClassificationTestResultItemList =
  IntentClassificationTestResultItem[];
export const IntentClassificationTestResultItemList = S.Array(
  IntentClassificationTestResultItem,
);
export interface CreateIntentRequest {
  intentName: string;
  intentDisplayName?: string;
  description?: string;
  parentIntentSignature?: string;
  sampleUtterances?: SampleUtterance[];
  dialogCodeHook?: DialogCodeHookSettings;
  fulfillmentCodeHook?: FulfillmentCodeHookSettings;
  intentConfirmationSetting?: IntentConfirmationSetting;
  intentClosingSetting?: IntentClosingSetting;
  inputContexts?: InputContext[];
  outputContexts?: OutputContext[];
  kendraConfiguration?: KendraConfiguration;
  botId: string;
  botVersion: string;
  localeId: string;
  initialResponseSetting?: InitialResponseSetting;
  qnAIntentConfiguration?: QnAIntentConfiguration;
  qInConnectIntentConfiguration?: QInConnectIntentConfiguration;
}
export const CreateIntentRequest = S.suspend(() =>
  S.Struct({
    intentName: S.String,
    intentDisplayName: S.optional(S.String),
    description: S.optional(S.String),
    parentIntentSignature: S.optional(S.String),
    sampleUtterances: S.optional(SampleUtterancesList),
    dialogCodeHook: S.optional(DialogCodeHookSettings),
    fulfillmentCodeHook: S.optional(FulfillmentCodeHookSettings),
    intentConfirmationSetting: S.optional(IntentConfirmationSetting),
    intentClosingSetting: S.optional(IntentClosingSetting),
    inputContexts: S.optional(InputContextsList),
    outputContexts: S.optional(OutputContextsList),
    kendraConfiguration: S.optional(KendraConfiguration),
    botId: S.String.pipe(T.HttpLabel("botId")),
    botVersion: S.String.pipe(T.HttpLabel("botVersion")),
    localeId: S.String.pipe(T.HttpLabel("localeId")),
    initialResponseSetting: S.optional(InitialResponseSetting),
    qnAIntentConfiguration: S.optional(QnAIntentConfiguration),
    qInConnectIntentConfiguration: S.optional(QInConnectIntentConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/intents",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateIntentRequest",
}) as any as S.Schema<CreateIntentRequest>;
export interface SlotResolutionTestResultItemCounts {
  totalResultCount: number;
  speechTranscriptionResultCounts?: { [key: string]: number };
  slotMatchResultCounts: { [key: string]: number };
}
export const SlotResolutionTestResultItemCounts = S.suspend(() =>
  S.Struct({
    totalResultCount: S.Number,
    speechTranscriptionResultCounts: S.optional(TestResultMatchStatusCountMap),
    slotMatchResultCounts: TestResultMatchStatusCountMap,
  }),
).annotations({
  identifier: "SlotResolutionTestResultItemCounts",
}) as any as S.Schema<SlotResolutionTestResultItemCounts>;
export interface UserTurnIntentOutput {
  name: string;
  slots?: { [key: string]: UserTurnSlotOutput };
}
export const UserTurnIntentOutput = S.suspend(() =>
  S.Struct({ name: S.String, slots: S.optional(UserTurnSlotOutputMap) }),
).annotations({
  identifier: "UserTurnIntentOutput",
}) as any as S.Schema<UserTurnIntentOutput>;
export interface StartBotRecommendationResponse {
  botId?: string;
  botVersion?: string;
  localeId?: string;
  botRecommendationStatus?: BotRecommendationStatus;
  botRecommendationId?: string;
  creationDateTime?: Date;
  transcriptSourceSetting?: TranscriptSourceSetting;
  encryptionSetting?: EncryptionSetting;
}
export const StartBotRecommendationResponse = S.suspend(() =>
  S.Struct({
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    botRecommendationStatus: S.optional(BotRecommendationStatus),
    botRecommendationId: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    transcriptSourceSetting: S.optional(TranscriptSourceSetting),
    encryptionSetting: S.optional(EncryptionSetting),
  }),
).annotations({
  identifier: "StartBotRecommendationResponse",
}) as any as S.Schema<StartBotRecommendationResponse>;
export interface OverallTestResults {
  items: OverallTestResultItem[];
}
export const OverallTestResults = S.suspend(() =>
  S.Struct({ items: OverallTestResultItemList }),
).annotations({
  identifier: "OverallTestResults",
}) as any as S.Schema<OverallTestResults>;
export interface ConversationLevelTestResults {
  items: ConversationLevelTestResultItem[];
}
export const ConversationLevelTestResults = S.suspend(() =>
  S.Struct({ items: ConversationLevelTestResultItemList }),
).annotations({
  identifier: "ConversationLevelTestResults",
}) as any as S.Schema<ConversationLevelTestResults>;
export interface IntentClassificationTestResults {
  items: IntentClassificationTestResultItem[];
}
export const IntentClassificationTestResults = S.suspend(() =>
  S.Struct({ items: IntentClassificationTestResultItemList }),
).annotations({
  identifier: "IntentClassificationTestResults",
}) as any as S.Schema<IntentClassificationTestResults>;
export interface SlotResolutionTestResultItem {
  slotName: string;
  resultCounts: SlotResolutionTestResultItemCounts;
}
export const SlotResolutionTestResultItem = S.suspend(() =>
  S.Struct({
    slotName: S.String,
    resultCounts: SlotResolutionTestResultItemCounts,
  }),
).annotations({
  identifier: "SlotResolutionTestResultItem",
}) as any as S.Schema<SlotResolutionTestResultItem>;
export type SlotResolutionTestResultItems = SlotResolutionTestResultItem[];
export const SlotResolutionTestResultItems = S.Array(
  SlotResolutionTestResultItem,
);
export interface UserTurnOutputSpecification {
  intent: UserTurnIntentOutput;
  activeContexts?: ActiveContext[];
  transcript?: string;
}
export const UserTurnOutputSpecification = S.suspend(() =>
  S.Struct({
    intent: UserTurnIntentOutput,
    activeContexts: S.optional(ActiveContextList),
    transcript: S.optional(S.String),
  }),
).annotations({
  identifier: "UserTurnOutputSpecification",
}) as any as S.Schema<UserTurnOutputSpecification>;
export interface ExecutionErrorDetails {
  errorCode: string;
  errorMessage: string;
}
export const ExecutionErrorDetails = S.suspend(() =>
  S.Struct({ errorCode: S.String, errorMessage: S.String }),
).annotations({
  identifier: "ExecutionErrorDetails",
}) as any as S.Schema<ExecutionErrorDetails>;
export interface ConversationLevelResultDetail {
  endToEndResult: TestResultMatchStatus;
  speechTranscriptionResult?: TestResultMatchStatus;
}
export const ConversationLevelResultDetail = S.suspend(() =>
  S.Struct({
    endToEndResult: TestResultMatchStatus,
    speechTranscriptionResult: S.optional(TestResultMatchStatus),
  }),
).annotations({
  identifier: "ConversationLevelResultDetail",
}) as any as S.Schema<ConversationLevelResultDetail>;
export interface IntentLevelSlotResolutionTestResultItem {
  intentName: string;
  multiTurnConversation: boolean;
  slotResolutionResults: SlotResolutionTestResultItem[];
}
export const IntentLevelSlotResolutionTestResultItem = S.suspend(() =>
  S.Struct({
    intentName: S.String,
    multiTurnConversation: S.Boolean,
    slotResolutionResults: SlotResolutionTestResultItems,
  }),
).annotations({
  identifier: "IntentLevelSlotResolutionTestResultItem",
}) as any as S.Schema<IntentLevelSlotResolutionTestResultItem>;
export type IntentLevelSlotResolutionTestResultItemList =
  IntentLevelSlotResolutionTestResultItem[];
export const IntentLevelSlotResolutionTestResultItemList = S.Array(
  IntentLevelSlotResolutionTestResultItem,
);
export interface CreateIntentResponse {
  intentId?: string;
  intentName?: string;
  intentDisplayName?: string;
  description?: string;
  parentIntentSignature?: string;
  sampleUtterances?: SampleUtterance[];
  dialogCodeHook?: DialogCodeHookSettings;
  fulfillmentCodeHook?: FulfillmentCodeHookSettings;
  intentConfirmationSetting?: IntentConfirmationSetting;
  intentClosingSetting?: IntentClosingSetting;
  inputContexts?: InputContext[];
  outputContexts?: OutputContext[];
  kendraConfiguration?: KendraConfiguration;
  botId?: string;
  botVersion?: string;
  localeId?: string;
  creationDateTime?: Date;
  initialResponseSetting?: InitialResponseSetting;
  qnAIntentConfiguration?: QnAIntentConfiguration;
  qInConnectIntentConfiguration?: QInConnectIntentConfiguration;
}
export const CreateIntentResponse = S.suspend(() =>
  S.Struct({
    intentId: S.optional(S.String),
    intentName: S.optional(S.String),
    intentDisplayName: S.optional(S.String),
    description: S.optional(S.String),
    parentIntentSignature: S.optional(S.String),
    sampleUtterances: S.optional(SampleUtterancesList),
    dialogCodeHook: S.optional(DialogCodeHookSettings),
    fulfillmentCodeHook: S.optional(FulfillmentCodeHookSettings),
    intentConfirmationSetting: S.optional(IntentConfirmationSetting),
    intentClosingSetting: S.optional(IntentClosingSetting),
    inputContexts: S.optional(InputContextsList),
    outputContexts: S.optional(OutputContextsList),
    kendraConfiguration: S.optional(KendraConfiguration),
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    initialResponseSetting: S.optional(InitialResponseSetting),
    qnAIntentConfiguration: S.optional(QnAIntentConfiguration),
    qInConnectIntentConfiguration: S.optional(QInConnectIntentConfiguration),
  }),
).annotations({
  identifier: "CreateIntentResponse",
}) as any as S.Schema<CreateIntentResponse>;
export interface AgentTurnResult {
  expectedAgentPrompt: string;
  actualAgentPrompt?: string;
  errorDetails?: ExecutionErrorDetails;
  actualElicitedSlot?: string;
  actualIntent?: string;
}
export const AgentTurnResult = S.suspend(() =>
  S.Struct({
    expectedAgentPrompt: S.String,
    actualAgentPrompt: S.optional(S.String),
    errorDetails: S.optional(ExecutionErrorDetails),
    actualElicitedSlot: S.optional(S.String),
    actualIntent: S.optional(S.String),
  }),
).annotations({
  identifier: "AgentTurnResult",
}) as any as S.Schema<AgentTurnResult>;
export type SlotHintsSlotMap = { [key: string]: RuntimeHintDetails };
export const SlotHintsSlotMap = S.Record({
  key: S.String,
  value: S.suspend(
    (): S.Schema<RuntimeHintDetails, any> => RuntimeHintDetails,
  ).annotations({ identifier: "RuntimeHintDetails" }),
}) as any as S.Schema<SlotHintsSlotMap>;
export type SlotHintsIntentMap = {
  [key: string]: { [key: string]: RuntimeHintDetails };
};
export const SlotHintsIntentMap = S.Record({
  key: S.String,
  value: S.suspend(() => SlotHintsSlotMap).annotations({
    identifier: "SlotHintsSlotMap",
  }),
});
export interface RuntimeHints {
  slotHints?: { [key: string]: { [key: string]: RuntimeHintDetails } };
}
export const RuntimeHints = S.suspend(() =>
  S.Struct({ slotHints: S.optional(SlotHintsIntentMap) }),
).annotations({ identifier: "RuntimeHints" }) as any as S.Schema<RuntimeHints>;
export interface InputSessionStateSpecification {
  sessionAttributes?: { [key: string]: string };
  activeContexts?: ActiveContext[];
  runtimeHints?: RuntimeHints;
}
export const InputSessionStateSpecification = S.suspend(() =>
  S.Struct({
    sessionAttributes: S.optional(StringMap),
    activeContexts: S.optional(ActiveContextList),
    runtimeHints: S.optional(RuntimeHints),
  }),
).annotations({
  identifier: "InputSessionStateSpecification",
}) as any as S.Schema<InputSessionStateSpecification>;
export interface UserTurnInputSpecification {
  utteranceInput: UtteranceInputSpecification;
  requestAttributes?: { [key: string]: string };
  sessionState?: InputSessionStateSpecification;
}
export const UserTurnInputSpecification = S.suspend(() =>
  S.Struct({
    utteranceInput: UtteranceInputSpecification,
    requestAttributes: S.optional(StringMap),
    sessionState: S.optional(InputSessionStateSpecification),
  }),
).annotations({
  identifier: "UserTurnInputSpecification",
}) as any as S.Schema<UserTurnInputSpecification>;
export interface UserTurnResult {
  input: UserTurnInputSpecification;
  expectedOutput: UserTurnOutputSpecification;
  actualOutput?: UserTurnOutputSpecification;
  errorDetails?: ExecutionErrorDetails;
  endToEndResult?: TestResultMatchStatus;
  intentMatchResult?: TestResultMatchStatus;
  slotMatchResult?: TestResultMatchStatus;
  speechTranscriptionResult?: TestResultMatchStatus;
  conversationLevelResult?: ConversationLevelResultDetail;
}
export const UserTurnResult = S.suspend(() =>
  S.Struct({
    input: UserTurnInputSpecification,
    expectedOutput: UserTurnOutputSpecification,
    actualOutput: S.optional(UserTurnOutputSpecification),
    errorDetails: S.optional(ExecutionErrorDetails),
    endToEndResult: S.optional(TestResultMatchStatus),
    intentMatchResult: S.optional(TestResultMatchStatus),
    slotMatchResult: S.optional(TestResultMatchStatus),
    speechTranscriptionResult: S.optional(TestResultMatchStatus),
    conversationLevelResult: S.optional(ConversationLevelResultDetail),
  }),
).annotations({
  identifier: "UserTurnResult",
}) as any as S.Schema<UserTurnResult>;
export interface RuntimeHintValue {
  phrase: string;
}
export const RuntimeHintValue = S.suspend(() =>
  S.Struct({ phrase: S.String }),
).annotations({
  identifier: "RuntimeHintValue",
}) as any as S.Schema<RuntimeHintValue>;
export type RuntimeHintValuesList = RuntimeHintValue[];
export const RuntimeHintValuesList = S.Array(RuntimeHintValue);
export interface IntentLevelSlotResolutionTestResults {
  items: IntentLevelSlotResolutionTestResultItem[];
}
export const IntentLevelSlotResolutionTestResults = S.suspend(() =>
  S.Struct({ items: IntentLevelSlotResolutionTestResultItemList }),
).annotations({
  identifier: "IntentLevelSlotResolutionTestResults",
}) as any as S.Schema<IntentLevelSlotResolutionTestResults>;
export interface TestSetTurnResult {
  agent?: AgentTurnResult;
  user?: UserTurnResult;
}
export const TestSetTurnResult = S.suspend(() =>
  S.Struct({
    agent: S.optional(AgentTurnResult),
    user: S.optional(UserTurnResult),
  }),
).annotations({
  identifier: "TestSetTurnResult",
}) as any as S.Schema<TestSetTurnResult>;
export interface RuntimeHintDetails {
  runtimeHintValues?: RuntimeHintValue[];
  subSlotHints?: { [key: string]: RuntimeHintDetails };
}
export const RuntimeHintDetails = S.suspend(() =>
  S.Struct({
    runtimeHintValues: S.optional(RuntimeHintValuesList),
    subSlotHints: S.optional(
      S.suspend(() => SlotHintsSlotMap).annotations({
        identifier: "SlotHintsSlotMap",
      }),
    ),
  }),
).annotations({
  identifier: "RuntimeHintDetails",
}) as any as S.Schema<RuntimeHintDetails>;
export interface UtteranceLevelTestResultItem {
  recordNumber: number;
  conversationId?: string;
  turnResult: TestSetTurnResult;
}
export const UtteranceLevelTestResultItem = S.suspend(() =>
  S.Struct({
    recordNumber: S.Number,
    conversationId: S.optional(S.String),
    turnResult: TestSetTurnResult,
  }),
).annotations({
  identifier: "UtteranceLevelTestResultItem",
}) as any as S.Schema<UtteranceLevelTestResultItem>;
export type UtteranceLevelTestResultItemList = UtteranceLevelTestResultItem[];
export const UtteranceLevelTestResultItemList = S.Array(
  UtteranceLevelTestResultItem,
);
export interface UtteranceLevelTestResults {
  items: UtteranceLevelTestResultItem[];
}
export const UtteranceLevelTestResults = S.suspend(() =>
  S.Struct({ items: UtteranceLevelTestResultItemList }),
).annotations({
  identifier: "UtteranceLevelTestResults",
}) as any as S.Schema<UtteranceLevelTestResults>;
export interface TestExecutionResultItems {
  overallTestResults?: OverallTestResults;
  conversationLevelTestResults?: ConversationLevelTestResults;
  intentClassificationTestResults?: IntentClassificationTestResults;
  intentLevelSlotResolutionTestResults?: IntentLevelSlotResolutionTestResults;
  utteranceLevelTestResults?: UtteranceLevelTestResults;
}
export const TestExecutionResultItems = S.suspend(() =>
  S.Struct({
    overallTestResults: S.optional(OverallTestResults),
    conversationLevelTestResults: S.optional(ConversationLevelTestResults),
    intentClassificationTestResults: S.optional(
      IntentClassificationTestResults,
    ),
    intentLevelSlotResolutionTestResults: S.optional(
      IntentLevelSlotResolutionTestResults,
    ),
    utteranceLevelTestResults: S.optional(UtteranceLevelTestResults),
  }),
).annotations({
  identifier: "TestExecutionResultItems",
}) as any as S.Schema<TestExecutionResultItems>;
export interface ListTestExecutionResultItemsResponse {
  testExecutionResults?: TestExecutionResultItems;
  nextToken?: string;
}
export const ListTestExecutionResultItemsResponse = S.suspend(() =>
  S.Struct({
    testExecutionResults: S.optional(TestExecutionResultItems),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTestExecutionResultItemsResponse",
}) as any as S.Schema<ListTestExecutionResultItemsResponse>;
export interface UserTurnSpecification {
  input: UserTurnInputSpecification;
  expected: UserTurnOutputSpecification;
}
export const UserTurnSpecification = S.suspend(() =>
  S.Struct({
    input: UserTurnInputSpecification,
    expected: UserTurnOutputSpecification,
  }),
).annotations({
  identifier: "UserTurnSpecification",
}) as any as S.Schema<UserTurnSpecification>;
export interface TurnSpecification {
  agentTurn?: AgentTurnSpecification;
  userTurn?: UserTurnSpecification;
}
export const TurnSpecification = S.suspend(() =>
  S.Struct({
    agentTurn: S.optional(AgentTurnSpecification),
    userTurn: S.optional(UserTurnSpecification),
  }),
).annotations({
  identifier: "TurnSpecification",
}) as any as S.Schema<TurnSpecification>;
export interface TestSetTurnRecord {
  recordNumber: number;
  conversationId?: string;
  turnNumber?: number;
  turnSpecification: TurnSpecification;
}
export const TestSetTurnRecord = S.suspend(() =>
  S.Struct({
    recordNumber: S.Number,
    conversationId: S.optional(S.String),
    turnNumber: S.optional(S.Number),
    turnSpecification: TurnSpecification,
  }),
).annotations({
  identifier: "TestSetTurnRecord",
}) as any as S.Schema<TestSetTurnRecord>;
export type TestSetTurnRecordList = TestSetTurnRecord[];
export const TestSetTurnRecordList = S.Array(TestSetTurnRecord);
export interface ListTestSetRecordsResponse {
  testSetRecords?: TestSetTurnRecord[];
  nextToken?: string;
}
export const ListTestSetRecordsResponse = S.suspend(() =>
  S.Struct({
    testSetRecords: S.optional(TestSetTurnRecordList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTestSetRecordsResponse",
}) as any as S.Schema<ListTestSetRecordsResponse>;

//# Errors
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
    message: S.optional(S.String),
  },
).pipe(C.withThrottlingError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class PreconditionFailedException extends S.TaggedError<PreconditionFailedException>()(
  "PreconditionFailedException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Gets the resource policy and policy revision for a bot or bot
 * alias.
 */
export const describeResourcePolicy: (
  input: DescribeResourcePolicyRequest,
) => effect.Effect<
  DescribeResourcePolicyResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeResourcePolicyRequest,
  output: DescribeResourcePolicyResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Removes an existing policy from a bot or bot alias. If the resource
 * doesn't have a policy attached, Amazon Lex returns an exception.
 */
export const deleteResourcePolicy: (
  input: DeleteResourcePolicyRequest,
) => effect.Effect<
  DeleteResourcePolicyResponse,
  | InternalServerException
  | PreconditionFailedException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourcePolicyRequest,
  output: DeleteResourcePolicyResponse,
  errors: [
    InternalServerException,
    PreconditionFailedException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a policy statement from a resource policy. If you delete the
 * last statement from a policy, the policy is deleted. If you specify a
 * statement ID that doesn't exist in the policy, or if the bot or bot
 * alias doesn't have a policy attached, Amazon Lex returns an
 * exception.
 *
 * You need to add the `DeleteResourcePolicy` or `UpdateResourcePolicy`
 * action to the bot role in order to call the API.
 */
export const deleteResourcePolicyStatement: (
  input: DeleteResourcePolicyStatementRequest,
) => effect.Effect<
  DeleteResourcePolicyStatementResponse,
  | InternalServerException
  | PreconditionFailedException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourcePolicyStatementRequest,
  output: DeleteResourcePolicyStatementResponse,
  errors: [
    InternalServerException,
    PreconditionFailedException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes stored utterances.
 *
 * Amazon Lex stores the utterances that users send to your bot. Utterances
 * are stored for 15 days for use with the ListAggregatedUtterances operation, and
 * then stored indefinitely for use in improving the ability of your bot
 * to respond to user input..
 *
 * Use the `DeleteUtterances` operation to manually delete
 * utterances for a specific session. When you use the
 * `DeleteUtterances` operation, utterances stored for
 * improving your bot's ability to respond to user input are deleted
 * immediately. Utterances stored for use with the
 * `ListAggregatedUtterances` operation are deleted after 15
 * days.
 */
export const deleteUtterances: (
  input: DeleteUtterancesRequest,
) => effect.Effect<
  DeleteUtterancesResponse,
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUtterancesRequest,
  output: DeleteUtterancesResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
}));
/**
 * Provides metadata information about a bot.
 */
export const describeBot: (
  input: DescribeBotRequest,
) => effect.Effect<
  DescribeBotResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBotRequest,
  output: DescribeBotResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets metadata information about the test set discrepancy report.
 */
export const describeTestSetDiscrepancyReport: (
  input: DescribeTestSetDiscrepancyReportRequest,
) => effect.Effect<
  DescribeTestSetDiscrepancyReportResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTestSetDiscrepancyReportRequest,
  output: DescribeTestSetDiscrepancyReportResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a list of locales for the specified bot.
 */
export const listBotLocales: {
  (
    input: ListBotLocalesRequest,
  ): effect.Effect<
    ListBotLocalesResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBotLocalesRequest,
  ) => stream.Stream<
    ListBotLocalesResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBotLocalesRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBotLocalesRequest,
  output: ListBotLocalesResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the generation requests made for a bot locale.
 */
export const listBotResourceGenerations: {
  (
    input: ListBotResourceGenerationsRequest,
  ): effect.Effect<
    ListBotResourceGenerationsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBotResourceGenerationsRequest,
  ) => stream.Stream<
    ListBotResourceGenerationsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBotResourceGenerationsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBotResourceGenerationsRequest,
  output: ListBotResourceGenerationsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets a list of available bots.
 */
export const listBots: {
  (
    input: ListBotsRequest,
  ): effect.Effect<
    ListBotsResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBotsRequest,
  ) => stream.Stream<
    ListBotsResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBotsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBotsRequest,
  output: ListBotsResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Contains information about all the versions replication statuses applicable for Global Resiliency.
 */
export const listBotVersionReplicas: {
  (
    input: ListBotVersionReplicasRequest,
  ): effect.Effect<
    ListBotVersionReplicasResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBotVersionReplicasRequest,
  ) => stream.Stream<
    ListBotVersionReplicasResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBotVersionReplicasRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBotVersionReplicasRequest,
  output: ListBotVersionReplicasResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets information about all of the versions of a bot.
 *
 * The `ListBotVersions` operation returns a summary of each
 * version of a bot. For example, if a bot has three numbered versions,
 * the `ListBotVersions` operation returns for summaries, one
 * for each numbered version and one for the `DRAFT`
 * version.
 *
 * The `ListBotVersions` operation always returns at least
 * one version, the `DRAFT` version.
 */
export const listBotVersions: {
  (
    input: ListBotVersionsRequest,
  ): effect.Effect<
    ListBotVersionsResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBotVersionsRequest,
  ) => stream.Stream<
    ListBotVersionsResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBotVersionsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBotVersionsRequest,
  output: ListBotVersionsResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets a list of built-in intents provided by Amazon Lex that you can use
 * in your bot.
 *
 * To use a built-in intent as a the base for your own intent, include
 * the built-in intent signature in the `parentIntentSignature`
 * parameter when you call the `CreateIntent` operation. For
 * more information, see CreateIntent.
 */
export const listBuiltInIntents: {
  (
    input: ListBuiltInIntentsRequest,
  ): effect.Effect<
    ListBuiltInIntentsResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBuiltInIntentsRequest,
  ) => stream.Stream<
    ListBuiltInIntentsResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBuiltInIntentsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBuiltInIntentsRequest,
  output: ListBuiltInIntentsResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets a list of built-in slot types that meet the specified
 * criteria.
 */
export const listBuiltInSlotTypes: {
  (
    input: ListBuiltInSlotTypesRequest,
  ): effect.Effect<
    ListBuiltInSlotTypesResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBuiltInSlotTypesRequest,
  ) => stream.Stream<
    ListBuiltInSlotTypesResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBuiltInSlotTypesRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBuiltInSlotTypesRequest,
  output: ListBuiltInSlotTypesResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the exports for a bot, bot locale, or custom vocabulary.
 * Exports are kept in the list for 7 days.
 */
export const listExports: {
  (
    input: ListExportsRequest,
  ): effect.Effect<
    ListExportsResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListExportsRequest,
  ) => stream.Stream<
    ListExportsResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListExportsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListExportsRequest,
  output: ListExportsResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the imports for a bot, bot locale, or custom vocabulary.
 * Imports are kept in the list for 7 days.
 */
export const listImports: {
  (
    input: ListImportsRequest,
  ): effect.Effect<
    ListImportsResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListImportsRequest,
  ) => stream.Stream<
    ListImportsResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListImportsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListImportsRequest,
  output: ListImportsResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves summary statistics for a path of intents that users take over sessions with your bot. The following fields are required:
 *
 * - `startDateTime` and `endDateTime` – Define a time range for which you want to retrieve results.
 *
 * - `intentPath` – Define an order of intents for which you want to retrieve metrics. Separate intents in the path with a forward slash. For example, populate the `intentPath` field with `/BookCar/BookHotel` to see details about how many times users invoked the `BookCar` and `BookHotel` intents in that order.
 *
 * Use the optional `filters` field to filter the results.
 */
export const listIntentPaths: (
  input: ListIntentPathsRequest,
) => effect.Effect<
  ListIntentPathsResponse,
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListIntentPathsRequest,
  output: ListIntentPathsResponse,
  errors: [
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get a list of intents that meet the specified criteria.
 */
export const listIntents: {
  (
    input: ListIntentsRequest,
  ): effect.Effect<
    ListIntentsResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIntentsRequest,
  ) => stream.Stream<
    ListIntentsResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIntentsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIntentsRequest,
  output: ListIntentsResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets a list of slots that match the specified criteria.
 */
export const listSlots: {
  (
    input: ListSlotsRequest,
  ): effect.Effect<
    ListSlotsResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSlotsRequest,
  ) => stream.Stream<
    ListSlotsResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSlotsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSlotsRequest,
  output: ListSlotsResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets a list of slot types that match the specified criteria.
 */
export const listSlotTypes: {
  (
    input: ListSlotTypesRequest,
  ): effect.Effect<
    ListSlotTypesResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSlotTypesRequest,
  ) => stream.Stream<
    ListSlotTypesResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSlotTypesRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSlotTypesRequest,
  output: ListSlotTypesResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * The list of test set executions.
 */
export const listTestExecutions: {
  (
    input: ListTestExecutionsRequest,
  ): effect.Effect<
    ListTestExecutionsResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTestExecutionsRequest,
  ) => stream.Stream<
    ListTestExecutionsResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTestExecutionsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTestExecutionsRequest,
  output: ListTestExecutionsResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * The list of the test sets
 */
export const listTestSets: {
  (
    input: ListTestSetsRequest,
  ): effect.Effect<
    ListTestSetsResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTestSetsRequest,
  ) => stream.Stream<
    ListTestSetsResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTestSetsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTestSetsRequest,
  output: ListTestSetsResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Search for associated transcripts that meet the specified
 * criteria.
 */
export const searchAssociatedTranscripts: (
  input: SearchAssociatedTranscriptsRequest,
) => effect.Effect<
  SearchAssociatedTranscriptsResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchAssociatedTranscriptsRequest,
  output: SearchAssociatedTranscriptsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The action to start test set execution.
 */
export const startTestExecution: (
  input: StartTestExecutionRequest,
) => effect.Effect<
  StartTestExecutionResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartTestExecutionRequest,
  output: StartTestExecutionResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get a list of bot recommendations that meet the specified
 * criteria.
 */
export const listBotRecommendations: {
  (
    input: ListBotRecommendationsRequest,
  ): effect.Effect<
    ListBotRecommendationsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBotRecommendationsRequest,
  ) => stream.Stream<
    ListBotRecommendationsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBotRecommendationsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBotRecommendationsRequest,
  output: ListBotRecommendationsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns information about a request to generate a bot through natural language description, made through
 * the `StartBotResource` API. Use the `generatedBotLocaleUrl`
 * to retrieve the Amazon S3 object containing the bot locale configuration. You can
 * then modify and import this configuration.
 */
export const describeBotResourceGeneration: (
  input: DescribeBotResourceGenerationRequest,
) => effect.Effect<
  DescribeBotResourceGenerationResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBotResourceGenerationRequest,
  output: DescribeBotResourceGenerationResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a specific export.
 */
export const describeExport: (
  input: DescribeExportRequest,
) => effect.Effect<
  DescribeExportResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeExportRequest,
  output: DescribeExportResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a specific import.
 */
export const describeImport: (
  input: DescribeImportRequest,
) => effect.Effect<
  DescribeImportResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeImportRequest,
  output: DescribeImportResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a list of tags associated with a resource. Only bots, bot
 * aliases, and bot channels can have tags associated with them.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
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
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds the specified tags to the specified resource. If a tag key
 * already exists, the existing value is replaced with the new
 * value.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes tags from a bot, bot alias, or bot channel.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
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
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a pre-signed S3 write URL that you use to upload the zip
 * archive when importing a bot or a bot locale.
 */
export const createUploadUrl: (
  input: CreateUploadUrlRequest,
) => effect.Effect<
  CreateUploadUrlResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUploadUrlRequest,
  output: CreateUploadUrlResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get information about a specific bot alias.
 */
export const describeBotAlias: (
  input: DescribeBotAliasRequest,
) => effect.Effect<
  DescribeBotAliasResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBotAliasRequest,
  output: DescribeBotAliasResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Describes the settings that a bot has for a specific locale.
 */
export const describeBotLocale: (
  input: DescribeBotLocaleRequest,
) => effect.Effect<
  DescribeBotLocaleResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBotLocaleRequest,
  output: DescribeBotLocaleResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Generates sample utterances for an intent.
 */
export const generateBotElement: (
  input: GenerateBotElementRequest,
) => effect.Effect<
  GenerateBotElementResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateBotElementRequest,
  output: GenerateBotElementResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a list of aliases for the specified bot.
 */
export const listBotAliases: {
  (
    input: ListBotAliasesRequest,
  ): effect.Effect<
    ListBotAliasesResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBotAliasesRequest,
  ) => stream.Stream<
    ListBotAliasesResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBotAliasesRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBotAliasesRequest,
  output: ListBotAliasesResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * The action to list the replicated bots created from the source bot alias.
 */
export const listBotAliasReplicas: {
  (
    input: ListBotAliasReplicasRequest,
  ): effect.Effect<
    ListBotAliasReplicasResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBotAliasReplicasRequest,
  ) => stream.Stream<
    ListBotAliasReplicasResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBotAliasReplicasRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBotAliasReplicasRequest,
  output: ListBotAliasReplicasResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * The action to list the replicated bots.
 */
export const listBotReplicas: (
  input: ListBotReplicasRequest,
) => effect.Effect<
  ListBotReplicasResponse,
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListBotReplicasRequest,
  output: ListBotReplicasResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a list of recommended intents provided by the bot
 * recommendation that you can use in your bot. Intents in the
 * response are ordered by relevance.
 */
export const listRecommendedIntents: {
  (
    input: ListRecommendedIntentsRequest,
  ): effect.Effect<
    ListRecommendedIntentsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRecommendedIntentsRequest,
  ) => stream.Stream<
    ListRecommendedIntentsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRecommendedIntentsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRecommendedIntentsRequest,
  output: ListRecommendedIntentsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates the settings for an intent.
 */
export const updateIntent: (
  input: UpdateIntentRequest,
) => effect.Effect<
  UpdateIntentResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIntentRequest,
  output: UpdateIntentResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Monitors the bot replication status through the UI console.
 */
export const describeBotReplica: (
  input: DescribeBotReplicaRequest,
) => effect.Effect<
  DescribeBotReplicaResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBotReplicaRequest,
  output: DescribeBotReplicaResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Provides metadata about a version of a bot.
 */
export const describeBotVersion: (
  input: DescribeBotVersionRequest,
) => effect.Effect<
  DescribeBotVersionResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBotVersionRequest,
  output: DescribeBotVersionResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Provides metadata information about a custom vocabulary.
 */
export const describeCustomVocabularyMetadata: (
  input: DescribeCustomVocabularyMetadataRequest,
) => effect.Effect<
  DescribeCustomVocabularyMetadataResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCustomVocabularyMetadataRequest,
  output: DescribeCustomVocabularyMetadataResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns metadata about an intent.
 */
export const describeIntent: (
  input: DescribeIntentRequest,
) => effect.Effect<
  DescribeIntentResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeIntentRequest,
  output: DescribeIntentResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets metadata information about a slot.
 */
export const describeSlot: (
  input: DescribeSlotRequest,
) => effect.Effect<
  DescribeSlotResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSlotRequest,
  output: DescribeSlotResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets metadata information about a slot type.
 */
export const describeSlotType: (
  input: DescribeSlotTypeRequest,
) => effect.Effect<
  DescribeSlotTypeResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSlotTypeRequest,
  output: DescribeSlotTypeResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets metadata information about the test execution.
 */
export const describeTestExecution: (
  input: DescribeTestExecutionRequest,
) => effect.Effect<
  DescribeTestExecutionResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTestExecutionRequest,
  output: DescribeTestExecutionResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets metadata information about the test set.
 */
export const describeTestSet: (
  input: DescribeTestSetRequest,
) => effect.Effect<
  DescribeTestSetResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTestSetRequest,
  output: DescribeTestSetResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets metadata information about the test set generation.
 */
export const describeTestSetGeneration: (
  input: DescribeTestSetGenerationRequest,
) => effect.Effect<
  DescribeTestSetGenerationResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTestSetGenerationRequest,
  output: DescribeTestSetGenerationResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The pre-signed Amazon S3 URL to download the test execution result artifacts.
 */
export const getTestExecutionArtifactsUrl: (
  input: GetTestExecutionArtifactsUrlRequest,
) => effect.Effect<
  GetTestExecutionArtifactsUrlResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTestExecutionArtifactsUrlRequest,
  output: GetTestExecutionArtifactsUrlResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Paginated list of custom vocabulary items for a given bot locale's
 * custom vocabulary.
 */
export const listCustomVocabularyItems: {
  (
    input: ListCustomVocabularyItemsRequest,
  ): effect.Effect<
    ListCustomVocabularyItemsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCustomVocabularyItemsRequest,
  ) => stream.Stream<
    ListCustomVocabularyItemsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCustomVocabularyItemsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCustomVocabularyItemsRequest,
  output: ListCustomVocabularyItemsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates the password used to protect an export zip archive.
 *
 * The password is not required. If you don't supply a password, Amazon Lex
 * generates a zip file that is not protected by a password. This is the
 * archive that is available at the pre-signed S3 URL provided by the
 * DescribeExport operation.
 */
export const updateExport: (
  input: UpdateExportRequest,
) => effect.Effect<
  UpdateExportResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateExportRequest,
  output: UpdateExportResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Delete a batch of custom vocabulary items for a given bot locale's
 * custom vocabulary.
 */
export const batchDeleteCustomVocabularyItem: (
  input: BatchDeleteCustomVocabularyItemRequest,
) => effect.Effect<
  BatchDeleteCustomVocabularyItemResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteCustomVocabularyItemRequest,
  output: BatchDeleteCustomVocabularyItemResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update a batch of custom vocabulary items for a given bot locale's custom
 * vocabulary.
 */
export const batchUpdateCustomVocabularyItem: (
  input: BatchUpdateCustomVocabularyItemRequest,
) => effect.Effect<
  BatchUpdateCustomVocabularyItemResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchUpdateCustomVocabularyItemRequest,
  output: BatchUpdateCustomVocabularyItemResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts a request for the descriptive bot builder to generate a bot locale configuration
 * based on the prompt you provide it. After you make this call, use the `DescribeBotResourceGeneration`
 * operation to check on the status of the generation and for the `generatedBotLocaleUrl` when the
 * generation is complete. Use that value to retrieve the Amazon S3 object containing the bot locale configuration. You can
 * then modify and import this configuration.
 */
export const startBotResourceGeneration: (
  input: StartBotResourceGenerationRequest,
) => effect.Effect<
  StartBotResourceGenerationResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartBotResourceGenerationRequest,
  output: StartBotResourceGenerationResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Stop an already running Bot Recommendation request.
 */
export const stopBotRecommendation: (
  input: StopBotRecommendationRequest,
) => effect.Effect<
  StopBotRecommendationResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopBotRecommendationRequest,
  output: StopBotRecommendationResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration of an existing bot.
 */
export const updateBot: (
  input: UpdateBotRequest,
) => effect.Effect<
  UpdateBotResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBotRequest,
  output: UpdateBotResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration of an existing bot alias.
 */
export const updateBotAlias: (
  input: UpdateBotAliasRequest,
) => effect.Effect<
  UpdateBotAliasResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBotAliasRequest,
  output: UpdateBotAliasResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the settings that a bot has for a specific locale.
 */
export const updateBotLocale: (
  input: UpdateBotLocaleRequest,
) => effect.Effect<
  UpdateBotLocaleResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBotLocaleRequest,
  output: UpdateBotLocaleResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an existing bot recommendation request.
 */
export const updateBotRecommendation: (
  input: UpdateBotRecommendationRequest,
) => effect.Effect<
  UpdateBotRecommendationResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBotRecommendationRequest,
  output: UpdateBotRecommendationResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Replaces the existing resource policy for a bot or bot alias with a
 * new one. If the policy doesn't exist, Amazon Lex returns an
 * exception.
 */
export const updateResourcePolicy: (
  input: UpdateResourcePolicyRequest,
) => effect.Effect<
  UpdateResourcePolicyResponse,
  | InternalServerException
  | PreconditionFailedException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResourcePolicyRequest,
  output: UpdateResourcePolicyResponse,
  errors: [
    InternalServerException,
    PreconditionFailedException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the settings for a slot.
 */
export const updateSlot: (
  input: UpdateSlotRequest,
) => effect.Effect<
  UpdateSlotResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSlotRequest,
  output: UpdateSlotResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration of an existing slot type.
 */
export const updateSlotType: (
  input: UpdateSlotTypeRequest,
) => effect.Effect<
  UpdateSlotTypeResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSlotTypeRequest,
  output: UpdateSlotTypeResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The action to update the test set.
 */
export const updateTestSet: (
  input: UpdateTestSetRequest,
) => effect.Effect<
  UpdateTestSetResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTestSetRequest,
  output: UpdateTestSetResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes the specified intent.
 *
 * Deleting an intent also deletes the slots associated with the
 * intent.
 */
export const deleteIntent: (
  input: DeleteIntentRequest,
) => effect.Effect<
  DeleteIntentResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIntentRequest,
  output: DeleteIntentResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified slot from an intent.
 */
export const deleteSlot: (
  input: DeleteSlotRequest,
) => effect.Effect<
  DeleteSlotResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSlotRequest,
  output: DeleteSlotResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a slot type from a bot locale.
 *
 * If a slot is using the slot type, Amazon Lex throws a
 * `ResourceInUseException` exception. To avoid the
 * exception, set the `skipResourceInUseCheck` parameter to
 * `true`.
 */
export const deleteSlotType: (
  input: DeleteSlotTypeRequest,
) => effect.Effect<
  DeleteSlotTypeResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSlotTypeRequest,
  output: DeleteSlotTypeResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The action to delete the selected test set.
 */
export const deleteTestSet: (
  input: DeleteTestSetRequest,
) => effect.Effect<
  DeleteTestSetResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTestSetRequest,
  output: DeleteTestSetResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Builds a bot, its intents, and its slot types into a specific
 * locale. A bot can be built into multiple locales. At runtime the locale
 * is used to choose a specific build of the bot.
 */
export const buildBotLocale: (
  input: BuildBotLocaleRequest,
) => effect.Effect<
  BuildBotLocaleResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BuildBotLocaleRequest,
  output: BuildBotLocaleResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Action to create a replication of the source bot in the secondary region.
 */
export const createBotReplica: (
  input: CreateBotReplicaRequest,
) => effect.Effect<
  CreateBotReplicaResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBotReplicaRequest,
  output: CreateBotReplicaResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new resource policy with the specified policy
 * statements.
 */
export const createResourcePolicy: (
  input: CreateResourcePolicyRequest,
) => effect.Effect<
  CreateResourcePolicyResponse,
  | InternalServerException
  | PreconditionFailedException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateResourcePolicyRequest,
  output: CreateResourcePolicyResponse,
  errors: [
    InternalServerException,
    PreconditionFailedException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes all versions of a bot, including the `Draft`
 * version. To delete a specific version, use the
 * `DeleteBotVersion` operation.
 *
 * When you delete a bot, all of the resources contained in the bot are
 * also deleted. Deleting a bot removes all locales, intents, slot, and
 * slot types defined for the bot.
 *
 * If a bot has an alias, the `DeleteBot` operation returns
 * a `ResourceInUseException` exception. If you want to delete
 * the bot and the alias, set the `skipResourceInUseCheck`
 * parameter to `true`.
 */
export const deleteBot: (
  input: DeleteBotRequest,
) => effect.Effect<
  DeleteBotResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBotRequest,
  output: DeleteBotResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified bot alias.
 */
export const deleteBotAlias: (
  input: DeleteBotAliasRequest,
) => effect.Effect<
  DeleteBotAliasResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBotAliasRequest,
  output: DeleteBotAliasResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a locale from a bot.
 *
 * When you delete a locale, all intents, slots, and slot types defined
 * for the locale are also deleted.
 */
export const deleteBotLocale: (
  input: DeleteBotLocaleRequest,
) => effect.Effect<
  DeleteBotLocaleResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBotLocaleRequest,
  output: DeleteBotLocaleResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The action to delete the replicated bot in the secondary region.
 */
export const deleteBotReplica: (
  input: DeleteBotReplicaRequest,
) => effect.Effect<
  DeleteBotReplicaResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBotReplicaRequest,
  output: DeleteBotReplicaResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a specific version of a bot. To delete all versions of a bot,
 * use the DeleteBot operation.
 */
export const deleteBotVersion: (
  input: DeleteBotVersionRequest,
) => effect.Effect<
  DeleteBotVersionResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBotVersionRequest,
  output: DeleteBotVersionResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a custom vocabulary from the specified locale
 * in the specified bot.
 */
export const deleteCustomVocabulary: (
  input: DeleteCustomVocabularyRequest,
) => effect.Effect<
  DeleteCustomVocabularyResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCustomVocabularyRequest,
  output: DeleteCustomVocabularyResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a previous export and the associated files stored in an S3
 * bucket.
 */
export const deleteExport: (
  input: DeleteExportRequest,
) => effect.Effect<
  DeleteExportResponse,
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteExportRequest,
  output: DeleteExportResponse,
  errors: [
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a previous import and the associated file stored in an S3
 * bucket.
 */
export const deleteImport: (
  input: DeleteImportRequest,
) => effect.Effect<
  DeleteImportResponse,
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteImportRequest,
  output: DeleteImportResponse,
  errors: [
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon Lex conversational bot.
 */
export const createBot: (
  input: CreateBotRequest,
) => effect.Effect<
  CreateBotResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBotRequest,
  output: CreateBotResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Create a batch of custom vocabulary items for a given bot locale's
 * custom vocabulary.
 */
export const batchCreateCustomVocabularyItem: (
  input: BatchCreateCustomVocabularyItemRequest,
) => effect.Effect<
  BatchCreateCustomVocabularyItemResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchCreateCustomVocabularyItemRequest,
  output: BatchCreateCustomVocabularyItemResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an immutable version of the bot. When you create the first
 * version of a bot, Amazon Lex sets the version number to 1. Subsequent bot versions increase
 * in an increment of 1. The version number will always represent the total number
 * of versions created of the bot, not the current number of versions. If a bot version
 * is deleted, that bot version number will not be reused.
 */
export const createBotVersion: (
  input: CreateBotVersionRequest,
) => effect.Effect<
  CreateBotVersionResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBotVersionRequest,
  output: CreateBotVersionResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a zip archive containing the contents of a bot or a bot
 * locale. The archive contains a directory structure that contains JSON
 * files that define the bot.
 *
 * You can create an archive that contains the complete definition of a
 * bot, or you can specify that the archive contain only the definition of
 * a single bot locale.
 *
 * For more information about exporting bots, and about the structure
 * of the export archive, see Importing and
 * exporting bots
 */
export const createExport: (
  input: CreateExportRequest,
) => effect.Effect<
  CreateExportResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateExportRequest,
  output: CreateExportResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds a new resource policy statement to a bot or bot alias. If a
 * resource policy exists, the statement is added to the current resource
 * policy. If a policy doesn't exist, a new policy is created.
 *
 * You can't create a resource policy statement that allows
 * cross-account access.
 *
 * You need to add the `CreateResourcePolicy` or `UpdateResourcePolicy`
 * action to the bot role in order to call the API.
 */
export const createResourcePolicyStatement: (
  input: CreateResourcePolicyStatementRequest,
) => effect.Effect<
  CreateResourcePolicyStatementResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateResourcePolicyStatementRequest,
  output: CreateResourcePolicyStatementResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Create a report that describes the differences between the bot and the test set.
 */
export const createTestSetDiscrepancyReport: (
  input: CreateTestSetDiscrepancyReportRequest,
) => effect.Effect<
  CreateTestSetDiscrepancyReportResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTestSetDiscrepancyReportRequest,
  output: CreateTestSetDiscrepancyReportResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a custom slot type
 *
 * To create a custom slot type, specify a name for the slot type and
 * a set of enumeration values, the values that a slot of this type can
 * assume.
 */
export const createSlotType: (
  input: CreateSlotTypeRequest,
) => effect.Effect<
  CreateSlotTypeResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSlotTypeRequest,
  output: CreateSlotTypeResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Provides metadata information about a bot recommendation. This
 * information will enable you to get a description on the request inputs,
 * to download associated transcripts after processing is complete, and to
 * download intents and slot-types generated by the bot
 * recommendation.
 */
export const describeBotRecommendation: (
  input: DescribeBotRecommendationRequest,
) => effect.Effect<
  DescribeBotRecommendationResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBotRecommendationRequest,
  output: DescribeBotRecommendationResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Provides a list of utterances that users have sent to the
 * bot.
 *
 * Utterances are aggregated by the text of the utterance. For example,
 * all instances where customers used the phrase "I want to order pizza"
 * are aggregated into the same line in the response.
 *
 * You can see both detected utterances and missed utterances. A
 * detected utterance is where the bot properly recognized the utterance
 * and activated the associated intent. A missed utterance was not
 * recognized by the bot and didn't activate an intent.
 *
 * Utterances can be aggregated for a bot alias or for a bot version,
 * but not both at the same time.
 *
 * Utterances statistics are not generated under the following
 * conditions:
 *
 * - The `childDirected` field was set to true when the
 * bot was created.
 *
 * - You are using slot obfuscation with one or more slots.
 *
 * - You opted out of participating in improving Amazon Lex.
 */
export const listAggregatedUtterances: {
  (
    input: ListAggregatedUtterancesRequest,
  ): effect.Effect<
    ListAggregatedUtterancesResponse,
    | InternalServerException
    | PreconditionFailedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAggregatedUtterancesRequest,
  ) => stream.Stream<
    ListAggregatedUtterancesResponse,
    | InternalServerException
    | PreconditionFailedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAggregatedUtterancesRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | PreconditionFailedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAggregatedUtterancesRequest,
  output: ListAggregatedUtterancesResponse,
  errors: [
    InternalServerException,
    PreconditionFailedException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves summary metrics for the intents in your bot. The following fields are required:
 *
 * - `metrics` – A list of AnalyticsIntentMetric objects. In each object, use the `name` field to specify the metric to calculate, the `statistic` field to specify whether to calculate the `Sum`, `Average`, or `Max` number, and the `order` field to specify whether to sort the results in `Ascending` or `Descending` order.
 *
 * - `startDateTime` and `endDateTime` – Define a time range for which you want to retrieve results.
 *
 * Of the optional fields, you can organize the results in the following ways:
 *
 * - Use the `filters` field to filter the results, the `groupBy` field to specify categories by which to group the results, and the `binBy` field to specify time intervals by which to group the results.
 *
 * - Use the `maxResults` field to limit the number of results to return in a single response and the `nextToken` field to return the next batch of results if the response does not return the full set of results.
 *
 * Note that an `order` field exists in both `binBy` and `metrics`. You can specify only one `order` in a given request.
 */
export const listIntentMetrics: {
  (
    input: ListIntentMetricsRequest,
  ): effect.Effect<
    ListIntentMetricsResponse,
    | InternalServerException
    | PreconditionFailedException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIntentMetricsRequest,
  ) => stream.Stream<
    ListIntentMetricsResponse,
    | InternalServerException
    | PreconditionFailedException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIntentMetricsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | PreconditionFailedException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIntentMetricsRequest,
  output: ListIntentMetricsResponse,
  errors: [
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves summary metrics for the stages within intents in your bot. The following fields are required:
 *
 * - `metrics` – A list of AnalyticsIntentStageMetric objects. In each object, use the `name` field to specify the metric to calculate, the `statistic` field to specify whether to calculate the `Sum`, `Average`, or `Max` number, and the `order` field to specify whether to sort the results in `Ascending` or `Descending` order.
 *
 * - `startDateTime` and `endDateTime` – Define a time range for which you want to retrieve results.
 *
 * Of the optional fields, you can organize the results in the following ways:
 *
 * - Use the `filters` field to filter the results, the `groupBy` field to specify categories by which to group the results, and the `binBy` field to specify time intervals by which to group the results.
 *
 * - Use the `maxResults` field to limit the number of results to return in a single response and the `nextToken` field to return the next batch of results if the response does not return the full set of results.
 *
 * Note that an `order` field exists in both `binBy` and `metrics`. You can only specify one `order` in a given request.
 */
export const listIntentStageMetrics: {
  (
    input: ListIntentStageMetricsRequest,
  ): effect.Effect<
    ListIntentStageMetricsResponse,
    | InternalServerException
    | PreconditionFailedException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIntentStageMetricsRequest,
  ) => stream.Stream<
    ListIntentStageMetricsResponse,
    | InternalServerException
    | PreconditionFailedException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIntentStageMetricsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | PreconditionFailedException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIntentStageMetricsRequest,
  output: ListIntentStageMetricsResponse,
  errors: [
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a list of metadata for individual user sessions with your bot. The `startDateTime` and `endDateTime` fields are required. These fields define a time range for which you want to retrieve results. Of the optional fields, you can organize the results in the following ways:
 *
 * - Use the `filters` field to filter the results and the `sortBy` field to specify the values by which to sort the results.
 *
 * - Use the `maxResults` field to limit the number of results to return in a single response and the `nextToken` field to return the next batch of results if the response does not return the full set of results.
 */
export const listSessionAnalyticsData: {
  (
    input: ListSessionAnalyticsDataRequest,
  ): effect.Effect<
    ListSessionAnalyticsDataResponse,
    | InternalServerException
    | PreconditionFailedException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSessionAnalyticsDataRequest,
  ) => stream.Stream<
    ListSessionAnalyticsDataResponse,
    | InternalServerException
    | PreconditionFailedException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSessionAnalyticsDataRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | PreconditionFailedException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSessionAnalyticsDataRequest,
  output: ListSessionAnalyticsDataResponse,
  errors: [
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves summary metrics for the user sessions with your bot. The following fields are required:
 *
 * - `metrics` – A list of AnalyticsSessionMetric objects. In each object, use the `name` field to specify the metric to calculate, the `statistic` field to specify whether to calculate the `Sum`, `Average`, or `Max` number, and the `order` field to specify whether to sort the results in `Ascending` or `Descending` order.
 *
 * - `startDateTime` and `endDateTime` – Define a time range for which you want to retrieve results.
 *
 * Of the optional fields, you can organize the results in the following ways:
 *
 * - Use the `filters` field to filter the results, the `groupBy` field to specify categories by which to group the results, and the `binBy` field to specify time intervals by which to group the results.
 *
 * - Use the `maxResults` field to limit the number of results to return in a single response and the `nextToken` field to return the next batch of results if the response does not return the full set of results.
 *
 * Note that an `order` field exists in both `binBy` and `metrics`. Currently, you can specify it in either field, but not in both.
 */
export const listSessionMetrics: {
  (
    input: ListSessionMetricsRequest,
  ): effect.Effect<
    ListSessionMetricsResponse,
    | InternalServerException
    | PreconditionFailedException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSessionMetricsRequest,
  ) => stream.Stream<
    ListSessionMetricsResponse,
    | InternalServerException
    | PreconditionFailedException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSessionMetricsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | PreconditionFailedException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSessionMetricsRequest,
  output: ListSessionMetricsResponse,
  errors: [
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * To use this API operation, your IAM role must have permissions to
 * perform the ListAggregatedUtterances operation, which provides access to
 * utterance-related analytics. See Viewing utterance
 * statistics for the IAM policy to apply to the IAM role.
 *
 * Retrieves a list of metadata for individual user utterances to your bot. The following fields are required:
 *
 * - `startDateTime` and `endDateTime` – Define a time range for which you want to retrieve results.
 *
 * Of the optional fields, you can organize the results in the following ways:
 *
 * - Use the `filters` field to filter the results and the `sortBy` field to specify the values by which to sort the results.
 *
 * - Use the `maxResults` field to limit the number of results to return in a single response and the `nextToken` field to return the next batch of results if the response does not return the full set of results.
 */
export const listUtteranceAnalyticsData: {
  (
    input: ListUtteranceAnalyticsDataRequest,
  ): effect.Effect<
    ListUtteranceAnalyticsDataResponse,
    | InternalServerException
    | PreconditionFailedException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListUtteranceAnalyticsDataRequest,
  ) => stream.Stream<
    ListUtteranceAnalyticsDataResponse,
    | InternalServerException
    | PreconditionFailedException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListUtteranceAnalyticsDataRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | PreconditionFailedException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListUtteranceAnalyticsDataRequest,
  output: ListUtteranceAnalyticsDataResponse,
  errors: [
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * To use this API operation, your IAM role must have permissions to
 * perform the ListAggregatedUtterances operation, which provides access to
 * utterance-related analytics. See Viewing utterance
 * statistics for the IAM policy to apply to the IAM role.
 *
 * Retrieves summary metrics for the utterances in your bot. The following fields are required:
 *
 * - `metrics` – A list of AnalyticsUtteranceMetric objects. In each object, use the `name` field to specify the metric to calculate, the `statistic` field to specify whether to calculate the `Sum`, `Average`, or `Max` number, and the `order` field to specify whether to sort the results in `Ascending` or `Descending` order.
 *
 * - `startDateTime` and `endDateTime` – Define a time range for which you want to retrieve results.
 *
 * Of the optional fields, you can organize the results in the following ways:
 *
 * - Use the `filters` field to filter the results, the `groupBy` field to specify categories by which to group the results, and the `binBy` field to specify time intervals by which to group the results.
 *
 * - Use the `maxResults` field to limit the number of results to return in a single response and the `nextToken` field to return the next batch of results if the response does not return the full set of results.
 *
 * Note that an `order` field exists in both `binBy` and `metrics`. Currently, you can specify it in either field, but not in both.
 */
export const listUtteranceMetrics: {
  (
    input: ListUtteranceMetricsRequest,
  ): effect.Effect<
    ListUtteranceMetricsResponse,
    | InternalServerException
    | PreconditionFailedException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListUtteranceMetricsRequest,
  ) => stream.Stream<
    ListUtteranceMetricsResponse,
    | InternalServerException
    | PreconditionFailedException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListUtteranceMetricsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | PreconditionFailedException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListUtteranceMetricsRequest,
  output: ListUtteranceMetricsResponse,
  errors: [
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Starts importing a bot, bot locale, or custom vocabulary from a zip
 * archive that you uploaded to an S3 bucket.
 */
export const startImport: (
  input: StartImportRequest,
) => effect.Effect<
  StartImportResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartImportRequest,
  output: StartImportResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The action to start the generation of test set.
 */
export const startTestSetGeneration: (
  input: StartTestSetGenerationRequest,
) => effect.Effect<
  StartTestSetGenerationResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartTestSetGenerationRequest,
  output: StartTestSetGenerationResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an alias for the specified version of a bot. Use an alias to
 * enable you to change the version of a bot without updating applications
 * that use the bot.
 *
 * For example, you can create an alias called "PROD" that your
 * applications use to call the Amazon Lex bot.
 */
export const createBotAlias: (
  input: CreateBotAliasRequest,
) => effect.Effect<
  CreateBotAliasResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBotAliasRequest,
  output: CreateBotAliasResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a locale in the bot. The locale contains the intents and
 * slot types that the bot uses in conversations with users in the
 * specified language and locale. You must add a locale to a bot before
 * you can add intents and slot types to the bot.
 */
export const createBotLocale: (
  input: CreateBotLocaleRequest,
) => effect.Effect<
  CreateBotLocaleResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBotLocaleRequest,
  output: CreateBotLocaleResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a slot in an intent. A slot is a variable needed to fulfill
 * an intent. For example, an `OrderPizza` intent might need
 * slots for size, crust, and number of pizzas. For each slot, you define
 * one or more utterances that Amazon Lex uses to elicit a response from the
 * user.
 */
export const createSlot: (
  input: CreateSlotRequest,
) => effect.Effect<
  CreateSlotResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSlotRequest,
  output: CreateSlotResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Use this to provide your transcript data, and to start the bot
 * recommendation process.
 */
export const startBotRecommendation: (
  input: StartBotRecommendationRequest,
) => effect.Effect<
  StartBotRecommendationResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartBotRecommendationRequest,
  output: StartBotRecommendationResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an intent.
 *
 * To define the interaction between the user and your bot, you define
 * one or more intents. For example, for a pizza ordering bot you would
 * create an `OrderPizza` intent.
 *
 * When you create an intent, you must provide a name. You can
 * optionally provide the following:
 *
 * - Sample utterances. For example, "I want to order a pizza" and
 * "Can I order a pizza." You can't provide utterances for built-in
 * intents.
 *
 * - Information to be gathered. You specify slots for the
 * information that you bot requests from the user. You can specify
 * standard slot types, such as date and time, or custom slot types
 * for your application.
 *
 * - How the intent is fulfilled. You can provide a Lambda function
 * or configure the intent to return the intent information to your
 * client application. If you use a Lambda function, Amazon Lex invokes
 * the function when all of the intent information is
 * available.
 *
 * - A confirmation prompt to send to the user to confirm an
 * intent. For example, "Shall I order your pizza?"
 *
 * - A conclusion statement to send to the user after the intent is
 * fulfilled. For example, "I ordered your pizza."
 *
 * - A follow-up prompt that asks the user for additional activity.
 * For example, "Do you want a drink with your pizza?"
 */
export const createIntent: (
  input: CreateIntentRequest,
) => effect.Effect<
  CreateIntentResponse,
  | ConflictException
  | InternalServerException
  | PreconditionFailedException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIntentRequest,
  output: CreateIntentResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a list of test execution result items.
 */
export const listTestExecutionResultItems: {
  (
    input: ListTestExecutionResultItemsRequest,
  ): effect.Effect<
    ListTestExecutionResultItemsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTestExecutionResultItemsRequest,
  ) => stream.Stream<
    ListTestExecutionResultItemsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTestExecutionResultItemsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTestExecutionResultItemsRequest,
  output: ListTestExecutionResultItemsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * The list of test set records.
 */
export const listTestSetRecords: {
  (
    input: ListTestSetRecordsRequest,
  ): effect.Effect<
    ListTestSetRecordsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTestSetRecordsRequest,
  ) => stream.Stream<
    ListTestSetRecordsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTestSetRecordsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTestSetRecordsRequest,
  output: ListTestSetRecordsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
